import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 700 } });
await page.goto('https://vincent-ashford-ai.github.io/clawmageddon-2/');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'game-screenshot.png' });
await browser.close();
console.log('Screenshot saved to game-screenshot.png');
