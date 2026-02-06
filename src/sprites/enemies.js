// =============================================================================
// CLAWMAGEDDON 2 - ENEMY SPRITES
// RadRoach, PlagueBat, SludgeCrawler, Raider, Brute, UFO
// =============================================================================

import { PALETTE } from './palette.js';

// Color aliases from palette
const _ = 0;  // transparent
const O = 1;  // dark outline
const B = 9;  // brown (roach)
const D = 10; // dark brown
const P = 11; // purple (bat)
const L = 12; // light purple
const R = 13; // red (eyes)
const G = 14; // gray (hound)
const K = 15; // dark gray
const T = 16; // toxic green (sludge)
const S = 17; // bright green (sludge glow)
const W = 19; // white
const Y = 6;  // yellow (muzzle flash)
const A = 26; // rust orange (armor)
const SK = 28; // skin tone
const SV = 21; // silver (UFO dome)
const LG = 20; // light gray (UFO hull)

// =============================================================================
// RAD ROACH - Giant mutant cockroach (18x12)
// Segmented body, skittering legs, antenna. Brown tones with red eyes.
// =============================================================================

export const RAD_ROACH_IDLE = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
  [_,_,D,D,_,_,_,_,_,_,_,_,D,D,_,_,_,_], // antennae (both sides)
  [_,D,_,_,D,_,_,_,_,_,_,D,_,_,D,_,_,_],
  [D,_,_,_,_,O,O,O,O,O,O,_,_,_,_,D,_,_], // head
  [_,_,_,_,O,B,R,B,B,B,R,B,O,_,_,_,_,_], // eyes (both sides)
  [_,_,_,O,B,B,B,B,B,B,B,B,B,O,_,_,_,_],
  [_,O,O,B,D,B,B,B,B,B,B,D,B,B,O,O,_,_], // main body with segments
  [O,D,O,B,B,D,B,B,D,B,B,D,B,B,B,B,O,_],
  [_,O,D,O,B,B,B,B,B,B,B,B,B,B,O,O,_,_],
  [_,_,O,D,O,O,O,O,O,O,O,O,O,O,_,_,_,_],
  [_,_,O,D,_,D,_,D,_,D,_,D,_,D,O,_,_,_], // legs
  [_,O,_,_,O,_,O,_,O,_,O,_,O,_,_,O,_,_],
  [O,_,_,_,_,O,_,O,_,O,_,O,_,O,_,_,O,_],
];

export const RAD_ROACH_WALK = [
  [_,_,D,D,_,_,_,_,_,_,_,_,D,D,_,_,_,_],
  [_,D,_,_,D,_,_,_,_,_,_,D,_,_,D,_,_,_],
  [D,_,_,_,_,O,O,O,O,O,O,_,_,_,_,D,_,_],
  [_,_,_,_,O,B,R,B,B,B,R,B,O,_,_,_,_,_],
  [_,_,_,O,B,B,B,B,B,B,B,B,B,O,_,_,_,_],
  [_,O,O,B,D,B,B,B,B,B,B,D,B,B,O,O,_,_],
  [O,D,O,B,B,D,B,B,D,B,B,D,B,B,B,B,O,_],
  [_,O,D,O,B,B,B,B,B,B,B,B,B,B,O,O,_,_],
  [_,_,O,D,O,O,O,O,O,O,O,O,O,O,_,_,_,_],
  [_,O,_,O,D,_,D,_,D,_,D,_,D,_,O,_,_,_], // legs alternate
  [O,_,_,_,_,O,_,O,_,O,_,O,_,O,_,O,_,_],
  [_,_,_,_,O,_,O,_,O,_,O,_,O,_,_,_,O,_],
];

export const RAD_ROACH_FRAMES = [RAD_ROACH_IDLE, RAD_ROACH_WALK];

// =============================================================================
// PLAGUE BAT - Irradiated purple bat (16x14)
// Wide wing span, small body, glowing eyes. Purple/violet palette.
// =============================================================================

