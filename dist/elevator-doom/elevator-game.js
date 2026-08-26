// Elevator of Doom Roguelite Engine — Complete Push-Your-Luck Survival
const canvas = document.getElementById('elevatorCanvas');
const ctx = canvas.getContext('2d');

// Game States
const STATE = {
    LOBBY: 'LOBBY',
    SAFE_ROOM: 'SAFE_ROOM',
    CHOOSING_DECISION: 'CHOOSING_DECISION',
    COMBAT: 'COMBAT',
    DOORS_CLOSING: 'DOORS_CLOSING',
    GAMEOVER: 'GAMEOVER',
    VICTORY: 'VICTORY'
};

let gameState = STATE.LOBBY;
let currentFloor = 1;
let runCoins = 0;
let bankedCoins = parseInt(localStorage.getItem('doom_banked_coins') || '0', 10);
let enemiesSlain = 0;
let bossesDefeated = 0;
let secretsFound = 0;
let doomLevel = 0; // 0 to 100%
let activeBoss = null;
let currentDecision = null;
let shakeTimer = 0;
let radioLoreIndex = 0;
let timeWarpTimer = 0;

// Elevator Dimensions
const ELEVATOR = {
    x: 110,
    y: 80,
    w: 680,
    h: 470,
    floorY: 515,
    ceilingY: 115
};

// Floor Tiles (6 tiles that can collapse at high doom)
let floorTiles = [];
function resetFloorTiles() {
    floorTiles = [];
    const tileWidth = ELEVATOR.w / 6;
    for (let i = 0; i < 6; i++) {
        floorTiles.push({
            x: ELEVATOR.x + i * tileWidth,
            w: tileWidth,
            active: true,
            blinking: false,
            dropY: 0
        });
    }
}

// Weapon Arsenal Definitions
const WEAPONS = {
    KNIFE: {
        id: 'KNIFE',
        name: 'RUSTY KNIFE',
        icon: '🗡️',
        damage: 28,
        cooldown: 14,
        range: 55,
        type: 'melee',
        color: '#f87171',
        desc: 'Fast slashing blade with rapid attack speed.'
    },
    BLASTER: {
        id: 'BLASTER',
        name: 'SCRAP BLASTER',
        icon: '🔫',
        damage: 34,
        cooldown: 20,
        speed: 12,
        type: 'projectile',
        color: '#38bdf8',
        desc: 'High-speed kinetic bolts.'
    },
    BATON: {
        id: 'BATON',
        name: 'SHOCK BATON',
        icon: '⚡',
        damage: 30,
        cooldown: 22,
        range: 65,
        type: 'shock',
        color: '#facc15',
        desc: 'Electrocutes foes and stuns them.'
    },
    LAUNCHER: {
        id: 'LAUNCHER',
        name: 'DOOM LAUNCHER',
        icon: '🔥',
        damage: 75,
        cooldown: 45,
        speed: 8,
        type: 'explosive',
        color: '#ea580c',
        desc: 'Heavy rocket with destructive AoE blast.'
    },
    CLEAVER: {
        id: 'CLEAVER',
        name: 'EXECUTIONER CLEAVER',
        icon: '🪓',
        damage: 55,
        cooldown: 28,
        range: 60,
        type: 'melee',
        color: '#ef4444',
        desc: 'Heavy devastating wide cleave.'
    }
};

// Abilities Definitions
const ABILITIES = {
    DASH: {
        id: 'DASH',
        name: 'DASH (SHIFT)',
        icon: '💨',
        cooldownMax: 180, // 3 seconds at 60fps
        duration: 16,
        desc: 'Invulnerable sprint through hazards.'
    },
    TIME_WARP: {
        id: 'TIME_WARP',
        name: 'TIME WARP (Q)',
        icon: '⏳',
        cooldownMax: 480, // 8 seconds
        duration: 180,
        desc: 'Slows time for all enemies.'
    },
    SHIELD: {
        id: 'SHIELD',
        name: 'ENERGY SHIELD (E)',
        icon: '🛡️',
        cooldownMax: 420, // 7 seconds
        charges: 2,
        desc: 'Blocks 2 incoming hits completely.'
    },
    STIM: {
        id: 'STIM',
        name: 'EMERGENCY STIM (E)',
        icon: '🧪',
        cooldownMax: 600, // 10 seconds
        heal: 35,
        desc: 'Instantly heals 35 HP.'
    }
};

// Passive Upgrades Definitions
const PASSIVE_TYPES = {
    GREED: { id: 'GREED', name: 'Greed Token', icon: '🪙', desc: '+35% Coin Value' },
    VAMP: { id: 'VAMP', name: 'Vampirism', icon: '🩸', desc: '+6 HP per Kill' },
    OVERCLOCK: { id: 'OVERCLOCK', name: 'Overclock', icon: '⚡', desc: '+25% Speed & Firing Rate' },
    CRIT: { id: 'CRIT', name: 'Deadly Crit', icon: '🎯', desc: '+30% Critical Hit (2.2x)' },
    ARMOR: { id: 'ARMOR', name: 'Plated Armor', icon: '🦺', desc: '-25% Damage Taken' },
    MAGNET: { id: 'MAGNET', name: 'Magnetism', icon: '🧲', desc: 'Pulls coins & health from afar' }
};

// Radio Lore Broadcasts
const RADIO_BROADCASTS = [
    'Radio: "Attention all passengers: Please ignore any crawling sounds in the ventilation ducts."',
    'Radio: "Elevator safety inspection expired in 1984. Have a pleasant ascent!"',
    'Radio: "Security scans detect unauthorized biomass on higher floors."',
    'Radio: "The Janitor on Floor 10 has not taken a vacation in 40 years."',
    'Radio: "If you see The Elevator Man in the mirror, do not make eye contact."',
    'Radio: "Floor 30 was erased from architectural blueprints for legal reasons."',
    'Radio: "Reminder: High-risk decisions provide 200% higher coin payouts."',
    'Radio: "Emergency protocols engaged: Doors will seal during boss encounters."'
];

// Satirical Comedic Causes of Death
const CAUSES_OF_DEATH = [
    'Tried to high-five The Elevator Man.',
    'Trusted the elevator annual safety certificate.',
    'Attempted to arm-wrestle The Janitor.',
    'Forgot that Floor 17 was on fire.',
    'Walked straight into a Security Bot laser grid.',
    'Thought the glowing Mimic chest was a care package.',
    'Pushed luck one floor too high.',
    'Tripped over a severed cable on Floor 28.',
    'Microwaved fish on the elevator break room floor.',
    'Pressed every button simultaneously in a panic.',
    'Stared directly into the Doom Catastrophe event.',
    'Ignored the "Out of Order" sign on Floor 44.'
];

// Player Entity
class Player {
    constructor() {
        this.w = 32;
        this.h = 44;
        this.x = ELEVATOR.x + 100;
        this.y = ELEVATOR.floorY - this.h;
        this.vx = 0;
        this.vy = 0;
        this.speed = 4.8;
        this.isGrounded = true;
        this.isAlive = true;
        this.facing = 1; // 1 = right, -1 = left

        this.maxHp = 100;
        this.hp = 100;
        this.weapon = WEAPONS.KNIFE;
        this.ability = ABILITIES.DASH;
        this.passives = [];

        this.attackCooldown = 0;
        this.abilityCooldown = 0;
        this.isDashing = 0;
        this.shieldHits = 0;
        this.invulnerableTimer = 0;
    }

    resetForMatch() {
        this.x = ELEVATOR.x + 120;
        this.y = ELEVATOR.floorY - this.h;
        this.vx = 0;
        this.vy = 0;
        this.isAlive = true;
        this.hp = this.maxHp;
        this.invulnerableTimer = 0;
        this.isDashing = 0;
    }

    hasPassive(id) {
        return this.passives.some(p => p.id === id);
    }

    addPassive(passive) {
        if (!this.hasPassive(passive.id)) {
            this.passives.push(passive);
            updatePassivesHUD();
        }
    }

