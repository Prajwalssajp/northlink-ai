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
      subtext: 'Cold chain & rations',
      icon: Truck,
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/40 border-cyan-800/40',
      badge: 'Live',
    },
    {
      title: 'Monitored Routes',
      value: summary.monitoredRoutes,
      subtext: '8 NER state corridors',
      icon: Compass,
      color: 'text-blue-400',
      bg: 'bg-blue-950/40 border-blue-800/40',
      badge: 'GIS Sync',
    },
    {
      title: 'At-Risk Routes',
      value: summary.atRiskRoutes,
      subtext: 'Landslide/flood threat',
      icon: AlertOctagon,
      color: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-800/40',
      badge: 'Caution',
    },
    {
      title: 'Active Incidents',
      value: summary.activeIncidents,
      subtext: 'Debris, slips & damage',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-950/40 border-rose-800/40',
      badge: 'BRO Deployed',
    },
    {
      title: 'Vehicles in Transit',
      value: summary.vehiclesInTransit,
      subtext: 'GPS telemetry active',
      icon: Navigation,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/40',
      badge: 'Moving',
    },
    {
      title: 'Critical Alerts',
      value: summary.criticalAlerts,
      subtext: 'Immediate action needed',
      icon: BellRing,
      color: 'text-rose-500',
      bg: 'bg-rose-950/60 border-rose-700/60',
      badge: 'Urgent',
      pulse: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-xl border p-4 transition-all hover:border-slate-700 ${card.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">{card.title}</span>
              <div className="flex items-center space-x-1">
                <Icon className={`h-4 w-4 ${card.color} ${card.pulse ? 'animate-bounce' : ''}`} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black tracking-tight text-white">{card.value}</span>
              <span className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold text-slate-300">
                {card.badge}
              </span>
            </div>

            <p className="mt-1 text-[10px] text-slate-400 truncate">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
