import { useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  IdCard,
  CreditCard,
  IndianRupee,
  FileText,
  Hash,
  Percent,
  Landmark,
  Building2,
  MoreVertical,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  SelectInput,
  DateInput,
  SectionCard,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import BranchListPickerModal from "@/components/common/BranchPickListModal";
import BankListPickerModal from "@/components/common/BankPickListModal";

const APPLICATION_OPTIONS = ["New", "Renewal"];
const ACCOUNT_TYPE_OPTIONS = ["RI", "FD", "RD", "TD"];
const CATEGORY_CODE_OPTIONS = ["Public", "Staff"];
const INTEREST_FREQUENCY_OPTIONS = ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "On Maturity"];

export interface InvestmentAccountFormData {
  application: string;
  applicantName: string;
  receiptName: string;
  accountType: string;
  openingDate: string;
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  customerId: string;
  categoryCode: string;
  interestPaymentFrequency: string;
  amount: string;
  interestRate: string;
  unitOfPeriod: string;
  period: string;
  maturityDate: string;
  maturityAmount: string;
}

/** Reusable dummy data — used to prefill the form on open. */
export const DEFAULT_INVESTMENT_ACCOUNT_DATA: InvestmentAccountFormData = {
  application: "New",
  applicantName: "Karan Mangesh Patil",
  receiptName: "122",
  accountType: "RI",
  openingDate: "2026-06-12",
  bankCode: "00022",
  bankName: "BANK NAME",
  branchCode: "0002",
  branchName: "Hubli",
  customerId: "00012",
  categoryCode: "Public",
  interestPaymentFrequency: "On Maturity",
  amount: "250000",
  interestRate: "12",
  unitOfPeriod: "2",
  period: "10",
  maturityDate: "2026-05-23",
  maturityAmount: "250000",
};

/** Same validation approach used by Customer Master's sibling forms (AddSI). */
const validateInvestmentAccount = (
  data: InvestmentAccountFormData
): Record<keyof InvestmentAccountFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  return {
    application: isEmpty(data.application),
    applicantName: isEmpty(data.applicantName),
    receiptName: isEmpty(data.receiptName),
    accountType: isEmpty(data.accountType),
    openingDate: isEmpty(data.openingDate),
    bankCode: isEmpty(data.bankCode),
    bankName: isEmpty(data.bankName),
    branchCode: isEmpty(data.branchCode),
    branchName: isEmpty(data.branchName),
    customerId: isEmpty(data.customerId),
    categoryCode: isEmpty(data.categoryCode),
    interestPaymentFrequency: isEmpty(data.interestPaymentFrequency),
    amount: isEmpty(data.amount),
    interestRate: isEmpty(data.interestRate),
    unitOfPeriod: isEmpty(data.unitOfPeriod),
    period: isEmpty(data.period),
    maturityDate: isEmpty(data.maturityDate),
    maturityAmount: isEmpty(data.maturityAmount),
  };
};

/** Simulated save — no backend yet. */
const saveInvestmentAccount = (data: InvestmentAccountFormData) =>
  new Promise<InvestmentAccountFormData>((resolve) =>
    setTimeout(() => resolve(data), 600)
  );

const LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