    takeDamage(dmg, reason = 'A lethal hazard') {
        if (!this.isAlive || this.isDashing > 0 || this.invulnerableTimer > 0) return;

        if (this.shieldHits > 0) {
            this.shieldHits--;
            createSparks(this.x + this.w / 2, this.y + this.h / 2, '#c084fc', 12);
            if (window.doomAudio) window.doomAudio.playShock();
            return;
        }

        if (this.hasPassive('ARMOR')) {
            dmg = Math.max(1, Math.round(dmg * 0.75));
        }

        this.hp -= dmg;
        this.invulnerableTimer = 30; // 0.5s i-frames
        shakeScreen(6);
        createBlood(this.x + this.w / 2, this.y + this.h / 2, 8);
        if (window.doomAudio) window.doomAudio.playPunch();

        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
            triggerGameOver(reason);
        }
        updateHUD();
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        createSparks(this.x + this.w / 2, this.y + this.h / 2, '#22c55e', 10);
        updateHUD();
    }

    triggerAttack() {
        if (!this.isAlive || this.attackCooldown > 0) return;

        const rateMod = this.hasPassive('OVERCLOCK') ? 0.8 : 1.0;
        this.attackCooldown = Math.round(this.weapon.cooldown * rateMod);

        const isCrit = this.hasPassive('CRIT') && Math.random() < 0.35;
        const dmgMult = isCrit ? 2.2 : 1.0;
        const totalDmg = Math.round(this.weapon.damage * dmgMult);

        if (this.weapon.type === 'melee') {
            if (window.doomAudio) window.doomAudio.playSlash();
            const slashX = this.facing === 1 ? this.x + this.w : this.x - this.weapon.range;
            slashes.push({
                x: slashX,
                y: this.y + 4,
                w: this.weapon.range,
                h: this.h - 8,
                facing: this.facing,
                life: 8,
                damage: totalDmg,
                isCrit: isCrit,
                color: this.weapon.color
            });
        } else if (this.weapon.type === 'projectile' || this.weapon.type === 'explosive') {
            if (this.weapon.type === 'explosive') {
                if (window.doomAudio) window.doomAudio.playRocket();
            } else {
                if (window.doomAudio) window.doomAudio.playBlasterShot();
            }
            projectiles.push({
                x: this.facing === 1 ? this.x + this.w : this.x - 12,
                y: this.y + this.h / 2 - 4,
                vx: this.facing * this.weapon.speed,
                vy: 0,
                radius: this.weapon.type === 'explosive' ? 8 : 5,
                damage: totalDmg,
                isExplosive: this.weapon.type === 'explosive',
                isCrit: isCrit,
                color: this.weapon.color,
                isPlayer: true
            });
        } else if (this.weapon.type === 'shock') {
            if (window.doomAudio) window.doomAudio.playShock();
            // Arc electricity to nearest enemies in front
            let hitAny = false;
            enemies.forEach(e => {
                const dist = Math.hypot((e.x + e.w / 2) - (this.x + this.w / 2), (e.y + e.h / 2) - (this.y + this.h / 2));
                if (dist < 180 && ((this.facing === 1 && e.x > this.x) || (this.facing === -1 && e.x < this.x))) {
                    e.takeDamage(totalDmg, isCrit);
                    e.freeze(40);
                    createLightning(this.x + this.w / 2, this.y + this.h / 2, e.x + e.w / 2, e.y + e.h / 2);
                    hitAny = true;
                }
            });
            if (!hitAny) {
                createLightning(this.x + this.w / 2, this.y + this.h / 2, this.x + this.w / 2 + this.facing * 120, this.y + this.h / 2);
            }
        }
    }

    triggerAbility() {
        if (!this.isAlive || this.abilityCooldown > 0) return;

        if (this.ability.id === 'DASH') {
            this.isDashing = this.ability.duration;
            this.abilityCooldown = this.ability.cooldownMax;
            this.vx = this.facing * 14;
            if (window.doomAudio) window.doomAudio.playDash();
            createGhostTrail(this.x, this.y, this.w, this.h);
        } else if (this.ability.id === 'TIME_WARP') {
            timeWarpTimer = this.ability.duration;
            this.abilityCooldown = this.ability.cooldownMax;
            if (window.doomAudio) window.doomAudio.playPowerup();
            createSparks(ELEVATOR.x + ELEVATOR.w / 2, ELEVATOR.y + ELEVATOR.h / 2, '#38bdf8', 30);
        } else if (this.ability.id === 'SHIELD') {
            this.shieldHits = 2;
            this.abilityCooldown = this.ability.cooldownMax;
            if (window.doomAudio) window.doomAudio.playPowerup();
        } else if (this.ability.id === 'STIM') {
            this.heal(this.ability.heal);
            this.abilityCooldown = this.ability.cooldownMax;
            if (window.doomAudio) window.doomAudio.playPowerup();
        }
        updateHUD();
    }

    update(keys) {
        if (!this.isAlive) return;

        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.abilityCooldown > 0) this.abilityCooldown--;
        if (this.invulnerableTimer > 0) this.invulnerableTimer--;
        if (this.isDashing > 0) this.isDashing--;

        // Horizontal Movement
        let moveSpeed = this.speed * (this.hasPassive('OVERCLOCK') ? 1.25 : 1.0);
        if (this.isDashing <= 0) {
            if (keys['KeyA'] || keys['ArrowLeft']) {
                this.vx = -moveSpeed;
                this.facing = -1;
            } else if (keys['KeyD'] || keys['ArrowRight']) {
                this.vx = moveSpeed;
                this.facing = 1;
            } else {
                this.vx *= 0.75;
            }

            // Jump
            if ((keys['KeyW'] || keys['ArrowUp'] || keys['Space']) && this.isGrounded) {
                this.vy = -12.5;
                this.isGrounded = false;
                if (window.doomAudio) window.doomAudio.playJump();
            }
        }

        // Gravity & Physics
        this.vy += 0.65;
        this.x += this.vx;
        this.y += this.vy;

        // Platform / Tile Floor Collision
        const currentFloorY = ELEVATOR.floorY;
        let onActiveTile = false;

        floorTiles.forEach(tile => {
            if (tile.active && this.x + this.w > tile.x && this.x < tile.x + tile.w) {
                if (this.y + this.h >= currentFloorY && this.y + this.h <= currentFloorY + 18 && this.vy >= 0) {
                    this.y = currentFloorY - this.h;
                    this.vy = 0;
                    this.isGrounded = true;
                    onActiveTile = true;
                }
            }
        });

        // Floor drop / pit death
        if (this.y > ELEVATOR.floorY + 80) {
            this.takeDamage(999, 'Fell through a collapsed elevator floor tile.');
        }

        // Wall Boundaries
        if (this.x < ELEVATOR.x + 8) this.x = ELEVATOR.x + 8;
        if (this.x + this.w > ELEVATOR.x + ELEVATOR.w - 8) this.x = ELEVATOR.x + ELEVATOR.w - 8 - this.w;

        // Magnetism passive pulls coins
        if (this.hasPassive('MAGNET')) {
            lootDrops.forEach(loot => {
                const dist = Math.hypot((this.x + this.w / 2) - loot.x, (this.y + this.h / 2) - loot.y);
                if (dist < 220) {
                    loot.x += ((this.x + this.w / 2) - loot.x) * 0.12;
                    loot.y += ((this.y + this.h / 2) - loot.y) * 0.12;
                }
            });
        }
    }

    draw(ctx) {
        if (!this.isAlive) return;

        ctx.save();

        // I-frames blink
        if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 4) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }

        // Energy Shield Visual Bubble
        if (this.shieldHits > 0) {
            ctx.beginPath();
            ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w + 6, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(192, 132, 252, ${0.4 + Math.sin(Date.now() * 0.01) * 0.3})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Body (Corporate Survivor in Suit)
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(this.x, this.y + 12, this.w, this.h - 12);

        // Head
        ctx.fillStyle = '#f6c7a4';
        ctx.fillRect(this.x + 6, this.y, 20, 16);

        // Hair
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(this.x + 4, this.y - 2, 24, 7);

        // Tie
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(this.x + 14, this.y + 14, 4, 16);

        // Eyes & Facing
        ctx.fillStyle = '#0f172a';
        if (this.facing === 1) {
            ctx.fillRect(this.x + 18, this.y + 5, 3, 4);
        } else {
            ctx.fillRect(this.x + 10, this.y + 5, 3, 4);
        }

        // Active Weapon in Hand
        ctx.fillStyle = this.weapon.color;
        const handX = this.facing === 1 ? this.x + this.w - 2 : this.x - 8;
        ctx.fillRect(handX, this.y + 20, 10, 5);

        ctx.restore();
    }
}

// 6 Unique Enemy AI Archetypes
class Enemy {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.facing = -1;
        this.frozenTimer = 0;
        this.isAlive = true;
        this.stateTimer = 0;

