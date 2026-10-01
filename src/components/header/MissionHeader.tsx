import React from 'react';
import { useMissionStore } from '../../lib/state/mission-store';
import { 
  Rocket, 
  Globe2, 
  Map, 
  Database, 
  ShieldCheck, 
  Bot
} from 'lucide-react';

export const MissionHeader: React.FC = () => {
  const {
    viewMode,
    focusJezeroCrater,
    focusGlobalMars,
    activeModal,
    setActiveModal,
  } = useMissionStore();

  return (
    <header className="h-14 bg-[#090d16]/95 border-b border-cyan-500/20 px-4 flex items-center justify-between text-xs select-none z-20 backdrop-blur-md">
      {/* Brand & Mission Identifier */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-rose-700 p-0.5 shadow-lg shadow-amber-900/30 flex items-center justify-center border border-amber-400/40">
            <Rocket className="w-4 h-4 text-white -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wider text-slate-100 font-mono">MARS-GEOSPECTRA</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-bold tracking-tight">
                NASA SPACE APPS 2026
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono hidden sm:block">
              Plan the Marswalk. Understand the terrain. Discover the science.
            </p>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-cyan-500/20 mx-1 hidden md:block" />

        {/* Tactical Telemetry Badges */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono">
          <div className="px-2.5 py-1 rounded bg-[#0f1422] border border-cyan-500/20 text-slate-300 flex items-center gap-1.5">
            <span className="text-zinc-500">MISSION:</span>
            <span className="text-cyan-300 font-semibold">MARSWALK-001</span>
          </div>

          <div className="px-2.5 py-1 rounded bg-[#0f1422] border border-cyan-500/20 text-slate-300 flex items-center gap-1.5">
            <span className="text-zinc-500">REGION:</span>
            <span className="text-amber-400 font-semibold">JEZERO CRATER</span>
          </div>

          <div className="px-2.5 py-1 rounded bg-[#0f1422] border border-cyan-500/20 text-slate-300 flex items-center gap-1.5">
            <span className="text-zinc-500">SOL:</span>
            <span className="text-slate-200 font-semibold">142</span>
          </div>

          <div className="px-2.5 py-1 rounded bg-[#0f1422] border border-cyan-500/20 text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">DATA:</span>
            <span className="text-emerald-400 font-semibold">6 / 7 VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Primary Actions & Perspective Switcher */}
      <div className="flex items-center gap-2 font-mono">
        {/* View Switcher Toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-zinc-900/80 border border-cyan-500/20">
          <button
            onClick={focusGlobalMars}
            className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all ${
              viewMode === 'global'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-semibold'
                : 'text-zinc-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GLOBAL MARS</span>
          </button>
          <button
            onClick={focusJezeroCrater}
            className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all ${
              viewMode === 'jezero'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold'
                : 'text-zinc-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span>JEZERO CRATER</span>
          </button>
        </div>

        {/* Data Catalog / Provenance Modal Trigger */}
        <button
          onClick={() => setActiveModal(activeModal === 'provenance' ? null : 'provenance')}
          className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
            activeModal === 'provenance'
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100'
              : 'bg-[#0f1422] border-cyan-500/20 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-200'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">PROVENANCE</span>
        </button>

        {/* AI Mission Scientist Drawer Trigger */}
        <button
          onClick={() => setActiveModal(activeModal === 'ai' ? null : 'ai')}
          className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
            activeModal === 'ai'
              ? 'bg-gradient-to-r from-cyan-600/40 to-blue-600/40 border-cyan-400 text-white shadow-lg shadow-cyan-900/40'
              : 'bg-[#0f1422] border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-semibold">AI SCIENTIST</span>
        </button>
      </div>
    </header>
  );
};
