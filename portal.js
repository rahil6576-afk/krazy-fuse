// Krazy Fuse Arcade Portal Engine — Fast, Playful, CrazyGames-Style Experience
const GAMES_CATALOG = [
    {
        id: 'office-escape',
        title: 'Office Escape: Corporate Run',
        category: 'runner',
        thumbnail: '/thumbnails/bento/office-escape.webp',
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
        thumbnail: '/thumbnails/bento/dart-board.webp',
        tags: ['PvP', 'Pass & Play', 'AI Bot', 'Sports'],
        desc: 'Realistic London dartboard arcade! Challenge smart AI bots, or Pass & Play with friends locally.',
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
        multiplayer: false,
        themeClass: 'theme-dart',
        actionBadge: '🎯 BULLSEYE 1v1',
        controls: [
            { key: 'Left Click + Drag', label: 'Aim & Throw Dart' },
            { key: '1 / 2 / 3', label: 'Camera Zoom Modes' },
            { key: 'R', label: 'Reset Turn' }
        ]
    },
    {
        id: 'tic-tac-toe',
        title: 'Sumi-e Tac Toe: Zen Brush & AI',
        category: 'pvp',
        thumbnail: '/thumbnails/bento/tic-tac-toe.webp',
        tags: ['PvP', 'Pass & Play', 'AI Bot', 'Strategy', 'Zen'],
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
        multiplayer: false,
        themeClass: 'theme-tictactoe',
        actionBadge: '🧘 ZEN MASTER AI',
        controls: [
            { key: 'Mouse Click / Touch', label: 'Draw Ink Mark on Board' }
        ]
    },
    {
        id: 'flappy-man',
        title: 'Flappy Man: Superhero Flight',
        category: 'arcade',
        thumbnail: '/thumbnails/bento/flappy-man.webp',
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
        thumbnail: '/thumbnails/bento/wild-swings.webp',
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
        id: 'gravity-flip',
        title: 'Gravity Flip: Cavern Runner',
        category: 'reflex',
        thumbnail: '/thumbnails/bento/gravity-flip.webp',
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
        title: 'Pop Up Blitz',
        category: 'arcade',
        thumbnail: '/thumbnails/bento/pop-up.webp',
        tags: ['Shooter', 'Arcade', 'Reflex', 'Puzzle'],
        desc: 'Aim cannon blades & pop endless streams of chaotic floating targets across 20 vibrant levels!',
        fullDesc: 'Aim, shoot, and pop! Launch spinning blade projectiles into colorful bouncy targets, trigger chain reactions, and pop every target before timer expiry.',
        emoji: '🎯💥',
        heroEmoji: '⚡🎯',
        status: 'live',
        rating: '4.8',
        plays: '23.4K',
        likesCount: 1840,
        link: '/popup-game/index.html',
        trending: false,
        isNew: true,
        multiplayer: false,
        themeClass: 'theme-popup',
        actionBadge: '⚡ 20 LEVELS',
        controls: [
            { key: 'Mouse Aim + Click', label: 'Shoot Blade Cannon' }
        ]
    },
    {
        id: 'bomb-panic',
        title: 'Bomb Panic: Hot Potato',
        category: 'pvp',
        thumbnail: '/thumbnails/bento/bomb-panic.webp',
        tags: ['Party', 'PvP', 'Pass & Play', 'Survival'],
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
        multiplayer: false,
        themeClass: 'theme-bomb',
        actionBadge: '💣 PASS OR BOOM',
        controls: [
            { key: 'WASD / Arrows', label: 'Run & Dodge' },
            { key: 'Space / E', label: 'Tackle / Pass Bomb' },
            { key: 'Shift', label: 'Sprint Surge' }
        ]
    },
    {
        id: 'elevator-doom',
        title: 'Elevator of Doom: Floor 99',
        category: 'action',
        thumbnail: '/thumbnails/bento/elevator-doom.webp',
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
        id: 'fallen-one',
        title: 'Cyber Clash: PvP Arena',
        category: 'pvp',
        thumbnail: '/thumbnails/bento/fallen-one.webp',
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
        multiplayer: false,
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
        id: 'chess',
        title: 'Royal Chess: Grandmaster Arena',
        category: 'pvp',
        thumbnail: '/thumbnails/bento/chess.webp',
        tags: ['Chess', 'Pass & Play', 'Strategy', 'PvP', 'AI'],
        desc: 'Realistic 3D Staunton chess! Battle Grandmaster AI, challenge friends locally, or Pass & Play.',
        fullDesc: 'Step onto the master board in Royal Chess! Featuring realistic weighted pieces, customizable walnut & obsidian marble boards, comprehensive legal move engine with castling, en passant, and promotions. Play solo vs multi-tier AI, or Pass & Play with auto-flip.',
        emoji: '♚♟️',
        heroEmoji: '♚👑',
        status: 'live',
        rating: '5.0',
        plays: '58.7K',
        likesCount: 5410,
        link: '/chess/index.html',
        trending: true,
        isNew: true,
        multiplayer: false,
        themeClass: 'theme-chess',
        actionBadge: '♚ GRANDMASTER AI & PVP',
        controls: [
            { key: 'Mouse Click / Tap', label: 'Select & Move Piece' },
            { key: 'Drag & Drop', label: 'Move Piece' },
            { key: 'Space / F', label: 'Flip Board View' }
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
    cities: [
        // India (UTC +5.5) - Key States & Metropolitan Tech Hubs
        { id: 'mumbai', city: 'Mumbai', state: 'Maharashtra', country: 'India', flag: '🇮🇳', tzOffset: 5.5, basePool: 1480 },
        { id: 'delhi', city: 'Delhi NCR', state: 'Delhi', country: 'India', flag: '🇮🇳', tzOffset: 5.5, basePool: 1390 },
        { id: 'bengaluru', city: 'Bengaluru', state: 'Karnataka', country: 'India', flag: '🇮🇳', tzOffset: 5.5, basePool: 1220 },
        { id: 'hyderabad', city: 'Hyderabad', state: 'Telangana', country: 'India', flag: '🇮🇳', tzOffset: 5.5, basePool: 990 },
        { id: 'ahmedabad', city: 'Ahmedabad', state: 'Gujarat', country: 'India', flag: '🇮🇳', tzOffset: 5.5, basePool: 780 },
        { id: 'pune', city: 'Pune', state: 'Maharashtra', country: 'India', flag: '🇮🇳', tzOffset: 5.5, basePool: 740 },
        { id: 'kolkata', city: 'Kolkata', state: 'West Bengal', country: 'India', flag: '🇮🇳', tzOffset: 5.5, basePool: 680 },
        { id: 'chennai', city: 'Chennai', state: 'Tamil Nadu', country: 'India', flag: '🇮🇳', tzOffset: 5.5, basePool: 650 },

        // United States (UTC -4 to -7) - Coast-to-Coast Key States
        { id: 'los-angeles', city: 'Los Angeles', state: 'California', country: 'USA', flag: '🇺🇸', tzOffset: -7, basePool: 1080 },
        { id: 'new-york', city: 'New York City', state: 'New York', country: 'USA', flag: '🇺🇸', tzOffset: -4, basePool: 1200 },
        { id: 'dallas', city: 'Dallas / Austin', state: 'Texas', country: 'USA', flag: '🇺🇸', tzOffset: -5, basePool: 860 },
        { id: 'chicago', city: 'Chicago', state: 'Illinois', country: 'USA', flag: '🇺🇸', tzOffset: -5, basePool: 730 },
        { id: 'miami', city: 'Miami', state: 'Florida', country: 'USA', flag: '🇺🇸', tzOffset: -4, basePool: 610 },
        { id: 'seattle', city: 'Seattle', state: 'Washington', country: 'USA', flag: '🇺🇸', tzOffset: -7, basePool: 560 },

        // Europe & United Kingdom (UTC +1 to +2)
        { id: 'london', city: 'London', state: 'Greater London', country: 'UK', flag: '🇬🇧', tzOffset: 1, basePool: 920 },
        { id: 'berlin', city: 'Berlin', state: 'Berlin', country: 'Germany', flag: '🇩🇪', tzOffset: 2, basePool: 670 },
        { id: 'paris', city: 'Paris', state: 'Île-de-France', country: 'France', flag: '🇫🇷', tzOffset: 2, basePool: 640 },

        // Asia-Pacific & Latin America
        { id: 'tokyo', city: 'Tokyo', state: 'Kantō', country: 'Japan', flag: '🇯🇵', tzOffset: 9, basePool: 980 },
        { id: 'seoul', city: 'Seoul', state: 'Gyeonggi', country: 'South Korea', flag: '🇰🇷', tzOffset: 9, basePool: 840 },
        { id: 'sao-paulo', city: 'São Paulo', state: 'São Paulo', country: 'Brazil', flag: '🇧🇷', tzOffset: -3, basePool: 800 },
        { id: 'singapore', city: 'Singapore', state: 'Central', country: 'Singapore', flag: '🇸🇬', tzOffset: 8, basePool: 520 },
        { id: 'sydney', city: 'Sydney', state: 'New South Wales', country: 'Australia', flag: '🇦🇺', tzOffset: 11, basePool: 490 }
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
        'office-escape': { base: 2350, volatility: 24, avgMin: 75, genre: 'Action' },
        'dart-board': { base: 2620, volatility: 28, avgMin: 68, genre: 'Sports' },
        'elevator-doom': { base: 1880, volatility: 20, avgMin: 84, genre: 'Action' },
        'bomb-panic': { base: 2950, volatility: 32, avgMin: 72, genre: 'Party' },
        'flappy-man': { base: 2180, volatility: 22, avgMin: 54, genre: 'Arcade' },
        'wild-swings': { base: 1940, volatility: 20, avgMin: 59, genre: 'Arcade' },
        'fallen-one': { base: 2210, volatility: 25, avgMin: 91, genre: 'Fighting' },
        'gravity-flip': { base: 1320, volatility: 16, avgMin: 52, genre: 'Reflex' },
        'pop-up': { base: 1190, volatility: 15, avgMin: 48, genre: 'Shooter' },
        'tic-tac-toe': { base: 1540, volatility: 18, avgMin: 43, genre: 'Strategy' },
        'chess': { base: 2840, volatility: 26, avgMin: 85, genre: 'Strategy' }
    }
};

class LiveAudienceEngine {
    constructor() {
        this.counts = {};
        this.trends = {};
        this.cityStats = [];
        this.globalCount = 0;
        this.plays = {};
        // Countdown timer: Strictly updates every 60 seconds (1 minute, not less than that)
        this.updateIntervalSeconds = 60;
        this.secondsRemaining = this.updateIntervalSeconds;
        this.countdownTimer = null;
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

    parseBasePlays(str) {
        if (!str) return 25000;
        if (typeof str === 'number') return str;
        const s = String(str).trim().toUpperCase();
        if (s.endsWith('M')) return Math.round(parseFloat(s) * 1000000);
        if (s.endsWith('K')) return Math.round(parseFloat(s) * 1000);
        return parseInt(s.replace(/[^0-9]/g, ''), 10) || 25000;
    }

    computeCityStateAnalytics() {
        const now = new Date();
        const utcHours = now.getUTCHours() + (now.getUTCMinutes() / 60) + (now.getUTCSeconds() / 3600);

        const analyzed = AUDIENCE_MODEL_DATA.cities.map(c => {
            let localHour = (utcHours + c.tzOffset) % 24;
            if (localHour < 0) localHour += 24;

            let factor = 1.0;
            let phase = 'Active';
            let phaseClass = 'aud-phase-active';
            let barColor = '#38bdf8';

            if (localHour >= 0 && localHour < 5) {
                factor = 0.32 + 0.12 * Math.cos((localHour / 5) * Math.PI);
                phase = '🌙 Night Owl';
                phaseClass = 'aud-phase-night';
                barColor = '#818cf8';
            } else if (localHour >= 5 && localHour < 8) {
                factor = 0.44 + ((localHour - 5) / 3) * 0.28;
                phase = '🌅 Early Morning';
                phaseClass = 'aud-phase-day';
                barColor = '#34d399';
            } else if (localHour >= 8 && localHour < 12) {
                factor = 0.72 + ((localHour - 8) / 4) * 0.35;
                phase = '☀️ Daytime Active';
                phaseClass = 'aud-phase-day';
                barColor = '#22c55e';
            } else if (localHour >= 12 && localHour < 17) {
                factor = 1.07 + ((localHour - 12) / 5) * 0.38;
                phase = '⚡ Afternoon';
                phaseClass = 'aud-phase-active';
                barColor = '#f59e0b';
            } else if (localHour >= 17 && localHour < 22) {
                const t = (localHour - 17) / 5;
                factor = 1.45 + Math.sin(t * Math.PI) * 0.75;
                phase = '🔥 Evening Prime';
                phaseClass = 'aud-phase-prime';
                barColor = '#ef4444';
            } else {
                const t = (localHour - 22) / 2;
                factor = 1.65 - t * 0.85;
                phase = '🎮 Night Gaming';
                phaseClass = 'aud-phase-active';
                barColor = '#a855f7';
            }

            // Natural minute-level subtle variation (within +/- 1.5%)
            const minuteSeed = now.getMinutes() + now.getHours() * 60;
            const seedVariance = Math.sin(c.basePool + minuteSeed * 1.3) * 0.015;
            const activePlayers = Math.max(40, Math.round(c.basePool * factor * (1 + seedVariance)));

            const localH = Math.floor(localHour);
            const localM = Math.floor((localHour % 1) * 60);
            const ampm = localH >= 12 ? 'PM' : 'AM';
            const displayH = localH % 12 === 0 ? 12 : localH % 12;
            const displayM = localM < 10 ? '0' + localM : localM;
            const formattedTime = `${displayH}:${displayM} ${ampm}`;

            return {
                ...c,
                localHour,
                formattedTime,
                factor,
                phase,
                phaseClass,
                barColor,
                activePlayers
            };
        });

        analyzed.sort((a, b) => b.activePlayers - a.activePlayers);
        return analyzed;
    }

    recomputeAudiences() {
        // 1. Analyze all states & cities and their local times
        this.cityStats = this.computeCityStateAnalytics();

        // 2. Aggregate global player headcount from the state & city model (calibrated strictly within 15,000 - 30,000)
        const totalCityAudience = this.cityStats.reduce((sum, c) => sum + c.activePlayers, 0);
        this.globalCount = Math.max(15100, Math.min(29900, totalCityAudience));

        // 3. Proportional game player headcount calibrated to global audience
        const totalGameBase = Object.values(AUDIENCE_MODEL_DATA.gameParams).reduce((s, g) => s + g.base, 0);
        for (const [id, param] of Object.entries(AUDIENCE_MODEL_DATA.gameParams)) {
            const share = param.base / totalGameBase;
            const jitter = 0.98 + (Math.sin(param.base + Date.now()) % 0.04);
            const target = Math.max(350, Math.round(this.globalCount * share * jitter));
            this.counts[id] = target;

            // Initialize or accumulate dynamic plays
            if (!this.plays[id]) {
                const gameObj = (typeof GAMES_CATALOG !== 'undefined') ? GAMES_CATALOG.find(g => g.id === id) : null;
                const basePlays = this.parseBasePlays(gameObj ? gameObj.plays : '25.0K');
                try {
                    const stored = localStorage.getItem(`kf_total_plays_${id}`);
                    this.plays[id] = stored ? Math.max(basePlays, parseInt(stored, 10)) : basePlays;
                } catch (e) {
                    this.plays[id] = basePlays;
                }
            } else {
                const deltaPlays = Math.max(2, Math.round(target * 0.008));
                this.plays[id] += deltaPlays;
                try {
                    localStorage.setItem(`kf_total_plays_${id}`, this.plays[id]);
                } catch (e) { }
            }
        }
    }

    init() {
        this.recomputeAudiences();
        this.syncDOM();
        this.startCountdownTicker();
    }

    startCountdownTicker() {
        if (this.countdownTimer) clearInterval(this.countdownTimer);
        // Ticks every second to decrement visible countdown; changes player count strictly every 60s
        this.countdownTimer = setInterval(() => {
            this.countdownTick();
        }, 1000);
    }

    countdownTick() {
        this.secondsRemaining--;

        // Update navbar countdown indicator badge
        const cdBadge = document.getElementById('live-sync-countdown');
        if (cdBadge) {
            cdBadge.textContent = `${this.secondsRemaining}s`;
            if (this.secondsRemaining <= 5) {
                cdBadge.classList.add('pulse');
            } else {
                cdBadge.classList.remove('pulse');
            }
        }

        // Update modal sync countdown if open
        const modalCd = document.getElementById('aud-modal-countdown');
        if (modalCd) {
            modalCd.textContent = `${this.secondsRemaining}s`;
        }

        // Cycle trigger: strictly every minute (60s)
        if (this.secondsRemaining <= 0) {
            this.secondsRemaining = this.updateIntervalSeconds;
            this.recomputeAudiences();
            this.syncDOM();

            // Refresh modal if active
            const modal = document.getElementById('audience-modal');
            if (modal && modal.classList.contains('active') && typeof window.renderAudienceModal === 'function') {
                window.renderAudienceModal();
            }
        }
    }

    recordGamePlay(id) {
        if (!id) return;
        if (!this.plays[id]) {
            const g = (typeof GAMES_CATALOG !== 'undefined') ? GAMES_CATALOG.find(x => x.id === id) : null;
            this.plays[id] = this.parseBasePlays(g ? g.plays : '25.0K');
        }
        this.plays[id] += 1;
        try {
            localStorage.setItem(`kf_total_plays_${id}`, this.plays[id]);
        } catch (e) { }
        this.syncDOM();
    }

    getGamePlays(id) {
        return this.plays[id] || 25000;
    }

    getGameCount(id) {
        return this.counts[id] || 2100;
    }

    formatCompact(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    }

    syncDOM() {
        // 1. Update Global Ticker in Navbar
        const navGlobal = document.getElementById('nav-global-live-count') || document.getElementById('nav-live-players');
        if (navGlobal) {
            navGlobal.textContent = this.globalCount.toLocaleString();
            navGlobal.classList.add('live-flash');
            setTimeout(() => navGlobal.classList.remove('live-flash'), 650);
        }

        // 2. Update Active Game Player Counters (Playing now & Dynamic Plays)
        if (typeof currentGame !== 'undefined' && currentGame) {
            const playerLiveCount = document.getElementById('player-game-live-count');
            if (playerLiveCount) {
                playerLiveCount.textContent = this.getGameCount(currentGame.id).toLocaleString();
            }

            const playerPlaysEl = document.getElementById('player-game-plays');
            if (playerPlaysEl) {
                const totalPlays = this.getGamePlays(currentGame.id);
                const compactPlays = this.formatCompact(totalPlays);
                const prev = playerPlaysEl.dataset.playsVal;

                playerPlaysEl.innerHTML = `👥 <strong id="player-game-plays-val" class="plays-val">${compactPlays}</strong> Plays`;
                playerPlaysEl.title = `${totalPlays.toLocaleString()} total plays (growing live proportional to active sessions)`;

                if (prev && prev !== compactPlays) {
                    const valEl = document.getElementById('player-game-plays-val');
                    if (valEl) {
                        valEl.classList.remove('plays-pulse');
                        void valEl.offsetWidth;
                        valEl.classList.add('plays-pulse');
                    }
                }
                playerPlaysEl.dataset.playsVal = compactPlays;
            }
        }

        // 3. Update Card Badges & Meta across catalog
        for (const [id, count] of Object.entries(this.counts)) {
            const compact = this.formatCompact(count);
            const formatted = count.toLocaleString();
            const compactPlays = this.formatCompact(this.plays[id] || 25000);

            // Card Top-Right Badge
            const cardBadges = document.querySelectorAll(`[data-game-live="${id}"] .live-card-val`);
            cardBadges.forEach(el => {
                el.textContent = compact;
            });

            // Card Sub-meta row live
            const metaEls = document.querySelectorAll(`[data-game-meta-live="${id}"]`);
            metaEls.forEach(el => {
                el.textContent = formatted;
            });

            // Card Sub-meta row dynamic plays
            const playEls = document.querySelectorAll(`[data-game-meta-plays="${id}"]`);
            playEls.forEach(el => {
                el.textContent = compactPlays;
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
    'tic-tac-toe': { id: 'tic-tac-toe', title: 'Sumi-e Tac Toe: Zen Brush & AI', sizeMB: 0.05, formattedSize: '0.05 MB', totalBytes: 54236, tip: 'Control the center canvas square to force the Zen AI bot into defensive strokes!', primaryAssets: ['/tic-tac-toe/index.html'] },
    'chess': { id: 'chess', title: 'Royal Chess: Grandmaster Arena', sizeMB: 2.1, formattedSize: '2.1 MB', totalBytes: 2202009, tip: 'Control the center four squares and castle early to safeguard your King!', primaryAssets: ['/chess/index.html', '/chess/assets/board_full_luxury.jpg', '/chess/assets/pieces/wK.png', '/chess/assets/pieces/bK.png'] }
};

// Async manifest sync
(async function syncManifests() {
    try {
        const res = await fetch('/game-manifests.json');
        if (res.ok) {
            const data = await res.json();
            GAME_MANIFESTS = Object.assign({}, GAME_MANIFESTS, data);
        }
    } catch (e) { }
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
// GAMER AUTHENTICATION & MULTI-ACCOUNT CREDENTIALS ENGINE
// ==========================================================
const AuthManager = {
    STORAGE_REGISTRY_KEY: 'kf_accounts_registry',
    ACTIVE_USER_SESSION_KEY: 'kf_active_session_user',
    ACTIVE_USER_PERSIST_KEY: 'kf_active_user_persist',

    currentUser: {
        username: 'Guest',
        avatar: '👾',
        isLoggedIn: false
    },

    init() {
        // 1. Check if user is logged in
        let savedUser = sessionStorage.getItem(this.ACTIVE_USER_SESSION_KEY);
        if (!savedUser) {
            savedUser = localStorage.getItem(this.ACTIVE_USER_PERSIST_KEY);
        }

        const globalPreferredAvatar = localStorage.getItem('kf_preferred_avatar') || '👾';

        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                if (parsed && parsed.username && parsed.username !== 'Guest') {
                    const registry = this.getRegistry();
                    const regUser = registry[parsed.username] || {};
                    const persistedAvatar = regUser.avatar || parsed.avatar || globalPreferredAvatar;
                    this.currentUser = {
                        username: parsed.username,
                        avatar: persistedAvatar,
                        isLoggedIn: true,
                        provider: parsed.provider || 'local',
                        email: parsed.email || ''
                    };
                }
            } catch (e) { }
        }

        if (!this.currentUser || !this.currentUser.isLoggedIn) {
            const guestAvatar = localStorage.getItem('kf_preferred_avatar') || localStorage.getItem('kf_saved_guest_avatar') || sessionStorage.getItem('kf_saved_guest_avatar') || '👾';
            this.currentUser = {
                username: 'Guest',
                avatar: guestAvatar,
                isLoggedIn: false,
                provider: 'guest'
            };
            // AUTO-CLEAR ON RELOAD FOR GUEST:
            this.clearGuestData();
        }

        this.updateNavUI();
        this.bindUnloadAutoClear();
        this.initSupabaseAuthListener();
        this.fetchCloudTakenNames();
    },

    initSupabaseAuthListener() {
        if (typeof KrazySupabase === 'undefined') return;

        // 1. Listen for auth changes (e.g. returning from OAuth redirect)
        KrazySupabase.onAuthStateChange((event, session) => {
            console.log('⚡ [KrazySupabase Auth]', event, session ? session.user?.email : 'No session');
            if (session && session.user) {
                this.syncSupabaseUser(session.user);
            } else if (event === 'SIGNED_OUT') {
                if (this.isLoggedIn() && this.currentUser.provider !== 'local') {
                    this.logout(false);
                }
            }
        });

        // 2. Check initial session (e.g. OAuth callback token in URL)
        KrazySupabase.getSession().then(({ data }) => {
            if (data && data.session && data.session.user) {
                this.syncSupabaseUser(data.session.user);
            }
        }).catch(err => {
            console.warn('⚠️ [KrazySupabase Auth] Failed checking session:', err);
        });
    },

    syncSupabaseUser(sbUser) {
        if (!sbUser) return;
        const meta = sbUser.user_metadata || {};
        const rawName = meta.full_name || meta.name || meta.user_name || (sbUser.email ? sbUser.email.split('@')[0] : 'Gamer');
        const cleanName = (rawName || 'Gamer').trim();
        const avatarUrl = meta.avatar_url || meta.picture || null;
        const provider = sbUser.app_metadata?.provider || 'google';

        // Check if user already exists in registry to preserve their avatar!
        const registry = this.getRegistry();
        const existingKey = Object.keys(registry).find(k => k.toLowerCase() === cleanName.toLowerCase());
        const existingAvatar = existingKey && registry[existingKey]?.avatar ? registry[existingKey].avatar : null;
        const preferredAvatar = localStorage.getItem('kf_preferred_avatar');

        // Keep their chosen avatar unless they don't have one
        const finalAvatar = existingAvatar || preferredAvatar || avatarUrl || '👾';

        console.log(`✨ [AuthManager] Synced OAuth user: ${cleanName} via ${provider}`);
        this.login(cleanName, '', finalAvatar, {
            provider: provider,
            email: sbUser.email || '',
            isOAuth: true
        });

        // Clean up OAuth hash or code query params from browser URL
        if (window.location.hash || window.location.search.includes('code=')) {
            try {
                const cleanHref = window.location.origin + window.location.pathname;
                window.history.replaceState(null, document.title, cleanHref);
            } catch (e) { }
        }

        if (typeof renderAuthModalContent === 'function') {
            renderAuthModalContent();
        }
    },

    bindUnloadAutoClear() {
        window.addEventListener('beforeunload', () => {
            if (!this.isLoggedIn()) {
                this.clearGuestData();
            }
        });
    },

    isLoggedIn() {
        return !!(this.currentUser && this.currentUser.isLoggedIn && this.currentUser.username !== 'Guest');
    },

    getActiveUser() {
        return this.currentUser || { username: 'Guest', avatar: '👾', isLoggedIn: false, provider: 'guest' };
    },

    cloudTakenNames: new Set(),

    getDeviceOwnerId() {
        let id = localStorage.getItem('kf_client_device_id');
        if (!id) {
            id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
            localStorage.setItem('kf_client_device_id', id);
        }
        return id;
    },

    async fetchCloudTakenNames() {
        try {
            if (typeof KrazySupabase !== 'undefined' && typeof KrazySupabase.getCloudTakenUsernames === 'function') {
                const names = await KrazySupabase.getCloudTakenUsernames();
                if (Array.isArray(names)) {
                    names.forEach(n => {
                        if (n && typeof n === 'string') {
                            this.cloudTakenNames.add(n.trim().toLowerCase());
                        }
                    });
                }
            }
        } catch (e) { }
    },

    isUsernameTaken(username, excludeCurrentName = '') {
        if (!username) return false;
        const clean = username.trim().toLowerCase();
        if (!clean) return false;

        const reserved = ['guest', 'guest player', 'admin', 'administrator', 'system', 'krazy', 'krazyfuze', 'support'];
        if (reserved.includes(clean)) {
            return true;
        }

        const currentClean = (excludeCurrentName || '').trim().toLowerCase();

        const registry = this.getRegistry();
        for (const regKey of Object.keys(registry)) {
            const regClean = regKey.trim().toLowerCase();
            if (regClean === clean) {
                if (currentClean && regClean === currentClean) {
                    continue;
                }
                return true;
            }
        }

        if (this.currentUser && this.currentUser.username && this.currentUser.isLoggedIn) {
            const activeClean = this.currentUser.username.trim().toLowerCase();
            if (activeClean === clean && activeClean !== currentClean) {
                return true;
            }
        }

        if (this.cloudTakenNames && this.cloudTakenNames.has(clean)) {
            if (currentClean && clean === currentClean) {
                // Same as active user
            } else {
                return true;
            }
        }

        return false;
    },

    checkUsernameAvailability(username, enteredPin = '') {
        const clean = (username || '').trim();
        if (!clean) return { available: false, message: '' };
        if (clean.length < 2) return { available: false, message: 'Gamer tag must be at least 2 characters.' };
        if (clean.length > 20) return { available: false, message: 'Gamer tag cannot exceed 20 characters.' };

        const tagRegex = /^[a-zA-Z0-9_\- .]+$/;
        if (!tagRegex.test(clean)) {
            return { available: false, message: 'Only letters, numbers, spaces, dots, underscores, and hyphens are allowed.' };
        }

        const lower = clean.toLowerCase();
        if (lower === 'guest' || lower === 'guest player') {
            return { available: false, message: 'The name "Guest" is reserved. Please pick a unique name.' };
        }

        const reserved = ['admin', 'administrator', 'system', 'krazy', 'krazyfuze', 'support'];
        if (reserved.includes(lower)) {
            return { available: false, message: `The name "${clean}" is reserved by the system.` };
        }

        // If currently active user
        if (this.currentUser && this.currentUser.username && this.currentUser.username.toLowerCase() === lower && this.currentUser.isLoggedIn) {
            return { available: true, isCurrent: true, message: `✓ Currently signed in as ${clean}` };
        }

        const registry = this.getRegistry();
        const existingKey = Object.keys(registry).find(k => k.toLowerCase() === lower);

        if (existingKey) {
            const acc = registry[existingKey];
            const myDevice = this.getDeviceOwnerId();
            const isOwner = acc.ownerDeviceId && acc.ownerDeviceId === myDevice;

            if (acc.pin) {
                if (enteredPin && acc.pin === enteredPin) {
                    return { available: true, isOwner: true, message: `🔑 PIN verified! Click to sign in.` };
                }
                return { available: false, isProtected: true, message: `⚠️ "${clean}" is taken! Enter your 4-digit PIN to sign in.` };
            }

            if (isOwner) {
                return { available: true, isOwner: true, message: `✓ Your saved profile on this device.` };
            }

            return { available: false, isTaken: true, message: `⚠️ The name "${clean}" is already taken and cannot be used by another person!` };
        }

        if (this.cloudTakenNames && this.cloudTakenNames.has(lower)) {
            return { available: false, isTaken: true, message: `⚠️ The name "${clean}" is already taken and cannot be used by another person!` };
        }

        return { available: true, isNew: true, message: `✓ "${clean}" is available!` };
    },

    changeUsername(oldName, newName) {
        if (!this.isLoggedIn()) {
            return { success: false, error: 'You must be signed in to change your in-game name!' };
        }

        const cleanNew = (newName || '').trim();
        const cleanOld = (oldName || this.currentUser.username || '').trim();

        if (!cleanNew) {
            return { success: false, error: 'Please enter a valid in-game name!' };
        }

        if (cleanNew.length < 2) {
            return { success: false, error: 'In-game name must be at least 2 characters long!' };
        }

        if (cleanNew.length > 20) {
            return { success: false, error: 'In-game name cannot exceed 20 characters!' };
        }

        const tagRegex = /^[a-zA-Z0-9_\- .]+$/;
        if (!tagRegex.test(cleanNew)) {
            return { success: false, error: 'In-game name can only contain letters, numbers, spaces, dots, underscores, and hyphens!' };
        }

        if (cleanNew.toLowerCase() === 'guest' || cleanNew.toLowerCase() === 'guest player') {
            return { success: false, error: 'The name "Guest" is reserved. Please pick a unique in-game name!' };
        }

        // Check if taken by another account
        if (this.isUsernameTaken(cleanNew, cleanOld)) {
            return { success: false, error: `⚠️ The name "${cleanNew}" is already taken and cannot be used by another person! Every player must have a unique name.` };
        }

        if (cleanNew === cleanOld) {
            return { success: false, error: 'New name is identical to your current name.' };
        }

        // Migrate registry
        const registry = this.getRegistry();
        let userRecord = registry[cleanOld];
        if (!userRecord) {
            const matchKey = Object.keys(registry).find(k => k.toLowerCase() === cleanOld.toLowerCase());
            if (matchKey) {
                userRecord = registry[matchKey];
                delete registry[matchKey];
            } else {
                userRecord = {
                    username: cleanNew,
                    avatar: this.currentUser.avatar || '👾',
                    ownerDeviceId: this.getDeviceOwnerId(),
                    provider: this.currentUser.provider || 'local',
                    createdAt: Date.now(),
                    games: {}
                };
            }
        } else {
            delete registry[cleanOld];
        }

        userRecord.username = cleanNew;
        userRecord.ownerDeviceId = this.getDeviceOwnerId();
        userRecord.updatedAt = Date.now();
        registry[cleanNew] = userRecord;
        this.saveRegistry(registry);
        this.cloudTakenNames.add(cleanNew.toLowerCase());

        // Migrate all localStorage keys for this user's games (kf_u_OldName_g_gameId -> kf_u_NewName_g_gameId)
        const oldPrefix = `kf_u_${cleanOld}_g_`;
        const newPrefix = `kf_u_${cleanNew}_g_`;
        const keysToMigrate = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(oldPrefix)) {
                keysToMigrate.push(k);
            }
        }
        keysToMigrate.forEach(k => {
            const val = localStorage.getItem(k);
            const targetKey = k.replace(oldPrefix, newPrefix);
            localStorage.setItem(targetKey, val);
            localStorage.removeItem(k);
        });

        // Migrate coins
        const oldCoinKey = `kf_coins_${cleanOld}`;
        const newCoinKey = `kf_coins_${cleanNew}`;
        if (localStorage.getItem(oldCoinKey) !== null) {
            localStorage.setItem(newCoinKey, localStorage.getItem(oldCoinKey));
            localStorage.removeItem(oldCoinKey);
        }

        // Update active user state
        this.currentUser.username = cleanNew;
        sessionStorage.setItem(this.ACTIVE_USER_SESSION_KEY, JSON.stringify(this.currentUser));
        localStorage.setItem(this.ACTIVE_USER_PERSIST_KEY, JSON.stringify(this.currentUser));

        // Update UI
        this.updateNavUI();
        if (typeof renderAuthModalContent === 'function') {
            renderAuthModalContent();
        }

        KrazyGameStorage.syncActiveGameIframe();
        showToast(`In-game name successfully changed to "${cleanNew}"!`, this.currentUser.avatar || '✨');

        return { success: true, newName: cleanNew };
    },

    login(username, pin = '', avatar = '👾', meta = {}) {
        let cleanName = (username || '').trim();
        if (!cleanName || cleanName.toLowerCase() === 'guest') {
            this.logout();
            return { success: false, error: 'Cannot log in as guest.' };
        }

        if (cleanName.length < 2) {
            return { success: false, error: 'Gamer tag must be at least 2 characters long!' };
        }
        if (cleanName.length > 20) {
            return { success: false, error: 'Gamer tag cannot exceed 20 characters!' };
        }
        const tagRegex = /^[a-zA-Z0-9_\- .]+$/;
        if (!tagRegex.test(cleanName)) {
            return { success: false, error: 'Gamer tag can only contain letters, numbers, spaces, dots, underscores, and hyphens!' };
        }

        const reserved = ['admin', 'administrator', 'system', 'krazy', 'krazyfuze', 'support'];
        if (reserved.includes(cleanName.toLowerCase())) {
            return { success: false, error: `The name "${cleanName}" is reserved by the system!` };
        }

        const registry = this.getRegistry();
        const existingKey = Object.keys(registry).find(k => k.toLowerCase() === cleanName.toLowerCase());
        const myDeviceId = this.getDeviceOwnerId();

        let chosenAvatar = avatar;

        if (existingKey) {
            const existingAcc = registry[existingKey];
            const isOwner = existingAcc.ownerDeviceId && existingAcc.ownerDeviceId === myDeviceId;

            // If account has a PIN set
            if (existingAcc.pin) {
                if (!pin) {
                    return { success: false, error: `⚠️ The name "${cleanName}" is already taken! If this is your account, please enter your 4-digit PIN.` };
                }
                if (existingAcc.pin !== pin) {
                    return { success: false, error: `⚠️ Incorrect PIN! The name "${cleanName}" is already taken by another person. Please enter the correct PIN or choose a unique name.` };
                }
            } else {
                // Account does NOT have a PIN:
                // Only the device that created it can access it; prevent any other person/device from taking it!
                if (!isOwner && !meta.isOAuth) {
                    return { success: false, error: `⚠️ The name "${cleanName}" is already taken and cannot be used by another person! Please choose a unique name.` };
                }
            }

            cleanName = existingKey; // preserve original casing

            if (existingAcc.avatar) {
                chosenAvatar = existingAcc.avatar;
            } else {
                chosenAvatar = avatar || localStorage.getItem('kf_preferred_avatar') || '👾';
                existingAcc.avatar = chosenAvatar;
            }

            if (pin && !existingAcc.pin) existingAcc.pin = pin;
            if (!existingAcc.ownerDeviceId) existingAcc.ownerDeviceId = myDeviceId;
            if (meta.provider) existingAcc.provider = meta.provider;
            if (meta.email) existingAcc.email = meta.email;
            registry[existingKey] = existingAcc;
        } else {
            // Check if name is reserved or taken in cloud/other players
            if (this.isUsernameTaken(cleanName)) {
                return { success: false, error: `⚠️ The name "${cleanName}" is already taken and cannot be used by another person! Please choose a unique gamer tag.` };
            }

            chosenAvatar = avatar || localStorage.getItem('kf_preferred_avatar') || '👾';

            registry[cleanName] = {
                username: cleanName,
                pin: pin,
                avatar: chosenAvatar,
                ownerDeviceId: myDeviceId,
                provider: meta.provider || 'local',
                email: meta.email || '',
                createdAt: Date.now(),
                games: {}
            };

            this.cloudTakenNames.add(cleanName.toLowerCase());
        }
        this.saveRegistry(registry);

        this.currentUser = {
            username: cleanName,
            avatar: chosenAvatar,
            isLoggedIn: true,
            provider: meta.provider || (existingKey && registry[existingKey]?.provider) || 'local',
            email: meta.email || (existingKey && registry[existingKey]?.email) || ''
        };

        // Persist preferred avatar globally so it's remembered everywhere
        localStorage.setItem('kf_preferred_avatar', chosenAvatar);
        sessionStorage.setItem(this.ACTIVE_USER_SESSION_KEY, JSON.stringify(this.currentUser));
        localStorage.setItem(this.ACTIVE_USER_PERSIST_KEY, JSON.stringify(this.currentUser));

        this.updateNavUI();
        showToast(`Welcome, ${cleanName}! Game saves active for your profile.`, (this.currentUser.avatar && this.currentUser.avatar.startsWith('http')) ? '👑' : this.currentUser.avatar);

        // If a game is currently playing, sync with the newly authenticated credentials
        KrazyGameStorage.syncActiveGameIframe();
        if (typeof updateReactionUI === 'function' && currentGame) {
            updateReactionUI(currentGame.id);
        }

        return { success: true, username: cleanName };
    },

    logout(syncSupabase = true) {
        const guestAvatar = localStorage.getItem('kf_preferred_avatar') ||
            localStorage.getItem('kf_saved_guest_avatar') ||
            sessionStorage.getItem('kf_saved_guest_avatar') ||
            (this.currentUser && this.currentUser.avatar) ||
            '👾';
        this.currentUser = {
            username: 'Guest',
            avatar: guestAvatar,
            isLoggedIn: false,
            provider: 'guest'
        };

        sessionStorage.removeItem(this.ACTIVE_USER_SESSION_KEY);
        localStorage.removeItem(this.ACTIVE_USER_PERSIST_KEY);

        // Clean temporary session data
        this.clearGuestData();

        if (syncSupabase && typeof KrazySupabase !== 'undefined') {
            KrazySupabase.signOut();
        }

        this.updateNavUI();
        showToast('Switched to Guest mode. Data auto-clears on reload.', '⚡');

        KrazyGameStorage.syncActiveGameIframe();
        if (typeof updateReactionUI === 'function' && currentGame) {
            updateReactionUI(currentGame.id);
        }
    },

    setAvatar(avatar) {
        if (!avatar) return;
        if (!this.currentUser) {
            this.currentUser = { username: 'Guest', avatar: avatar, isLoggedIn: false, provider: 'guest' };
        }
        this.currentUser.avatar = avatar;
        localStorage.setItem('kf_preferred_avatar', avatar);
        localStorage.setItem('kf_saved_guest_avatar', avatar);
        sessionStorage.setItem('kf_saved_guest_avatar', avatar);

        if (this.currentUser.isLoggedIn && this.currentUser.username !== 'Guest') {
            const registry = this.getRegistry();
            if (registry[this.currentUser.username]) {
                registry[this.currentUser.username].avatar = avatar;
                this.saveRegistry(registry);
            }
            sessionStorage.setItem(this.ACTIVE_USER_SESSION_KEY, JSON.stringify(this.currentUser));
            localStorage.setItem(this.ACTIVE_USER_PERSIST_KEY, JSON.stringify(this.currentUser));
        }

        this.updateNavUI();
        if (typeof renderAuthModalContent === 'function') {
            renderAuthModalContent();
        }

        const navAvatar = document.getElementById('nav-user-avatar');
        if (navAvatar) {
            navAvatar.classList.remove('avatar-pop');
            void navAvatar.offsetWidth;
            navAvatar.classList.add('avatar-pop');
        }

        showToast(`Avatar updated to ${avatar}!`, avatar);
    },

    switchUser(username) {
        const registry = this.getRegistry();
        if (registry[username]) {
            const acc = registry[username];
            this.login(acc.username, acc.pin, acc.avatar);
        } else if (username === 'Guest') {
            this.logout();
        }
    },

    getRegistry() {
        try {
            const raw = localStorage.getItem(this.STORAGE_REGISTRY_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    },

    saveRegistry(reg) {
        try {
            localStorage.setItem(this.STORAGE_REGISTRY_KEY, JSON.stringify(reg));
        } catch (e) { }
    },

    clearGuestData() {
        // Automatically clears all temporary guest game keys
        const toRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && (
                k.startsWith('kf_guest_') ||
                k.startsWith('kf_reaction_guest_') ||
                k.startsWith('wild_swings_') ||
                k.startsWith('doom_') ||
                k.startsWith('float_') ||
                k.startsWith('sumi_') ||
                k.startsWith('kf_game_cache_')
            )) {
                toRemove.push(k);
            }
        }
        toRemove.forEach(k => localStorage.removeItem(k));
    },

    getUserCoins(username) {
        const doomCoins = KrazyGameStorage.getItem('elevator-doom', 'doom_banked_coins', '0');
        return parseInt(doomCoins, 10) || 0;
    },

    updateNavUI() {
        const loginCta = document.getElementById('nav-btn-login-cta');
        const userPill = document.getElementById('nav-user-pill');
        const avatarEl = document.getElementById('nav-user-avatar');
        const nameEl = document.getElementById('nav-username') || document.getElementById('nav-user-name');
        const statusEl = document.getElementById('nav-auth-status');
        const bankBadge = document.getElementById('portal-top-bank');

        const user = this.getActiveUser();

        if (user.isLoggedIn) {
            if (loginCta) loginCta.classList.add('hidden');
            if (userPill) userPill.classList.remove('hidden');
        } else {
            if (loginCta) loginCta.classList.remove('hidden');
            if (userPill) userPill.classList.add('hidden');
        }

        if (avatarEl) {
            if (user.avatar && (user.avatar.startsWith('http://') || user.avatar.startsWith('https://') || user.avatar.startsWith('data:'))) {
                if (avatarEl.tagName === 'IMG') {
                    avatarEl.src = user.avatar;
                } else {
                    avatarEl.innerHTML = `<img src="${user.avatar}" alt="Avatar" class="user-avatar-img">`;
                }
            } else {
                if (avatarEl.tagName === 'IMG') {
                    avatarEl.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%231e293b"/><text x="50" y="65" font-size="50" text-anchor="middle">${encodeURIComponent(user.avatar || '👾')}</text></svg>`;
                } else {
                    avatarEl.textContent = user.avatar || '👾';
                }
            }
        }
        if (nameEl) nameEl.textContent = user.isLoggedIn ? user.username : 'Login';
        if (statusEl) {
            statusEl.className = 'auth-status-dot ' + (user.isLoggedIn ? 'online' : 'guest');
            const provText = user.provider && user.provider !== 'local' && user.provider !== 'guest' ? ` via ${user.provider}` : '';
            statusEl.title = user.isLoggedIn
                ? `Logged in as ${user.username}${provText} (Saved per game)`
                : 'Guest Session (Auto-clears on website reload)';
        }

        // Show selected avatar emoji in the nav auth button
        const btnUserAuth = document.getElementById('btn-user-auth');
        if (btnUserAuth) {
            btnUserAuth.title = user.isLoggedIn ? `Profile: ${user.username}` : 'Gamer Account & Profiles';
            // Show avatar emoji in the button icon area
            const navUserSvg = btnUserAuth.querySelector('.nav-user-svg');
            if (navUserSvg && user.avatar && !user.avatar.startsWith('http') && !user.avatar.startsWith('data:')) {
                navUserSvg.style.display = 'none';
                let avatarSpan = btnUserAuth.querySelector('.nav-btn-avatar-emoji');
                if (!avatarSpan) {
                    avatarSpan = document.createElement('span');
                    avatarSpan.className = 'nav-btn-avatar-emoji';
                    avatarSpan.style.cssText = 'font-size:18px;line-height:1;flex-shrink:0;';
                    btnUserAuth.insertBefore(avatarSpan, btnUserAuth.firstChild);
                }
                avatarSpan.textContent = user.avatar;
            } else if (navUserSvg) {
                navUserSvg.style.display = '';
                const emojiSpan = btnUserAuth.querySelector('.nav-btn-avatar-emoji');
                if (emojiSpan) emojiSpan.remove();
            }
        }

        if (bankBadge) {
            const coins = this.getUserCoins(user.username);
            bankBadge.textContent = `🪙 ${coins} P`;
        }
    }
};
window.AuthManager = AuthManager;

// ==========================================================
// UNIVERSAL GAME STORAGE MANAGER (ISOLATED PER GAME & USER)
// ==========================================================
const KrazyGameStorage = {
    getStorageKey(gameId, key) {
        const user = AuthManager.getActiveUser();
        if (user.isLoggedIn) {
            return `kf_u_${user.username}_g_${gameId}_${key}`;
        } else {
            return `kf_guest_g_${gameId}_${key}`;
        }
    },

    getItem(gameId, key, fallback = null) {
        const fullKey = this.getStorageKey(gameId, key);
        const val = localStorage.getItem(fullKey);
        return val !== null ? val : fallback;
    },

    setItem(gameId, key, value) {
        const fullKey = this.getStorageKey(gameId, key);
        const strVal = value !== undefined && value !== null ? value.toString() : '';
        localStorage.setItem(fullKey, strVal);

        // Also record in active user's profile metadata in registry
        const user = AuthManager.getActiveUser();
        if (user.isLoggedIn) {
            const registry = AuthManager.getRegistry();
            if (registry[user.username]) {
                if (!registry[user.username].games) registry[user.username].games = {};
                if (!registry[user.username].games[gameId]) registry[user.username].games[gameId] = {};
                registry[user.username].games[gameId][key] = strVal;
                registry[user.username].games[gameId].lastUpdated = Date.now();
                AuthManager.saveRegistry(registry);
            }
        }
        AuthManager.updateNavUI();
    },

    removeItem(gameId, key) {
        const fullKey = this.getStorageKey(gameId, key);
        localStorage.removeItem(fullKey);
    },

    getAllGameKeys(gameId) {
        const user = AuthManager.getActiveUser();
        const prefix = user.isLoggedIn ? `kf_u_${user.username}_g_${gameId}_` : `kf_guest_g_${gameId}_`;
        const res = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(prefix)) {
                const subKey = k.slice(prefix.length);
                res[subKey] = localStorage.getItem(k);
            }
        }
        return res;
    },

    getKnownKeysForGame(gameId) {
        const map = {
            'wild-swings': ['wild_swings_level', 'wild_swings_unlocked', 'wild_swings_best_endless', 'wild_swings_theme', 'wild_swings_muted'],
            'elevator-doom': ['doom_banked_coins', 'doom_failed_floor'],
            'popup-game': ['float_sound_muted', 'float_theme', 'float_player_name', 'float_high_score', 'float_scoreboard'],
            'tic-tac-toe': ['sumi_sound_muted'],
            'flappy-man': ['flappy_high_score'],
            'fallen-one': ['fallen_high_score', 'fallen_last_fighter'],
            'bomb-panic': ['bomb_high_score'],
            'dart-board': ['dart_high_score'],
            'gravity-flip': ['gravity_high_score'],
            'office-escape': ['office_escape_coins', 'office_high_score']
        };
        return map[gameId] || [];
    },

    prepareGameEnvironment(gameId, iframeWindow) {
        if (!iframeWindow) return;
        const user = AuthManager.getActiveUser();
        const savedData = this.getAllGameKeys(gameId);

        try {
            // Expose bridge in iframe
            iframeWindow.KrazyGameStorage = this;
            iframeWindow.KrazyActiveUser = user;

            // Sync user's saved keys into iframe localStorage
            const knownKeys = this.getKnownKeysForGame(gameId);
            knownKeys.forEach(k => {
                if (savedData[k] !== undefined) {
                    iframeWindow.localStorage.setItem(k, savedData[k]);
                } else {
                    iframeWindow.localStorage.removeItem(k);
                }
            });

            // Populate points badge in games
            const userCoins = AuthManager.getUserCoins(user.username);
            iframeWindow.localStorage.setItem('krazio_user_points', userCoins.toString());
            iframeWindow.localStorage.setItem('office_escape_coins', userCoins.toString());
            iframeWindow.localStorage.setItem('coins', userCoins.toString());

            // Hook iframe localStorage.setItem so in-game updates mirror to active user's storage
            const originalSetItem = iframeWindow.localStorage.setItem.bind(iframeWindow.localStorage);
            iframeWindow.localStorage.setItem = (k, v) => {
                originalSetItem(k, v);
                this.setItem(gameId, k, v);
            };
        } catch (e) {
            console.warn('Game storage preparation note:', e);
        }
    },

    syncActiveGameIframe() {
        const iframe = document.getElementById('active-game-iframe');
        if (iframe && iframe.contentWindow && window.currentGame) {
            const game = window.currentGame;
            const gameUrl = resolveGameUrl(game.link);
            const embedUrl = gameUrl.includes('?') ? `${gameUrl}&embedded=true` : `${gameUrl}?embedded=true`;
            iframe.src = embedUrl;
        }
    }
};
window.KrazyGameStorage = KrazyGameStorage;

// Robust URL resolution supporting root deployments and GitHub Pages subpaths
function resolveGameUrl(rawLink) {
    if (!rawLink) return '';
    if (/^https?:\/\//i.test(rawLink)) return rawLink;
    const cleanPath = rawLink.replace(/^\/+/, '');
    let base = window.location.pathname;
    if (!base.endsWith('/')) {
        base = base.substring(0, base.lastIndexOf('/') + 1);
    }
    if (!base) base = '/';
    return base + cleanPath;
}

// ==========================================================
// SMOOTH ARCADE GAME LAUNCH ENGINE (Zero Black Screen, Butter Smooth)
// ==========================================================
function executeGameLoading(game, onReady) {
    const loader = document.getElementById('game-loader-overlay');
    const iframe = document.getElementById('active-game-iframe');

    if (iframe) {
        iframe.classList.remove('loaded');
    }

    if (loader) {
        loader.classList.remove('fade-out', 'hidden');
        loader.style.display = 'flex';
        loader.style.opacity = '1';

        // Update loader card details
        const iconEl = document.getElementById('loader-game-icon');
        const titleEl = document.getElementById('loader-game-title');
        const tagEl = document.getElementById('loader-game-tag');
        const fillEl = document.getElementById('loader-fill');
        const pctEl = document.getElementById('loader-percent');
        const stageMsgEl = document.getElementById('loader-stage-msg');
        const tipTextEl = document.getElementById('loader-tip-text');
        const ctrlTagsEl = document.getElementById('loader-controls-tags');
        const sizeValEl = document.getElementById('loader-size-val');
        const mbCounterEl = document.getElementById('loader-mb-counter');

        if (iconEl) iconEl.textContent = (game && game.emoji) ? game.emoji.split(' ')[0] : '🎮';
        if (titleEl) titleEl.textContent = (game && game.title) ? game.title : 'Arcade Game';
        if (tagEl) tagEl.textContent = (game && game.tags) ? game.tags[0] : 'Arcade';
        if (sizeValEl) sizeValEl.textContent = 'Instant Stream';
        if (mbCounterEl) mbCounterEl.textContent = '⚡ GPU Hardware Accelerated';
        if (fillEl) fillEl.style.width = '75%';
        if (pctEl) pctEl.textContent = '75%';
        if (stageMsgEl) stageMsgEl.textContent = '⚡ Initializing high-speed game engine...';
        if (tipTextEl) tipTextEl.textContent = (game && game.desc) ? game.desc : 'Get ready to play!';

        // Reset diagnostic checklist items with Fox theme icons
        const diagConfig = [
            { id: 'storage', icon: '⚡' },
            { id: 'assets', icon: '🚀' },
            { id: 'audio', icon: '🎵' },
            { id: 'engine', icon: '🛡️' }
        ];
        diagConfig.forEach(item => {
            const row = document.getElementById(`diag-${item.id}`);
            const icon = document.getElementById(`diag-${item.id}-icon`);
            if (row) row.classList.remove('done');
            if (icon) icon.textContent = item.icon;
        });

        if (ctrlTagsEl && game && game.controls) {
            ctrlTagsEl.innerHTML = '';
            game.controls.slice(0, 3).forEach(c => {
                const span = document.createElement('span');
                span.className = 'loader-key-pill';
                span.textContent = `${c.key}: ${c.label}`;
                ctrlTagsEl.appendChild(span);
            });
        }
    }

    if (onReady) onReady();
}

function dismissGameLoading() {
    const loader = document.getElementById('game-loader-overlay');
    const iframe = document.getElementById('active-game-iframe');

    const fillEl = document.getElementById('loader-fill');
    const pctEl = document.getElementById('loader-percent');
    const stageMsgEl = document.getElementById('loader-stage-msg');
    if (fillEl) fillEl.style.width = '100%';
    if (pctEl) pctEl.textContent = '100%';
    if (stageMsgEl) stageMsgEl.textContent = '🎮 Game ready!';

    // Mark all diagnostics as completed
    ['storage', 'assets', 'audio', 'engine'].forEach(k => {
        const row = document.getElementById(`diag-${k}`);
        const icon = document.getElementById(`diag-${k}-icon`);
        if (row) row.classList.add('done');
        if (icon) icon.textContent = '✓';
    });

    setTimeout(() => {
        if (iframe) {
            iframe.classList.add('loaded');
        }
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.classList.add('hidden');
                loader.style.display = 'none';
            }, 300);
        }
    }, 120);
}

// Universal Fullscreen Function for Game Player (Invoked via Action Bar Fullscreen Button)
function requestGameFullscreen() {
    try {
        const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        if (!isFs) {
            const wrapper = document.getElementById('game-screen-wrapper') || document.documentElement;
            const req = wrapper.requestFullscreen || wrapper.webkitRequestFullscreen || wrapper.mozRequestFullScreen || wrapper.msRequestFullscreen;
            if (req) {
                const promise = req.call(wrapper);
                if (promise && promise.catch) {
                    promise.catch(() => {
                        const docReq = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen || document.documentElement.mozRequestFullScreen;
                        if (docReq) {
                            docReq.call(document.documentElement).catch(() => { });
                        }
                    });
                }
            }
        }
    } catch (e) { }
}
window.requestGameFullscreen = requestGameFullscreen;

// ==========================================================
// 1. CRAZYGAMES-STYLE GAME PLAYER ENGINE
// ==========================================================

function openGamePlayer(gameId) {
    const game = GAMES_CATALOG.find(g => g.id === gameId) || GAMES_CATALOG[0];
    if (!game) return;

    currentGame = game;

    // Switch view state FIRST so player wrapper is visible in DOM
    document.body.setAttribute('data-view', 'player');
    document.body.classList.add('in-game-active');

    const catalogView = document.getElementById('catalog-view');
    const playerView = document.getElementById('game-player-view');

    if (catalogView) catalogView.classList.add('hidden');
    if (playerView) playerView.classList.remove('hidden');

    // Scroll smoothly to top of player
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Automatically trigger fullscreen mode upon clicking the game
    requestGameFullscreen();

    // Restore or apply preferred display aspect mode
    try {
        const savedIdx = parseInt(localStorage.getItem('kf_display_aspect_idx') || '0', 10);
        applyAspectRatioMode(isNaN(savedIdx) ? 0 : savedIdx);
    } catch (e) { }

    // Update Player Breadcrumbs
    const bcCategory = document.getElementById('player-bc-category');
    const bcTitle = document.getElementById('player-bc-title');
    if (bcCategory) bcCategory.textContent = game.category.toUpperCase();
    if (bcTitle) bcTitle.textContent = game.title;

    // Update Action Bar Meta
    document.getElementById('player-game-icon').textContent = game.emoji.split(' ')[0] || '🎮';
    document.getElementById('player-game-title').textContent = game.title;
    document.getElementById('player-game-rating').textContent = game.rating;
    document.getElementById('player-game-tag').textContent = game.tags[0] || 'Arcade';

    // Dynamic Plays: Directly proportional to active audience + register play for this launch
    if (window.audienceEngine) {
        window.audienceEngine.recordGamePlay(game.id);
    } else {
        document.getElementById('player-game-plays').textContent = `👥 ${game.plays} Plays`;
    }

    // Sync real-time live player count
    const playerLiveCount = document.getElementById('player-game-live-count');
    if (playerLiveCount && window.audienceEngine) {
        playerLiveCount.textContent = window.audienceEngine.getGameCount(game.id).toLocaleString();
    }

    // Update Like / Dislike reactions ("just for you")
    updateReactionUI(game.id);

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

    // Play next
    renderPlayNextSidebar(game);

    // Run high-performance loading screen with real device storage caching
    const iframe = document.getElementById('active-game-iframe');

    executeGameLoading(game, () => {
        if (iframe) {
            const gameUrl = resolveGameUrl(game.link);
            const currentParams = new URLSearchParams(window.location.search);
            let embedUrl = gameUrl.includes('?') ? `${gameUrl}&embedded=true` : `${gameUrl}?embedded=true`;
            const roomParam = currentParams.get('room');
            if (roomParam) {
                embedUrl += `&room=${encodeURIComponent(roomParam)}`;
            }
            iframe.src = embedUrl;

            let loadDismissed = false;
            const completeLaunch = () => {
                if (loadDismissed) return;
                loadDismissed = true;
                dismissGameLoading();
                iframe.focus();
            };

            iframe.onload = () => {
                try {
                    // Synchronize active user credentials & per-game isolated storage
                    KrazyGameStorage.prepareGameEnvironment(game.id, iframe.contentWindow);

                    if (iframe.contentDocument && iframe.contentDocument.documentElement) {
                        iframe.contentDocument.documentElement.classList.add('is-embedded');
                        if (iframe.contentDocument.body) {
                            iframe.contentDocument.body.classList.add('is-embedded');
                        }
                    }
                } catch (err) { }
                completeLaunch();
            };

            // Safety fallback so loading overlay gracefully reveals game even if onload event was intercepted
            setTimeout(completeLaunch, 2200);
        }
    });

    // Synchronize URL hash & query state
    const currentParams = new URLSearchParams(window.location.search);
    const roomParam = currentParams.get('room');
    let newUrl = `${window.location.pathname}?game=${game.id}`;
    if (roomParam) {
        newUrl += `&room=${encodeURIComponent(roomParam)}`;
    }
    window.history.pushState({ gameId: game.id }, game.title, newUrl);
}

function closeGamePlayer() {
    document.body.setAttribute('data-view', 'catalog');
    document.body.classList.remove('in-game-active'); // Resume catalog animations

    const catalogView = document.getElementById('catalog-view');
    const playerView = document.getElementById('game-player-view');

    if (playerView) playerView.classList.add('hidden');
    if (catalogView) catalogView.classList.remove('hidden');

    const playerGrid = document.querySelector('.player-layout-grid');
    if (playerGrid) playerGrid.classList.remove('theater-mode');

    const iframe = document.getElementById('active-game-iframe');
    if (iframe) {
        iframe.classList.remove('loaded');
        iframe.src = 'about:blank'; // Unload game to completely free RAM and audio
    }

    currentGame = null;
    window.history.pushState({}, 'Krazy Fuse', window.location.pathname);
    renderPortal();
}
window.closeGamePlayer = closeGamePlayer;

// Listen for embedded game exit & fullscreen messages
window.addEventListener('message', (event) => {
    if (!event || !event.data) return;
    const type = event.data.type || event.data.action || '';
    if (type === 'EXIT_TO_PORTAL' || type === 'BACK_TO_GAMES' || type === 'closeGame' || type === 'backToGames') {
        closeGamePlayer();
    } else if (type === 'REQUEST_FULLSCREEN' || type === 'requestFullscreen' || type === 'enterFullscreen') {
        requestGameFullscreen();
    } else if (type === 'RECORD_MULTIPLAYER_MATCH') {
        const { gameId, roomCode, gameMode, player1Name, player2Name, winnerName, scoreDetails } = event.data;
        if (typeof KrazySupabase !== 'undefined') {
            KrazySupabase.recordMultiplayerMatch({
                gameId, roomCode, gameMode, player1Name, player2Name, winnerName, scoreDetails
            });
        }
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
                <img src="${rec.thumbnail || `/thumbnails/${rec.id}.svg`}" alt="${rec.title}" class="pn-thumb-img" onerror="this.style.display='none'">
                <span class="pn-emoji">${rec.heroEmoji || rec.emoji}</span>
            </div>
            <div class="pn-info">
                <h4 class="pn-title">${rec.title}</h4>
                <div class="pn-meta">
                    <span class="pn-badge">${rec.tags[0] || 'Action'}</span>
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
    card.className = 'bento-card bento-span-1x1';
    card.dataset.id = game.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('title', `Play ${game.title}`);

    const thumbUrl = game.thumbnail || `/thumbnails/bento/${game.id}.webp`;
    const badgeText = game.actionBadge || (game.category ? game.category.toUpperCase() : 'ARCADE');

    card.innerHTML = `
        <img src="${thumbUrl}" alt="${game.title}" class="card-thumb-img" loading="lazy" onerror="this.onerror=null;this.src='/thumbnails/${game.id}.svg';">
        <div class="bento-hover-glow"></div>
        <div class="bento-card-info" style="opacity: 1; transform: translateY(0);">
            <div class="bento-card-title-col">
                <span class="bento-card-badge">${badgeText}</span>
                <h3 class="bento-card-title">${game.title}</h3>
            </div>
            <div class="bento-card-meta-col">
                <span class="bento-card-rating">★ ${game.rating || '5.0'}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        openGamePlayer(game.id);
    });

    return card;
}

function renderPortal() {
    const filterSection = document.getElementById('filtered-section');
    const bentoSection = document.getElementById('bento-arcade-section');
    const filteredGrid = document.getElementById('filtered-grid');

    const hasFilter = activeCategory !== 'all' || searchQuery.length > 0;

    if (hasFilter) {
        if (filterSection) filterSection.classList.remove('hidden');
        if (bentoSection) bentoSection.classList.add('hidden');

        if (filteredGrid) {
            filteredGrid.innerHTML = '';
            const catKey = (activeCategory || 'all').toLowerCase();
            const matched = GAMES_CATALOG.filter(game => {
                let matchesCategory = true;
                if (catKey === 'trending' || catKey === 'popular') {
                    matchesCategory = Boolean(game.trending);
                } else if (catKey === 'new') {
                    matchesCategory = Boolean(game.isNew);
                } else if (catKey === 'Pass & Play') {
                    matchesCategory = Boolean(game.multiplayer) || game.category === 'Pass & Play' || game.tags.some(t => /multiplayer|pvp/i.test(t));
                } else if (catKey === 'runners' || catKey === 'runner') {
                    matchesCategory = game.category === 'runner' || game.tags.some(t => /runner/i.test(t));
                } else if (catKey === 'action') {
                    matchesCategory = game.category === 'action' || game.tags.some(t => /action|combat|fighting|roguelite/i.test(t));
                } else if (catKey === 'darts' || catKey === 'pvp') {
                    matchesCategory = game.id === 'dart-board' || game.tags.some(t => /dart/i.test(t));
                } else if (catKey === 'arcade') {
                    matchesCategory = game.category === 'arcade' || game.tags.some(t => /arcade|physics|flappy/i.test(t));
                } else if (catKey === 'reflex') {
                    matchesCategory = game.category === 'reflex' || game.tags.some(t => /reflex|timing/i.test(t));
                } else if (catKey === 'bookmarks') {
                    matchesCategory = getStoredBookmarks().includes(game.id);
                } else if (catKey !== 'all' && catKey !== 'home') {
                    matchesCategory = game.category === catKey || game.tags.some(t => t.toLowerCase() === catKey);
                }

                const q = searchQuery.toLowerCase();
                const matchesSearch = !q || game.title.toLowerCase().includes(q) || game.desc.toLowerCase().includes(q) || game.tags.some(t => t.toLowerCase().includes(q));

                return matchesCategory && matchesSearch;
            });

            const countEl = document.getElementById('filtered-count');
            const titleEl = document.getElementById('filtered-title');
            if (countEl) countEl.textContent = `${matched.length} games`;
            if (titleEl) {
                if (searchQuery) titleEl.textContent = `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"`;
                else if (catKey === 'trending' || catKey === 'popular') titleEl.textContent = `🔥 POPULAR & TRENDING GAMES`;
                else if (catKey === 'new') titleEl.textContent = `🆕 NEW ARCADE RELEASES`;
                else if (catKey === 'Pass & Play') titleEl.textContent = `🏆 MULTIPLAYER & PVP BATTLES`;
                else if (catKey === 'runners' || catKey === 'runner') titleEl.textContent = `🏃 ENDLESS RUNNERS & ESCAPE`;
                else if (catKey === 'darts' || catKey === 'pvp') titleEl.textContent = `🎯 DARTS & TARGET GAMES`;
                else if (catKey === 'action') titleEl.textContent = `⚔️ ACTION & COMBAT`;
                else if (catKey === 'arcade') titleEl.textContent = `🕹️ CLASSIC ARCADE GAMES`;
                else if (catKey === 'reflex') titleEl.textContent = `⚡ REFLEX & TIMING`;
                else if (catKey === 'bookmarks') titleEl.textContent = `🔖 SAVED BOOKMARKS`;
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
        if (bentoSection) bentoSection.classList.remove('hidden');

        // Wire up Bento Grid clicks
        document.querySelectorAll('.bento-card').forEach(card => {
            if (!card.dataset.wired) {
                card.dataset.wired = 'true';
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.addEventListener('click', () => {
                    const gameId = card.dataset.id;
                    if (gameId) openGamePlayer(gameId);
                });
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const gameId = card.dataset.id;
                        if (gameId) openGamePlayer(gameId);
                    }
                });
            }
        });
    }
}