        // Configure Archetypes
        if (type === 'JANITOR') {
            this.name = 'The Janitor';
            this.w = 38;
            this.h = 48;
            this.hp = 85;
            this.maxHp = 85;
            this.speed = 1.6;
            this.color = '#78350f';
            this.damage = 30;
            this.attackRange = 48;
            this.attackCooldownMax = 70;
        } else if (type === 'ELEVATOR_MAN') {
            this.name = 'The Elevator Man';
            this.w = 30;
            this.h = 46;
            this.hp = 65;
            this.maxHp = 65;
            this.speed = 2.4;
            this.color = '#1e1b4b';
            this.damage = 35;
            this.attackRange = 40;
            this.attackCooldownMax = 80;
            this.teleportCooldown = 180;
        } else if (type === 'CRAWLER') {
            this.name = 'Vent Crawler';
            this.w = 34;
            this.h = 24;
            this.hp = 45;
            this.maxHp = 45;
            this.speed = 3.6;
            this.color = '#15803d';
            this.damage = 20;
            this.attackRange = 36;
            this.attackCooldownMax = 45;
        } else if (type === 'MIMIC') {
            this.name = 'Greed Mimic';
            this.w = 32;
            this.h = 32;
            this.hp = 90;
            this.maxHp = 90;
            this.speed = 0; // Starts dormant
            this.isAwake = false;
            this.color = '#eab308';
            this.damage = 40;
            this.attackRange = 42;
            this.attackCooldownMax = 50;
        } else if (type === 'SECURITY_BOT') {
            this.name = 'Security Bot';
            this.w = 30;
            this.h = 36;
            this.hp = 50;
            this.maxHp = 50;
            this.speed = 2.0;
            this.color = '#38bdf8';
            this.damage = 25;
            this.attackRange = 350;
            this.attackCooldownMax = 90;
        } else if (type === 'DOOM_CHILD') {
            this.name = 'Doom Child';
            this.w = 24;
            this.h = 32;
            this.hp = 30;
            this.maxHp = 30;
            this.speed = 4.2;
            this.color = '#ec4899';
            this.damage = 15;
            this.attackRange = 30;
            this.attackCooldownMax = 60;
        }

        this.attackCooldown = 0;
    }

    freeze(frames) {
        this.frozenTimer = frames;
    }

    takeDamage(dmg, isCrit = false) {
        if (!this.isAlive) return;

        this.hp -= dmg;
        createDamageNumber(this.x + this.w / 2, this.y, dmg, isCrit);
        createBlood(this.x + this.w / 2, this.y + this.h / 2, 6);

        // Wake up mimic if sleeping
        if (this.type === 'MIMIC' && !this.isAwake) {
            this.isAwake = true;
            this.speed = 3.2;
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
            enemiesSlain++;
            createSparks(this.x + this.w / 2, this.y + this.h / 2, this.color, 16);

            // Vampirism passive heal
            if (player.hasPassive('VAMP')) {
                player.heal(6);
            }

            // Coin Loot Drop
            const coinVal = Math.round((Math.floor(Math.random() * 8) + 6) * (player.hasPassive('GREED') ? 1.35 : 1.0));
            spawnLoot(this.x + this.w / 2, this.y + this.h / 2, 'COIN', coinVal);

            // Chance for weapon drop or health stim
            if (Math.random() < 0.15) {
                spawnLoot(this.x + this.w / 2, this.y + this.h / 2, 'HEAL', 25);
            }

            // Doom Child explosive death curse
            if (this.type === 'DOOM_CHILD') {
                createExplosion(this.x + this.w / 2, this.y + this.h / 2, 80, 25);
            }
        }
    }

    update(player) {
        if (!this.isAlive) return;

        if (this.frozenTimer > 0) {
            this.frozenTimer--;
            return;
        }

        if (this.attackCooldown > 0) this.attackCooldown--;
        this.stateTimer++;

        const dx = (player.x + player.w / 2) - (this.x + this.w / 2);
        const dy = (player.y + player.h / 2) - (this.y + this.h / 2);
        const dist = Math.hypot(dx, dy);

        this.facing = dx >= 0 ? 1 : -1;

        // Apply Time Warp slow motion
        const timeMod = timeWarpTimer > 0 ? 0.4 : (doomLevel >= 50 ? 1.25 : 1.0);

        // Archetype AI Routines
        if (this.type === 'JANITOR') {
            // Heavy walking smash
            this.vx = Math.sign(dx) * this.speed * timeMod;
            if (dist < this.attackRange && this.attackCooldown <= 0) {
                this.attackCooldown = this.attackCooldownMax;
                player.takeDamage(this.damage, 'Crushed by The Janitor heavy industrial broom.');
                createSparks(player.x + player.w / 2, player.y + player.h / 2, '#78350f', 12);
            }
        } else if (this.type === 'ELEVATOR_MAN') {
            // Stalker + Teleport behind player
            if (this.stateTimer % this.teleportCooldown === 0) {
                // Teleport behind player!
                this.x = player.x - player.facing * 45;
                this.y = player.y;
                createSparks(this.x, this.y, '#c084fc', 18);
                if (window.doomAudio) window.doomAudio.playShock();
            } else {
                this.vx = Math.sign(dx) * this.speed * timeMod;
            }

            if (dist < this.attackRange && this.attackCooldown <= 0) {
                this.attackCooldown = this.attackCooldownMax;
                player.takeDamage(this.damage, 'Backstabbed by The Elevator Man.');
            }
        } else if (this.type === 'CRAWLER') {
            // High speed scuttle & jump
            this.vx = Math.sign(dx) * this.speed * timeMod;
            if (dist < 120 && this.vy === 0 && Math.random() < 0.04) {
                this.vy = -9; // Pounce jump!
            }
            if (dist < this.attackRange && this.attackCooldown <= 0) {
                this.attackCooldown = this.attackCooldownMax;
                player.takeDamage(this.damage, 'Ambushed by a Vent Crawler.');
            }
        } else if (this.type === 'MIMIC') {
            // Wait until player approaches
            if (!this.isAwake && dist < 70) {
                this.isAwake = true;
                this.speed = 3.4;
                createSparks(this.x, this.y, '#eab308', 15);
                if (window.doomAudio) window.doomAudio.playAlarm();
            }
            if (this.isAwake) {
                this.vx = Math.sign(dx) * this.speed * timeMod;
                if (dist < this.attackRange && this.attackCooldown <= 0) {
                    this.attackCooldown = this.attackCooldownMax;
                    player.takeDamage(this.damage, 'Devoured by a Greed Mimic.');
                }
            }
        } else if (this.type === 'SECURITY_BOT') {
            // Hover & Fire Lasers
            if (dist > 180) {
                this.vx = Math.sign(dx) * this.speed * timeMod;
            } else if (dist < 100) {
                this.vx = -Math.sign(dx) * this.speed * timeMod;
            } else {
                this.vx = 0;
            }

            if (this.attackCooldown <= 0) {
                this.attackCooldown = this.attackCooldownMax;
                // Fire Laser Bolt
                if (window.doomAudio) window.doomAudio.playLaser();
                projectiles.push({
                    x: this.x + this.w / 2,
                    y: this.y + this.h / 2,
                    vx: Math.sign(dx) * 7,
                    vy: 0,
                    radius: 4,
                    damage: this.damage,
                    color: '#ef4444',
                    isPlayer: false
                });
            }
        } else if (this.type === 'DOOM_CHILD') {
            // Run AWAY from player!
            this.vx = -Math.sign(dx) * this.speed * timeMod;
        }

        // Gravity & Movement
        this.vy += 0.55;
        this.x += this.vx;
        this.y += this.vy;

        // Ground Floor
        if (this.y + this.h >= ELEVATOR.floorY) {
            this.y = ELEVATOR.floorY - this.h;
            this.vy = 0;
        }

        // Elevator Wall Constraints
        if (this.x < ELEVATOR.x + 8) this.x = ELEVATOR.x + 8;
        if (this.x + this.w > ELEVATOR.x + ELEVATOR.w - 8) this.x = ELEVATOR.x + ELEVATOR.w - 8 - this.w;
    }

    draw(ctx) {
        if (!this.isAlive) return;

        ctx.save();

        if (this.type === 'JANITOR') {
            // Brown uniform with broom
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#f6c7a4';
            ctx.fillRect(this.x + 8, this.y + 4, 22, 14); // face
            ctx.fillStyle = '#451a03';
            ctx.fillRect(this.facing === 1 ? this.x + this.w : this.x - 8, this.y + 8, 8, 38); // broom
        } else if (this.type === 'ELEVATOR_MAN') {
            // Dark suit with red tie & glitch aura
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(this.x + 13, this.y + 16, 4, 14);
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x + 8, this.y + 6, 14, 10);
        } else if (this.type === 'CRAWLER') {
            // Low spider crawler
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y + 8, this.w, this.h - 8);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(this.x + 6, this.y + 12, 5, 5);
            ctx.fillRect(this.x + 22, this.y + 12, 5, 5);
        } else if (this.type === 'MIMIC') {
            // Chest box or opened mouth
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#78350f';
            ctx.fillRect(this.x + 4, this.y + 4, this.w - 8, this.h - 8);
            if (this.isAwake) {
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(this.x + 8, this.y + 12, this.w - 16, 10);
            }
        } else if (this.type === 'SECURITY_BOT') {
            // Hovering metallic drone
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(this.x + this.w / 2, this.y + 14, 6, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'DOOM_CHILD') {
            // Small pink cloaked figure
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }

        // Health Bar above enemy
        if (this.hp < this.maxHp) {
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(this.x, this.y - 8, this.w, 4);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(this.x, this.y - 8, this.w * (this.hp / this.maxHp), 4);
        }

        ctx.restore();
    }
}

