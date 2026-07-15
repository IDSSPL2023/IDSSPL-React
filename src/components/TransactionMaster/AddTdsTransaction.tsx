import { useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  CreditCard,
  IndianRupee,
  Hash,
  IdCard,
  FileCheck,
  ListFilter,
  MoreVertical,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  SelectInput,
  DateInput,
  SectionCard,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";

const SELECT_TYPE_OPTIONS = ["Paid", "Payable"];

type AccountPickRow = { code: string; name: string };

/** Same pick-list shape as Transaction Master's account lookup (Account Code + Name). */
const ACCOUNT_PICK_LIST: AccountPickRow[] = [
  { code: "502", name: "DEVARADDI MALLANAGOUD" },
  { code: "503", name: "AKSHAY OM MORE" },
  { code: "504", name: "PRIYA SHARMA" },
];

type PickerField = "accountCode";

export interface TdsTransactionFormData {
  selectType: string;
  tdsDate: string;
  accountCode: string;
  accountName: string;
  customerId: string;
  panCardNumber: string;
  form15H: string;
  form15G: string;
  interestAmount: string;
  transactionAmount: string;
}

/** Reusable dummy data — used to prefill the form on open (backend not ready). */
export const DEFAULT_TDS_TRANSACTION_DATA: TdsTransactionFormData = {
  selectType: "Paid",
  tdsDate: "2026-05-20",
  accountCode: "502",
  accountName: "DEVARADDI MALLANAGOUD",
  customerId: "CUS00025",
  panCardNumber: "ABCDE1234F",
  form15H: "Submitted",
  form15G: "Not Applicable",
  interestAmount: "25000",
  transactionAmount: "250000",
};

const TEXT_FIELD_KEYS: (keyof TdsTransactionFormData)[] = [
  "selectType",
  "tdsDate",
  "accountCode",
  "accountName",
  "customerId",
  "panCardNumber",
  "form15H",
  "form15G",
  "interestAmount",
  "transactionAmount",
];

/** Same validation approach used by Transaction Master's sibling forms (TL Disbursement, RTGS). */
const validateTdsTransaction = (
  data: TdsTransactionFormData
): Record<keyof TdsTransactionFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof TdsTransactionFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  return errors;
};

/** Simulated save — no backend yet. */
const saveTdsTransaction = (data: TdsTransactionFormData) =>
  new Promise<TdsTransactionFormData>((resolve) => setTimeout(() => resolve(data), 600));

const LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const NoteMessage = () => (
  <div className="mb-4 flex flex-col gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
    <div className="flex shrink-0 items-center gap-2">
      <AlertCircle size={18} className="text-primary" />
      <h4 className="text-sm font-semibold text-[#1F2858]">Note Message</h4>
    </div>
    <div className="flex flex-col gap-1 text-xs text-slate-600 sm:flex-row sm:flex-wrap sm:gap-x-8">
      <span>1. Vouchers will be created using the current date for Paid transactions.</span>
      <span>2. Vouchers will be created using the TDS date for Payable transactions.</span>
    </div>
  </div>
);

