import { useState } from "react";
import { Check, X, Calculator, FileText, ChevronDown, MoreVertical } from "lucide-react";
import { DateInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import ModalWrapperWithHeader from "@/components/shared/Wrappers/ModalWrapperWithHeader";
import { ICONS } from "@/assets";

export interface ExceedBalanceLimitModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

type PickRow = { code: string; name: string };
type ActivePicker = "from" | "to" | null;

const PRODUCT_CODE_LIST: PickRow[] = [
  { code: "SB001", name: "Savings Account - Regular" },
  { code: "SB002", name: "Savings Account - Premium" },
  { code: "TD001", name: "Term Deposit - Standard" },
  { code: "TD002", name: "Term Deposit - Senior Citizen" },
];

export default function ExceedBalanceLimitModal({
  open,
  onClose,
  module,
}: ExceedBalanceLimitModalProps) {
  const [fromProductCode, setFromProductCode] = useState("");
  const [fromProductDescription, setFromProductDescription] = useState("");
  const [toProductCode, setToProductCode] = useState("");
  const [toProductDescription, setToProductDescription] = useState("");
  const [asOnDate, setAsOnDate] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  if (!open) return null;

  const handlePickProduct = (row: PickRow) => {
    if (activePicker === "from") {
      setFromProductCode(row.code);
      setFromProductDescription(row.name);
    } else if (activePicker === "to") {
      setToProductCode(row.code);
      setToProductDescription(row.name);
    }
    setActivePicker(null);
  };

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () =>
    console.log("Calculate", { fromProductCode, toProductCode, asOnDate });
  const handleReport = () =>
    console.log("Report", { fromProductCode, toProductCode, asOnDate });
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
        title="Exceed Balance Limit Amount and Review Date Successful"
        subtitle="The exceed balance limit amount and review date operation has been completed successfully."
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
        maxWidth="4xl"
      >
        <div className="flex flex-col gap-6">
          {/* From Product Code */}
          <FieldWrap label="From Product Code" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SelectInput
                  value={fromProductCode}
                  onChange={setFromProductCode}
                  placeholder="Select Product Code"
                />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("from")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </FieldWrap>

          {/* Product Description (from) */}
          <FieldWrap label="Product Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={fromProductDescription}
              onChange={(e) => setFromProductDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </FieldWrap>

          {/* To Product Code */}
          <FieldWrap label="To Product Code" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SelectInput
                  value={toProductCode}
                  onChange={setToProductCode}
                  placeholder="Select Product Code"
                />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("to")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </FieldWrap>

          {/* Product Description (to) */}
          <FieldWrap label="Product Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={toProductDescription}
              onChange={(e) => setToProductDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </FieldWrap>

          {/* As On Date */}
          <FieldWrap label="As On Date" labelHi="दिनांकपर्यंत" required>
            <DateInput value={asOnDate} onChange={setAsOnDate} placeholder="Enter Date" />
          </FieldWrap>
        </div>
      </ModalWrapperWithHeader>

      {/* Product Code picker */}
      {activePicker && (
        <ListModal
          title="Product Code List"
          columns={[
            { key: "code", label: "Product Code" },
            { key: "name", label: "Product Description" },
          ]}
          rows={PRODUCT_CODE_LIST}
          onSelect={handlePickProduct}
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
