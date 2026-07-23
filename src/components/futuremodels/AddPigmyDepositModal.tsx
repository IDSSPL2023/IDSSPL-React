import { useState } from "react";
import StatePicklistField from "@/components/common/StatePicklistField";
import CityPicklistField from "@/components/common/CityPicklistField";
import {
  User,
  IdCard,
  Tag,
  ShieldCheck,
  Layers,
  Wallet,
  MoreVertical,
  Building2,
  IndianRupee,
  Percent,
  Clock,
  Plus,
  Trash2,
  Users,
  Home,
  Hash,
  MapPin,
  Flag,
} from "lucide-react";

import FormModal from "../shared/FormModal";
import { FieldShell, TextInput, SelectInput, DateInput } from "../shared/FormFields";
import CustomerIdPickerModal, { type Customer } from "../common/CustomerPickListModal";
import BranchListPickerModal, { type Branch } from "../common/BranchPickListModal";
import SuccessModal from "../shared/SuccessModal";
import { fetchPincodeDetails } from "@/lib/pincode";

/* ===================== Types ===================== */

export interface ApplicationData {
  customerId: string;
  customerName: string;
  categoryCode: string;
  riskCategory: string;
  introducerAccountCode: string;
  introducerAccountName: string;
  dateOfApplication: string;
  accountOperationCapacityId: string;
  minBalanceId: string;
}

export interface PigmyDetailsData {
  accountType: string;
  agentBranchCode: string;
  agentBranchName: string;
  openingDate: string;
  installmentAmount: string;
  interestRate: string;
  interestPaidIn: "Day" | "Month";
  periodOfDeposit: string;
  maturityDate: string;
  agentName: string;
  agentId: string;
}

