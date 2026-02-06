/**
 * Clawmageddon 2 - Core Gameplay Tests
 * Tests: boot, scene flow, input, scoring, game over, restart
 */

import { test, expect } from '../fixtures/game-test.js';

test.describe('Game Boot & Scene Flow', () => {
  test('game boots and shows menu scene', async ({ gamePage }) => {
    // Verify game is booted
    const isBooted = await gamePage.evaluate(() => window.__GAME__?.isBooted);
    expect(isBooted).toBe(true);
    
    // Verify MenuScene is active
    const sceneKey = await gamePage.evaluate(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes[0]?.scene?.key;
    });
    expect(sceneKey).toBe('MenuScene');
    
    // Verify game not started yet
    const started = await gamePage.evaluate(() => window.__GAME_STATE__?.started);
    expect(started).toBe(false);
  });

  test('tap/space starts game and transitions to GameScene', async ({ gamePage }) => {
    // Start game with space
    await gamePage.keyboard.press('Space');
    
    // Wait for GameScene to become active
    await gamePage.waitForFunction(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'GameScene');
    }, { timeout: 5000 });
    
    // Verify game state started
    const started = await gamePage.evaluate(() => window.__GAME_STATE__?.started);
    expect(started).toBe(true);
  });

  test('UIScene launches alongside GameScene', async ({ gamePage }) => {
    await gamePage.keyboard.press('Space');
    
    await gamePage.waitForFunction(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'UIScene');
    }, { timeout: 5000 });
    
    const hasUIScene = await gamePage.evaluate(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'UIScene');
    });
    expect(hasUIScene).toBe(true);
  });
});

test.describe('Player Input - Jump + Shoot', () => {
  test('player jumps on space press', async ({ gamePage }) => {
    // Start game
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    await gamePage.waitForTimeout(200); // Let player settle
    
    // Get player position before jump
    const yBefore = await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      return scene.lobster?.sprite?.y;
    });
    expect(yBefore).toBeDefined();
    
    // Press space to jump
    await gamePage.keyboard.press('Space');
    await gamePage.waitForTimeout(150);
    
    // Player should have moved up (lower y value)
    const yAfter = await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      return scene.lobster?.sprite?.y;
    });
    
    expect(yAfter).toBeLessThan(yBefore);
  });

  test('player shoots on space press (projectile spawned)', async ({ gamePage }) => {
    // Start game
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    await gamePage.waitForTimeout(100);
    
    // Get initial projectile count
    const countBefore = await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      return scene.projectilePool?.getActiveProjectiles()?.length || 0;
    });
    
    // Press space (jump + shoot)
    await gamePage.keyboard.press('Space');
    await gamePage.waitForTimeout(100);
    
    // Should have more active projectiles
    const countAfter = await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      return scene.projectilePool?.getActiveProjectiles()?.length || 0;
    });
    
    expect(countAfter).toBeGreaterThan(countBefore);
  });

  test('double jump is allowed', async ({ gamePage }) => {
    // Start game
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    await gamePage.waitForTimeout(200);
    
    // First jump
    await gamePage.keyboard.press('Space');
    await gamePage.waitForTimeout(100);
    
    const yAfterFirstJump = await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      return scene.lobster?.sprite?.y;
    });
    
    // Second jump (while in air)
    await gamePage.keyboard.press('Space');
    await gamePage.waitForTimeout(100);
    
    const yAfterDoubleJump = await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      return scene.lobster?.sprite?.y;
    });
    
    // Should have gone even higher (lower y)
    expect(yAfterDoubleJump).toBeLessThan(yAfterFirstJump);
  });

  test('touch input works for jump/shoot', async ({ gamePage }) => {
    // Start game with tap
    const canvas = gamePage.locator('canvas');
    await canvas.tap();
    
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    await gamePage.waitForTimeout(200);
    
    const yBefore = await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      return scene.lobster?.sprite?.y;
    });
    
    // Tap to jump
    await canvas.tap();
    await gamePage.waitForTimeout(150);
    
    const yAfter = await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      return scene.lobster?.sprite?.y;
    });
    
    expect(yAfter).toBeLessThan(yBefore);
  });
});

