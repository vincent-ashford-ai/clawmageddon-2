// =============================================================================
// CLAWMAGEDDON 2 - PLAY.FUN INTEGRATION
// Wires game events to Play.fun points tracking
// =============================================================================

import { eventBus, Events } from './core/EventBus.js';

const GAME_ID = '1115ef0d-0af3-423c-a39b-106df9236221';
const GAME_KEY = 'BnELEAf8VQezQHRKkiKyhAa6LsTdYBo7yjpRrbo2uCVG';

let sdk = null;
let initialized = false;
let lastScore = 0;

/**
 * Initialize Play.fun SDK.
 * Call this after game loads.
 */
export async function initPlayFun() {
  // Check if SDK is loaded
  if (typeof window.PlayFunSDK === 'undefined' && typeof window.OpenGameSDK === 'undefined') {
    console.warn('[PlayFun] SDK not loaded — skipping monetization');
    return;
  }

  try {
    const SDKClass = typeof window.PlayFunSDK !== 'undefined' 
      ? window.PlayFunSDK 
      : window.OpenGameSDK;
    
    sdk = new SDKClass({
      gameId: GAME_ID,
      apiKey: GAME_KEY,
      ui: { usePointsWidget: true },
    });

    await sdk.init();
    initialized = true;
    console.log('[PlayFun] SDK initialized');

    wireEvents();
  } catch (err) {
    console.warn('[PlayFun] SDK init failed:', err);
  }
}

/**
 * Wire game events to Play.fun points.
 */
function wireEvents() {
  // Track score changes and award points for increases
  eventBus.on(Events.SCORE_CHANGED, ({ score }) => {
    if (!sdk || !initialized) return;
    
    const delta = score - lastScore;
    if (delta > 0) {
      sdk.addPoints(delta);
    }
    lastScore = score;
  });

  // Reset lastScore when game starts
  eventBus.on(Events.GAME_START, () => {
    lastScore = 0;
  });

  // Save points on game over
  eventBus.on(Events.GAME_OVER, () => {
    if (!sdk || !initialized) return;
    sdk.savePoints();
    lastScore = 0;
  });

  // Auto-save every 30 seconds during gameplay
  setInterval(() => {
    if (sdk && initialized) {
      sdk.savePoints();
    }
  }, 30000);

  // Save on page unload
  window.addEventListener('beforeunload', () => {
    if (sdk && initialized) {
      sdk.savePoints();
    }
  });
}
