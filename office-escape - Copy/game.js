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
let unlockedAvatars = storage.get('unlocked_avatars', ['dev']);
let activeAvatarId = storage.get('selected_avatar', 'dev');

// Upgrades (Bought flags)
let upgrades = storage.get('upgrades', {
    coffee_duration: 0,
    shield_strength: 0,
    magnet_duration: 0
});

// Avatar Definitions (Dev unlocked, others purchased with P)
const AVATARS = {
    dev: {
        id: 'dev',
        name: 'Dev',
        role: 'Core Developer',
        emoji: '💻',
        perk: 'Double Jump + Fast Stamina',
        color: '#38bdf8',
        skinColor: '#fed7aa',
        hairColor: '#f97316',
        shirtColor: '#0284c7',
        pantsColor: '#1e293b',
        cost: 0,
        hasDoubleJump: true,
        coffeeBonus: 1.3,
        magnetBonus: 1.0,
        dashBonus: 1.2
    },
    og_man: {
        id: 'og_man',
        name: 'OG Man',
        role: 'Senior Specialist',
        emoji: '👨',
        perk: 'Balanced Agility & Low Friction',
        color: '#10b981',
        skinColor: '#fde047',
        hairColor: '#451a03',
        shirtColor: '#10b981',
        pantsColor: '#334155',
        cost: 40,
        hasDoubleJump: false,
        coffeeBonus: 1.1,
        magnetBonus: 1.2,
        dashBonus: 1.3
    },
    og_woman: {
        id: 'og_woman',
        name: 'OG Woman',
        role: 'Lead Strategist',
        emoji: '👩',
        perk: 'Extended Slide & Fast Dash Recharge',
        color: '#ec4899',
        skinColor: '#fed7aa',
        hairColor: '#a855f7',
        shirtColor: '#ec4899',
        pantsColor: '#475569',
        cost: 40,
        hasDoubleJump: false,
        coffeeBonus: 1.1,
        magnetBonus: 1.3,
        dashBonus: 1.4
    },
    black_man: {
        id: 'black_man',
        name: 'Black Man',
        role: 'Chief Architect',
        emoji: '👨🏿',
        perk: 'Free Shield Every Run + 2x Point Coins',
        color: '#8b5cf6',
        skinColor: '#582f0e',
        hairColor: '#1e1b4b',
        shirtColor: '#8b5cf6',
        pantsColor: '#0f172a',
        cost: 60,
        hasDoubleJump: false,
        startShield: true,
        coinMultiplier: 2.0,
        coffeeBonus: 1.2,
        magnetBonus: 1.3,
        dashBonus: 1.2
    },
    black_woman: {
        id: 'black_woman',
        name: 'Black Woman',
        role: 'Director of Ops',
        emoji: '👩🏿',
        perk: '+80% Point Magnet Range',
        color: '#f59e0b',
        skinColor: '#582f0e',
        hairColor: '#020617',
        shirtColor: '#f59e0b',
        pantsColor: '#1e293b',
        cost: 60,
        hasDoubleJump: false,
        coffeeBonus: 1.2,
        magnetBonus: 1.8,
        dashBonus: 1.2
    },
    muscular_man: {
        id: 'muscular_man',
        name: 'Muscular Man',
        role: 'Fitness Director',
        emoji: '🏋️‍♂️',
        perk: 'Smash Obstacles on Dash',
        color: '#ef4444',
        skinColor: '#fed7aa',
        hairColor: '#b45309',
        shirtColor: '#ef4444',
        pantsColor: '#1e3a8a',
        cost: 80,
        hasDoubleJump: false,
        coffeeBonus: 1.4,
        magnetBonus: 1.1,
        dashBonus: 1.5,
        startShield: true
    },
    muscular_woman: {
        id: 'muscular_woman',
        name: 'Muscular Woman',
        role: 'Power Exec',
        emoji: '🏋️‍♀️',
        perk: 'Protective Shield + Double Jump',
        color: '#06b6d4',
        skinColor: '#582f0e',
        hairColor: '#7c2d12',
        shirtColor: '#06b6d4',
        pantsColor: '#312e81',
        cost: 80,
        hasDoubleJump: true,
        coffeeBonus: 1.3,
        magnetBonus: 1.2,
        dashBonus: 1.3,
        startShield: true
    }
};

