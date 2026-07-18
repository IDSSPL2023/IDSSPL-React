import { useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  Landmark,
  Package,
  FileText,
  Hash,
  Calendar,
  Check,
  X,
  MoreVertical,
  HandCoins,
  FileCheck2,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";

type PickRow = { code: string; name: string };

const BRANCH_LIST: PickRow[] = [
  { code: "0002", name: "Balaji Branch" },
  { code: "0003", name: "Main Branch" },
  { code: "0004", name: "Sub Branch" },
];

const PRODUCT_LIST: PickRow[] = [
  { code: "0002", name: "PG Export Product" },
  { code: "0005", name: "PG Standard Product" },
];

const AGENT_LIST: PickRow[] = [
  { code: "0002", name: "Ramesh Kulkarni" },
  { code: "0003", name: "Suresh Patil" },
];

type PickerStringField = "branchCode" | "branchName" | "productCode" | "description" | "agentId" | "name";
type PickerField = "branchCode" | "productCode" | "agentId";

const PICKER_CONFIG: Record<
  PickerField,
  { title: string; codeField: PickerStringField; nameField: PickerStringField; codeLabel: string; nameLabel: string; rows: PickRow[] }
> = {
  branchCode: { title: "Branch List", codeField: "branchCode", nameField: "branchName", codeLabel: "Branch Code", nameLabel: "Branch Name", rows: BRANCH_LIST },
  productCode: { title: "Product List", codeField: "productCode", nameField: "description", codeLabel: "Product Code", nameLabel: "Description", rows: PRODUCT_LIST },
  agentId: { title: "Agent List", codeField: "agentId", nameField: "name", codeLabel: "Agent ID", nameLabel: "Name", rows: AGENT_LIST },
};

export interface NewPgTransactionExportFormData {
  branchCode: string;
  branchName: string;
  productCode: string;
  description: string;
  agentId: string;
  name: string;
  period: string;
}

export const DEFAULT_NEW_PG_TRANSACTION_EXPORT_DATA: NewPgTransactionExportFormData = {
  branchCode: "0002",
  branchName: "Balaji Branch",
  productCode: "0002",
  description: "PG Export Product",
  agentId: "0002",
  name: "Ramesh Kulkarni",
  period: "2026-06",
};

const TEXT_FIELD_KEYS: (keyof NewPgTransactionExportFormData)[] = [
  "branchCode",
  "branchName",
  "productCode",
  "description",
  "agentId",
  "name",
  "period",
];

const validateNewPgTransactionExport = (
  data: NewPgTransactionExportFormData
): Record<keyof NewPgTransactionExportFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof NewPgTransactionExportFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  return errors;
};

const checkAmountForExport = () => new Promise<void>((resolve) => setTimeout(resolve, 500));

const createNewPgTransactionExport = (data: NewPgTransactionExportFormData) =>
  new Promise<NewPgTransactionExportFormData>((resolve) => setTimeout(() => resolve(data), 600));

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

export interface AddNewPgTransactionExportProps {
  onClose: () => void;
  onSave?: (data: NewPgTransactionExportFormData) => void;
  variant?: "modal" | "page";
}

