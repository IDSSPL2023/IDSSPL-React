import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { ArrowUpDown, ChevronUp, ChevronDown, DoorOpen, ArrowLeftRight, Grid3x3, KeyRound, Hash, CreditCard, User, IdCard, Settings2, FileText, Tag, Phone, Home, MapPin, Flag, Building2, Users, Plus, MoreVertical, Trash2, X, Filter as FilterIcon, ShieldCheck, Calendar, Percent, IndianRupee } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import StatusPill, { type StatusPillTone } from "@/components/shared/StatusPill";
import { IMAGES } from "@/assets";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SelectInput, RadioYesNo, SectionCard, DateInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import Pagination from "@/components/shared/Pagination";
import CustomerIdPicklistField, { CustomerOption } from "@/components/common/CustomerIdPicklistField";
// import CustomerIdPicklistField, { type CustomerOption } from "../common/CustomerIdPicklistField";

/* ===== from LockerTable.tsx ===== */
export interface LockerTable_LockerRow {
  sr: number;
  lockerType: string;
  lockerNo: string;
  status: string;
  cupboardType: string;
  accountNo: string;
  accountName: string;
  customerId: string;
}

type LockerTable_SortableRowKey = Exclude<keyof LockerTable_LockerRow, "sr">;

interface LockerTable_ColumnDef {
  key: string;
  label: string;
  sortKey?: LockerTable_SortableRowKey;
}

type LockerTable_SortDirection = "asc" | "desc";

interface LockerTable_SortConfig {
  key: LockerTable_SortableRowKey;
  direction: LockerTable_SortDirection;
}

const LockerTable_columns: LockerTable_ColumnDef[] = [
  { key: "lockerType", label: "Locker Type", sortKey: "lockerType" },
  { key: "lockerNo", label: "Locker No", sortKey: "lockerNo" },
  { key: "status", label: "Status", sortKey: "status" },
  { key: "cupboardType", label: "Cupboard Type", sortKey: "cupboardType" },
  { key: "accountNo", label: "Account No", sortKey: "accountNo" },
  { key: "accountName", label: "Account Name", sortKey: "accountName" },
  { key: "customerId", label: "Customer ID", sortKey: "customerId" },
];

export const LockerTable_DEFAULT_LOCKER_ROWS: LockerTable_LockerRow[] = [
  { sr: 1, lockerType: "Small", lockerNo: "401", status: "Active", cupboardType: "A", accountNo: "000245", accountName: "Devaraddi Mallanagoud", customerId: "00012" },
  { sr: 2, lockerType: "Medium", lockerNo: "402", status: "Active", cupboardType: "B", accountNo: "000246", accountName: "Akshay Om More", customerId: "00015" },
  { sr: 3, lockerType: "Large", lockerNo: "403", status: "Surrendered", cupboardType: "C", accountNo: "000247", accountName: "Priya Sharma", customerId: "00021" },
];

const LockerTable_STATUS_TONE: Record<string, StatusPillTone> = {
  Active: "success",
  Surrendered: "rejected",
  Pending: "pending",
};

function LockerTable_SortableHeader({ label, active, direction }: { label: string; active: boolean; direction: LockerTable_SortDirection | null }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      {active ? (
        direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
      )}
    </span>
  );
}

export interface LockerTable_LockerTableProps {
  rows?: LockerTable_LockerRow[];
  onSurrender?: (row: LockerTable_LockerRow) => void;
  onTransaction?: (row: LockerTable_LockerRow) => void;
}

