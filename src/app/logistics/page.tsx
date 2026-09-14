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
  ArrowRight
} from 'lucide-react';
import { Shipment, Vehicle, CommodityType, ShipmentStatus } from '@/lib/types';
import { useDemo } from '@/lib/demo-context';

export default function LogisticsTrackingPage() {
  const { isSimulatingGps, toggleGpsSimulation, refreshTrigger } = useDemo();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
            <span className="text-xs text-slate-300 font-semibold">Cold-Chain & Essential Convoys</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">Logistics & GPS Tracking Center</h1>
          <p className="mt-1 text-xs text-slate-400">
            End-to-end telemetry monitoring medicines, emergency rations, and critical relief shipments navigating treacherous mountain passes.
          </p>
        </div>

        {/* Live GPS Simulation Badge */}
        <div className="mt-3 flex items-center space-x-3 md:mt-0">
          <div className="flex items-center space-x-2 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-3 py-1.5 text-xs text-cyan-300">
            <Radio className={`h-3.5 w-3.5 ${isSimulatingGps ? 'animate-pulse text-cyan-400' : 'text-slate-500'}`} />
            <div>
              <span className="font-bold">GPS Simulation Engine: </span>
              <span className="font-semibold text-white">{isSimulatingGps ? 'ACTIVE' : 'PAUSED'}</span>
              <span className="block text-[10px] text-slate-400">Demo Simulation Labeled</span>
            </div>
          </div>

          <button
            onClick={toggleGpsSimulation}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-500"
          >
            {isSimulatingGps ? 'Pause GPS' : 'Resume GPS'}
          </button>
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
                        className="rounded bg-slate-800 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-950 hover:border-cyan-700 border border-slate-700"
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
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Shipment Route Summary */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Origin Warehouse:</span>
                <strong className="text-white">{activeShipment.origin}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination Facility:</span>
                <strong className="text-white">{activeShipment.destination}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Commodity Classification:</span>
                <strong className="text-cyan-400">{activeShipment.commodityType} ({activeShipment.priority})</strong>
              </div>
              {activeShipment.delayMinutes > 0 && (
                <div className="flex justify-between text-rose-400 font-semibold">
                  <span>Terrain Delay Alert:</span>
                  <span>+{Math.round(activeShipment.delayMinutes / 60)} hrs due to Landslide bottleneck</span>
                </div>
              )}
            </div>

            {/* Delivery Timeline Steps */}
            <div className="mt-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Dispatched & Cold-Chain Secured</div>
                  <div className="text-[11px] text-slate-400">{activeShipment.origin}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-slate-950 font-bold text-xs">
                  2
                </div>
                <div>
                  <div className="font-bold text-xs text-cyan-300">En Route via Highland National Highway</div>
                  <div className="text-[11px] text-slate-400">
                    {activeShipment.vehicle ? `Assigned to ${activeShipment.vehicle.vehicleNumber} (Driver: ${activeShipment.vehicle.driverName})` : 'Convoy active'}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  activeShipment.status === 'DELAYED' ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  3
                </div>
                <div>
                  <div className={`font-bold text-xs ${activeShipment.status === 'DELAYED' ? 'text-rose-400' : 'text-slate-300'}`}>
                    Mountain Choke Point / BRO Inspection
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {activeShipment.status === 'DELAYED'
                      ? 'Rerouted through secondary hill bypass due to active slide'
                      : 'Clearance verified'}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  activeShipment.status === 'DELIVERED' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}>
                  4
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-400">Delivery Confirmation at Destination</div>
                  <div className="text-[11px] text-slate-500">{activeShipment.destination}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveShipment(null)}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
