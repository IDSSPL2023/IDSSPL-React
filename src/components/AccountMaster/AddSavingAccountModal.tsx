import React, { useState, useRef, useEffect } from "react";
import CityPicklistField from "@/components/common/CityPicklistField";
import StatePicklistField from "@/components/common/StatePicklistField";
import {
  X,
  Plus,
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
  MoreVertical,
  Home,
  Hash,
  Building2,
  MapPin,
  Flag,
  UserPlus,
} from "lucide-react";
import { CountryPicklistField } from "@/components/common";

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

interface ApplicationData {
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

interface NomineeRow {
  srNo: number;
  salutationCode: string;
  nomineeCustomerId: string;
  nomineeName: string;
  relation: string;
  address1: string;
  address2: string;
  address3: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

interface JointHolderRow {
  srNo: number;
  salutationCode: string;
  jtHolderCustomerId: string;
  jtHolderName: string;
  address1: string;
  address2: string;
  address3: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

type TabKey = "Application" | "Nominee" | "Joint Holder";

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
const SALUTATIONS = ["MR", "MRS", "MS", "DR"];
const RELATIONS = ["Father", "Mother", "Spouse", "Son", "Daughter", "Brother", "Sister"];
const CITIES = ["Kolhapur", "Mumbai", "Pune", "Nagpur"];

const emptyNominee = (srNo: number): NomineeRow => ({
  srNo,
  salutationCode: "MR",
  nomineeCustomerId: "",
  nomineeName: "",
  relation: "Father",
  address1: "",
  address2: "",
  address3: "",
  zip: "",
  city: "Kolhapur",
  state: "Maharashtra",
  country: "India",
});

const emptyJointHolder = (srNo: number): JointHolderRow => ({
  srNo,
  salutationCode: "MR",
  jtHolderCustomerId: "",
  jtHolderName: "",
  address1: "",
  address2: "",
  address3: "",
  zip: "",
  city: "Kolhapur",
  state: "Maharashtra",
  country: "India",
});

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
      {labelHi && <span className="text-slate-600 dark:text-slate-400"> / {labelHi}</span>}
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
  <div className="relative flex items-center">
    <span className="pointer-events-none absolute left-3 text-slate-400">{icon}</span>
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border bg-white py-2.5 pl-9 ${trailing ? "pr-11" : "pr-3"} text-sm text-slate-700 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:bg-slate-900 dark:text-slate-100 ${
        readOnly ? "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400" : ""
      } ${error ? "border-red-400" : "border-slate-400 dark:border-slate-700"}`}
    />
    {trailing && <span className="absolute right-2">{trailing}</span>}
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
      className={`w-full appearance-none rounded-lg border bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:bg-slate-900 dark:text-slate-100 ${
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

/* Small popover used for Customer ID / Introducer Account Code lookups */
interface LookupButtonProps {
  items: string[];
  onPick: (item: string) => void;
}

const LookupButton: React.FC<LookupButtonProps> = ({ items, onPick }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-slate-200 bg-primary-50 text-primary transition-colors hover:bg-primary-100"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-20 max-h-52 w-40 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                onPick(item);
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

interface AddSavingAccountModalProps {
  onClose?: () => void;
  onSave?: (payload: { application: ApplicationData; nominees: NomineeRow[]; jointHolders: JointHolderRow[] }) => void;
}

const TABS: TabKey[] = ["Application", "Nominee", "Joint Holder"];

const AddSavingAccountModal: React.FC<AddSavingAccountModalProps> = ({ onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("Application");
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);

  const [application, setApplication] = useState<ApplicationData>({
    customerId: "00012",
    customerName: "Akshay Om More",
    categoryCode: "Public",
    riskCategory: "Low",
    introducerAccountCode: "1001",
    introducerAccountName: "Saving Account",
    dateOfApplication: "2026-02-27",
    accountOperationCapacityId: "Self",
    minBalanceId: "200",
  });

  const [nominees, setNominees] = useState<NomineeRow[]>([emptyNominee(1)]);
  const [jointHolders, setJointHolders] = useState<JointHolderRow[]>([emptyJointHolder(1)]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const applyCustomerLookup = (id: string) => {
    const match = CUSTOMERS.find((c) => c.id === id);
    if (match) {
      setApplication((prev) => ({
        ...prev,
        customerId: match.id,
        customerName: match.name,
        categoryCode: match.category,
        riskCategory: match.risk,
      }));
    } else {
      setApplication((prev) => ({ ...prev, customerId: id }));
    }
  };

  const applyIntroducerLookup = (code: string) => {
    const match = INTRODUCER_ACCOUNTS.find((a) => a.code === code);
    if (match) {
      setApplication((prev) => ({ ...prev, introducerAccountCode: match.code, introducerAccountName: match.name }));
    } else {
      setApplication((prev) => ({ ...prev, introducerAccountCode: code }));
    }
  };

  const updateNominee = (index: number, patch: Partial<NomineeRow>) => {
    setNominees((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const updateJointHolder = (index: number, patch: Partial<JointHolderRow>) => {
    setJointHolders((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const applyNomineeLookup = (index: number, id: string) => {
    const match = CUSTOMERS.find((c) => c.id === id);
    updateNominee(index, match ? { nomineeCustomerId: match.id, nomineeName: match.name } : { nomineeCustomerId: id });
  };

  const applyJointHolderLookup = (index: number, id: string) => {
    const match = CUSTOMERS.find((c) => c.id === id);
    updateJointHolder(index, match ? { jtHolderCustomerId: match.id, jtHolderName: match.name } : { jtHolderCustomerId: id });
  };

  const validateActiveTab = (): boolean => {
    const nextErrors: Record<string, boolean> = {};

    if (activeTab === "Application") {
      if (!application.customerId) nextErrors.customerId = true;
      if (!application.customerName) nextErrors.customerName = true;
      if (!application.introducerAccountCode) nextErrors.introducerAccountCode = true;
      if (!application.dateOfApplication) nextErrors.dateOfApplication = true;
    }

    if (activeTab === "Nominee") {
      nominees.forEach((row, i) => {
        if (!row.nomineeCustomerId) nextErrors[`nominee-${i}-nomineeCustomerId`] = true;
        if (!row.nomineeName) nextErrors[`nominee-${i}-nomineeName`] = true;
        if (!row.zip) nextErrors[`nominee-${i}-zip`] = true;
      });
    }

    if (activeTab === "Joint Holder") {
      jointHolders.forEach((row, i) => {
        if (!row.jtHolderName) nextErrors[`jh-${i}-jtHolderName`] = true;
        if (!row.zip) nextErrors[`jh-${i}-zip`] = true;
      });
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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
    onSave?.({ application, nominees, jointHolders });
  };

  const isLastTab = activeTab === TABS[TABS.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white">
                <User size={16} fill="white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                <Plus size={12} strokeWidth={3} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Add Saving Account/ <span className="text-emerald-600 dark:text-emerald-400">सेविंग अकाउंट जोडा</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add some basic information related to the Employee / कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती जोडा
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className=" flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab ? "text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {tab}
                {activeTab === tab && <span className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-primary" />}
              </button>
            ))}
          </div>
          {activeTab !== "Application" && (
            <button
              onClick={() =>
                activeTab === "Nominee"
                  ? setNominees((prev) => [...prev, emptyNominee(prev.length + 1)])
                  : setJointHolders((prev) => [...prev, emptyJointHolder(prev.length + 1)])
              }
              className="mb-2 flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Plus size={16} /> Add
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mt-3 max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {activeTab === "Application" && (
            <div className="rounded-xl border border-primary-500 p-5 dark:bg-slate-900/40">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required error={errors.customerId}>
                  <TextInput
                    icon={<IdCard size={16} />}
                    value={application.customerId}
                    onChange={(v) => setApplication((prev) => ({ ...prev, customerId: v }))}
                    error={errors.customerId}
                    trailing={<LookupButton items={CUSTOMERS.map((c) => c.id)} onPick={applyCustomerLookup} />}
                  />
                </FieldShell>

                <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required error={errors.customerName}>
                  <TextInput icon={<User size={16} />} value={application.customerName} onChange={() => {}} readOnly />
                </FieldShell>

                <FieldShell label="Category Code" labelHi="कॅटेगरी कोड" required>
                  <TextInput icon={<Tag size={16} />} value={application.categoryCode} onChange={() => {}} readOnly />
                </FieldShell>

                <FieldShell label="Risk Category" labelHi="धोक्याचा प्रकार" required>
                  <TextInput icon={<AlertTriangle size={16} />} value={application.riskCategory} onChange={() => {}} readOnly />
                </FieldShell>

                <FieldShell label="Introducer Account Code" labelHi="ओळखपत्र खात्याचा कोड" required error={errors.introducerAccountCode}>
                  <TextInput
                    icon={<ChevronsLeftRight size={16} />}
                    value={application.introducerAccountCode}
                    onChange={(v) => setApplication((prev) => ({ ...prev, introducerAccountCode: v }))}
                    error={errors.introducerAccountCode}
                    trailing={<LookupButton items={INTRODUCER_ACCOUNTS.map((a) => a.code)} onPick={applyIntroducerLookup} />}
                  />
                </FieldShell>

                <FieldShell label="Introducer Account Name" labelHi="ओळखपत्र खात्याचे नाव" required>
                  <TextInput icon={<User size={16} />} value={application.introducerAccountName} onChange={() => {}} readOnly />
                </FieldShell>

                <FieldShell label="Date of Application" labelHi="अर्जाची तारीख" required error={errors.dateOfApplication}>
                  <div className="relative flex items-center">
                    <span className="pointer-events-none absolute left-3 text-slate-400">
                      <Calendar size={16} />
                    </span>
                    <input
                      type="date"
                      value={application.dateOfApplication}
                      onChange={(e) => setApplication((prev) => ({ ...prev, dateOfApplication: e.target.value }))}
                      className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
                        errors.dateOfApplication ? "border-red-400" : "border-slate-400"
                      }`}
                    />
                  </div>
                </FieldShell>

                <FieldShell label="Account Operation Capacity ID" labelHi="खाते ऑपरेशन क्षमता आयडी" required>
                  <SelectInput
                    icon={<User size={16} />}
                    value={application.accountOperationCapacityId}
                    onChange={(v) => setApplication((prev) => ({ ...prev, accountOperationCapacityId: v }))}
                    options={ACCOUNT_OPERATION_CAPACITY}
                  />
                </FieldShell>

                <FieldShell label="Min Balance ID" labelHi="किमान शिल्लक आयडी" required>
                  <SelectInput
                    icon={<Users size={16} />}
                    value={application.minBalanceId}
                    onChange={(v) => setApplication((prev) => ({ ...prev, minBalanceId: v }))}
                    options={MIN_BALANCE_IDS}
                  />
                </FieldShell>
              </div>
            </div>
          )}

          {activeTab === "Nominee" &&
            nominees.map((row, index) => (
              <div key={row.srNo} className="rounded-xl border border-primary-500 p-5 dark:bg-slate-900/40">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Sr No</label>
                    <div className="flex h-[42px] w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      {row.srNo}
                    </div>
                  </div>

                  <FieldShell label="Salutation Code" labelHi="संबोधनी" required>
                    <SelectInput icon={<User size={16} />} value={row.salutationCode} onChange={(v) => updateNominee(index, { salutationCode: v })} options={SALUTATIONS} />
                  </FieldShell>

                  <FieldShell label="Nominee Customer ID" labelHi="नॉमिनी ग्राहक आयडी" required error={errors[`nominee-${index}-nomineeCustomerId`]}>
                    <TextInput
                      icon={<IdCard size={16} />}
                      value={row.nomineeCustomerId}
                      onChange={(v) => updateNominee(index, { nomineeCustomerId: v })}
                      error={errors[`nominee-${index}-nomineeCustomerId`]}
                      trailing={<LookupButton items={CUSTOMERS.map((c) => c.id)} onPick={(id) => applyNomineeLookup(index, id)} />}
                    />
                  </FieldShell>

                  <FieldShell label="Nominee Name" labelHi="नॉमिनी नाव" required error={errors[`nominee-${index}-nomineeName`]}>
                    <TextInput icon={<User size={16} />} value={row.nomineeName} onChange={(v) => updateNominee(index, { nomineeName: v })} error={errors[`nominee-${index}-nomineeName`]} />
                  </FieldShell>

                  <FieldShell label="Relation" labelHi="नाते" required>
                    <SelectInput icon={<Users size={16} />} value={row.relation} onChange={(v) => updateNominee(index, { relation: v })} options={RELATIONS} />
                  </FieldShell>

                  <FieldShell label="Address 1" labelHi="पत्ता १" required>
                    <TextInput icon={<Home size={16} />} value={row.address1} onChange={(v) => updateNominee(index, { address1: v })} />
                  </FieldShell>

                  <FieldShell label="Address 2" labelHi="पत्ता २" required>
                    <TextInput icon={<Home size={16} />} value={row.address2} onChange={(v) => updateNominee(index, { address2: v })} />
                  </FieldShell>

                  <FieldShell label="Address 3" labelHi="पत्ता ३">
                    <TextInput icon={<Home size={16} />} value={row.address3} onChange={(v) => updateNominee(index, { address3: v })} />
                  </FieldShell>

                  <FieldShell label="Zip" labelHi="पिन कोड" required error={errors[`nominee-${index}-zip`]}>
                    <TextInput icon={<Hash size={16} />} value={row.zip} onChange={(v) => updateNominee(index, { zip: v })} error={errors[`nominee-${index}-zip`]} />
                  </FieldShell>

                  <CityPicklistField label="City" labelHi="शहरे" required icon={<Building2 size={16} />} value={row.city} onSelect={(city) => updateNominee(index, { city: city.name })} />

                  <StatePicklistField
                    label="State"
                    labelHi="राज्य"
                    icon={<MapPin size={16} />}
                    value={row.state}
                    onSelect={(s) => updateNominee(index, { state: s.stateName })}
                    required
                  />

                  <CountryPicklistField
                    label="Country"
                    labelHi="देश"
                    icon={<Flag size={16} />}
                    value={row.country}
                    onSelect={(c) => updateNominee(index, { country: c.name })}
                    required
                  />
                </div>
              </div>
            ))}

          {activeTab === "Joint Holder" &&
            jointHolders.map((row, index) => (
              <div key={row.srNo} className="rounded-xl border border-primary-500 p-5 dark:bg-slate-900/40">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Sr No</label>
                    <div className="flex h-[42px] w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      {row.srNo}
                    </div>
                  </div>

                  <FieldShell label="Salutation Code" labelHi="संबोधनी" required>
                    <SelectInput icon={<User size={16} />} value={row.salutationCode} onChange={(v) => updateJointHolder(index, { salutationCode: v })} options={SALUTATIONS} />
                  </FieldShell>

                  <FieldShell label="J/T Holder Customer ID" labelHi="J/T धारक ग्राहक आयडी">
                    <TextInput
                      icon={<IdCard size={16} />}
                      value={row.jtHolderCustomerId}
                      onChange={(v) => updateJointHolder(index, { jtHolderCustomerId: v })}
                      trailing={<LookupButton items={CUSTOMERS.map((c) => c.id)} onPick={(id) => applyJointHolderLookup(index, id)} />}
                    />
                  </FieldShell>

                  <FieldShell label="J/T Holder Name" labelHi="J/T धारकाचे नाव" required error={errors[`jh-${index}-jtHolderName`]}>
                    <TextInput icon={<User size={16} />} value={row.jtHolderName} onChange={(v) => updateJointHolder(index, { jtHolderName: v })} error={errors[`jh-${index}-jtHolderName`]} />
                  </FieldShell>

                  <FieldShell label="Address 1" labelHi="पत्ता १" required>
                    <TextInput icon={<Home size={16} />} value={row.address1} onChange={(v) => updateJointHolder(index, { address1: v })} />
                  </FieldShell>

                  <FieldShell label="Address 2" labelHi="पत्ता २" required>
                    <TextInput icon={<Home size={16} />} value={row.address2} onChange={(v) => updateJointHolder(index, { address2: v })} />
                  </FieldShell>

                  <FieldShell label="Address 3" labelHi="पत्ता ३">
                    <TextInput icon={<Home size={16} />} value={row.address3} onChange={(v) => updateJointHolder(index, { address3: v })} />
                  </FieldShell>

                  <FieldShell label="Zip" labelHi="पिन कोड" required error={errors[`jh-${index}-zip`]}>
                    <TextInput icon={<Hash size={16} />} value={row.zip} onChange={(v) => updateJointHolder(index, { zip: v })} error={errors[`jh-${index}-zip`]} />
                  </FieldShell>

                  <CityPicklistField label="City" labelHi="शहरे" required icon={<Building2 size={16} />} value={row.city} onSelect={(city) => updateJointHolder(index, { city: city.name })} />

                  <StatePicklistField
                    label="State"
                    labelHi="राज्य"
                    icon={<MapPin size={16} />}
                    value={row.state}
                    onSelect={(s) => updateJointHolder(index, { state: s.stateName })}
                    required
                  />
                           <CountryPicklistField
                    label="Country"
                    labelHi="देश"
                    icon={<Flag size={16} />}
                    value={row.country}
                    onSelect={(c) => updateJointHolder(index, { country: c.name })}
                    required
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            onClick={handleValidate}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Validate <Check size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
                <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <button onClick={handleSave} className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-100 dark:hover:bg-slate-800">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      handleSave();
                      setApplication((prev) => ({ ...prev, customerId: "", customerName: "" }));
                      setActiveTab("Application");
                    }}
                    className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    Save & New
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSavingAccountModal;
