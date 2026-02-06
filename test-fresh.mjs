import { chromium, devices } from 'playwright';

const iPhone = devices['iPhone 13'];
const cacheBust = Date.now();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...iPhone,
    bypassCSP: true,
  });
  
  // Clear all storage/cache
  await context.clearCookies();
  
  const page = await context.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  
  console.log('Loading game (cache bust: ' + cacheBust + ')...');
  // Add cache bust query param
  await page.goto('https://vincent-ashford-ai.github.io/clawmageddon-2/?v=' + cacheBust, {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(2000);
  
  console.log('Tapping to start...');
  await page.tap('canvas');
  await page.waitForTimeout(4000);
  
  console.log('\n--- All Audio Logs ---');
  logs.filter(l => l.includes('Audio') || l.includes('Strudel') || l.includes('sound')).forEach(l => console.log(l));
  
  const sampleErrors = logs.filter(l => l.includes('sound') && l.includes('not found'));
  console.log(`\n${sampleErrors.length === 0 ? '✅' : '❌'} Sample errors: ${sampleErrors.length}`);
  
  await browser.close();
})();
