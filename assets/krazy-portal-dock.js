/**
 * KRAZY FUSE ARCADE UNIVERSAL PORTAL DOCK SYSTEM
 * Provides the CrazyGames / Poki ESC minimization & paused portal experience across all games.
 */
(function() {
    'use strict';

    const ALL_ARCADE_GAMES = [
        {
            id: 'office-escape',
            title: 'Office Escape: Corporate Run',
            category: 'Runner • Satire',
            rating: '4.9',
            plays: '28.4k',
            emoji: '🏃💼',
            badge: '⚡ SPRINT & DODGE',
            link: '../office-escape/index.html'
        },
        {
            id: 'dart-board',
            title: 'Dart Master: 301 / 501 Arena',
            category: 'PvP • 2-Player',
            rating: '5.0',
            plays: '34.2k',
            emoji: '🎯🍺',
            badge: '🎯 1v1 BULLSEYE',
            link: '../dart-board/index.html'
        },
        {
            id: 'flappy-man',
            title: 'Flappy Man: Superhero Flight',
            category: 'Arcade • Superhero',
            rating: '4.9',
            plays: '42.1k',
            emoji: '🦸‍♂️🚀',
            badge: '🌟 5 HERO SKINS',
            link: '../flappy-man/index.html'
        },
        {
            id: 'wild-swings',
            title: 'Wild Swings: Hook & Flight',
            category: 'Action • Physics',
            rating: '5.0',
            plays: '31.8k',
            emoji: '🕸️🐒',
            badge: '🕸️ 20 LEVELS',
            link: '../wild-swings/index.html'
        },
        {
            id: 'bomb-panic',
            title: 'Bomb Panic: Hot Potato',
            category: 'Party • Multiplayer',
            rating: '5.0',
            plays: '48.9k',
            emoji: '💣💥',
            badge: '💣 PASS OR BOOM',
            link: '../bomb-panic/index.html'
        },
        {
            id: 'gravity-flip',
            title: 'Gravity Flip: Cavern Runner',
            category: 'Reflex • Runner',
            rating: '4.8',
            plays: '22.6k',
            emoji: '⛏️🔄',
            badge: '⚡ REFLEX RUN',
            link: '../gravity-flip/index.html'
        }
    ];

    window.KrazyPortalDock = {
        options: null,
        targetEl: null,
        isPaused: false,

        init: function(opts) {
            this.options = Object.assign({
                gameId: 'game',
                title: 'Arcade Game',
                category: 'Arcade • 60FPS',
                rating: '4.9',
                votes: '50k',
                tags: ['Arcade', 'Fast Paced', '60 FPS'],
                icon: '🕹️',
                targetSelector: '#game-container',
                onPause: null,
                onResume: null,
                onRestart: null,
                onHome: function() { window.location.href = '../index.html'; }
            }, opts);

            this.targetEl = document.querySelector(this.options.targetSelector);
            if (!this.targetEl) {
                console.warn('KrazyPortalDock: Target element not found for selector', this.options.targetSelector);
                return;
            }

            this.buildDOM();
            this.bindEvents();
        },

        getCoins: function() {
            try {
                const c = localStorage.getItem('coins') || localStorage.getItem('krazy_coins') || '70';
                return parseInt(c, 10) || 70;
            } catch(e) {
                return 70;
            }
        },

        buildDOM: function() {
            // Ensure stylesheet is loaded
            if (!document.querySelector('link[href*="krazy-portal-dock.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '../assets/krazy-portal-dock.css';
                document.head.appendChild(link);
            }

            // Create Master Dock Wrapper if not already present
            let dockWrapper = document.getElementById('krazy-portal-dock-wrapper');
            if (!dockWrapper) {
                dockWrapper = document.createElement('div');
                dockWrapper.id = 'krazy-portal-dock-wrapper';

                const otherGames = ALL_ARCADE_GAMES.filter(g => g.id !== this.options.gameId);

                dockWrapper.innerHTML = `
                    <!-- Top Navigation Bar -->
                    <header id="krazy-portal-topbar" class="krazy-topbar">
                        <div class="krazy-nav-left">
                            <a class="krazy-brand" href="../index.html" title="Krazy Fuse Arcade Portal">
                                <span class="krazy-brand-icon">⚡</span>
                                <span class="krazy-brand-text">
                                    <b>KRAZY FUSE</b>
                                    <small>ARCADE PORTAL</small>
                                </span>
                            </a>
                            <div class="krazy-search-box">
                                <span class="search-icon">🔍</span>
                                <input type="text" placeholder="Search 250+ free arcade games..." readonly onclick="window.location.href='../index.html'">
                            </div>
                        </div>

                        <div class="krazy-nav-pills">
                            <a href="../index.html" class="krazy-pill active">🔥 HOT</a>
                            <a href="../dart-board/index.html" class="krazy-pill">🎯 2-PLAYER</a>
                            <a href="../flappy-man/index.html" class="krazy-pill">🦸 SUPERHERO</a>
                            <a href="../wild-swings/index.html" class="krazy-pill">🕸️ ACTION</a>
                            <a href="../bomb-panic/index.html" class="krazy-pill">💣 PARTY</a>
                        </div>

                        <div class="krazy-nav-right">
                            <div class="krazy-bank-badge" id="krazy-top-bank">🪙 ${this.getCoins()} P</div>
                            <button id="krazy-btn-top-resume" class="krazy-resume-btn" type="button">
                                <span>▶️ RESUME (ESC)</span>
                            </button>
                        </div>
                    </header>

                    <!-- Paused Portal Layout Body -->
                    <div class="krazy-portal-body">
                        <!-- Left Sidebar Navigation -->
                        <aside id="krazy-portal-sidebar" class="krazy-sidebar">
                            <a href="../index.html" class="krazy-side-btn active" title="Home"><span>🏠</span><small>Home</small></a>
                            <a href="../index.html" class="krazy-side-btn" title="Trending"><span>🔥</span><small>Hot</small></a>
                            <a href="../dart-board/index.html" class="krazy-side-btn" title="2 Player"><span>👥</span><small>2-Player</small></a>
                            <a href="../flappy-man/index.html" class="krazy-side-btn" title="Arcade"><span>🕹️</span><small>Arcade</small></a>
                            <a href="../wild-swings/index.html" class="krazy-side-btn" title="Action"><span>⚡</span><small>Action</small></a>
                            <a href="../bomb-panic/index.html" class="krazy-side-btn" title="Party"><span>💣</span><small>Party</small></a>
                            <a href="../gravity-flip/index.html" class="krazy-side-btn" title="Reflex"><span>🔄</span><small>Reflex</small></a>
                        </aside>

                        <!-- Center Column -->
                        <main class="krazy-portal-center">
                            <!-- Dock Placeholder for Game Stage -->
                            <div id="krazy-dock-placeholder" style="width: 100%; display: flex; justify-content: center;"></div>

                            <!-- Under-Game Meta Action Bar -->
                            <div id="krazy-portal-meta-bar" class="krazy-meta-bar">
                                <div class="krazy-meta-info">
                                    <div class="krazy-avatar-icon">${this.options.icon}</div>
                                    <div>
                                        <h3>${this.options.title}</h3>
                                        <div class="krazy-meta-tags">
                                            ${this.options.tags.map(t => `<span class="krazy-tag-badge">${t}</span>`).join('')}
                                            <span class="krazy-rating">⭐ ${this.options.rating} (${this.options.votes})</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="krazy-meta-actions">
                                    <button class="krazy-meta-btn" id="krazy-meta-like" type="button">
                                        👍 <span>${this.options.votes}</span>
                                    </button>
                                    <button class="krazy-meta-btn" id="krazy-meta-fav" type="button">
                                        ⭐ Favorite
                                    </button>
                                    <button class="krazy-meta-btn" id="krazy-meta-expand" type="button">
                                        ⛶ Expand (ESC)
                                    </button>
                                    <button class="krazy-meta-btn" id="krazy-meta-share" type="button">
                                        🔗 Share
                                    </button>
                                </div>
                            </div>
                        </main>

                        <!-- Right Column: Recommended Games -->
                        <aside id="krazy-portal-rec-col" class="krazy-rec-col">
                            <div class="krazy-rec-header">
                                <span>🔥 RECOMMENDED GAMES</span>
                                <a href="../index.html">ALL <span>→</span></a>
                            </div>
                            <div class="krazy-rec-grid">
                                ${otherGames.map(g => `
                                    <a href="${g.link}" class="krazy-rec-card">
                                        <div class="krazy-rec-badge">${g.badge}</div>
                                        <div class="krazy-rec-preview">${g.emoji}</div>
                                        <div class="krazy-rec-info">
                                            <b>${g.title.split(':')[0]}</b>
                                            <small>${g.category}</small>
                                        </div>
                                    </a>
                                `).join('')}
                            </div>
                        </aside>
                    </div>
                `;

                document.body.appendChild(dockWrapper);
            }

            // Create Canvas Pause Overlay
            let pauseOverlay = this.targetEl.querySelector('.krazy-canvas-pause-overlay');
            if (!pauseOverlay) {
                pauseOverlay = document.createElement('div');
                pauseOverlay.className = 'krazy-canvas-pause-overlay';
                pauseOverlay.style.display = 'none';
                pauseOverlay.innerHTML = `
                    <div class="krazy-pause-card">
                        <div class="krazy-pause-badge">⏸️ GAME PAUSED</div>
                        <h2>${this.options.title.split(':')[0]}</h2>
                        <p>Game is paused. Press ESC, click resume or click the canvas to continue playing!</p>
                        <div class="krazy-pause-buttons">
                            <button class="krazy-btn-primary" id="krazy-btn-overlay-resume" type="button">
                                <span>▶️ RESUME GAME (ESC)</span>
                            </button>
                            <button class="krazy-btn-secondary" id="krazy-btn-overlay-restart" type="button">
                                <span>🔄 RESTART RUN</span>
                            </button>
                            <button class="krazy-btn-secondary" id="krazy-btn-overlay-home" type="button">
                                <span>🏠 RETURN HOME</span>
                            </button>
                        </div>
                    </div>
                `;
                this.targetEl.appendChild(pauseOverlay);
            }
        },

        bindEvents: function() {
            const self = this;

            // Global ESC / P Key Listener
            window.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                    e.preventDefault();
                    if (self.isPaused) {
                        self.resume();
                    } else {
                        self.pause();
                    }
                }
            });

            // Top Resume Button
            const btnTopResume = document.getElementById('krazy-btn-top-resume');
            if (btnTopResume) btnTopResume.onclick = () => self.resume();

            // Meta Bar Buttons
            const btnExpand = document.getElementById('krazy-meta-expand');
            if (btnExpand) btnExpand.onclick = () => self.resume();

            const btnLike = document.getElementById('krazy-meta-like');
            if (btnLike) {
                btnLike.onclick = function() {
                    this.classList.toggle('active');
                };
            }

            const btnFav = document.getElementById('krazy-meta-fav');
            if (btnFav) {
                btnFav.onclick = function() {
                    this.classList.toggle('active');
                };
            }

            const btnShare = document.getElementById('krazy-meta-share');
            if (btnShare) {
                btnShare.onclick = function() {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Game link copied to clipboard!');
                    }
                };
            }

            // Pause Overlay Buttons
            const btnOverlayResume = document.getElementById('krazy-btn-overlay-resume');
            if (btnOverlayResume) btnOverlayResume.onclick = () => self.resume();

            const btnOverlayRestart = document.getElementById('krazy-btn-overlay-restart');
            if (btnOverlayRestart) {
                btnOverlayRestart.onclick = () => {
                    self.resume();
                    if (typeof self.options.onRestart === 'function') {
                        self.options.onRestart();
                    }
                };
            }

            const btnOverlayHome = document.getElementById('krazy-btn-overlay-home');
            if (btnOverlayHome) {
                btnOverlayHome.onclick = () => {
                    self.resume();
                    if (typeof self.options.onHome === 'function') {
                        self.options.onHome();
                    }
                };
            }

            // Clicking paused canvas directly resumes
            this.targetEl.addEventListener('click', function(e) {
                if (self.isPaused && !e.target.closest('.krazy-pause-buttons')) {
                    self.resume();
                }
            });
        },

        pause: function() {
            if (this.isPaused) return;
            this.isPaused = true;

            // Trigger game pause callback
            if (typeof this.options.onPause === 'function') {
                this.options.onPause();
            }

            // Update bank balance display
            const bankBadge = document.getElementById('krazy-top-bank');
            if (bankBadge) bankBadge.textContent = `🪙 ${this.getCoins()} P`;

            // Dock the game container into the center placeholder
            const placeholder = document.getElementById('krazy-dock-placeholder');
            if (placeholder && this.targetEl.parentElement !== placeholder) {
                this.originalParent = this.targetEl.parentElement;
                this.originalNextSibling = this.targetEl.nextSibling;
                placeholder.appendChild(this.targetEl);
            }

            this.targetEl.classList.add('krazy-docked-target');
            document.body.classList.add('krazy-portal-paused');

            const overlay = this.targetEl.querySelector('.krazy-canvas-pause-overlay');
            if (overlay) overlay.style.display = 'flex';
        },

        resume: function() {
            if (!this.isPaused) return;
            this.isPaused = false;

            const overlay = this.targetEl.querySelector('.krazy-canvas-pause-overlay');
            if (overlay) overlay.style.display = 'none';

            this.targetEl.classList.remove('krazy-docked-target');
            document.body.classList.remove('krazy-portal-paused');

            // Restore element back to its original DOM parent
            if (this.originalParent) {
                if (this.originalNextSibling) {
                    this.originalParent.insertBefore(this.targetEl, this.originalNextSibling);
                } else {
                    this.originalParent.appendChild(this.targetEl);
                }
            }

            // Trigger game resume callback
            if (typeof this.options.onResume === 'function') {
                this.options.onResume();
            }
        }
    };
})();
