import { IMAGES } from "@/assets";
import { useState } from "react";
import type { ReactNode } from "react";
import { Check, ChevronDown, MoreVertical, UserRound, X, Building2, Hash, User, FileText, IndianRupee } from "lucide-react";
import Image from "@/components/ui/Image";
import { useBilingual } from "@/i18n/useBilingual";
import BranchListPickerModal, { type Branch } from "@/components/common/BranchPickListModal";
import ListModal from "@/components/AccountMaster/ListModal";
import SuccessModal from "@/components/shared/SuccessModal";

/* ===== from FutureModelForm.tsx ===== */
export function FutureModelForm_BilingualText({
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

export function FutureModelForm_FuturePageHeader({
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
          src={IMAGES.PERSON_ICON}
          alt={en(titleKey)}
          width={iconSize}
          height={iconSize}
          className="shrink-0 object-contain"
          style={{ width: iconSize, height: iconSize }}
        />
        <h1 className={`min-w-0 font-bold leading-tight text-[#070747] dark:text-slate-100 ${titleClassName}`}>
          <FutureModelForm_BilingualText
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

export function FutureModelForm_FieldLabel({
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
      <FutureModelForm_BilingualText labelKey={labelKey} />
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

export function FutureModelForm_FutureField({
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
      <FutureModelForm_FieldLabel labelKey={labelKey} required={required} className={labelClassName} />
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

export function FutureModelForm_LookupPickerButton({
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

export function FutureModelForm_FutureSectionHeader({ titleKey, subtitleKey }: { titleKey: string; subtitleKey: string }) {
  return (
    <div className="mb-7 border-b border-slate-200 pb-6 dark:border-slate-700">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary-50 text-primary shadow-sm dark:bg-blue-900/30">
          <UserRound size={25} />
        </div>
        <div className="min-w-0">
          <h2 className="text-[23px] font-bold leading-7 text-[#202052] dark:text-slate-100">
            <FutureModelForm_BilingualText
              labelKey={titleKey}
              secondaryClassName="font-semibold text-slate-500 dark:text-slate-400"
            />
          </h2>
          <p className="mt-1 text-[15px] font-medium leading-6 text-slate-500 dark:text-slate-400">
            <FutureModelForm_BilingualText labelKey={subtitleKey} />
          </p>
        </div>
      </div>
    </div>
  );
}

export function FutureModelForm_FutureFormActions({
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


/* ===== from ModifyAccountBalancePage.tsx ===== */
/* ===================== Mock data ===================== */

interface AccountOption {
  code: string;
  name: string;
  ledgerBalance: string;
  availableBalance: string;
}

const ACCOUNT_OPTIONS: AccountOption[] = [
  { code: "AC101", name: "Savings - Ramesh Kulkarni", ledgerBalance: "24500", availableBalance: "24000" },
  { code: "AC102", name: "Savings - Sunita Patil", ledgerBalance: "18200", availableBalance: "18200" },
  { code: "AC103", name: "Savings - Vikram Joshi", ledgerBalance: "9800", availableBalance: "9500" },
];

/* ===================== Form state ===================== */

interface ModifyAccountBalanceData {
  branchCode: string;
  branchName: string;
  accountCode: string;
  accountName: string;
  assignedBy: string;
  reasonOfModification: string;
  ledgerBalance: string;
  availableBalance: string;
  newLedgerBalance: string;
  monthMinimumBalance: string;
}

const EMPTY_DATA: ModifyAccountBalanceData = {
  branchCode: "",
  branchName: "",
  accountCode: "",
  accountName: "",
  assignedBy: "",
  reasonOfModification: "",
  ledgerBalance: "",
  availableBalance: "",
  newLedgerBalance: "",
  monthMinimumBalance: "",
};

const REQUIRED_FIELDS: (keyof ModifyAccountBalanceData)[] = [
  "branchCode",
  "branchName",
  "accountCode",
  "accountName",
  "assignedBy",
  "reasonOfModification",
  "ledgerBalance",
  "availableBalance",
  "newLedgerBalance",
  "monthMinimumBalance",
];

/* ===================== Page ===================== */

const ModifyAccountBalancePage = () => {
  const { en, tRaw } = useBilingual();

  const [data, setData] = useState<ModifyAccountBalanceData>(EMPTY_DATA);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [branchPickerOpen, setBranchPickerOpen] = useState(false);
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);

  const clearError = (key: keyof ModifyAccountBalanceData) => {
    setErrors((prev) => ({ ...prev, [key]: false }));
    setIsValidated(false);
  };

  const set =
    (key: keyof ModifyAccountBalanceData) =>
    (value: string) => {
      setData((prev) => ({ ...prev, [key]: value }));
      clearError(key);
    };

  const handleBranchSelect = (branch: Branch) => {
    setData((prev) => ({ ...prev, branchCode: branch.code, branchName: branch.name }));
    clearError("branchCode");
    clearError("branchName");
    setBranchPickerOpen(false);
  };

  const handleAccountSelect = (account: AccountOption) => {
    setData((prev) => ({
      ...prev,
      accountCode: account.code,
      accountName: account.name,
      ledgerBalance: account.ledgerBalance,
      availableBalance: account.availableBalance,
    }));
    clearError("accountCode");
    clearError("accountName");
    clearError("ledgerBalance");
    clearError("availableBalance");
    setAccountPickerOpen(false);
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, boolean> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!data[key].trim()) nextErrors[key] = true;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => setIsValidated(validate());

  const handleCancel = () => {
    setData(EMPTY_DATA);
    setErrors({});
    setIsValidated(false);
  };

  const handleModify = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    setData(EMPTY_DATA);
    setErrors({});
    setIsValidated(false);
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title={en("modifyAccountBalance.successTitle")}
        subtitle=""
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
      />
    );
  }

  return (
    <div className="min-h-screen app-page-bg px-3 py-4 dark:bg-slate-950">
    <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 dark:bg-slate-900">
      <FutureModelForm_FuturePageHeader
        titleKey="modifyAccountBalance.title"
        onClose={() => window.history.back()}
        titleClassName="text-[24px]"
        iconSize={40}
      />

      {/* Fields card */}
      <div className="mb-8 rounded-2xl border-x border-b border-t-4 border-primary p-6 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <FutureModelForm_FutureField
            labelKey="fields.branchCode"
            icon={<Building2 size={16} />}
            value={data.branchCode}
            readOnly
            error={!!errors.branchCode}
            placeholder={tRaw("fields.branchCode")}
            trailing={<FutureModelForm_LookupPickerButton onClick={() => setBranchPickerOpen(true)} className="h-8 w-8 rounded-md" iconSize={14} />}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureModelForm_FutureField
            labelKey="fields.branchName"
            icon={<Building2 size={16} />}
            value={data.branchName}
            readOnly
            error={!!errors.branchName}
            placeholder={tRaw("fields.branchName")}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureModelForm_FutureField
            labelKey="fields.accountCode"
            icon={<Hash size={16} />}
            value={data.accountCode}
            readOnly
            error={!!errors.accountCode}
            placeholder={tRaw("fields.accountCode")}
            trailing={<FutureModelForm_LookupPickerButton onClick={() => setAccountPickerOpen(true)} className="h-8 w-8 rounded-md" iconSize={14} />}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureModelForm_FutureField
            labelKey="fields.accountName"
            icon={<User size={16} />}
            value={data.accountName}
            readOnly
            error={!!errors.accountName}
            placeholder={tRaw("fields.accountName")}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureModelForm_FutureField
            labelKey="fields.assignedBy"
            icon={<User size={16} />}
            value={data.assignedBy}
            onChange={set("assignedBy")}
            error={!!errors.assignedBy}
            placeholder={tRaw("fields.assignedBy")}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureModelForm_FutureField
            labelKey="fields.reasonOfModification"
            icon={<FileText size={16} />}
            value={data.reasonOfModification}
            onChange={set("reasonOfModification")}
            error={!!errors.reasonOfModification}
            placeholder={tRaw("fields.reasonOfModification")}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureModelForm_FutureField
            labelKey="fields.ledgerBalance"
            icon={<IndianRupee size={16} />}
            value={data.ledgerBalance}
            readOnly
            error={!!errors.ledgerBalance}
            placeholder="0.00"
            textRight
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureModelForm_FutureField
            labelKey="fields.availableBalance"
            icon={<IndianRupee size={16} />}
            value={data.availableBalance}
            readOnly
            error={!!errors.availableBalance}
            placeholder="0.00"
            textRight
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureModelForm_FutureField
            labelKey="fields.newLedgerBalance"
            icon={<IndianRupee size={16} />}
            value={data.newLedgerBalance}
            onChange={set("newLedgerBalance")}
            error={!!errors.newLedgerBalance}
            placeholder="0.00"
            textRight
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureModelForm_FutureField
            labelKey="fields.monthMinimumBalance"
            icon={<IndianRupee size={16} />}
            value={data.monthMinimumBalance}
            onChange={set("monthMinimumBalance")}
            error={!!errors.monthMinimumBalance}
            placeholder="0.00"
            textRight
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />
        </div>
      </div>

      <FutureModelForm_FutureFormActions
        onValidate={handleValidate}
        onCancel={handleCancel}
        onModify={handleModify}
        isValidated={isValidated}
        align="center"
      />

      {branchPickerOpen && (
        <BranchListPickerModal open={branchPickerOpen} onClose={() => setBranchPickerOpen(false)} onSelect={handleBranchSelect} />
      )}

      {accountPickerOpen && (
        <ListModal
          title={en("fields.accountCode")}
          columns={[
            { key: "code", label: en("fields.accountCode") },
            { key: "name", label: en("fields.accountName") },
          ]}
          rows={ACCOUNT_OPTIONS}
          onClose={() => setAccountPickerOpen(false)}
          onSelect={handleAccountSelect}
        />
      )}
    </div>
    </div>
  );
};

export default ModifyAccountBalancePage;
