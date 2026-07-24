import React, { useEffect, useState } from "react";
import Image from "@/components/ui/Image";
import { IMAGES } from "@/assets";
import { User, IdCard, RefreshCw, X, Check, ChevronDown, LucideIcon } from "lucide-react";

/* ===================== Types ===================== */

export interface SetOtpData {
  otp: string;
}

export interface SetOtpProps {
  open: boolean;
  userId?: string;
  userName?: string;
  onClose?: () => void;
  onSubmit?: (data: SetOtpData) => void;
}

interface FormErrors {
  otp?: string;
}

/* ===================== Helpers ===================== */

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/* ===================== Field ===================== */

interface FieldProps {
  label: string;
  labelHi: string;
  icon: LucideIcon;
  value?: string;
  readOnly?: boolean;
  error?: string;
  highlighted?: boolean;
  onRegenerate?: () => void;
}

function Field({ label, labelHi, icon: Icon, value, readOnly, error, highlighted, onRegenerate }: FieldProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-1 -mb-1">
        <span className="text-base font-medium text-indigo-950 dark:text-slate-100">
          {label} / <span className="text-slate-500 dark:text-slate-400">{labelHi}</span>
        </span>
        <span className="text-sm font-medium text-red-500">*</span>
      </div>
      <div
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border outline-none ${
          error
            ? "border-red-400 dark:bg-slate-900"
            : highlighted
            ? "bg-white border-primary-700 dark:bg-slate-900"
            : readOnly
            ? "bg-gray-100 border-gray-200 dark:bg-slate-800 dark:border-slate-700"
            : "bg-white border-gray-300 dark:bg-slate-900 dark:border-slate-700"
        }`}
      >
        {onRegenerate ? (
          <button
            type="button"
            onClick={onRegenerate}
            className="shrink-0 p-0.5 rounded hover:bg-primary-50"
            aria-label="Regenerate OTP"
          >
            <Icon className="w-5 h-5 text-primary-700" />
          </button>
        ) : (
          <Icon className="w-5 h-5 text-gray-400 shrink-0 dark:text-slate-500" />
        )}
        <span className={`flex-1 text-base truncate ${value ? "text-gray-900 dark:text-slate-100" : "text-gray-400 dark:text-slate-500"}`}>{value}</span>
      </div>
      {error && <span className="text-sm text-red-500 dark:text-red-400">{error}</span>}
    </div>
  );
}

/* ===================== SetOtpModal ===================== */

export default function SetOtpModal({ open, userId = "", userName = "", onClose, onSubmit }: SetOtpProps) {
  const [otp, setOtp] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidated, setIsValidated] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setOtp(generateOtp());
      setErrors({});
      setIsValidated(false);
    }
  }, [open]);

  if (!open) return null;

  const handleRegenerate = () => {
    setOtp(generateOtp());
    setErrors({});
    setIsValidated(false);
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!/^\d{6}$/.test(otp)) nextErrors.otp = "OTP must be a 6-digit code";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validate()) return;
    setIsValidated(true);
  };

  const handleSave = () => {
    if (!isValidated) return;
    onSubmit?.({ otp });
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-auto bg-white rounded-2xl sm:rounded-[36px] flex flex-col h-full sm:h-auto sm:max-h-[90vh] overflow-hidden dark:bg-slate-900"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Header (fixed, does not scroll) */}
        <div className="shrink-0 flex items-start justify-between gap-4 p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Image
                src={IMAGES.SET_PASSWORD}
                alt="Set User OTP"
                width={64}
                height={64}
                className="w-14 h-14 sm:w-16 sm:h-16 shrink-0"
              />
              <div>
                <h1 className="text-2xl sm:text-xl font-bold tracking-tight leading-tight">
                    <span className="text-indigo-950 dark:text-slate-100">Set User OTP</span>
                    <span className="text-slate-900 dark:text-slate-100"> / </span>
                    <span className="text-slate-500 dark:text-slate-400">युझर ओटीपी सेट करा</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-500 leading-5 dark:text-slate-400">
                Set a temporary code for manual activation. / मॅन्युअल ऑक्टिव्हेशनसाठी तात्पुरता कोड सेट करा.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-7 pb-6 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Form card */}
          <section className="p-4 sm:p-6 bg-white rounded-2xl border-x border-b border-t-4 border-primary-700 flex flex-col gap-6 dark:bg-slate-900">
            <Field label="User Id" labelHi="वापरकर्ता आयडी" icon={User} value={userId} readOnly />
            <Field label="User Name" labelHi="वापरकर्त्याचे नाव" icon={IdCard} value={userName} readOnly />
            <Field
              label="Generate OTP"
              labelHi="ओटीपी जनरेट करा"
              icon={RefreshCw}
              value={otp}
              highlighted
              error={errors.otp}
              onRegenerate={handleRegenerate}
            />
          </section>
        </div>

        {/* Footer actions (fixed, does not scroll) */}
        <div className="shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-4 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleValidate}
            disabled={isValidated}
            className={`w-full sm:w-36 h-12 px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 text-base font-medium transition-colors ${
              isValidated
                ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
                : "bg-primary text-white hover:[var(--primary)]/50 cursor-pointer"
            }`}
          >
            Validate
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-36 h-12 px-6 py-3.5 rounded-lg border border-primary-700 flex items-center justify-center gap-2 text-primary-700 text-base font-medium hover:bg-primary-50 transition-colors"
          >
            Cancel
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValidated}
            className={`w-full sm:w-36 h-12 px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 text-base font-medium transition-colors ${
              isValidated
                ? "bg-sky-700 text-white hover:bg-sky-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
            }`}
          >
            Save
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}