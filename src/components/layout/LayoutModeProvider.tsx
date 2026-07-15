import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LAYOUT_MODE, LAYOUT_MODE_STORAGE_KEY, type LayoutMode } from "./layout-constants";

export { LAYOUT_MODE_STORAGE_KEY, DEFAULT_LAYOUT_MODE };
export type { LayoutMode };

type LayoutModeContextValue = {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleLayoutMode: () => void;
};

const LayoutModeContext = createContext<LayoutModeContextValue | null>(null);

export function LayoutModeProvider({ children }: { children: ReactNode }) {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(DEFAULT_LAYOUT_MODE);

  useEffect(() => {
    const stored = window.localStorage.getItem(LAYOUT_MODE_STORAGE_KEY);
    if (stored === "sidebar" || stored === "topnav") {
      setLayoutModeState(stored);
    }
  }, []);

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setLayoutModeState(mode);
    window.localStorage.setItem(LAYOUT_MODE_STORAGE_KEY, mode);
  }, []);

  const toggleLayoutMode = useCallback(() => {
    setLayoutMode(layoutMode === "sidebar" ? "topnav" : "sidebar");
  }, [layoutMode, setLayoutMode]);

  return (
    <LayoutModeContext.Provider value={{ layoutMode, setLayoutMode, toggleLayoutMode }}>
      {children}
    </LayoutModeContext.Provider>
  );
}

export function useLayoutMode() {
  const ctx = useContext(LayoutModeContext);
  if (!ctx) throw new Error("useLayoutMode must be used within a LayoutModeProvider");
  return ctx;
}
