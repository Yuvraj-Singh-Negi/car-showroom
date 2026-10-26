'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Box3, type Object3D, Vector3 } from 'three';
import CarModel from '@/components/three/CarModel';
import SceneLighting from '@/components/three/SceneLighting';
import GroundPlane from '@/components/three/GroundPlane';
import type { CarDefinition } from '@/types/car';

/** Target size for the vehicle's largest dimension (in world units). */
const TARGET_MAX_DIM = 4.5;

/**
 * Computes the model's bounding box after load, scales it to a proper
 * display size, and reframes the camera so the vehicle is well-framed
 * regardless of the source GLB's original scale. Must be inside <Canvas>.
 */
function ModelFramer({ model }: { model: CarDefinition }) {
  const camera = useThree((state) => state.camera);
  const modelRef = useRef<Object3D | null>(null);
  const framed = useRef(false);

  useFrame(() => {
    if (framed.current || !modelRef.current) return;

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

      // Reframe the camera to the scaled model.
      const distance = Math.min(Math.max(TARGET_MAX_DIM * 2.2, 4), 10);
      const height = 1.2 + TARGET_MAX_DIM * 0.4;

      camera.position.set(0, height, distance);
      camera.lookAt(0, TARGET_MAX_DIM * 0.35, 0);
    } catch {
      framed.current = true;
    }
  });

  return <CarModel model={model} ref={modelRef} />;
}

interface GalleryCanvasProps {
  model: CarDefinition;
}

export default function GalleryCanvas({ model }: GalleryCanvasProps) {
  return (
    <Canvas
      camera={{
        position: [0, 1.6, 7],
        fov: 35,
        near: 0.1,
        far: 200,
      }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      }}
    >
      <color attach="background" args={['#ffffff']} />

      <GroundPlane color={0xf7f7f5} />

      <SceneLighting />

      <Suspense fallback={null}>
        <Environment preset="studio" />
        <ModelFramer model={model} />
        <ContactShadows
          position={[0, -0.02, 0]}
          opacity={0.22}
          scale={14}
          blur={2}
          far={6}
        />
      </Suspense>
    </Canvas>
  );
}
