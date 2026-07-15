interface RadioInputProps {
  label: string;
  labelHi?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  options?: [string, string];
}

const RadioInput = ({
  label,
  labelHi,
  value,
  onChange,
  disabled = false,
  options = ["Day", "Month"],
}: RadioInputProps) => {
  const handleChange = (selectedValue: string) => {
    if (!disabled) {
      onChange(selectedValue);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 last:mb-0">
      <label className="block text-sm font-medium text-[#1F2858] whitespace-nowrap">
        {label}
        {labelHi && (
          <>
            <span className="text-slate-600"> / </span>
            <span className="text-slate-600">{labelHi}</span>
          </>
        )}
      </label>

      <div className="flex items-center gap-6">
        {options.map((opt) => {
          const radioId = `radio-${opt.toLowerCase().replace(/\s/g, "-")}`;
          const isChecked = value === opt;

          return (
            <label
              key={opt}
              htmlFor={radioId}
              className={`flex items-center gap-2 text-sm text-slate-700 ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <input
                id={radioId}
                type="radio"
                value={opt}
                checked={isChecked}
                onChange={(e) => handleChange(e.target.value)}
                disabled={disabled}
                className={`h-4 w-4 shrink-0 ${
                  disabled
                    ? "cursor-not-allowed accent-gray-300"
                    : "accent-primary cursor-pointer"
                }`}
              />
              <span className={disabled ? "opacity-60" : ""}>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RadioInput;
