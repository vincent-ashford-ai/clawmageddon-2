// =============================================================================
// CLAWMAGEDDON 2 - THE LOBSTER (Player)
// Anthropomorphic lobster warrior. Auto-runs, tap to jump+shoot.
// =============================================================================

import Phaser from 'phaser';
import { PLAYER, GAME, POWERUPS } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { renderSpriteSheet } from '../core/PixelRenderer.js';
import {
  LOBSTER_WALK_FRAMES, LOBSTER_JUMP, LOBSTER_PALETTE,
  LOBSTER_WALK_FRAMES_TRIPLE, LOBSTER_JUMP_FRAMES_TRIPLE,
  LOBSTER_WALK_FRAMES_HEAVY, LOBSTER_JUMP_FRAMES_HEAVY,
} from '../sprites/player.js';

// Weapon visual state constants
const WEAPON_DEFAULT = 'default';
const WEAPON_TRIPLE = 'triple';
const WEAPON_HEAVY = 'heavy';
const WEAPON_MISSILE = 'missile';
const WEAPON_GRENADE = 'grenade';

export class Lobster {
  constructor(scene) {
    this.scene = scene;
    this.canDoubleJump = false;
    this.hasDoubleJumped = false;
    this.isFlashing = false;
    this.wasOnGround = true; // Track for landing detection
    this.isDead = false; // Local death flag to prevent input during death animation
    this.lastHeavyMetalFire = 0; // Track last auto-fire time for Heavy Metal
    this.lastMissileFire = 0; // Track last fire time for Missile Launcher
    this.lastGrenadeFire = 0; // Track last fire time for Grenade Launcher
    this.currentWeapon = WEAPON_DEFAULT; // Track current weapon visual state
    
    this.createSprite();
    this.setupWeaponListeners();
  }

