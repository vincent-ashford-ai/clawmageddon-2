// =============================================================================
// CLAWMAGEDDON 2 - EFFECTS SYSTEM
// Screen shake, flash, hit freeze, score popups, and other screen effects.
// =============================================================================

import Phaser from 'phaser';
import { SCREEN_EFFECTS, SCORE_POPUP, GAME } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';

export class EffectsSystem {
  constructor(scene) {
    this.scene = scene;
    this.flashOverlay = null;
    
    this.createFlashOverlay();
    this.setupEventListeners();
  }

  createFlashOverlay() {
    // Create a fullscreen rectangle for flash effects
    this.flashOverlay = this.scene.add.rectangle(
      GAME.WIDTH / 2,
      GAME.HEIGHT / 2,
      GAME.WIDTH,
      GAME.HEIGHT,
      0xffffff,
      0
    );
    this.flashOverlay.setDepth(1000);
    this.flashOverlay.setScrollFactor(0);
  }

  setupEventListeners() {
    // Screen shake (enhanced version)
    this.onScreenShake = ({ intensity, duration }) => {
      const dur = duration || SCREEN_EFFECTS.SHAKE.MEDIUM.duration;
      this.scene.cameras.main.shake(dur, intensity / 1000);
    };
    eventBus.on(Events.SCREEN_SHAKE, this.onScreenShake);
    
    // Screen flash (enhanced with overlay)
    this.onScreenFlash = ({ color, duration, alpha }) => {
      this.flash(color, duration, alpha);
    };
    eventBus.on(Events.SCREEN_FLASH, this.onScreenFlash);
    
    // Hit freeze
    this.onHitFreeze = () => {
      this.hitFreeze();
    };
    eventBus.on(Events.HIT_FREEZE, this.onHitFreeze);
    
    // Score popup
    this.onScorePopup = ({ x, y, score, color }) => {
      this.spawnScorePopup(x, y, score, color);
    };
    eventBus.on(Events.SCORE_POPUP, this.onScorePopup);
    
    // Player damage - automatic flash
    this.onPlayerDamaged = () => {
      const fx = SCREEN_EFFECTS.FLASH.DAMAGE;
      this.flash(fx.color, fx.duration, fx.alpha);
    };
    eventBus.on(Events.PLAYER_DAMAGED, this.onPlayerDamaged);
    
    // Nuke - white flash
    this.onNuke = () => {
      const fx = SCREEN_EFFECTS.FLASH.NUKE;
      this.flash(fx.color, fx.duration, fx.alpha);
    };
    eventBus.on(Events.NUKE_TRIGGERED, this.onNuke);
    
    // Health restored - green flash
    this.onHealthRestored = () => {
      const fx = SCREEN_EFFECTS.FLASH.HEAL;
      this.flash(fx.color, fx.duration, fx.alpha);
    };
    eventBus.on(Events.HEALTH_RESTORED, this.onHealthRestored);
    
    // Powerup collected - orange flash
    this.onPowerup = ({ type }) => {
      if (type !== 'healthPack' && type !== 'nuke') { // These have their own effects
        const fx = SCREEN_EFFECTS.FLASH.POWERUP;
        this.flash(fx.color, fx.duration, fx.alpha);
      }
    };
    eventBus.on(Events.POWERUP_COLLECTED, this.onPowerup);
    
    // Player died - heavy shake + slow mo
    this.onPlayerDied = () => {
      const shake = SCREEN_EFFECTS.SHAKE.DEATH;
      this.scene.cameras.main.shake(shake.duration, shake.intensity / 1000);
      
      // Dramatic slow-mo
      this.scene.time.timeScale = SCREEN_EFFECTS.DEATH_SLOW_MO;
      this.scene.time.delayedCall(SCREEN_EFFECTS.DEATH_SLOW_MO_DURATION / SCREEN_EFFECTS.DEATH_SLOW_MO, () => {
        this.scene.time.timeScale = 1;
      });
    };
    eventBus.on(Events.PLAYER_DIED, this.onPlayerDied);
  }

  // ==========================================================================
  // FLASH EFFECT
  // ==========================================================================
  flash(color, duration = 200, alpha = 0.5) {
    // Stop any existing flash tween
    if (this.flashTween) {
      this.flashTween.stop();
    }
    
    this.flashOverlay.setFillStyle(color);
    this.flashOverlay.setAlpha(alpha);
    
    this.flashTween = this.scene.tweens.add({
      targets: this.flashOverlay,
      alpha: 0,
      duration: duration,
      ease: 'Quad.easeOut',
    });
  }

  // ==========================================================================
  // HIT FREEZE - Brief pause for impact
  // ==========================================================================
  hitFreeze() {
    const freezeMs = SCREEN_EFFECTS.HIT_FREEZE_MS;
    this.scene.time.timeScale = 0.1;
    
    this.scene.time.delayedCall(freezeMs / 10, () => {
      this.scene.time.timeScale = 1;
    });
  }

  // ==========================================================================
  // SCORE POPUP - Floating numbers
  // ==========================================================================
  spawnScorePopup(x, y, score, color = SCORE_POPUP.COLOR) {
    const cfg = SCORE_POPUP;
    
    const text = this.scene.add.text(x, y, `+${score}`, {
      fontSize: cfg.FONT_SIZE,
      fontFamily: cfg.FONT_FAMILY,
      color: color,
      stroke: cfg.STROKE,
      strokeThickness: cfg.STROKE_WIDTH,
    }).setOrigin(0.5).setDepth(500);
    
    // Scale pop
    text.setScale(cfg.SCALE_START);
    
    // Combined animation: pop up, rise, fade
    this.scene.tweens.add({
      targets: text,
      scale: cfg.SCALE_PEAK,
      duration: 100,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: text,
          scale: 1,
          duration: 100,
        });
      },
    });
    
    this.scene.tweens.add({
      targets: text,
      y: y - cfg.RISE_DISTANCE,
      alpha: 0,
      duration: cfg.DURATION,
      ease: 'Quad.easeOut',
      onComplete: () => text.destroy(),
    });
  }

  destroy() {
    eventBus.off(Events.SCREEN_SHAKE, this.onScreenShake);
    eventBus.off(Events.SCREEN_FLASH, this.onScreenFlash);
    eventBus.off(Events.HIT_FREEZE, this.onHitFreeze);
    eventBus.off(Events.SCORE_POPUP, this.onScorePopup);
    eventBus.off(Events.PLAYER_DAMAGED, this.onPlayerDamaged);
    eventBus.off(Events.NUKE_TRIGGERED, this.onNuke);
    eventBus.off(Events.HEALTH_RESTORED, this.onHealthRestored);
    eventBus.off(Events.POWERUP_COLLECTED, this.onPowerup);
    eventBus.off(Events.PLAYER_DIED, this.onPlayerDied);
    
    if (this.flashOverlay) {
      this.flashOverlay.destroy();
    }
  }
}
