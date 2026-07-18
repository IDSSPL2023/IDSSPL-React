import { Check, ChevronDown, LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SelectInputProps {
  icon?: LucideIcon;
  labelEn: string;
  labelMr?: string;
  value?: string;
  required?: boolean;
  editable?: boolean;
  options?: string[];
  onChange?: (value: string) => void;
  placeholder?: string;
}

interface BilingualLabelProps {
  en: string;
  mr?: string;
  required?: boolean;
}

const BilingualLabel = ({ en, mr, required }: BilingualLabelProps) => (
  <label
    className="mb-1.5 block text-[1rem] font-medium text-black dark:text-slate-100"
    title={mr ? `${en} / ${mr}` : en}
  >
    {en}
    {mr && (
      <>
        <span className="text-slate-400"> / </span>
        <span className="text-[#64748B]">{mr}</span>
      </>
    )}
    {required && <span className="ml-0.5 text-rose-500">*</span>}
  </label>
);

function SelectInput({
  icon: Icon,
  labelEn,
  labelMr,
  value,
  required = true,
  options = [],
  editable = true,
  onChange,
  placeholder = "Select",
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSelect = (option: string) => {
    onChange?.(option);
    setIsOpen(false);
  };

  const startEditing = () => {
    if (!editable) return;
    setDraft(value ?? "");
    setIsEditing(true);
  };

  const commit = () => {
    setIsEditing(false);
    if (draft.trim()) {
      onChange?.(draft);
    } else {
      setDraft(value ?? "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setDraft(value ?? "");
    }
  };

  // Dropdown variant
  if (options.length > 0) {
    return (
      <div ref={containerRef} className="flex h-full min-w-0 flex-col">
        <BilingualLabel en={labelEn} mr={labelMr} required={required} />

        <div className="relative flex-1">
          <button
            type="button"
            disabled={!editable}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`
              flex h-12 w-full items-center rounded-xl border px-3 text-left transition-all
              ${
                isOpen
                  ? "border-primary ring-2 ring-primary/10"
                  : "border-slate-600 hover:border-primary"
              }
              ${!editable ? "cursor-default bg-slate-50" : "bg-white hover:bg-slate-50"}
            `}
          >
            {Icon && (
              <Icon
                className="w-5 text-[#6B7280] dark:text-slate-400"
                strokeWidth={1.8}
              />
            )}

            <span
              className={`flex-1 truncate text-sm ${Icon ? "ml-3" : ""} ${
                value ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {value || placeholder}
            </span>

            <ChevronDown
              className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && editable && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors
                    ${
                      option === value
                        ? "bg-primary-50 text-primary"
                        : "hover:bg-slate-50"
                    }
                  `}
                >
                  <span>{option}</span>
                  {option === value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Editable text input variant
  return (
    <div className="flex h-full w-full flex-col">
      <BilingualLabel en={labelEn} mr={labelMr} required={required} />

      <div
        className={`
          flex h-12 items-center rounded-lg border border-slate-600 px-3 transition-colors
          ${!editable ? "bg-slate-50" : "bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"}
          ${isEditing ? "border-primary ring-2 ring-primary/10" : ""}
        `}
      >
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.8} />
        )}

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className={`
              flex-1 bg-transparent text-sm outline-none
              ${Icon ? "ml-3" : ""}
              ${editable ? "text-slate-700" : "text-slate-500"}
            `}
            placeholder={placeholder}
            disabled={!editable}
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className={`
              flex-1 truncate text-left text-sm
              ${Icon ? "ml-3" : ""}
              ${value ? "text-slate-700" : "text-slate-400"}
              ${editable ? "hover:text-slate-900" : "cursor-default"}
            `}
            disabled={!editable}
          >
            {value || placeholder}
          </button>
        )}

        <ChevronDown
          className={`
            h-5 w-5 text-slate-400 transition-transform duration-200
            ${isEditing ? "rotate-180" : ""}
          `}
        />
      </div>
    </div>
  );
}

export default SelectInput;
