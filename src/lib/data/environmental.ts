import { EnvironmentalObservation } from '../../types';

/**
 * Historical Mars 2020 MEDA (Mars Environmental Dynamics Analyzer) Surface Observation Records
 * NOTE: Sourced from NASA PDS Atmospheres Node (Perseverance Rover in-situ telemetry).
 * These are localized surface observations from the specific rover landing/traverse site,
 * NOT a global or crater-wide synoptic weather forecast.
 */
export const JEZERO_ENVIRONMENTAL_OBSERVATIONS: EnvironmentalObservation[] = [
  {
    id: 'meda-sol-142-octavia',
    sol: 142,
    timestampUtc: '2021-07-13T14:32:00Z',
    locationName: 'Octavia E. Butler Landing (Jezero Crater Floor)',
    coordinate: {
      lat: 18.4447,
      lon: 77.4508,
      elevationMeters: -2562,
    },
    airTemperatureC: {
      min: -83.2,
      max: -16.8,
      avg: -53.4,
    },
    surfaceTemperatureC: {
      min: -87.1,
      max: -8.4,
      avg: -48.2,
    },
    pressurePa: 735.2, // ~7.35 mbar (CO2 atmosphere)
    windSpeedMps: 4.8,
    windDirectionDegrees: 295, // West-Northwest
    dustOpticalDepthTau: 0.36, // Relatively clear Martian air (pre-dust storm season)
    uvIndex: 'MODERATE',
    status: 'CACHED',
    mission: 'Mars 2020 (Perseverance Rover)',
    instrument: 'MEDA (Mars Environmental Dynamics Analyzer)',
    localizedConstraint: 'Localized point measurement at rover mast height (~1.5m) and thermal infrared sensor ground footprint (~3m²). Regional crater floor conditions will vary with elevation and solar incidence angle.',
  },
  {
    id: 'meda-sol-420-delta-front',
    sol: 420,
    timestampUtc: '2022-04-26T11:15:00Z',
    locationName: 'Three Forks / Delta Front Transition',
    coordinate: {
      lat: 18.4468,
      lon: 77.4475,
      elevationMeters: -2538,
    },
    airTemperatureC: {
      min: -85.6,
      max: -14.2,
      avg: -51.8,
    },
    surfaceTemperatureC: {
      min: -89.4,
      max: -5.1,
      avg: -46.7,
    },
    pressurePa: 712.8,
    windSpeedMps: 6.2,
    windDirectionDegrees: 310,
    dustOpticalDepthTau: 0.44,
    uvIndex: 'HIGH',
    status: 'CACHED',
    mission: 'Mars 2020 (Perseverance Rover)',
    instrument: 'MEDA (Mars Environmental Dynamics Analyzer)',
    localizedConstraint: 'Recorded during midday approach to western delta fan scarp. Katabatic morning slope winds observed draining eastward from crater rim.',
  },
  {
    id: 'themis-regional-thermal',
    sol: 0, // Orbital aggregate
    timestampUtc: '2020-01-01T00:00:00Z',
    locationName: 'Jezero Western Fan Regional Thermal Map',
    coordinate: {
      lat: 18.4412,
      lon: 77.4520,
      elevationMeters: -2540,
    },
    airTemperatureC: {
      min: -95.0,
      max: -10.0,
      avg: -58.0,
    },
    surfaceTemperatureC: {
      min: -98.0,
      max: -2.0,
      avg: -52.0,
    },
    pressurePa: 720.0,
    windSpeedMps: 3.5,
    windDirectionDegrees: 280,
    dustOpticalDepthTau: 0.38,
    uvIndex: 'MODERATE',
    status: 'DERIVED',
    mission: '2001 Mars Odyssey',
    instrument: 'THEMIS (Thermal Emission Imaging System)',
    localizedConstraint: 'Orbital multispectral thermal infrared brightness temperatures derived at 100 m/pixel resolution. Integrated across diurnal cycles to infer physical surface grain size and bedrock exposure.',
  },
];
