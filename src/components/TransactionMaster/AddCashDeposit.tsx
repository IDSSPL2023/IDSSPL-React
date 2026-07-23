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
  IdCard,
  Fingerprint,
  Phone,
  Landmark,
  MoreVertical,
  Check,
  X,
  ChevronsDown,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  DateInput,
  SectionCard,
  RadioYesNo,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import { useBilingual } from "@/i18n/useBilingual";

type PickRow = { code: string; name: string };

/** Same pick-list shape as Transaction Master's account lookup (Code + Name). */
const ACCOUNT_TYPE_LIST: PickRow[] = [
  { code: "SB", name: "Savings" },
  { code: "CA", name: "Current" },
  { code: "TD", name: "Term Deposit" },
];

const ACCOUNT_PICK_LIST: PickRow[] = [
  { code: "000245", name: "DEVARADDI MALLANAGOUD" },
  { code: "000246", name: "AKSHAY OM MORE" },
  { code: "000247", name: "PRIYA SHARMA" },
];

const AGENT_PICK_LIST: PickRow[] = [
  { code: "10025", name: "Ramesh Kulkarni" },
  { code: "10026", name: "Suresh Patil" },
];

const OUTLIST_SERIAL_LIST: PickRow[] = [
  { code: "25", name: "Cash Deposit Outlist" },
  { code: "26", name: "Pigmy Collection Outlist" },
];

const ADVICE_LIST: PickRow[] = [
  { code: "ADV2026", name: "Cash Deposit Advice - May 2026" },
  { code: "ADV2027", name: "Cash Deposit Advice - Jun 2026" },
];

type PickerStringField = "accountType" | "accountCode" | "accountName" | "agentId" | "outlistSerial" | "adviceNumber";
type PickerField = "accountType" | "accountCode" | "agentId" | "outlistSerial" | "adviceNumber";

const PICKER_CONFIG: Record<
  PickerField,
  { title: string; codeField: PickerStringField; nameField?: PickerStringField; codeLabel: string; nameLabel: string; rows: PickRow[] }
> = {
  accountType: { title: "Account Type List", codeField: "accountType", codeLabel: "Code", nameLabel: "Account Type", rows: ACCOUNT_TYPE_LIST },
  accountCode: { title: "Account List", codeField: "accountCode", nameField: "accountName", codeLabel: "Account Code", nameLabel: "Name", rows: ACCOUNT_PICK_LIST },
  agentId: { title: "Agent List", codeField: "agentId", codeLabel: "Agent ID", nameLabel: "Name", rows: AGENT_PICK_LIST },
  outlistSerial: { title: "Outlist Serial List", codeField: "outlistSerial", codeLabel: "Serial No", nameLabel: "Description", rows: OUTLIST_SERIAL_LIST },
  adviceNumber: { title: "Advice List", codeField: "adviceNumber", codeLabel: "Advice No", nameLabel: "Description", rows: ADVICE_LIST },
};

export interface CashDepositFormData {
  // Section 1 — Account Details
  isHoTransaction: boolean;
  accountType: string;
  accountCode: string;
  accountName: string;
  glAccountCode: string;
  glAccountName: string;
  lastTransactionDate: string;
  accountReviewDate: string;
  ledgerBalance: string;
  availableBalance: string;
  newLedgerBalance: string;
  unclearedBalance: string;
  limitAmount: string;
  drawingPower: string;
  lastOdDate: string;
  odInterest: string;
  panCardNumber: string;
  aadhaarNumber: string;
  mobileNumber: string;

  // Section 2 — Transaction Details
  amount: string;
  amountInWords: string;
  isPigmyCollection: boolean;
  agentId: string;
  originalResponding: "Original" | "Responding";
  outlistSerial: string;
  description: string;
  glOutListDocNo: string;
  adviceNumber: string;
  adviceDate: string;
  particular: string;
}

/** Reusable dummy data — used to prefill the form on open (backend not ready). */
export const DEFAULT_CASH_DEPOSIT_DATA: CashDepositFormData = {
  isHoTransaction: false,
  accountType: "Savings",
  accountCode: "000245",
  accountName: "DEVARADDI MALLANAGOUD",
  glAccountCode: "401",
  glAccountName: "Cash GL",
  lastTransactionDate: "2026-05-20",
  accountReviewDate: "2026-05-20",
  ledgerBalance: "250000",
  availableBalance: "250000",
  newLedgerBalance: "255000",
  unclearedBalance: "5000",
  limitAmount: "500000",
  drawingPower: "350000",
  lastOdDate: "2026-05-20",
  odInterest: "0",
  panCardNumber: "ABCDE1234F",
  aadhaarNumber: "123456789012",
  mobileNumber: "9876543210",

  amount: "5000",
  amountInWords: "Five Thousand Rupees Only",
  isPigmyCollection: false,
  agentId: "10025",
  originalResponding: "Original",
  outlistSerial: "25",
  description: "Cash Deposit",
  glOutListDocNo: "DOC1025",
  adviceNumber: "ADV2026",
  adviceDate: "2026-05-20",
  particular: "Cash Deposit Transaction",
};

