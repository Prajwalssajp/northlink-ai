'use client';

import React from 'react';
import { 
  Truck, 
  Compass, 
  AlertOctagon, 
  AlertTriangle, 
  Navigation, 
  BellRing,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { DashboardSummary } from '@/lib/types';

interface KpiCardsProps {
  summary: DashboardSummary | null;
  loading: boolean;
}

export default function KpiCards({ summary, loading }: KpiCardsProps) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-slate-800 bg-slate-900/50 p-4"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Active Shipments',
      value: summary.activeShipments,
      subtext: 'Cold-chain & medical rations',
      icon: Truck,
      color: 'text-cyan-400',
      accentColor: 'bg-cyan-500',
      bg: 'bg-[#0a0f1d] border-cyan-900/40 hover:border-cyan-700/60',
      badge: 'Live Fleet',
      badgeClass: 'bg-cyan-950 text-cyan-300 border border-cyan-800',
    },
    {
      title: 'Monitored Corridors',
      value: summary.monitoredRoutes,
      subtext: '8 NER state transit links',
      icon: Compass,
      color: 'text-blue-400',
      accentColor: 'bg-blue-500',
      bg: 'bg-[#0a0f1d] border-blue-900/40 hover:border-blue-700/60',
      badge: 'PostGIS',
      badgeClass: 'bg-blue-950 text-blue-300 border border-blue-800',
    },
    {
      title: 'At-Risk Corridors',
      value: summary.atRiskRoutes,
      subtext: 'Monsoon landslide threat',
      icon: AlertOctagon,
      color: 'text-amber-400',
      accentColor: 'bg-amber-500',
      bg: 'bg-[#0a0f1d] border-amber-900/40 hover:border-amber-700/60',
      badge: 'High Hazard',
      badgeClass: 'bg-amber-950 text-amber-300 border border-amber-800',
    },
    {
      title: 'Active Incidents',
      value: summary.activeIncidents,
      subtext: 'Debris slips & river surge',
      icon: AlertTriangle,
      color: 'text-rose-400',
      accentColor: 'bg-rose-500',
      bg: 'bg-[#0a0f1d] border-rose-900/40 hover:border-rose-700/60',
      badge: 'BRO Alert',
      badgeClass: 'bg-rose-950 text-rose-300 border border-rose-800',
    },
    {
      title: 'Vehicles in Transit',
      value: summary.vehiclesInTransit,
      subtext: 'GPS telemetry linked',
      icon: Navigation,
      color: 'text-emerald-400',
      accentColor: 'bg-emerald-500',
      bg: 'bg-[#0a0f1d] border-emerald-900/40 hover:border-emerald-700/60',
      badge: 'Moving',
      badgeClass: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
    },
    {
      title: 'Critical Alerts',
      value: summary.criticalAlerts,
      subtext: 'Immediate dispatch required',
      icon: BellRing,
      color: 'text-rose-500',
      accentColor: 'bg-rose-600',
      bg: 'bg-[#0a0f1d] border-rose-800/60 hover:border-rose-600',
      badge: 'Action Reqd',
      badgeClass: 'bg-rose-950 text-rose-200 border border-rose-700 animate-pulse',
      pulse: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`group relative overflow-hidden rounded-xl border p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${card.bg}`}
          >
            {/* Power BI-style top colored accent line */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${card.accentColor}`} />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 tracking-wide uppercase">{card.title}</span>
              <Icon className={`h-4 w-4 ${card.color} ${card.pulse ? 'animate-bounce' : ''}`} />
            </div>

            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-3xl font-black tracking-tight text-white">{card.value}</span>
              <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>

            <p className="mt-1.5 text-[11px] text-slate-400 font-medium truncate">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
