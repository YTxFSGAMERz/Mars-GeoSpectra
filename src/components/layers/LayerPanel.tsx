import React, { useState } from 'react';
import { useMissionStore } from '../../lib/state/mission-store';
import { LayerCategory, MissionLayer } from '../../types';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Sliders, 
  Info, 
  ChevronDown, 
  ChevronRight,
  Activity,
  Mountain,
  Image as ImageIcon,
  Flame,
  AlertTriangle,
  Compass
} from 'lucide-react';

export const LayerPanel: React.FC = () => {
  const { layers, toggleLayer, setLayerOpacity, setActiveModal } = useMissionStore();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    TOPOGRAPHY: true,
    IMAGERY: true,
    MINERALOGY: true,
    HAZARD: true,
    THERMAL: false,
    SCIENCE: true,
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const categories: { key: LayerCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'TOPOGRAPHY', label: 'TOPOGRAPHY & ELEVATION', icon: <Mountain className="w-3.5 h-3.5 text-cyan-400" /> },
    { key: 'IMAGERY', label: 'ORBITAL IMAGERY & CTX', icon: <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> },
    { key: 'MINERALOGY', label: 'CRISM MINERALOGICAL OVERLAYS', icon: <Activity className="w-3.5 h-3.5 text-pink-400" /> },
    { key: 'HAZARD', label: 'TERRAIN TRAVERSABILITY HAZARDS', icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> },
    { key: 'THERMAL', label: 'THEMIS THERMAL INERTIA', icon: <Flame className="w-3.5 h-3.5 text-orange-400" /> },
    { key: 'SCIENCE', label: 'SCIENCE STATIONS & TARGETS', icon: <Compass className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  const getStatusBadge = (status: MissionLayer['status']) => {
    switch (status) {
      case 'LIVE':
        return <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">LIVE</span>;
      case 'CACHED':
        return <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-bold">CACHED</span>;
      case 'DERIVED':
        return <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-500/30 text-[9px] font-mono font-bold">DERIVED</span>;
      case 'DEMO':
        return <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold">DEMO</span>;
      default:
        return <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 text-[9px] font-mono font-bold">UNAVAILABLE</span>;
    }
  };

  return (
    <div className="w-80 h-full bg-[#080c16]/90 border-r border-cyan-500/20 flex flex-col text-xs select-none backdrop-blur-md">
      {/* Panel Header */}
      <div className="p-3 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100 font-mono tracking-wider">NASA DATA LAYERS</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">
          {layers.filter((l) => l.visible).length} / {layers.length} ACTIVE
        </span>
      </div>

      {/* Layer List grouped by category */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {categories.map((cat) => {
          const categoryLayers = layers.filter((l) => l.category === cat.key);
          if (categoryLayers.length === 0) return null;
          const isExpanded = !!expandedCategories[cat.key];

          return (
            <div key={cat.key} className="rounded-lg border border-cyan-500/10 bg-[#0a0f1d]/60 overflow-hidden">
              <button
                onClick={() => toggleCategory(cat.key)}
                className="w-full px-2.5 py-2 flex items-center justify-between text-left hover:bg-cyan-500/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {cat.icon}
                  <span className="font-mono text-[11px] font-semibold text-slate-200">{cat.label}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-2 pt-0 space-y-2 border-t border-cyan-500/10 mt-1">
                  {categoryLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`p-2 rounded border transition-all ${
                        layer.visible
                          ? 'border-cyan-500/30 bg-cyan-950/20'
                          : 'border-zinc-800 bg-zinc-900/30 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 flex-1">
                          <button
                            onClick={() => toggleLayer(layer.id)}
                            className={`p-1 rounded transition-colors ${
                              layer.visible
                                ? 'text-cyan-400 hover:text-cyan-300 bg-cyan-500/20'
                                : 'text-zinc-500 hover:text-zinc-300 bg-zinc-800'
                            }`}
                            title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                          >
                            {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <span className="font-semibold text-slate-100 text-[11px] leading-tight">
                            {layer.name}
                          </span>
                        </div>
                        {getStatusBadge(layer.status)}
                      </div>

                      <div className="text-[10px] text-zinc-400 font-mono mb-1.5 pl-6">
                        <span>{layer.mission}</span> • <span>{layer.resolution}</span>
                      </div>

                      {/* Opacity slider when layer is visible */}
                      {layer.visible && (
                        <div className="pl-6 pt-1 flex items-center gap-2">
                          <Sliders className="w-3 h-3 text-zinc-500" />
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={layer.opacity}
                            onChange={(e) => setLayerOpacity(layer.id, parseFloat(e.target.value))}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                          />
                          <span className="text-[10px] font-mono text-cyan-300 w-7 text-right">
                            {Math.round(layer.opacity * 100)}%
                          </span>
                        </div>
                      )}

                      {/* Legend swatch if present */}
                      {layer.legend && layer.visible && (
                        <div className="pl-6 pt-2">
                          <span className="text-[9px] font-mono text-zinc-400 block mb-1">
                            {layer.legend.label}
                          </span>
                          <div className="flex h-1.5 rounded overflow-hidden w-full mb-1">
                            {layer.legend.colors.map((c, i) => (
                              <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                            <span>{layer.legend.ticks[0]}</span>
                            <span>{layer.legend.ticks[layer.legend.ticks.length - 1]}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Provenance Affordance */}
      <div className="p-3 border-t border-cyan-500/20 bg-[#090d16]">
        <button
          onClick={() => setActiveModal('provenance')}
          className="w-full py-2 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-200 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all"
        >
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>VIEW SCIENTIFIC PROVENANCE</span>
        </button>
      </div>
    </div>
  );
};
