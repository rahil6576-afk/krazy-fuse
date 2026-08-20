// Office Escape: Corporate Run - Main Game Engine
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set virtual canvas resolution
canvas.width = 1000;
canvas.height = 600;

// Game State
const GAME_STATE = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER'
};

let currentState = GAME_STATE.MENU;

// High Score and Economy Storage
const storage = {
    get: (key, def) => {
        try {
            const val = localStorage.getItem('office_escape_' + key);
            return val !== null ? JSON.parse(val) : def;
        } catch (e) {
            return def;
        }
    },
    set: (key, val) => {
        try {
            localStorage.setItem('office_escape_' + key, JSON.stringify(val));
        } catch (e) {}
    }
};

let totalCoins = storage.get('coins', 0);
let bestSurvivalTime = storage.get('best_time', 0);
let bestDistance = storage.get('best_dist', 0);
let unlockedAvatars = storage.get('unlocked_avatars', ['devin', 'alex', 'zara']);
let activeAvatarId = storage.get('selected_avatar', 'devin');

// Upgrades
let upgrades = storage.get('upgrades', {
    coffee_duration: 1, // level 1-5
    shield_strength: 1,
    magnet_duration: 1
});

// Avatar Definitions
const AVATARS = {
    devin: {
        id: 'devin',
        name: 'Devin',
        role: 'Junior Dev',
        emoji: '🧑💻',
        perk: 'Double Jump + Coffee Boost',
        color: '#38bdf8',
        hairColor: '#f97316',
        shirtColor: '#0284c7',
        pantsColor: '#1e293b',
        cost: 0,
        hasDoubleJump: true,
        coffeeBonus: 1.5,
        magnetBonus: 1.0,
        dashBonus: 1.0
    },
    alex: {
        id: 'alex',
        name: 'Alex',
        role: 'Overworked Intern',
        emoji: '📋',
        perk: 'Fast Stamina Dash Recharge',
        color: '#10b981',
        hairColor: '#eab308',
        shirtColor: '#10b981',
        pantsColor: '#334155',
        cost: 0,
        hasDoubleJump: false,
        coffeeBonus: 1.0,
        magnetBonus: 1.0,
        dashBonus: 1.6
    },
    zara: {
        id: 'zara',
        name: 'Zara',
        role: 'WFH Legend',
        emoji: '🩳',
        perk: '+75% Coin Magnet Range',
        color: '#ec4899',
        hairColor: '#a855f7',
        shirtColor: '#ec4899',
        pantsColor: '#f43f5e',
        cost: 0,
        hasDoubleJump: false,
        coffeeBonus: 1.0,
        magnetBonus: 1.75,
        dashBonus: 1.0
    },
    morgan: {
        id: 'morgan',
        name: 'Morgan',
        role: 'Quiet Quitter',
        emoji: '🕶️',
        perk: 'Tiny Hitbox & Speed Drift',
        color: '#8b5cf6',
        hairColor: '#475569',
        shirtColor: '#334155',
        pantsColor: '#0f172a',
        cost: 80,
        hasDoubleJump: false,
        coffeeBonus: 1.1,
        magnetBonus: 1.1,
        dashBonus: 1.2,
        hitboxScale: 0.85
    },
    chad: {
        id: 'chad',
        name: 'Chad',
        role: 'Synergy VP',
        emoji: '👔',
        perk: 'Starts with 1 Delegation Shield',
        color: '#f59e0b',
        hairColor: '#e2e8f0',
        shirtColor: '#f59e0b',
        pantsColor: '#1e3a8a',
        cost: 150,
        hasDoubleJump: false,
        coffeeBonus: 1.2,
        magnetBonus: 1.2,
        dashBonus: 1.1,
        startShield: true
    }
};

// Biomes / Office Departments
const BIOMES = [
    { name: 'Cubicle Maze', bg1: '#0f172a', bg2: '#1e293b', accent: '#38bdf8', wallColor: '#1e293b', floorColor: '#334155', distance: 0 },
    { name: 'Conference Zone', bg1: '#172554', bg2: '#1e3a8a', accent: '#60a5fa', wallColor: '#1e3a8a', floorColor: '#1e293b', distance: 500 },
    { name: 'Coffee Pantry', bg1: '#451a03', bg2: '#78350f', accent: '#f59e0b', wallColor: '#78350f', floorColor: '#3d1d07', distance: 1100 },
    { name: 'HR Compliance Dept', bg1: '#4c0519', bg2: '#831843', accent: '#f43f5e', wallColor: '#831843', floorColor: '#4a044e', distance: 1800 },
    { name: 'Executive Corner Suite', bg1: '#3b0764', bg2: '#581c87', accent: '#c084fc', wallColor: '#581c87', floorColor: '#2e1065', distance: 2600 },
    { name: 'The Great Elevator EXIT', bg1: '#022c22', bg2: '#065f46', accent: '#34d399', wallColor: '#065f46', floorColor: '#064e3b', distance: 3500 }
];

// Satirical Corporate Termination Reasons
const DEATH_REASONS = [
    "Trapped in a 2-hour sync that could've been a 1-sentence Slack message.",
    "Drafting reply to 'Per my last email' with unnecessary escalation.",
    "Assigned as the sole owner of 47 unassigned Jira tickets.",
    "Caught heating fish in the shared microwave at 9:02 AM.",
    "Accidentally replied-all to the entire global distribution list.",
    "Forced to attend mandatory uncompensated team bonding karaoke.",
    "Overwhelmed by 18 overlapping calendar invitations at 4:55 PM.",
    "Crushed under the weight of Q3 strategic synergy deliverables.",
    "Hit with an unexpected 'Quick 5 min sync?' right at 5:00 PM.",
    "Lost forever in an infinite loop of 'Let's take this offline'.",
    "Screen-shared personal search history during the Executive All-Hands.",
    "Failed the quarterly compliance phishing test on day 1."
];

// Player Entity
class Player {
    constructor() {
        this.reset();
    }

    reset() {
        const avatar = AVATARS[activeAvatarId] || AVATARS.devin;
        this.avatar = avatar;
        this.width = 46 * (avatar.hitboxScale || 1.0);
        this.height = 70 * (avatar.hitboxScale || 1.0);
        this.standHeight = this.height;
        this.slideHeight = 34 * (avatar.hitboxScale || 1.0);
        this.x = 120;
        this.groundY = 500 - this.standHeight;
        this.y = this.groundY;
        this.vy = 0;
        this.gravity = 0.88;
        this.jumpForce = -17.2; // Generous, satisfying jump clearance
        this.isGrounded = true;
        this.isSliding = false;
        this.slideTimer = 0;
        this.slideDuration = 32; // frames
        this.jumpCount = 0;
        this.maxJumps = avatar.hasDoubleJump ? 2 : 1;
        this.jumpBuffer = 0;
        this.coyoteTimer = 0;

        // Stamina & Dash
        this.stamina = 100;
        this.maxStamina = 100;
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashDuration = 18;

        // Buffs
        this.shield = avatar.startShield ? 1 : 0;
        this.coffeeTimer = 0;
        this.ptoTimer = 0;
        this.invulnerableTimer = 0;

        // Animation
        this.animFrame = 0;
        this.runCycle = 0;
    }

