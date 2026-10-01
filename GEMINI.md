# MARSWALK — Antigravity Workspace Rules

## Mission
Build a polished, scientifically grounded web application for the NASA Space Apps Challenge 2026 challenge **Interplanetary Survival Guide: Martian Map**.

The application should provide a layered, integrated view of a Martian location/route to support a hypothetical future human Marswalk. The primary demo region is **Jezero Crater** unless the user explicitly changes it.

## User working mode
The user is a vibe coder and expects the agent to perform implementation work directly.

- Do not ask the user to write code.
- Do not ask the user to manually patch files for ordinary development tasks.
- Prefer implementing, running, testing, diagnosing, and fixing automatically.
- Ask only when an irreversible product decision, missing credential, legal/usage approval, or genuinely ambiguous requirement blocks progress.
- When blocked by a missing secret, create the integration with an environment-variable boundary and continue with mocks/local fixtures where possible.
- Never silently invent scientific measurements, NASA observations, mineral detections, hazard classifications, or route guarantees.
- Use transparent provenance for NASA-derived data and distinguish measured/observed data from computed estimates and AI-generated interpretations.

## Required skill protocol
Before implementation, inspect `.agents/skills/*/SKILL.md` metadata and load the relevant skill(s). Use the smallest set of skills needed for the current task, then consult related skills when the task crosses domains.

For large tasks, start with `marswalk-orchestrator` and then load the specialized skills it names.

## Engineering defaults
- Prefer TypeScript for frontend and API-adjacent application logic.
- Prefer React + Vite or the existing project stack if one already exists and works.
- Use CesiumJS/Resium or the existing globe engine when the repository already contains one.
- Use a small Python service only where scientific/geospatial processing is materially easier in Python.
- Use REST/JSON between frontend and backend unless a stronger existing contract is already present.
- Use a typed schema at every API boundary.
- Keep dependencies minimal.
- Preserve working code before refactoring.
- Add tests for non-trivial scientific/geospatial transformations.
- Never commit secrets.

## Product defaults
- Dark, professional mission-control aesthetic; prioritize readability over visual noise.
- Desktop-first for hackathon judges, responsive for smaller screens.
- Provide a 3D Mars globe, a focused Jezero view, a layer control, route planning, waypoint detail, science target context, environmental context, and explainable mission summary.
- Every scientific layer needs a visible provenance/source affordance.
- Every computed score needs a formula or methodology disclosure.
- Avoid claiming operational flight/rover/astronaut safety certification. This is a research/demo decision-support visualization.

## Data integrity
Source hierarchy for Mars science data:
1. NASA / JPL / NASA mission pages and official APIs.
2. NASA Planetary Data System nodes and official archive interfaces.
3. USGS planetary mapping resources where appropriate.
4. Established mission/instrument archives and documentation.
5. Local derived datasets, clearly labeled as derived.

The Mars Orbital Data Explorer (ODE) is a key discovery/download source for orbital products from MRO, Mars Odyssey, MGS, Viking, Mars Express, and ExoMars TGO. NASA Open APIs currently expose Mars mosaic/WMTS resources. Confirm current endpoints and product availability during implementation rather than assuming an old endpoint is permanent.

## Definition of done
A task is not complete merely because code was generated. The agent should:
1. Implement the requested change.
2. Run the relevant checks/tests.
3. Start the app when feasible.
4. Inspect the resulting UI or API behavior.
5. Fix obvious errors.
6. Update documentation when behavior or setup changes.
7. Report exactly what was verified and what could not be verified.
