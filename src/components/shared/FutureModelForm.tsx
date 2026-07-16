import type { ReactNode } from "react";
import { Check, ChevronDown, MoreVertical, UserRound, X } from "lucide-react";
import Image from "@/components/ui/Image";
import { useBilingual } from "@/i18n/useBilingual";

export function BilingualText({
  labelKey,
  separator = " / ",
  secondaryClassName = "font-medium text-slate-500 dark:text-slate-400",
}: {
  labelKey: string;
  separator?: string;
  secondaryClassName?: string;
}) {
  const { en, t } = useBilingual();
  const secondary = t(labelKey);

  return (
    <>
      {en(labelKey)}
      {secondary ? <span className={secondaryClassName}>{separator}{secondary}</span> : null}
    </>
  );
}

export function FuturePageHeader({
  titleKey,
  onClose,
  titleClassName = "text-[26px]",
  iconSize = 44,
}: {
  titleKey: string;
  onClose: () => void;
  titleClassName?: string;
  iconSize?: number;
}) {
  const { en } = useBilingual();

  return (
    <div className="mb-7 flex items-center justify-between border-b border-slate-200 pb-7 dark:border-slate-700">
      <div className="flex min-w-0 items-center gap-5">
        <Image
          src="/person icon.png"
          alt={en(titleKey)}
          width={iconSize}
          height={iconSize}
          className="shrink-0 object-contain"
          style={{ width: iconSize, height: iconSize }}
        />
        <h1 className={`min-w-0 font-bold leading-tight text-[#070747] dark:text-slate-100 ${titleClassName}`}>
          <BilingualText
            labelKey={titleKey}
            secondaryClassName="font-semibold text-slate-500 dark:text-slate-400"
          />
        </h1>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={en("common.cancel")}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-slate-400 text-slate-500 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <X size={28} strokeWidth={3} />
      </button>
    </div>
  );
}

export function FieldLabel({
  labelKey,
  required = true,
  className = "mb-2 block text-[16px] font-semibold leading-6 text-slate-800 dark:text-slate-100",
}: {
  labelKey: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <BilingualText labelKey={labelKey} />
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

export function FutureField({
  labelKey,
  icon,
  value,
  onChange,
  placeholderKey,
  placeholder,
  readOnly = false,
  required = true,
  error = false,
  trailing,
  textRight = false,
  fieldHeightClass = "h-[50px]",
  labelClassName,
}: {
  labelKey: string;
  icon: ReactNode;
  value: string;
  onChange?: (value: string) => void;
  placeholderKey?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  trailing?: ReactNode;
  textRight?: boolean;
  fieldHeightClass?: string;
  labelClassName?: string;
}) {
  const { tRaw } = useBilingual();
  const resolvedPlaceholder = placeholderKey ? tRaw(placeholderKey) : placeholder;

  return (
    <div className="min-w-0">
      <FieldLabel labelKey={labelKey} required={required} className={labelClassName} />
      <div className="flex items-center gap-3">
        <div
          className={`flex min-w-0 flex-1 items-center rounded-xl border px-4 ${fieldHeightClass} ${
            readOnly ? "bg-gray-100 dark:bg-slate-800" : "bg-white dark:bg-slate-900"
          } ${error ? "border-red-400" : "border-slate-400 dark:border-slate-700"}`}
        >
          <span className="shrink-0 text-slate-500 dark:text-slate-400">{icon}</span>
          <input
            type="text"
            readOnly={readOnly}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={resolvedPlaceholder}
            className={`ml-3 w-full min-w-0 bg-transparent text-[16px] text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              textRight ? "text-right" : ""
            }`}
          />
        </div>
        {trailing}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{tRaw("common.fieldRequired")}</p>}
    </div>
  );
}

export function LookupPickerButton({
  onClick,
  className = "h-[50px] w-[60px]",
  iconSize = 24,
}: {
  onClick: () => void;
  className?: string;
  iconSize?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition hover:bg-primary-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 ${className}`}
    >
      <MoreVertical size={iconSize} strokeWidth={3} />
    </button>
  );
}

export function FutureSectionHeader({ titleKey, subtitleKey }: { titleKey: string; subtitleKey: string }) {
  return (
    <div className="mb-7 border-b border-slate-200 pb-6 dark:border-slate-700">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary-50 text-primary shadow-sm dark:bg-blue-900/30">
          <UserRound size={25} />
        </div>
        <div className="min-w-0">
          <h2 className="text-[23px] font-bold leading-7 text-[#202052] dark:text-slate-100">
            <BilingualText
              labelKey={titleKey}
              secondaryClassName="font-semibold text-slate-500 dark:text-slate-400"
            />
          </h2>
          <p className="mt-1 text-[15px] font-medium leading-6 text-slate-500 dark:text-slate-400">
            <BilingualText labelKey={subtitleKey} />
          </p>
        </div>
      </div>
    </div>
  );
}

export function FutureFormActions({
  onValidate,
  onCancel,
  onModify,
  isValidated,
  align = "end",
}: {
  onValidate: () => void;
  onCancel: () => void;
  onModify: () => void;
  isValidated: boolean;
  align?: "center" | "end";
}) {
  const { en } = useBilingual();

  return (
    <div className={`mt-7 flex flex-wrap ${align === "center" ? "justify-center" : "justify-end"} gap-7`}>
      <button
        type="button"
        onClick={onValidate}
        disabled={isValidated}
        className="flex h-14 min-w-[150px] items-center justify-center gap-3 rounded-lg bg-primary px-8 text-lg font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {en("common.validate")} <Check size={22} />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="flex h-14 min-w-[150px] items-center justify-center gap-3 rounded-lg border-2 border-primary bg-white px-8 text-lg font-semibold text-primary transition hover:bg-primary-50 dark:bg-slate-900 dark:hover:bg-blue-900/20"
      >
        {en("common.cancel")} <X size={24} />
      </button>
      <button
        type="button"
        onClick={onModify}
        disabled={!isValidated}
        className="flex h-14 min-w-[150px] items-center justify-center gap-3 rounded-lg bg-gray-100 px-8 text-lg font-semibold text-gray-400 transition enabled:bg-primary-100 enabled:text-primary enabled:hover:bg-primary-200 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-500 dark:enabled:bg-blue-900/30 dark:enabled:text-blue-400"
      >
        {en("common.modify")} <ChevronDown size={20} />
      </button>
    </div>
  );
}