// Wings up position
export const PLAGUE_BAT_UP = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,O,L,L,O,_,_,_,_,_,_,O,L,L,O,_], // wing tips up
  [O,L,P,P,L,O,_,_,_,_,O,L,P,P,L,O],
  [O,P,P,P,P,L,O,_,_,O,L,P,P,P,P,O],
  [O,P,P,P,P,P,L,O,O,L,P,P,P,P,P,O],
  [_,O,P,P,P,P,P,P,P,P,P,P,P,P,O,_],
  [_,_,O,P,P,P,P,P,P,P,P,P,P,O,_,_],
  [_,_,_,O,P,P,R,P,P,R,P,P,O,_,_,_], // eyes
  [_,_,_,_,O,P,P,P,P,P,P,O,_,_,_,_],
  [_,_,_,_,O,P,P,W,W,P,P,O,_,_,_,_], // fangs
  [_,_,_,_,_,O,P,P,P,P,O,_,_,_,_,_],
  [_,_,_,_,_,_,O,O,O,O,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,O,O,_,_,_,_,_,_,_], // tiny legs
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// Wings down position
export const PLAGUE_BAT_DOWN = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,O,O,O,O,O,O,_,_,_,_,_],
  [_,_,_,_,O,P,P,P,P,P,P,O,_,_,_,_],
  [_,_,_,O,P,P,R,P,P,R,P,P,O,_,_,_], // eyes
  [_,_,O,P,P,P,P,P,P,P,P,P,P,O,_,_],
  [_,O,P,P,P,P,P,W,W,P,P,P,P,P,O,_], // fangs
  [O,P,P,P,P,P,P,P,P,P,P,P,P,P,P,O],
  [O,L,P,P,P,P,P,P,P,P,P,P,P,P,L,O],
  [O,P,L,P,P,P,P,O,O,P,P,P,P,L,P,O],
  [O,P,P,L,P,P,O,_,_,O,P,P,L,P,P,O],
  [_,O,P,P,L,O,_,_,_,_,O,L,P,P,O,_], // wings down
  [_,_,O,P,P,O,_,_,_,_,O,P,P,O,_,_],
  [_,_,_,O,O,_,_,_,_,_,_,O,O,_,_,_],
];

export const PLAGUE_BAT_FRAMES = [PLAGUE_BAT_UP, PLAGUE_BAT_DOWN];

// =============================================================================
// SLUDGE CRAWLER - Toxic slime blob (14x10)
// Goopy translucent mass with glowing spots. Green toxic palette.
// =============================================================================

// Frame 1 - blob shape
export const SLUDGE_CRAWLER_1 = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3
  [_,_,_,_,O,O,O,O,O,_,_,_,_,_], // top dome
  [_,_,_,O,T,T,S,T,T,O,_,_,_,_],
  [_,_,O,T,T,S,S,S,T,T,O,_,_,_],
  [_,O,T,T,R,T,S,T,R,T,T,O,_,_], // eyes (red)
  [O,T,T,T,T,T,T,T,T,T,T,T,O,_],
  [O,T,S,T,T,T,T,T,T,T,S,T,O,_], // glow spots
  [O,T,T,T,T,T,T,T,T,T,T,T,T,O],
  [_,O,T,T,T,T,T,T,T,T,T,T,O,_],
  [_,_,O,O,T,T,T,T,T,T,O,O,_,_],
  [_,_,_,_,O,O,O,O,O,O,_,_,_,_], // base
];

// Frame 2 - wobble (slightly squished/spread)
export const SLUDGE_CRAWLER_2 = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3
  [_,_,_,_,_,O,O,O,_,_,_,_,_,_], // flatter top
  [_,_,_,O,O,T,S,T,O,O,_,_,_,_],
  [_,_,O,T,T,S,S,S,T,T,O,_,_,_],
  [_,O,T,T,R,T,S,T,R,T,T,O,_,_], // eyes
  [O,T,T,T,T,T,T,T,T,T,T,T,O,_],
  [O,T,S,T,T,T,T,T,T,T,S,T,T,O], // wider spread
  [O,T,T,T,T,T,T,T,T,T,T,T,T,O],
  [O,T,T,T,T,T,T,T,T,T,T,T,T,O],
  [_,O,O,T,T,T,T,T,T,T,T,O,O,_],
  [_,_,_,O,O,O,O,O,O,O,O,_,_,_], // wider base
];

export const SLUDGE_CRAWLER_FRAMES = [SLUDGE_CRAWLER_1, SLUDGE_CRAWLER_2];

// =============================================================================
// RAIDER - Wasteland bandit with gun (16x20)
// Armored humanoid, bandana, holding rifle. Rust/brown colors.
// =============================================================================

