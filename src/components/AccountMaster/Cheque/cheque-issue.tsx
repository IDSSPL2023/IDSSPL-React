import { IMAGES } from "@/assets";
import { useState } from "react";
import Image from "@/components/ui/Image";
import { ArrowRightLeft, Banknote, Building2, Calendar, Check, ChevronDown, CreditCard, DollarSign, FileStack, FileText, Hash, Layers, MoreVertical, Receipt, Signature, User, UserCircle, Users, Wallet, X } from "lucide-react";

/** Shared with pages/AccountMasterPage.tsx (the /accountmaster route) — kept standalone, not inlined. */
/* ===== from cheque-issue.tsx ===== */
interface FormData {
  accountCode: string;
  accountName: string;
  shortName: string;
  ledgerBalance: string;
  availableBalance: string;
  accountType: string;
  chequeType: string;
  chequeSeries: string;
  chequeNoFrom: string;
  chequeNoTo: string;
  issueDate: string;
  noOfLeaves: string;
  chargesApply: string;
  chequeIssueCharges: string;
  serviceTax: string;
  authorisedSignatory1: string;
  authorisedSignatory2: string;
  authorisedSignatory3: string;
}

interface FieldConfig {
  key: keyof FormData;
  label: string;
  labelMarathi: string;
  placeholder?: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
  required?: boolean;
  textAlign?: 'left' | 'right' | 'center';
  type?: 'text' | 'number' | 'date';
  colSpan?: 1 | 2 | 3;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  isSelect?: boolean;
  options?: Array<{ value: string; label: string }>;
  isRadio?: boolean;
  radioOptions?: Array<{ value: string; label: string }>;
  radioName?: string;
}

interface SectionConfig {
  title: string;
  titleMarathi: string;
  icon: React.ReactNode;
  fields: FieldConfig[];
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'disabled';
  disabled?: boolean;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

// ==================== REUSABLE COMPONENTS ====================

// 1. Reusable Form Field
const FormField: React.FC<{
  field: FieldConfig;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRadioChange?: (value: string) => void;
}> = ({ field, value, onChange, onRadioChange }) => {
  const {
    key,
    label,
    labelMarathi,
    placeholder = '',
    icon,
    readOnly = false,
    required = false,
    textAlign = 'left',
    type = 'text',
    rightIcon,
    onRightIconClick,
    isSelect = false,
    options = [],
    isRadio = false,
    radioOptions = [],
    radioName = key,
  } = field;

  // Radio Group
  if (isRadio) {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 dark:text-slate-300">
          {label} <span className="text-slate-400 font-normal">/ {labelMarathi}</span>
        </label>
        <div className="flex items-center gap-6 py-2">
          {radioOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer dark:text-slate-300">
              <input 
                type="radio" 
                name={radioName}
                value={option.value}
                checked={value === option.value}
                onChange={() => onRadioChange?.(option.value)}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2" 
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // Select Field
  if (isSelect) {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 dark:text-slate-300">
          {label}
          <span className="text-slate-400 font-normal"> / {labelMarathi}</span>
          {required && <span className="text-red-500 font-bold ml-1">*</span>}
        </label>
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 flex items-center justify-center text-slate-500">
              {icon}
            </div>
          )}
          <select
            value={value}
            onChange={onChange}
            disabled={readOnly}
            className={`w-full ${readOnly ? 'bg-[#f1f5f9] dark:bg-slate-800 cursor-not-allowed' : 'bg-white dark:bg-slate-900'}
              border border-slate-300 dark:border-slate-700 rounded-[10px]
              ${icon ? 'pl-9' : 'pl-3'} pr-10 py-2 text-sm
              ${readOnly ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}
              font-medium shadow-sm
              ${!readOnly && 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none'}
              appearance-none
            `}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 text-slate-500 pointer-events-none" />
        </div>
      </div>
    );
  }

