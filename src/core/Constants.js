// =============================================================================
// CLAWMAGEDDON 2 - CONSTANTS
// All magic numbers, colors, speeds, and config values live here.
// =============================================================================

// Game canvas - PORTRAIT MODE (mobile-first)
export const GAME = {
  WIDTH: 400,
  HEIGHT: 700,
  GRAVITY: 1200,
  GROUND_HEIGHT: 60,
  WORLD_SPEED: 180, // Auto-run speed (pixels per second)
};

// Player (The Lobster)
export const PLAYER = {
  START_X: 80,
  START_Y: 500,
  WIDTH: 48,
  HEIGHT: 64,
  JUMP_VELOCITY: -550,
  DOUBLE_JUMP_VELOCITY: -480,
  MAX_HEARTS: 5,
  STARTING_HEARTS: 3,
  HITS_PER_HEART: 2,
  INVULNERABLE_MS: 1500,
  COLOR_BODY: 0xcc4444,   // Reddish lobster body
  COLOR_CLAWS: 0xff6666,  // Lighter red claws
  COLOR_PANTS: 0x3d5c3d,  // Military green pants
};

// Projectiles
export const PROJECTILE = {
  SPEED: 500,
  WIDTH: 12,
  HEIGHT: 6,
  COLOR: 0xffff00,        // Yellow bullet
  TRIPLE_AMMO: 50,        // Ammo for triple shot power-up
  TRIPLE_ANGLE_UP: -25,   // Degrees
  TRIPLE_ANGLE_DOWN: 25,  // Degrees
};

// Enemies
export const ENEMIES = {
  SPAWN_DISTANCE: 450,    // Spawn ahead of camera (random offset added)
  SPAWN_MIN_OFFSET: 100,  // Minimum distance past screen edge (prevents off-screen kills)
  DESPAWN_DISTANCE: -100, // Remove when this far behind camera
  POOL_SIZE: 15,
  
  RAD_ROACH: {
    WIDTH: 36,
    HEIGHT: 24,
    SPEED: 0,             // Stationary (world scrolls past)
    HP: 1,
    SCORE: 10,
    COLOR: 0x8b4513,      // Brown
    SPAWN_WEIGHT: 40,     // % chance in spawn pool
  },
  
  PLAGUE_BAT: {
    WIDTH: 32,
    HEIGHT: 28,
    SPEED: 0,
    HP: 1,
    SCORE: 10,
    COLOR: 0x4a0080,      // Purple
    SINE_AMPLITUDE: 50,   // Sine wave height
    SINE_FREQUENCY: 3,    // Sine wave speed
    SPAWN_WEIGHT: 35,
    MIN_Y: 150,
    MAX_Y: 400,
  },
  
  SLUDGE_CRAWLER: {
    WIDTH: 56,            // 14x4 scale (2x bigger to be shootable from ground)
    HEIGHT: 40,           // 10x4 scale (2x bigger to be shootable from ground)
    SPEED: 0,             // Stationary (world scrolls past)
    HP: 5,                // Takes 5 hits to kill
    SCORE: 30,            // Higher score for tankier enemy
    COLOR: 0x228b22,      // Toxic green
    SPAWN_WEIGHT: 5,      // Reduced spawn frequency (less common)
    TRAIL_INTERVAL: 800,  // ms between toxic puddle drops
    TRAIL_DAMAGE: 1,      // Damage from stepping in trail
    BACKWARD_SPEED: 0.7,  // Moves backwards at 70% of world scroll speed
  },
  
  RAIDER: {
    WIDTH: 32,            // 16x2 scale
    HEIGHT: 40,           // 20x2 scale
    SPEED: 0,             // Stationary (world scrolls past)
    HP: 2,                // Takes 2 hits to kill
    SCORE: 25,            // Good score for dangerous enemy
    COLOR: 0xaa6633,      // Rust orange (armor)
    SPAWN_WEIGHT: 10,     // Less common, high threat
    // Shooting behavior
    SHOOT_COOLDOWN: 2000, // ms between burst attempts
    BURST_COUNT: 3,       // Shots per burst
    BURST_DELAY: 200,     // ms between shots in burst
    SHOOT_RANGE: 350,     // Only shoots when player is within this range
  },
  
  BRUTE: {
    WIDTH: 64,            // 32x32 sprite at scale 2 = 64x64
    HEIGHT: 64,
    SPEED: 0,             // Stationary (world scrolls past)
    HP: 10,               // Very tanky! Takes 10 shots to kill
    SCORE: 50,            // High reward for killing
    COLOR: 0x666666,      // Gray mutant
    SPAWN_WEIGHT: 8,      // Rare spawn (reduce others' weights if needed)
    RESIST_SPEED: 0.8,    // Moves right at 80% of world speed to linger on screen
  },
  
  UFO: {
    WIDTH: 48,            // 24x14 sprite at scale 2 = 48x28
    HEIGHT: 28,
    SPEED: 0,             // Stationary (world scrolls past)
    HP: 10,               // Very tanky like Brute! Takes 10 shots to kill
    SCORE: 50,            // High reward for killing
    COLOR: 0x888888,      // Silver/gray metallic
    SPAWN_WEIGHT: 6,      // Rare aerial threat
    RESIST_SPEED: 0.85,   // Moves right at 85% of world speed (hovers menacingly)
    BOB_AMPLITUDE: 15,    // Hover bobbing height in pixels
    BOB_FREQUENCY: 2,     // Hover bobbing speed
    MIN_Y: 150,           // Spawn height range (matches PlagueBat)
    MAX_Y: 400,           // Spawn height range (matches PlagueBat)
    // Shooting behavior (air-Brute that shoots like Raider)
    SHOOT_COOLDOWN: 2500, // ms between burst attempts (slower than Raider)
    BURST_COUNT: 2,       // Shots per burst (fewer than Raider)
    BURST_DELAY: 300,     // ms between shots in burst
    SHOOT_RANGE: 400,     // Only shoots when player is within this range
  },
};

