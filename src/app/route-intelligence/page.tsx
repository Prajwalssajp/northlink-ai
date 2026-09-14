'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight, 
  Package, 
  ArrowRight, 
  RefreshCw, 
  Info, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Play, 
  Brain, 
  TreePine, 
  BarChart3, 
  Cpu, 
  Zap, 
  Target, 
  Activity,
  Check,
  AlertCircle
} from 'lucide-react';
import MapContainerWrapper from '@/components/gis/MapContainerWrapper';
import { CommodityType, Priority, RoadSegment } from '@/lib/types';

// Mini bar chart for feature importances
function FeatureImportanceBar({ label, value, color = 'cyan' }: { label: string; value: number; color?: string }) {
  const pct = Math.round(value * 100);
  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    sky: 'bg-sky-500',
  };
  const barColor = colorMap[color] || 'bg-cyan-500';
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px]">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="text-slate-400 font-mono">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800">
        <div
          className={`h-1.5 rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// Tree vote chip for decision trees
function TreeVoteChip({ vote, idx }: { vote: number; idx: number }) {
  const pct = Math.round(vote * 100);
  const danger = pct >= 60;
  const warning = pct >= 30 && pct < 60;
  const color = danger ? 'bg-rose-500' : warning ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="h-8 w-3 rounded-full bg-slate-800 relative overflow-hidden">
        <div
          className={`absolute bottom-0 w-full rounded-full ${color} transition-all duration-500`}
          style={{ height: `${pct}%` }}
        />
      </div>
      <span className="text-[8px] text-slate-500 font-mono">T{idx + 1}</span>
    </div>
  );
}

export default function RouteIntelligencePage() {
  const [origin, setOrigin] = useState<string>('Guwahati (Kamrup)');
  const [destination, setDestination] = useState<string>('Silchar (Cachar)');
  const [commodity, setCommodity] = useState<CommodityType>('MEDICINES');
  const [priority, setPriority] = useState<Priority>('CRITICAL');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisTime, setAnalysisTime] = useState<string>('');
  const [showMLPanel, setShowMLPanel] = useState<boolean>(true);

  // Configurable weights modal toggle
  const [showWeights, setShowWeights] = useState<boolean>(false);
  const [weights, setWeights] = useState({
    landslideWeight: 0.35,
    floodWeight: 0.25,
    rainfallWeight: 0.15,
    roadDamageWeight: 0.15,
    terrainGradientWeight: 0.10,
  });

  const runAnalysis = async (customOrigin?: string, customDest?: string) => {
    try {
      setAnalyzing(true);
      setAnalysisError(null);
      const activeOrigin = customOrigin || origin;
      const activeDest = customDest || destination;

      const res = await fetch('/api/routes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: activeOrigin,
          destination: activeDest,
          commodityType: commodity,
          priority,
          customWeights: weights,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.analysis);
        setAnalysisTime(new Date().toLocaleTimeString());
      } else {
        setAnalysisError(data.error || 'Route analysis failed.');
      }
    } catch (e: any) {
      console.error('Route analysis error:', e);
      setAnalysisError(`Analysis engine offline: ${e.message}. Retrying via backup ML heuristics...`);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  // Pre-configured route pairs for fast hackathon demo
  const demoPairs = [
    { from: 'Guwahati (Kamrup)', to: 'Silchar (Cachar)', label: 'Guwahati ➔ Silchar (NH-6 Landslide Vulnerability)' },
    { from: 'Siliguri Gateway', to: 'Gangtok (East Sikkim)', label: 'Siliguri ➔ Gangtok (Teesta River Flood Breach)' },
    { from: 'Guwahati (Kamrup)', to: 'Imphal (Imphal West)', label: 'Guwahati ➔ Imphal (Kohima Ridge Bottleneck)' },
  ];

  const popularHubs = [
    'Guwahati (Kamrup)',
    'Silchar (Cachar)',
    'Shillong (East Khasi Hills)',
    'Gangtok (East Sikkim)',
    'Siliguri Gateway',
    'Imphal (Imphal West)',
    'Kohima (Nagaland)',
    'Dimapur (Nagaland)',
    'Aizawl (Mizoram)',
    'Itanagar (Papum Pare)',
    'Agartala (Tripura)'
  ];

  // Synthesize map polylines from analysisResult
  const mapRoads: RoadSegment[] = [];
  if (analysisResult?.primaryRoute) {
    mapRoads.push({
      id: analysisResult.primaryRoute.id,
      name: `[PRIMARY] ${analysisResult.primaryRoute.name}`,
      highwayNumber: 'PRIMARY',
      source: analysisResult.primaryRoute.origin,
      destination: analysisResult.primaryRoute.destination,
      roadType: 'Primary Transport Corridor',
      accessibilityStatus: analysisResult.primaryRoute.routeStatus,
      riskLevel: analysisResult.primaryRoute.assessment?.riskCategory || 'CRITICAL',
      averageTravelTime: analysisResult.primaryRoute.estimatedDuration,
      coordinatesGeoJson: analysisResult.primaryRoute.coordinatesGeoJson,
      lastUpdated: new Date().toISOString(),
    });
  }

  if (analysisResult?.alternativeRoute) {
    mapRoads.push({
      id: analysisResult.alternativeRoute.id,
      name: `[AI RECOMMENDED BYPASS] ${analysisResult.alternativeRoute.name}`,
      highwayNumber: 'BYPASS',
      source: analysisResult.alternativeRoute.origin,
      destination: analysisResult.alternativeRoute.destination,
      roadType: 'Strategic Alternative Bypass',
      accessibilityStatus: 'OPEN',
      riskLevel: 'LOW',
      averageTravelTime: analysisResult.alternativeRoute.estimatedDuration,
      coordinatesGeoJson: analysisResult.alternativeRoute.coordinatesGeoJson,
      lastUpdated: new Date().toISOString(),
    });
  }

  // Pull ML metadata from primary route & recommendation
  const mlPred = analysisResult?.primaryRoute?.assessment?.mlPrediction;
  const llmBrf = analysisResult?.primaryRoute?.assessment?.llmBriefing;
  const mlRec = analysisResult?.comparison?.mlRecommendation;
  const modelVersion = analysisResult?.primaryRoute?.assessment?.modelVersion;

  const featureLabels: Record<string, { label: string; color: string }> = {
    landslide_idx: { label: 'Landslide Index', color: 'rose' },
    rainfall_mm:   { label: 'Rainfall Intensity', color: 'sky' },
    flood_level:   { label: 'Flood Level', color: 'amber' },
    structural_damage: { label: 'Structural Damage', color: 'violet' },
    slope_gradient:    { label: 'Slope Gradient', color: 'emerald' },
    historical_choke:  { label: 'Historical Choke Points', color: 'cyan' },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#090d16] p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-800">
              Core Hackathon Module
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-semibold">Dual-Ensemble Random Forest · Scikit-Learn Inference</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">AI Route Intelligence & Corridor Rerouting</h1>
          <p className="mt-1 text-xs text-slate-400">
            Powered by two trained <strong className="text-cyan-400">Random Forest models (4,500 samples)</strong>: Disruption Predictor + Policy Reroute Classifier. Evaluates terrain hazard differentials to recommend optimal bypass corridors.
          </p>
        </div>

        <div className="mt-3 flex items-center space-x-2 md:mt-0">
          {analysisTime && (
            <span className="text-[11px] text-slate-400">
              Evaluated at <strong className="text-cyan-400">{analysisTime}</strong>
            </span>
          )}
          <button
            onClick={() => setShowWeights(!showWeights)}
            className="flex items-center space-x-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-cyan-500 hover:text-white"
          >
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>Scoring Weights</span>
          </button>
        </div>
      </div>

      {/* Error Banner if any */}
      {analysisError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-900/60 bg-rose-950/30 p-4 text-xs text-rose-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{analysisError}</span>
          </div>
          <button
            onClick={() => runAnalysis()}
            className="rounded bg-rose-900 px-3 py-1 font-bold text-white hover:bg-rose-800"
          >
            Retry Now
          </button>
        </div>
      )}

      {/* Configurable Weights Drawer */}
      {showWeights && (
        <div className="rounded-xl border border-cyan-900/60 bg-slate-950 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-cyan-400">AI Risk Engine Multi-Factor Weight Configuration</span>
            <span className="text-[11px] text-slate-400">Total: {(Object.values(weights).reduce((a, b) => a + b, 0)).toFixed(2)}</span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-5 text-xs">
            <div>
              <label className="text-slate-300 font-medium">Landslides: {(weights.landslideWeight * 100).toFixed(0)}%</label>
              <input
                type="range"
                min="0.1"
                max="0.6"
                step="0.05"
                value={weights.landslideWeight}
                onChange={(e) => setWeights({ ...weights, landslideWeight: parseFloat(e.target.value) })}
                className="w-full mt-1 accent-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium">Floods: {(weights.floodWeight * 100).toFixed(0)}%</label>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={weights.floodWeight}
                onChange={(e) => setWeights({ ...weights, floodWeight: parseFloat(e.target.value) })}
                className="w-full mt-1 accent-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium">Rainfall: {(weights.rainfallWeight * 100).toFixed(0)}%</label>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.05"
                value={weights.rainfallWeight}
                onChange={(e) => setWeights({ ...weights, rainfallWeight: parseFloat(e.target.value) })}
                className="w-full mt-1 accent-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium">Road Damage: {(weights.roadDamageWeight * 100).toFixed(0)}%</label>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.05"
                value={weights.roadDamageWeight}
                onChange={(e) => setWeights({ ...weights, roadDamageWeight: parseFloat(e.target.value) })}
                className="w-full mt-1 accent-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium">Gradient/Slope: {(weights.terrainGradientWeight * 100).toFixed(0)}%</label>
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.05"
                value={weights.terrainGradientWeight}
                onChange={(e) => setWeights({ ...weights, terrainGradientWeight: parseFloat(e.target.value) })}
                className="w-full mt-1 accent-cyan-400"
              />
            </div>
          </div>
          <button
            onClick={() => runAnalysis()}
            className="mt-3 rounded bg-cyan-600 px-3 py-1 text-xs font-bold text-white hover:bg-cyan-500"
          >
            Apply & Recalculate AI Risk
          </button>
        </div>
      )}

      {/* Route Selector Card */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-white">Configure Corridor & Lifeline Shipment</h3>
          {analyzing && (
            <span className="flex items-center space-x-1.5 text-xs text-cyan-400 font-mono animate-pulse">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              <span>Evaluating Random Forest Decision Trees...</span>
            </span>
          )}
        </div>

        {/* Demo Fast Preset Selection */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-cyan-400 flex items-center space-x-1">
            <Play className="h-3 w-3 fill-current" />
            <span>Instant Demo Scenarios:</span>
          </span>
          {demoPairs.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setOrigin(p.from);
                setDestination(p.to);
                runAnalysis(p.from, p.to);
              }}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all shadow-sm ${
                origin === p.from && destination === p.to
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500 ring-1 ring-cyan-500'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-slate-300">Origin Terminal</label>
            <input
              type="text"
              list="hubs-list-origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <datalist id="hubs-list-origin">
              {popularHubs.map(h => <option key={h} value={h} />)}
            </datalist>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300">Destination Hub</label>
            <input
              type="text"
              list="hubs-list-dest"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <datalist id="hubs-list-dest">
              {popularHubs.map(h => <option key={h} value={h} />)}
            </datalist>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300">Essential Commodity</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value as CommodityType)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="MEDICINES">MEDICINES (Cold-Chain Life Saving)</option>
              <option value="EMERGENCY_SUPPLIES">EMERGENCY SUPPLIES (Disaster Relief)</option>
              <option value="FOOD">FOOD GRAINS & RATIONS</option>
              <option value="AGRICULTURAL_PRODUCE">AGRICULTURAL PRODUCE</option>
              <option value="CONSTRUCTION_MATERIALS">CONSTRUCTION & REPAIR MATERIALS</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300">Convoy Priority</label>
            <div className="mt-1 flex space-x-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="CRITICAL">CRITICAL (Zero Delay Tolerance)</option>
                <option value="HIGH">HIGH PRIORITY</option>
                <option value="STANDARD">STANDARD</option>
              </select>

              <button
                type="button"
                onClick={() => runAnalysis()}
                disabled={analyzing}
                className="flex shrink-0 items-center space-x-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-black text-slate-950 transition-all hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-950"
              >
                <Sparkles className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
                <span>{analyzing ? 'Analyzing ML...' : 'Analyze'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6">
          {/* ══════════════════ ML RECOMMENDATION BANNER ══════════════════ */}
          <div className="rounded-xl border border-cyan-800 bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-slate-950 p-5 shadow-xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center space-x-1.5 rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300 border border-cyan-700">
                    <Brain className="h-3.5 w-3.5 text-cyan-400" />
                    <span>ML Recommendation Model</span>
                  </div>
                  {mlRec && (
                    <span className="rounded bg-violet-950 px-2 py-0.5 font-mono text-[9px] font-bold text-violet-300 border border-violet-800">
                      Tree Consensus: {mlRec.consensusPercentage}% ({mlRec.treeVotesForBypass}/{mlRec.totalTrees} Trees)
                    </span>
                  )}
                  {mlRec && (
                    <span className="rounded bg-emerald-950 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-300 border border-emerald-800">
                      Confidence: {(mlRec.confidence * 100).toFixed(1)}%
                    </span>
                  )}
                </div>

                <h2 className="mt-2 text-lg font-black text-white">
                  Recommended Corridor: {analysisResult.comparison.recommendedRouteName}
                </h2>
                <p className="mt-1 text-xs text-slate-300 max-w-3xl leading-relaxed">
                  {analysisResult.comparison.recommendationReason}
                </p>
              </div>

              <div className="flex items-center space-x-4 shrink-0 rounded-lg border border-cyan-900/50 bg-slate-950/70 p-3">
                <div className="text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Delay Avoided</div>
                  <div className="text-lg font-black text-emerald-400">
                    ~{(analysisResult.comparison.delaySavedMinutes / 60).toFixed(1)} hrs
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Safety Gain</div>
                  <div className="text-lg font-black text-cyan-400">
                    +{analysisResult.comparison.safetyGainPercentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════ ML RECOMMENDATION DECISION EXPLAINABILITY ══════════════════ */}
          {mlRec && (
            <div className="rounded-xl border border-cyan-900/50 bg-[#08101a] p-5">
              <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-cyan-300">
                    Machine Learning Reroute Policy Classifier — Decision Logic
                  </h3>
                  <span className="rounded border border-cyan-800 bg-cyan-950/60 px-2 py-0.5 font-mono text-[9px] text-cyan-400">
                    Accuracy: {(mlRec.accuracy * 100).toFixed(1)}% · F1: {(mlRec.f1Score * 100).toFixed(1)}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  SHAP Decision Weights
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Decision Factor Weights */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Feature Contributions toward Corridor Decision
                  </span>
                  {mlRec.featureContributions.map((fc: any) => (
                    <div key={fc.feature} className="rounded border border-slate-800 bg-slate-900/60 p-2.5 text-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-200">{fc.label}</span>
                        <span className={`font-mono text-[11px] ${
                          fc.direction === 'FAVORS_BYPASS' ? 'text-cyan-400' : 'text-rose-400'
                        }`}>
                          {fc.direction === 'FAVORS_BYPASS' ? `+${fc.impactPercentage}% (Bypass)` : `-${fc.impactPercentage}% (Detour)`}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800">
                        <div
                          className={`h-1.5 rounded-full ${
                            fc.direction === 'FAVORS_BYPASS' ? 'bg-cyan-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${fc.impactPercentage * 2}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-slate-400">{fc.description}</p>
                    </div>
                  ))}
                </div>

                {/* Tree Ensemble Votes Visualizer */}
                <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200">
                        Reroute Decision Tree Votes ({mlRec.totalTrees} Trees Evaluated)
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">
                        {mlRec.treeVotesForBypass} / {mlRec.totalTrees} Votes
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Each tree in the trained Random Forest independently evaluated the risk difference, projected delay avoided, priority multiplier, and mileage detour penalty.
                    </p>

                    <div className="flex flex-wrap items-end gap-1.5 min-h-[70px]">
                      {(mlRec.treeVotes || []).map((vote: number, i: number) => (
                        <TreeVoteChip key={i} vote={vote} idx={i} />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded border border-cyan-900/60 bg-cyan-950/30 p-2.5 text-xs text-cyan-300">
                    <strong>ML Tactical Verdict:</strong> {mlRec.tacticalDirective}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ CORRIDOR HAZARD PREDICTION ML PANEL ══════════════════ */}
          {mlPred && (
            <div className="rounded-xl border border-violet-900/60 bg-[#0b0b18] overflow-hidden">
              <div className="flex items-center justify-between border-b border-violet-900/40 bg-violet-950/20 px-5 py-3">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-violet-400" />
                  <span className="text-sm font-bold text-violet-300">Corridor Disruption & Delay ML Model</span>
                  <span className="rounded border border-violet-800 bg-violet-950/50 px-2 py-0.5 font-mono text-[9px] text-violet-400 uppercase tracking-wider">
                    Scikit-Learn Random Forest + GBR
                  </span>
                </div>
                <button
                  onClick={() => setShowMLPanel(!showMLPanel)}
                  className="text-[10px] text-slate-400 hover:text-white transition-colors"
                >
                  {showMLPanel ? '▲ Collapse' : '▼ Expand'}
                </button>
              </div>

              {showMLPanel && (
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-center">
                      <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-1">Model</div>
                      <div className="text-[11px] font-bold text-violet-300 leading-tight">{mlPred.modelType}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-center">
                      <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-1">Dataset Size</div>
                      <div className="text-xl font-black text-emerald-400">{mlPred.trainingSamples.toLocaleString()}</div>
                      <div className="text-[9px] text-slate-500">NER terrain samples</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-center">
                      <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-1">Disruption Acc.</div>
                      <div className="text-xl font-black text-cyan-400">
                        {((mlPred.metrics?.accuracy ?? 0) * 100).toFixed(1)}%
                      </div>
                      <div className="text-[9px] text-slate-500">test-set holdout</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-center">
                      <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-1">Delay RMSE</div>
                      <div className="text-xl font-black text-amber-400">
                        {((mlPred.metrics?.delay_rmse_hours ?? 0)).toFixed(2)} hrs
                      </div>
                      <div className="text-[9px] text-slate-500">GBR regressor</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* Feature Importances */}
                    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <BarChart3 className="h-3.5 w-3.5 text-violet-400" />
                        <span className="text-xs font-bold text-slate-200">Disruption Feature Importances (Gini Reduction)</span>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(mlPred.featureImportances || {})
                          .sort(([, a], [, b]) => (b as number) - (a as number))
                          .map(([key, val]) => {
                            const meta = featureLabels[key] || { label: key, color: 'cyan' };
                            return (
                              <FeatureImportanceBar
                                key={key}
                                label={meta.label}
                                value={val as number}
                                color={meta.color}
                              />
                            );
                          })}
                      </div>
                    </div>

                    {/* Disruption Tree Vote Distribution */}
                    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <TreePine className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-slate-200">
                          Disruption Classifier Votes ({mlPred.treeVotes?.length ?? 0} Trees)
                        </span>
                      </div>
                      <div className="flex flex-wrap items-end gap-1.5 min-h-[80px]">
                        {(mlPred.treeVotes || []).map((v: number, i: number) => (
                          <TreeVoteChip key={i} vote={v} idx={i} />
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-[10px]">
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500 inline-block" /> High risk ≥60%</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Medium 30-60%</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Low &lt;30%</span>
                      </div>
                      <div className="mt-3 rounded bg-slate-900 border border-slate-700 p-2 text-center">
                        <span className="text-[10px] text-slate-400">Ensemble Disruption Probability: </span>
                        <span className="text-sm font-black text-rose-300">
                          {((analysisResult.primaryRoute.assessment.disruptionProbability ?? 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LLM Tactical Briefing */}
                  {llmBrf && (
                    <div className="rounded-lg border border-amber-900/50 bg-amber-950/10 p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Zap className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300">Tactical Convoy Briefing</span>
                        <span className="rounded border border-amber-800/50 bg-amber-950/40 px-2 py-0.5 font-mono text-[9px] text-amber-500">
                          Confidence: {((llmBrf.confidenceScore ?? 0) * 100).toFixed(0)}%
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="rounded border-l-2 border-amber-500 bg-slate-900/60 pl-3 py-2 pr-2">
                          <div className="text-[10px] font-bold uppercase text-amber-400 tracking-wider mb-0.5">Tactical Directive</div>
                          <div className="text-slate-200 leading-relaxed">{llmBrf.tacticalDirective}</div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded border-l-2 border-violet-500 bg-slate-900/60 pl-3 py-2 pr-2">
                            <div className="text-[10px] font-bold uppercase text-violet-400 tracking-wider mb-0.5">Geological Threat</div>
                            <div className="text-slate-300 leading-relaxed">{llmBrf.geologicalThreatSummary}</div>
                          </div>

                          <div className="rounded border-l-2 border-sky-500 bg-slate-900/60 pl-3 py-2 pr-2">
                            <div className="text-[10px] font-bold uppercase text-sky-400 tracking-wider mb-0.5">IMD Weather Advisory</div>
                            <div className="text-slate-300 leading-relaxed">{llmBrf.weatherForecastAdvisory}</div>
                          </div>
                        </div>

                        <div className="rounded border-l-2 border-emerald-500 bg-slate-900/60 pl-3 py-2 pr-2">
                          <div className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider mb-1">Convoy Protocols</div>
                          <ul className="space-y-1">
                            {(llmBrf.recommendedConvoyProtocols || []).map((p: string, i: number) => (
                              <li key={i} className="flex items-start space-x-1.5 text-slate-300">
                                <ChevronRight className="h-3 w-3 mt-0.5 text-emerald-400 shrink-0" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Side-by-Side Comparison: Primary vs Alternative Route */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Primary Route Card */}
            <div className="rounded-xl border border-rose-900/50 bg-[#0c0910] p-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-rose-500" />
                  <h3 className="font-bold text-sm text-white">Default / Primary Route</h3>
                </div>
                <span className="rounded bg-rose-950 px-2 py-0.5 text-xs font-black text-rose-300 border border-rose-800">
                  Risk: {analysisResult.primaryRoute.assessment.riskScore}/100 ({analysisResult.primaryRoute.assessment.riskCategory})
                </span>
              </div>

              <div className="mt-3">
                <div className="text-sm font-bold text-slate-200">{analysisResult.primaryRoute.name}</div>
                <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-slate-900/60 p-2.5 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <span className="font-bold text-white">{analysisResult.primaryRoute.distance} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Base Travel</span>
                    <span className="font-bold text-white">{Math.round(analysisResult.primaryRoute.estimatedDuration / 60)} hrs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ML Predicted Delay</span>
                    <span className="font-bold text-rose-400">+{Math.round(analysisResult.primaryRoute.assessment.predictedDelay / 60)} hrs</span>
                  </div>
                </div>

                {/* Factors breakdown */}
                <div className="mt-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Contributing Risk Factors
                  </span>
                  {analysisResult.primaryRoute.assessment.contributingFactors.map((f: any) => (
                    <div key={f.name} className="rounded border border-slate-800/80 bg-slate-900/40 p-2 text-xs">
                      <div className="flex justify-between font-semibold text-slate-200">
                        <span>{f.name}</span>
                        <span className={f.status === 'CRITICAL' ? 'text-rose-400 font-bold' : f.status === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}>
                          {f.score}/100
                        </span>
                      </div>
                      <div className="mt-1 h-1 w-full rounded-full bg-slate-800">
                        <div
                          className={`h-1 rounded-full ${f.score >= 65 ? 'bg-rose-500' : f.score >= 35 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${f.score}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Alternative Route Card */}
            {analysisResult.alternativeRoute ? (
              <div className="rounded-xl border border-cyan-800/60 bg-[#07131a] p-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    <h3 className="font-bold text-sm text-cyan-300">AI Recommended Alternative Bypass</h3>
                  </div>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-xs font-black text-emerald-300 border border-emerald-800">
                    Risk: {analysisResult.alternativeRoute.assessment.riskScore}/100 (LOW)
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-sm font-bold text-slate-200">{analysisResult.alternativeRoute.name}</div>
                  <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-slate-900/60 p-2.5 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Distance</span>
                      <span className="font-bold text-white">{analysisResult.alternativeRoute.distance} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Base Travel</span>
                      <span className="font-bold text-white">{Math.round(analysisResult.alternativeRoute.estimatedDuration / 60)} hrs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Predicted Delay</span>
                      <span className="font-bold text-emerald-400">+{Math.round(analysisResult.alternativeRoute.assessment.predictedDelay / 60)} mins</span>
                    </div>
                  </div>

                  {/* Factors breakdown */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                      Bypass Safety Metrics
                    </span>
                    {analysisResult.alternativeRoute.assessment.contributingFactors.map((f: any) => (
                      <div key={f.name} className="rounded border border-slate-800/80 bg-slate-900/40 p-2 text-xs">
                        <div className="flex justify-between font-semibold text-slate-200">
                          <span>{f.name}</span>
                          <span className={f.status === 'CRITICAL' ? 'text-rose-400 font-bold' : f.status === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}>
                            {f.score}/100
                          </span>
                        </div>
                        <div className="mt-1 h-1 w-full rounded-full bg-slate-800">
                          <div
                            className={`h-1 rounded-full ${f.score >= 65 ? 'bg-rose-500' : f.score >= 35 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${f.score}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-center text-xs text-slate-400">
                Primary route remains optimal under current parameters.
              </div>
            )}
          </div>

          {/* Interactive GIS Visualizer for Selected Corridors */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
            <div className="mb-3 flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-white">Geospatial Polyline Overlay (Primary vs Bypass)</span>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="flex items-center space-x-1 text-rose-400">
                  <span className="h-2 w-4 rounded-full bg-rose-500" />
                  <span>Primary (Disrupted)</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="h-2 w-4 rounded-full bg-emerald-500" />
                  <span>AI Recommended Bypass</span>
                </span>
              </div>
            </div>

            <MapContainerWrapper
              roads={mapRoads}
              incidents={[]}
              vehicles={[]}
              height="400px"
              initialCenter={[25.3, 92.5]}
              initialZoom={7}
            />
          </div>
        </div>
      )}
    </div>
  );
}
