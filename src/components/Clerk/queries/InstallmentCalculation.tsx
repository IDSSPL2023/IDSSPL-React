// InstallmentCalculation.tsx
import { useEffect, useState } from "react";
import { X, Check, FileText, Calculator, RefreshCw } from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import TextInput from "@/components/shared/Inputs/TextInput";
import ListModal, { ListModalItem } from "@/components/shared/Modals/ListModal";

export interface InstallmentCalculationFormData {
  installmentType: string;
  installmentTypeName: string;
  description: string;
  loanAmount: string;
  interestRate: string;
  repayMode: string;
  repayModeName: string;
  period: string;
  totalInstallment: string;
}

export const emptyInstallmentCalculationFormData: InstallmentCalculationFormData = {
  installmentType: "501",
  installmentTypeName: "Monthly Installment",
  description: "name@company.com",
  loanAmount: "501",
  interestRate: "",
  repayMode: "Monthly",
  repayModeName: "Monthly",
  period: "501",
  totalInstallment: "",
};

export type InstallmentCalculationMode = "view" | "edit";

type RequiredFieldKey = keyof Pick<
  InstallmentCalculationFormData,
  "installmentType" | "description" | "loanAmount" | "interestRate" | "repayMode" | "period" | "totalInstallment"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "installmentType",
  "description",
  "loanAmount",
  "interestRate",
  "repayMode",
  "period",
  "totalInstallment"
];

// Sample data for pickers
const INSTALLMENT_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "501", name: "Monthly Installment" },
  { id: "2", code: "502", name: "Quarterly Installment" },
  { id: "3", code: "503", name: "Half-Yearly Installment" },
  { id: "4", code: "504", name: "Yearly Installment" },
];

const REPAY_MODE_DATA: ListModalItem[] = [
  { id: "1", code: "Monthly", name: "Monthly" },
  { id: "2", code: "Quarterly", name: "Quarterly" },
  { id: "3", code: "Half-Yearly", name: "Half-Yearly" },
  { id: "4", code: "Yearly", name: "Yearly" },
];

export interface InstallmentCalculationProps {
  open: boolean;
  mode?: InstallmentCalculationMode;
  initialData?: InstallmentCalculationFormData;
  onClose?: () => void;
  onApply?: (data: InstallmentCalculationFormData) => void;
  onValidate?: () => void;
  onCalculate?: () => void;
  onGenerate?: () => void;
}

