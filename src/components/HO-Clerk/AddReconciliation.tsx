import { IMAGES } from "@/assets";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import { User, FileText, Hash, MoreVertical, Check, X, ChevronsDown, Landmark } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SectionCard, RadioYesNo } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";

type PickRow = { code: string; name: string };

const ADVICE_LIST: PickRow[] = [
  { code: "ADV2026", name: "Reconciliation Advice - May 2026" },
  { code: "ADV2027", name: "Reconciliation Advice - Jun 2026" },
];

const RECONCILIATION_CODE_LIST: PickRow[] = [
  { code: "REC01", name: "Inter Branch Reconciliation" },
  { code: "REC02", name: "GL Suspense Reconciliation" },
];

type PickerField = "adviceNo" | "reconciliationCode";

const PICKER_CONFIG: Record<PickerField, { title: string; codeLabel: string; nameLabel: string; rows: PickRow[] }> = {
  adviceNo: { title: "Advice List", codeLabel: "Advice No", nameLabel: "Description", rows: ADVICE_LIST },
  reconciliationCode: { title: "Reconciliation Code List", codeLabel: "Code", nameLabel: "Description", rows: RECONCILIATION_CODE_LIST },
};

export interface ReconciliationFormData {
  // Header info
  bankCode: string;
  branchCode: string;
  user: string;
  date: string;

  // Reconciliation Details
  adviceNo: string;
  adviceDate: string;
  branchName: string;
  internalReconciliation: boolean;
  reconciliationCode: string;
  branchReconciliationDescription: string;

  message: string;
}

/** Reusable dummy data — used to prefill the form on open (backend not ready). */
export const DEFAULT_RECONCILIATION_DATA: ReconciliationFormData = {
  bankCode: "0100",
  branchCode: "",
  user: "",
  date: "",

  adviceNo: "",
  adviceDate: "",
  branchName: "",
  internalReconciliation: true,
  reconciliationCode: "",
  branchReconciliationDescription: "",

  message: "Please logout and login again!",
};

const TEXT_FIELD_KEYS: (keyof ReconciliationFormData)[] = ["adviceNo", "reconciliationCode"];

/** Same validation approach used by Transaction Master's sibling forms (Cash Deposit, HO Transfer). */
const validateReconciliation = (data: ReconciliationFormData): Record<keyof ReconciliationFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof ReconciliationFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  errors.bankCode = false;
  errors.branchCode = false;
  errors.user = false;
  errors.date = false;
  errors.adviceDate = false;
  errors.branchName = false;
  errors.internalReconciliation = false;
  errors.branchReconciliationDescription = false;
  errors.message = false;
  return errors;
};

/** Simulated save — no backend yet. */
const saveReconciliation = (data: ReconciliationFormData) =>
  new Promise<ReconciliationFormData>((resolve) => setTimeout(() => resolve(data), 600));

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
    <Landmark size={20} className="text-primary" />
  </div>
);

export interface AddReconciliationProps {
  onClose: () => void;
  onSave?: (data: ReconciliationFormData) => void;
  titleEn?: string;
  titleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  headerIcon?: React.ReactNode;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddReconciliation = ({
  onClose,
  onSave,
  titleEn = "Reconciliation",
  titleHi = "समायोजन",
  subtitleEn = "Fill in the reconciliation entry details below.",
  subtitleHi = "खालील समायोजन तपशील भरा.",
  headerIcon = <Image src={IMAGES.NOTE_1} alt="Reconciliation" width={50} height={50} />,
  variant = "modal",
}: AddReconciliationProps) => {
  const [form, setForm] = useState<ReconciliationFormData>(DEFAULT_RECONCILIATION_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ReconciliationFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid2 = "grid grid-cols-1 gap-4 sm:grid-cols-3";

  const markDirty = (field: keyof ReconciliationFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof ReconciliationFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const updateBranchCode = (value: string) => {
    markDirty("branchCode");
    setForm((f) => ({ ...f, branchCode: value }));
  };

  const handlePickRow = (row: PickRow) => {
    if (!activePicker) return;
    markDirty(activePicker);
    setForm((f) => ({ ...f, [activePicker]: row.code }));
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors = validateReconciliation(form);
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
    await saveReconciliation(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_RECONCILIATION_DATA);
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
        title="Reconciliation Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn={titleEn}
      titleHi={titleHi}
      subtitleEn={subtitleEn}
      subtitleHi={subtitleHi}
      headerIcon={headerIcon}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
    >

      <SectionCard
        titleEn="Reconciliation Details"
        titleHi="समायोजन तपशील"
        subtitleEn="Select the advice and reconciliation code before processing."
        subtitleHi="प्रक्रिया करण्यापूर्वी सल्ला व समायोजन कोड निवडा."
        icon={<SectionIcon />}
      >
        <div className={`${grid2} mt-2`}>
          <FieldShell label="Advice No." labelHi="सल्ला क्रमांक" required error={errors.adviceNo}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.adviceNo}
                  onChange={(v) => updateField("adviceNo", v)}
                  placeholder="Enter Advice No."
                  error={errors.adviceNo}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("adviceNo")} />
            </div>
          </FieldShell>

          <FieldShell label="Advice Date" labelHi="सल्ला तारीख" error={errors.adviceDate}>
            <DateInput value={form.adviceDate} onChange={() => {}} readOnly error={errors.adviceDate} />
          </FieldShell>

          <FieldShell label="Branch Name" labelHi="शाखेचे नाव" className="sm:col-span-2" error={errors.branchName}>
            <TextInput icon={<Landmark size={16} />} value={form.branchName} onChange={() => {}} readOnly error={errors.branchName} />
          </FieldShell>

          <FieldShell label="Internal Reconciliation" labelHi="अंतर्गत समायोजन">
            <RadioYesNo
              label=""
              labelHi=""
              value={form.internalReconciliation}
              onChange={(v) => {
                markDirty("internalReconciliation");
                setForm((f) => ({ ...f, internalReconciliation: v }));
              }}
            />
          </FieldShell>

          <FieldShell label="Reconciliation Code" labelHi="समायोजन कोड" required error={errors.reconciliationCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.reconciliationCode}
                  onChange={(v) => updateField("reconciliationCode", v)}
                  placeholder="Enter Reconciliation Code"
                  error={errors.reconciliationCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("reconciliationCode")} />
            </div>
          </FieldShell>

          <FieldShell
            label="Branch/Reconciliation Description"
            labelHi="शाखा/समायोजन वर्णन"
            className="sm:col-span-2"
            error={errors.branchReconciliationDescription}
          >
            <TextInput
              icon={<FileText size={16} />}
              value={form.branchReconciliationDescription}
              onChange={() => {}}
              readOnly
              error={errors.branchReconciliationDescription}
            />
          </FieldShell>
        </div>
      </SectionCard>

      {form.message && (
        <FieldShell label="Message" labelHi="संदेश">
          <div className="w-full rounded-lg border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">
            {form.message}
          </div>
        </FieldShell>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleValidate}
          className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          Validate <Check size={16} />
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
          {isSaving ? "Saving..." : "Save"} <ChevronsDown size={16} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Cancel <X size={16} />
        </button>
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

export default AddReconciliation;