export const RAIDER_IDLE = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,_,_,_,O,O,O,O,O,_,_,_,_,_,_], // head (bandana)
  [_,_,_,_,O,A,A,R,A,A,O,_,_,_,_,_], // bandana with red stripe
  [_,_,_,_,O,SK,SK,SK,SK,SK,O,_,_,_,_,_], // face
  [_,_,_,_,O,SK,O,SK,O,SK,O,_,_,_,_,_], // eyes
  [_,_,_,_,_,O,SK,SK,SK,O,_,_,_,_,_,_], // nose
  [_,_,_,_,O,A,A,A,A,A,O,_,_,_,_,_], // shoulder armor
  [_,_,_,O,A,A,A,A,A,A,A,O,_,_,_,_], // torso
  [_,_,_,O,A,A,A,A,A,A,A,O,_,_,_,_], // torso
  [_,_,O,SK,O,A,A,A,A,O,SK,O,_,_,_,_], // arms out
  [_,O,SK,SK,O,A,A,A,A,O,O,O,O,O,_,_], // arms + gun start
  [_,_,O,O,O,A,A,A,A,O,G,G,G,G,O,_], // gun barrel
  [_,_,_,_,O,A,A,A,A,O,O,O,O,O,_,_], // belt
  [_,_,_,_,O,K,O,O,K,O,_,_,_,_,_,_], // pants split
  [_,_,_,_,O,K,O,_,O,K,O,_,_,_,_,_], // legs
  [_,_,_,_,O,K,O,_,O,K,O,_,_,_,_,_], // legs
  [_,_,_,_,O,K,O,_,O,K,O,_,_,_,_,_], // legs
  [_,_,_,O,K,K,O,_,O,K,K,O,_,_,_,_], // feet
  [_,_,_,O,O,O,O,_,O,O,O,O,_,_,_,_], // boots
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

export const RAIDER_SHOOT = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
  [_,_,_,_,_,O,O,O,O,O,_,_,_,_,_,_], // head (bandana)
  [_,_,_,_,O,A,A,R,A,A,O,_,_,_,_,_], // bandana with red
  [_,_,_,_,O,SK,SK,SK,SK,SK,O,_,_,_,_,_], // face
  [_,_,_,_,O,SK,O,SK,O,SK,O,_,_,_,_,_], // eyes
  [_,_,_,_,_,O,SK,SK,SK,O,_,_,_,_,_,_], // nose
  [_,_,_,_,O,A,A,A,A,A,O,_,_,_,_,_], // shoulder armor
  [_,_,_,O,A,A,A,A,A,A,A,O,_,_,_,_], // torso
  [_,_,_,O,A,A,A,A,A,A,A,O,_,_,_,_], // torso
  [_,O,O,SK,O,A,A,A,A,O,SK,O,_,_,_,_], // arms extended
  [O,Y,O,SK,O,A,A,A,A,O,O,O,O,O,_,_], // muzzle flash + gun
  [_,O,O,O,O,A,A,A,A,O,G,G,G,G,O,_], // gun barrel
  [_,_,_,_,O,A,A,A,A,O,O,O,O,O,_,_], // belt
  [_,_,_,_,O,K,O,O,K,O,_,_,_,_,_,_], // pants split
  [_,_,_,_,O,K,O,_,O,K,O,_,_,_,_,_], // legs
  [_,_,_,_,O,K,O,_,O,K,O,_,_,_,_,_], // legs
  [_,_,_,_,O,K,O,_,O,K,O,_,_,_,_,_], // legs
  [_,_,_,O,K,K,O,_,O,K,K,O,_,_,_,_], // feet
  [_,_,_,O,O,O,O,_,O,O,O,O,_,_,_,_], // boots
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

export const RAIDER_FRAMES = [RAIDER_IDLE, RAIDER_SHOOT];

// =============================================================================
// BRUTE - Hulking mutant humanoid tank (28x28)
// Massive, slow, intimidating. Gray skin, exposed muscle, armor scraps.
// =============================================================================

// Flesh/mutation color (using existing palette indices)
const F = 3;  // Red for exposed muscle
const M = 27; // Dark rust for armor scraps

