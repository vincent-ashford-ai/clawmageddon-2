// =============================================================================
// CLAWMAGEDDON 2 - GAME CONFIG
// Phaser configuration for portrait mode, mobile-first gameplay.
// =============================================================================

import Phaser from 'phaser';
import { GAME, PARALLAX } from './Constants.js';
import { BootScene } from '../scenes/BootScene.js';
import { MenuScene } from '../scenes/MenuScene.js';
import { GameScene } from '../scenes/GameScene.js';
import { UIScene } from '../scenes/UIScene.js';
import { GameOverScene } from '../scenes/GameOverScene.js';

export const GameConfig = {
  type: Phaser.AUTO,
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  parent: 'game-container',
  backgroundColor: PARALLAX.SKY.COLOR_TOP,
  
  // Responsive scaling - FIT to container, centered
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GAME.GRAVITY },
      debug: false,
    },
  },
  
  scene: [BootScene, MenuScene, GameScene, UIScene, GameOverScene],
  
  // Disable right-click context menu
  disableContextMenu: true,
  
  // Input settings for touch
  input: {
    activePointers: 2,
  },
  
  // CRITICAL: Disable Phaser's built-in audio to prevent premature AudioContext creation
  // The game uses Strudel (BGM) and custom Web Audio API (SFX) instead
  // Without this, Phaser creates an AudioContext during game init, BEFORE user gesture,
  // which causes mobile browsers to show warnings/errors about autoplay policy
  audio: {
    noAudio: true,
  },
};