// Milestone Boss Class (Floors 10, 20, 30, 40, 50+)
class Boss {
    constructor(floor) {
        this.floor = floor;
        this.w = 64;
        this.h = 75;
        this.x = ELEVATOR.x + ELEVATOR.w - 120;
        this.y = ELEVATOR.floorY - this.h;
        this.vx = 0;
        this.vy = 0;
        this.isAlive = true;
        this.attackTimer = 0;
        this.phase = 1;

        if (floor <= 10) {
            this.name = 'THE JANITOR PRIME';
            this.icon = '🧹';
            this.hp = 350;
            this.maxHp = 350;
            this.color = '#78350f';
            this.speed = 2.2;
        } else if (floor <= 20) {
            this.name = 'SECURITY CHIEF V-9000';
            this.icon = '🤖';
            this.hp = 500;
            this.maxHp = 500;
            this.color = '#0284c7';
            this.speed = 2.8;
        } else if (floor <= 30) {
            this.name = 'THE ELEVATOR MAN (UNBOUND)';
            this.icon = '🕴️';
            this.hp = 680;
            this.maxHp = 680;
            this.color = '#581c87';
            this.speed = 3.5;
        } else {
            this.name = 'THE HARBINGER OF DOOM';
            this.icon = '💀';
            this.hp = 950;
            this.maxHp = 950;
            this.color = '#b91c1c';
            this.speed = 4.0;
        }

        showBossHUD(this);
    }

    takeDamage(dmg, isCrit = false) {
        if (!this.isAlive) return;

        this.hp -= dmg;
        createDamageNumber(this.x + this.w / 2, this.y - 10, dmg, isCrit);
        createBlood(this.x + this.w / 2, this.y + this.h / 2, 8);
        updateBossHUD(this);

        if (this.hp <= this.maxHp * 0.5 && this.phase === 1) {
            this.phase = 2;
            this.speed *= 1.4;
            document.getElementById('boss-phase').textContent = 'PHASE 2 (ENRAGED)';
            createExplosion(this.x + this.w / 2, this.y + this.h / 2, 90, 0);
            if (window.doomAudio) window.doomAudio.playAlarm();
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
            bossesDefeated++;
            hideBossHUD();
            createExplosion(this.x + this.w / 2, this.y + this.h / 2, 140, 0);
            if (window.doomAudio) window.doomAudio.playCashOut();
        }
    }

    update(player) {
        if (!this.isAlive) return;

        this.attackTimer++;
        const dx = (player.x + player.w / 2) - (this.x + this.w / 2);
        const dist = Math.abs(dx);

        this.vx = Math.sign(dx) * this.speed;

        // Attack patterns
        if (this.attackTimer % 90 === 0) {
            // Boss Projectile Burst
            if (window.doomAudio) window.doomAudio.playLaser();
            projectiles.push({
                x: this.x + this.w / 2,
                y: this.y + 20,
                vx: Math.sign(dx) * 8,
                vy: 0,
                radius: 7,
                damage: 32,
                color: '#ef4444',
                isPlayer: false
            });
        }

        if (dist < 60 && this.attackTimer % 60 === 0) {
            player.takeDamage(40, `Crushed by ${this.name}.`);
        }

        this.x += this.vx;

        // Bounds
        if (this.x < ELEVATOR.x + 10) this.x = ELEVATOR.x + 10;
        if (this.x + this.w > ELEVATOR.x + ELEVATOR.w - 10) this.x = ELEVATOR.x + ELEVATOR.w - 10 - this.w;
    }

    draw(ctx) {
        if (!this.isAlive) return;

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Boss Icon Emblem
        ctx.font = '24px Outfit, sans-serif';
        ctx.fillText(this.icon, this.x + 18, this.y + 45);

        ctx.restore();
    }
}

// Global Containers
let player = new Player();
let enemies = [];
let slashes = [];
let projectiles = [];
let particles = [];
let damageNumbers = [];
let lootDrops = [];
let keysDown = {};

// Spawn Particle & Combat VFX Helpers
function createSparks(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 20,
            maxLife: 20,
            color
        });
    }
}

function createBlood(x, y, count = 6) {
    createSparks(x, y, '#ef4444', count);
}

function createDamageNumber(x, y, num, isCrit = false) {
    damageNumbers.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y,
        text: (isCrit ? 'CRIT! ' : '') + num,
        color: isCrit ? '#facc15' : '#ffffff',
        fontSize: isCrit ? 18 : 14,
        life: 30
    });
}

function createGhostTrail(x, y, w, h) {
    particles.push({
        x, y, w, h,
        isGhost: true,
        life: 14,
        maxLife: 14
    });
}

function createLightning(x1, y1, x2, y2) {
    particles.push({
        x1, y1, x2, y2,
        isLightning: true,
        life: 6
    });
}

function createExplosion(x, y, radius, damage) {
    if (window.doomAudio) window.doomAudio.playExplosion();
    shakeScreen(10);
    createSparks(x, y, '#ea580c', 24);

    // Damage enemies in AoE
    enemies.forEach(e => {
        const dist = Math.hypot((e.x + e.w / 2) - x, (e.y + e.h / 2) - y);
        if (dist <= radius) {
            e.takeDamage(damage || 70, true);
        }
    });

    if (activeBoss && activeBoss.isAlive) {
        const dist = Math.hypot((activeBoss.x + activeBoss.w / 2) - x, (activeBoss.y + activeBoss.h / 2) - y);
        if (dist <= radius) {
            activeBoss.takeDamage(damage || 70, true);
        }
    }
}

function spawnLoot(x, y, type, value) {
    lootDrops.push({
        x, y,
        vy: -4,
        type,
        value,
        collected: false
    });
}

function shakeScreen(amount) {
    shakeTimer = amount;
}

// HUD & UI Synchronization
function updateHUD() {
    document.getElementById('hud-floor-text').textContent = `FLOOR ${currentFloor}`;
    document.getElementById('hud-hp-text').textContent = `${player.hp}/${player.maxHp}`;
    document.getElementById('hud-hp-bar').style.width = `${(player.hp / player.maxHp) * 100}%`;
    document.getElementById('hud-run-coins').textContent = `${runCoins}`;
    document.getElementById('hud-bank-coins').textContent = `${bankedCoins}`;

    // Doom Meter
    document.getElementById('hud-doom-val').textContent = `${Math.floor(doomLevel)}%`;
    document.getElementById('hud-doom-bar').style.width = `${doomLevel}%`;

    let tierLabel = 'TIER 1: CALM';
    if (doomLevel >= 90) tierLabel = 'TIER 5: CORRUPTED 💀';
    else if (doomLevel >= 75) tierLabel = 'TIER 4: MALFUNCTIONING ⚡';
    else if (doomLevel >= 50) tierLabel = 'TIER 3: ENRAGED 🔥';
    else if (doomLevel >= 25) tierLabel = 'TIER 2: FLICKERING ⚠️';
    document.getElementById('hud-doom-tier-text').textContent = tierLabel;

    // Weapon & Ability
    document.getElementById('hud-weapon-icon').textContent = player.weapon.icon;
    document.getElementById('hud-weapon-name').textContent = player.weapon.name;
    document.getElementById('hud-ability-icon').textContent = player.ability.icon;
    document.getElementById('hud-ability-name').textContent = player.ability.name;
}

