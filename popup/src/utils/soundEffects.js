// Synthesized and Recorded sound effects using HTML5 Web Audio API & Audio Pool
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('float_sound_muted') === 'true';
    this.spaceShootBuffer = null;
    this.beachSliceBuffer = null;
    this.wrongBuffer = null;
    this.failBuffer = null;
    this.asteroidExplosionBuffer = null;
    this.swagatBuffer = null;

    this.spaceShootAudioPool = [];
    this.beachSliceAudioPool = [];
    this.wrongAudioPool = [];
    this.failAudioPool = [];
    this.asteroidExplosionAudioPool = [];
    this.swagatAudio = null;

    this.spacePoolIndex = 0;
    this.beachPoolIndex = 0;
    this.wrongPoolIndex = 0;
    this.failPoolIndex = 0;
    this.explosionPoolIndex = 0;
    this.poolSize = 8;

    this.spaceSoundUrl = './freesound_community-sci-fi-gun-shot-x6-14447 (2).mp3';
    this.beachSliceUrl = './floraphonic-steel-blade-slice-2-188214.mp3';
    this.wrongSoundUrl = './freesound_community-wrong-47985.mp3';
    this.failSoundUrl = './u_8g40a9z0la-fail-234710.mp3';
    this.asteroidExplosionSoundUrl = './universfield_epic_cinematic_explosion_454857_V1.mp3';
    this.swagatSoundUrl = './audio_05861b0a_1786957873110.mp3';

    this.poolSize = 3;
    if (typeof window !== 'undefined') {
      // Lazy init on first user interaction to avoid loading hitch
      const handleFirstInteraction = () => {
        this.init();
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      };
      window.addEventListener('click', handleFirstInteraction, { once: true });
      window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    }
  }

  initAudioPools() {
    try {
      this.spaceShootAudioPool = [];
      this.beachSliceAudioPool = [];
      this.wrongAudioPool = [];
      this.failAudioPool = [];
      this.asteroidExplosionAudioPool = [];

      for (let i = 0; i < this.poolSize; i++) {
        const audioShoot = new Audio(this.spaceSoundUrl);
        audioShoot.volume = 0.5;
        this.spaceShootAudioPool.push(audioShoot);

        const audioSlice = new Audio(this.beachSliceUrl);
        audioSlice.volume = 0.55;
        this.beachSliceAudioPool.push(audioSlice);

        const audioWrong = new Audio(this.wrongSoundUrl);
        audioWrong.volume = 0.5;
        this.wrongAudioPool.push(audioWrong);

        const audioFail = new Audio(this.failSoundUrl);
        audioFail.volume = 0.65;
        this.failAudioPool.push(audioFail);

        const audioExplosion = new Audio(this.asteroidExplosionSoundUrl);
        audioExplosion.volume = 0.6;
        this.asteroidExplosionAudioPool.push(audioExplosion);
      }
    } catch {
      // Audio pool fallback
    }
  }

  async init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.loadAudioBuffers();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  async loadAudioBuffers() {
    if (!this.ctx) return;
    try {
      if (!this.spaceShootBuffer) {
        const respShoot = await fetch(this.spaceSoundUrl);
        const arrayBufShoot = await respShoot.arrayBuffer();
        this.spaceShootBuffer = await this.ctx.decodeAudioData(arrayBufShoot);
      }
    } catch {
      // Fallback
    }

    try {
      if (!this.beachSliceBuffer) {
        const respSlice = await fetch(this.beachSliceUrl);
        const arrayBufSlice = await respSlice.arrayBuffer();
        this.beachSliceBuffer = await this.ctx.decodeAudioData(arrayBufSlice);
      }
    } catch {
      // Fallback
    }

    try {
      if (!this.wrongBuffer) {
        const respWrong = await fetch(this.wrongSoundUrl);
        const arrayBufWrong = await respWrong.arrayBuffer();
        this.wrongBuffer = await this.ctx.decodeAudioData(arrayBufWrong);
      }
    } catch {
      // Fallback
    }

    try {
      if (!this.failBuffer) {
        const respFail = await fetch(this.failSoundUrl);
        const arrayBufFail = await respFail.arrayBuffer();
        this.failBuffer = await this.ctx.decodeAudioData(arrayBufFail);
      }
    } catch {
      // Fallback
    }

    try {
      if (!this.asteroidExplosionBuffer) {
        const respExplosion = await fetch(this.asteroidExplosionSoundUrl);
        const arrayBufExplosion = await respExplosion.arrayBuffer();
        this.asteroidExplosionBuffer = await this.ctx.decodeAudioData(arrayBufExplosion);
      }
    } catch {
      // Fallback
    }

    try {
      if (!this.swagatBuffer) {
        const respSwagat = await fetch(this.swagatSoundUrl);
        const arrayBufSwagat = await respSwagat.arrayBuffer();
        this.swagatBuffer = await this.ctx.decodeAudioData(arrayBufSwagat);
      }
    } catch {
      // Fallback
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('float_sound_muted', this.muted.toString());
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playShoot(theme = 'space') {
    if (this.muted) return;
    this.init();

    // 1. SPACE THEME: Play Sci-Fi Gun Shot MP3
    if (theme === 'space') {
      if (this.ctx && this.spaceShootBuffer) {
        try {
          const source = this.ctx.createBufferSource();
          const gainNode = this.ctx.createGain();
          source.buffer = this.spaceShootBuffer;
          const pitchMod = 0.95 + Math.random() * 0.1;
          source.playbackRate.value = pitchMod;
          gainNode.gain.setValueAtTime(0.48, this.ctx.currentTime);
          source.connect(gainNode);
          gainNode.connect(this.ctx.destination);
          source.start(0);
          return;
        } catch {
          // Fall back to pool
        }
      }

      if (this.spaceShootAudioPool.length > 0) {
        try {
          const audio = this.spaceShootAudioPool[this.spacePoolIndex];
          this.spacePoolIndex = (this.spacePoolIndex + 1) % this.spaceShootAudioPool.length;
          audio.currentTime = 0;
          audio.volume = 0.48;
          const playPromise = audio.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
          return;
        } catch {
          // Fall back
        }
      }
    }

    // 2. SLIMY THEME: Veteran Dwarf Hunter Shotgun Punch + Buckshot
    if (theme === 'slimy' && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);

        const bufferSize = this.ctx.sampleRate * 0.12;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        noise.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
        return;
      } catch {
        // Fall back
      }
    }

    // 3. DYSTOPIAN THEME: High-Voltage Cyber Laser Railgun
    if (theme === 'dystopian' && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
        return;
      } catch {
        // Fall back
      }
    }

    // 4. BEACH THEME: Comical Watermelon Cannon Launcher Thud
    if (theme === 'beach' && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(450, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);
        return;
      } catch {
        // Fall back
      }
    }

    // 5. SALMAN KHAN THEME: Muscle Car Throttle Rev & Tire Screech
    if (theme === 'salman' && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        // Engine Throttle Rev
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);

        // Tire Screech Squeal
        const screechOsc = this.ctx.createOscillator();
        const screechGain = this.ctx.createGain();
        screechOsc.type = 'triangle';
        screechOsc.frequency.setValueAtTime(1600, now);
        screechOsc.frequency.linearRampToValueAtTime(2100, now + 0.08);
        screechOsc.frequency.exponentialRampToValueAtTime(900, now + 0.18);
        screechGain.gain.setValueAtTime(0.18, now);
        screechGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        screechOsc.connect(screechGain);
        screechGain.connect(this.ctx.destination);
        screechOsc.start(now);
        screechOsc.stop(now + 0.19);
        return;
      } catch {
        // Fall back
      }
    }

    // Generic Synth Fallback
    if (this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } catch {
        // Ignore
      }
    }
  }

  playPop(combo = 1, theme = 'space') {
    if (this.muted) return;
    this.init();

    // 1. BEACH THEME: Play Steel Blade Slice SFX on Beach Ball Pop
    if (theme === 'beach') {
      if (this.ctx && this.beachSliceBuffer) {
        try {
          const source = this.ctx.createBufferSource();
          const gainNode = this.ctx.createGain();
          source.buffer = this.beachSliceBuffer;
          const pitchMod = 0.95 + Math.min(0.4, (combo - 1) * 0.06);
          source.playbackRate.value = pitchMod;
          gainNode.gain.setValueAtTime(0.55, this.ctx.currentTime);
          source.connect(gainNode);
          gainNode.connect(this.ctx.destination);
          source.start(0);
          return;
        } catch {
          // Fall back to pool
        }
      }

      if (this.beachSliceAudioPool.length > 0) {
        try {
          const audio = this.beachSliceAudioPool[this.beachPoolIndex];
          this.beachPoolIndex = (this.beachPoolIndex + 1) % this.beachSliceAudioPool.length;
          audio.currentTime = 0;
          audio.volume = 0.55;
          const playPromise = audio.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
          return;
        } catch {
          // Fall back to synth
        }
      }
    }

    // 2. SPACE THEME: Asteroid getting destroyed (epic cinematic explosion)
    if (theme === 'space') {
      if (this.ctx && this.asteroidExplosionBuffer) {
        try {
          const source = this.ctx.createBufferSource();
          const gainNode = this.ctx.createGain();
          source.buffer = this.asteroidExplosionBuffer;
          // Pitch variation to make explosions sound unique
          const pitchMod = 0.9 + Math.random() * 0.2;
          source.playbackRate.value = pitchMod;
          gainNode.gain.setValueAtTime(0.55, this.ctx.currentTime);
          source.connect(gainNode);
          gainNode.connect(this.ctx.destination);
          source.start(0);
          return;
        } catch {
          // Fall back to pool
        }
      }

      if (this.asteroidExplosionAudioPool && this.asteroidExplosionAudioPool.length > 0) {
        try {
          const audio = this.asteroidExplosionAudioPool[this.explosionPoolIndex];
          this.explosionPoolIndex = (this.explosionPoolIndex + 1) % this.asteroidExplosionAudioPool.length;
          audio.currentTime = 0;
          audio.volume = 0.55;
          const playPromise = audio.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
          return;
        } catch {
          // Fall back to synth
        }
      }

      // Synth fallback (the old crumbling noise)
      if (this.ctx) {
        try {
          const now = this.ctx.currentTime;
          const duration = 0.45;

          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130, now);
          osc.frequency.exponentialRampToValueAtTime(25, now + duration);

          gain.gain.setValueAtTime(0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + duration + 0.05);

          const bufferSize = this.ctx.sampleRate * duration;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const output = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(320, now);
          filter.Q.setValueAtTime(4.0, now);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.35, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration - 0.05);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(this.ctx.destination);

          noise.start(now);
          noise.stop(now + duration);
          return;
        } catch {
          // Fall back
        }
      }
    }

    // 3. DYSTOPIAN THEME: Zombie dying grrr vocal growl
    if (theme === 'dystopian' && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const duration = 0.55;

        // Low growl oscillator 1
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(85, now);
        osc1.frequency.linearRampToValueAtTime(55, now + duration);

        // Low growl oscillator 2 (detuned)
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(88, now);
        osc2.frequency.linearRampToValueAtTime(58, now + duration);

        // Amplitude modulation for gurgling vibration
        const modulator = this.ctx.createOscillator();
        modulator.frequency.setValueAtTime(24, now);

        const modGain = this.ctx.createGain();
        modGain.gain.setValueAtTime(0.45, now);

        const growlGain = this.ctx.createGain();
        growlGain.gain.setValueAtTime(0.28, now);

        modulator.connect(modGain);
        modGain.connect(growlGain.gain);

        osc1.connect(growlGain);
        osc2.connect(growlGain);

        // Scratchy throat noise
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(280, now);
        filter.Q.setValueAtTime(2.2, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        noise.connect(filter);
        filter.connect(noiseGain);

        // Main growl volume envelope
        const mainGain = this.ctx.createGain();
        mainGain.gain.setValueAtTime(0.01, now);
        mainGain.gain.linearRampToValueAtTime(0.4, now + 0.08); // attack
        mainGain.gain.exponentialRampToValueAtTime(0.01, now + duration); // decay

        growlGain.connect(mainGain);
        noiseGain.connect(mainGain);
        mainGain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        modulator.start(now);
        noise.start(now);

        osc1.stop(now + duration + 0.05);
        osc2.stop(now + duration + 0.05);
        modulator.stop(now + duration + 0.05);
        noise.stop(now + duration + 0.05);
        return;
      } catch {
        // Fall back
      }
    }

    // 4. SALMAN KHAN THEME: Car Horn & Heavy Impact Boom
    if (theme === 'salman' && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        // Car Horn beep
        const horn = this.ctx.createOscillator();
        const hornGain = this.ctx.createGain();
        horn.type = 'triangle';
        const hornFreq = 420 + Math.min(300, (combo - 1) * 50);
        horn.frequency.setValueAtTime(hornFreq, now);
        hornGain.gain.setValueAtTime(0.28, now);
        hornGain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        horn.connect(hornGain);
        hornGain.connect(this.ctx.destination);
        horn.start(now);
        horn.stop(now + 0.17);

        // Crash Bass Thud
        const thud = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(160, now);
        thud.frequency.exponentialRampToValueAtTime(45, now + 0.15);
        thudGain.gain.setValueAtTime(0.4, now);
        thudGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        thud.connect(thudGain);
        thudGain.connect(this.ctx.destination);
        thud.start(now);
        thud.stop(now + 0.16);
        return;
      } catch {
        // Fall back
      }
    }

    // 5. Default Juicy Pop Synth (with combo pitch escalation)
    if (this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const baseFreq = 400 + Math.min(600, combo * 70);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * 1.5, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.1);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      } catch {
        // Audio fallback
      }
    }
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    
    if (this.ctx && this.wrongBuffer) {
      try {
        const source = this.ctx.createBufferSource();
        const gainNode = this.ctx.createGain();
        source.buffer = this.wrongBuffer;
        gainNode.gain.setValueAtTime(0.5, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        return;
      } catch {
        // Fall back to pool
      }
    }

    if (this.wrongAudioPool && this.wrongAudioPool.length > 0) {
      try {
        const audio = this.wrongAudioPool[this.wrongPoolIndex];
        this.wrongPoolIndex = (this.wrongPoolIndex + 1) % this.wrongAudioPool.length;
        audio.currentTime = 0;
        audio.volume = 0.5;
        const playPromise = audio.play();
        if (playPromise !== undefined) playPromise.catch(() => {});
        return;
      } catch {
        // Fall back
      }
    }

    if (this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';

        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
      } catch {
        // Audio fallback
      }
    }
  }

  playComboChord(combo) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
      const freq = notes[Math.min(combo - 1, notes.length - 1)] || 523.25;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';

      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Audio fallback
    }
  }

  playFever() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';

      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch {
      // Audio fallback
    }
  }

  playCountdown(isGo = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const freq = isGo ? 880 : 440;
      const duration = isGo ? 0.35 : 0.15;

      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // Audio fallback
    }
  }

  playWinFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + i * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.32);
      });
    } catch {
      // Audio fallback
    }
  }

  playGameOver() {
    if (this.muted) return;
    this.init();

    if (this.ctx && this.failBuffer) {
      try {
        const source = this.ctx.createBufferSource();
        const gainNode = this.ctx.createGain();
        source.buffer = this.failBuffer;
        gainNode.gain.setValueAtTime(0.65, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        return;
      } catch {
        // Fall back to pool
      }
    }

    if (this.failAudioPool && this.failAudioPool.length > 0) {
      try {
        const audio = this.failAudioPool[this.failPoolIndex];
        this.failPoolIndex = (this.failPoolIndex + 1) % this.failAudioPool.length;
        audio.currentTime = 0;
        audio.volume = 0.65;
        const playPromise = audio.play();
        if (playPromise !== undefined) playPromise.catch(() => {});
        return;
      } catch {
        // Fall back to synth
      }
    }

    if (this.ctx) {
      try {
        const notes = [440, 392, 349.23, 261.63];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime + i * 0.12;

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.26);
        });
      } catch {
        // Audio fallback
      }
    }
  }

  playSwagat() {
    if (this.muted) return;
    this.init();

    if (this.ctx && this.swagatBuffer) {
      try {
        const source = this.ctx.createBufferSource();
        const gainNode = this.ctx.createGain();
        source.buffer = this.swagatBuffer;
        gainNode.gain.setValueAtTime(0.65, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        return;
      } catch {
        // Fall back
      }
    }

    if (this.swagatAudio) {
      try {
        this.swagatAudio.currentTime = 0;
        this.swagatAudio.volume = 0.65;
        const playPromise = this.swagatAudio.play();
        if (playPromise !== undefined) playPromise.catch(() => {});
      } catch {
        // Fall back
      }
    }
  }
}

export const sound = new SoundManager();
