export type Role = 'ADMIN' | 'FIELD_OFFICER' | 'LOGISTICS_MANAGER' | 'DRIVER' | 'VIEWER';

export type IncidentType =
  | 'LANDSLIDE'
  | 'FLOOD'
  | 'HEAVY_RAINFALL'
  | 'ROAD_DAMAGE'
  | 'BRIDGE_DAMAGE'
  | 'TRAFFIC'
  | 'OTHER';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 'ACTIVE' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';

export type AccessibilityStatus = 'OPEN' | 'RESTRICTED' | 'BLOCKED' | 'CRITICAL_RISK';

export type CommodityType =
  | 'MEDICINES'
  | 'FOOD'
  | 'AGRICULTURAL_PRODUCE'
  | 'CONSTRUCTION_MATERIALS'
  | 'EMERGENCY_SUPPLIES';

export type Priority = 'CRITICAL' | 'HIGH' | 'STANDARD' | 'LOW';

export type ShipmentStatus = 'PLANNED' | 'IN_TRANSIT' | 'DELAYED' | 'DELIVERED' | 'CANCELLED';

export type VehicleStatus = 'IN_TRANSIT' | 'IDLE' | 'MAINTENANCE' | 'DIVERTED';

export type VehicleType = 'HEAVY_TRUCK' | 'MEDIUM_CARGO' | 'COLD_CHAIN_VAN' | 'EMERGENCY_4X4';

export type SyncStatus = 'SYNCED' | 'PENDING_SYNC' | 'FAILED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: string;
  name: string;
  state: string;
  districtCode: string;
  latitude: number;
  longitude: number;
  boundaryGeoJson?: string;
  createdAt: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  highwayNumber: string;
  source: string;
  destination: string;
  roadType: string;
  accessibilityStatus: AccessibilityStatus;
  riskLevel: Severity;
  averageTravelTime: number; // in minutes
  coordinatesGeoJson: string; // JSON string of [lat, lng][]
  lastUpdated: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  incidentType: IncidentType;
  severity: Severity;
  latitude: number;
  longitude: number;
  locationName?: string;
  districtId?: string;
  districtName?: string;
  state?: string;
  roadSegmentId?: string;
  reportedBy?: string;
  imageUrl?: string;
  status: IncidentStatus;
  reportedAt: string;
  resolvedAt?: string;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  originDistrictId?: string;
  destDistrictId?: string;
  distance: number; // km
  estimatedDuration: number; // minutes
  riskScore: number; // 0-100
  routeStatus: AccessibilityStatus;
  coordinatesGeoJson: string;
  alternativeRouteId?: string;
  createdAt: string;
}

export interface RiskFactor {
  name: string;
  score: number; // 0 - 100
  weight: number; // 0.0 - 1.0
  weightedScore: number;
  description: string;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

export interface RouteRiskAssessment {
  id: string;
  routeId: string;
  riskScore: number;
  riskCategory: Severity;
  disruptionProbability: number; // 0 - 1
  predictedDelay: number; // minutes
  contributingFactors: RiskFactor[];
  modelVersion: string;
  assessedAt: string;
  recommendedAction: string;
  mlPrediction?: {
    modelType: string;
    trainingSamples: number;
    metrics: { accuracy: number; delay_rmse_hours: number; r2_score: number };
    featureImportances: Record<string, number>;
    treeVotes: number[];
  };
  llmBriefing?: {
    tacticalDirective: string;
    geologicalThreatSummary: string;
    recommendedConvoyProtocols: string[];
    weatherForecastAdvisory: string;
    confidenceScore: number;
  };
  alternativeRouteRecommendation?: {
    id: string;
    name: string;
    distanceDiffKm: number;
    delaySavedMinutes: number;
    riskScore: number;
    whyRecommended: string;
  };
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  vehicleType: VehicleType;
  currentLatitude: number;
  currentLongitude: number;
  speed: number;
  status: VehicleStatus;
  batteryOrFuel: number;
  lastUpdated: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  commodityType: CommodityType;
  priority: Priority;
  origin: string;
  destination: string;
  vehicleId?: string;
  vehicle?: Vehicle;
  routeId?: string;
  status: ShipmentStatus;
  expectedDeliveryTime: string;
  actualDeliveryTime?: string;
  delayMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  affectedRegion: string;
  incidentId?: string;
  status: 'ACTIVE' | 'READ' | 'RESOLVED';
  translations?: Record<string, { title: string; message: string }>;
  createdAt: string;
}

export interface FieldReport {
  id: string;
  reporterId?: string;
  reporterName: string;
  incidentType: IncidentType;
  severity: Severity;
  description: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  imageAttachment?: string;
  syncStatus: SyncStatus;
  createdAt: string;
}

export interface DashboardSummary {
  activeShipments: number;
  monitoredRoutes: number;
  atRiskRoutes: number;
  activeIncidents: number;
  vehiclesInTransit: number;
  criticalAlerts: number;
  accessibleRoadsCount: number;
  blockedRoadsCount: number;
  restrictedRoadsCount: number;
  databaseStatus: 'POSTGRESQL_CONNECTED' | 'REVERTED_RESILIENT_MODE';
  lastUpdated: string;
}

export interface ColdChainTelemetry {
  vehicleId: string;
  shipmentId: string;
  cargoDescription: string;
  currentTempC: number;
  targetMinTempC: number;
  targetMaxTempC: number;
  ambientTempC: number;
  humidityPercent: number;
  batteryReserveHours: number;
  compressorStatus: 'ACTIVE' | 'STANDBY' | 'FAULT';
  spoilageRiskHours: number;
  spoilageStatus: 'OPTIMAL' | 'WARNING' | 'CRITICAL_SPOILAGE';
  lastLoggedAt: string;
}

export interface DroneCorridor {
  id: string;
  baseName: string;
  agency: 'IAF' | 'BRO' | 'NDRF' | 'CIVIL';
  originCoordinates: [number, number];
  targetDistrict: string;
  targetCoordinates: [number, number];
  flightDistanceKm: number;
  flightTimeMinutes: number;
  payloadCapacityKg: number;
  status: 'READY' | 'AIRBORNE' | 'MAINTENANCE';
  suitableCommodities: string[];
}

export interface VisionHazardScan {
  id: string;
  imageUrl: string;
  hazardType: IncidentType;
  confidencePercent: number;
  blockagePercentage: number;
  estimatedDebrisVolumeM3: number;
  structuralIntegrityStatus: 'INTACT' | 'PARTIAL_COLLAPSE' | 'CATASTROPHIC_SEVERANCE';
  recommendedDetachment: string;
  estimatedClearanceHours: number;
  detectedAt: string;
}

export interface DispatchManifest {
  manifestNumber: string;
  orderDate: string;
  authorityAgency: 'NDMA' | 'BRO' | 'ASDMA' | 'MHA';
  clearanceStatus: 'CLEARED_GREEN_CORRIDOR' | 'RESTRICTED_ESCORT' | 'BYPASS_MANDATED';
  convoyLeader: string;
  convoyLeaderContact: string;
  radioFrequencyVHF: string;
  originHub: string;
  destinationHub: string;
  selectedCorridorName: string;
  cargoManifest: { item: string; quantity: string; category: CommodityType; priority: Priority }[];
  vehiclesAssigned: string[];
  emergencyWaypoints: { milestone: string; km: number; status: string }[];
  aiSafetyScore: number;
  safetyOfficerApproval: string;
  verificationQrPayload: string;
}
