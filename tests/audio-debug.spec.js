import { test, expect, devices } from '@playwright/test';

test.use(devices['iPhone 13']);

test('mobile audio unlock debug', async ({ page }) => {
  const logs = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Audio') || text.includes('Strudel') || text.includes('unlock')) {
      logs.push(`[${msg.type()}] ${text}`);
      console.log(`[${msg.type()}] ${text}`);
    }
  });
  
  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
  });

  await page.goto('/');
  await page.waitForTimeout(500);
  
  console.log('--- Before any interaction ---');
  
  // Tap on canvas
  await page.click('canvas');
  await page.waitForTimeout(1500);
  
  console.log('--- After tap ---');
  
  // Try to detect if audio is playing
  const audioState = await page.evaluate(() => {
    const results = [];
    
    // Check for AudioContext
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      results.push('AudioContext available');
    }
    
    // Check for any playing audio elements
    const audios = document.querySelectorAll('audio');
    results.push(`Audio elements: ${audios.length}`);
    
    // Check if Strudel is loaded
    if (window.strudel) {
      results.push('Strudel global found');
    }
    
    return results.join(', ');
  });
  
  console.log('Audio state:', audioState);
  
  expect(logs.some(l => l.includes('unlocked') || l.includes('initialized'))).toBe(true);
});
