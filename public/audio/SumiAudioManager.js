/**
 * SumiAudioManager.js
 * Comprehensive audio management system for Sumi-e Zen Tac Toe
 * Supports multi-track music, layered environmental ambience, brush SFX, and tactile UI feedback.
 */

class SumiAudioManager {
  constructor() {
    this.music = null;
    this.ambience = []; // array of { audio, baseVolume }
    this.volume = 1.0;          // Master volume (0 - 1)
    this.musicVolume = 0.0;     // Music volume (0 - 1) - Default disabled per user request
    this.ambienceVolume = 0.15; // Ambience volume (0 - 1)
    this.sfxVolume = 0.7;       // Sound FX volume (0 - 1)
    this.enabled = true;
    this.hasUserInteracted = false;
    this.pendingMusicSrc = null;

    // Load persisted preferences if in browser
    if (typeof localStorage !== 'undefined') {
      const savedEnabled = localStorage.getItem('sumi_audio_enabled');
      if (savedEnabled !== null) this.enabled = savedEnabled === 'true';

      const savedVol = localStorage.getItem('sumi_audio_vol_master');
      if (savedVol !== null) this.volume = parseFloat(savedVol) || 1.0;

      const savedMusicVol = localStorage.getItem('sumi_audio_vol_music');
      if (savedMusicVol !== null) this.musicVolume = parseFloat(savedMusicVol) || 0.0;

      const savedAmbVol = localStorage.getItem('sumi_audio_vol_ambience');
      if (savedAmbVol !== null) this.ambienceVolume = parseFloat(savedAmbVol) || 0.15;

      const savedSfxVol = localStorage.getItem('sumi_audio_vol_sfx');
      if (savedSfxVol !== null) this.sfxVolume = parseFloat(savedSfxVol) || 0.7;
    }

    this._bindUserInteractionUnlock();
  }

  _bindUserInteractionUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      if (this.hasUserInteracted) return;
      this.hasUserInteracted = true;

      // Resume pending music only if volume > 0 and enabled
      if (this.pendingMusicSrc && this.enabled && this.musicVolume > 0) {
        this.playMusic(this.pendingMusicSrc, this.musicVolume);
      }
      this.pendingMusicSrc = null;

      window.removeEventListener('click', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
    };

