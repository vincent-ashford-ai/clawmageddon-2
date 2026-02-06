import { chromium, devices } from 'playwright';

const iPhone = devices['iPhone 13'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...iPhone,
  });
  
  const page = await context.newPage();
  
  // Collect console logs
  const logs = [];
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  // Start local server
  const { spawn } = await import('child_process');
  const server = spawn('npx', ['serve', 'dist', '-l', '5555'], { 
    cwd: '/home/damon/Projects/clawmageddon-2',
    stdio: 'pipe'
  });
  
  await new Promise(r => setTimeout(r, 2000)); // Wait for server
  
  console.log('Loading game from local build...');
  await page.goto('http://localhost:5555/clawmageddon-2/');
  await page.waitForTimeout(2000);
  
  console.log('\nTapping to start...');
  await page.tap('canvas');
  await page.waitForTimeout(3000);
  
  console.log('\n--- Audio Logs ---');
  logs.filter(l => l.includes('Audio') || l.includes('Strudel')).forEach(l => console.log(l));
  
  // Check for sample errors
  const sampleErrors = logs.filter(l => l.includes('sound') && l.includes('not found'));
  if (sampleErrors.length > 0) {
    console.log(`\n❌ ${sampleErrors.length} sample errors`);
  } else {
    console.log('\n✅ No sample errors!');
  }
  
  server.kill();
  await browser.close();
})();
