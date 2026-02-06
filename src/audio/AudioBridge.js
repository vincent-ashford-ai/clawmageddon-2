// =============================================================================
// CLAWMAGEDDON 2 - AUDIO BRIDGE
// Wires EventBus events to audio playback.
// Listens for game events and triggers appropriate BGM/SFX.
// =============================================================================

import { eventBus, Events } from '../core/EventBus.js';
import { audioManager } from './AudioManager.js';
import { menuTheme, gameplayTheme, gameOverTheme, heavyMetalTheme } from './music.js';
import {
  jumpSfx,
  doubleJumpSfx,
  shootSfx,
  enemyHitSfx,
  enemyDeathSfx,
  playerDamageSfx,
  playerDeathSfx,
  powerupCollectSfx,
  nukeExplosionSfx,
  healthRestoreSfx,
  setSfxMuted,
} from './sfx.js';

let bridgeInitialized = false;

/**
 * Initialize the audio bridge.
 * Sets up all event listeners for audio triggers.
 */
export function initAudioBridge() {
  if (bridgeInitialized) return;
  bridgeInitialized = true;

  console.log('[AudioBridge] Initializing...');

  // ==========================================================================
  // AUDIO SYSTEM EVENTS
  // ==========================================================================

  // Init audio on first user interaction (required by browser autoplay policy)
  eventBus.on(Events.AUDIO_INIT, () => {
    audioManager.init();
  });

  // ==========================================================================
  // BGM TRANSITIONS (Strudel)
  // ==========================================================================

  eventBus.on(Events.MUSIC_MENU, () => {
    audioManager.playMusic(menuTheme);
  });

  eventBus.on(Events.MUSIC_GAMEPLAY, () => {
    audioManager.playMusic(gameplayTheme);
  });

  eventBus.on(Events.MUSIC_GAMEOVER, () => {
    audioManager.playMusic(gameOverTheme);
  });

  eventBus.on(Events.MUSIC_STOP, () => {
    audioManager.stopMusic();
  });

  // Heavy Metal powerup - switch to intense metal theme
  eventBus.on(Events.HEAVY_METAL_START, () => {
    audioManager.playMusic(heavyMetalTheme);
  });

  eventBus.on(Events.HEAVY_METAL_END, () => {
    // Return to regular gameplay music
    audioManager.playMusic(gameplayTheme);
  });

  // ==========================================================================
  // SFX TRIGGERS (Web Audio API)
  // ==========================================================================

  // Player actions
  eventBus.on(Events.PLAYER_JUMP, () => {
    jumpSfx();
  });

  eventBus.on(Events.PLAYER_DOUBLE_JUMP, () => {
    doubleJumpSfx();
  });

  eventBus.on(Events.PLAYER_SHOOT, () => {
    shootSfx();
  });

  eventBus.on(Events.PLAYER_DAMAGED, () => {
    playerDamageSfx();
  });

  eventBus.on(Events.PLAYER_DIED, () => {
    playerDeathSfx();
  });

  // Combat
  eventBus.on(Events.ENEMY_HIT, () => {
    enemyHitSfx();
  });

  eventBus.on(Events.ENEMY_KILLED, () => {
    enemyDeathSfx();
  });

  eventBus.on(Events.NUKE_TRIGGERED, () => {
    nukeExplosionSfx();
  });

  // Power-ups
  eventBus.on(Events.POWERUP_COLLECTED, (data) => {
    // Different sound for health vs other powerups
    if (data && data.type === 'health') {
      healthRestoreSfx();
    } else {
      powerupCollectSfx();
    }
  });

  eventBus.on(Events.HEALTH_RESTORED, () => {
    healthRestoreSfx();
  });

  console.log('[AudioBridge] Ready');
}

/**
 * Toggle global mute for both BGM and SFX.
 * @returns {boolean} New muted state
 */
export function toggleMute() {
  const muted = audioManager.toggleMute();
  setSfxMuted(muted);
  return muted;
}

/**
 * Set global mute state.
 * @param {boolean} muted
 */
export function setMuted(muted) {
  audioManager.setMuted(muted);
  setSfxMuted(muted);
}
