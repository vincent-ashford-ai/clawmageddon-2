// =============================================================================
// CLAWMAGEDDON 2 - GAME STATE
// Centralized state with reset() for clean restarts.
// =============================================================================

import { PLAYER, PROJECTILE, POWERUPS, SCORING } from './Constants.js';
import { eventBus, Events } from './EventBus.js';

class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    // Game flow
    this.started = false;
    this.paused = false;
    this.gameOver = false;

    // Scoring
    this.score = 0;
    this.distanceTraveled = 0; // In "meters"

    // Health (hearts system)
    this.maxHearts = PLAYER.STARTING_HEARTS;
    this.currentHearts = PLAYER.STARTING_HEARTS;
    this.currentHits = PLAYER.HITS_PER_HEART; // Hits remaining on current heart
    this.isInvulnerable = false;

    // Power-ups
    this.hasTripleShot = false;
    this.tripleAmmo = 0;
    this.hasHeavyMetal = false;
    this.heavyMetalAmmo = 0;
    this.hasMissileLauncher = false;
    this.missileAmmo = 0;
    this.hasGrenadeLauncher = false;
    this.grenadeAmmo = 0;

    // Stats
    this.enemiesKilled = 0;

    // Difficulty
    this.difficultyLevel = 1;
    this.timeElapsed = 0;
  }

  // ----- Score Methods -----
  addScore(points) {
    this.score += points;
    eventBus.emit(Events.SCORE_CHANGED, { score: this.score });
  }

  addDistanceScore(pixels) {
    const meters = pixels * SCORING.METERS_PER_PIXEL;
    this.distanceTraveled += meters;
    this.addScore(Math.floor(meters * SCORING.POINTS_PER_METER));
  }

  addKillScore() {
    this.enemiesKilled++;
    this.addScore(SCORING.POINTS_PER_KILL);
  }

  // ----- Health Methods -----
  takeDamage(hits = 1) {
    if (this.isInvulnerable || this.gameOver) return false;

    this.currentHits -= hits;
    
    // If current heart is depleted
    while (this.currentHits <= 0 && this.currentHearts > 0) {
      this.currentHearts--;
      if (this.currentHearts > 0) {
        this.currentHits += PLAYER.HITS_PER_HEART;
      }
    }

    eventBus.emit(Events.HEARTS_CHANGED, {
      currentHearts: this.currentHearts,
      maxHearts: this.maxHearts,
      currentHits: this.currentHits,
    });

    // Check for death
    if (this.currentHearts <= 0) {
      this.currentHits = 0;
      return true; // Player died
    }

    return false; // Player survived
  }

  restoreFullHealth() {
    this.currentHearts = this.maxHearts;
    this.currentHits = PLAYER.HITS_PER_HEART;
    eventBus.emit(Events.HEALTH_RESTORED);
    eventBus.emit(Events.HEARTS_CHANGED, {
      currentHearts: this.currentHearts,
      maxHearts: this.maxHearts,
      currentHits: this.currentHits,
    });
  }

  addExtraHeart() {
    if (this.maxHearts >= PLAYER.MAX_HEARTS) return false;
    
    this.maxHearts++;
    // Add one full heart (don't fill all hearts to max)
    this.currentHearts++;
    this.currentHits = PLAYER.HITS_PER_HEART;
    
    eventBus.emit(Events.EXTRA_HEART_GAINED);
    eventBus.emit(Events.HEARTS_CHANGED, {
      currentHearts: this.currentHearts,
      maxHearts: this.maxHearts,
      currentHits: this.currentHits,
    });
    return true;
  }

  setInvulnerable(value) {
    this.isInvulnerable = value;
    if (value) {
      eventBus.emit(Events.PLAYER_INVULNERABLE_START);
    } else {
      eventBus.emit(Events.PLAYER_INVULNERABLE_END);
    }
  }

  // ----- Power-up Methods -----
  activateTripleShot() {
    // Drop other weapons if active (weapons don't stack)
    if (this.hasHeavyMetal) {
      this.hasHeavyMetal = false;
      this.heavyMetalAmmo = 0;
      eventBus.emit(Events.HEAVY_METAL_END);
    }
    if (this.hasMissileLauncher) {
      this.hasMissileLauncher = false;
      this.missileAmmo = 0;
      eventBus.emit(Events.MISSILE_LAUNCHER_END);
    }
    if (this.hasGrenadeLauncher) {
      this.hasGrenadeLauncher = false;
      this.grenadeAmmo = 0;
      eventBus.emit(Events.GRENADE_LAUNCHER_END);
    }
    
    this.hasTripleShot = true;
    this.tripleAmmo = PROJECTILE.TRIPLE_AMMO;
    eventBus.emit(Events.TRIPLE_SHOT_START, { ammo: this.tripleAmmo });
  }

  useTripleAmmo() {
    if (!this.hasTripleShot) return;
    
    this.tripleAmmo--;
    if (this.tripleAmmo <= 0) {
      this.hasTripleShot = false;
      eventBus.emit(Events.TRIPLE_SHOT_END);
    }
  }

  activateHeavyMetal() {
    // Drop other weapons if active (weapons don't stack)
    if (this.hasTripleShot) {
      this.hasTripleShot = false;
      this.tripleAmmo = 0;
      eventBus.emit(Events.TRIPLE_SHOT_END);
    }
    if (this.hasMissileLauncher) {
      this.hasMissileLauncher = false;
      this.missileAmmo = 0;
      eventBus.emit(Events.MISSILE_LAUNCHER_END);
    }
    if (this.hasGrenadeLauncher) {
      this.hasGrenadeLauncher = false;
      this.grenadeAmmo = 0;
      eventBus.emit(Events.GRENADE_LAUNCHER_END);
    }
    
    this.hasHeavyMetal = true;
    this.heavyMetalAmmo = POWERUPS.HEAVY_METAL.AMMO;
    eventBus.emit(Events.HEAVY_METAL_START, { ammo: this.heavyMetalAmmo });
  }

  useHeavyMetalAmmo() {
    if (!this.hasHeavyMetal) return;
    
    // Each burst uses 3 ammo (triple shot)
    this.heavyMetalAmmo -= 3;
    if (this.heavyMetalAmmo <= 0) {
      this.heavyMetalAmmo = 0;
      this.hasHeavyMetal = false;
      eventBus.emit(Events.HEAVY_METAL_END);
    }
  }

  activateMissileLauncher() {
    // Drop other weapons (weapons don't stack)
    if (this.hasTripleShot) {
      this.hasTripleShot = false;
      this.tripleAmmo = 0;
      eventBus.emit(Events.TRIPLE_SHOT_END);
    }
    if (this.hasHeavyMetal) {
      this.hasHeavyMetal = false;
      this.heavyMetalAmmo = 0;
      eventBus.emit(Events.HEAVY_METAL_END);
    }
    if (this.hasGrenadeLauncher) {
      this.hasGrenadeLauncher = false;
      this.grenadeAmmo = 0;
      eventBus.emit(Events.GRENADE_LAUNCHER_END);
    }
    
    this.hasMissileLauncher = true;
    this.missileAmmo = POWERUPS.MISSILE_LAUNCHER.AMMO;
    eventBus.emit(Events.MISSILE_LAUNCHER_START, { ammo: this.missileAmmo });
  }

  useMissileAmmo() {
    if (!this.hasMissileLauncher) return;
    
    this.missileAmmo--;
    if (this.missileAmmo <= 0) {
      this.missileAmmo = 0;
      this.hasMissileLauncher = false;
      eventBus.emit(Events.MISSILE_LAUNCHER_END);
    }
  }

  activateGrenadeLauncher() {
    // Drop other weapons (weapons don't stack)
    if (this.hasTripleShot) {
      this.hasTripleShot = false;
      this.tripleAmmo = 0;
      eventBus.emit(Events.TRIPLE_SHOT_END);
    }
    if (this.hasHeavyMetal) {
      this.hasHeavyMetal = false;
      this.heavyMetalAmmo = 0;
      eventBus.emit(Events.HEAVY_METAL_END);
    }
    if (this.hasMissileLauncher) {
      this.hasMissileLauncher = false;
      this.missileAmmo = 0;
      eventBus.emit(Events.MISSILE_LAUNCHER_END);
    }
    
    this.hasGrenadeLauncher = true;
    this.grenadeAmmo = POWERUPS.GRENADE_LAUNCHER.AMMO;
    eventBus.emit(Events.GRENADE_LAUNCHER_START, { ammo: this.grenadeAmmo });
  }

  useGrenadeAmmo() {
    if (!this.hasGrenadeLauncher) return;
    
    this.grenadeAmmo--;
    if (this.grenadeAmmo <= 0) {
      this.grenadeAmmo = 0;
      this.hasGrenadeLauncher = false;
      eventBus.emit(Events.GRENADE_LAUNCHER_END);
    }
  }

  // ----- Difficulty -----
  increaseDifficulty() {
    this.difficultyLevel++;
  }

  getDifficultyMultiplier() {
    return 1 + (this.difficultyLevel - 1) * 0.15;
  }
}

export const gameState = new GameState();
