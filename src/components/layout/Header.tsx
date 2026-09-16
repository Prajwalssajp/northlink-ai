'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Shield, 
  RefreshCw, 
  Activity, 
  Radio, 
  CheckCircle2, 
  ChevronDown,
  User as UserIcon,
  AlertTriangle,
  LogOut,
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { useDemo } from '@/lib/demo-context';
import { Role } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const { 
    currentUser, 
    isAuthenticated, 
    logout, 
    switchRole, 
    isSimulatingGps, 
    toggleGpsSimulation, 
    triggerRefresh 
  } = useDemo();

  const [time, setTime] = useState<string>('');
  const [alertsCount, setAlertsCount] = useState<number>(3);
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [showAlertMenu, setShowAlertMenu] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    triggerRefresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleLogout = async () => {
    setShowRoleMenu(false);
    await logout();
    router.push('/login');
  };

  const roles: { role: Role; label: string; desc: string }[] = [
    { role: 'ADMIN', label: 'Admin (Director General)', desc: 'Full command and dispatch access' },
    { role: 'LOGISTICS_MANAGER', label: 'Logistics Manager', desc: 'Fleet coordination & routing' },
    { role: 'FIELD_OFFICER', label: 'Field Officer', desc: 'Incident reporting & ground survey' },
    { role: 'DRIVER', label: 'Convoy Driver', desc: 'Active route guidance & SOS' },
    { role: 'VIEWER', label: 'Public Disaster Monitor', desc: 'Read-only safety telemetry' },
  ];

  return (
    <header className="sticky top-0 z-30 flex flex-col w-full border-b border-slate-800 bg-[#080c14]/95 backdrop-blur">
      {/* UX4G Indian National Tricolor Micro-Accent Stripe */}
      <div className="flex h-[3px] w-full">
        <div className="h-full w-1/3 bg-[#FF9933]" title="Tricolor Saffron" />
        <div className="h-full w-1/3 bg-[#FFFFFF]" title="Tricolor White" />
        <div className="h-full w-1/3 bg-[#138808]" title="Tricolor Green" />
      </div>

      <div className="flex h-15 w-full items-center justify-between px-4 sm:px-6">
        {/* Left: Indian Government & MDoNER Agency Identity */}
        <div className="flex items-center space-x-3">
          {/* Government of India Emblem / Ashoka Chakra Seal Representation */}
          <div className="hidden items-center space-x-2 border-r border-slate-800 pr-3 sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/40 bg-amber-950/20 text-amber-400 font-serif font-black text-xs shadow-inner">
              🏛️
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                Govt. of India · भारत सरकार
              </span>
              <span className="text-[9px] font-medium text-slate-400">
                Ministry of Development of North Eastern Region
              </span>
            </div>
          </div>

          {/* Operational Corridor Status */}
          <div className="flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wider text-[11px]">8 NER STATES ACTIVE</span>
          </div>

          {/* DigiLocker-Style Compliance Badge */}
          <div className="hidden items-center space-x-1.5 rounded border border-cyan-800/60 bg-cyan-950/40 px-2 py-0.5 text-[10px] text-cyan-300 md:flex">
            <ShieldCheck className="h-3 w-3 text-cyan-400" />
            <span>NIC · PostGIS Verified</span>
          </div>

          <div className="hidden rounded bg-slate-900/90 border border-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300 lg:block">
            {time || '19:28:00 IST'}
          </div>
        </div>

      {/* Right: Simulation toggle, Role switch, Alerts, Profile */}
      <div className="flex items-center space-x-3">
        {/* GPS Simulation Pill */}
        <button
          onClick={toggleGpsSimulation}
          className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            isSimulatingGps
              ? 'border border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
              : 'border border-slate-700 bg-slate-800/40 text-slate-400'
          }`}
          title="Toggle live simulated vehicle movement"
        >
          <Radio className={`h-3 w-3 ${isSimulatingGps ? 'animate-pulse text-cyan-400' : ''}`} />
          <span className="hidden sm:inline">Simulated Fleet:</span>
          <span className="font-bold">{isSimulatingGps ? 'ACTIVE' : 'PAUSED'}</span>
        </button>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white"
          title="Refresh Data"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {alertsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                {alertsCount}
              </span>
            )}
          </button>

          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-800 bg-slate-900 p-3 shadow-2xl">
              <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-slate-200">Active High-Priority Alerts</span>
                <span className="rounded bg-rose-950 px-1.5 py-0.5 text-[10px] font-bold text-rose-400">
                  {alertsCount} CRITICAL
                </span>
              </div>
              <div className="space-y-2">
                <div className="rounded border border-rose-900/60 bg-rose-950/20 p-2 text-xs">
                  <div className="flex items-center space-x-1 font-semibold text-rose-400">
                    <AlertTriangle className="h-3 w-3" />
                    <span>NH-6 Sonapur Landslide</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-300">Debris 1200m³ blocking route. Convoy diverted to NH-27.</p>
                </div>
                <div className="rounded border border-amber-900/60 bg-amber-950/20 p-2 text-xs">
                  <div className="flex items-center space-x-1 font-semibold text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    <span>NH-10 Teesta River Surge</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-300">29th Mile foundation breach. Alternative via Lava.</p>
                </div>
              </div>
              <Link
                href="/alerts"
                onClick={() => setShowAlertMenu(false)}
                className="mt-2 block text-center text-xs font-medium text-cyan-400 hover:underline"
              >
                View Emergency Center →
              </Link>
            </div>
          )}
        </div>

        {/* Auth / Role Switcher Profile Area */}
        {isAuthenticated && currentUser ? (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs hover:border-slate-700"
              >
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
                <div className="text-left">
                  <span className="block font-semibold text-slate-200">{currentUser.name.split(' ')[0]}</span>
                  <span className="block text-[10px] text-cyan-400">{currentUser.role}</span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
                  {/* Current profile summary */}
                  <div className="border-b border-slate-800 px-3 py-2">
                    <div className="text-xs font-bold text-white">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{currentUser.email}</div>
                    <span className="mt-1 inline-block rounded bg-cyan-950 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400 border border-cyan-800">
                      Role: {currentUser.role}
                    </span>
                  </div>

                  <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Operational Role
                  </div>
                  <div className="space-y-1">
                    {roles.map(r => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setShowRoleMenu(false);
                        }}
                        className={`flex w-full items-start space-x-2 rounded p-2 text-left text-xs transition-colors ${
                          currentUser.role === r.role
                            ? 'bg-cyan-950/60 text-cyan-300'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <CheckCircle2
                          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                            currentUser.role === r.role ? 'text-cyan-400' : 'text-transparent'
                          }`}
                        />
                        <div>
                          <div className="font-semibold">{r.label}</div>
                          <div className="text-[10px] text-slate-400">{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Sign Out option */}
                  <div className="mt-2 border-t border-slate-800 pt-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-2 rounded p-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct quick logout icon button */}
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-400 hover:border-rose-900/60 hover:bg-rose-950/30 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center space-x-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </Link>
        )}
        </div>
      </div>
    </header>
  );
}
