import { useState } from "react";
import type { ReactNode } from "react";
import { BarChart3, Calendar, Check, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

export interface HoInterestReportBranchData {
  fromDate: string;
  toDate: string;
}

export interface HoInterestReportBranchProcessProps {
  open: boolean;
  onClose: () => void;
  onReport?: (data: HoInterestReportBranchData) => void;
}

const INITIAL_VALUES: HoInterestReportBranchData = {
  fromDate: "2026-04-01",
  toDate: "2026-06-01",
};

const buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

export default function HoInterestReportBranchProcess({
  open,
  onClose,
  onReport,
}: HoInterestReportBranchProcessProps) {
  const { en, t } = useBilingual();
  const [values, setValues] = useState<HoInterestReportBranchData>(INITIAL_VALUES);
  const [isValidated, setIsValidated] = useState(false);

  if (!open) return null;

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleReport = () => {
    if (!isValidated) return;
    onReport?.(values);
  };

  const formatDate = (value: string) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                {en("hoInterestReportBranch.title")}
                {t("hoInterestReportBranch.title") ? (
                  <span className="text-[#64748B]"> / {t("hoInterestReportBranch.title")}</span>
                ) : null}
              </h2>
              <p className="mt-1 text-[14px] leading-snug text-[#64748B]">
                {en("loanInterestRate.subtitle")}
                {t("loanInterestRate.subtitle") ? (
                  <span> / {t("loanInterestRate.subtitle")}</span>
                ) : null}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={en("common.cancel")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <FormField
              label={en("hoInterestReportBranch.fields.fromDate")}
              labelHi={t("hoInterestReportBranch.fields.fromDate")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {formatDate(values.fromDate)}
              </div>
            </FormField>

            <FormField
              label={en("hoInterestReportBranch.fields.toDate")}
              labelHi={t("hoInterestReportBranch.fields.toDate")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {formatDate(values.toDate)}
              </div>
            </FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-4">
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
  children,
}: {
  label: string;
  labelHi?: string;
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
    </div>
  );
}
