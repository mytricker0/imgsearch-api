from scrapling.fetchers import StealthyFetcher

# Configure once globally — avoids instantiation deprecation warning
StealthyFetcher.configure(adaptive=False)


def get_fetcher():
    return StealthyFetcher  # class itself, fetch() is a classmethod
