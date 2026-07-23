import { IMAGES } from "@/assets";
import { useState, type ReactNode } from "react";
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
  Landmark,
  IdCard,
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

type PickRow = { code: string; name: string };

const ACCOUNT_TYPE_LIST: PickRow[] = [
  { code: "401", name: "Term Deposit" },
  { code: "402", name: "Savings" },
  { code: "403", name: "Current" },
];

const ACCOUNT_PICK_LIST: PickRow[] = [
  { code: "401", name: "Gaveshvarmath Om Sadashiv" },
  { code: "402", name: "Akshay Om More" },
  { code: "403", name: "Priya Sharma" },
];

const OUTLIST_SERIES_LIST: PickRow[] = [
  { code: "Outlist", name: "Cash Withdrawal Outlist" },
  { code: "Outlist-2", name: "Savings Withdrawal Outlist" },
];

const CHEQUE_TYPE_LIST: PickRow[] = [
  { code: "CHEQUE", name: "Cheque" },
  { code: "DD", name: "Demand Draft" },
];

const CHEQUE_DATE_LIST: PickRow[] = [
  { code: "2026-01-12", name: "12-Jan-2026" },
  { code: "2026-01-13", name: "13-Jan-2026" },
];

const GL_OUTLIST_LIST: PickRow[] = [
  { code: "12", name: "Cash Withdrawal Outlist" },
  { code: "13", name: "Savings Outlist" },
];

const ADVICE_LIST: PickRow[] = [
  { code: "12", name: "Withdrawal Advice - Jan 2026" },
  { code: "13", name: "Withdrawal Advice - Feb 2026" },
];

type PickerStringField =
  | "accountType"
  | "accountCode"
  | "accountName"
  | "outlistSeries"
  | "chequeType"
  | "chequeDate"
  | "glOutlistNo"
  | "descriptionGl"
  | "adviceNumber";

type PickerField = "accountType" | "accountCode" | "outlistSeries" | "chequeType" | "chequeDate" | "glOutlistNo" | "adviceNumber";

const PICKER_CONFIG: Record<
  PickerField,
  { title: string; codeField: PickerStringField; nameField?: PickerStringField; codeLabel: string; nameLabel: string; rows: PickRow[] }
> = {
  accountType: { title: "Account Type List", codeField: "accountType", codeLabel: "Code", nameLabel: "Account Type", rows: ACCOUNT_TYPE_LIST },
  accountCode: { title: "Account List", codeField: "accountCode", nameField: "accountName", codeLabel: "Account Code", nameLabel: "Name", rows: ACCOUNT_PICK_LIST },
  outlistSeries: { title: "Outlist Series List", codeField: "outlistSeries", codeLabel: "Code", nameLabel: "Description", rows: OUTLIST_SERIES_LIST },
  chequeType: { title: "Cheque Type List", codeField: "chequeType", codeLabel: "Code", nameLabel: "Cheque Type", rows: CHEQUE_TYPE_LIST },
  chequeDate: { title: "Cheque Date List", codeField: "chequeDate", codeLabel: "Date", nameLabel: "Display", rows: CHEQUE_DATE_LIST },
  glOutlistNo: { title: "GL Outlist List", codeField: "glOutlistNo", nameField: "descriptionGl", codeLabel: "Outlist No", nameLabel: "Description", rows: GL_OUTLIST_LIST },
  adviceNumber: { title: "Advice List", codeField: "adviceNumber", codeLabel: "Advice No", nameLabel: "Description", rows: ADVICE_LIST },
};

export interface CashWithdrawalFormData {
  // Section 1 — Account Details
  isHoTransaction: boolean;
  accountType: string;
  description: string;
  accountCode: string;
  accountName: string;
  accountReviewDate: string;
  mobileNumber: string;
  aadharNumber: string;
  panCode: string;
  accountOperationId: string;
  ledgerBalance: string;
  availableBalance: string;
  newLedgerBalance: string;
  lastTransactionId: string;
  unclearBalance: string;
  limitAmount: string;
  drawingPower: string;
  checkBookStatus: string;
  lastTransactionDate: string;
  // Section 2 — Transaction Identification
  originalResponding: "Original" | "Responding";
  outlistSeries: string;
  glOutlistDescription: string;
  glOutlistDocumentNumber: string;
  withdrawalBy: "Cash" | "Cheque";
  amount: string;
  amountInWords: string;
  particular: string;
  chequeType: string;
  chequeSeries: string;
  chequeNumber: string;
  chequeDate: string;
  descriptionGl: string;
  adviceNumber: string;
  adviceDate: string;
  chequeStatus: string;

