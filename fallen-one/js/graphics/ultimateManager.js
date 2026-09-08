// js/graphics/ultimateManager.js - Full-Screen Cinematic Ultimate Attack System

import { CANVAS_WIDTH, CANVAS_HEIGHT, FIGHTER_STATES, ATTACK_TYPES } from '../core/constants.js';
import { soundEngine } from '../audio/soundEngine.js';
import { particleSystem } from './particleSystem.js';
import { camera } from '../core/camera.js';
import { comboTracker } from '../systems/comboSystem.js';

export class UltimateManager {
    constructor() {
        this.video = document.createElement('video');
        this.video.src = 'assets/characters/ezgif-8238dd93df229f75.webm';
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.preload = 'auto';
        this.video.loop = false;
        this.videoLoaded = false;
        
        this.video.addEventListener('canplaythrough', () => {
            this.videoLoaded = true;
        });
        this.video.addEventListener('error', (e) => {
            console.warn('Ultimate video error:', e);
        });

        this.isActive = false;
        this.attacker = null;
        this.defender = null;
        this.attackerKey = 'P1';
        this.frame = 0;
        this.maxFrames = 165; // ~2.75 seconds matching the full webm animation
        this.damageApplied = false;
        this.flashAlpha = 0;
        this.titleBanner = 'SOLAR — ULTIMATE: METEOR CRASH';
    }

    trigger(attacker, defender, attackerKey = 'P1') {
        this.isActive = true;
        this.attacker = attacker;
        this.defender = defender;
        this.attackerKey = attackerKey || 'P1';
        this.frame = 0;
        this.damageApplied = false;
        this.flashAlpha = 0.55;
        this.titleBanner = attacker?.config?.name 
            ? `${attacker.config.name} — ${attacker.config.attacks?.[ATTACK_TYPES.ULTIMATE]?.name || 'ULTIMATE ATTACK'}`
            : 'SOLAR — ULTIMATE: METEOR CRASH';

        // Reset and play the ultimate video
        try {
            this.video.currentTime = 0;
            const playPromise = this.video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(() => {});
            }
        } catch (e) {}

