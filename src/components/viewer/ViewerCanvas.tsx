'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { Camera } from 'three';
import ViewerScene from './ViewerScene';
import type { CarDefinition } from '@/types/car';

export type VehicleViewMode = 'exterior' | 'interior' | 'close-up';

const VIEW_POSITIONS: Record<
  VehicleViewMode,
  [number, number, number]
> = {
  exterior: [0, 1.6, 7],
  interior: [0, 1.1, 2.2],
  'close-up': [0, 1.4, 3.2],
};

interface ViewerCanvasProps {
  model: CarDefinition;
  viewMode: VehicleViewMode;
  bindCamera: (camera: Camera) => void;
  bindControls: (controls: import('three-stdlib').OrbitControls) => void;
}

export default function ViewerCanvas({
  model,
  viewMode,
  bindCamera,
  bindControls,
}: ViewerCanvasProps) {
  const camera = useThree((state) => state.camera as Camera);

  // Expose the live camera to the zoom controller.
  useEffect(() => {
    bindCamera(camera);
  }, [camera, bindCamera]);

  return (
    <Canvas
      camera={{
        position: VIEW_POSITIONS[viewMode],
        fov: 35,
        near: 0.1,
        far: 100,
      }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <ViewerScene
        model={model}
        viewMode={viewMode}
        bindControls={bindControls}
      />
    </Canvas>
  );
}
