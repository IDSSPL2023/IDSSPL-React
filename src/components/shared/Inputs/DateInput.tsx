import { Calendar, LucideIcon } from "lucide-react";
import { useId, useRef, useEffect, useState } from "react";

interface DateInputProps {
  labelEn: string;
  labelHi?: string;
  icon?: LucideIcon | string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

function DateInput({
  labelEn,
  labelHi,
  icon: Icon = Calendar,
  value,
  onChange,
  hasError,
  required = true,
  readOnly = false,
  placeholder = "Select Date",
}: DateInputProps) {
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Open calendar when input is clicked or focused
  const handleInputClick = () => {
    if (!readOnly && inputRef.current) {
      setIsOpen(true);
      // Trigger the native date picker if available
      const input = inputRef.current as HTMLInputElement & {
        showPicker?: () => void;
      };
      if (typeof input.showPicker === "function") {
        input.showPicker();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    // Close calendar on blur with a small delay
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const getContainerClasses = () => {
    const baseClasses =
      "flex h-12 items-center rounded-xl border px-3 transition-colors";
    const borderClass = hasError
      ? "border-red-400"
      : readOnly
        ? "border-[#6A7282]"
        : "border-[#6A7282]";

    const stateClasses = readOnly
      ? "bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
      : "bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:bg-slate-900 dark:border-slate-700";

    return `${baseClasses} ${borderClass} ${stateClasses}`;
  };

  const getInputClasses = () => {
    const baseClasses =
      "w-full bg-transparent text-[15px] outline-none disabled:cursor-not-allowed";
    const colorClasses = readOnly
      ? "text-slate-500 dark:text-slate-400"
      : value
        ? "text-[#4B5563] dark:text-slate-100"
        : "text-slate-400 dark:text-slate-500";
    // Icon is always defined (has default), so we can use it directly
    const spacingClasses = "ml-3";

    return `${baseClasses} ${colorClasses} ${spacingClasses}`;
  };

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-[1rem] font-medium text-black dark:text-slate-100"
      >
        {labelEn}
        {labelHi && (
          <span className="font-medium text-gray-500 dark:text-slate-400">
            {" / "}
            {labelHi}
          </span>
        )}
        {required && (
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div ref={containerRef} className={getContainerClasses()}>
        {typeof Icon === "string" ? (
          <img src={Icon} alt="icon" className="h-5 aspect-square" />
        ) : (
          <Icon
            size={20}
            className="shrink-0 text-[#6B7280] dark:text-slate-400"
            aria-hidden="true"
          />
        )}

        <input
          ref={inputRef}
          id={inputId}
          type="date"
          value={value}
          readOnly={readOnly}
          disabled={readOnly}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={() => !readOnly && setIsOpen(true)}
          onBlur={handleBlur}
          className={getInputClasses()}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          placeholder={placeholder}
          style={{
            colorScheme: readOnly ? "light" : "light dark",
          }}
        />
      </div>

      {hasError && (
        <p id={errorId} className="mt-1 text-xs text-red-500 dark:text-red-400">
          This field is required
        </p>
      )}
    </div>
  );
}

export default DateInput;
