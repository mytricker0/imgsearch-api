const { getBrowser } = require("../_browser");

async function fetchYandex(query, n = 10) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(
      `https://yandex.com/images/search?text=${encodeURIComponent(query)}`,
      { waitUntil: "domcontentloaded", timeout: 15000 }
    );
    await page.waitForSelector(".serp-item[data-bem]", { timeout: 10000 }).catch(() => {});
    return await page.$$eval(
      ".serp-item[data-bem]",
      (items, maxN) => {
        const urls = [];
        const seen = new Set();
        for (const item of items) {
          try {
            const bem = JSON.parse(item.getAttribute("data-bem") || "{}");
            const url = bem?.["serp-item"]?.img_href;
            if (url && !seen.has(url)) {
              seen.add(url);
              urls.push(url);
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

module.exports = { fetchYandex };
