// =============================================================================
// CLAWMAGEDDON 2 - EVENT BUS
// Singleton event bus for all cross-scene/system communication.
// Event names use domain:action format.
// =============================================================================

export const Events = {
  // Game lifecycle
  GAME_START: 'game:start',
  GAME_OVER: 'game:over',
  GAME_RESTART: 'game:restart',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',

  // Player actions
  PLAYER_JUMP: 'player:jump',
  PLAYER_DOUBLE_JUMP: 'player:doubleJump',
  PLAYER_SHOOT: 'player:shoot',
  PLAYER_DAMAGED: 'player:damaged',
  PLAYER_DIED: 'player:died',
  PLAYER_INVULNERABLE_START: 'player:invulnerableStart',
  PLAYER_INVULNERABLE_END: 'player:invulnerableEnd',

  // Combat
  ENEMY_SPAWNED: 'enemy:spawned',
  ENEMY_KILLED: 'enemy:killed',
  ENEMY_HIT: 'enemy:hit',
  PROJECTILE_FIRED: 'projectile:fired',
  ENEMY_PROJECTILE_FIRED: 'enemyProjectile:fired',
  NUKE_TRIGGERED: 'nuke:triggered',

  // Power-ups
  POWERUP_SPAWNED: 'powerup:spawned',
  POWERUP_COLLECTED: 'powerup:collected',
  TRIPLE_SHOT_START: 'tripleShot:start',
  TRIPLE_SHOT_END: 'tripleShot:end',
  HEAVY_METAL_START: 'heavyMetal:start',
  HEAVY_METAL_END: 'heavyMetal:end',
  MISSILE_LAUNCHER_START: 'missileLauncher:start',
  MISSILE_LAUNCHER_END: 'missileLauncher:end',
  GRENADE_LAUNCHER_START: 'grenadeLauncher:start',
  GRENADE_LAUNCHER_END: 'grenadeLauncher:end',
  GRENADE_EXPLODED: 'grenade:exploded',
  HEALTH_RESTORED: 'health:restored',
  EXTRA_HEART_GAINED: 'extraHeart:gained',

  // Health/Hearts
  HEARTS_CHANGED: 'hearts:changed',
  HITS_CHANGED: 'hits:changed',

  // Obstacles
  OBSTACLE_SPAWNED: 'obstacle:spawned',
  OBSTACLE_HIT: 'obstacle:hit',
  TOXIC_TRAIL_SPAWNED: 'toxic:trailSpawned',

  // Platforms
  PLATFORM_SPAWNED: 'platform:spawned',

  // Score
  SCORE_CHANGED: 'score:changed',
  DISTANCE_CHANGED: 'distance:changed',

  // Effects
  SCREEN_SHAKE: 'effect:screenShake',
  SCREEN_FLASH: 'effect:screenFlash',
  HIT_FREEZE: 'effect:hitFreeze',
  PARTICLES_EMIT: 'particles:emit',
  
  // Specific particle events
  PARTICLES_MUZZLE: 'particles:muzzle',
  PARTICLES_DEATH: 'particles:death',
  PARTICLES_DUST: 'particles:dust',
  PARTICLES_JUMP: 'particles:jump',
  PARTICLES_IMPACT: 'particles:impact',
  
  // Score popup
  SCORE_POPUP: 'ui:scorePopup',
  
  // Player states
  PLAYER_LANDED: 'player:landed',

  // Audio (used by audio system)
  AUDIO_INIT: 'audio:init',
  AUDIO_READY: 'audio:ready',
  MUSIC_MENU: 'music:menu',
  MUSIC_GAMEPLAY: 'music:gameplay',
  MUSIC_GAMEOVER: 'music:gameover',
  MUSIC_STOP: 'music:stop',
  SFX_PLAY: 'sfx:play',
};

// Simple EventBus implementation
class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback, context = null) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push({ callback, context });
    return this;
  }

  off(event, callback, context = null) {
    if (!this.listeners[event]) return this;
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener.callback !== callback || listener.context !== context
    );
    return this;
  }

  emit(event, data) {
    if (!this.listeners[event]) return this;
    this.listeners[event].forEach((listener) => {
      try {
        listener.callback.call(listener.context, data);
      } catch (err) {
        console.error(`EventBus error in ${event}:`, err);
      }
    });
    return this;
  }

  once(event, callback, context = null) {
    const wrapper = (data) => {
      this.off(event, wrapper, context);
      callback.call(context, data);
    };
    this.on(event, wrapper, context);
    return this;
  }

  removeAll() {
    this.listeners = {};
    return this;
  }
}

export const eventBus = new EventBus();
