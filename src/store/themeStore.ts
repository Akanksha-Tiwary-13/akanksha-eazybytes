import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  accentColor: string;
  initFromSettings: (mode: ThemeMode, accentColor: string) => void;
  toggleMode: () => void;
  setAccentColor: (color: string) => void;
}

const STORAGE_KEY = "portfolio-theme-mode";

function applyMode(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

function applyAccent(color: string) {
  document.documentElement.style.setProperty("--color-accent", color);
}

const storedMode = (typeof localStorage !== "undefined"
  ? (localStorage.getItem(STORAGE_KEY) as ThemeMode | null)
  : null) ?? "dark";

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: storedMode,
  accentColor: "#6366f1",
  initFromSettings: (mode, accentColor) => {
    const hasVisitorOverride = typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY);
    const resolvedMode = hasVisitorOverride ? get().mode : mode;
    set({ mode: resolvedMode, accentColor });
    applyMode(resolvedMode);
    applyAccent(accentColor);
  },
  toggleMode: () => {
    const next = get().mode === "dark" ? "light" : "dark";
    set({ mode: next });
    applyMode(next);
    localStorage.setItem(STORAGE_KEY, next);
  },
  setAccentColor: (color) => {
    set({ accentColor: color });
    applyAccent(color);
  },
}));

applyMode(storedMode);
