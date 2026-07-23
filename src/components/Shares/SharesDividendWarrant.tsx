import { useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  Hash,
  Percent,
  MoreVertical,
  Check,
  Printer,
  X,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput } from "@/components/shared/FormFields";
import ListModal from "@/components/AccountMaster/ListModal";

type PickRow = { code: string; name: string };

const DIVIDEND_YEAR_LIST: PickRow[] = [
  { code: "2023-24", name: "FY 2023-24" },
  { code: "2024-25", name: "FY 2024-25" },
  { code: "2025-26", name: "FY 2025-26" },
];

const MEMBER_LIST: PickRow[] = [
  { code: "MEM-1001", name: "Rahul Sharma" },
  { code: "MEM-1002", name: "Priya Singh" },
  { code: "MEM-1003", name: "Amit Verma" },
];

export interface ShareDividendWarrantFormData {
  dividendPrintDate: string;
  intRate: string;
  dividendYearFrom: string;
  dividendYearTo: string;
  memberNoFrom: string;
  accountNameFrom: string;
  memberNoTo: string;
  accountNameTo: string;
}

const DEFAULT_FORM_DATA: ShareDividendWarrantFormData = {
  dividendPrintDate: "",
  intRate: "",
  dividendYearFrom: "",
  dividendYearTo: "",
  memberNoFrom: "",
  accountNameFrom: "",
  memberNoTo: "",
  accountNameTo: "",
};

const TEXT_FIELD_KEYS: (keyof ShareDividendWarrantFormData)[] = [
  "dividendPrintDate",
  "intRate",
  "dividendYearFrom",
  "dividendYearTo",
  "memberNoFrom",
  "accountNameFrom",
  "memberNoTo",
  "accountNameTo",
];

const validate = (
  data: ShareDividendWarrantFormData
): Record<keyof ShareDividendWarrantFormData, boolean> => {
  const errors = {} as Record<keyof ShareDividendWarrantFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = data[key].trim() === "";
  });
  return errors;
};

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
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
    <User size={24} className="text-primary" />
  </div>
);

type PickerField = "dividendYearFrom" | "memberNoFrom" | "memberNoTo";

