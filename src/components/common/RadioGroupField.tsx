export interface RadioGroupOption {
  value: string;
  label: string;
}

export interface RadioGroupFieldProps {
  label: string;
  labelHi?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioGroupOption[] | string[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  orientation?: "horizontal" | "vertical";
}

const normalizeOptions = (options: RadioGroupOption[] | string[]): RadioGroupOption[] =>
  options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

export default function RadioGroupField({
  label,
  labelHi,
  value,
  onChange,
  options,
  disabled = false,
  required,
  error,
  orientation = "horizontal",
}: RadioGroupFieldProps) {
  const normalized = normalizeOptions(options);

  return (
    <div className="flex min-w-0 flex-col">
      <span className="mb-1.5 block text-sm font-medium text-[#1F2858]">
        {label}
        {labelHi && (
          <>
            <span className="text-slate-400"> / </span>
            <span className="text-[#64748B]">{labelHi}</span>
          </>
        )}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      <div className={`flex h-11 items-center gap-6 ${orientation === "vertical" ? "flex-col items-start gap-2" : ""}`}>
        {normalized.map((opt) => {
          const checked = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className="flex items-center gap-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  checked ? "border-primary" : "border-slate-300"
                }`}
              >
                {checked && <span className="h-[9px] w-[9px] rounded-full bg-primary" />}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
