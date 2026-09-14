'use client';

import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  MapPin, 
  Camera, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Send,
  Save,
  Shield,
  Loader2
} from 'lucide-react';
import { FieldReport, IncidentType, Severity } from '@/lib/types';
import { useDemo } from '@/lib/demo-context';

export default function FieldReportsPage() {
  const { currentUser, refreshTrigger, triggerRefresh } = useDemo();
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Form fields
  const [incidentType, setIncidentType] = useState<IncidentType>('LANDSLIDE');
  const [severity, setSeverity] = useState<Severity>('HIGH');
  const [locationName, setLocationName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('25.3500');
  const [longitude, setLongitude] = useState<string>('92.3667');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Check online status and load offline drafts
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load from LocalStorage
    try {
      const cached = localStorage.getItem('northlink_offline_reports');
      if (cached) {
        setOfflineQueue(JSON.parse(cached));
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/field-reports');
      const data = await res.json();
      if (data.success) setReports(data.reports);
    } catch (e) {
      console.error('Failed to fetch field reports:', e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [refreshTrigger]);

  // Geolocation fetcher
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(4));
          setLongitude(pos.coords.longitude.toFixed(4));
          setLocationName('Auto-detected GPS Location');
        },
        (err) => {
          // Fallback to sample hill coordinates
          setLatitude('25.4600');
          setLongitude('92.1500');
          setLocationName('Jowai Ghat (Simulated GPS)');
        }
      );
    }
  };

  // Image file handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit online or queue offline
  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setSubmitting(true);

    const reportPayload = {
      reporterName: currentUser?.name || 'Field Officer',
      incidentType,
      severity,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      locationName: locationName || 'NER Highway Sector',
      imageAttachment: imagePreview,
      syncStatus: isOnline && !isDraft ? 'SYNCED' : 'PENDING_SYNC',
      createdAt: new Date().toISOString(),
    };

    if (!isOnline || isDraft) {
      // Save locally
      const updatedQueue = [reportPayload, ...offlineQueue];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('northlink_offline_reports', JSON.stringify(updatedQueue));
      setSyncMessage('Draft saved locally in offline browser cache. Will sync upon reconnection.');
      setSubmitting(false);
      resetForm();
      return;
    }

    try {
      const res = await fetch('/api/field-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload),
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage('Report transmitted and auto-promoted to Regional Incident Feed!');
        resetForm();
        fetchReports();
        triggerRefresh();
      }
    } catch (err) {
      // Fallback to queue if network error occurs
      const updatedQueue = [reportPayload, ...offlineQueue];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('northlink_offline_reports', JSON.stringify(updatedQueue));
      setSyncMessage('Network disconnected. Saved to offline queue.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sync offline queue
  const handleSyncAll = async () => {
    if (offlineQueue.length === 0) return;
    setSubmitting(true);
    try {
      for (const item of offlineQueue) {
        await fetch('/api/field-reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      setOfflineQueue([]);
      localStorage.removeItem('northlink_offline_reports');
      setSyncMessage(`Successfully synchronized ${offlineQueue.length} offline field reports!`);
      fetchReports();
      triggerRefresh();
    } catch (e) {
      setSyncMessage('Sync failed. Check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setLocationName('');
    setImagePreview(null);
    setTimeout(() => setSyncMessage(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#090d16] p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-emerald-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-800">
              Offline-First Capability
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-semibold">Low-Network Valley Protocol</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">Field Officer Incident Submission</h1>
          <p className="mt-1 text-xs text-slate-400">
            Enables ground surveyors, SDRF officers, and highway patrols to record landslides and flash flood damages even in zero-reception mountain shadows.
          </p>
        </div>

        {/* Network Connectivity Indicator */}
        <div className="mt-3 flex items-center space-x-2 md:mt-0">
          <div
            className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
              isOnline
                ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                : 'border-rose-500/40 bg-rose-950/30 text-rose-300'
            }`}
          >
            {isOnline ? <Wifi className="h-4 w-4 text-emerald-400" /> : <WifiOff className="h-4 w-4 text-rose-400" />}
            <span>Network: {isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
          </div>

          {offlineQueue.length > 0 && (
            <button
              onClick={handleSyncAll}
              disabled={submitting}
              className="flex items-center space-x-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-500"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${submitting ? 'animate-spin' : ''}`} />
              <span>Sync {offlineQueue.length} Drafts</span>
            </button>
          )}
        </div>
      </div>

      {syncMessage && (
        <div className="flex items-center space-x-2 rounded-xl border border-cyan-800 bg-cyan-950/50 p-3 text-xs text-cyan-200">
          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Main Grid: Submission Form + Offline Queue & History */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Record New Field Survey Report</h3>

          <form className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-medium">Disaster / Incident Type</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="LANDSLIDE">LANDSLIDE (Debris/Slump)</option>
                  <option value="FLOOD">FLOOD (River Overtopping)</option>
                  <option value="HEAVY_RAINFALL">HEAVY RAINFALL (Low Visibility)</option>
                  <option value="ROAD_DAMAGE">ROAD DAMAGE (Sinkhole/Crack)</option>
                  <option value="BRIDGE_DAMAGE">BRIDGE DAMAGE (Piers/Bearings)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Observed Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as Severity)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="CRITICAL">CRITICAL (Corridor Cut Off)</option>
                  <option value="HIGH">HIGH (Single Lane Choke)</option>
                  <option value="MEDIUM">MEDIUM (Caution / Slippery)</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-medium">Location Landmark / Milestone</label>
              <input
                type="text"
                placeholder="e.g., NH-6 KM 142 near Sonapur Bridge, East Jaintia Hills"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* GPS Coordinates & Auto-detect */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">GPS Coordinates</label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="flex items-center space-x-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                >
                  <MapPin className="h-3 w-3" />
                  <span>Fetch Device Coordinates</span>
                </button>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-slate-300 font-medium">Ground Conditions Description</label>
              <textarea
                rows={3}
                placeholder="Describe slope movement, water depth, stranded truck count, and local bypass suitability..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Photo Attachment (Simulated / Local upload) */}
            <div>
              <label className="text-slate-300 font-medium block">Site Photographic Evidence</label>
              <div className="mt-1 flex items-center space-x-3">
                <label className="flex cursor-pointer items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300 hover:border-cyan-500 hover:text-white">
                  <Camera className="h-4 w-4 text-cyan-400" />
                  <span>{imagePreview ? 'Change Photo' : 'Attach Field Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imagePreview && (
                  <span className="text-[11px] text-emerald-400 font-medium">Photo Attached (Buffered)</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-slate-300 hover:bg-slate-700"
              >
                <Save className="h-4 w-4 text-slate-400" />
                <span>Save Offline Draft</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={submitting}
                className="flex items-center space-x-1.5 rounded-lg bg-cyan-500 px-4 py-2 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Submit & Transmit</span>
              </button>
            </div>
          </form>
        </div>

        {/* Offline Drafts & Recent Field Reports */}
        <div className="space-y-6">
          {/* Offline Pending Queue */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">
                  Pending Offline Queue ({offlineQueue.length})
                </h3>
              </div>
              {offlineQueue.length > 0 && (
                <button
                  onClick={handleSyncAll}
                  className="rounded bg-cyan-950 px-2 py-0.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900 border border-cyan-800"
                >
                  Sync Now
                </button>
              )}
            </div>

            <div className="mt-3 space-y-2">
              {offlineQueue.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No unsynced drafts. All field reports are synchronized with the central database.
                </div>
              ) : (
                offlineQueue.map((draft, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{draft.incidentType}</span>
                      <span className="rounded bg-amber-950 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                        PENDING SYNC
                      </span>
                    </div>
                    <p className="mt-1 text-slate-300">{draft.locationName}</p>
                    <div className="mt-1 text-[10px] text-slate-500">
                      Saved: {new Date(draft.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Synchronized Field History */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5">
            <h3 className="font-bold text-sm text-white border-b border-slate-800/80 pb-3">
              Verified Synced Field Reports
            </h3>

            <div className="mt-3 space-y-2.5 divide-y divide-slate-800/60">
              {reports.map((r) => (
                <div key={r.id} className="pt-2.5 first:pt-0 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{r.incidentType}</span>
                    <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-800">
                      SYNCED
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1">{r.description}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                    <span>By: {r.reporterName}</span>
                    <span>{new Date(r.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
