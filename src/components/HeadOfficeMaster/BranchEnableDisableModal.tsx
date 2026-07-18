import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FC } from "react";
import { Building2, Calendar, Check, Landmark, LucideIcon, Upload, X } from "lucide-react";

type TransactionState = "enable" | "disable";

interface BranchFormData {
  branchCode: string;
  transactionAllowed: TransactionState;
  workingDate: string;
}

interface BranchRow {
  branchCode?: string;
  code?: string;
  accountId?: string;
  minBalanceId?: string;
}

interface BranchEnableDisableModalProps {
  row?: BranchRow;
  onClose?: () => void;
  onSubmit?: (data: BranchFormData) => void;
}

type FormErrors = Partial<Record<keyof BranchFormData, boolean>>;

const REQUIRED_FIELDS: (keyof BranchFormData)[] = ["branchCode", "workingDate"];

const getBranchCode = (row?: BranchRow): string =>
  row?.branchCode || row?.code || row?.accountId || row?.minBalanceId || "";

const TRANSACTION_OPTIONS: { value: TransactionState; label: string }[] = [
  { value: "enable", label: "Enable" },
  { value: "disable", label: "Disable" },
];

interface TextInputFieldProps {
  id: string;
  label: string;
  labelMarathi?: string;
  icon: LucideIcon;
  value: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  type?: string;
  variant?: "filled" | "plain";
  onFocus?: () => void;
  onBlur?: () => void;
  onChange: (value: string) => void;
}

const TextInputField: FC<TextInputFieldProps> = ({
  id,
  label,
  icon: Icon,
  value,
  placeholder,
  required,
  error,
  type = "text",
  variant = "plain",
  onFocus,
  onBlur,
  onChange,
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1 block text-[14px] font-semibold text-[#111827] dark:text-slate-100"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div
      className={`flex h-12 items-center rounded-xl border px-5 transition dark:bg-slate-800 ${
        variant === "filled" ? "bg-slate-100/70" : "bg-white dark:bg-slate-900"
      } ${error ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
    >
      <Icon size={22} className="shrink-0 text-slate-500" aria-hidden="true" />
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={error || undefined}
        aria-required={required || undefined}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="ml-3 w-full bg-transparent text-lg text-slate-700 outline-none placeholder:text-slate-500 [color-scheme:light] dark:text-slate-100 dark:[color-scheme:dark]"
      />
    </div>
  </div>
);

interface ToggleGroupProps {
  label: string;
  required?: boolean;
  value: TransactionState;
  options: { value: TransactionState; label: string }[];
  onChange: (value: TransactionState) => void;
}

const ToggleGroup: FC<ToggleGroupProps> = ({ label, required, value, options, onChange }) => (
  <div role="radiogroup" aria-label={label}>
    <p className="mb-2 text-[14px] font-semibold text-[#111827] dark:text-slate-100">
      {label}
      {required && <span className="text-red-500">*</span>}
    </p>
    <div className="flex flex-wrap items-center gap-10">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className="flex items-center gap-2 text-md font-medium text-slate-600 dark:text-slate-300"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-md border-2 ${
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-primary bg-white text-transparent dark:bg-slate-900"
              }`}
            >
              <Check size={21} strokeWidth={2.8} />
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

const BranchEnableDisableModal: FC<BranchEnableDisableModalProps> = ({ row, onClose, onSubmit }) => {
  const branchCode = useMemo(() => getBranchCode(row), [row]);
  const [formData, setFormData] = useState<BranchFormData>({
    branchCode,
    transactionAllowed: "enable",
    workingDate: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [dateFocused, setDateFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const updateField = <K extends keyof BranchFormData>(field: K, value: BranchFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    REQUIRED_FIELDS.forEach((field) => {
      nextErrors[field] = !String(formData[field]).trim();
    });
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (submitting || !validate()) return;
    try {
      setSubmitting(true);
      await onSubmit?.(formData);
      onClose?.();
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="branch-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-2xl overflow-visible rounded-3xl bg-white p-8 shadow-2xl outline-none dark:bg-slate-900"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 -z-10 h-56 w-56 rounded-full bg-primary-100/70 dark:bg-primary-950/40" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-56 w-56 rounded-full bg-primary-100/70 dark:bg-primary-950/40" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-700 text-white shadow-sm ring-4 ring-white dark:ring-slate-900">
              <Landmark size={26} strokeWidth={2.4} aria-hidden="true" />
            </div>
            <h2 id="branch-modal-title" className="text-xl font-bold leading-tight text-[#10164A] dark:text-slate-100">
              Branch enable / disable |
              <br />
              <span className="text-[#64748B]">ब्रांच चालू / बंद करणे</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 text-slate-400 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X size={22} strokeWidth={2.4} />
          </button>
        </div>

        <div className="relative mt-7 space-y-4">
          <TextInputField
            id="branchCode"
            label="Branch Code"
            icon={Building2}
            value={formData.branchCode}
            placeholder="0000"
            required
            variant="filled"
            error={errors.branchCode}
            onChange={(value) => updateField("branchCode", value)}
          />

          <ToggleGroup
            label="Is Transaction Allowed"
            required
            value={formData.transactionAllowed}
            options={TRANSACTION_OPTIONS}
            onChange={(value) => updateField("transactionAllowed", value)}
          />

          <TextInputField
            id="workingDate"
            label="Working Date"
            icon={Calendar}
            value={formData.workingDate}
            placeholder="Select Date"
            required
            error={errors.workingDate}
            type={dateFocused || formData.workingDate ? "date" : "text"}
            onFocus={() => setDateFocused(true)}
            onBlur={() => setDateFocused(false)}
            onChange={(value) => updateField("workingDate", value)}
          />
        </div>

        <div className="relative mt-8 flex flex-wrap justify-center gap-7">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-12 min-w-33 items-center justify-center gap-3 rounded-xl border-2 border-primary bg-white px-6 text-lg font-medium text-slate-600 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 dark:text-slate-300"
          >
            Cancel <X size={24} />
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex h-12 min-w-33 items-center justify-center gap-3 rounded-xl bg-primary px-6 text-lg font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"} <Upload size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchEnableDisableModal;
