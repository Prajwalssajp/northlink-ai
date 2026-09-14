'use client';

import React, { useState } from 'react';
import { Settings, Sliders, Shield, Bell, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { useDemo } from '@/lib/demo-context';

export default function SettingsPage() {
  const { language, setLanguage, isSimulatingGps, toggleGpsSimulation } = useDemo();
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [alertThreshold, setAlertThreshold] = useState<number>(65);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#090d16] p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-800">
              User & Engine Configuration
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">System Settings & Preferences</h1>
          <p className="mt-1 text-xs text-slate-400">
            Customize risk alert thresholds, regional dispatch policies, and demonstration parameters.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center space-x-2 rounded-xl border border-emerald-800 bg-emerald-950/50 p-3 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Risk Threshold Card */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5 text-xs">
          <div className="flex items-center space-x-2 font-bold text-sm text-white mb-3">
            <Sliders className="h-4 w-4 text-cyan-400" />
            <span>AI Risk Scoring Sensitivity</span>
          </div>
          <p className="text-slate-400 mb-4">
            Defines the threshold at which the AI engine automatically triggers mandatory reroute suggestions for essential medicine convoys.
          </p>
          <div className="max-w-md space-y-2">
            <div className="flex justify-between font-semibold text-slate-200">
              <span>Automatic Reroute Trigger Score</span>
              <span className="text-cyan-400 font-bold">{alertThreshold}/100</span>
            </div>
            <input
              type="range"
              min="40"
              max="90"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>More Cautious (40)</span>
              <span>Balanced (65)</span>
              <span>Aggressive Pass (90)</span>
            </div>
          </div>
        </div>

        {/* Telemetry & GPS Card */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5 text-xs">
          <div className="flex items-center space-x-2 font-bold text-sm text-white mb-3">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>Simulation & Telemetry Preferences</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
            <div>
              <div className="font-semibold text-slate-200">Simulate Live Vehicle Movement</div>
              <div className="text-[11px] text-slate-400">Regularly updates GPS telemetry coordinates for demonstration</div>
            </div>
            <input
              type="checkbox"
              checked={isSimulatingGps}
              onChange={toggleGpsSimulation}
              className="h-4 w-4 accent-cyan-400"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
