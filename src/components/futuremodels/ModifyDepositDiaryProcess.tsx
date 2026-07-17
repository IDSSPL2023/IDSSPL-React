import { useState } from "react";
import type { ReactNode } from "react";
import { Calendar, Check, ChevronDown, MoreVertical, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import ListModal from "@/components/AccountMaster/ListModal";

type ReportFor = "all" | "si";
type InterestFrequency = "monthly" | "quarterly";

export interface ModifyDepositDiaryData {
  productCode: string;
  productDescription: string;
  fromDate: string;
  toDate: string;
  reportFor: ReportFor;
  interestFrequency: InterestFrequency;
}

export interface ModifyDepositDiaryProcessProps {
  open: boolean;
  onClose: () => void;
  onValidate?: (data: ModifyDepositDiaryData) => void;
  onSave?: (data: ModifyDepositDiaryData) => void;
}

const INITIAL_VALUES: ModifyDepositDiaryData = {
  productCode: "0002",
  productDescription: "",
  fromDate: "2026-05-12",
  toDate: "2026-05-12",
  reportFor: "all",
  interestFrequency: "monthly",
};

const PRODUCTS = [
  { code: "0002", description: "Regular Deposit Diary" },
  { code: "0003", description: "Senior Citizen Deposit Diary" },
];

const buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

export default function ModifyDepositDiaryProcess({
  open,
  onClose,
  onValidate,
  onSave,
}: ModifyDepositDiaryProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<ModifyDepositDiaryData>(INITIAL_VALUES);
  const [isValidated, setIsValidated] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  if (!open) return null;

  const updateValues = (patch: Partial<ModifyDepositDiaryData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setIsValidated(false);
  };

  const handleValidate = () => {
    setIsValidated(true);
    onValidate?.(values);
  };

  const handleSave = () => {
    if (!isValidated) return;
    onSave?.(values);
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
      <div className="w-full max-w-4xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                {en("modifyDepositDiary.title")}
                {t("modifyDepositDiary.title") ? (
                  <span className="text-[#64748B]"> / {t("modifyDepositDiary.title")}</span>
                ) : null}
              </h2>
              <p className="mt-1 text-[14px] leading-snug text-[#64748B]">
                {en("loanInterestRate.subtitle")}
                {t("loanInterestRate.subtitle") ? (
                  <span> / {t("loanInterestRate.subtitle")}</span>
                ) : null}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={en("common.cancel")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <FormField
              label={en("modifyDepositDiary.fields.productCode")}
              labelHi={t("modifyDepositDiary.fields.productCode")}
            >
              <div className="flex gap-2">
                <DateInput
                  value={values.productCode}
                  onChange={(value) => updateValues({ productCode: value })}
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
              label={en("modifyDepositDiary.fields.productDescription")}
              labelHi={t("modifyDepositDiary.fields.productDescription")}
            >
              <DateInput
                value={values.productDescription}
                onChange={(value) => updateValues({ productDescription: value })}
                placeholder={tRaw("modifyDepositDiary.placeholders.name")}
                type="text"
                readOnly
              />
            </FormField>

            <FormField
              label={en("modifyDepositDiary.fields.fromDate")}
              labelHi={t("modifyDepositDiary.fields.fromDate")}
            >
              <DateInput
                value={values.fromDate}
                onChange={(value) => updateValues({ fromDate: value })}
              />
            </FormField>

            <FormField
              label={en("modifyDepositDiary.fields.toDate")}
              labelHi={t("modifyDepositDiary.fields.toDate")}
            >
              <DateInput
                value={values.toDate}
                onChange={(value) => updateValues({ toDate: value })}
              />
            </FormField>

            <div className="flex items-center gap-10">
              <BilingualBlockLabel
                label={en("modifyDepositDiary.fields.reportFor")}
                labelHi={t("modifyDepositDiary.fields.reportFor")}
              />
              <RadioOption
                checked={values.reportFor === "all"}
                onChange={() => updateValues({ reportFor: "all" })}
                label={en("modifyDepositDiary.options.all")}
              />
              <RadioOption
                checked={values.reportFor === "si"}
                onChange={() => updateValues({ reportFor: "si" })}
                label={en("modifyDepositDiary.options.si")}
              />
            </div>

            <div className="flex items-center gap-10">
              <BilingualBlockLabel
                label={en("modifyDepositDiary.fields.selectInterestFrequency")}
                labelHi={t("modifyDepositDiary.fields.selectInterestFrequency")}
              />
              <RadioOption
                checked={values.interestFrequency === "monthly"}
                onChange={() => updateValues({ interestFrequency: "monthly" })}
                label={en("modifyDepositDiary.options.monthly")}
              />
              <RadioOption
                checked={values.interestFrequency === "quarterly"}
                onChange={() => updateValues({ interestFrequency: "quarterly" })}
                label={en("modifyDepositDiary.options.quarterly")}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-6">
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
            onClick={onClose}
            className={`${buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleSave}
            className={`${buttonBase} ${
              isValidated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.save")}
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </div>

    {showProductList && (
      <ListModal
        title={en("modifyDepositDiary.fields.productCode")}
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
  children,
}: {
  label: string;
  labelHi?: string;
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
    </div>
  );
}

function BilingualBlockLabel({ label, labelHi }: { label: string; labelHi?: string }) {
  return (
    <div className="min-w-[80px] text-[15px] font-semibold leading-snug text-[#1F2937]">
      <div>{label}</div>
      {labelHi ? <div className="text-[#64748B]">{labelHi}</div> : null}
    </div>
  );
}

function DateInput({
  value,
  onChange,
  placeholder = "",
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
      {type === "date" ? (
        <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
      ) : (
        <UserRound size={18} className="mr-3 shrink-0 text-[#64748B]" />
      )}
      <input
        type={type === "date" ? "text" : type}
        value={
          type === "date" && value
            ? new Date(value).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : value
        }
        readOnly={readOnly || type === "date"}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
      />
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
