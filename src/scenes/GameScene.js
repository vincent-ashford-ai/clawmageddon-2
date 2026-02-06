// =============================================================================
// CLAWMAGEDDON 2 - GAME SCENE
// Main gameplay: auto-run, tap to jump+shoot, enemies, obstacles.
// =============================================================================

import Phaser from 'phaser';
import { GAME, PLAYER, PARALLAX, OBSTACLES, TIMING, COLORS } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { Lobster } from '../entities/Lobster.js';
import { ProjectilePool, EnemyProjectilePool, MissilePool, GrenadePool } from '../entities/Projectile.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { EffectsSystem } from '../systems/EffectsSystem.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { TILE_SPRITES, TILE_PALETTE, GROUND_BASE, GROUND_VAR1, GROUND_VAR2 } from '../sprites/tiles.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    gameState.reset();
    
    // Create parallax background with pixel art
    this.createBackground();
    
    // Create ground
    this.createGround();
    
    // Create player (The Lobster)
    this.lobster = new Lobster(this);
    
    // Create projectile pool (player bullets)
    this.projectilePool = new ProjectilePool(this);
    
    // Create enemy projectile pool (Raider bullets)
    this.enemyProjectilePool = new EnemyProjectilePool(this);
    
    // Create missile pool (heat-seeking missiles)
    this.missilePool = new MissilePool(this);
    
    // Create grenade pool (lobbed explosives)
    this.grenadePool = new GrenadePool(this);
    
    // Create spawn system
    this.spawnSystem = new SpawnSystem(this);
    
    // Create particle system
    this.particleSystem = new ParticleSystem(this);
    
    // Create effects system (screen shake, flash, popups)
    this.effectsSystem = new EffectsSystem(this);
    
    // Setup collisions
    this.setupCollisions();
    
    // Setup input (ONE INPUT: tap/space = jump + shoot)
    this.setupInput();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start UI scene
    this.scene.launch('UIScene');
    
    // Difficulty timer
    this.difficultyTimer = this.time.addEvent({
      delay: TIMING.DIFFICULTY_SCALE_INTERVAL,
      callback: () => gameState.increaseDifficulty(),
      loop: true,
    });
    
    // Distance scoring timer
    this.lastDistanceUpdate = 0;
    
    gameState.started = true;
    eventBus.emit(Events.GAME_START);
    eventBus.emit(Events.MUSIC_GAMEPLAY);
    
    // Fade in from black
    this.cameras.main.fadeIn(TIMING.SCENE_FADE_IN, 0, 0, 0);
  }

  createBackground() {
    // Sky gradient (static) - apocalyptic orange sky
    const skyGraphics = this.add.graphics();
    skyGraphics.fillGradientStyle(
      PARALLAX.SKY.COLOR_TOP, PARALLAX.SKY.COLOR_TOP,
      PARALLAX.SKY.COLOR_BOTTOM, PARALLAX.SKY.COLOR_BOTTOM
    );
    skyGraphics.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);
    skyGraphics.setDepth(-20);
    
    // Render building textures
    renderPixelArt(this, TILE_SPRITES.BUILDING_TALL.sprite, TILE_PALETTE, 'building-tall', 2);
    renderPixelArt(this, TILE_SPRITES.BUILDING_SHORT.sprite, TILE_PALETTE, 'building-short', 2);
    renderPixelArt(this, TILE_SPRITES.RUBBLE_PILE.sprite, TILE_PALETTE, 'rubble-pile', 2);
    
    // Render decoration textures
    renderPixelArt(this, TILE_SPRITES.SKULL_PILE.sprite, TILE_PALETTE, 'deco-skull', 2);
    renderPixelArt(this, TILE_SPRITES.CAR_WRECK.sprite, TILE_PALETTE, 'deco-car', 2);
    renderPixelArt(this, TILE_SPRITES.RAD_SIGN.sprite, TILE_PALETTE, 'deco-radsign', 2);
    renderPixelArt(this, TILE_SPRITES.DEAD_TREE.sprite, TILE_PALETTE, 'deco-tree', 2);
    
    // Far city silhouette (slowest layer) - using pixel art buildings
    this.cityBuildings = this.createCityLayer();
    
    // Near ruins layer (medium speed) - using pixel art rubble
    this.ruinsDecos = this.createRuinsLayer();
  }

  createCityLayer() {
    const buildings = [];
    const groundY = GAME.HEIGHT - GAME.GROUND_HEIGHT;
    
    // Create a row of buildings
    const buildingCount = 15;
    let x = 0;
    
    for (let i = 0; i < buildingCount; i++) {
      const isTall = Math.random() > 0.5;
      const texKey = isTall ? 'building-tall' : 'building-short';
      const building = this.add.image(x, groundY, texKey);
      building.setOrigin(0, 1); // Bottom-left origin
      building.setDepth(-15);
      building.setAlpha(0.6); // Distant silhouette
      buildings.push(building);
      
      x += building.width + Phaser.Math.Between(-5, 10);
    }
    
    return buildings;
  }

  createRuinsLayer() {
    const decos = [];
    const groundY = GAME.HEIGHT - GAME.GROUND_HEIGHT;
    
    // Scatter rubble and decorations
    for (let i = 0; i < 12; i++) {
      const x = (i / 12) * (GAME.WIDTH + 200) - 50;
      
      // Alternate between rubble and other decorations
      const types = ['rubble-pile', 'deco-skull', 'deco-car', 'deco-tree', 'deco-radsign'];
      const texKey = Phaser.Utils.Array.GetRandom(types);
      
      const deco = this.add.image(x, groundY, texKey);
      deco.setOrigin(0.5, 1); // Bottom-center origin
      deco.setDepth(-10);
      deco.setAlpha(0.4 + Math.random() * 0.3);
      decos.push(deco);
    }
    
    return decos;
  }

  createGround() {
    // Render ground tiles
    renderPixelArt(this, GROUND_BASE, TILE_PALETTE, 'ground-base', 2);
    renderPixelArt(this, GROUND_VAR1, TILE_PALETTE, 'ground-var1', 2);
    renderPixelArt(this, GROUND_VAR2, TILE_PALETTE, 'ground-var2', 2);
    
    // Create a tiled ground using pixel art
    const tileSize = 32; // 16px * scale 2
    const groundY = GAME.HEIGHT - GAME.GROUND_HEIGHT;
    
    this.groundTiles = [];
    
    // Create two rows of ground tiles for proper depth
    for (let y = groundY; y < GAME.HEIGHT; y += tileSize) {
      for (let x = 0; x < GAME.WIDTH + tileSize * 2; x += tileSize) {
        // Random tile variant
        const variant = Math.random() < 0.7 ? 'ground-base'
          : Math.random() < 0.5 ? 'ground-var1'
          : 'ground-var2';
        
        const tile = this.add.image(x, y, variant);
        tile.setOrigin(0, 0);
        tile.setDepth(-5);
        this.groundTiles.push(tile);
      }
    }
    
    // Ground physics body (invisible)
    this.ground = this.add.rectangle(
      GAME.WIDTH / 2,
      GAME.HEIGHT - GAME.GROUND_HEIGHT / 2,
      GAME.WIDTH,
      GAME.GROUND_HEIGHT,
      0x000000, 0 // Invisible
    );
    this.physics.add.existing(this.ground, true);
  }

  setupCollisions() {
    // Player vs Ground
    this.physics.add.collider(this.lobster.sprite, this.ground);
    
    // Enemies with gravity vs Ground
    // Add colliders for all enemy sprites that use gravity
    for (const sprite of this.spawnSystem.getEnemySprites()) {
      if (sprite.body && sprite.body.allowGravity) {
        this.physics.add.collider(sprite, this.ground);
      }
    }
    
    // We'll check collisions manually in update for pooled objects
    // Platform collisions for enemies are handled in checkCollisions()
  }

  setupInput() {
    // Track action pressed this frame
    this.actionPressed = false;
    
    // Keyboard: Space
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Touch/Click: anywhere on screen
    this.input.on('pointerdown', () => {
      this.actionPressed = true;
    });
  }

  setupEventListeners() {
    // Screen shake
    this.onScreenShake = ({ intensity }) => {
      this.cameras.main.shake(TIMING.SCREEN_SHAKE_DURATION, intensity / 1000);
    };
    eventBus.on(Events.SCREEN_SHAKE, this.onScreenShake, this);
    
    // Screen flash
    this.onScreenFlash = ({ color, duration }) => {
      this.cameras.main.flash(duration || 200, 
        (color >> 16) & 0xff,
        (color >> 8) & 0xff,
        color & 0xff
      );
    };
    eventBus.on(Events.SCREEN_FLASH, this.onScreenFlash, this);
    
    // Player died
    this.onPlayerDied = () => {
      this.time.delayedCall(TIMING.DEATH_DELAY, () => {
        this.triggerGameOver();
      });
    };
    eventBus.on(Events.PLAYER_DIED, this.onPlayerDied, this);
    
    // Grenade explosion - deal area damage to nearby enemies
    this.onGrenadeExploded = ({ x, y, radius, damage }) => {
      const activeEnemies = this.spawnSystem.getActiveEnemies();
      for (const enemy of activeEnemies) {
        const dx = enemy.sprite.x - x;
        const dy = enemy.sprite.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist <= radius) {
          // Deal damage to enemies in blast radius
          enemy.hit(damage);
        }
      }
    };
    eventBus.on(Events.GRENADE_EXPLODED, this.onGrenadeExploded, this);
    
    // Cleanup on shutdown
    this.events.on('shutdown', this.cleanup, this);
  }

  update(time, delta) {
    if (gameState.gameOver) return;
    
    // Check keyboard input
    const spacePressed = Phaser.Input.Keyboard.JustDown(this.spaceKey);
    const actionPressed = this.actionPressed || spacePressed;
    
    // Update player
    this.lobster.update(actionPressed);
    
    // Update projectiles (player, enemy, missiles, and grenades)
    this.projectilePool.update();
    this.enemyProjectilePool.update();
    this.missilePool.update();
    this.grenadePool.update();
    
    // Update spawn system (enemies, obstacles, platforms, powerups)
    this.spawnSystem.update();
    
    // Check collisions
    this.checkCollisions();
    
    // Update distance score
    this.updateDistanceScore(delta);
    
    // Parallax scrolling
    this.updateParallax(delta);
    
    // Reset action flag
    this.actionPressed = false;
  }

  checkCollisions() {
    const lobsterSprite = this.lobster.sprite;
    const lobsterBounds = lobsterSprite.body;
    
    // Player vs Platforms (collide)
    for (const platform of this.spawnSystem.getActivePlatforms()) {
      this.physics.add.collider(lobsterSprite, platform.sprite);
    }
    
    // Projectiles vs Enemies
    const activeProjectiles = this.projectilePool.getActiveProjectiles();
    const activeEnemies = this.spawnSystem.getActiveEnemies();
    
    // Enemies with gravity vs Platforms (allows them to land on platforms)
    for (const enemy of activeEnemies) {
      // Only for enemies with gravity
      if (enemy.sprite.body && enemy.sprite.body.allowGravity) {
        for (const platform of this.spawnSystem.getActivePlatforms()) {
          this.physics.add.collider(enemy.sprite, platform.sprite);
        }
      }
    }
    
    for (const projectile of activeProjectiles) {
      for (const enemy of activeEnemies) {
        // Only check collision if enemy is on-screen (prevent off-screen kills)
        if (enemy.sprite.x > GAME.WIDTH + 20) continue;
        
        if (this.physics.overlap(projectile.sprite, enemy.sprite)) {
          enemy.hit(1);
          projectile.deactivate();
          break;
        }
      }
    }
    
    // Missiles vs Enemies (heat-seeking missiles)
    const activeMissiles = this.missilePool.getActiveProjectiles();
    for (const missile of activeMissiles) {
      for (const enemy of activeEnemies) {
        // Only check collision if enemy is on-screen
        if (enemy.sprite.x > GAME.WIDTH + 20) continue;
        
        if (this.physics.overlap(missile.sprite, enemy.sprite)) {
          enemy.hit(2); // Missiles deal 2 damage
          missile.deactivate();
          
          // Explosion particles at impact point
          eventBus.emit(Events.PARTICLES_DEATH, {
            x: missile.sprite.x,
            y: missile.sprite.y,
            color: 0xff4400, // Orange explosion
          });
          eventBus.emit(Events.SCREEN_SHAKE, { intensity: 4 });
          break;
        }
      }
    }
    
    // Grenades vs Enemies (lobbed explosives)
    const activeGrenades = this.grenadePool.getActiveProjectiles();
    for (const grenade of activeGrenades) {
      for (const enemy of activeEnemies) {
        // Only check collision if enemy is on-screen
        if (enemy.sprite.x > GAME.WIDTH + 20) continue;
        
        if (this.physics.overlap(grenade.sprite, enemy.sprite)) {
          // Grenade explodes on enemy contact
          grenade.explode();
          break;
        }
      }
    }
    
    // Player vs Enemies (damage)
    for (const enemy of activeEnemies) {
      if (this.physics.overlap(lobsterSprite, enemy.sprite)) {
        this.lobster.takeDamage();
        enemy.hit(enemy.hp); // Kill enemy on contact
      }
    }
    
    // Player vs Obstacles (damage)
    for (const obstacle of this.spawnSystem.getActiveObstacles()) {
      if (this.physics.overlap(lobsterSprite, obstacle.sprite)) {
        this.lobster.takeDamage();
        obstacle.onHit();
      }
    }
    
    // Player vs Power-ups (collect)
    for (const powerup of this.spawnSystem.getActivePowerups()) {
      if (this.physics.overlap(lobsterSprite, powerup.sprite)) {
        powerup.collect();
      }
    }
    
    // Player vs Enemy Projectiles (damage from Raider shots)
    const activeEnemyProjectiles = this.enemyProjectilePool.getActiveProjectiles();
    for (const projectile of activeEnemyProjectiles) {
      if (this.physics.overlap(lobsterSprite, projectile.sprite)) {
        this.lobster.takeDamage();
        projectile.deactivate();
        
        // Impact particles at collision point
        eventBus.emit(Events.PARTICLES_IMPACT, {
          x: projectile.sprite.x,
          y: projectile.sprite.y,
        });
      }
    }
  }

  updateDistanceScore(delta) {
    // Add distance score based on world scroll
    const pixelsTraveled = GAME.WORLD_SPEED * (delta / 1000);
    gameState.addDistanceScore(pixelsTraveled);
  }

  updateParallax(delta) {
    const dt = delta / 1000;
    const scrollSpeed = GAME.WORLD_SPEED * dt;
    
    // Move city buildings slowly (far layer)
    if (this.cityBuildings) {
      for (const building of this.cityBuildings) {
        building.x -= scrollSpeed * PARALLAX.CITY.SPEED_RATIO;
        // Loop when off screen
        if (building.x + building.width < 0) {
          // Find rightmost building
          let maxX = 0;
          for (const b of this.cityBuildings) {
            if (b.x + b.width > maxX) {
              maxX = b.x + b.width;
            }
          }
          building.x = maxX + Phaser.Math.Between(-5, 10);
        }
      }
    }
    
    // Move ruins decorations faster (near layer)
    if (this.ruinsDecos) {
      for (const deco of this.ruinsDecos) {
        deco.x -= scrollSpeed * PARALLAX.RUINS.SPEED_RATIO;
        // Loop when off screen
        if (deco.x + 50 < 0) {
          deco.x = GAME.WIDTH + 50 + Math.random() * 100;
        }
      }
    }
    
    // Ground tiles don't need to scroll - they're static background
    // The world scrolls by moving entities, not the ground
  }

  triggerGameOver() {
    if (gameState.gameOver) return;
    gameState.gameOver = true;
    
    eventBus.emit(Events.GAME_OVER, { score: gameState.score });
    eventBus.emit(Events.MUSIC_STOP);
    
    // Fade out transition
    this.cameras.main.fadeOut(TIMING.SCENE_FADE_OUT, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop('UIScene');
      this.scene.start('GameOverScene');
    });
  }

  cleanup() {
    eventBus.off(Events.SCREEN_SHAKE, this.onScreenShake, this);
    eventBus.off(Events.SCREEN_FLASH, this.onScreenFlash, this);
    eventBus.off(Events.PLAYER_DIED, this.onPlayerDied, this);
    eventBus.off(Events.GRENADE_EXPLODED, this.onGrenadeExploded, this);
    
    if (this.difficultyTimer) {
      this.difficultyTimer.destroy();
    }
    
    if (this.projectilePool) {
      this.projectilePool.destroy();
    }
    
    if (this.enemyProjectilePool) {
      this.enemyProjectilePool.destroy();
    }
    
    if (this.missilePool) {
      this.missilePool.destroy();
    }
    
    if (this.grenadePool) {
      this.grenadePool.destroy();
    }
    
    if (this.spawnSystem) {
      this.spawnSystem.destroy();
    }
    
    if (this.particleSystem) {
      this.particleSystem.destroy();
    }
    
    if (this.effectsSystem) {
      this.effectsSystem.destroy();
    }
    
    if (this.lobster) {
      this.lobster.destroy();
    }
  }
}
