'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Box3, type Object3D, Vector3 } from 'three';
import CarModel from '@/components/three/CarModel';
import SceneLighting from '@/components/three/SceneLighting';
import GroundPlane from '@/components/three/GroundPlane';
import type { CarDefinition } from '@/types/car';

/**
 * Computes the model's bounding box after load and reframes the camera
 * so the vehicle is properly sized regardless of the source GLB scale.
 * Must be rendered inside <Canvas> for useFrame/useThree to work.
 */
function ModelFramer({ model }: { model: CarDefinition }) {
  const camera = useThree((state) => state.camera);
  const modelRef = useRef<Object3D | null>(null);
  const framed = useRef(false);

  useFrame(() => {
    if (framed.current || !modelRef.current) return;

    const box = new Box3().setFromObject(modelRef.current);
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.1);

    framed.current = true;

    const distance = Math.min(Math.max(maxDim * 2.2, 4), 10);
    const height = 1.2 + maxDim * 0.4;

    camera.position.set(0, height, distance);
    camera.lookAt(0, maxDim * 0.35, 0);
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
