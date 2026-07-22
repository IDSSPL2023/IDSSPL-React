import type { ReactNode } from "react";
import FormField, { ACTIVE_FIELD_CLASSES, ERROR_FIELD_CLASSES, READONLY_FIELD_CLASSES } from "./FormField";

export interface TextFieldProps {
  label: string;
  labelHi?: string;
  icon?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string;
  type?: "text" | "number" | "email" | "tel";
  trailing?: ReactNode;
}

export default function TextField({
  label,
  labelHi,
  icon,
  value,
  onChange,
  placeholder,
  required,
  readOnly = false,
  disabled = false,
  error,
  type = "text",
  trailing,
}: TextFieldProps) {
  const isNonEditable = readOnly || disabled;
  const stateClasses = error ? ERROR_FIELD_CLASSES : isNonEditable ? READONLY_FIELD_CLASSES : ACTIVE_FIELD_CLASSES;

  return (
    <FormField label={label} labelHi={labelHi} required={required} error={error}>
      <div className={`flex h-11 items-center gap-2 rounded-lg border px-3 transition-colors ${stateClasses}`}>
        {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        />
        {trailing}
      </div>
    </FormField>
  );
}
