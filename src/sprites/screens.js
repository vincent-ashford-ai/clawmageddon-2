// =============================================================================
// CLAWMAGEDDON 2 - EPIC SCREEN ARTWORK
// Title screen and Game Over screen pixel art compositions
// =============================================================================

import { PALETTE } from './palette.js';

// Color aliases
const _ = 0;  // transparent
const O = 1;  // dark outline/shadow
const K = 2;  // dark gray (city silhouettes)
const R = 3;  // lobster red (body)
const L = 4;  // lighter red (claws, highlights)
const F = 5;  // orange (fire, glow)
const Y = 6;  // yellow (fire tips)
const G = 7;  // military green
const B = 8;  // near black
const BR = 9; // brown
const DR = 10;// dark brown
const P = 11; // purple (bat)
const LP = 12;// light purple
const RE = 13;// pure red (eyes)
const GR = 14;// gray (hound)
const DG = 15;// dark gray
const T = 16; // toxic green
const BG = 17;// bright green
const W = 19; // white
const C = 22; // wasteland ground
const CD = 23;// ground detail
const RU = 26;// rust orange
const DRU = 27;// dark rust
const SK = 28;// skin tone
const OG = 29;// orange glow

// =============================================================================
// TITLE SCREEN - Epic heroic composition (200x160 pixels)
// The Lobster in heroic pose with wasteland background and enemy silhouettes
// =============================================================================

// Generate the title screen programmatically for efficiency
// This creates a dramatic scene with sky gradient, ruined city, and the hero

export function generateTitleScreen() {
  const width = 200;
  const height = 160;
  const pixels = [];
  
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      // Default: transparent
      let color = _;
      
      // Sky gradient (top 60 rows)
      if (y < 60) {
        // Dark red/orange apocalyptic sky
        if (y < 15) {
          color = O; // dark smoke at top
        } else if (y < 30) {
          color = BR; // brown/smoky
        } else if (y < 45) {
          color = RU; // rust orange
        } else {
          color = F; // bright orange at horizon
        }
        
        // Add smoke clouds
        if ((x + y * 7) % 37 < 5 && y < 40) {
          color = O;
        }
        if ((x * 3 + y * 11) % 51 < 4 && y < 35) {
          color = K;
        }
      }
      
      // City silhouettes (background, rows 30-100)
      if (y >= 30 && y < 100) {
        // Building 1 (left)
        if (x >= 5 && x <= 25 && y >= 50) {
          color = O;
          // Windows
          if ((x - 5) % 5 === 2 && (y - 50) % 8 > 1 && (y - 50) % 8 < 5) {
            color = y < 70 ? F : _;
          }
        }
        // Building 2
        if (x >= 30 && x <= 45 && y >= 35) {
          color = O;
          if ((x - 30) % 4 === 1 && (y - 35) % 6 > 1 && (y - 35) % 6 < 4) {
            color = y < 55 ? RU : _;
          }
        }
        // Building 3 (tall center-left)
        if (x >= 50 && x <= 70 && y >= 25) {
          color = O;
          // Broken top
          if (y < 35 && (x + y) % 7 < 2) color = _;
        }
        // Building 4 (right side)
        if (x >= 150 && x <= 170 && y >= 40) {
          color = O;
        }
        // Building 5 (far right)
        if (x >= 175 && x <= 195 && y >= 30) {
          color = O;
          // Broken chunks
          if (y < 45 && (x * y) % 11 < 3) color = _;
        }
        // Building 6 (center right)
        if (x >= 130 && x <= 145 && y >= 55) {
          color = O;
        }
      }
      
      // Ground (bottom 60 rows)
      if (y >= 100) {
        color = C;
        // Ground variation
        if ((x * 3 + y * 7) % 19 < 2) color = CD;
        if ((x + y * 5) % 23 < 1) color = BR;
        
        // Rubble/debris
        if (y >= 100 && y < 110) {
          if ((x * 7 + y) % 31 < 4) color = DG;
          if ((x + y * 3) % 29 < 2) color = K;
        }
      }
      
      row.push(color);
    }
    pixels.push(row);
  }
  
  // Draw THE LOBSTER (center, heroic pose) - 40x60 pixels
  drawHeroLobster(pixels, 80, 55);
  
  // Draw enemy silhouettes
  drawEnemySilhouettes(pixels);
  
  // Add fire/explosion accents
  addFireEffects(pixels, 200, 160);
  
  return pixels;
}

