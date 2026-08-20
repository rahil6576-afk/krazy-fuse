// js/entities/aarav.js - Main Character Definition: AARAV (The Balanced Fighter)

import { ATTACK_TYPES, HIT_LEVELS } from '../core/constants.js';

export const AARAV_CONFIG = {
    id: 'AARAV',
    name: 'AARAV',
    title: 'THE BALANCED FIGHTER',
    role: 'All-Rounder / Beginner Friendly',
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
    // Character Physics
    walkSpeedFwd: 4.8,
    walkSpeedBwd: 3.6,
    dashSpeed: 11.5,
    dashDuration: 14,
    jumpForce: 15.5,
    gravity: 0.72,
    weight: 1.0,

    // Attacks & Frame Data matching the Sprite Sheet
    attacks: {
        // --- LIGHT ATTACK (Quick straight punch with energy burst) ---
        [ATTACK_TYPES.LIGHT_PUNCH]: {
            type: ATTACK_TYPES.LIGHT_PUNCH,
            name: 'Light Punch (Energy Jab)',
            startup: 4,
            active: 3,
            recovery: 7,
            damage: 35,
            hitstun: 14,
            blockstun: 10,
            hitLevel: HIT_LEVELS.HIGH,
            pushback: 3,
            superGain: 5,
            hitbox: { offsetX: 35, offsetY: -95, width: 45, height: 28 },
            cancelsTo: [ATTACK_TYPES.LIGHT_PUNCH, ATTACK_TYPES.HEAVY_PUNCH, ATTACK_TYPES.LIGHT_KICK, ATTACK_TYPES.HEAVY_KICK, ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.SPECIAL_3, ATTACK_TYPES.RISING_KICK, ATTACK_TYPES.ULTIMATE]
        },

        // --- HEAVY ATTACK (Lunging heavy punch with energy slash arc) ---
        [ATTACK_TYPES.HEAVY_PUNCH]: {
            type: ATTACK_TYPES.HEAVY_PUNCH,
            name: 'Heavy Attack (Focus Straight)',
            startup: 8,
            active: 4,
            recovery: 14,
            damage: 78,
            hitstun: 22,
            blockstun: 15,
            hitLevel: HIT_LEVELS.MID,
            pushback: 7,
            launchY: -5,
            superGain: 8,
            hitbox: { offsetX: 42, offsetY: -95, width: 62, height: 35 },
            cancelsTo: [ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.SPECIAL_3, ATTACK_TYPES.RISING_KICK, ATTACK_TYPES.ULTIMATE]
        },

        // --- LIGHT KICK (Low snap kick) ---
        [ATTACK_TYPES.LIGHT_KICK]: {
            type: ATTACK_TYPES.LIGHT_KICK,
            name: 'Light Kick',
            startup: 5,
            active: 3,
            recovery: 8,
            damage: 38,
            hitstun: 15,
            blockstun: 11,
            hitLevel: HIT_LEVELS.LOW,
            pushback: 4,
            superGain: 5,
            hitbox: { offsetX: 40, offsetY: -45, width: 45, height: 26 },
            cancelsTo: [ATTACK_TYPES.HEAVY_KICK, ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.SPECIAL_3, ATTACK_TYPES.RISING_KICK, ATTACK_TYPES.ULTIMATE]
        },

        // --- HEAVY KICK (Roundhouse Launcher) ---
        [ATTACK_TYPES.HEAVY_KICK]: {
            type: ATTACK_TYPES.HEAVY_KICK,
            name: 'Heavy Kick (Launcher)',
            startup: 10,
            active: 5,
            recovery: 15,
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
            startup: 6,
            active: 5,
            recovery: 12,
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

        // --- RISING KICK (Upward diagonal anti-air kick with crescent trail) ---
        [ATTACK_TYPES.RISING_KICK]: {
            type: ATTACK_TYPES.RISING_KICK,
            name: 'Rising Kick (Anti-Air)',
            command: '↓ ↙ ← + Kick',
            startup: 5,
            active: 8,
            recovery: 19,
            damage: 95,
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

        // --- SPECIAL 1: FOCUS STRIKE (Charged energy punch with radiant sparks) ---
        [ATTACK_TYPES.SPECIAL_1]: {
            type: ATTACK_TYPES.SPECIAL_1,
            name: 'Focus Strike',
            command: '→ → + Punch / Special',
            startup: 9,
            active: 4,
            recovery: 15,
            damage: 110,
            hitstun: 28,
            blockstun: 18,
            hitLevel: HIT_LEVELS.MID,
            pushback: 12,
            launchX: 9,
            armor: 1,
            energyCost: 25,
            superGain: 12,
            hitbox: { offsetX: 48, offsetY: -90, width: 62, height: 40 },
            cancelsTo: [ATTACK_TYPES.ULTIMATE]
        },

        // --- SPECIAL 2: ENERGY WAVE (Thrusting forward blue crescent projectile) ---
        [ATTACK_TYPES.SPECIAL_2]: {
            type: ATTACK_TYPES.SPECIAL_2,
            name: 'Energy Wave',
            command: '↓ ↘ → + Kick',
            startup: 10,
            active: 3,
            recovery: 16,
            damage: 88,
            hitstun: 22,
            blockstun: 16,
            hitLevel: HIT_LEVELS.HIGH,
            isProjectile: true,
            projType: 'ENERGY_WAVE',
            projSpeed: 15,
            energyCost: 25,
            superGain: 10,
            hitbox: { offsetX: 40, offsetY: -85, width: 32, height: 32 },
            cancelsTo: [ATTACK_TYPES.ULTIMATE]
        },

        // --- SPECIAL 3: GROUND BURST (Ground punch with expanding blue energy ring) ---
        [ATTACK_TYPES.SPECIAL_3]: {
            type: ATTACK_TYPES.SPECIAL_3,
            name: 'Ground Burst',
            command: '↓ ↙ ← + Punch',
            startup: 11,
            active: 7,
            recovery: 18,
            damage: 96,
            hitstun: 26,
            blockstun: 17,
            hitLevel: HIT_LEVELS.LOW,
            pushback: 10,
            energyCost: 30,
            superGain: 12,
            hitbox: { offsetX: -10, offsetY: -40, width: 130, height: 45 },
            cancelsTo: [ATTACK_TYPES.ULTIMATE]
        },

        // --- ULTIMATE: FOCUS BURST (Massive full-screen horizontal energy beam) ---
        [ATTACK_TYPES.ULTIMATE]: {
            type: ATTACK_TYPES.ULTIMATE,
            name: 'ULTIMATE: Focus Burst',
            command: '↓ ↘ → + Punch / Ultimate (Full Meter)',
            startup: 8,
            active: 22,
            recovery: 32,
            damage: 295,
            hitstun: 55,
            blockstun: 25,
            hitLevel: HIT_LEVELS.MID,
            pushback: 20,
            launchY: -16,
            launchX: 15,
            superCost: 100,
            isCinematicSuper: true,
            hitbox: { offsetX: 30, offsetY: -120, width: 680, height: 140 }
        }
    }
};
