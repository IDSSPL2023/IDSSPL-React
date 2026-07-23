import { IMAGES } from "@/assets";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import { User, FileText, Hash, MoreVertical, Check, ChevronsDown, IndianRupee, CreditCard } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";

type PickRow = { code: string; name: string };

const SR_NO_LIST: PickRow[] = [
  { code: "1", name: "RTGS Outward File - 1" },
  { code: "2", name: "RTGS Outward File - 2" },
];

const ACCOUNT_PICK_LIST: PickRow[] = [
  { code: "000245", name: "DEVARADDI MALLANAGOUD" },
  { code: "000246", name: "AKSHAY OM MORE" },
  { code: "000247", name: "PRIYA SHARMA" },
];

const CASE_TYPE_LIST: PickRow[] = [
  { code: "OUTWARD", name: "RTGS Outward" },
  { code: "INWARD", name: "RTGS Inward" },
];

type PickerStringField = "srNo" | "accountCode" | "name" | "caseType";
type PickerField = "srNo" | "accountCode" | "caseType";

const PICKER_CONFIG: Record<
  PickerField,
  { title: string; codeField: PickerStringField; nameField?: PickerStringField; codeLabel: string; nameLabel: string; rows: PickRow[] }
> = {
  srNo: { title: "SR No List", codeField: "srNo", codeLabel: "SR No", nameLabel: "Description", rows: SR_NO_LIST },
  accountCode: { title: "Account List", codeField: "accountCode", nameField: "name", codeLabel: "Account Code", nameLabel: "Name", rows: ACCOUNT_PICK_LIST },
  caseType: { title: "Case Type List", codeField: "caseType", codeLabel: "Code", nameLabel: "Case Type", rows: CASE_TYPE_LIST },
};

export interface RtgsOutwardFormData {
  // Header info
  bankCode: string;
  branchCode: string;
  user: string;
  date: string;

  // Details
  srNo: string;
  accountCode: string;
  name: string;
  caseType: string;
  noticeDate: string;
  caseDate: string;
  caseNumber: string;
  caseFee: string;
  caseDescription: string;

  message: string;
}

/** Reusable dummy data — used to prefill the form on open (backend not ready). */
export const DEFAULT_RTGS_OUTWARD_DATA: RtgsOutwardFormData = {
  bankCode: "0100",
  branchCode: "",
  user: "",
  date: "",

  srNo: "1",
  accountCode: "",
  name: "",
  caseType: "",
  noticeDate: "",
  caseDate: "",
  caseNumber: "",
  caseFee: "",
  caseDescription: "",

  message: "Please logout and login again!",
};

const TEXT_FIELD_KEYS: (keyof RtgsOutwardFormData)[] = [
  "srNo",
  "accountCode",
  "caseType",
  "noticeDate",
  "caseDate",
  "caseNumber",
  "caseFee",
  "caseDescription",
];

/** Same validation approach used by Transaction Master's sibling forms. */
const validateRtgsOutward = (data: RtgsOutwardFormData): Record<keyof RtgsOutwardFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof RtgsOutwardFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  errors.bankCode = false;
  errors.branchCode = false;
  errors.user = false;
  errors.date = false;
  errors.name = false;
  errors.message = false;
  return errors;
};

/** Simulated save — no backend yet. */
const saveRtgsOutward = (data: RtgsOutwardFormData) =>
  new Promise<RtgsOutwardFormData>((resolve) => setTimeout(() => resolve(data), 600));

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
    <FileText size={20} className="text-primary" />
  </div>
);

