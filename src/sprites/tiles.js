// =============================================================================
// CLAWMAGEDDON 2 - BACKGROUND TILES
// Ground variants, wasteland decorations, obstacles
// =============================================================================

import { PALETTE } from './palette.js';

// Color aliases
const _ = 0;  // transparent
const O = 1;  // outline
const D = 22; // wasteland ground (dark brown)
const L = 23; // ground detail (lighter)
const C = 24; // distant city gray
const R = 25; // ruins gray
const U = 26; // rust orange
const K = 27; // dark rust
const G = 20; // gray (spikes)
const S = 21; // spike tips (silver)
const T = 16; // toxic green
const N = 17; // neon green

// =============================================================================
// GROUND TILES - 16x16 wasteland terrain
// =============================================================================

export const GROUND_BASE = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [D,D,L,D,D,D,D,D,D,L,D,D,D,D,D,D],
  [D,D,D,D,D,L,D,D,D,D,D,D,D,L,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,L,D,D,D,D,D,D,L,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,L,D],
  [D,D,D,D,L,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,L,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [L,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,L,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,L,D,D,D],
  [D,D,L,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,L,D,D,D,D,D,D,D,D,L,D],
  [D,D,D,D,D,D,D,D,D,L,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
];

export const GROUND_VAR1 = [
  [D,D,D,D,D,D,L,D,D,D,D,D,D,D,D,D],
  [D,L,D,D,D,D,D,D,D,D,D,L,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,L,D,D,D,D,D,D,D,D,D,D,L,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,L,D,D,D,D,D,D,D],
  [D,D,L,D,D,D,D,D,D,D,D,D,D,L,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,L,D,D,D,D,D,D,D,D,D,D],
  [D,L,D,D,D,D,D,D,D,D,D,L,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,L,D],
  [D,D,D,D,L,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,L,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
];

export const GROUND_VAR2 = [
  [D,D,D,D,D,D,D,D,D,D,D,D,D,L,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,L,D,D,D,D,D,L,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,L,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,L,D,D,D,D,L,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,L],
  [D,D,L,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,L,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,L,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,L,D,D],
  [D,L,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,L,D,D,D,D,D,D,D],
  [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
];

// =============================================================================
// DECORATIVE ELEMENTS - Wasteland props
// =============================================================================

// Skull pile (8x8)
export const SKULL_PILE = [
  //0 1 2 3 4 5 6 7
  [_,_,O,O,O,O,_,_],
  [_,O,L,L,L,L,O,_],
  [O,L,O,L,L,O,L,O],
  [O,L,L,L,L,L,L,O],
  [_,O,L,O,O,L,O,_],
  [_,_,O,L,L,O,_,_],
  [_,O,L,L,L,L,O,_],
  [_,O,O,O,O,O,O,_],
];

// Burnt car wreck (16x10)
export const CAR_WRECK = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,_,_,_,O,O,O,O,O,O,_,_,_,_,_],
  [_,_,_,O,O,U,U,U,U,U,U,O,O,_,_,_],
  [_,_,O,U,U,U,K,K,K,K,U,U,U,O,_,_],
  [_,O,K,K,K,K,K,K,K,K,K,K,K,K,O,_],
  [O,K,K,K,K,K,K,K,K,K,K,K,K,K,K,O],
  [O,U,U,U,K,K,K,K,K,K,K,K,U,U,U,O],
  [O,U,O,O,U,K,K,K,K,K,K,U,O,O,U,O],
  [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
  [_,O,O,O,O,_,_,_,_,_,_,O,O,O,O,_],
  [_,_,O,O,_,_,_,_,_,_,_,_,O,O,_,_],
];

// Radiation sign (8x10)
export const RAD_SIGN = [
  //0 1 2 3 4 5 6 7
  [_,_,O,O,O,O,_,_],
  [_,O,6,6,6,6,O,_],
  [O,6,6,O,O,6,6,O],
  [O,6,O,6,6,O,6,O],
  [O,6,O,6,6,O,6,O],
  [O,6,6,O,O,6,6,O],
  [_,O,6,6,6,6,O,_],
  [_,_,O,O,O,O,_,_],
  [_,_,_,O,O,_,_,_],
  [_,_,_,O,O,_,_,_],
];

// Dead tree stump (8x12)
export const DEAD_TREE = [
  //0 1 2 3 4 5 6 7
  [_,_,O,_,_,O,_,_],
  [_,O,K,O,O,K,O,_],
  [O,K,K,K,K,K,K,O],
  [_,O,K,K,K,K,O,_],
  [_,_,O,K,K,O,_,_],
  [_,_,O,K,K,O,_,_],
  [_,_,O,K,K,O,_,_],
  [_,_,O,K,K,O,_,_],
  [_,O,K,K,K,K,O,_],
  [_,O,K,K,K,K,O,_],
  [O,K,K,K,K,K,K,O],
  [O,O,O,O,O,O,O,O],
];

// =============================================================================
// OBSTACLE SPRITES
// =============================================================================

// Spikes (20x12)
export const SPIKES_SPRITE = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
  [_,_,S,_,_,_,_,S,_,_,_,_,S,_,_,_,_,S,_,_],
  [_,_,S,_,_,_,_,S,_,_,_,_,S,_,_,_,_,S,_,_],
  [_,S,S,S,_,_,S,S,S,_,_,S,S,S,_,_,S,S,S,_],
  [_,S,G,S,_,_,S,G,S,_,_,S,G,S,_,_,S,G,S,_],
  [S,S,G,S,S,S,S,G,S,S,S,S,G,S,S,S,S,G,S,S],
  [S,G,G,G,S,S,G,G,G,S,S,G,G,G,S,S,G,G,G,S],
  [S,G,G,G,S,S,G,G,G,S,S,G,G,G,S,S,G,G,G,S],
  [O,G,G,G,O,O,G,G,G,O,O,G,G,G,O,O,G,G,G,O],
  [O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O],
  [O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O],
  [O,O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O,O],
  [_,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,_],
];

// Toxic barrel (16x24)
export const TOXIC_BARREL_SPRITE = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,_,_,O,O,O,O,O,O,O,O,_,_,_,_],
  [_,_,O,O,T,T,T,T,T,T,T,T,O,O,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,T,O,_],
  [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O], // ring
  [O,T,T,T,T,T,T,T,T,T,T,T,T,T,T,O],
  [O,T,T,T,T,T,T,T,T,T,T,T,T,T,T,O],
  [O,T,T,T,T,O,O,O,O,O,O,T,T,T,T,O],
  [O,T,T,T,O,N,N,O,O,N,N,O,T,T,T,O], // rad symbol
  [O,T,T,T,O,N,O,T,T,O,N,O,T,T,T,O],
  [O,T,T,T,O,O,T,O,O,T,O,O,T,T,T,O],
  [O,T,T,T,O,O,T,O,O,T,O,O,T,T,T,O],
  [O,T,T,T,O,N,O,T,T,O,N,O,T,T,T,O],
  [O,T,T,T,O,N,N,O,O,N,N,O,T,T,T,O],
  [O,T,T,T,T,O,O,O,O,O,O,T,T,T,T,O],
  [O,T,T,T,T,T,T,T,T,T,T,T,T,T,T,O],
  [O,T,T,T,T,T,T,T,T,T,T,T,T,T,T,O],
  [O,T,T,T,T,T,T,T,T,T,T,T,T,T,T,O],
  [O,T,T,T,T,T,T,T,T,T,T,T,T,T,T,O],
  [O,T,T,T,T,T,T,T,T,T,T,T,T,T,T,O],
  [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O], // ring
  [_,O,T,T,T,T,T,T,T,T,T,T,T,T,O,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,T,O,_],
  [_,_,O,O,T,T,T,T,T,T,T,T,O,O,_,_],
  [_,_,_,_,O,O,O,O,O,O,O,O,_,_,_,_],
];

