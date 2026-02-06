import Phaser from 'phaser';
import { GameConfig } from './core/GameConfig.js';
import { eventBus, Events } from './core/EventBus.js';
import { gameState } from './core/GameState.js';
import { initAudioBridge, toggleMute } from './audio/AudioBridge.js';

// Initialize audio bridge (wires EventBus to audio system)
initAudioBridge();

// Initialize audio on first user interaction (required by browser autoplay policy)
const initAudioOnce = () => {
  eventBus.emit(Events.AUDIO_INIT);
  document.removeEventListener('click', initAudioOnce);
  document.removeEventListener('touchstart', initAudioOnce);
  document.removeEventListener('keydown', initAudioOnce);
};
document.addEventListener('click', initAudioOnce, { once: true });
document.addEventListener('touchstart', initAudioOnce, { once: true });
document.addEventListener('keydown', initAudioOnce, { once: true });

const game = new Phaser.Game(GameConfig);

// Expose for Playwright testing
window.__GAME__ = game;
window.__GAME_STATE__ = gameState;
window.__EVENT_BUS__ = eventBus;
window.__EVENTS__ = Events;
window.__AUDIO_TOGGLE_MUTE__ = toggleMute;
