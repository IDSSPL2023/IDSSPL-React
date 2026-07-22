import { IMAGES } from "@/assets";
import { useState, type ReactNode } from "react";
import { Building2, Hash, User, FileText, IndianRupee, MoreVertical, X, Check, ChevronDown } from "lucide-react";
import Image from "@/components/ui/Image";
import { useBilingual } from "@/i18n/useBilingual";
import BranchListPickerModal, { type Branch } from "@/components/common/BranchPickListModal";
import ListModal from "@/components/AccountMaster/ListModal";
import SuccessModal from "@/components/shared/SuccessModal";

/* ===== from ModifyBranchGlBalance.tsx ===== */
/* ===================== Mock data ===================== */

interface GlAccountOption {
  code: string;
  name: string;
  openingBalance: string;
  currentBalance: string;
}

const GL_ACCOUNT_OPTIONS: GlAccountOption[] = [
  { code: "GL1001", name: "Cash in Hand", openingBalance: "500000", currentBalance: "486500" },
  { code: "GL1002", name: "Suspense Account", openingBalance: "125000", currentBalance: "131200" },
  { code: "GL1003", name: "Sundry Creditors", openingBalance: "92000", currentBalance: "90750" },
];

/* ===================== Form state ===================== */

interface ModifyBranchGlBalanceData {
  branchCode: string;
  branchName: string;
  glAccountCode: string;
  description: string;
  assignedBy: string;
  reasonOfModification: string;
  openingBalance: string;
  currentBalance: string;
}

const EMPTY_DATA: ModifyBranchGlBalanceData = {
  branchCode: "",
  branchName: "",
  glAccountCode: "",
  description: "",
  assignedBy: "",
  reasonOfModification: "",
  openingBalance: "",
  currentBalance: "",
};

const REQUIRED_FIELDS: (keyof ModifyBranchGlBalanceData)[] = [
  "branchCode",
  "branchName",
  "glAccountCode",
  "description",
  "assignedBy",
  "reasonOfModification",
  "openingBalance",
  "currentBalance",
];

/* ===================== Local, theme-aware field bits ===================== */

