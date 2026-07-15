import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_LANGUAGE } from "./config";
import { useI18nDebug } from "./I18nDebugContext";

/** Simplified translator signature used across the app. */
export type Translate = (key: string, options?: Record<string, unknown>) => string;

/**
 * Helper for the app's bilingual UI.
 *
 *  - `en`   -> always-English (left / primary side of a label).
 *  - `t`    -> the selected secondary language (right side). Returns an EMPTY
 *              string when the selected language is English, so the duplicated
 *              right-hand label collapses and only the English text shows.
 *  - `tRaw` -> the selected language including English (use for standalone text
 *              like placeholders, where an empty string would be wrong).
 *  - `isEnglish` -> true when the selected language is English.
 *
 * When the dev-only "show key IDs" toggle is on, the helpers return the key
 * itself (e.g. "accountMaster.title") so you can see the mapping.
 *
 * Example:
 *   const { en, t } = useBilingual();
 *   {en("fields.accountCode")}
 *   {t("fields.accountCode") && <span> / {t("fields.accountCode")}</span>}
 */
export function useBilingual() {
  const { t: tRawI18n, i18n } = useTranslation();
  const { showKeys } = useI18nDebug();

  const enRaw = useMemo(() => i18n.getFixedT(PRIMARY_LANGUAGE), [i18n]);

  const active = (i18n.language || "").split("-")[0];
  const isEnglish = active === PRIMARY_LANGUAGE;

  // Always-English (left side).
  const en = useMemo<Translate>(
    () =>
      showKeys
        ? (key) => key
        : (key, options) => String(enRaw(key, options)),
    [enRaw, showKeys]
  );

  // Selected language including English — for standalone (non-paired) text.
  const tRaw = useMemo<Translate>(
    () =>
      showKeys
        ? (key) => key
        : (key, options) => String(tRawI18n(key, options)),
    [tRawI18n, showKeys]
  );

  // Secondary (right side) — empty when English so the label collapses.
  const t = useMemo<Translate>(
    () =>
      showKeys
        ? (key) => key
        : (key, options) => (isEnglish ? "" : String(tRawI18n(key, options))),
    [tRawI18n, showKeys, isEnglish]
  );

  return { t, tRaw, en, i18n, isEnglish, secondaryLanguage: i18n.language };
}
