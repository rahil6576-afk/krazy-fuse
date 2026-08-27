/**
 * KRAZY FUSE ARCADE UNIVERSAL PORTAL BRIDGE
 * Seamlessly integrates game ESC and pause events with the CrazyGames Portal Experience.
 */
(function() {
    'use strict';

    window.KrazyPortalDock = {
        options: null,
        targetEl: null,
        isPaused: false,

        init: function(opts) {
            this.options = Object.assign({
                gameId: 'game',
                title: 'Arcade Game',
                targetSelector: '#game-container',
                onPause: null,
                onResume: null,
                onRestart: null,
                onHome: function() { 
                    if (window.parent !== window) {
                        window.parent.postMessage({ type: 'EXIT_TO_PORTAL' }, '*');
                    } else {
                        window.location.href = '../index.html'; 
                    }
                }
            }, opts);

            this.targetEl = document.querySelector(this.options.targetSelector) || document.body;
            this.bindEvents();
        },

        bindEvents: function() {
            const self = this;

            // Global ESC Handler: Bridge to CrazyGames player or portal
            window.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                    e.preventDefault();
                    self.handleEsc();
                }
            });
        },

        handleEsc: function() {
            // If running inside the portal iframe, notify parent shell to handle fullscreen exit or catalog view
            if (window.parent !== window) {
                window.parent.postMessage({ 
                    type: 'KRAZY_ESC', 
                    gameId: this.options ? this.options.gameId : 'game' 
                }, '*');
            } else {
                // If running standalone, navigate to the master CrazyGames player
                const gameId = this.options ? this.options.gameId : '';
                window.location.href = `../index.html${gameId ? '?game=' + gameId : ''}`;
            }
        },

        pause: function() {
            this.isPaused = true;
            if (typeof this.options?.onPause === 'function') {
                this.options.onPause();
            }
            this.handleEsc();
        },

        resume: function() {
            this.isPaused = false;
            if (typeof this.options?.onResume === 'function') {
                this.options.onResume();
            }
        }
    };
})();