export const BRUTE_IDLE = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
  [_,_,_,_,_,_,_,_,_,O,O,O,O,O,O,O,O,O,O,_,_,_,_,_,_,_,_,_], // 0  head top
  [_,_,_,_,_,_,_,_,O,G,G,G,G,G,G,G,G,G,G,O,_,_,_,_,_,_,_,_], // 1
  [_,_,_,_,_,_,_,O,G,G,G,G,G,G,G,G,G,G,G,G,O,_,_,_,_,_,_,_], // 2
  [_,_,_,_,_,_,O,G,G,G,R,R,G,G,G,G,R,R,G,G,G,O,_,_,_,_,_,_], // 3  eyes
  [_,_,_,_,_,_,O,G,G,G,R,R,G,G,T,T,R,R,G,G,G,O,_,_,_,_,_,_], // 4  eyes + mutation
  [_,_,_,_,_,O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O,_,_,_,_,_], // 5
  [_,_,_,_,_,O,G,G,K,K,K,K,K,K,K,K,K,K,K,K,G,G,O,_,_,_,_,_], // 6  mouth/jaw
  [_,_,_,_,_,O,G,G,K,W,_,W,_,W,_,W,_,W,_,K,G,G,O,_,_,_,_,_], // 7  teeth
  [_,_,_,_,_,_,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,_,_,_,_,_,_], // 8  chin
  [_,_,_,O,O,O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O,O,O,_,_,_], // 9  neck/shoulders
  [_,_,O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O,_,_], // 10 shoulders
  [_,O,G,G,G,G,G,G,G,M,M,M,M,M,M,M,M,M,M,G,G,G,G,G,G,G,O,_], // 11 upper chest + armor
  [_,O,G,G,F,F,G,G,M,M,M,M,M,M,M,M,M,M,M,M,G,G,F,F,G,G,O,_], // 12 chest + exposed muscle
  [O,G,G,G,F,F,G,G,M,M,T,M,M,M,M,M,T,M,M,M,G,G,F,F,G,G,G,O], // 13 chest + toxic veins
  [O,G,G,G,G,G,G,G,M,M,M,M,M,M,M,M,M,M,M,M,G,G,G,G,G,G,G,O], // 14 torso
  [O,G,G,G,G,G,G,G,G,M,M,M,M,M,M,M,M,M,M,G,G,G,G,G,G,G,G,O], // 15 torso
  [O,G,G,G,G,G,G,G,G,G,M,M,M,M,M,M,M,M,G,G,G,G,G,G,G,G,G,O], // 16 waist
  [O,K,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,K,O], // 17 hips
  [_,O,K,G,G,G,G,G,G,O,O,O,O,O,O,O,O,O,O,G,G,G,G,G,G,K,O,_], // 18 belt
  [_,_,O,K,K,G,G,G,O,K,K,K,K,K,K,K,K,K,K,O,G,G,G,K,K,O,_,_], // 19 legs start
  [_,_,O,K,K,K,G,G,O,K,K,K,K,K,K,K,K,K,K,O,G,G,K,K,K,O,_,_], // 20
  [_,_,_,O,K,K,K,G,O,K,K,K,O,O,O,O,K,K,K,O,G,K,K,K,O,_,_,_], // 21
  [_,_,_,O,K,K,K,O,K,K,K,O,_,_,_,_,O,K,K,K,O,K,K,K,O,_,_,_], // 22
  [_,_,_,_,O,K,K,O,K,K,K,O,_,_,_,_,O,K,K,K,O,K,K,O,_,_,_,_], // 23 legs
  [_,_,_,_,O,K,K,O,K,K,K,O,_,_,_,_,O,K,K,K,O,K,K,O,_,_,_,_], // 24
  [_,_,_,O,K,K,K,O,K,K,O,_,_,_,_,_,_,O,K,K,O,K,K,K,O,_,_,_], // 25 feet
  [_,_,_,O,K,K,K,K,O,O,_,_,_,_,_,_,_,_,O,O,K,K,K,K,O,_,_,_], // 26
  [_,_,_,_,O,O,O,O,O,_,_,_,_,_,_,_,_,_,_,O,O,O,O,O,_,_,_,_], // 27
];

