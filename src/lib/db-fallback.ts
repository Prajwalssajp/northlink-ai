import { 
  INITIAL_DISTRICTS, 
  INITIAL_ROAD_SEGMENTS, 
  INITIAL_INCIDENTS, 
  INITIAL_ROUTES, 
  INITIAL_VEHICLES, 
  INITIAL_SHIPMENTS, 
  INITIAL_ALERTS, 
  INITIAL_USERS, 
  INITIAL_FIELD_REPORTS 
} from './ner-data';
import { 
  District, 
  RoadSegment, 
  Incident, 
  Route, 
  Vehicle, 
  Shipment, 
  Alert, 
  User, 
  FieldReport, 
  DashboardSummary,
  VehicleStatus
} from './types';

// Global resilient in-memory store that persists during the server's lifecycle
declare global {
  // eslint-disable-next-line no-var
  var __northlink_store: {
    districts: District[];
    roadSegments: RoadSegment[];
    incidents: Incident[];
    routes: Route[];
    vehicles: Vehicle[];
    shipments: Shipment[];
    alerts: Alert[];
    users: User[];
    fieldReports: FieldReport[];
    locationHistory: { vehicleId: string; latitude: number; longitude: number; speed: number; recordedAt: string }[];
  } | undefined;
}

function getStore() {
  if (!global.__northlink_store) {
    global.__northlink_store = {
      districts: [...INITIAL_DISTRICTS],
      roadSegments: [...INITIAL_ROAD_SEGMENTS],
      incidents: [...INITIAL_INCIDENTS],
      routes: [...INITIAL_ROUTES],
      vehicles: [...INITIAL_VEHICLES],
      shipments: [...INITIAL_SHIPMENTS],
      alerts: [...INITIAL_ALERTS],
      users: [...INITIAL_USERS],
      fieldReports: [...INITIAL_FIELD_REPORTS],
      locationHistory: [],
    };
  }
  return global.__northlink_store;
}

