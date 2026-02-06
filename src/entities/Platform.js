// =============================================================================
// CLAWMAGEDDON 2 - PLATFORMS
// Floating platforms the player can jump onto.
// =============================================================================

import Phaser from 'phaser';
import { PLATFORMS, GAME } from '../core/Constants.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { TILE_SPRITES, TILE_PALETTE } from '../sprites/tiles.js';

export class Platform {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.width = 0;
    
    this.createSprite();
  }

  createSprite() {
    const { scene } = this;
    const texKey = 'platform-tile';
    
    // Render pixel art (16x10 at scale 2 = 32x20)
    renderPixelArt(scene, TILE_SPRITES.PLATFORM.sprite, TILE_PALETTE, texKey, 2);
    
    // Create a tileSprite so we can stretch it
    this.sprite = scene.add.tileSprite(0, 0, PLATFORMS.MIN_WIDTH, PLATFORMS.HEIGHT, texKey);
    scene.physics.add.existing(this.sprite, true); // Static body
    
    this.deactivate();
  }

  spawn(x, y, width) {
    this.width = width || Phaser.Math.Between(PLATFORMS.MIN_WIDTH, PLATFORMS.MAX_WIDTH);
    
    // Resize the platform tileSprite
    this.sprite.width = this.width;
    
    // Update physics body
    this.sprite.body.setSize(this.width, PLATFORMS.HEIGHT);
    this.sprite.body.setOffset(0, 0);
    
    this.sprite.setPosition(x, y);
    this.sprite.setActive(true);
    this.sprite.setVisible(true);
    this.sprite.body.enable = true;
    this.active = true;
    
    // One-way platform: disable downward collision so player can jump through from below
    this.sprite.body.checkCollision.down = false;
    
    // Re-sync the static body position
    this.sprite.body.updateFromGameObject();
  }

  update() {
    if (!this.active) return;

    // Scroll with world
    this.sprite.x -= GAME.WORLD_SPEED * (this.scene.game.loop.delta / 1000);
    
    // Update static body position
    this.sprite.body.updateFromGameObject();

    // Despawn when off screen
    if (this.sprite.x < PLATFORMS.DESPAWN_DISTANCE) {
      this.deactivate();
    }
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