    jump() {
        // If currently sliding, cancel slide instantly and jump
        if (this.isSliding) {
            this.isSliding = false;
            this.slideTimer = 0;
            this.height = this.standHeight;
            this.y = 500 - this.standHeight;
        }

        if (this.isGrounded || this.coyoteTimer > 0) {
            this.vy = this.jumpForce;
            this.isGrounded = false;
            this.coyoteTimer = 0;
            this.jumpCount = 1;
            window.soundManager.playJump();
            createDust(this.x + 20, this.y + this.height, 8);
        } else if (this.jumpCount < this.maxJumps) {
            this.vy = this.jumpForce * 0.95;
            this.jumpCount++;
            window.soundManager.playDoubleJump();
            createJumpRings(this.x + 20, this.y + this.height);
        } else {
            // Buffer the jump input so pressing slightly before landing registers
            this.jumpBuffer = 10;
        }
    }

    slide() {
        if (this.isGrounded && !this.isSliding) {
            this.isSliding = true;
            this.slideTimer = this.slideDuration;
            this.height = this.slideHeight;
            this.y = 500 - this.slideHeight;
            window.soundManager.playSlide();
            createSlideSparks(this.x + 10, this.y + this.height);
        }
    }

    dash() {
        if (this.stamina >= 35 && !this.isDashing) {
            this.stamina -= 35;
            this.isDashing = true;
            this.dashTimer = this.dashDuration;
            this.invulnerableTimer = Math.max(this.invulnerableTimer, this.dashDuration);
            window.soundManager.playDash();
            createDashShockwave(this.x + 20, this.y + 35);
        }
    }

    update() {
        this.animFrame++;

        // Stamina recharge
        const rechargeRate = 0.45 * (this.avatar.dashBonus || 1.0);
        if (this.stamina < this.maxStamina) {
            this.stamina = Math.min(this.maxStamina, this.stamina + rechargeRate);
        }

        // Slide Timer
        if (this.isSliding) {
            this.slideTimer--;
            if (this.animFrame % 4 === 0) {
                createSlideSparks(this.x + 5, 500);
            }
            if (this.slideTimer <= 0) {
                this.isSliding = false;
                this.height = this.standHeight;
                this.y = 500 - this.standHeight;
            }
        }

        // Dash Timer
        if (this.isDashing) {
            this.dashTimer--;
            if (this.animFrame % 2 === 0) {
                createGhostTrail(this);
            }
            if (this.dashTimer <= 0) {
                this.isDashing = false;
            }
        }

        // Buff Timers
        if (this.coffeeTimer > 0) {
            this.coffeeTimer--;
            if (this.animFrame % 3 === 0) {
                createCoffeeSteam(this.x + Math.random() * 30, this.y + 10);
            }
        }
        if (this.ptoTimer > 0) {
            this.ptoTimer--;
        }
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer--;
        }

        // Gravity & Jump Physics with Coyote Time and Buffering
        if (!this.isGrounded) {
            if (this.coyoteTimer > 0) this.coyoteTimer--;
            this.vy += this.gravity;
            this.y += this.vy;

            if (this.y >= 500 - this.height) {
                this.y = 500 - this.height;
                this.vy = 0;
                this.isGrounded = true;
                this.jumpCount = 0;
                this.coyoteTimer = 0;
                createDust(this.x + 20, 500, 5);

                // Fire buffered jump immediately if queued
                if (this.jumpBuffer > 0) {
                    this.jumpBuffer = 0;
                    this.jump();
                }
            }
        } else {
            this.coyoteTimer = 6;
            this.runCycle += this.isDashing ? 0.35 : (this.coffeeTimer > 0 ? 0.3 : 0.2);
        }

        if (this.jumpBuffer > 0) {
            this.jumpBuffer--;
        }
    }

    draw() {
        ctx.save();

        // Invulnerable flash
        if (this.invulnerableTimer > 0 && Math.floor(this.animFrame / 3) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Shield Bubble
        if (this.shield > 0) {
            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 45, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
            ctx.fill();
            // Headphones Icon on Shield
            ctx.font = '18px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🎧', this.x + this.width / 2, this.y - 8);
            ctx.restore();
        }

        // Coffee Rush Glow
        if (this.coffeeTimer > 0) {
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 20;
        }

        const px = this.x;
        const py = this.y;

        if (this.isSliding) {
            // Sliding character pose
            // Torso angled
            ctx.fillStyle = this.avatar.shirtColor;
            ctx.beginPath();
            ctx.roundRect(px, py + 10, 48, 22, 6);
            ctx.fill();

            // Head ducked
            ctx.fillStyle = '#ffdfba';
            ctx.beginPath();
            ctx.arc(px + 42, py + 18, 12, 0, Math.PI * 2);
            ctx.fill();

            // Hair
            ctx.fillStyle = this.avatar.hairColor;
            ctx.beginPath();
            ctx.arc(px + 42, py + 14, 12, Math.PI, Math.PI * 2);
            ctx.fill();

            // Legs extending behind
            ctx.fillStyle = this.avatar.pantsColor;
            ctx.fillRect(px - 14, py + 16, 20, 12);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(px - 20, py + 18, 8, 10); // Shoes

            // Briefcase sliding alongside
            ctx.fillStyle = '#92400e';
            ctx.fillRect(px + 12, py + 14, 16, 12);
        } else {
            // Running or Jumping Character
            const legOffset = Math.sin(this.runCycle) * 14;

            // Legs
            ctx.fillStyle = this.avatar.pantsColor;
            if (this.isGrounded) {
                // Left leg
                ctx.fillRect(px + 10, py + 42, 10, 22 + legOffset * 0.4);
                // Right leg
                ctx.fillRect(px + 26, py + 42, 10, 22 - legOffset * 0.4);

                // Shoes
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(px + 8, py + 62 + legOffset * 0.4, 14, 8);
                ctx.fillRect(px + 24, py + 62 - legOffset * 0.4, 14, 8);
            } else {
                // Tucked jumping legs
                ctx.fillRect(px + 10, py + 42, 10, 16);
                ctx.fillRect(px + 24, py + 42, 10, 12);
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(px + 8, py + 56, 14, 8);
                ctx.fillRect(px + 22, py + 52, 14, 8);
            }

            // Torso (Shirt/Suit)
            ctx.fillStyle = this.avatar.shirtColor;
            ctx.beginPath();
            ctx.roundRect(px + 8, py + 18, 30, 28, 6);
            ctx.fill();

            // Tie or lanyard
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(px + 22, py + 22, 4, 18);

            // Head
            ctx.fillStyle = '#ffdfba';
            ctx.beginPath();
            ctx.arc(px + 23, py + 12, 12, 0, Math.PI * 2);
            ctx.fill();

            // Expressive Eyes
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(px + 28, py + 11, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Sweat drop if running fast
            if (this.isDashing || this.coffeeTimer > 0) {
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.arc(px + 34, py + 6, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Hair
            ctx.fillStyle = this.avatar.hairColor;
            ctx.beginPath();
            ctx.arc(px + 22, py + 8, 12, Math.PI * 0.8, Math.PI * 2.2);
            ctx.fill();

            // Briefcase / Laptop in hand
            ctx.fillStyle = '#78350f';
            ctx.fillRect(px + 2, py + 28 + (this.isGrounded ? legOffset * 0.2 : 0), 12, 10);
            ctx.fillStyle = '#d97706';
            ctx.fillRect(px + 6, py + 26 + (this.isGrounded ? legOffset * 0.2 : 0), 4, 3);
        }

        ctx.restore();
    }
}

// Particle System
let particles = [];

function createDust(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 16,
            y: y + (Math.random() - 0.5) * 4,
            vx: -gameSpeed * 0.4 - Math.random() * 2,
            vy: -Math.random() * 1.5,
            size: 3 + Math.random() * 4,
            color: 'rgba(203, 213, 225, 0.6)',
            life: 18
        });
    }
}

