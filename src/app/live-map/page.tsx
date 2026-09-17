'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  Box,
  AlertTriangle,
  MapPin,
  Search,
  Plus,
  Minus,
  Layers,
  Crosshair,
  Compass,
  ChevronDown,
  CloudRain,
  ExternalLink,
  Navigation,
  Eye,
  EyeOff,
  CheckCircle2,
  Info,
  Radio,
  Volume2
} from 'lucide-react';

interface VehicleData {
  id: string;
  code: string;
  regNo: string;
  driver: string;
  status: 'moving' | 'stopped';
  speed: string;
  speedNum: number;
  route: string;
  state: string;
  cargo: string;
  cargoType: string;
  timeAgo: string;
  query: string;
  posX: string; // percentage left
  posY: string; // percentage top
}

interface AlertData {
  id: string;
  type: 'landslide' | 'weather' | 'blockage' | 'fog';
  title: string;
  location: string;
  state: string;
  severity: 'high' | 'medium' | 'critical';
  timeAgo: string;
  query: string;
  icon: string;
  posX: string;
  posY: string;
}

const VEHICLES_DATABASE: VehicleData[] = [
  {
    id: 'v-1',
    code: 'AS-01',
    regNo: 'AS-01-TR-458',
    driver: 'Biren Gogoi',
    status: 'moving',
    speed: '72 km/h',
    speedNum: 72,
    route: 'Guwahati → Silchar',
    state: 'Assam',
    cargo: 'Emergency Medical Supplies',
    cargoType: 'Medical Supplies',
    timeAgo: '2 mins ago',
    query: 'Guwahati, Assam, India',
    posX: '34%',
    posY: '35%',
  },
  {
    id: 'v-2',
    code: 'NL-04',
    regNo: 'NL-04-TR-221',
    driver: 'Kezhovi Angami',
    status: 'moving',
    speed: '60 km/h',
    speedNum: 60,
    route: 'Dimapur → Kohima',
    state: 'Nagaland',
    cargo: 'Food Rations & Rice Bags',
    cargoType: 'Food Ration',
    timeAgo: '5 mins ago',
    query: 'Kohima, Nagaland, India',
    posX: '43%',
    posY: '27%',
  },
  {
    id: 'v-3',
    code: 'AR-02',
    regNo: 'AR-02-TR-904',
    driver: 'Tsering Dorjee',
    status: 'moving',
    speed: '55 km/h',
    speedNum: 55,
    route: 'Itanagar → Tawang',
    state: 'Arunachal Pradesh',
    cargo: 'High-Altitude Winter Rations',
    cargoType: 'Food Ration',
    timeAgo: '12 mins ago',
    query: 'Tawang, Arunachal Pradesh, India',
    posX: '61%',
    posY: '23%',
  },
  {
    id: 'v-4',
    code: 'ML-01',
    regNo: 'ML-01-TR-612',
    driver: 'Pynshngain Khongwir',
    status: 'moving',
    speed: '68 km/h',
    speedNum: 68,
    route: 'Shillong → Tura',
    state: 'Meghalaya',
    cargo: 'Cold-Chain Vaccines & Blood',
    cargoType: 'Medical Supplies',
    timeAgo: '10 mins ago',
    query: 'Shillong, Meghalaya, India',
    posX: '34%',
    posY: '67%',
  },
  {
    id: 'v-5',
    code: 'MN-03',
    regNo: 'MN-03-TR-775',
    driver: 'Ibomcha Singh',
    status: 'stopped',
    speed: '0 km/h',
    speedNum: 0,
    route: 'Imphal Depot Standby',
    state: 'Manipur',
    cargo: 'Diesel & Emergency Fuel',
    cargoType: 'Emergency Fuel',
    timeAgo: '8 mins ago',
    query: 'Imphal, Manipur, India',
    posX: '52%',
    posY: '61%',
  },
];

