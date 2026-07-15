import { useState } from "react";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import {
  Calendar,
  Check,
  ChevronDown,
  CreditCard,
  FileText,
  Hash,
  IndianRupee,
  Landmark,
  MoreVertical,
  Printer,
  User,
  X,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  DateInput,
  FieldShell,
  RadioYesNo,
  SectionCard,
  SelectInput,
  TextInput,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";

type PickRow = { code: string; name: string };
type FieldKind = "text" | "date" | "select" | "picker" | "readonly";

export interface TlCcInstallmentFormData {
  isHoTransaction: boolean;
  accountType: string;
  accountCode: string;
  accountName: string;
  scrollNumber: string;
  glAccountCode: string;
  glAccountName: string;
  reviewDate: string;
  depositAmount: string;
  surcharge: string;
  interestAmount: string;
  installmentTypeId: string;
  openDate: string;
  period: string;
  completedMonths: string;
  overdue: string;
  ledgerBalance: string;
  availableBalance: string;
  newLedgerBalance: string;
  interestRate: string;
  modeOfPayment: string;
  transferAccountCode: string;
  transferAccountName: string;
  paymentGlAccountCode: string;
  paymentGlAccountName: string;
  paymentLedgerBalance: string;
  paymentAvailableBalance: string;
  paymentNewLedgerBalance: string;
  particular: string;
  particular1: string;
  originalResponding: string;
  chequeType: string;
  chequeSeries: string;
  chequeNumber: string;
  chequeDate: string;
  interestUpToDate: string;
  glOutlistNo: string;
  glOutlistDocNo: string;
  adviceNumber: string;
  adviceDate: string;
}

type TextKey = Exclude<keyof TlCcInstallmentFormData, "isHoTransaction">;
type PickerField =
  | "accountCode"
  | "transferAccountCode"
  | "chequeType"
  | "glOutlistNo"
  | "adviceNumber";

type FieldConfig = {
  key: TextKey;
  label: string;
  labelHi: string;
  kind?: FieldKind;
  placeholder?: string;
  picker?: PickerField;
  options?: string[];
};

const ACCOUNT_PICK_LIST: PickRow[] = [
  { code: "401", name: "Gaveshvarmath Om Sadashiv" },
  { code: "402", name: "Akshay Om More" },
  { code: "403", name: "Priya Sharma" },
  { code: "404", name: "Rahul Verma" },
];

const PICKER_CONFIG: Record<
  PickerField,
  {
    title: string;
    codeField: TextKey;
    nameField?: TextKey;
    codeLabel: string;
    nameLabel: string;
    rows: PickRow[];
  }
> = {
  accountCode: {
    title: "Account List",
    codeField: "accountCode",
    nameField: "accountName",
    codeLabel: "Account Code",
    nameLabel: "Name",
    rows: ACCOUNT_PICK_LIST,
  },
  transferAccountCode: {
    title: "Transfer A/c List",
    codeField: "transferAccountCode",
    nameField: "transferAccountName",
    codeLabel: "Account Code",
    nameLabel: "Name",
    rows: ACCOUNT_PICK_LIST,
  },
  chequeType: {
    title: "Cheque Type List",
    codeField: "chequeType",
    codeLabel: "Code",
    nameLabel: "Cheque Type",
    rows: [
      { code: "CHEQUE", name: "Cheque" },
      { code: "DD", name: "Demand Draft" },
      { code: "PO", name: "Pay Order" },
    ],
  },
  glOutlistNo: {
    title: "GL Outlist List",
    codeField: "glOutlistNo",
    codeLabel: "Outlist No",
    nameLabel: "Description",
    rows: [
      { code: "12", name: "Term Loan Recovery Outlist" },
      { code: "13", name: "Cash Credit Recovery Outlist" },
      { code: "14", name: "Loan Interest Outlist" },
    ],
  },
  adviceNumber: {
    title: "Advice List",
    codeField: "adviceNumber",
    codeLabel: "Advice No",
    nameLabel: "Description",
    rows: [
      { code: "ADV-001", name: "Installment Advice - Jul 2026" },
      { code: "ADV-002", name: "Installment Advice - Aug 2026" },
      { code: "ADV-003", name: "Installment Advice - Sep 2026" },
    ],
  },
};

export const DEFAULT_TL_CC_INSTALLMENT_DATA: TlCcInstallmentFormData = {
  isHoTransaction: true,
  accountType: "TL",
  accountCode: "401",
  accountName: "Gaveshvarmath Om Sadashiv",
  scrollNumber: "SCR-458712",
  glAccountCode: "GL-1001",
  glAccountName: "Term Loan Recovery GL",
  reviewDate: "2026-07-13",
  depositAmount: "50000.00",
  surcharge: "0.00",
  interestAmount: "500.00",
  installmentTypeId: "Monthly",
  openDate: "2026-01-13",
  period: "36",
  completedMonths: "6",
  overdue: "0.00",
  ledgerBalance: "50000.00",
  availableBalance: "50000.00",
  newLedgerBalance: "48611.11",
  interestRate: "8.5",
  modeOfPayment: "Cash",
  transferAccountCode: "402",
  transferAccountName: "Akshay Om More",
  paymentGlAccountCode: "GL-2001",
  paymentGlAccountName: "Cash Recovery GL",
  paymentLedgerBalance: "50000.00",
  paymentAvailableBalance: "50000.00",
  paymentNewLedgerBalance: "49500.00",
  particular: "By Cash",
  particular1: "By Cash",
  originalResponding: "Original",
  chequeType: "CHEQUE",
  chequeSeries: "A",
  chequeNumber: "000124",
  chequeDate: "2026-07-13",
  interestUpToDate: "2026-07-13",
  glOutlistNo: "12",
  glOutlistDocNo: "DOC-778812",
  adviceNumber: "ADV-001",
  adviceDate: "2026-07-13",
};

const REQUIRED_FIELDS = Object.keys(DEFAULT_TL_CC_INSTALLMENT_DATA).filter(
  (key) => key !== "isHoTransaction"
) as TextKey[];

const accountFields: FieldConfig[] = [
  { key: "accountType", label: "Account Type", labelHi: "खाते प्रकार", kind: "picker", picker: "accountCode", placeholder: "Select Account Code" },
  { key: "accountCode", label: "Account Code", labelHi: "खाते कोड", kind: "picker", picker: "accountCode", placeholder: "Select Account Code" },
  { key: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", kind: "readonly", placeholder: "Account Name" },
  { key: "scrollNumber", label: "Scroll Number", labelHi: "स्क्रोल क्रमांक", placeholder: "Scroll Number" },
  { key: "glAccountCode", label: "GL Account Code", labelHi: "ठेव कालावधी", placeholder: "GL Account Code" },
  { key: "glAccountName", label: "GL Account Name", labelHi: "स्क्रोल क्रमांक", placeholder: "GL Account Name" },
  { key: "reviewDate", label: "Review Date", labelHi: "व्याज दर", kind: "date" },
];

const summaryFields: FieldConfig[] = [
  { key: "depositAmount", label: "Deposit Amount", labelHi: "ठेव रक्कम" },
  { key: "surcharge", label: "Surcharge", labelHi: "अधिभार" },
  { key: "interestAmount", label: "Interest Amount", labelHi: "व्याज रक्कम" },
  { key: "installmentTypeId", label: "Installment Type ID", labelHi: "हप्ता प्रकार" },
  { key: "openDate", label: "Open Date", labelHi: "खाते उघडण्याची तारीख", kind: "date" },
  { key: "period", label: "Period", labelHi: "Period" },
  { key: "completedMonths", label: "Completed Months", labelHi: "पूर्ण महिने" },
  { key: "overdue", label: "Overdue", labelHi: "Overdue" },
  { key: "ledgerBalance", label: "Ledger Balance", labelHi: "खाते शिल्लक" },
  { key: "availableBalance", label: "Available Balance", labelHi: "उपलब्ध शिल्लक" },
  { key: "newLedgerBalance", label: "New Ledger Balance", labelHi: "नवीन खाते शिल्लक" },
  { key: "interestRate", label: "Interest Rate", labelHi: "व्याजदर" },
];

const paymentFields: FieldConfig[] = [
  { key: "modeOfPayment", label: "Mode of Payment", labelHi: "पेमेंट पद्धत", kind: "select", options: ["Cash", "Transfer", "Cheque"] },
  { key: "transferAccountCode", label: "Transfer A/c Code", labelHi: "रक्कम", kind: "picker", picker: "transferAccountCode" },
  { key: "transferAccountName", label: "Transfer A/c Name", labelHi: "रक्कम", kind: "readonly" },
  { key: "paymentGlAccountCode", label: "GL Account Code", labelHi: "ठेव कालावधी" },
  { key: "paymentGlAccountName", label: "GL Account Name", labelHi: "स्क्रोल क्रमांक" },
  { key: "paymentLedgerBalance", label: "Ledger Balance", labelHi: "खाते शिल्लक" },
  { key: "paymentAvailableBalance", label: "Available Balance", labelHi: "उपलब्ध शिल्लक" },
  { key: "paymentNewLedgerBalance", label: "New Ledger Balance", labelHi: "नवीन खाते शिल्लक" },
  { key: "particular", label: "Particular", labelHi: "तपशील" },
  { key: "particular1", label: "Particular 1", labelHi: "तपशील" },
  { key: "originalResponding", label: "Original / Responding", labelHi: "मूळ / प्रतिसाद", kind: "select", options: ["Original", "Responding"] },
  { key: "chequeType", label: "Cheque Type", labelHi: "धनादेश प्रकार", kind: "picker", picker: "chequeType" },
  { key: "chequeSeries", label: "Cheque Series", labelHi: "धनादेश मालिका" },
  { key: "chequeNumber", label: "Cheque Number", labelHi: "धनादेश क्रमांक" },
  { key: "chequeDate", label: "Cheque Date", labelHi: "धनादेश तारीख", kind: "date" },
  { key: "interestUpToDate", label: "Interest Upto Date", labelHi: "व्याज अंतिम तारीख", kind: "date" },
];

const postingFields: FieldConfig[] = [
  { key: "glOutlistNo", label: "GL Out List No", labelHi: "GL बाह्य यादी क्रमांक", kind: "picker", picker: "glOutlistNo" },
  { key: "glOutlistDocNo", label: "GL Out List Doc. No", labelHi: "GL दस्तऐवज क्रमांक" },
  { key: "adviceNumber", label: "Advice Number", labelHi: "सल्ला क्रमांक", kind: "picker", picker: "adviceNumber" },
  { key: "adviceDate", label: "Advice Date", labelHi: "सल्ला तारीख", kind: "date" },
];

const validateTlCcInstallment = (data: TlCcInstallmentFormData) => {
  const errors = {} as Record<keyof TlCcInstallmentFormData, boolean>;
  REQUIRED_FIELDS.forEach((field) => {
    errors[field] = data[field].trim() === "";
  });
  errors.isHoTransaction = false;
  return errors;
};

const saveTlCcInstallment = (data: TlCcInstallmentFormData) =>
  new Promise<TlCcInstallmentFormData>((resolve) => {
    setTimeout(() => resolve(data), 600);
  });

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

const currencyIcon = <IndianRupee size={16} />;
const textIcon = <FileText size={16} />;

const RecoveryMetric = ({
  label,
  labelHi,
  value,
  tone,
}: {
  label: string;
  labelHi: string;
  value: string;
  tone: string;
}) => (
  <div className={`rounded-lg border p-4 ${tone}`}>
    <p className="text-sm font-semibold">{label} / {labelHi}</p>
    <p className="mt-2 text-2xl font-bold">Rs {value}</p>
  </div>
);

const MoneyInput = ({ readOnly = false }: { readOnly?: boolean }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">Rs</span>
    <input
      type="text"
      defaultValue="0.0"
      readOnly={readOnly}
      className={`h-9 w-full rounded-lg border py-2 pl-9 pr-3 text-right text-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
        readOnly
          ? "border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800"
          : "border-primary-400 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-100"
      }`}
    />
  </div>
);

const RecoveryTable = ({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; labelHi: string }[];
}) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-[#211C56] px-4 py-3 text-sm font-semibold text-white">
      <div>{title}</div>
      <div>Calculated</div>
      <div>Recovery</div>
    </div>
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-1 gap-3 px-4 py-2.5 sm:grid-cols-[1.1fr_1fr_1fr] sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{row.label}</p>
            <p className="text-xs text-slate-500">{row.labelHi}</p>
          </div>
          <MoneyInput readOnly />
          <MoneyInput />
        </div>
      ))}
    </div>
  </div>
);

