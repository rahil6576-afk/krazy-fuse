// js/graphics/fighterSprites.js - Native 4-Frame Movement Animation Engine & Dynamic Special / Ultimate Attack VFX System

import { FIGHTER_STATES, ATTACK_TYPES } from '../core/constants.js';
import { CHAMPION_SPRITES } from './championSpritesMap.js';

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

export class FighterSpriteRenderer {
    static aaravImg = null;
    static champImages = {};

    static initSprites() {
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
        if (fighter.charId === 'AARAV') {
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
            ctx.shadowBlur = 15;
            ctx.shadowColor = theme;

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
        ctx.shadowBlur = 25;
        ctx.shadowColor = color;
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
    // AARAV RENDERER
    // =========================================================================
    static drawAarav(ctx, f) {
        const anim = this.get4FrameMovementData(f, f.state);
        let frameKey = anim.baseSpriteKey;

        if (frameKey === 'SPECIAL') {
            const atk = f.currentAttackData ? f.currentAttackData.type : null;
            if (atk === ATTACK_TYPES.SPECIAL_2) frameKey = 'ENERGY_WAVE';
            else if (atk === ATTACK_TYPES.SPECIAL_3) frameKey = 'GROUND_BURST';
            else frameKey = 'FOCUS_STRIKE';
        }

        const frame = AARAV_SPRITE_FRAMES[frameKey] || AARAV_SPRITE_FRAMES.IDLE;

        if (this.aaravImg && this.aaravImg.complete) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;

            ctx.translate(anim.offsetX, anim.offsetY);
            ctx.rotate(anim.rotation);
            ctx.scale(anim.scaleX, anim.scaleY);

            if (anim.auraIntensity > 0 || ['FOCUS_STRIKE', 'GROUND_BURST', 'ULTIMATE', 'BLOCK'].includes(frameKey)) {
                ctx.shadowBlur = 16 * Math.max(anim.auraIntensity, 0.6);
                ctx.shadowColor = '#00e5ff';
            }

            ctx.drawImage(
                this.aaravImg,
                frame.sx, frame.sy, frame.sw, frame.sh,
                frame.dx, frame.dy, frame.dw, frame.dh
            );

            ctx.restore();
        }
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

            // Dynamic glow on active elemental actions
            if (anim.auraIntensity > 0 || ['SPECIAL', 'ULTIMATE', 'BLOCK'].includes(frameKey)) {
                ctx.shadowBlur = 18 * Math.max(anim.auraIntensity, 0.7);
                ctx.shadowColor = f.themeColor || '#38bdf8';
            }

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
        ctx.strokeStyle = theme;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 25;
        ctx.shadowColor = theme;

        const numRings = 2;
        for (let i = 0; i < numRings; i++) {
            const r = 35 + ((frame * 6 + i * 20) % 50);
            ctx.beginPath();
            ctx.ellipse(20, -75, r * 0.7, r, 0, 0, Math.PI * 2);
            ctx.globalAlpha = Math.max(0, 1 - r / 50);
            ctx.stroke();
        }

        ctx.restore();
    }

    // =========================================================================
    // DYNAMIC CINEMATIC ULTIMATE ATTACK VIGNETTE & FOCUS
    // =========================================================================
    static drawUltimateAttackFX(ctx, f) {
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
        ctx.shadowBlur = 20;
        ctx.shadowColor = theme;
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
