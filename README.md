# imgapi

Scrape **direct image URLs** from Bing, DuckDuckGo, Yandex, and Google.
Returns links like `https://example.com/photo.jpg` — not thumbnails, not base64, not search pages.

---

## Install

### Python (pip)

```bash
pip install imgapi
scrapling install   # one-time: downloads stealth browser (~200 MB)
```

### Node.js (npm)

```bash
npm install imgapi
# browser is installed automatically via postinstall
```

---

## Python usage

### Import

```python
from imgapi import image_search, random_image
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
from imgapi import image_search

# Default: Bing first, DDG fills the rest
urls = image_search("sunset", n=10)

# Specific engine only
urls = image_search("cat", engines=["bing"], n=5)

# Multiple engines, tries each until n results collected
urls = image_search("dog", engines=["bing", "ddg"], n=20)

# With proxy (for Google / Yandex — see Engine notes below)
urls = image_search("flowers", engines=["google"], n=5)
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
from imgapi import random_image

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
| Yandex | `"yandex"` | Full-size originals | ⚠️ May be geo-blocked (Russia traffic). Works with VPN. |
| Google | `"google"` | Full-size originals | ⚠️ Requires residential proxy. Blocked by reCAPTCHA on most IPs. |

**Recommended:** use `["bing"]` or `["bing", "ddg"]` for reliability.

### Using Google or Yandex with a proxy

Configure before calling any function:

```python
from scrapling.fetchers import StealthyFetcher

StealthyFetcher.configure()  # global config
# then pass proxy per-call via engines' internal fetcher (see below)
```

> Proxy support per-call is on the roadmap.

---

## Node.js usage

### Import

```js
const { imageSearch, randomImage, closeBrowser } = require("imgapi");
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
const { imageSearch } = require("imgapi");

// Default engines
const urls = await imageSearch("sunset", { n: 10 });

// Specific engine
const urls = await imageSearch("cat", { engines: ["bing"], n: 5 });

// Multiple engines
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
const { randomImage } = require("imgapi");

const url = await randomImage("abstract art");
console.log(url); // "https://example.com/image.jpg"
```

---

### `closeBrowser()`

Call when done to shut down the browser instance cleanly.

```js
const { imageSearch, closeBrowser } = require("imgapi");

const urls = await imageSearch("mountain");
console.log(urls);
await closeBrowser();
```

---

## How it works

Each engine scrapes the search results page using a stealth headless browser (`StealthyFetcher` from [Scrapling](https://github.com/D4Vinci/Scrapling)) to bypass bot detection.

Image URLs are extracted from structured data embedded in the page — not from thumbnails or base64 blobs:

- **Bing**: parses `murl` from the JSON `m` attribute on result links (`a.iusc[m]`)
- **DDG**: extracts real URL from the `u=` parameter inside DDG's CDN proxy URLs
- **Yandex**: parses `img_href` from `data-bem` JSON on result elements
- **Google**: extracts `"ou":"..."` fields (original URL) from embedded script blobs

The singleton fetcher reuses the browser session across calls — the browser starts once and stays open, making repeated calls faster.

---

## Project structure

```
imgapi/
  __init__.py        # exports image_search, random_image
  _fetcher.py        # StealthyFetcher singleton
  search.py          # image_search + random_image logic
  engines/
    bing.py
    ddg.py
    yandex.py
    google.py
```
