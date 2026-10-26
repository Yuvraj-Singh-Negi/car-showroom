'use client';

import { SpotLight } from '@react-three/drei';

/**
 * Restrained studio lighting. A single key directional light plus a
 * soft fill keeps the white background clean while giving the car
 * gentle modelling and contact with the ground.
 */
const SceneLighting = () => (
  <>
    <ambientLight intensity={0.55} />

    <directionalLight
      position={[5, 9, 4]}
      intensity={1.6}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-left={-6}
      shadow-camera-right={6}
      shadow-camera-top={8}
      shadow-camera-bottom={-2}
    />

    <SpotLight
      position={[-4, 6, 4]}
      intensity={2.5}
      angle={0.45}
      penumbra={0.8}
      distance={25}
      castShadow
    />
  </>
);

export default SceneLighting;
