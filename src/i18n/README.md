# Internationalization (i18n) Guide

This app is **bilingual**. Every user-facing label shows **English on the left**
and a **selectable second language on the right** (Marathi by default, Hindi
optional). This guide explains how it works and how to add or change strings.

Built on [`react-i18next`](https://react.i18next.com/). You don't need to be an
i18n expert — 90% of the time you'll just call two helper functions.

---

## TL;DR — the two functions you'll use

```tsx
"use client";
import { useBilingual } from "@/i18n/useBilingual";

export default function MyComponent() {
  const { en, t } = useBilingual();

  return (
    <h1>
      {en("accountMaster.title")}                                   {/* left  = always English */}
      {t("accountMaster.title") ? (                                 {/* right = selected language */}
        <span> / {t("accountMaster.title")}</span>                  {/* ...hidden when English */}
      ) : null}
    </h1>
  );
}
```

- **`en(key)`** → the English text (the fixed, left-hand side; also buttons/breadcrumbs).
- **`t(key)`** → the **right-hand half of a bilingual pair only**. Returns `""`
  when English is selected, so the duplicate collapses and you see just English.
- **`tRaw(key)`** → the selected language for **any standalone translated text**
  (placeholders, table headers, tooltips). Never blank in English — this is your
  default for text that isn't part of a left/right pair.

`en` and `t` take the same key: one key, two renderings, and the right side
disappears in English. Use `t()` *only* for that right side — everywhere else
use `tRaw()` (translated) or `en()` (always English).

> **Always guard the secondary side** with `{t("key") ? <span> / {t("key")}</span> : null}`
> (or `{t("key") && ...}`). If you render `{t("key")}` bare next to a literal
> `/`, you'll get a dangling ` / ` when English is selected.

> The component **must** be a Client Component (`"use client"` at the top),
> because the hooks run in the browser.

---

## The mental model

| Side  | Helper  | Language                                                        |
| ----- | ------- | -------------------------------------------------------------- |
| Left  | `en()`  | Always English (never changes)                                 |
| Right | `t()`   | The language chosen in the header dropdown — **`""` if English** |

- Elements that were **English-only** in the design (breadcrumbs, buttons,
  filter labels) use **only `en()`** — no right-hand side.
- Elements that show a **pair** (titles, field labels) use **both** `en()` and
  `t()` with the same key, and **guard** the right side so it collapses.

**What the user sees for `User Master`:**

| Selected language | Rendered |
| ----------------- | -------- |
| English           | `User Master`                |
| Marathi           | `User Master | युजर मास्टर`   |
| Hindi             | `User Master | यूज़र मास्टर`  |

Because `t()` returns `""` for English, the right side (and its `/` or `|`
separator) is skipped — no `User Master | User Master` duplication.

The default right-hand language is **Marathi** (`mr`), matching the original
app. See `DEFAULT_SECONDARY_LANGUAGE` in `config.ts`.

### The full helper set

`useBilingual()` returns:

| Field            | Use it for                                                        |
| ---------------- | ----------------------------------------------------------------- |
| `en(key)`        | Left / English text. Always English (buttons, breadcrumbs, the English half of a pair). |
| `t(key)`         | **ONLY the right-hand half of a bilingual pair.** Returns `""` when English is selected so the duplicate collapses. Never use it on its own. |
| `tRaw(key)`      | **The default for any standalone translated text** — placeholders, tooltips, table headers, toasts, single labels. Returns the selected language including English, so it never goes blank. |
| `isEnglish`      | `true` when English is selected. Handy for hiding data-driven secondary text that doesn't come from a key. |
| `i18n`           | The i18next instance (rarely needed).                             |

> ### ⭐ The one rule to remember
>
> **Use `t()` only inside a guarded bilingual pair (English on the left, secondary
> on the right). For every other translated string, use `tRaw()`.**
>
> Why: `t()` deliberately returns `""` in English so paired labels don't show
> `User Master | User Master`. But that means a **lonely** `t()` (a placeholder,
> a button, a table header) will render **blank** when English is selected.
> `tRaw()` always returns real text, so it's the safe default everywhere except
> the right side of a pair.
>
> ```tsx
> // ✅ pair — right side only, guarded
> {en("fields.remark")}
> {t("fields.remark") ? <span> / {t("fields.remark")}</span> : null}
>
> // ✅ standalone translated text → tRaw()
> <input placeholder={tRaw("memo.detailsPlaceholder")} />
> <th>{tRaw("branchMaster.filters.branchCode")}</th>
>
> // ✅ always-English UI (buttons, breadcrumbs) → en()
> <button>{en("common.save")}</button>
>
> // ❌ never do this — blank in English
> <input placeholder={t("memo.detailsPlaceholder")} />
> ```

---

## File structure

```
src/i18n/
├── config.ts               # i18next init, language list, resources
├── I18nProvider.tsx        # wraps the app (mounted in ClientLayout)
├── useBilingual.ts         # the useBilingual() hook  ← you use this
├── I18nDebugContext.tsx    # dev-only "show key IDs" state
├── I18nKeyToggle.tsx       # dev-only floating 🔑 button
├── README.md               # this file
└── locales/
    ├── en.json             # English  (source of truth)
    ├── hi.json             # Hindi
    ├── mr.json             # Marathi
    ├── gu.json             # Gujarati
    ├── ta.json             # Tamil
    └── te.json             # Telugu
scripts/
└── extract_i18n.py         # scans pages + regenerates the locale JSON
src/components/
└── LanguageSwitcher.tsx    # the header dropdown
```

---

## Keys and the locale files

Keys are **namespaced with dots** and stored as **nested JSON**. Example:

`en.json`
```json
{
  "common":  { "cancel": "Cancel", "save": "Save" },
  "accountMaster": { "title": "Account Master" }
}
```

- `t("common.cancel")` → `"Cancel"` (en) / `"रद्द करा"` (mr) / `"रद्द करें"` (hi)
- `t("accountMaster.title")` → looks up `accountMaster.title` in the active locale.

**Every key must exist in all three files (`en`, `hi`, `mr`) with the same
shape.** If a key is missing in the active language, i18next falls back to
English.

### Naming conventions

- Namespace by feature/page: `accountMaster.*`, `branchMaster.*`, `tdCalculate.*`.
- Truly shared strings go in `common.*` (Cancel, Save, Home, …) or `fields.*`
  (Account Code, Remark, …).
- Use `camelCase` for the leaf: `common.misActivity`, `fields.accountCode`.

---

## How to add a new string

### Option A — quick, by hand (recommended for one-offs)

1. Add the key to **all three** locale files with the same nesting:

   `en.json`
   ```json
   "customerMaster": { "exportLabel": "Export to Excel" }
   ```
   `hi.json`
   ```json
   "customerMaster": { "exportLabel": "एक्सेल में निर्यात करें" }
   ```
   `mr.json`
   ```json
   "customerMaster": { "exportLabel": "एक्सेलमध्ये निर्यात करा" }
   ```

2. Use it:
   ```tsx
   <button>{en("customerMaster.exportLabel")}</button>
   ```

That's it — no rebuild step, hot reload picks it up.

### Option B — via the extraction script (keeps translations in one place)

`scripts/extract_i18n.py` holds a `CATALOG` dict that is the single source for
every key + its `en`/`hi`/`mr` values, and it **regenerates** the three JSON
files. Use this when adding several keys at once.

1. Open `scripts/extract_i18n.py`, add an entry to `CATALOG`:
   ```python
   "customerMaster.exportLabel": {
       "en": "Export to Excel",
       "hi": "एक्सेल में निर्यात करें",
       "mr": "एक्सेलमध्ये निर्यात करा",
   },
   ```
2. Regenerate the locale files:
   ```bash
   python3 scripts/extract_i18n.py
   ```
   This rewrites `src/i18n/locales/{en,hi,mr}.json` and prints a coverage report
   (`i18n-extraction-report.json`, git-ignored).

> Pick **one** approach per key. If a key lives in the `CATALOG`, edit it there,
> because re-running the script will overwrite hand edits to the JSON.

---

## Interpolation (variables in strings)

Use `{{name}}` placeholders in the JSON and pass values as the second argument:

`en.json`
```json
"memo": { "charactersOnly": "{{count}} Characters Only" }
```
```tsx
en("memo.charactersOnly", { count: maxChars })   // "200 Characters Only"
```

---

## Common patterns (copy/paste)

**Bilingual page title (nav component):**
```tsx
<NavbarAM
  titleEn={en("accountMaster.title")}   // left, English
  titleHi={t("accountMaster.title")}    // right; "" when English → nav hides it
  breadcrumbs={[
    { label: en("common.home"), href: "/" },        // breadcrumbs stay English
    { label: en("common.misActivity"), href: "/" },
    { label: en("accountMaster.breadcrumb"), href: "/" },
  ]}
/>
```
> The nav components (`NavbarAM`, `NavbarCM`, `GlobalNav`, `Nav`) already skip
> the `|` separator and the secondary `<span>` when `titleHi` is empty, so just
> passing `t(...)` is enough — it collapses automatically in English.

**Bilingual field label (guard the secondary):**
```tsx
<label>
  {en("fields.accountCode")}
  {t("fields.accountCode") ? (
    <span className="text-gray-500"> / {t("fields.accountCode")}</span>
  ) : null}
</label>
```

**Standalone value (not a pair) — use `tRaw`:**
```tsx
<input placeholder={tRaw("memo.detailsPlaceholder")} />
```

**Data-driven secondary (not from a key) — gate with `isEnglish`:**
```tsx
titleHi={isEnglish ? undefined : row.titleHi}
```

**English-only button:**
```tsx
<button>{en("common.cancel")}</button>
```

---

## The language switcher

`LanguageSwitcher.tsx` lives in the header (top-right). It changes the
**right-hand** language and saves the choice to `localStorage`
(`idsspl.lang`). The left side always stays English.

---

## Dev tool: see the key behind any string 🔑

In **development only**, a small **🔑 button** sits in the bottom-right corner.
Hover to expand, click to toggle. When on, every string rendered through
`useBilingual` is replaced by its **key ID** (e.g. `accountMaster.title`), so
you can see exactly which key maps where. Click again to turn it off. The choice
persists across reloads and is completely stripped from production builds.

If a label does **not** switch to a key ID when the toggle is on, it means that
text isn't going through `useBilingual` yet — wrap it with `en()` / `t()`.

---

## Adding a whole new language (e.g. Gujarati `gu`)

1. Create `src/i18n/locales/gu.json` (copy `en.json`, translate the values).
2. In `config.ts`:
   ```ts
   import gu from "./locales/gu.json";

   export const LANGUAGES = [
     { code: "mr", label: "मराठी" },
     { code: "hi", label: "हिंदी" },
     { code: "gu", label: "ગુજરાતી" },   // add here
     { code: "en", label: "English" },
   ] as const;

   export const resources = {
     en: { translation: en },
     hi: { translation: hi },
     mr: { translation: mr },
     gu: { translation: gu },             // and here
   } as const;
   ```
3. (Optional) add `"gu"` support to `scripts/extract_i18n.py` if you use it.

The switcher and everything else pick it up automatically.

---

## Rules of thumb

- ✅ **`t()` is only for the right-hand side of a bilingual pair. For all other
  translated text use `tRaw()`** (or `en()` for always-English UI).
- ✅ Every new key goes into **all three** locale files.
- ✅ Component using `en()`/`t()`/`tRaw()` must be `"use client"`.
- ✅ Left side = `en()`, right side = `t()`, same key.
- ✅ **Always guard the secondary side**: `{t("key") ? <span> / {t("key")}</span> : null}`.
- ✅ Reuse `common.*` / `fields.*` before inventing a new namespace.
- ❌ Don't use a lonely `t()` (placeholder, button, table header) — it renders **blank** in English. Use `tRaw()`.
- ❌ Don't render `{t("key")}` bare next to a literal `/` or `|` — English leaves a dangling separator.
- ❌ Don't hardcode display strings in JSX — route them through a key.
- ❌ Don't hand-edit the JSON for keys that live in the script's `CATALOG`.

## Troubleshooting

| Symptom | Cause / Fix |
| --- | --- |
| Duplicate label like `User Master | User Master` | Secondary isn't guarded / is using an old build. `t()` returns `""` in English; guard the `<span>` with `t("key") ? … : null`. |
| Dangling ` / ` or ` | ` when English is selected | A literal separator sits outside the guard. Move the `/` **inside** the guarded `<span>`. |
| Placeholder / tooltip goes blank in English | It's using `t()`. Switch to `tRaw()`. |
| Label shows the raw key (e.g. `accountMaster.title`) unexpectedly | Key missing in the active locale, or the dev 🔑 toggle is on. |
| Right side doesn't change with the dropdown | Text is using `en()` (English-only) instead of `t()`. |
| `Cannot find module './locales/xx.json'` | New locale file not created or not imported in `config.ts`. |
| Hook error / blank render | Component isn't `"use client"`, or is rendered outside `I18nProvider`. |
