'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useCallback, useEffect } from 'react';
import type { PerspectiveCamera } from 'three';
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
  bindCamera: (camera: PerspectiveCamera) => void;
  bindControls: (controls: import('three-stdlib').OrbitControls) => void;
}

export default function ViewerCanvas({
  model,
  viewMode,
  bindCamera,
  bindControls,
}: ViewerCanvasProps) {
  const camera = useThree((state) => state.camera as PerspectiveCamera);

  // Expose the live camera to the zoom controller.
  useEffect(() => {
    bindCamera(camera);
  }, [camera, bindCamera]);

  // Reframe the camera to the model's bounding box once it loads so the
  // vehicle is properly sized regardless of the source GLB scale.
  const reframe = useCallback(
    (box: { size: number }) => {
      const maxDim = Math.max(box.size, 0.1);
      const distance = Math.min(Math.max(maxDim * 2.2, 3.5), 12);
      const height = 1.2 + maxDim * 0.4;

      camera.position.set(0, height, distance);
      camera.lookAt(0, maxDim * 0.35, 0);
      camera.updateProjectionMatrix();
    },
    [camera],
  );

  return (
    <Canvas
      camera={{
        position: VIEW_POSITIONS[viewMode],
        fov: 35,
        near: 0.1,
        far: 200,
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
        onModelReady={reframe}
      />
    </Canvas>
  );
}
