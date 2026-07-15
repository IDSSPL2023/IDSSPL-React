import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Only active in development builds. In production this is compile-time false,
// so the whole debug feature tree-shakes away.
const IS_DEV = import.meta.env.DEV;
const STORAGE_KEY = "idsspl.i18nShowKeys";

type I18nDebugValue = {
  /** True only in dev builds — gate any debug UI on this. */
  enabled: boolean;
  /** When true, translation helpers render the key ID instead of the text. */
  showKeys: boolean;
  toggle: () => void;
  setShowKeys: (value: boolean) => void;
};

const I18nDebugContext = createContext<I18nDebugValue>({
  enabled: false,
  showKeys: false,
  toggle: () => {},
  setShowKeys: () => {},
});

export function useI18nDebug() {
  return useContext(I18nDebugContext);
}

export function I18nDebugProvider({ children }: { children: ReactNode }) {
  const [showKeys, setShowKeysState] = useState(false);

  useEffect(() => {
    if (!IS_DEV || typeof window === "undefined") return;
    setShowKeysState(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const setShowKeys = useCallback((value: boolean) => {
    setShowKeysState(value);
    if (IS_DEV && typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    }
  }, []);

  const toggle = useCallback(() => setShowKeys(!showKeys), [showKeys, setShowKeys]);

  return (
    <I18nDebugContext.Provider
      value={{ enabled: IS_DEV, showKeys: IS_DEV && showKeys, toggle, setShowKeys }}
    >
      {children}
    </I18nDebugContext.Provider>
  );
}