// ==========================================================
// 3. INTERACTIVE PLAYER CONTROLS (Likes, Dislikes, Bookmarks)
// ==========================================================

const liveReactionsCache = {};

function getKrazyClientIdentifier() {
    if (typeof AuthManager !== 'undefined' && AuthManager.isLoggedIn()) {
        return AuthManager.getActiveUser().username;
    }
    let anonId = localStorage.getItem('kf_client_anon_id');
    if (!anonId) {
        anonId = 'anon_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('kf_client_anon_id', anonId);
    }
    return anonId;
}

function getReactionStorageKey(gameId) {
    const ident = getKrazyClientIdentifier();
    return `kf_reaction_${ident}_${gameId}`;
}

function getUserReaction(gameId) {
    try {
        return localStorage.getItem(getReactionStorageKey(gameId)); // 'like', 'dislike', or null
    } catch (e) {
        return null;
    }
}

function setUserReaction(gameId, reaction) {
    try {
        const key = getReactionStorageKey(gameId);
        if (reaction) {
            localStorage.setItem(key, reaction);
        } else {
            localStorage.removeItem(key);
        }
    } catch (e) { }
}

async function fetchLiveReactions(gameId) {
    if (typeof KrazySupabase !== 'undefined' && KrazySupabase.isConfigured()) {
        const counts = await KrazySupabase.getGameReactionCounts(gameId);
        liveReactionsCache[gameId] = counts;
        updateReactionUI(gameId, false);
    }
}

