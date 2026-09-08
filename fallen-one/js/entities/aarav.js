// js/entities/aarav.js - Main Character Definition: AARAV (The Balanced Fighter)
// Full 19-Move Rigging, Animation, Frame Data & Easing Specification

import { ATTACK_TYPES, HIT_LEVELS } from '../core/constants.js';

export const AARAV_ANIMATION_DATA = {
    // 1. AARAV_IDLE (48f / 800ms)
    IDLE: {
        totalFrames: 48,
        durationMs: 800,
        phases: [
            { name: 'breatheRise', frames: 24, durationMs: 400, easing: 'easeInOut' },
            { name: 'breatheFall', frames: 24, durationMs: 400, easing: 'easeInOut' }
        ],
        gauntletPulse: { frames: 60, durationMs: 1000, easing: 'easeInOut' },
        loop: true,
        cancellableAt: 0
    },

    // 2-5. AARAV_WALK (32f total / 533ms)
    WALK_1: {
        name: 'WALK_1 (Contact)',
        totalFrames: 8,
        durationMs: 133,
        phases: [
            { name: 'footStrike', frames: 4, durationMs: 67, easing: 'easeOut' },
            { name: 'weightSettle', frames: 4, durationMs: 67, easing: 'easeInOut' }
        ],
        cancellableAt: 5
    },
    WALK_2: {
        name: 'WALK_2 (Passing)',
        totalFrames: 8,
        durationMs: 133,
        phases: [
            { name: 'hipRise', frames: 4, durationMs: 67, easing: 'easeInOut' },
            { name: 'passThrough', frames: 4, durationMs: 67, easing: 'linear' }
        ],
        cancellableAt: 4
    },
    WALK_3: {
        name: 'WALK_3 (Contact Mirror)',
        totalFrames: 8,
        durationMs: 133,
        phases: [
            { name: 'footStrike', frames: 4, durationMs: 67, easing: 'easeOut' },
            { name: 'weightSettle', frames: 4, durationMs: 67, easing: 'easeInOut' }
        ],
        cancellableAt: 5
    },
    WALK_4: {
        name: 'WALK_4 (Extension)',
        totalFrames: 8,
        durationMs: 133,
        phases: [
            { name: 'fullStride', frames: 5, durationMs: 83, easing: 'linear' },
            { name: 'pushOff', frames: 3, durationMs: 50, easing: 'easeIn' }
        ],
        cancellableAt: 5
    },

    // 6. AARAV_JUMP (40f / 667ms)
    JUMP: {
        totalFrames: 40,
        durationMs: 667,
        phases: [
            { name: 'startupCrouch', frames: 4, durationMs: 67, easing: 'easeIn' },
            { name: 'squash', frames: 2, durationMs: 33, easing: 'easeOut' },
            { name: 'ascentStretch', frames: 10, durationMs: 167, easing: 'easeOut' },
            { name: 'peakHang', frames: 6, durationMs: 100, easing: 'linear' },
            { name: 'descent', frames: 10, durationMs: 167, easing: 'easeIn' },
            { name: 'landingSquash', frames: 3, durationMs: 50, easing: 'easeOut' },
            { name: 'recovery', frames: 5, durationMs: 83, easing: 'easeInOut' }
        ],
        activeWindow: [7, 36],
        cancellableAt: 30
    },

    // 7. AARAV_CROUCH (32f / 533ms)
    CROUCH: {
        totalFrames: 32,
        durationMs: 533,
        phases: [
            { name: 'startup', frames: 3, durationMs: 50, easing: 'easeIn' },
            { name: 'hold', frames: 24, durationMs: 400, easing: 'linear' },
            { name: 'riseRecovery', frames: 5, durationMs: 83, easing: 'easeOut' }
        ],
        cancellableFromHold: true,
        cancellableOnRiseAt: 28
    },

    // 8. AARAV_BLOCK (44f / 733ms)
    BLOCK: {
        totalFrames: 44,
        durationMs: 733,
        phases: [
            { name: 'shieldRaise', frames: 5, durationMs: 83, easing: 'easeOut' },
            { name: 'shieldPulseIn', frames: 3, durationMs: 50, easing: 'easeOutOvershoot' },
            { name: 'hold', frames: 30, durationMs: 500, easing: 'linear' },
            { name: 'shieldLower', frames: 6, durationMs: 100, easing: 'easeInOut' }
        ],
        absorbWindow: [6, 40],
        cancellableAt: 38
    },

    // 9. AARAV_LIGHT_ATTACK (15f / 250ms)
    LIGHT_ATTACK: {
        totalFrames: 15,
        durationMs: 250,
        phases: [
            { name: 'startup', frames: 3, durationMs: 50, easing: 'easeIn' },
            { name: 'active', frames: 4, durationMs: 67, easing: 'linear' },
            { name: 'energyFlash', frames: 2, durationMs: 33, easing: 'easeOut' },
            { name: 'recovery', frames: 6, durationMs: 100, easing: 'easeOut' }
        ],
        cancellableAt: 10,
        frameAdvantageOnBlock: 4
    },

    // 10. AARAV_HEAVY_ATTACK (38f / 633ms)
    HEAVY_ATTACK: {
        totalFrames: 38,
        durationMs: 633,
        phases: [
            { name: 'windup', frames: 12, durationMs: 200, easing: 'easeIn' },
            { name: 'bodyRotation', frames: 6, durationMs: 100, easing: 'easeIn' },
            { name: 'activeWave', frames: 6, durationMs: 100, easing: 'linear' },
            { name: 'recovery', frames: 14, durationMs: 233, easing: 'easeOut' }
        ],
        waveActiveFrames: 20,
        waveDurationMs: 333,
        waveEasing: 'linear',
        cancellableAt: 30,
        frameAdvantageOnBlock: 8
    },

    // 11. AARAV_RISING_KICK (36f / 600ms)
    RISING_KICK: {
        totalFrames: 36,
        durationMs: 600,
        phases: [
            { name: 'startup', frames: 5, durationMs: 83, easing: 'easeIn' },
            { name: 'risingArc', frames: 8, durationMs: 133, easing: 'easeOut' },
            { name: 'peakHold', frames: 2, durationMs: 33, easing: 'linear' },
            { name: 'activeHitbox', frames: 6, durationMs: 100, easing: 'linear' },
            { name: 'descent', frames: 8, durationMs: 133, easing: 'easeIn' },
            { name: 'landingRecovery', frames: 7, durationMs: 117, easing: 'easeOut' }
        ],
        antiAirActiveWindow: [7, 18],
        cancellableAt: 28
    },

    // 12. AARAV_DASH (17f / 283ms)
    DASH: {
        totalFrames: 17,
        durationMs: 283,
        phases: [
            { name: 'launchBurst', frames: 2, durationMs: 33, easing: 'easeInSharp' },
            { name: 'stretchTravel', frames: 8, durationMs: 133, easing: 'linear' },
            { name: 'deceleration', frames: 4, durationMs: 67, easing: 'easeOut' },
            { name: 'snapNeutral', frames: 3, durationMs: 50, easing: 'easeOut' }
        ],
        invincibleFrames: [1, 6],
        motionBlurFrames: [3, 10],
        cancellableAt: 12
    },

    // 13. AARAV_ENERGY_WAVE (53f / 883ms)
    ENERGY_WAVE: {
        totalFrames: 53,
        durationMs: 883,
        phases: [
            { name: 'stanceWiden', frames: 4, durationMs: 67, easing: 'easeInOut' },
            { name: 'chargeOrbGrow', frames: 10, durationMs: 167, easing: 'easeIn' },
            { name: 'releaseFlash', frames: 2, durationMs: 33, easing: 'linear' },
            { name: 'waveTravel', frames: 24, durationMs: 400, easing: 'easeOut' },
            { name: 'recoil', frames: 5, durationMs: 83, easing: 'easeOut' },
            { name: 'recovery', frames: 8, durationMs: 133, easing: 'easeInOut' }
        ],
        projectileActiveFrames: 24,
        cancellableAt: 42
    },

    // 14. AARAV_FOCUS_STRIKE (22f / 367ms)
    FOCUS_STRIKE: {
        totalFrames: 22,
        durationMs: 367,
        phases: [
            { name: 'chargeFreeze', frames: 4, durationMs: 67, easing: 'linear' },
            { name: 'energyConcentrate', frames: 4, durationMs: 67, easing: 'easeIn' },
            { name: 'strikeRelease', frames: 3, durationMs: 50, easing: 'easeInSharp' },
            { name: 'impactFlash', frames: 3, durationMs: 50, easing: 'easeOut' },
            { name: 'recovery', frames: 8, durationMs: 133, easing: 'easeOut' }
        ],
        pointBlankActive: [9, 14],
        cancellableAt: 16
    },

    // 15. AARAV_GROUND_BURST (48f / 800ms)
    GROUND_BURST: {
        totalFrames: 48,
        durationMs: 800,
        phases: [
            { name: 'leapWindup', frames: 6, durationMs: 100, easing: 'easeIn' },
            { name: 'slamContact', frames: 2, durationMs: 33, easing: 'linear' },
            { name: 'screenShake', frames: 4, durationMs: 67, easing: 'linear' },
            { name: 'burstEruption', frames: 10, durationMs: 167, easing: 'easeOut' },
            { name: 'debrisArcFall', frames: 16, durationMs: 267, easing: 'easeInGravity' },
            { name: 'recovery', frames: 10, durationMs: 167, easing: 'easeOut' }
        ],
        burstActiveRadius: [9, 22],
        cancellableAt: 38
    },

    // 16. AARAV_ULTIMATE_FOCUS_BURST (103f / 1717ms)
    ULTIMATE_FOCUS_BURST: {
        totalFrames: 103,
        durationMs: 1717,
        phases: [
            { name: 'wideStance', frames: 6, durationMs: 100, easing: 'easeInOut' },
            { name: 'fullChargeGlow', frames: 18, durationMs: 300, easing: 'easeIn' },
            { name: 'screenFlash', frames: 3, durationMs: 50, easing: 'linear' },
            { name: 'beamRelease', frames: 6, durationMs: 100, easing: 'easeInSharp' },
            { name: 'beamTravel', frames: 36, durationMs: 600, easing: 'linear' },
            { name: 'beamExpand', frames: 12, durationMs: 200, easing: 'easeOut' },
            { name: 'fullRecoil', frames: 8, durationMs: 133, easing: 'easeOut' },
            { name: 'recovery', frames: 14, durationMs: 233, easing: 'easeInOut' }
        ],
        beamActiveWindow: [28, 75],
        cancellableAt: 88
    },

    // 17. AARAV_WIN_POSE (49f + loop / 817ms)
    WIN_POSE: {
        totalBeforeLoop: 49,
        durationMs: 817,
        phases: [
            { name: 'stepForward', frames: 5, durationMs: 83, easing: 'easeOut' },
            { name: 'fistRaise', frames: 8, durationMs: 133, easing: 'easeOutOvershoot' },
            { name: 'victoryHold', frames: 36, durationMs: 600, easing: 'linear' }
        ],
        gauntletPulse: [14, 28],
        loopFrames: 48,
        loopDurationMs: 800,
        loopEasing: 'easeInOut'
    },

    // 18. AARAV_KO (56f + loop / 933ms)
    KO: {
        totalToSettle: 56,
        durationMs: 933,
        phases: [
            { name: 'kneeBuckle', frames: 8, durationMs: 133, easing: 'easeIn' },
            { name: 'torsoDrop', frames: 8, durationMs: 133, easing: 'easeIn' },
            { name: 'fullCollapse', frames: 10, durationMs: 167, easing: 'easeInGravity' },
            { name: 'groundBounce', frames: 4, durationMs: 67, easing: 'easeOut' },
            { name: 'settleStill', frames: 6, durationMs: 100, easing: 'easeOut' }
        ],
        dustPuff: [27, 32],
        loopStartFrame: 37,
        breathingLoopFrames: 40,
        breathingDurationMs: 667,
        energyFadeFrames: 20,
        energyFadeDurationMs: 333
    },

    // 19. AARAV_PORTRAIT (HUD) (195f loop / 3250ms)
    PORTRAIT_HUD: {
        totalFrames: 195,
        durationMs: 3250,
        headBob: { frames: 12, durationMs: 200, easing: 'easeInOut' },
        blink: { frames: 3, durationMs: 50, easing: 'easeInOut' },
        blinkInterval: 180,
        blinkIntervalMs: 3000,
        damageFlash: { frames: 6, durationMs: 100, easing: 'easeOut' }
    }
};