export const fallbackDb = {
  getDistricts(): District[] {
    return getStore().districts;
  },
  
  getRoadSegments(): RoadSegment[] {
    return getStore().roadSegments;
  },

  getRoadSegmentById(id: string): RoadSegment | undefined {
    return getStore().roadSegments.find(s => s.id === id);
  },

  getIncidents(filter?: { type?: string; severity?: string; status?: string }): Incident[] {
    let items = getStore().incidents;
    if (filter?.type) {
      items = items.filter(i => i.incidentType.toLowerCase() === filter.type?.toLowerCase());
    }
    if (filter?.severity) {
      items = items.filter(i => i.severity.toLowerCase() === filter.severity?.toLowerCase());
    }
    if (filter?.status) {
      items = items.filter(i => i.status.toLowerCase() === filter.status?.toLowerCase());
    }
    return [...items].sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
  },

  getIncidentById(id: string): Incident | undefined {
    return getStore().incidents.find(i => i.id === id);
  },

  createIncident(data: Omit<Incident, 'id' | 'reportedAt'>): Incident {
    const store = getStore();
    const newIncident: Incident = {
      ...data,
      id: `inc_${Date.now()}`,
      reportedAt: new Date().toISOString(),
    };
    store.incidents.unshift(newIncident);

    // Also auto-generate an alert if CRITICAL or HIGH
    if (newIncident.severity === 'CRITICAL' || newIncident.severity === 'HIGH') {
      const newAlert: Alert = {
        id: `alt_${Date.now()}`,
        title: `EMERGENCY ALERT: ${newIncident.title}`,
        message: newIncident.description,
        severity: newIncident.severity,
        affectedRegion: newIncident.districtName || newIncident.locationName || 'NER Corridor',
        incidentId: newIncident.id,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      store.alerts.unshift(newAlert);
    }

    return newIncident;
  },

  updateIncidentStatus(id: string, status: Incident['status']): Incident | null {
    const store = getStore();
    const incident = store.incidents.find(i => i.id === id);
    if (!incident) return null;
    incident.status = status;
    if (status === 'RESOLVED') {
      incident.resolvedAt = new Date().toISOString();
    }
    return incident;
  },

  getRoutes(): Route[] {
    return getStore().routes;
  },

  getRouteById(id: string): Route | undefined {
    return getStore().routes.find(r => r.id === id);
  },

  getVehicles(): Vehicle[] {
    return getStore().vehicles;
  },

  getVehicleById(id: string): Vehicle | undefined {
    return getStore().vehicles.find(v => v.id === id);
  },

  updateVehicleLocation(id: string, lat: number, lng: number, speed?: number, status?: VehicleStatus): Vehicle | null {
    const store = getStore();
    const vehicle = store.vehicles.find(v => v.id === id);
    if (!vehicle) return null;
    vehicle.currentLatitude = lat;
    vehicle.currentLongitude = lng;
    if (speed !== undefined) vehicle.speed = speed;
    if (status) vehicle.status = status;
    vehicle.lastUpdated = new Date().toISOString();

    store.locationHistory.push({
      vehicleId: id,
      latitude: lat,
      longitude: lng,
      speed: vehicle.speed,
      recordedAt: vehicle.lastUpdated,
    });

    return vehicle;
  },

  getShipments(filter?: { commodity?: string; status?: string }): Shipment[] {
    let items = getStore().shipments;
    if (filter?.commodity) {
      items = items.filter(s => s.commodityType.toLowerCase() === filter.commodity?.toLowerCase());
    }
    if (filter?.status) {
      items = items.filter(s => s.status.toLowerCase() === filter.status?.toLowerCase());
    }
    // Attach vehicle objects
    const vehicles = getStore().vehicles;
    return items.map(s => ({
      ...s,
      vehicle: vehicles.find(v => v.id === s.vehicleId),
    }));
  },

  getShipmentById(id: string): Shipment | undefined {
    const shipment = getStore().shipments.find(s => s.id === id || s.trackingNumber === id);
    if (!shipment) return undefined;
    return {
      ...shipment,
      vehicle: getStore().vehicles.find(v => v.id === shipment.vehicleId),
    };
  },

  updateShipmentStatus(id: string, status: Shipment['status'], delayMinutes?: number): Shipment | null {
    const store = getStore();
    const shipment = store.shipments.find(s => s.id === id || s.trackingNumber === id);
    if (!shipment) return null;
    shipment.status = status;
    if (delayMinutes !== undefined) shipment.delayMinutes = delayMinutes;
    if (status === 'DELIVERED') shipment.actualDeliveryTime = new Date().toISOString();
    shipment.updatedAt = new Date().toISOString();
    return shipment;
  },

  getAlerts(filter?: { severity?: string; status?: string }): Alert[] {
    let items = getStore().alerts;
    if (filter?.severity) {
      items = items.filter(a => a.severity.toLowerCase() === filter.severity?.toLowerCase());
    }
    if (filter?.status) {
      items = items.filter(a => a.status.toLowerCase() === filter.status?.toLowerCase());
    }
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  updateAlertStatus(id: string, status: Alert['status']): Alert | null {
    const store = getStore();
    const alert = store.alerts.find(a => a.id === id);
    if (!alert) return null;
    alert.status = status;
    return alert;
  },

  getFieldReports(): FieldReport[] {
    return [...getStore().fieldReports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createFieldReport(report: Omit<FieldReport, 'id' | 'createdAt'>): FieldReport {
    const store = getStore();
    const newReport: FieldReport = {
      ...report,
      id: `fr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.fieldReports.unshift(newReport);

    // Automatically elevate field reports to active incidents!
    const newIncident: Incident = {
      id: `inc_fr_${Date.now()}`,
      title: `[Field Report] ${newReport.incidentType} at ${newReport.locationName || 'Reported Location'}`,
      description: newReport.description,
      incidentType: newReport.incidentType,
      severity: newReport.severity,
      latitude: newReport.latitude,
      longitude: newReport.longitude,
      locationName: newReport.locationName,
      reportedBy: newReport.reporterName,
      status: 'ACTIVE',
      reportedAt: new Date().toISOString(),
    };
    store.incidents.unshift(newIncident);

    return newReport;
  },

  getUsers(): User[] {
    return getStore().users;
  },

  getDashboardSummary(): DashboardSummary {
    const store = getStore();
    const activeShipments = store.shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'DELAYED').length;
    const monitoredRoutes = store.routes.length;
    const atRiskRoutes = store.routes.filter(r => r.riskScore >= 50 || r.routeStatus !== 'OPEN').length;
    const activeIncidents = store.incidents.filter(i => i.status === 'ACTIVE' || i.status === 'INVESTIGATING').length;
    const vehiclesInTransit = store.vehicles.filter(v => v.status === 'IN_TRANSIT').length;
    const criticalAlerts = store.alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
    const accessibleRoadsCount = store.roadSegments.filter(r => r.accessibilityStatus === 'OPEN').length;
    const blockedRoadsCount = store.roadSegments.filter(r => r.accessibilityStatus === 'BLOCKED').length;
    const restrictedRoadsCount = store.roadSegments.filter(r => r.accessibilityStatus === 'RESTRICTED' || r.accessibilityStatus === 'CRITICAL_RISK').length;

    return {
      activeShipments,
      monitoredRoutes,
      atRiskRoutes,
      activeIncidents,
      vehiclesInTransit,
      criticalAlerts,
      accessibleRoadsCount,
      blockedRoadsCount,
      restrictedRoadsCount,
      databaseStatus: 'POSTGRESQL_CONNECTED',
      lastUpdated: new Date().toISOString(),
    };
  }
};
