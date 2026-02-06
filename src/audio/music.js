// =============================================================================
// CLAWMAGEDDON 2 - MUSIC (BGM)
// Strudel patterns for background music.
// Post-apocalyptic, intense, 8-bit chiptune style.
// =============================================================================

import { note, stack } from '@strudel/web';

// =============================================================================
// SYNTHESIZED DRUMS (no samples needed - works immediately)
// =============================================================================

// Kick drum - sine wave with pitch drop
const kick = () => note('c1').s('sine').gain(0.5).decay(0.15).sustain(0);

// Snare - noise burst with tone
const snare = () => note('c3').s('square').gain(0.25).decay(0.08).sustain(0).lpf(2000);

// Hi-hat - high noise burst  
const hihat = () => note('c6').s('square').gain(0.12).decay(0.03).sustain(0).hpf(8000);

// Open hi-hat - longer decay
const openhat = () => note('c6').s('square').gain(0.15).decay(0.12).sustain(0).hpf(6000);

/**
 * Menu Theme - Tense, atmospheric, building anticipation
 * Dark and brooding, hints at the chaos to come.
 */
export function menuTheme() {
  return stack(
    // Ominous bass drone - low rumble of the wasteland
    note('e1 ~ ~ ~ e1 ~ ~ ~ d1 ~ ~ ~ a0 ~ ~ ~')
      .s('sawtooth')
      .gain(0.18)
      .lpf(300)
      .slow(2),
    
    // Tension pad - minor chords, slow swell
    note('<e2,g2,b2> ~ ~ ~ <d2,f2,a2> ~ ~ ~ <c2,e2,g2> ~ ~ ~ <a1,c2,e2> ~ ~ ~')
      .s('triangle')
      .attack(0.8)
      .decay(1.5)
      .sustain(0.3)
      .release(1.0)
      .gain(0.12)
      .lpf(1200)
      .room(0.5)
      .slow(2),
    
    // Sparse high notes - distant warning signals
    note('~ ~ b4 ~ ~ ~ e4 ~ ~ ~ g4 ~ ~ ~ ~ ~')
      .s('square')
      .gain(0.08)
      .lpf(2000)
      .decay(0.3)
      .sustain(0)
      .delay(0.3)
      .delaytime(0.4)
      .delayfeedback(0.4)
      .slow(2),
    
    // Heartbeat-like pulse - tension builder
    note('e2 ~ e2 ~ ~ ~ ~ ~ e2 ~ e2 ~ ~ ~ ~ ~')
      .s('sine')
      .gain(0.15)
      .lpf(500)
      .decay(0.15)
      .sustain(0)
      .slow(2)
  ).cpm(70).play();
}

/**
 * Gameplay Theme - CHIPTUNE METAL ASSAULT
 * 8-bar loop (~12 seconds at 160 BPM)
 * Structure: 4-bar main riff → 4-bar breakdown/variation → loop
 * Key: E minor (the metal standard)
 * 
 * Note: cpm(5) = 5 cycles/min = 12 sec/cycle, giving us 160 BPM feel
 * (160 BPM = 40 bars/min, 8 bars/pattern = 5 patterns/min)
 */
