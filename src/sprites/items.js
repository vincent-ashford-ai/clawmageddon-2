// =============================================================================
// CLAWMAGEDDON 2 - ITEM/POWERUP SPRITES
// Health, Triple Shot, Extra Heart, Nuke
// All 16x16 for consistent pickup size
// =============================================================================

import { PALETTE } from './palette.js';

// Color aliases
const _ = 0;  // transparent
const O = 1;  // outline
const R = 3;  // red
const L = 4;  // light red
const Y = 6;  // yellow
const G = 16; // green
const N = 17; // neon green
const P = 18; // pink
const W = 19; // white
const K = 8;  // black
const D = 2;  // dark gray

// =============================================================================
// HEALTH PACK - Red box with white cross (16x16)
// =============================================================================

export const HEALTH_PACK = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
  [_,O,R,R,R,R,R,R,R,R,R,R,R,R,O,_],
  [O,R,R,R,R,R,R,R,R,R,R,R,R,R,R,O],
  [O,R,R,R,R,R,W,W,W,W,R,R,R,R,R,O],
  [O,R,R,R,R,R,W,W,W,W,R,R,R,R,R,O],
  [O,R,R,R,R,R,W,W,W,W,R,R,R,R,R,O],
  [O,R,R,W,W,W,W,W,W,W,W,W,W,R,R,O],
  [O,R,R,W,W,W,W,W,W,W,W,W,W,R,R,O],
  [O,R,R,W,W,W,W,W,W,W,W,W,W,R,R,O],
  [O,R,R,W,W,W,W,W,W,W,W,W,W,R,R,O],
  [O,R,R,R,R,R,W,W,W,W,R,R,R,R,R,O],
  [O,R,R,R,R,R,W,W,W,W,R,R,R,R,R,O],
  [O,R,R,R,R,R,W,W,W,W,R,R,R,R,R,O],
  [O,R,R,R,R,R,R,R,R,R,R,R,R,R,R,O],
  [_,O,R,R,R,R,R,R,R,R,R,R,R,R,O,_],
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
];

// =============================================================================
// TRIPLE SHOT - Orange gun with 3 ammo dots (16x16)
// =============================================================================

export const TRIPLE_SHOT = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,Y,Y,Y,_,Y,Y,Y,_,Y,Y,Y,_], // 3 ammo dots
  [_,_,_,_,Y,Y,Y,_,Y,Y,Y,_,Y,Y,Y,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,O,O,O,O,O,O,O,O,O,_], // barrel
  [_,_,_,_,_,O,5,5,5,5,5,5,5,5,5,O],
  [_,_,_,_,O,5,5,5,5,5,5,5,5,5,5,O],
  [_,O,O,O,O,5,5,5,5,5,5,5,5,O,O,_], // body
  [O,5,5,5,5,5,5,5,5,5,5,O,O,_,_,_],
  [O,5,5,5,5,5,5,5,5,O,O,_,_,_,_,_],
  [O,5,5,5,5,5,5,5,O,_,_,_,_,_,_,_],
  [_,O,5,5,5,5,O,O,_,_,_,_,_,_,_,_], // grip
  [_,O,5,5,5,5,O,_,_,_,_,_,_,_,_,_],
  [_,_,O,5,5,O,_,_,_,_,_,_,_,_,_,_],
  [_,_,O,5,5,O,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,O,O,_,_,_,_,_,_,_,_,_,_,_],
];

// =============================================================================
// HEAVY METAL - Steel minigun with rotating barrels (16x16)
// Distinct from Triple Shot: heavier, 3 barrels, steel gray with orange flash
// =============================================================================

const S = 7;  // steel/silver (palette index 7 - light gray)
const F = 5;  // fire/orange (palette index 5 - orange)

