/**
 * Pop Up: Balloon Blitz — Pure Vanilla JavaScript Game Engine
 * 100% Lightweight, High Performance, Zero Framework Dependencies
 */

// ==========================================
// 1. CONSTANTS & DATA CONFIGURATION
// ==========================================

const ALL_COLORS = ['red', 'cyan', 'purple', 'gold', 'green', 'pink', 'yellow', 'blue'];

const colorMap = {
  red: '#e63946',
  cyan: '#00b4d8',
  purple: '#9d4edd',
  gold: '#ffb703',
  green: '#38b000',
  pink: '#ff66c4',
  yellow: '#d4e157',
  blue: '#48cae4',
};

const targetColorHex = {
  red: '#ff3366',
  cyan: '#00f0ff',
  purple: '#c77dff',
  gold: '#ffb703',
  green: '#39ff14',
  pink: '#ff66c4',
  yellow: '#ffea00',
  blue: '#0088ff',
};

const LEVELS = [
  // 1-3: Learn Colors
  {
    level: 1,
    title: 'Morning Breeze',
    mechanic: 'Learn Colors',
    themeMechanics: { space: 'COSMIC INTRO', beach: 'CALM BREEZE', dystopian: 'SYSTEM BOOT', slimy: 'OOZE DRIP', salman: 'SAFARI TRAIL' },
    subtitle: 'Slow drift & large targets',
    targetPopsNeeded: 3,
    speedMultiplier: 0.9,
    balloonCount: 12,
    colors: ['red', 'cyan', 'gold'],
    bonusPoints: 50,
    movementStyle: 'linear',
    balloonScaleMod: 1.15,
  },
  {
    level: 2,
    title: 'Gentle Drift',
    mechanic: 'Color Intro',
    themeMechanics: { space: 'ORBIT DRIFT', beach: 'TIDE DRIFT', dystopian: 'SMOG DRIFT', slimy: 'SLIME SLIDE', salman: 'DESERT DRIFT' },
    subtitle: '4 colors in the sky',
    targetPopsNeeded: 4,
    speedMultiplier: 1.0,
    balloonCount: 13,
    colors: ['red', 'cyan', 'gold', 'purple'],
    bonusPoints: 75,
    movementStyle: 'linear',
    balloonScaleMod: 1.1,
  },
  {
    level: 3,
    title: 'Skyward Pulse',
    mechanic: 'Steady Float',
    themeMechanics: { space: 'STAR PULSE', beach: 'OCEAN PULSE', dystopian: 'SYNTH PULSE', slimy: 'GOOP PULSE', salman: 'HIGHWAY PULSE' },
    subtitle: 'Smooth winds rising',
    targetPopsNeeded: 4,
    speedMultiplier: 1.1,
    balloonCount: 14,
    colors: ['red', 'cyan', 'gold', 'purple', 'green'],
    bonusPoints: 100,
    movementStyle: 'linear',
    balloonScaleMod: 1.05,
  },
  // 4-6: Faster Balloons
  {
    level: 4,
    title: 'Windstream',
    mechanic: 'Faster Balloons',
    themeMechanics: { space: 'SOLAR WIND', beach: 'COASTAL GUST', dystopian: 'TOXIC CURRENT', slimy: 'MUDDY CURRENT', salman: 'HORSEPOWER GUST' },
    subtitle: 'Speed picked up!',
    targetPopsNeeded: 5,
    speedMultiplier: 1.3,
    balloonCount: 15,
    colors: ['red', 'cyan', 'gold', 'purple', 'green', 'pink'],
    bonusPoints: 125,
    movementStyle: 'wave',
    balloonScaleMod: 1.0,
  },
  {
    level: 5,
    title: 'Cloud Mirage',
    mechanic: 'High Gust',
    themeMechanics: { space: 'SOLAR FLARE', beach: 'TROPICAL SWELL', dystopian: 'ACID RAIN', slimy: 'RADIOACTIVE GUST', salman: 'BHAI’S SWELL' },
    subtitle: '7 colors floating briskly',
    targetPopsNeeded: 5,
    speedMultiplier: 1.45,
    balloonCount: 16,
    colors: ['red', 'cyan', 'gold', 'purple', 'green', 'pink', 'yellow'],
    bonusPoints: 150,
    movementStyle: 'wave',
    balloonScaleMod: 0.98,
  },
  {
    level: 6,
    title: 'Neon Twilight',
    mechanic: 'Full Spectrum',
    themeMechanics: { space: 'ASTEROID DUST', beach: 'CORAL SHIMMER', dystopian: 'NEON OVERLOAD', slimy: 'BIO-HAZARD', salman: 'LAND CRUISER RUSH' },
    subtitle: 'All 8 colors in flight',
    targetPopsNeeded: 6,
    speedMultiplier: 1.6,
    balloonCount: 16,
    colors: ALL_COLORS,
    bonusPoints: 175,
    movementStyle: 'wave',
    balloonScaleMod: 0.95,
  },
  // 7-9: Smaller Targets
  {
    level: 7,
    title: 'Micro Drift',
    mechanic: 'Smaller Targets',
    themeMechanics: { space: 'MICRO GRAVITY', beach: 'SAND PINCH', dystopian: 'PRECISION LOCK', slimy: 'TIGHT SPLATTER', salman: 'PRECISION DRIFT' },
    subtitle: 'Precision aiming needed',
    targetPopsNeeded: 6,
    speedMultiplier: 1.7,
    balloonCount: 17,
    colors: ALL_COLORS,
    bonusPoints: 200,
    movementStyle: 'zigzag',
    balloonScaleMod: 0.85,
  },
  {
    level: 8,
    title: 'Cyclone Horizon',
    mechanic: 'Zig-Zag Sway',
    themeMechanics: { space: 'PULSAR SWAY', beach: 'RIPTIDE SWAY', dystopian: 'GRID GLITCH', slimy: 'MUCK WOBBLE', salman: 'DUNES ZIG-ZAG' },
    subtitle: 'Wavering wind currents',
    targetPopsNeeded: 7,
    speedMultiplier: 1.8,
    balloonCount: 17,
    colors: ALL_COLORS,
    bonusPoints: 225,
    movementStyle: 'zigzag',
    balloonScaleMod: 0.82,
  },
  {
    level: 9,
    title: 'Gravity Shift',
    mechanic: 'Mini Swarm',
    themeMechanics: { space: 'GRAVITY SHIFT', beach: 'HIGH TIDE', dystopian: 'SURVEILLANCE', slimy: 'SLUDGE TIDE', salman: 'MIDNIGHT SAFARI' },
    subtitle: 'Tight targets with rapid bounce',
    targetPopsNeeded: 7,
    speedMultiplier: 1.95,
    balloonCount: 18,
    colors: ALL_COLORS,
    bonusPoints: 250,
    movementStyle: 'zigzag',
    balloonScaleMod: 0.8,
  },
  // 10-12: Decoy Balloons
  {
    level: 10,
    title: 'Decoy Shimmer',
    mechanic: 'Decoy Clones',
    themeMechanics: { space: 'NEBULA CLONES', beach: 'MIRAGE WAVES', dystopian: 'HOLOGRAM DECOYS', slimy: 'MUTANT CLONES', salman: 'DESERT MIRAGES' },
    subtitle: 'Look closely before shooting!',
    targetPopsNeeded: 8,
    speedMultiplier: 2.1,
    balloonCount: 18,
    colors: ALL_COLORS,
    bonusPoints: 300,
    movementStyle: 'crosswind',
    balloonScaleMod: 0.85,
  },
  {
    level: 11,
    title: 'Stratosphere Drift',
    mechanic: 'Crosswinds',
    themeMechanics: { space: 'ION STREAM', beach: 'TRADE WINDS', dystopian: 'CYBER CROSSWIND', slimy: 'TOXIC VAPORS', salman: 'DESERT CROSSWIND' },
    subtitle: 'Horizontal air currents',
    targetPopsNeeded: 8,
    speedMultiplier: 2.2,
    balloonCount: 19,
    colors: ALL_COLORS,
    bonusPoints: 350,
    movementStyle: 'crosswind',
    balloonScaleMod: 0.82,
  },
  {
    level: 12,
    title: 'Solar Glide',
    mechanic: 'High Altitude',
    themeMechanics: { space: 'DEEP ORBIT', beach: 'LAGOON RUSH', dystopian: 'MEGACITY SKY', slimy: 'CAVERN SWARM', salman: 'JODHPUR SKYLINE' },
    subtitle: 'Dense balloon fields',
    targetPopsNeeded: 9,
    speedMultiplier: 2.3,
    balloonCount: 19,
    colors: ALL_COLORS,
    bonusPoints: 400,
    movementStyle: 'crosswind',
    balloonScaleMod: 0.8,
  },
  // 13-15: Rapid Target Shifts
  {
    level: 13,
    title: 'Cosmic Breeze',
    mechanic: 'Rapid Color Shifts',
    themeMechanics: { space: 'WARP CYCLE', beach: 'CYCLONE CYCLE', dystopian: 'DATA CORRUPTION', slimy: 'SPORE SHIFT', salman: 'TURBO DRIFT' },
    subtitle: 'Targets cycle swiftly',
    targetPopsNeeded: 9,
    speedMultiplier: 2.4,
    balloonCount: 20,
    colors: ALL_COLORS,
    bonusPoints: 450,
    movementStyle: 'wave',
    balloonScaleMod: 0.8,
  },
  {
    level: 14,
    title: 'Starlight Rush',
    mechanic: 'Dual Trajectory',
    themeMechanics: { space: 'STAR CLUSTER', beach: 'REEF SPLIT', dystopian: 'FIREWALL RUSH', slimy: 'SLIME GEYSER', salman: 'TWILIGHT PURSUIT' },
    subtitle: 'Intersecting drift paths',
    targetPopsNeeded: 10,
    speedMultiplier: 2.5,
    balloonCount: 20,
    colors: ALL_COLORS,
    bonusPoints: 500,
    movementStyle: 'bounce',
    balloonScaleMod: 0.78,
  },
  {
    level: 15,
    title: 'Quantum Drift',
    mechanic: 'Surge Waves',
    themeMechanics: { space: 'QUANTUM SURGE', beach: 'TSUNAMI SURGE', dystopian: 'OVERCLOCK SURGE', slimy: 'ACID SURGE', salman: 'NITRO SURGE' },
    subtitle: 'Pulsing acceleration',
    targetPopsNeeded: 10,
    speedMultiplier: 2.6,
    balloonCount: 21,
    colors: ALL_COLORS,
    bonusPoints: 550,
    movementStyle: 'bounce',
    balloonScaleMod: 0.78,
  },
  // 16-18: Time Pressure & Hyper Drift
  {
    level: 16,
    title: 'Nebula Vortex',
    mechanic: 'Hyper Velocity',
    themeMechanics: { space: 'HYPER JUMP', beach: 'HURRICANE FORCE', dystopian: 'HYPER MATRIX', slimy: 'SLIME ERUPTION', salman: 'HIGHWAY SPRINT' },
    subtitle: 'Fast reflex challenge',
    targetPopsNeeded: 11,
    speedMultiplier: 2.7,
    balloonCount: 21,
    colors: ALL_COLORS,
    bonusPoints: 600,
    movementStyle: 'zigzag',
    balloonScaleMod: 0.75,
  },
  {
    level: 17,
    title: 'Hyper Velocity',
    mechanic: 'Turbulent Surge',
    themeMechanics: { space: 'EVENT HORIZON', beach: 'PIRATE MAELSTROM', dystopian: 'NEURAL STORM', slimy: 'BIO-MELTDOWN', salman: 'DESERT DUST STORM' },
    subtitle: 'Unpredictable wind shear',
    targetPopsNeeded: 11,
    speedMultiplier: 2.8,
    balloonCount: 22,
    colors: ALL_COLORS,
    bonusPoints: 650,
    movementStyle: 'crosswind',
    balloonScaleMod: 0.75,
  },
  {
    level: 18,
    title: 'Warp Turbulence',
    mechanic: 'Time Rush',
    themeMechanics: { space: 'WARP SPEED', beach: 'GALE TEMPEST', dystopian: 'SYS OVERRIDE', slimy: 'HYPER TOXIC', salman: 'SPEED OVERLOAD' },
    subtitle: 'Lightning fast floating',
    targetPopsNeeded: 12,
    speedMultiplier: 2.9,
    balloonCount: 22,
    colors: ALL_COLORS,
    bonusPoints: 700,
    movementStyle: 'bounce',
    balloonScaleMod: 0.75,
  },
  // 19: Chaos Round
  {
    level: 19,
    title: 'Apex Chaos',
    mechanic: 'Chaos Round',
    themeMechanics: { space: 'SUPERNOVA', beach: 'KRAKEN CHAOS', dystopian: 'CYBER APOCALYPSE', slimy: 'SLUDGEMAGEDDON', salman: 'BHAI’S APEX CHAOS' },
    subtitle: 'Full chaotic storm!',
    targetPopsNeeded: 13,
    speedMultiplier: 3.1,
    balloonCount: 23,
    colors: ALL_COLORS,
    bonusPoints: 850,
    movementStyle: 'bounce',
    balloonScaleMod: 0.72,
  },
  // 20: Grand Master Boss Wave
  {
    level: 20,
    title: 'Supernova Grandmaster',
    mechanic: 'Final Boss Wave',
    themeMechanics: { space: 'BLACK HOLE CORE', beach: 'PIRATE KING’S ROAR', dystopian: 'AI TITAN REIGN', slimy: 'TITAN SLIME OVERLORD', salman: 'BLOCKBUSTER TITAN BOSS' },
    subtitle: 'The ultimate Float challenge!',
    targetPopsNeeded: 15,
    speedMultiplier: 3.3,
    balloonCount: 24,
    colors: ALL_COLORS,
    bonusPoints: 1200,
    movementStyle: 'bounce',
    balloonScaleMod: 0.7,
  },
];

