---
name: mars-globe-ui
description: Builds and polishes the interactive Mars globe, Jezero map, layer controls, terrain visualization, imagery overlays, picking, camera behavior, waypoints, route rendering, and mission-control interface. Use for frontend geospatial visualization work.
---
# Mars Globe UI
## Goal
Create a professional exploration interface that is impressive without scientific theater.
## Required interactions
- Globe landing view.
- Focus Jezero.
- Layer toggles and opacity where useful.
- Click/pick a map location.
- Start/destination selection.
- Route visibility and reset camera.
- Waypoint highlighting and detail panel.
- Loading/unavailable states.
## Layer contract
Each layer defines `id, name, category, visibility, opacity, zOrder, source, attribution, coverage, legend?`.
Do not expose sparse/local data as globally available; show its actual footprint.
## Implementation
Prefer the existing globe engine; use CesiumJS/Resium when 3D planetary visualization is needed. Keep fetching in adapters/hooks rather than low-level render components.
## Performance
Use tiles/primitives over huge entity counts, debounce expensive picking, and lazy-load heavy panels.
## Accessibility
Keyboard-accessible controls, visible focus, descriptive labels, and text alongside color semantics.
## Demo polish
Make the first 20 seconds obvious: Mars → Jezero → layers → route → explanation.
