import React, { useState } from 'react';
import {
  X,
  UserCircle,
  Calendar,
  Building2,
  Hash,
  ThumbsUp,
  Check,
  ChevronDown,
  Receipt
} from 'lucide-react';
import { TextInput, SectionCard } from '@/components/shared/FormFields';

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
  subtitle?: string;
  subtitleMarathi?: string;
  icon?: string;
  fields: FieldConfig[];
}

// ==================== REUSABLE COMPONENTS ====================

// 1. Reusable Form Field using TextInput component
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
      <TextInput
        icon={icon}
        value={value}
        onChange={() => {}}
        readOnly={readOnly}
        placeholder=""
      />
    </div>
  );
};

// 2. Reusable Table Component
const VoucherTable: React.FC<{ rows: VoucherRow[] }> = ({ rows }) => {
  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <table className="w-full min-w-[800px] border-collapse bg-white dark:bg-slate-900">
        <thead>
          <tr className="bg-[#0256cc] text-white">
            <th className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">Account Code</th>
            <th className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">Account Name</th>
            <th className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">Tr.Ind</th>
            <th className="px-4 py-3.5 text-right text-xs font-bold tracking-wider">Amount</th>
            <th className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">Particular</th>
            <th className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">User ID</th>
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
  mode?: 'view' | 'edit' | 'authorize';
  onDisplayVouchers?: () => void;
}

export default function DisplayVouchers({
  onClose,
  mode = 'view',
  onDisplayVouchers
}: DisplayVouchersProps) {
  const [formData] = useState<FormData>({
    branchCode: "0002",
    scrollDate: "01-Jun-2026",
    scrollNumber: "117",
  });
  const [isValidated, setIsValidated] = useState(false);

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
      subtitle: "View voucher details",
      subtitleMarathi: "व्हाउचर तपशील पहा",
      icon: "/User.png",
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

  // Handlers
  const handleCancel = (): void => {
    console.log('Cancel clicked');
    onClose?.();
  };

  const handleOk = (): void => {
    console.log('Ok, Got It clicked');
    onClose?.();
  };

  const handleValidate = (): void => {
    setIsValidated(true);
    console.log('Validate clicked');
  };

  const handleSave = (): void => {
    console.log('Save clicked');
    onClose?.();
  };

  const handleAuthorize = (): void => {
    console.log('Authorize clicked');
    onClose?.();
  };

  const handleReject = (): void => {
    console.log('Reject clicked');
    onClose?.();
  };

  // Header Icon Component (replacing Next.js Image)
  const HeaderIcon = () => (
    <div className="relative w-11 h-11 flex-shrink-0">
      <img
        src="/add-icn.png"
        alt="Person"
        className="w-full h-full object-contain"
      />
    </div>
  );

  // Footer render function with inline button styling (matching ChequeBookIssue pattern)
  const renderFooter = () => {
    if (mode === 'authorize') {
      return (
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleReject}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            Reject <X size={16} />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Cancel <X size={16} />
          </button>
          <button
            type="button"
            onClick={handleAuthorize}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Authorize <Check size={16} />
          </button>
        </div>
      );
    }

    if (mode === 'view') {
      return (
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Cancel <X size={16} />
          </button>
          <button
            type="button"
            onClick={handleOk}
            className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            OK, Got it <Check size={16} />
          </button>
        </div>
      );
    }

    // Edit mode
    return (
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0 flex-wrap">
        <button
          type="button"
          onClick={handleValidate}
          disabled={isValidated}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Validate <Check size={16} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Cancel <X size={16} />
        </button>
        <button
          type="button"
          onClick={onDisplayVouchers}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Display Vouchers <Receipt size={16} />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValidated}
          className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save <ChevronDown size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 antialiased font-sans bg-black/40">

      {/* Main Dialog Modal Box */}
      <div className="w-full max-w-7xl max-h-[90vh] bg-white rounded-[28px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">

        {/* Header Block */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Custom User/Plus Logo Icon */}
            <HeaderIcon />

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
            {/* Render sections using SectionCard component */}
            {sections.map((section, sectionIndex) => (
              <SectionCard
                key={sectionIndex}
                titleEn={section.title}
                titleHi={section.titleMarathi}
                subtitleEn={section.subtitle || ""}
                subtitleHi={section.subtitleMarathi || ""}
                icon={section.icon || "/User.png"}
              >
                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {section.fields.map((field) => (
                    <FormField key={field.key} field={field} />
                  ))}
                </div>
              </SectionCard>
            ))}

            {/* 2. VOUCHERS DETAILS CARD - Using SectionCard for consistency */}
            <SectionCard
              titleEn="Vouchers Details"
              titleHi="व्हाउचर तपशील"
              subtitleEn="View voucher transaction details"
              subtitleHi="व्हाउचर व्यवहार तपशील पहा"
              icon="/User.png"
            >
              {/* Custom Responsive Table Component Container */}
              <VoucherTable rows={voucherRows} />
            </SectionCard>
          </div>
        </div>

        {/* Footer Actions Row Button Strip - Fixed position at bottom */}
        {renderFooter()}

      </div>
    </div>
  );
}