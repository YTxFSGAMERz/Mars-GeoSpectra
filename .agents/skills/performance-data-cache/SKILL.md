---
name: performance-data-cache
description: Optimizes MARSWALK rendering, NASA data access, tile loading, route computation, client caching, server caching, and offline demo behavior. Use when the app is slow, network-heavy, unreliable, or too large for hackathon conditions.
---
# Performance and Data Cache
## Goal
Make the prototype fast and resilient on a normal hackathon laptop.
## Principles
- Fetch only viewport/mission-required data.
- Prefer tiles/overviews over giant products.
- Cache metadata separately from imagery.
- Reuse identical route computations.
- Cancel stale requests.
- Maintain a warm deterministic demo cache.
## Frontend
Reuse the repo’s query/cache layer if present; otherwise keep a small typed request cache.
## Backend
Use bounded caches for frequent metadata and route requests.
## Offline
Cached data must retain original provenance. Label demo/fixture state clearly.
## Measure
Track map-ready time, first meaningful layer render, route computation time, memory growth, and request count rather than guessing.
