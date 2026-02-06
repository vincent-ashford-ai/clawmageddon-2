// =============================================================================
// CLAWMAGEDDON 2 - ENEMY BASE CLASS
// Base class for all enemy types with pooling support.
// =============================================================================

import Phaser from 'phaser';
import { ENEMIES, GAME, HIT_FEEDBACK, DEATH_ANIM } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { renderSpriteSheet } from '../core/PixelRenderer.js';
import { ENEMY_SPRITES, ENEMY_PALETTE } from '../sprites/enemies.js';

export class Enemy {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.hp = config.HP;
    this.scoreValue = config.SCORE;
    this.active = false;
    
    this.createSprite();
  }

  createSprite() {
    // Override in subclass
  }

  spawn(x, y) {
    this.sprite.setPosition(x, y);
    this.sprite.setActive(true);
    this.sprite.setVisible(true);
    this.sprite.setAlpha(1);  // Reset alpha (death animation sets it to 0)
    this.sprite.body.enable = true;
    this.hp = this.config.HP;
    this.active = true;
  }

  update() {
    if (!this.active) return;

    // Scroll with world (move left as player "advances")
    this.sprite.x -= GAME.WORLD_SPEED * (this.scene.game.loop.delta / 1000);

    // Despawn when off screen left
    if (this.sprite.x < ENEMIES.DESPAWN_DISTANCE) {
      this.deactivate();
    }
  }

  hit(damage = 1) {
    this.hp -= damage;
    
    // White flash effect (proper hit feedback)
    this.sprite.setTint(HIT_FEEDBACK.ENEMY_FLASH.TINT);
    this.scene.time.delayedCall(HIT_FEEDBACK.ENEMY_FLASH.DURATION, () => {
      if (this.sprite && this.active) {
        this.sprite.clearTint();
      }
    });
    
    // Slight knockback shake
    const originalX = this.sprite.x;
    this.scene.tweens.add({
      targets: this.sprite,
      x: originalX + 3,
      duration: 30,
      yoyo: true,
      repeat: 1,
    });
    
    // Impact particles
    eventBus.emit(Events.PARTICLES_IMPACT, {
      x: this.sprite.x,
      y: this.sprite.y,
    });
    
    eventBus.emit(Events.ENEMY_HIT, { enemy: this, hp: this.hp });
    
    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    const deathX = this.sprite.x;
    const deathY = this.sprite.y;
    
    gameState.addKillScore();
    eventBus.emit(Events.ENEMY_KILLED, { 
      x: deathX, 
      y: deathY,
      type: this.constructor.name,
    });
    
    // Death explosion particles
    eventBus.emit(Events.PARTICLES_DEATH, {
      x: deathX,
      y: deathY,
      color: this.config.COLOR,
    });
    
    // Score popup floating up
    eventBus.emit(Events.SCORE_POPUP, {
      x: deathX,
      y: deathY - 20,
      score: this.scoreValue,
    });
    
    // Light screen shake on kill
    eventBus.emit(Events.SCREEN_SHAKE, { intensity: 3, duration: 60 });
    
    // Pop death animation - scale up then vanish
    this.sprite.setTint(0xffffff);
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: DEATH_ANIM.ENEMY.SCALE_POP,
      scaleY: DEATH_ANIM.ENEMY.SCALE_POP,
      alpha: 0,
      duration: DEATH_ANIM.ENEMY.POP_DURATION + DEATH_ANIM.ENEMY.FADE_DURATION,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.sprite.setScale(1);
        this.sprite.clearTint();
        this.deactivate();
      },
    });
    
    // Mark as dying so we don't process collisions
    this.active = false;
  }

  deactivate() {
    this.active = false;
    this.sprite.setActive(false);
    this.sprite.setVisible(false);
    this.sprite.body.enable = false;
    if (this.sprite.anims) {
      this.sprite.stop();
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}

// =============================================================================
// RAD ROACH - Ground enemy, 1 HP
// =============================================================================
export class RadRoach extends Enemy {
  constructor(scene) {
    super(scene, ENEMIES.RAD_ROACH);
  }

  createSprite() {
    const { scene, config } = this;
    const spriteData = ENEMY_SPRITES.RAD_ROACH;
    const texKey = 'enemy-radroach';
    
    // Render the spritesheet (18x12 at scale 2 = 36x24)
    renderSpriteSheet(scene, spriteData.frames, spriteData.palette, texKey, 2);
    
    // Create animation
    if (!scene.anims.exists('radroach-walk')) {
      scene.anims.create({
        key: 'radroach-walk',
        frames: scene.anims.generateFrameNumbers(texKey, { start: 0, end: 1 }),
        frameRate: spriteData.animRate,
        repeat: -1,
      });
    }
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey, 0);
    this.sprite.body.setSize(config.WIDTH, config.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - config.WIDTH) / 2,
      (this.sprite.height - config.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    this.deactivate();
  }

  spawn(x, y) {
    super.spawn(x, y);
    this.sprite.play('radroach-walk');
  }

  update() {
    if (!this.active) return;
    super.update();
  }
}

// =============================================================================
// PLAGUE BAT - Air enemy, sine-wave movement, 1 HP
// =============================================================================
export class PlagueBat extends Enemy {
  constructor(scene) {
    super(scene, ENEMIES.PLAGUE_BAT);
    this.startY = 0;
    this.startTime = 0;
  }

  createSprite() {
    const { scene, config } = this;
    const spriteData = ENEMY_SPRITES.PLAGUE_BAT;
    const texKey = 'enemy-plaguebat';
    
    // Render the spritesheet (16x14 at scale 2 = 32x28)
    renderSpriteSheet(scene, spriteData.frames, spriteData.palette, texKey, 2);
    
    // Create animation
    if (!scene.anims.exists('plaguebat-flap')) {
      scene.anims.create({
        key: 'plaguebat-flap',
        frames: scene.anims.generateFrameNumbers(texKey, { start: 0, end: 1 }),
        frameRate: spriteData.animRate,
        repeat: -1,
      });
    }
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey, 0);
    this.sprite.body.setSize(config.WIDTH, config.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - config.WIDTH) / 2,
      (this.sprite.height - config.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    this.deactivate();
  }

  spawn(x, y) {
    super.spawn(x, y);
    this.startY = y;
    this.startTime = this.scene.time.now;
    this.sprite.play('plaguebat-flap');
  }

  update() {
    if (!this.active) return;
    super.update();
    
    const config = ENEMIES.PLAGUE_BAT;
    
    // Sine wave movement
    const elapsed = (this.scene.time.now - this.startTime) / 1000;
    this.sprite.y = this.startY + Math.sin(elapsed * config.SINE_FREQUENCY) * config.SINE_AMPLITUDE;
  }
}

// =============================================================================
// SLUDGE CRAWLER - Toxic slime blob, 3 HP, leaves toxic trail
// =============================================================================
export class SludgeCrawler extends Enemy {
  constructor(scene) {
    super(scene, ENEMIES.SLUDGE_CRAWLER);
    this.lastTrailTime = 0;
    this.toxicTrails = []; // Track spawned trails for cleanup
  }

  createSprite() {
    const { scene, config } = this;
    const spriteData = ENEMY_SPRITES.SLUDGE_CRAWLER;
    const texKey = 'enemy-sludgecrawler';
    
    // Render the spritesheet (14x10 at scale 2 = 28x20)
    renderSpriteSheet(scene, spriteData.frames, spriteData.palette, texKey, 2);
    
    // Create animation - slow wobble
    if (!scene.anims.exists('sludgecrawler-wobble')) {
      scene.anims.create({
        key: 'sludgecrawler-wobble',
        frames: scene.anims.generateFrameNumbers(texKey, { start: 0, end: 1 }),
        frameRate: spriteData.animRate,
        repeat: -1,
      });
    }
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey, 0);
    this.sprite.body.setSize(config.WIDTH, config.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - config.WIDTH) / 2,
      (this.sprite.height - config.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    this.deactivate();
  }

  spawn(x, y) {
    super.spawn(x, y);
    this.lastTrailTime = this.scene.time.now;
    this.toxicTrails = [];
    this.sprite.play('sludgecrawler-wobble');
  }

  update() {
    if (!this.active) return;
    
    const config = ENEMIES.SLUDGE_CRAWLER;
    const dt = this.scene.game.loop.delta / 1000;
    
    // Resist world scroll - move RIGHT at 70% of world scroll speed
    // This makes the crawler scroll off-screen slower, appearing to advance toward the player
    const resistSpeed = GAME.WORLD_SPEED * config.BACKWARD_SPEED;
    this.sprite.x += resistSpeed * dt;
    
    super.update();
    
    const now = this.scene.time.now;
    
    // Drop toxic trail periodically
    if (now - this.lastTrailTime >= config.TRAIL_INTERVAL) {
      this.dropToxicTrail();
      this.lastTrailTime = now;
    }
    
    // Clean up off-screen trails
    this.cleanupTrails();
  }

  dropToxicTrail() {
    // Create a small toxic puddle behind the crawler
    const puddle = this.scene.add.ellipse(
      this.sprite.x - 10,
      this.sprite.y + this.config.HEIGHT / 2 - 4,
      16, 6,
      0x00ff00, 0.6
    );
    
    // Add physics body for collision
    this.scene.physics.add.existing(puddle, true); // true = static body
    puddle.body.setSize(14, 4);
    
    // Store reference for collision detection
    puddle.isToxicTrail = true;
    puddle.damage = ENEMIES.SLUDGE_CRAWLER.TRAIL_DAMAGE;
    
    // Add to tracking array
    this.toxicTrails.push(puddle);
    
    // Emit event so SpawnSystem can track for player collision
    eventBus.emit(Events.TOXIC_TRAIL_SPAWNED, { puddle });
    
    // Auto-fade and destroy after 3 seconds
    this.scene.tweens.add({
      targets: puddle,
      alpha: 0,
      duration: 3000,
      onComplete: () => {
        const idx = this.toxicTrails.indexOf(puddle);
        if (idx > -1) this.toxicTrails.splice(idx, 1);
        puddle.destroy();
      },
    });
  }

  cleanupTrails() {
    // Remove trails that have scrolled off-screen
    this.toxicTrails = this.toxicTrails.filter(puddle => {
      if (puddle.x < ENEMIES.DESPAWN_DISTANCE) {
        puddle.destroy();
        return false;
      }
      // Scroll trail with world
      puddle.x -= GAME.WORLD_SPEED * (this.scene.game.loop.delta / 1000);
      if (puddle.body) {
        puddle.body.updateFromGameObject();
      }
      return true;
    });
  }

  deactivate() {
    super.deactivate();
    // Clean up any remaining trails
    if (this.toxicTrails) {
      this.toxicTrails.forEach(puddle => puddle.destroy());
      this.toxicTrails = [];
    }
  }

  destroy() {
    if (this.toxicTrails) {
      this.toxicTrails.forEach(puddle => puddle.destroy());
      this.toxicTrails = [];
    }
    super.destroy();
  }
}

// =============================================================================
// RAIDER - Wasteland bandit, 2 HP, shoots back at player in bursts
// =============================================================================
export class Raider extends Enemy {
  constructor(scene) {
    super(scene, ENEMIES.RAIDER);
    this.lastShootTime = 0;
    this.burstCount = 0;
    this.isBursting = false;
    this.burstTimer = null;
  }

  createSprite() {
    const { scene, config } = this;
    const spriteData = ENEMY_SPRITES.RAIDER;
    const texKey = 'enemy-raider';
    
    // Render the spritesheet (16x20 at scale 2 = 32x40)
    renderSpriteSheet(scene, spriteData.frames, spriteData.palette, texKey, 2);
    
    // Create animation - idle/shooting
    if (!scene.anims.exists('raider-idle')) {
      scene.anims.create({
        key: 'raider-idle',
        frames: [{ key: texKey, frame: 0 }],
        frameRate: 1,
        repeat: -1,
      });
    }
    if (!scene.anims.exists('raider-shoot')) {
      scene.anims.create({
        key: 'raider-shoot',
        frames: [{ key: texKey, frame: 1 }],
        frameRate: 1,
        repeat: 0,
      });
    }
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey, 0);
    this.sprite.body.setSize(config.WIDTH, config.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - config.WIDTH) / 2,
      (this.sprite.height - config.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    this.deactivate();
  }

  spawn(x, y) {
    super.spawn(x, y);
    this.lastShootTime = this.scene.time.now;
    this.burstCount = 0;
    this.isBursting = false;
    this.sprite.play('raider-idle');
  }

  update() {
    if (!this.active) return;
    super.update();
    
    const config = ENEMIES.RAIDER;
    const now = this.scene.time.now;
    
    // Check if player is in range (roughly to the left of the raider)
    const player = this.scene.lobster;
    if (!player || !player.sprite) return;
    
    const distX = this.sprite.x - player.sprite.x;
    const playerInRange = distX > 0 && distX < config.SHOOT_RANGE;
    
    // Start burst if cooldown passed and player in range
    if (!this.isBursting && playerInRange && now - this.lastShootTime >= config.SHOOT_COOLDOWN) {
      this.startBurst();
    }
  }

  startBurst() {
    const config = ENEMIES.RAIDER;
    this.isBursting = true;
    this.burstCount = 0;
    
    // Fire first shot immediately
    this.fireShot();
    
    // Schedule remaining shots in burst
    if (config.BURST_COUNT > 1) {
      this.burstTimer = this.scene.time.addEvent({
        delay: config.BURST_DELAY,
        callback: () => {
          if (!this.active) return;
          this.fireShot();
          
          if (this.burstCount >= config.BURST_COUNT) {
            this.endBurst();
          }
        },
        repeat: config.BURST_COUNT - 2, // -1 for first shot, -1 for repeat count
      });
    } else {
      this.endBurst();
    }
  }

  fireShot() {
    if (!this.active) return;
    
    this.burstCount++;
    
    // Play shoot animation briefly
    this.sprite.play('raider-shoot');
    this.scene.time.delayedCall(150, () => {
      if (this.active) {
        this.sprite.play('raider-idle');
      }
    });
    
    // Fire projectile toward player (traveling left)
    eventBus.emit(Events.ENEMY_PROJECTILE_FIRED, {
      x: this.sprite.x - 20, // Spawn at gun position
      y: this.sprite.y - 5,  // Slightly above center
    });
    
    // Muzzle flash particles
    eventBus.emit(Events.PARTICLES_MUZZLE, {
      x: this.sprite.x - 25,
      y: this.sprite.y - 5,
      direction: 'left',
    });
  }

  endBurst() {
    this.isBursting = false;
    this.lastShootTime = this.scene.time.now;
    
    if (this.burstTimer) {
      this.burstTimer.destroy();
      this.burstTimer = null;
    }
  }

  deactivate() {
    super.deactivate();
    this.isBursting = false;
    if (this.burstTimer) {
      this.burstTimer.destroy();
      this.burstTimer = null;
    }
  }

  destroy() {
    if (this.burstTimer) {
      this.burstTimer.destroy();
      this.burstTimer = null;
    }
    super.destroy();
  }
}

// =============================================================================
// BRUTE - Hulking mutant humanoid, 5 HP, slow tank with big hitbox
// Huge and intimidating, takes lots of damage to kill. Screen shake on death.
// =============================================================================
export class Brute extends Enemy {
  constructor(scene) {
    super(scene, ENEMIES.BRUTE);
  }

  createSprite() {
    const { scene, config } = this;
    const spriteData = ENEMY_SPRITES.BRUTE;
    const texKey = 'enemy-brute';
    
    // Render the spritesheet (32x32 at scale 2 = 64x64)
    renderSpriteSheet(scene, spriteData.frames, spriteData.palette, texKey, 2);
    
    // Create animation - slow lumbering walk
    if (!scene.anims.exists('brute-walk')) {
      scene.anims.create({
        key: 'brute-walk',
        frames: scene.anims.generateFrameNumbers(texKey, { start: 0, end: 1 }),
        frameRate: spriteData.animRate,
        repeat: -1,
      });
    }
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey, 0);
    this.sprite.body.setSize(config.WIDTH, config.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - config.WIDTH) / 2,
      (this.sprite.height - config.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    this.deactivate();
  }

  spawn(x, y) {
    super.spawn(x, y);
    this.sprite.play('brute-walk');
    
    // Screen shake on spawn to signal the threat
    eventBus.emit(Events.SCREEN_SHAKE, { intensity: 6, duration: 150 });
  }

  die() {
    // Override to add heavier screen shake for this big enemy
    const deathX = this.sprite.x;
    const deathY = this.sprite.y;
    
    gameState.addKillScore();
    eventBus.emit(Events.ENEMY_KILLED, { 
      x: deathX, 
      y: deathY,
      type: this.constructor.name,
    });
    
    // Death explosion particles (bigger explosion for bigger enemy)
    eventBus.emit(Events.PARTICLES_DEATH, {
      x: deathX,
      y: deathY,
      color: this.config.COLOR,
      count: 20, // More particles than normal
    });
    
    // Score popup floating up
    eventBus.emit(Events.SCORE_POPUP, {
      x: deathX,
      y: deathY - 30,
      score: this.scoreValue,
    });
    
    // HEAVY screen shake on death - this guy is big!
    eventBus.emit(Events.SCREEN_SHAKE, { intensity: 12, duration: 250 });
    
    // Pop death animation - scale up then vanish
    this.sprite.setTint(0xffffff);
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: DEATH_ANIM.ENEMY.SCALE_POP * 1.5, // Bigger pop for bigger enemy
      scaleY: DEATH_ANIM.ENEMY.SCALE_POP * 1.5,
      alpha: 0,
      duration: DEATH_ANIM.ENEMY.POP_DURATION + DEATH_ANIM.ENEMY.FADE_DURATION + 100,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.sprite.setScale(1);
        this.sprite.clearTint();
        this.deactivate();
      },
    });
    
    // Mark as dying so we don't process collisions
    this.active = false;
  }

  update() {
    if (!this.active) return;
    
    // Brute resists world scroll - moves RIGHT to linger on screen longer
    // This makes it a threatening presence that takes time to kill
    const dt = this.scene.game.loop.delta / 1000;
    const resistSpeed = GAME.WORLD_SPEED * ENEMIES.BRUTE.RESIST_SPEED;
    
    // Net movement = world scroll left minus resist speed right
    // World scroll is handled in super.update(), we add rightward push here
    this.sprite.x += resistSpeed * dt;
    
    super.update();
  }
}