// Enemy Projectiles (shot by Raiders)
export const ENEMY_PROJECTILE = {
  SPEED: 280,             // Slower than player bullets
  WIDTH: 10,
  HEIGHT: 6,
  COLOR: 0xff4400,        // Orange-red (different from player yellow)
  DAMAGE: 1,              // Hits (not hearts)
};

// Obstacles
export const OBSTACLES = {
  SPAWN_DISTANCE: 450,
  DESPAWN_DISTANCE: -100,
  POOL_SIZE: 10,
  DAMAGE: 1,             // Hits (not hearts)
  
  SPIKES: {
    WIDTH: 40,
    HEIGHT: 24,
    COLOR: 0x888888,
    COLOR_TIP: 0xcccccc,
  },
  
  TOXIC_BARREL: {
    WIDTH: 32,
    HEIGHT: 48,
    COLOR: 0x228b22,
    COLOR_SYMBOL: 0x00ff00,
  },
  
  SLUDGE_PUDDLE: {
    WIDTH: 60,
    HEIGHT: 12,
    COLOR: 0x00aa00,
  },
};

// Platforms
export const PLATFORMS = {
  SPAWN_DISTANCE: 500,
  DESPAWN_DISTANCE: -150,
  POOL_SIZE: 8,
  MIN_WIDTH: 80,
  MAX_WIDTH: 160,
  HEIGHT: 20,
  COLOR: 0x5a3d2b,        // Brown wood
  COLOR_TOP: 0x7a5d4b,    // Lighter top
  
  // Height tiers (based on jump physics: single=126px, double=220px from ground)
  // Ground is at ~640 (GAME.HEIGHT - GAME.GROUND_HEIGHT)
  // Fixed Y values per tier - no variation
  TIERS: {
    LOW: { Y: 550 },      // Single jump from ground (~90px up)
    MEDIUM: { Y: 480 },   // Double jump from ground (~160px up) - lowered for easier reach
    HIGH: { Y: 380 },     // Platform-hop from MEDIUM tier - lowered for accessibility
  },
  
  // Spawn weights (% chance for each tier when spawning solo)
  TIER_WEIGHTS: {
    LOW: 50,
    MEDIUM: 50,
    HIGH: 0,  // High platforms NEVER spawn alone
  },
  
  // For stepping stone spawns (high platform + helper platform)
  PAIR_CHANCE: 0.25,           // 25% chance to spawn a pair instead of solo
  PAIR_X_OFFSET: 120,          // Horizontal distance between paired platforms
  SINGLE_JUMP_REACH: 126,      // Max height reachable by single jump
  
  // Powerup spawning on platforms (chance 0-1)
  POWERUP_SPAWN_CHANCE: {
    LOW: 0.08,                 // 8% chance for basic powerups
    MEDIUM: 0.15,              // 15% chance for basic powerups
    HIGH: 0.30,                // 30% chance, and ONLY place ExtraHeart can appear
  },
  
  // Which powerups can spawn on each tier
  // ExtraHeart ONLY on HIGH tier (rewarding difficult jumps)
  // MissileLauncher and GrenadeLauncher on MEDIUM and HIGH (rare, powerful)
  POWERUP_TYPES: {
    LOW: ['HealthPack', 'TripleShot', 'Nuke'],
    MEDIUM: ['HealthPack', 'TripleShot', 'Nuke', 'MissileLauncher', 'GrenadeLauncher'],
    HIGH: ['HealthPack', 'TripleShot', 'Nuke', 'ExtraHeart', 'MissileLauncher', 'GrenadeLauncher'],
  },
};

