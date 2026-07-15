import React, { useEffect, useState } from "react";
import Image from "@/components/ui/Image";
import {
  X,
  Check,
  ChevronDown,
  ThumbsUp,
  Landmark,
  Building2,
} from "lucide-react";
import TextInput from "../shared/Inputs/TextInput";
import PickerInput from "../shared/Inputs/PickerInput";
import ListModal, { type ListModalItem } from "./ListModal";

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
      // Only set the code, not the description
      handleChange("areaCode", row.code);
      // Don't set areaDescription - it should be filled manually
    } else {
      // For sub-area, set both code and description
      handleChange("subareaCode", row.code);
      handleChange("subareaDescription", row.name);
    }
    setOpenList(false);
  };

  // Get the appropriate data and labels based on list type
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

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
        onClick={onClose}
      >
        <div
          className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="shrink-0 p-6 pb-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Image src="/add-icn.png" alt="" width={64} height={64} />
                <div>
                  <h2 className="text-[2rem] font-bold text-[#101828] dark:text-slate-100">
                    Branch Area / Sub-Area{" "}
                    <span className="font-bold text-[#64748B] dark:text-slate-400">
                      / शाखा क्षेत्र / उप-क्षेत्र
                    </span>
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Scrollable Content - Middle */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="rounded-[20px] border-x border-b space-y-4 border-t-4 border-primary bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
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
          </div>

          {/* Footer - Fixed */}
          <div className="shrink-0 p-6 pt-4">
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              {isView ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    Cancel <X size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    Ok, Got It <ThumbsUp size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleValidate}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    Validate <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    Cancel <X size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={!validated}
                    onClick={handleSave}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      validated
                        ? "bg-primary-100 text-primary hover:bg-primary-200"
                        : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600"
                    }`}
                  >
                    Save <ChevronDown size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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
