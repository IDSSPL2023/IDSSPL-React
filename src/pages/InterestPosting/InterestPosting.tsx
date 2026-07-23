import { useState, useMemo } from "react";
import { Check, X, Calculator, FileText, ChevronDown, MoreVertical, User, Grid, BarChart2, Calendar, Hash, ThumbsUp, Search, ChevronRight } from "lucide-react";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import ModalWrapperWithHeader from "@/components/shared/Wrappers/ModalWrapperWithHeader";
import { ICONS, IMAGES } from "@/assets";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import { FieldShell, TextInput, SelectInput, DateInput } from "@/components/shared/FormFields";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import { interestPostingModules } from "@/constants/interestPostingModules";

/* ===== from ApplyServiceChargesLiveModal.tsx ===== */
export interface ApplyServiceChargesLiveModal_ApplyServiceChargesLiveModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

type ApplyServiceChargesLiveModal_PickRow = { code: string; name: string };
type ApplyServiceChargesLiveModal_ActivePicker = "accountType" | "serviceCharges" | null;

const ApplyServiceChargesLiveModal_ACCOUNT_TYPE_LIST: ApplyServiceChargesLiveModal_PickRow[] = [
  { code: "SB", name: "Savings Account" },
  { code: "CA", name: "Current Account" },
  { code: "TD", name: "Term Deposit" },
];

const ApplyServiceChargesLiveModal_SERVICE_CHARGES_CODE_LIST: ApplyServiceChargesLiveModal_PickRow[] = [
  { code: "SC001", name: "Minimum Balance Charges" },
  { code: "SC002", name: "Account Maintenance Charges" },
  { code: "SC003", name: "Dormant Account Charges" },
];