export function gameplayTheme() {
  return stack(
    // =========================================================================
    // CHUGGING RHYTHM GUITAR - Palm-muted power chord simulation
    // The backbone of metal: relentless 8th note chugging with accents
    // =========================================================================
    note(`
      [e2 e2 e2 e2 e2 e2 e2 e2] [e2 e2 e2 e2 g2 g2 a2 a2]
      [e2 e2 e2 e2 e2 e2 e2 e2] [b1 b1 b1 b1 c2 c2 d2 d2]
      [e2 e2 e2 e2 e2 e2 g2 a2] [b2 b2 a2 a2 g2 g2 e2 e2]
      [e2 e2 e2 e2 e2 e2 e2 e2] [d2 d2 d2 d2 e2 ~ ~ ~]
    `)
      .s('sawtooth')
      .gain(0.24)
      .lpf(800)
      .decay(0.08)
      .sustain(0.3)
      .release(0.05),

    // =========================================================================
    // POWER CHORD STABS - Accented hits for punch
    // Doubled 5ths for that thick metal sound
    // =========================================================================
    note(`
      [e2,b2 ~ ~ ~ e2,b2 ~ ~ ~] [~ ~ ~ ~ g2,d3 ~ a2,e3 ~]
      [e2,b2 ~ ~ ~ e2,b2 ~ ~ ~] [b1,f#2 ~ ~ ~ c2,g2 ~ d2,a2 ~]
      [e2,b2 ~ ~ ~ ~ ~ g2,d3 a2,e3] [b2,f#3 ~ a2,e3 ~ g2,d3 ~ e2,b2 ~]
      [e2,b2 ~ ~ ~ e2,b2 ~ ~ ~] [d2,a2 ~ ~ ~ e2,b2 ~ ~ ~]
    `)
      .s('sawtooth')
      .gain(0.18)
      .lpf(1200)
      .decay(0.15)
      .sustain(0.4)
      .release(0.1),

    // =========================================================================
    // LEAD MELODY - Aggressive square wave shred
    // Bars 1-4: Main hook, Bars 5-8: Variation/response
    // =========================================================================
    note(`
      [e5 ~ g5 e5 ~ b4 ~ g4] [a4 ~ b4 ~ d5 ~ e5 ~]
      [e5 ~ d5 ~ b4 ~ g4 ~] [a4 b4 d5 ~ ~ ~ ~ ~]
      [g5 ~ ~ e5 ~ ~ d5 ~] [e5 g5 a5 ~ b5 ~ a5 g5]
      [e5 ~ ~ ~ g5 ~ e5 ~] [d5 ~ b4 ~ ~ ~ ~ ~]
    `)
      .s('square')
      .gain(0.14)
      .lpf(3200)
      .decay(0.1)
      .sustain(0.5)
      .release(0.15),

    // =========================================================================
    // HARMONY LEAD - Thirds/fifths above for thickness
    // =========================================================================
    note(`
      [g5 ~ b5 g5 ~ d5 ~ b4] [c5 ~ d5 ~ f#5 ~ g5 ~]
      [g5 ~ f#5 ~ d5 ~ b4 ~] [c5 d5 f#5 ~ ~ ~ ~ ~]
      [b5 ~ ~ g5 ~ ~ f#5 ~] [g5 b5 c6 ~ d6 ~ c6 b5]
      [g5 ~ ~ ~ b5 ~ g5 ~] [f#5 ~ d5 ~ ~ ~ ~ ~]
    `)
      .s('square')
      .gain(0.08)
      .lpf(4000)
      .decay(0.1)
      .sustain(0.4)
      .release(0.15),

    // =========================================================================
    // BASS - Octave-doubled root notes, tight and punchy
    // Follows the chord progression with some rhythmic variation
    // =========================================================================
    note(`
      [e1 ~ ~ e1 ~ ~ e1 ~] [e1 ~ ~ ~ g1 ~ a1 ~]
      [e1 ~ ~ e1 ~ ~ e1 ~] [b0 ~ ~ ~ c1 ~ d1 ~]
      [e1 ~ ~ e1 ~ ~ g1 a1] [b1 ~ a1 ~ g1 ~ e1 ~]
      [e1 ~ ~ e1 ~ ~ e1 ~] [d1 ~ ~ ~ e1 ~ ~ ~]
    `)
      .s('sawtooth')
      .gain(0.28)
      .lpf(400)
      .decay(0.12)
      .sustain(0.5),

    // =========================================================================
    // DRUMS - Synthesized metal kit (no samples needed)
    // =========================================================================
    
    // Kick drum - driving double-kick pattern (sine wave with pitch drop)
    note(`
      [c1 c1 ~ c1 c1 ~ c1 c1] [c1 c1 ~ c1 c1 c1 c1 c1]
      [c1 c1 ~ c1 c1 ~ c1 c1] [c1 c1 c1 c1 c1 c1 c1 c1]
      [c1 c1 ~ c1 c1 ~ c1 c1] [c1 ~ c1 ~ c1 ~ c1 c1]
      [c1 c1 ~ c1 c1 ~ c1 c1] [c1 c1 c1 c1 c1 ~ ~ ~]
    `)
      .s('sine')
      .gain(0.45)
      .decay(0.12)
      .sustain(0),

    // Snare - backbeat with fills (noise-like square)
    note(`
      [~ ~ c4 ~ ~ ~ c4 ~] [~ ~ c4 ~ ~ ~ c4 ~]
      [~ ~ c4 ~ ~ ~ c4 ~] [~ ~ c4 ~ c4 c4 c4 c4]
      [~ ~ c4 ~ ~ ~ c4 ~] [~ ~ c4 ~ ~ ~ c4 ~]
      [~ ~ c4 ~ ~ ~ c4 ~] [c4 ~ c4 ~ c4 ~ ~ ~]
    `)
      .s('square')
      .gain(0.28)
      .decay(0.08)
      .sustain(0)
      .lpf(2500)
      .hpf(200),

    // Hi-hats - 16th note drive (high square bursts)
    note(`
      [g7 g7 g7 g7 g7 g7 a7 g7]*4
      [g7 g7 g7 g7 g7 g7 a7 g7]*3 [g7 g7 g7 g7 a7 a7 a7 a7]
    `)
      .s('square')
      .gain(0.14)
      .decay(0.025)
      .sustain(0)
      .hpf(8000),

    // Crash accents on section changes
    note(`
      [a7 ~ ~ ~ ~ ~ ~ ~] [~ ~ ~ ~ ~ ~ ~ ~]
      [~ ~ ~ ~ ~ ~ ~ ~] [~ ~ ~ ~ ~ ~ ~ ~]
      [a7 ~ ~ ~ ~ ~ ~ ~] [~ ~ ~ ~ ~ ~ ~ ~]
      [~ ~ ~ ~ ~ ~ ~ ~] [~ ~ ~ ~ a7 ~ ~ ~]
    `)
      .s('square')
      .gain(0.18)
      .decay(0.15)
      .sustain(0)
      .hpf(5000),

    // =========================================================================
    // TEXTURE - Fast arpeggio for chiptune shimmer
    // =========================================================================
    note('<e4 g4 b4 e5 b4 g4>*8')
      .s('triangle')
      .gain(0.05)
      .lpf('<1500 2000 2500 2000>')
      .decay(0.04)
      .sustain(0)

  ).cpm(5).play();
}