function updatePassivesHUD() {
    const strip = document.getElementById('hud-passives-row');
    strip.innerHTML = '';
    player.passives.forEach(p => {
        const badge = document.createElement('div');
        badge.className = 'passive-badge';
        badge.textContent = `${p.icon} ${p.name}`;
        strip.appendChild(badge);
    });
}

function showBossHUD(boss) {
    const el = document.getElementById('boss-hud-overlay');
    el.classList.remove('hidden');
    document.getElementById('boss-icon').textContent = boss.icon;
    document.getElementById('boss-name').textContent = boss.name;
    document.getElementById('boss-phase').textContent = 'PHASE 1';
    document.getElementById('boss-bar-fill').style.width = '100%';
}

function updateBossHUD(boss) {
    document.getElementById('boss-bar-fill').style.width = `${(boss.hp / boss.maxHp) * 100}%`;
}

function hideBossHUD() {
    document.getElementById('boss-hud-overlay').classList.add('hidden');
}

// 2–3 Strategic Floor Decision Generator
function generateFloorDecision(floor) {
    document.getElementById('decision-floor-badge').textContent = `🛗 FLOOR ${floor} REACHED`;

    const choicesGrid = document.getElementById('choices-grid');
    choicesGrid.innerHTML = '';

    const choices = [
        {
            type: 'safe',
            title: 'Safe Route',
            icon: '🟢',
            desc: 'A clear room with light patrol. Minimal danger and standard reward.',
            reward: '+20 Run Coins',
            action: () => startCombatFloor('SAFE')
        },
        {
            type: 'danger',
            title: 'Crucible Chamber',
            icon: '🔴',
            desc: 'Hostile floor with elite foes. Higher danger with rare weapon / perk drops.',
            reward: 'Rare Weapon & High Loot',
            action: () => startCombatFloor('DANGER')
        },
        {
            type: 'gamble',
            title: 'Elevator Gamble',
            icon: '🟣',
            desc: 'High stakes: 50% chance of massive coin jackpot, 50% chance of extreme trap.',
            reward: '50% Jackpot / 50% Trap',
            action: () => startCombatFloor('GAMBLE')
        }
    ];

    choices.forEach(c => {
        const card = document.createElement('div');
        card.className = `choice-card choice-${c.type}`;
        card.innerHTML = `
            <div class="choice-icon">${c.icon}</div>
            <div class="choice-name">${c.title}</div>
            <div class="choice-desc">${c.desc}</div>
            <div class="choice-reward-tag">${c.reward}</div>
        `;
        card.onclick = () => {
            document.getElementById('decision-modal').classList.add('hidden');
            c.action();
        };
        choicesGrid.appendChild(card);
    });

    document.getElementById('decision-modal').classList.remove('hidden');
    gameState = STATE.CHOOSING_DECISION;
}

// Combat Floor Spawner
function startCombatFloor(routeType) {
    gameState = STATE.COMBAT;
    enemies = [];
    activeBoss = null;
    hideBossHUD();
    resetFloorTiles();

    // Check Milestone Boss every 10 floors
    if (currentFloor % 10 === 0) {
        activeBoss = new Boss(currentFloor);
        if (window.doomAudio) window.doomAudio.playBossEncounter();
        return;
    }

    // Determine enemy count and compositions
    let enemyCount = Math.min(6, Math.floor(currentFloor / 3) + 2);
    if (routeType === 'DANGER') enemyCount += 2;

    const types = ['JANITOR', 'ELEVATOR_MAN', 'CRAWLER', 'MIMIC', 'SECURITY_BOT', 'DOOM_CHILD'];

    for (let i = 0; i < enemyCount; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const spawnX = ELEVATOR.x + 80 + Math.random() * (ELEVATOR.w - 160);
        enemies.push(new Enemy(type, spawnX, ELEVATOR.floorY - 40));
    }

    if (routeType === 'GAMBLE') {
        if (Math.random() < 0.5) {
            // Jackpot!
            for (let i = 0; i < 4; i++) spawnLoot(ELEVATOR.x + 100 + i * 120, ELEVATOR.floorY - 40, 'COIN', 30);
        } else {
            // Trap: Spawns 2 extra crawlers and increases doom
            doomLevel = Math.min(100, doomLevel + 15);
            enemies.push(new Enemy('CRAWLER', ELEVATOR.x + 120, ELEVATOR.floorY - 40));
            enemies.push(new Enemy('CRAWLER', ELEVATOR.x + ELEVATOR.w - 120, ELEVATOR.floorY - 40));
        }
    }
}

// In-Elevator Safe Room & "DO I GO HIGHER?" Cash-Out Console
function openSafeRoom() {
    gameState = STATE.SAFE_ROOM;
    if (window.doomAudio) window.doomAudio.playDing();

    document.getElementById('door-left').classList.add('closed');
    document.getElementById('door-right').classList.add('closed');

    document.getElementById('safe-floor-title').textContent = `FLOOR ${currentFloor} SURVIVED`;
    document.getElementById('safe-coins-val').textContent = `${runCoins}`;
    document.getElementById('risk-bank-coins-text').textContent = `${runCoins} RUN COINS`;
    document.getElementById('btn-cash-out-sub').textContent = `Escape with ${runCoins} Coins`;
    document.getElementById('btn-higher-title').textContent = `GO TO FLOOR ${currentFloor + 1} →`;

    // Radio Broadcast Lore Ticker
    const radioText = RADIO_BROADCASTS[radioLoreIndex % RADIO_BROADCASTS.length];
    radioLoreIndex++;
    document.getElementById('safe-radio-text').textContent = radioText;

    // Populate Vendor Items
    const vendorGrid = document.getElementById('safe-vendor-grid');
    vendorGrid.innerHTML = '';

    const vendorItems = [
        {
            name: 'Health Stim',
            icon: '🩹',
            cost: 25,
            action: () => {
                if (runCoins >= 25 && player.hp < player.maxHp) {
                    runCoins -= 25;
                    player.heal(40);
                    if (window.doomAudio) window.doomAudio.playPowerup();
                    openSafeRoom();
                }
            }
        },
        {
            name: 'Weapon Crate',
            icon: '🔫',
            cost: 45,
            action: () => {
                if (runCoins >= 45) {
                    runCoins -= 45;
                    const weaponKeys = Object.keys(WEAPONS);
                    const nextW = WEAPONS[weaponKeys[Math.floor(Math.random() * weaponKeys.length)]];
                    player.weapon = nextW;
                    if (window.doomAudio) window.doomAudio.playPowerup();
                    openSafeRoom();
                }
            }
        },
        {
            name: 'Mystery Perk',
            icon: '🧪',
            cost: 50,
            action: () => {
                if (runCoins >= 50) {
                    runCoins -= 50;
                    const passiveKeys = Object.keys(PASSIVE_TYPES);
                    const nextP = PASSIVE_TYPES[passiveKeys[Math.floor(Math.random() * passiveKeys.length)]];
                    player.addPassive(nextP);
                    if (window.doomAudio) window.doomAudio.playPowerup();
                    openSafeRoom();
                }
            }
        },
        {
            name: 'Max HP Boost',
            icon: '🦺',
            cost: 40,
            action: () => {
                if (runCoins >= 40) {
                    runCoins -= 40;
                    player.maxHp += 20;
                    player.hp += 20;
                    if (window.doomAudio) window.doomAudio.playPowerup();
                    openSafeRoom();
                }
            }
        }
    ];

    vendorItems.forEach(item => {
        const el = document.createElement('div');
        el.className = `vendor-item ${runCoins < item.cost ? 'disabled' : ''}`;
        el.innerHTML = `
            <div class="vendor-item-icon">${item.icon}</div>
            <div class="vendor-item-name">${item.name}</div>
            <div class="vendor-item-cost">🪙 ${item.cost}</div>
        `;
        el.onclick = item.action;
        vendorGrid.appendChild(el);
    });

    document.getElementById('safe-room-modal').classList.remove('hidden');
}

