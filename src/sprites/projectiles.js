// =============================================================================
// CLAWMAGEDDON 2 - PROJECTILE SPRITES
// Bullets fired by the Lobster and enemies
// =============================================================================

import { PALETTE } from './palette.js';

// Color aliases
const _ = 0;  // transparent
const O = 1;  // outline
const Y = 6;  // yellow (bullet core)
const W = 19; // white (hot center)
const R = 5;  // orange (glow)
const M = 18; // hot pink/magenta (enemy bullet outer)
const P = 12; // purple (enemy bullet core)

// =============================================================================
// BULLET - Yellow energy projectile (8x4)
// =============================================================================

export const BULLET = [
  //0 1 2 3 4 5 6 7
  [_,O,Y,Y,Y,Y,O,_],
  [O,Y,Y,W,W,Y,Y,O],
  [O,Y,Y,W,W,Y,Y,O],
  [_,O,Y,Y,Y,Y,O,_],
];

// Bullet with muzzle flash effect (for first frame after firing)
export const BULLET_FLASH = [
  [R,O,Y,Y,Y,Y,O,_],
  [R,Y,Y,W,W,Y,Y,O],
  [R,Y,Y,W,W,Y,Y,O],
  [R,O,Y,Y,Y,Y,O,_],
];

// =============================================================================
// CLAW PROJECTILE - For potential future upgrade (8x6)
// =============================================================================

export const CLAW_SHOT = [
  //0 1 2 3 4 5 6 7
  [_,_,O,O,O,O,_,_],
  [_,O,4,4,4,4,O,_],
  [O,4,4,3,3,4,4,O],
  [O,4,3,3,3,3,4,O],
  [_,O,4,4,4,4,O,_],
  [_,_,O,O,O,O,_,_],
];

// =============================================================================
// ENEMY BULLET - Magenta/purple projectile (8x4) fired by Raiders
// =============================================================================

export const ENEMY_BULLET = [
  //0 1 2 3 4 5 6 7
  [_,O,M,M,M,M,O,_],
  [O,M,M,P,P,M,M,O],
  [O,M,M,P,P,M,M,O],
  [_,O,M,M,M,M,O,_],
];

// =============================================================================
// HEAT-SEEKING MISSILE - Green military missile with orange exhaust (12x5)
// Larger and more distinct than regular bullets
// =============================================================================

const G = 16; // toxic green (military)
const g = 7;  // dark green (palette 7 = military green)
const F = 5;  // fire/orange exhaust

export const MISSILE = [
  //0 1 2 3 4 5 6 7 8 9 0 1
  [_,_,_,_,_,O,O,O,O,O,_,_],  // nose cone
  [F,O,O,O,O,g,g,g,g,g,O,_],  // body top with exhaust
  [F,F,O,g,g,g,W,W,g,g,g,O],  // body middle (white highlight)
  [F,O,O,O,O,g,g,g,g,g,O,_],  // body bottom with exhaust
  [_,_,_,_,_,O,O,O,O,O,_,_],  // tail fins
];

// =============================================================================
// GRENADE - Round explosive with fuse/pin (8x8)
// Military olive green body with gold fuse
// =============================================================================

const D = 2;  // dark gray (palette 2 - shadow)
const v = 7;  // olive/military green (palette 7)
const A = 6;  // gold/yellow (palette 6 - fuse)

export const GRENADE = [
  //0 1 2 3 4 5 6 7
  [_,_,O,A,A,O,_,_],  // fuse/pin sticking up
  [_,O,v,v,v,v,O,_],  // top of body
  [O,v,v,W,W,v,v,O],  // body with highlight
  [O,v,W,v,v,v,v,O],  // body
  [O,v,v,v,v,v,v,O],  // body
  [O,v,v,v,v,D,D,O],  // body with shadow
  [_,O,v,v,D,D,O,_],  // bottom
  [_,_,O,O,O,O,_,_],  // bottom edge
];

// =============================================================================
// SPRITE DATA EXPORT
// =============================================================================

export const PROJECTILE_SPRITES = {
  BULLET: {
    sprite: BULLET,
    palette: PALETTE,
    width: 8,
    height: 4,
  },
  BULLET_FLASH: {
    sprite: BULLET_FLASH,
    palette: PALETTE,
    width: 8,
    height: 4,
  },
  CLAW_SHOT: {
    sprite: CLAW_SHOT,
    palette: PALETTE,
    width: 8,
    height: 6,
  },
  ENEMY_BULLET: {
    sprite: ENEMY_BULLET,
    palette: PALETTE,
    width: 8,
    height: 4,
  },
  MISSILE: {
    sprite: MISSILE,
    palette: PALETTE,
    width: 12,
    height: 5,
  },
  GRENADE: {
    sprite: GRENADE,
    palette: PALETTE,
    width: 8,
    height: 8,
  },
};

export const PROJECTILE_PALETTE = PALETTE;
