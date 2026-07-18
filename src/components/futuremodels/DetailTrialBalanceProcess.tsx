import { useState } from "react";
import type { ReactNode } from "react";
import { BarChart3, Calendar, Check, User, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

type SelectMode = "all" | "single";
type ReportType = "pdf" | "xls";

export interface DetailTrialBalanceData {
  branchCode: string;
  branchName: string;
  asOnDate: string;
  selectMode: SelectMode;
  reportType: ReportType;
}

export interface DetailTrialBalanceProcessProps {
  open: boolean;
  onClose: () => void;
  onReport?: (data: DetailTrialBalanceData) => void;
}

const INITIAL_VALUES: DetailTrialBalanceData = {
  branchCode: "0002",
  branchName: "Main Branch, Bilagi",
  asOnDate: "",
  selectMode: "single",
  reportType: "pdf",
};

const buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

export default function DetailTrialBalanceProcess({
  open,
  onClose,
  onReport,
}: DetailTrialBalanceProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<DetailTrialBalanceData>(INITIAL_VALUES);
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
      <div className="w-full max-w-3xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start gap-4 border-b border-slate-100 pb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
            <UserRound size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
              {en("detailTrialBalance.title")}
              {t("detailTrialBalance.title") ? (
                <span className="text-[#64748B]"> / {t("detailTrialBalance.title")}</span>
              ) : null}
            </h2>
            <p className="mt-1 text-[14px] leading-snug text-[#64748B]">
              {en("interestPostingProcess.subtitle")}
              {t("interestPostingProcess.subtitle") ? (
                <span> / {t("interestPostingProcess.subtitle")}</span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 space-y-5">
            <FormField
              label={en("detailTrialBalance.fields.branchCode")}
              labelHi={t("detailTrialBalance.fields.branchCode")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <User size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {values.branchCode}
              </div>
            </FormField>

            <FormField
              label={en("detailTrialBalance.fields.branchName")}
              labelHi={t("detailTrialBalance.fields.branchName")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <User size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {values.branchName}
              </div>
            </FormField>

            <FormField
              label={en("detailTrialBalance.fields.asOnDate")}
              labelHi={t("detailTrialBalance.fields.asOnDate")}
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
                  placeholder={tRaw("detailTrialBalance.placeholders.enterDate")}
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
                />
              </div>
            </FormField>

            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-10">
                <BilingualBlockLabel
                  label={en("detailTrialBalance.fields.select")}
                  labelHi={t("detailTrialBalance.fields.select")}
                />
                <RadioOption
                  checked={values.selectMode === "all"}
                  onChange={() => {
                    setValues((prev) => ({ ...prev, selectMode: "all" }));
                    setIsValidated(false);
                  }}
                  label={en("detailTrialBalance.options.all")}
                />
                <RadioOption
                  checked={values.selectMode === "single"}
                  onChange={() => {
                    setValues((prev) => ({ ...prev, selectMode: "single" }));
                    setIsValidated(false);
                  }}
                  label={en("detailTrialBalance.options.single")}
                />
              </div>

              <div className="flex items-center gap-10">
                <BilingualBlockLabel
                  label={en("detailTrialBalance.fields.reportType")}
                  labelHi={t("detailTrialBalance.fields.reportType")}
                />
                <ReportOption
                  checked={values.reportType === "pdf"}
                  onChange={() => {
                    setValues((prev) => ({ ...prev, reportType: "pdf" }));
                    setIsValidated(false);
                  }}
                  type="pdf"
                />
                <ReportOption
                  checked={values.reportType === "xls"}
                  onChange={() => {
                    setValues((prev) => ({ ...prev, reportType: "xls" }));
                    setIsValidated(false);
                  }}
                  type="xls"
                />
              </div>
            </div>
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
            disabled
            className={`${buttonBase} cursor-not-allowed bg-slate-100 text-slate-400`}
          >
            {en("common.apply")}
            <Check size={18} />
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

function BilingualBlockLabel({ label, labelHi }: { label: string; labelHi?: string }) {
  return (
    <div className="min-w-[80px] text-[15px] font-semibold leading-snug text-[#1F2937]">
      <div>{label}</div>
      {labelHi ? <div className="text-[#64748B]">{labelHi}</div> : null}
    </div>
  );
}

function RadioOption({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 text-[15px] font-semibold text-black">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-primary"
      />
      {label}
    </label>
  );
}

function ReportOption({
  checked,
  onChange,
  type,
}: {
  checked: boolean;
  onChange: () => void;
  type: ReportType;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-primary"
      />
      <span className="relative block h-9 w-8 rounded-md border border-slate-200 bg-white shadow-sm">
        <span className="absolute right-0 top-0 h-3 w-3 rounded-bl-sm bg-slate-200" />
        <span
          className={`absolute -left-1 bottom-2 rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${
            type === "pdf" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {type.toUpperCase()}
        </span>
      </span>
    </label>
  );
}