function getLevelMechanic(levelNumberOrConfig, theme = 'space') {
  let config = levelNumberOrConfig;
  if (typeof levelNumberOrConfig === 'number') {
    const idx = Math.min(Math.max(0, levelNumberOrConfig - 1), LEVELS.length - 1);
    config = LEVELS[idx];
  }
  if (!config) return 'STEADY FLOAT';
  if (config.themeMechanics && config.themeMechanics[theme]) {
    return config.themeMechanics[theme];
  }
  return config.mechanic || config.title || 'STEADY FLOAT';
}

function generateBalloonsForLevel(levelConfig) {
  const { 
    balloonCount = 14, 
    speedMultiplier = 1.0, 
    colors = ['red', 'cyan', 'gold'],
    movementStyle = 'linear',
    balloonScaleMod = 1.0 
  } = levelConfig;

  const balloons = [];
  const spacing = 94 / balloonCount;

  for (let i = 0; i < balloonCount; i++) {
    const leftPct = Math.max(3, Math.min(93, Math.round(i * spacing + 3 + (Math.random() * 3 - 1.5))));
    const baseDuration = 8.5 + (i % 5) * 1.6 + Math.random() * 1.2;
    const adjustedDuration = Math.max(2.8, baseDuration / speedMultiplier);
    const delay = -(Math.random() * adjustedDuration).toFixed(1);
    const color = colors[i % colors.length];
    const baseScale = (0.8 + (i % 4) * 0.1) * balloonScaleMod;
    const opacity = 0.88 + Math.random() * 0.12;
    const swayDur = Math.max(1.8, (3.2 + (i % 4) * 0.6) / Math.sqrt(speedMultiplier));

    balloons.push({
      id: i + 1,
      left: `${leftPct}%`,
      floatDuration: `${adjustedDuration.toFixed(1)}s`,
      floatDelay: `${delay}s`,
      opacity: Number(opacity.toFixed(2)),
      blur: "0px",
      z: (i % 4) + 1,
      scale: Number(baseScale.toFixed(2)),
      color,
      movementStyle,
      swayDuration: `${swayDur.toFixed(1)}s`,
      swayDelay: `-${(Math.random() * swayDur).toFixed(1)}s`,
      isPopping: false,
    });
  }

  return balloons;
}

// ==========================================
// 2. SOUND MANAGER (WEB AUDIO + POOLS)
// ==========================================

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

    this.spacePoolIndex = 0;
    this.beachPoolIndex = 0;
    this.wrongPoolIndex = 0;
    this.failPoolIndex = 0;
    this.explosionPoolIndex = 0;
    this.poolSize = 4;

    this.spaceSoundUrl = './freesound_community-sci-fi-gun-shot-x6-14447 (2).mp3';
    this.beachSliceUrl = './floraphonic-steel-blade-slice-2-188214.mp3';
    this.wrongSoundUrl = './freesound_community-wrong-47985.mp3';
    this.failSoundUrl = './u_8g40a9z0la-fail-234710.mp3';
    this.asteroidExplosionSoundUrl = './universfield_epic_cinematic_explosion_454857_V1.mp3';
    this.swagatSoundUrl = './audio_05861b0a_1786957873110.mp3';

    if (typeof window !== 'undefined') {
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
        audioShoot.volume = 0.48;
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
    } catch (e) {}
  }

  async init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.loadAudioBuffers();
        this.initAudioPools();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  async loadAudioBuffers() {
    if (!this.ctx) return;
    const fetchBuf = async (url) => {
      try {
        const res = await fetch(url);
        const ab = await res.arrayBuffer();
        return await this.ctx.decodeAudioData(ab);
      } catch (e) {
        return null;
      }
    };

    this.spaceShootBuffer = await fetchBuf(this.spaceSoundUrl);
    this.beachSliceBuffer = await fetchBuf(this.beachSliceUrl);
    this.wrongBuffer = await fetchBuf(this.wrongSoundUrl);
    this.failBuffer = await fetchBuf(this.failSoundUrl);
    this.asteroidExplosionBuffer = await fetchBuf(this.asteroidExplosionSoundUrl);
    this.swagatBuffer = await fetchBuf(this.swagatSoundUrl);
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('float_sound_muted', this.muted.toString());
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playBuffer(buffer, volume = 0.5, pitchMod = 1.0) {
    if (this.muted || !this.ctx || !buffer) return false;
    try {
      const src = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      src.buffer = buffer;
      src.playbackRate.value = pitchMod;
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      src.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(0);
      return true;
    } catch {
      return false;
    }
  }

  playShoot(theme = 'space') {
    if (this.muted) return;
    this.init();

    if (theme === 'space' && this.playBuffer(this.spaceShootBuffer, 0.48, 0.95 + Math.random() * 0.1)) return;
    if (theme === 'beach' && this.playBuffer(this.beachSliceBuffer, 0.55, 0.95 + Math.random() * 0.1)) return;

    if (this.ctx) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = theme === 'dystopian' ? 'sawtooth' : theme === 'slimy' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(theme === 'dystopian' ? 1200 : theme === 'slimy' ? 160 : 700, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  }

  playPop(combo = 1, theme = 'space') {
    if (this.muted) return;
    this.init();

    if (theme === 'space' && this.playBuffer(this.asteroidExplosionBuffer, 0.55, 1.0 + combo * 0.04)) return;

    if (this.ctx) {
      const now = this.ctx.currentTime;
      const baseFreq = 420 + Math.min(600, combo * 45);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    if (this.playBuffer(this.wrongBuffer, 0.5)) return;

    if (this.ctx) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  }

  playGameOver() {
    if (this.muted) return;
    this.init();
    if (this.playBuffer(this.failBuffer, 0.65)) return;
  }

  playWinFanfare() {
    if (this.muted || !this.ctx) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime + idx * 0.1;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.35);
    });
  }

  playFever() {
    if (this.muted || !this.ctx) return;
    this.init();
    const chords = [440, 554, 659, 880, 1108];
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.4);
    });
  }

  playComboChord(combo) {
    if (this.muted || !this.ctx) return;
    const base = 350 + (combo % 8) * 50;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(base, now);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playCountdown(isGo = false) {
    if (this.muted || !this.ctx) return;
    const freq = isGo ? 880 : 440;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = isGo ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isGo ? 0.35 : 0.18));
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + (isGo ? 0.35 : 0.18));
  }

  playSwagat() {
    if (this.muted) return;
    this.init();
    this.playBuffer(this.swagatBuffer, 0.7);
  }
}

