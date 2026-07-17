import { useState } from "react";
import type { ReactNode } from "react";
import { Check, FileSpreadsheet, Percent, Printer, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

type SelectMode = "regular" | "closing";

export interface NFormBalancesheetData {
  productCode: string;
  lastQuarterDate: string;
  select: SelectMode;
}

export interface NFormBalancesheetProcessProps {
  open: boolean;
  onClose: () => void;
  onGenerateNForm?: (data: NFormBalancesheetData) => void;
  onGeneratePnL?: (data: NFormBalancesheetData) => void;
}

const INITIAL_VALUES: NFormBalancesheetData = {
  productCode: "0002",
  lastQuarterDate: "",
  select: "closing",
};

const buttonBase =
  "flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-[12px] font-semibold transition";

export default function NFormBalancesheetProcess({
  open,
  onClose,
  onGenerateNForm,
  onGeneratePnL,
}: NFormBalancesheetProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<NFormBalancesheetData>(INITIAL_VALUES);
  const [error, setError] = useState<string | undefined>();
  const [isGenerated, setIsGenerated] = useState(false);

  if (!open) return null;

  const validate = () => {
    const nextError = values.lastQuarterDate.trim() ? undefined : en("common.fieldRequired");
    setError(nextError);
    return !nextError;
  };

  const handleGenerateRecord = () => {
    if (!validate()) {
      setIsGenerated(false);
      return;
    }
    setIsGenerated(true);
  };

  const handleGenerateNForm = () => {
    if (!isGenerated) return;
    onGenerateNForm?.(values);
  };

  const handleGeneratePnL = () => {
    if (!isGenerated) return;
    onGeneratePnL?.(values);
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
              {en("nFormBalancesheet.title")}
              {t("nFormBalancesheet.title") ? (
                <span className="text-[#64748B]"> / {t("nFormBalancesheet.title")}</span>
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
              label={en("nFormBalancesheet.fields.productCode")}
              labelHi={t("nFormBalancesheet.fields.productCode")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <FileSpreadsheet size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {values.productCode}
              </div>
            </FormField>

            <FormField
              label={en("nFormBalancesheet.fields.lastQuarterDate")}
              labelHi={t("nFormBalancesheet.fields.lastQuarterDate")}
              error={error}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-white px-4 text-[15px] text-slate-700">
                <Percent size={18} className="mr-3 shrink-0 text-[#64748B]" />
                <input
                  type="text"
                  value={values.lastQuarterDate}
                  onChange={(event) => {
                    setValues((prev) => ({ ...prev, lastQuarterDate: event.target.value }));
                    setError(undefined);
                    setIsGenerated(false);
                  }}
                  placeholder={tRaw("nFormBalancesheet.placeholders.enterToDate")}
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
                />
              </div>
            </FormField>

            <div className="flex items-center gap-10">
              <BilingualBlockLabel
                label={en("nFormBalancesheet.fields.select")}
                labelHi={t("nFormBalancesheet.fields.select")}
              />
              <RadioOption
                checked={values.select === "regular"}
                onChange={() => {
                  setValues((prev) => ({ ...prev, select: "regular" }));
                  setIsGenerated(false);
                }}
                label={en("nFormBalancesheet.options.regular")}
              />
              <RadioOption
                checked={values.select === "closing"}
                onChange={() => {
                  setValues((prev) => ({ ...prev, select: "closing" }));
                  setIsGenerated(false);
                }}
                label={en("nFormBalancesheet.options.closing")}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 ">
          <button
            type="button"
            onClick={handleGenerateRecord}
            className={`${buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("nFormBalancesheet.actions.generateRecord")}
            <Check size={18} />
          </button>
          <button
            type="button"
            disabled={!isGenerated}
            onClick={handleGenerateNForm}
            className={`${buttonBase} ${
              isGenerated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("nFormBalancesheet.actions.generateNFormBalanceSheet")}
            <Printer size={17} />
          </button>
          <button
            type="button"
            disabled={!isGenerated}
            onClick={handleGeneratePnL}
            className={`${buttonBase} ${
              isGenerated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("nFormBalancesheet.actions.generatePnL")}
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
