'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Activity, 
  Download, 
  RefreshCw,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { useDemo } from '@/lib/demo-context';

export default function AnalyticsPage() {
  const { refreshTrigger } = useDemo();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/analytics/overview');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [refreshTrigger]);

  const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#090d16] p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-800">
              Regional Telemetry Analytics
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-semibold">PostgreSQL Aggregations</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">Logistics & Vulnerability Analytics</h1>
          <p className="mt-1 text-xs text-slate-400">
            Statistical breakdown of mountain highway bottlenecks, delay distributions by essential commodity, and state-level incident density.
          </p>
        </div>

        <div className="mt-3 flex items-center space-x-2 text-xs md:mt-0">
          <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 font-semibold text-slate-300">
            Seeded Live Benchmark
          </div>
        </div>
      </div>

      {loading || !data ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl border border-slate-800 bg-slate-900/40 p-4" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Incidents by Type */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5">
            <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-white">Active Hazard Incidents by Type</span>
              <span className="text-[10px] font-semibold text-cyan-400">Total: {data.totalIncidents}</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.incidentsByType} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-20} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                    {data.incidentsByType.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Delay by Commodity */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5">
            <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-white">Average Terrain Delay by Commodity (Hours)</span>
              <span className="text-[10px] font-semibold text-amber-400">Bottleneck Impact</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.delayByCommodity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="commodity" stroke="#64748b" fontSize={10} interval={0} angle={-20} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="avgDelayHours" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Incident Density by State */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5">
            <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-white">Hazard Distribution Across NER States</span>
              <span className="text-[10px] font-semibold text-rose-400">Geographic Density</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.incidentsByState} layout="vertical" margin={{ top: 10, right: 20, left: 35, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748b" fontSize={10} />
                  <YAxis dataKey="state" type="category" stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Shipment Status Distribution */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5">
            <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-white">Active Fleet Supply Status Breakdown</span>
              <span className="text-[10px] font-semibold text-emerald-400">Total: {data.totalShipments}</span>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.shipmentsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {data.shipmentsByStatus.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
