import { useState } from "react";
import type { ReactNode } from "react";
import { Calculator, Calendar, Check, FileText, Hash, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

export interface SiInterestPostingData {
  productCode: string;
  uptoDate: string;
}

export interface SiInterestPostingProcessProps {
  open: boolean;
  onClose: () => void;
  onCalculate?: (data: SiInterestPostingData) => void;
  onGenerateReport?: (data: SiInterestPostingData) => void;
  onApply?: (data: SiInterestPostingData) => void;
}

type FieldKey = keyof SiInterestPostingData;

interface FieldConfig {
  key: FieldKey;
  labelKey: string;
  icon: ReactNode;
  type: "date" | "text";
  placeholderKey?: string;
  validate: (value: string) => string;
}

const validateRequired = (value: string) => (value.trim() ? "" : "This field is required");

const validateDate = (value: string) => {
  if (!value) return "This field is required";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Enter a valid date";
  return "";
};

const FIELDS: FieldConfig[] = [
  {
    key: "productCode",
    labelKey: "fields.productCode",
    icon: <Hash size={15} />,
    type: "text",
    validate: validateRequired,
  },
  {
    key: "uptoDate",
    labelKey: "siInterestPosting.fields.uptoDate",
    icon: <Calendar size={15} />,
    type: "date",
    placeholderKey: "siInterestPosting.placeholders.uptoDate",
    validate: validateDate,
  },
];

const buttonBase =
  "flex h-9 items-center justify-center gap-1.5 rounded-md px-5 text-[12px] font-semibold transition";
const activeOutline = "border border-primary bg-white text-primary hover:bg-primary-50";
const disabledStyle = "cursor-not-allowed bg-slate-100 text-slate-400";

export default function SiInterestPostingProcess({
  open,
  onClose,
  onCalculate,
  onGenerateReport,
  onApply,
}: SiInterestPostingProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<SiInterestPostingData>({
    productCode: "",
    uptoDate: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  if (!open) return null;

  const validate = () => {
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    FIELDS.forEach((field) => {
      const error = field.validate(values[field.key]);
      if (error) nextErrors[field.key] = error;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validate()) {
      setIsValidated(false);
      setIsCalculated(false);
      return;
    }
    setIsValidated(true);
  };

  const handleCalculate = () => {
    if (!isValidated) return;
    onCalculate?.(values);
    setIsCalculated(true);
  };

  const handleGenerateReport = () => {
    if (!isValidated) return;
    onGenerateReport?.(values);
  };

  const handleApply = () => {
    if (!isCalculated) return;
    onApply?.(values);
  };

  const handleFieldChange = (field: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsValidated(false);
    setIsCalculated(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[500px] rounded-xl bg-white p-3 shadow-2xl">
        <div className="rounded-2xl p-3">
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary">
                <UserRound size={17} />
              </div>
              <div className="min-w-0">
                <h2 className="text-[15px] font-bold leading-tight text-[#1F2858]">
                  {en("siInterestPosting.postingParameter")}
                  {t("siInterestPosting.postingParameter") ? (
                    <span className="text-[#64748B]"> / {t("siInterestPosting.postingParameter")}</span>
                  ) : null}
                </h2>
                <p className=" text-[11px] leading-snug text-slate-500">
                  {en("interestPostingProcess.subtitle")}
                  {t("interestPostingProcess.subtitle") ? (
                    <span> / {t("interestPostingProcess.subtitle")}</span>
                  ) : null}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={en("common.cancel")}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100"
            >
              <X size={15} />
            </button>
          </div>

          <div className="rounded-xl border border-primary border-t-4 bg-white px-4 pb-5 pt-4 shadow-[0_1px_8px_rgba(37,99,235,0.12)]">
            <div className="space-y-4">
              {FIELDS.map((field) => (
                <FormField
                  key={field.key}
                  label={en(field.labelKey)}
                  labelHi={t(field.labelKey)}
                  error={errors[field.key]}
                >
                  <IconInput
                    icon={field.icon}
                    type={field.type}
                    value={values[field.key]}
                    onChange={(value) => handleFieldChange(field.key, value)}
                    placeholder={field.placeholderKey ? tRaw(field.placeholderKey) : undefined}
                  />
                </FormField>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleValidate}
            className={`${buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={14} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleCalculate}
            className={`${buttonBase} ${isValidated ? activeOutline : disabledStyle}`}
          >
            {en("common.calculate")}
            <Calculator size={13} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleGenerateReport}
            className={`${buttonBase} ${isValidated ? activeOutline : disabledStyle}`}
          >
            {en("common.report")}
            <FileText size={13} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${buttonBase} min-w-[100px] ${isCalculated ? "bg-primary text-white hover:bg-primary-700 cursor-pointer" : disabledStyle}`}
          >
            {en("common.apply")}
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${buttonBase} ${activeOutline}`}
          >
            {en("common.cancel")}
            <X size={14} />
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
      <label className="mb-2 block text-[12px] font-semibold leading-none text-[#1F2937]">
        {label}
        {labelHi ? <span className="text-[#64748B]"> / {labelHi}</span> : null}
        <span className="ml-0.5 text-rose-600">*</span>
      </label>
      {children}
      {error ? <p className="mt-1 text-[11px] text-rose-600">{error}</p> : null}
    </div>
  );
}

function IconInput({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date";
}) {
  return (
    <div className="flex h-10 items-center rounded-md border border-[#A6AFBD] bg-white px-3 text-[12px] text-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <span className="mr-2 shrink-0 text-slate-500">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
