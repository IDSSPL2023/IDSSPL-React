import { IMAGES } from "@/assets";
import React, { useState } from "react";
import CityPicklistField from "@/components/common/CityPicklistField";
import { CountryPicklistField } from "@/components/common";
import Image from "@/components/ui/Image";
import {
  X,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronDown,
  User,
  IdCard,
  Tag,
  AlertTriangle,
  ChevronsLeftRight,
  Calendar,
  Users,
  Home,
  Hash,
  Building2,
  MapPin,
  Flag,
  IndianRupee,
  Percent,
  FileText,
  ShieldCheck,
  Shield,
  Receipt,
  Archive,
  Briefcase,
  UserCog,
  Car,
  Gauge,
  Wrench,
  Calculator,
  Ruler,
} from "lucide-react";
import CustomerIdPicklistField, { CustomerOption } from "../common/CustomerIdPicklistField";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface Customer {
  id: string;
  name: string;
  category: string;
  risk: string;
}

interface IntroducerAccount {
  code: string;
  name: string;
}

export interface DetailsData {
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

export interface LoanData {
  loanAmount: string;
  loanAmountInWords: string;
  interestRate: string;
  tenureMonths: string;
  repaymentFrequency: string;
  emiAmount: string;
  disbursementDate: string;
  purposeOfLoan: string;
}

/** Shared shape for both the Nominee and Guarantor repeatable tabs */
export interface PartyRow {
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

export interface GoldSilverHeaderData {
  securityTypeCode: string;
  submissionDate: string;
  receiptNumber: string;
  drawerNumber: string;
  bagNumber: string;
  valuatorName: string;
  valuationRatePerGram: string;
  totalValuation: string;
}

export interface GoldSilverItemRow {
  srNo: number;
  itemName: string;
  numberOfItems: string;
  grossWeight: string;
  netWeight: string;
  nakkiNetWeight: string;
  marketValue: string;
}

export interface LandBuildingRow {
  srNo: number;
  securityTypeCode: string;
  submissionDate: string;
  location: string;
  area: string;
  unitOfArea: string;
  east: string;
  west: string;
  north: string;
  south: string;
  margin: string;
  securedValue: string;
  amountValued: string;
  particular: string;
  engineerName: string;
}

export interface VehicleRow {
  srNo: number;
  vehicleType: string;
  makeModel: string;
  modelYear: string;
  isNewVehicle: boolean;
  manufacturingDate: string;
  seatingCapacity: string;
  carryingCapacity: string;
  engineCapacityCC: string;
  chassisNumber: string;
  acquisitionDate: string;
  supplierName: string;
  purchasePrice: string;
  purchaseParticular: string;
  rtoLocation: string;
  registrationNumber: string;
  registrationDate: string;
  isVehicleInspected: boolean;
  submissionDate: string;
  insuranceName: string;
  policyNumber: string;
  policyType: string;
  policyStartDate: string;
  policyEndDate: string;
  idv: string;
  premiumFrequency: string;
  premiumAmount: string;
  totalInsuredAmount: string;
  noClaimBonusPercent: string;
  securityTypeCode: string;
  marginPercent: string;
}

export interface PlanMachineRow {
  srNo: number;
  securityTypeCode: string;
  machineType: string;
  machineName: string;
  isNewEquipment: boolean;
  distinctiveNumber: string;
  specification: string;
  supplierName: string;
  purchasePrice: string;
  particular: string;
  securityValue: string;
  acquisitionDate: string;
  submissionDate: string;
  marginPercent: string;
}

export interface DepositDetailsData {
  depositAccountNumber: string;
  depositHolderName: string;
  depositAmount: string;
  depositDate: string;
  maturityDate: string;
  lienAmount: string;
}

export interface WareHouseData {
  warehouseName: string;
  receiptNumber: string;
  commodityDescription: string;
  quantity: string;
  storageValue: string;
  receiptDate: string;
  expiryDate: string;
}

type TabKey = "Details" | "Loan" | "Nominee" | "Guarantor" | "Land & Building" | "Gold & Silver" | "Application" | "Motor-Insurance" | "Plan & Machine" | "Deposit Details" | "WareHouse";
type LoanCategory = "standard" | "landBuilding" | "goldSilver" | "vehicleLoan" | "planAndMachine" | "domesticItemLoan" | "wareHouse";

const TAB_SETS: Record<LoanCategory, TabKey[]> = {
  standard: ["Details", "Loan", "Nominee", "Guarantor"],
  landBuilding: ["Details", "Loan", "Nominee", "Guarantor", "Land & Building"],
  goldSilver: ["Details", "Loan", "Nominee", "Gold & Silver"],
  vehicleLoan: ["Application", "Loan", "Guarantor", "Motor-Insurance"],
  planAndMachine: ["Application", "Loan", "Guarantor", "Plan & Machine"],
  domesticItemLoan: ["Application", "Loan", "Deposit Details"],
  wareHouse: ["Application", "Loan", "WareHouse"],
};

export function resolveLoanCategory(productDescription?: string): LoanCategory {
  const desc = (productDescription ?? "").toLowerCase();
  if (desc.includes("housing")) return "landBuilding";
  if (desc.includes("gold")) return "goldSilver";
  if (desc.includes("vehicle")) return "vehicleLoan";
  if (desc.includes("small scale industry") || desc.includes("machine")) return "planAndMachine";
  if (desc.includes("domestic")) return "domesticItemLoan";
  if (desc.includes("sugar cane") || desc.includes("warehouse")) return "wareHouse";
  return "standard";
}

/* ------------------------------------------------------------------ */
/*  Mock data (stand-in for backend lookups)                          */
/* ------------------------------------------------------------------ */

const CUSTOMERS: Customer[] = [
  { id: "00012", name: "Akshay Om More", category: "Public", risk: "Low" },
  { id: "00015", name: "Priya Sharma", category: "Staff", risk: "Medium" },
  { id: "00021", name: "Rahul Verma", category: "Public", risk: "High" },
];

const INTRODUCER_ACCOUNTS: IntroducerAccount[] = [
  { code: "1001", name: "Saving Account" },
  { code: "1002", name: "Current Account" },
  { code: "1003", name: "Recurring Deposit" },
];

const ACCOUNT_OPERATION_CAPACITY = ["Self", "Jointly", "Either or Survivor"];
const MIN_BALANCE_IDS = ["200", "500", "1000"];
const REPAYMENT_FREQUENCIES = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
const SALUTATIONS = ["MR", "MRS", "MS", "DR"];
const RELATIONS = ["Father", "Mother", "Spouse", "Son", "Daughter", "Brother", "Sister"];
const CITIES = ["Kolhapur", "Mumbai", "Pune", "Nagpur"];

const GOLD_SECURITY_TYPES = ["Gold Ornaments", "Silver Ornaments", "Gold Coins", "Silver Coins"];
const LAND_SECURITY_TYPES = ["Book Debts", "Land", "Building", "Land & Building", "Plot"];
const UNIT_OF_AREA = ["SQ-FT", "SQ-MTR", "Acre", "Gunta"];
const VEHICLE_TYPES = ["Bike", "Car", "Truck", "Tractor", "Auto Rickshaw", "Commercial Vehicle"];
const PREMIUM_FREQUENCIES = ["Monthly", "Quarterly", "Half Year", "Yearly"];
const VEHICLE_SECURITY_TYPES = ["Vehicle and Motor", "Hypothecation", "Vehicle RC Pledge"];
const MACHINE_SECURITY_TYPES = ["Hypothecation of Machinery", "Plant & Machinery", "Vehicle and Motor"];

const emptyParty = (srNo: number): PartyRow => ({
  srNo,
  salutationCode: "MR",
  customerId: "",
  name: "",
  relation: "Father",
  address1: "",
  address2: "",
  address3: "",
  zip: "",
  city: "Kolhapur",
  state: "Maharashtra",
  country: "India",
});

const emptyGoldItem = (srNo: number): GoldSilverItemRow => ({
  srNo,
  itemName: "",
  numberOfItems: "",
  grossWeight: "",
  netWeight: "",
  nakkiNetWeight: "",
  marketValue: "",
});

const emptyLandBuilding = (srNo: number): LandBuildingRow => ({
  srNo,
  securityTypeCode: LAND_SECURITY_TYPES[0],
  submissionDate: "",
  location: CITIES[0],
  area: "",
  unitOfArea: UNIT_OF_AREA[0],
  east: "",
  west: "",
  north: "",
  south: "",
  margin: "",
  securedValue: "",
  amountValued: "",
  particular: "",
  engineerName: "",
});

const emptyVehicle = (srNo: number): VehicleRow => ({
  srNo,
  vehicleType: VEHICLE_TYPES[0],
  makeModel: "",
  modelYear: "",
  isNewVehicle: true,
  manufacturingDate: "",
  seatingCapacity: "",
  carryingCapacity: "",
  engineCapacityCC: "",
  chassisNumber: "",
  acquisitionDate: "",
  supplierName: "",
  purchasePrice: "",
  purchaseParticular: "",
  rtoLocation: CITIES[0],
  registrationNumber: "",
  registrationDate: "",
  isVehicleInspected: true,
  submissionDate: "",
  insuranceName: "",
  policyNumber: "",
  policyType: "",
  policyStartDate: "",
  policyEndDate: "",
  idv: "",
  premiumFrequency: PREMIUM_FREQUENCIES[0],
  premiumAmount: "",
  totalInsuredAmount: "",
  noClaimBonusPercent: "",
  securityTypeCode: VEHICLE_SECURITY_TYPES[0],
  marginPercent: "",
});

const emptyPlanMachine = (srNo: number): PlanMachineRow => ({
  srNo,
  securityTypeCode: MACHINE_SECURITY_TYPES[0],
  machineType: "",
  machineName: "",
  isNewEquipment: true,
  distinctiveNumber: "",
  specification: "",
  supplierName: "",
  purchasePrice: "",
  particular: "",
  securityValue: "",
  acquisitionDate: "",
  submissionDate: "",
  marginPercent: "",
});

/* Generic helpers for any repeatable row collection keyed by srNo */
function addRow<T extends { srNo: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, factory: (srNo: number) => T) {
  setter((prev) => [...prev, factory(prev.length + 1)]);
}

function updateRow<T>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, patch: Partial<T>) {
  setter((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
}

function deleteRow<T extends { srNo: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) {
  setter((prev) => prev.filter((_, i) => i !== index).map((row, i) => ({ ...row, srNo: i + 1 })));
}

/* ------------------------------------------------------------------ */
/*  Reusable field shells                                             */
/* ------------------------------------------------------------------ */

interface FieldShellProps {
  label: string;
  labelHi: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}

const FieldShell: React.FC<FieldShellProps> = ({ label, labelHi, required, error, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-black dark:text-slate-100">
      {label}
      {labelHi && <span className="text-slate-600"> / {labelHi}</span>}
      {required && <span className="text-red-500"> *</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">This field is required</p>}
  </div>
);

interface TextInputProps {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: boolean;
  trailing?: React.ReactNode;
}

const TextInput: React.FC<TextInputProps> = ({ icon, value, onChange, placeholder, readOnly, error, trailing }) => (
  <div className="flex items-center gap-2">
  <div className="relative flex-1 min-w-0">
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </span>
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border bg-white dark:bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-700 dark:text-slate-100 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 ${
        readOnly ? "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400" : ""
      } ${error ? "border-red-400" : "border-slate-400 dark:border-slate-700"}`}
    />
  </div>
  {trailing && <div className="shrink-0">{trailing}</div>}
</div>
);

interface SelectInputProps {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({ icon, value, onChange, options, error }) => (
  <div className="relative flex items-center">
    <span className="pointer-events-none absolute left-3 z-10 text-slate-400">{icon}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full appearance-none rounded-lg border bg-white dark:bg-slate-900 py-2.5 pl-9 pr-9 text-sm text-slate-700 dark:text-slate-100 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 ${
        error ? "border-red-400" : "border-slate-200 dark:border-slate-700"
      }`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown size={16} className="pointer-events-none absolute right-3 text-slate-400" />
  </div>
);

const DateField: React.FC<{ value: string; onChange: (v: string) => void; error?: boolean }> = ({ value, onChange, error }) => (
  <div className="relative flex items-center">
    <span className="pointer-events-none absolute left-3 text-slate-400">
      <Calendar size={16} />
    </span>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border bg-white dark:bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-700 dark:text-slate-100 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 ${
        error ? "border-red-400" : "border-slate-400 dark:border-slate-700"
      }`}
    />
  </div>
);

const YesNoField: React.FC<{ label: string; labelHi: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, labelHi, value, onChange }) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-black dark:text-slate-100">
      {label}
      <span className="text-slate-600"> / {labelHi}</span>
    </label>
    <div className="flex h-[42px] items-center gap-5">
      {(["Yes", "No"] as const).map((opt) => {
        const optValue = opt === "Yes";
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                optValue === value ? "border-primary-500" : "border-slate-300 dark:border-slate-600"
              }`}
            >
              {optValue === value && <span className="h-2 w-2 rounded-full bg-primary-500" />}
            </span>
            <input type="radio" className="hidden" checked={optValue === value} onChange={() => onChange(optValue)} />
            {opt}
          </label>
        );
      })}
    </div>
  </div>
);

