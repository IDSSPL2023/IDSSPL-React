import type { ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import FormField, { ACTIVE_FIELD_CLASSES, ERROR_FIELD_CLASSES, READONLY_FIELD_CLASSES } from "./FormField";

export interface PicklistFieldProps {
  label: string;
  labelHi?: string;
  icon?: ReactNode;
  value: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string;
  /** Opens the paired `PicklistModal`. */
  onOpenPicklist: () => void;
}

/**
 * Text field paired with the three-vertical-dot trigger button that opens a
 * `PicklistModal`. Visual contract ported from `shared/Inputs/PickerInput.tsx`.
 */
export default function PicklistField({
  label,
  labelHi,
  icon,
  value,
  placeholder,
  required,
  readOnly = false,
  disabled = false,
  error,
  onOpenPicklist,
}: PicklistFieldProps) {
  const isNonEditable = readOnly || disabled;
  const stateClasses = error ? ERROR_FIELD_CLASSES : isNonEditable ? READONLY_FIELD_CLASSES : ACTIVE_FIELD_CLASSES;

  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <FormField label={label} labelHi={labelHi} required={required} error={error}>
          <div className={`flex h-11 items-center gap-2 rounded-lg border px-3 transition-colors ${stateClasses}`}>
            {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
            <span className={`w-full min-w-0 truncate text-sm ${value ? "text-slate-700" : "text-slate-400"}`}>
              {value || placeholder}
            </span>
          </div>
        </FormField>
      </div>
      <button
        type="button"
        onClick={onOpenPicklist}
        disabled={disabled || readOnly}
        aria-label={`Open ${label} list`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-primary transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
}
