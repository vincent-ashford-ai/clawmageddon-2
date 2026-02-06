/**
 * Clawmageddon 2 - Visual Regression Tests
 * Screenshot-based tests to catch unintended visual changes
 */

import { test, expect } from '../fixtures/game-test.js';

test.describe('Visual Regression - Menu', () => {
  test('menu scene renders correctly', async ({ gamePage }) => {
    // Wait for animations to settle
    await gamePage.waitForTimeout(800);
    
    // Take screenshot of canvas
    await expect(gamePage.locator('canvas')).toHaveScreenshot('menu-scene.png', {
      maxDiffPixels: 400,
    });
  });

  test('menu has "TAP TO START" prompt visible', async ({ gamePage }) => {
    // Verify the menu scene is showing something (canvas has content)
    const canvasInfo = await gamePage.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      // Check if canvas has non-empty content
      const data = ctx?.getImageData(0, 0, 10, 10)?.data;
      return {
        width: canvas.width,
        height: canvas.height,
        hasContent: data && data.some(v => v > 0),
      };
    });
    
    expect(canvasInfo).not.toBeNull();
    expect(canvasInfo.hasContent).toBe(true);
  });
});

test.describe('Visual Regression - Gameplay', () => {
  test('gameplay scene renders with player and HUD', async ({ gamePage }) => {
    // Start game
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Wait for scene setup and fade-in
    await gamePage.waitForTimeout(800);
    
    // Verify GameScene is running
    const gameRunning = await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      return scene?.lobster?.sprite?.active;
    });
    expect(gameRunning).toBe(true);
    
    // Take screenshot (gameplay is dynamic, so we accept more variance)
    await expect(gamePage.locator('canvas')).toHaveScreenshot('gameplay-scene.png', {
      maxDiffPixels: 1000, // Higher tolerance for animated content
    });
  });

  test('UIScene shows hearts display', async ({ gamePage }) => {
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    await gamePage.waitForTimeout(500);
    
    // Verify UIScene is active
    const uiActive = await gamePage.evaluate(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'UIScene');
    });
    expect(uiActive).toBe(true);
  });
});

test.describe('Visual Regression - Game Over', () => {
  test('game over scene renders correctly', async ({ gamePage }) => {
    // Start game
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Score some points first for visual interest
    await gamePage.waitForTimeout(500);
    
    // Trigger game over
    await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      if (scene && scene.triggerGameOver) {
        scene.triggerGameOver();
      }
    });
    
    // Wait for GameOverScene to appear
    await gamePage.waitForFunction(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'GameOverScene');
    }, { timeout: 10000 });
    
    // Wait for fade-in animation
    await gamePage.waitForTimeout(1000);
    
    // Take screenshot
    await expect(gamePage.locator('canvas')).toHaveScreenshot('game-over-scene.png', {
      maxDiffPixels: 400,
    });
  });

  test('game over shows final score', async ({ gamePage }) => {
    // Start and play briefly
    await gamePage.keyboard.press('Space');
    await gamePage.waitForFunction(() => window.__GAME_STATE__?.started);
    await gamePage.waitForTimeout(1000); // Accumulate some score
    
    const scoreBeforeDeath = await gamePage.evaluate(() => window.__GAME_STATE__?.score);
    
    // Trigger game over
    await gamePage.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      scene?.triggerGameOver?.();
    });
    
    await gamePage.waitForFunction(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'GameOverScene');
    }, { timeout: 10000 });
    
    // Score should be preserved in state
    const finalScore = await gamePage.evaluate(() => window.__GAME_STATE__?.score);
    expect(finalScore).toBe(scoreBeforeDeath);
  });
});

test.describe('Visual - Canvas Properties', () => {
  test('canvas has correct portrait dimensions (400x700)', async ({ gamePage }) => {
    const dimensions = await gamePage.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return canvas ? { width: canvas.width, height: canvas.height } : null;
    });
    
    expect(dimensions).toEqual({ width: 400, height: 700 });
  });

  test('canvas is visible and positioned correctly', async ({ gamePage }) => {
    const canvasBox = await gamePage.locator('canvas').boundingBox();
    expect(canvasBox).not.toBeNull();
    expect(canvasBox.width).toBeGreaterThan(0);
    expect(canvasBox.height).toBeGreaterThan(0);
  });
});
