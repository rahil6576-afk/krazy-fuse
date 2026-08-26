// js/ui/menuManager.js - UI Screen State Transitions, Character Select & Stage Select (with Tower Climb)

import { ROSTER } from '../entities/roster.js';
import { ARENA_LIST, arenaManager } from '../graphics/arenas.js';
import { GAME_STATES, GAME_MODES, AI_DIFFICULTIES, ATTACK_TYPES } from '../core/constants.js';
import { soundEngine } from '../audio/soundEngine.js';
import { musicEngine } from '../audio/musicEngine.js';
import { networkManager } from '../systems/network.js';
import { towerManager } from '../systems/towerManager.js';

export class MenuManager {
    constructor(game) {
        this.game = game;
        this.selectedP1Index = 0;
        this.selectedP2Index = 1;
        this.selectedStageIndex = 0;
        this.currentMode = GAME_MODES.LOCAL_VS;

        this.dom = {
            screens: {
                mainMenu: document.getElementById('mainMenuScreen') || document.getElementById('main-menu-screen'),
                charSelect: document.getElementById('char-select-screen'),
                stageSelect: document.getElementById('stage-select-screen'),
                inGameHud: document.getElementById('game-hud'),
                resultsScreen: document.getElementById('results-screen')
            },
            modals: {
                onlineModal: document.getElementById('online-modal'),
                settingsModal: document.getElementById('settings-modal'),
                movesModal: document.getElementById('moves-modal'),
                leaderboardModal: document.getElementById('leaderboard-modal'),
                newsModal: document.getElementById('news-modal'),
                pauseModal: document.getElementById('pause-modal')
            },
            charGrid: document.getElementById('character-grid'),
            p1Preview: {
                name: document.getElementById('cs-p1-name'),
                title: document.getElementById('cs-p1-title'),
                role: document.getElementById('cs-p1-role'),
                portrait: document.getElementById('cs-p1-portrait'),
                statHealth: document.getElementById('cs-p1-stat-hp'),
                statAtk: document.getElementById('cs-p1-stat-atk'),
                statDef: document.getElementById('cs-p1-stat-def'),
                statSpd: document.getElementById('cs-p1-stat-spd')
            },
            stageGrid: document.getElementById('stage-grid'),
            results: {
                winnerName: document.getElementById('res-winner-name'),
                winnerPortrait: document.getElementById('res-winner-portrait'),
                score: document.getElementById('res-score'),
                time: document.getElementById('res-time'),
                xp: document.getElementById('res-xp')
            }
        };

        this.initCharacterGrid();
        this.initStageGrid();
        this.bindMenuButtons();
    }

    initCharacterGrid() {
        if (!this.dom.charGrid) return;
        this.dom.charGrid.innerHTML = '';

        ROSTER.forEach((char, idx) => {
            const card = document.createElement('div');
            card.className = `char-card ${idx === 0 ? 'selected-p1' : ''}`;
            card.dataset.index = idx;
            card.innerHTML = `
                <img src="${char.portrait}" alt="${char.name}" class="char-card-img" />
                <div class="char-card-info">
                    <span class="char-card-name">${char.name}</span>
                    <span class="char-card-role">${char.role.split('/')[0]}</span>
                </div>
            `;

            card.addEventListener('click', () => {
                soundEngine.playMenuSelect();
                this.selectCharacter(idx, 'P1');
            });

            this.dom.charGrid.appendChild(card);
        });

        // Initialize preview for initial character
        this.updateP1Preview(ROSTER[0]);
    }

    initStageGrid() {
        if (!this.dom.stageGrid) return;
        this.dom.stageGrid.innerHTML = '';

        ARENA_LIST.forEach((arena, idx) => {
            const card = document.createElement('div');
            card.className = `stage-card ${idx === 0 ? 'selected' : ''}`;
            card.dataset.index = idx;
            card.innerHTML = `
                <img src="${arena.imagePath}" alt="${arena.name}" class="stage-card-img" />
                <div class="stage-card-info">
                    <span class="stage-card-name">${arena.name}</span>
                    <span class="stage-card-type">${arena.subtitle}</span>
                </div>
            `;

            card.addEventListener('click', () => {
                soundEngine.playMenuSelect();
                this.selectStage(idx);
            });

            this.dom.stageGrid.appendChild(card);
        });
    }

