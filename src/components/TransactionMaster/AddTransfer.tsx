import { useState } from "react";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import {
  User,
  CreditCard,
  IndianRupee,
  FileText,
  Hash,
  MoreVertical,
  Check,
  ChevronsDown,
  X,
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

const TRANSACTION_TYPE_OPTIONS = ["Credit", "Debit"];

type PickRow = { code: string; name: string };

const SCROLL_LIST: PickRow[] = [
  { code: "SCR-2026-001", name: "Fund Transfer Scroll" },
  { code: "SCR-2026-002", name: "Cash Transfer Scroll" },
];

const ACCOUNT_TYPE_LIST: PickRow[] = [
  { code: "TD", name: "Term Deposit" },
  { code: "SB", name: "Savings" },
  { code: "CA", name: "Current" },
];

const ACCOUNT_PICK_LIST: PickRow[] = [
  { code: "401", name: "Gaveshvarmath Om Sadashiv" },
  { code: "402", name: "Akshay Om More" },
  { code: "403", name: "Priya Sharma" },
];

const OUTLIST_SERIAL_LIST: PickRow[] = [
  { code: "12", name: "Fund Transfer Outlist" },
  { code: "13", name: "Cash Transfer Outlist" },
];

const CHEQUE_TYPE_LIST: PickRow[] = [
  { code: "CHEQUE", name: "Cheque" },
  { code: "DD", name: "Demand Draft" },
];

type PickerStringField = "scrollNumber" | "accountType" | "accountCode" | "accountName" | "outlistSerial" | "chequeType";
type PickerField = "scrollNumber" | "accountType" | "accountCode" | "outlistSerial" | "chequeType";

const PICKER_CONFIG: Record<
  PickerField,
  { title: string; codeField: PickerStringField; nameField?: PickerStringField; codeLabel: string; nameLabel: string; rows: PickRow[] }
> = {
  scrollNumber: { title: "Scroll List", codeField: "scrollNumber", codeLabel: "Scroll No", nameLabel: "Description", rows: SCROLL_LIST },
  accountType: { title: "Account Type List", codeField: "accountType", codeLabel: "Code", nameLabel: "Account Type", rows: ACCOUNT_TYPE_LIST },
  accountCode: { title: "Account List", codeField: "accountCode", nameField: "accountName", codeLabel: "Account Code", nameLabel: "Name", rows: ACCOUNT_PICK_LIST },
  outlistSerial: { title: "Outlist Serial List", codeField: "outlistSerial", codeLabel: "Code", nameLabel: "Description", rows: OUTLIST_SERIAL_LIST },
  chequeType: { title: "Cheque Type List", codeField: "chequeType", codeLabel: "Code", nameLabel: "Cheque Type", rows: CHEQUE_TYPE_LIST },
};

export interface TransferFormData {
  // Section 1 — Scroll Details
  scrollNumber: string;
  subScrollNo: string;
  debitAmount: string;
  creditAmount: string;
  unclearedBalance: string;

  // Section 2 — Account Details
  accountType: string;
  description: string;
  accountCode: string;
  accountName: string;
  glAccountCode: string;
  glAccountName: string;
  customerId: string;
  accountReviewDate: string;
  lastTransactionDate: string;
  ledgerBalance: string;
  availableBalance: string;
  newLedgerBalance: string;
  limitAmount: string;
  drawingPower: string;

  // Section 3 — Payment & Instrument Details
  transactionType: string;
  transactionAmount: string;
  transactionAmountInWords: string;
  outlistSerial: string;
  descriptionPayment: string;
  glOutListDocNo: string;
  chequeBookStatus: string;
  chequeType: string;
  chequeSeries: string;
  chequeNumber: string;
  chequeDate: string;
  adviceNumber: string;
  originalResponding: string;
  particular: string;
}

/** Reusable dummy data — read-only fields are pre-filled (system data), the
 * remaining fields start blank since they're entered fresh per transaction. */
export const DEFAULT_TRANSFER_DATA: TransferFormData = {
  scrollNumber: "",
  subScrollNo: "",
  debitAmount: "250000",
  creditAmount: "250000",
  unclearedBalance: "0",

  accountType: "",
  description: "Fund Transfer",
  accountCode: "",
  accountName: "Gaveshvarmath Om Sadashiv",
  glAccountCode: "8001",
  glAccountName: "Transfer GL",
  customerId: "25375",
  accountReviewDate: "2026-05-20",
  lastTransactionDate: "2026-05-10",
  ledgerBalance: "250000",
  availableBalance: "250000",
  newLedgerBalance: "250000",
  limitAmount: "500000",
  drawingPower: "500000",

  transactionType: "Credit",
  transactionAmount: "",
  transactionAmountInWords: "Two Lakh Fifty Thousand Only",
  outlistSerial: "",
  descriptionPayment: "",
  glOutListDocNo: "",
  chequeBookStatus: "Issued",
  chequeType: "",
  chequeSeries: "CHEQUE",
  chequeNumber: "",
  chequeDate: "",
  adviceNumber: "12",
  originalResponding: "Original",
  particular: "",
};

const TEXT_FIELD_KEYS: (keyof TransferFormData)[] = [
  "scrollNumber",
  "subScrollNo",
  "debitAmount",
  "creditAmount",
  "unclearedBalance",
  "accountType",
  "description",
  "accountCode",
  "accountName",
  "glAccountCode",
  "glAccountName",
  "customerId",
  "accountReviewDate",
  "lastTransactionDate",
  "ledgerBalance",
  "availableBalance",
  "newLedgerBalance",
  "limitAmount",
  "drawingPower",
  "transactionType",
  "transactionAmount",
  "transactionAmountInWords",
  "outlistSerial",
  "descriptionPayment",
  "glOutListDocNo",
  "chequeBookStatus",
  "chequeType",
  "chequeSeries",
  "chequeNumber",
  "chequeDate",
  "adviceNumber",
  "originalResponding",
  "particular",
];

/** Same validation approach used by Transaction Master's sibling forms. */
const validateTransfer = (
  data: TransferFormData
): Record<keyof TransferFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof TransferFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  return errors;
};

