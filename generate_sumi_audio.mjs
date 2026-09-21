import fs from 'fs';
import path from 'path';
import { Mp3Encoder } from '@breezystack/lamejs';

const ROOT = process.cwd();
const SAMPLE_RATE = 44100;

function encodeMp3(floatSamples, sampleRate = SAMPLE_RATE, kbps = 128) {
    const encoder = new Mp3Encoder(1, sampleRate, kbps);
    const int16Samples = new Int16Array(floatSamples.length);
    for (let i = 0; i < floatSamples.length; i++) {
        const s = Math.max(-1, Math.min(1, floatSamples[i]));
        int16Samples[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    const chunks = [];
    const buf = encoder.encodeBuffer(int16Samples);
    if (buf.length > 0) chunks.push(Buffer.from(buf));
    const end = encoder.flush();
    if (end.length > 0) chunks.push(Buffer.from(end));
    return Buffer.concat(chunks);
}

// Lowpass / Bandpass filter helper
function applyLowpass(samples, cutoff, sampleRate = SAMPLE_RATE) {
    const rc = 1.0 / (2 * Math.PI * cutoff);
    const dt = 1.0 / sampleRate;
    const alpha = dt / (rc + dt);
    const out = new Float32Array(samples.length);
    let prev = 0;
    for (let i = 0; i < samples.length; i++) {
        prev = prev + alpha * (samples[i] - prev);
        out[i] = prev;
    }
    return out;
}

// 1. ZEN GARDEN MUSIC (~18 seconds meditative Hirajoshi loop)
function synthZenGarden() {
    const duration = 18.0;
    const totalSamples = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(totalSamples);
    
    // Hirajoshi Pentatonic Scale frequencies (D, Eb, G, A, Bb, D5, Eb5, G5)
    const scale = [293.66, 311.13, 392.00, 440.00, 466.16, 587.33, 622.25, 783.99];

    // Singing bowl drone fundamental
    const droneFreq = 146.83; // D3
    for (let i = 0; i < totalSamples; i++) {
        const t = i / SAMPLE_RATE;
        const drone = Math.sin(2 * Math.PI * droneFreq * t) * 0.12 +
                      Math.sin(2 * Math.PI * droneFreq * 2.01 * t) * 0.05 * Math.sin(t * 0.8) +
                      Math.sin(2 * Math.PI * droneFreq * 3.02 * t) * 0.02;
        samples[i] += drone;
    }

    // Koto string plucks sequence
    const notes = [
        { time: 0.5, freq: 293.66, amp: 0.35 },
        { time: 2.2, freq: 392.00, amp: 0.3 },
        { time: 3.8, freq: 440.00, amp: 0.28 },
        { time: 5.5, freq: 466.16, amp: 0.32 },
        { time: 7.2, freq: 587.33, amp: 0.35 },
        { time: 9.0, freq: 440.00, amp: 0.25 },
        { time: 10.8, freq: 392.00, amp: 0.3 },
        { time: 12.5, freq: 311.13, amp: 0.28 },
        { time: 14.2, freq: 293.66, amp: 0.35 },
        { time: 16.0, freq: 440.00, amp: 0.25 }
    ];

    notes.forEach(n => {
        const startIdx = Math.floor(n.time * SAMPLE_RATE);
        const noteDuration = 3.5;
        const noteLen = Math.min(totalSamples - startIdx, Math.floor(noteDuration * SAMPLE_RATE));
        for (let j = 0; j < noteLen; j++) {
            const t = j / SAMPLE_RATE;
            const env = Math.exp(-t * 2.2);
            // Koto harmonic timbre (bright pluck decaying fast)
            const koto = Math.sin(2 * Math.PI * n.freq * t) +
                         0.6 * Math.sin(2 * Math.PI * n.freq * 2.02 * t) * Math.exp(-t * 4.0) +
                         0.3 * Math.sin(2 * Math.PI * n.freq * 3.01 * t) * Math.exp(-t * 6.0) +
                         0.15 * Math.sin(2 * Math.PI * n.freq * 4.03 * t) * Math.exp(-t * 8.0);
            samples[startIdx + j] += koto * env * n.amp;
        }
    });

    // Shakuhachi flute breathy phrase
    const fluteTimes = [
        { start: 1.5, dur: 3.0, freq: 587.33 },
        { start: 6.5, dur: 3.5, freq: 466.16 },
        { start: 11.5, dur: 4.0, freq: 440.00 }
    ];

    fluteTimes.forEach(fl => {
        const startIdx = Math.floor(fl.start * SAMPLE_RATE);
        const len = Math.min(totalSamples - startIdx, Math.floor(fl.dur * SAMPLE_RATE));
        for (let j = 0; j < len; j++) {
            const t = j / SAMPLE_RATE;
            // Smooth attack and release
            let env = 1;
            if (t < 0.6) env = t / 0.6;
            else if (t > fl.dur - 0.8) env = (fl.dur - t) / 0.8;
            
            // Vibrato
            const vib = 1.0 + 0.015 * Math.sin(2 * Math.PI * 5.2 * t);
            // Breathy noise
            const noise = (Math.random() * 2 - 1) * 0.035;
            // Warm flute harmonic
            const flute = Math.sin(2 * Math.PI * fl.freq * vib * t) +
                          0.35 * Math.sin(2 * Math.PI * fl.freq * 2 * vib * t) +
                          noise;
            samples[startIdx + j] += flute * env * 0.16;
        }
    });

    // Gentle crossfade for seamless loop (0.5s at edges)
    const fadeLen = Math.floor(SAMPLE_RATE * 0.5);
    for (let i = 0; i < fadeLen; i++) {
        const factor = i / fadeLen;
        samples[i] *= factor;
        samples[totalSamples - 1 - i] *= factor;
    }

    return samples;
}

// 2. AMBIENCE: WIND (~8 seconds loop)
function synthWind() {
    const duration = 8.0;
    const len = Math.floor(SAMPLE_RATE * duration);
    const raw = new Float32Array(len);
    for (let i = 0; i < len; i++) {
        raw[i] = Math.random() * 2 - 1;
    }
    // Lowpass filter ~380Hz
    const filtered = applyLowpass(raw, 380);
    // Amplitude modulation to simulate soft gusting
    for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const mod = 0.5 + 0.35 * Math.sin(2 * Math.PI * 0.25 * t) + 0.15 * Math.sin(2 * Math.PI * 0.55 * t);
        filtered[i] = filtered[i] * mod * 0.35;
    }
    // Fade edges for seamless loop
    const fadeLen = Math.floor(SAMPLE_RATE * 0.4);
    for (let i = 0; i < fadeLen; i++) {
        const factor = i / fadeLen;
        filtered[i] *= factor;
        filtered[len - 1 - i] *= factor;
    }
    return filtered;
}

// 3. AMBIENCE: BIRDS (~7 seconds loop)
function synthBirds() {
    const duration = 7.0;
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);

    function chirp(startTime, baseFreq) {
        const startIdx = Math.floor(startTime * SAMPLE_RATE);
        const chirpLen = Math.floor(0.18 * SAMPLE_RATE);
        for (let j = 0; j < chirpLen && (startIdx + j < len); j++) {
            const t = j / SAMPLE_RATE;
            const env = Math.sin((t / 0.18) * Math.PI);
            const freq = baseFreq + 800 * Math.sin(t * 40);
            samples[startIdx + j] += Math.sin(2 * Math.PI * freq * t) * env * 0.25;
        }
    }

    // Warbler motif spaced peacefully
    chirp(1.2, 2800);
    chirp(1.45, 3200);
    chirp(1.7, 3600);
    chirp(4.0, 2900);
    chirp(4.25, 3300);

    return samples;
}

