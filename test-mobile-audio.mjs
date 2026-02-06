import { chromium, devices } from 'playwright';

const iPhone = devices['iPhone 13'];
const cacheBust = Date.now();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...iPhone,
    bypassCSP: true,
  });
  
  const page = await context.newPage();
  
  const logs = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    logs.push(`[${type}] ${text}`);
  });
  
  console.log('Loading game (cache bust: ' + cacheBust + ')...');
  await page.goto('https://vincent-ashford-ai.github.io/clawmageddon-2/?v=' + cacheBust, {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(2000);
  
  console.log('Tapping to start...');
  await page.tap('canvas');
  await page.waitForTimeout(5000);
  
  console.log('\n--- ALL Console Logs ---');
  logs.forEach(l => console.log(l));
  
  const audioContextWarning = logs.find(l => 
    l.toLowerCase().includes('audiocontext') && 
    (l.includes('not allowed') || l.includes('suspended') || l.includes('error'))
  );
  
  console.log('\n--- Summary ---');
  if (audioContextWarning) {
    console.log('❌ AudioContext Warning Found:', audioContextWarning);
  } else {
    console.log('✅ No AudioContext warnings!');
  }
  
  const audioUnlockSuccess = logs.some(l => l.includes('Audio unlocked successfully'));
  console.log(`Audio unlock: ${audioUnlockSuccess ? '✅' : '❌'}`);
  
  const strudelInit = logs.some(l => l.includes('Strudel initialized'));
  console.log(`Strudel init: ${strudelInit ? '✅' : '❌'}`);
  
  await browser.close();
})();
