// =============================================================================
// CLAWMAGEDDON 2 - SPAWN SYSTEM
// Manages spawning of enemies, obstacles, platforms, and power-ups.
// =============================================================================

import Phaser from 'phaser';
import { GAME, ENEMIES, OBSTACLES, PLATFORMS, POWERUPS, TIMING } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { RadRoach, PlagueBat, SludgeCrawler, Raider, Brute, UFO } from '../entities/Enemy.js';
import { Spikes, ToxicBarrel, SludgePuddle } from '../entities/Obstacle.js';
import { Platform } from '../entities/Platform.js';
import { HealthPack, TripleShot, HeavyMetal, ExtraHeart, Nuke, MissileLauncher, GrenadeLauncher } from '../entities/Powerup.js';

export class SpawnSystem {
  constructor(scene) {
    this.scene = scene;
    
    // Pools
    this.enemies = [];
    this.obstacles = [];
    this.platforms = [];
    this.powerups = [];
    
    // Spawn timers
    this.nextEnemySpawn = 0;
    this.nextObstacleSpawn = 0;
    this.nextPlatformSpawn = 0;
    this.nextPowerupSpawn = 0;
    
    this.createPools();
    this.setupEventListeners();
  }

  createPools() {
    const { scene } = this;
    
    // Enemy pool (mixed types)
    for (let i = 0; i < 5; i++) {
      this.enemies.push(new RadRoach(scene));
    }
    for (let i = 0; i < 5; i++) {
      this.enemies.push(new PlagueBat(scene));
    }
    for (let i = 0; i < 3; i++) {
      this.enemies.push(new SludgeCrawler(scene));
    }
    for (let i = 0; i < 3; i++) {
      this.enemies.push(new Raider(scene));
    }
    for (let i = 0; i < 2; i++) {
      this.enemies.push(new Brute(scene)); // Only 2 (rare, high threat)
    }
    for (let i = 0; i < 2; i++) {
      this.enemies.push(new UFO(scene)); // Only 2 (rare aerial tank)
    }
    
    // Obstacle pool
    for (let i = 0; i < 4; i++) {
      this.obstacles.push(new Spikes(scene));
    }
    for (let i = 0; i < 3; i++) {
      this.obstacles.push(new ToxicBarrel(scene));
    }
    for (let i = 0; i < 3; i++) {
      this.obstacles.push(new SludgePuddle(scene));
    }
    
    // Platform pool
    for (let i = 0; i < PLATFORMS.POOL_SIZE; i++) {
      this.platforms.push(new Platform(scene));
    }
    
    // Power-up pool
    for (let i = 0; i < 2; i++) {
      this.powerups.push(new HealthPack(scene));
    }
    for (let i = 0; i < 2; i++) {
      this.powerups.push(new TripleShot(scene));
    }
    this.powerups.push(new HeavyMetal(scene)); // Rare, powerful
    this.powerups.push(new ExtraHeart(scene)); // Only 1 (very rare)
    this.powerups.push(new Nuke(scene));
    this.powerups.push(new MissileLauncher(scene)); // Rare, heat-seeking missiles
    this.powerups.push(new GrenadeLauncher(scene)); // Lobbed explosive grenades
    
    // Set initial spawn times
    this.resetSpawnTimers();
  }

  setupEventListeners() {
    // Nuke kills all enemies
    this.onNuke = () => {
      for (const enemy of this.enemies) {
        if (enemy.active) {
          enemy.die();
        }
      }
    };
    eventBus.on(Events.NUKE_TRIGGERED, this.onNuke);
  }

  resetSpawnTimers() {
    const now = this.scene.time.now;
    this.nextEnemySpawn = now + 1000; // First enemy after 1s
    this.nextObstacleSpawn = now + 2000;
    this.nextPlatformSpawn = now + 1500;
    this.nextPowerupSpawn = now + TIMING.POWERUP_INTERVAL_MIN;
  }

  update() {
    const now = this.scene.time.now;
    const difficultyMult = gameState.getDifficultyMultiplier();
    
    // Spawn enemies
    if (now >= this.nextEnemySpawn) {
      this.spawnEnemy();
      const interval = Phaser.Math.Between(
        TIMING.SPAWN_INTERVAL_MIN / difficultyMult,
        TIMING.SPAWN_INTERVAL_MAX / difficultyMult
      );
      this.nextEnemySpawn = now + interval;
    }
    
    // Spawn obstacles
    if (now >= this.nextObstacleSpawn) {
      this.spawnObstacle();
      const interval = Phaser.Math.Between(
        TIMING.OBSTACLE_INTERVAL_MIN / difficultyMult,
        TIMING.OBSTACLE_INTERVAL_MAX / difficultyMult
      );
      this.nextObstacleSpawn = now + interval;
    }
    
    // Spawn platforms
    if (now >= this.nextPlatformSpawn) {
      this.spawnPlatform();
      const interval = Phaser.Math.Between(
        TIMING.PLATFORM_INTERVAL_MIN,
        TIMING.PLATFORM_INTERVAL_MAX
      );
      this.nextPlatformSpawn = now + interval;
    }
    
    // Spawn power-ups
    if (now >= this.nextPowerupSpawn) {
      this.spawnPowerup();
      const interval = Phaser.Math.Between(
        TIMING.POWERUP_INTERVAL_MIN,
        TIMING.POWERUP_INTERVAL_MAX
      );
      this.nextPowerupSpawn = now + interval;
    }
    
    // Update all entities
    this.updateEntities(this.enemies);
    this.updateEntities(this.obstacles);
    this.updateEntities(this.platforms);
    this.updateEntities(this.powerups);
  }