function updateReactionUI(gameId, shouldPulse = false) {
    if (!gameId) return;
    const game = GAMES_CATALOG.find(g => g.id === gameId);
    if (!game) return;

    const reaction = getUserReaction(gameId);
    const likeBtn = document.getElementById('btn-game-like');
    const dislikeBtn = document.getElementById('btn-game-dislike');
    const likesCountEl = document.getElementById('game-likes-count');

    const isLiked = reaction === 'like';
    const isDisliked = reaction === 'dislike';

    if (likeBtn) {
        likeBtn.classList.toggle('liked', isLiked);
        likeBtn.classList.toggle('active', isLiked);
        if (shouldPulse) {
            likeBtn.classList.remove('reaction-pulse');
            void likeBtn.offsetWidth;
            likeBtn.classList.add('reaction-pulse');
        }
    }
    if (dislikeBtn) {
        dislikeBtn.classList.toggle('disliked', isDisliked);
        dislikeBtn.classList.toggle('active', isDisliked);
        if (shouldPulse) {
            dislikeBtn.classList.remove('reaction-pulse');
            void dislikeBtn.offsetWidth;
            dislikeBtn.classList.add('reaction-pulse');
        }
    }

    if (likesCountEl) {
        const liveCounts = liveReactionsCache[gameId];
        const isCloudActive = typeof KrazySupabase !== 'undefined' && KrazySupabase.isConfigured();
        const baseLikes = game.likesCount || 1000;

        let totalLikes;
        if (isCloudActive && liveCounts) {
            totalLikes = baseLikes + liveCounts.likes;
        } else {
            const bonus = isLiked ? 1 : 0;
            totalLikes = baseLikes + bonus;
        }

        likesCountEl.textContent = formatCompactNumber(totalLikes);
    }
}

