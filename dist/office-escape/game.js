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
        this.slideDuration = 30; // frames
        this.jumpCount = 0;
        this.maxJumps = avatar.hasDoubleJump ? 2 : 1;
        this.jumpBuffer = 0;
        this.coyoteTimer = 0;

        // Stamina & Dash
        this.stamina = 100;
        this.maxStamina = 100;
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashDuration = 16;

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

        // Stamina recharge
        const rechargeRate = 0.45 * (this.avatar.dashBonus || 1.0);
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
            this.runCycle += 0.2 + (gameSpeed * 0.025);
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
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 44, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
            ctx.fill();
            ctx.font = '18px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🎧', this.x + this.width / 2, this.y - 8);
            ctx.restore();
        }

        const px = this.x;
        const py = this.y;
        const skin = this.avatar.skinColor || '#fed7aa';

        if (this.isSliding) {
            // --- ULTRA-SMOOTH ATHLETIC ACTION SLIDE ---
            const slideProgress = 1 - (this.slideTimer / this.slideDuration);
            const tiltAngle = Math.sin(slideProgress * Math.PI) * 0.15;

            ctx.save();
            ctx.translate(px + 24, py + 18);
            ctx.rotate(tiltAngle);

            // Torso leaned back
            ctx.fillStyle = this.avatar.shirtColor;
            ctx.beginPath();
            ctx.roundRect(-24, -4, 46, 18, 5);
            ctx.fill();

            // Tie trailing backward
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-22, -2, 18, 3.5);

            // Head ducked low
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.arc(16, 2, 11, 0, Math.PI * 2);
            ctx.fill();

            // Focused eye looking ahead
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(20, 1, 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Hair swept back
            ctx.fillStyle = this.avatar.hairColor;
            ctx.beginPath();
            ctx.arc(14, -2, 11, Math.PI * 0.8, Math.PI * 2.1);
            ctx.fill();

            // Front Extended Sliding Leg
            ctx.fillStyle = this.avatar.pantsColor;
            ctx.fillRect(10, 8, 26, 7);
            ctx.fillStyle = '#0f172a'; // Shoe
            ctx.fillRect(32, 7, 10, 8);

            // Back Tucked Leg
            ctx.fillStyle = this.avatar.pantsColor;
            ctx.fillRect(-22, 6, 24, 8);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-26, 7, 10, 8);

            // Briefcase skimming the ground
            ctx.fillStyle = '#78350f';
            ctx.fillRect(-8, 7, 18, 10);
            ctx.fillStyle = '#d97706';
            ctx.fillRect(-4, 5, 10, 3);

            ctx.restore();
        } else {
            // --- DYNAMIC VECTOR RUNNING / JUMPING CHARACTER ---
            const legOffset = Math.sin(this.runCycle) * 16;
            const armOffset = Math.cos(this.runCycle) * 12;
            const bobY = this.isGrounded ? Math.abs(Math.sin(this.runCycle)) * 3 : 0;

            ctx.save();
            ctx.translate(px, py - bobY);

            // Running Body Tilt
            const runTilt = this.isGrounded ? 0.08 : (this.vy < 0 ? -0.1 : 0.12);
            ctx.rotate(runTilt);

            // 1. Back Arm (Swinging)
            ctx.fillStyle = this.avatar.shirtColor;
            ctx.fillRect(12 - armOffset * 0.5, 22, 8, 16);
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.arc(16 - armOffset * 0.5, 38, 4, 0, Math.PI * 2);
            ctx.fill();

            // 2. Legs with Natural Kinematics
            ctx.fillStyle = this.avatar.pantsColor;
            if (this.isGrounded) {
                // Back Leg
                ctx.fillRect(8, 42, 11, 20 - legOffset * 0.45);
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(6, 60 - legOffset * 0.45, 15, 8);

                // Front Leg
                ctx.fillStyle = this.avatar.pantsColor;
                ctx.fillRect(24, 42, 11, 20 + legOffset * 0.45);
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(22, 60 + legOffset * 0.45, 15, 8);
            } else {
                // Tucked Jumping Pose
                ctx.fillRect(10, 42, 11, 15);
                ctx.fillRect(24, 42, 11, 10);
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(8, 55, 14, 8);
                ctx.fillRect(22, 50, 14, 8);
            }

            // 3. Torso & Build (Custom per avatar type)
            const isMuscular = this.avatar.id.includes('muscular');
            const isFemale = this.avatar.id.includes('woman');
            const torsoW = isMuscular ? 36 : (isFemale ? 26 : 28);
            const torsoX = isMuscular ? 4 : (isFemale ? 9 : 8);

            ctx.fillStyle = this.avatar.shirtColor;
            ctx.beginPath();
            ctx.roundRect(torsoX, 16, torsoW, 28, 6);
            ctx.fill();

            // Tie, sport stripe, or crop top styling
            if (this.avatar.id === 'dev') {
                // Hoodie zipper & pocket
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(21, 16, 2, 28);
                ctx.fillStyle = '#0369a1';
                ctx.fillRect(12, 34, 18, 8);
            } else if (this.avatar.id === 'og_man') {
                // White collared shirt + Red tie
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(20, 16, 6, 8);
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(21, 20, 4, 18);
            } else if (this.avatar.id === 'og_woman') {
                // White v-neck + Gold brooch
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(18, 16); ctx.lineTo(26, 16); ctx.lineTo(22, 24);
                ctx.fill();
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(22, 24, 2.5, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.avatar.id === 'black_man') {
                // Lavender tie + Lapel
                ctx.fillStyle = '#c084fc';
                ctx.fillRect(21, 19, 4, 18);
                ctx.fillStyle = '#581c87';
                ctx.fillRect(torsoX + 2, 16, 4, 20);
            } else if (this.avatar.id === 'black_woman') {
                // Gold collar line + Black top
                ctx.fillStyle = '#020617';
                ctx.fillRect(18, 16, 8, 10);
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(17, 16, 10, 2);
            } else if (this.avatar.id === 'muscular_man') {
                // Athletic power stripe
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(torsoX + 3, 24, torsoW - 6, 3);
            } else if (this.avatar.id === 'muscular_woman') {
                // Athletic crop top (bare waistline)
                ctx.fillStyle = skin;
                ctx.fillRect(torsoX, 36, torsoW, 8);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.fillRect(torsoX + 2, 26, torsoW - 4, 2);
            }

            // 4. Head & Face
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.arc(22, 10, 12, 0, Math.PI * 2);
            ctx.fill();

            // Expressive Eye
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(26, 9, 2.3, 0, Math.PI * 2);
            ctx.fill();

            // Eye highlight
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(25.3, 8.2, 0.8, 0, Math.PI * 2);
            ctx.fill();

            // --- AVATAR-SPECIFIC HAIRSTYLES, GLASSES & ACCESSORIES ---
            ctx.fillStyle = this.avatar.hairColor;
            if (this.avatar.id === 'dev') {
                // Spiky Orange Dev Hair
                ctx.beginPath();
                ctx.arc(21, 6, 13, Math.PI * 0.7, Math.PI * 2.3);
                ctx.fill();
                // Developer Glasses
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(23, 7, 7, 4);
                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(24, 8, 5, 2);
                // Headset
                ctx.fillStyle = '#0284c7';
                ctx.fillRect(12, 2, 4, 14);
                ctx.beginPath();
                ctx.arc(14, 10, 5, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.avatar.id === 'og_man') {
                // Classic Business Hair + Mustache
                ctx.beginPath();
                ctx.arc(21, 6, 12, Math.PI * 0.8, Math.PI * 2.2);
                ctx.fill();
                // Mustache
                ctx.fillStyle = this.avatar.hairColor;
                ctx.fillRect(24, 13, 6, 2.5);
            } else if (this.avatar.id === 'og_woman') {
                // Long Hair + Flowing Ponytail
                ctx.beginPath();
                ctx.arc(21, 6, 12.5, Math.PI * 0.7, Math.PI * 2.3);
                ctx.fill();
                // Dynamic Ponytail
                ctx.beginPath();
                ctx.arc(8, 14 + (this.isGrounded ? legOffset * 0.25 : 0), 8, 0, Math.PI * 2);
                ctx.fill();
                // Gold Hair Clip & Pearl Earring
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(11, 11, 3, 5);
                ctx.beginPath();
                ctx.arc(15, 12, 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.avatar.id === 'black_man') {
                // Razor Fade Haircut + Neat Goatee
                ctx.beginPath();
                ctx.arc(21, 7, 11.5, Math.PI * 0.8, Math.PI * 2.2);
                ctx.fill();
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(24, 14, 4, 3);
            } else if (this.avatar.id === 'black_woman') {
                // High Braided Bun + Gold Earring & Hair Ring
                ctx.beginPath();
                ctx.arc(21, 8, 11.5, Math.PI * 0.8, Math.PI * 2.2);
                ctx.fill();
                // Top Bun
                ctx.beginPath();
                ctx.arc(18, -2, 8, 0, Math.PI * 2);
                ctx.fill();
                // Gold Ring & Earring
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(17, 3, 4, 2);
                ctx.beginPath();
                ctx.arc(15, 12, 2.5, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.avatar.id === 'muscular_man') {
                // Crew Cut + Red Headband
                ctx.beginPath();
                ctx.arc(21, 7, 11, Math.PI * 0.8, Math.PI * 2.2);
                ctx.fill();
                // Red Headband
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(14, 6, 16, 3);
            } else if (this.avatar.id === 'muscular_woman') {
                // Cyan Headband & Braided Ponytail
                ctx.beginPath();
                ctx.arc(21, 6, 12, Math.PI * 0.8, Math.PI * 2.2);
                ctx.fill();
                // Cyan Sports Headband
                ctx.fillStyle = '#06b6d4';
                ctx.fillRect(14, 5, 16, 3);
                // Ponytail
                ctx.fillStyle = this.avatar.hairColor;
                ctx.beginPath();
                ctx.arc(6, 10 + (this.isGrounded ? legOffset * 0.2 : 0), 7, 0, Math.PI * 2);
                ctx.fill();
            }

            // 5. Front Arm (Muscular bare bicep or tailored sleeve)
            ctx.fillStyle = isMuscular ? skin : this.avatar.shirtColor;
            ctx.fillRect(22 + armOffset * 0.5, 22, isMuscular ? 11 : 8, 16);
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.arc(26 + armOffset * 0.5, 38, 4, 0, Math.PI * 2);
            ctx.fill();

            // 6. Custom Handheld Props per Avatar
            if (this.avatar.id === 'dev') {
                // Glowing Code Tablet
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(22 + armOffset * 0.7, 34, 16, 11);
                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(24 + armOffset * 0.7, 36, 12, 7);
            } else if (isMuscular) {
                // Dumbbell / Power Shaker
                ctx.fillStyle = '#475569';
                ctx.fillRect(24 + armOffset * 0.7, 32, 10, 16);
                ctx.fillStyle = this.avatar.id === 'muscular_man' ? '#ef4444' : '#06b6d4';
                ctx.fillRect(23 + armOffset * 0.7, 30, 12, 4);
                ctx.fillRect(23 + armOffset * 0.7, 46, 12, 4);
            } else {
                // Classic Business Briefcase
                ctx.fillStyle = '#78350f';
                ctx.fillRect(22 + armOffset * 0.7, 34, 15, 12);
                ctx.fillStyle = '#d97706';
                ctx.fillRect(26 + armOffset * 0.7, 32, 7, 3);
            }

            ctx.restore();
        }

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

// Ultra-Fast Offscreen Cached Parallax Background Engine (Zero CPU Lag!)
class BackgroundManager {
    constructor() {
        this.layer1 = 0; // Skyline & Windows
        this.layer2 = 0; // Wall Decor & Whiteboards
        this.layer3 = 0; // Cubicles & Desks
        this.layer4 = 0; // Floor & Ceiling
        this.initOffscreenBuffers();
    }

    initOffscreenBuffers() {
        // 1. Buffer for Skyline Windows (Width 800px)
        this.skylineCanvas = document.createElement('canvas');
        this.skylineCanvas.width = 800;
        this.skylineCanvas.height = 440;
        const sCtx = this.skylineCanvas.getContext('2d');

        // Draw static skyline pattern
        sCtx.fillStyle = '#060a17';
        sCtx.fillRect(0, 0, 800, 440);

        for (let i = 0; i < 2; i++) {
            const bx = i * 400;
            sCtx.fillStyle = '#03060c';
            sCtx.fillRect(bx + 40, 40, 200, 180);
            sCtx.fillStyle = 'rgba(56, 189, 248, 0.05)';
            sCtx.fillRect(bx + 40, 40, 200, 180);

            // Skyscrapers
            sCtx.fillStyle = '#0b1120';
            sCtx.fillRect(bx + 50, 90, 40, 130);
            sCtx.fillRect(bx + 95, 60, 55, 160);
            sCtx.fillRect(bx + 155, 80, 45, 140);

            // Glowing window dots
            sCtx.fillStyle = 'rgba(254, 240, 138, 0.3)';
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 2; c++) {
                    sCtx.fillRect(bx + 105 + c * 16, 75 + r * 22, 6, 8);
                }
            }

            sCtx.strokeStyle = '#1e293b';
            sCtx.lineWidth = 2;
            sCtx.strokeRect(bx + 40, 40, 200, 180);
        }

        // 2. Buffer for Cubicles & Props (Width 800px)
        this.cubicleCanvas = document.createElement('canvas');
        this.cubicleCanvas.width = 800;
        this.cubicleCanvas.height = 260;
        const cCtx = this.cubicleCanvas.getContext('2d');

        for (let i = 0; i < 2; i++) {
            const bx = i * 400;
            // Cubicle partition
            cCtx.fillStyle = '#1e293b';
            cCtx.beginPath();
            cCtx.roundRect(bx + 30, 40, 220, 180, [8, 8, 0, 0]);
            cCtx.fill();

            // Desk
            cCtx.fillStyle = '#334155';
            cCtx.fillRect(bx + 50, 130, 180, 14);
            cCtx.fillStyle = '#475569';
            cCtx.fillRect(bx + 60, 144, 8, 80);
            cCtx.fillRect(bx + 210, 144, 8, 80);

            // Dual Monitors
            cCtx.fillStyle = '#050811';
            cCtx.fillRect(bx + 70, 75, 55, 42);
            cCtx.fillRect(bx + 135, 75, 55, 42);
            cCtx.fillStyle = '#38bdf8';
            cCtx.fillRect(bx + 76, 82, 22, 3);
            cCtx.fillStyle = '#f472b6';
            cCtx.fillRect(bx + 142, 82, 26, 3);
        }
    }

    update(speed) {
        this.layer1 -= speed * 0.15;
        while (this.layer1 <= -800) this.layer1 += 800;

        this.layer2 -= speed * 0.45;
        while (this.layer2 <= -800) this.layer2 += 800;

        this.layer3 -= speed * 0.65;
        while (this.layer3 <= -800) this.layer3 += 800;

        this.layer4 -= speed;
        while (this.layer4 <= -800) this.layer4 += 800;
    }

    draw(biome) {
        const l1 = Math.round(this.layer1);
        const l3 = Math.round(this.layer3);
        const l4 = Math.round(this.layer4);

        // 1. Draw Cached Skyline Layer (Snapped to exact integer coordinates)
        if (this.skylineCanvas) {
            ctx.drawImage(this.skylineCanvas, l1, 60);
            ctx.drawImage(this.skylineCanvas, l1 + 800, 60);
            ctx.drawImage(this.skylineCanvas, l1 + 1600, 60);
        }

        // 2. Draw Cached Cubicles Layer
        if (this.cubicleCanvas) {
            ctx.save();
            ctx.globalAlpha = 0.35;
            ctx.drawImage(this.cubicleCanvas, l3, 240);
            ctx.drawImage(this.cubicleCanvas, l3 + 800, 240);
            ctx.drawImage(this.cubicleCanvas, l3 + 1600, 240);
            ctx.restore();
        }

        // 3. Drop Ceiling
        ctx.fillStyle = '#060913';
        ctx.fillRect(0, 0, 1000, 70);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 64, 1000, 4);

        // Ceiling Lights (Lightweight)
        for (let i = 0; i < 6; i++) {
            const lx = Math.round(((l4 + i * 180) % 1080 + 1080) % 1080);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(lx, 66, 60, 3);
        }

        // 4. Running Floor Base
        ctx.fillStyle = '#090d18';
        ctx.fillRect(0, 500, 1000, 100);

        // Vibrant Cyan Running Laser Track
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 500);
        ctx.lineTo(1000, 500);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(0, 504, 1000, 2);

        // Floor Grid Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 16; i++) {
            const fx = Math.round(((l4 + i * 70) % 1120 + 1120) % 1120);
            ctx.beginPath();
            ctx.moveTo(fx, 506);
            ctx.lineTo(fx, 600);
            ctx.stroke();
        }
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
            case 'COFFEE_SPILL':
                // Coffee spill puddle with caution hazard cone
                this.width = 64;
                this.height = 18;
                this.y = 500 - this.height;
                break;
            case 'FLYING_BUZZWORD':
                // Flying laser buzzword projectile (Slide under!)
                this.width = 88;
                this.height = 30;
                this.y = 402;
                this.buzzwords = ['SYNERGY!', 'CIRCLE BACK!', 'EOD ASAP!', 'DEEP DIVE!', 'PER MY EMAIL'];
                this.text = this.buzzwords[Math.floor(Math.random() * this.buzzwords.length)];
                break;
            case 'TASK_BOULDER':
                // Rolling Giant "URGENT TASK" Boulder
                this.width = 52;
                this.height = 52;
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
        const pulse = 0.85 + Math.sin(this.animFrame * 0.15) * 0.2;

        switch (this.type) {
            case 'CHAIR':
                // --- HIGH-VISIBILITY HAZARD ROLLING CHAIR ---
                ctx.shadowColor = '#facc15';
                ctx.shadowBlur = 18 * pulse;

                // Glowing outer danger border
                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.roundRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4, 8);
                ctx.stroke();

                // High-back mesh with Black & Yellow Danger Stripes
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.roundRect(this.x + 8, this.y + 4, 30, 26, 4);
                ctx.fill();

                // Yellow Hazard Stripes on Seat Back
                ctx.fillStyle = '#facc15';
                ctx.fillRect(this.x + 12, this.y + 8, 22, 4);
                ctx.fillRect(this.x + 12, this.y + 16, 22, 4);
                ctx.fillRect(this.x + 12, this.y + 24, 22, 4);

                // Top Red Alert Flasher
                ctx.fillStyle = '#ef4444';
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(this.x + 23, this.y + 2, 5, 0, Math.PI * 2);
                ctx.fill();

                // Seat Cushion
                ctx.fillStyle = '#1e293b';
                ctx.beginPath();
                ctx.roundRect(this.x + 4, this.y + 30, 38, 10, 3);
                ctx.fill();
                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Chrome Stem & Wheeled Star Base
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(this.x + 20, this.y + 40, 6, 8);
                ctx.fillRect(this.x + 6, this.y + 47, 34, 3);

                // Caster Wheels
                ctx.fillStyle = '#fde047';
                ctx.beginPath();
                ctx.arc(this.x + 8, this.y + 51, 3.5, 0, Math.PI * 2);
                ctx.arc(this.x + 38, this.y + 51, 3.5, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'CALENDAR':
                // --- HIGH-CONTRAST URGENT DEADLINE CALENDAR ---
                ctx.shadowColor = 'rgba(239, 68, 68, 0.95)';
                ctx.shadowBlur = 20 * pulse;

                // Glowing outer red laser hazard border
                ctx.strokeStyle = '#f87171';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4, 8);
                ctx.stroke();

                // Bold Fiery Red Header Block
                ctx.fillStyle = '#dc2626';
                ctx.beginPath();
                ctx.roundRect(this.x, this.y, this.width, 20, [6, 6, 0, 0]);
                ctx.fill();

                // Crisp White Body
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.roundRect(this.x, this.y + 20, this.width, this.height - 20, [0, 0, 6, 6]);
                ctx.fill();

                // Binding Spirals
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(this.x + 8, this.y - 4, 6, 8);
                ctx.fillRect(this.x + this.width - 14, this.y - 4, 6, 8);

                // Top Alert Badge
                ctx.fillStyle = '#fde047';
                ctx.beginPath();
                ctx.arc(this.x + this.width - 4, this.y + 2, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.font = 'bold 9px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('!', this.x + this.width - 4, this.y + 5);

                // Bold Text
                ctx.fillStyle = '#0f172a';
                ctx.font = '900 11px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(this.title, this.x + this.width / 2, this.y + 33);

                ctx.fillStyle = '#dc2626';
                ctx.font = '900 11.5px Outfit, sans-serif';
                ctx.fillText('🚨 ' + this.subtitle, this.x + this.width / 2, this.y + 45);
                break;

            case 'LAPTOP':
                // --- NEON CYBER SPARKING LAPTOP ---
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 22 * pulse;

                // Base Hazard Neon Border
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(this.x - 3, this.y + 14, this.width + 6, 16, 4);
                ctx.stroke();

                // Laptop Base Chassis
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(this.x, this.y + 16, this.width, 12);

                // Glowing Cyan-Magenta Display Screen
                const scrGrad = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + 16);
                scrGrad.addColorStop(0, '#00f0ff');
                scrGrad.addColorStop(1, '#f43f5e');
                ctx.fillStyle = scrGrad;
                ctx.beginPath();
                ctx.moveTo(this.x + 4, this.y + 16);
                ctx.lineTo(this.x + 12, this.y);
                ctx.lineTo(this.x + 44, this.y);
                ctx.lineTo(this.x + 44, this.y + 16);
                ctx.closePath();
                ctx.fill();

                // Screen warning text
                ctx.fillStyle = '#ffffff';
                ctx.font = '900 9px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('⚡ CRASH', this.x + 28, this.y + 11);

                // Tangled cords with animated electric sparks
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.x - 18, this.y + 22);
                ctx.quadraticCurveTo(this.x - 8, this.y + 10, this.x, this.y + 18);
                ctx.stroke();

                // Electric spark dots
                if (this.animFrame % 4 < 2) {
                    ctx.fillStyle = '#fde047';
                    ctx.beginPath();
                    ctx.arc(this.x - 10, this.y + 12, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;

            case 'COFFEE_SPILL':
                // --- HAZARD COFFEE SPILL WITH WET FLOOR CONE ---
                ctx.shadowColor = '#ea580c';
                ctx.shadowBlur = 18 * pulse;

                // Glowing Orange Floor Puddle Outline
                ctx.strokeStyle = '#f97316';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(this.x + this.width / 2, this.y + 10, this.width / 2 + 3, 9, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Dark Hot Coffee Spill Puddle
                ctx.fillStyle = '#291003';
                ctx.beginPath();
                ctx.ellipse(this.x + this.width / 2, this.y + 10, this.width / 2, 7, 0, 0, Math.PI * 2);
                ctx.fill();

                // Knocked Mug
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.roundRect(this.x + 2, this.y, 14, 12, 3);
                ctx.fill();
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(this.x + 4, this.y + 2, 10, 4);

                // Fluorescent Yellow Caution Triangle Sign
                const tx = this.x + this.width - 12;
                const ty = this.y - 14;
                ctx.fillStyle = '#fde047';
                ctx.shadowColor = '#fde047';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.moveTo(tx, ty);
                ctx.lineTo(tx + 14, ty + 24);
                ctx.lineTo(tx - 14, ty + 24);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = '#000000';
                ctx.font = '900 11px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('⚠️', tx, ty + 19);
                break;

            case 'FLYING_BUZZWORD':
                // --- LASER BUZZWORD BARRIER ---
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 24 * pulse;

                // Outer High-Intensity Laser Border
                ctx.strokeStyle = '#fca5a5';
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.roundRect(this.x - 3, this.y - 3, this.width + 6, this.height + 6, 8);
                ctx.stroke();

                // High-Intensity Red-Orange Body
                const buzzGrad = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
                buzzGrad.addColorStop(0, '#ef4444');
                buzzGrad.addColorStop(1, '#b91c1c');
                ctx.fillStyle = buzzGrad;
                ctx.beginPath();
                ctx.roundRect(this.x, this.y, this.width, this.height, 6);
                ctx.fill();

                // High-Contrast Warning Text
                ctx.fillStyle = '#ffffff';
                ctx.font = '900 12.5px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('⚡ ' + this.text + ' ⚡', this.x + this.width / 2, this.y + 20);
                break;

            case 'TASK_BOULDER':
                // --- ROLLING URGENT BOULDER ---
                ctx.save();
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(this.rot);

                ctx.shadowColor = '#f43f5e';
                ctx.shadowBlur = 24 * pulse;

                // Outer Danger Ring
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(0, 0, this.width / 2 + 2, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                ctx.fill();

                // Red Caution Stamp
                ctx.fillStyle = '#dc2626';
                ctx.font = '900 12px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('🚨 URGENT', 0, -4);
                ctx.fillText('TASK 🚨', 0, 11);
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
                // Spinning Gold Point Token (P)
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.ellipse(this.x + 16, floatY + 16, 14 * Math.abs(Math.cos(this.anim * 1.5)), 14, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#d97706';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = '#78350f';
                ctx.font = '900 13px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('P', this.x + 16, floatY + 21);
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
let baseSpeed = 3.6; // Walking pace start (Classic Chrome Dinosaur pace)
let gameSpeed = baseSpeed;
let distance = 0;
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
    runCoins = 0;
    gameSpeed = baseSpeed;
    spawnCooldown = 50; // First obstacle arrives in <1 second!
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

// Spawner Logic — Dynamic Rhythmic Stream (Engaging, fair, zero dead time)
function updateSpawner(effectiveSpeed) {
    spawnCooldown--;
    if (spawnCooldown <= 0 && obstacles.length < 5) {
        // Compute dynamic cooldown: Starts around 80 frames, tightens down to 48 frames as speed increases
        const speedBonus = Math.min(32, (effectiveSpeed - baseSpeed) * 8.5);
        spawnCooldown = Math.max(48, Math.floor(82 - speedBonus + (Math.random() * 20 - 10)));

        const rand = Math.random();
        if (distance > 150 && rand < 0.28) {
            // Low-flying buzzword requiring ducking/sliding (like Dino Pterodactyl!)
            obstacles.push(new Obstacle('FLYING_BUZZWORD', 1050));
        } else if (rand < 0.25) {
            obstacles.push(new Obstacle('CHAIR', 1050));
        } else if (rand < 0.50) {
            obstacles.push(new Obstacle('CALENDAR', 1050));
        } else if (rand < 0.72) {
            obstacles.push(new Obstacle('LAPTOP', 1050));
        } else if (rand < 0.88) {
            obstacles.push(new Obstacle('COFFEE_SPILL', 1050));
        } else {
            obstacles.push(new Obstacle('TASK_BOULDER', 1050));
        }
    }

    // Spawn Coins & Power-ups rhythmically
    itemCooldown--;
    if (itemCooldown <= 0 && items.length < 5) {
        itemCooldown = Math.floor(65 + Math.random() * 40);
        if (Math.random() < 0.68) {
            const coinY = Math.random() > 0.4 ? 460 : 380;
            const coinCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < coinCount; i++) {
                items.push(new Item('COIN', 1100 + i * 42, coinY));
            }
        } else if (Math.random() < 0.4) {
            const powerups = ['COFFEE', 'HEADPHONES', 'PTO', 'OOO'];
            const chosen = powerups[Math.floor(Math.random() * powerups.length)];
            items.push(new Item(chosen, 1150, 420));
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

// Main Game Loop — Smooth, gradual Dino scaling starting at gentle walking speed
function updateGame() {
    if (currentState !== GAME_STATE.PLAYING) return;

    survivalTime = (performance.now() - runStartTime) / 1000;

    // Classic Chrome Dino gradual acceleration formula
    const targetBaseSpeed = baseSpeed + Math.min(4.2, distance * 0.0012 + survivalTime * 0.012);

    // Smooth speed boost multiplier (prevents sudden velocity spikes)
    const targetBoost = player.coffeeTimer > 0 ? 1.15 : (player.isDashing ? 1.22 : 1.0);
    const targetEffectiveSpeed = targetBaseSpeed * targetBoost;

    if (typeof window.smoothSpeed === 'undefined') window.smoothSpeed = baseSpeed;
    window.smoothSpeed += (targetEffectiveSpeed - window.smoothSpeed) * 0.06;
    const effectiveSpeed = window.smoothSpeed;
    gameSpeed = targetBaseSpeed;

    distance += effectiveSpeed * 0.055;

    const currentBiome = getCurrentBiome();

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
            // Invulnerable / Coffee / Dash Smash
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
                case 'COIN':
                    runCoins += 1;
                    window.soundManager.playCoin();
                    createScorePopup(item.x, item.y, '+1 P', '#fbbf24');
                    break;
                case 'COFFEE':
                    const durationFrames = Math.floor(240 * (upgrades.coffee_duration * 0.4 + 1) * (player.avatar.coffeeBonus || 1));
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
