import Phaser from 'phaser';
import { GameConfig } from './core/GameConfig.js';
import { eventBus, Events } from './core/EventBus.js';
import { gameState } from './core/GameState.js';
import { initAudioBridge, toggleMute } from './audio/AudioBridge.js';
import { setupAudioUnlock, whenAudioUnlocked } from './audio/audioUnlock.js';

// Set up audio unlock listeners FIRST (before Phaser, before anything else)
// This ensures we catch the very first user interaction
setupAudioUnlock();

// Initialize audio bridge (wires EventBus to audio system)
initAudioBridge();

// Initialize audio systems after unlock (required by browser autoplay policy)
whenAudioUnlocked().then(() => {
  eventBus.emit(Events.AUDIO_INIT);
  // Emit ready event so scenes can start playing music
  eventBus.emit(Events.AUDIO_READY);
});

const game = new Phaser.Game(GameConfig);

// Expose for Playwright testing
window.__GAME__ = game;
window.__GAME_STATE__ = gameState;
window.__EVENT_BUS__ = eventBus;
window.__EVENTS__ = Events;
window.__AUDIO_TOGGLE_MUTE__ = toggleMute;
