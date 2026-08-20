// js/ui/hud.js - In-Game Fighting HUD Controller (with Tower Climb & 2v1 Boss Support)

import { MAX_SUPER_METER, MAX_SPECIAL_ENERGY } from '../core/constants.js';

export class HUD {
    constructor() {
        this.dom = {
            p1Name: document.getElementById('p1-name'),
            p2Name: document.getElementById('p2-name'),
            p3Name: document.getElementById('p3-name'),
            p1Portrait: document.getElementById('p1-portrait'),
            p2Portrait: document.getElementById('p2-portrait'),
            p1HealthBar: document.getElementById('p1-health-fill'),
            p1HealthBuffer: document.getElementById('p1-health-buffer'),
            p2HealthBar: document.getElementById('p2-health-fill'),
            p2HealthBuffer: document.getElementById('p2-health-buffer'),
            p3BossWrap: document.getElementById('p3-boss-bar-wrap'),
            p3HealthBar: document.getElementById('p3-health-fill'),
            p1SuperMeter: document.getElementById('p1-super-fill'),
            p2SuperMeter: document.getElementById('p2-super-fill'),
            p1EnergyMeter: document.getElementById('p1-energy-fill'),
            p2EnergyMeter: document.getElementById('p2-energy-fill'),
            timer: document.getElementById('match-timer'),
            towerFloorTag: document.getElementById('tower-floor-indicator'),
            p1Rounds: document.getElementById('p1-round-pips'),
            p2Rounds: document.getElementById('p2-round-pips'),
            p1Combo: document.getElementById('p1-combo-box'),
            p2Combo: document.getElementById('p2-combo-box'),
            p1ComboHits: document.getElementById('p1-combo-hits'),
            p2ComboHits: document.getElementById('p2-combo-hits'),
            p1ComboDamage: document.getElementById('p1-combo-damage'),
            p2ComboDamage: document.getElementById('p2-combo-damage')
        };
    }

    initFighters(p1, p2, p3 = null, towerFloorInfo = null) {
        if (this.dom.p1Name) this.dom.p1Name.textContent = p1.name;
        if (this.dom.p2Name) this.dom.p2Name.textContent = p2.name;
        if (this.dom.p1Portrait) this.dom.p1Portrait.src = p1.portrait;
        if (this.dom.p2Portrait) this.dom.p2Portrait.src = p2.portrait;

        if (p3 && this.dom.p3BossWrap) {
            this.dom.p3BossWrap.classList.remove('hidden');
            if (this.dom.p3Name) this.dom.p3Name.textContent = `${p3.name} (TWIN BOSS)`;
        } else if (this.dom.p3BossWrap) {
            this.dom.p3BossWrap.classList.add('hidden');
        }

        if (towerFloorInfo && this.dom.towerFloorTag) {
            this.dom.towerFloorTag.textContent = towerFloorInfo;
            this.dom.towerFloorTag.classList.remove('hidden');
        } else if (this.dom.towerFloorTag) {
            this.dom.towerFloorTag.classList.add('hidden');
        }
    }

    update(p1, p2, matchManager, comboTracker, p3 = null) {
        if (!p1 || !p2) return;

        // Health Bars & Delayed Buffer Bars
        const p1HealthPct = Math.max(0, (p1.health / p1.maxHealth) * 100);
        const p1BufferPct = Math.max(0, (p1.displayHealth / p1.maxHealth) * 100);
        const p2HealthPct = Math.max(0, (p2.health / p2.maxHealth) * 100);
        const p2BufferPct = Math.max(0, (p2.displayHealth / p2.maxHealth) * 100);

        if (this.dom.p1HealthBar) this.dom.p1HealthBar.style.width = `${p1HealthPct}%`;
        if (this.dom.p1HealthBuffer) this.dom.p1HealthBuffer.style.width = `${p1BufferPct}%`;
        if (this.dom.p2HealthBar) this.dom.p2HealthBar.style.width = `${p2HealthPct}%`;
        if (this.dom.p2HealthBuffer) this.dom.p2HealthBuffer.style.width = `${p2BufferPct}%`;

        // Secondary Boss (Floor 10) Health Bar
        if (p3 && this.dom.p3HealthBar) {
            const p3HealthPct = Math.max(0, (p3.health / p3.maxHealth) * 100);
            this.dom.p3HealthBar.style.width = `${p3HealthPct}%`;
        }

        // Super Meters
        const p1SuperPct = Math.min(100, (p1.superMeter / MAX_SUPER_METER) * 100);
        const p2SuperPct = Math.min(100, (p2.superMeter / MAX_SUPER_METER) * 100);
        if (this.dom.p1SuperMeter) {
            this.dom.p1SuperMeter.style.width = `${p1SuperPct}%`;
            this.dom.p1SuperMeter.classList.toggle('super-max', p1.superMeter >= MAX_SUPER_METER);
        }
        if (this.dom.p2SuperMeter) {
            this.dom.p2SuperMeter.style.width = `${p2SuperPct}%`;
            this.dom.p2SuperMeter.classList.toggle('super-max', p2.superMeter >= MAX_SUPER_METER);
        }

        // Special Energy Meters
        const p1EnergyPct = Math.min(100, (p1.specialEnergy / MAX_SPECIAL_ENERGY) * 100);
        const p2EnergyPct = Math.min(100, (p2.specialEnergy / MAX_SPECIAL_ENERGY) * 100);
        if (this.dom.p1EnergyMeter) this.dom.p1EnergyMeter.style.width = `${p1EnergyPct}%`;
        if (this.dom.p2EnergyMeter) this.dom.p2EnergyMeter.style.width = `${p2EnergyPct}%`;

        // Match Timer
        if (this.dom.timer && matchManager) {
            this.dom.timer.textContent = matchManager.roundTimer.toString().padStart(2, '0');
        }

        // Round Win Pips
        if (this.dom.p1Rounds && matchManager) {
            const pips = this.dom.p1Rounds.children;
            for (let i = 0; i < pips.length; i++) {
                pips[i].classList.toggle('won', i < matchManager.p1RoundsWon);
            }
        }
        if (this.dom.p2Rounds && matchManager) {
            const pips = this.dom.p2Rounds.children;
            for (let i = 0; i < pips.length; i++) {
                pips[i].classList.toggle('won', i < matchManager.p2RoundsWon);
            }
        }

        // Combo Displays
        if (comboTracker) {
            if (this.dom.p1Combo) {
                if (comboTracker.p1Combo.hits > 1) {
                    this.dom.p1Combo.classList.add('visible');
                    this.dom.p1ComboHits.textContent = `${comboTracker.p1Combo.hits} HITS`;
                    this.dom.p1ComboDamage.textContent = `${comboTracker.p1Combo.totalDamage} DMG`;
                } else {
                    this.dom.p1Combo.classList.remove('visible');
                }
            }

            if (this.dom.p2Combo) {
                if (comboTracker.p2Combo.hits > 1) {
                    this.dom.p2Combo.classList.add('visible');
                    this.dom.p2ComboHits.textContent = `${comboTracker.p2Combo.hits} HITS`;
                    this.dom.p2ComboDamage.textContent = `${comboTracker.p2Combo.totalDamage} DMG`;
                } else {
                    this.dom.p2Combo.classList.remove('visible');
                }
            }
        }
    }
}

export const hud = new HUD();
