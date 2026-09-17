'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Map as MapFoldIcon,
  Truck,
  Compass,
  AlertTriangle,
  CloudSun,
  MessageSquare,
  User as UserIcon,
  Headphones,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  Globe,
  Navigation,
  Volume2,
  Phone,
  FileText,
  Fuel,
  Gauge,
  Settings,
  Signal,
  MapPin,
  Flag,
  Box,
  ExternalLink,
  X
} from 'lucide-react';
import { useDemo } from '@/lib/demo-context';

interface LangOption {
  id: string;
  name: string;
  native: string;
  sampleVoice: string;
}

const NER_LANGUAGES: LangOption[] = [
  { id: 'en', name: 'English', native: '', sampleVoice: 'Drive safe. Navigation guidance is active.' },
  { id: 'as', name: 'Assamese', native: '(অসমীয়া)', sampleVoice: 'নিৰাপদে গাড়ী চলাওক। নৱীগেশ্বন আৰম্ভ হৈছে।' },
  { id: 'bn', name: 'Bengali', native: '(বাংলা)', sampleVoice: 'সাবধানে ড্রাইভ করুন। পথ নির্দেশনা চালু আছে।' },
  { id: 'bodo', name: 'Bodo', native: '(बड़ो)', sampleVoice: 'मोजाङै गारि सालाय। लामा दिन्थिनाय जागायबाय।' },
  { id: 'mni', name: 'Manipuri', native: '(মণিপুরী)', sampleVoice: 'চেকশিন্না থৌবীয়ু। য়াম্না মরুওই।' },
  { id: 'mei', name: 'Meitei (Manipuri)', native: '(ꯃꯤꯇꯩꯂꯣꯟ)', sampleVoice: 'ꯆꯦꯛꯁꯤꯟꯅ ꯒꯥꯔꯤ ꯊꯧꯕꯤꯌꯨ।' },
  { id: 'mizo', name: 'Mizo', native: '(Ṭawng)', sampleVoice: 'Fimkhur takin khalh rawh le.' },
  { id: 'ne', name: 'Nepali', native: '(नेपाली)', sampleVoice: 'सुरक्षित यात्रा गर्नुहोस्। सडक खुल्ला छ।' },
  { id: 'trp', name: 'Tripuri', native: '(ককবরক)', sampleVoice: 'Kahamoitwi gaari salai di.' },
];

