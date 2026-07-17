import { useEffect, useState } from "react";
import { X, Check, ThumbsUp, User, Landmark, Calendar } from "lucide-react";
import TextInput from "../../../shared/Inputs/TextInput";
import DateInput from "../../../shared/Inputs/DateInput";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";

export interface CustomerTDSFlagFormData {
  fromBranchCode: string;
  toBranchCode: string;
  fromDate: string;
  toDate: string;
  payableFromDate: string;
  payableToDate: string;
}

export const emptyCustomerTDSFlagFormData: CustomerTDSFlagFormData = {
  fromBranchCode: "0002",
  toBranchCode: "0007",
  fromDate: "2026-04-01",
  toDate: "2026-06-01",
  payableFromDate: "2026-01-01",
  payableToDate: "2026-05-30",
};

export type CustomerTDSFlagModalMode = "add" | "view";

type RequiredFieldKey = keyof CustomerTDSFlagFormData;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "fromBranchCode",
  "toBranchCode",
  "fromDate",
  "toDate",
  "payableFromDate",
  "payableToDate",
];

export interface CustomerTDSFlagModalProps {
  open: boolean;
  mode?: CustomerTDSFlagModalMode;
  initialData?: CustomerTDSFlagFormData;
  onClose?: () => void;
  onApply?: (data: CustomerTDSFlagFormData) => void;
}

function CustomerTDSFlagModal({
  open,
  mode = "add",
  initialData = emptyCustomerTDSFlagFormData,
  onClose,
  onApply,
}: CustomerTDSFlagModalProps) {
  const [formData, setFormData] =
    useState<CustomerTDSFlagFormData>(initialData);
  const [validated, setValidated] = useState(true); // Start as validated
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setValidated(true); // Reset to true when data changes
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof CustomerTDSFlagFormData>(
    key: K,
    value: CustomerTDSFlagFormData[K],
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
  };

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "Customer TDS Flag Updation",
    titleHi: "ग्राहक TDS फ्लॅग अद्यतनित करणे",
    subtitle: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    onClose: onClose,
    showCloseButton: true,
  });

  // Define footer buttons based on mode
  const getFooterButtons = () => {
    if (isView) {
      return [
        {
          label: "Cancel",
          onClick: onClose || (() => {}),
          variant: "outline" as const,
          icon: <X size={16} />,
        },
        {
          label: "Ok, Got It",
          onClick: onClose || (() => {}),
          variant: "primary" as const,
          icon: <ThumbsUp size={16} />,
        },
      ];
    }

    return [
      {
        label: "Validate",
        onClick: handleValidate,
        variant: "primary" as const,
        icon: <Check size={16} />,
      },
      {
        label: "Cancel",
        onClick: onClose || (() => {}),
        variant: "outline" as const,
        icon: <X size={16} />,
      },
      {
        label: "Update",
        onClick: handleApply,
        variant: "primary" as const,
        icon: <img src={ICONS.UPDATE} />,
        className: "bg-[#F3F4FB] text-[#0B63C1]",
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
        maxWidth="4xl"
      >
        <SectionWrapper>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* From Branch Code - Always readOnly */}
            <TextInput
              labelEn="From Branch Code"
              labelHi="शाखा कोड पासून"
              icon={Landmark}
              placeholder="Enter Branch Code"
              value={formData.fromBranchCode}
              onChange={(v) => handleChange("fromBranchCode", v)}
              hasError={errors.fromBranchCode}
              readOnly={true}
            />

            {/* To Branch Code - Always readOnly */}
            <TextInput
              labelEn="To Branch Code"
              labelHi="शाखा कोड पर्यंत"
              icon={Landmark}
              placeholder="Enter Branch Code"
              value={formData.toBranchCode}
              onChange={(v) => handleChange("toBranchCode", v)}
              hasError={errors.toBranchCode}
              readOnly={true}
            />

            {/* From Date - Always readOnly */}
            <DateInput
              labelEn="From Date"
              labelHi="पासून दिनांक"
              icon={Calendar}
              value={formData.fromDate}
              onChange={(v) => handleChange("fromDate", v)}
              hasError={errors.fromDate}
              readOnly={true}
            />

            {/* To Date - Always readOnly */}
            <DateInput
              labelEn="To Date"
              labelHi="पर्यंत दिनांक"
              icon={Calendar}
              value={formData.toDate}
              onChange={(v) => handleChange("toDate", v)}
              hasError={errors.toDate}
              readOnly={true}
            />

            {/* Payable From Date - Always readOnly */}
            <DateInput
              labelEn="Payable From Date"
              labelHi="देय दिनांकापासून"
              icon={Calendar}
              value={formData.payableFromDate}
              onChange={(v) => handleChange("payableFromDate", v)}
              hasError={errors.payableFromDate}
              readOnly={true}
            />

            {/* Payable To Date - Always readOnly */}
            <DateInput
              labelEn="Payable To Date"
              labelHi="देय दिनांकापर्यंत"
              icon={Calendar}
              value={formData.payableToDate}
              onChange={(v) => handleChange("payableToDate", v)}
              hasError={errors.payableToDate}
              readOnly={true}
            />
          </div>
        </SectionWrapper>
      </ModalWrapper>
    </>
  );
}

export default CustomerTDSFlagModal;
