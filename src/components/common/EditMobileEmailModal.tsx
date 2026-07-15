import React, { useEffect, useState } from "react";
import { Smartphone, Mail, X, UserCircle2, IdCard, Upload, LucideIcon } from "lucide-react";

export type FieldType = "mobile" | "email";

interface FieldConfig {
  icon: LucideIcon;
  titleEn: string;
  titleHi: string;
  labelEn: string;
  labelHi: string;
  inputType: string;
  placeholder: string;
  validate: (val: string) => string;
}

/**
 * Config for each supported field type.
 * Add more entries here (e.g. "userName", "address") to reuse
 * this same modal for other single-field edits.
 */
const FIELD_CONFIG: Record<FieldType, FieldConfig> = {
  mobile: {
    icon: Smartphone,
    titleEn: "Mobile Number",
    titleHi: "मोबाइल क्रमांक",
    labelEn: "Edit Mobile Number",
    labelHi: "मोबाईल नंबर एडिट करा",
    inputType: "tel",
    placeholder: "Enter mobile number",
    validate: (val: string) => {
      if (!val.trim()) return "Mobile number is required";
      if (!/^\d{10}$/.test(val.trim())) return "Enter a valid 10-digit mobile number";
      return "";
    },
  },
  email: {
    icon: Mail,
    titleEn: "Email ID",
    titleHi: "ईमेल आयडी",
    labelEn: "Edit Email ID",
    labelHi: "ईमेल आयडी एडिट करा",
    inputType: "email",
    placeholder: "Enter email ID",
    validate: (val: string) => {
      if (!val.trim()) return "Email ID is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "Enter a valid email address";
      return "";
    },
  },
};

export interface EditFieldModalProps {
  open: boolean;
  fieldType?: FieldType;
  initialValue?: string;
  userId?: string;
  userName?: string;
  onClose?: () => void;
  onSubmit?: (value: string) => void;
}

export default function EditFieldModal({
  open,
  fieldType,
  initialValue = "",
  userId,
  userName,
  onClose,
  onSubmit,
}: EditFieldModalProps) {
  const config = (fieldType && FIELD_CONFIG[fieldType]) || FIELD_CONFIG.mobile;
  const Icon = config.icon;

  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string>("");

  // Reset the field whenever the modal is (re)opened for a new value.
  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError("");
    }
  }, [open, initialValue, fieldType]);

  if (!open) return null;

  const handleChange = (raw: string) => {
    const next = fieldType === "mobile" ? raw.replace(/\D/g, "").slice(0, 10) : raw;
    setValue(next);
    if (error) setError("");
  };

  const handleSubmit = () => {
    const validationError = config.validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit?.(value.trim());
    onClose?.();
  };

  const submitDisabled = fieldType === "mobile" && value.length !== 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-primary-100/70 dark:bg-slate-800" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-primary-100/70 dark:bg-slate-800" />

        <div className="relative px-8 py-8 sm:px-10 sm:py-10">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary-50">
                <Icon className="h-6 w-6 fill-primary text-white" strokeWidth={2} />
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl">
                <span className="text-slate-900 dark:text-slate-100">{config.titleEn}</span>{" "}
                <span className="text-slate-400 dark:text-slate-500">/ {config.titleHi}</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-500 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Read-only info fields */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
                User Id <span className="text-slate-400 font-medium dark:text-slate-500">/ वापरकर्ता आयडी</span>
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <UserCircle2 className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
                <span className="truncate text-slate-500 dark:text-slate-400">{userId}</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
                User Name <span className="text-slate-400 font-medium dark:text-slate-500">/ वापरकर्त्याचे नाव</span>
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <IdCard className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
                <span className="truncate text-slate-500 dark:text-slate-400">{userName}</span>
              </div>
            </div>
          </div>

          {/* Editable field */}
          <div className="mb-10">
            <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
              {config.labelEn} <span className="text-slate-500 font-medium dark:text-slate-400">/ {config.labelHi}</span>
              <span className="text-red-500"> *</span>
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 focus-within:ring-2 focus-within:ring-primary-100 ${
                error ? "border-red-400" : "border-primary"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
              <input
                type={config.inputType}
                inputMode={fieldType === "mobile" ? "numeric" : undefined}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
                className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder={config.placeholder}
                maxLength={fieldType === "mobile" ? 10 : undefined}
                autoFocus
              />
            </div>
            {error && <span className="mt-1 block text-sm text-red-500">{error}</span>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-40 items-center justify-center gap-2 rounded-xl border border-primary py-3 font-semibold text-primary transition hover:bg-primary-50 dark:hover:bg-slate-800"
            >
              Cancel
              <X className="h-4 w-4" strokeWidth={3} />
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitDisabled}
              className="flex w-40 items-center justify-center gap-2 rounded-xl bg-primary-700 py-3 font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit
              <Upload className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
