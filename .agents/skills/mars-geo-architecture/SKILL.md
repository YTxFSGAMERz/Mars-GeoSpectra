---
name: mars-geo-architecture
description: Designs and implements the Mars geospatial model, coordinate transforms, spatial indexing, bounds, units, terrain grids, and geographic calculations for MARSWALK. Use when handling coordinates, projections, distances, bearings, elevation, slope, or spatial queries.
---
# Mars Geospatial Architecture
## Goal
Make every spatial calculation explicit, consistent, and testable.
## Coordinate rules
- Store source coordinates with reference metadata.
- Never silently convert latitude/longitude conventions.
- Make longitude convention explicit.
- Preserve planetocentric vs planetographic latitude when known.
- Document the Mars shape/radius/reference model used by each calculation.
## Internal location model
Conceptually: `{ lat, lon, elevation?, latitudeType?, longitudeConvention?, frame?, source? }`.
## Terrain derivatives
Derive slope, aspect, relief, and roughness only from documented source grids and units. Propagate nodata; never interpret nodata as zero.
## Distance
Distinguish surface distance from terrain-following 3D path length.
## Tests
Use synthetic grids and known coordinates to verify transforms, distances, slope, and route length.
