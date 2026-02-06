// =============================================================================
// CLAWMAGEDDON 2 - OBSTACLES
// Spikes, toxic barrels, and sludge puddles. All deal 1 damage on contact.
// =============================================================================

import Phaser from 'phaser';
import { OBSTACLES, GAME, PARTICLES } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { TILE_SPRITES, TILE_PALETTE } from '../sprites/tiles.js';

// =============================================================================
// BASE OBSTACLE CLASS
// =============================================================================
export class Obstacle {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
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
    this.sprite.body.enable = true;
    this.active = true;
  }

  update() {
    if (!this.active) return;

    // Scroll with world
    this.sprite.x -= GAME.WORLD_SPEED * (this.scene.game.loop.delta / 1000);

    // Despawn when off screen
    if (this.sprite.x < OBSTACLES.DESPAWN_DISTANCE) {
      this.deactivate();
    }
  }

  onHit() {
    eventBus.emit(Events.OBSTACLE_HIT, { 
      x: this.sprite.x, 
      y: this.sprite.y,
      type: this.constructor.name,
    });
  }

  deactivate() {
    this.active = false;
    this.sprite.setActive(false);
    this.sprite.setVisible(false);
    this.sprite.body.enable = false;
  }

  destroy() {
    this.sprite.destroy();
  }
}

// =============================================================================
// SPIKES - Sharp metal spikes jutting from ground
// =============================================================================
export class Spikes extends Obstacle {
  constructor(scene) {
    super(scene, OBSTACLES.SPIKES);
  }

  createSprite() {
    const { scene, config } = this;
    const texKey = 'obstacle-spikes';
    
    // Render pixel art (20x12 at scale 2 = 40x24)
    renderPixelArt(scene, TILE_SPRITES.SPIKES.sprite, TILE_PALETTE, texKey, 2);
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(config.WIDTH, config.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - config.WIDTH) / 2,
      (this.sprite.height - config.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setImmovable(true);
    
    this.deactivate();
  }
}

// =============================================================================
// TOXIC BARREL - Green barrel with radiation symbol (with dripping effect!)
// =============================================================================
export class ToxicBarrel extends Obstacle {
  constructor(scene) {
    super(scene, OBSTACLES.TOXIC_BARREL);
    this.lastDripTime = 0;
    this.drips = [];
  }

  createSprite() {
    const { scene, config } = this;
    const texKey = 'obstacle-barrel';
    
    // Render pixel art (16x24 at scale 2 = 32x48)
    renderPixelArt(scene, TILE_SPRITES.TOXIC_BARREL.sprite, TILE_PALETTE, texKey, 2);
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(config.WIDTH, config.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - config.WIDTH) / 2,
      (this.sprite.height - config.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setImmovable(true);
    
    this.deactivate();
  }

  spawn(x, y) {
    super.spawn(x, y);
    this.lastDripTime = this.scene.time.now;
  }

  update() {
    if (!this.active) return;
    super.update();
    
    // Toxic drip effect
    const cfg = PARTICLES.TOXIC_DRIP;
    const now = this.scene.time.now;
    
    if (now - this.lastDripTime > cfg.INTERVAL) {
      this.lastDripTime = now;
      this.emitDrip();
    }
    
    // Update existing drips
    this.updateDrips();
  }

  emitDrip() {
    const cfg = PARTICLES.TOXIC_DRIP;
    const drip = this.scene.add.circle(
      this.sprite.x + (Math.random() - 0.5) * 10,
      this.sprite.y + this.config.HEIGHT / 2 - 5,
      cfg.SIZE,
      cfg.COLOR,
      0.9
    );
    drip.setDepth(50);
    drip.velocityY = cfg.FALL_SPEED;
    drip.startY = drip.y;
    this.drips.push(drip);
  }

  updateDrips() {
    const cfg = PARTICLES.TOXIC_DRIP;
    const groundY = GAME.HEIGHT - GAME.GROUND_HEIGHT;
    
    for (let i = this.drips.length - 1; i >= 0; i--) {
      const drip = this.drips[i];
      drip.y += drip.velocityY * (this.scene.game.loop.delta / 1000);
      
      // Hit ground - splash and remove
      if (drip.y >= groundY - 5) {
        // Splash particles
        for (let j = 0; j < cfg.SPLASH_COUNT; j++) {
          const splash = this.scene.add.circle(
            drip.x + (Math.random() - 0.5) * 10,
            groundY - 3,
            2,
            cfg.COLOR,
            0.7
          );
          splash.setDepth(49);
          this.scene.tweens.add({
            targets: splash,
            x: splash.x + (Math.random() - 0.5) * 20,
            y: splash.y - Math.random() * 10,
            alpha: 0,
            scale: 0.3,
            duration: 200,
            onComplete: () => splash.destroy(),
          });
        }
        
        drip.destroy();
        this.drips.splice(i, 1);
      }
    }
  }

  deactivate() {
    super.deactivate();
    // Clean up drips (check exists for safety)
    if (this.drips) {
      for (const drip of this.drips) {
        drip.destroy();
      }
      this.drips = [];
    }
  }

  destroy() {
    if (this.drips) {
      for (const drip of this.drips) {
        drip.destroy();
      }
      this.drips = [];
    }
    super.destroy();
  }
}

// =============================================================================
// SLUDGE PUDDLE - Flat toxic puddle on ground
// =============================================================================
export class SludgePuddle extends Obstacle {
  constructor(scene) {
    super(scene, OBSTACLES.SLUDGE_PUDDLE);
  }

  createSprite() {
    const { scene, config } = this;
    const texKey = 'obstacle-sludge';
    
    // Render pixel art (30x6 at scale 2 = 60x12)
    renderPixelArt(scene, TILE_SPRITES.SLUDGE_PUDDLE.sprite, TILE_PALETTE, texKey, 2);
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(config.WIDTH, config.HEIGHT);
    this.sprite.body.setOffset(
      (this.sprite.width - config.WIDTH) / 2,
      (this.sprite.height - config.HEIGHT) / 2
    );
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setImmovable(true);
    
    this.deactivate();
  }
}