export interface NomineeRow {
  srNo: number;
  salutationCode: string;
  customerId: string;
  name: string;
  relation: string;
  address1: string;
  address2: string;
  address3: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

export interface JointHolderData {
  srNo: number;
  salutationCode: string;
  customerId: string;
  name: string;
  address1: string;
  address2: string;
  address3: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

export interface PigmyDepositFormData {
  application: ApplicationData;
  pigmyDetails: PigmyDetailsData;
  nominees: NomineeRow[];
  jointHolder: JointHolderData;
}

/* ===================== Static option lists ===================== */

const CATEGORY_CODES = ["Public", "Staff", "Senior Citizen"];
const RISK_CATEGORIES = ["Low", "Medium", "High"];
const INTRODUCER_ACCOUNTS: Record<string, string> = {
  "1001": "Saving Account",
  "1002": "Current Account",
  "1003": "Recurring Deposit",
};
const ACCOUNT_OPERATION_CAPACITY = ["Self", "Jointly", "Either or Survivor"];
const MIN_BALANCE_IDS = ["200", "500", "1000"];
const ACCOUNT_TYPES = ["PIG - Pigmy Deposit"];
const SALUTATIONS = ["MR", "MRS", "MS", "DR"];
const RELATIONS = ["Father", "Mother", "Spouse", "Son", "Daughter", "Brother", "Sister"];

const TABS = ["Application", "Pigmy Details", "Nominee", "Joint Holder"] as const;
type Tab = (typeof TABS)[number];

const emptyApplication = (): ApplicationData => ({
  customerId: "",
  customerName: "",
  categoryCode: "",
  riskCategory: "Low",
  introducerAccountCode: "",
  introducerAccountName: "",
  dateOfApplication: "",
  accountOperationCapacityId: "Self",
  minBalanceId: "200",
});

const emptyPigmyDetails = (): PigmyDetailsData => ({
  accountType: "PIG - Pigmy Deposit",
  agentBranchCode: "",
  agentBranchName: "",
  openingDate: "",
  installmentAmount: "",
  interestRate: "",
  interestPaidIn: "Day",
  periodOfDeposit: "",
  maturityDate: "",
  agentName: "",
  agentId: "",
});

const emptyNominee = (srNo: number): NomineeRow => ({
  srNo,
  salutationCode: "MR",
  customerId: "",
  name: "",
  relation: "Father",
  address1: "",
  address2: "",
  address3: "",
  zip: "",
  city: "",
  state: "",
  country: "India",
});

const emptyJointHolder = (): JointHolderData => ({
  srNo: 1,
  salutationCode: "MR",
  customerId: "",
  name: "",
  address1: "",
  address2: "",
  address3: "",
  zip: "",
  city: "",
  state: "",
  country: "India",
});

/* ===================== Small shared bits ===================== */

const SrNoBox = ({ srNo }: { srNo: number }) => (
  <div className="w-14 shrink-0">
    <label className="mb-1.5 block text-sm font-medium text-black">Sr No</label>
    <div className="flex h-[42px] w-14 items-center justify-center rounded-lg border border-slate-300 bg-slate-50 text-sm text-slate-600">
      {srNo}
    </div>
  </div>
);

const DayMonthField = ({ value, onChange }: { value: "Day" | "Month"; onChange: (v: "Day" | "Month") => void }) => (
  <div>
    <label className="mb-1.5 flex min-h-[10px] items-start text-sm font-medium text-black">
      Interest Paid in Cash <span className="text-slate-600">/ रोख व्याज</span>
    </label>
    <div className="flex h-[42px] items-center gap-5">
      {(["Day", "Month"] as const).map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
              opt === value ? "border-primary-500" : "border-slate-300"
            }`}
          >
            {opt === value && <span className="h-2 w-2 rounded-full bg-primary-500" />}
          </span>
          <input type="radio" className="hidden" checked={opt === value} onChange={() => onChange(opt)} />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

/* ===================== Main form ===================== */

interface AddPigmyDepositFormProps {
  onClose?: () => void;
}

function AddPigmyDepositForm({ onClose }: AddPigmyDepositFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Application");

  const [application, setApplication] = useState<ApplicationData>(emptyApplication());
  const [pigmyDetails, setPigmyDetails] = useState<PigmyDetailsData>(emptyPigmyDetails());
  const [nominees, setNominees] = useState<NomineeRow[]>([emptyNominee(1)]);
  const [jointHolder, setJointHolder] = useState<JointHolderData>(emptyJointHolder());

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [customerPickerTarget, setCustomerPickerTarget] = useState<"application" | "jointHolder" | number | null>(null);
  const [branchPickerOpen, setBranchPickerOpen] = useState(false);
  const [pincodeLoadingKey, setPincodeLoadingKey] = useState<string | null>(null);

  const clearError = (key: string) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setIsValidated(false);
  };

  const setApp = (patch: Partial<ApplicationData>) => setApplication((prev) => ({ ...prev, ...patch }));
  const setPigmy = (patch: Partial<PigmyDetailsData>) => setPigmyDetails((prev) => ({ ...prev, ...patch }));
  const updateNominee = (index: number, patch: Partial<NomineeRow>) =>
    setNominees((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  const setJH = (patch: Partial<JointHolderData>) => setJointHolder((prev) => ({ ...prev, ...patch }));

  const addNominee = () => setNominees((prev) => [...prev, emptyNominee(prev.length + 1)]);
  const deleteNominee = (index: number) =>
    setNominees((prev) => prev.filter((_, i) => i !== index).map((row, i) => ({ ...row, srNo: i + 1 })));

  const handleZip = async (pin: string, key: string, apply: (city: string, state: string, country: string) => void) => {
    if (pin.length !== 6) return;
    try {
      setPincodeLoadingKey(key);
      const details = await fetchPincodeDetails(pin);
      if (details) {
        apply(details.city, details.state, details.country);
        setErrors((prev) => ({ ...prev, [`${key}.city`]: "", [`${key}.state`]: "", [`${key}.country`]: "" }));
      } else {
        apply("", "", "");
        alert("Invalid Pincode");
      }
    } finally {
      setPincodeLoadingKey(null);
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!application.customerId.trim()) nextErrors["app.customerId"] = "Customer Id is required";
    if (!application.customerName.trim()) nextErrors["app.customerName"] = "Customer Name is required";
    if (!application.categoryCode.trim()) nextErrors["app.categoryCode"] = "Category Code is required";
    if (!application.riskCategory.trim()) nextErrors["app.riskCategory"] = "Risk Category is required";
    if (!application.introducerAccountCode.trim()) nextErrors["app.introducerAccountCode"] = "Introducer Account Code is required";
    if (!application.dateOfApplication.trim()) nextErrors["app.dateOfApplication"] = "Date of Application is required";
    if (!application.accountOperationCapacityId.trim()) nextErrors["app.accountOperationCapacityId"] = "Required";
    if (!application.minBalanceId.trim()) nextErrors["app.minBalanceId"] = "Required";

    if (!pigmyDetails.accountType.trim()) nextErrors["pig.accountType"] = "Required";
    if (!pigmyDetails.agentBranchCode.trim()) nextErrors["pig.agentBranchCode"] = "Agent Branch Code is required";
    if (!pigmyDetails.openingDate.trim()) nextErrors["pig.openingDate"] = "Opening Date is required";
    if (!pigmyDetails.installmentAmount.trim()) nextErrors["pig.installmentAmount"] = "Installment Amount is required";
    if (!pigmyDetails.interestRate.trim()) nextErrors["pig.interestRate"] = "Interest Rate is required";
    if (!pigmyDetails.periodOfDeposit.trim()) nextErrors["pig.periodOfDeposit"] = "Period of Deposit is required";
    if (!pigmyDetails.maturityDate.trim()) nextErrors["pig.maturityDate"] = "Maturity Date is required";
    if (!pigmyDetails.agentName.trim()) nextErrors["pig.agentName"] = "Agent Name is required";
    if (!pigmyDetails.agentId.trim()) nextErrors["pig.agentId"] = "Agent ID is required";

    nominees.forEach((row, i) => {
      if (!row.customerId.trim()) nextErrors[`nom.${i}.customerId`] = "Required";
      if (!row.name.trim()) nextErrors[`nom.${i}.name`] = "Required";
      if (!row.address1.trim()) nextErrors[`nom.${i}.address1`] = "Required";
      if (!row.address2.trim()) nextErrors[`nom.${i}.address2`] = "Required";
      if (!row.zip.trim()) {
        nextErrors[`nom.${i}.zip`] = "Required";
      } else if (!/^\d{6}$/.test(row.zip.trim())) {
        nextErrors[`nom.${i}.zip`] = "Enter a valid 6-digit pin code";
      }
      if (!row.city.trim()) nextErrors[`nom.${i}.city`] = "Required";
      if (!row.state.trim()) nextErrors[`nom.${i}.state`] = "Required";
      if (!row.country.trim()) nextErrors[`nom.${i}.country`] = "Required";
    });

    if (!jointHolder.customerId.trim()) nextErrors["jh.customerId"] = "Required";
    if (!jointHolder.name.trim()) nextErrors["jh.name"] = "Required";
    if (!jointHolder.address1.trim()) nextErrors["jh.address1"] = "Required";
    if (!jointHolder.address2.trim()) nextErrors["jh.address2"] = "Required";
    if (!jointHolder.zip.trim()) {
      nextErrors["jh.zip"] = "Required";
    } else if (!/^\d{6}$/.test(jointHolder.zip.trim())) {
      nextErrors["jh.zip"] = "Enter a valid 6-digit pin code";
    }
    if (!jointHolder.city.trim()) nextErrors["jh.city"] = "Required";
    if (!jointHolder.state.trim()) nextErrors["jh.state"] = "Required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => setIsValidated(validate());
  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };
  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose?.();
  };

  if (showSuccess) {
    return <SuccessModal title="Pigmy Deposit Account Created Successfully" subtitle="" onClose={handleSuccessDone} onDone={handleSuccessDone} />;
  }

  const handleCustomerSelect = (customer: Customer) => {
    if (customerPickerTarget === "application") {
      setApp({ customerId: customer.id, customerName: customer.name });
      clearError("app.customerId");
      clearError("app.customerName");
    } else if (customerPickerTarget === "jointHolder") {
      setJH({ customerId: customer.id, name: customer.name });
      clearError("jh.customerId");
      clearError("jh.name");
    } else if (typeof customerPickerTarget === "number") {
      updateNominee(customerPickerTarget, { customerId: customer.id, name: customer.name });
      clearError(`nom.${customerPickerTarget}.customerId`);
      clearError(`nom.${customerPickerTarget}.name`);
    }
    setCustomerPickerTarget(null);
  };

  const handleBranchSelect = (branch: Branch) => {
    setPigmy({ agentBranchCode: branch.code, agentBranchName: branch.name });
    clearError("pig.agentBranchCode");
    setBranchPickerOpen(false);
  };

  const footer = (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={handleValidate}
        disabled={isValidated}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Validate <ShieldCheck size={16} />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSave}
        disabled={!isValidated}
        className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save
      </button>
    </div>
  );

  const grid3 = "grid grid-cols-1 gap-4 md:grid-cols-3";
  const cardBorder = "bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]";

  return (
    <>
      <FormModal
        onClose={() => onClose?.()}
        titleEn="Add Pigmy Deposit Account"
        titleHi="पिग्मी डिपॉझिट अकाउंट जोडा"
        subtitleEn="Add some basic information related to the Employee"
        subtitleHi="कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती जोडा"
        tabs={[...TABS]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as Tab)}
        hideFooter
      >
        {activeTab === "Application" && (
          <div className={cardBorder}>
            <div className={grid3}>
              <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={!!errors["app.customerId"]}>
                <TextInput
                  icon={<IdCard size={16} />}
                  value={application.customerId}
                  onChange={() => {}}
                  readOnly
                  placeholder="Select Customer"
                  error={!!errors["app.customerId"]}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setCustomerPickerTarget("application")}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary hover:bg-primary-100"
                    >
                      <MoreVertical size={14} />
                    </button>
                  }
                />
              </FieldShell>

              <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required error={!!errors["app.customerName"]}>
                <TextInput icon={<User size={16} />} value={application.customerName} onChange={() => {}} readOnly placeholder="Customer Name" error={!!errors["app.customerName"]} />
              </FieldShell>

              <FieldShell label="Category Code" labelHi="कॅटेगरी कोड" required error={!!errors["app.categoryCode"]}>
                <SelectInput
                  icon={<Tag size={16} />}
                  value={application.categoryCode}
                  onChange={(v) => {
                    setApp({ categoryCode: v });
                    clearError("app.categoryCode");
                  }}
                  options={CATEGORY_CODES}
                  error={!!errors["app.categoryCode"]}
                />
              </FieldShell>

              <FieldShell label="Risk Category" labelHi="जोखीम कॅटेगरी" required error={!!errors["app.riskCategory"]}>
                <SelectInput
                  icon={<ShieldCheck size={16} />}
                  value={application.riskCategory}
                  onChange={(v) => {
                    setApp({ riskCategory: v });
                    clearError("app.riskCategory");
                  }}
                  options={RISK_CATEGORIES}
                  error={!!errors["app.riskCategory"]}
                />
              </FieldShell>

              <FieldShell label="Introducer Account Code" labelHi="ओळखकर्ता खाते कोड" required error={!!errors["app.introducerAccountCode"]}>
                <SelectInput
                  icon={<Hash size={16} />}
                  value={application.introducerAccountCode}
                  onChange={(v) => {
                    setApp({ introducerAccountCode: v, introducerAccountName: INTRODUCER_ACCOUNTS[v] ?? "" });
                    clearError("app.introducerAccountCode");
                  }}
                  options={Object.keys(INTRODUCER_ACCOUNTS)}
                  error={!!errors["app.introducerAccountCode"]}
                />
              </FieldShell>

              <FieldShell label="Introducer Account Name" labelHi="ओळखकर्ता खात्याचे नाव" required>
                <TextInput icon={<Wallet size={16} />} value={application.introducerAccountName} onChange={() => {}} readOnly placeholder="Introducer Account Name" />
              </FieldShell>

            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[380px_1fr_1fr]">
              <FieldShell
                label="Account Operation Capacity Id"
                labelHi="खाते ऑपरेशन क्षमता आयडी"
                required
                noWrap
                error={!!errors["app.accountOperationCapacityId"]}
              >
                <SelectInput
                  icon={<Layers size={16} />}
                  value={application.accountOperationCapacityId}
                  onChange={(v) => {
                    setApp({ accountOperationCapacityId: v });
                    clearError("app.accountOperationCapacityId");
                  }}
                  options={ACCOUNT_OPERATION_CAPACITY}
                  error={!!errors["app.accountOperationCapacityId"]}
                />
              </FieldShell>

              <FieldShell label="Date of Application" labelHi="अर्ज दिनांक" required noWrap error={!!errors["app.dateOfApplication"]}>
                <DateInput
                  value={application.dateOfApplication}
                  onChange={(v) => {
                    setApp({ dateOfApplication: v });
                    clearError("app.dateOfApplication");
                  }}
                  error={!!errors["app.dateOfApplication"]}
                />
              </FieldShell>

              <FieldShell label="Min Balance ID" labelHi="किमान शिल्लक आयडी" required noWrap error={!!errors["app.minBalanceId"]}>
                <SelectInput
                  icon={<IndianRupee size={16} />}
                  value={application.minBalanceId}
                  onChange={(v) => {
                    setApp({ minBalanceId: v });
                    clearError("app.minBalanceId");
                  }}
                  options={MIN_BALANCE_IDS}
                  error={!!errors["app.minBalanceId"]}
                />
              </FieldShell>
            </div>
          </div>
        )}

        {activeTab === "Pigmy Details" && (
          <div className={cardBorder}>
            <div className={grid3}>
              <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required error={!!errors["pig.accountType"]}>
                <SelectInput
                  icon={<Layers size={16} />}
                  value={pigmyDetails.accountType}
                  onChange={(v) => {
                    setPigmy({ accountType: v });
                    clearError("pig.accountType");
                  }}
                  options={ACCOUNT_TYPES}
                  error={!!errors["pig.accountType"]}
                />
              </FieldShell>

              <FieldShell label="Agent Branch Code" labelHi="एजंट शाखा कोड" required error={!!errors["pig.agentBranchCode"]}>
                <TextInput
                  icon={<Building2 size={16} />}
                  value={pigmyDetails.agentBranchCode}
                  onChange={() => {}}
                  readOnly
                  placeholder="Select Branch"
                  error={!!errors["pig.agentBranchCode"]}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setBranchPickerOpen(true)}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary hover:bg-primary-100"
                    >
                      <MoreVertical size={14} />
                    </button>
                  }
                />
              </FieldShell>

              <FieldShell label="Opening Date" labelHi="उघडण्याची तारीख" required error={!!errors["pig.openingDate"]}>
                <DateInput
                  value={pigmyDetails.openingDate}
                  onChange={(v) => {
                    setPigmy({ openingDate: v });
                    clearError("pig.openingDate");
                  }}
                  error={!!errors["pig.openingDate"]}
                />
              </FieldShell>

              <FieldShell label="Installment Amount" labelHi="हप्ता रक्कम" required error={!!errors["pig.installmentAmount"]}>
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={pigmyDetails.installmentAmount}
                  onChange={(v) => {
                    setPigmy({ installmentAmount: v });
                    clearError("pig.installmentAmount");
                  }}
                  placeholder="Enter Installment Amount"
                  error={!!errors["pig.installmentAmount"]}
                />
              </FieldShell>

              <FieldShell label="Interest Rate" labelHi="व्याज दर" required error={!!errors["pig.interestRate"]}>
                <TextInput
                  icon={<Percent size={16} />}
                  value={pigmyDetails.interestRate}
                  onChange={(v) => {
                    setPigmy({ interestRate: v });
                    clearError("pig.interestRate");
                  }}
                  placeholder="Enter Interest Rate"
                  error={!!errors["pig.interestRate"]}
                />
              </FieldShell>

              <DayMonthField value={pigmyDetails.interestPaidIn} onChange={(v) => setPigmy({ interestPaidIn: v })} />
              <FieldShell label="Period of Deposit" labelHi="ठेव कालावधी" required error={!!errors["pig.periodOfDeposit"]}>
                <TextInput
                  icon={<Clock size={16} />}
                  value={pigmyDetails.periodOfDeposit}
                  onChange={(v) => {
                    setPigmy({ periodOfDeposit: v });
                    clearError("pig.periodOfDeposit");
                  }}
                  placeholder="e.g. 60 Months"
                  error={!!errors["pig.periodOfDeposit"]}
                />
              </FieldShell>


              <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required error={!!errors["pig.maturityDate"]}>
                <DateInput
                  value={pigmyDetails.maturityDate}
                  onChange={(v) => {
                    setPigmy({ maturityDate: v });
                    clearError("pig.maturityDate");
                  }}
                  error={!!errors["pig.maturityDate"]}
                />
              </FieldShell>

              <FieldShell label="Agent Name" labelHi="एजंटचे नाव" required error={!!errors["pig.agentName"]}>
                <TextInput
                  icon={<User size={16} />}
                  value={pigmyDetails.agentName}
                  onChange={(v) => {
                    setPigmy({ agentName: v });
                    clearError("pig.agentName");
                  }}
                  placeholder="Enter Agent Name"
                  error={!!errors["pig.agentName"]}
                />
              </FieldShell>

              <FieldShell label="Agent ID" labelHi="एजंट आयडी" required error={!!errors["pig.agentId"]}>
                <TextInput
                  icon={<IdCard size={16} />}
                  value={pigmyDetails.agentId}
                  onChange={(v) => {
                    setPigmy({ agentId: v });
                    clearError("pig.agentId");
                  }}
                  placeholder="Enter Agent ID"
                  error={!!errors["pig.agentId"]}
                />
              </FieldShell>
            </div>
          </div>
        )}

        {activeTab === "Nominee" && (
          <div className="space-y-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addNominee}
                className="mb-4 flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {nominees.map((row, index) => (
              <div key={row.srNo} className={`relative ${cardBorder}`}>
                {nominees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteNominee(index)}
                    aria-label={`Remove Nominee ${row.srNo}`}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <div className="flex gap-4 ">
                  <SrNoBox srNo={row.srNo} />

                  <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-[220px_1fr_1fr]">
                    <FieldShell label="Salutation Code" labelHi="संबोधन कोड" required>
                      <SelectInput icon={<User size={16} />} value={row.salutationCode} onChange={(v) => updateNominee(index, { salutationCode: v })} options={SALUTATIONS} />
                    </FieldShell>

                    <FieldShell label="Nominee Customer ID" labelHi="नामनिर्देशित ग्राहक आयडी" required error={!!errors[`nom.${index}.customerId`]}>
                       {/* <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-[290px_1fr_1fr]"> */}
                      <TextInput
                        icon={<IdCard size={16} />}
                        value={row.customerId}
                        onChange={() => {}}
                        readOnly
                        placeholder="Select Customer"
                        error={!!errors[`nom.${index}.customerId`]}
                        trailing={
                          <button
                            type="button"
                            onClick={() => setCustomerPickerTarget(index)}
                            className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary hover:bg-primary-100"
                          >
                            <MoreVertical size={14} />
                          </button>
                        }
                      />
                       {/* </div> */}
                    </FieldShell>

                    <FieldShell label="Nominee Name" labelHi="नामनिर्देशित नाव" required error={!!errors[`nom.${index}.name`]}>
                      <TextInput icon={<User size={16} />} value={row.name} onChange={() => {}} readOnly placeholder="Nominee Name" error={!!errors[`nom.${index}.name`]} />
                    </FieldShell>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <FieldShell label="Relation" labelHi="नाते" required>
                    <SelectInput icon={<Users size={16} />} value={row.relation} onChange={(v) => updateNominee(index, { relation: v })} options={RELATIONS} />
                  </FieldShell>

                  <FieldShell label="Address 1" labelHi="पत्ता १" required error={!!errors[`nom.${index}.address1`]}>
                    <TextInput
                      icon={<Home size={16} />}
                      value={row.address1}
                      onChange={(v) => {
                        updateNominee(index, { address1: v });
                        clearError(`nom.${index}.address1`);
                      }}
                      error={!!errors[`nom.${index}.address1`]}
                    />
                  </FieldShell>

                  <FieldShell label="Address 2" labelHi="पत्ता २" required error={!!errors[`nom.${index}.address2`]}>
                    <TextInput
                      icon={<Home size={16} />}
                      value={row.address2}
                      onChange={(v) => {
                        updateNominee(index, { address2: v });
                        clearError(`nom.${index}.address2`);
                      }}
                      error={!!errors[`nom.${index}.address2`]}
                    />
                  </FieldShell>

                  <FieldShell label="Address 3" labelHi="पत्ता ३">
                    <TextInput icon={<Home size={16} />} value={row.address3} onChange={(v) => updateNominee(index, { address3: v })} />
                  </FieldShell>

                  <FieldShell label="Zip" labelHi="पिन कोड" required error={!!errors[`nom.${index}.zip`]}>
                    <TextInput
                      icon={<Hash size={16} />}
                      value={row.zip}
                      onChange={(v) => {
                        const pin = v.replace(/\D/g, "").slice(0, 6);
                        updateNominee(index, { zip: pin });
                        clearError(`nom.${index}.zip`);
                        if (pin.length === 6) {
                          handleZip(pin, `nom.${index}`, (city, state, country) => updateNominee(index, { city, state, country }));
                        }
                      }}
                      error={!!errors[`nom.${index}.zip`]}
                    />
                  </FieldShell>

                  <FieldShell label="City" labelHi="शहरे" required error={!!errors[`nom.${index}.city`]}>
                    <CityPicklistField label="" icon={<Building2 size={16} />} value={pincodeLoadingKey === `nom.${index}` ? "Loading..." : row.city} onSelect={(city) => updateNominee(index, { city: city.name })} error={errors[`nom.${index}.city`]} />
                  </FieldShell>

                  <StatePicklistField
                    label="State"
                    labelHi="राज्य"
                    icon={<MapPin size={16} />}
                    value={row.state}
                    onSelect={(s) => updateNominee(index, { state: s.stateName })}
                    placeholder="Select State"
                    required
                    error={errors[`nom.${index}.state`]}
                  />

                  <FieldShell label="Country" labelHi="देश" required error={!!errors[`nom.${index}.country`]}>
                    <TextInput icon={<Flag size={16} />} value={row.country} onChange={() => {}} readOnly placeholder="Country" error={!!errors[`nom.${index}.country`]} />
                  </FieldShell>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Joint Holder" && (
          <div className={cardBorder}>
            <div className="flex gap-4">
              <SrNoBox srNo={jointHolder.srNo} />

              <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-[220px_1fr_1fr]">
                  <FieldShell label="Salutation Code" labelHi="संबोधन कोड" required noWrap>
                    <SelectInput icon={<User size={16} />} value={jointHolder.salutationCode} onChange={(v) => setJH({ salutationCode: v })} options={SALUTATIONS} />
                  </FieldShell>

                  <FieldShell label="JHT Holder Customer ID" labelHi="जॉईंट होल्डर ग्राहक आयडी" required noWrap error={!!errors["jh.customerId"]}>
                    <TextInput
                      icon={<IdCard size={16} />}
                      value={jointHolder.customerId}
                      onChange={() => {}}
                      readOnly
                      placeholder="Select Customer"
                      error={!!errors["jh.customerId"]}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setCustomerPickerTarget("jointHolder")}
                          className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary hover:bg-primary-100"
                        >
                          <MoreVertical size={14} />
                        </button>
                      }
                    />
                  </FieldShell>

                  <FieldShell label="JHT Holder Name" labelHi="जॉईंट होल्डर नाव" required error={!!errors["jh.name"]}>
                    <TextInput icon={<User size={16} />} value={jointHolder.name} onChange={() => {}} readOnly placeholder="Holder Name" error={!!errors["jh.name"]} />
                  </FieldShell>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                <FieldShell label="Address 1" labelHi="पत्ता १" required error={!!errors["jh.address1"]}>
                  <TextInput
                    icon={<Home size={16} />}
                    value={jointHolder.address1}
                    onChange={(v) => {
                      setJH({ address1: v });
                      clearError("jh.address1");
                    }}
                    error={!!errors["jh.address1"]}
                  />
                </FieldShell>

                <FieldShell label="Address 2" labelHi="पत्ता २" required error={!!errors["jh.address2"]}>
                  <TextInput
                    icon={<Home size={16} />}
                    value={jointHolder.address2}
                    onChange={(v) => {
                      setJH({ address2: v });
                      clearError("jh.address2");
                    }}
                    error={!!errors["jh.address2"]}
                  />
                </FieldShell>

                <FieldShell label="Address 3" labelHi="पत्ता ३">
                  <TextInput icon={<Home size={16} />} value={jointHolder.address3} onChange={(v) => setJH({ address3: v })} />
                </FieldShell>

                <FieldShell label="Zip" labelHi="पिन कोड" required error={!!errors["jh.zip"]}>
                  <TextInput
                    icon={<Hash size={16} />}
                    value={jointHolder.zip}
                    onChange={(v) => {
                      const pin = v.replace(/\D/g, "").slice(0, 6);
                      setJH({ zip: pin });
                      clearError("jh.zip");
                      if (pin.length === 6) {
                        handleZip(pin, "jh", (city, state, country) => setJH({ city, state, country }));
                      }
                    }}
                    error={!!errors["jh.zip"]}
                  />
                </FieldShell>

                <FieldShell label="City" labelHi="शहरे" required error={!!errors["jh.city"]}>
                  <CityPicklistField label="" icon={<Building2 size={16} />} value={pincodeLoadingKey === "jh" ? "Loading..." : jointHolder.city} onSelect={(city) => setJH({ city: city.name })} error={errors["jh.city"]} />
                </FieldShell>

                <StatePicklistField
                  label="State"
                  labelHi="राज्य"
                  icon={<MapPin size={16} />}
                  value={jointHolder.state}
                  onSelect={(s) => setJH({ state: s.stateName })}
                  placeholder="Select State"
                  required
                  error={errors["jh.state"]}
                />

                <FieldShell label="Country" labelHi="देश" required>
                  <TextInput icon={<Flag size={16} />} value={jointHolder.country} onChange={() => {}} readOnly placeholder="Country" />
                </FieldShell>
              </div>
            </div>
        )}

        {footer}
      </FormModal>

      <CustomerIdPickerModal open={customerPickerTarget !== null} onClose={() => setCustomerPickerTarget(null)} onSelect={handleCustomerSelect} />

      <BranchListPickerModal open={branchPickerOpen} onClose={() => setBranchPickerOpen(false)} onSelect={handleBranchSelect} />
    </>
  );
}

/* ===================== Exported modal wrapper ===================== */

export interface AddPigmyDepositModalProps {
  open: boolean;
  onClose?: () => void;
}

export default function AddPigmyDepositModal({ open, onClose }: AddPigmyDepositModalProps) {
  if (!open) return null;
  return <AddPigmyDepositForm onClose={onClose} />;
}
