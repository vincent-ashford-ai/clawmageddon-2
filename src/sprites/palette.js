// =============================================================================
// CLAWMAGEDDON 2 - COLOR PALETTE
// Post-apocalyptic wasteland colors. Index 0 = transparent.
// =============================================================================

export const PALETTE = [
  null,        // 0: transparent
  0x1a1a1a,    // 1: dark outline / shadow
  0x333333,    // 2: dark gray
  0xcc3333,    // 3: blood red (lobster body, health)
  0xff5555,    // 4: bright red (lobster claws, highlights)
  0xff9944,    // 5: orange (bullets, fire, toxic glow)
  0xffcc00,    // 6: yellow (muzzle flash, nuke)
  0x3d5c3d,    // 7: military green (pants)
  0x222222,    // 8: near black (boots, outlines)
  0x8b4513,    // 9: brown (roach, dirt)
  0x5a3a1a,    // 10: dark brown (roach details)
  0x4a0080,    // 11: purple (bat)
  0x6b1ab0,    // 12: light purple (bat wings)
  0xff0000,    // 13: pure red (eyes, danger)
  0x666666,    // 14: gray (hound body)
  0x555555,    // 15: dark gray (hound details)
  0x228b22,    // 16: toxic green (barrel, sludge)
  0x00ff00,    // 17: bright green (radiation glow)
  0xff69b4,    // 18: hot pink (extra heart)
  0xffffff,    // 19: white (highlights, teeth)
  0x888888,    // 20: light gray (spikes)
  0xcccccc,    // 21: spike tips
  0x3d2817,    // 22: wasteland ground
  0x5a3d2b,    // 23: ground detail
  0x2d2d2d,    // 24: distant city
  0x4a4a4a,    // 25: ruins gray
  0xaa6633,    // 26: rust orange
  0x774422,    // 27: dark rust
  0xeec39a,    // 28: skin tone (for variety)
  0xffaa00,    // 29: orange glow
];

// Alias for convenience
export const WASTELAND = PALETTE;
