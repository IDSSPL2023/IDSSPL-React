import React, { useState } from 'react';
import {
  User,
  CreditCard,
  FileText,
  ClipboardList,
  RefreshCw,
  MoreVertical,
  Calendar,
  ChevronDown,
  MapPin,
  IndianRupee,
  Hash,
  Building2,
  ScrollText,
  PiggyBank,
  Clock,
  CalendarDays,
  AlertCircle,
  Percent,
  Receipt,
  FileCheck,
  FileSpreadsheet,
  Table,
  Check,
  X,
  Printer
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import { useBilingual } from "@/i18n/useBilingual";
import { DateInput, FieldShell, SectionCard, TextInput } from '@/components/shared/FormFields';
import ListModal from '@/components/AccountMaster/ListModal';
import { SuccessModal } from '@/components/common';
import { IMAGES } from "@/assets";

// ==========================================
// TYPES
// ==========================================

interface FormData {
  // Account Details
  isHoTransaction: string;
  accountCode: string;
  accountName: string;
  glAccountCode: string;
  description: string;
  ledgerBalance: string;
  availableBalance: string;
  scrollNumber: string;
  interestRate: string;
  
  // Payment Details
  modeOfPayment: string;
  transferAcCode: string;
  transferAcName: string;
  renewal: string;
  depositAmount: string;
  refundAmount: string;
  surcharge: string;
  completedMonths: string;
  overdue: string;
  particular: string;
  particular1: string;
  
  // Accounting Details
  outlistSerialNo: string;
  outlistDescription: string;
  outlistDocNo: string;
  serviceCharges: string;
  adviceNumber: string;
  adviceDate: string;
  acReviewDate: string;
  orgResponding: string;
  serviceTax: string;
  interestCalculationDate: string;
  
  // Recovery Summary
  totalDepositAmount: string;
  principalAmount: string;
  interestAmountRecovery: string;
  chargesAmount: string;
}

// ==========================================
// REUSABLE COMPONENTS (From Reference)
// ==========================================

/* ===================== Currency Input Field ===================== */
interface CurrencyInputProps {
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  error?: boolean;
}

function CurrencyInput({ value, onChange, readOnly = false, placeholder = "", error = false }: CurrencyInputProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 text-sm transition-colors ${
        error ? "border-red-400" : "border-slate-600"
      } ${readOnly ? "bg-slate-50" : "focus-within:border-blue-500"}`}
    >
      <IndianRupee size={16} className="text-slate-400 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full flex-1 bg-transparent outline-none ${
          readOnly ? "text-slate-500 cursor-not-allowed" : "text-slate-700"
        }`}
      />
    </div>
  );
}

