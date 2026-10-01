---
name: mission-ai
description: Builds a grounded AI mission assistant that explains MARSWALK routes, science targets, layers, tradeoffs, and provenance using only application-provided evidence. Use when adding natural-language mission planning or explanations.
---
# Mission AI
## Goal
Make the map queryable in natural language without turning the assistant into an ungrounded Mars oracle.
## Grounding context
Provide route metrics, selected layers, waypoint facts, science evidence, source/provenance, environmental observations, and methodology weights.
## Response pattern
1. What was found.
2. Why it relates to the selected objective.
3. Which sources support it.
4. What is uncertain/unavailable.
## Tools
Use structured functions for route computation, location lookup, layer selection, and other deterministic actions. Do not allow free-form text to mutate arbitrary app state.
## Hallucination control
Missing evidence means “unknown/unavailable”, not a guess. Never fabricate coordinates, measurements, dates, instrument results, or NASA quotations.
## Safety
Never call a route astronaut-safe or mission-approved.
