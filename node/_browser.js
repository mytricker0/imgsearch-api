const { chromium } = require("playwright-extra");
const stealth = require("puppeteer-extra-plugin-stealth");

chromium.use(stealth());

let _browser = null;

async function getBrowser() {
  if (!_browser) {
    // Use cached Chromium binary (shared with Python scrapling install)
    const { chromium: pw } = require("playwright");
    _browser = await chromium.launch({
      headless: true,
      executablePath: pw.executablePath(),
    });
  }
  return _browser;
}

async function closeBrowser() {
  if (_browser) {
    await _browser.close();
    _browser = null;
  }
}

process.on("exit", () => { if (_browser) _browser.close(); });

module.exports = { getBrowser, closeBrowser };
