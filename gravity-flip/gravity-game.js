// gravity-game.js — Cavern Stalactite Gravity Runner with 2D Animated Character & Dynamic Cave Biomes

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;

const STATE = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER'
};

// Underground Cave Biome Themes per Level
const CAVE_THEMES = [
    {
        name: 'AMBER LIMESTONE CAVERN',
        bgTop: '#1a1006',
        bgBottom: '#080503',
        rockMain: '#3d2b1f',
        rockHighlight: '#8a6240',
        rockShadow: '#1c130c',
        torchColor: 'rgba(255, 170, 51, 0.25)',
        torchGlow: '#ffa533',
        crystalColor: '#ffd166',
        gemType: 'GOLD'
    },
    {
        name: 'LUMINESCENT CRYSTAL GROTTO',
        bgTop: '#061624',
        bgBottom: '#030a12',
        rockMain: '#1e293b',
        rockHighlight: '#38bdf8',
        rockShadow: '#0f172a',
        torchColor: 'rgba(56, 189, 248, 0.25)',
        torchGlow: '#38bdf8',
        crystalColor: '#a855f7',
        gemType: 'AMETHYST'
    },
    {
        name: 'MAGMA OBSIDIAN CHASM',
        bgTop: '#2b0b05',
        bgBottom: '#0f0402',
        rockMain: '#262626',
        rockHighlight: '#f97316',
        rockShadow: '#171717',
        torchColor: 'rgba(239, 68, 68, 0.3)',
        torchGlow: '#ef4444',
        crystalColor: '#f97316',
        gemType: 'RUBY'
    },
    {
        name: 'BIOLUMINESCENT DEPTHS',
        bgTop: '#041c14',
        bgBottom: '#020d09',
        rockMain: '#132e22',
        rockHighlight: '#10b981',
        rockShadow: '#071710',
        torchColor: 'rgba(16, 185, 129, 0.25)',
        torchGlow: '#10b981',
        crystalColor: '#34d399',
        gemType: 'EMERALD'
    },
    {
        name: 'ANCIENT RUNIC RUINS',
        bgTop: '#160824',
        bgBottom: '#080312',
        rockMain: '#2e1f42',
        rockHighlight: '#c084fc',
        rockShadow: '#150a24',
        torchColor: 'rgba(192, 132, 252, 0.3)',
        torchGlow: '#c084fc',
        crystalColor: '#e879f9',
        gemType: 'RUNE'
    }
];

class CaveGravityRunner {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;

        this.floorY = 510;
        this.ceilY = 90;

        // 2D Character Model State (Spelunker Explorer)
        this.player = {
            x: 160,
            y: this.floorY - 42,
            w: 28,
            h: 42,
            vy: 0,
            gravDir: 1, // 1 = floor, -1 = ceiling
            isGrounded: true,
            angle: 0,
            scaleX: 1,
            scaleY: 1,
            runCycle: 0, // Leg animation cycle
            scarfPoints: [], // Scarf physics trail
            shield: false,
            magnetTimer: 0,
            slowMoTimer: 0,
            headlampAngle: 0.15
        };

        this.gameState = STATE.MENU;
        this.distance = 0;
        this.coins = 0;
        this.flips = 0;
        this.level = 1;
        this.baseSpeed = 4.2;
        this.speed = 4.2;
        this.combo = 1;
        this.highestCombo = 1;

        this.obstacles = [];
        this.collectibles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.caveDust = [];
        this.waterDrops = [];

        this.highScore = parseInt(localStorage.getItem('gravity_highscore') || '0', 10);
        this.totalCoins = parseInt(localStorage.getItem('gravity_total_coins') || '0', 10);

        this.shakeTimer = 0;
        this.spawnTimer = 0;
        this.bgOffset = 0;

        // Initialize Ambient Cave Dust Motes
        for (let i = 0; i < 45; i++) {
            this.caveDust.push({
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                size: Math.random() * 2 + 1,
                vx: -Math.random() * 0.8 - 0.2,
                vy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.6 + 0.2
            });
        }

