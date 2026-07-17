import { useState } from "react";
import { toast } from "react-toastify";
import {
  Check,
  X,
  Grid,
  BarChart2,
  Calendar,
  Hash,
  FileText,
  MoreVertical,
  ThumbsUp,
  Calculator,
} from "lucide-react";
import Image from "@/components/ui/Image";
import { FieldShell, TextInput, SelectInput, DateInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import ModalWrapper from "../shared/Wrappers/ModalWrapper";
import { ICONS } from "@/assets";
import SectionWrapper from "../shared/Wrappers/SectionWrapper";
import ModalWrapperWithHeader from "../shared/Wrappers/ModalWrapperWithHeader";

export interface DepositInterestPostingModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

const POST_AS_OPTIONS = ["System Date", "Value Date", "Back Date"];

type SelectMode = "All" | "Single";
type ReportType = "PDF" | "XLS";

type PickRow = { code: string; name: string };

const PRODUCT_CODE_LIST: PickRow[] = [
  { code: "SB001", name: "Savings Account - Regular" },
  { code: "SB002", name: "Savings Account - Premium" },
  { code: "TD001", name: "Term Deposit - Standard" },
  { code: "TD002", name: "Term Deposit - Senior Citizen" },
];

export interface DepositInterestPostingFormData {
  applyUpToDate: string;
  postAs: string;
  selectMode: SelectMode;
  reportType: ReportType;
  productCode: string;
  productDescription: string;
}

const DEFAULT_DEPOSIT_INTEREST_DATA: DepositInterestPostingFormData = {
  applyUpToDate: "",
  postAs: "",
  selectMode: "Single",
  reportType: "PDF",
  productCode: "",
  productDescription: "",
};

type RequiredFieldKey = "applyUpToDate" | "postAs" | "productCode" | "productDescription";

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "applyUpToDate",
  "postAs",
  "productCode",
  "productDescription",
];

/** Same validation approach used by Transaction Master's TDS Transaction form. */
const validateDepositInterestPosting = (
  data: DepositInterestPostingFormData
): Partial<Record<RequiredFieldKey, boolean>> => {
  const errors: Partial<Record<RequiredFieldKey, boolean>> = {};
  REQUIRED_FIELDS.forEach((key) => {
    if (!data[key].trim()) errors[key] = true;
  });
  return errors;
};

/** Same lookup-trigger button used by the TDS Transaction form (Account Code field). */
const LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
    aria-label="Open Product Code list"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

/** Same circular header-icon badge used by the TDS Transaction / Modify TDS Transaction forms. */
const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <Image src="/User.png" alt="Deposit Interest Posting" width={20} height={20} />
  </div>
);

