// js/audio/musicEngine.js - Dynamic Procedural Arcade Music Synthesizer

import { soundEngine } from './soundEngine.js';

class MusicEngine {
    constructor() {
        this.isPlaying = false;
        this.currentTrack = null;
        this.step = 0;
        this.timer = null;
        this.bpm = 135;
        this.nodes = [];
    }

    startTrack(stageId = 'FUTURE_CITY') {
        this.stopTrack();
        soundEngine.init();
        if (!soundEngine.ctx) return;
        this.isPlaying = true;
        this.currentTrack = stageId;
        this.step = 0;
        this.bpm = (stageId === 'VOLCANIC_CORE') ? 144 : (stageId === 'FROZEN_BASE') ? 128 : 136;
        
        const stepTimeMs = (60 / this.bpm / 4) * 1000;
        this.timer = setInterval(() => this.tick(), stepTimeMs);
    }

    stopTrack() {
        this.isPlaying = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    tick() {
        if (!this.isPlaying || !soundEngine.ctx || soundEngine.isMuted) return;
        const ctx = soundEngine.ctx;
        const now = ctx.currentTime;
        const out = ctx.createGain();
        out.gain.value = soundEngine.masterVolume * soundEngine.musicVolume * 0.22;
        out.connect(ctx.destination);

        const beat = this.step % 16;
        const bar = Math.floor(this.step / 16) % 4;

        // Kick on 0, 4, 8, 12
        if (beat % 4 === 0) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(35, now + 0.1);
            gain.gain.setValueAtTime(1.0, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.connect(gain);
            gain.connect(out);
            osc.start(now);
            osc.stop(now + 0.11);
        }

        // Snare / Clap on 4, 12
        if (beat === 4 || beat === 12) {
            const bufferSize = ctx.sampleRate * 0.08;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1400;
            const gain = ctx.createGain();
            gain.gain.value = 0.5;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(out);
            noise.start(now);
        }

        // Hi-hat on every 2 steps
        if (beat % 2 === 0) {
            const bufferSize = ctx.sampleRate * 0.02;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 7000;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(beat % 4 === 2 ? 0.3 : 0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(out);
            noise.start(now);
        }

        // Rolling Synth Bass
        const bassNotes = [55, 55, 65.4, 73.4]; // A1, A1, C2, D2
        const currentBass = bassNotes[bar];
        if (beat % 2 === 0) {
            const bassOsc = ctx.createOscillator();
            const bassGain = ctx.createGain();
            bassOsc.type = 'sawtooth';
            bassOsc.frequency.setValueAtTime(currentBass, now);
            bassGain.gain.setValueAtTime(0.4, now);
            bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            
            const bassFilter = ctx.createBiquadFilter();
            bassFilter.type = 'lowpass';
            bassFilter.frequency.setValueAtTime(450, now);
            bassFilter.frequency.exponentialRampToValueAtTime(150, now + 0.1);

            bassOsc.connect(bassFilter);
            bassFilter.connect(bassGain);
            bassGain.connect(out);
            bassOsc.start(now);
            bassOsc.stop(now + 0.11);
        }

        // Arpeggio Lead
        const arpScale = [220, 261.63, 329.63, 392, 440, 523.25, 659.25, 783.99];
        const noteIdx = (beat * 3 + bar * 2) % arpScale.length;
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(arpScale[noteIdx], now);
        leadGain.gain.setValueAtTime(0.12, now);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        leadOsc.connect(leadGain);
        leadGain.connect(out);
        leadOsc.start(now);
        leadOsc.stop(now + 0.09);

        this.step++;
    }
}

export const musicEngine = new MusicEngine();