export const BRUTE_WALK = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
  [_,_,_,_,_,_,_,_,_,O,O,O,O,O,O,O,O,O,O,_,_,_,_,_,_,_,_,_], // 0  head top
  [_,_,_,_,_,_,_,_,O,G,G,G,G,G,G,G,G,G,G,O,_,_,_,_,_,_,_,_], // 1
  [_,_,_,_,_,_,_,O,G,G,G,G,G,G,G,G,G,G,G,G,O,_,_,_,_,_,_,_], // 2
  [_,_,_,_,_,_,O,G,G,G,R,R,G,G,G,G,R,R,G,G,G,O,_,_,_,_,_,_], // 3  eyes
  [_,_,_,_,_,_,O,G,G,G,R,R,G,G,T,T,R,R,G,G,G,O,_,_,_,_,_,_], // 4  eyes + mutation
  [_,_,_,_,_,O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O,_,_,_,_,_], // 5
  [_,_,_,_,_,O,G,G,K,K,K,K,K,K,K,K,K,K,K,K,G,G,O,_,_,_,_,_], // 6  mouth/jaw
  [_,_,_,_,_,O,G,G,K,W,_,W,_,W,_,W,_,W,_,K,G,G,O,_,_,_,_,_], // 7  teeth
  [_,_,_,_,_,_,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,_,_,_,_,_,_], // 8  chin
  [_,_,_,O,O,O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O,O,O,_,_,_], // 9  neck/shoulders
  [_,_,O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O,_,_], // 10 shoulders
  [_,O,G,G,G,G,G,G,G,M,M,M,M,M,M,M,M,M,M,G,G,G,G,G,G,G,O,_], // 11 upper chest + armor
  [_,O,G,G,F,F,G,G,M,M,M,M,M,M,M,M,M,M,M,M,G,G,F,F,G,G,O,_], // 12 chest + exposed muscle
  [O,G,G,G,F,F,G,G,M,M,T,M,M,M,M,M,T,M,M,M,G,G,F,F,G,G,G,O], // 13 chest + toxic veins
  [O,G,G,G,G,G,G,G,M,M,M,M,M,M,M,M,M,M,M,M,G,G,G,G,G,G,G,O], // 14 torso
  [O,G,G,G,G,G,G,G,G,M,M,M,M,M,M,M,M,M,M,G,G,G,G,G,G,G,G,O], // 15 torso
  [O,G,G,G,G,G,G,G,G,G,M,M,M,M,M,M,M,M,G,G,G,G,G,G,G,G,G,O], // 16 waist
  [O,K,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,K,O], // 17 hips
  [_,O,K,G,G,G,G,G,G,O,O,O,O,O,O,O,O,O,O,G,G,G,G,G,G,K,O,_], // 18 belt
  [_,_,O,K,K,G,G,O,K,K,K,K,K,K,K,K,K,K,K,K,O,G,G,K,K,O,_,_], // 19 legs (shifted)
  [_,_,_,O,K,K,G,O,K,K,K,K,K,K,K,K,K,K,K,K,O,G,K,K,O,_,_,_], // 20
  [_,_,_,O,K,K,O,K,K,K,K,O,O,O,O,O,O,K,K,K,K,O,K,K,O,_,_,_], // 21
  [_,_,_,_,O,K,O,K,K,K,O,_,_,_,_,_,_,O,K,K,K,O,K,O,_,_,_,_], // 22
  [_,_,_,_,O,K,O,K,K,K,O,_,_,_,_,_,_,O,K,K,K,O,K,O,_,_,_,_], // 23 legs (walking)
  [_,_,_,_,_,O,O,K,K,O,_,_,_,_,_,_,_,_,O,K,K,O,O,_,_,_,_,_], // 24
  [_,_,_,_,O,K,O,K,K,O,_,_,_,_,_,_,_,_,O,K,K,O,K,O,_,_,_,_], // 25
  [_,_,_,O,K,K,_,O,O,_,_,_,_,_,_,_,_,_,_,O,O,_,K,K,O,_,_,_], // 26 feet
  [_,_,_,O,O,O,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,O,O,O,_,_,_], // 27
];

export const BRUTE_FRAMES = [BRUTE_IDLE, BRUTE_WALK];

// =============================================================================
// ENEMY SPRITE DATA EXPORT
// =============================================================================

// =============================================================================
// UFO - Alien flying saucer (24x14)
// Classic saucer shape - dome on top, wide disc body, colored lights.
// Hovers in the air, bobs up and down, resists scroll like Brute.
// =============================================================================

