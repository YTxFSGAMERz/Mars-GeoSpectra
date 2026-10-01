# Development & Contribution Guide

**MARS-GEOSPECTRA — Project Architecture & Developer Workflow**

---

## Technical Stack
- **Framework**: React 19 (Strict Mode)
- **Language**: TypeScript 5.8+ (Strict type checking)
- **Build Tool**: Vite 6+
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **State Management**: Zustand 5
- **3D Visualization**: Three.js 0.174+ (Planetary WebGL pipeline with procedural shaders and terrain displacement)
- **Test Runner**: Vitest 3.0+
- **End-to-End Testing**: Playwright (Headless browser verification)

---

## Local Development Workflow

```bash
# Install dependencies
bun install
# or: npm install

# Start Vite hot-reloading dev server
bun run dev

# Run unit tests in watch mode
bun x vitest

# Run unit tests once
bun run test

# Run strict TypeScript compiler verification
bun run type-check

# Run production build
bun run build
```

---

## Directory Organization

```text
Mars-GeoSpectra/
├── .agents/skills/            # 21 NASA Space Apps Agent Skills
├── docs/                      # Technical specs, datasets, provenance & screenshots
│   ├── ARCHITECTURE.md
│   ├── DATA_SOURCES.md
│   ├── PROVENANCE.md
│   ├── DEMO.md
│   ├── DEVELOPMENT.md
│   ├── ENVIRONMENT.md
│   └── screenshots/
├── scripts/                   # Verification and test automation scripts
│   └── verify_app.py          # Playwright headless browser E2E test
├── src/
│   ├── components/            # React mission UI components
│   │   ├── ai/                # Grounded AI Mission Scientist drawer
│   │   ├── globe/             # Three.js 3D Mars globe & Jezero terrain mesh
│   │   ├── header/            # Tactical telemetry header
│   │   ├── layers/            # NASA layer manager & opacity controls
│   │   ├── provenance/        # Searchable PDS data catalog
│   │   ├── routing/           # Route comparison & terrain analysis panel
│   │   ├── science/           # Science target dossier modal
│   │   └── simulation/        # Real-time Marswalk EVA simulation HUD
│   ├── lib/
│   │   ├── data/              # Layers, science targets, environment, provenance
│   │   ├── geo/               # Mars IAU 2000 geodetic engine & DEM sampling
│   │   ├── routing/           # Multi-objective A* router & Tobler kinematics
│   │   └── state/             # Centralized Zustand mission planning store
│   ├── tests/                 # Vitest automated test suite
│   ├── types/                 # Shared TypeScript interfaces & models
│   ├── App.tsx                # Root layout
│   ├── index.css              # Aerospace dark theme & tactical HUD styling
│   └── main.tsx               # Client entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```
