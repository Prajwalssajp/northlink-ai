'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  Box,
  AlertTriangle,
  MapPin,
  Users,
  Plus,
  Minus,
  Layers,
  CloudRain,
  Navigation,
  GitFork,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState('12:32:00 PM');
  const [currentDate, setCurrentDate] = useState('Mon, 17 Sep 2025');
  const [fullDateTime, setFullDateTime] = useState('2026-09-17 12:32:00 PM');
  const [mapZoom, setMapZoom] = useState(1);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');

      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
      setFullDateTime(`${yyyy}-${mm}-${dd} ${timeStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerAction = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  return (
    <div className="space-y-5 select-none">
      {/* ─────────────────────────────────────────────────────────
          A. WELCOME HEADER + USER QUOTE IN BOLD + TIME + SYSTEM STATUS
      ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back, Raghavendra!
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              Field Officer | Assam District
            </span>
          </div>

          {/* USER REQUESTED QUOTE IN BOLD LETTERS */}
          <div className="mt-2.5 inline-block rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 px-4 py-2 shadow-md">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              &quot;Keep life-saving supplies moving when roads fail&quot;
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500">{currentDate}</div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {fullDateTime}
            </div>
          </div>

          {/* System Online Pill */}
          <div className="flex items-center space-x-3 rounded-2xl bg-[#e8f8ed] border border-[#bbf7d0] px-4 py-2.5 shadow-sm">
            <span className="h-3.5 w-3.5 rounded-full bg-[#10b981] animate-pulse" />
            <div>
              <div className="text-xs font-bold text-[#065f46]">System Online</div>
              <div className="text-[11px] text-[#047857] font-medium">All services operational</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          B. 5 KPI CARDS ROW (Supply Trucks, Deliveries On Time, Road Alerts Open, Dangerous Zones, Field Safety Reports)
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Supply Trucks (Blue) */}
        <div className="flex items-center justify-between rounded-2xl bg-[#edf5ff] border border-[#d0e2ff] p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0066ff] text-white shadow">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Supply Trucks</div>
              <div className="text-2xl font-black text-slate-900 leading-tight">48</div>
            </div>
          </div>
          {/* Blue Sparkline */}
          <svg className="w-16 h-8 text-[#0066ff]" viewBox="0 0 64 32" fill="none">
            <path
              d="M2 24 L14 18 L26 22 L38 12 L50 16 L62 6"
              stroke="#0066ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Card 2: Deliveries On Time (Green) */}
        <div className="flex items-center justify-between rounded-2xl bg-[#eaf8ee] border border-[#c4edd0] p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10b981] text-white shadow">
              <Box className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Deliveries On Time</div>
              <div className="text-2xl font-black text-slate-900 leading-tight">32</div>
            </div>
          </div>
          {/* Green Sparkline */}
          <svg className="w-16 h-8 text-[#10b981]" viewBox="0 0 64 32" fill="none">
            <path
              d="M2 26 L14 22 L26 24 L38 14 L50 12 L62 4"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Card 3: Road Alerts Open (Red) */}
        <div className="flex items-center justify-between rounded-2xl bg-[#fdf0f0] border border-[#fcd0d0] p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ef4444] text-white shadow">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Road Alerts Open</div>
              <div className="text-2xl font-black text-slate-900 leading-tight">6</div>
            </div>
          </div>
          {/* Red Sparkline */}
          <svg className="w-16 h-8 text-[#ef4444]" viewBox="0 0 64 32" fill="none">
            <path
              d="M2 20 L14 22 L26 14 L38 18 L50 8 L62 12"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Card 4: Dangerous Zones (Orange/Amber) */}
        <div className="flex items-center justify-between rounded-2xl bg-[#fef7ec] border border-[#fde4bc] p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f59e0b] text-white shadow">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Dangerous Zones</div>
              <div className="text-2xl font-black text-slate-900 leading-tight">12</div>
            </div>
          </div>
          {/* Amber Sparkline */}
          <svg className="w-16 h-8 text-[#f59e0b]" viewBox="0 0 64 32" fill="none">
            <path
              d="M2 18 L14 16 L26 22 L38 20 L50 10 L62 14"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Card 5: Field Safety Reports (Purple) */}
        <div className="flex items-center justify-between rounded-2xl bg-[#f6f2fd] border border-[#e6d8fb] p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8b5cf6] text-white shadow">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Field Safety Reports</div>
              <div className="text-2xl font-black text-slate-900 leading-tight">28</div>
            </div>
          </div>
          {/* Purple Sparkline */}
          <svg className="w-16 h-8 text-[#8b5cf6]" viewBox="0 0 64 32" fill="none">
            <path
              d="M2 24 L14 20 L26 18 L38 22 L50 14 L62 16"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          C. MIDDLE SECTION: LIVE MAP + ACTIVE HAZARD ALERTS
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Large Map Card (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">North East Region - Live Map</h2>
              <span className="flex items-center space-x-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live</span>
              </span>
            </div>

            <Link
              href="/live-map"
              className="text-xs font-bold text-[#0066ff] hover:underline"
            >
              Full GIS →
            </Link>
          </div>

          {/* Interactive Visual Map Canvas */}
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-[#8cb3d9]">
            {/* SVG Topographic & NER Political Contours */}
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 700 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: `scale(${mapZoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease',
              }}
            >
              {/* Land Base */}
              <rect width="700" height="420" fill="#a4c4a8" />
              {/* Mountain Shading */}
              <path
                d="M40 80 Q160 40 320 90 T690 70 L700 0 L0 0 Z"
                fill="#8ea792"
                opacity="0.9"
              />
              <path
                d="M0 240 Q180 180 380 230 T700 190 L700 80 L0 100 Z"
                fill="#7e9c83"
                opacity="0.8"
              />

              {/* State Labels & Areas */}
              <text x="75" y="190" fill="#2d3748" fontSize="14" fontWeight="800">Sikkim</text>
              <text x="350" y="80" fill="#2d3748" fontSize="15" fontWeight="800">Arunachal Pradesh</text>
              <text x="240" y="215" fill="#2d3748" fontSize="16" fontWeight="800">Assam</text>
              <text x="180" y="295" fill="#2d3748" fontSize="14" fontWeight="800">Meghalaya</text>
              <text x="490" y="240" fill="#2d3748" fontSize="14" fontWeight="800">Nagaland</text>
              <text x="480" y="300" fill="#2d3748" fontSize="14" fontWeight="800">Manipur</text>
              <text x="260" y="365" fill="#2d3748" fontSize="13" fontWeight="800">Tripura</text>
              <text x="380" y="385" fill="#2d3748" fontSize="14" fontWeight="800">Mizoram</text>

              {/* Red Danger Zone Polygon covering Nagaland & Manipur */}
              <polygon
                points="420,160 590,165 570,320 430,320 410,230"
                fill="#ef4444"
                fillOpacity="0.45"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {/* River Brahmaputra line */}
              <path
                d="M40 180 Q190 140 340 190 T680 140"
                stroke="#7ca5c9"
                strokeWidth="7"
                fill="none"
              />

              {/* Safe Green Route Line from Guwahati to Tawang */}
              <path
                d="M80 185 L140 195 L220 205 L280 185 L320 160"
                stroke="#059669"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Rerouted Alternative path to avoid danger zone */}
              <path
                d="M280 185 L320 225 L370 230"
                stroke="#d97706"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 3"
                fill="none"
              />

              {/* Truck Markers along Route */}
              <circle cx="160" cy="198" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="240" cy="205" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="450" cy="180" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="520" cy="200" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="440" cy="305" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

              {/* Hazard Markers inside Danger Zone */}
              <circle cx="450" cy="210" r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <text x="450" y="215" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">⚠️</text>

              <circle cx="580" cy="190" r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <text x="580" y="195" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">⚠️</text>
            </svg>

            {/* Origin Callout Badge */}
            <div className="absolute top-12 left-16 z-10 rounded-xl bg-black/80 text-white px-3 py-1.5 text-xs font-bold shadow-lg border border-slate-700">
              <div className="text-[9px] uppercase text-emerald-400 font-extrabold">ORIGIN:</div>
              <div className="text-xs font-black">Guwahati Hub</div>
            </div>

            {/* Current Path Badge */}
            <div className="absolute top-18 left-56 z-10 rounded-lg bg-emerald-800 text-white px-2.5 py-0.5 text-[11px] font-bold shadow">
              Current path
            </div>

            {/* Destination Callout Badge */}
            <div className="absolute top-36 left-8 z-10 rounded-xl bg-black/80 text-white px-3 py-1.5 text-xs font-bold shadow-lg border border-slate-700">
              <div className="text-[9px] uppercase text-emerald-400 font-extrabold">DESTINATION:</div>
              <div className="text-xs font-black">Tawang Clinic</div>
            </div>

            {/* Mudslide Warning Banner */}
            <div className="absolute bottom-16 left-32 z-10 flex items-center space-x-2 rounded-xl bg-black/85 text-amber-300 px-3.5 py-1.5 text-xs font-bold border border-amber-500/60 shadow-xl">
              <span className="text-sm">⚠️</span>
              <span>WARNING: Mudslide Hazard on NH-15</span>
            </div>

            {/* Map Zoom Controls (Top Left) */}
            <div className="absolute top-3 left-3 z-10 flex flex-col rounded-xl bg-white border border-slate-200 shadow-md text-slate-700 overflow-hidden">
              <button
                onClick={() => setMapZoom((prev) => Math.min(prev + 0.2, 1.8))}
                className="p-2 hover:bg-slate-100 border-b border-slate-200"
                title="Zoom In"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMapZoom((prev) => Math.max(prev - 0.2, 0.8))}
                className="p-2 hover:bg-slate-100 border-b border-slate-200"
                title="Zoom Out"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMapZoom(1)}
                className="p-2 hover:bg-slate-100"
                title="Reset View"
              >
                <Layers className="h-4 w-4" />
              </button>
            </div>

            {/* Floating Map Legend (Bottom Right) */}
            <div className="absolute bottom-3 right-3 z-10 rounded-xl bg-white/95 backdrop-blur border border-slate-200 p-2.5 shadow-md text-xs space-y-1.5 font-bold text-slate-700">
              <div className="flex items-center space-x-2">
                <span className="text-sm">🟢</span>
                <span>Vehicle</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">🔴</span>
                <span>Incident</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">🚧</span>
                <span>Blocked Road</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">🌧️</span>
                <span>Weather Alert</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">🟣</span>
                <span>Shipment Hub</span>
              </div>
            </div>

            {/* Attribution Scale */}
            <div className="absolute bottom-2 left-3 z-10 rounded bg-white/80 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
              100 km | © OpenStreetMap contributors
            </div>
          </div>
        </div>

        {/* Right Hazard Alerts Card (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h2 className="text-base font-bold text-slate-900">Active Hazard Alerts</h2>
              <Link href="/alerts" className="text-xs font-bold text-[#0066ff] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {/* Alert 1 (Red Landslide) */}
              <div className="flex items-start space-x-3 rounded-2xl bg-red-50/70 border border-red-200 p-3.5 shadow-sm hover:bg-red-50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-red-600">
                    1. Landslide Detected!
                  </div>
                  <div className="text-xs text-slate-700 font-semibold mt-0.5">
                    NH-15 Bypass. Red Zone.
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">
                    10 mins ago
                  </div>
                </div>
              </div>

              {/* Alert 2 (Blue Severe Thunderstorm) */}
              <div className="flex items-start space-x-3 rounded-2xl bg-blue-50/70 border border-blue-200 p-3.5 shadow-sm hover:bg-blue-50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0066ff] text-white shadow">
                  <CloudRain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-[#0066ff]">
                    2. Severe Thunderstorm Warning.
                  </div>
                  <div className="text-xs text-slate-700 font-semibold mt-0.5">
                    Silchar. Flood Polygon.
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">
                    25 mins ago
                  </div>
                </div>
              </div>

              {/* Alert 3 (Orange Bridge Inspection) */}
              <div className="flex items-start space-x-3 rounded-2xl bg-amber-50/70 border border-amber-200 p-3.5 shadow-sm hover:bg-amber-50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow">
                  <span className="text-xl">🚧</span>
                </div>
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-amber-600">
                    3. Bridge Inspection Req.
                  </div>
                  <div className="text-xs text-slate-700 font-semibold mt-0.5">
                    NH-2 Route. Restricted.
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">
                    2 hours ago
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/route-intelligence"
            className="mt-4 flex items-center justify-center space-x-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-bold transition-all shadow"
          >
            <span>Run AI Reroute Recommendation</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          D. BOTTOM SECTION: WEATHER OVERVIEW + SHIPMENT + EMERGENCY TOOLS
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Weather Overview (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center space-x-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  ➕
                </span>
                <h3 className="text-sm font-bold text-slate-900">Weather Overview</h3>
              </div>
              <Link href="/alerts" className="text-xs font-bold text-[#0066ff] hover:underline">
                View Details
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Guwahati */}
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-700">Guwahati</div>
                <div className="text-2xl my-1">🌧️</div>
                <div className="text-xs font-extrabold text-slate-900">28°C</div>
                <div className="text-[10px] text-slate-500 font-medium">Rain 28C</div>
              </div>

              {/* Silchar */}
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-700">Silchar</div>
                <div className="text-2xl my-1">🌊</div>
                <div className="text-xs font-extrabold text-slate-900">25°C</div>
                <div className="text-[10px] text-slate-500 font-medium">Flood 25C</div>
              </div>

              {/* Tawang */}
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-700">Tawang</div>
                <div className="text-2xl my-1">⛈️</div>
                <div className="text-xs font-extrabold text-slate-900">18°C</div>
                <div className="text-[10px] text-slate-500 font-medium">Storm 18C</div>
              </div>

              {/* Itanagar */}
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-700">Itanagar</div>
                <div className="text-2xl my-1">🌦️</div>
                <div className="text-xs font-extrabold text-slate-900">18°C</div>
                <div className="text-[10px] text-slate-500 font-medium">Light Rain</div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Table (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-base">💼</span>
                <h3 className="text-sm font-bold text-slate-900">Shipment</h3>
              </div>
              <Link href="/logistics" className="text-xs font-bold text-[#0066ff] hover:underline">
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-100">
                    <th className="pb-2">Shipment ID</th>
                    <th className="pb-2">From</th>
                    <th className="pb-2">To</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 font-bold text-slate-900">#SRN1287</td>
                    <td className="py-2 text-slate-600">Guwahati</td>
                    <td className="py-2 text-slate-600">Silchar</td>
                    <td className="py-2">
                      <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>On Time</span>
                      </span>
                    </td>
                    <td className="py-2 text-slate-500 font-medium">16 Sep</td>
                  </tr>

                  <tr>
                    <td className="py-2 font-bold text-slate-900">#SRN1290</td>
                    <td className="py-2 text-slate-600">Dimapur</td>
                    <td className="py-2 text-slate-600">Kohima</td>
                    <td className="py-2">
                      <span className="inline-flex items-center space-x-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span>In Transit</span>
                      </span>
                    </td>
                    <td className="py-2 text-slate-500 font-medium">17 Sep</td>
                  </tr>

                  <tr>
                    <td className="py-2 font-bold text-slate-900">#SRN1291</td>
                    <td className="py-2 text-slate-600">Aizawl</td>
                    <td className="py-2 text-slate-600">Agartala</td>
                    <td className="py-2">
                      <span className="inline-flex items-center space-x-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-[10px] font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <span>Delayed</span>
                      </span>
                    </td>
                    <td className="py-2 text-slate-500 font-medium">18 Sep</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Emergency Tools (3 Cols) */}
        <div className="lg:col-span-3 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5 mb-3">
              <span className="text-amber-500 text-base">⚡</span>
              <h3 className="text-sm font-bold text-slate-900">Emergency Tools</h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Reroute Truck */}
              <button
                onClick={() => triggerAction('⚡ Triggering emergency truck rerouting protocol...')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-[#0066ff] transition-all text-center group active:scale-95"
              >
                <AlertTriangle className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black leading-tight">Reroute<br />Truck</span>
              </button>

              {/* 2. Update ETA */}
              <button
                onClick={() => triggerAction('⏱️ Updating convoy ETA across all checkpoints...')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-[#059669] transition-all text-center group active:scale-95"
              >
                <Truck className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black leading-tight">Update<br />ETA</span>
              </button>

              {/* 3. Plan a Route */}
              <button
                onClick={() => triggerAction('🗺️ Opening ML Route Planner...')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-100 text-[#7c3aed] transition-all text-center group active:scale-95"
              >
                <GitFork className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black leading-tight">Plan a<br />Route</span>
              </button>

              {/* 4. Report Hazard */}
              <button
                onClick={() => triggerAction('⚠️ Opening Rapid Field Hazard Reporter...')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-100 text-[#d97706] transition-all text-center group active:scale-95"
              >
                <BarChart3 className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black leading-tight">Report<br />Hazard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Toast */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 text-xs font-bold animate-fade-in">
          <span>{activeToast}</span>
        </div>
      )}
    </div>
  );
}