        this.initInput();
        this.updateHUD();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initInput() {
        const doFlip = () => {
            if (this.gameState === STATE.MENU) {
                this.startGame();
            } else if (this.gameState === STATE.PLAYING) {
                this.flipGravity();
            } else if (this.gameState === STATE.GAMEOVER) {
                this.startGame();
            }
        };

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
                e.preventDefault();
                doFlip();
            }
            if (e.code === 'KeyP' || e.code === 'Escape') {
                if (this.gameState === STATE.PLAYING) this.togglePause();
            }
        });

        this.canvas.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            doFlip();
        });

        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-restart').addEventListener('click', () => this.startGame());
        document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-mute').addEventListener('click', () => {
            const muted = window.gravityAudio.toggleMute();
            document.getElementById('btn-mute').textContent = muted ? '🔇' : '🔊';
        });
    }

    startGame() {
        window.gravityAudio.init();
        window.gravityAudio.startBGM();

        this.gameState = STATE.PLAYING;
        this.distance = 0;
        this.coins = 0;
        this.flips = 0;
        this.level = 1;
        this.baseSpeed = 2.7; // Smooth, accessible, and enjoyable pacing
        this.speed = 2.7;
        this.combo = 1;
        this.highestCombo = 1;

        this.player.y = this.floorY - 42;
        this.player.vy = 0;
        this.player.gravDir = 1;
        this.player.isGrounded = true;
        this.player.shield = false;
        this.player.magnetTimer = 0;
        this.player.slowMoTimer = 0;
        this.player.angle = 0;
        this.player.scarfPoints = [];

        this.obstacles = [];
        this.collectibles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.spawnTimer = 70;

        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
    }

    flipGravity() {
        this.player.gravDir *= -1;
        this.player.isGrounded = false;
        this.player.scaleX = 0.8;
        this.player.scaleY = 1.25;
        this.flips++;
        this.createRockDust(this.player.x + 14, this.player.y + (this.player.gravDir === 1 ? 0 : 42));
        window.gravityAudio.playFlip();
    }

    togglePause() {
        if (this.gameState === STATE.PLAYING) {
            this.gameState = STATE.PAUSED;
            window.gravityAudio.stopBGM();
            document.getElementById('pause-screen').classList.remove('hidden');
        } else if (this.gameState === STATE.PAUSED) {
            this.gameState = STATE.PLAYING;
            window.gravityAudio.startBGM();
            document.getElementById('pause-screen').classList.add('hidden');
        }
    }

    die(reason) {
        if (this.player.shield) {
            // Crystal Shield absorbs fatal rock crash
            this.player.shield = false;
            this.shakeTimer = 20;
            this.createRockExplosion(this.player.x, this.player.y, '#38bdf8');
            this.addFloatingText('CRYSTAL SHIELD BROKEN!', this.player.x, this.player.y - 20, '#38bdf8');
            window.gravityAudio.playShieldBreak();
            this.updatePowerupHUD();
            return;
        }

        this.gameState = STATE.GAMEOVER;
        this.shakeTimer = 35;
        this.createRockExplosion(this.player.x, this.player.y, '#f43f5e');
        window.gravityAudio.playDeath();
        window.gravityAudio.stopBGM();

        if (this.distance > this.bestDistance) {
            this.bestDistance = Math.floor(this.distance);
            localStorage.setItem('gravity_best_dist', this.bestDistance);
        }

        setTimeout(() => {
            const distEl = document.getElementById('res-dist');
            if (distEl) distEl.textContent = Math.floor(this.distance) + 'm';
            const lvlEl = document.getElementById('res-level');
            if (lvlEl) lvlEl.textContent = 'Level ' + this.level;
            const coinEl = document.getElementById('res-coins');
            if (coinEl) coinEl.textContent = this.coins;
            const flipEl = document.getElementById('res-flips');
            if (flipEl) flipEl.textContent = this.flips;
            const comboEl = document.getElementById('res-combo');
            if (comboEl) comboEl.textContent = this.highestCombo + 'x';
            
            const goScreen = document.getElementById('gameover-screen');
            if (goScreen) goScreen.classList.remove('hidden');
        }, 500);
    }

    update() {
        if (this.gameState !== STATE.PLAYING) return;

        // Progressive Cave Biome Level Ups (Every 500m)
        const targetLevel = Math.min(5, Math.floor(this.distance / 500) + 1);
        if (targetLevel > this.level) {
            this.level = targetLevel;
            this.shakeTimer = 18;
            const theme = CAVE_THEMES[(this.level - 1) % CAVE_THEMES.length];
            this.addFloatingText(`ENTERING: ${theme.name}`, CANVAS_WIDTH / 2, 280, theme.torchGlow, 22);
            window.gravityAudio.playLevelUp();
        }

        // Progressive Speed Scaling: The further you go, the faster it gets!
        const distSpeedBonus = Math.min(3.2, this.distance * 0.0009);
        let effectiveSpeed = this.baseSpeed + distSpeedBonus;
        if (this.player.slowMoTimer > 0) {
            this.player.slowMoTimer--;
            effectiveSpeed *= 0.58;
        }
        this.speed = effectiveSpeed;
        this.distance += this.speed * 0.04;
        this.bgOffset += this.speed;

        // Animate Player Running Cycle
        this.player.runCycle += this.speed * 0.07;

        // Soft, controlled Gravity Physics
        const gravAcc = this.player.gravDir * 0.95;
        this.player.vy += gravAcc;
        this.player.y += this.player.vy;

        // Ground / Ceiling Collision
        if (this.player.gravDir === 1 && this.player.y + this.player.h >= this.floorY) {
            this.player.y = this.floorY - this.player.h;
            this.player.vy = 0;
            this.player.isGrounded = true;
            this.player.angle = 0;
            this.player.scaleX = 1;
            this.player.scaleY = 1;
        } else if (this.player.gravDir === -1 && this.player.y <= this.ceilY) {
            this.player.y = this.ceilY;
            this.player.vy = 0;
            this.player.isGrounded = true;
            this.player.angle = Math.PI;
            this.player.scaleX = 1;
            this.player.scaleY = 1;
        } else {
            // Smooth flip spin in air
            this.player.angle += this.player.gravDir * 0.15;
        }

        // Update Scarf Physics Trail
        const neckX = this.player.x + 8;
        const neckY = this.player.gravDir === 1 ? this.player.y + 16 : this.player.y + 26;
        this.player.scarfPoints.unshift({ x: neckX, y: neckY });
        if (this.player.scarfPoints.length > 7) this.player.scarfPoints.pop();

        // Update Ambient Cave Dust
        this.caveDust.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0) d.x = CANVAS_WIDTH + 10;
            if (d.y < this.ceilY) d.y = this.floorY;
            if (d.y > this.floorY) d.y = this.ceilY;
        });

        // Water Drops from Stalactites
        if (Math.random() < 0.08) {
            this.waterDrops.push({
                x: Math.random() * CANVAS_WIDTH,
                y: this.ceilY + 10,
                vy: Math.random() * 3 + 3,
                life: 60
            });
        }
        for (let i = this.waterDrops.length - 1; i >= 0; i--) {
            const drop = this.waterDrops[i];
            drop.y += drop.vy;
            drop.x -= this.speed * 0.4;
            if (drop.y >= this.floorY) {
                this.waterDrops.splice(i, 1);
            }
        }

        // Timers
        if (this.player.magnetTimer > 0) this.player.magnetTimer--;

        // Spawn Procedural Cave Obstacles
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
            this.spawnProceduralCavePattern();
            this.spawnTimer = Math.max(48, Math.floor(105 - this.level * 8));
        }

        // Update Obstacles (Stalagmites, Stalactites, Falling Boulders, Crystal Traps)
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.x -= this.speed;

            // Falling Stalactite Rock Hazard
            if (obs.type === 'FALLING_STALACTITE') {
                if (Math.abs(this.player.x - obs.x) < 220 && !obs.falling) {
                    obs.falling = true;
                    obs.vy = 2.5;
                }
                if (obs.falling) {
                    obs.vy += 0.35;
                    obs.y += obs.vy;
                    if (obs.y + obs.h >= this.floorY) {
                        this.createRockExplosion(obs.x + obs.w / 2, this.floorY, '#94a3b8');
                        this.obstacles.splice(i, 1);
                        continue;
                    }
                }
            }

            // Pendulum Swing Animation
            if (obs.type === 'PENDULUM') {
                obs.swingAngle = Math.sin(Date.now() * 0.003) * 0.7;
            }

            // Remove off-screen obstacles
            if (obs.x + obs.w < -50) {
                this.obstacles.splice(i, 1);
                continue;
            }

            // Check Player Collision with Spikes
            if (this.checkCollision(this.player, obs)) {
                this.die('Obstacle Collision');
                return;
            }
        }

        // Update Collectibles (Gems & Ancient Relics)
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const item = this.collectibles[i];
            item.x -= this.speed;

            // Magnetic Attraction towards Player
            if (this.player.magnetTimer > 0) {
                const dx = (this.player.x + 14) - (item.x + item.w / 2);
                const dy = (this.player.y + 21) - (item.y + item.h / 2);
                const dist = Math.hypot(dx, dy);
                if (dist < 220) {
                    item.x += (dx / dist) * 7.5;
                    item.y += (dy / dist) * 7.5;
                }
            }

            // Collect Item
            if (this.checkCollision(this.player, item)) {
                if (item.type === 'GEM') {
                    this.coins += this.combo;
                    this.combo = Math.min(10, this.combo + 1);
                    this.highestCombo = Math.max(this.highestCombo, this.combo);
                    this.createGemSparkles(item.x + 11, item.y + 11);
                    this.addFloatingText(`+${this.combo}`, item.x, item.y - 12, '#fbbf24', 16);
                    window.gravityAudio.playCoin();
                } else if (item.type === 'SHIELD') {
                    this.player.shield = true;
                    this.addFloatingText('CRYSTAL SHIELD! 🛡️', item.x, item.y - 20, '#38bdf8', 18);
                    window.gravityAudio.playShield();
                    this.updatePowerupHUD();
                } else if (item.type === 'MAGNET') {
                    this.player.magnetTimer = 380;
                    this.addFloatingText('MAGNET PULSE! 🧲', item.x, item.y - 20, '#a855f7', 18);
                    window.gravityAudio.playMagnet();
                    this.updatePowerupHUD();
                } else if (item.type === 'SLOWMO') {
                    this.player.slowMoTimer = 280;
                    this.addFloatingText('SLOW MOTION! ⏱️', item.x, item.y - 20, '#34d399', 18);
                    window.gravityAudio.playSlowMo();
                    this.updatePowerupHUD();
                }
                this.collectibles.splice(i, 1);
                continue;
            }

            // Remove offscreen
            if (item.x + item.w < -50) {
                this.collectibles.splice(i, 1);
            }
        }

        // Update Dust Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        // Update Floating Texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy;
            ft.life--;
            if (ft.life <= 0) this.floatingTexts.splice(i, 1);
        }

        this.updateHUD();
    }

    spawnProceduralCavePattern() {
        const rand = Math.random();
        const startX = CANVAS_WIDTH + 40;

        if (rand < 0.35) {
            // Pattern 1: Floor Stalagmite spike -> Gems safely placed on CEILING path
            const count = Math.random() < 0.5 ? 1 : 2;
            for (let i = 0; i < count; i++) {
                const height = Math.floor(Math.random() * 25) + 40;
                this.obstacles.push({
                    type: 'STALAGMITE',
                    x: startX + i * 36,
                    y: this.floorY - height,
                    w: 36,
                    h: height,
                    shapeSeed: Math.random()
                });
            }
            // Gems appear along the safe ceiling running surface (Player flips to ceiling to collect)
            this.spawnGemArc(startX, this.ceilY + 32, 3);
        } else if (rand < 0.65) {
            // Pattern 2: Ceiling Stalactite spike -> Gems safely placed on FLOOR path
            const count = Math.random() < 0.5 ? 1 : 2;
            for (let i = 0; i < count; i++) {
                const height = Math.floor(Math.random() * 25) + 40;
                this.obstacles.push({
                    type: 'STALACTITE',
                    x: startX + i * 36,
                    y: this.ceilY,
                    w: 36,
                    h: height,
                    shapeSeed: Math.random()
                });
            }
            // Gems appear along the safe floor running surface (Player runs on floor to collect)
            this.spawnGemArc(startX, this.floorY - 44, 3);
        } else if (rand < 0.85) {
            // Pattern 3: Dual Staggered Pinch (Floor spike at start, ceiling spike 150px later)
            this.obstacles.push({
                type: 'STALAGMITE',
                x: startX,
                y: this.floorY - 50,
                w: 38,
                h: 50,
                shapeSeed: 0.2
            });
            this.obstacles.push({
                type: 'STALACTITE',
                x: startX + 160,
                y: this.ceilY,
                w: 38,
                h: 50,
                shapeSeed: 0.8
            });
            // Relic / Gems spawn in the safe mid-air arch between flips
            this.spawnRelic(startX + 80, (this.floorY + this.ceilY) / 2);
            this.spawnGemArc(startX + 40, this.ceilY + 32, 2);
        } else {
            // Pattern 4: Falling Stalactite Rock with safe central crystal pathway
            this.obstacles.push({
                type: 'FALLING_STALACTITE',
                x: startX,
                y: this.ceilY,
                w: 32,
                h: 50,
                vy: 0,
                falling: false,
                shapeSeed: 0.5
            });
            this.spawnGemArc(startX - 60, this.floorY - 44, 3);
        }
    }

    spawnGemArc(x, y, count) {
        for (let i = 0; i < count; i++) {
            const gemX = x + i * 38;
            const gemY = y;

            // Safe validation: Ensure gem is never inside or within 35px of any obstacle spike
            let isInsideSpike = false;
            for (const obs of this.obstacles) {
                if (
                    gemX + 22 > obs.x - 20 &&
                    gemX < obs.x + obs.w + 20 &&
                    gemY + 22 > obs.y - 20 &&
                    gemY < obs.y + obs.h + 20
                ) {
                    isInsideSpike = true;
                    break;
                }
            }

            if (!isInsideSpike) {
                this.collectibles.push({
                    type: 'GEM',
                    x: gemX,
                    y: gemY,
                    w: 22,
                    h: 22
                });
            }
        }
    }

    spawnRelic(x, y) {
        const types = ['SHIELD', 'MAGNET', 'SLOWMO'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        this.collectibles.push({
            type: chosen,
            x, y,
            w: 28,
            h: 28
        });
    }

    checkCollision(p, obj) {
        const pad = 6;
        return (
            p.x + pad < obj.x + obj.w - pad &&
            p.x + p.w - pad > obj.x + pad &&
            p.y + pad < obj.y + obj.h - pad &&
            p.y + p.h - pad > obj.y + pad
        );
    }

    createRockDust(x, y) {
        const theme = CAVE_THEMES[(this.level - 1) % CAVE_THEMES.length];
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 4,
                life: 22,
                color: theme.rockHighlight,
                size: Math.random() * 3 + 1.5
            });
        }
    }

    createGemSparkles(x, y) {
        const theme = CAVE_THEMES[(this.level - 1) % CAVE_THEMES.length];
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 20,
                color: theme.crystalColor,
                size: 3
            });
        }
    }

    createRockExplosion(x, y, color) {
        for (let i = 0; i < 32; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 38,
                color,
                size: Math.random() * 5 + 2
            });
        }
    }

    addFloatingText(text, x, y, color = '#ffffff', size = 16) {
        this.floatingTexts.push({
            text, x, y, color, size,
            vy: -1.2,
            life: 50
        });
    }

    updateHUD() {
        document.getElementById('hud-dist').textContent = Math.floor(this.distance) + 'm';
        document.getElementById('hud-level').textContent = 'LVL ' + this.level;
        document.getElementById('hud-coins').textContent = '💎 ' + this.coins;
        document.getElementById('hud-speed').textContent = '⚡ ' + (this.speed * 10).toFixed(0) + ' KM/H';
    }

    updatePowerupHUD() {
        const strip = document.getElementById('powerup-status-strip');
        strip.innerHTML = '';
        if (this.player.shield) {
            strip.innerHTML += `<span class="status-badge">🛡️ CRYSTAL SHIELD</span>`;
        }
        if (this.player.magnetTimer > 0) {
            strip.innerHTML += `<span class="status-badge" style="border-color: #ffd166; color: #ffd166;">🧲 RELIC MAGNET</span>`;
        }
        if (this.player.slowMoTimer > 0) {
            strip.innerHTML += `<span class="status-badge" style="border-color: #f97316; color: #f97316;">⏱️ CHRONO SLOW-MO</span>`;
        }
    }

    // =========================================================================
    // GRAPHICS ENGINE: CAVE ENVIRONMENT & 2D ANIMATED CHARACTER
    // =========================================================================
    draw() {
        const theme = CAVE_THEMES[(this.level - 1) % CAVE_THEMES.length];
        this.ctx.save();

        // Screen Shake
        if (this.shakeTimer > 0) {
            this.shakeTimer--;
            this.ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
        }

        // 1. Cavern Background Gradient
        const bgGrad = this.ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        bgGrad.addColorStop(0, theme.bgTop);
        bgGrad.addColorStop(0.5, '#08060a');
        bgGrad.addColorStop(1, theme.bgBottom);
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 2. Parallax Distant Cave Formations (Backdrop layer)
        this.ctx.fillStyle = theme.rockShadow;
        const bgShift = (this.bgOffset * 0.3) % 120;
        for (let x = -bgShift; x < CANVAS_WIDTH + 120; x += 120) {
            // Distant ceiling stalactite silhouette
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.ceilY);
            this.ctx.lineTo(x + 40, this.ceilY + 70);
            this.ctx.lineTo(x + 80, this.ceilY);
            this.ctx.fill();

            // Distant floor stalagmite silhouette
            this.ctx.beginPath();
            this.ctx.moveTo(x + 50, this.floorY);
            this.ctx.lineTo(x + 90, this.floorY - 80);
            this.ctx.lineTo(x + 130, this.floorY);
            this.ctx.fill();
        }

        // 3. Ambient Cave Light Torches / Crystal Glows
        const torchShift = (this.bgOffset * 0.5) % 280;
        for (let x = 140 - torchShift; x < CANVAS_WIDTH + 280; x += 280) {
            const glow = this.ctx.createRadialGradient(x, 300, 10, x, 300, 180);
            glow.addColorStop(0, theme.torchColor);
            glow.addColorStop(1, 'transparent');
            this.ctx.fillStyle = glow;
            this.ctx.fillRect(x - 180, 120, 360, 360);
        }

        // 4. Ambient Floating Cave Dust Particles
        this.caveDust.forEach(d => {
            this.ctx.fillStyle = `rgba(255, 220, 180, ${d.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // 5. Water Droplets
        this.ctx.fillStyle = 'rgba(180, 230, 255, 0.75)';
        this.waterDrops.forEach(drop => {
            this.ctx.fillRect(drop.x, drop.y, 2, 5);
        });

        // 6. Draw Textured Cave Ceiling Strata & Floor Bedrock
        this.drawCaveStrata(theme);

        // 7. Draw Collectible Raw Gemstones & Relics
        this.collectibles.forEach(col => {
            this.ctx.save();
            if (col.type === 'GEM') {
                // Sparkling Raw Crystal / Gold Nugget
                this.ctx.fillStyle = theme.crystalColor;
                this.ctx.shadowColor = theme.crystalColor;
                this.ctx.shadowBlur = 12;

                const cx = col.x + col.w/2;
                const cy = col.y + col.h/2;
                this.ctx.beginPath();
                this.ctx.moveTo(cx, cy - 11);
                this.ctx.lineTo(cx + 9, cy - 3);
                this.ctx.lineTo(cx + 6, cy + 9);
                this.ctx.lineTo(cx - 6, cy + 9);
                this.ctx.lineTo(cx - 9, cy - 3);
                this.ctx.closePath();
                this.ctx.fill();

                // Gem Highlight facet
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.moveTo(cx, cy - 9);
                this.ctx.lineTo(cx + 4, cy - 3);
                this.ctx.lineTo(cx - 4, cy - 3);
                this.ctx.closePath();
                this.ctx.fill();
            } else {
                // Power-up Relics
                const icons = { SHIELD: '🛡️', MAGNET: '🧲', SLOWMO: '⏱️' };
                this.ctx.font = '24px Outfit';
                this.ctx.fillText(icons[col.type] || '⭐', col.x, col.y + 22);
            }
            this.ctx.restore();
        });

        // 8. Draw Natural Jagged Stalactites & Stalagmites
        this.obstacles.forEach(obs => {
            this.drawCaveObstacle(obs, theme);
        });

        // 9. Draw 2D Animated Character (The Spelunker)
        if (this.gameState !== STATE.GAMEOVER) {
            this.drawCharacter(theme);
        }

        // 10. Draw Particles
        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // 11. Draw Floating Feedback Texts
        this.floatingTexts.forEach(ft => {
            this.ctx.fillStyle = ft.color;
            this.ctx.font = `bold ${ft.size}px Outfit`;
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = ft.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fillText(ft.text, ft.x, ft.y);
        });

        this.ctx.restore();
    }

    // Draw Rocky Cave Ceiling & Floor with Mineral Layers
    drawCaveStrata(theme) {
        this.ctx.save();

        // Ceil Rock Bedrock
        this.ctx.fillStyle = theme.rockMain;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, this.ceilY);
        // Jagged rocky edge on ceiling
        this.ctx.fillStyle = theme.rockHighlight;
        this.ctx.fillRect(0, this.ceilY - 4, CANVAS_WIDTH, 4);

        // Floor Rock Bedrock
        this.ctx.fillStyle = theme.rockMain;
        this.ctx.fillRect(0, this.floorY, CANVAS_WIDTH, CANVAS_HEIGHT - this.floorY);
        // Jagged rocky top on floor
        this.ctx.fillStyle = theme.rockHighlight;
        this.ctx.fillRect(0, this.floorY, CANVAS_WIDTH, 4);

        // Natural Rocky Bumps along Floor & Ceiling
        this.ctx.fillStyle = theme.rockShadow;
        const bumpShift = (this.bgOffset) % 60;
        for (let x = -bumpShift; x < CANVAS_WIDTH + 60; x += 60) {
            // Ceiling stone bump
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.ceilY);
            this.ctx.lineTo(x + 30, this.ceilY + 12);
            this.ctx.lineTo(x + 60, this.ceilY);
            this.ctx.fill();

            // Floor stone bump
            this.ctx.beginPath();
            this.ctx.moveTo(x + 10, this.floorY);
            this.ctx.lineTo(x + 40, this.floorY - 12);
            this.ctx.lineTo(x + 70, this.floorY);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    // Draw Realistic Jagged Stalactites and Stalagmites
    drawCaveObstacle(obs, theme) {
        this.ctx.save();
        this.ctx.fillStyle = theme.rockHighlight;
        this.ctx.strokeStyle = theme.rockShadow;
        this.ctx.lineWidth = 2;

        if (obs.type === 'STALAGMITE') {
            // Rising jagged limestone stalagmite from ground
            this.ctx.beginPath();
            this.ctx.moveTo(obs.x, obs.y + obs.h);
            this.ctx.lineTo(obs.x + 8, obs.y + obs.h * 0.4);
            this.ctx.lineTo(obs.x + obs.w / 2, obs.y); // Sharp tip
            this.ctx.lineTo(obs.x + obs.w - 8, obs.y + obs.h * 0.5);
            this.ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            // Mineral highlight ridge
            this.ctx.strokeStyle = theme.crystalColor;
            this.ctx.beginPath();
            this.ctx.moveTo(obs.x + obs.w / 2, obs.y);
            this.ctx.lineTo(obs.x + obs.w / 2, obs.y + obs.h);
            this.ctx.stroke();
        } else if (obs.type === 'STALACTITE' || obs.type === 'FALLING_STALACTITE') {
            // Hanging jagged rock spike from ceiling
            this.ctx.beginPath();
            this.ctx.moveTo(obs.x, obs.y);
            this.ctx.lineTo(obs.x + 8, obs.y + obs.h * 0.5);
            this.ctx.lineTo(obs.x + obs.w / 2, obs.y + obs.h); // Sharp down tip
            this.ctx.lineTo(obs.x + obs.w - 8, obs.y + obs.h * 0.4);
            this.ctx.lineTo(obs.x + obs.w, obs.y);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            // Mineral highlight ridge
            this.ctx.strokeStyle = theme.crystalColor;
            this.ctx.beginPath();
            this.ctx.moveTo(obs.x + obs.w / 2, obs.y + obs.h);
            this.ctx.lineTo(obs.x + obs.w / 2, obs.y);
            this.ctx.stroke();
        } else if (obs.type === 'PENDULUM') {
            // Hanging chain & heavy glowing rune crystal
            this.ctx.strokeStyle = '#64748b';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(obs.x + obs.w/2, this.ceilY);
            this.ctx.lineTo(obs.x + obs.w/2, obs.y);
            this.ctx.stroke();

            // Crystal Core
            this.ctx.fillStyle = theme.crystalColor;
            this.ctx.shadowColor = theme.crystalColor;
            this.ctx.shadowBlur = 15;
            this.ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        }

        this.ctx.restore();
    }

    // 2D ANIMATED CHARACTER: Spelunker Cave Runner with Headlamp Beam & Running Legs
    drawCharacter(theme) {
        const p = this.player;
        this.ctx.save();
        this.ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        this.ctx.rotate(p.angle);
        this.ctx.scale(p.scaleX, p.scaleY);

        const cx = 0;
        const cy = 0;

        // 1. Glowing Explorer Headlamp Beam (Lights up the dark cave ahead!)
        const beamAngle = 0.08;
        const beamDist = 280;
        const lampX = cx + 8;
        const lampY = cy - 14;

        const lightGrad = this.ctx.createRadialGradient(lampX, lampY, 5, lampX + 160, lampY, beamDist);
        lightGrad.addColorStop(0, 'rgba(255, 245, 180, 0.45)');
        lightGrad.addColorStop(0.6, 'rgba(255, 230, 140, 0.15)');
        lightGrad.addColorStop(1, 'transparent');

        this.ctx.fillStyle = lightGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(lampX, lampY);
        this.ctx.lineTo(lampX + beamDist, lampY - Math.tan(beamAngle) * beamDist - 60);
        this.ctx.lineTo(lampX + beamDist, lampY + Math.tan(beamAngle) * beamDist + 60);
        this.ctx.closePath();
        this.ctx.fill();

        // 2. Crystal Shield Barrier
        if (p.shield) {
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.shadowColor = '#38bdf8';
            this.ctx.shadowBlur = 18;
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, 30, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // 3. Flowing Scarf / Cloak Trail
        if (p.scarfPoints.length > 2) {
            this.ctx.strokeStyle = '#f97316';
            this.ctx.lineWidth = 4;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            p.scarfPoints.forEach((pt, idx) => {
                const relX = pt.x - (p.x + p.w/2);
                const relY = pt.y - (p.y + p.h/2);
                if (idx === 0) this.ctx.moveTo(relX, relY);
                else this.ctx.lineTo(relX - idx * 4, relY);
            });
            this.ctx.stroke();
        }

        // 4. Explorer Backpack / Oxygen Pack
        this.ctx.fillStyle = '#475569';
        this.ctx.fillRect(cx - 14, cy - 10, 8, 18);

        // 5. Torso / Adventure Vest
        this.ctx.fillStyle = '#0284c7';
        this.ctx.fillRect(cx - 8, cy - 8, 16, 18);
        // Belt
        this.ctx.fillStyle = '#b45309';
        this.ctx.fillRect(cx - 8, cy + 6, 16, 4);

        // 6. Explorer Helmet & Head
        this.ctx.fillStyle = '#f59e0b'; // Amber hard hat helmet
        this.ctx.beginPath();
        this.ctx.arc(cx + 2, cy - 14, 10, Math.PI, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#fed7aa'; // Face
        this.ctx.fillRect(cx - 5, cy - 14, 14, 8);

        // Headlamp Lamp Unit
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#ffffff';
        this.ctx.shadowBlur = 12;
        this.ctx.fillRect(cx + 6, cy - 17, 5, 5);
        this.ctx.shadowBlur = 0;

        // 7. Animated Kinematic Running Legs
        const legPhase = p.runCycle;
        const leg1Angle = p.isGrounded ? Math.sin(legPhase) * 0.75 : 0.4;
        const leg2Angle = p.isGrounded ? -Math.sin(legPhase) * 0.75 : -0.4;

        // Left Leg
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 3, cy + 10);
        this.ctx.lineTo(cx - 3 + Math.sin(leg1Angle) * 12, cy + 10 + Math.cos(leg1Angle) * 12);
        this.ctx.stroke();

        // Right Leg
        this.ctx.beginPath();
        this.ctx.moveTo(cx + 3, cy + 10);
        this.ctx.lineTo(cx + 3 + Math.sin(leg2Angle) * 12, cy + 10 + Math.cos(leg2Angle) * 12);
        this.ctx.stroke();

        this.ctx.restore();
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new CaveGravityRunner();
});
