import React, { useMemo, useState } from 'react';
import { useRouter } from "@/lib/navigation";
import {
  User,
  Users,
  CreditCard,
  ClipboardList,
  RefreshCw,
  MoreVertical,
  ChevronDown,
  AlertCircle,
  Check,
  X,
  Search,
  MapPin,
  IndianRupee,
  Hash,
  Building2,
  ScrollText,
  Clock,
  Calendar,
  CalendarDays,
  Percent,
  Receipt,
  FileCheck,
  FileText,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useBilingual } from "@/i18n/useBilingual";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";

// ==========================================
// TYPES
// ==========================================

interface FormData {
  // Account Details
  accountCode: string;
  accountName: string;
  glAccountCode: string;
  glAccountName: string;
  agentId: string;
  agentName: string;
  scrollNumber: string;
  isAccountClosed: string;
  isInterestCalculated: string;
  isPassbookMaintenanceCalculated: string;
  isCommissionCalculated: string;

  // Account Summary
  customerId: string;
  customerName: string;
  periodOfDeposit: string;
  openDate: string;
  maturityDate: string;
  completedMonths: string;
  interestRate: string;
  interestAmount: string;
  maintenanceCharges: string;
  commissionCharges: string;
  principalAmount: string;
  refundAmount: string;
  ledgerBalance: string;
  newLedgerBalance: string;
  availableBalance: string;
  interestAdjustmentUptoDate: string;
  modifiedAmount: string;
  withdrawalAmount: string;
  transferAmount: string;

  // Payment Details
  modeOfPayment: string;
  transferAcCode: string;
  transferAcName: string;
  glAccountCodePay: string;
  glAccountNamePay: string;
  ledgerBalancePay: string;
  availableBalancePay: string;
  newLedgerBalancePay: string;
  modeOfRefund: string;
  refundTransferAcCode: string;
  refundTransferAcName: string;
  glAccountCodeRefund: string;
  glAccountNameRefund: string;
  ledgerBalanceRefund: string;
  availableBalanceRefund: string;
  newLedgerBalanceRefund: string;

  // GL Posting Details
  glOutlistSerial: string;
  glOutListDocNo: string;
  adviceNumber: string;
  adviceDate: string;
  originalResponding: string;
  tokenNumber: string;

  // Recovery Summary
  totalDepositAmount: string;
  recoveryPrincipalAmount: string;
  recoveryInterestAmount: string;
  chargesAmount: string;
}

interface FieldConfig {
  key: keyof FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  readOnly?: boolean;
  required?: boolean;
  suffix?: boolean;
  select?: boolean;
  hasMenu?: boolean;
  onMenuClick?: () => void;
}

interface RecoveryRow {
  label: string;
  labelHi: string;
}

// ==========================================
// FORM FIELD (person icon on every field, error state supported)
// ==========================================

function FormField({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  const Icon = field.icon;
  const hasMenu = field.hasMenu || Boolean(field.onMenuClick);
  const isReadOnly = field.readOnly || false;

  if (field.select) {
    return (
      <div className="mb-3 last:mb-0">
        <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
          {field.label}
          <span className="text-slate-400 font-normal">
            {" "}
            <span className="text-slate-600">/</span> {field.labelHi}
          </span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
          <select
            value={value}
            onChange={onChange}
            disabled={isReadOnly}
            className={`
              w-full h-8 rounded-[10px] border
              pl-8 pr-3 text-[11px] outline-none
              focus:ring-1
              appearance-none
              ${isReadOnly
                ? 'bg-[#f0f2f5] text-slate-500 cursor-not-allowed border-slate-200'
                : error
                ? 'bg-white text-slate-600 border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'bg-white text-slate-600 border-slate-300 focus:border-blue-500 focus:ring-blue-500'
              }
            `}
          >
            <option value="" className="text-[11px] text-slate-400">{field.placeholder}</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
        {error && (
          <p className="mt-1 flex items-center gap-1 text-[10px] text-red-500">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-3 last:mb-0">
      <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
        {field.label}
        <span className="text-slate-400 font-normal">
          {" "}
          <span className="text-slate-600">/</span> {field.labelHi}
        </span>
        {field.required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center gap-2">
        <div
          className={`
            group flex flex-1 items-center w-full h-8 rounded-[10px]
            border px-2.5
            transition-all duration-200
            ${isReadOnly
              ? 'bg-[#f0f2f5] border-slate-200 cursor-not-allowed'
              : error
              ? 'bg-white border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
              : 'bg-white border-slate-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
            }
            ${hasMenu ? 'cursor-pointer' : ''}
          `}
        >
          <Icon className={`w-3.5 h-3.5 ${isReadOnly ? 'text-slate-400' : 'text-slate-400'} shrink-0`} />

          <input
            type="text"
            readOnly={isReadOnly}
            placeholder={field.placeholder}
            value={value}
            onChange={isReadOnly ? undefined : onChange}
            className={`
              ml-2 w-full bg-transparent outline-none
              text-[11px]
              placeholder:text-[11px] placeholder:text-slate-400 placeholder:font-normal
              ${hasMenu ? 'pointer-events-none cursor-pointer' : ''}
              ${isReadOnly ? 'text-slate-500 cursor-not-allowed' : 'text-slate-600'}
            `}
          />

          {field.suffix && (
            <span className={`text-[11px] font-medium ml-auto ${isReadOnly ? 'text-slate-400' : 'text-slate-400'}`}>₹</span>
          )}
        </div>

        {hasMenu && (
          <button
            type="button"
            onClick={field.onMenuClick}
            className="flex h-8 w-9 shrink-0 items-center justify-center rounded-[10px] border border-blue-600 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
            title="Open pick list"
          >
            <MoreVertical size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-[10px] text-red-500">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

// ==========================================
// SECTION CARD
// ==========================================

interface CardSectionProps {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

function CardSection({ icon, title, subTitle, description, children, className = '' }: CardSectionProps) {
  return (
    <div className={`border border-[#0256cc]/60 border-t-[3.5px] border-t-[#0256cc] rounded-[14px] p-4 sm:p-5 bg-white shadow-sm ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {title} <span className="text-slate-400 font-normal text-xs">/ {subTitle}</span>
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ==========================================
// YES/NO RADIO FIELD
// ==========================================

interface YesNoFieldProps {
  label: string;
  labelHi: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

function YesNoField({ label, labelHi, name, value, onChange }: YesNoFieldProps) {
  return (
    <div className="mb-2">
      <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
        {label} <span className="text-slate-400 font-normal">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-6 mt-1">
        <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
          <input
            type="radio"
            name={name}
            value="yes"
            checked={value === 'yes'}
            onChange={(e) => onChange(e.target.value)}
            className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium">Yes</span>
        </label>
        <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
          <input
            type="radio"
            name={name}
            value="no"
            checked={value === 'no'}
            onChange={(e) => onChange(e.target.value)}
            className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium">No</span>
        </label>
      </div>
    </div>
  );
}

// ==========================================
// RECOVERY SUMMARY STAT CARD
// ==========================================

interface StatCardProps {
  label: string;
  labelHi: string;
  value: string;
  bg: string;
  text: string;
  border: string;
}

function StatCard({ label, labelHi, value, bg, text, border }: StatCardProps) {
  return (
    <div className={`rounded-[10px] border ${border} ${bg} shadow-sm p-3`}>
      <div className="text-[10px] font-semibold text-slate-500">
        {label} <span className="font-normal">/ {labelHi}</span>
      </div>
      <div className={`text-base font-bold mt-1 ${text}`}>{value}</div>
    </div>
  );
}

// ==========================================
// RECOVERY TABLE
// ==========================================

function RecoveryTable({
  headerLabel,
  headerBg,
  rows,
}: {
  headerLabel: string;
  headerBg: string;
  rows: RecoveryRow[];
}) {
  return (
    <div className="border border-slate-200 rounded-[10px] overflow-hidden shadow-sm">
      <div className={`grid grid-cols-3 ${headerBg} text-white text-[10px] font-bold py-2 px-3`}>
        <div className="text-left">{headerLabel}</div>
        <div className="text-center">Calculated</div>
        <div className="text-center">Recovery</div>
      </div>
      <div className="divide-y divide-slate-100 bg-white">
        {rows.map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-3 py-1.5 px-3 items-center hover:bg-slate-50 transition-colors">
            <div>
              <div className="text-[11px] font-bold text-slate-800">{item.label}</div>
              <div className="text-[10px] text-slate-400">{item.labelHi}</div>
            </div>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
              <input
                type="text"
                defaultValue="0.0"
                className="w-full text-right text-[11px] font-medium border border-slate-200 bg-[#f0f2f5] rounded-[10px] py-1 px-2 pr-3 text-slate-500 cursor-not-allowed outline-none"
                readOnly
              />
            </div>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
              <input
                type="text"
                defaultValue="0.0"
                className="w-full text-right text-[11px] font-medium border border-slate-200 bg-white rounded-[10px] py-1 px-2 pr-3 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

// Required (editable, non-read-only) fields that must be filled before Validate/Save succeed.
const REQUIRED_FIELDS: (keyof FormData)[] = [
  'accountCode',
  'glAccountCode',
  'agentId',
  'scrollNumber',
  'modeOfPayment',
  'transferAcCode',
  'transferAcName',
  'modeOfRefund',
  'refundTransferAcCode',
  'refundTransferAcName',
];

const FIELD_LABELS: Partial<Record<keyof FormData, string>> = {
  accountCode: 'Account Code',
  glAccountCode: 'GL Account Code',
  agentId: 'Agent ID',
  scrollNumber: 'Scroll Number',
  modeOfPayment: 'Mode of Payment',
  transferAcCode: 'Transfer A/c Code',
  transferAcName: 'Transfer A/c Name',
  modeOfRefund: 'Mode of Refund',
  refundTransferAcCode: 'Refund Transfer A/c Code',
  refundTransferAcName: 'Refund Transfer A/c Name',
};

// Pick-list columns + placeholder data — swap rows for real API results.
interface PickListRow {
  code: string;
  name: string;
}

const PICK_LIST_COLUMNS: { key: keyof PickListRow; label: string }[] = [
  { key: 'code', label: 'A/c Code' },
  { key: 'name', label: 'Name' },
];

const ACCOUNT_CODE_OPTIONS: PickListRow[] = [
  { code: '00000000100101', name: 'CASH ON HAND' },
  { code: '00000000100104', name: 'UNSECURED LOAN(MEDIUM-TERM)' },
  { code: '00000000100105', name: 'CASH CREDIT LOAN' },
  { code: '00000000100106', name: 'SECURED MEDIUM-TERM AGRICULTURE' },
  { code: '00000000100107', name: 'PAY DEDUCTION LOAN' },
  { code: '00000000100108', name: 'VEHICLE LOAN' },
  { code: '00000000100110', name: 'GOLD LOAN' },
  { code: '00000000100113', name: 'ADVANCES AGAINST WARE-HOUSE RE' },
  { code: '00000000100114', name: 'STAFF HOUSING LOAN' },
  { code: '00000000100117', name: 'SRINIDHI LOAN (PIGMY)' },
  { code: '00000000100118', name: 'FIXED DEPOSIT LOAN' },
  { code: '00000000100119', name: 'CASH CERTIFICATE LOAN' },
  { code: '00000000100120', name: 'CUMULATIVE DEPOSIT LOAN' },
  { code: '00000000100121', name: 'OVERDRAFT LOAN' },
];

const TRANSFER_AC_OPTIONS: PickListRow[] = [
  { code: '00026010012425', name: 'DALAYAT FAYAJAHMED MAHIBUBSAB' },
  { code: '00026010013044', name: 'TALAWAR BALAVVA RAMANNA' },
  { code: '00026010017248', name: 'SHAHAPUR SRISHAIL SANGAPPA' },
  { code: '00026010019385', name: 'TANKASALI GOVIND VENKAPPA' },
  { code: '00026010020418', name: 'KOTI MAHESH CHANDRASHEKAR WARA' },
  { code: '00026010021409', name: 'KATTIMANI SHIVAPPA VITHOBHA' },
  { code: '00026010021411', name: 'MALI BHAGYASHRI SHRISHAIL' },
  { code: '00026010021424', name: 'KALADAGI MAIBUB ALISAB' },
  { code: '00026010021677', name: 'NADAF ABDUL BABUSAB' },
  { code: '00026010021698', name: 'CHARANTIMATH VISHWANATH PADADA' },
  { code: '00026010021712', name: 'ANGADI GANGUBAI GURASIDDAPPA' },
  { code: '00026010021769', name: 'JAGIRDAR APATA KASIMALI' },
  { code: '00026010021770', name: 'BIRADAR PRAVATI ISHAWAR' },
  { code: '00026010021805', name: 'JIDDIMANI MALLIKARAJUN BASAPPA' },
  { code: '00026010021937', name: 'NIDAGUNDI SIDDAPPA MURIGEPPA' },
  { code: '00026010021956', name: 'NAYADU DAIREPANDIAN' },
];

// ==========================================
// LIST MODAL (pick-list popup, same component reused for Account Code,
// Transfer A/c Code and Refund Transfer A/c Code lookups)
// Styled to match the "Account List" reference screenshots:
// centered underlined title, lavender header band, boxed Pick button + code chip.
// ==========================================

interface ListModalColumn<T> {
  key: keyof T;
  label: string;
}

interface ListModalProps<T extends Record<string, any>> {
  title: string;
  columns: ListModalColumn<T>[];
  rows: T[];
  onSelect: (row: T) => void;
  onClose: () => void;
}

function ListModalSearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { tRaw } = useBilingual();
  return (
    <div className="relative w-full max-w-[260px]">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={tRaw("common.search")}
        className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#0256cc] focus:ring-1 focus:ring-[#0256cc]"
      />
    </div>
  );
}

function ListModalTableHeader<T>({ columns }: { columns: ListModalColumn<T>[] }) {
  const { tRaw } = useBilingual();
  return (
    <thead>
      <tr className="bg-[#E6F0FB] text-slate-700">
        {columns.map((column, i) => (
          <th
            key={String(column.key)}
            className={`px-4 py-3 font-semibold ${i === 0 ? "rounded-l-lg" : "text-center"}`}
          >
            {column.label}
          </th>
        ))}
        <th className="rounded-r-lg px-4 py-3 text-right font-semibold">{tRaw("common.actions")}</th>
      </tr>
    </thead>
  );
}

function ListModalTableRow<T extends Record<string, any>>({
  row,
  columns,
  onSelect,
}: {
  row: T;
  columns: ListModalColumn<T>[];
  onSelect: (row: T) => void;
}) {
  const { tRaw } = useBilingual();
  return (
    <tr className="border-b border-slate-50 last:border-0">
      {columns.map((column, i) => (
        <td key={String(column.key)} className={`px-4 py-3 ${i === 0 ? "" : "text-center text-slate-700"}`}>
          {i === 0 ? (
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {row[column.key]}
            </span>
          ) : (
            row[column.key]
          )}
        </td>
      ))}
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => onSelect(row)}
          className="rounded-lg bg-[#E6F0FB] px-4 py-1.5 text-sm font-medium text-[#0256cc] transition hover:bg-[#CFE3FF]"
        >
          {tRaw("common.select")}
        </button>
      </td>
    </tr>
  );
}

function ListModal<T extends Record<string, any>>({
  title,
  columns,
  rows,
  onSelect,
  onClose,
}: ListModalProps<T>) {
  const { tRaw } = useBilingual();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(q))
    );
  }, [rows, query]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[85vh] w-[95vw] max-w-[560px] flex-col overflow-hidden rounded-[28px] border border-[#0256cc]/60 border-t-4 border-t-[#0256cc] bg-white shadow-2xl">
        {/* Decorative corner circles — clipped to the card */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#E6F0FB]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#E6F0FB]" />

        {/* Header — title, single search box, close circle */}
        <div className="relative z-10 flex items-center justify-between gap-4 px-6 pt-6 pb-5">
          <h2 className="shrink-0 text-lg font-bold text-slate-800">{title}</h2>
          <ListModalSearchInput value={query} onChange={setQuery} />
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
        <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto px-6 pb-6">
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <colgroup>
              {columns.map((column) => (
                <col key={String(column.key)} className="w-[40%]" />
              ))}
              <col className="w-[40%]" />
            </colgroup>
            <ListModalTableHeader columns={columns} />
            <tbody>
              {filtered.map((row, index) => (
                <ListModalTableRow key={index} row={row} columns={columns} onSelect={onSelect} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-sm text-slate-400">
                    {tRaw("common.noResultsFound")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
}

type SuccessModalProps = {
  onClose: () => void;
  title?: string;
  subtitle?: string;
};

function SuccessModal({
  onClose,
  title = "Account Closed Successfully",
  subtitle = "Your Pigmy Account has been Closed Successfully",
}: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div className="relative w-full max-w-[480px] overflow-hidden rounded-[30px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#DCEBFF] opacity-90" />
        <div className="absolute -left-14 -bottom-14 h-44 w-44 rounded-full bg-[#DCEBFF] opacity-90" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-7 top-7 text-[#6F7785] hover:scale-105 transition"
        >
          <X size={28} strokeWidth={2.2} />
        </button>

        <div className="px-12 py-14 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="absolute h-[105px] w-[105px] rounded-full border border-dashed border-[#3F73F5]/20" />
            {[
              "top-0 left-1/2",
              "top-4 left-3",
              "top-6 right-3",
              "left-0 top-1/2",
              "right-0 top-1/2",
              "bottom-5 left-3",
              "bottom-4 right-4",
              "bottom-0 left-1/2",
            ].map((cls, i) => (
              <span
                key={i}
                className={`absolute ${cls} h-[4px] w-[4px] rounded-full bg-[#3F73F5]`}
              />
            ))}
            <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#416EF4] shadow-[0_10px_20px_rgba(65,110,244,0.35)]">
              <Check size={44} strokeWidth={3.5} color="white" />
            </div>
          </div>

          <h2 className="mt-10 text-center text-[26px] font-bold leading-[34px] text-black">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">{subtitle}</p>

          <button
            type="button"
            onClick={onClose}
            className="mt-9 h-[45px] min-w-[88px] rounded-lg bg-[#1F67F4] px-6 text-lg font-semibold text-white shadow-md transition hover:bg-[#0E57EA]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PigmyCloseMask() {
  const { en } = useBilingual();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    // Account Details
    accountCode: '',
    accountName: 'Suresh Kumar Sharma',
    glAccountCode: '',
    glAccountName: 'Pigmy Deposit GL',
    agentId: '',
    agentName: 'Ramesh Patil',
    scrollNumber: '',
    isAccountClosed: 'no',
    isInterestCalculated: 'yes',
    isPassbookMaintenanceCalculated: 'yes',
    isCommissionCalculated: 'yes',

    // Account Summary
    customerId: 'CUST-1024',
    customerName: 'Suresh Kumar Sharma',
    periodOfDeposit: '12 Months',
    openDate: '09-JUL-2025',
    maturityDate: '09-JUL-2026',
    completedMonths: '12',
    interestRate: '8.5',
    interestAmount: '500.00',
    maintenanceCharges: '0.00',
    commissionCharges: '0.00',
    principalAmount: '1,388.89',
    refundAmount: '0.00',
    ledgerBalance: '50,000.00',
    newLedgerBalance: '0.00',
    availableBalance: '50,000.00',
    interestAdjustmentUptoDate: '09-JUL-2026',
    modifiedAmount: '0.00',
    withdrawalAmount: '0.00',
    transferAmount: '0.00',

    // Payment Details
    modeOfPayment: '',
    transferAcCode: '',
    transferAcName: '',
    glAccountCodePay: '',
    glAccountNamePay: '',
    ledgerBalancePay: '0.00',
    availableBalancePay: '0.00',
    newLedgerBalancePay: '0.00',
    modeOfRefund: '',
    refundTransferAcCode: '',
    refundTransferAcName: '',
    glAccountCodeRefund: '',
    glAccountNameRefund: '',
    ledgerBalanceRefund: '0.00',
    availableBalanceRefund: '0.00',
    newLedgerBalanceRefund: '0.00',

    // GL Posting Details
    glOutlistSerial: '001',
    glOutListDocNo: 'DOC-001',
    adviceNumber: 'ADV-001',
    adviceDate: '09-JUL-2026',
    originalResponding: 'Original',
    tokenNumber: 'TKN-001',

    // Recovery Summary
    totalDepositAmount: '50,000.00',
    recoveryPrincipalAmount: '1,388.89',
    recoveryInterestAmount: '500.00',
    chargesAmount: '0.00',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activePickList, setActivePickList] = useState<
    null | { field: keyof FormData; nameField?: keyof FormData; title: string; rows: PickListRow[] }
  >(null);

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // clear the error as soon as the user starts fixing the field
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    // any edit after a successful validation invalidates it again
    setIsValidated(false);
  };

  const handleRadioChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    router.back();
  };

  // ---- Validation ----
  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};

    REQUIRED_FIELDS.forEach((key) => {
      const value = formData[key];
      if (!value || value.trim() === '') {
        nextErrors[key] = `${FIELD_LABELS[key] ?? key} is required`;
      }
    });

    setErrors(nextErrors);
    const valid = Object.keys(nextErrors).length === 0;
    setIsValidated(valid);
    return valid;
  };

  const handleValidate = () => {
    const valid = validateForm();
    if (!valid) {
      // scroll to the first invalid field so the user can see it
      const firstErrorKey = Object.keys(errors)[0] ?? REQUIRED_FIELDS.find((k) => !formData[k]);
      if (firstErrorKey) {
        document.getElementsByName(firstErrorKey as string)[0]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleDisplayProduct = () => {
    console.log('Display Product clicked');
  };

  const handleDisplaySignature = () => {
    console.log('Display Signature clicked');
  };

  const handlePrintVoucher = () => {
    console.log('Print Voucher clicked');
  };

  const handleSave = () => {
    const valid = validateForm();
    if (!valid) return;
    // TODO: call the actual save/close-account API here before showing success.
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    router.back();
  };

  // ---- Pick list wiring ----
  const openAccountCodePickList = () => {
    setActivePickList({
      field: 'accountCode',
      nameField: 'accountName',
      title: 'Account Code List',
      rows: ACCOUNT_CODE_OPTIONS,
    });
  };

  const openTransferAcCodePickList = () => {
    setActivePickList({
      field: 'transferAcCode',
      nameField: 'transferAcName',
      title: 'Transfer A/c Code List',
      rows: TRANSFER_AC_OPTIONS,
    });
  };

  const openRefundTransferAcCodePickList = () => {
    setActivePickList({
      field: 'refundTransferAcCode',
      nameField: 'refundTransferAcName',
      title: 'Refund Transfer A/c Code List',
      rows: TRANSFER_AC_OPTIONS,
    });
  };

  const handlePickListSelect = (row: PickListRow) => {
    if (!activePickList) return;
    setFormData((prev) => ({
      ...prev,
      [activePickList.field]: row.code,
      ...(activePickList.nameField ? { [activePickList.nameField]: row.name } : {}),
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[activePickList.field];
      return next;
    });
    setActivePickList(null);
  };

  // ---- Section 1: Account Details ----
  const accountDetailsFields: FieldConfig[] = [
    {
      key: 'accountCode',
      label: 'Account Code',
      labelHi: 'खाते कोड',
      placeholder: 'Select Account Code',
      icon: MapPin,
      required: true,
      hasMenu: true,
      onMenuClick: openAccountCodePickList,
    },
    {
      key: 'accountName',
      label: 'Account Name',
      labelHi: 'खात्याचे नाव',
      placeholder: 'Account Name',
      icon: User,
      readOnly: true,
    },
    {
      key: 'glAccountCode',
      label: 'GL Account Code',
      labelHi: 'जीएल खाते कोड',
      placeholder: 'GL Account Code',
      icon: Hash,
      required: true,
    },
    {
      key: 'glAccountName',
      label: 'GL Account Name',
      labelHi: 'जीएल खात्याचे नाव',
      placeholder: 'GL Account Name',
      icon: Building2,
      readOnly: true,
    },
    {
      key: 'agentId',
      label: 'Agent ID',
      labelHi: 'एजंट आयडी',
      placeholder: 'Agent ID',
      icon: Hash,
      required: true,
    },
    {
      key: 'agentName',
      label: 'Agent Name',
      labelHi: 'एजंटचे नाव',
      placeholder: 'Agent Name',
      icon: User,
      readOnly: true,
    },
    {
      key: 'scrollNumber',
      label: 'Scroll Number',
      labelHi: 'स्क्रोल क्रमांक',
      placeholder: 'Scroll Number',
      icon: ScrollText,
      required: true,
    },
  ];

  // ---- Section 2: Account Summary (all system-derived / read-only) ----
  const accountSummaryFields: FieldConfig[] = [
    { key: 'customerId', label: 'Customer ID', labelHi: 'ग्राहक आयडी', placeholder: 'Customer ID', icon: Hash, readOnly: true },
    { key: 'customerName', label: 'Customer Name', labelHi: 'ग्राहकाचे नाव', placeholder: 'Customer Name', icon: User, readOnly: true },
    { key: 'periodOfDeposit', label: 'Period of Deposit', labelHi: 'जमा कालावधी', placeholder: 'Period of Deposit', icon: Clock, readOnly: true },
    { key: 'openDate', label: 'Open Date', labelHi: 'प्रारंभ तारीख', placeholder: 'DD-MMM-YYYY', icon: Calendar, readOnly: true },
    { key: 'maturityDate', label: 'Maturity Date', labelHi: 'परिपक्वता तारीख', placeholder: 'DD-MMM-YYYY', icon: CalendarDays, readOnly: true },
    { key: 'completedMonths', label: 'Completed Months', labelHi: 'पूर्ण झालेले महिने', placeholder: 'Completed Months', icon: Calendar, readOnly: true },
    { key: 'interestRate', label: 'Interest Rate', labelHi: 'व्याज दर', placeholder: 'Interest Rate %', icon: Percent, readOnly: true },
    { key: 'interestAmount', label: 'Interest Amount', labelHi: 'व्याज रक्कम', placeholder: 'Interest Amount', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'maintenanceCharges', label: 'Maintenance Charges', labelHi: 'व्यवस्थापन शुल्क', placeholder: 'Maintenance Charges', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'commissionCharges', label: 'Commission Charges', labelHi: 'कमिशन शुल्क', placeholder: 'Commission Charges', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'principalAmount', label: 'Principal Amount', labelHi: 'मूळ रक्कम', placeholder: 'Principal Amount', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'refundAmount', label: 'Refund Amount', labelHi: 'परतावा रक्कम', placeholder: 'Refund Amount', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'ledgerBalance', label: 'Ledger Balance', labelHi: 'लेजर शिल्लक', placeholder: 'Ledger Balance', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'newLedgerBalance', label: 'New Ledger Balance', labelHi: 'नवीन लेजर शिल्लक', placeholder: 'New Ledger Balance', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'availableBalance', label: 'Available Balance', labelHi: 'उपलब्ध शिल्लक', placeholder: 'Available Balance', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'interestAdjustmentUptoDate', label: 'Interest Adjustment Upto Date', labelHi: 'व्याज समायोजन तारीख पर्यंत', placeholder: 'DD-MMM-YYYY', icon: CalendarDays, readOnly: true },
    { key: 'modifiedAmount', label: 'Modified Amount', labelHi: 'सुधारित रक्कम', placeholder: 'Modified Amount', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'withdrawalAmount', label: 'Withdrawal Amount', labelHi: 'काढलेली रक्कम', placeholder: 'Withdrawal Amount', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'transferAmount', label: 'Transfer Amount', labelHi: 'हस्तांतरण रक्कम', placeholder: 'Transfer Amount', icon: IndianRupee, suffix: true, readOnly: true },
  ];

  // ---- Section 3: Payment Details ----
  const paymentFields: FieldConfig[] = [
    { key: 'modeOfPayment', label: 'Mode of Payment', labelHi: 'भरणा पद्धत', placeholder: 'Select Mode of Payment', icon: CreditCard, select: true, required: true },
    {
      key: 'transferAcCode',
      label: 'Transfer A/c Code',
      labelHi: 'हस्तांतरण खाते कोड',
      placeholder: 'Enter Amount',
      icon: Hash,
      required: true,
      hasMenu: true,
      onMenuClick: openTransferAcCodePickList,
    },
    { key: 'transferAcName', label: 'Transfer A/c Name', labelHi: 'हस्तांतरण खाते नाव', placeholder: 'Enter Amount', icon: User, required: true },
    { key: 'glAccountCodePay', label: 'GL Account Code', labelHi: 'जीएल खाते कोड', placeholder: 'GL Account Code', icon: Hash, readOnly: true },
    { key: 'glAccountNamePay', label: 'GL Account Name', labelHi: 'जीएल खाते नाव', placeholder: 'Scroll Number', icon: Building2, readOnly: true },
    { key: 'ledgerBalancePay', label: 'Ledger Balance', labelHi: 'लेजर शिल्लक', placeholder: 'By Cash', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'availableBalancePay', label: 'Available Balance', labelHi: 'उपलब्ध शिल्लक', placeholder: 'Outlist Description', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'newLedgerBalancePay', label: 'New Ledger Balance', labelHi: 'नवीन लेजर शिल्लक', placeholder: 'Outlist Doc No.', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'modeOfRefund', label: 'Mode of Refund', labelHi: 'परतावा पद्धत', placeholder: 'Select Mode of Payment', icon: CreditCard, select: true, required: true },
    {
      key: 'refundTransferAcCode',
      label: 'Refund Transfer A/c Code',
      labelHi: 'परतावा हस्तांतरण खाते कोड',
      placeholder: 'Enter Amount',
      icon: Hash,
      required: true,
      hasMenu: true,
      onMenuClick: openRefundTransferAcCodePickList,
    },
    { key: 'refundTransferAcName', label: 'Refund Transfer A/c Name', labelHi: 'परतावा हस्तांतरण खाते नाव', placeholder: 'Enter Amount', icon: User, required: true },
    { key: 'glAccountCodeRefund', label: 'GL Account Code', labelHi: 'जीएल खाते कोड', placeholder: 'GL Account Code', icon: Hash, readOnly: true },
    { key: 'glAccountNameRefund', label: 'GL Account Name', labelHi: 'जीएल खाते नाव', placeholder: 'Scroll Number', icon: Building2, readOnly: true },
    { key: 'ledgerBalanceRefund', label: 'Ledger Balance', labelHi: 'लेजर शिल्लक', placeholder: 'By Cash', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'availableBalanceRefund', label: 'Available Balance', labelHi: 'उपलब्ध शिल्लक', placeholder: 'Outlist Description', icon: IndianRupee, suffix: true, readOnly: true },
    { key: 'newLedgerBalanceRefund', label: 'New Ledger Balance', labelHi: 'नवीन लेजर शिल्लक', placeholder: 'Outlist Doc No.', icon: IndianRupee, suffix: true, readOnly: true },
  ];

  // ---- Section 4: GL Posting Details (all read-only) ----
  const glPostingFields: FieldConfig[] = [
    { key: 'glOutlistSerial', label: 'GL Outlist Serial', labelHi: 'जीएल आउटलिस्ट क्रमांक', placeholder: 'GL Outlist Serial', icon: FileText, readOnly: true },
    { key: 'glOutListDocNo', label: 'GL Out List Doc. No.', labelHi: 'जीएल आउट लिस्ट दस्तऐवज क्र.', placeholder: 'GL Out List Doc No.', icon: FileText, readOnly: true },
    { key: 'adviceNumber', label: 'Advice Number', labelHi: 'सूचना क्रमांक', placeholder: 'Advice Number', icon: Receipt, readOnly: true },
    { key: 'adviceDate', label: 'Advice Date', labelHi: 'सूचना तारीख', placeholder: 'Advice Date', icon: Calendar, readOnly: true },
    { key: 'originalResponding', label: 'Original / Responding', labelHi: 'मूळ/प्रतिसाद', placeholder: 'Original / Responding', icon: FileCheck, readOnly: true },
    { key: 'tokenNumber', label: 'Token Number', labelHi: 'टोकन क्रमांक', placeholder: 'Token Number', icon: Hash, readOnly: true },
  ];

  // ---- Section 5: Recovery Summary tables ----
  const receivableRows: RecoveryRow[] = [
    { label: 'Insurance', labelHi: 'विमा' },
    { label: 'Notice Fee', labelHi: 'सूचना शुल्क' },
    { label: 'Bank Charges', labelHi: 'बँक शुल्क' },
    { label: 'Court Charges', labelHi: 'न्यायालय शुल्क' },
    { label: 'Recovery Charges', labelHi: 'वसुली शुल्क' },
    { label: 'Interest', labelHi: 'व्याज' },
    { label: 'Other Charges', labelHi: 'इतर शुल्क' },
  ];

  const interestRows: RecoveryRow[] = [
    { label: 'Normal', labelHi: 'सामान्य' },
    { label: 'Overdue', labelHi: 'देय' },
    { label: 'Moratorium', labelHi: 'स्थगन' },
    { label: 'Penal Rec.', labelHi: 'दंड वसुली' },
    { label: 'Penal Int.', labelHi: 'दंड व्याज' },
    { label: 'Unrecovered', labelHi: 'न वसूल' },
    { label: 'Pending OIR', labelHi: 'प्रलंबित OIR' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn="Pigmy Closing"
        titleHi="पिग्मी बंद करा"
        breadcrumbs={[
          { label: en('common.home'), href: '/dashboard' },
          { label: en('sidebar.clerk'), href: '#' },
          { label: en('sidebar.accountClosing'), href: '/account-closing' },
          { label: 'Pigmy', href: '/account-closing/pigmy' },
        ]}
        onBack={handleBack}
        hideActions
      />

      <div className="px-6 py-5 space-y-5 max-w-8xl mx-auto">
        {/* Section 1: Account Details */}
        <CardSection
          icon={<User className="w-4 h-4 text-blue-600" />}
          title="Account Details"
          subTitle="खाते संबंधित माहिती"
          description="Search and verify the account before proceeding with account closure. / खाते बंद करण्यापूर्वी खाते शोधा व पडताळणी करा."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {accountDetailsFields.map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  error={errors[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
            <YesNoField
              label="Is Account Closed?"
              labelHi="खाते बंद आहे का"
              name="isAccountClosed"
              value={formData.isAccountClosed}
              onChange={handleRadioChange('isAccountClosed')}
            />
            <YesNoField
              label="Is Interest Calculated?"
              labelHi="व्याज मोजले गेले आहे का"
              name="isInterestCalculated"
              value={formData.isInterestCalculated}
              onChange={handleRadioChange('isInterestCalculated')}
            />
            <YesNoField
              label="Is Passbook Maintenance Calculated?"
              labelHi="पासबुक देखभाल मोजली आहे का"
              name="isPassbookMaintenanceCalculated"
              value={formData.isPassbookMaintenanceCalculated}
              onChange={handleRadioChange('isPassbookMaintenanceCalculated')}
            />
            <YesNoField
              label="Is Commission Calculated?"
              labelHi="कमिशन मोजले गेले आहे का"
              name="isCommissionCalculated"
              value={formData.isCommissionCalculated}
              onChange={handleRadioChange('isCommissionCalculated')}
            />
          </div>
        </CardSection>

        {/* Section 2: Account Summary */}
        <CardSection
          icon={<Users className="w-4 h-4 text-blue-600" />}
          title="Account Summary"
          subTitle="देय सारांश"
          description="Review customer's deposit, balance and maturity information before closing the account. / खाते बंद करण्यापूर्वी ग्राहकाची जमा, शिल्लक व परिपक्वता माहिती पहा."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {accountSummaryFields.map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  error={errors[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
          </div>
        </CardSection>

        {/* Section 3: Payment Details */}
        <CardSection
          icon={<CreditCard className="w-4 h-4 text-blue-600" />}
          title="Payment Details"
          subTitle="भरणा तपशील"
          description="Manage customer's personal and identity information. / प्राप्तिकारी वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {paymentFields.map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  error={errors[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
          </div>
        </CardSection>

        {/* Section 4: GL Posting Details */}
        <CardSection
          icon={<ClipboardList className="w-4 h-4 text-blue-600" />}
          title="GL Posting Details"
          subTitle="जीएल पोस्टिंग तपशील"
          description="Manage customer's personal and identity information. / प्राप्तिकारी वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {glPostingFields.map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  error={errors[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
          </div>
        </CardSection>

        {/* Section 5: Recovery Summary */}
        <CardSection
          icon={<RefreshCw className="w-4 h-4 text-blue-600" />}
          title="Recovery Summary"
          subTitle="वसुली सारांश"
          description="Review all recoveries and charges before completing account closure. / खाते बंद करण्यापूर्वी सर्व वसुली व शुल्क तपासा."
        >
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
            <StatCard
              label="Total Deposit Amount"
              labelHi="एकूण जमा रक्कम"
              value={`₹${formData.totalDepositAmount}`}
              bg="bg-blue-50"
              text="text-blue-700"
              border="border-blue-100"
            />
            <StatCard
              label="Principal Amount"
              labelHi="मूळ रक्कम"
              value={`₹${formData.recoveryPrincipalAmount}`}
              bg="bg-purple-50"
              text="text-purple-700"
              border="border-purple-100"
            />
            <StatCard
              label="Interest Amount"
              labelHi="व्याज रक्कम"
              value={`₹${formData.recoveryInterestAmount}`}
              bg="bg-pink-50"
              text="text-pink-700"
              border="border-pink-100"
            />
            <StatCard
              label="Charges Amount"
              labelHi="शुल्क रक्कम"
              value={`₹${formData.chargesAmount}`}
              bg="bg-emerald-50"
              text="text-emerald-700"
              border="border-emerald-100"
            />
          </div>

          {/* Two Column Layout for Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <RecoveryTable headerLabel="Receivable" headerBg="bg-[#1e1b4b]" rows={receivableRows} />
            <RecoveryTable headerLabel="Interest" headerBg="bg-[#1e1b4b]" rows={interestRows} />
          </div>

          {/* Footer */}
          <div className="mt-4 bg-[#f0f7ff] border border-slate-200 rounded-[10px] p-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-blue-700 font-medium text-[11px]">
              Total recovery will be debited from the selected account after Save.
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <div className="text-[9px] text-slate-500 font-normal">Total Calculated</div>
                <div className="text-blue-700 text-sm font-bold">₹ 500.00</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-normal">Total Recovery</div>
                <div className="text-blue-700 text-sm font-bold">₹ 500.00</div>
              </div>
            </div>
          </div>
        </CardSection>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pb-4 flex-wrap">
          <button
            onClick={handleValidate}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            Validate <span>✓</span>
          </button>

          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-5 py-2 bg-white border border-[#0b66c2] text-[#0b66c2] hover:bg-slate-50 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            Cancel <span className="text-[10px]">✕</span>
          </button>

          <button
            onClick={handleDisplayProduct}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-700 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            Display Product
          </button>

          <button
            onClick={handleDisplaySignature}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-700 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            Display Signature
          </button>

          <button
            onClick={handlePrintVoucher}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-700 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            Print Voucher <span className="text-xs">🖨️</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!isValidated}
            title={!isValidated ? 'Click Validate and fix any errors first' : undefined}
            className={`flex items-center gap-4 px-6 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
              isValidated
                ? 'bg-[#1F67F4] text-white hover:bg-[#0E57EA] shadow-sm'
                : 'bg-[#e2e8f0] text-slate-400 cursor-not-allowed'
            }`}
          >
            Save <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>

      {activePickList && (
        <ListModal
          title={activePickList.title}
          columns={PICK_LIST_COLUMNS}
          rows={activePickList.rows}
          onClose={() => setActivePickList(null)}
          onSelect={handlePickListSelect}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          onClose={closeSuccessModal}
          title="Account Closed Successfully"
          subtitle="Your Pigmy Account has been Closed Successfully"
        />
      )}
    </div>
  );
}