function FieldLabel({ labelKey, required = true }: { labelKey: string; required?: boolean }) {
  const { en, t } = useBilingual();
  return (
    <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200">
      {en(labelKey)}
      {t(labelKey) ? <span className="text-gray-500 dark:text-slate-400"> / {t(labelKey)}</span> : null}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

interface FieldBoxProps {
  labelKey: string;
  icon: ReactNode;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  trailing?: ReactNode;
  textRight?: boolean;
}

function FieldBox({
  labelKey,
  icon,
  value,
  onChange,
  placeholder,
  readOnly = false,
  required = true,
  error = false,
  trailing,
  textRight = false,
}: FieldBoxProps) {
  const { tRaw } = useBilingual();
  return (
    <div>
      <FieldLabel labelKey={labelKey} required={required} />
      <div className="flex items-center gap-3">
        <div
          className={`flex flex-1 items-center gap-3 rounded-lg border px-4 py-3 ${
            readOnly ? "bg-gray-100 dark:bg-slate-800" : "bg-white dark:bg-slate-900"
          } ${error ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-slate-700"}`}
        >
          <span className="shrink-0 text-gray-500 dark:text-slate-400">{icon}</span>
          <input
            type="text"
            readOnly={readOnly}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={`w-full min-w-0 bg-transparent outline-none ${textRight ? "text-right" : ""} ${
              readOnly ? "text-gray-600 dark:text-slate-400" : "text-gray-800 dark:text-slate-100"
            } placeholder-gray-400 dark:placeholder-slate-500`}
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
      className="flex h-[46px] w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary transition-colors hover:bg-primary-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
    >
      <MoreVertical size={18} />
    </button>
  );
}

/* ===================== Page ===================== */

const ModifyBranchGlBalance = () => {
  const { en, t, tRaw } = useBilingual();

  const [data, setData] = useState<ModifyBranchGlBalanceData>(EMPTY_DATA);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [branchPickerOpen, setBranchPickerOpen] = useState(false);
  const [glPickerOpen, setGlPickerOpen] = useState(false);

  const clearError = (key: keyof ModifyBranchGlBalanceData) => {
    setErrors((prev) => ({ ...prev, [key]: false }));
    setIsValidated(false);
  };

  const set =
    (key: keyof ModifyBranchGlBalanceData) =>
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
      currentBalance: gl.currentBalance,
    }));
    clearError("glAccountCode");
    clearError("description");
    clearError("openingBalance");
    clearError("currentBalance");
    setGlPickerOpen(false);
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
        title={en("modifyBranchGlBalance.successTitle")}
        subtitle=""
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
      />
    );
  }

  return (
    <div className="min-h-screen app-page-bg px-3 py-4 dark:bg-slate-950">
    <div className="relative mx-auto w-full max-w-5xl rounded-2xl bg-white p-8 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-5 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Image
            src={IMAGES.PERSON_ICON}
            alt={en("modifyBranchGlBalance.title")}
            width={40}
            height={40}
            className="h-11 w-11 object-contain"
          />
          <h2 className="text-[26px] font-bold text-black dark:text-slate-100">
            {en("modifyBranchGlBalance.title")}
            {t("modifyBranchGlBalance.title") ? (
              <span className="font-semibold text-gray-500 dark:text-slate-400"> / {t("modifyBranchGlBalance.title")}</span>
            ) : null}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => window.history.back()}
          aria-label={en("common.cancel")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Fields card */}
      <div className="mb-8 rounded-2xl border-x border-b border-t-4 border-primary p-6 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <FieldBox
            labelKey="fields.branchCode"
            icon={<Building2 size={18} />}
            value={data.branchCode}
            onChange={set("branchCode")}
            error={!!errors.branchCode}
            placeholder={tRaw("fields.branchCode")}
            trailing={<PickerButton onClick={() => setBranchPickerOpen(true)} />}
          />

          <FieldBox
            labelKey="fields.branchName"
            icon={<Building2 size={18} />}
            value={data.branchName}
            readOnly
            error={!!errors.branchName}
            placeholder={tRaw("fields.branchName")}
          />

          <FieldBox
            labelKey="fields.glAccountCode"
            icon={<Hash size={18} />}
            value={data.glAccountCode}
            onChange={set("glAccountCode")}
            error={!!errors.glAccountCode}
            placeholder={tRaw("fields.glAccountCode")}
            trailing={<PickerButton onClick={() => setGlPickerOpen(true)} />}
          />

          <FieldBox
            labelKey="fields.description"
            icon={<FileText size={18} />}
            value={data.description}
            readOnly
            error={!!errors.description}
            placeholder={tRaw("fields.description")}
          />

          <FieldBox
            labelKey="fields.assignedBy"
            icon={<User size={18} />}
            value={data.assignedBy}
            onChange={set("assignedBy")}
            error={!!errors.assignedBy}
            placeholder={tRaw("fields.assignedBy")}
          />

          <FieldBox
            labelKey="fields.reasonOfModification"
            icon={<FileText size={18} />}
            value={data.reasonOfModification}
            onChange={set("reasonOfModification")}
            error={!!errors.reasonOfModification}
            placeholder={tRaw("fields.reasonOfModification")}
          />

          <FieldBox
            labelKey="fields.openingBalance"
            icon={<IndianRupee size={18} />}
            value={data.openingBalance}
            onChange={set("openingBalance")}
            error={!!errors.openingBalance}
            placeholder="0.00"
            textRight
          />

          <FieldBox
            labelKey="fields.currentBalance"
            icon={<IndianRupee size={18} />}
            value={data.currentBalance}
            onChange={set("currentBalance")}
            error={!!errors.currentBalance}
            placeholder="0.00"
            textRight
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleValidate}
          disabled={isValidated}
          className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {en("common.validate")} <Check className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 rounded-lg border border-primary px-8 py-3 font-semibold text-primary transition-colors hover:bg-primary-50 dark:hover:bg-blue-900/20"
        >
          {en("common.cancel")} <X className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleModify}
          disabled={!isValidated}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-8 py-3 font-semibold text-gray-400 transition-colors enabled:bg-primary-100 enabled:text-primary enabled:hover:bg-primary-200 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-500 dark:enabled:bg-blue-900/30 dark:enabled:text-blue-400"
        >
          {en("common.modify")} <ChevronDown className="h-4 w-4" />
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
    </div>
  );
};

export default ModifyBranchGlBalance;
