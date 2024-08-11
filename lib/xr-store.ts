import { createXRStore } from "@react-three/xr";

export const xrStore =
  typeof window !== "undefined" ? createXRStore({ depthSensing: true }) : null;
