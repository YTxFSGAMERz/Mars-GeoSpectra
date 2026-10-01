import { describe, it, expect } from 'vitest';
import { MISSION_LAYERS_CATALOG } from '../lib/data/layers';
import { JEZERO_SCIENCE_TARGETS } from '../lib/data/science-targets';
import { PROVENANCE_REGISTRY } from '../lib/data/provenance';
import { JEZERO_ENVIRONMENTAL_OBSERVATIONS } from '../lib/data/environmental';

describe('Data Provenance & Scientific Integrity Gates', () => {
  it('ensures every mission layer references a valid provenance record', () => {
    for (const layer of MISSION_LAYERS_CATALOG) {
      expect(layer.provenanceId).toBeDefined();
      const prov = PROVENANCE_REGISTRY[layer.provenanceId];
      expect(prov, `Missing provenance record for layer: ${layer.id}`).toBeDefined();
      expect(prov.hostOrganization).toBeDefined();
      expect(prov.derivationChain.length).toBeGreaterThan(0);
      expect(prov.uncertaintiesAndLimitations.length).toBeGreaterThan(0);
    }
  });

  it('ensures every science target has verified mission data, coordinates, and caveats', () => {
    for (const target of JEZERO_SCIENCE_TARGETS) {
      expect(target.coordinate.lat).toBeGreaterThanOrEqual(18.0);
      expect(target.coordinate.lat).toBeLessThanOrEqual(19.0);
      expect(target.coordinate.lon).toBeGreaterThanOrEqual(77.0);
      expect(target.coordinate.lon).toBeLessThanOrEqual(78.0);
      expect(target.caveats.length).toBeGreaterThan(10);
      expect(['HIGH', 'MODERATE', 'CANDIDATE', 'REQUIRES_CONFIRMATION']).toContain(target.confidence);
    }
  });

  it('ensures environmental records disclose localized constraints', () => {
    for (const obs of JEZERO_ENVIRONMENTAL_OBSERVATIONS) {
      expect(obs.localizedConstraint).toBeDefined();
      expect(obs.localizedConstraint.length).toBeGreaterThan(20);
      expect(obs.airTemperatureC.min).toBeLessThan(obs.airTemperatureC.max);
    }
  });
});
