const { fetchBing } = require("./engines/bing");
const { fetchDDG } = require("./engines/ddg");
const { fetchYandex } = require("./engines/yandex");
const { fetchGoogle } = require("./engines/google");
const { closeBrowser } = require("./_browser");

const ENGINES = {
  bing: fetchBing,
  ddg: fetchDDG,
  yandex: fetchYandex,
  google: fetchGoogle,
};

const DEFAULT_ENGINES = ["bing", "ddg"];

/**
 * Search for images and return direct image URLs.
 * @param {string} query - Search term
 * @param {Object} [options]
 * @param {string[]} [options.engines=["bing","ddg"]] - Engines to query in order
 * @param {number} [options.n=10] - Max number of URLs to return
 * @returns {Promise<string[]>} Direct image URLs
 */
async function imageSearch(query, { engines = DEFAULT_ENGINES, n = 10 } = {}) {
  const seen = new Set();
  const urls = [];

  for (const engine of engines) {
    const fn = ENGINES[engine];
    if (!fn) continue;
    try {
      for (const url of await fn(query, n)) {
        if (!seen.has(url)) {
          seen.add(url);
          urls.push(url);
        }
      }
    } catch {}
    if (urls.length >= n) break;
  }

  return urls.slice(0, n);
}

/**
 * Return a single random direct image URL for the query.
 * @param {string} query - Search term
 * @param {Object} [options]
 * @param {string[]} [options.engines=["bing","ddg"]] - Engines to query
 * @returns {Promise<string|null>} Direct image URL or null
 */
async function randomImage(query, { engines = DEFAULT_ENGINES } = {}) {
  const urls = await imageSearch(query, { engines, n: 20 });
  return urls.length ? urls[Math.floor(Math.random() * urls.length)] : null;
}

module.exports = { imageSearch, randomImage, closeBrowser };