    window.addEventListener('click', unlock, true);
    window.addEventListener('keydown', unlock, true);
    window.addEventListener('touchstart', unlock, true);
  }

  // Resolve path safely whether running from root, subfolder or relative path
  resolvePath(relativePath) {
    if (!relativePath) return '';
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) return relativePath;

    // In browser, handle relative to tic-tac-toe/ or root /
    if (typeof window !== 'undefined') {
      const clean = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
      // Try resolving directly
      return clean;
    }
    return relativePath;
  }

  playMusic(src = '/audio/sumi-e/music/zen-garden.mp3', volume = 0.0) {
    this.musicVolume = volume;
    if (!this.enabled || this.musicVolume <= 0) {
      this.stopMusic();
      return;
    }

    const resolved = this.resolvePath(src);

    if (this.music) {
      try {
        this.music.pause();
        this.music.currentTime = 0;
      } catch (e) {}
    }

    try {
      this.music = new Audio(resolved);
      this.music.loop = true;
      this.music.volume = Math.min(Math.max(this.musicVolume * this.volume, 0), 1);

      const playPromise = this.music.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Browser requires user interaction before autoplay
          this.pendingMusicSrc = src;
        });
      }
    } catch (e) {
      this.pendingMusicSrc = src;
    }
  }

  stopMusic() {
    if (!this.music) return;
    try {
      this.music.pause();
      this.music.currentTime = 0;
    } catch (e) {}
  }

  play(src, volume = 1.0) {
    if (!this.enabled) return null;

    try {
      const resolved = this.resolvePath(src);
      const sound = new Audio(resolved);
      const finalVolume = Math.min(Math.max(volume * this.sfxVolume * this.volume, 0), 1);
      sound.volume = finalVolume;

      const p = sound.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
      return sound;
    } catch (e) {
      return null;
    }
  }

  // Add an environmental ambience track
  playAmbience(src, volume = 0.12, loop = true) {
    if (!this.enabled) return null;

    try {
      const resolved = this.resolvePath(src);
      const amb = new Audio(resolved);
      amb.loop = loop;
      amb.volume = Math.min(Math.max(volume * this.ambienceVolume * this.volume, 0), 1);

      const p = amb.play();
      if (p !== undefined) {
        p.catch(() => {});
      }

      this.ambience.push({ audio: amb, baseVolume: volume, src });
      return amb;
    } catch (e) {
      return null;
    }
  }

  // Start complete Japanese Zen ambience layers (Wind & Birds & Water)
  startZenAmbience() {
    this.stopAmbience();
    if (!this.enabled) return;

    this.playAmbience('/audio/sumi-e/ambience/wind.mp3', 0.12);
    this.playAmbience('/audio/sumi-e/ambience/birds.mp3', 0.05);
  }

  stopAmbience() {
    this.ambience.forEach(item => {
      try {
        item.audio.pause();
        item.audio.currentTime = 0;
      } catch (e) {}
    });
    this.ambience = [];
  }

  // Volume Controls
  setVolume(value) {
    this.volume = Math.min(Math.max(value, 0), 1);
    this._syncVolumes();
    this._persist('sumi_audio_vol_master', this.volume);
  }

  setMusicVolume(value) {
    this.musicVolume = Math.min(Math.max(value, 0), 1);
    this._syncVolumes();
    this._persist('sumi_audio_vol_music', this.musicVolume);
  }

  setAmbienceVolume(value) {
    this.ambienceVolume = Math.min(Math.max(value, 0), 1);
    this._syncVolumes();
    this._persist('sumi_audio_vol_ambience', this.ambienceVolume);
  }

  setSfxVolume(value) {
    this.sfxVolume = Math.min(Math.max(value, 0), 1);
    this._persist('sumi_audio_vol_sfx', this.sfxVolume);
  }

  _syncVolumes() {
    if (this.music) {
      this.music.volume = Math.min(Math.max(this.musicVolume * this.volume, 0), 1);
    }
    this.ambience.forEach(item => {
      if (item.audio) {
        item.audio.volume = Math.min(Math.max(item.baseVolume * this.ambienceVolume * this.volume, 0), 1);
      }
    });
  }

  _persist(key, val) {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, val.toString());
      } catch (e) {}
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    this._persist('sumi_audio_enabled', this.enabled);

    if (!this.enabled) {
      this.stopMusic();
      this.stopAmbience();
    } else {
      if (this.musicVolume > 0) {
        this.playMusic('/audio/sumi-e/music/zen-garden.mp3', this.musicVolume);
      }
    }
    return this.enabled;
  }

  // Preset Game Actions
  playBrushMove(isAI = false) {
    if (isAI) {
      return this.play('/audio/sumi-e/brush/brush-light.mp3', 0.65);
    }
    return this.play('/audio/sumi-e/brush/brush-medium.mp3', 0.70);
  }

  playInkSplash() {
    return this.play('/audio/sumi-e/brush/ink-splash.mp3', 0.50);
  }

  playAIThinking() {
    return this.play('/audio/sumi-e/game/ai-thinking.mp3', 0.35);
  }

  playVictory() {
    return this.play('/audio/sumi-e/game/victory.mp3', 0.55);
  }

  playDefeat() {
    return this.play('/audio/sumi-e/game/defeat.mp3', 0.45);
  }

  playDraw() {
    return this.play('/audio/sumi-e/game/draw.mp3', 0.45);
  }

  playPaperWipe() {
    return this.play('/audio/sumi-e/ui/paper-wipe.mp3', 0.55);
  }

  playButton() {
    return this.play('/audio/sumi-e/ui/button.mp3', 0.30);
  }

  playToggle() {
    return this.play('/audio/sumi-e/ui/toggle.mp3', 0.35);
  }

  // Backward compatibility aliases
  playBrushStroke() { return this.playBrushMove(false); }
  playKotoPluck(isPlayer = true) { return this.playBrushMove(!isPlayer); }
  playZenBell() { return this.playVictory(); }
  playClapper() { return this.playButton(); }
  toggleMute() { return !this.toggle(); }
  get muted() { return !this.enabled; }
}

// Instantiate singleton instance
const sumiAudioInstance = new SumiAudioManager();

// Expose globally for vanilla browser scripts
if (typeof window !== 'undefined') {
  window.SumiAudioManager = SumiAudioManager;
  window.sumiAudio = sumiAudioInstance;
}

// CommonJS export support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sumiAudioInstance;
  module.exports.SumiAudioManager = SumiAudioManager;
}
