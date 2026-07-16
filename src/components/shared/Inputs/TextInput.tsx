import { LucideIcon } from "lucide-react";
import { useId } from "react";

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
  const inputId = useId();
  const errorId = useId();

  const getContainerClasses = () => {
    const baseClasses =
      "flex h-12 items-center rounded-xl border px-3 transition-colors";
    const borderClass = hasError ? "border-red-400" : "border-[#6A7282]";

    const stateClasses = readOnly
      ? "bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
      : "bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:bg-slate-900 dark:border-slate-700";

    return `${baseClasses} ${borderClass} ${stateClasses}`;
  };

  const getTextClasses = () => {
    const baseClasses = "ml-3 w-full truncate text-[15px]";
    const colorClasses = value
      ? "text-slate-500 dark:text-slate-400"
      : "text-slate-400 dark:text-slate-500";
    return `${baseClasses} ${colorClasses}`;
  };

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-[1rem] font-medium text-black dark:text-slate-100"
      >
        {labelEn}
        <span className="font-medium text-gray-500 dark:text-slate-400">
          {" / "}
          {labelHi}
        </span>
        {required && (
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className={getContainerClasses()}>
        <Icon
          size={18}
          className="shrink-0 text-[#6B7280] dark:text-slate-400"
          aria-hidden="true"
        />

        {readOnly ? (
          <span className={getTextClasses()}>{value || placeholder}</span>
        ) : (
          <input
            id={inputId}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            className="ml-3 w-full bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder-slate-500"
            disabled={readOnly}
          />
        )}
      </div>

      {hasError && (
        <p id={errorId} className="mt-1 text-xs text-red-500 dark:text-red-400">
          This field is required
        </p>
      )}
    </div>
  );
}

export default TextInput;
