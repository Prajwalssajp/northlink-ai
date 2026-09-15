'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Map as MapIcon, 
  Truck, 
  AlertTriangle, 
  Layers, 
  RefreshCw, 
  FileText, 
  Sparkles, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import KpiCards from '@/components/dashboard/KpiCards';
import AtRiskCorridors from '@/components/dashboard/AtRiskCorridors';
import RecentIncidents from '@/components/dashboard/RecentIncidents';
import EssentialGoodsFeed from '@/components/dashboard/EssentialGoodsFeed';
import MapContainerWrapper from '@/components/gis/MapContainerWrapper';
import { useDemo } from '@/lib/demo-context';
import { DashboardSummary, RoadSegment, Incident, Vehicle, Shipment } from '@/lib/types';

export default function DashboardOverviewPage() {
  const { refreshTrigger } = useDemo();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [roads, setRoads] = useState<RoadSegment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [riskRoutes, setRiskRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter toggles for dashboard map preview
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [showVehicles, setShowVehicles] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, incRes, vehRes, shipRes, riskRes] = await Promise.all([
        fetch('/api/dashboard/summary').then(r => r.json()),
        fetch('/api/incidents').then(r => r.json()),
        fetch('/api/vehicles').then(r => r.json()),
        fetch('/api/shipments').then(r => r.json()),
        fetch('/api/dashboard/risk-routes').then(r => r.json()),
      ]);

      if (sumRes.success) setSummary(sumRes.summary);
      if (incRes.success) setIncidents(incRes.incidents);
      if (vehRes.success) setVehicles(vehRes.vehicles);
      if (shipRes.success) setShipments(shipRes.shipments);
      if (riskRes.success) setRiskRoutes(riskRes.routes);

      // Fetch roads from fallback data
      const routesRes = await fetch('/api/routes').then(r => r.json());
      if (routesRes.success) {
        // synthesize road segments representation for map
        const synthesizedRoads: RoadSegment[] = routesRes.routes.map((r: any) => ({
          id: r.id,
          name: r.name,
          highwayNumber: r.name.includes('NH-') ? r.name.split(' ')[0] : 'NH-Corridor',
          source: r.origin,
          destination: r.destination,
          roadType: 'Mountain National Highway',
          accessibilityStatus: r.routeStatus,
          riskLevel: r.assessment?.riskCategory || 'MEDIUM',
          averageTravelTime: r.estimatedDuration,
          coordinatesGeoJson: r.coordinatesGeoJson,
          lastUpdated: new Date().toISOString(),
        }));
        setRoads(synthesizedRoads);
      }
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Hero */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0b1324] via-[#09101d] to-[#070b13] p-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 border border-cyan-800/60">
              Disaster Logistics Command
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold text-slate-300">North Eastern Region of India (8 States)</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-black tracking-tight text-white sm:text-3xl">
            NORTHLINK AI <span className="text-cyan-400">Regional Intelligence Center</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl">
            Real-time geospatial monitoring, AI disruption prediction, terrain vulnerability modeling, and lifeline corridor rerouting across Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5 lg:mt-0">
          <Link
            href="/route-intelligence"
            className="flex items-center space-x-2 rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 shadow-lg shadow-cyan-950/60"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Route Reroute Engine</span>
          </Link>
          <Link
            href="/field-reports"
            className="flex items-center space-x-2 rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-cyan-500 hover:text-white"
          >
            <FileText className="h-4 w-4 text-cyan-400" />
            <span>Submit Field Report</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards summary={summary} loading={loading} />

      {/* Main Grid: Regional GIS Map Preview + At-Risk Corridors */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Large Map Panel (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#090d16] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <MapIcon className="h-4 w-4 text-cyan-400" />
              <div>
                <h3 className="font-semibold text-sm text-white">NER Real-Time Accessibility Grid</h3>
                <p className="text-[11px] text-slate-400">Interactive spatial layer showing live landslides, flash floods & vehicle vectors</p>
              </div>
            </div>

            {/* Layer Filter Toggles */}
            <div className="flex items-center space-x-1.5 text-xs">
              <button
                onClick={() => setShowRoads(!showRoads)}
                className={`rounded px-2 py-1 text-[11px] font-medium transition-all ${
                  showRoads ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Roads ({roads.length})
              </button>
              <button
                onClick={() => setShowIncidents(!showIncidents)}
                className={`rounded px-2 py-1 text-[11px] font-medium transition-all ${
                  showIncidents ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Incidents ({incidents.length})
              </button>
              <button
                onClick={() => setShowVehicles(!showVehicles)}
                className={`rounded px-2 py-1 text-[11px] font-medium transition-all ${
                  showVehicles ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Vehicles ({vehicles.length})
              </button>
              <Link
                href="/live-map"
                className="ml-2 flex items-center space-x-1 rounded bg-slate-800 px-2 py-1 text-[11px] font-semibold text-cyan-400 hover:bg-slate-700"
              >
                <span>Fullscreen GIS</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Interactive GIS Map */}
          <MapContainerWrapper
            roads={roads}
            incidents={incidents}
            vehicles={vehicles}
            showRoads={showRoads}
            showIncidents={showIncidents}
            showVehicles={showVehicles}
            height="460px"
          />
        </div>

        {/* Right Col: High-Risk Transport Corridors */}
        <div className="space-y-6">
          <AtRiskCorridors routes={riskRoutes} loading={loading} />
        </div>
      </div>

      {/* Secondary Row: Recent Incidents & Essential Goods Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentIncidents incidents={incidents} loading={loading} />
        <EssentialGoodsFeed shipments={shipments} loading={loading} />
      </div>
    </div>
  );
}
