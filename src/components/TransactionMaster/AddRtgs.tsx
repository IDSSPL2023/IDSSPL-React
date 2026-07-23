import { IMAGES } from "@/assets";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import {
  User,
  CreditCard,
  IndianRupee,
  FileText,
  Hash,
  MoreVertical,
  Check,
  X,
  MapPin,
  Phone,
  Mail,
  Landmark,
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
import ListModal from "@/components/AccountMaster/ListModal";
import StatePicklistField from "@/components/common/StatePicklistField";

const TRANSACTION_MODE_OPTIONS = ["Cash", "Transfer", "Cheque"];
const TRANSACTION_TYPE_OPTIONS = ["RTGS", "NEFT"];
const GL_OUTLIST_DESCRIPTIONS = ["RTGS Outlist", "NEFT Outlist", "Fund Transfer Outlist"];
const CHEQUE_TYPE_OPTIONS = ["Cheque", "DD"];

type AccountPickRow = { code: string; name: string };
type OutlistPickRow = { code: string; name: string };
type GlDocPickRow = { code: string; name: string };
type ServiceTaxPickRow = { code: string; name: string };
type IfscPickRow = {
  code: string;
  bank: string;
  branch: string;
  center: string;
  district: string;
  state: string;
  address: string;
};

/** Same pick-list shape as Transaction Master's account lookup (Account Code + Name). */
const ACCOUNT_PICK_LIST: AccountPickRow[] = [
  { code: "0002", name: "State Bank Of India" },
  { code: "0003", name: "Bank Of Baroda" },
  { code: "0004", name: "HDFC Bank" },
];

const OUTLIST_SERIAL_LIST: OutlistPickRow[] = [
  { code: "45", name: "RTGS Outlist" },
  { code: "46", name: "NEFT Outlist" },
];

const GL_OUTLIST_DOC_LIST: GlDocPickRow[] = [
  { code: "DOC-9981", name: "RTGS Doc Register" },
  { code: "DOC-9982", name: "NEFT Doc Register" },
];

const SERVICE_TAX_LIST: ServiceTaxPickRow[] = [
  { code: "0", name: "Nil Rated" },
  { code: "3", name: "GST 3%" },
  { code: "5", name: "GST 5%" },
  { code: "12", name: "GST 12%" },
  { code: "18", name: "GST 18%" },
];

const IFSC_PICK_LIST: IfscPickRow[] = [
  {
    code: "IBKL0107IBP",
    bank: "Billagi",
    branch: "Hubli Branch",
    center: "Hubli",
    district: "Dharwad",
    state: "Karnataka",
    address: "Main Road, Hubli",
  },
  {
    code: "SBIN0001234",
    bank: "State Bank Of India",
    branch: "MG Road Branch",
    center: "Hubli",
    district: "Dharwad",
    state: "Karnataka",
    address: "MG Road, Hubli",
  },
];

type PickerField = "accountCode" | "outlistSerial" | "glOutlistDocNo" | "ifscCode" | "serviceTax";

export interface RtgsFormData {
  // Section 1 — RTGS Details
  transactionMode: string;
  transactionType: string;
  scrollNumber: string;

  // Section 2 — Transfer Details
  accountCode: string;
  accountName: string;
  ledgerBalance: string;
  availableBalance: string;
  newLedgerBalance: string;
  transferAddress1: string;
  transferAddress2: string;
  transferAddress3: string;
  outlistSerial: string;
  glOutlistDescription: string;
  glOutlistDocNo: string;
  chequeType: string;
  chequeSeries: string;
  chequeNumber: string;
  chequeDate: string;

  // Section 3 — Cash Details
  nameOfApplicant: string;
  cashAddress1: string;
  cashAddress2: string;
  cashAddress3: string;

  // Section 4 — Remitter Details
  remittingBankIfscCode: string;
  applicationContactNo: string;
  residence: string;
  office: string;
  applicationEmailId: string;

  // Section 5 — Beneficiary Details
  beneficiaryName: string;
  beneficiaryAccountCode: string;
  ifscCode: string;
  ifscBankName: string;
  ifscBranchName: string;
  ifscCenterName: string;
  ifscDistrictName: string;
  ifscStateName: string;
  ifscAddress: string;
  beneficiaryContactNo: string;
  beneficiaryAddress1: string;
  beneficiaryAddress2: string;
  zip: string;
  city: string;
  state: string;
  senderToReceiverInfo: string;

  // Section 6 — Payment Details
  remittingAmount: string;
  applicableCharges: string;
  serviceTax: string;
  totalAmount: string;
}

/** Reusable dummy data — used to prefill the form on open (backend not ready). */
export const DEFAULT_RTGS_DATA: RtgsFormData = {
  transactionMode: "Cash",
  transactionType: "NEFT",
  scrollNumber: "12",

  accountCode: "0002",
  accountName: "State Bank Of India",
  ledgerBalance: "250000",
  availableBalance: "250000",
  newLedgerBalance: "250000",
  transferAddress1: "12, MG Road",
  transferAddress2: "Near City Mall",
  transferAddress3: "Hubli, Karnataka",
  outlistSerial: "45",
  glOutlistDescription: "RTGS Outlist",
  glOutlistDocNo: "DOC-9981",
  chequeType: "Cheque",
  chequeSeries: "CHQ-A",
  chequeNumber: "004521",
  chequeDate: "2026-07-10",

  nameOfApplicant: "State Bank Of India",
  cashAddress1: "45, Station Road",
  cashAddress2: "Opp. Bus Stand",
  cashAddress3: "Hubli, Karnataka",

  remittingBankIfscCode: "SBIN0001234",
  applicationContactNo: "9876543210",
  residence: "0836-2345678",
  office: "0836-2345000",
  applicationEmailId: "customer@test.com",

  beneficiaryName: "Santa Ram",
  beneficiaryAccountCode: "1234567890",
  ifscCode: "IBKL0107IBP",
  ifscBankName: "Billagi",
  ifscBranchName: "Hubli Branch",
  ifscCenterName: "Hubli",
  ifscDistrictName: "Dharwad",
  ifscStateName: "Karnataka",
  ifscAddress: "Main Road, Hubli",
  beneficiaryContactNo: "9123456780",
  beneficiaryAddress1: "56, Lakshmi Nagar",
  beneficiaryAddress2: "Near Temple",
  zip: "580001",
  city: "Hubli",
  state: "Karnataka",
  senderToReceiverInfo: "Fund Transfer",

  remittingAmount: "250000",
  applicableCharges: "25",
  serviceTax: "5",
  totalAmount: "250030",
};

const TEXT_FIELD_KEYS: (keyof RtgsFormData)[] = [
  "transactionMode",
  "transactionType",
  "scrollNumber",
  "accountCode",
  "accountName",
  "ledgerBalance",
  "availableBalance",
  "newLedgerBalance",
  "transferAddress1",
  "transferAddress2",
  "transferAddress3",
  "outlistSerial",
  "glOutlistDescription",
  "glOutlistDocNo",
  "chequeType",
  "chequeSeries",
  "chequeNumber",
  "chequeDate",
  "nameOfApplicant",
  "cashAddress1",
  "cashAddress2",
  "cashAddress3",
  "remittingBankIfscCode",
  "applicationContactNo",
  "residence",
  "office",
  "applicationEmailId",
  "beneficiaryName",
  "beneficiaryAccountCode",
  "ifscCode",
  "ifscBankName",
  "ifscBranchName",
  "ifscCenterName",
  "ifscDistrictName",
  "ifscStateName",
  "ifscAddress",
  "beneficiaryContactNo",
  "beneficiaryAddress1",
  "beneficiaryAddress2",
  "zip",
  "city",
  "state",
  "senderToReceiverInfo",
  "remittingAmount",
  "applicableCharges",
  "serviceTax",
  "totalAmount",
];

/** Same validation approach used by Transaction Master's sibling forms (TL Disbursement, Transfer). */
const validateRtgs = (data: RtgsFormData): Record<keyof RtgsFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof RtgsFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  return errors;
};

