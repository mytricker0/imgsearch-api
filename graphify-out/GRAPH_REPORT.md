# Graph Report - image-api  (2026-05-04)

## Corpus Check
- 16 files · ~3,524 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 33 nodes · 38 edges · 5 communities detected
- Extraction: 71% EXTRACTED · 29% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `get_fetcher()` - 5 edges
2. `getBrowser()` - 5 edges
3. `run()` - 4 edges
4. `imageSearch()` - 3 edges
5. `randomImage()` - 3 edges
6. `image_search()` - 2 edges
7. `random_image()` - 2 edges
8. `fetch_yandex()` - 2 edges
9. `fetch_bing()` - 2 edges
10. `fetch_google()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `fetch_yandex()` --calls--> `get_fetcher()`  [INFERRED]
  imgapi/engines/yandex.py → imgapi/_fetcher.py
- `fetch_bing()` --calls--> `get_fetcher()`  [INFERRED]
  imgapi/engines/bing.py → imgapi/_fetcher.py
- `fetch_google()` --calls--> `get_fetcher()`  [INFERRED]
  imgapi/engines/google.py → imgapi/_fetcher.py
- `fetch_ddg()` --calls--> `get_fetcher()`  [INFERRED]
  imgapi/engines/ddg.py → imgapi/_fetcher.py
- `fetchGoogle()` --calls--> `getBrowser()`  [INFERRED]
  node/engines/google.js → node/_browser.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.29
Nodes (5): fetch_bing(), fetch_ddg(), get_fetcher(), fetch_google(), fetch_yandex()

### Community 1 - "Community 1"
Cohesion: 0.22
Nodes (5): fetchBing(), getBrowser(), fetchDDG(), fetchGoogle(), fetchYandex()

### Community 2 - "Community 2"
Cohesion: 0.38
Nodes (4): closeBrowser(), imageSearch(), randomImage(), run()

### Community 3 - "Community 3"
Cohesion: 0.67
Nodes (2): image_search(), random_image()

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (1): image-api

## Knowledge Gaps
- **1 isolated node(s):** `image-api`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 3`** (4 nodes): `__init__.py`, `search.py`, `image_search()`, `random_image()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (1 nodes): `image-api`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getBrowser()` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `get_fetcher()` (e.g. with `fetch_yandex()` and `fetch_bing()`) actually correct?**
  _`get_fetcher()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBrowser()` (e.g. with `fetchGoogle()` and `fetchBing()`) actually correct?**
  _`getBrowser()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `run()` (e.g. with `imageSearch()` and `randomImage()`) actually correct?**
  _`run()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `image-api` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._