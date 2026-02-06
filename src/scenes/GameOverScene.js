// =============================================================================
// CLAWMAGEDDON 2 - GAME OVER SCENE
// Dramatic fallen hero, wasteland graveyard, somber mood
// =============================================================================

import Phaser from 'phaser';
import { GAME, COLORS, UI, TIMING } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { generateGameOverScreen, SCREEN_PALETTE } from '../sprites/screens.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    const cx = GAME.WIDTH / 2;
    const cy = GAME.HEIGHT / 2;

    // Generate and render the epic game over screen art
    this.createDramaticBackground();

    // GAME OVER title - dramatic entrance
    const gameOverText = this.add.text(cx, 80, 'GAME OVER', {
      fontSize: '48px',
      fontFamily: 'Impact, monospace',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5);
    
    // Dramatic slam-in animation
    gameOverText.setScale(3);
    gameOverText.setAlpha(0);
    this.tweens.add({
      targets: gameOverText,
      scale: 1,
      alpha: 1,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Screen shake effect
        this.cameras.main.shake(200, 0.02);
        
        // Then pulse continuously
        this.time.delayedCall(200, () => {
          this.tweens.add({
            targets: gameOverText,
            scaleX: 1.03,
            scaleY: 1.03,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
        });
      },
    });

    // Add red glow behind title
    const glowText = this.add.text(cx, 80, 'GAME OVER', {
      fontSize: '48px',
      fontFamily: 'Impact, monospace',
      color: '#880000',
    }).setOrigin(0.5).setAlpha(0);
    glowText.setBlendMode(Phaser.BlendModes.ADD);
    glowText.setDepth(-1);
    
    this.tweens.add({
      targets: glowText,
      alpha: 0.5,
      delay: 400,
      duration: 500,
    });
    
    this.tweens.add({
      targets: glowText,
      alpha: { from: 0.3, to: 0.6 },
      delay: 900,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Subtitle
    this.add.text(cx, 130, 'THE LOBSTER HAS FALLEN', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(0.5).setAlpha(0).setName('subtitle');
    
    // Fade in subtitle
    this.tweens.add({
      targets: this.children.getByName('subtitle'),
      alpha: 1,
      delay: 600,
      duration: 500,
    });

    // Stats container - position below the art
    const statsY = GAME.HEIGHT - 180;
    
    // Final score label
    const scoreLabel = this.add.text(cx, statsY, 'FINAL SCORE', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#888888',
    }).setOrigin(0.5).setAlpha(0);
    
    // Score value
    const scoreText = this.add.text(cx, statsY + 35, '0', {
      fontSize: '48px',
      fontFamily: 'Impact, monospace',
      color: '#ffaa00',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setAlpha(0);
    
    // Fade in and count up score
    this.time.delayedCall(500, () => {
      scoreLabel.setAlpha(1);
      scoreText.setAlpha(1);
      
      const finalScore = gameState.score;
      this.tweens.addCounter({
        from: 0,
        to: finalScore,
        duration: 1500,
        ease: 'Power2',
        onUpdate: (tween) => {
          scoreText.setText(`${Math.floor(tween.getValue())}`);
        },
        onComplete: () => {
          // Punch effect when count finishes
          this.tweens.add({
            targets: scoreText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true,
          });
        }
      });
    });

    // Stats row
    const stats1 = this.add.text(cx, statsY + 80, `Enemies: ${gameState.enemiesKilled}  •  Distance: ${Math.floor(gameState.distanceTraveled)}m`, {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(0.5).setAlpha(0);
    
    this.time.delayedCall(800, () => {
      stats1.setAlpha(1);
    });

    // TAP TO RESTART prompt
    const prompt = this.add.text(cx, GAME.HEIGHT - 50, 'TAP TO RESTART', {
      fontSize: UI.PROMPT_FONT_SIZE,
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0);

    // Fade in and blink prompt after delay
    this.time.delayedCall(1500, () => {
      prompt.setAlpha(1);
      this.tweens.add({
        targets: prompt,
        alpha: 0.3,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    });

    // Delay before allowing restart (prevent accidental tap)
    this.time.delayedCall(1000, () => {
      this.input.once('pointerdown', () => this.restartGame());
      this.input.keyboard.once('keydown-SPACE', () => this.restartGame());
    });

    // Emit game over music event
    eventBus.emit(Events.MUSIC_GAMEOVER);
    
    // Fade in from red (dramatic death transition)
    this.cameras.main.fadeIn(TIMING.SCENE_FADE_IN, 20, 0, 0);
  }

  createDramaticBackground() {
    // Generate the pixel art game over screen
    const gameOverArt = generateGameOverScreen();
    
    // Render at scale to fit screen width (200 * 2 = 400)
    renderPixelArt(this, gameOverArt, SCREEN_PALETTE, 'gameover-art', 2);
    
    // Position the art in the upper portion of screen
    const art = this.add.image(GAME.WIDTH / 2, 280, 'gameover-art');
    art.setOrigin(0.5, 0.5);
    
    // Add somber color overlay
    const overlay = this.add.rectangle(0, 0, GAME.WIDTH, GAME.HEIGHT, 0x000000, 0.3);
    overlay.setOrigin(0, 0);
    overlay.setDepth(-2);
    
    // Dark vignette for drama
    this.addDarkVignette();
    
    // Add slow-falling ash particles
    this.addAshParticles();
    
    // Subtle slow movement on the art (wind/drift effect)
    this.tweens.add({
      targets: art,
      y: art.y + 3,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  addDarkVignette() {
    const graphics = this.add.graphics();
    graphics.setDepth(10);
    
    // Heavy top vignette
    for (let i = 0; i < 80; i++) {
      const alpha = (80 - i) / 80 * 0.85;
      graphics.fillStyle(0x000000, alpha);
      graphics.fillRect(0, i, GAME.WIDTH, 1);
    }
    
    // Heavy bottom vignette
    for (let i = 0; i < 100; i++) {
      const alpha = i / 100 * 0.9;
      graphics.fillStyle(0x000000, alpha);
      graphics.fillRect(0, GAME.HEIGHT - 100 + i, GAME.WIDTH, 1);
    }
    
    // Side vignettes
    for (let i = 0; i < 50; i++) {
      const alpha = (50 - i) / 50 * 0.5;
      graphics.fillStyle(0x000000, alpha);
      graphics.fillRect(i, 0, 1, GAME.HEIGHT);
      graphics.fillRect(GAME.WIDTH - i - 1, 0, 1, GAME.HEIGHT);
    }
  }

  addAshParticles() {
    // Slow falling ash/dust particles
    for (let i = 0; i < 20; i++) {
      const ash = this.add.circle(
        Phaser.Math.Between(0, GAME.WIDTH),
        Phaser.Math.Between(0, GAME.HEIGHT),
        Phaser.Math.Between(1, 2),
        0x444444
      );
      ash.setAlpha(Phaser.Math.FloatBetween(0.2, 0.5));
      ash.setDepth(5);
      
      this.addAshTween(ash);
    }
  }

  addAshTween(ash) {
    const duration = Phaser.Math.Between(4000, 8000);
    this.tweens.add({
      targets: ash,
      y: ash.y + Phaser.Math.Between(100, 200),
      x: ash.x + Phaser.Math.Between(-20, 20),
      alpha: 0,
      duration: duration,
      ease: 'Sine.easeIn',
      onComplete: () => {
        ash.x = Phaser.Math.Between(0, GAME.WIDTH);
        ash.y = Phaser.Math.Between(-20, 50);
        ash.setAlpha(Phaser.Math.FloatBetween(0.2, 0.5));
        this.addAshTween(ash);
      }
    });
  }

  restartGame() {
    // Prevent double-tap
    this.input.enabled = false;
    
    eventBus.emit(Events.GAME_RESTART);
    eventBus.emit(Events.MUSIC_STOP);
    
    // Fade out transition
    this.cameras.main.fadeOut(TIMING.SCENE_FADE_OUT, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Go directly to GameScene (which calls gameState.reset() in create())
      this.scene.start('GameScene');
    });
  }
}
