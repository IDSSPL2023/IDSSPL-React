import { useEffect, useState } from "react";
import { X, Check, ThumbsUp } from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import TextInput from "@/components/shared/Inputs/TextInput";
import ListModal, { ListModalItem } from "@/components/shared/Modals/ListModal";

export interface ClearingTallyFormData {
  clearingTypeId: string;
  clearingTypeName: string;
  outwardScheduleNo: string;
  outwardScheduleNo2: string;
}

export const emptyClearingTallyFormData: ClearingTallyFormData = {
  clearingTypeId: "0002",
  clearingTypeName: "",
  outwardScheduleNo: "43",
  outwardScheduleNo2: "43",
};

export type ClearingTallyModalMode = "add" | "view";

type RequiredFieldKey = keyof Pick<ClearingTallyFormData, "clearingTypeName">;

const REQUIRED_FIELDS: RequiredFieldKey[] = ["clearingTypeName"];

// Sample clearing type data for picker
const CLEARING_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "0001", name: "Normal Clearing" },
  { id: "2", code: "0002", name: "High Value Clearing" },
  { id: "3", code: "0003", name: "RTGS Clearing" },
  { id: "4", code: "0004", name: "NEFT Clearing" },
];

// Sample outward schedule data for picker
const OUTWARD_SCHEDULE_DATA: ListModalItem[] = [
  { id: "1", code: "41", name: "Schedule 41" },
  { id: "2", code: "42", name: "Schedule 42" },
  { id: "3", code: "43", name: "Schedule 43" },
  { id: "4", code: "44", name: "Schedule 44" },
  { id: "5", code: "45", name: "Schedule 45" },
];

export interface ClearingTallyModalProps {
  open: boolean;
  mode?: ClearingTallyModalMode;
  initialData?: ClearingTallyFormData;
  onClose?: () => void;
  onApply?: (data: ClearingTallyFormData) => void;
}

function ClearingTallyModal({
  open,
  mode = "add",
  initialData = emptyClearingTallyFormData,
  onClose,
  onApply,
}: ClearingTallyModalProps) {
  const [formData, setFormData] = useState<ClearingTallyFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<"clearingType" | "outwardSchedule">(
    "clearingType",
  );

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof ClearingTallyFormData>(
    key: K,
    value: ClearingTallyFormData[K],
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

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  const handleOpenList = (type: "clearingType" | "outwardSchedule") => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: Record<string, any>) => {
    if (listType === "clearingType") {
      handleChange("clearingTypeId", row.code);
      handleChange("clearingTypeName", row.name);
    } else if (listType === "outwardSchedule") {
      handleChange("outwardScheduleNo", row.code);
      handleChange("outwardScheduleNo2", row.code);
    }
    setOpenList(false);
  };

  const getListData = () => {
    if (listType === "clearingType") {
      return {
        title: "Clearing Type List",
        rows: CLEARING_TYPE_DATA,
        codeLabel: "Clearing Type ID",
        nameLabel: "Clearing Type Name",
      };
    } else {
      return {
        title: "Outward Schedule List",
        rows: OUTWARD_SCHEDULE_DATA,
        codeLabel: "Schedule No",
        nameLabel: "Schedule Name",
      };
    }
  };

  const listData = getListData();

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "Clearing Tally Clearing House",
    titleHi: "टेली ब्लिअरिंग हाऊस",
    subtitle: "View the parameter information and associated details.",
    subtitleHi: "पैरामीटरची माहिती आणि संबंधित तपशील पडा.",
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
        label: "Save",
        onClick: handleApply,
        variant: "primary" as const,
        icon: <Check size={16} />,
        disabled: !validated,
        className: validated
          ? "bg-primary-100 text-primary hover:bg-primary-200"
          : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
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
            {/* Clearing Type ID - Picker with List */}
            <PickerInput
              labelEn="Clearing Type ID"
              labelHi="ब्लिअरिंग प्रकार आवडी"
              icon={ICONS.USER_CIRCLE}
              placeholder="Select Clearing Type"
              value={formData.clearingTypeId}
              onChange={(v) => handleChange("clearingTypeId", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("clearingType")}
              required
            />

            {/* Clearing Type Name - Auto-populated from picker selection */}
            <TextInput
              labelEn="Clearing Type Name"
              labelHi="ब्लिअरिंग प्रकार नाव"
              icon={ICONS.USER_CIRCLE}
              placeholder="Clearing Type Name"
              value={formData.clearingTypeName}
              onChange={(v) => handleChange("clearingTypeName", v)}
              hasError={errors.clearingTypeName}
              readOnly
              required
            />

            {/* Outward Schedule No - Picker with List */}
            <PickerInput
              labelEn="Outward Schedule No"
              labelHi="आउटवर्ड सैड्यूल क्रमांक"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Select Schedule"
              value={formData.outwardScheduleNo}
              onChange={(v) => handleChange("outwardScheduleNo", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("outwardSchedule")}
              required={false}
            />

            {/* Outward Schedule No (Duplicate) - Picker with List */}
            <PickerInput
              labelEn="Outward Schedule No"
              labelHi="आउटवर्ड सैड्यूल क्रांक"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Select Schedule"
              value={formData.outwardScheduleNo2}
              onChange={(v) => handleChange("outwardScheduleNo2", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("outwardSchedule")}
              required={false}
            />
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

export default ClearingTallyModal;
