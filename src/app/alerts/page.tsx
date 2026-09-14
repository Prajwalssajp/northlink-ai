'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Globe, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldAlert,
  Volume2
} from 'lucide-react';
import { Alert, Severity } from '@/lib/types';
import { useDemo } from '@/lib/demo-context';

export default function AlertsCenterPage() {
  const { language, setLanguage, refreshTrigger, triggerRefresh } = useDemo();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (data.success) setAlerts(data.alerts);
    } catch (e) {
      console.error('Failed to load alerts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [refreshTrigger]);

  const handleResolveAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts/${id}/resolve`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) triggerRefresh();
    } catch (e) {
      console.error('Failed to resolve alert:', e);
    }
  };

  const languages = [
    { code: 'en', label: 'English (EN)' },
    { code: 'as', label: 'অসমীয়া (Assamese)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'mni', label: 'মৈতৈলোন্ (Manipuri)' },
  ];

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'ALL' || a.severity === filterSeverity
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#090d16] p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-rose-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-rose-400 border border-rose-800">
              Disaster Early Warning Broadcast
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-semibold">Multilingual Regional Notifications</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">Emergency Alerts & Public Advisories</h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time hazard alerts broadcast to district emergency response cells, state logistics wings, and civilian transport associations.
          </p>
        </div>

        {/* Language Switcher Bar */}
        <div className="mt-3 flex items-center space-x-2 md:mt-0">
          <Globe className="h-4 w-4 text-cyan-400" />
          <div className="flex flex-wrap gap-1">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                  language === l.code
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#090d16] p-3 text-xs">
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Broadcast Severity Filter</span>
        </div>

        <div className="flex items-center space-x-2">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`rounded px-2.5 py-1 font-semibold transition-all ${
                filterSeverity === sev
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isResolved = alert.status === 'RESOLVED';

          // Retrieve translation if available for current language
          let displayTitle = alert.title;
          let displayMessage = alert.message;
          if (language !== 'en' && alert.translations && alert.translations[language]) {
            displayTitle = alert.translations[language].title || alert.title;
            displayMessage = alert.translations[language].message || alert.message;
          }

          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-5 transition-all ${
                isCritical
                  ? 'border-rose-900/70 bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-[#090d16]'
                  : 'border-slate-800 bg-[#090d16]'
              }`}
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-black ${
                        isCritical
                          ? 'bg-rose-900 text-white'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {alert.severity} SEVERITY
                    </span>
                    <span className="text-xs text-slate-400">|</span>
                    <div className="flex items-center space-x-1 text-xs text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{alert.affectedRegion}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white">{displayTitle}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {displayMessage}
                  </p>
                </div>

                <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>

                  {!isResolved ? (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-700 border border-slate-700"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <span className="flex items-center space-x-1 rounded bg-emerald-950 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>RESOLVED</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
