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
 * Play a silent sound to force AudioContext into "running" state.
 * This is the key trick for mobile browsers - the context must actually
 * play audio during a user gesture to be considered "unlocked".
 * 
 * @param {AudioContext} ctx - The AudioContext to unlock
 * @returns {Promise<void>} Resolves when context is in "running" state
 */
async function playSilentSound(ctx) {
  return new Promise((resolve) => {
    // Create a short silent buffer (256 samples is enough to trigger unlock)
    const buffer = ctx.createBuffer(1, 256, ctx.sampleRate);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    // When the buffer finishes playing, the context should be unlocked
    source.onended = () => {
      console.log('[AudioUnlock] Silent buffer finished, state:', ctx.state);
      resolve();
    };
    
    source.start(0);
    console.log('[AudioUnlock] Silent buffer started');
    
    // Fallback timeout in case onended doesn't fire
    setTimeout(resolve, 100);
  });
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
 * Unlock the Web Audio context.
 * Should be called from a user gesture (click/tap/keydown).
 * 
 * This function:
 * 1. Creates AudioContext synchronously in the gesture
 * 2. Plays a silent sound to force "running" state
 * 3. Waits for context to be running BEFORE initializing Strudel
 * 4. Then initializes Strudel with the unlocked context
 * 
 * @param {AudioContext} [existingCtx] - Optional existing context to unlock
 * @returns {Promise<void>}
 */
export async function unlockAudio(existingCtx = null) {
  if (unlocked) return;

  console.log('[AudioUnlock] Unlocking audio...');

  try {
    // STEP 1: Create AudioContext synchronously in the user gesture
    // This MUST happen before any async operations
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = existingCtx || new AudioContext();
    console.log('[AudioUnlock] AudioContext created, state:', ctx.state);

    // STEP 2: Start resume() - kicks off the unlock process
    // Must be called synchronously in the gesture context
    const resumePromise = ctx.resume();
    console.log('[AudioUnlock] resume() called');

    // STEP 3: Play silent sound to force the context into running state
    // This is the key mobile hack - playing actual audio (even silent)
    // during the gesture properly unlocks the context
    await playSilentSound(ctx);

    // STEP 4: Wait for resume to complete
    await resumePromise;
    console.log('[AudioUnlock] resume() completed, state:', ctx.state);

    // STEP 5: Wait for context to actually be running
    const isRunning = await waitForRunning(ctx, 500);
    console.log('[AudioUnlock] Context running:', isRunning, 'state:', ctx.state);

    // STEP 6: Dynamically import and initialize Strudel (context is fully unlocked)
    // Using dynamic import ensures Strudel doesn't load until user gesture
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
