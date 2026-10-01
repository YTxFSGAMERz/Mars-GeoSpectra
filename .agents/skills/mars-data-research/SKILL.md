---
name: mars-data-research
description: Researches and validates current NASA and planetary-science data sources for MARSWALK, including MOLA, CTX, HiRISE, THEMIS, CRISM, MEDA, mission observations, and Mars map services. Use when selecting datasets, checking provenance, identifying coverage, or resolving data-source uncertainty.
---
# Mars Data Research
## Goal
Find authoritative, usable Mars datasets and document what each dataset measures, its coverage, access mechanism, spatial/reference information, caveats, and suitability.
## Source priority
1. NASA/JPL/NASA mission pages and official APIs.
2. NASA Planetary Data System nodes.
3. USGS planetary mapping resources where appropriate.
4. Established mission/instrument archives and documentation.
## Default instrument roles
- MOLA: elevation/topography and terrain derivatives.
- CTX: broad grayscale orbital context around higher-resolution observations.
- HiRISE: very high-resolution orbital surface imagery where coverage exists.
- THEMIS: visible/infrared and thermal context; preserve product type/time.
- CRISM: spectral/mineralogical evidence; never overstate a signature as a categorical mineral result without supporting documentation.
- MEDA: local Perseverance environmental observations; do not treat them as a global weather field.
## Research record
Track `sourceId, mission, instrument, productType, sourceUrl, accessUrl, observationTime?, coverage, spatialResolution?, processingLevel?, referenceFrame?, caveats, attribution`.
## Validation
- Confirm the current URL/API/product before integration.
- Distinguish instrument pages from actual product endpoints.
- Verify raw/calibrated/derived level.
- Record no-data regions and temporal limitations.
## Output
Maintain `docs/data-catalog.md` and visible source/provenance metadata in the app.