// Sludge puddle (30x6)
export const SLUDGE_PUDDLE_SPRITE = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
  [_,_,_,_,_,_,_,N,_,_,_,_,_,_,_,_,_,_,_,_,_,N,_,_,_,_,_,_,_,_], // bubbles
  [_,_,_,N,_,_,_,_,_,_,_,_,_,N,_,_,_,_,_,_,_,_,_,_,N,_,_,_,_,_],
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,_,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [O,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,O,_],
  [_,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
];

// Platform (variable width, base 16x10)
export const PLATFORM_SPRITE = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [O,L,L,L,L,L,L,L,L,L,L,L,L,L,L,O], // top edge
  [O,L,L,L,L,L,L,L,L,L,L,L,L,L,L,O],
  [O,D,D,D,D,D,D,D,D,D,D,D,D,D,D,O],
  [O,D,D,D,D,D,D,D,D,D,D,D,D,D,D,O],
  [O,D,L,D,D,D,D,L,D,D,D,D,L,D,D,O], // wood grain
  [O,D,D,D,D,L,D,D,D,D,L,D,D,D,D,O],
  [O,D,D,D,D,D,D,D,D,D,D,D,D,D,D,O],
  [O,D,D,L,D,D,D,D,D,L,D,D,D,D,D,O],
  [O,D,D,D,D,D,D,D,D,D,D,D,D,D,D,O],
  [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
];

