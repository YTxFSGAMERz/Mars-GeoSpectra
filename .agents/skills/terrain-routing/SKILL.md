---
name: terrain-routing
description: Implements terrain-aware Marswalk route generation using elevation, slope, hazards, distance, and optional science objectives. Use when creating paths, comparing routes, computing route metrics, or explaining why a route was selected.
---
# Terrain Routing
## Goal
Generate transparent candidate Marswalk routes, not black-box safety claims.
## Cost model
A route edge may combine distance, slope, relief/roughness, hazard, and optional science opportunity:
`cost = w_distance*d + w_slope*s + w_relief*r + w_hazard*h - w_science*q`.
Store the weights with every route result.
## Algorithm
Use A*, Dijkstra, or an equivalent graph search. Remove cells without valid terrain data. Apply slope thresholds only as prototype constraints, not universal astronaut standards.
## Metrics
Return surface distance, optional 3D length, min/max/mean elevation, cumulative climb, max/mean slope, hazard intersections, science target encounters, and estimated EVA time using a declared prototype pace.
## Explainability
Return reasons such as “lower cumulative slope penalty” or “passes within the configured target radius.”
## Safety language
Use “prototype route suitability” or “terrain-aware candidate route”; never “astronaut-safe”.
## Tests
Synthetic terrain fixtures must validate expected corridor selection and metric calculations.
