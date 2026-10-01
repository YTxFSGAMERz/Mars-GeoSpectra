import { MarsCoordinate, RouteMetrics } from '../../types';
import { marsHaversineDistanceMeters } from '../geo/coordinates';
import { sampleJezeroElevationModel } from '../geo/dem';

/**
 * Prototype Traversability Parameters (Configurable)
 * NOTE: These are engineering approximations for research/demonstration purposes,
 * NOT operational NASA astronaut-safety certifications.
 */
export interface TraversabilityThresholds {
  nominalSlopeDeg: number;       // e.g. <= 8° nominal walking
  elevatedEffortSlopeDeg: number; // e.g. 8° to 15° noticeable fatigue
  highRiskSlopeDeg: number;      // e.g. 15° to 22° steep incline/loose scree
  impassableSlopeDeg: number;    // e.g. > 22° excessive slip hazard for rigid boots
}

export const DEFAULT_TRAVERSABILITY_THRESHOLDS: TraversabilityThresholds = {
  nominalSlopeDeg: 8.0,
  elevatedEffortSlopeDeg: 15.0,
  highRiskSlopeDeg: 22.0,
  impassableSlopeDeg: 26.0,
};

/**
 * Mars-Adjusted Tobler Traversal Velocity Model
 * Based on empirical human hiking mechanics scaled to Mars surface gravity (0.38g)
 * and pressurized extravehicular activity (EVA) suit inertia.
 * 
 * Assumptions:
 * - Human mass: ~75 kg
 * - Planetary Surface EVA suit mass: ~85 kg (System mass ~160 kg)
 * - Mars surface gravity: 3.721 m/s² (~0.38 g)
 * - Unencumbered flat walking speed: ~4.0 km/h; encumbered EVA flat speed: ~2.8 km/h
 * - Steep ascents decrease speed exponentially; steep descents induce braking/stability cost
 */
export function estimateMarswalkSpeedKmh(
  slopeDegrees: number,
  baseFlatSpeedKmh = 2.8,
  thresholds: TraversabilityThresholds = DEFAULT_TRAVERSABILITY_THRESHOLDS
): number {
  if (Math.abs(slopeDegrees) >= thresholds.impassableSlopeDeg) {
    return 0.1; // effectively impassable crawl
  }

  const slopeTan = Math.tan((slopeDegrees * Math.PI) / 180.0);
  
  // Tobler-inspired exponential slope curve adjusted for Mars low gravity
  // Downhill optimal speed around -3° to -5°
  const toblerFactor = Math.exp(-3.2 * Math.abs(slopeTan + 0.05));
  
  // Under 0.38g, traction is reduced on loose regolith, capping downhill speed boost
  const speed = baseFlatSpeedKmh * toblerFactor;
  return Math.max(0.4, Math.min(3.5, speed));
}

/**
 * Calculate comprehensive RouteMetrics along an array of Mars coordinates
 */