export interface AddTdsTransactionProps {
  onClose: () => void;
  onSave?: (data: TdsTransactionFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddTdsTransaction = ({ onClose, onSave, variant = "modal" }: AddTdsTransactionProps) => {
  const [form, setForm] = useState<TdsTransactionFormData>(DEFAULT_TDS_TRANSACTION_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TdsTransactionFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const markDirty = (field: keyof TdsTransactionFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof TdsTransactionFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const openPicker = (field: PickerField) => setActivePicker(field);

  const handlePickAccount = (row: AccountPickRow) => {
    markDirty("accountCode");
    markDirty("accountName");
    setForm((f) => ({ ...f, accountCode: row.code, accountName: row.name }));
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors = validateTdsTransaction(form);
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    setIsValidated(!hasErrors);
    if (hasErrors) {
      toast.error("Please fill all required fields before validating.");
    } else {
      toast.success("All fields validated successfully.");
    }
  };

  const handleSave = async () => {
    if (!isValidated || isSaving) return;
    setIsSaving(true);
    await saveTdsTransaction(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_TDS_TRANSACTION_DATA);
    setErrors({});
    setIsValidated(false);
    onClose();
  };

  const handleSuccessDone = () => {
    onSave?.(form);
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        title="TDS Transaction Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="TDS Transaction"
      titleHi="टीडीएस व्यवहार"
      subtitleEn="Fill in the TDS transaction details below."
      subtitleHi="खालील टीडीएस व्यवहाराचा तपशील भरा."
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
    >
      <NoteMessage />

      <SectionCard
        titleEn="Account Details"
        titleHi="खाते तपशील"
        subtitleEn="Search and verify the account before processing the TDS transaction."
        subtitleHi="टीडीएस व्यवहार करण्यापूर्वी खात्याची माहिती तपासा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Select" labelHi="निवडा" required error={errors.selectType}>
            <SelectInput
              icon={<ListFilter size={16} />}
              value={form.selectType}
              onChange={(v) => updateField("selectType", v)}
              options={SELECT_TYPE_OPTIONS}
              placeholder="Select"
              error={errors.selectType}
            />
          </FieldShell>

          <FieldShell label="TDS Date" labelHi="टीडीएस दिनांक" required error={errors.tdsDate}>
            <DateInput value={form.tdsDate} onChange={(v) => updateField("tdsDate", v)} error={errors.tdsDate} />
          </FieldShell>

          <FieldShell label="Account Code" labelHi="खाते कोड" required error={errors.accountCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.accountCode}
                  onChange={(v) => updateField("accountCode", v)}
                  placeholder="Enter Account Code"
                  error={errors.accountCode}
                />
              </div>
              <LookupTrigger onClick={() => openPicker("accountCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Account Name" labelHi="खात्याचे नाव" required error={errors.accountName}>
            <TextInput icon={<User size={16} />} value={form.accountName} onChange={() => {}} readOnly error={errors.accountName} />
          </FieldShell>

          <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={errors.customerId}>
            <TextInput icon={<Hash size={16} />} value={form.customerId} onChange={() => {}} readOnly error={errors.customerId} />
          </FieldShell>

          <FieldShell label="PAN Card Number" labelHi="पॅन कार्ड क्रमांक" required error={errors.panCardNumber}>
            <TextInput icon={<IdCard size={16} />} value={form.panCardNumber} onChange={() => {}} readOnly error={errors.panCardNumber} />
          </FieldShell>

          <FieldShell label="Form 15 H" labelHi="फॉर्म १५ एच" required error={errors.form15H}>
            <TextInput icon={<FileCheck size={16} />} value={form.form15H} onChange={() => {}} readOnly error={errors.form15H} />
          </FieldShell>

          <FieldShell label="Form 15 G" labelHi="फॉर्म १५ जी" required error={errors.form15G}>
            <TextInput icon={<FileCheck size={16} />} value={form.form15G} onChange={() => {}} readOnly error={errors.form15G} />
          </FieldShell>

          <FieldShell label="Interest Amount" labelHi="व्याज रक्कम" required error={errors.interestAmount}>
            <TextInput icon={<IndianRupee size={16} />} value={form.interestAmount} onChange={() => {}} readOnly error={errors.interestAmount} />
          </FieldShell>

          <FieldShell label="Transaction Amount" labelHi="व्यवहार रक्कम" required error={errors.transactionAmount}>
            <TextInput icon={<IndianRupee size={16} />} value={form.transactionAmount} onChange={() => {}} readOnly error={errors.transactionAmount} />
          </FieldShell>
        </div>
      </SectionCard>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleValidate}
          className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          Validate <Check size={16} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Cancel <X size={16} />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValidated || isSaving}
          className={`flex items-center gap-1.5 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium transition-colors ${
            isValidated && !isSaving
              ? "bg-primary text-white hover:bg-primary-700"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {activePicker === "accountCode" && (
        <ListModal
          title="Account List"
          columns={[
            { key: "code", label: "Account Code" },
            { key: "name", label: "Account Name" },
          ]}
          rows={ACCOUNT_PICK_LIST}
          onSelect={handlePickAccount}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default AddTdsTransaction;
