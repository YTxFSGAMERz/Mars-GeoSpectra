import React, { useEffect } from 'react';
import { useMissionStore } from '../../lib/state/mission-store';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles,
  X
} from 'lucide-react';

export const SimulationHUD: React.FC = () => {
  const {
    simulation,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSimulationProgress,
    setSimulationSpeed,
    tickSimulation,
    candidateRoutes,
    selectedRouteIndex,
    selectScienceTarget,
  } = useMissionStore();

  const activeRoute = candidateRoutes[selectedRouteIndex];

  // Drive simulation tick loop
  useEffect(() => {
    let lastTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const deltaSec = (now - lastTime) / 1000.0;
      lastTime = now;
      tickSimulation(deltaSec);
    }, 100);

    return () => clearInterval(interval);
  }, [tickSimulation]);

  if (!simulation.isPlaying && simulation.progress === 0) {
    return null;
  }

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDistance = activeRoute?.metrics.distance2dKm || 5.0;
  const traversedDistance = Math.round(simulation.progress * totalDistance * 100) / 100;
  const remainingDistance = Math.round((totalDistance - traversedDistance) * 100) / 100;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-4xl hud-panel p-3.5 rounded-xl border border-cyan-500/40 shadow-2xl text-xs font-mono select-none animate-in fade-in slide-in-from-top-4">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-300 text-sm tracking-wider">
            MARSWALK EVA SIMULATION HUD
          </span>
          <span className="text-zinc-500">|</span>
          <span className="text-slate-300 font-semibold">{activeRoute?.name}</span>
        </div>

        <button
          onClick={resetSimulation}
          className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
          title="Exit Simulation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Science Target Proximity Trigger Banner */}
      {simulation.activeScienceAlert && (
        <div className="mb-3 p-2.5 rounded-lg bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-400/50 flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <div>
              <span className="font-bold text-cyan-200 block text-xs">
                SCIENCE OPPORTUNITY DETECTED: {simulation.activeScienceAlert.name}
              </span>
              <span className="text-zinc-300 text-[11px]">
                {simulation.activeScienceAlert.description} ({simulation.activeScienceAlert.confidence} Confidence)
              </span>
            </div>
          </div>
          <button
            onClick={() => selectScienceTarget(simulation.activeScienceAlert)}
            className="py-1 px-3 bg-cyan-500 text-slate-950 font-bold rounded text-xs hover:bg-cyan-400 transition-all shadow-md"
          >
            INSPECT TARGET
          </button>
        </div>
      )}

      {/* Live Telemetry Instruments */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
        {/* Elapsed Time */}
        <div className="bg-[#0b101d] p-2 rounded border border-cyan-500/20">
          <span className="text-[10px] text-zinc-500 block">ELAPSED EVA:</span>
          <span className="text-sm font-bold text-cyan-300">
            {formatTime(simulation.elapsedMinutes)}
          </span>
          <span className="text-[10px] text-zinc-500 block">
            / {formatTime(activeRoute?.metrics.estimatedDurationMinutes || 120)}
          </span>
        </div>

        {/* Traversed Distance */}
        <div className="bg-[#0b101d] p-2 rounded border border-cyan-500/20">
          <span className="text-[10px] text-zinc-500 block">TRAVERSED DIST:</span>
          <span className="text-sm font-bold text-slate-100">{traversedDistance} km</span>
          <span className="text-[10px] text-zinc-500 block">REMAIN: {remainingDistance} km</span>
        </div>

        {/* Local Slope */}
        <div className="bg-[#0b101d] p-2 rounded border border-cyan-500/20">
          <span className="text-[10px] text-zinc-500 block">LOCAL SLOPE:</span>
          <span className={`text-sm font-bold ${simulation.currentSlopeDeg > 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {simulation.currentSlopeDeg.toFixed(1)}°
          </span>
          <span className="text-[10px] text-zinc-500 block">
            {simulation.currentSlopeDeg > 15 ? 'ELEVATED EFFORT' : 'NOMINAL STRIDE'}
          </span>
        </div>

        {/* Oxygen Consumables */}
        <div className="bg-[#0b101d] p-2 rounded border border-cyan-500/20">
          <div className="flex items-center justify-between text-[10px] text-zinc-500">
            <span>O₂ RESERVE:</span>
            <span className="text-cyan-300 font-bold">{simulation.oxygenRemainingPercent}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${simulation.oxygenRemainingPercent}%` }}
            />
          </div>
          <span className="text-[9px] text-zinc-500 block mt-1">RATE: ~1.1 L/min</span>
        </div>

        {/* Life Support Battery */}
        <div className="bg-[#0b101d] p-2 rounded border border-cyan-500/20">
          <div className="flex items-center justify-between text-[10px] text-zinc-500">
            <span>SUIT POWER:</span>
            <span className="text-amber-400 font-bold">{simulation.batteryRemainingPercent}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${simulation.batteryRemainingPercent}%` }}
            />
          </div>
          <span className="text-[9px] text-zinc-500 block mt-1">DRAW: ~210 W</span>
        </div>
      </div>

      {/* Scrub Bar & Media Controls */}
      <div className="flex items-center gap-3">
        {/* Play / Pause Toggle */}
        <button
          onClick={simulation.isPlaying ? pauseSimulation : startSimulation}
          className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 transition-all"
        >
          {simulation.isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>

        {/* Reset */}
        <button
          onClick={resetSimulation}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
          title="Reset Simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Scrub Slider */}
        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={simulation.progress}
            onChange={(e) => setSimulationProgress(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded border border-zinc-800">
          {[1, 2, 5, 10].map((s) => (
            <button
              key={s}
              onClick={() => setSimulationSpeed(s as 1 | 2 | 5 | 10)}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                simulation.speed === s
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-zinc-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