function createSlideSparks(x, y) {
    for (let i = 0; i < 3; i++) {
        particles.push({
            x: x,
            y: y - 2,
            vx: -gameSpeed * 0.8 - Math.random() * 3,
            vy: -Math.random() * 2,
            size: 2 + Math.random() * 3,
            color: Math.random() > 0.5 ? '#f59e0b' : '#38bdf8',
            life: 14
        });
    }
}

function createJumpRings(x, y) {
    particles.push({
        type: 'ring',
        x: x,
        y: y,
        radius: 6,
        maxRadius: 28,
        color: '#38bdf8',
        life: 16
    });
}

function createDashShockwave(x, y) {
    particles.push({
        type: 'shockwave',
        x: x,
        y: y,
        radius: 10,
        maxRadius: 60,
        color: '#818cf8',
        life: 14
    });
}

function createGhostTrail(player) {
    particles.push({
        type: 'ghost',
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height,
        color: player.avatar.color,
        life: 10
    });
}

function createCoffeeSteam(x, y) {
    particles.push({
        x: x,
        y: y,
        vx: -1 + Math.random() * 2,
        vy: -1.5 - Math.random() * 1.5,
        size: 3 + Math.random() * 3,
        color: 'rgba(251, 191, 36, 0.7)',
        life: 20
    });
}

function createScorePopup(x, y, text, color = '#fbbf24') {
    particles.push({
        type: 'text',
        x: x,
        y: y,
        text: text,
        vy: -1.8,
        color: color,
        life: 35
    });
}

function createBlastConfetti(x, y) {
    const colors = ['#38bdf8', '#fbbf24', '#f43f5e', '#10b981', '#a855f7'];
    for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 4 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 30
        });
    }
}

function updateAndDrawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life--;

        if (p.type === 'text') {
            p.y += p.vy;
            ctx.save();
            ctx.font = 'bold 18px Outfit, sans-serif';
            ctx.fillStyle = p.color;
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 6;
            ctx.fillText(p.text, p.x, p.y);
            ctx.restore();
        } else if (p.type === 'ring' || p.type === 'shockwave') {
            p.radius += (p.maxRadius - p.radius) * 0.25;
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2.5;
            ctx.globalAlpha = p.life / 16;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        } else if (p.type === 'ghost') {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = (p.life / 10) * 0.4;
            ctx.fillRect(p.x, p.y, p.width, p.height);
            ctx.restore();
        } else {
            p.x += p.vx;
            p.y += p.vy;
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Parallax Background Engine with Rich Office Details
class BackgroundManager {
    constructor() {
        this.layer1 = 0; // Skyline & Far Windows
        this.layer2 = 0; // Glass Conference Rooms & Wall Art
        this.layer3 = 0; // Cubicles, Desks, Monitors, Plants & Chairs
        this.layer4 = 0; // Ceiling Lights & Floor Tiles
        this.tick = 0;
    }

    update(speed) {
        this.tick++;
        this.layer1 = (this.layer1 - speed * 0.12) % 1200;
        this.layer2 = (this.layer2 - speed * 0.38) % 1200;
        this.layer3 = (this.layer3 - speed * 0.72) % 1200;
        this.layer4 = (this.layer4 - speed * 1.0) % 1200;
    }

    draw(biome) {
        this.drawCeiling(biome);
        this.drawFarSkylineAndWalls(biome);
        this.drawConferenceAndWallDecor(biome);
        this.drawCubiclesDesksAndOfficeProps(biome);
        this.drawFloorAndReflections(biome);
        this.drawOverheadLightingAndExitSigns(biome);
    }

    // 1. Drop Ceiling & Architectural Header
    drawCeiling(biome) {
        // Ceiling Base
        ctx.fillStyle = '#0b1120';
        ctx.fillRect(0, 0, 1000, 70);

        // Ceiling Acoustic Grid Tiles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1.5;
        for (let i = -1; i < 15; i++) {
            const cx = (this.layer4 + i * 90) % 1350;
            ctx.strokeRect(cx, 0, 90, 60);
        }

        // AC Ventilation Ducts
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 58, 1000, 6);
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 64, 1000, 2);
    }

    // 2. Far Skyline & Corporate Windows (Layer 1)
    drawFarSkylineAndWalls(biome) {
        // Wall Gradient
        const wallGrad = ctx.createLinearGradient(0, 60, 0, 500);
        wallGrad.addColorStop(0, biome.bg1);
        wallGrad.addColorStop(1, biome.bg2);
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 60, 1000, 440);

        ctx.save();
        for (let i = -1; i < 3; i++) {
            const bx = this.layer1 + i * 600;

            // City Windows with Skyscrapers
            ctx.fillStyle = '#070b14';
            ctx.fillRect(bx + 40, 90, 220, 200);

            // Window Glass Reflection
            const winGrad = ctx.createLinearGradient(bx + 40, 90, bx + 260, 290);
            winGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
            winGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
            winGrad.addColorStop(1, 'rgba(15, 23, 42, 0.6)');
            ctx.fillStyle = winGrad;
            ctx.fillRect(bx + 40, 90, 220, 200);

            // Distant Skyscraper Silhouettes
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(bx + 50, 150, 45, 140);
            ctx.fillRect(bx + 105, 120, 60, 170);
            ctx.fillRect(bx + 175, 140, 45, 150);
            ctx.fillRect(bx + 225, 170, 30, 120);

            // Glowing City Window Dots
            ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 3; c++) {
                    if ((r + c + i) % 2 === 0) {
                        ctx.fillRect(bx + 115 + c * 16, 135 + r * 20, 6, 8);
                    }
                }
            }

            // Window Frame
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 4;
            ctx.strokeRect(bx + 40, 90, 220, 200);
            ctx.beginPath();
            ctx.moveTo(bx + 150, 90);
            ctx.lineTo(bx + 150, 290);
            ctx.moveTo(bx + 40, 190);
            ctx.lineTo(bx + 260, 190);
            ctx.stroke();

            // Wall Company Logo Accent
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.font = 'bold 16px Outfit, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('⚡ SYNAPSE CORP HQ', bx + 320, 130);
        }
        ctx.restore();
    }

    // 3. Conference Rooms, Sticky Whiteboards & Wall Posters (Layer 2)
    drawConferenceAndWallDecor(biome) {
        ctx.save();
        for (let i = -1; i < 3; i++) {
            const bx = this.layer2 + i * 480;

            // Glass Meeting Room Box
            ctx.fillStyle = 'rgba(30, 41, 59, 0.65)';
            ctx.fillRect(bx + 60, 180, 260, 210);

            // Frosted glass band
            ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
            ctx.fillRect(bx + 60, 240, 260, 80);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(bx + 60, 180, 260, 210);

            // Conference Room Table & Chairs inside glass
            ctx.fillStyle = '#475569';
            ctx.fillRect(bx + 100, 310, 180, 12);
            ctx.fillStyle = '#334155';
            ctx.fillRect(bx + 120, 322, 10, 35);
            ctx.fillRect(bx + 250, 322, 10, 35);

            // Meeting Room Projector Screen with Pie Chart
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(bx + 140, 200, 100, 65);
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(bx + 140, 200, 100, 65);

            // Pie chart graphics
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(bx + 190, 232, 20, 0, Math.PI * 0.7);
            ctx.lineTo(bx + 190, 232);
            ctx.fill();
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(bx + 190, 232, 20, Math.PI * 0.7, Math.PI * 1.6);
            ctx.lineTo(bx + 190, 232);
            ctx.fill();
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(bx + 190, 232, 20, Math.PI * 1.6, Math.PI * 2);
            ctx.lineTo(bx + 190, 232);
            ctx.fill();

            // Whiteboard with Agile Kanban Sticky Notes
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(bx + 350, 200, 95, 75);
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.strokeRect(bx + 350, 200, 95, 75);

            // Sticky Notes (Yellow, Pink, Cyan, Green)
            ctx.fillStyle = '#fde047';
            ctx.fillRect(bx + 356, 210, 16, 16);
            ctx.fillRect(bx + 356, 232, 16, 16);
            ctx.fillStyle = '#f472b6';
            ctx.fillRect(bx + 378, 210, 16, 16);
            ctx.fillRect(bx + 378, 232, 16, 16);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(bx + 400, 210, 16, 16);
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(bx + 422, 210, 16, 16);
            ctx.fillRect(bx + 422, 232, 16, 16);

            // Framed Motivational Poster
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(bx + 40, 120, 80, 45);
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 2;
            ctx.strokeRect(bx + 40, 120, 80, 45);
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 8px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🚀 INNOVATE', bx + 80, 140);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '6px Outfit, sans-serif';
            ctx.fillText('SHIP BEFORE 5PM', bx + 80, 152);

            // Wall Clock with Ticking Hand
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(bx + 300, 130, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(bx + 300, 130);
            const handAngle = (this.tick * 0.02) % (Math.PI * 2);
            ctx.lineTo(bx + 300 + Math.cos(handAngle) * 10, 130 + Math.sin(handAngle) * 10);
            ctx.stroke();
        }
        ctx.restore();
    }

    // 4. Cubicles, L-Desks, Dual Monitors, Plants & Office Chairs (Layer 3)
    drawCubiclesDesksAndOfficeProps(biome) {
        ctx.save();
        for (let i = -1; i < 3; i++) {
            const bx = this.layer3 + i * 500;

            // --- CUBICLE PARTITION WALL ---
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.roundRect(bx + 40, 290, 240, 210, [8, 8, 0, 0]);
            ctx.fill();

            // Fabric inset panel
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.roundRect(bx + 48, 298, 224, 110, 4);
            ctx.fill();

            // --- L-SHAPED OFFICE DESK ---
            ctx.fillStyle = '#475569';
            ctx.fillRect(bx + 60, 390, 200, 16);
            // Desk Wood Top edge
            ctx.fillStyle = '#b45309';
            ctx.fillRect(bx + 60, 390, 200, 4);
            // Metal Desk Legs
            ctx.fillStyle = '#64748b';
            ctx.fillRect(bx + 75, 406, 10, 94);
            ctx.fillRect(bx + 235, 406, 10, 94);

            // --- DUAL MONITORS SETUP ---
            // Monitor 1: Code Editor (Dark theme with syntax code lines)
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(bx + 85, 325, 68, 48);
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.strokeRect(bx + 85, 325, 68, 48);
            // Stand
            ctx.fillStyle = '#475569';
            ctx.fillRect(bx + 114, 373, 10, 17);
            ctx.fillRect(bx + 104, 388, 30, 3);
            // Code Editor glowing lines
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(bx + 90, 332, 28, 3);
            ctx.fillStyle = '#f472b6';
            ctx.fillRect(bx + 122, 332, 22, 3);
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(bx + 90, 340, 44, 3);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(bx + 90, 348, 36, 3);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(bx + 98, 356, 30, 3);

            // Monitor 2: Live Metrics / Graph
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(bx + 160, 325, 62, 48);
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.strokeRect(bx + 160, 325, 62, 48);
            // Stand
            ctx.fillStyle = '#475569';
            ctx.fillRect(bx + 186, 373, 10, 17);
            ctx.fillRect(bx + 176, 388, 30, 3);
            // Line Chart & Bars
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(bx + 168, 355, 8, 12);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(bx + 180, 345, 8, 22);
            ctx.fillStyle = '#10b981';
            ctx.fillRect(bx + 192, 335, 8, 32);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(bx + 204, 340, 8, 27);

            // Keyboard & Mouse on Desk
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(bx + 100, 386, 45, 4);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(bx + 155, 385, 8, 5);

            // Ceramic Coffee Mug on Desk with Steam
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(bx + 215, 380, 10, 10);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(bx + 217, 382, 6, 6);

            // --- ERGONOMIC OFFICE CHAIR ---
            // High-back mesh
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.roundRect(bx + 130, 360, 34, 52, 6);
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // Chair Seat
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.roundRect(bx + 124, 408, 46, 12, 4);
            ctx.fill();
            // Chair Stem & 5-Star Wheeled Base
            ctx.fillStyle = '#64748b';
            ctx.fillRect(bx + 144, 420, 6, 26);
            ctx.fillRect(bx + 128, 444, 38, 4);
            // Wheels
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(bx + 130, 450, 4, 0, Math.PI * 2);
            ctx.arc(bx + 164, 450, 4, 0, Math.PI * 2);
            ctx.fill();

            // --- POTTED OFFICE PLANT (Monstera / Fiddle Leaf) ---
            const px = bx + 300;
            // Terracotta Pot
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.moveTo(px, 450);
            ctx.lineTo(px + 30, 450);
            ctx.lineTo(px + 26, 498);
            ctx.lineTo(px + 4, 498);
            ctx.closePath();
            ctx.fill();
            // Soil rim
            ctx.fillStyle = '#451a03';
            ctx.fillRect(px - 2, 446, 34, 6);
            // Lush Green Leaves
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.ellipse(px + 5, 430, 14, 22, -0.4, 0, Math.PI * 2);
            ctx.ellipse(px + 25, 425, 14, 24, 0.4, 0, Math.PI * 2);
            ctx.ellipse(px + 15, 410, 16, 26, 0, 0, Math.PI * 2);
            ctx.fill();
            // Leaf vein highlights
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(px + 15, 436);
            ctx.lineTo(px + 15, 395);
            ctx.stroke();

            // --- WATER COOLER WITH BUBBLING WATER ---
            const wx = bx + 360;
            // White body
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.roundRect(wx, 415, 32, 85, 4);
            ctx.fill();
            // Dispenser tray & levers (Blue cold / Red hot)
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(wx + 6, 440, 20, 18);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(wx + 8, 442, 6, 6);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(wx + 18, 442, 6, 6);
            // Water Bottle (Translucent cyan with water level)
            ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
            ctx.beginPath();
            ctx.arc(wx + 16, 395, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(wx + 11, 407, 10, 8);
            // Bubbles inside
            if (this.tick % 60 < 30) {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(wx + 14, 396, 2.5, 0, Math.PI * 2);
                ctx.arc(wx + 19, 390, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- 3-DRAWER STEEL FILING CABINET ---
            const fx = bx + 420;
            ctx.fillStyle = '#475569';
            ctx.fillRect(fx, 390, 42, 110);
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;
            ctx.strokeRect(fx, 390, 42, 110);
            // 3 Drawers & Handles
            for (let d = 0; d < 3; d++) {
                const dy = 396 + d * 34;
                ctx.strokeStyle = '#64748b';
                ctx.strokeRect(fx + 3, dy, 36, 30);
                // Handle
                ctx.fillStyle = '#cbd5e1';
                ctx.fillRect(fx + 14, dy + 12, 14, 4);
                // Index card label
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(fx + 16, dy + 4, 10, 5);
            }
        }
        ctx.restore();
    }

    // 5. Floor Tiles, Linoleum & Reflections
    drawFloorAndReflections(biome) {
        // Floor Base
        ctx.fillStyle = biome.floorColor;
        ctx.fillRect(0, 500, 1000, 100);

        // Baseboard Wooden Trim
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 496, 1000, 6);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 500, 1000, 3);

        // Carpet Tile Grid & Diagonal Weave Lines
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 2;
        for (let i = -1; i < 15; i++) {
            const lx = (this.layer4 + i * 110) % 1300;
            ctx.beginPath();
            ctx.moveTo(lx, 502);
            ctx.lineTo(lx - 70, 600);
            ctx.stroke();

            // Horizontal tile seams
            ctx.strokeRect(lx - 50, 530, 110, 35);
        }

        // Ambient Soft Floor Glow under Overhead Lights
        for (let i = -1; i < 6; i++) {
            const lx = (this.layer4 + i * 260) % 1300;
            const floorGlow = ctx.createRadialGradient(lx + 50, 505, 5, lx + 50, 505, 75);
            floorGlow.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
            floorGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = floorGlow;
            ctx.fillRect(lx - 30, 500, 160, 40);
        }
        ctx.restore();
    }

    // 6. Overhead Lighting & Illuminated Emergency Exit Signs
    drawOverheadLightingAndExitSigns(biome) {
        ctx.save();
        for (let i = -1; i < 6; i++) {
            const lx = (this.layer4 + i * 260) % 1300;

            // Fluorescent Troffer Light Panel
            ctx.fillStyle = '#f8fafc';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.roundRect(lx, 16, 100, 10, 3);
            ctx.fill();

            // Soft Volumetric Cone
            ctx.shadowBlur = 0;
            const cone = ctx.createLinearGradient(0, 26, 0, 350);
            cone.addColorStop(0, 'rgba(255, 255, 255, 0.07)');
            cone.addColorStop(1, 'transparent');
            ctx.fillStyle = cone;
            ctx.beginPath();
            ctx.moveTo(lx, 26);
            ctx.lineTo(lx + 100, 26);
            ctx.lineTo(lx + 140, 350);
            ctx.lineTo(lx - 40, 350);
            ctx.closePath();
            ctx.fill();

            // Emergency EXIT Sign (every 2nd light)
            if (i % 2 === 0) {
                ctx.fillStyle = '#065f46';
                ctx.fillRect(lx + 150, 26, 44, 20);
                ctx.strokeStyle = '#34d399';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(lx + 150, 26, 44, 20);

                ctx.fillStyle = '#34d399';
                ctx.font = 'bold 9px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.shadowColor = '#34d399';
                ctx.shadowBlur = 8;
                ctx.fillText('EXIT ➔', lx + 172, 40);
                ctx.shadowBlur = 0;
            }
        }
        ctx.restore();
    }
}

// Obstacles & Hazards
class Obstacle {
    constructor(type, x) {
        this.type = type;
        this.x = x;
        this.markedForDeletion = false;
        this.animFrame = 0;

        switch (type) {
            case 'CALENDAR':
                // "Quick Sync?" Meeting block (Jump)
                this.width = 52;
                this.height = 48;
                this.y = 500 - this.height;
                this.title = 'SYNC?';
                this.subtitle = '30m';
                break;
            case 'LAPTOP':
                // Tripping Laptop with blue sparking cords (Jump)
                this.width = 44;
                this.height = 26;
                this.y = 500 - this.height;
                break;
            case 'COFFEE_SPILL':
                // Coffee spill puddle (Jump or slide)
                this.width = 60;
                this.height = 14;
                this.y = 500 - this.height;
                break;
            case 'FLYING_BUZZWORD':
                // Flying laser buzzword projectile (Slide under!)
                this.width = 84;
                this.height = 28;
                this.y = 405; // Floating at head height
                this.buzzwords = ['SYNERGY!', 'CIRCLE BACK!', 'EOD ASAP!', 'DEEP DIVE!', 'PER MY EMAIL'];
                this.text = this.buzzwords[Math.floor(Math.random() * this.buzzwords.length)];
                break;
            case 'TASK_BOULDER':
                // Rolling Giant "URGENT TASK" Boulder
                this.width = 50;
                this.height = 50;
                this.y = 500 - this.height;
                this.rot = 0;
                break;
        }
    }

    update(speed) {
        this.animFrame++;
        this.x -= speed;
        if (this.type === 'TASK_BOULDER') {
            this.rot -= 0.08;
        }
        if (this.x + this.width < -100) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        ctx.save();
        switch (this.type) {
            case 'CALENDAR':
                // Red/White Calendar Block
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.roundRect(this.x, this.y, this.width, 16, [6, 6, 0, 0]);
                ctx.fill();

                ctx.fillStyle = '#f8fafc';
                ctx.beginPath();
                ctx.roundRect(this.x, this.y + 16, this.width, this.height - 16, [0, 0, 6, 6]);
                ctx.fill();

                // Calendar bindings
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(this.x + 8, this.y - 3, 6, 6);
                ctx.fillRect(this.x + this.width - 14, this.y - 3, 6, 6);

                // Text
                ctx.fillStyle = '#0f172a';
                ctx.font = 'bold 10px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(this.title, this.x + this.width / 2, this.y + 29);

                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 11px Outfit, sans-serif';
                ctx.fillText('📅 ' + this.subtitle, this.x + this.width / 2, this.y + 42);
                break;

            case 'LAPTOP':
                // Laptop on Floor
                ctx.fillStyle = '#475569';
                ctx.fillRect(this.x, this.y + 16, this.width, 10);
                // Glowing blue screen
                ctx.fillStyle = '#38bdf8';
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(this.x + 6, this.y + 16);
                ctx.lineTo(this.x + 14, this.y + 2);
                ctx.lineTo(this.x + 38, this.y + 2);
                ctx.lineTo(this.x + 38, this.y + 16);
                ctx.fill();

                // Tangled cords
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(this.x - 16, this.y + 22);
                ctx.quadraticCurveTo(this.x - 8, this.y + 12, this.x, this.y + 18);
                ctx.stroke();
                break;

            case 'COFFEE_SPILL':
                // Coffee spill puddle
                ctx.fillStyle = '#451a03';
                ctx.beginPath();
                ctx.ellipse(this.x + this.width / 2, this.y + 8, this.width / 2, 6, 0, 0, Math.PI * 2);
                ctx.fill();

                // Knocked mug
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(this.x + 6, this.y, 12, 10);
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(this.x + 8, this.y + 2, 8, 3);
                break;

            case 'FLYING_BUZZWORD':
                // Floating red/orange alert banner
                ctx.fillStyle = 'rgba(239, 68, 68, 0.92)';
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.roundRect(this.x, this.y, this.width, this.height, 6);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('⚠️ ' + this.text, this.x + this.width / 2, this.y + 18);
                break;

            case 'TASK_BOULDER':
                // Giant Rolling Document Boulder
                ctx.save();
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(this.rot);

                ctx.fillStyle = '#f8fafc';
                ctx.shadowColor = '#f43f5e';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ef4444';
                ctx.font = '900 11px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('URGENT', 0, -4);
                ctx.fillText('TASK', 0, 9);
                ctx.restore();
                break;
        }
        ctx.restore();
    }
}

// Powerups & Items
class Item {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 34;
        this.height = 34;
        this.markedForDeletion = false;
        this.anim = Math.random() * Math.PI * 2;
    }

    update(speed, player) {
        this.anim += 0.08;
        this.x -= speed;

        // Magnet logic (PTO or Zara perk)
        const magnetRadius = (player.ptoTimer > 0 || player.avatar.magnetBonus > 1.0) ? (200 * player.avatar.magnetBonus) : 0;
        if (magnetRadius > 0) {
            const dx = (player.x + player.width / 2) - (this.x + this.width / 2);
            const dy = (player.y + player.height / 2) - (this.y + this.height / 2);
            const dist = Math.hypot(dx, dy);

            if (dist < magnetRadius && dist > 5) {
                this.x += (dx / dist) * 9;
                this.y += (dy / dist) * 9;
            }
        }

        if (this.x + this.width < -50) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        const floatY = this.y + Math.sin(this.anim) * 5;
        ctx.save();

        switch (this.type) {
            case 'COIN':
                // Spinning Gold Equity Token
                ctx.fillStyle = '#fbbf24';
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.ellipse(this.x + 16, floatY + 16, 14 * Math.abs(Math.cos(this.anim * 1.5)), 14, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#78350f';
                ctx.font = 'bold 14px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('$', this.x + 16, floatY + 21);
                break;

            case 'COFFEE':
                // Espresso Cup
                ctx.font = '28px sans-serif';
                ctx.fillText('☕', this.x, floatY + 26);
                break;

            case 'HEADPHONES':
                // Noise Cancelling Shield
                ctx.font = '28px sans-serif';
                ctx.fillText('🎧', this.x, floatY + 26);
                break;

            case 'PTO':
                // Paid Time Off Slip
                ctx.font = '28px sans-serif';
                ctx.fillText('🏝️', this.x, floatY + 26);
                break;

            case 'OOO':
                // Out of Office Blast
                ctx.font = '28px sans-serif';
                ctx.fillText('📨', this.x, floatY + 26);
                break;
        }

        ctx.restore();
    }
}

// Boss Encounter Manager
class BossManager {
    constructor() {
        this.active = false;
        this.x = -150;
        this.y = 380;
        this.timer = 0;
        this.duration = 450; // frames
        this.shoutTimer = 0;
        this.quotes = [
            "NEED THIS BY EOD!",
            "CAN WE CIRCLE BACK?",
            "PER MY LAST EMAIL!",
            "LET'S TOUCH BASE!",
            "QUICK CALL PLEASE!"
        ];
        this.currentQuote = '';
    }

    trigger() {
        this.active = true;
        this.x = -120;
        this.timer = this.duration;
        this.shoutTimer = 40;
        this.currentQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        window.soundManager.playBossAlert();
        showBossWarning(this.currentQuote);
    }

    update(speed) {
        if (!this.active) return;
        this.timer--;

        // Hover behind player
        this.x += (80 - this.x) * 0.05;

        this.shoutTimer--;
        if (this.shoutTimer <= 0) {
            this.shoutTimer = 90;
            this.currentQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
            createScorePopup(this.x + 80, this.y - 30, this.currentQuote, '#ef4444');
        }

        if (this.timer <= 0) {
            this.active = false;
            this.x = -150;
        }
    }

    draw() {
        if (!this.active) return;
        ctx.save();

        // Segway / Boss Base
        ctx.fillStyle = '#334155';
        ctx.fillRect(this.x + 10, 480, 50, 16);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(this.x + 20, 495, 10, 0, Math.PI * 2);
        ctx.arc(this.x + 50, 495, 10, 0, Math.PI * 2);
        ctx.fill();

        // Boss Suit
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(this.x + 18, this.y + 40, 36, 45);
        ctx.fillStyle = '#dc2626'; // Red power tie
        ctx.fillRect(this.x + 34, this.y + 44, 5, 25);

        // Boss Head & Angry Face
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(this.x + 36, this.y + 26, 16, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(this.x + 36, this.y + 20, 16, Math.PI * 0.8, Math.PI * 2.2);
        ctx.fill();

        // Megaphone in Hand
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(this.x + 55, this.y + 40);
        ctx.lineTo(this.x + 80, this.y + 28);
        ctx.lineTo(this.x + 80, this.y + 52);
        ctx.fill();

        // Shout Bubble
        if (this.currentQuote) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
            ctx.beginPath();
            ctx.roundRect(this.x + 85, this.y - 10, 140, 34, 6);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(this.currentQuote, this.x + 155, this.y + 12);
        }

        ctx.restore();
    }
}

// Game Core
let player = new Player();
let bgManager = new BackgroundManager();
let bossManager = new BossManager();
let obstacles = [];
let items = [];
let baseSpeed = 3.2; // Smooth, readable, and enjoyable arcade runner pacing
let gameSpeed = baseSpeed;
let distance = 0;
let runStartTime = 0;
let survivalTime = 0;
let runCoins = 0;
let spawnTimer = 0;
let nextBossTriggerDist = 800;

// Collision Detection with generous forgiving hitboxes
function checkCollision(p, obj, isItem = false) {
    if (isItem) {
        // Generous pickup radius for coins/powerups
        return (
            p.x < obj.x + obj.width &&
            p.x + p.width > obj.x &&
            p.y < obj.y + obj.height &&
            p.y + p.height > obj.y
        );
    }

    // Player tailored collision box (extra foot/head forgiveness)
    const pBox = {
        x: p.x + 10,
        y: p.y + 6,
        width: p.width - 20,
        height: p.height - 18 // 12px foot margin so jumping over is clean
    };

    // Obstacle tailored collision box
    const oBox = {
        x: obj.x + 6,
        y: obj.y + 6,
        width: obj.width - 12,
        height: obj.height - 10
    };

    return (
        pBox.x < oBox.x + oBox.width &&
        pBox.x + pBox.width > oBox.x &&
        pBox.y < oBox.y + oBox.height &&
        pBox.y + pBox.height > oBox.y
    );
}

// Start / Restart Game
function startGame() {
    player.reset();
    obstacles = [];
    items = [];
    particles = [];
    bossManager.active = false;
    distance = 0;
    runCoins = 0;
    gameSpeed = baseSpeed;
    spawnTimer = 75;
    nextBossTriggerDist = 800;
    runStartTime = performance.now();
    survivalTime = 0;

    currentState = GAME_STATE.PLAYING;
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('shop-screen').classList.add('hidden');

    window.soundManager.startBGM();
}

function gameOver(customReason) {
    currentState = GAME_STATE.GAMEOVER;
    window.soundManager.stopBGM();
    window.soundManager.playGameOver();

    const finalTime = survivalTime;
    const finalDist = Math.floor(distance);

    // Save records
    totalCoins += runCoins;
    storage.set('coins', totalCoins);

    const isNewRecord = finalTime > bestSurvivalTime || finalDist > bestDistance;
    if (finalTime > bestSurvivalTime) {
        bestSurvivalTime = finalTime;
        storage.set('best_time', bestSurvivalTime);
    }
    if (finalDist > bestDistance) {
        bestDistance = finalDist;
        storage.set('best_dist', bestDistance);
    }

    // Populate Game Over Screen
    const reasonText = customReason || DEATH_REASONS[Math.floor(Math.random() * DEATH_REASONS.length)];
    document.getElementById('death-reason-text').textContent = `"${reasonText}"`;
    document.getElementById('stat-time-val').textContent = finalTime.toFixed(2) + 's';
    document.getElementById('stat-dist-val').textContent = finalDist + 'm';
    document.getElementById('stat-coins-val').textContent = '+$' + runCoins;
    document.getElementById('stat-best-val').textContent = bestSurvivalTime.toFixed(2) + 's';

    const recordTag = document.getElementById('new-record-tag');
    if (isNewRecord) {
        recordTag.style.display = 'block';
    } else {
        recordTag.style.display = 'none';
    }

    document.getElementById('gameover-screen').classList.remove('hidden');
}

// Spawner Logic
function updateSpawner() {
    spawnTimer--;
    if (spawnTimer <= 0) {
        // Spawn rate scales naturally with current gameSpeed and time
        const interval = Math.max(48, Math.floor((480 / gameSpeed) - (survivalTime * 0.08)));
        spawnTimer = interval;

        const rand = Math.random();
        if (rand < 0.35) {
            obstacles.push(new Obstacle('CALENDAR', 1050));
        } else if (rand < 0.6) {
            obstacles.push(new Obstacle('LAPTOP', 1050));
        } else if (rand < 0.78) {
            obstacles.push(new Obstacle('FLYING_BUZZWORD', 1050));
        } else if (rand < 0.90) {
            obstacles.push(new Obstacle('COFFEE_SPILL', 1050));
        } else {
            obstacles.push(new Obstacle('TASK_BOULDER', 1050));
        }

        // Spawn Coins & Power-ups
        if (Math.random() < 0.65) {
            const coinY = Math.random() > 0.4 ? 460 : 380;
            const coinCount = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < coinCount; i++) {
                items.push(new Item('COIN', 1150 + i * 40, coinY));
            }
        }

        // Rare Powerup Drop
        if (Math.random() < 0.18) {
            const powerups = ['COFFEE', 'HEADPHONES', 'PTO', 'OOO'];
            const chosen = powerups[Math.floor(Math.random() * powerups.length)];
            items.push(new Item(chosen, 1200, 420));
        }
    }

    // Boss Battle Trigger
    if (distance >= nextBossTriggerDist && !bossManager.active) {
        bossManager.trigger();
        nextBossTriggerDist += 1200 + Math.random() * 500;
    }
}

