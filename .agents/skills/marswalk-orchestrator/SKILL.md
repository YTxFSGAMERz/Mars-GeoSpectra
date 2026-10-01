---
name: marswalk-orchestrator
description: Orchestrates the full MARSWALK project from initial repository inspection through NASA data integration, Mars visualization, route planning, AI explanation, testing, deployment, and hackathon demo preparation. Use for broad feature requests, project setup, milestone planning, or tasks spanning multiple MARSWALK subsystems.
---
# MARSWALK Orchestrator
## Goal
Act as the project lead for a NASA Space Apps 2026 Marswalk decision-support prototype. Convert user intent into implemented, tested increments without making the user write code.
## First actions
- Inspect repository structure, package manager, scripts, environment example, deployment config, and current implementation.
- Preserve useful existing work; do not rebuild working components unnecessarily.
- Identify the smallest end-to-end vertical slice that can be demonstrated.
## Primary workflow
`OPEN MARS → FOCUS JEZERO → ENABLE LAYERS → PICK START/DESTINATION → COMPUTE ROUTE → INSPECT WAYPOINTS → REVIEW SCIENCE/ENVIRONMENT → EXPLAIN ROUTE → SIMULATE MARSWALK`
## Milestones
1. App shell and visual identity.
2. Mars globe and Jezero navigation.
3. Terrain/base imagery.
4. NASA data adapters.
5. Terrain-aware routing.
6. Science targets/evidence.
7. Environmental context.
8. Mission replay.
9. Grounded AI assistant.
10. QA, provenance, accessibility, performance.
11. Deployment and demo readiness.
## Agent behavior
- Implement current milestone before unrelated polish.
- Run relevant checks after meaningful changes.
- Maintain `docs/implementation-status.md` with completed, blocked, and next items.
- Prefer real NASA-derived data but maintain deterministic local fixtures for network failure.
## Cross-skill routing
Use `mars-data-research`, `nasa-data-ingestion`, `mars-geo-architecture`, `mars-globe-ui`, `terrain-routing`, `science-targets`, `environmental-context`, `mission-simulation`, `mission-ai`, `backend-api`, `performance-data-cache`, `testing-qa`, `security-secrets`, `deployment`, `docs-demo`, `data-provenance`, `hackathon-judge-ux`, `observability-debugging`, and `git-hygiene` as needed.
## Non-negotiables
- No fabricated NASA facts.
- No unexplained scientific score.
- No route marketed as astronaut-safe.
- No hidden external dependency that silently breaks the demo.
