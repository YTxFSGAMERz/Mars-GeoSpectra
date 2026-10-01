---
name: mission-simulation
description: Builds the MARSWALK Marswalk replay and mission simulation experience, including animated route traversal, waypoint events, EVA timing, science stops, environmental context, and mission timeline. Use when implementing the replay/demo narrative.
---
# Mission Simulation
## Goal
Turn a selected route into a clear, cinematic, data-grounded walkthrough.
## Inputs
Route, waypoints, configured travel pace, stop durations, science tasks, timestamps, and optional environmental context.
## Outputs
Timeline, estimated duration, current position, active waypoint, and contextual panels.
## Timing
Use a declared prototype pace model. Never imply NASA operational EVA timing.
## Events
EVA start, navigation checkpoint, science target arrival, study stop, data unavailable, route completion.
## Rendering
Smooth camera follow with pause/play/scrub controls, synchronized waypoint highlighting, and user camera override.
## Demo mode
Use deterministic replay fixtures so network failure does not ruin the presentation.