// =============================================================================
// UFO - Alien flying saucer, 10 HP, aerial tank that hovers menacingly
// Floats in the air with a bobbing motion. Resists scroll like Brute.
// Forces player to deal with threats from above!
// =============================================================================
export class UFO extends Enemy {
  constructor(scene) {
    super(scene, ENEMIES.UFO);
    this.startY = 0;
    this.startTime = 0;
    // Shooting state (like Raider)
    this.lastShootTime = 0;
    this.burstCount = 0;
    this.isBursting = false;
    this.burstTimer = null;
  }

  createSprite() {
    const { scene, config } = this;
    const spriteData = ENEMY_SPRITES.UFO;
    const texKey = 'enemy-ufo';
    
    // Render the spritesheet (24x14 at scale 2 = 48x28)
    renderSpriteSheet(scene, spriteData.frames, spriteData.palette, texKey, 2);
    
    // Create animation - blinking lights
    if (!scene.anims.exists('ufo-hover')) {
      scene.anims.create({
        key: 'ufo-hover',
        frames: scene.anims.generateFrameNumbers(texKey, { start: 0, end: 1 }),
        frameRate: spriteData.animRate,
        repeat: -1,
      });
    }
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey, 0);
    this.sprite.body.setSize(config.WIDTH, config.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - config.WIDTH) / 2,
      (this.sprite.height - config.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false); // UFO floats!
    
