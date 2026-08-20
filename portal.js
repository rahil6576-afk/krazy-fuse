// Krazio Games Portal Engine — Whole Box 3D Revolving Carousel & Catalog Engine
const GAMES_CATALOG = [
    {
        id: 'office-escape',
        title: 'Office Escape: Corporate Run',
        category: 'runner',
        tags: ['Runner', 'Satire', 'Action'],
        desc: 'Sprint through meeting rooms, dodge calendar syncs, and leap over laptops before your workday sanity hits 0!',
        emoji: '🏃💼',
        status: 'live',
        rating: '4.9',
        plays: '14.2k',
        link: 'office-escape/index.html',
        featured: true
    },
    {
        id: 'elevator-doom',
        title: 'Elevator of Doom: Floor 99',
        category: 'action',
        tags: ['Survival', 'Party', 'Action'],
        desc: 'Descend an unstable skyscraper elevator while unpredictable chaos, lasers, and sabotage break in on every floor.',
        emoji: '🛗💀',
        status: 'live',
        rating: '4.9',
        plays: '9.8k',
        link: 'elevator-doom/index.html',
        featured: true
    },
    {
        id: 'pop-up',
        title: 'Pop Up: Balloon Blitz',
        category: 'arcade',
        tags: ['Shooter', 'Arcade', 'Reflex'],
        desc: 'Aim your cannon, shoot slicing blades, and pop endless streams of chaotic floating balloons across dynamic themes!',
        emoji: '🎈💥',
        status: 'live',
        rating: '4.8',
        plays: '11.5k',
        link: 'popup-game/index.html',
        featured: false
    },
    {
        id: 'fallen-one',
        title: 'Fallen One: PvP Arena',
        category: 'pvp',
        tags: ['Fighting', 'PvP', 'Action'],
        desc: 'Fast-paced 2D competitive martial arts PvP fighting game with combos, focus specials, parries, training dojo, and boss battles!',
        emoji: '⚔️🔥',
        status: 'live',
        rating: '5.0',
        plays: '18.7k',
        link: 'fallen-one/index.html',
        featured: false
    },
    {
        id: 'gravity-flip',
        title: 'Gravity Flip: Cavern Runner',
        category: 'reflex',
        tags: ['Cavern', 'Reflex', 'Runner'],
        desc: 'Explore treacherous subterranean caves! Invert gravity between bedrock and stone ceiling to dodge jagged stalactites & falling boulders.',
        emoji: '⛏️🪨',
        status: 'live',
        rating: '4.9',
        plays: '16.4k',
        link: 'gravity-flip/index.html',
        featured: false
    },
    {
        id: 'wild-swings',
        title: 'Wild Swings: Hook & Flight',
        category: 'arcade',
        tags: ['Physics', 'Swinging', 'Reflex'],
        desc: 'Stickman Hook style physics arcade! Web sling as Spider-Man over NYC, swing jungle vines as Monkey, and grapple as Ninja across 20 escalating levels.',
        emoji: '🕸️🐒',
        status: 'live',
        rating: '5.0',
        plays: '22.4k',
        link: 'wild-swings/index.html',
        featured: false
    },
    {
        id: 'dart-board',
        title: 'Dart Master: 301 / 501 Arena',
        category: 'pvp',
        tags: ['Darts', 'PvP', 'Multiplayer', 'AI Bot'],
        desc: 'Realistic London dartboard arcade! Challenge smart AI bots, Pass & Play with friends, or battle in live synced online multiplayer.',
        emoji: '🎯🍺',
        status: 'live',
        rating: '5.0',
        plays: '28.1k',
        link: 'dart-board/index.html',
        featured: false
    },
    {
        id: 'flappy-man',
        title: 'Flappy Man: Sky Leap',
        category: 'arcade',
        tags: ['Arcade', 'Flappy', 'Reflex', 'Classic'],
        desc: 'Classic Flappy Bird physics with a flying Superman! Tap to flap, dodge green sewer pipes, and collect bronze, silver, and gold medals.',
        emoji: '🦸‍♂️🚀',
        status: 'live',
        rating: '4.9',
        plays: '31.5k',
        link: 'flappy-man/index.html',
        featured: false
    },
    {
        id: 'bomb-panic',
        title: 'Bomb Panic: Hot Potato Arena',
        category: 'pvp',
        tags: ['Bomb', 'Party', 'PvP', 'Multiplayer', 'Survival'],
        desc: 'One player gets a ticking bomb! PASS → RUN → THROW → SURVIVE before the fuse hits 0 and the arena collapses inward!',
        emoji: '💣💥',
        status: 'live',
        rating: '5.0',
        plays: '38.9k',
        link: 'bomb-panic/index.html',
        featured: true
    },
    {
        id: 'tic-tac-toe',
        title: 'Neon Tac Toe: Arena & Bots',
        category: 'pvp',
        tags: ['TicTacToe', 'PvP', 'Multiplayer', 'AI Bot', 'Strategy'],
        desc: 'Cyberpunk Tic Tac Toe with Smart/Unbeatable Minimax AI Bots, Pass & Play local 2-Player mode, and 3x3 / 4x4 / 5x5 arena boards!',
        emoji: '❌⭕',
        status: 'live',
        rating: '5.0',
        plays: '19.4k',
        link: 'tic-tac-toe/index.html',
        featured: true
    }
];

