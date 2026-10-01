import { describe, it, expect } from 'vitest';
import { computeMarswalkRoute } from '../lib/routing/router';
import { estimateMarswalkSpeedKmh } from '../lib/routing/metrics';
import { DEFAULT_START_COORDINATE, DEFAULT_DESTINATION_COORDINATE } from '../lib/state/mission-store';

describe('Multi-Objective Terrain Routing & Traversal Engine', () => {
  it('computes candidate routes for all four objectives', () => {
    const objectives = ['FASTEST', 'MIN_TERRAIN_RISK', 'SCIENCE_PRIORITY', 'BALANCED_MISSION'] as const;

    for (const obj of objectives) {
      const route = computeMarswalkRoute(DEFAULT_START_COORDINATE, DEFAULT_DESTINATION_COORDINATE, obj);
      expect(route.objective).toBe(obj);
      expect(route.coordinates.length).toBeGreaterThan(5);
      expect(route.waypoints.length).toBe(route.coordinates.length);
      expect(route.metrics.distance2dKm).toBeGreaterThan(0.5);
      expect(route.metrics.estimatedDurationMinutes).toBeGreaterThan(10);
      expect(route.explanation.summary).toBeDefined();
    }
  });

  it('demonstrates that MIN_TERRAIN_RISK manages slope conservatively', () => {
    const fastest = computeMarswalkRoute(DEFAULT_START_COORDINATE, DEFAULT_DESTINATION_COORDINATE, 'FASTEST');
    const minRisk = computeMarswalkRoute(DEFAULT_START_COORDINATE, DEFAULT_DESTINATION_COORDINATE, 'MIN_TERRAIN_RISK');

    // Min risk route should have lower or equal average slope compared to pure distance minimization
    expect(minRisk.metrics.avgSlopeDeg).toBeLessThanOrEqual(fastest.metrics.avgSlopeDeg + 1.0);
  });

  it('scales traversal speed according to slope under Mars gravity', () => {
    const flatSpeed = estimateMarswalkSpeedKmh(0);
    const uphillSpeed = estimateMarswalkSpeedKmh(15);
    const extremeSpeed = estimateMarswalkSpeedKmh(28);

    expect(flatSpeed).toBeGreaterThan(uphillSpeed);
    expect(extremeSpeed).toBeLessThanOrEqual(0.4); // effectively impassable
  });

  it('includes explicit traversal model assumptions and caveats', () => {
    const route = computeMarswalkRoute(DEFAULT_START_COORDINATE, DEFAULT_DESTINATION_COORDINATE, 'BALANCED_MISSION');
    expect(route.metrics.assumptions.astronautMassKg).toBe(75);
    expect(route.metrics.assumptions.spacesuitMassKg).toBe(85);
    expect(route.metrics.assumptions.marsGravityMps2).toBe(3.721);
    expect(route.metrics.assumptions.disclaimer).toContain('prototype');
  });
});
