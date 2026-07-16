import { useState } from "react";
import type { ReactNode } from "react";
import { Calendar, Check, FileText, Percent, UserRound, X } from "lucide-react";
import SuccessModal from "@/components/shared/SuccessModal";
import { useBilingual } from "@/i18n/useBilingual";

export interface InterestPostingProcessData {
  asOnDate: string;
  interestRate: string;
}

export interface InterestPostingProcessProps {
  onClose: () => void;
  onSave?: (data: InterestPostingProcessData) => void;
  variant?: "modal" | "page";
}

export default function InterestPostingProcess({
  onClose,
  onSave,
  variant = "modal",
}: InterestPostingProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [asOnDate, setAsOnDate] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof InterestPostingProcessData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const nextErrors: Partial<Record<keyof InterestPostingProcessData, boolean>> = {};
    if (!asOnDate.trim()) nextErrors.asOnDate = true;
    if (!interestRate.trim()) nextErrors.interestRate = true;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validate()) return;
    const payload = { asOnDate, interestRate };
    onSave?.(payload);
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
        title={en("interestPostingProcess.successTitle")}
        subtitle={en("loanInterestRate.successSubtitle")}
      />
    );
  }

  const content = (
    <div className="w-full max-w-[500px] rounded-md bg-white p-3 shadow-2xl">
      <div className="rounded-xl border border-primary border-t-4 bg-white px-4 pb-5 pt-4 shadow-[0_1px_8px_rgba(37,99,235,0.12)]">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary">
            <UserRound size={17} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold leading-tight text-[#1F2858]">
              {en("common.accountDetails")}
              {t("common.accountDetails") ? (
                <span className="text-[#64748B]"> / {t("common.accountDetails")}</span>
              ) : null}
            </h2>
            <p className="mt-1 text-[11px] leading-snug text-slate-500">
              {en("interestPostingProcess.subtitle")}
              {t("interestPostingProcess.subtitle") ? (
                <span> / {t("interestPostingProcess.subtitle")}</span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <FormField
            label={en("interestPostingProcess.fields.asOnDate")}
            labelHi={t("interestPostingProcess.fields.asOnDate")}
            error={!!errors.asOnDate}
          >
            <IconInput
              icon={<Calendar size={15} />}
              value={asOnDate}
              onChange={(value) => {
                setAsOnDate(value);
                setErrors((prev) => ({ ...prev, asOnDate: false }));
              }}
              placeholder={tRaw("interestPostingProcess.placeholders.fromDate")}
            />
          </FormField>

          <FormField
            label={en("interestPostingProcess.fields.interestRate")}
            labelHi={t("interestPostingProcess.fields.interestRate")}
            error={!!errors.interestRate}
          >
            <IconInput
              icon={<Percent size={15} />}
              value={interestRate}
              onChange={(value) => {
                setInterestRate(value);
                setErrors((prev) => ({ ...prev, interestRate: false }));
              }}
              placeholder={tRaw("interestPostingProcess.placeholders.toDate")}
            />
          </FormField>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={handleValidate}
          className="flex h-9 min-w-[92px] items-center justify-center gap-1.5 rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition hover:bg-primary-700"
        >
          {en("common.validate")}
          <Check size={14} />
        </button>
        <button
          type="button"
          disabled
          className="flex h-9 min-w-[128px] cursor-not-allowed items-center justify-center gap-1.5 rounded-md bg-slate-100 px-5 text-[12px] font-semibold text-slate-400"
        >
          {en("interestPostingProcess.actions.generateReports")}
          <FileText size={13} />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 min-w-[92px] items-center justify-center gap-1.5 rounded-md border border-primary bg-white px-5 text-[12px] font-semibold text-primary transition hover:bg-primary-50"
        >
          {en("common.cancel")}
          <X size={14} />
        </button>
      </div>
    </div>
  );

  if (variant === "page") return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {content}
    </div>
  );
}

function FormField({
  label,
  labelHi,
  error,
  children,
}: {
  label: string;
  labelHi?: string;
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold leading-none text-[#1F2937]">
        {label}
        {labelHi ? <span className="text-[#64748B]"> / {labelHi}</span> : null}
        <span className="ml-0.5 text-rose-600">*</span>
      </label>
      {children}
      {error ? <p className="mt-1 text-[11px] text-rose-600">This field is required</p> : null}
    </div>
  );
}

function IconInput({
  icon,
  value,
  onChange,
  placeholder,
}: {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex h-10 items-center rounded-md border border-[#A6AFBD] bg-white px-3 text-[12px] text-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <span className="mr-2 shrink-0 text-slate-500">{icon}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
