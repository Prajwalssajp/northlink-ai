'use client';

import React from 'react';
import { ShieldCheck, Database, Server, Users, Key, Terminal, HardDrive } from 'lucide-react';
import { INITIAL_USERS } from '@/lib/ner-data';
import { useDemo } from '@/lib/demo-context';

export default function AdminPage() {
  const { currentUser, switchRole } = useDemo();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#090d16] p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-800">
              System Administration
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-semibold">Security & PostGIS Infrastructure</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">Platform Control & Diagnostics</h1>
          <p className="mt-1 text-xs text-slate-400">
            RBAC role policies, PostgreSQL + PostGIS schema status, and GIS layer dispatch controls.
          </p>
        </div>
      </div>

      {/* System Architecture Diagnostics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Database Engine</div>
              <div className="text-[11px] text-emerald-400 font-semibold">PostgreSQL 15 + PostGIS 3.3</div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            Full spatial schema enabled with fallback caching for zero-downtime demonstration.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-950 text-cyan-400">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Application Runtime</div>
              <div className="text-[11px] text-cyan-400 font-semibold">Next.js 14 App Router (Node.js)</div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            REST API endpoints with strict TypeScript typing, validation, and JWT authorization.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950 text-blue-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">GIS Cartography</div>
              <div className="text-[11px] text-blue-400 font-semibold">Leaflet + Dark Matter Tiles</div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            Interactive multi-layer geo-spatial visualization for road polylines, landslides, and vehicle GPS.
          </p>
        </div>
      </div>

      {/* User Directory & Role-Based Access */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Registered Personnel & Access Roles</h3>
          </div>
          <span className="text-xs text-slate-400">Click any user to test their permissions</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Preferred Lang</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {INITIAL_USERS.map((u) => {
                const isActive = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-900/50">
                    <td className="py-2.5 font-medium text-white flex items-center space-x-2">
                      <span>{u.name}</span>
                      {isActive && (
                        <span className="rounded bg-cyan-950 px-1 text-[9px] font-bold text-cyan-400 border border-cyan-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 font-mono text-slate-400">{u.email}</td>
                    <td className="py-2.5">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 uppercase text-slate-400">{u.preferredLanguage}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => switchRole(u.role)}
                        className={`rounded px-2.5 py-1 text-xs font-semibold ${
                          isActive
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isActive ? 'Current' : 'Switch To'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
