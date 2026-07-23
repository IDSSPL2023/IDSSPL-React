import { useState } from "react";
import type { ReactNode } from "react";
import { Calendar, Check, FileText, Percent, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import ModalCloseButton from "@/components/common/ModalCloseButton";
import { formatDateDDMMMYYYY } from "@/lib/dateFormat";

export interface InterestPostingProcessData {
  asOnDate: string;
  interestRate: string;
}

export interface InterestPostingProcessProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: InterestPostingProcessData) => void;
  onGenerateReport?: (data: InterestPostingProcessData) => void;
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
    icon: <Calendar size={18} />,
    type: "date",
    validate: validateDate,
  },
  {
    key: "interestRate",
    labelKey: "interestPostingProcess.fields.interestRate",
    icon: <Percent size={18} />,
    type: "text",
    inputMode: "decimal",
    placeholderKey: "interestPostingProcess.placeholders.toDate",
    validate: validateRate,
  },
];

const buttonBase =
  "flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

export default function InterestPostingProcess({
  open,
  onClose,
  onSave,
  onGenerateReport,
}: InterestPostingProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<InterestPostingProcessData>({
    asOnDate: "",
    interestRate: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [isValidated, setIsValidated] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-4 shadow-2xl">
        <div className="rounded-2xl p-3">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
                <UserRound size={22} />
              </div>
              <div className="min-w-0">
                <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                  {en("common.accountDetails")}
                  {t("common.accountDetails") ? (
                    <span className="text-[#64748B]"> / {t("common.accountDetails")}</span>
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
            <ModalCloseButton onClose={onClose} />
          </div>

          <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
            <div className="space-y-5">
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

        <div className="mt-6 flex flex-wrap items-center justify-end gap-6">
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
            onClick={handleGenerateReport}
            className={`${buttonBase} min-w-[128px] ${
              isValidated
                ? "bg-primary text-white hover:bg-primary-700 cursor-pointer"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("interestPostingProcess.actions.generateReports")}
            <FileText size={17} />
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
    <div className="relative flex h-11 items-center rounded-lg border border-[#7E8796] bg-white px-4 text-[15px] text-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <span className="mr-3 shrink-0 text-[#64748B]">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5] ${type === "date" ? "text-transparent caret-transparent" : ""}`}
      />
      {type === "date" && (
        <span className={`pointer-events-none absolute left-[42px] ${formatDateDDMMMYYYY(value) ? "" : "text-[#8B95A5]"}`}>
          {formatDateDDMMMYYYY(value) || placeholder}
        </span>
      )}
    </div>
  );
}