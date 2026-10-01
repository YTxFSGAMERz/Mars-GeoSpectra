# Hackathon Demo Walkthrough Script (2–4 Minutes)

**MARS-GEOSPECTRA: Plan the Marswalk. Understand the terrain. Discover the science.**

---

## Elevator Pitch (0:00 – 0:30)
> *"Hello judges. For a human explorer standing on the surface of Mars, selecting a traverse route is not just about finding the shortest path—it is a high-stakes balance between life-support consumable margins, traversability hazards like steep scarps and loose dune sand, and maximizing astrobiological science yield.
> 
> Welcome to **MARS-GEOSPECTRA**: an integrated 3D mission planning environment for Jezero Crater that combines multi-mission NASA orbital and in-situ observations to plan, analyze, and simulate Marswalk extravehicular activities."*

---

## Step 1: 3D Mars & Jezero Mission Focus (0:30 – 1:00)
1. Show the **3D Mars Globe** rotating in the viewport.
2. Click **JEZERO CRATER** in the top header.
3. Observe the camera transition smoothly into the western delta fan of Jezero Crater.
4. Point out the real-time **Reticle Telemetry**:
   - `18.4412°N, 77.4520°E (-2540m)`
   - Sol 142 localized in-situ atmospheric status.

---

## Step 2: Multi-Sensor Layer Management (1:00 – 1:30)
1. Open the **NASA Data Layers** panel on the left.
2. Toggle on the **MOLA Topography** layer with its color elevation scale.
3. Expand **CRISM Mineralogical Overlays**:
   - Highlight green smectite clay and cyan hydrated silica signatures concentrated along the delta scarp.
4. Show how every layer features a transparent provenance badge (`LIVE`, `CACHED`, `DERIVED`).

---

## Step 3: Candidate Route Comparison (1:30 – 2:15)
1. Direct attention to the bottom **Route Comparison Panel**:
   - Four distinct candidate routes generated via multi-objective A* search over the Jezero DEM:
     - **Direct / Fastest**: 2.45 km, 66 min, high slope effort.
     - **Minimum Terrain Risk**: 4.03 km, 126 min, strictly avoids steep slopes and Séítah dune fields.
     - **Science Priority Sweep**: Maximizes encounters with geological contacts.
     - **Balanced EVA Mission**: Optimal compromise for a single-sol EVA.
2. Click between candidate cards and point out the **"Why this route?"** explainability statement.

---

## Step 4: Real-Time Marswalk EVA Simulation (2:15 – 3:00)
1. Click **SIMULATE MARSWALK**.
2. Watch the animated astronaut marker traverse along the 3D route.
3. Demonstrate the live **Simulation HUD**:
   - Elapsed EVA timer ticking up against the estimated schedule.
   - Dynamic slope angle changing from nominal stride (6.8°) to elevated effort.
   - Life support gauges: Oxygen reserve percentage and suit power draw.
4. When approaching the delta front, show the **Science Opportunity Alert**:
   - *"SCIENCE OPPORTUNITY DETECTED: Delta Scarp Base (Neretva Inflow)"*
   - Click **INSPECT TARGET** to reveal the full geological dossier with CRISM mineral spectra and sampling protocols.

---

## Step 5: Grounded AI Mission Scientist & Provenance (3:00 – 3:30)
1. Open the **AI SCIENTIST** drawer.
2. Click the preset: *"Why does this candidate route avoid the Séítah region?"*
3. Show that the AI explains the exact mathematical tradeoff without hallucinating:
   - Cites slope gradients, Séítah dune roughness, and MOLA DEM elevation constraints.
4. Open the **Data Catalog** to show complete NASA PDS lineage, processing levels, and scientific caveats.

---

## Concluding Statement (3:30 – 3:45)
> *"MARS-GEOSPECTRA is not just a 3D visualization—it is an end-to-end mission planning workstation grounded in authentic NASA science, built to empower the first human explorers on Mars."*
