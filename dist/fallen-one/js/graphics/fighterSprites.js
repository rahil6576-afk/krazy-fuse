// js/graphics/fighterSprites.js - Native 4-Frame Movement Animation Engine & Dynamic Special / Ultimate Attack VFX System

import { FIGHTER_STATES, ATTACK_TYPES } from '../core/constants.js';
import { CHAMPION_SPRITES } from './championSpritesMap.js';
import { ultimateManager } from './ultimateManager.js';

// Aarav Sprite Sheet Mapping (on 1536x1024 clean transparent sheet with all 4 walk frames & new skill set)
export const AARAV_SPRITE_FRAMES = {
    IDLE: { sx: 36, sy: 10, sw: 158, sh: 286, dx: -45, dy: -140, dw: 80, dh: 145 },
    WALK_1: { sx: 263, sy: 58, sw: 154, sh: 238, dx: -45, dy: -140, dw: 94, dh: 145 },
    WALK_2: { sx: 435, sy: 65, sw: 151, sh: 231, dx: -45, dy: -140, dw: 95, dh: 145 },
    WALK_3: { sx: 597, sy: 74, sw: 161, sh: 222, dx: -45, dy: -140, dw: 105, dh: 145 },
    WALK_4: { sx: 776, sy: 69, sw: 156, sh: 227, dx: -45, dy: -140, dw: 100, dh: 145 },
    JUMP: { sx: 964, sy: 10, sw: 157, sh: 286, dx: -45, dy: -140, dw: 80, dh: 145 },
    CROUCH: { sx: 1133, sy: 146, sw: 162, sh: 150, dx: -45, dy: -100, dw: 113, dh: 105 },
    BLOCK: { sx: 1325, sy: 86, sw: 185, sh: 210, dx: -45, dy: -140, dw: 128, dh: 145 },

    LIGHT_ATTACK: { sx: 25, sy: 345, sw: 280, sh: 231, dx: -45, dy: -140, dw: 176, dh: 145 },
    HEAVY_ATTACK: { sx: 346, sy: 358, sw: 306, sh: 218, dx: -45, dy: -140, dw: 204, dh: 145 },
    RISING_KICK: { sx: 677, sy: 345, sw: 247, sh: 231, dx: -50, dy: -150, dw: 166, dh: 155 },
    DASH: { sx: 945, sy: 385, sw: 268, sh: 191, dx: -45, dy: -140, dw: 203, dh: 145 },
    ENERGY_WAVE: { sx: 1224, sy: 360, sw: 286, sh: 216, dx: -45, dy: -140, dw: 192, dh: 145 },

    FOCUS_STRIKE: { sx: 35, sy: 615, sw: 239, sh: 201, dx: -45, dy: -140, dw: 172, dh: 145 },
    GROUND_BURST: { sx: 357, sy: 626, sw: 363, sh: 190, dx: -80, dy: -140, dw: 277, dh: 145 },
    ULTIMATE: { sx: 768, sy: 624, sw: 438, sh: 192, dx: -60, dy: -150, dw: 354, dh: 155 },
    WIN_POSE: { sx: 1288, sy: 615, sw: 154, sh: 201, dx: -45, dy: -140, dw: 111, dh: 145 },

    PORTRAIT: { sx: 406, sy: 855, sw: 175, sh: 136, dx: -45, dy: -140, dw: 187, dh: 145 },
    KO: { sx: 830, sy: 895, sw: 294, sh: 96, dx: -75, dy: -55, dw: 184, dh: 60 }
};

export const EASINGS = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeInSharp: (t) => t * t * t,
    easeInGravity: (t) => Math.min(1, t * t * 1.15),
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeOutOvershoot: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
};

export class FighterSpriteRenderer {
    static aaravImg = null;
    static champImages = {};
    static initialized = false;

    static initSprites() {
        if (this.initialized) return;
        this.initialized = true;

        if (!this.aaravImg) {
            this.aaravImg = new Image();
            this.aaravImg.src = 'assets/characters/aarav_clean.png';
        }

        for (const [charId, data] of Object.entries(CHAMPION_SPRITES)) {
            if (!this.champImages[charId]) {
                const img = new Image();
                img.src = data.imageSrc;
                this.champImages[charId] = img;
            }
        }
    }

    // =========================================================================
    // MAIN ENTRY POINT
    // =========================================================================
    static drawFighter(ctx, fighter) {
        this.initSprites();

        ctx.save();
        ctx.translate(fighter.x, fighter.y);

        // Ground shadow with breathing scale
        this.drawGroundShadow(ctx, fighter);

        // Flip sprite if facing left
        if (!fighter.facingRight) {
            ctx.scale(-1, 1);
        }

        // 1. Draw Multi-layered Chromatic Motion Trails during dashes & rapid movement
        if (fighter.hasMotionTrail || fighter.state === FIGHTER_STATES.DASH_FWD || fighter.state === FIGHTER_STATES.DASH_BWD) {
            this.drawDashMotionTrail(ctx, fighter);
        }

        // 2. Render Character with 4-Frame Dynamic Movement / Action Blending
        if (ultimateManager.isActive && ultimateManager.attacker === fighter) {
            // Solar is dynamically animated in-world on the stage via ultimateManager
        } else if (fighter.charId === 'AARAV') {
            this.drawAarav(ctx, fighter);
        } else if (CHAMPION_SPRITES[fighter.charId]) {
            this.drawChampion(ctx, fighter, fighter.charId);
        } else {
            this.drawAarav(ctx, fighter);
        }

        // 3. Render Dynamic In-Engine Special Attack Auras
        this.drawSpecialAttackFX(ctx, fighter);

        // 4. Render Dynamic Cinematic Ultimate Attack Vignette & Lighting
        this.drawUltimateAttackFX(ctx, fighter);

        // 5. Draw Energy / Super Mode / Perfect Block Auras
        if (fighter.isSuperMode || fighter.state === FIGHTER_STATES.SUPER_STARTUP) {
            this.drawSuperAura(ctx, fighter);
        }

        ctx.restore();
    }

