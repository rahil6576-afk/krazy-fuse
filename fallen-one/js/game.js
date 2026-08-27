// js/game.js - Main Game Loop, State Orchestration & Match Dispatcher (with 10-Floor Tower & 2v1 Boss)

import { 
    CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATES, GAME_MODES, 
    AI_DIFFICULTIES, FIGHTER_STATES, ATTACK_TYPES, ROUNDS_TO_WIN 
} from './core/constants.js';
import { ROSTER } from './entities/roster.js';
import { inputManager } from './core/input.js';
import { camera } from './core/camera.js';
import { CollisionSystem } from './core/collision.js';
import { Fighter } from './entities/fighter.js';
import { FighterAI } from './systems/ai.js';
import { comboTracker } from './systems/comboSystem.js';
import { matchManager } from './systems/matchManager.js';
import { networkManager } from './systems/network.js';
import { towerManager } from './systems/towerManager.js';
import { arenaManager } from './graphics/arenas.js';
import { particleSystem } from './graphics/particleSystem.js';
import { GameRenderer } from './graphics/renderer.js';
import { soundEngine } from './audio/soundEngine.js';
import { musicEngine } from './audio/musicEngine.js';
import { hud } from './ui/hud.js';
import { MenuManager } from './ui/menuManager.js';
import { TrainingOverlay } from './ui/trainingOverlay.js';

