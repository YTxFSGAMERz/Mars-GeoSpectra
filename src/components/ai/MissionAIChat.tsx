import React, { useState } from 'react';
import { useMissionStore } from '../../lib/state/mission-store';
import { 
  Bot, 
  Send, 
  X, 
  AlertCircle, 
  Database, 
  ShieldCheck
} from 'lucide-react';

export const MissionAIChat: React.FC = () => {
  const { activeModal, setActiveModal, aiMessages, sendAIMessage, candidateRoutes, selectedRouteIndex } = useMissionStore();
  const [inputText, setInputText] = useState('');

  if (activeModal !== 'ai') {
    return null;
  }

  const activeRoute = candidateRoutes[selectedRouteIndex];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputText.trim().slice(0, 500);
    if (!clean) return;
    sendAIMessage(clean);
    setInputText('');
  };

  const samplePrompts = [
    'Why does this candidate route avoid the Séítah region?',
    'What mineral signatures are detected at Delta Scarp Base?',
    'What assumptions are used in the metabolic traversal model?',
    'What localized MEDA weather observations exist here?',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#070b14]/95 border-l border-cyan-500/30 shadow-2xl flex flex-col text-xs font-mono select-none backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 bg-[#0a0f1d] border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 p-0.5 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-950/60">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-sm">AI MISSION SCIENTIST</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold">
                GROUNDED
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">Strictly grounded in NASA Jezero datasets</p>
          </div>
        </div>

        <button
          onClick={() => setActiveModal(null)}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Structured Telemetry Context Banner */}
      <div className="bg-[#0b1122] px-3.5 py-2 border-b border-cyan-500/15 flex items-center justify-between text-[10px] text-zinc-400">
        <span>ACTIVE ROUTE CONTEXT:</span>
        <span className="text-cyan-300 font-bold">{activeRoute?.name}</span>
        <span className="text-zinc-500">•</span>
        <span>{activeRoute?.metrics.distance2dKm} km</span>
        <span className="text-zinc-500">•</span>
        <span>{activeRoute?.metrics.estimatedDurationMinutes} min</span>
      </div>

      {/* Chat Messages Transcript */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {aiMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3 rounded-xl border text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600/30 border-cyan-400/40 text-cyan-100 rounded-br-none'
                    : 'bg-[#0e1424] border-cyan-500/20 text-slate-200 rounded-bl-none shadow-lg'
                }`}
              >
                <p>{msg.content}</p>

                {/* Grounded Evidence Citations */}
                {!isUser && msg.groundedEvidence && (
                  <div className="mt-2.5 pt-2 border-t border-cyan-500/15 space-y-1">
                    {msg.groundedEvidence.sourcesCited && msg.groundedEvidence.sourcesCited.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 text-[9px] text-zinc-400">
                        <Database className="w-3 h-3 text-cyan-400" />
                        <span className="font-semibold text-zinc-300">Sources:</span>
                        {msg.groundedEvidence.sourcesCited.map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-cyan-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {msg.groundedEvidence.metricCitations && msg.groundedEvidence.metricCitations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 text-[9px] text-zinc-400">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span className="font-semibold text-zinc-300">Telemetry:</span>
                        {msg.groundedEvidence.metricCitations.map((m, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}

                    {msg.groundedEvidence.uncertaintyWarning && (
                      <div className="flex items-center gap-1 text-[9px] text-amber-300 pt-0.5">
                        <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{msg.groundedEvidence.uncertaintyWarning}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
      </div>

      {/* Suggested Quick Inquiry Chips */}
      <div className="p-2.5 border-t border-cyan-500/15 bg-[#090e1c] flex flex-wrap gap-1.5">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendAIMessage(prompt)}
            className="text-[10px] px-2.5 py-1 rounded-full bg-zinc-900/80 hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-200 border border-zinc-700 hover:border-cyan-500/40 transition-all text-left"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* User Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-[#0a0f1d] border-t border-cyan-500/20 flex gap-2">
        <input
          type="text"
          maxLength={500}
          placeholder="Ask about terrain, mineralogy, or route tradeoffs..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono"
        />
        <button
          type="submit"
          className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition-all shadow-md shadow-cyan-950/50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
