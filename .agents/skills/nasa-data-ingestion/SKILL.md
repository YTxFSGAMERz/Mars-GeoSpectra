---
name: nasa-data-ingestion
description: Builds robust ingestion adapters for NASA Mars datasets and map services, including discovery, downloads, REST/WMTS resources, metadata parsing, normalization, caching, retries, and offline fixtures. Use when connecting remote Mars data to the MARSWALK application.
---
# NASA Data Ingestion
## Goal
Keep the browser independent from fragile external scientific endpoints.
## Pipeline
`source adapter → raw cache → normalization → validation → derived products → API/tile endpoint → UI`
## Rules
- Encapsulate each remote source in one adapter.
- Add timeouts, bounded retries, and explicit error types.
- Cache metadata separately from large imagery.
- Preserve source IDs, timestamps, and product metadata.
- Never load giant PDS products directly into normal UI components.
- Prefer tiled imagery, mosaics, thumbnails, or windowed products at display scale.
## Failure states
Each layer has live, cached, deterministic fixture, or explicit unavailable state. Never silently substitute fake science for a failed source.
## Security
Keep secrets server-side. Never place private keys in frontend bundles.
## Verification
Add adapter tests for successful parsing and unavailable/invalid source fixtures.
