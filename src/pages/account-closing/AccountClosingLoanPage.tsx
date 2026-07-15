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
  Table
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import { useBilingual } from "@/i18n/useBilingual";

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

interface FieldConfig {
  key: keyof FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  readOnly?: boolean;
  suffix?: boolean;
  select?: boolean;
  hasMenu?: boolean;
  onMenuClick?: () => void;
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

// ==========================================
// FORM FIELD COMPONENT
// ==========================================

function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  const Icon = field.icon;
  const hasMenu = field.hasMenu || Boolean(field.onMenuClick);
  const isReadOnly = field.readOnly || false;

  if (field.select) {
    return (
      <div className="mb-3 last:mb-0">
        <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
          {field.label}
          <span className="text-slate-400 font-normal">
            {" "}
            <span className="text-slate-600">/</span> {field.labelHi}
          </span>
          {field.label !== 'Is Ho Transaction' && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Icon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <select
            value={value}
            onChange={onChange}
            disabled={isReadOnly}
            className={`
              w-full h-8 rounded-[10px] border border-slate-300
              pl-8 pr-3 text-[11px] outline-none
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500
              appearance-none
              ${isReadOnly 
                ? 'bg-[#f0f2f5] text-slate-500 cursor-not-allowed border-slate-200' 
                : 'bg-white text-slate-600'
              }
            `}
          >
            <option value="" className="text-[11px] text-slate-400">{field.placeholder}</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 last:mb-0">
      <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
        {field.label}
        <span className="text-slate-400 font-normal">
          {" "}
          <span className="text-slate-600">/</span> {field.labelHi}
        </span>
        {field.label !== 'Is Ho Transaction' && 
         field.label !== 'Total Deposit Amount' && 
         field.label !== 'Principal Amount' && 
         field.label !== 'Interest Amount' && 
         field.label !== 'Charges Amount' && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center gap-2">
        <div
          className={`
            group flex flex-1 items-center w-full h-8 rounded-[10px]
            border px-2.5
            transition-all duration-200
            ${isReadOnly 
              ? 'bg-[#f0f2f5] border-slate-200 cursor-not-allowed' 
              : 'bg-white border-slate-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
            }
            ${hasMenu ? 'cursor-pointer' : ''}
          `}
        >
          <Icon className={`w-3.5 h-3.5 ${isReadOnly ? 'text-slate-400' : 'text-slate-400'} shrink-0`} />

          <input
            type="text"
            readOnly={isReadOnly}
            placeholder={field.placeholder}
            value={value}
            onChange={isReadOnly ? undefined : onChange}
            className={`
              ml-2 w-full bg-transparent outline-none
              text-[11px]
              placeholder:text-[11px] placeholder:text-slate-400 placeholder:font-normal
              ${hasMenu ? 'pointer-events-none cursor-pointer' : ''}
              ${isReadOnly ? 'text-slate-500 cursor-not-allowed' : 'text-slate-600'}
            `}
          />

          {field.suffix && (
            <span className={`text-[11px] font-medium ml-auto ${isReadOnly ? 'text-slate-400' : 'text-slate-400'}`}>₹</span>
          )}
        </div>

        {hasMenu && (
          <button
            type="button"
            onClick={field.onMenuClick}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-blue-600 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
          >
            <MoreVertical size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// SECTION CARD COMPONENT
// ==========================================

interface CardSectionProps {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

function CardSection({ icon, title, subTitle, description, children, className = '' }: CardSectionProps) {
  return (
    <div className={`border border-[#0256cc]/60 border-t-[3.5px] border-t-[#0256cc] rounded-[14px] p-2 bg-white shadow-sm ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {title} <span className="text-slate-400 font-normal text-xs">/ {subTitle}</span>
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

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

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleIsHoChange = (value: string) => {
    setFormData((prev) => ({ ...prev, isHoTransaction: value }));
  };

  const handleRenewalChange = (value: string) => {
    setFormData((prev) => ({ ...prev, renewal: value }));
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleValidate = () => {
    console.log('Validate clicked');
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  const handlePrintVoucher = () => {
    console.log('Print Voucher clicked');
  };

  const handleSave = () => {
    console.log('Save clicked');
  };

  const handleAccountCodeMenu = () => {
    console.log('Open account code menu');
  };

  // Account Details Fields
  const section1Fields: FieldConfig[] = [
    {
      key: 'accountCode',
      label: 'Account Code',
      labelHi: 'खाते कोड',
      placeholder: 'Select Account Code',
      icon: MapPin,
      hasMenu: true,
      onMenuClick: handleAccountCodeMenu,
    },
    {
      key: 'accountName',
      label: 'Account Name',
      labelHi: 'खात्याचे नाव',
      placeholder: 'Account Name',
      icon: User,
      readOnly: true,
    },
    {
      key: 'glAccountCode',
      label: 'GL Account Code',
      labelHi: 'जीएल खाते कोड',
      placeholder: 'GL Account Code',
      icon: Hash,
    },
    {
      key: 'description',
      label: 'Description',
      labelHi: 'प्रक्रियाचे नाव',
      placeholder: 'Customer Name',
      icon: FileText,
    },
    {
      key: 'ledgerBalance',
      label: 'Ledger Balance',
      labelHi: 'उपलब्ध शिल्पक',
      placeholder: 'Available Balance / दैव कालावधी',
      icon: IndianRupee,
      suffix: true,
      readOnly: true,
    },
    {
      key: 'availableBalance',
      label: 'Available Balance',
      labelHi: 'दैव कालावधी',
      placeholder: 'Enter Available Balance',
      icon: IndianRupee,
      suffix: true,
      readOnly: true,
    },
    {
      key: 'scrollNumber',
      label: 'Scroll Number',
      labelHi: 'स्कोल क्रमांक',
      placeholder: 'Scroll Number',
      icon: ScrollText,
    },
    {
      key: 'interestRate',
      label: 'Interest Rate',
      labelHi: 'व्याज दर',
      placeholder: 'Interest Rate %',
      icon: Percent,
      select: true,
    },
  ];

  // Payment Details Fields
  const section2Fields: FieldConfig[] = [
    {
      key: 'modeOfPayment',
      label: 'Mode of Payment',
      labelHi: 'पेमेंट पद्धत',
      placeholder: 'Select Mode of Payment',
      icon: CreditCard,
      select: true,
    },
    {
      key: 'transferAcCode',
      label: 'Transfer A/c Code',
      labelHi: 'रक्कम',
      placeholder: 'Enter Amount',
      icon: Hash,
    },
    {
      key: 'transferAcName',
      label: 'Transfer A/c Name',
      labelHi: 'रक्कम',
      placeholder: 'Enter Amount',
      icon: User,
    },
    {
      key: 'depositAmount',
      label: 'Deposit Amount',
      labelHi: 'दैव सारांश',
      placeholder: 'Deposit Amount',
      icon: IndianRupee,
      suffix: true,
      readOnly: true,
    },
    {
      key: 'refundAmount',
      label: 'Refund Amount',
      labelHi: 'दैव रक्कम',
      placeholder: 'DD-MMM-YYYY',
      icon: Calendar,
      readOnly: true,
    },
    {
      key: 'surcharge',
      label: 'Surcharge',
      labelHi: 'मुदतपूर्ती तारीख',
      placeholder: 'Maturity Value',
      icon: IndianRupee,
      suffix: true,
      readOnly: true,
    },
    {
      key: 'completedMonths',
      label: 'Completed Months',
      labelHi: 'मुदतपूर्ती मूल्य',
      placeholder: 'Period of Deposit',
      icon: Calendar,
      readOnly: true,
    },
    {
      key: 'overdue',
      label: 'Overdue',
      labelHi: 'दैव सारांश',
      placeholder: 'Deposit Amount',
      icon: IndianRupee,
      suffix: true,
      readOnly: true,
    },
    {
      key: 'particular',
      label: 'Particular',
      labelHi: 'तपशील',
      placeholder: 'By Cash',
      icon: FileText,
      readOnly: true,
    },
    {
      key: 'particular1',
      label: 'Particular 1',
      labelHi: 'तपशील 1',
      placeholder: 'By Cash',
      icon: FileText,
      readOnly: true,
    },
  ];

  // Accounting Details Fields
  const section3Fields: FieldConfig[] = [
    {
      key: 'outlistSerialNo',
      label: 'Outlist Serial No.',
      labelHi: 'आउटलिस्ट दस्तऐवज क्रमांक',
      placeholder: 'Outlist Doc No.',
      icon: FileText,
      readOnly: true,
    },
    {
      key: 'outlistDescription',
      label: 'Outlist Description',
      labelHi: 'जीएल आउटलिस्ट वर्णन',
      placeholder: 'GL Outlist Description',
      icon: FileText,
      select: true,
      readOnly: true,
    },
    {
      key: 'outlistDocNo',
      label: 'Outlist Doc. No.',
      labelHi: 'आउटलिस्ट दस्तऐवज क्रमांक',
      placeholder: 'Outlist Doc No.',
      icon: FileText,
      readOnly: true,
    },
    {
      key: 'serviceCharges',
      label: 'Service Charges',
      labelHi: 'तपशील',
      placeholder: 'By Cash',
      icon: IndianRupee,
      suffix: true,
      readOnly: true,
    },
    {
      key: 'adviceNumber',
      label: 'Advice Number',
      labelHi: 'लिंग',
      placeholder: 'Advice Number',
      icon: FileText,
      readOnly: true,
    },
    {
      key: 'adviceDate',
      label: 'Advice Date',
      labelHi: 'लिंग',
      placeholder: 'Advice Date',
      icon: Calendar,
      readOnly: true,
    },
    {
      key: 'acReviewDate',
      label: 'A/c Review Date',
      labelHi: 'रक्कम',
      placeholder: 'Enter Amount',
      icon: Calendar,
      readOnly: false,
    },
    {
      key: 'orgResponding',
      label: 'Org/Responding',
      labelHi: 'लिंग',
      placeholder: 'Token Number',
      icon: FileText,
      select: true,
      readOnly: true,
    },
    {
      key: 'serviceTax',
      label: 'Service Tax',
      labelHi: 'लिंग',
      placeholder: 'Advice Number',
      icon: FileText,
      readOnly: true,
    },
    {
      key: 'interestCalculationDate',
      label: 'Interest Calculation Date',
      labelHi: 'लिंग',
      placeholder: 'Advice Date',
      icon: Calendar,
      readOnly: true,
    },
  ];

  // Recovery Summary Fields
  const recoveryFields: FieldConfig[] = [
    {
      key: 'totalDepositAmount',
      label: 'Total Deposit Amount',
      labelHi: 'पूर्वीय निवेश करण्याची माहिती',
      placeholder: 'Deposit Amount',
      icon: IndianRupee,
      suffix: true,
      readOnly: true,
    },
    {
      key: 'principalAmount',
      label: 'Principal Amount',
      labelHi: 'मूल रक्कम',
      placeholder: 'DD-MMM-YYYY',
      icon: IndianRupee,
      suffix: true,
      readOnly: true,
    },
    {
      key: 'interestAmountRecovery',
      label: 'Interest Amount',
      labelHi: 'व्याज रक्कम',
      placeholder: 'Maturity Value',
      icon: IndianRupee,
      suffix: true,
      readOnly: true,
    },
    {
      key: 'chargesAmount',
      label: 'Charges Amount',
      labelHi: 'शुल्क रक्कम',
      placeholder: 'Period of Deposit',
      icon: IndianRupee,
      suffix: true,
      readOnly: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
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
        <CardSection
          icon={<User className="w-4 h-4 text-blue-600" />}
          title="Account Details"
          subTitle="खाते तपशील"
          description="Manage customer's personal and identity information. / प्राप्तिकारी वैयक्तिक व शेड्यूक संबंधित माहिती व्यवस्थापित करा."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {section1Fields.map((field) => (
              <div key={field.key} className="flex items-end gap-2">
                <div className="flex-1">
                  <FormField
                    field={field}
                    value={formData[field.key]}
                    onChange={handleChange(field.key)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardSection>

        {/* Section 2: Payment Details */}
        <CardSection
          icon={<CreditCard className="w-4 h-4 text-blue-600" />}
          title="Payment Details"
          subTitle="पेमेंट तपशील"
          description="Manage customer's personal and identity information. / प्राप्तिकारी वैयक्तिक व शेड्यूक संबंधित माहिती व्यवस्थापित करा."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {section2Fields.slice(0, 3).map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
            
            {/* Renewal Radio Buttons */}
            <div className="mb-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                Renewal <span className="text-slate-400 font-normal">/ अतिरिक्त व्याज गणना</span>
              </label>
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="renewal"
                    value="yes"
                    checked={formData.renewal === 'yes'}
                    onChange={(e) => handleRenewalChange(e.target.value)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">Yes</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="renewal"
                    value="no"
                    checked={formData.renewal === 'no'}
                    onChange={(e) => handleRenewalChange(e.target.value)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">No</span>
                </label>
              </div>
            </div>

            {section2Fields.slice(3).map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
          </div>
        </CardSection>

        {/* Section 3: Accounting Details */}
        <CardSection
          icon={<ClipboardList className="w-4 h-4 text-blue-600" />}
          title="Accounting Details"
          subTitle="दैव सारांश"
          description="Manage customer's personal and identity information. / प्राप्तिकारी वैयक्तिक व शेड्यूक संबंधित माहिती व्यवस्थापित करा."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {section3Fields.map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
          </div>
        </CardSection>

        {/* Section 4: Recovery Summary - Fields */}
        <CardSection
          icon={<RefreshCw className="w-4 h-4 text-blue-600" />}
          title="Recovery Summary"
          subTitle="व्याज तपशील"
          description="Manage customer's personal and identity information. / प्राप्त करण्याची व्यवस्थित करण्याची माहिती व्यवस्थापित करा."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recoveryFields.map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
          </div>
        </CardSection>

        {/* Section 5: Recovery Tables */}
        <CardSection
          icon={<Table className="w-4 h-4 text-blue-600" />}
          title="Recovery Details"
          subTitle="वसूली तपशील"
          description="Manage recovery calculations and details. / वसूली गणना आणि तपशील व्यवस्थापित करा."
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
        </CardSection>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pb-4">
          <button
            onClick={handleValidate}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
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
            className="flex items-center gap-4 px-6 py-2 bg-[#e2e8f0] text-slate-400 text-xs font-semibold rounded-md cursor-not-allowed"
            disabled
          >
            Save <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>
    </div>
  );
}