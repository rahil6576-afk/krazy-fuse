// Wild Swings - Web Audio API Synthesizer Sound Engine
class WildAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('wild_swings_muted') === 'true';
    this.initDone = false;
  }

  init() {
    if (this.initDone) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initDone = true;
      }
    } catch (e) {
      console.warn('AudioContext not available:', e);
    }
  }

  ensureContext() {
    if (!this.initDone) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('wild_swings_muted', this.muted.toString());
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Hook / Grapple Attach SFX (Web / Vine / Cord)
  playHookAttach(theme = 'spiderman') {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (theme === 'spiderman') {
      // High-pitched web "THWIP"
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (theme === 'monkey') {
      // Wood/vine snap "WHIP-THUD"
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.1);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } else {
      // Tarzan Wild Jungle Liana Snap "THWACK-SWOOSH"
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.14);

      gain.gain.setValueAtTime(0.42, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  }

  // Hook Release / Launch Whoosh
  playHookRelease(angularSpeed = 1) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 220 + Math.min(400, Math.abs(angularSpeed) * 35);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  // Trampoline / Bouncer Pad Impact
  playBounce(intensity = 1) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Classic Cartoon / Arcade Spring "BOING"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(650, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.28);

    gain.gain.setValueAtTime(0.42 * Math.min(1.3, intensity), now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.31);
  }

  // Mid-air Acrobatic Stunt / Flip completed
  playStuntFlip() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Hazard Impact / Fall Out of Bounds
  playDeath() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.32);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.33);
  }

  // Finish Line / Level Victory Fanfare
  playVictory() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = this.ctx.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.36);
    });
  }

  // Checkpoint Star / Gem Pickup
  playCollectStar() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.06);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }
}

export const wildAudio = new WildAudioEngine();
