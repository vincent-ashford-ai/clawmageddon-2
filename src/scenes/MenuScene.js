// =============================================================================
// CLAWMAGEDDON 2 - MENU SCENE
// Epic title screen with THE LOBSTER, wasteland background, enemy silhouettes
// Inspired by Contra box art / Doom cover - BADASS action hero imagery
// =============================================================================

import Phaser from 'phaser';
import { GAME, UI, COLORS, TIMING } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { generateTitleScreen, SCREEN_PALETTE } from '../sprites/screens.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const cx = GAME.WIDTH / 2;
    const cy = GAME.HEIGHT / 2;

    // Generate and render the epic title screen art
    this.createEpicBackground();
    
    // Title: CLAWMAGEDDON 2 - positioned in upper area
    const title1 = this.add.text(cx, 60, 'CLAWMAGEDDON', {
      fontSize: '38px',
      fontFamily: 'Impact, monospace',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5);
    
    const title2 = this.add.text(cx, 110, '2', {
      fontSize: '72px',
      fontFamily: 'Impact, monospace',
      color: '#ffaa00',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5);
    
    // Animate title with subtle pulse
    this.tweens.add({
      targets: title1,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    this.tweens.add({
      targets: title2,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Add glow effect behind title
    const titleGlow = this.add.text(cx, 60, 'CLAWMAGEDDON', {
      fontSize: '38px',
      fontFamily: 'Impact, monospace',
      color: '#ff0000',
    }).setOrigin(0.5).setAlpha(0.3).setBlendMode(Phaser.BlendModes.ADD);
    
    this.tweens.add({
      targets: titleGlow,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Subtitle
    this.add.text(cx, 155, 'THE LOBSTER RISES', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#888888',
    }).setOrigin(0.5);

    // Tap to Start prompt - positioned at bottom
    const prompt = this.add.text(cx, GAME.HEIGHT - 80, 'TAP TO START', {
      fontSize: UI.PROMPT_FONT_SIZE,
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Blink the prompt
    this.tweens.add({
      targets: prompt,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Controls hint
    this.add.text(cx, GAME.HEIGHT - 45, '[ TAP / SPACE to Jump ]  [ HOLD for Double Jump ]', {
      fontSize: '10px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(0.5);

    // Input: Touch or Space
    this.input.once('pointerdown', () => this.startGame());
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    
    // Start menu music (will be queued if audio not initialized yet)
    eventBus.emit(Events.MUSIC_MENU);
    
    // Fade in from black
    this.cameras.main.fadeIn(TIMING.SCENE_FADE_IN, 0, 0, 0);
  }

  createEpicBackground() {
    // Generate the pixel art title screen
    const titleArt = generateTitleScreen();
    
    // Render at scale 2 (200x160 → 400x320)
    renderPixelArt(this, titleArt, SCREEN_PALETTE, 'title-art', 2);
    
    // Position the art to fill most of the screen
    // Center it and push it down a bit to leave room for title text
    const art = this.add.image(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 50, 'title-art');
    art.setOrigin(0.5, 0.5);
    
    // Add subtle parallax drift to the background
    this.tweens.add({
      targets: art,
      x: GAME.WIDTH / 2 + 5,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Add vignette overlay (dark edges)
    this.addVignetteOverlay();
    
    // Add atmospheric particles (ash/embers floating)
    this.addAtmosphericParticles();
  }

  addVignetteOverlay() {
    // Create dark gradient at edges for dramatic effect
    const graphics = this.add.graphics();
    
    // Top gradient (dark to transparent)
    for (let i = 0; i < 40; i++) {
      const alpha = (40 - i) / 40 * 0.7;
      graphics.fillStyle(0x000000, alpha);
      graphics.fillRect(0, i, GAME.WIDTH, 1);
    }
    
    // Bottom gradient
    for (let i = 0; i < 60; i++) {
      const alpha = i / 60 * 0.8;
      graphics.fillStyle(0x000000, alpha);
      graphics.fillRect(0, GAME.HEIGHT - 60 + i, GAME.WIDTH, 1);
    }
    
    // Side gradients
    for (let i = 0; i < 30; i++) {
      const alpha = (30 - i) / 30 * 0.4;
      graphics.fillStyle(0x000000, alpha);
      graphics.fillRect(i, 0, 1, GAME.HEIGHT);
      graphics.fillRect(GAME.WIDTH - i - 1, 0, 1, GAME.HEIGHT);
    }
    
    graphics.setDepth(5);
  }

  addAtmosphericParticles() {
    // Create floating ember/ash particles
    for (let i = 0; i < 15; i++) {
      const ember = this.add.circle(
        Phaser.Math.Between(0, GAME.WIDTH),
        Phaser.Math.Between(180, GAME.HEIGHT - 100),
        Phaser.Math.Between(1, 2),
        Phaser.Math.RND.pick([0xff6600, 0xff4400, 0xffaa00])
      );
      ember.setAlpha(Phaser.Math.FloatBetween(0.3, 0.7));
      ember.setDepth(4);
      
      // Float upward animation
      const duration = Phaser.Math.Between(3000, 6000);
      this.tweens.add({
        targets: ember,
        y: ember.y - Phaser.Math.Between(100, 200),
        x: ember.x + Phaser.Math.Between(-30, 30),
        alpha: 0,
        duration: duration,
        ease: 'Sine.easeIn',
        onComplete: () => {
          // Reset and repeat
          ember.x = Phaser.Math.Between(0, GAME.WIDTH);
          ember.y = Phaser.Math.Between(GAME.HEIGHT - 50, GAME.HEIGHT);
          ember.setAlpha(Phaser.Math.FloatBetween(0.3, 0.7));
          this.addEmberTween(ember);
        }
      });
    }
  }

  addEmberTween(ember) {
    const duration = Phaser.Math.Between(3000, 6000);
    this.tweens.add({
      targets: ember,
      y: ember.y - Phaser.Math.Between(100, 200),
      x: ember.x + Phaser.Math.Between(-30, 30),
      alpha: 0,
      duration: duration,
      ease: 'Sine.easeIn',
      onComplete: () => {
        ember.x = Phaser.Math.Between(0, GAME.WIDTH);
        ember.y = Phaser.Math.Between(GAME.HEIGHT - 50, GAME.HEIGHT);
        ember.setAlpha(Phaser.Math.FloatBetween(0.3, 0.7));
        this.addEmberTween(ember);
      }
    });
  }

  startGame() {
    // Prevent double-tap
    this.input.enabled = false;
    
    eventBus.emit(Events.GAME_START);
    eventBus.emit(Events.MUSIC_STOP);
    
    // Fade out transition
    this.cameras.main.fadeOut(TIMING.SCENE_FADE_OUT, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
    });
  }
}
