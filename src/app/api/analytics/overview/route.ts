import { NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET() {
  try {
    const incidents = fallbackDb.getIncidents();
    const shipments = fallbackDb.getShipments();
    const roads = fallbackDb.getRoadSegments();

    // 1. Incidents by type
    const incidentsByTypeMap: Record<string, number> = {};
    incidents.forEach((i) => {
      incidentsByTypeMap[i.incidentType] = (incidentsByTypeMap[i.incidentType] || 0) + 1;
    });
    const incidentsByType = Object.entries(incidentsByTypeMap).map(([type, count]) => ({
      name: type.replace('_', ' '),
      count,
    }));

    // 2. Incidents by state/district
    const incidentsByStateMap: Record<string, number> = {};
    incidents.forEach((i) => {
      const state = i.state || 'NER Corridors';
      incidentsByStateMap[state] = (incidentsByStateMap[state] || 0) + 1;
    });
    const incidentsByState = Object.entries(incidentsByStateMap).map(([state, count]) => ({
      state,
      count,
    }));

    // 3. Shipment status breakdown
    const shipmentStatusMap: Record<string, number> = {};
    shipments.forEach((s) => {
      shipmentStatusMap[s.status] = (shipmentStatusMap[s.status] || 0) + 1;
    });
    const shipmentsByStatus = Object.entries(shipmentStatusMap).map(([status, count]) => ({
      status: status.replace('_', ' '),
      count,
    }));

    // 4. Delay by commodity
    const delayByCommodityMap: Record<string, { totalDelay: number; count: number }> = {};
    shipments.forEach((s) => {
      if (!delayByCommodityMap[s.commodityType]) {
        delayByCommodityMap[s.commodityType] = { totalDelay: 0, count: 0 };
      }
      delayByCommodityMap[s.commodityType].totalDelay += s.delayMinutes;
      delayByCommodityMap[s.commodityType].count += 1;
    });
    const delayByCommodity = Object.entries(delayByCommodityMap).map(([commodity, data]) => ({
      commodity: commodity.replace('_', ' '),
      avgDelayHours: parseFloat((data.totalDelay / (data.count * 60)).toFixed(1)),
      shipmentCount: data.count,
    }));

    // 5. Route Accessibility breakdown
    const accessibilityMap: Record<string, number> = {};
    roads.forEach((r) => {
      accessibilityMap[r.accessibilityStatus] = (accessibilityMap[r.accessibilityStatus] || 0) + 1;
    });
    const routeAccessibility = Object.entries(accessibilityMap).map(([status, count]) => ({
      status: status.replace('_', ' '),
      count,
    }));

    return NextResponse.json({
      success: true,
      data: {
        incidentsByType,
        incidentsByState,
        shipmentsByStatus,
        delayByCommodity,
        routeAccessibility,
        totalIncidents: incidents.length,
        totalShipments: shipments.length,
        totalCorridors: roads.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