export default function DriverModePage() {
  const router = useRouter();
  const { logout } = useDemo();

  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [voiceVolume, setVoiceVolume] = useState<number>(70);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  const [showControlRoomModal, setShowControlRoomModal] = useState<boolean>(false);
  const [showIncidentModal, setShowIncidentModal] = useState<boolean>(false);
  const [showTripDetailsModal, setShowTripDetailsModal] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  const [incidentLocation, setIncidentLocation] = useState('NH-06 near Sonapur');
  const [incidentType, setIncidentType] = useState('Landslide');
  const [incidentDesc, setIncidentDesc] = useState('');

  const [currentTime, setCurrentTime] = useState('10:24 AM');
  const [currentDate, setCurrentDate] = useState('Mon, 15 Sep 2025');

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
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const playVoice = (textToSpeak?: string) => {
    if (!isVoiceEnabled) {
      triggerToast('⚠️ Voice guidance is currently muted.');
      return;
    }

    const currentLangObj = NER_LANGUAGES.find((l) => l.id === selectedLang) || NER_LANGUAGES[0];
    const text = textToSpeak || `${currentLangObj.sampleVoice} Caution ahead: Landslide reported near NH-06 Sonapur.`;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = voiceVolume / 100;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      triggerToast(`🔊 Voice guidance playing (${currentLangObj.name})`);
    } else {
      triggerToast('Audio guidance not supported on this device.');
    }
  };

  const triggerToast = (msg: string) => {
    setShowSuccessToast(msg);
    setTimeout(() => setShowSuccessToast(null), 3500);
  };

  const handleStartNavigation = () => {
    setIsNavigating(!isNavigating);
    if (!isNavigating) {
      playVoice('Google Maps Navigation started. Follow NH-27 towards Shillong. Road condition is good.');
      triggerToast('🚀 Google Maps navigation active! Turn-by-turn GPS online.');
    } else {
      triggerToast('Navigation paused.');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleReportIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowIncidentModal(false);
    triggerToast('✅ Incident report submitted to Control Room & BRO Pushpak!');
    setIncidentDesc('');
  };

  // Google Maps driving route from Guwahati through Shillong and Silchar to Aizawl
  const googleMapsEmbedUrl = mapType === 'satellite'
    ? 'https://maps.google.com/maps?saddr=Guwahati,+Assam&daddr=Shillong,+Meghalaya+to:Silchar,+Assam+to:Aizawl,+Mizoram&t=k&z=8&output=embed'
    : 'https://maps.google.com/maps?saddr=Guwahati,+Assam&daddr=Shillong,+Meghalaya+to:Silchar,+Assam+to:Aizawl,+Mizoram&t=m&z=8&output=embed';

  const googleMapsExternalUrl = 'https://www.google.com/maps/dir/Guwahati,+Assam/Shillong,+Meghalaya/Silchar,+Assam/Aizawl,+Mizoram';

  return (
    <div className="flex min-h-screen w-full bg-[#f4f7fb] text-slate-800 font-sans antialiased select-none">
      {/* ─────────────────────────────────────────────────────────────
          1. LEFT SIDEBAR (Dark Navy, exactly matching the screenshot)
      ───────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 flex-col justify-between bg-[#0b192e] text-slate-300 shrink-0 border-r border-[#152a4a]">
        <div>
          {/* NorthLink AI Brand Header */}
          <div className="px-6 py-6 border-b border-[#162d4e]/70">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-900/50">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L1 21h22L12 2zm0 4.5l6.5 11.5h-13L12 6.5z" />
                  <path d="M12 11l3 5H9l3-5z" opacity="0.6" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-black tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                  NorthLink AI
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Connected North East<br />Stronger Tomorrow
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            <Link
              href="/"
              className="flex items-center space-x-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-[#132742] hover:text-white transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 text-slate-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/logistics"
              className="flex items-center space-x-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-[#132742] hover:text-white transition-colors"
            >
              <MapFoldIcon className="h-5 w-5 text-slate-400" />
              <span>My Trips</span>
            </Link>

            {/* Active Driver Mode Pill (Bright Blue) */}
            <Link
              href="/driver"
              className="flex items-center space-x-3 rounded-xl bg-[#0066ff] px-4 py-3 text-white font-bold shadow-md shadow-blue-900/40"
            >
              <Truck className="h-5 w-5 text-white" />
              <span>Driver Mode</span>
            </Link>

            <Link
              href="/route-intelligence"
              className="flex items-center space-x-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-[#132742] hover:text-white transition-colors"
            >
              <Compass className="h-5 w-5 text-slate-400" />
              <span>Route</span>
            </Link>

            <Link
              href="/incidents"
              className="flex items-center space-x-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-[#132742] hover:text-white transition-colors"
            >
              <AlertTriangle className="h-5 w-5 text-slate-400" />
              <span>Incidents</span>
            </Link>

            <Link
              href="/alerts"
              className="flex items-center space-x-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-[#132742] hover:text-white transition-colors"
            >
              <CloudSun className="h-5 w-5 text-slate-400" />
              <span>Weather</span>
            </Link>

            <Link
              href="/alerts"
              className="flex items-center justify-between rounded-xl px-4 py-3 text-slate-300 hover:bg-[#132742] hover:text-white transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-slate-400" />
                <span>Messages</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow-sm">
                3
              </span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center space-x-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-[#132742] hover:text-white transition-colors"
            >
              <UserIcon className="h-5 w-5 text-slate-400" />
              <span>Profile</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Sidebar Controls */}
        <div className="p-3 border-t border-[#162d4e]/70 space-y-1 text-sm font-medium">
          <button
            onClick={() => setShowControlRoomModal(true)}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-[#132742] hover:text-white transition-colors text-left"
          >
            <Headphones className="h-5 w-5 text-slate-400" />
            <span>Help & Support</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 transition-colors text-left"
          >
            <LogOut className="h-5 w-5 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-5 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center space-x-4">
            <button className="text-slate-600 hover:text-slate-900 p-1 lg:hidden">
              <Menu className="h-6 w-6" />
            </button>

            {/* Driver Mode Active Status Badge */}
            <div className="flex items-center space-x-2.5 rounded-full bg-[#e8f8ed] border border-[#bbf7d0] px-3.5 py-1 text-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] animate-pulse" />
              <div>
                <span className="font-bold text-[#065f46]">Driver Mode Active</span>
                <span className="hidden sm:inline text-[#047857] text-[11px] ml-1.5 font-medium">
                  You are on duty
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell with Badge 3 */}
            <div className="relative">
              <button
                onClick={() => setShowTripDetailsModal(true)}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  3
                </span>
              </button>
            </div>

            {/* Profile Dinesh Kumar */}
            <div className="flex items-center space-x-2.5 border-l border-slate-200 pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b192e] text-white font-bold text-xs shadow-inner">
                DK
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Dinesh Kumar
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Driver</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Language Selector Header Dropdown */}
            <div className="hidden md:flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 cursor-pointer shadow-sm">
              <Globe className="h-4 w-4 text-slate-500" />
              <span>English + NER Langs</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Driver Mode Dashboard Body */}
        <main className="p-5 lg:p-6 space-y-5 max-w-[1600px] w-full mx-auto">
          {/* ─────────────────────────────────────────────────────────
              A. HERO TITLE + DATE/TIME + VEHICLE ONLINE
          ───────────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b192e] text-white shadow-md">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Driver Mode
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Safe Routes. Smarter Deliveries. Stronger North East.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500">{currentDate}</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {currentTime}
                </div>
              </div>

              {/* Green Pill: Vehicle Online / GPS Tracking Active */}
              <div className="flex items-center space-x-3 rounded-2xl bg-[#e8f8ed] border border-[#bbf7d0] px-4 py-2.5 shadow-sm">
                <span className="h-3.5 w-3.5 rounded-full bg-[#10b981] animate-ping opacity-75" />
                <div>
                  <div className="text-xs font-bold text-[#065f46]">Vehicle Online</div>
                  <div className="text-[11px] text-[#047857] font-medium">GPS Tracking Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              B. 4 TRIP SUMMARY CARDS ROW
          ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Trip ID */}
            <div className="flex items-center space-x-3.5 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0066ff] text-white shadow">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-500">Trip ID</div>
                <div className="text-sm font-black text-slate-900 truncate">
                  TRP-2025-0915-01
                </div>
                <div className="text-xs font-bold text-[#0066ff]">Food Supplies</div>
              </div>
            </div>

            {/* Card 2: From */}
            <div className="flex items-center space-x-3.5 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#10b981] text-white shadow">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-500">From</div>
                <div className="text-sm font-black text-slate-900 truncate">
                  Guwahati (Assam)
                </div>
                <div className="text-xs font-medium text-slate-500">08:00 AM</div>
              </div>
            </div>

            {/* Card 3: To */}
            <div className="flex items-center space-x-3.5 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#059669] text-white shadow">
                <Flag className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-500">To</div>
                <div className="text-sm font-black text-slate-900 truncate">
                  Aizawl (Mizoram)
                </div>
                <div className="text-xs font-medium text-slate-500">ETA: 06:30 PM</div>
              </div>
            </div>

            {/* Card 4: Cargo */}
            <div className="flex items-center space-x-3.5 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow">
                <Box className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-500">Cargo</div>
                <div className="text-sm font-black text-slate-900 truncate">
                  Essential Goods
                </div>
                <div className="text-xs font-medium text-slate-500">2.5 Tons</div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              C. MAIN GRID (Route Navigation + Google Maps + Vehicle Status + Sound & NER Langs)
          ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Sub-Column: Route Navigation (Col 1 to 3) */}
            <div className="lg:col-span-3 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Route Navigation</h2>

                {/* Top 3 metrics */}
                <div className="mt-3 grid grid-cols-3 gap-2 border-b border-slate-100 pb-3.5">
                  <div>
                    <div className="text-[11px] font-medium text-slate-400">Distance</div>
                    <div className="text-sm font-black text-slate-900">412 km</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-400">Estimated Time</div>
                    <div className="text-sm font-black text-slate-900">10 hrs 30 mins</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-400">Road Condition</div>
                    <div className="flex items-center space-x-1 text-sm font-bold text-[#10b981]">
                      <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                      <span>Good</span>
                    </div>
                  </div>
                </div>

                {/* Vertical Timeline */}
                <div className="mt-4 relative pl-7 space-y-4 text-xs">
                  {/* Vertical connecting line */}
                  <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-slate-200" />

                  {/* Waypoint 1: Guwahati */}
                  <div className="relative">
                    <span className="absolute -left-7 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-[#10b981]">
                      <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                    </span>
                    <div className="font-bold text-sm text-slate-900">Guwahati</div>
                    <div className="text-slate-500 font-medium">Start • 08:00 AM</div>
                  </div>

                  {/* Waypoint 2: Shillong */}
                  <div className="relative">
                    <span className="absolute -left-7 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    </span>
                    <div className="font-bold text-sm text-slate-900">Shillong</div>
                    <div className="text-slate-500 font-medium">120 km • 2 hrs 45 mins</div>
                  </div>

                  {/* Waypoint 3: Landslide Prone Area (Orange) */}
                  <div className="relative">
                    <span className="absolute -left-7 top-0.5 flex h-5 w-5 items-center justify-center text-[#ea580c]">
                      ⚠️
                    </span>
                    <div className="font-bold text-sm text-[#ea580c]">
                      Landslide Prone Area
                    </div>
                    <div className="text-slate-500 font-medium">Drive with caution</div>
                  </div>

                  {/* Waypoint 4: Silchar */}
                  <div className="relative">
                    <span className="absolute -left-7 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    </span>
                    <div className="font-bold text-sm text-slate-900">Silchar</div>
                    <div className="text-slate-500 font-medium">310 km • 7 hrs 20 mins</div>
                  </div>

                  {/* Waypoint 5: Aizawl (Destination) */}
                  <div className="relative">
                    <span className="absolute -left-7 top-0.5 flex h-5 w-5 items-center justify-center text-red-500">
                      📍
                    </span>
                    <div className="font-bold text-sm text-slate-900">Aizawl</div>
                    <div className="text-slate-500 font-medium">
                      412 km • 10 hrs 30 mins • ETA 06:30 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Sub-Column: Google Maps Driving Route Card (Col 4 to 7) */}
            <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/80 p-2 shadow-sm flex flex-col relative overflow-hidden">
              <div className="relative w-full h-[420px] rounded-xl overflow-hidden bg-slate-100">
                {/* Genuine Interactive Google Maps Route */}
                <iframe
                  key={mapType}
                  title="Google Maps Route Navigation"
                  src={googleMapsEmbedUrl}
                  className="w-full h-full border-0 rounded-xl"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Google Map / Satellite Switcher Controls (Top Left) */}
                <div className="absolute top-3 left-3 flex rounded-lg bg-white/95 backdrop-blur border border-slate-300 p-0.5 shadow-md text-xs font-bold z-10">
                  <button
                    onClick={() => setMapType('map')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
                      mapType === 'map'
                        ? 'bg-[#0066ff] text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>Map</span>
                  </button>
                  <button
                    onClick={() => setMapType('satellite')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
                      mapType === 'satellite'
                        ? 'bg-[#0066ff] text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>Satellite</span>
                  </button>
                </div>

                {/* Floating Map Legend (Top Right) */}
                <div className="absolute top-3 right-3 rounded-xl bg-white/95 backdrop-blur border border-slate-200/90 p-2.5 shadow-md text-[11px] space-y-1 font-semibold text-slate-700 z-10 pointer-events-none">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0066ff]" />
                    <span>Your Location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-0.5 w-3 bg-[#0066ff]" />
                    <span>Route</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#ea580c]">
                    <span>⚠️</span>
                    <span>Incident</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-400 bg-white" />
                    <span>Checkpoint</span>
                  </div>
                  <div className="flex items-center space-x-2 text-red-500">
                    <span>📍</span>
                    <span>Destination</span>
                  </div>
                </div>

                {/* Open in Google Maps Navigation Button (Bottom Left) */}
                <div className="absolute bottom-3 left-3 z-10">
                  <a
                    href={googleMapsExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 border border-slate-300 px-3 py-1.5 text-xs font-bold shadow-md hover:text-[#0066ff] transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-[#0066ff]" />
                    <span>Open in Google Maps App</span>
                  </a>
                </div>

                {/* Google Maps Live Badge (Bottom Right) */}
                <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-700 border border-slate-200 shadow-sm pointer-events-none">
                  <span>Google Maps Live</span>
                </div>
              </div>
            </div>

            {/* Sub-Column 3: Live Vehicle Status + Caution Warning (Col 8 to 9) */}
            <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
              {/* Live Vehicle Status Card */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm space-y-3.5 flex-1">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                  <Truck className="h-4 w-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">Live Vehicle Status</h3>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Speed */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Gauge className="h-4 w-4 text-[#0066ff]" />
                      <span>Speed</span>
                    </div>
                    <span className="font-bold text-slate-900">60 km/h</span>
                  </div>

                  {/* Fuel Level */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Fuel className="h-4 w-4 text-[#0066ff]" />
                      <span>Fuel Level</span>
                    </div>
                    <span className="font-bold text-slate-900">70%</span>
                  </div>

                  {/* Engine Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Settings className="h-4 w-4 text-[#0066ff]" />
                      <span>Engine Status</span>
                    </div>
                    <span className="font-bold text-slate-900">Normal</span>
                  </div>

                  {/* GPS Signal */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Signal className="h-4 w-4 text-[#10b981]" />
                      <span>GPS Signal</span>
                    </div>
                    <span className="font-bold text-[#10b981]">Strong</span>
                  </div>
                </div>
              </div>

              {/* Caution Alert Card */}
              <div className="rounded-2xl bg-[#fff2f2] border border-[#fecaca] p-3.5 shadow-sm">
                <div className="flex items-center space-x-1.5 text-red-600 font-bold text-xs">
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Caution</span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-red-700 leading-relaxed">
                  Landslide reported ahead at NH-06. Drive carefully and follow updated route.
                </p>
              </div>
            </div>

            {/* Sub-Column 4: Navigation Sounds + NER Region Languages (Col 10 to 12) */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-4">
              {/* Navigation Sounds Card */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <Volume2 className="h-5 w-5 text-[#0066ff] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        Navigation Sounds
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Get voice guidance in your preferred language
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => {
                      setIsVoiceEnabled(!isVoiceEnabled);
                      triggerToast(
                        !isVoiceEnabled ? '🔊 Voice Guidance Enabled' : '🔇 Voice Guidance Muted'
                      );
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isVoiceEnabled ? 'bg-[#0066ff]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isVoiceEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Select Language Dropdown */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">Select Language</label>
                  <div className="relative">
                    <select
                      value={selectedLang}
                      onChange={(e) => {
                        setSelectedLang(e.target.value);
                        const found = NER_LANGUAGES.find((l) => l.id === e.target.value);
                        if (found) playVoice(found.sampleVoice);
                      }}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 pr-8 focus:outline-none focus:border-blue-500"
                    >
                      {NER_LANGUAGES.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} {l.native}
                        </option>
                      ))}
                    </select>
                    <Volume2 className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Voice Volume Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-500">Voice Volume</span>
                    <span className="font-bold text-slate-700">{voiceVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceVolume}
                    onChange={(e) => setVoiceVolume(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0066ff]"
                  />
                </div>

                {/* Test Voice Button */}
                <button
                  onClick={() => playVoice()}
                  className="w-full flex items-center justify-center space-x-1.5 rounded-xl border border-[#0066ff]/40 bg-blue-50/60 hover:bg-blue-100/80 py-1.5 text-xs font-bold text-[#0066ff] transition-colors"
                >
                  <span>▶</span>
                  <span>Test Voice</span>
                </button>
              </div>

              {/* NER Region Languages Card (3x3 Grid) */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm space-y-2.5">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-5 w-5 text-[#6554c0] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      NER Region Languages
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Choose from North East regional languages for navigation and alerts
                    </p>
                  </div>
                </div>

                {/* 3x3 Grid of 9 Languages */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {NER_LANGUAGES.map((langItem) => {
                    const isSelected = selectedLang === langItem.id;
                    return (
                      <button
                        key={langItem.id}
                        onClick={() => {
                          setSelectedLang(langItem.id);
                          playVoice(langItem.sampleVoice);
                        }}
                        className={`relative rounded-xl p-2 text-center transition-all flex flex-col items-center justify-center min-h-[52px] ${
                          isSelected
                            ? 'border-2 border-[#0066ff] bg-blue-50 text-[#0066ff] shadow-sm'
                            : 'border border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0066ff] text-white text-[9px] font-black">
                            ✓
                          </span>
                        )}
                        <div className="text-[11px] font-bold leading-tight">{langItem.name}</div>
                        {langItem.native && (
                          <div className="text-[9px] text-slate-500 mt-0.5 leading-none">
                            {langItem.native}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              D. BOTTOM 5 QUICK ACTION BUTTONS (Row matching the screenshot)
          ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {/* 1. Start Navigation (Green) */}
            <button
              onClick={handleStartNavigation}
              className={`flex items-center justify-center space-x-2 rounded-2xl py-3.5 px-4 text-sm font-bold text-white shadow-md active:scale-95 transition-all ${
                isNavigating
                  ? 'bg-[#047857] hover:bg-[#065f46]'
                  : 'bg-[#00875a] hover:bg-[#00744e]'
              }`}
            >
              <Navigation className="h-4 w-4 text-white shrink-0 fill-current" />
              <span>{isNavigating ? 'Pause Navigation' : 'Start Navigation'}</span>
            </button>

            {/* 2. Navigation Sounds (Blue) */}
            <button
              onClick={() => playVoice()}
              className="flex items-center justify-center space-x-2 rounded-2xl bg-[#0052cc] hover:bg-[#0047b3] py-3.5 px-4 text-sm font-bold text-white shadow-md active:scale-95 transition-all"
            >
              <Volume2 className="h-4 w-4 text-white shrink-0" />
              <span>Navigation Sounds</span>
            </button>

            {/* 3. Contact Control Room (Purple) */}
            <button
              onClick={() => setShowControlRoomModal(true)}
              className="flex items-center justify-center space-x-2 rounded-2xl bg-[#6554c0] hover:bg-[#5746b2] py-3.5 px-4 text-sm font-bold text-white shadow-md active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4 text-white shrink-0" />
              <span>Contact Control Room</span>
            </button>

            {/* 4. Report Incident (Orange) */}
            <button
              onClick={() => setShowIncidentModal(true)}
              className="flex items-center justify-center space-x-2 rounded-2xl bg-[#ff5630] hover:bg-[#de350b] py-3.5 px-4 text-sm font-bold text-white shadow-md active:scale-95 transition-all"
            >
              <AlertTriangle className="h-4 w-4 text-white shrink-0" />
              <span>Report Incident</span>
            </button>

            {/* 5. View Trip Details (Light Blue) */}
            <button
              onClick={() => setShowTripDetailsModal(true)}
              className="col-span-2 sm:col-span-1 flex items-center justify-center space-x-2 rounded-2xl bg-[#deebff] hover:bg-[#b3d4ff] py-3.5 px-4 text-sm font-bold text-[#0052cc] shadow-sm active:scale-95 transition-all border border-[#b3d4ff]"
            >
              <FileText className="h-4 w-4 text-[#0052cc] shrink-0" />
              <span>View Trip Details</span>
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────
              E. FOOTER STRIP
          ───────────────────────────────────────────────────────── */}
          <footer className="border-t border-slate-200/80 pt-4 pb-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-2">
            <div>
              <span className="font-bold text-slate-700">NorthLink AI</span> | Connected North
              East, Stronger Tomorrow
            </div>
            <div className="flex items-center space-x-4">
              <span>Drive Safe</span>
              <span>|</span>
              <span>Deliver Hope</span>
              <span>|</span>
              <span>Build a Better North East</span>
            </div>
          </footer>
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────
          F. MODALS & TOAST NOTIFICATIONS
      ───────────────────────────────────────────────────────── */}
      {/* 1. Contact Control Room Modal */}
      {showControlRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📞</span>
                <h3 className="text-base font-bold text-slate-900">NER Disaster Control Room</h3>
              </div>
              <button
                onClick={() => setShowControlRoomModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Direct emergency dispatch frequencies connected to NDMA, State Disaster Management
              Centres, and BRO Project Pushpak.
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { title: 'National Disaster Helpline', number: '1070', note: 'Toll-Free 24x7' },
                {
                  title: 'BRO Pushpak Highway Unit (Sonapur/Silchar)',
                  number: '1800-118-050',
                  note: 'Landslide Clearance',
                },
                { title: 'Assam State Control Room', number: '+91-361-2237011', note: 'Dispatch' },
                {
                  title: 'Mizoram Emergency Ops (Aizawl)',
                  number: '+91-389-2335842',
                  note: 'In-bound Convoy',
                },
              ].map((c) => (
                <a
                  key={c.number}
                  href={`tel:${c.number}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900">{c.title}</div>
                    <div className="text-[11px] text-slate-500">{c.note}</div>
                  </div>
                  <span className="font-mono text-xs font-black text-[#0066ff] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                    {c.number}
                  </span>
                </a>
              ))}
            </div>

            <button
              onClick={() => setShowControlRoomModal(false)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 2. Report Incident Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-base font-bold text-slate-900">Report Road Hazard / Incident</h3>
              </div>
              <button
                onClick={() => setShowIncidentModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReportIncidentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Location on Highway</label>
                <input
                  type="text"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hazard Category</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:border-orange-500"
                >
                  <option value="Landslide">Landslide / Mudflow</option>
                  <option value="Flash Flood">Waterlogged / Flash Flood</option>
                  <option value="Fallen Tree">Fallen Boulder / Tree</option>
                  <option value="Bridge Damage">Bridge Damage / Subsidence</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Clearance Estimate</label>
                <textarea
                  rows={3}
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                  placeholder="e.g., Heavy rocks on right lane, single lane passing only..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="flex-1 rounded-xl bg-slate-100 py-2.5 font-bold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#ff5630] py-2.5 font-bold text-white hover:bg-[#de350b] shadow"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. View Trip Details Modal */}
      {showTripDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📋</span>
                <h3 className="text-base font-bold text-slate-900">Trip & Manifest Details</h3>
              </div>
              <button
                onClick={() => setShowTripDetailsModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Trip ID</span>
                <span className="font-mono font-bold text-slate-900">TRP-2025-0915-01</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Driver</span>
                <span className="font-bold text-slate-900">Dinesh Kumar (+91 94350-12890)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Vehicle Plate</span>
                <span className="font-mono font-bold text-slate-900">AS-01-GC-4481 (Tata Signa)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Origin</span>
                <span className="font-bold text-slate-900">Guwahati Central Depot (Assam)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Destination</span>
                <span className="font-bold text-slate-900">Aizawl Civil Supply Centre (Mizoram)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Cargo Category</span>
                <span className="font-bold text-[#0066ff]">Essential Food Ration & Medical Kits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Authorized By</span>
                <span className="font-bold text-slate-900">NDMA & MDoNER Logistics Wing</span>
              </div>
            </div>

            <button
              onClick={() => setShowTripDetailsModal(false)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 text-xs font-bold animate-fade-in">
          <span>{showSuccessToast}</span>
        </div>
      )}
    </div>
  );
}
