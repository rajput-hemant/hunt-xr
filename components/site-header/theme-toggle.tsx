"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "../ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="lg"
      round
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="*:p-4"
    >
      {theme === "dark" ?
        <Sun strokeWidth={1.5} />
      : <Moon strokeWidth={1.5} />}
    </Button>
  );
}