// Power-ups
export const POWERUPS = {
  SPAWN_DISTANCE: 450,
  DESPAWN_DISTANCE: -100,
  POOL_SIZE: 5,
  SIZE: 32,
  
  HEALTH_PACK: {
    COLOR: 0xff0000,
    CROSS_COLOR: 0xffffff,
    SPAWN_WEIGHT: 40,
  },
  
  TRIPLE_SHOT: {
    COLOR: 0xffaa00,
    SPAWN_WEIGHT: 30,
  },
  
  HEAVY_METAL: {
    COLOR: 0x888888,           // Steel gray
    ACCENT_COLOR: 0xff4400,    // Orange muzzle flash accent
    SPAWN_WEIGHT: 10,          // Rare powerful powerup
    AMMO: 500,                 // 500 shots (bursts of 5 = 100 bursts)
    FIRE_RATE: 120,            // ms between auto-fire bursts (FAST)
    // Quintuple shot angles (degrees)
    ANGLE_SLIGHT_UP: -25,      // Slight upward angle
    ANGLE_SLIGHT_DOWN: 25,     // Slight downward angle
    ANGLE_STEEP_UP: -77,       // Almost vertical up (not quite 90°)
    ANGLE_STEEP_DOWN: 77,      // Almost vertical down (not quite -90°)
  },
  
  EXTRA_HEART: {
    COLOR: 0xff69b4,      // Hot pink glow
    SPAWN_WEIGHT: 5,      // Very rare
  },
  
  NUKE: {
    COLOR: 0xffff00,
    SYMBOL_COLOR: 0x000000,
    SPAWN_WEIGHT: 20,
  },
  
  MISSILE_LAUNCHER: {
    COLOR: 0x44aa44,           // Military green
    ACCENT_COLOR: 0xff4400,    // Orange exhaust
    SPAWN_WEIGHT: 8,           // Rare powerful powerup
    AMMO: 25,                  // 25 heat-seeking missiles
    FIRE_RATE: 400,            // ms between missiles (slower than Heavy Metal)
    MISSILE_SPEED: 350,        // Slightly slower than bullets for tracking time
    TURN_RATE: 0.08,           // Radians per frame to turn toward target
    TRAIL_INTERVAL: 50,        // ms between trail particles
  },
  
  GRENADE_LAUNCHER: {
    COLOR: 0x556b2f,           // Dark olive green
    ACCENT_COLOR: 0xffd700,    // Gold fuse
    SPAWN_WEIGHT: 10,          // Moderate rarity
    AMMO: 50,                  // 50 grenades
    FIRE_RATE: 350,            // ms between grenade launches
    GRENADE_SPEED_X: 300,      // Horizontal velocity
    GRENADE_SPEED_Y: -250,     // Initial upward velocity (for arc)
    GRENADE_GRAVITY: 800,      // Gravity applied to grenades
    SPIN_VELOCITY: 360,        // Degrees per second spin
    EXPLOSION_RADIUS: 60,      // Area damage radius
    EXPLOSION_DAMAGE: 3,       // Damage dealt in explosion
  },
};

