import React, { createElement } from "react";

import { cn } from "~/lib/utils";

export const SubHeading: React.FCC<{
  className?: string;
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}> = ({ children, className, as = "h2" }) => {
  const span = (
    <span
      className={cn(
        "flex flex-col space-y-1 bg-gradient-to-br text-xl",
        "dark:from-white dark:via-gray-300 lg:text-2xl",
        "bg-clip-text text-gray-500 dark:to-gray-400",
        "font-normal dark:text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );

  return createElement(as, {}, span);
};
