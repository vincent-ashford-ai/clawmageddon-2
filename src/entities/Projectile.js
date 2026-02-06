// =============================================================================
// CLAWMAGEDDON 2 - PROJECTILE
// Bullets fired by the Lobster. Supports single and triple shot.
// Also includes EnemyProjectile for Raider attacks.
// =============================================================================

import Phaser from 'phaser';
import { PROJECTILE, ENEMY_PROJECTILE, GAME, POWERUPS } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { PROJECTILE_SPRITES, PROJECTILE_PALETTE, ENEMY_BULLET } from '../sprites/projectiles.js';

export class Projectile {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    
    this.createSprite();
  }

  createSprite() {
    const { scene } = this;
    const texKey = 'projectile-bullet';
    
    // Render pixel art (8x4 at scale 2 = 16x8)
    renderPixelArt(scene, PROJECTILE_SPRITES.BULLET.sprite, PROJECTILE_PALETTE, texKey, 2);
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(PROJECTILE.WIDTH, PROJECTILE.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - PROJECTILE.WIDTH) / 2,
      (this.sprite.height - PROJECTILE.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    // Render bullets above platforms, obstacles, and enemies
    this.sprite.setDepth(1000);
    
    this.deactivate();
  }

  fire(x, y, angleOffset = 0) {
    this.sprite.setPosition(x, y);
    this.sprite.setActive(true);
    this.sprite.setVisible(true);
    this.sprite.body.enable = true;
    this.active = true;
    
    // Calculate velocity based on angle
    const radians = Phaser.Math.DegToRad(angleOffset);
    const velocityX = PROJECTILE.SPEED * Math.cos(radians);
    const velocityY = PROJECTILE.SPEED * Math.sin(radians);
    
    this.sprite.body.setVelocity(velocityX, velocityY);
    
    // Rotate sprite to match trajectory
    this.sprite.setRotation(radians);
  }

  update() {
    if (!this.active) return;
    
    // Despawn when off screen right
    if (this.sprite.x > GAME.WIDTH + 50) {
      this.deactivate();
    }
  }

  deactivate() {
    this.active = false;
    this.sprite.setActive(false);
    this.sprite.setVisible(false);
    this.sprite.body.enable = false;
    this.sprite.body.setVelocity(0, 0);
  }

  destroy() {
    this.sprite.destroy();
  }
}

// =============================================================================
// PROJECTILE POOL - Manages bullet pooling for performance
// =============================================================================
export class ProjectilePool {
  constructor(scene, size = 30) {
    this.scene = scene;
    this.pool = [];
    
    // Pre-create projectiles
    for (let i = 0; i < size; i++) {
      this.pool.push(new Projectile(scene));
    }
    
    // Listen for fire events
    this.onFire = this.onFire.bind(this);
    eventBus.on(Events.PROJECTILE_FIRED, this.onFire);
  }

  onFire({ x, y, triple, heavyMetal }) {
    if (heavyMetal) {
      // Heavy Metal quintuple shot: 5 bullets in a spread pattern
      const hm = POWERUPS.HEAVY_METAL;
      this.fireOne(x, y, 0);                    // Forward (horizontal)
      this.fireOne(x, y, hm.ANGLE_SLIGHT_UP);   // Slight up
      this.fireOne(x, y, hm.ANGLE_SLIGHT_DOWN); // Slight down
      this.fireOne(x, y, hm.ANGLE_STEEP_UP);    // Almost vertical up
      this.fireOne(x, y, hm.ANGLE_STEEP_DOWN);  // Almost vertical down
    } else if (triple) {
      // Triple shot: up, straight, down
      this.fireOne(x, y, PROJECTILE.TRIPLE_ANGLE_UP);
      this.fireOne(x, y, 0);
      this.fireOne(x, y, PROJECTILE.TRIPLE_ANGLE_DOWN);
    } else {
      // Single shot
      this.fireOne(x, y, 0);
    }
  }

  fireOne(x, y, angle) {
    // Find inactive projectile
    const projectile = this.pool.find(p => !p.active);
    if (projectile) {
      projectile.fire(x, y, angle);
    }
  }

  update() {
    for (const projectile of this.pool) {
      projectile.update();
    }
  }

  getActiveProjectiles() {
    return this.pool.filter(p => p.active);
  }

  getSprites() {
    return this.pool.map(p => p.sprite);
  }

  destroy() {
    eventBus.off(Events.PROJECTILE_FIRED, this.onFire);
    for (const projectile of this.pool) {
      projectile.destroy();
    }
    this.pool = [];
  }
}

// =============================================================================
// ENEMY PROJECTILE - Bullets fired by Raiders (travel LEFT toward player)
// =============================================================================
export class EnemyProjectile {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    
    this.createSprite();
  }

  createSprite() {
    const { scene } = this;
    const texKey = 'projectile-enemy';
    
    // Render pixel art for enemy bullet (orange-red color)
    if (!scene.textures.exists(texKey)) {
      renderPixelArt(scene, ENEMY_BULLET, PROJECTILE_PALETTE, texKey, 2);
    }
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(ENEMY_PROJECTILE.WIDTH, ENEMY_PROJECTILE.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - ENEMY_PROJECTILE.WIDTH) / 2,
      (this.sprite.height - ENEMY_PROJECTILE.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    // Mark as enemy projectile for collision detection
    this.sprite.isEnemyProjectile = true;
    
    // Render bullets above platforms, obstacles, and enemies
    this.sprite.setDepth(1000);
    
    this.deactivate();
  }

  fire(x, y) {
    this.sprite.setPosition(x, y);
    this.sprite.setActive(true);
    this.sprite.setVisible(true);
    this.sprite.body.enable = true;
    this.active = true;
    
    // Travel left toward player
    this.sprite.body.setVelocity(-ENEMY_PROJECTILE.SPEED, 0);
    
    // Face left (rotate 180 degrees)
    this.sprite.setRotation(Math.PI);
  }

  update() {
    if (!this.active) return;
    
    // Despawn when off screen left
    if (this.sprite.x < -50) {
      this.deactivate();
    }
  }

  deactivate() {
    this.active = false;
    this.sprite.setActive(false);
    this.sprite.setVisible(false);
    this.sprite.body.enable = false;
    this.sprite.body.setVelocity(0, 0);
  }

  destroy() {
    this.sprite.destroy();
  }
}

// =============================================================================
// ENEMY PROJECTILE POOL - Manages enemy bullet pooling
// =============================================================================
export class EnemyProjectilePool {
  constructor(scene, size = 15) {
    this.scene = scene;
    this.pool = [];
    
    // Pre-create enemy projectiles
    for (let i = 0; i < size; i++) {
      this.pool.push(new EnemyProjectile(scene));
    }
    
    // Listen for enemy fire events
    this.onEnemyFire = this.onEnemyFire.bind(this);
    eventBus.on(Events.ENEMY_PROJECTILE_FIRED, this.onEnemyFire);
  }

  onEnemyFire({ x, y }) {
    // Find inactive projectile
    const projectile = this.pool.find(p => !p.active);
    if (projectile) {
      projectile.fire(x, y);
    }
  }

  update() {
    for (const projectile of this.pool) {
      projectile.update();
    }
  }

  getActiveProjectiles() {
    return this.pool.filter(p => p.active);
  }

  getSprites() {
    return this.pool.map(p => p.sprite);
  }

  destroy() {
    eventBus.off(Events.ENEMY_PROJECTILE_FIRED, this.onEnemyFire);
    for (const projectile of this.pool) {
      projectile.destroy();
    }
    this.pool = [];
  }
}
