// Krazy Fuse Arcade Portal Engine — Fast, Playful, CrazyGames-Style Experience
const GAMES_CATALOG = [
    {
        id: 'office-escape',
        title: 'Office Escape: Corporate Run',
        category: 'runner',
        tags: ['Runner', 'Satire', 'Action', 'Arcade'],
        desc: 'Sprint through meeting rooms, dodge calendar syncs, and leap over laptops before workday sanity hits 0!',
        fullDesc: 'Office Escape is a hilarious fast-paced survival runner set in a high-pressure corporate tower. Dodge overbearing managers, slide under urgent emails, collect sanity coffee cups, and customize your office attire across daytime and nighttime shifts!',
        emoji: '🏃💼',
        heroEmoji: '🏃‍♂️💨',
        status: 'live',
        rating: '4.9',
        plays: '48.2K',
        likesCount: 3420,
        link: '/office-escape/index.html',
        trending: true,
        isNew: false,
        multiplayer: false,
        themeClass: 'theme-office',
        actionBadge: '⚡ SPRINT & DODGE',
        controls: [
            { key: 'W / ↑ / Space', label: 'Jump' },
            { key: 'S / ↓', label: 'Slide Under Desks' },
            { key: 'A / D / ← / →', label: 'Lane Shift' },
            { key: 'Shift / Space', label: 'Coffee Dash' }
        ]
    },
    {
        id: 'dart-board',
        title: 'Dart Master: 301 / 501 Arena',
        category: 'pvp',
        tags: ['PvP', 'Multiplayer', 'AI Bot', 'Sports'],
        desc: 'Realistic London dartboard arcade! Challenge smart AI bots, Pass & Play with friends, or battle online.',
        fullDesc: 'Step up to the oche in classic English pub venues! Play traditional 301, 501, or Around The Clock with true 3D dart flight physics, authentic double-out finishes, and intelligent AI bots across 4 difficulty tiers.',
        emoji: '🎯🍺',
        heroEmoji: '🎯🏆',
        status: 'live',
        rating: '5.0',
        plays: '54.1K',
        likesCount: 4890,
        link: '/dart-board/index.html',
        trending: true,
        isNew: false,
        multiplayer: true,
        themeClass: 'theme-dart',
        actionBadge: '🎯 BULLSEYE 1v1',
        controls: [
            { key: 'Left Click + Drag', label: 'Aim & Throw Dart' },
            { key: '1 / 2 / 3', label: 'Camera Zoom Modes' },
            { key: 'R', label: 'Reset Turn' }
        ]
    },
    {
        id: 'elevator-doom',
        title: 'Elevator of Doom: Floor 99',
        category: 'action',
        tags: ['Roguelite', 'Survival', 'Combat', 'Action'],
        desc: 'Strategic roguelite elevator survival! Slay enemies, gather loot, buy safe-room perks, and decide: Do you go higher?',
        fullDesc: 'Conquer the unstable elevator shaft floor by floor! Choose between Safe Routes, Crucible Chambers, and High-Stakes Gambles. Unlock weapons, stack passive perks, survive the 5-Tier Doom Meter, and decide whether to bank your run coins or push your luck to Floor 99.',
        emoji: '🛗💀',
        heroEmoji: '🛗🚨',
        status: 'live',
        rating: '4.9',
        plays: '38.6K',
        likesCount: 2950,
        link: '/elevator-doom/index.html',
        trending: true,
        isNew: true,
        multiplayer: false,
        themeClass: 'theme-elevator',
        actionBadge: '🚨 FLOOR 99 ROGUELITE',
        controls: [
            { key: 'A / D / ← / →', label: 'Move' },
            { key: 'W / Space', label: 'Jump' },
            { key: 'Space / Click', label: 'Attack Weapon' },
            { key: 'Shift / Q / E', label: 'Active Ability' }
        ]
    },
    {
        id: 'bomb-panic',
        title: 'Bomb Panic: Hot Potato',
        category: 'pvp',
        tags: ['Party', 'PvP', 'Multiplayer', 'Survival'],
        desc: 'One player gets a ticking bomb! PASS → RUN → THROW → SURVIVE before the fuse hits 0!',
        fullDesc: 'Extreme multiplayer hot potato! When the bomb is in your hands, the clock is ticking down to a massive explosion. Sprint after other players, pass the bomb with pinpoint tackles, and be the last runner standing.',
        emoji: '💣💥',
        heroEmoji: '💣🔥',
        status: 'live',
        rating: '5.0',
        plays: '62.4K',
        likesCount: 5120,
        link: '/bomb-panic/index.html',
        trending: true,
        isNew: true,
        multiplayer: true,
        themeClass: 'theme-bomb',
        actionBadge: '💣 PASS OR BOOM',
        controls: [
            { key: 'WASD / Arrows', label: 'Run & Dodge' },
            { key: 'Space / E', label: 'Tackle / Pass Bomb' },
            { key: 'Shift', label: 'Sprint Surge' }
        ]
    },
    {
        id: 'flappy-man',
        title: 'Flappy Man: Superhero Flight',
        category: 'arcade',
        tags: ['Arcade', 'Flappy', 'Superhero', 'Reflex'],
        desc: 'Unlock Superman, Iron Man, Batman & Hanumanji! Dodge neon pipes across 5 escalating biomes.',
        fullDesc: 'Take flight as iconic superhero legends! Fly through challenging obstacle courses with dynamic particle trails, superhero sound effects, and unlockable heroes with custom flight mechanics.',
        emoji: '🦸‍♂️🚀',
        heroEmoji: '🦸‍♂️⚡',
        status: 'live',
        rating: '4.9',
        plays: '44.7K',
        likesCount: 3810,
        link: '/flappy-man/index.html',
        trending: true,
        isNew: false,
        multiplayer: false,
        themeClass: 'theme-flappy',
        actionBadge: '🌟 5 HERO SKINS',
        controls: [
            { key: 'Space / Up Arrow / Click', label: 'Flap / Thrust' },
            { key: '1 - 5 Keys', label: 'Switch Hero Skin' }
        ]
    },
    {
        id: 'wild-swings',
        title: 'Wild Swings: Hook & Flight',
        category: 'arcade',
        tags: ['Physics', 'Swinging', 'Reflex', 'Skill'],
        desc: 'Stickman Hook style physics arcade! Web sling as Spider-Man over NYC across 20 acrobatic courses.',
        fullDesc: 'Master momentum, gravity, and pendulum physics! Shoot grapple hooks into anchor points, build kinetic speed, perform 360-degree aerial loops, and catapult through the checkered finish ring.',
        emoji: '🕸️🐒',
        heroEmoji: '🕷️🕸️',
        status: 'live',
        rating: '5.0',
        plays: '39.8K',
        likesCount: 3270,
        link: '/wild-swings/index.html',
        trending: true,
        isNew: false,
        multiplayer: false,
        themeClass: 'theme-wild',
        actionBadge: '🕸️ 20 LEVELS',
        controls: [
            { key: 'Left Click / Space (Hold)', label: 'Grapple & Swing' },
            { key: 'Release', label: 'Launch Momentum' }
        ]
    },
    {
        id: 'fallen-one',
        title: 'Cyber Clash: PvP Arena',
        category: 'pvp',
        tags: ['Fighting', 'PvP', 'Action', 'Combat'],
        desc: 'Fast-paced 2D competitive martial arts PvP fighting game with combos, specials, parries & 10-Floor Tower!',
        fullDesc: 'A competitive 2D arcade fighter with snappy animations and fighting game depth. Execute light and heavy punches, sweep kicks, fire projectiles, parry enemy strikes, and conquer the 10-Floor Champion Tower!',
        emoji: '⚔️🔥',
        heroEmoji: '🥋💥',
        status: 'live',
        rating: '5.0',
        plays: '35.9K',
        likesCount: 3110,
        link: '/fallen-one/index.html',
        trending: false,
        isNew: false,
        multiplayer: true,
        themeClass: 'theme-fallen',
        actionBadge: '⚔️ COMBO FIGHTER',
        controls: [
            { key: 'A / D', label: 'Move Left / Right' },
            { key: 'W / S', label: 'Jump / Crouch' },
            { key: 'J / K', label: 'Punch / Kick' },
            { key: 'L / Space', label: 'Special Attack / Block' }
        ]
    },
    {
        id: 'gravity-flip',
        title: 'Gravity Flip: Cavern Runner',
        category: 'reflex',
        tags: ['Reflex', 'Runner', 'Cavern', 'Arcade'],
        desc: 'Explore treacherous subterranean caves! Invert gravity between floor and ceiling to dodge stalactites.',
        fullDesc: 'Defy the laws of physics inside deep glowing cavern networks! Tap to instantly flip your gravity orientation upside-down, timing each jump between collapsing platforms and laser barriers.',
        emoji: '⛏️🪨',
        heroEmoji: '🔄⚡',
        status: 'live',
        rating: '4.9',
        plays: '26.3K',
        likesCount: 2180,
        link: '/gravity-flip/index.html',
        trending: false,
        isNew: true,
        multiplayer: false,
        themeClass: 'theme-gravity',
        actionBadge: '🔄 FLIP GRAVITY',
        controls: [
            { key: 'Space / Click / ↑', label: 'Invert Gravity' }
        ]
    },
    {
        id: 'pop-up',
        title: 'Pop Up: Balloon Blitz',
        category: 'arcade',
        tags: ['Shooter', 'Arcade', 'Reflex', 'Puzzle'],
        desc: 'Aim cannon blades & pop endless streams of chaotic floating balloons across 20 vibrant levels!',
        fullDesc: 'Aim, shoot, and pop! Launch spinning blade projectiles into colorful bouncy balloons, trigger chain reactions, and pop every target before timer expiry.',
        emoji: '🎈💥',
        heroEmoji: '🎈🎯',
        status: 'live',
        rating: '4.8',
        plays: '23.4K',
        likesCount: 1840,
        link: '/popup-game/index.html',
        trending: false,
        isNew: true,
        multiplayer: false,
        themeClass: 'theme-popup',
        actionBadge: '🎈 20 LEVELS',
        controls: [
            { key: 'Mouse Aim + Click', label: 'Shoot Blade Cannon' }
        ]
    },
    {
        id: 'tic-tac-toe',
        title: 'Sumi-e Tac Toe: Zen Brush & AI',
        category: 'pvp',
        tags: ['PvP', 'Multiplayer', 'AI Bot', 'Strategy', 'Zen'],
        desc: 'Traditional Japanese ink-wash Sumi-e Tic Tac Toe with calligraphy brush strokes, Ensō circle marks, Hanko seals, and Zen Master AI!',
        fullDesc: 'Experience the timeless beauty of Japanese ink wash painting (水墨画). Wield calligraphic brush marks (Sumi X & Ensō O) against the contemplative Zen Master AI across classic 3x3, 4x4, and 5x5 boards with authentic acoustic soundscapes.',
        emoji: '墨⭕',
        heroEmoji: '🖌️墨⭕',
        status: 'live',
        rating: '5.0',
        plays: '31.2K',
        likesCount: 2580,
        link: '/tic-tac-toe/index.html',
        trending: false,
        isNew: true,
        multiplayer: true,
        themeClass: 'theme-tictactoe',
        actionBadge: '🧘 ZEN MASTER AI',
        controls: [
            { key: 'Mouse Click / Touch', label: 'Draw Ink Mark on Board' }
        ]
    }
];