// Scoring
export const SCORING = {
  POINTS_PER_METER: 1,
  POINTS_PER_KILL: 10,
  METERS_PER_PIXEL: 0.1,  // Convert pixels to "meters" for score
};

// Parallax background layers
export const PARALLAX = {
  SKY: {
    COLOR_TOP: 0xff6b35,    // Orange sky
    COLOR_BOTTOM: 0x8b4513, // Brown horizon
  },
  
  CITY: {
    COLOR: 0x2d2d2d,        // Dark gray buildings
    SPEED_RATIO: 0.2,       // Moves slower than foreground
    BUILDING_MIN_WIDTH: 40,
    BUILDING_MAX_WIDTH: 80,
    BUILDING_MIN_HEIGHT: 100,
    BUILDING_MAX_HEIGHT: 250,
  },
  
  RUINS: {
    COLOR: 0x4a4a4a,        // Medium gray
    SPEED_RATIO: 0.5,
  },
  
  GROUND: {
    COLOR: 0x3d2817,        // Dark brown wasteland
    COLOR_DETAIL: 0x5a3d2b,
  },
};

// UI
export const UI = {
  PADDING: 16,
  HEART_SIZE: 28,
  HEART_SPACING: 8,
  HEART_COLOR_FULL: 0xff0000,
  HEART_COLOR_HALF: 0xff6666,
  HEART_COLOR_EMPTY: 0x444444,
  
  SCORE_FONT_SIZE: '24px',
  SCORE_COLOR: '#ffffff',
  SCORE_SHADOW: '#000000',
  
  TITLE_FONT_SIZE: '42px',
  TITLE_COLOR: '#ff4444',
  TITLE_STROKE: '#000000',
  TITLE_STROKE_WIDTH: 6,
  
  PROMPT_FONT_SIZE: '20px',
  PROMPT_COLOR: '#ffffff',
};

// Colors for various effects
export const COLORS = {
  MENU_BG: 0x1a0a00,
  GAMEOVER_BG: 0x1a0a00,
  DAMAGE_FLASH: 0xff0000,
  SCREEN_SHAKE: 8,
  
  // Button colors
  BUTTON: 0x8b0000,
  BUTTON_HOVER: 0xaa2222,
  BUTTON_TEXT: '#ffffff',
};

// Timing and transitions
export const TIMING = {
  SPAWN_INTERVAL_MIN: 800,   // ms between enemy spawns
  SPAWN_INTERVAL_MAX: 2000,
  OBSTACLE_INTERVAL_MIN: 1500,
  OBSTACLE_INTERVAL_MAX: 3000,
  PLATFORM_INTERVAL_MIN: 2000,
  PLATFORM_INTERVAL_MAX: 4000,
  POWERUP_INTERVAL_MIN: 8000,
  POWERUP_INTERVAL_MAX: 15000,
  
  DIFFICULTY_SCALE_INTERVAL: 30000, // Every 30s, increase difficulty
  
  SCREEN_SHAKE_DURATION: 100,
  NUKE_FLASH_DURATION: 200,
  DEATH_DELAY: 1000,
  
  // Scene transitions
  SCENE_FADE_IN: 400,
  SCENE_FADE_OUT: 300,
};

// =============================================================================
// JUICE / VISUAL EFFECTS
// =============================================================================