test.describe('Scoring System', () => {
  test('score increases over time (distance-based)', async ({ gamePage }) => {
    // Start game
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    
    const initialScore = await gamePage.evaluate(() => window.__GAME_STATE__?.score);
    expect(initialScore).toBe(0);
    
    // Wait for distance-based scoring to accumulate
    await gamePage.waitForFunction(
      () => window.__GAME_STATE__.score > 0,
      { timeout: 5000 }
    );
    
    const newScore = await gamePage.evaluate(() => window.__GAME_STATE__?.score);
    expect(newScore).toBeGreaterThan(0);
  });

  test('distanceTraveled increases during gameplay', async ({ gamePage }) => {
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    
    await gamePage.waitForTimeout(1000);
    
    const distance = await gamePage.evaluate(() => window.__GAME_STATE__?.distanceTraveled);
    expect(distance).toBeGreaterThan(0);
  });
});

test.describe('Health & Game Over', () => {
  test('player starts with 3 hearts', async ({ gamePage }) => {
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    
    const hearts = await gamePage.evaluate(() => window.__GAME_STATE__?.currentHearts);
    expect(hearts).toBe(3);
  });

  test('game over triggers when hearts depleted', async ({ gamePage }) => {
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Force game over by depleting health
    await gamePage.evaluate(() => {
      // Drain all hearts (3 hearts × 2 hits = 6 damage)
      for (let i = 0; i < 6; i++) {
        window.__GAME_STATE__.takeDamage(1);
      }
      // Trigger player died event
      window.__EVENT_BUS__.emit(window.__EVENTS__.PLAYER_DIED);
    });
    
    // Wait for game over state
    await gamePage.waitForFunction(
      () => window.__GAME_STATE__.gameOver === true,
      { timeout: 5000 }
    );
    
    const gameOver = await gamePage.evaluate(() => window.__GAME_STATE__?.gameOver);
    expect(gameOver).toBe(true);
  });

  test('game over scene appears after death', async ({ gamePage }) => {
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Force instant death
    await gamePage.evaluate(() => {
      window.__GAME_STATE__.currentHearts = 0;
      window.__GAME_STATE__.currentHits = 0;
      window.__GAME_STATE__.gameOver = true;
      window.__EVENT_BUS__.emit(window.__EVENTS__.GAME_OVER, { score: window.__GAME_STATE__.score });
      window.__EVENT_BUS__.emit(window.__EVENTS__.PLAYER_DIED);
    });
    
    // Wait for GameOverScene
    await gamePage.waitForFunction(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'GameOverScene');
    }, { timeout: 10000 });
    
    const hasGameOver = await gamePage.evaluate(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'GameOverScene');
    });
    expect(hasGameOver).toBe(true);
  });
});

test.describe('Restart Flow', () => {
  test('restart from game over returns to gameplay', async ({ gamePage }) => {
    // Start and immediately force game over
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Trigger game over
    await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      if (scene && scene.triggerGameOver) {
        scene.triggerGameOver();
      }
    });
    
    // Wait for game over scene
    await gamePage.waitForFunction(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'GameOverScene');
    }, { timeout: 10000 });
    
    // Wait for scene to be interactable
    await gamePage.waitForTimeout(1000);
    
    // Tap to restart
    await gamePage.keyboard.press('Space');
    
    // Wait for GameScene to restart
    await gamePage.waitForFunction(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      const hasGame = scenes.some(s => s.scene.key === 'GameScene');
      const state = window.__GAME_STATE__;
      return hasGame && state.started && !state.gameOver;
    }, { timeout: 10000 });
    
    // Verify fresh game state
    const state = await gamePage.evaluate(() => ({
      started: window.__GAME_STATE__?.started,
      gameOver: window.__GAME_STATE__?.gameOver,
      score: window.__GAME_STATE__?.score,
      hearts: window.__GAME_STATE__?.currentHearts,
    }));
    
    expect(state.started).toBe(true);
    expect(state.gameOver).toBe(false);
    expect(state.score).toBe(0);
    expect(state.hearts).toBe(3);
  });
});
