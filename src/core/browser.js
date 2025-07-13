const { chromium } = require('playwright');
const config = require('./config');

async function launchBrowser() {
  const browser = await chromium.launch({
    headless: config.HEADLESS,
    slowMo: config.SLOW_MO
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  return { browser, page };
}

module.exports = { launchBrowser };