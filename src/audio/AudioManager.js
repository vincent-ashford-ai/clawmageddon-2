// =============================================================================
// CLAWMAGEDDON 2 - AUDIO MANAGER
// Singleton that handles Strudel BGM init, playback, and mute toggle.
// SFX are handled separately via Web Audio API in sfx.js.
// 
// IMPORTANT: Uses dynamic imports to avoid loading Strudel before user gesture.
// This prevents "AudioContext was not allowed to start" errors on mobile.
// =============================================================================

// Strudel functions are loaded dynamically

class AudioManager {
  constructor() {
    this.initialized = false;
    this.currentMusic = null;
    this.muted = false;
    this.pendingMusic = null; // Queue for music requested before init
    this.strudelModule = null; // Cached Strudel module
  }
  
  /**
   * Get or load Strudel module.
   * @returns {Promise<object>} Strudel module
   */
  async getStrudel() {
    if (!this.strudelModule) {
      this.strudelModule = await import('@strudel/web');
    }
    return this.strudelModule;
  }

  /**
   * Initialize Strudel audio engine.
   * Note: Strudel is now initialized directly in audioUnlock.js during the user gesture.
   * This function just marks the manager as ready.
   */
  init() {
    if (this.initialized) return;
    // Strudel is already initialized by audioUnlock.js in the user gesture context
    // We just need to mark ourselves as ready
    this.initialized = true;
    console.log('[Audio] AudioManager ready');
    
    // Play any pending music that was requested before init
    if (this.pendingMusic && !this.muted) {
      console.log('[Audio] Playing pending music');
      this.playMusic(this.pendingMusic);
      this.pendingMusic = null;
    }
  }

  /**
   * Play a BGM pattern. Stops current music first.
   * @param {Function} patternFn - Async function that returns a Strudel pattern with .play()
   */
  async playMusic(patternFn) {
    // If not initialized yet, queue it for later
    if (!this.initialized) {
      console.log('[Audio] Queuing music (not initialized yet)');
      this.pendingMusic = patternFn;
      return;
    }
    if (this.muted) return;
    await this.stopMusic();
    // hush() needs a scheduler tick to process before new pattern starts
    setTimeout(async () => {
      try {
        // patternFn is now async (uses dynamic import)
        this.currentMusic = await patternFn();
      } catch (e) {
        console.warn('[Audio] BGM error:', e);
      }
    }, 100);
  }

  /**
   * Stop all currently playing music.
   */
  async stopMusic() {
    if (!this.initialized) return;
    try {
      const { hush } = await this.getStrudel();
      hush();
    } catch (e) {
      // noop - might not have anything playing
    }
    this.currentMusic = null;
  }

  /**
   * Toggle mute state. Stops music if muting.
   * @returns {boolean} New muted state
   */
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopMusic(); // async but we don't need to wait
    }
    console.log('[Audio] Muted:', this.muted);
    return this.muted;
  }

  /**
   * Set mute state explicitly.
   * @param {boolean} muted
   */
  setMuted(muted) {
    this.muted = muted;
    if (this.muted) {
      this.stopMusic(); // async but we don't need to wait
    }
  }

  /**
   * Check if audio is muted.
   * @returns {boolean}
   */
  isMuted() {
    return this.muted;
  }
}

export const audioManager = new AudioManager();
