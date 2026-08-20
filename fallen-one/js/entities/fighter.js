// js/entities/fighter.js - Core Fighter Base Class & Combat State Engine

import { 
    ARENA_BOUNDS, FIGHTER_STATES, ATTACK_TYPES, 
    MAX_SUPER_METER, MAX_SPECIAL_ENERGY, PERFECT_BLOCK_WINDOW 
} from '../core/constants.js';
import { soundEngine } from '../audio/soundEngine.js';
import { particleSystem } from '../graphics/particleSystem.js';
import { camera } from '../core/camera.js';
import { Projectile } from './projectile.js';

export class Fighter {
    constructor(config, playerKey = 'P1', isAI = false) {
        this.config = config;
        this.charId = config.id;
        this.name = config.name;
        this.playerKey = playerKey;
        this.isAI = isAI;
        this.themeColor = config.themeColor;
        this.portrait = config.portrait;

        // Position & Physics
        this.x = playerKey === 'P1' ? 700 : 1300;
        this.y = ARENA_BOUNDS.groundY;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = true;
        this.facingRight = playerKey === 'P1';

        // Stats
        this.maxHealth = config.stats.health;
        this.health = this.maxHealth;
        this.displayHealth = this.maxHealth; // Delayed chip damage bar
        this.superMeter = 0;
        this.specialEnergy = MAX_SPECIAL_ENERGY;
        this.roundsWon = 0;

        // Combat States
        this.state = FIGHTER_STATES.IDLE;
        this.stateTimer = 0;
        this.animFrame = 0;

        // Attack & Frame Data
        this.currentAttackData = null;
        this.attackPhase = null; // 'STARTUP', 'ACTIVE', 'RECOVERY'
        this.attackFrame = 0;
        this.canCancel = false;
        this.armorHitsRemaining = 0;
        this.isInvincible = false;
        this.hasMotionTrail = false;
        this.isSuperMode = false;

        // Defense
        this.isBlocking = false;
        this.isCrouchBlocking = false;
        this.blockHeldFrames = 0;

        // Projectiles
        this.projectiles = [];

        // Hitstun & Combo tracking
        this.hitstunFrames = 0;
        this.blockstunFrames = 0;

        // Training stats
        this.frameAdvantage = 0;
    }

    resetForRound(p1X = 700, p2X = 1300) {
        this.x = this.playerKey === 'P1' ? p1X : p2X;
        this.y = ARENA_BOUNDS.groundY;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = true;
        this.facingRight = this.playerKey === 'P1';
        this.health = this.maxHealth;
        this.displayHealth = this.maxHealth;
        this.state = FIGHTER_STATES.IDLE;
        this.stateTimer = 0;
        this.currentAttackData = null;
        this.attackPhase = null;
        this.attackFrame = 0;
        this.hitstunFrames = 0;
        this.blockstunFrames = 0;
        this.projectiles = [];
        this.isInvincible = false;
        this.hasMotionTrail = false;
    }

    getPushbox() {
        return {
            x: this.x - 22,
            y: this.y - 120,
            w: 44,
            h: 120
        };
    }

    getHurtboxes() {
        if (this.isInvincible) return [];
        const isCrouching = this.state === FIGHTER_STATES.CROUCH;
        if (isCrouching) {
            return [
                { x: this.x - 20, y: this.y - 80, w: 40, h: 40, type: 'HEAD_TORSO' },
                { x: this.x - 24, y: this.y - 40, w: 48, h: 40, type: 'LEGS' }
            ];
        }
        return [
            { x: this.x - 16, y: this.y - 130, w: 32, h: 32, type: 'HEAD' },
            { x: this.x - 22, y: this.y - 98, w: 44, h: 50, type: 'TORSO' },
            { x: this.x - 20, y: this.y - 48, w: 40, h: 48, type: 'LEGS' }
        ];
    }

