---
name: project-bootstrap
description: Initializes or repairs the MARSWALK repository, detects the existing tech stack, installs only necessary dependencies, creates environment/config foundations, and establishes the initial runnable app without requiring the user to edit source code.
---
# Project Bootstrap
## Goal
Take an empty, partial, or broken repository to a clean runnable baseline.
## Procedure
- Inspect existing files first.
- Detect Node/package manager and any Python environment.
- Reuse viable frameworks.
- Create the smallest production-capable structure.
- Add formatting/lint/type checks appropriate to the stack.
- Add `.env.example`, README, and implementation-status tracking.
- Establish a runnable first screen before complex features.
## Dependency discipline
Install only dependencies needed for concrete requirements.
## Recovery
For build failures: reproduce → capture exact error → fix smallest root cause → rerun → continue.
## User mode
Do not ask the user to edit code/config for ordinary setup. Only ask for credentials or decisions genuinely requiring user input.
