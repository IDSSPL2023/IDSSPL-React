import { useState } from "react";
import { Check, X, Calculator, FileText, ChevronDown, MoreVertical } from "lucide-react";
import { DateInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import ModalWrapperWithHeader from "@/components/shared/Wrappers/ModalWrapperWithHeader";
import { ICONS } from "@/assets";

export interface TlCcInterestPostingModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

type PickRow = { code: string; name: string };

const ACCOUNT_TYPE_LIST: PickRow[] = [
  { code: "TL", name: "Term Loan" },
  { code: "CC", name: "Cash Credit" },
  { code: "OD", name: "Overdraft" },
];

export default function TlCcInterestPostingModal({
  open,
  onClose,
  module,
}: TlCcInterestPostingModalProps) {
  const [accountType, setAccountType] = useState("");
  const [accountTypeDescription, setAccountTypeDescription] = useState("");
  const [nextIntPostingDate, setNextIntPostingDate] = useState("");
  const [nextIntPostingUpToDate, setNextIntPostingUpToDate] = useState("");
  const [applyServiceCharges, setApplyServiceCharges] = useState(false);
  const [interestReposting, setInterestReposting] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAccountTypePicker, setShowAccountTypePicker] = useState(false);

  if (!open) return null;

  const handlePickAccountType = (row: PickRow) => {
    setAccountType(row.code);
    setAccountTypeDescription(row.name);
    setShowAccountTypePicker(false);
  };

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () =>
    console.log("Calculate", {
      accountType,
      nextIntPostingDate,
      nextIntPostingUpToDate,
      applyServiceCharges,
      interestReposting,
    });
  const handleReport = () =>
    console.log("Report", {
      accountType,
      nextIntPostingDate,
      nextIntPostingUpToDate,
      applyServiceCharges,
      interestReposting,
    });
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
        title="TL/CC Interest Posting Successful"
        subtitle="The TL/CC interest posting operation has been completed successfully."
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
    <>
      <ModalWrapperWithHeader
        open={open}
        onClose={onClose}
        header={getHeaderConfig()}
        footerButtons={getFooterButtons()}
        footerAlign="right"
        showDefaultClose={false}
        maxWidth="6xl"
      >
        <div className="grid w-full grid-cols-2 gap-x-10 gap-y-6">
          {/* Account Type */}
          <FieldWrap label="Account Type" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SelectInput
                  value={accountType}
                  onChange={setAccountType}
                  placeholder="Select Account Type"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAccountTypePicker(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </FieldWrap>

          {/* Account Type Description */}
          <FieldWrap label="Account Type Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={accountTypeDescription}
              onChange={(e) => setAccountTypeDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </FieldWrap>

          {/* Next Int. Posting Date */}
          <FieldWrap label="Next Int. Posting Date" labelHi="दिनांकपर्यंत" required>
            <DateInput
              value={nextIntPostingDate}
              onChange={setNextIntPostingDate}
              placeholder="Enter From Date"
            />
          </FieldWrap>

          {/* Next Int. Posting Up To Date */}
          <FieldWrap label="Next Int. Posting Up To Date" labelHi="दिनांकपर्यंत" required>
            <DateInput
              value={nextIntPostingUpToDate}
              onChange={setNextIntPostingUpToDate}
              placeholder="Enter From Date"
            />
          </FieldWrap>

          {/* Apply Service Charges */}
          <div className="flex items-center justify-between">
            <label className="flex flex-col text-sm font-medium text-black">
              <span>Apply Service Charges</span>
              <span className="text-sm font-normal text-slate-600">निवडा</span>
            </label>
            <div className="flex items-center gap-6">
              {(["Yes", "No"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={opt === "Yes" ? applyServiceCharges : !applyServiceCharges}
                    onChange={() => setApplyServiceCharges(opt === "Yes")}
                    className="h-4 w-4 accent-[#1565D8]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Interest Reposting */}
          <div className="flex items-center justify-between">
            <label className="flex flex-col text-sm font-medium text-black">
              <span>Interest Reposting</span>
              <span className="text-sm font-normal text-slate-600">निवडा</span>
            </label>
            <div className="flex items-center gap-6">
              {(["Yes", "No"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={opt === "Yes" ? interestReposting : !interestReposting}
                    onChange={() => setInterestReposting(opt === "Yes")}
                    className="h-4 w-4 accent-[#1565D8]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>
      </ModalWrapperWithHeader>

      {/* Account Type picker */}
      {showAccountTypePicker && (
        <ListModal
          title="Account Type List"
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Description" },
          ]}
          rows={ACCOUNT_TYPE_LIST}
          onSelect={handlePickAccountType}
          onClose={() => setShowAccountTypePicker(false)}
        />
      )}
    </>
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
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
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
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}
