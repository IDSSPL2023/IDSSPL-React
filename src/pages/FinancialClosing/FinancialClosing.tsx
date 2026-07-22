import { useState, useRef, useMemo } from "react";
import type { ReactNode } from "react";
import { BarChart3, Calculator, Calendar, Check, UserRound, X, User, ChevronDown, MoreVertical, FileSpreadsheet, Percent, Printer, Contact, Plus, FileText, Database, Hash, Search, ChevronRight, Landmark } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import ListModal from "@/components/AccountMaster/ListModal";
import { IMAGES } from "@/assets";
import { FieldShell, TextInput, SelectInput, DateInput, RadioYesNo } from "@/components/shared/FormFields";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import InterestPostingProcess from "@/components/futuremodels/InterestPostingProcess";
import SetBranchParameterModal from "@/components/FinancialClosing/SetBranchParameterModal";
import { formatDateDDMMMYYYY } from "@/lib/dateFormat";
import ModalCloseButton from "@/components/common/ModalCloseButton";

/* ===== from DepreciationCalculationProcess.tsx ===== */
export interface DepreciationCalculationProcess_DepreciationCalculationData {
  fromDate: string;
  toDate: string;
  balanceDate: string;
  roundingRequired: boolean;
}

export interface DepreciationCalculationProcess_DepreciationCalculationProcessProps {
  open: boolean;
  onClose: () => void;
  onValidate?: (data: DepreciationCalculationProcess_DepreciationCalculationData) => void;
  onCalculate?: (data: DepreciationCalculationProcess_DepreciationCalculationData) => void;
  onReport?: (data: DepreciationCalculationProcess_DepreciationCalculationData) => void;
  onApply?: (data: DepreciationCalculationProcess_DepreciationCalculationData) => void;
}

type DepreciationCalculationProcess_DateFieldKey = "fromDate" | "toDate" | "balanceDate";

const DepreciationCalculationProcess_INITIAL_VALUES: DepreciationCalculationProcess_DepreciationCalculationData = {
  fromDate: "",
  toDate: "",
  balanceDate: "",
  roundingRequired: false,
};

const DepreciationCalculationProcess_DATE_FIELDS: Array<{
  key: DepreciationCalculationProcess_DateFieldKey;
  labelKey: string;
  placeholderKey: string;
}> = [
  {
    key: "fromDate",
    labelKey: "depreciationCalculation.fields.fromDate",
    placeholderKey: "depreciationCalculation.placeholders.fromDate",
  },
  {
    key: "toDate",
    labelKey: "depreciationCalculation.fields.toDate",
    placeholderKey: "depreciationCalculation.placeholders.toDate",
  },
  {
    key: "balanceDate",
    labelKey: "depreciationCalculation.fields.balanceDate",
    placeholderKey: "depreciationCalculation.placeholders.balanceDate",
  },
];

const DepreciationCalculationProcess_buttonBase =
  "flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-lg px-7 text-[16px] font-semibold transition";

