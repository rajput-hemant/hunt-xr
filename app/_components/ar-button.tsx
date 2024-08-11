"use client";

import React from "react";

import { Button } from "~/components/ui/button";
import { xrStore } from "~/lib/xr-store";

export function ARButton() {
  const [isPresenting, setIsPresenting] = React.useState(false);

  React.useEffect(() => {
    if (!xrStore) return;

    const unsubscribe = xrStore.subscribe(({ session }) => {
      setIsPresenting(!!session);
    });

    return () => unsubscribe();
  }, []);

  if (isPresenting) return null;

  return (
    <Button onClick={() => xrStore?.enterAR()} className="absolute top-10 z-50">
      Enter AR
    </Button>
  );
}