  // Input Field
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5 dark:text-slate-300">
        {label}
        <span className="text-slate-400 font-normal"> / {labelMarathi}</span>
        {required && <span className="text-red-500 font-bold ml-1">*</span>}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 flex items-center justify-center text-slate-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full ${readOnly ? 'bg-[#f1f5f9] dark:bg-slate-800 cursor-not-allowed' : 'bg-white dark:bg-slate-900'}
            border border-slate-300 dark:border-slate-700 rounded-[10px]
            ${icon ? 'pl-9' : 'pl-3'} ${rightIcon ? 'pr-9' : 'pr-3'} py-2 text-sm
            ${readOnly ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}
            font-medium shadow-sm
            ${!readOnly && 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none'}
            ${textAlign === 'right' ? 'text-right' : textAlign === 'center' ? 'text-center' : 'text-left'}
          `}
        />
        {rightIcon && (
          <button
            onClick={onRightIconClick}
            type="button"
            className="absolute right-2 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
};

// 2. Reusable Section Header
const SectionHeader: React.FC<{ title: string; titleMarathi: string; icon: React.ReactNode }> = ({ 
  title, 
  titleMarathi, 
  icon 
}) => {
  return (
    <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
      <div className="w-7 h-7 flex items-center justify-center text-[#0256cc] dark:text-blue-400 flex-shrink-0">
        {icon}
      </div>
      <h2 className="text-sm font-bold text-[#1e293b] dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
        <span>{title}</span>
        <span className="text-slate-400 font-normal">/</span>
        <span className="text-slate-500 dark:text-slate-400 font-medium">{titleMarathi}</span>
      </h2>
    </div>
  );
};

// 3. Reusable Card Container
const CardContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`border border-[#0256cc]/60 border-t-[3.5px] border-t-[#0256cc] rounded-[14px] p-5 bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

// 4. Reusable Button
const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  disabled = false,
  icon: IconComponent,
  onClick,
  className = "",
  type = "button"
}) => {
  const variants = {
    primary: 'bg-[#0256cc] hover:bg-blue-700 active:bg-blue-800 text-white border-transparent',
    secondary: 'bg-white dark:bg-slate-900 border border-[#0256cc] text-[#0256cc] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 active:bg-blue-100',
    disabled: 'bg-[#f1f5f9] dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
  };

  const baseStyle = 'flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200';
  const variantStyle = disabled ? variants.disabled : variants[variant] || variants.primary;

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      <span>{children}</span>
      {IconComponent && <IconComponent size={16} strokeWidth={2.5} />}
    </button>
  );
};

// ==================== MAIN COMPONENT ====================

interface ChequeBookIssueProps {
  onClose?: () => void;
  onDisplayVouchers?: () => void;
}