        // Audio & Camera
        soundEngine.playSuperActivation();
        camera.startSuperCinematic(attacker, 45);
        camera.addTrauma(0.65);
    }

    update() {
        if (!this.isActive) return;

        this.frame++;

        // Flash alpha decay
        if (this.flashAlpha > 0) {
            this.flashAlpha = Math.max(0, this.flashAlpha - 0.04);
        }

        // Contact & Hit Detection
        // As long as the attack has not connected and active frames have started (frame 18+)
        if (!this.damageApplied && this.defender && this.attacker) {
            if (this.frame >= 18) {
                // The ultimate eruption & falling meteor barrage spans across the battlefield (~850px radius)
                const dist = Math.abs(this.defender.x - this.attacker.x);
                const inRange = dist < 850;

                // Also verify AABB collision with defender's hurtboxes
                const hurtboxes = this.defender.getHurtboxes();
                const attackBox = {
                    x: this.attacker.facingRight ? this.attacker.x - 180 : this.attacker.x - 720,
                    y: 60,
                    w: 900,
                    h: 580
                };
                let aabbContact = false;
                for (const hb of hurtboxes) {
                    if (attackBox.x < hb.x + hb.w && attackBox.x + attackBox.w > hb.x &&
                        attackBox.y < hb.y + hb.h && attackBox.y + attackBox.h > hb.y) {
                        aabbContact = true;
                        break;
                    }
                }

                // If in contact with the magma eruption or falling meteor shower
                if (inRange || aabbContact) {
                    this.applyUltimateHit();
                }
            }
        }

        // Mid-ultimate meteor impact tremors (at key impact peaks in the animation)
        if (this.frame === 50 || this.frame === 75 || this.frame === 105) {
            camera.addTrauma(0.5);
            soundEngine.playHeavyHit();
            if (this.defender) {
                particleSystem.spawnHitSpark(this.defender.x, this.defender.y - 65, '#f97316', 16, true);
            }
        }

        // End of ultimate cinematic
        if (this.frame >= this.maxFrames) {
            this.end();
        }
    }

    applyUltimateHit() {
        if (this.damageApplied || !this.defender || !this.attacker) return;
        this.damageApplied = true;

        const baseDamage = this.attacker.config?.attacks?.[ATTACK_TYPES.ULTIMATE]?.damage || 320;
        const scaledDamage = comboTracker.registerHit(this.attackerKey, baseDamage);

        const isBlocking = this.defender.state === FIGHTER_STATES.BLOCK || this.defender.state === FIGHTER_STATES.PERFECT_BLOCK;

        if (isBlocking) {
            // Heavy Super Chip Damage (25% of ultimate)
            const chip = Math.floor(scaledDamage * 0.25);
            this.defender.health = Math.max(0, this.defender.health - chip);
            this.defender.blockstunFrames = 35;
            this.defender.damageFlashTimer = 6;
            this.defender.vx = (this.defender.x >= this.attacker.x ? 1 : -1) * 16;
            soundEngine.playBlock();
            particleSystem.spawnHitSpark(this.defender.x, this.defender.y - 60, '#facc15', 18, true);
            camera.addTrauma(0.7);
        } else {
            // Full Ultimate Attack Damage
            this.defender.health = Math.max(0, this.defender.health - scaledDamage);
            this.defender.state = FIGHTER_STATES.HURT;
            this.defender.hitstunFrames = 65;
            this.defender.damageFlashTimer = 12;

            // Launch / Knockdown Physics
            this.defender.vy = -18;
            this.defender.vx = (this.defender.x >= this.attacker.x ? 1 : -1) * 18;
            this.defender.isGrounded = false;
            this.defender.state = FIGHTER_STATES.FALL;

            // Impacts & Shockwaves
            camera.addTrauma(1.0);
            camera.addHitstop(14);
            soundEngine.playSuperImpact();
            particleSystem.spawnSuperImpactExplosion(this.defender.x, this.defender.y - 40, '#ea580c');
            particleSystem.spawnHitSpark(this.defender.x, this.defender.y - 70, '#f97316', 36, true);
            
            // Trigger impact white flash
            this.flashAlpha = 0.45;
        }
    }

    end() {
        this.isActive = false;
        try {
            this.video.pause();
        } catch (e) {}

        if (this.attacker && (this.attacker.state === FIGHTER_STATES.SUPER_STARTUP || this.attacker.state === FIGHTER_STATES.ATTACK)) {
            this.attacker.state = FIGHTER_STATES.IDLE;
            this.attacker.currentAttackData = null;
            this.attacker.attackPhase = null;
        }
    }

    render(ctx) {
        if (!this.isActive) return;

        ctx.save();

        // 1. Render Video Frame (1280x720 matches canvas viewport)
        if (this.video && this.video.readyState >= 2) {
            ctx.drawImage(this.video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // 2. Cinematic Black Letterbox Bars (42px) with Glowing Molten Edge Lines
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, CANVAS_WIDTH, 44);
        ctx.fillRect(0, CANVAS_HEIGHT - 44, CANVAS_WIDTH, 44);

        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, 44);
        ctx.lineTo(CANVAS_WIDTH, 44);
        ctx.moveTo(0, CANVAS_HEIGHT - 44);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 44);
        ctx.stroke();

        // 3. Cinematic Super Move Title Banner
        ctx.font = '900 22px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        const parts = this.titleBanner.split(' — ');
        ctx.fillText(parts[0], 28, 30);
        if (parts[1]) {
            ctx.fillStyle = '#f97316';
            ctx.font = '800 17px "Outfit", sans-serif';
            ctx.fillText(`— ${parts[1]}`, 28 + ctx.measureText(parts[0]).width + 12, 30);
        }

        // 4. White-hot / Orange screen flash on activation & impact
        if (this.flashAlpha > 0) {
            ctx.fillStyle = `rgba(255, 200, 120, ${this.flashAlpha})`;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        ctx.restore();
    }
}

export const ultimateManager = new UltimateManager();
