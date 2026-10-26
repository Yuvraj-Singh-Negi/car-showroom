'use client';

import { useCallback, useRef, useState } from 'react';
import type { Camera } from 'three';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export interface CameraZoomOptions {
  minDistance: number;
  maxDistance: number;
  step: number;
  defaultDistance: number;
}

/**
 * Single source of truth for camera zoom distance.
 *
 * OrbitControls handles rotation (zoom disabled on the controls) while
 * the +/- buttons drive the camera distance directly, moving the camera
 * along the current view direction and clamping to [minDistance, maxDistance].
 *
 * Each button press reads the *actual* camera-to-target distance so zoom
 * stays accurate even after the user has dragged the camera.
 */
export function useCameraZoom({
  minDistance,
  maxDistance,
  step,
  defaultDistance,
}: CameraZoomOptions) {
  const [distance, setDistance] = useState(defaultDistance);
  const cameraRef = useRef<Camera | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const bindCamera = useCallback((camera: Camera) => {
    cameraRef.current = camera;
  }, []);

  const bindControls = useCallback((controls: OrbitControlsImpl) => {
    controlsRef.current = controls;
  }, []);

  const clamp = useCallback(
    (value: number) =>
      Math.min(Math.max(value, minDistance), maxDistance),
    [minDistance, maxDistance],
  );

  /** Read the true camera-to-target distance from the live camera. */
  const getCurrentDistance = useCallback((): number => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return defaultDistance;
    return camera.position.distanceTo(controls.target);
  }, [defaultDistance]);

  const moveToDistance = useCallback(
    (targetDistance: number) => {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) return;

      const d = clamp(targetDistance);
      const direction = new Vector3()
        .subVectors(camera.position, controls.target)
        .normalize();

      camera.position.copy(controls.target).addScaledVector(direction, d);
      camera.lookAt(controls.target);
      controls.update();

      setDistance(d);
    },
    [clamp],
  );

  const zoomIn = useCallback(() => {
    moveToDistance(getCurrentDistance() - step);
  }, [getCurrentDistance, moveToDistance, step]);

  const zoomOut = useCallback(() => {
    moveToDistance(getCurrentDistance() + step);
  }, [getCurrentDistance, moveToDistance, step]);

  return {
    distance,
    minDistance,
    maxDistance,
    step,
    zoomIn,
    zoomOut,
    bindCamera,
    bindControls,
    getCurrentDistance,
    isAtMin: distance <= minDistance,
    isAtMax: distance >= maxDistance,
  };
}
