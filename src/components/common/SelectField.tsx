import type { ReactNode } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import FormField, { ACTIVE_FIELD_CLASSES, ERROR_FIELD_CLASSES, READONLY_FIELD_CLASSES } from "./FormField";

export interface SelectFieldOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  label: string;
  labelHi?: string;
  icon?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: SelectFieldOption[] | string[];
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string;
  /** Fires when the dropdown gains focus — e.g. to lazily fetch `options` on first open. */
  onFocus?: () => void;
  /**
   * Shows a spinner in place of `icon` and swaps the placeholder to `loadingText`.
   * Deliberately does NOT disable the control — a disabled `<select>` can't be
   * opened at all, so options fetched while the dropdown is closed would leave
   * it stuck unclickable until the fetch resolves.
   */
  loading?: boolean;
  loadingText?: string;
}

const normalizeOptions = (options: SelectFieldOption[] | string[]): SelectFieldOption[] =>
  options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

export default function SelectField({
  label,
  labelHi,
  icon,
  value,
  onChange,
  options,
  placeholder = "Select",
  required,
  readOnly = false,
  disabled = false,
  error,
  onFocus,
  loading = false,
  loadingText = "Loading...",
}: SelectFieldProps) {
  const isNonEditable = readOnly || disabled;

  const normalized = normalizeOptions(options);

  const stateClasses = error
    ? ERROR_FIELD_CLASSES
    : isNonEditable
      ? READONLY_FIELD_CLASSES
      : ACTIVE_FIELD_CLASSES;

  return (
    <FormField
      label={label}
      labelHi={labelHi}
      required={required}
      error={error}
    >
      <div
        className={`
          relative flex h-12 items-center rounded-xl border bg-white px-4
          shadow-sm transition-all duration-200
          ${stateClasses}
          ${!isNonEditable
            ? "hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            : ""
          }
        `}
      >
        {loading ? (
          <Loader2
            size={18}
            className="mr-3 shrink-0 animate-spin text-primary"
          />
        ) : (
          icon && (
            <span className="mr-3 shrink-0 text-slate-500">{icon}</span>
          )
        )}

        <select
          value={value}
          disabled={isNonEditable}
          onFocus={onFocus}
          onChange={(e) => onChange(e.target.value)}
          className="
            h-full
            w-full
            appearance-none
            bg-transparent
            pr-8
            text-sm
            font-medium
            text-slate-700
            outline-none
            disabled:cursor-not-allowed
            disabled:text-slate-500
          "
        >
          <option value="" disabled>
            {loading ? loadingText : placeholder}
          </option>

          {normalized.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {!isNonEditable && (
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 text-slate-400"
          />
        )}
      </div>
    </FormField>
  );
}

