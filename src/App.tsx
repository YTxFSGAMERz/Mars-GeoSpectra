import React from 'react';
import { MissionHeader } from './components/header/MissionHeader';
import { MarsGlobe } from './components/globe/MarsGlobe';
import { LayerPanel } from './components/layers/LayerPanel';
import { RoutePlannerPanel } from './components/routing/RoutePlannerPanel';
import { SimulationHUD } from './components/simulation/SimulationHUD';
import { ScienceTargetModal } from './components/science/ScienceTargetModal';
import { ProvenanceModal } from './components/provenance/ProvenanceModal';
import { MissionAIChat } from './components/ai/MissionAIChat';

export const App: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#06080d] text-slate-100 overflow-hidden select-none">
      {/* 1. Tactical Mission Header */}
      <MissionHeader />

      {/* 2. Main Mission Control Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: NASA Data Layer Management Panel */}
        <LayerPanel />

        {/* Center: Interactive 3D Mars Globe & Jezero Environment */}
        <main className="flex-1 relative h-full w-full overflow-hidden">
          <MarsGlobe />
          
          {/* Real-time Marswalk EVA Simulation HUD Overlay */}
          <SimulationHUD />
        </main>

        {/* Slide-out Grounded AI Mission Scientist Drawer */}
        <MissionAIChat />
      </div>

      {/* 3. Bottom: EVA Route Comparison & Terrain Analysis Panel */}
      <RoutePlannerPanel />

      {/* 4. Contextual Modal Overlays */}
      <ScienceTargetModal />
      <ProvenanceModal />
    </div>
  );
};

export default App;