function InstallmentCalculation({
  open,
  mode = "view",
  initialData = emptyInstallmentCalculationFormData,
  onClose,
  onApply,
  onValidate,
  onCalculate,
  onGenerate,
}: InstallmentCalculationProps) {
  const [formData, setFormData] = useState<InstallmentCalculationFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<"installmentType" | "repayMode">("installmentType");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof InstallmentCalculationFormData>(
    key: K,
    value: InstallmentCalculationFormData[K],
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as RequiredFieldKey])
      setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<RequiredFieldKey, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    onValidate?.();
  };

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  const handleOpenList = (type: typeof listType) => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: Record<string, any>) => {
    if (listType === "installmentType") {
      handleChange("installmentType", row.code);
      handleChange("installmentTypeName", row.name);
    } else if (listType === "repayMode") {
      handleChange("repayMode", row.code);
      handleChange("repayModeName", row.name);
    }
    setOpenList(false);
  };

  const getListData = () => {
    if (listType === "installmentType") {
      return {
        title: "Installment Type List",
        rows: INSTALLMENT_TYPE_DATA,
        codeLabel: "Type Code",
        nameLabel: "Type Name",
      };
    } else {
      return {
        title: "Repayment Mode List",
        rows: REPAY_MODE_DATA,
        codeLabel: "Mode Code",
        nameLabel: "Mode Name",
      };
    }
  };

  const listData = getListData();

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "Installment Calculation",
    titleHi: "हुध्दाची गणना",
    subtitle: "Configure earning and deduction components used for payroll calculation and salary processing.",
    subtitleHi: "वेतन गणना व प्रक्रिया करण्यासाठी कमाई व कपात घटकांची संरचना करा.",
    onClose: onClose,
    showCloseButton: true,
  });

  // Define footer buttons
  const getFooterButtons = () => {
    return [
      {
        label: "Validate",
        onClick: handleValidate,
        variant: "primary" as const,
        icon: <Check size={16} />,
      },
      {
        label: "Calculate",
        onClick: onCalculate || (() => {}),
        variant: "outline" as const,
        icon: <Calculator size={16} />,
        className: "bg-gray-100 text-gray-400 hover:bg-[#E8EDF8]",
      },
      {
        label: "Generate",
        onClick: onGenerate || (() => {}),
        variant: "outline" as const,
        icon: <FileText size={16} />,
        className: "bg-gray-100 text-gray-400 hover:bg-[#E8EDF8]",
      },
      {
        label: "Cancel",
        onClick: onClose || (() => {}),
        variant: "outline" as const,
        icon: <X size={16} />,
      },
    ];
  };

  return (
    <>
      <ModalWrapper
        open={open}
        onClose={onClose}
        header={getHeaderConfig()}
        footerButtons={getFooterButtons()}
        footerAlign="right"
        showDefaultClose={false}
        maxWidth="full"
      >
        <SectionWrapper className="mb-6">
          <div className="grid grid-cols-4 gap-4">
            {/* Installment Type */}
            <PickerInput
              labelEn="Installment Type"
              labelHi="हुध्दाचा प्रकार"
              icon={ICONS.USER_CIRCLE}
              placeholder="Select Installment Type"
              value={formData.installmentType}
              onChange={(v) => handleChange("installmentType", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("installmentType")}
              required
              hasError={errors.installmentType}
            />

            {/* Description */}
            <TextInput
              labelEn="Description"
              labelHi="वर्णन"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Description"
              value={formData.description}
              onChange={(v) => handleChange("description", v)}
              readOnly={isView}
              required
              hasError={errors.description}
            />

            {/* Loan Amount */}
            <TextInput
              labelEn="Loan Amount"
              labelHi="कर्ज रक्कम"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Loan Amount"
              value={formData.loanAmount}
              onChange={(v) => handleChange("loanAmount", v)}
              readOnly={isView}
              required
              hasError={errors.loanAmount}
            />

            {/* Interest Rate */}
            <TextInput
              labelEn="Interest Rate %"
              labelHi="व्याज दर %"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Interest Rate"
              value={formData.interestRate}
              onChange={(v) => handleChange("interestRate", v)}
              readOnly={isView}
              required
              hasError={errors.interestRate}
            />

            {/* Repay Mode */}
            <PickerInput
              labelEn="Repay Mode"
              labelHi="परतफेड पद्धत"
              icon={ICONS.USER_CIRCLE}
              placeholder="Select Repay Mode"
              value={formData.repayMode}
              onChange={(v) => handleChange("repayMode", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("repayMode")}
              required
              hasError={errors.repayMode}
            />

            {/* Period */}
            <TextInput
              labelEn="Period"
              labelHi="कालावधी"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Enter Period"
              value={formData.period}
              onChange={(v) => handleChange("period", v)}
              readOnly={isView}
              required
              hasError={errors.period}
            />

            {/* Total Installment - Full Width */}
            <div className="col-span-2">
              <TextInput
                labelEn="Total Installment"
                labelHi="एकूण हप्ता"
                icon={ICONS.USER_CIRCLE}
                placeholder="Enter Total Installment"
                value={formData.totalInstallment}
                onChange={(v) => handleChange("totalInstallment", v)}
                readOnly={isView}
                required
                hasError={errors.totalInstallment}
              />
            </div>
          </div>
        </SectionWrapper>
      </ModalWrapper>

      {/* List Modal */}
      {openList && (
        <ListModal
          title={listData.title}
          rows={listData.rows}
          codeLabel={listData.codeLabel}
          nameLabel={listData.nameLabel}
          onSelect={handleSelectItem}
          onClose={() => setOpenList(false)}
        />
      )}
    </>
  );
}

export default InstallmentCalculation;