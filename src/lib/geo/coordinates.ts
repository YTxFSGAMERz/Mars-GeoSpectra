import { MarsCoordinate, MarsBoundingBox } from '../../types';

/**
 * Mars Geodetic Constants (IAU 2000 Reference Ellipsoid)
 * Source: Seidelmann et al., 2002; NASA Planetary Data System
 */
export const MARS_EQUATORIAL_RADIUS_M = 3396190.0;
export const MARS_POLAR_RADIUS_M = 3376200.0;
export const MARS_MEAN_RADIUS_M = 3389500.0;
export const MARS_FLATTENING = (MARS_EQUATORIAL_RADIUS_M - MARS_POLAR_RADIUS_M) / MARS_EQUATORIAL_RADIUS_M; // ~0.005886

/**
 * Convert degrees to radians
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

/**
 * Convert radians to degrees
 */
export function radToDeg(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

/**
 * Normalize Mars longitude to standard range [-180, +180] degrees (East positive)
 */
export function normalizeLongitude180(lon: number): number {
  let normalized = lon % 360;
  if (normalized > 180) {
    normalized -= 360;
  } else if (normalized < -180) {
    normalized += 360;
  }
  return normalized;
}

/**
 * Normalize Mars longitude to [0, 360] degrees East positive
 */
export function normalizeLongitude360(lon: number): number {
  const norm = lon % 360;
  return norm < 0 ? norm + 360 : norm;
}

/**
 * Validate and clamp latitude to [-90, +90]
 */
export function clampLatitude(lat: number): number {
  return Math.max(-90.0, Math.min(90.0, lat));
}

/**
 * Great-circle surface distance on Mars mean sphere (Haversine formula)
 * Returns distance in meters.
 */
export function marsHaversineDistanceMeters(c1: MarsCoordinate, c2: MarsCoordinate): number {
  if (!Number.isFinite(c1?.lat) || !Number.isFinite(c1?.lon) || !Number.isFinite(c2?.lat) || !Number.isFinite(c2?.lon)) {
    return 0;
  }

  const phi1 = degToRad(c1.lat);
  const phi2 = degToRad(c2.lat);
  const deltaPhi = degToRad(c2.lat - c1.lat);
  const deltaLambda = degToRad(normalizeLongitude180(c2.lon - c1.lon));

  const a =
    Math.sin(deltaPhi / 2.0) * Math.sin(deltaPhi / 2.0) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2.0) * Math.sin(deltaLambda / 2.0);

  const safeA = Math.max(0, Math.min(1.0, a));
  const c = 2.0 * Math.atan2(Math.sqrt(safeA), Math.sqrt(Math.max(0, 1.0 - safeA)));
  return MARS_MEAN_RADIUS_M * c;
}

/**
 * Great-circle surface distance in kilometers
 */
export function marsHaversineDistanceKm(c1: MarsCoordinate, c2: MarsCoordinate): number {
  return marsHaversineDistanceMeters(c1, c2) / 1000.0;
}

/**
 * Calculate 3D Euclidean-approximated distance considering elevation difference
 */
export function mars3dPathDistanceMeters(c1: MarsCoordinate, c2: MarsCoordinate): number {
  const surfaceM = marsHaversineDistanceMeters(c1, c2);
  const elevDiffM = (c2.elevationMeters ?? 0) - (c1.elevationMeters ?? 0);
  return Math.sqrt(surfaceM * surfaceM + elevDiffM * elevDiffM);
}

/**
 * Initial bearing from c1 to c2 on Mars sphere (degrees 0-360)
 */
export function marsBearingDegrees(c1: MarsCoordinate, c2: MarsCoordinate): number {
  const phi1 = degToRad(c1.lat);
  const phi2 = degToRad(c2.lat);
  const deltaLambda = degToRad(c2.lon - c1.lon);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  return (radToDeg(theta) + 360) % 360;
}

/**
 * Format Mars coordinate string in standard planetary notation
 * Example: "18.4412°N, 77.4520°E (-2540m)"
 */
export function formatMarsCoordinates(c: MarsCoordinate): string {
  const latDir = c.lat >= 0 ? 'N' : 'S';
  const lonDir = c.lon >= 0 ? 'E' : 'W';
  const absLat = Math.abs(c.lat).toFixed(4);
  const absLon = Math.abs(c.lon).toFixed(4);
  const elev = c.elevationMeters !== undefined ? ` (${c.elevationMeters > 0 ? '+' : ''}${Math.round(c.elevationMeters)}m)` : '';
  return `${absLat}°${latDir}, ${absLon}°${lonDir}${elev}`;
}

/**
 * Check if a coordinate lies within a specified bounding box
 */
export function isCoordinateInBounds(c: MarsCoordinate, box: MarsBoundingBox): boolean {
  const latOk = c.lat >= box.south && c.lat <= box.north;
  const lon = normalizeLongitude180(c.lon);
  const west = normalizeLongitude180(box.west);
  const east = normalizeLongitude180(box.east);

  const lonOk = west <= east ? (lon >= west && lon <= east) : (lon >= west || lon <= east);
  return latOk && lonOk;
}