  updateEntities(entities) {
    for (const entity of entities) {
      entity.update();
    }
  }

  spawnEnemy() {
    const groundY = GAME.HEIGHT - GAME.GROUND_HEIGHT;
    
    // Weight-based random selection
    // Calculate total weight dynamically so all enemies get proper chance
    const totalWeight = 
      ENEMIES.RAD_ROACH.SPAWN_WEIGHT +
      ENEMIES.PLAGUE_BAT.SPAWN_WEIGHT +
      ENEMIES.SLUDGE_CRAWLER.SPAWN_WEIGHT +
      ENEMIES.RAIDER.SPAWN_WEIGHT +
      ENEMIES.BRUTE.SPAWN_WEIGHT +
      ENEMIES.UFO.SPAWN_WEIGHT;
    
    const roll = Math.random() * totalWeight;
    let enemyType;
    let cumulative = 0;
    
    cumulative += ENEMIES.RAD_ROACH.SPAWN_WEIGHT;
    if (roll < cumulative) {
      enemyType = RadRoach;
    } else {
      cumulative += ENEMIES.PLAGUE_BAT.SPAWN_WEIGHT;
      if (roll < cumulative) {
        enemyType = PlagueBat;
      } else {
        cumulative += ENEMIES.SLUDGE_CRAWLER.SPAWN_WEIGHT;
        if (roll < cumulative) {
          enemyType = SludgeCrawler;
        } else {
          cumulative += ENEMIES.RAIDER.SPAWN_WEIGHT;
          if (roll < cumulative) {
            enemyType = Raider;
          } else {
            cumulative += ENEMIES.BRUTE.SPAWN_WEIGHT;
            if (roll < cumulative) {
              enemyType = Brute; // Rare, high threat tank
            } else {
              enemyType = UFO; // Rare aerial tank
            }
          }
        }
      }
    }
    
    // Find inactive enemy of correct type
    const enemy = this.enemies.find(e => !e.active && e instanceof enemyType);
    if (!enemy) return;
    
    // Spawn with minimum offset to prevent immediate off-screen projectile hits
    const minOffset = ENEMIES.SPAWN_MIN_OFFSET || 100;
    const x = GAME.WIDTH + minOffset + (ENEMIES.SPAWN_DISTANCE - minOffset) * Math.random();
    let y;
    
    if (enemy instanceof PlagueBat) {
      y = Phaser.Math.Between(ENEMIES.PLAGUE_BAT.MIN_Y, ENEMIES.PLAGUE_BAT.MAX_Y);
    } else if (enemy instanceof UFO) {
      y = Phaser.Math.Between(ENEMIES.UFO.MIN_Y, ENEMIES.UFO.MAX_Y);
    } else {
      y = groundY - enemy.config.HEIGHT / 2;
    }
    
    enemy.spawn(x, y);
    eventBus.emit(Events.ENEMY_SPAWNED, { type: enemyType.name });
  }

  spawnObstacle() {
    const groundY = GAME.HEIGHT - GAME.GROUND_HEIGHT;
    
    // Random obstacle type
    const types = [Spikes, ToxicBarrel, SludgePuddle];
    const ObstacleType = types[Math.floor(Math.random() * types.length)];
    
    const obstacle = this.obstacles.find(o => !o.active && o instanceof ObstacleType);
    if (!obstacle) return;
    
    const x = GAME.WIDTH + OBSTACLES.SPAWN_DISTANCE * Math.random() * 0.5;
    let y;
    
    if (obstacle instanceof SludgePuddle) {
      y = groundY - OBSTACLES.SLUDGE_PUDDLE.HEIGHT / 2;
    } else if (obstacle instanceof ToxicBarrel) {
      y = groundY - OBSTACLES.TOXIC_BARREL.HEIGHT / 2;
    } else {
      y = groundY - OBSTACLES.SPIKES.HEIGHT / 2;
    }
    
    obstacle.spawn(x, y);
    eventBus.emit(Events.OBSTACLE_SPAWNED, { type: ObstacleType.name });
  }

