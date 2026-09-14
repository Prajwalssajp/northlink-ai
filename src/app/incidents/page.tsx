'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  Filter, 
  Plus, 
  X, 
  Search, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Incident, IncidentType, Severity, IncidentStatus } from '@/lib/types';
import { useDemo } from '@/lib/demo-context';

export default function IncidentsPage() {
  const { currentUser, refreshTrigger, triggerRefresh } = useDemo();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New incident modal state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newType, setNewType] = useState<IncidentType>('LANDSLIDE');
  const [newSeverity, setNewSeverity] = useState<Severity>('HIGH');
  const [newLat, setNewLat] = useState<string>('25.3500');
  const [newLng, setNewLng] = useState<string>('92.3667');
  const [newLocation, setNewLocation] = useState<string>('East Jaintia Hills, Meghalaya');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/incidents');
      const data = await res.json();
      if (data.success) setIncidents(data.incidents);
    } catch (e) {
      console.error('Error fetching incidents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [refreshTrigger]);

  const handleUpdateStatus = async (id: string, status: IncidentStatus) => {
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        triggerRefresh();
      }
    } catch (e) {
      console.error('Failed to update incident status:', e);
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          incidentType: newType,
          severity: newSeverity,
          latitude: parseFloat(newLat),
          longitude: parseFloat(newLng),
          locationName: newLocation,
          reportedBy: currentUser.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewDescription('');
        triggerRefresh();
      }
    } catch (e) {
      console.error('Failed to submit incident:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredIncidents = incidents.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.locationName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || i.incidentType === filterType;
    const matchesSeverity = filterSeverity === 'ALL' || i.severity === filterSeverity;
    const matchesStatus = filterStatus === 'ALL' || i.status === filterStatus;
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#090d16] p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-rose-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-rose-400 border border-rose-800">
              Hazard Response & Mitigation
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-semibold">Geo-Tagged Spatial Incidents</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">Disaster Incident Operations Center</h1>
          <p className="mt-1 text-xs text-slate-400">
            Field reports, BRO engineering status, and highway clearance tracking across active disaster choke points.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-3 flex items-center space-x-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-950/60 md:mt-0"
        >
          <Plus className="h-4 w-4" />
          <span>Report New Road Incident</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#090d16] p-3 text-xs">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident title, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Incident Types</option>
            <option value="LANDSLIDE">Landslides (⛰️)</option>
            <option value="FLOOD">Floods (🌊)</option>
            <option value="HEAVY_RAINFALL">Heavy Rainfall (🌧️)</option>
            <option value="ROAD_DAMAGE">Road Damage (🚧)</option>
            <option value="BRIDGE_DAMAGE">Bridge Damage (🌉)</option>
            <option value="TRAFFIC">Traffic Choke Points</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="MITIGATED">Mitigated</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIncidents.map((inc) => {
          const isCritical = inc.severity === 'CRITICAL';
          const isResolved = inc.status === 'RESOLVED';

          return (
            <div
              key={inc.id}
              className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                isCritical
                  ? 'border-rose-900/60 bg-rose-950/20 hover:border-rose-700'
                  : 'border-slate-800 bg-[#090d16] hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      isCritical
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {inc.incidentType}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      isResolved
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>

                <h3 className="mt-2.5 text-sm font-bold text-white">{inc.title}</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {inc.description}
                </p>

                <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{inc.locationName || `${inc.latitude.toFixed(3)}, ${inc.longitude.toFixed(3)}`}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>Reported: {new Date(inc.reportedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                <span className="text-[10px] text-slate-500">{inc.reportedBy || 'Govt Field Unit'}</span>
                <div className="flex items-center space-x-1.5">
                  {inc.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(inc.id, 'RESOLVED')}
                      className="rounded bg-emerald-950 px-2 py-1 text-[10px] font-bold text-emerald-400 hover:bg-emerald-900 border border-emerald-800/60"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {inc.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleUpdateStatus(inc.id, 'INVESTIGATING')}
                      className="rounded bg-amber-950 px-2 py-1 text-[10px] font-bold text-amber-400 hover:bg-amber-900 border border-amber-800/60"
                    >
                      Investigate
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Incident Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0c1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Broadcast New Field Incident</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Incident Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Slump and rockfall on NH-6 km 142"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Incident Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as IncidentType)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="LANDSLIDE">LANDSLIDE</option>
                    <option value="FLOOD">FLOOD</option>
                    <option value="HEAVY_RAINFALL">HEAVY RAINFALL</option>
                    <option value="ROAD_DAMAGE">ROAD DAMAGE</option>
                    <option value="BRIDGE_DAMAGE">BRIDGE DAMAGE</option>
                    <option value="TRAFFIC">TRAFFIC BLOCK</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as Severity)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL (Road Blocked)</option>
                    <option value="HIGH">HIGH (Single Lane Restricted)</option>
                    <option value="MEDIUM">MEDIUM (Caution Advisory)</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Location Landmark / District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sonapur Ghat, East Jaintia Hills, Meghalaya"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Field Description & Clearance Estimate</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter details about estimated volume of debris, machinery deployed, and expected clearance timeline..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-1.5 rounded-lg bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-500"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Broadcast Incident</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