  // Section 3 — GL / Accounting Information
  glOutlistNo: string;
  glOutlistDocNo: string;
  accountTypeGl: string;
  cashLimit: string;
  tdsOnLimit: string;
  totalTransactionCustomerId: string;
  totalTransactionPanCard: string;
  glAccountCode: string;
  glAccountName: string;
  transactionViewFromDate: string;
  toDate: string;

}

/** Reusable dummy data — read-only fields are pre-filled (system data), the
 * remaining fields start blank since they're entered fresh per transaction. */
export const DEFAULT_CASH_WITHDRAWAL_DATA: CashWithdrawalFormData = {
  isHoTransaction: true,
  accountType: "401",
  description: "Cash Withdrawal",
  accountCode: "401",
  accountName: "Gaveshvarmath Om Sadashiv",
  accountReviewDate: "2026-05-20",
  mobileNumber: "9876543210",
  aadharNumber: "1234 5678 9012",
  panCode: "ABCDE1234F",
  accountOperationId: "SELF",
  ledgerBalance: "250000",
  availableBalance: "250000",
  newLedgerBalance: "250000",
  lastTransactionId: "TXN20260512",
  unclearBalance: "0",
  limitAmount: "500000",
  drawingPower: "500000",
  checkBookStatus: "Issued",
  lastTransactionDate: "2026-05-12",

  originalResponding: "Original",
  outlistSeries: "Outlist",
  glOutlistDescription: "",
  glOutlistDocumentNumber: "",
  withdrawalBy: "Cash",
  amount: "",
  amountInWords: "Two Lakh Fifty Thousand Only",
  particular: "Self",
  chequeType: "CHEQUE",
  chequeSeries: "CHEQUE",
  chequeNumber: "CHEQUE",
  chequeDate: "2026-01-12",
  chequeStatus: "",

  glOutlistNo: "12",
  glOutlistDocNo: "11",
  descriptionGl: "Cash Withdrawal Outlist",
  adviceNumber: "12",
  adviceDate: "2026-02-10",
  accountTypeGl: "TD",
  cashLimit: "100000",
  tdsOnLimit: "50000",
  totalTransactionCustomerId: "5",
  totalTransactionPanCard: "5",
  glAccountCode: "8001",
  glAccountName: "Cash Withdrawal GL",
  transactionViewFromDate: "2026-05-01",
  toDate: "2026-05-20",
};

const TEXT_FIELD_KEYS: (keyof CashWithdrawalFormData)[] = [
  "accountType",
  "description",
  "accountCode",
  "accountName",
  "accountReviewDate",
  "mobileNumber",
  "aadharNumber",
  "panCode",
  "accountOperationId",
  "ledgerBalance",
  "availableBalance",
  "newLedgerBalance",
  "lastTransactionId",
  "unclearBalance",
  "limitAmount",
  "drawingPower",
  "checkBookStatus",
  "lastTransactionDate",
  "outlistSeries",
  "glOutlistDescription",
  "glOutlistDocumentNumber",
  "amount",
  "amountInWords",
  "particular",
  "chequeType",
  "chequeSeries",
  "chequeNumber",
  "chequeDate",
  "glOutlistNo",
  "glOutlistDocNo",
  "descriptionGl",
  "adviceNumber",
  "adviceDate",
  "accountTypeGl",
  "cashLimit",
  "tdsOnLimit",
  "totalTransactionCustomerId",
  "totalTransactionPanCard",
  "glAccountCode",
  "glAccountName",
  "transactionViewFromDate",
  "toDate",
];

/** Same validation approach used by Transaction Master's sibling forms (TD Interest Payment). */
const validateCashWithdrawal = (
  data: CashWithdrawalFormData
): Record<keyof CashWithdrawalFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof CashWithdrawalFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  errors.isHoTransaction = false;
  errors.originalResponding = false;
  errors.withdrawalBy = false;
  return errors;
};