const ALERTS_DATABASE: AlertData[] = [
  {
    id: 'a-1',
    type: 'landslide',
    title: 'Landslide reported',
    location: 'NH-415, Arunachal Pradesh',
    state: 'Arunachal Pradesh',
    severity: 'critical',
    timeAgo: '10 mins ago',
    query: 'NH 415, Itanagar, Arunachal Pradesh, India',
    icon: '⚠️',
    posX: '46.5%',
    posY: '41%',
  },
  {
    id: 'a-2',
    type: 'weather',
    title: 'Heavy rainfall forecast',
    location: 'Dima Hasao, Assam',
    state: 'Assam',
    severity: 'medium',
    timeAgo: '25 mins ago',
    query: 'Dima Hasao, Assam, India',
    icon: '🌧️',
    posX: '66%',
    posY: '35%',
  },
  {
    id: 'a-3',
    type: 'blockage',
    title: 'Road blockage / Repair',
    location: 'NH-2, Manipur',
    state: 'Manipur',
    severity: 'high',
    timeAgo: '1 hour ago',
    query: 'National Highway 2, Manipur, India',
    icon: '🚧',
    posX: '49%',
    posY: '48%',
  },
  {
    id: 'a-4',
    type: 'landslide',
    title: 'Rockfall on Pass',
    location: 'Sela Pass, Arunachal',
    state: 'Arunachal Pradesh',
    severity: 'high',
    timeAgo: '45 mins ago',
    query: 'Sela Pass, Arunachal Pradesh, India',
    icon: '⚠️',
    posX: '59.5%',
    posY: '32.5%',
  },
];

const HUBS_DATABASE = [
  { id: 'h-1', name: 'Guwahati Regional Hub', type: 'primary', posX: '45%', posY: '64%', color: 'purple' },
  { id: 'h-2', name: 'Silchar Distribution Center', type: 'secondary', posX: '45%', posY: '80%', color: 'blue' },
];

const STATE_COORDINATES: Record<string, { query: string; zoom: number }> = {
  'All States': { query: 'Guwahati, Assam, India', zoom: 7 },
  Assam: { query: 'Guwahati, Assam, India', zoom: 8 },
  Meghalaya: { query: 'Shillong, Meghalaya, India', zoom: 9 },
  'Arunachal Pradesh': { query: 'Itanagar, Arunachal Pradesh, India', zoom: 8 },
  Nagaland: { query: 'Kohima, Nagaland, India', zoom: 9 },
  Manipur: { query: 'Imphal, Manipur, India', zoom: 9 },
  Mizoram: { query: 'Aizawl, Mizoram, India', zoom: 9 },
  Tripura: { query: 'Agartala, Tripura, India', zoom: 9 },
  Sikkim: { query: 'Gangtok, Sikkim, India', zoom: 9 },
};

