/**
 * KRAZY FUSE ARCADE UNIVERSAL SCREENSHOT ENGINE
 * Enables high-fidelity in-game screenshots in fullscreen and standard modes across all games.
 * Features:
 * - 📸 Floating 3D HUD Camera Button
 * - ⌨️ Keyboard Shortcuts: 'C', 'S', 'F2', 'PrtScn'
 * - 🔊 Synthesized Real-time Camera Shutter Sound (Web Audio)
 * - ⚡ Shutter Lens Flash Animation Overlay
 * - 💾 Instant Auto-Download (PNG) & Clipboard Copy
 * - 🌟 Live Glassmorphism Toast with Thumbnail Preview
 */
(function() {
    'use strict';

    // Prevent double initialization
    if (window.KrazyScreenshot) return;

    class ScreenshotEngine {
        constructor() {
            this.audioCtx = null;
            this.isCapturing = false;
            this.gameTitle = this.detectGameTitle();
            this.init();
        }

        detectGameTitle() {
            const path = window.location.pathname.toLowerCase();
            if (path.includes('dart')) return 'Dart-Master';
            if (path.includes('office')) return 'Office-Escape';
            if (path.includes('flappy')) return 'Flappy-Man';
            if (path.includes('bomb')) return 'Bomb-Panic';
            if (path.includes('wild')) return 'Wild-Swings';
            if (path.includes('gravity')) return 'Gravity-Flip';
            if (path.includes('elevator')) return 'Elevator-Doom';
            if (path.includes('fallen')) return 'Fallen-One';
            if (path.includes('popup')) return 'Pop-Up-Blitz';
            if (path.includes('tic')) return 'Tic-Tac-Toe';
            return document.title.split('—')[0].split(':')[0].trim().replace(/\s+/g, '-') || 'Arcade-Game';
        }

        init() {
            this.injectStyles();
            this.createDOM();
            this.bindEvents();
        }

        initAudio() {
            if (!this.audioCtx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.audioCtx = new AudioCtx();
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
        }

        playShutterSound() {
            try {
                this.initAudio();
                if (!this.audioCtx) return;
                const ctx = this.audioCtx;
                const now = ctx.currentTime;

                // 1. First mechanical click
                const osc1 = ctx.createOscillator();
                const gain1 = ctx.createGain();
                osc1.type = 'triangle';
                osc1.frequency.setValueAtTime(1200, now);
                osc1.frequency.exponentialRampToValueAtTime(120, now + 0.04);
                gain1.gain.setValueAtTime(0.4, now);
                gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc1.start(now);
                osc1.stop(now + 0.04);

                // 2. Shutter blade slap
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'sawtooth';
                osc2.frequency.setValueAtTime(650, now + 0.04);
                osc2.frequency.exponentialRampToValueAtTime(80, now + 0.09);
                gain2.gain.setValueAtTime(0.35, now + 0.04);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start(now + 0.04);
                osc2.stop(now + 0.09);

                // 3. Mirror return click
                const osc3 = ctx.createOscillator();
                const gain3 = ctx.createGain();
                osc3.type = 'sine';
                osc3.frequency.setValueAtTime(1800, now + 0.09);
                osc3.frequency.exponentialRampToValueAtTime(300, now + 0.14);
                gain3.gain.setValueAtTime(0.25, now + 0.09);
                gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
                osc3.connect(gain3);
                gain3.connect(ctx.destination);
                osc3.start(now + 0.09);
                osc3.stop(now + 0.14);
            } catch (e) {
                console.warn('Screenshot audio playback note:', e);
            }
        }

        injectStyles() {
            if (document.getElementById('krazy-screenshot-styles')) return;
            const style = document.createElement('style');
            style.id = 'krazy-screenshot-styles';
            style.textContent = `
                /* Shutter White Flash */
                #krazy-shutter-flash {
                    position: fixed;
                    inset: 0;
                    background: #ffffff;
                    opacity: 0;
                    pointer-events: none;
                    z-index: 999999;
                    transition: opacity 0.08s ease-out;
                }
                #krazy-shutter-flash.flashing {
                    opacity: 0.92;
                    transition: opacity 0.03s ease-in;
                }

                /* Floating 3D Screenshot HUD Button */
                .krazy-screenshot-btn {
                    position: fixed;
                    top: max(18px, env(safe-area-inset-top, 18px));
                    right: 80px;
                    width: 44px;
                    height: 44px;
                    min-width: 44px;
                    min-height: 44px;
                    border-radius: 50%;
                    aspect-ratio: 1 / 1;
                    background: radial-gradient(circle at 35% 32%, #3a475a 0%, #1e2837 55%, #0e1622 100%);
                    border: 2px solid rgba(255, 255, 255, 0.25);
                    color: #f1f5f9;
                    font-size: 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    text-decoration: none;
                    z-index: 99990;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -3px 6px rgba(0, 0, 0, 0.75);
                    transition: transform 0.14s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.14s ease, border-color 0.14s ease, opacity 0.2s ease;
                    user-select: none;
                    -webkit-user-select: none;
                }
                .krazy-screenshot-btn:hover {
                    transform: translateY(-2px) scale(1.08);
                    border-color: #38bdf8;
                    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.85), inset 0 2px 4px rgba(255, 255, 255, 0.45), 0 0 16px rgba(56, 189, 248, 0.5);
                }
                .krazy-screenshot-btn:active {
                    transform: translateY(3px) scale(0.92);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.9), inset 0 4px 8px rgba(0, 0, 0, 0.95);
                }

                /* Toast Notification with Thumbnail Preview */
                .krazy-screenshot-toast {
                    position: fixed;
                    bottom: 28px;
                    left: 50%;
                    transform: translateX(-50%) translateY(40px) scale(0.92);
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(30, 41, 59, 0.96));
                    border: 1.5px solid rgba(56, 189, 248, 0.5);
                    border-radius: 18px;
                    padding: 10px 18px 10px 12px;
                    color: #ffffff;
                    font-family: 'Outfit', 'Rubik', -apple-system, BlinkMacSystemFont, sans-serif;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    z-index: 999998;
                    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(56, 189, 248, 0.35);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    opacity: 0;
                    pointer-events: none;
                    transition: transform 0.32s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.28s ease;
                }
                .krazy-screenshot-toast.show {
                    transform: translateX(-50%) translateY(0) scale(1);
                    opacity: 1;
                    pointer-events: auto;
                }
                .krazy-screenshot-thumb {
                    width: 52px;
                    height: 34px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    object-fit: cover;
                    background: #000;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
                }
                .krazy-screenshot-text {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .krazy-screenshot-title {
                    font-size: 0.95rem;
                    font-weight: 800;
                    color: #38bdf8;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    letter-spacing: 0.5px;
                }
                .krazy-screenshot-sub {
                    font-size: 0.75rem;
                    color: #cbd5e1;
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
        }

        createDOM() {
            // 1. Shutter Flash
            if (!document.getElementById('krazy-shutter-flash')) {
                const flash = document.createElement('div');
                flash.id = 'krazy-shutter-flash';
                document.body.appendChild(flash);
            }

            // 2. Check if in top HUD or create Floating Camera Button
            if (!document.getElementById('krazy-screenshot-btn')) {
                const btn = document.createElement('button');
                btn.id = 'krazy-screenshot-btn';
                btn.className = 'krazy-screenshot-btn hud-btn';
                btn.title = 'Take In-Game Screenshot (Shortcut: C or S)';
                btn.setAttribute('aria-label', 'Screenshot');
                btn.innerHTML = '📸';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.capture();
                });

                // If game has .top-hud-right or header, insert inside; else float fixed
                const topHudRight = document.querySelector('.top-hud-right, .hud-right, .header-right');
                if (topHudRight) {
                    btn.style.position = 'static';
                    topHudRight.insertBefore(btn, topHudRight.firstChild);
                } else {
                    document.body.appendChild(btn);
                }
            }

            // 3. Toast Container
            if (!document.getElementById('krazy-screenshot-toast')) {
                const toast = document.createElement('div');
                toast.id = 'krazy-screenshot-toast';
                toast.className = 'krazy-screenshot-toast';
                toast.innerHTML = `
                    <img class="krazy-screenshot-thumb" id="krazy-shot-thumb" alt="Preview">
                    <div class="krazy-screenshot-text">
                        <span class="krazy-screenshot-title">📸 SCREENSHOT SAVED!</span>
                        <span class="krazy-screenshot-sub">Captured in full high-resolution</span>
                    </div>
                `;
                document.body.appendChild(toast);
            }
        }

        bindEvents() {
            window.addEventListener('keydown', (e) => {
                const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
                if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

                // 'C', 'c', 'S', 's' (without modifier when not playing letter games), 'F2', 'PrintScreen'
                if (e.key === 'F2' || e.key === 'PrintScreen' || (e.code === 'KeyC' && !e.ctrlKey && !e.altKey && !e.metaKey)) {
                    e.preventDefault();
                    this.capture();
                }
            });
        }

        async capture() {
            if (this.isCapturing) return;
            this.isCapturing = true;

            // 1. Audio & Flash effect
            this.playShutterSound();
            const flash = document.getElementById('krazy-shutter-flash');
            if (flash) {
                flash.classList.add('flashing');
                setTimeout(() => flash.classList.remove('flashing'), 75);
            }

            // 2. Identify active canvas or stage
            const canvases = Array.from(document.querySelectorAll('canvas')).filter(c => {
                const r = c.getBoundingClientRect();
                return r.width > 100 && r.height > 100 && window.getComputedStyle(c).display !== 'none';
            });

            let dataUrl = null;

            if (canvases.length > 0) {
                // Find the main game canvas (usually largest)
                const mainCanvas = canvases.reduce((max, c) => (c.width * c.height > max.width * max.height ? c : max), canvases[0]);
                try {
                    dataUrl = mainCanvas.toDataURL('image/png');
                } catch (err) {
                    console.warn('Direct canvas toDataURL error (tainted or WebGL buffer):', err);
                }
            }

            // Fallback composite offscreen canvas if multiple or background
            if (!dataUrl && canvases.length > 0) {
                const target = canvases[0];
                const offscreen = document.createElement('canvas');
                offscreen.width = target.width || window.innerWidth;
                offscreen.height = target.height || window.innerHeight;
                const octx = offscreen.getContext('2d');
                octx.drawImage(target, 0, 0);
                dataUrl = offscreen.toDataURL('image/png');
            }

            if (dataUrl) {
                this.saveScreenshot(dataUrl);
            } else {
                console.warn('No active canvas found to capture.');
            }

            setTimeout(() => {
                this.isCapturing = false;
            }, 600);
        }

        saveScreenshot(dataUrl) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const filename = `${this.gameTitle}-Screenshot-${timestamp}.png`;

            // 1. Auto Trigger Browser Download
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 2. Copy image to Clipboard if supported
            if (navigator.clipboard && window.ClipboardItem) {
                fetch(dataUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).catch(() => {});
                    })
                    .catch(() => {});
            }

            // 3. Show Toast Preview
            const toast = document.getElementById('krazy-screenshot-toast');
            const thumb = document.getElementById('krazy-shot-thumb');
            if (toast && thumb) {
                thumb.src = dataUrl;
                toast.classList.add('show');
                if (this._toastTimer) clearTimeout(this._toastTimer);
                this._toastTimer = setTimeout(() => {
                    toast.classList.remove('show');
                }, 3200);
            }
        }
    }

    // Global Initializer
    window.takeGameScreenshot = function() {
        if (window.KrazyScreenshot) window.KrazyScreenshot.capture();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.KrazyScreenshot = new ScreenshotEngine();
        });
    } else {
        window.KrazyScreenshot = new ScreenshotEngine();
    }
})();
