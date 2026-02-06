import { chromium, devices } from 'playwright';

const iPhone = devices['iPhone 13'];
const cacheBust = Date.now();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...iPhone,
    bypassCSP: true,
  });
  
  await context.clearCookies();
  const page = await context.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  
  console.log('Loading game (cache bust: ' + cacheBust + ')...');
  await page.goto('https://vincent-ashford-ai.github.io/clawmageddon-2/?v=' + cacheBust, {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(2000);
  
  console.log('\n--- ALL Console logs BEFORE tap ---');
  logs.forEach(l => console.log(l));
  
  const beforeTapWarnings = logs.filter(l => l.toLowerCase().includes('audiocontext'));
  console.log(`\n⚠️ AudioContext mentions before tap: ${beforeTapWarnings.length}`);
  beforeTapWarnings.forEach(l => console.log('  ' + l));
  
  console.log('\n--- Tapping to start ---');
  await page.tap('canvas');
  await page.waitForTimeout(4000);
  
  console.log('\n--- ALL Console logs AFTER tap ---');
  const afterTapLogs = logs.slice();
  afterTapLogs.forEach(l => console.log(l));
  
  // Check specifically for the warning
  const warnings = logs.filter(l => l.includes('AudioContext was not allowed to start'));
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🔍 "AudioContext was not allowed to start" warnings: ${warnings.length}`);
  if (warnings.length > 0) {
    console.log('❌ FAILED - warnings found:');
    warnings.forEach(l => console.log('  ' + l));
  } else {
    console.log('✅ PASSED - no AudioContext warnings!');
  }
  
  await browser.close();
})();
