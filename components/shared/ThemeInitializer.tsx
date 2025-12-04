"use client";

import { useEffect } from "react";
import { useTerminalStore } from "@/lib/store/terminal-store";

/**
 * ThemeInitializer component to apply theme CSS variables on mount
 */
export default function ThemeInitializer() {
  const { theme, setTheme } = useTerminalStore();

  useEffect(() => {
    // Initialize theme on mount
    setTheme(theme);
  }, [theme, setTheme]);

  return null;
}