function DepreciationCalculationProcess({
  open,
  onClose,
  onValidate,
  onCalculate,
  onReport,
  onApply,
}: DepreciationCalculationProcess_DepreciationCalculationProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<DepreciationCalculationProcess_DepreciationCalculationData>(DepreciationCalculationProcess_INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<DepreciationCalculationProcess_DateFieldKey, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  if (!open) return null;

  const updateValue = <K extends keyof DepreciationCalculationProcess_DepreciationCalculationData>(
    key: K,
    value: DepreciationCalculationProcess_DepreciationCalculationData[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key !== "roundingRequired") {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    setIsValidated(false);
    setIsCalculated(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<DepreciationCalculationProcess_DateFieldKey, string>> = {};
    DepreciationCalculationProcess_DATE_FIELDS.forEach((field) => {
      if (!values[field.key].trim()) nextErrors[field.key] = en("common.fieldRequired");
    });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[860px] rounded-[22px] bg-white p-5 shadow-2xl">
        <div className="rounded-[18px] bg-white">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100">
            <div className="flex items-start gap-4 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
                <UserRound size={22} />
              </div>
              <div className="min-w-0">
                <h2 className="text-[24px] font-bold leading-tight text-[#1F2858]">
                  {en("depreciationCalculation.title")}
                  {t("depreciationCalculation.title") ? (
                    <span className="text-[#64748B]"> / {t("depreciationCalculation.title")}</span>
                  ) : null}
                </h2>
                <p className="mt-2 text-[15px] leading-snug text-[#64748B]">
                  {en("depreciationCalculation.subtitle")}
                  {t("depreciationCalculation.subtitle") ? (
                    <span> / {t("depreciationCalculation.subtitle")}</span>
                  ) : null}
                </p>
              </div>
            </div>
            <ModalCloseButton onClose={onClose} />
          </div>

          <div className="m-3 space-y-7 border border-primary border-t-4 p-5 rounded-xl">
            {DepreciationCalculationProcess_DATE_FIELDS.map((field) => (
              <DepreciationCalculationProcess_FormField
                key={field.key}
                label={en(field.labelKey)}
                labelHi={t(field.labelKey)}
                error={errors[field.key]}
              >
                <DepreciationCalculationProcess_DateInput
                  value={values[field.key]}
                  onChange={(value) => updateValue(field.key, value)}
                  placeholder={tRaw(field.placeholderKey)}
                />
              </DepreciationCalculationProcess_FormField>
            ))}

            <div className="flex items-center gap-16 pt-4">
              <DepreciationCalculationProcess_BilingualBlockLabel
                label={en("depreciationCalculation.fields.roundingRequired")}
                labelHi={t("depreciationCalculation.fields.roundingRequired")}
              />
              <DepreciationCalculationProcess_RadioOption
                checked={values.roundingRequired}
                onChange={() => updateValue("roundingRequired", true)}
                label={en("common.yes")}
              />
              <DepreciationCalculationProcess_RadioOption
                checked={!values.roundingRequired}
                onChange={() => updateValue("roundingRequired", false)}
                label={en("common.no")}
              />
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleValidate}
            className={`${DepreciationCalculationProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={20} />
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className={`${DepreciationCalculationProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.calculate")}
            <Calculator size={18} />
          </button>
          <button
            type="button"
            onClick={handleReport}
            className={`${DepreciationCalculationProcess_buttonBase} bg-primary-50 text-primary hover:bg-primary-100`}
          >
            {en("common.report")}
            <BarChart3 size={18} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${DepreciationCalculationProcess_buttonBase} ${
              isCalculated
                ? "bg-primary text-white hover:bg-primary-700"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.apply")}
            <Check size={20} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${DepreciationCalculationProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DepreciationCalculationProcess_FormField({
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
      <label className="mb-3 block text-[16px] font-semibold leading-none text-[#111827]">
        {label}
        {labelHi ? <span className="text-[#64748B]"> / {labelHi}</span> : null}
        <span className="ml-0.5 text-rose-600">*</span>
      </label>
      {children}
      {error ? <p className="mt-1 text-[12px] text-rose-600">{error}</p> : null}
    </div>
  );
}

function DepreciationCalculationProcess_BilingualBlockLabel({ label, labelHi }: { label: string; labelHi?: string }) {
  return (
    <div className="min-w-[260px] text-[16px] font-semibold leading-snug text-[#111827]">
      <div>{label}</div>
      {labelHi ? <div className="text-[#64748B]">{labelHi}</div> : null}
    </div>
  );
}

function DepreciationCalculationProcess_DateInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex h-12 items-center rounded-lg border border-[#7E8796] bg-white px-4 text-[16px] text-slate-700">
      <Calendar size={20} className="mr-3 shrink-0 text-[#64748B]" />
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-transparent caret-transparent outline-none placeholder:text-[#8B95A5]"
      />
      <span className={`pointer-events-none absolute left-[52px] ${formatDateDDMMMYYYY(value) ? "" : "text-[#8B95A5]"}`}>
        {formatDateDDMMMYYYY(value) || placeholder}
      </span>
    </div>
  );
}

function DepreciationCalculationProcess_RadioOption({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 text-[16px] font-semibold text-black">
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


/* ===== from DetailTrialBalanceProcess.tsx ===== */
type DetailTrialBalanceProcess_SelectMode = "all" | "single";
type DetailTrialBalanceProcess_ReportType = "pdf" | "xls";

export interface DetailTrialBalanceProcess_DetailTrialBalanceData {
  branchCode: string;
  branchName: string;
  asOnDate: string;
  selectMode: DetailTrialBalanceProcess_SelectMode;
  reportType: DetailTrialBalanceProcess_ReportType;
}

export interface DetailTrialBalanceProcess_DetailTrialBalanceProcessProps {
  open: boolean;
  onClose: () => void;
  onReport?: (data: DetailTrialBalanceProcess_DetailTrialBalanceData) => void;
}

const DetailTrialBalanceProcess_INITIAL_VALUES: DetailTrialBalanceProcess_DetailTrialBalanceData = {
  branchCode: "0002",
  branchName: "Main Branch, Bilagi",
  asOnDate: "",
  selectMode: "single",
  reportType: "pdf",
};

const DetailTrialBalanceProcess_buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

function DetailTrialBalanceProcess({
  open,
  onClose,
  onReport,
}: DetailTrialBalanceProcess_DetailTrialBalanceProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<DetailTrialBalanceProcess_DetailTrialBalanceData>(DetailTrialBalanceProcess_INITIAL_VALUES);
  const [error, setError] = useState<string | undefined>();
  const [isValidated, setIsValidated] = useState(false);

  if (!open) return null;

  const validate = () => {
    const nextError = values.asOnDate ? undefined : en("common.fieldRequired");
    setError(nextError);
    return !nextError;
  };

  const handleValidate = () => {
    if (!validate()) {
      setIsValidated(false);
      return;
    }
    setIsValidated(true);
  };

  const handleReport = () => {
    if (!isValidated) return;
    onReport?.(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                {en("detailTrialBalance.title")}
                {t("detailTrialBalance.title") ? (
                  <span className="text-[#64748B]"> / {t("detailTrialBalance.title")}</span>
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
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 space-y-5">
            <DetailTrialBalanceProcess_FormField
              label={en("detailTrialBalance.fields.branchCode")}
              labelHi={t("detailTrialBalance.fields.branchCode")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <User size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {values.branchCode}
              </div>
            </DetailTrialBalanceProcess_FormField>

            <DetailTrialBalanceProcess_FormField
              label={en("detailTrialBalance.fields.branchName")}
              labelHi={t("detailTrialBalance.fields.branchName")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <User size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {values.branchName}
              </div>
            </DetailTrialBalanceProcess_FormField>

            <DetailTrialBalanceProcess_FormField
              label={en("detailTrialBalance.fields.asOnDate")}
              labelHi={t("detailTrialBalance.fields.asOnDate")}
              error={error}
            >
              <div className="relative flex h-11 items-center rounded-lg border border-[#7E8796] bg-white px-4 text-[15px] text-slate-700">
                <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
                <input
                  type="date"
                  value={values.asOnDate}
                  onChange={(event) => {
                    setValues((prev) => ({ ...prev, asOnDate: event.target.value }));
                    setError(undefined);
                    setIsValidated(false);
                  }}
                  placeholder={tRaw("detailTrialBalance.placeholders.enterDate")}
                  className="min-w-0 flex-1 bg-transparent text-transparent caret-transparent outline-none placeholder:text-[#8B95A5]"
                />
                <span className={`pointer-events-none absolute left-[42px] ${formatDateDDMMMYYYY(values.asOnDate) ? "" : "text-[#8B95A5]"}`}>
                  {formatDateDDMMMYYYY(values.asOnDate) || tRaw("detailTrialBalance.placeholders.enterDate")}
                </span>
              </div>
            </DetailTrialBalanceProcess_FormField>

            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-10">
                <DetailTrialBalanceProcess_BilingualBlockLabel
                  label={en("detailTrialBalance.fields.select")}
                  labelHi={t("detailTrialBalance.fields.select")}
                />
                <DetailTrialBalanceProcess_RadioOption
                  checked={values.selectMode === "all"}
                  onChange={() => {
                    setValues((prev) => ({ ...prev, selectMode: "all" }));
                    setIsValidated(false);
                  }}
                  label={en("detailTrialBalance.options.all")}
                />
                <DetailTrialBalanceProcess_RadioOption
                  checked={values.selectMode === "single"}
                  onChange={() => {
                    setValues((prev) => ({ ...prev, selectMode: "single" }));
                    setIsValidated(false);
                  }}
                  label={en("detailTrialBalance.options.single")}
                />
              </div>

              <div className="flex items-center gap-10">
                <DetailTrialBalanceProcess_BilingualBlockLabel
                  label={en("detailTrialBalance.fields.reportType")}
                  labelHi={t("detailTrialBalance.fields.reportType")}
                />
                <DetailTrialBalanceProcess_ReportOption
                  checked={values.reportType === "pdf"}
                  onChange={() => {
                    setValues((prev) => ({ ...prev, reportType: "pdf" }));
                    setIsValidated(false);
                  }}
                  type="pdf"
                />
                <DetailTrialBalanceProcess_ReportOption
                  checked={values.reportType === "xls"}
                  onChange={() => {
                    setValues((prev) => ({ ...prev, reportType: "xls" }));
                    setIsValidated(false);
                  }}
                  type="xls"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-6">
          <button
            type="button"
            onClick={handleValidate}
            className={`${DetailTrialBalanceProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleReport}
            className={`${DetailTrialBalanceProcess_buttonBase} ${
              isValidated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            disabled
            className={`${DetailTrialBalanceProcess_buttonBase} cursor-not-allowed bg-slate-100 text-slate-400`}
          >
            {en("common.apply")}
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${DetailTrialBalanceProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailTrialBalanceProcess_FormField({
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

function DetailTrialBalanceProcess_BilingualBlockLabel({ label, labelHi }: { label: string; labelHi?: string }) {
  return (
    <div className="min-w-[80px] text-[15px] font-semibold leading-snug text-[#1F2937]">
      <div>{label}</div>
      {labelHi ? <div className="text-[#64748B]">{labelHi}</div> : null}
    </div>
  );
}

function DetailTrialBalanceProcess_RadioOption({
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

function DetailTrialBalanceProcess_ReportOption({
  checked,
  onChange,
  type,
}: {
  checked: boolean;
  onChange: () => void;
  type: DetailTrialBalanceProcess_ReportType;
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


/* ===== from ModifyDepositDiaryProcess.tsx ===== */
type ModifyDepositDiaryProcess_ReportFor = "all" | "si";
type ModifyDepositDiaryProcess_InterestFrequency = "monthly" | "quarterly";

export interface ModifyDepositDiaryProcess_ModifyDepositDiaryData {
  productCode: string;
  productDescription: string;
  fromDate: string;
  toDate: string;
  reportFor: ModifyDepositDiaryProcess_ReportFor;
  interestFrequency: ModifyDepositDiaryProcess_InterestFrequency;
}

export interface ModifyDepositDiaryProcess_ModifyDepositDiaryProcessProps {
  open: boolean;
  onClose: () => void;
  onValidate?: (data: ModifyDepositDiaryProcess_ModifyDepositDiaryData) => void;
  onSave?: (data: ModifyDepositDiaryProcess_ModifyDepositDiaryData) => void;
}

const ModifyDepositDiaryProcess_INITIAL_VALUES: ModifyDepositDiaryProcess_ModifyDepositDiaryData = {
  productCode: "0002",
  productDescription: "",
  fromDate: "2026-05-12",
  toDate: "2026-05-12",
  reportFor: "all",
  interestFrequency: "monthly",
};

const ModifyDepositDiaryProcess_PRODUCTS = [
  { code: "0002", description: "Regular Deposit Diary" },
  { code: "0003", description: "Senior Citizen Deposit Diary" },
];

const ModifyDepositDiaryProcess_buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

function ModifyDepositDiaryProcess({
  open,
  onClose,
  onValidate,
  onSave,
}: ModifyDepositDiaryProcess_ModifyDepositDiaryProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<ModifyDepositDiaryProcess_ModifyDepositDiaryData>(ModifyDepositDiaryProcess_INITIAL_VALUES);
  const [isValidated, setIsValidated] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  if (!open) return null;

  const updateValues = (patch: Partial<ModifyDepositDiaryProcess_ModifyDepositDiaryData>) => {
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
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <ModifyDepositDiaryProcess_FormField
              label={en("modifyDepositDiary.fields.productCode")}
              labelHi={t("modifyDepositDiary.fields.productCode")}
            >
              <div className="flex gap-2">
                <ModifyDepositDiaryProcess_DateInput
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
            </ModifyDepositDiaryProcess_FormField>

            <ModifyDepositDiaryProcess_FormField
              label={en("modifyDepositDiary.fields.productDescription")}
              labelHi={t("modifyDepositDiary.fields.productDescription")}
            >
              <ModifyDepositDiaryProcess_DateInput
                value={values.productDescription}
                onChange={(value) => updateValues({ productDescription: value })}
                placeholder={tRaw("modifyDepositDiary.placeholders.name")}
                type="text"
                readOnly
              />
            </ModifyDepositDiaryProcess_FormField>

            <ModifyDepositDiaryProcess_FormField
              label={en("modifyDepositDiary.fields.fromDate")}
              labelHi={t("modifyDepositDiary.fields.fromDate")}
            >
              <ModifyDepositDiaryProcess_DateInput
                value={values.fromDate}
                onChange={(value) => updateValues({ fromDate: value })}
              />
            </ModifyDepositDiaryProcess_FormField>

            <ModifyDepositDiaryProcess_FormField
              label={en("modifyDepositDiary.fields.toDate")}
              labelHi={t("modifyDepositDiary.fields.toDate")}
            >
              <ModifyDepositDiaryProcess_DateInput
                value={values.toDate}
                onChange={(value) => updateValues({ toDate: value })}
              />
            </ModifyDepositDiaryProcess_FormField>

            <div className="flex items-center gap-10">
              <ModifyDepositDiaryProcess_BilingualBlockLabel
                label={en("modifyDepositDiary.fields.reportFor")}
                labelHi={t("modifyDepositDiary.fields.reportFor")}
              />
              <ModifyDepositDiaryProcess_RadioOption
                checked={values.reportFor === "all"}
                onChange={() => updateValues({ reportFor: "all" })}
                label={en("modifyDepositDiary.options.all")}
              />
              <ModifyDepositDiaryProcess_RadioOption
                checked={values.reportFor === "si"}
                onChange={() => updateValues({ reportFor: "si" })}
                label={en("modifyDepositDiary.options.si")}
              />
            </div>

            <div className="flex items-center gap-10">
              <ModifyDepositDiaryProcess_BilingualBlockLabel
                label={en("modifyDepositDiary.fields.selectInterestFrequency")}
                labelHi={t("modifyDepositDiary.fields.selectInterestFrequency")}
              />
              <ModifyDepositDiaryProcess_RadioOption
                checked={values.interestFrequency === "monthly"}
                onChange={() => updateValues({ interestFrequency: "monthly" })}
                label={en("modifyDepositDiary.options.monthly")}
              />
              <ModifyDepositDiaryProcess_RadioOption
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
            className={`${ModifyDepositDiaryProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${ModifyDepositDiaryProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleSave}
            className={`${ModifyDepositDiaryProcess_buttonBase} ${
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
        rows={ModifyDepositDiaryProcess_PRODUCTS}
        onSelect={handlePickProduct}
        onClose={() => setShowProductList(false)}
      />
    )}
    </>
  );
}

function ModifyDepositDiaryProcess_FormField({
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

function ModifyDepositDiaryProcess_BilingualBlockLabel({ label, labelHi }: { label: string; labelHi?: string }) {
  return (
    <div className="min-w-[80px] text-[15px] font-semibold leading-snug text-[#1F2937]">
      <div>{label}</div>
      {labelHi ? <div className="text-[#64748B]">{labelHi}</div> : null}
    </div>
  );
}

function ModifyDepositDiaryProcess_DateInput({
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
        value={type === "date" ? formatDateDDMMMYYYY(value) : value}
        readOnly={readOnly || type === "date"}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
      />
    </div>
  );
}

function ModifyDepositDiaryProcess_RadioOption({
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


/* ===== from NFormBalancesheetProcess.tsx ===== */
type NFormBalancesheetProcess_SelectMode = "regular" | "closing";

export interface NFormBalancesheetProcess_NFormBalancesheetData {
  productCode: string;
  lastQuarterDate: string;
  select: NFormBalancesheetProcess_SelectMode;
}

export interface NFormBalancesheetProcess_NFormBalancesheetProcessProps {
  open: boolean;
  onClose: () => void;
  onGenerateNForm?: (data: NFormBalancesheetProcess_NFormBalancesheetData) => void;
  onGeneratePnL?: (data: NFormBalancesheetProcess_NFormBalancesheetData) => void;
}

const NFormBalancesheetProcess_INITIAL_VALUES: NFormBalancesheetProcess_NFormBalancesheetData = {
  productCode: "0002",
  lastQuarterDate: "",
  select: "closing",
};

const NFormBalancesheetProcess_buttonBase =
  "flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-[12px] font-semibold transition";

function NFormBalancesheetProcess({
  open,
  onClose,
  onGenerateNForm,
  onGeneratePnL,
}: NFormBalancesheetProcess_NFormBalancesheetProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<NFormBalancesheetProcess_NFormBalancesheetData>(NFormBalancesheetProcess_INITIAL_VALUES);
  const [error, setError] = useState<string | undefined>();
  const [isGenerated, setIsGenerated] = useState(false);

  if (!open) return null;

  const validate = () => {
    const nextError = values.lastQuarterDate.trim() ? undefined : en("common.fieldRequired");
    setError(nextError);
    return !nextError;
  };

  const handleGenerateRecord = () => {
    if (!validate()) {
      setIsGenerated(false);
      return;
    }
    setIsGenerated(true);
  };

  const handleGenerateNForm = () => {
    if (!isGenerated) return;
    onGenerateNForm?.(values);
  };

  const handleGeneratePnL = () => {
    if (!isGenerated) return;
    onGeneratePnL?.(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                {en("nFormBalancesheet.title")}
                {t("nFormBalancesheet.title") ? (
                  <span className="text-[#64748B]"> / {t("nFormBalancesheet.title")}</span>
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
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 space-y-5">
            <NFormBalancesheetProcess_FormField
              label={en("nFormBalancesheet.fields.productCode")}
              labelHi={t("nFormBalancesheet.fields.productCode")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <FileSpreadsheet size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {values.productCode}
              </div>
            </NFormBalancesheetProcess_FormField>

            <NFormBalancesheetProcess_FormField
              label={en("nFormBalancesheet.fields.lastQuarterDate")}
              labelHi={t("nFormBalancesheet.fields.lastQuarterDate")}
              error={error}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-white px-4 text-[15px] text-slate-700">
                <Percent size={18} className="mr-3 shrink-0 text-[#64748B]" />
                <input
                  type="text"
                  value={values.lastQuarterDate}
                  onChange={(event) => {
                    setValues((prev) => ({ ...prev, lastQuarterDate: event.target.value }));
                    setError(undefined);
                    setIsGenerated(false);
                  }}
                  placeholder={tRaw("nFormBalancesheet.placeholders.enterToDate")}
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
                />
              </div>
            </NFormBalancesheetProcess_FormField>

            <div className="flex items-center gap-10">
              <NFormBalancesheetProcess_BilingualBlockLabel
                label={en("nFormBalancesheet.fields.select")}
                labelHi={t("nFormBalancesheet.fields.select")}
              />
              <NFormBalancesheetProcess_RadioOption
                checked={values.select === "regular"}
                onChange={() => {
                  setValues((prev) => ({ ...prev, select: "regular" }));
                  setIsGenerated(false);
                }}
                label={en("nFormBalancesheet.options.regular")}
              />
              <NFormBalancesheetProcess_RadioOption
                checked={values.select === "closing"}
                onChange={() => {
                  setValues((prev) => ({ ...prev, select: "closing" }));
                  setIsGenerated(false);
                }}
                label={en("nFormBalancesheet.options.closing")}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-4 ">
          <button
            type="button"
            onClick={handleGenerateRecord}
            className={`${NFormBalancesheetProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("nFormBalancesheet.actions.generateRecord")}
            <Check size={18} />
          </button>
          <button
            type="button"
            disabled={!isGenerated}
            onClick={handleGenerateNForm}
            className={`${NFormBalancesheetProcess_buttonBase} ${
              isGenerated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("nFormBalancesheet.actions.generateNFormBalanceSheet")}
            <Printer size={17} />
          </button>
          <button
            type="button"
            disabled={!isGenerated}
            onClick={handleGeneratePnL}
            className={`${NFormBalancesheetProcess_buttonBase} ${
              isGenerated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("nFormBalancesheet.actions.generatePnL")}
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${NFormBalancesheetProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function NFormBalancesheetProcess_FormField({
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

function NFormBalancesheetProcess_BilingualBlockLabel({ label, labelHi }: { label: string; labelHi?: string }) {
  return (
    <div className="min-w-[80px] text-[15px] font-semibold leading-snug text-[#1F2937]">
      <div>{label}</div>
      {labelHi ? <div className="text-[#64748B]">{labelHi}</div> : null}
    </div>
  );
}

function NFormBalancesheetProcess_RadioOption({
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


/* ===== from NpaModificationProcess.tsx ===== */
export interface NpaModificationProcess_NpaModificationData {
  fromDate: string;
  toDate: string;
  accountNumber: string;
  accountName: string;
  osAmount: string;
  principalOverdueAmount: string;
  interestOverdueAmount: string;
  principalOverdueMonths: string;
  interestOverdueDate: string;
  calculatedNpaClass: string;
  descriptionOne: string;
  actualNpaClass: string;
  descriptionTwo: string;
  calculatedNpaPercentage: string;
  actualNpaPercentage: string;
  provisionOnAmount: string;
  calculatedProvision: string;
  actualProvision: string;
}

export interface NpaModificationProcess_NpaModificationProcessProps {
  open: boolean;
  onClose: () => void;
  onValidate?: (data: NpaModificationProcess_NpaModificationData) => void;
  onModify?: (data: NpaModificationProcess_NpaModificationData) => void;
}

type NpaModificationProcess_FieldKey = keyof NpaModificationProcess_NpaModificationData;

interface NpaModificationProcess_FieldConfig {
  key: NpaModificationProcess_FieldKey;
  labelKey: string;
  placeholderKey: string;
  icon: "contact" | "calendar";
  readOnly?: boolean;
  lookup?: boolean;
}

const NpaModificationProcess_INITIAL_VALUES: NpaModificationProcess_NpaModificationData = {
  fromDate: "",
  toDate: "",
  accountNumber: "",
  accountName: "",
  osAmount: "",
  principalOverdueAmount: "",
  interestOverdueAmount: "",
  principalOverdueMonths: "",
  interestOverdueDate: "",
  calculatedNpaClass: "",
  descriptionOne: "",
  actualNpaClass: "",
  descriptionTwo: "",
  calculatedNpaPercentage: "",
  actualNpaPercentage: "",
  provisionOnAmount: "",
  calculatedProvision: "",
  actualProvision: "",
};

const NpaModificationProcess_TOP_FIELDS: NpaModificationProcess_FieldConfig[] = [
  {
    key: "fromDate",
    labelKey: "npaModification.fields.fromDate",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "toDate",
    labelKey: "npaModification.fields.toDate",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "accountNumber",
    labelKey: "npaModification.fields.accountNumber",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
    lookup: true,
  },
  {
    key: "accountName",
    labelKey: "npaModification.fields.accountName",
    placeholderKey: "npaModification.placeholders.description",
    icon: "calendar",
    readOnly: true,
  },
];

const NpaModificationProcess_DETAIL_FIELDS: NpaModificationProcess_FieldConfig[] = [
  {
    key: "osAmount",
    labelKey: "npaModification.fields.osAmount",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "principalOverdueAmount",
    labelKey: "npaModification.fields.principalOverdueAmount",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "interestOverdueAmount",
    labelKey: "npaModification.fields.interestOverdueAmount",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "principalOverdueMonths",
    labelKey: "npaModification.fields.principalOverdueMonths",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "interestOverdueDate",
    labelKey: "npaModification.fields.interestOverdueDate",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "calculatedNpaClass",
    labelKey: "npaModification.fields.calculatedNpaClass",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "descriptionOne",
    labelKey: "npaModification.fields.description",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "actualNpaClass",
    labelKey: "npaModification.fields.actualNpaClass",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "descriptionTwo",
    labelKey: "npaModification.fields.description",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "calculatedNpaPercentage",
    labelKey: "npaModification.fields.calculatedNpaPercentage",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "actualNpaPercentage",
    labelKey: "npaModification.fields.actualNpaPercentage",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "provisionOnAmount",
    labelKey: "npaModification.fields.provisionOnAmount",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "calculatedProvision",
    labelKey: "npaModification.fields.calculatedProvision",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "actualProvision",
    labelKey: "npaModification.fields.actualProvision",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
];

const NpaModificationProcess_buttonBase =
  "flex h-10 min-w-[112px] items-center justify-center gap-2 rounded-md px-6 text-[13px] font-semibold transition";

function NpaModificationProcess({
  open,
  onClose,
  onValidate,
  onModify,
}: NpaModificationProcess_NpaModificationProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<NpaModificationProcess_NpaModificationData>(NpaModificationProcess_INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<NpaModificationProcess_FieldKey, string>>>({});
  const [isValidated, setIsValidated] = useState(false);

  if (!open) return null;

  const updateValue = (key: NpaModificationProcess_FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setIsValidated(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<NpaModificationProcess_FieldKey, string>> = {};
    [...NpaModificationProcess_TOP_FIELDS, ...NpaModificationProcess_DETAIL_FIELDS].forEach((field) => {
      if (!values[field.key].trim()) nextErrors[field.key] = en("common.fieldRequired");
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validate()) return;
    setIsValidated(true);
    onValidate?.(values);
  };

  const handleModify = () => {
    if (!isValidated) return;
    onModify?.(values);
  };

  const handleLookup = () => {
    setValues((prev) => ({
      ...prev,
      accountNumber: "00025050007604",
      accountName: "Akshay Om More",
    }));
    setErrors((prev) => ({ ...prev, accountNumber: undefined, accountName: undefined }));
    setIsValidated(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[1024px] rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-4">
            <img
              src={IMAGES.ADD_ICON}
              alt="NPA Modification"
              className="h-12 w-12 object-contain"
            />
            <div className="min-w-0">
              <h2 className="text-[24px] font-bold leading-tight text-[#111827]">
                {en("npaModification.title")}
                {t("npaModification.title") ? (
                  <span className="text-[#64748B]"> / {t("npaModification.title")}</span>
                ) : null}
              </h2>
              <p className="mt-1 text-[13px] leading-snug text-[#64748B]">
                {en("npaModification.subtitle")}
                {t("npaModification.subtitle") ? (
                  <span> / {t("npaModification.subtitle")}</span>
                ) : null}
              </p>
            </div>
          </div>
          <ModalCloseButton onClose={onClose} />
        </div>

        <NpaModificationProcess_FieldSection className="mt-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {NpaModificationProcess_TOP_FIELDS.map((field) => (
              <NpaModificationProcess_NpaField
                key={field.key}
                field={field}
                value={values[field.key]}
                error={errors[field.key]}
                onChange={(value) => updateValue(field.key, value)}
                onLookup={field.lookup ? handleLookup : undefined}
                en={en}
                t={t}
                tRaw={tRaw}
              />
            ))}
          </div>
        </NpaModificationProcess_FieldSection>

        <NpaModificationProcess_FieldSection className="mt-5">
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-4">
            {NpaModificationProcess_DETAIL_FIELDS.map((field) => (
              <NpaModificationProcess_NpaField
                key={field.key}
                field={field}
                value={values[field.key]}
                error={errors[field.key]}
                onChange={(value) => updateValue(field.key, value)}
                en={en}
                t={t}
                tRaw={tRaw}
              />
            ))}
          </div>
        </NpaModificationProcess_FieldSection>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleValidate}
            className={`${NpaModificationProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${NpaModificationProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={16} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleModify}
            className={`${NpaModificationProcess_buttonBase} ${isValidated
                ? "bg-primary text-white hover:bg-primary-700"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
              }`}
          >
            {en("common.modify")}
            <ChevronDown size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}



function NpaModificationProcess_FieldSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-primary border-t-4 bg-white p-4 shadow-[0_1px_8px_rgba(37,99,235,0.12)] ${className}`}>
      {children}
    </div>
  );
}

function NpaModificationProcess_NpaField({
  field,
  value,
  error,
  onChange,
  onLookup,
  en,
  t,
  tRaw,
}: {
  field: NpaModificationProcess_FieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onLookup?: () => void;
  en: (key: string) => string;
  t: (key: string) => string;
  tRaw: (key: string) => string;
}) {
  return (
    <div>
      <label className="mb-3 block text-[15px] font-semibold leading-none text-[#1F2937]">
        {en(field.labelKey)}
        {t(field.labelKey) ? <span className="text-[#64748B]"> / {t(field.labelKey)}</span> : null}
        <span className="ml-0.5 text-rose-600">*</span>
      </label>
      <div className="flex gap-2">
        <NpaModificationProcess_IconInput
          icon={field.icon === "calendar" ? <Calendar size={15} /> : <Contact size={15} />}
          value={value}
          onChange={onChange}
          placeholder={tRaw(field.placeholderKey)}
          readOnly={field.readOnly}
        />
        {onLookup ? (
          <button
            type="button"
            onClick={onLookup}
            className="flex h-9 w-11 shrink-0 items-center justify-center rounded-md bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
          >
            <MoreVertical size={19} strokeWidth={3} />
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-[11px] text-rose-600">{error}</p> : null}
    </div>
  );
}

function NpaModificationProcess_IconInput({
  icon,
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
}) {
  return (
    <div
      className={`flex h-10 min-w-0 flex-1 items-center rounded-md border border-[#7E8796] px-3 text-[13px] text-slate-700 ${readOnly ? "bg-slate-100" : "bg-white"
        }`}
    >
      <span className="mr-2 shrink-0 text-[#64748B]">{icon}</span>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
      />
    </div>
  );
}


/* ===== NpaGenerationProcess (mirrors sibling "calculation" category modals,
   e.g. DepreciationCalculationProcess, since no prior implementation existed) ===== */
interface NpaGenerationProcess_NpaGenerationData {
  branchCode: string;
  fromDate: string;
  toDate: string;
  npaCategory: "" | "Substandard" | "Doubtful" | "Loss";
  reportType: "pdf" | "xls";
}

export interface NpaGenerationProcess_NpaGenerationProcessProps {
  open: boolean;
  onClose: () => void;
  onValidate?: (data: NpaGenerationProcess_NpaGenerationData) => void;
  onCalculate?: (data: NpaGenerationProcess_NpaGenerationData) => void;
  onReport?: (data: NpaGenerationProcess_NpaGenerationData) => void;
  onApply?: (data: NpaGenerationProcess_NpaGenerationData) => void;
}

const NpaGenerationProcess_INITIAL_VALUES: NpaGenerationProcess_NpaGenerationData = {
  branchCode: "Main Branch",
  fromDate: "",
  toDate: "",
  npaCategory: "",
  reportType: "pdf",
};

const NpaGenerationProcess_NPA_CATEGORY_OPTIONS = ["Substandard", "Doubtful", "Loss"];

type NpaGenerationProcess_RequiredField = "fromDate" | "toDate" | "npaCategory";

const NpaGenerationProcess_buttonBase =
  "flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

function NpaGenerationProcess({
  open,
  onClose,
  onValidate,
  onCalculate,
  onReport,
  onApply,
}: NpaGenerationProcess_NpaGenerationProcessProps) {
  const [values, setValues] = useState<NpaGenerationProcess_NpaGenerationData>(NpaGenerationProcess_INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<NpaGenerationProcess_RequiredField, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  if (!open) return null;

  const updateValue = <K extends keyof NpaGenerationProcess_NpaGenerationData>(
    key: K,
    value: NpaGenerationProcess_NpaGenerationData[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setIsValidated(false);
    setIsCalculated(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<NpaGenerationProcess_RequiredField, string>> = {};
    if (!values.fromDate) nextErrors.fromDate = "This field is required";
    if (!values.toDate) nextErrors.toDate = "This field is required";
    if (!values.npaCategory) nextErrors.npaCategory = "This field is required";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <FileText size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">NPA Generation</h2>
              <p className="mt-1 text-[14px] leading-snug text-[#64748B]">
                Generate NPA classification for eligible loan accounts.
              </p>
            </div>
          </div>
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="space-y-5">
            <FieldShell label="Branch" required>
              <TextInput icon={<Landmark size={18} />} value={values.branchCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="From Date" required error={Boolean(errors.fromDate)}>
              <DateInput value={values.fromDate} onChange={(value) => updateValue("fromDate", value)} placeholder="Select from date" />
            </FieldShell>

            <FieldShell label="To Date" required error={Boolean(errors.toDate)}>
              <DateInput value={values.toDate} onChange={(value) => updateValue("toDate", value)} placeholder="Select to date" />
            </FieldShell>

            <FieldShell label="NPA Category" required error={Boolean(errors.npaCategory)}>
              <SelectInput
                value={values.npaCategory}
                onChange={(value) => updateValue("npaCategory", value as NpaGenerationProcess_NpaGenerationData["npaCategory"])}
                options={NpaGenerationProcess_NPA_CATEGORY_OPTIONS}
                placeholder="Select NPA category"
              />
            </FieldShell>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">Report Type</label>
              <div className="flex items-center gap-6">
                {(["pdf", "xls"] as const).map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="npa-generation-report-type"
                      checked={values.reportType === opt}
                      onChange={() => updateValue("reportType", opt)}
                      className="h-4 w-4"
                      style={{ accentColor: "#1F67F4" }}
                    />
                    {opt.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleValidate}
            className={`${NpaGenerationProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            Validate
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className={`${NpaGenerationProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            Calculate
            <Calculator size={17} />
          </button>
          <button
            type="button"
            onClick={handleReport}
            className={`${NpaGenerationProcess_buttonBase} bg-primary-50 text-primary hover:bg-primary-100`}
          >
            Report
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${NpaGenerationProcess_buttonBase} ${
              isCalculated
                ? "bg-primary text-white hover:bg-primary-700"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            Apply
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${NpaGenerationProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            Cancel
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}


/* ===== from TdPostingConsistencyProcess.tsx ===== */
type TdPostingConsistencyProcess_SelectMode = "all" | "single";
type TdPostingConsistencyProcess_ReportType = "pdf" | "xls";

export interface TdPostingConsistencyProcess_TdPostingConsistencyData {
  applyInterestUpToDate: string;
  postAs: string;
  selectMode: TdPostingConsistencyProcess_SelectMode;
  reportType: TdPostingConsistencyProcess_ReportType;
  productCode: string;
  productDescription: string;
}

export interface TdPostingConsistencyProcess_TdPostingConsistencyProcessProps {
  open: boolean;
  onClose: () => void;
  onValidate?: (data: TdPostingConsistencyProcess_TdPostingConsistencyData) => void;
  onCalculate?: (data: TdPostingConsistencyProcess_TdPostingConsistencyData) => void;
  onReport?: (data: TdPostingConsistencyProcess_TdPostingConsistencyData) => void;
  onApply?: (data: TdPostingConsistencyProcess_TdPostingConsistencyData) => void;
}

const TdPostingConsistencyProcess_INITIAL_VALUES: TdPostingConsistencyProcess_TdPostingConsistencyData = {
  applyInterestUpToDate: "",
  postAs: "",
  selectMode: "single",
  reportType: "pdf",
  productCode: "",
  productDescription: "",
};

const TdPostingConsistencyProcess_POST_AS_OPTIONS = ["Interest Posting", "Provision Posting", "Closing Posting"];
const TdPostingConsistencyProcess_PRODUCTS = [
  { code: "TD001", description: "Term Deposit" },
  { code: "TD002", description: "Recurring Deposit" },
];

type TdPostingConsistencyProcess_RequiredField = "applyInterestUpToDate" | "postAs" | "productCode" | "productDescription";

const TdPostingConsistencyProcess_buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

function TdPostingConsistencyProcess({
  open,
  onClose,
  onValidate,
  onCalculate,
  onReport,
  onApply,
}: TdPostingConsistencyProcess_TdPostingConsistencyProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<TdPostingConsistencyProcess_TdPostingConsistencyData>(TdPostingConsistencyProcess_INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<TdPostingConsistencyProcess_RequiredField, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  if (!open) return null;

  const updateValues = (patch: Partial<TdPostingConsistencyProcess_TdPostingConsistencyData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key as TdPostingConsistencyProcess_RequiredField]);
      return next;
    });
    setIsValidated(false);
    setIsCalculated(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<TdPostingConsistencyProcess_RequiredField, string>> = {};
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
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-start gap-4 min-w-0">
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
            <ModalCloseButton onClose={onClose} />
          </div>
        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">

          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <TdPostingConsistencyProcess_FormField
              label={en("tdPostingConsistency.fields.applyInterestUpToDate")}
              labelHi={t("tdPostingConsistency.fields.applyInterestUpToDate")}
              error={errors.applyInterestUpToDate}
            >
              <TdPostingConsistencyProcess_DateInput
                value={values.applyInterestUpToDate}
                onChange={(value) => updateValues({ applyInterestUpToDate: value })}
                placeholder={tRaw("tdPostingConsistency.placeholders.applyInterestUpToDate")}
              />
            </TdPostingConsistencyProcess_FormField>

            <TdPostingConsistencyProcess_FormField
              label={en("tdPostingConsistency.fields.postAs")}
              labelHi={t("tdPostingConsistency.fields.postAs")}
              error={errors.postAs}
            >
              <TdPostingConsistencyProcess_SelectInput
                value={values.postAs}
                onChange={(value) => updateValues({ postAs: value })}
                placeholder={tRaw("tdPostingConsistency.placeholders.postAs")}
              />
            </TdPostingConsistencyProcess_FormField>

            <div className="flex items-center gap-10">
              <TdPostingConsistencyProcess_BilingualBlockLabel
                label={en("tdPostingConsistency.fields.select")}
                labelHi={t("tdPostingConsistency.fields.select")}
              />
              <TdPostingConsistencyProcess_RadioOption
                checked={values.selectMode === "all"}
                onChange={() => updateValues({ selectMode: "all" })}
                label={en("tdPostingConsistency.options.all")}
              />
              <TdPostingConsistencyProcess_RadioOption
                checked={values.selectMode === "single"}
                onChange={() => updateValues({ selectMode: "single" })}
                label={en("tdPostingConsistency.options.single")}
              />
            </div>

            <div className="flex items-center gap-10">
              <TdPostingConsistencyProcess_BilingualBlockLabel
                label={en("tdPostingConsistency.fields.reportType")}
                labelHi={t("tdPostingConsistency.fields.reportType")}
              />
              <TdPostingConsistencyProcess_ReportOption
                checked={values.reportType === "pdf"}
                onChange={() => updateValues({ reportType: "pdf" })}
                type="pdf"
              />
              <TdPostingConsistencyProcess_ReportOption
                checked={values.reportType === "xls"}
                onChange={() => updateValues({ reportType: "xls" })}
                type="xls"
              />
            </div>

            <TdPostingConsistencyProcess_FormField
              label={en("tdPostingConsistency.fields.productCode")}
              labelHi={t("tdPostingConsistency.fields.productCode")}
              error={errors.productCode}
            >
              <div className="flex gap-2">
                <TdPostingConsistencyProcess_DateInput
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
            </TdPostingConsistencyProcess_FormField>

            <TdPostingConsistencyProcess_FormField
              label={en("tdPostingConsistency.fields.productDescription")}
              labelHi={t("tdPostingConsistency.fields.productDescription")}
              error={errors.productDescription}
            >
              <TdPostingConsistencyProcess_DateInput
                value={values.productDescription}
                onChange={(value) => updateValues({ productDescription: value })}
                placeholder={tRaw("tdPostingConsistency.placeholders.description")}
                type="text"
                readOnly
              />
            </TdPostingConsistencyProcess_FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-6">
          <button
            type="button"
            onClick={handleValidate}
            className={`${TdPostingConsistencyProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className={`${TdPostingConsistencyProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.calculate")}
            <Calculator size={17} />
          </button>
          <button
            type="button"
            onClick={handleReport}
            className={`${TdPostingConsistencyProcess_buttonBase} bg-primary-50 text-primary hover:bg-primary-100`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${TdPostingConsistencyProcess_buttonBase} ${
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
            className={`${TdPostingConsistencyProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
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
        rows={TdPostingConsistencyProcess_PRODUCTS}
        onSelect={handlePickProduct}
        onClose={() => setShowProductList(false)}
      />
    )}
    </>
  );
}

function TdPostingConsistencyProcess_FormField({
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

function TdPostingConsistencyProcess_BilingualBlockLabel({ label, labelHi }: { label: string; labelHi?: string }) {
  return (
    <div className="min-w-[120px] text-[15px] font-semibold leading-snug text-[#1F2937]">
      <div>{label}</div>
      {labelHi ? <div className="text-[#64748B]">{labelHi}</div> : null}
    </div>
  );
}

function TdPostingConsistencyProcess_DateInput({
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
    <div className={`relative flex h-11 items-center rounded-lg border border-[#7E8796] px-4 text-[15px] text-slate-700 ${
      readOnly ? "bg-slate-100" : "bg-white"
    }`}>
      <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5] ${type === "date" ? "text-transparent caret-transparent" : ""}`}
      />
      {type === "date" && (
        <span className={`pointer-events-none absolute left-[42px] ${formatDateDDMMMYYYY(value) ? "" : "text-[#8B95A5]"}`}>
          {formatDateDDMMMYYYY(value) || placeholder}
        </span>
      )}
    </div>
  );
}

function TdPostingConsistencyProcess_SelectInput({
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
        {TdPostingConsistencyProcess_POST_AS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="pointer-events-none absolute right-4 text-[#64748B]" />
    </div>
  );
}

function TdPostingConsistencyProcess_RadioOption({
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

function TdPostingConsistencyProcess_ReportOption({
  checked,
  onChange,
  type,
}: {
  checked: boolean;
  onChange: () => void;
  type: TdPostingConsistencyProcess_ReportType;
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


/* ===== from TlccInterestPostingProcess.tsx ===== */
export interface TlccInterestPostingProcess_TlccInterestPostingData {
  accountType: string;
  accountTypeDescription: string;
  nextIntPostingDate: string;
  nextIntPostingUpToDate: string;
  applyServiceCharges: boolean;
  interestReposting: boolean;
}

export interface TlccInterestPostingProcess_TlccInterestPostingProcessProps {
  open: boolean;
  onClose: () => void;
  onCalculate?: (data: TlccInterestPostingProcess_TlccInterestPostingData) => void;
  onGenerateReport?: (data: TlccInterestPostingProcess_TlccInterestPostingData) => void;
  onApply?: (data: TlccInterestPostingProcess_TlccInterestPostingData) => void;
}

const TlccInterestPostingProcess_ACCOUNT_TYPES: { code: string; description: string }[] = [
  { code: "TLCC", description: "Term Loan / Cash Credit" },
  { code: "OD", description: "Overdraft Account" },
  { code: "CC", description: "Cash Credit Account" },
];

const TlccInterestPostingProcess_INITIAL_VALUES: TlccInterestPostingProcess_TlccInterestPostingData = {
  accountType: "",
  accountTypeDescription: "",
  nextIntPostingDate: "",
  nextIntPostingUpToDate: "",
  applyServiceCharges: false,
  interestReposting: false,
};

type TlccInterestPostingProcess_RequiredFieldKey = "accountType" | "nextIntPostingDate" | "nextIntPostingUpToDate";

const TlccInterestPostingProcess_validateDate = (value: string) => {
  if (!value) return "This field is required";
  if (Number.isNaN(new Date(value).getTime())) return "Enter a valid date";
  return "";
};

const TlccInterestPostingProcess_buttonBase =
  "flex h-10 items-center justify-center gap-1.5 rounded-md px-5 text-[13px] font-semibold transition";

function TlccInterestPostingProcess({
  open,
  onClose,
  onCalculate,
  onGenerateReport,
  onApply,
}: TlccInterestPostingProcess_TlccInterestPostingProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<TlccInterestPostingProcess_TlccInterestPostingData>(TlccInterestPostingProcess_INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<TlccInterestPostingProcess_RequiredFieldKey, string>>>({});
  const [isCalculated, setIsCalculated] = useState(false);
  const [showAccountTypeList, setShowAccountTypeList] = useState(false);

  if (!open) return null;

  const validate = () => {
    const nextErrors: Partial<Record<TlccInterestPostingProcess_RequiredFieldKey, string>> = {};
    if (!values.accountType.trim()) nextErrors.accountType = "This field is required";
    const dateError = TlccInterestPostingProcess_validateDate(values.nextIntPostingDate);
    if (dateError) nextErrors.nextIntPostingDate = dateError;
    const uptoDateError = TlccInterestPostingProcess_validateDate(values.nextIntPostingUpToDate);
    if (uptoDateError) nextErrors.nextIntPostingUpToDate = uptoDateError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateValues = (patch: Partial<TlccInterestPostingProcess_TlccInterestPostingData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setIsCalculated(false);
  };

  const handlePickAccountType = (match: { code: string; description: string }) => {
    updateValues({ accountType: match.code, accountTypeDescription: match.description });
    setErrors((prev) => ({ ...prev, accountType: undefined }));
    setShowAccountTypeList(false);
  };

  const handleValidate = () => {
    validate();
  };

  const handleCalculate = () => {
    if (!validate()) return;
    onCalculate?.(values);
    setIsCalculated(true);
  };

  const handleGenerateReport = () => {
    if (!validate()) return;
    onGenerateReport?.(values);
  };

  const handleApply = () => {
    if (!isCalculated) return;
    onApply?.(values);
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-3 shadow-2xl">
        <div className="rounded-2xl p-3">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary">
                <UserRound size={19} />
              </div>
              <div className="min-w-0">
                <h2 className="text-[19px] font-bold leading-tight text-[#1F2858]">
                  {en("tlccInterestPosting.title")}
                  {t("tlccInterestPosting.title") ? (
                    <span className="text-[#64748B]"> / {t("tlccInterestPosting.title")}</span>
                  ) : null}
                </h2>
                <p className="text-[13px] leading-snug text-slate-500">
                  {en("interestPostingProcess.subtitle")}
                  {t("interestPostingProcess.subtitle") ? (
                    <span> / {t("interestPostingProcess.subtitle")}</span>
                  ) : null}
                </p>
              </div>
            </div>
            <ModalCloseButton onClose={onClose} />
          </div>

          <div className="mt-4 rounded-xl border border-primary border-t-4 bg-white px-5 pb-6 pt-5 shadow-[0_1px_8px_rgba(37,99,235,0.12)]">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <FieldShell
                label={en("tlccInterestPosting.fields.accountType")}
                labelHi={t("tlccInterestPosting.fields.accountType")}
                error={!!errors.accountType}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput
                      icon={<Calendar size={15} />}
                      value={values.accountType}
                      onChange={() => {}}
                      readOnly
                      placeholder={tRaw("tlccInterestPosting.placeholders.selectAccountType")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAccountTypeList(true)}
                    className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
                  >
                    <MoreVertical size={20} strokeWidth={3} />
                  </button>
                </div>
              </FieldShell>

              <FieldShell
                label={en("tlccInterestPosting.fields.accountTypeDescription")}
                labelHi={t("tlccInterestPosting.fields.accountTypeDescription")}
              >
                <TextInput
                  icon={<Calendar size={15} />}
                  value={values.accountTypeDescription}
                  onChange={() => {}}
                  readOnly
                  placeholder={tRaw("tlccInterestPosting.placeholders.description")}
                />
              </FieldShell>

              <FieldShell
                label={en("tlccInterestPosting.fields.nextIntPostingDate")}
                labelHi={t("tlccInterestPosting.fields.nextIntPostingDate")}
                error={!!errors.nextIntPostingDate}
              >
                <DateInput
                  value={values.nextIntPostingDate}
                  onChange={(value) => {
                    updateValues({ nextIntPostingDate: value });
                    setErrors((prev) => ({ ...prev, nextIntPostingDate: undefined }));
                  }}
                  placeholder={tRaw("interestPostingProcess.placeholders.fromDate")}
                />
              </FieldShell>

              <FieldShell
                label={en("tlccInterestPosting.fields.nextIntPostingUpToDate")}
                labelHi={t("tlccInterestPosting.fields.nextIntPostingUpToDate")}
                error={!!errors.nextIntPostingUpToDate}
              >
                <DateInput
                  value={values.nextIntPostingUpToDate}
                  onChange={(value) => {
                    updateValues({ nextIntPostingUpToDate: value });
                    setErrors((prev) => ({ ...prev, nextIntPostingUpToDate: undefined }));
                  }}
                  placeholder={tRaw("interestPostingProcess.placeholders.fromDate")}
                />
              </FieldShell>

              <RadioYesNo
                label={en("tlccInterestPosting.fields.applyServiceCharges")}
                labelHi={t("tlccInterestPosting.fields.applyServiceCharges")}
                value={values.applyServiceCharges}
                onChange={(value) => updateValues({ applyServiceCharges: value })}
              />

              <RadioYesNo
                label={en("tlccInterestPosting.fields.interestReposting")}
                labelHi={t("tlccInterestPosting.fields.interestReposting")}
                value={values.interestReposting}
                onChange={(value) => updateValues({ interestReposting: value })}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleValidate}
            className={`${TlccInterestPostingProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className={`${TlccInterestPostingProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.calculate")}
            <Calculator size={13} />
          </button>
          <button
            type="button"
            onClick={handleGenerateReport}
            className={`${TlccInterestPostingProcess_buttonBase} bg-primary-50 text-primary hover:bg-primary-100`}
          >
            {en("common.report")}
            <FileText size={13} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${TlccInterestPostingProcess_buttonBase} min-w-[100px] ${
              isCalculated
                ? "bg-primary text-white hover:bg-primary-700 cursor-pointer"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.apply")}
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${TlccInterestPostingProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={14} />
          </button>
        </div>
      </div>
    </div>

    {showAccountTypeList && (
      <ListModal
        title={en("tlccInterestPosting.fields.accountType")}
        columns={[
          { key: "code", label: "Code" },
          { key: "description", label: "Description" },
        ]}
        rows={TlccInterestPostingProcess_ACCOUNT_TYPES}
        onSelect={handlePickAccountType}
        onClose={() => setShowAccountTypeList(false)}
      />
    )}
    </>
  );
}


/* ===== from Income&ExpClosing.tsx ===== */
export interface IncomeExpClosing_ReportsParameterModalProps {
  open: boolean;
  onClose: () => void;
}

function ReportsParameterModal({
  open,
  onClose,
}: IncomeExpClosing_ReportsParameterModalProps) {
  const [asOnDate, setAsOnDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleIconClick = () => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
    }
  };

  const handlePrint = () => {
    // placeholder — wire to real print/export logic when available
  };

  return (
    <FormModal
      onClose={onClose}
      titleEn="Reports Parameter"
      titleHi="अहवाल मापदंड"
      subtitleEn="Process interest posting for eligible deposit accounts."
      subtitleHi="पात्र ठेव खात्यांसाठी व्याज नोंदणी प्रक्रिया करा."
      headerIcon={
        <div className="flex h-12 w-12 items-center justify-center">
          <Image src={IMAGES.PERSON_ICON} alt="Reports Parameter" width={40} height={40} />
        </div>
      }
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      maxWidth="max-w-4xl"
      customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Printing
            <Printer className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="p-1">
        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <FieldShell label="As on Date " labelHi="आजच्या तारखेनुसार" required>
            <div className="relative flex items-center">
              <span 
                onClick={handleIconClick}
                className="absolute left-3 z-10 cursor-pointer text-slate-400"
              >
                <Calendar size={16} />
              </span>
              <input
                ref={inputRef}
                type="date"
                value={asOnDate}
                onChange={(e) => setAsOnDate(e.target.value)}
                className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary opacity-0 absolute inset-0 cursor-pointer"
                style={{ opacity: 0, position: 'absolute' }}
              />
              <div
                onClick={handleIconClick}
                className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none cursor-pointer flex items-center"
              >
                {formatDateDDMMMYYYY(asOnDate) || "Enter From Date"}
              </div>
            </div>
          </FieldShell>
        </div>
      </div>
    </FormModal>
  );
}


/* ===== from Income&ExpRegular.tsx ===== */
export interface IncomeExpRegular_ReportsParameterBranchModalProps {
  open: boolean;
  onClose: () => void;
}

function ReportsParameterBranchModal({
  open,
  onClose,
}: IncomeExpRegular_ReportsParameterBranchModalProps) {
  const [branchCode] = useState("0002");
  const [asOnDate, setAsOnDate] = useState("");
  const [isValidated, setIsValidated] = useState(false);

  if (!open) return null;

  const handlePrint = () => {
    setIsValidated(true);
    // placeholder — wire to real print logic when available
  };

  const handleGenerate = () => {
    // placeholder — wire to real generate logic when available
  };

  return (
    <FormModal
      onClose={onClose}
      titleEn="Reports Parameter"
      titleHi="अहवाल मापदंड"
      subtitleEn="Process interest posting for eligible deposit accounts."
      subtitleHi="पात्र ठेव खात्यांसाठी व्याज नोंदणी प्रक्रिया करा."
      headerIcon={
        <div className="flex h-12 w-12 items-center justify-center">
          <Image src={IMAGES.PERSON_ICON} alt="Reports Parameter" width={40} height={40} />
        </div>
      }
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      maxWidth="max-w-4xl"
      customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Printing
            <Printer className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!isValidated}
            className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              isValidated
                ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Generate
            <Database className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="p-1">
        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-5">
            <FieldShell label="Branch Code " labelHi="शाखा कोड" required>
              <TextInput
                icon={<Percent size={16} />}
                value={branchCode}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="As on Date " labelHi="आजच्या तारखेनुसार" required>
              <TextInput
                icon={<Calendar size={16} />}
                value={asOnDate}
                onChange={setAsOnDate}
                placeholder="Enter From Date"
              />
            </FieldShell>
          </div>
        </div>
      </div>
    </FormModal>
  );
}


/* ===== from FinancialClosing.tsx ===== */
/* ===== from ExceedCashLimitReportProcess.tsx ===== */
export interface ExceedCashLimitReportProcess_ExceedCashLimitReportData {
  fromProductCode: string;
  fromProductDescription: string;
  toProductCode: string;
  toProductDescription: string;
  asOnDate: string;
}

export interface ExceedCashLimitReportProcess_ExceedCashLimitReportProcessProps {
  open: boolean;
  onClose: () => void;
  onCalculate?: (data: ExceedCashLimitReportProcess_ExceedCashLimitReportData) => void;
  onReport?: (data: ExceedCashLimitReportProcess_ExceedCashLimitReportData) => void;
  onApply?: (data: ExceedCashLimitReportProcess_ExceedCashLimitReportData) => void;
}

const ExceedCashLimitReportProcess_INITIAL_VALUES: ExceedCashLimitReportProcess_ExceedCashLimitReportData = {
  fromProductCode: "",
  fromProductDescription: "",
  toProductCode: "",
  toProductDescription: "",
  asOnDate: "",
};

const ExceedCashLimitReportProcess_PRODUCTS = [
  { code: "0001", description: "Savings Account" },
  { code: "0002", description: "Current Account" },
];

type ExceedCashLimitReportProcess_RequiredField = "fromProductCode" | "toProductCode" | "asOnDate";

const ExceedCashLimitReportProcess_buttonBase =
  "flex h-10 min-w-[110px] items-center justify-center gap-1 rounded-md px-4 text-[13px] font-semibold transition";

function ExceedCashLimitReportProcess({
  open,
  onClose,
  onCalculate,
  onReport,
  onApply,
}: ExceedCashLimitReportProcess_ExceedCashLimitReportProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<ExceedCashLimitReportProcess_ExceedCashLimitReportData>(ExceedCashLimitReportProcess_INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<ExceedCashLimitReportProcess_RequiredField, string>>>({});
  const [isCalculated, setIsCalculated] = useState(false);
  const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);

  if (!open) return null;

  const updateValues = (patch: Partial<ExceedCashLimitReportProcess_ExceedCashLimitReportData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key as ExceedCashLimitReportProcess_RequiredField]);
      return next;
    });
    setIsCalculated(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<ExceedCashLimitReportProcess_RequiredField, string>> = {};
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
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4 min-w-0">
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
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 space-y-5">
            <ExceedCashLimitReportProcess_FormField
              label={en("exceedCashLimitReport.fields.fromProductCode")}
              labelHi={t("exceedCashLimitReport.fields.fromProductCode")}
              error={errors.fromProductCode}
            >
              <div className="flex gap-2">
                <ExceedCashLimitReportProcess_DateInput
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
            </ExceedCashLimitReportProcess_FormField>

            <ExceedCashLimitReportProcess_FormField
              label={en("exceedCashLimitReport.fields.productDescription")}
              labelHi={t("exceedCashLimitReport.fields.productDescription")}
            >
              <ExceedCashLimitReportProcess_DateInput
                value={values.fromProductDescription}
                onChange={() => {}}
                placeholder={tRaw("exceedCashLimitReport.placeholders.description")}
                type="text"
                readOnly
              />
            </ExceedCashLimitReportProcess_FormField>

            <ExceedCashLimitReportProcess_FormField
              label={en("exceedCashLimitReport.fields.toProductCode")}
              labelHi={t("exceedCashLimitReport.fields.toProductCode")}
              error={errors.toProductCode}
            >
              <div className="flex gap-2">
                <ExceedCashLimitReportProcess_DateInput
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
            </ExceedCashLimitReportProcess_FormField>

            <ExceedCashLimitReportProcess_FormField
              label={en("exceedCashLimitReport.fields.productDescription")}
              labelHi={t("exceedCashLimitReport.fields.productDescription")}
            >
              <ExceedCashLimitReportProcess_DateInput
                value={values.toProductDescription}
                onChange={() => {}}
                placeholder={tRaw("exceedCashLimitReport.placeholders.description")}
                type="text"
                readOnly
              />
            </ExceedCashLimitReportProcess_FormField>

            <ExceedCashLimitReportProcess_FormField
              label={en("exceedCashLimitReport.fields.asOnDate")}
              labelHi={t("exceedCashLimitReport.fields.asOnDate")}
              error={errors.asOnDate}
            >
              <ExceedCashLimitReportProcess_DateInput
                value={values.asOnDate}
                onChange={(value) => updateValues({ asOnDate: value })}
                placeholder={tRaw("exceedCashLimitReport.placeholders.enterDate")}
              />
            </ExceedCashLimitReportProcess_FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleValidate}
            className={`${ExceedCashLimitReportProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className={`${ExceedCashLimitReportProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.calculate")}
            <Calculator size={17} />
          </button>
          <button
            type="button"
            onClick={handleReport}
            className={`${ExceedCashLimitReportProcess_buttonBase} bg-primary-50 text-primary hover:bg-primary-100`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${ExceedCashLimitReportProcess_buttonBase} ${
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
            className={`${ExceedCashLimitReportProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
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
        rows={ExceedCashLimitReportProcess_PRODUCTS}
        onSelect={handlePickProduct}
        onClose={() => setActivePicker(null)}
      />
    )}
    </>
  );
}

function ExceedCashLimitReportProcess_FormField({
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

function ExceedCashLimitReportProcess_DateInput({
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
      className={`relative flex h-11 flex-1 items-center rounded-lg border border-[#7E8796] px-4 text-[15px] text-slate-700 ${
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
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5] ${type === "date" ? "text-transparent caret-transparent" : ""}`}
      />
      {type === "date" && (
        <span className={`pointer-events-none absolute left-[42px] ${formatDateDDMMMYYYY(value) ? "" : "text-[#8B95A5]"}`}>
          {formatDateDDMMMYYYY(value) || placeholder}
        </span>
      )}
    </div>
  );
}


/* ===== from HoInterestReportBranchProcess.tsx ===== */
export interface HoInterestReportBranchProcess_HoInterestReportBranchData {
  fromDate: string;
  toDate: string;
}

export interface HoInterestReportBranchProcess_HoInterestReportBranchProcessProps {
  open: boolean;
  onClose: () => void;
  onReport?: (data: HoInterestReportBranchProcess_HoInterestReportBranchData) => void;
}

const HoInterestReportBranchProcess_INITIAL_VALUES: HoInterestReportBranchProcess_HoInterestReportBranchData = {
  fromDate: "2026-04-01",
  toDate: "2026-06-01",
};

const HoInterestReportBranchProcess_buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

function HoInterestReportBranchProcess({
  open,
  onClose,
  onReport,
}: HoInterestReportBranchProcess_HoInterestReportBranchProcessProps) {
  const { en, t } = useBilingual();
  const [values, setValues] = useState<HoInterestReportBranchProcess_HoInterestReportBranchData>(HoInterestReportBranchProcess_INITIAL_VALUES);
  const [isValidated, setIsValidated] = useState(false);

  if (!open) return null;

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleReport = () => {
    if (!isValidated) return;
    onReport?.(values);
  };

  const formatDate = formatDateDDMMMYYYY;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                {en("hoInterestReportBranch.title")}
                {t("hoInterestReportBranch.title") ? (
                  <span className="text-[#64748B]"> / {t("hoInterestReportBranch.title")}</span>
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
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <HoInterestReportBranchProcess_FormField
              label={en("hoInterestReportBranch.fields.fromDate")}
              labelHi={t("hoInterestReportBranch.fields.fromDate")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {formatDate(values.fromDate)}
              </div>
            </HoInterestReportBranchProcess_FormField>

            <HoInterestReportBranchProcess_FormField
              label={en("hoInterestReportBranch.fields.toDate")}
              labelHi={t("hoInterestReportBranch.fields.toDate")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {formatDate(values.toDate)}
              </div>
            </HoInterestReportBranchProcess_FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleValidate}
            className={`${HoInterestReportBranchProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleReport}
            className={`${HoInterestReportBranchProcess_buttonBase} ${
              isValidated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${HoInterestReportBranchProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HoInterestReportBranchProcess_FormField({
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


/* ===== from HoInterestReportGlProcess.tsx ===== */
export interface HoInterestReportGlProcess_HoInterestReportGlData {
  glAccountCode: string;
  accountName: string;
  fromDate: string;
  toDate: string;
}

export interface HoInterestReportGlProcess_HoInterestReportGlProcessProps {
  open: boolean;
  onClose: () => void;
  onReport?: (data: HoInterestReportGlProcess_HoInterestReportGlData) => void;
}

const HoInterestReportGlProcess_INITIAL_VALUES: HoInterestReportGlProcess_HoInterestReportGlData = {
  glAccountCode: "0002",
  accountName: "",
  fromDate: "2026-05-12",
  toDate: "2026-05-12",
};

const HoInterestReportGlProcess_GL_ACCOUNTS = [
  { code: "0002", name: "Interest Payable GL" },
  { code: "0003", name: "Interest Receivable GL" },
];

const HoInterestReportGlProcess_buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

function HoInterestReportGlProcess({
  open,
  onClose,
  onReport,
}: HoInterestReportGlProcess_HoInterestReportGlProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<HoInterestReportGlProcess_HoInterestReportGlData>(HoInterestReportGlProcess_INITIAL_VALUES);
  const [isValidated, setIsValidated] = useState(false);
  const [showAccountList, setShowAccountList] = useState(false);

  if (!open) return null;

  const updateValues = (patch: Partial<HoInterestReportGlProcess_HoInterestReportGlData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setIsValidated(false);
  };

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleReport = () => {
    if (!isValidated) return;
    onReport?.(values);
  };

  const handlePickAccount = (account: { code: string; name: string }) => {
    updateValues({ glAccountCode: account.code, accountName: account.name });
    setShowAccountList(false);
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                {en("hoInterestReportGl.title")}
                {t("hoInterestReportGl.title") ? (
                  <span className="text-[#64748B]"> / {t("hoInterestReportGl.title")}</span>
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
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <HoInterestReportGlProcess_FormField
              label={en("hoInterestReportGl.fields.glAccountCode")}
              labelHi={t("hoInterestReportGl.fields.glAccountCode")}
            >
              <div className="flex gap-2">
                <HoInterestReportGlProcess_IconInput
                  icon={<UserRound size={18} className="mr-3 shrink-0 text-[#64748B]" />}
                  value={values.glAccountCode}
                  onChange={(value) => updateValues({ glAccountCode: value })}
                />
                <button
                  type="button"
                  onClick={() => setShowAccountList(true)}
                  className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
                >
                  <MoreVertical size={22} strokeWidth={3} />
                </button>
              </div>
            </HoInterestReportGlProcess_FormField>

            <HoInterestReportGlProcess_FormField
              label={en("hoInterestReportGl.fields.accountName")}
              labelHi={t("hoInterestReportGl.fields.accountName")}
            >
              <HoInterestReportGlProcess_IconInput
                icon={<UserRound size={18} className="mr-3 shrink-0 text-[#64748B]" />}
                value={values.accountName}
                onChange={() => {}}
                placeholder={tRaw("hoInterestReportGl.placeholders.name")}
                readOnly
              />
            </HoInterestReportGlProcess_FormField>

            <HoInterestReportGlProcess_FormField
              label={en("hoInterestReportGl.fields.fromDate")}
              labelHi={t("hoInterestReportGl.fields.fromDate")}
            >
              <HoInterestReportGlProcess_IconInput
                icon={<Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />}
                value={values.fromDate}
                onChange={(value) => updateValues({ fromDate: value })}
                type="date"
              />
            </HoInterestReportGlProcess_FormField>

            <HoInterestReportGlProcess_FormField
              label={en("hoInterestReportGl.fields.toDate")}
              labelHi={t("hoInterestReportGl.fields.toDate")}
            >
              <HoInterestReportGlProcess_IconInput
                icon={<Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />}
                value={values.toDate}
                onChange={(value) => updateValues({ toDate: value })}
                type="date"
              />
            </HoInterestReportGlProcess_FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-6">
          <button
            type="button"
            onClick={handleValidate}
            className={`${HoInterestReportGlProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleReport}
            className={`${HoInterestReportGlProcess_buttonBase} ${
              isValidated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${HoInterestReportGlProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
        </div>
      </div>
    </div>

    {showAccountList && (
      <ListModal
        title="Select GL Account"
        columns={[
          { key: "code", label: "GL Account Code" },
          { key: "name", label: "Account Name" },
        ]}
        rows={HoInterestReportGlProcess_GL_ACCOUNTS}
        onSelect={handlePickAccount}
        onClose={() => setShowAccountList(false)}
      />
    )}
    </>
  );
}

function HoInterestReportGlProcess_FormField({
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

function HoInterestReportGlProcess_IconInput({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
}: {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "date" | "text";
  readOnly?: boolean;
}) {
  return (
    <div
      className={`relative flex h-11 flex-1 items-center rounded-lg border border-[#7E8796] px-4 text-[15px] text-slate-700 ${
        readOnly ? "bg-slate-100" : "bg-white"
      }`}
    >
      {icon}
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5] ${type === "date" ? "text-transparent caret-transparent" : ""}`}
      />
      {type === "date" && (
        <span className={`pointer-events-none absolute left-[42px] ${formatDateDDMMMYYYY(value) ? "" : "text-[#8B95A5]"}`}>
          {formatDateDDMMMYYYY(value) || placeholder}
        </span>
      )}
    </div>
  );
}


/* ===== from HoInterestReportHoProcess.tsx ===== */
export interface HoInterestReportHoProcess_HoInterestReportHoData {
  fromDate: string;
  toDate: string;
  fromAccountCode: string;
  fromAccountName: string;
  toAccountCode: string;
  toAccountName: string;
}

export interface HoInterestReportHoProcess_HoInterestReportHoProcessProps {
  open: boolean;
  onClose: () => void;
  onReport?: (data: HoInterestReportHoProcess_HoInterestReportHoData) => void;
}

const HoInterestReportHoProcess_INITIAL_VALUES: HoInterestReportHoProcess_HoInterestReportHoData = {
  fromDate: "2026-04-01",
  toDate: "2026-06-01",
  fromAccountCode: "0002",
  fromAccountName: "",
  toAccountCode: "0002",
  toAccountName: "",
};

const HoInterestReportHoProcess_ACCOUNTS = [
  { code: "0002", name: "Main Branch, Bilagi" },
  { code: "0003", name: "City Branch, Kolhapur" },
];

const HoInterestReportHoProcess_buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

function HoInterestReportHoProcess({
  open,
  onClose,
  onReport,
}: HoInterestReportHoProcess_HoInterestReportHoProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<HoInterestReportHoProcess_HoInterestReportHoData>(HoInterestReportHoProcess_INITIAL_VALUES);
  const [isValidated, setIsValidated] = useState(false);
  const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);

  if (!open) return null;

  const updateValues = (patch: Partial<HoInterestReportHoProcess_HoInterestReportHoData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setIsValidated(false);
  };

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleReport = () => {
    if (!isValidated) return;
    onReport?.(values);
  };

  const handlePickAccount = (account: { code: string; name: string }) => {
    if (activePicker === "from") {
      updateValues({ fromAccountCode: account.code, fromAccountName: account.name });
    } else if (activePicker === "to") {
      updateValues({ toAccountCode: account.code, toAccountName: account.name });
    }
    setActivePicker(null);
  };

  const formatDate = formatDateDDMMMYYYY;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                {en("hoInterestReportHo.title")}
                {t("hoInterestReportHo.title") ? (
                  <span className="text-[#64748B]"> / {t("hoInterestReportHo.title")}</span>
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
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <HoInterestReportHoProcess_FormField
              label={en("hoInterestReportHo.fields.fromDate")}
              labelHi={t("hoInterestReportHo.fields.fromDate")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {formatDate(values.fromDate)}
              </div>
            </HoInterestReportHoProcess_FormField>

            <HoInterestReportHoProcess_FormField
              label={en("hoInterestReportHo.fields.toDate")}
              labelHi={t("hoInterestReportHo.fields.toDate")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {formatDate(values.toDate)}
              </div>
            </HoInterestReportHoProcess_FormField>

            <HoInterestReportHoProcess_FormField
              label={en("hoInterestReportHo.fields.fromAccountCode")}
              labelHi={t("hoInterestReportHo.fields.fromAccountCode")}
            >
              <div className="flex gap-2">
                <HoInterestReportHoProcess_TextInput value={values.fromAccountCode} onChange={() => {}} />
                <button
                  type="button"
                  onClick={() => setActivePicker("from")}
                  className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
                >
                  <MoreVertical size={22} strokeWidth={3} />
                </button>
              </div>
            </HoInterestReportHoProcess_FormField>

            <HoInterestReportHoProcess_FormField
              label={en("hoInterestReportHo.fields.accountName")}
              labelHi={t("hoInterestReportHo.fields.accountName")}
            >
              <HoInterestReportHoProcess_TextInput
                value={values.fromAccountName}
                onChange={() => {}}
                placeholder={tRaw("hoInterestReportHo.placeholders.name")}
                readOnly
              />
            </HoInterestReportHoProcess_FormField>

            <HoInterestReportHoProcess_FormField
              label={en("hoInterestReportHo.fields.toAccountCode")}
              labelHi={t("hoInterestReportHo.fields.toAccountCode")}
            >
              <div className="flex gap-2">
                <HoInterestReportHoProcess_TextInput value={values.toAccountCode} onChange={() => {}} />
                <button
                  type="button"
                  onClick={() => setActivePicker("to")}
                  className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
                >
                  <MoreVertical size={22} strokeWidth={3} />
                </button>
              </div>
            </HoInterestReportHoProcess_FormField>

            <HoInterestReportHoProcess_FormField
              label={en("hoInterestReportHo.fields.accountName")}
              labelHi={t("hoInterestReportHo.fields.accountName")}
            >
              <HoInterestReportHoProcess_TextInput
                value={values.toAccountName}
                onChange={() => {}}
                placeholder={tRaw("hoInterestReportHo.placeholders.name")}
                readOnly
              />
            </HoInterestReportHoProcess_FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-6">
          <button
            type="button"
            onClick={handleValidate}
            className={`${HoInterestReportHoProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleReport}
            className={`${HoInterestReportHoProcess_buttonBase} ${
              isValidated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${HoInterestReportHoProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
        </div>
      </div>
    </div>

    {activePicker && (
      <ListModal
        title="Select Account"
        columns={[
          { key: "code", label: "Account Code" },
          { key: "name", label: "Account Name" },
        ]}
        rows={HoInterestReportHoProcess_ACCOUNTS}
        onSelect={handlePickAccount}
        onClose={() => setActivePicker(null)}
      />
    )}
    </>
  );
}

function HoInterestReportHoProcess_FormField({
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

function HoInterestReportHoProcess_TextInput({
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div
      className={`flex h-11 flex-1 items-center rounded-lg border border-[#7E8796] px-4 text-[15px] text-slate-700 ${
        readOnly ? "bg-slate-100" : "bg-white"
      }`}
    >
      <UserRound size={18} className="mr-3 shrink-0 text-[#64748B]" />
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
      />
    </div>
  );
}


/* ===== from InterestNotAppliedProcess.tsx ===== */
export interface InterestNotAppliedProcess_InterestNotAppliedData {
  branchCode: string;
  asOnDate: string;
}

export interface InterestNotAppliedProcess_InterestNotAppliedProcessProps {
  open: boolean;
  onClose: () => void;
  onReport?: (data: InterestNotAppliedProcess_InterestNotAppliedData) => void;
}

const InterestNotAppliedProcess_INITIAL_VALUES: InterestNotAppliedProcess_InterestNotAppliedData = {
  branchCode: "0002",
  asOnDate: "",
};

const InterestNotAppliedProcess_buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

function InterestNotAppliedProcess({
  open,
  onClose,
  onReport,
}: InterestNotAppliedProcess_InterestNotAppliedProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<InterestNotAppliedProcess_InterestNotAppliedData>(InterestNotAppliedProcess_INITIAL_VALUES);
  const [error, setError] = useState<string | undefined>();
  const [isValidated, setIsValidated] = useState(false);

  if (!open) return null;

  const validate = () => {
    const nextError = values.asOnDate ? undefined : en("common.fieldRequired");
    setError(nextError);
    return !nextError;
  };

  const handleValidate = () => {
    if (!validate()) {
      setIsValidated(false);
      return;
    }
    setIsValidated(true);
  };

  const handleReport = () => {
    if (!isValidated) return;
    onReport?.(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                {en("interestNotApplied.title")}
                {t("interestNotApplied.title") ? (
                  <span className="text-[#64748B]"> / {t("interestNotApplied.title")}</span>
                ) : null}
              </h2>
              <p className="mt-1 text-[14px] leading-snug text-[#64748B]">
                {en("interestNotApplied.subtitle")}
                {t("interestNotApplied.subtitle") ? (
                  <span> / {t("interestNotApplied.subtitle")}</span>
                ) : null}
              </p>
            </div>
          </div>
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 space-y-5">
            <InterestNotAppliedProcess_FormField
              label={en("interestNotApplied.fields.branchCode")}
              labelHi={t("interestNotApplied.fields.branchCode")}
            >
              <div className="flex h-11 items-center rounded-lg border border-[#7E8796] bg-slate-100 px-4 text-[15px] text-slate-400">
                <User size={18} className="mr-3 shrink-0 text-[#64748B]" />
                {values.branchCode}
              </div>
            </InterestNotAppliedProcess_FormField>

            <InterestNotAppliedProcess_FormField
              label={en("interestNotApplied.fields.asOnDate")}
              labelHi={t("interestNotApplied.fields.asOnDate")}
              error={error}
            >
              <div className="relative flex h-11 items-center rounded-lg border border-[#7E8796] bg-white px-4 text-[15px] text-slate-700">
                <Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />
                <input
                  type="date"
                  value={values.asOnDate}
                  onChange={(event) => {
                    setValues((prev) => ({ ...prev, asOnDate: event.target.value }));
                    setError(undefined);
                    setIsValidated(false);
                  }}
                  placeholder={tRaw("interestNotApplied.placeholders.enterDate")}
                  className="min-w-0 flex-1 bg-transparent text-transparent caret-transparent outline-none placeholder:text-[#8B95A5]"
                />
                <span className={`pointer-events-none absolute left-[42px] ${formatDateDDMMMYYYY(values.asOnDate) ? "" : "text-[#8B95A5]"}`}>
                  {formatDateDDMMMYYYY(values.asOnDate) || tRaw("interestNotApplied.placeholders.enterDate")}
                </span>
              </div>
            </InterestNotAppliedProcess_FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-6">
          <button
            type="button"
            onClick={handleValidate}
            className={`${InterestNotAppliedProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleReport}
            className={`${InterestNotAppliedProcess_buttonBase} ${
              isValidated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${InterestNotAppliedProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function InterestNotAppliedProcess_FormField({
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


/* ===== from PigmyInterestProvisionProcess.tsx ===== */
export interface PigmyInterestProvisionProcess_PigmyInterestProvisionData {
  fromProductCode: string;
  productDescription: string;
  uptoDate: string;
}

export interface PigmyInterestProvisionProcess_PigmyInterestProvisionProcessProps {
  open: boolean;
  onClose: () => void;
  onCalculate?: (data: PigmyInterestProvisionProcess_PigmyInterestProvisionData) => void;
  onReport?: (data: PigmyInterestProvisionProcess_PigmyInterestProvisionData) => void;
  onApply?: (data: PigmyInterestProvisionProcess_PigmyInterestProvisionData) => void;
}

const PigmyInterestProvisionProcess_INITIAL_VALUES: PigmyInterestProvisionProcess_PigmyInterestProvisionData = {
  fromProductCode: "",
  productDescription: "",
  uptoDate: "",
};

const PigmyInterestProvisionProcess_PRODUCTS = [
  { code: "PIG001", description: "Pigmy Daily Deposit" },
  { code: "PIG002", description: "Pigmy Monthly Scheme" },
];

type PigmyInterestProvisionProcess_RequiredField = "fromProductCode" | "uptoDate";

const PigmyInterestProvisionProcess_buttonBase =
  "flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-md px-3 text-[14px] font-semibold transition";

function PigmyInterestProvisionProcess({
  open,
  onClose,
  onCalculate,
  onReport,
  onApply,
}: PigmyInterestProvisionProcess_PigmyInterestProvisionProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<PigmyInterestProvisionProcess_PigmyInterestProvisionData>(PigmyInterestProvisionProcess_INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<PigmyInterestProvisionProcess_RequiredField, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  if (!open) return null;

  const updateValues = (patch: Partial<PigmyInterestProvisionProcess_PigmyInterestProvisionData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key as PigmyInterestProvisionProcess_RequiredField]);
      return next;
    });
    setIsValidated(false);
    setIsCalculated(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<PigmyInterestProvisionProcess_RequiredField, string>> = {};
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
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4 min-w-0">
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
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 space-y-5">
            <PigmyInterestProvisionProcess_FormField
              label={en("pigmyInterestProvision.fields.fromProductCode")}
              labelHi={t("pigmyInterestProvision.fields.fromProductCode")}
              error={errors.fromProductCode}
            >
              <div className="flex gap-2">
                <PigmyInterestProvisionProcess_DateInput
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
            </PigmyInterestProvisionProcess_FormField>

            <PigmyInterestProvisionProcess_FormField
              label={en("pigmyInterestProvision.fields.productDescription")}
              labelHi={t("pigmyInterestProvision.fields.productDescription")}
            >
              <PigmyInterestProvisionProcess_DateInput
                value={values.productDescription}
                onChange={() => {}}
                placeholder={tRaw("pigmyInterestProvision.placeholders.description")}
                type="text"
                readOnly
              />
            </PigmyInterestProvisionProcess_FormField>

            <PigmyInterestProvisionProcess_FormField
              label={en("pigmyInterestProvision.fields.uptoDate")}
              labelHi={t("pigmyInterestProvision.fields.uptoDate")}
              error={errors.uptoDate}
            >
              <PigmyInterestProvisionProcess_DateInput
                value={values.uptoDate}
                onChange={(value) => updateValues({ uptoDate: value })}
                placeholder={tRaw("pigmyInterestProvision.placeholders.enterDate")}
              />
            </PigmyInterestProvisionProcess_FormField>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleValidate}
            className={`${PigmyInterestProvisionProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className={`${PigmyInterestProvisionProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.calculate")}
            <Calculator size={17} />
          </button>
          <button
            type="button"
            onClick={handleReport}
            className={`${PigmyInterestProvisionProcess_buttonBase} bg-primary-50 text-primary hover:bg-primary-100`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${PigmyInterestProvisionProcess_buttonBase} ${
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
            className={`${PigmyInterestProvisionProcess_buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
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
        rows={PigmyInterestProvisionProcess_PRODUCTS}
        onSelect={handlePickProduct}
        onClose={() => setShowProductList(false)}
      />
    )}
    </>
  );
}

function PigmyInterestProvisionProcess_FormField({
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

function PigmyInterestProvisionProcess_DateInput({
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
      className={`relative flex h-11 flex-1 items-center rounded-lg border border-[#7E8796] px-4 text-[15px] text-slate-700 ${
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
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5] ${type === "date" ? "text-transparent caret-transparent" : ""}`}
      />
      {type === "date" && (
        <span className={`pointer-events-none absolute left-[42px] ${formatDateDDMMMYYYY(value) ? "" : "text-[#8B95A5]"}`}>
          {formatDateDDMMMYYYY(value) || placeholder}
        </span>
      )}
    </div>
  );
}


/* ===== from SiInterestPostingProcess.tsx ===== */
export interface SiInterestPostingProcess_SiInterestPostingData {
  productCode: string;
  uptoDate: string;
}

export interface SiInterestPostingProcess_SiInterestPostingProcessProps {
  open: boolean;
  onClose: () => void;
  onCalculate?: (data: SiInterestPostingProcess_SiInterestPostingData) => void;
  onGenerateReport?: (data: SiInterestPostingProcess_SiInterestPostingData) => void;
  onApply?: (data: SiInterestPostingProcess_SiInterestPostingData) => void;
}

type SiInterestPostingProcess_FieldKey = keyof SiInterestPostingProcess_SiInterestPostingData;

interface SiInterestPostingProcess_FieldConfig {
  key: SiInterestPostingProcess_FieldKey;
  labelKey: string;
  icon: ReactNode;
  type: "date" | "text";
  placeholderKey?: string;
  validate: (value: string) => string;
}

const SiInterestPostingProcess_validateRequired = (value: string) => (value.trim() ? "" : "This field is required");

const SiInterestPostingProcess_validateDate = (value: string) => {
  if (!value) return "This field is required";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Enter a valid date";
  return "";
};

const SiInterestPostingProcess_FIELDS: SiInterestPostingProcess_FieldConfig[] = [
  {
    key: "productCode",
    labelKey: "fields.productCode",
    icon: <Hash size={18} />,
    type: "text",
    validate: SiInterestPostingProcess_validateRequired,
  },
  {
    key: "uptoDate",
    labelKey: "siInterestPosting.fields.uptoDate",
    icon: <Calendar size={18} />,
    type: "date",
    placeholderKey: "siInterestPosting.placeholders.uptoDate",
    validate: SiInterestPostingProcess_validateDate,
  },
];

const SiInterestPostingProcess_buttonBase =
  "flex h-11 items-center justify-center gap-1 rounded-md px-3 text-[12px] font-semibold transition";
const SiInterestPostingProcess_activeOutline = "border border-primary bg-white text-primary hover:bg-primary-50";
const SiInterestPostingProcess_disabledStyle = "cursor-not-allowed bg-slate-100 text-slate-400";

function SiInterestPostingProcess({
  open,
  onClose,
  onCalculate,
  onGenerateReport,
  onApply,
}: SiInterestPostingProcess_SiInterestPostingProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<SiInterestPostingProcess_SiInterestPostingData>({
    productCode: "",
    uptoDate: "",
  });
  const [errors, setErrors] = useState<Partial<Record<SiInterestPostingProcess_FieldKey, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  if (!open) return null;

  const validate = () => {
    const nextErrors: Partial<Record<SiInterestPostingProcess_FieldKey, string>> = {};
    SiInterestPostingProcess_FIELDS.forEach((field) => {
      const error = field.validate(values[field.key]);
      if (error) nextErrors[field.key] = error;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validate()) {
      setIsValidated(false);
      setIsCalculated(false);
      return;
    }
    setIsValidated(true);
  };

  const handleCalculate = () => {
    if (!isValidated) return;
    onCalculate?.(values);
    setIsCalculated(true);
  };

  const handleGenerateReport = () => {
    if (!isValidated) return;
    onGenerateReport?.(values);
  };

  const handleApply = () => {
    if (!isCalculated) return;
    onApply?.(values);
  };

  const handleFieldChange = (field: SiInterestPostingProcess_FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsValidated(false);
    setIsCalculated(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-4 shadow-2xl">
        <div className="rounded-2xl p-3">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
                <UserRound size={22} />
              </div>
              <div className="min-w-0">
                <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                  {en("siInterestPosting.postingParameter")}
                  {t("siInterestPosting.postingParameter") ? (
                    <span className="text-[#64748B]"> / {t("siInterestPosting.postingParameter")}</span>
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
            <ModalCloseButton onClose={onClose} />
          </div>

          <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
            <div className="space-y-5">
              {SiInterestPostingProcess_FIELDS.map((field) => (
                <SiInterestPostingProcess_FormField
                  key={field.key}
                  label={en(field.labelKey)}
                  labelHi={t(field.labelKey)}
                  error={errors[field.key]}
                >
                  <SiInterestPostingProcess_IconInput
                    icon={field.icon}
                    type={field.type}
                    value={values[field.key]}
                    onChange={(value) => handleFieldChange(field.key, value)}
                    placeholder={field.placeholderKey ? tRaw(field.placeholderKey) : undefined}
                  />
                </SiInterestPostingProcess_FormField>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleValidate}
            className={`${SiInterestPostingProcess_buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleCalculate}
            className={`${SiInterestPostingProcess_buttonBase} ${isValidated ? SiInterestPostingProcess_activeOutline : SiInterestPostingProcess_disabledStyle}`}
          >
            {en("common.calculate")}
            <Calculator size={17} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleGenerateReport}
            className={`${SiInterestPostingProcess_buttonBase} ${isValidated ? SiInterestPostingProcess_activeOutline : SiInterestPostingProcess_disabledStyle}`}
          >
            {en("common.report")}
            <FileText size={17} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${SiInterestPostingProcess_buttonBase} min-w-[128px] ${isCalculated ? "bg-primary text-white hover:bg-primary-700 cursor-pointer" : SiInterestPostingProcess_disabledStyle}`}
          >
            {en("common.apply")}
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${SiInterestPostingProcess_buttonBase} ${SiInterestPostingProcess_activeOutline}`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SiInterestPostingProcess_FormField({
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

function SiInterestPostingProcess_IconInput({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date";
}) {
  return (
    <div className="relative flex h-11 items-center rounded-lg border border-[#7E8796] bg-white px-4 text-[15px] text-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <span className="mr-3 shrink-0 text-[#64748B]">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5] ${type === "date" ? "text-transparent caret-transparent" : ""}`}
      />
      {type === "date" && (
        <span className={`pointer-events-none absolute left-[42px] ${formatDateDDMMMYYYY(value) ? "" : "text-[#8B95A5]"}`}>
          {formatDateDDMMMYYYY(value) || placeholder}
        </span>
      )}
    </div>
  );
}


/* ===== from FinancialClosing.tsx ===== */
type ClosingCategory = "parameter" | "calculation" | "reports" | "export";

type FinancialItem = {
    id: string;
    title: string;
    marathiTitle: string;
    icon: string;
    category: ClosingCategory;
    /** Overrides the default "Open" button label, e.g. a pending-record count. */
    actionLabel?: string;
};

const TABS: { id: ClosingCategory; label: string }[] = [
    { id: "parameter", label: "Set Closing Parameter" },
    { id: "calculation", label: "Closing Calculation" },
    { id: "reports", label: "Closing Reports" },
    { id: "export", label: "Export File" },
];

// Reports items that should open the SIMPLE modal (As on Date only, no Branch Code/Generate).
// All other "reports" items default to ReportsParameterBranchModal (Branch Code + As on Date + Generate).
const SIMPLE_REPORT_IDS = new Set<string>(["schedule-income-exp-regular"]);

const ITEMS: FinancialItem[] = [
    {
        id: "set-branch-parameters",
        title: "Set Branch Parameters",
        marathiTitle: "शाखेचे घटक निश्चित करा",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "parameter",
    },
    {
        id: "set-product-status",
        title: "Set Product Status",
        marathiTitle: "उत्पादनाची स्थिती सेट करा",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "parameter",
    },
    {
        id: "tlcc-interest-posting",
        title: "TLCC Insterest Posting",
        marathiTitle: "टीएलसीसी व्याज नोंदणी",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "calculation",
    },
    {
        id: "td-posting-consistency",
        title: "TD Posting Consistency",
        marathiTitle: "टीडी पोस्टिंगमधील सातत्य",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "calculation",
    },
    {
        id: "td-interest-posting",
        title: "TD Insterest Posting",
        marathiTitle: "मुदत ठेवीवरील व्याजाची नोंद",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "calculation",
    },
    {
        id: "npa-generation",
        title: "NPA Generation",
        marathiTitle: "एनपीए निर्मिती",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "calculation",
    },
    {
        id: "npa-modification",
        title: "NPA Modification",
        marathiTitle: "एनपीए सुधारणा",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "calculation",
    },
    {
        id: "depreciation-calculation",
        title: "Depreciation Calculation",
        marathiTitle: "घसारा गणना",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "calculation",
    },
    {
        id: "matured-td-interest-provision",
        title: "Matured TD Interest Provision",
        marathiTitle: "मुदतपूर्ती झालेल्या मुदत ठेवीवरील व्याजाची तरतूद",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "calculation",
    },
    {
        id: "si-interest-posting",
        title: "SI Insterest Posting",
        marathiTitle: "एसआय व्याज नोंदणी",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "calculation",
    },
    {
        id: "interest-not-applied",
        title: "Interest Not Applied",
        marathiTitle: "लागू न केलेले व्याज",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "calculation",
    },
    {
        id: "pigmy-interest-provision",
        title: "Pigmy Interest Provision",
        marathiTitle: "पिग्मी व्याज तरतूद",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "calculation",
    },
    {
        id: "modify-deposit-diary",
        title: "Modify Deposit Diary",
        marathiTitle: "ठेव डायरी सुधारणा",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "export",
    },
    {
        id: "n-form-balancesheet",
        title: "N-Form Balancesheet",
        marathiTitle: "एन-फॉर्म ताळेबंद",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "reports",
    },
    {
        id: "schedule-income-exp-regular",
        title: "Schedule Of Income& Exp(Regular)",
        marathiTitle: "उत्पन्न आणि खर्चाचे वेळापत्रक (नियमित)",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "reports",
    },
    {
        id: "schedule-income-exp-closing",
        title: "Schedule Of Income& Exp(Closing)",
        marathiTitle: "उत्पन्न आणि खर्चाचे वेळापत्रक (क्लोजिंग)",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "reports",
    },
    {
        id: "detail-trial-balance",
        title: "Detail Trial Balance",
        marathiTitle: "तपशीलवार चाचणी ताळेबंद",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "reports",
    },
    {
        id: "ho-interest-report-branch",
        title: "HO Interest Report(On Branch A/c)",
        marathiTitle: "एचओ व्याज अहवाल (शाखा खात्यावर)",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "reports",
    },
    {
        id: "ho-interest-report-ho",
        title: "HO Interest Report (On Ho A/c)",
        marathiTitle: "एचओ व्याज अहवाल (एचओ खात्यावर)",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "reports",
    },
    {
        id: "exceed-cash-limit-report",
        title: "Exceed Cash Limit Report",
        marathiTitle: "रोख मर्यादा ओलांडल्याचा अहवाल",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "reports",
    },
    {
        id: "ho-interest-report-gl",
        title: "HO Interest Report(GL A/c)",
        marathiTitle: "एचओ व्याज अहवाल (जीएल खाते)",
        icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
        category: "reports",
    },
];

const FinancialClosing = () => {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ClosingCategory>("parameter");

    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        const inTab = ITEMS.filter((item) => item.category === activeTab);

        if (!q) return inTab;

        return inTab.filter(
            (item) =>
                item.title.toLowerCase().includes(q) ||
                item.marathiTitle.toLowerCase().includes(q)
        );
    }, [query, activeTab]);

    const activeItem = useMemo(
        () => ITEMS.find((item) => item.id === activeModal) ?? null,
        [activeModal]
    );
    const isReportsItem = activeItem?.category === "reports";
    const isSimpleReport = isReportsItem && SIMPLE_REPORT_IDS.has(activeItem!.id);
    const isNFormBalancesheet = activeModal === "n-form-balancesheet";
    const isDetailTrialBalance = activeModal === "detail-trial-balance";
    const isExceedCashLimitReport = activeModal === "exceed-cash-limit-report";
    const isHoInterestReportBranch = activeModal === "ho-interest-report-branch";
    const isHoInterestReportHo = activeModal === "ho-interest-report-ho";
    const isHoInterestReportGl = activeModal === "ho-interest-report-gl";
    const isBranchReport =
        isReportsItem &&
        !isSimpleReport &&
        !isNFormBalancesheet &&
        !isDetailTrialBalance &&
        !isExceedCashLimitReport &&
        !isHoInterestReportBranch &&
        !isHoInterestReportHo &&
        !isHoInterestReportGl;

    const handleOpen = (id: string) => {
        if (id === "set-product-status") {
            router.push("/misactivity/financialclosing/set-product-status");
        } else {
            setActiveModal(id);
        }
    };

    const handleCloseModal = () => {
        setActiveModal(null);
    };

    return (
        <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
            <GlobalNav
                titleEn="Financial Closing"
                titleHi="आर्थिक समाप्ती"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "MIS Activity", href: "#" },
                    { label: "Financial Closing", href: "#" },
                ]}
                onBack={() => router.back()}
            />

            <div className="w-full bg-white px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
                {/* Hero Banner */}
                <div className="relative isolate overflow-hidden rounded-2xl">
                    <Image
                        src={IMAGES.BACKGROUND_DARK}
                        alt=""
                        fill
                        priority
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/25" />

                    <div className="relative flex flex-col items-center gap-6 px-6 py-12 text-center sm:py-16">
                        <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-[34px]">
                            Financial Closing
                        </h1>

                        <div className="flex w-full max-w-xl items-center rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-lg dark:bg-slate-900">
                            <Search size={18} className="mr-2 shrink-0 text-gray-400" />

                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search financial closing processes..."
                                className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100"
                            />

                            <button
                                type="button"
                                className="ml-2 shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                            >
                                Show
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-5 flex items-center gap-8 border-b border-gray-200 dark:border-slate-800">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`-mb-px whitespace-nowrap border-b-2 pb-2.5 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleOpen(item.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                    handleOpen(item.id);
                            }}
                            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5"
                        >
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
                                <Image
                                    src={item.icon}
                                    alt=""
                                    width={56}
                                    height={56}
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">
                                    {item.title}
                                </h3>

                                <p className="mt-0.5 truncate text-sm text-[#64748B] dark:text-slate-400">
                                    {item.marathiTitle}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpen(item.id);
                                }}
                                className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
                            >
                                {item.actionLabel ?? "Open"}
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    ))}

                    {filteredItems.length === 0 && (
                        <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">
                            No modules found.
                        </p>
                    )}
                </div>
            </div>

            {/* Modals */}
            <InterestPostingProcess
                open={activeModal === "matured-td-interest-provision"}
                onClose={handleCloseModal}
            />
            <TdPostingConsistencyProcess
                open={activeModal === "td-posting-consistency" || activeModal === "td-interest-posting"}
                onClose={handleCloseModal}
            />
            <NpaModificationProcess
                open={activeModal === "npa-modification"}
                onClose={handleCloseModal}
            />
            <NpaGenerationProcess
                open={activeModal === "npa-generation"}
                onClose={handleCloseModal}
            />
            <DepreciationCalculationProcess
                open={activeModal === "depreciation-calculation"}
                onClose={handleCloseModal}
            />
            <SiInterestPostingProcess
                open={activeModal === "si-interest-posting"}
                onClose={handleCloseModal}
            />

            {activeItem && isSimpleReport && (
                <ReportsParameterModal
                    open={isSimpleReport}
                    onClose={handleCloseModal}
                />
            )}

            {activeItem && isBranchReport && (
                <ReportsParameterBranchModal
                    open={isBranchReport}
                    onClose={handleCloseModal}
                />

            )}
            <TlccInterestPostingProcess
                open={activeModal === "tlcc-interest-posting"}
                onClose={handleCloseModal}
            />
            <PigmyInterestProvisionProcess
                open={activeModal === "pigmy-interest-provision"}
                onClose={handleCloseModal}
            />
            <InterestNotAppliedProcess
                open={activeModal === "interest-not-applied"}
                onClose={handleCloseModal}
            />
            <NFormBalancesheetProcess
                open={isNFormBalancesheet}
                onClose={handleCloseModal}
            />
            <DetailTrialBalanceProcess
                open={isDetailTrialBalance}
                onClose={handleCloseModal}
            />
            <ModifyDepositDiaryProcess
                open={activeModal === "modify-deposit-diary"}
                onClose={handleCloseModal}
            />
            <ExceedCashLimitReportProcess
                open={isExceedCashLimitReport}
                onClose={handleCloseModal}
            />
            <HoInterestReportBranchProcess
                open={isHoInterestReportBranch}
                onClose={handleCloseModal}
            />
            <HoInterestReportHoProcess
                open={isHoInterestReportHo}
                onClose={handleCloseModal}
            />
            <HoInterestReportGlProcess
                open={isHoInterestReportGl}
                onClose={handleCloseModal}
            />

            {activeModal === "set-branch-parameters" && (
                <SetBranchParameterModal
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default FinancialClosing;