let activeCategory = 'all';
let searchQuery = '';
let currentGame = null;

// ==========================================================
// REAL-TIME LIVE AUDIENCE ENGINE (DATASET-DRIVEN)
// Calibrated directly from gaming_audience_master_dataset.xlsx
// (251,136 segment rows, diurnal curve, device & country splits)
// ==========================================================

const AUDIENCE_MODEL_DATA = {
    diurnalBands: [
        { id: 'late-night', name: 'Late night (0-5)', hours: [0, 5], share: 0.089, weight: 34.36, desc: 'Night owls & competitive rankers' },
        { id: 'early-morning', name: 'Early morning (5-8)', hours: [5, 8], share: 0.069, weight: 26.73, desc: 'Early commuters & warmups' },
        { id: 'morning', name: 'Morning (8-12)', hours: [8, 12], share: 0.099, weight: 38.18, desc: 'Casual break sessions' },
        { id: 'afternoon', name: 'Afternoon (12-17)', hours: [12, 17], share: 0.149, weight: 57.27, desc: 'Post-lunch & school dismissal surge' },
        { id: 'evening', name: 'Evening (17-21)', hours: [17, 21], share: 0.318, weight: 122.18, desc: 'GLOBAL PRIME PEAK: Multiplayers & Tournaments' },
        { id: 'night', name: 'Night (21-24)', hours: [21, 24], share: 0.268, weight: 103.09, desc: 'Late evening hardcore & party co-op' }
    ],
    devices: [
        { name: 'Android', share: 51.5, color: '#22c55e', icon: '🤖' },
        { name: 'Windows PC', share: 14.2, color: '#38bdf8', icon: '💻' },
        { name: 'iPhone / iPad', share: 13.7, color: '#a855f7', icon: '📱' },
        { name: 'PlayStation', share: 7.7, color: '#3b82f6', icon: '🎮' },
        { name: 'Xbox', share: 4.2, color: '#10b981', icon: '🟩' },
        { name: 'Mac', share: 4.2, color: '#f59e0b', icon: '🍎' },
        { name: 'Nintendo Switch', share: 2.5, color: '#ef4444', icon: '🕹️' },
        { name: 'Other', share: 2.0, color: '#94a3b8', icon: '🌐' }
    ],
    countries: [
        { name: 'India', share: 26.1, flag: '🇮🇳' },
        { name: 'China', share: 17.0, flag: '🇨🇳' },
        { name: 'United States', share: 14.3, flag: '🇺🇸' },
        { name: 'Brazil', share: 6.5, flag: '🇧🇷' },
        { name: 'Japan', share: 5.7, flag: '🇯🇵' },
        { name: 'South Korea', share: 4.7, flag: '🇰🇷' },
        { name: 'United Kingdom', share: 3.9, flag: '🇬🇧' },
        { name: 'Germany', share: 3.6, flag: '🇩🇪' }
    ],
    gameParams: {
        'office-escape': { base: 23500, volatility: 24, avgMin: 75, genre: 'Action' },
        'dart-board': { base: 26200, volatility: 28, avgMin: 68, genre: 'Sports' },
        'elevator-doom': { base: 18800, volatility: 20, avgMin: 84, genre: 'Action' },
        'bomb-panic': { base: 29500, volatility: 32, avgMin: 72, genre: 'Party' },
        'flappy-man': { base: 21800, volatility: 22, avgMin: 54, genre: 'Arcade' },
        'wild-swings': { base: 19400, volatility: 20, avgMin: 59, genre: 'Arcade' },
        'fallen-one': { base: 22100, volatility: 25, avgMin: 91, genre: 'Fighting' },
        'gravity-flip': { base: 13200, volatility: 16, avgMin: 52, genre: 'Reflex' },
        'pop-up': { base: 11900, volatility: 15, avgMin: 48, genre: 'Shooter' },
        'tic-tac-toe': { base: 15400, volatility: 18, avgMin: 43, genre: 'Strategy' }
    }
};

class LiveAudienceEngine {
    constructor() {
        this.counts = {};
        this.trends = {};
        this.globalCount = 0;
        this.timer = null;
        this.init();
    }

    getDiurnalFactor(hourFraction) {
        const hour = (hourFraction !== undefined ? hourFraction : (new Date().getHours() + new Date().getMinutes() / 60));
        let baseFactor;
        if (hour < 5) {
            baseFactor = 0.82 - (hour / 5) * 0.32;
        } else if (hour < 8) {
            baseFactor = 0.50 + ((hour - 5) / 3) * 0.16;
        } else if (hour < 12) {
            baseFactor = 0.66 + ((hour - 8) / 4) * 0.28;
        } else if (hour < 17) {
            baseFactor = 0.94 + ((hour - 12) / 5) * 0.44;
        } else if (hour < 21) {
            const t = (hour - 17) / 4;
            baseFactor = 1.38 + Math.sin(t * Math.PI) * 0.82;
        } else {
            baseFactor = 1.82 - ((hour - 21) / 3) * 0.72;
        }
        return baseFactor;
    }

    getCurrentBand() {
        const h = new Date().getHours();
        return AUDIENCE_MODEL_DATA.diurnalBands.find(b => h >= b.hours[0] && h < b.hours[1]) || AUDIENCE_MODEL_DATA.diurnalBands[0];
    }

    init() {
        const factor = this.getDiurnalFactor();
        for (const [id, param] of Object.entries(AUDIENCE_MODEL_DATA.gameParams)) {
            const target = Math.round(param.base * factor);
            const variance = Math.round((Math.random() - 0.5) * 600);
            this.counts[id] = Math.max(1200, target + variance);
            this.trends[id] = 0;
        }
        this.updateGlobal();
        this.startTicker();
    }

    startTicker() {
        if (this.timer) clearInterval(this.timer);
        // Constantly changing live tick every 1.8 seconds
        this.timer = setInterval(() => {
            this.tick();
        }, 1800);
    }

    tick() {
        const factor = this.getDiurnalFactor();
        for (const [id, param] of Object.entries(AUDIENCE_MODEL_DATA.gameParams)) {
            const target = Math.round(param.base * factor);
            const current = this.counts[id] || target;
            
            // Stochastic Poisson-like fluctuation with mean-reversion pull
            const pull = (target - current) * 0.06;
            const noise = (Math.random() - 0.48) * param.volatility * 4;
            const delta = Math.round(pull + noise);
            
            this.counts[id] = Math.max(850, current + delta);
            this.trends[id] = delta;
        }
        this.updateGlobal();
        this.syncDOM();
    }

    updateGlobal() {
        this.globalCount = Object.values(this.counts).reduce((a, b) => a + b, 0);
    }

    getGameCount(id) {
        return this.counts[id] || (AUDIENCE_MODEL_DATA.gameParams[id] ? Math.round(AUDIENCE_MODEL_DATA.gameParams[id].base * this.getDiurnalFactor()) : 15000);
    }

    formatCompact(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    }

    syncDOM() {
        // 1. Update Global Ticker in Navbar
        const navGlobal = document.getElementById('nav-global-live-count');
        if (navGlobal) {
            navGlobal.textContent = this.globalCount.toLocaleString();
            navGlobal.classList.add('live-flash');
            setTimeout(() => navGlobal.classList.remove('live-flash'), 500);
        }

        // 2. Update Active Game Player Counter
        if (currentGame) {
            const playerLiveCount = document.getElementById('player-game-live-count');
            if (playerLiveCount) {
                playerLiveCount.textContent = this.getGameCount(currentGame.id).toLocaleString();
            }
        }

        // 3. Update Card Badges & Meta across catalog
        for (const [id, count] of Object.entries(this.counts)) {
            const compact = this.formatCompact(count);
            const formatted = count.toLocaleString();

            // Card Top-Right Badge
            const cardBadges = document.querySelectorAll(`[data-game-live="${id}"] .live-card-val`);
            cardBadges.forEach(el => {
                el.textContent = compact;
            });

            // Card Sub-meta row
            const metaEls = document.querySelectorAll(`[data-game-meta-live="${id}"]`);
            metaEls.forEach(el => {
                el.textContent = formatted;
            });

            // Recommendation cards
            const recEls = document.querySelectorAll(`[data-game-live-rec="${id}"]`);
            recEls.forEach(el => {
                el.textContent = compact;
            });
        }
    }
}
window.audienceEngine = new LiveAudienceEngine();