export default function LiveMapPage() {
  const [currentTime, setCurrentTime] = useState('10:24 AM');
  const [currentDate, setCurrentDate] = useState('Mon, 15 Sep 2025');

  // Google Maps state
  const [mapLocationQuery, setMapLocationQuery] = useState('Guwahati, Assam, India');
  const [activeLocationTitle, setActiveLocationTitle] = useState('North East Region Overview');
  const [zoomLevel, setZoomLevel] = useState(8);
  const [mapType, setMapType] = useState<'satellite' | 'roadmap'>('satellite');
  const [showOverlays, setShowOverlays] = useState(true);
  const [showVehiclesOverlay, setShowVehiclesOverlay] = useState(true);
  const [mapSearch, setMapSearch] = useState('');
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState<VehicleData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pulseTick, setPulseTick] = useState(0);

  // Filter dropdown state
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedVehicle, setSelectedVehicle] = useState('All Vehicles');
  const [selectedShipment, setSelectedShipment] = useState('All Shipments');
  const [selectedIncident, setSelectedIncident] = useState('All Incidents');
  const [selectedWeather, setSelectedWeather] = useState('All Weather Conditions');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
      setPulseTick((prev) => (prev + 1) % 100);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // When State filter changes, re-center map and update active title
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const target = STATE_COORDINATES[stateName] || STATE_COORDINATES['All States'];
    setMapLocationQuery(target.query);
    setZoomLevel(target.zoom);
    setActiveLocationTitle(stateName === 'All States' ? 'North East Region Overview' : `${stateName} Sector`);
    triggerToast(`🗺️ Centering map on ${stateName}`);
  };

  const handleResetFilters = () => {
    setSelectedState('All States');
    setSelectedVehicle('All Vehicles');
    setSelectedShipment('All Shipments');
    setSelectedIncident('All Incidents');
    setSelectedWeather('All Weather Conditions');
    setMapSearch('');
    setMapLocationQuery('Guwahati, Assam, India');
    setZoomLevel(8);
    setActiveLocationTitle('North East Region Overview');
    setSelectedVehicleDetails(null);
    triggerToast('🔄 Filters and map view reset to North East Overview');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearch.trim()) return;
    setMapLocationQuery(mapSearch.trim() + ', North East India');
    setActiveLocationTitle(mapSearch.trim());
    setZoomLevel(11);
    triggerToast(`📍 Google Maps searching: "${mapSearch.trim()}"`);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 16));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 4));
  };

  const handleLayerToggle = () => {
    setMapType((prev) => (prev === 'satellite' ? 'roadmap' : 'satellite'));
    triggerToast(`🗺️ Map switched to ${mapType === 'satellite' ? 'Roadmap / Street' : 'Satellite / Aerial'} mode`);
  };

  const handleCenterOverview = () => {
    setMapLocationQuery('Guwahati, Assam, India');
    setZoomLevel(8);
    setActiveLocationTitle('North East Region Overview');
    setSelectedVehicleDetails(null);
    triggerToast('🎯 Re-centered to North East India Regional Hub');
  };

  // Click on Vehicle Marker or list item
  const handleSelectVehicle = (vehicle: VehicleData) => {
    setSelectedVehicleDetails(vehicle);
    setMapLocationQuery(vehicle.query);
    setActiveLocationTitle(`Vehicle ${vehicle.code} (${vehicle.route})`);
    setZoomLevel(12);
    triggerToast(`🚚 Tracking ${vehicle.code} • ${vehicle.route} (${vehicle.speed})`);
  };

  // Click on Alert Marker or list item
  const handleSelectAlert = (alert: AlertData) => {
    setMapLocationQuery(alert.query);
    setActiveLocationTitle(`${alert.title} • ${alert.location}`);
    setZoomLevel(13);
    triggerToast(`⚠️ Focused on incident: ${alert.title} at ${alert.location}`);
  };

  // Filtered Vehicles
  const filteredVehicles = VEHICLES_DATABASE.filter((v) => {
    if (selectedState !== 'All States' && v.state !== selectedState) return false;
    if (selectedVehicle === 'Moving Only (42)' && v.status !== 'moving') return false;
    if (selectedVehicle === 'Stopped / Idle (6)' && v.status !== 'stopped') return false;
    if (selectedVehicle === 'Cold-Chain Refrigerated' && !v.cargo.toLowerCase().includes('vaccine')) return false;
    if (selectedShipment !== 'All Shipments' && v.cargoType !== selectedShipment) return false;
    return true;
  });

  // Filtered Alerts
  const filteredAlerts = ALERTS_DATABASE.filter((a) => {
    if (selectedState !== 'All States' && a.state !== selectedState) return false;
    if (selectedIncident === 'Landslide (Red)' && a.type !== 'landslide') return false;
    if (selectedIncident === 'Flood & Waterlogging' && a.type !== 'weather') return false;
    if (selectedIncident === 'Road Construction' && a.type !== 'blockage') return false;
    if (selectedWeather === 'Severe Rain / Monsoon' && a.type !== 'weather') return false;
    if (selectedWeather === 'High Fog & Low Visibility' && a.type !== 'fog') return false;
    return true;
  });

  // Google Maps Embed URL
  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapLocationQuery)}&t=${
    mapType === 'satellite' ? 'k' : 'm'
  }&z=${zoomLevel}&output=embed`;

  // External Google Maps URL for opening in native Google Maps app
  const googleMapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLocationQuery)}`;

  return (
    <div className="space-y-5 select-none font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center space-x-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          A. HEADER TITLE + SUBTITLE + DATE & TIME + SYSTEM ONLINE
      ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Live Map
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Google Maps Live GPS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Real-time view of vehicles, shipments, incidents and road conditions across North East India
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500">{currentDate}</div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {currentTime}
            </div>
          </div>

          {/* System Online Pill */}
          <div className="flex items-center space-x-3 rounded-2xl bg-[#e8f8ed] border border-[#bbf7d0] px-4 py-2.5 shadow-sm">
            <span className="h-3.5 w-3.5 rounded-full bg-[#10b981] animate-pulse" />
            <div>
              <div className="text-xs font-bold text-[#065f46]">System Online</div>
              <div className="text-[11px] text-[#047857] font-medium">All tracking services active</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          B. MAIN SECTION: MAP ON LEFT (~75%), SIDEBARS ON RIGHT (~25%)
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: INTERACTIVE GOOGLE MAP WITH VEHICLE DATA OVERLAYS (Col 1 to 9) */}
        <div className="lg:col-span-9 rounded-2xl bg-white border border-slate-200/80 p-2 shadow-sm relative overflow-hidden flex flex-col">
          {/* Map Top Status Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-slate-800">Current View:</span>
              <span className="font-semibold text-[#0066ff] truncate max-w-xs">{activeLocationTitle}</span>
              <span className="text-slate-400 text-[11px]">({mapType === 'satellite' ? 'Satellite' : 'Roadmap'}, Zoom {zoomLevel}x)</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowVehiclesOverlay(!showVehiclesOverlay)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors flex items-center space-x-1.5 shadow-sm ${
                  showVehiclesOverlay
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title="Toggle live vehicle markers and routes overlay"
              >
                <Radio className={`h-3.5 w-3.5 ${showVehiclesOverlay ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                <span>{showVehiclesOverlay ? 'Vehicle Layer: ON' : 'Vehicle Layer: OFF'}</span>
              </button>

              <button
                onClick={handleLayerToggle}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center space-x-1.5 text-slate-700 shadow-sm"
              >
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span>{mapType === 'satellite' ? 'Roadmap' : 'Satellite'}</span>
              </button>

              <a
                href={googleMapExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-[#0066ff] border border-blue-200 hover:bg-blue-100 transition-colors flex items-center space-x-1 shadow-sm"
                title="Open in native Google Maps application"
              >
                <span>Google Maps App</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="relative w-full h-[580px] rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
            {/* 1. Google Maps Base Engine */}
            <iframe
              title="Google Maps Live Tracking"
              src={googleMapEmbedUrl}
              className="w-full h-full border-0 absolute inset-0 z-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* 2. Top-Left Interactive Search Form */}
            <div className="absolute top-3.5 left-3.5 z-20 w-72">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  placeholder="Search location on map (e.g. Shillong)..."
                  className="w-full rounded-xl bg-white/95 backdrop-blur border border-slate-200 pl-9 pr-8 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {mapSearch && (
                  <button
                    type="button"
                    onClick={() => setMapSearch('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </form>
            </div>

            {/* 3. Top-Right Compass / North Indicator */}
            <div
              onClick={handleCenterOverview}
              className="absolute top-3.5 right-3.5 z-20 flex flex-col items-center justify-center h-10 w-10 rounded-xl bg-white/95 backdrop-blur border border-slate-200 shadow-md cursor-pointer hover:bg-slate-100 transition-colors"
              title="Click to reset North & Overview"
            >
              <span className="text-[10px] font-black text-red-600 leading-none">N</span>
              <Compass className="h-4 w-4 text-slate-700 mt-0.5" />
            </div>

            {/* 4. Left Floating Zoom & Layer Controls */}
            <div className="absolute top-16 left-3.5 z-20 flex flex-col rounded-xl bg-white/95 backdrop-blur border border-slate-200 shadow-lg text-slate-700 overflow-hidden">
              <button
                onClick={handleZoomIn}
                className="p-2.5 hover:bg-slate-100 border-b border-slate-200 transition-colors"
                title="Zoom In"
              >
                <Plus className="h-4 w-4 text-slate-700" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2.5 hover:bg-slate-100 border-b border-slate-200 transition-colors"
                title="Zoom Out"
              >
                <Minus className="h-4 w-4 text-slate-700" />
              </button>
              <button
                onClick={handleLayerToggle}
                className="p-2.5 hover:bg-slate-100 border-b border-slate-200 transition-colors"
                title="Toggle Satellite / Roadmap"
              >
                <Layers className="h-4 w-4 text-slate-700" />
              </button>
              <button
                onClick={handleCenterOverview}
                className="p-2.5 hover:bg-slate-100 transition-colors"
                title="Reset to North East Hub"
              >
                <Crosshair className="h-4 w-4 text-[#0066ff]" />
              </button>
            </div>

            {/* 5. OVERLAY LAYER: ROUTES, VEHICLE MOVING DATA BADGES, INCIDENTS, HUBS */}
            {showVehiclesOverlay && (
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* SVG Route Path Overlays (Clear, Caution, Blocked) */}
                <svg
                  className="w-full h-full absolute inset-0 opacity-80 pointer-events-none"
                  viewBox="0 0 900 600"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  {/* Route 1 (Green Clear): Guwahati -> Shillong -> Agartala */}
                  <path
                    d="M305 275 L370 290 L365 345 L405 400 L380 425"
                    stroke="#10b981"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Route 2 (Green Clear): Guwahati -> Itanagar -> Tawang */}
                  <path
                    d="M370 290 L400 230 L485 215 L550 170 L620 150"
                    stroke="#10b981"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Route 3 (Amber Caution): Branch near Itanagar */}
                  <path
                    d="M400 230 L450 250 L485 215"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="6 4"
                  />
                  {/* Route 4 (Red Blocked): Highway south into Imphal */}
                  <path
                    d="M450 330 L465 380 L480 410 L505 425"
                    stroke="#ef4444"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Regional City Markers */}
                  <circle cx="370" cy="290" r="3.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="378" y="295" fill="#0f172a" fontSize="11" fontWeight="bold" filter="drop-shadow(0 1px 2px rgba(255,255,255,0.9))">
                    Guwahati
                  </text>

                  <circle cx="365" cy="345" r="3.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="375" y="350" fill="#0f172a" fontSize="11" fontWeight="bold" filter="drop-shadow(0 1px 2px rgba(255,255,255,0.9))">
                    Shillong
                  </text>

                  <circle cx="485" cy="215" r="3.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="495" y="220" fill="#0f172a" fontSize="11" fontWeight="bold" filter="drop-shadow(0 1px 2px rgba(255,255,255,0.9))">
                    Itanagar
                  </text>

                  <circle cx="510" cy="325" r="3.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="520" y="330" fill="#0f172a" fontSize="11" fontWeight="bold" filter="drop-shadow(0 1px 2px rgba(255,255,255,0.9))">
                    Kohima
                  </text>

                  <circle cx="505" cy="425" r="3.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="515" y="430" fill="#0f172a" fontSize="11" fontWeight="bold" filter="drop-shadow(0 1px 2px rgba(255,255,255,0.9))">
                    Imphal
                  </text>

                  <circle cx="380" cy="425" r="3.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="390" y="430" fill="#0f172a" fontSize="11" fontWeight="bold" filter="drop-shadow(0 1px 2px rgba(255,255,255,0.9))">
                    Agartala
                  </text>
                </svg>

                {/* ═══════════ A. LIVE VEHICLE MOVING DATA BADGES ═══════════ */}
                {filteredVehicles.map((vehicle) => {
                  const isSelected = selectedVehicleDetails?.id === vehicle.id;
                  const isMoving = vehicle.status === 'moving';

                  return (
                    <div
                      key={vehicle.id}
                      onClick={() => handleSelectVehicle(vehicle)}
                      style={{ left: vehicle.posX, top: vehicle.posY }}
                      className={`absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 group ${
                        isSelected ? 'scale-110 z-30 ring-2 ring-blue-500 rounded-xl' : 'z-20'
                      }`}
                      title={`Click to inspect ${vehicle.code}: ${vehicle.route} (${vehicle.speed})`}
                    >
                      {/* Vehicle Callout Badge matching screenshot */}
                      <div className="flex items-center space-x-2 bg-white/95 backdrop-blur rounded-xl border border-slate-200/90 px-2.5 py-1.5 shadow-lg group-hover:shadow-xl transition-shadow">
                        {/* Truck Icon Box */}
                        <div
                          className={`relative flex h-6 w-6 items-center justify-center rounded-lg text-white font-bold text-xs shrink-0 ${
                            isMoving ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        >
                          <Truck className="h-3.5 w-3.5 text-white" />
                          {isMoving && (
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                          )}
                        </div>

                        {/* Vehicle Info: Reg No + Speed Data */}
                        <div className="flex flex-col leading-tight pr-1">
                          <span className="text-[11px] font-black text-slate-900 tracking-tight">
                            {vehicle.code}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold ${
                              isMoving ? 'text-emerald-600' : 'text-red-600'
                            }`}
                          >
                            {vehicle.speed}
                          </span>
                        </div>
                      </div>

                      {/* Small anchor pointer pin below the badge */}
                      <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1 border-r border-b border-slate-200 shadow-sm" />
                    </div>
                  );
                })}

                {/* ═══════════ B. INCIDENTS & HAZARDS ICONS ═══════════ */}
                {/* Incident 1: Landslide near Assam/Arunachal border */}
                <div
                  onClick={() => handleSelectAlert(ALERTS_DATABASE[0])}
                  style={{ left: ALERTS_DATABASE[0].posX, top: ALERTS_DATABASE[0].posY }}
                  className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform z-20 group"
                  title="⚠️ Landslide reported on NH-415"
                >
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-lg border-2 border-white animate-bounce">
                    <span className="text-xs font-bold">⚠️</span>
                  </div>
                </div>

                {/* Incident 2: Rockfall near Sela Pass */}
                <div
                  onClick={() => handleSelectAlert(ALERTS_DATABASE[3])}
                  style={{ left: ALERTS_DATABASE[3].posX, top: ALERTS_DATABASE[3].posY }}
                  className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform z-20 group"
                  title="⚠️ Rockfall on Pass"
                >
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-lg border-2 border-white">
                    <span className="text-xs font-bold">⚠️</span>
                  </div>
                </div>

                {/* Road Work Icon */}
                <div
                  onClick={() => handleSelectAlert(ALERTS_DATABASE[2])}
                  style={{ left: ALERTS_DATABASE[2].posX, top: ALERTS_DATABASE[2].posY }}
                  className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform z-20 group"
                  title="🚧 Road Work / Blockage on NH-2"
                >
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg border-2 border-white">
                    <span className="text-xs font-bold">🚧</span>
                  </div>
                </div>

                {/* Weather Alert Icon */}
                <div
                  onClick={() => handleSelectAlert(ALERTS_DATABASE[1])}
                  style={{ left: ALERTS_DATABASE[1].posX, top: ALERTS_DATABASE[1].posY }}
                  className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform z-20 group"
                  title="🌧️ Heavy rainfall forecast: Dima Hasao"
                >
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg border-2 border-white animate-pulse">
                    <span className="text-xs font-bold">🌧️</span>
                  </div>
                </div>

                {/* ═══════════ C. LOGISTICS HUBS ═══════════ */}
                {HUBS_DATABASE.map((hub) => (
                  <div
                    key={hub.id}
                    style={{ left: hub.posX, top: hub.posY }}
                    className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform z-20"
                    title={hub.name}
                  >
                    <div
                      className={`relative flex h-7 w-7 items-center justify-center rounded-xl text-white shadow-lg border-2 border-white ${
                        hub.color === 'purple' ? 'bg-purple-600' : 'bg-blue-600'
                      }`}
                    >
                      <span className="text-xs font-bold">🏠</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Floating Active Vehicle Inspector Card (When vehicle selected) */}
            {selectedVehicleDetails && (
              <div className="absolute top-3.5 left-80 z-30 rounded-2xl bg-white/95 backdrop-blur border border-blue-200 p-3 shadow-2xl max-w-sm animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        selectedVehicleDetails.status === 'moving'
                          ? 'bg-emerald-500 animate-pulse'
                          : 'bg-red-500'
                      }`}
                    />
                    <span className="font-extrabold text-slate-900 text-xs">
                      {selectedVehicleDetails.regNo} ({selectedVehicleDetails.code})
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedVehicleDetails.status === 'moving'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedVehicleDetails.speed}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedVehicleDetails(null)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold ml-3"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-2 text-xs space-y-1">
                  <div className="text-slate-700 font-semibold">
                    <span className="text-slate-400 font-normal">Route: </span>
                    {selectedVehicleDetails.route} ({selectedVehicleDetails.state})
                  </div>
                  <div className="text-slate-700 font-semibold">
                    <span className="text-slate-400 font-normal">Driver: </span>
                    {selectedVehicleDetails.driver}
                  </div>
                  <div className="text-slate-700 font-semibold">
                    <span className="text-slate-400 font-normal">Cargo: </span>
                    {selectedVehicleDetails.cargo}
                  </div>
                  <div className="pt-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>GPS Telemetry Active</span>
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedVehicleDetails.query)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#0066ff] hover:underline flex items-center space-x-0.5"
                    >
                      <span>Navigate</span>
                      <Navigation className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Bottom-Right Floating Legend Card (Matching Screenshot) */}
            {showOverlays && (
              <div className="absolute bottom-3.5 right-3.5 z-20 rounded-2xl bg-white/95 backdrop-blur border border-slate-200/90 p-3 shadow-xl text-xs font-bold text-slate-700 space-y-1.5 min-w-[155px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-1">
                  <span className="text-[11px] font-extrabold text-slate-900">Map Legend</span>
                  <button
                    onClick={() => setShowOverlays(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold"
                    title="Hide Legend"
                  >
                    Hide
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-500">🟢</span>
                  <span>Vehicle (Moving)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">🔴</span>
                  <span>Vehicle (Stopped)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>Incident</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🚧</span>
                  <span>Road Work</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-1 w-3.5 bg-emerald-500 rounded" />
                  <span>Clear Route</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-1 w-3.5 bg-amber-500 rounded" />
                  <span>Caution</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-1 w-3.5 bg-red-500 rounded" />
                  <span>Blocked Route</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🌧️</span>
                  <span>Weather Alert</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🟣</span>
                  <span>Logistics Hub</span>
                </div>
              </div>
            )}

            {!showOverlays && (
              <button
                onClick={() => setShowOverlays(true)}
                className="absolute bottom-3.5 right-3.5 z-20 rounded-xl bg-white/95 backdrop-blur border border-slate-200 px-3 py-1.5 shadow-md text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Show Legend
              </button>
            )}

            {/* 8. Bottom-Left Scale Bar & Source Notice */}
            <div className="absolute bottom-3.5 left-3.5 z-20 rounded-lg bg-white/90 backdrop-blur border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>100 km | © Google Maps &amp; NorthLink Live GPS</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3 FILTER & LIST CARDS (Col 10 to 12) */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
          {/* Card 1: Map Filters */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900">Map Filters</h2>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#0066ff] hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="space-y-2 text-xs font-medium">
              {/* State Filter */}
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option>All States</option>
                  <option>Assam</option>
                  <option>Meghalaya</option>
                  <option>Arunachal Pradesh</option>
                  <option>Nagaland</option>
                  <option>Manipur</option>
                  <option>Mizoram</option>
                  <option>Tripura</option>
                  <option>Sikkim</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Vehicles Filter */}
              <div className="relative">
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option>All Vehicles</option>
                  <option>Moving Only (42)</option>
                  <option>Stopped / Idle (6)</option>
                  <option>Cold-Chain Refrigerated</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Shipments Filter */}
              <div className="relative">
                <select
                  value={selectedShipment}
                  onChange={(e) => setSelectedShipment(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option>All Shipments</option>
                  <option>Medical Supplies</option>
                  <option>Food Ration</option>
                  <option>Emergency Fuel</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Incidents Filter */}
              <div className="relative">
                <select
                  value={selectedIncident}
                  onChange={(e) => setSelectedIncident(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option>All Incidents</option>
                  <option>Landslide (Red)</option>
                  <option>Flood &amp; Waterlogging</option>
                  <option>Road Construction</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Weather Conditions Filter */}
              <div className="relative">
                <select
                  value={selectedWeather}
                  onChange={(e) => setSelectedWeather(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option>All Weather Conditions</option>
                  <option>Severe Rain / Monsoon</option>
                  <option>High Fog &amp; Low Visibility</option>
                  <option>Clear Skies</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Card 2: Live Vehicles */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900">
                Live Vehicles ({selectedState === 'All States' ? '48' : filteredVehicles.length})
              </h2>
              <Link href="/logistics" className="text-xs font-bold text-[#0066ff] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5 text-xs max-h-56 overflow-y-auto pr-1">
              {filteredVehicles.length === 0 ? (
                <div className="py-4 text-center text-slate-400 text-xs">
                  No vehicles match the selected filter.
                </div>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => handleSelectVehicle(vehicle)}
                    className="flex items-start justify-between border-b border-slate-50 pb-2 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-start space-x-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 ${
                          vehicle.status === 'moving' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-[#0066ff] transition-colors flex items-center space-x-1">
                          <span>{vehicle.regNo}</span>
                          <span className="text-[10px] text-slate-400">({vehicle.code})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {vehicle.status === 'moving' ? `En route • ${vehicle.route}` : vehicle.route}
                        </div>
                        <div
                          className={`text-[11px] font-bold ${
                            vehicle.status === 'moving' ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {vehicle.speed}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{vehicle.timeAgo}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 3: Recent Alerts */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900">Recent Alerts</h2>
              <Link href="/alerts" className="text-xs font-bold text-[#0066ff] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
              {filteredAlerts.length === 0 ? (
                <div className="py-3 text-center text-slate-400 text-xs">
                  No alerts match the selected filter.
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => handleSelectAlert(alert)}
                    className="flex items-start space-x-2.5 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <span className="text-sm shrink-0 mt-0.5">{alert.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-bold leading-tight group-hover:underline ${
                          alert.type === 'landslide'
                            ? 'text-red-600'
                            : alert.type === 'weather'
                            ? 'text-[#0066ff]'
                            : 'text-amber-600'
                        }`}
                      >
                        {alert.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{alert.location}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{alert.timeAgo}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          C. BOTTOM 4 SUMMARY CARDS (Total Vehicles, Active Shipments, Active Incidents, At Risk Locations)
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {/* Card 1: Total Vehicles */}
        <div className="flex items-center space-x-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0066ff]">
            <Truck className="h-6 w-6 text-[#0066ff]" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">48</span>
              <span className="text-xs font-bold text-emerald-600">↑ 12%</span>
              <span className="text-[10px] text-slate-400 font-medium">vs last week</span>
            </div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">Total Vehicles</div>
          </div>
        </div>

        {/* Card 2: Active Shipments */}
        <div className="flex items-center space-x-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#10b981]">
            <Box className="h-6 w-6 text-[#10b981]" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">32</span>
              <span className="text-xs font-bold text-emerald-600">↑ 8%</span>
              <span className="text-[10px] text-slate-400 font-medium">vs last week</span>
            </div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">Active Shipments</div>
          </div>
        </div>

        {/* Card 3: Active Incidents */}
        <div className="flex items-center space-x-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">6</span>
              <span className="text-xs font-bold text-red-600">↑ 50%</span>
            </div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">Active Incidents</div>
          </div>
        </div>

        {/* Card 4: At Risk Locations */}
        <div className="flex items-center space-x-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <span className="text-2xl font-black">🚧</span>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">12</span>
              <span className="text-xs font-bold text-amber-600">↑ 20%</span>
            </div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">At Risk Locations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
