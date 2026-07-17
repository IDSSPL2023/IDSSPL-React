import type { FC } from "react";
import { Landmark, MoreVertical } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

export const FieldLabel: FC<{ labelKey: string }> = ({ labelKey }) => {
  const { en, t } = useBilingual();
  return (
    <label className="mb-1.5 block text-[15px] font-semibold text-[#1F2858] dark:text-slate-100">
      {en(labelKey)}
      {t(labelKey) ? <span className="font-normal text-slate-500 dark:text-slate-400"> / {t(labelKey)}</span> : null}
      <span className="text-red-500"> *</span>
    </label>
  );
};

const FieldError: FC = () => {
  const { tRaw } = useBilingual();
  return <p className="mt-1 text-xs text-red-500">{tRaw("common.fieldRequired")}</p>;
};

export const TextField: FC<{
  labelKey: string;
  value: string;
  hasError?: boolean;
  onChange: (value: string) => void;
}> = ({ labelKey, value, hasError, onChange }) => (
  <div>
    <FieldLabel labelKey={labelKey} />
    <div
      className={`flex h-11 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
        hasError
          ? "border-red-400"
          : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
      }`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-[15px] text-[#4B5563] outline-none dark:text-slate-100"
      />
    </div>
    {hasError && <FieldError />}
  </div>
);

export const AmountField: FC<{
  labelKey: string;
  value: string;
  hasError?: boolean;
  onChange: (value: string) => void;
}> = ({ labelKey, value, hasError, onChange }) => (
  <div>
    <FieldLabel labelKey={labelKey} />
    <div
      className={`flex h-11 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
        hasError
          ? "border-red-400"
          : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
      }`}
    >
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-right text-[15px] text-[#4B5563] outline-none dark:text-slate-100"
      />
    </div>
    {hasError && <FieldError />}
  </div>
);

export const DateField: FC<{
  labelKey: string;
  value: string;
  hasError?: boolean;
  onChange: (value: string) => void;
}> = ({ labelKey, value, hasError, onChange }) => (
  <div>
    <FieldLabel labelKey={labelKey} />
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#1F2858] outline-none transition dark:bg-slate-900 dark:text-slate-100 ${
        hasError
          ? "border-red-400"
          : "border-[#B8C2D6] focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700"
      }`}
    />
    {hasError && <FieldError />}
  </div>
);

export const ReadOnlyField: FC<{ labelKey: string; value: string }> = ({ labelKey, value }) => (
  <div>
    <FieldLabel labelKey={labelKey} />
    <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
      <input
        type="text"
        readOnly
        value={value}
        className="w-full bg-transparent text-[15px] text-slate-500 outline-none dark:text-slate-400"
      />
    </div>
  </div>
);

export const PickerField: FC<{
  labelKey: string;
  value: string;
  hasError?: boolean;
  onOpen: () => void;
}> = ({ labelKey, value, hasError, onOpen }) => {
  const { en } = useBilingual();
  return (
    <div>
      <FieldLabel labelKey={labelKey} />
      <div className="flex items-center gap-2">
        <div
          onClick={onOpen}
          className={`flex h-11 flex-1 cursor-pointer items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
            hasError
              ? "border-red-400"
              : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
          }`}
        >
          <Landmark size={18} className="shrink-0 text-[#6B7280]" />
          <input
            type="text"
            readOnly
            value={value}
            className="ml-3 w-full cursor-pointer bg-transparent text-[15px] text-[#4B5563] outline-none dark:text-slate-100"
          />
        </div>
        <button
          type="button"
          title={en(labelKey)}
          onClick={onOpen}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition hover:bg-[#E2ECFF] dark:border-slate-700 dark:bg-primary-950/40"
        >
          <MoreVertical size={18} />
        </button>
      </div>
      {hasError && <FieldError />}
    </div>
  );
};
