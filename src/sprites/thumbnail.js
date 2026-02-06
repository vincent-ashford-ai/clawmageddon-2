// =============================================================================
// CLAWMAGEDDON 2 - GAME THUMBNAIL (256x256)
// Eye-catching thumbnail for Play.fun and store listings
// Features The Lobster in heroic action pose with post-apocalyptic vibe
// =============================================================================

import { PALETTE } from './palette.js';

// Color aliases for readability
const _ = 0;  // transparent
const O = 1;  // dark outline/shadow
const K = 2;  // dark gray (silhouettes)
const R = 3;  // lobster red (body)
const L = 4;  // lighter red (claws, highlights)
const F = 5;  // orange (fire, glow)
const Y = 6;  // yellow (fire tips, highlights)
const G = 7;  // military green
const B = 8;  // near black
const BR = 9; // brown
const W = 19; // white
const C = 22; // wasteland ground
const CD = 23;// ground detail
const RU = 26;// rust orange
const SK = 28;// skin tone

// =============================================================================
// THUMBNAIL GENERATION (256x256)
// =============================================================================

export function generateThumbnail() {
  const size = 256;
  const pixels = [];
  
  // Initialize with background
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      let color = _;
      
      // === SKY GRADIENT (top ~100 rows) ===
      if (y < 100) {
        if (y < 25) {
          color = O; // dark smoke at top
        } else if (y < 50) {
          color = BR; // brown smoky
        } else if (y < 75) {
          color = RU; // rust orange
        } else {
          color = F; // bright orange at horizon
        }
        
        // Dramatic smoke/cloud patterns
        if ((x * 7 + y * 11) % 47 < 6 && y < 60) {
          color = O;
        }
        if ((x * 3 + y * 17) % 61 < 4 && y < 45) {
          color = K;
        }
        // Fiery streaks near horizon
        if (y > 70 && y < 95 && (x + y * 5) % 29 < 3) {
          color = Y;
        }
      }
      
      // === RUINED CITY SILHOUETTES ===
      if (y >= 40 && y < 140) {
        // Building far left
        if (x >= 5 && x <= 30 && y >= 55) color = O;
        // Tall building left
        if (x >= 35 && x <= 55 && y >= 40) {
          color = O;
          // Broken top
          if (y < 50 && (x + y) % 5 < 2) color = _;
        }
        // Building right side
        if (x >= 200 && x <= 225 && y >= 50) color = O;
        // Far right tower
        if (x >= 230 && x <= 250 && y >= 35) {
          color = O;
          if (y < 45 && (x * y) % 7 < 2) color = _;
        }
        // Mid-right building
        if (x >= 180 && x <= 195 && y >= 65) color = O;
      }
      
      // === GROUND (bottom ~110 rows) ===
      if (y >= 145) {
        color = C;
        // Ground texture variation
        if ((x * 3 + y * 7) % 19 < 3) color = CD;
        if ((x + y * 5) % 31 < 2) color = BR;
        if ((x * 11 + y) % 41 < 2) color = RU;
        
        // Rubble near horizon
        if (y >= 145 && y < 160) {
          if ((x * 7 + y) % 23 < 5) color = K;
          if ((x + y * 3) % 17 < 3) color = O;
        }
      }
      
      row.push(color);
    }
    pixels.push(row);
  }
  
  // === DRAW THE LOBSTER (center, large, heroic action pose) ===
  drawHeroLobsterLarge(pixels, 128, 75);
  
  // === ADD MUZZLE FLASH & BULLET TRAILS ===
  addActionEffects(pixels);
  
  // === DRAW TITLE TEXT ===
  drawTitle(pixels);
  
  // === ADD FIRE/EXPLOSION EFFECTS ===
  addFireEffects(pixels);
  
  return pixels;
}

