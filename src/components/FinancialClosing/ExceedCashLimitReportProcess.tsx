import { useState } from "react";
import type { ReactNode } from "react";
import { BarChart3, Calculator, Calendar, Check, MoreVertical, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import ListModal from "@/components/AccountMaster/ListModal";

export interface ExceedCashLimitReportData {
  fromProductCode: string;
  fromProductDescription: string;
  toProductCode: string;
  toProductDescription: string;
  asOnDate: string;
}

export interface ExceedCashLimitReportProcessProps {
  open: boolean;
  onClose: () => void;
  onCalculate?: (data: ExceedCashLimitReportData) => void;
  onReport?: (data: ExceedCashLimitReportData) => void;
  onApply?: (data: ExceedCashLimitReportData) => void;
}

const INITIAL_VALUES: ExceedCashLimitReportData = {
  fromProductCode: "",
  fromProductDescription: "",
  toProductCode: "",
  toProductDescription: "",
  asOnDate: "",
};

const PRODUCTS = [
  { code: "0001", description: "Savings Account" },
  { code: "0002", description: "Current Account" },
];

type RequiredField = "fromProductCode" | "toProductCode" | "asOnDate";

const buttonBase =
  "flex h-10 min-w-[110px] items-center justify-center gap-1 rounded-md px-4 text-[13px] font-semibold transition";

export default function ExceedCashLimitReportProcess({
  open,
  onClose,
  onCalculate,
  onReport,
  onApply,
}: ExceedCashLimitReportProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<ExceedCashLimitReportData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [isCalculated, setIsCalculated] = useState(false);
  const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);

  if (!open) return null;

  const updateValues = (patch: Partial<ExceedCashLimitReportData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key as RequiredField]);
      return next;
    });
    setIsCalculated(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<RequiredField, string>> = {};
    if (!values.fromProductCode.trim()) nextErrors.fromProductCode = en("common.fieldRequired");
    if (!values.toProductCode.trim()) nextErrors.toProductCode = en("common.fieldRequired");
    if (!values.asOnDate) nextErrors.asOnDate = en("common.fieldRequired");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    validate();
  };

  const handleCalculate = () => {
    if (!validate()) return;
    onCalculate?.(values);
    setIsCalculated(true);
  };

  const handleReport = () => {
    if (!validate()) return;
    onReport?.(values);
  };

  const handleApply = () => {
    if (!isCalculated) return;
    onApply?.(values);
  };

  const handlePickProduct = (product: { code: string; description: string }) => {
    if (activePicker === "from") {
      updateValues({ fromProductCode: product.code, fromProductDescription: product.description });
    } else if (activePicker === "to") {
      updateValues({ toProductCode: product.code, toProductDescription: product.description });
    }
    setActivePicker(null);
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start gap-4 border-b border-slate-100 pb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
            <UserRound size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
              {en("exceedCashLimitReport.title")}
              {t("exceedCashLimitReport.title") ? (
                <span className="text-[#64748B]"> / {t("exceedCashLimitReport.title")}</span>
              ) : null}
            </h2>
            <p className="mt-1 text-[14px] leading-snug text-[#64748B]">
              {en("interestPostingProcess.subtitle")}
              {t("interestPostingProcess.subtitle") ? (
                <span> / {t("interestPostingProcess.subtitle")}</span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 space-y-5">
            <FormField
              label={en("exceedCashLimitReport.fields.fromProductCode")}
              labelHi={t("exceedCashLimitReport.fields.fromProductCode")}
              error={errors.fromProductCode}
            >
              <div className="flex gap-2">
                <DateInput
                  value={values.fromProductCode}
                  onChange={(value) => updateValues({ fromProductCode: value })}
                  placeholder={tRaw("exceedCashLimitReport.placeholders.selectProductCode")}
                  type="text"
                />
                <button
                  type="button"
                  onClick={() => setActivePicker("from")}
                  className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
                >
                  <MoreVertical size={22} strokeWidth={3} />
                </button>
              </div>
            </FormField>

            <FormField
              label={en("exceedCashLimitReport.fields.productDescription")}
              labelHi={t("exceedCashLimitReport.fields.productDescription")}
            >
              <DateInput
                value={values.fromProductDescription}
                onChange={() => {}}
                placeholder={tRaw("exceedCashLimitReport.placeholders.description")}
                type="text"
                readOnly
              />
            </FormField>

            <FormField
              label={en("exceedCashLimitReport.fields.toProductCode")}
              labelHi={t("exceedCashLimitReport.fields.toProductCode")}
              error={errors.toProductCode}
            >
              <div className="flex gap-2">
                <DateInput
                  value={values.toProductCode}
                  onChange={(value) => updateValues({ toProductCode: value })}
                  placeholder={tRaw("exceedCashLimitReport.placeholders.selectProductCode")}
                  type="text"
                />
                <button
                  type="button"
                  onClick={() => setActivePicker("to")}
                  className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
                >
                  <MoreVertical size={22} strokeWidth={3} />
                </button>
              </div>
            </FormField>

            <FormField
              label={en("exceedCashLimitReport.fields.productDescription")}
              labelHi={t("exceedCashLimitReport.fields.productDescription")}
            >
              <DateInput
                value={values.toProductDescription}
                onChange={() => {}}
                placeholder={tRaw("exceedCashLimitReport.placeholders.description")}
                type="text"
                readOnly
              />
            </FormField>

            <FormField
              label={en("exceedCashLimitReport.fields.asOnDate")}
              labelHi={t("exceedCashLimitReport.fields.asOnDate")}
              error={errors.asOnDate}
            >
              <DateInput
                value={values.asOnDate}
                onChange={(value) => updateValues({ asOnDate: value })}
                placeholder={tRaw("exceedCashLimitReport.placeholders.enterDate")}
              />
            </FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleValidate}
            className={`${buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className={`${buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.calculate")}
            <Calculator size={17} />
          </button>
          <button
            type="button"
            onClick={handleReport}
            className={`${buttonBase} bg-primary-50 text-primary hover:bg-primary-100`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${buttonBase} ${
              isCalculated
                ? "bg-primary text-white hover:bg-primary-700"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.apply")}
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
        </div>
      </div>
    </div>

    {activePicker && (
      <ListModal
        title="Select Product"
        columns={[
          { key: "code", label: "Product Code" },
          { key: "description", label: "Description" },
        ]}
        rows={PRODUCTS}
        onSelect={handlePickProduct}
        onClose={() => setActivePicker(null)}
      />
    )}
    </>
  );
}

function FormField({
  label,
  labelHi,
  error,
  children,
}: {
  label: string;
  labelHi?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-3 block text-[15px] font-semibold leading-none text-[#1F2937]">
        {label}
        {labelHi ? <span className="text-[#64748B]"> / {labelHi}</span> : null}
        <span className="ml-0.5 text-rose-600">*</span>
      </label>
      {children}
      {error ? <p className="mt-1 text-[12px] text-rose-600">{error}</p> : null}
    </div>
  );
}

function DateInput({
  value,
  onChange,
  placeholder,
  type = "date",
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "date" | "text";
  readOnly?: boolean;
}) {
  return (
    <div
      className={`flex h-11 flex-1 items-center rounded-lg border border-[#7E8796] px-4 text-[15px] text-slate-700 ${
        readOnly ? "bg-slate-100" : "bg-white"
      }`}
    >
      <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
      />
    </div>
  );
}