/* ===================== Local Select field ===================== */
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
      className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 text-sm transition-colors ${
        error ? "border-red-400" : "border-slate-600"
      } ${disabled ? "bg-slate-50 text-slate-400" : "focus-within:border-blue-500"}`}
    >
      {icon && <span className="text-slate-400">{icon}</span>}
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full flex-1 appearance-none bg-transparent text-slate-700 outline-none disabled:cursor-not-allowed"
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

/* ===================== Reusable picklist field ===================== */
interface PickerCodeFieldProps {
  label: string;
  labelHi: string;
  value: string;
  placeholder?: string;
  error?: boolean;
  onPickerClick: () => void;
}

function PickerCodeField({ label, labelHi, value, placeholder, error, onPickerClick }: PickerCodeFieldProps) {
  return (
    <FieldShell label={label} labelHi={labelHi} required error={error}>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <TextInput icon={<User size={16} />} value={value} onChange={() => {}} readOnly placeholder={placeholder} />
        </div>
        <button
          type="button"
          onClick={onPickerClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
        >
          <MoreVertical size={14} />
        </button>
      </div>
    </FieldShell>
  );
}

// ==========================================
// PICKER DATA
// ==========================================

interface AccountOption {
  code: string;
  name: string;
  ledgerBalance?: string;
  availableBalance?: string;
}

const ACCOUNT_OPTIONS: AccountOption[] = [
  { code: "AC101", name: "Savings - Ramesh Kulkarni", ledgerBalance: "24500", availableBalance: "24000" },
  { code: "AC102", name: "Savings - Sunita Patil", ledgerBalance: "18200", availableBalance: "18200" },
  { code: "AC103", name: "Savings - Vikram Joshi", ledgerBalance: "9800", availableBalance: "9500" },
];

const TRANSFER_ACCOUNT_OPTIONS: AccountOption[] = [
  { code: "00021010000163", name: "MATURED JEEVAN SIRI DEPOSIT" },
  { code: "00021010000171", name: "SUSPENSE ACCOUNT" },
  { code: "00021010000188", name: "SUNDRY DEPOSIT ACCOUNT" },
];

const INTEREST_RATE_OPTIONS = [
  { label: "5%", value: "5" },
  { label: "6%", value: "6" },
  { label: "7%", value: "7" },
  { label: "8%", value: "8" },
  { label: "8.5%", value: "8.5" },
  { label: "9%", value: "9" },
  { label: "10%", value: "10" },
];

const MODE_OF_PAYMENT_OPTIONS = [
  { label: "Cash", value: "cash" },
  { label: "Cheque", value: "cheque" },
  { label: "NEFT", value: "neft" },
  { label: "RTGS", value: "rtgs" },
  { label: "Transfer", value: "transfer" },
];

const OUTLIST_DESCRIPTION_OPTIONS = [
  { label: "GL Outlist Description 1", value: "desc1" },
  { label: "GL Outlist Description 2", value: "desc2" },
  { label: "GL Outlist Description 3", value: "desc3" },
];

const ORG_RESPONDING_OPTIONS = [
  { label: "ORG-001", value: "ORG-001" },
  { label: "ORG-002", value: "ORG-002" },
  { label: "ORG-003", value: "ORG-003" },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AccountClosingLoanPage() {
  const { en } = useBilingual();
  const [formData, setFormData] = useState<FormData>({
    isHoTransaction: 'yes',
    accountCode: '',
    accountName: 'Suresh Kumar Sharma',
    glAccountCode: '',
    description: 'Suresh Kumar Sharma',
    ledgerBalance: '50,000.00',
    availableBalance: '50,000.00',
    scrollNumber: '',
    interestRate: '8.5',
    modeOfPayment: 'NEFT',
    transferAcCode: '',
    transferAcName: '',
    renewal: 'yes',
    depositAmount: '50,000.00',
    refundAmount: '0.00',
    surcharge: '0.00',
    completedMonths: '12',
    overdue: '0.00',
    particular: 'By Cash',
    particular1: 'By Cash',
    outlistSerialNo: '001',
    outlistDescription: 'GL Outlist Description',
    outlistDocNo: 'DOC-001',
    serviceCharges: '0.00',
    adviceNumber: 'ADV-001',
    adviceDate: '09-JUL-2026',
    acReviewDate: '09-JUL-2026',
    orgResponding: 'ORG-001',
    serviceTax: '0.00',
    interestCalculationDate: '09-JUL-2026',
    totalDepositAmount: '50,000.00',
    principalAmount: '1,388.89',
    interestAmountRecovery: '500.00',
    chargesAmount: '0.00',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);
  const [transferAccountPickerOpen, setTransferAccountPickerOpen] = useState(false);

  const clearError = (key: string) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setIsValidated(false);
  };

  const set =
    <K extends keyof FormData>(key: K) =>
    (val: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: val }));
      clearError(key as string);
    };

  const handleRenewalChange = (value: string) => {
    setFormData((prev) => ({ ...prev, renewal: value }));
  };

  const handleBack = () => {
    window.history.back();
  };

  const REQUIRED_FIELDS: (keyof FormData)[] = [
    "accountCode",
    "accountName",
    "glAccountCode",
    "description",
    "ledgerBalance",
    "availableBalance",
    "scrollNumber",
    "interestRate",
    "modeOfPayment",
    "transferAcCode",
    "transferAcName",
    "depositAmount",
    "refundAmount",
    "surcharge",
    "completedMonths",
    "overdue",
    "particular",
    "particular1",
    "outlistSerialNo",
    "outlistDescription",
    "outlistDocNo",
    "serviceCharges",
    "adviceNumber",
    "adviceDate",
    "acReviewDate",
    "orgResponding",
    "serviceTax",
    "interestCalculationDate",
  ];

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) {
        nextErrors[key] = "required";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    const valid = validate();
    setIsValidated(valid);
    if (valid) {
      console.log('Validation passed');
    }
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  const handlePrintVoucher = () => {
    console.log('Print Voucher clicked');
  };

  const handleSave = () => {
    if (!isValidated) return;
    console.log('Save clicked', formData);
    setShowSuccess(true);
  };

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  if (showSuccess) {
    return (
      <SuccessModal
        title="Loan Account Closed Successfully"
        subtitle=""
        onClose={() => {
          setShowSuccess(false);
        }}
        onDone={() => {
          setShowSuccess(false);
        }}
      />
    );
  }

  const footer = (
    <div className="flex items-center justify-end gap-3 mt-6 pb-4">
      <button
        onClick={handleValidate}
        disabled={isValidated}
        className="flex items-center gap-1.5 px-5 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Validate <span>✓</span>
      </button>
      
      <button
        onClick={handleCancel}
        className="flex items-center gap-1.5 px-5 py-2 bg-white border border-[#0b66c2] text-[#0b66c2] hover:bg-slate-50 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
      >
        Cancel <span className="text-[10px]">✕</span>
      </button>
      
      <button
        onClick={handlePrintVoucher}
        className="flex items-center gap-1.5 px-4 py-2 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-700 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
      >
        Print Voucher <span className="text-xs">🖨️</span>
      </button>
      
      <button
        onClick={handleSave}
        disabled={!isValidated}
        className="flex items-center gap-4 px-6 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save <span className="text-[10px]">▼</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen app-page-bg">
      <NavbarCM
        titleEn="Loan Closing"
        titleHi="कर्ज बंद करा"
        breadcrumbs={[
          { label: en('common.home'), href: '/dashboard' },
          { label: en('sidebar.clerk'), href: '#' },
          { label: en('sidebar.accountClosing'), href: '/account-closing' },
          { label: 'Loan', href: '/account-closing/loan' },
        ]}
        onBack={handleBack}
        hideActions
      />

      <div className="px-6 py-3 space-y-4 max-w-8xl mx-auto">
        {/* Section 1: Account Details */}
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={IMAGES.PERSON_ICON}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PickerCodeField
              label="Account Code"
              labelHi="खाते कोड"
              value={formData.accountCode}
              placeholder="Select Account Code"
              error={!!errors.accountCode}
              onPickerClick={() => setAccountPickerOpen(true)}
            />

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required error={!!errors.accountName}>
              <TextInput icon={<User size={16} />} value={formData.accountName} onChange={() => {}} readOnly placeholder="Account Name" error={!!errors.accountName} />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required error={!!errors.glAccountCode}>
              <TextInput icon={<Hash size={16} />} value={formData.glAccountCode} onChange={set("glAccountCode")} placeholder="GL Account Code" error={!!errors.glAccountCode} />
            </FieldShell>

            <FieldShell label="Description" labelHi="प्रक्रियाचे नाव" required error={!!errors.description}>
              <TextInput icon={<FileText size={16} />} value={formData.description} onChange={set("description")} placeholder="Customer Name" error={!!errors.description} />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="उपलब्ध शिल्पक" required error={!!errors.ledgerBalance}>
              <CurrencyInput 
                value={formData.ledgerBalance} 
                readOnly={true}
                error={!!errors.ledgerBalance}
              />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="दैव कालावधी" required error={!!errors.availableBalance}>
              <CurrencyInput 
                value={formData.availableBalance} 
                readOnly={true}
                error={!!errors.availableBalance}
              />
            </FieldShell>

            <FieldShell label="Scroll Number" labelHi="स्कोल क्रमांक" required error={!!errors.scrollNumber}>
              <TextInput icon={<ScrollText size={16} />} value={formData.scrollNumber} onChange={set("scrollNumber")} placeholder="Scroll Number" error={!!errors.scrollNumber} />
            </FieldShell>

            <FieldShell label="Interest Rate" labelHi="व्याज दर" required error={!!errors.interestRate}>
              <SelectField
                icon={<Percent size={16} />}
                value={formData.interestRate}
                onChange={set("interestRate")}
                placeholder="Interest Rate %"
                options={INTEREST_RATE_OPTIONS}
                error={!!errors.interestRate}
              />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Section 2: Payment Details */}
        <SectionCard
          titleEn="Payment Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={IMAGES.PERSON_ICON}
        >
          <div className={grid4}>
            <FieldShell label="Mode of Payment" labelHi="पेमेंट पद्धत" required error={!!errors.modeOfPayment}>
              <SelectField
                icon={<CreditCard size={16} />}
                value={formData.modeOfPayment}
                onChange={set("modeOfPayment")}
                placeholder="Select Mode of Payment"
                options={MODE_OF_PAYMENT_OPTIONS}
                error={!!errors.modeOfPayment}
              />
            </FieldShell>

            <PickerCodeField
              label="Transfer A/c Code"
              labelHi="रक्कम"
              value={formData.transferAcCode}
              placeholder="Enter Amount"
              error={!!errors.transferAcCode}
              onPickerClick={() => setTransferAccountPickerOpen(true)}
            />

            <FieldShell label="Transfer A/c Name" labelHi="रक्कम" required error={!!errors.transferAcName}>
              <TextInput icon={<User size={16} />} value={formData.transferAcName} onChange={() => {}} readOnly placeholder="Enter Amount" error={!!errors.transferAcName} />
            </FieldShell>

            <FieldShell label="Renewal" labelHi="अतिरिक्त व्याज गणना" required>
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="renewal"
                    value="yes"
                    checked={formData.renewal === 'yes'}
                    onChange={(e) => handleRenewalChange(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">Yes</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="renewal"
                    value="no"
                    checked={formData.renewal === 'no'}
                    onChange={(e) => handleRenewalChange(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">No</span>
                </label>
              </div>
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Deposit Amount" labelHi="दैव सारांश" required error={!!errors.depositAmount}>
              <CurrencyInput 
                value={formData.depositAmount} 
                readOnly={true}
                error={!!errors.depositAmount}
              />
            </FieldShell>

            <FieldShell label="Refund Amount" labelHi="दैव रक्कम" required error={!!errors.refundAmount}>
              <TextInput icon={<Calendar size={16} />} value={formData.refundAmount} onChange={() => {}} readOnly error={!!errors.refundAmount} />
            </FieldShell>

            <FieldShell label="Surcharge" labelHi="मुदतपूर्ती तारीख" required error={!!errors.surcharge}>
              <CurrencyInput 
                value={formData.surcharge} 
                readOnly={true}
                error={!!errors.surcharge}
              />
            </FieldShell>

            <FieldShell label="Completed Months" labelHi="मुदतपूर्ती मूल्य" required error={!!errors.completedMonths}>
              <TextInput icon={<Calendar size={16} />} value={formData.completedMonths} onChange={() => {}} readOnly error={!!errors.completedMonths} />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Overdue" labelHi="दैव सारांश" required error={!!errors.overdue}>
              <CurrencyInput 
                value={formData.overdue} 
                readOnly={true}
                error={!!errors.overdue}
              />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required error={!!errors.particular}>
              <TextInput icon={<FileText size={16} />} value={formData.particular} onChange={() => {}} readOnly placeholder="By Cash" error={!!errors.particular} />
            </FieldShell>

            <FieldShell label="Particular 1" labelHi="तपशील 1" required error={!!errors.particular1}>
              <TextInput icon={<FileText size={16} />} value={formData.particular1} onChange={() => {}} readOnly placeholder="By Cash" error={!!errors.particular1} />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Section 3: Accounting Details */}
        <SectionCard
          titleEn="Accounting Details"
          titleHi="दैव सारांश"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={IMAGES.PERSON_ICON}
        >
          <div className={grid4}>
            <FieldShell label="Outlist Serial No." labelHi="आउटलिस्ट दस्तऐवज क्रमांक" required error={!!errors.outlistSerialNo}>
              <TextInput icon={<FileText size={16} />} value={formData.outlistSerialNo} onChange={() => {}} readOnly placeholder="Outlist Doc No." error={!!errors.outlistSerialNo} />
            </FieldShell>

            <FieldShell label="Outlist Description" labelHi="जीएल आउटलिस्ट वर्णन" required error={!!errors.outlistDescription}>
              <SelectField
                icon={<FileText size={16} />}
                value={formData.outlistDescription}
                onChange={set("outlistDescription")}
                placeholder="GL Outlist Description"
                options={OUTLIST_DESCRIPTION_OPTIONS}
                error={!!errors.outlistDescription}
                disabled={true}
              />
            </FieldShell>

            <FieldShell label="Outlist Doc. No." labelHi="आउटलिस्ट दस्तऐवज क्रमांक" required error={!!errors.outlistDocNo}>
              <TextInput icon={<FileText size={16} />} value={formData.outlistDocNo} onChange={() => {}} readOnly placeholder="Outlist Doc No." error={!!errors.outlistDocNo} />
            </FieldShell>

            <FieldShell label="Service Charges" labelHi="तपशील" required error={!!errors.serviceCharges}>
              <CurrencyInput 
                value={formData.serviceCharges} 
                readOnly={true}
                error={!!errors.serviceCharges}
              />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Advice Number" labelHi="लिंग" required error={!!errors.adviceNumber}>
              <TextInput icon={<FileText size={16} />} value={formData.adviceNumber} onChange={() => {}} readOnly placeholder="Advice Number" error={!!errors.adviceNumber} />
            </FieldShell>

            <FieldShell label="Advice Date" labelHi="लिंग" required error={!!errors.adviceDate}>
              <DateInput value={formData.adviceDate} onChange={() => {}} readOnly error={!!errors.adviceDate} />
            </FieldShell>

            <FieldShell label="A/c Review Date" labelHi="रक्कम" required error={!!errors.acReviewDate}>
              <DateInput value={formData.acReviewDate} onChange={set("acReviewDate")} error={!!errors.acReviewDate} />
            </FieldShell>

            <FieldShell label="Org/Responding" labelHi="लिंग" required error={!!errors.orgResponding}>
              <SelectField
                icon={<FileText size={16} />}
                value={formData.orgResponding}
                onChange={set("orgResponding")}
                placeholder="Token Number"
                options={ORG_RESPONDING_OPTIONS}
                error={!!errors.orgResponding}
                disabled={true}
              />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Service Tax" labelHi="लिंग" required error={!!errors.serviceTax}>
              <TextInput icon={<FileText size={16} />} value={formData.serviceTax} onChange={() => {}} readOnly placeholder="Advice Number" error={!!errors.serviceTax} />
            </FieldShell>

            <FieldShell label="Interest Calculation Date" labelHi="लिंग" required error={!!errors.interestCalculationDate}>
              <DateInput value={formData.interestCalculationDate} onChange={() => {}} readOnly error={!!errors.interestCalculationDate} />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Section 4: Recovery Summary - Fields */}
        <SectionCard
          titleEn="Recovery Summary"
          titleHi="व्याज तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={IMAGES.PERSON_ICON}
        >
          <div className={grid4}>
            <FieldShell label="Total Deposit Amount" labelHi="पूर्वीय निवेश करण्याची माहिती">
              <CurrencyInput 
                value={formData.totalDepositAmount} 
                readOnly={true}
              />
            </FieldShell>

            <FieldShell label="Principal Amount" labelHi="मूल रक्कम">
              <CurrencyInput 
                value={formData.principalAmount} 
                readOnly={true}
              />
            </FieldShell>

            <FieldShell label="Interest Amount" labelHi="व्याज रक्कम">
              <CurrencyInput 
                value={formData.interestAmountRecovery} 
                readOnly={true}
              />
            </FieldShell>

            <FieldShell label="Charges Amount" labelHi="शुल्क रक्कम">
              <CurrencyInput 
                value={formData.chargesAmount} 
                readOnly={true}
              />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Section 5: Recovery Tables */}
        <SectionCard
          titleEn="Recovery Details"
          titleHi="वसूली तपशील"
          subtitleEn="Manage recovery calculations and details."
          subtitleHi="वसूली गणना आणि तपशील व्यवस्थापित करा."
          icon={IMAGES.PERSON_ICON}
        >
          {/* Two Column Layout for Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Receivable Table */}
            <div className="border border-slate-200 rounded-[10px] overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 bg-[#1e1b4b] text-white text-[10px] font-bold py-2 px-3">
                <div className="text-left">Receivable</div>
                <div className="text-center">Calculated</div>
                <div className="text-center">Recovery</div>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {[
                  { label: 'Insurance', labelHi: 'लिंग' },
                  { label: 'Insurance Fire', labelHi: 'जन्मी लिंग' },
                  { label: 'ABN Fees', labelHi: 'ABN शुल्क' },
                  { label: 'Execution Fees', labelHi: 'अंमलबजावणी शुल्क' },
                  { label: 'Recovery Charges', labelHi: 'वसुली शुल्क' },
                  { label: 'Interest', labelHi: 'व्याज' },
                  { label: 'Other Charges', labelHi: 'इतर शुल्क' },
                  { label: 'Charges Head', labelHi: 'रक्कम' },
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-3 py-1.5 px-3 items-center hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.labelHi}</div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                      <input 
                        type="text" 
                        defaultValue="0.0" 
                        className="w-full text-right text-[11px] font-medium border border-slate-200 bg-[#f0f2f5] rounded-[10px] py-1 px-2 pr-3 text-slate-500 cursor-not-allowed outline-none"
                        readOnly
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                      <input 
                        type="text" 
                        defaultValue="0.0" 
                        className="w-full text-right text-[11px] font-medium border border-slate-200 bg-white rounded-[10px] py-1 px-2 pr-3 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recovery Table */}
            <div className="border border-slate-200 rounded-[10px] overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 bg-[#1e1b4b] text-white text-[10px] font-bold py-2 px-3">
                <div className="text-left">Recovery</div>
                <div className="text-center">Calculated</div>
                <div className="text-center">Recovery</div>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {[
                  { label: 'Normal', labelHi: 'नियमित' },
                  { label: 'Overdue', labelHi: 'देय' },
                  { label: 'Moratorium', labelHi: 'स्थिति' },
                  { label: 'Penal Rec.', labelHi: 'दंड वसुली' },
                  { label: 'Penal Int.', labelHi: 'दंड व्याज' },
                  { label: 'Unrecovered', labelHi: 'न वसूल' },
                  { label: 'Pending OIR', labelHi: 'प्रतिबंध OIR' },
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-3 py-1.5 px-3 items-center hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.labelHi}</div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                      <input 
                        type="text" 
                        defaultValue="0.0" 
                        className="w-full text-right text-[11px] font-medium border border-slate-200 bg-[#f0f2f5] rounded-[10px] py-1 px-2 pr-3 text-slate-500 cursor-not-allowed outline-none"
                        readOnly
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                      <input 
                        type="text" 
                        defaultValue="0.0" 
                        className="w-full text-right text-[11px] font-medium border border-slate-200 bg-white rounded-[10px] py-1 px-2 pr-3 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 bg-[#f0f7ff] border border-slate-200 rounded-[10px] p-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-blue-700 font-medium text-[11px]">
              Total recovery will be debited from the selected account after Save.
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <div className="text-[9px] text-slate-500 font-normal">Total Calculated</div>
                <div className="text-blue-700 text-sm font-bold">₹ 500.00</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-normal">Total Recovery</div>
                <div className="text-blue-700 text-sm font-bold">₹ 500.00</div>
              </div>
            </div>
          </div>
        </SectionCard>

        {footer}
      </div>

      {/* Account Code Picker Modal */}
      {accountPickerOpen && (
        <ListModal
          title="Account Code List"
          columns={[
            { key: "code", label: "Account Code" },
            { key: "name", label: "Account Name" },
          ]}
          rows={ACCOUNT_OPTIONS}
          onClose={() => setAccountPickerOpen(false)}
          onSelect={(account: AccountOption) => {
            setFormData((prev) => ({
              ...prev,
              accountCode: account.code,
              accountName: account.name,
              ledgerBalance: account.ledgerBalance || prev.ledgerBalance,
              availableBalance: account.availableBalance || prev.availableBalance,
            }));
            clearError("accountCode");
            setAccountPickerOpen(false);
          }}
        />
      )}

      {/* Transfer Account Code Picker Modal */}
      {transferAccountPickerOpen && (
        <ListModal
          title="Transfer A/c Code List"
          columns={[
            { key: "code", label: "A/c Code" },
            { key: "name", label: "A/c Name" },
          ]}
          rows={TRANSFER_ACCOUNT_OPTIONS}
          onClose={() => setTransferAccountPickerOpen(false)}
          onSelect={(account: AccountOption) => {
            setFormData((prev) => ({
              ...prev,
              transferAcCode: account.code,
              transferAcName: account.name,
            }));
            clearError("transferAcCode");
            setTransferAccountPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}