    getActiveHitbox() {
        if (this.state !== FIGHTER_STATES.ATTACK || this.attackPhase !== 'ACTIVE' || !this.currentAttackData) {
            return null;
        }
        const box = this.currentAttackData.hitbox;
        if (!box) return null;
        const dir = this.facingRight ? 1 : -1;
        return {
            x: this.facingRight ? this.x + box.offsetX : this.x - box.offsetX - box.width,
            y: this.y + box.offsetY,
            w: box.width,
            h: box.height,
            hasHit: this.currentAttackData.hasHit || false
        };
    }

    update(opponent, input) {
        // Regenerate special energy over time
        if (this.specialEnergy < MAX_SPECIAL_ENERGY) {
            this.specialEnergy = Math.min(MAX_SPECIAL_ENERGY, this.specialEnergy + 0.15);
        }

        // Smooth delayed health bar chip display
        if (this.displayHealth > this.health) {
            this.displayHealth -= (this.displayHealth - this.health) * 0.08;
        }

        // Face opponent when grounded and not attacking/stunned
        if (this.isGrounded && ![FIGHTER_STATES.ATTACK, FIGHTER_STATES.HURT, FIGHTER_STATES.KNOCKDOWN, FIGHTER_STATES.DASH_FWD, FIGHTER_STATES.DASH_BWD].includes(this.state)) {
            this.facingRight = this.x < opponent.x;
        }

        // 1. Process State Machine
        this.processState(opponent, input);

        // 2. Physics & Movement Integration
        this.applyPhysics();

        // 3. Update active projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update();
            if (!p.isAlive) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    processState(opponent, input) {
        this.stateTimer++;

        switch (this.state) {
            case FIGHTER_STATES.IDLE:
            case FIGHTER_STATES.WALK_FWD:
            case FIGHTER_STATES.WALK_BWD:
            case FIGHTER_STATES.CROUCH:
                this.handleNeutralState(opponent, input);
                break;

            case FIGHTER_STATES.JUMP:
            case FIGHTER_STATES.FALL:
                this.handleAirborneState(opponent, input);
                break;

            case FIGHTER_STATES.DASH_FWD:
            case FIGHTER_STATES.DASH_BWD:
                this.handleDashState();
                break;

            case FIGHTER_STATES.ATTACK:
                this.handleAttackLifecycle(opponent, input);
                break;

            case FIGHTER_STATES.SUPER_STARTUP:
                if (this.stateTimer >= 22) {
                    this.state = FIGHTER_STATES.ATTACK;
                    this.attackPhase = 'ACTIVE';
                    this.attackFrame = 0;
                }
                break;

            case FIGHTER_STATES.BLOCK:
            case FIGHTER_STATES.PERFECT_BLOCK:
                this.handleBlockState(input);
                break;

            case FIGHTER_STATES.HURT:
                if (this.hitstunFrames > 0) {
                    this.hitstunFrames--;
                } else {
                    this.state = FIGHTER_STATES.IDLE;
                }
                break;

            case FIGHTER_STATES.KNOCKDOWN:
                if (this.stateTimer >= 35) {
                    this.state = FIGHTER_STATES.GETUP;
                    this.stateTimer = 0;
                    this.isInvincible = true;
                }
                break;

            case FIGHTER_STATES.GETUP:
                if (this.stateTimer >= 18) {
                    this.state = FIGHTER_STATES.IDLE;
                    this.isInvincible = false;
                }
                break;
        }
    }

    handleNeutralState(opponent, input) {
        if (!input) return;

        // Check Super / Ultimate input
        if (input.justPressed.ultimate && this.superMeter >= MAX_SUPER_METER) {
            this.executeAttack(ATTACK_TYPES.ULTIMATE);
            return;
        }

        // Check Specials
        if (input.justPressed.special) {
            if (input.down && this.config.attacks[ATTACK_TYPES.SPECIAL_3] && this.specialEnergy >= (this.config.attacks[ATTACK_TYPES.SPECIAL_3]?.energyCost || 25)) {
                this.executeAttack(ATTACK_TYPES.SPECIAL_3); // Ground Burst
                return;
            } else if (this.config.attacks[ATTACK_TYPES.SPECIAL_1] && this.specialEnergy >= (this.config.attacks[ATTACK_TYPES.SPECIAL_1]?.energyCost || 25)) {
                this.executeAttack(ATTACK_TYPES.SPECIAL_1); // Focus Strike
                return;
            }
        }

        // Check Rising Kick on Down + Heavy Kick or anti-air
        if (input.down && input.justPressed.heavyKick && this.config.attacks[ATTACK_TYPES.RISING_KICK]) {
            this.executeAttack(ATTACK_TYPES.RISING_KICK);
            return;
        }

        // Check Energy Wave on Down-Forward or Down + Light Kick
        if (input.down && input.justPressed.lightKick && this.config.attacks[ATTACK_TYPES.SPECIAL_2] && this.specialEnergy >= (this.config.attacks[ATTACK_TYPES.SPECIAL_2]?.energyCost || 25)) {
            this.executeAttack(ATTACK_TYPES.SPECIAL_2);
            return;
        }

        // Check Attacks
        if (input.justPressed.lightPunch) {
            this.executeAttack(ATTACK_TYPES.LIGHT_PUNCH);
            return;
        }
        if (input.justPressed.heavyPunch) {
            this.executeAttack(ATTACK_TYPES.HEAVY_PUNCH);
            return;
        }
        if (input.justPressed.lightKick) {
            this.executeAttack(ATTACK_TYPES.LIGHT_KICK);
            return;
        }
        if (input.justPressed.heavyKick) {
            this.executeAttack(ATTACK_TYPES.HEAVY_KICK);
            return;
        }

        // Check Dash
        if (input.justPressed.dash) {
            this.startDash(this.facingRight ? 1 : -1);
            return;
        }

        // Check Jump
        if (input.up && this.isGrounded) {
            this.vy = -this.config.jumpForce;
            this.isGrounded = false;
            this.state = FIGHTER_STATES.JUMP;
            this.stateTimer = 0;
            soundEngine.playWhoosh(1.2);
            return;
        }

        // Check Block
        if (input.block) {
            this.blockHeldFrames++;
            const targetState = this.blockHeldFrames <= PERFECT_BLOCK_WINDOW ? FIGHTER_STATES.PERFECT_BLOCK : FIGHTER_STATES.BLOCK;
            if (this.state !== targetState) {
                this.state = targetState;
                this.stateTimer = 0;
            }
            this.vx = 0;
            return;
        } else {
            this.blockHeldFrames = 0;
        }

        // Check Crouch
        if (input.down) {
            if (this.state !== FIGHTER_STATES.CROUCH) {
                this.state = FIGHTER_STATES.CROUCH;
                this.stateTimer = 0;
            }
            this.vx = 0;
            return;
        }

        // Walking Movement
        if (input.left) {
            const isFwd = !this.facingRight;
            const targetWalk = isFwd ? FIGHTER_STATES.WALK_FWD : FIGHTER_STATES.WALK_BWD;
            if (this.state !== targetWalk) {
                this.state = targetWalk;
                this.stateTimer = 0;
            }
            this.vx = isFwd ? this.config.walkSpeedFwd : -this.config.walkSpeedBwd;
        } else if (input.right) {
            const isFwd = this.facingRight;
            const targetWalk = isFwd ? FIGHTER_STATES.WALK_FWD : FIGHTER_STATES.WALK_BWD;
            if (this.state !== targetWalk) {
                this.state = targetWalk;
                this.stateTimer = 0;
            }
            this.vx = isFwd ? this.config.walkSpeedFwd : -this.config.walkSpeedBwd;
        } else {
            this.vx = 0;
            if (this.state !== FIGHTER_STATES.IDLE) {
                this.state = FIGHTER_STATES.IDLE;
                this.stateTimer = 0;
            }
        }
    }

    handleAirborneState(opponent, input) {
        if (!input) return;

        // Air Attacks
        if (input.justPressed.lightPunch) {
            this.executeAttack(ATTACK_TYPES.LIGHT_PUNCH);
        } else if (input.justPressed.heavyKick) {
            this.executeAttack(ATTACK_TYPES.HEAVY_KICK);
        }

        // Aerial drift
        if (input.left) this.vx = -this.config.walkSpeedFwd * 0.8;
        else if (input.right) this.vx = this.config.walkSpeedFwd * 0.8;
    }

    startDash(direction) {
        this.state = direction > 0 === this.facingRight ? FIGHTER_STATES.DASH_FWD : FIGHTER_STATES.DASH_BWD;
        this.stateTimer = 0;
        this.vx = direction * this.config.dashSpeed;
        this.hasMotionTrail = true;
        this.isInvincible = true; // First 6 frames of dodge are invincible
        soundEngine.playDash();
        particleSystem.spawnDashDust(this.x, this.y, direction > 0);
    }

    handleDashState() {
        if (this.stateTimer >= 6) {
            this.isInvincible = false;
        }
        if (this.stateTimer >= this.config.dashDuration) {
            this.state = FIGHTER_STATES.IDLE;
            this.hasMotionTrail = false;
            this.vx = 0;
        }
    }

    executeAttack(attackType) {
        const atk = this.config.attacks[attackType];
        if (!atk) return;

        // Deduct Super / Special Meter
        if (atk.superCost) {
            this.superMeter = Math.max(0, this.superMeter - atk.superCost);
        }
        if (atk.energyCost) {
            this.specialEnergy = Math.max(0, this.specialEnergy - atk.energyCost);
        }

        this.currentAttackData = { ...atk, hasHit: false };
        this.state = FIGHTER_STATES.ATTACK;
        this.stateTimer = 0;
        this.attackFrame = 0;
        this.attackPhase = 'STARTUP';
        this.canCancel = false;
        this.armorHitsRemaining = atk.armor || 0;

        if (atk.invincibleStartup) {
            this.isInvincible = true;
        }

        if (atk.isCinematicSuper) {
            this.state = FIGHTER_STATES.SUPER_STARTUP;
            soundEngine.playSuperActivation();
            camera.startSuperCinematic(this, 30);
            return;
        }

        // Play swing whoosh sound
        soundEngine.playWhoosh(attackType.includes('HEAVY') ? 0.85 : 1.1);

        if (atk.forwardImpulse) {
            this.vx = (this.facingRight ? 1 : -1) * atk.forwardImpulse;
        }
    }

    handleAttackLifecycle(opponent, input) {
        const atk = this.currentAttackData;
        if (!atk) {
            this.state = FIGHTER_STATES.IDLE;
            return;
        }

        this.attackFrame++;

        // 1. Startup phase
        if (this.attackPhase === 'STARTUP') {
            if (this.attackFrame >= atk.startup) {
                this.attackPhase = 'ACTIVE';
                this.attackFrame = 0;

                // Handle projectile spawn
                if (atk.isProjectile) {
                    const spawnX = this.x + (this.facingRight ? 45 : -45);
                    const spawnY = this.y - 85;
                    this.projectiles.push(new Projectile(this, atk.projType, spawnX, spawnY, this.facingRight, atk));
                    soundEngine.playEnergyProjectile(this.charId);
                } else if ([ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.SPECIAL_3, ATTACK_TYPES.RISING_KICK].includes(atk.type)) {
                    // Propagate Arena Elemental Wave across the floor toward the opponent
                    const fissType = this.charId === 'SOLAR' ? 'MAGMA' :
                                     this.charId === 'FROST' ? 'FROST' :
                                     this.charId === 'TERRA' ? 'TERRA' :
                                     this.charId === 'VOLT' ? 'VOLT' :
                                     this.charId === 'SHADOW' ? 'SHADOW' : 'ASTRAL';
                    const targetX = opponent ? opponent.x : (this.facingRight ? this.x + 350 : this.x - 350);
                    particleSystem.spawnGroundFissure(this.x, targetX, this.y, fissType, this.themeColor);
                } else if (atk.type === ATTACK_TYPES.ULTIMATE) {
                    const fissType = this.charId === 'SOLAR' ? 'MAGMA' : 'ASTRAL';
                    particleSystem.spawnGroundFissure(this.x, opponent ? opponent.x : this.x + 400, this.y, fissType, this.themeColor);
                } else {
                    // Spawn dynamic melee slash arc extending toward the opponent
                    const isHeavy = atk.type.includes('HEAVY') || atk.type === ATTACK_TYPES.RISING_KICK;
                    const slashX = this.x + (this.facingRight ? 45 : -45);
                    particleSystem.spawnMeleeSlashArc(slashX, this.y - 80, this.facingRight, this.themeColor, isHeavy);
                }
            }
        }
        // 2. Active hit frames
        else if (this.attackPhase === 'ACTIVE') {
            if (this.attackFrame >= atk.active) {
                this.attackPhase = 'RECOVERY';
                this.attackFrame = 0;
                this.isInvincible = false;
            }
        }
        // 3. Recovery frames
        else if (this.attackPhase === 'RECOVERY') {
            // Cancel window into next chain if hit registered
            if (this.canCancel && input && atk.cancelsTo) {
                for (const nextType of atk.cancelsTo) {
                    if (nextType === ATTACK_TYPES.ULTIMATE && input.justPressed.ultimate && this.superMeter >= MAX_SUPER_METER) {
                        this.executeAttack(nextType);
                        return;
                    }
                    if (nextType === ATTACK_TYPES.SPECIAL_1 && input.justPressed.special) {
                        this.executeAttack(nextType);
                        return;
                    }
                    if (nextType === ATTACK_TYPES.HEAVY_PUNCH && input.justPressed.heavyPunch) {
                        this.executeAttack(nextType);
                        return;
                    }
                    if (nextType === ATTACK_TYPES.HEAVY_KICK && input.justPressed.heavyKick) {
                        this.executeAttack(nextType);
                        return;
                    }
                }
            }

            if (this.attackFrame >= atk.recovery) {
                this.state = this.isGrounded ? FIGHTER_STATES.IDLE : FIGHTER_STATES.FALL;
                this.currentAttackData = null;
                this.attackPhase = null;
            }
        }
    }

    handleBlockState(input) {
        if (!input || !input.block) {
            this.state = FIGHTER_STATES.IDLE;
            return;
        }
        if (this.stateTimer > PERFECT_BLOCK_WINDOW && this.state === FIGHTER_STATES.PERFECT_BLOCK) {
            this.state = FIGHTER_STATES.BLOCK;
        }
    }

    takeHit(hitResult, attacker) {
        // Check for Armor absorption
        if (this.armorHitsRemaining > 0) {
            this.armorHitsRemaining--;
            soundEngine.playBlock();
            particleSystem.spawnHitSpark(hitResult.hitPoint.x, hitResult.hitPoint.y, '#f59e0b', 8);
            return { blocked: false, armored: true };
        }

        const atk = hitResult.attack;
        const isPerfectBlock = this.state === FIGHTER_STATES.PERFECT_BLOCK;
        const isStandardBlock = this.state === FIGHTER_STATES.BLOCK;

        // --- PERFECT BLOCK / PARRY ---
        if (isPerfectBlock) {
            soundEngine.playPerfectBlock();
            particleSystem.spawnPerfectBlockSpark(hitResult.hitPoint.x, hitResult.hitPoint.y);
            camera.addHitstop(8);
            camera.addTrauma(0.2);

            // Push attacker back forcefully and give defender frame advantage
            attacker.vx = (this.x < attacker.x ? 1 : -1) * 12;
            attacker.hitstunFrames = 18;
            attacker.state = FIGHTER_STATES.HURT;

            // Build massive super meter on perfect parry
            this.superMeter = Math.min(MAX_SUPER_METER, this.superMeter + 20);
            return { blocked: true, perfect: true };
        }

        // --- REGULAR BLOCK ---
        if (isStandardBlock) {
            soundEngine.playBlock();
            particleSystem.spawnHitSpark(hitResult.hitPoint.x, hitResult.hitPoint.y, '#38bdf8', 6);
            const chipDamage = Math.floor(atk.damage * 0.12);
            this.health = Math.max(0, this.health - chipDamage);
            this.blockstunFrames = atk.blockstun;
            this.state = FIGHTER_STATES.BLOCK;
            this.vx = (this.x < attacker.x ? -1 : 1) * (atk.pushback * 0.6);
            this.superMeter = Math.min(MAX_SUPER_METER, this.superMeter + 4);
            return { blocked: true, perfect: false };
        }

        // --- DIRECT HIT ---
        const finalDamage = atk.damage * (hitResult.isCounter ? 1.25 : 1.0);
        this.health = Math.max(0, this.health - finalDamage);
        this.hitstunFrames = atk.hitstun;
        this.state = FIGHTER_STATES.HURT;

        // Camera Shake & Hitstop
        const isHeavy = atk.damage >= 80 || atk.isCinematicSuper;
        camera.addTrauma(isHeavy ? 0.35 : 0.15);
        camera.addHitstop(isHeavy ? 10 : 5);

        // Sound & Particles
        if (atk.isCinematicSuper) {
            soundEngine.playSuperImpact();
            particleSystem.spawnSuperImpactExplosion(hitResult.hitPoint.x, hitResult.hitPoint.y, attacker.themeColor);
        } else if (isHeavy) {
            soundEngine.playHeavyHit();
            particleSystem.spawnHitSpark(hitResult.hitPoint.x, hitResult.hitPoint.y, attacker.themeColor, 22, true);
        } else {
            soundEngine.playLightHit();
            particleSystem.spawnHitSpark(hitResult.hitPoint.x, hitResult.hitPoint.y, attacker.themeColor, 12, false);
        }

        // Launch & Knockdown Physics
        if (atk.launchY) {
            this.vy = atk.launchY;
            this.vx = (this.x < attacker.x ? -1 : 1) * (atk.launchX || 6);
            this.isGrounded = false;
            this.state = FIGHTER_STATES.FALL;
        } else {
            this.vx = (this.x < attacker.x ? -1 : 1) * (atk.pushback || 5);
        }

        // Build meter for both players
        attacker.superMeter = Math.min(MAX_SUPER_METER, attacker.superMeter + (atk.superGain || 8));
        this.superMeter = Math.min(MAX_SUPER_METER, this.superMeter + 6);

        // Allow attacker to cancel into combos
        attacker.canCancel = true;

        return { blocked: false, damage: finalDamage };
    }

    applyPhysics() {
        // Apply Gravity
        if (!this.isGrounded) {
            this.vy += this.config.gravity;
            this.y += this.vy;

            // Landing on ground
            if (this.y >= ARENA_BOUNDS.groundY) {
                this.y = ARENA_BOUNDS.groundY;
                this.vy = 0;
                this.isGrounded = true;

                if (this.state === FIGHTER_STATES.FALL || this.state === FIGHTER_STATES.HURT) {
                    this.state = FIGHTER_STATES.KNOCKDOWN;
                    this.stateTimer = 0;
                    camera.addTrauma(0.15);
                } else if (this.state === FIGHTER_STATES.JUMP) {
                    this.state = FIGHTER_STATES.IDLE;
                    this.stateTimer = 0;
                }
            }
        }

        // Apply Horizontal Velocity & Friction
        this.x += this.vx;
        if (this.isGrounded) {
            this.vx *= 0.82;
        } else {
            this.vx *= 0.94;
        }
        if (Math.abs(this.vx) < 0.05) this.vx = 0;

        // Clamp to Arena Bounds & Wall Bounce
        if (this.x < ARENA_BOUNDS.minX) {
            this.x = ARENA_BOUNDS.minX;
            if (this.vx < -6 && !this.isGrounded) {
                this.vx = 5; // Wall bounce
                camera.addTrauma(0.1);
            }
        } else if (this.x > ARENA_BOUNDS.maxX) {
            this.x = ARENA_BOUNDS.maxX;
            if (this.vx > 6 && !this.isGrounded) {
                this.vx = -5; // Wall bounce
                camera.addTrauma(0.1);
            }
        }
    }
}
