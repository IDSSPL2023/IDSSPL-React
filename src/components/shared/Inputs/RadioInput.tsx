import React from "react";

interface RadioOption {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
}

interface RadioInputProps {
  label: string;
  labelHi?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  options?: RadioOption[] | string[];
  orientation?: "horizontal" | "vertical";
}

const RadioInput = ({
  label,
  labelHi,
  value,
  onChange,
  disabled = false,
  options = ["Day", "Month"],
  orientation = "horizontal",
}: RadioInputProps) => {
  const handleChange = (selectedValue: string) => {
    if (!disabled) {
      onChange(selectedValue);
    }
  };

  // Normalize options to RadioOption[]
  const normalizedOptions: RadioOption[] = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }
    return opt;
  });

  return (
    <div className="flex items-center justify-between gap-4 last:mb-0 w-full">
      {/* Label with translation on next line */}
      <div className="flex flex-col shrink-0">
        <label className="text-sm font-medium text-[#1F2858] dark:text-slate-100 whitespace-nowrap">
          {label}
        </label>
        {labelHi && (
          <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {labelHi}
          </span>
        )}
      </div>

      {/* Radio options */}
      <div
        className={`flex ${
          orientation === "horizontal" ? "flex-row" : "flex-col"
        } items-center gap-4 flex-wrap`}
      >
        {normalizedOptions.map((opt) => {
          const radioId = `radio-${opt.value.toLowerCase().replace(/\s/g, "-")}`;
          const isChecked = value === opt.value;

          return (
            <label
              key={opt.value}
              htmlFor={radioId}
              className={`flex items-center gap-2 text-sm text-slate-700 ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <input
                id={radioId}
                type="radio"
                value={opt.value}
                checked={isChecked}
                onChange={(e) => handleChange(e.target.value)}
                disabled={disabled}
                className={`h-4 w-4 shrink-0 ${
                  disabled
                    ? "cursor-not-allowed accent-gray-300"
                    : "accent-primary cursor-pointer"
                }`}
              />
              {/* Show icon if present */}
              {opt.icon && (
                <span className={opt.iconClassName || "flex items-center"}>
                  {typeof opt.icon === "string" ? (
                    <img
                      src={opt.icon}
                      alt={opt.label || opt.value}
                      className="h-10 w-8 object-contain"
                    />
                  ) : (
                    opt.icon
                  )}
                </span>
              )}
              {/* Show label only if there's no icon, or if there's both icon and label */}
              {!opt.icon && (
                <span className={disabled ? "opacity-60" : ""}>
                  {opt.label || opt.value}
                </span>
              )}
              {opt.icon && opt.label && (
                <span className={disabled ? "opacity-60" : ""}>
                  {opt.label}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RadioInput;
