import { IMAGES } from "@/assets";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import { User, IdCard, CreditCard, IndianRupee, FileText, Hash, Percent, ArrowLeftRight, Home, Building2, MapPin, Flag, Users, Plus, Trash2, MoreVertical, X } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SelectInput, DateInput, SectionCard, RadioYesNo } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import SrNoBadge from "@/components/shared/SrNoBadge";
import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import StatePicklistField from "@/components/common/StatePicklistField";

/* ===== from AddTDClosingReinvest.tsx ===== */
const AddTDClosingReinvest_INTEREST_PAY_MODE_OPTIONS = ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "On Maturity"];
const AddTDClosingReinvest_INTEREST_CATEGORY_OPTIONS = ["Public", "Staff"];
const AddTDClosingReinvest_SALUTATION_OPTIONS = ["MR", "MRS", "MS", "DR"];
const AddTDClosingReinvest_RELATION_OPTIONS = ["Father", "Mother", "Spouse", "Son", "Daughter", "Brother", "Sister"];
const AddTDClosingReinvest_CITY_OPTIONS = ["Kolhapur", "Mumbai", "Pune", "Nagpur"];

const AddTDClosingReinvest_PRODUCT_CODE_ROWS = [
  { code: "PR001", name: "Fixed Deposit" },
  { code: "PR002", name: "Recurring Deposit" },
  { code: "PR003", name: "Savings Deposit" },
];

const AddTDClosingReinvest_ACCOUNT_CODE_ROWS = [
  { code: "401", name: "Sample Account" },
  { code: "402", name: "Current Account" },
  { code: "403", name: "Savings Account" },
];

const AddTDClosingReinvest_CUSTOMER_ROWS = [
  { id: "00022", name: "Karan Mangesh Patil" },
  { id: "00021", name: "Nitish Sai Reddy" },
  { id: "00023", name: "Sneha Kulkarni" },
];

export interface AddTDClosingReinvest_TDClosingReinvestFormData {
  // Section 1 — Account & Reinvestment Information
  date: string;
  scrollNumber: string;
  isRenewalSameAC: boolean;
  reinvestAmount: string;
  newProductCode: string;
  description: string;
  remainingAmount: string;
  unitOfPeriod: string;
  period: string;
  effectiveDate: string;
  creditAccountCode: string;
  name: string;
  interestRate: string;
  maturityDate: string;
  newMaturityAmount: string;

  // Section 2 — Interest Configuration
  cashInterest: boolean;
  applyDiscountRate: boolean;
  interestPayMode: string;
  interestCategory: string;
  birthDate: string;
  interestPeriod: string;

  // Section 3 — Payment Details
  modeOfPayment: string;
  transferAccountCode: string;
  accountName: string;
  amount: string;
  originalResponding: string;
  adviceNumber: string;
  adviceDate: string;

  // Section 4 — Nominee 1
  nomineeSalutationCode: string;
  nomineeCustomerId: string;
  nomineeName: string;
  nomineeRelation: string;
  nomineeAddress1: string;
  nomineeAddress2: string;
  nomineeAddress3: string;
  nomineeZip: string;
  nomineeCity: string;
  nomineeState: string;
  nomineeCountry: string;

  // Section 5 — Joint Holder
  jtSalutationCode: string;
  jtHolderCustomerId: string;
  jtHolderName: string;
  jtAddress1: string;
  jtAddress2: string;
  jtAddress3: string;
  jtZip: string;
  jtCity: string;
  jtState: string;
  jtCountry: string;
}

/** Reusable dummy data — used to prefill the form on open. */
export const AddTDClosingReinvest_DEFAULT_TD_CLOSING_REINVEST_DATA: AddTDClosingReinvest_TDClosingReinvestFormData = {
  date: "2026-05-20",
  scrollNumber: "12",
  isRenewalSameAC: true,
  reinvestAmount: "250000",
  newProductCode: "401",
  description: "Description",
  remainingAmount: "250000",
  unitOfPeriod: "0",
  period: "0",
  effectiveDate: "2026-05-20",
  creditAccountCode: "401",
  name: "Sample Customer",
  interestRate: "8",
  maturityDate: "2026-05-20",
  newMaturityAmount: "250000",

  cashInterest: false,
  applyDiscountRate: false,
  interestPayMode: "Monthly",
  interestCategory: "Public",
  birthDate: "2026-05-20",
  interestPeriod: "60",

  modeOfPayment: "Transfer",
  transferAccountCode: "401",
  accountName: "Sample Customer",
  amount: "250000",
  originalResponding: "Original",
  adviceNumber: "12",
  adviceDate: "2026-02-10",

  nomineeSalutationCode: "MR",
  nomineeCustomerId: "00022",
  nomineeName: "Karan Mangesh Patil",
  nomineeRelation: "Father",
  nomineeAddress1: "Kolhapur",
  nomineeAddress2: "Kolhapur",
  nomineeAddress3: "Kolhapur",
  nomineeZip: "416005",
  nomineeCity: "Kolhapur",
  nomineeState: "Maharashtra",
  nomineeCountry: "India",

  jtSalutationCode: "MR",
  jtHolderCustomerId: "00021",
  jtHolderName: "Nitish Sai Reddy",
  jtAddress1: "Kolhapur",
  jtAddress2: "Kolhapur",
  jtAddress3: "Kolhapur",
  jtZip: "416005",
  jtCity: "Kolhapur",
  jtState: "Maharashtra",
  jtCountry: "India",
};

