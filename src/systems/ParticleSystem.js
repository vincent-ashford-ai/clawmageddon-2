// =============================================================================
// CLAWMAGEDDON 2 - PARTICLE SYSTEM
// Lightweight particle effects using tweened graphics. No plugin required.
// =============================================================================

import Phaser from 'phaser';
import { PARTICLES, SCREEN_EFFECTS } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Muzzle flash when shooting
    this.onMuzzle = ({ x, y }) => this.emitMuzzle(x, y);
    eventBus.on(Events.PARTICLES_MUZZLE, this.onMuzzle);
    
    // Death explosion
    this.onDeath = ({ x, y, color }) => this.emitDeath(x, y, color);
    eventBus.on(Events.PARTICLES_DEATH, this.onDeath);
    
    // Landing dust
    this.onDust = ({ x, y }) => this.emitDust(x, y);
    eventBus.on(Events.PARTICLES_DUST, this.onDust);
    
    // Jump puff
    this.onJump = ({ x, y }) => this.emitJump(x, y);
    eventBus.on(Events.PARTICLES_JUMP, this.onJump);
    
    // Bullet impact
    this.onImpact = ({ x, y }) => this.emitImpact(x, y);
    eventBus.on(Events.PARTICLES_IMPACT, this.onImpact);
    
    // Generic particles (backwards compat)
    this.onEmit = ({ x, y, color, count }) => this.emitBurst(x, y, color, count);
    eventBus.on(Events.PARTICLES_EMIT, this.onEmit);
  }

  // ==========================================================================
  // MUZZLE FLASH - When player shoots
  // ==========================================================================
  emitMuzzle(x, y) {
    const cfg = PARTICLES.MUZZLE;
    
    // Flash circle (brief bright spot)
    const flash = this.scene.add.circle(x, y, 8, 0xffff00, 1);
    flash.setDepth(100);
    this.scene.tweens.add({
      targets: flash,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 80,
      ease: 'Quad.easeOut',
      onComplete: () => flash.destroy(),
    });
    
    // Sparks shooting forward
    for (let i = 0; i < cfg.COUNT; i++) {
      const color = Phaser.Utils.Array.GetRandom(cfg.COLORS);
      const size = Phaser.Math.Between(cfg.SIZE_MIN, cfg.SIZE_MAX);
      const angle = Phaser.Math.DegToRad(Phaser.Math.Between(-cfg.SPREAD / 2, cfg.SPREAD / 2));
      const speed = Phaser.Math.Between(cfg.SPEED_MIN, cfg.SPEED_MAX);
      
      const particle = this.scene.add.circle(x, y, size, color, 1);
      particle.setDepth(100);
      
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      this.scene.tweens.add({
        targets: particle,
        x: x + vx * (cfg.DURATION / 1000),
        y: y + vy * (cfg.DURATION / 1000),
        alpha: 0,
        scale: 0.2,
        duration: cfg.DURATION,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  // ==========================================================================
  // DEATH EXPLOSION - When enemy dies
  // ==========================================================================
  emitDeath(x, y, baseColor) {
    const cfg = PARTICLES.DEATH;
    
    // Central flash
    const flash = this.scene.add.circle(x, y, 15, 0xffffff, 0.8);
    flash.setDepth(100);
    this.scene.tweens.add({
      targets: flash,
      scale: 3,
      alpha: 0,
      duration: 150,
      ease: 'Quad.easeOut',
      onComplete: () => flash.destroy(),
    });
    
    // Debris particles with gravity
    for (let i = 0; i < cfg.COUNT; i++) {
      const angle = (Math.PI * 2 * i) / cfg.COUNT + (Math.random() - 0.5) * 0.5;
      const speed = Phaser.Math.Between(cfg.SPEED_MIN, cfg.SPEED_MAX);
      const size = Phaser.Math.Between(cfg.SIZE_MIN, cfg.SIZE_MAX);
      
      // Vary the color slightly
      const colorVariation = Math.random() > 0.5 ? this.lightenColor(baseColor, 30) : this.darkenColor(baseColor, 30);
      
      const particle = this.scene.add.rectangle(x, y, size, size, colorVariation, 1);
      particle.setDepth(100);
      particle.setRotation(Math.random() * Math.PI * 2);
      
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 50; // Initial upward bias
      const duration = Phaser.Math.Between(cfg.DURATION_MIN, cfg.DURATION_MAX);
      
      // Animate with gravity
      this.scene.tweens.add({
        targets: particle,
        x: x + vx * (duration / 1000),
        y: { value: y + vy * (duration / 1000) + cfg.GRAVITY * Math.pow(duration / 1000, 2) / 2, ease: 'Quad.easeIn' },
        rotation: particle.rotation + Math.PI * 2 * (Math.random() > 0.5 ? 1 : -1),
        alpha: 0,
        scale: 0.3,
        duration: duration,
        onComplete: () => particle.destroy(),
      });
    }
  }

  // ==========================================================================
  // LANDING DUST - When player lands
  // ==========================================================================
  emitDust(x, y) {
    const cfg = PARTICLES.DUST;
    
    for (let i = 0; i < cfg.COUNT; i++) {
      const direction = i < cfg.COUNT / 2 ? -1 : 1; // Half left, half right
      const speedX = Phaser.Math.Between(cfg.SPEED_X_MIN, cfg.SPEED_X_MAX) * direction;
      const speedY = Phaser.Math.Between(cfg.SPEED_Y_MIN, cfg.SPEED_Y_MAX);
      const size = Phaser.Math.Between(cfg.SIZE_MIN, cfg.SIZE_MAX);
      
      const particle = this.scene.add.circle(x + (Math.random() - 0.5) * 20, y, size, cfg.COLOR, 0.7);
      particle.setDepth(50);
      
      this.scene.tweens.add({
        targets: particle,
        x: particle.x + speedX * (cfg.DURATION / 1000),
        y: particle.y + speedY * (cfg.DURATION / 1000),
        alpha: 0,
        scale: 0.3,
        duration: cfg.DURATION,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  // ==========================================================================
  // JUMP PUFF - When player jumps
  // ==========================================================================
  emitJump(x, y) {
    const cfg = PARTICLES.JUMP;
    
    for (let i = 0; i < cfg.COUNT; i++) {
      const angle = Math.PI + (i / cfg.COUNT) * Math.PI; // Spread downward in a semi-circle
      const size = Phaser.Math.Between(cfg.SIZE_MIN, cfg.SIZE_MAX);
      
      const particle = this.scene.add.circle(x, y, size, cfg.COLOR, 0.5);
      particle.setDepth(50);
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * cfg.SPEED * (cfg.DURATION / 1000),
        y: y + Math.sin(angle) * cfg.SPEED * (cfg.DURATION / 1000),
        alpha: 0,
        scale: 1.5,
        duration: cfg.DURATION,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  // ==========================================================================
  // IMPACT SPARKS - When bullet hits something
  // ==========================================================================
  emitImpact(x, y) {
    const cfg = PARTICLES.IMPACT;
    
    for (let i = 0; i < cfg.COUNT; i++) {
      const angle = Math.PI + (Math.random() - 0.5) * Math.PI; // Backwards scatter
      
      const particle = this.scene.add.circle(x, y, cfg.SIZE, cfg.COLOR, 1);
      particle.setDepth(100);
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * cfg.SPEED * (cfg.DURATION / 1000),
        y: y + Math.sin(angle) * cfg.SPEED * (cfg.DURATION / 1000),
        alpha: 0,
        scale: 0.2,
        duration: cfg.DURATION,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  // ==========================================================================
  // GENERIC BURST - Backwards compat for existing PARTICLES_EMIT calls
  // ==========================================================================
  emitBurst(x, y, color, count = 8) {
    const cfg = PARTICLES.DEATH;
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = Phaser.Math.Between(cfg.SPEED_MIN, cfg.SPEED_MAX);
      const size = Phaser.Math.Between(cfg.SIZE_MIN, cfg.SIZE_MAX);
      
      const particle = this.scene.add.circle(x, y, size, color, 1);
      particle.setDepth(100);
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed * 0.5,
        y: y + Math.sin(angle) * speed * 0.5,
        alpha: 0,
        scale: 0.2,
        duration: Phaser.Math.Between(cfg.DURATION_MIN, cfg.DURATION_MAX),
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================
  lightenColor(color, amount) {
    const r = Math.min(255, ((color >> 16) & 0xff) + amount);
    const g = Math.min(255, ((color >> 8) & 0xff) + amount);
    const b = Math.min(255, (color & 0xff) + amount);
    return (r << 16) | (g << 8) | b;
  }

  darkenColor(color, amount) {
    const r = Math.max(0, ((color >> 16) & 0xff) - amount);
    const g = Math.max(0, ((color >> 8) & 0xff) - amount);
    const b = Math.max(0, (color & 0xff) - amount);
    return (r << 16) | (g << 8) | b;
  }

  destroy() {
    eventBus.off(Events.PARTICLES_MUZZLE, this.onMuzzle);
    eventBus.off(Events.PARTICLES_DEATH, this.onDeath);
    eventBus.off(Events.PARTICLES_DUST, this.onDust);
    eventBus.off(Events.PARTICLES_JUMP, this.onJump);
    eventBus.off(Events.PARTICLES_IMPACT, this.onImpact);
    eventBus.off(Events.PARTICLES_EMIT, this.onEmit);
  }
}
