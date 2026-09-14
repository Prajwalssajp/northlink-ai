'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { RoadSegment, Incident, Vehicle, District } from '@/lib/types';

// Fix default marker icon issues in Leaflet with bundlers
const createCustomIcon = (color: string, iconSymbol: string, isCritical = false) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        ${isCritical ? `<div style="position: absolute; width: 32px; height: 32px; background-color: ${color}; border-radius: 50%; opacity: 0.4; animation: critical-pulse 2s infinite;"></div>` : ''}
        <div style="width: 26px; height: 26px; background-color: ${color}; border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);">
          ${iconSymbol}
        </div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
};

interface GisMapProps {
  roads: RoadSegment[];
  incidents: Incident[];
  vehicles: Vehicle[];
  districts?: District[];
  showRoads?: boolean;
  showIncidents?: boolean;
  showVehicles?: boolean;
  onSelectIncident?: (incident: Incident) => void;
  onSelectRoad?: (road: RoadSegment) => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export default function GisMap({
  roads,
  incidents,
  vehicles,
  districts = [],
  showRoads = true,
  showIncidents = true,
  showVehicles = true,
  onSelectIncident,
  onSelectRoad,
  onSelectVehicle,
  height = '500px',
  initialCenter = [25.8, 92.5],
  initialZoom = 7,
}: GisMapProps) {
  return (
    <div style={{ height, width: '100%' }} className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#060911]">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Dark Matter GIS Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Road Corridors */}
        {showRoads &&
          roads.map((road) => {
            let coords: [number, number][] = [];
            try {
              coords = JSON.parse(road.coordinatesGeoJson);
            } catch {
              coords = [];
            }
            if (coords.length < 2) return null;

            let color = '#10b981'; // Open
            if (road.accessibilityStatus === 'BLOCKED') color = '#ef4444';
            else if (road.accessibilityStatus === 'CRITICAL_RISK') color = '#f43f5e';
            else if (road.accessibilityStatus === 'RESTRICTED') color = '#f59e0b';

            return (
              <Polyline
                key={road.id}
                positions={coords}
                pathOptions={{
                  color,
                  weight: road.accessibilityStatus === 'BLOCKED' ? 6 : 4,
                  opacity: 0.85,
                  dashArray: road.accessibilityStatus === 'BLOCKED' ? '8, 8' : undefined,
                }}
                eventHandlers={{
                  click: () => onSelectRoad && onSelectRoad(road),
                }}
              >
                <Tooltip sticky>
                  <div className="text-xs">
                    <span className="font-bold text-cyan-400">{road.highwayNumber}: </span>
                    <span>{road.name}</span>
                    <div className="text-[10px] text-slate-300">
                      Status: <span style={{ color }}>{road.accessibilityStatus}</span>
                    </div>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-white">{road.name}</div>
                    <div className="text-slate-400">Route: {road.source} ➔ {road.destination}</div>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${color}33`, color }}>
                        {road.accessibilityStatus}
                      </span>
                      <span className="text-[10px] text-slate-400">Avg Travel: {Math.round(road.averageTravelTime / 60)}h</span>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            );
          })}

        {/* Incidents Markers */}
        {showIncidents &&
          incidents.map((inc) => {
            const isCritical = inc.severity === 'CRITICAL';
            let color = '#f59e0b';
            let symbol = '⚠️';
            if (inc.incidentType === 'LANDSLIDE') {
              color = isCritical ? '#ef4444' : '#f97316';
              symbol = '⛰️';
            } else if (inc.incidentType === 'FLOOD') {
              color = '#0284c7';
              symbol = '🌊';
            } else if (inc.incidentType === 'HEAVY_RAINFALL') {
              color = '#06b6d4';
              symbol = '🌧️';
            } else if (inc.incidentType === 'BRIDGE_DAMAGE' || inc.incidentType === 'ROAD_DAMAGE') {
              color = '#e11d48';
              symbol = '🚧';
            }

            const icon = createCustomIcon(color, symbol, isCritical);

            return (
              <Marker
                key={inc.id}
                position={[inc.latitude, inc.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectIncident && onSelectIncident(inc),
                }}
              >
                <Popup>
                  <div className="w-56 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{inc.incidentType}</span>
                      <span
                        className="rounded px-1 text-[9px] font-extrabold"
                        style={{ backgroundColor: `${color}33`, color }}
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <p className="font-medium text-slate-200">{inc.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{inc.description}</p>
                    <div className="pt-1 text-[10px] text-slate-400">
                      Reported: {new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Vehicles Markers */}
        {showVehicles &&
          vehicles.map((veh) => {
            const vehIcon = createCustomIcon('#06b6d4', '🚛');
            return (
              <Marker
                key={veh.id}
                position={[veh.currentLatitude, veh.currentLongitude]}
                icon={vehIcon}
                eventHandlers={{
                  click: () => onSelectVehicle && onSelectVehicle(veh),
                }}
              >
                <Popup>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400">{veh.vehicleNumber}</span>
                      <span className="rounded bg-cyan-950 px-1 text-[9px] font-bold text-cyan-300">
                        {veh.status}
                      </span>
                    </div>
                    <p className="text-slate-300">Driver: {veh.driverName}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Speed: {veh.speed} km/h</span>
                      <span>Battery/Fuel: {veh.batteryOrFuel}%</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Embedded Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] flex flex-wrap gap-2 rounded-lg border border-slate-800 bg-[#080c14]/90 p-2 text-[10px] backdrop-blur">
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-4 rounded-full bg-emerald-500"></span>
          <span className="text-slate-300">Open</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-4 rounded-full bg-amber-500"></span>
          <span className="text-slate-300">Restricted</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-4 rounded-full bg-rose-500"></span>
          <span className="text-slate-300">Critical / Blocked</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
          <span className="text-slate-300">Vehicle GPS</span>
        </div>
      </div>
    </div>
  );
}
