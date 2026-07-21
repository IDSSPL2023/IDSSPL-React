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
  Percent,
  Building2,
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
  SelectInput,
  DateInput,
  SectionCard,
  RadioYesNo,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";

const MODE_OF_PAYMENT_OPTIONS = ["Cash", "Transfer", "Cheque"];

type PickRow = { code: string; name: string };

/** Same pick-list shape as Transaction Master's account lookup (Account Type + Name). */
const ACCOUNT_PICK_LIST: PickRow[] = [
  { code: "401", name: "Gaveshvarmath Om Sadashiv" },
  { code: "402", name: "Akshay Om More" },
  { code: "403", name: "Priya Sharma" },
  { code: "404", name: "Rahul Verma" },
  { code: "405", name: "Sunita Patil" },
];

const CHEQUE_TYPE_LIST: PickRow[] = [
  { code: "CHEQUE", name: "Cheque" },
  { code: "DD", name: "Demand Draft" },
  { code: "PO", name: "Pay Order" },
];

const CHEQUE_DATE_LIST: PickRow[] = [
  { code: "2026-05-20", name: "20-May-2026" },
  { code: "2026-05-21", name: "21-May-2026" },
  { code: "2026-05-22", name: "22-May-2026" },
];

const GL_OUTLIST_LIST: PickRow[] = [
  { code: "OUT-2026-0521", name: "TD Interest Payment Outlist" },
  { code: "OUT-2026-0522", name: "Savings Interest Outlist" },
  { code: "OUT-2026-0523", name: "Term Loan Outlist" },
];

const ADVICE_LIST: PickRow[] = [
  { code: "12", name: "Interest Advice - May 2026" },
  { code: "13", name: "Interest Advice - Jun 2026" },
  { code: "14", name: "Interest Advice - Jul 2026" },
];

type PickerStringField =
  | "accountCode"
  | "accountName"
  | "transferAccountCode"
  | "transferAccountName"
  | "chequeType"
  | "chequeDate"
  | "glOutlistNo"
  | "description"
  | "adviceNumber";

type PickerField = "accountCode" | "transferAccountCode" | "chequeType" | "chequeDate" | "glOutlistNo" | "adviceNumber";

const PICKER_CONFIG: Record<
  PickerField,
  { title: string; codeField: PickerStringField; nameField?: PickerStringField; codeLabel: string; nameLabel: string; rows: PickRow[] }
> = {
  accountCode: { title: "Account List", codeField: "accountCode", nameField: "accountName", codeLabel: "Account Code", nameLabel: "Name", rows: ACCOUNT_PICK_LIST },
  transferAccountCode: { title: "Transfer A/c List", codeField: "transferAccountCode", nameField: "transferAccountName", codeLabel: "Account Code", nameLabel: "Name", rows: ACCOUNT_PICK_LIST },
  chequeType: { title: "Cheque Type List", codeField: "chequeType", codeLabel: "Code", nameLabel: "Cheque Type", rows: CHEQUE_TYPE_LIST },
  chequeDate: { title: "Cheque Date List", codeField: "chequeDate", codeLabel: "Date", nameLabel: "Display", rows: CHEQUE_DATE_LIST },
  glOutlistNo: { title: "GL Outlist List", codeField: "glOutlistNo", nameField: "description", codeLabel: "Outlist No", nameLabel: "Description", rows: GL_OUTLIST_LIST },
  adviceNumber: { title: "Advice List", codeField: "adviceNumber", codeLabel: "Advice No", nameLabel: "Description", rows: ADVICE_LIST },
};

export interface TdInterestPaymentFormData {
  // Section 1 — Account Details
  isHoTransaction: boolean;
  accountCode: string;
  accountName: string;
  glAccountCode: string;
  glAccountName: string;
  interestUpToDate: string;
  scrollNumber: string;

  // Section 2 — Account Summary
  depositAmount: string;
  openDate: string;
  maturityDate: string;
  interestRate: string;
  maturityValue: string;
  period: string;
  unitOfPeriod: string;
  summaryLedgerBalance: string;
  summaryAvailableBalance: string;
  summaryNewLedgerBalance: string;

  // Section 3 — Payment Details
  modeOfPayment: string;
  transferAccountCode: string;
  transferAccountName: string;
  particular: string;
  paymentLedgerBalance: string;
  paymentAvailableBalance: string;
  paymentNewLedgerBalance: string;
  lastIntDate: string;
  completedDays: string;
  completedMonths: string;
  interestCalculated: string;
  pendingCashInterest: string;
  interestPay: string;
  interestPayable: string;
  totalInterestPaid: string;
  isRenewal: boolean;
  transferByCheque: boolean;
  originalOrResponding: "Original" | "Responding";
  chequeType: string;
  chequeSeries: string;
  chequeNumber: string;
  chequeDate: string;

