import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Calculator,
  Calendar,
  Check,
  ChevronDown,
  MoreVertical,
  UserRound,
  X,
} from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import ListModal from "@/components/AccountMaster/ListModal";

type SelectMode = "all" | "single";
type ReportType = "pdf" | "xls";

export interface TdPostingConsistencyData {
  applyInterestUpToDate: string;
  postAs: string;
  selectMode: SelectMode;
  reportType: ReportType;
  productCode: string;
  productDescription: string;
}

export interface TdPostingConsistencyProcessProps {
  open: boolean;
  onClose: () => void;
  onValidate?: (data: TdPostingConsistencyData) => void;
  onCalculate?: (data: TdPostingConsistencyData) => void;
  onReport?: (data: TdPostingConsistencyData) => void;
  onApply?: (data: TdPostingConsistencyData) => void;
}

const INITIAL_VALUES: TdPostingConsistencyData = {
  applyInterestUpToDate: "",
  postAs: "",
  selectMode: "single",
  reportType: "pdf",
  productCode: "",
  productDescription: "",
};

const POST_AS_OPTIONS = ["Interest Posting", "Provision Posting", "Closing Posting"];
const PRODUCTS = [
  { code: "TD001", description: "Term Deposit" },
  { code: "TD002", description: "Recurring Deposit" },
];

type RequiredField = "applyInterestUpToDate" | "postAs" | "productCode" | "productDescription";

const buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

