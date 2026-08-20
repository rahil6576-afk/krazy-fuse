// js/ui/trainingOverlay.js - Training Mode Diagnostics & Frame Advantage Overlay

export class TrainingOverlay {
    constructor(game) {
        this.game = game;
        this.dom = {
            panel: document.getElementById('training-panel'),
            frameAdvantage: document.getElementById('frame-advantage-val'),
            dummyState: document.getElementById('dummy-state-select'),
            toggleHitboxes: document.getElementById('toggle-hitboxes-btn'),
            resetPositions: document.getElementById('reset-training-btn'),
            inputHistoryList: document.getElementById('input-history-list')
        };

        this.initEvents();
    }

    initEvents() {
        if (this.dom.toggleHitboxes) {
            this.dom.toggleHitboxes.addEventListener('click', () => {
                this.game.renderer.showHitboxes = !this.game.renderer.showHitboxes;
                this.dom.toggleHitboxes.classList.toggle('active', this.game.renderer.showHitboxes);
                this.dom.toggleHitboxes.textContent = this.game.renderer.showHitboxes ? 'Hitboxes: ON' : 'Hitboxes: OFF';
            });
        }

        if (this.dom.resetPositions) {
            this.dom.resetPositions.addEventListener('click', () => {
                this.game.resetTrainingPositions();
            });
        }

        if (this.dom.dummyState) {
            this.dom.dummyState.addEventListener('change', (e) => {
                this.game.dummyBehavior = e.target.value;
            });
        }
    }

    show() {
        if (this.dom.panel) this.dom.panel.classList.remove('hidden');
    }

    hide() {
        if (this.dom.panel) this.dom.panel.classList.add('hidden');
    }

    updateFrameData(advantage) {
        if (this.dom.frameAdvantage) {
            const sign = advantage > 0 ? '+' : '';
            this.dom.frameAdvantage.textContent = `${sign}${advantage}F`;
            this.dom.frameAdvantage.style.color = advantage > 0 ? '#4ade80' : advantage < 0 ? '#f87171' : '#facc15';
        }
    }

    logInput(playerKey, actionName) {
        if (!this.dom.inputHistoryList) return;
        const item = document.createElement('div');
        item.className = 'input-history-item';
        item.textContent = `[${playerKey}] ${actionName}`;
        this.dom.inputHistoryList.prepend(item);
        if (this.dom.inputHistoryList.children.length > 8) {
            this.dom.inputHistoryList.lastChild.remove();
        }
    }
}
