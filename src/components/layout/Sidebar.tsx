'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Map as MapIcon,
  Truck,
  Box,
  AlertTriangle,
  TrendingUp,
  GitFork,
  CloudSun,
  FileBarChart,
  Users,
  Settings,
  Headphones,
  LogOut,
  Navigation
} from 'lucide-react';
import { useDemo } from '@/lib/demo-context';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useDemo();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Live Map', href: '/live-map', icon: MapIcon },
    { name: 'Vehicles', href: '/logistics', icon: Truck },
    { name: 'Shipments', href: '/logistics', icon: Box },
    { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
    { name: 'Risk Prediction', href: '/route-intelligence', icon: TrendingUp },
    { name: 'Route Optimization', href: '/route-intelligence', icon: GitFork },
    { name: 'Weather', href: '/alerts', icon: CloudSun },
    { name: 'Reports', href: '/field-reports', icon: FileBarChart },
    { name: 'Users', href: '/admin', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between bg-[#0b192e] text-slate-300 shrink-0 border-r border-[#152a4a]">
      <div>
        {/* Brand Header */}
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

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 rounded-xl px-4 py-2.5 transition-all ${
                  isActive
                    ? 'bg-[#0066ff] text-white font-bold shadow-md shadow-blue-900/40'
                    : 'text-slate-300 hover:bg-[#132742] hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Direct Driver Mode Link */}
          <Link
            href="/driver"
            className="flex items-center space-x-3 rounded-xl px-4 py-2.5 text-amber-300 hover:bg-amber-950/40 hover:text-amber-200 transition-colors border border-amber-500/20 mt-2"
          >
            <Navigation className="h-5 w-5 text-amber-400" />
            <span className="font-bold">Driver Mode</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="p-3 border-t border-[#162d4e]/70 space-y-1 text-sm font-medium">
        <Link
          href="/alerts"
          className="flex w-full items-center space-x-3 rounded-xl px-4 py-2.5 text-slate-300 hover:bg-[#132742] hover:text-white transition-colors"
        >
          <Headphones className="h-5 w-5 text-slate-400" />
          <span>Help & Support</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-xl px-4 py-2.5 text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 transition-colors text-left"
        >
          <LogOut className="h-5 w-5 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
