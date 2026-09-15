'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  Radio, 
  X,
  Navigation,
  Sparkles,
  ArrowRight,
  Thermometer,
  Battery,
  AlertTriangle,
  Volume2,
  FileText,
  Send,
  Zap,
  Activity
} from 'lucide-react';
import { Shipment, Vehicle, CommodityType, ShipmentStatus } from '@/lib/types';
import { useDemo } from '@/lib/demo-context';
import { INITIAL_COLD_CHAIN_TELEMETRY, calculateColdChainSpoilage } from '@/lib/cold-chain-data';
import { speakTacticalAlert } from '@/lib/voice-assistant';
import DispatchManifestModal from '@/components/dispatch/DispatchManifestModal';
import SmsBroadcastModal from '@/components/alerts/SmsBroadcastModal';

export default function LogisticsTrackingPage() {
  const { isSimulatingGps, toggleGpsSimulation, refreshTrigger } = useDemo();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // New Modals
  const [showManifestModal, setShowManifestModal] = useState<boolean>(false);
  const [showSmsModal, setShowSmsModal] = useState<boolean>(false);

  // Cold Chain Live Telemetry State
  const [coldChainData, setColdChainData] = useState(INITIAL_COLD_CHAIN_TELEMETRY);

  const fetchLogistics = async () => {
    try {
      setLoading(true);
      const [shipRes, vehRes] = await Promise.all([
        fetch('/api/shipments').then(r => r.json()),
        fetch('/api/vehicles').then(r => r.json()),
      ]);
      if (shipRes.success) setShipments(shipRes.shipments);
      if (vehRes.success) setVehicles(vehRes.vehicles);
    } catch (e) {
      console.error('Failed to load logistics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogistics();
  }, [refreshTrigger]);

  const handleVoiceReadout = (item: typeof INITIAL_COLD_CHAIN_TELEMETRY[0]) => {
    const alertSpeech = `Cold-Chain Telemetry Alert for vehicle ${item.vehicleId}. Cargo: ${item.cargoDescription}. Container temperature is currently ${item.currentTempC} degrees Celsius. Target range is 2 to 8 degrees. Battery reserve remaining: ${item.batteryReserveHours} hours. Spoilage risk countdown is ${item.spoilageRiskHours} hours. Compressor is ${item.compressorStatus}.`;
    speakTacticalAlert(alertSpeech, 'en');
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCommodity = selectedCommodity === 'ALL' || s.commodityType === selectedCommodity;
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchesSearch && matchesCommodity && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#090d16] p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-800">
              Fleet & Supply Telemetry
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-semibold">Cold-Chain IoT & Emergency Convoys</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">Logistics & GPS Tracking Center</h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time telemetry monitoring vaccines, medical oxygen, and essential supplies traversing landslide-prone mountain corridors.
          </p>
        </div>

        {/* Action Buttons: Manifest, SMS broadcast, GPS simulation */}
        <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-0">
          <button
            onClick={() => setShowManifestModal(true)}
            className="flex items-center space-x-1.5 rounded-lg border border-cyan-800/80 bg-cyan-950/40 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 transition-all shadow-sm cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-cyan-400" />
            <span>NDMA Manifest PDF</span>
          </button>

          <button
            onClick={() => setShowSmsModal(true)}
            className="flex items-center space-x-1.5 rounded-lg border border-amber-800/80 bg-amber-950/40 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all shadow-sm cursor-pointer"
          >
            <Send className="h-3.5 w-3.5 text-amber-400" />
            <span>Satellite SMS Broadcast</span>
          </button>

          <button
            onClick={toggleGpsSimulation}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isSimulatingGps
                ? 'border border-cyan-500/50 bg-cyan-950/50 text-cyan-300 ring-1 ring-cyan-500'
                : 'border border-slate-700 bg-slate-900 text-slate-400'
            }`}
          >
            <Radio className={`h-3 w-3 ${isSimulatingGps ? 'animate-pulse text-cyan-400' : ''}`} />
            <span>Fleet GPS: {isSimulatingGps ? 'ACTIVE' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* ══════════════════ COLD-CHAIN IOT TELEMETRY & SPOILAGE MONITOR ══════════════════ */}
      <div className="rounded-xl border border-cyan-900/50 bg-[#070e1a] p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-900/40 pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Cold-Chain IoT Sensor Telemetry & Vaccine Spoilage Countdown
            </h3>
            <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-400 border border-cyan-800">
              Live BLE Sensor Grid
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Target: +2.0°C to +8.0°C</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {coldChainData.map((cc) => {
            const isCritical = cc.spoilageStatus === 'CRITICAL_SPOILAGE';
            const isWarning = cc.spoilageStatus === 'WARNING';
            const statusColor = isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400';
            const borderColor = isCritical ? 'border-rose-900/60 bg-rose-950/15' : isWarning ? 'border-amber-900/60 bg-amber-950/15' : 'border-slate-800 bg-slate-900/50';

            return (
              <div key={cc.vehicleId} className={`rounded-xl border p-4 space-y-3 ${borderColor}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-cyan-400">{cc.vehicleId.toUpperCase()}</span>
                    <h4 className="text-xs font-bold text-white leading-snug">{cc.cargoDescription}</h4>
                  </div>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${
                    isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800' : isWarning ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {cc.spoilageStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Primary Temp Display */}
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-950/60 p-2 text-center text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Container</span>
                    <span className={`text-base font-black font-mono ${statusColor}`}>{cc.currentTempC}°C</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Ambient</span>
                    <span className="text-base font-black font-mono text-slate-300">{cc.ambientTempC}°C</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Battery</span>
                    <span className="text-base font-black font-mono text-cyan-400">{cc.batteryReserveHours} hrs</span>
                  </div>
                </div>

                {/* Spoilage Countdown */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <span>Spoilage Threshold in:</span>
                  </div>
                  <span className={`font-mono font-black ${isCritical ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                    ~{cc.spoilageRiskHours} hours
                  </span>
                </div>

                {/* Action button: Voice broadcast */}
                <button
                  onClick={() => handleVoiceReadout(cc)}
                  className="w-full flex items-center justify-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-900/80 py-1.5 text-xs font-semibold text-slate-300 hover:border-cyan-500 hover:text-white transition-all cursor-pointer"
                >
                  <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Voice Telemetry Readout</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#090d16] p-3 text-xs">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tracking #, origin, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Commodities</option>
            <option value="MEDICINES">Medicines (Cold Chain)</option>
            <option value="EMERGENCY_SUPPLIES">Emergency Supplies</option>
            <option value="FOOD">Food Grains</option>
            <option value="AGRICULTURAL_PRODUCE">Agricultural Produce</option>
            <option value="CONSTRUCTION_MATERIALS">Construction Materials</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELAYED">Delayed</option>
            <option value="DELIVERED">Delivered</option>
            <option value="PLANNED">Planned</option>
          </select>
        </div>
      </div>

      {/* Shipments List Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#090d16]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 font-semibold text-slate-400">
              <tr>
                <th className="p-3">Tracking #</th>
                <th className="p-3">Commodity & Priority</th>
                <th className="p-3">Corridor Routing</th>
                <th className="p-3">Assigned Vehicle</th>
                <th className="p-3">Status & Delay</th>
                <th className="p-3">ETA</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredShipments.map((s) => {
                const isDelayed = s.status === 'DELAYED';
                const isMedicine = s.commodityType === 'MEDICINES';

                return (
                  <tr key={s.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-cyan-400">{s.trackingNumber}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            isMedicine
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}
                        >
                          {s.commodityType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{s.priority}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div className="font-medium truncate max-w-[220px]">
                        {s.origin} ➔ {s.destination}
                      </div>
                    </td>
                    <td className="p-3">
                      {s.vehicle ? (
                        <div>
                          <div className="font-mono font-semibold text-white">{s.vehicle.vehicleNumber}</div>
                          <div className="text-[10px] text-slate-400">{s.vehicle.driverName}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            isDelayed
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : s.status === 'DELIVERED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                          }`}
                        >
                          {s.status}
                        </span>
                        {isDelayed && (
                          <span className="font-bold text-rose-400 text-[11px]">
                            +{Math.round(s.delayMinutes / 60)}h
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">
                      {new Date(s.expectedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveShipment(s)}
                        className="rounded bg-slate-800 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-950 hover:border-cyan-700 border border-slate-700 cursor-pointer"
                      >
                        Inspect Timeline
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Progress Modal / Detail Timeline */}
      {activeShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-[#0c1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {activeShipment.trackingNumber}
                </span>
                <h3 className="text-base font-bold text-white">Delivery Lifecycle & Mountain Milestones</h3>
              </div>
              <button
                onClick={() => setActiveShipment(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-900/60 p-3 text-xs">
                <div>
                  <span className="text-slate-400">Corridor Route</span>
                  <div className="font-semibold text-white">{activeShipment.origin} ➔ {activeShipment.destination}</div>
                </div>
                <div>
                  <span className="text-slate-400">Commodity Classification</span>
                  <div className="font-semibold text-white">{activeShipment.commodityType} ({activeShipment.priority})</div>
                </div>
              </div>

              {/* Waypoints Timeline */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Origin Terminal Dispatch Check</div>
                    <div className="text-[11px] text-slate-400">Cargo inspected & cold-chain calibrated at Guwahati Central Depot</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700">
                    <Navigation className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Mountain Mid-Corridor Transit</div>
                    <div className="text-[11px] text-slate-400">Approaching Barail Ridge pass · IoT telemetry nominal</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400">Destination Hospital Receipt</div>
                    <div className="text-[11px] text-slate-500">Scheduled arrival at Silchar Civil Hospital Emergency Wing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official NDMA / BRO Dispatch Manifest Modal */}
      <DispatchManifestModal
        isOpen={showManifestModal}
        onClose={() => setShowManifestModal(false)}
      />

      {/* Satellite SMS Broadcast Modal */}
      <SmsBroadcastModal
        isOpen={showSmsModal}
        onClose={() => setShowSmsModal(false)}
      />
    </div>
  );
}