function drawHeroLobster(pixels, cx, startY) {
  // Simplified heroic lobster (facing right, claws raised)
  // This is a larger, more heroic version of the player sprite
  
  const lobster = [
    // Antennae (dramatic, swept back)
    "................LLLL................LLLL",
    "...............LL..LL..............LL..LL",
    "..............L......L............L......L",
    // Head
    "...............OOOOOOOOOOOOOOO..............",
    "..............ORRRRRRRRRRRRRRRO.............",
    ".............ORRRRRLRRRRLRRRRRO............",
    ".............ORRBWRRRRRRRWBRRRO............",
    ".............ORRRRRRRRRRRRRRRO.............",
    "..............ORRRRRWWRRRRRO..............",
    "...............OOOOOOOOOOOOO...............",
    // Shoulders/arms spread wide (heroic pose)
    "......OOOOO......OSSSSSSO......OOOOO......",
    "....OLLLLLO....OSSSSSSSSSO....OLLLLLO....",
    "...OLLRLLLLO..OSSSSSSSSSSO..OLLLLRLLLO...",
    "..OLLRRRLLLO.OSSSSSSSSSSSO.OLLLRRRLLO...",
    ".OLLRRRRRLLOOSSSSSSSSSSSSSOOLLRRRRRRLLO.",
    "OLLRRRRRRRLOOSSSSSSSSSSSSSOOLLRRRRRRRLLOO",
    ".OLLRRRRRLLOOSSSSSSSSSSSSOOOLLLRRRRRLLO.",
    "..OLLLLLLLOOOSSSSSSSSSSOOO..OLLLLLLLLO..",
    "...OOOOOOO....OSSSSSSSO....OOOOOOO.....",
    // Belt
    "..............OGGGGGGGO................",
    // Legs (wide stance)
    ".............OGGGGGGGGGGO..............",
    "............OGGGG.OO.GGGGO.............",
    "...........OGGG......GGGO.............",
    "..........OGGG........GGGO............",
    "..........OGG..........GGO............",
    ".........OGG............GGO...........",
    ".........OBB............BBO...........",
    "........OBBBB..........BBBBO..........",
    ".......OBBBBB..........BBBBBO.........",
    ".......OOOOO............OOOOO.........",
  ];
  
  // Convert string art to pixel data and overlay on existing image
  const colorMap = {
    '.': -1, // don't change
    'O': O,
    'R': R,
    'L': L,
    'B': B,
    'W': W,
    'S': SK,
    'G': G,
  };
  
  const lobsterHeight = lobster.length;
  const lobsterWidth = lobster[0].length;
  const offsetX = cx - Math.floor(lobsterWidth / 2);
  
  for (let y = 0; y < lobsterHeight; y++) {
    for (let x = 0; x < lobsterWidth; x++) {
      const char = lobster[y][x];
      if (char !== '.' && colorMap[char] !== undefined) {
        const px = offsetX + x;
        const py = startY + y;
        if (py >= 0 && py < pixels.length && px >= 0 && px < pixels[0].length) {
          pixels[py][px] = colorMap[char];
        }
      }
    }
  }
}

