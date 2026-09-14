'use client';

import React from 'react';
import { AlertOctagon, Clock, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Route } from '@/lib/types';

interface AtRiskCorridorsProps {
  routes: any[];
  loading: boolean;
}

export default function AtRiskCorridors({ routes, loading }: AtRiskCorridorsProps) {
  if (loading) {
    return (
      <div className="h-72 animate-pulse rounded-xl border border-slate-800 bg-slate-900/40 p-4" />
    );
  }

  const highRisk = routes.slice(0, 4);

  return (
    <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <AlertOctagon className="h-4 w-4 text-amber-400" />
          <h3 className="font-semibold text-sm text-white">High-Risk Transport Corridors</h3>
        </div>
        <Link
          href="/route-intelligence"
          className="flex items-center space-x-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
        >
          <span>AI Intelligence</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-3 space-y-3">
        {highRisk.map((r) => {
          const score = r.assessment?.riskScore ?? r.riskScore;
          const isCritical = score >= 75;
          const delayMinutes = r.assessment?.predictedDelay ?? 120;
          const delayHours = (delayMinutes / 60).toFixed(1);

          return (
            <div
              key={r.id}
              className={`rounded-lg border p-3 transition-all ${
                isCritical
                  ? 'border-rose-900/60 bg-rose-950/20 hover:border-rose-800'
                  : 'border-amber-900/60 bg-amber-950/20 hover:border-amber-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-slate-200">{r.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {r.origin} ➔ {r.destination} ({r.distance} km)
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-black ${
                      isCritical ? 'bg-rose-900 text-rose-300' : 'bg-amber-900 text-amber-300'
                    }`}
                  >
                    Risk: {score}/100
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[11px]">
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <Clock className="h-3 w-3 text-cyan-400" />
                  <span>Est. Delay: <strong className="text-white">+{delayHours} hrs</strong></span>
                </div>

                <Link
                  href={`/route-intelligence?origin=${encodeURIComponent(r.origin)}&destination=${encodeURIComponent(r.destination)}`}
                  className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-900"
                >
                  Analyze Bypass →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