// 4. AMBIENCE: WATER (~7 seconds loop)
function synthWater() {
    const duration = 7.0;
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);

    // Continuous soft trickle (filtered pink noise)
    let b0 = 0, b1 = 0;
    for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.95 * b0 + white * 0.08;
        b1 = 0.92 * b1 + b0 * 0.15;
        samples[i] = b1 * 0.18;
    }

    // Occasional delicate water droplet plops
    const dropletTimes = [0.8, 2.3, 3.7, 5.2, 6.4];
    dropletTimes.forEach(time => {
        const startIdx = Math.floor(time * SAMPLE_RATE);
        const dropLen = Math.floor(0.12 * SAMPLE_RATE);
        const freq = 1200 + Math.random() * 600;
        for (let j = 0; j < dropLen && (startIdx + j < len); j++) {
            const t = j / SAMPLE_RATE;
            const env = Math.exp(-t * 45);
            const pitch = freq + 500 * Math.exp(-t * 60);
            samples[startIdx + j] += Math.sin(2 * Math.PI * pitch * t) * env * 0.28;
        }
    });

    // Fade edges for seamless loop
    const fadeLen = Math.floor(SAMPLE_RATE * 0.4);
    for (let i = 0; i < fadeLen; i++) {
        const factor = i / fadeLen;
        samples[i] *= factor;
        samples[len - 1 - i] *= factor;
    }

    return samples;
}