function drawEnemySilhouettes(pixels) {
  // Add menacing enemy shapes in the background
  
  // Bat silhouettes (flying, wings spread) - top left and right
  const batLeft = [
    [_,O,O,O,_,_,_,_,_,O,O,O,_],
    [O,O,O,O,O,O,O,O,O,O,O,O,O],
    [_,O,O,O,O,O,O,O,O,O,O,O,_],
    [_,_,O,O,O,O,O,O,O,O,O,_,_],
    [_,_,_,O,O,O,O,O,O,O,_,_,_],
  ];
  overlaySprite(pixels, batLeft, 10, 65);
  overlaySprite(pixels, batLeft, 175, 55);
  
  // Roach silhouettes (ground level, sides)
  const roach = [
    [_,O,O,_,_,_,_,_,O,O,_],
    [O,O,O,O,O,O,O,O,O,O,O],
    [O,O,O,O,O,O,O,O,O,O,O],
    [_,O,_,O,_,O,_,O,_,O,_],
  ];
  overlaySprite(pixels, roach, 15, 128);
  overlaySprite(pixels, roach, 170, 125);
  
  // Hound silhouette (prowling, mid-distance)
  const hound = [
    [_,O,O,O,_,_,_,_,_,_,_,O,O,O,_],
    [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
    [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
    [_,_,_,O,O,O,_,_,_,O,O,O,_,_,_],
    [_,_,O,O,O,_,_,_,_,_,O,O,O,_,_],
  ];
  overlaySprite(pixels, hound, 155, 115);
  
  // Brute silhouette (looming in background, left side)
  const brute = [
    [_,_,_,O,O,O,O,O,O,O,_,_,_],
    [_,_,O,O,O,O,O,O,O,O,O,_,_],
    [_,O,O,O,O,O,O,O,O,O,O,O,_],
    [O,O,O,O,O,O,O,O,O,O,O,O,O],
    [O,O,O,O,O,O,O,O,O,O,O,O,O],
    [O,O,O,O,O,O,O,O,O,O,O,O,O],
    [_,O,O,O,_,_,_,_,_,O,O,O,_],
    [_,O,O,_,_,_,_,_,_,_,O,O,_],
  ];
  overlaySprite(pixels, brute, 35, 95);
}

function overlaySprite(pixels, sprite, x, y) {
  for (let sy = 0; sy < sprite.length; sy++) {
    for (let sx = 0; sx < sprite[sy].length; sx++) {
      if (sprite[sy][sx] !== _) {
        const px = x + sx;
        const py = y + sy;
        if (py >= 0 && py < pixels.length && px >= 0 && px < pixels[0].length) {
          pixels[py][px] = sprite[sy][sx];
        }
      }
    }
  }
}

function addFireEffects(pixels, width, height) {
  // Add orange/yellow fire/glow effects at strategic points
  const firePoints = [
    { x: 10, y: 90 },
    { x: 185, y: 85 },
    { x: 45, y: 95 },
    { x: 160, y: 92 },
  ];
  
  for (const point of firePoints) {
    // Small fire
    for (let dy = -3; dy <= 0; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const px = point.x + dx;
        const py = point.y + dy;
        if (py >= 0 && py < height && px >= 0 && px < width) {
          if (Math.abs(dx) + Math.abs(dy) < 3) {
            pixels[py][px] = dy < -1 ? Y : F;
          }
        }
      }
    }
  }
}

// =============================================================================
// GAME OVER SCREEN - Dramatic fallen hero (200x120 pixels)
// The Lobster fallen, dramatic lighting, wasteland graveyard
// =============================================================================

export function generateGameOverScreen() {
  const width = 200;
  const height = 120;
  const pixels = [];
  
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let color = _;
      
      // Dark somber sky (top 40 rows)
      if (y < 40) {
        color = O;
        // Slight gradient
        if (y > 30) color = K;
        // Occasional blood red streak
        if ((x * 5 + y * 13) % 97 < 2 && y < 25) color = R;
      }
      
      // Dark ground (bottom 80 rows)
      if (y >= 40) {
        color = O;
        // Ground texture variation
        if ((x + y * 3) % 17 < 2) color = K;
        if ((x * 7 + y) % 29 < 1) color = BR;
      }
      
      row.push(color);
    }
    pixels.push(row);
  }
  
  // Draw gravestones
  drawGravestone(pixels, 25, 45, 12, 25);
  drawGravestone(pixels, 165, 50, 10, 20);
  drawGravestone(pixels, 50, 60, 8, 15);
  drawGravestone(pixels, 145, 55, 9, 18);
  
  // Draw the fallen lobster (center)
  drawFallenLobster(pixels, 100, 70);
  
  // Add dramatic spotlight effect
  addSpotlight(pixels, 100, 85, 30);
  
  return pixels;
}