  createSprite() {
    const { scene } = this;
    
    // Render the lobster spritesheets (24x32 at scale 2 = 48x64)
    // Default (normal claws)
    renderSpriteSheet(scene, LOBSTER_WALK_FRAMES, LOBSTER_PALETTE, 'lobster-walk', 2);
    renderSpriteSheet(scene, [LOBSTER_JUMP], LOBSTER_PALETTE, 'lobster-jump', 2);
    
    // Triple Shot (gun barrels)
    renderSpriteSheet(scene, LOBSTER_WALK_FRAMES_TRIPLE, LOBSTER_PALETTE, 'lobster-walk-triple', 2);
    renderSpriteSheet(scene, LOBSTER_JUMP_FRAMES_TRIPLE, LOBSTER_PALETTE, 'lobster-jump-triple', 2);
    
    // Heavy Metal (gatling guns)
    renderSpriteSheet(scene, LOBSTER_WALK_FRAMES_HEAVY, LOBSTER_PALETTE, 'lobster-walk-heavy', 2);
    renderSpriteSheet(scene, LOBSTER_JUMP_FRAMES_HEAVY, LOBSTER_PALETTE, 'lobster-jump-heavy', 2);
    
    // Create walk animations for all weapon states
    if (!scene.anims.exists('lobster-walk')) {
      scene.anims.create({
        key: 'lobster-walk',
        frames: scene.anims.generateFrameNumbers('lobster-walk', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!scene.anims.exists('lobster-walk-triple')) {
      scene.anims.create({
        key: 'lobster-walk-triple',
        frames: scene.anims.generateFrameNumbers('lobster-walk-triple', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!scene.anims.exists('lobster-walk-heavy')) {
      scene.anims.create({
        key: 'lobster-walk-heavy',
        frames: scene.anims.generateFrameNumbers('lobster-walk-heavy', { start: 0, end: 3 }),
        frameRate: 12, // Slightly faster for gatling gun feel
        repeat: -1,
      });
    }
    
    // Create jump animations for all weapon states
    if (!scene.anims.exists('lobster-jump')) {
      scene.anims.create({
        key: 'lobster-jump',
        frames: scene.anims.generateFrameNumbers('lobster-jump', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: 0,
      });
    }
    if (!scene.anims.exists('lobster-jump-triple')) {
      scene.anims.create({
        key: 'lobster-jump-triple',
        frames: scene.anims.generateFrameNumbers('lobster-jump-triple', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: 0,
      });
    }
    if (!scene.anims.exists('lobster-jump-heavy')) {
      scene.anims.create({
        key: 'lobster-jump-heavy',
        frames: scene.anims.generateFrameNumbers('lobster-jump-heavy', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: 0,
      });
    }
    
    // Create the sprite
    this.sprite = scene.physics.add.sprite(PLAYER.START_X, PLAYER.START_Y, 'lobster-walk', 0);
    this.sprite.body.setSize(PLAYER.WIDTH * 0.6, PLAYER.HEIGHT * 0.85);
    this.sprite.body.setOffset(
      (this.sprite.width - PLAYER.WIDTH * 0.6) / 2,
      (this.sprite.height - PLAYER.HEIGHT * 0.85)
    );
    this.sprite.body.setCollideWorldBounds(true);
    
    // Start walk animation
    this.sprite.play('lobster-walk');
  }

  setupWeaponListeners() {
    // Listen for weapon powerup events
    eventBus.on(Events.TRIPLE_SHOT_START, this.onTripleShotStart, this);
    eventBus.on(Events.TRIPLE_SHOT_END, this.onTripleShotEnd, this);
    eventBus.on(Events.HEAVY_METAL_START, this.onHeavyMetalStart, this);
    eventBus.on(Events.HEAVY_METAL_END, this.onHeavyMetalEnd, this);
    eventBus.on(Events.MISSILE_LAUNCHER_START, this.onMissileLauncherStart, this);
    eventBus.on(Events.MISSILE_LAUNCHER_END, this.onMissileLauncherEnd, this);
    eventBus.on(Events.GRENADE_LAUNCHER_START, this.onGrenadeLauncherStart, this);
    eventBus.on(Events.GRENADE_LAUNCHER_END, this.onGrenadeLauncherEnd, this);
  }

  onTripleShotStart() {
    this.setWeaponState(WEAPON_TRIPLE);
  }

  onTripleShotEnd() {
    // Only revert to default if not in heavy metal mode
    if (this.currentWeapon === WEAPON_TRIPLE) {
      this.setWeaponState(WEAPON_DEFAULT);
    }
  }

  onHeavyMetalStart() {
    // Heavy Metal overrides everything
    this.setWeaponState(WEAPON_HEAVY);
  }

  onHeavyMetalEnd() {
    // Revert to triple if active, otherwise default
    if (gameState.hasTripleShot) {
      this.setWeaponState(WEAPON_TRIPLE);
    } else {
      this.setWeaponState(WEAPON_DEFAULT);
    }
  }

  onMissileLauncherStart() {
    // Missile Launcher uses same visuals as heavy (or we could add custom sprites later)
    this.setWeaponState(WEAPON_MISSILE);
  }

  onMissileLauncherEnd() {
    // Revert to appropriate weapon state
    if (gameState.hasHeavyMetal) {
      this.setWeaponState(WEAPON_HEAVY);
    } else if (gameState.hasTripleShot) {
      this.setWeaponState(WEAPON_TRIPLE);
    } else {
      this.setWeaponState(WEAPON_DEFAULT);
    }
  }

  onGrenadeLauncherStart() {
    // Grenade Launcher uses heavy weapon visuals (or we could add custom sprites later)
    this.setWeaponState(WEAPON_GRENADE);
  }

  onGrenadeLauncherEnd() {
    // Revert to appropriate weapon state
    if (gameState.hasHeavyMetal) {
      this.setWeaponState(WEAPON_HEAVY);
    } else if (gameState.hasMissileLauncher) {
      this.setWeaponState(WEAPON_MISSILE);
    } else if (gameState.hasTripleShot) {
      this.setWeaponState(WEAPON_TRIPLE);
    } else {
      this.setWeaponState(WEAPON_DEFAULT);
    }
  }

  setWeaponState(weaponState) {
    if (this.currentWeapon === weaponState) return;
    
    this.currentWeapon = weaponState;
    
    // Determine suffix for animation keys
    // Missile and Grenade use heavy weapon visuals (same gatling gun look)
    let suffix;
    if (weaponState === WEAPON_DEFAULT) {
      suffix = '';
    } else if (weaponState === WEAPON_MISSILE || weaponState === WEAPON_GRENADE) {
      suffix = '-heavy'; // Reuse heavy weapon sprites for missile/grenade launcher
    } else {
      suffix = `-${weaponState}`;
    }
    
    // Get current animation type (walk or jump)
    const currentAnim = this.sprite.anims.currentAnim?.key || 'lobster-walk';
    const isJumping = currentAnim.includes('jump');
    
    // Switch to corresponding weapon animation
    const newAnimKey = isJumping ? `lobster-jump${suffix}` : `lobster-walk${suffix}`;
    this.sprite.play(newAnimKey, true); // true = ignoreIfPlaying: false, force switch
  }

  getWalkAnimKey() {
    let suffix;
    if (this.currentWeapon === WEAPON_DEFAULT) {
      suffix = '';
    } else if (this.currentWeapon === WEAPON_MISSILE || this.currentWeapon === WEAPON_GRENADE) {
      suffix = '-heavy'; // Reuse heavy weapon sprites
    } else {
      suffix = `-${this.currentWeapon}`;
    }
    return `lobster-walk${suffix}`;
  }

  getJumpAnimKey() {
    let suffix;
    if (this.currentWeapon === WEAPON_DEFAULT) {
      suffix = '';
    } else if (this.currentWeapon === WEAPON_MISSILE || this.currentWeapon === WEAPON_GRENADE) {
      suffix = '-heavy'; // Reuse heavy weapon sprites
    } else {
      suffix = `-${this.currentWeapon}`;
    }
    return `lobster-jump${suffix}`;
  }

  update(actionPressed) {
    if (gameState.gameOver || this.isDead) return;

    const body = this.sprite.body;
    const onGround = body.blocked.down;
    const now = this.scene.time.now;

    // Detect landing (was in air, now on ground)
    if (onGround && !this.wasOnGround) {
      // Emit landing dust particles
      eventBus.emit(Events.PARTICLES_DUST, {
        x: this.sprite.x,
        y: this.sprite.y + PLAYER.HEIGHT / 2 - 5,
      });
      eventBus.emit(Events.PLAYER_LANDED);
    }
    this.wasOnGround = onGround;

    // Reset double jump when landing
    if (onGround) {
      this.canDoubleJump = true;
      this.hasDoubleJumped = false;
      
      // Switch to walk animation when landing (use weapon-specific animation)
      const walkAnim = this.getWalkAnimKey();
      if (this.sprite.anims.currentAnim?.key !== walkAnim) {
        this.sprite.play(walkAnim);
      }
    }

    // Heavy Metal auto-fire: continuous triple shot without tapping
    if (gameState.hasHeavyMetal) {
      if (now - this.lastHeavyMetalFire >= POWERUPS.HEAVY_METAL.FIRE_RATE) {
        this.shootHeavyMetal();
        this.lastHeavyMetalFire = now;
      }
    }

    // Handle tap/space action: Jump (+ Shoot if not using auto-fire weapons)
    if (actionPressed) {
      // Only manually shoot if NOT using auto-fire weapons (Heavy Metal only)
      if (!gameState.hasHeavyMetal) {
        this.shoot();
      }

      // Jump logic (always works, Heavy Metal doesn't affect jumping)
      if (onGround) {
        // First jump - emit jump puff
        body.setVelocityY(PLAYER.JUMP_VELOCITY);
        eventBus.emit(Events.PLAYER_JUMP);
        eventBus.emit(Events.PARTICLES_JUMP, {
          x: this.sprite.x,
          y: this.sprite.y + PLAYER.HEIGHT / 2 - 5,
        });
        this.canDoubleJump = true;
        this.sprite.play(this.getJumpAnimKey());
      } else if (this.canDoubleJump && !this.hasDoubleJumped) {
        // Double jump - another puff
        body.setVelocityY(PLAYER.DOUBLE_JUMP_VELOCITY);
        eventBus.emit(Events.PLAYER_DOUBLE_JUMP);
        eventBus.emit(Events.PARTICLES_JUMP, {
          x: this.sprite.x,
          y: this.sprite.y + PLAYER.HEIGHT / 2,
        });
        this.hasDoubleJumped = true;
        this.canDoubleJump = false;
      }
    }
  }

  shoot() {
    const muzzleX = this.sprite.x + PLAYER.WIDTH / 2 + 10;
    const muzzleY = this.sprite.y - 5;
    const now = this.scene.time.now;
    
    // Grenade Launcher: fire a lobbed grenade (manual fire with fire rate limit)
    if (gameState.hasGrenadeLauncher) {
      // Check fire rate
      if (now - this.lastGrenadeFire < POWERUPS.GRENADE_LAUNCHER.FIRE_RATE) {
        return; // Too soon to fire again
      }
      this.lastGrenadeFire = now;
      
      gameState.useGrenadeAmmo();
      eventBus.emit(Events.PROJECTILE_FIRED, {
        x: muzzleX,
        y: muzzleY,
        grenade: true,
        direction: 1, // Always fire right
      });
      
      // Muzzle flash particles
      eventBus.emit(Events.PARTICLES_MUZZLE, { x: muzzleX, y: muzzleY });
      eventBus.emit(Events.PLAYER_SHOOT);
      return;
    }
    
    // Missile Launcher: fire a heat-seeking missile (manual fire with fire rate limit)
    if (gameState.hasMissileLauncher) {
      // Check fire rate
      if (now - this.lastMissileFire < POWERUPS.MISSILE_LAUNCHER.FIRE_RATE) {
        return; // Too soon to fire again
      }
      this.lastMissileFire = now;
      
      gameState.useMissileAmmo();
      eventBus.emit(Events.PROJECTILE_FIRED, {
        x: muzzleX,
        y: muzzleY,
        missile: true, // Heat-seeking missile
      });
      
      // Muzzle flash particles
      eventBus.emit(Events.PARTICLES_MUZZLE, { x: muzzleX, y: muzzleY });
      eventBus.emit(Events.PLAYER_SHOOT);
      return;
    }
    
    if (gameState.hasTripleShot) {
      gameState.useTripleAmmo();
      eventBus.emit(Events.PROJECTILE_FIRED, {
        x: muzzleX,
        y: muzzleY,
        triple: true,
      });
    } else {
      eventBus.emit(Events.PROJECTILE_FIRED, {
        x: muzzleX,
        y: muzzleY,
        triple: false,
      });
    }
    
    // Muzzle flash particles
    eventBus.emit(Events.PARTICLES_MUZZLE, { x: muzzleX, y: muzzleY });
    
    eventBus.emit(Events.PLAYER_SHOOT);
  }

  shootHeavyMetal() {
    // Heavy Metal auto-fires triple shot and depletes ammo
    const muzzleX = this.sprite.x + PLAYER.WIDTH / 2 + 10;
    const muzzleY = this.sprite.y - 5;
    
    gameState.useHeavyMetalAmmo();
    
    eventBus.emit(Events.PROJECTILE_FIRED, {
      x: muzzleX,
      y: muzzleY,
      heavyMetal: true, // Quintuple shot (5 bullets)
    });
    
    // Extra muzzle flash for Heavy Metal (more particles)
    eventBus.emit(Events.PARTICLES_MUZZLE, { x: muzzleX, y: muzzleY });
    
    eventBus.emit(Events.PLAYER_SHOOT);
  }

  takeDamage() {
    if (gameState.isInvulnerable || this.isDead) return;

    const died = gameState.takeDamage(1);
    
    if (died) {
      this.die();
    } else {
      this.startInvulnerability();
      eventBus.emit(Events.PLAYER_DAMAGED);
      eventBus.emit(Events.SCREEN_SHAKE, { intensity: 8 });
      eventBus.emit(Events.HIT_FREEZE); // Brief pause for impact
      
      // Red tint flash
      this.sprite.setTint(0xff4444);
      this.scene.time.delayedCall(100, () => {
        if (!this.isFlashing) {
          this.sprite.clearTint();
        }
      });
    }
  }

  startInvulnerability() {
    gameState.setInvulnerable(true);
    this.isFlashing = true;
    
    // Flash effect
    this.flashTween = this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: Math.floor(PLAYER.INVULNERABLE_MS / 200),
      onComplete: () => {
        this.sprite.setAlpha(1);
        this.isFlashing = false;
        gameState.setInvulnerable(false);
      },
    });
  }

  die() {
    // Set local death flag to prevent input processing during death animation.
    // Don't set gameState.gameOver here - let GameScene.triggerGameOver() handle it
    // after the death animation delay. Setting it here causes the scene transition
    // to be skipped because triggerGameOver() guards against gameOver already being true.
    this.isDead = true;
    eventBus.emit(Events.PLAYER_DIED);
    eventBus.emit(Events.SCREEN_SHAKE, { intensity: 20, duration: 400 });
    
    // Death particles burst
    eventBus.emit(Events.PARTICLES_DEATH, {
      x: this.sprite.x,
      y: this.sprite.y,
      color: PLAYER.COLOR_BODY,
    });
    
    // Dramatic death animation - launch up, spin, fall
    this.sprite.stop();
    this.sprite.body.setVelocity(0, 0);
    this.sprite.body.setAllowGravity(false);
    
    // Phase 1: Launch up with spin
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 80,
      angle: 360,
      duration: 400,
      ease: 'Quad.easeOut',
      onComplete: () => {
        // Phase 2: Fall with continued spin and fade
        this.scene.tweens.add({
          targets: this.sprite,
          y: this.sprite.y + 200,
          angle: this.sprite.angle + 180,
          alpha: 0,
          scaleX: 0.5,
          scaleY: 0.5,
          duration: 500,
          ease: 'Quad.easeIn',
        });
      },
    });
  }

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  destroy() {
    if (this.flashTween) {
      this.flashTween.stop();
    }
    
    // Clean up weapon event listeners
    eventBus.off(Events.TRIPLE_SHOT_START, this.onTripleShotStart, this);
    eventBus.off(Events.TRIPLE_SHOT_END, this.onTripleShotEnd, this);
    eventBus.off(Events.HEAVY_METAL_START, this.onHeavyMetalStart, this);
    eventBus.off(Events.HEAVY_METAL_END, this.onHeavyMetalEnd, this);
    eventBus.off(Events.MISSILE_LAUNCHER_START, this.onMissileLauncherStart, this);
    eventBus.off(Events.MISSILE_LAUNCHER_END, this.onMissileLauncherEnd, this);
    eventBus.off(Events.GRENADE_LAUNCHER_START, this.onGrenadeLauncherStart, this);
    eventBus.off(Events.GRENADE_LAUNCHER_END, this.onGrenadeLauncherEnd, this);
    
    this.sprite.destroy();
  }
}