    // =========================================================================
    // GROUND SHADOW & MOTION TRAILS
    // =========================================================================
    static drawGroundShadow(ctx, f) {
        const isAirborne = !f.isGrounded;
        const altitude = isAirborne ? Math.max(0, -f.vy * 2) : 0;
        const shadowScale = Math.max(0.4, 1.0 - (altitude / 300));
        const timer = f.stateTimer || 0;
        const breath = Math.sin(timer * 0.12) * 1.5;

        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * shadowScale})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, (38 + breath) * shadowScale, (10 + breath * 0.25) * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    static drawDashMotionTrail(ctx, fighter) {
        const theme = fighter.themeColor || '#00e5ff';
        const timer = fighter.stateTimer || 0;
        const frameIndex = Math.floor(timer / 3) % 4;

        ctx.save();
        // 3-step chromatic ghost afterimages
        for (let i = 1; i <= 3; i++) {
            const offsetX = -i * (14 + frameIndex * 3);
            const offsetY = (i % 2 === 0 ? -1 : 1) * 2;
            const alpha = 0.35 / i;

            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = theme;

            // Render silhouette rounded box
            ctx.beginPath();
            ctx.roundRect(-30, -135, 60, 135, 12);
            ctx.fill();
            ctx.restore();
        }

        // Speed lines behind fighter
        ctx.strokeStyle = theme;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        for (let s = 0; s < 4; s++) {
            const ly = -30 - s * 25 + Math.sin(timer + s) * 4;
            const lx = -35 - (s * 15 + (timer * 6) % 30);
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx - 25, ly);
            ctx.stroke();
        }

        ctx.restore();
    }

    static drawSuperAura(ctx, fighter) {
        const time = Date.now() * 0.008;
        const color = fighter.themeColor || '#38bdf8';
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3.5;
        ctx.globalAlpha = 0.85;

        // Pulsing multi-ring energy field
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2 + time;
            const r = 58 + Math.sin(time * 3.5 + i * 1.5) * 14;
            const px = Math.cos(angle) * (r * 0.65);
            const py = -68 + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner core glow
        const grad = ctx.createRadialGradient(0, -68, 10, 0, -68, 65);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        grad.addColorStop(0.5, color + '22');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, -68, 65, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // =========================================================================
    // 4-FRAME MOVEMENT CALCULATION & TRANSFORMS
    // =========================================================================
    static get4FrameMovementData(f, state) {
        const timer = f.stateTimer || 0;
        let frameIndex = 0;
        let offsetX = 0;
        let offsetY = 0;
        let scaleX = 1.0;
        let scaleY = 1.0;
        let rotation = 0;
        let baseSpriteKey = 'IDLE';
        let auraIntensity = 0;

        switch (state) {
            // --- 4-FRAME IDLE ---
            case FIGHTER_STATES.IDLE: {
                frameIndex = Math.floor((timer / 6) % 4);
                baseSpriteKey = 'IDLE';

                if (frameIndex === 0) {
                    offsetY = 0;
                    scaleX = 1.0;
                    scaleY = 1.0;
                } else if (frameIndex === 1) {
                    offsetY = -2.5;
                    scaleX = 0.99;
                    scaleY = 1.02;
                } else if (frameIndex === 2) {
                    offsetY = -1.2;
                    scaleX = 1.005;
                    scaleY = 1.01;
                    offsetX = 0.8;
                } else if (frameIndex === 3) {
                    offsetY = 1.0;
                    scaleX = 1.015;
                    scaleY = 0.985;
                }
                break;
            }

            // --- 4-FRAME WALK CYCLE ---
            case FIGHTER_STATES.WALK_FWD:
            case FIGHTER_STATES.WALK_BWD: {
                const isBwd = state === FIGHTER_STATES.WALK_BWD;
                frameIndex = Math.floor((timer / 6) % 4);

                if (f.charId === 'AARAV') {
                    baseSpriteKey = 'WALK_' + (frameIndex + 1);
                } else {
                    baseSpriteKey = (frameIndex === 0 || frameIndex === 1) ? 'WALK_1' : 'WALK_2';
                }

                if (frameIndex === 0) {
                    offsetY = 0;
                    scaleX = 1.0;
                    scaleY = 1.0;
                    rotation = isBwd ? -0.02 : 0.03;
                } else if (frameIndex === 1) {
                    offsetY = -2.5;
                    scaleX = 0.99;
                    scaleY = 1.02;
                    rotation = isBwd ? -0.01 : 0.02;
                } else if (frameIndex === 2) {
                    offsetY = 0;
                    scaleX = 1.0;
                    scaleY = 1.0;
                    rotation = isBwd ? -0.02 : 0.03;
                } else if (frameIndex === 3) {
                    offsetY = -1.5;
                    scaleX = 1.01;
                    scaleY = 0.99;
                    rotation = 0;
                }
                break;
            }

            // --- 4-FRAME JUMP & AERIAL PHASES ---
            case FIGHTER_STATES.JUMP:
            case FIGHTER_STATES.FALL: {
                baseSpriteKey = 'JUMP';
                const vy = f.vy;

                if (vy < -7) {
                    frameIndex = 0;
                    scaleY = 1.06;
                    scaleX = 0.95;
                    offsetY = -2;
                    rotation = 0.05;
                } else if (vy < -1) {
                    frameIndex = 1;
                    scaleY = 1.02;
                    scaleX = 0.98;
                    offsetY = 0;
                    rotation = 0.03;
                } else if (vy <= 3) {
                    frameIndex = 2;
                    scaleY = 0.98;
                    scaleX = 1.02;
                    offsetY = 1;
                    rotation = 0.0;
                } else {
                    frameIndex = 3;
                    scaleY = 1.04;
                    scaleX = 0.96;
                    offsetY = 2;
                    rotation = -0.04;
                }
                break;
            }

            // --- 4-FRAME CROUCH ---
            case FIGHTER_STATES.CROUCH: {
                baseSpriteKey = 'CROUCH';
                frameIndex = Math.floor((timer / 5) % 4);

                if (frameIndex === 0) {
                    offsetY = 3.0;
                    scaleX = 1.05;
                    scaleY = 0.92;
                } else if (frameIndex === 1) {
                    offsetY = 1.5;
                    scaleX = 1.02;
                    scaleY = 0.96;
                } else if (frameIndex === 2) {
                    offsetY = 0;
                    scaleX = 1.0;
                    scaleY = 1.0;
                } else if (frameIndex === 3) {
                    offsetY = 2.0;
                    scaleX = 1.03;
                    scaleY = 0.94;
                }
                break;
            }

            // --- 4-FRAME DASH ---
            case FIGHTER_STATES.DASH_FWD:
            case FIGHTER_STATES.DASH_BWD: {
                baseSpriteKey = 'DASH';
                frameIndex = Math.min(3, Math.floor(timer / 3));

                if (frameIndex === 0) {
                    offsetY = 2.0;
                    scaleX = 0.92;
                    scaleY = 1.04;
                    rotation = 0.08;
                } else if (frameIndex === 1) {
                    offsetY = -2.0;
                    scaleX = 1.12;
                    scaleY = 0.90;
                    rotation = 0.12;
                    auraIntensity = 0.6;
                } else if (frameIndex === 2) {
                    offsetY = -1.0;
                    scaleX = 1.06;
                    scaleY = 0.95;
                    rotation = 0.08;
                } else {
                    offsetY = 2.5;
                    scaleX = 0.98;
                    scaleY = 0.96;
                    rotation = 0.02;
                }
                break;
            }

            // --- 4-FRAME BLOCK ---
            case FIGHTER_STATES.BLOCK:
            case FIGHTER_STATES.PERFECT_BLOCK: {
                baseSpriteKey = 'BLOCK';
                frameIndex = Math.floor((timer / 4) % 4);

                if (frameIndex === 0) {
                    offsetX = -3.0;
                    scaleX = 0.96;
                    scaleY = 1.03;
                    auraIntensity = 0.8;
                } else if (frameIndex === 1) {
                    offsetX = -1.5;
                    scaleX = 1.02;
                    scaleY = 0.99;
                    auraIntensity = 1.0;
                } else if (frameIndex === 2) {
                    offsetX = 0;
                    scaleX = 1.0;
                    scaleY = 1.0;
                    auraIntensity = 0.6;
                } else {
                    offsetX = -0.5;
                    scaleX = 0.99;
                    scaleY = 1.01;
                    auraIntensity = 0.4;
                }
                break;
            }

            // --- 4-FRAME ATTACKS ---
            case FIGHTER_STATES.ATTACK:
            case FIGHTER_STATES.SUPER_STARTUP: {
                const atk = f.currentAttackData ? f.currentAttackData.type : null;
                const phase = f.attackPhase || 'STARTUP';
                const fAtk = f.attackFrame || 0;

                if (atk === ATTACK_TYPES.LIGHT_PUNCH || atk === ATTACK_TYPES.LIGHT_KICK) {
                    baseSpriteKey = 'LIGHT_ATTACK';
                    if (phase === 'STARTUP') {
                        frameIndex = 0;
                        scaleX = 0.94;
                        scaleY = 1.03;
                        offsetX = -2;
                    } else if (phase === 'ACTIVE' && fAtk <= 2) {
                        frameIndex = 1;
                        scaleX = 1.08;
                        scaleY = 0.96;
                        offsetX = 5;
                    } else if (phase === 'ACTIVE') {
                        frameIndex = 2;
                        scaleX = 1.12;
                        scaleY = 0.94;
                        offsetX = 8;
                        auraIntensity = 0.5;
                    } else {
                        frameIndex = 3;
                        scaleX = 1.02;
                        scaleY = 0.99;
                        offsetX = 2;
                    }
                } else if (atk === ATTACK_TYPES.HEAVY_PUNCH || atk === ATTACK_TYPES.HEAVY_KICK) {
                    baseSpriteKey = 'HEAVY_ATTACK';
                    if (phase === 'STARTUP') {
                        frameIndex = 0;
                        scaleX = 0.90;
                        scaleY = 1.06;
                        offsetX = -4;
                        auraIntensity = 0.4;
                    } else if (phase === 'ACTIVE' && fAtk <= 3) {
                        frameIndex = 1;
                        scaleX = 1.14;
                        scaleY = 0.92;
                        offsetX = 10;
                        rotation = 0.05;
                    } else if (phase === 'ACTIVE') {
                        frameIndex = 2;
                        scaleX = 1.20;
                        scaleY = 0.90;
                        offsetX = 14;
                        auraIntensity = 0.9;
                    } else {
                        frameIndex = 3;
                        scaleX = 1.05;
                        scaleY = 0.98;
                        offsetX = 4;
                    }
                } else if (atk === ATTACK_TYPES.RISING_KICK) {
                    baseSpriteKey = 'RISING_KICK';
                    if (phase === 'STARTUP') {
                        frameIndex = 0;
                        scaleY = 0.88;
                        offsetY = 4;
                    } else if (phase === 'ACTIVE') {
                        frameIndex = fAtk <= 3 ? 1 : 2;
                        scaleY = 1.15;
                        scaleX = 0.92;
                        offsetY = -8;
                        auraIntensity = 0.8;
                    } else {
                        frameIndex = 3;
                        scaleY = 1.0;
                        offsetY = -2;
                    }
                } else if (atk === ATTACK_TYPES.ULTIMATE) {
                    baseSpriteKey = 'ULTIMATE';
                    frameIndex = Math.floor((timer / 4) % 4);
                    auraIntensity = 1.0;
                } else {
                    baseSpriteKey = 'SPECIAL';
                    frameIndex = Math.floor((timer / 4) % 4);
                    auraIntensity = 0.7;
                }
                break;
            }

            case FIGHTER_STATES.HURT: {
                baseSpriteKey = 'CROUCH';
                frameIndex = Math.min(3, Math.floor(timer / 3));
                offsetX = -4 - (3 - frameIndex) * 2;
                rotation = -0.08 * (4 - frameIndex);
                scaleY = 0.95;
                break;
            }

            case FIGHTER_STATES.VICTORY: {
                baseSpriteKey = 'WIN_POSE';
                frameIndex = Math.floor((timer / 8) % 4);
                offsetY = Math.sin(timer * 0.1) * 2;
                break;
            }

            default: {
                baseSpriteKey = 'IDLE';
                frameIndex = 0;
                break;
            }
        }

        return {
            frameIndex,
            baseSpriteKey,
            offsetX,
            offsetY,
            scaleX,
            scaleY,
            rotation,
            auraIntensity
        };
    }

    // =========================================================================
    // AARAV 19-MOVE PROCEDURAL RIGGING & EASING ENGINE
    // =========================================================================
    static getAaravAnimationData(f, state) {
        let offsetX = 0;
        let offsetY = 0;
        let scaleX = 1.0;
        let scaleY = 1.0;
        let rotation = 0;
        let baseSpriteKey = 'IDLE';
        let auraIntensity = 0;
        let gauntletPulse = 0;
        const timer = f.stateTimer || 0;

        switch (state) {
            // 1. AARAV_IDLE (48f loop / 800ms)
            case FIGHTER_STATES.IDLE: {
                baseSpriteKey = 'IDLE';
                const cycle = timer % 48;

                if (cycle < 24) {
                    // Breathe rise (24f / 400ms, ease-in-out)
                    const t = cycle / 24;
                    const e = EASINGS.easeInOut(t);
                    offsetY = -2.5 * e;
                    scaleY = 1.0 + 0.03 * e;
                    scaleX = 1.0 - 0.01 * e;
                } else {
                    // Breathe fall (24f / 400ms, ease-in-out)
                    const t = (cycle - 24) / 24;
                    const e = EASINGS.easeInOut(t);
                    offsetY = -2.5 * (1 - e);
                    scaleY = 1.03 - 0.03 * e;
                    scaleX = 0.99 + 0.01 * e;
                }

                // Gauntlet pulse (60f / 1000ms, ease-in-out)
                const gTimer = timer % 60;
                const gNorm = gTimer / 60;
                gauntletPulse = Math.sin(gNorm * Math.PI * 2) * 0.5 + 0.5;
                auraIntensity = 0.3 + 0.5 * gauntletPulse;
                break;
            }

            // 2-5. AARAV_WALK (32f total / 533ms)
            case FIGHTER_STATES.WALK_FWD:
            case FIGHTER_STATES.WALK_BWD: {
                const isBwd = state === FIGHTER_STATES.WALK_BWD;
                const cycle = timer % 32;

                if (cycle < 8) {
                    // 2. AARAV_WALK_1 (Contact, 8f / 133ms)
                    baseSpriteKey = 'WALK_1';
                    if (cycle < 4) {
                        // Foot strike (4f, ease-out)
                        const t = cycle / 4;
                        const e = EASINGS.easeOut(t);
                        offsetY = 1.5 * e;
                        scaleY = 1.0 - 0.02 * e;
                        scaleX = 1.0 + 0.02 * e;
                    } else {
                        // Weight settle (4f, ease-in-out)
                        const t = (cycle - 4) / 4;
                        const e = EASINGS.easeInOut(t);
                        offsetY = 1.5 * (1 - e);
                        rotation = (isBwd ? -0.02 : 0.03) * e;
                    }
                } else if (cycle < 16) {
                    // 3. AARAV_WALK_2 (Passing, 8f / 133ms)
                    baseSpriteKey = 'WALK_2';
                    if (cycle < 12) {
                        // Hip rise (4f, ease-in-out)
                        const t = (cycle - 8) / 4;
                        const e = EASINGS.easeInOut(t);
                        offsetY = -3.0 * e;
                        scaleY = 1.0 + 0.03 * e;
                    } else {
                        // Pass through (4f, linear)
                        const t = (cycle - 12) / 4;
                        offsetY = -3.0 + 1.5 * t;
                        rotation = isBwd ? -0.01 : 0.02;
                    }
                } else if (cycle < 24) {
                    // 4. AARAV_WALK_3 (Contact Mirror, 8f / 133ms)
                    baseSpriteKey = 'WALK_3';
                    if (cycle < 20) {
                        // Foot strike (4f, ease-out)
                        const t = (cycle - 16) / 4;
                        const e = EASINGS.easeOut(t);
                        offsetY = 1.5 * e;
                        scaleY = 0.98;
                        scaleX = 1.02;
                    } else {
                        // Weight settle (4f, ease-in-out)
                        const t = (cycle - 20) / 4;
                        const e = EASINGS.easeInOut(t);
                        offsetY = 1.5 * (1 - e);
                        rotation = (isBwd ? -0.02 : 0.03) * (1 - e);
                    }
                } else {
                    // 5. AARAV_WALK_4 (Extension, 8f / 133ms)
                    baseSpriteKey = 'WALK_4';
                    if (cycle < 29) {
                        // Full stride (5f, linear)
                        offsetY = -1.0;
                        scaleX = 1.03;
                        rotation = isBwd ? -0.01 : 0.02;
                    } else {
                        // Push-off (3f, ease-in)
                        const t = (cycle - 29) / 3;
                        const e = EASINGS.easeIn(t);
                        scaleY = 1.0 + 0.02 * e;
                        rotation = 0;
                    }
                }
                break;
            }

            // 6. AARAV_JUMP (40f / 667ms)
            case FIGHTER_STATES.JUMP:
            case FIGHTER_STATES.FALL: {
                baseSpriteKey = 'JUMP';
                const jf = Math.min(39, timer);

                if (jf < 4) {
                    // Startup crouch (4f, ease-in)
                    const t = jf / 4;
                    const e = EASINGS.easeIn(t);
                    offsetY = 4 * e;
                    scaleY = 1.0 - 0.08 * e;
                    scaleX = 1.0 + 0.05 * e;
                } else if (jf < 6) {
                    // Squash (2f, ease-out)
                    offsetY = 5;
                    scaleY = 0.88;
                    scaleX = 1.08;
                } else if (jf < 16) {
                    // Ascent stretch (10f, ease-out)
                    const t = (jf - 6) / 10;
                    const e = EASINGS.easeOut(t);
                    offsetY = -3;
                    scaleY = 1.15 - 0.05 * e;
                    scaleX = 0.93 + 0.03 * e;
                    rotation = 0.03;
                } else if (jf < 22) {
                    // Peak hang time (6f, linear)
                    offsetY = 0;
                    scaleY = 1.0;
                    scaleX = 1.0;
                    rotation = 0;
                } else if (jf < 32) {
                    // Descent (10f, ease-in)
                    const t = (jf - 22) / 10;
                    const e = EASINGS.easeIn(t);
                    offsetY = 2 * e;
                    scaleY = 1.0 + 0.08 * e;
                    scaleX = 1.0 - 0.04 * e;
                    rotation = -0.03;
                } else if (jf < 35) {
                    // Landing squash (3f, ease-out)
                    const t = (jf - 32) / 3;
                    const e = EASINGS.easeOut(t);
                    offsetY = 4 * (1 - e);
                    scaleY = 0.90 + 0.05 * e;
                    scaleX = 1.06 - 0.03 * e;
                } else {
                    // Recovery (5f, ease-in-out)
                    const t = (jf - 35) / 5;
                    const e = EASINGS.easeInOut(t);
                    scaleY = 0.95 + 0.05 * e;
                    scaleX = 1.03 - 0.03 * e;
                }
                break;
            }

            // 7. AARAV_CROUCH (32f / 533ms)
            case FIGHTER_STATES.CROUCH: {
                baseSpriteKey = 'CROUCH';
                if (timer < 3) {
                    // Startup (3f, ease-in)
                    const t = timer / 3;
                    const e = EASINGS.easeIn(t);
                    offsetY = 5 * e;
                    scaleY = 1.0 - 0.08 * e;
                    scaleX = 1.0 + 0.04 * e;
                } else if (timer < 27) {
                    // Hold (24f, linear with subtle breathing)
                    offsetY = 5;
                    scaleY = 0.92 + 0.015 * Math.sin(timer * 0.2);
                    scaleX = 1.04;
                } else {
                    // Rise recovery (5f, ease-out)
                    const t = Math.min(1, (timer - 27) / 5);
                    const e = EASINGS.easeOut(t);
                    offsetY = 5 * (1 - e);
                    scaleY = 0.92 + 0.08 * e;
                    scaleX = 1.04 - 0.04 * e;
                }
                break;
            }

            // 8. AARAV_BLOCK (44f / 733ms)
            case FIGHTER_STATES.BLOCK:
            case FIGHTER_STATES.PERFECT_BLOCK: {
                baseSpriteKey = 'BLOCK';
                if (timer < 5) {
                    // Shield raise (5f, ease-out)
                    const t = timer / 5;
                    const e = EASINGS.easeOut(t);
                    offsetX = -3 * e;
                    scaleX = 1.0 - 0.04 * e;
                    auraIntensity = 0.5 * e;
                } else if (timer < 8) {
                    // Shield pulse-in (3f, ease-out overshoot)
                    const t = (timer - 5) / 3;
                    const e = EASINGS.easeOutOvershoot(t);
                    offsetX = -3 + e;
                    scaleX = 1.04;
                    auraIntensity = 1.0;
                } else if (timer < 38) {
                    // Hold (30f, linear)
                    offsetX = -1;
                    scaleX = 1.0;
                    auraIntensity = 0.75 + 0.15 * Math.sin(timer * 0.3);
                } else {
                    // Shield lower (6f, ease-in-out)
                    const t = Math.min(1, (timer - 38) / 6);
                    const e = EASINGS.easeInOut(t);
                    offsetX = -1 * (1 - e);
                    auraIntensity = 0.75 * (1 - e);
                }
                break;
            }

            // 12. AARAV_DASH (17f / 283ms)
            case FIGHTER_STATES.DASH_FWD:
            case FIGHTER_STATES.DASH_BWD: {
                baseSpriteKey = 'DASH';
                if (timer < 2) {
                    // Launch burst (2f, ease-in sharp)
                    offsetX = 4;
                    scaleX = 1.10;
                    scaleY = 0.94;
                    rotation = 0.06;
                } else if (timer < 10) {
                    // Full stretch travel (8f, linear) - Motion blur active
                    offsetX = 10;
                    scaleX = 1.25;
                    scaleY = 0.88;
                    offsetY = -2;
                    rotation = 0.10;
                    auraIntensity = 0.8;
                } else if (timer < 14) {
                    // Deceleration (4f, ease-out)
                    const t = (timer - 10) / 4;
                    const e = EASINGS.easeOut(t);
                    offsetX = 10 - 6 * e;
                    scaleX = 1.25 - 0.15 * e;
                    scaleY = 0.88 + 0.08 * e;
                    rotation = 0.10 - 0.06 * e;
                } else {
                    // Snap to neutral (3f, ease-out)
                    const t = Math.min(1, (timer - 14) / 3);
                    const e = EASINGS.easeOut(t);
                    offsetX = 4 * (1 - e);
                    scaleX = 1.10 - 0.10 * e;
                    scaleY = 0.96 + 0.04 * e;
                    rotation = 0.04 * (1 - e);
                }
                break;
            }

            // 9, 10, 11, 13, 14, 15, 16. ATTACKS
            case FIGHTER_STATES.ATTACK:
            case FIGHTER_STATES.SUPER_STARTUP: {
                const atk = f.currentAttackData ? f.currentAttackData.type : null;

                // 9. AARAV_LIGHT_ATTACK (15f / 250ms)
                if (atk === ATTACK_TYPES.LIGHT_PUNCH || atk === ATTACK_TYPES.LIGHT_KICK) {
                    baseSpriteKey = 'LIGHT_ATTACK';
                    if (timer < 3) {
                        // Startup (3f, ease-in)
                        const t = timer / 3;
                        const e = EASINGS.easeIn(t);
                        offsetX = -3 * e;
                        scaleX = 1.0 - 0.05 * e;
                        scaleY = 1.02;
                    } else if (timer < 7) {
                        // Active (4f, linear)
                        offsetX = 8;
                        scaleX = 1.12;
                        scaleY = 0.96;
                    } else if (timer < 9) {
                        // Energy burst flash (2f, ease-out)
                        offsetX = 10;
                        scaleX = 1.16;
                        scaleY = 0.94;
                        auraIntensity = 1.0;
                        gauntletPulse = 1.0;
                    } else {
                        // Recovery (6f, ease-out)
                        const t = Math.min(1, (timer - 9) / 6);
                        const e = EASINGS.easeOut(t);
                        offsetX = 10 * (1 - e);
                        scaleX = 1.16 - 0.16 * e;
                        scaleY = 0.94 + 0.06 * e;
                    }
                }
                // 10. AARAV_HEAVY_ATTACK (38f / 633ms)
                else if (atk === ATTACK_TYPES.HEAVY_PUNCH || atk === ATTACK_TYPES.HEAVY_KICK || atk === ATTACK_TYPES.DASH_STRIKE) {
                    baseSpriteKey = 'HEAVY_ATTACK';
                    if (timer < 12) {
                        // Windup / anticipation (12f, ease-in)
                        const t = timer / 12;
                        const e = EASINGS.easeIn(t);
                        offsetX = -6 * e;
                        scaleX = 1.0 - 0.12 * e;
                        scaleY = 1.0 + 0.08 * e;
                        auraIntensity = 0.4 * e;
                    } else if (timer < 18) {
                        // Body rotation (6f, ease-in)
                        const t = (timer - 12) / 6;
                        const e = EASINGS.easeIn(t);
                        offsetX = -6 - 2 * e;
                        rotation = -0.06 * e;
                        auraIntensity = 0.4 + 0.4 * e;
                    } else if (timer < 24) {
                        // Active crescent wave swing (6f, linear)
                        offsetX = 16;
                        scaleX = 1.22;
                        scaleY = 0.90;
                        rotation = 0.08;
                        auraIntensity = 1.0;
                    } else {
                        // Recovery (14f, ease-out)
                        const t = Math.min(1, (timer - 24) / 14);
                        const e = EASINGS.easeOut(t);
                        offsetX = 16 * (1 - e);
                        scaleX = 1.22 - 0.22 * e;
                        scaleY = 0.90 + 0.10 * e;
                        rotation = 0.08 * (1 - e);
                    }
                }
                // 11. AARAV_RISING_KICK (36f / 600ms)
                else if (atk === ATTACK_TYPES.RISING_KICK) {
                    baseSpriteKey = 'RISING_KICK';
                    if (timer < 5) {
                        // Startup (5f, ease-in)
                        const t = timer / 5;
                        const e = EASINGS.easeIn(t);
                        offsetY = 5 * e;
                        scaleY = 1.0 - 0.12 * e;
                    } else if (timer < 13) {
                        // Rising arc (8f, ease-out)
                        const t = (timer - 5) / 8;
                        const e = EASINGS.easeOut(t);
                        offsetY = 5 - 22 * e;
                        scaleY = 1.20;
                        scaleX = 0.90;
                        rotation = 0.14 * e;
                        auraIntensity = 0.9;
                    } else if (timer < 15) {
                        // Peak hold (2f, linear)
                        offsetY = -18;
                        scaleY = 1.10;
                        scaleX = 0.95;
                        rotation = 0.12;
                        auraIntensity = 1.0;
                    } else if (timer < 21) {
                        // Active hitbox (6f, linear)
                        offsetY = -16;
                        scaleY = 1.12;
                        scaleX = 0.92;
                        rotation = 0.08;
                        auraIntensity = 1.0;
                    } else if (timer < 29) {
                        // Descent (8f, ease-in)
                        const t = (timer - 21) / 8;
                        const e = EASINGS.easeIn(t);
                        offsetY = -16 + 18 * e;
                        scaleY = 1.05;
                        rotation = 0.04 * (1 - e);
                    } else {
                        // Landing recovery (7f, ease-out)
                        const t = Math.min(1, (timer - 29) / 7);
                        const e = EASINGS.easeOut(t);
                        offsetY = 2 * (1 - e);
                        scaleY = 0.92 + 0.08 * e;
                        scaleX = 1.05 - 0.05 * e;
                    }
                }
                // 13. AARAV_ENERGY_WAVE (53f / 883ms)
                else if (atk === ATTACK_TYPES.SPECIAL_2) {
                    baseSpriteKey = 'ENERGY_WAVE';
                    if (timer < 4) {
                        // Stance widen (4f, ease-in-out)
                        const t = timer / 4;
                        const e = EASINGS.easeInOut(t);
                        offsetY = 2 * e;
                        scaleX = 1.0 + 0.05 * e;
                    } else if (timer < 14) {
                        // Charge orb grow (10f, ease-in)
                        const t = (timer - 4) / 10;
                        const e = EASINGS.easeIn(t);
                        auraIntensity = 0.8 * e;
                        scaleX = 1.05;
                    } else if (timer < 16) {
                        // Release flash (2f, linear)
                        offsetX = 6;
                        auraIntensity = 1.3;
                    } else if (timer < 40) {
                        // Wave expand / travel (24f, ease-out)
                        const t = (timer - 16) / 24;
                        const e = EASINGS.easeOut(t);
                        offsetX = 6 - 2 * e;
                        auraIntensity = 0.7 * (1 - e);
                    } else if (timer < 45) {
                        // Recoil (5f, ease-out)
                        const t = (timer - 40) / 5;
                        const e = EASINGS.easeOut(t);
                        offsetX = -4 * e;
                        scaleX = 0.96;
                    } else {
                        // Recovery (8f, ease-in-out)
                        const t = Math.min(1, (timer - 45) / 8);
                        const e = EASINGS.easeInOut(t);
                        offsetX = -4 * (1 - e);
                        scaleX = 0.96 + 0.04 * e;
                    }
                }
                // 14. AARAV_FOCUS_STRIKE (22f / 367ms)
                else if (atk === ATTACK_TYPES.SPECIAL_1) {
                    baseSpriteKey = 'FOCUS_STRIKE';
                    if (timer < 4) {
                        // Charge freeze (4f, linear)
                        scaleX = 0.96;
                        scaleY = 1.02;
                        auraIntensity = 0.4;
                    } else if (timer < 8) {
                        // Energy concentrate (4f, ease-in)
                        const t = (timer - 4) / 4;
                        const e = EASINGS.easeIn(t);
                        offsetX = -3 * e;
                        auraIntensity = 0.4 + 0.6 * e;
                    } else if (timer < 11) {
                        // Strike release (3f, ease-in sharp)
                        offsetX = 14;
                        scaleX = 1.18;
                        scaleY = 0.92;
                        auraIntensity = 1.0;
                    } else if (timer < 14) {
                        // Orb impact flash (3f, ease-out)
                        offsetX = 16;
                        scaleX = 1.20;
                        auraIntensity = 1.3;
                    } else {
                        // Recovery (8f, ease-out)
                        const t = Math.min(1, (timer - 14) / 8);
                        const e = EASINGS.easeOut(t);
                        offsetX = 16 * (1 - e);
                        scaleX = 1.20 - 0.20 * e;
                        scaleY = 0.92 + 0.08 * e;
                    }
                }
                // 15. AARAV_GROUND_BURST (48f / 800ms)
                else if (atk === ATTACK_TYPES.SPECIAL_3) {
                    baseSpriteKey = 'GROUND_BURST';
                    if (timer < 6) {
                        // Leap / wind-up (6f, ease-in)
                        const t = timer / 6;
                        const e = EASINGS.easeIn(t);
                        offsetY = -14 * e;
                        scaleY = 1.14;
                        auraIntensity = 0.6 * e;
                    } else if (timer < 8) {
                        // Slam contact (2f, linear)
                        offsetY = 5;
                        scaleY = 0.85;
                        scaleX = 1.18;
                        auraIntensity = 1.0;
                    } else if (timer < 12) {
                        // Screen shake (4f, linear)
                        offsetY = 5;
                        scaleY = 0.88;
                        scaleX = 1.15;
                        auraIntensity = 1.2;
                    } else if (timer < 22) {
                        // Burst eruption (10f, ease-out)
                        const t = (timer - 12) / 10;
                        const e = EASINGS.easeOut(t);
                        offsetY = 4;
                        scaleX = 1.15;
                        auraIntensity = 1.2 * (1 - 0.5 * e);
                    } else if (timer < 38) {
                        // Debris arc / fall (16f, ease-in gravity)
                        const t = (timer - 22) / 16;
                        const e = EASINGS.easeInGravity(t);
                        offsetY = 4 - 2 * e;
                        auraIntensity = 0.6 * (1 - e);
                    } else {
                        // Recovery (10f, ease-out)
                        const t = Math.min(1, (timer - 38) / 10);
                        const e = EASINGS.easeOut(t);
                        offsetY = 2 * (1 - e);
                        scaleY = 0.90 + 0.10 * e;
                        scaleX = 1.10 - 0.10 * e;
                    }
                }
                // 16. AARAV_ULTIMATE_FOCUS_BURST (103f / 1717ms)
                else if (atk === ATTACK_TYPES.ULTIMATE) {
                    baseSpriteKey = 'ULTIMATE';
                    if (timer < 6) {
                        // Wide stance (6f, ease-in-out)
                        scaleX = 1.08;
                        scaleY = 0.95;
                        offsetY = 2;
                    } else if (timer < 24) {
                        // Full charge glow (18f, ease-in)
                        const t = (timer - 6) / 18;
                        const e = EASINGS.easeIn(t);
                        auraIntensity = 1.0 * e;
                        scaleX = 1.08 + 0.05 * e;
                    } else if (timer < 27) {
                        // Screen flash (3f, linear)
                        auraIntensity = 1.5;
                        offsetX = 2;
                    } else if (timer < 33) {
                        // Beam release (6f, ease-in sharp)
                        offsetX = -6;
                        scaleX = 1.20;
                        auraIntensity = 1.4;
                    } else if (timer < 69) {
                        // Beam active travel (36f, linear)
                        offsetX = -8 + Math.sin(timer * 0.8) * 2;
                        auraIntensity = 1.5;
                        scaleX = 1.22;
                    } else if (timer < 81) {
                        // Beam expand (12f, ease-out)
                        const t = (timer - 69) / 12;
                        const e = EASINGS.easeOut(t);
                        offsetX = -8 * (1 - e);
                        auraIntensity = 1.5 - 0.5 * e;
                    } else if (timer < 89) {
                        // Full recoil (8f, ease-out)
                        offsetX = -6;
                        scaleX = 0.94;
                        auraIntensity = 0.4;
                    } else {
                        // Recovery (14f, ease-in-out)
                        const t = Math.min(1, (timer - 89) / 14);
                        const e = EASINGS.easeInOut(t);
                        offsetX = -6 * (1 - e);
                        scaleX = 0.94 + 0.06 * e;
                    }
                }
                break;
            }

            // 17. AARAV_WIN_POSE (49f + loop / 817ms)
            case FIGHTER_STATES.VICTORY: {
                baseSpriteKey = 'WIN_POSE';
                if (timer < 5) {
                    // Step forward (5f, ease-out)
                    const t = timer / 5;
                    const e = EASINGS.easeOut(t);
                    offsetX = 6 * e;
                    scaleY = 1.02;
                } else if (timer < 13) {
                    // Fist raise (8f, ease-out overshoot)
                    const t = (timer - 5) / 8;
                    const e = EASINGS.easeOutOvershoot(t);
                    offsetY = -6 * e;
                    scaleY = 1.06;
                } else if (timer < 49) {
                    // Victory hold (36f, linear)
                    offsetY = -6;
                    scaleY = 1.04;
                    // Gauntlet victory pulse: frames 14–28
                    if (timer >= 14 && timer <= 28) {
                        auraIntensity = 1.0;
                        gauntletPulse = Math.sin(((timer - 14) / 14) * Math.PI) * 0.5 + 0.5;
                    }
                } else {
                    // Idle loop (48f, ease-in-out)
                    const loopTimer = (timer - 49) % 48;
                    offsetY = -6 + Math.sin((loopTimer / 48) * Math.PI * 2) * 2;
                    gauntletPulse = 0.4 + 0.3 * Math.sin((loopTimer / 48) * Math.PI * 2);
                }
                break;
            }

            // 18. AARAV_KO (56f to settle / 933ms)
            case FIGHTER_STATES.DEFEAT:
            case FIGHTER_STATES.KNOCKDOWN: {
                baseSpriteKey = 'KO';
                if (timer < 8) {
                    // Knee buckle (8f, ease-in)
                    const t = timer / 8;
                    const e = EASINGS.easeIn(t);
                    offsetY = 4 * e;
                    scaleY = 1.0 - 0.06 * e;
                    rotation = -0.04 * e;
                } else if (timer < 16) {
                    // Torso drop (8f, ease-in)
                    const t = (timer - 8) / 8;
                    const e = EASINGS.easeIn(t);
                    offsetY = 4 + 6 * e;
                    scaleY = 0.94 - 0.08 * e;
                    rotation = -0.04 - 0.06 * e;
                } else if (timer < 26) {
                    // Full collapse (10f, ease-in gravity)
                    const t = (timer - 16) / 10;
                    const e = EASINGS.easeInGravity(t);
                    offsetY = 10 + 10 * e;
                    scaleY = 0.86 - 0.18 * e;
                    scaleX = 1.0 + 0.16 * e;
                } else if (timer < 30) {
                    // Ground bounce (4f, ease-out)
                    const t = (timer - 26) / 4;
                    const e = EASINGS.easeOut(t);
                    offsetY = 20 - 4 * (1 - e);
                } else if (timer < 36) {
                    // Settle / still (6f, ease-out)
                    offsetY = 20;
                    scaleY = 0.70;
                    scaleX = 1.16;
                } else {
                    // Breathing loop: 40f / energy fade: 20f
                    const koLoop = (timer - 36) % 40;
                    const breath = Math.sin((koLoop / 40) * Math.PI * 2) * 1.5;
                    offsetY = 20 + breath;
                    scaleY = 0.70;
                    scaleX = 1.16;
                    const energyFade = Math.max(0, (56 - timer) / 20);
                    auraIntensity = 0.5 * energyFade;
                }
                break;
            }

            case FIGHTER_STATES.HURT: {
                baseSpriteKey = 'CROUCH';
                offsetX = -6 - Math.max(0, 4 - timer) * 2;
                rotation = -0.10 * Math.max(0, (6 - timer) / 6);
                scaleY = 0.92;
                break;
            }

            default: {
                baseSpriteKey = 'IDLE';
                break;
            }
        }

        return {
            baseSpriteKey,
            offsetX,
            offsetY,
            scaleX,
            scaleY,
            rotation,
            auraIntensity,
            gauntletPulse
        };
    }

    // =========================================================================
    // AARAV RENDERER
    // =========================================================================
    static drawAarav(ctx, f) {
        const anim = this.getAaravAnimationData(f, f.state);
        let frameKey = anim.baseSpriteKey;

        const frame = AARAV_SPRITE_FRAMES[frameKey] || AARAV_SPRITE_FRAMES.IDLE;

        if (this.aaravImg && this.aaravImg.complete) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;

            ctx.translate(anim.offsetX, anim.offsetY);
            ctx.rotate(anim.rotation);
            ctx.scale(anim.scaleX, anim.scaleY);

            // Draw character sprite cleanly without expensive canvas gaussian blur
            ctx.drawImage(
                this.aaravImg,
                frame.sx, frame.sy, frame.sw, frame.sh,
                frame.dx, frame.dy, frame.dw, frame.dh
            );

            // Draw gauntlet pulse luminescence with fast layered alpha (zero GPU shadow blur)
            if (anim.gauntletPulse > 0) {
                ctx.save();
                const gx = frame.dx + frame.dw * 0.62;
                const gy = frame.dy + frame.dh * 0.52;
                const r = 9 + anim.gauntletPulse * 4;

                ctx.fillStyle = `rgba(0, 229, 255, ${anim.gauntletPulse * 0.35})`;
                ctx.beginPath();
                ctx.arc(gx, gy, r * 1.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `rgba(0, 229, 255, ${anim.gauntletPulse * 0.75})`;
                ctx.beginPath();
                ctx.arc(gx, gy, r, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(gx, gy, 3.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            ctx.restore();
        }
    }

    // =========================================================================
    // 19. AARAV_PORTRAIT (HUD) (195f loop / 3250ms)
    // =========================================================================
    static drawAaravPortrait(ctx, x, y, width, height, timer = 0, damageFlashTimer = 0) {
        if (!this.aaravImg || !this.aaravImg.complete) return;

        const pFrame = AARAV_SPRITE_FRAMES.PORTRAIT;
        const pCycle = timer % 195;

        // 1. Head bob: 12f ease-in-out
        const bobTimer = (pCycle % 12) / 12;
        const bobOffset = Math.sin(bobTimer * Math.PI * 2) * 2;

        // 2. Blink: 3f ease-in-out every 180f interval
        const blinkPhase = pCycle % 180;
        const isBlinking = blinkPhase < 3;

        ctx.save();
        ctx.translate(x, y + bobOffset);

        // Render base portrait
        ctx.drawImage(
            this.aaravImg,
            pFrame.sx, pFrame.sy, pFrame.sw, pFrame.sh,
            0, 0, width, height
        );

        // Eye Blink Overlay (subtle natural eyelid shadow across upper eye region)
        if (isBlinking) {
            ctx.fillStyle = '#0a1628';
            const blinkHeight = Math.sin((blinkPhase / 3) * Math.PI) * 4;
            ctx.fillRect(width * 0.32, height * 0.36, width * 0.38, Math.max(1, blinkHeight));
        }

        // Damage flash: 6f ease-out
        if (damageFlashTimer > 0) {
            const alpha = Math.min(1, damageFlashTimer / 6);
            ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.55})`;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
            ctx.fillRect(0, 0, width, height);
        }

        ctx.restore();
    }

    // =========================================================================
    // CHAMPIONS RENDERER (Frost, Solar, Terra, Volt, Shadow)
    // =========================================================================
    static drawChampion(ctx, f, charId) {
        const champData = CHAMPION_SPRITES[charId];
        if (!champData) return;
        const frames = champData.frames;

        const anim = this.get4FrameMovementData(f, f.state);
        let frameKey = anim.baseSpriteKey;

        if (!frames[frameKey]) {
            if (frameKey === 'RISING_KICK' || frameKey === 'FOCUS_STRIKE' || frameKey === 'ENERGY_WAVE' || frameKey === 'GROUND_BURST') {
                frameKey = 'SPECIAL';
            } else if (frameKey.startsWith('WALK_')) {
                frameKey = (frameKey === 'WALK_1' || frameKey === 'WALK_2') ? 'WALK_1' : 'WALK_2';
            } else {
                frameKey = 'IDLE';
            }
        }

        const frame = frames[frameKey] || frames.IDLE;
        const img = this.champImages[charId];

        if (img && img.complete && frame) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;

            ctx.translate(anim.offsetX, anim.offsetY);
            ctx.rotate(anim.rotation);
            ctx.scale(anim.scaleX, anim.scaleY);

            // Draw champion cleanly with zero GPU shadow blur overhead
            ctx.drawImage(
                img,
                frame.sx, frame.sy, frame.sw, frame.sh,
                frame.dx, frame.dy, frame.dw, frame.dh
            );

            ctx.restore();
        }
    }

    // =========================================================================
    // DYNAMIC SPECIAL ATTACK ELEMENTAL AURAS
    // =========================================================================
    static drawSpecialAttackFX(ctx, f) {
        if (f.state !== FIGHTER_STATES.ATTACK || !f.currentAttackData) return;
        const atk = f.currentAttackData.type;
        const frame = f.attackFrame || 0;

        if (atk !== ATTACK_TYPES.SPECIAL_1 && atk !== ATTACK_TYPES.SPECIAL_2 && atk !== ATTACK_TYPES.SPECIAL_3 && atk !== ATTACK_TYPES.RISING_KICK) {
            return;
        }

        ctx.save();
        const theme = f.themeColor || '#38bdf8';
        const numRings = 2;
        for (let i = 0; i < numRings; i++) {
            const r = 35 + ((frame * 6 + i * 20) % 50);
            const alpha = Math.max(0, 1 - r / 50);

            // Outer soft glow ring (high performance alpha stroke)
            ctx.strokeStyle = theme;
            ctx.lineWidth = 5;
            ctx.globalAlpha = alpha * 0.35;
            ctx.beginPath();
            ctx.ellipse(20, -75, r * 0.7, r, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Inner crisp ring
            ctx.lineWidth = 2.5;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.ellipse(20, -75, r * 0.7, r, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    // =========================================================================
    // DYNAMIC CINEMATIC ULTIMATE ATTACK VIGNETTE & FOCUS
    // =========================================================================
    static drawUltimateAttackFX(ctx, f) {
        if (ultimateManager.isActive && ultimateManager.attacker === f) return;

        const isUlt = (f.state === FIGHTER_STATES.ATTACK || f.state === FIGHTER_STATES.SUPER_STARTUP) &&
                      f.currentAttackData && f.currentAttackData.type === ATTACK_TYPES.ULTIMATE;
        if (!isUlt) return;

        const timer = f.stateTimer || 0;
        const theme = f.themeColor || '#00e5ff';

        ctx.save();

        // 1. Full-Screen Cinematic Dimming
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.50)';
        ctx.fillRect(-2000, -2000, 4000, 4000);
        ctx.restore();

        // 2. High-Energy Ascension Spiral & Focus Radial Lines
        const numLines = 14;
        ctx.save();
        ctx.strokeStyle = theme;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.5 + Math.sin(timer * 0.2) * 0.3;
        for (let i = 0; i < numLines; i++) {
            const angle = (i / numLines) * Math.PI * 2 + timer * 0.05;
            const r1 = 110;
            const r2 = 360;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * r1, -90 + Math.sin(angle) * r1);
            ctx.lineTo(Math.cos(angle) * r2, -90 + Math.sin(angle) * r2);
            ctx.stroke();
        }
        ctx.restore();

        ctx.restore();
    }
}
