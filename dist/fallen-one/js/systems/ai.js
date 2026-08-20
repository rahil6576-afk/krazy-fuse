// js/systems/ai.js - Fighting Game AI Engine (Easy, Normal, Hard, Expert)

import { AI_DIFFICULTIES, FIGHTER_STATES, ATTACK_TYPES, MAX_SUPER_METER } from '../core/constants.js';

export class FighterAI {
    constructor(difficulty = 'NORMAL') {
        this.difficultyKey = difficulty;
        this.config = AI_DIFFICULTIES[difficulty] || AI_DIFFICULTIES.NORMAL;
        this.decisionTimer = 0;
        this.simulatedInput = {
            left: false, right: false, up: false, down: false,
            lightPunch: false, heavyPunch: false,
            lightKick: false, heavyKick: false,
            special: false, ultimate: false,
            block: false, dash: false,
            justPressed: {}
        };
        this.prevInput = { ...this.simulatedInput };
    }

    setDifficulty(diffKey) {
        this.difficultyKey = diffKey;
        this.config = AI_DIFFICULTIES[diffKey] || AI_DIFFICULTIES.NORMAL;
    }

    update(aiFighter, playerFighter) {
        this.prevInput = { ...this.simulatedInput };
        this.decisionTimer++;

        // Reset justPressed
        this.simulatedInput.justPressed = {};

        // Only make new strategic decision every N reaction frames
        if (this.decisionTimer >= this.config.reactionFrames) {
            this.decisionTimer = 0;
            this.makeDecision(aiFighter, playerFighter);
        }

        // Generate justPressed booleans
        for (const key of ['lightPunch', 'heavyPunch', 'lightKick', 'heavyKick', 'special', 'ultimate', 'dash']) {
            this.simulatedInput.justPressed[key] = this.simulatedInput[key] && !this.prevInput[key];
        }

        return this.simulatedInput;
    }

    makeDecision(ai, player) {
        // Reset action keys
        this.simulatedInput.left = false;
        this.simulatedInput.right = false;
        this.simulatedInput.up = false;
        this.simulatedInput.down = false;
        this.simulatedInput.lightPunch = false;
        this.simulatedInput.heavyPunch = false;
        this.simulatedInput.lightKick = false;
        this.simulatedInput.heavyKick = false;
        this.simulatedInput.special = false;
        this.simulatedInput.ultimate = false;
        this.simulatedInput.block = false;
        this.simulatedInput.dash = false;

        const dist = Math.abs(ai.x - player.x);
        const playerIsAttacking = player.state === FIGHTER_STATES.ATTACK;
        const playerIsAirborne = !player.isGrounded;

        // 1. Reactive Defense (Blocking & Perfect Parries)
        if (playerIsAttacking && dist < 140) {
            if (Math.random() < this.config.blockChance) {
                this.simulatedInput.block = true;
                if (Math.random() > 0.6) this.simulatedInput.down = true; // Low guard
                return;
            }
        }

        // 2. Anti-Air Defense (Use Rising Kick or Anti-Air if opponent jumps in)
        if (playerIsAirborne && dist < 120 && Math.random() < this.config.comboSkill) {
            this.simulatedInput.special = true;
            return;
        }

        // 3. Ultimate Punish (Full Super Meter)
        if (ai.superMeter >= MAX_SUPER_METER && dist < 150 && Math.random() < (this.config.comboSkill * 0.9)) {
            this.simulatedInput.ultimate = true;
            return;
        }

        // 4. Melee Combat Range (Close: dist < 85)
        if (dist < 85) {
            const roll = Math.random();
            if (roll < 0.35) {
                this.simulatedInput.lightPunch = true;
            } else if (roll < 0.65) {
                this.simulatedInput.lightKick = true;
            } else if (roll < 0.85) {
                this.simulatedInput.heavyPunch = true;
            } else {
                this.simulatedInput.special = true;
            }
            return;
        }

        // 5. Mid Range (85 <= dist <= 220)
        if (dist >= 85 && dist <= 220) {
            const roll = Math.random();
            if (roll < 0.4) {
                // Dash in or throw projectile
                if (Math.random() > 0.5) {
                    this.simulatedInput.dash = true;
                } else {
                    this.simulatedInput.special = true;
                }
            } else {
                // Walk towards player
                if (ai.x < player.x) this.simulatedInput.right = true;
                else this.simulatedInput.left = true;
            }
            return;
        }

        // 6. Long Range (dist > 220)
        if (dist > 220) {
            const roll = Math.random();
            if (roll < 0.45) {
                // Fire projectile / special
                this.simulatedInput.special = true;
            } else if (roll < 0.8) {
                // Advance
                if (ai.x < player.x) this.simulatedInput.right = true;
                else this.simulatedInput.left = true;
            } else {
                // Dash forward
                this.simulatedInput.dash = true;
            }
        }
    }
}