export function calculateRouteMetrics(
  path: MarsCoordinate[],
  scienceTargetCount = 0,
  thresholds: TraversabilityThresholds = DEFAULT_TRAVERSABILITY_THRESHOLDS
): RouteMetrics {
  if (path.length < 2) {
    return {
      distance2dKm: 0,
      distance3dKm: 0,
      elevationGainM: 0,
      elevationLossM: 0,
      maxSlopeDeg: 0,
      avgSlopeDeg: 0,
      estimatedDurationMinutes: 0,
      scienceTargetsEncountered: scienceTargetCount,
      hazardExposurePercent: 0,
      metabolicJoulesEst: 0,
      oxygenLitersEst: 0,
      batteryWattHoursEst: 0,
      assumptions: {
        astronautMassKg: 75,
        spacesuitMassKg: 85,
        marsGravityMps2: 3.721,
        baseWalkingSpeedKmh: 2.8,
        disclaimer: 'Calculated using prototype Mars metabolic traversal model. For research and mission planning demonstration only.',
      },
    };
  }

  let totalDist2dM = 0;
  let totalDist3dM = 0;
  let elevationGainM = 0;
  let elevationLossM = 0;
  let maxSlopeDeg = 0;
  let slopeSum = 0;
  let totalTimeMinutes = 0;
  let hazardousSegmentsCount = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const c1 = path[i];
    const c2 = path[i + 1];

    const segDist2dM = marsHaversineDistanceMeters(c1, c2);
    totalDist2dM += segDist2dM;

    const sample1 = sampleJezeroElevationModel(c1);
    const sample2 = sampleJezeroElevationModel(c2);

    const elevDiff = sample2.elevationMeters - sample1.elevationMeters;
    if (elevDiff > 0) {
      elevationGainM += elevDiff;
    } else {
      elevationLossM += Math.abs(elevDiff);
    }

    const segDist3dM = Math.sqrt(segDist2dM * segDist2dM + elevDiff * elevDiff);
    totalDist3dM += segDist3dM;

    // Effective segment slope
    const segSlopeDeg = segDist2dM > 0 ? (Math.atan(Math.abs(elevDiff) / segDist2dM) * 180.0) / Math.PI : 0;
    maxSlopeDeg = Math.max(maxSlopeDeg, segSlopeDeg);
    slopeSum += segSlopeDeg;

    if (segSlopeDeg >= thresholds.elevatedEffortSlopeDeg || sample1.roughnessMeters > 2.0) {
      hazardousSegmentsCount++;
    }

    // Traversal speed and duration for this segment
    const segSpeedKmh = estimateMarswalkSpeedKmh(elevDiff >= 0 ? segSlopeDeg : -segSlopeDeg, 2.8, thresholds);
    const segHours = (segDist2dM / 1000.0) / segSpeedKmh;
    totalTimeMinutes += segHours * 60.0;
  }

  const segmentCount = path.length - 1;
  const avgSlopeDeg = segmentCount > 0 ? slopeSum / segmentCount : 0;
  const hazardExposurePercent = segmentCount > 0 ? Math.round((hazardousSegmentsCount / segmentCount) * 100) : 0;

  // Metabolic Energy and Consumable Approximations
  // Human basal + Mars locomotion power in suit: ~250W flat, up to 550W steep incline
  const avgPowerWatts = 260 + (avgSlopeDeg / 20.0) * 180;
  const totalHours = totalTimeMinutes / 60.0;
  const metabolicJoulesEst = Math.round(avgPowerWatts * totalHours * 3600);
  
  // O2 consumption rate: ~0.8 to 1.6 L/min under work
  const avgO2LitersPerMin = 0.85 + (avgSlopeDeg / 25.0) * 0.45;
  const oxygenLitersEst = Math.round(avgO2LitersPerMin * totalTimeMinutes);

  // Suit primary life-support battery power (avionics, pumps, CO2 scrubber): ~180W continuous
  const batteryWattHoursEst = Math.round((avgPowerWatts * 0.4 + 180) * totalHours);

  return {
    distance2dKm: Math.round((totalDist2dM / 1000.0) * 100) / 100,
    distance3dKm: Math.round((totalDist3dM / 1000.0) * 100) / 100,
    elevationGainM: Math.round(elevationGainM),
    elevationLossM: Math.round(elevationLossM),
    maxSlopeDeg: Math.round(maxSlopeDeg * 10) / 10,
    avgSlopeDeg: Math.round(avgSlopeDeg * 10) / 10,
    estimatedDurationMinutes: Math.round(totalTimeMinutes),
    scienceTargetsEncountered: scienceTargetCount,
    hazardExposurePercent,
    metabolicJoulesEst,
    oxygenLitersEst,
    batteryWattHoursEst,
    assumptions: {
      astronautMassKg: 75,
      spacesuitMassKg: 85,
      marsGravityMps2: 3.721,
      baseWalkingSpeedKmh: 2.8,
      disclaimer: 'Calculated using prototype Mars metabolic traversal model. For research and mission planning demonstration only.',
    },
  };
}
