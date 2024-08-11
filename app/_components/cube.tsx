"use client";

import React from "react";

export function Cube() {
  const [red, setRed] = React.useState(false);

  return (
    <mesh
      pointerEventsType={{ deny: "grab" }}
      onClick={() => setRed(!red)}
      position={[0, 0, 0]}
    >
      <boxGeometry />
      <meshBasicMaterial color={red ? "red" : "blue"} />
    </mesh>
  );
}
