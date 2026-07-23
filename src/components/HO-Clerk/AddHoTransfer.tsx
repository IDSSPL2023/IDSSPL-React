import { IMAGES } from "@/assets";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import {
  User,
  CreditCard,
  IndianRupee,
  FileText,
  Hash,
  Landmark,
  MoreVertical,
  Check,
  X,
  ChevronsDown,
  Search,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  DateInput,
  SectionCard,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import CustomerIdPicklistField, { type CustomerOption } from "../common/CustomerIdPicklistField";

type PickRow = { code: string; name: string };

const SCROLL_LIST: PickRow[] = [
  { code: "0", name: "HO Transfer Scroll" },
  { code: "1", name: "Fund Transfer Scroll" },
];

const ACCOUNT_PICK_LIST: PickRow[] = [
  { code: "000245", name: "DEVARADDI MALLANAGOUD" },
  { code: "000246", name: "AKSHAY OM MORE" },
  { code: "000247", name: "PRIYA SHARMA" },
];

const OUTLIST_SERIAL_LIST: PickRow[] = [
  { code: "25", name: "HO Transfer Outlist" },
  { code: "26", name: "GL Transfer Outlist" },
];

const ADVICE_LIST: PickRow[] = [
  { code: "ADV2026", name: "HO Transfer Advice - May 2026" },
  { code: "ADV2027", name: "HO Transfer Advice - Jun 2026" },
];

const INSTRUMENT_TYPE_LIST: PickRow[] = [
  { code: "CHEQUE", name: "Cheque" },
  { code: "DD", name: "Demand Draft" },
  { code: "NEFT", name: "NEFT" },
  { code: "RTGS", name: "RTGS" },
];

type PickerStringField =
  | "scrollNumber"
  | "accountCode"
  | "accountName"
  | "outlistSerial"
  | "glOutlistDesc"
  | "adviceNumber"
  | "instrumentType";
type PickerField = "scrollNumber" | "accountCode" | "outlistSerial" | "adviceNumber" | "instrumentType";

const PICKER_CONFIG: Record<
  PickerField,
  { title: string; codeField: PickerStringField; nameField?: PickerStringField; codeLabel: string; nameLabel: string; rows: PickRow[] }
> = {
  scrollNumber: { title: "Scroll List", codeField: "scrollNumber", codeLabel: "Scroll No", nameLabel: "Description", rows: SCROLL_LIST },
  accountCode: { title: "Account List", codeField: "accountCode", nameField: "accountName", codeLabel: "Account Code", nameLabel: "Name", rows: ACCOUNT_PICK_LIST },
  outlistSerial: { title: "Outlist Serial List", codeField: "outlistSerial", nameField: "glOutlistDesc", codeLabel: "Serial No", nameLabel: "Description", rows: OUTLIST_SERIAL_LIST },
  adviceNumber: { title: "Advice List", codeField: "adviceNumber", codeLabel: "Advice No", nameLabel: "Description", rows: ADVICE_LIST },
  instrumentType: { title: "Instrument Type List", codeField: "instrumentType", codeLabel: "Code", nameLabel: "Instrument Type", rows: INSTRUMENT_TYPE_LIST },
};

export interface HoTransferFormData {
  // Header info
  bankCode: string;
  branchCode: string;
  user: string;
  date: string;

  // Section 1 — Account Details
  scrollNumber: string;
  subScrollNo: string;
  debitAmount: string;
  creditAmount: string;
  debitCreditMode: "Debit" | "Credit";
  lastTransactionDate: string;
  unclearBalance: string;
  accountCode: string;
  accountName: string;
  glAccountCode: string;
  glAccountName: string;
  customerId: string;
  customerName: string;
  ledgerBalance: string;
  availableBalance: string;
  newLedgerBalance: string;

  // Section 2 — Transaction Details
  outlistSerial: string;
  glOutlistDesc: string;
  glOutListDocNo: string;
  originalResponding: "Original" | "Responding";
  adviceNumber: string;
  adviceDate: string;
  amount: string;
  particular: string;
  instrumentType: string;
  instrumentNumber: string;
  instrumentDate: string;

  message: string;
}

/** Reusable dummy data — used to prefill the form on open (backend not ready). */
export const DEFAULT_HO_TRANSFER_DATA: HoTransferFormData = {
  bankCode: "0100",
  branchCode: "",
  user: "",
  date: "",

  scrollNumber: "0",
  subScrollNo: "",
  debitAmount: "",
  creditAmount: "",
  debitCreditMode: "Debit",
  lastTransactionDate: "",
  unclearBalance: "",
  accountCode: "",
  accountName: "",
  glAccountCode: "",
  glAccountName: "",
  customerId: "",
  customerName: "",
  ledgerBalance: "",
  availableBalance: "",
  newLedgerBalance: "",

  outlistSerial: "",
  glOutlistDesc: "",
  glOutListDocNo: "",
  originalResponding: "Original",
  adviceNumber: "",
  adviceDate: "",
  amount: "",
  particular: "",
  instrumentType: "",
  instrumentNumber: "",
  instrumentDate: "",

  message: "Please logout and login again!",
};

const TEXT_FIELD_KEYS: (keyof HoTransferFormData)[] = [
  "scrollNumber",
  "subScrollNo",
  "accountCode",
  "accountName",
  "glAccountCode",
  "glAccountName",
  "customerId",
  "customerName",
  "outlistSerial",
  "glOutlistDesc",
  "glOutListDocNo",
  "adviceNumber",
  "adviceDate",
  "amount",
  "particular",
  "instrumentType",
  "instrumentNumber",
  "instrumentDate",
];

/** Same validation approach used by Transaction Master's sibling forms (Cash Deposit, Transfer). */
const validateHoTransfer = (data: HoTransferFormData): Record<keyof HoTransferFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof HoTransferFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  errors.bankCode = false;
  errors.branchCode = false;
  errors.user = false;
  errors.date = false;
  errors.debitAmount = false;
  errors.creditAmount = false;
  errors.debitCreditMode = false;
  errors.lastTransactionDate = false;
  errors.unclearBalance = false;
  errors.ledgerBalance = false;
  errors.availableBalance = false;
  errors.newLedgerBalance = false;
  errors.originalResponding = false;
  errors.message = false;
  return errors;
};

