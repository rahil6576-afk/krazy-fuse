// js/entities/roster.js - Full 6-Character Fighter Roster Definitions

import { AARAV_CONFIG } from './aarav.js';
import { ATTACK_TYPES, HIT_LEVELS } from '../core/constants.js';

export const ROSTER = [
    AARAV_CONFIG,
    {
        id: 'SOLAR',
        name: 'SOLAR',
        title: 'THE MAGMA JUGGERNAUT',
        role: 'Tank / Heavyweight',
        difficulty: 'Easy',
        portrait: 'assets/characters/solar_preview.jpg',
        previewImage: 'assets/characters/solar_preview.jpg',
        themeColor: '#ea580c',
        textColor: '#f97316',
        stats: {
            health: 1200,
            attack: 95,
            defense: 90,
            speed: 60,
            range: 65,
            energy: 70
        },
        walkSpeedFwd: 3.8,
        walkSpeedBwd: 2.8,
        dashSpeed: 8.5,
        dashDuration: 12,
        jumpForce: 13.8,
        gravity: 0.85,
        weight: 1.3,
        attacks: {
            [ATTACK_TYPES.LIGHT_PUNCH]: {
                type: ATTACK_TYPES.LIGHT_PUNCH,
                name: 'Heavy Jab',
                startup: 6, active: 4, recovery: 9,
                damage: 42, hitstun: 16, blockstun: 12,
                hitLevel: HIT_LEVELS.HIGH, pushback: 4, superGain: 5,
                hitbox: { offsetX: 35, offsetY: -95, width: 45, height: 30 },
                cancelsTo: [ATTACK_TYPES.HEAVY_PUNCH, ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.HEAVY_PUNCH]: {
                type: ATTACK_TYPES.HEAVY_PUNCH,
                name: 'Flame Punch',
                startup: 12, active: 5, recovery: 18,
                damage: 95, hitstun: 26, blockstun: 18,
                hitLevel: HIT_LEVELS.MID, pushback: 9, launchY: -6, superGain: 10,
                hitbox: { offsetX: 42, offsetY: -95, width: 62, height: 40 },
                cancelsTo: [ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.LIGHT_KICK]: {
                type: ATTACK_TYPES.LIGHT_KICK,
                name: 'Low Stomp',
                startup: 7, active: 3, recovery: 10,
                damage: 45, hitstun: 16, blockstun: 11,
                hitLevel: HIT_LEVELS.LOW, pushback: 5, superGain: 6,
                hitbox: { offsetX: 38, offsetY: -40, width: 46, height: 28 },
                cancelsTo: [ATTACK_TYPES.HEAVY_KICK, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.HEAVY_KICK]: {
                type: ATTACK_TYPES.HEAVY_KICK,
                name: 'Ground Smash',
                startup: 14, active: 6, recovery: 20,
                damage: 110, hitstun: 28, blockstun: 16,
                hitLevel: HIT_LEVELS.LOW, pushback: 10, launchY: -12, superGain: 12,
                hitbox: { offsetX: 40, offsetY: -50, width: 68, height: 45 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.SPECIAL_1]: {
                type: ATTACK_TYPES.SPECIAL_1,
                name: 'Charging Strike',
                command: '→ → + Punch / Special',
                startup: 14, active: 6, recovery: 18,
                damage: 120, hitstun: 30, blockstun: 20,
                hitLevel: HIT_LEVELS.MID, pushback: 14, forwardImpulse: 10, armor: 2, energyCost: 30, superGain: 14,
                hitbox: { offsetX: 50, offsetY: -95, width: 65, height: 45 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.SPECIAL_2]: {
                type: ATTACK_TYPES.SPECIAL_2,
                name: 'Earthquake',
                command: '↓ ↘ → + Kick',
                startup: 15, active: 8, recovery: 22,
                damage: 100, hitstun: 26, blockstun: 18,
                hitLevel: HIT_LEVELS.LOW, pushback: 12, energyCost: 35, superGain: 12,
                hitbox: { offsetX: 30, offsetY: -35, width: 120, height: 35 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.RISING_KICK]: {
                type: ATTACK_TYPES.RISING_KICK,
                name: 'Magma Uppercut',
                command: '↓ ↙ ← + Punch',
                startup: 8, active: 7, recovery: 22,
                damage: 105, hitstun: 32, blockstun: 14,
                hitLevel: HIT_LEVELS.HIGH, launchY: -16, launchX: 3, energyCost: 25, superGain: 12,
                hitbox: { offsetX: 25, offsetY: -125, width: 55, height: 80 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.ULTIMATE]: {
                type: ATTACK_TYPES.ULTIMATE,
                name: 'ULTIMATE: Meteor Crash',
                command: '↓ ↘ → + Punch / Super',
                startup: 10, active: 18, recovery: 36,
                damage: 310, hitstun: 55, blockstun: 28,
                hitLevel: HIT_LEVELS.MID, pushback: 20, launchY: -18, launchX: 16, superCost: 100, isCinematicSuper: true,
                hitbox: { offsetX: 30, offsetY: -85, width: 150, height: 130 }
            }
        }
    },
    {
        id: 'FROST',
        name: 'FROST',
        title: 'THE CRYO ARCHITECT',
        role: 'Ranged / Control',
        difficulty: 'Medium',
        portrait: 'assets/characters/frost_preview.jpg',
        previewImage: 'assets/characters/frost_preview.jpg',
        themeColor: '#38bdf8',
        textColor: '#7dd3fc',
        stats: {
            health: 950,
            attack: 75,
            defense: 70,
            speed: 85,
            range: 95,
            energy: 90
        },
        walkSpeedFwd: 4.6,
        walkSpeedBwd: 3.8,
        dashSpeed: 12.0,
        dashDuration: 13,
        jumpForce: 15.0,
        gravity: 0.70,
        weight: 0.95,
        attacks: {
            [ATTACK_TYPES.LIGHT_PUNCH]: {
                type: ATTACK_TYPES.LIGHT_PUNCH,
                name: 'Ice Jab',
                startup: 4, active: 3, recovery: 7,
                damage: 30, hitstun: 14, blockstun: 10,
                hitLevel: HIT_LEVELS.HIGH, pushback: 3, superGain: 4,
                hitbox: { offsetX: 35, offsetY: -95, width: 40, height: 24 },
                cancelsTo: [ATTACK_TYPES.HEAVY_PUNCH, ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.HEAVY_PUNCH]: {
                type: ATTACK_TYPES.HEAVY_PUNCH,
                name: 'Glacial Blade',
                startup: 8, active: 4, recovery: 13,
                damage: 70, hitstun: 20, blockstun: 14,
                hitLevel: HIT_LEVELS.MID, pushback: 6, superGain: 8,
                hitbox: { offsetX: 45, offsetY: -95, width: 56, height: 30 },
                cancelsTo: [ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.LIGHT_KICK]: {
                type: ATTACK_TYPES.LIGHT_KICK,
                name: 'Frost Sweep',
                startup: 5, active: 3, recovery: 8,
                damage: 35, hitstun: 15, blockstun: 10,
                hitLevel: HIT_LEVELS.LOW, pushback: 4, superGain: 5,
                hitbox: { offsetX: 40, offsetY: -45, width: 44, height: 24 },
                cancelsTo: [ATTACK_TYPES.HEAVY_KICK, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.HEAVY_KICK]: {
                type: ATTACK_TYPES.HEAVY_KICK,
                name: 'Ice Spike Kick',
                startup: 10, active: 4, recovery: 15,
                damage: 80, hitstun: 22, blockstun: 13,
                hitLevel: HIT_LEVELS.HIGH, pushback: 8, launchY: -10, superGain: 9,
                hitbox: { offsetX: 48, offsetY: -85, width: 55, height: 35 },
                cancelsTo: [ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.SPECIAL_1]: {
                type: ATTACK_TYPES.SPECIAL_1,
                name: 'Freeze Strike',
                command: '→ → + Punch / Special',
                startup: 9, active: 5, recovery: 15,
                damage: 90, hitstun: 35, blockstun: 16,
                hitLevel: HIT_LEVELS.MID, pushback: 6, energyCost: 25, superGain: 10,
                hitbox: { offsetX: 45, offsetY: -90, width: 55, height: 36 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.SPECIAL_2]: {
                type: ATTACK_TYPES.SPECIAL_2,
                name: 'Ice Projectile',
                command: '↓ ↘ → + Kick',
                startup: 10, active: 3, recovery: 16,
                damage: 80, hitstun: 24, blockstun: 16,
                hitLevel: HIT_LEVELS.HIGH, isProjectile: true, projType: 'ICE_PROJECTILE', projSpeed: 16, energyCost: 25, superGain: 10,
                hitbox: { offsetX: 40, offsetY: -85, width: 30, height: 30 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.RISING_KICK]: {
                type: ATTACK_TYPES.RISING_KICK,
                name: 'Cryo Geyser',
                command: '↓ ↙ ← + Kick',
                startup: 7, active: 7, recovery: 19,
                damage: 90, hitstun: 28, blockstun: 12,
                hitLevel: HIT_LEVELS.HIGH, launchY: -14, launchX: 3, energyCost: 25, superGain: 11,
                hitbox: { offsetX: 25, offsetY: -115, width: 45, height: 70 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.ULTIMATE]: {
                type: ATTACK_TYPES.ULTIMATE,
                name: 'ULTIMATE: Absolute Zero',
                command: '↓ ↘ → + Punch / Super',
                startup: 8, active: 16, recovery: 30,
                damage: 270, hitstun: 50, blockstun: 24,
                hitLevel: HIT_LEVELS.MID, pushback: 16, launchY: -15, launchX: 12, superCost: 100, isCinematicSuper: true,
                hitbox: { offsetX: 20, offsetY: -85, width: 140, height: 120 }
            }
        }
    },
    {
        id: 'VOLT',
        name: 'VOLT',
        title: 'THE LIGHTNING SPEEDSTER',
        role: 'Rushdown / Speed',
        difficulty: 'Hard',
        portrait: 'assets/characters/volt_preview.jpg',
        previewImage: 'assets/characters/volt_preview.jpg',
        themeColor: '#facc15',
        textColor: '#fde047',
        stats: {
            health: 920,
            attack: 85,
            defense: 65,
            speed: 100,
            range: 65,
            energy: 90
        },
        walkSpeedFwd: 5.6,
        walkSpeedBwd: 4.4,
        dashSpeed: 14.5,
        dashDuration: 11,
        jumpForce: 16.2,
        gravity: 0.74,
        weight: 0.9,
        attacks: {
            [ATTACK_TYPES.LIGHT_PUNCH]: {
                type: ATTACK_TYPES.LIGHT_PUNCH,
                name: 'Spark Jab',
                startup: 3, active: 2, recovery: 5,
                damage: 28, hitstun: 13, blockstun: 9,
                hitLevel: HIT_LEVELS.HIGH, pushback: 2.5, superGain: 4,
                hitbox: { offsetX: 35, offsetY: -95, width: 40, height: 22 },
                cancelsTo: [ATTACK_TYPES.LIGHT_PUNCH, ATTACK_TYPES.HEAVY_PUNCH, ATTACK_TYPES.LIGHT_KICK, ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.HEAVY_PUNCH]: {
                type: ATTACK_TYPES.HEAVY_PUNCH,
                name: 'Thunder Fist',
                startup: 7, active: 3, recovery: 11,
                damage: 72, hitstun: 20, blockstun: 13,
                hitLevel: HIT_LEVELS.MID, pushback: 6, superGain: 8,
                hitbox: { offsetX: 40, offsetY: -95, width: 50, height: 28 },
                cancelsTo: [ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.LIGHT_KICK]: {
                type: ATTACK_TYPES.LIGHT_KICK,
                name: 'Volt Knee',
                startup: 4, active: 3, recovery: 6,
                damage: 34, hitstun: 14, blockstun: 10,
                hitLevel: HIT_LEVELS.LOW, pushback: 3, superGain: 5,
                hitbox: { offsetX: 38, offsetY: -50, width: 42, height: 24 },
                cancelsTo: [ATTACK_TYPES.HEAVY_KICK, ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.HEAVY_KICK]: {
                type: ATTACK_TYPES.HEAVY_KICK,
                name: 'Lightning Axe Kick',
                startup: 9, active: 4, recovery: 13,
                damage: 82, hitstun: 24, blockstun: 12,
                hitLevel: HIT_LEVELS.HIGH, pushback: 8, launchY: -12, superGain: 10,
                hitbox: { offsetX: 44, offsetY: -90, width: 52, height: 35 },
                cancelsTo: [ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.SPECIAL_1]: {
                type: ATTACK_TYPES.SPECIAL_1,
                name: 'Lightning Dash',
                command: '→ → + Punch / Special',
                startup: 5, active: 5, recovery: 10,
                damage: 95, hitstun: 24, blockstun: 14,
                hitLevel: HIT_LEVELS.MID, pushback: 8, forwardImpulse: 14, energyCost: 20, superGain: 11,
                hitbox: { offsetX: 45, offsetY: -90, width: 55, height: 35 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.SPECIAL_2]: {
                type: ATTACK_TYPES.SPECIAL_2,
                name: 'Chain Shock',
                command: '↓ ↘ → + Kick',
                startup: 9, active: 3, recovery: 14,
                damage: 75, hitstun: 22, blockstun: 15,
                hitLevel: HIT_LEVELS.HIGH, isProjectile: true, projType: 'VOLT_ORB', projSpeed: 18, energyCost: 25, superGain: 10,
                hitbox: { offsetX: 38, offsetY: -85, width: 28, height: 28 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.RISING_KICK]: {
                type: ATTACK_TYPES.RISING_KICK,
                name: 'Thunder Flash',
                command: '↓ ↙ ← + Kick',
                startup: 5, active: 7, recovery: 18,
                damage: 92, hitstun: 28, blockstun: 11,
                hitLevel: HIT_LEVELS.HIGH, launchY: -16, launchX: 5, energyCost: 25, superGain: 11,
                hitbox: { offsetX: 25, offsetY: -120, width: 45, height: 75 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.ULTIMATE]: {
                type: ATTACK_TYPES.ULTIMATE,
                name: 'ULTIMATE: Thunderstorm',
                command: '↓ ↘ → + Punch / Super',
                startup: 6, active: 16, recovery: 28,
                damage: 285, hitstun: 52, blockstun: 24,
                hitLevel: HIT_LEVELS.MID, pushback: 18, launchY: -17, launchX: 14, superCost: 100, isCinematicSuper: true,
                hitbox: { offsetX: 20, offsetY: -85, width: 145, height: 125 }
            }
        }
    },
    {
        id: 'SHADOW',
        name: 'SHADOW',
        title: 'THE ECLIPSE ASSASSIN',
        role: 'Assassin / Technical',
        difficulty: 'Hard',
        portrait: 'assets/characters/shadow_preview.jpg',
        previewImage: 'assets/characters/shadow_preview.jpg',
        themeColor: '#a855f7',
        textColor: '#c084fc',
        stats: {
            health: 940,
            attack: 90,
            defense: 65,
            speed: 90,
            range: 75,
            energy: 85
        },
        walkSpeedFwd: 5.0,
        walkSpeedBwd: 4.0,
        dashSpeed: 13.0,
        dashDuration: 12,
        jumpForce: 15.8,
        gravity: 0.72,
        weight: 0.92,
        attacks: {
            [ATTACK_TYPES.LIGHT_PUNCH]: {
                type: ATTACK_TYPES.LIGHT_PUNCH,
                name: 'Shadow Dagger',
                startup: 4, active: 3, recovery: 6,
                damage: 34, hitstun: 15, blockstun: 10,
                hitLevel: HIT_LEVELS.HIGH, pushback: 3, superGain: 4,
                hitbox: { offsetX: 35, offsetY: -95, width: 42, height: 24 },
                cancelsTo: [ATTACK_TYPES.HEAVY_PUNCH, ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.HEAVY_PUNCH]: {
                type: ATTACK_TYPES.HEAVY_PUNCH,
                name: 'Eviscerate',
                startup: 8, active: 4, recovery: 13,
                damage: 82, hitstun: 22, blockstun: 14,
                hitLevel: HIT_LEVELS.MID, pushback: 7, superGain: 9,
                hitbox: { offsetX: 42, offsetY: -95, width: 54, height: 32 },
                cancelsTo: [ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.LIGHT_KICK]: {
                type: ATTACK_TYPES.LIGHT_KICK,
                name: 'Shadow Trip',
                startup: 5, active: 3, recovery: 7,
                damage: 36, hitstun: 15, blockstun: 10,
                hitLevel: HIT_LEVELS.LOW, pushback: 4, superGain: 5,
                hitbox: { offsetX: 40, offsetY: -45, width: 44, height: 25 },
                cancelsTo: [ATTACK_TYPES.HEAVY_KICK, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.HEAVY_KICK]: {
                type: ATTACK_TYPES.HEAVY_KICK,
                name: 'Eclipse Crescent',
                startup: 10, active: 4, recovery: 15,
                damage: 88, hitstun: 25, blockstun: 13,
                hitLevel: HIT_LEVELS.HIGH, pushback: 8, launchY: -11, superGain: 10,
                hitbox: { offsetX: 46, offsetY: -90, width: 56, height: 35 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.SPECIAL_1]: {
                type: ATTACK_TYPES.SPECIAL_1,
                name: 'Shadow Teleport Strike',
                command: '→ → + Punch / Special',
                startup: 7, active: 5, recovery: 14,
                damage: 105, hitstun: 28, blockstun: 16,
                hitLevel: HIT_LEVELS.MID, pushback: 9, forwardImpulse: 12, energyCost: 25, superGain: 12,
                hitbox: { offsetX: 45, offsetY: -90, width: 55, height: 36 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.SPECIAL_2]: {
                type: ATTACK_TYPES.SPECIAL_2,
                name: 'Void Kunai',
                command: '↓ ↘ → + Kick',
                startup: 11, active: 3, recovery: 16,
                damage: 82, hitstun: 22, blockstun: 15,
                hitLevel: HIT_LEVELS.HIGH, isProjectile: true, projType: 'ENERGY_WAVE', projSpeed: 15, color: '#a855f7', energyCost: 25, superGain: 10,
                hitbox: { offsetX: 40, offsetY: -85, width: 30, height: 30 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.RISING_KICK]: {
                type: ATTACK_TYPES.RISING_KICK,
                name: 'Nightfall Cutter',
                command: '↓ ↙ ← + Kick',
                startup: 6, active: 7, recovery: 19,
                damage: 96, hitstun: 30, blockstun: 12,
                hitLevel: HIT_LEVELS.HIGH, launchY: -15, launchX: 4, energyCost: 25, superGain: 12,
                hitbox: { offsetX: 25, offsetY: -120, width: 48, height: 75 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.ULTIMATE]: {
                type: ATTACK_TYPES.ULTIMATE,
                name: 'ULTIMATE: Shadow Realm',
                command: '↓ ↘ → + Punch / Super',
                startup: 7, active: 16, recovery: 30,
                damage: 295, hitstun: 54, blockstun: 25,
                hitLevel: HIT_LEVELS.MID, pushback: 18, launchY: -16, launchX: 14, superCost: 100, isCinematicSuper: true,
                hitbox: { offsetX: 20, offsetY: -85, width: 140, height: 120 }
            }
        }
    },
    {
        id: 'TERRA',
        name: 'TERRA',
        title: 'THE BULWARK GUARDIAN',
        role: 'Defense / Counter',
        difficulty: 'Medium',
        portrait: 'assets/characters/terra_preview.jpg',
        previewImage: 'assets/characters/terra_preview.jpg',
        themeColor: '#22c55e',
        textColor: '#4ade80',
        stats: {
            health: 1150,
            attack: 82,
            defense: 95,
            speed: 68,
            range: 72,
            energy: 80
        },
        walkSpeedFwd: 4.0,
        walkSpeedBwd: 3.0,
        dashSpeed: 9.0,
        dashDuration: 13,
        jumpForce: 14.2,
        gravity: 0.80,
        weight: 1.2,
        attacks: {
            [ATTACK_TYPES.LIGHT_PUNCH]: {
                type: ATTACK_TYPES.LIGHT_PUNCH,
                name: 'Stone Jab',
                startup: 5, active: 3, recovery: 8,
                damage: 35, hitstun: 15, blockstun: 11,
                hitLevel: HIT_LEVELS.HIGH, pushback: 4, superGain: 4,
                hitbox: { offsetX: 35, offsetY: -95, width: 42, height: 26 },
                cancelsTo: [ATTACK_TYPES.HEAVY_PUNCH, ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.HEAVY_PUNCH]: {
                type: ATTACK_TYPES.HEAVY_PUNCH,
                name: 'Earth Punch',
                startup: 10, active: 5, recovery: 16,
                damage: 86, hitstun: 24, blockstun: 16,
                hitLevel: HIT_LEVELS.MID, pushback: 8, superGain: 9,
                hitbox: { offsetX: 44, offsetY: -95, width: 58, height: 35 },
                cancelsTo: [ATTACK_TYPES.SPECIAL_1, ATTACK_TYPES.SPECIAL_2, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.LIGHT_KICK]: {
                type: ATTACK_TYPES.LIGHT_KICK,
                name: 'Rock Sweep',
                startup: 6, active: 3, recovery: 9,
                damage: 40, hitstun: 16, blockstun: 11,
                hitLevel: HIT_LEVELS.LOW, pushback: 4, superGain: 5,
                hitbox: { offsetX: 40, offsetY: -45, width: 45, height: 26 },
                cancelsTo: [ATTACK_TYPES.HEAVY_KICK, ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.HEAVY_KICK]: {
                type: ATTACK_TYPES.HEAVY_KICK,
                name: 'Tremor Kick',
                startup: 12, active: 5, recovery: 18,
                damage: 92, hitstun: 26, blockstun: 15,
                hitLevel: HIT_LEVELS.HIGH, pushback: 9, launchY: -11, superGain: 10,
                hitbox: { offsetX: 46, offsetY: -90, width: 60, height: 38 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.SPECIAL_1]: {
                type: ATTACK_TYPES.SPECIAL_1,
                name: 'Rock Shield Counter',
                command: '→ → + Punch / Special',
                startup: 4, active: 18, recovery: 14,
                damage: 115, hitstun: 30, blockstun: 18,
                hitLevel: HIT_LEVELS.MID, pushback: 10, armor: 3, energyCost: 30, superGain: 12,
                hitbox: { offsetX: 45, offsetY: -90, width: 60, height: 40 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.SPECIAL_2]: {
                type: ATTACK_TYPES.SPECIAL_2,
                name: 'Ground Spike',
                command: '↓ ↘ → + Kick',
                startup: 13, active: 6, recovery: 20,
                damage: 90, hitstun: 25, blockstun: 16,
                hitLevel: HIT_LEVELS.LOW, energyCost: 25, superGain: 10,
                hitbox: { offsetX: 70, offsetY: -40, width: 55, height: 60 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.RISING_KICK]: {
                type: ATTACK_TYPES.RISING_KICK,
                name: 'Stone Pillar',
                command: '↓ ↙ ← + Kick',
                startup: 7, active: 7, recovery: 20,
                damage: 98, hitstun: 30, blockstun: 13,
                hitLevel: HIT_LEVELS.HIGH, launchY: -15, launchX: 3, energyCost: 25, superGain: 12,
                hitbox: { offsetX: 25, offsetY: -120, width: 50, height: 75 },
                cancelsTo: [ATTACK_TYPES.ULTIMATE]
            },
            [ATTACK_TYPES.ULTIMATE]: {
                type: ATTACK_TYPES.ULTIMATE,
                name: 'ULTIMATE: Earth Titan',
                command: '↓ ↘ → + Punch / Super',
                startup: 9, active: 16, recovery: 32,
                damage: 290, hitstun: 52, blockstun: 26,
                hitLevel: HIT_LEVELS.MID, pushback: 18, launchY: -16, launchX: 14, superCost: 100, isCinematicSuper: true,
                hitbox: { offsetX: 20, offsetY: -85, width: 145, height: 125 }
            }
        }
    }
];
