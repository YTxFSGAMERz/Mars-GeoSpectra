import { create } from 'zustand';
import { 
  CandidateRoute, 
  MarsCoordinate, 
  MissionLayer, 
  RouteObjective, 
  RouteWaypoint, 
  ScienceTarget, 
  SimulationState, 
  AIMessage,
  EnvironmentalObservation
} from '../../types';
import { MISSION_LAYERS_CATALOG } from '../data/layers';
import { JEZERO_SCIENCE_TARGETS } from '../data/science-targets';
import { JEZERO_ENVIRONMENTAL_OBSERVATIONS } from '../data/environmental';
import { computeMarswalkRoute } from '../routing/router';
import { marsHaversineDistanceMeters } from '../geo/coordinates';
import { sampleJezeroElevationModel } from '../geo/dem';

// Default starting point: Octavia E. Butler Landing (Mars 2020)
export const DEFAULT_START_COORDINATE: MarsCoordinate = {
  lat: 18.4447,
  lon: 77.4508,
  elevationMeters: -2562,
};

// Default destination: Belva Crater Rim / Ejecta
export const DEFAULT_DESTINATION_COORDINATE: MarsCoordinate = {
  lat: 18.4285,
  lon: 77.4124,
  elevationMeters: -2480,
};

export interface MissionState {
  viewMode: 'global' | 'jezero';
  camera: {
    lat: number;
    lon: number;
    altitudeMeters: number;
    pitchDeg: number;
    headingDeg: number;
  };
  layers: MissionLayer[];
  startPoint: MarsCoordinate;
  destinationPoint: MarsCoordinate;
  candidateRoutes: CandidateRoute[];
  selectedRouteIndex: number;
  selectedScienceTarget: ScienceTarget | null;
  selectedWaypoint: RouteWaypoint | null;
  simulation: SimulationState;
  environmentalObservations: EnvironmentalObservation[];
  activeModal: 'provenance' | 'science' | 'ai' | null;
  operationalMode: 'active' | 'planning';
  aiMessages: AIMessage[];
  isCalculatingRoutes: boolean;

  // Actions
  setViewMode: (mode: 'global' | 'jezero') => void;
  flyToCoordinates: (lat: number, lon: number, altitudeMeters?: number) => void;
  focusJezeroCrater: () => void;
  focusGlobalMars: () => void;
  toggleLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setStartPoint: (coord: MarsCoordinate) => void;
  setDestinationPoint: (coord: MarsCoordinate) => void;
  selectScienceTarget: (target: ScienceTarget | null) => void;
  selectWaypoint: (wp: RouteWaypoint | null) => void;
  selectRouteIndex: (index: number) => void;
  generateRoutes: () => void;
  setActiveModal: (modal: 'provenance' | 'science' | 'ai' | null) => void;
  setOperationalMode: (mode: 'active' | 'planning') => void;

  // Simulation Actions
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  setSimulationProgress: (progress: number) => void;
  setSimulationSpeed: (speed: 1 | 2 | 5 | 10) => void;
  tickSimulation: (deltaSeconds: number) => void;

  // AI Actions
  sendAIMessage: (userText: string) => void;
}

// Initial routes generation
const initialRoutes: CandidateRoute[] = [
  computeMarswalkRoute(DEFAULT_START_COORDINATE, DEFAULT_DESTINATION_COORDINATE, 'FASTEST'),
  computeMarswalkRoute(DEFAULT_START_COORDINATE, DEFAULT_DESTINATION_COORDINATE, 'MIN_TERRAIN_RISK'),
  computeMarswalkRoute(DEFAULT_START_COORDINATE, DEFAULT_DESTINATION_COORDINATE, 'SCIENCE_PRIORITY'),
  computeMarswalkRoute(DEFAULT_START_COORDINATE, DEFAULT_DESTINATION_COORDINATE, 'BALANCED_MISSION'),
];

