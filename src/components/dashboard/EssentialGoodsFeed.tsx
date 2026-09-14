'use client';

import React from 'react';
import { Package, Truck, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Shipment } from '@/lib/types';

interface EssentialGoodsFeedProps {
  shipments: Shipment[];
  loading: boolean;
}

export default function EssentialGoodsFeed({ shipments, loading }: EssentialGoodsFeedProps) {
  if (loading) {
    return (
      <div className="h-72 animate-pulse rounded-xl border border-slate-800 bg-slate-900/40 p-4" />
    );
  }

  const criticalSupplies = shipments.filter(
    (s) => s.commodityType === 'MEDICINES' || s.commodityType === 'EMERGENCY_SUPPLIES' || s.priority === 'CRITICAL'
  ).slice(0, 4);

  return (
    <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-cyan-400" />
          <h3 className="font-semibold text-sm text-white">Critical Lifeline Movement</h3>
        </div>
        <Link
          href="/logistics"
          className="flex items-center space-x-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
        >
          <span>Fleet Tracking</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-3 space-y-2.5">
        {criticalSupplies.map((s) => {
          const isDelayed = s.status === 'DELAYED';
          return (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5 hover:border-slate-700"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    s.commodityType === 'MEDICINES'
                      ? 'bg-rose-950 text-rose-400'
                      : 'bg-cyan-950 text-cyan-400'
                  }`}
                >
                  <Package className="h-4 w-4" />
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-bold text-white">{s.trackingNumber}</span>
                    <span
                      className={`rounded px-1 text-[9px] font-bold ${
                        s.commodityType === 'MEDICINES'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {s.commodityType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                    {s.origin} ➔ {s.destination}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center space-x-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    isDelayed
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {isDelayed ? <AlertCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                  <span>{s.status}</span>
                </span>
                {isDelayed && (
                  <div className="text-[10px] font-semibold text-rose-400 mt-0.5">
                    +{Math.round(s.delayMinutes / 60)}h delay
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