const AddTDClosingReinvest_TEXT_FIELD_KEYS: (keyof AddTDClosingReinvest_TDClosingReinvestFormData)[] = [
  "date",
  "scrollNumber",
  "reinvestAmount",
  "newProductCode",
  "description",
  "remainingAmount",
  "unitOfPeriod",
  "period",
  "effectiveDate",
  "creditAccountCode",
  "name",
  "interestRate",
  "maturityDate",
  "newMaturityAmount",
  "interestPayMode",
  "interestCategory",
  "birthDate",
  "interestPeriod",
  "modeOfPayment",
  "transferAccountCode",
  "accountName",
  "amount",
  "originalResponding",
  "adviceNumber",
  "adviceDate",
  "nomineeSalutationCode",
  "nomineeCustomerId",
  "nomineeName",
  "nomineeRelation",
  "nomineeAddress1",
  "nomineeAddress2",
  "nomineeAddress3",
  "nomineeZip",
  "nomineeCity",
  "nomineeState",
  "nomineeCountry",
  "jtSalutationCode",
  "jtHolderCustomerId",
  "jtHolderName",
  "jtAddress1",
  "jtAddress2",
  "jtAddress3",
  "jtZip",
  "jtCity",
  "jtState",
  "jtCountry",
];

const AddTDClosingReinvest_NOMINEE_FIELD_KEYS: (keyof AddTDClosingReinvest_TDClosingReinvestFormData)[] = [
  "nomineeSalutationCode",
  "nomineeCustomerId",
  "nomineeName",
  "nomineeRelation",
  "nomineeAddress1",
  "nomineeAddress2",
  "nomineeAddress3",
  "nomineeZip",
  "nomineeCity",
  "nomineeState",
  "nomineeCountry",
];

const AddTDClosingReinvest_JOINT_HOLDER_FIELD_KEYS: (keyof AddTDClosingReinvest_TDClosingReinvestFormData)[] = [
  "jtSalutationCode",
  "jtHolderCustomerId",
  "jtHolderName",
  "jtAddress1",
  "jtAddress2",
  "jtAddress3",
  "jtZip",
  "jtCity",
  "jtState",
  "jtCountry",
];

/** Same validation approach used by Investment Account / Transaction Master's sibling forms.
 *  Nominee / Joint Holder fields are only required once their section has been added. */
const AddTDClosingReinvest_validateTDClosingReinvest = (
  data: AddTDClosingReinvest_TDClosingReinvestFormData,
  showNominee: boolean,
  showJointHolder: boolean
): Record<keyof AddTDClosingReinvest_TDClosingReinvestFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof AddTDClosingReinvest_TDClosingReinvestFormData, boolean>;
  AddTDClosingReinvest_TEXT_FIELD_KEYS.forEach((key) => {
    if (AddTDClosingReinvest_NOMINEE_FIELD_KEYS.includes(key) && !showNominee) {
      errors[key] = false;
      return;
    }
    if (AddTDClosingReinvest_JOINT_HOLDER_FIELD_KEYS.includes(key) && !showJointHolder) {
      errors[key] = false;
      return;
    }
    errors[key] = isEmpty(data[key] as string);
  });
  errors.isRenewalSameAC = false;
  errors.cashInterest = false;
  errors.applyDiscountRate = false;
  return errors;
};

/** Simulated save — no backend yet. */
const AddTDClosingReinvest_saveTDClosingReinvest = (data: AddTDClosingReinvest_TDClosingReinvestFormData) =>
  new Promise<AddTDClosingReinvest_TDClosingReinvestFormData>((resolve) =>
    setTimeout(() => resolve(data), 600)
  );

