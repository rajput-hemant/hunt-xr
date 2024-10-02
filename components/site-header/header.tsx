"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { useEventListener } from "~/hooks/use-event-listner";
import { cn } from "~/lib/utils";

const excludePaths = ["/login", "/onboarding"];

export const Header: React.FCC = ({ children }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  const pathname = usePathname();

  useEventListener("scroll", () => {
    if (window.scrollY >= 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 sm:inset-x-2 sm:top-4 xl:inset-x-0",
        excludePaths.includes(pathname) && "hidden",
      )}
    >
      <div
        className={cn(
          "container block w-full border-b-2 border-foreground px-3 py-0.5 shadow-md transition-colors duration-200 ease-out sm:rounded-full sm:border",
          isScrolled && "-translate-y-24 transition-transform duration-300",
        )}
      >
        {children}
      </div>
    </header>
  );
};
