'use client';

import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import CarModel from '@/components/three/CarModel';
import SceneLighting from '@/components/three/SceneLighting';
import GroundPlane from '@/components/three/GroundPlane';
import type { CarDefinition } from '@/types/car';

export type VehicleViewMode = 'exterior' | 'interior' | 'close-up';

const VIEW_TARGETS: Record<VehicleViewMode, [number, number, number]> = {
  exterior: [0, 0.8, 0],
  interior: [0, 1.0, 0],
  'close-up': [0, 1.1, 0],
};

interface ViewerSceneProps {
  model: CarDefinition;
  viewMode: VehicleViewMode;
  bindControls: (controls: OrbitControlsImpl) => void;
}

export default function ViewerScene({
  model,
  viewMode,
  bindControls,
}: ViewerSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const target = VIEW_TARGETS[viewMode];

  // Bind the mounted controls instance to the zoom controller via a
  // callback ref so the zoom buttons drive the same OrbitControls.
  const bindRef = (instance: OrbitControlsImpl | null) => {
    controlsRef.current = instance;
    if (instance) bindControls(instance);
  };

  return (
    <>
      <color attach="background" args={['#ffffff']} />

      <GroundPlane color={0xf7f7f5} />
      <SceneLighting />

      <Suspense fallback={null}>
        <Environment preset="studio" />
        <CarModel model={model} />
      </Suspense>

      <OrbitControls
        ref={bindRef}
        enableRotate
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        minDistance={3.5}
        maxDistance={12}
        target={target}
        makeDefault
      />
    </>
  );
}