    this.deactivate();
  }

  spawn(x, y) {
    super.spawn(x, y);
    this.startY = y;
    this.startTime = this.scene.time.now;
    // Reset shooting state
    this.lastShootTime = this.scene.time.now;
    this.burstCount = 0;
    this.isBursting = false;
    this.sprite.play('ufo-hover');
  }

  die() {
    // Override to add dramatic death effects for this tanky aerial enemy
    const deathX = this.sprite.x;
    const deathY = this.sprite.y;
    
    gameState.addKillScore();
    eventBus.emit(Events.ENEMY_KILLED, { 
      x: deathX, 
      y: deathY,
      type: this.constructor.name,
    });
    
    // Death explosion particles (big explosion for tanky enemy)
    eventBus.emit(Events.PARTICLES_DEATH, {
      x: deathX,
      y: deathY,
      color: this.config.COLOR,
      count: 18, // Lots of particles
    });
    
    // Score popup floating up
    eventBus.emit(Events.SCORE_POPUP, {
      x: deathX,
      y: deathY - 20,
      score: this.scoreValue,
    });
    
    // Medium-heavy screen shake on death
    eventBus.emit(Events.SCREEN_SHAKE, { intensity: 10, duration: 200 });
    
    // Pop death animation - scale up then vanish
    this.sprite.setTint(0xffffff);
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: DEATH_ANIM.ENEMY.SCALE_POP * 1.3,
      scaleY: DEATH_ANIM.ENEMY.SCALE_POP * 1.3,
      alpha: 0,
      duration: DEATH_ANIM.ENEMY.POP_DURATION + DEATH_ANIM.ENEMY.FADE_DURATION + 50,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.sprite.setScale(1);
        this.sprite.clearTint();
        this.deactivate();
      },
    });
    
    // Mark as dying so we don't process collisions
    this.active = false;
  }

  update() {
    if (!this.active) return;
    
    const config = ENEMIES.UFO;
    const dt = this.scene.game.loop.delta / 1000;
    const now = this.scene.time.now;
    
    // UFO resists world scroll - moves RIGHT to linger on screen longer (like Brute)
    const resistSpeed = GAME.WORLD_SPEED * config.RESIST_SPEED;
    this.sprite.x += resistSpeed * dt;
    
    // Hovering bob motion - smooth sine wave
    const elapsed = (now - this.startTime) / 1000;
    this.sprite.y = this.startY + Math.sin(elapsed * config.BOB_FREQUENCY) * config.BOB_AMPLITUDE;
    
    // === SHOOTING BEHAVIOR (like Raider) ===
    // Check if player is in range (roughly to the left of the UFO)
    const player = this.scene.lobster;
    if (player && player.sprite) {
      const distX = this.sprite.x - player.sprite.x;
      const playerInRange = distX > 0 && distX < config.SHOOT_RANGE;
      
      // Start burst if cooldown passed and player in range
      if (!this.isBursting && playerInRange && now - this.lastShootTime >= config.SHOOT_COOLDOWN) {
        this.startBurst();
      }
    }
    
    // Call parent update (handles world scroll and despawn)
    super.update();
  }

  startBurst() {
    const config = ENEMIES.UFO;
    this.isBursting = true;
    this.burstCount = 0;
    
    // Fire first shot immediately
    this.fireShot();
    
    // Schedule remaining shots in burst
    if (config.BURST_COUNT > 1) {
      this.burstTimer = this.scene.time.addEvent({
        delay: config.BURST_DELAY,
        callback: () => {
          if (!this.active) return;
          this.fireShot();
          
          if (this.burstCount >= config.BURST_COUNT) {
            this.endBurst();
          }
        },
        repeat: config.BURST_COUNT - 2, // -1 for first shot, -1 for repeat count
      });
    } else {
      this.endBurst();
    }
  }

  fireShot() {
    if (!this.active) return;
    
    this.burstCount++;
    
    // Fire projectile toward player (traveling left)
    eventBus.emit(Events.ENEMY_PROJECTILE_FIRED, {
      x: this.sprite.x - 20, // Spawn at front of UFO
      y: this.sprite.y + 5,  // Slightly below center (bottom of saucer)
    });
    
    // Muzzle flash particles
    eventBus.emit(Events.PARTICLES_MUZZLE, {
      x: this.sprite.x - 25,
      y: this.sprite.y + 5,
      direction: 'left',
    });
  }

  endBurst() {
    this.isBursting = false;
    this.lastShootTime = this.scene.time.now;
    
    if (this.burstTimer) {
      this.burstTimer.destroy();
      this.burstTimer = null;
    }
  }

  deactivate() {
    super.deactivate();
    this.isBursting = false;
    if (this.burstTimer) {
      this.burstTimer.destroy();
      this.burstTimer = null;
    }
  }

  destroy() {
    if (this.burstTimer) {
      this.burstTimer.destroy();
      this.burstTimer = null;
    }
    super.destroy();
  }
}
