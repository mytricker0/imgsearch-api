const { getBrowser } = require("../_browser");

async function fetchDDG(query, n = 10) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
      { waitUntil: "networkidle" }
    );
    return await page.$$eval(
      'img[src*="external-content.duckduckgo.com"]',
      (imgs, maxN) => {
        const urls = [];
        const seen = new Set();
        for (const img of imgs) {
          try {
            const src = img.getAttribute("src") || "";
            const fullSrc = src.startsWith("//") ? "https:" + src : src;
            const u = new URL(fullSrc).searchParams.get("u");
            if (u && u.startsWith("http") && !seen.has(u)) {
              seen.add(u);
              urls.push(u);
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

module.exports = { fetchDDG };