/* Header used at the top of each collateral section card (Vehicle Identification, Purchase Details, ...) */
const SectionHeader: React.FC<{ title: string; titleHi: string; subtitle: string; subtitleHi: string }> = ({ title, titleHi, subtitle, subtitleHi }) => (
  <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400">
      <User size={16} />
    </div>
    <div>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {title} <span className="font-normal text-slate-500 dark:text-slate-400">/ {titleHi}</span>
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {subtitle} / {subtitleHi}
      </p>
    </div>
  </div>
);

/* Delete button shown at the top-right of a repeatable row card */
const DeleteRowButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Remove ${label}`}
    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-red-500 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30 disabled:pointer-events-none disabled:opacity-0"
  >
    <Trash2 size={16} />
  </button>
);

/* ------------------------------------------------------------------ */
/*  Nominee / Guarantor repeatable tab                                 */
/* ------------------------------------------------------------------ */

interface PartyTabProps {
  rows: PartyRow[];
  entityLabel: string;
  entityLabelHi: string;
  errorPrefix: string;
  errors: Record<string, boolean>;
  onUpdate: (index: number, patch: Partial<PartyRow>) => void;
  onDelete: (index: number) => void;
  onCustomerSelect: (index: number, customer: CustomerOption) => void;
}

const PartyTab: React.FC<PartyTabProps> = ({ 
  rows, 
  entityLabel, 
  entityLabelHi, 
  errorPrefix, 
  errors, 
  onUpdate, 
  onDelete, 
  onCustomerSelect 
}) => (
  <>
    {rows.map((row, index) => (
      <div key={row.srNo} className="relative rounded-[20px] border-x border-b border-t-4 border-primary bg-white dark:bg-slate-900 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        {rows.length > 1 && <DeleteRowButton label={`${entityLabel} ${row.srNo}`} onClick={() => onDelete(index)} />}

        {/* Top row: Sr No (compact) + first 3 fields sharing remaining space */}
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="shrink-0 md:w-10">
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Sr No</label>
            <div className="flex h-[42px] w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              {row.srNo}
            </div>
          </div>

          <div className="flex-1">
            <FieldShell label="Salutation Code" labelHi="संबोधनी" required>
              <SelectInput icon={<User size={16} />} value={row.salutationCode} onChange={(v) => onUpdate(index, { salutationCode: v })} options={SALUTATIONS} />
            </FieldShell>
          </div>

          <div className="flex-1">
            <FieldShell label={`${entityLabel} Customer ID`} labelHi={`${entityLabelHi} ग्राहक आयडी`} required error={errors[`${errorPrefix}-${index}-customerId`]}>
              <CustomerIdPicklistField
                label=""
                value={row.customerId}
                placeholder={`Select ${entityLabel}`}
                onSelect={(customer) => onCustomerSelect(index, customer)}
                preFetch={false}
                pageSize={10}
              />
            </FieldShell>
          </div>

          <div className="flex-1">
            <FieldShell label={`${entityLabel} Name`} labelHi={`${entityLabelHi} नाव`} required error={errors[`${errorPrefix}-${index}-name`]}>
              <TextInput icon={<User size={16} />} value={row.name} onChange={(v) => onUpdate(index, { name: v })} error={errors[`${errorPrefix}-${index}-name`]} />
            </FieldShell>
          </div>
        </div>

        {/* Remaining fields: 4-column grid */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
          <FieldShell label="Relation" labelHi="नाते" required>
            <SelectInput icon={<Users size={16} />} value={row.relation} onChange={(v) => onUpdate(index, { relation: v })} options={RELATIONS} />
          </FieldShell>

          <FieldShell label="Address 1" labelHi="पत्ता १" required>
            <TextInput icon={<Home size={16} />} value={row.address1} onChange={(v) => onUpdate(index, { address1: v })} />
          </FieldShell>

          <FieldShell label="Address 2" labelHi="पत्ता २" required>
            <TextInput icon={<Home size={16} />} value={row.address2} onChange={(v) => onUpdate(index, { address2: v })} />
          </FieldShell>

          <FieldShell label="Address 3" labelHi="पत्ता ३">
            <TextInput icon={<Home size={16} />} value={row.address3} onChange={(v) => onUpdate(index, { address3: v })} />
          </FieldShell>

          <FieldShell label="Zip" labelHi="पिन कोड" required error={errors[`${errorPrefix}-${index}-zip`]}>
            <TextInput icon={<Hash size={16} />} value={row.zip} onChange={(v) => onUpdate(index, { zip: v })} error={errors[`${errorPrefix}-${index}-zip`]} />
          </FieldShell>

          <CityPicklistField label="City" labelHi="शहरे" required icon={<Building2 size={16} />} value={row.city} onSelect={(city) => onUpdate(index, { city: city.name })} />

          <FieldShell label="State" labelHi="राज्य" required>
            <TextInput icon={<MapPin size={16} />} value={row.state} onChange={(v) => onUpdate(index, { state: v })} />
          </FieldShell>

          <CountryPicklistField
            label="Country"
            labelHi="देश"
            icon={<Flag size={16} />}
            value={row.country}
            onSelect={(c) => onUpdate(index, { country: c.name })}
            required
          />
        </div>
      </div>
    ))}
  </>
);

/* ------------------------------------------------------------------ */
/*  Gold & Silver tab                                                  */
/* ------------------------------------------------------------------ */

interface GoldSilverSectionProps {
  header: GoldSilverHeaderData;
  items: GoldSilverItemRow[];
  errors: Record<string, boolean>;
  onHeaderChange: (patch: Partial<GoldSilverHeaderData>) => void;
  onItemChange: (index: number, patch: Partial<GoldSilverItemRow>) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
  onRecalculate: () => void;
}

const num = (v: string) => Number(v.replace(/,/g, "")) || 0;

const GoldSilverSection: React.FC<GoldSilverSectionProps> = ({ header, items, errors, onHeaderChange, onItemChange, onAddItem, onDeleteItem, onRecalculate }) => {
  const totals = items.reduce(
    (acc, item) => ({
      count: acc.count + num(item.numberOfItems),
      gross: acc.gross + num(item.grossWeight),
      net: acc.net + num(item.netWeight),
      nakki: acc.nakki + num(item.nakkiNetWeight),
      value: acc.value + num(item.marketValue),
    }),
    { count: 0, gross: 0, net: 0, nakki: 0, value: 0 }
  );

  return (
    <div className="relative rounded-[20px] border-x border-b border-t-4 border-primary bg-white dark:bg-slate-900 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <FieldShell label="Security Type Code" labelHi="सुरक्षेचा प्रकार कोड" required error={errors.securityTypeCode}>
          <SelectInput icon={<ShieldCheck size={16} />} value={header.securityTypeCode} onChange={(v) => onHeaderChange({ securityTypeCode: v })} options={GOLD_SECURITY_TYPES} />
        </FieldShell>

        <FieldShell label="Submission Date" labelHi="सादर दिनांक">
          <DateField value={header.submissionDate} onChange={(v) => onHeaderChange({ submissionDate: v })} />
        </FieldShell>

        <FieldShell label="Gold/Silver Receipt No." labelHi="सोने/चांदी पावती क्रमांक" required error={errors.receiptNumber}>
          <TextInput icon={<Receipt size={16} />} value={header.receiptNumber} onChange={(v) => onHeaderChange({ receiptNumber: v })} error={errors.receiptNumber} />
        </FieldShell>

        <FieldShell label="Gold/Silver Drawer No." labelHi="सोने/चांदी ड्रॉवर क्रमांक" required error={errors.drawerNumber}>
          <TextInput icon={<Archive size={16} />} value={header.drawerNumber} onChange={(v) => onHeaderChange({ drawerNumber: v })} error={errors.drawerNumber} />
        </FieldShell>

        <FieldShell label="Gold/Silver Bag No." labelHi="सोने/चांदी पिशवी क्रमांक">
          <TextInput icon={<Briefcase size={16} />} value={header.bagNumber} onChange={(v) => onHeaderChange({ bagNumber: v })} />
        </FieldShell>

        <FieldShell label="Name of Valuator" labelHi="मूल्यांकन अधिकारीचे नाव" required error={errors.valuatorName}>
          <TextInput
            icon={<User size={16} />}
            value={header.valuatorName}
            onChange={(v) => onHeaderChange({ valuatorName: v })}
            error={errors.valuatorName}
          />
        </FieldShell>

        <FieldShell label="Valuation Rate per Gram" labelHi="प्रति ग्रॅम मूल्यांकन दर" required error={errors.valuationRatePerGram}>
          <TextInput icon={<Percent size={16} />} value={header.valuationRatePerGram} onChange={(v) => onHeaderChange({ valuationRatePerGram: v })} error={errors.valuationRatePerGram} />
        </FieldShell>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-dashed border-primary-300 p-4">
        <table className="w-full min-w-[820px] border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-[#CFE3FF] text-xs font-semibold text-[#1B2143] dark:bg-slate-800 dark:text-slate-200">
              <th className="rounded-l-lg px-3 py-2 text-left">Sr No.</th>
              <th className="px-3 py-2 text-left">Name of Items</th>
              <th className="px-3 py-2 text-left">No. of Items</th>
              <th className="px-3 py-2 text-left">Gross Weight</th>
              <th className="px-3 py-2 text-left">Net Weight</th>
              <th className="px-3 py-2 text-left">Nakki Net Weight</th>
              <th className="px-3 py-2 text-left">Market Value</th>
              <th className="rounded-r-lg px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.srNo}>
                <td className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400">{item.srNo}</td>
                <td className="px-3 py-1">
                  <TextInput icon={<FileText size={16} />} value={item.itemName} onChange={(v) => onItemChange(index, { itemName: v })} />
                </td>
                <td className="px-3 py-1">
                  <TextInput icon={<Hash size={16} />} value={item.numberOfItems} onChange={(v) => onItemChange(index, { numberOfItems: v })} />
                </td>
                <td className="px-3 py-1">
                  <TextInput icon={<Hash size={16} />} value={item.grossWeight} onChange={(v) => onItemChange(index, { grossWeight: v })} />
                </td>
                <td className="px-3 py-1">
                  <TextInput icon={<Hash size={16} />} value={item.netWeight} onChange={(v) => onItemChange(index, { netWeight: v })} />
                </td>
                <td className="px-3 py-1">
                  <TextInput icon={<Hash size={16} />} value={item.nakkiNetWeight} onChange={(v) => onItemChange(index, { nakkiNetWeight: v })} />
                </td>
                <td className="px-3 py-1">
                  <TextInput icon={<IndianRupee size={16} />} value={item.marketValue} onChange={(v) => onItemChange(index, { marketValue: v })} />
                </td>
                <td className="px-3 py-1">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteItem(index)}
                      aria-label={`Remove item ${item.srNo}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30 disabled:pointer-events-none disabled:opacity-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            <tr className="bg-primary-50 text-sm font-semibold text-[#1B2143] dark:text-slate-100">
              <td className="rounded-l-lg px-3 py-2" colSpan={2} />
              <td className="px-3 py-2">{totals.count}</td>
              <td className="px-3 py-2">{totals.gross.toFixed(2)} g</td>
              <td className="px-3 py-2">{totals.net.toFixed(2)} g</td>
              <td className="px-3 py-2">{totals.nakki.toFixed(2)} g</td>
              <td className="px-3 py-2">₹{totals.value.toLocaleString("en-IN")}</td>
              <td className="rounded-r-lg px-3 py-2" />
            </tr>
          </tbody>
        </table>

        <button
          type="button"
          onClick={onAddItem}
          className="mt-3 flex items-center gap-1.5 rounded-lg border border-primary text-primary px-3.5 py-2 text-sm font-medium transition-colors hover:bg-primary-50 disabled:pointer-events-none disabled:opacity-0"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="mt-5 flex items-end gap-3 md:w-1/2">
        <div className="flex-1">
          <FieldShell label="Total Valuation" labelHi="एकूण मूल्यांकन" required error={errors.totalValuation}>
            <TextInput icon={<Calculator size={16} />} value={header.totalValuation} onChange={(v) => onHeaderChange({ totalValuation: v })} readOnly error={errors.totalValuation} />
          </FieldShell>
        </div>
        <button
          type="button"
          onClick={onRecalculate}
          aria-label="Recalculate total valuation"
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-700 disabled:pointer-events-none disabled:opacity-40"
        >
          <Calculator size={18} />
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Land & Building repeatable tab                                     */
/* ------------------------------------------------------------------ */

