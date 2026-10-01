# Data Provenance & Scientific Integrity

**MARS-GEOSPECTRA — Scientific Derivation Chains & Caveats**

---

## Provenance Philosophy

To maintain credibility for the NASA Space Apps Challenge, MARS-GEOSPECTRA enforces **First-Class Scientific Provenance**. Every displayed observation, metric, or boundary condition must trace back to an authentic data source or be clearly categorized as a derived or simulated estimate.

### Classification Taxonomy
- `LIVE`: Directly retrieved from active remote map services (e.g. USGS/NASA Mars Trek WMTS).
- `CACHED`: Locally stored snapshot of an official NASA PDS release to ensure offline reliability.
- `DERIVED`: Algorithmic synthesis (e.g. finite-difference slopes, kinematic speeds).
- `DEMO`: Curated scenario fixture for demonstration and automated testing.
- `UNAVAILABLE`: Explicitly flagged when data coverage is missing; never replaced with synthetic values without disclosure.

---

## Derivation Chains

### 1. Planetary Topography: MOLA Laser Altimetry to Marswalk Slopes
```mermaid
flowchart TD
    A[MOLA Laser Footprints (MGS)] -->|Ephemeris & Datum| B[Aeroid Elevation MEGDR (463 m/px)]
    B -->|Bilinear Resampling| C[Jezero Sector DEM Grid]
    C -->|Finite-Difference Gradient| D[Local Slope Matrix (Degrees)]
    D -->|Tobler-Mars Function| E[Metabolic Traversal Speed & Duration]
```

### 2. Mineralogical Characterization: CRISM Hyperspectral to Science Targets
```mermaid
flowchart TD
    A[CRISM 544-Channel VNIR/IR Radiance] -->|Atmospheric CO2 Band Subtraction| B[Standardized Summary Parameters (BD1900, BD2300)]
    B -->|Spectral Library Facies Match| C[Mineral Detection Polygons]
    C -->|Science Team Synthesis| D[Science Target Astrobiological Dossier]
```

---

## Scientific Uncertainties & Operational Caveats

1. **Resolution vs. Micro-Hazards**: Orbital CTX (6 m/px) and MOLA altimetry cannot resolve sub-meter rocks or regolith fissures that could pose tripping or spacesuit puncture risks.
2. **Spectral Optical Depth**: CRISM detections represent the upper optical millimeters of the Martian surface; fine aeolian dust coatings can attenuate bedrock absorption signatures.
3. **Localized vs. Synoptic Weather**: Rover MEDA readings reflect mast-level microclimates at Octavia E. Butler Landing; crater rim katabatic winds will cause local variations across Jezero.
4. **Traversal Kinematics**: Marswalk traversal duration, metabolic energy, and oxygen estimates are engineering model approximations, not certified NASA flight medical parameters.
