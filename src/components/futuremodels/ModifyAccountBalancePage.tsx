import { useState } from "react";
import {
  Building2,
  Hash,
  User,
  FileText,
  IndianRupee,
} from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import BranchListPickerModal, { type Branch } from "../common/BranchPickListModal";
import ListModal from "../AccountMaster/ListModal";
import SuccessModal from "../shared/SuccessModal";
import {
  FutureField,
  FutureFormActions,
  FuturePageHeader,
  LookupPickerButton,
} from "../shared/FutureModelForm";

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
    <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 dark:bg-slate-900">
      <FuturePageHeader
        titleKey="modifyAccountBalance.title"
        onClose={() => window.history.back()}
        titleClassName="text-[24px]"
        iconSize={40}
      />

      {/* Fields card */}
      <div className="mb-8 rounded-2xl border-x border-b border-t-4 border-primary p-6 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <FutureField
            labelKey="fields.branchCode"
            icon={<Building2 size={16} />}
            value={data.branchCode}
            readOnly
            error={!!errors.branchCode}
            placeholder={tRaw("fields.branchCode")}
            trailing={<LookupPickerButton onClick={() => setBranchPickerOpen(true)} className="h-8 w-8 rounded-md" iconSize={14} />}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureField
            labelKey="fields.branchName"
            icon={<Building2 size={16} />}
            value={data.branchName}
            readOnly
            error={!!errors.branchName}
            placeholder={tRaw("fields.branchName")}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureField
            labelKey="fields.accountCode"
            icon={<Hash size={16} />}
            value={data.accountCode}
            readOnly
            error={!!errors.accountCode}
            placeholder={tRaw("fields.accountCode")}
            trailing={<LookupPickerButton onClick={() => setAccountPickerOpen(true)} className="h-8 w-8 rounded-md" iconSize={14} />}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureField
            labelKey="fields.accountName"
            icon={<User size={16} />}
            value={data.accountName}
            readOnly
            error={!!errors.accountName}
            placeholder={tRaw("fields.accountName")}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureField
            labelKey="fields.assignedBy"
            icon={<User size={16} />}
            value={data.assignedBy}
            onChange={set("assignedBy")}
            error={!!errors.assignedBy}
            placeholder={tRaw("fields.assignedBy")}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureField
            labelKey="fields.reasonOfModification"
            icon={<FileText size={16} />}
            value={data.reasonOfModification}
            onChange={set("reasonOfModification")}
            error={!!errors.reasonOfModification}
            placeholder={tRaw("fields.reasonOfModification")}
            fieldHeightClass="h-12"
            labelClassName="mb-2 block text-sm font-medium text-gray-800 dark:text-slate-200"
          />

          <FutureField
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

          <FutureField
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

          <FutureField
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

          <FutureField
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

      <FutureFormActions
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
  );
};

export default ModifyAccountBalancePage;