// 5. JAPANESE KOTO INSTRUMENT PLUCKS (Pure musical resonance, zero rubbing/friction noise)
function synthKotoPluck(freq, duration = 0.6, brightness = 0.85) {
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);
    for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 4.2);
        // Fast attack ramp (3ms) to eliminate audio clicks
        const attack = Math.min(1, t / 0.003);
        
        // Authentic Japanese silk/nylon string Koto harmonics
        const h1 = Math.sin(2 * Math.PI * freq * t);
        const h2 = Math.sin(2 * Math.PI * freq * 2.008 * t) * Math.exp(-t * 7.5) * 0.55 * brightness;
        const h3 = Math.sin(2 * Math.PI * freq * 3.015 * t) * Math.exp(-t * 11.0) * 0.32 * brightness;
        const h4 = Math.sin(2 * Math.PI * freq * 4.025 * t) * Math.exp(-t * 15.0) * 0.18 * brightness;
        const h5 = Math.sin(2 * Math.PI * freq * 5.035 * t) * Math.exp(-t * 20.0) * 0.09 * brightness;
        
        // Warm hollow soundboard body resonance
        const body = Math.sin(2 * Math.PI * (freq * 0.5) * t) * Math.exp(-t * 8.0) * 0.12;

        samples[i] = (h1 + h2 + h3 + h4 + h5 + body) * env * attack * 0.38;
    }
    return samples;
}

// 6. INK SPLASH (Clean high melodic chime note)
function synthInkSplash() {
    return synthKotoPluck(587.33, 0.45, 0.8);
}

// 7. UI BUTTON
function synthButton() {
    const duration = 0.12;
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);
    for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        // Hollow bamboo tap
        const click = Math.sin(2 * Math.PI * 680 * t) * Math.exp(-t * 60) * 0.4 +
                      Math.sin(2 * Math.PI * 1360 * t) * Math.exp(-t * 90) * 0.2;
        samples[i] = click;
    }
    return samples;
}

// 8. UI TOGGLE
function synthToggle() {
    const duration = 0.10;
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);
    for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const tick = Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t * 70) * 0.35;
        samples[i] = tick;
    }
    return samples;
}

// 9. UI PAPER WIPE (Peaceful dual bamboo bell sweep, zero rubbing noise)
function synthPaperWipe() {
    const duration = 0.45;
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);
    for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const attack = Math.min(1, t / 0.005);
        const env1 = Math.exp(-t * 6.0) * attack;
        const tone1 = (Math.sin(2 * Math.PI * 440 * t) + 0.3 * Math.sin(2 * Math.PI * 880 * t)) * env1 * 0.3;
        
        let tone2 = 0;
        if (t > 0.07) {
            const t2 = t - 0.07;
            const env2 = Math.exp(-t2 * 5.0) * Math.min(1, t2 / 0.005);
            tone2 = (Math.sin(2 * Math.PI * 587.33 * t2) + 0.25 * Math.sin(2 * Math.PI * 1174.66 * t2)) * env2 * 0.25;
        }
        samples[i] = tone1 + tone2;
    }
    return samples;
}

// 10. AI THINKING (~1.6s)
function synthAIThinking() {
    const duration = 1.6;
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);
    for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const env = Math.sin((t / duration) * Math.PI);
        // Meditative singing bowl overtone meditation (432Hz + 864Hz harmonic)
        const bowl = Math.sin(2 * Math.PI * 432 * t) * 0.3 +
                     Math.sin(2 * Math.PI * 864.5 * t) * 0.15 +
                     Math.sin(2 * Math.PI * 1296.8 * t) * 0.06;
        samples[i] = bowl * env;
    }
    return samples;
}

// 11. VICTORY (~3.0s)
function synthVictory() {
    const duration = 3.0;
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);
    // Ascending celebratory Japanese koto flourish
    const notes = [
        { t: 0.05, f: 293.66 }, // D4
        { t: 0.25, f: 392.00 }, // G4
        { t: 0.45, f: 440.00 }, // A4
        { t: 0.65, f: 587.33 }, // D5
        { t: 0.90, f: 783.99 }  // G5 (Grand chime)
    ];
    notes.forEach(n => {
        const start = Math.floor(n.t * SAMPLE_RATE);
        for (let j = 0; j < Math.floor(1.8 * SAMPLE_RATE) && (start + j < len); j++) {
            const t = j / SAMPLE_RATE;
            const env = Math.exp(-t * 2.5);
            const koto = Math.sin(2 * Math.PI * n.f * t) +
                         0.5 * Math.sin(2 * Math.PI * n.f * 2 * t) * Math.exp(-t * 4);
            samples[start + j] += koto * env * 0.28;
        }
    });
    // Shimmering brass temple bell on peak
    const bellStart = Math.floor(0.90 * SAMPLE_RATE);
    for (let j = 0; j < len - bellStart; j++) {
        const t = j / SAMPLE_RATE;
        const env = Math.exp(-t * 1.4);
        const bell = Math.sin(2 * Math.PI * 1174.66 * t) * 0.25 +
                     Math.sin(2 * Math.PI * 2349.32 * t) * 0.12 * Math.exp(-t * 3);
        samples[bellStart + j] += bell * env;
    }
    return samples;
}

