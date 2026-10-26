'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { SkeletonUtils } from 'three-stdlib';
import type { Group } from 'three';
import type { CarDefinition } from '@/types/car';

interface CarModelProps {
  model: CarDefinition;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Reusable vehicle model component.
 *
 * - Loads the GLB via Drei's useGLTF (cached across mounts).
 * - Clones the scene so the same cached asset can be mounted multiple
 *   times without mutation problems.
 * - Preserves original material assignments by default.
 * - Accepts per-model scale, position, and rotation.
 *
 * The model's actual scale, origin, and wheel-ground alignment are
 * configured through the CarDefinition rather than being arbitrarily
 * normalized.
 */
export default function CarModel({
  model,
  scale = model.modelScale,
  position = [0, 0, 0],
  rotation = model.initialRotation,
}: CarModelProps) {
  const { scene } = useGLTF(model.modelPath);

  const clonedScene = useMemo(() => {
    return SkeletonUtils.clone(scene) as Group;
  }, [scene]);

  return (
    <primitive
      object={clonedScene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}