export interface AddInvestmentAccountMasterProps {
  onClose: () => void;
  onSave?: (data: InvestmentAccountFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddInvestmentAccountMaster = ({ onClose, onSave, variant = "modal" }: AddInvestmentAccountMasterProps) => {
  const [form, setForm] = useState<InvestmentAccountFormData>(
    DEFAULT_INVESTMENT_ACCOUNT_DATA
  );
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof InvestmentAccountFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [branchPickerOpen, setBranchPickerOpen] = useState(false);
  const [bankPickerOpen, setBankPickerOpen] = useState(false);

  const grid3 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  const markDirty = (field: keyof InvestmentAccountFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof InvestmentAccountFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleBankSelect = (bank: { code: string; name: string }) => {
    markDirty("bankCode");
    markDirty("bankName");
    setForm((f) => ({ ...f, bankCode: bank.code, bankName: bank.name }));
  };

  const handleBranchSelect = (branch: { code: string; name: string }) => {
    markDirty("branchCode");
    markDirty("branchName");
    setForm((f) => ({ ...f, branchCode: branch.code, branchName: branch.name }));
  };

  const handleValidate = () => {
    const newErrors = validateInvestmentAccount(form);
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    setIsValidated(!hasErrors);
    if (hasErrors) {
      toast.error("Please fill all required fields before validating.");
    } else {
      toast.success("All fields validated successfully.");
    }
  };

  const handleSave = async () => {
    if (!isValidated || isSaving) return;
    setIsSaving(true);
    await saveInvestmentAccount(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    onSave?.(form);
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        title="Investment Account Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Investment Account Entry"
      titleHi="गुंतवणूक खाते नोंद"
      subtitleEn="Add some basic information related to the Investment Account."
      subtitleHi="गुंतवणूक खात्याशी संबंधित काही मूलभूत माहिती जोडा."
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
    >
      <SectionCard
        titleEn="Application Details"
        titleHi="अर्ज तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid3} mt-2`}>
          <FieldShell label="Application" labelHi="अर्ज" required error={errors.application}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.application}
              onChange={() => {}}
              readOnly
              options={APPLICATION_OPTIONS}
              placeholder="Select Application"
              error={errors.application}
            />
          </FieldShell>

          <FieldShell label="Applicant Name" labelHi="अर्जदाराचे नाव" required error={errors.applicantName}>
            <TextInput
              icon={<User size={16} />}
              value={form.applicantName}
              onChange={() => {}}
              readOnly
              placeholder="Enter Applicant Name"
              error={errors.applicantName}
            />
          </FieldShell>

          <FieldShell label="Receipt Name" labelHi="पावती नाव" required error={errors.receiptName}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.receiptName}
              onChange={(v) => updateField("receiptName", v)}
              placeholder="Enter Receipt Name"
              error={errors.receiptName}
            />
          </FieldShell>

          <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required error={errors.accountType}>
            <SelectInput
              icon={<CreditCard size={16} />}
              value={form.accountType}
              onChange={() => {}}
              readOnly
              options={ACCOUNT_TYPE_OPTIONS}
              placeholder="Select Account Type"
              error={errors.accountType}
            />
          </FieldShell>

          <FieldShell label="Opening Date" labelHi="उघडण्याची तारीख" required error={errors.openingDate}>
            <DateInput value={form.openingDate} onChange={(v) => updateField("openingDate", v)} error={errors.openingDate} />
          </FieldShell>

          <FieldShell label="Bank Code" labelHi="बँक कोड" required error={errors.bankCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Landmark size={16} />}
                  value={form.bankCode}
                  onChange={(v) => updateField("bankCode", v)}
                  placeholder="Enter Bank Code"
                  error={errors.bankCode}
                />
              </div>
              <LookupTrigger onClick={() => setBankPickerOpen(true)} />
            </div>
          </FieldShell>

          <FieldShell label="Bank Name" labelHi="बँकेचे नाव" required error={errors.bankName}>
            <TextInput icon={<Landmark size={16} />} value={form.bankName} onChange={() => {}} readOnly error={errors.bankName} />
          </FieldShell>

          <FieldShell label="Branch Code" labelHi="शाखा कोड" required error={errors.branchCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Building2 size={16} />}
                  value={form.branchCode}
                  onChange={(v) => updateField("branchCode", v)}
                  placeholder="Enter Branch Code"
                  error={errors.branchCode}
                />
              </div>
              <LookupTrigger onClick={() => setBranchPickerOpen(true)} />
            </div>
          </FieldShell>

          <FieldShell label="Branch Name" labelHi="शाखेचे नाव" required error={errors.branchName}>
            <TextInput icon={<Building2 size={16} />} value={form.branchName} onChange={() => {}} readOnly error={errors.branchName} />
          </FieldShell>

          <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={errors.customerId}>
            <TextInput
              icon={<IdCard size={16} />}
              value={form.customerId}
              onChange={() => {}}
              readOnly
              placeholder="Enter Customer ID"
              error={errors.customerId}
            />
          </FieldShell>

          <FieldShell label="Category Code" labelHi="श्रेणी कोड" required error={errors.categoryCode}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.categoryCode}
              onChange={() => {}}
              readOnly
              options={CATEGORY_CODE_OPTIONS}
              placeholder="Select Category Code"
              error={errors.categoryCode}
            />
          </FieldShell>

          <FieldShell label="Interest Payment Frequency" labelHi="व्याज भरण्याची वारंवारिता" required error={errors.interestPaymentFrequency}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.interestPaymentFrequency}
              onChange={(v) => updateField("interestPaymentFrequency", v)}
              options={INTEREST_FREQUENCY_OPTIONS}
              placeholder="Select Interest Payment Frequency"
              error={errors.interestPaymentFrequency}
            />
          </FieldShell>

          <FieldShell label="Amount" labelHi="रक्कम" required error={errors.amount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.amount}
              onChange={(v) => updateField("amount", v)}
              placeholder="Enter Amount"
              error={errors.amount}
            />
          </FieldShell>

          <FieldShell label="Interest Rate" labelHi="व्याज दर" required error={errors.interestRate}>
            <TextInput
              icon={<Percent size={16} />}
              value={form.interestRate}
              onChange={(v) => updateField("interestRate", v)}
              placeholder="Enter Interest Rate"
              error={errors.interestRate}
            />
          </FieldShell>

          <FieldShell label="Unit Of Period" labelHi="कालावधीचे एकक" required error={errors.unitOfPeriod}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.unitOfPeriod}
              onChange={(v) => updateField("unitOfPeriod", v)}
              placeholder="Enter Unit Of Period"
              error={errors.unitOfPeriod}
            />
          </FieldShell>

          <FieldShell label="Period" labelHi="कालावधी" required error={errors.period}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.period}
              onChange={(v) => updateField("period", v)}
              placeholder="Enter Period"
              error={errors.period}
            />
          </FieldShell>

          <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required error={errors.maturityDate}>
            <DateInput value={form.maturityDate} onChange={() => {}} readOnly error={errors.maturityDate} />
          </FieldShell>

          <FieldShell label="Maturity Amount" labelHi="परिपक्वता रक्कम" required error={errors.maturityAmount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.maturityAmount}
              onChange={() => {}}
              readOnly
              placeholder="Enter Maturity Amount"
              error={errors.maturityAmount}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleValidate}
          className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
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
          onClick={handleSave}
          disabled={!isValidated || isSaving}
          className={`flex items-center gap-1.5 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium transition-colors ${
            isValidated && !isSaving
              ? "bg-primary text-white hover:bg-primary-700"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          {isSaving ? "Saving..." : "Save"} <ChevronDown size={16} />
        </button>
      </div>

      <BankListPickerModal
        open={bankPickerOpen}
        onClose={() => setBankPickerOpen(false)}
        onSelect={handleBankSelect}
      />

      <BranchListPickerModal
        open={branchPickerOpen}
        onClose={() => setBranchPickerOpen(false)}
        onSelect={handleBranchSelect}
      />
    </FormModal>
  );
};

export default AddInvestmentAccountMaster;