let activeCategory = 'all';
let searchQuery = '';

function renderGames() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = GAMES_CATALOG.filter(game => {
        const matchesCategory = activeCategory === 'all' || 
            game.category === activeCategory || 
            (activeCategory === 'runner' && game.tags.includes('Runner')) ||
            (activeCategory === 'comedy' && game.tags.includes('Satire'));
            
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
                <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
                <h3>No krazy games found</h3>
                <p>Try searching for a different keyword or category!</p>
            </div>
        `;
        return;
    }

    filtered.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <div class="game-card-thumb">
                <div class="game-card-emoji-preview">${game.emoji}</div>
                <span class="game-status-badge ${game.status}">
                    ${game.status === 'live' ? '● PLAY NOW' : 'COMING SOON'}
                </span>
                <span class="game-rating-tag">⭐ ${game.rating}</span>
            </div>
            <div class="game-card-body">
                <h3 class="game-card-title">${game.title}</h3>
                <p class="game-card-desc">${game.desc}</p>
                <div class="game-card-tags">
                    ${game.tags.map(t => `<span class="game-tag">#${t}</span>`).join('')}
                </div>
                <div class="game-card-actions">
                    ${game.status === 'live' 
                        ? `<a href="${game.link}" class="btn-card-play"><span>⚡ PLAY GAME</span></a>`
                        : `<button class="btn-card-disabled" disabled>In Development ⏳</button>`
                    }
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Category Tabs
function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-pill');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeCategory = tab.dataset.category || 'all';
            renderGames();
        });
    });
}

// Live Search
function setupSearch() {
    const input = document.getElementById('search-games-input');
    if (input) {
        input.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderGames();
        });
    }
}

