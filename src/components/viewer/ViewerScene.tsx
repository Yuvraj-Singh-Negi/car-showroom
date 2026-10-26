'use client';

import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useCallback, useRef } from 'react';
import { Box3, type Object3D, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
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

/** Target size for the vehicle's largest dimension (in world units). */
const TARGET_MAX_DIM = 4.5;

interface ViewerSceneProps {
  model: CarDefinition;
  viewMode: VehicleViewMode;
  bindControls: (controls: OrbitControlsImpl) => void;
  onModelReady?: (box: { size: number }) => void;
}

export default function ViewerScene({
  model,
  viewMode,
  bindControls,
  onModelReady,
}: ViewerSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const modelRef = useRef<Object3D | null>(null);
  const target = VIEW_TARGETS[viewMode];
  const framed = useRef(false);

  // Bind the mounted controls instance to the zoom controller via a
  // callback ref so the zoom buttons drive the same OrbitControls.
  const bindRef = useCallback(
    (instance: OrbitControlsImpl | null) => {
      controlsRef.current = instance;
      if (instance) bindControls(instance);
    },
    [bindControls],
  );

  // Compute the model's bounding box once it loads, scale it to a proper
  // display size, and notify the parent so the camera can be reframed.
  useFrame(() => {
    if (framed.current || !modelRef.current || !onModelReady) return;

    try {
      const box = new Box3().setFromObject(modelRef.current);
      const size = box.getSize(new Vector3());
      const maxDim = Math.max(size.x, size.y, size.z, 0.1);

      if (!isFinite(maxDim) || maxDim <= 0) return;

      // Scale the model so its largest dimension matches TARGET_MAX_DIM.
      const scale = TARGET_MAX_DIM / maxDim;
      modelRef.current.scale.set(scale, scale, scale);
      modelRef.current.updateMatrixWorld();

      framed.current = true;
      onModelReady({ size: TARGET_MAX_DIM });
    } catch {
      framed.current = true;
    }
  });

  return (
    <>
      <color attach="background" args={['#ffffff']} />

      <GroundPlane color={0xf7f7f5} />
      <SceneLighting />

      <Suspense fallback={null}>
        <Environment preset="studio" />
        <CarModel model={model} ref={modelRef} />
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
      />
    </>
  );
}