// Cash-Out / Bank Coins
function cashOutAndEscape() {
    bankedCoins += runCoins;
    localStorage.setItem('doom_banked_coins', bankedCoins.toString());
    if (window.doomAudio) window.doomAudio.playCashOut();
    document.getElementById('safe-room-modal').classList.add('hidden');

    // Show Victory Run Screen
    gameState = STATE.VICTORY;
    document.getElementById('gameover-badge').textContent = '🏆 SAFE ESCAPE BANKED';
    document.getElementById('gameover-badge').style.background = 'linear-gradient(135deg, #22c55e, #15803d)';
    document.getElementById('gameover-title').textContent = 'You Escaped the Elevator!';
    document.getElementById('gameover-subtitle').textContent = `"Walked out the lobby on Floor ${currentFloor} with pockets full of gold."`;

    document.getElementById('res-floor').textContent = `Floor ${currentFloor}`;
    document.getElementById('res-coins').textContent = `🪙 ${runCoins} Banked`;
    document.getElementById('res-kills').textContent = `${enemiesSlain}`;
    document.getElementById('res-bosses').textContent = `${bossesDefeated}`;
    document.getElementById('res-secrets').textContent = `${secretsFound}`;
    document.getElementById('res-rank').textContent = 'Master Escape Artist 🏆';
    document.getElementById('res-build-summary').textContent = `FINAL BUILD: ${player.weapon.name} + ${player.ability.name} (${player.passives.length} Perks)`;

    document.getElementById('gameover-screen').classList.remove('hidden');
}

// Advance to Next Floor
function advanceToNextFloor() {
    document.getElementById('safe-room-modal').classList.add('hidden');
    currentFloor++;
    doomLevel = Math.min(100, doomLevel + 6); // Doom rises each floor!

    // Doors open animation
    document.getElementById('door-left').classList.remove('closed');
    document.getElementById('door-right').classList.remove('closed');
    if (window.doomAudio) window.doomAudio.playDoorOpen();

    setTimeout(() => {
        generateFloorDecision(currentFloor);
    }, 600);
}

// Game Over Screen
function triggerGameOver(reason) {
    gameState = STATE.GAMEOVER;
    if (window.doomAudio) window.doomAudio.playGameOver();

    // Cause of death
    const randomDeath = CAUSES_OF_DEATH[Math.floor(Math.random() * CAUSES_OF_DEATH.length)];
    const finalReason = reason || randomDeath;

    document.getElementById('gameover-badge').textContent = '💀 DOOMED';
    document.getElementById('gameover-badge').style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
    document.getElementById('gameover-title').textContent = 'You Were Eliminated!';
    document.getElementById('gameover-subtitle').textContent = `"${finalReason}"`;

    document.getElementById('res-floor').textContent = `Floor ${currentFloor}`;
    document.getElementById('res-coins').textContent = `🪙 ${runCoins} (Lost)`;
    document.getElementById('res-kills').textContent = `${enemiesSlain}`;
    document.getElementById('res-bosses').textContent = `${bossesDefeated}`;
    document.getElementById('res-secrets').textContent = `${secretsFound}`;
    document.getElementById('res-rank').textContent = 'Certified Splat 💀';
    document.getElementById('res-build-summary').textContent = `FINAL BUILD: ${player.weapon.name} + ${player.ability.name} (${player.passives.length} Perks)`;

    document.getElementById('gameover-screen').classList.remove('hidden');
}

// Init / Start Match
function startNewRun() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('safe-room-modal').classList.add('hidden');
    document.getElementById('decision-modal').classList.add('hidden');

    currentFloor = 1;
    runCoins = 0;
    enemiesSlain = 0;
    bossesDefeated = 0;
    secretsFound = 0;
    doomLevel = 0;
    timeWarpTimer = 0;

    player.resetForMatch();
    player.weapon = WEAPONS.KNIFE;
    player.ability = ABILITIES.DASH;
    player.passives = [];
    updatePassivesHUD();
    updateHUD();

    document.getElementById('door-left').classList.remove('closed');
    document.getElementById('door-right').classList.remove('closed');

    if (window.doomAudio) window.doomAudio.playDoorOpen();
    generateFloorDecision(1);
}

// Main Game Loop
function update() {
    if (shakeTimer > 0) shakeTimer--;
    if (timeWarpTimer > 0) timeWarpTimer--;

    // Slowly increase Doom Meter over time during active combat
    if (gameState === STATE.COMBAT) {
        doomLevel = Math.min(100, doomLevel + 0.015);

        // Check Malfunctioning Floor (75% Doom)
        if (doomLevel >= 75 && Math.random() < 0.005) {
            const tileIdx = Math.floor(Math.random() * floorTiles.length);
            floorTiles[tileIdx].active = false;
            setTimeout(() => { floorTiles[tileIdx].active = true; }, 3500);
        }
    }

    if (gameState === STATE.COMBAT) {
        player.update(keysDown);

        // Update Slashes
        for (let i = slashes.length - 1; i >= 0; i--) {
            const s = slashes[i];
            s.life--;

            // Hit check on enemies
            enemies.forEach(e => {
                if (e.isAlive && s.x + s.w > e.x && s.x < e.x + e.w && s.y + s.h > e.y && s.y < e.y + e.h) {
                    e.takeDamage(s.damage, s.isCrit);
                }
            });

            if (activeBoss && activeBoss.isAlive) {
                if (s.x + s.w > activeBoss.x && s.x < activeBoss.x + activeBoss.w && s.y + s.h > activeBoss.y && s.y < activeBoss.y + activeBoss.h) {
                    activeBoss.takeDamage(s.damage, s.isCrit);
                }
            }

            if (s.life <= 0) slashes.splice(i, 1);
        }

        // Update Projectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const p = projectiles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.isPlayer) {
                // Hit enemies
                enemies.forEach(e => {
                    if (e.isAlive && Math.hypot((e.x + e.w / 2) - p.x, (e.y + e.h / 2) - p.y) < e.w / 2 + p.radius) {
                        if (p.isExplosive) {
                            createExplosion(p.x, p.y, 80, p.damage);
                        } else {
                            e.takeDamage(p.damage, p.isCrit);
                        }
                        p.dead = true;
                    }
                });

                if (activeBoss && activeBoss.isAlive && Math.hypot((activeBoss.x + activeBoss.w / 2) - p.x, (activeBoss.y + activeBoss.h / 2) - p.y) < activeBoss.w / 2 + p.radius) {
                    if (p.isExplosive) {
                        createExplosion(p.x, p.y, 90, p.damage);
                    } else {
                        activeBoss.takeDamage(p.damage, p.isCrit);
                    }
                    p.dead = true;
                }
            } else {
                // Hit player
                if (player.isAlive && Math.hypot((player.x + player.w / 2) - p.x, (player.y + player.h / 2) - p.y) < player.w / 2 + p.radius) {
                    player.takeDamage(p.damage, 'Shot down by security fire.');
                    p.dead = true;
                }
            }

            // Boundary collision
            if (p.x < ELEVATOR.x || p.x > ELEVATOR.x + ELEVATOR.w) p.dead = true;

            if (p.dead) projectiles.splice(i, 1);
        }

        // Update Enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            e.update(player);
            if (!e.isAlive) enemies.splice(i, 1);
        }

        // Update Boss
        if (activeBoss) {
            activeBoss.update(player);
            if (!activeBoss.isAlive) activeBoss = null;
        }

        // Update Loot Drops
        for (let i = lootDrops.length - 1; i >= 0; i--) {
            const loot = lootDrops[i];
            loot.vy = Math.min(4, loot.vy + 0.3);
            loot.y += loot.vy;

            if (loot.y >= ELEVATOR.floorY - 14) {
                loot.y = ELEVATOR.floorY - 14;
                loot.vy = 0;
            }

            // Collection Check
            const dist = Math.hypot((player.x + player.w / 2) - loot.x, (player.y + player.h / 2) - loot.y);
            if (dist < 32 && !loot.collected) {
                loot.collected = true;
                if (loot.type === 'COIN') {
                    runCoins += loot.value;
                    if (window.doomAudio) window.doomAudio.playCoin();
                } else if (loot.type === 'HEAL') {
                    player.heal(loot.value);
                    if (window.doomAudio) window.doomAudio.playPowerup();
                } else if (loot.type === 'WEAPON_CHEST') {
                    const keys = Object.keys(WEAPONS);
                    player.weapon = WEAPONS[keys[Math.floor(Math.random() * keys.length)]];
                    if (window.doomAudio) window.doomAudio.playPowerup();
                }
                updateHUD();
                lootDrops.splice(i, 1);
            }
        }

        // Check if Floor Cleared!
        if (enemies.length === 0 && (!activeBoss || !activeBoss.isAlive)) {
            setTimeout(openSafeRoom, 800);
            gameState = STATE.DOORS_CLOSING;
        }
    }

    // Update Particles & Floating Text
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life--;
        if (p.vx) p.x += p.vx;
        if (p.vy) p.y += p.vy;
        if (p.life <= 0) particles.splice(i, 1);
    }

    for (let i = damageNumbers.length - 1; i >= 0; i--) {
        const dn = damageNumbers[i];
        dn.y -= 0.8;
        dn.life--;
        if (dn.life <= 0) damageNumbers.splice(i, 1);
    }

    updateHUD();
}

