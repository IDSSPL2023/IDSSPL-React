import { useState } from "react";
import { Check, X, Calculator, FileText } from "lucide-react";
import { DateInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ModalWrapperWithHeader from "@/components/shared/Wrappers/ModalWrapperWithHeader";
import { ICONS } from "@/assets";

export interface InterestPostingModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

export default function InterestPostingModal({
  open,
  onClose,
  module,
}: InterestPostingModalProps) {
  const [date, setDate] = useState("");
  const [withTDS, setWithTDS] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () => console.log("Calculate", { date, withTDS });
  const handleReport = () => console.log("Report", { date, withTDS });
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
        title="Interest Posting Successful"
        subtitle="The interest posting operation has been completed successfully."
      />
    );
  }

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: module.name,
    titleHi: module.name,
    subtitle: "Process interest posting for this module.",
    subtitleHi: "या मॉड्यूलसाठी इंटरेस्ट पोस्टिंग प्रक्रिया करा.",
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
        {/* As On Date */}
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-1 text-sm font-medium text-black">
            <span>As On Date</span>
            <span className="text-slate-600">/ दिनांकपर्यंत</span>
            <span className="text-red-500">*</span>
          </label>
          <DateInput value={date} onChange={setDate} placeholder="Enter Date" />
        </div>

        {/* With TDS */}
        <div className="flex items-center gap-[120px]">
          <label className="whitespace-nowrap text-sm font-medium text-[#1F2858]">
            With TDS
            <span className="text-slate-600"> / टीडीएससह</span>
          </label>
          <div className="flex items-center gap-6">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  checked={opt === "Yes" ? withTDS : !withTDS}
                  onChange={() => setWithTDS(opt === "Yes")}
                  className="h-4 w-4 accent-primary"
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
