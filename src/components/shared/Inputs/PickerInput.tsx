import { LucideIcon, MoreVertical } from "lucide-react";
import { MouseEventHandler } from "react";

interface PickerInputProps {
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
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
  const ToolPick = ({}: {}) => (
    <button
      type="button"
      onClick={handleOpenList}
      className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEF2FF] text-primary hover:bg-primary-200"
    >
      <MoreVertical size={20} />
    </button>
  );

  return (
    <div className="flex gap-2 items-end">
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

      <ToolPick />
    </div>
  );
}

export default PickerInput;