// Game Suggestion Storage & Management
function getStoredSuggestions() {
    try {
        const raw = localStorage.getItem('krazio_game_suggestions');
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
    localStorage.setItem('krazio_game_suggestions', JSON.stringify(list));
    updateSavedCount();
}

function updateSavedCount() {
    const countEl = document.getElementById('saved-ideas-count');
    if (countEl) {
        const count = getStoredSuggestions().length;
        countEl.textContent = count;
    }
}

function renderSavedList() {
    const listContainer = document.getElementById('stored-ideas-list');
    if (!listContainer) return;
    const items = getStoredSuggestions();

    if (items.length === 0) {
        listContainer.innerHTML = `<p style="color: var(--text-secondary); text-align: center;">No stored pitches yet. Submit your first krazy game concept!</p>`;
        return;
    }

    listContainer.innerHTML = items.map((item, idx) => `
        <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding: 8px 0; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <div>
                <strong style="color: #fbc531;">#${items.length - idx} (${item.date}):</strong>
                <p style="margin-top: 2px; color: #fff;">${item.text}</p>
            </div>
        </div>
    `).join('');
}

// Suggestion Modal
function setupSuggestModal() {
    const openBtn = document.getElementById('btn-open-suggest');
    const openBtn2 = document.getElementById('btn-open-suggest-2');
    const viewStoredBtn = document.getElementById('btn-view-stored');
    const closeBtn = document.getElementById('btn-close-modal');
    const submitBtn = document.getElementById('btn-submit-idea');
    const toggleSavedBtn = document.getElementById('btn-toggle-saved');
    const modal = document.getElementById('suggest-modal');
    const input = document.getElementById('idea-input');
    const listContainer = document.getElementById('stored-ideas-list');

    updateSavedCount();

    const openModal = () => {
        modal.classList.add('active');
        updateSavedCount();
    };

    if (openBtn && modal) openBtn.addEventListener('click', openModal);
    if (openBtn2 && modal) openBtn2.addEventListener('click', openModal);

    if (viewStoredBtn && modal) {
        viewStoredBtn.addEventListener('click', () => {
            openModal();
            if (listContainer) {
                renderSavedList();
                listContainer.style.display = 'block';
            }
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            if (listContainer) listContainer.style.display = 'none';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                if (listContainer) listContainer.style.display = 'none';
            }
        });
    }

    if (toggleSavedBtn && listContainer) {
        toggleSavedBtn.addEventListener('click', () => {
            if (listContainer.style.display === 'none' || listContainer.style.display === '') {
                renderSavedList();
                listContainer.style.display = 'block';
                toggleSavedBtn.textContent = '✏️ Hide Saved';
            } else {
                listContainer.style.display = 'none';
                toggleSavedBtn.innerHTML = `📋 View Saved (<span id="saved-ideas-count">${getStoredSuggestions().length}</span>)`;
            }
        });
    }

    if (submitBtn && input) {
        submitBtn.addEventListener('click', () => {
            if (input.value.trim().length > 3) {
                saveSuggestion(input.value);
                alert('🚀 Thanks! Your krazy game idea has been saved to local storage (krazio_game_suggestions)!');
                input.value = '';
                modal.classList.remove('active');
                if (listContainer) listContainer.style.display = 'none';
            } else {
                alert('Please enter a brief description of your krazy game idea!');
            }
        });
    }
}

// ----------------------------------------------------
// WHOLE BOX 3D CIRCULAR REVOLVING CAROUSEL ENGINE
// ----------------------------------------------------
let revolvingStep = 0;
let heroProgressTimer = null;
const HERO_SLIDE_DURATION = 3500; // 3.5s auto-revolving interval
let isHeroPaused = false;
const REVOLVING_RADIUS = 620; // 3D Cylindrical orbit radius in pixels

const HERO_SLIDES_META = {
    'office-escape': {
        chapter: 'CHAPTER 01',
        tagline: 'Clock Out Before 5:00 PM',
        badge: '⚡ 60FPS PURE CANVAS',
        statVal: '5 Avatars'
    },
    'elevator-doom': {
        chapter: 'CHAPTER 02',
        tagline: 'Survive 99 Floors of Pure Chaos',
        badge: '⚡ ROGUELIKE EVENT ENGINE',
        statVal: '99 Floors'
    },
    'pop-up': {
        chapter: 'CHAPTER 03',
        tagline: 'Aim, Slice & Pop Every Balloon',
        badge: '⚡ 60FPS BLADE PHYSICS',
        statVal: 'Infinite Waves'
    },
    'fallen-one': {
        chapter: 'CHAPTER 04',
        tagline: 'Master Martial Arts Combos & PvP',
        badge: '⚡ HITBOX COMBAT ENGINE',
        statVal: 'Local 2P & AI'
    },
    'gravity-flip': {
        chapter: 'CHAPTER 05',
        tagline: 'Invert Gravity Across Caverns',
        badge: '⚡ SUBTERRANEAN RUNNER',
        statVal: '5 Cave Biomes'
    },
    'wild-swings': {
        chapter: 'CHAPTER 06',
        tagline: 'Stickman Hook Physics Swings',
        badge: '⚡ SPIDER & MONKEY MODES',
        statVal: '20 Courses'
    },
    'dart-board': {
        chapter: 'CHAPTER 07',
        tagline: 'London 501 / 301 Championship Darts',
        badge: '⚡ 3D FLIGHT PHYSICS',
        statVal: 'Bot & 2-Player'
    },
    'flappy-man': {
        chapter: 'CHAPTER 08',
        tagline: 'Fly as Superman Through Green Pipes',
        badge: '⚡ AUTHENTIC FLAPPY DYNAMICS',
        statVal: 'Medal Unlocks'
    },
    'bomb-panic': {
        chapter: 'CHAPTER 09',
        tagline: 'PASS → RUN → THROW → SURVIVE',
        badge: '⚡ SHRINKING SUDDEN DEATH',
        statVal: '8-Player Chaos'
    },
    'tic-tac-toe': {
        chapter: 'CHAPTER 10',
        tagline: 'Classic & Expanded Neon Tac Toe',
        badge: '⚡ UNBEATABLE MINIMAX AI',
        statVal: 'Bot & 2-Player'
    }
};