// Biomes / Office Departments with rich unique color schemes & architecture
const BIOMES = [
    { 
        id: 'cubicles',
        name: '🖥️ Cubicle Maze', 
        bg1: '#070b14', 
        bg2: '#0f172a', 
        accent: '#38bdf8', 
        floorColor: '#090d18',
        laserColor: '#00f0ff',
        propEmoji: '💻',
        distance: 0 
    },
    { 
        id: 'conference',
        name: '📊 Conference Boardroom', 
        bg1: '#0b132b', 
        bg2: '#1c2541', 
        accent: '#60a5fa', 
        floorColor: '#0a0f24',
        laserColor: '#3b82f6',
        propEmoji: '📈',
        distance: 300 
    },
    { 
        id: 'cafeteria',
        name: '☕ Coffee Pantry & Cafe', 
        bg1: '#1a0c02', 
        bg2: '#451a03', 
        accent: '#f59e0b', 
        floorColor: '#1c0c03',
        laserColor: '#fbbf24',
        propEmoji: '🍩',
        distance: 700 
    },
    { 
        id: 'hr_audit',
        name: '🚨 HR Compliance Dept', 
        bg1: '#1f040d', 
        bg2: '#4c0519', 
        accent: '#f43f5e', 
        floorColor: '#19030a',
        laserColor: '#ff2a5f',
        propEmoji: '📑',
        distance: 1200 
    },
    { 
        id: 'executive',
        name: '👑 Executive Penthouse Suite', 
        bg1: '#150324', 
        bg2: '#3b0764', 
        accent: '#c084fc', 
        floorColor: '#140223',
        laserColor: '#d946ef',
        propEmoji: '💎',
        distance: 1800 
    },
    { 
        id: 'elevator_exit',
        name: '🛗 The Great Elevator EXIT', 
        bg1: '#011c16', 
        bg2: '#064e3b', 
        accent: '#34d399', 
        floorColor: '#021813',
        laserColor: '#10b981',
        propEmoji: '🚪',
        distance: 2500 
    }
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
        let avatar = AVATARS[activeAvatarId];
        if (!avatar) {
            activeAvatarId = 'dev';
            avatar = AVATARS.dev;
            storage.set('selected_avatar', 'dev');
        }
        this.avatar = avatar;
        this.width = 44 * (avatar.hitboxScale || 1.0);
        this.height = 68 * (avatar.hitboxScale || 1.0);
        this.standHeight = this.height;
        this.slideHeight = 32 * (avatar.hitboxScale || 1.0);
        this.x = 120;
        this.groundY = 500 - this.standHeight;
        this.y = this.groundY;
        this.vy = 0;
        this.gravity = 0.82; // Crisp, balanced Dino jump gravity
        this.jumpForce = -15.6; // Responsive, punchy jump arc
        this.isGrounded = true;
        this.isSliding = false;
        this.isHoldingDuck = false;
        this.slideTimer = 0;
        this.jumpCount = 0;
        const isAvatarUnlocked = unlockedAvatars.includes(avatar.id);
        this.maxJumps = 2; // Double Jump enabled for all players/characters!
        this.jumpBuffer = 0;
        this.coyoteTimer = 0;

        // Stamina & Dash
        this.stamina = 100;
        this.maxStamina = 100;
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashDuration = 16;

        // Buffs: Starting shield only active if avatar has perk AND is unlocked, or shop upgrade bought
        this.shield = ((isAvatarUnlocked && avatar.startShield) || (upgrades.shield_strength > 0)) ? 1 : 0;
        this.coffeeTimer = 0;
        this.ptoTimer = 0;
        this.invulnerableTimer = 0;

        // Animation
        this.animFrame = 0;
        this.runCycle = 0;
    }

    jump() {
        // If sliding/ducking, cancel slide and jump immediately
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
            createDust(this.x + 20, this.y + this.height, 6);
        } else if (this.jumpCount < this.maxJumps) {
            this.vy = this.jumpForce * 0.95;
            this.jumpCount++;
            window.soundManager.playDoubleJump();
            createJumpRings(this.x + 20, this.y + this.height);
        } else {
            // Buffer jump input
            this.jumpBuffer = 8;
        }
    }

    duckStart() {
        this.isHoldingDuck = true;
        if (this.isGrounded) {
            this.isSliding = true;
            this.height = this.slideHeight;
            // Anchor feet to ground: top of hitbox moves DOWN, not character going underground
            this.y = 500 - this.slideHeight;
            createSlideSparks(this.x + 10, 500);
        } else {
            // Fast drop while in air (Classic Chrome Dino mechanic!)
            this.vy += 2.8;
        }
    }

    duckEnd() {
        this.isHoldingDuck = false;
        if (this.isGrounded && this.slideTimer <= 0) {
            this.isSliding = false;
            this.height = this.standHeight;
            this.y = 500 - this.standHeight;
        }
    }

    slide() {
        this.duckStart();
        this.slideTimer = this.slideDuration;
    }

    dash() {
        if (this.stamina >= 35 && !this.isDashing) {
            this.stamina -= 35;
            this.isDashing = true;
            this.dashTimer = this.dashDuration;
            this.invulnerableTimer = Math.max(this.invulnerableTimer, this.dashDuration);
            window.soundManager.playDash();
            createGhostTrail(this);
        }
    }

    update() {
        this.animFrame++;

        // Stamina recharge: bonus only active if avatar is unlocked
        const isAvatarUnlocked = unlockedAvatars.includes(this.avatar.id);
        const rechargeRate = 0.45 * (isAvatarUnlocked ? (this.avatar.dashBonus || 1.0) : 1.0);
        if (this.stamina < this.maxStamina) {
            this.stamina = Math.min(this.maxStamina, this.stamina + rechargeRate);
        }

        // Slide / Duck timer & state
        if (this.isSliding) {
            if (this.slideTimer > 0) this.slideTimer--;
            if (this.animFrame % 5 === 0) {
                createSlideSparks(this.x + 5, 500);
            }
            if (this.slideTimer <= 0 && !this.isHoldingDuck) {
                this.isSliding = false;
                this.height = this.standHeight;
                this.y = 500 - this.standHeight;
            }
            // Always keep feet anchored to ground while sliding
            if (this.isGrounded) {
                this.y = 500 - this.height;
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
        if (this.ptoTimer > 0) this.ptoTimer--;
        if (this.invulnerableTimer > 0) this.invulnerableTimer--;

        // Gravity & Jump Physics
        if (!this.isGrounded) {
            if (this.coyoteTimer > 0) this.coyoteTimer--;
            // Extra fast fall if holding down in air
            if (this.isHoldingDuck) {
                this.vy += this.gravity * 1.6;
            } else {
                this.vy += this.gravity;
            }
            this.y += this.vy;

            if (this.y >= 500 - this.height) {
                this.y = 500 - this.height;
                this.vy = 0;
                this.isGrounded = true;
                this.jumpCount = 0;
                this.coyoteTimer = 0;
                createDust(this.x + 20, 500, 4);

                if (this.isHoldingDuck) {
                    this.isSliding = true;
                    this.height = this.slideHeight;
                    this.y = 500 - this.slideHeight;
                }

                if (this.jumpBuffer > 0) {
                    this.jumpBuffer = 0;
                    this.jump();
                }
            }
        } else {
            this.coyoteTimer = 5;
            this.runCycle += 0.08 * (gameSpeed / 2.0);
        }

        if (this.jumpBuffer > 0) {
            this.jumpBuffer--;
        }
    }
    // Authentic human baseball-slide pose:
    // Head and torso at the back (left), leading leg & shoes extended forward (right)
    drawSlidePose(px, skin, accent) {
        const isWoman = this.avatar.id.includes('woman');
        const groundY = 500; // floor track line
        const spark = Math.sin(this.animFrame * 0.25) * 1.5;

        ctx.save();
        ctx.translate(px, groundY);

        // Ground contact shadow under sliding body
        ctx.save();
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = '#010408';
        ctx.beginPath();
        ctx.ellipse(20, -1, 56, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 1. Supporting rear arm bracing against the ground (on the left)
        ctx.fillStyle = this.avatar.shirtColor || accent;
        ctx.strokeStyle = '#06101d'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-28, -20, 18, 8, 3);
        ctx.fill(); ctx.stroke();
        // Hand flat against the floor
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.roundRect(-30, -10, 14, 5, 2);
        ctx.fill();

        // 2. Secondary (tucked) leg underneath
        ctx.fillStyle = this.avatar.pantsColor || '#17243b';
        ctx.strokeStyle = '#06101d'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(4, -18, 24, 10, 3);
        ctx.fill(); ctx.stroke();
        // Bent knee joint
        ctx.fillStyle = '#2d3d55';
        ctx.beginPath(); ctx.arc(26, -13, 5, 0, Math.PI * 2); ctx.fill();

        // 3. Lead leg extended straight forward (shooting to the right)
        ctx.fillStyle = this.avatar.pantsColor || '#17243b';
        ctx.strokeStyle = '#06101d'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(18, -12 + spark, 46, 10, 3);
        ctx.fill(); ctx.stroke();
        // Front shoe slicing forward
        ctx.fillStyle = '#07111e'; ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(60, -12 + spark, 18, 8, 3);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e8f4ff';
        ctx.fillRect(63, -7 + spark, 13, 1.8);

        // 4. Human Torso — leaning backward low to ground
        const bodyGrad = ctx.createLinearGradient(-16, -30, 26, -12);
        bodyGrad.addColorStop(0, '#0c2236');
        bodyGrad.addColorStop(0.45, accent);
        bodyGrad.addColorStop(1, this.avatar.shirtColor || accent);
        ctx.fillStyle = bodyGrad;
        ctx.strokeStyle = '#06101d'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-16, -28, 40, 18, 5);
        ctx.fill(); ctx.stroke();

        // Shirt collar & necktie / blouse
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(-10, -26); ctx.lineTo(-2, -26); ctx.lineTo(-6, -20); ctx.closePath();
        ctx.fill();
        if (!isWoman) {
            ctx.fillStyle = this.avatar.id === 'dev' ? '#0b5d8c' : '#ef4444';
            ctx.beginPath();
            ctx.moveTo(-7, -24); ctx.lineTo(-4, -24); ctx.lineTo(8, -17); ctx.lineTo(5, -17);
            ctx.closePath(); ctx.fill();
        }

        // 5. Front balancing arm (across chest)
        ctx.fillStyle = this.avatar.shirtColor || accent;
        ctx.strokeStyle = '#06101d'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(8, -26, 20, 8, 3);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = skin;
        ctx.beginPath(); ctx.arc(28, -22, 4.5, 0, Math.PI * 2); ctx.fill();

        // 6. Human Head — at the BACK (left), tilted back, focused forward
        // Neck
        ctx.fillStyle = skin;
        ctx.fillRect(-18, -32, 7, 7);
        // Head
        ctx.beginPath(); ctx.arc(-14, -36, 11, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#06101d'; ctx.lineWidth = 1.6; ctx.stroke();

        // Distinct Hair & Features
        ctx.fillStyle = this.avatar.hairColor || '#1b2430';
        if (isWoman) {
            // Feminine sleek hair + ponytail flowing back
            ctx.beginPath();
            ctx.arc(-15, -37, 11.5, Math.PI * 0.6, Math.PI * 2.2);
            ctx.fill();
            // Ponytail streaming to the left
            ctx.beginPath();
            ctx.moveTo(-24, -36);
            ctx.quadraticCurveTo(-36, -38, -34, -28);
            ctx.quadraticCurveTo(-26, -32, -24, -34);
            ctx.fill();
            // Hair scrunchie
            ctx.fillStyle = accent;
            ctx.beginPath(); ctx.arc(-24, -35, 2.5, 0, Math.PI * 2); ctx.fill();

            // Female eye & lashes
            ctx.fillStyle = '#172033';
            ctx.beginPath(); ctx.arc(-7.5, -36, 1.8, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(-7, -36.5, 0.6, 0, Math.PI * 2); ctx.fill();
            // Eyelash
            ctx.strokeStyle = '#172033'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(-9, -38); ctx.lineTo(-6, -37.5); ctx.stroke();
        } else {
            // Masculine clean cropped haircut
            ctx.beginPath();
            ctx.arc(-15, -38, 11.5, Math.PI * 0.7, Math.PI * 2.2);
            ctx.fill();
            // Sideburn
            ctx.fillRect(-22, -37, 4, 7);

            // Male eye & brow
            ctx.fillStyle = '#172033';
            ctx.beginPath(); ctx.arc(-7.5, -36, 1.8, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(-7, -36.5, 0.6, 0, Math.PI * 2); ctx.fill();
            // Eyebrow
            ctx.strokeStyle = '#172033'; ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.moveTo(-10, -38.5); ctx.lineTo(-5.5, -38); ctx.stroke();
        }

        // Determined mouth
        ctx.strokeStyle = '#7b3f2b'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-10, -31); ctx.lineTo(-6, -31); ctx.stroke();

        ctx.restore();
    }

    draw() {
        ctx.save();
        const px = this.x;
        const py = this.y;
        const skin = this.avatar.skinColor || '#d9a77d';
        const accent = this.avatar.color || '#39d8ff';
        const t = this.runCycle;
        const leg = Math.sin(t) * 7;
        const arm = Math.cos(t) * 5;
        const bob = this.isGrounded ? Math.abs(Math.sin(t * 1.05)) * 1.8 : 0;
        const cx = px + 22;

        // Ground contact shadow
        ctx.save();
        ctx.globalAlpha = this.isGrounded ? 0.42 : 0.16;
        ctx.fillStyle = '#020611';
        ctx.beginPath();
        ctx.ellipse(cx, 503, this.isGrounded ? 24 : 15, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (this.invulnerableTimer > 0 && Math.floor(this.animFrame / 3) % 2 === 0) ctx.globalAlpha = 0.48;

        // Shield / dash / buff aura
        if (this.shield > 0 || this.isDashing || this.coffeeTimer > 0) {
            const aura = this.coffeeTimer > 0 ? '#ffb72e' : accent;
            ctx.save();
            ctx.strokeStyle = aura;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.72;
            ctx.shadowColor = aura;
            ctx.shadowBlur = 16;
            ctx.setLineDash(this.shield > 0 ? [6, 5] : []);
            ctx.beginPath();
            ctx.arc(cx, py + 34, 35 + Math.sin(this.animFrame * 0.18) * 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // --- Ground Slide Pose ---
        if (this.isSliding && this.isGrounded) {
            ctx.restore();
            if (this.invulnerableTimer > 0 && Math.floor(this.animFrame / 3) % 2 === 0) {
                ctx.globalAlpha = 0.48;
            }
            this.drawSlidePose(px, skin, accent);
            ctx.globalAlpha = 1;
            return;
        }

        ctx.save();
        ctx.translate(px, py - bob);
        ctx.rotate(this.isGrounded ? 0.035 : (this.vy < 0 ? -0.075 : 0.08));

        // Motion streaks during dash
        if (this.isDashing || this.coffeeTimer > 0) {
            const c = this.coffeeTimer > 0 ? '#ffb72e' : accent;
            ctx.save();
            ctx.globalAlpha = 0.38;
            ctx.strokeStyle = c;
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(4, 22 + i * 9);
                ctx.lineTo(-16 - i * 7, 22 + i * 9);
                ctx.stroke();
            }
            ctx.restore();
        }

        const isWoman = this.avatar.id.includes('woman');
        const isMuscular = this.avatar.id.includes('muscular');
        const torsoX = isMuscular ? 5 : (isWoman ? 8 : 7);
        const torsoW = isMuscular ? 34 : (isWoman ? 28 : 30);

        // 1. Legs & Shoes
        const drawLeg = (x, offset, back=false) => {
            ctx.save();
            ctx.translate(x, 40);
            ctx.rotate(offset * 0.018);
            ctx.fillStyle = this.avatar.pantsColor || '#17243b';
            ctx.strokeStyle = '#06101d';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(0, 0, 11, 22, 3);
            ctx.fill(); ctx.stroke();
            // Polished Shoes
            ctx.fillStyle = '#0b1422';
            ctx.beginPath();
            ctx.roundRect(-3, 17, 16, 8, 3);
            ctx.fill();
            ctx.fillStyle = accent;
            ctx.fillRect(2, 21, 8, 2);
            ctx.restore();
        };
        if (this.isGrounded) {
            drawLeg(8, leg, true); drawLeg(25, -leg);
        } else {
            drawLeg(8, -2); drawLeg(25, 4);
        }

        // 2. Torso / Jacket / Blouse
        const bodyGrad = ctx.createLinearGradient(torsoX, 13, torsoX + torsoW, 46);
        bodyGrad.addColorStop(0, this.avatar.shirtColor || accent);
        bodyGrad.addColorStop(0.55, accent);
        bodyGrad.addColorStop(1, '#0c2236');
        ctx.fillStyle = bodyGrad;
        ctx.strokeStyle = '#06101d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (isWoman) {
            // Feminine tailored waist jacket / blouse
            ctx.roundRect(torsoX, 14, torsoW, 30, [6, 6, 8, 8]);
        } else {
            // Masculine athletic cut blazer / shirt
            ctx.roundRect(torsoX, 14, torsoW, 31, 5);
        }
        ctx.fill(); ctx.stroke();

        // 3. Shirt collar & tie / blouse neckline
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(18, 16); ctx.lineTo(28, 16); ctx.lineTo(23, 23); ctx.closePath(); ctx.fill();

        if (!isWoman) {
            // Necktie for men
            ctx.fillStyle = this.avatar.id === 'dev' ? '#0b5d8c' : '#ef4444';
            ctx.beginPath();
            ctx.moveTo(21.5, 20); ctx.lineTo(25.5, 20); ctx.lineTo(24, 38); ctx.lineTo(21, 38); ctx.closePath(); ctx.fill();
        }

        // ID badge
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#1e3448';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(25, 28, 8, 10, 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = accent; ctx.fillRect(27, 30, 4, 2);

        // 4. Arms & Hands
        const armDraw = (x, off, front) => {
            ctx.save(); ctx.translate(x, 21); ctx.rotate(off * 0.025);
            ctx.fillStyle = this.avatar.shirtColor || accent;
            ctx.strokeStyle = '#06101d'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(0, 0, front ? 9 : 8, 18, 3); ctx.fill(); ctx.stroke();
            // Human hand
            ctx.fillStyle = skin;
            ctx.beginPath(); ctx.arc(front ? 4.5 : 4, 19, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        };
        armDraw(8, -arm, false); armDraw(29, arm, true);

        // 5. Human Neck + Head
        ctx.fillStyle = skin;
        ctx.fillRect(19, 8, 8, 8);
        ctx.beginPath(); ctx.arc(23, 7.5, 11.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#06101d'; ctx.lineWidth = 1.6; ctx.stroke();

        // 6. Distinct Hairstyle & Human Facial Features
        ctx.fillStyle = this.avatar.hairColor || '#1b2430';
        if (isWoman) {
            // Elegant feminine hair wrapped over crown + flowing ponytail
            ctx.beginPath();
            ctx.arc(22, 6, 12, Math.PI * 0.7, Math.PI * 2.2);
            ctx.fill();
            // Sleek flowing ponytail streaming back
            ctx.beginPath();
            ctx.moveTo(11, 7);
            ctx.quadraticCurveTo(-1, 9 + Math.sin(t) * 2, 2, 20 + Math.sin(t) * 3);
            ctx.quadraticCurveTo(8, 14, 11, 10);
            ctx.fill();
            // Hair scrunchie band
            ctx.fillStyle = accent;
            ctx.beginPath(); ctx.arc(11, 8, 2.5, 0, Math.PI * 2); ctx.fill();

            // Feminine sparkling eye with lash
            ctx.fillStyle = '#172033';
            ctx.beginPath(); ctx.arc(28, 8, 1.9, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(28.6, 7.5, 0.65, 0, Math.PI * 2); ctx.fill();
            // Eyelash
            ctx.strokeStyle = '#172033'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(26.5, 6.2); ctx.lineTo(29.8, 6.8); ctx.stroke();
            // Delicate lips / smile
            ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = 1.1;
            ctx.beginPath(); ctx.arc(28, 12.5, 2.5, 0.1, 1.1); ctx.stroke();
        } else {
            // Clean masculine haircut (styled side taper, no floppy ear blobs!)
            ctx.beginPath();
            ctx.arc(22, 5, 12, Math.PI * 0.7, Math.PI * 2.25);
            ctx.fill();
            // Side part taper
            ctx.fillRect(13, 5, 4, 7);

            // Masculine focused eye & strong brow
            ctx.fillStyle = '#172033';
            ctx.beginPath(); ctx.arc(28, 8.5, 1.9, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(28.6, 8, 0.65, 0, Math.PI * 2); ctx.fill();
            // Brow
            ctx.strokeStyle = '#172033'; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(26, 6.2); ctx.lineTo(30, 6.5); ctx.stroke();
            // Determined mouth
            ctx.strokeStyle = '#7b3f2b'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(26.5, 13); ctx.lineTo(29.5, 13); ctx.stroke();
        }

        ctx.restore();
        ctx.restore();
    }
}

// Particle System
let particles = [];

function createDust(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 16,
            y: y + (Math.random() - 0.5) * 4,
            vx: -gameSpeed * 0.4 - Math.random() * 2,
            vy: -Math.random() * 1.5,
            size: 3 + Math.random() * 3,
            color: 'rgba(203, 213, 225, 0.5)',
            life: 14
        });
    }
}

function createSlideSparks(x, y) {
    for (let i = 0; i < 2; i++) {
        particles.push({
            x: x,
            y: y - 2,
            vx: -gameSpeed * 0.8 - Math.random() * 3,
            vy: -Math.random() * 2,
            size: 2 + Math.random() * 2,
            color: Math.random() > 0.5 ? '#f59e0b' : '#38bdf8',
            life: 12
        });
    }
}

function createJumpRings(x, y) {
    particles.push({
        type: 'ring',
        x: x,
        y: y,
        radius: 6,
        maxRadius: 26,
        color: '#38bdf8',
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
        color: player.coffeeTimer > 0 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(56, 189, 248, 0.4)',
        life: 8
    });
}

function createBlastConfetti(x, y) {
    const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#34d399', '#a855f7'];
    for (let i = 0; i < 16; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 6;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            size: 3 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 20
        });
    }
}

function createCoffeeSteam(x, y) {
    particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -2 - Math.random() * 1.5,
        size: 3 + Math.random() * 3,
        color: 'rgba(251, 191, 36, 0.4)',
        life: 14
    });
}