const AddTDClosingReinvest_LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AddTDClosingReinvest_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AddTDClosingReinvest_RadioTwoOption = ({
  label,
  labelHi,
  options,
  value,
  onChange,
}: {
  label: string;
  labelHi: string;
  options: [string, string];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="last:mb-0 flex items-center gap-2">
    <label className="large block text-sm font-medium text-[#1F2858]">
      {label} <span className="text-slate-600">/ {labelHi}</span>
    </label>
    <div className="flex items-center gap-4 pt-1">
      {options.map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="h-4 w-4 accent-primary"
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export interface AddTDClosingReinvest_AddTDClosingReinvestProps {
  onClose: () => void;
  onSave?: (data: AddTDClosingReinvest_TDClosingReinvestFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddTDClosingReinvest = ({ onClose, onSave, variant = "modal" }: AddTDClosingReinvest_AddTDClosingReinvestProps) => {
  const [form, setForm] = useState<AddTDClosingReinvest_TDClosingReinvestFormData>(
    AddTDClosingReinvest_DEFAULT_TD_CLOSING_REINVEST_DATA
  );
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AddTDClosingReinvest_TDClosingReinvestFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNominee, setShowNominee] = useState(false);
  const [showJointHolder, setShowJointHolder] = useState(false);
  const [productCodePickerOpen, setProductCodePickerOpen] = useState(false);
  const [creditAccountPickerOpen, setCreditAccountPickerOpen] = useState(false);
  const [transferAccountPickerOpen, setTransferAccountPickerOpen] = useState(false);
  const [nomineeCustomerPickerOpen, setNomineeCustomerPickerOpen] = useState(false);
  const [jtHolderCustomerPickerOpen, setJtHolderCustomerPickerOpen] = useState(false);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const handleProductCodeSelect = (row: { code: string; name: string }) => {
    setForm((f) => ({ ...f, newProductCode: row.code, description: row.name }));
    setProductCodePickerOpen(false);
  };

  const handleCreditAccountSelect = (row: { code: string; name: string }) => {
    setForm((f) => ({ ...f, creditAccountCode: row.code, name: row.name }));
    setCreditAccountPickerOpen(false);
  };

  const handleTransferAccountSelect = (row: { code: string; name: string }) => {
    setForm((f) => ({ ...f, transferAccountCode: row.code, accountName: row.name }));
    setTransferAccountPickerOpen(false);
  };

  const handleNomineeCustomerSelect = (row: { id: string; name: string }) => {
    setForm((f) => ({ ...f, nomineeCustomerId: row.id, nomineeName: row.name }));
    setNomineeCustomerPickerOpen(false);
  };

  const handleJtHolderCustomerSelect = (row: { id: string; name: string }) => {
    setForm((f) => ({ ...f, jtHolderCustomerId: row.id, jtHolderName: row.name }));
    setJtHolderCustomerPickerOpen(false);
  };

  const handlePlaceholderAction = (label: string) => {
    toast.info(`${label} will be implemented.`);
  };

  const markDirty = (field: keyof AddTDClosingReinvest_TDClosingReinvestFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof AddTDClosingReinvest_TDClosingReinvestFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const updateBoolField = (field: "isRenewalSameAC" | "cashInterest" | "applyDiscountRate", value: boolean) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleDeleteNominee = () => {
    setShowNominee(false);
    setErrors((e) => {
      const next = { ...e };
      AddTDClosingReinvest_NOMINEE_FIELD_KEYS.forEach((key) => delete next[key]);
      return next;
    });
    setForm((f) => {
      const reset = { ...f } as Record<string, string | boolean>;
      AddTDClosingReinvest_NOMINEE_FIELD_KEYS.forEach((key) => {
        reset[key] = AddTDClosingReinvest_DEFAULT_TD_CLOSING_REINVEST_DATA[key] as string;
      });
      return reset as unknown as AddTDClosingReinvest_TDClosingReinvestFormData;
    });
  };

  const handleDeleteJointHolder = () => {
    setShowJointHolder(false);
    setErrors((e) => {
      const next = { ...e };
      AddTDClosingReinvest_JOINT_HOLDER_FIELD_KEYS.forEach((key) => delete next[key]);
      return next;
    });
    setForm((f) => {
      const reset = { ...f } as Record<string, string | boolean>;
      AddTDClosingReinvest_JOINT_HOLDER_FIELD_KEYS.forEach((key) => {
        reset[key] = AddTDClosingReinvest_DEFAULT_TD_CLOSING_REINVEST_DATA[key] as string;
      });
      return reset as unknown as AddTDClosingReinvest_TDClosingReinvestFormData;
    });
  };

  const handleAccept = async () => {
    const newErrors = AddTDClosingReinvest_validateTDClosingReinvest(form, showNominee, showJointHolder);
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      setIsValidated(false);
      toast.error("Please fill all required fields before proceeding.");
      return;
    }
    setIsValidated(true);
    if (isSaving) return;
    setIsSaving(true);
    await AddTDClosingReinvest_saveTDClosingReinvest(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(AddTDClosingReinvest_DEFAULT_TD_CLOSING_REINVEST_DATA);
    setErrors({});
    setIsValidated(false);
    setShowNominee(false);
    setShowJointHolder(false);
    onClose();
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
        title="TD Closing Reinvest Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="TD Closing Reinvest"
      titleHi="टीडी क्लोजिंग रीइनवेस्ट"
      subtitleEn="All Information's are related to Interest Payment Mark."
      subtitleHi="सर्व माहिती व्याज भरण्याच्या मार्कशी संबंधित आहे."
      headerIcon={<Image src={IMAGES.TD_CLOSING_REINVEST} alt="TD Closing Reinvest" width={50} height={50} />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
    >
      <div className="relative">
        <div className="absolute right-6 top-6 z-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowNominee(true)}
            className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Plus size={16} /> Add Nominee
          </button>
          <button
            type="button"
            onClick={() => setShowJointHolder(true)}
            className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Plus size={16} /> Add Joint Holder
          </button>
        </div>

        <SectionCard
          titleEn="Account & Reinvestment Information"
          titleHi="खाते आणि पुनर्निवेश माहिती"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={<AddTDClosingReinvest_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Date" labelHi="तारीख" required error={errors.date}>
              <DateInput value={form.date} onChange={() => {}} readOnly error={errors.date} />
            </FieldShell>

            <FieldShell label="Scroll Number" labelHi="स्क्रोल नंबर" required error={errors.scrollNumber}>
              <TextInput
                icon={<Hash size={16} />}
                value={form.scrollNumber}
                onChange={() => {}}
                readOnly
                placeholder="Enter Scroll Number"
                error={errors.scrollNumber}
              />
            </FieldShell>

            <RadioYesNo
              label="Is Renewal Same A/C"
              labelHi="रिन्युअल हेच A/C आहे का"
              value={form.isRenewalSameAC}
              onChange={(v) => updateBoolField("isRenewalSameAC", v)}
            />

            <FieldShell label="Reinvest Amount" labelHi="पुन्हा गुंतवणूक रक्कम" required error={errors.reinvestAmount}>
              <TextInput
                icon={<IndianRupee size={16} />}
                value={form.reinvestAmount}
                onChange={(v) => updateField("reinvestAmount", v)}
                placeholder="Enter Reinvest Amount"
                error={errors.reinvestAmount}
              />
            </FieldShell>

            <FieldShell label="New Product Code" labelHi="नवीन उत्पादन कोड" required error={errors.newProductCode}>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput
                    icon={<CreditCard size={16} />}
                    value={form.newProductCode}
                    onChange={(v) => updateField("newProductCode", v)}
                    placeholder="Enter New Product Code"
                    error={errors.newProductCode}
                  />
                </div>
                <AddTDClosingReinvest_LookupTrigger onClick={() => setProductCodePickerOpen(true)} />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required error={errors.description}>
              <TextInput
                icon={<FileText size={16} />}
                value={form.description}
                onChange={() => {}}
                readOnly
                placeholder="Enter Description"
                error={errors.description}
              />
            </FieldShell>

            <FieldShell label="Remaining Amount" labelHi="पुन्हा गुंतवणूक रक्कम" required error={errors.remainingAmount}>
              <TextInput
                icon={<IndianRupee size={16} />}
                value={form.remainingAmount}
                onChange={() => {}}
                readOnly
                placeholder="Enter Remaining Amount"
                error={errors.remainingAmount}
              />
            </FieldShell>

            <FieldShell label="Unit Of Period" labelHi="कालावधीचे एकक" required error={errors.unitOfPeriod}>
              <TextInput
                icon={<ArrowLeftRight size={16} />}
                value={form.unitOfPeriod}
                onChange={(v) => updateField("unitOfPeriod", v)}
                placeholder="Enter Unit Of Period"
                error={errors.unitOfPeriod}
              />
            </FieldShell>

            <FieldShell label="Period" labelHi="महिना" required error={errors.period}>
              <TextInput
                icon={<ArrowLeftRight size={16} />}
                value={form.period}
                onChange={(v) => updateField("period", v)}
                placeholder="Enter Period"
                error={errors.period}
              />
            </FieldShell>

            <FieldShell label="Effective Date" labelHi="किंमत लागू होण्याची तारीख" required error={errors.effectiveDate}>
              <DateInput value={form.effectiveDate} onChange={(v) => updateField("effectiveDate", v)} error={errors.effectiveDate} />
            </FieldShell>

            <FieldShell label="Credit Account Code" labelHi="क्रेडिट अकाउंट कोड" required error={errors.creditAccountCode}>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput
                    icon={<CreditCard size={16} />}
                    value={form.creditAccountCode}
                    onChange={(v) => updateField("creditAccountCode", v)}
                    placeholder="Enter Credit Account Code"
                    error={errors.creditAccountCode}
                  />
                </div>
                <AddTDClosingReinvest_LookupTrigger onClick={() => setCreditAccountPickerOpen(true)} />
              </div>
            </FieldShell>

            <FieldShell label="Name" labelHi="नाव" required error={errors.name}>
              <TextInput
                icon={<User size={16} />}
                value={form.name}
                onChange={() => {}}
                readOnly
                placeholder="Enter Name"
                error={errors.name}
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

            <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required error={errors.maturityDate}>
              <DateInput value={form.maturityDate} onChange={() => {}} readOnly error={errors.maturityDate} />
            </FieldShell>

            <FieldShell label="New Maturity Amount" labelHi="नवीन परिपक्वतेची रक्कम" required error={errors.newMaturityAmount}>
              <TextInput
                icon={<IndianRupee size={16} />}
                value={form.newMaturityAmount}
                onChange={() => {}}
                readOnly
                placeholder="Enter New Maturity Amount"
                error={errors.newMaturityAmount}
              />
            </FieldShell>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        titleEn="Interest Configuration"
        titleHi="आस्वाद सेटिंग"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<AddTDClosingReinvest_SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <RadioYesNo
            label="Cash Interest"
            labelHi="कॅश व्याज"
            value={form.cashInterest}
            onChange={(v) => updateBoolField("cashInterest", v)}
          />

          <RadioYesNo
            label="Apply Discount Rate"
            labelHi="सवलत दर लागू करा"
            value={form.applyDiscountRate}
            onChange={(v) => updateBoolField("applyDiscountRate", v)}
          />

          <FieldShell label="Interest Pay Mode" labelHi="व्याज भरण्याची पद्धत" required error={errors.interestPayMode}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.interestPayMode}
              onChange={(v) => updateField("interestPayMode", v)}
              options={AddTDClosingReinvest_INTEREST_PAY_MODE_OPTIONS}
              placeholder="Select Interest Pay Mode"
              error={errors.interestPayMode}
            />
          </FieldShell>

          <FieldShell label="Interest Category" labelHi="आस्वादाची श्रेणी" required error={errors.interestCategory}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.interestCategory}
              onChange={() => {}}
              readOnly
              options={AddTDClosingReinvest_INTEREST_CATEGORY_OPTIONS}
              placeholder="Select Interest Category"
              error={errors.interestCategory}
            />
          </FieldShell>

          <FieldShell label="Birth Date" labelHi="जन्म तारीख" required error={errors.birthDate}>
            <DateInput value={form.birthDate} onChange={() => {}} readOnly error={errors.birthDate} />
          </FieldShell>

          <FieldShell label="Period" labelHi="महिना" required error={errors.interestPeriod}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.interestPeriod}
              onChange={() => {}}
              readOnly
              placeholder="Enter Period"
              error={errors.interestPeriod}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Payment Details"
        titleHi="पेमेंट तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<AddTDClosingReinvest_SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <AddTDClosingReinvest_RadioTwoOption
            label="Mode Of Payment"
            labelHi="पेमेंटची पद्धत"
            options={["Cash", "Transfer"]}
            value={form.modeOfPayment}
            onChange={(v) => updateField("modeOfPayment", v)}
          />

          <FieldShell label="Transfer A/C Code" labelHi="हस्तांतरण खाते संकेतांक" required error={errors.transferAccountCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.transferAccountCode}
                  onChange={(v) => updateField("transferAccountCode", v)}
                  placeholder="Enter Transfer A/C Code"
                  error={errors.transferAccountCode}
                />
              </div>
              <AddTDClosingReinvest_LookupTrigger onClick={() => setTransferAccountPickerOpen(true)} />
            </div>
          </FieldShell>

          <FieldShell label="Account Name" labelHi="खाते नाव" required error={errors.accountName}>
            <TextInput
              icon={<User size={16} />}
              value={form.accountName}
              onChange={() => {}}
              readOnly
              placeholder="Enter Account Name"
              error={errors.accountName}
            />
          </FieldShell>

          <FieldShell label="Amount" labelHi="रक्कम" required error={errors.amount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.amount}
              onChange={() => {}}
              readOnly
              placeholder="Enter Amount"
              error={errors.amount}
            />
          </FieldShell>

          <FieldShell label="Original & Responding" labelHi="मूळ आणि प्रतिसाद देणारे" required error={errors.originalResponding}>
            <TextInput
              icon={<ArrowLeftRight size={16} />}
              value={form.originalResponding}
              onChange={(v) => updateField("originalResponding", v)}
              placeholder="Enter Original & Responding"
              error={errors.originalResponding}
            />
          </FieldShell>

          <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required error={errors.adviceNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.adviceNumber}
              onChange={() => {}}
              readOnly
              placeholder="Enter Advice Number"
              error={errors.adviceNumber}
            />
          </FieldShell>

          <FieldShell label="Advice Date" labelHi="सल्ल्याची तारीख" required error={errors.adviceDate}>
            <DateInput value={form.adviceDate} onChange={() => {}} readOnly error={errors.adviceDate} />
          </FieldShell>
        </div>
      </SectionCard>

      {showNominee && (
      <div className="relative">
        <button
          type="button"
          onClick={handleDeleteNominee}
          aria-label="Delete Nominee"
          className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
        >
          <Trash2 size={16} />
        </button>
      <SectionCard
        titleEn="Nominee 1"
        titleHi="नॉमिनी 1"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<AddTDClosingReinvest_SectionIcon />}
      >
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <FieldShell label="Sr No">
              <SrNoBadge
                value={1}
                className="h-12 min-w-[2.25rem] rounded-lg border-[#6A7282] bg-[#F3F4F6] shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
              />
            </FieldShell>

            <FieldShell label="Salutation Code" labelHi="संबोधनी" required error={errors.nomineeSalutationCode}>
              <SelectInput
                icon={<User size={16} />}
                value={form.nomineeSalutationCode}
                onChange={(v) => updateField("nomineeSalutationCode", v)}
                options={AddTDClosingReinvest_SALUTATION_OPTIONS}
                placeholder="Select Salutation Code"
                error={errors.nomineeSalutationCode}
              />
            </FieldShell>

            <FieldShell label="Nominee Customer ID" labelHi="नॉमिनी ग्राहक आयडी" required error={errors.nomineeCustomerId}>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput
                    icon={<IdCard size={16} />}
                    value={form.nomineeCustomerId}
                    onChange={(v) => updateField("nomineeCustomerId", v)}
                    placeholder="Enter Nominee Customer ID"
                    error={errors.nomineeCustomerId}
                  />
                </div>
                <AddTDClosingReinvest_LookupTrigger onClick={() => setNomineeCustomerPickerOpen(true)} />
              </div>
            </FieldShell>

            <FieldShell label="Nominee Name" labelHi="नॉमिनी नाव" required error={errors.nomineeName}>
              <TextInput
                icon={<User size={16} />}
                value={form.nomineeName}
                onChange={() => {}}
                readOnly
                placeholder="Enter Nominee Name"
                error={errors.nomineeName}
              />
            </FieldShell>
          </div>

          <div className={`${grid4}`}>
            <FieldShell label="Relation" labelHi="नाते" required error={errors.nomineeRelation}>
              <SelectInput
                icon={<Users size={16} />}
                value={form.nomineeRelation}
                onChange={(v) => updateField("nomineeRelation", v)}
                options={AddTDClosingReinvest_RELATION_OPTIONS}
                placeholder="Select Relation"
                error={errors.nomineeRelation}
              />
            </FieldShell>

            <FieldShell label="Address 1" labelHi="पत्ता १" required error={errors.nomineeAddress1}>
              <TextInput
                icon={<Home size={16} />}
                value={form.nomineeAddress1}
                onChange={(v) => updateField("nomineeAddress1", v)}
                placeholder="Enter Address 1"
                error={errors.nomineeAddress1}
              />
            </FieldShell>

            <FieldShell label="Address 2" labelHi="पत्ता २" required error={errors.nomineeAddress2}>
              <TextInput
                icon={<Home size={16} />}
                value={form.nomineeAddress2}
                onChange={(v) => updateField("nomineeAddress2", v)}
                placeholder="Enter Address 2"
                error={errors.nomineeAddress2}
              />
            </FieldShell>

            <FieldShell label="Address 3" labelHi="पत्ता ३" error={errors.nomineeAddress3}>
              <TextInput
                icon={<Home size={16} />}
                value={form.nomineeAddress3}
                onChange={(v) => updateField("nomineeAddress3", v)}
                placeholder="Enter Address 3"
                error={errors.nomineeAddress3}
              />
            </FieldShell>
          </div>

          <div className={`${grid4}`}>
            <FieldShell label="Zip" labelHi="पिन कोड" required error={errors.nomineeZip}>
              <TextInput
                icon={<Hash size={16} />}
                value={form.nomineeZip}
                onChange={(v) => updateField("nomineeZip", v)}
                placeholder="Enter Zip"
                error={errors.nomineeZip}
              />
            </FieldShell>

            <FieldShell label="City" labelHi="शहरे" required error={errors.nomineeCity}>
              <SelectInput
                icon={<Building2 size={16} />}
                value={form.nomineeCity}
                onChange={(v) => updateField("nomineeCity", v)}
                options={AddTDClosingReinvest_CITY_OPTIONS}
                placeholder="Select City"
                error={errors.nomineeCity}
              />
            </FieldShell>

            <StatePicklistField
              label="State"
              labelHi="राज्य"
              icon={<MapPin size={16} />}
              value={form.nomineeState}
              onSelect={(s) => updateField("nomineeState", s.stateName)}
              placeholder="Select State"
              required
              error={errors.nomineeState ? "This field is required" : undefined}
            />

            <FieldShell label="Country" labelHi="देश" required error={errors.nomineeCountry}>
              <TextInput
                icon={<Flag size={16} />}
                value={form.nomineeCountry}
                onChange={(v) => updateField("nomineeCountry", v)}
                placeholder="Enter Country"
                error={errors.nomineeCountry}
              />
            </FieldShell>
          </div>
        </div>
      </SectionCard>
      </div>
      )}

      {showJointHolder && (
      <div className="relative">
        <button
          type="button"
          onClick={handleDeleteJointHolder}
          aria-label="Delete Joint Holder"
          className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
        >
          <Trash2 size={16} />
        </button>
      <SectionCard
        titleEn="Joint Holder"
        titleHi="सह-मालक"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<AddTDClosingReinvest_SectionIcon />}
      >
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <FieldShell label="Sr No">
              <SrNoBadge
                value={1}
                className="h-12 min-w-[2.25rem] rounded-lg border-[#6A7282] bg-[#F3F4F6] shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
              />
            </FieldShell>

            <FieldShell label="Salutation Code" labelHi="संबोधनी" required error={errors.jtSalutationCode}>
              <SelectInput
                icon={<User size={16} />}
                value={form.jtSalutationCode}
                onChange={() => {}}
                readOnly
                options={AddTDClosingReinvest_SALUTATION_OPTIONS}
                placeholder="Select Salutation Code"
                error={errors.jtSalutationCode}
              />
            </FieldShell>

            <FieldShell label="J/T Holder Customer ID" labelHi="J/T धारक ग्राहक आयडी" required error={errors.jtHolderCustomerId}>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput
                    icon={<IdCard size={16} />}
                    value={form.jtHolderCustomerId}
                    onChange={() => {}}
                    readOnly
                    placeholder="Enter J/T Holder Customer ID"
                    error={errors.jtHolderCustomerId}
                  />
                </div>
                <AddTDClosingReinvest_LookupTrigger onClick={() => setJtHolderCustomerPickerOpen(true)} />
              </div>
            </FieldShell>

            <FieldShell label="J/T Holder Name" labelHi="J/T धारकाचे नाव" required error={errors.jtHolderName}>
              <TextInput
                icon={<User size={16} />}
                value={form.jtHolderName}
                onChange={() => {}}
                readOnly
                placeholder="Enter J/T Holder Name"
                error={errors.jtHolderName}
              />
            </FieldShell>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FieldShell label="Address 1" labelHi="पत्ता १" required error={errors.jtAddress1}>
              <TextInput
                icon={<Home size={16} />}
                value={form.jtAddress1}
                onChange={() => {}}
                readOnly
                placeholder="Enter Address 1"
                error={errors.jtAddress1}
              />
            </FieldShell>

            <FieldShell label="Address 2" labelHi="पत्ता २" required error={errors.jtAddress2}>
              <TextInput
                icon={<Home size={16} />}
                value={form.jtAddress2}
                onChange={() => {}}
                readOnly
                placeholder="Enter Address 2"
                error={errors.jtAddress2}
              />
            </FieldShell>

            <FieldShell label="Address 3" labelHi="पत्ता ३" error={errors.jtAddress3}>
              <TextInput
                icon={<Home size={16} />}
                value={form.jtAddress3}
                onChange={() => {}}
                readOnly
                placeholder="Enter Address 3"
                error={errors.jtAddress3}
              />
            </FieldShell>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FieldShell label="Zip" labelHi="पिन कोड" required error={errors.jtZip}>
              <TextInput
                icon={<Hash size={16} />}
                value={form.jtZip}
                onChange={() => {}}
                readOnly
                placeholder="Enter Zip"
                error={errors.jtZip}
              />
            </FieldShell>

            <FieldShell label="City" labelHi="शहरे" required error={errors.jtCity}>
              <SelectInput
                icon={<Building2 size={16} />}
                value={form.jtCity}
                onChange={() => {}}
                readOnly
                options={AddTDClosingReinvest_CITY_OPTIONS}
                placeholder="Select City"
                error={errors.jtCity}
              />
            </FieldShell>

            <StatePicklistField
              label="State"
              labelHi="राज्य"
              icon={<MapPin size={16} />}
              value={form.jtState}
              onSelect={(s) => updateField("jtState", s.stateName)}
              placeholder="Select State"
              required
              error={errors.jtState ? "This field is required" : undefined}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FieldShell label="Country" labelHi="देश" required error={errors.jtCountry}>
              <TextInput
                icon={<Flag size={16} />}
                value={form.jtCountry}
                onChange={() => {}}
                readOnly
                placeholder="Enter Country"
                error={errors.jtCountry}
              />
            </FieldShell>
          </div>
        </div>
      </SectionCard>
      </div>
      )}

      {productCodePickerOpen && (
        <ListModal
          title="Product Code"
          columns={[
            { key: "code", label: "Product Code" },
            { key: "name", label: "Name" },
          ]}
          rows={AddTDClosingReinvest_PRODUCT_CODE_ROWS}
          onSelect={handleProductCodeSelect}
          onClose={() => setProductCodePickerOpen(false)}
        />
      )}
      {creditAccountPickerOpen && (
        <ListModal
          title="Credit Account Code"
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Name" },
          ]}
          rows={AddTDClosingReinvest_ACCOUNT_CODE_ROWS}
          onSelect={handleCreditAccountSelect}
          onClose={() => setCreditAccountPickerOpen(false)}
        />
      )}
      {transferAccountPickerOpen && (
        <ListModal
          title="Transfer A/C Code"
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Name" },
          ]}
          rows={AddTDClosingReinvest_ACCOUNT_CODE_ROWS}
          onSelect={handleTransferAccountSelect}
          onClose={() => setTransferAccountPickerOpen(false)}
        />
      )}
      {nomineeCustomerPickerOpen && (
        <ListModal
          title="Nominee Customer"
          columns={[
            { key: "id", label: "Customer ID" },
            { key: "name", label: "Name" },
          ]}
          rows={AddTDClosingReinvest_CUSTOMER_ROWS}
          onSelect={handleNomineeCustomerSelect}
          onClose={() => setNomineeCustomerPickerOpen(false)}
        />
      )}
      {jtHolderCustomerPickerOpen && (
        <ListModal
          title="J/T Holder Customer"
          columns={[
            { key: "id", label: "Customer ID" },
            { key: "name", label: "Name" },
          ]}
          rows={AddTDClosingReinvest_CUSTOMER_ROWS}
          onSelect={handleJtHolderCustomerSelect}
          onClose={() => setJtHolderCustomerPickerOpen(false)}
        />
      )}

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleAccept}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Accept"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Cancel <X size={16} />
        </button>
        <button
          type="button"
          onClick={() => handlePlaceholderAction("Voucher functionality")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Display Vouchers
        </button>
      </div>
    </FormModal>
  );
};


/* ===== from TDClosingReinvestPage.tsx ===== */
const TDClosingReinvestPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen app-page-bg">
      <NavbarCM
        titleEn="TD Closing Reinvest"
        titleHi="टीडी क्लोजिंग रीइनवेस्ट"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Future Models", href: "/futuremodels" },
          { label: "TD Closing Reinvest", href: "/futuremodels/TDClosingReinvest" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="px-3 py-4">
        <AddTDClosingReinvest onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};

export default TDClosingReinvestPage;