/** Simulated save — no backend yet. */
const saveRtgs = (data: RtgsFormData) =>
  new Promise<RtgsFormData>((resolve) => setTimeout(() => resolve(data), 600));

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

export interface AddRtgsProps {
  onClose: () => void;
  onSave?: (data: RtgsFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddRtgs = ({ onClose, onSave, variant = "modal" }: AddRtgsProps) => {
  const [form, setForm] = useState<RtgsFormData>(DEFAULT_RTGS_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RtgsFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const markDirty = (field: keyof RtgsFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof RtgsFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const openPicker = (field: PickerField) => setActivePicker(field);

  const handlePickAccount = (row: AccountPickRow) => {
    markDirty("accountCode");
    markDirty("accountName");
    setForm((f) => ({ ...f, accountCode: row.code, accountName: row.name }));
    setActivePicker(null);
  };

  const handlePickOutlist = (row: OutlistPickRow) => {
    markDirty("outlistSerial");
    setForm((f) => ({ ...f, outlistSerial: row.code }));
    setActivePicker(null);
  };

  const handlePickGlDoc = (row: GlDocPickRow) => {
    markDirty("glOutlistDocNo");
    setForm((f) => ({ ...f, glOutlistDocNo: row.code }));
    setActivePicker(null);
  };

  const handlePickServiceTax = (row: ServiceTaxPickRow) => {
    markDirty("serviceTax");
    setForm((f) => ({ ...f, serviceTax: row.code }));
    setActivePicker(null);
  };

  const handlePickIfsc = (row: IfscPickRow) => {
    (["ifscCode", "ifscBankName", "ifscBranchName", "ifscCenterName", "ifscDistrictName", "ifscStateName", "ifscAddress"] as const).forEach(
      markDirty
    );
    setForm((f) => ({
      ...f,
      ifscCode: row.code,
      ifscBankName: row.bank,
      ifscBranchName: row.branch,
      ifscCenterName: row.center,
      ifscDistrictName: row.district,
      ifscStateName: row.state,
      ifscAddress: row.address,
    }));
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors = validateRtgs(form);
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
    await saveRtgs(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_RTGS_DATA);
    setErrors({});
    setIsValidated(false);
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
        title="RTGS Transaction Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="RTGS"
      titleHi="आरटीजीएस"
      subtitleEn="Fill in the RTGS transaction details below."
      subtitleHi="खालील आरटीजीएस व्यवहाराचा तपशील भरा."
      headerIcon={<Image src={IMAGES.RTGS} alt="RTGS" width={50} height={50} />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
    >
      <SectionCard
        titleEn="RTGS Details"
        titleHi="आरटीजीएस तपशील"
        subtitleEn="Select the transaction mode and type before processing the RTGS transaction."
        subtitleHi="व्यवहार सुरू करण्यापूर्वी व्यवहाराचा प्रकार व पद्धत निवडा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Transaction Mode" labelHi="व्यवहार पद्धत" required error={errors.transactionMode}>
            <SelectInput
              icon={<CreditCard size={16} />}
              value={form.transactionMode}
              onChange={(v) => updateField("transactionMode", v)}
              options={TRANSACTION_MODE_OPTIONS}
              placeholder="Select Transaction Mode"
              error={errors.transactionMode}
            />
          </FieldShell>

          <FieldShell label="Transaction Type" labelHi="व्यवहाराचा प्रकार" required error={errors.transactionType}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.transactionType}
              onChange={(v) => updateField("transactionType", v)}
              options={TRANSACTION_TYPE_OPTIONS}
              placeholder="Select Transaction Type"
              error={errors.transactionType}
            />
          </FieldShell>

          <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required error={errors.scrollNumber}>
            <TextInput icon={<Hash size={16} />} value={form.scrollNumber} onChange={() => {}} readOnly error={errors.scrollNumber} />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Transfer Details"
        titleHi="हस्तांतरण तपशील"
        subtitleEn="Search and verify the account before initiating the RTGS transfer."
        subtitleHi="आरटीजीएस हस्तांतरणापूर्वी खात्याची माहिती तपासा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Account Code" labelHi="खाते कोड" required error={errors.accountCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.accountCode}
                  onChange={(v) => updateField("accountCode", v)}
                  placeholder="Enter Account Code"
                  error={errors.accountCode}
                />
              </div>
              <LookupTrigger onClick={() => openPicker("accountCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Account Name" labelHi="खात्याचे नाव" required error={errors.accountName}>
            <TextInput
              icon={<User size={16} />}
              value={form.accountName}
              onChange={(v) => updateField("accountName", v)}
              placeholder="Enter Account Name"
              error={errors.accountName}
            />
          </FieldShell>

          <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required error={errors.ledgerBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.ledgerBalance}
              onChange={(v) => updateField("ledgerBalance", v)}
              placeholder="Enter Ledger Balance"
              error={errors.ledgerBalance}
            />
          </FieldShell>

          <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required error={errors.availableBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.availableBalance}
              onChange={(v) => updateField("availableBalance", v)}
              placeholder="Enter Available Balance"
              error={errors.availableBalance}
            />
          </FieldShell>

          <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required error={errors.newLedgerBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.newLedgerBalance}
              onChange={(v) => updateField("newLedgerBalance", v)}
              placeholder="Enter New Ledger Balance"
              error={errors.newLedgerBalance}
            />
          </FieldShell>

          <FieldShell label="Address 1" labelHi="पत्ता १" required error={errors.transferAddress1}>
            <TextInput
              icon={<MapPin size={16} />}
              value={form.transferAddress1}
              onChange={(v) => updateField("transferAddress1", v)}
              placeholder="Enter Address 1"
              error={errors.transferAddress1}
            />
          </FieldShell>

          <FieldShell label="Address 2" labelHi="पत्ता २" required error={errors.transferAddress2}>
            <TextInput
              icon={<MapPin size={16} />}
              value={form.transferAddress2}
              onChange={(v) => updateField("transferAddress2", v)}
              placeholder="Enter Address 2"
              error={errors.transferAddress2}
            />
          </FieldShell>

          <FieldShell label="Address 3" labelHi="पत्ता ३" required error={errors.transferAddress3}>
            <TextInput
              icon={<MapPin size={16} />}
              value={form.transferAddress3}
              onChange={(v) => updateField("transferAddress3", v)}
              placeholder="Enter Address 3"
              error={errors.transferAddress3}
            />
          </FieldShell>

          <FieldShell label="Outlist Serial" labelHi="आऊटलिस्ट अनुक्रमांक" required error={errors.outlistSerial}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.outlistSerial}
                  onChange={(v) => updateField("outlistSerial", v)}
                  placeholder="Enter Outlist Serial"
                  error={errors.outlistSerial}
                />
              </div>
              <LookupTrigger onClick={() => openPicker("outlistSerial")} />
            </div>
          </FieldShell>

          <FieldShell label="GL Outlist Description" labelHi="जीएल आऊटलिस्ट वर्णन" required error={errors.glOutlistDescription}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.glOutlistDescription}
              onChange={(v) => updateField("glOutlistDescription", v)}
              options={GL_OUTLIST_DESCRIPTIONS}
              placeholder="Select GL Outlist Description"
              error={errors.glOutlistDescription}
            />
          </FieldShell>

          <FieldShell label="GL Outlist Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required error={errors.glOutlistDocNo}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<FileText size={16} />}
                  value={form.glOutlistDocNo}
                  onChange={(v) => updateField("glOutlistDocNo", v)}
                  placeholder="Enter GL Outlist Doc No"
                  error={errors.glOutlistDocNo}
                />
              </div>
              <LookupTrigger onClick={() => openPicker("glOutlistDocNo")} />
            </div>
          </FieldShell>

          <FieldShell label="Cheque Type" labelHi="धनादेश प्रकार" required error={errors.chequeType}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.chequeType}
              onChange={(v) => updateField("chequeType", v)}
              options={CHEQUE_TYPE_OPTIONS}
              placeholder="Select Cheque Type"
              error={errors.chequeType}
            />
          </FieldShell>

          <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required error={errors.chequeSeries}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.chequeSeries}
              onChange={(v) => updateField("chequeSeries", v)}
              placeholder="Enter Cheque Series"
              error={errors.chequeSeries}
            />
          </FieldShell>

          <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required error={errors.chequeNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.chequeNumber}
              onChange={(v) => updateField("chequeNumber", v)}
              placeholder="Enter Cheque Number"
              error={errors.chequeNumber}
            />
          </FieldShell>

          <FieldShell label="Cheque Date" labelHi="धनादेश दिनांक" required error={errors.chequeDate}>
            <DateInput value={form.chequeDate} onChange={(v) => updateField("chequeDate", v)} error={errors.chequeDate} />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Cash Details"
        titleHi="रोख तपशील"
        subtitleEn="Enter the applicant's details for a cash-based RTGS transaction."
        subtitleHi="रोख आरटीजीएस व्यवहारासाठी अर्जदाराचा तपशील प्रविष्ट करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Name Of Applicant" labelHi="अर्जदाराचे नाव" required error={errors.nameOfApplicant}>
            <TextInput
              icon={<User size={16} />}
              value={form.nameOfApplicant}
              onChange={(v) => updateField("nameOfApplicant", v)}
              placeholder="Enter Name Of Applicant"
              error={errors.nameOfApplicant}
            />
          </FieldShell>

          <FieldShell label="Address 1" labelHi="पत्ता १" required error={errors.cashAddress1}>
            <TextInput
              icon={<MapPin size={16} />}
              value={form.cashAddress1}
              onChange={(v) => updateField("cashAddress1", v)}
              placeholder="Enter Address 1"
              error={errors.cashAddress1}
            />
          </FieldShell>

          <FieldShell label="Address 2" labelHi="पत्ता २" required error={errors.cashAddress2}>
            <TextInput
              icon={<MapPin size={16} />}
              value={form.cashAddress2}
              onChange={(v) => updateField("cashAddress2", v)}
              placeholder="Enter Address 2"
              error={errors.cashAddress2}
            />
          </FieldShell>

          <FieldShell label="Address 3" labelHi="पत्ता ३" required error={errors.cashAddress3}>
            <TextInput
              icon={<MapPin size={16} />}
              value={form.cashAddress3}
              onChange={(v) => updateField("cashAddress3", v)}
              placeholder="Enter Address 3"
              error={errors.cashAddress3}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Remitter Details"
        titleHi="प्रेषक तपशील"
        subtitleEn="Enter the remitting bank and applicant contact information."
        subtitleHi="प्रेषक बँक व अर्जदार संपर्क माहिती प्रविष्ट करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Remitting Bank IFSC Code" labelHi="प्रेषक बँक आयएफएससी कोड" required error={errors.remittingBankIfscCode}>
            <TextInput
              icon={<Landmark size={16} />}
              value={form.remittingBankIfscCode}
              onChange={(v) => updateField("remittingBankIfscCode", v)}
              placeholder="Enter Remitting Bank IFSC Code"
              error={errors.remittingBankIfscCode}
            />
          </FieldShell>

          <FieldShell label="Application Contact No. (M)" labelHi="अर्ज संपर्क क्रमांक (मो.)" required error={errors.applicationContactNo}>
            <TextInput icon={<Phone size={16} />} value={form.applicationContactNo} onChange={() => {}} readOnly error={errors.applicationContactNo} />
          </FieldShell>

          <FieldShell label="Residence" labelHi="निवासस्थान" required error={errors.residence}>
            <TextInput icon={<Phone size={16} />} value={form.residence} onChange={() => {}} readOnly error={errors.residence} />
          </FieldShell>

          <FieldShell label="Office" labelHi="कार्यालय" required error={errors.office}>
            <TextInput icon={<Phone size={16} />} value={form.office} onChange={() => {}} readOnly error={errors.office} />
          </FieldShell>

          <FieldShell label="Application Email ID" labelHi="अर्ज ईमेल आयडी" required error={errors.applicationEmailId}>
            <TextInput icon={<Mail size={16} />} value={form.applicationEmailId} onChange={() => {}} readOnly error={errors.applicationEmailId} />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Beneficiary Details"
        titleHi="लाभार्थी तपशील"
        subtitleEn="Look up the beneficiary's IFSC code to auto-fill their bank details."
        subtitleHi="लाभार्थीचा बँक तपशील भरण्यासाठी आयएफएससी कोड शोधा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Beneficiary Name" labelHi="लाभार्थीचे नाव" required error={errors.beneficiaryName}>
            <TextInput
              icon={<User size={16} />}
              value={form.beneficiaryName}
              onChange={(v) => updateField("beneficiaryName", v)}
              placeholder="Enter Beneficiary Name"
              error={errors.beneficiaryName}
            />
          </FieldShell>

          <FieldShell label="Beneficiary Account Code" labelHi="लाभार्थी खाते कोड" required error={errors.beneficiaryAccountCode}>
            <TextInput
              icon={<CreditCard size={16} />}
              value={form.beneficiaryAccountCode}
              onChange={(v) => updateField("beneficiaryAccountCode", v)}
              placeholder="Enter Beneficiary Account Code"
              error={errors.beneficiaryAccountCode}
            />
          </FieldShell>

          <FieldShell label="IFSC Code" labelHi="आयएफएससी कोड" required error={errors.ifscCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Landmark size={16} />}
                  value={form.ifscCode}
                  onChange={(v) => updateField("ifscCode", v)}
                  placeholder="Enter IFSC Code"
                  error={errors.ifscCode}
                />
              </div>
              <LookupTrigger onClick={() => openPicker("ifscCode")} />
            </div>
          </FieldShell>

          <FieldShell label="IFSC Bank Name" labelHi="आयएफएससी बँकेचे नाव" required error={errors.ifscBankName}>
            <TextInput icon={<Landmark size={16} />} value={form.ifscBankName} onChange={() => {}} readOnly error={errors.ifscBankName} />
          </FieldShell>

          <FieldShell label="IFSC Branch Name" labelHi="आयएफएससी शाखेचे नाव" required error={errors.ifscBranchName}>
            <TextInput icon={<Landmark size={16} />} value={form.ifscBranchName} onChange={() => {}} readOnly error={errors.ifscBranchName} />
          </FieldShell>

          <FieldShell label="IFSC Center Name" labelHi="आयएफएससी केंद्राचे नाव" required error={errors.ifscCenterName}>
            <TextInput icon={<MapPin size={16} />} value={form.ifscCenterName} onChange={() => {}} readOnly error={errors.ifscCenterName} />
          </FieldShell>

          <FieldShell label="IFSC District Name" labelHi="आयएफएससी जिल्ह्याचे नाव" required error={errors.ifscDistrictName}>
            <TextInput icon={<MapPin size={16} />} value={form.ifscDistrictName} onChange={() => {}} readOnly error={errors.ifscDistrictName} />
          </FieldShell>

          <FieldShell label="IFSC State Name" labelHi="आयएफएससी राज्याचे नाव" required error={errors.ifscStateName}>
            <TextInput icon={<MapPin size={16} />} value={form.ifscStateName} onChange={() => {}} readOnly error={errors.ifscStateName} />
          </FieldShell>

          <FieldShell label="IFSC Address" labelHi="आयएफएससी पत्ता" required error={errors.ifscAddress}>
            <TextInput icon={<MapPin size={16} />} value={form.ifscAddress} onChange={() => {}} readOnly error={errors.ifscAddress} />
          </FieldShell>

          <FieldShell label="Beneficiary Contact No." labelHi="लाभार्थी संपर्क क्रमांक" required error={errors.beneficiaryContactNo}>
            <TextInput icon={<Phone size={16} />} value={form.beneficiaryContactNo} onChange={() => {}} readOnly error={errors.beneficiaryContactNo} />
          </FieldShell>

          <FieldShell label="Beneficiary Address 1" labelHi="लाभार्थी पत्ता १" required error={errors.beneficiaryAddress1}>
            <TextInput icon={<MapPin size={16} />} value={form.beneficiaryAddress1} onChange={() => {}} readOnly error={errors.beneficiaryAddress1} />
          </FieldShell>

          <FieldShell label="Beneficiary Address 2" labelHi="लाभार्थी पत्ता २" required error={errors.beneficiaryAddress2}>
            <TextInput icon={<MapPin size={16} />} value={form.beneficiaryAddress2} onChange={() => {}} readOnly error={errors.beneficiaryAddress2} />
          </FieldShell>

          <FieldShell label="Zip" labelHi="पिन कोड" required error={errors.zip}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.zip}
              onChange={(v) => updateField("zip", v)}
              placeholder="Enter Zip"
              error={errors.zip}
            />
          </FieldShell>

          <FieldShell label="City" labelHi="शहर" required error={errors.city}>
            <TextInput
              icon={<MapPin size={16} />}
              value={form.city}
              onChange={(v) => updateField("city", v)}
              placeholder="Enter City"
              error={errors.city}
            />
          </FieldShell>

          <StatePicklistField
            label="State"
            labelHi="राज्य"
            icon={<MapPin size={16} />}
            value={form.state}
            onSelect={(s) => updateField("state", s.stateName)}
            placeholder="Select State"
            required
            error={errors.state ? "This field is required" : undefined}
          />

          <FieldShell label="Sender To Receiver Info" labelHi="प्रेषक ते प्राप्तकर्ता माहिती" required error={errors.senderToReceiverInfo}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.senderToReceiverInfo}
              onChange={(v) => updateField("senderToReceiverInfo", v)}
              placeholder="Enter Sender To Receiver Info"
              error={errors.senderToReceiverInfo}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Payment Details"
        titleHi="देयक तपशील"
        subtitleEn="Review the remitting amount, charges and tax before saving."
        subtitleHi="जतन करण्यापूर्वी प्रेषित रक्कम, शुल्क व कर तपासा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Remitting Amount" labelHi="प्रेषित रक्कम" required error={errors.remittingAmount}>
            <TextInput icon={<IndianRupee size={16} />} value={form.remittingAmount} onChange={() => {}} readOnly error={errors.remittingAmount} />
          </FieldShell>

          <FieldShell label="Applicable Charges" labelHi="लागू शुल्क" required error={errors.applicableCharges}>
            <TextInput icon={<IndianRupee size={16} />} value={form.applicableCharges} onChange={() => {}} readOnly error={errors.applicableCharges} />
          </FieldShell>

          <FieldShell label="Service Tax" labelHi="सेवा कर" required error={errors.serviceTax}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={form.serviceTax}
                  onChange={(v) => updateField("serviceTax", v)}
                  placeholder="Enter Service Tax"
                  error={errors.serviceTax}
                />
              </div>
              <LookupTrigger onClick={() => openPicker("serviceTax")} />
            </div>
          </FieldShell>

          <FieldShell label="Total Amount" labelHi="एकूण रक्कम" required error={errors.totalAmount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.totalAmount}
              onChange={(v) => updateField("totalAmount", v)}
              placeholder="Enter Total Amount"
              error={errors.totalAmount}
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
          onClick={handleCancel}
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
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {activePicker === "accountCode" && (
        <ListModal
          title="Account List"
          columns={[
            { key: "code", label: "Account Code" },
            { key: "name", label: "Account Name" },
          ]}
          rows={ACCOUNT_PICK_LIST}
          onSelect={handlePickAccount}
          onClose={() => setActivePicker(null)}
        />
      )}

      {activePicker === "outlistSerial" && (
        <ListModal
          title="Outlist Serial List"
          columns={[
            { key: "code", label: "Serial No" },
            { key: "name", label: "Description" },
          ]}
          rows={OUTLIST_SERIAL_LIST}
          onSelect={handlePickOutlist}
          onClose={() => setActivePicker(null)}
        />
      )}

      {activePicker === "glOutlistDocNo" && (
        <ListModal
          title="GL Outlist Doc List"
          columns={[
            { key: "code", label: "Doc No" },
            { key: "name", label: "Description" },
          ]}
          rows={GL_OUTLIST_DOC_LIST}
          onSelect={handlePickGlDoc}
          onClose={() => setActivePicker(null)}
        />
      )}

      {activePicker === "ifscCode" && (
        <ListModal
          title="IFSC Code List"
          columns={[
            { key: "code", label: "IFSC Code" },
            { key: "bank", label: "Bank Name" },
            { key: "branch", label: "Branch Name" },
          ]}
          rows={IFSC_PICK_LIST}
          onSelect={handlePickIfsc}
          onClose={() => setActivePicker(null)}
        />
      )}

      {activePicker === "serviceTax" && (
        <ListModal
          title="Service Tax List"
          columns={[
            { key: "code", label: "Rate" },
            { key: "name", label: "Description" },
          ]}
          rows={SERVICE_TAX_LIST}
          onSelect={handlePickServiceTax}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default AddRtgs;
