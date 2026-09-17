'use client';

import React, { useState } from 'react';
import { Menu, Search, Globe, Bell, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/lib/demo-context';

export default function Header() {
  const router = useRouter();
  const { currentUser, logout } = useDemo();
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/live-map?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-5 flex items-center justify-between shadow-sm shrink-0">
      {/* Left: Hamburger & Search Box */}
      <div className="flex items-center space-x-4 flex-1 max-w-2xl">
        <button className="text-slate-600 hover:text-slate-900 p-1 lg:hidden">
          <Menu className="h-6 w-6" />
        </button>

        <form onSubmit={handleSearch} className="relative w-full">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search locations, vehicles, shipments, incidents..."
              className="w-full rounded-full bg-[#f1f5f9] border border-transparent pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 transition-all shadow-inner"
            />
          </div>
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4 ml-4">
        {/* Language dropdown: English */}
        <div className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 cursor-pointer shadow-sm">
          <Globe className="h-4 w-4 text-slate-500" />
          <span>English</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>

        {/* Bell Notification Icon with Badge 3 */}
        <Link
          href="/alerts"
          className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </Link>

        {/* Profile: RA | Raghavendra | Field Officer */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 border-l border-slate-200 pl-4 hover:opacity-90 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b192e] text-white font-bold text-xs shadow-inner">
              RA
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Raghavendra
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Field Officer
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900">Raghavendra</div>
                <div className="text-[10px] text-slate-500">raghavendra@northlink.gov.in</div>
              </div>
              <div className="py-1">
                <Link
                  href="/driver"
                  className="flex items-center px-3 py-2 text-amber-700 hover:bg-amber-50 rounded-lg font-bold"
                >
                  🚛 Switch to Driver Mode
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                >
                  Administration
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                >
                  Settings
                </Link>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={async () => {
                    await logout();
                    router.push('/login');
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-bold"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
