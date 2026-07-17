import { useState } from "react";
import { Check, X, Calculator, FileText, ChevronDown, MoreVertical, User } from "lucide-react";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import ModalWrapperWithHeader from "@/components/shared/Wrappers/ModalWrapperWithHeader";
import { ICONS } from "@/assets";

export interface ServiceChargesInoperativeModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

type PickRow = { code: string; name: string };
type ActivePicker = "accountType" | "serviceCharges" | null;

const ACCOUNT_TYPE_LIST: PickRow[] = [
  { code: "SB", name: "Savings Account" },
  { code: "CA", name: "Current Account" },
  { code: "TD", name: "Term Deposit" },
];

const SERVICE_CHARGES_CODE_LIST: PickRow[] = [
  { code: "SC001", name: "Minimum Balance Charges" },
  { code: "SC002", name: "Account Maintenance Charges" },
  { code: "SC003", name: "Dormant Account Charges" },
];

export default function ServiceChargesInoperativeModal({
  open,
  onClose,
  module,
}: ServiceChargesInoperativeModalProps) {
  const [branchCode, setBranchCode] = useState("0002");
  const [branchName, setBranchName] = useState("Main Branch, Bilagi");
  const [accountType, setAccountType] = useState("");
  const [accountTypeDescription, setAccountTypeDescription] = useState("");
  const [serviceChargesCode, setServiceChargesCode] = useState("");
  const [serviceChargesCodeDescription, setServiceChargesCodeDescription] = useState("");
  const [serviceTaxApply, setServiceTaxApply] = useState(false);
  const [serviceChargeAmount, setServiceChargeAmount] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  if (!open) return null;

  const handlePickRow = (row: PickRow) => {
    if (activePicker === "accountType") {
      setAccountType(row.code);
      setAccountTypeDescription(row.name);
    } else if (activePicker === "serviceCharges") {
      setServiceChargesCode(row.code);
      setServiceChargesCodeDescription(row.name);
    }
    setActivePicker(null);
  };

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () =>
    console.log("Calculate", {
      branchCode,
      accountType,
      serviceChargesCode,
      serviceTaxApply,
      serviceChargeAmount,
    });
  const handleReport = () =>
    console.log("Report", {
      branchCode,
      accountType,
      serviceChargesCode,
      serviceTaxApply,
      serviceChargeAmount,
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
        title="Service Charges Inoperative CA SA Successful"
        subtitle="The service charges inoperative CA/SA operation has been completed successfully."
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
          {/* Branch Code — read-only, prefilled */}
          <FieldWrap label="Branch Code" labelHi="स्क्रोल क्रमांक" required>
            <ReadOnlyInput value={branchCode} icon={<User size={16} className="text-slate-400" />} />
          </FieldWrap>

          {/* Branch Name — read-only, prefilled */}
          <FieldWrap label="Branch Name" labelHi="स्क्रोल क्रमांक" required>
            <ReadOnlyInput value={branchName} icon={<User size={16} className="text-slate-400" />} />
          </FieldWrap>

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
                onClick={() => setActivePicker("accountType")}
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

          {/* Service Charges Code */}
          <FieldWrap label="Service Charges Code" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SelectInput
                  value={serviceChargesCode}
                  onChange={setServiceChargesCode}
                  placeholder="Select Account Type"
                />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("serviceCharges")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </FieldWrap>

          {/* Service Charges Code Description */}
          <FieldWrap label="Service Charges Code Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={serviceChargesCodeDescription}
              onChange={(e) => setServiceChargesCodeDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </FieldWrap>

          {/* Service Tax Apply */}
          <div className="flex items-center justify-between">
            <label className="flex flex-col text-sm font-medium text-black">
              <span>Service Tax Apply</span>
              <span className="text-sm font-normal text-slate-600">निवडा</span>
            </label>
            <div className="flex items-center gap-6">
              {(["Yes", "No"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={opt === "Yes" ? serviceTaxApply : !serviceTaxApply}
                    onChange={() => setServiceTaxApply(opt === "Yes")}
                    className="h-4 w-4 accent-[#1565D8]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Service Charge Amount */}
          <FieldWrap label="Service Charge Amount" labelHi="दिनांकपर्यंत" required>
            <input
              type="text"
              value={serviceChargeAmount}
              onChange={(e) => setServiceChargeAmount(e.target.value)}
              placeholder="Enter Service Charge Amount"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1565D8] focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
            />
          </FieldWrap>
        </div>
      </ModalWrapperWithHeader>

      {/* Account Type / Service Charges Code picker */}
      {activePicker && (
        <ListModal
          title={activePicker === "accountType" ? "Account Type List" : "Service Charges Code List"}
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Description" },
          ]}
          rows={activePicker === "accountType" ? ACCOUNT_TYPE_LIST : SERVICE_CHARGES_CODE_LIST}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
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

function ReadOnlyInput({ value, icon }: { value: string; icon: React.ReactNode }) {
  return (
    <div className="flex h-11 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
      {icon}
      <span className="text-sm text-slate-500">{value}</span>
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
