import json
from urllib.parse import quote_plus
from .._fetcher import get_fetcher


def fetch_yandex(query: str, n: int = 10) -> list[str]:
    page = get_fetcher().fetch(
        f"https://yandex.com/images/search?text={quote_plus(query)}",
        headless=True,
        timeout=15000,
        wait_selector=".serp-item",
        wait_selector_state="attached",
    )
    urls: list[str] = []
    for item in page.css(".serp-item[data-bem]"):
        try:
            bem = json.loads(item.attrib.get("data-bem", "{}"))
            url = bem.get("serp-item", {}).get("img_href", "")
            if url and url not in urls:
                urls.append(url)
                if len(urls) >= n:
                    break
        except (json.JSONDecodeError, AttributeError):
            continue
    return urls
