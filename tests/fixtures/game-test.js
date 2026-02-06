import { test as base, expect } from '@playwright/test';

/**
 * Custom test fixture for Clawmageddon 2
 * Provides gamePage with Phaser boot verification
 */
export const test = base.extend({
  gamePage: async ({ page }, use) => {
    // Seed random for deterministic behavior
    await page.addInitScript({ path: './tests/helpers/seed-random.js' });
    
    await page.goto('/');
    
    // Wait for Phaser to boot and canvas to render
    await page.waitForFunction(() => {
      const g = window.__GAME__;
      return g && g.isBooted && g.canvas;
    }, { timeout: 15000 });
    
    // Wait a tick for MenuScene to initialize
    await page.waitForTimeout(500);
    
    await use(page);
  },
});

export { expect };
