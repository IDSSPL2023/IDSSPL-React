import { useState } from "react";
import type { ReactNode } from "react";
import { BarChart3, Calculator, Calendar, Check, MoreVertical, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import ListModal from "@/components/AccountMaster/ListModal";

export interface PigmyInterestProvisionData {
  fromProductCode: string;
  productDescription: string;
  uptoDate: string;
}

export interface PigmyInterestProvisionProcessProps {
  open: boolean;
  onClose: () => void;
  onCalculate?: (data: PigmyInterestProvisionData) => void;
  onReport?: (data: PigmyInterestProvisionData) => void;
  onApply?: (data: PigmyInterestProvisionData) => void;
}

const INITIAL_VALUES: PigmyInterestProvisionData = {
  fromProductCode: "",
  productDescription: "",
  uptoDate: "",
};

const PRODUCTS = [
  { code: "PIG001", description: "Pigmy Daily Deposit" },
  { code: "PIG002", description: "Pigmy Monthly Scheme" },
];

type RequiredField = "fromProductCode" | "uptoDate";

const buttonBase =
  "flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-md px-3 text-[14px] font-semibold transition";

export default function PigmyInterestProvisionProcess({
  open,
  onClose,
  onCalculate,
  onReport,
  onApply,
}: PigmyInterestProvisionProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<PigmyInterestProvisionData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  if (!open) return null;

  const updateValues = (patch: Partial<PigmyInterestProvisionData>) => {
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
    if (!values.fromProductCode.trim()) nextErrors.fromProductCode = en("common.fieldRequired");
    if (!values.uptoDate) nextErrors.uptoDate = en("common.fieldRequired");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validate()) return;
    setIsValidated(true);
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
      fromProductCode: product.code,
      productDescription: product.description,
    });
    setShowProductList(false);
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
              {en("pigmyInterestProvision.title")}
              {t("pigmyInterestProvision.title") ? (
                <span className="text-[#64748B]"> / {t("pigmyInterestProvision.title")}</span>
              ) : null}
            </h2>
            <p className="mt-1 text-[14px] leading-snug text-[#64748B]">
              {en("pigmyInterestProvision.subtitle")}
              {t("pigmyInterestProvision.subtitle") ? (
                <span> / {t("pigmyInterestProvision.subtitle")}</span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 space-y-5">
            <FormField
              label={en("pigmyInterestProvision.fields.fromProductCode")}
              labelHi={t("pigmyInterestProvision.fields.fromProductCode")}
              error={errors.fromProductCode}
            >
              <div className="flex gap-2">
                <DateInput
                  value={values.fromProductCode}
                  onChange={(value) => updateValues({ fromProductCode: value })}
                  placeholder={tRaw("pigmyInterestProvision.placeholders.selectProductCode")}
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
              label={en("pigmyInterestProvision.fields.productDescription")}
              labelHi={t("pigmyInterestProvision.fields.productDescription")}
            >
              <DateInput
                value={values.productDescription}
                onChange={() => {}}
                placeholder={tRaw("pigmyInterestProvision.placeholders.description")}
                type="text"
                readOnly
              />
            </FormField>

            <FormField
              label={en("pigmyInterestProvision.fields.uptoDate")}
              labelHi={t("pigmyInterestProvision.fields.uptoDate")}
              error={errors.uptoDate}
            >
              <DateInput
                value={values.uptoDate}
                onChange={(value) => updateValues({ uptoDate: value })}
                placeholder={tRaw("pigmyInterestProvision.placeholders.enterDate")}
              />
            </FormField>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
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
        title={en("pigmyInterestProvision.fields.fromProductCode")}
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
