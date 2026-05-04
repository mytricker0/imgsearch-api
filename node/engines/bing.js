const { getBrowser } = require("../_browser");

async function fetchBing(query, n = 10) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(
      `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`,
      { waitUntil: "domcontentloaded" }
    );
    return await page.$$eval(
      "a.iusc",
      (links, maxN) => {
        const urls = [];
        const seen = new Set();
        for (const link of links) {
          try {
            const m = JSON.parse(link.getAttribute("m") || "{}");
            if (m.murl && !seen.has(m.murl)) {
              seen.add(m.murl);
              urls.push(m.murl);
              if (urls.length >= maxN) break;
            }
          } catch {}
        }
        return urls;
      },
      n
    );
  } finally {
    await page.close();
  }
}

module.exports = { fetchBing };
