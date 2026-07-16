import { useEffect, useState } from "react";
import { X, Check, ThumbsUp, FileText, Hash, Tag, Mail } from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import TextInput from "@/components/shared/Inputs/TextInput";
import DateInput from "@/components/shared/Inputs/DateInput";
import ListModal, { ListModalItem } from "@/components/shared/Modals/ListModal";

export interface GeneratedInwardScheduleFormData {
  clearingTypeId: string;
  clearingTypeName: string;
  dailyInwardScheduleNo: string;
  adviceNumber: string;
  scheduleDate: string;
  adviceDate: string;
  original: string;
}

export const emptyGeneratedInwardScheduleFormData: GeneratedInwardScheduleFormData =
  {
    clearingTypeId: "0002",
    clearingTypeName: "",
    dailyInwardScheduleNo: "12",
    adviceNumber: "43",
    scheduleDate: "12-May-2026",
    adviceDate: "12-May-2026",
    original: "name@company.com",
  };

export type GeneratedInwardScheduleModalMode = "add" | "view";

type RequiredFieldKey = keyof Pick<
  GeneratedInwardScheduleFormData,
  "clearingTypeId" | "scheduleDate" | "adviceDate"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "clearingTypeId",
  "scheduleDate",
  "adviceDate",
];

// Sample clearing type data for picker
const CLEARING_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "0001", name: "Normal Clearing" },
  { id: "2", code: "0002", name: "High Value Clearing" },
  { id: "3", code: "0003", name: "RTGS Clearing" },
  { id: "4", code: "0004", name: "NEFT Clearing" },
];

export interface GeneratedInwardScheduleModalProps {
  open: boolean;
  mode?: GeneratedInwardScheduleModalMode;
  initialData?: GeneratedInwardScheduleFormData;
  onClose?: () => void;
  onApply?: (data: GeneratedInwardScheduleFormData) => void;
  onReport?: (data: GeneratedInwardScheduleFormData) => void;
}

function GeneratedInwardScheduleModal({
  open,
  mode = "add",
  initialData = emptyGeneratedInwardScheduleFormData,
  onClose,
  onApply,
  onReport,
}: GeneratedInwardScheduleModalProps) {
  const [formData, setFormData] =
    useState<GeneratedInwardScheduleFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof GeneratedInwardScheduleFormData>(
    key: K,
    value: GeneratedInwardScheduleFormData[K],
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
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleReport = () => {
    if (!validated) return;
    onReport?.(formData);
  };

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  const handleOpenList = () => {
    setOpenList(true);
  };

  const handleSelectItem = (row: Record<string, any>) => {
    handleChange("clearingTypeId", row.code);
    handleChange("clearingTypeName", row.name);
    setOpenList(false);
  };

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "Generated Inward Schedule",
    titleHi: "उत्पन्न झालेलं इनवर्ड शेक्यूल",
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
        label: "Report",
        onClick: handleReport,
        variant: "primary" as const,
        icon: <FileText size={16} />,
        disabled: !validated,
        className: validated
          ? "bg-primary-100 text-primary hover:bg-primary-200"
          : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
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
        maxWidth="5xl"
      >
        <SectionWrapper>
          <div className="grid grid-cols-2 gap-4">
            {/* Clearing Type ID - Picker with List (Editable) */}
            <PickerInput
              labelEn="Clearing Type ID"
              labelHi="क्लिनअरिंग प्रकार आयडी"
              icon={ICONS.USER_CIRCLE}
              placeholder="Select Clearing Type"
              value={formData.clearingTypeId}
              onChange={(v) => handleChange("clearingTypeId", v)}
              readOnly={isView}
              handleOpenList={handleOpenList}
              required
              hasError={errors.clearingTypeId}
            />

            {/* Clearing Type Name - Auto-populated from picker selection (Read Only) */}
            <TextInput
              labelEn="Clearing Type Name"
              labelHi="क्लिनअरिंग प्रकार नाव"
              icon={ICONS.USER_CIRCLE}
              placeholder="Clearing Type Name"
              value={formData.clearingTypeName}
              onChange={(v) => handleChange("clearingTypeName", v)}
              readOnly
              required={false}
            />

            {/* Daily Inward Schedule No - Text Input (Read Only/Disabled) */}
            <TextInput
              labelEn="Daily Inward Schedule No"
              labelHi="दैनंदिन आवक अनुसूची क्रमांक"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Daily Inward Schedule No"
              value={formData.dailyInwardScheduleNo}
              onChange={(v) => handleChange("dailyInwardScheduleNo", v)}
              readOnly
              required={false}
            />

            {/* Advice Number - Text Input (Read Only/Disabled) */}
            <TextInput
              labelEn="Advice Number"
              labelHi="सल्ला क्रमांक"
              icon={ICONS.MESSAGE_LANGUAGE}
              placeholder="Advice Number"
              value={formData.adviceNumber}
              onChange={(v) => handleChange("adviceNumber", v)}
              readOnly
              required={false}
            />

            {/* Schedule Date - Date Input */}
            <DateInput
              labelEn="Schedule Date"
              labelHi="अनुसूची दिनांक"
              icon={ICONS.CALENDAR}
              value={formData.scheduleDate}
              onChange={(v) => handleChange("scheduleDate", v)}
              hasError={errors.scheduleDate}
              readOnly={isView}
              required
            />

            {/* Advice Date - Date Input */}
            <DateInput
              labelEn="Advice Date"
              labelHi="सल्ला दिनांक"
              value={formData.adviceDate}
              onChange={(v) => handleChange("adviceDate", v)}
              hasError={errors.adviceDate}
              readOnly={isView}
              required
            />

            {/* Original - Text Input (Read Only/Disabled) */}
            <TextInput
              labelEn="Original"
              labelHi="Original"
              icon={ICONS.USER_SQUARE}
              placeholder="Original"
              value={formData.original}
              onChange={(v) => handleChange("original", v)}
              readOnly
              required={false}
            />
          </div>
        </SectionWrapper>
      </ModalWrapper>

      {/* List Modal */}
      {openList && (
        <ListModal
          title="Clearing Type List"
          rows={CLEARING_TYPE_DATA}
          codeLabel="Clearing Type ID"
          nameLabel="Clearing Type Name"
          onSelect={handleSelectItem}
          onClose={() => setOpenList(false)}
        />
      )}
    </>
  );
}

export default GeneratedInwardScheduleModal;
