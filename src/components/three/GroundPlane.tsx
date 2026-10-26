'use client';

import * as THREE from 'three';

/**
 * Large, very light ground plane that receives contact shadows so the
 * car feels grounded without a visible floor competing for attention.
 * Kept subtle and tinted near-white so it blends into the background.
 */
const GroundPlane = ({ color = 0xf7f7f5 }: { color?: number }) => {
  const geometry = new THREE.PlaneGeometry(40, 40);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9,
    metalness: 0,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.02;
  mesh.receiveShadow = true;
  return <primitive object={mesh} />;
};

export default GroundPlane;
