// =============================================================================
// CLAWMAGEDDON 2 - SOUND EFFECTS
// Web Audio API one-shot sounds. 8-bit arcade style.
// These do NOT use Strudel - they fire once and stop immediately.
// =============================================================================

import { isAudioUnlocked } from './audioUnlock.js';

let audioCtx = null;
let sfxMuted = false;

/**
 * Get or create the AudioContext.
 * Returns null if audio hasn't been unlocked yet (prevents suspended context issues on mobile).
 */
function getCtx() {
  // Don't create context until audio is unlocked (mobile browsers)
  if (!isAudioUnlocked()) {
    return null;
  }
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Set SFX mute state.
 */
export function setSfxMuted(muted) {
  sfxMuted = muted;
}

/**
 * Check if SFX are muted.
 */
export function isSfxMuted() {
  return sfxMuted;
}

/**
 * Play a single tone that stops after duration.
 */
function playTone(freq, type, duration, gain = 0.3, filterFreq = 4000) {
  if (sfxMuted) return;
  const ctx = getCtx();
  if (!ctx) return; // Audio not unlocked yet
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFreq, now);

  osc.connect(filter).connect(gainNode).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

/**
 * Play a sequence of tones.
 */
function playNotes(notes, type, noteDuration, gap, gain = 0.3, filterFreq = 4000) {
  if (sfxMuted) return;
  const ctx = getCtx();
  if (!ctx) return; // Audio not unlocked yet
  const now = ctx.currentTime;

  notes.forEach((freq, i) => {
    const start = now + i * gap;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gain, start);
    gainNode.gain.exponentialRampToValueAtTime(0.001, start + noteDuration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, start);

    osc.connect(filter).connect(gainNode).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + noteDuration);
  });
}

/**
 * Play a frequency sweep (pitch bend).
 */
function playSweep(startFreq, endFreq, type, duration, gain = 0.3, filterFreq = 4000) {
  if (sfxMuted) return;
  const ctx = getCtx();
  if (!ctx) return; // Audio not unlocked yet
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFreq, now);

  osc.connect(filter).connect(gainNode).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

/**
 * Play noise burst (explosions, impacts).
 */
function playNoise(duration, gain = 0.2, lpfFreq = 4000, hpfFreq = 0) {
  if (sfxMuted) return;
  const ctx = getCtx();
  if (!ctx) return; // Audio not unlocked yet
  const now = ctx.currentTime;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  const lpf = ctx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.setValueAtTime(lpfFreq, now);

  if (hpfFreq > 0) {
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.setValueAtTime(hpfFreq, now);
    source.connect(hpf).connect(lpf).connect(gainNode).connect(ctx.destination);
  } else {
    source.connect(lpf).connect(gainNode).connect(ctx.destination);
  }

  source.start(now);
  source.stop(now + duration);
}

// =============================================================================
// GAME SFX - Post-apocalyptic 8-bit sounds for The Lobster
// =============================================================================

/**
 * Jump SFX - Quick upward pitch sweep, classic platformer feel.
 */
export function jumpSfx() {
  playSweep(200, 600, 'square', 0.12, 0.25, 3000);
}

/**
 * Double Jump SFX - Higher pitched, more energetic.
 */
export function doubleJumpSfx() {
  playSweep(400, 900, 'square', 0.1, 0.22, 4000);
}

/**
 * Shoot SFX - Short laser zap, aggressive.
 */
export function shootSfx() {
  playSweep(800, 200, 'square', 0.08, 0.2, 3500);
}

/**
 * Enemy Hit SFX - Thump when bullet connects.
 */
export function enemyHitSfx() {
  playTone(150, 'square', 0.08, 0.25, 1500);
}

/**
 * Enemy Death SFX - Explosion pop with descending tone.
 */
export function enemyDeathSfx() {
  // Noise burst + descending tone combo
  playNoise(0.15, 0.25, 2000, 200);
  playSweep(400, 80, 'square', 0.2, 0.2, 1200);
}

/**
 * Player Damage SFX - Painful hit, screen shake companion.
 */
export function playerDamageSfx() {
  // Low crunch + high alarm
  playTone(80, 'square', 0.15, 0.3, 800);
  playTone(440, 'square', 0.1, 0.15, 2000);
}

/**
 * Player Death SFX - Classic game over death sound.
 * Descending chromatic notes of despair.
 */
export function playerDeathSfx() {
  playNotes(
    [392, 349, 311, 277, 247, 220, 196, 175],
    'square',
    0.12,
    0.08,
    0.28,
    2000
  );
}

/**
 * Powerup Collect SFX - Triumphant ascending arpeggio.
 */
export function powerupCollectSfx() {
  playNotes(
    [262, 330, 392, 523, 659],
    'square',
    0.08,
    0.05,
    0.25,
    5000
  );
}

/**
 * Nuke Explosion SFX - Massive boom, screen-clearing devastation.
 */
export function nukeExplosionSfx() {
  // Big noise burst
  playNoise(0.5, 0.35, 1500, 50);
  // Sub bass thump
  playTone(40, 'sine', 0.4, 0.35, 200);
  // High crackle
  playNoise(0.3, 0.2, 8000, 2000);
  // Ascending then descending tone (mushroom cloud rising)
  const ctx = getCtx();
  if (!ctx) return; // Audio not unlocked yet
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(100, now);
  osc.frequency.linearRampToValueAtTime(400, now + 0.2);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, now);
  
  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.6);
}

/**
 * Health Restore SFX - Soft positive chime.
 */
export function healthRestoreSfx() {
  playNotes([523, 659], 'triangle', 0.15, 0.1, 0.2, 4000);
}

/**
 * UI Click SFX - Menu selection.
 */
export function uiClickSfx() {
  playTone(523, 'square', 0.05, 0.15, 5000);
}

/**
 * Score Ding SFX - Quick notification.
 */
export function scoreDingSfx() {
  playTone(880, 'square', 0.06, 0.12, 6000);
}