// Render Canvas
function render() {
    ctx.save();

    // Screen Shake
    if (shakeTimer > 0) {
        ctx.translate((Math.random() - 0.5) * shakeTimer * 1.5, (Math.random() - 0.5) * shakeTimer * 1.5);
    }

    // Background Shaft
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Elevator Outer Structure (Steel Mesh & Wires)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    for (let x = ELEVATOR.x; x <= ELEVATOR.x + ELEVATOR.w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, ELEVATOR.y);
        ctx.lineTo(x, ELEVATOR.y + ELEVATOR.h);
        ctx.stroke();
    }

    // Elevator Interior Floor & Ceiling Panels
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(ELEVATOR.x, ELEVATOR.y, ELEVATOR.w, 18); // ceiling
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(ELEVATOR.x, ELEVATOR.floorY, ELEVATOR.w, 30); // floor foundation

    // Floor Tiles
    floorTiles.forEach(tile => {
        if (tile.active) {
            ctx.fillStyle = '#334155';
            ctx.fillRect(tile.x + 2, ELEVATOR.floorY, tile.w - 4, 12);
            ctx.fillStyle = '#475569';
            ctx.fillRect(tile.x + 4, ELEVATOR.floorY + 2, tile.w - 8, 3);
        }
    });

    // Flickering Doom Lights (25%+ Doom)
    if (doomLevel >= 25 && Math.random() < 0.08) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(ELEVATOR.x, ELEVATOR.y, ELEVATOR.w, ELEVATOR.h);
    }

    // Red Alarm Fog (90%+ Doom)
    if (doomLevel >= 90) {
        ctx.fillStyle = `rgba(239, 68, 68, ${0.12 + Math.sin(Date.now() * 0.008) * 0.06})`;
        ctx.fillRect(ELEVATOR.x, ELEVATOR.y, ELEVATOR.w, ELEVATOR.h);
    }

    // Draw Slashes
    slashes.forEach(s => {
        ctx.fillStyle = s.color;
        ctx.fillRect(s.x, s.y, s.w, s.h);
    });

    // Draw Projectiles
    projectiles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Draw Loot Drops
    lootDrops.forEach(loot => {
        ctx.font = '16px Outfit, sans-serif';
        if (loot.type === 'COIN') ctx.fillText('🪙', loot.x, loot.y);
        else if (loot.type === 'HEAL') ctx.fillText('🩹', loot.x, loot.y);
        else if (loot.type === 'WEAPON_CHEST') ctx.fillText('🎁', loot.x, loot.y);
    });

    // Draw Enemies & Boss
    enemies.forEach(e => e.draw(ctx));
    if (activeBoss) activeBoss.draw(ctx);

    // Draw Player
    player.draw(ctx);

    // Draw Particles
    particles.forEach(p => {
        if (p.isGhost) {
            ctx.fillStyle = `rgba(56, 189, 248, ${p.life / p.maxLife * 0.4})`;
            ctx.fillRect(p.x, p.y, p.w, p.h);
        } else if (p.isLightning) {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(p.x1, p.y1);
            ctx.lineTo(p.x2, p.y2);
            ctx.stroke();
        } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 3, 3);
        }
    });

    // Draw Damage Numbers
    damageNumbers.forEach(dn => {
        ctx.font = `bold ${dn.fontSize}px Outfit, sans-serif`;
        ctx.fillStyle = dn.color;
        ctx.fillText(dn.text, dn.x, dn.y);
    });

    ctx.restore();
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Event Listeners & Controls
window.addEventListener('keydown', e => {
    keysDown[e.code] = true;

    if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === STATE.COMBAT) {
            player.triggerAttack();
        } else if (gameState === STATE.GAMEOVER || gameState === STATE.VICTORY) {
            startNewRun();
        }
    }

    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyQ' || e.code === 'KeyE') {
        if (gameState === STATE.COMBAT) {
            player.triggerAbility();
        }
    }

    if (e.code === 'Escape') {
        pauseElevatorGame();
    }
});

window.addEventListener('keyup', e => {
    keysDown[e.code] = false;
});

canvas.addEventListener('mousedown', e => {
    if (gameState === STATE.COMBAT) {
        player.triggerAttack();
    }
});

// Button Bindings
document.getElementById('btn-start-game').onclick = startNewRun;
document.getElementById('btn-restart').onclick = startNewRun;
document.getElementById('btn-cash-out').onclick = cashOutAndEscape;
document.getElementById('btn-go-higher').onclick = advanceToNextFloor;

document.getElementById('btn-sound-toggle').onclick = () => {
    if (window.doomAudio) {
        window.doomAudio.muted = !window.doomAudio.muted;
        document.getElementById('btn-sound-toggle').textContent = window.doomAudio.muted ? '🔇' : '🔊';
    }
};

// Pause Game Controls
function pauseElevatorGame() {
    document.body.classList.add('portal-paused');
}

function resumeElevatorGame() {
    document.body.classList.remove('portal-paused');
}

window.pauseElevatorGame = pauseElevatorGame;
window.resumeElevatorGame = resumeElevatorGame;

// Start Loop
requestAnimationFrame(gameLoop);

    if (victory) {
        badge.textContent = '🏆 DOOM SURVIVOR';
        badge.style.borderColor = '#10b981';
        badge.style.color = '#10b981';
        title.textContent = 'YOU CONQUERED FLOOR 99!';
        sub.textContent = 'You escaped the Elevator of Doom alive!';
        window.doomAudio.playVictory();
    } else {
        badge.textContent = '💀 ELIMINATED';
        badge.style.borderColor = '#ef4444';
        badge.style.color = '#ef4444';
        title.textContent = 'You Were Eliminated!';
        sub.textContent = `Floor ${currentFloor}: ${reason || 'Crushed by the elevator doom.'}`;
    }

    document.getElementById('res-floor').textContent = 'Floor ' + currentFloor;
    document.getElementById('res-dooms').textContent = survivalRounds;
    document.getElementById('res-sabotages').textContent = sabotagesCount;
    document.getElementById('res-rank').textContent = victory ? '🥇 Elevator Legend' : (currentFloor > 60 ? '🥈 Chaos Veteran' : '💀 Certified Splat');
}

// Input Handling
const keys = {};
let isElevatorPaused = false;
let __countdownTimerElevator = null;

function playCountdownAudioElevator(freq = 440, type = 'sine', duration = 0.15) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!window.__cdCtxElevator) window.__cdCtxElevator = new AudioCtx();
        const ctx = window.__cdCtxElevator;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

function runResumeCountdownElevator(onComplete) {
    if (__countdownTimerElevator) {
        clearInterval(__countdownTimerElevator);
        __countdownTimerElevator = null;
    }
    let overlay = document.getElementById('resumeCountdownOverlayElevator');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'resumeCountdownOverlayElevator';
        overlay.className = 'resume-countdown-overlay';
        document.body.appendChild(overlay);
    }
    overlay.classList.add('active');

    let count = 3;
    const updateDisplay = () => {
        if (count > 0) {
            overlay.innerHTML = `
                <div class="resume-countdown-number" key="${count}">${count}</div>
                <div class="resume-countdown-sub">⚡ GET READY • RESUMING</div>
            `;
            playCountdownAudioElevator(count === 3 ? 440 : count === 2 ? 554 : 659, 'sine', 0.18);
            count--;
        } else if (count === 0) {
            overlay.innerHTML = `
                <div class="resume-countdown-number" style="color: #4ade80; text-shadow: 0 0 45px rgba(74, 222, 128, 0.9);">SURVIVE!</div>
                <div class="resume-countdown-sub" style="color: #4ade80;">🛗 ELEVATOR RUNNING!</div>
            `;
            playCountdownAudioElevator(880, 'triangle', 0.3);
            count--;
        } else {
            if (__countdownTimerElevator) {
                clearInterval(__countdownTimerElevator);
                __countdownTimerElevator = null;
            }
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 200);
            if (typeof onComplete === 'function') onComplete();
        }
    };

    updateDisplay();
    __countdownTimerElevator = setInterval(updateDisplay, 1000);
}

