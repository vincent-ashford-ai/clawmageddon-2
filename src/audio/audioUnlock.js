// =============================================================================
// CLAWMAGEDDON 2 - AUDIO UNLOCK
// Handles browser autoplay policy by unlocking Web Audio on first user gesture.
// Works on iOS Safari, Chrome, Firefox, and other mobile browsers.
// =============================================================================

let unlocked = false;
let unlockPromise = null;
let unlockResolvers = [];

/**
 * Check if audio has been unlocked.
 * @returns {boolean}
 */
export function isAudioUnlocked() {
  return unlocked;
}

/**
 * Get a promise that resolves when audio is unlocked.
 * Resolves immediately if already unlocked.
 * @returns {Promise<void>}
 */
export function whenAudioUnlocked() {
  if (unlocked) return Promise.resolve();
  if (!unlockPromise) {
    unlockPromise = new Promise((resolve) => {
      unlockResolvers.push(resolve);
    });
  }
  return unlockPromise;
}

/**
 * Unlock the Web Audio context.
 * Should be called from a user gesture (click/tap/keydown).
 * 
 * This function:
 * 1. Creates a temporary AudioContext if needed
 * 2. Resumes the context if suspended
 * 3. Plays a silent buffer to fully unlock (iOS requirement)
 * 
 * @param {AudioContext} [existingCtx] - Optional existing context to unlock
 * @returns {Promise<void>}
 */
export async function unlockAudio(existingCtx = null) {
  if (unlocked) return;

  console.log('[AudioUnlock] Unlocking audio...');

  try {
    // Create or use existing context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = existingCtx || new AudioContext();

    // Resume if suspended (required by most browsers)
    if (ctx.state === 'suspended') {
      await ctx.resume();
      console.log('[AudioUnlock] Context resumed');
    }

    // Play silent buffer to fully unlock (required by iOS Safari)
    const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);

    // Clean up the temporary context if we created one
    if (!existingCtx) {
      // Give it a moment then close
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 100);
    }

    unlocked = true;
    console.log('[AudioUnlock] Audio unlocked successfully');

    // Resolve all waiting promises
    unlockResolvers.forEach((resolve) => resolve());
    unlockResolvers = [];
  } catch (e) {
    console.warn('[AudioUnlock] Failed to unlock audio:', e);
    // Still mark as "unlocked" so we don't block forever
    unlocked = true;
    unlockResolvers.forEach((resolve) => resolve());
    unlockResolvers = [];
  }
}

/**
 * Set up one-time event listeners to unlock audio on first user interaction.
 * Call this early in app initialization.
 */
export function setupAudioUnlock() {
  if (unlocked) return;

  const events = ['click', 'touchstart', 'touchend', 'keydown'];
  
  const handleInteraction = () => {
    // Remove all listeners immediately to avoid double-unlock
    events.forEach((event) => {
      document.removeEventListener(event, handleInteraction, { capture: true });
    });
    
    unlockAudio();
  };

  events.forEach((event) => {
    document.addEventListener(event, handleInteraction, { capture: true, passive: true });
  });

  console.log('[AudioUnlock] Listeners registered');
}
