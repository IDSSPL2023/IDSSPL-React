import { useState } from "react";
import { Check, X, Calculator, FileText, ChevronDown } from "lucide-react";
import { DateInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ModalWrapperWithHeader from "@/components/shared/Wrappers/ModalWrapperWithHeader";
import { ICONS } from "@/assets";

export interface DormantInoperativeSavingModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

const ACCOUNT_OPTIONS = ["Inoperative", "Dormant"] as const;

export default function DormantInoperativeSavingModal({
  open,
  onClose,
  module,
}: DormantInoperativeSavingModalProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [accountType, setAccountType] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () =>
    console.log("Calculate", { fromDate, toDate, accountType });
  const handleReport = () =>
    console.log("Report", { fromDate, toDate, accountType });
  const handleApply = () => setShowSuccess(true);
  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={handleDone}
        onDone={handleDone}
        title="Interest Posting Generated"
        subtitle="The dormant/inoperative saving interest posting has been generated successfully."
      />
    );
  }

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: module.name,
    titleHi: "ठेव व्याज नोंदणी",
    subtitle: "Process interest posting for eligible deposit accounts.",
    subtitleHi: "पात्र ठेव खात्यांसाठी व्याज नोंदणी प्रक्रिया करा.",
    onClose,
    showCloseButton: true,
  });

  const getFooterButtons = () => [
    {
      label: "Validate",
      onClick: handleValidate,
      variant: "primary" as const,
      icon: <Check size={16} />,
    },
    {
      label: "Calculate",
      onClick: handleCalculate,
      variant: "outline" as const,
      icon: <Calculator size={16} />,
      className: "bg-[#F3F4FB] border border-[#0B63C1] text-[#0B63C1]",
    },
    {
      label: "Report",
      onClick: handleReport,
      variant: "outline" as const,
      icon: <FileText size={16} />,
      className: "bg-[#F3F4FB] text-[#0B63C1]",
    },
    {
      label: "Apply",
      onClick: handleApply,
      variant: "primary" as const,
      icon: <Check size={16} />,
      disabled: !isValidated,
      className: isValidated
        ? "bg-primary-100 text-primary hover:bg-primary-200"
        : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
    },
    {
      label: "Cancel",
      onClick: onClose,
      variant: "outline" as const,
      icon: <X size={16} />,
    },
  ];

  return (
    <ModalWrapperWithHeader
      open={open}
      onClose={onClose}
      header={getHeaderConfig()}
      footerButtons={getFooterButtons()}
      footerAlign="right"
      showDefaultClose={false}
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-6">
        {/* From Date */}
        <FieldWrap label="From Date" labelHi="पासून दिनांक" required>
          <DateInput value={fromDate} onChange={setFromDate} placeholder="Enter Date" />
        </FieldWrap>

        {/* To Date */}
        <FieldWrap label="To Date" labelHi="पर्यंत दिनांक" required>
          <DateInput value={toDate} onChange={setToDate} placeholder="Enter Date" />
        </FieldWrap>

        {/* Select Account */}
        <FieldWrap label="Select Account" labelHi="निवडा" required>
          <SelectInput
            value={accountType}
            onChange={setAccountType}
            options={ACCOUNT_OPTIONS}
            placeholder="Select Account"
          />
        </FieldWrap>
      </div>
    </ModalWrapperWithHeader>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function FieldWrap({
  label,
  labelHi,
  required,
  children,
}: {
  label: string;
  labelHi: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="flex items-center gap-1 text-sm font-medium text-black">
        <span>{label}</span>
        <span className="text-slate-600">/ {labelHi}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 focus:border-[#1565D8] focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}