export interface AddTlCcInstallmentProps {
  onClose: () => void;
  onSave?: (data: TlCcInstallmentFormData) => void;
  variant?: "modal" | "page";
}

const AddTlCcInstallment = ({ onClose, onSave, variant = "modal" }: AddTlCcInstallmentProps) => {
  const [form, setForm] = useState<TlCcInstallmentFormData>(DEFAULT_TL_CC_INSTALLMENT_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof TlCcInstallmentFormData, boolean>>>({});
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const markDirty = (field: keyof TlCcInstallmentFormData) => {
    setIsValidated(false);
    setErrors((current) => (current[field] ? { ...current, [field]: false } : current));
  };

  const updateField = (field: TextKey, value: string) => {
    markDirty(field);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handlePickRow = (row: PickRow) => {
    if (!activePicker) return;
    const picker = PICKER_CONFIG[activePicker];
    markDirty(picker.codeField);
    if (picker.nameField) markDirty(picker.nameField);
    setForm((current) => ({
      ...current,
      [picker.codeField]: row.code,
      ...(picker.nameField ? { [picker.nameField]: row.name } : {}),
    }));
    setActivePicker(null);
  };

  const handleValidate = () => {
    const nextErrors = validateTlCcInstallment(form);
    const hasErrors = Object.values(nextErrors).some(Boolean);
    setErrors(nextErrors);
    setIsValidated(!hasErrors);
    toast[hasErrors ? "error" : "success"](
      hasErrors ? "Please fill all required fields before validating." : "All fields validated successfully."
    );
  };

  const handleSave = async () => {
    if (!isValidated || isSaving) return;
    setIsSaving(true);
    await saveTlCcInstallment(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const renderField = (field: FieldConfig) => {
    const value = form[field.key];
    const error = errors[field.key];
    const icon = field.key.toLowerCase().includes("amount") || field.key.toLowerCase().includes("balance") || field.key === "surcharge" || field.key === "overdue" ? currencyIcon : textIcon;

    return (
      <FieldShell key={field.key} label={field.label} labelHi={field.labelHi} required error={error}>
        {field.kind === "date" && <DateInput value={value} onChange={(next) => updateField(field.key, next)} error={error} />}
        {field.kind === "select" && (
          <SelectInput
            icon={icon}
            value={value}
            onChange={(next) => updateField(field.key, next)}
            options={field.options ?? []}
            placeholder={field.placeholder ?? "Select"}
            error={error}
          />
        )}
        {field.kind === "picker" && field.picker && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <TextInput icon={icon} value={value} onChange={(next) => updateField(field.key, next)} placeholder={field.placeholder ?? field.label} error={error}  />
            </div>
            <LookupTrigger onClick={() => setActivePicker(field.picker ?? null)} />
          </div>
        )}
        {field.kind === "readonly" && <TextInput icon={icon} value={value} onChange={() => {}} readOnly error={error} />}
        {!field.kind && <TextInput icon={icon} value={value} onChange={(next) => updateField(field.key, next)} placeholder={field.placeholder ?? field.label} error={error} />}
      </FieldShell>
    );
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={() => {
          onSave?.(form);
          setShowSuccess(false);
          onClose();
        }}
        title="TL/CC Installment Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <div className={`flex flex-col gap-6 bg-white rounded-md dark:bg-slate-950 ${variant === "modal" ? "p-3" : "px-3 py-2"}`} 
      
    >
      <SectionCard titleEn="Account Details" titleHi="खाते तपशील" subtitleEn="Manage customer's personal and identity information." subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा." icon={<SectionIcon />}>
        <div className={`${grid4} mt-2`}>
          <RadioYesNo label="Is Ho Transaction" labelHi="अतिरिक्त व्याज गणना" value={form.isHoTransaction} onChange={(value) => setForm((current) => ({ ...current, isHoTransaction: value }))} />
          {accountFields.map(renderField)}
        </div>
      </SectionCard>

      <SectionCard titleEn="Account Summary" titleHi="ठेव सारांश" subtitleEn="Manage customer's personal and identity information." subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा." icon={<SectionIcon />}>
        <div className={`${grid4} mt-2`}>{summaryFields.map(renderField)}</div>
      </SectionCard>

      <SectionCard titleEn="Payment Details" titleHi="पेमेंट तपशील" subtitleEn="Manage customer's personal and identity information." subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा." icon={<SectionIcon />}>
        <div className={`${grid4} mt-2`}>{paymentFields.map(renderField)}</div>
      </SectionCard>

      <SectionCard titleEn="GL Posting Details" titleHi="व्याज तपशील" subtitleEn="Manage customer's personal and identity information." subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा." icon={<SectionIcon />}>
        <div className={`${grid4} mt-2`}>{postingFields.map(renderField)}</div>
      </SectionCard>

      <SectionCard titleEn="Recovery Summary" titleHi="व्याज तपशील" subtitleEn="Manage customer's personal and identity information." subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा." icon={<SectionIcon />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RecoveryMetric label="Total Deposit Amount" labelHi="एकूण ठेव रक्कम" value={form.depositAmount} tone="border-blue-100 bg-blue-50 text-blue-700" />
          <RecoveryMetric label="Principal Amount" labelHi="मूळ रक्कम" value="1,388.89" tone="border-indigo-100 bg-indigo-50 text-indigo-700" />
          <RecoveryMetric label="Interest Amount" labelHi="व्याज रक्कम" value={form.interestAmount} tone="border-violet-100 bg-violet-50 text-violet-700" />
          <RecoveryMetric label="Charges Amount" labelHi="शुल्क रक्कम" value="0.00" tone="border-emerald-100 bg-emerald-50 text-emerald-700" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <RecoveryTable
            title="Receivable"
            rows={[
              { label: "Insurance", labelHi: "विमा" },
              { label: "Insurance Fire", labelHi: "अग्नी विमा" },
              { label: "ABN Fees", labelHi: "ABN शुल्क" },
              { label: "Execution Fees", labelHi: "अंमलबजावणी शुल्क" },
              { label: "Recovery Charges", labelHi: "वसुली शुल्क" },
              { label: "Interest", labelHi: "व्याज" },
              { label: "Other Charges", labelHi: "इतर शुल्क" },
              { label: "Charges Head", labelHi: "रक्कम" },
            ]}
          />
          <RecoveryTable
            title="Interest"
            rows={[
              { label: "Normal", labelHi: "नियमित" },
              { label: "Overdue", labelHi: "देय" },
              { label: "Moratorium", labelHi: "स्थगिती" },
              { label: "Penal Rec.", labelHi: "दंड वसुली" },
              { label: "Penal Int.", labelHi: "दंड व्याज" },
              { label: "Unrecovered", labelHi: "न वसूल" },
              { label: "Pending OIR", labelHi: "प्रलंबित OIR" },
            ]}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-lg bg-blue-50 p-4 text-primary sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold">Total recovery will be debited from the selected account after Save.</p>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-xs font-semibold text-primary-400">Total Calculated</p>
              <p className="text-2xl font-bold">Rs 500.00</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-400">Total Recovery</p>
              <p className="text-2xl font-bold">Rs 500.00</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button type="button" onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">
          Validate <Check size={16} />
        </button>
        <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50 dark:bg-slate-900">
          Cancel <X size={16} />
        </button>
        <button type="button" onClick={() => toast.info("Print Voucher will be implemented.")} className="flex items-center gap-1.5 rounded-lg border border-transparent bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300">
          Print Voucher <Printer size={16} />
        </button>
        <button type="button" onClick={handleSave} disabled={!isValidated || isSaving} className={`flex items-center gap-1.5 rounded-lg border border-transparent px-6 py-2.5 text-sm font-medium transition-colors ${isValidated && !isSaving ? "bg-primary text-white hover:bg-primary-700" : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"}`}>
          {isSaving ? "Saving..." : "Save"} <ChevronDown size={16} />
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
    </div >
  );
};

export default AddTlCcInstallment;
