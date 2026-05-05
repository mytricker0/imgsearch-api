import re
from urllib.parse import quote_plus
from .._fetcher import get_fetcher

# Google embeds original image URLs in script blobs as "ou":"..."
_OU_RE = re.compile(r'"ou"\s*:\s*"(https?://[^"\\]+)"')


def fetch_google(query: str, n: int = 10) -> list[str]:
    # Requires proxy to bypass reCAPTCHA/429 on most IPs.
    # Pass proxy via StealthyFetcher.configure() or per-call proxy param.
    page = get_fetcher().fetch(
        f"https://www.google.com/search?q={quote_plus(query)}&tbm=isch",
        headless=True,
        network_idle=True,
        wait_selector="div[data-ri]",
        wait_selector_state="attached",
    )
    if page.status != 200:
        return []

    urls: list[str] = []
    seen: set[str] = set()
    for url in _OU_RE.findall(page.html_content):
        if url not in seen:
            seen.add(url)
            urls.append(url)
            if len(urls) >= n:
                break
    return urls
