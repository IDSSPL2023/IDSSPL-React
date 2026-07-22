import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
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
}: SelectFieldProps) {
  const isNonEditable = readOnly || disabled;
  const normalized = normalizeOptions(options);
  const stateClasses = error ? ERROR_FIELD_CLASSES : isNonEditable ? READONLY_FIELD_CLASSES : ACTIVE_FIELD_CLASSES;

  return (
    <FormField label={label} labelHi={labelHi} required={required} error={error}>
      <div className={`relative flex h-11 items-center gap-2 rounded-lg border px-3 transition-colors ${stateClasses}`}>
        {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
        <select
          value={value}
          disabled={isNonEditable}
          onFocus={onFocus}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 appearance-none bg-transparent text-sm outline-none disabled:cursor-not-allowed"
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {normalized.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {!isNonEditable && <ChevronDown size={16} className="pointer-events-none shrink-0 text-slate-400" />}
      </div>
    </FormField>
  );
}