// Particle effects configuration
export const PARTICLES = {
  // Muzzle flash
  MUZZLE: {
    COUNT: 5,
    SIZE_MIN: 2,
    SIZE_MAX: 5,
    SPEED_MIN: 80,
    SPEED_MAX: 150,
    DURATION: 150,
    COLORS: [0xffff00, 0xffaa00, 0xff6600],
    SPREAD: 40, // Degrees
  },
  
  // Enemy death explosion
  DEATH: {
    COUNT: 12,
    SIZE_MIN: 3,
    SIZE_MAX: 8,
    SPEED_MIN: 60,
    SPEED_MAX: 120,
    DURATION_MIN: 300,
    DURATION_MAX: 500,
    GRAVITY: 200,
  },
  
  // Landing dust
  DUST: {
    COUNT: 6,
    SIZE_MIN: 2,
    SIZE_MAX: 4,
    SPEED_X_MIN: 20,
    SPEED_X_MAX: 60,
    SPEED_Y_MIN: -30,
    SPEED_Y_MAX: -60,
    DURATION: 400,
    COLOR: 0x8b7355,
  },
  
  // Jump puff
  JUMP: {
    COUNT: 4,
    SIZE_MIN: 3,
    SIZE_MAX: 5,
    SPEED: 40,
    DURATION: 300,
    COLOR: 0xaaaaaa,
  },
  
  // Toxic barrel drip
  TOXIC_DRIP: {
    INTERVAL: 800,
    SIZE: 3,
    COLOR: 0x00ff00,
    FALL_SPEED: 80,
    SPLASH_COUNT: 3,
  },
  
  // Bullet impact sparks
  IMPACT: {
    COUNT: 4,
    SIZE: 2,
    SPEED: 80,
    DURATION: 200,
    COLOR: 0xffff88,
  },
};

// Screen effects
export const SCREEN_EFFECTS = {
  // Screen shake
  SHAKE: {
    LIGHT: { intensity: 4, duration: 80 },
    MEDIUM: { intensity: 8, duration: 120 },
    HEAVY: { intensity: 15, duration: 200 },
    DEATH: { intensity: 20, duration: 400 },
  },
  
  // Screen flash
  FLASH: {
    DAMAGE: { color: 0xff0000, duration: 100, alpha: 0.3 },
    NUKE: { color: 0xffffff, duration: 300, alpha: 0.8 },
    HEAL: { color: 0x00ff00, duration: 150, alpha: 0.2 },
    POWERUP: { color: 0xffaa00, duration: 100, alpha: 0.2 },
  },
  
  // Hit freeze (brief pause for impact)
  HIT_FREEZE_MS: 30,
  DEATH_SLOW_MO: 0.3,
  DEATH_SLOW_MO_DURATION: 300,
};

// Hit feedback effects
export const HIT_FEEDBACK = {
  // Enemy white flash on hit
  ENEMY_FLASH: {
    TINT: 0xffffff,
    DURATION: 60,
  },
  
  // Player red tint on damage
  PLAYER_DAMAGE: {
    TINT: 0xff4444,
    DURATION: 100,
    FLASH_COUNT: 3,
  },
};

// Score popup effects
export const SCORE_POPUP = {
  FONT_SIZE: '18px',
  FONT_FAMILY: 'Impact, monospace',
  COLOR: '#ffff00',
  STROKE: '#000000',
  STROKE_WIDTH: 3,
  RISE_DISTANCE: 50,
  DURATION: 700,
  SCALE_START: 0.5,
  SCALE_PEAK: 1.3,
};

// UI juice effects
export const UI_JUICE = {
  // Heart pulse on damage
  HEART_PULSE: {
    SCALE: 1.4,
    DURATION: 100,
    EASING: 'Bounce.easeOut',
  },
  
  // Score counter
  SCORE_POP: {
    SCALE: 1.2,
    DURATION: 80,
  },
  
  // Ammo counter flash
  AMMO_FLASH: {
    COLOR_LOW: '#ff4444',
    THRESHOLD: 10,
  },
};

// Death animation config
export const DEATH_ANIM = {
  // Enemy death
  ENEMY: {
    SCALE_POP: 1.5,
    POP_DURATION: 100,
    FADE_DURATION: 200,
  },
  
  // Player death
  PLAYER: {
    RISE_HEIGHT: 80,
    SPIN_ANGLE: 360,
    DURATION: 800,
    BOUNCE_COUNT: 2,
  },
};
