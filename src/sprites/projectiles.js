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
};

export const PROJECTILE_PALETTE = PALETTE;