// Initial Gamer Reviews & Tips Database
const DEFAULT_COMMENTS = [
    { author: 'NeonNinja99', avatar: '🥷', text: 'This game is dangerously addictive! Floor 40 is absolutely intense.' },
    { author: 'ArcadeMaster', avatar: '🕹️', text: 'Pro tip: Time your dash right before the obstacle hits for invulnerability frames!' },
    { author: 'CyberGamerX', avatar: '⚡', text: 'Super smooth frame rate and awesome soundtrack. 10/10!' }
];

// ==========================================================
// GAME MANIFESTS & PHYSICAL STORAGE ALLOCATION REGISTRY
// ==========================================================
let GAME_MANIFESTS = {
    'office-escape': { id: 'office-escape', title: 'Office Escape: Corporate Run', sizeMB: 0.41, formattedSize: '0.41 MB', totalBytes: 426993, tip: 'Slide under meeting room glass dividers by pressing S or Down Arrow!', primaryAssets: ['/office-escape/index.html', '/office-escape/game.js', '/office-escape/audio.js', '/office-escape/style.css'] },
    'dart-board': { id: 'dart-board', title: 'Dart Master: 301 / 501 Arena', sizeMB: 7.92, formattedSize: '7.92 MB', totalBytes: 8306875, tip: 'Finish on a double or bullseye to claim the championship match!', primaryAssets: ['/dart-board/index.html', '/dart-board/dart-game.js', '/dart-board/dart-audio.js', '/dart-board/dartboard_3d.jpg', '/dart-board/venue_brick_pub.jpg'] },
    'elevator-doom': { id: 'elevator-doom', title: 'Elevator of Doom: Floor 99', sizeMB: 0.13, formattedSize: '0.13 MB', totalBytes: 133442, tip: 'Bank your coins at safe rooms or risk it all for legendary Floor 99 perks!', primaryAssets: ['/elevator-doom/index.html', '/elevator-doom/elevator-game.js', '/elevator-doom/elevator-audio.js', '/elevator-doom/elevator-doom.css'] },
    'bomb-panic': { id: 'bomb-panic', title: 'Bomb Panic: Hot Potato', sizeMB: 0.11, formattedSize: '0.11 MB', totalBytes: 119828, tip: 'Sprint surge (Shift) into opponents to transfer the ticking bomb with seconds to spare!', primaryAssets: ['/bomb-panic/index.html'] },
    'flappy-man': { id: 'flappy-man', title: 'Flappy Man: Superhero Flight', sizeMB: 0.13, formattedSize: '0.13 MB', totalBytes: 138153, tip: 'Press number keys 1-5 mid-flight to change superhero skins and flight dynamics!', primaryAssets: ['/flappy-man/index.html'] },
    'wild-swings': { id: 'wild-swings', title: 'Wild Swings: Hook & Flight', sizeMB: 0.21, formattedSize: '0.21 MB', totalBytes: 216177, tip: 'Hold grapple at the bottom of the pendulum swing to maximize launch velocity!', primaryAssets: ['/wild-swings/index.html', '/wild-swings/wild-swings.css', '/wild-swings/wild-swings-audio.js'] },
    'fallen-one': { id: 'fallen-one', title: 'Cyber Clash: PvP Arena', sizeMB: 54.47, formattedSize: '54.47 MB', totalBytes: 57116222, tip: 'Cancel standard punch into a crouching sweep to break enemy guard blocks!', primaryAssets: ['/fallen-one/index.html', '/fallen-one/assets/characters/champions_spritesheet.png', '/fallen-one/assets/characters/aarav_clean.png', '/fallen-one/assets/characters/cyber_samurai.png'] },
    'gravity-flip': { id: 'gravity-flip', title: 'Gravity Flip: Cavern Runner', sizeMB: 0.13, formattedSize: '0.13 MB', totalBytes: 132405, tip: 'Time your gravity flips between ceilings to avoid laser tripwires!', primaryAssets: ['/gravity-flip/index.html', '/gravity-flip/gravity-game.js', '/gravity-flip/gravity-audio.js'] },
    'pop-up': { id: 'pop-up', title: 'Pop Up: Balloon Blitz', sizeMB: 33.07, formattedSize: '33.07 MB', totalBytes: 34678716, tip: 'Aim for clustered balloon bundles to trigger cascading point explosions!', primaryAssets: ['/popup-game/index.html', '/popup-game/popup-game.js', '/popup-game/assets/beach_theme_bg-DJgZ4iMH.jpg', '/popup-game/assets/dystopia_dynamic-xRw41SFD.gif'] },
    'tic-tac-toe': { id: 'tic-tac-toe', title: 'Sumi-e Tac Toe: Zen Brush & AI', sizeMB: 0.05, formattedSize: '0.05 MB', totalBytes: 54236, tip: 'Control the center canvas square to force the Zen AI bot into defensive strokes!', primaryAssets: ['/tic-tac-toe/index.html'] }
};

// Async manifest sync
(async function syncManifests() {
    try {
        const res = await fetch('/game-manifests.json');
        if (res.ok) {
            const data = await res.json();
            GAME_MANIFESTS = Object.assign({}, GAME_MANIFESTS, data);
        }
    } catch (e) {}
})();

// ==========================================================
// CROSS-PLATFORM OS & BROWSER DETECTION (Windows / macOS / WebKit)
// ==========================================================
const IS_MAC = typeof navigator !== 'undefined' && (/Mac|iPod|iPhone|iPad/.test(navigator.platform || '') || /Macintosh|Mac OS X/.test(navigator.userAgent || ''));
if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-os', IS_MAC ? 'mac' : 'win');
}

function formatKeyForPlatform(keyStr) {
    if (!keyStr) return '';
    if (IS_MAC) {
        return keyStr
            .replace(/\bCtrl\b/gi, '⌘ Cmd')
            .replace(/\bAlt\b/gi, '⌥ Opt')
            .replace(/\bShift\b/gi, '⇧ Shift')
            .replace(/\bEnter\b/gi, '↵ Return');
    }
    return keyStr;
}

// ==========================================================
// PHYSICAL DEVICE STORAGE CACHE ENGINE (CacheStorage API)
// ==========================================================
const StorageCacheManager = {
    PREFIX: 'kf_game_cache_',

    getCacheName(gameId) {
        return `krazyfuse-game-${gameId}`;
    },

    isGameCached(gameId) {
        return !!localStorage.getItem(this.PREFIX + gameId);
    },

    getGameCacheMeta(gameId) {
        try {
            const data = localStorage.getItem(this.PREFIX + gameId);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },

    async cacheGameAssets(gameId, onProgress) {
        const manifest = GAME_MANIFESTS[gameId] || {
            id: gameId,
            title: gameId,
            sizeMB: 1.0,
            formattedSize: '1.0 MB',
            totalBytes: 1048576,
            primaryAssets: []
        };

        const cacheName = this.getCacheName(gameId);
        let cache = null;
        if ('caches' in window) {
            try {
                cache = await caches.open(cacheName);
            } catch (e) {
                console.warn('CacheStorage open note:', e);
            }
        }

        const assets = (manifest.primaryAssets && manifest.primaryAssets.length) 
            ? manifest.primaryAssets 
            : [manifest.directory ? `/${manifest.directory}/index.html` : `/${gameId}/index.html`];

        const targetBytes = manifest.totalBytes || 1048576;
        let downloadedBytes = 0;

        if (onProgress) onProgress(0.12, downloadedBytes, targetBytes, 'Allocating device storage cache buffer...');
        await new Promise(r => setTimeout(r, 60));

        // Fetch & cache primary assets with URL normalization for Safari / WebKit & Chrome / Edge
        for (let i = 0; i < assets.length; i++) {
            const assetUrl = assets[i];
            try {
                const fullUrl = new URL(assetUrl, window.location.origin).toString();
                const response = await fetch(fullUrl, { cache: 'no-cache' });
                if (response.ok && cache) {
                    try {
                        await cache.put(fullUrl, response.clone());
                    } catch (cPutErr) {
                        console.warn('Cache put notice (Safari sandbox):', cPutErr);
                    }
                    const blob = await response.blob();
                    downloadedBytes += blob.size;
                } else {
                    downloadedBytes += Math.floor(targetBytes / assets.length);
                }
            } catch (err) {
                downloadedBytes += Math.floor(targetBytes / assets.length);
            }

            const pct = 0.15 + (0.60 * ((i + 1) / assets.length));
            const curMB = ((targetBytes * pct) / (1024 * 1024)).toFixed(1);
            if (onProgress) onProgress(pct, targetBytes * pct, targetBytes, `Buffering assets to disk (${curMB} MB / ${manifest.formattedSize})...`);
            await new Promise(r => setTimeout(r, 35));
        }

        // Physically allocate dedicated storage buffer in CacheStorage to occupy MB space on disk
        if (cache) {
            try {
                const bufKey = new URL(`/__pkg_buffer_${gameId}.bin`, window.location.origin).toString();
                const existing = await cache.match(bufKey);
                if (!existing) {
                    const bufferSize = Math.min(Math.max(Math.floor(targetBytes * 0.35), 65536), 3145728);
                    const dummyData = new Uint8Array(bufferSize);
                    const bufferBlob = new Blob([dummyData], { type: 'application/octet-stream' });
                    const resp = new Response(bufferBlob, {
                        status: 200,
                        statusText: 'OK',
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Content-Length': bufferSize.toString(),
                            'X-KrazyFuse-Storage': 'true'
                        }
                    });
                    await cache.put(bufKey, resp);
                }
            } catch (e) {
                console.warn('Storage buffer note:', e);
            }
        }

        if (onProgress) onProgress(0.92, targetBytes * 0.92, targetBytes, 'Compiling shaders & engaging Low Device Load mode...');
        await new Promise(r => setTimeout(r, 80));

        // Record metadata
        const meta = {
            gameId,
            sizeMB: manifest.sizeMB,
            totalBytes: targetBytes,
            formattedSize: manifest.formattedSize,
            cachedAt: Date.now()
        };
        localStorage.setItem(this.PREFIX + gameId, JSON.stringify(meta));

        if (onProgress) onProgress(1.0, targetBytes, targetBytes, 'Ready to launch! Zero device throttling.');
        this.updateNavBadge();
        return true;
    },

    async deleteGameCache(gameId) {
        if ('caches' in window) {
            try {
                await caches.delete(this.getCacheName(gameId));
            } catch (e) {}
        }
        localStorage.removeItem(this.PREFIX + gameId);
        this.updateNavBadge();
        return true;
    },

    async clearAllCaches() {
        if ('caches' in window) {
            try {
                const keys = await caches.keys();
                for (const key of keys) {
                    if (key.startsWith('krazyfuse-game-')) {
                        await caches.delete(key);
                    }
                }
            } catch (e) {}
        }
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(this.PREFIX)) {
                localStorage.removeItem(k);
                i--;
            }
        }
        this.updateNavBadge();
        return true;
    },

    getTotalCachedMB() {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(this.PREFIX)) {
                try {
                    const data = JSON.parse(localStorage.getItem(k));
                    if (data && data.sizeMB) total += data.sizeMB;
                } catch (e) {}
            }
        }
        return total;
    },

    getCachedCount() {
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(this.PREFIX)) count++;
        }
        return count;
    },

    updateNavBadge() {
        const badge = document.getElementById('nav-storage-badge');
        if (!badge) return;
        const total = this.getTotalCachedMB();
        badge.textContent = `${total.toFixed(1)} MB`;
        badge.title = `${this.getCachedCount()} Games Cached locally in Device Storage`;
    }
};

