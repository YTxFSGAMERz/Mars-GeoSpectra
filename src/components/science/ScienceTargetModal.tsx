import React from 'react';
import { useMissionStore } from '../../lib/state/mission-store';
import { formatMarsCoordinates } from '../../lib/geo/coordinates';
import { 
  X, 
  Activity, 
  Image as ImageIcon, 
  Compass, 
  AlertTriangle, 
  Database,
  Target
} from 'lucide-react';

export const ScienceTargetModal: React.FC = () => {
  const {
    selectedScienceTarget,
    activeModal,
    setActiveModal,
    setDestinationPoint,
  } = useMissionStore();

  if (activeModal !== 'science' || !selectedScienceTarget) {
    return null;
  }

  const handleSetDestination = () => {
    setDestinationPoint(selectedScienceTarget.coordinate);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-xs font-mono">
        {/* Modal Header */}
        <div className="p-4 bg-[#0d1322] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold tracking-wider">
                ASTROBIOLOGICAL & GEOLOGICAL TARGET DOSSIER
              </span>
              <h2 className="text-base font-bold text-slate-100">{selectedScienceTarget.name}</h2>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            aria-label="Close Science Dossier"
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-slate-300">
          {/* Coordinates & Target Type Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0c1220] p-2.5 rounded-lg border border-cyan-500/15">
            <div>
              <span className="text-[10px] text-zinc-500 block">COORDINATES:</span>
              <span className="font-bold text-slate-200">
                {formatMarsCoordinates(selectedScienceTarget.coordinate)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">TARGET TYPE:</span>
              <span className="font-bold text-cyan-400">{selectedScienceTarget.targetType}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">CONFIDENCE:</span>
              <span className="font-bold text-emerald-400">{selectedScienceTarget.confidence}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">SOURCE MISSION:</span>
              <span className="font-bold text-amber-400">{selectedScienceTarget.primaryMission}</span>
            </div>
          </div>

          {/* Geological Description */}
          <div>
            <h3 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-1">
              Geological Description & Context
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">
              {selectedScienceTarget.description}
            </p>
          </div>

          {/* Scientific Significance & Astrobiological Potential */}
          <div>
            <h3 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-1">
              Scientific Significance & Biosignature Potential
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">
              {selectedScienceTarget.scientificSignificance}
            </p>
          </div>

          {/* CRISM Spectral Mineralogy */}
          {selectedScienceTarget.mineralSignatures && selectedScienceTarget.mineralSignatures.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Activity className="w-3.5 h-3.5 text-pink-400" />
                <h3 className="text-[11px] font-bold text-pink-300 uppercase tracking-wider">
                  CRISM Spectral Mineral Detections
                </h3>
              </div>
              <div className="space-y-1.5">
                {selectedScienceTarget.mineralSignatures.map((sig, i) => (
                  <div key={i} className="p-2 rounded bg-pink-950/20 border border-pink-500/20 text-pink-200 text-xs">
                    {sig}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Imagery */}
          {selectedScienceTarget.availableImagery && selectedScienceTarget.availableImagery.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <h3 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Supporting Remote Sensing Products
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedScienceTarget.availableImagery.map((img, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px]">
                    {img}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Astronaut Action */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 font-bold block mb-1">
              RECOMMENDED FIELD SAMPLING PROTOCOL:
            </span>
            <p className="text-emerald-100 text-xs leading-relaxed">
              {selectedScienceTarget.recommendedAction}
            </p>
          </div>

          {/* Caveats and Limitations */}
          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-amber-300 font-bold block">
                SCIENTIFIC CAVEATS & TRAVERSABILITY HAZARDS:
              </span>
              <p className="text-amber-200/90 text-xs leading-relaxed mt-0.5">
                {selectedScienceTarget.caveats}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#0d1322] border-t border-cyan-500/20 flex items-center justify-between">
          <button
            onClick={() => setActiveModal('provenance')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Trace In Data Catalog</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal(null)}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSetDestination}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-950/50 flex items-center gap-1.5"
            >
              <Target className="w-4 h-4" />
              <span>SET AS MISSION DESTINATION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