/** Simulated save — no backend yet. */
const saveCashWithdrawal = (data: CashWithdrawalFormData) =>
  new Promise<CashWithdrawalFormData>((resolve) =>
    setTimeout(() => resolve(data), 600)
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

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const RadioTwoOption = ({
  label,
  labelHi,
  options,
  value,
  onChange,
}: {
  label: string;
  labelHi: string;
  options: [string, string];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="last:mb-0 flex items-center gap-2">
    <label className="large block text-sm font-medium text-[#1F2858]">
      {label} <span className="text-slate-600">/ {labelHi}</span>
    </label>
    <div className="flex items-center gap-4 pt-1">
      {options.map((opt) => (
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

export interface AddCashWithdrawalProps {
  onClose: () => void;
  onSave?: (data: CashWithdrawalFormData) => void;
  titleEn?: string;
  titleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  headerIcon?: ReactNode;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddCashWithdrawal = ({
  onClose,
  onSave,
  titleEn = "Cash Withdrawal",
  titleHi = "कॅश काढणे",
  subtitleEn = "All Information's are related to Interest Payment Mark.",
  subtitleHi = "सर्व माहिती व्याज भरण्याच्या मार्कशी संबंधित आहे.",
  headerIcon = <Image src={IMAGES.CASH_WITHDRAWAL_FORM_ICON} alt="Cash Withdrawal" width={50} height={50} />,
  variant = "modal",
}: AddCashWithdrawalProps) => {
  const [form, setForm] = useState<CashWithdrawalFormData>(DEFAULT_CASH_WITHDRAWAL_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CashWithdrawalFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

  const markDirty = (field: keyof CashWithdrawalFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof CashWithdrawalFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const updateBoolField = (field: "isHoTransaction", value: boolean) => {
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
      return updated as unknown as CashWithdrawalFormData;
    });
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors = validateCashWithdrawal(form);
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
    await saveCashWithdrawal(form);
    setIsSaving(false);
    setShowSuccess(true);
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
        title="Cash Withdrawal Saved Successfully"
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
      onTabChange={() => { }}
      hideFooter
      variant={variant}
    >
      <div className="relative">
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
              error={errors.description}
            >
              <TextInput
                icon={<FileText size={16} />}
                value={form.description}
                onChange={(v) => updateField("description", v)}
                placeholder="Enter Account Description"
                error={errors.description}
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

            <FieldShell label="Uncleared Balance" labelHi="अस्पष्ट शिल्लक" required error={errors.unclearBalance}>
              <TextInput icon={<IndianRupee size={16} />} value={form.unclearBalance} onChange={() => { }} readOnly error={errors.unclearBalance} />
            </FieldShell>

            <FieldShell label="Limit Amount" labelHi="मर्यादा रक्कम" required error={errors.limitAmount}>
              <TextInput icon={<IndianRupee size={16} />} value={form.limitAmount} onChange={() => { }} readOnly error={errors.limitAmount} />
            </FieldShell>

            <FieldShell label="Drawing Power" labelHi="कर्ज उचलण्याची क्षमता" required error={errors.drawingPower}>
              <TextInput icon={<IndianRupee size={16} />} value={form.drawingPower} onChange={() => { }} readOnly error={errors.drawingPower} />
            </FieldShell>

            <FieldShell label="PAN Card Number" labelHi="पॅन कार्ड क्रमांक" required error={errors.panCode}>
              <TextInput icon={<IdCard size={16} />} value={form.panCode} onChange={() => { }} readOnly error={errors.panCode} />
            </FieldShell>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        titleEn="Transaction Identification"
        titleHi="आदान-प्रदान ओळख"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <RadioTwoOption
            label="Original / Responding"
            labelHi="मूळ / प्रतिसाद"
            options={["Original", "Responding"]}
            value={form.originalResponding}
            onChange={(v) => {
              markDirty("originalResponding");
              setForm((f) => ({ ...f, originalResponding: v as "Original" | "Responding" }));
            }}
          />

          <FieldShell label="Outlist Series" labelHi="" required error={errors.outlistSeries}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<User size={16} />}
                  value={form.outlistSeries}
                  onChange={() => { }}
                  readOnly
                  placeholder="Enter Outlist Series"
                  error={errors.outlistSeries}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("outlistSeries")} />
            </div>
          </FieldShell>

          <FieldShell label="GL Outlist Description" labelHi="" required error={errors.glOutlistDescription}>
            <TextInput
              icon={<User size={16} />}
              value={form.glOutlistDescription}
              onChange={(v) => updateField("glOutlistDescription", v)}
              placeholder="Enter GL Outlist"
              error={errors.glOutlistDescription}
            />
          </FieldShell>

          <FieldShell label="GL Outlist Document Number" labelHi="" required error={errors.glOutlistDocumentNumber}>
            <TextInput
              icon={<User size={16} />}
              value={form.glOutlistDocumentNumber}
              onChange={(v) => updateField("glOutlistDocumentNumber", v)}
              placeholder="Enter GL Outlist Number"
              error={errors.glOutlistDocumentNumber}
            />
          </FieldShell>
          <FieldShell label="Advice Number" labelHi="" required error={errors.adviceNumber}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.adviceNumber}
                  onChange={() => { }}
                  readOnly
                  placeholder="Advice Number"
                  error={errors.adviceNumber}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("adviceNumber")} />
            </div>
          </FieldShell>

          <FieldShell label="Advice Date" labelHi="" required error={errors.adviceDate}>
            <DateInput value={form.adviceDate} onChange={() => { }} readOnly error={errors.adviceDate} />
          </FieldShell>
          <RadioTwoOption
            label="Withdrawal By"
            labelHi="काढण्याची पद्धत"
            options={["Cash", "Cheque"]}
            value={form.withdrawalBy}
            onChange={(v) => {
              markDirty("withdrawalBy");
              setForm((f) => ({ ...f, withdrawalBy: v as "Cash" | "Cheque" }));
            }}
          />

          <FieldShell label="Amount" labelHi="" required error={errors.amount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.amount}
              onChange={(v) => updateField("amount", v)}
              placeholder="Enter Amount"
              error={errors.amount}
            />
          </FieldShell>

          <FieldShell label="Amount in words" labelHi="" required error={errors.amountInWords}>
            <TextInput
              icon={<User size={16} />}
              value={form.amountInWords}
              onChange={() => { }}
              readOnly
              placeholder="Amount in words"
              error={errors.amountInWords}
            />
          </FieldShell>

          <FieldShell label="Particular" labelHi="" required error={errors.particular}>
            <TextInput icon={<User size={16} />} value={form.particular} onChange={() => { }} readOnly error={errors.particular} />
          </FieldShell>

          <FieldShell label="Cheque Type" labelHi="चेक प्रकार" required error={errors.chequeType}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<FileText size={16} />}
                  value={form.chequeType}
                  onChange={() => { }}
                  readOnly
                  placeholder="Enter Cheque Type"
                  error={errors.chequeType}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("chequeType")} />
            </div>
          </FieldShell>

          <FieldShell label="Cheque Series" labelHi="चेक प्रकार" required error={errors.chequeSeries}>
            <TextInput icon={<FileText size={16} />} value={form.chequeSeries} onChange={() => { }} readOnly error={errors.chequeSeries} />
          </FieldShell>

          <FieldShell label="Cheque Number" labelHi="चेक नंबर" required error={errors.chequeNumber}>
            <TextInput icon={<FileText size={16} />} value={form.chequeNumber} onChange={() => { }} readOnly error={errors.chequeNumber} />
          </FieldShell>

          <FieldShell label="Cheque Date" labelHi="चेकची तारीख" required error={errors.chequeDate}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <DateInput value={form.chequeDate} onChange={() => { }} readOnly error={errors.chequeDate} />
              </div>
              <LookupTrigger onClick={() => setActivePicker("chequeDate")} />
            </div>
          </FieldShell>

          <FieldShell
            label="Cheque Status"
            labelHi="चेकची स्थिती"
            required
            error={errors.chequeStatus}
          >
            <select
              value={form.chequeStatus}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  chequeStatus: e.target.value,
                }))
              }
              className={`w-full rounded-lg border px-3 py-3 ${errors.chequeStatus
                  ? "border-red-500"
                  : "border-gray-300"
                }`}
            >
              <option value="">Select Status</option>
              <option value="Issued">Issued</option>
              <option value="Presented">Presented</option>
              <option value="Cleared">Cleared</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Cancel <X size={16} />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValidated || isSaving}
          className={`flex items-center gap-1.5 rounded-lg border border-transparent bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary transition-colors ${isValidated && !isSaving ? "hover:bg-primary-200" : "cursor-not-allowed opacity-60"
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

export default AddCashWithdrawal;