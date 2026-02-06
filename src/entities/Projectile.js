// =============================================================================
// CLAWMAGEDDON 2 - PROJECTILE
// Bullets fired by the Lobster. Supports single and triple shot.
// Also includes EnemyProjectile for Raider attacks.
// =============================================================================

import Phaser from 'phaser';
import { PROJECTILE, ENEMY_PROJECTILE, GAME, POWERUPS } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { PROJECTILE_SPRITES, PROJECTILE_PALETTE, ENEMY_BULLET, MISSILE, GRENADE } from '../sprites/projectiles.js';

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

// =============================================================================
// HEAT-SEEKING MISSILE - Homes in on nearest enemy
// =============================================================================
export class Missile {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.speed = POWERUPS.MISSILE_LAUNCHER.MISSILE_SPEED;
    this.turnRate = POWERUPS.MISSILE_LAUNCHER.TURN_RATE;
    this.lastTrailTime = 0;
    
    this.createSprite();
  }

  createSprite() {
    const { scene } = this;
    const texKey = 'projectile-missile';
    
    // Render pixel art (12x5 at scale 2 = 24x10)
    if (!scene.textures.exists(texKey)) {
      renderPixelArt(scene, MISSILE, PROJECTILE_PALETTE, texKey, 2);
    }
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(20, 8);
    this.sprite.body.setOffset(
      (this.sprite.width - 20) / 2,
      (this.sprite.height - 8) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    // Mark as missile for collision detection
    this.sprite.isMissile = true;
    
    // Render above most things
    this.sprite.setDepth(1000);
    
    this.deactivate();
  }

  fire(x, y) {
    this.sprite.setPosition(x, y);
    this.sprite.setActive(true);
    this.sprite.setVisible(true);
    this.sprite.body.enable = true;
    this.active = true;
    
    // Start moving right
    this.sprite.setRotation(0);
    this.sprite.body.setVelocity(this.speed, 0);
    this.lastTrailTime = this.scene.time.now;
  }

  update() {
    if (!this.active) return;
    
    const now = this.scene.time.now;
    
    // Find nearest enemy and home in on it
    this.homeTowardNearestEnemy();
    
    // Emit trail particles
    if (now - this.lastTrailTime >= POWERUPS.MISSILE_LAUNCHER.TRAIL_INTERVAL) {
      this.emitTrail();
      this.lastTrailTime = now;
    }
    
    // Despawn when off screen (any edge)
    if (this.sprite.x > GAME.WIDTH + 50 || 
        this.sprite.x < -50 ||
        this.sprite.y < -50 ||
        this.sprite.y > GAME.HEIGHT + 50) {
      this.deactivate();
    }
  }

  homeTowardNearestEnemy() {
    // Get enemies from the scene's spawn system
    const spawnSystem = this.scene.spawnSystem;
    if (!spawnSystem) return;
    
    const activeEnemies = spawnSystem.getActiveEnemies();
    if (activeEnemies.length === 0) {
      // No enemies - just keep going forward
      return;
    }
    
    // Find nearest enemy
    let nearestEnemy = null;
    let nearestDist = Infinity;
    
    for (const enemy of activeEnemies) {
      const dx = enemy.sprite.x - this.sprite.x;
      const dy = enemy.sprite.y - this.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestEnemy = enemy;
      }
    }
    
    if (!nearestEnemy) return;
    
    // Calculate angle to target
    const targetAngle = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y,
      nearestEnemy.sprite.x, nearestEnemy.sprite.y
    );
    
    // Gradually rotate toward target (smooth homing)
    const currentRotation = this.sprite.rotation;
    const newRotation = Phaser.Math.Angle.RotateTo(
      currentRotation,
      targetAngle,
      this.turnRate
    );
    
    this.sprite.setRotation(newRotation);
    
    // Update velocity based on new rotation
    this.sprite.body.setVelocity(
      Math.cos(newRotation) * this.speed,
      Math.sin(newRotation) * this.speed
    );
  }

  emitTrail() {
    // Smoke/exhaust trail behind the missile
    const trailX = this.sprite.x - Math.cos(this.sprite.rotation) * 12;
    const trailY = this.sprite.y - Math.sin(this.sprite.rotation) * 12;
    
    // Create a small smoke particle
    const particle = this.scene.add.circle(trailX, trailY, 3, 0x888888, 0.8);
    particle.setDepth(999);
    
    // Fade and shrink
    this.scene.tweens.add({
      targets: particle,
      alpha: 0,
      scale: 0.3,
      duration: 300,
      ease: 'Quad.easeOut',
      onComplete: () => particle.destroy(),
    });
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
// MISSILE POOL - Manages heat-seeking missile pooling
// =============================================================================
export class MissilePool {
  constructor(scene, size = 30) {
    this.scene = scene;
    this.pool = [];
    
    // Pre-create missiles
    for (let i = 0; i < size; i++) {
      this.pool.push(new Missile(scene));
    }
    
    // Listen for missile fire events
    this.onMissileFire = this.onMissileFire.bind(this);
    eventBus.on(Events.PROJECTILE_FIRED, this.onMissileFire);
  }

  onMissileFire({ x, y, missile }) {
    if (!missile) return; // Only handle missile shots
    
    const proj = this.pool.find(p => !p.active);
    if (proj) {
      proj.fire(x, y);
    }
  }

  update() {
    for (const missile of this.pool) {
      missile.update();
    }
  }

  getActiveProjectiles() {
    return this.pool.filter(p => p.active);
  }

  getSprites() {
    return this.pool.map(p => p.sprite);
  }

  destroy() {
    eventBus.off(Events.PROJECTILE_FIRED, this.onMissileFire);
    for (const missile of this.pool) {
      missile.destroy();
    }
    this.pool = [];
  }
}

// =============================================================================
// GRENADE - Lobbed explosive that arcs through the air and explodes on impact
// =============================================================================
export class Grenade {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.hasExploded = false;
    
    this.createSprite();
  }

  createSprite() {
    const { scene } = this;
    const texKey = 'projectile-grenade';
    
    // Render pixel art (8x8 at scale 2 = 16x16)
    if (!scene.textures.exists(texKey)) {
      renderPixelArt(scene, GRENADE, PROJECTILE_PALETTE, texKey, 2);
    }
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(14, 14);
    this.sprite.body.setOffset(
      (this.sprite.width - 14) / 2,
      (this.sprite.height - 14) / 2
    );
    
    // Grenades ARE affected by gravity (lobbed arc)
    this.sprite.body.setAllowGravity(true);
    
    // Mark as grenade for collision detection
    this.sprite.isGrenade = true;
    this.sprite.grenadeRef = this; // Reference back to this object
    
    // Render above most things
    this.sprite.setDepth(1000);
    
    this.deactivate();
  }

  fire(x, y, direction = 1) {
    this.sprite.setPosition(x, y);
    this.sprite.setActive(true);
    this.sprite.setVisible(true);
    this.sprite.body.enable = true;
    this.active = true;
    this.hasExploded = false;
    
    const config = POWERUPS.GRENADE_LAUNCHER;
    
    // Set gravity for the grenade
    this.sprite.body.setGravityY(config.GRENADE_GRAVITY);
    
    // Launch with arc trajectory (upward + forward)
    this.sprite.body.setVelocity(
      direction * config.GRENADE_SPEED_X,
      config.GRENADE_SPEED_Y
    );
    
    // Add spin for visual effect
    this.sprite.body.setAngularVelocity(config.SPIN_VELOCITY * direction);
    
    // Reset rotation
    this.sprite.setRotation(0);
  }

  update() {
    if (!this.active || this.hasExploded) return;
    
    const groundY = GAME.HEIGHT - GAME.GROUND_HEIGHT;
    
    // Check if grenade hit the ground
    if (this.sprite.y + this.sprite.height / 2 >= groundY) {
      this.explode();
      return;
    }
    
    // Despawn if off screen left or below ground
    if (this.sprite.x < -50 || this.sprite.y > GAME.HEIGHT + 50) {
      this.deactivate();
    }
  }

  explode() {
    if (this.hasExploded) return;
    this.hasExploded = true;
    
    const x = this.sprite.x;
    const y = this.sprite.y;
    const config = POWERUPS.GRENADE_LAUNCHER;
    
    // Emit explosion event for particles and effects
    eventBus.emit(Events.GRENADE_EXPLODED, {
      x,
      y,
      radius: config.EXPLOSION_RADIUS,
      damage: config.EXPLOSION_DAMAGE,
    });
    
    // Visual explosion effect
    this.createExplosionEffect(x, y, config.EXPLOSION_RADIUS);
    
    // Screen shake for impact
    eventBus.emit(Events.SCREEN_SHAKE, { intensity: 10 });
    
    // Play explosion sound
    eventBus.emit(Events.SFX_PLAY, { sound: 'explosion' });
    
    this.deactivate();
  }

  createExplosionEffect(x, y, radius) {
    // Flash circle
    const flash = this.scene.add.circle(x, y, radius * 0.3, 0xffff00, 1);
    flash.setDepth(1001);
    
    this.scene.tweens.add({
      targets: flash,
      scale: 2.5,
      alpha: 0,
      duration: 200,
      ease: 'Quad.easeOut',
      onComplete: () => flash.destroy(),
    });
    
    // Explosion ring
    const ring = this.scene.add.circle(x, y, radius * 0.2, 0xff6600, 0.8);
    ring.setDepth(1001);
    
    this.scene.tweens.add({
      targets: ring,
      scale: 3,
      alpha: 0,
      duration: 300,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy(),
    });
    
    // Particle burst
    const colors = [0xff6600, 0xff4400, 0xffaa00, 0xff0000];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = 80 + Math.random() * 60;
      const color = Phaser.Utils.Array.GetRandom(colors);
      
      const particle = this.scene.add.circle(x, y, 4 + Math.random() * 3, color, 1);
      particle.setDepth(1002);
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed - 20, // Slight upward bias
        alpha: 0,
        scale: 0.2,
        duration: 350,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
    
    // Smoke puffs
    for (let i = 0; i < 6; i++) {
      const offsetX = (Math.random() - 0.5) * radius;
      const offsetY = (Math.random() - 0.5) * radius * 0.5;
      
      const smoke = this.scene.add.circle(x + offsetX, y + offsetY, 8, 0x444444, 0.6);
      smoke.setDepth(1000);
      
      this.scene.tweens.add({
        targets: smoke,
        y: smoke.y - 30,
        scale: 2,
        alpha: 0,
        duration: 500,
        ease: 'Quad.easeOut',
        onComplete: () => smoke.destroy(),
      });
    }
  }

  deactivate() {
    this.active = false;
    this.hasExploded = false;
    this.sprite.setActive(false);
    this.sprite.setVisible(false);
    this.sprite.body.enable = false;
    this.sprite.body.setVelocity(0, 0);
    this.sprite.body.setAngularVelocity(0);
    this.sprite.setRotation(0);
  }

  destroy() {
    this.sprite.destroy();
  }
}

// =============================================================================
// GRENADE POOL - Manages grenade pooling
// =============================================================================
export class GrenadePool {
  constructor(scene, size = 20) {
    this.scene = scene;
    this.pool = [];
    
    // Pre-create grenades
    for (let i = 0; i < size; i++) {
      this.pool.push(new Grenade(scene));
    }
    
    // Listen for grenade fire events
    this.onGrenadeFire = this.onGrenadeFire.bind(this);
    eventBus.on(Events.PROJECTILE_FIRED, this.onGrenadeFire);
  }

  onGrenadeFire({ x, y, grenade, direction }) {
    if (!grenade) return; // Only handle grenade shots
    
    const proj = this.pool.find(p => !p.active);
    if (proj) {
      proj.fire(x, y, direction || 1);
    }
  }

  update() {
    for (const grenade of this.pool) {
      grenade.update();
    }
  }

  getActiveProjectiles() {
    return this.pool.filter(p => p.active);
  }

  getSprites() {
    return this.pool.map(p => p.sprite);
  }

  destroy() {
    eventBus.off(Events.PROJECTILE_FIRED, this.onGrenadeFire);
    for (const grenade of this.pool) {
      grenade.destroy();
    }
    this.pool = [];
  }
}
