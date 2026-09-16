'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Compass,
  Truck,
  AlertTriangle,
  Bell,
  ClipboardCheck,
  BarChart3,
  ShieldAlert,
  Settings,
  Mountain,
  LogOut,
  LogIn,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { useDemo } from '@/lib/demo-context';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useDemo();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navSections = [
    {
      title: 'Command & Executive',
      items: [
        { name: 'Overview', href: '/', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Geospatial & AI Intelligence',
      items: [
        { name: 'Live Map & GIS', href: '/live-map', icon: Map, badge: 'Doppler Radar' },
        { name: 'Route Intelligence', href: '/route-intelligence', icon: Compass, badge: 'Real ML' },
        { name: 'Hazard Vision AI', href: '/hazard-scanner', icon: AlertTriangle, badge: 'Vision AI' },
      ],
    },
    {
      title: 'Fleet & Cold-Chain',
      items: [
        { name: 'Logistics Fleet', href: '/logistics', icon: Truck, badge: 'Cold-Chain' },
        { name: 'Incidents Grid', href: '/incidents', icon: AlertTriangle },
      ],
    },
    {
      title: 'Emergency & Field',
      items: [
        { name: 'Alerts Center', href: '/alerts', icon: Bell, badge: 'Satellite' },
        { name: 'Field Reports', href: '/field-reports', icon: ClipboardCheck, badge: 'Offline' },
      ],
    },
    {
      title: 'Analytics & System',
      items: [
        { name: 'Power BI Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Administration', href: '/admin', icon: ShieldAlert },
        { name: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-[#070b13] text-slate-300">
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-slate-800 px-5">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 shadow-lg shadow-cyan-950/60">
            <Mountain className="h-5 w-5 text-white" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#070b13] bg-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-extrabold tracking-wider text-white">NORTHLINK</span>
              <span className="rounded bg-cyan-950 px-1 py-0.2 text-[11px] font-black text-cyan-400 border border-cyan-800">
                AI
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400">Intelligence for Every Route</p>
          </div>
        </Link>
      </div>

      {/* Navigation Groups (Samsara Style) */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 font-semibold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                        item.badge === 'Real ML'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : item.badge === 'Cold-Chain'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : item.badge === 'Doppler Radar'
                          ? 'bg-sky-950 text-sky-300 border border-sky-800'
                          : item.badge === 'Vision AI'
                          ? 'bg-violet-950 text-violet-300 border border-violet-800'
                          : item.badge === 'Offline'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Profile & Auth Actions */}
      <div className="border-t border-slate-800 p-3">
        {isAuthenticated && currentUser ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-300">Active Operator</span>
              <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400 border border-cyan-800/60">
                {currentUser.role}
              </span>
            </div>
            <div className="mt-1 truncate font-medium text-xs text-white">
              {currentUser.name}
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
              <Link
                href="/login"
                className="text-slate-400 hover:text-cyan-300 transition-colors"
              >
                Switch Account
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <LogOut className="h-3 w-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-400">Observer Mode</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
                VIEW ONLY
              </span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              Sign in to enable dispatch, corridor bypass, & telemetry commands.
            </p>
            <Link
              href="/login"
              className="mt-2 flex w-full items-center justify-center space-x-1.5 rounded bg-cyan-600 px-2 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Operator Login</span>
            </Link>
          </div>
        )}
      </div>

      {/* DigiLocker / UX4G Trust & Compliance Stamp */}
      <div className="border-t border-slate-800/90 bg-[#05080e] px-4 py-2.5">
        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <div className="truncate">
            <div className="text-slate-300 font-semibold">NDMA · MDoNER Grid</div>
            <div className="text-[9px] text-slate-400">Digital India · PostGIS Verified</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
