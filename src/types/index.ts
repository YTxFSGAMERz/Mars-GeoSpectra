export type DataAvailabilityStatus = 'LIVE' | 'CACHED' | 'DERIVED' | 'DEMO' | 'UNAVAILABLE';

export type LayerCategory = 
  | 'TOPOGRAPHY' 
  | 'IMAGERY' 
  | 'MINERALOGY' 
  | 'THERMAL' 
  | 'ENVIRONMENT' 
  | 'SCIENCE' 
  | 'HAZARD';

export interface MarsCoordinate {
  lat: number;
  lon: number;
  elevationMeters?: number;
}

export interface MarsBoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MissionLayer {
  id: string;
  name: string;
  category: LayerCategory;
  mission: string;
  instrument: string;
  description: string;
  source: string;
  coverage: string;
  resolution: string;
  units?: string;
  status: DataAvailabilityStatus;
  visible: boolean;
  opacity: number;
  provenanceId: string;
  wmtsEndpoint?: string;
  tileLayerUrl?: string;
  legend?: {
    label: string;
    colors: string[];
    ticks: string[];
  };
}

export type ScienceTargetType = 
  | 'DELTAIC_STRATIGRAPHY'
  | 'IMPACT_EJECTA'
  | 'MINERALOGICAL_HYDRATION'
  | 'IGNEOUS_BEDROCK'
  | 'CARBONATE_MARGIN'
  | 'FLUVIAL_CHANNEL'
  | 'REGOLITH_HAZARD';

export interface ScienceTarget {
  id: string;
  name: string;
  coordinate: MarsCoordinate;
  targetType: ScienceTargetType;
  description: string;
  scientificSignificance: string;
  confidence: 'HIGH' | 'MODERATE' | 'CANDIDATE' | 'REQUIRES_CONFIRMATION';
  primaryMission: string;
  instrument: string;
  availableImagery: string[];
  mineralSignatures?: string[];
  thermalContext?: string;
  recommendedAction: string;
  provenanceId: string;
  caveats: string;
}

export interface EnvironmentalObservation {
  id: string;
  sol: number;
  timestampUtc: string;
  locationName: string;
  coordinate: MarsCoordinate;
  airTemperatureC: {
    min: number;
    max: number;
    avg: number;
  };
  surfaceTemperatureC: {
    min: number;
    max: number;
    avg: number;
  };
  pressurePa: number;
  windSpeedMps: number;
  windDirectionDegrees: number;
  dustOpticalDepthTau: number;
  uvIndex: 'LOW' | 'MODERATE' | 'HIGH';
  status: DataAvailabilityStatus;
  mission: string;
  instrument: string;
  localizedConstraint: string;
}

export type RouteObjective = 
  | 'FASTEST' 
  | 'MIN_TERRAIN_RISK' 
  | 'SCIENCE_PRIORITY' 
  | 'BALANCED_MISSION';

export interface RouteMetrics {
  distance2dKm: number;
  distance3dKm: number;
  elevationGainM: number;
  elevationLossM: number;
  maxSlopeDeg: number;
  avgSlopeDeg: number;
  estimatedDurationMinutes: number;
  scienceTargetsEncountered: number;
  hazardExposurePercent: number;
  metabolicJoulesEst: number;
  oxygenLitersEst: number;
  batteryWattHoursEst: number;
  assumptions: {
    astronautMassKg: number;
    spacesuitMassKg: number;
    marsGravityMps2: number;
    baseWalkingSpeedKmh: number;
    disclaimer: string;
  };
}

export interface RouteWaypoint {
  index: number;
  coordinate: MarsCoordinate;
  slopeDeg: number;
  distanceFromStartKm: number;
  cumulativeTimeMinutes: number;
  elevationM: number;
  isScienceStop: boolean;
  associatedTargetId?: string;
  label?: string;
}

export interface CandidateRoute {
  id: string;
  name: string;
  objective: RouteObjective;
  coordinates: MarsCoordinate[];
  waypoints: RouteWaypoint[];
  metrics: RouteMetrics;
  costWeights: {
    distance: number;
    slope: number;
    hazard: number;
    science: number;
  };
  explanation: {
    summary: string;
    distanceFactor: string;
    terrainFactor: string;
    scienceFactor: string;
    tradeoffStatement: string;
  };
}

export interface ProvenanceRecord {
  id: string;
  datasetName: string;
  mission: string;
  instrument: string;
  hostOrganization: string;
  pdsNode: string;
  productId?: string;
  sourceUrl: string;
  processingLevel: string;
  spatialResolution: string;
  temporalCoverage: string;
  derivationChain: string[];
  uncertaintiesAndLimitations: string[];
}

export interface SimulationState {
  isPlaying: boolean;
  speed: 1 | 2 | 5 | 10;
  progress: number; // 0 to 1
  currentWaypointIndex: number;
  elapsedMinutes: number;
  currentCoordinate: MarsCoordinate;
  currentSlopeDeg: number;
  currentSpeedKmh: number;
  activeScienceAlert: ScienceTarget | null;
  oxygenRemainingPercent: number;
  batteryRemainingPercent: number;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  groundedEvidence?: {
    metricCitations?: string[];
    sourcesCited?: string[];
    uncertaintyWarning?: string;
  };
}
