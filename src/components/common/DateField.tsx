import { Calendar } from "lucide-react";
import FormField, { ACTIVE_FIELD_CLASSES, ERROR_FIELD_CLASSES, READONLY_FIELD_CLASSES } from "./FormField";

export interface DateFieldProps {
  label: string;
  labelHi?: string;
  /** ISO `YYYY-MM-DD`, matching the native date input's value format. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string;
}

export default function DateField({
  label,
  labelHi,
  value,
  onChange,
  placeholder = "Select date",
  required,
  readOnly = false,
  disabled = false,
  error,
}: DateFieldProps) {
  const isNonEditable = readOnly || disabled;
  const stateClasses = error ? ERROR_FIELD_CLASSES : isNonEditable ? READONLY_FIELD_CLASSES : ACTIVE_FIELD_CLASSES;

  return (
    <FormField label={label} labelHi={labelHi} required={required} error={error}>
      <div
        className={`flex h-11 items-center gap-2 rounded-lg border px-3 transition-colors ${stateClasses}`}
        onClick={(e) => {
          if (isNonEditable) return;
          (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.showPicker?.();
        }}
      >
        <Calendar size={16} className="shrink-0 text-slate-400" />
        <input
          type="date"
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-sm outline-none disabled:cursor-not-allowed"
        />
      </div>
    </FormField>
  );
}
