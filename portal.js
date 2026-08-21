// Krazy Fuse Arcade Portal Engine — Fast, Playful, Chaotic Arcade Design
const GAMES_CATALOG = [
    {
        id: 'office-escape',
        title: 'Office Escape: Corporate Run',
        category: 'runner',
        tags: ['Runner', 'Satire', 'Action'],
        desc: 'Sprint through meeting rooms, dodge calendar syncs, and leap over laptops before workday sanity hits 0!',
        emoji: '🏃💼',
        heroEmoji: '🏃‍♂️💨',
        status: 'live',
        rating: '4.9',
        plays: '28.4k',
        link: 'office-escape/index.html',
        trending: true,
        isNew: false,
        multiplayer: false,
        themeClass: 'theme-office',
        actionBadge: '⚡ SPRINT & DODGE'
    },
    {
        id: 'dart-board',
        title: 'Dart Master: 301 / 501 Arena',
        category: 'pvp',
        tags: ['PvP', 'Multiplayer', 'AI Bot'],
        desc: 'Realistic London dartboard arcade! Challenge smart AI bots, Pass & Play with friends, or battle online.',
        emoji: '🎯🍺',
        heroEmoji: '🎯🏆',
        status: 'live',
        rating: '5.0',
        plays: '34.2k',
        link: 'dart-board/index.html',
        trending: true,
        isNew: false,
        multiplayer: true,
        themeClass: 'theme-dart',
        actionBadge: '🎯 BULLSEYE 1v1'
    },
    {
        id: 'flappy-man',
        title: 'Flappy Man: Superhero Flight',
        category: 'arcade',
        tags: ['Arcade', 'Flappy', 'Reflex'],
        desc: 'Unlock Superman, Iron Man, Batman & Hanumanji! Dodge neon pipes across 5 escalating biomes.',
        emoji: '🦸‍♂️🚀',
        heroEmoji: '🦸‍♂️⚡',
        status: 'live',
        rating: '4.9',
        plays: '42.1k',
        link: 'flappy-man/index.html',
        trending: true,
        isNew: false,
        multiplayer: false,
        themeClass: 'theme-flappy',
        actionBadge: '🌟 5 HERO SKINS'
    },
    {
        id: 'wild-swings',
        title: 'Wild Swings: Hook & Flight',
        category: 'arcade',
        tags: ['Physics', 'Swinging', 'Reflex'],
        desc: 'Stickman Hook style physics arcade! Web sling as Spider-Man over NYC across 20 acrobatic courses.',
        emoji: '🕸️🐒',
        heroEmoji: '🕷️🕸️',
        status: 'live',
        rating: '5.0',
        plays: '31.8k',
        link: 'wild-swings/index.html',
        trending: true,
        isNew: false,
        multiplayer: false,
        themeClass: 'theme-wild',
        actionBadge: '🕸️ 20 LEVELS'
    },
    {
        id: 'bomb-panic',
        title: 'Bomb Panic: Hot Potato',
        category: 'pvp',
        tags: ['Party', 'PvP', 'Multiplayer', 'Survival'],
        desc: 'One player gets a ticking bomb! PASS → RUN → THROW → SURVIVE before the fuse hits 0!',
        emoji: '💣💥',
        heroEmoji: '💣🔥',
        status: 'live',
        rating: '5.0',
        plays: '48.9k',
        link: 'bomb-panic/index.html',
        trending: true,
        isNew: true,
        multiplayer: true,
        themeClass: 'theme-bomb',
        actionBadge: '💣 PASS OR BOOM'
    },
    {
        id: 'gravity-flip',
        title: 'Gravity Flip: Cavern Runner',
        category: 'reflex',
        tags: ['Reflex', 'Runner', 'Cavern'],
        desc: 'Explore treacherous subterranean caves! Invert gravity between floor and ceiling to dodge stalactites.',
        emoji: '⛏️🪨',
        heroEmoji: '🔄⚡',
        status: 'live',
        rating: '4.9',
        plays: '22.6k',
        link: 'gravity-flip/index.html',
        trending: false,
        isNew: true,
        multiplayer: false,
        themeClass: 'theme-gravity',
        actionBadge: '🔄 FLIP GRAVITY'
    },
    {
        id: 'pop-up',
        title: 'Pop Up: Balloon Blitz',
        category: 'arcade',
        tags: ['Shooter', 'Arcade', 'Reflex'],
        desc: 'Aim cannon blades & pop endless streams of chaotic floating balloons across 20 vibrant levels!',
        emoji: '🎈💥',
        heroEmoji: '🎈🎯',
        status: 'live',
        rating: '4.8',
        plays: '19.5k',
        link: 'popup-game/index.html',
        trending: false,
        isNew: true,
        multiplayer: false,
        themeClass: 'theme-popup',
        actionBadge: '🎈 20 LEVELS'
    },
    {
        id: 'fallen-one',
        title: 'Cyber Clash: PvP Arena',
        category: 'pvp',
        tags: ['Fighting', 'PvP', 'Action'],
        desc: 'Fast-paced 2D competitive martial arts PvP fighting game with combos, specials, parries & 10-Floor Tower!',
        emoji: '⚔️🔥',
        heroEmoji: '🥋💥',
        status: 'live',
        rating: '5.0',
        plays: '26.7k',
        link: 'fallen-one/index.html',
        trending: false,
        isNew: false,
        multiplayer: true,
        themeClass: 'theme-fallen',
        actionBadge: '⚔️ COMBO FIGHTER'
    },
    {
        id: 'tic-tac-toe',
        title: 'Neon Tac Toe: Arena & Bots',
        category: 'pvp',
        tags: ['PvP', 'Multiplayer', 'AI Bot', 'Strategy'],
        desc: 'Cyberpunk Tic Tac Toe with Unbeatable Minimax AI Bots, 2-Player Pass & Play, and 3x3 / 4x4 / 5x5 boards!',
        emoji: '❌⭕',
        heroEmoji: '⚡❌⭕',
        status: 'live',
        rating: '5.0',
        plays: '24.3k',
        link: 'tic-tac-toe/index.html',
        trending: false,
        isNew: true,
        multiplayer: true,
        themeClass: 'theme-tictactoe',
        actionBadge: '🤖 MINIMAX BOT'
    },
    {
        id: 'elevator-doom',
        title: 'Elevator of Doom: Floor 99',
        category: 'action',
        tags: ['Survival', 'Party', 'Action'],
        desc: 'Descend an unstable skyscraper elevator while lasers, falling debris & sabotage break in on every floor.',
        emoji: '🛗💀',
        heroEmoji: '🛗🚨',
        status: 'live',
        rating: '4.9',
        plays: '18.1k',
        link: 'elevator-doom/index.html',
        trending: true,
        isNew: false,
        multiplayer: false,
        themeClass: 'theme-elevator',
        actionBadge: '🚨 FLOOR 99'
    }
];

