import json
from urllib.parse import quote_plus
from .._fetcher import get_fetcher


def fetch_bing(query: str, n: int = 10) -> list[str]:
    page = get_fetcher().fetch(
        f"https://www.bing.com/images/search?q={quote_plus(query)}&form=HDRSC2",
        headless=True,
    )
    urls: list[str] = []
    for link in page.css("a.iusc"):
        try:
            m = json.loads(link.attrib.get("m", "{}"))
            url = m.get("murl", "")
            if url and url not in urls:
                urls.append(url)
                if len(urls) >= n:
                    break
        except (json.JSONDecodeError, AttributeError):
            continue
    return urls
