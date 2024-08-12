"use client";

import { OrbitControls } from "@react-three/drei";

export function Common() {
  return (
    <>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={0.5} castShadow />
    </>
  );
}