let activeCategory = 'all';
let searchQuery = '';

// Universal Fullscreen Game Launcher
function launchFullscreenGame(event, url) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const docEl = document.documentElement;
    const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
    if (req) {
        req.call(docEl).then(() => {
            window.location.href = url;
        }).catch(() => {
            window.location.href = url;
        });
    } else {
        window.location.href = url;
    }
}
window.launchFullscreenGame = launchFullscreenGame;

// Create Single CrazyGames-Style Card
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
            <a href="${game.link}" class="card-play-btn" onclick="launchFullscreenGame(event, '${game.link}')">
                <span>▶ PLAY</span>
            </a>
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

    card.addEventListener('click', (e) => {
        if (e.target.closest('.card-play-btn')) return;
        launchFullscreenGame(e, game.link);
    });

    return card;
}

// Render Structured Sections or Filtered Grid
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
        // Show Filtered Results Section & Hide Standard Sections
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
        // Show Standard Structured Homepage
        if (filterSection) filterSection.classList.add('hidden');
        if (secTrending) secTrending.classList.remove('hidden');
        if (secNew) secNew.classList.remove('hidden');
        if (secMultiplayer) secMultiplayer.classList.remove('hidden');
        if (secAll) secAll.classList.remove('hidden');

        // Populate Trending Grid
        if (trendingGrid) {
            trendingGrid.innerHTML = '';
            GAMES_CATALOG.filter(g => g.trending).forEach(game => trendingGrid.appendChild(createGameCard(game)));
        }

        // Populate New Releases Grid
        if (newGrid) {
            newGrid.innerHTML = '';
            GAMES_CATALOG.filter(g => g.isNew).forEach(game => newGrid.appendChild(createGameCard(game)));
        }

        // Populate Multiplayer Grid
        if (multiplayerGrid) {
            multiplayerGrid.innerHTML = '';
            GAMES_CATALOG.filter(g => g.multiplayer).forEach(game => multiplayerGrid.appendChild(createGameCard(game)));
        }

        // Populate Complete Catalog Grid
        if (allGamesGrid) {
            allGamesGrid.innerHTML = '';
            GAMES_CATALOG.forEach(game => allGamesGrid.appendChild(createGameCard(game)));
        }
    }
}