const sound = new SoundManager();

// ==========================================
// 3. PURE VANILLA GAME ENGINE CLASS
// ==========================================

class BalloonGameEngine {
  constructor() {
    this.HIGH_SCORE_KEY = 'float_high_score';
    this.SCOREBOARD_KEY = 'float_scoreboard';
    this.THEME_KEY = 'float_game_theme';

    this.gameState = 'start'; // 'start' | 'countdown' | 'playing' | 'paused' | 'level_cleared' | 'game_over' | 'victory'
    this.level = 1;
    this.theme = localStorage.getItem(this.THEME_KEY) || 'space';
    this.playerName = localStorage.getItem('float_player_name') || 'Player';
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem(this.HIGH_SCORE_KEY) || '0', 10);
    this.strikes = 0;
    this.levelProgress = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.isFeverMode = false;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.hunterMood = 'idle';

    this.balloons = [];
    this.cannonballs = [];
    this.particles = [];
    this.popTexts = [];
    this.poopedBalls = [];
    this.targetColor = 'red';

    this.scoreboard = this.loadScoreboard();
    this.aimPos = { x: window.innerWidth / 2, y: window.innerHeight - 200, angle: 0 };
    this.isAiming = false;

    this.comboTimer = null;
    this.hunterMoodTimer = null;
    this.countdownTimer = null;
    this.resumeCountdownTimer = null;

