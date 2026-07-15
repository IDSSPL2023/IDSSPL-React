import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DARK_MODE_STORAGE_KEY, DEFAULT_PRIMARY_COLOR, THEME_STORAGE_KEY } from "./theme-constants";

export { THEME_STORAGE_KEY, DEFAULT_PRIMARY_COLOR, DARK_MODE_STORAGE_KEY };

type ThemeContextValue = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  resetPrimaryColor: () => void;
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const applyPrimaryColor = (color: string) => {
  document.documentElement.style.setProperty("--primary", color);
};

const applyDarkMode = (isDark: boolean) => {
  document.documentElement.classList.toggle("dark", isDark);
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState(DEFAULT_PRIMARY_COLOR);
  const [isDarkMode, setIsDarkModeState] = useState(false);

  // Sync with whatever the no-FOUC inline script (see layout.tsx) already
  // applied from localStorage before React hydrated.
  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) setPrimaryColorState(stored);

    const storedDark = window.localStorage.getItem(DARK_MODE_STORAGE_KEY);
    setIsDarkModeState(storedDark === "true");
  }, []);

  const setPrimaryColor = useCallback((color: string) => {
    setPrimaryColorState(color);
    applyPrimaryColor(color);
    window.localStorage.setItem(THEME_STORAGE_KEY, color);
  }, []);

  const resetPrimaryColor = useCallback(() => {
    setPrimaryColor(DEFAULT_PRIMARY_COLOR);
  }, [setPrimaryColor]);

  const setDarkMode = useCallback((value: boolean) => {
    setIsDarkModeState(value);
    applyDarkMode(value);
    window.localStorage.setItem(DARK_MODE_STORAGE_KEY, String(value));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!isDarkMode);
  }, [isDarkMode, setDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        resetPrimaryColor,
        isDarkMode,
        setDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