interface LandBuildingSectionProps {
  rows: LandBuildingRow[];
  errors: Record<string, boolean>;
  onUpdate: (index: number, patch: Partial<LandBuildingRow>) => void;
  onDelete: (index: number) => void;
}

const LandBuildingSection: React.FC<LandBuildingSectionProps> = ({ rows, errors, onUpdate, onDelete }) => (
  <>
    {rows.map((row, index) => (
      <div key={row.srNo} className="relative rounded-[20px] border-x border-b border-t-4 border-primary bg-white dark:bg-slate-900 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        {rows.length > 1 && <DeleteRowButton label={`Land & Building ${row.srNo}`} onClick={() => onDelete(index)} />}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-black dark:text-slate-100">Sr No</label>
            <div className="flex h-[42px] w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              {row.srNo}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-3">
            <FieldShell label="Security Type Code" labelHi="सुरक्षेचा प्रकार कोड" required error={errors[`lb-${index}-securityTypeCode`]}>
              <SelectInput icon={<ShieldCheck size={16} />} value={row.securityTypeCode} onChange={(v) => onUpdate(index, { securityTypeCode: v })} options={LAND_SECURITY_TYPES} />
            </FieldShell>

            <FieldShell label="Submission Date" labelHi="सादर दिनांक">
              <DateField value={row.submissionDate} onChange={(v) => onUpdate(index, { submissionDate: v })} />
            </FieldShell>

            <FieldShell label="Location" labelHi="ठिकाण" required error={errors[`lb-${index}-location`]}>
              <SelectInput icon={<Building2 size={16} />} value={row.location} onChange={(v) => onUpdate(index, { location: v })} options={CITIES} />
            </FieldShell>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <FieldShell label="Area" labelHi="क्षेत्र" required error={errors[`lb-${index}-area`]}>
            <TextInput icon={<Home size={16} />} value={row.area} onChange={(v) => onUpdate(index, { area: v })} error={errors[`lb-${index}-area`]} />
          </FieldShell>

          <FieldShell label="Unit of Area" labelHi="क्षेत्रफळाचे युनिट">
            <SelectInput icon={<Ruler size={16} />} value={row.unitOfArea} onChange={(v) => onUpdate(index, { unitOfArea: v })} options={UNIT_OF_AREA} />
          </FieldShell>

          <FieldShell label="East" labelHi="पूर्व" required error={errors[`lb-${index}-east`]}>
            <TextInput icon={<Home size={16} />} value={row.east} onChange={(v) => onUpdate(index, { east: v })} error={errors[`lb-${index}-east`]} />
          </FieldShell>

          <FieldShell label="West" labelHi="पश्चिम" required error={errors[`lb-${index}-west`]}>
            <TextInput icon={<Home size={16} />} value={row.west} onChange={(v) => onUpdate(index, { west: v })} error={errors[`lb-${index}-west`]} />
          </FieldShell>

          <FieldShell label="North" labelHi="उत्तर" required error={errors[`lb-${index}-north`]}>
            <TextInput icon={<Home size={16} />} value={row.north} onChange={(v) => onUpdate(index, { north: v })} error={errors[`lb-${index}-north`]} />
          </FieldShell>

          <FieldShell label="South" labelHi="दक्षिण" required error={errors[`lb-${index}-south`]}>
            <TextInput icon={<Home size={16} />} value={row.south} onChange={(v) => onUpdate(index, { south: v })} error={errors[`lb-${index}-south`]} />
          </FieldShell>

          <FieldShell label="Margin" labelHi="मार्जिन" required error={errors[`lb-${index}-margin`]}>
            <TextInput icon={<Percent size={16} />} value={row.margin} onChange={(v) => onUpdate(index, { margin: v })} error={errors[`lb-${index}-margin`]} />
          </FieldShell>

          <FieldShell label="Secured Value" labelHi="सुरक्षित मूल्य" required error={errors[`lb-${index}-securedValue`]}>
            <TextInput icon={<Shield size={16} />} value={row.securedValue} onChange={(v) => onUpdate(index, { securedValue: v })} error={errors[`lb-${index}-securedValue`]} />
          </FieldShell>

          <FieldShell label="Amt. Valued" labelHi="किंमत मूल्यांकन" required error={errors[`lb-${index}-amountValued`]}>
            <TextInput icon={<Tag size={16} />} value={row.amountValued} onChange={(v) => onUpdate(index, { amountValued: v })} error={errors[`lb-${index}-amountValued`]} />
          </FieldShell>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <FieldShell label="Particular" labelHi="विशेष" required error={errors[`lb-${index}-particular`]}>
            <TextInput icon={<FileText size={16} />} value={row.particular} onChange={(v) => onUpdate(index, { particular: v })} error={errors[`lb-${index}-particular`]} placeholder="Particular" />
          </FieldShell>

          <FieldShell label="Engineer Name" labelHi="इंजिनिअरचे नाव" required error={errors[`lb-${index}-engineerName`]}>
            <TextInput icon={<UserCog size={16} />} value={row.engineerName} onChange={(v) => onUpdate(index, { engineerName: v })} error={errors[`lb-${index}-engineerName`]} />
          </FieldShell>
        </div>
      </div>
    ))}
  </>
);

