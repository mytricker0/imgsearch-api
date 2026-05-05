# imgsearch-api

Scrape **direct image URLs** from Bing, DuckDuckGo, Yandex, and Google with one function call.

Returns links like `https://example.com/photo.jpg` — not thumbnails, not base64, not search pages.

```js
const { imageSearch, randomImage } = require("imgsearch-api");

const urls = await imageSearch("golden retriever", { n: 5 });
// → ["https://pexels.com/...", "https://...", ...]

const url = await randomImage("sunset");
// → "https://upload.wikimedia.org/..."
```

---

## Install

```bash
npm install imgsearch-api
```

> **First run only:** the package downloads a headless browser (~150 MB) automatically on first launch. This is a one-time setup.

---

## Usage

### `imageSearch(query, options?)`

Search multiple engines and return direct image URLs.

```js
const { imageSearch } = require("imgsearch-api");

// Default: Bing first, DDG fills the rest
const urls = await imageSearch("cat");

// Specific number of results
const urls = await imageSearch("mountain landscape", { n: 20 });

// Pick engines
const urls = await imageSearch("dog", { engines: ["bing"], n: 5 });
const urls = await imageSearch("dog", { engines: ["bing", "ddg"], n: 10 });
```

**Parameters**

| Param | Type | Default | Description |
|---|---|---|---|
| `query` | `string` | required | Search term |
| `options.engines` | `string[]` | `["bing","ddg"]` | Engines in priority order |
| `options.n` | `number` | `10` | Max URLs to return |

**Returns** `Promise<string[]>` — direct image URLs

---

### `randomImage(query, options?)`

Get one random image URL for a search query.

```js
const { randomImage } = require("imgsearch-api");

const url = await randomImage("abstract art");
console.log(url); // "https://..."
```

**Parameters**

| Param | Type | Default | Description |
|---|---|---|---|
| `query` | `string` | required | Search term |
| `options.engines` | `string[]` | `["bing","ddg"]` | Engines to query |

**Returns** `Promise<string | null>`

---

### `closeBrowser()`

Shut down the browser instance when you're done. Call this before your process exits.

```js
const { imageSearch, closeBrowser } = require("imgsearch-api");

const urls = await imageSearch("forest");
console.log(urls);

await closeBrowser(); // clean exit
```

---

## Engines

| Key | Source | Quality | Notes |
|---|---|---|---|
| `"bing"` | Bing Images | ⭐⭐⭐ Full-size originals | Recommended |
| `"ddg"` | DuckDuckGo | ⭐⭐ Bing CDN thumbnails | Reliable |
| `"yandex"` | Yandex Images | ⭐⭐⭐ Full-size originals | May be geo-blocked |
| `"google"` | Google Images | ⭐⭐⭐ Full-size originals | Needs proxy on most IPs |

---

## Full example

```js
const { imageSearch, randomImage, closeBrowser } = require("imgsearch-api");

async function main() {
  // Get 10 cat images from Bing
  const cats = await imageSearch("cat", { engines: ["bing"], n: 10 });
  console.log("Cats:", cats);

  // Random sunset image from any engine
  const sunset = await randomImage("sunset");
  console.log("Sunset:", sunset);

  await closeBrowser();
}

main();
```

---

## How it works

Uses a stealth headless browser ([playwright-extra](https://github.com/berstend/puppeteer-extra) + stealth plugin) to bypass bot detection and scrape image search results.

Image URLs are extracted from structured data in the page — never from base64 blobs or thumbnails:
- **Bing** → `murl` field in `a.iusc[m]` JSON attribute
- **DuckDuckGo** → real URL decoded from DDG CDN proxy `?u=` param
- **Yandex** → `img_href` in `data-bem` JSON attribute
- **Google** → `"ou":"..."` original URL field in embedded script data

The browser stays open between calls (singleton) so repeated searches are fast.

---

## Python version

Also available as a Python package: [imgsearch-api on PyPI](https://pypi.org/project/imgsearch-api)

```python
from imgapi import image_search, random_image

urls = image_search("cat", n=10)
url  = random_image("sunset")
```

---

## License

MIT
