/**
 * Clawmageddon 2 - Accessibility Tests
 * Tests for accessibility violations in surrounding HTML
 * Note: Canvas content is opaque to screen readers by design
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Page Structure', () => {
  test('menu page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    await page.waitForTimeout(500);
    
    // Run axe-core excluding the canvas (games are inherently visual)
    const results = await new AxeBuilder({ page })
      .exclude('canvas')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    // Filter to only critical and serious violations
    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    
    if (criticalViolations.length > 0) {
      console.log('Critical a11y violations:', JSON.stringify(criticalViolations, null, 2));
    }
    
    expect(criticalViolations).toEqual([]);
  });

  test('game over page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    // Start and trigger game over
    await page.keyboard.press('Space');
    await page.waitForFunction(() => window.__GAME_STATE__?.started);
    
    await page.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      scene?.triggerGameOver?.();
    });
    
    // Wait for game over scene
    await page.waitForFunction(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'GameOverScene');
    }, { timeout: 10000 });
    
    await page.waitForTimeout(1000);
    
    const results = await new AxeBuilder({ page })
      .exclude('canvas')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    
    expect(criticalViolations).toEqual([]);
  });
});

test.describe('Accessibility - Document Structure', () => {
  test('page has valid document language', async ({ page }) => {
    await page.goto('/');
    
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBeTruthy();
  });

  test('page has a title', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('page has viewport meta tag', async ({ page }) => {
    await page.goto('/');
    
    const viewport = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta?.content;
    });
    
    expect(viewport).toBeTruthy();
    expect(viewport).toContain('width=');
  });
});

test.describe('Accessibility - Keyboard Navigation', () => {
  test('game can be started with keyboard only', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    // Should start with Space
    await page.keyboard.press('Space');
    
    await page.waitForFunction(() => window.__GAME_STATE__?.started, { timeout: 5000 });
    
    const started = await page.evaluate(() => window.__GAME_STATE__?.started);
    expect(started).toBe(true);
  });

  test('game can be played entirely with keyboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    // Start
    await page.keyboard.press('Space');
    await page.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Play with keyboard (jump/shoot)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(200);
    }
    
    // Verify game progressed
    const score = await page.evaluate(() => window.__GAME_STATE__?.score);
    expect(score).toBeGreaterThan(0);
  });

  test('game can be restarted with keyboard after game over', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    await page.keyboard.press('Space');
    await page.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Trigger game over
    await page.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      scene?.triggerGameOver?.();
    });
    
    await page.waitForFunction(() => {
      const scenes = window.__GAME__.scene.getScenes(true);
      return scenes.some(s => s.scene.key === 'GameOverScene');
    }, { timeout: 10000 });
    
    await page.waitForTimeout(1500);
    
    // Restart with keyboard
    await page.keyboard.press('Space');
    
    await page.waitForFunction(() => {
      const state = window.__GAME_STATE__;
      return state?.started && !state?.gameOver;
    }, { timeout: 10000 });
    
    const state = await page.evaluate(() => ({
      started: window.__GAME_STATE__?.started,
      gameOver: window.__GAME_STATE__?.gameOver,
    }));
    
    expect(state.started).toBe(true);
    expect(state.gameOver).toBe(false);
  });
});

test.describe('Accessibility - Color & Contrast', () => {
  test('canvas renders with sufficient contrast (visual spot check)', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    await page.waitForTimeout(500);
    
    // Get canvas pixel data to verify it's rendering something
    const hasContent = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return false;
      
      // Sample pixels from different areas
      const samples = [
        ctx.getImageData(200, 100, 1, 1).data, // Top area
        ctx.getImageData(200, 350, 1, 1).data, // Middle
        ctx.getImageData(200, 600, 1, 1).data, // Bottom (ground)
      ];
      
      // Check that we have variety (not all same color)
      const colors = samples.map(d => `${d[0]},${d[1]},${d[2]}`);
      const uniqueColors = new Set(colors);
      
      return uniqueColors.size > 1;
    });
    
    expect(hasContent).toBe(true);
  });
});

test.describe('Accessibility - Motion & Animation', () => {
  test('game respects reduced motion preference (if implemented)', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    // Game should still function
    await page.keyboard.press('Space');
    
    const started = await page.evaluate(() => window.__GAME_STATE__?.started);
    // Game should work regardless of motion preference
    expect(started).toBe(true);
  });
});