export const UFO_FRAME_1 = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3
  [_,_,_,_,_,_,_,_,_,O,SV,SV,SV,SV,O,_,_,_,_,_,_,_,_,_], // dome top
  [_,_,_,_,_,_,_,_,O,SV,SV,SV,SV,SV,SV,O,_,_,_,_,_,_,_,_], // dome
  [_,_,_,_,_,_,_,O,SV,SV,W,SV,SV,W,SV,SV,O,_,_,_,_,_,_,_], // dome windows
  [_,_,_,_,_,O,O,SV,SV,SV,SV,SV,SV,SV,SV,SV,SV,O,O,_,_,_,_,_], // dome base
  [_,_,_,O,O,G,G,G,G,LG,LG,LG,LG,LG,LG,G,G,G,G,O,O,_,_,_], // upper hull
  [_,_,O,G,G,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,G,G,O,_,_,_], // hull
  [_,O,G,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,G,O,_,_], // main hull
  [O,G,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,G,O,_], // widest part
  [O,G,LG,LG,Y,LG,LG,R,LG,LG,T,LG,LG,T,LG,LG,R,LG,LG,Y,LG,G,O,_], // lights row
  [_,O,G,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,G,O,_,_], // lower hull
  [_,_,O,G,G,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,G,G,O,_,_,_], // tapering
  [_,_,_,O,O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O,O,_,_,_], // bottom edge
  [_,_,_,_,_,O,O,O,O,O,O,O,O,O,O,O,O,O,O,_,_,_,_,_], // underside
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_], // spacer
];

// Frame 2 - lights blink pattern
export const UFO_FRAME_2 = [
  //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3
  [_,_,_,_,_,_,_,_,_,O,SV,SV,SV,SV,O,_,_,_,_,_,_,_,_,_], // dome top
  [_,_,_,_,_,_,_,_,O,SV,SV,SV,SV,SV,SV,O,_,_,_,_,_,_,_,_], // dome
  [_,_,_,_,_,_,_,O,SV,SV,W,SV,SV,W,SV,SV,O,_,_,_,_,_,_,_], // dome windows
  [_,_,_,_,_,O,O,SV,SV,SV,SV,SV,SV,SV,SV,SV,SV,O,O,_,_,_,_,_], // dome base
  [_,_,_,O,O,G,G,G,G,LG,LG,LG,LG,LG,LG,G,G,G,G,O,O,_,_,_], // upper hull
  [_,_,O,G,G,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,G,G,O,_,_,_], // hull
  [_,O,G,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,G,O,_,_], // main hull
  [O,G,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,G,O,_], // widest part
  [O,G,LG,LG,R,LG,LG,Y,LG,LG,S,LG,LG,S,LG,LG,Y,LG,LG,R,LG,G,O,_], // lights blink
  [_,O,G,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,G,O,_,_], // lower hull
  [_,_,O,G,G,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,LG,G,G,O,_,_,_], // tapering
  [_,_,_,O,O,G,G,G,G,G,G,G,G,G,G,G,G,G,G,O,O,_,_,_], // bottom edge
  [_,_,_,_,_,O,O,O,O,O,O,O,O,O,O,O,O,O,O,_,_,_,_,_], // underside
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_], // spacer
];

export const UFO_FRAMES = [UFO_FRAME_1, UFO_FRAME_2];

// =============================================================================
// ENEMY SPRITE DATA EXPORT
// =============================================================================

export const ENEMY_SPRITES = {
  RAD_ROACH: {
    frames: RAD_ROACH_FRAMES,
    palette: PALETTE,
    animRate: 8,
    width: 18,
    height: 12,
  },
  PLAGUE_BAT: {
    frames: PLAGUE_BAT_FRAMES,
    palette: PALETTE,
    animRate: 6,
    width: 16,
    height: 14,
  },
  SLUDGE_CRAWLER: {
    frames: SLUDGE_CRAWLER_FRAMES,
    palette: PALETTE,
    animRate: 4,
    width: 14,
    height: 10,
  },
  RAIDER: {
    frames: RAIDER_FRAMES,
    palette: PALETTE,
    animRate: 4,
    width: 16,
    height: 20,
  },
  BRUTE: {
    frames: BRUTE_FRAMES,
    palette: PALETTE,
    animRate: 3, // Slow lumbering walk
    width: 28,
    height: 28,
  },
  UFO: {
    frames: UFO_FRAMES,
    palette: PALETTE,
    animRate: 4, // Light blinking speed
    width: 24,
    height: 14,
  },
};

export const ENEMY_PALETTE = PALETTE;
