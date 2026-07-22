import React from "react";

export interface ToggleOption {
  key: string;
  label: string;
  labelHi?: string;
}

interface ToggleButtonsProps {
  options: ToggleOption[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

function ToggleButtons({
  options,
  activeKey,
  onChange,
  className = "",
}: ToggleButtonsProps) {
  return (
    <div className={`flex items-center gap-1 bg-[#EEF2FF] rounded-full p-2 ${className}`}>
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onChange(option.key)}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            activeKey === option.key
              ? "bg-[#0B63C1] text-white shadow-md"
              : "text-gray-600 hover:text-gray-900 hover:bg-blue-200"
          }`}
          title={option.labelHi}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ToggleButtons;