// Current Biome Lookup
function getCurrentBiome() {
    for (let i = BIOMES.length - 1; i >= 0; i--) {
        if (distance >= BIOMES[i].distance) {
            return BIOMES[i];
        }
    }
    return BIOMES[0];
}

// Main Game Loop
function updateGame() {
    if (currentState !== GAME_STATE.PLAYING) return;

    survivalTime = (performance.now() - runStartTime) / 1000;

    // Gentle, comfortable speed progression over time and distance
    const timeSpeedBonus = survivalTime * 0.015; 
    const distSpeedBonus = distance * 0.0004;   
    const currentBaseSpeed = baseSpeed + Math.min(2.5, timeSpeedBonus + distSpeedBonus);

    // Coffee & Dash speed boost multipliers
    const speedBoost = player.coffeeTimer > 0 ? 1.25 : (player.isDashing ? 1.35 : 1.0);
    const effectiveSpeed = currentBaseSpeed * speedBoost;
    gameSpeed = currentBaseSpeed;

    distance += effectiveSpeed * 0.05;

    const currentBiome = getCurrentBiome();

    // Update Systems
    bgManager.update(effectiveSpeed);
    player.update();
    bossManager.update(effectiveSpeed);
    updateSpawner();

    // Update Obstacles & Check Collisions
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.update(effectiveSpeed);

        if (checkCollision(player, obs)) {
            // Invulnerable / Coffee / Dash Smash
            if (player.invulnerableTimer > 0 || player.coffeeTimer > 0) {
                obs.markedForDeletion = true;
                createBlastConfetti(obs.x + obs.width / 2, obs.y + obs.height / 2);
                createScorePopup(obs.x, obs.y, 'SMASHED! +50', '#10b981');
                runCoins += 5;
                window.soundManager.playBlast();
            } else if (player.shield > 0) {
                // Shield break
                player.shield--;
                player.invulnerableTimer = 40; // temporary invulnerability
                obs.markedForDeletion = true;
                window.soundManager.playShieldBreak();
                createBlastConfetti(obs.x, obs.y);
                createScorePopup(player.x, player.y - 20, 'SHIELD BROKE!', '#38bdf8');
            } else {
                // Game Over Collision
                let specificReason = null;
                if (obs.type === 'CALENDAR') specificReason = "Trapped in an unmovable 'Quick Sync' calendar block.";
                if (obs.type === 'LAPTOP') specificReason = "Tripped over tangled laptop charger cords and crashed into HR.";
                if (obs.type === 'FLYING_BUZZWORD') specificReason = "Hit in the face by a flying 'SYNERGY' initiative.";
                if (obs.type === 'TASK_BOULDER') specificReason = "Flattened by a rolling boulder of Urgent Tasks.";
                gameOver(specificReason);
                return;
            }
        }

        if (obs.markedForDeletion) {
            obstacles.splice(i, 1);
        }
    }

    // Update Items & Pickups
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.update(effectiveSpeed, player);

        if (checkCollision(player, item, true)) {
            item.markedForDeletion = true;

            switch (item.type) {
                case 'COIN':
                    runCoins += 1;
                    window.soundManager.playCoin();
                    createScorePopup(item.x, item.y, '+$1', '#fbbf24');
                    break;
                case 'COFFEE':
                    const durationFrames = Math.floor(240 * (upgrades.coffee_duration * 0.2 + 1) * (player.avatar.coffeeBonus || 1));
                    player.coffeeTimer = durationFrames;
                    window.soundManager.playCoffeePowerup();
                    createScorePopup(player.x, player.y - 30, 'QUAD ESPRESSO! ☕', '#f59e0b');
                    break;
                case 'HEADPHONES':
                    player.shield = 1;
                    window.soundManager.playShieldUp();
                    createScorePopup(player.x, player.y - 30, 'NOISE CANCELLED! 🎧', '#38bdf8');
                    break;
                case 'PTO':
                    player.ptoTimer = 220;
                    createScorePopup(player.x, player.y - 30, 'PTO APPROVED! 🏝️', '#10b981');
                    window.soundManager.playCoin();
                    break;
                case 'OOO':
                    // Vaporize all on-screen obstacles
                    obstacles.forEach(o => {
                        createBlastConfetti(o.x + o.width / 2, o.y + o.height / 2);
                        runCoins += 3;
                    });
                    obstacles = [];
                    window.soundManager.playBlast();
                    createScorePopup(player.x, player.y - 30, 'OUT OF OFFICE BLAST! 📨', '#a855f7');
                    break;
            }
        }

        if (item.markedForDeletion) {
            items.splice(i, 1);
        }
    }

    // Update HUD
    updateHUD(currentBiome);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentBiome = getCurrentBiome();
    bgManager.draw(currentBiome);

    // Draw Items
    items.forEach(it => it.draw());

    // Draw Obstacles
    obstacles.forEach(ob => ob.draw());

    // Draw Boss
    bossManager.draw();

    // Draw Player
    player.draw();

    // Speed Lines Effect during Dash or Coffee Rush
    if (player.isDashing || player.coffeeTimer > 0) {
        ctx.save();
        ctx.strokeStyle = player.coffeeTimer > 0 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 2;
        for (let s = 0; s < 6; s++) {
            const sx = (Math.sin(player.animFrame * 0.3 + s * 1.5) * 400 + 500);
            const sy = 100 + s * 65 + (Math.sin(s) * 30);
            const len = 70 + Math.random() * 80;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - len, sy);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Draw Particles
    updateAndDrawParticles();
}