function createScorePopup(x, y, text, color = '#fbbf24') {
    particles.push({
        type: 'text',
        x: x,
        y: y,
        vy: -1.8,
        text: text,
        color: color,
        life: 30
    });
}

function updateAndDrawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life--;

        if (p.type === 'text') {
            p.y += p.vy;
            ctx.save();
            ctx.font = '900 16px Outfit, sans-serif';
            ctx.fillStyle = p.color;
            ctx.fillText(p.text, p.x, p.y);
            ctx.restore();
        } else if (p.type === 'ring') {
            p.radius += (p.maxRadius - p.radius) * 0.25;
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = p.life / 14;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        } else if (p.type === 'ghost') {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = (p.life / 8) * 0.35;
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

// Layered corporate-night background. Architecture is intentionally brighter and softer
// than hazards so gameplay objects remain readable at a glance.
class BackgroundManager {
    constructor() {
        this.scrollFar = 0;
        this.scrollMid = 0;
        this.scrollNear = 0;
        this.lastBiomeId = null;
        this.time = 0;
    }

    update(speed) {
        this.time += 0.016;
        this.scrollFar = (this.scrollFar - speed * 0.10) % 1000;
        this.scrollMid = (this.scrollMid - speed * 0.26) % 1000;
        this.scrollNear = (this.scrollNear - speed * 0.65) % 1000;
    }

    draw(biome) {
        const far = this.scrollFar, mid = this.scrollMid, near = this.scrollNear, accent = biome.accent;
        const sky = ctx.createLinearGradient(0,0,0,510);
        sky.addColorStop(0,biome.bg1); sky.addColorStop(0.42,biome.bg2); sky.addColorStop(1,'#17263a');
        ctx.fillStyle=sky; ctx.fillRect(0,0,1000,600);
        switch(biome.id){
            case 'cubicles':      this._drawCubicles(far,mid,near,accent); break;
            case 'conference':    this._drawConference(far,mid,near,accent); break;
            case 'cafeteria':     this._drawCafeteria(far,mid,near,accent); break;
            case 'hr_audit':      this._drawHR(far,mid,near,accent); break;
            case 'executive':     this._drawExecutive(far,mid,near,accent); break;
            case 'elevator_exit': this._drawElevator(far,mid,near,accent); break;
            default:              this._drawCubicles(far,mid,near,accent);
        }

        // Atmospheric Depth Scrim: drapes background architecture in soft depth gradient
        // ensuring active gameplay hazards & collectibles on the floor lane have crisp, unmistakable contrast
        const depthScrim = ctx.createLinearGradient(0, 300, 0, 492);
        depthScrim.addColorStop(0, 'rgba(4, 8, 16, 0.0)');
        depthScrim.addColorStop(0.55, 'rgba(4, 8, 16, 0.38)');
        depthScrim.addColorStop(1, 'rgba(4, 8, 16, 0.78)');
        ctx.fillStyle = depthScrim;
        ctx.fillRect(0, 300, 1000, 192);

        this._drawCeiling(near,accent);
        this._drawFloor(near,accent,biome);
    }

    _drawCeiling(near,accent){
        const c=ctx.createLinearGradient(0,0,0,88); c.addColorStop(0,'#050a12'); c.addColorStop(1,'#101b2b');
        ctx.fillStyle=c; ctx.fillRect(0,0,1000,78);
        ctx.fillStyle='rgba(255,255,255,.08)'; ctx.fillRect(0,77,1000,2);
        for(let i=-1;i<8;i++){const x=i*165+near; ctx.fillStyle='#eaf3fb'; ctx.fillRect(x,70,70,4); ctx.fillStyle=accent; ctx.globalAlpha=.34; ctx.fillRect(x,74,70,2); ctx.globalAlpha=1;}
    }

    _drawFloor(near,accent,biome){
        const f=ctx.createLinearGradient(0,492,0,600); f.addColorStop(0,biome.floorColor||'#142233'); f.addColorStop(.25,'#0c1625'); f.addColorStop(1,'#050a12');
        ctx.fillStyle=f; ctx.fillRect(0,492,1000,108);
        ctx.fillStyle=accent; ctx.globalAlpha=.85; ctx.fillRect(0,492,1000,2); ctx.globalAlpha=1;
        ctx.fillStyle='#f5a623'; ctx.globalAlpha=.9; ctx.fillRect(0,499,1000,3); ctx.globalAlpha=1;
        ctx.strokeStyle='rgba(135,162,184,.13)'; ctx.lineWidth=1;
        for(let i=-1;i<17;i++){const x=i*72+near; ctx.beginPath(); ctx.moveTo(x,503); ctx.lineTo(x,600); ctx.stroke();}
        for(let y=520;y<600;y+=25){ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(1000,y); ctx.stroke();}
        const v=ctx.createRadialGradient(500,300,230,500,300,650); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(.75,'rgba(0,0,0,.08)'); v.addColorStop(1,'rgba(0,0,0,.40)');
        ctx.fillStyle=v; ctx.fillRect(0,0,1000,600);
    }

    // ── BIOME 1: CUBICLE MAZE ─────────────────────────────────────────
    _drawCubicles(far,mid,near,accent){
        const p1=ctx.createRadialGradient(160,190,20,160,190,330); p1.addColorStop(0,'rgba(56,189,248,.10)'); p1.addColorStop(1,'rgba(56,189,248,0)'); ctx.fillStyle=p1; ctx.fillRect(0,60,500,400);
        ctx.save(); ctx.globalAlpha=.38;
        const bh=[130,190,105,155,215,135,175,120,200,145];
        for(let i=-1;i<11;i++){const x=i*105+far,h=bh[(i+10)%bh.length]; ctx.fillStyle='#091321'; ctx.fillRect(x,280-h,78,h); ctx.fillStyle='#b9c7d9'; ctx.globalAlpha=.07; for(let r=0;r<5;r++)for(let c=0;c<3;c++)ctx.fillRect(x+12+c*20,255-h+r*25,7,9); ctx.globalAlpha=.38;} ctx.restore();
        ctx.fillStyle='rgba(29,43,61,.92)'; ctx.fillRect(0,112,1000,390); ctx.fillStyle='rgba(255,255,255,.08)'; ctx.fillRect(0,112,1000,2);
        for(let i=-1;i<8;i++){const x=i*170+mid,y=142,w=142,h=190; ctx.save(); ctx.fillStyle='rgba(7,18,31,.72)'; ctx.strokeStyle='rgba(157,185,211,.24)'; ctx.lineWidth=2; ctx.beginPath(); ctx.roundRect(x,y,w,h,8); ctx.fill(); ctx.stroke(); ctx.fillStyle='rgba(40,70,94,.45)'; ctx.fillRect(x+10,y+105,42,75); ctx.fillRect(x+58,y+76,28,104); ctx.fillRect(x+91,y+116,40,64); ctx.fillStyle=accent; ctx.globalAlpha=.13; for(let r=0;r<3;r++){ctx.fillRect(x+18,y+34+r*35,7,10);ctx.fillRect(x+36,y+34+r*35,7,10);ctx.fillRect(x+101,y+40+r*35,7,10);} ctx.globalAlpha=1; const rf=ctx.createLinearGradient(x,y,x+w,y+h); rf.addColorStop(0,'rgba(255,255,255,.10)'); rf.addColorStop(.18,'rgba(255,255,255,.015)'); rf.addColorStop(.48,'rgba(255,255,255,0)'); rf.addColorStop(1,'rgba(0,0,0,.10)'); ctx.fillStyle=rf; ctx.fill(); ctx.restore();}
        for(let i=-1;i<6;i++){const x=i*220+mid*.7,y=346+(i&1)*14; ctx.save(); ctx.shadowColor='rgba(0,0,0,.25)'; ctx.shadowBlur=12; ctx.fillStyle='rgba(46,62,82,.88)'; ctx.beginPath(); ctx.roundRect(x,y,176,108,9); ctx.fill(); ctx.shadowBlur=0; ctx.fillStyle='#101a2b'; ctx.beginPath(); ctx.roundRect(x+16,y+25,62,44,5); ctx.fill(); ctx.beginPath(); ctx.roundRect(x+91,y+25,62,44,5); ctx.fill(); ctx.fillStyle='rgba(56,189,248,.18)'; ctx.fillRect(x+25,y+35,44,2); ctx.fillRect(x+100,y+35,44,2); ctx.fillStyle='rgba(255,255,255,.09)'; ctx.fillRect(x+11,y+80,154,6); ctx.fillStyle='rgba(8,15,27,.7)'; ctx.fillRect(x+25,y+90,6,28); ctx.fillRect(x+145,y+90,6,28); ctx.restore();}
        for(let i=-1;i<8;i++){const x=i*185+near; const g=ctx.createLinearGradient(x,110,x+14,500); g.addColorStop(0,'rgba(105,128,151,.22)'); g.addColorStop(.5,'rgba(11,22,36,.28)'); g.addColorStop(1,'rgba(105,128,151,.10)'); ctx.fillStyle=g; ctx.fillRect(x,112,14,388); ctx.fillStyle='rgba(255,255,255,.06)'; ctx.fillRect(x+2,126,2,360);}
    }

    // ── BIOME 2: CONFERENCE BOARDROOM ─────────────────────────────────
    _drawConference(far,mid,near,accent){
        const pool=ctx.createRadialGradient(500,200,10,500,200,500); pool.addColorStop(0,'rgba(96,165,250,.12)'); pool.addColorStop(1,'rgba(96,165,250,0)'); ctx.fillStyle=pool; ctx.fillRect(0,60,1000,440);
        ctx.fillStyle='rgba(14,22,45,.96)'; ctx.fillRect(0,112,1000,390);
        for(let i=-1;i<6;i++){const x=i*200+(far*0.2); ctx.fillStyle='rgba(30,50,90,.65)'; ctx.strokeStyle='rgba(96,165,250,.18)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.roundRect(x+10,130,175,280,6); ctx.fill(); ctx.stroke();}
        ctx.save(); ctx.fillStyle='rgba(220,235,255,.95)'; ctx.strokeStyle='#60a5fa'; ctx.lineWidth=3; ctx.beginPath(); ctx.roundRect(340+mid*0.02,130,320,200,4); ctx.fill(); ctx.stroke();
        const bc=['#60a5fa','#34d399','#f59e0b','#f43f5e','#a855f7'],bhs=[110,80,140,60,100];
        for(let b=0;b<5;b++){ctx.fillStyle=bc[b]; ctx.globalAlpha=.85; ctx.fillRect(360+mid*0.02+b*55,300-bhs[b],38,bhs[b]); ctx.fillStyle='rgba(0,0,0,.6)'; ctx.globalAlpha=1; ctx.font='900 10px Outfit'; ctx.textAlign='center'; ctx.fillText(['Q1','Q2','Q3','Q4','Q5'][b],379+mid*0.02+b*55,320);}
        ctx.fillStyle='#1e3a6e'; ctx.font='900 14px Outfit'; ctx.textAlign='center'; ctx.fillText('Q3 SYNERGY GROWTH',500+mid*0.02,152); ctx.globalAlpha=1;
        ctx.save(); ctx.globalAlpha=.07; ctx.fillStyle='#60a5fa'; ctx.beginPath(); ctx.moveTo(500+mid*0.02,78); ctx.lineTo(340+mid*0.02,330); ctx.lineTo(660+mid*0.02,330); ctx.closePath(); ctx.fill(); ctx.restore(); ctx.restore();
        for(let i=-1;i<6;i++){const x=i*210+mid*.6; ctx.save(); ctx.fillStyle='rgba(25,40,70,.95)'; ctx.strokeStyle='rgba(96,165,250,.25)'; ctx.lineWidth=2; ctx.beginPath(); ctx.roundRect(x,370,190,80,10); ctx.fill(); ctx.stroke(); ctx.fillStyle='rgba(96,165,250,.07)'; ctx.beginPath(); ctx.roundRect(x+10,375,90,15,4); ctx.fill(); for(let c=0;c<3;c++){ctx.fillStyle='rgba(30,58,110,.85)'; ctx.strokeStyle='rgba(96,165,250,.3)'; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect(x+20+c*58,348,40,26,8); ctx.fill(); ctx.stroke();} ctx.fillStyle='#1d2d4e'; ctx.beginPath(); ctx.roundRect(x+30,380,35,22,3); ctx.fill(); ctx.fillStyle='rgba(96,165,250,.25)'; ctx.fillRect(x+34,384,27,2); ctx.restore();}
        for(let i=-1;i<7;i++){const x=i*185+near; ctx.fillStyle='rgba(18,32,68,.85)'; ctx.fillRect(x,112,16,388); ctx.fillStyle='rgba(96,165,250,.12)'; ctx.fillRect(x+1,120,3,370);}
    }

    // ── BIOME 3: COFFEE PANTRY & CAFE ─────────────────────────────────
    _drawCafeteria(far,mid,near,accent){
        const pool=ctx.createRadialGradient(300,220,20,300,220,450); pool.addColorStop(0,'rgba(245,158,11,.18)'); pool.addColorStop(1,'rgba(245,158,11,0)'); ctx.fillStyle=pool; ctx.fillRect(0,60,1000,440);
        ctx.fillStyle='rgba(38,18,8,.95)'; ctx.fillRect(0,112,1000,390);
        for(let row=0;row<8;row++){const off=(row%2)*55; for(let col=-1;col<10;col++){const bx=col*110+off+(far*0.05),by=118+row*48; ctx.fillStyle=row%2===0?'rgba(70,30,12,.55)':'rgba(55,22,8,.55)'; ctx.strokeStyle='rgba(20,8,3,.6)'; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect(bx,by,100,42,2); ctx.fill(); ctx.stroke();}}
        ctx.save(); const cbx=120+mid*0.05,cby=140; ctx.fillStyle='#1a2e1a'; ctx.strokeStyle='#4ade80'; ctx.lineWidth=4; ctx.beginPath(); ctx.roundRect(cbx,cby,230,160,6); ctx.fill(); ctx.stroke(); ctx.fillStyle='#d1fae5'; ctx.font='900 13px Outfit'; ctx.textAlign='center'; ctx.fillText("TODAY'S MENU",cbx+115,cby+25); ctx.fillStyle='rgba(209,250,229,.8)'; ctx.font='11px Outfit'; ['Quad Espresso ... 4P','Cortado ... 3P','Cold Brew ... 5P','Croissant ... 2P'].forEach((item,idx)=>ctx.fillText(item,cbx+115,cby+50+idx*24)); ctx.strokeStyle='rgba(209,250,229,.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(cbx+20,cby+32); ctx.lineTo(cbx+210,cby+32); ctx.stroke(); ctx.restore();
        for(let i=-1;i<5;i++){const mx=i*250+mid*.55+30,my=320; ctx.save(); ctx.fillStyle='#2a1805'; ctx.strokeStyle='#f59e0b'; ctx.lineWidth=2; ctx.beginPath(); ctx.roundRect(mx,my,80,130,10); ctx.fill(); ctx.stroke(); ctx.fillStyle='#1a0e03'; ctx.beginPath(); ctx.roundRect(mx+10,my+15,60,80,6); ctx.fill(); ['#ef4444','#10b981','#f59e0b'].forEach((c,bi)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(mx+24+bi*18,my+30,5,0,Math.PI*2);ctx.fill();}); ctx.strokeStyle='#94a3b8'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(mx+70,my+50); ctx.lineTo(mx+90,my+80); ctx.stroke(); ctx.fillStyle='#78350f'; ctx.beginPath(); ctx.roundRect(mx+22,my+65,14,22,4); ctx.fill(); ctx.beginPath(); ctx.roundRect(mx+44,my+65,14,22,4); ctx.fill(); ctx.globalAlpha=0.5+Math.sin(this.time*2+i)*0.3; ctx.strokeStyle='#fde68a'; ctx.lineWidth=1.5; for(let s=0;s<3;s++){ctx.beginPath();ctx.moveTo(mx+22+s*11,my+60);ctx.quadraticCurveTo(mx+17+s*11,my+45,mx+22+s*11,my+30);ctx.stroke();} ctx.globalAlpha=1; ctx.fillStyle='rgba(240,230,200,.12)'; ctx.strokeStyle='rgba(251,191,36,.35)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.roundRect(mx+95,my+40,100,90,8); ctx.fill(); ctx.stroke(); ctx.font='20px sans-serif'; ctx.textAlign='center'; ['🍩','🥐','🍰'].forEach((p,pi)=>ctx.fillText(p,mx+115+pi*28,my+90)); ctx.restore();}
        for(let i=0;i<6;i++){const lx=80+i*170+(near*0.3); ctx.save(); ctx.strokeStyle='#6b3a10'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(lx,78); ctx.lineTo(lx,110); ctx.stroke(); const lg=ctx.createRadialGradient(lx,115,2,lx,115,22); lg.addColorStop(0,'rgba(253,186,116,.9)'); lg.addColorStop(0.5,'rgba(234,88,12,.5)'); lg.addColorStop(1,'rgba(234,88,12,0)'); ctx.fillStyle=lg; ctx.beginPath(); ctx.arc(lx,115,22,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#7c2d12'; ctx.beginPath(); ctx.arc(lx,112,9,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=0.06; ctx.fillStyle='#fde68a'; ctx.beginPath(); ctx.moveTo(lx,115); ctx.lineTo(lx-60,480); ctx.lineTo(lx+60,480); ctx.closePath(); ctx.fill(); ctx.globalAlpha=1; ctx.restore();}
    }

    // ── BIOME 4: HR COMPLIANCE DEPT ───────────────────────────────────
    _drawHR(far,mid,near,accent){
        const pool=ctx.createRadialGradient(500,180,10,500,180,500); pool.addColorStop(0,'rgba(244,63,94,.14)'); pool.addColorStop(1,'rgba(244,63,94,0)'); ctx.fillStyle=pool; ctx.fillRect(0,60,1000,440);
        ctx.fillStyle='rgba(28,5,10,.97)'; ctx.fillRect(0,112,1000,390);
        ctx.save(); ctx.globalAlpha=.10; ctx.strokeStyle='#f43f5e'; ctx.lineWidth=18; for(let d=-200;d<1200;d+=50){ctx.beginPath();ctx.moveTo(d,112);ctx.lineTo(d+400,512);ctx.stroke();} ctx.restore();
        [{title:'COMPLIANCE',sub:'MANDATORY TRAINING\nQ4 DEADLINE',color:'#f43f5e'},{title:'POLICY 4.7b',sub:'NO UNAUTHORIZED\nEARLY EXITS',color:'#fbbf24'},{title:'NOTICE',sub:'ALL BAGS\nSUBJECT TO AUDIT',color:'#f43f5e'},{title:'FORM 27-C',sub:'EXIT INTERVIEW\nREQUIRED',color:'#ef4444'}].forEach((p,pi)=>{
            const px=80+pi*230+mid*0.06,py=140; ctx.save(); ctx.fillStyle='#0f0307'; ctx.strokeStyle=p.color; ctx.lineWidth=3; ctx.beginPath(); ctx.roundRect(px,py,170,120,4); ctx.fill(); ctx.stroke(); ctx.fillStyle=p.color; ctx.fillRect(px,py,170,28); ctx.fillStyle='#fff'; ctx.font='900 11px Outfit'; ctx.textAlign='center'; ctx.fillText(p.title,px+85,py+19); ctx.fillStyle='rgba(255,255,255,.75)'; ctx.font='10px Outfit'; p.sub.split('\n').forEach((line,li)=>ctx.fillText(line,px+85,py+52+li*18)); ctx.strokeStyle=p.color; ctx.lineWidth=2; ctx.globalAlpha=.6; ctx.font='900 18px Outfit'; ctx.fillStyle=p.color; ctx.save(); ctx.translate(px+130,py+85); ctx.rotate(-0.35); ctx.strokeRect(-30,-12,60,24); ctx.fillText('FINAL',0,5); ctx.restore(); ctx.globalAlpha=1; ctx.restore();
        });
        for(let i=-1;i<6;i++){const fx=i*220+mid*.55,fy=340; ctx.save(); ctx.fillStyle='#1f0608'; ctx.strokeStyle='rgba(244,63,94,.4)'; ctx.lineWidth=2; ctx.beginPath(); ctx.roundRect(fx,fy,90,150,4); ctx.fill(); ctx.stroke(); for(let d=0;d<4;d++){ctx.fillStyle='#2d0a10'; ctx.strokeStyle='rgba(244,63,94,.3)'; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect(fx+6,fy+8+d*34,78,28,3); ctx.fill(); ctx.stroke(); ctx.fillStyle='#7f1d1d'; ctx.beginPath(); ctx.roundRect(fx+32,fy+19+d*34,26,6,3); ctx.fill(); ctx.fillStyle='rgba(255,255,255,.15)'; ctx.beginPath(); ctx.roundRect(fx+10,fy+11+d*34,42,10,2); ctx.fill();} ctx.fillStyle='#fff8f0'; ctx.globalAlpha=.8; for(let pp=0;pp<5;pp++){ctx.save();ctx.translate(fx+10+pp*12,fy+2);ctx.rotate((pp-2)*0.06);ctx.fillRect(0,0,12,20);ctx.restore();} ctx.globalAlpha=1; ctx.restore();}
        ctx.save(); ctx.globalAlpha=.3; ctx.strokeStyle='#f43f5e'; ctx.lineWidth=6; ctx.setLineDash([30,20]); ctx.beginPath(); ctx.moveTo(0,460); ctx.lineTo(1000,460); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
        for(let i=-1;i<7;i++){const x=i*185+near; ctx.fillStyle='rgba(40,6,12,.9)'; ctx.fillRect(x,112,16,388); ctx.fillStyle='rgba(244,63,94,.20)'; ctx.fillRect(x+1,120,3,370);}
    }

    // ── BIOME 5: EXECUTIVE PENTHOUSE ──────────────────────────────────
    _drawExecutive(far,mid,near,accent){
        const pool=ctx.createRadialGradient(200,200,10,200,200,400); pool.addColorStop(0,'rgba(192,132,252,.12)'); pool.addColorStop(1,'rgba(192,132,252,0)'); ctx.fillStyle=pool; ctx.fillRect(0,60,1000,440);
        ctx.fillStyle='rgba(8,3,18,.98)'; ctx.fillRect(0,112,1000,390);
        ctx.save(); ctx.globalAlpha=.55; const sl=[120,200,140,180,250,130,170,110,190,160]; for(let i=-1;i<11;i++){const bx=i*105+far,bh=sl[(i+10)%sl.length]; const bg=ctx.createLinearGradient(bx,280-bh,bx+75,280); bg.addColorStop(0,'#1a0a30'); bg.addColorStop(1,'#0d0520'); ctx.fillStyle=bg; ctx.fillRect(bx,280-bh,75,bh); ctx.fillStyle='rgba(192,132,252,.25)'; for(let r=0;r<6;r++)for(let c=0;c<3;c++){if(Math.sin(bx+r*c*7)>0.3)ctx.fillRect(bx+10+c*22,255-bh+r*22,6,8);}} ctx.restore();
        for(let i=-1;i<7;i++){const wx=i*165+mid*.3; ctx.fillStyle='rgba(234,179,8,.35)'; ctx.fillRect(wx,112,4,388); ctx.fillStyle='rgba(234,179,8,.20)'; ctx.fillRect(wx,260,165,3); const sh=ctx.createLinearGradient(wx+5,115,wx+160,380); sh.addColorStop(0,'rgba(255,255,255,.04)'); sh.addColorStop(.3,'rgba(255,255,255,.01)'); sh.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=sh; ctx.fillRect(wx+5,115,158,375);}
        for(let i=-1;i<5;i++){const dx=i*280+mid*.5,dy=350; ctx.save(); const dg=ctx.createLinearGradient(dx,dy,dx+220,dy+80); dg.addColorStop(0,'#2d1a08'); dg.addColorStop(.5,'#1a0d04'); dg.addColorStop(1,'#2d1a08'); ctx.fillStyle=dg; ctx.strokeStyle='rgba(234,179,8,.5)'; ctx.lineWidth=2; ctx.beginPath(); ctx.roundRect(dx,dy,220,90,8); ctx.fill(); ctx.stroke(); ctx.fillStyle='rgba(234,179,8,.6)'; ctx.fillRect(dx+10,dy+4,200,2); ctx.fillStyle='#0f0f0f'; ctx.beginPath(); ctx.roundRect(dx+55,dy+10,70,45,4); ctx.fill(); ctx.fillStyle='rgba(192,132,252,.3)'; ctx.fillRect(dx+60,dy+15,60,2); ctx.fillStyle='#78350f'; ctx.strokeStyle='rgba(234,179,8,.7)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.roundRect(dx+150,dy+15,50,40,4); ctx.fill(); ctx.stroke(); ctx.fillStyle='#fde68a'; ctx.font='900 8px Outfit'; ctx.textAlign='center'; ctx.fillText('TROPHY',dx+175,dy+33); ctx.fillText('OF YEAR',dx+175,dy+44); ctx.restore();}
        for(let i=-1;i<7;i++){const cx2=i*185+near; const cg=ctx.createLinearGradient(cx2,112,cx2+18,500); cg.addColorStop(0,'rgba(234,179,8,.35)'); cg.addColorStop(.5,'rgba(60,20,80,.4)'); cg.addColorStop(1,'rgba(234,179,8,.20)'); ctx.fillStyle=cg; ctx.fillRect(cx2,112,18,388); ctx.fillStyle='rgba(234,179,8,.5)'; ctx.fillRect(cx2-4,112,26,8);}
    }

    // ── BIOME 6: ELEVATOR EXIT ────────────────────────────────────────
    _drawElevator(far,mid,near,accent){
        const pool=ctx.createRadialGradient(500,250,10,500,250,500); pool.addColorStop(0,'rgba(52,211,153,.16)'); pool.addColorStop(1,'rgba(52,211,153,0)'); ctx.fillStyle=pool; ctx.fillRect(0,60,1000,440);
        const wg=ctx.createLinearGradient(0,112,0,500); wg.addColorStop(0,'rgba(15,30,22,.98)'); wg.addColorStop(1,'rgba(8,20,15,.98)'); ctx.fillStyle=wg; ctx.fillRect(0,112,1000,390);
        for(let i=-1;i<6;i++){const mpx=i*190+far*.06; ctx.fillStyle='rgba(20,50,38,.7)'; ctx.strokeStyle='rgba(52,211,153,.2)'; ctx.lineWidth=2; ctx.beginPath(); ctx.roundRect(mpx+5,118,170,320,6); ctx.fill(); ctx.stroke(); ctx.strokeStyle='rgba(52,211,153,.08)'; ctx.lineWidth=1.5; for(let v=0;v<4;v++){ctx.beginPath();ctx.moveTo(mpx+20+v*35,125);ctx.quadraticCurveTo(mpx+30+v*35,200+v*20,mpx+15+v*35,420);ctx.stroke();}}
        [150+mid*0.15,550+mid*0.15].forEach(ex=>{ctx.save(); ctx.fillStyle='rgba(16,185,129,.15)'; ctx.strokeStyle='#34d399'; ctx.lineWidth=4; ctx.beginPath(); ctx.roundRect(ex-5,130,210,340,6); ctx.fill(); ctx.stroke(); const ld=ctx.createLinearGradient(ex,135,ex+95,465); ld.addColorStop(0,'#0d2e22'); ld.addColorStop(.5,'#1a4d38'); ld.addColorStop(1,'#0d2e22'); ctx.fillStyle=ld; ctx.fillRect(ex,135,97,330); const rd=ctx.createLinearGradient(ex+103,135,ex+200,465); rd.addColorStop(0,'#0d2e22'); rd.addColorStop(.5,'#1a4d38'); rd.addColorStop(1,'#0d2e22'); ctx.fillStyle=rd; ctx.fillRect(ex+103,135,97,330); ctx.fillStyle='#000'; ctx.fillRect(ex+97,135,6,330); ctx.fillStyle='#34d399'; ctx.strokeStyle='#ecfdf5'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(ex+91,295,8,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(ex+109,295,8,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,.05)'; ctx.fillRect(ex+15,140,4,320); ctx.fillRect(ex+120,140,4,320); ctx.globalAlpha=0.4+Math.sin(this.time*3)*0.3; const pg=ctx.createRadialGradient(ex+100,150,2,ex+100,150,30); pg.addColorStop(0,'#34d399'); pg.addColorStop(1,'rgba(52,211,153,0)'); ctx.fillStyle=pg; ctx.fillRect(ex+70,130,60,50); ctx.globalAlpha=1; ctx.restore();});
        for(let i=0;i<4;i++){const esx=120+i*250+near*0.2; ctx.save(); ctx.strokeStyle='#374151'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(esx,78); ctx.lineTo(esx,110); ctx.stroke(); ctx.fillStyle='#064e3b'; ctx.strokeStyle='#34d399'; ctx.lineWidth=2; ctx.beginPath(); ctx.roundRect(esx-35,110,70,24,4); ctx.fill(); ctx.stroke(); ctx.globalAlpha=0.6+Math.sin(this.time*2+i)*0.2; ctx.fillStyle='#34d399'; ctx.font='900 12px Outfit'; ctx.textAlign='center'; ctx.fillText('EXIT',esx,127); ctx.globalAlpha=1; ctx.restore();}
        for(let i=-1;i<4;i++){const rdx=i*320+mid*.45,rdy=370; ctx.save(); ctx.fillStyle='rgba(6,78,59,.85)'; ctx.strokeStyle='rgba(52,211,153,.4)'; ctx.lineWidth=2; ctx.beginPath(); ctx.roundRect(rdx,rdy,260,80,8); ctx.fill(); ctx.stroke(); ctx.fillStyle='rgba(52,211,153,.15)'; ctx.fillRect(rdx+10,rdy+5,240,4); ctx.fillStyle='#065f46'; ctx.beginPath(); ctx.roundRect(rdx+90,rdy+15,80,28,4); ctx.fill(); ctx.fillStyle='#34d399'; ctx.font='900 10px Outfit'; ctx.textAlign='center'; ctx.fillText('LOBBY EXIT',rdx+130,rdy+33); ctx.restore();}
        for(let i=-1;i<7;i++){const cpx=i*185+near; const cpg=ctx.createLinearGradient(cpx,112,cpx+16,500); cpg.addColorStop(0,'rgba(52,211,153,.3)'); cpg.addColorStop(.5,'rgba(6,40,28,.5)'); cpg.addColorStop(1,'rgba(52,211,153,.15)'); ctx.fillStyle=cpg; ctx.fillRect(cpx,112,16,388); ctx.fillStyle='rgba(52,211,153,.15)'; ctx.fillRect(cpx+2,120,3,370);}
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
            case 'CHAIR':
                // Ergonomic mesh rolling chair with caution stripes
                this.width = 46;
                this.height = 54;
                this.y = 500 - this.height;
                break;
            case 'CALENDAR':
                // "Quick Sync?" Meeting block (Jump)
                this.width = 54;
                this.height = 50;
                this.y = 500 - this.height;
                this.title = 'SYNC?';
                this.subtitle = '30m';
                break;
            case 'LAPTOP':
                // Tripping Laptop with electric sparking cords (Jump)
                this.width = 48;
                this.height = 30;
                this.y = 500 - this.height;
                break;
            case 'TASK_BOULDER':
                // Rolling Giant "URGENT TASK" Boulder (Jump)
                this.width = 52;
                this.height = 52;
                this.y = 500 - this.height;
                this.rot = 0;
                break;
            case 'FLYING_DRONE':
                // Overhead Security Drone / Surveillance Scanner (Slide Under)
                this.width = 58;
                this.height = 36;
                this.y = 416; // Overhead: hits standing player (y=432), safe when sliding (y=468)
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
        const pulse = 0.9 + Math.sin(this.animFrame * 0.13) * 0.12;
        const x = this.x, y = this.y, w = this.width, h = this.height;

        // Ground Hazard Footprint: vibrant danger zone marker on the track floor
        ctx.save();
        ctx.fillStyle = '#01040a';
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.ellipse(x + w / 2, 503, Math.max(20, w * 0.52), 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing neon red hazard tick bar underneath
        ctx.globalAlpha = 0.35 + Math.sin(this.animFrame * 0.2) * 0.2;
        ctx.fillStyle = '#ff2b43';
        ctx.beginPath();
        ctx.roundRect(x - 4, 500, w + 8, 4, 2);
        ctx.fill();
        ctx.restore();

        const hazard = (color='#ff5722') => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.shadowColor = color;
            ctx.shadowBlur = 18 * pulse;
            ctx.beginPath();
            ctx.roundRect(x - 3, y - 3, w + 6, h + 6, 7);
            ctx.stroke();
            ctx.shadowBlur = 0;
        };
        const stripe = (sx, sy, sw, sh, color='#f9c74f') => {
            ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip();
            ctx.fillStyle = '#17202d'; ctx.fillRect(sx, sy, sw, sh);
            ctx.fillStyle = color;
            for (let k = -sh; k < sw + sh; k += 12) {
                ctx.save(); ctx.translate(sx + k, sy); ctx.rotate(-0.6); ctx.fillRect(0, 0, 5, sh * 2); ctx.restore();
            }
            ctx.restore();
        };

        switch (this.type) {
            case 'CHAIR': {
                hazard('#ff9f1c');
                // Backrest
                const back = ctx.createLinearGradient(x+6,y+2,x+40,y+30);
                back.addColorStop(0,'#27384d'); back.addColorStop(1,'#0b1422');
                ctx.fillStyle=back; ctx.strokeStyle='#07111d'; ctx.lineWidth=2;
                ctx.beginPath(); ctx.roundRect(x+7,y+5,32,28,6); ctx.fill(); ctx.stroke();
                // Mesh holes
                ctx.fillStyle='rgba(255,255,255,.12)';
                for(let r=0;r<3;r++) for(let c=0;c<4;c++) ctx.fillRect(x+11+c*7,y+10+r*6,3,2);
                // Seat
                ctx.fillStyle='#34495e'; ctx.beginPath(); ctx.roundRect(x+3,y+31,40,11,5); ctx.fill();
                ctx.fillStyle='#ffb72e'; ctx.fillRect(x+8,y+34,30,2);
                // Stem + base
                ctx.fillStyle='#aab8c5'; ctx.fillRect(x+20,y+42,6,8);
                ctx.strokeStyle='#aab8c5'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x+23,y+49); ctx.lineTo(x+7,y+52); ctx.moveTo(x+23,y+49); ctx.lineTo(x+39,y+52); ctx.stroke();
                ctx.fillStyle='#ffb72e'; ctx.beginPath(); ctx.arc(x+7,y+53,3.5,0,Math.PI*2); ctx.arc(x+39,y+53,3.5,0,Math.PI*2); ctx.fill();
                // Hazard badge
                ctx.fillStyle='#ff5722'; ctx.beginPath(); ctx.arc(x+43,y+5,6,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#fff'; ctx.font='900 8px Outfit'; ctx.textAlign='center'; ctx.fillText('!',x+43,y+8);
                break;
            }
            case 'CALENDAR': {
                hazard('#ff4d5a');
                // Paper with drop shadow
                ctx.fillStyle='#f8fafc'; ctx.beginPath(); ctx.roundRect(x,y+7,w,h-7,6); ctx.fill();
                ctx.fillStyle='#e63946'; ctx.beginPath(); ctx.roundRect(x,y,w,18,[6,6,0,0]); ctx.fill();
                // top tabs
                ctx.fillStyle='#17202d'; ctx.fillRect(x+8,y-4,5,8); ctx.fillRect(x+w-13,y-4,5,8);
                // header label
                ctx.fillStyle='#fff'; ctx.font='900 8px Outfit'; ctx.textAlign='left'; ctx.fillText('MEETING',x+7,y+13);
                // calendar grid
                ctx.fillStyle='#cbd5e1';
                for(let r=0;r<2;r++) for(let c=0;c<4;c++) ctx.fillRect(x+8+c*10,y+26+r*9,6,5);
                ctx.fillStyle='#e63946'; ctx.fillRect(x+28,y+26,6,5); ctx.fillRect(x+38,y+35,6,5);
                ctx.fillStyle='#17202d'; ctx.font='900 8px Outfit'; ctx.textAlign='center'; ctx.fillText('30m',x+w/2,y+h-5);
                // alert dot
                ctx.fillStyle='#ffd166'; ctx.beginPath(); ctx.arc(x+w-4,y+4,6,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#17202d'; ctx.font='900 8px Outfit'; ctx.fillText('!',x+w-4,y+7);
                break;
            }
            case 'LAPTOP': {
                hazard('#ff5c35');
                // Broken laptop: warm warning screen, cool keyboard.
                ctx.fillStyle='#1d2c3e'; ctx.strokeStyle='#07111d'; ctx.lineWidth=2;
                ctx.beginPath(); ctx.moveTo(x+7,y+15); ctx.lineTo(x+13,y+2); ctx.lineTo(x+w-4,y+2); ctx.lineTo(x+w-1,y+18); ctx.closePath(); ctx.fill(); ctx.stroke();
                const screen=ctx.createLinearGradient(x+10,y+4,x+w-5,y+16); screen.addColorStop(0,'#ff8a3d'); screen.addColorStop(.55,'#ef4444'); screen.addColorStop(1,'#ffcf5a');
                ctx.fillStyle=screen; ctx.beginPath(); ctx.moveTo(x+12,y+14); ctx.lineTo(x+15,y+5); ctx.lineTo(x+w-8,y+5); ctx.lineTo(x+w-5,y+14); ctx.closePath(); ctx.fill();
                ctx.fillStyle='#fff'; ctx.font='900 7px Outfit'; ctx.textAlign='center'; ctx.fillText('SYSTEM ERROR',x+w/2,y+11);
                ctx.fillStyle='#27384d'; ctx.beginPath(); ctx.roundRect(x+1,y+17,w-2,11,3); ctx.fill();
                ctx.fillStyle='rgba(255,255,255,.14)'; for(let k=0;k<6;k++) ctx.fillRect(x+7+k*6,y+20,4,2);
                // loose cable
                ctx.strokeStyle='#ffb72e'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x-16,y+23); ctx.bezierCurveTo(x-8,y+7,x-2,y+28,x+7,y+22); ctx.stroke();
                if(this.animFrame%5<2){ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(x-9,y+13,3,0,Math.PI*2);ctx.fill();}
                break;
            }
            case 'TASK_BOULDER': {
                ctx.save();
                ctx.translate(x+w/2,y+h/2); ctx.rotate(this.rot);
                ctx.shadowColor='#ff3b4d'; ctx.shadowBlur=22*pulse;
                // Steel warning crate
                const g=ctx.createLinearGradient(-w/2,-h/2,w/2,h/2); g.addColorStop(0,'#4a2027');g.addColorStop(.5,'#b43c32');g.addColorStop(1,'#4d1b23');
                ctx.fillStyle=g; ctx.strokeStyle='#ff6b5a'; ctx.lineWidth=3;
                ctx.beginPath(); ctx.roundRect(-w/2,-h/2,w,h,8);ctx.fill();ctx.stroke();
                stripe(-w/2,-h/2,w,h,'#ffd166');
                // Center plate over stripes
                ctx.fillStyle='#171d27'; ctx.strokeStyle='#ff7a66'; ctx.lineWidth=1.5; ctx.beginPath();ctx.roundRect(-20,-14,40,28,5);ctx.fill();ctx.stroke();
                ctx.fillStyle='#fff';ctx.font='900 8px Outfit';ctx.textAlign='center';ctx.fillText('URGENT',0,-2);ctx.fillText('TASK',0,9);
                ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(0,-21,3,0,Math.PI*2);ctx.fill();
                ctx.restore();
                break;
            }
            case 'FLYING_DRONE': {
                hazard('#f43f5e');
                const hoverY = y + Math.sin(this.animFrame * 0.15) * 3;

                // Downward surveillance scanning laser cone
                ctx.save();
                ctx.globalAlpha = 0.18 + Math.sin(this.animFrame * 0.2) * 0.08;
                ctx.fillStyle = '#f43f5e';
                ctx.beginPath();
                ctx.moveTo(x + w / 2, hoverY + h);
                ctx.lineTo(x - 14, 500);
                ctx.lineTo(x + w + 14, 500);
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                // Drone chassis
                ctx.fillStyle = '#1e293b';
                ctx.strokeStyle = '#f43f5e';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(x + 8, hoverY + 8, w - 16, h - 14, 6);
                ctx.fill(); ctx.stroke();

                // Spinning Propellers (4 rotors)
                const propRot = this.animFrame * 0.8;
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 2.5;
                [-4, w - 8].forEach(px => {
                    ctx.beginPath();
                    ctx.moveTo(x + px, hoverY + 4);
                    ctx.lineTo(x + px + 12, hoverY + 4);
                    ctx.stroke();
                    ctx.fillStyle = '#38bdf8';
                    ctx.beginPath();
                    ctx.ellipse(x + px + 6, hoverY + 4, Math.abs(Math.cos(propRot)) * 10 + 2, 2.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                });

                // Glowing Camera / Sensor Visor
                ctx.fillStyle = '#f43f5e';
                ctx.shadowColor = '#f43f5e';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.ellipse(x + w / 2, hoverY + h / 2 + 2, 9, 6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Bright "SLIDE ⬇" Warning Badge above the drone
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.roundRect(x + 2, hoverY - 14, w - 4, 13, 3);
                ctx.fill();
                ctx.fillStyle = '#0f172a';
                ctx.font = '900 8.5px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('SLIDE ⬇', x + w / 2, hoverY - 4);
                break;
            }
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

        // Magnet logic: only active during run if PTO pickup is active OR shop magnet upgrade was bought
        const isAvatarUnlocked = unlockedAvatars.includes(player.avatar.id);
        const magnetMultiplier = (isAvatarUnlocked && player.avatar.magnetBonus) ? player.avatar.magnetBonus : 1.0;
        const hasMagnet = player.ptoTimer > 0 || (upgrades.magnet_duration > 0);
        const magnetRadius = hasMagnet ? (190 * magnetMultiplier) : 0;
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
        const cx = this.x + this.width / 2;
        const cy = floatY + this.height / 2;
        ctx.save();

        // Glowing Pickup Halo: ensures item immediately pops out from background scenery
        const auraColor = this.type === 'COIN' ? 'rgba(251, 191, 36, 0.25)'
            : (this.type === 'COFFEE' ? 'rgba(245, 158, 11, 0.28)'
            : (this.type === 'HEADPHONES' ? 'rgba(56, 189, 248, 0.28)'
            : (this.type === 'PTO' ? 'rgba(52, 211, 153, 0.28)' : 'rgba(168, 85, 247, 0.28)')));

        ctx.fillStyle = auraColor;
        ctx.beginPath();
        ctx.arc(cx, cy, 18 + Math.sin(this.anim * 2) * 2, 0, Math.PI * 2);
        ctx.fill();

        // High-contrast neon pickup rendering
        ctx.shadowBlur = 16;
        switch (this.type) {
            case 'COIN': {
                ctx.shadowColor = '#fbbf24';
                const squash = 0.35 + Math.abs(Math.cos(this.anim * 1.5)) * 0.65;
                ctx.fillStyle = '#fbbf24';
                ctx.strokeStyle = '#fff7ae';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.ellipse(cx, cy, 12 * squash, 12, 0, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#7c4a03';
                ctx.font = '900 13px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('P', cx, cy + 5);
                break;
            }
            case 'COFFEE': {
                ctx.shadowColor = '#f59e0b';
                // Cup + handle.
                ctx.fillStyle = '#f8fafc';
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(this.x + 6, floatY + 10, 20, 17, 4); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(this.x + 27, floatY + 18, 6, -Math.PI / 2, Math.PI / 2); ctx.stroke();
                ctx.fillStyle = '#7c2d12';
                ctx.beginPath(); ctx.ellipse(this.x + 16, floatY + 11, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
                // Steam.
                ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.75;
                ctx.beginPath(); ctx.moveTo(this.x + 12, floatY + 6); ctx.quadraticCurveTo(this.x + 9, floatY + 1, this.x + 13, floatY - 3); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(this.x + 20, floatY + 6); ctx.quadraticCurveTo(this.x + 23, floatY + 1, this.x + 19, floatY - 3); ctx.stroke();
                break;
            }
            case 'HEADPHONES': {
                ctx.shadowColor = '#38bdf8';
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.arc(cx, cy + 2, 12, Math.PI, Math.PI * 2); ctx.stroke();
                ctx.fillStyle = '#0ea5e9';
                ctx.beginPath(); ctx.roundRect(this.x + 3, cy - 1, 7, 13, 3); ctx.fill();
                ctx.beginPath(); ctx.roundRect(this.x + 24, cy - 1, 7, 13, 3); ctx.fill();
                ctx.fillStyle = '#e0f2fe';
                ctx.fillRect(this.x + 6, cy + 3, 3, 5); ctx.fillRect(this.x + 25, cy + 3, 3, 5);
                break;
            }
            case 'PTO': {
                ctx.shadowColor = '#34d399';
                ctx.fillStyle = '#ecfdf5';
                ctx.strokeStyle = '#34d399';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(this.x + 5, floatY + 5, 24, 25, 4); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#10b981'; ctx.fillRect(this.x + 9, floatY + 10, 16, 3);
                ctx.fillStyle = '#64748b'; ctx.fillRect(this.x + 9, floatY + 17, 13, 2); ctx.fillRect(this.x + 9, floatY + 22, 9, 2);
                ctx.fillStyle = '#10b981'; ctx.font = '900 7px Outfit, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('PTO', cx, floatY + 29);
                break;
            }
            case 'OOO': {
                ctx.shadowColor = '#a855f7';
                ctx.fillStyle = '#faf5ff';
                ctx.strokeStyle = '#a855f7';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(this.x + 3, floatY + 8, 28, 20, 4); ctx.fill(); ctx.stroke();
                ctx.strokeStyle = '#7e22ce'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(this.x + 5, floatY + 10); ctx.lineTo(cx, floatY + 20); ctx.lineTo(this.x + 29, floatY + 10); ctx.stroke();
                ctx.fillStyle = '#a855f7'; ctx.font = '900 7px Outfit, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('OOO', cx, floatY + 33);
                break;
            }
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
// Authentic Chromium Chrome Dinosaur Game Speed Configuration (Responsive, Crisp Start Pace)
const DINO_CONFIG = {
    SPEED: 2.8,           // Crisp, responsive starting pace (balanced - not too slow, not too fast)
    ACCELERATION: 0.00045, // Smooth, continuous distance-driven acceleration
    MAX_SPEED: 8.0,       // Controlled top speed ceiling
    GAP_COEFFICIENT: 0.6  // Gap coefficient scaling with speed
};

let bossManager = new BossManager();
let obstacles = [];
let items = [];
let gameSpeed = DINO_CONFIG.SPEED;
let distance = 0;
let lastMilestoneHundreds = 0;
let runStartTime = 0;
let survivalTime = 0;
let runCoins = 0;
let spawnCooldown = 45;
let itemCooldown = 30;
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
    lastMilestoneHundreds = 0;
    runCoins = 0;
    gameSpeed = DINO_CONFIG.SPEED;
    spawnCooldown = 50; // First obstacle arrives comfortably
    itemCooldown = 25;
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
    document.getElementById('stat-coins-val').textContent = '+' + runCoins + ' P';
    document.getElementById('stat-best-val').textContent = bestSurvivalTime.toFixed(2) + 's';

    const recordTag = document.getElementById('new-record-tag');
    if (isNewRecord) {
        recordTag.style.display = 'block';
    } else {
        recordTag.style.display = 'none';
    }

    document.getElementById('gameover-screen').classList.remove('hidden');
}

// Spawner Logic — Dynamic Rhythmic Stream with Chromium gap scaling
function updateSpawner(effectiveSpeed) {
    spawnCooldown--;
    if (spawnCooldown <= 0 && obstacles.length < 5) {
        // Spawner cooldown scales with speed so player reaction window remains balanced
        const speedRatio = (gameSpeed - DINO_CONFIG.SPEED) / (DINO_CONFIG.MAX_SPEED - DINO_CONFIG.SPEED);
        spawnCooldown = Math.max(46, Math.floor(82 - speedRatio * 22 + (Math.random() * 20 - 10)));

        const rand = Math.random();
        if (rand < 0.24) {
            obstacles.push(new Obstacle('CHAIR', 1050));
        } else if (rand < 0.46) {
            obstacles.push(new Obstacle('CALENDAR', 1050));
        } else if (rand < 0.66) {
            obstacles.push(new Obstacle('LAPTOP', 1050));
        } else if (rand < 0.82) {
            obstacles.push(new Obstacle('TASK_BOULDER', 1050));
        } else {
            // Overhead flying obstacle (requires duck / slide to dodge!)
            obstacles.push(new Obstacle('FLYING_DRONE', 1050));
        }
    }

    // Spawn Coins & Power-ups rhythmically — skip if an obstacle is near the spawn zone
    itemCooldown--;
    if (itemCooldown <= 0 && items.length < 5) {
        itemCooldown = Math.floor(65 + Math.random() * 40);

        // Check if any obstacle occupies the right-side spawn zone (x > 900)
        const spawnBlocked = obstacles.some(o => o.x > 900 && o.x < 1200);

        if (!spawnBlocked) {
            if (Math.random() < 0.68) {
                // Place coins safely above obstacles: use y=390 (high arc) or y=455 (low row)
                const coinY = Math.random() > 0.4 ? 455 : 390;
                const coinCount = Math.floor(Math.random() * 2) + 1;
                for (let i = 0; i < coinCount; i++) {
                    items.push(new Item('COIN', 1100 + i * 42, coinY));
                }
            } else if (Math.random() < 0.4) {
                const powerups = ['COFFEE', 'HEADPHONES', 'PTO', 'OOO'];
                const chosen = powerups[Math.floor(Math.random() * powerups.length)];
                // Powerups always float at a safe mid-height
                items.push(new Item(chosen, 1150, 405));
            }
        }
    }

    // Boss Battle Trigger (Scales with distance milestones)
    if (distance >= nextBossTriggerDist && !bossManager.active) {
        bossManager.trigger();
        nextBossTriggerDist += 1000 + Math.random() * 300;
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

// Main Game Loop — Chromium Chrome Dino continuous acceleration mechanism
function updateGame() {
    if (currentState !== GAME_STATE.PLAYING) return;

    survivalTime = (performance.now() - runStartTime) / 1000;

    // Authentic Chrome Dino Speed Mechanism: Continuous incremental acceleration
    if (gameSpeed < DINO_CONFIG.MAX_SPEED) {
        gameSpeed += DINO_CONFIG.ACCELERATION;
    }

    // Active in-game temporary buff multipliers (Quad Espresso, Dash, and Boss Chase adrenaline!)
    const buffBoost = player.coffeeTimer > 0 ? 1.18 : (player.isDashing ? 1.28 : 1.0);
    // When boss is chasing, player gets a 1.38x adrenaline sprint so boss won't catch them!
    // When boss leaves, bossBoost is 1.0, restoring baseline distance speed seamlessly!
    const bossBoost = bossManager.active ? 1.38 : 1.0;
    const targetEffectiveSpeed = gameSpeed * buffBoost * bossBoost;

    if (typeof window.smoothSpeed === 'undefined') window.smoothSpeed = DINO_CONFIG.SPEED;
    window.smoothSpeed += (targetEffectiveSpeed - window.smoothSpeed) * 0.08;
    const effectiveSpeed = window.smoothSpeed;

    // Distance accumulation
    distance += effectiveSpeed * 0.045;

    // Authentic 100m Milestone Celebration (Dino 100m beep & score flash)
    const currentHundreds = Math.floor(distance / 100);
    if (currentHundreds > lastMilestoneHundreds && currentHundreds > 0) {
        lastMilestoneHundreds = currentHundreds;
        window.soundManager.playMilestone();
        createScorePopup(canvas.width / 2, 140, `${currentHundreds * 100}m MILESTONE! 🎯`, '#ffd166');
        createBlastConfetti(canvas.width / 2, 140, 16);
    }

    const currentBiome = getCurrentBiome();

    // Biome Transition Announcement
    if (bgManager.lastBiomeId !== currentBiome.id) {
        if (bgManager.lastBiomeId !== null) {
            window.soundManager.playCoin();
            createScorePopup(canvas.width / 2 - 80, 160, `ZONE: ${currentBiome.name} ✨`, currentBiome.accent);
            createBlastConfetti(canvas.width / 2, 160);
        }
        bgManager.lastBiomeId = currentBiome.id;
    }

    // Update Systems
    bgManager.update(effectiveSpeed);
    player.update();
    bossManager.update(effectiveSpeed);
    updateSpawner(effectiveSpeed);

    // Update Obstacles & Check Collisions
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.update(effectiveSpeed);

        if (checkCollision(player, obs)) {
            // Invulnerable / Coffee / Dash Smash (Dash smash active if dashing or coffee buff active)
            if (player.invulnerableTimer > 0 || player.coffeeTimer > 0) {
                obs.markedForDeletion = true;
                createBlastConfetti(obs.x + obs.width / 2, obs.y + obs.height / 2);
                createScorePopup(obs.x, obs.y, 'SMASHED! +2 P', '#10b981');
                runCoins += 2;
                window.soundManager.playBlast();
            } else if (player.shield > 0) {
                // Shield break + point penalty
                player.shield--;
                player.invulnerableTimer = 45;
                obs.markedForDeletion = true;
                window.soundManager.playShieldBreak();
                createBlastConfetti(obs.x, obs.y);
                
                // Point deduction on hit
                const penalty = Math.min(10, totalCoins + runCoins);
                if (runCoins >= penalty) {
                    runCoins -= penalty;
                } else {
                    const rem = penalty - runCoins;
                    runCoins = 0;
                    totalCoins = Math.max(0, totalCoins - rem);
                    storage.set('coins', totalCoins);
                }
                createScorePopup(player.x, player.y - 20, `SHIELD BROKE! -${penalty} P`, '#ff4757');
            } else {
                // Point deduction on fatal hit
                const penalty = Math.min(15, totalCoins + runCoins);
                if (runCoins >= penalty) {
                    runCoins -= penalty;
                } else {
                    const rem = penalty - runCoins;
                    runCoins = 0;
                    totalCoins = Math.max(0, totalCoins - rem);
                    storage.set('coins', totalCoins);
                }
                createScorePopup(player.x, player.y - 30, `-${penalty} P`, '#ef4444');

                // Game Over Collision
                let specificReason = null;
                if (obs.type === 'CHAIR') specificReason = "Smashed into a rogue ergonomic office chair in the hallway.";
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
                case 'COIN': {
                    const isAvUnlocked = unlockedAvatars.includes(player.avatar.id);
                    const coinMult = (isAvUnlocked && player.avatar.coinMultiplier) ? player.avatar.coinMultiplier : 1;
                    runCoins += 1 * coinMult;
                    window.soundManager.playCoin();
                    createScorePopup(item.x, item.y, coinMult > 1 ? `+${coinMult} P` : '+1 P', '#fbbf24');
                    break;
                }
                case 'COFFEE': {
                    const isAvUnlocked = unlockedAvatars.includes(player.avatar.id);
                    const coffeeMult = (isAvUnlocked && player.avatar.coffeeBonus) ? player.avatar.coffeeBonus : 1.0;
                    const upgradeMult = upgrades.coffee_duration > 0 ? 1.4 : 1.0;
                    const durationFrames = Math.floor(240 * upgradeMult * coffeeMult);
                    player.coffeeTimer = durationFrames;
                    window.soundManager.playCoffeePowerup();
                    createScorePopup(player.x, player.y - 30, 'QUAD ESPRESSO! ☕', '#f59e0b');
                    break;
                }
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
                    // Vaporize on-screen obstacles
                    obstacles.forEach(o => {
                        createBlastConfetti(o.x + o.width / 2, o.y + o.height / 2);
                        runCoins += 1;
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

    // Foreground lane guide: makes the playable strip obvious and keeps hazards visually anchored.
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = currentBiome.accent;
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 18]);
    ctx.beginPath(); ctx.moveTo(0, 486); ctx.lineTo(1000, 486); ctx.stroke();
    ctx.restore();

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
    document.getElementById('hud-coins').textContent = (totalCoins + runCoins) + ' P';
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

// Input Handlers (Classic Chrome Dinosaur Controls)
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
            player.duckStart();
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

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        player.duckEnd();
    }
});

// Mouse Controls: Left Click = Jump, Right Click = Slide, Mouse Scroll = Dash
window.addEventListener('mousedown', (e) => {
    window.soundManager.init();

    // Ignore clicks on UI buttons/modals so menu clicking still works
    if (e.target.closest('button') || e.target.closest('.modal-content') || e.target.closest('.shop-card')) {
        return;
    }

    if (e.button === 0) {
        // Left Click: Jump during play, or Start/Restart from GameOver
        if (currentState === GAME_STATE.PLAYING) {
            player.jump();
        } else if (currentState === GAME_STATE.GAMEOVER) {
            startGame();
        }
    } else if (e.button === 2) {
        // Right Click: Slide / Duck
        e.preventDefault();
        if (currentState === GAME_STATE.PLAYING) {
            player.duckStart();
        }
    }
});

window.addEventListener('mouseup', (e) => {
    if (e.button === 2) {
        // Release Right Click: End Slide
        e.preventDefault();
        player.duckEnd();
    }
});

// Disable browser context menu on right-click during the game
window.addEventListener('contextmenu', (e) => {
    if (!e.target.closest('input') && !e.target.closest('textarea')) {
        e.preventDefault();
    }
});

// Mouse Scroll Wheel: Dash using stamina
window.addEventListener('wheel', (e) => {
    if (currentState === GAME_STATE.PLAYING) {
        e.preventDefault();
        player.dash();
    }
}, { passive: false });

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
            player.duckStart();
        });
        slideBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            player.duckEnd();
        });
        slideBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            player.duckEnd();
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
    const menuCoins = document.getElementById('menu-coins-display');
    if (menuCoins) menuCoins.textContent = `🪙 ${totalCoins} P`;
    container.innerHTML = '';

    Object.values(AVATARS).forEach(av => {
        const card = document.createElement('div');
        const isUnlocked = unlockedAvatars.includes(av.id);
        const isSelected = activeAvatarId === av.id;

        card.className = `avatar-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
        card.innerHTML = `
            ${!isUnlocked ? `<span class="avatar-lock-tag">🔒 ${av.cost} P BUY</span>` : (isSelected ? `<span class="avatar-lock-tag" style="background: rgba(56, 189, 248, 0.3); color: #38bdf8; border-color: #38bdf8;">EQUIPPED</span>` : `<span class="avatar-lock-tag" style="background: rgba(16, 185, 129, 0.2); color: #10b981; border-color: #10b981;">BOUGHT ✓</span>`)}
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
                player.reset(); // Instantly update player entity with selected avatar!
                renderAvatarSelection();
            } else if (totalCoins >= av.cost) {
                // Buy avatar
                totalCoins -= av.cost;
                storage.set('coins', totalCoins);
                unlockedAvatars.push(av.id);
                storage.set('unlocked_avatars', unlockedAvatars);
                activeAvatarId = av.id;
                storage.set('selected_avatar', activeAvatarId);
                player.reset(); // Instantly update player entity with selected avatar!
                window.soundManager.playShieldUp();
                renderAvatarSelection();
                updateShopUI();
            } else {
                window.soundManager.playTone(200, 'square', 0.1, 0.2);
                alert(`Need ${av.cost} P Point Coins to unlock ${av.name}!`);
            }
        });

        container.appendChild(card);
    });
}

function updateShopUI() {
    const totalEl = document.getElementById('shop-total-coins');
    if (totalEl) totalEl.textContent = `${totalCoins} P`;

    const coffeeBtn = document.getElementById('shop-btn-coffee');
    const shieldBtn = document.getElementById('shop-btn-shield');
    const magnetBtn = document.getElementById('shop-btn-magnet');

    if (coffeeBtn) {
        if (upgrades.coffee_duration > 0) {
            coffeeBtn.textContent = 'BOUGHT ✓';
            coffeeBtn.className = 'shop-buy-btn bought';
            coffeeBtn.disabled = true;
        } else {
            coffeeBtn.textContent = '40 P BUY';
            coffeeBtn.className = 'shop-buy-btn';
            coffeeBtn.disabled = false;
        }
    }

    if (shieldBtn) {
        if (upgrades.shield_strength > 0) {
            shieldBtn.textContent = 'BOUGHT ✓';
            shieldBtn.className = 'shop-buy-btn bought';
            shieldBtn.disabled = true;
        } else {
            shieldBtn.textContent = '60 P BUY';
            shieldBtn.className = 'shop-buy-btn';
            shieldBtn.disabled = false;
        }
    }

    if (magnetBtn) {
        if (upgrades.magnet_duration > 0) {
            magnetBtn.textContent = 'BOUGHT ✓';
            magnetBtn.className = 'shop-buy-btn bought';
            magnetBtn.disabled = true;
        } else {
            magnetBtn.textContent = '50 P BUY';
            magnetBtn.className = 'shop-buy-btn';
            magnetBtn.disabled = false;
        }
    }
}

// Global upgrade helper
window.buyUpgrade = function(type, cost) {
    if (upgrades[type] > 0) return; // already bought!
    if (totalCoins >= cost) {
        totalCoins -= cost;
        storage.set('coins', totalCoins);
        upgrades[type] = 1;
        storage.set('upgrades', upgrades);
        window.soundManager.playShieldUp();
        updateShopUI();
        renderAvatarSelection();
        createScorePopup(canvas.width / 2, canvas.height / 2, 'PERK BOUGHT! ✨', '#10b981');
    } else {
        window.soundManager.playTone(200, 'square', 0.1, 0.2);
        alert(`Need ${cost} P Point Coins!`);
    }
};

function requestGameFullScreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        const el = document.documentElement;
        const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
        if (req) {
            req.call(el).catch(() => {});
        }
    }
}

// Return to game home page
function goHome() {
    currentState = GAME_STATE.MENU;
    window.soundManager.stopBGM();
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('pause-screen').classList.add('hidden');
    document.getElementById('shop-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    player.reset();
    renderAvatarSelection();
}

function handleBackNavigation() {
    if (currentState === GAME_STATE.PLAYING || currentState === GAME_STATE.PAUSED || currentState === GAME_STATE.GAMEOVER) {
        goHome();
    } else {
        window.location.href = '../index.html';
    }
}

// Initialization on DOM load
window.addEventListener('DOMContentLoaded', () => {
    renderAvatarSelection();
    setupTouchControls();
    updateShopUI();

    const portalBackBtn = document.getElementById('btn-portal-back');
    if (portalBackBtn) {
        portalBackBtn.addEventListener('click', (e) => {
            if (currentState === GAME_STATE.PLAYING || currentState === GAME_STATE.PAUSED || currentState === GAME_STATE.GAMEOVER) {
                e.preventDefault();
                goHome();
            }
        });
    }

    document.getElementById('btn-play').addEventListener('click', () => {
        requestGameFullScreen();
        window.soundManager.init();
        startGame();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        requestGameFullScreen();
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
