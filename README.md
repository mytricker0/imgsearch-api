# imgsearch-api

Scrape **direct image URLs** from Bing, DuckDuckGo, Yandex, and Google.
Returns links like `https://example.com/photo.jpg` — not thumbnails, not base64, not search pages.

---

## Install

### Python (pip)

```bash
pip install imgsearch-api
scrapling install   # one-time: downloads stealth browser (~200 MB)
```

### Node.js (npm)

```bash
npm install imgsearch-api
# browser is installed automatically via postinstall
```

---

## Python usage

### Import

```python
from imgsearch_api import image_search, random_image
```

---

### `image_search(query, engines=None, n=10)`

Search for images matching a query. Returns a list of direct image URLs.

**Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | `str` | required | Search term, e.g. `"golden retriever"` |
| `engines` | `list[str] \| None` | `["bing", "ddg"]` | Engines to query, in priority order |
| `n` | `int` | `10` | Maximum number of URLs to return |

**Returns** `list[str]` — direct image URLs, up to `n` items.

**Examples**

```python
from imgsearch_api import image_search

# Default: Bing first, DDG fills the rest
urls = image_search("sunset", n=10)

# Specific engine only
urls = image_search("cat", engines=["bing"], n=5)

# Multiple engines, tries each until n results collected
urls = image_search("dog", engines=["bing", "ddg"], n=20)
```

---

### `random_image(query, engines=None)`

Returns a single random direct image URL for the query.

**Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | `str` | required | Search term |
| `engines` | `list[str] \| None` | `["bing", "ddg"]` | Engines to query |

**Returns** `str | None` — one direct image URL, or `None` if no results.

**Examples**

```python
from imgsearch_api import random_image

url = random_image("abstract art")
# → "https://upload.wikimedia.org/wikipedia/commons/..."

url = random_image("mountain", engines=["bing"])
# → "https://images.pexels.com/photos/.../mountain.jpg"
```

---

## Engines

| Engine | Key | Returns | Notes |
|--------|-----|---------|-------|
| Bing | `"bing"` | Full-size original URLs | ✅ Recommended. Fast, reliable, high quality. |
| DuckDuckGo | `"ddg"` | Bing CDN thumbnails | ✅ Works. Uses Bing's index — thumbnails are valid images. |
| Yandex | `"yandex"` | Full-size originals | ⚠️ May be geo-blocked. Works with VPN. |
| Google | `"google"` | Full-size originals | ⚠️ Requires residential proxy. Blocked by reCAPTCHA on most IPs. |

**Recommended:** use `["bing"]` or `["bing", "ddg"]` for reliability.

---

## Node.js usage

### Import

```js
const { imageSearch, randomImage, closeBrowser } = require("imgsearch-api");
```

---

### `imageSearch(query, options?)`

**Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | `string` | required | Search term |
| `options.engines` | `string[]` | `["bing","ddg"]` | Engines in priority order |
| `options.n` | `number` | `10` | Max URLs to return |

**Returns** `Promise<string[]>`

```js
const { imageSearch } = require("imgsearch-api");

const urls = await imageSearch("sunset", { n: 10 });
const urls = await imageSearch("cat", { engines: ["bing"], n: 5 });
const urls = await imageSearch("dog", { engines: ["bing", "ddg"], n: 20 });
```

---

### `randomImage(query, options?)`

**Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | `string` | required | Search term |
| `options.engines` | `string[]` | `["bing","ddg"]` | Engines to query |

**Returns** `Promise<string|null>`

```js
const { randomImage } = require("imgsearch-api");

const url = await randomImage("abstract art");
console.log(url); // "https://example.com/image.jpg"
```

---

### `closeBrowser()`

Shut down the browser instance cleanly when done.

```js
const { imageSearch, closeBrowser } = require("imgsearch-api");

const urls = await imageSearch("mountain");
console.log(urls);
await closeBrowser();
```

---

## How it works

Each engine scrapes results using a stealth headless browser to bypass bot detection. Image URLs are extracted from structured data — never from thumbnails or base64 blobs:

- **Bing**: parses `murl` from `a.iusc[m]` JSON attribute
- **DDG**: decodes real URL from DDG CDN proxy `?u=` param
- **Yandex**: parses `img_href` from `data-bem` JSON
- **Google**: extracts `"ou":"..."` original URL from embedded script data

The browser stays open between calls (singleton) — starts once, reused for speed.

---

## Project structure

```
imgsearch_api/       # Python package source
  __init__.py
  _fetcher.py
  search.py
  engines/
    bing.py  ddg.py  yandex.py  google.py

node/                # Node.js package source
  index.js
  _browser.js
  engines/
    bing.js  ddg.js  yandex.js  google.js
```