  spawnPlatform() {
    // Decide if we spawn a pair (high + stepping stone) or a solo platform
    const spawnPair = Math.random() < PLATFORMS.PAIR_CHANCE;
    
    if (spawnPair) {
      this.spawnPlatformPair();
    } else {
      this.spawnSoloPlatform();
    }
  }

  spawnSoloPlatform() {
    const platform = this.platforms.find(p => !p.active);
    if (!platform) return;
    
    const x = GAME.WIDTH + PLATFORMS.SPAWN_DISTANCE * Math.random() * 0.5;
    const width = Phaser.Math.Between(PLATFORMS.MIN_WIDTH, PLATFORMS.MAX_WIDTH);
    
    // Solo platforms can only be LOW or MEDIUM (never HIGH)
    const tier = this.selectSoloTier();
    const tierConfig = PLATFORMS.TIERS[tier];
    const y = tierConfig.Y;  // Fixed Y per tier
    
    platform.spawn(x, y, width);
    eventBus.emit(Events.PLATFORM_SPAWNED, { tier });
    
    // Maybe spawn a powerup on top of the platform
    this.maybeSpawnPowerupOnPlatform(x, y, width, tier);
  }

  spawnPlatformPair() {
    // Spawn a HIGH platform with a stepping stone below it
    const highPlatform = this.platforms.find(p => !p.active);
    if (!highPlatform) return;
    
    const stepPlatform = this.platforms.find(p => !p.active && p !== highPlatform);
    if (!stepPlatform) {
      // Can't make a pair, fall back to solo spawn
      this.spawnSoloPlatform();
      return;
    }
    
    // Position the stepping stone platform first
    const stepX = GAME.WIDTH + PLATFORMS.SPAWN_DISTANCE * Math.random() * 0.3;
    const stepWidth = Phaser.Math.Between(PLATFORMS.MIN_WIDTH, PLATFORMS.MAX_WIDTH);
    
    // Stepping stone can be LOW or MEDIUM - fixed Y per tier
    const stepTier = Math.random() < 0.5 ? 'LOW' : 'MEDIUM';
    const stepTierConfig = PLATFORMS.TIERS[stepTier];
    const stepY = stepTierConfig.Y;
    
    stepPlatform.spawn(stepX, stepY, stepWidth);
    eventBus.emit(Events.PLATFORM_SPAWNED, { tier: stepTier });
    
    // Maybe spawn a powerup on the stepping stone
    this.maybeSpawnPowerupOnPlatform(stepX, stepY, stepWidth, stepTier);
    
    // Now spawn the HIGH platform, reachable by single jump from stepping stone
    const highTierConfig = PLATFORMS.TIERS.HIGH;
    const highY = highTierConfig.Y;  // Fixed Y for HIGH tier
    
    // Ensure the high platform is within single-jump reach vertically
    // The stepping stone Y minus SINGLE_JUMP_REACH should be >= highY
    const maxReachableY = stepY - PLATFORMS.SINGLE_JUMP_REACH;
    const clampedHighY = Math.max(highY, maxReachableY);
    
    // Position high platform slightly ahead (player will reach stepping stone first)
    const highX = stepX + PLATFORMS.PAIR_X_OFFSET + Math.random() * 60;
    const highWidth = Phaser.Math.Between(PLATFORMS.MIN_WIDTH, PLATFORMS.MAX_WIDTH);
    
    highPlatform.spawn(highX, clampedHighY, highWidth);
    eventBus.emit(Events.PLATFORM_SPAWNED, { tier: 'HIGH' });
    
    // Maybe spawn a powerup on the HIGH platform (best loot here!)
    this.maybeSpawnPowerupOnPlatform(highX, clampedHighY, highWidth, 'HIGH');
  }

  selectSoloTier() {
    // Weight-based selection between LOW and MEDIUM (HIGH is never solo)
    const roll = Math.random() * (PLATFORMS.TIER_WEIGHTS.LOW + PLATFORMS.TIER_WEIGHTS.MEDIUM);
    
    if (roll < PLATFORMS.TIER_WEIGHTS.LOW) {
      return 'LOW';
    }
    return 'MEDIUM';
  }