// Category Tabs & Nav Shortcuts Setup
function setupCategoryControls() {
    const pills = document.querySelectorAll('.category-pill');
    const navShortcuts = document.querySelectorAll('.nav-shortcut-btn');

    const updateActiveCategory = (cat) => {
        activeCategory = cat;

        pills.forEach(p => p.classList.toggle('active', p.dataset.category === cat));
        navShortcuts.forEach(n => n.classList.toggle('active', n.dataset.category === cat));

        renderPortal();
    };

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            updateActiveCategory(pill.dataset.category || 'all');
        });
    });

    navShortcuts.forEach(btn => {
        btn.addEventListener('click', () => {
            updateActiveCategory(btn.dataset.category || 'all');
        });
    });
}

// Search Bar Setup
function setupSearchControls() {
    const heroInput = document.getElementById('search-games-input');
    const navInput = document.getElementById('nav-search-input');
    const btnSearchGo = document.getElementById('btn-search-go');

    const onSearchChange = (val) => {
        searchQuery = val.trim();
        if (heroInput && heroInput.value !== val) heroInput.value = val;
        if (navInput && navInput.value !== val) navInput.value = val;
        renderPortal();
    };

    if (heroInput) {
        heroInput.addEventListener('input', (e) => onSearchChange(e.target.value));
    }
    if (navInput) {
        navInput.addEventListener('input', (e) => onSearchChange(e.target.value));
    }
    if (btnSearchGo) {
        btnSearchGo.addEventListener('click', () => {
            if (heroInput) onSearchChange(heroInput.value);
        });
    }
}

// Game Pitch / Suggestion Storage & Modal
function getStoredSuggestions() {
    try {
        const raw = localStorage.getItem('krazy_game_suggestions');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveSuggestion(text) {
    const list = getStoredSuggestions();
    const newEntry = {
        id: Date.now(),
        text: text.trim(),
        date: new Date().toLocaleString()
    };
    list.unshift(newEntry);
    localStorage.setItem('krazy_game_suggestions', JSON.stringify(list));
    updateSavedCount();
}

function updateSavedCount() {
    const countEl = document.getElementById('saved-ideas-count');
    if (countEl) {
        countEl.textContent = getStoredSuggestions().length;
    }
}

function renderSavedList() {
    const listContainer = document.getElementById('stored-ideas-list');
    if (!listContainer) return;
    const items = getStoredSuggestions();

    if (items.length === 0) {
        listContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center;">No stored pitches yet. Submit your first krazy game concept!</p>`;
        return;
    }

    listContainer.innerHTML = items.map((item, idx) => `
        <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong style="color: var(--color-primary);">#${items.length - idx}</strong>
                <span style="color: var(--text-main); margin-left: 6px;">${item.text}</span>
            </div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${item.date}</span>
        </div>
    `).join('');
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

    const openModal = () => {
        if (modal) modal.classList.add('active');
        updateSavedCount();
    };
    const closeModal = () => {
        if (modal) modal.classList.remove('active');
        if (storedList) storedList.style.display = 'none';
        if (input) input.value = '';
    };

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnOpen2) btnOpen2.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    if (btnSubmit && input) {
        btnSubmit.addEventListener('click', () => {
            const val = input.value.trim();
            if (val) {
                saveSuggestion(val);
                alert('🚀 Thanks! Your krazy game concept has been submitted to the Krazy Fuse dev queue!');
                closeModal();
            } else {
                alert('Please type in a game idea first!');
            }
        });
    }

    const toggleSaved = () => {
        if (!storedList) return;
        if (storedList.style.display === 'none' || !storedList.style.display) {
            renderSavedList();
            storedList.style.display = 'block';
        } else {
            storedList.style.display = 'none';
        }
    };

    if (btnToggleSaved) btnToggleSaved.addEventListener('click', toggleSaved);
    if (btnViewStored) {
        btnViewStored.addEventListener('click', () => {
            openModal();
            if (storedList) {
                renderSavedList();
                storedList.style.display = 'block';
            }
        });
    }

    updateSavedCount();
}

// Theme Toggle (Day / Night)
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
        btn.innerHTML = theme === 'day' 
            ? '<span>🌙 Night</span>' 
            : '<span>☀️ Day</span>';
    }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    renderPortal();
    setupCategoryControls();
    setupSearchControls();
    setupSuggestModal();
});