    this.initDOMReferences();
    this.bindEvents();
    this.applyTheme(this.theme);
    this.startRenderLoop();
  }

  loadScoreboard() {
    try {
      const saved = localStorage.getItem(this.SCOREBOARD_KEY);
      return saved ? JSON.parse(saved) : [
        { id: 'sb-1', name: 'SkyAce', score: 1450, level: 18, date: '2026-08-10' },
        { id: 'sb-2', name: 'BreezeHunter', score: 980, level: 12, date: '2026-08-12' },
        { id: 'sb-3', name: 'CloudPopper', score: 620, level: 8, date: '2026-08-13' },
        { id: 'sb-4', name: 'Zephyr', score: 350, level: 5, date: '2026-08-14' },
      ];
    } catch {
      return [];
    }
  }

  saveScoreboard() {
    try {
      localStorage.setItem(this.SCOREBOARD_KEY, JSON.stringify(this.scoreboard));
    } catch {}
  }

  initDOMReferences() {
    this.dom = {
      appRoot: document.getElementById('game-app-root'),
      themeBg: document.getElementById('game-theme-bg'),
      balloonLayer: document.getElementById('balloon-stream-layer'),
      effectsLayer: document.getElementById('effects-layer'),
      projectilesLayer: document.getElementById('projectiles-layer'),
      cannonTrajectorySvg: document.getElementById('cannon-trajectory-svg'),
      aimReticleGroup: document.getElementById('aim-reticle-group'),
      shooterWrapper: document.getElementById('shooter-wrapper'),

      // HUD elements
      hud: document.getElementById('game-hud'),
      levelNumberText: document.getElementById('hud-level-number'),
      levelMechanicTag: document.getElementById('hud-level-mechanic'),
      levelTrackProgress: document.getElementById('hud-level-track-progress'),
      levelTrackPin: document.getElementById('hud-level-track-pin'),
      objectiveCount: document.getElementById('hud-objective-count'),
      progressBarFill: document.getElementById('hud-progress-bar-fill'),
      targetSpotlightCard: document.getElementById('hud-target-spotlight-card'),
      targetGiantBadge: document.getElementById('hud-target-giant-badge'),
      targetGiantText: document.getElementById('hud-target-giant-text'),
      targetHintSub: document.getElementById('hud-target-hint-sub'),
      comboFloatPill: document.getElementById('hud-combo-float-pill'),
      comboInnerContent: document.getElementById('hud-combo-inner-content'),
      scoreDisplay: document.getElementById('hud-score-display'),
      highScoreDisplay: document.getElementById('hud-high-score-display'),
      livesBarWrapper: document.getElementById('hud-lives-bar'),
      heartsContainer: document.getElementById('hud-hearts-container'),
      btnMute: document.getElementById('hud-btn-mute'),
      btnPause: document.getElementById('hud-btn-pause'),

      // Modals
      modalContainer: document.getElementById('modal-container'),
      startModal: document.getElementById('modal-start'),
      themeModal: document.getElementById('modal-theme'),
      levelCompleteModal: document.getElementById('modal-level-complete'),
      gameOverModal: document.getElementById('modal-game-over'),
      victoryModal: document.getElementById('modal-victory'),
      scoreboardModal: document.getElementById('modal-scoreboard'),
      countdownOverlay: document.getElementById('countdown-overlay'),
      countdownNumber: document.getElementById('countdown-number'),
      resumeCountdownOverlay: document.getElementById('resume-countdown-overlay'),
      resumeCountdownNumber: document.getElementById('resume-countdown-number'),
    };
  }

  bindEvents() {
    // Pointer / Touch Aim & Firing
    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.updateAim(clientX, clientY);
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // Firing Cannon on Click/Tap on Playfield
    this.dom.appRoot.addEventListener('pointerdown', (e) => {
      // Ignore clicks on HUD buttons or modals
      if (e.target.closest('.game-hud') || e.target.closest('.modal-card') || e.target.closest('#krazio-floating-back')) {
        return;
      }
      if (this.gameState === 'playing') {
        this.fireCannonball(e.clientX, e.clientY);
      }
    });

    // Keyboard Hotkeys
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        if (this.gameState === 'playing') {
          this.pauseGame();
        } else if (this.gameState === 'paused') {
          this.resumeGame();
        }
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'KRAZY_ESC', gameId: 'popup-game', isPaused: this.gameState === 'playing' }, '*');
        }
      } else if (e.key === 'p' || e.key === 'P') {
        if (this.gameState === 'playing') this.pauseGame();
        else if (this.gameState === 'paused') this.resumeGame();
      }
    });

    // HUD Buttons
    if (this.dom.btnMute) {
      this.dom.btnMute.addEventListener('click', () => this.toggleSound());
    }
    if (this.dom.btnPause) {
      this.dom.btnPause.addEventListener('click', () => this.pauseGame());
    }

    // Modal & Quick Actions Delegations
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.getAttribute('data-action');

      switch (action) {
        case 'start-game':
          const nameInput = document.getElementById('input-player-name');
          if (nameInput) {
            this.playerName = nameInput.value.trim() || 'Player';
            localStorage.setItem('float_player_name', this.playerName);
          }
          this.startGame();
          break;
        case 'open-themes':
          this.openThemeSelector();
          break;
        case 'open-scoreboard':
          this.openScoreboard();
          break;
        case 'show-how-to-play':
          document.getElementById('start-main-group').classList.add('hidden');
          document.getElementById('start-how-to-card').classList.remove('hidden');
          break;
        case 'hide-how-to-play':
          document.getElementById('start-how-to-card').classList.add('hidden');
          document.getElementById('start-main-group').classList.remove('hidden');
          break;
        case 'select-theme':
          const themeId = target.getAttribute('data-theme');
          if (themeId) this.setTheme(themeId);
          this.closeModals();
          break;
        case 'close-theme-modal':
          this.closeModals();
          break;
        case 'close-scoreboard':
          this.closeModals();
          break;
        case 'clear-scoreboard':
          this.clearScoreboard();
          break;
        case 'next-level':
          this.nextLevel();
          break;
        case 'retry-level':
          this.retryLevel();
          break;
        case 'restart-game':
          this.restartGame();
          break;
        case 'resume-game':
          this.resumeGame();
          break;
        case 'back-to-menu':
          this.returnToMenu();
          break;
      }
    });

    // Listen for Arcade Portal postMessages
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'KRAZY_ESC_PAUSE') {
        if (this.gameState === 'playing') this.pauseGame();
        else if (this.gameState === 'paused') this.resumeGame();
      }
    });
  }

  // ==========================================
  // 4. THEME & VISUAL ENVIRONMENT
  // ==========================================

  applyTheme(theme) {
    this.theme = theme;
    localStorage.setItem(this.THEME_KEY, theme);

    const startTag = document.getElementById('start-theme-tag');
    if (startTag) startTag.textContent = theme.toUpperCase();

    if (this.dom.themeBg) {
      this.dom.themeBg.className = `game-theme-background theme-${theme} ${this.isFeverMode ? 'fever-active' : ''}`;
      
      let html = '';
      if (theme === 'space') {
        html = `
          <div class="nebula-layer"></div>
          <div class="stars-layer-1"></div>
          <div class="stars-layer-2"></div>
          <div class="shooting-star"></div>
        `;
      } else if (theme === 'beach') {
        html = `
          <div class="beach-environment">
            <div class="beach-art-backdrop"></div>
            <div class="beach-sun-gleam"></div>
            <div class="beach-cloud-layer"></div>
            <div class="beach-water-shimmer"></div>
            <div class="beach-sparkles-layer">
              <span class="b-sparkle sp1"></span><span class="b-sparkle sp2"></span>
              <span class="b-sparkle sp3"></span><span class="b-sparkle sp4"></span>
              <span class="b-sparkle sp5"></span><span class="b-sparkle sp6"></span>
            </div>
            <div class="beach-seagulls-layer">
              <div class="seagull s1"><svg viewBox="0 0 24 12" class="seagull-svg"><path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,9 Q6,3 0,6 Z" fill="rgba(255,255,255,0.9)" /></svg></div>
              <div class="seagull s2"><svg viewBox="0 0 24 12" class="seagull-svg"><path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,9 Q6,3 0,6 Z" fill="rgba(255,255,255,0.85)" /></svg></div>
            </div>
            <div class="beach-vignette-overlay"></div>
          </div>
        `;
      } else if (theme === 'dystopian') {
        html = `
          <div class="dystopian-environment">
            <div class="dystopian-gif-backdrop"></div>
            <div class="dystopian-ambient-overlay"></div>
            <div class="toxic-rain-streaks"></div>
            <div class="dystopian-scanlines"></div>
            <div class="neon-hologram-beacon"></div>
          </div>
        `;
      } else if (theme === 'slimy') {
        html = `
          <div class="slimy-environment">
            <video class="slime-video-backdrop" autoplay loop muted playsinline src="./slime_world_animated-ezgif.com-gif-to-webm-converter.webm"></video>
            <div class="slimy-ambient-overlay"></div>
            <div class="slimy-drips-top"></div>
            <div class="goopy-falling-slime-container">
              <span class="slime-drip d1"></span><span class="slime-drip d2"></span>
              <span class="slime-drip d3"></span><span class="slime-drip d4"></span>
              <span class="slime-drip d5"></span>
            </div>
          </div>
        `;
      } else if (theme === 'salman') {
        html = `
          <div class="salman-environment">
            <div class="salman-highway-backdrop"></div>
            <div class="salman-desert-sun-gleam"></div>
            <div class="salman-dust-storm-overlay"></div>
            <div class="salman-ambient-vignette"></div>
          </div>
        `;
      }
      this.dom.themeBg.innerHTML = html;
    }

    this.renderShooter();
    this.updateHUD();
  }

  setTheme(newTheme) {
    this.applyTheme(newTheme);
    if (newTheme === 'salman') {
      sound.playSwagat();
    }
  }

  renderShooter() {
    if (!this.dom.shooterWrapper) return;

    let html = '';
    const angle = this.aimPos?.angle || 0;
    const mood = this.hunterMood || 'idle';

    if (this.theme === 'space') {
      html = `
        <div id="aim-shooter-element" class="spaceship-shooter" style="transform: rotate(${angle}deg);">
          <div class="spaceship-wing wing-left">
            <div class="wing-blaster"></div>
          </div>
          <div class="spaceship-hull">
            <div class="spaceship-cockpit"></div>
            <div class="spaceship-nose-cannon"></div>
          </div>
          <div class="spaceship-wing wing-right">
            <div class="wing-blaster"></div>
          </div>
          <div class="spaceship-engine-glow"></div>
        </div>
      `;
    } else if (this.theme === 'slimy') {
      const portraitSrc = (mood === 'happy' || this.isFeverMode) ? 'hunter_happy.jpg' : mood === 'angry' ? 'hunter_angry.jpg' : 'hunter_idle.jpg';
      html = `
        <div class="veteran-hunter-wrapper mood-${mood} ${this.isFeverMode ? 'fever-active' : ''}">
          ${mood === 'happy' ? '<div class="hunter-reaction-bubble happy-reaction"><span class="reaction-icon">🎯</span><span class="reaction-text">BULLSEYE!</span></div>' : ''}
          ${mood === 'angry' ? '<div class="hunter-reaction-bubble angry-reaction"><span class="reaction-icon">💢</span><span class="reaction-text">MISSED!</span></div>' : ''}
          <div class="hunter-bust-container">
            <img src="${portraitSrc}" alt="Veteran Hunter" class="hunter-portrait-img" onerror="this.src='hunter_idle.jpg'" />
            <div class="hunter-bust-vignette"></div>
            <div class="hunter-cigar-smoke-node"></div>
          </div>
          <div id="aim-shooter-element" class="veteran-shotgun-assembly" style="transform: rotate(${angle}deg);">
            <div class="shotgun-barrels">
              <div class="barrel b-top"></div>
              <div class="barrel b-bottom"></div>
              <div class="barrel-muzzle"></div>
            </div>
            <div class="shotgun-receiver"></div>
            <div class="shotgun-stock"></div>
            <div class="shotgun-pump"></div>
          </div>
        </div>
      `;
    } else if (this.theme === 'dystopian') {
      html = `
        <div class="dystopian-railgun-shooter">
          <div id="aim-shooter-element" class="railgun-turret-barrel" style="transform: rotate(${angle}deg);">
            <div class="laser-emitter-lens"></div>
            <div class="railgun-rails">
              <span class="rail r-left"></span>
              <span class="rail r-right"></span>
            </div>
            <div class="railgun-core-chamber"></div>
          </div>
          <div class="railgun-turret-base">
            <div class="turret-neon-ring"></div>
          </div>
        </div>
      `;
    } else if (this.theme === 'beach') {
      html = `
        <div class="beach-umbrella-shooter">
          <div class="umbrella-stand-base">
            <span class="tiki-badge">⛱️</span>
          </div>
          <div id="aim-shooter-element" class="umbrella-canopy-assembly" style="transform: rotate(${angle}deg);">
            <div class="umbrella-launcher-barrel"></div>
            <div class="umbrella-canopy-striped">
              <div class="umbrella-rib s1"></div>
              <div class="umbrella-rib s2"></div>
              <div class="umbrella-rib s3"></div>
            </div>
            <div class="umbrella-tip-melon-loader">🍉</div>
          </div>
        </div>
      `;
    } else if (this.theme === 'salman') {
      const portraitSrc = (mood === 'happy' || this.isFeverMode) ? 'salman_happy.jpg' : mood === 'angry' ? 'salman_angry.jpg' : 'salman_idle.jpg';
      html = `
        <div class="salman-shooter-wrapper mood-${mood} ${this.isFeverMode ? 'fever-active' : ''}">
          ${mood === 'happy' ? '<div class="salman-reaction-bubble happy-reaction"><span class="reaction-icon">🚗</span><span class="reaction-text">SWAAGAT HAI!</span></div>' : ''}
          ${mood === 'angry' ? '<div class="salman-reaction-bubble angry-reaction"><span class="reaction-icon">💢</span><span class="reaction-text">COMMITMENT!</span></div>' : ''}
          <div class="salman-bust-container">
            <img src="${portraitSrc}" alt="Bhaijaan Salman Khan" class="salman-portrait-img" onerror="this.src='salman_idle.jpg'" />
            <div class="salman-bust-vignette"></div>
            <div class="salman-bracelet-glow"></div>
          </div>
          <div id="aim-shooter-element" class="salman-car-aim-assembly" style="transform: rotate(${angle}deg);">
            <div class="aiming-suv-car">
              <span class="aiming-car-emoji">🚙</span>
              <div class="car-headlight-beam"></div>
            </div>
          </div>
        </div>
      `;
    }

    this.dom.shooterWrapper.innerHTML = html;
    this.dom.aimShooterElement = document.getElementById('aim-shooter-element');
  }

  triggerHunterMood(mood, duration = 1300) {
    this.hunterMood = mood;
    this.renderShooter();
    if (this.hunterMoodTimer) clearTimeout(this.hunterMoodTimer);
    this.hunterMoodTimer = setTimeout(() => {
      this.hunterMood = 'idle';
      this.renderShooter();
    }, duration);
  }

  // ==========================================
  // 5. AIMING & PROJECTILE PHYSICS
  // ==========================================

  updateAim(clientX, clientY) {
    this.isAiming = true;
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight - 30;
    const targetX = clientX;
    const targetY = Math.min(originY - 30, clientY);

    const dx = targetX - originX;
    const dy = targetY - originY;
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    this.aimPos = { x: targetX, y: targetY, angle: angleDeg };

    if (this.dom.aimReticleGroup) {
      this.dom.aimReticleGroup.setAttribute('transform', `translate(${targetX}, ${targetY})`);
    }
    if (this.dom.aimShooterElement) {
      this.dom.aimShooterElement.style.transform = `rotate(${angleDeg}deg)`;
    }
    if (this.dom.cannonTrajectorySvg) {
      this.dom.cannonTrajectorySvg.classList.remove('is-idle');
      this.dom.cannonTrajectorySvg.classList.add('is-aiming');
    }
  }

  fireCannonball(clientX, clientY) {
    if (this.gameState !== 'playing') return;

    sound.playShoot(this.theme);
    this.shotsFired++;

    // 1. Direct Touch/Click Proximity Pop
    const balloonElements = document.querySelectorAll('.balloon-wrapper:not(.popping)');
    for (let i = 0; i < balloonElements.length; i++) {
      const el = balloonElements[i];
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = Math.max(48, Math.max(rect.width, rect.height) * 0.55);
      if (Math.hypot(clientX - cx, clientY - cy) <= radius) {
        const id = el.getAttribute('data-id');
        const color = el.getAttribute('data-color');
        if (id && color) {
          this.triggerPop(id, color, clientX, clientY);
          return;
        }
      }
    }

    // 2. Projectile Launch
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight - 30;
    const dx = clientX - originX;
    const dy = clientY - originY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return;

    const speed = 24 + Math.min(8, this.level * 0.35);
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    this.cannonballs.push({
      id: `cb-${Date.now()}-${Math.random()}`,
      x: originX,
      y: originY,
      vx,
      vy,
      size: this.theme === 'beach' ? 26 : this.theme === 'dystopian' ? 14 : this.theme === 'slimy' ? 20 : 16,
      theme: this.theme,
      angle,
    });
  }

  // ==========================================
  // 6. BALLOON GENERATION & DOM RENDERING
  // ==========================================

  buildBalloonHTML(b) {
    const isTarget = b.color === this.targetColor;
    const movementClass = `mov-${b.movementStyle || 'linear'}`;
    const themeClass = `theme-entity-${this.theme}`;
    const color = b.color;
    const colorHex = targetColorHex[color] || '#ffffff';

    let innerContent = '';

    if (this.theme === 'beach') {
      innerContent = `
        <div class="beach-ball ${color} ${isTarget ? 'target-glow' : ''}" style="--sway-duration: ${b.swayDuration}; --sway-delay: ${b.swayDelay};">
          <div class="beach-ball-inner">
            <svg viewBox="0 0 100 100" class="entity-svg beach-ball-svg" aria-hidden="true">
              <defs>
                <radialGradient id="beachBallShade-${b.id}" cx="32%" cy="28%" r="68%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
                  <stop offset="55%" stop-color="#000000" stop-opacity="0" />
                  <stop offset="100%" stop-color="#000000" stop-opacity="0.45" />
                </radialGradient>
                <linearGradient id="beachWhite-${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="100%" stop-color="#e9ecef" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="var(--color-primary, ${colorHex})" />
              <path d="M 50 2 C 28 2 12 22 12 50 C 12 78 28 98 50 98 C 36 82 26 62 26 50 C 26 38 36 18 50 2 Z" fill="url(#beachWhite-${b.id})" />
              <path d="M 50 2 C 36 18 26 38 26 50 C 26 62 36 82 50 98 C 64 82 74 62 74 50 C 74 38 64 18 50 2 Z" fill="var(--color-primary, ${colorHex})" />
              <path d="M 50 2 C 64 18 74 38 74 50 C 74 62 64 82 50 98 C 72 98 88 78 88 50 C 88 22 72 2 50 2 Z" fill="url(#beachWhite-${b.id})" />
              <circle cx="50" cy="4" r="5" fill="#ffffff" stroke="rgba(0,0,0,0.2)" stroke-width="1" />
              <circle cx="50" cy="96" r="5" fill="#ffffff" stroke="rgba(0,0,0,0.2)" stroke-width="1" />
              <circle cx="50" cy="50" r="48" fill="url(#beachBallShade-${b.id})" />
              <ellipse cx="36" cy="24" rx="14" ry="6.5" transform="rotate(-32 36 24)" fill="#ffffff" fill-opacity="0.55" />
            </svg>
          </div>
        </div>
      `;
    } else if (this.theme === 'space') {
      innerContent = `
        <div class="space-asteroid ${color} ${isTarget ? 'target-glow' : ''}" style="--sway-duration: ${b.swayDuration}; --sway-delay: ${b.swayDelay};">
          <div class="asteroid-inner">
            <svg viewBox="0 0 100 100" class="entity-svg asteroid-svg" aria-hidden="true">
              <defs>
                <radialGradient id="asteroidRock-${b.id}" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stop-color="#4a445d" />
                  <stop offset="50%" stop-color="#252033" />
                  <stop offset="100%" stop-color="#110d1c" />
                </radialGradient>
                <radialGradient id="crystalCore-${b.id}" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="45%" stop-color="var(--color-primary, ${colorHex})" />
                  <stop offset="100%" stop-color="var(--color-primary, ${colorHex})" stop-opacity="0.1" />
                </radialGradient>
              </defs>
              <path d="M 50,5 C 72,7 90,20 95,44 C 98,62 90,82 76,93 C 58,100 34,97 16,84 C 4,70 2,48 8,28 C 15,12 32,3 50,5 Z" fill="url(#asteroidRock-${b.id})" stroke="rgba(255,255,255,0.22)" stroke-width="1.5" />
              <path d="M 46,18 Q 58,32 50,48 T 68,76 M 28,42 Q 44,52 38,72" stroke="var(--color-primary, ${colorHex})" stroke-width="3.5" fill="none" stroke-linecap="round" filter="drop-shadow(0 0 6px var(--color-primary, ${colorHex}))" />
              <ellipse cx="64" cy="38" rx="12" ry="9" fill="#181424" stroke="#4a445d" stroke-width="1.5" />
              <circle cx="63" cy="38" r="5.5" fill="url(#crystalCore-${b.id})" filter="drop-shadow(0 0 5px var(--color-primary, ${colorHex}))" />
              <ellipse cx="32" cy="62" rx="9" ry="7" fill="#141120" stroke="#3b354c" stroke-width="1.2" />
              <circle cx="32" cy="62" r="3" fill="var(--color-primary, ${colorHex})" fill-opacity="0.8" />
              <ellipse cx="38" cy="26" rx="6" ry="4.5" fill="#141120" stroke="#3b354c" stroke-width="1" />
              <ellipse cx="74" cy="68" rx="7" ry="5" fill="#141120" stroke="#3b354c" stroke-width="1" />
              <path d="M 44,8 Q 62,12 78,24" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />
              <circle cx="20" cy="32" r="2" fill="#ffffff" opacity="0.7" />
            </svg>
          </div>
        </div>
      `;
    } else if (this.theme === 'slimy') {
      innerContent = `
        <div class="slime-monster ${color} ${isTarget ? 'target-glow' : ''}" style="--sway-duration: ${b.swayDuration}; --sway-delay: ${b.swayDelay};">
          <div class="slime-inner">
            <svg viewBox="0 0 110 110" class="entity-svg slime-svg" aria-hidden="true">
              <defs>
                <radialGradient id="slimeGooMountain-${b.id}" cx="48%" cy="30%" r="70%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
                  <stop offset="35%" stop-color="var(--color-primary, ${colorHex})" />
                  <stop offset="85%" stop-color="var(--color-primary-dark, #007200)" />
                  <stop offset="100%" stop-color="#051f05" />
                </radialGradient>
              </defs>
              <path d="M 6,92 C 16,84 28,94 44,90 C 62,94 80,86 96,90 C 106,94 104,98 88,100 C 60,102 32,102 10,98 C 4,96 2,94 6,92 Z" fill="var(--color-primary-dark, #007200)" opacity="0.8" />
              <path d="M 58,18 C 66,24 74,38 82,46 C 88,48 98,46 94,54 C 90,62 82,60 76,64 C 82,72 90,82 86,88 C 80,94 64,88 52,90 C 40,88 24,94 18,88 C 14,84 22,74 24,66 C 18,60 10,48 20,24 C 24,14 30,12 32,20 C 34,28 32,38 38,44 C 44,30 48,12 58,18 Z" fill="url(#slimeGooMountain-${b.id})" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linejoin="round" />
              <circle cx="16" cy="38" r="2.5" fill="var(--color-primary, ${colorHex})" />
              <circle cx="94" cy="62" r="2.5" fill="var(--color-primary, ${colorHex})" />
              <ellipse cx="12" cy="94" rx="4" ry="2" fill="var(--color-primary, ${colorHex})" />
              <ellipse cx="53" cy="36" rx="10.5" ry="13.5" fill="#fefae0" stroke="#0f290f" stroke-width="2" />
              <ellipse cx="54" cy="37" rx="5.5" ry="7" fill="#1b263b" />
              <circle cx="51" cy="33" r="2.8" fill="#ffffff" />
              <path d="M 42,52 Q 54,48 64,52 Q 68,66 62,76 Q 52,82 42,74 Q 38,64 42,52 Z" fill="#0a180a" stroke="#0f290f" stroke-width="2" />
              <rect x="47" y="52" width="4.5" height="5.5" rx="1.5" fill="#ffffff" stroke="#0a180a" stroke-width="0.8" />
              <rect x="54" y="52" width="4" height="6.5" rx="1.5" fill="#ffffff" stroke="#0a180a" stroke-width="0.8" />
              <rect x="51" y="70" width="4.5" height="5" rx="1.5" fill="#ffffff" stroke="#0a180a" stroke-width="0.8" />
              <path d="M 54,20 Q 62,26 68,34" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.65" />
            </svg>
          </div>
        </div>
      `;
    } else if (this.theme === 'dystopian') {
      innerContent = `
        <div class="cyber-zombie ${color} ${isTarget ? 'target-glow' : ''}" style="--sway-duration: ${b.swayDuration}; --sway-delay: ${b.swayDelay};">
          <div class="zombie-inner">
            <svg viewBox="0 0 100 100" class="entity-svg zombie-svg" aria-hidden="true">
              <defs>
                <linearGradient id="zombieHead-${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#374151" />
                  <stop offset="60%" stop-color="#1f2937" />
                  <stop offset="100%" stop-color="#111827" />
                </linearGradient>
              </defs>
              <path d="M 50,8 C 74,8 86,24 86,50 C 86,66 78,80 72,90 C 62,94 38,94 28,90 C 22,80 14,66 14,50 C 14,24 26,8 50,8 Z" fill="url(#zombieHead-${b.id})" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
              <circle cx="35" cy="42" r="10" fill="#0f172a" stroke="var(--color-primary, ${colorHex})" stroke-width="2" />
              <circle cx="35" cy="42" r="5.5" fill="var(--color-primary, ${colorHex})" filter="drop-shadow(0 0 6px var(--color-primary, ${colorHex}))" />
              <circle cx="65" cy="42" r="6" fill="#111827" stroke="#4b5563" stroke-width="1.5" />
              <line x1="22" y1="42" x2="48" y2="42" stroke="var(--color-primary, ${colorHex})" stroke-width="1" stroke-dasharray="1 2" />
              <path d="M 38,72 L 62,72" stroke="var(--color-primary, ${colorHex})" stroke-width="3" stroke-linecap="round" />
            </svg>
          </div>
        </div>
      `;
    } else if (this.theme === 'salman') {
      innerContent = `
        <div class="blackbuck-deer ${color} ${isTarget ? 'target-glow' : ''}" style="--sway-duration: ${b.swayDuration}; --sway-delay: ${b.swayDelay};">
          <div class="blackbuck-inner">
            <svg viewBox="0 0 110 100" class="entity-svg blackbuck-svg" aria-hidden="true">
              <path d="M 22,62 C 26,44 42,42 58,46 C 72,50 82,42 90,32 C 94,36 96,44 92,52 C 86,60 76,64 68,68 C 54,74 38,76 28,78 C 22,76 18,70 22,62 Z" fill="#271c19" />
              <path d="M 30,72 C 42,70 56,66 66,62 C 60,68 48,74 34,76 Z" fill="#f8fafc" />
              <path d="M 82,44 C 88,38 96,30 102,32 C 105,34 104,40 98,46 C 92,50 86,48 82,44 Z" fill="#1c1311" />
              <circle cx="94" cy="36" r="4.5" fill="#f8fafc" />
              <circle cx="94.5" cy="36" r="2.5" fill="#000000" />
              <circle cx="93.5" cy="35" r="0.8" fill="#ffffff" />
              <path d="M 85,34 Q 78,16 68,4 M 83,34 Q 74,18 64,6" stroke="var(--color-primary, ${colorHex})" stroke-width="4" stroke-linecap="round" fill="none" filter="drop-shadow(0 0 5px var(--color-primary, ${colorHex}))" />
              <circle cx="79" cy="24" r="2" fill="#ffffff" />
              <circle cx="73" cy="14" r="1.8" fill="#ffffff" />
              <circle cx="68" cy="6" r="1.5" fill="#ffffff" />
              <path d="M 88,52 L 102,74 L 108,76" stroke="#271c19" stroke-width="3" stroke-linecap="round" fill="none" />
              <path d="M 28,70 L 14,88 L 6,86" stroke="#271c19" stroke-width="3" stroke-linecap="round" fill="none" />
            </svg>
          </div>
        </div>
      `;
    }

    return `
      <div
        class="balloon-wrapper ${movementClass} ${isTarget ? 'is-target-balloon' : ''} ${themeClass}"
        id="balloon-node-${b.id}"
        data-id="${b.id}"
        data-color="${b.color}"
        style="
          --balloon-left: ${b.left};
          --float-duration: ${b.floatDuration};
          --float-delay: ${b.floatDelay};
          --balloon-opacity: ${b.opacity};
          --balloon-blur: ${b.blur};
          --balloon-z: ${b.z};
          transform: scale(${b.scale});
        "
      >
        ${isTarget ? '<div class="child-target-indicator" aria-hidden="true">⭐</div>' : ''}
        ${innerContent}
      </div>
    `;
  }

  renderBalloons() {
    if (!this.dom.balloonLayer) return;
    this.dom.balloonLayer.innerHTML = this.balloons
      .filter(b => !b.isPopping)
      .map(b => this.buildBalloonHTML(b))
      .join('');
  }

  // ==========================================
  // 7. GAME STATE TRANSITIONS
  // ==========================================

  startGame() {
    this.level = 1;
    this.score = 0;
    this.strikes = 0;
    this.levelProgress = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.isFeverMode = false;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.cannonballs = [];
    this.poopedBalls = [];

    const config = LEVELS[0];
    this.balloons = generateBalloonsForLevel(config);
    this.targetColor = config.colors[Math.floor(Math.random() * config.colors.length)];

    this.closeModals();
    this.startCountdown();
  }

  nextLevel() {
    if (this.level < 20) {
      this.level++;
      const config = LEVELS[this.level - 1];
      this.balloons = generateBalloonsForLevel(config);
      this.strikes = 0;
      this.levelProgress = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.isFeverMode = false;
      this.cannonballs = [];
      this.poopedBalls = [];
      this.targetColor = config.colors[Math.floor(Math.random() * config.colors.length)];

      this.closeModals();
      this.startCountdown();
    } else {
      this.setGameState('victory');
    }
  }

  retryLevel() {
    const config = LEVELS[this.level - 1];
    this.balloons = generateBalloonsForLevel(config);
    this.strikes = 0;
    this.levelProgress = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.isFeverMode = false;
    this.cannonballs = [];
    this.poopedBalls = [];
    this.targetColor = config.colors[Math.floor(Math.random() * config.colors.length)];

    this.closeModals();
    this.startCountdown();
  }

  restartGame() {
    this.startGame();
  }

  startCountdown() {
    this.setGameState('countdown');
    this.renderBalloons();
    this.renderShooter();
    this.updateHUD();

    if (this.dom.countdownOverlay && this.dom.countdownNumber) {
      this.dom.countdownOverlay.classList.remove('hidden');
      
      let count = 3;
      this.dom.countdownNumber.textContent = count;
      sound.playCountdown(false);

      if (this.countdownTimer) clearInterval(this.countdownTimer);

      this.countdownTimer = setInterval(() => {
        count--;
        if (count > 0) {
          this.dom.countdownNumber.textContent = count;
          sound.playCountdown(false);
        } else if (count === 0) {
          this.dom.countdownNumber.textContent = 'GO!';
          sound.playCountdown(true);
        } else {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
          this.dom.countdownOverlay.classList.add('hidden');
          this.setGameState('playing');
        }
      }, 800);
    } else {
      this.setGameState('playing');
    }
  }

  pauseGame() {
    if (this.gameState !== 'playing') return;
    this.setGameState('paused');
    document.body.classList.add('portal-paused');
  }

  resumeGame() {
    document.body.classList.remove('portal-paused');
    if (this.dom.resumeCountdownOverlay && this.dom.resumeCountdownNumber) {
      this.dom.resumeCountdownOverlay.classList.remove('hidden');
      let count = 3;
      this.dom.resumeCountdownNumber.textContent = count;
      sound.playCountdown(false);

      if (this.resumeCountdownTimer) clearInterval(this.resumeCountdownTimer);

      this.resumeCountdownTimer = setInterval(() => {
        count--;
        if (count > 0) {
          this.dom.resumeCountdownNumber.textContent = count;
          sound.playCountdown(false);
        } else if (count === 0) {
          this.dom.resumeCountdownNumber.textContent = 'GO!';
          sound.playCountdown(true);
        } else {
          clearInterval(this.resumeCountdownTimer);
          this.resumeCountdownTimer = null;
          this.dom.resumeCountdownOverlay.classList.add('hidden');
          this.setGameState('playing');
        }
      }, 1000);
    } else {
      this.setGameState('playing');
    }
  }

  returnToMenu() {
    this.closeModals();
    this.setGameState('start');
  }

  setGameState(state) {
    this.gameState = state;

    // Show/hide relevant views
    if (this.dom.hud) {
      this.dom.hud.style.display = (state === 'playing' || state === 'paused' || state === 'countdown') ? 'block' : 'none';
    }

    if (state === 'start') {
      this.openModal('start');
    } else if (state === 'level_cleared') {
      this.openModal('level_complete');
    } else if (state === 'game_over') {
      this.openModal('game_over');
    } else if (state === 'victory') {
      this.openModal('victory');
    }

    this.updateHUD();
  }

  // ==========================================
  // 8. POPPING & COLLISION LOGIC
  // ==========================================

  triggerPop(id, color, hitX, hitY) {
    if (this.gameState !== 'playing') return;

    this.shotsHit++;
    const isCorrect = color === this.targetColor;

    // Remove balloon node from DOM
    const balloonNode = document.getElementById(`balloon-node-${id}`);
    if (balloonNode) {
      balloonNode.classList.add('popping');
      setTimeout(() => balloonNode.remove(), 250);
    }

    // Mark in memory
    const bObj = this.balloons.find(b => String(b.id) === String(id));
    if (bObj) bObj.isPopping = true;

    if (isCorrect) {
      this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.resetComboTimer();

      let feverActive = this.isFeverMode;
      if (this.combo >= 5 && !this.isFeverMode) {
        this.isFeverMode = true;
        feverActive = true;
        sound.playFever();
        this.spawnPopupText('🔥 FEVER MODE 3×! 🔥', window.innerWidth / 2, window.innerHeight * 0.35, 'fever', '#ffb703');
      }

      const multiplier = feverActive ? 3 : this.combo >= 4 ? 2.5 : this.combo >= 3 ? 2 : this.combo >= 2 ? 1.5 : 1;
      const pointsEarned = Math.round(10 * multiplier);

      this.score += pointsEarned;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem(this.HIGH_SCORE_KEY, this.highScore.toString());
      }

      sound.playPop(this.combo, this.theme);
      if (this.combo >= 2 && !feverActive) {
        sound.playComboChord(this.combo);
      }

      this.triggerShake('shake-small');
      this.spawnParticles(hitX, hitY, color, feverActive);
      this.triggerHunterMood('happy', 1400);

      const words = ['YAY!', 'WOW!', 'COOL!', 'GREAT!', 'SUPER!', 'AWESOME!', 'POP!'];
      const word = words[Math.floor(Math.random() * words.length)];
      if (this.combo >= 2) {
        this.spawnPopupText(`${word} +${pointsEarned} (×${this.combo} COMBO!)`, hitX, hitY, 'combo', '#ffd700');
      } else {
        this.spawnPopupText(`${word} +${pointsEarned}`, hitX, hitY, 'correct', '#4caf50');
      }

      this.levelProgress++;
      const config = LEVELS[this.level - 1];

      if (this.levelProgress >= config.targetPopsNeeded) {
        const bonus = config.bonusPoints || 100;
        this.score += bonus;
        sound.playWinFanfare();
        this.spawnPopupText(`LEVEL CLEARED! +${bonus}`, window.innerWidth / 2, window.innerHeight / 2, 'level-up', '#ffd700');

        if (this.level >= 20) {
          this.saveScore(this.playerName);
          this.setGameState('victory');
        } else {
          this.setGameState('level_cleared');
        }
      } else {
        // Next target color
        const colors = config.colors;
        const choices = colors.length > 1 ? colors.filter(c => c !== color) : colors;
        this.targetColor = choices[Math.floor(Math.random() * choices.length)];
        this.updateHUD();
      }
    } else {
      // Wrong balloon strike
      this.strikes++;
      this.combo = 0;
      this.isFeverMode = false;

      sound.playWrong();
      this.triggerShake('shake-large');
      this.score = Math.max(0, this.score - 5);
      this.spawnParticles(hitX, hitY, color, false);
      this.triggerHunterMood('angry', 1500);

      if (this.strikes >= 3) {
        sound.playGameOver();
        this.spawnPopupText('LEVEL FAILED 💔', hitX, hitY, 'wrong', '#ff3366');
        this.saveScore(this.playerName);
        this.setGameState('game_over');
      } else {
        this.spawnPopupText(`STRIKE ${this.strikes}/3 (-5)`, hitX, hitY, 'wrong', '#ff5252');
      }
    }

    this.updateHUD();

    // Respawn popped balloon after 1.2s
    setTimeout(() => {
      if (this.gameState === 'playing' && bObj) {
        const config = LEVELS[this.level - 1] || {};
        const colors = config.colors || ['red', 'cyan', 'gold'];
        bObj.isPopping = false;
        bObj.color = colors[Math.floor(Math.random() * colors.length)];
        bObj.left = `${Math.max(4, Math.min(92, Math.round(Math.random() * 88 + 4)))}%`;
        bObj.floatDelay = '0s';

        // Re-append to DOM
        if (this.dom.balloonLayer) {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = this.buildBalloonHTML(bObj);
          if (wrapper.firstElementChild) {
            this.dom.balloonLayer.appendChild(wrapper.firstElementChild);
          }
        }
      }
    }, 1200);
  }

  resetComboTimer() {
    if (this.comboTimer) clearTimeout(this.comboTimer);
    this.comboTimer = setTimeout(() => {
      this.combo = 0;
      this.isFeverMode = false;
      this.updateHUD();
    }, 3800);
  }

  triggerShake(type = 'shake-small') {
    this.dom.appRoot.classList.remove('shake-small', 'shake-large');
    this.dom.appRoot.classList.add(type);
    setTimeout(() => this.dom.appRoot.classList.remove(type), 300);
  }

  spawnParticles(x, y, color, extraIntensity = false) {
    const particleCount = extraIntensity ? 20 : 12;
    const particleColor = colorMap[color] || '#ffffff';

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * 2 * Math.PI + Math.random() * 0.4;
      const distance = (extraIntensity ? 55 : 38) + Math.random() * (extraIntensity ? 75 : 55);
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const size = 6 + Math.random() * (extraIntensity ? 8 : 5);

      const el = document.createElement('div');
      el.className = `pop-particle particle-theme-${this.theme}`;
      el.style.top = `${y}px`;
      el.style.left = `${x}px`;
      el.style.setProperty('--tx', `${tx}px`);
      el.style.setProperty('--ty', `${ty}px`);
      el.style.setProperty('--size', `${size}px`);
      el.style.setProperty('--particle-color', particleColor);
      el.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);

      this.dom.effectsLayer.appendChild(el);
      setTimeout(() => el.remove(), 750);
    }
  }

  spawnPopupText(text, x, y, type, color = '#ffffff') {
    const el = document.createElement('div');
    el.className = `popup-text ${type || ''}`;
    el.style.top = `${y}px`;
    el.style.left = `${x}px`;
    el.style.color = color;
    el.textContent = text;

    this.dom.effectsLayer.appendChild(el);
    setTimeout(() => el.remove(), 950);
  }

  distToSegmentSquared(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) return (px - x1) * (px - x1) + (py - y1) * (py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return (px - projX) * (px - projX) + (py - projY) * (py - projY);
  }

  saveScore(name) {
    if (this.score <= 0) return;
    const newEntry = {
      id: `${Date.now()}-${Math.random()}`,
      name: name || this.playerName || 'Player',
      score: this.score,
      level: this.level,
      date: new Date().toISOString().split('T')[0],
    };
    this.scoreboard.push(newEntry);
    this.scoreboard.sort((a, b) => b.score - a.score);
    this.scoreboard = this.scoreboard.slice(0, 10);
    this.saveScoreboard();
  }

  clearScoreboard() {
    this.scoreboard = [];
    localStorage.removeItem(this.SCOREBOARD_KEY);
    this.renderScoreboardList();
  }

  toggleSound() {
    const muted = sound.toggleMute();
    if (this.dom.btnMute) {
      this.dom.btnMute.innerHTML = `${muted ? '🔇' : '🔊'} <span id="hud-mute-label-text" class="btn-label-text">${muted ? 'UNMUTE' : 'MUTE'}</span>`;
    }
  }

  // ==========================================
  // 9. HUD & MODAL RENDERING
  // ==========================================

  updateHUD() {
    const config = LEVELS[this.level - 1] || LEVELS[0];
    const needed = config.targetPopsNeeded;
    const remaining = Math.max(0, needed - this.levelProgress);

    const entityNames = {
      space: { single: 'asteroid', plural: 'asteroids' },
      beach: { single: 'beach ball', plural: 'beach balls' },
      dystopian: { single: 'cyber implant', plural: 'cyber implants' },
      slimy: { single: 'slime monster', plural: 'slime monsters' },
      salman: { single: 'blackbuck', plural: 'blackbucks' },
    };
    const entity = entityNames[this.theme] || entityNames.space;

    if (this.dom.levelNumberText) this.dom.levelNumberText.innerHTML = `LEVEL ${this.level} <span class="level-max">/ 20</span>`;
    if (this.dom.levelMechanicTag) this.dom.levelMechanicTag.textContent = getLevelMechanic(this.level, this.theme);
    if (this.dom.levelTrackProgress) this.dom.levelTrackProgress.style.width = `${(this.level / 20) * 100}%`;
    if (this.dom.levelTrackPin) this.dom.levelTrackPin.style.left = `${((this.level - 1) / 19) * 100}%`;
    if (this.dom.objectiveCount) this.dom.objectiveCount.textContent = `${this.levelProgress} / ${needed}`;
    if (this.dom.progressBarFill) this.dom.progressBarFill.style.width = `${Math.min(100, (this.levelProgress / needed) * 100)}%`;

    // Target color badge
    if (this.dom.targetGiantBadge) {
      this.dom.targetGiantBadge.className = `target-giant-badge ${this.targetColor} glow-${this.targetColor}`;
      const colorHex = targetColorHex[this.targetColor] || '#ffffff';
      
      if (this.theme === 'salman') {
        this.dom.targetGiantBadge.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <svg viewBox="0 0 110 100" style="width: 40px; height: 36px; --color-primary: ${colorHex};" aria-hidden="true">
              <path d="M 22,62 C 26,44 42,42 58,46 C 72,50 82,42 90,32 C 94,36 96,44 92,52 C 86,60 76,64 68,68 C 54,74 38,76 28,78 C 22,76 18,70 22,62 Z" fill="#271c19" />
              <path d="M 30,72 C 42,70 56,66 66,62 C 60,68 48,74 34,76 Z" fill="#f8fafc" />
              <path d="M 82,44 C 88,38 96,30 102,32 C 105,34 104,40 98,46 C 92,50 86,48 82,44 Z" fill="#1c1311" />
              <circle cx="94" cy="36" r="4.5" fill="#f8fafc" />
              <circle cx="94.5" cy="36" r="2.5" fill="#000000" />
              <path d="M 85,34 Q 78,16 68,4 M 83,34 Q 74,18 64,6" stroke="var(--color-primary, ${colorHex})" stroke-width="4" stroke-linecap="round" fill="none" />
            </svg>
            <span class="target-giant-text">${this.targetColor.toUpperCase()}</span>
          </div>
        `;
      } else {
        this.dom.targetGiantBadge.innerHTML = `<span class="target-giant-text">${this.targetColor.toUpperCase()}</span>`;
      }
    }

    if (this.dom.targetHintSub) {
      this.dom.targetHintSub.textContent = remaining === 1
        ? `Pop 1 more ${this.targetColor.toUpperCase()} ${entity.single}!`
        : `Pop ${remaining} more ${this.targetColor.toUpperCase()} ${entity.plural}`;
    }

    // Combo / Fever Mode
    if (this.dom.comboFloatPill) {
      if (this.combo >= 2 || this.isFeverMode) {
        this.dom.comboFloatPill.style.display = 'block';
        this.dom.comboFloatPill.className = `combo-float-pill ${this.isFeverMode ? 'fever-mode-active' : ''}`;
        if (this.isFeverMode) {
          this.dom.comboFloatPill.innerHTML = `
            <div class="fever-content">
              <span class="fever-fire">🔥</span>
              <span class="fever-title">FEVER MODE 3×</span>
              <span class="fever-fire">🔥</span>
            </div>
          `;
        } else {
          this.dom.comboFloatPill.innerHTML = `
            <div class="combo-content">
              <span class="combo-x">COMBO</span>
              <span class="combo-multiplier">×${this.combo}</span>
              <span class="combo-bonus-tag">+${this.combo * 50} pts</span>
            </div>
          `;
        }
      } else {
        this.dom.comboFloatPill.style.display = 'none';
      }
    }

    if (this.dom.scoreDisplay) this.dom.scoreDisplay.textContent = this.score.toLocaleString();
    if (this.dom.highScoreDisplay) this.dom.highScoreDisplay.textContent = this.highScore.toLocaleString();

    // Render Hearts with SVG
    if (this.dom.heartsContainer) {
      const lives = Math.max(0, 3 - this.strikes);
      if (this.dom.livesBarWrapper) {
        if (lives === 1) this.dom.livesBarWrapper.classList.add('critical-danger-pulse');
        else this.dom.livesBarWrapper.classList.remove('critical-danger-pulse');
      }

      this.dom.heartsContainer.innerHTML = [0, 1, 2].map(idx => `
        <div class="heart-unit ${idx < lives ? 'heart-alive' : 'heart-lost'}" title="${idx < lives ? 'Life active' : 'Life lost'}">
          <svg viewBox="0 0 24 24" class="heart-svg" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      `).join('');
    }

    if (this.dom.btnMute) {
      const muted = sound.isMuted();
      this.dom.btnMute.innerHTML = `${muted ? '🔇' : '🔊'} <span id="hud-mute-label-text" class="btn-label-text">${muted ? 'UNMUTE' : 'MUTE'}</span>`;
    }
  }

  openModal(modalId) {
    this.closeModals();
    this.dom.modalContainer.classList.remove('hidden');

    if (modalId === 'start') {
      this.dom.startModal.classList.remove('hidden');
    } else if (modalId === 'theme') {
      this.dom.themeModal.classList.remove('hidden');
    } else if (modalId === 'level_complete') {
      this.dom.levelCompleteModal.classList.remove('hidden');
      const titleEl = document.getElementById('lc-level-title');
      const scoreEl = document.getElementById('lc-score-val');
      const accEl = document.getElementById('lc-accuracy-val');
      const comboEl = document.getElementById('lc-max-combo');

      if (titleEl) titleEl.textContent = `Level ${this.level} Cleared!`;
      if (scoreEl) scoreEl.textContent = this.score.toLocaleString();
      if (accEl) {
        const acc = this.shotsFired > 0 ? Math.round((this.shotsHit / this.shotsFired) * 100) : 100;
        accEl.textContent = `${acc}%`;
      }
      if (comboEl) comboEl.textContent = `${this.maxCombo}×`;
    } else if (modalId === 'game_over') {
      this.dom.gameOverModal.classList.remove('hidden');
      const lvlEl = document.getElementById('go-level-val');
      const scoreEl = document.getElementById('go-score-val');
      const bestEl = document.getElementById('go-best-score');

      if (lvlEl) lvlEl.textContent = this.level;
      if (scoreEl) scoreEl.textContent = this.score.toLocaleString();
      if (bestEl) bestEl.textContent = this.highScore.toLocaleString();
    } else if (modalId === 'victory') {
      this.dom.victoryModal.classList.remove('hidden');
      const scoreEl = document.getElementById('vic-score-val');
      const accEl = document.getElementById('vic-accuracy-val');

      if (scoreEl) scoreEl.textContent = this.score.toLocaleString();
      if (accEl) {
        const acc = this.shotsFired > 0 ? Math.round((this.shotsHit / this.shotsFired) * 100) : 100;
        accEl.textContent = `${acc}%`;
      }
    } else if (modalId === 'scoreboard') {
      this.dom.scoreboardModal.classList.remove('hidden');
      this.renderScoreboardList();
    }
  }

  openThemeSelector() {
    this.openModal('theme');
  }

  openScoreboard() {
    this.openModal('scoreboard');
  }

  renderScoreboardList() {
    const list = document.getElementById('scoreboard-list-container');
    if (!list) return;

    if (this.scoreboard.length === 0) {
      list.innerHTML = `<div style="text-align: center; color: #94a3b8; padding: 20px;">No high score records yet!</div>`;
      return;
    }

    list.innerHTML = this.scoreboard.map((entry, idx) => `
      <div class="scoreboard-entry-row ${idx === 0 ? 'gold-rank' : idx === 1 ? 'silver-rank' : idx === 2 ? 'bronze-rank' : ''}">
        <span class="sb-rank">#${idx + 1}</span>
        <span class="sb-name">${entry.name || 'Player'}</span>
        <span class="sb-level">Lvl ${entry.level}</span>
        <span class="sb-score">${entry.score.toLocaleString()} pts</span>
      </div>
    `).join('');
  }

  closeModals() {
    this.dom.modalContainer.classList.add('hidden');
    this.dom.startModal.classList.add('hidden');
    this.dom.themeModal.classList.add('hidden');
    this.dom.levelCompleteModal.classList.add('hidden');
    this.dom.gameOverModal.classList.add('hidden');
    this.dom.victoryModal.classList.add('hidden');
    this.dom.scoreboardModal.classList.add('hidden');
  }

  // ==========================================
  // 10. CONTINUOUS ANIMATION & PROJECTILE LOOP
  // ==========================================

  startRenderLoop() {
    const loop = () => {
      if (this.gameState === 'playing' && !document.hidden) {
        // Move Cannonballs
        if (this.cannonballs.length > 0) {
          const winW = window.innerWidth;
          const winH = window.innerHeight;
          const remainingBalls = [];

          // Collect balloon elements
          const balloonElements = document.querySelectorAll('.balloon-wrapper:not(.popping)');
          const activeTargets = [];
          for (let i = 0; i < balloonElements.length; i++) {
            const el = balloonElements[i];
            const rect = el.getBoundingClientRect();
            if (rect.bottom < -40 || rect.top > winH + 40 || rect.right < -40 || rect.left > winW + 40) continue;
            const id = el.getAttribute('data-id');
            const color = el.getAttribute('data-color');
            if (id && color) {
              activeTargets.push({
                id,
                color,
                cx: rect.left + rect.width / 2,
                cy: rect.top + rect.height / 2,
                radius: Math.max(48, Math.max(rect.width, rect.height) * 0.55),
              });
            }
          }

          for (const ball of this.cannonballs) {
            const nextX = ball.x + ball.vx;
            const nextY = ball.y + ball.vy;

            if (nextX < -60 || nextX > winW + 60 || nextY < -60 || nextY > winH + 60) {
              continue;
            }

            let hit = false;
            const ballRadius = (ball.size || 26) / 2;

            for (const t of activeTargets) {
              const hitDist = t.radius + ballRadius;
              const d2 = this.distToSegmentSquared(t.cx, t.cy, ball.x, ball.y, nextX, nextY);

              if (d2 <= hitDist * hitDist) {
                hit = true;
                this.triggerPop(t.id, t.color, t.cx, t.cy);
                break;
              }
            }

            if (!hit) {
              ball.x = nextX;
              ball.y = nextY;
              remainingBalls.push(ball);
            }
          }

          this.cannonballs = remainingBalls;
          this.renderProjectiles();
        } else {
          this.renderProjectiles();
        }
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  renderProjectiles() {
    const container = document.getElementById('projectiles-layer');
    if (!container) return;

    container.innerHTML = this.cannonballs.map(ball => {
      const ballTheme = ball.theme || this.theme || 'space';

      let inner = '';
      if (ballTheme === 'space') {
        inner = '<div class="plasma-bullet-node"><div class="plasma-trail"></div></div>';
      } else if (ballTheme === 'slimy') {
        inner = '<div class="shotgun-bullet-node"><div class="shotgun-shell-casing"></div><div class="shotgun-smoke-trail"></div></div>';
      } else if (ballTheme === 'dystopian') {
        inner = '<div class="laser-beam-node"><div class="laser-core-beam"></div><div class="laser-spark-corona"></div></div>';
      } else if (ballTheme === 'beach') {
        inner = '<div class="watermelon-node"><div class="watermelon-skin">🍉</div><div class="watermelon-splash-trail"></div></div>';
      } else if (ballTheme === 'salman') {
        inner = '<div class="flying-car-node"><div class="flying-car-body">🚗</div><div class="car-exhaust-fire"></div><div class="car-drift-sparks"></div></div>';
      }

      return `
        <div
          class="projectile-entity proj-${ballTheme}"
          style="
            left: ${ball.x}px;
            top: ${ball.y}px;
            width: ${ball.size}px;
            height: ${ball.size}px;
            transform: translate(-50%, -50%) rotate(${ball.angle || 0}deg);
          "
        >
          ${inner}
        </div>
      `;
    }).join('');
  }
}

// ==========================================
// 11. BOOTSTRAP INSTANCE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  window.popupGame = new BalloonGameEngine();
});