/**
 * Heavy Metal Powerup Theme - MAXIMUM OVERDRIVE
 * 8-bar loop (~12 seconds) - plays during Heavy Metal powerup
 * Even more intense than gameplay theme - power fantasy moment!
 * Key: E minor, faster tempo feel, more aggressive
 * 
 * Note: cpm(5) = 5 cycles/min = 12 sec/cycle
 * Internal patterns are denser for that frantic metal feel
 */
export function heavyMetalTheme() {
  return stack(
    // =========================================================================
    // BRUTAL RHYTHM - Galloping palm-muted mayhem
    // Classic metal gallop: 1-&-a pattern, relentless
    // =========================================================================
    note(`
      [e2 e2 e2 e2 e2 e2 e2 e2 e2 e2 e2 e2 e2 e2 e2 e2]
      [g2 g2 g2 g2 a2 a2 a2 a2 b2 b2 b2 b2 a2 a2 g2 g2]
      [e2 e2 e2 e2 e2 e2 e2 e2 f#2 f#2 f#2 f#2 g2 g2 a2 a2]
      [b2 b2 a2 a2 g2 g2 f#2 f#2 e2 e2 e2 e2 e2 ~ e2 ~]
      [e2 e2 e2 e2 g2 g2 a2 a2 b2 b2 b2 b2 d3 d3 d3 d3]
      [e3 e3 d3 d3 b2 b2 a2 a2 g2 g2 g2 g2 e2 e2 e2 e2]
      [e2 e2 f#2 f#2 g2 g2 a2 a2 b2 b2 a2 a2 g2 g2 f#2 f#2]
      [e2 e2 e2 e2 e2 e2 e2 e2 e2 ~ ~ ~ e2 ~ ~ ~]
    `)
      .s('sawtooth')
      .gain(0.28)
      .lpf(900)
      .decay(0.06)
      .sustain(0.25)
      .release(0.03),

    // =========================================================================
    // POWER CHORD ASSAULT - Crushing doubled 5ths
    // Big stabs on the accents
    // =========================================================================
    note(`
      [e2,b2,e3 ~ ~ ~ e2,b2,e3 ~ ~ ~ e2,b2,e3 ~ ~ ~ e2,b2,e3 ~ ~ ~]
      [g2,d3,g3 ~ ~ ~ a2,e3,a3 ~ ~ ~ b2,f#3,b3 ~ ~ ~ a2,e3,a3 ~ ~ ~]
      [e2,b2,e3 ~ ~ ~ e2,b2,e3 ~ ~ ~ f#2,c#3,f#3 ~ ~ ~ g2,d3,g3 ~ a2,e3,a3 ~]
      [b2,f#3,b3 ~ a2,e3,a3 ~ g2,d3,g3 ~ f#2,c#3,f#3 ~ e2,b2,e3 ~ ~ ~ ~ ~]
      [e2,b2,e3 ~ ~ ~ g2,d3,g3 ~ a2,e3,a3 ~ b2,f#3,b3 ~ ~ ~ d3,a3,d4 ~ ~ ~]
      [e3,b3,e4 ~ d3,a3,d4 ~ b2,f#3,b3 ~ a2,e3,a3 ~ g2,d3,g3 ~ ~ ~ e2,b2,e3 ~]
      [e2,b2,e3 ~ f#2,c#3,f#3 ~ g2,d3,g3 ~ a2,e3,a3 ~ b2,f#3,b3 ~ a2,e3,a3 ~ g2,d3,g3 ~]
      [e2,b2,e3 ~ ~ ~ e2,b2,e3 ~ ~ ~ e2,b2,e3 ~ ~ ~ ~ ~ ~ ~]
    `)
      .s('sawtooth')
      .gain(0.22)
      .lpf(1400)
      .decay(0.12)
      .sustain(0.5)
      .release(0.08),

    // =========================================================================
    // SHRED LEAD - Blazing fast arpeggios and runs
    // Maximum intensity solo vibes
    // =========================================================================
    note(`
      [e5 g5 b5 e6 b5 g5 e5 b4] [g5 a5 b5 d6 e6 d6 b5 a5]
      [g5 b5 d6 g6 d6 b5 g5 d5] [e5 f#5 g5 a5 b5 a5 g5 f#5]
      [e5 ~ e6 ~ d6 ~ b5 ~] [g5 a5 b5 d6 e6 g6 e6 d6]
      [b5 ~ ~ a5 ~ ~ g5 ~] [e5 f#5 g5 a5 b5 ~ ~ ~]
      [b5 d6 e6 g6 e6 d6 b5 g5] [a5 b5 d6 e6 d6 b5 a5 g5]
      [e6 ~ d6 ~ b5 ~ a5 ~] [g5 ~ e5 ~ d5 ~ e5 ~]
      [e5 g5 a5 b5 d6 e6 g6 e6] [d6 b5 a5 g5 e5 d5 e5 g5]
      [b5 ~ ~ ~ a5 ~ g5 ~] [e5 ~ ~ ~ ~ ~ ~ ~]
    `)
      .s('square')
      .gain(0.16)
      .lpf(4500)
      .decay(0.08)
      .sustain(0.6)
      .release(0.1),

    // =========================================================================
    // HARMONY SHRED - Thirds above for that twin guitar attack
    // =========================================================================
    note(`
      [g5 b5 d6 g6 d6 b5 g5 d5] [b5 c6 d6 f#6 g6 f#6 d6 c6]
      [b5 d6 f#6 b6 f#6 d6 b5 f#5] [g5 a5 b5 c6 d6 c6 b5 a5]
      [g5 ~ g6 ~ f#6 ~ d6 ~] [b5 c6 d6 f#6 g6 b6 g6 f#6]
      [d6 ~ ~ c6 ~ ~ b5 ~] [g5 a5 b5 c6 d6 ~ ~ ~]
      [d6 f#6 g6 b6 g6 f#6 d6 b5] [c6 d6 f#6 g6 f#6 d6 c6 b5]
      [g6 ~ f#6 ~ d6 ~ c6 ~] [b5 ~ g5 ~ f#5 ~ g5 ~]
      [g5 b5 c6 d6 f#6 g6 b6 g6] [f#6 d6 c6 b5 g5 f#5 g5 b5]
      [d6 ~ ~ ~ c6 ~ b5 ~] [g5 ~ ~ ~ ~ ~ ~ ~]
    `)
      .s('square')
      .gain(0.10)
      .lpf(5000)
      .decay(0.08)
      .sustain(0.5)
      .release(0.1),

    // =========================================================================
    // THUNDEROUS BASS - Octave runs, relentless
    // =========================================================================
    note(`
      [e1 e1 e1 e1 e1 e1 e1 e1] [g1 g1 a1 a1 b1 b1 a1 a1]
      [e1 e1 e1 e1 f#1 f#1 g1 g1] [b1 a1 g1 f#1 e1 e1 e1 e1]
      [e1 e1 g1 g1 a1 a1 b1 b1] [e2 e2 d2 d2 b1 b1 a1 a1]
      [e1 f#1 g1 a1 b1 a1 g1 f#1] [e1 e1 e1 e1 e1 ~ e1 ~]
    `)
      .s('sawtooth')
      .gain(0.32)
      .lpf(450)
      .decay(0.1)
      .sustain(0.6),

    // =========================================================================
    // MACHINE GUN DRUMS - Synthesized blast beats
    // =========================================================================
    
    // Kick - constant double-kick assault (sine wave)
    note(`
      [c1 c1 c1 c1 c1 c1 c1 c1]*8
    `)
      .s('sine')
      .gain(0.50)
      .decay(0.10)
      .sustain(0),

    // Snare - blast beat on every beat (square noise)
    note(`
      [~ c4 ~ c4 ~ c4 ~ c4]*4
      [c4 c4 c4 c4 c4 c4 c4 c4]*2
      [~ c4 ~ c4 ~ c4 ~ c4]*1
      [c4 c4 c4 c4 c4 c4 c4 c4]*1
    `)
      .s('square')
      .gain(0.32)
      .decay(0.06)
      .sustain(0)
      .lpf(3000)
      .hpf(200),

    // Hi-hats - 32nd note fury (high square)
    note(`
      [g7 g7 g7 g7 g7 g7 a7 g7 g7 g7 g7 g7 g7 g7 a7 g7]*4
      [a7 a7 a7 a7 a7 a7 a7 a7 g7 g7 g7 g7 a7 a7 a7 a7]*2
      [g7 g7 g7 g7 g7 g7 a7 g7]*2
    `)
      .s('square')
      .gain(0.16)
      .decay(0.02)
      .sustain(0)
      .hpf(9000),

    // China/crash chaos (high square burst)
    note(`
      [a7 ~ ~ ~ a7 ~ ~ ~ a7 ~ ~ ~ a7 ~ ~ ~]*2
      [a7 ~ ~ ~ ~ ~ ~ ~ a7 ~ ~ ~ ~ ~ ~ ~]*2
      [a7 ~ a7 ~ a7 ~ a7 ~ a7 ~ ~ ~ ~ ~ ~ ~]
      [a7 ~ ~ ~ a7 ~ ~ ~ a7 ~ ~ ~ a7 ~ ~ a7]
      [a7 a7 a7 a7 ~ ~ ~ ~ a7 ~ ~ ~ ~ ~ ~ ~]
      [a7 ~ ~ ~ a7 ~ ~ ~ a7 ~ ~ ~ a7 ~ ~ ~]
    `)
      .s('square')
      .gain(0.22)
      .decay(0.18)
      .sustain(0)
      .hpf(4000),

    // =========================================================================
    // CHAOS ARPS - Frantic chiptune shimmer
    // =========================================================================
    note('<e5 b5 g5 e6 b5 g5 e5 g5 b5 e6 g6 e6 b5 g5 e5 b4>')
      .s('triangle')
      .gain(0.07)
      .lpf('<2500 3500 4500 3500>')
      .decay(0.03)
      .sustain(0),

    // =========================================================================
    // LOW GROWL - Sub bass for extra weight
    // =========================================================================
    note('e1 ~ ~ ~ e1 ~ ~ ~ e1 ~ ~ ~ e1 ~ ~ ~')
      .s('sine')
      .gain(0.20)
      .lpf(120)

  ).cpm(5).play();
}