function render() {
    updateGame();
    drawGame();
    requestAnimationFrame(render);
}

// HUD Updates
function updateHUD(biome) {
    document.getElementById('hud-time').textContent = survivalTime.toFixed(1) + 's';
    document.getElementById('hud-coins').textContent = '$' + (totalCoins + runCoins);
    document.getElementById('hud-zone').textContent = biome.name;
    document.getElementById('stamina-fill').style.width = (player.stamina / player.maxStamina * 100) + '%';

    // Active powerups tag
    const powerupContainer = document.getElementById('active-powerup-bar');
    powerupContainer.innerHTML = '';

    if (player.coffeeTimer > 0) {
        const tag = document.createElement('div');
        tag.className = 'powerup-tag';
        tag.innerHTML = `☕ Espresso Rush (${(player.coffeeTimer / 60).toFixed(1)}s)`;
        powerupContainer.appendChild(tag);
    }
    if (player.shield > 0) {
        const tag = document.createElement('div');
        tag.className = 'powerup-tag';
        tag.style.borderColor = '#38bdf8';
        tag.innerHTML = `🎧 Noise-Cancel Shield Active`;
        powerupContainer.appendChild(tag);
    }
    if (player.ptoTimer > 0) {
        const tag = document.createElement('div');
        tag.className = 'powerup-tag';
        tag.style.borderColor = '#10b981';
        tag.innerHTML = `🏝️ PTO Coin Magnet (${(player.ptoTimer / 60).toFixed(1)}s)`;
        powerupContainer.appendChild(tag);
    }
}

