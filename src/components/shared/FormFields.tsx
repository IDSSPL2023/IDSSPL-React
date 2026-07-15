import { ChevronDown, Calendar, FileText, MoreVertical, X, Upload, Check, LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

// Figma "Read-only / filled" state — shared across TextInput, SelectInput and
// DateInput so every pre-filled, non-editable field looks identical.
const READONLY_FILLED_BG = "bg-[#F3F4F6]";
const READONLY_FILLED_BORDER = "border-[#6A7282]";
const READONLY_FILLED_SHADOW = "shadow-[0px_1px_0.5px_0.05px_#1D293D05]";
const READONLY_FILLED_ICON_COLOR = "text-[#6A7282]";

export interface FieldShellProps {
  label: string;
  labelHi?: string;
  required?: boolean;
  error?: boolean;
  children: ReactNode;
  className?: string;
  variant?: "default" | "large";
  noWrap?: boolean;
}

export const FieldShell = ({
  label,
  labelHi,
  required,
  error,
  children,
  className = "",
  variant = "default",
  noWrap = false,
}: FieldShellProps) => (
  <div className={className}>
    <label
      className={`mb-1.5 block text-black ${variant === "large"
          ? "text-[16px] font-semibold"
          : "text-sm font-medium"
        }`}
    >
      <span
        className={`flex items-center gap-1 ${
          noWrap ? "flex-nowrap whitespace-nowrap" : "flex-wrap"
        }`}
      >
        <span>{label}</span>
        {labelHi && (
          <span className={variant === "large" ? "font-medium text-gray-500" : "text-slate-600"}>
            / {labelHi}
          </span>
        )}
        {required && <span className="text-red-500">*</span>}
      </span>
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">This field is required</p>}
  </div>
);

export interface TextInputProps {
  icon?: ReactNode ;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: boolean;
  trailing?: ReactNode;
  type?: string;
}

export const TextInput = ({
  icon,
  value,
  onChange,
  placeholder,
  readOnly,
  error,
  trailing,
  type = "text",
}: TextInputProps) => {
  // Figma "Read-only / filled" state: a pre-filled field the user can't edit
  // (e.g. a name derived from a code lookup). Empty read-only fields and all
  // editable fields keep the existing styling untouched.
  const isFilledReadOnly = readOnly && value.trim() !== "";

  return (
    <div className="relative flex items-center gap-2">
      {icon && (
        <span
          className={`pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 ${
            isFilledReadOnly ? READONLY_FILLED_ICON_COLOR : "text-slate-500"
          }`}
        >
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={
          isFilledReadOnly
            ? `w-full h-12 rounded-lg border ${READONLY_FILLED_BG} py-3 ${icon ? "pl-[38px]" : "pl-[14px]"} pr-[14px] text-sm text-slate-700 outline-none ${READONLY_FILLED_SHADOW} ${
                error ? "border-red-400" : READONLY_FILLED_BORDER
              }`
            : `w-full rounded-lg border bg-white py-2.5 ${icon ? "pl-9" : "pl-3"} ${trailing ? "pr-11" : "pr-3"} text-sm text-slate-700 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
                readOnly ? "bg-slate-50 text-slate-600" : ""
              } ${error ? "border-red-400" : "border-slate-600"}`
        }
      />
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
};

export interface SelectInputProps {
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: boolean;
  readOnly?: boolean;
}

export const SelectInput = ({
  icon,
  value,
  onChange,
  options,
  placeholder = "Select",
  error,
  readOnly,
}: SelectInputProps) => {
  // Figma "Read-only / filled" state — see TextInput for details.
  const isFilledReadOnly = readOnly && value.trim() !== "";

  return (
    <div className="relative flex items-center">
      {icon && (
        <span
          className={`pointer-events-none absolute left-3.5 z-10 ${
            isFilledReadOnly ? READONLY_FILLED_ICON_COLOR : "text-slate-400"
          }`}
        >
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={readOnly ? -1 : undefined}
        className={
          isFilledReadOnly
            ? `w-full h-12 appearance-none rounded-lg border pointer-events-none ${READONLY_FILLED_BG} py-3 ${icon ? "pl-[38px]" : "pl-[14px]"} pr-9 text-sm text-slate-700 outline-none ${READONLY_FILLED_SHADOW} ${
                error ? "border-red-400" : READONLY_FILLED_BORDER
              }`
            : `w-full appearance-none rounded-lg border bg-white py-2.5 ${icon ? "pl-9" : "pl-3"} pr-9 text-sm text-slate-700 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
                error ? "border-red-400" : "border-slate-600"
              } ${!value ? "text-slate-400" : ""}`
        }
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 text-slate-400" />
    </div>
  );
};

export interface DateInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  readOnly?: boolean;
}

export const DateInput = ({ value, onChange, placeholder, error, readOnly }: DateInputProps) => {
  // Figma "Read-only / filled" state — see TextInput for details.
  const isFilledReadOnly = readOnly && value.trim() !== "";

  return (
    <div className="relative flex items-center">
      <span
        className={`pointer-events-none absolute left-3.5 ${
          isFilledReadOnly ? READONLY_FILLED_ICON_COLOR : "text-slate-400"
        }`}
      >
        <Calendar size={16} />
      </span>
      <input
        type="date"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        tabIndex={readOnly ? -1 : undefined}
        className={
          isFilledReadOnly
            ? `w-full h-12 rounded-lg border pointer-events-none ${READONLY_FILLED_BG} py-3 pl-[38px] pr-[14px] text-sm text-slate-700 outline-none ${READONLY_FILLED_SHADOW} ${
                error ? "border-red-400" : READONLY_FILLED_BORDER
              }`
            : `w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
                error ? "border-red-400" : "border-slate-600"
              }`
        }
      />
    </div>
  );
};

export interface RadioYesNoProps {
  label: string;
  labelHi?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export const RadioYesNo = ({ label, labelHi, value, onChange, disabled }: RadioYesNoProps) => (
  <div className=" last:mb-0 flex gap-2 items-center">
    <label className=" block text-sm large font-medium text-[#1F2858]">

      {label}
      {labelHi && <span className="text-slate-600"> / {labelHi}</span>}
    </label>
    <div className="flex items-center gap-4 pt-1">
      {(["Yes", "No"] as const).map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-2 text-sm text-slate-700 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
        >
          <input
            type="radio"
            checked={opt === "Yes" ? value : !value}
            onChange={() => !disabled && onChange(opt === "Yes")}
            disabled={disabled}
            className="h-4 w-4 accent-primary"
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export interface RadioDayMonthProps {
  label: string;
  labelHi?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  options?: [string, string];
}

export const RadioDayMonth = ({
  label,
  labelHi,
  value,
  onChange,
  disabled,
  options = ["Day", "Month"],
}: RadioDayMonthProps) => (
  <div className=" last:mb-0 flex items-center justify-between gap-2">
    <label className=" block text-sm large font-medium text-[#1F2858]">
      {label}
      {labelHi && <span className="text-slate-600"> / {labelHi}</span>}
    </label>
    <div className="flex items-center gap-4 pt-1">
      {options.map((opt, i) => (
        <label
          key={opt}
          className={`flex items-center gap-2 text-sm text-slate-700 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
        >
          <input
            type="radio"
            checked={i === 0 ? value : !value}
            onChange={() => !disabled && onChange(i === 0)}
            disabled={disabled}
            className="h-4 w-4 accent-primary"
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export interface SectionCardProps {
  titleEn: string;
  titleHi: string;
  subtitleEn?: string;
  subtitleHi?: string;
  icon?: string | ReactNode;
  children: ReactNode;
}

export const SectionCard = ({
  titleEn,
  titleHi,
  subtitleEn,
  subtitleHi,
  icon,
  children,
}: SectionCardProps) => (
  <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
    <div className="mb-3 flex items-center gap-3 border-b border-primary-100 pb-3">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center">
          {typeof icon === "string" ? (
  <img src={icon} alt="" className="h-8 w-8" />
) : (
  icon
)}
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold leading-none text-[#1F2858]">
          {titleEn} / <span className="text-slate-600">{titleHi}</span>
        </h3>
        {(subtitleEn || subtitleHi) && (
          <p className="mt-0.5 text-xs text-[#64748B]">
            {subtitleEn}
            {subtitleHi && ` / ${subtitleHi}`}
          </p>
        )}
      </div>
    </div>
    {children}
  </div>
);

export interface DocumentRowProps {
  label: string;
  checked: boolean;
  expiryDate: string;
  documentNumber: string;
  onCheck: (v: boolean) => void;
  onExpiryChange: (v: string) => void;
  onDocNumberChange: (v: string) => void;
  showDocNumber?: boolean;
}

export const DocumentRow = ({
  label,
  checked,
  expiryDate,
  documentNumber,
  onCheck,
  onExpiryChange,
  onDocNumberChange,
  showDocNumber = true,
}: DocumentRowProps) => (
  <div className="flex items-center gap-3 border-b border-slate-100 py-2.5 last:border-0">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheck(e.target.checked)}
      className="h-4 w-4 shrink-0 accent-primary"
    />
    <span className="min-w-[140px] flex-1 text-sm text-slate-700">{label}</span>
    <div className="relative w-44">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Calendar size={14} />
      </span>
      <input
        type="date"
        value={expiryDate}
        disabled={!checked}
        onChange={(e) => onExpiryChange(e.target.value)}
        placeholder="Enter Expiry Date"
        className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-2 text-xs disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
    {showDocNumber && (
      <div className="relative w-44">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <FileText size={14} />
        </span>
        <input
          type="text"
          value={documentNumber}
          disabled={!checked}
          onChange={(e) => onDocNumberChange(e.target.value)}
          placeholder="Enter Document Number"
          className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-2 text-xs disabled:bg-slate-50 disabled:text-slate-400"
        />
      </div>
    )}
  </div>
);

export interface UploadZoneProps {
  titleEn: string;
  titleHi: string;
  subtitleEn?: string;
  subtitleHi?: string;
}

export interface LookupButtonProps {
  items: string[];
  onPick: (item: string) => void;
}

export const LookupButton = ({ items, onPick }: LookupButtonProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
      >
        <MoreVertical size={18} strokeWidth={2.4} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-20 max-h-52 w-40 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                onPick(item);
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export interface PickerFieldProps {
  label: string;
  labelHi?: string;
  required?: boolean;
  icon: ReactNode;
  value: string;
  placeholder?: string;
  onPickerClick: () => void;
}

/** AccountMaster-style field: icon input + external lookup button */
export const PickerField = ({
  label,
  labelHi,
  required = true,
  icon,
  value,
  placeholder,
  onPickerClick,
}: PickerFieldProps) => (
  <FieldShell label={label} labelHi={labelHi} required={required} variant="large" className="mb-3 last:mb-0">
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onPickerClick}
        className="group flex h-10 w-full cursor-pointer items-center rounded-md border border-[#B8C2D6] bg-white px-4 transition-all duration-200 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
      >
        <span className="shrink-0 text-[#6B7280]">{icon}</span>
        <input
          type="text"
          readOnly
          placeholder={placeholder}
          value={value}
          className="pointer-events-none ml-3 w-full cursor-pointer bg-transparent text-[16px] text-[#4B5563] placeholder:text-[#7C879B] outline-none"
        />
      </button>
      <button
        type="button"
        onClick={onPickerClick}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-primary transition-all duration-200 hover:bg-[#DDEAFF] active:scale-95"
      >
        <MoreVertical size={18} strokeWidth={2.5} />
      </button>
    </div>
  </FieldShell>
);

export interface FormTextFieldProps {
  label: string;
  labelHi?: string;
  required?: boolean;
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

/** AccountMaster-style editable text field with icon */
export const FormTextField = ({
  label,
  labelHi,
  required = true,
  icon,
  value,
  onChange,
  placeholder,
  readOnly,
}: FormTextFieldProps) => (
  <FieldShell label={label} labelHi={labelHi} required={required} variant="large" className="mb-3 last:mb-0">
    <div className="flex h-10 items-center rounded-md border border-[#B8C2D6] bg-white px-4 transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
      <span className="shrink-0 text-[#6B7280]">{icon}</span>
      <input
        type="text"
        readOnly={readOnly}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ml-3 w-full bg-transparent text-[16px] text-[#4B5563] placeholder:text-[#7C879B] outline-none"
      />
    </div>
  </FieldShell>
);

export const UploadZone = ({ titleEn, titleHi, subtitleEn, subtitleHi }: UploadZoneProps) => (
  <SectionCard
    titleEn={titleEn}
    titleHi={titleHi}
    subtitleEn={subtitleEn}
    subtitleHi={subtitleHi}
  >
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6">
      <p className="mb-4 text-sm text-slate-500">Drag and drop a file here, or:</p>
      <div className="flex gap-8">
        {[
          { label: "Browse", icon: "🖥" },
          { label: "Library", icon: "📁" },
          { label: "Click Photo", icon: "📷" },
        ].map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            className="flex flex-col items-center gap-1 text-xs text-slate-600 hover:text-primary"
          >
            <span className="text-2xl">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  </SectionCard>
);

export interface ActionButtonsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelText?: string;
  submitText?: string;
  className?: string;
}

export const ActionButtons = ({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  className = "",
}: ActionButtonsProps) => (
  <div className={`flex items-center justify-end gap-3 ${className}`}>
    <button
      type="button"
      onClick={onCancel}
      className="flex items-center gap-2 rounded-lg border-2 border-primary bg-white px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
    >
      <X size={16} />
      {cancelText}
    </button>
    <button
      type="button"
      onClick={onSubmit}
      className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
    >
      {submitText}
      <Upload size={16} />
    </button>
  </div>
);


export function SelectField({
  icon: Icon,
  labelEn,
  labelMr,
  value,
  required = true,
  options,
  editable = true,
  onChange,
}: {
  icon?: LucideIcon;
  labelEn: string;
  labelMr?: string;
  value?: string;
  required?: boolean;
  editable?: boolean;
  options?: string[];
  onChange?: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

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

  const startEditing = () => {
    if (!editable) return;
    setDraft(value ?? "");
    setIsEditing(true);
  };

  const commit = () => {
    setIsEditing(false);
    onChange?.(draft);
  };

  // ---------------- Dropdown ----------------

  if (options && options.length > 0) {
    return (
      <div ref={containerRef} className="flex h-full min-w-0 flex-col">
        <BilingualLabel en={labelEn} mr={labelMr} required={required} />

        <div className="relative flex-1">
          <button
            type="button"
            disabled={!editable}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`
              flex
              h-12
              w-full
              items-center
              rounded-lg
              border
              px-3
              text-left
              transition-all
              ${
                isOpen
                  ? "border-primary ring-2 ring-primary/10"
                  : "border-slate-600 hover:border-primary"
              }
              ${!editable ? "cursor-default bg-slate-50" : "bg-white"}
            `}
          >
            {Icon && (
              <Icon
                className="h-4 w-4 shrink-0 text-slate-400"
                strokeWidth={1.8}
              />
            )}

            <span
              className={`flex-1 truncate text-sm ${Icon ? "ml-3" : ""} ${
                value ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {value || "Select"}
            </span>

            <ChevronDown
              className={`h-5 w-5 text-slate-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && editable && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange?.(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition
                    ${
                      option === value
                        ? "bg-primary-50 text-primary"
                        : "hover:bg-slate-50"
                    }`}
                >
                  {option}

                  {option === value && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function BilingualLabel({
    en,
    mr,
    required,
    variant = "large",
  }: {
    en: string;
    mr?: string;
    required?: boolean;
    variant?: "large" | "small";
  }) {
    return (
      <label
        className={`mb-1.5 block truncate whitespace-nowrap text-[#1F2858] ${
          variant === "large" ? "text-sm font-medium" : "text-xs font-medium"
        }`}
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
  }

  // ---------------- Editable Text ----------------

  return (
    <div className="flex h-full  w-full flex-col">
      <BilingualLabel en={labelEn} mr={labelMr} required={required} />

      <div className={`flex h-12 items-center rounded-lg border border-slate-600 ${!editable?"bg-slate-50" : "bg-white"} px-3`}>
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.8} />
        )}

        {isEditing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setIsEditing(false);
            }}
            className={`flex-1 ${editable?"bg-slate-50" : "bg-transparent"} text-sm outline-none ${
              Icon ? "ml-3" : ""
            }`}
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className={`flex-1 truncate text-left text-sm text-slate-600 ${
              Icon ? "ml-3" : ""
            }`}
          >
            {value || "—"}
          </button>
        )}

        <ChevronDown className="h-5 w-5 text-slate-400" />
      </div>
    </div>
  );
}