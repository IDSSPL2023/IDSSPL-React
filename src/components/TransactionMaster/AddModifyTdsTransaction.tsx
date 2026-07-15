import { useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  FileText,
  CreditCard,
  Calendar,
  Check,
  X,
  MoreVertical,
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

const SELECT_PAID_OPTIONS = ["Paid"];
const SELECT_ADD_TDS_OPTIONS = ["Add TDS"];

type AccountPickRow = { code: string; name: string };

const ACCOUNT_PICK_LIST: AccountPickRow[] = [
  { code: "00000000105087", name: "DEVARADDI MALLANAGOUD" },
  { code: "00000000105088", name: "SAMPLE CUSTOMER" },
];

export interface ModifyTdsTransactionFormData {
  selectPaid: string;
  selectAddTds: string;
  oldTdsDate: string;
  newTdsDate: string;
  accountCode: string;
  accountName: string;
  customerId: string;
  panCardNumber: string;
  form15H: string;
  form15G: string;
  tdsPayable: string;
  tdsPaid: string;
  transactionAmount: string;
}

export const DEFAULT_MODIFY_TDS_DATA: ModifyTdsTransactionFormData = {
  selectPaid: "",
  selectAddTds: "",
  oldTdsDate: "",
  newTdsDate: "",
  accountCode: "00000000105087",
  accountName: "DEVARADDI MALLANAGOUD",
  customerId: "Name",
  panCardNumber: "AHQPW1429A",
  form15H: "23",
  form15G: "55",
  tdsPayable: "78",
  tdsPaid: "34",
  transactionAmount: "123",
};

const TEXT_FIELD_KEYS: (keyof ModifyTdsTransactionFormData)[] = [
  "selectPaid",
  "selectAddTds",
  "oldTdsDate",
  "newTdsDate",
  "accountCode",
];

const validateModifyTds = (data: ModifyTdsTransactionFormData): Record<keyof ModifyTdsTransactionFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof ModifyTdsTransactionFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  return errors;
};

const saveModifyTds = (data: ModifyTdsTransactionFormData) =>
  new Promise<ModifyTdsTransactionFormData>((resolve) => setTimeout(() => resolve(data), 600));

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

export interface AddModifyTdsTransactionProps {
  onClose: () => void;
  onSave?: (data: ModifyTdsTransactionFormData) => void;
  variant?: "modal" | "page";
}

const AddModifyTdsTransaction = ({ onClose, onSave, variant = "modal" }: AddModifyTdsTransactionProps) => {
  const [form, setForm] = useState<ModifyTdsTransactionFormData>(DEFAULT_MODIFY_TDS_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ModifyTdsTransactionFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<"accountCode" | null>(null);

  const LookupTrigger = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
    >
      <MoreVertical size={18} strokeWidth={2.4} />
    </button>
  );

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const markDirty = (field: keyof ModifyTdsTransactionFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof ModifyTdsTransactionFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const openPicker = (field: "accountCode") => setActivePicker(field);

  const handleValidate = () => {
    const newErrors = validateModifyTds(form);
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
    await saveModifyTds(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_MODIFY_TDS_DATA);
    setErrors({});
    setIsValidated(false);
    onClose();
  };

  const handleSuccessDone = () => {
    onSave?.(form);
    setShowSuccess(false);
    onClose();
  };

  const handlePickAccount = (row: AccountPickRow) => {
    markDirty("accountCode");
    markDirty("accountName");
    markDirty("customerId");
    setForm((f) => ({ 
      ...f, 
      accountCode: row.code, 
      accountName: row.name,
      customerId: "Name",
      panCardNumber: "ABCDE1234F",
      form15H: "Yes",
      form15G: "No",
      tdsPayable: "5000",
      tdsPaid: "4500",
      transactionAmount: "100000",
    }));
    setActivePicker(null);
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        title="TDS Transaction Modified Successfully"
        subtitle="TDS transaction details have been updated."
      />
    );
  }

  return (
    <FormModal
      onClose={handleCancel}
      titleEn="Modify TDS Transaction"
      titleHi="टीडीएस व्यवहार सुधारणे"
      subtitleEn="Modify the TDS transaction details below."
      subtitleHi="खालील टीडीएस व्यवहाराचा तपशील सुधारा."
      headerIcon={<SectionIcon />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
      customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={handleValidate}
            className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Validate
            <Check className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isValidated || isSaving}
            className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              isValidated && !isSaving
                ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Save
            <Check className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <SectionCard
        titleEn="Account Details"
        titleHi="खाते तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Select" labelHi="ग्राहक आयडी" required error={errors.selectPaid}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.selectPaid}
              onChange={(v) => updateField("selectPaid", v)}
              options={SELECT_PAID_OPTIONS}
              placeholder="Select"
              error={errors.selectPaid}
            />
          </FieldShell>

          <FieldShell label="Select" labelHi="ग्राहक आयडी" required error={errors.selectAddTds}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.selectAddTds}
              onChange={(v) => updateField("selectAddTds", v)}
              options={SELECT_ADD_TDS_OPTIONS}
              placeholder="Select"
              error={errors.selectAddTds}
            />
          </FieldShell>

          <FieldShell label="Old TDS Date" labelHi="पहिले नाव" required error={errors.oldTdsDate}>
            <DateInput
              value={form.oldTdsDate}
              onChange={(v) => updateField("oldTdsDate", v)}
              error={errors.oldTdsDate}
            />
          </FieldShell>

          <FieldShell label="New TDS Date" labelHi="पहिले नाव" required error={errors.newTdsDate}>
            <DateInput
              value={form.newTdsDate}
              onChange={(v) => updateField("newTdsDate", v)}
              error={errors.newTdsDate}
            />
          </FieldShell>

          <FieldShell label="Account Code" labelHi="स्क्रोल क्रमांक" required error={errors.accountCode}>
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

          <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
            <TextInput
              icon={<User size={16} />}
              value={form.accountName}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Customer ID" labelHi="ठेव रक्कम" required>
            <TextInput
              icon={<User size={16} />}
              value={form.customerId}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Pan card Number" labelHi="एकूण हप्ता" required>
            <TextInput
              icon={<FileText size={16} />}
              value={form.panCardNumber}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Form 15 H" labelHi="खातेवही शिल्लक" required>
            <TextInput
              icon={<FileText size={16} />}
              value={form.form15H}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Form 15 G" labelHi="उपलब्ध शिल्लक" required>
            <TextInput
              icon={<FileText size={16} />}
              value={form.form15G}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="TDS Payable" labelHi="मर्यादा रक्कम" required>
            <TextInput
              icon={<FileText size={16} />}
              value={form.tdsPayable}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="TDS Paid" labelHi="कर्ज उचलण्याची क्षमता" required>
            <TextInput
              icon={<FileText size={16} />}
              value={form.tdsPaid}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Transaction Amount" labelHi="कर्ज उचलण्याची क्षमता" required>
            <TextInput
              icon={<FileText size={16} />}
              value={form.transactionAmount}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>
      </SectionCard>

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

export default AddModifyTdsTransaction;