function showBossWarning(quote) {
    const banner = document.getElementById('boss-warning-banner');
    banner.textContent = `🚨 BOSS ALERT: "${quote}" 🚨`;
    banner.style.display = 'block';
    setTimeout(() => {
        banner.style.display = 'none';
    }, 2800);
}

// Pause and Navigation Functions
let pauseStartTime = 0;

function pauseGame() {
    if (currentState === GAME_STATE.PLAYING) {
        currentState = GAME_STATE.PAUSED;
        pauseStartTime = performance.now();
        document.getElementById('pause-screen').classList.remove('hidden');
        window.soundManager.stopBGM();
    }
}

function resumeGame() {
    if (currentState === GAME_STATE.PAUSED) {
        currentState = GAME_STATE.PLAYING;
        const pauseDuration = performance.now() - pauseStartTime;
        runStartTime += pauseDuration; // adjust elapsed timer seamlessly
        document.getElementById('pause-screen').classList.add('hidden');
        window.soundManager.startBGM();
    }
}

function goHome() {
    currentState = GAME_STATE.MENU;
    document.getElementById('pause-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('shop-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    window.soundManager.stopBGM();
    renderAvatarSelection();
    updateShopUI();
}

// Input Handlers
window.addEventListener('keydown', (e) => {
    // Audio context resume on first user interaction
    window.soundManager.init();

    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (currentState === GAME_STATE.PLAYING) {
            pauseGame();
        } else if (currentState === GAME_STATE.PAUSED) {
            resumeGame();
        }
        return;
    }

    if (currentState === GAME_STATE.PLAYING) {
        if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            player.jump();
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            e.preventDefault();
            player.slide();
        } else if (e.key === 'Shift' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            player.dash();
        }
    } else if (currentState === GAME_STATE.PAUSED && (e.code === 'Space' || e.key === 'Enter')) {
        e.preventDefault();
        resumeGame();
    } else if (currentState === GAME_STATE.GAMEOVER && e.code === 'Space') {
        startGame();
    }
});

