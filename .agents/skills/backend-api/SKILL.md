---
name: backend-api
description: Designs and implements the MARSWALK backend/API for Mars datasets, route computation, science targets, provenance, and mission operations using typed request/response schemas. Use for server-side features and frontend-backend contracts.
---
# Backend API
## Goal
Create a stable typed service boundary around scientific/geospatial processing.
## Suggested endpoints
`GET /health`, `GET /datasets`, `GET /layers`, `GET /locations/:id`, `GET /targets`, `POST /routes/compute`, `GET /routes/:id`, `GET /provenance/:id`, `POST /mission/simulate`.
Use existing conventions when present.
## Validation
Validate every external input. Route requests contain start, destination, objective, constraints, and relevant data/version identifiers.
## Errors
Return structured errors with stable codes and readable messages. Never leak stack traces or secrets.
## Reproducibility
Attach data/source version identifiers to route results where possible.
## Caching
Cache immutable data and normalized route requests where safe.
