import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useMissionStore } from '../../lib/state/mission-store';
import { JEZERO_SCIENCE_TARGETS } from '../../lib/data/science-targets';
import { formatMarsCoordinates } from '../../lib/geo/coordinates';
import { sampleJezeroElevationModel } from '../../lib/geo/dem';
import { 
  Compass, 
  LocateFixed, 
  Eye, 
  Info
} from 'lucide-react';

export const MarsGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    viewMode,
    candidateRoutes,
    selectedRouteIndex,
    selectedScienceTarget,
    simulation,
    focusJezeroCrater,
    focusGlobalMars,
    setActiveModal,
  } = useMissionStore();

  const [crosshairCoord, setCrosshairCoord] = useState<{ lat: number; lon: number; elev: number } | null>({
    lat: 18.4412,
    lon: 77.4520,
    elev: -2540,
  });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const threeCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const globeSphereRef = useRef<THREE.Mesh | null>(null);
  const routeLinesRef = useRef<THREE.Group | null>(null);
  const astronautMarkerRef = useRef<THREE.Group | null>(null);
  const targetMarkersRef = useRef<THREE.Group | null>(null);

  // Jezero local coordinates reference
  const JEZERO_REF_LAT = 18.4412;
  const JEZERO_REF_LON = 77.4520;
  const SCALE_FACTOR = 180.0; // Three.js units per degree in Jezero view

  const latLonToJezeroVector = (lat: number, lon: number, elevMeters = -2540): THREE.Vector3 => {
    const x = (lon - JEZERO_REF_LON) * SCALE_FACTOR;
    const z = -(lat - JEZERO_REF_LAT) * SCALE_FACTOR;
    const y = (elevMeters + 2560) * 0.04; // scaled elevation
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.008);
    sceneRef.current = scene;

    // 2. Camera
    const cameraObj = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    cameraObj.position.set(0, 35, 45);
    cameraObj.lookAt(0, 0, 0);
    threeCameraRef.current = cameraObj;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lighting (Simulating Martian sunlight)
    const ambientLight = new THREE.AmbientLight(0x38455e, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff1dc, 2.4);
    sunLight.position.set(60, 100, 40);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // 5. Global Mars Sphere (Shown in 'global' mode)
    const marsRadius = 14;
    const globeGeo = new THREE.SphereGeometry(marsRadius, 64, 64);
    
    // Procedural Mars Planetary Canvas Texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#b84414';
    ctx.fillRect(0, 0, 1024, 512);
    // Dark volcanic basalt patches (Syrtis Major, Acidalia)
    ctx.fillStyle = '#5c220c';
    ctx.beginPath();
    ctx.arc(680, 240, 160, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(320, 200, 190, 0, Math.PI * 2);
    ctx.fill();
    // Polar ice caps
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 25);
    ctx.fillRect(0, 490, 1024, 22);

    const globeTexture = new THREE.CanvasTexture(canvas);
    const globeMat = new THREE.MeshStandardMaterial({
      map: globeTexture,
      roughness: 0.85,
      metalness: 0.1,
    });
    const globeSphere = new THREE.Mesh(globeGeo, globeMat);
    globeSphere.visible = viewMode === 'global';
    scene.add(globeSphere);
    globeSphereRef.current = globeSphere;

    // Mars Atmosphere Glow
    const atmosGeo = new THREE.SphereGeometry(marsRadius * 1.025, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosSphere = new THREE.Mesh(atmosGeo, atmosMat);
    globeSphere.add(atmosSphere);

    // 6. Jezero Crater 3D Digital Terrain Surface Mesh
    const gridDim = 70;
    const terrainGeo = new THREE.PlaneGeometry(60, 60, gridDim, gridDim);
    terrainGeo.rotateX(-Math.PI / 2);

    // Displace vertices with authentic Jezero elevation function
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const lat = JEZERO_REF_LAT - vz / SCALE_FACTOR;
      const lon = JEZERO_REF_LON + vx / SCALE_FACTOR;

      const sample = sampleJezeroElevationModel({ lat, lon });
      const vy = (sample.elevationMeters + 2560) * 0.04;
      posAttr.setY(i, vy);
    }
    terrainGeo.computeVertexNormals();

    // Procedural Shader-style Material for Jezero with Slope & Elevation shading
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xc1440e,
      roughness: 0.9,
      metalness: 0.05,
      wireframe: false,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    terrainMesh.visible = viewMode === 'jezero';
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // 7. Route Lines Group
    const routeGroup = new THREE.Group();
    scene.add(routeGroup);
    routeLinesRef.current = routeGroup;

    // 8. Science Targets Group
    const targetGroup = new THREE.Group();
    scene.add(targetGroup);
    targetMarkersRef.current = targetGroup;

    // Populate Science Target Markers
    JEZERO_SCIENCE_TARGETS.forEach((target) => {
      const pos = latLonToJezeroVector(target.coordinate.lat, target.coordinate.lon, target.coordinate.elevationMeters);
      
      const markerRoot = new THREE.Group();
      markerRoot.position.copy(pos);
      markerRoot.userData = { targetId: target.id, targetName: target.name };

      // Pin stem
      const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 1.25;
      markerRoot.add(stem);

      // Pin Head (Beacon)
      const headGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({
        color: target.targetType === 'DELTAIC_STRATIGRAPHY' ? 0x06b6d4 : target.targetType === 'REGOLITH_HAZARD' ? 0xf59e0b : 0x10b981,
        emissive: 0x082f49,
        roughness: 0.3,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 2.5;
      markerRoot.add(head);

      targetGroup.add(markerRoot);
    });

    // 9. Astronaut Position Marker for Simulation
    const astroGroup = new THREE.Group();
    const beaconGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 1.5;
    astroGroup.add(beacon);

    // Pulse Ring
    const ringGeo = new THREE.RingGeometry(0.8, 1.2, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.2;
    astroGroup.add(ring);
    scene.add(astroGroup);
    astronautMarkerRef.current = astroGroup;

    // 10. Orbit Animation & Interaction Loop
    let animationFrameId: number;
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0.4;
    let cameraDistance = 42;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const dx = e.clientX - mouseX;
      const dy = e.clientY - mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      targetRotY += dx * 0.006;
      targetRotX = Math.max(0.1, Math.min(1.4, targetRotX + dy * 0.006));
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      cameraDistance = Math.max(12, Math.min(90, cameraDistance + e.deltaY * 0.03));
      e.preventDefault();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !threeCameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      threeCameraRef.current.aspect = w / h;
      threeCameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();

    const renderLoop = () => {
      const elapsedTime = clock.getElapsedTime();

      // Camera Orbit Spherical Positioning
      const camX = cameraDistance * Math.sin(targetRotY) * Math.cos(targetRotX);
      const camZ = cameraDistance * Math.cos(targetRotY) * Math.cos(targetRotX);
      const camY = cameraDistance * Math.sin(targetRotX);

      cameraObj.position.set(camX, camY, camZ);
      cameraObj.lookAt(0, 0, 0);

      // Rotate Global Mars slightly if in global mode
      if (globeSphereRef.current && globeSphereRef.current.visible) {
        globeSphereRef.current.rotation.y = elapsedTime * 0.05;
      }

      // Animate astronaut pulse ring
      if (ringMat) {
        ringMat.opacity = 0.3 + 0.3 * Math.sin(elapsedTime * 4.0);
        const scale = 1.0 + 0.2 * Math.sin(elapsedTime * 4.0);
        ring.scale.set(scale, scale, scale);
      }

      renderer.render(scene, cameraObj);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      globeTexture.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Route Polyline whenever routes or selected route changes
  useEffect(() => {
    if (!routeLinesRef.current) return;
    const group = routeLinesRef.current;
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    }

    if (candidateRoutes.length === 0) return;

    candidateRoutes.forEach((route, idx) => {
      const isSelected = idx === selectedRouteIndex;
      const points: THREE.Vector3[] = [];

      route.coordinates.forEach((c) => {
        const v = latLonToJezeroVector(c.lat, c.lon, c.elevationMeters);
        v.y += isSelected ? 0.35 : 0.15; // slightly elevated above terrain
        points.push(v);
      });

      if (points.length < 2) return;

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, points.length * 3, isSelected ? 0.18 : 0.08, 8, false);
      
      const routeColors: Record<string, number> = {
        FASTEST: 0x38bdf8,        // Cyan
        MIN_TERRAIN_RISK: 0x10b981, // Emerald
        SCIENCE_PRIORITY: 0xec4899, // Magenta
        BALANCED_MISSION: 0xf59e0b, // Amber
      };

      const color = routeColors[route.objective] || 0x38bdf8;
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: !isSelected,
        opacity: isSelected ? 1.0 : 0.4,
      });

      const tubeMesh = new THREE.Mesh(tubeGeo, mat);
      group.add(tubeMesh);
    });
  }, [candidateRoutes, selectedRouteIndex]);

  // Update Astronaut Marker during Simulation
  useEffect(() => {
    if (!astronautMarkerRef.current) return;
    const { currentCoordinate } = simulation;
    const pos = latLonToJezeroVector(currentCoordinate.lat, currentCoordinate.lon, currentCoordinate.elevationMeters);
    astronautMarkerRef.current.position.copy(pos);
    astronautMarkerRef.current.visible = true;

    setCrosshairCoord({
      lat: currentCoordinate.lat,
      lon: currentCoordinate.lon,
      elev: currentCoordinate.elevationMeters ?? -2540,
    });
  }, [simulation.currentCoordinate, simulation.isPlaying]);

  // Update Mode Visibility (Global vs Jezero)
  useEffect(() => {
    if (globeSphereRef.current) {
      globeSphereRef.current.visible = viewMode === 'global';
    }
    if (terrainMeshRef.current) {
      terrainMeshRef.current.visible = viewMode === 'jezero';
    }
    if (routeLinesRef.current) {
      routeLinesRef.current.visible = viewMode === 'jezero';
    }
    if (targetMarkersRef.current) {
      targetMarkersRef.current.visible = viewMode === 'jezero';
    }
    if (astronautMarkerRef.current) {
      astronautMarkerRef.current.visible = viewMode === 'jezero';
    }
  }, [viewMode]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#06080d]">
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Crosshair & Coordinate Telemetry Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1.5">
        <div className="hud-panel px-3 py-1.5 rounded border border-cyan-500/20 text-xs font-mono flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <LocateFixed className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-semibold tracking-wider">RETICLE:</span>
          </div>
          <span className="text-slate-200">
            {crosshairCoord ? formatMarsCoordinates(crosshairCoord) : '18.4412°N, 77.4520°E (-2540m)'}
          </span>
          <span className="text-zinc-500">|</span>
          <span className="text-cyan-300 font-semibold">
            {viewMode === 'jezero' ? 'JEZERO DELTA SECTOR' : 'MARS GLOBAL VIEW'}
          </span>
        </div>
      </div>

      {/* On-Map Quick Perspective Controls */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
        <button
          onClick={viewMode === 'jezero' ? focusGlobalMars : focusJezeroCrater}
          title={viewMode === 'jezero' ? 'Switch to Global Mars' : 'Focus Jezero Crater'}
          className="hud-panel p-2.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/20 transition-all shadow-lg pointer-events-auto flex items-center gap-2 text-xs font-mono font-medium"
        >
          <Compass className="w-4 h-4" />
          <span>{viewMode === 'jezero' ? 'GLOBAL ORBIT' : 'FOCUS JEZERO'}</span>
        </button>

        <button
          onClick={() => setActiveModal('provenance')}
          title="Open Data Provenance & Traceability Catalog"
          className="hud-panel p-2.5 rounded-lg border border-cyan-500/30 text-slate-300 hover:text-cyan-200 hover:border-cyan-400 hover:bg-cyan-500/20 transition-all shadow-lg pointer-events-auto flex items-center gap-2 text-xs font-mono"
        >
          <Info className="w-4 h-4 text-cyan-400" />
          <span>DATA CATALOG</span>
        </button>
      </div>

      {/* Target Pin Hover / Highlight Quick Peek */}
      {selectedScienceTarget && (
        <div className="absolute top-16 right-6 z-10 w-72 hud-panel p-3.5 rounded-lg border border-cyan-500/40 text-xs shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
            <span className="font-semibold text-cyan-300 font-mono tracking-wide">TARGET SELECTED</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
              {selectedScienceTarget.confidence} CONFIDENCE
            </span>
          </div>
          <p className="font-bold text-slate-100 text-sm mb-1">{selectedScienceTarget.name}</p>
          <p className="text-slate-300 line-clamp-2 text-[11px] mb-2">{selectedScienceTarget.description}</p>
          
          {selectedScienceTarget.mineralSignatures && selectedScienceTarget.mineralSignatures.length > 0 && (
            <div className="mb-2">
              <span className="text-[10px] text-zinc-400 block font-mono">SPECTRAL MINERALOGY:</span>
              <span className="text-emerald-400 text-[11px] font-mono">{selectedScienceTarget.mineralSignatures[0]}</span>
            </div>
          )}

          <button
            onClick={() => setActiveModal('science')}
            className="w-full mt-1 py-1.5 px-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 rounded text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>FULL GEOLOGICAL DOSSIER</span>
          </button>
        </div>
      )}

      {/* Active Route Objective Quick Badge */}
      <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
        {candidateRoutes[selectedRouteIndex] && (
          <div className="hud-panel px-3.5 py-2 rounded-lg border border-amber-500/30 text-xs font-mono flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <div>
              <span className="text-zinc-400 text-[10px] block">ACTIVE CANDIDATE ROUTE:</span>
              <span className="text-amber-300 font-bold tracking-wide">
                {candidateRoutes[selectedRouteIndex].name}
              </span>
            </div>
            <span className="text-zinc-500">|</span>
            <div>
              <span className="text-zinc-400 text-[10px] block">DISTANCE:</span>
              <span className="text-slate-200 font-semibold">
                {candidateRoutes[selectedRouteIndex].metrics.distance2dKm} km
              </span>
            </div>
            <span className="text-zinc-500">|</span>
            <div>
              <span className="text-zinc-400 text-[10px] block">EST. TIME:</span>
              <span className="text-slate-200 font-semibold">
                {candidateRoutes[selectedRouteIndex].metrics.estimatedDurationMinutes} min
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