export const useMissionStore = create<MissionState>((set, get) => ({
  viewMode: 'jezero',
  camera: {
    lat: 18.4412,
    lon: 77.4520,
    altitudeMeters: 18500,
    pitchDeg: -45,
    headingDeg: 340,
  },
  layers: MISSION_LAYERS_CATALOG,
  startPoint: DEFAULT_START_COORDINATE,
  destinationPoint: DEFAULT_DESTINATION_COORDINATE,
  candidateRoutes: initialRoutes,
  selectedRouteIndex: 3, // BALANCED_MISSION by default
  selectedScienceTarget: JEZERO_SCIENCE_TARGETS[0], // Delta Scarp
  selectedWaypoint: null,
  environmentalObservations: JEZERO_ENVIRONMENTAL_OBSERVATIONS,
  activeModal: null,
  operationalMode: 'active',
  isCalculatingRoutes: false,

  simulation: {
    isPlaying: false,
    speed: 2,
    progress: 0,
    currentWaypointIndex: 0,
    elapsedMinutes: 0,
    currentCoordinate: DEFAULT_START_COORDINATE,
    currentSlopeDeg: 2.1,
    currentSpeedKmh: 2.7,
    activeScienceAlert: null,
    oxygenRemainingPercent: 99.4,
    batteryRemainingPercent: 98.8,
  },

  aiMessages: [
    {
      id: 'ai-msg-init',
      sender: 'assistant',
      content: `Greetings Commander. I am your Grounded AI Mission Scientist. I analyze the Jezero Crater digital elevation model, CRISM hyperspectral detections, and Mars 2020 MEDA atmospheric observations to evaluate candidate Marswalk routes. Ask me why a route was selected, inspect science targets along the path, or review our traversability assumptions.`,
      timestamp: '00:00:01',
      groundedEvidence: {
        sourcesCited: ['MOLA Aeroid Grid', 'CRISM Spectral Overlays', 'MEDA Sol 142 Telemetry'],
      },
    },
  ],

  setViewMode: (mode) => set({ viewMode: mode }),

  flyToCoordinates: (lat, lon, altitudeMeters = 15000) => {
    set((state) => ({
      camera: {
        ...state.camera,
        lat,
        lon,
        altitudeMeters,
      },
    }));
  },

  focusJezeroCrater: () => {
    set({
      viewMode: 'jezero',
      camera: {
        lat: 18.4412,
        lon: 77.4520,
        altitudeMeters: 18500,
        pitchDeg: -45,
        headingDeg: 340,
      },
    });
  },

  focusGlobalMars: () => {
    set({
      viewMode: 'global',
      camera: {
        lat: 10.0,
        lon: 45.0,
        altitudeMeters: 7500000,
        pitchDeg: -90,
        headingDeg: 0,
      },
    });
  },

  toggleLayer: (layerId) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l)),
    }));
  },

  setLayerOpacity: (layerId, opacity) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === layerId ? { ...l, opacity } : l)),
    }));
  },

  setStartPoint: (coord) => {
    if (!coord || !Number.isFinite(coord.lat) || !Number.isFinite(coord.lon)) return;
    const safeCoord: MarsCoordinate = {
      lat: Math.max(-90, Math.min(90, coord.lat)),
      lon: ((coord.lon + 180) % 360) - 180,
      elevationMeters: Number.isFinite(coord.elevationMeters) ? coord.elevationMeters : -2560,
    };
    set({ startPoint: safeCoord });
    get().generateRoutes();
  },

  setDestinationPoint: (coord) => {
    if (!coord || !Number.isFinite(coord.lat) || !Number.isFinite(coord.lon)) return;
    const safeCoord: MarsCoordinate = {
      lat: Math.max(-90, Math.min(90, coord.lat)),
      lon: ((coord.lon + 180) % 360) - 180,
      elevationMeters: Number.isFinite(coord.elevationMeters) ? coord.elevationMeters : -2480,
    };
    set({ destinationPoint: safeCoord });
    get().generateRoutes();
  },

  selectScienceTarget: (target) => {
    set({ selectedScienceTarget: target, activeModal: target ? 'science' : null });
  },

  selectWaypoint: (wp) => {
    set({ selectedWaypoint: wp });
  },

  selectRouteIndex: (index) => {
    set({ selectedRouteIndex: index });
    get().resetSimulation();
  },

  generateRoutes: () => {
    const { startPoint, destinationPoint } = get();
    set({ isCalculatingRoutes: true });

    // Multi-objective route calculation
    const objectives: RouteObjective[] = ['FASTEST', 'MIN_TERRAIN_RISK', 'SCIENCE_PRIORITY', 'BALANCED_MISSION'];
    const routes = objectives.map((obj) => computeMarswalkRoute(startPoint, destinationPoint, obj));

    set({
      candidateRoutes: routes,
      isCalculatingRoutes: false,
    });
    get().resetSimulation();
  },

  setActiveModal: (modal) => set({ activeModal: modal }),
  setOperationalMode: (mode) => set({ operationalMode: mode }),

  // Simulation Controls
  startSimulation: () => {
    set((state) => ({
      simulation: { ...state.simulation, isPlaying: true },
    }));
  },

  pauseSimulation: () => {
    set((state) => ({
      simulation: { ...state.simulation, isPlaying: false },
    }));
  },

  resetSimulation: () => {
    const { candidateRoutes, selectedRouteIndex } = get();
    const route = candidateRoutes[selectedRouteIndex];
    const initialCoord = route?.coordinates[0] || DEFAULT_START_COORDINATE;

    set({
      simulation: {
        isPlaying: false,
        speed: 2,
        progress: 0,
        currentWaypointIndex: 0,
        elapsedMinutes: 0,
        currentCoordinate: initialCoord,
        currentSlopeDeg: 2.1,
        currentSpeedKmh: 2.7,
        activeScienceAlert: null,
        oxygenRemainingPercent: 99.4,
        batteryRemainingPercent: 98.8,
      },
    });
  },

  setSimulationProgress: (progress) => {
    const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
    const { candidateRoutes, selectedRouteIndex } = get();
    const route = candidateRoutes[selectedRouteIndex];
    if (!route || route.coordinates.length < 2) return;

    const totalCoords = route.coordinates.length;
    const floatIdx = safeProgress * (totalCoords - 1);
    const lowIdx = Math.floor(floatIdx);
    const highIdx = Math.min(totalCoords - 1, Math.ceil(floatIdx));
    const alpha = floatIdx - lowIdx;

    const c1 = route.coordinates[lowIdx];
    const c2 = route.coordinates[highIdx];

    const currentCoord: MarsCoordinate = {
      lat: c1.lat + (c2.lat - c1.lat) * alpha,
      lon: c1.lon + (c2.lon - c1.lon) * alpha,
      elevationMeters: (c1.elevationMeters ?? -2500) + ((c2.elevationMeters ?? -2500) - (c1.elevationMeters ?? -2500)) * alpha,
    };

    const sample = sampleJezeroElevationModel(currentCoord);
    const totalMinutes = route.metrics.estimatedDurationMinutes;
    const elapsedMinutes = Math.round(safeProgress * totalMinutes);

    // Check proximity to science targets for real-time alert trigger
    const nearbyTarget = JEZERO_SCIENCE_TARGETS.find(
      (t) => marsHaversineDistanceMeters(currentCoord, t.coordinate) <= 220
    );

    // Consumables depletion
    const o2Remaining = Math.max(5, 100 - (safeProgress * (route.metrics.oxygenLitersEst / 300) * 100));
    const batRemaining = Math.max(10, 100 - (safeProgress * (route.metrics.batteryWattHoursEst / 600) * 100));

    set((state) => ({
      simulation: {
        ...state.simulation,
        progress: safeProgress,
        currentWaypointIndex: lowIdx,
        elapsedMinutes,
        currentCoordinate: currentCoord,
        currentSlopeDeg: sample.slopeDegrees,
        activeScienceAlert: nearbyTarget || null,
        oxygenRemainingPercent: Math.round(o2Remaining * 10) / 10,
        batteryRemainingPercent: Math.round(batRemaining * 10) / 10,
      },
    }));
  },

  setSimulationSpeed: (speed) => {
    set((state) => ({
      simulation: { ...state.simulation, speed },
    }));
  },

  tickSimulation: (deltaSeconds) => {
    const { simulation, candidateRoutes, selectedRouteIndex } = get();
    if (!simulation.isPlaying) return;

    const route = candidateRoutes[selectedRouteIndex];
    if (!route) return;

    // Cap deltaSeconds to 0.5s max to prevent large leaps when switching tabs
    const safeDelta = Number.isFinite(deltaSeconds) ? Math.max(0, Math.min(0.5, deltaSeconds)) : 0;
    const totalMinutes = Math.max(1, route.metrics.estimatedDurationMinutes);
    // Real time simulation increment scaled by playback speed (e.g. speed 2x means 1 real sec = 20 sim seconds)
    const simMinutesDelta = (safeDelta * simulation.speed * 8.0) / 60.0;
    const newProgress = Math.min(1.0, simulation.progress + simMinutesDelta / totalMinutes);

    get().setSimulationProgress(newProgress);

    if (newProgress >= 1.0) {
      set((state) => ({
        simulation: { ...state.simulation, isPlaying: false },
      }));
    }
  },

  // AI Mission Scientist Grounded Engine
  sendAIMessage: (userText) => {
    const sanitized = String(userText || '').trim().slice(0, 500);
    if (!sanitized) return;

    const state = get();
    const route = state.candidateRoutes[state.selectedRouteIndex];
    const userMsg: AIMessage = {
      id: `ai-user-${Date.now()}`,
      sender: 'user',
      content: sanitized,
      timestamp: new Date().toLocaleTimeString(),
    };

    set((s) => ({ aiMessages: [...s.aiMessages, userMsg] }));

    // Grounded rule-based response synthesizer backed exclusively by application telemetry
    setTimeout(() => {
      const q = sanitized.toLowerCase();
      let reply = '';
      const sourcesCited: string[] = [];
      const metricCitations: string[] = [];
      let uncertaintyWarning: string | undefined = undefined;

      if (q.includes('why') && (q.includes('route') || q.includes('avoid') || q.includes('different'))) {
        reply = `Selected ${route.name} (${route.objective}) differs from the straight-line path due to terrain traversability constraints. `;
        reply += `The straight corridor across Jezero encounters slope gradients up to ${route.metrics.maxSlopeDeg}° and coarse aeolian dune ripples in the Séítah formation (roughness > 2.0m). `;
        reply += `By applying objective weights (slope: ${route.costWeights.slope}, hazard: ${route.costWeights.hazard}, science: ${route.costWeights.science}), the router selected a corridor that adds ${route.metrics.distance2dKm} km total distance, maintaining average slope at ${route.metrics.avgSlopeDeg}°.`;
        sourcesCited.push('Jezero DEM Gradient Model', 'Séítah Transverse Aeolian Ridge Map');
        metricCitations.push(`Max Slope: ${route.metrics.maxSlopeDeg}°`, `Est EVA Time: ${route.metrics.estimatedDurationMinutes} min`);
      } else if (q.includes('science') || q.includes('target') || q.includes('crism') || q.includes('mineral')) {
        const targetList = JEZERO_SCIENCE_TARGETS.slice(0, 3).map((t) => `${t.name} (${t.targetType}, ${t.confidence} confidence)`).join('; ');
        reply = `Along this mission sector, the routing engine indexes candidate science targets with verified MRO and Mars 2020 provenance. Primary nearby targets include: ${targetList}. `;
        reply += `CRISM spectral parameter overlays indicate signatures of Fe/Mg smectite clays and hydrated silica at the Delta Scarp base, signifying quiescent lacustrine sedimentation with high biosignature preservation potential.`;
        sourcesCited.push('CRISM Hyperspectral Overlays (MTR3)', 'Mars 2020 Science Team Publications');
        metricCitations.push(`Science Targets Encountered: ${route.metrics.scienceTargetsEncountered}`);
      } else if (q.includes('weather') || q.includes('temp') || q.includes('meda') || q.includes('environment') || q.includes('wind')) {
        const meda = JEZERO_ENVIRONMENTAL_OBSERVATIONS[0];
        reply = `In-situ atmospheric telemetry from Perseverance MEDA at Octavia E. Butler Landing (Sol 142) records: atmospheric pressure ${meda.pressurePa} Pa (~7.35 mbar), surface temperature ${meda.surfaceTemperatureC.avg}°C (diurnal range ${meda.surfaceTemperatureC.min}°C to ${meda.surfaceTemperatureC.max}°C), and wind speed ${meda.windSpeedMps} m/s WNW. `;
        reply += `Note: These are localized surface observations from the rover mast, not a crater-wide synoptic forecast. Regional thermal inertia from THEMIS suggests exposed bedrock retains heat longer than fine dust blankets.`;
        sourcesCited.push('Perseverance MEDA Sol 142 Telemetry', 'THEMIS Daytime IR Mosaic');
        uncertaintyWarning = 'Historical point measurement. Local topography influences micro-climate wind acceleration.';
      } else if (q.includes('assumption') || q.includes('metabolic') || q.includes('tobler') || q.includes('speed') || q.includes('safety')) {
        reply = `EVA traversal calculations utilize a prototype Mars-adjusted Tobler hiking model. Key assumptions: astronaut mass 75 kg + surface EVA suit 85 kg (total system 160 kg); Mars gravitational acceleration 3.721 m/s² (0.38g); nominal unencumbered walking speed 2.8 km/h. `;
        reply += `Traversability thresholds (nominal ≤8°, elevated effort 8°-15°, high risk 15°-22°, impassable >26°) are prototype engineering constraints for mission planning demonstration, NOT certified NASA operational astronaut limits.`;
        sourcesCited.push('MARS-GEOSPECTRA Kinematic Traversal Specification');
        metricCitations.push(`Est O2 Consumption: ~${route.metrics.oxygenLitersEst} L`, `Est Battery Draw: ~${route.metrics.batteryWattHoursEst} Wh`);
        uncertaintyWarning = 'Model approximation. Actual spacesuit joint stiffness and regolith shear strength will alter traverse rates.';
      } else if (q.includes('provenance') || q.includes('source') || q.includes('data')) {
        reply = `Every active layer and observation in MARS-GEOSPECTRA is indexed in the Data Provenance Registry with its host PDS node (Cartography, Geosciences, or Imaging), instrument ID, and processing level. Viking MDIM 2.1 (PDS IMG, 232m/px), MOLA MEGDR (PDS GEO, 463m/px), and CTX Controlled Mosaic (6m/px) provide the geospatial baseline.`;
        sourcesCited.push('NASA Planetary Data System (PDS)', 'USGS Astrogeology Science Center');
      } else {
        const snippet = sanitized.length > 60 ? sanitized.slice(0, 57) + '...' : sanitized;
        reply = `Regarding your query on "${snippet}": In the current mission scenario (${route.name}), distance is ${route.metrics.distance2dKm} km with an estimated traverse time of ${route.metrics.estimatedDurationMinutes} minutes. We encounter ${route.metrics.scienceTargetsEncountered} candidate targets while maintaining an average slope of ${route.metrics.avgSlopeDeg}°. What specific geological or environmental factor would you like me to elaborate on?`;
        metricCitations.push(`Distance: ${route.metrics.distance2dKm} km`, `Duration: ${route.metrics.estimatedDurationMinutes} min`);
      }

      const aiReply: AIMessage = {
        id: `ai-resp-${Date.now()}`,
        sender: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString(),
        groundedEvidence: {
          sourcesCited,
          metricCitations,
          uncertaintyWarning,
        },
      };

      set((s) => ({ aiMessages: [...s.aiMessages, aiReply] }));
    }, 450);
  },
}));
