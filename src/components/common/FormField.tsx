import type { ReactNode } from "react";

export interface FormFieldProps {
  label: string;
  labelHi?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

/**
 * Base label + error wrapper shared by every `common/form/*` field. The
 * light-grey read-only fill itself lives on the individual field inputs
 * (TextField/SelectField/DateField/PicklistField), per "Personal Details.png".
 */
export default function FormField({ label, labelHi, required, error, children, className = "", htmlFor }: FormFieldProps) {
  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
      <label htmlFor={htmlFor} className="mb-1.5 block truncate text-sm font-medium text-[#1F2858]">
        {label}
        {labelHi && (
          <>
            <span className="text-slate-400"> / </span>
            <span className="text-[#64748B]">{labelHi}</span>
          </>
        )}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

export const READONLY_FIELD_CLASSES = "border-slate-200 bg-[#F3F4F6] text-slate-500 cursor-not-allowed";
export const ACTIVE_FIELD_CLASSES =
  "border-slate-300 bg-white text-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10";
export const ERROR_FIELD_CLASSES = "border-rose-400 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100";
