import { useState } from "react";
import type { ReactNode } from "react";
import { BarChart3, Calendar, Check, User, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

export interface InterestNotAppliedData {
  branchCode: string;
  asOnDate: string;
}

export interface InterestNotAppliedProcessProps {
  open: boolean;
  onClose: () => void;
  onReport?: (data: InterestNotAppliedData) => void;
}

const INITIAL_VALUES: InterestNotAppliedData = {
  branchCode: "0002",
  asOnDate: "",
};

const buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

export default function InterestNotAppliedProcess({
  open,
  onClose,
  onReport,
}: InterestNotAppliedProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<InterestNotAppliedData>(INITIAL_VALUES);
  const [error, setError] = useState<string | undefined>();
  const [isValidated, setIsValidated] = useState(false);

  if (!open) return null;

  const validate = () => {
    const nextError = values.asOnDate ? undefined : en("common.fieldRequired");
    setError(nextError);
    return !nextError;
  };

  const handleValidate = () => {
    if (!validate()) {
      setIsValidated(false);
      return;
    }
    setIsValidated(true);
  };

  const handleReport = () => {
    if (!isValidated) return;
    onReport?.(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start gap-4 border-b border-slate-100 pb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
            <UserRound size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
              {en("interestNotApplied.title")}
              {t("interestNotApplied.title") ? (
                <span className="text-[#64748B]"> / {t("interestNotApplied.title")}</span>
              ) : null}
            </h2>
            <p className="mt-1 text-[14px] leading-snug text-[#64748B]">
              {en("interestNotApplied.subtitle")}
              {t("interestNotApplied.subtitle") ? (
                <span> / {t("interestNotApplied.subtitle")}</span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 space-y-5">
            <FormField
              label={en("interestNotApplied.fields.branchCode")}
              labelHi={t("interestNotApplied.fields.branchCode")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <User size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {values.branchCode}
              </div>
            </FormField>

            <FormField
              label={en("interestNotApplied.fields.asOnDate")}
              labelHi={t("interestNotApplied.fields.asOnDate")}
              error={error}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-white px-4 text-[15px] text-slate-700">
                <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
                <input
                  type="date"
                  value={values.asOnDate}
                  onChange={(event) => {
                    setValues((prev) => ({ ...prev, asOnDate: event.target.value }));
                    setError(undefined);
                    setIsValidated(false);
                  }}
                  placeholder={tRaw("interestNotApplied.placeholders.enterDate")}
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
                />
              </div>
            </FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          <button
            type="button"
            onClick={handleValidate}
            className={`${buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleReport}
            className={`${buttonBase} ${
              isValidated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
        </div>
      </div>
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
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-3 block text-[15px] font-semibold leading-none text-[#1F2937]">
        {label}
        {labelHi ? <span className="text-[#64748B]"> / {labelHi}</span> : null}
        <span className="ml-0.5 text-rose-600">*</span>
      </label>
      {children}
      {error ? <p className="mt-1 text-[12px] text-rose-600">{error}</p> : null}
    </div>
  );
}
