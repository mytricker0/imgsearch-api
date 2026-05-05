from urllib.parse import quote_plus, urlparse, parse_qs, unquote
from .._fetcher import get_fetcher


def fetch_ddg(query: str, n: int = 10) -> list[str]:
    # Load the image search page with browser (JS required for results)
    page = get_fetcher().fetch(
        f"https://duckduckgo.com/?q={quote_plus(query)}&iax=images&ia=images",
        headless=True,
        network_idle=True,
    )

    urls: list[str] = []
    seen: set[str] = set()

    # DDG thumbnails are served via their CDN proxy:
    # https://external-content.duckduckgo.com/iu/?u=REAL_ENCODED_URL&...
    # Extract the real URL from the `u` query param.
    for img in page.css("img[src*='external-content.duckduckgo.com']"):
        src = img.attrib.get("src", "")
        if not src:
            continue
        params = parse_qs(urlparse(src).query)
        real_url = unquote(params.get("u", [""])[0])
        if real_url and real_url.startswith("http") and real_url not in seen:
            seen.add(real_url)
            urls.append(real_url)
            if len(urls) >= n:
                break

    return urls
