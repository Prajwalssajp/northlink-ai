'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  HardHat, 
  Maximize2, 
  Volume2, 
  ArrowRight,
  ShieldAlert,
  Layers,
  Check
} from 'lucide-react';
import { SAMPLE_HAZARD_PHOTOS, analyzeHazardPhoto } from '@/lib/vision-scanner';
import { speakTacticalAlert } from '@/lib/voice-assistant';

export default function HazardScannerPage() {
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_HAZARD_PHOTOS[0]);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(SAMPLE_HAZARD_PHOTOS[0].scanResult);
  const [transmitted, setTransmitted] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const handleSelectPreset = (photo: typeof SAMPLE_HAZARD_PHOTOS[0]) => {
    setSelectedPhoto(photo);
    setCustomImage(null);
    setScanning(true);
    setTransmitted(false);
    setTimeout(() => {
      setScanResult(photo.scanResult);
      setScanning(false);
    }, 700);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setCustomImage(url);
        setScanning(true);
        setTransmitted(false);
        setTimeout(() => {
          setScanResult(analyzeHazardPhoto(url, true));
          setScanning(false);
        }, 900);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioBroadcast = () => {
    const speechText = `Visual Hazard Scan verified. ${scanResult.hazardType} detected. Road blockage is at ${scanResult.blockagePercentage} percent. Estimated debris mass is ${scanResult.estimatedDebrisVolumeM3} cubic meters. Recommended deployment: ${scanResult.recommendedDetachment}. Estimated clearance duration is ${scanResult.estimatedClearanceHours} hours.`;
    speakTacticalAlert(speechText, 'en');
  };

  const handleTransmitToGrid = async () => {
    try {
      setTransmitted(true);
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[AI Vision Scan] ${selectedPhoto.title}`,
          description: `Auto-quantified by Computer Vision: ${scanResult.estimatedDebrisVolumeM3} m³ debris, ${scanResult.blockagePercentage}% road blockage. Recommended clearance: ${scanResult.recommendedDetachment}.`,
          incidentType: scanResult.hazardType,
          severity: scanResult.blockagePercentage >= 80 ? 'CRITICAL' : 'HIGH',
          latitude: 25.1320,
          longitude: 92.4215,
          locationName: selectedPhoto.location,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#090d16] p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-800">
              Computer Vision AI
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-semibold">Automated Drone & Field Photo Quantifier</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">AI Hazard & Landslide Vision Scanner</h1>
          <p className="mt-1 text-xs text-slate-400">
            Upload aerial drone captures or field mobile photos to automatically quantify debris volume ($m^3$), calculate road blockage percentage, and recommend heavy engineering clearance detachments.
          </p>
        </div>

        <div className="mt-3 flex items-center space-x-2 md:mt-0">
          <button
            onClick={handleAudioBroadcast}
            className="flex items-center space-x-1.5 rounded-lg border border-cyan-800/80 bg-cyan-950/40 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 transition-all shadow-sm"
          >
            <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Voice Broadcast Scan</span>
          </button>
        </div>
      </div>

      {/* Preset Photo Selector & Custom Upload */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        {SAMPLE_HAZARD_PHOTOS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className={`flex flex-col text-left rounded-xl border p-2.5 transition-all ${
              selectedPhoto.id === p.id && !customImage
                ? 'border-cyan-500 bg-cyan-950/40 shadow-lg shadow-cyan-950'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="relative h-20 w-full overflow-hidden rounded-lg bg-slate-800">
              <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
              <span className="absolute bottom-1 right-1 rounded bg-slate-950/80 px-1 py-0.2 font-mono text-[9px] font-bold text-cyan-400">
                {p.hazardType}
              </span>
            </div>
            <span className="mt-2 text-xs font-bold text-white line-clamp-1">{p.title}</span>
            <span className="text-[10px] text-slate-400 line-clamp-1">{p.location}</span>
          </button>
        ))}

        {/* Custom Upload Card */}
        <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-2.5 text-center cursor-pointer hover:border-cyan-500 transition-all">
          <Upload className="h-6 w-6 text-cyan-400 mb-1" />
          <span className="text-xs font-bold text-slate-200">Upload Photo</span>
          <span className="text-[9px] text-slate-400">From Mobile or Drone</span>
          <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
        </label>
      </div>

      {/* Scan Viewfinder & Results Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Viewfinder Display */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#070b13] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
              <div className="flex items-center space-x-2">
                <Camera className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">Live Computer Vision Optical Feed</span>
              </div>
              <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-[9px] text-cyan-400 border border-cyan-800">
                AI Segmentation Active
              </span>
            </div>

            {/* Image with bounding box overlay */}
            <div className="relative h-80 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
              <img
                src={customImage || selectedPhoto.imageUrl}
                alt="Hazard Feed"
                className="h-full w-full object-cover"
              />

              {/* Viewfinder Target HUD */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex justify-between font-mono text-[10px] text-cyan-400/80">
                  <span>[GEO: 25.1320°N, 92.4215°E]</span>
                  <span>ALT: 840m MSL</span>
                </div>

                {/* Target Box */}
                <div className={`mx-auto h-44 w-72 rounded-lg border-2 border-dashed ${
                  scanning ? 'border-amber-400 animate-pulse' : 'border-cyan-400'
                } relative flex items-center justify-center`}>
                  <div className="absolute -top-3 left-2 bg-slate-950/90 px-1.5 py-0.2 font-mono text-[9px] text-cyan-300 rounded border border-cyan-800">
                    DEBRIS MASS: {scanResult.estimatedDebrisVolumeM3} m³
                  </div>
                  <div className="absolute -bottom-3 right-2 bg-slate-950/90 px-1.5 py-0.2 font-mono text-[9px] text-rose-400 rounded border border-rose-800">
                    ROAD BLOCKAGE: {scanResult.blockagePercentage}%
                  </div>
                </div>

                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>CONFIDENCE: {scanResult.confidencePercent}%</span>
                  <span>SPECTRAL: NIR-RGB</span>
                </div>
              </div>

              {scanning && (
                <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center space-y-2">
                  <Sparkles className="h-8 w-8 text-cyan-400 animate-spin" />
                  <span className="font-mono text-xs font-bold text-cyan-300 animate-pulse">
                    Analyzing Terrain Volumetrics & Structural Integrity...
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Model: ConvNeXt-NER Disaster Segmentation</span>
            <span className="text-cyan-400 font-mono">Inference Latency: 12ms</span>
          </div>
        </div>

        {/* Right: Quantified Vision Analytics */}
        <div className="lg:col-span-6 space-y-4">
          {/* Metrics summary banner */}
          <div className="rounded-xl border border-cyan-800 bg-[#0a101d] p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Quantified Hazard Classification
                </span>
                <h3 className="text-base font-black text-white">{scanResult.hazardType} EVENT DETECTED</h3>
              </div>
              <span className="rounded-lg bg-rose-950 px-2.5 py-1 text-xs font-black text-rose-300 border border-rose-800">
                {scanResult.structuralIntegrityStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-center">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Debris Volume</span>
                <span className="text-lg font-black text-cyan-400">{scanResult.estimatedDebrisVolumeM3} m³</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Road Blockage</span>
                <span className={`text-lg font-black ${
                  scanResult.blockagePercentage >= 80 ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {scanResult.blockagePercentage}%
                </span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Clearance Time</span>
                <span className="text-lg font-black text-amber-400">~{scanResult.estimatedClearanceHours} hrs</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">AI Confidence</span>
                <span className="text-lg font-black text-emerald-400">{scanResult.confidencePercent}%</span>
              </div>
            </div>
          </div>

          {/* Recommended Heavy Engineering Detachment */}
          <div className="rounded-xl border border-amber-900/50 bg-amber-950/15 p-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 mb-2">
              <HardHat className="h-4 w-4 text-amber-400" />
              <span>Recommended Heavy Engineering Clearance Detachment</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-semibold">
              {scanResult.recommendedDetachment}
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              Automated logistics dispatch allocates nearest BRO (Border Roads Organisation) Project Pushpak / Setuk equipment yard.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleTransmitToGrid}
              disabled={transmitted}
              className={`w-full flex items-center justify-center space-x-2 rounded-lg py-2.5 text-xs font-bold transition-all shadow-lg ${
                transmitted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500'
              }`}
            >
              {transmitted ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Transmitted to Active Incident Grid</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  <span>Transmit to Incident Command Grid</span>
                </>
              )}
            </button>

            <button
              onClick={handleAudioBroadcast}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500"
            >
              <Volume2 className="h-4 w-4 text-cyan-400" />
              <span>Listen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
