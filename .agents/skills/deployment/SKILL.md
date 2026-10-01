---
name: deployment
description: Deploys and validates the MARSWALK application, frontend, backend, API, data artifacts, environment variables, health checks, and production-like demo configuration on Vercel or the repository’s chosen platform. Use for deployment, CI/CD, or launch readiness.
---
# Deployment
## Goal
Ship a repeatable public demo and verify it live.
## Before deploy
Run tests/build, check env names, CORS/origins, health endpoint, frontend API connectivity, NASA dependencies, and fallback behavior.
## Platform guidance
Use Vercel where suitable for the frontend. Keep heavy scientific processing out of fragile serverless paths when runtime limits make it unreliable; use a dedicated service/worker when needed.
## Static data
Large tiles/derived artifacts should not inflate the application bundle; use suitable static/object hosting.
## Post-deploy
Open the deployed app, exercise the critical flow, check console/network failures, test unavailable-data behavior, and record the verified URL in `docs/deployment.md`.
## Rule
Never claim a deployment is successful until the live URL has been checked.
