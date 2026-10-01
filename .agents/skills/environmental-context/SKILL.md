---
name: environmental-context
description: Adds Mars environmental context such as surface weather observations, dust, thermal information, and temporal conditions to MARSWALK waypoints and routes. Use when integrating MEDA, THEMIS, dust, or time-dependent environmental layers.
---
# Environmental Context
## Goal
Provide environmental context without confusing sparse observations with a global live forecast.
## MEDA
Treat Perseverance MEDA values as rover-site observations unless a source explicitly supplies a broader field/model.
## THEMIS
Preserve product type and acquisition time. A thermal observation is not automatically current conditions.
## Dust
Keep observation time/source/coverage. Do not turn historical observations into live warnings.
## UI
Show timestamp and observation age. Use `observed`, `archived observation`, `historical context`, or `unavailable` appropriately.
## Routing
Environmental context may influence optional route cost, but weights must be explicit and configurable.
## Missing data
Show “No local observation in selected dataset” rather than inventing values.
