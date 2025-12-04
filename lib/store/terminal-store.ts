import { create } from "zustand";
import { TerminalLine, Theme } from "@/types";

interface TerminalState {
  lines: TerminalLine[];
  commandHistory: string[];
  historyIndex: number;
  theme: Theme;
  addLine: (line: TerminalLine) => void;
  addCommand: (command: string) => void;
  clearLines: () => void;
  setTheme: (theme: Theme) => void;
  navigateHistory: (direction: "up" | "down") => string | null;
  resetHistoryIndex: () => void;
}

// Default terminal theme
const defaultTheme: Theme = {
  name: "default",
  colors: {
    background: "#0a0e27",
    text: "#e0e0e0",
    accent: "#00ff9f",
    error: "#ff6b6b",
    success: "#51cf66",
  },
};

// Predefined themes
export const themes: Record<string, Theme> = {
  default: defaultTheme,
  cyberpunk: {
    name: "cyberpunk",
    colors: {
      background: "#0d0221",
      text: "#f72585",
      accent: "#7209b7",
      error: "#ff006e",
      success: "#4cc9f0",
    },
  },
  matrix: {
    name: "matrix",
    colors: {
      background: "#000000",
      text: "#00ff00",
      accent: "#00ff00",
      error: "#ff0000",
      success: "#00ff00",
    },
  },
  dracula: {
    name: "dracula",
    colors: {
      background: "#282a36",
      text: "#f8f8f2",
      accent: "#bd93f9",
      error: "#ff5555",
      success: "#50fa7b",
    },
  },
};

export const useTerminalStore = create<TerminalState>((set, get) => ({
  lines: [],
  commandHistory: [],
  historyIndex: -1,
  theme: defaultTheme,

  addLine: (line) =>
    set((state) => ({
      lines: [...state.lines, line],
    })),

  addCommand: (command) =>
    set((state) => ({
      commandHistory: [...state.commandHistory, command],
      historyIndex: -1, // Reset history index after adding new command
    })),

  clearLines: () =>
    set({
      lines: [],
    }),

  setTheme: (theme) => {
    set({ theme });

    // Apply theme to CSS variables
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--color-terminal-background", theme.colors.background);
      root.style.setProperty("--color-terminal-text", theme.colors.text);
      root.style.setProperty("--color-terminal-accent", theme.colors.accent);
      root.style.setProperty("--color-terminal-error", theme.colors.error);
      root.style.setProperty("--color-terminal-success", theme.colors.success);
    }
  },

  navigateHistory: (direction) => {
    const state = get();
    const { commandHistory, historyIndex } = state;

    if (commandHistory.length === 0) return null;

    let newIndex = historyIndex;

    if (direction === "up") {
      // Move backwards in history (older commands)
      if (historyIndex === -1) {
        newIndex = commandHistory.length - 1;
      } else if (historyIndex > 0) {
        newIndex = historyIndex - 1;
      }
    } else if (direction === "down") {
      // Move forwards in history (newer commands)
      if (historyIndex === -1) {
        return null;
      } else if (historyIndex < commandHistory.length - 1) {
        newIndex = historyIndex + 1;
      } else {
        // At the end of history, return empty string
        set({ historyIndex: -1 });
        return "";
      }
    }

    set({ historyIndex: newIndex });
    return commandHistory[newIndex] || null;
  },

  resetHistoryIndex: () =>
    set({
      historyIndex: -1,
    }),
}));
