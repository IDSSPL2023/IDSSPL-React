import { useState } from "react";
import {
  Tag,
  ShieldCheck,
  Hash,
  IndianRupee,
  FileText,
  Clock,
  UserRound,
  Plus,
  Trash2,
} from "lucide-react";
import FormModal from "../shared/FormModal";
import { FieldShell, SelectInput, TextInput, DateInput } from "../shared/FormFields";
import SuccessModal from "../shared/SuccessModal";

export interface InsuranceDetailsData {
  securityTypeCode: string;
  insuranceName: string;
  policyNo: string;
  policyAmount: string;
  assuredAmount: string;
  premiumAmount: string;
  securityValue: string;
  startDate: string;
  endDate: string;
  particular: string;
  premiumPeriod: string;
}

type FieldErrors = Partial<Record<keyof InsuranceDetailsData, string>>;

const SECURITY_TYPE_CODES = ["Life Insurance", "Vehicle Insurance", "Property Insurance", "Health Insurance"];
const PREMIUM_PERIODS = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];

const emptyData = (): InsuranceDetailsData => ({
  securityTypeCode: "",
  insuranceName: "",
  policyNo: "",
  policyAmount: "",
  assuredAmount: "",
  premiumAmount: "",
  securityValue: "",
  startDate: "",
  endDate: "",
  particular: "",
  premiumPeriod: "",
});

// First card is always "Primary Information"; every duplicate after that
// is numbered so the person can tell them apart.
const sectionTitle = (index: number) =>
  index === 0
    ? { en: "Primary Information", hi: "प्राथमिक माहिती" }
    : { en: `Additional Information ${index}`, hi: `अतिरिक्त माहिती ${index}` };

const sectionSubtitle = (index: number) =>
  index === 0
    ? {
        en: "Add the primary insurance policy details for this security",
        hi: "या सुरक्षिततेसाठी प्राथमिक विमा पॉलिसी तपशील जोडा",
      }
    : {
        en: "Add another insurance policy linked to the same security",
        hi: "त्याच सुरक्षिततेशी संबंधित आणखी एक विमा पॉलिसी जोडा",
      };

export interface AddInsuranceDetailsModalProps {
  open: boolean;
  onClose?: () => void;
  onSave?: (data: InsuranceDetailsData[]) => void;
}

const TABS = ["Primary Information"] as const;