/* ------------------------------------------------------------------ */
/*  Motor-Insurance (Vehicle) repeatable tab                           */
/* ------------------------------------------------------------------ */

interface VehicleSectionProps {
  rows: VehicleRow[];
  errors: Record<string, boolean>;
  onUpdate: (index: number, patch: Partial<VehicleRow>) => void;
  onDelete: (index: number) => void;
}

const VehicleSection: React.FC<VehicleSectionProps> = ({ rows, errors, onUpdate, onDelete }) => (
  <>
    {rows.map((row, index) => (
      <div key={row.srNo} className="relative space-y-4">
        {rows.length > 1 && <DeleteRowButton label={`Vehicle ${row.srNo}`} onClick={() => onDelete(index)} />}

        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <SectionHeader title="Vehicle Identification" titleHi="वाहन ओळख" subtitle="Add your Vehicle details" subtitleHi="तुमचे वाहन तपशील जोडा" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black dark:text-slate-100">Sr No</label>
              <div className="flex h-[42px] w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                {row.srNo}
              </div>
            </div>

            <FieldShell label="Type of Vehicle" labelHi="वाहनाचा प्रकार" required error={errors[`veh-${index}-vehicleType`]}>
              <SelectInput icon={<Car size={16} />} value={row.vehicleType} onChange={(v) => onUpdate(index, { vehicleType: v })} options={VEHICLE_TYPES} />
            </FieldShell>

            <FieldShell label="Make & Model" labelHi="कंपनी व मॉडेल">
              <TextInput icon={<FileText size={16} />} value={row.makeModel} onChange={(v) => onUpdate(index, { makeModel: v })} />
            </FieldShell>

            <FieldShell label="Model Year" labelHi="मॉडेल वर्ष">
              <TextInput icon={<Calendar size={16} />} value={row.modelYear} onChange={(v) => onUpdate(index, { modelYear: v })} />
            </FieldShell>

            <YesNoField label="Is New Vehicle ?" labelHi="वाहन नवीन आहे का?" value={row.isNewVehicle} onChange={(v) => onUpdate(index, { isNewVehicle: v })} />

            <FieldShell label="Manufacturing Date" labelHi="उत्पादन दिनांक">
              <DateField value={row.manufacturingDate} onChange={(v) => onUpdate(index, { manufacturingDate: v })} />
            </FieldShell>

            <FieldShell label="Seating Capacity" labelHi="आसन क्षमता">
              <TextInput icon={<Users size={16} />} value={row.seatingCapacity} onChange={(v) => onUpdate(index, { seatingCapacity: v })} />
            </FieldShell>

            <FieldShell label="Carrying Capacity" labelHi="वहन क्षमता">
              <TextInput icon={<Gauge size={16} />} value={row.carryingCapacity} onChange={(v) => onUpdate(index, { carryingCapacity: v })} />
            </FieldShell>

            <FieldShell label="Engine Capacity(CC)" labelHi="इंजिन क्षमता (CC)">
              <TextInput icon={<Wrench size={16} />} value={row.engineCapacityCC} onChange={(v) => onUpdate(index, { engineCapacityCC: v })} />
            </FieldShell>

            <FieldShell label="Chassis Number" labelHi="चेसिस क्रमांक">
              <TextInput icon={<Hash size={16} />} value={row.chassisNumber} onChange={(v) => onUpdate(index, { chassisNumber: v })} />
            </FieldShell>
          </div>
        </div>

        <div className="relative rounded-[20px] border-x border-b border-t-4 border-primary bg-white dark:bg-slate-900 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <SectionHeader title="Purchase Details" titleHi="खरेदी तपशील" subtitle="Add your Vehicle details" subtitleHi="तुमचे वाहन तपशील जोडा" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <FieldShell label="Acquisition Date" labelHi="खरेदी दिनांक">
              <DateField value={row.acquisitionDate} onChange={(v) => onUpdate(index, { acquisitionDate: v })} />
            </FieldShell>

            <FieldShell label="Supplier Name" labelHi="पुरवठादाराचे नाव">
              <TextInput icon={<User size={16} />} value={row.supplierName} onChange={(v) => onUpdate(index, { supplierName: v })} />
            </FieldShell>

            <FieldShell label="Purchase Price" labelHi="खरेदी किंमत">
              <TextInput icon={<IndianRupee size={16} />} value={row.purchasePrice} onChange={(v) => onUpdate(index, { purchasePrice: v })} />
            </FieldShell>

            <div className="md:col-span-3">
              <FieldShell label="Particular" labelHi="तपशील">
                <TextInput icon={<FileText size={16} />} value={row.purchaseParticular} onChange={(v) => onUpdate(index, { purchaseParticular: v })} />
              </FieldShell>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <SectionHeader title="Registration Details" titleHi="नोंदणी तपशील" subtitle="Add your Vehicle details" subtitleHi="तुमचे वाहन तपशील जोडा" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <FieldShell label="RTO Location" labelHi="आरटीओ स्थान">
              <SelectInput icon={<Building2 size={16} />} value={row.rtoLocation} onChange={(v) => onUpdate(index, { rtoLocation: v })} options={CITIES} />
            </FieldShell>

            <FieldShell label="Registration Number" labelHi="नोंदणी क्रमांक">
              <TextInput icon={<Hash size={16} />} value={row.registrationNumber} onChange={(v) => onUpdate(index, { registrationNumber: v })} />
            </FieldShell>

            <FieldShell label="Registration Date" labelHi="नोंदणी दिनांक">
              <DateField value={row.registrationDate} onChange={(v) => onUpdate(index, { registrationDate: v })} />
            </FieldShell>

            <YesNoField label="Is Vehicle Inspected" labelHi="वाहन तपासणी झाली आहे का?" value={row.isVehicleInspected} onChange={(v) => onUpdate(index, { isVehicleInspected: v })} />

            <FieldShell label="Submission Date" labelHi="सादर दिनांक">
              <DateField value={row.submissionDate} onChange={(v) => onUpdate(index, { submissionDate: v })} />
            </FieldShell>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <SectionHeader title="Insurance Details" titleHi="विमा तपशील" subtitle="Add your Vehicle details" subtitleHi="तुमचे वाहन तपशील जोडा" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <FieldShell label="Insurance Name" labelHi="विमा कंपनीचे नाव">
              <TextInput icon={<ShieldCheck size={16} />} value={row.insuranceName} onChange={(v) => onUpdate(index, { insuranceName: v })} />
            </FieldShell>

            <FieldShell label="Policy Number" labelHi="पॉलिसी क्रमांक">
              <TextInput icon={<FileText size={16} />} value={row.policyNumber} onChange={(v) => onUpdate(index, { policyNumber: v })} />
            </FieldShell>

            <FieldShell label="Policy Type" labelHi="पॉलिसी प्रकार">
              <TextInput icon={<Tag size={16} />} value={row.policyType} onChange={(v) => onUpdate(index, { policyType: v })} />
            </FieldShell>

            <FieldShell label="Policy Start Date" labelHi="पॉलिसी सुरुवात दिनांक">
              <DateField value={row.policyStartDate} onChange={(v) => onUpdate(index, { policyStartDate: v })} />
            </FieldShell>

            <FieldShell label="Policy End Date" labelHi="पॉलिसी समाप्ती दिनांक">
              <DateField value={row.policyEndDate} onChange={(v) => onUpdate(index, { policyEndDate: v })} />
            </FieldShell>

            <FieldShell label="Insurance Deceased Value (IDV)" labelHi="विमित घोषित मूल्य (IDV)">
              <TextInput icon={<IndianRupee size={16} />} value={row.idv} onChange={(v) => onUpdate(index, { idv: v })} />
            </FieldShell>

            <FieldShell label="Premium Frequency" labelHi="प्रीमियम वारंवारता">
              <SelectInput icon={<Calendar size={16} />} value={row.premiumFrequency} onChange={(v) => onUpdate(index, { premiumFrequency: v })} options={PREMIUM_FREQUENCIES} />
            </FieldShell>

            <FieldShell label="Premium Amount" labelHi="प्रीमियम रक्कम">
              <TextInput icon={<IndianRupee size={16} />} value={row.premiumAmount} onChange={(v) => onUpdate(index, { premiumAmount: v })} />
            </FieldShell>

            <FieldShell label="Total Insured Amount" labelHi="एकूण विमा रक्कम">
              <TextInput icon={<IndianRupee size={16} />} value={row.totalInsuredAmount} onChange={(v) => onUpdate(index, { totalInsuredAmount: v })} />
            </FieldShell>

            <FieldShell label="No Claim Bonus %" labelHi="नो क्लेम बोनस (%)">
              <TextInput icon={<Percent size={16} />} value={row.noClaimBonusPercent} onChange={(v) => onUpdate(index, { noClaimBonusPercent: v })} />
            </FieldShell>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <SectionHeader title="Loan & Security Details" titleHi="कर्ज व तारण तपशील" subtitle="Add your Vehicle details" subtitleHi="तुमचे वाहन तपशील जोडा" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <FieldShell label="Security Type Code" labelHi="तारण प्रकार">
              <SelectInput icon={<ShieldCheck size={16} />} value={row.securityTypeCode} onChange={(v) => onUpdate(index, { securityTypeCode: v })} options={VEHICLE_SECURITY_TYPES} />
            </FieldShell>

            <FieldShell label="Margin %" labelHi="मार्जिन (%)">
              <TextInput icon={<Percent size={16} />} value={row.marginPercent} onChange={(v) => onUpdate(index, { marginPercent: v })} />
            </FieldShell>
          </div>
        </div>
      </div>
    ))}
  </>
);

