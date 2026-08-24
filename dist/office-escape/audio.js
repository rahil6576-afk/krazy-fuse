// Web Audio API Sound and Music System for Office Escape
class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgmPlaying = false;
        this.bgmInterval = null;
        this.bgmStep = 0;
        this.masterVolume = 0.35;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        } else if (this.bgmPlaying) {
            this.startBGM();
        }
        return this.isMuted;
    }

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.2, pitchDecay = 0) {
        if (this.isMuted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            if (pitchDecay !== 0) {
                osc.frequency.exponentialRampToValueAtTime(Math.max(10, freq + pitchDecay), now + duration);
            }

            gain.gain.setValueAtTime(gainVal * this.masterVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            console.error("Audio error", e);
        }
    }

    playJump() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.15);

        gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playDoubleJump() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

        gain.gain.setValueAtTime(0.35 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
    }

    playSlide() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        try {
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.2);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);
            filter.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.2);
            filter.Q.setValueAtTime(2, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.25 * this.masterVolume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        } catch (e) {}
    }

    playDash() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);

        gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    playCoin() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);

        gain.gain.setValueAtTime(0.25 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
    }

    playCoffeePowerup() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [330, 440, 550, 660, 880];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.05);

            gain.gain.setValueAtTime(0.2 * this.masterVolume, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.12);
        });
    }

    playShieldUp() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        this.playTone(400, 'sine', 0.1, 0.2, 300);
        setTimeout(() => this.playTone(600, 'sine', 0.15, 0.2, 400), 80);
    }

    playShieldBreak() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        this.playTone(500, 'sawtooth', 0.15, 0.3, -300);
    }

    playMilestone() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        this.playTone(880, 'sine', 0.08, 0.32, 0);
        setTimeout(() => this.playTone(1760, 'sine', 0.12, 0.36, 0), 85);
    }

    playBossAlert() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        [0, 0.18, 0.36].forEach((t, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(i % 2 === 0 ? 440 : 550, now + t);

            gain.gain.setValueAtTime(0.25 * this.masterVolume, now + t);
            gain.gain.exponentialRampToValueAtTime(0.01, now + t + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + t);
            osc.stop(now + t + 0.15);
        });
    }

    playBlast() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        this.playTone(180, 'sawtooth', 0.35, 0.4, -130);
    }

    playGameOver() {
        this.init();
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [400, 370, 330, 260];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + i * 0.16);

            gain.gain.setValueAtTime(0.3 * this.masterVolume, now + i * 0.16);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.16 + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.16);
            osc.stop(now + i * 0.16 + 0.2);
        });
    }

    startBGM() {
        this.init();
        if (this.bgmPlaying || this.isMuted || !this.ctx) return;
        this.bgmPlaying = true;
        this.bgmStep = 0;

        const bassNotes = [
            220, 220, 330, 220, 174.61, 174.61, 261.63, 174.61,
            130.81, 130.81, 196, 130.81, 196, 196, 246.94, 196
        ];

        const leadNotes = [
            440, 0, 523.25, 659.25, 0, 587.33, 523.25, 0,
            392, 0, 440, 523.25, 659.25, 587.33, 440, 0
        ];

        const tempoMs = 135;

        this.bgmInterval = setInterval(() => {
            if (this.isMuted || !this.ctx || !this.bgmPlaying) return;
            const now = this.ctx.currentTime;

            const bassFreq = bassNotes[this.bgmStep % bassNotes.length];
            if (bassFreq > 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(bassFreq / 2, now);
                gain.gain.setValueAtTime(0.12 * this.masterVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(650, now);
                filter.frequency.exponentialRampToValueAtTime(160, now + 0.12);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.12);
            }

            const leadFreq = leadNotes[this.bgmStep % leadNotes.length];
            if (leadFreq > 0 && Math.random() > 0.15) {
                const oscL = this.ctx.createOscillator();
                const gainL = this.ctx.createGain();
                oscL.type = 'square';
                oscL.frequency.setValueAtTime(leadFreq, now);
                gainL.gain.setValueAtTime(0.06 * this.masterVolume, now);
                gainL.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

                const filterL = this.ctx.createBiquadFilter();
                filterL.type = 'lowpass';
                filterL.frequency.setValueAtTime(1900, now);

                oscL.connect(filterL);
                filterL.connect(gainL);
                gainL.connect(this.ctx.destination);
                oscL.start(now);
                oscL.stop(now + 0.18);
            }

            if (this.bgmStep % 2 === 0) {
                this.playHiHat(now);
            }

            if (this.bgmStep % 8 === 4) {
                this.playSnare(now);
            }

            this.bgmStep = (this.bgmStep + 1) % 64;
        }, tempoMs);
    }

    playHiHat(now) {
        if (!this.ctx || this.isMuted) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(8000, now);
            gain.gain.setValueAtTime(0.025 * this.masterVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.03);
        } catch (e) {}
    }

    playSnare(now) {
        if (!this.ctx || this.isMuted) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(190, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
            gain.gain.setValueAtTime(0.1 * this.masterVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    }

    stopBGM() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
        this.bgmPlaying = false;
    }
}

window.soundManager = new SoundManager();
