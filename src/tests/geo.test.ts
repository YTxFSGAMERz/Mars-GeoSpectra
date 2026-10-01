import { describe, it, expect } from 'vitest';
import { 
  marsHaversineDistanceKm, 
  marsHaversineDistanceMeters, 
  formatMarsCoordinates, 
  normalizeLongitude180, 
  normalizeLongitude360,
  MARS_MEAN_RADIUS_M,
  MARS_EQUATORIAL_RADIUS_M,
  MARS_POLAR_RADIUS_M,
  MARS_FLATTENING,
  isCoordinateInBounds
} from '../lib/geo/coordinates';
import { JEZERO_MISSION_BOUNDS, JEZERO_CENTER_COORDINATE, sampleJezeroElevationModel } from '../lib/geo/dem';

describe('Mars Geodesy & Coordinate Engine', () => {
  it('correctly declares Mars IAU 2000 reference constants', () => {
    expect(MARS_EQUATORIAL_RADIUS_M).toBe(3396190.0);
    expect(MARS_POLAR_RADIUS_M).toBe(3376200.0);
    expect(MARS_MEAN_RADIUS_M).toBe(3389500.0);
    expect(MARS_FLATTENING).toBeCloseTo(0.005886, 5);
  });

  it('normalizes longitude across boundaries', () => {
    expect(normalizeLongitude180(190)).toBe(-170);
    expect(normalizeLongitude180(-190)).toBe(170);
    expect(normalizeLongitude180(77.45)).toBe(77.45);
    expect(normalizeLongitude360(-10)).toBe(350);
  });

  it('calculates accurate Mars surface distance in km and meters', () => {
    // 1 degree along Mars equator is approx: (2 * PI * 3389.5 km) / 360 ≈ 59.158 km
    const c1 = { lat: 0, lon: 0 };
    const c2 = { lat: 0, lon: 1 };
    const distKm = marsHaversineDistanceKm(c1, c2);
    const distM = marsHaversineDistanceMeters(c1, c2);
    expect(distKm).toBeCloseTo(59.16, 1);
    expect(distM).toBeCloseTo(59158, -1);
  });

  it('formats coordinates with cardinal direction and elevation', () => {
    const formatted = formatMarsCoordinates({ lat: 18.4412, lon: 77.4520, elevationMeters: -2540 });
    expect(formatted).toBe('18.4412°N, 77.4520°E (-2540m)');
  });

  it('correctly verifies bounding box membership for Jezero Crater', () => {
    expect(isCoordinateInBounds(JEZERO_CENTER_COORDINATE, JEZERO_MISSION_BOUNDS)).toBe(true);
    // Olympus Mons (approx 18.65°N, 226.2°E / -133.8°E) should be outside
    expect(isCoordinateInBounds({ lat: 18.65, lon: -133.8 }, JEZERO_MISSION_BOUNDS)).toBe(false);
  });

  it('samples authentic Jezero MOLA elevation and computes positive slope', () => {
    const sample = sampleJezeroElevationModel(JEZERO_CENTER_COORDINATE);
    expect(sample.elevationMeters).toBeLessThan(0); // below datum
    expect(sample.elevationMeters).toBeGreaterThan(-3000);
    expect(sample.slopeDegrees).toBeGreaterThanOrEqual(0);
    expect(sample.source.isAuthenticMeasurement).toBe(true);
    expect(sample.source.type).toBe('REAL_MOLA_AEROID');
  });
});