// Large heroic lobster (centered, claws raised aggressively)
function drawHeroLobsterLarge(pixels, cx, startY) {
  // 64x100 pixel lobster in action pose
  const lobster = [
    // Antennae (dramatic, spread wide)
    "..............LLLL..................................LLLL..............",
    "............LLLLLL................................LLLLLL.............",
    "...........LL....LL..............................LL....LL............",
    "..........L........L............................L........L...........",
    // Head (large, fierce)
    "........................OOOOOOOOOOOOOOOOOOO.......................",
    "......................OORRRRRRRRRRRRRRRRRROO.....................",
    ".....................ORRRRRRRRRRRRRRRRRRRRRRRO....................",
    "...................ORRRRRRRRRRRRRRRRRRRRRRRRRRRO..................",
    "...................ORRRRRLLLRRRRRRRRRRLLRRRRRRRRO.................",
    ".................ORRRRRBWWBRRRRRRRRRRBWWBRRRRRRRRO................",
    ".................ORRRRRRBBRRRRRRRRRRRBBRRRRRRRRRO................",
    ".................ORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRO................",
    ".................ORRRRRRRRRRRRWWWWRRRRRRRRRRRRRRO.................",
    "..................ORRRRRRRRRRRWWWWRRRRRRRRRRRRRO..................",
    "...................OORRRRRRRRRRRRRRRRRRRRRRRROO...................",
    ".....................OOORRRRRRRRRRRRRRRRRRROOO....................",
    "........................OOOOOOOOOOOOOOOOOOO.......................",
    // Neck/shoulders
    "........................OSSSSSSSSSSSSSSSSSO.......................",
    "......................OSSSSSSSSSSSSSSSSSSSSO.....................",
    ".....................OSSSSSSSSSSSSSSSSSSSSSSO....................",
    // Arms spread wide (action pose - claws reaching out)
    "......OOOOO..........OSSSSSSSSSSSSSSSSSSSSSO..........OOOOO......",
    "....OLLLLLLO........OSSSSSSSSSSSSSSSSSSSSSSO........OLLLLLLO....",
    "...OLLLLLLLLO......OSSSSSSSSSSSSSSSSSSSSSSSO......OLLLLLLLLO...",
    "..OLLRRRRRLLO.....OSSSSSSSSSSSSSSSSSSSSSSSSO.....OLLRRRRRLLO..",
    ".OLLRRRRRRRLLOO..OSSSSSSSSSSSSSSSSSSSSSSSSSSO..OOLLRRRRRRRRLLO.",
    "OLLRRRRRRRRRLOO.OSSSSSSSSSSSSSSSSSSSSSSSSSSSO.OOLLRRRRRRRRRLLO",
    "OLRRRRRRRRRRLOO.OSSSSSSSSSSSSSSSSSSSSSSSSSSSO.OOLLRRRRRRRRRRLO",
    "OLLRRRRRRRRRLOOOSSSSSSSSSSSSSSSSSSSSSSSSSSSSOOOLLRRRRRRRRRLLO",
    ".OLLRRRRRRRLOO..OSSSSSSSSSSSSSSSSSSSSSSSSSSO..OOLLRRRRRRRRLLO.",
    "..OLLLLLLLLOO....OSSSSSSSSSSSSSSSSSSSSSSSO....OOLLLLLLLLLOO..",
    "...OOOOOOOOO......OSSSSSSSSSSSSSSSSSSSSSO......OOOOOOOOO.....",
    // Belt
    ".....................OGGGGGGGGGGGGGGGGGGGO.....................",
    "....................OOOOOOOOOOOOOOOOOOOOOOO....................",
    // Pants (wide action stance)
    "...................OGGGGGGGGGOOGGGGGGGGGGGO...................",
    "..................OGGGGGGGGGO..OGGGGGGGGGGGO..................",
    ".................OGGGGGGGGO......OGGGGGGGGGGO.................",
    "................OGGGGGGGO..........OGGGGGGGGO................",
    "................OGGGGGGO............OGGGGGGGO................",
    "...............OGGGGGO................OGGGGGGO...............",
    "...............OGGGGO..................OGGGGGO...............",
    "..............OGGGGO....................OGGGGO...............",
    "..............OGGGO......................OGGGO...............",
    ".............OGGGO........................OGGO...............",
    "............OBBBO..........................OBBBO.............",
    "...........OBBBBO..........................OBBBBO............",
    ".........OBBBBBO............................OBBBBBO..........",
    ".........OBBBBBO............................OBBBBBO..........",
    "........OOOOOOO..............................OOOOOOO.........",
  ];
  
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

// Action effects - muzzle flash and bullet trails from claws
function addActionEffects(pixels) {
  const size = 256;
  
  // Left claw muzzle flash (shooting left)
  const flashPoints = [
    { x: 25, y: 115 },
    { x: 230, y: 115 },
  ];
  
  for (const point of flashPoints) {
    // Large muzzle flash
    for (let dy = -8; dy <= 8; dy++) {
      for (let dx = -12; dx <= 12; dx++) {
        const dist = Math.abs(dx) + Math.abs(dy);
        if (dist < 15) {
          const px = point.x + dx;
          const py = point.y + dy;
          if (py >= 0 && py < size && px >= 0 && px < size) {
            if (dist < 5) {
              pixels[py][px] = W; // white center
            } else if (dist < 9) {
              pixels[py][px] = Y; // yellow middle
            } else if (dist < 13) {
              pixels[py][px] = F; // orange outer
            }
          }
        }
      }
    }
  }
  
  // Bullet trails (horizontal lines)
  for (let x = 0; x < 15; x++) {
    if (x < 12) pixels[115][10 + x] = Y;
    if (x < 12) pixels[115][245 - x] = Y;
  }
}

// Title text "CLAW 2" in blocky pixel font
function drawTitle(pixels) {
  // Position: top portion of image, centered
  const titleY = 10;
  const titleStartX = 55;
  
  // Large blocky letters - "CLAW 2" (each letter ~22 pixels wide, 20 tall)
  // Using yellow with orange outline for visibility
  
  const letters = {
    'C': [
      "..OOOOOOOOOO..",
      ".OYYYYYYYYYY..",
      "OYYY.........",
      "OYY..........",
      "OYY..........",
      "OYY..........",
      "OYY..........",
      "OYY..........",
      "OYYY.........",
      ".OYYYYYYYYYY..",
      "..OOOOOOOOOO..",
    ],
    'L': [
      "OYY..........",
      "OYY..........",
      "OYY..........",
      "OYY..........",
      "OYY..........",
      "OYY..........",
      "OYY..........",
      "OYY..........",
      "OYY..........",
      "OYYYYYYYYYYYO",
      "OOOOOOOOOOOOO",
    ],
    'A': [
      "....OOOOO....",
      "...OYYYYYO...",
      "..OYYY.YYYO..",
      ".OYYY...YYYO.",
      ".OYY.....YYO.",
      "OYYYYYYYYYYYOO",
      "OYYYYYYYYYYYOO",
      "OYY.......YYO",
      "OYY.......YYO",
      "OYY.......YYO",
      "OOO.......OOO",
    ],
    'W': [
      "OYY.......YYO",
      "OYY.......YYO",
      "OYY.......YYO",
      "OYY..YYY..YYO",
      "OYY.YYYYY.YYO",
      "OYY.YYYYY.YYO",
      "OYYYYYYYYYYYY",
      ".OYYYYYYYYYO.",
      ".OYYYY.YYYYO.",
      "..OYY...YYO..",
      "..OOO...OOO..",
    ],
    '2': [
      ".OOOOOOOOOO..",
      "OYYYYYYYYYY..",
      "........OYYY.",
      "........OYY..",
      ".....OOOYYY..",
      "..OOOYYYYO...",
      ".OYYYO.......",
      "OYYO.........",
      "OYY..........",
      "OYYYYYYYYYYYO",
      "OOOOOOOOOOOOO",
    ],
  };
  
  const colorMap = {
    '.': -1,
    'O': O, // outline
    'Y': Y, // yellow fill
  };
  
  const word = "CLAW2";
  let currentX = titleStartX;
  const spacing = 30;
  
  // Add extra space between "CLAW" and "2"
  const letterPositions = [
    { letter: 'C', x: 55 },
    { letter: 'L', x: 85 },
    { letter: 'A', x: 115 },
    { letter: 'W', x: 145 },
    { letter: '2', x: 185 },
  ];
  
  for (const pos of letterPositions) {
    const letterData = letters[pos.letter];
    if (!letterData) continue;
    
    for (let ly = 0; ly < letterData.length; ly++) {
      for (let lx = 0; lx < letterData[ly].length; lx++) {
        const char = letterData[ly][lx];
        if (char !== '.' && colorMap[char] !== undefined) {
          const px = pos.x + lx;
          const py = titleY + ly;
          if (py >= 0 && py < pixels.length && px >= 0 && px < pixels[0].length) {
            pixels[py][px] = colorMap[char];
          }
        }
      }
    }
  }
  
  // "MAGEDDON" subtitle (smaller, below main title) - abbreviated to fit
  // Actually let's add "MAGEDDON" in smaller text
  drawSmallText(pixels, "MAGEDDON", 83, 25, F); // orange
}

// Small blocky text for subtitle
function drawSmallText(pixels, text, startX, startY, color) {
  // 5x5 pixel font for small text
  const smallFont = {
    'M': [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
    'A': [[0,1,1,1,0],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],
    'G': [[0,1,1,1,0],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[0,1,1,1,0]],
    'E': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,0,0],[1,0,0,0,0],[1,1,1,1,1]],
    'D': [[1,1,1,0,0],[1,0,0,1,0],[1,0,0,0,1],[1,0,0,1,0],[1,1,1,0,0]],
    'O': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
    'N': [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]],
  };
  
  let x = startX;
  for (const char of text) {
    const glyph = smallFont[char];
    if (glyph) {
      for (let gy = 0; gy < 5; gy++) {
        for (let gx = 0; gx < 5; gx++) {
          if (glyph[gy][gx]) {
            const px = x + gx;
            const py = startY + gy;
            if (py >= 0 && py < pixels.length && px >= 0 && px < pixels[0].length) {
              pixels[py][px] = color;
            }
          }
        }
      }
    }
    x += 7; // letter spacing
  }
}

// Fire and explosion effects around the scene
function addFireEffects(pixels) {
  const size = 256;
  
  const firePoints = [
    { x: 20, y: 145, size: 8 },
    { x: 45, y: 150, size: 6 },
    { x: 210, y: 148, size: 7 },
    { x: 235, y: 152, size: 5 },
    { x: 5, y: 155, size: 4 },
    { x: 250, y: 150, size: 4 },
  ];
  
  for (const point of firePoints) {
    for (let dy = -point.size; dy <= 0; dy++) {
      for (let dx = -point.size/2; dx <= point.size/2; dx++) {
        const px = Math.floor(point.x + dx);
        const py = Math.floor(point.y + dy);
        if (py >= 0 && py < size && px >= 0 && px < size) {
          const dist = Math.abs(dx) + Math.abs(dy * 0.8);
          if (dist < point.size * 0.3) {
            pixels[py][px] = W; // white hot center
          } else if (dist < point.size * 0.6) {
            pixels[py][px] = Y; // yellow
          } else if (dist < point.size) {
            pixels[py][px] = F; // orange
          }
        }
      }
    }
  }
}

// =============================================================================
// THUMBNAIL EXPORT UTILITIES
// =============================================================================

/**
 * Render thumbnail to a canvas element
 * @param {HTMLCanvasElement} canvas - Target canvas
 * @returns {HTMLCanvasElement} The same canvas, for chaining
 */
