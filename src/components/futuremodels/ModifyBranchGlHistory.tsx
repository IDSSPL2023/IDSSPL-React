import { useState, type ReactNode } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  FileText,
  Hash,
  MoreVertical,
  UserSquare,
  X,
} from "lucide-react";
import Image from "@/components/ui/Image";
import { useBilingual } from "@/i18n/useBilingual";
import BranchListPickerModal, { type Branch } from "../common/BranchPickListModal";
import ListModal from "../AccountMaster/ListModal";
import SuccessModal from "../shared/SuccessModal";

interface GlAccountOption {
  code: string;
  name: string;
  openingBalance: string;
}

const GL_ACCOUNT_OPTIONS: GlAccountOption[] = [
  { code: "GL1001", name: "Cash in Hand", openingBalance: "500000" },
  { code: "GL1002", name: "Suspense Account", openingBalance: "125000" },
  { code: "GL1003", name: "Sundry Creditors", openingBalance: "92000" },
];

interface ModifyBranchGlHistoryData {
  branchCode: string;
  branchName: string;
  tnxDate: string;
  assignedBy: string;
  glAccountCode: string;
  description: string;
  reasonOfModification: string;
  openingBalance: string;
  debitCash: string;
  creditCash: string;
  debitTransfer: string;
  creditTransfer: string;
  debitClearing: string;
  creditClearing: string;
  debitCashVouchers: string;
  creditCashVouchers: string;
  debitTransferVouchers: string;
  creditTransferVouchers: string;
  debitClVouchers: string;
  creditClVouchers: string;
}

const EMPTY_DATA: ModifyBranchGlHistoryData = {
  branchCode: "",
  branchName: "",
  tnxDate: "",
  assignedBy: "",
  glAccountCode: "",
  description: "",
  reasonOfModification: "",
  openingBalance: "",
  debitCash: "",
  creditCash: "",
  debitTransfer: "",
  creditTransfer: "",
  debitClearing: "",
  creditClearing: "",
  debitCashVouchers: "",
  creditCashVouchers: "",
  debitTransferVouchers: "",
  creditTransferVouchers: "",
  debitClVouchers: "",
  creditClVouchers: "",
};

const REQUIRED_FIELDS = Object.keys(EMPTY_DATA) as (keyof ModifyBranchGlHistoryData)[];

const FORM_FIELDS: {
  key: keyof ModifyBranchGlHistoryData;
  labelKey: string;
  icon: "user" | "hash" | "file" | "calendar";
  readOnly?: boolean;
  picker?: "branch" | "gl";
  placeholderKey?: string;
}[] = [
  { key: "branchCode", labelKey: "fields.branchCode", icon: "user", picker: "branch" },
  { key: "branchName", labelKey: "fields.branchName", icon: "hash", readOnly: true, placeholderKey: "modifyBranchGlHistory.namePlaceholder" },
  { key: "tnxDate", labelKey: "fields.tnxDate", icon: "user" },
  { key: "assignedBy", labelKey: "fields.assignedBy", icon: "user" },
  { key: "glAccountCode", labelKey: "fields.glAccountCode", icon: "user", picker: "gl" },
  { key: "description", labelKey: "fields.description", icon: "user", readOnly: true },
  { key: "reasonOfModification", labelKey: "fields.reasonOfModification", icon: "user" },
  { key: "openingBalance", labelKey: "fields.openingBalance", icon: "user" },
  { key: "debitCash", labelKey: "fields.debitCash", icon: "user" },
  { key: "creditCash", labelKey: "fields.creditCash", icon: "user" },
  { key: "debitTransfer", labelKey: "fields.debitTransfer", icon: "user" },
  { key: "creditTransfer", labelKey: "fields.creditTransfer", icon: "user" },
  { key: "debitClearing", labelKey: "fields.debitClearing", icon: "user" },
  { key: "creditClearing", labelKey: "fields.creditClearing", icon: "user" },
  { key: "debitCashVouchers", labelKey: "fields.debitCashVouchers", icon: "user" },
  { key: "creditCashVouchers", labelKey: "fields.creditCashVouchers", icon: "user" },
  { key: "debitTransferVouchers", labelKey: "fields.debitTransferVouchers", icon: "user" },
  { key: "creditTransferVouchers", labelKey: "fields.creditTransferVouchers", icon: "user" },
  { key: "debitClVouchers", labelKey: "fields.debitClVouchers", icon: "user" },
  { key: "creditClVouchers", labelKey: "fields.creditClVouchers", icon: "user" },
];

const ICONS = {
  user: <UserSquare size={20} />,
  hash: <Hash size={20} />,
  file: <FileText size={20} />,
  calendar: <CalendarDays size={20} />,
};

function FieldLabel({ labelKey }: { labelKey: string }) {
  const { en, t } = useBilingual();
  return (
    <label className="mb-2 block text-[17px] font-semibold leading-6 text-slate-800 dark:text-slate-100">
      {en(labelKey)}
      {t(labelKey) ? <span className="font-medium text-slate-500 dark:text-slate-400"> / {t(labelKey)}</span> : null}
      <span className="ml-0.5 text-red-500">*</span>
    </label>
  );
}

interface FieldBoxProps {
  labelKey: string;
  icon: ReactNode;
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
  error?: boolean;
  trailing?: ReactNode;
}

