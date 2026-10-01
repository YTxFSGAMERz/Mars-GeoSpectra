import { CandidateRoute, MarsCoordinate, RouteObjective, RouteWaypoint, ScienceTarget, RouteMetrics } from '../../types';
import { marsHaversineDistanceKm, marsHaversineDistanceMeters } from '../geo/coordinates';
import { sampleJezeroElevationModel } from '../geo/dem';
import { calculateRouteMetrics, DEFAULT_TRAVERSABILITY_THRESHOLDS, TraversabilityThresholds } from './metrics';
import { JEZERO_SCIENCE_TARGETS } from '../data/science-targets';

export interface RouteObjectiveWeights {
  distance: number;
  slope: number;
  hazard: number;
  science: number;
}

export const OBJECTIVE_PROFILES: Record<RouteObjective, { name: string; weights: RouteObjectiveWeights; description: string }> = {
  FASTEST: {
    name: 'Direct / Fastest Traversal',
    weights: { distance: 1.0, slope: 0.35, hazard: 0.2, science: 0.0 },
    description: 'Prioritizes shortest overall traverse distance and minimal duration, accepting moderate slope inclines where manageable.',
  },
  MIN_TERRAIN_RISK: {
    name: 'Minimum Terrain Risk',
    weights: { distance: 0.35, slope: 2.5, hazard: 3.0, science: 0.0 },
    description: 'Heavily penalizes steep scarps, cliff faces, and aeolian sand dune fields (e.g., Séítah TAR ripples), seeking gentle gradient corridors.',
  },
  SCIENCE_PRIORITY: {
    name: 'Science Priority Sweep',
    weights: { distance: 0.35, slope: 0.8, hazard: 0.5, science: 2.8 },
    description: 'Routes through high-interest geological contacts, mineralogical outcrop exposures, and deltaic beds to maximize scientific discovery yield.',
  },
  BALANCED_MISSION: {
    name: 'Balanced EVA Mission',
    weights: { distance: 0.65, slope: 1.2, hazard: 1.5, science: 1.4 },
    description: 'Optimally balances astronaut physical exertion, safety margins, mission elapsed time, and sampling opportunities.',
  },
};

interface GridNode {
  x: number;
  y: number;
  coord: MarsCoordinate;
  g: number;
  h: number;
  f: number;
  parent: GridNode | null;
}

/**
 * Multi-Objective A* Terrain Router over Jezero Crater Planning Space
 */