function drawGravestone(pixels, x, y, w, h) {
  // Simple gravestone shape
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const px = x + dx;
      const py = y + dy;
      if (py >= 0 && py < pixels.length && px >= 0 && px < pixels[0].length) {
        // Rounded top
        if (dy < 4) {
          if (dx >= 2 && dx < w - 2) {
            pixels[py][px] = DG;
          } else if (dy >= 2 && (dx === 1 || dx === w - 2)) {
            pixels[py][px] = DG;
          }
        } else {
          pixels[py][px] = DG;
        }
        // Cross detail
        if (dy === Math.floor(h / 3) && dx > 2 && dx < w - 2) {
          pixels[py][px] = GR;
        }
        if (dx === Math.floor(w / 2) && dy > 2 && dy < h - 3) {
          pixels[py][px] = GR;
        }
      }
    }
  }
}

function drawFallenLobster(pixels, cx, cy) {
  // Lobster lying on side, X eyes, limp claws
  const fallen = [
    // Lying horizontally
    "..........OOOOOOOOO..........",
    ".........ORRRRRRRRRO.........",
    "........ORRRXRRXRRRO.........", // X eyes
    "........ORRRRRRRRRRO.........",
    ".......ORRRRRRRRRRRRO........",
    "OOOO..ORRRRRRRRRRRRRRRO..OOOO", // body with limp claws
    "OLLLO.ORRRRRRRRRRRRRRRO.OLLLO",
    ".OLLO.OSSSSSSSSSSSSSSO..OLLO.",
    "..OOO.OSSSSSSSSSSSSSO...OOO..",
    ".....OSSSSSSSSSSSSSO.........",
    ".....OGGGGGGGGGGGGO..........",
    "......OGGGG..GGGGO...........",
    ".......OBBO..OBBO............",
  ];
  
  const colorMap = {
    '.': -1,
    'O': O,
    'R': R,
    'L': L,
    'B': B,
    'X': W, // X eyes (white)
    'S': SK,
    'G': G,
  };
  
  const offsetX = cx - Math.floor(fallen[0].length / 2);
  
  for (let y = 0; y < fallen.length; y++) {
    for (let x = 0; x < fallen[y].length; x++) {
      const char = fallen[y][x];
      if (char !== '.' && colorMap[char] !== undefined) {
        const px = offsetX + x;
        const py = cy + y;
        if (py >= 0 && py < pixels.length && px >= 0 && px < pixels[0].length) {
          pixels[py][px] = colorMap[char];
        }
      }
    }
  }
}

function addSpotlight(pixels, cx, cy, radius) {
  // Subtle red/orange glow around the fallen hero
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius && dist > radius * 0.7) {
        const px = cx + dx;
        const py = cy + dy;
        if (py >= 0 && py < pixels.length && px >= 0 && px < pixels[0].length) {
          // Only affect ground pixels
          if (pixels[py][px] === O || pixels[py][px] === K) {
            // Subtle red tint
            if ((dx + dy) % 3 === 0) {
              pixels[py][px] = BR;
            }
          }
        }
      }
    }
  }
}

// Export palette reference
export const SCREEN_PALETTE = PALETTE;