    bindMenuButtons() {
        // Play hover sound for all buttons & hotspots
        document.querySelectorAll('.fo-hotspot-btn, .arcade-btn, .fo-icon-btn, .hud-pause-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                soundEngine.playMenuHover();
            });
        });

        // 1. TOP NAV LINKS
        document.getElementById('btn-nav-home')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.showScreen('mainMenu');
        });

        document.getElementById('btn-nav-characters')?.addEventListener('click', () => {
            soundEngine.playModeStart();
            this.currentMode = GAME_MODES.LOCAL_VS;
            this.showScreen('charSelect');
        });

        document.getElementById('btn-nav-modes')?.addEventListener('click', () => {
            soundEngine.playModeStart();
            this.currentMode = GAME_MODES.LOCAL_VS;
            this.showScreen('charSelect');
        });

        document.getElementById('btn-nav-manual')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.dom.modals.movesModal?.classList.remove('hidden');
        });

        document.getElementById('btn-nav-leaderboard')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.dom.modals.leaderboardModal?.classList.remove('hidden');
        });

        document.getElementById('btn-nav-news')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.dom.modals.newsModal?.classList.remove('hidden');
        });

        document.getElementById('btn-nav-settings-top')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.dom.modals.settingsModal?.classList.remove('hidden');
        });

        document.getElementById('btn-nav-profile')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.dom.modals.leaderboardModal?.classList.remove('hidden');
        });

        // 2. RIGHT SIDE 5 MODE BUTTONS
        document.getElementById('btn-mode-local')?.addEventListener('click', () => {
            soundEngine.playModeStart();
            this.currentMode = GAME_MODES.LOCAL_VS;
            this.showScreen('charSelect');
        });

        document.getElementById('btn-mode-ai')?.addEventListener('click', () => {
            soundEngine.playModeStart();
            this.currentMode = GAME_MODES.AI_BATTLE;
            this.showScreen('charSelect');
        });

        document.getElementById('btn-mode-training')?.addEventListener('click', () => {
            soundEngine.playModeStart();
            this.currentMode = GAME_MODES.TRAINING;
            this.showScreen('charSelect');
        });

        document.getElementById('btn-mode-online')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.dom.modals.onlineModal?.classList.remove('hidden');
        });

        const startTowerClimb = () => {
            soundEngine.playModeStart();
            this.currentMode = GAME_MODES.TOWER_CLIMB;
            towerManager.startTower();
            this.showScreen('charSelect');
        };
        document.getElementById('btn-mode-tower')?.addEventListener('click', startTowerClimb);
        document.getElementById('btn-tower-featured')?.addEventListener('click', startTowerClimb);

        // 3. LEFT NEWS LINKS
        document.getElementById('btn-news-item-1')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.dom.modals.onlineModal?.classList.remove('hidden');
        });

        document.getElementById('btn-news-item-2')?.addEventListener('click', () => {
            soundEngine.playModeStart();
            this.currentMode = GAME_MODES.AI_BATTLE;
            // Find Volt in roster
            const voltIdx = ROSTER.findIndex(c => c.id === 'VOLT');
            if (voltIdx !== -1) {
                this.selectCharacter(voltIdx, 'P1');
            }
            this.showScreen('charSelect');
        });

        document.getElementById('btn-news-item-3')?.addEventListener('click', startTowerClimb);

        // 4. BOTTOM CONTROLS
        document.getElementById('btn-toggle-fullscreen')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log('Fullscreen error:', err);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });

        document.getElementById('btn-open-settings')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.dom.modals.settingsModal?.classList.remove('hidden');
        });

        document.getElementById('btn-exit-game')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            window.location.href = '../index.html';
        });

        // 5. NAVIGATION BACK BUTTONS
        document.getElementById('btn-cs-back')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.showScreen('mainMenu');
        });

        document.getElementById('btn-stage-back')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.showScreen('charSelect');
        });

        // Close Modals
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                soundEngine.playMenuSelect();
                btn.closest('.modal-backdrop').classList.add('hidden');
            });
        });

        function ensureFullScreen() {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                const el = document.documentElement;
                const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
                if (req) req.call(el).catch(() => {});
            }
        }

        // Character Select Confirm -> Stage Select or Start Tower
        document.getElementById('btn-confirm-char')?.addEventListener('click', () => {
            this.confirmCharacterSelection();
        });

        // Stage Select Confirm -> Start Game
        document.getElementById('btn-start-match')?.addEventListener('click', () => {
            this.startMatchFromStageSelect();
        });

        // In-game Pause Button & Modal Actions
        document.getElementById('btn-hud-pause')?.addEventListener('click', () => {
            this.game.pause();
        });

        document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
            this.game.resume();
        });

        document.getElementById('btn-pause-restart')?.addEventListener('click', () => {
            this.game.restartMatch();
        });

        document.getElementById('btn-pause-home')?.addEventListener('click', () => {
            this.game.returnToMainMenu();
        });

        // Rematch / Next Floor Button
        document.getElementById('btn-rematch')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            if (this.currentMode === GAME_MODES.TOWER_CLIMB) {
                if (this.lastResults?.winnerKey === 'P1') {
                    const hasNext = towerManager.advanceFloor();
                    if (hasNext) {
                        this.game.startTowerMatch();
                        this.showScreen('inGameHud');
                        return;
                    }
                }
                // Restart tower floor
                this.game.startTowerMatch();
                this.showScreen('inGameHud');
            } else {
                this.game.startMatch(
                    ROSTER[this.selectedP1Index],
                    ROSTER[this.selectedP2Index],
                    this.currentMode
                );
                this.showScreen('inGameHud');
            }
        });

        // Return to Main Menu
        document.getElementById('btn-return-menu')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            this.showScreen('mainMenu');
        });

        // Online Host / Join
        document.getElementById('btn-host-room')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            const code = networkManager.createRoom();
            document.getElementById('host-room-code-display').textContent = code;
            document.getElementById('online-host-section').classList.remove('hidden');
        });

        document.getElementById('btn-join-room')?.addEventListener('click', () => {
            soundEngine.playMenuSelect();
            const inputCode = document.getElementById('join-room-input').value.trim();
            if (inputCode) {
                networkManager.joinRoom(inputCode);
                this.currentMode = GAME_MODES.ONLINE_PVP;
                this.dom.modals.onlineModal?.classList.add('hidden');
                this.showScreen('charSelect');
            }
        });
    }

    selectCharacter(idx, playerKey = 'P1') {
        if (playerKey === 'P1') {
            this.selectedP1Index = idx;
            document.querySelectorAll('.char-card').forEach((c, i) => {
                c.classList.toggle('selected-p1', i === idx);
            });
            this.updateP1Preview(ROSTER[idx]);
        }
    }

    updateP1Preview(char) {
        if (!char || !this.dom.p1Preview.name) return;
        this.dom.p1Preview.name.textContent = char.name;
        this.dom.p1Preview.title.textContent = char.title;
        this.dom.p1Preview.role.textContent = char.role;
        this.dom.p1Preview.portrait.src = char.previewImage || char.portrait;
        this.dom.p1Preview.statHealth.style.width = `${(char.stats.health / 1200) * 100}%`;
        this.dom.p1Preview.statAtk.style.width = `${char.stats.attack}%`;
        this.dom.p1Preview.statDef.style.width = `${char.stats.defense}%`;
        this.dom.p1Preview.statSpd.style.width = `${char.stats.speed}%`;
    }

    selectStage(idx) {
        this.selectedStageIndex = idx;
        document.querySelectorAll('.stage-card').forEach((c, i) => {
            c.classList.toggle('selected', i === idx);
        });
    }

    confirmCharacterSelection() {
        try {
            if (soundEngine && soundEngine.playModeStart) soundEngine.playModeStart();
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                const el = document.documentElement;
                const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
                if (req) req.call(el).catch(() => {});
            }
            if (this.currentMode === GAME_MODES.TOWER_CLIMB) {
                const p1 = ROSTER[this.selectedP1Index] || ROSTER[0];
                towerManager.startTower(p1.id);
                this.game.startTowerMatch();
                this.showScreen('inGameHud');
            } else {
                this.showScreen('stageSelect');
            }
        } catch (err) {
            console.error("confirmCharacterSelection failed:", err);
        }
    }

    startMatchFromStageSelect() {
        try {
            if (soundEngine && soundEngine.playModeStart) soundEngine.playModeStart();
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                const el = document.documentElement;
                const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
                if (req) req.call(el).catch(() => {});
            }
            const stage = ARENA_LIST[this.selectedStageIndex] || ARENA_LIST[0];
            arenaManager.setArena(stage.id);
            const p1 = ROSTER[this.selectedP1Index] || ROSTER[0];
            const p2 = ROSTER[this.selectedP2Index] || ROSTER[1];
            this.game.startMatch(
                p1,
                p2,
                this.currentMode || GAME_MODES.AI_BATTLE
            );
            this.showScreen('inGameHud');
        } catch (err) {
            console.error("startMatchFromStageSelect failed:", err);
        }
    }

    showScreen(screenKey) {
        document.querySelectorAll('.menu-screen').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.modal-backdrop').forEach(el => el.classList.add('hidden'));

        if (this.dom.screens[screenKey]) {
            this.dom.screens[screenKey].classList.remove('hidden');
        }

        if (screenKey === 'mainMenu') {
            this.game.gameState = GAME_STATES.MAIN_MENU;
            musicEngine.startTrack('FUTURE_CITY');
        }
    }

    showResults(results) {
        this.lastResults = results;
        if (this.dom.results.winnerName) this.dom.results.winnerName.textContent = `${results.winner} WINS!`;
        if (this.dom.results.winnerPortrait) this.dom.results.winnerPortrait.src = results.winnerPortrait;
        if (this.dom.results.time) this.dom.results.time.textContent = results.matchTime;
        if (this.dom.results.score) this.dom.results.score.textContent = `${results.p1Rounds} - ${results.p2Rounds}`;
        if (this.dom.results.xp) this.dom.results.xp.textContent = `+${results.xpEarned} XP`;

        const rematchBtn = document.getElementById('btn-rematch');
        if (rematchBtn) {
            if (this.currentMode === GAME_MODES.TOWER_CLIMB) {
                if (results.winnerKey === 'P1') {
                    rematchBtn.textContent = towerManager.currentFloor >= 10 ? '🏆 TOWER CONQUERED! REPLAY' : `NEXT FLOOR (${towerManager.currentFloor + 1}/10) ➔`;
                } else {
                    rematchBtn.textContent = 'RETRY FLOOR ➔';
                }
            } else {
                rematchBtn.textContent = 'REMATCH ➔';
            }
        }

        soundEngine.announce('VICTORY');
        this.showScreen('resultsScreen');
    }
}
