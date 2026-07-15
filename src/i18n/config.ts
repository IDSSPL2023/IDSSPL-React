import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";
import gu from "./locales/gu.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";

// The UI is bilingual: the LEFT side of every label is always English,
// and the RIGHT (secondary) side is one of the languages below. The active
// i18n language therefore controls only the secondary/right-hand text.
export const LANGUAGES = [
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिंदी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "en", label: "English" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

// The primary/left-hand language is fixed to English.
export const PRIMARY_LANGUAGE: LanguageCode = "en";

// Default secondary/right-hand language (matches the app's original look).
export const DEFAULT_SECONDARY_LANGUAGE: LanguageCode = "mr";

export const STORAGE_KEY = "idsspl.lang";

export const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  gu: { translation: gu },
  ta: { translation: ta },
  te: { translation: te },
} as const;

// Guard against re-initialising during Fast Refresh / repeated imports.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_SECONDARY_LANGUAGE,
    fallbackLng: "en",
    supportedLngs: LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false }, // React already escapes.
    returnNull: false,
  });
}

export default i18n;