/** Simulated save — no backend yet. */
const saveHoTransfer = (data: HoTransferFormData) =>
  new Promise<HoTransferFormData>((resolve) => setTimeout(() => resolve(data), 600));

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

const RadioDebitCredit = ({
  value,
  onChange,
}: {
  value: "Debit" | "Credit";
  onChange: (v: "Debit" | "Credit") => void;
}) => (
  <div className="flex items-center gap-4 pt-3">
    {(["Debit", "Credit"] as const).map((opt) => (
      <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="radio"
          checked={value === opt}
          onChange={() => onChange(opt)}
          className="h-4 w-4 accent-primary"
        />
        {opt}
      </label>
    ))}
  </div>
);

const RadioOriginalResponding = ({
  value,
  onChange,
}: {
  value: "Original" | "Responding";
  onChange: (v: "Original" | "Responding") => void;
}) => (
  <div className="flex items-center gap-4 pt-3">
    {(["Original", "Responding"] as const).map((opt) => (
      <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="radio"
          checked={value === opt}
          onChange={() => onChange(opt)}
          className="h-4 w-4 accent-primary"
        />
        {opt}
      </label>
    ))}
  </div>
);

export interface AddHoTransferProps {
  onClose: () => void;
  onSave?: (data: HoTransferFormData) => void;
  titleEn?: string;
  titleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  headerIcon?: React.ReactNode;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddHoTransfer = ({
  onClose,
  onSave,
  titleEn = "HO Transfer",
  titleHi = "HO हस्तांतरण",
  subtitleEn = "Fill in the HO transfer entry details below.",
  subtitleHi = "खालील HO हस्तांतरण तपशील भरा.",
  headerIcon = <Image src={IMAGES.TRANSFER} alt="HO Transfer" width={50} height={50} />,
  variant = "modal",
}: AddHoTransferProps) => {
  const [form, setForm] = useState<HoTransferFormData>(DEFAULT_HO_TRANSFER_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof HoTransferFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid3 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  const handlePlaceholderAction = (label: string) => {
    toast.info(`${label} will be implemented.`);
  };

  const markDirty = (field: keyof HoTransferFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof HoTransferFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Handle customer selection from picklist
  const handleCustomerSelect = (customer: CustomerOption) => {
    markDirty("customerId");
    markDirty("customerName");
    setForm((f) => ({
      ...f,
      customerId: customer.customerId,
      customerName: customer.customerName,
    }));
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
      return updated as unknown as HoTransferFormData;
    });
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors = validateHoTransfer(form);
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
    await saveHoTransfer(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_HO_TRANSFER_DATA);
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
        title="HO Transfer Saved Successfully"
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

      <div className="relative">
        <div className="absolute right-6 top-6 z-10">
          <button
            type="button"
            onClick={() => handlePlaceholderAction("Go To")}
            className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Goto <Check size={16} />
          </button>
        </div>

        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Search and verify the account before processing the HO transfer."
          subtitleHi="HO हस्तांतरण करण्यापूर्वी खात्याची माहिती तपासा."
          icon={<SectionIcon />}
        >
          <div className={`${grid3} mt-2`}>
            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required error={errors.scrollNumber}>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput
                    icon={<Hash size={16} />}
                    value={form.scrollNumber}
                    onChange={(v) => updateField("scrollNumber", v)}
                    placeholder="Enter Scroll Number"
                    error={errors.scrollNumber}
                  />
                </div>
                <LookupTrigger onClick={() => setActivePicker("scrollNumber")} />
              </div>
            </FieldShell>

            <FieldShell label="SubScroll No" labelHi="सब स्क्रोल क्रमांक" required error={errors.subScrollNo}>
              <TextInput
                icon={<Hash size={16} />}
                value={form.subScrollNo}
                onChange={(v) => updateField("subScrollNo", v)}
                placeholder="Enter SubScroll No"
                error={errors.subScrollNo}
              />
            </FieldShell>

            <FieldShell label="Debit Amount" labelHi="नावे रक्कम" error={errors.debitAmount}>
              <TextInput icon={<IndianRupee size={16} />} value={form.debitAmount} onChange={() => {}} readOnly error={errors.debitAmount} />
            </FieldShell>

            <FieldShell label="Credit Amount" labelHi="जमा रक्कम" error={errors.creditAmount}>
              <TextInput icon={<IndianRupee size={16} />} value={form.creditAmount} onChange={() => {}} readOnly error={errors.creditAmount} />
            </FieldShell>

            <FieldShell label="Debit / Credit" labelHi="नावे / जमा">
              <RadioDebitCredit
                value={form.debitCreditMode}
                onChange={(v) => {
                  markDirty("debitCreditMode");
                  setForm((f) => ({ ...f, debitCreditMode: v }));
                }}
              />
            </FieldShell>

            <FieldShell label="Last Transaction Date" labelHi="शेवटची व्यवहार तारीख" error={errors.lastTransactionDate}>
              <DateInput value={form.lastTransactionDate} onChange={() => {}} readOnly error={errors.lastTransactionDate} />
            </FieldShell>

            <FieldShell label="Unclear Balance" labelHi="अस्पष्ट शिल्लक" error={errors.unclearBalance}>
              <TextInput icon={<IndianRupee size={16} />} value={form.unclearBalance} onChange={() => {}} readOnly error={errors.unclearBalance} />
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

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required error={errors.accountName}>
              <TextInput icon={<User size={16} />} value={form.accountName} onChange={() => {}} readOnly error={errors.accountName} />
            </FieldShell>

            <FieldShell label="GLAccount Code" labelHi="जीएल खाते कोड" required error={errors.glAccountCode}>
              <TextInput icon={<Landmark size={16} />} value={form.glAccountCode} onChange={() => {}} readOnly error={errors.glAccountCode} />
            </FieldShell>

            <FieldShell label="GLAccount Name" labelHi="जीएल खात्याचे नाव" required error={errors.glAccountName}>
              <TextInput icon={<User size={16} />} value={form.glAccountName} onChange={() => {}} readOnly error={errors.glAccountName} />
            </FieldShell>

            <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={errors.customerId}>
              <CustomerIdPicklistField
                label=""
                value={form.customerId}
                placeholder="Select Customer"
                onSelect={handleCustomerSelect}
                preFetch={false}
                pageSize={10}
                error={errors.customerId ? "This field is required" : ""}
              />
            </FieldShell>

            <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required error={errors.customerName}>
              <TextInput icon={<User size={16} />} value={form.customerName} onChange={() => {}} readOnly error={errors.customerName} />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" error={errors.ledgerBalance}>
              <TextInput icon={<IndianRupee size={16} />} value={form.ledgerBalance} onChange={() => {}} readOnly error={errors.ledgerBalance} />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" error={errors.availableBalance}>
              <TextInput icon={<IndianRupee size={16} />} value={form.availableBalance} onChange={() => {}} readOnly error={errors.availableBalance} />
            </FieldShell>

            <FieldShell label="New Ledger Bal." labelHi="नवीन खातेवही शिल्लक" error={errors.newLedgerBalance}>
              <TextInput icon={<IndianRupee size={16} />} value={form.newLedgerBalance} onChange={() => {}} readOnly error={errors.newLedgerBalance} />
            </FieldShell>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => handlePlaceholderAction("Check Account")}
              className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
            >
              <Search size={16} /> Check Account
            </button>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        titleEn="Transaction Details"
        titleHi="व्यवहाराचा तपशील"
        subtitleEn="Enter the transfer amount and outlist related information."
        subtitleHi="हस्तांतरण रक्कम व आऊटलिस्ट संबंधित माहिती प्रविष्ट करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid3} mt-2`}>
          <FieldShell label="Outlist Serial" labelHi="आऊटलिस्ट अनुक्रमांक" required error={errors.outlistSerial}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.outlistSerial}
                  onChange={(v) => updateField("outlistSerial", v)}
                  placeholder="Enter Outlist Serial"
                  error={errors.outlistSerial}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("outlistSerial")} />
            </div>
          </FieldShell>

          <FieldShell label="GL Outlist Desc" labelHi="जीएल आऊटलिस्ट वर्णन" required error={errors.glOutlistDesc}>
            <TextInput icon={<FileText size={16} />} value={form.glOutlistDesc} onChange={() => {}} readOnly error={errors.glOutlistDesc} />
          </FieldShell>

          <FieldShell label="GL OutList Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required error={errors.glOutListDocNo}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.glOutListDocNo}
              onChange={(v) => updateField("glOutListDocNo", v)}
              placeholder="Enter GL OutList Doc No"
              error={errors.glOutListDocNo}
            />
          </FieldShell>

          <FieldShell label="Original / Responding" labelHi="मूळ / प्रतिसाद">
            <RadioOriginalResponding
              value={form.originalResponding}
              onChange={(v) => {
                markDirty("originalResponding");
                setForm((f) => ({ ...f, originalResponding: v }));
              }}
            />
          </FieldShell>

          <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required error={errors.adviceNumber}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.adviceNumber}
                  onChange={(v) => updateField("adviceNumber", v)}
                  placeholder="Enter Advice Number"
                  error={errors.adviceNumber}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("adviceNumber")} />
            </div>
          </FieldShell>

          <FieldShell label="Advice Date" labelHi="सल्ला तारीख" required error={errors.adviceDate}>
            <DateInput value={form.adviceDate} onChange={() => {}} readOnly error={errors.adviceDate} />
          </FieldShell>

          <FieldShell label="Amount" labelHi="रक्कम" required error={errors.amount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.amount}
              onChange={(v) => updateField("amount", v)}
              placeholder="Enter Amount"
              error={errors.amount}
            />
          </FieldShell>

          <FieldShell label="Particular" labelHi="तपशील" required error={errors.particular}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.particular}
              onChange={(v) => updateField("particular", v)}
              placeholder="Enter Particular"
              error={errors.particular}
            />
          </FieldShell>

          <FieldShell label="Instrument Type" labelHi="साधन प्रकार" required error={errors.instrumentType}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.instrumentType}
                  onChange={(v) => updateField("instrumentType", v)}
                  placeholder="Enter Instrument Type"
                  error={errors.instrumentType}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("instrumentType")} />
            </div>
          </FieldShell>

          <FieldShell label="Instrument Number" labelHi="साधन क्रमांक" required error={errors.instrumentNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.instrumentNumber}
              onChange={(v) => updateField("instrumentNumber", v)}
              placeholder="Enter Instrument Number"
              error={errors.instrumentNumber}
            />
          </FieldShell>

          <FieldShell label="Instrument Date" labelHi="साधन तारीख" required error={errors.instrumentDate}>
            <DateInput
              value={form.instrumentDate}
              onChange={(v) => updateField("instrumentDate", v)}
              error={errors.instrumentDate}
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
          onClick={() => handlePlaceholderAction("Display Signature")}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Display Signature
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Display Photo")}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Display Photo
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("First")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          First
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Previous")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Next")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Last")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Last
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Delete")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Modify")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Modify
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Details")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Details
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

export default AddHoTransfer;