async function handleLikeClick() {
    if (!currentGame) return;
    const current = getUserReaction(currentGame.id);
    const ident = getKrazyClientIdentifier();
    let newReaction = null;

    if (current === 'like') {
        setUserReaction(currentGame.id, null);
        showToast('Vote removed.', '👍');
    } else {
        newReaction = 'like';
        setUserReaction(currentGame.id, 'like');
        showToast('👍 Marked as Liked! Live synced.', '💚');
    }

    updateReactionUI(currentGame.id, true);

    if (typeof KrazySupabase !== 'undefined') {
        await KrazySupabase.saveReaction(currentGame.id, ident, newReaction);
        fetchLiveReactions(currentGame.id);
    }
}

async function handleDislikeClick() {
    if (!currentGame) return;
    const current = getUserReaction(currentGame.id);
    const ident = getKrazyClientIdentifier();
    let newReaction = null;

    if (current === 'dislike') {
        setUserReaction(currentGame.id, null);
        showToast('Dislike removed.', '👎');
    } else {
        newReaction = 'dislike';
        setUserReaction(currentGame.id, 'dislike');
        showToast('👎 Marked as Disliked! Live synced.', '💔');
    }

    updateReactionUI(currentGame.id, true);

    if (typeof KrazySupabase !== 'undefined') {
        await KrazySupabase.saveReaction(currentGame.id, ident, newReaction);
        fetchLiveReactions(currentGame.id);
    }
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
        if (req) req.call(wrapper).catch(() => { });
    } else {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document).catch(() => { });
    }
}

