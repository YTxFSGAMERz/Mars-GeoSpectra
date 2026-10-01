import React from 'react';
import { useMissionStore } from '../../lib/state/mission-store';
import { RouteObjective } from '../../types';
import { 
  Route, 
  Play, 
  CheckCircle2
} from 'lucide-react';

export const RoutePlannerPanel: React.FC = () => {
  const {
    candidateRoutes,
    selectedRouteIndex,
    selectRouteIndex,
    startSimulation,
    simulation,
  } = useMissionStore();

  const selectedRoute = candidateRoutes[selectedRouteIndex];

  const getObjectiveColor = (obj: RouteObjective) => {
    switch (obj) {
      case 'FASTEST':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20';
      case 'MIN_TERRAIN_RISK':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
      case 'SCIENCE_PRIORITY':
        return 'text-pink-400 border-pink-500/40 bg-pink-950/20';
      case 'BALANCED_MISSION':
      default:
        return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    }
  };

  return (
    <div className="h-64 bg-[#080c16]/95 border-t border-cyan-500/20 p-3 flex flex-col text-xs select-none backdrop-blur-md z-20">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/15">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-100 font-mono tracking-wider">
              EVA ROUTE COMPARISON & TERRAIN METRICS
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono hidden md:inline">
            A* Multi-Objective Pathfinding over Jezero DEM (Tobler-Mars Traversal Kinematics)
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={startSimulation}
            disabled={simulation.isPlaying}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-2 transition-all ${
              simulation.isPlaying
                ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-amber-400/50 shadow-lg shadow-amber-950/50'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{simulation.isPlaying ? 'SIMULATION IN PROGRESS' : 'SIMULATE MARSWALK'}</span>
          </button>
        </div>
      </div>

      {/* Main Content: 4 Candidate Route Cards & Detailed Analysis */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2.5 overflow-hidden">
        {candidateRoutes.map((route, idx) => {
          const isSelected = idx === selectedRouteIndex;
          const colorClass = getObjectiveColor(route.objective);

          return (
            <div
              key={route.id}
              onClick={() => selectRouteIndex(idx)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? `${colorClass} shadow-lg shadow-black/40 ring-1 ring-cyan-500/40`
                  : 'border-zinc-800/80 bg-[#0a0f1d]/50 hover:border-zinc-700 hover:bg-[#0c1224]'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold font-mono text-[11px] tracking-wide">
                    {route.name}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono mb-2">
                  <div className="bg-zinc-900/60 p-1 rounded border border-zinc-800/60">
                    <span className="text-zinc-500 block text-[9px]">DISTANCE:</span>
                    <span className="font-semibold text-slate-200">{route.metrics.distance2dKm} km</span>
                  </div>
                  <div className="bg-zinc-900/60 p-1 rounded border border-zinc-800/60">
                    <span className="text-zinc-500 block text-[9px]">EVA TIME:</span>
                    <span className="font-semibold text-slate-200">{route.metrics.estimatedDurationMinutes} min</span>
                  </div>
                  <div className="bg-zinc-900/60 p-1 rounded border border-zinc-800/60">
                    <span className="text-zinc-500 block text-[9px]">MAX SLOPE:</span>
                    <span className="font-semibold text-slate-200">{route.metrics.maxSlopeDeg}°</span>
                  </div>
                  <div className="bg-zinc-900/60 p-1 rounded border border-zinc-800/60">
                    <span className="text-zinc-500 block text-[9px]">SCIENCE STOPS:</span>
                    <span className="font-semibold text-emerald-400">{route.metrics.scienceTargetsEncountered} Targets</span>
                  </div>
                </div>
              </div>

              {/* Rationale Snippet */}
              <div className="border-t border-zinc-800/60 pt-1.5">
                <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">
                  {route.explanation.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Route Explainability Footer */}
      {selectedRoute && (
        <div className="mt-2 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="text-cyan-400 font-bold">WHY THIS ROUTE:</span>
            <span className="text-slate-300 line-clamp-1">{selectedRoute.explanation.tradeoffStatement}</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>CLIMB: <strong className="text-slate-200">+{selectedRoute.metrics.elevationGainM}m</strong></span>
            <span>AVG SLOPE: <strong className="text-slate-200">{selectedRoute.metrics.avgSlopeDeg}°</strong></span>
            <span>EST. O₂: <strong className="text-cyan-300">~{selectedRoute.metrics.oxygenLitersEst} L</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
