import { chromium, devices } from 'playwright';

const iPhone = devices['iPhone 13'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...iPhone,
    bypassCSP: true,
  });
  
  const page = await context.newPage();
  
  const logs = [];
  
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    logs.push(text);
  });
  
  console.log('Loading LOCAL game...');
  await page.goto('http://localhost:4173/clawmageddon-2/', {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(2000);
  
  console.log('Checking for issues BEFORE tap...');
  const preTapLogs = logs.slice();
  console.log('Pre-tap logs:', preTapLogs.length);
  
  // Check for Strudel loading before tap
  const strudelBeforeTap = preTapLogs.filter(l => l.toLowerCase().includes('strudel'));
  console.log('Strudel references before tap:', strudelBeforeTap.length);
  strudelBeforeTap.forEach(l => console.log('  ⚠️', l));
  
  // Check for AudioContext warnings before tap
  const audioContextBefore = preTapLogs.filter(l => 
    l.toLowerCase().includes('audiocontext')
  );
  console.log('AudioContext references before tap:', audioContextBefore.length);
  audioContextBefore.forEach(l => console.log('  ⚠️', l));
  
  console.log('\nTapping to start...');
  await page.tap('canvas');
  await page.waitForTimeout(4000);
  
  console.log('\n--- ALL Console Logs ---');
  logs.forEach(l => console.log(l));
  
  // Analysis
  const audioContextWarnings = logs.filter(l => 
    l.toLowerCase().includes('audiocontext') && 
    (l.toLowerCase().includes('not allowed') || l.toLowerCase().includes('autoplay'))
  );
  
  console.log(`\n${audioContextWarnings.length === 0 ? '✅' : '❌'} AudioContext warnings: ${audioContextWarnings.length}`);
  audioContextWarnings.forEach(l => console.log('  ⚠️', l));
  
  // Verify Strudel only loads AFTER tap
  const preTapStrudel = preTapLogs.filter(l => l.includes('strudel') || l.includes('Strudel'));
  console.log(`\n${preTapStrudel.length === 0 ? '✅' : '❌'} Strudel loaded before tap: ${preTapStrudel.length > 0}`);
  
  await browser.close();
  
  if (audioContextWarnings.length > 0 || strudelBeforeTap.length > 0) {
    console.log('\n❌ FAIL');
    process.exit(1);
  }
  
  console.log('\n✅ PASS: No premature audio loading');
})();
