const { getBrowser } = require("../_browser");

async function fetchGoogle(query, n = 10) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(
      `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`,
      { waitUntil: "networkidle" }
    );
    if (page.url().includes("sorry")) return [];
    const html = await page.content();
    const matches = [...html.matchAll(/"ou"\s*:\s*"(https?:\/\/[^"\\]+)"/g)];
    const seen = new Set();
    const urls = [];
    for (const [, url] of matches) {
      if (!seen.has(url)) {
        seen.add(url);
        urls.push(url);
        if (urls.length >= n) break;
      }
    }
    return urls;
  } finally {
    await page.close();
  }
}

module.exports = { fetchGoogle };
