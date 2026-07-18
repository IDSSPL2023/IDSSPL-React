import { LucideIcon, MoreVertical } from "lucide-react";
import { MouseEventHandler, useId } from "react";

interface PickerInputProps {
  labelEn: string;
  labelHi: string;
  icon: LucideIcon | string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  required?: boolean;
  readOnly?: boolean;
  handleOpenList: MouseEventHandler<HTMLButtonElement>;
}

function PickerInput({
  labelEn,
  labelHi,
  icon: Icon,
  placeholder,
  value,
  onChange,
  hasError,
  required = true,
  readOnly = false,
  handleOpenList,
}: PickerInputProps) {
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

  return (
    <div className="flex items-end gap-2">
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
          {required && <span className="text-red-500">*</span>}
        </label>

        <div className={getContainerClasses()}>
          {typeof Icon === "string" ? (
            <img src={Icon} alt="icon" className="h-5 aspect-square" />
          ) : (
            <Icon
              size={20}
              className="shrink-0 text-[#6B7280] dark:text-slate-400"
              aria-hidden="true"
            />
          )}

          {readOnly ? (
            <span
              className={`ml-3 w-full truncate text-[15px] ${
                value
                  ? "text-slate-500 dark:text-slate-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {value || placeholder}
            </span>
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
            />
          )}
        </div>

        {hasError && (
          <p
            id={errorId}
            className="mt-1 text-xs text-red-500 dark:text-red-400"
          >
            This field is required
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleOpenList}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-primary transition-colors hover:bg-primary-200"
        aria-label={`Open ${labelEn} list`}
      >
        <MoreVertical size={20} />
      </button>
    </div>
  );
}

export default PickerInput;
