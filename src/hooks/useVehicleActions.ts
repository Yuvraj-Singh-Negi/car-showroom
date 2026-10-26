'use client';

import type { VehicleActions } from '@/types/car';

/**
 * Placeholder vehicle actions. These are integration points for future
 * GLB animation clips (doors, lights, engine). None of them pretend to
 * work on the supplied model until the required animation objects exist.
 */
export function useVehicleActions(): VehicleActions {
  const openDoors = () => {
    // TODO: Trigger the appropriate door animation clip discovered from
    // the loaded GLB (e.g. via Drei's useAnimations + mixer).
    console.warn('[AURA] openDoors: animation not configured');
  };

  const toggleLights = () => {
    // TODO: Toggle compatible vehicle light objects or emissive materials.
    console.warn('[AURA] toggleLights: animation not configured');
  };

  const startEngine = () => {
    // TODO: Trigger engine animation / audio integration.
    console.warn('[AURA] startEngine: animation not configured');
  };

  return { openDoors, toggleLights, startEngine };
}
