import React, { useState } from 'react';
import { useMissionStore } from '../../lib/state/mission-store';
import { PROVENANCE_REGISTRY } from '../../lib/data/provenance';
import { 
  X, 
  Database, 
  Search, 
  ExternalLink, 
  Layers, 
  AlertCircle
} from 'lucide-react';

export const ProvenanceModal: React.FC = () => {
  const { activeModal, setActiveModal } = useMissionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string>('prov-viking-mdim');

  if (activeModal !== 'provenance') {
    return null;
  }

  const records = Object.values(PROVENANCE_REGISTRY);
  const filteredRecords = records.filter(
    (r) =>
      r.datasetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.mission.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.instrument.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeRecord = PROVENANCE_REGISTRY[selectedRecordId] || records[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 select-none animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#080c16] border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col text-xs font-mono">
        {/* Header */}
        <div className="p-4 bg-[#0c1220] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold tracking-wider">
                NASA PLANETARY DATA SYSTEM (PDS) PROVENANCE CATALOG
              </span>
              <h2 className="text-sm font-bold text-slate-100">
                Data Lineage, Sensors & Scientific Derivation Registry
              </h2>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            aria-label="Close Provenance Catalog"
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Catalog Search & Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Master List */}
          <div className="w-80 border-r border-cyan-500/20 bg-[#090d18] flex flex-col">
            {/* Search Input */}
            <div className="p-3 border-b border-cyan-500/15">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5" />
                <input
                  type="text"
                  maxLength={100}
                  placeholder="Search datasets, sensors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredRecords.map((r) => {
                const isSelected = r.id === selectedRecordId;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRecordId(r.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-200'
                        : 'border-zinc-800/80 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-[11px] leading-tight mb-1 text-slate-200">
                      {r.datasetName}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      {r.mission} • {r.instrument}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Detail Pane */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#070a12] text-slate-300">
            {activeRecord ? (
              <>
                {/* Title & Organization */}
                <div className="border-b border-cyan-500/20 pb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                      {activeRecord.pdsNode}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400 text-xs">{activeRecord.processingLevel}</span>
                  </div>
                  <h1 className="text-base font-bold text-slate-100 mb-1">{activeRecord.datasetName}</h1>
                  <p className="text-xs text-zinc-400">
                    Host: <span className="text-slate-200 font-semibold">{activeRecord.hostOrganization}</span>
                  </p>
                </div>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#0c1220] p-3 rounded-lg border border-cyan-500/15 text-[11px]">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">SPATIAL RESOLUTION:</span>
                    <span className="font-semibold text-cyan-300">{activeRecord.spatialResolution}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">TEMPORAL COVERAGE:</span>
                    <span className="font-semibold text-slate-200">{activeRecord.temporalCoverage}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">PRODUCT IDENTIFIER:</span>
                    <span className="font-semibold text-amber-300">{activeRecord.productId || 'N/A'}</span>
                  </div>
                </div>

                {/* Derivation & Transformation Chain */}
                <div>
                  <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Processing & Transformation Chain</span>
                  </h3>
                  <div className="space-y-1.5">
                    {activeRecord.derivationChain.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2 rounded bg-zinc-900/50 border border-zinc-800 text-xs text-slate-300"
                      >
                        <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scientific Uncertainties and Limitations */}
                <div>
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Uncertainties, Calibration & Operational Caveats</span>
                  </h3>
                  <div className="space-y-1.5">
                    {activeRecord.uncertaintiesAndLimitations.map((lim, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed"
                      >
                        • {lim}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Source Link */}
                {activeRecord.sourceUrl && activeRecord.sourceUrl.startsWith('https://') && (
                  <div className="pt-2">
                    <a
                      href={activeRecord.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-colors"
                    >
                      <span>View Official NASA / PDS Archive Repository</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
