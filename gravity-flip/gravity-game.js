// gravity-game.js — Cavern Stalactite Gravity Runner (Pure 2D Canvas Edition)
// Features 2D Animated Character, Dynamic Cavern Biomes, Stalactites, Stalagmites, and Powerups

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
            runCycle: 0,
            scarfPoints: [],
            shield: false,
            invulnerableTimer: 0,
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
        this.bestDistance = parseInt(localStorage.getItem('gravity_best_dist') || '0', 10);

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
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'KeyW') {
                e.preventDefault();
                doFlip();
            }
            if (e.code === 'KeyP' || e.code === 'Escape') {
                if (this.gameState === STATE.PLAYING || this.gameState === STATE.PAUSED) {
                    this.togglePause();
                }
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
        this.baseSpeed = 4.2;
        this.speed = 4.2;
        this.combo = 1;
        this.highestCombo = 1;
        this.gameStartTime = performance.now();

        this.player.y = this.floorY - 42;
        this.player.vy = 0;
        this.player.gravDir = 1;
        this.player.isGrounded = true;
        this.player.shield = false;
        this.player.invulnerableTimer = 0;
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
        if (!this.player.isGrounded) return;
        this.player.gravDir *= -1;
        this.player.isGrounded = false;
        this.player.vy = this.player.gravDir * 4.5;
        this.flips++;
        this.createRockDust(this.player.x + 14, this.player.gravDir === 1 ? this.ceilY : this.floorY);
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
        if (this.player.invulnerableTimer > 0) return;

        if (this.player.shield) {
            this.player.shield = false;
            this.player.invulnerableTimer = 60;
            this.shakeTimer = 20;
            this.createRockExplosion(this.player.x, this.player.y, '#38bdf8');
            this.addFloatingText('CHRONO SHIELD SAVED YOU! 🛡️', this.player.x, this.player.y - 25, '#38bdf8', 18);
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

        // Progressive Level Ups
        const targetLevel = Math.min(5, Math.floor(this.distance / 450) + 1);
        if (targetLevel > this.level) {
            this.level = targetLevel;
            this.shakeTimer = 18;
            const theme = CAVE_THEMES[(this.level - 1) % CAVE_THEMES.length];
            this.addFloatingText(`ENTERING: ${theme.name}`, CANVAS_WIDTH / 2, 280, theme.torchGlow, 22);
            window.gravityAudio.playLevelUp();
        }

        // Speed Progression
        const elapsedSec = (performance.now() - (this.gameStartTime || performance.now())) / 1000;
        const timeSpeedBonus = Math.min(3.8, elapsedSec * 0.045);
        const distSpeedBonus = Math.min(3.5, this.distance * 0.001);
        let effectiveSpeed = this.baseSpeed + timeSpeedBonus + distSpeedBonus;
        
        if (this.player.slowMoTimer > 0) {
            this.player.slowMoTimer--;
            effectiveSpeed *= 0.55;
        }
        this.speed = effectiveSpeed;
        this.distance += this.speed * 0.04;
        this.bgOffset += this.speed;

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
        } else if (this.player.gravDir === -1 && this.player.y <= this.ceilY) {
            this.player.y = this.ceilY;
            this.player.vy = 0;
            this.player.isGrounded = true;
            this.player.angle = Math.PI;
        } else {
            this.player.angle += this.player.gravDir * 0.15;
        }

        // Scarf Physics Trail
        const neckX = this.player.x + 8;
        const neckY = this.player.gravDir === 1 ? this.player.y + 16 : this.player.y + 26;
        this.player.scarfPoints.unshift({ x: neckX, y: neckY });
        if (this.player.scarfPoints.length > 7) this.player.scarfPoints.pop();

        // Cave Dust
        this.caveDust.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0) d.x = CANVAS_WIDTH + 10;
            if (d.y < this.ceilY) d.y = this.floorY;
            if (d.y > this.floorY) d.y = this.ceilY;
        });

        // Water Drops
        if (Math.random() < 0.08) {
            this.waterDrops.push({
                x: Math.random() * CANVAS_WIDTH,
                y: this.ceilY + 10,
                vy: Math.random() * 3 + 3
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
        if (this.player.invulnerableTimer > 0) this.player.invulnerableTimer--;
        if (this.player.magnetTimer > 0) this.player.magnetTimer--;
        if (this.player.slowMoTimer > 0) this.player.slowMoTimer--;

        // Procedural Cave Hazard Spawning
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
            this.spawnProceduralCavePattern();
            const timeReduction = Math.min(25, elapsedSec * 0.25);
            this.spawnTimer = Math.max(34, Math.floor(82 - timeReduction - this.level * 5));
        }

        // Update Obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.x -= this.speed;

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

            if (obs.type === 'ROTATING_SAW') {
                obs.rot = (obs.rot || 0) + 0.14;
            }

            if (obs.x + obs.w < -50) {
                this.obstacles.splice(i, 1);
                continue;
            }

            if (this.checkCollision(this.player, obs)) {
                if (this.player.invulnerableTimer > 0) continue;
                if (this.player.shield) {
                    this.player.shield = false;
                    this.player.invulnerableTimer = 60;
                    this.shakeTimer = 20;
                    this.createRockExplosion(obs.x + obs.w / 2, obs.y + obs.h / 2, '#38bdf8');
                    this.addFloatingText('CHRONO SHIELD SAVED YOU! 🛡️', this.player.x, this.player.y - 25, '#38bdf8', 18);
                    window.gravityAudio.playShieldBreak();
                    this.updatePowerupHUD();
                    this.obstacles.splice(i, 1);
                    continue;
                } else {
                    this.die('Obstacle Collision');
                    return;
                }
            }
        }

        // Update Collectibles
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const item = this.collectibles[i];
            item.x -= this.speed;

            if (this.player.magnetTimer > 0) {
                const dx = (this.player.x + 14) - (item.x + item.w / 2);
                const dy = (this.player.y + 21) - (item.y + item.h / 2);
                const dist = Math.hypot(dx, dy);
                if (dist < 250) {
                    item.x += (dx / dist) * 8.5;
                    item.y += (dy / dist) * 8.5;
                }
            }

            if (this.checkItemPickup(this.player, item)) {
                if (item.type === 'GEM') {
                    this.coins += this.combo;
                    this.combo = Math.min(10, this.combo + 1);
                    this.highestCombo = Math.max(this.highestCombo, this.combo);
                    this.createGemSparkles(item.x + 11, item.y + 11);
                    this.addFloatingText(`+${this.combo}`, item.x, item.y - 12, '#fbbf24', 16);
                    window.gravityAudio.playCoin();
                } else if (item.type === 'SHIELD') {
                    this.player.shield = true;
                    this.addFloatingText('CHRONO SHIELD! 🛡️', item.x, item.y - 20, '#38bdf8', 18);
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

            if (item.x + item.w < -50) {
                this.collectibles.splice(i, 1);
            }
        }

        // Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        // Floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy;
            ft.alpha -= 0.02;
            if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
        }

        this.updateHUD();
    }

    spawnProceduralCavePattern() {
        const rand = Math.random();
        const startX = CANVAS_WIDTH + 40;
        const lvl = this.level;

        if (lvl >= 5 && rand < 0.22) {
            this.obstacles.push({
                type: 'RUNIC_CRUSHER',
                x: startX,
                y: this.ceilY,
                w: 48,
                h: 60,
                baseH: 60,
                dir: 'top',
                phase: 0
            });
            this.obstacles.push({
                type: 'RUNIC_CRUSHER',
                x: startX + 170,
                y: this.floorY - 60,
                w: 48,
                h: 60,
                baseH: 60,
                dir: 'bottom',
                phase: Math.PI
            });
            this.spawnGemArc(startX + 80, (this.floorY + this.ceilY) / 2, 3);
            this.spawnRelic(startX + 220, this.floorY - 30);
        } else if (lvl >= 4 && rand < 0.38) {
            this.obstacles.push({
                type: 'ROTATING_SAW',
                x: startX,
                y: (this.floorY + this.ceilY) / 2 - 26,
                w: 52,
                h: 52,
                rot: 0
            });
            if (Math.random() < 0.5) {
                this.spawnGemArc(startX - 20, this.ceilY + 8, 3);
            } else {
                this.spawnGemArc(startX - 20, this.floorY - 30, 3);
            }
        } else if (lvl >= 3 && rand < 0.52) {
            const isFloor = Math.random() < 0.5;
            this.obstacles.push({
                type: 'MAGMA_JET',
                x: startX,
                y: isFloor ? this.floorY - 65 : this.ceilY,
                w: 38,
                h: 65,
                dir: isFloor ? 'up' : 'down'
            });
            this.spawnGemArc(startX, isFloor ? this.ceilY + 8 : this.floorY - 30, 3);
        } else if (lvl >= 2 && rand < 0.68) {
            const isFloorBeam = Math.random() < 0.5;
            this.obstacles.push({
                type: 'LASER_BARRIER',
                x: startX,
                y: isFloorBeam ? this.floorY - 95 : this.ceilY,
                w: 32,
                h: 95,
                laserTimer: 0,
                side: isFloorBeam ? 'floor' : 'ceiling'
            });
            this.spawnGemArc(startX, isFloorBeam ? this.ceilY + 8 : this.floorY - 30, 3);
            if (Math.random() < 0.35) {
                this.spawnRelic(startX + 90, (this.floorY + this.ceilY) / 2);
            }
        } else if (rand < 0.82) {
            const isCeil = Math.random() < 0.5;
            const count = Math.random() < 0.5 ? 1 : 2;
            for (let i = 0; i < count; i++) {
                const height = Math.floor(Math.random() * 25) + 40;
                this.obstacles.push({
                    type: isCeil ? 'STALACTITE' : 'STALAGMITE',
                    x: startX + i * 36,
                    y: isCeil ? this.ceilY : this.floorY - height,
                    w: 36,
                    h: height,
                    shapeSeed: Math.random()
                });
            }
            this.spawnGemArc(startX, isCeil ? this.floorY - 32 : this.ceilY + 8, 3);
        } else {
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
            this.spawnRelic(startX + 80, (this.floorY + this.ceilY) / 2);
            this.spawnGemArc(startX + 40, (this.floorY + this.ceilY) / 2 - 12, 2);
        }
    }

    spawnGemArc(x, y, count) {
        for (let i = 0; i < count; i++) {
            const gemX = x + i * 38;
            const gemY = y;

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

    checkItemPickup(p, obj) {
        const pickupRadius = 14;
        return (
            p.x < obj.x + obj.w + pickupRadius &&
            p.x + p.w > obj.x - pickupRadius &&
            p.y < obj.y + obj.h + pickupRadius &&
            p.y + p.h > obj.y - pickupRadius
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
        if (!strip) return;
        strip.innerHTML = '';
        if (this.player.shield) {
            strip.innerHTML += `<span class="status-badge" style="border-color: #38bdf8; color: #38bdf8; box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);">🛡️ CHRONO SHIELD</span>`;
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
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.ceilY);
            this.ctx.lineTo(x + 40, this.ceilY + 70);
            this.ctx.lineTo(x + 80, this.ceilY);
            this.ctx.fill();

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

                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.moveTo(cx, cy - 9);
                this.ctx.lineTo(cx + 4, cy - 3);
                this.ctx.lineTo(cx - 4, cy - 3);
                this.ctx.closePath();
                this.ctx.fill();
            } else {
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

    drawCaveStrata(theme) {
        this.ctx.save();
        this.ctx.fillStyle = theme.rockMain;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, this.ceilY);
        this.ctx.fillStyle = theme.rockHighlight;
        this.ctx.fillRect(0, this.ceilY - 4, CANVAS_WIDTH, 4);

        this.ctx.fillStyle = theme.rockMain;
        this.ctx.fillRect(0, this.floorY, CANVAS_WIDTH, CANVAS_HEIGHT - this.floorY);
        this.ctx.fillStyle = theme.rockHighlight;
        this.ctx.fillRect(0, this.floorY, CANVAS_WIDTH, 4);
        this.ctx.restore();
    }

    drawCaveObstacle(obs, theme) {
        this.ctx.save();

        const x = obs.x;
        const y = obs.y;
        const w = obs.w;
        const h = obs.h;

        if (obs.type === 'STALACTITE' || obs.type === 'FALLING_STALACTITE') {
            this.ctx.fillStyle = theme.rockMain;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + w / 2, y + h);
            this.ctx.lineTo(x + w, y);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = theme.rockHighlight;
            this.ctx.beginPath();
            this.ctx.moveTo(x + w / 2, y + h);
            this.ctx.lineTo(x + w, y);
            this.ctx.lineTo(x + w * 0.7, y);
            this.ctx.closePath();
            this.ctx.fill();
        } else if (obs.type === 'STALAGMITE') {
            this.ctx.fillStyle = theme.rockMain;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + h);
            this.ctx.lineTo(x + w / 2, y);
            this.ctx.lineTo(x + w, y + h);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = theme.rockHighlight;
            this.ctx.beginPath();
            this.ctx.moveTo(x + w / 2, y);
            this.ctx.lineTo(x + w, y + h);
            this.ctx.lineTo(x + w * 0.7, y + h);
            this.ctx.closePath();
            this.ctx.fill();
        } else if (obs.type === 'ROTATING_SAW') {
            this.ctx.translate(x + w / 2, y + h / 2);
            this.ctx.rotate(obs.rot || 0);

            this.ctx.fillStyle = '#ef4444';
            this.ctx.shadowColor = '#ef4444';
            this.ctx.shadowBlur = 12;
            this.ctx.beginPath();
            const teeth = 8;
            for (let i = 0; i < teeth * 2; i++) {
                const r = i % 2 === 0 ? w / 2 : w / 4;
                const a = (i * Math.PI) / teeth;
                this.ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 6, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (obs.type === 'RUNIC_CRUSHER') {
            this.ctx.fillStyle = theme.rockHighlight;
            this.ctx.strokeStyle = theme.torchGlow;
            this.ctx.lineWidth = 3;
            this.ctx.fillRect(x, y, w, h);
            this.ctx.strokeRect(x, y, w, h);
        } else if (obs.type === 'MAGMA_JET') {
            const grad = this.ctx.createLinearGradient(x, y, x, y + h);
            grad.addColorStop(0, '#ef4444');
            grad.addColorStop(0.5, '#f97316');
            grad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(x, y, w, h);
        } else if (obs.type === 'LASER_BARRIER') {
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.shadowColor = '#38bdf8';
            this.ctx.shadowBlur = 15;
            this.ctx.lineWidth = 6;
            this.ctx.beginPath();
            this.ctx.moveTo(x + w / 2, y);
            this.ctx.lineTo(x + w / 2, y + h);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawCharacter(theme) {
        const p = this.player;
        this.ctx.save();

        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;

        this.ctx.translate(cx, cy);
        this.ctx.rotate(p.angle);

        // Ambient Soft Headlamp Glow
        const flashGrad = this.ctx.createRadialGradient(10, -5, 2, 90, 0, 75);
        flashGrad.addColorStop(0, 'rgba(255, 245, 192, 0.35)');
        flashGrad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = flashGrad;
        this.ctx.beginPath();
        this.ctx.arc(10, -5, 75, -0.4, 0.4);
        this.ctx.lineTo(10, -5);
        this.ctx.closePath();
        this.ctx.fill();

        // Shield Bubble
        if (p.shield) {
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
            this.ctx.shadowColor = '#38bdf8';
            this.ctx.shadowBlur = 16;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 28, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }

        // Animated Scarf Physics Trail
        if (p.scarfPoints && p.scarfPoints.length > 0) {
            this.ctx.strokeStyle = '#f97316';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(-4, -6);
            for (let i = 0; i < 5; i++) {
                this.ctx.lineTo(-10 - i * 5, -6 + Math.sin(p.runCycle + i * 0.5) * 3);
            }
            this.ctx.stroke();
        }

        // Oxygen Backpack / Jetpack
        this.ctx.fillStyle = '#334155';
        this.ctx.fillRect(-14, -12, 7, 18);

        // Body Torso / Blue Tech Suit
        this.ctx.fillStyle = '#0284c7';
        this.ctx.fillRect(-7, -10, 14, 18);

        // Gold Utility Belt
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.fillRect(-7, 4, 14, 4);

        // Head / Skin
        this.ctx.fillStyle = '#fed7aa';
        this.ctx.fillRect(-5, -20, 10, 8);

        // Spelunker Helmet (Bright Yellow / Amber)
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.beginPath();
        this.ctx.arc(0, -18, 9, Math.PI, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillRect(-9, -19, 18, 3);

        // Visor / Headlamp Spotlight Unit
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillRect(2, -18, 5, 4);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#ffffff';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(5, -17, 3, 3);
        this.ctx.shadowBlur = 0;

        // Animated Running Legs
        const legPhase = p.runCycle;
        const leg1Angle = p.isGrounded ? Math.sin(legPhase) * 0.7 : 0.3;
        const leg2Angle = p.isGrounded ? -Math.sin(legPhase) * 0.7 : -0.3;

        // Left Leg
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(-3, 8);
        this.ctx.lineTo(-3 + Math.sin(leg1Angle) * 10, 8 + Math.cos(leg1Angle) * 10);
        this.ctx.stroke();

        // Right Leg
        this.ctx.beginPath();
        this.ctx.moveTo(3, 8);
        this.ctx.lineTo(3 + Math.sin(leg2Angle) * 10, 8 + Math.cos(leg2Angle) * 10);
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