// Touch & Mobile Buttons Setup
function setupTouchControls() {
    const jumpBtn = document.getElementById('touch-jump');
    const slideBtn = document.getElementById('touch-slide');
    const dashBtn = document.getElementById('touch-dash');

    if (jumpBtn) {
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            window.soundManager.init();
            player.jump();
        });
    }
    if (slideBtn) {
        slideBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            window.soundManager.init();
            player.slide();
        });
    }
    if (dashBtn) {
        dashBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            window.soundManager.init();
            player.dash();
        });
    }

    // Direct tap anywhere on canvas
    canvas.addEventListener('touchstart', (e) => {
        window.soundManager.init();
        if (currentState === GAME_STATE.PLAYING) {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const tapY = touch.clientY - rect.top;

            if (tapY > rect.height * 0.65) {
                player.slide();
            } else {
                player.jump();
            }
        }
    });
}

// Avatar Selection & Shop UI
function renderAvatarSelection() {
    const container = document.getElementById('avatar-grid-container');
    container.innerHTML = '';

    Object.values(AVATARS).forEach(av => {
        const card = document.createElement('div');
        const isUnlocked = unlockedAvatars.includes(av.id);
        const isSelected = activeAvatarId === av.id;

        card.className = `avatar-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
        card.innerHTML = `
            ${!isUnlocked ? `<span class="avatar-lock-tag">🔒 $${av.cost}</span>` : ''}
            <div class="avatar-preview">${av.emoji}</div>
            <div class="avatar-name">${av.name}</div>
            <div class="avatar-role">${av.role}</div>
            <div class="avatar-perk">${av.perk}</div>
        `;

        card.addEventListener('click', () => {
            window.soundManager.init();
            if (isUnlocked) {
                activeAvatarId = av.id;
                storage.set('selected_avatar', activeAvatarId);
                renderAvatarSelection();
            } else if (totalCoins >= av.cost) {
                // Buy avatar
                totalCoins -= av.cost;
                storage.set('coins', totalCoins);
                unlockedAvatars.push(av.id);
                storage.set('unlocked_avatars', unlockedAvatars);
                activeAvatarId = av.id;
                storage.set('selected_avatar', activeAvatarId);
                window.soundManager.playShieldUp();
                renderAvatarSelection();
                updateShopUI();
            } else {
                window.soundManager.playTone(200, 'square', 0.1, 0.2);
                alert(`Need $${av.cost} Equity Coins to unlock ${av.name}!`);
            }
        });

        container.appendChild(card);
    });
}

function updateShopUI() {
    document.getElementById('shop-total-coins').textContent = '$' + totalCoins;
}

// Global upgrade helper
window.buyUpgrade = function(type, cost) {
    if (totalCoins >= cost) {
        totalCoins -= cost;
        storage.set('coins', totalCoins);
        upgrades[type] = (upgrades[type] || 1) + 1;
        storage.set('upgrades', upgrades);
        window.soundManager.playShieldUp();
        updateShopUI();
        createScorePopup(canvas.width / 2, canvas.height / 2, 'PERK UPGRADED! ✨', '#10b981');
    } else {
        window.soundManager.playTone(200, 'square', 0.1, 0.2);
    }
};

// Initialization on DOM load
window.addEventListener('DOMContentLoaded', () => {
    renderAvatarSelection();
    setupTouchControls();
    updateShopUI();

    document.getElementById('btn-play').addEventListener('click', () => {
        window.soundManager.init();
        startGame();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        window.soundManager.init();
        startGame();
    });

    document.getElementById('btn-pause').addEventListener('click', () => {
        window.soundManager.init();
        if (currentState === GAME_STATE.PLAYING) {
            pauseGame();
        } else if (currentState === GAME_STATE.PAUSED) {
            resumeGame();
        }
    });

    document.getElementById('btn-resume').addEventListener('click', () => {
        resumeGame();
    });

    document.getElementById('btn-pause-restart').addEventListener('click', () => {
        document.getElementById('pause-screen').classList.add('hidden');
        startGame();
    });

    document.getElementById('btn-home').addEventListener('click', () => {
        goHome();
    });

    document.getElementById('btn-gameover-home').addEventListener('click', () => {
        goHome();
    });

    document.getElementById('btn-shop-open').addEventListener('click', () => {
        updateShopUI();
        document.getElementById('shop-screen').classList.remove('hidden');
    });

    document.getElementById('btn-shop-close').addEventListener('click', () => {
        document.getElementById('shop-screen').classList.add('hidden');
        renderAvatarSelection();
    });

    document.getElementById('btn-mute').addEventListener('click', () => {
        window.soundManager.init();
        const isMuted = window.soundManager.toggleMute();
        document.getElementById('btn-mute').textContent = isMuted ? '🔇' : '🔊';
    });

    // Start render animation loop
    requestAnimationFrame(render);
});