const TEXT_FIELD_KEYS: (keyof CashDepositFormData)[] = [
  "accountType",
  "accountCode",
  "accountName",
  "glAccountCode",
  "glAccountName",
  "lastTransactionDate",
  "accountReviewDate",
  "ledgerBalance",
  "availableBalance",
  "newLedgerBalance",
  "unclearedBalance",
  "limitAmount",
  "drawingPower",
  "lastOdDate",
  "odInterest",
  "panCardNumber",
  "aadhaarNumber",
  "mobileNumber",
  "amount",
  "amountInWords",
  "agentId",
  "outlistSerial",
  "description",
  "glOutListDocNo",
  "adviceNumber",
  "adviceDate",
  "particular",
];

/** Same validation approach used by Transaction Master's sibling forms (TL Disbursement, TD Interest Payment). */
const validateCashDeposit = (data: CashDepositFormData): Record<keyof CashDepositFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof CashDepositFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  errors.isHoTransaction = false;
  errors.isPigmyCollection = false;
  errors.originalResponding = false;
  return errors;
};

/** Simulated save — no backend yet. */
const saveCashDeposit = (data: CashDepositFormData) =>
  new Promise<CashDepositFormData>((resolve) => setTimeout(() => resolve(data), 600));

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

const RadioOriginalResponding = ({
  value,
  onChange,
}: {
  value: "Original" | "Responding";
  onChange: (v: "Original" | "Responding") => void;
}) => (
  <div className="last:mb-0 flex items-center gap-2">
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
  </div>
);

