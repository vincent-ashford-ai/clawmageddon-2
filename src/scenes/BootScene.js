// =============================================================================
// CLAWMAGEDDON 2 - BOOT SCENE
// Minimal setup, then start MenuScene.
// =============================================================================

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    // Any initial setup can go here
    // For now, just start the menu
    this.scene.start('MenuScene');
  }
}