// Viewport Aspect Ratio & Display Width Toggle
// Modes:
// 0: Standard 16:9 Wide (comfortable wide screen)
// 1: Theater Full Width (expands across full arena width, looks like fullscreen mode)
// 2: 21:9 Ultrawide Cinema (cinematic panoramic)
// 3: 4:3 Classic Fit (maximum vertical room)
const ASPECT_MODES = ['aspect-16-9', 'aspect-theater', 'aspect-ultrawide', 'aspect-fit'];
let currentAspectIdx = 0;

function applyAspectRatioMode(idx) {
    const wrapper = document.getElementById('game-screen-wrapper');
    const playerGrid = document.querySelector('.player-layout-grid');
    const btnAspect = document.getElementById('btn-game-aspect');
    if (!wrapper) return;

    wrapper.classList.remove('aspect-theater', 'aspect-ultrawide', 'aspect-fit');
    if (playerGrid) playerGrid.classList.remove('theater-mode');

    currentAspectIdx = ((idx % ASPECT_MODES.length) + ASPECT_MODES.length) % ASPECT_MODES.length;
    const mode = ASPECT_MODES[currentAspectIdx];

    if (mode === 'aspect-theater') {
        wrapper.classList.add('aspect-theater');
        if (playerGrid) playerGrid.classList.add('theater-mode');
        if (btnAspect) btnAspect.title = 'Display Mode: Theater Full-Width (Click to change)';
        showToast('Display Width: Theater Full-Width (Fullscreen View)', '🎬');
    } else if (mode === 'aspect-ultrawide') {
        wrapper.classList.add('aspect-ultrawide');
        if (btnAspect) btnAspect.title = 'Display Mode: 21:9 Ultrawide Cinema (Click to change)';
        showToast('Aspect Ratio: 21:9 Ultrawide Cinema', '🖥️');
    } else if (mode === 'aspect-fit') {
        wrapper.classList.add('aspect-fit');
        if (btnAspect) btnAspect.title = 'Display Mode: 4:3 Classic Fit (Click to change)';
        showToast('Aspect Ratio: 4:3 Classic Fit (Full Height)', '📱');
    } else {
        if (btnAspect) btnAspect.title = 'Display Mode: 16:9 Standard Wide (Click to change)';
        showToast('Aspect Ratio: 16:9 Standard Wide', '📺');
    }

    try {
        localStorage.setItem('kf_display_aspect_idx', currentAspectIdx.toString());
    } catch (e) { }
}