export interface AddCashDepositProps {
  onClose: () => void;
  onSave?: (data: CashDepositFormData) => void;
  titleEn?: string;
  titleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  headerIcon?: React.ReactNode;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddCashDeposit = ({
  onClose,
  onSave,
  titleEn,
  titleHi,
  subtitleEn,
  subtitleHi,
  headerIcon = <Image src={IMAGES.CASH_DEPOSIT} alt="Cash Deposit" width={50} height={50} />,
  variant = "modal",
}: AddCashDepositProps) => {
  const { en, t } = useBilingual();
  const resolvedTitleEn = titleEn ?? en("cashDeposit.title");
  const resolvedTitleHi = titleHi ?? t("cashDeposit.title");
  const resolvedSubtitleEn = subtitleEn ?? en("cashDeposit.subtitle");
  const resolvedSubtitleHi = subtitleHi ?? t("cashDeposit.subtitle");
  const [form, setForm] = useState<CashDepositFormData>(DEFAULT_CASH_DEPOSIT_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CashDepositFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid4 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  const handlePlaceholderAction = (label: string) => {
    toast.info(`${label} will be implemented.`);
  };

  const markDirty = (field: keyof CashDepositFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof CashDepositFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const updateBoolField = (field: "isHoTransaction" | "isPigmyCollection", value: boolean) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handlePickRow = (row: PickRow) => {
    if (!activePicker) return;
    const { codeField, nameField } = PICKER_CONFIG[activePicker];
    markDirty(codeField);
    if (nameField) markDirty(nameField);
    setForm((f) => {
      const updated: Record<string, string | boolean> = { ...f };
      updated[codeField] = row.code;
      if (nameField) updated[nameField] = row.name;
      return updated as unknown as CashDepositFormData;
    });
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors = validateCashDeposit(form);
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
    await saveCashDeposit(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_CASH_DEPOSIT_DATA);
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
        title="Cash Deposit Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn={resolvedTitleEn}
      titleHi={resolvedTitleHi}
      subtitleEn={resolvedSubtitleEn}
      subtitleHi={resolvedSubtitleHi}
      headerIcon={headerIcon}
      tabs={[]}
      activeTab=""
      onTabChange={() => { }}
      hideFooter
      variant={variant}
    >
      <SectionCard
        titleEn="Account Details"
        titleHi="खाते तपशील"
        subtitleEn="Search and verify the account before processing the cash deposit."
        subtitleHi="रोख रक्कम जमा करण्यापूर्वी खात्याची माहिती तपासा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>


          <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required error={errors.accountType}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.accountType}
                  onChange={(v) => updateField("accountType", v)}
                  placeholder="Enter Account Type"
                  error={errors.accountType}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("accountType")} />
            </div>
          </FieldShell>
          <FieldShell
            label="Account Description"
            labelHi="खाते वर्णन"
            required
            error={errors.accountName}
          >
            <TextInput
              icon={<FileText size={16} />}
              value={form.accountName}
              onChange={() => { }}
              readOnly
              error={errors.accountName}
            />
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
            <TextInput icon={<User size={16} />} value={form.accountName} onChange={() => { }} readOnly error={errors.accountName} />
          </FieldShell>

          <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required error={errors.glAccountCode}>
            <TextInput icon={<Landmark size={16} />} value={form.glAccountCode} onChange={() => { }} readOnly error={errors.glAccountCode} />
          </FieldShell>

          <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required error={errors.glAccountName}>
            <TextInput icon={<User size={16} />} value={form.glAccountName} onChange={() => { }} readOnly error={errors.glAccountName} />
          </FieldShell>

          <FieldShell label="Last Transaction Date" labelHi="शेवटची व्यवहार तारीख" required error={errors.lastTransactionDate}>
            <DateInput value={form.lastTransactionDate} onChange={() => { }} readOnly error={errors.lastTransactionDate} />
          </FieldShell>

          <FieldShell label="Account Review Date" labelHi="खाते पुनरावलोकन तारीख" required error={errors.accountReviewDate}>
            <DateInput value={form.accountReviewDate} onChange={() => { }} readOnly error={errors.accountReviewDate} />
          </FieldShell>

          <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required error={errors.ledgerBalance}>
            <TextInput icon={<IndianRupee size={16} />} value={form.ledgerBalance} onChange={() => { }} readOnly error={errors.ledgerBalance} />
          </FieldShell>

          <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required error={errors.availableBalance}>
            <TextInput icon={<IndianRupee size={16} />} value={form.availableBalance} onChange={() => { }} readOnly error={errors.availableBalance} />
          </FieldShell>

          <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required error={errors.newLedgerBalance}>
            <TextInput icon={<IndianRupee size={16} />} value={form.newLedgerBalance} onChange={() => { }} readOnly error={errors.newLedgerBalance} />
          </FieldShell>

          <FieldShell label="Uncleared Balance" labelHi="अस्पष्ट शिल्लक" required error={errors.unclearedBalance}>
            <TextInput icon={<IndianRupee size={16} />} value={form.unclearedBalance} onChange={() => { }} readOnly error={errors.unclearedBalance} />
          </FieldShell>

          <FieldShell label="Limit Amount" labelHi="मर्यादा रक्कम" required error={errors.limitAmount}>
            <TextInput icon={<IndianRupee size={16} />} value={form.limitAmount} onChange={() => { }} readOnly error={errors.limitAmount} />
          </FieldShell>

          <FieldShell label="Drawing Power" labelHi="कर्ज उचलण्याची क्षमता" required error={errors.drawingPower}>
            <TextInput icon={<IndianRupee size={16} />} value={form.drawingPower} onChange={() => { }} readOnly error={errors.drawingPower} />
          </FieldShell>

          <FieldShell label="PAN Card Number" labelHi="पॅन कार्ड क्रमांक" required error={errors.panCardNumber}>
            <TextInput icon={<IdCard size={16} />} value={form.panCardNumber} onChange={() => { }} readOnly error={errors.panCardNumber} />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Transaction Details"
        titleHi="व्यवहाराचा तपशील"
        subtitleEn="Enter the deposit amount and outlist related information."
        subtitleHi="जमा रक्कम व आऊटलिस्ट संबंधित माहिती प्रविष्ट करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Amount" labelHi="रक्कम" required error={errors.amount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.amount}
              onChange={(v) => updateField("amount", v)}
              placeholder="Enter Amount"
              error={errors.amount}
            />
          </FieldShell>

          <FieldShell label="Amount in Words" labelHi="शब्दात रक्कम" required error={errors.amountInWords}>
            <TextInput icon={<FileText size={16} />} value={form.amountInWords} onChange={() => { }} readOnly error={errors.amountInWords} />
          </FieldShell>

          <FieldShell label="Is Pigmy Collection" labelHi="पिग्मी संकलन आहे का" required error={errors.isPigmyCollection}>
            <RadioYesNo
              label=""
              labelHi=""
              value={form.isPigmyCollection}
              onChange={(v) => updateBoolField("isPigmyCollection", v)}
            />
          </FieldShell>

          <FieldShell label="Agent ID" labelHi="एजंट आयडी" required error={errors.agentId}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput icon={<Hash size={16} />} value={form.agentId} onChange={() => { }} readOnly error={errors.agentId} />
              </div>
              <LookupTrigger onClick={() => setActivePicker("agentId")} />
            </div>
          </FieldShell>

          <FieldShell
            label="Original / Responding"
            labelHi="मूळ / प्रतिसाद"
            required
            error={errors.originalResponding}
          >
            <RadioOriginalResponding
              value={form.originalResponding}
              onChange={(v) => {
                markDirty("originalResponding");
                setForm((f) => ({ ...f, originalResponding: v }));
              }}
            />
          </FieldShell>

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

          <FieldShell label="Description" labelHi="वर्णन" required error={errors.description}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.description}
              onChange={(v) => updateField("description", v)}
              placeholder="Enter Description"
              error={errors.description}
            />
          </FieldShell>

          <FieldShell label="GL Out List Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required error={errors.glOutListDocNo}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.glOutListDocNo}
              onChange={(v) => updateField("glOutListDocNo", v)}
              placeholder="Enter GL Out List Doc No"
              error={errors.glOutListDocNo}
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
            <DateInput value={form.adviceDate} onChange={() => { }} readOnly error={errors.adviceDate} />
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
          onClick={() => handlePlaceholderAction("Display Photo")}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Display Photo
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
          onClick={() => handlePlaceholderAction("Print Voucher")}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Print Voucher
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValidated || isSaving}
          className={`flex items-center gap-1.5 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium transition-colors ${isValidated && !isSaving
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

export default AddCashDeposit;
