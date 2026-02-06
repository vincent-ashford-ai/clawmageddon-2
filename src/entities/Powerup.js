// =============================================================================
// CLAWMAGEDDON 2 - POWER-UPS
// Health pack, triple shot, extra heart, and nuke.
// =============================================================================

import Phaser from 'phaser';
import { POWERUPS, GAME, PARTICLES } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { ITEM_SPRITES, ITEM_PALETTE } from '../sprites/items.js';

// =============================================================================
// BASE POWERUP CLASS
// =============================================================================
export class Powerup {
  constructor(scene, config, type) {
    this.scene = scene;
    this.config = config;
    this.type = type;
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
    
    // Stop existing tweens
    if (this.bobTween) {
      this.bobTween.stop();
    }
    if (this.glowTween) {
      this.glowTween.stop();
    }
    
    // Bob animation
    this.bobTween = this.scene.tweens.add({
      targets: this.sprite,
      y: y - 8,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Pulse/glow animation (scale pulse)
    this.glowTween = this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  update() {
    if (!this.active) return;

    // Scroll with world
    this.sprite.x -= GAME.WORLD_SPEED * (this.scene.game.loop.delta / 1000);

    // Despawn when off screen
    if (this.sprite.x < POWERUPS.DESPAWN_DISTANCE) {
      this.deactivate();
    }
  }

  collect() {
    const collectX = this.sprite.x;
    const collectY = this.sprite.y;
    
    eventBus.emit(Events.POWERUP_COLLECTED, { 
      type: this.type,
      x: collectX,
      y: collectY,
    });
    
    // Stop bob tween
    if (this.bobTween) {
      this.bobTween.stop();
    }
    
    // Collect particle burst
    this.emitCollectParticles(collectX, collectY);
    
    // Collect effect - pop and spin
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.8,
      scaleY: 1.8,
      alpha: 0,
      angle: 180,
      y: collectY - 30,
      duration: 250,
      ease: 'Back.easeIn',
      onComplete: () => this.deactivate(),
    });
    
    this.applyEffect();
  }

  emitCollectParticles(x, y) {
    // Sparkle burst effect
    const colors = [0xffffff, 0xffff00, 0x00ff00, 0xff00ff];
    
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = 60 + Math.random() * 40;
      const color = Phaser.Utils.Array.GetRandom(colors);
      
      const particle = this.scene.add.circle(x, y, 4, color, 1);
      particle.setDepth(100);
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 300,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  applyEffect() {
    // Override in subclass
  }

  deactivate() {
    this.active = false;
    if (this.bobTween) {
      this.bobTween.stop();
    }
    if (this.glowTween) {
      this.glowTween.stop();
    }
    this.sprite.setActive(false);
    this.sprite.setVisible(false);
    this.sprite.body.enable = false;
    this.sprite.setScale(1);
    this.sprite.setAlpha(1);
    this.sprite.setAngle(0);
  }

  destroy() {
    if (this.bobTween) {
      this.bobTween.stop();
    }
    if (this.glowTween) {
      this.glowTween.stop();
    }
    this.sprite.destroy();
  }
}

// =============================================================================
// HEALTH PACK - Red cross, restores full health
// =============================================================================
export class HealthPack extends Powerup {
  constructor(scene) {
    super(scene, POWERUPS.HEALTH_PACK, 'healthPack');
  }

  createSprite() {
    const { scene } = this;
    const size = POWERUPS.SIZE;
    const texKey = 'powerup-health';
    
    // Render pixel art (16x16 at scale 2 = 32x32)
    renderPixelArt(scene, ITEM_SPRITES.HEALTH_PACK.sprite, ITEM_PALETTE, texKey, 2);
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(size, size);
    this.sprite.body.setOffset(
      (this.sprite.width - size) / 2,
      (this.sprite.height - size) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    this.deactivate();
  }

  applyEffect() {
    gameState.restoreFullHealth();
    eventBus.emit(Events.SFX_PLAY, { sound: 'powerup' });
  }
}

// =============================================================================
// TRIPLE SHOT - Orange gun icon, fires 3 directions
// =============================================================================
export class TripleShot extends Powerup {
  constructor(scene) {
    super(scene, POWERUPS.TRIPLE_SHOT, 'tripleShot');
  }

  createSprite() {
    const { scene } = this;
    const size = POWERUPS.SIZE;
    const texKey = 'powerup-tripleshot';
    
    // Render pixel art (16x16 at scale 2 = 32x32)
    renderPixelArt(scene, ITEM_SPRITES.TRIPLE_SHOT.sprite, ITEM_PALETTE, texKey, 2);
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(size, size);
    this.sprite.body.setOffset(
      (this.sprite.width - size) / 2,
      (this.sprite.height - size) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    this.deactivate();
  }

  applyEffect() {
    gameState.activateTripleShot();
    eventBus.emit(Events.SFX_PLAY, { sound: 'powerup' });
  }
}

// =============================================================================
// EXTRA HEART - Glowing pink heart, adds max HP
// =============================================================================
export class ExtraHeart extends Powerup {
  constructor(scene) {
    super(scene, POWERUPS.EXTRA_HEART, 'extraHeart');
  }

  createSprite() {
    const { scene } = this;
    const size = POWERUPS.SIZE;
    const texKey = 'powerup-extraheart';
    
    // Render pixel art (16x16 at scale 2 = 32x32)
    renderPixelArt(scene, ITEM_SPRITES.EXTRA_HEART.sprite, ITEM_PALETTE, texKey, 2);
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(size, size);
    this.sprite.body.setOffset(
      (this.sprite.width - size) / 2,
      (this.sprite.height - size) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    this.deactivate();
  }

  applyEffect() {
    const added = gameState.addExtraHeart();
    if (added) {
      eventBus.emit(Events.SFX_PLAY, { sound: 'powerup_special' });
    }
  }
}

// =============================================================================
// HEAVY METAL - Steel minigun, auto-firing triple shot
// =============================================================================
export class HeavyMetal extends Powerup {
  constructor(scene) {
    super(scene, POWERUPS.HEAVY_METAL, 'heavyMetal');
  }

  createSprite() {
    const { scene } = this;
    const size = POWERUPS.SIZE;
    const texKey = 'powerup-heavymetal';
    
    // Render pixel art (16x16 at scale 2 = 32x32)
    renderPixelArt(scene, ITEM_SPRITES.HEAVY_METAL.sprite, ITEM_PALETTE, texKey, 2);
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(size, size);
    this.sprite.body.setOffset(
      (this.sprite.width - size) / 2,
      (this.sprite.height - size) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    this.deactivate();
  }

  applyEffect() {
    gameState.activateHeavyMetal();
    eventBus.emit(Events.SCREEN_FLASH, { color: 0xff4400, duration: 150 });
    eventBus.emit(Events.SFX_PLAY, { sound: 'powerup_special' });
  }
}

// =============================================================================
// NUKE - Yellow nuclear symbol, clears all enemies
// =============================================================================
export class Nuke extends Powerup {
  constructor(scene) {
    super(scene, POWERUPS.NUKE, 'nuke');
  }

  createSprite() {
    const { scene } = this;
    const size = POWERUPS.SIZE;
    const texKey = 'powerup-nuke';
    
    // Render pixel art (16x16 at scale 2 = 32x32)
    renderPixelArt(scene, ITEM_SPRITES.NUKE.sprite, ITEM_PALETTE, texKey, 2);
    
    this.sprite = scene.physics.add.sprite(0, 0, texKey);
    this.sprite.body.setSize(size, size);
    this.sprite.body.setOffset(
      (this.sprite.width - size) / 2,
      (this.sprite.height - size) / 2
    );
    this.sprite.body.setAllowGravity(false);
    
    this.deactivate();
  }

  applyEffect() {
    eventBus.emit(Events.NUKE_TRIGGERED);
    eventBus.emit(Events.SCREEN_FLASH, { color: 0xffffff, duration: 200 });
    eventBus.emit(Events.SCREEN_SHAKE, { intensity: 15 });
    eventBus.emit(Events.SFX_PLAY, { sound: 'explosion' });
  }
}