function cycleAspectRatio() {
    applyAspectRatioMode(currentAspectIdx + 1);
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
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav-item[data-filter], .sidebar-nav-item[data-category]');
    const sectionLinks = document.querySelectorAll('.section-title-link[data-filter]');

    const updateActiveCategory = (cat) => {
        if (cat === 'random') {
            playRandomGame();
            return;
        }

        if (cat === 'home') cat = 'all';

        activeCategory = cat;

        // Clear active search so the genre results aren't blocked by a search keyword
        if (cat !== 'all') {
            searchQuery = '';
            const heroInput = document.getElementById('hero-search-input') || document.getElementById('search-games-input');
            const navInput = document.getElementById('nav-search-input');
            const btnClearNav = document.getElementById('nav-search-clear');
            if (heroInput) heroInput.value = '';
            if (navInput) navInput.value = '';
            if (btnClearNav) btnClearNav.classList.add('hidden');
        }

        pills.forEach(p => p.classList.toggle('active', p.dataset.category === cat));
        navShortcuts.forEach(n => n.classList.toggle('active', n.dataset.category === cat));
        railBtns.forEach(r => r.classList.toggle('active', r.dataset.category === cat));
        sidebarNavItems.forEach(s => {
            const sc = s.dataset.filter || s.dataset.category;
            const isMatch = sc === cat || (cat === 'all' && (sc === 'home' || sc === 'all'));
            s.classList.toggle('active', isMatch);
        });

        // If inside player view, close it to view category catalog
        if (document.body.getAttribute('data-view') === 'player') {
            closeGamePlayer();
        }

        renderPortal();

        // Direct user right into view of the selected genre's games!
        if (cat !== 'all') {
            const filterSec = document.getElementById('filtered-section');
            if (filterSec) {
                setTimeout(() => {
                    const navHeight = 90;
                    const topPos = filterSec.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
                }, 60);
            }
            try {
                history.replaceState(null, '', `#genre=${cat}`);
            } catch (_) { }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            try {
                history.replaceState(null, '', window.location.pathname);
            } catch (_) { }
        }
    };

    window.updateActiveCategory = updateActiveCategory;

    sidebarNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            updateActiveCategory(item.dataset.filter || item.dataset.category || 'all');
        });
    });

    sectionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            updateActiveCategory(link.dataset.filter || 'all');
        });
    });

    pills.forEach(pill => {
        pill.addEventListener('click', () => updateActiveCategory(pill.dataset.category || 'all'));
    });

    navShortcuts.forEach(btn => {
        btn.addEventListener('click', () => updateActiveCategory(btn.dataset.category || 'all'));
    });

    railBtns.forEach(btn => {
        btn.addEventListener('click', () => updateActiveCategory(btn.dataset.category || 'all'));
    });

    // Check URL hash or query param for initial category redirection
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const hashMatch = window.location.hash.match(/genre=([a-zA-Z0-9_-]+)/);
        const initialGenre = urlParams.get('genre') || (hashMatch ? hashMatch[1] : null);
        if (initialGenre && initialGenre !== 'all' && initialGenre !== 'home') {
            setTimeout(() => {
                updateActiveCategory(initialGenre);
            }, 100);
        }
    } catch (_) { }
}

function setupSearchControls() {
    const heroInput = document.getElementById('hero-search-input') || document.getElementById('search-games-input');
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
            else if (navInput) onSearchChange(navInput.value);
        });
    }
}

// ==========================================================
// Center Logo Interactive Fullscreen Animation Playback Engine
// Plays video across whole screen on click, then reverts to site
// ==========================================================
function setupHeroMascotVideo() {
    const wrap = document.getElementById('hero-mascot-wrap');
    const overlay = document.getElementById('fullscreen-mascot-overlay');
    const video = document.getElementById('fullscreen-mascot-video');
    const btnClose = document.getElementById('btn-close-mascot-video');
    if (!wrap || !overlay || !video) return;

    let isPlaying = false;
    let isRetreating = false;
    const container = overlay.querySelector('.fullscreen-video-container');

    function calculateLogoTarget() {
        const rect = wrap.getBoundingClientRect();
        const logoCenterX = rect.left + rect.width / 2;
        const logoCenterY = rect.top + rect.height / 2;
        const cRect = container ? container.getBoundingClientRect() : { left: window.innerWidth / 2 - 400, top: window.innerHeight / 2 - 225, width: 800, height: 450 };
        const containerCenterX = cRect.left + cRect.width / 2;
        const containerCenterY = cRect.top + cRect.height / 2;
        const dx = logoCenterX - containerCenterX;
        const dy = logoCenterY - containerCenterY;
        const scale = Math.max(0.12, Math.min(0.28, (rect.width || 180) / cRect.width));
        return { dx, dy, scale };
    }

    function playMascotVideo() {
        if (isPlaying) return;
        isPlaying = true;
        isRetreating = false;

        // Calculate dynamic starting coordinates from the hero center logo
        const { dx, dy, scale } = calculateLogoTarget();

        // 1. Position video container exactly over the hero mascot crest initially
        if (container) {
            container.style.transition = 'none';
            container.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
            container.style.opacity = '0';
            container.style.filter = 'blur(6px) brightness(1.3)';
        }

        overlay.classList.remove('retreating');
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // 2. Trigger mascot launch burst on the logo
        const heroImg = wrap.querySelector('.hero-mascot-img, .brand-mascot-img') || wrap;
        heroImg.classList.remove('mascot-returning', 'mascot-launching');
        void heroImg.offsetWidth;
        heroImg.classList.add('mascot-launching');
        setTimeout(() => {
            heroImg.classList.remove('mascot-launching');
        }, 750);

        // 3. Force reflow so starting transformation is registered by browser
        void overlay.offsetWidth;
        overlay.classList.add('active');

        // 4. Smoothly burst / expand out of the logo into fullscreen center!
        requestAnimationFrame(() => {
            if (container) {
                container.style.transition = 'transform 0.68s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.55s ease';
                container.style.transform = 'translate(0px, 0px) scale(1)';
                container.style.opacity = '1';
                container.style.filter = 'drop-shadow(0 20px 50px rgba(0, 0, 0, 0.7))';
            }
        });

        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn('Fullscreen animation playback note:', err);
            });
        }
    }

    function retreatMascotVideo() {
        if (!isPlaying || isRetreating) return;
        isRetreating = true;

        // Calculate dynamic translation directly into the hero center logo
        if (container) {
            const { dx, dy, scale } = calculateLogoTarget();
            container.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.55s ease';
            container.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
            container.style.opacity = '0';
            container.style.filter = 'blur(4px) brightness(1.25)';
        }

        overlay.classList.add('retreating');

        // Welcome the fox back into the logo with a smooth landing pulse
        const heroImg = wrap.querySelector('.hero-mascot-img, .brand-mascot-img') || wrap;
        heroImg.classList.remove('mascot-returning', 'mascot-launching');
        void heroImg.offsetWidth;
        heroImg.classList.add('mascot-returning');
        setTimeout(() => {
            heroImg.classList.remove('mascot-returning');
        }, 800);

        // After the smooth retreat completes (650ms), cleanup
        setTimeout(() => {
            if (isRetreating) {
                cleanupMascotVideo();
            }
        }, 650);
    }

    function cleanupMascotVideo() {
        isPlaying = false;
        isRetreating = false;
        overlay.classList.remove('active');
        overlay.classList.remove('retreating');
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (container) {
            container.style.transition = '';
            container.style.transform = '';
            container.style.opacity = '';
            container.style.filter = '';
        }
        try {
            video.pause();
            video.currentTime = 0;
        } catch (_) { }
    }

    // Click on centre hero logo triggers whole-screen animation
    wrap.addEventListener('click', (e) => {
        e.preventDefault();
        playMascotVideo();
    });

    wrap.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playMascotVideo();
        }
    });

    // Monitor playback: transition smoothly before the video cut/freeze at 7.3s
    video.addEventListener('timeupdate', () => {
        if (isPlaying && !isRetreating && video.currentTime >= 7.3) {
            retreatMascotVideo();
        }
    });

    // When video completes, retreat naturally if not already retreating
    video.addEventListener('ended', () => {
        if (!isRetreating) retreatMascotVideo();
    });

    video.addEventListener('error', cleanupMascotVideo);

    // Clicking anywhere on the overlay also initiates natural retreat
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === overlay.querySelector('.fullscreen-video-container')) {
            retreatMascotVideo();
        }
    });

    // Escape key initiates natural retreat
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isPlaying) {
            e.preventDefault();
            retreatMascotVideo();
        }
    });
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
    const btnNavPitch = document.getElementById('nav-btn-pitch-modal');
    const btnBannerPitch = document.getElementById('btn-banner-pitch');
    const btnBannerPublish = document.getElementById('btn-banner-publish');
    const btnClose = document.getElementById('btn-close-modal');
    const btnSubmit = document.getElementById('btn-submit-idea');
    const input = document.getElementById('idea-input');
    const tabCompose = document.getElementById('tab-btn-pitch-compose');
    const tabFeed = document.getElementById('tab-btn-pitch-feed');
    const composeView = document.getElementById('pitch-compose-view');
    const feedView = document.getElementById('stored-ideas-list');
    const countBadge = document.getElementById('saved-ideas-count');
    const statusBadge = document.getElementById('supabase-status-badge');
    const btnOpenSettings = document.getElementById('btn-open-supabase-settings');

    const switchTab = (tab) => {
        if (tab === 'compose') {
            if (tabCompose) tabCompose.classList.add('active');
            if (tabFeed) tabFeed.classList.remove('active');
            if (composeView) composeView.style.display = 'block';
            if (feedView) feedView.style.display = 'none';
            if (btnSubmit) btnSubmit.style.display = 'inline-block';
        } else {
            if (tabCompose) tabCompose.classList.remove('active');
            if (tabFeed) tabFeed.classList.add('active');
            if (composeView) composeView.style.display = 'none';
            if (feedView) feedView.style.display = 'flex';
            if (btnSubmit) btnSubmit.style.display = 'none';
            loadAndRenderPitches();
        }
    };

    const openModal = () => {
        if (modal) modal.classList.add('active');
        switchTab('compose');
        updatePitchesCount();
        if (typeof KrazySupabase !== 'undefined') KrazySupabase.updateConnectionUI();
    };

    const closeModal = () => {
        if (modal) modal.classList.remove('active');
        if (input) input.value = '';
    };

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnOpen2) btnOpen2.addEventListener('click', openModal);
    if (btnNavPitch) btnNavPitch.addEventListener('click', openModal);
    if (btnBannerPitch) btnBannerPitch.addEventListener('click', openModal);
    if (btnBannerPublish) btnBannerPublish.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    if (tabCompose) tabCompose.addEventListener('click', () => switchTab('compose'));
    if (tabFeed) tabFeed.addEventListener('click', () => switchTab('feed'));

    if (btnSubmit && input) {
        btnSubmit.addEventListener('click', async () => {
            const val = input.value.trim();
            if (!val) {
                alert('Please type a game concept first!');
                return;
            }

            const user = (typeof AuthManager !== 'undefined') ? AuthManager.getActiveUser() : { username: 'Guest Gamer', avatar: '👾' };
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'TRANSMITTING...';

            if (typeof KrazySupabase !== 'undefined') {
                await KrazySupabase.submitPitch(user.username, user.avatar, val);
            }

            btnSubmit.disabled = false;
            btnSubmit.textContent = 'SUBMIT CONCEPT 🚀';

            input.value = '';
            showToast('🚀 Pitch submitted! Visible live in community feed.', '💡');
            switchTab('feed');
            updatePitchesCount();
        });
    }

    updatePitchesCount();
}

async function updatePitchesCount() {
    const badge = document.getElementById('saved-ideas-count');
    if (!badge) return;
    if (typeof KrazySupabase !== 'undefined') {
        const pitches = await KrazySupabase.fetchRecentPitches(50);
        badge.textContent = pitches.length;
    }
}

