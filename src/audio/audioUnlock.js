// =============================================================================
// CLAWMAGEDDON 2 - AUDIO UNLOCK
// Handles browser autoplay policy by unlocking Web Audio on first user gesture.
// Works on iOS Safari, Chrome, Firefox, and other mobile browsers.
// 
// IMPORTANT: Uses dynamic imports to avoid loading Strudel before user gesture.
// This prevents "AudioContext was not allowed to start" errors on mobile.
// =============================================================================

// Strudel functions are loaded dynamically in unlockAudio()

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
 * Play a silent buffer synchronously to help unlock AudioContext.
 * The buffer creation and start() are sync; only onended callback is async.
 * @param {AudioContext} ctx - The AudioContext to unlock
 */
function playSilentBufferSync(ctx) {
  try {
    const buffer = ctx.createBuffer(1, 256, ctx.sampleRate);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
    console.log('[AudioUnlock] Silent buffer started');
  } catch (e) {
    console.warn('[AudioUnlock] Silent buffer failed:', e);
  }
}

/**
 * Wait for AudioContext to reach "running" state.
 * @param {AudioContext} ctx 
 * @param {number} timeoutMs 
 * @returns {Promise<boolean>} true if running, false if timeout
 */
async function waitForRunning(ctx, timeoutMs = 500) {
  if (ctx.state === 'running') return true;
  
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log('[AudioUnlock] Timeout waiting for running state, current:', ctx.state);
      resolve(false);
    }, timeoutMs);
    
    ctx.addEventListener('statechange', function handler() {
      if (ctx.state === 'running') {
        clearTimeout(timeout);
        ctx.removeEventListener('statechange', handler);
        resolve(true);
      }
    });
  });
}

/**
 * Complete the unlock process asynchronously.
 * Called AFTER AudioContext is created and resume() is called synchronously.
 * @param {AudioContext} ctx - The already-created AudioContext
 */
async function finishUnlockAsync(ctx) {
  try {
    // Wait for context to reach running state
    const isRunning = await waitForRunning(ctx, 1000);
    console.log('[AudioUnlock] Context running:', isRunning, 'state:', ctx.state);

    // Now safe to dynamically import Strudel
    try {
      const { initStrudel, setAudioContext } = await import('@strudel/web');
      setAudioContext(ctx);
      console.log('[AudioUnlock] Set Strudel AudioContext');
      initStrudel();
      console.log('[AudioUnlock] Strudel initialized');
    } catch (e) {
      console.warn('[AudioUnlock] Strudel init failed:', e);
    }

    unlocked = true;
    console.log('[AudioUnlock] Audio unlocked successfully, final state:', ctx.state);

    // Resolve all waiting promises
    unlockResolvers.forEach((resolve) => resolve());
    unlockResolvers = [];
  } catch (e) {
    console.warn('[AudioUnlock] Async unlock phase failed:', e);
    unlocked = true;
    unlockResolvers.forEach((resolve) => resolve());
    unlockResolvers = [];
  }
}

/**
 * Unlock the Web Audio context.
 * 
 * WARNING: For iOS Safari compatibility, prefer using setupAudioUnlock() which
 * handles the gesture properly. If you must call this directly from a gesture
 * handler, note that because this is an async function, iOS may break the
 * gesture chain. Consider creating the AudioContext BEFORE calling this.
 * 
 * @param {AudioContext} [existingCtx] - Optional existing context to unlock
 * @returns {Promise<void>}
 */
export async function unlockAudio(existingCtx = null) {
  if (unlocked) return;

  console.log('[AudioUnlock] unlockAudio() called');

  try {
    let ctx = existingCtx;
    
    // If no context provided, create one (may not work on iOS if called from async context)
    if (!ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioContextClass();
      console.log('[AudioUnlock] AudioContext created, state:', ctx.state);
      
      // Call resume synchronously
      ctx.resume();
      console.log('[AudioUnlock] resume() called');
      
      // Play silent buffer
      playSilentBufferSync(ctx);
    }

    // Continue with async operations
    await finishUnlockAsync(ctx);
  } catch (e) {
    console.warn('[AudioUnlock] Failed to unlock audio:', e);
    unlocked = true;
    unlockResolvers.forEach((resolve) => resolve());
    unlockResolvers = [];
  }
}

/**
 * Set up one-time event listeners to unlock audio on first user interaction.
 * Call this early in app initialization.
 * 
 * CRITICAL FOR iOS SAFARI:
 * AudioContext MUST be created synchronously in the event handler.
 * ANY async operation (even calling an async function) before creation breaks the gesture chain.
 */
export function setupAudioUnlock() {
  if (unlocked) return;

  const events = ['click', 'touchstart', 'touchend', 'keydown'];
  
  const handleInteraction = (event) => {
    // Remove all listeners immediately to avoid double-unlock
    events.forEach((ev) => {
      document.removeEventListener(ev, handleInteraction, { capture: true });
    });
    
    // =============================================================
    // iOS SAFARI FIX: Create AudioContext SYNCHRONOUSLY here
    // This MUST happen before ANY async operations, promises, or
    // even calling an async function. iOS breaks the gesture chain
    // if we enter an async function first.
    // =============================================================
    console.log('[AudioUnlock] User gesture detected:', event.type);
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    console.log('[AudioUnlock] AudioContext created, state:', ctx.state);
    
    // Call resume() synchronously - this kicks off the unlock
    // The promise resolves when the context is running
    const resumePromise = ctx.resume();
    console.log('[AudioUnlock] resume() called, state now:', ctx.state);
    
    // Play silent buffer synchronously to force unlock on some browsers
    playSilentBufferSync(ctx);
    
    // Check resume result (don't await, just log)
    resumePromise.then(() => {
      console.log('[AudioUnlock] resume() promise resolved, state:', ctx.state);
    }).catch((err) => {
      console.warn('[AudioUnlock] resume() promise rejected:', err);
    });
    
    // NOW we can do async stuff - context is already created and resuming
    finishUnlockAsync(ctx);
  };

  events.forEach((event) => {
    document.addEventListener(event, handleInteraction, { capture: true, passive: true });
  });

  console.log('[AudioUnlock] Listeners registered');
}
