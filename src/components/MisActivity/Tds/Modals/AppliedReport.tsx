import { useEffect, useState } from "react";
import {
  X,
  Check,
  ThumbsUp,
  Landmark,
  Building2,
  Percent,
  FileText,
  Calculator,
} from "lucide-react";
import TextInput from "../../../shared/Inputs/TextInput";
import PickerInput from "../../../shared/Inputs/PickerInput";
import DateInput from "../../../shared/Inputs/DateInput";
import RadioInput from "../../../shared/Inputs/RadioInput";
import ListModal, { type ListModalItem } from "../../../shared/Modals/ListModal";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";

export interface TDSAppliedReportFormData {
  fromBranch: string;
  toBranch: string;
  fromDate: string;
  toDate: string;
  tdsRate: string;
  branchName: string;
  description: string;
  reportType: string;
}

export const emptyTDSAppliedReportFormData: TDSAppliedReportFormData = {
  fromBranch: "",
  toBranch: "",
  fromDate: "",
  toDate: "",
  tdsRate: "",
  branchName: "",
  description: "",
  reportType: "pdf",
};

export type TDSAppliedReportModalMode = "add" | "view";

type RequiredFieldKey = keyof Pick<
  TDSAppliedReportFormData,
  "fromBranch" | "toBranch" | "fromDate" | "toDate" | "tdsRate"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "fromBranch",
  "toBranch",
  "fromDate",
  "toDate",
  "tdsRate",
];

type ListType = "fromBranch" | "toBranch";

const BRANCH_DATA: ListModalItem[] = [
  { id: "1", code: "001", name: "Main Branch" },
  { id: "2", code: "002", name: "Ikkal Branch" },
  { id: "3", code: "003", name: "Mudhol Branch" },
  { id: "4", code: "004", name: "Ramdurg Branch" },
  { id: "5", code: "005", name: "Belgaum Branch" },
];

const REPORT_TYPE_OPTIONS = ["PDF", "TXT"];

export interface TDSAppliedReportModalProps {
  open: boolean;
  mode?: TDSAppliedReportModalMode;
  initialData?: TDSAppliedReportFormData;
  onClose?: () => void;
  onApply?: (data: TDSAppliedReportFormData) => void;
}

function TDSAppliedReportModal({
  open,
  mode = "add",
  initialData = emptyTDSAppliedReportFormData,
  onClose,
  onApply,
}: TDSAppliedReportModalProps) {
  const [formData, setFormData] =
    useState<TDSAppliedReportFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<ListType>("fromBranch");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof TDSAppliedReportFormData>(
    key: K,
    value: TDSAppliedReportFormData[K],
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

  const handleOpenList = (type: ListType) => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    if (listType === "fromBranch") {
      handleChange("fromBranch", row.code);
      handleChange("branchName", row.name);
    } else {
      handleChange("toBranch", row.code);
      handleChange("description", row.name);
    }
    setOpenList(false);
  };

  const getListData = () => {
    return {
      title: listType === "fromBranch" ? "From Branch List" : "To Branch List",
      rows: BRANCH_DATA,
      codeLabel: "Branch Code",
      nameLabel: "Branch Name",
    };
  };

  const listData = getListData();

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "TDS Applied Report",
    titleHi: "ठेव व्याज नोंदणी",
    subtitle: "Process interest posting for eligible deposit accounts.",
    subtitleHi: "पात्र ठेव खात्यांसाठी व्याज नोंदणी प्रक्रिया करा.",
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
        label: "Calculate",
        onClick: () => {},
        variant: "outline" as const,
        icon: <Calculator size={16} />,
        className: "bg-[#F3F4FB] border border-[#0B63C1] text-[#0B63C1]",
      },
      {
        label: "Report",
        onClick: () => {},
        variant: "outline" as const,
        icon: <FileText size={16} />,
        className: "bg-[#F3F4FB] text-[#0B63C1]",
      },
      {
        label: "Apply",
        onClick: handleApply,
        variant: "primary" as const,
        icon: <Check size={16} />,
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
        maxWidth="4xl"
      >
        <SectionWrapper>
          <div className="grid grid-cols-2 gap-4">
            {/* From Branch */}
            <PickerInput
              labelEn="From Branch"
              labelHi="उत्पादन कोड"
              icon={Landmark}
              placeholder="Select Account Type"
              value={formData.fromBranch}
              onChange={(v) => handleChange("fromBranch", v)}
              hasError={errors.fromBranch}
              readOnly={isView}
              handleOpenList={() => handleOpenList("fromBranch")}
            />

            {/* Branch Name - Always readOnly */}
            <TextInput
              labelEn="Branch Name"
              labelHi="वर्णन"
              icon={Building2}
              placeholder="Description"
              value={formData.branchName}
              onChange={(v) => handleChange("branchName", v)}
              required={false}
              readOnly
            />

            {/* To Branch */}
            <PickerInput
              labelEn="To Branch"
              labelHi="उत्पादन कोड"
              icon={Building2}
              placeholder="Select Account Type"
              value={formData.toBranch}
              onChange={(v) => handleChange("toBranch", v)}
              hasError={errors.toBranch}
              readOnly={isView}
              handleOpenList={() => handleOpenList("toBranch")}
            />

            {/* Description - Always readOnly */}
            <TextInput
              labelEn="Description"
              labelHi="वर्णन"
              icon={FileText}
              placeholder="Description"
              value={formData.description}
              onChange={(v) => handleChange("description", v)}
              required={false}
              readOnly
            />

            {/* From Date */}
            <DateInput
              labelEn="From Date"
              labelHi="दिनांकपर्यंत"
              value={formData.fromDate}
              onChange={(v) => handleChange("fromDate", v)}
              hasError={errors.fromDate}
              readOnly={isView}
            />

            {/* To Date */}
            <DateInput
              labelEn="To Date"
              labelHi="दिनांकपर्यंत"
              value={formData.toDate}
              onChange={(v) => handleChange("toDate", v)}
              hasError={errors.toDate}
              readOnly={isView}
            />

            {/* TDS Rate */}
            <TextInput
              labelEn="TDS Rate"
              labelHi="दिनांकपर्यंत"
              icon={Percent}
              placeholder="Enter TDS Rate"
              value={formData.tdsRate}
              onChange={(v) => handleChange("tdsRate", v)}
              hasError={errors.tdsRate}
              readOnly={isView}
            />

            {/* Report Type - Radio */}
            <RadioInput
              label="Report Type"
              labelHi="अहवाल प्रकार"
              value={formData.reportType}
              onChange={(v) => handleChange("reportType", v)}
              disabled={isView}
              options={[
                {
                  value: "pdf",
                  icon: ICONS.PDF,
                  label: "PDF",
                },
                {
                  value: "txt",
                  icon: ICONS.TXT,
                  label: "TXT",
                },
              ]}
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

export default TDSAppliedReportModal;
