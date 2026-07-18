import React, { useEffect, useState } from "react";
import {
  X,
  Check,
  ChevronDown,
  ThumbsUp,
  Landmark,
  Building2,
} from "lucide-react";
import TextInput from "../../shared/Inputs/TextInput";
import PickerInput from "../../shared/Inputs/PickerInput";
import ListModal, { type ListModalItem } from "../../shared/Modals/ListModal";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";

export interface BranchFormData {
  branchCode: string;
  branchName: string;
  areaCode: string;
  areaDescription: string;
  subareaCode: string;
  subareaDescription: string;
}

export const emptyBranchFormData: BranchFormData = {
  branchCode: "0100",
  branchName: "Ikkal Branch",
  areaCode: "",
  areaDescription: "",
  subareaCode: "",
  subareaDescription: "",
};

export type BranchModalMode = "add" | "view";

type RequiredFieldKey = keyof BranchFormData;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "branchCode",
  "branchName",
  "areaCode",
  "areaDescription",
  "subareaCode",
  "subareaDescription",
];

// Sample Area Data
const AREA_DATA: ListModalItem[] = [
  { id: "1", code: "01", name: "Main Bilagi" },
  { id: "2", code: "02", name: "0002 Recovery" },
  { id: "3", code: "03", name: "Downtown Area" },
  { id: "4", code: "04", name: "Industrial Zone" },
  { id: "5", code: "05", name: "Residential Colony" },
];

// Sample Sub-Area Data
const SUB_AREA_DATA: ListModalItem[] = [
  { id: "1", code: "01", name: "Aanadinni" },
  { id: "2", code: "02", name: "Aanegundi" },
  { id: "3", code: "03", name: "Achanur" },
  { id: "4", code: "04", name: "Adavi Sangapur" },
  { id: "5", code: "05", name: "MUDHOLAdihal BRANCH" },
  { id: "6", code: "06", name: "Advi Sangapur" },
  { id: "7", code: "07", name: "Agara" },
  { id: "8", code: "08", name: "Agasanakoppa" },
  { id: "9", code: "09", name: "RAMDURG BRANCH" },
  { id: "10", code: "10", name: "Ahmedabad" },
];

export interface BranchAreaSubAreaModalProps {
  open: boolean;
  mode?: BranchModalMode;
  initialData?: BranchFormData;
  onClose?: () => void;
  onSave?: (data: BranchFormData) => void;
}

function BranchAreaSubAreaModal({
  open,
  mode = "add",
  initialData = emptyBranchFormData,
  onClose,
  onSave,
}: BranchAreaSubAreaModalProps) {
  const [formData, setFormData] = useState<BranchFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<"area" | "subarea">("subarea");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof BranchFormData>(
    key: K,
    value: BranchFormData[K],
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

  const handleSave = () => {
    if (!validated) return;
    onSave?.(formData);
  };

  const handleOpenList = (type: "area" | "subarea") => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    if (listType === "area") {
      handleChange("areaCode", row.code);
    } else {
      handleChange("subareaCode", row.code);
      handleChange("subareaDescription", row.name);
    }
    setOpenList(false);
  };

  const getListData = () => {
    if (listType === "area") {
      return {
        title: "Area List",
        rows: AREA_DATA,
        codeLabel: "Area Code",
        nameLabel: "Area Name",
      };
    } else {
      return {
        title: "Sub-Area List",
        rows: SUB_AREA_DATA,
        codeLabel: "Sub-Area Code",
        nameLabel: "Sub-Area Name",
      };
    }
  };

  const listData = getListData();

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.ADD_PERSON,
    title: "Branch Area / Sub-Area",
    titleHi: "शाखा क्षेत्र / उप-क्षेत्र",
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
        onClick: handleSave,
        variant: "primary" as const,
        icon: <ChevronDown size={16} />,
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
        maxWidth="4xl"
      >
        <SectionWrapper>
          <div className="grid grid-cols-1 gap-4">
            {/* Branch Code - Always readOnly */}
            <TextInput
              labelEn="Branch Code"
              labelHi="शाखा कोड"
              icon={Landmark}
              placeholder="Enter Branch Code"
              value={formData.branchCode}
              onChange={(v) => handleChange("branchCode", v)}
              hasError={errors.branchCode}
              readOnly={true}
            />

            {/* Branch Name - Always readOnly */}
            <TextInput
              labelEn="Branch Name"
              labelHi="शाखेचे नाव"
              icon={Landmark}
              placeholder="Enter Branch Name"
              value={formData.branchName}
              onChange={(v) => handleChange("branchName", v)}
              hasError={errors.branchName}
              readOnly={true}
            />

            {/* Area Code - Disabled in view mode */}
            <PickerInput
              labelEn="Area Code"
              labelHi="क्षेत्रीय कोड"
              icon={Building2}
              placeholder="Enter Area Code"
              value={formData.areaCode}
              onChange={(v) => handleChange("areaCode", v)}
              hasError={errors.areaCode}
              readOnly={isView}
              handleOpenList={() => handleOpenList("area")}
            />

            {/* Area Description - Disabled in view mode */}
            <TextInput
              labelEn="Area Description"
              labelHi="क्षेत्राचे वर्णन"
              icon={Building2}
              placeholder="Area Description"
              value={formData.areaDescription}
              onChange={(v) => handleChange("areaDescription", v)}
              hasError={errors.areaDescription}
              readOnly={isView}
            />

            {/* Sub-Area Code - Disabled in view mode */}
            <PickerInput
              labelEn="Sub-Area Code"
              labelHi="उप-क्षेत्रीय कोड"
              icon={Building2}
              placeholder="Enter Sub-Area Code"
              value={formData.subareaCode}
              onChange={(v) => handleChange("subareaCode", v)}
              hasError={errors.subareaCode}
              readOnly={isView}
              handleOpenList={() => handleOpenList("subarea")}
            />

            {/* Sub-Area Description - Disabled in view mode */}
            <TextInput
              labelEn="Sub-Area Description"
              labelHi="उप-क्षेत्रीय वर्णन"
              icon={Building2}
              placeholder="Sub-Area Description"
              value={formData.subareaDescription}
              onChange={(v) => handleChange("subareaDescription", v)}
              hasError={errors.subareaDescription}
              readOnly={isView}
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

export default BranchAreaSubAreaModal;
