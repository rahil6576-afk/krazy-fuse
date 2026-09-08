// js/ui/hud.js - In-Game Fighting HUD Controller (with Tower Climb & 2v1 Boss Support)

import { MAX_SUPER_METER, MAX_SPECIAL_ENERGY } from '../core/constants.js';
import { FighterSpriteRenderer } from '../graphics/fighterSprites.js';

export class HUD {
    constructor() {
        this.dom = {
            p1Name: document.getElementById('p1-name'),
            p2Name: document.getElementById('p2-name'),
            p3Name: document.getElementById('p3-name'),
            p1Portrait: document.getElementById('p1-portrait'),
            p2Portrait: document.getElementById('p2-portrait'),
            p1PortraitCanvas: document.getElementById('p1-portrait-canvas'),
            p2PortraitCanvas: document.getElementById('p2-portrait-canvas'),
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
        this.p1PortraitCtx = this.dom.p1PortraitCanvas ? this.dom.p1PortraitCanvas.getContext('2d') : null;
        this.p2PortraitCtx = this.dom.p2PortraitCanvas ? this.dom.p2PortraitCanvas.getContext('2d') : null;
        this.portraitAnimTimer = 0;
        this.cache = {
            p1Health: '',
            p1Buffer: '',
            p2Health: '',
            p2Buffer: '',
            p3Health: '',
            p1Super: '',
            p2Super: '',
            p1SuperMax: null,
            p2SuperMax: null,
            p1Energy: '',
            p2Energy: '',
            timer: '',
            p1Rounds: -1,
            p2Rounds: -1,
            p1ComboHits: '',
            p2ComboHits: ''
        };
    }

    initFighters(p1, p2, p3 = null, towerFloorInfo = null) {
        // Reset dirty cache
        this.cache = {
            p1Health: '',
            p1Buffer: '',
            p2Health: '',
            p2Buffer: '',
            p3Health: '',
            p1Super: '',
            p2Super: '',
            p1SuperMax: null,
            p2SuperMax: null,
            p1Energy: '',
            p2Energy: '',
            timer: '',
            p1Rounds: -1,
            p2Rounds: -1,
            p1ComboHits: '',
            p2ComboHits: ''
        };

        if (this.dom.p1Name) this.dom.p1Name.textContent = p1.name;
        if (this.dom.p2Name) this.dom.p2Name.textContent = p2.name;

        // P1 Portrait: Animated Aarav HUD Portrait (195f cycle) or static image
        if (p1.charId === 'AARAV') {
            if (this.dom.p1Portrait) this.dom.p1Portrait.classList.add('hidden');
            if (this.dom.p1PortraitCanvas) this.dom.p1PortraitCanvas.classList.remove('hidden');
        } else {
            if (this.dom.p1Portrait) {
                this.dom.p1Portrait.src = p1.portrait;
                this.dom.p1Portrait.classList.remove('hidden');
            }
            if (this.dom.p1PortraitCanvas) this.dom.p1PortraitCanvas.classList.add('hidden');
        }

        // P2 Portrait
        if (p2.charId === 'AARAV') {
            if (this.dom.p2Portrait) this.dom.p2Portrait.classList.add('hidden');
            if (this.dom.p2PortraitCanvas) this.dom.p2PortraitCanvas.classList.remove('hidden');
        } else {
            if (this.dom.p2Portrait) {
                this.dom.p2Portrait.src = p2.portrait;
                this.dom.p2Portrait.classList.remove('hidden');
            }
            if (this.dom.p2PortraitCanvas) this.dom.p2PortraitCanvas.classList.add('hidden');
        }

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

        // 19. AARAV_PORTRAIT (HUD) - Throttled to 30 FPS to reduce Canvas 2D CPU overhead
        this.portraitAnimTimer++;
        if (this.portraitAnimTimer % 2 === 0) {
            if (p1.charId === 'AARAV' && this.p1PortraitCtx) {
                this.p1PortraitCtx.clearRect(0, 0, 64, 64);
                FighterSpriteRenderer.drawAaravPortrait(this.p1PortraitCtx, 0, 0, 64, 64, this.portraitAnimTimer, p1.damageFlashTimer || 0);
            }
            if (p2.charId === 'AARAV' && this.p2PortraitCtx) {
                this.p2PortraitCtx.clearRect(0, 0, 64, 64);
                FighterSpriteRenderer.drawAaravPortrait(this.p2PortraitCtx, 0, 0, 64, 64, this.portraitAnimTimer, p2.damageFlashTimer || 0);
            }
        }

        // Health Bars & Delayed Buffer Bars (Dirty-checked to avoid continuous DOM reflows)
        const p1HealthStr = `${Math.max(0, (p1.health / p1.maxHealth) * 100).toFixed(1)}%`;
        const p1BufferStr = `${Math.max(0, (p1.displayHealth / p1.maxHealth) * 100).toFixed(1)}%`;
        const p2HealthStr = `${Math.max(0, (p2.health / p2.maxHealth) * 100).toFixed(1)}%`;
        const p2BufferStr = `${Math.max(0, (p2.displayHealth / p2.maxHealth) * 100).toFixed(1)}%`;

        if (p1HealthStr !== this.cache.p1Health) {
            if (this.dom.p1HealthBar) this.dom.p1HealthBar.style.width = p1HealthStr;
            this.cache.p1Health = p1HealthStr;
        }
        if (p1BufferStr !== this.cache.p1Buffer) {
            if (this.dom.p1HealthBuffer) this.dom.p1HealthBuffer.style.width = p1BufferStr;
            this.cache.p1Buffer = p1BufferStr;
        }
        if (p2HealthStr !== this.cache.p2Health) {
            if (this.dom.p2HealthBar) this.dom.p2HealthBar.style.width = p2HealthStr;
            this.cache.p2Health = p2HealthStr;
        }
        if (p2BufferStr !== this.cache.p2Buffer) {
            if (this.dom.p2HealthBuffer) this.dom.p2HealthBuffer.style.width = p2BufferStr;
            this.cache.p2Buffer = p2BufferStr;
        }

        // Secondary Boss (Floor 10) Health Bar
        if (p3 && this.dom.p3HealthBar) {
            const p3HealthStr = `${Math.max(0, (p3.health / p3.maxHealth) * 100).toFixed(1)}%`;
            if (p3HealthStr !== this.cache.p3Health) {
                this.dom.p3HealthBar.style.width = p3HealthStr;
                this.cache.p3Health = p3HealthStr;
            }
        }

        // Super Meters
        const p1SuperStr = `${Math.min(100, (p1.superMeter / MAX_SUPER_METER) * 100).toFixed(1)}%`;
        const p2SuperStr = `${Math.min(100, (p2.superMeter / MAX_SUPER_METER) * 100).toFixed(1)}%`;
        const p1IsSuperMax = p1.superMeter >= MAX_SUPER_METER;
        const p2IsSuperMax = p2.superMeter >= MAX_SUPER_METER;

        if (this.dom.p1SuperMeter && (p1SuperStr !== this.cache.p1Super || p1IsSuperMax !== this.cache.p1SuperMax)) {
            this.dom.p1SuperMeter.style.width = p1SuperStr;
            this.dom.p1SuperMeter.classList.toggle('super-max', p1IsSuperMax);
            this.cache.p1Super = p1SuperStr;
            this.cache.p1SuperMax = p1IsSuperMax;
        }
        if (this.dom.p2SuperMeter && (p2SuperStr !== this.cache.p2Super || p2IsSuperMax !== this.cache.p2SuperMax)) {
            this.dom.p2SuperMeter.style.width = p2SuperStr;
            this.dom.p2SuperMeter.classList.toggle('super-max', p2IsSuperMax);
            this.cache.p2Super = p2SuperStr;
            this.cache.p2SuperMax = p2IsSuperMax;
        }

        // Special Energy Meters
        const p1EnergyStr = `${Math.min(100, (p1.specialEnergy / MAX_SPECIAL_ENERGY) * 100).toFixed(1)}%`;
        const p2EnergyStr = `${Math.min(100, (p2.specialEnergy / MAX_SPECIAL_ENERGY) * 100).toFixed(1)}%`;
        if (this.dom.p1EnergyMeter && p1EnergyStr !== this.cache.p1Energy) {
            this.dom.p1EnergyMeter.style.width = p1EnergyStr;
            this.cache.p1Energy = p1EnergyStr;
        }
        if (this.dom.p2EnergyMeter && p2EnergyStr !== this.cache.p2Energy) {
            this.dom.p2EnergyMeter.style.width = p2EnergyStr;
            this.cache.p2Energy = p2EnergyStr;
        }

        // Match Timer
        if (this.dom.timer && matchManager) {
            const timeStr = matchManager.isTraining ? '∞' : matchManager.roundTimer.toString().padStart(2, '0');
            if (timeStr !== this.cache.timer) {
                this.dom.timer.textContent = timeStr;
                this.cache.timer = timeStr;
            }
        }

        // Round Win Pips
        if (matchManager) {
            if (this.dom.p1Rounds && this.cache.p1Rounds !== matchManager.p1RoundsWon) {
                const pips = this.dom.p1Rounds.children;
                for (let i = 0; i < pips.length; i++) {
                    pips[i].classList.toggle('won', !matchManager.isTraining && i < matchManager.p1RoundsWon);
                }
                this.cache.p1Rounds = matchManager.p1RoundsWon;
            }
            if (this.dom.p2Rounds && this.cache.p2Rounds !== matchManager.p2RoundsWon) {
                const pips = this.dom.p2Rounds.children;
                for (let i = 0; i < pips.length; i++) {
                    pips[i].classList.toggle('won', !matchManager.isTraining && i < matchManager.p2RoundsWon);
                }
                this.cache.p2Rounds = matchManager.p2RoundsWon;
            }
        }

        // Combo Displays
        if (comboTracker) {
            if (this.dom.p1Combo) {
                if (comboTracker.p1Combo.hits > 1) {
                    const comboKey = `${comboTracker.p1Combo.hits}_${comboTracker.p1Combo.totalDamage}`;
                    if (this.cache.p1ComboHits !== comboKey) {
                        this.dom.p1Combo.classList.add('visible');
                        this.dom.p1ComboHits.textContent = `${comboTracker.p1Combo.hits} HITS`;
                        this.dom.p1ComboDamage.textContent = `${comboTracker.p1Combo.totalDamage} DMG`;
                        this.cache.p1ComboHits = comboKey;
                    }
                } else if (this.cache.p1ComboHits !== '') {
                    this.dom.p1Combo.classList.remove('visible');
                    this.cache.p1ComboHits = '';
                }
            }

            if (this.dom.p2Combo) {
                if (comboTracker.p2Combo.hits > 1) {
                    const comboKey = `${comboTracker.p2Combo.hits}_${comboTracker.p2Combo.totalDamage}`;
                    if (this.cache.p2ComboHits !== comboKey) {
                        this.dom.p2Combo.classList.add('visible');
                        this.dom.p2ComboHits.textContent = `${comboTracker.p2Combo.hits} HITS`;
                        this.dom.p2ComboDamage.textContent = `${comboTracker.p2Combo.totalDamage} DMG`;
                        this.cache.p2ComboHits = comboKey;
                    }
                } else if (this.cache.p2ComboHits !== '') {
                    this.dom.p2Combo.classList.remove('visible');
                    this.cache.p2ComboHits = '';
                }
            }
        }
    }
}

export const hud = new HUD();
