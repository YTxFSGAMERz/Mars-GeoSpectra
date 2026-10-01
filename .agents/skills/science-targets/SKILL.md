---
name: science-targets
description: Models, ingests, ranks, displays, and explains Mars science targets using orbital observations and mission context, including evidence from CRISM, HiRISE, CTX, and rover observations. Use for science-stop selection and target detail panels.
---
# Science Targets
## Goal
Connect route planning with scientific value without overstating what remote sensing proves.
## Target model
Conceptually: `id, location, targetType, evidence, sourceProducts, confidence, observationDate?, coverage, notes, caveats`.
## Evidence labels
Use `Observation`, `Derived`, `Interpretation`, `Hypothesis`, and `Unavailable` where appropriate.
## CRISM
Never turn a spectral signature into a definitive mineral claim unless the product/documentation supports that interpretation.
## Imaging
Use HiRISE for fine context where available and CTX for broader context. Explicitly mark unavailable high-resolution coverage.
## Ranking
A science-target score may combine evidence strength, proximity, and mission objective, but the formula/weights must be visible.
## UI
Each target should answer: what is it, why is it interesting, what supports it, where the data came from, and what remains uncertain.