export interface AddRtgsOutwardProps {
  onClose: () => void;
  onSave?: (data: RtgsOutwardFormData) => void;
  titleEn?: string;
  titleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  headerIcon?: React.ReactNode;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddRtgsOutward = ({
  onClose,
  onSave,
  titleEn = "RTGS Outward File Generation",
  titleHi = "RTGS आउटवर्ड फाइल जनरेशन",
  subtitleEn = "Fill in the RTGS outward file generation details below.",
  subtitleHi = "खालील RTGS आउटवर्ड फाइल तपशील भरा.",
  headerIcon = <Image src={IMAGES.RTGS} alt="RTGS Outward" width={50} height={50} />,
  variant = "modal",
}: AddRtgsOutwardProps) => {
  const [form, setForm] = useState<RtgsOutwardFormData>(DEFAULT_RTGS_OUTWARD_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RtgsOutwardFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid2 = "grid grid-cols-1 gap-4 sm:grid-cols-3";

  const markDirty = (field: keyof RtgsOutwardFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof RtgsOutwardFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handlePickRow = (row: PickRow) => {
    if (!activePicker) return;
    const { codeField, nameField } = PICKER_CONFIG[activePicker];
    markDirty(codeField);
    if (nameField) markDirty(nameField);
    setForm((f) => {
      const updated: Record<string, string> = { ...f };
      updated[codeField] = row.code;
      if (nameField) updated[nameField] = row.name;
      return updated as unknown as RtgsOutwardFormData;
    });
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors = validateRtgsOutward(form);
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
    await saveRtgsOutward(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleClear = () => {
    setForm(DEFAULT_RTGS_OUTWARD_DATA);
    setErrors({});
    setIsValidated(false);
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
        title="RTGS Outward File Generated Successfully"
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
        titleEn="RTGS Outward File Details"
        titleHi="RTGS आउटवर्ड फाइल तपशील"
        subtitleEn="Enter the case related information before generating the outward file."
        subtitleHi="आऊटवर्ड फाइल तयार करण्यापूर्वी प्रकरण संबंधित माहिती भरा."
        icon={<SectionIcon />}
      >
        <div className={`${grid2} mt-2`}>
          <FieldShell label="SR NO" labelHi="अनुक्रमांक" required error={errors.srNo}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.srNo}
                  onChange={(v) => updateField("srNo", v)}
                  placeholder="Enter SR No"
                  error={errors.srNo}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("srNo")} />
            </div>
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
              <LookupTrigger onClick={() => setActivePicker("accountCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Name" labelHi="नाव" error={errors.name}>
            <TextInput icon={<User size={16} />} value={form.name} onChange={() => {}} readOnly error={errors.name} />
          </FieldShell>

          <FieldShell label="Case Type" labelHi="प्रकरण प्रकार" required error={errors.caseType}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<FileText size={16} />}
                  value={form.caseType}
                  onChange={(v) => updateField("caseType", v)}
                  placeholder="Enter Case Type"
                  error={errors.caseType}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("caseType")} />
            </div>
          </FieldShell>

          <FieldShell label="Notice Date" labelHi="सूचना तारीख" required error={errors.noticeDate}>
            <DateInput value={form.noticeDate} onChange={(v) => updateField("noticeDate", v)} error={errors.noticeDate} />
          </FieldShell>

          <FieldShell label="Case Date" labelHi="प्रकरण तारीख" required error={errors.caseDate}>
            <DateInput value={form.caseDate} onChange={(v) => updateField("caseDate", v)} error={errors.caseDate} />
          </FieldShell>

          <FieldShell label="Case Number" labelHi="प्रकरण क्रमांक" required error={errors.caseNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.caseNumber}
              onChange={(v) => updateField("caseNumber", v)}
              placeholder="Enter Case Number"
              error={errors.caseNumber}
            />
          </FieldShell>

          <FieldShell label="Case Fee" labelHi="प्रकरण शुल्क" required error={errors.caseFee}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.caseFee}
              onChange={(v) => updateField("caseFee", v)}
              placeholder="Enter Case Fee"
              error={errors.caseFee}
            />
          </FieldShell>

          <FieldShell label="Case Description" labelHi="प्रकरण वर्णन" required error={errors.caseDescription} className="sm:col-span-2">
            <TextInput
              icon={<FileText size={16} />}
              value={form.caseDescription}
              onChange={(v) => updateField("caseDescription", v)}
              placeholder="Enter Case Description"
              error={errors.caseDescription}
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
          onClick={handleClear}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Clear
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

export default AddRtgsOutward;
