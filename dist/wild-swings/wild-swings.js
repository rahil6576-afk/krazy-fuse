// Wild Swings: Hook & Flight — Core Physics & Game Engine
import { wildAudio } from './wild-swings-audio.js';

class WildSwingsGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Display & DPI setup
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Game State
    this.gameState = 'menu'; // 'menu' | 'playing' | 'paused' | 'level_cleared' | 'game_over'
    this.theme = localStorage.getItem('wild_swings_theme') || 'spiderman'; // 'spiderman' | 'monkey' | 'human'
    this.currentLevel = parseInt(localStorage.getItem('wild_swings_level') || '1', 10);
    this.unlockedLevels = parseInt(localStorage.getItem('wild_swings_unlocked') || '1', 10);
    this.isEndless = false;
    this.endlessDistance = 0;
    this.bestEndless = parseInt(localStorage.getItem('wild_swings_best_endless') || '0', 10);

    // Player Physics State
    this.player = {
      x: 100,
      y: 300,
      vx: 0,
      vy: 0,
      radius: 16,
      angle: 0,
      rotSpeed: 0,
      isHooked: false,
      hookTarget: null,
      hookLength: 0,
      hookAngle: 0,
      hookAngularVel: 0,
      stuntFlips: 0,
      consecutiveFlips: 0,
      totalStunts: 0,
      alive: true,
      trail: [],
    };

    // Physics Constants (Relaxed, accessible swing pacing)
    this.gravity = 0.16;
    this.airResistance = 0.998;
    this.maxSpeed = 10.5;
    this.hookMaxRange = 360;
    this.isHoldingInput = false;

    // Camera
    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      zoom: 1,
    };

    // Level Elements
    this.levelData = null;
    this.anchors = [];
    this.trampolines = [];
    this.hazards = [];
    this.boosters = [];
    this.finishLine = { x: 2000, y: 300, width: 40, height: 400 };

    // Particles & Visual FX
    this.particles = [];
    this.confetti = [];
    this.bgStars = [];
    this.cityBuildings = [];
    this.jungleVines = [];

    this.levelStartTime = 0;
    this.levelTime = 0;

    this.initVisualBackdrops();
    this.bindEvents();
    this.resize();
    this.loadLevel(this.currentLevel);

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // Pre-generate rich background layers
  initVisualBackdrops() {
    // NYC Skyline Buildings
    this.cityBuildings = [];
    for (let i = 0; i < 45; i++) {
      this.cityBuildings.push({
        x: i * 180 + (Math.random() * 60 - 30),
        width: 110 + Math.random() * 100,
        height: 300 + Math.random() * 380,
        layer: (i % 3) + 1, // 1: far, 2: mid, 3: close
        windowsLit: Math.random() > 0.3,
        hasAntenna: Math.random() > 0.6,
        colorHue: 220 + Math.random() * 40,
      });
    }

    // Stars / Atmospheric Glow Points
    this.bgStars = [];
    for (let i = 0; i < 120; i++) {
      this.bgStars.push({
        x: Math.random() * 4000,
        y: Math.random() * 1200,
        radius: 0.8 + Math.random() * 1.8,
        opacity: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.02 + Math.random() * 0.05,
      });
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    const handleDown = (e) => {
      if (e.target.closest('.modal-overlay') || e.target.closest('.hud-btn') || e.target.closest('button') || e.target.closest('a')) {
        return;
      }
      this.isHoldingInput = true;
      if (this.gameState === 'menu') {
        this.startGame();
      } else if (this.gameState === 'playing') {
        this.tryHook();
      }
    };

    const handleUp = (e) => {
      this.isHoldingInput = false;
      if (this.gameState === 'playing') {
        this.releaseHook();
      }
    };

    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    window.addEventListener('touchstart', (e) => {
      handleDown(e);
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      handleUp(e);
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!this.isHoldingInput) {
          this.isHoldingInput = true;
          if (this.gameState === 'menu') {
            this.startGame();
          } else if (this.gameState === 'playing') {
            this.tryHook();
          }
        }
      } else if (e.code === 'KeyR') {
        this.restartLevel();
      } else if (e.code === 'Escape') {
        this.togglePause();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isHoldingInput = false;
        if (this.gameState === 'playing') {
          this.releaseHook();
        }
      }
    });
  }

  setTheme(newTheme) {
    this.theme = newTheme;
    localStorage.setItem('wild_swings_theme', newTheme);
    this.updateHUDThemeDisplay();
  }

  updateHUDThemeDisplay() {
    const badge = document.getElementById('hud-theme-text');
    if (badge) {
      const names = {
        spiderman: '🕷️ SPIDER-MAN',
        monkey: '🐒 JUNGLE MONKEY',
        human: '🥷 ACROBATIC NINJA',
      };
      badge.textContent = names[this.theme] || 'THEME';
    }
  }

  // Hook Targeting & Attachment
  findBestAnchor() {
    let best = null;
    let minScore = Infinity;

    for (const a of this.anchors) {
      const dx = a.x - this.player.x;
      const dy = a.y - this.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Prioritize anchors slightly ahead and above the player
      if (dist <= this.hookMaxRange) {
        // Forward bias: anchors in front (dx > -30) are prioritized
        const forwardScore = dist - (dx > 0 ? 80 : -40);
        if (forwardScore < minScore) {
          minScore = forwardScore;
          best = a;
        }
      }
    }

    return best;
  }

  tryHook() {
    if (!this.player.alive || this.player.isHooked) return;

    const target = this.findBestAnchor();
    if (!target) return;

    const dx = this.player.x - target.x;
    const dy = this.player.y - target.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    this.player.isHooked = true;
    this.player.hookTarget = target;
    this.player.hookLength = Math.max(40, length);
    this.player.hookAngle = Math.atan2(dy, dx);

    // Tangential speed calculation
    const currentSpeed = Math.sqrt(this.player.vx * this.player.vx + this.player.vy * this.player.vy);
    const tangentialVel = (-Math.sin(this.player.hookAngle) * this.player.vx + Math.cos(this.player.hookAngle) * this.player.vy);
    this.player.hookAngularVel = tangentialVel / this.player.hookLength;

    // Minimum swing angular kick so player always gains dynamic momentum
    if (Math.abs(this.player.hookAngularVel) < 0.03) {
      this.player.hookAngularVel = this.player.vx >= 0 ? 0.05 : -0.05;
    }

    wildAudio.playHookAttach(this.theme);
    this.spawnWebSparks(target.x, target.y);
  }

  releaseHook() {
    if (!this.player.isHooked) return;

    const angSpeed = this.player.hookAngularVel;
    const r = this.player.hookLength;
    const theta = this.player.hookAngle;

    // Convert angular velocity back to linear velocity with launch boost
    let vx = -r * Math.sin(theta) * angSpeed;
    let vy = r * Math.cos(theta) * angSpeed;

    // Aerodynamic forward launch bonus
    const launchBonus = 1.14;
    vx *= launchBonus;
    vy *= launchBonus;

    // Cap velocity
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > this.maxSpeed) {
      const scale = this.maxSpeed / speed;
      vx *= scale;
      vy *= scale;
    }

    this.player.vx = vx;
    this.player.vy = vy;
    this.player.isHooked = false;
    this.player.hookTarget = null;

    wildAudio.playHookRelease(angSpeed * 100);
  }

  // Level Generator
  loadLevel(levelNum) {
    this.currentLevel = levelNum;
    this.isEndless = (levelNum === 'endless');
    this.levelStartTime = performance.now();

    this.player.x = 120;
    this.player.y = 350;
    this.player.vx = 7;
    this.player.vy = -3;
    this.player.angle = 0;
    this.player.rotSpeed = 0;
    this.player.isHooked = false;
    this.player.hookTarget = null;
    this.player.stuntFlips = 0;
    this.player.consecutiveFlips = 0;
    this.player.totalStunts = 0;
    this.player.alive = true;
    this.player.trail = [];

    this.particles = [];
    this.confetti = [];

    this.buildLevelLayout(levelNum);
    this.updateHUD();
  }

  buildLevelLayout(lvl) {
    this.anchors = [];
    this.trampolines = [];
    this.hazards = [];
    this.boosters = [];

    if (this.isEndless) {
      this.finishLine = { x: 999999, y: 200, width: 40, height: 600 };
      this.generateProceduralEndlessChunk(0, 3000);
      return;
    }

    // 20 Handcrafted Campaign Levels with escalating complexity
    const levelLength = 1200 + lvl * 420;
    this.finishLine = { x: levelLength, y: 150, width: 45, height: 550 };

    let curX = 260;
    const spacing = Math.max(220, 340 - Math.min(lvl * 5, 100));

    let anchorIdx = 0;
    while (curX < levelLength - 200) {
      const anchorY = 180 + Math.sin(anchorIdx * 1.2) * 80 + (lvl > 8 ? (Math.random() * 60 - 30) : 0);
      const isMoving = lvl >= 6 && (anchorIdx % 3 === 0);

      this.anchors.push({
        id: `a-${anchorIdx}`,
        x: curX,
        y: anchorY,
        baseY: anchorY,
        radius: 18,
        moving: isMoving,
        moveSpeed: 0.03 + (lvl * 0.005),
        moveRange: 60 + Math.min(lvl * 4, 80),
        angleOffset: anchorIdx * 1.5,
      });

      // Trampolines below anchors for recovery & bounce combos
      if (anchorIdx % 2 === 1 || lvl <= 4) {
        this.trampolines.push({
          x: curX - 60,
          y: Math.min(550, anchorY + 280),
          width: 90,
          height: 22,
          bouncePower: 18 + Math.min(lvl * 0.4, 6),
          pressed: 0,
        });
      }

      // Add Lasers and Hazard Obstacles as level increases
      if (lvl >= 7 && anchorIdx > 1 && anchorIdx % 2 === 0) {
        this.hazards.push({
          type: 'laser',
          x: curX - 110,
          y: anchorY - 40,
          width: 14,
          height: 240,
          phase: anchorIdx * 0.8,
        });
      }

      if (lvl >= 11 && anchorIdx % 4 === 1) {
        this.hazards.push({
          type: 'saw',
          x: curX + 100,
          y: anchorY + 120,
          radius: 28,
          rot: 0,
        });
      }

      // Speed Boost Portals on high levels
      if (lvl >= 10 && anchorIdx % 5 === 2) {
        this.boosters.push({
          x: curX + 70,
          y: anchorY + 30,
          radius: 26,
        });
      }

      curX += spacing;
      anchorIdx++;
    }

    // Safety bouncers at start
    this.trampolines.unshift({
      x: 100,
      y: 520,
      width: 120,
      height: 22,
      bouncePower: 20,
      pressed: 0,
    });
  }

  generateProceduralEndlessChunk(startX, endX) {
    let curX = startX + 280;
    let idx = this.anchors.length;

    while (curX < endX) {
      const anchorY = 160 + Math.sin(idx * 0.9) * 100;
      this.anchors.push({
        id: `ea-${idx}`,
        x: curX,
        y: anchorY,
        baseY: anchorY,
        radius: 18,
        moving: idx % 3 === 0,
        moveSpeed: 0.04,
        moveRange: 70,
        angleOffset: idx,
      });

      if (idx % 2 === 0) {
        this.trampolines.push({
          x: curX - 50,
          y: 540,
          width: 90,
          height: 22,
          bouncePower: 21,
          pressed: 0,
        });
      }

      if (idx > 3 && idx % 3 === 1) {
        this.hazards.push({
          type: 'laser',
          x: curX - 80,
          y: anchorY - 20,
          width: 14,
          height: 220,
          phase: idx * 0.8,
        });
      }

      curX += 260 + Math.random() * 60;
      idx++;
    }
  }

  // Main Physics & State Loop
  update(dt) {
    if (this.gameState !== 'playing') return;

    this.levelTime = (performance.now() - this.levelStartTime) / 1000;

    // 1. Moving Anchor Points Update
    for (const a of this.anchors) {
      if (a.moving) {
        a.angleOffset += a.moveSpeed;
        a.y = a.baseY + Math.sin(a.angleOffset) * a.moveRange;
      }
    }

    // 2. Player Hooked Pendulum Motion vs Free Air Motion
    if (this.player.isHooked && this.player.hookTarget) {
      const a = this.player.hookTarget;
      const r = this.player.hookLength;

      // Angular acceleration: d2Theta = (-g / r) * cos(theta)
      const angularAcc = (-this.gravity / r) * Math.cos(this.player.hookAngle);
      this.player.hookAngularVel += angularAcc;
      this.player.hookAngularVel *= 0.998; // gentle rope damping

      this.player.hookAngle += this.player.hookAngularVel;

      // Update player position on the circular swing arc
      this.player.x = a.x + r * Math.cos(this.player.hookAngle);
      this.player.y = a.y + r * Math.sin(this.player.hookAngle);

      // Tangential velocity representation
      this.player.vx = -r * Math.sin(this.player.hookAngle) * this.player.hookAngularVel;
      this.player.vy = r * Math.cos(this.player.hookAngle) * this.player.hookAngularVel;

      // Rotation matches swing tension
      this.player.angle = this.player.hookAngle + Math.PI / 2;
    } else {
      // Free flight: gravity & air resistance
      this.player.vy += this.gravity;
      this.player.vx *= this.airResistance;
      this.player.vy *= this.airResistance;

      this.player.x += this.player.vx;
      this.player.y += this.player.vy;

      // Dynamic mid-air flips
      const flightSpeed = Math.sqrt(this.player.vx * this.player.vx + this.player.vy * this.player.vy);
      this.player.rotSpeed = (this.player.vx * 0.04);
      this.player.angle += this.player.rotSpeed;

      // Detect 360-degree stunt flips
      if (Math.abs(this.player.angle) > Math.PI * 2) {
        this.player.angle %= (Math.PI * 2);
        this.player.stuntFlips++;
        this.player.totalStunts++;
        wildAudio.playStuntFlip();
        this.showStuntNotification();
        this.spawnStuntSparkles(this.player.x, this.player.y);
      }
    }

    // Motion trail for speed feel
    if (Math.hypot(this.player.vx, this.player.vy) > 8) {
      this.player.trail.push({ x: this.player.x, y: this.player.y, alpha: 0.8 });
      if (this.player.trail.length > 14) this.player.trail.shift();
    } else if (this.player.trail.length > 0) {
      this.player.trail.shift();
    }

    for (const t of this.player.trail) t.alpha *= 0.9;

    // 3. Trampoline Bouncer Collisions
    for (const pad of this.trampolines) {
      if (pad.pressed > 0) pad.pressed *= 0.85;

      const px = this.player.x;
      const py = this.player.y + this.player.radius;

      if (
        px >= pad.x &&
        px <= pad.x + pad.width &&
        py >= pad.y - 12 &&
        py <= pad.y + pad.height &&
        this.player.vy > 0
      ) {
        // High bounce upward & forward
        this.player.y = pad.y - this.player.radius - 2;
        this.player.vy = -pad.bouncePower;
        this.player.vx = Math.max(this.player.vx * 1.15, 8);
        pad.pressed = 12;

        wildAudio.playBounce(pad.bouncePower / 20);
        this.spawnBounceShockwave(pad.x + pad.width / 2, pad.y);
        break;
      }
    }

    // 4. Boost Ring Portals
    for (const b of this.boosters) {
      const dx = this.player.x - b.x;
      const dy = this.player.y - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < b.radius + this.player.radius) {
        this.player.vx = Math.max(this.player.vx * 1.5, 22);
        this.player.vy = -8;
        wildAudio.playStuntFlip();
        this.spawnStuntSparkles(b.x, b.y);
      }
    }

    // 5. Hazard Collisions (Lasers / Saws / Fall Death)
    for (const h of this.hazards) {
      if (h.type === 'laser') {
        if (
          this.player.x + this.player.radius >= h.x &&
          this.player.x - this.player.radius <= h.x + h.width &&
          this.player.y + this.player.radius >= h.y &&
          this.player.y - this.player.radius <= h.y + h.height
        ) {
          this.killPlayer();
          return;
        }
      } else if (h.type === 'saw') {
        h.rot += 0.15;
        const dx = this.player.x - h.x;
        const dy = this.player.y - h.y;
        if (Math.sqrt(dx * dx + dy * dy) < h.radius + this.player.radius) {
          this.killPlayer();
          return;
        }
      }
    }

    // Fall below bottom bounds
    if (this.player.y > this.height + 400 || (this.player.x > 300 && this.player.y > 800)) {
      this.killPlayer();
      return;
    }

    // 6. Finish Line Check
    if (this.player.x >= this.finishLine.x && !this.isEndless) {
      this.completeLevel();
      return;
    }

    // Endless procedural spawning
    if (this.isEndless) {
      this.endlessDistance = Math.max(this.endlessDistance, Math.round(this.player.x / 10));
      const lastAnchor = this.anchors[this.anchors.length - 1];
      if (lastAnchor && this.player.x > lastAnchor.x - 1400) {
        this.generateProceduralEndlessChunk(lastAnchor.x, lastAnchor.x + 2500);
      }
    }

    // 7. Smooth Camera Tracking
    const lookAheadX = this.player.vx * 16;
    const targetCamX = this.player.x - this.width * 0.35 + lookAheadX;
    const targetCamY = this.player.y - this.height * 0.5;

    this.camera.x += (targetCamX - this.camera.x) * 0.12;
    this.camera.y += (targetCamY - this.camera.y) * 0.08;

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }

    // Update Confetti
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.2;
      c.rot += c.rotSpeed;
      c.alpha -= 0.008;
      if (c.alpha <= 0) this.confetti.splice(i, 1);
    }

    this.updateHUD();
  }

  killPlayer() {
    if (!this.player.alive) return;
    this.player.alive = false;
    wildAudio.playDeath();
    this.spawnDeathExplosion(this.player.x, this.player.y);

    setTimeout(() => {
      this.loadLevel(this.currentLevel);
    }, 600);
  }

  completeLevel() {
    this.gameState = 'level_cleared';
    wildAudio.playVictory();
    this.spawnVictoryConfetti(this.finishLine.x, this.finishLine.y);

    if (this.currentLevel >= this.unlockedLevels && this.currentLevel < 20) {
      this.unlockedLevels = this.currentLevel + 1;
      localStorage.setItem('wild_swings_unlocked', this.unlockedLevels.toString());
    }

    const modal = document.getElementById('victory-modal');
    if (modal) {
      const title = document.getElementById('vic-title');
      const timeVal = document.getElementById('vic-time');
      const stuntsVal = document.getElementById('vic-stunts');
      if (title) title.textContent = `LEVEL ${this.currentLevel} CLEARED!`;
      if (timeVal) timeVal.textContent = `${this.levelTime.toFixed(1)}s`;
      if (stuntsVal) stuntsVal.textContent = `${this.player.totalStunts} Flips`;
      modal.classList.add('active');
    }
  }

  showStuntNotification() {
    const badge = document.getElementById('stunt-combo-badge');
    if (badge) {
      badge.textContent = `⚡ FLIP ×${this.player.stuntFlips}!`;
      badge.classList.add('active');
      setTimeout(() => badge.classList.remove('active'), 1000);
    }
  }

  spawnWebSparks(x, y) {
    const count = 12;
    const color = this.theme === 'spiderman' ? '#ffffff' : this.theme === 'monkey' ? '#10b981' : '#00f0ff';
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 3,
        color,
        alpha: 1,
        decay: 0.04 + Math.random() * 0.03,
      });
    }
  }

  spawnStuntSparkles(x, y) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 3 + Math.random() * 4,
        color: ['#ffd700', '#ff007f', '#00f0ff'][i % 3],
        alpha: 1,
        decay: 0.03,
      });
    }
  }

  spawnBounceShockwave(x, y) {
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        x: x + (Math.random() * 80 - 40),
        y: y - 5,
        vx: (Math.random() * 8 - 4),
        vy: -Math.random() * 6 - 2,
        radius: 2.5 + Math.random() * 3,
        color: '#ff3366',
        alpha: 1,
        decay: 0.04,
      });
    }
  }

  spawnDeathExplosion(x, y) {
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 4 + Math.random() * 5,
        color: '#ff0055',
        alpha: 1,
        decay: 0.025,
      });
    }
  }

  spawnVictoryConfetti(x, y) {
    const colors = ['#4353ff', '#00f0ff', '#ff3366', '#ffd700', '#10b981', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      this.confetti.push({
        x: x + (Math.random() * 200 - 100),
        y: y + (Math.random() * 200 - 100),
        vx: Math.random() * 14 - 7,
        vy: -Math.random() * 12 - 4,
        width: 8 + Math.random() * 6,
        height: 12 + Math.random() * 8,
        color: colors[i % colors.length],
        rot: Math.random() * 360,
        rotSpeed: Math.random() * 0.2 - 0.1,
        alpha: 1,
      });
    }
  }

  updateHUD() {
    const lvlText = document.getElementById('hud-level-text');
    const trackFill = document.getElementById('progress-track-fill');
    const scoreVal = document.getElementById('hud-score-val');

    if (lvlText) {
      lvlText.textContent = this.isEndless ? 'ENDLESS' : `LEVEL ${this.currentLevel} / 20`;
    }

    if (trackFill) {
      if (this.isEndless) {
        trackFill.style.width = `${Math.min(100, (this.endlessDistance / 1000) * 100)}%`;
      } else {
        const total = this.finishLine.x - 100;
        const progress = Math.max(0, Math.min(100, ((this.player.x - 100) / total) * 100));
        trackFill.style.width = `${progress.toFixed(1)}%`;
      }
    }

    if (scoreVal) {
      if (this.isEndless) {
        scoreVal.textContent = `${this.endlessDistance}m`;
      } else {
        scoreVal.textContent = `${this.player.totalStunts} Flips`;
      }
    }
  }

  // =========================================================================
  // RENDERING ENGINE (Themes, Character Animations, Parallax Backgrounds)
  // =========================================================================
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Themed Parallax Background
    this.renderThemeBackground();

    this.ctx.save();
    // Apply Camera Translation
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // 2. Draw Target Prediction Aim Line
    if (!this.player.isHooked && this.player.alive) {
      const best = this.findBestAnchor();
      if (best) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.setLineDash([6, 6]);
        this.ctx.moveTo(this.player.x, this.player.y);
        this.ctx.lineTo(best.x, best.y);
        this.ctx.strokeStyle = this.theme === 'spiderman' ? 'rgba(255,255,255,0.45)' : this.theme === 'monkey' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(0, 240, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.restore();

        // Highlight ring on active target anchor
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(best.x, best.y, best.radius + 8, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();
        this.ctx.restore();
      }
    }

    // 3. Draw Active Rope / Web / Vine Line
    if (this.player.isHooked && this.player.hookTarget) {
      this.renderHookLine(this.player.x, this.player.y, this.player.hookTarget.x, this.player.hookTarget.y);
    }

    // 4. Draw Anchor Points
    for (const a of this.anchors) {
      this.renderAnchor(a);
    }

    // 5. Draw Trampoline Bouncers
    for (const pad of this.trampolines) {
      this.renderTrampoline(pad);
    }

    // 6. Draw Hazards & Boosters
    for (const h of this.hazards) {
      this.renderHazard(h);
    }

    for (const b of this.boosters) {
      this.renderBooster(b);
    }

    // 7. Draw Finish Line Banner
    if (!this.isEndless) {
      this.renderFinishLine();
    }

    // 8. Draw Player Character
    if (this.player.alive) {
      this.renderPlayer();
    }

    // 9. Draw Particles & Confetti
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    for (const c of this.confetti) {
      this.ctx.save();
      this.ctx.globalAlpha = c.alpha;
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.rot);
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
      this.ctx.restore();
    }

    this.ctx.restore();
  }

  // Theme 1: Spider-Man NYC Dusk / Theme 2: Jungle / Theme 3: Cyber Arena
  renderThemeBackground() {
    const camX = this.camera.x;
    const camY = this.camera.y;

    if (this.theme === 'spiderman') {
      // Midnight NYC Skyline with Searchlights
      const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, '#0c0e29');
      grad.addColorStop(0.6, '#181a44');
      grad.addColorStop(1, '#2d143c');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Twinkling stars
      this.ctx.fillStyle = '#ffffff';
      for (const s of this.bgStars) {
        const sx = ((s.x - camX * 0.05) % (this.width + 400) + this.width + 400) % (this.width + 400) - 200;
        this.ctx.globalAlpha = s.opacity;
        this.ctx.beginPath();
        this.ctx.arc(sx, s.y, s.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.globalAlpha = 1;

      // Parallax Skyscraper Silhouettes
      for (const b of this.cityBuildings) {
        const factor = b.layer === 1 ? 0.12 : b.layer === 2 ? 0.25 : 0.42;
        const bx = b.x - camX * factor;
        const by = this.height - b.height + camY * 0.1;

        if (bx > -200 && bx < this.width + 200) {
          this.ctx.fillStyle = b.layer === 1 ? '#0a0d24' : b.layer === 2 ? '#121738' : '#1c224f';
          this.ctx.fillRect(bx, by, b.width, b.height + 400);

          // Lit Windows Grid
          if (b.windowsLit) {
            this.ctx.fillStyle = 'rgba(255, 230, 150, 0.45)';
            for (let wy = by + 20; wy < by + b.height - 30; wy += 28) {
              for (let wx = bx + 12; wx < bx + b.width - 15; wx += 22) {
                if ((wx + wy) % 7 === 0) {
                  this.ctx.fillRect(wx, wy, 8, 12);
                }
              }
            }
          }
        }
      }
    } else if (this.theme === 'monkey') {
      // Lush Tropical Jungle with Canopy Light Beams
      const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, '#042f1a');
      grad.addColorStop(0.5, '#064e3b');
      grad.addColorStop(1, '#022c22');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Jungle Sunbeams
      this.ctx.save();
      this.ctx.fillStyle = 'rgba(255, 245, 180, 0.05)';
      this.ctx.beginPath();
      this.ctx.moveTo(this.width * 0.3, 0);
      this.ctx.lineTo(this.width * 0.6, 0);
      this.ctx.lineTo(this.width * 0.9, this.height);
      this.ctx.lineTo(this.width * 0.2, this.height);
      this.ctx.fill();
      this.ctx.restore();
    } else {
      // Futuristic Cyber Arena / Neon Stadium
      const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, '#0f051d');
      grad.addColorStop(0.5, '#190a36');
      grad.addColorStop(1, '#090214');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Neon Gridlines
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      this.ctx.lineWidth = 1;
      for (let x = - (camX * 0.3) % 80; x < this.width; x += 80) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }
    }
  }

  renderHookLine(x1, y1, x2, y2) {
    this.ctx.save();
    if (this.theme === 'spiderman') {
      // Glowing White Web Filament
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    } else if (this.theme === 'monkey') {
      // Organic Twisting Jungle Vine
      this.ctx.strokeStyle = '#10b981';
      this.ctx.lineWidth = 4.5;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    } else {
      // High-Tech Neon Laser Cord
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 3.5;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 12;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  renderAnchor(a) {
    this.ctx.save();
    this.ctx.translate(a.x, a.y);

    if (this.theme === 'spiderman') {
      // Neon Spire / Crane Hook
      this.ctx.fillStyle = '#ff3366';
      this.ctx.shadowColor = '#ff3366';
      this.ctx.shadowBlur = 14;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, a.radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, a.radius * 0.45, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.theme === 'monkey') {
      // Jungle Golden Banana / Mossy Branch Orb
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, a.radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.font = '16px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('🍌', 0, 0);
    } else {
      // Cyber Magnetic Ring
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 3.5;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 12;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, a.radius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, a.radius * 0.35, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  renderTrampoline(pad) {
    this.ctx.save();
    const press = pad.pressed || 0;

    // Spring Base Support
    this.ctx.fillStyle = '#475569';
    this.ctx.fillRect(pad.x + 10, pad.y + 8, pad.width - 20, 14);

    // Bouncy Cushion Surface
    this.ctx.fillStyle = '#ff007f';
    this.ctx.shadowColor = '#ff007f';
    this.ctx.shadowBlur = 12;
    this.ctx.beginPath();
    this.ctx.roundRect(pad.x, pad.y + press, pad.width, pad.height - press, 8);
    this.ctx.fill();

    // High-contrast stripe
    this.ctx.fillStyle = '#ffd700';
    this.ctx.fillRect(pad.x + pad.width * 0.35, pad.y + press + 3, pad.width * 0.3, 4);
    this.ctx.restore();
  }

  renderHazard(h) {
    this.ctx.save();
    if (h.type === 'laser') {
      // Pulsing Vertical Red Laser Beam
      this.ctx.fillStyle = 'rgba(255, 0, 60, 0.85)';
      this.ctx.shadowColor = '#ff003c';
      this.ctx.shadowBlur = 16;
      this.ctx.fillRect(h.x, h.y, h.width, h.height);

      // Core white laser beam
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(h.x + 4, h.y, h.width - 8, h.height);
    } else if (h.type === 'saw') {
      this.ctx.translate(h.x, h.y);
      this.ctx.rotate(h.rot);

      this.ctx.fillStyle = '#94a3b8';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, h.radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#ef4444';
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  renderBooster(b) {
    this.ctx.save();
    this.ctx.translate(b.x, b.y);
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 4;
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.shadowBlur = 16;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.font = '20px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('⚡', 0, 0);
    this.ctx.restore();
  }

  renderFinishLine() {
    this.ctx.save();
    const fn = this.finishLine;

    // Checkered Flag Banner
    this.ctx.fillStyle = '#10b981';
    this.ctx.shadowColor = '#10b981';
    this.ctx.shadowBlur = 20;
    this.ctx.fillRect(fn.x, fn.y, fn.width, fn.height);

    this.ctx.fillStyle = '#ffffff';
    for (let y = fn.y; y < fn.y + fn.height; y += 30) {
      this.ctx.fillRect(fn.x, y, fn.width / 2, 15);
      this.ctx.fillRect(fn.x + fn.width / 2, y + 15, fn.width / 2, 15);
    }

    this.ctx.restore();
  }

  // Draw Character: Spider-Man, Monkey, or Human Ninja
  renderPlayer() {
    this.ctx.save();
    this.ctx.translate(this.player.x, this.player.y);
    this.ctx.rotate(this.player.angle);

    const r = this.player.radius;

    if (this.theme === 'spiderman') {
      // ==================== SPIDER-MAN CHARACTER ====================
      // Red & Blue Mask Body
      this.ctx.fillStyle = '#ff1e42';
      this.ctx.shadowColor = 'rgba(255, 30, 66, 0.6)';
      this.ctx.shadowBlur = 14;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r, 0, Math.PI * 2);
      this.ctx.fill();

      // Iconic Large Slanted White Spider-Eyes with Black Rim
      this.ctx.fillStyle = '#000000';
      this.ctx.beginPath();
      this.ctx.ellipse(r * 0.35, -r * 0.25, r * 0.45, r * 0.32, 0.4, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.ellipse(r * 0.35, r * 0.25, r * 0.45, r * 0.32, -0.4, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.ellipse(r * 0.35, -r * 0.25, r * 0.35, r * 0.22, 0.4, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.ellipse(r * 0.35, r * 0.25, r * 0.35, r * 0.22, -0.4, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.theme === 'monkey') {
      // ==================== JUNGLE MONKEY CHARACTER ====================
      // Brown Fur Body
      this.ctx.fillStyle = '#854d0e';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r, 0, Math.PI * 2);
      this.ctx.fill();

      // Tan Face
      this.ctx.fillStyle = '#fed7aa';
      this.ctx.beginPath();
      this.ctx.arc(r * 0.3, 0, r * 0.65, 0, Math.PI * 2);
      this.ctx.fill();

      // Eyes
      this.ctx.fillStyle = '#000000';
      this.ctx.beginPath();
      this.ctx.arc(r * 0.4, -r * 0.2, 3, 0, Math.PI * 2);
      this.ctx.arc(r * 0.4, r * 0.2, 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Curved Monkey Tail
      this.ctx.strokeStyle = '#854d0e';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(-r * 0.8, 0, r * 0.7, 0.5, Math.PI * 1.5, false);
      this.ctx.stroke();
    } else {
      // ==================== ACROBATIC NINJA CHARACTER ====================
      // Sleek Dark Armor
      this.ctx.fillStyle = '#1e293b';
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 12;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r, 0, Math.PI * 2);
      this.ctx.fill();

      // Glowing Cyan Visor Line
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.fillRect(r * 0.1, -r * 0.3, r * 0.65, r * 0.6);

      // Trailing Cyan Scarf
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.beginPath();
      this.ctx.moveTo(-r * 0.6, 0);
      this.ctx.lineTo(-r * 1.6, -r * 0.4);
      this.ctx.lineTo(-r * 1.3, r * 0.4);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  gameLoop(time) {
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  startGame() {
    this.gameState = 'playing';
    const menuModal = document.getElementById('menu-modal');
    if (menuModal) menuModal.classList.remove('active');
    this.loadLevel(this.currentLevel);
  }

  restartLevel() {
    this.loadLevel(this.currentLevel);
  }

  nextLevel() {
    const modal = document.getElementById('victory-modal');
    if (modal) modal.classList.remove('active');

    if (this.currentLevel < 20) {
      this.loadLevel(this.currentLevel + 1);
    } else {
      this.loadLevel('endless');
    }
  }

  togglePause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
      const p = document.getElementById('pause-modal');
      if (p) p.classList.add('active');
    } else if (this.gameState === 'paused') {
      this.gameState = 'playing';
      const p = document.getElementById('pause-modal');
      if (p) p.classList.remove('active');
    }
  }
}

// Global bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.wildSwings = new WildSwingsGame();
});
