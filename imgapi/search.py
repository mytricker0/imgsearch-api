import random
from .engines.bing import fetch_bing
from .engines.yandex import fetch_yandex
from .engines.ddg import fetch_ddg
from .engines.google import fetch_google

_ENGINES = {
    "bing": fetch_bing,
    "ddg": fetch_ddg,
    "yandex": fetch_yandex,
    "google": fetch_google,
}

# google/yandex need proxy — excluded from defaults
_DEFAULT_ORDER = ["bing", "ddg"]


def image_search(
    query: str,
    engines: list[str] | None = None,
    n: int = 10,
) -> list[str]:
    engines = engines or _DEFAULT_ORDER
    seen: set[str] = set()
    urls: list[str] = []

    for engine in engines:
        fn = _ENGINES.get(engine)
        if fn is None:
            continue
        try:
            for url in fn(query, n=n):
                if url not in seen:
                    seen.add(url)
                    urls.append(url)
        except Exception:
            pass
        if len(urls) >= n:
            break

    return urls[:n]


def random_image(
    query: str,
    engines: list[str] | None = None,
) -> str | None:
    urls = image_search(query, engines=engines, n=20)
    return random.choice(urls) if urls else None
