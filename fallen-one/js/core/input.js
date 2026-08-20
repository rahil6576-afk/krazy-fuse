// js/core/input.js - Keyboard, Gamepad, Touch and Buffer Input Manager

import { DEFAULT_KEY_BINDINGS } from './constants.js';

export class InputManager {
    constructor() {
        const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('pvp_key_bindings') : null;
        this.keyBindings = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_KEY_BINDINGS));
        this.rawKeys = {};
        
        this.playerInputs = {
            P1: {
                left: false, right: false, up: false, down: false,
                lightPunch: false, heavyPunch: false,
                lightKick: false, heavyKick: false,
                special: false, ultimate: false,
                block: false, dash: false,
                // Input buffer history for specials
                history: [],
                justPressed: {}
            },
            P2: {
                left: false, right: false, up: false, down: false,
                lightPunch: false, heavyPunch: false,
                lightKick: false, heavyKick: false,
                special: false, ultimate: false,
                block: false, dash: false,
                history: [],
                justPressed: {}
            }
        };

        this.virtualTouch = {
            active: false,
            stickVector: { x: 0, y: 0 },
            buttons: {}
        };

        if (typeof window !== 'undefined') {
            this.initKeyboard();
            this.initTouch();
        }
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.rawKeys[e.code] = true;
            // Prevent scrolling on arrows/space
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.rawKeys[e.code] = false;
        });
    }

    initTouch() {
        // Touch events will be bound to mobile HUD overlay elements
        this.touchPad = null;
    }

    saveBindings() {
        localStorage.setItem('pvp_key_bindings', JSON.stringify(this.keyBindings));
    }

    resetBindings() {
        this.keyBindings = JSON.parse(JSON.stringify(DEFAULT_KEY_BINDINGS));
        this.saveBindings();
    }

    update() {
        // 1. Process Gamepads
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp1 = gamepads[0];
        const gp2 = gamepads[1];

        // 2. Process P1 Keyboard & Gamepad & Touch
        this.updatePlayerInput('P1', this.keyBindings.P1, gp1, true);

        // 3. Process P2 Keyboard & Gamepad
        this.updatePlayerInput('P2', this.keyBindings.P2, gp2, false);
    }

    updatePlayerInput(playerKey, bindings, gamepad, allowTouch = false) {
        const input = this.playerInputs[playerKey];
        const prevInput = { ...input };

        let left = !!this.rawKeys[bindings.left];
        let right = !!this.rawKeys[bindings.right];
        let up = !!this.rawKeys[bindings.up];
        let down = !!this.rawKeys[bindings.down];

        let lp = !!this.rawKeys[bindings.lightPunch];
        let hp = !!this.rawKeys[bindings.heavyPunch];
        let lk = !!this.rawKeys[bindings.lightKick];
        let hk = !!this.rawKeys[bindings.heavyKick];
        let sp = !!this.rawKeys[bindings.special];
        let ult = !!this.rawKeys[bindings.ultimate];
        let blk = !!this.rawKeys[bindings.block];
        let dsh = !!this.rawKeys[bindings.dash];

        // Merge Gamepad
        if (gamepad && gamepad.connected) {
            const axesX = gamepad.axes[0] || 0;
            const axesY = gamepad.axes[1] || 0;
            const dpadLeft = gamepad.buttons[14] && gamepad.buttons[14].pressed;
            const dpadRight = gamepad.buttons[15] && gamepad.buttons[15].pressed;
            const dpadUp = gamepad.buttons[12] && gamepad.buttons[12].pressed;
            const dpadDown = gamepad.buttons[13] && gamepad.buttons[13].pressed;

            if (axesX < -0.35 || dpadLeft) left = true;
            if (axesX > 0.35 || dpadRight) right = true;
            if (axesY < -0.5 || dpadUp) up = true;
            if (axesY > 0.4 || dpadDown) down = true;

            // Standard layout: X/Square = LP, Y/Triangle = HP, A/Cross = LK, B/Circle = HK, R1 = Special, R2 = Ultimate, L1 = Block, L2 = Dash
            if (gamepad.buttons[2] && gamepad.buttons[2].pressed) lp = true; // X / Square
            if (gamepad.buttons[3] && gamepad.buttons[3].pressed) hp = true; // Y / Triangle
            if (gamepad.buttons[0] && gamepad.buttons[0].pressed) lk = true; // A / Cross
            if (gamepad.buttons[1] && gamepad.buttons[1].pressed) hk = true; // B / Circle
            if (gamepad.buttons[5] && gamepad.buttons[5].pressed) sp = true; // RB / R1
            if (gamepad.buttons[7] && gamepad.buttons[7].pressed) ult = true; // RT / R2
            if (gamepad.buttons[4] && gamepad.buttons[4].pressed) blk = true; // LB / L1
            if (gamepad.buttons[6] && gamepad.buttons[6].pressed) dsh = true; // LT / L2
        }

        // Merge Touch Controls for P1
        if (allowTouch && this.virtualTouch.active) {
            if (this.virtualTouch.stickVector.x < -0.35) left = true;
            if (this.virtualTouch.stickVector.x > 0.35) right = true;
            if (this.virtualTouch.stickVector.y < -0.45) up = true;
            if (this.virtualTouch.stickVector.y > 0.45) down = true;

            if (this.virtualTouch.buttons.lp) lp = true;
            if (this.virtualTouch.buttons.hp) hp = true;
            if (this.virtualTouch.buttons.lk) lk = true;
            if (this.virtualTouch.buttons.hk) hk = true;
            if (this.virtualTouch.buttons.sp) sp = true;
            if (this.virtualTouch.buttons.ult) ult = true;
            if (this.virtualTouch.buttons.blk) blk = true;
            if (this.virtualTouch.buttons.dsh) dsh = true;
        }

        input.left = left;
        input.right = right;
        input.up = up;
        input.down = down;
        input.lightPunch = lp;
        input.heavyPunch = hp;
        input.lightKick = lk;
        input.heavyKick = hk;
        input.special = sp;
        input.ultimate = ult;
        input.block = blk;
        input.dash = dsh;

        // Just Pressed detection
        input.justPressed = {
            left: left && !prevInput.left,
            right: right && !prevInput.right,
            up: up && !prevInput.up,
            down: down && !prevInput.down,
            lightPunch: lp && !prevInput.lightPunch,
            heavyPunch: hp && !prevInput.heavyPunch,
            lightKick: lk && !prevInput.lightKick,
            heavyKick: hk && !prevInput.heavyKick,
            special: sp && !prevInput.special,
            ultimate: ult && !prevInput.ultimate,
            block: blk && !prevInput.block,
            dash: dsh && !prevInput.dash
        };

        // Record history snapshot for motion input buffer (up to 40 frames)
        input.history.unshift({
            left, right, up, down,
            lp: input.justPressed.lightPunch,
            hp: input.justPressed.heavyPunch,
            lk: input.justPressed.lightKick,
            hk: input.justPressed.heavyKick,
            sp: input.justPressed.special,
            ult: input.justPressed.ultimate,
            dash: input.justPressed.dash
        });
        if (input.history.length > 40) input.history.pop();
    }

    // Motion checks (Quarter circle forward QCF: down -> down-forward -> forward)
    checkMotionQCF(playerKey, facingRight = true) {
        const history = this.playerInputs[playerKey].history;
        const fwdKey = facingRight ? 'right' : 'left';
        let foundForward = false;
        let foundDownForward = false;
        let foundDown = false;

        for (let i = 0; i < Math.min(20, history.length); i++) {
            const h = history[i];
            if (!foundForward && h[fwdKey] && !h.down) {
                foundForward = true;
                continue;
            }
            if (foundForward && !foundDownForward && h[fwdKey] && h.down) {
                foundDownForward = true;
                continue;
            }
            if (foundDownForward && !foundDown && h.down) {
                foundDown = true;
                return true;
            }
        }
        return false;
    }

    // Double-tap forward dash check (66 or 44)
    checkDoubleTapForward(playerKey, facingRight = true) {
        const history = this.playerInputs[playerKey].history;
        const fwdKey = facingRight ? 'right' : 'left';
        let tapCount = 0;
        let lastState = false;

        for (let i = 0; i < Math.min(18, history.length); i++) {
            const pressed = history[i][fwdKey];
            if (pressed && !lastState) {
                tapCount++;
                if (tapCount >= 2) return true;
            }
            lastState = pressed;
        }
        return false;
    }
}

export const inputManager = new InputManager();