function LockerTable({ rows: initialRows = LockerTable_DEFAULT_LOCKER_ROWS, onSurrender, onTransaction }: LockerTable_LockerTableProps) {
  const [sortConfig, setSortConfig] = useState<LockerTable_SortConfig | null>(null);

  const handleSort = (col: LockerTable_ColumnDef) => {
    if (!col.sortKey) return;
    const sortKey = col.sortKey;
    setSortConfig((prev) => {
      if (!prev || prev.key !== sortKey) return { key: sortKey, direction: "asc" };
      if (prev.direction === "asc") return { key: sortKey, direction: "desc" };
      return null;
    });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig) return initialRows;
    const { key, direction } = sortConfig;
    return [...initialRows].sort((a, b) => {
      const aVal = String(a[key] ?? "").toLowerCase();
      const bVal = String(b[key] ?? "").toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [initialRows, sortConfig]);

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Serial No</th>
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Action</th>
              {LockerTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                >
                  <LockerTable_SortableHeader
                    label={col.label}
                    active={sortConfig?.key === col.sortKey}
                    direction={sortConfig && sortConfig.key === col.sortKey ? sortConfig.direction : null}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={LockerTable_columns.length + 2} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              sortedRows.map((r) => (
                <tr key={r.sr} className="bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 align-middle">
                    <SrNoBadge value={r.sr} />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <RowActionMenu
                      menuWidth={224}
                      triggerClassName="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-400"
                      items={[
                        { key: "surrender", label: "Locker Surrender", icon: DoorOpen, onClick: () => onSurrender?.(r) },
                        { key: "transaction", label: "Locker Transaction", icon: ArrowLeftRight, onClick: () => onTransaction?.(r) },
                      ]}
                    />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.lockerType}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.lockerNo}</td>
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    <StatusPill label={r.status} tone={LockerTable_STATUS_TONE[r.status] ?? "neutral"} />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.cupboardType}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.accountNo}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.accountName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.customerId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ===== from AddLocker.tsx ===== */
/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface AddLocker_LockerFormData {
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

export interface AddLocker_LockerPersonRow {
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

const AddLocker_emptyPersonRow = (srNo: number): AddLocker_LockerPersonRow => ({
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

export const AddLocker_DEFAULT_LOCKER_FORM_DATA: AddLocker_LockerFormData = {
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

const AddLocker_TAB1_REQUIRED_KEYS: (keyof AddLocker_LockerFormData)[] = [
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

const AddLocker_PERSON_REQUIRED_KEYS: (keyof AddLocker_LockerPersonRow)[] = [
  "salutationCode",
  "name",
  "address1",
  "address2",
  "zip",
  "city",
  "state",
  "country",
];

const AddLocker_SALUTATIONS = ["MR", "MRS", "MS", "DR"];
const AddLocker_RELATIONS = ["Not Specified", "Father", "Mother", "Spouse", "Son", "Daughter", "Brother", "Sister"];
const AddLocker_MODE_OF_OPERATION = ["Chairmen", "Self", "Jointly", "Either or Survivor"];
const AddLocker_CITIES = ["Kolhapur", "Mumbai", "Pune", "Nagpur"];

type AddLocker_PickRow = { code: string; name: string };

const AddLocker_CUPBOARD_LIST: AddLocker_PickRow[] = [
  { code: "1", name: "Cupboard A" },
  { code: "2", name: "Cupboard B" },
  { code: "3", name: "Cupboard C" },
];
const AddLocker_LOCKER_TYPE_LIST: AddLocker_PickRow[] = [
  { code: "401", name: "Small" },
  { code: "402", name: "Medium" },
  { code: "403", name: "Large" },
];
const AddLocker_LOCKER_NUMBER_LIST: AddLocker_PickRow[] = [
  { code: "401", name: "Locker 401" },
  { code: "402", name: "Locker 402" },
  { code: "403", name: "Locker 403" },
];
const AddLocker_ACCOUNT_LIST: AddLocker_PickRow[] = [
  { code: "000245", name: "Devaraddi Mallanagoud" },
  { code: "000246", name: "Akshay Om More" },
  { code: "000247", name: "Priya Sharma" },
];

type AddLocker_PickerField = "cupboardNo" | "lockerType" | "lockerNumber" | "savingAccountCode";

const AddLocker_PICKER_CONFIG: Record<AddLocker_PickerField, { title: string; codeLabel: string; nameLabel: string; rows: AddLocker_PickRow[] }> = {
  cupboardNo: { title: "Cupboard List", codeLabel: "Code", nameLabel: "Cupboard", rows: AddLocker_CUPBOARD_LIST },
  lockerType: { title: "Locker Type List", codeLabel: "Code", nameLabel: "Locker Type", rows: AddLocker_LOCKER_TYPE_LIST },
  lockerNumber: { title: "Locker Number List", codeLabel: "Code", nameLabel: "Locker Number", rows: AddLocker_LOCKER_NUMBER_LIST },
  savingAccountCode: { title: "Account List", codeLabel: "Account Code", nameLabel: "Name", rows: AddLocker_ACCOUNT_LIST },
};

/* ------------------------------------------------------------------ */
/*  Small local helpers                                               */
/* ------------------------------------------------------------------ */

const AddLocker_LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AddLocker_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AddLocker_AddRowButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
  >
    <Plus size={16} /> Add
  </button>
);

type AddLocker_TabKey = "Locker Account Details" | "Locker Joint Holder Details" | "Locker Nominee Details";
const AddLocker_TABS: AddLocker_TabKey[] = ["Locker Account Details", "Locker Joint Holder Details", "Locker Nominee Details"];

export interface AddLocker_NewLockerRowPayload extends Pick<LockerTable_LockerRow, "lockerType" | "lockerNo" | "cupboardType" | "accountNo" | "accountName" | "customerId"> {}

export interface AddLocker_AddLockerProps {
  onClose: () => void;
  onSave?: (data: AddLocker_NewLockerRowPayload) => void;
}

const AddLocker = ({ onClose, onSave }: AddLocker_AddLockerProps) => {
  const [activeTab, setActiveTab] = useState<AddLocker_TabKey>("Locker Account Details");
  const [form, setForm] = useState<AddLocker_LockerFormData>(AddLocker_DEFAULT_LOCKER_FORM_DATA);
  const [jointHolders, setJointHolders] = useState<AddLocker_LockerPersonRow[]>([AddLocker_emptyPersonRow(1)]);
  const [nominees, setNominees] = useState<AddLocker_LockerPersonRow[]>([AddLocker_emptyPersonRow(1)]);

  const [tab1Errors, setTab1Errors] = useState<Partial<Record<keyof AddLocker_LockerFormData, boolean>>>({});
  const [jointHolderErrors, setJointHolderErrors] = useState<Record<string, boolean>>({});
  const [nomineeErrors, setNomineeErrors] = useState<Record<string, boolean>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePicker, setActivePicker] = useState<AddLocker_PickerField | null>(null);

  const updateForm = <K extends keyof AddLocker_LockerFormData>(key: K, value: AddLocker_LockerFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsValidated(false);
  };

  // Handle customer selection from picklist
  const handleCustomerSelect = (customer: CustomerOption) => {
    updateForm("customerId", customer.customerId);
    updateForm("customerName", customer.customerName);
  };

  const updateJointHolder = (index: number, patch: Partial<AddLocker_LockerPersonRow>) => {
    setJointHolders((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    setIsValidated(false);
  };

  const updateNominee = (index: number, patch: Partial<AddLocker_LockerPersonRow>) => {
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

  const handlePickRow = (row: AddLocker_PickRow) => {
    if (!activePicker) return;
    if (activePicker === "savingAccountCode") {
      updateForm("savingAccountCode", row.code);
      updateForm("accountName", row.name);
    } else {
      updateForm(activePicker, row.code);
    }
    setActivePicker(null);
  };

  const validatePersonRows = (rows: AddLocker_LockerPersonRow[]) => {
    const errors: Record<string, boolean> = {};
    rows.forEach((row, i) => {
      AddLocker_PERSON_REQUIRED_KEYS.forEach((key) => {
        errors[`${i}-${key}`] = String(row[key] ?? "").trim() === "";
      });
    });
    return errors;
  };

  const handleValidate = () => {
    const nextTab1Errors: Partial<Record<keyof AddLocker_LockerFormData, boolean>> = {};
    AddLocker_TAB1_REQUIRED_KEYS.forEach((key) => {
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
    rows: AddLocker_LockerPersonRow[],
    errors: Record<string, boolean>,
    onUpdate: (index: number, patch: Partial<AddLocker_LockerPersonRow>) => void,
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
            options={AddLocker_SALUTATIONS}
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
          <SelectInput icon={<Users size={16} />} value={row.relation} onChange={(v) => onUpdate(i, { relation: v })} options={AddLocker_RELATIONS} />
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
          <SelectInput icon={<MapPin size={16} />} value={row.city} onChange={(v) => onUpdate(i, { city: v })} options={AddLocker_CITIES} error={errors[`${i}-city`]} />
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
      headerIcon={<Image src={IMAGES.TD_LOT} alt="Locker" width={50} height={50} />}
      tabs={AddLocker_TABS}
      activeTab={activeTab}
      onTabChange={(t) => setActiveTab(t as AddLocker_TabKey)}
      hideFooter
      maxWidth="max-w-6xl"
    >
      {activeTab === "Locker Account Details" && (
        <>
          <SectionCard titleEn="Locker Type Details" titleHi="लॉकर प्रकार तपशील" subtitleEn="Manage customer's personal and identity information." icon={<AddLocker_SectionIcon />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <FieldShell label="Cupboard No" labelHi="कपाट क्रमांक" required error={tab1Errors.cupboardNo}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<Grid3x3 size={16} />} value={form.cupboardNo} onChange={(v) => updateForm("cupboardNo", v)} error={tab1Errors.cupboardNo} />
                  </div>
                  <AddLocker_LookupTrigger onClick={() => setActivePicker("cupboardNo")} />
                </div>
              </FieldShell>
              <FieldShell label="Locker Type" labelHi="लॉकर प्रकार" required error={tab1Errors.lockerType}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<KeyRound size={16} />} value={form.lockerType} onChange={(v) => updateForm("lockerType", v)} error={tab1Errors.lockerType} />
                  </div>
                  <AddLocker_LookupTrigger onClick={() => setActivePicker("lockerType")} />
                </div>
              </FieldShell>
              <FieldShell label="Locker Number" labelHi="लॉकर नंबर" required error={tab1Errors.lockerNumber}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<Hash size={16} />} value={form.lockerNumber} onChange={(v) => updateForm("lockerNumber", v)} error={tab1Errors.lockerNumber} />
                  </div>
                  <AddLocker_LookupTrigger onClick={() => setActivePicker("lockerNumber")} />
                </div>
              </FieldShell>
              <FieldShell label="Key No" labelHi="कळ क्रमांक">
                <TextInput icon={<KeyRound size={16} />} value={form.keyNo} onChange={(v) => updateForm("keyNo", v)} placeholder="Key No" />
              </FieldShell>
            </div>
          </SectionCard>

          <SectionCard titleEn="Locker Account Details" titleHi="लॉकर खाते तपशील" subtitleEn="Manage customer's personal and identity information." icon={<AddLocker_SectionIcon />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <FieldShell label="Saving Account Code" labelHi="सेविंग अकाउंट कोड" required error={tab1Errors.savingAccountCode}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<CreditCard size={16} />} value={form.savingAccountCode} onChange={(v) => updateForm("savingAccountCode", v)} error={tab1Errors.savingAccountCode} />
                  </div>
                  <AddLocker_LookupTrigger onClick={() => setActivePicker("savingAccountCode")} />
                </div>
              </FieldShell>
              <FieldShell label="Account Name" labelHi="खाते नाव">
                <TextInput icon={<User size={16} />} value={form.accountName} onChange={() => {}} placeholder="Account Name" readOnly />
              </FieldShell>
              <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={tab1Errors.customerId}>
                <CustomerIdPicklistField
                  label=""
                  value={form.customerId}
                  placeholder="Select Customer"
                  onSelect={handleCustomerSelect}
                  preFetch={false}
                  pageSize={10}
                  error={tab1Errors.customerId ? "This field is required" : ""}
                />
              </FieldShell>
              <FieldShell label="Customer Name" labelHi="खाते नाव">
                <TextInput icon={<User size={16} />} value={form.customerName} onChange={() => {}} placeholder="Account Name" readOnly />
              </FieldShell>

              <FieldShell label="Rent Paid till Date" labelHi="आजवरचे भाडे भरले">
                <TextInput icon={<CreditCard size={16} />} value={form.rentPaidTillDate} onChange={(v) => updateForm("rentPaidTillDate", v)} placeholder="Rent paid till date" />
              </FieldShell>
              <FieldShell label="Mode of Operation" labelHi="ऑपरेशन मोड">
                <SelectInput icon={<Settings2 size={16} />} value={form.modeOfOperation} onChange={(v) => updateForm("modeOfOperation", v)} options={AddLocker_MODE_OF_OPERATION} />
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
          <SectionCard titleEn="Locker Type Details" titleHi="लॉकर प्रकार तपशील" subtitleEn="Manage customer's personal and identity information." icon={<AddLocker_SectionIcon />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <FieldShell label="Locker Type" labelHi="लॉकर प्रकार" required error={tab1Errors.lockerType}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<KeyRound size={16} />} value={form.lockerType} onChange={(v) => updateForm("lockerType", v)} error={tab1Errors.lockerType} />
                  </div>
                  <AddLocker_LookupTrigger onClick={() => setActivePicker("lockerType")} />
                </div>
              </FieldShell>
              <FieldShell label="Locker Number" labelHi="लॉकर नंबर">
                <TextInput icon={<Hash size={16} />} value={form.lockerNumber} onChange={(v) => updateForm("lockerNumber", v)} />
              </FieldShell>
              <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={tab1Errors.customerId}>
                <CustomerIdPicklistField
                  label=""
                  value={form.customerId}
                  placeholder="Select Customer"
                  onSelect={handleCustomerSelect}
                  preFetch={false}
                  pageSize={10}
                  error={tab1Errors.customerId ? "This field is required" : ""}
                />
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
            icon={<AddLocker_SectionIcon />}
            headerAction={<AddLocker_AddRowButton onClick={() => setJointHolders((prev) => [...prev, AddLocker_emptyPersonRow(prev.length + 1)])} />}
          >
            {renderPersonRows(jointHolders, jointHolderErrors, updateJointHolder, removeJointHolder, "Joint Holder")}
          </SectionCard>
        </>
      )}

      {activeTab === "Locker Nominee Details" && (
        <>
          <SectionCard titleEn="Locker Type Details" titleHi="लॉकर प्रकार तपशील" subtitleEn="Manage customer's personal and identity information." icon={<AddLocker_SectionIcon />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <FieldShell label="Locker Type" labelHi="लॉकर प्रकार" required error={tab1Errors.lockerType}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput icon={<KeyRound size={16} />} value={form.lockerType} onChange={(v) => updateForm("lockerType", v)} error={tab1Errors.lockerType} />
                  </div>
                  <AddLocker_LookupTrigger onClick={() => setActivePicker("lockerType")} />
                </div>
              </FieldShell>
              <FieldShell label="Locker Number" labelHi="लॉकर नंबर">
                <TextInput icon={<Hash size={16} />} value={form.lockerNumber} onChange={(v) => updateForm("lockerNumber", v)} />
              </FieldShell>
              <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={tab1Errors.customerId}>
                <CustomerIdPicklistField
                  label=""
                  value={form.customerId}
                  placeholder="Select Customer"
                  onSelect={handleCustomerSelect}
                  preFetch={false}
                  pageSize={10}
                  error={tab1Errors.customerId ? "This field is required" : ""}
                />
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
            icon={<AddLocker_SectionIcon />}
            headerAction={<AddLocker_AddRowButton onClick={() => setNominees((prev) => [...prev, AddLocker_emptyPersonRow(prev.length + 1)])} />}
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
          title={AddLocker_PICKER_CONFIG[activePicker].title}
          columns={[
            { key: "code", label: AddLocker_PICKER_CONFIG[activePicker].codeLabel },
            { key: "name", label: AddLocker_PICKER_CONFIG[activePicker].nameLabel },
          ]}
          rows={AddLocker_PICKER_CONFIG[activePicker].rows}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};


/* ===== from FilterModal.tsx ===== */
const FilterModal_filterOptions = [
  {
    id: "lockerType",
    label: "Locker Type",
    icon: <KeyRound size={18} className="text-primary" />,
    placeholder: "Locker Type",
    inputIcon: <KeyRound size={18} className="text-primary" />,
  },
  {
    id: "lockerNo",
    label: "Locker No",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Locker No",
    inputIcon: <Hash size={18} className="text-primary" />,
  },
  {
    id: "status",
    label: "Status",
    icon: <ShieldCheck size={18} className="text-primary" />,
    placeholder: "Status",
    inputIcon: <ShieldCheck size={18} className="text-primary" />,
  },
  {
    id: "customerId",
    label: "Customer ID",
    icon: <IdCard size={18} className="text-primary" />,
    placeholder: "Customer ID",
    inputIcon: <IdCard size={18} className="text-primary" />,
  },
] as const;

type FilterModal_FilterKey = (typeof FilterModal_filterOptions)[number]["id"];

export type FilterModal_LockerFilters = Record<FilterModal_FilterKey, string>;

type FilterModal_FilterModalProps = {
  onClose: () => void;
  onApply: (filters: FilterModal_LockerFilters) => void;
  initialValues?: FilterModal_LockerFilters;
};

export const FilterModal_defaultLockerFilterValues: FilterModal_LockerFilters = {
  lockerType: "",
  lockerNo: "",
  status: "",
  customerId: "",
};

function FilterModal({ onClose, onApply, initialValues = FilterModal_defaultLockerFilterValues }: FilterModal_FilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<FilterModal_FilterKey>("lockerType");
  const [values, setValues] = useState<FilterModal_LockerFilters>(initialValues);

  const active = FilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  // Handle customer selection from picklist for filter
  const handleCustomerFilterSelect = (customer: CustomerOption) => {
    setValues((prev) => ({ ...prev, customerId: customer.customerId }));
  };

  const handleClearAll = () => {
    setValues(FilterModal_defaultLockerFilterValues);
    onApply(FilterModal_defaultLockerFilterValues);
    onClose();
  };

  const handleApply = () => {
    onApply(values);
    onClose();
  };

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-primary bg-white p-8 dark:bg-slate-900">
      <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-8 top-8 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <X size={18} />
      </button>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary">
          <FilterIcon size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Filter</h2>
          <p className="text-gray-400 dark:text-slate-500">Use filter for fast and efficient searching</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 border-b border-gray-200 dark:border-slate-800" />

      <div className="relative z-10 mt-8 flex items-start gap-0">
        <div className="flex w-full max-w-[470px] flex-col gap-4">
          {FilterModal_filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <div key={option.id} className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveFilter(option.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-[#E8F1FD] dark:bg-slate-800"
                      : "border-primary bg-white dark:bg-slate-900"
                  }`}
                >
                  {option.icon}
                  <span className="text-lg font-medium text-gray-900 dark:text-slate-100">{option.label}</span>
                </button>

                {isActive && (
                  <div className="absolute -right-9 flex h-10 w-10 items-center justify-center">
                    <div className="h-0 w-0 border-y-[18px] border-l-[24px] border-y-transparent border-l-[#DCEBFC] dark:border-l-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ml-10 w-[800px] rounded-2xl bg-[#DCEBFC] p-6 h-[220px] flex flex-col justify-center dark:bg-slate-800">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-slate-100">{active?.label}</h3>
          {activeFilter === "status" ? (
            <div className="flex items-center gap-6">
              {(["Active", "Surrendered", "Pending"] as const).map((opt) => (
                <label key={opt} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
                    checked={values.status === opt}
                    onChange={() => setValues((prev) => ({ ...prev, status: opt }))}
                  />
                  <span className="ml-2 text-gray-900 dark:text-slate-100">{opt}</span>
                </label>
              ))}
              {values.status && (
                <button
                  type="button"
                  onClick={() => setValues((prev) => ({ ...prev, status: "" }))}
                  className="text-sm font-medium text-primary underline hover:text-[#0a56aa]"
                >
                  Clear
                </button>
              )}
            </div>
          ) : activeFilter === "customerId" ? (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <CustomerIdPicklistField
                  label=""
                  value={values.customerId}
                  placeholder="Select Customer"
                  onSelect={handleCustomerFilterSelect}
                  preFetch={false}
                  pageSize={10}
                />
              </div>
              {values.customerId && (
                <button
                  type="button"
                  onClick={() => setValues((prev) => ({ ...prev, customerId: "" }))}
                  className="text-sm font-medium text-primary underline hover:text-[#0a56aa]"
                >
                  Clear
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-4 py-3 dark:bg-slate-900">
              {active?.inputIcon}
              <input
                type="text"
                value={values[activeFilter]}
                onChange={handleChange}
                placeholder={active?.placeholder}
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-10 flex justify-center gap-4">
        <button
          type="button"
          onClick={handleClearAll}
          className="rounded-full border border-primary px-8 py-3 font-semibold text-primary hover:bg-[#F2F8FE]"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="rounded-full bg-primary px-10 py-3 font-semibold text-white hover:bg-[#0a56aa]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}


/* ===== from LockerSurrenderModal.tsx ===== */
interface LockerSurrenderModal_SurrenderFormData {
  scrollNumber: string;
  nameOfHire: string;
  hireDate: string;
  period: string;
  completedPeriodInMonths: string;
  reviewDate: string;
  rentFromDate: string;
  rentToDate: string;
  transactionDate: string;
  serviceTax: string;
  amount: string;
  lockerRentPerMonth: string;
  transactionMode: "Cash" | "Transfer";
  debitAcCode: string;
  name: string;
  status: string;
}

type LockerSurrenderModal_PickRow = { code: string; name: string };

const LockerSurrenderModal_DEBIT_AC_LIST: LockerSurrenderModal_PickRow[] = [
  { code: "000245", name: "Devaraddi Mallanagoud" },
  { code: "000246", name: "Akshay Om More" },
  { code: "000247", name: "Priya Sharma" },
];

const LockerSurrenderModal_buildInitialData = (row: LockerTable_LockerRow): LockerSurrenderModal_SurrenderFormData => ({
  scrollNumber: "",
  nameOfHire: row.accountName,
  hireDate: "12-May-2026",
  period: "12",
  completedPeriodInMonths: "158",
  reviewDate: "12-May-2026",
  rentFromDate: "2026-05-12",
  rentToDate: "2026-05-12",
  transactionDate: "12-May-2026",
  serviceTax: "0.0%",
  amount: "12,349",
  lockerRentPerMonth: "0.0%",
  transactionMode: "Transfer",
  debitAcCode: "",
  name: "",
  status: row.status,
});

const LockerSurrenderModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const LockerSurrenderModal_RadioTransactionMode = ({ value, onChange }: { value: "Cash" | "Transfer"; onChange: (v: "Cash" | "Transfer") => void }) => (
  <div className="last:mb-0 flex items-center gap-2">
    <label className="large block text-sm font-medium text-[#1F2858]">
      Transaction Mode <span className="text-slate-600">/ आर्थिक व्यवहार मोड</span>
    </label>
    <div className="flex items-center gap-4 pt-1">
      {(["Cash", "Transfer"] as const).map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="radio" checked={value === opt} onChange={() => onChange(opt)} className="h-4 w-4 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export interface LockerSurrenderModal_LockerSurrenderModalProps {
  row: LockerTable_LockerRow;
  onClose: () => void;
  onSave?: (data: LockerSurrenderModal_SurrenderFormData) => void;
}

const LockerSurrenderModal = ({ row, onClose, onSave }: LockerSurrenderModal_LockerSurrenderModalProps) => {
  const [form, setForm] = useState<LockerSurrenderModal_SurrenderFormData>(() => LockerSurrenderModal_buildInitialData(row));
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LockerSurrenderModal_SurrenderFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const updateField = <K extends keyof LockerSurrenderModal_SurrenderFormData>(key: K, value: LockerSurrenderModal_SurrenderFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsValidated(false);
  };

  const handlePickRow = (picked: LockerSurrenderModal_PickRow) => {
    updateField("debitAcCode", picked.code);
    updateField("name", picked.name);
    setShowPicker(false);
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<keyof LockerSurrenderModal_SurrenderFormData, boolean>> = {
      debitAcCode: form.debitAcCode.trim() === "",
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    setIsValidated(!hasErrors);
    if (hasErrors) toast.error("Please fill all required fields before validating.");
    else toast.success("All fields validated successfully.");
  };

  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handlePlaceholderAction = (label: string) => toast.info(`${label} will be implemented.`);

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
        title="Locker Surrendered Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Locker Surrender"
      titleHi="लॉकर सुपूर्दगी"
      subtitleEn="All Information's are related to Interest Payment Mark"
      subtitleHi="सर्व माहिती व्याज भरण्याच्या मार्कशी संबंधित आहे"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      maxWidth="max-w-6xl"
      customFooter={
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleValidate}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Validate
          </button>
          <button
            type="button"
            onClick={() => handlePlaceholderAction("Signature")}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Signature
          </button>
          <button
            type="button"
            onClick={() => handlePlaceholderAction("Photo")}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Photo
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
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
      }
    >
      <SectionCard titleEn="Surrender Details" titleHi="लॉकर समर्पण तपशील" subtitleEn="Manage customer's personal and identity information." icon={<LockerSurrenderModal_SectionIcon />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FieldShell label="Scroll Number">
            <TextInput icon={<Hash size={16} />} value={form.scrollNumber} onChange={() => {}} placeholder="Scroll Number" readOnly />
          </FieldShell>
          <FieldShell label="Name of hire" labelHi="खाते नाव">
            <TextInput icon={<User size={16} />} value={form.nameOfHire} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Hire Date" labelHi="खाते नाव">
            <TextInput icon={<Calendar size={16} />} value={form.hireDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Period">
            <TextInput icon={<Hash size={16} />} value={form.period} onChange={(v) => updateField("period", v)} />
          </FieldShell>

          <FieldShell label="Completed Period in Months">
            <TextInput icon={<Hash size={16} />} value={form.completedPeriodInMonths} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Review Date">
            <TextInput icon={<Calendar size={16} />} value={form.reviewDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Rent from Date">
            <DateInput value={form.rentFromDate} onChange={(v) => updateField("rentFromDate", v)} />
          </FieldShell>
          <FieldShell label="Rent To Date">
            <DateInput value={form.rentToDate} onChange={(v) => updateField("rentToDate", v)} />
          </FieldShell>

          <FieldShell label="Transaction Date">
            <TextInput icon={<Calendar size={16} />} value={form.transactionDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Service Tax">
            <TextInput icon={<Percent size={16} />} value={form.serviceTax} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Amount">
            <TextInput icon={<IndianRupee size={16} />} value={form.amount} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Locker Rent/Month">
            <TextInput icon={<Percent size={16} />} value={form.lockerRentPerMonth} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard titleEn="Transaction Mode" titleHi="आर्थिक व्यवहार मोड" subtitleEn="Manage customer's personal and identity information." icon={<LockerSurrenderModal_SectionIcon />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex items-end pb-2.5">
            <LockerSurrenderModal_RadioTransactionMode value={form.transactionMode} onChange={(v) => updateField("transactionMode", v)} />
          </div>
          <FieldShell label="Debit A/C Code" required error={errors.debitAcCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput icon={<CreditCard size={16} />} value={form.debitAcCode} onChange={(v) => updateField("debitAcCode", v)} error={errors.debitAcCode} />
              </div>
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
              >
                <MoreVertical size={18} strokeWidth={2.4} />
              </button>
            </div>
          </FieldShell>
          <FieldShell label="Name">
            <TextInput icon={<User size={16} />} value={form.name} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Status">
            <TextInput icon={<ShieldCheck size={16} />} value={form.status} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      {showPicker && (
        <ListModal
          title="Debit Account List"
          columns={[
            { key: "code", label: "Account Code" },
            { key: "name", label: "Name" },
          ]}
          rows={LockerSurrenderModal_DEBIT_AC_LIST}
          onSelect={handlePickRow}
          onClose={() => setShowPicker(false)}
        />
      )}
    </FormModal>
  );
};


/* ===== from LockerTransactionModal.tsx ===== */
interface LockerTransactionModal_TransactionFormData {
  nameOfHire: string;
  rentPaidTillDate: string;
  period: string;
  reviewDate: string;
  rentFromDate: string;
  rentToDate: string;
  completedPeriodInMonths: string;
  lockerRentPerMonth: string;
  lockerRentDue: string;
  serviceTax: string;
  amount: string;
  closingBalance: string;

  transactionMode: "Cash" | "Transfer";
  transactionDate: string;
  debitAcCode: string;
  name: string;
  transferByCheque: boolean;
  chequeType: string;
  chequeSeries: string;
  chequeNo: string;
  chequeDate: string;
}

type LockerTransactionModal_PickRow = { code: string; name: string };

const LockerTransactionModal_DEBIT_AC_LIST: LockerTransactionModal_PickRow[] = [
  { code: "000245", name: "Devaraddi Mallanagoud" },
  { code: "000246", name: "Akshay Om More" },
  { code: "000247", name: "Priya Sharma" },
];
const LockerTransactionModal_CHEQUE_TYPE_LIST: LockerTransactionModal_PickRow[] = [
  { code: "CHQ1", name: "Local Cheque" },
  { code: "CHQ2", name: "Outstation Cheque" },
];

const LockerTransactionModal_buildInitialData = (row: LockerTable_LockerRow): LockerTransactionModal_TransactionFormData => ({
  nameOfHire: row.accountName,
  rentPaidTillDate: "",
  period: "12",
  reviewDate: "12-May-2026",
  rentFromDate: "2026-05-12",
  rentToDate: "2026-05-12",
  completedPeriodInMonths: "158",
  lockerRentPerMonth: "0",
  lockerRentDue: "",
  serviceTax: "0.0%",
  amount: "12,349",
  closingBalance: "0.0%",

  transactionMode: "Transfer",
  transactionDate: "12-May-2026",
  debitAcCode: "",
  name: "",
  transferByCheque: true,
  chequeType: "",
  chequeSeries: "",
  chequeNo: "",
  chequeDate: "",
});

const LockerTransactionModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const LockerTransactionModal_RadioTransactionMode = ({ value, onChange }: { value: "Cash" | "Transfer"; onChange: (v: "Cash" | "Transfer") => void }) => (
  <div className="last:mb-0 flex items-center gap-2">
    <label className="large block text-sm font-medium text-[#1F2858]">
      Transaction Mode <span className="text-slate-600">/ आर्थिक व्यवहार मोड</span>
    </label>
    <div className="flex items-center gap-4 pt-1">
      {(["Cash", "Transfer"] as const).map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="radio" checked={value === opt} onChange={() => onChange(opt)} className="h-4 w-4 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

const LockerTransactionModal_RadioTransferByCheque = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <div className="last:mb-0 flex items-center gap-2">
    <label className="large block text-sm font-medium text-[#1F2858]">
      Transfer by Cheque <span className="text-slate-600">/ आर्थिक व्यवहार मोड</span>
    </label>
    <div className="flex items-center gap-4 pt-1">
      {(["Yes", "No"] as const).map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="radio" checked={(opt === "Yes") === value} onChange={() => onChange(opt === "Yes")} className="h-4 w-4 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export interface LockerTransactionModal_LockerTransactionModalProps {
  row: LockerTable_LockerRow;
  onClose: () => void;
  onSave?: (data: LockerTransactionModal_TransactionFormData) => void;
}

const LockerTransactionModal = ({ row, onClose, onSave }: LockerTransactionModal_LockerTransactionModalProps) => {
  const [form, setForm] = useState<LockerTransactionModal_TransactionFormData>(() => LockerTransactionModal_buildInitialData(row));
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LockerTransactionModal_TransactionFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePicker, setActivePicker] = useState<"debitAcCode" | "chequeType" | null>(null);

  const updateField = <K extends keyof LockerTransactionModal_TransactionFormData>(key: K, value: LockerTransactionModal_TransactionFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsValidated(false);
  };

  const handlePickRow = (picked: LockerTransactionModal_PickRow) => {
    if (activePicker === "debitAcCode") {
      updateField("debitAcCode", picked.code);
      updateField("name", picked.name);
    } else if (activePicker === "chequeType") {
      updateField("chequeType", picked.name);
    }
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<keyof LockerTransactionModal_TransactionFormData, boolean>> = {
      debitAcCode: form.debitAcCode.trim() === "",
    };
    if (form.transferByCheque) {
      newErrors.chequeType = form.chequeType.trim() === "";
    }
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    setIsValidated(!hasErrors);
    if (hasErrors) toast.error("Please fill all required fields before validating.");
    else toast.success("All fields validated successfully.");
  };

  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handlePlaceholderAction = (label: string) => toast.info(`${label} will be implemented.`);

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
        title="Locker Transaction Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  const disabledBtnClass = "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400";
  const enabledOutlineClass = "border border-primary-500 bg-white text-primary hover:bg-primary-50";

  return (
    <FormModal
      onClose={onClose}
      titleEn="Locker Transaction"
      titleHi="लॉकर व्यवहार"
      subtitleEn="All Information's are related to Interest Payment Mark"
      subtitleHi="सर्व माहिती व्याज भरण्याच्या मार्कशी संबंधित आहे"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      maxWidth="max-w-6xl"
      customFooter={
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleValidate}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Validate
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={() => handlePlaceholderAction("Signature")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isValidated ? enabledOutlineClass : disabledBtnClass}`}
          >
            Signature
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={() => handlePlaceholderAction("Photo")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isValidated ? enabledOutlineClass : disabledBtnClass}`}
          >
            Photo
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={() => handlePlaceholderAction("Display Voucher")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isValidated ? enabledOutlineClass : disabledBtnClass}`}
          >
            Display Voucher
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
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Cancel
          </button>
        </div>
      }
    >
      <SectionCard titleEn="Account Details" titleHi="आकाउंट तपशील" subtitleEn="Manage customer's personal and identity information." icon={<LockerTransactionModal_SectionIcon />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FieldShell label="Name of hire" labelHi="खाते नाव">
            <TextInput icon={<User size={16} />} value={form.nameOfHire} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Rent Paid Till Date">
            <TextInput icon={<Calendar size={16} />} value={form.rentPaidTillDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Period">
            <TextInput icon={<Hash size={16} />} value={form.period} onChange={(v) => updateField("period", v)} />
          </FieldShell>
          <FieldShell label="Review Date">
            <TextInput icon={<Calendar size={16} />} value={form.reviewDate} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Rent from Date">
            <DateInput value={form.rentFromDate} onChange={(v) => updateField("rentFromDate", v)} />
          </FieldShell>
          <FieldShell label="Rent To Date">
            <DateInput value={form.rentToDate} onChange={(v) => updateField("rentToDate", v)} />
          </FieldShell>
          <FieldShell label="Completed Period in Months">
            <TextInput icon={<Hash size={16} />} value={form.completedPeriodInMonths} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Locker Rent/Month">
            <TextInput icon={<IndianRupee size={16} />} value={form.lockerRentPerMonth} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Locker Rent Due">
            <TextInput icon={<IndianRupee size={16} />} value={form.lockerRentDue} onChange={() => {}} placeholder="Rent" readOnly />
          </FieldShell>
          <FieldShell label="Service Tax">
            <TextInput icon={<Percent size={16} />} value={form.serviceTax} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Amount">
            <TextInput icon={<IndianRupee size={16} />} value={form.amount} onChange={(v) => updateField("amount", v)} />
          </FieldShell>
          <FieldShell label="Closing Balance">
            <TextInput icon={<Percent size={16} />} value={form.closingBalance} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard titleEn="Transaction Mode" titleHi="आर्थिक व्यवहार मोड" subtitleEn="Manage customer's personal and identity information." icon={<LockerTransactionModal_SectionIcon />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex items-end pb-2.5">
            <LockerTransactionModal_RadioTransactionMode value={form.transactionMode} onChange={(v) => updateField("transactionMode", v)} />
          </div>
          <FieldShell label="Transaction Date">
            <TextInput icon={<Calendar size={16} />} value={form.transactionDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Debit A/C Code" required error={errors.debitAcCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput icon={<CreditCard size={16} />} value={form.debitAcCode} onChange={(v) => updateField("debitAcCode", v)} error={errors.debitAcCode} />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("debitAcCode")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
              >
                <MoreVertical size={18} strokeWidth={2.4} />
              </button>
            </div>
          </FieldShell>
          <FieldShell label="Name">
            <TextInput icon={<User size={16} />} value={form.name} onChange={() => {}} readOnly />
          </FieldShell>

          <div className="flex items-end pb-2.5">
            <LockerTransactionModal_RadioTransferByCheque value={form.transferByCheque} onChange={(v) => updateField("transferByCheque", v)} />
          </div>
          <FieldShell label="Cheque Type" required={form.transferByCheque} error={errors.chequeType}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput icon={<CreditCard size={16} />} value={form.chequeType} onChange={(v) => updateField("chequeType", v)} placeholder="Cheque" error={errors.chequeType} />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("chequeType")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
              >
                <MoreVertical size={18} strokeWidth={2.4} />
              </button>
            </div>
          </FieldShell>
          <FieldShell label="Cheque Series">
            <TextInput icon={<Hash size={16} />} value={form.chequeSeries} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Cheque No">
            <TextInput icon={<Hash size={16} />} value={form.chequeNo} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Cheque Date">
            <TextInput icon={<Calendar size={16} />} value={form.chequeDate} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      {activePicker && (
        <ListModal
          title={activePicker === "debitAcCode" ? "Debit Account List" : "Cheque Type List"}
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Name" },
          ]}
          rows={activePicker === "debitAcCode" ? LockerTransactionModal_DEBIT_AC_LIST : LockerTransactionModal_CHEQUE_TYPE_LIST}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};


/* ===== from LockerPage.tsx ===== */
const PAGE_SIZE = 10;

const FILTER_LABELS: Record<keyof FilterModal_LockerFilters, string> = {
  lockerType: "Locker Type",
  lockerNo: "Locker No",
  status: "Status",
  customerId: "Customer ID",
};

export default function LockerPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Clerk", href: "/" },
    { label: "Locker", href: "#" },
  ];

  const [rows, setRows] = useState<LockerTable_LockerRow[]>(LockerTable_DEFAULT_LOCKER_ROWS);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [surrenderRow, setSurrenderRow] = useState<LockerTable_LockerRow | null>(null);
  const [transactionRow, setTransactionRow] = useState<LockerTable_LockerRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterModal_LockerFilters>(FilterModal_defaultLockerFilterValues);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    let result = rows;
    const activeEntries = Object.entries(filters).filter(([, v]) => v?.trim());
    if (activeEntries.length > 0) {
      result = result.filter((row) =>
        activeEntries.every(([key, value]) => {
          if (key === "lockerNo") return row.lockerNo.toLowerCase().includes(value.toLowerCase());
          if (key === "lockerType") return row.lockerType.toLowerCase().includes(value.toLowerCase());
          if (key === "status") return row.status.toLowerCase() === value.toLowerCase();
          if (key === "customerId") return row.customerId.toLowerCase().includes(value.toLowerCase());
          return true;
        }),
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)));
    }
    return result;
  }, [rows, filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  const activeFilterCount = useMemo(() => Object.values(filters).filter((v) => v?.trim()).length, [filters]);

  const filterSummary = useMemo(() => {
    const entries = Object.entries(filters).filter(([, v]) => v?.trim()) as [keyof FilterModal_LockerFilters, string][];
    if (entries.length === 0) return "";
    const [firstKey, firstVal] = entries[0];
    const extra = entries.length > 1 ? ` +${entries.length - 1} more` : "";
    return `${FILTER_LABELS[firstKey]}:${firstVal}${extra}`;
  }, [filters]);

  const handleAddSave = (payload: AddLocker_NewLockerRowPayload) => {
    setRows((prev) => [
      ...prev,
      {
        sr: prev.length + 1,
        lockerType: payload.lockerType,
        lockerNo: payload.lockerNo,
        status: "Active",
        cupboardType: payload.cupboardType,
        accountNo: payload.accountNo,
        accountName: payload.accountName,
        customerId: payload.customerId,
      },
    ]);
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-[#E7EAEF] dark:bg-slate-950">
      <GlobalNav
        titleEn="Locker"
        titleHi="लॉकर"
        breadcrumbs={breadcrumbs}
        onBack={() => window.history.back()}
        showActions
        onAdd={() => setShowAdd(true)}
        onFilter={() => setShowFilter(true)}
        searchQuery={searchQuery}
        onSearchChange={(v) => {
          setSearchQuery(v);
          setPage(1);
        }}
        onRefresh={() => {
          setFilters(FilterModal_defaultLockerFilterValues);
          setSearchQuery("");
          setPage(1);
        }}
        activeFilterCount={activeFilterCount}
        filterSummary={filterSummary}
      />

      <div className="p-4">
        <LockerTable rows={pagedRows} onSurrender={setSurrenderRow} onTransaction={setTransactionRow} />
        <div className="mt-2 rounded-xl bg-white shadow-sm dark:bg-slate-900">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {showAdd && <AddLocker onClose={() => setShowAdd(false)} onSave={handleAddSave} />}

      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowFilter(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setShowFilter(false)}
              onApply={(v) => {
                setFilters(v);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}

      {surrenderRow && <LockerSurrenderModal row={surrenderRow} onClose={() => setSurrenderRow(null)} />}
      {transactionRow && <LockerTransactionModal row={transactionRow} onClose={() => setTransactionRow(null)} />}
    </div>
  );
}