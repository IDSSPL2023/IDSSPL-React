import { IMAGES } from "@/assets";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Image from "@/components/ui/Image";
import StatePicklistField from "@/components/common/StatePicklistField";
import {
  X,
  Calendar,
  IdCard,
  Landmark,
  Coins,
  Wallet,
  FileText,
  ClipboardList,
  Tag,
  UserCog,
  Activity,
  Link2,
  UserCheck,
  AlertTriangle,
  ChevronDown,
  MoreVertical,
  User,
  Percent,
  Home,
  Flag,
  Check,
  ThumbsUp,
  Wrench,
  ArrowLeftRight,
  Search,
  Plus,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TabModal } from "@/components/common";
import type { TabModalTab } from "@/components/common";
import CustomerIdPicklistField, { type CustomerOption } from "../common/CustomerIdPicklistField";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AccountDetails {
  accountCode?: string;
  accountName?: string;
  accountOpenDate?: string;
  accountClosedDate?: string;
  customerId?: string;
  customerName?: string;
  createdBy?: string;
  branchCode?: string;
  ledgerBalance?: number | string;
  availableBalance?: number | string;
  minBalanceId?: string;
  lastOperatedDate?: string;
  todApplicable?: string;
  todLimit?: string | number;
  todInterestRate?: string | number;
  todInterest?: string | number;
  accountOperationCapacityId?: string;
  applicationNumber?: string;
  categoryCode?: string;
  agentId?: string;
  accountStatus?: string;
  introducerAccountCode?: string;
  officerId?: string;
  riskCategory?: string;
}

export interface DepositDetails {
  accountType?: string;
  accountOpenDate?: string;
  unitOfPeriod?: "Day" | "Month";
  periodDeposit?: string | number;
  interestRate?: string | number;
  maturityDate?: string;
  interestPaidInCash?: "Day" | "Month";
  rateDiscounted?: "Day" | "Month";
  interestPaymentFrequency?: string;
  depositAmount?: string | number;
  depositAmountInWords?: string;
  cash?: string | number;
  clearing?: string | number;
  transfer?: string | number;
  creditAccountCode?: string;
  creditAccountName?: string;
  maturityAmount?: string | number;
}

export interface NomineeDetails {
  srNo?: string | number;
  salutationCode?: string;
  nomineeCustomerId?: string;
  nomineeName?: string;
  relation?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface JointHolderDetails {
  srNo?: string | number;
  salutationCode?: string;
  jtHolderCustomerId?: string;
  jtHolderName?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
}

type TabKey = "Details" | "Deposit" | "Nominee" | "Joint Holder";
const TABS: TabKey[] = ["Details", "Deposit", "Nominee", "Joint Holder"];

const EditModeContext = createContext(false);

// Salutation options shown in the Salutation Code dropdown
const SALUTATION_OPTIONS = ["MR", "MS", "MRS"];

// Sample rows for the "Customer Type List" popup (opened from the Customer ID menu button)
const CUSTOMER_LIST: { id: string; name: string }[] = Array.from({ length: 10 }, () => ({
  id: "00012",
  name: "Balami Manjunath Iranna",
}));

// Sample rows for the "Branch List" popup (opened from the Branch Code menu button)
const BRANCH_LIST: { code: string; name: string }[] = [
  { code: "0002", name: "Belgaum" },
  { code: "0003", name: "Ajara" },
  { code: "0004", name: "Goa" },
  { code: "0005", name: "Maharashtra" },
  { code: "0006", name: "Hubli" },
  { code: "0007", name: "Kagal" },
  { code: "0008", name: "Mumbai" },
  { code: "0009", name: "Pune" },
  { code: "0010", name: "Satara" },
  { code: "0011", name: "Gadiganglaj" },
];

interface ViewAccountModalProps {
  mode?: "view" | "edit";
  onClose: () => void;
  onNext?: () => void;
  onValidate?: () => void;
  data?: AccountDetails;
  depositData?: DepositDetails;
  nomineeData?: NomineeDetails[];
  jointHolderData?: JointHolderDetails;
}

/* ------------------------------------------------------------------ */
/*  Date helpers — power the native calendar picker on date fields     */
/* ------------------------------------------------------------------ */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "23-May-2026" -> "2026-05-23" (what <input type="date"> needs)
function toISODate(value?: string | number): string {
  if (!value) return "";
  const str = String(value);
  const match = str.match(/^(\d{1,2})-([A-Za-z]{3,})-(\d{4})$/);
  if (!match) return "";
  const day = match[1].padStart(2, "0");
  const monthIdx = MONTHS.findIndex((m) => m.toLowerCase() === match[2].slice(0, 3).toLowerCase());
  if (monthIdx === -1) return "";
  const month = String(monthIdx + 1).padStart(2, "0");
  return `${match[3]}-${month}-${day}`;
}

// "2026-05-23" -> "23-May-2026" (what the rest of the UI displays)
function fromISODate(iso: string): string {
  if (!iso) return "";
  const [y, mo, d] = iso.split("-");
  const monthIdx = parseInt(mo, 10) - 1;
  if (Number.isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) return iso;
  return `${parseInt(d, 10)}-${MONTHS[monthIdx]}-${y}`;
}

/* ------------------------------------------------------------------ */
/*  Primitive: BilingualLabel — single line, no wrap                   */
/* ------------------------------------------------------------------ */

function BilingualLabel({
  en,
  mr,
  required,
  variant = "large",
}: {
  en: string;
  mr?: string;
  required?: boolean;
  variant?: "large" | "small";
}) {
  return (
    <label
      className={`mb-1.5 block truncate whitespace-nowrap text-[#1F2858] dark:text-slate-100 ${
        variant === "large" ? "text-sm font-medium" : "text-xs font-medium"
      }`}
      title={mr ? `${en} / ${mr}` : en}
    >
      {en}
      {mr && (
        <>
          <span className="text-slate-400 dark:text-slate-500"> / </span>
          <span className="text-[#64748B] dark:text-slate-400">{mr}</span>
        </>
      )}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  );
}



const iconWrap = "flex h-9 w-9 shrink-0 items-center justify-center text-[#6B7280] dark:text-slate-400";

interface FieldProps {
  icon?: LucideIcon;
  labelEn: string;
  labelMr?: string;
  value?: string | number;
  required?: boolean;
  type?: "text" | "date" | "currency";
  menu?: boolean;
  menuActive?: boolean;
  editable?: boolean;
  onChange?: (value: string) => void;
  onMenuClick?: () => void;
}

function Field({
  icon: Icon,
  labelEn,
  labelMr,
  value,
  required = true,
  type = "text",
  menu = false,
  menuActive = false,
  editable = true,
  onChange,
  onMenuClick,
}: FieldProps) {
  const editMode = useContext(EditModeContext);
  const isEditable = editable && editMode;
  const isCurrency = type === "currency";
  const isDate = type === "date";
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value !== undefined ? String(value) : "");

  const displayValue =
    isCurrency && value !== undefined && value !== ""
      ? Number(value).toLocaleString("en-IN", { minimumFractionDigits: 1 })
      : value || "\u2014";

  const startEditing = () => {
    if (!isEditable) return;
    setDraft(value !== undefined ? String(value) : "");
    setIsEditing(true);
  };

  const commit = () => {
    setIsEditing(false);
    if (isEditable) onChange?.(draft);
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <BilingualLabel en={labelEn} mr={labelMr} required={required} />
      <div className="flex flex-1 items-stretch gap-2">
        <div className="relative flex flex-1 min-w-0 items-center">
          {Icon && (
            <span className="pointer-events-none absolute left-3 text-slate-400">
              <Icon size={16} />
            </span>
          )}
          {isEditing ? (
            isDate ? (
              <input
                autoFocus
                type="date"
                value={toISODate(draft)}
                onChange={(e) => setDraft(fromISODate(e.target.value))}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                className={`w-full min-h-[42px] rounded-lg border border-slate-600 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 ${
                  Icon ? "pl-10" : "pl-3"
                } pr-3 text-sm font-normal text-slate-700 dark:text-slate-100 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
              />
            ) : (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                className={`w-full min-h-[42px] rounded-lg border border-slate-600 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 ${
                  Icon ? "pl-10" : "pl-3"
                } pr-3 text-sm font-normal text-slate-700 dark:text-slate-100 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
              />
            )
          ) : isEditable ? (
            <button
              type="button"
              onClick={startEditing}
              className={`w-full min-h-[42px] truncate rounded-lg border border-slate-600 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-left ${
                Icon ? "pl-10" : "pl-3"
              } pr-3 text-sm font-normal transition-colors hover:border-slate-400 dark:hover:border-slate-600 ${
                value !== undefined && value !== "" ? "text-slate-700 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {displayValue}
            </button>
          ) : (
            <div
              className={`w-full min-h-[42px] truncate rounded-lg border border-slate-600 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-left ${
                Icon ? "pl-10" : "pl-3"
              } pr-3 text-sm font-normal text-slate-600 dark:text-slate-400`}
            >
              {displayValue}
            </div>
          )}
        </div>
        {menu && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={`More options for ${labelEn}`}
            className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center self-center rounded-lg border transition-colors ${
              menuActive
                ? "border-primary-200 bg-primary-100 text-primary"
                : "border-slate-600 bg-white text-slate-400 hover:border-primary hover:bg-primary-50 hover:text-primary"
            }`}
          >
            <MoreVertical size={16} />
          </button>
        )}
      </div>
    </div>
  );
}


function SelectField({
  icon: Icon,
  labelEn,
  labelMr,
  value,
  required = true,
  options,
  editable = true,
  onChange,
}: {
  icon?: LucideIcon;
  labelEn: string;
  labelMr?: string;
  value?: string;
  required?: boolean;
  editable?: boolean;
  options?: string[];
  onChange?: (value: string) => void;
}) {
  const editMode = useContext(EditModeContext);
  const isEditable = editable && editMode;

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const startEditing = () => {
    if (!isEditable) return;
    setDraft(value ?? "");
    setIsEditing(true);
  };

  const commit = () => {
    setIsEditing(false);
    onChange?.(draft);
  };

  // ---------------- Dropdown ----------------

  if (options && options.length > 0) {
    return (
      <div
        ref={containerRef}
        className="flex h-full min-w-0 flex-col"
      >
        <BilingualLabel
          en={labelEn}
          mr={labelMr}
          required={required}
        />

        <div className="relative flex-1">
          <button
            type="button"
            disabled={!isEditable}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={`
              flex
              h-[42px]
              w-full
              items-center
              rounded-lg
              border
              bg-white
              dark:bg-slate-900
              px-3
              text-left
              transition-all
              ${
                isOpen
                  ? "border-primary ring-2 ring-primary/10"
                  : "border-slate-600 dark:border-slate-700 hover:border-primary"
              }
              ${
                !isEditable
                  ? "cursor-default bg-slate-50 dark:bg-slate-800"
                  : ""
              }
            `}
          >
            {Icon && (
              <Icon
                className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
                strokeWidth={1.8}
              />
            )}

            <span
              className={`flex-1 truncate text-sm ${
                Icon ? "ml-3" : ""
              } ${
                value
                  ? "text-slate-600 dark:text-slate-100"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {value || "Select"}
            </span>

            <ChevronDown
              className={`h-5 w-5 text-slate-400 dark:text-slate-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && isEditable && (
            <div
              role="listbox"
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={option === value}
                  onClick={() => {
                    onChange?.(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition
                    ${
                      option === value
                        ? "bg-primary-50 text-primary"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  {option}

                  {option === value && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------- Editable Text ----------------

  return (
    <div className="flex h-full min-w-0 flex-col">
      <BilingualLabel
        en={labelEn}
        mr={labelMr}
        required={required}
      />

      <div className="flex h-[42px] items-center rounded-lg border border-slate-600 dark:border-slate-700 bg-white dark:bg-slate-900 px-3">
        {Icon && (
          <Icon
            className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
            strokeWidth={1.8}
          />
        )}

        {isEditing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setIsEditing(false);
            }}
            className={`flex-1 bg-transparent text-sm text-[#4B5563] dark:text-slate-100 outline-none ${
              Icon ? "ml-3" : ""
            }`}
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className={`flex-1 truncate text-left text-sm text-slate-600 dark:text-slate-100 ${
              Icon ? "ml-3" : ""
            }`}
          >
            {value || "—"}
          </button>
        )}

        <ChevronDown className="h-5 w-5 text-slate-400 dark:text-slate-500" />
      </div>
    </div>
  );
}

function SrNoField({ value }: { value?: string | number }) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <span className="mb-1.5 block truncate whitespace-nowrap text-sm font-medium text-[#1F2858] dark:text-slate-100">Sr No</span>
      <div className="flex h-[42px] flex-1 items-center justify-center rounded-lg border border-slate-600 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-normal text-[#4B5563] dark:text-slate-100">
        {value ?? "\u2014"}
      </div>
    </div>
  );
}

function FieldGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: 3 | 4 }) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 rounded-[20px] border-x border-b-2 border-t-4 border-primary bg-white dark:bg-slate-900/40 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] sm:grid-cols-2 lg:gap-4 [&>*]:min-w-0 ${
        cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
      }`}
    >
      {children}
    </div>
  );
}


function RadioGroup({
  labelEn,
  labelMr,
  value,
  onChange,
}: {
  labelEn: string;
  labelMr?: string;
  value?: "Day" | "Month";
  onChange?: (value: "Day" | "Month") => void;
}) {
  const editMode = useContext(EditModeContext);
  const isInteractive = editMode;

  return (
    <div className="flex h-full min-w-0 flex-col">

      <span aria-hidden className="invisible mb-1.5 block text-sm font-medium leading-none">
        spacer
      </span>
      <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="whitespace-nowrap text-sm font-medium text-[#1F2858] dark:text-slate-100">
          {labelEn}
          {labelMr && (
            <>
              <span className="text-slate-400 dark:text-slate-500"> / </span>
              <span className="text-[#64748B] dark:text-slate-400">{labelMr}</span>
            </>
          )}
        </span>
        <div className="flex items-center gap-5 md:ml-6">
          {(["Day", "Month"] as const).map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-2 whitespace-nowrap text-sm font-normal text-slate-600 dark:text-slate-300 ${
                isInteractive ? "cursor-pointer" : "cursor-not-allowed opacity-70"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  value === opt ? "border-primary" : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {value === opt && <span className="h-2 w-2 rounded-full bg-primary" />}
              </span>
              <input
                type="radio"
                className="hidden"
                checked={value === opt}
                onChange={() => isInteractive && onChange?.(opt)}
                disabled={!isInteractive}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Details tab                                                        */
/* ------------------------------------------------------------------ */

function DetailsTab({ data }: { data: AccountDetails }) {
  const [formData, setFormData] = useState<AccountDetails>(data);
  const update = (key: keyof AccountDetails) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const [isBranchListOpen, setIsBranchListOpen] = useState(false);

  // Handle customer selection from picklist
  const handleCustomerSelect = (customer: CustomerOption) => {
    setFormData((prev) => ({
      ...prev,
      customerId: customer.customerId,
      customerName: customer.customerName,
    }));
  };

  return (
    <>
    <FieldGrid>
      <Field icon={IdCard} labelEn="Account Code" labelMr="खाते कोड" value={formData.accountCode} onChange={update("accountCode")} />
      <Field icon={User} labelEn="Account Name" labelMr="खाते नाव" value={formData.accountName} onChange={update("accountName")} />
      <Field icon={Calendar} labelEn="Account Open Date" labelMr="खाते उघडण्याची तारीख" value={formData.accountOpenDate} type="date" onChange={update("accountOpenDate")} />
      <Field icon={Calendar} labelEn="Account Closed Date" labelMr="खाते बंद झाल्याची तारीख" value={formData.accountClosedDate} type="date" onChange={update("accountClosedDate")} />

      {/* Customer ID with Picklist */}
      <div className="flex h-full min-w-0 flex-col">
        <BilingualLabel en="Customer ID" mr="ग्राहक आयडी" required />
        <CustomerIdPicklistField
          label=""
          value={formData.customerId || ""}
          placeholder="Select Customer"
          onSelect={handleCustomerSelect}
          preFetch={false}
          pageSize={10}
        />
      </div>

      <Field icon={User} labelEn="Customer Name" labelMr="ग्राहकाचे नाव" value={formData.customerName} onChange={update("customerName")} />
      <Field icon={User} labelEn="Created By" labelMr="किंमत तयार केली" value={formData.createdBy} onChange={update("createdBy")} />
      <Field icon={Landmark} labelEn="Branch Code" labelMr="शाखा कोड" value={formData.branchCode} menu menuActive={isBranchListOpen} onMenuClick={() => setIsBranchListOpen(true)} onChange={update("branchCode")} />

      <Field icon={Coins} labelEn="Ledger Balance" labelMr="लेजर शिल्लक" value={formData.ledgerBalance} type="currency" onChange={update("ledgerBalance")} />
      <Field icon={Wallet} labelEn="Available Balance" labelMr="उपलब्ध शिल्लक" value={formData.availableBalance} type="currency" onChange={update("availableBalance")} />
      <SelectField icon={UserCheck} labelEn="Min Balance ID" labelMr="किमान शिल्लक आयडी" value={formData.minBalanceId} onChange={update("minBalanceId")} />
      <Field icon={Calendar} labelEn="Last Operated Date" labelMr="शेवटची ऑपरेशन तारीख" value={formData.lastOperatedDate} type="date" onChange={update("lastOperatedDate")} />

      <SelectField icon={FileText} labelEn="Is TOD Applicable" labelMr="TOD लागू आहे का?" value={formData.todApplicable} onChange={update("todApplicable")} />
      <Field icon={FileText} labelEn="TOD Limit" labelMr="TOD मर्यादा" value={formData.todLimit} onChange={update("todLimit")} />
      <Field icon={FileText} labelEn="TOD Interest Rate" labelMr="TOD व्याजदर" value={formData.todInterestRate} onChange={update("todInterestRate")} />
      <Field icon={FileText} labelEn="TOD Interest" labelMr="TOD व्याज" value={formData.todInterest} onChange={update("todInterest")} />

      <SelectField icon={ClipboardList} labelEn="Account Operation Capacity ID" labelMr="खाते ऑपरेशन क्षमता आयडी" value={formData.accountOperationCapacityId} onChange={update("accountOperationCapacityId")} />
      <Field icon={ClipboardList} labelEn="Application Number" labelMr="अर्ज क्रमांक" value={formData.applicationNumber} onChange={update("applicationNumber")} />
      <SelectField icon={Tag} labelEn="Category Code" labelMr="कॅटेगरी कोड" value={formData.categoryCode} onChange={update("categoryCode")} />

      <Field icon={UserCog} labelEn="Agent ID" labelMr="एजंट आयडी" value={formData.agentId} onChange={update("agentId")} />
      <SelectField icon={Activity} labelEn="Account Status" labelMr="आकाउंट स्थीती" value={formData.accountStatus} onChange={update("accountStatus")} />
      <Field icon={Link2} labelEn="Introducer Account Code" labelMr="ओळखपत्र खात्याचा कोड" value={formData.introducerAccountCode} onChange={update("introducerAccountCode")} />

      <Field icon={UserCog} labelEn="Officer ID" labelMr="कर्मचारी आयडी" value={formData.officerId} onChange={update("officerId")} />
      <SelectField icon={AlertTriangle} labelEn="Risk Category" labelMr="धोक्याचा प्रकार" value={formData.riskCategory} onChange={update("riskCategory")} />
    </FieldGrid>

    {isBranchListOpen && (
      <ListModal
        title="Branch List"
        columns={[
          { key: "code", label: "Branch Code" },
          { key: "name", label: "Branch Name" },
        ]}
        rows={BRANCH_LIST}
        onSelect={(item) => {
          update("branchCode")(item.code);
          setIsBranchListOpen(false);
        }}
        onClose={() => setIsBranchListOpen(false)}
      />
    )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Deposit tab                                                        */
/* ------------------------------------------------------------------ */

function DepositTab({ data }: { data: DepositDetails }) {
  const [formData, setFormData] = useState<DepositDetails>(data);
  const update = (key: keyof DepositDetails) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));
  const updateRadio = (key: keyof DepositDetails) => (value: "Day" | "Month") =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const [isCreditAccountListOpen, setIsCreditAccountListOpen] = useState(false);

  return (
    <>
    <FieldGrid cols={3}>
      <Field icon={User} labelEn="Account Type" labelMr="आकाउंट प्रकार" value={formData.accountType} onChange={update("accountType")} />
      <Field icon={Calendar} labelEn="Account Open Date" labelMr="खाते उघडण्याची तारीख" value={formData.accountOpenDate} type="date" onChange={update("accountOpenDate")} />
      <RadioGroup labelEn="Unit Of Period" value={formData.unitOfPeriod} onChange={updateRadio("unitOfPeriod")} />

      <Field icon={Calendar} labelEn="Period Deposit" labelMr="काळजी ठेव" value={formData.periodDeposit} onChange={update("periodDeposit")} />
      <Field icon={Percent} labelEn="Interest Rate" labelMr="व्याज दर" value={formData.interestRate} onChange={update("interestRate")} />
      <Field icon={Calendar} labelEn="Maturity Date" labelMr="परिपक्वता तारीख" value={formData.maturityDate} type="date" onChange={update("maturityDate")} />

      <RadioGroup labelEn="Interest Paid in Cash" value={formData.interestPaidInCash} onChange={updateRadio("interestPaidInCash")} />
      <RadioGroup labelEn="Rate Discounted" value={formData.rateDiscounted} onChange={updateRadio("rateDiscounted")} />
      <SelectField
  icon={Calendar}
  labelEn="Interest Payment Frequency"
  labelMr="व्याज भरण्याची वारंवारिता"
  value={formData.interestPaymentFrequency}
  options={[
    "Monthly",
    "Quarterly",
    "Half Yearly",
    "Yearly",
  ]}
  onChange={update("interestPaymentFrequency")}
/>

      <Field icon={Coins} labelEn="Deposit Amount" labelMr="ठेव रक्कम" value={formData.depositAmount} onChange={update("depositAmount")} />
      <div className="sm:col-span-2 lg:col-span-2">
        <Field icon={Coins} labelEn="Deposit Amount in words" labelMr="ठेव रक्कम शब्दांमध्ये" value={formData.depositAmountInWords} onChange={update("depositAmountInWords")} />
      </div>

      <Field icon={IdCard} labelEn="Cash" labelMr="रोख" value={formData.cash} onChange={update("cash")} />
      <Field icon={Wrench} labelEn="Clearing" labelMr="क्लीअरिंग" value={formData.clearing} onChange={update("clearing")} />
      <Field icon={ArrowLeftRight} labelEn="Transfer" labelMr="हस्तांतरण" value={formData.transfer} onChange={update("transfer")} />

      <Field icon={Landmark} labelEn="Credit Account Code" labelMr="क्रेडिट अकाउंट कोड" value={formData.creditAccountCode} menu menuActive={isCreditAccountListOpen} onMenuClick={() => setIsCreditAccountListOpen(true)} onChange={update("creditAccountCode")} />
      <Field icon={User} labelEn="Credit Account Name" labelMr="क्रेडिट खाते नाव" value={formData.creditAccountName} onChange={update("creditAccountName")} />
      <Field icon={Coins} labelEn="Maturity Amount" labelMr="परिपक्वतेची रक्कम" value={formData.maturityAmount} onChange={update("maturityAmount")} />
    </FieldGrid>

    {isCreditAccountListOpen && (
      <ListModal
        title="Account List"
        columns={[
          { key: "code", label: "Account Code" },
          { key: "name", label: "Account Name" },
        ]}
        rows={BRANCH_LIST.map((b) => ({ code: b.code, name: b.name }))}
        onSelect={(item) => {
          update("creditAccountCode")(item.code);
          update("creditAccountName")(item.name);
          setIsCreditAccountListOpen(false);
        }}
        onClose={() => setIsCreditAccountListOpen(false)}
      />
    )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Nominee tab                                                        */
/*  Visually matches the "Nominee" tab of AddLoanAccountModal.tsx:      */
/*  a single blue-outlined rounded-[20px] card, top row (Sr No +        */
/*  Salutation + Customer ID + Name) laid out as a responsive flex      */
/*  row, followed by an 4-column grid for the remaining fields.         */
/*  Data, state, and edit-mode behaviour are unchanged — only the       */
/*  container/grid classes were updated to match the target layout.     */
/* ------------------------------------------------------------------ */

// Blank row used when "+ Add" is clicked — mirrors AddLoanAccountModal's emptyParty()
function emptyNominee(srNo: number): NomineeDetails {
  return {
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
  };
}

function NomineeTab({
  rows,
  onChangeRows,
}: {
  rows: NomineeDetails[];
  onChangeRows: React.Dispatch<React.SetStateAction<NomineeDetails[]>>;
}) {
  const editMode = useContext(EditModeContext);
  const isEditable = editMode;

  // Handle nominee customer selection from picklist
  const handleNomineeSelect = (index: number, customer: CustomerOption) => {
    onChangeRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, nomineeCustomerId: customer.customerId, nomineeName: customer.customerName }
          : row
      )
    );
  };

  const updateRow = (index: number, key: keyof NomineeDetails) => (value: string) =>
    onChangeRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));

  const deleteRow = (index: number) =>
    onChangeRows((prev) => prev.filter((_, i) => i !== index).map((row, i) => ({ ...row, srNo: i + 1 })));

  return (
    <>
    {rows.map((formData, index) => (
      <div
        key={formData.srNo ?? index}
        className="relative mb-4 rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] last:mb-0"
      >
        {rows.length > 1 && (
          <button
            type="button"
            onClick={() => deleteRow(index)}
            aria-label={`Remove Nominee ${formData.srNo}`}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        )}

        {/* Top row: Sr No (compact) + first 3 fields sharing remaining space — real grid so columns line up exactly */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[64px_1fr_1fr_1fr]">
          <div className="min-w-0">
            <SrNoField value={formData.srNo} />
          </div>

          <div className="min-w-0">
            <SelectField
              labelEn="Salutation Code"
              labelMr="संबोधनी"
              value={formData.salutationCode}
              options={SALUTATION_OPTIONS}
              onChange={updateRow(index, "salutationCode")}
            />
          </div>

          <div className="min-w-0">
            <div className="flex h-full min-w-0 flex-col">
              <BilingualLabel en="Nominee Customer ID" mr="नॉमिनी ग्राहक आयडी" required />
              <CustomerIdPicklistField
                label=""
                value={formData.nomineeCustomerId || ""}
                placeholder="Select Nominee"
                onSelect={(customer) => handleNomineeSelect(index, customer)}
                preFetch={false}
                pageSize={10}
              />
            </div>
          </div>

          <div className="min-w-0">
            <Field icon={User} labelEn="Nominee Name" labelMr="नॉमिनी नाव" value={formData.nomineeName} onChange={updateRow(index, "nomineeName")} />
          </div>
        </div>

        {/* Remaining fields: 4-column grid, matching AddLoanAccountModal's PartyTab */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-4 [&>*]:min-w-0">
          <SelectField icon={User} labelEn="Relation" value={formData.relation} onChange={updateRow(index, "relation")} />
          <Field icon={Home} labelEn="Address 1" labelMr="पत्ता १" value={formData.address1} onChange={updateRow(index, "address1")} />
          <Field icon={Home} labelEn="Address 2" labelMr="पत्ता २" value={formData.address2} onChange={updateRow(index, "address2")} />
          <Field icon={Home} labelEn="Address 3" labelMr="पत्ता ३" value={formData.address3} required={false} onChange={updateRow(index, "address3")} />

          <Field icon={Home} labelEn="Zip" labelMr="पिन कोड" value={formData.zip} onChange={updateRow(index, "zip")} />
          <SelectField icon={Landmark} labelEn="City" labelMr="शहरे" value={formData.city} onChange={updateRow(index, "city")} />
          <StatePicklistField icon={<Landmark size={16} />} label="State" labelHi="राज्य" value={formData.state || ""} onSelect={(s) => updateRow(index, "state")(s.stateName)} />
          <Field icon={Flag} labelEn="Country" labelMr="देश" value={formData.country} onChange={updateRow(index, "country")} />
        </div>
      </div>
    ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Joint Holder tab                                                   */
/* ------------------------------------------------------------------ */

function JointHolderTab({ data }: { data: JointHolderDetails }) {
  const [formData, setFormData] = useState<JointHolderDetails>(data);
  const update = (key: keyof JointHolderDetails) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);

  // Handle joint holder customer selection from picklist
  const handleJointHolderSelect = (customer: CustomerOption) => {
    setFormData((prev) => ({
      ...prev,
      jtHolderCustomerId: customer.customerId,
      jtHolderName: customer.customerName,
    }));
  };

  return (
    <>
    <div className="rounded-[20px] border-x border-b-2 border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-[70px_1fr_1fr_1fr] [&>*]:min-w-0">
        <SrNoField value={formData.srNo} />
        <SelectField
          labelEn="Salutation Code"
          labelMr="संबोधनी"
          value={formData.salutationCode}
          options={SALUTATION_OPTIONS}
          onChange={update("salutationCode")}
        />
        <div className="flex h-full min-w-0 flex-col">
          <BilingualLabel en="J/T Holder Customer ID" mr="J/T धारक ग्राहक आयडी" required={false} />
          <CustomerIdPicklistField
            label=""
            value={formData.jtHolderCustomerId || ""}
            placeholder="Select Joint Holder"
            onSelect={handleJointHolderSelect}
            preFetch={false}
            pageSize={10}
          />
        </div>
        <Field icon={User} labelEn="J/T Holder Name" labelMr="J/T धारकाचे नाव" value={formData.jtHolderName} onChange={update("jtHolderName")} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 [&>*]:min-w-0">
        <Field icon={Home} labelEn="Address 1" labelMr="पत्ता १" value={formData.address1} onChange={update("address1")} />
        <Field icon={Home} labelEn="Address 2" labelMr="पत्ता २" value={formData.address2} onChange={update("address2")} />
        <Field icon={Home} labelEn="Address 3" labelMr="पत्ता ३" value={formData.address3} required={false} onChange={update("address3")} />
        <Field icon={Home} labelEn="Zip" labelMr="पिन कोड" value={formData.zip} onChange={update("zip")} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 [&>*]:min-w-0">
        <SelectField icon={Home} labelEn="City" labelMr="शहरे" value={formData.city} onChange={update("city")} />
        <StatePicklistField icon={<Landmark size={16} />} label="State" labelHi="राज्य" value={formData.state || ""} onSelect={(s) => update("state")(s.stateName)} />
        <Field icon={Flag} labelEn="Country" labelMr="देश" value={formData.country} onChange={update("country")} />
      </div>
    </div>

    {isCustomerListOpen && (
      <ListModal
        title="Customer Type List"
        columns={[
          { key: "id", label: "Customer ID" },
          { key: "name", label: "Customer Name" },
        ]}
        rows={CUSTOMER_LIST}
        onSelect={(item) => {
          update("jtHolderCustomerId")(item.id);
          update("jtHolderName")(item.name);
          setIsCustomerListOpen(false);
        }}
        onClose={() => setIsCustomerListOpen(false)}
      />
    )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  ListModal — generic pickup list (search box, pill IDs, Select btn)  */
/* ------------------------------------------------------------------ */

interface ListModalColumn<T> {
  key: keyof T;
  label: string;
}

interface ListModalProps<T extends Record<string, unknown>> {
  title: string;
  columns: ListModalColumn<T>[];
  rows: T[];
  onSelect: (row: T) => void;
  onClose: () => void;
}

function ListModal<T extends Record<string, unknown>>({
  title,
  columns,
  rows,
  onSelect,
  onClose,
}: ListModalProps<T>) {
  const [searchText, setSearchText] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return rows;
    const q = searchText.trim().toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(q))
    );
  }, [rows, columns, searchText]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[85vh] w-[95vw] max-w-[720px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        {/* Decorative corner circles — clipped to the card */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary-100" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-100" />

        {/* Header — title, single search box, close circle */}
        <div className="relative z-10 flex items-center justify-between gap-4 px-6 pt-6 pb-5">
          <h2 className="shrink-0 text-lg font-bold text-slate-800">{title}</h2>
          <div className="relative w-full max-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Table */}
        <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto px-6 pb-6">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-primary-100 text-slate-700">
                {columns.map((col, idx) => (
                  <th
                    key={String(col.key)}
                    className={`px-4 py-3 font-semibold ${idx === 0 ? "rounded-l-lg" : "text-center"}`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="rounded-r-lg px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-slate-50 last:border-0">
                  {columns.map((col, idx) => (
                    <td key={String(col.key)} className={`px-4 py-3 ${idx === 0 ? "" : "text-center text-slate-700"}`}>
                      {idx === 0 ? (
                        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {String(row[col.key] ?? "")}
                        </span>
                      ) : (
                        String(row[col.key] ?? "")
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(row)}
                      className="rounded-lg bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary-100"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-sm text-slate-400">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HeaderIcon({ mode }: { mode: "view" | "edit" }) {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2 shadow-sm">
      <Image
        src={mode === "edit" ? IMAGES.PERSON_EDIT_ICON : IMAGES.PERSON_ICON}
        alt=""
        fill
        sizes="48px"
        className="object-contain"
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main: ViewAccountModal                                             */
/* ------------------------------------------------------------------ */

const defaultData: AccountDetails = {
  accountCode: "4022399911",
  accountName: "Nitish Sai Readdy",
  accountOpenDate: "23-May-2026",
  accountClosedDate: "01-June-2026",
  customerId: "00021",
  customerName: "Nitish Sai Readdy",
  createdBy: "Admin",
  branchCode: "0002",
  ledgerBalance: 408493.5,
  availableBalance: 408493.5,
  minBalanceId: "200",
  lastOperatedDate: "18-Jan-2026",
  todApplicable: "No",
  todLimit: "0.0",
  todInterestRate: "0.0",
  todInterest: "0.0",
  accountOperationCapacityId: "Self",
  applicationNumber: "12",
  categoryCode: "Public",
  agentId: "0",
  accountStatus: "Live",
  introducerAccountCode: "1001",
  officerId: "Admin",
  riskCategory: "Low",
};

const defaultDepositData: DepositDetails = {
  accountType: "TD",
  accountOpenDate: "23-May-2026",
  unitOfPeriod: "Day",
  periodDeposit: "7",
  interestRate: "1.2",
  maturityDate: "23-May-2026",
  interestPaidInCash: "Day",
  rateDiscounted: "Day",
  interestPaymentFrequency: "Monthly",
  depositAmount: "100/-",
  depositAmountInWords: "One Hundred",
  cash: "100",
  clearing: "0",
  transfer: "0",
  creditAccountCode: "2001",
  creditAccountName: "Akshay Om More",
  maturityAmount: "23,990/-",
};

const defaultNomineeData: NomineeDetails[] = [
  {
    srNo: 1,
    salutationCode: "MR",
    nomineeCustomerId: "00021",
    nomineeName: "Nitish Sai Readdy",
    relation: "Father",
    address1: "Kolhapur",
    address2: "Kolhapur",
    address3: "Kolhapur",
    zip: "416005",
    city: "Kolhapur",
    state: "Maharashtra",
    country: "India",
  },
];

const defaultJointHolderData: JointHolderDetails = {
  srNo: 1,
  salutationCode: "MR",
  jtHolderCustomerId: "00021",
  jtHolderName: "Nitish Sai Readdy",
  address1: "Kolhapur",
  address2: "Kolhapur",
  address3: "Kolhapur",
  zip: "416005",
  city: "Kolhapur",
  state: "Maharashtra",
  country: "India",
};

export default function ViewAccountModal({
  mode = "view",
  onClose,
  onNext,
  onValidate,
  data = defaultData,
  depositData = defaultDepositData,
  nomineeData = defaultNomineeData,
  jointHolderData = defaultJointHolderData,
}: ViewAccountModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("Details");
  const isLastTab = activeTab === TABS[TABS.length - 1];
  const isEdit = mode === "edit";

  // Nominee rows are lifted up so the "+ Add" button in the tab bar can append a row
  const [nomineeRows, setNomineeRows] = useState<NomineeDetails[]>(nomineeData);
  const handleAddNominee = () =>
    setNomineeRows((prev) => [...prev, emptyNominee(prev.length + 1)]);

  const goNext = () => {
    if (isLastTab) {
      onNext?.();
    } else {
      const currentIndex = TABS.indexOf(activeTab);
      setActiveTab(TABS[currentIndex + 1]);
    }
  };

  const tabModalTabs: TabModalTab[] = [
    { key: "Details", label: "Details", content: <DetailsTab data={data} /> },
    { key: "Deposit", label: "Deposit", content: <DepositTab data={depositData} /> },
    {
      key: "Nominee",
      label: "Nominee",
      content: <NomineeTab rows={nomineeRows} onChangeRows={setNomineeRows} />,
    },
    { key: "Joint Holder", label: "Joint Holder", content: <JointHolderTab data={jointHolderData} /> },
  ];

  return (
    <EditModeContext.Provider value={isEdit}>
      <TabModal
        onClose={onClose}
        maxWidthPx={1400}
        headerIcon={<HeaderIcon mode={mode} />}
        title={
          <>
            {isEdit ? "Edit Deposit Account Details" : "View Deposit Account Details"}
            <span className="text-slate-400"> / </span>
            <span className="text-[#64748B]">{isEdit ? "ठेवी खात्याचे तपशील संपादित करा" : "ठेव खाते तपशील पहा"}</span>
          </>
        }
        subtitle={
          isEdit
            ? "Edit some basic information related to the Employee / कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती"
            : "Only can view some basic information related to the Employee / कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती"
        }
        tabs={tabModalTabs}
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as TabKey)}
        tabBarActions={
          isEdit && activeTab === "Nominee" ? (
            <button
              type="button"
              onClick={handleAddNominee}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Plus size={16} /> Add
            </button>
          ) : null
        }
        footer={
          <div className="flex items-center justify-end gap-6 px-6 py-4">
            {isEdit && (
              <button
                type="button"
                onClick={onValidate}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[14px] font-medium text-white transition hover:bg-primary-700"
              >
                Validate
                <Check className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-5 py-2 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>

            {isEdit ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1.5 rounded-lg bg-primary-100 px-5 py-2 text-[14px] font-medium text-primary transition hover:bg-primary-200"
              >
                {isLastTab ? "Save" : "Next"}
                <ChevronDown className={`h-4 w-4 ${isLastTab ? "" : "-rotate-90"}`} />
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[14px] font-medium text-white transition hover:bg-primary-700"
              >
                {isLastTab ? "Ok, Got It" : "Next"}
                {isLastTab ? <ThumbsUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 -rotate-90" />}
              </button>
            )}
          </div>
        }
      />
    </EditModeContext.Provider>
  );
}