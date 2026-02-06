/**
 * Clawmageddon 2 - Performance Tests
 * Tests: load time, FPS, memory usage
 */

import { test, expect } from '@playwright/test';

test.describe('Performance - Load Time', () => {
  test('game loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    
    await page.goto('/');
    
    // Wait for Phaser to boot
    await page.waitForFunction(() => {
      const g = window.__GAME__;
      return g && g.isBooted && g.canvas;
    }, { timeout: 10000 });
    
    const loadTime = Date.now() - start;
    
    console.log(`Game load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });

  test('game loads within 3 seconds (strict)', async ({ page }) => {
    const start = Date.now();
    
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(3000);
  });
});

test.describe('Performance - FPS', () => {
  test('game maintains 30+ FPS during gameplay', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    // Start game
    await page.keyboard.press('Space');
    await page.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Keep player alive with periodic taps
    const keepAlive = setInterval(async () => {
      try {
        await page.keyboard.press('Space');
      } catch (e) {
        // Page might have closed
      }
    }, 400);
    
    // Measure FPS over 2 seconds
    const avgFps = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        const start = performance.now();
        
        function countFrame() {
          frames++;
          if (performance.now() - start < 2000) {
            requestAnimationFrame(countFrame);
          } else {
            const duration = (performance.now() - start) / 1000;
            resolve(frames / duration);
          }
        }
        
        requestAnimationFrame(countFrame);
      });
    });
    
    clearInterval(keepAlive);
    
    console.log(`Average FPS: ${avgFps.toFixed(1)}`);
    expect(avgFps).toBeGreaterThan(30);
  });

  test('FPS stays above 50 for smooth gameplay', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    await page.keyboard.press('Space');
    await page.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Measure FPS
    const avgFps = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        const start = performance.now();
        
        function countFrame() {
          frames++;
          if (performance.now() - start < 1500) {
            requestAnimationFrame(countFrame);
          } else {
            resolve(frames / ((performance.now() - start) / 1000));
          }
        }
        
        requestAnimationFrame(countFrame);
      });
    });
    
    console.log(`Smooth FPS target: ${avgFps.toFixed(1)}`);
    expect(avgFps).toBeGreaterThan(50);
  });
});

test.describe('Performance - Memory', () => {
  test('no significant memory growth over 10 seconds', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    // Start game
    await page.keyboard.press('Space');
    await page.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Get initial memory (if available)
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return null;
    });
    
    if (initialMemory === null) {
      console.log('Memory API not available (non-Chrome or disabled)');
      test.skip();
      return;
    }
    
    // Keep playing with continuous input
    const playInterval = setInterval(async () => {
      try {
        await page.keyboard.press('Space');
      } catch (e) {}
    }, 300);
    
    // Wait 10 seconds
    await page.waitForTimeout(10000);
    
    clearInterval(playInterval);
    
    // Get final memory
    const finalMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return null;
    });
    
    const memoryGrowthMB = (finalMemory - initialMemory) / (1024 * 1024);
    console.log(`Memory growth: ${memoryGrowthMB.toFixed(2)} MB`);
    
    // Allow up to 50MB growth (generous for 10s of gameplay)
    expect(memoryGrowthMB).toBeLessThan(50);
  });

  test('object pools are being reused', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    await page.keyboard.press('Space');
    await page.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Fire many projectiles
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(100);
    }
    
    // Check that projectile pool exists and has reasonable size
    const poolInfo = await page.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('GameScene');
      const pool = scene?.projectilePool;
      if (!pool) return null;
      return {
        hasPool: true,
        activeCount: pool.getActiveProjectiles?.()?.length || 0,
      };
    });
    
    expect(poolInfo).not.toBeNull();
    expect(poolInfo.hasPool).toBe(true);
    // Active projectiles should be reasonable (pool reuse working)
    expect(poolInfo.activeCount).toBeLessThan(50);
  });
});

test.describe('Performance - Extended Play', () => {
  test('game remains stable after 30 seconds of play', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__GAME__?.isBooted);
    
    await page.keyboard.press('Space');
    await page.waitForFunction(() => window.__GAME_STATE__?.started);
    
    // Play for 30 seconds with input
    const startTime = Date.now();
    while (Date.now() - startTime < 30000) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(250);
      
      // Check game is still running
      const state = await page.evaluate(() => ({
        started: window.__GAME_STATE__?.started,
        gameOver: window.__GAME_STATE__?.gameOver,
      }));
      
      // If game over, restart
      if (state.gameOver) {
        await page.waitForTimeout(1500);
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);
      }
    }
    
    // Verify game is still responsive
    const isResponsive = await page.evaluate(() => {
      return window.__GAME__?.isBooted && !window.__GAME__?.isRunning === false;
    });
    
    expect(isResponsive).toBe(true);
  });
});
