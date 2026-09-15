import { ColdChainTelemetry } from './types';

export const INITIAL_COLD_CHAIN_TELEMETRY: ColdChainTelemetry[] = [
  {
    vehicleId: 'veh_01',
    shipmentId: 'ship_01',
    cargoDescription: 'Rotavirus & Polio Vaccines (Cold-Chain Life Saving)',
    currentTempC: 3.4,
    targetMinTempC: 2.0,
    targetMaxTempC: 8.0,
    ambientTempC: 28.5,
    humidityPercent: 78,
    batteryReserveHours: 6.2,
    compressorStatus: 'ACTIVE',
    spoilageRiskHours: 5.5,
    spoilageStatus: 'OPTIMAL',
    lastLoggedAt: new Date().toISOString(),
  },
  {
    vehicleId: 'veh_04',
    shipmentId: 'ship_04',
    cargoDescription: 'Blood Plasma & Dialysis Concentrates',
    currentTempC: 6.8,
    targetMinTempC: 2.0,
    targetMaxTempC: 8.0,
    ambientTempC: 31.0,
    humidityPercent: 82,
    batteryReserveHours: 2.4,
    compressorStatus: 'ACTIVE',
    spoilageRiskHours: 2.1,
    spoilageStatus: 'WARNING',
    lastLoggedAt: new Date().toISOString(),
  },
  {
    vehicleId: 'veh_08',
    shipmentId: 'ship_08',
    cargoDescription: 'Anti-Venom Serums & Critical Insulin Stock',
    currentTempC: 8.4,
    targetMinTempC: 2.0,
    targetMaxTempC: 8.0,
    ambientTempC: 32.5,
    humidityPercent: 88,
    batteryReserveHours: 1.1,
    compressorStatus: 'FAULT',
    spoilageRiskHours: 0.9,
    spoilageStatus: 'CRITICAL_SPOILAGE',
    lastLoggedAt: new Date().toISOString(),
  },
];

export function calculateColdChainSpoilage(
  currentTemp: number,
  ambientTemp: number,
  batteryHours: number,
  projectedDelayHours: number
) {
  // Thermal decay rate in mountain conditions if compressor throttles
  const thermalLeakPerHr = 0.85; // degrees C per hour without active cooling
  const effectiveUnpoweredHours = Math.max(0, projectedDelayHours - batteryHours);
  const projectedFinalTemp = currentTemp + (effectiveUnpoweredHours * thermalLeakPerHr);

  const hoursUntilCritical = currentTemp >= 8.0
    ? 0
    : parseFloat(((8.0 - currentTemp) / thermalLeakPerHr + batteryHours).toFixed(1));

  const isSpoilageRisk = projectedFinalTemp > 8.0;

  return {
    projectedFinalTemp: parseFloat(projectedFinalTemp.toFixed(1)),
    hoursUntilCritical,
    isSpoilageRisk,
    thermalSurgeRisk: projectedFinalTemp >= 10.0 ? 'SEVERE_LOSS' : projectedFinalTemp > 8.0 ? 'MODERATE_RISK' : 'SAFE',
  };
}
