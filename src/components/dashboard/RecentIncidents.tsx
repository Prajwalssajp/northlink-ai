'use client';

import React from 'react';
import { AlertTriangle, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Incident } from '@/lib/types';

interface RecentIncidentsProps {
  incidents: Incident[];
  loading: boolean;
}

export default function RecentIncidents({ incidents, loading }: RecentIncidentsProps) {
  if (loading) {
    return (
      <div className="h-72 animate-pulse rounded-xl border border-slate-800 bg-slate-900/40 p-4" />
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-rose-400" />
          <h3 className="font-semibold text-sm text-white">Live Disruption Feeds</h3>
        </div>
        <Link
          href="/incidents"
          className="flex items-center space-x-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
        >
          <span>All Incidents</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-3 divide-y divide-slate-800/60">
        {incidents.slice(0, 4).map((inc) => {
          const isCritical = inc.severity === 'CRITICAL';
          const timeAgo = Math.round((Date.now() - new Date(inc.reportedAt).getTime()) / 3600000);

          return (
            <div key={inc.id} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                        isCritical
                          ? 'bg-rose-950 text-rose-400 border border-rose-800/50'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                      }`}
                    >
                      {inc.incidentType}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {timeAgo === 0 ? 'Just now' : `${timeAgo}h ago`}
                    </span>
                  </div>
                  <h4 className="mt-1 text-xs font-medium text-slate-200 line-clamp-1">{inc.title}</h4>
                </div>

                <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                  {inc.status}
                </span>
              </div>

              <div className="mt-1 flex items-center space-x-1 text-[11px] text-slate-400">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span className="truncate">{inc.locationName || `${inc.districtName || ''} (${inc.state || 'NER'})`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