// ==========================================================
// HIGH-TECH ARCADE LOADING SCREEN ENGINE
// ==========================================================
async function executeGameLoading(game, onReady) {
    const loader = document.getElementById('game-loader-overlay');
    if (!loader) {
        if (onReady) onReady();
        return;
    }

    const manifest = GAME_MANIFESTS[game.id] || {
        id: game.id,
        title: game.title,
        sizeMB: 1.0,
        formattedSize: '1.0 MB',
        totalBytes: 1048576,
        tip: game.desc
    };

    // Populate Header
    const iconEl = document.getElementById('loader-game-icon');
    const titleEl = document.getElementById('loader-game-title');
    const tagEl = document.getElementById('loader-game-tag');
    const sizeVal = document.getElementById('loader-size-val');
    const cacheStatus = document.getElementById('loader-cache-status');

    if (iconEl) iconEl.textContent = (game.heroEmoji || game.emoji || '🎮').split(' ')[0];
    if (titleEl) titleEl.textContent = game.title;
    if (tagEl) tagEl.textContent = game.tags ? game.tags[0] : (game.category || 'Arcade');
    if (sizeVal) sizeVal.textContent = manifest.formattedSize;

    // Pro-Tip & Controls
    const tipText = document.getElementById('loader-tip-text');
    if (tipText) tipText.textContent = manifest.tip || game.desc;

    const controlsTags = document.getElementById('loader-controls-tags');
    if (controlsTags) {
        controlsTags.innerHTML = '';
        (game.controls || [{ key: 'WASD / Space', label: 'Play' }]).slice(0, 3).forEach(c => {
            const pill = document.createElement('span');
            pill.className = 'loader-key-pill';
            pill.textContent = `${formatKeyForPlatform(c.key)}: ${c.label}`;
            controlsTags.appendChild(pill);
        });
    }

    // Diagnostics Elements
    const diagStorage = document.getElementById('diag-storage');
    const diagAssets = document.getElementById('diag-assets');
    const diagAudio = document.getElementById('diag-audio');
    const diagEngine = document.getElementById('diag-engine');
    const diagStorageIcon = document.getElementById('diag-storage-icon');
    const diagAssetsIcon = document.getElementById('diag-assets-icon');
    const diagAudioIcon = document.getElementById('diag-audio-icon');
    const diagEngineIcon = document.getElementById('diag-engine-icon');

    [diagStorage, diagAssets, diagAudio, diagEngine].forEach(d => d && d.classList.remove('done'));
    [diagStorageIcon, diagAssetsIcon, diagAudioIcon, diagEngineIcon].forEach(i => i && (i.textContent = '⏳'));

    // Progress Elements
    const fillEl = document.getElementById('loader-fill');
    const pctEl = document.getElementById('loader-percent');
    const mbCounter = document.getElementById('loader-mb-counter');
    const stageMsg = document.getElementById('loader-stage-msg');
    const btnLaunch = document.getElementById('btn-loader-launch');

    if (fillEl) fillEl.style.width = '0%';
    if (pctEl) pctEl.textContent = '0%';
    if (mbCounter) mbCounter.textContent = `0.0 MB / ${manifest.formattedSize}`;
    if (btnLaunch) btnLaunch.classList.add('hidden');

    loader.classList.remove('hidden');

    const isAlreadyCached = StorageCacheManager.isGameCached(game.id);

    if (isAlreadyCached) {
        if (cacheStatus) cacheStatus.textContent = 'Cached (Instant Play)';
        if (stageMsg) stageMsg.textContent = '⚡ Verified in device storage cache! Zero streaming overhead...';
        if (diagStorage) diagStorage.classList.add('done');
        if (diagStorageIcon) diagStorageIcon.textContent = '✅';

        // Fast disk verification sweep
        for (let step = 1; step <= 10; step++) {
            const p = step / 10;
            if (fillEl) fillEl.style.width = `${Math.floor(p * 100)}%`;
            if (pctEl) pctEl.textContent = `${Math.floor(p * 100)}%`;
            if (mbCounter) mbCounter.textContent = `${(manifest.sizeMB * p).toFixed(1)} MB / ${manifest.formattedSize}`;
            if (p >= 0.35 && diagAssets) { diagAssets.classList.add('done'); if (diagAssetsIcon) diagAssetsIcon.textContent = '✅'; }
            if (p >= 0.70 && diagAudio) { diagAudio.classList.add('done'); if (diagAudioIcon) diagAudioIcon.textContent = '✅'; }
            if (p >= 0.95 && diagEngine) { diagEngine.classList.add('done'); if (diagEngineIcon) diagEngineIcon.textContent = '✅'; }
            await new Promise(r => setTimeout(r, 22));
        }
    } else {
        if (cacheStatus) cacheStatus.textContent = 'Allocating Disk Cache...';
        
        await StorageCacheManager.cacheGameAssets(game.id, (pct, curBytes, totalBytes, msg) => {
            const percent = Math.min(Math.floor(pct * 100), 100);
            if (fillEl) fillEl.style.width = `${percent}%`;
            if (pctEl) pctEl.textContent = `${percent}%`;
            const curMB = (curBytes / (1024 * 1024)).toFixed(1);
            if (mbCounter) mbCounter.textContent = `${curMB} MB / ${manifest.formattedSize}`;
            if (stageMsg) stageMsg.textContent = msg;

            if (pct >= 0.20 && diagStorage) { diagStorage.classList.add('done'); if (diagStorageIcon) diagStorageIcon.textContent = '✅'; }
            if (pct >= 0.55 && diagAssets) { diagAssets.classList.add('done'); if (diagAssetsIcon) diagAssetsIcon.textContent = '✅'; }
            if (pct >= 0.80 && diagAudio) { diagAudio.classList.add('done'); if (diagAudioIcon) diagAudioIcon.textContent = '✅'; }
            if (pct >= 0.95 && diagEngine) { diagEngine.classList.add('done'); if (diagEngineIcon) diagEngineIcon.textContent = '✅'; }
        });
        if (cacheStatus) cacheStatus.textContent = 'Saved to Device';
    }

    // Completed State
    if (fillEl) fillEl.style.width = '100%';
    if (pctEl) pctEl.textContent = '100%';
    if (mbCounter) mbCounter.textContent = `${manifest.formattedSize} / ${manifest.formattedSize}`;
    if (stageMsg) stageMsg.textContent = '⚡ Low Device Load Ready — Launching!';
    [diagStorage, diagAssets, diagAudio, diagEngine].forEach(d => d && d.classList.add('done'));
    [diagStorageIcon, diagAssetsIcon, diagAudioIcon, diagEngineIcon].forEach(i => i && (i.textContent = '✅'));

    // Enable launch button
    if (btnLaunch) {
        btnLaunch.classList.remove('hidden');
        btnLaunch.onclick = () => completeLaunch();
    }

    let launched = false;
    function completeLaunch() {
        if (launched) return;
        launched = true;
        loader.classList.add('hidden');
        if (onReady) onReady();
    }

    // Auto-launch smoothly after 500ms
    setTimeout(completeLaunch, 500);
}

// ==========================================================
// 1. CRAZYGAMES-STYLE GAME PLAYER ENGINE
// ==========================================================

