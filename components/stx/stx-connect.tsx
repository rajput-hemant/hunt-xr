"use client";

import { Connect } from "@stacks/connect-react";

import { siteConfig } from "~/config/site";
import { userSession } from "~/lib/user-session";

export function StxConnect({ children }: React.PropsWithChildren) {
  return (
    <Connect
      authOptions={{
        userSession,
        appDetails: {
          name: siteConfig.name,
          icon: siteConfig.url + "/logo.png",
        },
      }}
    >
      {children}
    </Connect>
  );
}
