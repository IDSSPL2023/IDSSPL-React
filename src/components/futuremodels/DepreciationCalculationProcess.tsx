import { useState } from "react";
import type { ReactNode } from "react";
import { BarChart3, Calculator, Calendar, Check, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

export interface DepreciationCalculationData {
  fromDate: string;
  toDate: string;
  balanceDate: string;
  roundingRequired: boolean;
}

export interface DepreciationCalculationProcessProps {
  open: boolean;
  onClose: () => void;
  onValidate?: (data: DepreciationCalculationData) => void;
  onCalculate?: (data: DepreciationCalculationData) => void;
  onReport?: (data: DepreciationCalculationData) => void;
  onApply?: (data: DepreciationCalculationData) => void;
}

type DateFieldKey = "fromDate" | "toDate" | "balanceDate";

const INITIAL_VALUES: DepreciationCalculationData = {
  fromDate: "",
  toDate: "",
  balanceDate: "",
  roundingRequired: false,
};

const DATE_FIELDS: Array<{
  key: DateFieldKey;
  labelKey: string;
  placeholderKey: string;
}> = [
  {
    key: "fromDate",
    labelKey: "depreciationCalculation.fields.fromDate",
    placeholderKey: "depreciationCalculation.placeholders.fromDate",
  },
  {
    key: "toDate",
    labelKey: "depreciationCalculation.fields.toDate",
    placeholderKey: "depreciationCalculation.placeholders.toDate",
  },
  {
    key: "balanceDate",
    labelKey: "depreciationCalculation.fields.balanceDate",
    placeholderKey: "depreciationCalculation.placeholders.balanceDate",
  },
];

const buttonBase =
  "flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-lg px-7 text-[16px] font-semibold transition";

export default function DepreciationCalculationProcess({
  open,
  onClose,
  onValidate,
  onCalculate,
  onReport,
  onApply,
}: DepreciationCalculationProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<DepreciationCalculationData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<DateFieldKey, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  if (!open) return null;

  const updateValue = <K extends keyof DepreciationCalculationData>(
    key: K,
    value: DepreciationCalculationData[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key !== "roundingRequired") {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    setIsValidated(false);
    setIsCalculated(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<DateFieldKey, string>> = {};
    DATE_FIELDS.forEach((field) => {
      if (!values[field.key].trim()) nextErrors[field.key] = en("common.fieldRequired");
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validate()) return;
    setIsValidated(true);
    onValidate?.(values);
  };

  const handleCalculate = () => {
    if (!validate()) return;
    setIsValidated(true);
    setIsCalculated(true);
    onCalculate?.(values);
  };

  const handleReport = () => {
    if (!validate()) return;
    setIsValidated(true);
    onReport?.(values);
  };

  const handleApply = () => {
    if (!isCalculated) return;
    onApply?.(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[860px] rounded-[22px] bg-white p-5 shadow-2xl">
        <div className="rounded-[18px] bg-white">
          <div className="flex items-start gap-4 border-b border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[24px] font-bold leading-tight text-[#1F2858]">
                {en("depreciationCalculation.title")}
                {t("depreciationCalculation.title") ? (
                  <span className="text-[#64748B]"> / {t("depreciationCalculation.title")}</span>
                ) : null}
              </h2>
              <p className="mt-2 text-[15px] leading-snug text-[#64748B]">
                {en("depreciationCalculation.subtitle")}
                {t("depreciationCalculation.subtitle") ? (
                  <span> / {t("depreciationCalculation.subtitle")}</span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="m-3 space-y-7 border border-primary border-t-4 p-5 rounded-xl">
            {DATE_FIELDS.map((field) => (
              <FormField
                key={field.key}
                label={en(field.labelKey)}
                labelHi={t(field.labelKey)}
                error={errors[field.key]}
              >
                <DateInput
                  value={values[field.key]}
                  onChange={(value) => updateValue(field.key, value)}
                  placeholder={tRaw(field.placeholderKey)}
                />
              </FormField>
            ))}

            <div className="flex items-center gap-16 pt-4">
              <BilingualBlockLabel
                label={en("depreciationCalculation.fields.roundingRequired")}
                labelHi={t("depreciationCalculation.fields.roundingRequired")}
              />
              <RadioOption
                checked={values.roundingRequired}
                onChange={() => updateValue("roundingRequired", true)}
                label={en("common.yes")}
              />
              <RadioOption
                checked={!values.roundingRequired}
                onChange={() => updateValue("roundingRequired", false)}
                label={en("common.no")}
              />
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleValidate}
            className={`${buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={20} />
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className={`${buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.calculate")}
            <Calculator size={18} />
          </button>
          <button
            type="button"
            onClick={handleReport}
            className={`${buttonBase} bg-primary-50 text-primary hover:bg-primary-100`}
          >
            {en("common.report")}
            <BarChart3 size={18} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${buttonBase} ${
              isCalculated
                ? "bg-primary text-white hover:bg-primary-700"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.apply")}
            <Check size={20} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={22} />
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
      <label className="mb-3 block text-[16px] font-semibold leading-none text-[#111827]">
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
    <div className="min-w-[260px] text-[16px] font-semibold leading-snug text-[#111827]">
      <div>{label}</div>
      {labelHi ? <div className="text-[#64748B]">{labelHi}</div> : null}
    </div>
  );
}

function DateInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex h-12 items-center rounded-lg border border-[#7E8796] bg-white px-4 text-[16px] text-slate-700">
      <Calendar size={20} className="mr-3 shrink-0 text-[#64748B]" />
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
      />
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
    <label className="flex items-center gap-3 text-[16px] font-semibold text-black">
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
