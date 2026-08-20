// js/core/constants.js - Game Constants & Frame Settings

export const FPS = 60;
export const FRAME_TIME = 1000 / FPS;

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

export const ARENA_BOUNDS = {
    minX: 100,
    maxX: 1900,
    groundY: 600,
    ceilingY: 80,
    width: 2000
};

export const GAME_STATES = {
    MAIN_MENU: 'MAIN_MENU',
    CHAR_SELECT: 'CHAR_SELECT',
    STAGE_SELECT: 'STAGE_SELECT',
    IN_GAME: 'IN_GAME',
    MATCH_OVER: 'MATCH_OVER',
    TRAINING: 'TRAINING',
    ONLINE_LOBBY: 'ONLINE_LOBBY'
};

export const GAME_MODES = {
    LOCAL_VS: 'LOCAL_VS',
    AI_BATTLE: 'AI_BATTLE',
    TRAINING: 'TRAINING',
    ONLINE_PVP: 'ONLINE_PVP',
    TOWER_CLIMB: 'TOWER_CLIMB'
};

export const AI_DIFFICULTIES = {
    EASY: { name: 'EASY', reactionFrames: 24, blockChance: 0.25, comboSkill: 0.2, aggro: 0.4 },
    NORMAL: { name: 'NORMAL', reactionFrames: 14, blockChance: 0.55, comboSkill: 0.5, aggro: 0.65 },
    HARD: { name: 'HARD', reactionFrames: 8, blockChance: 0.80, comboSkill: 0.85, aggro: 0.85 },
    EXPERT: { name: 'EXPERT', reactionFrames: 4, blockChance: 0.95, comboSkill: 1.0, aggro: 0.95 }
};

export const FIGHTER_STATES = {
    IDLE: 'IDLE',
    WALK_FWD: 'WALK_FWD',
    WALK_BWD: 'WALK_BWD',
    CROUCH: 'CROUCH',
    JUMP: 'JUMP',
    FALL: 'FALL',
    DASH_FWD: 'DASH_FWD',
    DASH_BWD: 'DASH_BWD',
    ATTACK: 'ATTACK',
    BLOCK: 'BLOCK',
    PERFECT_BLOCK: 'PERFECT_BLOCK',
    HURT: 'HURT',
    KNOCKBACK: 'KNOCKBACK',
    KNOCKDOWN: 'KNOCKDOWN',
    GETUP: 'GETUP',
    GRAB_ATTEMPT: 'GRAB_ATTEMPT',
    GRABBED: 'GRABBED',
    THROW_EXECUTE: 'THROW_EXECUTE',
    SUPER_STARTUP: 'SUPER_STARTUP',
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT'
};

export const ATTACK_TYPES = {
    LIGHT_PUNCH: 'LIGHT_PUNCH',
    HEAVY_PUNCH: 'HEAVY_PUNCH',
    LIGHT_KICK: 'LIGHT_KICK',
    HEAVY_KICK: 'HEAVY_KICK',
    DASH_STRIKE: 'DASH_STRIKE',
    RISING_KICK: 'RISING_KICK',
    SPECIAL_1: 'SPECIAL_1',
    SPECIAL_2: 'SPECIAL_2',
    SPECIAL_3: 'SPECIAL_3',
    ULTIMATE: 'ULTIMATE',
    GRAB: 'GRAB'
};

export const HIT_LEVELS = {
    HIGH: 'HIGH',       // Hit standing or airborne, can be blocked standing or crouching
    MID: 'MID',         // Overheads: Must be blocked standing
    LOW: 'LOW',         // Lows: Must be blocked crouching
    UNBLOCKABLE: 'UNBLOCKABLE' // Throws and command grabs
};

export const DEFAULT_KEY_BINDINGS = {
    P1: {
        up: 'KeyW',
        down: 'KeyS',
        left: 'KeyA',
        right: 'KeyD',
        lightPunch: 'KeyJ',
        heavyPunch: 'KeyK',
        lightKick: 'KeyU',
        heavyKick: 'KeyI',
        special: 'KeyL',
        ultimate: 'KeyO',
        block: 'KeyH',
        dash: 'Space'
    },
    P2: {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight',
        lightPunch: 'Numpad1',
        heavyPunch: 'Numpad2',
        lightKick: 'Numpad4',
        heavyKick: 'Numpad5',
        special: 'Numpad3',
        ultimate: 'Numpad6',
        block: 'Numpad0',
        dash: 'NumpadEnter'
    }
};

export const PERFECT_BLOCK_WINDOW = 6; // frames
export const MAX_SUPER_METER = 100;
export const MAX_SPECIAL_ENERGY = 100;
export const ROUND_TIME = 60; // seconds
export const ROUNDS_TO_WIN = 2;
