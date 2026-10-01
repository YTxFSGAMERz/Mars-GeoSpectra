# NASA Scientific Data Sources Catalog

**MARS-GEOSPECTRA — Verified Planetary Datasets**

This document catalogues the remote sensing and in-situ instruments integrated into the MARS-GEOSPECTRA mission planning environment.

---

## Summary of Integrated Datasets

| Dataset | Mission | Instrument | PDS Node | Native Resolution | Spatial Coverage | Product Type | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Viking MDIM 2.1** | Viking 1 & 2 | VIS Cameras | Cartography | 232 m/pixel | Global Mars | Level 4 Controlled Mosaic | `LIVE` |
| **MOLA MEGDR** | Mars Global Surveyor | MOLA Laser Altimeter | Geosciences | 463 m/pixel | Global Mars | Level 3 Topographic Grid | `LIVE` |
| **CTX Jezero Mosaic**| MRO | Context Camera | Cartography | 6.0 m/pixel | Jezero Quadrangle | Level 4 Orthomosaic | `CACHED` |
| **HiRISE Delta Strip**| MRO | HiRISE Camera | Imaging | 0.25 m/pixel | Western Delta Scarp | Level 3 RDR Product | `CACHED` |
| **CRISM Mineral Maps**| MRO | CRISM Hyperspectral | Geosciences | 18 m/pixel | Delta & Crater Floor | Level 3 Spectral Parameter | `DERIVED` |
| **THEMIS Daytime IR** | 2001 Mars Odyssey | THEMIS Infrared | Imaging | 100 m/pixel | Global / Regional | Level 3 Thermal Mosaic | `CACHED` |
| **MEDA Atmospheric**  | Mars 2020 | MEDA Weather Station| Atmospheres | In-situ Point | Perseverance Traverse | Level 2 In-situ Record | `CACHED` |
| **Traversability Map**| MARS-GEOSPECTRA | Derived DEM Analysis | Local Engine | 25 m/pixel | Jezero Planning Area | Derived Model Grid | `DERIVED` |

---

## 1. MOLA (Mars Orbiter Laser Altimeter)
- **Host Spacecraft**: Mars Global Surveyor (MGS)
- **Archive Node**: PDS Geosciences Node (Washington University in St. Louis)
- **Product**: MEGDR (Mission Experiment Gridded Data Record)
- **Datum**: MOLA Aeroid (Zero elevation defined by 6.1 mbar gravitational equipotential surface)
- **Role in App**: Provides global elevation reference and macro-scale regional topography.

## 2. Context Camera (CTX)
- **Host Spacecraft**: Mars Reconnaissance Orbiter (MRO)
- **Archive Node**: PDS Cartography & Imaging Sciences Node / Caltech Murray Lab
- **Resolution**: 6 meters/pixel panchromatic
- **Role in App**: Provides contextual landscape imagery covering the entirety of Jezero Crater.

## 3. High Resolution Imaging Science Experiment (HiRISE)
- **Host Spacecraft**: Mars Reconnaissance Orbiter (MRO)
- **Archive Node**: University of Arizona / PDS Imaging Node
- **Resolution**: 0.25 meters/pixel (25 cm)
- **Role in App**: High-resolution outcrop texture verification on deltaic clinoforms and impact crater rims.

## 4. Compact Reconnaissance Imaging Spectrometer for Mars (CRISM)
- **Host Spacecraft**: Mars Reconnaissance Orbiter (MRO)
- **Archive Node**: JHU/APL / PDS Geosciences Node
- **Spectral Bandwidth**: 0.36 to 3.92 µm across 544 channels
- **Parameters**: BD1900 (hydration), BD2300 (Fe/Mg smectite clays), MIN2295 (carbonates)
- **Role in App**: Target identification and astrobiological biosignature ranking.

## 5. Mars Environmental Dynamics Analyzer (MEDA)
- **Host Spacecraft**: Mars 2020 Perseverance Rover
- **Archive Node**: PDS Atmospheres Node
- **Telemetry**: Surface/Air temperature, pressure, wind velocity vectors, UV radiation, optical depth ($\tau$)
- **Role in App**: Provides authenticated in-situ atmospheric context for Marswalk planning.