  // Section 4 — GL / Accounting Information
  glOutlistNo: string;
  glOutlistDocNo: string;
  description: string;
  adviceNumber: string;
  adviceDate: string;
  accountType: string;
}

/** Reusable dummy data — used to prefill the form on open. */
export const DEFAULT_TD_INTEREST_PAYMENT_DATA: TdInterestPaymentFormData = {
  isHoTransaction: true,
  accountCode: "401",
  accountName: "Gaveshvarmath Om Sadashiv",
  glAccountCode: "401",
  glAccountName: "Gaveshvarmath Om Sadashiv",
  interestUpToDate: "0",
  scrollNumber: "12",

  depositAmount: "250000",
  openDate: "2026-05-20",
  maturityDate: "2026-05-20",
  interestRate: "8",
  maturityValue: "270000",
  period: "60",
  unitOfPeriod: "Months",
  summaryLedgerBalance: "250000",
  summaryAvailableBalance: "250000",
  summaryNewLedgerBalance: "250000",

  modeOfPayment: "Cash",
  transferAccountCode: "401",
  transferAccountName: "Akshay Om More",
  particular: "Cash",
  paymentLedgerBalance: "250000",
  paymentAvailableBalance: "250000",
  paymentNewLedgerBalance: "250000",
  lastIntDate: "2026-04-20",
  completedDays: "23",
  completedMonths: "23",
  interestCalculated: "0",
  pendingCashInterest: "0",
  interestPay: "0",
  interestPayable: "0",
  totalInterestPaid: "0",
  isRenewal: false,
  transferByCheque: false,
  originalOrResponding: "Original",
  chequeType: "CHEQUE",
  chequeSeries: "A",
  chequeNumber: "CHEQUE",
  chequeDate: "2026-05-20",

  glOutlistNo: "OUT-2026-0521",
  glOutlistDocNo: "DOC-778812",
  description: "TD Interest Payment",
  adviceNumber: "12",
  adviceDate: "2026-05-20",
  accountType: "TD",
};

const TEXT_FIELD_KEYS: (keyof TdInterestPaymentFormData)[] = [
  "accountCode",
  "accountName",
  "glAccountCode",
  "glAccountName",
  "interestUpToDate",
  "scrollNumber",
  "depositAmount",
  "openDate",
  "maturityDate",
  "interestRate",
  "maturityValue",
  "period",
  "unitOfPeriod",
  "summaryLedgerBalance",
  "summaryAvailableBalance",
  "summaryNewLedgerBalance",
  "modeOfPayment",
  "transferAccountCode",
  "transferAccountName",
  "particular",
  "paymentLedgerBalance",
  "paymentAvailableBalance",
  "paymentNewLedgerBalance",
  "lastIntDate",
  "completedDays",
  "completedMonths",
  "interestCalculated",
  "pendingCashInterest",
  "interestPay",
  "interestPayable",
  "totalInterestPaid",
  "chequeType",
  "chequeSeries",
  "chequeNumber",
  "chequeDate",
  "glOutlistNo",
  "glOutlistDocNo",
  "description",
  "adviceNumber",
  "adviceDate",
  "accountType",
];

/** Same validation approach used by Customer Master's sibling forms (AddSI, AddTransactionMaster). */
const validateTdInterestPayment = (
  data: TdInterestPaymentFormData
): Record<keyof TdInterestPaymentFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof TdInterestPaymentFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  errors.isHoTransaction = false;
  errors.isRenewal = false;
  errors.transferByCheque = false;
  errors.originalOrResponding = false;
  return errors;
};