async function loadAndRenderPitches() {
    const container = document.getElementById('stored-ideas-list');
    if (!container) return;

    container.innerHTML = '<div class="pitch-feed-loading" style="text-align: center; padding: 20px; color: var(--text-muted);">📡 Loading live community pitches...</div>';

    if (typeof KrazySupabase === 'undefined') {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">Supabase service not loaded.</div>';
        return;
    }

    const pitches = await KrazySupabase.fetchRecentPitches(50);
    const countBadge = document.getElementById('saved-ideas-count');
    if (countBadge) countBadge.textContent = pitches.length;

    if (!pitches || pitches.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px; color: var(--text-muted);">
                <div style="font-size: 2.2rem; margin-bottom: 8px;">💡</div>
                <h4 style="color: var(--text-main); margin-bottom: 4px;">No Pitches Yet</h4>
                <p>Be the first player to pitch an awesome game idea!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    pitches.forEach(pitch => {
        container.appendChild(createPitchCardElement(pitch));
    });
}

function createPitchCardElement(pitch) {
    const card = document.createElement('div');
    card.className = 'pitch-item-card';

    const timeStr = pitch.created_at ? formatRelativeTime(new Date(pitch.created_at)) : 'Just now';

    card.innerHTML = `
        <div class="pitch-item-top">
            <div class="pitch-item-user">
                <span style="font-size: 1.1rem;">${pitch.avatar || '👾'}</span>
                <span>${escapeHtml(pitch.username || 'Guest')}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span class="pitch-status-tag">${escapeHtml(pitch.status || 'reviewing')}</span>
                <span class="pitch-item-time">${timeStr}</span>
            </div>
        </div>
        <div class="pitch-item-text">${escapeHtml(pitch.pitch_text)}</div>
    `;
    return card;
}

function formatRelativeTime(date) {
    if (!date || isNaN(date.getTime())) return 'Just now';
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${Math.floor(diffHr / 24)}d ago`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ==========================================================
// SUPABASE REALTIME EVENT LISTENERS (BACKGROUND / CODING DRIVEN)
// ==========================================================
function setupSupabaseRealtimeListeners() {
    // Realtime event listeners for live broadcasts
    window.addEventListener('krazy:reaction_changed', (e) => {
        const payload = e.detail;
        if (!payload) return;
        const gameId = payload.new?.game_id || payload.old?.game_id;
        if (gameId) {
            delete liveReactionsCache[gameId];
            fetchLiveReactions(gameId);
            if (currentGame && currentGame.id === gameId) {
                updateReactionUI(gameId, true);
                showToast(`⚡ Live vote updated for ${currentGame.title}!`, '👍');
            }
        }
    });

    window.addEventListener('krazy:new_pitch', (e) => {
        const newPitch = e.detail;
        if (!newPitch) return;
        const feed = document.getElementById('stored-ideas-list');
        if (feed && feed.style.display !== 'none') {
            const card = createPitchCardElement(newPitch);
            feed.insertBefore(card, feed.firstChild);
        }
        updatePitchesCount();
        const suggestModal = document.getElementById('suggest-modal');
        if (!suggestModal || !suggestModal.classList.contains('active')) {
            showToast(`💡 New game pitch from ${newPitch.username || 'someone'}!`, '✨');
        }
    });
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

    // Dynamically swap mascot crest between Day Mode (white crest) and Night Mode (dark crest)
    const mascotSrc = (theme === 'day') ? 'krazio-mascot-day.svg' : 'krazio-mascot.svg';
    document.querySelectorAll('.brand-mascot-img, .hero-mascot-img, .footer-mascot-img').forEach(img => {
        if (img) img.src = mascotSrc;
    });

    if (btn) {
        if (theme === 'day') {
            btn.innerHTML = `<svg class="nav-action-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a6a4ba" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
            btn.title = "Switch to Dark Mode";
        } else {
            btn.innerHTML = `<svg class="nav-action-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a6a4ba" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"></circle><line x1="12" y1="2" x2="12" y2="4.5"></line><line x1="12" y1="19.5" x2="12" y2="22"></line><line x1="4.22" y1="4.22" x2="6" y2="6"></line><line x1="18" y1="18" x2="19.78" y2="19.78"></line><line x1="2" y1="12" x2="4.5" y2="12"></line><line x1="19.5" y1="12" x2="22" y2="12"></line><line x1="4.22" y1="19.78" x2="6" y2="18"></line><line x1="18" y1="6" x2="19.78" y2="4.22"></line></svg>`;
            btn.title = "Switch to Light Mode";
        }
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

function setupAuthModal() {
    const btnOpen = document.getElementById('btn-user-auth');
    const modal = document.getElementById('auth-modal');
    const btnClose = document.getElementById('btn-close-auth-modal');
    const btnDone = document.getElementById('btn-auth-modal-close');
    const btnLogin = document.getElementById('btn-auth-login-submit');
    const btnGuest = document.getElementById('btn-auth-switch-guest');
    const btnLogout = document.getElementById('btn-auth-logout');
    const btnClearCurrent = document.getElementById('btn-auth-clear-current');
    const usernameInput = document.getElementById('auth-username-input');
    const pinInput = document.getElementById('auth-pin-input');
    const avatarPicker = document.getElementById('auth-avatar-picker');

    // Social & Quick Guest Buttons
    const btnGoogle = document.getElementById('btn-auth-google');
    const btnApple = document.getElementById('btn-auth-apple');
    const btnGuestQuick = document.getElementById('btn-auth-guest-quick');

    const btnToggleSwitch = document.getElementById('btn-toggle-switch-account');
    const loginContainer = document.getElementById('auth-login-container');
    const btnSideProfile = document.getElementById('btn-sidebar-profile');

    let selectedAvatar = '👾';

    if (!modal) return;

    function openModal() {
        modal.classList.add('active', 'open');
        renderAuthModalContent();
    }

    function closeModal() {
        modal.classList.remove('active', 'open');
    }

    window.openProfileModal = openModal;
    window.closeProfileModal = closeModal;

    const btnLoginCta = document.getElementById('nav-btn-login-cta');
    const navUserPill = document.getElementById('nav-user-pill');

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnLoginCta) btnLoginCta.addEventListener('click', openModal);
    if (navUserPill) navUserPill.addEventListener('click', openModal);
    if (btnSideProfile) btnSideProfile.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnDone) btnDone.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (btnToggleSwitch && loginContainer) {
        btnToggleSwitch.addEventListener('click', () => {
            loginContainer.classList.toggle('collapsed');
            const isCollapsed = loginContainer.classList.contains('collapsed');
            btnToggleSwitch.innerHTML = isCollapsed
                ? '<span>🔄 Switch or Link Another Account</span>'
                : '<span>▲ Hide Account Switcher</span>';
        });
    }

    // 1. Quick Guest Mode
    if (btnGuestQuick) {
        btnGuestQuick.addEventListener('click', () => {
            AuthManager.logout();
            renderAuthModalContent();
            showToast('Switched to Quick Guest Session! Instant play active.', '⚡');
        });
    }

    // 2. Google OAuth Sign-In
    if (btnGoogle) {
        btnGoogle.addEventListener('click', async () => {
            if (typeof KrazySupabase !== 'undefined' && KrazySupabase.isConfigured()) {
                showToast('Connecting to Google Sign-In...', '🚀');
                const { error } = await KrazySupabase.signInWithOAuth('google');
                if (error) {
                    console.error('Google OAuth error:', error);
                    const msg = (error.message || '').toLowerCase();
                    if (error.isProviderDisabled || msg.includes('not enabled') || msg.includes('unsupported')) {
                        if (typeof window.showOAuthProviderHelp === 'function') {
                            window.showOAuthProviderHelp('google', 'Google Sign-In Setup');
                        }
                    } else {
                        showToast(`Google Sign-In: ${error.message || 'Ensure Google provider is enabled in Supabase'}`, '⚠️');
                    }
                }
            } else {
                showToast('Supabase is not configured yet. Set SUPABASE_URL & SUPABASE_ANON_KEY in .env', '⚠️');
            }
        });
    }

    // 3. Apple OAuth Sign-In
    if (btnApple) {
        btnApple.addEventListener('click', async () => {
            if (typeof KrazySupabase !== 'undefined' && KrazySupabase.isConfigured()) {
                showToast('Connecting to Apple Sign-In...', '');
                const { error } = await KrazySupabase.signInWithOAuth('apple');
                if (error) {
                    console.error('Apple OAuth error:', error);
                    const msg = (error.message || '').toLowerCase();
                    if (error.isProviderDisabled || msg.includes('not enabled') || msg.includes('unsupported') || msg.includes('could not be found')) {
                        if (typeof window.showOAuthProviderHelp === 'function') {
                            window.showOAuthProviderHelp('apple', 'Apple Sign-In Setup');
                        }
                    } else {
                        showToast(`Apple Sign-In: ${error.message || 'Ensure Apple provider is enabled in Supabase'}`, '⚠️');
                    }
                }
            } else {
                showToast('Supabase is not configured yet. Set SUPABASE_URL & SUPABASE_ANON_KEY in .env', '⚠️');
            }
        });
    }

    // Avatar selector
    if (avatarPicker) {
        avatarPicker.addEventListener('click', (e) => {
            const btn = e.target.closest('.avatar-pick-btn');
            if (!btn) return;
            const newAvatar = btn.getAttribute('data-avatar') || '👾';
            selectedAvatar = newAvatar;

            avatarPicker.querySelectorAll('.avatar-pick-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const preview = document.getElementById('modal-auth-avatar-preview');
            if (preview) preview.textContent = selectedAvatar;

            // Immediately apply and persist avatar for active user or guest
            AuthManager.setAvatar(selectedAvatar);
        });
    }

    // In-Game Name Change Handlers
    const btnEditUsername = document.getElementById('btn-edit-username');
    const editPanel = document.getElementById('auth-username-edit-panel');
    const inputChangeUsername = document.getElementById('input-change-username');
    const btnSaveUsername = document.getElementById('btn-save-username');
    const btnCancelUsername = document.getElementById('btn-cancel-username');
    const usernameErrorMsg = document.getElementById('username-error-msg');

    function closeNameEditPanel() {
        if (editPanel) editPanel.classList.add('hidden');
        if (usernameErrorMsg) {
            usernameErrorMsg.classList.add('hidden');
            usernameErrorMsg.textContent = '';
        }
        if (inputChangeUsername) {
            inputChangeUsername.classList.remove('input-error');
        }
    }

    if (btnEditUsername && editPanel) {
        btnEditUsername.addEventListener('click', () => {
            const user = AuthManager.getActiveUser();
            if (!user.isLoggedIn) return;
            editPanel.classList.remove('hidden');
            if (inputChangeUsername) {
                inputChangeUsername.value = user.username;
                inputChangeUsername.focus();
                inputChangeUsername.select();
            }
            if (usernameErrorMsg) {
                usernameErrorMsg.classList.add('hidden');
                usernameErrorMsg.textContent = '';
            }
        });
    }

    if (btnCancelUsername) {
        btnCancelUsername.addEventListener('click', closeNameEditPanel);
    }

    function handleSaveNewUsername() {
        if (!inputChangeUsername) return;
        const newName = inputChangeUsername.value.trim();
        const currentName = AuthManager.getActiveUser().username;

        if (usernameErrorMsg) {
            usernameErrorMsg.classList.add('hidden');
            usernameErrorMsg.textContent = '';
        }
        inputChangeUsername.classList.remove('input-error');

        const res = AuthManager.changeUsername(currentName, newName);
        if (!res.success) {
            if (usernameErrorMsg) {
                usernameErrorMsg.textContent = res.error;
                usernameErrorMsg.classList.remove('hidden');
            }
            inputChangeUsername.classList.add('input-error');
            inputChangeUsername.focus();
            showToast(res.error, '⚠️');
            return;
        }

        closeNameEditPanel();
        renderAuthModalContent();
    }

    if (btnSaveUsername) {
        btnSaveUsername.addEventListener('click', handleSaveNewUsername);
    }

    if (inputChangeUsername) {
        inputChangeUsername.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSaveNewUsername();
            } else if (e.key === 'Escape') {
                closeNameEditPanel();
            }
        });

        inputChangeUsername.addEventListener('input', () => {
            const val = inputChangeUsername.value.trim();
            const current = AuthManager.getActiveUser().username;
            if (val && val.toLowerCase() !== current.toLowerCase() && AuthManager.isUsernameTaken(val, current)) {
                if (usernameErrorMsg) {
                    usernameErrorMsg.textContent = `⚠️ The name "${val}" is already taken! Every player must have a unique name.`;
                    usernameErrorMsg.classList.remove('hidden');
                }
                inputChangeUsername.classList.add('input-error');
            } else {
                if (usernameErrorMsg) {
                    usernameErrorMsg.classList.add('hidden');
                    usernameErrorMsg.textContent = '';
                }
                inputChangeUsername.classList.remove('input-error');
            }
        });
    }

    const authFeedback = document.getElementById('auth-username-feedback');

    function updateAuthUsernameFeedback() {
        if (!usernameInput || !authFeedback) return;
        const val = usernameInput.value.trim();
        const pin = pinInput ? pinInput.value.trim() : '';

        if (!val) {
            authFeedback.className = 'auth-input-feedback hidden';
            authFeedback.textContent = '';
            usernameInput.classList.remove('input-error', 'input-success');
            return;
        }

        const check = AuthManager.checkUsernameAvailability(val, pin);
        authFeedback.classList.remove('hidden');

        if (check.available) {
            authFeedback.className = 'auth-input-feedback success';
            authFeedback.textContent = check.message;
            usernameInput.classList.remove('input-error');
            usernameInput.classList.add('input-success');
        } else {
            authFeedback.className = 'auth-input-feedback error';
            authFeedback.textContent = check.message;
            usernameInput.classList.add('input-error');
            usernameInput.classList.remove('input-success');
        }
    }

    if (usernameInput) {
        usernameInput.addEventListener('input', updateAuthUsernameFeedback);
        if (pinInput) {
            pinInput.addEventListener('input', updateAuthUsernameFeedback);
        }
        usernameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && btnLogin) {
                btnLogin.click();
            }
        });
    }

    // Login submit
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            const name = usernameInput ? usernameInput.value.trim() : '';
            const pin = pinInput ? pinInput.value.trim() : '';
            if (!name) {
                alert('Please enter a Gamer Tag or Username!');
                if (usernameInput) usernameInput.focus();
                return;
            }

            // Real-time pre-check against taken names
            const check = AuthManager.checkUsernameAvailability(name, pin);
            if (!check.available && !check.isOwner) {
                const errMsg = check.message || `⚠️ The name "${name}" is already taken and cannot be used by another person!`;
                showToast(errMsg, '⚠️');
                alert(errMsg);
                if (usernameInput) usernameInput.focus();
                updateAuthUsernameFeedback();
                return;
            }

            // Check if returning user already has a saved avatar to preserve it
            const registry = AuthManager.getRegistry();
            const existingKey = Object.keys(registry).find(k => k.toLowerCase() === name.toLowerCase());
            const userAvatar = (existingKey && registry[existingKey]?.avatar)
                ? registry[existingKey].avatar
                : (localStorage.getItem('kf_preferred_avatar') || selectedAvatar);

            const res = AuthManager.login(name, pin, userAvatar, { provider: 'local' });
            if (res && res.success === false) {
                showToast(res.error, '⚠️');
                alert(res.error);
                if (usernameInput) usernameInput.focus();
                updateAuthUsernameFeedback();
                return;
            }
            closeNameEditPanel();
            renderAuthModalContent();
            if (authFeedback) {
                authFeedback.className = 'auth-input-feedback hidden';
                authFeedback.textContent = '';
            }
            if (usernameInput) usernameInput.classList.remove('input-error', 'input-success');
        });
    }

    // Switch to Guest
    if (btnGuest) {
        btnGuest.addEventListener('click', () => {
            closeNameEditPanel();
            AuthManager.logout();
            renderAuthModalContent();
        });
    }

    // Log out
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            closeNameEditPanel();
            AuthManager.logout();
            renderAuthModalContent();
        });
    }

}

