import { useState } from "react";
import { Check, X, Calculator, FileText } from "lucide-react";
import { DateInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ModalWrapperWithHeader from "@/components/shared/Wrappers/ModalWrapperWithHeader";
import { ICONS } from "@/assets";

export interface SavingInterestReportModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

export default function SavingInterestReportModal({
  open,
  onClose,
  module,
}: SavingInterestReportModalProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () => console.log("Calculate", { fromDate, toDate });
  const handleReport = () => console.log("Report", { fromDate, toDate });
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
        title="Saving Interest Report Generated"
        subtitle="The saving interest report has been generated successfully."
      />
    );
  }

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: module.name,
    titleHi: "बचत खाते व्याज अहवाल",
    subtitle: "Process automatic renewal at the beginning of the day.",
    subtitleHi: "दिवसाच्या प्रारंभी स्वयंचलित नूतनीकरण प्रक्रिया करा.",
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