export interface SharesDividendWarrantProps {
  onClose: () => void;
  onPrint?: (data: ShareDividendWarrantFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const SharesDividendWarrant = ({ onClose, onPrint, variant = "modal" }: SharesDividendWarrantProps) => {
  const [form, setForm] = useState<ShareDividendWarrantFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof ShareDividendWarrantFormData, boolean>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const markDirty = (field: keyof ShareDividendWarrantFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof ShareDividendWarrantFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handlePickMember = (field: "memberNoFrom" | "memberNoTo", row: PickRow) => {
    const nameField = field === "memberNoFrom" ? "accountNameFrom" : "accountNameTo";
    markDirty(field);
    markDirty(nameField);
    setForm((f) => ({ ...f, [field]: row.code, [nameField]: row.name }));
    setActivePicker(null);
  };

  const handlePickYear = (row: PickRow) => {
    markDirty("dividendYearFrom");
    setForm((f) => ({ ...f, dividendYearFrom: row.code }));
    setActivePicker(null);
  };

  const handleValidate = () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    const hasErrors = Object.values(nextErrors).some(Boolean);
    setIsValidated(!hasErrors);
    if (hasErrors) {
      toast.error("Please fill all required fields before validating.");
    } else {
      toast.success("All fields validated successfully.");
    }
  };

  const handleCancel = () => {
    setForm(DEFAULT_FORM_DATA);
    setErrors({});
    setIsValidated(false);
    onClose();
  };

  const handlePrint = () => {
    if (!isValidated) return;
    onPrint?.(form);
    toast.success("Dividend warrant sent to print.");
  };

  return (
    <FormModal
      onClose={onClose}
      titleEn="Shares Dividend Warrant"
      titleHi="भाग वितरण"
      subtitleEn="Configure earning and deduction components used for payroll calculation and salary processing."
      subtitleHi="वेतन गणना व प्रक्रिया करण्यासाठी कमाई व कपात घटकांची संरचना करा."
      headerIcon={<SectionIcon />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
      maxWidth="max-w-5xl"
    >
      <div className="rounded-[20px] border border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
          <FieldShell label="Dividend Print Date" labelHi="लाभांश छपाई तारीख" required error={errors.dividendPrintDate}>
            <DateInput value={form.dividendPrintDate} onChange={(v) => updateField("dividendPrintDate", v)} error={errors.dividendPrintDate} />
          </FieldShell>

          <FieldShell label="Int. Rate" labelHi="व्याज दर" required error={errors.intRate}>
            <TextInput
              icon={<Percent size={16} />}
              value={form.intRate}
              onChange={(v) => updateField("intRate", v)}
              placeholder="Enter Interest Rate"
              error={errors.intRate}
            />
          </FieldShell>

          <FieldShell label="Dividend Year From" labelHi="लाभांश वर्ष पासून" required error={errors.dividendYearFrom}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.dividendYearFrom}
                  onChange={(v) => updateField("dividendYearFrom", v)}
                  placeholder="Select Dividend Year"
                  error={errors.dividendYearFrom}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("dividendYearFrom")} />
            </div>
          </FieldShell>

          <FieldShell label="Dividend Year To" labelHi="लाभांश वर्ष पर्यंत" required error={errors.dividendYearTo}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.dividendYearTo}
              onChange={(v) => updateField("dividendYearTo", v)}
              placeholder="Enter Dividend Year To"
              error={errors.dividendYearTo}
            />
          </FieldShell>

          <FieldShell label="Member No From" labelHi="सभासद क्रमांक पासून" required error={errors.memberNoFrom}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.memberNoFrom}
                  onChange={(v) => updateField("memberNoFrom", v)}
                  placeholder="Select Member No"
                  error={errors.memberNoFrom}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("memberNoFrom")} />
            </div>
          </FieldShell>

          <FieldShell label="Account Name" labelHi="खात्याचे नाव" required error={errors.accountNameFrom}>
            <TextInput icon={<User size={16} />} value={form.accountNameFrom} onChange={() => {}} placeholder="Account Name" readOnly error={errors.accountNameFrom} />
          </FieldShell>

          <FieldShell label="Member No To" labelHi="सभासद क्रमांक पर्यंत" required error={errors.memberNoTo}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.memberNoTo}
                  onChange={(v) => updateField("memberNoTo", v)}
                  placeholder="Select Member No"
                  error={errors.memberNoTo}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("memberNoTo")} />
            </div>
          </FieldShell>

          <FieldShell label="Account Name" labelHi="खात्याचे नाव" required error={errors.accountNameTo}>
            <TextInput icon={<User size={16} />} value={form.accountNameTo} onChange={() => {}} placeholder="Account Name" readOnly error={errors.accountNameTo} />
          </FieldShell>
        </div>
      </div>

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
          onClick={handleCancel}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Cancel <X size={16} />
        </button>

        <button
          type="button"
          onClick={handlePrint}
          disabled={!isValidated}
          className={`flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors ${
            isValidated ? "hover:bg-slate-50" : "cursor-not-allowed opacity-60"
          }`}
        >
          Print <Printer size={16} />
        </button>
      </div>

      {activePicker === "dividendYearFrom" && (
        <ListModal
          title="Dividend Year List"
          columns={[
            { key: "code", label: "Year" },
            { key: "name", label: "Description" },
          ]}
          rows={DIVIDEND_YEAR_LIST}
          onSelect={handlePickYear}
          onClose={() => setActivePicker(null)}
        />
      )}

      {(activePicker === "memberNoFrom" || activePicker === "memberNoTo") && (
        <ListModal
          title="Member List"
          columns={[
            { key: "code", label: "Member No" },
            { key: "name", label: "Name" },
          ]}
          rows={MEMBER_LIST}
          onSelect={(row) => handlePickMember(activePicker, row)}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default SharesDividendWarrant;