window.pauseElevatorGame = function() {
    if (gameState === STATE.LOBBY || gameState === STATE.GAMEOVER || gameState === STATE.VICTORY) return;
    if (__countdownTimerElevator) {
        clearInterval(__countdownTimerElevator);
        __countdownTimerElevator = null;
        const overlay = document.getElementById('resumeCountdownOverlayElevator');
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    isElevatorPaused = true;
    document.body.classList.add('portal-paused');
    const bankBadge = document.getElementById('portal-top-bank');
    if (bankBadge) {
        const pts = localStorage.getItem('krazio_user_points') || localStorage.getItem('coins') || localStorage.getItem('office_escape_coins') || '76';
        bankBadge.textContent = `🪙 ${pts} P`;
    }
};

window.resumeElevatorGame = function(requestFullscreen = true) {
    // 1. Immediately expand back to fullscreen and dismiss paused portal UI
    document.body.classList.remove('portal-paused');
    if (requestFullscreen && !document.fullscreenElement && !document.webkitFullscreenElement) {
        const docEl = document.documentElement;
        const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
        if (req) req.call(docEl).catch(() => {});
    }

    // 2. Start 3-second countdown before unfreezing physics
    runResumeCountdownElevator(() => {
        isElevatorPaused = false;
    });
};

window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' || e.code === 'KeyP') {
        if (gameState !== STATE.LOBBY && gameState !== STATE.GAMEOVER && gameState !== STATE.VICTORY) {
            e.preventDefault();
            if (isElevatorPaused || document.body.classList.contains('portal-paused')) {
                window.resumeElevatorGame();
            } else {
                window.pauseElevatorGame();
            }
            return;
        }
    }

    keys[e.code] = true;

    if (e.code === 'KeyE' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        const player = players.find(p => p.isPlayer);
        if (player && !isElevatorPaused) player.useAbility();
    }

    if (e.code === 'Space' && (gameState === STATE.GAMEOVER || gameState === STATE.VICTORY)) {
        initMatch();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Instant trigger on first Escape when exiting native browser fullscreen
const handleFullscreenExitElevator = () => {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    if (!isFs && gameState !== STATE.LOBBY && gameState !== STATE.GAMEOVER && gameState !== STATE.VICTORY && !isElevatorPaused) {
        window.pauseElevatorGame();
    }
};
document.addEventListener('fullscreenchange', handleFullscreenExitElevator);
document.addEventListener('webkitfullscreenchange', handleFullscreenExitElevator);
document.addEventListener('mozfullscreenchange', handleFullscreenExitElevator);
document.addEventListener('MSFullscreenChange', handleFullscreenExitElevator);

// Update & Render Loop
function update() {
    if (isElevatorPaused || document.body.classList.contains('portal-paused')) return;

    if (shakeTime > 0) shakeTime--;

    const player = players.find(p => p.isPlayer);
    if (player && player.isAlive) {
        if (keys['KeyA'] || keys['ArrowLeft']) player.vx -= 0.65;
        if (keys['KeyD'] || keys['ArrowRight']) player.vx += 0.65;
        if (keys['KeyW'] || keys['Space'] || keys['ArrowUp']) player.jump();
        player.isCrouching = !!(keys['KeyS'] || keys['ArrowDown']);
    }

    // Update all passengers
    players.forEach(p => p.update());

    // Update Doom Events
    if (gameState === STATE.DOOM_EVENT && currentEvent) {
        currentEvent.duration--;

        // Bomb collision transfer
        if (currentEvent.type === 'BOMB') {
            players.forEach(p1 => {
                if (p1.hasBomb && p1.isAlive) {
                    players.forEach(p2 => {
                        if (p2 !== p1 && p2.isAlive) {
                            if (Math.abs(p1.x - p2.x) < 28 && Math.abs(p1.y - p2.y) < 32) {
                                p1.hasBomb = false;
                                p2.hasBomb = true;
                                p2.bark('TAG! YOU HAVE THE BOMB!');
                                window.doomAudio.playPunch();
                            }
                        }
                    });
                }
            });

            // Bomb explosion at 0
            if (currentEvent.duration <= 0) {
                const bombGuy = players.find(p => p.hasBomb && p.isAlive);
                if (bombGuy) bombGuy.eliminate('Blown to pieces by the ticking bomb!');
                nextFloorTransition();
            }
        }

        // Laser collision (Smooth, readable sweep speed)
        if (currentEvent.type === 'LASER') {
            currentEvent.laserX += 2.1;
            players.forEach(p => {
                if (p.isAlive && Math.abs(p.x + p.w/2 - currentEvent.laserX) < 14) {
                    if (currentEvent.laserY > 450 && p.isGrounded && !p.isCrouching) {
                        p.eliminate('Vaporized by the laser beam!');
                    } else if (currentEvent.laserY <= 450 && !p.isCrouching) {
                        p.eliminate('Decapitated by the high laser beam!');
                    }
                }
            });

            if (currentEvent.duration <= 0) nextFloorTransition();
        }

        // Floor 99 Escape Hatch
        if (currentEvent.type === 'ESCAPE_HATCH') {
            players.forEach(p => {
                if (p.isAlive && Math.abs(p.x - currentEvent.hatchX) < 40 && Math.abs(p.y - currentEvent.hatchY) < 40) {
                    if (p.isPlayer) endGame(true);
                    else p.eliminate('Left behind in the abyss!');
                }
            });
        }

        if (currentEvent.type !== 'BOMB' && currentEvent.type !== 'LASER' && currentEvent.duration <= 0) {
            nextFloorTransition();
        }
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) particles.splice(i, 1);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (shakeTime > 0) {
        ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    }

    // Background Shaft
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Elevator Cabin Shell
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.fillRect(ELEVATOR.x, ELEVATOR.y, ELEVATOR.w, ELEVATOR.h);
    ctx.strokeRect(ELEVATOR.x, ELEVATOR.y, ELEVATOR.w, ELEVATOR.h);

    // Overhead Light Cones
    const grad = ctx.createLinearGradient(0, ELEVATOR.y, 0, ELEVATOR.floorY);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(ELEVATOR.x + 20, ELEVATOR.y, ELEVATOR.w - 40, ELEVATOR.h);

    // Floor Tiles
    floorTiles.forEach(tile => {
        if (tile.active) {
            ctx.fillStyle = tile.blinking && Math.floor(Date.now() / 150) % 2 === 0 ? '#ef4444' : '#1e293b';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.fillRect(tile.x + 2, ELEVATOR.floorY, tile.w - 4, 30);
            ctx.strokeRect(tile.x + 2, ELEVATOR.floorY, tile.w - 4, 30);
        }
    });

    // Draw Laser if active
    if (currentEvent && currentEvent.type === 'LASER') {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(currentEvent.laserX, ELEVATOR.y);
        ctx.lineTo(currentEvent.laserX, ELEVATOR.floorY + 20);
        ctx.stroke();
    }

    // Draw Floor 99 Golden Escape Hatch
    if (currentEvent && currentEvent.type === 'ESCAPE_HATCH') {
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(currentEvent.hatchX + 30, currentEvent.hatchY + 20, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('ESCAPE!', currentEvent.hatchX + 30, currentEvent.hatchY + 24);
    }

    // Draw Passengers
    players.forEach(p => p.draw());

    // Draw Particles
    particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 4, 4);
    });

    ctx.restore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Render Lobby Roster
function renderLobbyRoster() {
    const grid = document.getElementById('passenger-grid');
    if (!grid) return;
    grid.innerHTML = '';
    ROSTER.forEach(r => {
        const slot = document.createElement('div');
        slot.className = `p-slot ${r.isPlayer ? 'is-you' : ''}`;
        slot.innerHTML = `
            <span class="p-emoji">${r.emoji}</span>
            <span class="p-name">${r.name}</span>
        `;
        grid.appendChild(slot);
    });
}

// Wire Up Buttons
document.getElementById('btn-start-game').addEventListener('click', initMatch);
document.getElementById('btn-restart').addEventListener('click', initMatch);
document.getElementById('btn-sound-toggle').addEventListener('click', () => {
    window.doomAudio.muted = !window.doomAudio.muted;
    document.getElementById('btn-sound-toggle').textContent = window.doomAudio.muted ? '🔇' : '🔊';
});

renderLobbyRoster();
gameLoop();
