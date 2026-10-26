'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import CarModel from '@/components/three/CarModel';
import SceneLighting from '@/components/three/SceneLighting';
import GroundPlane from '@/components/three/GroundPlane';
import type { CarDefinition } from '@/types/car';

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
        far: 100,
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
        <CarModel model={model} />
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