// =============================================================================
// BUILDING SILHOUETTES FOR PARALLAX (16x variable height)
// =============================================================================

// Tall building (16x32)
export const BUILDING_TALL = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,_,_,_,_,O,O,O,O,_,_,_,_,_,_],
  [_,_,_,_,_,O,C,C,C,C,O,_,_,_,_,_],
  [_,_,_,_,O,C,C,C,C,C,C,O,_,_,_,_],
  [_,_,_,O,C,C,C,C,C,C,C,C,O,_,_,_],
  [_,_,O,C,C,C,C,C,C,C,C,C,C,O,_,_],
  [_,O,C,C,C,C,C,C,C,C,C,C,C,C,O,_],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O], // windows
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,C,C,C,R,R,R,R,C,C,C,C,C,O], // door
  [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
];

// Short building (16x16)
export const BUILDING_SHORT = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,R,R,C,C,C,C,C,C,R,R,C,C,O],
  [O,C,C,C,C,C,C,C,C,C,C,C,C,C,C,O],
  [O,C,C,C,C,C,R,R,R,R,C,C,C,C,C,O],
  [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
];

// Rubble pile (12x8)
export const RUBBLE_PILE = [
  //0 1 2 3 4 5 6 7 8 9 0 1
  [_,_,_,_,O,O,O,_,_,_,_,_],
  [_,_,_,O,R,R,R,O,_,_,_,_],
  [_,_,O,R,R,R,R,R,O,_,_,_],
  [_,O,R,R,R,R,R,R,R,O,O,_],
  [O,R,R,R,O,R,R,R,R,R,R,O],
  [O,R,R,R,R,R,R,R,R,R,R,O],
  [O,R,R,R,R,R,O,R,R,R,O,_],
  [O,O,O,O,O,O,O,O,O,O,_,_],
];

// =============================================================================
// EXPORT ALL TILES
// =============================================================================

export const TILE_SPRITES = {
  GROUND_BASE: { sprite: GROUND_BASE, palette: PALETTE, width: 16, height: 16 },
  GROUND_VAR1: { sprite: GROUND_VAR1, palette: PALETTE, width: 16, height: 16 },
  GROUND_VAR2: { sprite: GROUND_VAR2, palette: PALETTE, width: 16, height: 16 },
  SKULL_PILE: { sprite: SKULL_PILE, palette: PALETTE, width: 8, height: 8 },
  CAR_WRECK: { sprite: CAR_WRECK, palette: PALETTE, width: 16, height: 10 },
  RAD_SIGN: { sprite: RAD_SIGN, palette: PALETTE, width: 8, height: 10 },
  DEAD_TREE: { sprite: DEAD_TREE, palette: PALETTE, width: 8, height: 12 },
  SPIKES: { sprite: SPIKES_SPRITE, palette: PALETTE, width: 20, height: 12 },
  TOXIC_BARREL: { sprite: TOXIC_BARREL_SPRITE, palette: PALETTE, width: 16, height: 24 },
  SLUDGE_PUDDLE: { sprite: SLUDGE_PUDDLE_SPRITE, palette: PALETTE, width: 30, height: 6 },
  PLATFORM: { sprite: PLATFORM_SPRITE, palette: PALETTE, width: 16, height: 10 },
  BUILDING_TALL: { sprite: BUILDING_TALL, palette: PALETTE, width: 16, height: 32 },
  BUILDING_SHORT: { sprite: BUILDING_SHORT, palette: PALETTE, width: 16, height: 16 },
  RUBBLE_PILE: { sprite: RUBBLE_PILE, palette: PALETTE, width: 12, height: 8 },
};

export const TILE_PALETTE = PALETTE;
