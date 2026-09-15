'use client';

import React from 'react';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  Truck, 
  FileText, 
  QrCode, 
  CheckCircle2, 
  Building2,
  Download
} from 'lucide-react';

interface DispatchManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin?: string;
  destination?: string;
  corridorName?: string;
  commodityType?: string;
  riskScore?: number;
}

export default function DispatchManifestModal({
  isOpen,
  onClose,
  origin = 'Guwahati (Kamrup)',
  destination = 'Silchar (Cachar)',
  corridorName = 'Guwahati to Silchar via NH-27 (Nagaon - Lumding - Haflong Bypass)',
  commodityType = 'MEDICINES (Cold-Chain Life Saving)',
  riskScore = 24,
}: DispatchManifestModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const manifestNumber = `NDMA-NER-DISPATCH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl print:border-none print:shadow-none print:p-8 print:max-h-full print:bg-white print:text-black">
        {/* Modal Action Bar (Hidden on Print) */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-400 border border-cyan-800">
              Official Document
            </span>
            <span className="text-xs font-bold text-white">NDMA / BRO Dispatch Clearance</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ══════════════════ OFFICIAL GOVERNMENT CERTIFICATE PRINT BODY ══════════════════ */}
        <div className="space-y-6 rounded-xl border border-slate-800 bg-[#080d1a] p-6 print:border-2 print:border-black print:bg-white print:p-6 print:text-black">
          {/* Official Emblem & Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-cyan-700 pb-4 text-center sm:text-left print:border-black">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-800 text-white shadow print:border print:border-black">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 print:text-black">
                  Government of India · Ministry of Home Affairs
                </div>
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white print:text-black">
                  National Disaster Management Authority (NDMA)
                </h1>
                <div className="text-[10px] font-mono text-slate-400 print:text-black">
                  North Eastern Region Logistics Coordination Grid · Cell 4
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-0 text-right font-mono text-xs">
              <div className="rounded bg-slate-900 px-2 py-1 border border-slate-800 text-cyan-300 font-bold print:border-black print:bg-gray-100 print:text-black">
                {manifestNumber}
              </div>
              <div className="mt-1 text-[10px] text-slate-400 print:text-black">Date: {orderDate}</div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center">
            <h2 className="text-sm font-black uppercase tracking-wider text-cyan-300 print:text-black">
              Emergency Lifeline Convoy Dispatch Manifest & Transit Pass
            </h2>
            <p className="text-[10px] text-slate-400 print:text-black">
              Authorized under Disaster Management Act (2005) for priority movement across Inter-State Mountain Corridors
            </p>
          </div>

          {/* Core Dispatch Parameters Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs print:border-black print:bg-gray-50">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block print:text-gray-700">Origin Hub</span>
              <span className="font-bold text-white print:text-black">{origin}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block print:text-gray-700">Destination Hub</span>
              <span className="font-bold text-white print:text-black">{destination}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block print:text-gray-700">Cargo Priority</span>
              <span className="font-bold text-emerald-400 print:text-black">CRITICAL (Cold-Chain)</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block print:text-gray-700">AI Safety Score</span>
              <span className="font-bold text-cyan-400 print:text-black">{100 - riskScore}/100 (VERIFIED)</span>
            </div>
          </div>

          {/* Authorized Corridor */}
          <div className="rounded-lg border border-cyan-900/60 bg-cyan-950/20 p-3 text-xs print:border-black print:bg-white">
            <span className="font-bold uppercase text-cyan-400 print:text-black text-[10px] block">
              Authorized Movement Corridor
            </span>
            <span className="font-bold text-slate-100 print:text-black text-xs sm:text-sm">
              {corridorName}
            </span>
            <p className="mt-1 text-[10px] text-slate-300 print:text-gray-800">
              *Direct passage via NH-6 Sonapur Tunnel suspended due to active 1,200m³ landslide. Convoy diverted to secondary bypass under NorthLink AI safety mandate.*
            </p>
          </div>

          {/* Cargo Manifest Table */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-black block mb-1.5">
              Certified Cargo Items
            </span>
            <table className="w-full text-left text-xs border border-slate-800 print:border-black">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase text-slate-400 print:border-black print:bg-gray-100 print:text-black">
                <tr>
                  <th className="p-2">Item Description</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Vehicle Reg.</th>
                  <th className="p-2">Storage Temp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-black">
                <tr>
                  <td className="p-2 font-medium text-white print:text-black">Rotavirus & Polio Vaccines (Cold-Chain)</td>
                  <td className="p-2 text-slate-300 print:text-black">12,000 Doses</td>
                  <td className="p-2 font-mono text-cyan-400 print:text-black">AS-01-GC-4182</td>
                  <td className="p-2 text-emerald-400 print:text-black">+2°C to +8°C (Monitored)</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-white print:text-black">Emergency Trauma & IV Fluids</td>
                  <td className="p-2 text-slate-300 print:text-black">450 Cartons</td>
                  <td className="p-2 font-mono text-cyan-400 print:text-black">AS-11-E-9021</td>
                  <td className="p-2 text-slate-300 print:text-black">Ambient Mountain</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-white print:text-black">Water Purification Packets & ORS</td>
                  <td className="p-2 text-slate-300 print:text-black">25,000 Units</td>
                  <td className="p-2 font-mono text-cyan-400 print:text-black">ML-05-D-7714</td>
                  <td className="p-2 text-slate-300 print:text-black">Standard Cargo</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures & Security Seals */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 print:border-black">
            <div className="flex items-center space-x-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 print:border-black print:bg-white print:text-black">
                <QrCode className="h-10 w-10" />
              </div>
              <div className="text-[10px] text-slate-400 print:text-black">
                <div className="font-bold text-white print:text-black">DIGITAL VERIFICATION QR</div>
                <div>Scan at Police Checkpoints</div>
                <div className="font-mono text-cyan-400 print:text-black">VHF Radio: 142.85 MHz</div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-700 pb-1 print:border-black">
                <span className="font-serif italic text-xs text-cyan-300 print:text-black">
                  Dr. Anurag Sharma, Director General
                </span>
              </div>
              <div className="mt-1 text-[9px] font-bold uppercase text-slate-400 print:text-black">
                Authorizing Safety Officer · NDMA Cell
              </div>
              <div className="text-[8px] font-mono text-emerald-400 print:text-black">
                [CRYPTOGRAPHIC SIGNATURE: SHA-256 VERIFIED]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
