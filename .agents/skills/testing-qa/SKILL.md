---
name: testing-qa
description: Tests and verifies MARSWALK end to end, including scientific transforms, data adapters, route algorithms, API contracts, UI interactions, accessibility, failure states, and deployment smoke checks. Use after implementation, before commits, and when debugging.
---
# Testing and QA
## Goal
Catch functional, scientific, visual, and integration errors before judging.
## Test layers
1. Unit: coordinate math, slope, distance, scoring, normalization.
2. Integration: adapters, API schemas, route service.
3. UI: layer toggles, map selection, route creation, waypoint panel, replay.
4. E2E: landing → Jezero → route → explanation → replay.
5. Failure: timeout, unavailable source, no-data area, invalid request.
## Scientific checks
Verify units, nodata, coordinate transforms, provenance, deterministic scoring weights.
## Browser verification
When a dev server exists, inspect it in a real browser; check console errors, failed requests, broken interactions, and visual defects.
## Accessibility
Keyboard navigation, visible focus, readable contrast, and no color-only semantics.
## Regression
Add regression tests for reproducible bugs.
