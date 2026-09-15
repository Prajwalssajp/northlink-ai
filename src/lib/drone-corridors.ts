import { DroneCorridor } from './types';

export const INITIAL_DRONE_CORRIDORS: DroneCorridor[] = [
  {
    id: 'corridor_iaf_kumbhirgram_silchar',
    baseName: 'IAF Forward Base Kumbhirgram (Silchar Air Station)',
    agency: 'IAF',
    originCoordinates: [24.9128, 92.9790],
    targetDistrict: 'East Jaintia Hills (Sonapur Landslide Isolation Pocket)',
    targetCoordinates: [25.1320, 92.4215],
    flightDistanceKm: 68,
    flightTimeMinutes: 24,
    payloadCapacityKg: 850, // Mi-17 / Heavy-lift UAV
    status: 'READY',
    suitableCommodities: ['MEDICINES', 'EMERGENCY_SUPPLIES'],
  },
  {
    id: 'corridor_bro_haflong_dima_hasao',
    baseName: 'BRO Task Force Helipad (Haflong Stadium LZ)',
    agency: 'BRO',
    originCoordinates: [25.1833, 93.0167],
    targetDistrict: 'Jatinga Gorge & Harangajao Valley',
    targetCoordinates: [25.0200, 92.9000],
    flightDistanceKm: 32,
    flightTimeMinutes: 12,
    payloadCapacityKg: 350, // Medium Cargo Quadcopter
    status: 'READY',
    suitableCommodities: ['MEDICINES', 'FOOD'],
  },
  {
    id: 'corridor_hashimara_sikkim',
    baseName: 'Hashimara Air Force Station (Sikkim Support Wing)',
    agency: 'IAF',
    originCoordinates: [26.7020, 89.3700],
    targetDistrict: 'Melli / Teesta 29th Mile Flood Breach',
    targetCoordinates: [27.0500, 88.4300],
    flightDistanceKm: 110,
    flightTimeMinutes: 38,
    payloadCapacityKg: 1200, // Chinook / ALH Dhruv Detachment
    status: 'READY',
    suitableCommodities: ['MEDICINES', 'EMERGENCY_SUPPLIES', 'FOOD'],
  },
  {
    id: 'corridor_ndrf_tezpur',
    baseName: 'NDRF 1st Battalion Drone Launchpad (Tezpur Airbase)',
    agency: 'NDRF',
    originCoordinates: [26.7092, 92.7975],
    targetDistrict: 'Bhalukpong Mountain Border (West Kameng)',
    targetCoordinates: [27.0100, 92.6500],
    flightDistanceKm: 52,
    flightTimeMinutes: 18,
    payloadCapacityKg: 200,
    status: 'READY',
    suitableCommodities: ['MEDICINES', 'EMERGENCY_SUPPLIES'],
  }
];