function FieldBox({
  labelKey,
  icon,
  value,
  onChange,
  placeholder,
  readOnly = false,
  error = false,
  trailing,
}: FieldBoxProps) {
  const { tRaw } = useBilingual();

  return (
    <div className="min-w-0">
      <FieldLabel labelKey={labelKey} />
      <div className="flex items-center gap-3">
        <div
          className={`flex h-[54px] min-w-0 flex-1 items-center rounded-xl border px-4 ${
            readOnly ? "bg-gray-100 dark:bg-slate-800" : "bg-white dark:bg-slate-900"
          } ${error ? "border-red-400" : "border-slate-400 dark:border-slate-700"}`}
        >
          <span className="shrink-0 text-slate-500 dark:text-slate-400">{icon}</span>
          <input
            type="text"
            readOnly={readOnly}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="ml-3 w-full min-w-0 bg-transparent text-[16px] text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        {trailing}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{tRaw("common.fieldRequired")}</p>}
    </div>
  );
}

function PickerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[54px] w-[70px] shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition hover:bg-primary-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
    >
      <MoreVertical size={26} strokeWidth={3} />
    </button>
  );
}

const ModifyBranchGlHistory = () => {
  const { en, t, tRaw } = useBilingual();
  const [data, setData] = useState<ModifyBranchGlHistoryData>(EMPTY_DATA);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [branchPickerOpen, setBranchPickerOpen] = useState(false);
  const [glPickerOpen, setGlPickerOpen] = useState(false);

  const clearError = (key: keyof ModifyBranchGlHistoryData) => {
    setErrors((prev) => ({ ...prev, [key]: false }));
    setIsValidated(false);
  };

  const set =
    (key: keyof ModifyBranchGlHistoryData) =>
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

  const handleGlSelect = (gl: GlAccountOption) => {
    setData((prev) => ({
      ...prev,
      glAccountCode: gl.code,
      description: gl.name,
      openingBalance: gl.openingBalance,
    }));
    clearError("glAccountCode");
    clearError("description");
    clearError("openingBalance");
    setGlPickerOpen(false);
  };

  const validate = () => {
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
    handleCancel();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title={en("modifyBranchGlHistory.successTitle")}
        subtitle=""
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-[28px] bg-white p-3 shadow-sm dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/person icon.png"
            alt={en("modifyBranchGlHistory.title")}
            width={54}
            height={54}
            className="h-[50px] w-[50px] shrink-0 object-contain"
          />
          <h1 className="min-w-0 text-[16px] font-bold leading-tight text-[#070747] dark:text-slate-100">
            {en("modifyBranchGlHistory.title")}
            {t("modifyBranchGlHistory.title") ? (
              <span className="font-semibold text-slate-500 dark:text-slate-400"> / {t("modifyBranchGlHistory.title")}</span>
            ) : null}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => window.history.back()}
          aria-label={en("common.cancel")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-slate-400 text-slate-500 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <X size={28} strokeWidth={3} />
        </button>
      </div>

      <div className="rounded-[18px] border-x border-b border-t-4 border-primary p-7 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-x-8 gap-y-7 lg:grid-cols-3">
          {FORM_FIELDS.map((field) => (
            <FieldBox
              key={field.key}
              labelKey={field.labelKey}
              icon={ICONS[field.icon]}
              value={data[field.key]}
              onChange={field.readOnly ? undefined : set(field.key)}
              readOnly={field.readOnly}
              error={!!errors[field.key]}
              placeholder={field.placeholderKey ? tRaw(field.placeholderKey) : tRaw("modifyBranchGlHistory.amountPlaceholder")}
              trailing={
                field.picker === "branch" ? (
                  <PickerButton onClick={() => setBranchPickerOpen(true)} />
                ) : field.picker === "gl" ? (
                  <PickerButton onClick={() => setGlPickerOpen(true)} />
                ) : null
              }
            />
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap justify-end gap-7">
        <button
          type="button"
          onClick={handleValidate}
          disabled={isValidated}
          className="flex h-14 min-w-[160px] items-center justify-center gap-3 rounded-lg bg-primary px-8 text-lg font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {en("common.validate")} <Check size={22} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-14 min-w-[160px] items-center justify-center gap-3 rounded-lg border-2 border-primary bg-white px-8 text-lg font-semibold text-primary transition hover:bg-primary-50 dark:bg-slate-900 dark:hover:bg-blue-900/20"
        >
          {en("common.cancel")} <X size={24} />
        </button>
        <button
          type="button"
          onClick={handleModify}
          disabled={!isValidated}
          className="flex h-14 min-w-[160px] items-center justify-center gap-3 rounded-lg bg-gray-100 px-8 text-lg font-semibold text-gray-400 transition enabled:bg-primary-100 enabled:text-primary enabled:hover:bg-primary-200 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-500 dark:enabled:bg-blue-900/30 dark:enabled:text-blue-400"
        >
          {en("common.modify")} <ChevronDown size={20} />
        </button>
      </div>

      {branchPickerOpen && (
        <BranchListPickerModal open={branchPickerOpen} onClose={() => setBranchPickerOpen(false)} onSelect={handleBranchSelect} />
      )}

      {glPickerOpen && (
        <ListModal
          title={en("fields.glAccountCode")}
          columns={[
            { key: "code", label: en("fields.glAccountCode") },
            { key: "name", label: en("fields.description") },
          ]}
          rows={GL_ACCOUNT_OPTIONS}
          onClose={() => setGlPickerOpen(false)}
          onSelect={handleGlSelect}
        />
      )}
    </div>
  );
};

export default ModifyBranchGlHistory;