/** Simulated save — no backend yet. */
const saveTdInterestPayment = (data: TdInterestPaymentFormData) =>
  new Promise<TdInterestPaymentFormData>((resolve) =>
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

const RadioOriginalResponding = ({
  value,
  onChange,
}: {
  value: "Original" | "Responding";
  onChange: (v: "Original" | "Responding") => void;
}) => (
  <div className="last:mb-0 flex items-center gap-2">
    <label className="large block text-sm font-medium text-[#1F2858]">
      Original / Responding <span className="text-slate-600">/ मूळ / प्रतिसाद</span>
    </label>
    <div className="flex items-center gap-4 pt-1">
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

export interface AddTdInterestPaymentProps {
  onClose: () => void;
  onSave?: (data: TdInterestPaymentFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddTdInterestPayment = ({ onClose, onSave, variant = "modal" }: AddTdInterestPaymentProps) => {
  const [form, setForm] = useState<TdInterestPaymentFormData>(
    DEFAULT_TD_INTEREST_PAYMENT_DATA
  );
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TdInterestPaymentFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const handlePlaceholderAction = (label: string) => {
    toast.info(`${label} will be implemented.`);
  };

  const markDirty = (field: keyof TdInterestPaymentFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof TdInterestPaymentFormData, value: string) => {
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
      return updated as unknown as TdInterestPaymentFormData;
    });
    setActivePicker(null);
  };

  const updateBoolField = (field: "isHoTransaction" | "isRenewal" | "transferByCheque", value: boolean) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleValidate = () => {
    const newErrors = validateTdInterestPayment(form);
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
    await saveTdInterestPayment(form);
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
        title="Interest Payment Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Deposit Interest Payment Mark"
      titleHi="ठेव व्याज प्रदान चिन्हांकन"
      subtitleEn="All Information's are related to Interest Payment Mark."
      subtitleHi="सर्व माहिती व्याज प्रदान चिन्हांकनाशी संबंधित आहे."
      headerIcon={<Image src={IMAGES.FRAME_1618867441} alt="Deposit Interest Payment Mark" width={50} height={50} />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
    >
      <SectionCard
        titleEn="Account Details"
        titleHi="खाते तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <RadioYesNo
            label="Is HO Transaction"
            labelHi="मुख्य कार्यालय व्यवहार आहे का"
            value={form.isHoTransaction}
            onChange={(v) => updateBoolField("isHoTransaction", v)}
          />

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

          <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required error={errors.glAccountCode}>
            <TextInput
              icon={<Landmark size={16} />}
              value={form.glAccountCode}
              onChange={(v) => updateField("glAccountCode", v)}
              placeholder="Enter GL Account Code"
              error={errors.glAccountCode}
            />
          </FieldShell>

          <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required error={errors.glAccountName}>
            <TextInput icon={<User size={16} />} value={form.glAccountName} onChange={() => {}} readOnly error={errors.glAccountName} />
          </FieldShell>

          <FieldShell label="Interest Up To Date" labelHi="व्याज या तारखेपर्यंत" required error={errors.interestUpToDate}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.interestUpToDate}
              onChange={(v) => updateField("interestUpToDate", v)}
              placeholder="Enter Interest Up To Date"
              error={errors.interestUpToDate}
            />
          </FieldShell>

          <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required error={errors.scrollNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.scrollNumber}
              onChange={(v) => updateField("scrollNumber", v)}
              placeholder="Enter Scroll Number"
              error={errors.scrollNumber}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Account Summary"
        titleHi="खाते सारांश"
        subtitleEn="Deposit account balances and maturity details."
        subtitleHi="ठेव खाते शिल्लक व परिपक्वता तपशील."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required error={errors.depositAmount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.depositAmount}
              onChange={(v) => updateField("depositAmount", v)}
              placeholder="Enter Deposit Amount"
              error={errors.depositAmount}
            />
          </FieldShell>

          <FieldShell label="Open Date" labelHi="सुरुवात तारीख" required error={errors.openDate}>
            <DateInput value={form.openDate} onChange={(v) => updateField("openDate", v)} error={errors.openDate} />
          </FieldShell>

          <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required error={errors.maturityDate}>
            <DateInput value={form.maturityDate} onChange={(v) => updateField("maturityDate", v)} error={errors.maturityDate} />
          </FieldShell>

          <FieldShell label="Interest Rate" labelHi="व्याज दर" required error={errors.interestRate}>
            <TextInput
              icon={<Percent size={16} />}
              value={form.interestRate}
              onChange={(v) => updateField("interestRate", v)}
              placeholder="Enter Interest Rate"
              error={errors.interestRate}
            />
          </FieldShell>

          <FieldShell label="Maturity Value" labelHi="परिपक्वता मूल्य" required error={errors.maturityValue}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.maturityValue}
              onChange={(v) => updateField("maturityValue", v)}
              placeholder="Enter Maturity Value"
              error={errors.maturityValue}
            />
          </FieldShell>

          <FieldShell label="Period" labelHi="कालावधी" required error={errors.period}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.period}
              onChange={(v) => updateField("period", v)}
              placeholder="Enter Period"
              error={errors.period}
            />
          </FieldShell>

          <FieldShell label="Unit Of Period" labelHi="कालावधीचे एकक" required error={errors.unitOfPeriod}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.unitOfPeriod}
              onChange={(v) => updateField("unitOfPeriod", v)}
              placeholder="Enter Unit Of Period"
              error={errors.unitOfPeriod}
            />
          </FieldShell>

          <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required error={errors.summaryLedgerBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.summaryLedgerBalance}
              onChange={(v) => updateField("summaryLedgerBalance", v)}
              placeholder="Enter Ledger Balance"
              error={errors.summaryLedgerBalance}
            />
          </FieldShell>

          <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required error={errors.summaryAvailableBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.summaryAvailableBalance}
              onChange={(v) => updateField("summaryAvailableBalance", v)}
              placeholder="Enter Available Balance"
              error={errors.summaryAvailableBalance}
            />
          </FieldShell>

          <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required error={errors.summaryNewLedgerBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.summaryNewLedgerBalance}
              onChange={(v) => updateField("summaryNewLedgerBalance", v)}
              placeholder="Enter New Ledger Balance"
              error={errors.summaryNewLedgerBalance}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Payment Details"
        titleHi="देयक तपशील"
        subtitleEn="Manage interest payment and cheque related information."
        subtitleHi="व्याज प्रदान व धनादेश संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Mode Of Payment" labelHi="देयक पद्धत" required error={errors.modeOfPayment}>
            <SelectInput
              icon={<CreditCard size={16} />}
              value={form.modeOfPayment}
              onChange={(v) => updateField("modeOfPayment", v)}
              options={MODE_OF_PAYMENT_OPTIONS}
              placeholder="Select Mode Of Payment"
              error={errors.modeOfPayment}
            />
          </FieldShell>

          <FieldShell label="Transfer Account Code" labelHi="बदली खाते कोड" required error={errors.transferAccountCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.transferAccountCode}
                  onChange={(v) => updateField("transferAccountCode", v)}
                  placeholder="Enter Transfer Account Code"
                  error={errors.transferAccountCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("transferAccountCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Transfer Account Name" labelHi="बदली खात्याचे नाव" required error={errors.transferAccountName}>
            <TextInput icon={<User size={16} />} value={form.transferAccountName} onChange={() => {}} readOnly error={errors.transferAccountName} />
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

          <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required error={errors.paymentLedgerBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.paymentLedgerBalance}
              onChange={(v) => updateField("paymentLedgerBalance", v)}
              placeholder="Enter Ledger Balance"
              error={errors.paymentLedgerBalance}
            />
          </FieldShell>

          <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required error={errors.paymentAvailableBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.paymentAvailableBalance}
              onChange={(v) => updateField("paymentAvailableBalance", v)}
              placeholder="Enter Available Balance"
              error={errors.paymentAvailableBalance}
            />
          </FieldShell>

          <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required error={errors.paymentNewLedgerBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.paymentNewLedgerBalance}
              onChange={(v) => updateField("paymentNewLedgerBalance", v)}
              placeholder="Enter New Ledger Balance"
              error={errors.paymentNewLedgerBalance}
            />
          </FieldShell>

          <FieldShell label="Last Int Date" labelHi="शेवटची व्याज तारीख" required error={errors.lastIntDate}>
            <DateInput value={form.lastIntDate} onChange={(v) => updateField("lastIntDate", v)} error={errors.lastIntDate} />
          </FieldShell>

          <FieldShell label="Completed Days" labelHi="पूर्ण झालेले दिवस" required error={errors.completedDays}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.completedDays}
              onChange={(v) => updateField("completedDays", v)}
              placeholder="Enter Completed Days"
              error={errors.completedDays}
            />
          </FieldShell>

          <FieldShell label="Completed Months" labelHi="पूर्ण झालेले महिने" required error={errors.completedMonths}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.completedMonths}
              onChange={(v) => updateField("completedMonths", v)}
              placeholder="Enter Completed Months"
              error={errors.completedMonths}
            />
          </FieldShell>

          <FieldShell label="Interest Calculated" labelHi="गणना केलेले व्याज" required error={errors.interestCalculated}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.interestCalculated}
              onChange={(v) => updateField("interestCalculated", v)}
              placeholder="Enter Interest Calculated"
              error={errors.interestCalculated}
            />
          </FieldShell>

          <FieldShell label="Pending Cash Interest" labelHi="प्रलंबित रोख व्याज" required error={errors.pendingCashInterest}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.pendingCashInterest}
              onChange={(v) => updateField("pendingCashInterest", v)}
              placeholder="Enter Pending Cash Interest"
              error={errors.pendingCashInterest}
            />
          </FieldShell>

          <FieldShell label="Interest Pay" labelHi="व्याज प्रदान" required error={errors.interestPay}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.interestPay}
              onChange={(v) => updateField("interestPay", v)}
              placeholder="Enter Interest Pay"
              error={errors.interestPay}
            />
          </FieldShell>

          <FieldShell label="Interest Payable" labelHi="देय व्याज" required error={errors.interestPayable}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.interestPayable}
              onChange={(v) => updateField("interestPayable", v)}
              placeholder="Enter Interest Payable"
              error={errors.interestPayable}
            />
          </FieldShell>

          <FieldShell label="Total Interest Paid" labelHi="एकूण व्याज प्रदान केले" required error={errors.totalInterestPaid}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.totalInterestPaid}
              onChange={(v) => updateField("totalInterestPaid", v)}
              placeholder="Enter Total Interest Paid"
              error={errors.totalInterestPaid}
            />
          </FieldShell>

          <RadioYesNo
            label="Is Renewal"
            labelHi="नूतनीकरण आहे का"
            value={form.isRenewal}
            onChange={(v) => updateBoolField("isRenewal", v)}
          />

          <RadioYesNo
            label="Transfer By Cheque"
            labelHi="धनादेशाद्वारे बदली"
            value={form.transferByCheque}
            onChange={(v) => updateBoolField("transferByCheque", v)}
          />

          <RadioOriginalResponding
            value={form.originalOrResponding}
            onChange={(v) => {
              markDirty("originalOrResponding");
              setForm((f) => ({ ...f, originalOrResponding: v }));
            }}
          />

          <FieldShell label="Cheque Type" labelHi="धनादेश प्रकार" required error={errors.chequeType}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<FileText size={16} />}
                  value={form.chequeType}
                  onChange={(v) => updateField("chequeType", v)}
                  placeholder="Enter Cheque Type"
                  error={errors.chequeType}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("chequeType")} />
            </div>
          </FieldShell>

          <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required error={errors.chequeSeries}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.chequeSeries}
              onChange={(v) => updateField("chequeSeries", v)}
              placeholder="Enter Cheque Series"
              error={errors.chequeSeries}
            />
          </FieldShell>

          <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required error={errors.chequeNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.chequeNumber}
              onChange={(v) => updateField("chequeNumber", v)}
              placeholder="Enter Cheque Number"
              error={errors.chequeNumber}
            />
          </FieldShell>

          <FieldShell label="Cheque Date" labelHi="धनादेश तारीख" required error={errors.chequeDate}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <DateInput value={form.chequeDate} onChange={(v) => updateField("chequeDate", v)} error={errors.chequeDate} />
              </div>
              <LookupTrigger onClick={() => setActivePicker("chequeDate")} />
            </div>
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="GL / Accounting Information"
        titleHi="जीएल / लेखा माहिती"
        subtitleEn="Manage GL outlist and advice related information."
        subtitleHi="जीएल आऊटलिस्ट व सल्ला संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="GL Outlist No" labelHi="जीएल आऊटलिस्ट क्रमांक" required error={errors.glOutlistNo}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<FileText size={16} />}
                  value={form.glOutlistNo}
                  onChange={(v) => updateField("glOutlistNo", v)}
                  placeholder="Enter GL Outlist No"
                  error={errors.glOutlistNo}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("glOutlistNo")} />
            </div>
          </FieldShell>

          <FieldShell label="GL Outlist Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required error={errors.glOutlistDocNo}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.glOutlistDocNo}
              onChange={(v) => updateField("glOutlistDocNo", v)}
              placeholder="Enter GL Outlist Doc No"
              error={errors.glOutlistDocNo}
            />
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
            <DateInput value={form.adviceDate} onChange={(v) => updateField("adviceDate", v)} error={errors.adviceDate} />
          </FieldShell>

          <FieldShell label="Account Type" labelHi="खाते प्रकार" required error={errors.accountType}>
            <TextInput icon={<Building2 size={16} />} value={form.accountType} onChange={() => {}} readOnly error={errors.accountType} />
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
          onClick={() => handlePlaceholderAction("Account Details")}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Account Details
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Print Vouchers")}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Print Vouchers
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Display Vouchers")}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Display Vouchers
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

export default AddTdInterestPayment;