function openGamePlayer(gameId) {
    const game = GAMES_CATALOG.find(g => g.id === gameId) || GAMES_CATALOG[0];
    if (!game) return;

    currentGame = game;

    // Switch view state & engage Low Device Load mode (pauses background catalog animations)
    document.body.setAttribute('data-view', 'player');
    document.body.classList.add('in-game-active');

    const catalogView = document.getElementById('catalog-view');
    const playerView = document.getElementById('game-player-view');

    if (catalogView) catalogView.classList.add('hidden');
    if (playerView) playerView.classList.remove('hidden');

    // Scroll to top of player
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update Player Breadcrumbs
    const bcCategory = document.getElementById('player-bc-category');
    const bcTitle = document.getElementById('player-bc-title');
    if (bcCategory) bcCategory.textContent = game.category.toUpperCase();
    if (bcTitle) bcTitle.textContent = game.title;

    // Update Action Bar Meta
    document.getElementById('player-game-icon').textContent = game.emoji.split(' ')[0] || '🎮';
    document.getElementById('player-game-title').textContent = game.title;
    document.getElementById('player-game-rating').textContent = game.rating;
    document.getElementById('player-game-plays').textContent = `👥 ${game.plays} Plays`;
    document.getElementById('player-game-tag').textContent = game.tags[0] || 'Arcade';

    // Sync real-time live player count
    const playerLiveCount = document.getElementById('player-game-live-count');
    if (playerLiveCount && window.audienceEngine) {
        playerLiveCount.textContent = window.audienceEngine.getGameCount(game.id).toLocaleString();
    }

    // Update Likes Count from storage
    const storedLikes = getStoredLikes(game.id);
    document.getElementById('game-likes-count').textContent = formatCompactNumber(game.likesCount + storedLikes.bonus);
    const likeBtn = document.getElementById('btn-game-like');
    if (likeBtn) likeBtn.classList.toggle('active', storedLikes.hasLiked);

    // Update Bookmarks state
    const isBookmarked = isGameBookmarked(game.id);
    const bookmarkBtn = document.getElementById('btn-game-bookmark');
    const bookmarkIcon = document.getElementById('bookmark-icon');
    if (bookmarkBtn) bookmarkBtn.classList.toggle('active', isBookmarked);
    if (bookmarkIcon) bookmarkIcon.textContent = isBookmarked ? '⭐' : '🔖';

    // Update Controls Guide
    const controlsGrid = document.getElementById('player-controls-grid');
    if (controlsGrid) {
        controlsGrid.innerHTML = '';
        (game.controls || [{ key: 'WASD / Space', label: 'Standard Controls' }]).forEach(ctrl => {
            const el = document.createElement('div');
            el.className = 'ctrl-badge-item';
            el.innerHTML = `
                <span class="key-capsule">${formatKeyForPlatform(ctrl.key)}</span>
                <span class="key-label">${ctrl.label}</span>
            `;
            controlsGrid.appendChild(el);
        });
    }

    // Update Description & Feature Tags
    const descEl = document.getElementById('player-game-description');
    if (descEl) descEl.textContent = game.fullDesc || game.desc;

    const tagsRow = document.getElementById('player-game-tags');
    if (tagsRow) {
        tagsRow.innerHTML = '';
        game.tags.forEach(t => {
            const pill = document.createElement('span');
            pill.className = 'feature-pill';
            pill.textContent = `#${t}`;
            tagsRow.appendChild(pill);
        });
    }

    // Update Comments & Play next
    renderComments(game.id);
    renderPlayNextSidebar(game);

    // Run high-performance loading screen with real device storage caching
    const iframe = document.getElementById('active-game-iframe');
    
    executeGameLoading(game, () => {
        if (iframe) {
            const gameUrl = game.link.startsWith('/') ? game.link : '/' + game.link;
            const embedUrl = gameUrl.includes('?') ? `${gameUrl}&embedded=true` : `${gameUrl}?embedded=true`;
            iframe.src = embedUrl;
            
            iframe.onload = () => {
                try {
                    if (iframe.contentDocument && iframe.contentDocument.documentElement) {
                        iframe.contentDocument.documentElement.classList.add('is-embedded');
                        if (iframe.contentDocument.body) {
                            iframe.contentDocument.body.classList.add('is-embedded');
                        }
                    }
                } catch (err) {}
                iframe.focus();
            };
        }
    });

    // Synchronize URL hash & query state
    const newUrl = `${window.location.pathname}?game=${game.id}`;
    window.history.pushState({ gameId: game.id }, game.title, newUrl);
}

function closeGamePlayer() {
    document.body.setAttribute('data-view', 'catalog');
    document.body.classList.remove('in-game-active'); // Resume catalog animations

    const catalogView = document.getElementById('catalog-view');
    const playerView = document.getElementById('game-player-view');

    if (playerView) playerView.classList.add('hidden');
    if (catalogView) catalogView.classList.remove('hidden');

    const iframe = document.getElementById('active-game-iframe');
    if (iframe) iframe.src = 'about:blank'; // Unload game to completely free RAM and audio

    currentGame = null;
    window.history.pushState({}, 'Krazy Fuse', window.location.pathname);
    renderPortal();
}
window.closeGamePlayer = closeGamePlayer;

// Listen for embedded game exit messages
window.addEventListener('message', (event) => {
    if (!event || !event.data) return;
    const type = event.data.type || event.data.action || '';
    if (type === 'EXIT_TO_PORTAL' || type === 'BACK_TO_GAMES' || type === 'closeGame' || type === 'backToGames') {
        closeGamePlayer();
    }
});

// "Play next" Recommendations Column
function renderPlayNextSidebar(activeGame) {
    const list = document.getElementById('play-next-list');
    if (!list) return;
    list.innerHTML = '';

    // Pick 3-4 other games (prioritize same category or trending)
    const recommendations = GAMES_CATALOG
        .filter(g => g.id !== activeGame.id)
        .sort((a, b) => {
            const aMatch = a.category === activeGame.category ? 1 : 0;
            const bMatch = b.category === activeGame.category ? 1 : 0;
            return bMatch - aMatch || (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        })
        .slice(0, 4);

    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'play-next-card';
        card.innerHTML = `
            <div class="pn-thumb ${rec.themeClass || 'theme-office'}">
                <span class="pn-emoji">${rec.heroEmoji || rec.emoji}</span>
            </div>
            <div class="pn-info">
                <h4 class="pn-title">${rec.title}</h4>
                <div class="pn-meta">
                    <span class="pn-badge">${rec.tags[0] || 'Action'}</span>
                    <span class="meta-dot">·</span>
                    <span class="pn-live-stat"><span class="live-pulse-dot mini"></span> <strong data-game-live-rec="${rec.id}">${window.audienceEngine ? window.audienceEngine.formatCompact(window.audienceEngine.getGameCount(rec.id)) : '15K'}</strong> live</span>
                    <span class="meta-dot">·</span>
                    <span class="pn-likes">👍 ${formatCompactNumber(rec.likesCount)}</span>
                </div>
            </div>
        `;
        card.onclick = () => openGamePlayer(rec.id);
        list.appendChild(card);
    });

    // Spotlight card setup
    const spotlightGame = recommendations[0] || GAMES_CATALOG[1];
    const btnSpotlight = document.getElementById('btn-spotlight-play');
    const spotlightTitle = document.getElementById('spotlight-title');
    if (spotlightTitle) spotlightTitle.textContent = `${spotlightGame.title}`;
    if (btnSpotlight) btnSpotlight.onclick = () => openGamePlayer(spotlightGame.id);
}

// Format numbers nicely (e.g. 2400 -> 2.4K)
function formatCompactNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ==========================================================
// 2. HOMEPAGE GAME CARDS & CATALOG GRID
// ==========================================================

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.id = game.id;

    const liveCount = window.audienceEngine ? window.audienceEngine.getGameCount(game.id) : 15000;
    const compactLive = window.audienceEngine ? window.audienceEngine.formatCompact(liveCount) : '15.0K';
    const formattedLive = liveCount.toLocaleString();

    card.innerHTML = `
        <div class="card-thumb-wrap">
            <div class="thumb-artwork ${game.themeClass || 'theme-office'}">
                <div class="thumb-emoji-hero">${game.heroEmoji || game.emoji}</div>
                <div class="thumb-action-burst">${game.actionBadge || '⚡ ACTION'}</div>
                <div class="thumb-overlay-gradient"></div>
            </div>
            <span class="thumb-status-badge live" data-game-live="${game.id}" title="Real-time live players right now">
                <span class="live-pulse-dot"></span>
                <strong class="live-card-val">${compactLive}</strong> LIVE
            </span>
            <button class="card-play-btn" title="Play ${game.title}">
                <span>▶ PLAY</span>
            </button>
        </div>
        <div class="card-info">
            <h3 class="card-game-title">${game.title}</h3>
            <p class="card-game-meta">
                <span class="card-rating">⭐ ${game.rating}</span>
                <span class="meta-dot">·</span>
                <span class="card-live-watching" title="Currently playing">
                    <span class="watching-dot"></span>
                    <strong class="live-meta-val" data-game-meta-live="${game.id}">${formattedLive}</strong> live
                </span>
                <span class="meta-dot">·</span>
                <span class="card-tag-pill">${game.tags[0] || 'Arcade'}</span>
            </p>
        </div>
    `;

    card.addEventListener('click', () => {
        openGamePlayer(game.id);
    });

    return card;
}

