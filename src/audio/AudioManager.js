// =============================================================================
// CLAWMAGEDDON 2 - AUDIO MANAGER
// Singleton that handles Strudel BGM init, playback, and mute toggle.
// SFX are handled separately via Web Audio API in sfx.js.
// =============================================================================

import { initStrudel, hush } from '@strudel/web';

class AudioManager {
  constructor() {
    this.initialized = false;
    this.currentMusic = null;
    this.muted = false;
    this.pendingMusic = null; // Queue for music requested before init
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
   * @param {Function} patternFn - Function that returns a Strudel pattern with .play()
   */
  playMusic(patternFn) {
    // If not initialized yet, queue it for later
    if (!this.initialized) {
      console.log('[Audio] Queuing music (not initialized yet)');
      this.pendingMusic = patternFn;
      return;
    }
    if (this.muted) return;
    this.stopMusic();
    // hush() needs a scheduler tick to process before new pattern starts
    setTimeout(() => {
      try {
        this.currentMusic = patternFn();
      } catch (e) {
        console.warn('[Audio] BGM error:', e);
      }
    }, 100);
  }

  /**
   * Stop all currently playing music.
   */
  stopMusic() {
    if (!this.initialized) return;
    try {
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
      this.stopMusic();
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
      this.stopMusic();
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
