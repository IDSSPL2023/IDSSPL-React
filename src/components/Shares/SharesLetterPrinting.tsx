import { useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  Hash,
  FileText,
  IndianRupee,
  MoreVertical,
  Check,
  Printer,
  X,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput } from "@/components/shared/FormFields";
import ListModal from "@/components/AccountMaster/ListModal";

type PickRow = { code: string; name: string };

const PRODUCT_LIST: PickRow[] = [
  { code: "PRD-01", name: "Savings Certificate" },
  { code: "PRD-02", name: "Fixed Deposit Certificate" },
  { code: "PRD-03", name: "Share Certificate" },
];

const OUTWARD_LIST: PickRow[] = [
  { code: "OW-101", name: "Outward Register 101" },
  { code: "OW-102", name: "Outward Register 102" },
];

export interface SharesLetterPrintingFormData {
  productCode: string;
  description: string;
  fromAmount: string;
  toAmount: string;
  outwardNumber: string;
  printDate: string;
  asOnDate: string;
}

const DEFAULT_FORM_DATA: SharesLetterPrintingFormData = {
  productCode: "",
  description: "",
  fromAmount: "",
  toAmount: "",
  outwardNumber: "",
  printDate: "",
  asOnDate: "",
};

const TEXT_FIELD_KEYS: (keyof SharesLetterPrintingFormData)[] = [
  "productCode",
  "description",
  "fromAmount",
  "toAmount",
  "outwardNumber",
  "printDate",
  "asOnDate",
];

const validate = (
  data: SharesLetterPrintingFormData
): Record<keyof SharesLetterPrintingFormData, boolean> => {
  const errors = {} as Record<keyof SharesLetterPrintingFormData, boolean>;
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

type PickerField = "productCode" | "outwardNumber";

export interface SharesLetterPrintingProps {
  onClose: () => void;
  onPrint?: (data: SharesLetterPrintingFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const SharesLetterPrinting = ({ onClose, onPrint, variant = "modal" }: SharesLetterPrintingProps) => {
  const [form, setForm] = useState<SharesLetterPrintingFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof SharesLetterPrintingFormData, boolean>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const markDirty = (field: keyof SharesLetterPrintingFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof SharesLetterPrintingFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handlePickProduct = (row: PickRow) => {
    markDirty("productCode");
    markDirty("description");
    setForm((f) => ({ ...f, productCode: row.code, description: row.name }));
    setActivePicker(null);
  };

  const handlePickOutward = (row: PickRow) => {
    markDirty("outwardNumber");
    setForm((f) => ({ ...f, outwardNumber: row.code }));
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
    toast.success("Shares letter sent to print.");
  };

  return (
    <FormModal
      onClose={onClose}
      titleEn="Shares Letter Printing"
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
          <FieldShell label="Product Code" labelHi="उत्पादन कोड" required error={errors.productCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.productCode}
                  onChange={(v) => updateField("productCode", v)}
                  placeholder="Select Product Code"
                  error={errors.productCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("productCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Description" labelHi="वर्णन" required error={errors.description}>
            <TextInput icon={<FileText size={16} />} value={form.description} onChange={() => {}} placeholder="Description" readOnly error={errors.description} />
          </FieldShell>

          <FieldShell label="From Amount" labelHi="रक्कम पासून" required error={errors.fromAmount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.fromAmount}
              onChange={(v) => updateField("fromAmount", v)}
              placeholder="Enter From Amount"
              error={errors.fromAmount}
            />
          </FieldShell>

          <FieldShell label="To Amount" labelHi="रक्कम पर्यंत" required error={errors.toAmount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.toAmount}
              onChange={(v) => updateField("toAmount", v)}
              placeholder="Enter To Amount"
              error={errors.toAmount}
            />
          </FieldShell>

          <FieldShell label="Outward Number" labelHi="आउटवर्ड क्रमांक" required error={errors.outwardNumber}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.outwardNumber}
                  onChange={(v) => updateField("outwardNumber", v)}
                  placeholder="Select Outward Number"
                  error={errors.outwardNumber}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("outwardNumber")} />
            </div>
          </FieldShell>

          <FieldShell label="Print Date" labelHi="छपाई तारीख" required error={errors.printDate}>
            <DateInput value={form.printDate} onChange={(v) => updateField("printDate", v)} error={errors.printDate} />
          </FieldShell>

          <FieldShell label="As On Date" labelHi="दिनांकानुसार" required error={errors.asOnDate}>
            <DateInput value={form.asOnDate} onChange={(v) => updateField("asOnDate", v)} error={errors.asOnDate} />
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

      {activePicker === "productCode" && (
        <ListModal
          title="Product List"
          columns={[
            { key: "code", label: "Product Code" },
            { key: "name", label: "Description" },
          ]}
          rows={PRODUCT_LIST}
          onSelect={handlePickProduct}
          onClose={() => setActivePicker(null)}
        />
      )}

      {activePicker === "outwardNumber" && (
        <ListModal
          title="Outward List"
          columns={[
            { key: "code", label: "Outward Number" },
            { key: "name", label: "Description" },
          ]}
          rows={OUTWARD_LIST}
          onSelect={handlePickOutward}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default SharesLetterPrinting;
