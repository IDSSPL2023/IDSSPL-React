// components/futuremodels/CertificatePrintModal.tsx

import { useState, useEffect } from "react";
import { X, Check, Printer, Hash, User, Calendar } from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import { ICONS } from "@/assets";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import TextInput from "../shared/Inputs/TextInput";
import DateInput from "../shared/Inputs/DateInput";
import PickerInput from "../shared/Inputs/PickerInput";
import ListModal, { type ListModalItem } from "../shared/Modals/ListModal";

export interface CertificatePrintFormData {
  memberNoForm: string;
  memberType: string;
  toNo: string;
  issueDate: string;
  toDate: string;
}

export const emptyCertificatePrintFormData: CertificatePrintFormData = {
  memberNoForm: "",
  memberType: "",
  toNo: "",
  issueDate: "",
  toDate: "",
};

export interface CertificatePrintModalProps {
  open: boolean;
  initialData?: CertificatePrintFormData;
  readOnly?: boolean;
  onClose?: () => void;
  onValidate?: (data: CertificatePrintFormData) => void;
  onPrint?: (data: CertificatePrintFormData) => void;
}

// Sample data for picker lists
const MEMBER_DATA: ListModalItem[] = [
  { id: "1", code: "M001", name: "Member 001" },
  { id: "2", code: "M002", name: "Member 002" },
  { id: "3", code: "M003", name: "Member 003" },
];

const MEMBER_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "IND", name: "Individual" },
  { id: "2", code: "CORP", name: "Corporate" },
  { id: "3", code: "NRI", name: "NRI" },
];

const TO_NO_DATA: ListModalItem[] = [
  { id: "1", code: "T001", name: "To No 001" },
  { id: "2", code: "T002", name: "To No 002" },
  { id: "3", code: "T003", name: "To No 003" },
];

type ListType = "memberNoForm" | "memberType" | "toNo";

function CertificatePrintModal({
  open,
  initialData = emptyCertificatePrintFormData,
  readOnly = false,
  onClose,
  onValidate,
  onPrint,
}: CertificatePrintModalProps) {
  const [formData, setFormData] = useState<CertificatePrintFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CertificatePrintFormData, boolean>>>({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<ListType>("memberNoForm");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = <K extends keyof CertificatePrintFormData>(
    key: K,
    value: CertificatePrintFormData[K],
  ) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof CertificatePrintFormData)[] = [
      "memberNoForm",
      "memberType",
      "toNo",
      "issueDate",
      "toDate",
    ];
    
    const newErrors: Partial<Record<keyof CertificatePrintFormData, boolean>> = {};
    requiredFields.forEach((key) => {
      if (!formData[key]?.toString().trim()) {
        newErrors[key] = true;
      }
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    return isValid;
  };

  const handleValidate = () => {
    if (readOnly) return;
    const isValid = validateForm();
    if (isValid) {
      onValidate?.(formData);
    }
  };

  const handlePrint = () => {
    const isValid = validateForm();
    if (isValid) {
      onPrint?.(formData);
    }
  };

  const handleOpenList = (type: ListType) => {
    if (readOnly) return;
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    switch (listType) {
      case "memberNoForm":
        handleChange("memberNoForm", row.code);
        break;
      case "memberType":
        handleChange("memberType", row.code);
        break;
      case "toNo":
        handleChange("toNo", row.code);
        break;
    }
    setOpenList(false);
  };

  const getListData = () => {
    switch (listType) {
      case "memberNoForm":
        return {
          title: "Member List",
          rows: MEMBER_DATA,
          codeLabel: "Member Code",
          nameLabel: "Member Name",
        };
      case "memberType":
        return {
          title: "Member Type List",
          rows: MEMBER_TYPE_DATA,
          codeLabel: "Type Code",
          nameLabel: "Type Name",
        };
      case "toNo":
        return {
          title: "To No List",
          rows: TO_NO_DATA,
          codeLabel: "To No Code",
          nameLabel: "To No Name",
        };
    }
  };

  const listData = getListData();

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "Certificate Print",
    titleHi: "सर्टिफिकेट छापणे",
    subtitle: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    onClose: onClose,
    showCloseButton: true,
  });

  const getFooterButtons = () => {
    const buttons = [];

    if (!readOnly) {
      buttons.push({
        label: "Validate",
        onClick: handleValidate,
        variant: "primary" as const,
        icon: <Check size={16} />,
      });
    }

    buttons.push({
      label: "Cancel",
      onClick: onClose || (() => {}),
      variant: "outline" as const,
      icon: <X size={16} />,
    });

    buttons.push({
      label: "Print",
      onClick: handlePrint,
      variant: "primary" as const,
      icon: <Printer size={16} />,
      className: "bg-[#0B63C1] hover:bg-[#0A52A8] text-white",
    });

    return buttons;
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
        maxWidth="2xl"
      >
        <SectionWrapper>
          <div className="grid grid-cols-1 gap-4">
            {/* Member No Form - PickerInput */}
            <PickerInput
              labelEn="Member No Form"
              labelHi="सदस्य क्र. फॉर्म"
              icon={Hash}
              placeholder="Select member number"
              value={formData.memberNoForm}
              onChange={(v) => handleChange("memberNoForm", v)}
              hasError={errors.memberNoForm}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("memberNoForm")}
              required={true}
            />

            {/* Member Type - PickerInput */}
            <PickerInput
              labelEn="Member Type"
              labelHi="सदस्य प्रकार"
              icon={User}
              placeholder="Select member type"
              value={formData.memberType}
              onChange={(v) => handleChange("memberType", v)}
              hasError={errors.memberType}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("memberType")}
              required={true}
            />

            {/* To No - PickerInput */}
            <PickerInput
              labelEn="To No"
              labelHi="क्र. पर्यंत"
              icon={Hash}
              placeholder="Select to number"
              value={formData.toNo}
              onChange={(v) => handleChange("toNo", v)}
              hasError={errors.toNo}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("toNo")}
              required={true}
            />

            {/* Issue Date */}
            <DateInput
              labelEn="Issue Date"
              labelHi="जारी तारीख"
              icon={Calendar}
              value={formData.issueDate}
              onChange={(v) => handleChange("issueDate", v)}
              hasError={errors.issueDate}
              readOnly={readOnly}
              required={true}
              placeholder="Select issue date"
            />

            {/* To Date */}
            <DateInput
              labelEn="To Date"
              labelHi="तारीख पर्यंत"
              icon={Calendar}
              value={formData.toDate}
              onChange={(v) => handleChange("toDate", v)}
              hasError={errors.toDate}
              readOnly={readOnly}
              required={true}
              placeholder="Select to date"
            />
          </div>
        </SectionWrapper>
      </ModalWrapper>

      {/* List Modal */}
      {openList && listData && (
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

export default CertificatePrintModal;