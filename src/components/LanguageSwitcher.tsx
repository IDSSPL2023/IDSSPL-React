import { useTranslation } from "react-i18next";
import { LANGUAGES, STORAGE_KEY, type LanguageCode } from "@/i18n/config";

/**
 * Small dropdown to change the active UI language.
 * Persists the choice to localStorage so it survives reloads.
 */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();

  const handleChange = (code: LanguageCode) => {
    void i18n.changeLanguage(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, code);
    }
  };

  return (
    <select
      aria-label="Select language"
      value={i18n.language?.split("-")[0] ?? "en"}
      onChange={(e) => handleChange(e.target.value as LanguageCode)}
      className={`rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${className}`}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
