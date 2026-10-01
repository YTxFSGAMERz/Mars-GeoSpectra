---
name: observability-debugging
description: Diagnoses MARSWALK failures across browser, frontend, backend, NASA data services, route computation, and deployment using structured logs and reproducible checks. Use when the app is broken, slow, inconsistent, or producing unexpected scientific output.
---
# Observability and Debugging
## Goal
Find root causes without random rewrites.
## Triage
Reproduce → capture error/context → browser console/network → backend logs/health → data adapter → coordinate/unit metadata → derived/scoring inputs → smallest fix → regression test.
## Logs
Prefer `requestId, operation, sourceId, durationMs, status, errorCode, datasetVersion`. Never log secrets.
## Scientific debugging
For wrong routes/scores, inspect real input points/grids, units, nodata masks, coordinate transform, and weights before changing algorithms.
## Browser debugging
Check console errors, failed tiles, CORS, WebGL/context issues, memory pressure, and event-handler churn.
## Rule
Never hide incorrect scientific output to make the demo look correct.
