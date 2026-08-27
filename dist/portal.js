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
        title: 'Neon Tac Toe: Arena & Bots',
        category: 'pvp',
        tags: ['PvP', 'Multiplayer', 'AI Bot', 'Strategy'],
        desc: 'Cyberpunk Tic Tac Toe with Unbeatable Minimax AI Bots, 2-Player Pass & Play, and 3x3 / 4x4 / 5x5 boards!',
        fullDesc: 'The classic game reimagined in neon cyberpunk aesthetic. Test your wits against the legendary Unbeatable Minimax algorithm or battle local friends across expanded 4x4 and 5x5 board variations.',
        emoji: '❌⭕',
        heroEmoji: '⚡❌⭕',
        status: 'live',
        rating: '5.0',
        plays: '29.7K',
        likesCount: 2420,
        link: '/tic-tac-toe/index.html',
        trending: false,
        isNew: true,
        multiplayer: true,
        themeClass: 'theme-tictactoe',
        actionBadge: '🤖 MINIMAX BOT',
        controls: [
            { key: 'Mouse Click', label: 'Place Symbol on Grid' }
        ]
    }
];

let activeCategory = 'all';
let searchQuery = '';
let currentGame = null;

// Initial Gamer Reviews & Tips Database
const DEFAULT_COMMENTS = [
    { author: 'NeonNinja99', avatar: '🥷', text: 'This game is dangerously addictive! Floor 40 is absolutely intense.' },
    { author: 'ArcadeMaster', avatar: '🕹️', text: 'Pro tip: Time your dash right before the obstacle hits for invulnerability frames!' },
    { author: 'CyberGamerX', avatar: '⚡', text: 'Super smooth frame rate and awesome soundtrack. 10/10!' }
];

// ==========================================================
// 1. CRAZYGAMES-STYLE GAME PLAYER ENGINE
// ==========================================================

function openGamePlayer(gameId) {
    const game = GAMES_CATALOG.find(g => g.id === gameId) || GAMES_CATALOG[0];
    if (!game) return;

    currentGame = game;

    // Switch view state
    document.body.setAttribute('data-view', 'player');
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
                <span class="key-capsule">${ctrl.key}</span>
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

    // Update Comments
    renderComments(game.id);

    // Populate Right Sidebar: "Play next" Cards
    renderPlayNextSidebar(game);

    // Load Game inside iframe with Glowing Animation
    const iframe = document.getElementById('active-game-iframe');
    const loader = document.getElementById('game-loader-overlay');
    const loaderTitle = document.getElementById('game-loader-title');

    if (loader) {
        loader.classList.remove('hidden');
        if (loaderTitle) loaderTitle.textContent = `Loading ${game.title}...`;
    }

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
            setTimeout(() => {
                if (loader) loader.classList.add('hidden');
                iframe.focus();
            }, 300);
        };
    }

    // Synchronize URL hash & query state
    const newUrl = `${window.location.pathname}?game=${game.id}`;
    window.history.pushState({ gameId: game.id }, game.title, newUrl);
}

function closeGamePlayer() {
    document.body.setAttribute('data-view', 'catalog');
    const catalogView = document.getElementById('catalog-view');
    const playerView = document.getElementById('game-player-view');

    if (playerView) playerView.classList.add('hidden');
    if (catalogView) catalogView.classList.remove('hidden');

    const iframe = document.getElementById('active-game-iframe');
    if (iframe) iframe.src = 'about:blank'; // Unload game to save resources

    currentGame = null;
    window.history.pushState({}, 'Krazy Fuse', window.location.pathname);
    renderPortal();
}

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
                    <span class="pn-plays">${rec.plays}</span>
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

    card.innerHTML = `
        <div class="card-thumb-wrap">
            <div class="thumb-artwork ${game.themeClass || 'theme-office'}">
                <div class="thumb-emoji-hero">${game.heroEmoji || game.emoji}</div>
                <div class="thumb-action-burst">${game.actionBadge || '⚡ ACTION'}</div>
                <div class="thumb-overlay-gradient"></div>
            </div>
            <span class="thumb-status-badge ${game.status}">
                ${game.status === 'live' ? '● LIVE' : 'SOON'}
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
                <span class="card-plays">👥 ${game.plays} plays</span>
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

// Initial Boot & URL Detection
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    renderPortal();
    setupCategoryControls();
    setupSearchControls();
    setupSuggestModal();
    updateBookmarkBadge();

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
