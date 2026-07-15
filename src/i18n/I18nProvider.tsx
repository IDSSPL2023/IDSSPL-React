import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { STORAGE_KEY, type LanguageCode } from "./config";
import { I18nDebugProvider } from "./I18nDebugContext";
import I18nKeyToggle from "./I18nKeyToggle";

type Props = { children: ReactNode };

/**
 * Wraps the app in the i18next context and restores the user's saved
 * language on mount (client-side only, so SSR always starts from `en`).
 */
export default function I18nProvider({ children }: Props) {
  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? (window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null)
        : null;
    if (saved && saved !== i18n.language) {
      void i18n.changeLanguage(saved);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <I18nDebugProvider>
        {children}
        <I18nKeyToggle />
      </I18nDebugProvider>
    </I18nextProvider>
  );
}
