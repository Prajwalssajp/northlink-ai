'use client';

import React, { useState } from 'react';
import { 
  Radio, 
  MessageSquare, 
  Send, 
  X, 
  CheckCircle2, 
  Share2, 
  Satellite, 
  Users,
  Smartphone
} from 'lucide-react';

interface SmsBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
}

export default function SmsBroadcastModal({
  isOpen,
  onClose,
  defaultMessage = '[NORTHLINK ALERT] NH-6 Sonapur blocked by 1200m3 landslide. Essential convoys divert to NH-27 via Lumding-Haflong. ETA +45m. Call 112 for BRO recovery.',
}: SmsBroadcastModalProps) {
  const [message, setMessage] = useState(defaultMessage);
  const [recipients, setRecipients] = useState('ALL_DRIVERS');
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentCount(12);
    }, 800);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Radio className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Low-Bandwidth Satellite SMS & Radio Broadcast</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Transmits emergency 160-char SMS to offline drivers operating in 2G or zero-data cellular dead zones via BSNL Satellite Gateway.
        </p>

        {sentCount !== null && (
          <div className="mt-4 flex items-center space-x-2 rounded-lg border border-emerald-900/60 bg-emerald-950/40 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Successfully transmitted to {sentCount} active mountain drivers via BSNL Satellite Link.</span>
          </div>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Target Recipient Group</label>
            <select
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL_DRIVERS">All Convoy Drivers in Transit (10 Vehicles)</option>
              <option value="COLD_CHAIN">Cold-Chain Medical Vans Only (3 Vehicles)</option>
              <option value="POLICE">District Police & BRO Highway Checkposts</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>SMS Text Message (160 Chars)</span>
              <span className={`font-mono text-[11px] ${message.length > 160 ? 'text-amber-400' : 'text-cyan-400'}`}>
                {message.length} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* SMS Handset Preview */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 mb-1">
              <Smartphone className="h-3.5 w-3.5 text-cyan-400" />
              <span>Recipient Mobile Handset Preview</span>
            </div>
            <div className="rounded-lg bg-cyan-950/40 border border-cyan-800/60 p-2.5 text-xs text-cyan-200 font-mono leading-relaxed">
              {message}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{sending ? 'Broadcasting via Satellite...' : 'Broadcast SMS to Convoy'}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-1.5 rounded-lg border border-emerald-600/60 bg-emerald-950/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 transition-all cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