/** Simulated save — no backend yet. */
const saveTransfer = (data: TransferFormData) =>
  new Promise<TransferFormData>((resolve) => setTimeout(() => resolve(data), 600));

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

export interface AddTransferProps {
  onClose: () => void;
  onSave?: (data: TransferFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddTransfer = ({ onClose, onSave, variant = "modal" }: AddTransferProps) => {
  const [form, setForm] = useState<TransferFormData>(DEFAULT_TRANSFER_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TransferFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const handlePlaceholderAction = (label: string) => {
    toast.info(`${label} will be implemented.`);
  };

  const markDirty = (field: keyof TransferFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof TransferFormData, value: string) => {
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
      return updated as unknown as TransferFormData;
    });
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors = validateTransfer(form);
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
    await saveTransfer(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_TRANSFER_DATA);
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
        title="Transfer Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Transfer"
      titleHi="हस्तांतरण"
      subtitleEn="All Information's are related to Interest Payment Mark."
      subtitleHi="सर्व माहिती व्याज भरण्याच्या मार्कशी संबंधित आहे."
      headerIcon={<Image src="/Transfer.png" alt="Transfer" width={50} height={50} />}
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
            Go To <Check size={16} />
          </button>
        </div>

        <SectionCard
          titleEn="Scroll Details"
          titleHi="स्क्रोल तपशील"
          subtitleEn="Select the transaction type and identify the scroll before processing the transaction."
          subtitleHi="व्यवहार सुरू करण्यापूर्वी स्क्रोल व व्यवहाराचा प्रकार निवडा."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Scroll Number" labelHi="" required error={errors.scrollNumber}>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput
                    icon={<Hash size={16} />}
                    value={form.scrollNumber}
                    onChange={(v) => updateField("scrollNumber", v)}
                    placeholder="Select Scroll Number"
                    error={errors.scrollNumber}
                  />
                </div>
                <LookupTrigger onClick={() => setActivePicker("scrollNumber")} />
              </div>
            </FieldShell>

            <FieldShell label="Sub Scroll No" labelHi="" required error={errors.subScrollNo}>
              <TextInput
                icon={<Hash size={16} />}
                value={form.subScrollNo}
                onChange={(v) => updateField("subScrollNo", v)}
                placeholder="Enter Sub Scroll No"
                error={errors.subScrollNo}
              />
            </FieldShell>

            <FieldShell label="Debit Amount" labelHi="" required error={errors.debitAmount}>
              <TextInput icon={<IndianRupee size={16} />} value={form.debitAmount} onChange={() => {}} readOnly error={errors.debitAmount} />
            </FieldShell>

            <FieldShell label="Credit Amount" labelHi="" required error={errors.creditAmount}>
              <TextInput icon={<IndianRupee size={16} />} value={form.creditAmount} onChange={() => {}} readOnly error={errors.creditAmount} />
            </FieldShell>

            <FieldShell label="Uncleared Balance" labelHi="" required error={errors.unclearedBalance}>
              <TextInput icon={<IndianRupee size={16} />} value={form.unclearedBalance} onChange={() => {}} readOnly error={errors.unclearedBalance} />
            </FieldShell>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        titleEn="Account Details"
        titleHi="खाते तपशील"
        subtitleEn="Search and verify the customer's account before initiating the transfer."
        subtitleHi="हस्तांतरणापूर्वी खात्याची माहिती तपासा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Account Type" labelHi="" required error={errors.accountType}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.accountType}
                  onChange={(v) => updateField("accountType", v)}
                  placeholder="Select Account Type"
                  error={errors.accountType}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("accountType")} />
            </div>
          </FieldShell>

