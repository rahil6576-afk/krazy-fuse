// js/audio/soundEngine.js - High-Precision Web Audio Procedural Sound Engine

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterVolume = 0.8;
        this.sfxVolume = 0.9;
        this.voiceVolume = 0.85;
        this.musicVolume = 0.65;
        this.isMuted = false;
        this.initialized = false;
        this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    }

    init() {
        if (this.initialized && this.ctx && this.ctx.state === 'running') return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!this.ctx) {
                this.ctx = new AudioContext();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio init failed:', e);
        }
    }

    getMasterGain() {
        if (!this.ctx) return null;
        const gain = this.ctx.createGain();
        gain.gain.value = this.isMuted ? 0 : this.masterVolume * this.sfxVolume;
        gain.connect(this.ctx.destination);
        return gain;
    }

    // Play light hit punch/kick
    playLightHit() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        // Noise burst
        const bufferSize = this.ctx.sampleRate * 0.05;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass filter
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(3, now);

        // Low thud
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);
        oscGain.gain.setValueAtTime(0.7, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        noise.connect(filter);
        filter.connect(out);
        osc.connect(oscGain);
        oscGain.connect(out);

        noise.start(now);
        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Play heavy impact strike
    playHeavyHit() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        // Sub bass drop
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(160, now);
        sub.frequency.exponentialRampToValueAtTime(30, now + 0.25);
        subGain.gain.setValueAtTime(1.0, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        // Distortion / crunch noise
        const bufferSize = this.ctx.sampleRate * 0.12;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.15);

        noise.connect(filter);
        filter.connect(out);
        sub.connect(subGain);
        subGain.connect(out);

        noise.start(now);
        sub.start(now);
        sub.stop(now + 0.26);
    }

    // Attack Whoosh / Swoosh
    playWhoosh(pitch = 1.0) {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        const bufferSize = this.ctx.sampleRate * 0.14;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(350 * pitch, now);
        filter.frequency.exponentialRampToValueAtTime(1400 * pitch, now + 0.07);
        filter.frequency.exponentialRampToValueAtTime(300 * pitch, now + 0.14);
        filter.Q.setValueAtTime(4, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(out);

        noise.start(now);
    }

    // Standard Block sound (dull thud/impact)
    playBlock() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(out);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Perfect Block / Parry sound (high metallic chime + shockwave ping)
    playPerfectBlock() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        [1200, 2400, 3600].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.3 / (idx + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(out);
            osc.start(now);
            osc.stop(now + 0.36);
        });
    }

    // Energy projectile wave sound (Aarav's Energy Wave / Frost's Ice / Volt Shock)
    playEnergyProjectile(characterType = 'AARAV') {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        if (characterType === 'AARAV') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
        } else if (characterType === 'VOLT') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.linearRampToValueAtTime(1760, now + 0.15);
        } else {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
        }

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + 0.26);
    }

    // Dash / Dodge wind swoosh
    playDash() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + 0.13);
    }

    // Super / Ultimate activation blast
    playSuperActivation() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        // Shimmer rising pitch
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(200, now);
        osc1.frequency.exponentialRampToValueAtTime(1600, now + 0.4);
        gain1.gain.setValueAtTime(0.5, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        // Bass drop
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(80, now + 0.2);
        sub.frequency.exponentialRampToValueAtTime(25, now + 0.8);
        subGain.gain.setValueAtTime(0.9, now + 0.2);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc1.connect(gain1);
        gain1.connect(out);
        sub.connect(subGain);
        subGain.connect(out);

        osc1.start(now);
        osc1.stop(now + 0.5);
        sub.start(now + 0.2);
        sub.stop(now + 0.8);
    }

    // Super Final Impact explosion
    playSuperImpact() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        // Massive thunderous explosion
        const bufferSize = this.ctx.sampleRate * 0.8;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 0.7);

        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(140, now);
        sub.frequency.exponentialRampToValueAtTime(20, now + 0.9);
        subGain.gain.setValueAtTime(1.0, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        noise.connect(filter);
        filter.connect(out);
        sub.connect(subGain);
        subGain.connect(out);

        noise.start(now);
        sub.start(now);
        sub.stop(now + 0.9);
    }

    // Grab & Throw sound
    playGrab() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + 0.11);
    }

    // UI Hover sound
    playMenuHover() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    // UI Mode Start / Confirm sound
    playModeStart() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(330, now);
        osc1.frequency.exponentialRampToValueAtTime(660, now + 0.12);
        osc2.frequency.setValueAtTime(660, now);
        osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(out);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.15);
        osc2.stop(now + 0.15);
    }

    // UI Click sound
    playMenuSelect() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const out = this.getMasterGain();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.06);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + 0.07);
    }

    // Announcer voice synthesizer with fallback
    announce(text) {
        if (this.isMuted) return;
        // Synthesis with arcade pitch
        try {
            if (this.synth) {
                this.synth.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.05;
                utterance.pitch = 0.85;
                utterance.volume = this.masterVolume * this.voiceVolume;
                this.synth.speak(utterance);
            }
        } catch (e) {
            console.log('Announcer:', text);
        }
    }
}

export const soundEngine = new SoundEngine();
