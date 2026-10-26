'use client';

import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useCallback, useRef } from 'react';
import { Box3, Vector3, type Object3D } from 'three';
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

interface ViewerSceneProps {
  model: CarDefinition;
  viewMode: VehicleViewMode;
  bindControls: (controls: OrbitControlsImpl) => void;
  onModelReady?: (boundingBox: { min: [number, number, number]; max: [number, number, number]; size: number }) => void;
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

  // Compute the model's bounding box once it loads and frame the camera
  // so the vehicle is properly sized regardless of the source GLB scale.
  useFrame(() => {
    if (framed.current || !modelRef.current) return;

    const box = new Box3().setFromObject(modelRef.current);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const diameter = Math.max(maxDim, 0.1);

    framed.current = true;

    if (onModelReady) {
      onModelReady({
        min: [center.x, center.y, center.z],
        max: [center.x, center.y, center.z],
        size: diameter,
      });
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
