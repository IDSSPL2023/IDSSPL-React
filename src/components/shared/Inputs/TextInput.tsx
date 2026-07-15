import { LucideIcon } from "lucide-react";

interface TextInputProps {
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  required?: boolean;
  readOnly?: boolean;
}

function TextInput({
  labelEn,
  labelHi,
  icon: Icon,
  placeholder,
  value,
  onChange,
  hasError,
  required = true,
  readOnly = false,
}: TextInputProps) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-[1rem] font-medium text-black dark:text-slate-100">
        {labelEn}{" "}
        <span className="font-medium text-gray-500 dark:text-slate-400">
          / {labelHi}
        </span>
        {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`flex h-12 items-center rounded-xl border px-3 transition-colors border-[#6A7282] ${
          hasError
            ? "border-red-400 bg-white dark:bg-slate-900"
            : readOnly
              ? "bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              : "bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:bg-slate-900 dark:border-slate-700"
        }`}
      >
        <Icon
          size={18}
          className="shrink-0 text-[#6B7280] dark:text-slate-400"
        />
        {readOnly ? (
          <span
            className={`ml-3 w-full truncate text-[15px] ${value ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}
          >
            {value || placeholder}
          </span>
        ) : (
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="ml-3 w-full bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder-slate-500"
          />
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
          This field is required
        </p>
      )}
    </div>
  );
}

export default TextInput;