export const HEAVY_METAL = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,_,_,_,_,O,O,O,O,O,O,O,F,F,_], // top barrel + muzzle flash
  [_,_,_,_,_,O,S,S,S,S,S,S,S,O,F,F],
  [_,_,_,_,_,_,O,O,O,O,O,O,O,F,F,_],
  [_,_,_,_,_,_,O,O,O,O,O,O,O,F,F,_], // middle barrel
  [_,_,_,_,_,O,S,S,S,S,S,S,S,O,F,F],
  [_,_,_,_,_,_,O,O,O,O,O,O,O,F,F,_],
  [_,_,_,_,_,_,O,O,O,O,O,O,O,F,F,_], // bottom barrel
  [_,_,_,_,_,O,S,S,S,S,S,S,S,O,F,F],
  [_,_,_,_,_,_,O,O,O,O,O,O,O,F,F,_],
  [_,O,O,O,O,O,D,D,D,D,D,O,O,_,_,_], // receiver body
  [O,D,D,D,D,D,D,D,D,D,D,D,O,_,_,_],
  [O,D,D,D,D,D,D,D,D,D,O,O,_,_,_,_],
  [_,O,D,D,D,D,D,D,O,O,_,_,_,_,_,_], // grip
  [_,O,D,D,D,D,O,O,_,_,_,_,_,_,_,_],
  [_,_,O,D,D,O,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,O,O,_,_,_,_,_,_,_,_,_,_,_],
];

// =============================================================================
// EXTRA HEART - Glowing pink heart (16x16)
// =============================================================================

export const EXTRA_HEART = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,P,P,P,_,_,_,_,P,P,P,_,_,_], // glow
  [_,_,P,P,O,O,P,_,_,P,O,O,P,P,_,_],
  [_,P,O,P,P,P,P,O,O,P,P,P,P,O,P,_],
  [_,P,O,P,W,P,P,P,P,P,P,P,P,O,P,_], // highlight
  [_,P,O,P,P,P,P,P,P,P,P,P,P,O,P,_],
  [_,_,O,P,P,P,P,P,P,P,P,P,P,O,_,_],
  [_,_,P,O,P,P,P,P,P,P,P,P,O,P,_,_],
  [_,_,_,O,P,P,P,P,P,P,P,P,O,_,_,_],
  [_,_,_,P,O,P,P,P,P,P,P,O,P,_,_,_],
  [_,_,_,_,O,P,P,P,P,P,P,O,_,_,_,_],
  [_,_,_,_,_,O,P,P,P,P,O,_,_,_,_,_],
  [_,_,_,_,_,P,O,P,P,O,P,_,_,_,_,_],
  [_,_,_,_,_,_,O,O,O,O,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,P,P,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// =============================================================================
// NUKE - Fat Man style nuclear bomb with fins (16x16)
// Bright YELLOW bomb - classic silhouette, eye-catching pickup!
// =============================================================================

const H = 5;  // orange/gold shadow for depth
const T = 7;  // light gray for tail fins (metallic)

export const NUKE = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,O,_,_,_,_,_,_,_,_,_,_,O,_,_], // tail fins (top)
  [_,_,O,T,_,_,O,O,O,O,_,_,T,O,_,_],
  [_,_,_,O,O,O,Y,Y,Y,Y,O,O,O,_,_,_], // tail section
  [_,_,_,_,O,Y,Y,Y,Y,Y,Y,O,_,_,_,_],
  [_,_,_,O,Y,Y,W,W,Y,Y,Y,Y,O,_,_,_], // body starts - white highlight
  [_,_,O,Y,Y,W,W,Y,Y,Y,Y,H,H,O,_,_],
  [_,O,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,H,H,O,_], // fat body
  [_,O,Y,Y,K,K,K,K,K,K,K,K,Y,H,O,_], // black radiation band
  [_,O,Y,Y,K,Y,K,Y,K,Y,K,K,Y,H,O,_], // radiation symbol hint
  [_,O,Y,Y,K,K,K,K,K,K,K,K,Y,H,O,_], // black radiation band
  [_,O,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,H,H,O,_], // fat body
  [_,_,O,Y,Y,Y,Y,Y,Y,Y,Y,H,H,O,_,_],
  [_,_,_,O,Y,Y,Y,Y,Y,Y,H,H,O,_,_,_], // tapering
  [_,_,_,_,O,Y,Y,Y,Y,H,H,O,_,_,_,_],
  [_,_,_,_,_,O,O,Y,H,O,O,_,_,_,_,_], // nose
  [_,_,_,_,_,_,_,O,O,_,_,_,_,_,_,_],
];

// =============================================================================
// MISSILE LAUNCHER - Military green launcher with missile (16x16)
// Distinct from other weapons: tube launcher with visible missile
// =============================================================================

const M = 7;  // military green (palette 7)
const A = 16; // army green (palette 16 - toxic green works for camo)
const B = 2;  // dark gray (palette 2)