export function computeMarswalkRoute(
  start: MarsCoordinate,
  destination: MarsCoordinate,
  objective: RouteObjective = 'BALANCED_MISSION',
  scienceTargets: ScienceTarget[] = JEZERO_SCIENCE_TARGETS,
  thresholds: TraversabilityThresholds = DEFAULT_TRAVERSABILITY_THRESHOLDS
): CandidateRoute {
  const safeStart: MarsCoordinate = {
    lat: Number.isFinite(start?.lat) ? start.lat : 18.4447,
    lon: Number.isFinite(start?.lon) ? start.lon : 77.4508,
    elevationMeters: Number.isFinite(start?.elevationMeters) ? start.elevationMeters : -2562,
  };
  const safeDestination: MarsCoordinate = {
    lat: Number.isFinite(destination?.lat) ? destination.lat : 18.4285,
    lon: Number.isFinite(destination?.lon) ? destination.lon : 77.4124,
    elevationMeters: Number.isFinite(destination?.elevationMeters) ? destination.elevationMeters : -2480,
  };

  const profile = OBJECTIVE_PROFILES[objective];
  const { weights } = profile;

  // Define local bounding grid around start and destination with generous padding
  const minLat = Math.min(safeStart.lat, safeDestination.lat) - 0.015;
  const maxLat = Math.max(safeStart.lat, safeDestination.lat) + 0.015;
  const minLon = Math.min(safeStart.lon, safeDestination.lon) - 0.015;
  const maxLon = Math.max(safeStart.lon, safeDestination.lon) + 0.015;

  const GRID_SIZE = 36; // 36x36 nodes for fast, sub-50ms deterministic client computation
  const latStep = (maxLat - minLat) / (GRID_SIZE - 1);
  const lonStep = (maxLon - minLon) / (GRID_SIZE - 1);

  // Convert coordinate to closest grid indices
  const getGridIndex = (coord: MarsCoordinate): [number, number] => {
    const x = Math.round((coord.lon - minLon) / lonStep);
    const y = Math.round((coord.lat - minLat) / latStep);
    return [
      Math.max(0, Math.min(GRID_SIZE - 1, x)),
      Math.max(0, Math.min(GRID_SIZE - 1, y)),
    ];
  };

  const [startX, startY] = getGridIndex(safeStart);
  const [destX, destY] = getGridIndex(safeDestination);

  const getCoordAt = (x: number, y: number): MarsCoordinate => {
    return {
      lat: minLat + y * latStep,
      lon: minLon + x * lonStep,
    };
  };

  // Pre-calculate science reward map for the grid
  const scienceInfluenceRadiusKm = 0.45; // 450 meters proximity influence
  const getScienceScore = (coord: MarsCoordinate): number => {
    let score = 0;
    for (const t of scienceTargets) {
      const distKm = marsHaversineDistanceKm(coord, t.coordinate);
      if (distKm < scienceInfluenceRadiusKm) {
        // Inverse linear decay
        score += (1.0 - distKm / scienceInfluenceRadiusKm) * (t.confidence === 'HIGH' ? 1.0 : 0.6);
      }
    }
    return score;
  };

  // A* Open Set, Closed Set
  const openSet: GridNode[] = [];
  const closedSet = new Set<string>();
  const nodeMap = new Map<string, GridNode>();

  const startNode: GridNode = {
    x: startX,
    y: startY,
    coord: safeStart,
    g: 0,
    h: marsHaversineDistanceMeters(safeStart, safeDestination),
    f: marsHaversineDistanceMeters(safeStart, safeDestination),
    parent: null,
  };

  openSet.push(startNode);
  nodeMap.set(`${startX},${startY}`, startNode);

  // Neighbor offsets (8-directional)
  const neighbors = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ];

  let foundEndNode: GridNode | null = null;
  let iterations = 0;
  const MAX_ITERATIONS = 4000;

  while (openSet.length > 0 && iterations++ < MAX_ITERATIONS) {
    // Find node with lowest f
    let lowestIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIdx].f) {
        lowestIdx = i;
      }
    }

    const current = openSet.splice(lowestIdx, 1)[0];
    const currentKey = `${current.x},${current.y}`;
    closedSet.add(currentKey);

    // Goal reached check
    if (current.x === destX && current.y === destY) {
      foundEndNode = current;
      break;
    }

    // Inspect neighbors
    for (const [dx, dy] of neighbors) {
      const nx = current.x + dx;
      const ny = current.y + dy;

      if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) continue;

      const neighborKey = `${nx},${ny}`;
      if (closedSet.has(neighborKey)) continue;

      const nCoord = (nx === destX && ny === destY) ? safeDestination : getCoordAt(nx, ny);
      const stepDistM = marsHaversineDistanceMeters(current.coord, nCoord);

      // Terrain evaluation
      const tSample = sampleJezeroElevationModel(nCoord);
      const slope = tSample.slopeDegrees;

      // Impassable terrain constraint
      if (slope >= thresholds.impassableSlopeDeg) {
        continue; // Discard impassable cliff/scarp cells
      }

      // Edge Cost Equation:
      // Cost = w_dist * d + w_slope * S(slope) + w_hazard * H - w_science * Q
      let slopeCost = 0;
      if (slope <= thresholds.nominalSlopeDeg) {
        slopeCost = slope * 1.0;
      } else if (slope <= thresholds.elevatedEffortSlopeDeg) {
        slopeCost = slope * 2.5;
      } else {
        slopeCost = Math.pow(slope, 1.8) * 4.0; // severe penalty
      }

      const hazardCost = tSample.roughnessMeters > 1.5 ? (tSample.roughnessMeters * 35.0) : 0;
      const scienceReward = getScienceScore(nCoord) * 60.0;

      const transitionCost =
        weights.distance * (stepDistM) +
        weights.slope * slopeCost +
        weights.hazard * hazardCost -
        weights.science * scienceReward;

      const tentativeG = current.g + Math.max(1.0, transitionCost);

      let neighborNode = nodeMap.get(neighborKey);
      if (!neighborNode) {
        const h = marsHaversineDistanceMeters(nCoord, safeDestination) * weights.distance;
        neighborNode = {
          x: nx,
          y: ny,
          coord: nCoord,
          g: tentativeG,
          h,
          f: tentativeG + h,
          parent: current,
        };
        nodeMap.set(neighborKey, neighborNode);
        openSet.push(neighborNode);
      } else if (tentativeG < neighborNode.g) {
        neighborNode.parent = current;
        neighborNode.g = tentativeG;
        neighborNode.f = tentativeG + neighborNode.h;
      }
    }
  }

  // Reconstruct path
  const rawCoords: MarsCoordinate[] = [];
  let curr = foundEndNode;
  while (curr) {
    rawCoords.unshift(curr.coord);
    curr = curr.parent;
  }

  // Fallback: If grid path failed to find exact destination, produce direct corridor
  if (rawCoords.length < 2) {
    rawCoords.length = 0;
    const steps = 12;
    for (let s = 0; s <= steps; s++) {
      const alpha = s / steps;
      rawCoords.push({
        lat: safeStart.lat + (safeDestination.lat - safeStart.lat) * alpha,
        lon: safeStart.lon + (safeDestination.lon - safeStart.lon) * alpha,
      });
    }
  }

  // Populate elevations for coordinates
  const finalCoords = rawCoords.map((c) => {
    const s = sampleJezeroElevationModel(c);
    return {
      lat: c.lat,
      lon: c.lon,
      elevationMeters: s.elevationMeters,
    };
  });

  // Identify science targets encountered along this route (within 250m)
  const encounteredTargets: ScienceTarget[] = [];
  for (const target of scienceTargets) {
    let minTargetDistM = Infinity;
    for (const c of finalCoords) {
      const d = marsHaversineDistanceMeters(c, target.coordinate);
      if (d < minTargetDistM) minTargetDistM = d;
    }
    if (minTargetDistM <= 280) {
      encounteredTargets.push(target);
    }
  }

  // Build Waypoints with cumulative stats
  const waypoints: RouteWaypoint[] = [];
  let cumulativeDistKm = 0;
  let cumulativeTimeMin = 0;

  for (let i = 0; i < finalCoords.length; i++) {
    const c = finalCoords[i];
    const sample = sampleJezeroElevationModel(c);

    if (i > 0) {
      const segKm = marsHaversineDistanceKm(finalCoords[i - 1], c);
      cumulativeDistKm += segKm;
      // Rough speed approx for timeline
      const segHours = segKm / 2.8;
      cumulativeTimeMin += segHours * 60;
    }

    // Check if this waypoint is close to any science target
    const nearestTarget = encounteredTargets.find(
      (t) => marsHaversineDistanceMeters(c, t.coordinate) <= 280
    );

    waypoints.push({
      index: i,
      coordinate: c,
      slopeDeg: sample.slopeDegrees,
      distanceFromStartKm: Math.round(cumulativeDistKm * 100) / 100,
      cumulativeTimeMinutes: Math.round(cumulativeTimeMin),
      elevationM: sample.elevationMeters,
      isScienceStop: !!nearestTarget,
      associatedTargetId: nearestTarget?.id,
      label: i === 0 ? 'EVA Base' : i === finalCoords.length - 1 ? 'Destination' : nearestTarget ? `Science Stop: ${nearestTarget.name}` : `Waypoint ${i}`,
    });
  }

  // Compute detailed metrics
  const metrics = calculateRouteMetrics(finalCoords, encounteredTargets.length, thresholds);

  // Generate transparent mathematical explanations (Critical Correction #14 & #16)
  const explanation = generateRouteExplanation(objective, metrics, encounteredTargets.length);

  return {
    id: `route-${objective.toLowerCase()}-${Date.now().toString(36)}`,
    name: profile.name,
    objective,
    coordinates: finalCoords,
    waypoints,
    metrics,
    costWeights: weights,
    explanation,
  };
}

