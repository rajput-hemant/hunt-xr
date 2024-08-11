import React from "react";

import { Common } from "~/components/canvas/common";
import { View } from "~/components/canvas/view";
import { XR } from "~/components/canvas/xr";

import { ARButton } from "./_components/ar-button";
import { Cube } from "./_components/cube";

export default function HomePage() {
  return (
    <div className="grid h-dvh place-items-center">
      <ARButton />

      <View className="absolute inset-0">
        <Common />
        <XR>
          <Cube />
        </XR>
      </View>
    </div>
  );
}