export class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;

        this.renderer = new GameRenderer(this.canvas);
        this.menuManager = new MenuManager(this);
        this.trainingOverlay = new TrainingOverlay(this);

        this.gameState = GAME_STATES.MAIN_MENU;
        this.gameMode = GAME_MODES.LOCAL_VS;

        this.p1 = null;
        this.p2 = null;
        this.p3 = null; // Secondary boss for Floor 10 (2v1)
        this.ai = new FighterAI('NORMAL');
        this.ai2 = null;

        this.dummyBehavior = 'IDLE'; // For Training Mode
        this.lastFrameTime = performance.now();
        this.isRunning = false;
        this.isPaused = false;

        this.initTouchControls();
        this.initPauseKey();
        window.fallenOneGame = this;
    }

    initPauseKey() {
        this.__wasInFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                e.preventDefault();
                this.togglePause();
                if (window.parent !== window) {
                    window.parent.postMessage({ type: 'KRAZY_ESC', gameId: 'fallen-one', isPaused: this.isPaused }, '*');
                } else {
                    window.location.href = '../index.html?game=fallen-one';
                }
            } else if (e.code === 'KeyP') {
                e.preventDefault();
                this.togglePause();
            }
        });
    }

    togglePause() {
        if (this.isPaused || document.body.classList.contains('portal-paused')) {
            this.resume();
        } else {
            this.pause();
        }
    }

    pause() {
        if (this.__countdownTimerFO) {
            clearInterval(this.__countdownTimerFO);
            this.__countdownTimerFO = null;
            const overlay = document.getElementById('resumeCountdownOverlayFO');
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }
        this.isPaused = true;
        document.body.classList.add('portal-paused');
        const bankBadge = document.getElementById('portal-top-bank');
        if (bankBadge) {
            const pts = localStorage.getItem('krazio_user_points') || localStorage.getItem('coins') || localStorage.getItem('office_escape_coins') || '76';
            bankBadge.textContent = `🪙 ${pts} P`;
        }
        soundEngine.playMenuSelect();
    }

    resume(requestFullscreen = true) {
        if (this.__countdownTimerFO) {
            clearInterval(this.__countdownTimerFO);
            this.__countdownTimerFO = null;
        }

        // 1. Immediately expand back to fullscreen and dismiss paused portal UI
        document.body.classList.remove('portal-paused');
        if (requestFullscreen && !document.fullscreenElement && !document.webkitFullscreenElement) {
            const docEl = document.documentElement;
            const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
            if (req) req.call(docEl).catch(() => {});
        }

        // 2. If in active combat match, run 3-second countdown before unpausing combat physics
        if (this.gameState === GAME_STATES.IN_GAME || this.gameState === GAME_STATES.TRAINING) {
            this.runResumeCountdown(() => {
                this.isPaused = false;
                soundEngine.playMenuSelect();
            });
        } else {
            this.isPaused = false;
            soundEngine.playMenuSelect();
        }
    }

    runResumeCountdown(onComplete) {
        let overlay = document.getElementById('resumeCountdownOverlayFO');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'resumeCountdownOverlayFO';
            overlay.className = 'resume-countdown-overlay';
            document.body.appendChild(overlay);
        }
        overlay.classList.add('active');

        let count = 3;
        const playBeep = (freq, type = 'sine', duration = 0.15) => {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                if (!this.__cdCtx) this.__cdCtx = new AudioCtx();
                if (this.__cdCtx.state === 'suspended') this.__cdCtx.resume();
                const osc = this.__cdCtx.createOscillator();
                const gain = this.__cdCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.__cdCtx.currentTime);
                gain.gain.setValueAtTime(0.18, this.__cdCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.__cdCtx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.__cdCtx.destination);
                osc.start();
                osc.stop(this.__cdCtx.currentTime + duration);
            } catch (e) {}
        };

        const updateDisplay = () => {
            if (count > 0) {
                overlay.innerHTML = `
                    <div class="resume-countdown-number" key="${count}">${count}</div>
                    <div class="resume-countdown-sub">⚡ GET READY • RESUMING</div>
                `;
                playBeep(count === 3 ? 440 : count === 2 ? 554 : 659, 'sine', 0.18);
                count--;
            } else if (count === 0) {
                overlay.innerHTML = `
                    <div class="resume-countdown-number" style="color: #4ade80; text-shadow: 0 0 45px rgba(74, 222, 128, 0.9);">FIGHT!</div>
                    <div class="resume-countdown-sub" style="color: #4ade80;">⚔️ CLASH OF CHAMPIONS!</div>
                `;
                playBeep(880, 'triangle', 0.3);
                count--;
            } else {
                if (this.__countdownTimerFO) {
                    clearInterval(this.__countdownTimerFO);
                    this.__countdownTimerFO = null;
                }
                overlay.classList.remove('active');
                setTimeout(() => {
                    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, 200);
                if (typeof onComplete === 'function') onComplete();
            }
        };

        updateDisplay();
        this.__countdownTimerFO = setInterval(updateDisplay, 1000);
    }

    restartMatch() {
        this.resume();
        if (this.gameMode === GAME_MODES.TOWER_CLIMB) {
            this.startTowerMatch();
        } else if (this.p1 && this.p2) {
            this.startMatch(this.p1.config, this.p2.config, this.gameMode);
        }
    }

    returnToMainMenu() {
        this.resume();
        this.gameState = GAME_STATES.MAIN_MENU;
        this.menuManager.showScreen('mainMenu');
        musicEngine.stopTrack();
    }

    startTowerMatch() {
        document.body.classList.remove('portal-paused');
        const floorData = towerManager.getCurrentFloorData();
        const p1Config = ROSTER.find(c => c.id === towerManager.playerCharId) || ROSTER[0];
        const p2Config = ROSTER.find(c => c.id === floorData.opponentId) || ROSTER[1];

        arenaManager.setArena(floorData.arenaId);
        this.gameMode = GAME_MODES.TOWER_CLIMB;
        this.gameState = GAME_STATES.IN_GAME;
        this.isPaused = false;
        document.getElementById('pause-modal')?.classList.add('hidden');

        this.p1 = new Fighter(p1Config, 'P1', false);
        this.p2 = new Fighter(p2Config, 'P2', true);
        this.p2.maxHealth = Math.round(p2Config.stats.health * floorData.healthMultiplier);
        this.p2.health = this.p2.maxHealth;
        this.p2.displayHealth = this.p2.health;
        this.ai = new FighterAI(floorData.aiDifficulty);

        if (floorData.isBoss2v1) {
            const p3Config = ROSTER.find(c => c.id === floorData.boss2Id) || ROSTER[4];
            this.p3 = new Fighter(p3Config, 'P2', true);
            this.p3.x = 1550;
            this.p3.maxHealth = Math.round(p3Config.stats.health * floorData.healthMultiplier);
            this.p3.health = this.p3.maxHealth;
            this.p3.displayHealth = this.p3.health;
            this.ai2 = new FighterAI(floorData.aiDifficulty);
        } else {
            this.p3 = null;
            this.ai2 = null;
        }

        hud.initFighters(this.p1, this.p2, this.p3, `FLOOR ${floorData.floor}/10: ${floorData.title}`);
        comboTracker.reset();
        particleSystem.reset();
        matchManager.startNewMatch(floorData.floor === 10 ? 1 : 2, false);

        this.trainingOverlay.hide();
        musicEngine.startTrack(arenaManager.currentArena.id);

        if (!this.isRunning) {
            this.isRunning = true;
            this.lastFrameTime = performance.now();
            requestAnimationFrame((t) => this.gameLoop(t));
        }
    }

    startMatch(p1Config, p2Config, mode = GAME_MODES.LOCAL_VS) {
        document.body.classList.remove('portal-paused');
        this.gameMode = mode || GAME_MODES.AI_BATTLE;
        this.gameState = this.gameMode === GAME_MODES.TRAINING ? GAME_STATES.TRAINING : GAME_STATES.IN_GAME;
        this.isPaused = false;
        this.p3 = null;
        this.ai2 = null;
        document.getElementById('pause-modal')?.classList.add('hidden');

        const isP2AI = this.gameMode !== GAME_MODES.LOCAL_VS;
        this.p1 = new Fighter(p1Config, 'P1', false);
        this.p2 = new Fighter(p2Config, 'P2', isP2AI);

        if (isP2AI) {
            this.ai = new FighterAI('NORMAL');
        } else {
            this.ai = null;
        }

        hud.initFighters(this.p1, this.p2, null, null);
        comboTracker.reset();
        particleSystem.reset();
        if (this.gameMode === GAME_MODES.TRAINING) {
            matchManager.startNewMatch(ROUNDS_TO_WIN, true);
            this.trainingOverlay.show();
        } else {
            matchManager.startNewMatch(ROUNDS_TO_WIN, false);
            this.trainingOverlay.hide();
        }

        musicEngine.startTrack(arenaManager.currentArena.id);

        if (!this.isRunning) {
            this.isRunning = true;
            this.lastFrameTime = performance.now();
            requestAnimationFrame((t) => this.gameLoop(t));
        }
    }

    gameLoop(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp || performance.now();
        const now = timestamp || performance.now();
        const delta = Math.min(now - this.lastFrameTime, 100);
        this.lastFrameTime = now;

        if (!this.isPaused) {
            this.accumulator = (this.accumulator || 0) + delta;
            const targetStep = 1000 / 60; // Locked 60 FPS update rate

            while (this.accumulator >= targetStep) {
                inputManager.update();

                if (this.gameState === GAME_STATES.IN_GAME || this.gameState === GAME_STATES.TRAINING) {
                    this.updateCombat();
                }
                this.accumulator -= targetStep;
            }
        }

        // Render Canvas Scene
        this.renderer.render(this.p1, this.p2, matchManager, comboTracker, this.p3);

        // Update HUD
        hud.update(this.p1, this.p2, matchManager, comboTracker, this.p3);

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    updateCombat() {
        if (!this.p1 || !this.p2) return;

        // 1. Process Camera (Hitstop logic handles frame freezes)
        const isFrameFrozen = camera.update(this.p1, this.p2);
        if (isFrameFrozen) return;

        // 2. Stage Ambiance & Particle Pool Update
        arenaManager.update();
        particleSystem.update();
        comboTracker.update();

        // 3. Obtain Player 1 & Player 2 Inputs
        const p1Input = inputManager.playerInputs.P1 || { left: false, right: false, up: false, down: false, light: false, heavy: false, special: false, super: false, guard: false };
        let p2Input;
        let p3Input;

        if (this.gameMode === GAME_MODES.LOCAL_VS) {
            p2Input = inputManager.playerInputs.P2;
        } else if (this.gameMode === GAME_MODES.AI_BATTLE || this.gameMode === GAME_MODES.TOWER_CLIMB) {
            if (!this.ai) this.ai = new FighterAI('NORMAL');
            p2Input = this.ai.update(this.p2, this.p1);
            if (this.p3 && this.ai2) {
                p3Input = this.ai2.update(this.p3, this.p1);
            }
        } else if (this.gameMode === GAME_MODES.TRAINING) {
            p2Input = this.getDummyInput();
        } else if (this.gameMode === GAME_MODES.ONLINE_PVP) {
            networkManager.sendInput(p1Input, matchManager.phaseTimer);
            if (!this.ai) this.ai = new FighterAI('NORMAL');
            p2Input = networkManager.remoteInput || this.ai.update(this.p2, this.p1);
        } else {
            if (!this.ai) this.ai = new FighterAI('NORMAL');
            p2Input = this.ai.update(this.p2, this.p1);
        }

        if (!p2Input) {
            p2Input = { left: false, right: false, up: false, down: false, light: false, heavy: false, special: false, super: false, guard: false };
        }

        // 4. Update Fighters
        this.p1.update(this.p2, p1Input);
        this.p2.update(this.p1, p2Input);
        if (this.p3 && p3Input) {
            this.p3.update(this.p1, p3Input);
        }

        // 5. Pushbox Resolution
        CollisionSystem.resolvePushboxes(this.p1, this.p2);
        if (this.p3) {
            CollisionSystem.resolvePushboxes(this.p1, this.p3);
            CollisionSystem.resolvePushboxes(this.p2, this.p3);
        }

        // 6. Hitbox & Melee Attack Detection
        this.checkCombatCollisions(this.p1, this.p2, 'P1');
        this.checkCombatCollisions(this.p2, this.p1, 'P2');
        if (this.p3) {
            this.checkCombatCollisions(this.p1, this.p3, 'P1');
            this.checkCombatCollisions(this.p3, this.p1, 'P2');
        }

        // 7. Projectile Collision Detection
        this.checkProjectileCollisions(this.p1, this.p2, 'P1');
        this.checkProjectileCollisions(this.p2, this.p1, 'P2');
        if (this.p3) {
            this.checkProjectileCollisions(this.p1, this.p3, 'P1');
            this.checkProjectileCollisions(this.p3, this.p1, 'P2');
        }

        // 8. Match & Round Progression
        if (this.gameMode !== GAME_MODES.TRAINING) {
            matchManager.update(this.p1, this.p2, (results) => {
                this.gameState = GAME_STATES.MATCH_OVER;
                this.menuManager.showResults(results);
            }, this.p3);
        }
    }

    getDummyInput() {
        const dummy = {
            left: false, right: false, up: false, down: false,
            lightPunch: false, heavyPunch: false,
            lightKick: false, heavyKick: false,
            special: false, ultimate: false,
            block: false, dash: false,
            justPressed: {}
        };

        if (this.dummyBehavior === 'CROUCH') dummy.down = true;
        else if (this.dummyBehavior === 'JUMP') dummy.up = true;
        else if (this.dummyBehavior === 'GUARD_ALL') dummy.block = true;
        else if (this.dummyBehavior === 'COUNTER') {
            if (Math.random() < 0.25) dummy.justPressed.lightPunch = true;
        }

        return dummy;
    }

    checkCombatCollisions(attacker, defender, attackerKey) {
        if (!attacker || !defender || defender.health <= 0) return;
        const hitResult = CollisionSystem.checkHit(attacker, defender);
        if (hitResult) {
            const scaledDamage = comboTracker.registerHit(attackerKey, hitResult.attack.damage);
            const outcome = defender.takeHit({ ...hitResult, attack: { ...hitResult.attack, damage: scaledDamage } }, attacker);

            if (this.gameMode === GAME_MODES.TRAINING) {
                const advantage = outcome.blocked ? (attacker.currentAttackData.blockstun - attacker.currentAttackData.recovery) : (attacker.currentAttackData.hitstun - attacker.currentAttackData.recovery);
                this.trainingOverlay.updateFrameData(advantage);
            }
        }
    }

    checkProjectileCollisions(attacker, defender, attackerKey) {
        if (!attacker || !defender || !attacker.projectiles || defender.health <= 0) return;
        for (let i = attacker.projectiles.length - 1; i >= 0; i--) {
            const proj = attacker.projectiles[i];
            const hitResult = CollisionSystem.checkProjectileHit(proj, defender);
            if (hitResult) {
                const scaledDamage = comboTracker.registerHit(attackerKey, hitResult.attack.damage);
                defender.takeHit({ ...hitResult, attack: { ...hitResult.attack, damage: scaledDamage } }, attacker);
                proj.destroy(hitResult.hitPoint);
            }
        }
    }

    initTouchControls() {
        const dpad = document.getElementById('touch-dpad');
        const stick = document.getElementById('touch-stick');
        if (!dpad || !stick) return;

        let dragging = false;
        const rect = dpad.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const handleMove = (clientX, clientY) => {
            const currentRect = dpad.getBoundingClientRect();
            const dx = clientX - (currentRect.left + centerX);
            const dy = clientY - (currentRect.top + centerY);
            const dist = Math.min(45, Math.hypot(dx, dy));
            const angle = Math.atan2(dy, dx);

            stick.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
            inputManager.virtualTouch.active = true;
            inputManager.virtualTouch.stickVector = {
                x: (Math.cos(angle) * dist) / 45,
                y: (Math.sin(angle) * dist) / 45
            };
        };

        dpad.addEventListener('touchstart', (e) => {
            dragging = true;
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        });

        window.addEventListener('touchmove', (e) => {
            if (dragging && e.touches[0]) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        });

        window.addEventListener('touchend', () => {
            dragging = false;
            stick.style.transform = 'translate(0px, 0px)';
            inputManager.virtualTouch.stickVector = { x: 0, y: 0 };
        });

        const buttons = [
            { id: 'touch-btn-lp', key: 'lp' },
            { id: 'touch-btn-hp', key: 'hp' },
            { id: 'touch-btn-lk', key: 'lk' },
            { id: 'touch-btn-hk', key: 'hk' },
            { id: 'touch-btn-sp', key: 'sp' },
            { id: 'touch-btn-ult', key: 'ult' },
            { id: 'touch-btn-blk', key: 'blk' }
        ];

        buttons.forEach(b => {
            const el = document.getElementById(b.id);
            if (el) {
                el.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    inputManager.virtualTouch.buttons[b.key] = true;
                });
                el.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    inputManager.virtualTouch.buttons[b.key] = false;
                });
            }
        });
    }

    getDummyInput() {
        if (!this.__dummyInput) {
            this.__dummyInput = {
                left: false, right: false, up: false, down: false,
                lightPunch: false, heavyPunch: false,
                lightKick: false, heavyKick: false,
                special: false, ultimate: false,
                block: false, dash: false,
                justPressed: {}
            };
        }
        const input = { ...this.__dummyInput, justPressed: {} };
        
        // Reset all keys
        input.left = false;
        input.right = false;
        input.up = false;
        input.down = false;
        input.block = false;
        input.lightPunch = false;
        input.heavyPunch = false;

        const state = this.dummyBehavior || 'IDLE';
        if (state === 'CROUCH') {
            input.down = true;
        } else if (state === 'JUMP') {
            if (this.p2 && this.p2.isGrounded) {
                input.up = true;
                input.justPressed.up = true;
            }
        } else if (state === 'GUARD_ALL') {
            input.block = true;
        } else if (state === 'COUNTER') {
            input.block = true;
            if (this.p2 && this.p2.state === FIGHTER_STATES.BLOCKSTUN && Math.random() < 0.25) {
                input.lightPunch = true;
                input.justPressed.lightPunch = true;
            }
        }

        // Training mode dummy health reset so dummy never dies
        if (this.p2 && this.p2.health < this.p2.maxHealth * 0.25) {
            this.p2.health = this.p2.maxHealth;
            this.p2.displayHealth = this.p2.health;
        }

        this.__dummyInput = input;
        return input;
    }

    resetTrainingPositions() {
        if (!this.p1 || !this.p2) return;
        this.p1.x = 420;
        this.p1.y = 0;
        this.p1.vx = 0;
        this.p1.vy = 0;
        this.p1.facing = 1;
        this.p1.health = this.p1.maxHealth;
        this.p1.displayHealth = this.p1.health;
        this.p1.state = FIGHTER_STATES.IDLE;

        this.p2.x = 860;
        this.p2.y = 0;
        this.p2.vx = 0;
        this.p2.vy = 0;
        this.p2.facing = -1;
        this.p2.health = this.p2.maxHealth;
        this.p2.displayHealth = this.p2.health;
        this.p2.state = FIGHTER_STATES.IDLE;

        comboTracker.reset();
        soundEngine.playMenuSelect();
    }
}

// Initialize on DOM load or immediately if already loaded
function initGameEngine() {
    if (!window.game) {
        window.game = new GameEngine();
        window.fallenOneGame = window.game;
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initGameEngine);
} else {
    initGameEngine();
}
