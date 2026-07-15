import { useI18nDebug } from "./I18nDebugContext";

/**
 * Dev-only floating button. Sits in the bottom-right corner as a small key
 * chip, expands on hover, and toggles "show key IDs" mode across the app so
 * every translated string is replaced by its i18n key (e.g. accountMaster.title).
 * Renders nothing in production builds.
 */
export default function I18nKeyToggle() {
  const { enabled, showKeys, toggle } = useI18nDebug();
  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      title="Dev only: toggle i18n key IDs"
      aria-pressed={showKeys}
      className={`group fixed bottom-4 right-4 z-[9999] flex items-center gap-2 overflow-hidden rounded-full border px-3 py-2 text-xs font-semibold shadow-lg transition-all duration-200 ${
        showKeys
          ? "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-600 dark:bg-emerald-600"
          : "border-gray-300 bg-white/90 text-gray-600 opacity-60 hover:opacity-100 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400"
      }`}
    >
      <span className="text-sm leading-none">🔑</span>
      <span className="max-w-0 whitespace-nowrap opacity-0 transition-all duration-200 group-hover:max-w-[140px] group-hover:opacity-100">
        {showKeys ? "IDs: ON — click to hide" : "Show i18n IDs"}
      </span>
    </button>
  );
}