export const MISSILE_LAUNCHER = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,O,O,O,O,O,O,O,_,_], // missile tip
  [_,_,_,_,_,_,O,M,M,M,M,M,M,M,O,_], // missile body
  [_,_,_,_,_,_,_,O,O,O,O,O,O,O,_,_],
  [_,_,_,_,_,O,O,O,O,O,O,O,O,O,O,_], // launcher tube
  [_,_,_,O,O,A,A,A,A,A,A,A,A,A,A,O],
  [_,_,O,A,A,A,A,A,A,A,A,A,A,A,A,O],
  [_,O,A,A,A,A,A,A,A,A,A,A,A,O,O,_], // body
  [O,A,A,A,A,A,A,A,A,A,A,O,O,_,_,_],
  [O,A,A,A,A,A,A,A,A,O,O,_,_,_,_,_],
  [O,A,A,A,A,A,A,A,O,_,_,_,_,_,_,_],
  [_,O,B,B,B,B,O,O,_,_,_,_,_,_,_,_], // grip
  [_,O,B,B,B,B,O,_,_,_,_,_,_,_,_,_],
  [_,_,O,B,B,O,_,_,_,_,_,_,_,_,_,_],
  [_,_,O,B,B,O,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,O,O,_,_,_,_,_,_,_,_,_,_,_],
];

// =============================================================================
// GRENADE LAUNCHER - Olive green launcher with grenade (16x16)
// Distinct tube launcher with visible grenade ready to fire
// =============================================================================

const GL = 7;  // olive green (palette 7)
const GD = 2;  // dark gray (palette 2)
const GY = 6;  // gold/yellow fuse (palette 6)

export const GRENADE_LAUNCHER = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,_,_,_,_,_,_,O,GY,GY,O,_,_,_,_], // grenade fuse
  [_,_,_,_,_,_,_,O,GL,GL,GL,GL,O,_,_,_], // grenade in tube
  [_,_,_,_,_,_,O,GL,GL,GL,GL,GL,GL,O,_,_],
  [_,_,_,_,_,O,O,O,O,O,O,O,O,O,O,_], // launcher tube top
  [_,_,_,_,O,GL,GL,GL,GL,GL,GL,GL,GL,GL,O,_],
  [_,_,_,O,GL,GL,GL,GL,GL,GL,GL,GL,GL,GL,GL,O], // tube body
  [_,_,O,GL,GL,GL,GL,GL,GL,GL,GL,GL,GL,GL,GL,O],
  [_,O,GL,GL,GL,GL,GL,GL,GL,GL,GL,GL,GL,O,O,_],
  [O,GL,GL,GL,GL,GL,GL,GL,GL,GL,GL,O,O,_,_,_], // body
  [O,GL,GL,GL,GL,GL,GL,GL,GL,O,O,_,_,_,_,_],
  [O,GL,GL,GL,GL,GL,GL,GL,O,_,_,_,_,_,_,_],
  [_,O,GD,GD,GD,GD,O,O,_,_,_,_,_,_,_,_], // grip
  [_,O,GD,GD,GD,GD,O,_,_,_,_,_,_,_,_,_],
  [_,_,O,GD,GD,O,_,_,_,_,_,_,_,_,_,_],
  [_,_,O,GD,GD,O,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,O,O,_,_,_,_,_,_,_,_,_,_,_],
];

// =============================================================================
// SPRITE DATA EXPORT
// =============================================================================

export const ITEM_SPRITES = {
  HEALTH_PACK: {
    sprite: HEALTH_PACK,
    palette: PALETTE,
    width: 16,
    height: 16,
  },
  TRIPLE_SHOT: {
    sprite: TRIPLE_SHOT,
    palette: PALETTE,
    width: 16,
    height: 16,
  },
  HEAVY_METAL: {
    sprite: HEAVY_METAL,
    palette: PALETTE,
    width: 16,
    height: 16,
  },
  EXTRA_HEART: {
    sprite: EXTRA_HEART,
    palette: PALETTE,
    width: 16,
    height: 16,
  },
  NUKE: {
    sprite: NUKE,
    palette: PALETTE,
    width: 16,
    height: 16,
  },
  MISSILE_LAUNCHER: {
    sprite: MISSILE_LAUNCHER,
    palette: PALETTE,
    width: 16,
    height: 16,
  },
  GRENADE_LAUNCHER: {
    sprite: GRENADE_LAUNCHER,
    palette: PALETTE,
    width: 16,
    height: 16,
  },
};

export const ITEM_PALETTE = PALETTE;
