 
import { useState } from "react";
import {
  User,
  IdCard,
  Building2,
  Calendar,
  FileText,
  Hash,
  IndianRupee,
  Percent,
  CreditCard,
  Wallet,
  MoreVertical,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import FormModal from "../shared/FormModal";
import { FieldShell, TextInput, DateInput, RadioYesNo, SectionCard } from "../shared/FormFields";
import AccountCodePickerModal from "./ListModal";
import SuccessModal from "../shared/SuccessModal";
 
/* ===================== Account picker data ===================== */
 
export interface AccountOption {
  code: string;
  name: string;
  customerName: string;
  glAccountCode: string;
}
 
const ACCOUNT_OPTIONS: AccountOption[] = [
  { code: "AC001", name: "Term Deposit - Ramesh Kulkarni", customerName: "Ramesh Kulkarni", glAccountCode: "GL1001" },
  { code: "AC002", name: "Term Deposit - Sunita Patil", customerName: "Sunita Patil", glAccountCode: "GL1002" },
  { code: "AC003", name: "Term Deposit - Vikram Joshi", customerName: "Vikram Joshi", glAccountCode: "GL1003" },
];
 
/* ===================== Local Select field ===================== */
/*
  No shared Select exists in FormFields yet, so a small local one is
  used here to match the same visual language (icon, border, focus ring)
  as TextInput. Swap this out for a shared component if one gets added.
*/
interface SelectFieldProps {
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}
 
function SelectField({ icon, value, onChange, options, placeholder, error, disabled }: SelectFieldProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border bg-white dark:bg-slate-900 px-3 py-2.5 text-sm transition-colors ${
        error ? "border-red-400" : "border-slate-600 dark:border-slate-700"
      } ${disabled ? "bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500" : "focus-within:border-blue-500"}`}
    >
      {icon && <span className="text-slate-400">{icon}</span>}
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full flex-1 appearance-none bg-transparent text-slate-700 dark:text-slate-100 outline-none disabled:cursor-not-allowed"
      >
        <option value="" disabled>
          {placeholder || "Select"}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="shrink-0 text-slate-400" />
    </div>
  );
}
 
/* ===================== Types ===================== */
 
export interface DepositCloseFormData {
  // Account Details
  accountCode: string;
  accountName: string;
  customerName: string;
  glAccountCode: string;
  accountOpenDate: string;
  scrollNumber: string;
  memo: string;
  isAdditionalIntCal: boolean;
 
  // Deposit Summary
  depositAmount: string;
  maturityDate: string;
  maturityValue: string;
  periodOfDeposit: string;
  availableBalance: string;
  ledgerBalance: string;
  totalWithdrawalAmount: string;
  amountInMaturedDeposit: string;
 
  // Interest Details
  interestRate: string;
  applicableInterestRate: string;
  interestPayable: string;
  interestPaid: string;
  pendingCashInterest: string;
  additionalInterest: string;
  newInterest: string;
  prematureInterest: string;
  afterMaturityInterestRate: string;
  afterMaturityDays: string;
  modifiedNewInterest: string;
  completedDays: string;
 
  // Tax (TDS) Information
  panNumber: string;
  tdsAmount: string;
  newTdsAmount: string;
  totalTdsAmount: string;
  form15G: boolean;
  form15H: boolean;
 
  // Payment Details
  modeOfPayment: string;
  paymentAmount: string;
 
  // GL Details
  particular: string;
  glOutlistNo: string;
  glOutlistDescription: string;
  outlistDocNo: string;
  glAmount: string;
  adviceNumber: string;
  adviceDate: string;
  tokenNumber: string;
  oAndR: string;
}
 
const DEFAULT_DATA: DepositCloseFormData = {
  accountCode: "",
  accountName: "",
  customerName: "",
  glAccountCode: "",
  accountOpenDate: "",
  scrollNumber: "",
  memo: "",
  isAdditionalIntCal: true,
 
  depositAmount: "",
  maturityDate: "",
  maturityValue: "",
  periodOfDeposit: "",
  availableBalance: "",
  ledgerBalance: "",
  totalWithdrawalAmount: "",
  amountInMaturedDeposit: "",
 
  interestRate: "",
  applicableInterestRate: "",
  interestPayable: "",
  interestPaid: "",
  pendingCashInterest: "",
  additionalInterest: "",
  newInterest: "",
  prematureInterest: "",
  afterMaturityInterestRate: "",
  afterMaturityDays: "",
  modifiedNewInterest: "",
  completedDays: "",
 
  panNumber: "",
  tdsAmount: "",
  newTdsAmount: "",
  totalTdsAmount: "",
  form15G: true,
  form15H: true,
 
  modeOfPayment: "",
  paymentAmount: "",
 
  particular: "",
  glOutlistNo: "",
  glOutlistDescription: "",
  outlistDocNo: "",
  glAmount: "",
  adviceNumber: "",
  adviceDate: "",
  tokenNumber: "",
  oAndR: "",
};
 
const REQUIRED_FIELDS: { key: keyof DepositCloseFormData; label: string }[] = [
  { key: "accountCode", label: "Account Code" },
  { key: "accountName", label: "Account Name" },
  { key: "customerName", label: "Customer Name" },
  { key: "glAccountCode", label: "GL Account Code" },
  { key: "accountOpenDate", label: "Account Open Date" },
  { key: "scrollNumber", label: "Scroll Number" },
  { key: "memo", label: "Memo" },
 
  { key: "depositAmount", label: "Deposit Amount" },
  { key: "maturityDate", label: "Maturity Date" },
  { key: "maturityValue", label: "Maturity Value" },
  { key: "periodOfDeposit", label: "Period of Deposit" },
  { key: "availableBalance", label: "Available Balance" },
  { key: "ledgerBalance", label: "Ledger Balance" },
  { key: "totalWithdrawalAmount", label: "Total Withdrawal Amount" },
  { key: "amountInMaturedDeposit", label: "Amount in Matured Deposit" },
 
  { key: "interestRate", label: "Interest Rate" },
  { key: "applicableInterestRate", label: "Applicable Interest Rate" },
  { key: "interestPayable", label: "Interest Payable" },
  { key: "interestPaid", label: "Interest Paid" },
  { key: "pendingCashInterest", label: "Pending Cash Interest" },
  { key: "additionalInterest", label: "Additional Interest" },
  { key: "newInterest", label: "New Interest" },
  { key: "prematureInterest", label: "Premature Interest" },
  { key: "afterMaturityInterestRate", label: "After Maturity Interest Rate" },
  { key: "afterMaturityDays", label: "After Maturity Days" },
  { key: "modifiedNewInterest", label: "Modified New Interest" },
  { key: "completedDays", label: "Completed Days" },
 
  { key: "panNumber", label: "PAN Number" },
  { key: "tdsAmount", label: "TDS Amount" },
  { key: "newTdsAmount", label: "New TDS Amount" },
  { key: "totalTdsAmount", label: "Total TDS Amount" },
 
  { key: "modeOfPayment", label: "Mode of Payment" },
  { key: "paymentAmount", label: "Amount" },
 
  { key: "particular", label: "Particular" },
  { key: "glOutlistNo", label: "GL Outlist No." },
  { key: "glOutlistDescription", label: "GL Outlist Description" },
  { key: "outlistDocNo", label: "Outlist Doc. No." },
  { key: "glAmount", label: "Amount" },
  { key: "adviceNumber", label: "Advice Number" },
  { key: "adviceDate", label: "Advice Date" },
  { key: "tokenNumber", label: "Token Number" },
  { key: "oAndR", label: "O & R" },
];
 
const MODE_OF_PAYMENT_OPTIONS = [
  { label: "Cash", value: "cash" },
  { label: "Cheque", value: "cheque" },
  { label: "NEFT", value: "neft" },
  { label: "RTGS", value: "rtgs" },
  { label: "Transfer", value: "transfer" },
];
 
const GL_OUTLIST_DESCRIPTION_OPTIONS = [
  { label: "By Cash", value: "by_cash" },
  { label: "By Transfer", value: "by_transfer" },
  { label: "By Cheque", value: "by_cheque" },
];
 
const TOKEN_NUMBER_OPTIONS = [
  { label: "Auto Generate", value: "auto" },
  { label: "Manual Entry", value: "manual" },
];
 
const O_AND_R_OPTIONS = [
  { label: "Receipt", value: "receipt" },
  { label: "Order", value: "order" },
];
 
/* ===================== DepositCloseModal ===================== */
 
export interface DepositCloseModalProps {
  open: boolean;
  initialData?: Partial<DepositCloseFormData>;
  onClose?: () => void;
  onSubmit?: (data: DepositCloseFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders inline, for routes that host the form directly. */
  variant?: "modal" | "page";
}

export default function DepositCloseModal({ open, initialData, onClose, onSubmit, variant = "modal" }: DepositCloseModalProps) {
  const [data, setData] = useState<DepositCloseFormData>({ ...DEFAULT_DATA, ...initialData });
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
 
  if (!open) return null;
 
  if (showSuccess) {
    return (
      <SuccessModal
        title="Term Deposit Closed Successfully"
        subtitle=""
        onClose={() => {
          setShowSuccess(false);
          onClose?.();
        }}
        onDone={() => {
          setShowSuccess(false);
          onClose?.();
        }}
      />
    );
  }
 
  const clearError = (key: string) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setIsValidated(false);
  };
 
  const set =
    <K extends keyof DepositCloseFormData>(key: K) =>
    (val: DepositCloseFormData[K]) => {
      setData((prev) => ({ ...prev, [key]: val }));
      clearError(key as string);
    };
 
  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
 
    REQUIRED_FIELDS.forEach(({ key, label }) => {
      const value = data[key];
      if (typeof value === "string" && !value.trim()) {
        nextErrors[key] = `${label} is required`;
      }
    });
 
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
 
  const handleValidate = () => setIsValidated(validate());
 
  const handleSave = () => {
    if (!isValidated) return;
    onSubmit?.(data);
    setShowSuccess(true);
  };
 
  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2";
  const grid3 = "grid grid-cols-1 gap-4 md:grid-cols-3";
 
  const footer = (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
      <button
        type="button"
        onClick={handleValidate}
        disabled={isValidated}
        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Validate <Check size={16} />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-lg border border-blue-500 px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-slate-800"
      >
        Cancel <X size={16} />
      </button>
      <button
        type="button"
        onClick={handleSave}
        disabled={!isValidated}
        className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save <ChevronDown size={16} />
      </button>
    </div>
  );
 
  return (
    <>
      <FormModal
        onClose={() => onClose?.()}
        titleEn="Deposit Close"
        titleHi="ठेव बंद करा"
        subtitleEn="Manage customer's deposit closure and settlement information."
        subtitleHi="ग्राहकाच्या ठेव बंद करण्याशी संबंधित माहिती व्यवस्थापित करा."
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        variant={variant}
      >
        {/* Account Details */}
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon="/User.png"
        >
          <div className={grid3}>
            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <TextInput
                    icon={<User size={16} />}
                    value={data.accountCode}
                    onChange={() => {}}
                    readOnly
                    placeholder="Select Account Code"
                    error={!!errors.accountCode}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setAccountPickerOpen(true)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                >
                  <MoreVertical size={14} />
                </button>
              </div>
              {errors.accountCode && <p className="mt-1 text-sm text-red-500">{errors.accountCode}</p>}
            </FieldShell>
 
            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly placeholder="Account Name" error={!!errors.accountName} />
              {errors.accountName && <p className="mt-1 text-sm text-red-500">{errors.accountName}</p>}
            </FieldShell>
 
            <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.customerName} onChange={() => {}} readOnly placeholder="Customer Name" error={!!errors.customerName} />
              {errors.customerName && <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>}
            </FieldShell>
 
          </div>
 
          <div className={`${grid3} mt-4`}>
             <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<IdCard size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly placeholder="GL Account Code" error={!!errors.glAccountCode} />
              {errors.glAccountCode && <p className="mt-1 text-sm text-red-500">{errors.glAccountCode}</p>}
            </FieldShell>
            <FieldShell label="Account Open Date" labelHi="खाते उघडण्याची तारीख" required>
              <DateInput
                value={data.accountOpenDate}
                onChange={set("accountOpenDate")}
                error={!!errors.accountOpenDate}
              />
              {errors.accountOpenDate && <p className="mt-1 text-sm text-red-500">{errors.accountOpenDate}</p>}
            </FieldShell>
 
            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <TextInput
                icon={<Hash size={16} />}
                value={data.scrollNumber}
                onChange={set("scrollNumber")}
                placeholder="Scroll Number"
                error={!!errors.scrollNumber}
              />
              {errors.scrollNumber && <p className="mt-1 text-sm text-red-500">{errors.scrollNumber}</p>}
            </FieldShell>
 
           
          </div>
          <div className="mt-6">
 
           <RadioYesNo
              label="Is Additional Int Cal."
              labelHi="अतिरिक्त व्याज गणना"
              value={data.isAdditionalIntCal}
              onChange={set("isAdditionalIntCal")}
             
            />
          </div>
        </SectionCard>
 
        {/* Deposit Summary */}
        <SectionCard
          titleEn="Deposit Summary"
          titleHi="ठेव सारांश"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon="/User.png"
        >
          <div className={grid3}>
            <FieldShell label="Deposit Amount" labelHi="ठेव सारांश" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.depositAmount} onChange={set("depositAmount")} placeholder="Deposit Amount" error={!!errors.depositAmount} />
              {errors.depositAmount && <p className="mt-1 text-sm text-red-500">{errors.depositAmount}</p>}
            </FieldShell>
 
            <FieldShell label="Maturity Date" labelHi="ठेव रक्कम" required>
              <DateInput value={data.maturityDate} onChange={set("maturityDate")} error={!!errors.maturityDate} />
              {errors.maturityDate && <p className="mt-1 text-sm text-red-500">{errors.maturityDate}</p>}
            </FieldShell>
 
            <FieldShell label="Maturity Value" labelHi="मुदतपूर्ती तारीख" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.maturityValue} onChange={set("maturityValue")} placeholder="Maturity Value" error={!!errors.maturityValue} />
              {errors.maturityValue && <p className="mt-1 text-sm text-red-500">{errors.maturityValue}</p>}
            </FieldShell>
 
            {/*  */}
          </div>
 
          <div className={`${grid3} mt-4`}>
            <FieldShell label="Period of Deposit" labelHi="मुदतपूर्ती मूल्य" required>
              <TextInput icon={<Calendar size={16} />} value={data.periodOfDeposit} onChange={set("periodOfDeposit")} placeholder="Period of Deposit" error={!!errors.periodOfDeposit} />
              {errors.periodOfDeposit && <p className="mt-1 text-sm text-red-500">{errors.periodOfDeposit}</p>}
            </FieldShell>
            <FieldShell label="Available Balance" labelHi="ठेव कालावधी" required>
              <TextInput icon={<Wallet size={16} />} value={data.availableBalance} onChange={set("availableBalance")} trailing={<IndianRupee size={16} />} error={!!errors.availableBalance} />
              {errors.availableBalance && <p className="mt-1 text-sm text-red-500">{errors.availableBalance}</p>}
            </FieldShell>
 
            <FieldShell label="Ledger Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<Wallet size={16} />} value={data.ledgerBalance} onChange={set("ledgerBalance")} trailing={<IndianRupee size={16} />} error={!!errors.ledgerBalance} />
              {errors.ledgerBalance && <p className="mt-1 text-sm text-red-500">{errors.ledgerBalance}</p>}
            </FieldShell>
 
            {/*  */}
          </div>
          <div className={`${grid3} mt-4`}>
            <FieldShell label="Total Withdrawal Amount" labelHi="काढलेली रक्कम" required>
              <TextInput icon={<Calendar size={16} />} value={data.totalWithdrawalAmount} onChange={set("totalWithdrawalAmount")} trailing={<IndianRupee size={16} />} error={!!errors.totalWithdrawalAmount} />
              {errors.totalWithdrawalAmount && <p className="mt-1 text-sm text-red-500">{errors.totalWithdrawalAmount}</p>}
            </FieldShell>
 
            <FieldShell label="Amount in Matured Deposit" labelHi="मुदतपूर्ती रक्कम" required>
              <TextInput icon={<Calendar size={16} />} value={data.amountInMaturedDeposit} onChange={set("amountInMaturedDeposit")} trailing={<IndianRupee size={16} />} error={!!errors.amountInMaturedDeposit} />
              {errors.amountInMaturedDeposit && <p className="mt-1 text-sm text-red-500">{errors.amountInMaturedDeposit}</p>}
            </FieldShell>
          </div>
        </SectionCard>
 
        {/* Interest Details */}
        <SectionCard
          titleEn="Interest Details"
          titleHi="व्याज तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon="/User.png"
        >
          <div className={grid3}>
            <FieldShell label="Interest Rate" labelHi="व्याज दर" required>
              <SelectField
                icon={<Percent size={16} />}
                value={data.interestRate}
                onChange={set("interestRate")}
                placeholder="Interest Rate %"
                options={[
                  { label: "5%", value: "5" },
                  { label: "6%", value: "6" },
                  { label: "7%", value: "7" },
                  { label: "8%", value: "8" },
                ]}
                error={!!errors.interestRate}
              />
              {errors.interestRate && <p className="mt-1 text-sm text-red-500">{errors.interestRate}</p>}
            </FieldShell>
 
            <FieldShell label="Applicable Interest Rate" labelHi="नालागू व्याज दरव" required>
              <TextInput icon={<Percent size={16} />} value={data.applicableInterestRate} onChange={set("applicableInterestRate")} placeholder="Applicable Interest Rate %" error={!!errors.applicableInterestRate} />
              {errors.applicableInterestRate && <p className="mt-1 text-sm text-red-500">{errors.applicableInterestRate}</p>}
            </FieldShell>
 
            <FieldShell label="Interest Payable" labelHi="देय व्याज" required>
              <TextInput icon={<Percent size={16} />} value={data.interestPayable} onChange={set("interestPayable")} placeholder="Interest Payable %" error={!!errors.interestPayable} />
              {errors.interestPayable && <p className="mt-1 text-sm text-red-500">{errors.interestPayable}</p>}
            </FieldShell>
 
         
          </div>
 
          <div className={`${grid3} mt-4`}>
              <FieldShell label="Interest Paid" labelHi="अदा केलेले व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestPaid} onChange={set("interestPaid")} placeholder="Interest Paid ₹" error={!!errors.interestPaid} />
              {errors.interestPaid && <p className="mt-1 text-sm text-red-500">{errors.interestPaid}</p>}
            </FieldShell>
            <FieldShell label="Pending Cash Interest" labelHi="प्रलंबित रोख व्याज" required>
              <TextInput icon={<Percent size={16} />} value={data.pendingCashInterest} onChange={set("pendingCashInterest")} placeholder="Pending Cash Interest %" error={!!errors.pendingCashInterest} />
              {errors.pendingCashInterest && <p className="mt-1 text-sm text-red-500">{errors.pendingCashInterest}</p>}
            </FieldShell>
 
            <FieldShell label="Additional Interest" labelHi="अतिरिक्त व्याज" required>
              <TextInput icon={<Percent size={16} />} value={data.additionalInterest} onChange={set("additionalInterest")} placeholder="Additional Interest %" error={!!errors.additionalInterest} />
              {errors.additionalInterest && <p className="mt-1 text-sm text-red-500">{errors.additionalInterest}</p>}
            </FieldShell>
 
            {/*  */}
          </div>
 
          <div className={`${grid3} mt-4`}>
            <FieldShell label="New Interest" labelHi="नवीन व्याज" required>
              <TextInput icon={<Calendar size={16} />} value={data.newInterest} onChange={set("newInterest")} placeholder="New Interest %" error={!!errors.newInterest} />
              {errors.newInterest && <p className="mt-1 text-sm text-red-500">{errors.newInterest}</p>}
            </FieldShell>
 
            <FieldShell label="Premature Interest" labelHi="मुदतपूर्व व्याज" required>
              <TextInput icon={<Calendar size={16} />} value={data.prematureInterest} onChange={set("prematureInterest")} placeholder="Premature Interest %" error={!!errors.prematureInterest} />
              {errors.prematureInterest && <p className="mt-1 text-sm text-red-500">{errors.prematureInterest}</p>}
            </FieldShell>
            <FieldShell label="After Maturity Interest Rate" labelHi="व्याज दर" required>
              <TextInput icon={<Percent size={16} />} value={data.afterMaturityInterestRate} onChange={set("afterMaturityInterestRate")} placeholder="After Maturity Interest Rate %" error={!!errors.afterMaturityInterestRate} />
              {errors.afterMaturityInterestRate && <p className="mt-1 text-sm text-red-500">{errors.afterMaturityInterestRate}</p>}
            </FieldShell>
          </div>
        </SectionCard>
 
        {/* Tax (TDS) Information */}
        <SectionCard
          titleEn="Tax (TDS) Information"
          titleHi="कर (टीडीएस) माहिती"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon="/User.png"
        >
          <div className={grid3}>
            <FieldShell label="PAN Number" labelHi="पॅन क्रमांक" required>
              <TextInput icon={<IdCard size={16} />} value={data.panNumber} onChange={set("panNumber")} placeholder="PAN Number" error={!!errors.panNumber} />
              {errors.panNumber && <p className="mt-1 text-sm text-red-500">{errors.panNumber}</p>}
            </FieldShell>
 
            <FieldShell label="TDS Amount" labelHi="टीडीएस रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.tdsAmount} onChange={set("tdsAmount")} placeholder="Enter TDS Amount" error={!!errors.tdsAmount} />
              {errors.tdsAmount && <p className="mt-1 text-sm text-red-500">{errors.tdsAmount}</p>}
            </FieldShell>
 
            <FieldShell label="New TDS Amount" labelHi="नवीन टीडीएस रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.newTdsAmount} onChange={set("newTdsAmount")} placeholder="New TDS Amount" error={!!errors.newTdsAmount} />
              {errors.newTdsAmount && <p className="mt-1 text-sm text-red-500">{errors.newTdsAmount}</p>}
            </FieldShell>
 
          </div>
 
          <div className={`${grid3} mt-4`}>
            <FieldShell label="Total TDS Amount" labelHi="एकूण टीडीएस रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.totalTdsAmount} onChange={set("totalTdsAmount")} placeholder="Total TDS Amount" error={!!errors.totalTdsAmount} />
              {errors.totalTdsAmount && <p className="mt-1 text-sm text-red-500">{errors.totalTdsAmount}</p>}
            </FieldShell>
            <RadioYesNo label="Form 15 G" labelHi="फॉर्म १५G" value={data.form15G} onChange={set("form15G")} />
            <RadioYesNo label="Form 15 H" labelHi="फॉर्म १५H" value={data.form15H} onChange={set("form15H")} />
          </div>
        </SectionCard>
 
        {/* Payment Details */}
        <SectionCard
          titleEn="Payment Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon="/User.png"
        >
          <div className={grid4}>
            <FieldShell label="Mode of Payment" labelHi="पेमेंट पद्धत" required>
              <SelectField
                icon={<CreditCard size={16} />}
                value={data.modeOfPayment}
                onChange={set("modeOfPayment")}
                placeholder="Select Mode of Payment"
                options={MODE_OF_PAYMENT_OPTIONS}
                error={!!errors.modeOfPayment}
              />
              {errors.modeOfPayment && <p className="mt-1 text-sm text-red-500">{errors.modeOfPayment}</p>}
            </FieldShell>
 
            <FieldShell label="Amount" labelHi="रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentAmount} onChange={set("paymentAmount")} placeholder="Enter Amount" error={!!errors.paymentAmount} />
              {errors.paymentAmount && <p className="mt-1 text-sm text-red-500">{errors.paymentAmount}</p>}
            </FieldShell>
          </div>
        </SectionCard>
 
        {/* GL Details */}
        <SectionCard
          titleEn="GL Details"
          titleHi="जीएल तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon="/User.png"
        >
          <div className={grid3}>
            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<User size={16} />} value={data.particular} onChange={set("particular")} placeholder="By Cash" error={!!errors.particular} />
              {errors.particular && <p className="mt-1 text-sm text-red-500">{errors.particular}</p>}
            </FieldShell>
 
            <FieldShell label="GL Outlist No." labelHi="जीएल आऊटलिस्ट क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.glOutlistNo} onChange={set("glOutlistNo")} placeholder="GL Outlist No." error={!!errors.glOutlistNo} />
              {errors.glOutlistNo && <p className="mt-1 text-sm text-red-500">{errors.glOutlistNo}</p>}
            </FieldShell>
 
            <FieldShell label="GL Outlist Description" labelHi="जीएल आऊटलिस्ट वर्णन" required>
              <SelectField
                icon={<FileText size={16} />}
                value={data.glOutlistDescription}
                onChange={set("glOutlistDescription")}
                placeholder="GL Outlist Description"
                options={GL_OUTLIST_DESCRIPTION_OPTIONS}
                error={!!errors.glOutlistDescription}
              />
              {errors.glOutlistDescription && <p className="mt-1 text-sm text-red-500">{errors.glOutlistDescription}</p>}
            </FieldShell>
 
            {/*  */}
          </div>
 
          <div className={`${grid3} mt-4`}>
            <FieldShell label="Outlist Doc. No." labelHi="आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.outlistDocNo} onChange={set("outlistDocNo")} placeholder="Outlist Doc No." error={!!errors.outlistDocNo} />
              {errors.outlistDocNo && <p className="mt-1 text-sm text-red-500">{errors.outlistDocNo}</p>}
            </FieldShell>
            <FieldShell label="Amount" labelHi="रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.glAmount} onChange={set("glAmount")} placeholder="Enter Amount" error={!!errors.glAmount} />
              {errors.glAmount && <p className="mt-1 text-sm text-red-500">{errors.glAmount}</p>}
            </FieldShell>
 
            <FieldShell label="Advice Number" labelHi="लिंग" required>
              <TextInput icon={<Hash size={16} />} value={data.adviceNumber} onChange={set("adviceNumber")} placeholder="Advice Number" error={!!errors.adviceNumber} />
              {errors.adviceNumber && <p className="mt-1 text-sm text-red-500">{errors.adviceNumber}</p>}
            </FieldShell>
 
          </div>
 
          <div className={`${grid3} mt-4`}>
 
            <FieldShell label="Advice Date" labelHi="लिंग" required>
              <DateInput value={data.adviceDate} onChange={set("adviceDate")} error={!!errors.adviceDate} />
              {errors.adviceDate && <p className="mt-1 text-sm text-red-500">{errors.adviceDate}</p>}
            </FieldShell>
 
            <FieldShell label="Token Number" labelHi="लिंग" required>
              <SelectField
                icon={<Hash size={16} />}
                value={data.tokenNumber}
                onChange={set("tokenNumber")}
                placeholder="Token Number"
                options={TOKEN_NUMBER_OPTIONS}
                error={!!errors.tokenNumber}
              />
              {errors.tokenNumber && <p className="mt-1 text-sm text-red-500">{errors.tokenNumber}</p>}
            </FieldShell>
            <FieldShell label="O & R" labelHi="लिंग" required>
              <SelectField
                icon={<FileText size={16} />}
                value={data.oAndR}
                onChange={set("oAndR")}
                placeholder="O & R"
                options={O_AND_R_OPTIONS}
                error={!!errors.oAndR}
              />
              {errors.oAndR && <p className="mt-1 text-sm text-red-500">{errors.oAndR}</p>}
            </FieldShell>
          </div>
        </SectionCard>
 
        {footer}
      </FormModal>
 
      {accountPickerOpen && (
        <AccountCodePickerModal
          title="Account Code List"
          columns={[
            { key: "code", label: "Account Code" },
            { key: "name", label: "Account Name" },
          ]}
          rows={ACCOUNT_OPTIONS}
          onClose={() => setAccountPickerOpen(false)}
          onSelect={(account: AccountOption) => {
            setData((prev) => ({
              ...prev,
              accountCode: account.code,
              accountName: account.name,
              customerName: account.customerName,
              glAccountCode: account.glAccountCode,
            }));
            clearError("accountCode");
            setAccountPickerOpen(false);
          }}
        />
      )}
    </>
  );
}
 