import { IMAGES } from "@/assets";
import React, { useState } from 'react';
import { 
  X, 
  UserCircle, 
  Calendar, 
  Building2,
  Hash,
  ThumbsUp
} from 'lucide-react';
import Image from "@/components/ui/Image";

// ==================== TYPE DEFINITIONS ====================

interface VoucherRow {
  accountCode: string;
  accountName: string;
  trInd: string;
  amount: string;
  particular: string;
  userId: string;
}

interface FormData {
  branchCode: string;
  scrollDate: string;
  scrollNumber: string;
}

interface FieldConfig {
  key: keyof FormData;
  label: string;
  labelMarathi: string;
  value: string;
  icon: React.ReactNode;
  required?: boolean;
  readOnly?: boolean;
}

interface SectionConfig {
  title: string;
  titleMarathi: string;
  icon?: React.ReactNode;
  fields: FieldConfig[];
}

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionHeaderProps {
  title: string;
  titleMarathi: string;
  icon?: React.ReactNode;
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// ==================== REUSABLE COMPONENTS ====================

// 1. Reusable Card Container with Thick Top Border
const CardContainer: React.FC<CardContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`border border-[#0256cc]/60 border-t-[3.5px] border-t-[#0256cc] rounded-[14px] p-5 bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

// 2. Reusable Section Header
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, titleMarathi, icon }) => {
  return (
    <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 dark:border-slate-800">
      <div className="w-7 h-7 rounded-full bg-[#eff6ff] dark:bg-blue-900/30 flex items-center justify-center text-[#1d4ed8] dark:text-blue-400">
        {icon || <UserCircle size={18} className="stroke-[2.5]" />}
      </div>
      <h2 className="text-sm font-bold text-[#1e293b] dark:text-slate-100 flex items-center gap-1.5">
        <span>{title}</span>
        <span className="text-slate-400 font-normal">/</span>
        <span className="text-slate-500 dark:text-slate-400 font-medium">{titleMarathi}</span>
      </h2>
    </div>
  );
};

// 3. Reusable Form Field (unified)
const FormField: React.FC<{
  field: FieldConfig;
}> = ({ field }) => {
  const {
    label,
    labelMarathi,
    value,
    icon,
    required = false,
    readOnly = true,
  } = field;

  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5 dark:text-slate-300">
        {label} <span className="text-slate-400 font-medium">/ {labelMarathi}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-500">
          {icon}
        </div>
        <input
          type="text"
          disabled={readOnly}
          value={value}
          className={`w-full ${readOnly ? 'bg-[#f1f5f9] dark:bg-slate-800 cursor-not-allowed' : 'bg-white dark:bg-slate-900'}
            border border-slate-400 dark:border-slate-700 rounded-[10px]
            pl-9 pr-3 py-2 text-sm
            ${readOnly ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}
            font-semibold shadow-inner
            ${!readOnly && 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none'}
          `}
        />
      </div>
    </div>
  );
};

// 4. Reusable Button
const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  onClick,
  className = ""
}) => {
  const variants = {
    primary: 'bg-[#0256cc] hover:bg-blue-700 active:bg-blue-800 text-white',
    secondary: 'bg-white dark:bg-slate-900 border border-[#0256cc] text-[#0256cc] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 active:bg-blue-100'
  };

  const baseStyle = 'flex items-center justify-center gap-1.5 px-6 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200';
  const variantStyle = variants[variant] || variants.primary;

  return (
    <button 
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      <span>{children}</span>
      {icon && icon}
    </button>
  );
};

// 5. Reusable Table Component
const VoucherTable: React.FC<{ rows: VoucherRow[] }> = ({ rows }) => {
  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <table className="w-full min-w-[800px] border-collapse bg-white dark:bg-slate-900">
        <thead>
          <tr className="bg-[#0256cc] text-white">
            <th className="px-4 py-3.5 text-left text-xs font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">Account Code</th>
            <th className="px-4 py-3.5 text-left text-xs font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">Account Name</th>
            <th className="px-4 py-3.5 text-left text-xs font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">Tr.Ind</th>
            <th className="px-4 py-3.5 text-right text-xs font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">Amount</th>
            <th className="px-4 py-3.5 text-left text-xs font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">Particular</th>
            <th className="px-4 py-3.5 text-left text-xs font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">User ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50/70 dark:hover:bg-slate-800 transition-colors">
              <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{row.accountCode}</td>
              <td className="px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{row.accountName}</td>
              <td className="px-4 py-3 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{row.trInd}</td>
              <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-slate-100 text-right whitespace-nowrap">{row.amount}</td>
              <td className="px-4 py-3 text-xs font-medium text-slate-600 dark:text-slate-400">{row.particular}</td>
              <td className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{row.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

interface DisplayVouchersProps {
  onClose?: () => void;
}

export default function DisplayVouchers({ onClose }: DisplayVouchersProps) {
  const [formData] = useState<FormData>({
    branchCode: "0002",
    scrollDate: "01-Jun-2026",
    scrollNumber: "117",
  });

  // Exact data from your screenshot table
  const voucherRows: VoucherRow[] = [
    {
      accountCode: '000220100000001',
      accountName: 'Kusugal Sangappa Akhandappa',
      trInd: 'TRDR',
      amount: '50.0',
      particular: 'To Chequebook Charges',
      userId: 'Admin'
    },
    {
      accountCode: '0000000400120',
      accountName: 'Miscellaneous Income',
      trInd: 'TRDR',
      amount: '50.0',
      particular: 'To Chequebook Issue Charges 000220100000001',
      userId: 'Admin'
    },
    {
      accountCode: '000220100000001',
      accountName: 'Kusugal Sangappa Akhandappa',
      trInd: 'TRDR',
      amount: '9.0',
      particular: 'To Service Tax',
      userId: 'Admin'
    },
    {
      accountCode: '0000000205074',
      accountName: 'GST Payable',
      trInd: 'TRDR',
      amount: '9.0',
      particular: 'By Service Tax 000220100000001',
      userId: 'Admin'
    }
  ];

  // Define sections with their fields configuration
  const sections: SectionConfig[] = [
    {
      title: "Details",
      titleMarathi: "तपशील",
      icon: <UserCircle size={18} className="stroke-[2.5]" />,
      fields: [
        {
          key: "branchCode",
          label: "Branch Code",
          labelMarathi: "शाखा कोड",
          value: formData.branchCode,
          icon: <Building2 size={16} />,
          required: true,
        },
        {
          key: "scrollDate",
          label: "Scroll Date",
          labelMarathi: "दैनंदिन नोंदवहीची तारीख",
          value: formData.scrollDate,
          icon: <Calendar size={16} />,
          required: true,
        },
        {
          key: "scrollNumber",
          label: "Scroll Number",
          labelMarathi: "व्यवहार नोंद क्रमांक",
          value: formData.scrollNumber,
          icon: <Hash size={16} />,
          required: true,
        },
      ],
    },
  ];

  // Section for vouchers (special case with table)
  const voucherSection: SectionConfig = {
    title: "Vouchers Details",
    titleMarathi: "व्हाउचर तपशील",
    icon: <UserCircle size={18} className="stroke-[2.5]" />,
    fields: [], // Empty fields array since we use a table
  };

  // Handlers
  const handleCancel = (): void => {
    console.log('Cancel clicked');
    onClose?.();
  };

  const handleOk = (): void => {
    console.log('Ok, Got It clicked');
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 antialiased font-sans bg-black/40">

      {/* Main Dialog Modal Box */}
      <div className="w-full max-w-8xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">

        {/* Header Block */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Custom User/Plus Logo Icon */}
            <div className="relative w-11 h-11 flex-shrink-0">
              <Image
                src={IMAGES.ADD_ICON}
                alt="Person"
                fill
                className="object-contain"
                sizes="44px"
                priority
                unoptimized={import.meta.env.DEV}
              />
            </div>

            {/* Header Bilingual Title */}
            <h1 className="text-xl font-bold text-[#1e293b] dark:text-slate-100 flex items-center gap-2 flex-wrap">
              <span className="tracking-tight text-[#0f172a] dark:text-slate-100">Display Vouchers</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-[#64748b] dark:text-slate-400 font-bold text-xl">व्हाउचर प्रदर्शित करा</span>
            </h1>
          </div>

          {/* Circular Outlined Close Icon Button */}
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-1 rounded-full border-2 border-slate-400 dark:border-slate-600 hover:border-slate-600 dark:hover:border-slate-500"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Outer Content Wrap Container - scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Render sections dynamically */}
            {sections.map((section, sectionIndex) => (
              <CardContainer key={sectionIndex}>
                <SectionHeader
                  title={section.title}
                  titleMarathi={section.titleMarathi}
                  icon={section.icon}
                />

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {section.fields.map((field) => (
                    <FormField key={field.key} field={field} />
                  ))}
                </div>
              </CardContainer>
            ))}

            {/* 2. VOUCHERS DETAILS CARD - With Thick Top Border */}
            <CardContainer>
              <SectionHeader
                title={voucherSection.title}
                titleMarathi={voucherSection.titleMarathi}
                icon={voucherSection.icon}
              />

              {/* Custom Responsive Table Component Container */}
              <VoucherTable rows={voucherRows} />
            </CardContainer>
          </div>
        </div>

        {/* Footer Actions Row Button Strip */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          <Button
            variant="secondary"
            icon={<X size={15} strokeWidth={2.5} />}
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            icon={<ThumbsUp size={14} className="scale-x-[1]" />}
            onClick={handleOk}
          >
            Ok, Got It
          </Button>
        </div>

      </div>
    </div>
  );
}