/* ------------------------------------------------------------------ */
/*  Plan & Machine repeatable tab                                      */
/* ------------------------------------------------------------------ */

interface PlanMachineSectionProps {
  rows: PlanMachineRow[];
  errors: Record<string, boolean>;
  onUpdate: (index: number, patch: Partial<PlanMachineRow>) => void;
  onDelete: (index: number) => void;
}

const PlanMachineSection: React.FC<PlanMachineSectionProps> = ({ rows, errors, onUpdate, onDelete }) => (
  <>
    {rows.map((row, index) => (
      <div key={row.srNo} className="relative rounded-[20px] border-x border-b border-t-4 border-primary bg-white dark:bg-slate-900 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        {rows.length > 1 && <DeleteRowButton label={`Plan & Machine ${row.srNo}`} onClick={() => onDelete(index)} />}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-black dark:text-slate-100">Sr No</label>
            <div className="flex h-[42px] w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              {row.srNo}
            </div>
          </div>

          <FieldShell label="Security Type Code" labelHi="तारण प्रकार">
            <SelectInput icon={<ShieldCheck size={16} />} value={row.securityTypeCode} onChange={(v) => onUpdate(index, { securityTypeCode: v })} options={MACHINE_SECURITY_TYPES} />
          </FieldShell>

          <FieldShell label="Machine Type" labelHi="मशीन प्रकार">
            <TextInput icon={<Wrench size={16} />} value={row.machineType} onChange={(v) => onUpdate(index, { machineType: v })} />
          </FieldShell>

          <FieldShell label="Machine Name" labelHi="मशीनचे नाव">
            <TextInput icon={<Wrench size={16} />} value={row.machineName} onChange={(v) => onUpdate(index, { machineName: v })} />
          </FieldShell>

          <YesNoField label="Is New Equipment ?" labelHi="नवीन उपकरण आहे का?" value={row.isNewEquipment} onChange={(v) => onUpdate(index, { isNewEquipment: v })} />

          <FieldShell label="Distinctive No." labelHi="वेगळा क्रमांक">
            <TextInput icon={<Hash size={16} />} value={row.distinctiveNumber} onChange={(v) => onUpdate(index, { distinctiveNumber: v })} />
          </FieldShell>

          <FieldShell label="Specification" labelHi="विशिष्टीकरण">
            <TextInput icon={<FileText size={16} />} value={row.specification} onChange={(v) => onUpdate(index, { specification: v })} />
          </FieldShell>

          <FieldShell label="Supplier Name" labelHi="पुरवठादाराचे नाव">
            <TextInput icon={<User size={16} />} value={row.supplierName} onChange={(v) => onUpdate(index, { supplierName: v })} />
          </FieldShell>

          <FieldShell label="Purchase Price" labelHi="खरेदी किंमत">
            <TextInput icon={<IndianRupee size={16} />} value={row.purchasePrice} onChange={(v) => onUpdate(index, { purchasePrice: v })} />
          </FieldShell>

          <div className="md:col-span-3">
            <FieldShell label="Particular" labelHi="विशेष">
              <TextInput icon={<FileText size={16} />} value={row.particular} onChange={(v) => onUpdate(index, { particular: v })} />
            </FieldShell>
          </div>

          <FieldShell label="Security Value" labelHi="सुरक्षा मूल्य" required error={errors[`pm-${index}-securityValue`]}>
            <TextInput icon={<Shield size={16} />} value={row.securityValue} onChange={(v) => onUpdate(index, { securityValue: v })} error={errors[`pm-${index}-securityValue`]} />
          </FieldShell>

          <FieldShell label="Acquisition Date" labelHi="स्वामित्व मिळाल्याची तारीख">
            <DateField value={row.acquisitionDate} onChange={(v) => onUpdate(index, { acquisitionDate: v })} />
          </FieldShell>

          <FieldShell label="Submission Date" labelHi="सबमिशन तारीख">
            <DateField value={row.submissionDate} onChange={(v) => onUpdate(index, { submissionDate: v })} />
          </FieldShell>

          <FieldShell label="Margin" labelHi="मार्जिन" required error={errors[`pm-${index}-marginPercent`]}>
            <TextInput icon={<Percent size={16} />} value={row.marginPercent} onChange={(v) => onUpdate(index, { marginPercent: v })} error={errors[`pm-${index}-marginPercent`]} />
          </FieldShell>
        </div>
      </div>
    ))}
  </>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export interface LoanAccountFormData {
  details: DetailsData;
  loan: LoanData;
  nominees: PartyRow[];
  guarantors: PartyRow[];
  landBuildingRows: LandBuildingRow[];
  goldSilverHeader: GoldSilverHeaderData;
  goldSilverItems: GoldSilverItemRow[];
  vehicles: VehicleRow[];
  planMachines: PlanMachineRow[];
  depositDetails: DepositDetailsData;
  wareHouse: WareHouseData;
}

const DEFAULT_DETAILS: DetailsData = {
  customerId: "00021",
  customerName: "Nitish Sai Readdy",
  categoryCode: "Public",
  riskCategory: "Low",
  introducerAccountCode: "1001",
  introducerAccountName: "Saving Account",
  dateOfApplication: "2026-02-27",
  accountOperationCapacityId: "Self",
  minBalanceId: "200",
};

const DEFAULT_LOAN: LoanData = {
  loanAmount: "",
  loanAmountInWords: "",
  interestRate: "",
  tenureMonths: "",
  repaymentFrequency: "Monthly",
  emiAmount: "",
  disbursementDate: "",
  purposeOfLoan: "",
};

const DEFAULT_GOLD_SILVER_HEADER: GoldSilverHeaderData = {
  securityTypeCode: GOLD_SECURITY_TYPES[0],
  submissionDate: "",
  receiptNumber: "",
  drawerNumber: "",
  bagNumber: "",
  valuatorName: "",
  valuationRatePerGram: "",
  totalValuation: "",
};

const DEFAULT_DEPOSIT_DETAILS: DepositDetailsData = {
  depositAccountNumber: "",
  depositHolderName: "",
  depositAmount: "",
  depositDate: "",
  maturityDate: "",
  lienAmount: "",
};

const DEFAULT_WAREHOUSE: WareHouseData = {
  warehouseName: "",
  receiptNumber: "",
  commodityDescription: "",
  quantity: "",
  storageValue: "",
  receiptDate: "",
  expiryDate: "",
};

interface AddLoanAccountModalProps {
  productDescription?: string;
  mode?: "add" | "view" | "edit";
  initialData?: Partial<LoanAccountFormData>;
  onClose?: () => void;
  onSave?: (payload: LoanAccountFormData) => void;
}

const AddLoanAccountModal: React.FC<AddLoanAccountModalProps> = ({ productDescription, mode = "add", initialData, onClose, onSave }) => {
  const category = resolveLoanCategory(productDescription);
  const TABS = TAB_SETS[category];
  const isViewMode = mode === "view";

  const [activeTab, setActiveTab] = useState<TabKey>(TABS[0]);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);

  const [details, setDetails] = useState<DetailsData>(initialData?.details ?? DEFAULT_DETAILS);
  const [loan, setLoan] = useState<LoanData>(initialData?.loan ?? DEFAULT_LOAN);

  const [nominees, setNominees] = useState<PartyRow[]>(initialData?.nominees ?? [emptyParty(1)]);
  const [guarantors, setGuarantors] = useState<PartyRow[]>(initialData?.guarantors ?? [emptyParty(1)]);

  const [goldSilverHeader, setGoldSilverHeader] = useState<GoldSilverHeaderData>(initialData?.goldSilverHeader ?? DEFAULT_GOLD_SILVER_HEADER);
  const [goldSilverItems, setGoldSilverItems] = useState<GoldSilverItemRow[]>(initialData?.goldSilverItems ?? [emptyGoldItem(1)]);

  const [landBuildingRows, setLandBuildingRows] = useState<LandBuildingRow[]>(initialData?.landBuildingRows ?? [emptyLandBuilding(1)]);
  const [vehicles, setVehicles] = useState<VehicleRow[]>(initialData?.vehicles ?? [emptyVehicle(1)]);
  const [planMachines, setPlanMachines] = useState<PlanMachineRow[]>(initialData?.planMachines ?? [emptyPlanMachine(1)]);

  const [depositDetails, setDepositDetails] = useState<DepositDetailsData>(initialData?.depositDetails ?? DEFAULT_DEPOSIT_DETAILS);
  const [wareHouse, setWareHouse] = useState<WareHouseData>(initialData?.wareHouse ?? DEFAULT_WAREHOUSE);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const applyIntroducerLookup = (code: string) => {
    const match = INTRODUCER_ACCOUNTS.find((a) => a.code === code);
    if (match) {
      setDetails((prev) => ({ ...prev, introducerAccountCode: match.code, introducerAccountName: match.name }));
    } else {
      setDetails((prev) => ({ ...prev, introducerAccountCode: code }));
    }
  };

  const recalculateGoldValuation = () => {
    const total = goldSilverItems.reduce((sum, item) => sum + num(item.marketValue), 0);
    setGoldSilverHeader((prev) => ({ ...prev, totalValuation: total ? total.toLocaleString("en-IN") : "" }));
  };

  const validateActiveTab = (): boolean => {
    const nextErrors: Record<string, boolean> = {};

    if (activeTab === "Details" || activeTab === "Application") {
      if (!details.customerId) nextErrors.customerId = true;
      if (!details.customerName) nextErrors.customerName = true;
      if (!details.introducerAccountCode) nextErrors.introducerAccountCode = true;
      if (!details.dateOfApplication) nextErrors.dateOfApplication = true;
    }

    if (activeTab === "Loan") {
      if (!loan.loanAmount) nextErrors.loanAmount = true;
      if (!loan.interestRate) nextErrors.interestRate = true;
      if (!loan.tenureMonths) nextErrors.tenureMonths = true;
      if (!loan.disbursementDate) nextErrors.disbursementDate = true;
    }

    if (activeTab === "Nominee") {
      nominees.forEach((row, i) => {
        if (!row.customerId) nextErrors[`nominee-${i}-customerId`] = true;
        if (!row.name) nextErrors[`nominee-${i}-name`] = true;
        if (!row.zip) nextErrors[`nominee-${i}-zip`] = true;
      });
    }

    if (activeTab === "Guarantor") {
      guarantors.forEach((row, i) => {
        if (!row.customerId) nextErrors[`guarantor-${i}-customerId`] = true;
        if (!row.name) nextErrors[`guarantor-${i}-name`] = true;
        if (!row.zip) nextErrors[`guarantor-${i}-zip`] = true;
      });
    }

    if (activeTab === "Gold & Silver") {
      if (!goldSilverHeader.securityTypeCode) nextErrors.securityTypeCode = true;
      if (!goldSilverHeader.receiptNumber) nextErrors.receiptNumber = true;
      if (!goldSilverHeader.drawerNumber) nextErrors.drawerNumber = true;
      if (!goldSilverHeader.valuatorName) nextErrors.valuatorName = true;
      if (!goldSilverHeader.valuationRatePerGram) nextErrors.valuationRatePerGram = true;
      if (!goldSilverHeader.totalValuation) nextErrors.totalValuation = true;
    }

    if (activeTab === "Land & Building") {
      landBuildingRows.forEach((row, i) => {
        if (!row.securityTypeCode) nextErrors[`lb-${i}-securityTypeCode`] = true;
        if (!row.location) nextErrors[`lb-${i}-location`] = true;
        if (!row.area) nextErrors[`lb-${i}-area`] = true;
        if (!row.east) nextErrors[`lb-${i}-east`] = true;
        if (!row.west) nextErrors[`lb-${i}-west`] = true;
        if (!row.north) nextErrors[`lb-${i}-north`] = true;
        if (!row.south) nextErrors[`lb-${i}-south`] = true;
        if (!row.margin) nextErrors[`lb-${i}-margin`] = true;
        if (!row.securedValue) nextErrors[`lb-${i}-securedValue`] = true;
        if (!row.amountValued) nextErrors[`lb-${i}-amountValued`] = true;
        if (!row.particular) nextErrors[`lb-${i}-particular`] = true;
        if (!row.engineerName) nextErrors[`lb-${i}-engineerName`] = true;
      });
    }

    if (activeTab === "Motor-Insurance") {
      vehicles.forEach((row, i) => {
        if (!row.vehicleType) nextErrors[`veh-${i}-vehicleType`] = true;
      });
    }

    if (activeTab === "Plan & Machine") {
      planMachines.forEach((row, i) => {
        if (!row.securityValue) nextErrors[`pm-${i}-securityValue`] = true;
        if (!row.marginPercent) nextErrors[`pm-${i}-marginPercent`] = true;
      });
    }

    if (activeTab === "Deposit Details") {
      if (!depositDetails.depositAccountNumber) nextErrors.depositAccountNumber = true;
      if (!depositDetails.depositAmount) nextErrors.depositAmount = true;
    }

    if (activeTab === "WareHouse") {
      if (!wareHouse.warehouseName) nextErrors.warehouseName = true;
      if (!wareHouse.receiptNumber) nextErrors.receiptNumber = true;
      if (!wareHouse.storageValue) nextErrors.storageValue = true;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Handler for main customer selection
  const handleCustomerSelect = (customer: CustomerOption) => {
    setDetails((prev) => ({
      ...prev,
      customerId: customer.customerId,
      customerName: customer.customerName,
    }));
  };

  // Handler for nominee customer selection
  const handleNomineeSelect = (index: number, customer: CustomerOption) => {
    updateRow(setNominees, index, {
      customerId: customer.customerId,
      name: customer.customerName,
    });
  };

  // Handler for guarantor customer selection
  const handleGuarantorSelect = (index: number, customer: CustomerOption) => {
    updateRow(setGuarantors, index, {
      customerId: customer.customerId,
      name: customer.customerName,
    });
  };

  const handleValidate = () => {
    const ok = validateActiveTab();
    if (ok) window.alert(`${activeTab} tab looks good.`);
  };

  const handleNext = () => {
    if (!validateActiveTab()) return;
    const idx = TABS.indexOf(activeTab);
    if (idx < TABS.length - 1) {
      setActiveTab(TABS[idx + 1]);
      setErrors({});
    }
  };

  const handleCancel = () => {
    onClose?.();
  };

  const handleSave = () => {
    if (!validateActiveTab()) return;
    setSaveMenuOpen(false);
    onSave?.({ details, loan, nominees, guarantors, landBuildingRows, goldSilverHeader, goldSilverItems, vehicles, planMachines, depositDetails, wareHouse });
  };

  const isLastTab = activeTab === TABS[TABS.length - 1];

  const handleAddForActiveTab = () => {
    if (activeTab === "Nominee") addRow(setNominees, emptyParty);
    if (activeTab === "Guarantor") addRow(setGuarantors, emptyParty);
    if (activeTab === "Land & Building") addRow(setLandBuildingRows, emptyLandBuilding);
    if (activeTab === "Motor-Insurance") addRow(setVehicles, emptyVehicle);
    if (activeTab === "Plan & Machine") addRow(setPlanMachines, emptyPlanMachine);
  };

  const showsAddButton = !isViewMode && ["Nominee", "Guarantor", "Land & Building", "Motor-Insurance", "Plan & Machine"].includes(activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 flex-shrink-0">
               {mode === "view" ? <Image src={IMAGES.PERSON_ICON} alt="" width={40} height={40} /> : mode === "edit" ? <Image src={IMAGES.PERSON_EDIT_ICON} alt="" width={40} height={40} /> : <Image src={IMAGES.PERSON_ICON} alt="" width={40} height={40} />}{" "}
              {/* <Image src={IMAGES.PERSON_ICON} alt="" width={40} height={40} /> */}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {mode === "view" ? "View Loan Account" : mode === "edit" ? "Edit Loan Account" : "Add Loan Account"}/{" "}
                <span className= "text-slate-500 dark:text-slate-400">कर्ज खाते {mode === "view" ? "पहा" : mode === "edit" ? "संपादित करा" : "जोडा"}</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add some basic information related to the Employee / कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती जोडा
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab ? "text-primary" : "text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                }`}
              >
                {tab}
                {activeTab === tab && <span className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-primary" />}
              </button>
            ))}
          </div>
          {showsAddButton && (
            <button
              onClick={handleAddForActiveTab}
              className="mb-2 flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Plus size={16} /> Add
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mt-3 max-h-[60vh] space-y-3 overflow-y-auto pr-1 ">
        <fieldset disabled={isViewMode} className="contents">
          {(activeTab === "Details" || activeTab === "Application") && (
            <div className="relative rounded-[20px] border-x border-b border-t-4 border-primary bg-white dark:bg-slate-900 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={errors.customerId}>
                  <CustomerIdPicklistField
                    label=""
                    value={details.customerId}
                    placeholder="Select Customer"
                    onSelect={handleCustomerSelect}
                    preFetch={false}
                    pageSize={10}
                  />
                </FieldShell>

                <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required error={errors.customerName}>
                  <TextInput icon={<User size={16} />} value={details.customerName} onChange={() => {}} readOnly />
                </FieldShell>

                <FieldShell label="Category Code" labelHi="कॅटेगरी कोड" required>
                  <TextInput icon={<Tag size={16} />} value={details.categoryCode} onChange={() => {}} readOnly />
                </FieldShell>

                <FieldShell label="Risk Category" labelHi="धोक्याचा प्रकार" required>
                  <TextInput icon={<AlertTriangle size={16} />} value={details.riskCategory} onChange={() => {}} readOnly />
                </FieldShell>

                <FieldShell label="Introducer Account Code" labelHi="ओळखपत्र खात्याचा कोड" required error={errors.introducerAccountCode}>
                  <TextInput
                    icon={<ChevronsLeftRight size={16} />}
                    value={details.introducerAccountCode}
                    onChange={applyIntroducerLookup}
                    error={errors.introducerAccountCode}
                  />
                </FieldShell>

                <FieldShell label="Introducer Account Name" labelHi="ओळखपत्र खात्याचे नाव" required>
                  <TextInput icon={<User size={16} />} value={details.introducerAccountName} onChange={() => {}} readOnly />
                </FieldShell>

                <FieldShell label="Date of Application" labelHi="अर्जाची तारीख" required error={errors.dateOfApplication}>
                  <DateField
                    value={details.dateOfApplication}
                    onChange={(v) => setDetails((prev) => ({ ...prev, dateOfApplication: v }))}
                    error={errors.dateOfApplication}
                  />
                </FieldShell>

                <FieldShell label="Account Operation Capacity ID" labelHi="खाते ऑपरेशन क्षमता आयडी" required>
                  <SelectInput
                    icon={<User size={16} />}
                    value={details.accountOperationCapacityId}
                    onChange={(v) => setDetails((prev) => ({ ...prev, accountOperationCapacityId: v }))}
                    options={ACCOUNT_OPERATION_CAPACITY}
                  />
                </FieldShell>

                <FieldShell label="Min Balance ID" labelHi="किमान शिल्लक आयडी" required>
                  <SelectInput
                    icon={<Users size={16} />}
                    value={details.minBalanceId}
                    onChange={(v) => setDetails((prev) => ({ ...prev, minBalanceId: v }))}
                    options={MIN_BALANCE_IDS}
                  />
                </FieldShell>
              </div>
            </div>
          )}

          {activeTab === "Loan" && (
            <div className="relative rounded-[20px] border-x border-b border-t-4 border-primary bg-white dark:bg-slate-900 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <FieldShell label="Loan Amount" labelHi="कर्जाची रक्कम" required error={errors.loanAmount}>
                  <TextInput
                    icon={<IndianRupee size={16} />}
                    value={loan.loanAmount}
                    onChange={(v) => setLoan((prev) => ({ ...prev, loanAmount: v }))}
                    error={errors.loanAmount}
                  />
                </FieldShell>

                <FieldShell label="Loan Amount in Words" labelHi="कर्जाची रक्कम शब्दांमध्ये">
                  <TextInput icon={<IndianRupee size={16} />} value={loan.loanAmountInWords} onChange={(v) => setLoan((prev) => ({ ...prev, loanAmountInWords: v }))} />
                </FieldShell>

                <FieldShell label="Interest Rate" labelHi="व्याज दर" required error={errors.interestRate}>
                  <TextInput icon={<Percent size={16} />} value={loan.interestRate} onChange={(v) => setLoan((prev) => ({ ...prev, interestRate: v }))} error={errors.interestRate} />
                </FieldShell>

                <FieldShell label="Tenure (Months)" labelHi="कालावधी (महिने)" required error={errors.tenureMonths}>
                  <TextInput icon={<Calendar size={16} />} value={loan.tenureMonths} onChange={(v) => setLoan((prev) => ({ ...prev, tenureMonths: v }))} error={errors.tenureMonths} />
                </FieldShell>

                <FieldShell label="Repayment Frequency" labelHi="परतफेड वारंवारिता" required>
                  <SelectInput icon={<Calendar size={16} />} value={loan.repaymentFrequency} onChange={(v) => setLoan((prev) => ({ ...prev, repaymentFrequency: v }))} options={REPAYMENT_FREQUENCIES} />
                </FieldShell>

                <FieldShell label="EMI Amount" labelHi="हप्ता रक्कम">
                  <TextInput icon={<IndianRupee size={16} />} value={loan.emiAmount} onChange={(v) => setLoan((prev) => ({ ...prev, emiAmount: v }))} />
                </FieldShell>

                <FieldShell label="Disbursement Date" labelHi="वितरण तारीख" required error={errors.disbursementDate}>
                  <DateField value={loan.disbursementDate} onChange={(v) => setLoan((prev) => ({ ...prev, disbursementDate: v }))} error={errors.disbursementDate} />
                </FieldShell>

                <FieldShell label="Purpose of Loan" labelHi="कर्जाचा उद्देश">
                  <TextInput icon={<FileText size={16} />} value={loan.purposeOfLoan} onChange={(v) => setLoan((prev) => ({ ...prev, purposeOfLoan: v }))} />
                </FieldShell>
              </div>
            </div>
          )}

          {activeTab === "Nominee" && (
            <PartyTab
              rows={nominees}
              entityLabel="Nominee"
              entityLabelHi="नॉमिनी"
              errorPrefix="nominee"
              errors={errors}
              onUpdate={(index, patch) => updateRow(setNominees, index, patch)}
              onDelete={(index) => deleteRow(setNominees, index)}
              onCustomerSelect={handleNomineeSelect}
            />
          )}

          {activeTab === "Guarantor" && (
            <PartyTab
              rows={guarantors}
              entityLabel="Guarantor"
              entityLabelHi="जामीनदार"
              errorPrefix="guarantor"
              errors={errors}
              onUpdate={(index, patch) => updateRow(setGuarantors, index, patch)}
              onDelete={(index) => deleteRow(setGuarantors, index)}
              onCustomerSelect={handleGuarantorSelect}
            />
          )}

          {activeTab === "Gold & Silver" && (
            <GoldSilverSection
              header={goldSilverHeader}
              items={goldSilverItems}
              errors={errors}
              onHeaderChange={(patch) => setGoldSilverHeader((prev) => ({ ...prev, ...patch }))}
              onItemChange={(index, patch) => updateRow(setGoldSilverItems, index, patch)}
              onAddItem={() => addRow(setGoldSilverItems, emptyGoldItem)}
              onDeleteItem={(index) => deleteRow(setGoldSilverItems, index)}
              onRecalculate={recalculateGoldValuation}
            />
          )}

          {activeTab === "Land & Building" && (
            <LandBuildingSection
              rows={landBuildingRows}
              errors={errors}
              onUpdate={(index, patch) => updateRow(setLandBuildingRows, index, patch)}
              onDelete={(index) => deleteRow(setLandBuildingRows, index)}
            />
          )}

          {activeTab === "Motor-Insurance" && (
            <VehicleSection
              rows={vehicles}
              errors={errors}
              onUpdate={(index, patch) => updateRow(setVehicles, index, patch)}
              onDelete={(index) => deleteRow(setVehicles, index)}
            />
          )}

          {activeTab === "Plan & Machine" && (
            <PlanMachineSection
              rows={planMachines}
              errors={errors}
              onUpdate={(index, patch) => updateRow(setPlanMachines, index, patch)}
              onDelete={(index) => deleteRow(setPlanMachines, index)}
            />
          )}

          {activeTab === "Deposit Details" && (
            <div className="relative rounded-[20px] border-x border-b border-t-4 border-primary bg-white dark:bg-slate-900 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <FieldShell label="Deposit Account Number" labelHi="ठेव खाते क्रमांक" required error={errors.depositAccountNumber}>
                  <TextInput icon={<IdCard size={16} />} value={depositDetails.depositAccountNumber} onChange={(v) => setDepositDetails((prev) => ({ ...prev, depositAccountNumber: v }))} error={errors.depositAccountNumber} />
                </FieldShell>

                <FieldShell label="Deposit Holder Name" labelHi="ठेवधारकाचे नाव">
                  <TextInput icon={<User size={16} />} value={depositDetails.depositHolderName} onChange={(v) => setDepositDetails((prev) => ({ ...prev, depositHolderName: v }))} />
                </FieldShell>

                <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required error={errors.depositAmount}>
                  <TextInput icon={<IndianRupee size={16} />} value={depositDetails.depositAmount} onChange={(v) => setDepositDetails((prev) => ({ ...prev, depositAmount: v }))} error={errors.depositAmount} />
                </FieldShell>

                <FieldShell label="Deposit Date" labelHi="ठेव तारीख">
                  <DateField value={depositDetails.depositDate} onChange={(v) => setDepositDetails((prev) => ({ ...prev, depositDate: v }))} />
                </FieldShell>

                <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख">
                  <DateField value={depositDetails.maturityDate} onChange={(v) => setDepositDetails((prev) => ({ ...prev, maturityDate: v }))} />
                </FieldShell>

                <FieldShell label="Lien Amount" labelHi="धारणाधिकार रक्कम">
                  <TextInput icon={<IndianRupee size={16} />} value={depositDetails.lienAmount} onChange={(v) => setDepositDetails((prev) => ({ ...prev, lienAmount: v }))} />
                </FieldShell>
              </div>
            </div>
          )}

          {activeTab === "WareHouse" && (
            <div className="relative rounded-[20px] border-x border-b border-t-4 border-primary bg-white dark:bg-slate-900 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <FieldShell label="Warehouse Name" labelHi="गोदामाचे नाव" required error={errors.warehouseName}>
                  <TextInput icon={<Building2 size={16} />} value={wareHouse.warehouseName} onChange={(v) => setWareHouse((prev) => ({ ...prev, warehouseName: v }))} error={errors.warehouseName} />
                </FieldShell>

                <FieldShell label="Warehouse Receipt Number" labelHi="गोदाम पावती क्रमांक" required error={errors.receiptNumber}>
                  <TextInput icon={<FileText size={16} />} value={wareHouse.receiptNumber} onChange={(v) => setWareHouse((prev) => ({ ...prev, receiptNumber: v }))} error={errors.receiptNumber} />
                </FieldShell>

                <FieldShell label="Commodity Description" labelHi="मालाचे वर्णन">
                  <TextInput icon={<FileText size={16} />} value={wareHouse.commodityDescription} onChange={(v) => setWareHouse((prev) => ({ ...prev, commodityDescription: v }))} />
                </FieldShell>

                <FieldShell label="Quantity" labelHi="प्रमाण">
                  <TextInput icon={<Hash size={16} />} value={wareHouse.quantity} onChange={(v) => setWareHouse((prev) => ({ ...prev, quantity: v }))} />
                </FieldShell>

                <FieldShell label="Storage Value" labelHi="साठवण मूल्य" required error={errors.storageValue}>
                  <TextInput icon={<IndianRupee size={16} />} value={wareHouse.storageValue} onChange={(v) => setWareHouse((prev) => ({ ...prev, storageValue: v }))} error={errors.storageValue} />
                </FieldShell>

                <FieldShell label="Receipt Date" labelHi="पावती तारीख">
                  <DateField value={wareHouse.receiptDate} onChange={(v) => setWareHouse((prev) => ({ ...prev, receiptDate: v }))} />
                </FieldShell>

                <FieldShell label="Expiry Date" labelHi="समाप्ती तारीख">
                  <DateField value={wareHouse.expiryDate} onChange={(v) => setWareHouse((prev) => ({ ...prev, expiryDate: v }))} />
                </FieldShell>
              </div>
            </div>
          )}
        </fieldset>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          {isViewMode ? (
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Close <X size={16} />
            </button>
          ) : (
            <>
          <button
            onClick={handleValidate}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Validate <Check size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancel <X size={16} />
          </button>

          {!isLastTab ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-lg bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-200"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setSaveMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-lg bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-200"
              >
                Save <ChevronDown size={16} />
              </button>
              {saveMenuOpen && (
                <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1 shadow-lg">
                  <button onClick={handleSave} className="block w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-800">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      handleSave();
                      setDetails((prev) => ({ ...prev, customerId: "", customerName: "" }));
                      setActiveTab(TABS[0]);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-800"
                  >
                    Save & New
                  </button>
                </div>
              )}
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLoanAccountModal;