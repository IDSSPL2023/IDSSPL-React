import { useState } from "react";
import { Check, X, Calculator, FileText } from "lucide-react";
import { DateInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ModalWrapperWithHeader from "@/components/shared/Wrappers/ModalWrapperWithHeader";
import { ICONS } from "@/assets";

export interface DepreciationCalculationModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

export default function DepreciationCalculationModal({
  open,
  onClose,
  module,
}: DepreciationCalculationModalProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [balanceDate, setBalanceDate] = useState("");
  const [roundingRequired, setRoundingRequired] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () => console.log("Calculate", { fromDate, toDate, balanceDate, roundingRequired });
  const handleReport = () => console.log("Report", { fromDate, toDate, balanceDate, roundingRequired });
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
        title="Depreciation Calculation Successful"
        subtitle="The depreciation calculation operation has been completed successfully."
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
        <FieldWrap label="From Date" labelHi="दिनांकपर्यंत" required>
          <DateInput value={fromDate} onChange={setFromDate} placeholder="Enter From Date" />
        </FieldWrap>

        {/* To Date */}
        <FieldWrap label="To Date" labelHi="दिनांकपर्यंत" required>
          <DateInput value={toDate} onChange={setToDate} placeholder="Enter To Date" />
        </FieldWrap>

        {/* Balance Date for Simple Deprection */}
        <FieldWrap label="Balance Date for Simple Deprection" labelHi="दिनांकपर्यंत" required>
          <DateInput
            value={balanceDate}
            onChange={setBalanceDate}
            placeholder="Enter Balance Date for Simple Deprection"
          />
        </FieldWrap>

        {/* Rounding Required */}
        <div className="flex items-center gap-[120px]">
          <label className="flex flex-col text-sm font-medium text-black">
            <span>Rounding Required</span>
            <span className="text-sm font-normal text-slate-600">निवडा</span>
          </label>
          <div className="flex items-center gap-6">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  checked={opt === "Yes" ? roundingRequired : !roundingRequired}
                  onChange={() => setRoundingRequired(opt === "Yes")}
                  className="h-4 w-4 accent-[#1565D8]"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
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