function renderAuthModalContent() {
    const user = AuthManager.getActiveUser();

    // 1. Current Status Card
    const currentAvatar = document.getElementById('auth-current-avatar');
    const currentUsername = document.getElementById('auth-current-username');
    const currentNotice = document.getElementById('auth-current-notice');
    const previewAvatar = document.getElementById('modal-auth-avatar-preview');
    const btnLogout = document.getElementById('btn-auth-logout');

    if (currentAvatar) {
        if (user.avatar && (user.avatar.startsWith('http://') || user.avatar.startsWith('https://'))) {
            currentAvatar.innerHTML = `<img src="${user.avatar}" alt="Avatar" class="user-avatar-img">`;
        } else {
            currentAvatar.textContent = user.avatar || '👾';
        }
    }

    if (previewAvatar) {
        if (user.avatar && (user.avatar.startsWith('http://') || user.avatar.startsWith('https://'))) {
            previewAvatar.innerHTML = `<img src="${user.avatar}" alt="Avatar" class="user-avatar-img">`;
        } else {
            previewAvatar.textContent = user.avatar || '👾';
        }
    }

    // Sync active state on avatar picker buttons
    const pickerEl = document.getElementById('auth-avatar-picker');
    if (pickerEl) {
        const activeAv = user.avatar || '👾';
        pickerEl.querySelectorAll('.avatar-pick-btn').forEach(b => {
            if (b.getAttribute('data-avatar') === activeAv) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
    }

    if (currentUsername) currentUsername.textContent = user.isLoggedIn ? user.username : 'Guest Player';

    const btnEditUsername = document.getElementById('btn-edit-username');
    if (btnEditUsername) {
        if (user.isLoggedIn) {
            btnEditUsername.classList.remove('hidden');
        } else {
            btnEditUsername.classList.add('hidden');
        }
    }

    if (currentNotice) {
        const provNotice = user.provider && user.provider !== 'local' && user.provider !== 'guest' ? ` (Signed in via ${user.provider})` : '';
        currentNotice.textContent = user.isLoggedIn
            ? `✅ Cloud Saves Active${provNotice} — All game high scores, levels, and coins save to your profile.`
            : '⚡ Temporary Guest Session — Instant play active. All game progress automatically clears when the website is reloaded.';
    }

    if (btnLogout) {
        if (user.isLoggedIn) {
            btnLogout.classList.remove('hidden');
        } else {
            btnLogout.classList.add('hidden');
        }
    }


    // 3. Toggle button & container state based on login status
    const btnToggleSwitch = document.getElementById('btn-toggle-switch-account');
    const loginContainer = document.getElementById('auth-login-container');
    if (btnToggleSwitch && loginContainer) {
        if (user.isLoggedIn) {
            btnToggleSwitch.classList.remove('hidden');
            loginContainer.classList.add('collapsed');
            btnToggleSwitch.innerHTML = '<span>🔄 Switch or Link Another Account</span>';
        } else {
            btnToggleSwitch.classList.add('hidden');
            loginContainer.classList.remove('collapsed');
        }
    }

}

function setupAudienceModal() {
    const btnOpen = document.getElementById('btn-live-insights');
    const btnSideLive = document.getElementById('btn-sidebar-live');
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

        // Render Geo Bars (States & Cities with local times and active player counts)
        const geoContainer = document.getElementById('aud-geo-bars');
        if (geoContainer) {
            const cities = window.audienceEngine.cityStats || [];
            const maxCityPlayers = cities.length ? cities[0].activePlayers : 1;

            geoContainer.innerHTML = cities.map(c => {
                const fillPct = Math.round((c.activePlayers / maxCityPlayers) * 100);
                return `
                    <div class="aud-city-row" title="${c.city}, ${c.state} (${c.country}) — Local Time: ${c.formattedTime}">
                        <div class="aud-city-top">
                            <div class="aud-city-info">
                                <span class="aud-city-flag">${c.flag}</span>
                                <span class="aud-city-name">${c.city}</span>
                                <span class="aud-city-state">${c.state}</span>
                            </div>
                            <div class="aud-city-stats">
                                <span class="aud-city-time">${c.formattedTime}</span>
                                <span class="aud-city-phase-badge ${c.phaseClass}">${c.phase}</span>
                                <strong class="aud-city-count">${c.activePlayers.toLocaleString()}</strong>
                            </div>
                        </div>
                        <div class="aud-bar-track">
                            <div class="aud-bar-fill" style="width: ${fillPct}%; background: ${c.barColor};"></div>
                        </div>
                    </div>
                `;
            }).join('');
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
    window.renderAudienceModal = renderAudienceModal;

    const openAudienceModal = () => {
        renderAudienceModal();
        modal.classList.add('active', 'open');
    };

    const closeAudienceModal = () => {
        modal.classList.remove('active', 'open');
    };

    window.openAudienceModal = openAudienceModal;
    window.closeAudienceModal = closeAudienceModal;

    if (btnOpen) btnOpen.addEventListener('click', openAudienceModal);
    if (btnSideLive) btnSideLive.addEventListener('click', openAudienceModal);
    if (btnClose) btnClose.addEventListener('click', closeAudienceModal);
    if (btnDone) btnDone.addEventListener('click', closeAudienceModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAudienceModal();
    });
}

function setupOAuthHelpModal() {
    const modal = document.getElementById('oauth-help-modal');
    const btnClose = document.getElementById('btn-close-oauth-help');
    const btnDone = document.getElementById('btn-done-oauth-help');
    const btnCopy = document.getElementById('btn-copy-oauth-uri');
    const uriDisplay = document.getElementById('oauth-redirect-uri-display');
    const dashboardLink = document.getElementById('btn-open-supabase-dashboard');
    const projectRefCode = document.getElementById('oauth-project-ref-code');

    const btnFallbackGoogle = document.getElementById('btn-oauth-fallback-google');
    const btnFallbackGuest = document.getElementById('btn-oauth-fallback-guest');
    const btnFallbackTag = document.getElementById('btn-oauth-fallback-tag');

    if (!modal) return;

    const config = (typeof KrazySupabase !== 'undefined' && KrazySupabase.getConfig) ? KrazySupabase.getConfig() : {};
    const url = (config.url || '').trim();
    const match = url.match(/https:\/\/([a-z0-9_-]+)\.supabase\.co/i);
    const projectRef = match ? match[1] : '';
    const callbackUrl = url ? `${url.replace(/\/$/, '')}/auth/v1/callback` : 'https://your-project.supabase.co/auth/v1/callback';

    if (uriDisplay) uriDisplay.textContent = callbackUrl;
    if (projectRefCode) projectRefCode.textContent = projectRef || 'your-project-ref';
    if (dashboardLink) dashboardLink.href = projectRef ? `https://supabase.com/dashboard/project/${projectRef}/auth/providers` : 'https://supabase.com/dashboard';

    function closeModal() {
        modal.classList.remove('active', 'open');
    }

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnDone) btnDone.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (btnCopy) {
        btnCopy.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(callbackUrl);
                btnCopy.textContent = '✅ Copied!';
                showToast('Supabase Redirect URI copied to clipboard!', '📋');
                setTimeout(() => { btnCopy.textContent = '📋 Copy'; }, 2500);
            } catch (e) {
                showToast(callbackUrl, '📋');
            }
        });
    }

    if (btnFallbackGoogle) {
        btnFallbackGoogle.addEventListener('click', () => {
            closeModal();
            const btnGoogle = document.getElementById('btn-auth-google');
            if (btnGoogle) btnGoogle.click();
        });
    }

    if (btnFallbackGuest) {
        btnFallbackGuest.addEventListener('click', () => {
            closeModal();
            const btnGuest = document.getElementById('btn-auth-guest-quick');
            if (btnGuest) btnGuest.click();
        });
    }

    if (btnFallbackTag) {
        btnFallbackTag.addEventListener('click', () => {
            closeModal();
            const usernameInput = document.getElementById('auth-username-input');
            if (usernameInput) {
                usernameInput.focus();
                usernameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    window.showOAuthProviderHelp = function (providerType, customTitle) {
        const titleEl = document.getElementById('oauth-help-title');
        const descEl = document.getElementById('oauth-help-desc');
        const iconEl = document.getElementById('oauth-help-icon');
        const reasonEl = document.getElementById('oauth-help-reason');

        if (providerType === 'apple') {
            if (titleEl) titleEl.textContent = 'Apple Sign-In Setup';
            if (iconEl) iconEl.textContent = '';
            if (descEl) descEl.textContent = 'Apple sign-in requires enabling the Apple provider in your Supabase project dashboard.';
            if (reasonEl) reasonEl.innerHTML = `Your Supabase backend (<code style="background: rgba(0,0,0,0.4); padding: 2px 6px; border-radius: 4px; color: #38bdf8;">${projectRef}</code>) has not turned on the Apple OAuth provider yet. Toggle it ON in your Supabase Auth dashboard.`;
        } else if (providerType === 'google') {
            if (titleEl) titleEl.textContent = 'Google Sign-In Setup';
            if (iconEl) iconEl.textContent = '🌐';
            if (descEl) descEl.textContent = 'Google sign-in requires enabling the Google provider in your Supabase project dashboard.';
            if (reasonEl) reasonEl.innerHTML = `Your Supabase backend (<code style="background: rgba(0,0,0,0.4); padding: 2px 6px; border-radius: 4px; color: #38bdf8;">${projectRef}</code>) has not turned on the Google OAuth provider yet. Toggle it ON in your Supabase Auth dashboard.`;
        } else {
            if (titleEl) titleEl.textContent = customTitle || 'Social Sign-In Setup';
            if (iconEl) iconEl.textContent = '⚠️';
        }

        modal.classList.add('active', 'open');
    };
}

// ==========================================================
// Interactive Short Game Preview Engine on Hover
// ==========================================================
let activePreviewCleanup = null;

function setupBentoCardHoverPreviews() {
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        const gameId = card.getAttribute('data-id');
        const wrap = card.querySelector('.bento-preview-wrap');
        if (!wrap || !gameId) return;

        card.addEventListener('mouseenter', () => {
            if (activePreviewCleanup) {
                activePreviewCleanup();
                activePreviewCleanup = null;
            }
            activePreviewCleanup = launchGamePreview(gameId, wrap);
        });

        card.addEventListener('mouseleave', () => {
            if (activePreviewCleanup) {
                activePreviewCleanup();
                activePreviewCleanup = null;
            }
            wrap.innerHTML = '';
        });
    });
}

const GAME_AUTHENTIC_PREVIEWS = {
    'office-escape': 'thumbnails/previews/office-escape.mp4',
    'dart-board': 'thumbnails/previews/dart-board.webm',
    'tic-tac-toe': 'thumbnails/previews/tic-tac-toe.webm',
    'flappy-man': 'thumbnails/previews/flappy-man.webm',
    'wild-swings': 'thumbnails/previews/wild-swings.webm',
    'gravity-flip': 'thumbnails/previews/gravity-flip.webm',
    'pop-up': 'thumbnails/previews/pop-up.webm',
    'bomb-panic': 'thumbnails/previews/bomb-panic.webm',
    'elevator-doom': 'thumbnails/previews/elevator-doom.webm',
    'fallen-one': 'thumbnails/previews/fallen-one.webm'
};

function launchGamePreview(gameId, wrap) {
    wrap.innerHTML = '';
    let isCleanedUp = false;

    const previewSrc = GAME_AUTHENTIC_PREVIEWS[gameId];
    if (previewSrc) {
        const vid = document.createElement('video');
        vid.src = previewSrc;
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.preload = 'auto';
        vid.style.width = '100%';
        vid.style.height = '100%';
        vid.style.objectFit = 'cover';
        vid.style.borderRadius = '17px';
        vid.style.display = 'block';

        // Graceful fallback to real game iframe if video cannot be loaded
        vid.onerror = () => {
            if (isCleanedUp) return;
            wrap.innerHTML = '';
            const game = GAMES_CATALOG.find(g => g.id === gameId);
            if (game && game.link) {
                const iframe = document.createElement('iframe');
                iframe.src = game.link.replace(/^\//, '') + '?preview=1';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.style.pointerEvents = 'none';
                iframe.style.borderRadius = '17px';
                wrap.appendChild(iframe);
            }
        };

        const playPromise = vid.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => { });
        }

        wrap.appendChild(vid);

        return () => {
            isCleanedUp = true;
            try {
                vid.pause();
                vid.removeAttribute('src');
                vid.load();
            } catch (_) { }
            wrap.innerHTML = '';
        };
    } else {
        // Direct game iframe fallback
        const game = GAMES_CATALOG.find(g => g.id === gameId);
        if (game && game.link) {
            const iframe = document.createElement('iframe');
            iframe.src = game.link.replace(/^\//, '') + '?preview=1';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.pointerEvents = 'none';
            iframe.style.borderRadius = '17px';
            wrap.appendChild(iframe);
            return () => {
                iframe.src = 'about:blank';
                wrap.innerHTML = '';
            };
        }
    }

    return () => {
        wrap.innerHTML = '';
    };
}

// Initial Boot & URL Detection
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    if (window.audienceEngine) window.audienceEngine.syncDOM();
    renderPortal();
    setupCategoryControls();
    setupSearchControls();
    setupHeroMascotVideo();
    setupSuggestModal();
    setupBentoCardHoverPreviews();
    updateBookmarkBadge();
    AuthManager.init();
    setupEcoMode();
    setupAuthModal();
    setupOAuthHelpModal();
    setupAudienceModal();
    setupSupabaseRealtimeListeners();

    // Wire Up Action Bar Buttons
    const btnLike = document.getElementById('btn-game-like');
    if (btnLike) btnLike.addEventListener('click', handleLikeClick);

    const btnDislike = document.getElementById('btn-game-dislike');
    if (btnDislike) btnDislike.addEventListener('click', handleDislikeClick);

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

    const footerHome = document.getElementById('footer-link-home');
    if (footerHome) {
        footerHome.addEventListener('click', (e) => {
            e.preventDefault();
            closeGamePlayer();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    const btnRandom = document.getElementById('btn-nav-random');
    if (btnRandom) btnRandom.addEventListener('click', playRandomGame);

    const btnSideRandom = document.getElementById('btn-sidebar-random');
    if (btnSideRandom) btnSideRandom.addEventListener('click', playRandomGame);

    const btnPromoRandom = document.getElementById('btn-promo-random');
    if (btnPromoRandom) btnPromoRandom.addEventListener('click', playRandomGame);

    const btnNavBookmarks = document.getElementById('btn-nav-bookmarks');
    if (btnNavBookmarks) {
        btnNavBookmarks.addEventListener('click', () => {
            const list = getStoredBookmarks();
            if (list.length === 0) {
                showToast('No bookmarked games yet! Click 🔖 on any game card to save.', '🔖');
            } else {
                activeCategory = 'bookmarks';
                if (document.body.getAttribute('data-view') === 'player') closeGamePlayer();
                renderPortal();
                showToast(`🔖 Displaying ${list.length} saved bookmarks!`, '⭐');
            }
        });
    }

    const btnViewMore = document.getElementById('btn-view-more-purple');
    if (btnViewMore) btnViewMore.addEventListener('click', closeGamePlayer);

    const btnSidebarToggle = document.getElementById('sidebar-toggle') || document.getElementById('btn-sidebar-toggle');
    const sidebarRail = document.getElementById('portal-sidebar') || document.getElementById('sidebar-rail');
    if (btnSidebarToggle && sidebarRail) {
        btnSidebarToggle.addEventListener('click', () => {
            const isExpanded = sidebarRail.classList.toggle('expanded');
            sidebarRail.classList.toggle('sidebar-open', isExpanded);
            btnSidebarToggle.classList.toggle('collapsed', !isExpanded);
            btnSidebarToggle.setAttribute('title', isExpanded ? 'Collapse to Icons' : 'Expand Sidebar');
        });
    }

    // Enable smooth mouse wheel horizontal scrolling across the top navbar
    const topNavbar = document.querySelector('.navbar');
    if (topNavbar) {
        topNavbar.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0 && topNavbar.scrollWidth > topNavbar.clientWidth) {
                topNavbar.scrollLeft += e.deltaY;
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Check URL parameters for direct game launch (e.g. ?game=chess&room=KF-1234 or ?room=KF-1234)
    const urlParams = new URLSearchParams(window.location.search);
    let gameParam = urlParams.get('game') || urlParams.get('play');
    if (!gameParam && urlParams.get('room')) {
        gameParam = 'chess';
    }
    const hashParam = window.location.hash.replace('#', '').replace('play=', '').replace('game=', '');

    const targetGameId = gameParam || hashParam;
    if (targetGameId && GAMES_CATALOG.some(g => g.id === targetGameId)) {
        openGamePlayer(targetGameId);
    } else if (window.location.hash.includes('profile') || urlParams.has('profile')) {
        if (typeof window.openProfileModal === 'function') window.openProfileModal();
    } else if (window.location.hash.includes('live') || urlParams.has('live')) {
        if (typeof window.openAudienceModal === 'function') window.openAudienceModal();
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
            if (exit) exit.call(document).catch(() => { });
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
        } else if (e.data.type === 'RECORD_MULTIPLAYER_MATCH') {
            const matchData = e.data.data || e.data.match || e.data;
            if (window.KrazySupabase && typeof window.KrazySupabase.recordMultiplayerMatch === 'function') {
                window.KrazySupabase.recordMultiplayerMatch({
                    game_id: matchData.game_id || matchData.gameId || activeGameId || 'arcade-game',
                    game_title: matchData.game_title || matchData.gameTitle || (GAMES_CATALOG.find(g => g.id === (matchData.game_id || matchData.gameId || activeGameId))?.title) || 'Multiplayer Game',
                    mode: matchData.mode || 'pvp',
                    player1_name: matchData.player1_name || matchData.player1Name || 'Player 1',
                    player2_name: matchData.player2_name || matchData.player2Name || 'Player 2',
                    winner: matchData.winner || 'Player 1',
                    score_p1: Number(matchData.score_p1 || matchData.scoreP1 || 0),
                    score_p2: Number(matchData.score_p2 || matchData.scoreP2 || 0),
                    room_code: matchData.room_code || matchData.roomCode || null,
                    details: matchData.details || {}
                }).then(res => {
                    console.log('🏆 [Portal] Multiplayer match recorded to database:', res);
                    if (matchData.winner && typeof showToast === 'function') {
                        showToast(`🏆 Match Result Saved: ${matchData.winner} Wins!`, '🏆');
                    }
                }).catch(err => {
                    console.warn('⚠️ [Portal] Match recording error:', err);
                });
            }
        }
    });
});
