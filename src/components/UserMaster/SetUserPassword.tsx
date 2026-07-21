import { IMAGES } from "@/assets";
import React, { useEffect, useState } from "react";
import Image from "@/components/ui/Image";
import {
  User,
  IdCard,
  Lock,
  FileText,
  AlertCircle,
  X,
  Check,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import SuccessModal from "../shared/SuccessModal";

/* ===================== Types ===================== */

export interface SetUserPasswordData {
  newPassword: string;
  confirmPassword: string;
  reason: string;
}

export interface SetUserPasswordProps {
  open: boolean;
  userId?: string;
  userName?: string;
  onClose?: () => void;
  onSubmit?: (data: SetUserPasswordData) => void;
}

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
  reason?: string;
}

/* ===================== Validation ===================== */

function validatePassword(pw: string): string {
  if (!pw) return "New password is required";
  if (pw.length < 8 || pw.length > 16) return "Password must be 8-16 characters long";
  if (!/^[A-Z]/.test(pw)) return "Password must start with a capital letter";
  if (!/[a-z]/.test(pw)) return "Password must include a lowercase letter";
  if (!/[0-9]/.test(pw)) return "Password must include a number";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password must include a special character";
  return "";
}

/* ===================== Field ===================== */

interface FieldProps {
  label: string;
  labelHi: string;
  icon: LucideIcon;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  readOnly?: boolean;
  error?: string;
}

function Field({
  label,
  labelHi,
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
  readOnly,
  error,
}: FieldProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-1 -mb-1">
        <span className="text-base text-[16px]  text-indigo-950 dark:text-slate-100">
          {label} / <span className="text-slate-500 dark:text-slate-400">{labelHi}</span>
        </span>
        <span className="text-sm font-medium text-red-500">*</span>
      </div>
      <div
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border outline-none ${
          error
            ? "border-red-400 dark:bg-slate-900"
            : readOnly
            ? "bg-gray-100 border-gray-200 dark:bg-slate-800 dark:border-slate-700"
            : "bg-white border-gray-300 dark:bg-slate-900 dark:border-slate-700"
        }`}
      >
        <Icon className="w-5 h-5 text-gray-400 shrink-0 dark:text-slate-500" />
        {readOnly ? (
          <span className="flex-1 text-base truncate text-gray-500 dark:text-slate-400">{value}</span>
        ) : (
          <input
            type={type}
            value={value ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-w-0 outline-none text-base text-gray-900 placeholder:text-gray-400 bg-transparent dark:text-slate-100 dark:placeholder-slate-500"
          />
        )}
      </div>
      {error && <span className="text-sm text-red-500 dark:text-red-400">{error}</span>}
    </div>
  );
}

/* ===================== SetUserPasswordModal ===================== */

const DEFAULT_DATA: SetUserPasswordData = {
  newPassword: "",
  confirmPassword: "",
  reason: "",
};

export default function SetUserPasswordModal({
  open,
  userId = "",
  userName = "",
  onClose,
  onSubmit,
}: SetUserPasswordProps) {
  const [data, setData] = useState<SetUserPasswordData>(DEFAULT_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setData(DEFAULT_DATA);
      setErrors({});
      setIsValidated(false);
      setShowSuccess(false);
    }
  }, [open]);

  if (!open) return null;

  const set =
    <K extends keyof SetUserPasswordData>(key: K) =>
    (val: SetUserPasswordData[K]) => {
      setData((prev) => ({ ...prev, [key]: val }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
      setIsValidated(false);
    };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    const passwordError = validatePassword(data.newPassword);
    if (passwordError) nextErrors.newPassword = passwordError;

    if (!data.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm the new password";
    } else if (data.confirmPassword !== data.newPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (!data.reason.trim()) {
      nextErrors.reason = "Reason for password change is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validate()) return;
    setIsValidated(true);
  };

  const handleSave = () => {
    if (!isValidated) return;
    onSubmit?.(data);
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose?.();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title="Password Changed Successfully"
        subtitle=""
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
      />
    );
  }

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
                alt="Set User Password"
                width={64}
                height={64}
                className="w-14 h-14 sm:w-16 sm:h-16 shrink-0"
              />
              <div>
                <h1 className="text-2xl sm:text-xl font-bold tracking-tight leading-tight">
                <span className="text-indigo-950 dark:text-slate-100">Set User Password</span>
                <span className="text-slate-900 dark:text-slate-100"> / </span>
                <span className="text-slate-500 dark:text-slate-400">वापरकर्ता पासवर्ड सेट करा</span>
              </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-5 dark:text-slate-400">
              Set a temporary password for initial login. / सुरुवातीच्या लॉगिनसाठी तात्पुरता पासवर्ड सेट करा.
            </p>
              </div>

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
          {/* Hint Message */}
          <div className="p-4 sm:p-5 bg-indigo-50 border border-primary-100 rounded-xl flex items-start gap-3 dark:bg-indigo-900/20">
            <AlertCircle className="w-5 h-5 text-primary-700 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">Hint Message</span>
              <p className="text-sm text-slate-500 leading-5 dark:text-slate-400">
                Password must be 8–16 characters long, start with a capital letter, and include lowercase letters,
                numbers, and special characters / पासवर्ड 8–16 अक्षरांचा असावा, मोठ्या अक्षराने सुरू व्हावा आणि त्यात लहान अक्षरे,
                संख्या व विशेष चिन्हे असावीत.
              </p>
            </div>
          </div>

          {/* Form card */}
          <section className="p-4 sm:p-6 bg-white rounded-2xl border-x border-b border-t-4 border-primary  flex flex-col gap-4 dark:bg-slate-900">
            <Field label="User Id" labelHi="वापरकर्ता आयडी" icon={User} value={userId} readOnly />
            <Field label="User Name" labelHi="वापरकर्त्याचे नाव" icon={IdCard} value={userName} readOnly />
            <Field
              label="New Password"
              labelHi="नवीन पासवर्ड"
              icon={Lock}
              type="password"
              placeholder="Enter New Password"
              value={data.newPassword}
              onChange={set("newPassword")}
              error={errors.newPassword}
            />
            <Field
              label="Confirm Password"
              labelHi="पासवर्डची पुष्टी करा"
              icon={Lock}
              type="password"
              placeholder="Enter Confirm Password"
              value={data.confirmPassword}
              onChange={set("confirmPassword")}
              error={errors.confirmPassword}
            />

            {/* Reason (textarea) */}
            <div className="w-full flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-base font-medium text-indigo-950 dark:text-slate-100">
                  Reason for Password Change / <span className="text-slate-500 dark:text-slate-400">पासवर्ड बदलण्याचे कारण</span>
                </span>
                <span className="text-sm font-medium text-red-500">*</span>
              </div>
              <div
                className={`flex items-start gap-2 px-3.5 py-2 rounded-md border outline-none bg-white dark:bg-slate-900 ${
                  errors.reason ? "border-red-400" : "border-gray-300 dark:border-slate-700"
                }`}
              >
                <FileText className="w-5 h-5 text-gray-400 shrink-0 mt-0.5 dark:text-slate-500" />
                <textarea
                  value={data.reason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => set("reason")(e.target.value)}
                  placeholder="Reason For changing Password is ................."
                  rows={3}
                  className="flex-1 min-w-0 outline-none text-base text-gray-900 placeholder:text-gray-400 bg-transparent resize-none dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>
              {errors.reason && <span className="text-sm text-red-500 dark:text-red-400">{errors.reason}</span>}
            </div>
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
                : "bg-sky-700 text-white hover:bg-sky-800"
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
  );
}