export default function TdPostingConsistencyProcess({
  open,
  onClose,
  onValidate,
  onCalculate,
  onReport,
  onApply,
}: TdPostingConsistencyProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<TdPostingConsistencyData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  if (!open) return null;

  const updateValues = (patch: Partial<TdPostingConsistencyData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key as RequiredField]);
      return next;
    });
    setIsValidated(false);
    setIsCalculated(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<RequiredField, string>> = {};
    if (!values.applyInterestUpToDate) nextErrors.applyInterestUpToDate = en("common.fieldRequired");
    if (!values.postAs.trim()) nextErrors.postAs = en("common.fieldRequired");
    if (!values.productCode.trim()) nextErrors.productCode = en("common.fieldRequired");
    if (!values.productDescription.trim()) nextErrors.productDescription = en("common.fieldRequired");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validate()) return;
    setIsValidated(true);
    onValidate?.(values);
  };

  const handleCalculate = () => {
    if (!validate()) return;
    setIsValidated(true);
    setIsCalculated(true);
    onCalculate?.(values);
  };

  const handleReport = () => {
    if (!validate()) return;
    setIsValidated(true);
    onReport?.(values);
  };

  const handleApply = () => {
    if (!isCalculated) return;
    onApply?.(values);
  };

  const handlePickProduct = (product: { code: string; description: string }) => {
    updateValues({
      productCode: product.code,
      productDescription: product.description,
    });
    setShowProductList(false);
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[1024px] rounded-[22px] bg-white p-4 shadow-2xl">
          <div className="flex items-start gap-4 border-b border-slate-100 pb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                {en("tdPostingConsistency.title")}
                {t("tdPostingConsistency.title") ? (
                  <span className="text-[#64748B]"> / {t("tdPostingConsistency.title")}</span>
                ) : null}
              </h2>
              <p className="mt-1 text-[14px] leading-snug text-[#64748B]">
                {en("tdPostingConsistency.subtitle")}
                {t("tdPostingConsistency.subtitle") ? (
                  <span> / {t("tdPostingConsistency.subtitle")}</span>
                ) : null}
              </p>
            </div>
          </div>
        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">

          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <FormField
              label={en("tdPostingConsistency.fields.applyInterestUpToDate")}
              labelHi={t("tdPostingConsistency.fields.applyInterestUpToDate")}
              error={errors.applyInterestUpToDate}
            >
              <DateInput
                value={values.applyInterestUpToDate}
                onChange={(value) => updateValues({ applyInterestUpToDate: value })}
                placeholder={tRaw("tdPostingConsistency.placeholders.applyInterestUpToDate")}
              />
            </FormField>

            <FormField
              label={en("tdPostingConsistency.fields.postAs")}
              labelHi={t("tdPostingConsistency.fields.postAs")}
              error={errors.postAs}
            >
              <SelectInput
                value={values.postAs}
                onChange={(value) => updateValues({ postAs: value })}
                placeholder={tRaw("tdPostingConsistency.placeholders.postAs")}
              />
            </FormField>

            <div className="flex items-center gap-10">
              <BilingualBlockLabel
                label={en("tdPostingConsistency.fields.select")}
                labelHi={t("tdPostingConsistency.fields.select")}
              />
              <RadioOption
                checked={values.selectMode === "all"}
                onChange={() => updateValues({ selectMode: "all" })}
                label={en("tdPostingConsistency.options.all")}
              />
              <RadioOption
                checked={values.selectMode === "single"}
                onChange={() => updateValues({ selectMode: "single" })}
                label={en("tdPostingConsistency.options.single")}
              />
            </div>

            <div className="flex items-center gap-10">
              <BilingualBlockLabel
                label={en("tdPostingConsistency.fields.reportType")}
                labelHi={t("tdPostingConsistency.fields.reportType")}
              />
              <ReportOption
                checked={values.reportType === "pdf"}
                onChange={() => updateValues({ reportType: "pdf" })}
                type="pdf"
              />
              <ReportOption
                checked={values.reportType === "xls"}
                onChange={() => updateValues({ reportType: "xls" })}
                type="xls"
              />
            </div>

            <FormField
              label={en("tdPostingConsistency.fields.productCode")}
              labelHi={t("tdPostingConsistency.fields.productCode")}
              error={errors.productCode}
            >
              <div className="flex gap-2">
                <DateInput
                  value={values.productCode}
                  onChange={(value) => updateValues({ productCode: value })}
                  placeholder={tRaw("tdPostingConsistency.placeholders.productCode")}
                  type="text"
                />
                <button
                  type="button"
                  onClick={() => setShowProductList(true)}
                  className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
                >
                  <MoreVertical size={22} strokeWidth={3} />
                </button>
              </div>
            </FormField>

            <FormField
              label={en("tdPostingConsistency.fields.productDescription")}
              labelHi={t("tdPostingConsistency.fields.productDescription")}
              error={errors.productDescription}
            >
              <DateInput
                value={values.productDescription}
                onChange={(value) => updateValues({ productDescription: value })}
                placeholder={tRaw("tdPostingConsistency.placeholders.description")}
                type="text"
                readOnly
              />
            </FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
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

    {showProductList && (
      <ListModal
        title={en("tdPostingConsistency.fields.productCode")}
        columns={[
          { key: "code", label: "Product Code" },
          { key: "description", label: "Description" },
        ]}
        rows={PRODUCTS}
        onSelect={handlePickProduct}
        onClose={() => setShowProductList(false)}
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

function BilingualBlockLabel({ label, labelHi }: { label: string; labelHi?: string }) {
  return (
    <div className="min-w-[120px] text-[15px] font-semibold leading-snug text-[#1F2937]">
      <div>{label}</div>
      {labelHi ? <div className="text-[#64748B]">{labelHi}</div> : null}
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
  placeholder: string;
  type?: "date" | "text";
  readOnly?: boolean;
}) {
  return (
    <div className={`flex h-11 items-center rounded-lg border border-[#7E8796] px-4 text-[15px] text-slate-700 ${
      readOnly ? "bg-slate-100" : "bg-white"
    }`}>
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

function SelectInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex h-11 items-center rounded-lg border border-[#7E8796] bg-white px-4 text-[15px] text-slate-700">
      <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`min-w-0 flex-1 appearance-none bg-transparent pr-8 outline-none ${
          value ? "text-slate-700" : "text-[#8B95A5]"
        }`}
      >
        <option value="">{placeholder}</option>
        {POST_AS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="pointer-events-none absolute right-4 text-[#64748B]" />
    </div>
  );
}

function RadioOption({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 text-[15px] font-semibold text-black">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-primary"
      />
      {label}
    </label>
  );
}

function ReportOption({
  checked,
  onChange,
  type,
}: {
  checked: boolean;
  onChange: () => void;
  type: ReportType;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-primary"
      />
      <span className="relative block h-9 w-8 rounded-md border border-slate-200 bg-white shadow-sm">
        <span className="absolute right-0 top-0 h-3 w-3 rounded-bl-sm bg-slate-200" />
        <span
          className={`absolute -left-1 bottom-2 rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${
            type === "pdf" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {type.toUpperCase()}
        </span>
      </span>
    </label>
  );
}
