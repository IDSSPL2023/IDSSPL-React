import { useState } from "react";
import type { ReactNode } from "react";
import { Calendar, Check, FileText, Percent, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

export interface InterestPostingProcessData {
  asOnDate: string;
  interestRate: string;
}

export interface InterestPostingProcessProps {
  onClose: () => void;
  onSave?: (data: InterestPostingProcessData) => void;
  onGenerateReport?: (data: InterestPostingProcessData) => void;
  variant?: "modal" | "page";
}

type FieldKey = keyof InterestPostingProcessData;

// Single source of truth for field config — DRY: add/remove fields here only.
interface FieldConfig {
  key: FieldKey;
  labelKey: string;
  icon: ReactNode;
  type: "date" | "text";
  inputMode?: "decimal" | "text" | "numeric";
  placeholderKey?: string;
  validate: (value: string) => string;
}

const validateDate = (value: string) => {
  if (!value) return "This field is required";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Enter a valid date";
  return "";
};

const validateRate = (value: string) => {
  if (!value.trim()) return "This field is required";
  const num = Number(value);
  if (Number.isNaN(num)) return "Enter a valid number";
  if (num < 0 || num > 100) return "Rate must be between 0 and 100";
  return "";
};

const FIELDS: FieldConfig[] = [
  {
    key: "asOnDate",
    labelKey: "interestPostingProcess.fields.asOnDate",
    icon: <Calendar size={15} />,
    type: "date",
    validate: validateDate,
  },
  {
    key: "interestRate",
    labelKey: "interestPostingProcess.fields.interestRate",
    icon: <Percent size={15} />,
    type: "text",
    inputMode: "decimal",
    placeholderKey: "interestPostingProcess.placeholders.toDate",
    validate: validateRate,
  },
];

export default function InterestPostingProcess({
  onClose,
  onSave,
  onGenerateReport,
  variant = "modal",
}: InterestPostingProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<InterestPostingProcessData>({
    asOnDate: "",
    interestRate: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [isValidated, setIsValidated] = useState(false);

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
      return;
    }
    onSave?.(values);
    setIsValidated(true);
  };

  const handleGenerateReport = () => {
    if (!isValidated) return;
    onGenerateReport?.(values);
  };

  const handleFieldChange = (field: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsValidated(false);
  };

  const content = (
    <div className="w-full max-w-[500px] rounded-xl bg-white p-3 shadow-2xl">
      <div className="rounded-2xl p-3">
        <div className="flex items-start gap-2 border-b border-slate-100 pb-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary">
            <UserRound size={17} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold leading-tight text-[#1F2858]">
              {en("common.accountDetails")}
              {t("common.accountDetails") ? (
                <span className="text-[#64748B]"> / {t("common.accountDetails")}</span>
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
                  inputMode={field.inputMode}
                />
              </FormField>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-4">
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
          disabled={!isValidated}
          onClick={handleGenerateReport}
          className={`flex h-9 min-w-[128px] items-center justify-center gap-1.5 rounded-md px-5 text-[12px] font-semibold transition ${
            isValidated
              ? "bg-primary text-white hover:bg-primary-700 cursor-pointer"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
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

// Single reusable input — handles text and native date types so there's
// only one styled input shell in the whole file (DRY).
function IconInput({
  icon,
  value,
  onChange,
  placeholder,
  inputMode,
  type = "text",
}: {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "decimal" | "text" | "numeric";
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
        inputMode={inputMode}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
      />
    </div>
  );
}