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

        // Offscreen Keying Canvas (640x360 for high-fidelity chroma-keying at <0.4ms)
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = 640;
        this.offscreenCanvas.height = 360;
        this.offCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });

        this.isActive = false;
        this.attacker = null;
        this.defender = null;
        this.attackerKey = 'P1';
        this.frame = 0;
        this.maxFrames = 165; // ~2.75 seconds matching the full webm animation
        this.damageApplied = false;
        this.flashAlpha = 0;
        this.titleBanner = 'SOLAR — ULTIMATE: METEOR CRASH';

        // Anchor offsets for in-world positioning (Solar stands ~240px from left, 310px down in the 640x360 frame)
        this.anchorX = 240;
        this.anchorY = 310;
        this.renderW = 640;
        this.renderH = 360;
    }

    trigger(attacker, defender, attackerKey = 'P1') {
        this.isActive = true;
        this.attacker = attacker;
        this.defender = defender;
        this.attackerKey = attackerKey || 'P1';
        this.frame = 0;
        this.damageApplied = false;
        this.flashAlpha = 0.40;
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

        // Elemental ground fissure eruptions advancing toward defender on active frames
        if (this.frame === 18 && this.attacker) {
            const targetX = this.defender ? this.defender.x : (this.attacker.facingRight ? this.attacker.x + 550 : this.attacker.x - 550);
            particleSystem.spawnGroundFissure(this.attacker.x, targetX, this.attacker.y, 'MAGMA', '#ea580c');
        } else if (this.frame === 48 && this.attacker) {
            const targetX = this.defender ? this.defender.x : (this.attacker.facingRight ? this.attacker.x + 650 : this.attacker.x - 650);
            particleSystem.spawnGroundFissure(this.attacker.x, targetX, this.attacker.y, 'MAGMA', '#f97316');
        }

        // Ambient magma embers erupting from stage during attack
        if (this.frame >= 18 && this.frame <= 125 && this.frame % 6 === 0 && this.attacker) {
            const spreadX = (Math.random() - 0.5) * 360;
            particleSystem.spawnHitSpark(this.attacker.x + spreadX, this.attacker.y - Math.random() * 30, '#ea580c', 3, false);
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

    // =========================================================================
    // IN-WORLD ARENA RENDERING (Called within Camera Transform Pass)
    // =========================================================================
    renderWorld(ctx) {
        if (!this.isActive || !this.attacker) return;

        // Process real-time offscreen chroma/luma-keying on video frame
        if (this.video && this.video.readyState >= 2) {
            this.offCtx.drawImage(this.video, 0, 0, this.renderW, this.renderH);
            const imgData = this.offCtx.getImageData(0, 0, this.renderW, this.renderH);
            const d = imgData.data;
            const len = d.length;

            for (let i = 0; i < len; i += 4) {
                const r = d[i];
                const g = d[i + 1];
                const b = d[i + 2];
                const maxRGB = r > g ? (r > b ? r : b) : (g > b ? g : b);
                const minRGB = r < g ? (r < b ? r : b) : (g < b ? g : b);
                const diff = maxRGB - minRGB;

                // White and near-white/light gray video background removal
                if (minRGB > 215 && diff < 30) {
                    d[i + 3] = 0;
                } else if (minRGB > 175 && diff < 42) {
                    const fade = (minRGB - 175) / 40;
                    d[i + 3] = (d[i + 3] * (1 - fade)) | 0;
                }
            }
            this.offCtx.putImageData(imgData, 0, 0);
        }

        ctx.save();

        // 1. Stage Ground Magma Glow beneath Solar
        const glowGrad = ctx.createRadialGradient(
            this.attacker.x, this.attacker.y, 10,
            this.attacker.x, this.attacker.y, 240
        );
        glowGrad.addColorStop(0, 'rgba(234, 88, 12, 0.45)');
        glowGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.20)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.ellipse(this.attacker.x, this.attacker.y, 240, 60, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Render In-World Keyed Video Animation anchored to Solar's coordinates
        if (this.video && this.video.readyState >= 2) {
            ctx.save();
            if (this.attacker.facingRight) {
                ctx.drawImage(
                    this.offscreenCanvas,
                    this.attacker.x - this.anchorX,
                    this.attacker.y - this.anchorY,
                    this.renderW,
                    this.renderH
                );
            } else {
                ctx.translate(this.attacker.x, this.attacker.y);
                ctx.scale(-1, 1);
                ctx.drawImage(
                    this.offscreenCanvas,
                    -this.anchorX,
                    -this.anchorY,
                    this.renderW,
                    this.renderH
                );
            }
            ctx.restore();
        }

        ctx.restore();
    }

    // =========================================================================
    // SCREEN SPACE CINEMATIC OVERLAY (HUD Title Pill & Screen Flash)
    // =========================================================================
    renderScreenOverlay(ctx) {
        if (!this.isActive) return;

        ctx.save();

        // 1. Sleek Console Super Move Title Pill (Top-Left HUD)
        ctx.fillStyle = 'rgba(10, 10, 15, 0.82)';
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(28, 18, 440, 36, 8);
        ctx.fill();
        ctx.stroke();

        // Glowing molten dot
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(44, 36, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '900 16px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        const parts = this.titleBanner.split(' — ');
        ctx.fillText(parts[0], 58, 36);
        if (parts[1]) {
            ctx.fillStyle = '#f97316';
            ctx.font = '800 14px "Outfit", sans-serif';
            ctx.fillText(`— ${parts[1]}`, 58 + ctx.measureText(parts[0]).width + 10, 36);
        }

        // 2. White-hot / Orange screen flash on activation & impact
        if (this.flashAlpha > 0) {
            ctx.fillStyle = `rgba(255, 200, 120, ${this.flashAlpha})`;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        ctx.restore();
    }

    // Backward-compatible alias
    render(ctx) {
        this.renderScreenOverlay(ctx);
    }
}

export const ultimateManager = new UltimateManager();