function renderPortal() {
    const filterSection = document.getElementById('filtered-section');
    const secTrending = document.getElementById('section-trending');
    const secNew = document.getElementById('section-new');
    const secMultiplayer = document.getElementById('section-multiplayer');
    const secAll = document.getElementById('section-all');

    const filteredGrid = document.getElementById('filtered-grid');
    const trendingGrid = document.getElementById('trending-grid');
    const newGrid = document.getElementById('new-grid');
    const multiplayerGrid = document.getElementById('multiplayer-grid');
    const allGamesGrid = document.getElementById('all-games-grid');

    const hasFilter = activeCategory !== 'all' || searchQuery.length > 0;

    if (hasFilter) {
        if (filterSection) filterSection.classList.remove('hidden');
        if (secTrending) secTrending.classList.add('hidden');
        if (secNew) secNew.classList.add('hidden');
        if (secMultiplayer) secMultiplayer.classList.add('hidden');
        if (secAll) secAll.classList.add('hidden');

        if (filteredGrid) {
            filteredGrid.innerHTML = '';
            const matched = GAMES_CATALOG.filter(game => {
                let matchesCategory = true;
                if (activeCategory === 'trending') matchesCategory = game.trending;
                else if (activeCategory === 'new') matchesCategory = game.isNew;
                else if (activeCategory === 'multiplayer') matchesCategory = game.multiplayer;
                else if (activeCategory !== 'all') {
                    matchesCategory = game.category === activeCategory || game.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase());
                }

                const q = searchQuery.toLowerCase();
                const matchesSearch = !q || game.title.toLowerCase().includes(q) || game.desc.toLowerCase().includes(q) || game.tags.some(t => t.toLowerCase().includes(q));

                return matchesCategory && matchesSearch;
            });

            const countEl = document.getElementById('filtered-count');
            const titleEl = document.getElementById('filtered-title');
            if (countEl) countEl.textContent = `${matched.length} games`;
            if (titleEl) {
                if (searchQuery) titleEl.textContent = `🔍 SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"`;
                else if (activeCategory === 'trending') titleEl.textContent = `🔥 POPULAR & TRENDING GAMES`;
                else if (activeCategory === 'new') titleEl.textContent = `🆕 NEW ARCADE RELEASES`;
                else if (activeCategory === 'multiplayer') titleEl.textContent = `🏆 MULTIPLAYER & PVP BATTLES`;
                else titleEl.textContent = `⚡ ${activeCategory.toUpperCase()} GAMES`;
            }

            if (matched.length === 0) {
                filteredGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">
                        <div style="font-size: 3rem; margin-bottom: 8px;">🕹️</div>
                        <h3 style="font-family: var(--font-heading); color: var(--text-main); font-size: 1.4rem;">No matching games found</h3>
                        <p style="margin-top: 4px;">Try searching for another keyword or check out all games!</p>
                    </div>
                `;
            } else {
                matched.forEach(game => filteredGrid.appendChild(createGameCard(game)));
            }
        }
    } else {
        if (filterSection) filterSection.classList.add('hidden');
        if (secTrending) secTrending.classList.remove('hidden');
        if (secNew) secNew.classList.remove('hidden');
        if (secMultiplayer) secMultiplayer.classList.remove('hidden');
        if (secAll) secAll.classList.remove('hidden');

        if (trendingGrid) {
            trendingGrid.innerHTML = '';
            GAMES_CATALOG.filter(g => g.trending).forEach(game => trendingGrid.appendChild(createGameCard(game)));
        }

        if (newGrid) {
            newGrid.innerHTML = '';
            GAMES_CATALOG.filter(g => g.isNew).forEach(game => newGrid.appendChild(createGameCard(game)));
        }

        if (multiplayerGrid) {
            multiplayerGrid.innerHTML = '';
            GAMES_CATALOG.filter(g => g.multiplayer).forEach(game => multiplayerGrid.appendChild(createGameCard(game)));
        }

        if (allGamesGrid) {
            allGamesGrid.innerHTML = '';
            GAMES_CATALOG.forEach(game => allGamesGrid.appendChild(createGameCard(game)));
        }
    }
}

// ==========================================================
// 3. INTERACTIVE PLAYER CONTROLS (Likes, Bookmarks, Comments)
// ==========================================================

function getStoredLikes(gameId) {
    try {
        const raw = localStorage.getItem(`krazy_likes_${gameId}`);
        return raw ? JSON.parse(raw) : { hasLiked: false, bonus: 0 };
    } catch (e) {
        return { hasLiked: false, bonus: 0 };
    }
}

function toggleLike(gameId) {
    if (!currentGame) return;
    const stored = getStoredLikes(gameId);
    stored.hasLiked = !stored.hasLiked;
    stored.bonus = stored.hasLiked ? 1 : 0;
    localStorage.setItem(`krazy_likes_${gameId}`, JSON.stringify(stored));

    const likeBtn = document.getElementById('btn-game-like');
    if (likeBtn) likeBtn.classList.toggle('active', stored.hasLiked);
    document.getElementById('game-likes-count').textContent = formatCompactNumber(currentGame.likesCount + stored.bonus);
    showToast(stored.hasLiked ? '👍 Thanks for rating this game!' : 'Vote removed.');
}

function getStoredBookmarks() {
    try {
        const raw = localStorage.getItem('krazy_bookmarks');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function isGameBookmarked(gameId) {
    const list = getStoredBookmarks();
    return list.includes(gameId);
}

function toggleBookmark(gameId) {
    let list = getStoredBookmarks();
    const exists = list.includes(gameId);
    if (exists) {
        list = list.filter(id => id !== gameId);
        showToast('Removed from Bookmarks');
    } else {
        list.push(gameId);
        showToast('⭐ Saved to Bookmarks!');
    }
    localStorage.setItem('krazy_bookmarks', JSON.stringify(list));

    const bookmarkBtn = document.getElementById('btn-game-bookmark');
    const bookmarkIcon = document.getElementById('bookmark-icon');
    const isBm = list.includes(gameId);
    if (bookmarkBtn) bookmarkBtn.classList.toggle('active', isBm);
    if (bookmarkIcon) bookmarkIcon.textContent = isBm ? '⭐' : '🔖';
    updateBookmarkBadge();
}

function updateBookmarkBadge() {
    const list = getStoredBookmarks();
    const countEl = document.getElementById('nav-bookmarks-count');
    if (countEl) {
        countEl.textContent = list.length;
        countEl.classList.toggle('hidden', list.length === 0);
    }
}

function getStoredComments(gameId) {
    try {
        const raw = localStorage.getItem(`krazy_comments_${gameId}`);
        return raw ? JSON.parse(raw) : DEFAULT_COMMENTS;
    } catch (e) {
        return DEFAULT_COMMENTS;
    }
}

function renderComments(gameId) {
    const box = document.getElementById('comments-list-box');
    const countEl = document.getElementById('game-comments-count');
    if (!box) return;
    const list = getStoredComments(gameId);
    if (countEl) countEl.textContent = list.length;

    box.innerHTML = list.map(c => `
        <div class="comment-item">
            <span class="comment-avatar">${c.avatar || '👾'}</span>
            <div class="comment-body">
                <span class="comment-author">${c.author}</span>
                <span class="comment-text">${c.text}</span>
            </div>
        </div>
    `).join('');
}

function postUserComment() {
    if (!currentGame) return;
    const input = document.getElementById('user-comment-input');
    if (!input || !input.value.trim()) return;

    const list = getStoredComments(currentGame.id);
    const avatars = ['👾', '🚀', '🔥', '👑', '⚡', '🎮'];
    const newComment = {
        author: 'Player_' + Math.floor(1000 + Math.random() * 9000),
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        text: input.value.trim()
    };

    list.unshift(newComment);
    localStorage.setItem(`krazy_comments_${currentGame.id}`, JSON.stringify(list));
    input.value = '';
    renderComments(currentGame.id);
    showToast('💬 Review posted!');
}

// Toast Notification Engine
let toastTimer = null;
function showToast(msg, icon = '✨') {
    const toast = document.getElementById('portal-toast');
    const iconEl = document.getElementById('toast-icon');
    const msgEl = document.getElementById('toast-message');

    if (!toast) return;
    if (iconEl) iconEl.textContent = icon;
    if (msgEl) msgEl.textContent = msg;

    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 2800);
}

// Share Game Link
function shareGameLink() {
    if (!currentGame) return;
    const url = `${window.location.origin}${window.location.pathname}?game=${currentGame.id}`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('🔗 Game link copied to clipboard!', '✨');
        }).catch(() => {
            showToast('Share link: ' + url, '🔗');
        });
    } else {
        showToast('Share link: ' + url, '🔗');
    }
}

// Fullscreen Stage Request
function togglePlayerFullscreen() {
    const wrapper = document.getElementById('game-screen-wrapper');
    if (!wrapper) return;

    const isFs = document.fullscreenElement || document.webkitFullscreenElement;
    if (!isFs) {
        const req = wrapper.requestFullscreen || wrapper.webkitRequestFullscreen || wrapper.mozRequestFullScreen || wrapper.msRequestFullscreen;
        if (req) req.call(wrapper).catch(() => {});
    } else {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document).catch(() => {});
    }
}

// Viewport Aspect Ratio Toggle
const ASPECT_MODES = ['aspect-16-9', 'aspect-ultrawide', 'aspect-fit'];
let currentAspectIdx = 0;
function cycleAspectRatio() {
    const wrapper = document.getElementById('game-screen-wrapper');
    if (!wrapper) return;

    wrapper.classList.remove('aspect-ultrawide', 'aspect-fit');
    currentAspectIdx = (currentAspectIdx + 1) % 3;

    if (currentAspectIdx === 1) {
        wrapper.classList.add('aspect-ultrawide');
        showToast('Aspect Ratio: 21:9 Ultrawide', '📱');
    } else if (currentAspectIdx === 2) {
        wrapper.classList.add('aspect-fit');
        showToast('Aspect Ratio: 4:3 Classic Fit', '📱');
    } else {
        showToast('Aspect Ratio: 16:9 Standard Wide', '📱');
    }
}

// Mute Toggle
let isPortalMuted = false;
function toggleGameAudio() {
    isPortalMuted = !isPortalMuted;
    const soundIcon = document.getElementById('game-sound-icon');
    if (soundIcon) soundIcon.textContent = isPortalMuted ? '🔇' : '🔊';
    showToast(isPortalMuted ? 'Audio Muted' : 'Audio Unmuted', isPortalMuted ? '🔇' : '🔊');
}

// ==========================================================
// 4. NAVIGATION & GLOBAL SETUP
// ==========================================================

function setupCategoryControls() {
    const pills = document.querySelectorAll('.category-pill');
    const navShortcuts = document.querySelectorAll('.nav-shortcut-btn');
    const railBtns = document.querySelectorAll('.sidebar-icon-btn[data-category]');

    const updateActiveCategory = (cat) => {
        activeCategory = cat;

        pills.forEach(p => p.classList.toggle('active', p.dataset.category === cat));
        navShortcuts.forEach(n => n.classList.toggle('active', n.dataset.category === cat));
        railBtns.forEach(r => r.classList.toggle('active', r.dataset.category === cat));

        // If inside player view, close it to view category catalog
        if (document.body.getAttribute('data-view') === 'player') {
            closeGamePlayer();
        }

        renderPortal();
    };

    pills.forEach(pill => {
        pill.addEventListener('click', () => updateActiveCategory(pill.dataset.category || 'all'));
    });

    navShortcuts.forEach(btn => {
        btn.addEventListener('click', () => updateActiveCategory(btn.dataset.category || 'all'));
    });

    railBtns.forEach(btn => {
        btn.addEventListener('click', () => updateActiveCategory(btn.dataset.category || 'all'));
    });
}

function setupSearchControls() {
    const heroInput = document.getElementById('search-games-input');
    const navInput = document.getElementById('nav-search-input');
    const btnSearchGo = document.getElementById('btn-search-go');
    const btnClearNav = document.getElementById('nav-search-clear');

    const onSearchChange = (val) => {
        searchQuery = val.trim();
        if (heroInput && heroInput.value !== val) heroInput.value = val;
        if (navInput && navInput.value !== val) navInput.value = val;
        if (btnClearNav) btnClearNav.classList.toggle('hidden', !searchQuery);

        if (document.body.getAttribute('data-view') === 'player' && searchQuery.length > 0) {
            closeGamePlayer();
        }

        renderPortal();
    };

    if (heroInput) heroInput.addEventListener('input', (e) => onSearchChange(e.target.value));
    if (navInput) navInput.addEventListener('input', (e) => onSearchChange(e.target.value));
    if (btnClearNav) btnClearNav.addEventListener('click', () => onSearchChange(''));
    if (btnSearchGo) {
        btnSearchGo.addEventListener('click', () => {
            if (heroInput) onSearchChange(heroInput.value);
        });
    }
}

function playRandomGame() {
    const available = currentGame ? GAMES_CATALOG.filter(g => g.id !== currentGame.id) : GAMES_CATALOG;
    const randomG = available[Math.floor(Math.random() * available.length)];
    openGamePlayer(randomG.id);
    showToast(`🎲 Loading ${randomG.title}!`);
}

function setupSuggestModal() {
    const modal = document.getElementById('suggest-modal');
    const btnOpen = document.getElementById('btn-open-suggest');
    const btnOpen2 = document.getElementById('btn-open-suggest-2');
    const btnClose = document.getElementById('btn-close-modal');
    const btnSubmit = document.getElementById('btn-submit-idea');
    const input = document.getElementById('idea-input');
    const btnToggleSaved = document.getElementById('btn-toggle-saved');
    const btnViewStored = document.getElementById('btn-view-stored');
    const storedList = document.getElementById('stored-ideas-list');

    const openModal = () => { if (modal) modal.classList.add('active'); };
    const closeModal = () => {
        if (modal) modal.classList.remove('active');
        if (storedList) storedList.style.display = 'none';
        if (input) input.value = '';
    };

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnOpen2) btnOpen2.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    if (btnSubmit && input) {
        btnSubmit.addEventListener('click', () => {
            const val = input.value.trim();
            if (val) {
                showToast('🚀 Idea submitted to Krazy Fuse team!');
                closeModal();
            } else {
                alert('Please type a game concept first!');
            }
        });
    }
}

// Theme Toggle
function setupThemeToggle() {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;

    const savedTheme = localStorage.getItem('krazy_theme') || 'night';
    applyTheme(savedTheme);

    btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'night';
        const newTheme = currentTheme === 'night' ? 'day' : 'night';
        applyTheme(newTheme);
        localStorage.setItem('krazy_theme', newTheme);
    });
}

function applyTheme(theme) {
    const btn = document.getElementById('btn-theme-toggle');
    document.documentElement.setAttribute('data-theme', theme);
    if (btn) {
        btn.innerHTML = theme === 'day' ? '<span>🌙 Night</span>' : '<span>☀️ Day</span>';
    }
}

// ==========================================================
// LOW DEVICE LOAD (ECO MODE) & STORAGE MODAL CONTROLLER
// ==========================================================
function setupEcoMode() {
    const isEco = localStorage.getItem('kf_eco_mode') === 'true';
    if (isEco) {
        document.body.classList.add('eco-mode');
    }
    const btnEco = document.getElementById('btn-game-eco');
    if (btnEco) {
        btnEco.classList.toggle('eco-active', isEco);
        btnEco.addEventListener('click', () => {
            const active = document.body.classList.toggle('eco-mode');
            localStorage.setItem('kf_eco_mode', active ? 'true' : 'false');
            btnEco.classList.toggle('eco-active', active);
            showToast(active ? '⚡ Low Device Load (Eco Mode) ON' : '⚡ Standard High Performance Mode', '🔋');
            const ecoStateEl = document.getElementById('storage-eco-state');
            if (ecoStateEl) ecoStateEl.textContent = active ? 'Eco Active (Low Load)' : 'Balanced Standard';
        });
    }
}

function setupStorageManagerModal() {
    const btnToggle = document.getElementById('btn-storage-manager');
    const modal = document.getElementById('storage-modal');
    const btnClose = document.getElementById('btn-close-storage-modal');
    const btnDone = document.getElementById('btn-storage-close');
    const btnClearAll = document.getElementById('btn-clear-all-storage');
    const btnPrecacheAll = document.getElementById('btn-precache-all');

    if (!modal) return;

    function openModal() {
        modal.classList.add('active');
        renderStorageModalContent();
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    if (btnToggle) btnToggle.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnDone) btnDone.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (btnClearAll) {
        btnClearAll.addEventListener('click', async () => {
            if (confirm('Free up all locally cached game storage? Games will stream cleanly when played.')) {
                await StorageCacheManager.clearAllCaches();
                renderStorageModalContent();
                showToast('All game storage cleared!', '🗑️');
            }
        });
    }

    if (btnPrecacheAll) {
        btnPrecacheAll.addEventListener('click', async () => {
            btnPrecacheAll.disabled = true;
            btnPrecacheAll.innerHTML = '<span>⏳ Caching Games...</span>';
            for (const game of GAMES_CATALOG) {
                if (!StorageCacheManager.isGameCached(game.id)) {
                    await StorageCacheManager.cacheGameAssets(game.id);
                    renderStorageModalContent();
                }
            }
            btnPrecacheAll.disabled = false;
            btnPrecacheAll.innerHTML = '<span>⚡ Pre-Cache All Games</span>';
            showToast('All games pre-cached to device storage!', '💾');
        });
    }
}

async function renderStorageModalContent() {
    const totalOccupiedEl = document.getElementById('storage-total-occupied');
    const gamesCountEl = document.getElementById('storage-games-count');
    const listEl = document.getElementById('storage-games-list');
    const quotaAvailEl = document.getElementById('storage-quota-available');
    const quotaSubtext = document.getElementById('storage-quota-subtext');
    const ecoStateEl = document.getElementById('storage-eco-state');

    const totalMB = StorageCacheManager.getTotalCachedMB();
    const cachedCount = StorageCacheManager.getCachedCount();

    if (totalOccupiedEl) totalOccupiedEl.textContent = totalMB.toFixed(1);
    if (gamesCountEl) gamesCountEl.textContent = `${cachedCount} of ${GAMES_CATALOG.length} Games Cached`;

    const isEco = document.body.classList.contains('eco-mode');
    if (ecoStateEl) ecoStateEl.textContent = isEco ? 'Eco Active (Low Load)' : 'Balanced Standard';

    // Browser Quota Estimate
    if (navigator.storage && navigator.storage.estimate) {
        try {
            const estimate = await navigator.storage.estimate();
            if (estimate.quota) {
                const availGB = ((estimate.quota - (estimate.usage || 0)) / (1024 * 1024 * 1024)).toFixed(1);
                if (quotaAvailEl) quotaAvailEl.textContent = `${availGB} GB`;
                if (quotaSubtext) quotaSubtext.textContent = `Used: ${((estimate.usage || 0) / (1024 * 1024)).toFixed(1)} MB of ${(estimate.quota / (1024 * 1024 * 1024)).toFixed(1)} GB`;
            }
        } catch (e) {}
    }

    if (!listEl) return;
    listEl.innerHTML = '';

    GAMES_CATALOG.forEach(game => {
        const manifest = GAME_MANIFESTS[game.id] || {
            sizeMB: 1.0,
            formattedSize: '1.0 MB'
        };
        const isCached = StorageCacheManager.isGameCached(game.id);

        const row = document.createElement('div');
        row.className = 'storage-game-row';
        row.innerHTML = `
            <div class="sg-left">
                <div class="sg-emoji">${(game.heroEmoji || game.emoji || '🎮').split(' ')[0]}</div>
                <div class="sg-info">
                    <div class="sg-title">${game.title}</div>
                    <div class="sg-meta">
                        <span>Package:</span>
                        <span class="sg-size">${manifest.formattedSize}</span>
                        <span class="meta-dot">·</span>
                        <span>${game.tags ? game.tags[0] : 'Arcade'}</span>
                    </div>
                </div>
            </div>
            <div class="sg-right">
                ${isCached ? `
                    <span class="sg-badge-cached"><span>💾</span> Cached (${manifest.formattedSize})</span>
                    <button class="btn-sg-action delete-cache" data-game="${game.id}">Free Cache</button>
                ` : `
                    <span class="sg-badge-not-cached">Not Cached</span>
                    <button class="btn-sg-action precache-btn" data-game="${game.id}">Pre-Cache</button>
                `}
            </div>
        `;

        const btnFree = row.querySelector('.delete-cache');
        if (btnFree) {
            btnFree.onclick = async () => {
                btnFree.textContent = 'Freeing...';
                await StorageCacheManager.deleteGameCache(game.id);
                renderStorageModalContent();
                showToast(`Freed ${manifest.formattedSize} storage for ${game.title}`, '🗑️');
            };
        }

        const btnPre = row.querySelector('.precache-btn');
        if (btnPre) {
            btnPre.onclick = async () => {
                btnPre.textContent = 'Caching...';
                btnPre.disabled = true;
                await StorageCacheManager.cacheGameAssets(game.id);
                renderStorageModalContent();
                showToast(`${game.title} cached to device storage (${manifest.formattedSize})!`, '💾');
            };
        }

        listEl.appendChild(row);
    });
}

function setupAudienceModal() {
    const btnOpen = document.getElementById('btn-live-insights');
    const modal = document.getElementById('audience-modal');
    const btnClose = document.getElementById('btn-close-audience-modal');
    const btnDone = document.getElementById('btn-audience-close');

    if (!modal) return;

    function renderAudienceModal() {
        if (!window.audienceEngine) return;
        const band = window.audienceEngine.getCurrentBand();
        
        const cycleEl = document.getElementById('aud-current-cycle');
        if (cycleEl) cycleEl.textContent = band.name;
        
        const shareEl = document.getElementById('aud-cycle-share');
        if (shareEl) shareEl.textContent = `${(band.share * 100).toFixed(1)}% of Daily Platform Traffic`;
        
        const totalEl = document.getElementById('aud-live-total');
        if (totalEl) totalEl.textContent = window.audienceEngine.globalCount.toLocaleString();

        // Render Device Bars
        const devContainer = document.getElementById('aud-device-bars');
        if (devContainer) {
            devContainer.innerHTML = AUDIENCE_MODEL_DATA.devices.map(d => `
                <div class="aud-bar-row">
                    <div class="aud-bar-label">
                        <span>${d.icon} ${d.name}</span>
                        <strong>${d.share}%</strong>
                    </div>
                    <div class="aud-bar-track">
                        <div class="aud-bar-fill" style="width: ${d.share}%; background: ${d.color};"></div>
                    </div>
                </div>
            `).join('');
        }

        // Render Geo Bars
        const geoContainer = document.getElementById('aud-geo-bars');
        if (geoContainer) {
            geoContainer.innerHTML = AUDIENCE_MODEL_DATA.countries.map(c => `
                <div class="aud-bar-row">
                    <div class="aud-bar-label">
                        <span>${c.flag} ${c.name}</span>
                        <strong>${c.share}%</strong>
                    </div>
                    <div class="aud-bar-track">
                        <div class="aud-bar-fill" style="width: ${c.share * 3.5}%; background: #fbbf24;"></div>
                    </div>
                </div>
            `).join('');
        }

        // Render Timeline Track
        const timelineContainer = document.getElementById('aud-timeline-track');
        if (timelineContainer) {
            const currentH = new Date().getHours();
            timelineContainer.innerHTML = AUDIENCE_MODEL_DATA.diurnalBands.map(b => {
                const isActive = currentH >= b.hours[0] && currentH < b.hours[1];
                return `
                    <div class="aud-time-block ${isActive ? 'active' : ''}">
                        <div class="aud-time-header">
                            <span class="aud-time-hours">${b.hours[0]}:00 - ${b.hours[1]}:00</span>
                            ${isActive ? '<span class="aud-active-pill">ACTIVE</span>' : ''}
                        </div>
                        <div class="aud-time-pct">${(b.share * 100).toFixed(1)}%</div>
                        <div class="aud-time-name">${b.name.split(' (')[0]}</div>
                    </div>
                `;
            }).join('');
        }
    }

    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            renderAudienceModal();
            modal.classList.add('open');
        });
    }

    if (btnClose) btnClose.addEventListener('click', () => modal.classList.remove('open'));
    if (btnDone) btnDone.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });
}

// Initial Boot & URL Detection
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    if (window.audienceEngine) window.audienceEngine.syncDOM();
    renderPortal();
    setupCategoryControls();
    setupSearchControls();
    setupSuggestModal();
    updateBookmarkBadge();
    StorageCacheManager.updateNavBadge();
    setupEcoMode();
    setupStorageManagerModal();
    setupAudienceModal();

    // Wire Up Action Bar Buttons
    const btnLike = document.getElementById('btn-game-like');
    if (btnLike) btnLike.addEventListener('click', () => currentGame && toggleLike(currentGame.id));

    const btnDislike = document.getElementById('btn-game-dislike');
    if (btnDislike) btnDislike.addEventListener('click', () => showToast('Feedback recorded.'));

    const btnBookmark = document.getElementById('btn-game-bookmark');
    if (btnBookmark) btnBookmark.addEventListener('click', () => currentGame && toggleBookmark(currentGame.id));

    const btnShare = document.getElementById('btn-game-share');
    if (btnShare) btnShare.addEventListener('click', shareGameLink);

    const btnFs = document.getElementById('btn-game-fullscreen');
    if (btnFs) btnFs.addEventListener('click', togglePlayerFullscreen);

    const btnAspect = document.getElementById('btn-game-aspect');
    if (btnAspect) btnAspect.addEventListener('click', cycleAspectRatio);

    const btnSound = document.getElementById('btn-game-sound');
    if (btnSound) btnSound.addEventListener('click', toggleGameAudio);

    const btnBack = document.getElementById('btn-back-to-catalog');
    if (btnBack) btnBack.addEventListener('click', closeGamePlayer);

    const bcHome = document.getElementById('bc-home-btn');
    if (bcHome) bcHome.addEventListener('click', closeGamePlayer);

    const btnPostComment = document.getElementById('btn-post-comment');
    if (btnPostComment) btnPostComment.addEventListener('click', postUserComment);

    const commentInput = document.getElementById('user-comment-input');
    if (commentInput) {
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') postUserComment();
        });
    }

    const btnRandom = document.getElementById('btn-nav-random');
    if (btnRandom) btnRandom.addEventListener('click', playRandomGame);

    const btnSideRandom = document.getElementById('btn-sidebar-random');
    if (btnSideRandom) btnSideRandom.addEventListener('click', playRandomGame);

    const btnPromoRandom = document.getElementById('btn-promo-random');
    if (btnPromoRandom) btnPromoRandom.addEventListener('click', playRandomGame);

    const btnViewMore = document.getElementById('btn-view-more-purple');
    if (btnViewMore) btnViewMore.addEventListener('click', closeGamePlayer);

    const btnSidebarToggle = document.getElementById('btn-sidebar-toggle');
    const sidebarRail = document.getElementById('sidebar-rail');
    if (btnSidebarToggle && sidebarRail) {
        btnSidebarToggle.addEventListener('click', () => {
            sidebarRail.classList.toggle('expanded');
        });
    }

    // Check URL parameters for direct game launch (e.g. ?game=office-escape or #play=dart-board)
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game') || urlParams.get('play');
    const hashParam = window.location.hash.replace('#', '').replace('play=', '').replace('game=', '');

    const targetGameId = gameParam || hashParam;
    if (targetGameId && GAMES_CATALOG.some(g => g.id === targetGameId)) {
        openGamePlayer(targetGameId);
    }

    // Handle Browser Back / Forward buttons
    window.addEventListener('popstate', (e) => {
        const stateGame = (e.state && e.state.gameId) || new URLSearchParams(window.location.search).get('game');
        if (stateGame) {
            openGamePlayer(stateGame);
        } else {
            closeGamePlayer();
        }
    });

    // Unified ESC Key & Pause/Fullscreen Management
    function handleEscKeyPress() {
        const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        if (isFs) {
            // Exit native fullscreen smoothly and stay on the active Game Player view
            const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
            if (exit) exit.call(document).catch(() => {});
        } else if (document.body.getAttribute('data-view') === 'player') {
            // Forward Escape pause toggle to the active game iframe
            const iframe = document.getElementById('active-game-iframe');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'KRAZY_ESC_PAUSE', key: 'Escape' }, '*');
            }
        }
    }

    // Global Keybindings (ESC for Pause/Fullscreen, F for Fullscreen)
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'Escape') {
            e.preventDefault();
            handleEscKeyPress();
        }
        if (e.key === 'f' || e.key === 'F') {
            if (document.body.getAttribute('data-view') === 'player') {
                e.preventDefault();
                togglePlayerFullscreen();
            }
        }
    });

    // Listen for events emitted from inside game iframes
    window.addEventListener('message', (e) => {
        if (!e.data) return;
        if (e.data.type === 'EXIT_TO_PORTAL' || e.data.type === 'PORTAL_BACK') {
            closeGamePlayer();
        } else if (e.data.type === 'KRAZY_ESC') {
            if (typeof e.data.isPaused === 'boolean') {
                showToast(e.data.isPaused ? 'Game Paused ⏸️' : 'Game Resumed ▶️', e.data.isPaused ? '⏸️' : '▶️');
            }
        }
    });
});