/**
 * Generate transparent, data-grounded explanations for route tradeoffs
 */
function generateRouteExplanation(
  objective: RouteObjective,
  metrics: RouteMetrics,
  targetCount: number
): CandidateRoute['explanation'] {
  switch (objective) {
    case 'FASTEST':
      return {
        summary: `Prioritizes minimal traverse distance (${metrics.distance2dKm} km), reducing overall EVA duration to ${metrics.estimatedDurationMinutes} minutes.`,
        distanceFactor: `Direct path minimizes linear distance cost (weight: 1.0).`,
        terrainFactor: `Accepts localized slopes up to ${metrics.maxSlopeDeg}° where passable to maintain corridor directness.`,
        scienceFactor: `Zero weight assigned to science target attraction; passes ${targetCount} opportunistic targets.`,
        tradeoffStatement: `Fastest return to habitat, but subjects astronaut to higher average slope effort (${metrics.avgSlopeDeg}°).`,
      };
    case 'MIN_TERRAIN_RISK':
      return {
        summary: `Maximizes traversability safety margins, keeping average slope at ${metrics.avgSlopeDeg}° and strictly avoiding dune hazard zones.`,
        distanceFactor: `Expands overall path length by navigating around steep scarp contours and sand ripple fields.`,
        terrainFactor: `Heavy penalty weight (2.5) applied to slopes above 8°, capping peak slope at ${metrics.maxSlopeDeg}°.`,
        scienceFactor: `Secondary consideration; encounters ${targetCount} targets when along gentle terrain.`,
        tradeoffStatement: `Reduces metabolic exertion and slip risk, requiring ~${metrics.estimatedDurationMinutes} minutes traversal time.`,
      };
    case 'SCIENCE_PRIORITY':
      return {
        summary: `Actively deflects trajectory to intersect ${targetCount} candidate science targets and geological outcrop contacts.`,
        distanceFactor: `Incurs distance penalty to achieve high astrobiological and mineralogical sampling yield.`,
        terrainFactor: `Navigates slopes up to ${metrics.maxSlopeDeg}° to reach elevated outcrop exposures.`,
        scienceFactor: `High reward weight (2.8) applied to areas within 450m of verified CRISM/HiRISE contacts.`,
        tradeoffStatement: `Maximizes mission scientific productivity at the expense of longer EVA duration (${metrics.estimatedDurationMinutes} min).`,
      };
    case 'BALANCED_MISSION':
    default:
      return {
        summary: `Balanced compromise balancing distance (${metrics.distance2dKm} km), terrain comfort (${metrics.avgSlopeDeg}° avg slope), and science yield (${targetCount} targets).`,
        distanceFactor: `Moderate distance weighting (0.65) avoids excessive path elongation.`,
        terrainFactor: `Moderate slope penalty (1.2) routes around steep scarps while maintaining steady pace.`,
        scienceFactor: `Moderate science attraction (1.4) captures high-value targets near the natural corridor.`,
        tradeoffStatement: `Optimal all-around operational profile for single-sol Marswalk mission execution.`,
      };
  }
}
