"use client";

import React from "react";

import { XR as NativeXR } from "@react-three/xr";

import { xrStore } from "~/lib/xr-store";

export function XR({ children }: React.PropsWithChildren) {
  if (!xrStore) {
    return children;
  }

  return <NativeXR store={xrStore}>{children}</NativeXR>;
}
