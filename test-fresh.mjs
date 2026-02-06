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
  const warnings = [];
  const errors = [];
  
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    logs.push(text);
    if (msg.type() === 'warning') warnings.push(msg.text());
    if (msg.type() === 'error') errors.push(msg.text());
  });
  
  console.log('Loading game (cache bust: ' + cacheBust + ')...');
  // Add cache bust query param
  await page.goto('https://vincent-ashford-ai.github.io/clawmageddon-2/?v=' + cacheBust, {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(2000);
  
  console.log('Checking for AudioContext warnings BEFORE tap...');
  const audioContextWarningsBefore = logs.filter(l => 
    l.toLowerCase().includes('audiocontext') ||
    l.toLowerCase().includes('autoplay') ||
    l.toLowerCase().includes('user gesture')
  );
  console.log('Pre-tap AudioContext related logs:', audioContextWarningsBefore.length);
  audioContextWarningsBefore.forEach(l => console.log('  ', l));
  
  console.log('\nTapping to start...');
  await page.tap('canvas');
  await page.waitForTimeout(4000);
  
  console.log('\n--- ALL Console Logs ---');
  logs.forEach(l => console.log(l));
  
  console.log('\n--- Analysis ---');
  
  // Check for AudioContext warnings
  const audioContextWarnings = logs.filter(l => 
    l.toLowerCase().includes('audiocontext') && 
    (l.toLowerCase().includes('not allowed') || l.toLowerCase().includes('autoplay'))
  );
  
  console.log(`\n${audioContextWarnings.length === 0 ? '✅' : '❌'} AudioContext warnings: ${audioContextWarnings.length}`);
  audioContextWarnings.forEach(l => console.log('  ⚠️', l));
  
  // Check for Audio related logs
  console.log('\n--- Audio-related Logs ---');
  const audioLogs = logs.filter(l => 
    l.includes('Audio') || 
    l.includes('Strudel') || 
    l.includes('sound') ||
    l.toLowerCase().includes('audiocontext')
  );
  audioLogs.forEach(l => console.log(l));
  
  const sampleErrors = logs.filter(l => l.includes('sound') && l.includes('not found'));
  console.log(`\n${sampleErrors.length === 0 ? '✅' : '❌'} Sample errors: ${sampleErrors.length}`);
  
  console.log(`\n${warnings.length === 0 ? '✅' : '⚠️'} Total warnings: ${warnings.length}`);
  console.log(`${errors.length === 0 ? '✅' : '❌'} Total errors: ${errors.length}`);
  
  await browser.close();
  
  // Exit with error if AudioContext warnings found
  if (audioContextWarnings.length > 0) {
    console.log('\n❌ FAIL: AudioContext warnings detected!');
    process.exit(1);
  }
  
  console.log('\n✅ PASS: No AudioContext warnings');
})();
