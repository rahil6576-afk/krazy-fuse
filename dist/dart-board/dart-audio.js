// Dart Master Arena - Web Audio Synthesizer Engine
class DartAudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.synthSupported = 'speechSynthesis' in window;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    // Dart Whoosh Throw sound
    playThrow() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    // Board Impact Thud (realistic wooden sisal board impact)
    playHit(isTreble = false, isBull = false) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isBull ? 'triangle' : 'sine';
        const startFreq = isBull ? 160 : (isTreble ? 220 : 130);
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);

        // Treble/Bull accent chime
        if (isTreble || isBull) {
            const chimeOsc = this.ctx.createOscillator();
            const chimeGain = this.ctx.createGain();
            chimeOsc.type = 'sine';
            chimeOsc.frequency.setValueAtTime(isBull ? 880 : 660, now + 0.02);
            chimeOsc.frequency.exponentialRampToValueAtTime(1320, now + 0.25);

            chimeGain.gain.setValueAtTime(0.2, now + 0.02);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            chimeOsc.connect(chimeGain);
            chimeGain.connect(this.ctx.destination);
            chimeOsc.start(now + 0.02);
            chimeOsc.stop(now + 0.25);
        }
    }

    // Miss or Bounce-Out Click
    playMiss() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Crowd Applause & Cheering
    playCrowdCheer() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 1.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.8));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(1.5, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 1.5);
    }

    // Referee Voice Announcements via SpeechSynthesis
    announce(text) {
        if (this.muted || !this.synthSupported) return;
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.15;
            utterance.pitch = 0.95;
            utterance.volume = 0.85;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('Speech synthesis error:', e);
        }
    }
}

window.dartAudio = new DartAudioEngine();
