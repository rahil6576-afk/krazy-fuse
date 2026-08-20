// js/systems/towerManager.js - 10-Floor Arcade Tower Climb & 2v1 Boss Battle System

import { AI_DIFFICULTIES } from '../core/constants.js';

export const TOWER_FLOORS = [
    {
        floor: 1,
        name: 'FLOOR 1: MAGMA GATE',
        opponentId: 'SOLAR',
        opponentName: 'SOLAR',
        title: 'NOVICE WARRIOR',
        aiDifficulty: AI_DIFFICULTIES.EASY,
        healthMultiplier: 0.85,
        damageMultiplier: 0.85,
        arenaId: 'VOLCANIC_CORE',
        description: 'Breach the lower magma gate against Solar.'
    },
    {
        floor: 2,
        name: 'FLOOR 2: EMERALD CRAGS',
        opponentId: 'TERRA',
        opponentName: 'TERRA',
        title: 'BULWARK GUARDIAN',
        aiDifficulty: AI_DIFFICULTIES.NORMAL,
        healthMultiplier: 0.95,
        damageMultiplier: 0.90,
        arenaId: 'TRAINING_DOJO',
        description: 'Shatter Terra’s stone armor to advance.'
    },
    {
        floor: 3,
        name: 'FLOOR 3: LIGHTNING ROOFTOPS',
        opponentId: 'VOLT',
        opponentName: 'VOLT',
        title: 'SPEED DEMON',
        aiDifficulty: AI_DIFFICULTIES.NORMAL,
        healthMultiplier: 1.0,
        damageMultiplier: 1.0,
        arenaId: 'FUTURE_CITY',
        description: 'React to Volt’s supersonic flash steps.'
    },
    {
        floor: 4,
        name: 'FLOOR 4: TWILIGHT SANCTUM',
        opponentId: 'SHADOW',
        opponentName: 'SHADOW',
        title: 'VOID ASSASSIN',
        aiDifficulty: AI_DIFFICULTIES.HARD,
        healthMultiplier: 1.05,
        damageMultiplier: 1.05,
        arenaId: 'CYBER_ARENA',
        description: 'Survive Shadow’s elusive teleport strikes.'
    },
    {
        floor: 5,
        name: 'FLOOR 5: GLACIAL SPIRE',
        opponentId: 'FROST',
        opponentName: 'FROST',
        title: 'CRYO GRANDMASTER',
        aiDifficulty: AI_DIFFICULTIES.HARD,
        healthMultiplier: 1.10,
        damageMultiplier: 1.10,
        arenaId: 'FROZEN_BASE',
        description: 'Withstand Frost’s freezing geyser traps.'
    },
    {
        floor: 6,
        name: 'FLOOR 6: CELESTIAL PROVING',
        opponentId: 'AARAV',
        opponentName: 'AARAV',
        title: 'ASTRAL LOTUS CHAMPION',
        aiDifficulty: AI_DIFFICULTIES.EXPERT,
        healthMultiplier: 1.15,
        damageMultiplier: 1.15,
        arenaId: 'TRAINING_DOJO',
        description: 'Duel Aarav in high-speed martial perfection.'
    },
    {
        floor: 7,
        name: 'FLOOR 7: INFERNO APEX',
        opponentId: 'SOLAR',
        opponentName: 'SOLAR (OVERDRIVE)',
        title: 'BURNING TITAN',
        aiDifficulty: AI_DIFFICULTIES.EXPERT,
        healthMultiplier: 1.25,
        damageMultiplier: 1.20,
        arenaId: 'VOLCANIC_CORE',
        description: 'Encounter Solar radiating unstoppable magma energy.'
    },
    {
        floor: 8,
        name: 'FLOOR 8: THUNDER GOD ASCENT',
        opponentId: 'VOLT',
        opponentName: 'VOLT (HYPERCHARGE)',
        title: 'LIGHTNING SOVEREIGN',
        aiDifficulty: AI_DIFFICULTIES.EXPERT,
        healthMultiplier: 1.30,
        damageMultiplier: 1.25,
        arenaId: 'CYBER_ARENA',
        description: 'Volt unleashes non-stop high-voltage lightning barrages.'
    },
    {
        floor: 9,
        name: 'FLOOR 9: ECLIPSE GATEKEEPER',
        opponentId: 'SHADOW',
        opponentName: 'SHADOW (VOID GOD)',
        title: 'SHADOW REALM CONQUEROR',
        aiDifficulty: AI_DIFFICULTIES.EXPERT,
        healthMultiplier: 1.40,
        damageMultiplier: 1.35,
        arenaId: 'CYBER_ARENA',
        description: 'The final barrier before the summit.'
    },
    {
        floor: 10,
        name: 'FLOOR 10: TOWER SUMMIT - TWIN BOSS BATTLE',
        isBoss2v1: true,
        opponentId: 'FROST',
        opponentName: 'FROST',
        boss2Id: 'VOLT',
        boss2Name: 'VOLT',
        title: 'THE DUAL CHAMPIONS (2v1)',
        aiDifficulty: AI_DIFFICULTIES.EXPERT,
        healthMultiplier: 1.15,
        damageMultiplier: 1.10,
        arenaId: 'FUTURE_CITY',
        description: 'FINAL BATTLE: Defeat Frost and Volt fighting SIMULTANEOUSLY!'
    }
];

export class TowerManager {
    constructor() {
        this.currentFloor = 1;
        this.highestFloor = 1;
        this.isActive = false;
        this.playerCharId = 'AARAV';
    }

    startTower(playerCharId = 'AARAV') {
        this.currentFloor = 1;
        this.isActive = true;
        this.playerCharId = playerCharId;
    }

    getCurrentFloorData() {
        return TOWER_FLOORS[this.currentFloor - 1] || TOWER_FLOORS[0];
    }

    advanceFloor() {
        if (this.currentFloor < 10) {
            this.currentFloor++;
            if (this.currentFloor > this.highestFloor) {
                this.highestFloor = this.currentFloor;
            }
            return true;
        }
        return false; // Tower conquered!
    }

    reset() {
        this.currentFloor = 1;
        this.isActive = false;
    }
}

export const towerManager = new TowerManager();