function initHeroCarousel() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection || GAMES_CATALOG.length === 0) return;

    const total = GAMES_CATALOG.length;
    const angleStep = 360 / total;

    // Render 3D Viewport Structure
    heroSection.innerHTML = `
        <div class="hero-carousel-viewport" id="hero-carousel-viewport">
            <!-- 3D Revolving Ring Track Holding ALL Whole Box Slides -->
            <div class="hero-3d-carousel-ring" id="hero-3d-carousel-ring">
                ${GAMES_CATALOG.map((game, idx) => {
                    const meta = HERO_SLIDES_META[game.id] || {
                        chapter: `CHAPTER 0${idx + 1}`,
                        tagline: game.title,
                        badge: '⚡ 60FPS ARCADE',
                        statVal: 'Instant Play'
                    };
                    return `
                        <div class="hero-slide-box" id="hero-slide-box-${idx}" data-index="${idx}" title="${game.title}">
                            <div class="slide-box-header">
                                <span class="slide-chapter-badge">${meta.chapter}</span>
                                <span class="slide-rating-badge">⭐ ${game.rating} • ${game.plays} Plays</span>
                            </div>

                            <div class="slide-hero-icon-container">
                                ${game.emoji}
                            </div>

                            <div>
                                <h2 class="slide-title">${game.title}</h2>
                                <p class="slide-desc">${game.desc}</p>
                            </div>

                            <div class="slide-actions-row">
                                <a href="${game.link}" class="btn-slide-play">
                                    <span>⚡ PLAY NOW — FREE</span>
                                </a>
                                <span class="slide-tag-pill">${meta.badge}</span>
                                <span class="slide-tag-pill">🔥 ${meta.statVal}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Floating Nav Arrows -->
            <button class="carousel-nav-btn carousel-nav-prev" id="btn-carousel-prev" title="Previous Game">‹</button>
            <button class="carousel-nav-btn carousel-nav-next" id="btn-carousel-next" title="Next Game">›</button>
        </div>

        <!-- Bottom Dot Indicators -->
        <div class="carousel-dots-row" id="carousel-dots-row">
            ${GAMES_CATALOG.map((_, idx) => `<div class="carousel-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>`).join('')}
        </div>
    `;

    const viewport = document.getElementById('hero-carousel-viewport');
    const ring = document.getElementById('hero-3d-carousel-ring');
    const btnPrev = document.getElementById('btn-carousel-prev');
    const btnNext = document.getElementById('btn-carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');

    // Click on individual boxes to rotate them to center
    GAMES_CATALOG.forEach((_, idx) => {
        const box = document.getElementById(`hero-slide-box-${idx}`);
        if (box) {
            box.addEventListener('click', (e) => {
                // If clicked button, allow link navigation
                if (e.target.closest('a')) return;
                const currentIdx = ((revolvingStep % total) + total) % total;
                let diff = idx - currentIdx;
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;
                if (diff !== 0) {
                    goToRevolvingStep(revolvingStep + diff);
                    resetHeroAutoSlide();
                }
            });
        }
    });

    // Navigation buttons
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            goToRevolvingStep(revolvingStep - 1);
            resetHeroAutoSlide();
        });
    }
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            goToRevolvingStep(revolvingStep + 1);
            resetHeroAutoSlide();
        });
    }

    // Dot indicators
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
            const currentIdx = ((revolvingStep % total) + total) % total;
            let diff = targetIdx - currentIdx;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;
            goToRevolvingStep(revolvingStep + diff);
            resetHeroAutoSlide();
        });
    });

    // Hover Pause
    if (viewport) {
        viewport.addEventListener('mouseenter', () => { isHeroPaused = true; });
        viewport.addEventListener('mouseleave', () => { isHeroPaused = false; });

        // Touch Swipe
        let touchStartX = 0;
        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            const diffX = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diffX) > 40) {
                if (diffX < 0) goToRevolvingStep(revolvingStep + 1);
                else goToRevolvingStep(revolvingStep - 1);
                resetHeroAutoSlide();
            }
        }, { passive: true });
    }

    goToRevolvingStep(0);
    startHeroAutoSlide();
}

function goToRevolvingStep(step) {
    const total = GAMES_CATALOG.length;
    if (total === 0) return;

    revolvingStep = step;
    const activeIndex = ((step % total) + total) % total;

    GAMES_CATALOG.forEach((_, idx) => {
        const box = document.getElementById(`hero-slide-box-${idx}`);
        if (!box) return;

        // Calculate shortest relative position from activeIndex (-4 to +4)
        let relIdx = idx - activeIndex;
        if (relIdx > total / 2) relIdx -= total;
        if (relIdx < -total / 2) relIdx += total;

        if (relIdx === 0) {
            // Front & Center Spotlight
            box.style.transform = `translateX(0px) translateZ(0px) scale(1) rotateY(0deg)`;
            box.style.opacity = '1';
            box.style.zIndex = '10';
            box.style.visibility = 'visible';
            box.style.pointerEvents = 'auto';
            box.className = 'hero-slide-box active-front';
        } else if (relIdx === 1) {
            // Immediate Right Side Card
            box.style.transform = `translateX(480px) translateZ(-160px) scale(0.82) rotateY(-22deg)`;
            box.style.opacity = '0.7';
            box.style.zIndex = '5';
            box.style.visibility = 'visible';
            box.style.pointerEvents = 'auto';
            box.className = 'hero-slide-box inactive-side';
        } else if (relIdx === -1) {
            // Immediate Left Side Card
            box.style.transform = `translateX(-480px) translateZ(-160px) scale(0.82) rotateY(22deg)`;
            box.style.opacity = '0.7';
            box.style.zIndex = '5';
            box.style.visibility = 'visible';
            box.style.pointerEvents = 'auto';
            box.className = 'hero-slide-box inactive-side';
        } else {
            // Background Cards (Hidden to prevent any text bleeding)
            const dir = relIdx > 0 ? 1 : -1;
            box.style.transform = `translateX(${dir * 800}px) translateZ(-350px) scale(0.6)`;
            box.style.opacity = '0';
            box.style.zIndex = '1';
            box.style.visibility = 'hidden';
            box.style.pointerEvents = 'none';
            box.className = 'hero-slide-box inactive-hidden';
        }
    });

    // Update Dots
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
    });
}

function startHeroAutoSlide() {
    if (heroProgressTimer) clearInterval(heroProgressTimer);
    heroProgressTimer = setInterval(() => {
        if (!isHeroPaused) {
            goToRevolvingStep(revolvingStep + 1);
        }
    }, HERO_SLIDE_DURATION);
}

function resetHeroAutoSlide() {
    startHeroAutoSlide();
}

// ----------------------------------------------------
// Theme Toggle Engine (Day / Night Mode)
// ----------------------------------------------------
function setupThemeToggle() {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;

    const savedTheme = localStorage.getItem('krazio_theme') || 'night';
    applyTheme(savedTheme);

    btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'night';
        const newTheme = currentTheme === 'night' ? 'day' : 'night';
        applyTheme(newTheme);
        localStorage.setItem('krazio_theme', newTheme);
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
    renderGames();
    setupCategoryTabs();
    setupSearch();
    setupSuggestModal();
    initHeroCarousel();
});