const AddNewPgTransactionExport = ({ onClose, onSave, variant = "modal" }: AddNewPgTransactionExportProps) => {
  const [form, setForm] = useState<NewPgTransactionExportFormData>(DEFAULT_NEW_PG_TRANSACTION_EXPORT_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [isAmountChecked, setIsAmountChecked] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewPgTransactionExportFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const markDirty = (field: keyof NewPgTransactionExportFormData) => {
    setIsValidated(false);
    setIsAmountChecked(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof NewPgTransactionExportFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handlePickRow = (row: PickRow) => {
    if (!activePicker) return;
    const { codeField, nameField } = PICKER_CONFIG[activePicker];
    markDirty(codeField);
    markDirty(nameField);
    setForm((f) => ({ ...f, [codeField]: row.code, [nameField]: row.name }));
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors = validateNewPgTransactionExport(form);
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    setIsValidated(!hasErrors);
    setIsAmountChecked(false);
    if (hasErrors) {
      toast.error("Please fill all required fields before validating.");
    } else {
      toast.success("All fields validated successfully.");
    }
  };

  const handleCheckAmount = async () => {
    if (!isValidated || isChecking) return;
    setIsChecking(true);
    await checkAmountForExport();
    setIsChecking(false);
    setIsAmountChecked(true);
    toast.success("Amount checked successfully.");
  };

  const handleCreateTransaction = async () => {
    if (!isAmountChecked || isSaving) return;
    setIsSaving(true);
    await createNewPgTransactionExport(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_NEW_PG_TRANSACTION_EXPORT_DATA);
    setErrors({});
    setIsValidated(false);
    setIsAmountChecked(false);
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
        title="PG Transaction Export Created Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={handleCancel}
      titleEn="Transaction Export"
      titleHi="आदान-प्रदान निर्यात"
      subtitleEn="View the parameter information and associated details."
      subtitleHi="पॅरामीटरची माहिती आणि संबंधित तपशील पहा."
      headerIcon={<SectionIcon />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
      customFooter={
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
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
            onClick={handleCheckAmount}
            disabled={!isValidated || isChecking}
            className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              isValidated && !isChecking
                ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isChecking ? "Checking..." : "Check Amount"}
            <HandCoins className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleCreateTransaction}
            disabled={!isAmountChecked || isSaving}
            className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              isAmountChecked && !isSaving
                ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isSaving ? "Creating..." : "Create Transaction"}
            <FileCheck2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <div className={grid4}>
          <FieldShell label="Branch Code" labelHi="शाखा कोड" required error={errors.branchCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Landmark size={16} />}
                  value={form.branchCode}
                  onChange={(v) => updateField("branchCode", v)}
                  placeholder="Enter Branch Code"
                  error={errors.branchCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("branchCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Branch Name" labelHi="शाखेचे नाव" required error={errors.branchName}>
            <TextInput icon={<User size={16} />} value={form.branchName} onChange={() => {}} readOnly error={errors.branchName} />
          </FieldShell>

          <FieldShell label="Product Code" labelHi="उत्पादन कोड" required error={errors.productCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Package size={16} />}
                  value={form.productCode}
                  onChange={(v) => updateField("productCode", v)}
                  placeholder="Enter Product Code"
                  error={errors.productCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("productCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Description" labelHi="वर्णन" required error={errors.description}>
            <TextInput icon={<FileText size={16} />} value={form.description} onChange={() => {}} readOnly error={errors.description} />
          </FieldShell>

          <FieldShell label="Agent ID" labelHi="एजंट आयडी" required error={errors.agentId}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.agentId}
                  onChange={(v) => updateField("agentId", v)}
                  placeholder="Enter Agent ID"
                  error={errors.agentId}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("agentId")} />
            </div>
          </FieldShell>

          <FieldShell label="Name" labelHi="नाव" required error={errors.name}>
            <TextInput icon={<User size={16} />} value={form.name} onChange={() => {}} readOnly error={errors.name} />
          </FieldShell>

          <FieldShell label="Period" labelHi="कालावधी" required error={errors.period}>
            <TextInput
              icon={<Calendar size={16} />}
              type="month"
              value={form.period}
              onChange={() => {}}
              readOnly
              error={errors.period}
            />
          </FieldShell>
        </div>
      </div>

      {activePicker && (
        <ListModal
          title={PICKER_CONFIG[activePicker].title}
          columns={[
            { key: "code", label: PICKER_CONFIG[activePicker].codeLabel },
            { key: "name", label: PICKER_CONFIG[activePicker].nameLabel },
          ]}
          rows={PICKER_CONFIG[activePicker].rows}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default AddNewPgTransactionExport;