export const AARAV_CONFIG = {
    id: 'AARAV',
    name: 'AARAV',
    title: 'THE BALANCED FIGHTER',
    role: 'All-Rounder / Precision Striker',
    difficulty: 'Easy / Medium',
    portrait: 'assets/characters/aarav_preview.jpg',
    previewImage: 'assets/characters/aarav_preview.jpg',
    themeColor: '#00e5ff',
    textColor: '#38bdf8',
    stats: {
        health: 1000,
        attack: 80,
        defense: 75,
        speed: 80,
        range: 70,
        energy: 85
    },
    // Character Physics calibrated to 60fps specification
    walkSpeedFwd: 4.8,
    walkSpeedBwd: 3.6,
    dashSpeed: 11.5,
    dashDuration: 17, // 17f total (2f launch burst, 8f stretch travel, 4f deceleration, 3f snap neutral)
    dashCancelFrame: 12,
    dashInvincibleFrames: [1, 6],
    dashMotionBlurFrames: [3, 10],
    jumpForce: 15.5,
    jumpTotalFrames: 40,
    jumpActiveFrames: [7, 36],
    jumpCancelFrame: 30,
    gravity: 0.72,
    weight: 1.0,

    // Full Animation Spec Attachment
    animData: AARAV_ANIMATION_DATA,

    // Attacks & Frame Data matching the 19-Move specification
    attacks: {
        // --- 9. AARAV_LIGHT_ATTACK (Light Punch: 15f total / 250ms) ---
        [ATTACK_TYPES.LIGHT_PUNCH]: {
            type: ATTACK_TYPES.LIGHT_PUNCH,
            name: 'Light Punch (Energy Jab)',
            startup: 3,         // 3f startup
            active: 4,          // 4f active hitbox
            energyFlash: 2,     // 2f energy burst flash
            recovery: 6,        // 6f recovery (Total = 15f)
            totalFrames: 15,
            cancelFrame: 10,    // Earliest cancel at frame 10
            damage: 35,
            hitstun: 14,
            blockstun: 10,      // Hit advantage on block: +4f (10 - 6 = +4)
            frameAdvantage: 4,
            hitLevel: HIT_LEVELS.HIGH,
            pushback: 3,
            superGain: 5,
            hitbox: { offsetX: 35, offsetY: -95, width: 45, height: 28 },
            cancelsTo: [ATTACK_TYPES.LIGHT_PUNCH, ATTACK_TYPES.HEAVY_PUNCH, ATTACK_TYPES.LIGHT_KICK, ATTACK_TYPES.HEAVY_KICK, ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.SPECIAL_3, ATTACK_TYPES.RISING_KICK, ATTACK_TYPES.ULTIMATE]
        },

        // --- 10. AARAV_HEAVY_ATTACK (Heavy Punch: 38f total / 633ms + 20f Crescent Wave) ---
        [ATTACK_TYPES.HEAVY_PUNCH]: {
            type: ATTACK_TYPES.HEAVY_PUNCH,
            name: 'Heavy Attack (Focus Straight & Wave)',
            startup: 18,        // 12f windup + 6f body rotation = 18f
            active: 6,          // 6f active crescent wave swing
            recovery: 14,       // 14f recovery (Total = 38f)
            totalFrames: 38,
            cancelFrame: 30,    // Earliest cancel at frame 30
            waveTravelFrames: 20, // Crescent wave travels 20f independently on screen
            spawnsHeavyWave: true,
            damage: 82,
            hitstun: 22,
            blockstun: 22,      // Hit advantage on block: +8f (22 - 14 = +8)
            frameAdvantage: 8,
            hitLevel: HIT_LEVELS.MID,
            pushback: 7,
            launchY: -5,
            superGain: 8,
            hitbox: { offsetX: 42, offsetY: -95, width: 65, height: 38 },
            cancelsTo: [ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.SPECIAL_3, ATTACK_TYPES.RISING_KICK, ATTACK_TYPES.ULTIMATE]
        },

        // --- LIGHT KICK (Low snap kick: standard chainable filler) ---
        [ATTACK_TYPES.LIGHT_KICK]: {
            type: ATTACK_TYPES.LIGHT_KICK,
            name: 'Light Kick',
            startup: 4,
            active: 4,
            recovery: 7,
            totalFrames: 15,
            cancelFrame: 10,
            damage: 38,
            hitstun: 15,
            blockstun: 11,
            hitLevel: HIT_LEVELS.LOW,
            pushback: 4,
            superGain: 5,
            hitbox: { offsetX: 40, offsetY: -45, width: 45, height: 26 },
            cancelsTo: [ATTACK_TYPES.HEAVY_KICK, ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.SPECIAL_3, ATTACK_TYPES.RISING_KICK, ATTACK_TYPES.ULTIMATE]
        },

        // --- HEAVY KICK (Launcher) ---
        [ATTACK_TYPES.HEAVY_KICK]: {
            type: ATTACK_TYPES.HEAVY_KICK,
            name: 'Heavy Kick (Launcher)',
            startup: 10,
            active: 5,
            recovery: 15,
            totalFrames: 30,
            cancelFrame: 22,
            damage: 85,
            hitstun: 25,
            blockstun: 14,
            hitLevel: HIT_LEVELS.HIGH,
            pushback: 8,
            launchY: -11,
            launchX: 6,
            superGain: 10,
            hitbox: { offsetX: 45, offsetY: -90, width: 60, height: 35 },
            cancelsTo: [ATTACK_TYPES.RISING_KICK, ATTACK_TYPES.ULTIMATE]
        },

        // --- DASH STRIKE ---
        [ATTACK_TYPES.DASH_STRIKE]: {
            type: ATTACK_TYPES.DASH_STRIKE,
            name: 'Dash Strike',
            startup: 5,
            active: 5,
            recovery: 10,
            totalFrames: 20,
            cancelFrame: 14,
            damage: 65,
            hitstun: 20,
            blockstun: 13,
            hitLevel: HIT_LEVELS.MID,
            pushback: 8,
            forwardImpulse: 10,
            superGain: 8,
            hitbox: { offsetX: 45, offsetY: -85, width: 55, height: 32 },
            cancelsTo: [ATTACK_TYPES.ULTIMATE]
        },

        // --- 11. AARAV_RISING_KICK (36f total / 600ms) ---
        [ATTACK_TYPES.RISING_KICK]: {
            type: ATTACK_TYPES.RISING_KICK,
            name: 'Rising Kick (Anti-Air)',
            command: '↓ ↙ ← + Kick / Down + Heavy Kick',
            startup: 5,         // 5f startup
            risingArc: 8,       // 8f rising arc
            peakHold: 2,        // 2f peak hold
            active: 6,          // 6f active hitbox (anti-air active window: frames 7-18)
            antiAirActive: [7, 18],
            descent: 8,         // 8f descent
            recovery: 7,        // 7f landing recovery (Total = 36f)
            totalFrames: 36,
            cancelFrame: 28,    // Earliest cancel at frame 28
            damage: 98,
            hitstun: 30,
            blockstun: 12,
            hitLevel: HIT_LEVELS.HIGH,
            launchY: -15,
            launchX: 4,
            invincibleStartup: true,
            energyCost: 25,
            superGain: 12,
            hitbox: { offsetX: 25, offsetY: -125, width: 55, height: 80 },
            cancelsTo: [ATTACK_TYPES.ULTIMATE]
        },

        // --- 14. AARAV_FOCUS_STRIKE (22f total / 367ms) ---
        [ATTACK_TYPES.SPECIAL_1]: {
            type: ATTACK_TYPES.SPECIAL_1,
            name: 'Focus Strike',
            command: '→ → + Punch / Special',
            startup: 8,         // 4f charge freeze + 4f energy concentrate = 8f
            strikeRelease: 3,
            impactFlash: 3,
            active: 6,          // Active point-blank frames: 9–14
            activeWindow: [9, 14],
            recovery: 8,        // 8f recovery (Total = 22f)
            totalFrames: 22,
            cancelFrame: 16,    // Earliest cancel at frame 16
            damage: 110,
            hitstun: 28,
            blockstun: 18,
            hitLevel: HIT_LEVELS.MID,
            pushback: 12,
            launchX: 9,
            armor: 1,
            energyCost: 25,
            superGain: 12,
            hitbox: { offsetX: 48, offsetY: -90, width: 65, height: 40 },
            cancelsTo: [ATTACK_TYPES.ULTIMATE]
        },

        // --- 13. AARAV_ENERGY_WAVE (53f total / 883ms) ---
        [ATTACK_TYPES.SPECIAL_2]: {
            type: ATTACK_TYPES.SPECIAL_2,
            name: 'Energy Wave',
            command: '↓ ↘ → + Kick / Down + Light Kick',
            startup: 16,        // 4f stance widen + 10f charge orb + 2f release flash = 16f
            projLifetime: 24,   // Wave expand/travel: 24f on screen (independent)
            recoil: 5,          // 5f recoil
            recovery: 8,        // 8f recovery (Total = 53f)
            totalFrames: 53,
            cancelFrame: 42,    // Earliest cancel at frame 42
            damage: 88,
            hitstun: 22,
            blockstun: 16,
            hitLevel: HIT_LEVELS.HIGH,
            isProjectile: true,
            projType: 'ENERGY_WAVE',
            projSpeed: 16,
            energyCost: 25,
            superGain: 10,
            hitbox: { offsetX: 40, offsetY: -85, width: 34, height: 34 },
            cancelsTo: [ATTACK_TYPES.ULTIMATE]
        },

        // --- 15. AARAV_GROUND_BURST (48f total / 800ms) ---
        [ATTACK_TYPES.SPECIAL_3]: {
            type: ATTACK_TYPES.SPECIAL_3,
            name: 'Ground Burst',
            command: '↓ ↙ ← + Punch / Down + Special',
            startup: 8,         // 6f leap/windup + 2f slam contact = 8f
            screenShakeFrames: 4,
            burstEruption: 10,
            active: 14,         // Active burst radius: frames 9–22
            activeWindow: [9, 22],
            debrisArcFrames: 16,
            recovery: 10,       // 10f recovery (Total = 48f)
            totalFrames: 48,
            cancelFrame: 38,    // Earliest cancel at frame 38
            damage: 100,
            hitstun: 26,
            blockstun: 17,
            hitLevel: HIT_LEVELS.LOW,
            pushback: 10,
            energyCost: 30,
            superGain: 12,
            hitbox: { offsetX: -10, offsetY: -40, width: 140, height: 48 },
            cancelsTo: [ATTACK_TYPES.ULTIMATE]
        },

        // --- 16. AARAV_ULTIMATE_FOCUS_BURST (103f total / 1717ms) ---
        [ATTACK_TYPES.ULTIMATE]: {
            type: ATTACK_TYPES.ULTIMATE,
            name: 'ULTIMATE: Focus Burst',
            command: '↓ ↘ → + Punch / Ultimate (Full Meter)',
            startup: 27,        // 6f wide stance + 18f full charge glow + 3f screen flash = 27f
            beamRelease: 6,
            beamTravel: 36,
            beamExpand: 12,
            active: 48,         // Beam active window: frames 28–75 (48 frames total)
            activeWindow: [28, 75],
            fullRecoil: 8,
            recovery: 14,       // 14f recovery (Total = 103f)
            totalFrames: 103,
            cancelFrame: 88,    // Earliest cancel at frame 88 (longest active move)
            damage: 320,
            hitstun: 55,
            blockstun: 25,
            hitLevel: HIT_LEVELS.MID,
            pushback: 22,
            launchY: -16,
            launchX: 16,
            superCost: 100,
            isCinematicSuper: true,
            hitbox: { offsetX: 30, offsetY: -120, width: 720, height: 150 }
        }
    }
};