          <FieldShell label="Description" labelHi="" required error={errors.description}>
            <TextInput icon={<FileText size={16} />} value={form.description} onChange={() => {}} readOnly error={errors.description} />
          </FieldShell>

          <FieldShell label="Account Code" labelHi="" required error={errors.accountCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.accountCode}
                  onChange={(v) => updateField("accountCode", v)}
                  placeholder="Select Account Code"
                  error={errors.accountCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("accountCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Account Name" labelHi="" required error={errors.accountName}>
            <TextInput icon={<User size={16} />} value={form.accountName} onChange={() => {}} readOnly error={errors.accountName} />
          </FieldShell>

          <FieldShell label="GL Account Code" labelHi="" required error={errors.glAccountCode}>
            <TextInput icon={<CreditCard size={16} />} value={form.glAccountCode} onChange={() => {}} readOnly error={errors.glAccountCode} />
          </FieldShell>

          <FieldShell label="GL Account Name" labelHi="" required error={errors.glAccountName}>
            <TextInput icon={<User size={16} />} value={form.glAccountName} onChange={() => {}} readOnly error={errors.glAccountName} />
          </FieldShell>

          <FieldShell label="Customer ID" labelHi="" required error={errors.customerId}>
            <TextInput icon={<Hash size={16} />} value={form.customerId} onChange={() => {}} readOnly error={errors.customerId} />
          </FieldShell>

          <FieldShell label="Account Review Date" labelHi="" required error={errors.accountReviewDate}>
            <DateInput value={form.accountReviewDate} onChange={() => {}} readOnly error={errors.accountReviewDate} />
          </FieldShell>

          <FieldShell label="Last Transaction Date" labelHi="" required error={errors.lastTransactionDate}>
            <DateInput value={form.lastTransactionDate} onChange={() => {}} readOnly error={errors.lastTransactionDate} />
          </FieldShell>

          <FieldShell label="Ledger Balance" labelHi="खाते शिल्ल" required error={errors.ledgerBalance}>
            <TextInput icon={<IndianRupee size={16} />} value={form.ledgerBalance} onChange={() => {}} readOnly error={errors.ledgerBalance} />
          </FieldShell>

          <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required error={errors.availableBalance}>
            <TextInput icon={<IndianRupee size={16} />} value={form.availableBalance} onChange={() => {}} readOnly error={errors.availableBalance} />
          </FieldShell>

          <FieldShell label="New Ledger Balance" labelHi="नवीन खाते शिल्लक" required error={errors.newLedgerBalance}>
            <TextInput icon={<IndianRupee size={16} />} value={form.newLedgerBalance} onChange={() => {}} readOnly error={errors.newLedgerBalance} />
          </FieldShell>

          <FieldShell label="Limit Amount" labelHi="" required error={errors.limitAmount}>
            <TextInput icon={<IndianRupee size={16} />} value={form.limitAmount} onChange={() => {}} readOnly error={errors.limitAmount} />
          </FieldShell>

          <FieldShell label="Drawing Power" labelHi="" required error={errors.drawingPower}>
            <TextInput icon={<IndianRupee size={16} />} value={form.drawingPower} onChange={() => {}} readOnly error={errors.drawingPower} />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Payment & Instrument Details"
        titleHi="पेमेंट व साधन तपशील"
        subtitleEn="Enter payment narration and cheque or instrument details if applicable."
        subtitleHi="पेमेंट व धनादेशाची माहिती भरा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Transaction Type" labelHi="" required error={errors.transactionType}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.transactionType}
              onChange={(v) => updateField("transactionType", v)}
              options={TRANSACTION_TYPE_OPTIONS}
              placeholder="Select Transaction Type"
              error={errors.transactionType}
            />
          </FieldShell>

          <FieldShell label="Transaction Amount" labelHi="" required error={errors.transactionAmount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.transactionAmount}
              onChange={(v) => updateField("transactionAmount", v)}
              placeholder="Enter Transaction Amount"
              error={errors.transactionAmount}
            />
          </FieldShell>

          <FieldShell label="Transaction Amount in words" labelHi="" required error={errors.transactionAmountInWords}>
            <TextInput icon={<User size={16} />} value={form.transactionAmountInWords} onChange={() => {}} readOnly error={errors.transactionAmountInWords} />
          </FieldShell>

          <FieldShell label="Outlist Serial" labelHi="जीएल आउटलिस्ट क्रमांक" required error={errors.outlistSerial}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.outlistSerial}
                  onChange={(v) => updateField("outlistSerial", v)}
                  placeholder="Placeholder text"
                  error={errors.outlistSerial}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("outlistSerial")} />
            </div>
          </FieldShell>

          <FieldShell label="Description" labelHi="" required error={errors.descriptionPayment}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.descriptionPayment}
              onChange={(v) => updateField("descriptionPayment", v)}
              placeholder="Enter Description"
              error={errors.descriptionPayment}
            />
          </FieldShell>

          <FieldShell label="GL Out List Doc No" labelHi="GL दस्तऐव..." required error={errors.glOutListDocNo}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.glOutListDocNo}
              onChange={(v) => updateField("glOutListDocNo", v)}
              placeholder="Placeholder text"
              error={errors.glOutListDocNo}
            />
          </FieldShell>

          <FieldShell label="Cheque Book Status" labelHi="" required error={errors.chequeBookStatus}>
            <TextInput icon={<User size={16} />} value={form.chequeBookStatus} onChange={() => {}} readOnly error={errors.chequeBookStatus} />
          </FieldShell>

          <FieldShell label="Cheque Type" labelHi="" required error={errors.chequeType}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<FileText size={16} />}
                  value={form.chequeType}
                  onChange={(v) => updateField("chequeType", v)}
                  placeholder="Enter Out list Description"
                  error={errors.chequeType}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("chequeType")} />
            </div>
          </FieldShell>

          <FieldShell label="Cheque Series" labelHi="" required error={errors.chequeSeries}>
            <TextInput icon={<FileText size={16} />} value={form.chequeSeries} onChange={() => {}} readOnly error={errors.chequeSeries} />
          </FieldShell>

          <FieldShell label="Cheque Number" labelHi="" required error={errors.chequeNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.chequeNumber}
              onChange={(v) => updateField("chequeNumber", v)}
              placeholder="Enter Cheque Number"
              error={errors.chequeNumber}
            />
          </FieldShell>

          <FieldShell label="Cheque Date" labelHi="" required error={errors.chequeDate}>
            <DateInput value={form.chequeDate} onChange={(v) => updateField("chequeDate", v)} error={errors.chequeDate} />
          </FieldShell>

          <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required error={errors.adviceNumber}>
            <TextInput icon={<Hash size={16} />} value={form.adviceNumber} onChange={() => {}} readOnly error={errors.adviceNumber} />
          </FieldShell>

          <FieldShell label="Original / Responding" labelHi="मूळ / प्रतिसाद" required error={errors.originalResponding}>
            <TextInput icon={<User size={16} />} value={form.originalResponding} onChange={() => {}} readOnly error={errors.originalResponding} />
          </FieldShell>

          <FieldShell label="Particular" labelHi="" required error={errors.particular}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.particular}
              onChange={(v) => updateField("particular", v)}
              placeholder="Enter Narration"
              error={errors.particular}
            />
          </FieldShell>
        </div>
      </SectionCard>

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
          onClick={() => handlePlaceholderAction("Display Photo")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Display Photo
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Display Signature")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Display Signature
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Print Voucher")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Print Voucher
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValidated || isSaving}
          className={`flex items-center gap-1.5 rounded-lg border border-transparent bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary transition-colors ${
            isValidated && !isSaving ? "hover:bg-primary-200" : "cursor-not-allowed opacity-60"
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

export default AddTransfer;