function ApplyServiceChargesLiveModal({
  open,
  onClose,
  module,
}: ApplyServiceChargesLiveModal_ApplyServiceChargesLiveModalProps) {
  const [branchCode, setBranchCode] = useState("0002");
  const [branchName, setBranchName] = useState("Main Branch, Bilagi");
  const [accountType, setAccountType] = useState("");
  const [accountTypeDescription, setAccountTypeDescription] = useState("");
  const [serviceChargesCode, setServiceChargesCode] = useState("");
  const [serviceChargesCodeDescription, setServiceChargesCodeDescription] = useState("");
  const [serviceTaxApply, setServiceTaxApply] = useState(false);
  const [serviceChargeAmount, setServiceChargeAmount] = useState("");
  const [noOfDays, setNoOfDays] = useState("");
  const [checkMinimumBal, setCheckMinimumBal] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePicker, setActivePicker] = useState<ApplyServiceChargesLiveModal_ActivePicker>(null);

  if (!open) return null;

  const handlePickRow = (row: ApplyServiceChargesLiveModal_PickRow) => {
    if (activePicker === "accountType") {
      setAccountType(row.code);
      setAccountTypeDescription(row.name);
    } else if (activePicker === "serviceCharges") {
      setServiceChargesCode(row.code);
      setServiceChargesCodeDescription(row.name);
    }
    setActivePicker(null);
  };

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () =>
    console.log("Calculate", {
      branchCode,
      accountType,
      serviceChargesCode,
      serviceTaxApply,
      serviceChargeAmount,
      noOfDays,
      checkMinimumBal,
    });
  const handleReport = () =>
    console.log("Report", {
      branchCode,
      accountType,
      serviceChargesCode,
      serviceTaxApply,
      serviceChargeAmount,
      noOfDays,
      checkMinimumBal,
    });
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
        title="Apply Service Charges Live SB CA Successful"
        subtitle="The apply service charges live SB/CA operation has been completed successfully."
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
        maxWidth="6xl"
      >
        <div className="grid w-full grid-cols-2 gap-x-10 gap-y-6">
          {/* Branch Code — read-only, prefilled */}
          <ApplyServiceChargesLiveModal_FieldWrap label="Branch Code" labelHi="स्क्रोल क्रमांक" required>
            <ApplyServiceChargesLiveModal_ReadOnlyInput value={branchCode} icon={<User size={16} className="text-slate-400" />} />
          </ApplyServiceChargesLiveModal_FieldWrap>

          {/* Branch Name — read-only, prefilled */}
          <ApplyServiceChargesLiveModal_FieldWrap label="Branch Name" labelHi="स्क्रोल क्रमांक" required>
            <ApplyServiceChargesLiveModal_ReadOnlyInput value={branchName} icon={<User size={16} className="text-slate-400" />} />
          </ApplyServiceChargesLiveModal_FieldWrap>

          {/* Account Type */}
          <ApplyServiceChargesLiveModal_FieldWrap label="Account Type" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ApplyServiceChargesLiveModal_SelectInput
                  value={accountType}
                  onChange={setAccountType}
                  placeholder="Select Account Type"
                />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("accountType")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </ApplyServiceChargesLiveModal_FieldWrap>

          {/* Account Type Description */}
          <ApplyServiceChargesLiveModal_FieldWrap label="Account Type Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={accountTypeDescription}
              onChange={(e) => setAccountTypeDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </ApplyServiceChargesLiveModal_FieldWrap>

          {/* Service Charges Code */}
          <ApplyServiceChargesLiveModal_FieldWrap label="Service Charges Code" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ApplyServiceChargesLiveModal_SelectInput
                  value={serviceChargesCode}
                  onChange={setServiceChargesCode}
                  placeholder="Select Account Type"
                />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("serviceCharges")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </ApplyServiceChargesLiveModal_FieldWrap>

          {/* Service Charges Code Description */}
          <ApplyServiceChargesLiveModal_FieldWrap label="Service Charges Code Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={serviceChargesCodeDescription}
              onChange={(e) => setServiceChargesCodeDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </ApplyServiceChargesLiveModal_FieldWrap>

          {/* Service Tax Apply */}
          <div className="flex items-center justify-between">
            <label className="flex flex-col text-sm font-medium text-black">
              <span>Service Tax Apply</span>
              <span className="text-sm font-normal text-slate-600">निवडा</span>
            </label>
            <div className="flex items-center gap-6">
              {(["Yes", "No"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={opt === "Yes" ? serviceTaxApply : !serviceTaxApply}
                    onChange={() => setServiceTaxApply(opt === "Yes")}
                    className="h-4 w-4 accent-[#1565D8]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Service Charge Amount */}
          <ApplyServiceChargesLiveModal_FieldWrap label="Service Charge Amount" labelHi="दिनांकपर्यंत" required>
            <input
              type="text"
              value={serviceChargeAmount}
              onChange={(e) => setServiceChargeAmount(e.target.value)}
              placeholder="Enter Service Charge Amount"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1565D8] focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
            />
          </ApplyServiceChargesLiveModal_FieldWrap>

          {/* No of Days */}
          <ApplyServiceChargesLiveModal_FieldWrap label="No of Days" labelHi="दिनांकपर्यंत" required>
            <input
              type="text"
              value={noOfDays}
              onChange={(e) => setNoOfDays(e.target.value)}
              placeholder="Enter No of days"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1565D8] focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
            />
          </ApplyServiceChargesLiveModal_FieldWrap>

          {/* Check Minimum Bal */}
          <div className="flex items-center justify-between">
            <label className="flex flex-col text-sm font-medium text-black">
              <span>Check Minimum Bal</span>
              <span className="text-sm font-normal text-slate-600">निवडा</span>
            </label>
            <div className="flex items-center gap-6">
              {(["Yes", "No"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={opt === "Yes" ? checkMinimumBal : !checkMinimumBal}
                    onChange={() => setCheckMinimumBal(opt === "Yes")}
                    className="h-4 w-4 accent-[#1565D8]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>
      </ModalWrapperWithHeader>

      {/* Account Type / Service Charges Code picker */}
      {activePicker && (
        <ListModal
          title={activePicker === "accountType" ? "Account Type List" : "Service Charges Code List"}
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Description" },
          ]}
          rows={activePicker === "accountType" ? ApplyServiceChargesLiveModal_ACCOUNT_TYPE_LIST : ApplyServiceChargesLiveModal_SERVICE_CHARGES_CODE_LIST}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function ApplyServiceChargesLiveModal_FieldWrap({
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

function ApplyServiceChargesLiveModal_ReadOnlyInput({ value, icon }: { value: string; icon: React.ReactNode }) {
  return (
    <div className="flex h-11 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
      {icon}
      <span className="text-sm text-slate-500">{value}</span>
    </div>
  );
}

function ApplyServiceChargesLiveModal_SelectInput({
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


/* ===== from DepositInterestPostingModal.tsx ===== */
export interface DepositInterestPostingModal_DepositInterestPostingModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

const DepositInterestPostingModal_POST_AS_OPTIONS = ["System Date", "Value Date", "Back Date"];

type DepositInterestPostingModal_SelectMode = "All" | "Single";
type DepositInterestPostingModal_ReportType = "PDF" | "XLS";

type DepositInterestPostingModal_PickRow = { code: string; name: string };

const DepositInterestPostingModal_PRODUCT_CODE_LIST: DepositInterestPostingModal_PickRow[] = [
  { code: "SB001", name: "Savings Account - Regular" },
  { code: "SB002", name: "Savings Account - Premium" },
  { code: "TD001", name: "Term Deposit - Standard" },
  { code: "TD002", name: "Term Deposit - Senior Citizen" },
];

export interface DepositInterestPostingModal_DepositInterestPostingFormData {
  applyUpToDate: string;
  postAs: string;
  selectMode: DepositInterestPostingModal_SelectMode;
  reportType: DepositInterestPostingModal_ReportType;
  productCode: string;
  productDescription: string;
}

const DepositInterestPostingModal_DEFAULT_DEPOSIT_INTEREST_DATA: DepositInterestPostingModal_DepositInterestPostingFormData = {
  applyUpToDate: "",
  postAs: "",
  selectMode: "Single",
  reportType: "PDF",
  productCode: "",
  productDescription: "",
};

type DepositInterestPostingModal_RequiredFieldKey = "applyUpToDate" | "postAs" | "productCode" | "productDescription";

const DepositInterestPostingModal_REQUIRED_FIELDS: DepositInterestPostingModal_RequiredFieldKey[] = [
  "applyUpToDate",
  "postAs",
  "productCode",
  "productDescription",
];

/** Same validation approach used by Transaction Master's TDS Transaction form. */
const DepositInterestPostingModal_validateDepositInterestPosting = (
  data: DepositInterestPostingModal_DepositInterestPostingFormData
): Partial<Record<DepositInterestPostingModal_RequiredFieldKey, boolean>> => {
  const errors: Partial<Record<DepositInterestPostingModal_RequiredFieldKey, boolean>> = {};
  DepositInterestPostingModal_REQUIRED_FIELDS.forEach((key) => {
    if (!data[key].trim()) errors[key] = true;
  });
  return errors;
};

/** Same lookup-trigger button used by the TDS Transaction form (Account Code field). */
const DepositInterestPostingModal_LookupTrigger = ({ onClick }: { onClick: () => void }) => (
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
const DepositInterestPostingModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <Image src={IMAGES.USER} alt="Deposit Interest Posting" width={20} height={20} />
  </div>
);

function DepositInterestPostingModal({
  open,
  onClose,
  module,
}: DepositInterestPostingModal_DepositInterestPostingModalProps) {
  const [form, setForm] = useState<DepositInterestPostingModal_DepositInterestPostingFormData>(DepositInterestPostingModal_DEFAULT_DEPOSIT_INTEREST_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<DepositInterestPostingModal_RequiredFieldKey, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);

  if (!open) return null;

  const markDirty = (field: keyof DepositInterestPostingModal_DepositInterestPostingFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field as DepositInterestPostingModal_RequiredFieldKey] ? { ...e, [field]: false } : e));
  };

  const updateField = <K extends keyof DepositInterestPostingModal_DepositInterestPostingFormData>(
    field: K,
    value: DepositInterestPostingModal_DepositInterestPostingFormData[K]
  ) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handlePickProduct = (row: DepositInterestPostingModal_PickRow) => {
    markDirty("productCode");
    markDirty("productDescription");
    setForm((f) => ({ ...f, productCode: row.code, productDescription: row.name }));
    setShowProductPicker(false);
  };

  const handleValidate = () => {
    const newErrors = DepositInterestPostingModal_validateDepositInterestPosting(form);
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
    setForm(DepositInterestPostingModal_DEFAULT_DEPOSIT_INTEREST_DATA);
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
              options={DepositInterestPostingModal_POST_AS_OPTIONS}
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
                    src={rt === "PDF" ? IMAGES.PDF : IMAGES.XLS}
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
              <DepositInterestPostingModal_LookupTrigger onClick={() => setShowProductPicker(true)} />
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
          rows={DepositInterestPostingModal_PRODUCT_CODE_LIST}
          onSelect={handlePickProduct}
          onClose={() => setShowProductPicker(false)}
        />
      )}
    </>
  );
}


/* ===== from DepreciationCalculationModal.tsx ===== */
export interface DepreciationCalculationModal_DepreciationCalculationModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

function DepreciationCalculationModal({
  open,
  onClose,
  module,
}: DepreciationCalculationModal_DepreciationCalculationModalProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [balanceDate, setBalanceDate] = useState("");
  const [roundingRequired, setRoundingRequired] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () => console.log("Calculate", { fromDate, toDate, balanceDate, roundingRequired });
  const handleReport = () => console.log("Report", { fromDate, toDate, balanceDate, roundingRequired });
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
        title="Depreciation Calculation Successful"
        subtitle="The depreciation calculation operation has been completed successfully."
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
        {/* From Date */}
        <DepreciationCalculationModal_FieldWrap label="From Date" labelHi="दिनांकपर्यंत" required>
          <DateInput value={fromDate} onChange={setFromDate} placeholder="Enter From Date" />
        </DepreciationCalculationModal_FieldWrap>

        {/* To Date */}
        <DepreciationCalculationModal_FieldWrap label="To Date" labelHi="दिनांकपर्यंत" required>
          <DateInput value={toDate} onChange={setToDate} placeholder="Enter To Date" />
        </DepreciationCalculationModal_FieldWrap>

        {/* Balance Date for Simple Deprection */}
        <DepreciationCalculationModal_FieldWrap label="Balance Date for Simple Deprection" labelHi="दिनांकपर्यंत" required>
          <DateInput
            value={balanceDate}
            onChange={setBalanceDate}
            placeholder="Enter Balance Date for Simple Deprection"
          />
        </DepreciationCalculationModal_FieldWrap>

        {/* Rounding Required */}
        <div className="flex items-center gap-[120px]">
          <label className="flex flex-col text-sm font-medium text-black">
            <span>Rounding Required</span>
            <span className="text-sm font-normal text-slate-600">निवडा</span>
          </label>
          <div className="flex items-center gap-6">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  checked={opt === "Yes" ? roundingRequired : !roundingRequired}
                  onChange={() => setRoundingRequired(opt === "Yes")}
                  className="h-4 w-4 accent-[#1565D8]"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapperWithHeader>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function DepreciationCalculationModal_FieldWrap({
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


/* ===== from DormantInoperativeSavingModal.tsx ===== */
export interface DormantInoperativeSavingModal_DormantInoperativeSavingModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

const DormantInoperativeSavingModal_ACCOUNT_OPTIONS = ["Inoperative", "Dormant"] as const;

function DormantInoperativeSavingModal({
  open,
  onClose,
  module,
}: DormantInoperativeSavingModal_DormantInoperativeSavingModalProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [accountType, setAccountType] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () =>
    console.log("Calculate", { fromDate, toDate, accountType });
  const handleReport = () =>
    console.log("Report", { fromDate, toDate, accountType });
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
        title="Interest Posting Generated"
        subtitle="The dormant/inoperative saving interest posting has been generated successfully."
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
        {/* From Date */}
        <DormantInoperativeSavingModal_FieldWrap label="From Date" labelHi="पासून दिनांक" required>
          <DateInput value={fromDate} onChange={setFromDate} placeholder="Enter Date" />
        </DormantInoperativeSavingModal_FieldWrap>

        {/* To Date */}
        <DormantInoperativeSavingModal_FieldWrap label="To Date" labelHi="पर्यंत दिनांक" required>
          <DateInput value={toDate} onChange={setToDate} placeholder="Enter Date" />
        </DormantInoperativeSavingModal_FieldWrap>

        {/* Select Account */}
        <DormantInoperativeSavingModal_FieldWrap label="Select Account" labelHi="निवडा" required>
          <DormantInoperativeSavingModal_SelectInput
            value={accountType}
            onChange={setAccountType}
            options={DormantInoperativeSavingModal_ACCOUNT_OPTIONS}
            placeholder="Select Account"
          />
        </DormantInoperativeSavingModal_FieldWrap>
      </div>
    </ModalWrapperWithHeader>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function DormantInoperativeSavingModal_FieldWrap({
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

function DormantInoperativeSavingModal_SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
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
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}


/* ===== from ExceedBalanceLimitModal.tsx ===== */
export interface ExceedBalanceLimitModal_ExceedBalanceLimitModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

type ExceedBalanceLimitModal_PickRow = { code: string; name: string };
type ExceedBalanceLimitModal_ActivePicker = "from" | "to" | null;

const ExceedBalanceLimitModal_PRODUCT_CODE_LIST: ExceedBalanceLimitModal_PickRow[] = [
  { code: "SB001", name: "Savings Account - Regular" },
  { code: "SB002", name: "Savings Account - Premium" },
  { code: "TD001", name: "Term Deposit - Standard" },
  { code: "TD002", name: "Term Deposit - Senior Citizen" },
];

function ExceedBalanceLimitModal({
  open,
  onClose,
  module,
}: ExceedBalanceLimitModal_ExceedBalanceLimitModalProps) {
  const [fromProductCode, setFromProductCode] = useState("");
  const [fromProductDescription, setFromProductDescription] = useState("");
  const [toProductCode, setToProductCode] = useState("");
  const [toProductDescription, setToProductDescription] = useState("");
  const [asOnDate, setAsOnDate] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePicker, setActivePicker] = useState<ExceedBalanceLimitModal_ActivePicker>(null);

  if (!open) return null;

  const handlePickProduct = (row: ExceedBalanceLimitModal_PickRow) => {
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
          <ExceedBalanceLimitModal_FieldWrap label="From Product Code" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ExceedBalanceLimitModal_SelectInput
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
          </ExceedBalanceLimitModal_FieldWrap>

          {/* Product Description (from) */}
          <ExceedBalanceLimitModal_FieldWrap label="Product Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={fromProductDescription}
              onChange={(e) => setFromProductDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </ExceedBalanceLimitModal_FieldWrap>

          {/* To Product Code */}
          <ExceedBalanceLimitModal_FieldWrap label="To Product Code" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ExceedBalanceLimitModal_SelectInput
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
          </ExceedBalanceLimitModal_FieldWrap>

          {/* Product Description (to) */}
          <ExceedBalanceLimitModal_FieldWrap label="Product Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={toProductDescription}
              onChange={(e) => setToProductDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </ExceedBalanceLimitModal_FieldWrap>

          {/* As On Date */}
          <ExceedBalanceLimitModal_FieldWrap label="As On Date" labelHi="दिनांकपर्यंत" required>
            <DateInput value={asOnDate} onChange={setAsOnDate} placeholder="Enter Date" />
          </ExceedBalanceLimitModal_FieldWrap>
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
          rows={ExceedBalanceLimitModal_PRODUCT_CODE_LIST}
          onSelect={handlePickProduct}
          onClose={() => setActivePicker(null)}
        />
      )}
    </>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function ExceedBalanceLimitModal_FieldWrap({
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

function ExceedBalanceLimitModal_SelectInput({
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


/* ===== from InterestPostingModal.tsx ===== */
export interface InterestPostingModal_InterestPostingModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

function InterestPostingModal({
  open,
  onClose,
  module,
}: InterestPostingModal_InterestPostingModalProps) {
  const [date, setDate] = useState("");
  const [withTDS, setWithTDS] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () => console.log("Calculate", { date, withTDS });
  const handleReport = () => console.log("Report", { date, withTDS });
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
        title="Interest Posting Successful"
        subtitle="The interest posting operation has been completed successfully."
      />
    );
  }

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: module.name,
    titleHi: module.name,
    subtitle: "Process interest posting for this module.",
    subtitleHi: "या मॉड्यूलसाठी इंटरेस्ट पोस्टिंग प्रक्रिया करा.",
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
        {/* As On Date */}
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-1 text-sm font-medium text-black">
            <span>As On Date</span>
            <span className="text-slate-600">/ दिनांकपर्यंत</span>
            <span className="text-red-500">*</span>
          </label>
          <DateInput value={date} onChange={setDate} placeholder="Enter Date" />
        </div>

        {/* With TDS */}
        <div className="flex items-center gap-[120px]">
          <label className="whitespace-nowrap text-sm font-medium text-black">
            With TDS
            <span className="text-slate-600"> / टीडीएससह</span>
          </label>
          <div className="flex items-center gap-6">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  checked={opt === "Yes" ? withTDS : !withTDS}
                  onChange={() => setWithTDS(opt === "Yes")}
                  className="h-4 w-4 accent-primary"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapperWithHeader>
  );
}


/* ===== from SavingInterestReportModal.tsx ===== */
export interface SavingInterestReportModal_SavingInterestReportModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

function SavingInterestReportModal({
  open,
  onClose,
  module,
}: SavingInterestReportModal_SavingInterestReportModalProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () => console.log("Calculate", { fromDate, toDate });
  const handleReport = () => console.log("Report", { fromDate, toDate });
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
        title="Saving Interest Report Generated"
        subtitle="The saving interest report has been generated successfully."
      />
    );
  }

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: module.name,
    titleHi: "बचत खाते व्याज अहवाल",
    subtitle: "Process automatic renewal at the beginning of the day.",
    subtitleHi: "दिवसाच्या प्रारंभी स्वयंचलित नूतनीकरण प्रक्रिया करा.",
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
        {/* From Date */}
        <SavingInterestReportModal_FieldWrap label="From Date" labelHi="पासून दिनांक" required>
          <DateInput value={fromDate} onChange={setFromDate} placeholder="Enter Date" />
        </SavingInterestReportModal_FieldWrap>

        {/* To Date */}
        <SavingInterestReportModal_FieldWrap label="To Date" labelHi="पर्यंत दिनांक" required>
          <DateInput value={toDate} onChange={setToDate} placeholder="Enter Date" />
        </SavingInterestReportModal_FieldWrap>
      </div>
    </ModalWrapperWithHeader>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function SavingInterestReportModal_FieldWrap({
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


/* ===== from ServiceChargesDormantModal.tsx ===== */
export interface ServiceChargesDormantModal_ServiceChargesDormantModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

type ServiceChargesDormantModal_PickRow = { code: string; name: string };
type ServiceChargesDormantModal_ActivePicker = "accountType" | "serviceCharges" | null;

const ServiceChargesDormantModal_ACCOUNT_TYPE_LIST: ServiceChargesDormantModal_PickRow[] = [
  { code: "SB", name: "Savings Account" },
  { code: "CA", name: "Current Account" },
  { code: "TD", name: "Term Deposit" },
];

const ServiceChargesDormantModal_SERVICE_CHARGES_CODE_LIST: ServiceChargesDormantModal_PickRow[] = [
  { code: "SC001", name: "Minimum Balance Charges" },
  { code: "SC002", name: "Account Maintenance Charges" },
  { code: "SC003", name: "Dormant Account Charges" },
];

function ServiceChargesDormantModal({
  open,
  onClose,
  module,
}: ServiceChargesDormantModal_ServiceChargesDormantModalProps) {
  const [branchCode, setBranchCode] = useState("0002");
  const [branchName, setBranchName] = useState("Main Branch, Bilagi");
  const [accountType, setAccountType] = useState("");
  const [accountTypeDescription, setAccountTypeDescription] = useState("");
  const [serviceChargesCode, setServiceChargesCode] = useState("");
  const [serviceChargesCodeDescription, setServiceChargesCodeDescription] = useState("");
  const [serviceTaxApply, setServiceTaxApply] = useState(false);
  const [serviceChargeAmount, setServiceChargeAmount] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePicker, setActivePicker] = useState<ServiceChargesDormantModal_ActivePicker>(null);

  if (!open) return null;

  const handlePickRow = (row: ServiceChargesDormantModal_PickRow) => {
    if (activePicker === "accountType") {
      setAccountType(row.code);
      setAccountTypeDescription(row.name);
    } else if (activePicker === "serviceCharges") {
      setServiceChargesCode(row.code);
      setServiceChargesCodeDescription(row.name);
    }
    setActivePicker(null);
  };

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () =>
    console.log("Calculate", {
      branchCode,
      accountType,
      serviceChargesCode,
      serviceTaxApply,
      serviceChargeAmount,
    });
  const handleReport = () =>
    console.log("Report", {
      branchCode,
      accountType,
      serviceChargesCode,
      serviceTaxApply,
      serviceChargeAmount,
    });
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
        title="Service Charges Dormant CA SA Successful"
        subtitle="The service charges dormant CA/SA operation has been completed successfully."
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
        maxWidth="6xl"
      >
        <div className="grid w-full grid-cols-2 gap-x-10 gap-y-6">
          {/* Branch Code — read-only, prefilled */}
          <ServiceChargesDormantModal_FieldWrap label="Branch Code" labelHi="स्क्रोल क्रमांक" required>
            <ServiceChargesDormantModal_ReadOnlyInput value={branchCode} icon={<User size={16} className="text-slate-400" />} />
          </ServiceChargesDormantModal_FieldWrap>

          {/* Branch Name — read-only, prefilled */}
          <ServiceChargesDormantModal_FieldWrap label="Branch Name" labelHi="स्क्रोल क्रमांक" required>
            <ServiceChargesDormantModal_ReadOnlyInput value={branchName} icon={<User size={16} className="text-slate-400" />} />
          </ServiceChargesDormantModal_FieldWrap>

          {/* Account Type */}
          <ServiceChargesDormantModal_FieldWrap label="Account Type" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ServiceChargesDormantModal_SelectInput
                  value={accountType}
                  onChange={setAccountType}
                  placeholder="Select Account Type"
                />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("accountType")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </ServiceChargesDormantModal_FieldWrap>

          {/* Account Type Description */}
          <ServiceChargesDormantModal_FieldWrap label="Account Type Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={accountTypeDescription}
              onChange={(e) => setAccountTypeDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </ServiceChargesDormantModal_FieldWrap>

          {/* Service Charges Code */}
          <ServiceChargesDormantModal_FieldWrap label="Service Charges Code" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ServiceChargesDormantModal_SelectInput
                  value={serviceChargesCode}
                  onChange={setServiceChargesCode}
                  placeholder="Select Account Type"
                />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("serviceCharges")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </ServiceChargesDormantModal_FieldWrap>

          {/* Service Charges Code Description */}
          <ServiceChargesDormantModal_FieldWrap label="Service Charges Code Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={serviceChargesCodeDescription}
              onChange={(e) => setServiceChargesCodeDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </ServiceChargesDormantModal_FieldWrap>

          {/* Service Tax Apply */}
          <div className="flex items-center justify-between">
            <label className="flex flex-col text-sm font-medium text-black">
              <span>Service Tax Apply</span>
              <span className="text-sm font-normal text-slate-600">निवडा</span>
            </label>
            <div className="flex items-center gap-6">
              {(["Yes", "No"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={opt === "Yes" ? serviceTaxApply : !serviceTaxApply}
                    onChange={() => setServiceTaxApply(opt === "Yes")}
                    className="h-4 w-4 accent-[#1565D8]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Service Charge Amount */}
          <ServiceChargesDormantModal_FieldWrap label="Service Charge Amount" labelHi="दिनांकपर्यंत" required>
            <input
              type="text"
              value={serviceChargeAmount}
              onChange={(e) => setServiceChargeAmount(e.target.value)}
              placeholder="Enter Service Charge Amount"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1565D8] focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
            />
          </ServiceChargesDormantModal_FieldWrap>
        </div>
      </ModalWrapperWithHeader>

      {/* Account Type / Service Charges Code picker */}
      {activePicker && (
        <ListModal
          title={activePicker === "accountType" ? "Account Type List" : "Service Charges Code List"}
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Description" },
          ]}
          rows={activePicker === "accountType" ? ServiceChargesDormantModal_ACCOUNT_TYPE_LIST : ServiceChargesDormantModal_SERVICE_CHARGES_CODE_LIST}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function ServiceChargesDormantModal_FieldWrap({
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

function ServiceChargesDormantModal_ReadOnlyInput({ value, icon }: { value: string; icon: React.ReactNode }) {
  return (
    <div className="flex h-11 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
      {icon}
      <span className="text-sm text-slate-500">{value}</span>
    </div>
  );
}

function ServiceChargesDormantModal_SelectInput({
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


/* ===== from ServiceChargesInoperativeModal.tsx ===== */
export interface ServiceChargesInoperativeModal_ServiceChargesInoperativeModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

type ServiceChargesInoperativeModal_PickRow = { code: string; name: string };
type ServiceChargesInoperativeModal_ActivePicker = "accountType" | "serviceCharges" | null;

const ServiceChargesInoperativeModal_ACCOUNT_TYPE_LIST: ServiceChargesInoperativeModal_PickRow[] = [
  { code: "SB", name: "Savings Account" },
  { code: "CA", name: "Current Account" },
  { code: "TD", name: "Term Deposit" },
];

const ServiceChargesInoperativeModal_SERVICE_CHARGES_CODE_LIST: ServiceChargesInoperativeModal_PickRow[] = [
  { code: "SC001", name: "Minimum Balance Charges" },
  { code: "SC002", name: "Account Maintenance Charges" },
  { code: "SC003", name: "Dormant Account Charges" },
];

function ServiceChargesInoperativeModal({
  open,
  onClose,
  module,
}: ServiceChargesInoperativeModal_ServiceChargesInoperativeModalProps) {
  const [branchCode, setBranchCode] = useState("0002");
  const [branchName, setBranchName] = useState("Main Branch, Bilagi");
  const [accountType, setAccountType] = useState("");
  const [accountTypeDescription, setAccountTypeDescription] = useState("");
  const [serviceChargesCode, setServiceChargesCode] = useState("");
  const [serviceChargesCodeDescription, setServiceChargesCodeDescription] = useState("");
  const [serviceTaxApply, setServiceTaxApply] = useState(false);
  const [serviceChargeAmount, setServiceChargeAmount] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePicker, setActivePicker] = useState<ServiceChargesInoperativeModal_ActivePicker>(null);

  if (!open) return null;

  const handlePickRow = (row: ServiceChargesInoperativeModal_PickRow) => {
    if (activePicker === "accountType") {
      setAccountType(row.code);
      setAccountTypeDescription(row.name);
    } else if (activePicker === "serviceCharges") {
      setServiceChargesCode(row.code);
      setServiceChargesCodeDescription(row.name);
    }
    setActivePicker(null);
  };

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () =>
    console.log("Calculate", {
      branchCode,
      accountType,
      serviceChargesCode,
      serviceTaxApply,
      serviceChargeAmount,
    });
  const handleReport = () =>
    console.log("Report", {
      branchCode,
      accountType,
      serviceChargesCode,
      serviceTaxApply,
      serviceChargeAmount,
    });
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
        title="Service Charges Inoperative CA SA Successful"
        subtitle="The service charges inoperative CA/SA operation has been completed successfully."
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
        maxWidth="6xl"
      >
        <div className="grid w-full grid-cols-2 gap-x-10 gap-y-6">
          {/* Branch Code — read-only, prefilled */}
          <ServiceChargesInoperativeModal_FieldWrap label="Branch Code" labelHi="स्क्रोल क्रमांक" required>
            <ServiceChargesInoperativeModal_ReadOnlyInput value={branchCode} icon={<User size={16} className="text-slate-400" />} />
          </ServiceChargesInoperativeModal_FieldWrap>

          {/* Branch Name — read-only, prefilled */}
          <ServiceChargesInoperativeModal_FieldWrap label="Branch Name" labelHi="स्क्रोल क्रमांक" required>
            <ServiceChargesInoperativeModal_ReadOnlyInput value={branchName} icon={<User size={16} className="text-slate-400" />} />
          </ServiceChargesInoperativeModal_FieldWrap>

          {/* Account Type */}
          <ServiceChargesInoperativeModal_FieldWrap label="Account Type" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ServiceChargesInoperativeModal_SelectInput
                  value={accountType}
                  onChange={setAccountType}
                  placeholder="Select Account Type"
                />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("accountType")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </ServiceChargesInoperativeModal_FieldWrap>

          {/* Account Type Description */}
          <ServiceChargesInoperativeModal_FieldWrap label="Account Type Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={accountTypeDescription}
              onChange={(e) => setAccountTypeDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </ServiceChargesInoperativeModal_FieldWrap>

          {/* Service Charges Code */}
          <ServiceChargesInoperativeModal_FieldWrap label="Service Charges Code" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ServiceChargesInoperativeModal_SelectInput
                  value={serviceChargesCode}
                  onChange={setServiceChargesCode}
                  placeholder="Select Account Type"
                />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("serviceCharges")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </ServiceChargesInoperativeModal_FieldWrap>

          {/* Service Charges Code Description */}
          <ServiceChargesInoperativeModal_FieldWrap label="Service Charges Code Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={serviceChargesCodeDescription}
              onChange={(e) => setServiceChargesCodeDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </ServiceChargesInoperativeModal_FieldWrap>

          {/* Service Tax Apply */}
          <div className="flex items-center justify-between">
            <label className="flex flex-col text-sm font-medium text-black">
              <span>Service Tax Apply</span>
              <span className="text-sm font-normal text-slate-600">निवडा</span>
            </label>
            <div className="flex items-center gap-6">
              {(["Yes", "No"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={opt === "Yes" ? serviceTaxApply : !serviceTaxApply}
                    onChange={() => setServiceTaxApply(opt === "Yes")}
                    className="h-4 w-4 accent-[#1565D8]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Service Charge Amount */}
          <ServiceChargesInoperativeModal_FieldWrap label="Service Charge Amount" labelHi="दिनांकपर्यंत" required>
            <input
              type="text"
              value={serviceChargeAmount}
              onChange={(e) => setServiceChargeAmount(e.target.value)}
              placeholder="Enter Service Charge Amount"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1565D8] focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
            />
          </ServiceChargesInoperativeModal_FieldWrap>
        </div>
      </ModalWrapperWithHeader>

      {/* Account Type / Service Charges Code picker */}
      {activePicker && (
        <ListModal
          title={activePicker === "accountType" ? "Account Type List" : "Service Charges Code List"}
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Description" },
          ]}
          rows={activePicker === "accountType" ? ServiceChargesInoperativeModal_ACCOUNT_TYPE_LIST : ServiceChargesInoperativeModal_SERVICE_CHARGES_CODE_LIST}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function ServiceChargesInoperativeModal_FieldWrap({
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

function ServiceChargesInoperativeModal_ReadOnlyInput({ value, icon }: { value: string; icon: React.ReactNode }) {
  return (
    <div className="flex h-11 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
      {icon}
      <span className="text-sm text-slate-500">{value}</span>
    </div>
  );
}

function ServiceChargesInoperativeModal_SelectInput({
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


/* ===== from TlCcInterestPostingModal.tsx ===== */
export interface TlCcInterestPostingModal_TlCcInterestPostingModalProps {
  open: boolean;
  onClose: () => void;
  module: { id: string; name: string };
}

type TlCcInterestPostingModal_PickRow = { code: string; name: string };

const TlCcInterestPostingModal_ACCOUNT_TYPE_LIST: TlCcInterestPostingModal_PickRow[] = [
  { code: "TL", name: "Term Loan" },
  { code: "CC", name: "Cash Credit" },
  { code: "OD", name: "Overdraft" },
];

function TlCcInterestPostingModal({
  open,
  onClose,
  module,
}: TlCcInterestPostingModal_TlCcInterestPostingModalProps) {
  const [accountType, setAccountType] = useState("");
  const [accountTypeDescription, setAccountTypeDescription] = useState("");
  const [nextIntPostingDate, setNextIntPostingDate] = useState("");
  const [nextIntPostingUpToDate, setNextIntPostingUpToDate] = useState("");
  const [applyServiceCharges, setApplyServiceCharges] = useState(false);
  const [interestReposting, setInterestReposting] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAccountTypePicker, setShowAccountTypePicker] = useState(false);

  if (!open) return null;

  const handlePickAccountType = (row: TlCcInterestPostingModal_PickRow) => {
    setAccountType(row.code);
    setAccountTypeDescription(row.name);
    setShowAccountTypePicker(false);
  };

  const handleValidate = () => setIsValidated(true);
  const handleCalculate = () =>
    console.log("Calculate", {
      accountType,
      nextIntPostingDate,
      nextIntPostingUpToDate,
      applyServiceCharges,
      interestReposting,
    });
  const handleReport = () =>
    console.log("Report", {
      accountType,
      nextIntPostingDate,
      nextIntPostingUpToDate,
      applyServiceCharges,
      interestReposting,
    });
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
        title="TL/CC Interest Posting Successful"
        subtitle="The TL/CC interest posting operation has been completed successfully."
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
        maxWidth="6xl"
      >
        <div className="grid w-full grid-cols-2 gap-x-10 gap-y-6">
          {/* Account Type */}
          <TlCcInterestPostingModal_FieldWrap label="Account Type" labelHi="उत्पादन कोड" required>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TlCcInterestPostingModal_SelectInput
                  value={accountType}
                  onChange={setAccountType}
                  placeholder="Select Account Type"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAccountTypePicker(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#1565D8] transition hover:bg-blue-100"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </TlCcInterestPostingModal_FieldWrap>

          {/* Account Type Description */}
          <TlCcInterestPostingModal_FieldWrap label="Account Type Description" labelHi="वर्णन" required>
            <input
              type="text"
              value={accountTypeDescription}
              onChange={(e) => setAccountTypeDescription(e.target.value)}
              placeholder="Description"
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </TlCcInterestPostingModal_FieldWrap>

          {/* Next Int. Posting Date */}
          <TlCcInterestPostingModal_FieldWrap label="Next Int. Posting Date" labelHi="दिनांकपर्यंत" required>
            <DateInput
              value={nextIntPostingDate}
              onChange={setNextIntPostingDate}
              placeholder="Enter From Date"
            />
          </TlCcInterestPostingModal_FieldWrap>

          {/* Next Int. Posting Up To Date */}
          <TlCcInterestPostingModal_FieldWrap label="Next Int. Posting Up To Date" labelHi="दिनांकपर्यंत" required>
            <DateInput
              value={nextIntPostingUpToDate}
              onChange={setNextIntPostingUpToDate}
              placeholder="Enter From Date"
            />
          </TlCcInterestPostingModal_FieldWrap>

          {/* Apply Service Charges */}
          <div className="flex items-center justify-between">
            <label className="flex flex-col text-sm font-medium text-black">
              <span>Apply Service Charges</span>
              <span className="text-sm font-normal text-slate-600">निवडा</span>
            </label>
            <div className="flex items-center gap-6">
              {(["Yes", "No"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={opt === "Yes" ? applyServiceCharges : !applyServiceCharges}
                    onChange={() => setApplyServiceCharges(opt === "Yes")}
                    className="h-4 w-4 accent-[#1565D8]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Interest Reposting */}
          <div className="flex items-center justify-between">
            <label className="flex flex-col text-sm font-medium text-black">
              <span>Interest Reposting</span>
              <span className="text-sm font-normal text-slate-600">निवडा</span>
            </label>
            <div className="flex items-center gap-6">
              {(["Yes", "No"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={opt === "Yes" ? interestReposting : !interestReposting}
                    onChange={() => setInterestReposting(opt === "Yes")}
                    className="h-4 w-4 accent-[#1565D8]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>
      </ModalWrapperWithHeader>

      {/* Account Type picker */}
      {showAccountTypePicker && (
        <ListModal
          title="Account Type List"
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Description" },
          ]}
          rows={TlCcInterestPostingModal_ACCOUNT_TYPE_LIST}
          onSelect={handlePickAccountType}
          onClose={() => setShowAccountTypePicker(false)}
        />
      )}
    </>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function TlCcInterestPostingModal_FieldWrap({
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

function TlCcInterestPostingModal_SelectInput({
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


/* ===== from InterestPostingPage.tsx ===== */
type ModuleItem = { id: string; name: string };

type ModalComponent = React.ComponentType<{
  module: ModuleItem;
  open: boolean;
  onClose: () => void;
}>;

/**
 * Map each module to its modal by exact id, matching
 * @/constants/interestPostingModules.
 * Any id not listed here falls back to the generic InterestPostingModal.
 */
const MODAL_BY_ID: Record<string, ModalComponent> = {
  tdInterestPosting: DepositInterestPostingModal,
  depreciationCalculation: DepreciationCalculationModal,
  exceedLoanLimit: ExceedBalanceLimitModal,
  tlCcInterestPosting: TlCcInterestPostingModal,
  serviceChargesDormant: ServiceChargesDormantModal,
  serviceChargesInoperative: ServiceChargesInoperativeModal,
  savingInterestReport: SavingInterestReportModal,
  applyServiceChargesLive: ApplyServiceChargesLiveModal,
  dormantInoperativeSaving: DormantInoperativeSavingModal,
};

function resolveModal(module: ModuleItem): ModalComponent {
  return MODAL_BY_ID[module.id] ?? InterestPostingModal;
}

export default function InterestPostingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return interestPostingModules;
    return interestPostingModules.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [query]);

  const activeModule = useMemo(
    () => interestPostingModules.find((m) => m.id === activeModal) ?? null,
    [activeModal]
  );

  const ActiveModalComponent = activeModule ? resolveModal(activeModule) : null;

  const handleOpen = (id: string) => {
    setActiveModal(id);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Interest Posting"
        titleHi="इंटरेस्ट पोस्टिंग"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "#" },
          { label: "Interest Posting", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        {/* Hero */}
        <div className="relative isolate overflow-hidden rounded-2xl">
          <Image
            src={IMAGES.BACKGROUND_DARK}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />

          <div className="relative flex flex-col items-center gap-6 px-6 py-12 text-center sm:py-16">
            <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-[34px]">
              Interest Posting
            </h1>

            <div className="flex w-full max-w-xl items-center rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-lg dark:bg-slate-900">
              <Search size={18} className="mr-2 shrink-0 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search interest posting modules..."
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100"
              />
              <button
                type="button"
                className="ml-2 shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
              >
                Show
              </button>
            </div>
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleOpen(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleOpen(item.id);
              }}
              className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <Image
                  src={IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON}
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">
                  {item.name}
                </h3>
                {/* Optional subtitle can be added here if needed */}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(item.id);
                }}
                className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
              >
                Open <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">
            No modules found.
          </p>
        )}

        {/* Modal — only the modal matching the active module is mounted */}
        {activeModule && ActiveModalComponent && (
          <ActiveModalComponent
            module={activeModule}
            open={activeModal === activeModule.id}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}