export default function DepositInterestPostingModal({
  open,
  onClose,
  module,
}: DepositInterestPostingModalProps) {
  const [form, setForm] = useState<DepositInterestPostingFormData>(DEFAULT_DEPOSIT_INTEREST_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<RequiredFieldKey, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);

  if (!open) return null;

  const markDirty = (field: keyof DepositInterestPostingFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field as RequiredFieldKey] ? { ...e, [field]: false } : e));
  };

  const updateField = <K extends keyof DepositInterestPostingFormData>(
    field: K,
    value: DepositInterestPostingFormData[K]
  ) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handlePickProduct = (row: PickRow) => {
    markDirty("productCode");
    markDirty("productDescription");
    setForm((f) => ({ ...f, productCode: row.code, productDescription: row.name }));
    setShowProductPicker(false);
  };

  const handleValidate = () => {
    const newErrors = validateDepositInterestPosting(form);
    setErrors(newErrors);
    const hasErrors = Object.keys(newErrors).length > 0;
    setIsValidated(!hasErrors);
    if (hasErrors) {
      toast.error("Please fill all required fields before validating.");
    } else {
      toast.success("All fields validated successfully.");
    }
  };

  const handleCalculate = () => console.log("Calculate", form);
  const handleReport = () => console.log("Report", form);

  const handleApply = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_DEPOSIT_INTEREST_DATA);
    setErrors({});
    setIsValidated(false);
    onClose();
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        title="Interest Posting Successful"
        subtitle="The deposit interest posting operation has been completed successfully."
      />
    );
  }

    const getHeaderConfig = () => ({
      icon: ICONS.PERSON,
      title: "Deposit Interest Posting",
      titleHi: "ठेव व्याज नोंदणी",
      subtitle: "Process interest posting for eligible deposit accounts.",
      subtitleHi: "पात्र ठेव खात्यांसाठी व्याज नोंदणी प्रक्रिया करा.",
      onClose: onClose,
      showCloseButton: true,
    });

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
        onClick: onClose || (() => {}),
        variant: "outline" as const,
        icon: <X size={16} />,
      },
    ];
  };

      // titleEn={module.name}
      //   titleHi="ठेव व्याज नोंदणी"
      //   subtitleEn="Process interest posting for eligible deposit accounts."
      //   subtitleHi="पात्र ठेव खात्यांसाठी व्याज नोंदणी प्रक्रिया करा."


  return (
    <>

  <ModalWrapperWithHeader
        open={open}
        onClose={onClose}
        header={getHeaderConfig()}
        footerButtons={getFooterButtons()}
        footerAlign="right"
        showDefaultClose={false}
        maxWidth="5xl"
      >



        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FieldShell label="Apply Interest Up to Date" labelHi="दिनांकपर्यंत" required error={errors.applyUpToDate}>
            <DateInput
              value={form.applyUpToDate}
              onChange={(v) => updateField("applyUpToDate", v)}
              placeholder="Enter Apply Interest Up to date"
              error={errors.applyUpToDate}
            />
          </FieldShell>

          <FieldShell label="Post As" labelHi="दिनांकपर्यंत" required error={errors.postAs}>
            <SelectInput
              icon={<Calendar size={16} />}
              value={form.postAs}
              onChange={(v) => updateField("postAs", v)}
              options={POST_AS_OPTIONS}
              placeholder="Select Post As"
              error={errors.postAs}
            />
          </FieldShell>

          <div className="flex items-center gap-4">
            <div className="flex shrink-0 flex-col">
              <span className="text-sm font-medium text-black">Select</span>
              <span className="text-sm text-slate-600">निवडा</span>
            </div>
            <div className="flex items-center gap-6">
              {(["All", "Single"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={form.selectMode === opt}
                    onChange={() => updateField("selectMode", opt)}
                    className="h-4 w-4 accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex shrink-0 flex-col">
              <span className="text-sm font-medium text-black">Report Type</span>
              <span className="text-sm text-slate-600">अहवाल प्रकार</span>
            </div>
            <div className="flex items-center gap-6">
              {(["PDF", "XLS"] as const).map((rt) => (
                <label key={rt} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    checked={form.reportType === rt}
                    onChange={() => updateField("reportType", rt)}
                    className="h-4 w-4 accent-primary"
                  />
                  <Image
                    src={rt === "PDF" ? "/PDF.png" : "/XLS.png"}
                    alt={rt}
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </label>
              ))}
            </div>
          </div>

          <FieldShell label="Product Code" labelHi="उत्पादन कोड" required error={errors.productCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.productCode}
                  onChange={(v) => updateField("productCode", v)}
                  placeholder="Select Product Code"
                  error={errors.productCode}
                />
              </div>
              <LookupTrigger onClick={() => setShowProductPicker(true)} />
            </div>
          </FieldShell>

          <FieldShell label="Product Description" labelHi="वर्णन" required error={errors.productDescription}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.productDescription}
              onChange={() => {}}
              placeholder="Description"
              readOnly
              error={errors.productDescription}
            />
          </FieldShell>
        </div>

      </ModalWrapperWithHeader>


      {showProductPicker && (
        <ListModal
          title="Product Code List"
          columns={[
            { key: "code", label: "Product Code" },
            { key: "name", label: "Product Description" },
          ]}
          rows={PRODUCT_CODE_LIST}
          onSelect={handlePickProduct}
          onClose={() => setShowProductPicker(false)}
        />
      )}
    </>
  );
}
