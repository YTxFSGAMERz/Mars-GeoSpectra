# Current Source Notes

These notes are intentionally high-level. The build agent must verify exact endpoints, product IDs, coverage, and access terms before wiring live integrations.

## Antigravity Skills
Google's current Codelab describes a Skill as a directory with a required `SKILL.md`, optional scripts/references/assets, YAML frontmatter, and a Markdown instruction body. Project/workspace-specific skills are stored under the workspace's agent-skill directory.

Reference:
- https://codelabs.developers.google.com/getting-started-with-antigravity-skills
- https://codelabs.developers.google.com/antigravity/how-to-create-agent-skills-for-antigravity-cli

## Mars science data discovery
NASA's Mars Orbital Data Explorer (PDS Geosciences Node, Washington University in St. Louis) provides search, display, and download tools for Mars orbital products across MRO, Mars Odyssey, MGS, Viking, Mars Express, and ExoMars TGO. It includes a REST interface and product/data-set search facilities.

Reference:
- https://ode.rsl.wustl.edu/mars/

## Instrument context
- CTX is a broad context imager for MRO and is used to provide context for HiRISE and CRISM.
- CRISM archives include raw, calibrated, and derived products; product type and processing level matter.
- NASA Open APIs currently list Mars mosaic resources and WMTS capabilities.

References:
- https://ode.rsl.wustl.edu/mars/productSearch.aspx
- https://ode.rsl.wustl.edu/mars/pagehelp/Content/Missions_Instruments/Mars%20Reconnaissance%20Orbiter%20%28MRO%29/CTX/CTX.htm
- https://api.nasa.gov/index.html

## Important implementation rule
Do not assume an API path or product endpoint from this document. The agent must verify the source at implementation time and record the verified endpoint and product/coverage notes in `docs/data-catalog.md`.
