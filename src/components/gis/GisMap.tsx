'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, Circle, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { RoadSegment, Incident, Vehicle, District } from '@/lib/types';
import { INITIAL_DRONE_CORRIDORS } from '@/lib/drone-corridors';
import { CloudRain, Navigation, Eye, EyeOff } from 'lucide-react';

// Custom Marker icons
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
  // New High-Tech GIS Toggles
  const [showWeatherRadar, setShowWeatherRadar] = useState(true);
  const [showDroneCorridors, setShowDroneCorridors] = useState(false);

  // Simulated IMD Doppler Weather Radar Storm Zones
  const weatherZones = [
    {
      center: [25.30, 92.10] as [number, number],
      radius: 42000,
      intensity: 'EXTREME_CLOUDBURST',
      rainfallMm: 185,
      name: 'IMD Alert: Cherrapunji - Jowai Cloudburst Front',
      color: '#dc2626',
    },
    {
      center: [27.05, 88.45] as [number, number],
      radius: 35000,
      intensity: 'HEAVY_MONSOON_SURGE',
      rainfallMm: 120,
      name: 'Teesta River Basin Active Monsoon Cell',
      color: '#ea580c',
    },
    {
      center: [25.10, 93.00] as [number, number],
      radius: 28000,
      intensity: 'MODERATE_RAIN',
      rainfallMm: 65,
      name: 'Barail Mountain Range Precipitation',
      color: '#0284c7',
    },
  ];

  return (
    <div style={{ height, width: '100%' }} className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#060911]">
      {/* Top-Right Interactive Map Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowWeatherRadar(!showWeatherRadar)}
          className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all shadow-lg backdrop-blur ${
            showWeatherRadar
              ? 'bg-sky-950 text-sky-300 border border-sky-600 ring-1 ring-sky-500'
              : 'bg-slate-900/90 text-slate-400 border border-slate-700 hover:text-white'
          }`}
          title="Toggle IMD Doppler Precipitation Weather Radar Overlay"
        >
          <CloudRain className="h-3.5 w-3.5" />
          <span>Doppler Radar {showWeatherRadar ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowDroneCorridors(!showDroneCorridors)}
          className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all shadow-lg backdrop-blur ${
            showDroneCorridors
              ? 'bg-amber-950 text-amber-300 border border-amber-600 ring-1 ring-amber-500'
              : 'bg-slate-900/90 text-slate-400 border border-slate-700 hover:text-white'
          }`}
          title="Toggle Aerial Drone & Helicopter Supply Corridors for Isolated Valleys"
        >
          <Navigation className="h-3.5 w-3.5 rotate-45" />
          <span>Drone Corridors {showDroneCorridors ? 'ACTIVE' : 'OFF'}</span>
        </button>
      </div>

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

        {/* ══════════════════ WEATHER RADAR PRECIPITATION OVERLAY ══════════════════ */}
        {showWeatherRadar &&
          weatherZones.map((zone, idx) => (
            <Circle
              key={idx}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.22,
                weight: 1.5,
                dashArray: '4, 6',
              }}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-sky-400 flex items-center space-x-1">
                    <CloudRain className="h-3.5 w-3.5" />
                    <span>{zone.name}</span>
                  </div>
                  <div className="text-slate-200">
                    Intensity: <span className="font-bold text-rose-400">{zone.rainfallMm} mm/24h</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    IMD Doppler Live Radar: Saturated mountain slopes risk factor elevated.
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* ══════════════════ DRONE & HELICOPTER RELIEF AIR BRIDGES ══════════════════ */}
        {showDroneCorridors &&
          INITIAL_DRONE_CORRIDORS.map((drone) => (
            <React.Fragment key={drone.id}>
              {/* Air Corridor Flight Vector */}
              <Polyline
                positions={[drone.originCoordinates, drone.targetCoordinates]}
                pathOptions={{
                  color: '#f59e0b',
                  weight: 3,
                  dashArray: '8, 8',
                  opacity: 0.9,
                }}
              >
                <Tooltip sticky>
                  <div className="text-[10px] font-mono">
                    <span className="font-bold text-amber-400">AIR BRIDGE:</span> {drone.flightDistanceKm} km · {drone.flightTimeMinutes} mins
                  </div>
                </Tooltip>
              </Polyline>

              {/* Airbase Origin Marker */}
              <CircleMarker
                center={drone.originCoordinates}
                radius={7}
                pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.9 }}
              >
                <Popup>
                  <div className="text-xs">
                    <div className="font-bold text-amber-400">🚁 {drone.baseName}</div>
                    <div className="text-slate-300">Payload Capacity: {drone.payloadCapacityKg} kg</div>
                    <div className="text-[10px] text-slate-400">Suitable for Cold-Chain Vaccines & Emergency Blood</div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          ))}

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
                    <span className="font-bold">{road.name}</span> ({road.accessibilityStatus})
                  </div>
                </Tooltip>
              </Polyline>
            );
          })}

        {/* Incidents Markers */}
        {showIncidents &&
          incidents.map((inc) => {
            let iconColor = '#ef4444';
            let iconSymbol = '⚠️';
            if (inc.incidentType === 'LANDSLIDE') iconSymbol = '⛰️';
            else if (inc.incidentType === 'FLOOD') {
              iconColor = '#0284c7';
              iconSymbol = '🌊';
            } else if (inc.incidentType === 'ROAD_DAMAGE') iconSymbol = '🚧';
            else if (inc.incidentType === 'BRIDGE_DAMAGE') iconSymbol = '🌉';
            else if (inc.incidentType === 'HEAVY_RAINFALL') iconSymbol = '🌧️';

            const customIcon = createCustomIcon(iconColor, iconSymbol, inc.severity === 'CRITICAL');

            return (
              <Marker
                key={inc.id}
                position={[inc.latitude, inc.longitude]}
                icon={customIcon}
                eventHandlers={{
                  click: () => onSelectIncident && onSelectIncident(inc),
                }}
              >
                <Popup>
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-rose-400">{inc.title}</div>
                    <p className="text-slate-300">{inc.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{inc.locationName}</span>
                      <span className="font-bold text-rose-300">{inc.severity}</span>
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
          <span className="text-slate-300">Open Corridor</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-4 rounded-full bg-rose-500"></span>
          <span className="text-slate-300">Blocked / Severed</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
          <span className="text-slate-300">Convoy GPS</span>
        </div>
        {showWeatherRadar && (
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="text-sky-300 font-semibold">Doppler Rain Radar</span>
          </div>
        )}
        {showDroneCorridors && (
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span className="text-amber-300 font-semibold">Air Bridge Vector</span>
          </div>
        )}
      </div>
    </div>
  );
}
