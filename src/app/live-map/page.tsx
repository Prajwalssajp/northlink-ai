'use client';

import React, { useState, useEffect } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Filter, 
  AlertTriangle, 
  Truck, 
  Compass, 
  RefreshCw, 
  X, 
  Info,
  CheckCircle2,
  Navigation,
  Eye
} from 'lucide-react';
import MapContainerWrapper from '@/components/gis/MapContainerWrapper';
import { RoadSegment, Incident, Vehicle, District } from '@/lib/types';
import { useDemo } from '@/lib/demo-context';

export default function LiveMapPage() {
  const { refreshTrigger } = useDemo();
  const [roads, setRoads] = useState<RoadSegment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  // Layer toggles
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [showVehicles, setShowVehicles] = useState<boolean>(true);

  // Filters
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedIncidentType, setSelectedIncidentType] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  // Selected Object Drawer
  const [selectedObject, setSelectedObject] = useState<{
    type: 'INCIDENT' | 'ROAD' | 'VEHICLE';
    data: any;
  } | null>(null);

  const fetchData = async () => {
    try {
      const [incRes, vehRes, routesRes] = await Promise.all([
        fetch('/api/incidents').then(r => r.json()),
        fetch('/api/vehicles').then(r => r.json()),
        fetch('/api/routes').then(r => r.json()),
      ]);

      if (incRes.success) setIncidents(incRes.incidents);
      if (vehRes.success) setVehicles(vehRes.vehicles);
      if (routesRes.success) {
        const synRoads: RoadSegment[] = routesRes.routes.map((r: any) => ({
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
        setRoads(synRoads);
      }
    } catch (e) {
      console.error('Error fetching live map data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Apply filters
  const filteredIncidents = incidents.filter((i) => {
    if (selectedState !== 'ALL' && i.state !== selectedState) return false;
    if (selectedIncidentType !== 'ALL' && i.incidentType !== selectedIncidentType) return false;
    if (selectedSeverity !== 'ALL' && i.severity !== selectedSeverity) return false;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col space-y-4 overflow-hidden pb-4">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#090d16] p-3 text-xs">
        <div className="flex items-center space-x-2">
          <MapIcon className="h-4 w-4 text-cyan-400" />
          <span className="font-bold text-white">NER GIS Spatial Command Center</span>
          <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-800">
            MapLibre / Leaflet Engine
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All 8 NER States</option>
            <option value="Assam">Assam</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Manipur">Manipur</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Tripura">Tripura</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Sikkim">Sikkim</option>
          </select>

          {/* Incident Type Filter */}
          <select
            value={selectedIncidentType}
            onChange={(e) => setSelectedIncidentType(e.target.value)}
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Incident Types</option>
            <option value="LANDSLIDE">Landslides (⛰️)</option>
            <option value="FLOOD">Floods (🌊)</option>
            <option value="HEAVY_RAINFALL">Heavy Rainfall (🌧️)</option>
            <option value="ROAD_DAMAGE">Road Damage (🚧)</option>
            <option value="BRIDGE_DAMAGE">Bridge Damage (🌉)</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Layer toggles */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-2">
            <button
              onClick={() => setShowRoads(!showRoads)}
              className={`rounded px-2 py-1 font-medium transition-all ${
                showRoads ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-900 text-slate-500'
              }`}
            >
              Corridors
            </button>
            <button
              onClick={() => setShowIncidents(!showIncidents)}
              className={`rounded px-2 py-1 font-medium transition-all ${
                showIncidents ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-900 text-slate-500'
              }`}
            >
              Incidents ({filteredIncidents.length})
            </button>
            <button
              onClick={() => setShowVehicles(!showVehicles)}
              className={`rounded px-2 py-1 font-medium transition-all ${
                showVehicles ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-500'
              }`}
            >
              Vehicles ({vehicles.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Fullscreen GIS Container with Side Inspector */}
      <div className="relative flex flex-1 overflow-hidden rounded-xl border border-slate-800 bg-[#060911]">
        <div className="flex-1 h-full">
          <MapContainerWrapper
            roads={roads}
            incidents={filteredIncidents}
            vehicles={vehicles}
            showRoads={showRoads}
            showIncidents={showIncidents}
            showVehicles={showVehicles}
            onSelectIncident={(inc: Incident) => setSelectedObject({ type: 'INCIDENT', data: inc })}
            onSelectRoad={(road: RoadSegment) => setSelectedObject({ type: 'ROAD', data: road })}
            onSelectVehicle={(veh: Vehicle) => setSelectedObject({ type: 'VEHICLE', data: veh })}
            height="100%"
          />
        </div>

        {/* Selected Object Detail Side Drawer */}
        {selectedObject && (
          <div className="absolute right-3 top-3 bottom-3 z-[1000] w-80 overflow-y-auto rounded-xl border border-slate-700 bg-[#0b101c]/95 p-4 text-xs shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Spatial Feature Inspector
              </span>
              <button
                onClick={() => setSelectedObject(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedObject.type === 'INCIDENT' && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-rose-950 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-800">
                    {selectedObject.data.incidentType}
                  </span>
                  <span className="font-bold text-rose-400">{selectedObject.data.severity} SEVERITY</span>
                </div>
                <h3 className="text-sm font-bold text-white">{selectedObject.data.title}</h3>
                <p className="text-slate-300 leading-relaxed">{selectedObject.data.description}</p>
                <div className="rounded-lg bg-slate-900/80 p-2.5 space-y-1 text-[11px] text-slate-400">
                  <div>Location: <strong className="text-slate-200">{selectedObject.data.locationName}</strong></div>
                  <div>District/State: <strong className="text-slate-200">{selectedObject.data.districtName}, {selectedObject.data.state}</strong></div>
                  <div>Coordinates: <code className="text-cyan-400">{selectedObject.data.latitude.toFixed(4)}, {selectedObject.data.longitude.toFixed(4)}</code></div>
                  <div>Reported By: <strong className="text-slate-200">{selectedObject.data.reportedBy}</strong></div>
                  <div>Status: <span className="font-bold text-amber-400">{selectedObject.data.status}</span></div>
                </div>
              </div>
            )}

            {selectedObject.type === 'ROAD' && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800">
                    {selectedObject.data.highwayNumber}
                  </span>
                  <span className="font-bold text-white">{selectedObject.data.accessibilityStatus}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{selectedObject.data.name}</h3>
                <div className="rounded-lg bg-slate-900/80 p-2.5 space-y-1 text-[11px] text-slate-400">
                  <div>Source: <strong className="text-slate-200">{selectedObject.data.source}</strong></div>
                  <div>Destination: <strong className="text-slate-200">{selectedObject.data.destination}</strong></div>
                  <div>Corridor Type: <strong className="text-slate-200">{selectedObject.data.roadType}</strong></div>
                  <div>Avg Travel Time: <strong className="text-slate-200">{Math.round(selectedObject.data.averageTravelTime / 60)} hrs</strong></div>
                </div>
              </div>
            )}

            {selectedObject.type === 'VEHICLE' && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-cyan-400">{selectedObject.data.vehicleNumber}</span>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-800">
                    {selectedObject.data.status}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-2.5 space-y-1 text-[11px] text-slate-400">
                  <div>Driver: <strong className="text-slate-200">{selectedObject.data.driverName}</strong></div>
                  <div>Phone: <code className="text-cyan-400">{selectedObject.data.driverPhone}</code></div>
                  <div>Vehicle Type: <strong className="text-slate-200">{selectedObject.data.vehicleType}</strong></div>
                  <div>Current Speed: <strong className="text-white">{selectedObject.data.speed} km/h</strong></div>
                  <div>Battery/Fuel: <strong className="text-emerald-400">{selectedObject.data.batteryOrFuel}%</strong></div>
                  <div>GPS Fix: <code className="text-slate-300">{selectedObject.data.currentLatitude.toFixed(4)}, {selectedObject.data.currentLongitude.toFixed(4)}</code></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