export function renderThumbnailToCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const pixels = generateThumbnail();
  const size = 256;
  
  canvas.width = size;
  canvas.height = size;
  
  // Clear with dark background
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, size, size);
  
  // Draw pixels
  const imageData = ctx.createImageData(size, size);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const colorIndex = pixels[y][x];
      const idx = (y * size + x) * 4;
      
      if (colorIndex === 0 || colorIndex === undefined) {
        // Transparent - use background
        imageData.data[idx] = 0x1a;
        imageData.data[idx + 1] = 0x1a;
        imageData.data[idx + 2] = 0x1a;
        imageData.data[idx + 3] = 255;
      } else {
        const hex = PALETTE[colorIndex];
        imageData.data[idx] = (hex >> 16) & 0xff;     // R
        imageData.data[idx + 1] = (hex >> 8) & 0xff;  // G
        imageData.data[idx + 2] = hex & 0xff;         // B
        imageData.data[idx + 3] = 255;                // A
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Download thumbnail as PNG file
 * Call this from browser console or a button click handler
 */
export function downloadThumbnail() {
  const canvas = document.createElement('canvas');
  renderThumbnailToCanvas(canvas);
  
  const link = document.createElement('a');
  link.download = 'clawmageddon2-thumbnail.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Get thumbnail as data URL (for preview or upload)
 * @returns {string} Data URL of the PNG
 */
export function getThumbnailDataURL() {
  const canvas = document.createElement('canvas');
  renderThumbnailToCanvas(canvas);
  return canvas.toDataURL('image/png');
}

// Export constants
export const THUMBNAIL_SIZE = 256;
export const THUMBNAIL_PALETTE = PALETTE;
