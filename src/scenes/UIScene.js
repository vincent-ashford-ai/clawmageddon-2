// =============================================================================
// CLAWMAGEDDON 2 - UI SCENE
// HUD overlay: hearts display and score.
// =============================================================================

import Phaser from 'phaser';
import { UI, PLAYER, GAME, UI_JUICE } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { HEART_FULL, HEART_HALF, HEART_EMPTY, HEART_PALETTE } from '../sprites/hearts.js';
import { toggleMute } from '../audio/AudioBridge.js';

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
    this.hearts = [];
    this.displayScore = 0; // For smooth score animation
    this.targetScore = 0;
    this.isMuted = false;
  }

  create() {
    // Generate heart textures from pixel art
    renderPixelArt(this, HEART_FULL, HEART_PALETTE, 'heart-full', 2);
    renderPixelArt(this, HEART_HALF, HEART_PALETTE, 'heart-half', 2);
    renderPixelArt(this, HEART_EMPTY, HEART_PALETTE, 'heart-empty', 2);

    // Mute button (top right corner)
    this.muteButton = this.add.text(GAME.WIDTH - UI.PADDING, UI.PADDING, '🔊', {
      fontSize: '28px',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    
    this.muteButton.on('pointerdown', () => {
      this.isMuted = toggleMute();
      this.muteButton.setText(this.isMuted ? '🔇' : '🔊');
      
      // Visual feedback - quick scale pop
      this.tweens.add({
        targets: this.muteButton,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 100,
        yoyo: true,
        ease: 'Quad.easeOut',
      });
    });
    
    // Hover effect
    this.muteButton.on('pointerover', () => {
      this.muteButton.setAlpha(0.7);
    });
    this.muteButton.on('pointerout', () => {
      this.muteButton.setAlpha(1);
    });

    // Score display (top right, left of mute button)
    this.scoreText = this.add.text(GAME.WIDTH - UI.PADDING - 40, UI.PADDING, 'SCORE: 0', {
      fontSize: UI.SCORE_FONT_SIZE,
      fontFamily: 'monospace',
      color: UI.SCORE_COLOR,
      stroke: UI.SCORE_SHADOW,
      strokeThickness: 3,
    }).setOrigin(1, 0);

    // Hearts display (top left)
    this.createHearts();

    // Triple shot ammo indicator
    this.tripleText = this.add.text(UI.PADDING, GAME.HEIGHT - UI.PADDING - 20, '', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#ffaa00',
    }).setOrigin(0, 1);

    // Heavy Metal ammo indicator
    this.heavyMetalText = this.add.text(UI.PADDING, GAME.HEIGHT - UI.PADDING - 20, '', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#ff4400',
    }).setOrigin(0, 1);

    // Setup event listeners
    this.setupEventListeners();
    
    // Initial UI update
    this.updateHearts();
    
    // Reset score display
    this.displayScore = 0;
    this.targetScore = 0;
  }

  createHearts() {
    // Clear existing hearts
    this.hearts.forEach(h => h.destroy());
    this.hearts = [];
    
    // Create heart sprites for max possible hearts
    for (let i = 0; i < PLAYER.MAX_HEARTS; i++) {
      const x = UI.PADDING + (UI.HEART_SIZE + UI.HEART_SPACING) * i + UI.HEART_SIZE / 2;
      const y = UI.PADDING + UI.HEART_SIZE / 2;
      
      // Create sprite starting with full heart texture
      const heart = this.add.image(x, y, 'heart-full');
      heart.visible = i < gameState.maxHearts;
      this.hearts.push(heart);
    }
  }

  setupEventListeners() {
    // Score changed - smooth count up
    this.onScoreChanged = ({ score }) => {
      this.targetScore = score;
      
      // Pop animation on significant score changes
      const scoreDiff = score - this.displayScore;
      if (scoreDiff >= 10) {
        this.tweens.add({
          targets: this.scoreText,
          scaleX: UI_JUICE.SCORE_POP.SCALE,
          scaleY: UI_JUICE.SCORE_POP.SCALE,
          duration: UI_JUICE.SCORE_POP.DURATION,
          yoyo: true,
          ease: 'Quad.easeOut',
        });
      }
    };
    eventBus.on(Events.SCORE_CHANGED, this.onScoreChanged);

    // Hearts changed
    this.onHeartsChanged = () => {
      this.updateHearts();
    };
    eventBus.on(Events.HEARTS_CHANGED, this.onHeartsChanged);

    // Triple shot
    this.onTripleShotStart = ({ ammo }) => {
      this.tripleText.setText(`TRIPLE SHOT: ${ammo}`);
    };
    eventBus.on(Events.TRIPLE_SHOT_START, this.onTripleShotStart);

    this.onTripleShotEnd = () => {
      this.tripleText.setText('');
    };
    eventBus.on(Events.TRIPLE_SHOT_END, this.onTripleShotEnd);

    // Update triple ammo on each shot
    this.onShoot = () => {
      if (gameState.hasTripleShot) {
        this.tripleText.setText(`TRIPLE SHOT: ${gameState.tripleAmmo}`);
      }
      if (gameState.hasHeavyMetal) {
        this.heavyMetalText.setText(`HEAVY METAL: ${gameState.heavyMetalAmmo}`);
      }
    };
    eventBus.on(Events.PLAYER_SHOOT, this.onShoot);

    // Heavy Metal powerup
    this.onHeavyMetalStart = ({ ammo }) => {
      this.tripleText.setText(''); // Clear triple shot display
      this.heavyMetalText.setText(`HEAVY METAL: ${ammo}`);
    };
    eventBus.on(Events.HEAVY_METAL_START, this.onHeavyMetalStart);

    this.onHeavyMetalEnd = () => {
      this.heavyMetalText.setText('');
    };
    eventBus.on(Events.HEAVY_METAL_END, this.onHeavyMetalEnd);

    // Player damaged - flash hearts
    this.onDamaged = () => {
      this.flashHearts();
    };
    eventBus.on(Events.PLAYER_DAMAGED, this.onDamaged);

    // Cleanup on shutdown
    this.events.on('shutdown', this.cleanup, this);
  }

  updateHearts() {
    const { currentHearts, maxHearts, currentHits } = gameState;
    
    for (let i = 0; i < this.hearts.length; i++) {
      const heart = this.hearts[i];
      
      if (i >= maxHearts) {
        // Beyond max hearts - hide
        heart.visible = false;
        continue;
      }
      
      heart.visible = true;
      
      if (i < currentHearts - 1) {
        // Full heart (hearts before current)
        heart.setTexture('heart-full');
      } else if (i === currentHearts - 1) {
        // Current heart (may be half or full)
        if (currentHits === PLAYER.HITS_PER_HEART) {
          // Full
          heart.setTexture('heart-full');
        } else if (currentHits === 1) {
          // Half
          heart.setTexture('heart-half');
        } else {
          // Empty (0 hits remaining on this heart)
          heart.setTexture('heart-empty');
        }
      } else {
        // Empty heart (hearts after current)
        heart.setTexture('heart-empty');
      }
    }
  }

  update() {
    // Smooth score count-up
    if (this.displayScore < this.targetScore) {
      const diff = this.targetScore - this.displayScore;
      // Speed up count for larger differences
      const increment = Math.max(1, Math.floor(diff * 0.2));
      this.displayScore = Math.min(this.displayScore + increment, this.targetScore);
      this.scoreText.setText(`SCORE: ${this.displayScore}`);
    }
  }

  flashHearts() {
    // Pulse and flash all hearts
    const cfg = UI_JUICE.HEART_PULSE;
    
    for (let i = 0; i < this.hearts.length; i++) {
      const heart = this.hearts[i];
      if (!heart.visible) continue;
      
      // Scale pulse with staggered delay
      this.tweens.add({
        targets: heart,
        scaleX: cfg.SCALE,
        scaleY: cfg.SCALE,
        duration: cfg.DURATION,
        delay: i * 30, // Staggered pulse
        yoyo: true,
        ease: cfg.EASING,
      });
    }
    
    // Also flash alpha
    this.tweens.add({
      targets: this.hearts,
      alpha: 0.3,
      duration: 80,
      yoyo: true,
      repeat: 2,
    });
  }

  cleanup() {
    eventBus.off(Events.SCORE_CHANGED, this.onScoreChanged);
    eventBus.off(Events.HEARTS_CHANGED, this.onHeartsChanged);
    eventBus.off(Events.TRIPLE_SHOT_START, this.onTripleShotStart);
    eventBus.off(Events.TRIPLE_SHOT_END, this.onTripleShotEnd);
    eventBus.off(Events.PLAYER_SHOOT, this.onShoot);
    eventBus.off(Events.PLAYER_DAMAGED, this.onDamaged);
    eventBus.off(Events.HEAVY_METAL_START, this.onHeavyMetalStart);
    eventBus.off(Events.HEAVY_METAL_END, this.onHeavyMetalEnd);
  }
}