// 12. DEFEAT (~2.2s)
function synthDefeat() {
    const duration = 2.2;
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);
    // Understated low resonance gong + descending flute breath
    for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 1.8);
        const gong = Math.sin(2 * Math.PI * 98 * t) * 0.4 +
                     Math.sin(2 * Math.PI * 196 * t) * 0.2 * Math.exp(-t * 3);
        // Descending sigh
        const sighFreq = 392 - 120 * (t / duration);
        const sigh = Math.sin(2 * Math.PI * sighFreq * t) * Math.exp(-t * 2.2) * 0.18;
        samples[i] = (gong + sigh) * env;
    }
    return samples;
}

// 13. DRAW (~2.2s)
function synthDraw() {
    const duration = 2.2;
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);
    // Two singing bowls in fifth harmony (D4 293.66Hz + A4 440Hz), peaceful equilibrium
    for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 1.6);
        const harmony = Math.sin(2 * Math.PI * 293.66 * t) * 0.28 +
                        Math.sin(2 * Math.PI * 440.00 * t) * 0.25 +
                        Math.sin(2 * Math.PI * 880.00 * t) * 0.10 * Math.exp(-t * 3.5);
        samples[i] = harmony * env;
    }
    return samples;
}

// Master Audio Spec to Generate
const filesToGenerate = [
    { dir: 'music', name: 'zen-garden.mp3', synth: synthZenGarden },
    { dir: 'music', name: 'zen-garden.ogg', synth: synthZenGarden }, // mirror for ogg support
    { dir: 'ambience', name: 'wind.mp3', synth: synthWind },
    { dir: 'ambience', name: 'birds.mp3', synth: synthBirds },
    { dir: 'brush', name: 'brush-light.mp3', synth: () => synthKotoPluck(440.00, 0.55, 0.85) }, // A4 Koto pluck (Opponent / Bot turn mark)
    { dir: 'brush', name: 'brush-medium.mp3', synth: () => synthKotoPluck(293.66, 0.65, 0.90) }, // D4 Koto pluck (Player X turn mark)
    { dir: 'brush', name: 'brush-heavy.mp3', synth: () => synthKotoPluck(220.00, 0.80, 0.95) }, // A3 Deep Koto bass pluck
    { dir: 'brush', name: 'ink-splash.mp3', synth: synthInkSplash },
    { dir: 'ui', name: 'button.mp3', synth: synthButton },
    { dir: 'ui', name: 'toggle.mp3', synth: synthToggle },
    { dir: 'ui', name: 'paper-wipe.mp3', synth: synthPaperWipe },
    { dir: 'game', name: 'ai-thinking.mp3', synth: synthAIThinking },
    { dir: 'game', name: 'victory.mp3', synth: synthVictory },
    { dir: 'game', name: 'defeat.mp3', synth: synthDefeat },
    { dir: 'game', name: 'draw.mp3', synth: synthDraw }
];

const targetDirs = [
    path.join(ROOT, 'public', 'audio', 'sumi-e'),
    path.join(ROOT, 'audio', 'sumi-e'),
    path.join(ROOT, 'dist', 'public', 'audio', 'sumi-e'),
    path.join(ROOT, 'dist', 'audio', 'sumi-e')
];

console.log('Generating Sumi-e Zen Audio assets...');

for (const item of filesToGenerate) {
    console.log(`Synthesizing: ${item.dir}/${item.name}...`);
    const floatData = item.synth();
    const mp3Buffer = encodeMp3(floatData);

    for (const baseDir of targetDirs) {
        const fullDir = path.join(baseDir, item.dir);
        fs.mkdirSync(fullDir, { recursive: true });
        const filePath = path.join(fullDir, item.name);
        fs.writeFileSync(filePath, mp3Buffer);
    }
}

console.log('✨ All Sumi-e Zen Audio files generated successfully!');