  /**
   * Maybe spawn a powerup on top of a platform based on tier chances.
   * Higher tier = higher chance. ExtraHeart ONLY spawns on HIGH tier.
   */
  maybeSpawnPowerupOnPlatform(platformX, platformY, platformWidth, tier) {
    const spawnChance = PLATFORMS.POWERUP_SPAWN_CHANCE[tier];
    if (Math.random() > spawnChance) return;
    
    // Get allowed powerup types for this tier
    const allowedTypes = PLATFORMS.POWERUP_TYPES[tier];
    
    // Map type names to classes
    const typeMap = {
      'HealthPack': HealthPack,
      'TripleShot': TripleShot,
      'Nuke': Nuke,
      'ExtraHeart': ExtraHeart,
      'MissileLauncher': MissileLauncher,
      'GrenadeLauncher': GrenadeLauncher,
    };
    
    // For ExtraHeart, check if player already at max hearts
    let availableTypes = allowedTypes.filter(typeName => {
      if (typeName === 'ExtraHeart' && gameState.maxHearts >= 5) {
        return false;
      }
      return true;
    });
    
    if (availableTypes.length === 0) return;
    
    // Random selection from available types
    const selectedTypeName = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const PowerupType = typeMap[selectedTypeName];
    
    // Find an inactive powerup of this type
    const powerup = this.powerups.find(p => !p.active && p instanceof PowerupType);
    if (!powerup) return;
    
    // Position on top of the platform (centered horizontally)
    const x = platformX;
    const y = platformY - PLATFORMS.HEIGHT / 2 - POWERUPS.SIZE / 2;
    
    powerup.spawn(x, y);
    eventBus.emit(Events.POWERUP_SPAWNED, { type: PowerupType.name, onPlatform: true, tier });
  }

  spawnPowerup() {
    // Weight-based selection (ExtraHeart EXCLUDED - only spawns on HIGH tier platforms)
    const totalWeight = 
      POWERUPS.HEALTH_PACK.SPAWN_WEIGHT +
      POWERUPS.TRIPLE_SHOT.SPAWN_WEIGHT +
      POWERUPS.HEAVY_METAL.SPAWN_WEIGHT +
      POWERUPS.NUKE.SPAWN_WEIGHT +
      POWERUPS.MISSILE_LAUNCHER.SPAWN_WEIGHT +
      POWERUPS.GRENADE_LAUNCHER.SPAWN_WEIGHT;
    
    const roll = Math.random() * totalWeight;
    let PowerupType;
    let cumulative = 0;
    
    cumulative += POWERUPS.HEALTH_PACK.SPAWN_WEIGHT;
    if (roll < cumulative) {
      PowerupType = HealthPack;
    } else {
      cumulative += POWERUPS.TRIPLE_SHOT.SPAWN_WEIGHT;
      if (roll < cumulative) {
        PowerupType = TripleShot;
      } else {
        cumulative += POWERUPS.HEAVY_METAL.SPAWN_WEIGHT;
        if (roll < cumulative) {
          PowerupType = HeavyMetal;
        } else {
          cumulative += POWERUPS.NUKE.SPAWN_WEIGHT;
          if (roll < cumulative) {
            PowerupType = Nuke;
          } else {
            cumulative += POWERUPS.MISSILE_LAUNCHER.SPAWN_WEIGHT;
            if (roll < cumulative) {
              PowerupType = MissileLauncher;
            } else {
              PowerupType = GrenadeLauncher;
            }
          }
        }
      }
    }
    
    const powerup = this.powerups.find(p => !p.active && p instanceof PowerupType);
    if (!powerup) return;
    
    const x = GAME.WIDTH + POWERUPS.SPAWN_DISTANCE * Math.random() * 0.5;
    // Spawn in the air only (platform heights) - never at ground level to avoid obstacle overlap
    const y = Phaser.Math.Between(PLATFORMS.TIERS.MEDIUM.Y - 50, PLATFORMS.TIERS.LOW.Y - 50);
    
    powerup.spawn(x, y);
    eventBus.emit(Events.POWERUP_SPAWNED, { type: PowerupType.name });
  }

  // Get all active entities for collision detection
  getActiveEnemies() {
    return this.enemies.filter(e => e.active);
  }

  getActiveObstacles() {
    return this.obstacles.filter(o => o.active);
  }

  getActivePlatforms() {
    return this.platforms.filter(p => p.active);
  }

  getActivePowerups() {
    return this.powerups.filter(p => p.active);
  }

  // Get sprite arrays for physics groups
  getEnemySprites() {
    return this.enemies.map(e => e.sprite);
  }

  getObstacleSprites() {
    return this.obstacles.map(o => o.sprite);
  }

  getPlatformSprites() {
    return this.platforms.map(p => p.sprite);
  }

  getPowerupSprites() {
    return this.powerups.map(p => p.sprite);
  }

  destroy() {
    eventBus.off(Events.NUKE_TRIGGERED, this.onNuke);
    
    this.enemies.forEach(e => e.destroy());
    this.obstacles.forEach(o => o.destroy());
    this.platforms.forEach(p => p.destroy());
    this.powerups.forEach(p => p.destroy());
    
    this.enemies = [];
    this.obstacles = [];
    this.platforms = [];
    this.powerups = [];
  }
}