const AddInsuranceDetailsModal = ({ open, onClose, onSave }: AddInsuranceDetailsModalProps) => {
  const [sections, setSections] = useState<InsuranceDetailsData[]>([emptyData()]);
  const [errorsList, setErrorsList] = useState<FieldErrors[]>([{}]);
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const setField = (index: number, patch: Partial<InsuranceDetailsData>) => {
    setSections((prev) => prev.map((section, i) => (i === index ? { ...section, ...patch } : section)));
    setIsValidated(false);
  };

  const handleAddSection = () => {
    setSections((prev) => [...prev, emptyData()]);
    setErrorsList((prev) => [...prev, {}]);
    setIsValidated(false);
  };

  const handleRemoveSection = (index: number) => {
    if (index === 0) return; // the Primary Information card can't be removed
    setSections((prev) => prev.filter((_, i) => i !== index));
    setErrorsList((prev) => prev.filter((_, i) => i !== index));
    setIsValidated(false);
  };

  const validateOne = (data: InsuranceDetailsData): FieldErrors => {
    const nextErrors: FieldErrors = {};
    if (!data.securityTypeCode.trim()) nextErrors.securityTypeCode = "Security Type Code is required";
    if (!data.insuranceName.trim()) nextErrors.insuranceName = "Insurance Name is required";
    if (!data.policyNo.trim()) nextErrors.policyNo = "Policy No is required";
    if (!data.policyAmount.trim()) nextErrors.policyAmount = "Policy Amount is required";
    if (!data.assuredAmount.trim()) nextErrors.assuredAmount = "Assured Amount is required";
    if (!data.premiumAmount.trim()) nextErrors.premiumAmount = "Premium Amount is required";
    if (!data.securityValue.trim()) nextErrors.securityValue = "Security Value is required";
    if (!data.startDate.trim()) nextErrors.startDate = "Start Date is required";
    if (!data.endDate.trim()) nextErrors.endDate = "End Date is required";
    if (!data.particular.trim()) nextErrors.particular = "Particular is required";
    if (!data.premiumPeriod.trim()) nextErrors.premiumPeriod = "Premium Period is required";
    return nextErrors;
  };

  const validate = (): boolean => {
    const nextErrorsList = sections.map(validateOne);
    setErrorsList(nextErrorsList);
    return nextErrorsList.every((e) => Object.keys(e).length === 0);
  };

  const handleValidate = () => setIsValidated(validate());

  const handleSave = () => {
    if (!isValidated) return;
    const isValid = validate();
    if (!isValid) return;
    onSave?.(sections);
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose?.();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title="Insurance Details Added Successfully"
        subtitle=""
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
      />
    );
  }

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  return (
    <FormModal
      onClose={() => onClose?.()}
      titleEn="Add Insurance Details"
      titleHi="विमा तपशील जोडा"
      subtitleEn="All Information's are related to Interest Payment Mark"
      subtitleHi="सर्व माहिती व्याज भरण्याच्या मार्काशी संबंधित आहे"
      tabs={[...TABS]}
      activeTab="Primary Information"
      onTabChange={() => {}}
      onValidate={handleValidate}
      onSave={handleSave}
      isLastTab
    >
      {sections.map((data, index) => {
        const errors = errorsList[index] ?? {};
        const title = sectionTitle(index);
        const subtitle = sectionSubtitle(index);
        const isLast = index === sections.length - 1;

        return (
          <div
            key={index}
            className={`bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900 ${
              index > 0 ? "mt-5" : ""
            }`}
          >
            {/* Section header — icon + title/subtitle on the left, actions on the right */}
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
                  <UserRound size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1F2858] dark:text-slate-100">
                    {title.en} <span className="font-normal text-slate-500 dark:text-slate-400">/ {title.hi}</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {subtitle.en} / {subtitle.hi}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(index)}
                    title="Remove this section"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                {isLast && (
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary-700"
                  >
                    <Plus size={15} /> Add
                  </button>
                )}
              </div>
            </div>

            <div className={grid4}>
              <FieldShell label="Security Type Code" required error={!!errors.securityTypeCode}>
                <SelectInput
                  icon={<Tag size={16} />}
                  value={data.securityTypeCode}
                  onChange={(v) => setField(index, { securityTypeCode: v })}
                  options={SECURITY_TYPE_CODES}
                  error={!!errors.securityTypeCode}
                />
              </FieldShell>

              <FieldShell label="Insurance Name" required error={!!errors.insuranceName}>
                <TextInput
                  icon={<ShieldCheck size={16} />}
                  value={data.insuranceName}
                  onChange={(v) => setField(index, { insuranceName: v })}
                  placeholder="Insurance Name"
                  error={!!errors.insuranceName}
                />
              </FieldShell>

              <FieldShell label="Policy No" required error={!!errors.policyNo}>
                <TextInput
                  icon={<Hash size={16} />}
                  value={data.policyNo}
                  onChange={(v) => setField(index, { policyNo: v })}
                  placeholder="Policy No"
                  error={!!errors.policyNo}
                />
              </FieldShell>
            </div>

            <div className={`${grid4} mt-4`}>
              <FieldShell label="Policy Amount" required error={!!errors.policyAmount}>
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={data.policyAmount}
                  onChange={(v) => setField(index, { policyAmount: v })}
                  placeholder="Enter Amount"
                  error={!!errors.policyAmount}
                />
              </FieldShell>

              <FieldShell label="Assured Amount" required error={!!errors.assuredAmount}>
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={data.assuredAmount}
                  onChange={(v) => setField(index, { assuredAmount: v })}
                  placeholder="Enter Amount"
                  error={!!errors.assuredAmount}
                />
              </FieldShell>

              <FieldShell label="Premium Amount" required error={!!errors.premiumAmount}>
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={data.premiumAmount}
                  onChange={(v) => setField(index, { premiumAmount: v })}
                  placeholder="Enter Amount"
                  error={!!errors.premiumAmount}
                />
              </FieldShell>

              <FieldShell label="Security Value" required error={!!errors.securityValue}>
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={data.securityValue}
                  onChange={(v) => setField(index, { securityValue: v })}
                  placeholder="Enter Amount"
                  error={!!errors.securityValue}
                />
              </FieldShell>
            </div>

            <div className={`${grid4} mt-4`}>
              <FieldShell label="Start Date" required error={!!errors.startDate}>
                <DateInput
                  value={data.startDate}
                  onChange={(v) => setField(index, { startDate: v })}
                  error={!!errors.startDate}
                />
              </FieldShell>

              <FieldShell label="End Date" required error={!!errors.endDate}>
                <DateInput
                  value={data.endDate}
                  onChange={(v) => setField(index, { endDate: v })}
                  error={!!errors.endDate}
                />
              </FieldShell>

              <FieldShell label="Particular" required error={!!errors.particular}>
                <TextInput
                  icon={<FileText size={16} />}
                  value={data.particular}
                  onChange={(v) => setField(index, { particular: v })}
                  placeholder="Enter Particular"
                  error={!!errors.particular}
                />
              </FieldShell>

              <FieldShell label="Premium Period" required error={!!errors.premiumPeriod}>
                <SelectInput
                  icon={<Clock size={16} />}
                  value={data.premiumPeriod}
                  onChange={(v) => setField(index, { premiumPeriod: v })}
                  options={PREMIUM_PERIODS}
                  error={!!errors.premiumPeriod}
                />
              </FieldShell>
            </div>
          </div>
        );
      })}
    </FormModal>
  );
};

export default AddInsuranceDetailsModal;