import { useState } from "react";
import { toast } from "react-toastify";
import {
  Grid3x3,
  KeyRound,
  Hash,
  CreditCard,
  User,
  IdCard,
  Settings2,
  FileText,
  Tag,
  Phone,
  Home,
  MapPin,
  Flag,
  Building2,
  Users,
  Plus,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SelectInput, RadioYesNo, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import type { LockerRow } from "./LockerTable";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface LockerFormData {
  cupboardNo: string;
  lockerType: string;
  lockerNumber: string;
  keyNo: string;

  savingAccountCode: string;
  accountName: string;
  customerId: string;
  customerName: string;
  rentPaidTillDate: string;
  modeOfOperation: string;
  lessorAgr: string;
  isNominee: boolean;
  joinOperation: boolean;
  nameOfHire: string;
  category: string;
  mobileNumber: string;
  telephoneRes: string;
  telephoneOffice: string;
  address1: string;
  address2: string;
  address3: string;
  pin: string;
  city: string;
}

export interface LockerPersonRow {
  srNo: number;
  salutationCode: string;
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

const emptyPersonRow = (srNo: number): LockerPersonRow => ({
  srNo,
  salutationCode: "MR",
  name: "",
  relation: "Not Specified",
  address1: "",
  address2: "",
  address3: "",
  zip: "",
  city: "Kolhapur",
  state: "Maharashtra",
  country: "India",
});

export const DEFAULT_LOCKER_FORM_DATA: LockerFormData = {
  cupboardNo: "",
  lockerType: "",
  lockerNumber: "",
  keyNo: "",
  savingAccountCode: "",
  accountName: "",
  customerId: "",
  customerName: "",
  rentPaidTillDate: "",
  modeOfOperation: "",
  lessorAgr: "",
  isNominee: true,
  joinOperation: true,
  nameOfHire: "",
  category: "PUBLIC",
  mobileNumber: "",
  telephoneRes: "",
  telephoneOffice: "",
  address1: "",
  address2: "",
  address3: "",
  pin: "",
  city: "",
};

const TAB1_REQUIRED_KEYS: (keyof LockerFormData)[] = [
  "cupboardNo",
  "lockerType",
  "lockerNumber",
  "savingAccountCode",
  "customerId",
  "lessorAgr",
  "mobileNumber",
  "telephoneRes",
  "telephoneOffice",
  "address1",
  "address2",
  "address3",
  "pin",
  "city",
];

const PERSON_REQUIRED_KEYS: (keyof LockerPersonRow)[] = [
  "salutationCode",
  "name",
  "address1",
  "address2",
  "zip",
  "city",
  "state",
  "country",
];

const SALUTATIONS = ["MR", "MRS", "MS", "DR"];
const RELATIONS = ["Not Specified", "Father", "Mother", "Spouse", "Son", "Daughter", "Brother", "Sister"];
const MODE_OF_OPERATION = ["Chairmen", "Self", "Jointly", "Either or Survivor"];
const CITIES = ["Kolhapur", "Mumbai", "Pune", "Nagpur"];

type PickRow = { code: string; name: string };

const CUPBOARD_LIST: PickRow[] = [
  { code: "1", name: "Cupboard A" },
  { code: "2", name: "Cupboard B" },
  { code: "3", name: "Cupboard C" },
];
const LOCKER_TYPE_LIST: PickRow[] = [
  { code: "401", name: "Small" },
  { code: "402", name: "Medium" },
  { code: "403", name: "Large" },
];
const LOCKER_NUMBER_LIST: PickRow[] = [
  { code: "401", name: "Locker 401" },
  { code: "402", name: "Locker 402" },
  { code: "403", name: "Locker 403" },
];
const ACCOUNT_LIST: PickRow[] = [
  { code: "000245", name: "Devaraddi Mallanagoud" },
  { code: "000246", name: "Akshay Om More" },
  { code: "000247", name: "Priya Sharma" },
];
const CUSTOMER_LIST: PickRow[] = [
  { code: "00012", name: "Akshay Om More" },
  { code: "00015", name: "Priya Sharma" },
  { code: "00021", name: "Rahul Verma" },
];

type PickerField = "cupboardNo" | "lockerType" | "lockerNumber" | "savingAccountCode" | "customerId";

const PICKER_CONFIG: Record<PickerField, { title: string; codeLabel: string; nameLabel: string; rows: PickRow[] }> = {
  cupboardNo: { title: "Cupboard List", codeLabel: "Code", nameLabel: "Cupboard", rows: CUPBOARD_LIST },
  lockerType: { title: "Locker Type List", codeLabel: "Code", nameLabel: "Locker Type", rows: LOCKER_TYPE_LIST },
  lockerNumber: { title: "Locker Number List", codeLabel: "Code", nameLabel: "Locker Number", rows: LOCKER_NUMBER_LIST },
  savingAccountCode: { title: "Account List", codeLabel: "Account Code", nameLabel: "Name", rows: ACCOUNT_LIST },
  customerId: { title: "Customer List", codeLabel: "Customer ID", nameLabel: "Name", rows: CUSTOMER_LIST },
};

/* ------------------------------------------------------------------ */
/*  Small local helpers                                               */
/* ------------------------------------------------------------------ */

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

const AddRowButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
  >
    <Plus size={16} /> Add
  </button>
);

type TabKey = "Locker Account Details" | "Locker Joint Holder Details" | "Locker Nominee Details";
const TABS: TabKey[] = ["Locker Account Details", "Locker Joint Holder Details", "Locker Nominee Details"];

export interface NewLockerRowPayload extends Pick<LockerRow, "lockerType" | "lockerNo" | "cupboardType" | "accountNo" | "accountName" | "customerId"> {}

export interface AddLockerProps {
  onClose: () => void;
  onSave?: (data: NewLockerRowPayload) => void;
}

const AddLocker = ({ onClose, onSave }: AddLockerProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("Locker Account Details");
  const [form, setForm] = useState<LockerFormData>(DEFAULT_LOCKER_FORM_DATA);
  const [jointHolders, setJointHolders] = useState<LockerPersonRow[]>([emptyPersonRow(1)]);
  const [nominees, setNominees] = useState<LockerPersonRow[]>([emptyPersonRow(1)]);

  const [tab1Errors, setTab1Errors] = useState<Partial<Record<keyof LockerFormData, boolean>>>({});
  const [jointHolderErrors, setJointHolderErrors] = useState<Record<string, boolean>>({});
  const [nomineeErrors, setNomineeErrors] = useState<Record<string, boolean>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const updateForm = <K extends keyof LockerFormData>(key: K, value: LockerFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsValidated(false);
  };

  const updateJointHolder = (index: number, patch: Partial<LockerPersonRow>) => {
    setJointHolders((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    setIsValidated(false);
  };

  const updateNominee = (index: number, patch: Partial<LockerPersonRow>) => {
    setNominees((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    setIsValidated(false);
  };

  const removeJointHolder = (index: number) => {
    setJointHolders((prev) => prev.filter((_, i) => i !== index).map((row, i) => ({ ...row, srNo: i + 1 })));
    setJointHolderErrors({});
    setIsValidated(false);
  };

  const removeNominee = (index: number) => {
    setNominees((prev) => prev.filter((_, i) => i !== index).map((row, i) => ({ ...row, srNo: i + 1 })));
    setNomineeErrors({});
    setIsValidated(false);
  };

  const handlePickRow = (row: PickRow) => {
    if (!activePicker) return;
    if (activePicker === "savingAccountCode") {
      updateForm("savingAccountCode", row.code);
      updateForm("accountName", row.name);
    } else if (activePicker === "customerId") {
      updateForm("customerId", row.code);
      updateForm("customerName", row.name);
    } else {
      updateForm(activePicker, row.code);
    }
    setActivePicker(null);
  };

  const validatePersonRows = (rows: LockerPersonRow[]) => {
    const errors: Record<string, boolean> = {};
    rows.forEach((row, i) => {
      PERSON_REQUIRED_KEYS.forEach((key) => {
        errors[`${i}-${key}`] = String(row[key] ?? "").trim() === "";
      });
    });
    return errors;
  };

  const handleValidate = () => {
    const nextTab1Errors: Partial<Record<keyof LockerFormData, boolean>> = {};
    TAB1_REQUIRED_KEYS.forEach((key) => {
      nextTab1Errors[key] = String(form[key] ?? "").trim() === "";
    });
    const nextJointHolderErrors = validatePersonRows(jointHolders);
    const nextNomineeErrors = validatePersonRows(nominees);

    setTab1Errors(nextTab1Errors);
    setJointHolderErrors(nextJointHolderErrors);
    setNomineeErrors(nextNomineeErrors);

    const hasErrors =
      Object.values(nextTab1Errors).some(Boolean) ||
      Object.values(nextJointHolderErrors).some(Boolean) ||
      Object.values(nextNomineeErrors).some(Boolean);

    setIsValidated(!hasErrors);
    if (hasErrors) {
      toast.error("Please fill all required fields before validating.");
    } else {
      toast.success("All fields validated successfully.");
    }
  };

  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    onSave?.({
      lockerType: form.lockerType,
      lockerNo: form.lockerNumber,
      cupboardType: form.cupboardNo,
      accountNo: form.savingAccountCode,
      accountName: form.accountName,
      customerId: form.customerId,
    });
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        title="Locker Added Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  const renderPersonRows = (
    rows: LockerPersonRow[],
    errors: Record<string, boolean>,
    onUpdate: (index: number, patch: Partial<LockerPersonRow>) => void,
    onRemove: (index: number) => void,
    entryLabel: string,
  ) =>
    rows.map((row, i) => (
      <div key={row.srNo} className={`rounded-xl border border-dashed border-primary-200 bg-primary-50/30 p-4 ${i > 0 ? "mt-4" : ""}`}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1F2858]">
            {entryLabel} {row.srNo}
          </span>
          {rows.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} /> Remove
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <FieldShell label="Sr No" variant="large">
          <div className="flex h-12 items-center rounded-lg border border-slate-600 bg-slate-50 px-4 text-sm text-slate-600">{row.srNo}</div>
        </FieldShell>
        <FieldShell label="Salutation Code" labelHi="संबोधनी" required error={errors[`${i}-salutationCode`]}>
          <SelectInput
            icon={<User size={16} />}
            value={row.salutationCode}
            onChange={(v) => onUpdate(i, { salutationCode: v })}
            options={SALUTATIONS}
            error={errors[`${i}-salutationCode`]}
          />
        </FieldShell>
        <FieldShell label="J/T Holder Name" labelHi="J/T धारकाचे नाव" required error={errors[`${i}-name`]}>
          <TextInput
            icon={<User size={16} />}
            value={row.name}
            onChange={(v) => onUpdate(i, { name: v })}
            placeholder="Enter Name"
            error={errors[`${i}-name`]}
          />
        </FieldShell>
        <FieldShell label="Relation" labelHi="ऑपरेशन मोड">
          <SelectInput icon={<Users size={16} />} value={row.relation} onChange={(v) => onUpdate(i, { relation: v })} options={RELATIONS} />
        </FieldShell>

        <FieldShell label="Address 1" labelHi="पत्ता १" required error={errors[`${i}-address1`]}>
          <TextInput icon={<Home size={16} />} value={row.address1} onChange={(v) => onUpdate(i, { address1: v })} error={errors[`${i}-address1`]} />
        </FieldShell>
        <FieldShell label="Address 2" labelHi="पत्ता २" required error={errors[`${i}-address2`]}>
          <TextInput icon={<Home size={16} />} value={row.address2} onChange={(v) => onUpdate(i, { address2: v })} error={errors[`${i}-address2`]} />
        </FieldShell>
        <FieldShell label="Address 3" labelHi="पत्ता ३">
          <TextInput icon={<Home size={16} />} value={row.address3} onChange={(v) => onUpdate(i, { address3: v })} />
        </FieldShell>
        <FieldShell label="Zip" labelHi="पिन कोड" required error={errors[`${i}-zip`]}>
          <TextInput icon={<Home size={16} />} value={row.zip} onChange={(v) => onUpdate(i, { zip: v })} error={errors[`${i}-zip`]} />
        </FieldShell>

        <FieldShell label="City" labelHi="शहरे" required error={errors[`${i}-city`]}>
          <SelectInput icon={<MapPin size={16} />} value={row.city} onChange={(v) => onUpdate(i, { city: v })} options={CITIES} error={errors[`${i}-city`]} />
        </FieldShell>
        <FieldShell label="State" labelHi="राज्य" required error={errors[`${i}-state`]}>
          <TextInput icon={<Building2 size={16} />} value={row.state} onChange={(v) => onUpdate(i, { state: v })} error={errors[`${i}-state`]} />
        </FieldShell>
        <FieldShell label="Country" labelHi="देश" required error={errors[`${i}-country`]}>
          <TextInput icon={<Flag size={16} />} value={row.country} onChange={(v) => onUpdate(i, { country: v })} error={errors[`${i}-country`]} />
        </FieldShell>
        </div>
      </div>
    ));

  return (
    <FormModal
      onClose={onClose}
      titleEn="Locker Account Details"
      titleHi="लॉकर खाते तपशील"
      subtitleEn="All Information's are related to Interest Payment Mark"
      subtitleHi="सर्व माहिती व्याज भरण्याच्या मार्कशी संबंधित आहे"
      headerIcon={<Image src="/td-lot.png" alt="Locker" width={50} height={50} />}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={(t) => setActiveTab(t as TabKey)}
      hideFooter
      maxWidth="max-w-6xl"
    >
      {activeTab === "Locker Account Details" && (
        <>
          <SectionCard titleEn="Locker Type Details" titleHi="लॉकर प्रकार तपशील" subtitleEn="Manage customer's personal and identity information." icon={<SectionIcon />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <FieldShell label="Cupboard No" labelHi="कपाट क्रमांक" required error={tab1Errors.cupboardNo}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<Grid3x3 size={16} />} value={form.cupboardNo} onChange={(v) => updateForm("cupboardNo", v)} error={tab1Errors.cupboardNo} />
                  </div>
                  <LookupTrigger onClick={() => setActivePicker("cupboardNo")} />
                </div>
              </FieldShell>
              <FieldShell label="Locker Type" labelHi="लॉकर प्रकार" required error={tab1Errors.lockerType}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<KeyRound size={16} />} value={form.lockerType} onChange={(v) => updateForm("lockerType", v)} error={tab1Errors.lockerType} />
                  </div>
                  <LookupTrigger onClick={() => setActivePicker("lockerType")} />
                </div>
              </FieldShell>
              <FieldShell label="Locker Number" labelHi="लॉकर नंबर" required error={tab1Errors.lockerNumber}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<Hash size={16} />} value={form.lockerNumber} onChange={(v) => updateForm("lockerNumber", v)} error={tab1Errors.lockerNumber} />
                  </div>
                  <LookupTrigger onClick={() => setActivePicker("lockerNumber")} />
                </div>
              </FieldShell>
              <FieldShell label="Key No" labelHi="कळ क्रमांक">
                <TextInput icon={<KeyRound size={16} />} value={form.keyNo} onChange={(v) => updateForm("keyNo", v)} placeholder="Key No" />
              </FieldShell>
            </div>
          </SectionCard>

          <SectionCard titleEn="Locker Account Details" titleHi="लॉकर खाते तपशील" subtitleEn="Manage customer's personal and identity information." icon={<SectionIcon />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <FieldShell label="Saving Account Code" labelHi="सेविंग अकाउंट कोड" required error={tab1Errors.savingAccountCode}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<CreditCard size={16} />} value={form.savingAccountCode} onChange={(v) => updateForm("savingAccountCode", v)} error={tab1Errors.savingAccountCode} />
                  </div>
                  <LookupTrigger onClick={() => setActivePicker("savingAccountCode")} />
                </div>
              </FieldShell>
              <FieldShell label="Account Name" labelHi="खाते नाव">
                <TextInput icon={<User size={16} />} value={form.accountName} onChange={() => {}} placeholder="Account Name" readOnly />
              </FieldShell>
              <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={tab1Errors.customerId}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<IdCard size={16} />} value={form.customerId} onChange={(v) => updateForm("customerId", v)} error={tab1Errors.customerId} />
                  </div>
                  <LookupTrigger onClick={() => setActivePicker("customerId")} />
                </div>
              </FieldShell>
              <FieldShell label="Customer Name" labelHi="खाते नाव">
                <TextInput icon={<User size={16} />} value={form.customerName} onChange={() => {}} placeholder="Account Name" readOnly />
              </FieldShell>

              <FieldShell label="Rent Paid till Date" labelHi="आजवरचे भाडे भरले">
                <TextInput icon={<CreditCard size={16} />} value={form.rentPaidTillDate} onChange={(v) => updateForm("rentPaidTillDate", v)} placeholder="Rent paid till date" />
              </FieldShell>
              <FieldShell label="Mode of Operation" labelHi="ऑपरेशन मोड">
                <SelectInput icon={<Settings2 size={16} />} value={form.modeOfOperation} onChange={(v) => updateForm("modeOfOperation", v)} options={MODE_OF_OPERATION} />
              </FieldShell>
              <FieldShell label="Lessor Agr" labelHi="भाडेकरू करार" required error={tab1Errors.lessorAgr}>
                <TextInput icon={<FileText size={16} />} value={form.lessorAgr} onChange={(v) => updateForm("lessorAgr", v)} placeholder="Enter Lessor Agreement" error={tab1Errors.lessorAgr} />
              </FieldShell>
              <div className="flex items-end pb-2.5">
                <RadioYesNo label="Is Nominee" labelHi="नोंदणीकृत व्यक्ती आहे" value={form.isNominee} onChange={(v) => updateForm("isNominee", v)} />
              </div>
            </div>

            <div className="mt-4">
              <RadioYesNo label="Join Operation" labelHi="ऑपरेशनमध्ये सहभागी व्हा" value={form.joinOperation} onChange={(v) => updateForm("joinOperation", v)} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
              <FieldShell label="Name of hire" labelHi="खाते नाव">
                <TextInput icon={<User size={16} />} value={form.nameOfHire} onChange={(v) => updateForm("nameOfHire", v)} placeholder="Name of hire" />
              </FieldShell>
              <FieldShell label="Category" labelHi="वर्ग">
                <TextInput icon={<Tag size={16} />} value={form.category} onChange={() => {}} readOnly />
              </FieldShell>
              <FieldShell label="Mobile Number" required error={tab1Errors.mobileNumber}>
                <TextInput icon={<Phone size={16} />} value={form.mobileNumber} onChange={(v) => updateForm("mobileNumber", v)} placeholder="Enter Mobile Number" error={tab1Errors.mobileNumber} />
              </FieldShell>
              <FieldShell label="Telephone Res" required error={tab1Errors.telephoneRes}>
                <TextInput icon={<Phone size={16} />} value={form.telephoneRes} onChange={(v) => updateForm("telephoneRes", v)} placeholder="Enter Telephone Res" error={tab1Errors.telephoneRes} />
              </FieldShell>

              <FieldShell label="Telephone Office" required error={tab1Errors.telephoneOffice}>
                <TextInput icon={<Phone size={16} />} value={form.telephoneOffice} onChange={(v) => updateForm("telephoneOffice", v)} placeholder="Enter Telephone Office" error={tab1Errors.telephoneOffice} />
              </FieldShell>
              <FieldShell label="Address 1" required error={tab1Errors.address1}>
                <TextInput icon={<Home size={16} />} value={form.address1} onChange={(v) => updateForm("address1", v)} placeholder="Address 1" error={tab1Errors.address1} />
              </FieldShell>
              <FieldShell label="Address 2" required error={tab1Errors.address2}>
                <TextInput icon={<Home size={16} />} value={form.address2} onChange={(v) => updateForm("address2", v)} placeholder="Address 2" error={tab1Errors.address2} />
              </FieldShell>
              <FieldShell label="Address 3" required error={tab1Errors.address3}>
                <TextInput icon={<Home size={16} />} value={form.address3} onChange={(v) => updateForm("address3", v)} placeholder="Address 3" error={tab1Errors.address3} />
              </FieldShell>

              <FieldShell label="Pin" required error={tab1Errors.pin}>
                <TextInput icon={<Hash size={16} />} value={form.pin} onChange={(v) => updateForm("pin", v)} placeholder="Pincode" error={tab1Errors.pin} />
              </FieldShell>
              <FieldShell label="City" required error={tab1Errors.city}>
                <TextInput icon={<MapPin size={16} />} value={form.city} onChange={(v) => updateForm("city", v)} placeholder="City" error={tab1Errors.city} />
              </FieldShell>
            </div>
          </SectionCard>
        </>
      )}

      {activeTab === "Locker Joint Holder Details" && (
        <>
          <SectionCard titleEn="Locker Type Details" titleHi="लॉकर प्रकार तपशील" subtitleEn="Manage customer's personal and identity information." icon={<SectionIcon />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <FieldShell label="Locker Type" labelHi="लॉकर प्रकार" required error={tab1Errors.lockerType}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<KeyRound size={16} />} value={form.lockerType} onChange={(v) => updateForm("lockerType", v)} error={tab1Errors.lockerType} />
                  </div>
                  <LookupTrigger onClick={() => setActivePicker("lockerType")} />
                </div>
              </FieldShell>
              <FieldShell label="Locker Number" labelHi="लॉकर नंबर">
                <TextInput icon={<Hash size={16} />} value={form.lockerNumber} onChange={(v) => updateForm("lockerNumber", v)} />
              </FieldShell>
              <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={tab1Errors.customerId}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<IdCard size={16} />} value={form.customerId} onChange={(v) => updateForm("customerId", v)} error={tab1Errors.customerId} />
                  </div>
                  <LookupTrigger onClick={() => setActivePicker("customerId")} />
                </div>
              </FieldShell>
              <FieldShell label="Customer Name" labelHi="खाते नाव">
                <TextInput icon={<User size={16} />} value={form.customerName} onChange={() => {}} placeholder="Account Name" readOnly />
              </FieldShell>
            </div>
          </SectionCard>

          <SectionCard
            titleEn="Joint Holder Details"
            titleHi="सहधारक तपशील"
            subtitleEn="Manage customer's personal and identity information."
            icon={<SectionIcon />}
            headerAction={<AddRowButton onClick={() => setJointHolders((prev) => [...prev, emptyPersonRow(prev.length + 1)])} />}
          >
            {renderPersonRows(jointHolders, jointHolderErrors, updateJointHolder, removeJointHolder, "Joint Holder")}
          </SectionCard>
        </>
      )}

      {activeTab === "Locker Nominee Details" && (
        <>
          <SectionCard titleEn="Locker Type Details" titleHi="लॉकर प्रकार तपशील" subtitleEn="Manage customer's personal and identity information." icon={<SectionIcon />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <FieldShell label="Locker Type" labelHi="लॉकर प्रकार" required error={tab1Errors.lockerType}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<KeyRound size={16} />} value={form.lockerType} onChange={(v) => updateForm("lockerType", v)} error={tab1Errors.lockerType} />
                  </div>
                  <LookupTrigger onClick={() => setActivePicker("lockerType")} />
                </div>
              </FieldShell>
              <FieldShell label="Locker Number" labelHi="लॉकर नंबर">
                <TextInput icon={<Hash size={16} />} value={form.lockerNumber} onChange={(v) => updateForm("lockerNumber", v)} />
              </FieldShell>
              <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={tab1Errors.customerId}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<IdCard size={16} />} value={form.customerId} onChange={(v) => updateForm("customerId", v)} error={tab1Errors.customerId} />
                  </div>
                  <LookupTrigger onClick={() => setActivePicker("customerId")} />
                </div>
              </FieldShell>
              <FieldShell label="Customer Name" labelHi="खाते नाव">
                <TextInput icon={<User size={16} />} value={form.customerName} onChange={() => {}} placeholder="Account Name" readOnly />
              </FieldShell>
            </div>
          </SectionCard>

          <SectionCard
            titleEn="Nominee Details"
            titleHi="नामनिर्देशक तपशील"
            subtitleEn="Manage customer's personal and identity information."
            icon={<SectionIcon />}
            headerAction={<AddRowButton onClick={() => setNominees((prev) => [...prev, emptyPersonRow(prev.length + 1)])} />}
          >
            {renderPersonRows(nominees, nomineeErrors, updateNominee, removeNominee, "Nominee")}
          </SectionCard>
        </>
      )}

      <div className="mt-2 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleValidate}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          Validate
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
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            isValidated ? "bg-primary-100 text-primary hover:bg-primary-200" : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          Save
        </button>
      </div>

      {activePicker && (
        <ListModal
          title={PICKER_CONFIG[activePicker].title}
          columns={[
            { key: "code", label: PICKER_CONFIG[activePicker].codeLabel },
            { key: "name", label: PICKER_CONFIG[activePicker].nameLabel },
          ]}
          rows={PICKER_CONFIG[activePicker].rows}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default AddLocker;
