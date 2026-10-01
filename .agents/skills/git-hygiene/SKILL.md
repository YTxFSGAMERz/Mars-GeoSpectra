---
name: git-hygiene
description: Keeps the MARSWALK Git repository clean, reviewable, reproducible, and ready for collaboration by using focused commits, meaningful branches, generated-file hygiene, and documentation updates. Use when committing, branching, merging, or preparing the final repository.
---
# Git Hygiene
## Goal
Keep agent-generated implementation understandable and safe to share.
## Rules
- Inspect git status before/after meaningful work.
- Never commit secrets or huge caches unless intentionally versioned.
- Keep generated artifacts separated from source.
- Prefer focused Conventional Commit-style messages where compatible.
- Never rewrite shared history unless explicitly instructed.
## Final cleanup
Remove temporary downloads, logs, debug files, screenshots, and local-only configuration that should not ship.
