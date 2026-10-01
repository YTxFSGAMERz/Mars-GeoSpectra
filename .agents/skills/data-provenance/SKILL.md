---
name: data-provenance
description: Implements first-class provenance, attribution, dataset versioning, observation timestamps, transformation history, uncertainty labels, and source links across MARSWALK data and UI. Use whenever scientific data is displayed, transformed, scored, or cited.
---
# Data Provenance
## Goal
Make meaningful scientific statements traceable.
## Provenance record
Conceptually: `sourceId, sourceName, mission, instrument, productId?, sourceUrl, retrievedAt, observedAt?, processingLevel?, coverage?, transformChain?, attribution, caveats`.
## Transform chain
Record steps such as `MOLA → reprojected → resampled → slope`.
## UI
Provide a source/details affordance on layers, targets, waypoints, and AI answers.
## Versioning
Route results should reference data versions/snapshots when possible.
## Uncertainty
Use `Observed`, `Derived`, `Interpretation`, `Hypothesis`, `Unavailable`.
## Integrity rule
No user-visible scientific claim without a source reference or explicit computed-estimate label.