function ChequeBookIssue({ onClose, onDisplayVouchers }: ChequeBookIssueProps) {
  const [formData, setFormData] = useState<FormData>({
    accountCode: "1234567890",
    accountName: "Akshay Om More",
    shortName: "Akshay More",
    ledgerBalance: "408493.5",
    availableBalance: "408493.5",
    accountType: "SB",
    chequeType: "CTS",
    chequeSeries: "A",
    chequeNoFrom: "70010",
    chequeNoTo: "70020",
    issueDate: "01-Jun-2026",
    noOfLeaves: "10",
    chargesApply: "no",
    chequeIssueCharges: "",
    serviceTax: "",
    authorisedSignatory1: "-",
    authorisedSignatory2: "-",
    authorisedSignatory3: "-",
  });

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRadioChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Define sections with their fields configuration using Lucide icons
  const sections: SectionConfig[] = [
    {
      title: "Account Details",
      titleMarathi: "खात्याचा तपशील",
      icon: <UserCircle size={20} strokeWidth={2} />,
      fields: [
        {
          key: "accountCode",
          label: "Account Code",
          labelMarathi: "खाते कोड",
          icon: <Hash size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
        },
        {
          key: "accountName",
          label: "Account Name",
          labelMarathi: "खाते नाव",
          icon: <User size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
        },
        {
          key: "shortName",
          label: "Short Name",
          labelMarathi: "संक्षिप्त नाव",
          icon: <User size={16} strokeWidth={2} />,
          required: true,
        },
        {
          key: "ledgerBalance",
          label: "Ledger Balance",
          labelMarathi: "लेजर शिल्लक",
          icon: <Wallet size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
          textAlign: "right",
        },
        {
          key: "availableBalance",
          label: "Available Balance",
          labelMarathi: "उपलब्ध शिल्लक",
          icon: <Banknote size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
          textAlign: "right",
        },
      ],
    },
    {
      title: "Cheque Details",
      titleMarathi: "धनादेश तपशील",
      icon: <CreditCard size={20} strokeWidth={2} />,
      fields: [
        {
          key: "accountType",
          label: "Account Type",
          labelMarathi: "खात्याचा प्रकार",
          icon: <Building2 size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
        },
        {
          key: "chequeType",
          label: "Cheque Type",
          labelMarathi: "धनादेश प्रकार",
          icon: <FileText size={16} strokeWidth={2} />,
          isSelect: true,
          options: [
            { value: 'CTS', label: 'CTS' },
            { value: 'NON-CTS', label: 'Non-CTS' }
          ],
          required: true,
        },
        {
          key: "chequeSeries",
          label: "Cheque Series",
          labelMarathi: "धनादेश मालिका",
          icon: <Layers size={16} strokeWidth={2} />,
          required: true,
        },
        {
          key: "chequeNoFrom",
          label: "Cheque No From",
          labelMarathi: "चेक क्रमांकापासून",
          icon: <ArrowRightLeft size={16} strokeWidth={2} />,
          required: true,
          rightIcon: <MoreVertical size={16} />,
          onRightIconClick: () => console.log('More options clicked'),
        },
        {
          key: "chequeNoTo",
          label: "Cheque No To",
          labelMarathi: "चेक क्रमांकापर्यंत",
          icon: <ArrowRightLeft size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
        },
        {
          key: "issueDate",
          label: "Issue Date",
          labelMarathi: "वितरण तारीख",
          icon: <Calendar size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
        },
        {
          key: "noOfLeaves",
          label: "No Of Leaves",
          labelMarathi: "पानांची संख्या",
          icon: <FileStack size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
        },
        {
          key: "chargesApply",
          label: "Charges Apply",
          labelMarathi: "वशुल्क लागू",
          isRadio: true,
          radioName: "charges_apply",
          radioOptions: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
        },
        {
          key: "chequeIssueCharges",
          label: "Chequebook Issue Charges",
          labelMarathi: "चेकबुक इश्यू चार्जेस",
          icon: <DollarSign size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
          placeholder: "0.00",
        },
        {
          key: "serviceTax",
          label: "Service Tax",
          labelMarathi: "सेवा कर",
          icon: <DollarSign size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
          placeholder: "0.00",
        },
        {
          key: "authorisedSignatory1",
          label: "Authorized Signatory 1",
          labelMarathi: "अधिकृत स्वाक्षरी १",
          icon: <Signature size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
        },
        {
          key: "authorisedSignatory2",
          label: "Authorized Signatory 2",
          labelMarathi: "अधिकृत स्वाक्षरी २",
          icon: <Users size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
        },
        {
          key: "authorisedSignatory3",
          label: "Authorized Signatory 3",
          labelMarathi: "अधिकृत स्वाक्षरी ३",
          icon: <Users size={16} strokeWidth={2} />,
          readOnly: true,
          required: true,
        },
      ],
    },
  ];

  // Helper to get grid classes based on field count
  const getGridCols = (fieldCount: number): string => {
    if (fieldCount <= 3) return 'grid-cols-1 md:grid-cols-3';
    if (fieldCount <= 5) return 'grid-cols-1 md:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-3';
  };

  // Handlers
  const handleValidate = (): void => {
    console.log('Validate clicked');
    console.log('Form Data:', formData);
  };

  const handleCancel = (): void => {
    console.log('Cancel clicked');
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 antialiased font-sans bg-black/40">

      {/* Main Dialog Modal Container */}
      <div className="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">

        {/* Header Block */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src={IMAGES.ADD_ICON}
                alt="Person"
                fill
                className="object-contain"
                sizes="40px"
                priority
                unoptimized={import.meta.env.DEV}
              />
            </div>

            <h1 className="text-xl font-bold text-[#1e293b] dark:text-slate-100 flex items-center gap-2 flex-wrap">
              <span className="tracking-tight text-[#1e293b] dark:text-slate-100">Cheque Book Issue</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-[#64748b] dark:text-slate-400 font-bold text-xl">धनादेश पुस्तिका वितरण</span>
            </h1>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-300 p-1.5 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Close"
          >
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content Body Grid - scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <CardContainer key={sectionIndex}>
                <SectionHeader
                  title={section.title}
                  titleMarathi={section.titleMarathi}
                  icon={section.icon}
                />

                <div className={`grid ${getGridCols(section.fields.length)} gap-x-6 gap-y-4`}>
                  {section.fields.map((field) => (
                    <FormField
                      key={field.key}
                      field={field}
                      value={formData[field.key] as string}
                      onChange={handleChange(field.key)}
                      onRadioChange={field.isRadio ? handleRadioChange(field.key) : undefined}
                    />
                  ))}
                </div>
              </CardContainer>
            ))}
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          <Button
            variant="primary"
            icon={Check}
            onClick={handleValidate}
          >
            Validate
          </Button>

          <Button
            variant="secondary"
            icon={X}
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            variant="secondary"
            icon={Receipt}
            onClick={onDisplayVouchers}
          >
            Display Vouchers
          </Button>

          <Button
            variant="disabled"
            icon={ChevronDown}
            disabled
          >
            Save
          </Button>
        </div>

      </div>
    </div>
  );
}



export default ChequeBookIssue;