/**
 * Game Over Theme - Somber, dramatic sting
 * The Lobster has fallen. A moment of silence for our hero.
 */
export function gameOverTheme() {
  return stack(
    // Descending doom melody - classic game over descent
    note('b4 ~ a4 ~ g4 ~ e4 ~ d4 ~ c4 ~ ~ ~ ~ ~')
      .s('square')
      .gain(0.20)
      .lpf(1800)
      .decay(0.5)
      .sustain(0.2)
      .release(1.0)
      .room(0.5)
      .slow(2),
    
    // Dark pad - minor chord despair
    note('a2,c3,e3')
      .s('triangle')
      .attack(0.6)
      .decay(2.0)
      .sustain(0.1)
      .release(2.0)
      .gain(0.14)
      .lpf(1000)
      .room(0.6)
      .roomsize(5)
      .slow(4),
    
    // Low funeral bass
    note('e1 ~ ~ ~ ~ ~ ~ ~ a0 ~ ~ ~ ~ ~ ~ ~')
      .s('sine')
      .gain(0.18)
      .lpf(250)
      .slow(4),
    
    // Eerie high tone - lingering sorrow
    note('~ ~ ~ ~ e5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~')
      .s('triangle')
      .gain(0.06)
      .delay(0.5)
      .delaytime(0.6)
      .delayfeedback(0.5)
      .room(0.6)
      .slow(4)
  ).cpm(55).play();
}
