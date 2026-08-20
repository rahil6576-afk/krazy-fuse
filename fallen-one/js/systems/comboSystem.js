// js/systems/comboSystem.js - Combo Tracker, Damage Scaling & Juggle System

import { soundEngine } from '../audio/soundEngine.js';

export class ComboTracker {
    constructor() {
        this.p1Combo = { hits: 0, totalDamage: 0, timer: 0, maxCombo: 0 };
        this.p2Combo = { hits: 0, totalDamage: 0, timer: 0, maxCombo: 0 };
    }

    reset() {
        this.p1Combo = { hits: 0, totalDamage: 0, timer: 0, maxCombo: 0 };
        this.p2Combo = { hits: 0, totalDamage: 0, timer: 0, maxCombo: 0 };
    }

    registerHit(attackerKey, rawDamage) {
        const combo = attackerKey === 'P1' ? this.p1Combo : this.p2Combo;
        combo.hits++;
        
        // Damage scaling formula: 100% -> 85% -> 72% -> 60% -> min 20%
        const scaleFactor = Math.max(0.20, Math.pow(0.86, combo.hits - 1));
        const scaledDamage = Math.round(rawDamage * scaleFactor);
        
        combo.totalDamage += scaledDamage;
        combo.timer = 50; // Reset timeout frames

        if (combo.hits > combo.maxCombo) {
            combo.maxCombo = combo.hits;
        }

        // Announcer voice on key milestones
        if (combo.hits === 3) soundEngine.announce('GREAT COMBO!');
        else if (combo.hits === 5) soundEngine.announce('SUPERB!');
        else if (combo.hits === 8) soundEngine.announce('UNSTOPPABLE!');

        return scaledDamage;
    }

    update() {
        if (this.p1Combo.timer > 0) {
            this.p1Combo.timer--;
            if (this.p1Combo.timer === 0) {
                this.p1Combo.hits = 0;
                this.p1Combo.totalDamage = 0;
            }
        }

        if (this.p2Combo.timer > 0) {
            this.p2Combo.timer--;
            if (this.p2Combo.timer === 0) {
                this.p2Combo.hits = 0;
                this.p2Combo.totalDamage = 0;
            }
        }
    }
}

export const comboTracker = new ComboTracker();
