import React, { useState } from "react";
import {
  X,
  Check,
  AlertCircle,
  Hash,
  Calendar,
  MapPin,
  User,
  Building2,
  Landmark,
  CreditCard,
  IndianRupee,
  ScrollText,
  Percent,
  Receipt,
  FileText,
  ChevronDown,
  MoreVertical,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { SectionCard } from "@/components/shared/FormFields";

// ==========================================
// TYPES
// ==========================================

interface FormData {
  serial: string;
  ibcDate: string;
  accountCode: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  drawersReferenceNo: string;
  payeeName: string;
  bankAddress1: string;
  address1: string;
  bankAddress2: string;
  address2: string;
  bankAddress3: string;
  address3: string;
  instrumentType: string;
  instrumentDate: string;
  chequeType: string;
  chequeSeries: string;
  instrumentNumber: string;
  instrumentAmount: string;
  ddComm: string;
  ourBankCommi: string;
  postage: string;
  otherCharges: string;
  realizeUnrealize: string;
  realizeAccountCode: string;
  realizeAccountName: string;
  realizedAmount: string;
  scrollNumber: string;
  realizedInstrumentType: string;
  realizedInstrumentNo: string;
}

interface FieldConfig {
  key: keyof FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
  readOnly?: boolean;
  hasMenu?: boolean;
  onMenuClick?: () => void;
}

// ==========================================
// PICK LIST DATA
// ==========================================

interface PickListRow {
  code: string;
  name: string;
}

const ACCOUNT_CODE_OPTIONS: PickListRow[] = [
  { code: "000320100000001", name: "Appana M Telagi" },
  { code: "000320100000002", name: "Savings Interest Account" },
  { code: "000320100000003", name: "Current Interest Account" },
  { code: "000320100000004", name: "Fixed Deposit Account" },
];

const BANK_CODE_OPTIONS: PickListRow[] = [
  { code: "SBI001", name: "State Bank of India" },
  { code: "HDFC002", name: "HDFC Bank" },
  { code: "ICICI003", name: "ICICI Bank" },
  { code: "AXIS004", name: "Axis Bank" },
];

const BRANCH_CODE_OPTIONS: PickListRow[] = [
  { code: "1230", name: "HO Branch" },
  { code: "1240", name: "City Branch" },
  { code: "1250", name: "Market Branch" },
  { code: "1260", name: "Station Branch" },
];

const INSTRUMENT_TYPE_OPTIONS: PickListRow[] = [
  { code: "cheque", name: "Cheque" },
  { code: "dd", name: "Demand Draft" },
];

const CHEQUE_TYPE_OPTIONS: PickListRow[] = [
  { code: "bearer", name: "Bearer" },
  { code: "order", name: "Order" },
];

const REALIZE_INSTRUMENT_TYPE_OPTIONS: PickListRow[] = [
  { code: "cheque", name: "Cheque" },
  { code: "dd", name: "Demand Draft" },
];

// ==========================================
// PICK LIST MODAL
// ==========================================

function PickListModal({
  title,
  rows,
  onSelect,
  onClose,
}: {
  title: string;
  rows: PickListRow[];
  onSelect: (row: PickListRow) => void;
  onClose: () => void;
}) {
  const [searchText, setSearchText] = useState("");

  const filteredRows = React.useMemo(() => {
    if (!searchText.trim()) return rows;
    const q = searchText.trim().toLowerCase();
    return rows.filter(
      (row) => row.code.toLowerCase().includes(q) || row.name.toLowerCase().includes(q)
    );
  }, [rows, searchText]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[85vh] w-[95vw] max-w-[640px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary-100" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-100" />

        <div className="relative z-10 flex items-center justify-between gap-4 px-6 pb-5 pt-6">
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

        <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto px-6 pb-6">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-primary-100 text-slate-700">
                <th className="rounded-l-lg px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 text-center font-semibold">Name</th>
                <th className="rounded-r-lg px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.code} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {row.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700">{row.name}</td>
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
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-400">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
}

// ==========================================
// SHARED PRIMITIVES
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
  const isDateField = field.key === "ibcDate" || field.key === "instrumentDate";
  const hasMenu = field.hasMenu || Boolean(field.onMenuClick);
  const isReadOnly = field.readOnly || false;

  if (field.select) {
    return (
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
          {field.label}
          <span className="text-slate-400 font-normal"> / {field.labelHi}</span>
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
              w-full h-8 rounded-[10px] border pl-8 pr-3 text-[11px] outline-none
              focus:ring-1 appearance-none
              ${isReadOnly
                ? "bg-[#f0f2f5] text-slate-500 cursor-not-allowed border-slate-200"
                : error
                ? "bg-white text-slate-600 border-red-400 focus:border-red-500 focus:ring-red-500"
                : "bg-white text-slate-600 border-slate-300 focus:border-blue-500 focus:ring-blue-500"}
            `}
          >
            <option value="">{field.placeholder}</option>
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p className="mt-1 flex items-center gap-1 text-[10px] text-red-500">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </div>
    );
  }

  // Date field with calendar icon click
  if (isDateField) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleIconClick = () => {
      const el = inputRef.current;
      if (!el) return;
      if (typeof (el as any).showPicker === "function") {
        (el as any).showPicker();
      } else {
        el.focus();
      }
    };

    return (
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
          {field.label}
          <span className="text-slate-400 font-normal"> / {field.labelHi}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative flex items-center">
          <span
            onClick={!isReadOnly ? handleIconClick : undefined}
            className={`absolute left-3 z-10 ${isReadOnly ? "cursor-default" : "cursor-pointer"} text-slate-400`}
          >
            <Calendar size={16} />
          </span>
          <input
            ref={inputRef}
            type="date"
            value={value}
            onChange={(e) => {
              const syntheticEvent = {
                target: { value: e.target.value }
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }}
            disabled={isReadOnly}
            className={`min-h-[32px] w-full rounded-lg border ${isReadOnly ? "bg-[#f0f2f5] border-slate-200 cursor-not-allowed" : "bg-white border-slate-300"} py-1.5 pl-10 pr-3 text-[11px] text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary opacity-0 absolute inset-0 cursor-pointer`}
            style={{ opacity: 0, position: 'absolute' }}
          />
          <div
            onClick={!isReadOnly ? handleIconClick : undefined}
            className={`min-h-[32px] w-full rounded-lg border ${error ? "border-red-400" : isReadOnly ? "border-slate-200" : "border-slate-300"} ${isReadOnly ? "bg-[#f0f2f5] text-slate-500 cursor-not-allowed" : "bg-white text-slate-700 cursor-pointer"} py-1.5 pl-10 pr-3 text-[11px] outline-none flex items-center`}
          >
            {value || field.placeholder}
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
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
        {field.label}
        <span className="text-slate-400 font-normal"> / {field.labelHi}</span>
        {field.required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <div
          className={`
            flex flex-1 items-center w-full h-8 rounded-[10px] border px-2.5 transition-all duration-200
            ${isReadOnly
              ? "bg-[#f0f2f5] border-slate-200 cursor-not-allowed"
              : error
              ? "bg-white border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"
              : "bg-white border-slate-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"}
          `}
        >
          <Icon className={`w-3.5 h-3.5 ${isReadOnly ? "text-slate-400" : "text-slate-400"} shrink-0`} />
          <input
            type="text"
            placeholder={field.placeholder}
            value={value}
            onChange={onChange}
            disabled={isReadOnly}
            className={`
              ml-2 w-full bg-transparent outline-none text-[11px]
              placeholder:text-[11px] placeholder:text-slate-400 placeholder:font-normal
              ${isReadOnly ? "text-slate-500 cursor-not-allowed" : "text-slate-600"}
            `}
          />
        </div>
        {hasMenu && !isReadOnly && (
          <button
            type="button"
            onClick={field.onMenuClick}
            className="flex h-8 w-9 shrink-0 items-center justify-center rounded-[10px] border border-blue-600 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
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

function SuccessModal({ onClose }: { onClose: () => void }) {
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
              <span key={i} className={`absolute ${cls} h-[4px] w-[4px] rounded-full bg-[#3F73F5]`} />
            ))}
            <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#416EF4] shadow-[0_10px_20px_rgba(65,110,244,0.35)]">
              <Check size={44} strokeWidth={3.5} color="white" />
            </div>
          </div>
          <h2 className="mt-10 text-center text-[26px] font-bold leading-[34px] text-black">
            IBC Marked Successfully
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            The Inward Bill has been marked Realize / Unrealize successfully.
          </p>
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

// ==========================================
// FIELD CONFIG
// ==========================================

const IBC_DETAILS_FIELDS: FieldConfig[] = [
  { key: "serial", label: "Serial", labelHi: "अनुक्रमांक", placeholder: "Serial", icon: Hash, readOnly: true },
  { key: "ibcDate", label: "IBC Date", labelHi: "आवक बिल तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar, readOnly: true },
  { key: "accountCode", label: "Account Code", labelHi: "खाते कोड", placeholder: "Enter Account Code", icon: MapPin, hasMenu: true },
  { key: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", icon: User, readOnly: true },
];

const PAYEE_DETAILS_FIELDS: FieldConfig[] = [
  { key: "bankCode", label: "Bank Code", labelHi: "बँक कोड", placeholder: "Enter Bank Code", icon: Building2, hasMenu: true },
  { key: "bankName", label: "Bank Name", labelHi: "बँकेचे नाव", placeholder: "Enter Bank Name", icon: Building2, readOnly: true },
  { key: "branchCode", label: "Branch Code", labelHi: "शाखा कोड", placeholder: "Enter Branch Code", icon: Landmark, hasMenu: true },
  { key: "branchName", label: "Branch Name", labelHi: "शाखेचे नाव", placeholder: "Enter Branch Name", icon: Landmark, readOnly: true },
  { key: "drawersReferenceNo", label: "Drawer's Reference No.", labelHi: "आहरक संदर्भ क्र.", placeholder: "Reference No.", icon: Hash, required: true },
  { key: "payeeName", label: "Payee Name", labelHi: "प्राप्तकर्त्याचे नाव", placeholder: "Payee Name", icon: User, readOnly: true },
  { key: "bankAddress1", label: "Bank Address 1", labelHi: "बँक पत्ता १", placeholder: "Bank Address 1", icon: MapPin, required: true },
  { key: "address1", label: "Address 1", labelHi: "पत्ता १", placeholder: "Address 1", icon: MapPin, required: true },
  { key: "bankAddress2", label: "Bank Address 2", labelHi: "बँक पत्ता २", placeholder: "Bank Address 2", icon: MapPin, required: true },
  { key: "address2", label: "Address 2", labelHi: "पत्ता २", placeholder: "Address 2", icon: MapPin, required: true },
  { key: "bankAddress3", label: "Bank Address 3", labelHi: "बँक पत्ता ३", placeholder: "Bank Address 3", icon: MapPin, required: true },
  { key: "address3", label: "Address 3", labelHi: "पत्ता ३", placeholder: "Address 3", icon: MapPin, required: true },
  { key: "instrumentType", label: "Instrument Type", labelHi: "साधन प्रकार", placeholder: "Select Instrument Type", icon: CreditCard, hasMenu: true },
  { key: "instrumentDate", label: "Instrument Date", labelHi: "साधन तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar, required: true },
  { key: "chequeType", label: "Cheque Type", labelHi: "चेक प्रकार", placeholder: "Select Cheque Type", icon: FileText, hasMenu: true },
  { key: "chequeSeries", label: "Cheque Series", labelHi: "चेक मालिका", placeholder: "Cheque Series", icon: Hash, required: true },
  { key: "instrumentNumber", label: "Instrument Number", labelHi: "साधन क्रमांक", placeholder: "Instrument Number", icon: Hash, required: true },
  { key: "instrumentAmount", label: "Instrument Amount", labelHi: "साधन रक्कम", placeholder: "Enter Amount", icon: IndianRupee, required: true },
  { key: "ddComm", label: "D.D. Comm.", labelHi: "डीडी कमिशन", placeholder: "Enter Amount", icon: Percent, required: true },
  { key: "ourBankCommi", label: "Our Bank Commi.", labelHi: "आमचे बँक कमिशन", placeholder: "Enter Amount", icon: Percent, required: true },
  { key: "postage", label: "Postage", labelHi: "टपाल खर्च", placeholder: "Enter Amount", icon: IndianRupee, required: true },
  { key: "otherCharges", label: "Other Charges", labelHi: "इतर शुल्क", placeholder: "Enter Amount", icon: IndianRupee, required: true },
];

const REALIZE_DETAILS_FIELDS: FieldConfig[] = [
  {
    key: "realizeUnrealize",
    label: "Realize / Unrealize",
    labelHi: "वसुली / अवसुली",
    placeholder: "Select",
    icon: Receipt,
    select: true,
    required: true,
    options: [
      { value: "realize", label: "Realize" },
      { value: "unrealize", label: "Unrealize" },
    ],
  },
  { key: "realizeAccountCode", label: "Realize Account Code", labelHi: "वसुली खाते कोड", placeholder: "Enter Account Code", icon: MapPin, required: true, hasMenu: true },
  { key: "realizeAccountName", label: "Realize Account Name", labelHi: "वसुली खात्याचे नाव", placeholder: "Enter Account Name", icon: User, readOnly: true },
  { key: "realizedAmount", label: "Realized Amount", labelHi: "वसूल रक्कम", placeholder: "Enter Amount", icon: IndianRupee, required: true },
  { key: "scrollNumber", label: "Scroll Number", labelHi: "स्क्रोल क्रमांक", placeholder: "Scroll Number", icon: ScrollText, required: true },
  { key: "realizedInstrumentType", label: "Realized Instrument Type", labelHi: "वसूल साधन प्रकार", placeholder: "Select Instrument Type", icon: CreditCard, hasMenu: true },
  { key: "realizedInstrumentNo", label: "Realized Instrument No.", labelHi: "वसूल साधन क्रमांक", placeholder: "Instrument No.", icon: Hash, required: true },
];

const REQUIRED_FIELDS: (keyof FormData)[] = [
  ...IBC_DETAILS_FIELDS,
  ...PAYEE_DETAILS_FIELDS,
  ...REALIZE_DETAILS_FIELDS,
]
  .filter((f) => f.required)
  .map((f) => f.key);

const FIELD_LABELS: Record<keyof FormData, string> = Object.fromEntries(
  [...IBC_DETAILS_FIELDS, ...PAYEE_DETAILS_FIELDS, ...REALIZE_DETAILS_FIELDS].map((f) => [f.key, f.label])
) as Record<keyof FormData, string>;

const INITIAL_FORM_DATA: FormData = {
  serial: "",
  ibcDate: "",
  accountCode: "",
  accountName: "",
  bankCode: "",
  bankName: "",
  branchCode: "",
  branchName: "",
  drawersReferenceNo: "",
  payeeName: "",
  bankAddress1: "",
  address1: "",
  bankAddress2: "",
  address2: "",
  bankAddress3: "",
  address3: "",
  instrumentType: "",
  instrumentDate: "",
  chequeType: "",
  chequeSeries: "",
  instrumentNumber: "",
  instrumentAmount: "",
  ddComm: "",
  ourBankCommi: "",
  postage: "",
  otherCharges: "",
  realizeUnrealize: "",
  realizeAccountCode: "",
  realizeAccountName: "",
  realizedAmount: "",
  scrollNumber: "",
  realizedInstrumentType: "",
  realizedInstrumentNo: "",
};

// ==========================================
// MAIN MODAL
// ==========================================

export default function IBCRealizeMarkModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePickList, setActivePickList] = useState<{
    title: string;
    rows: PickListRow[];
    onSelect: (row: PickListRow) => void;
  } | null>(null);

  // Pick list handlers
  const handleAccountCodeMenu = () => {
    setActivePickList({
      title: "Account Code List",
      rows: ACCOUNT_CODE_OPTIONS,
      onSelect: (row: PickListRow) => {
        setFormData((prev) => ({ ...prev, accountCode: row.code, accountName: row.name }));
        setIsValidated(false);
        setErrors((prev) => ({ ...prev, accountCode: "" }));
        setActivePickList(null);
      },
    });
  };

  const handleBankCodeMenu = () => {
    setActivePickList({
      title: "Bank Code List",
      rows: BANK_CODE_OPTIONS,
      onSelect: (row: PickListRow) => {
        setFormData((prev) => ({ ...prev, bankCode: row.code, bankName: row.name }));
        setIsValidated(false);
        setErrors((prev) => ({ ...prev, bankCode: "" }));
        setActivePickList(null);
      },
    });
  };

  const handleBranchCodeMenu = () => {
    setActivePickList({
      title: "Branch Code List",
      rows: BRANCH_CODE_OPTIONS,
      onSelect: (row: PickListRow) => {
        setFormData((prev) => ({ ...prev, branchCode: row.code, branchName: row.name }));
        setIsValidated(false);
        setErrors((prev) => ({ ...prev, branchCode: "" }));
        setActivePickList(null);
      },
    });
  };

  const handleInstrumentTypeMenu = () => {
    setActivePickList({
      title: "Instrument Type List",
      rows: INSTRUMENT_TYPE_OPTIONS,
      onSelect: (row: PickListRow) => {
        setFormData((prev) => ({ ...prev, instrumentType: row.code }));
        setIsValidated(false);
        setErrors((prev) => ({ ...prev, instrumentType: "" }));
        setActivePickList(null);
      },
    });
  };

  const handleChequeTypeMenu = () => {
    setActivePickList({
      title: "Cheque Type List",
      rows: CHEQUE_TYPE_OPTIONS,
      onSelect: (row: PickListRow) => {
        setFormData((prev) => ({ ...prev, chequeType: row.code }));
        setIsValidated(false);
        setErrors((prev) => ({ ...prev, chequeType: "" }));
        setActivePickList(null);
      },
    });
  };

  const handleRealizeAccountCodeMenu = () => {
    setActivePickList({
      title: "Realize Account Code List",
      rows: ACCOUNT_CODE_OPTIONS,
      onSelect: (row: PickListRow) => {
        setFormData((prev) => ({ ...prev, realizeAccountCode: row.code, realizeAccountName: row.name }));
        setIsValidated(false);
        setErrors((prev) => ({ ...prev, realizeAccountCode: "" }));
        setActivePickList(null);
      },
    });
  };

  const handleRealizedInstrumentTypeMenu = () => {
    setActivePickList({
      title: "Realized Instrument Type List",
      rows: REALIZE_INSTRUMENT_TYPE_OPTIONS,
      onSelect: (row: PickListRow) => {
        setFormData((prev) => ({ ...prev, realizedInstrumentType: row.code }));
        setIsValidated(false);
        setErrors((prev) => ({ ...prev, realizedInstrumentType: "" }));
        setActivePickList(null);
      },
    });
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setIsValidated(false);
  };

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key] || formData[key].trim() === "") {
        nextErrors[key] = `${FIELD_LABELS[key]} is required`;
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
      const firstErrorKey = REQUIRED_FIELDS.find((k) => !formData[k]);
      if (firstErrorKey) {
        document.querySelector(`[data-field="${firstErrorKey}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleDisplayVoucher = () => {
    console.log("Display Voucher clicked");
  };

  const handleSave = () => {
    const valid = validateForm();
    if (!valid) return;
    setShowSuccess(true);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  const grid4 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";

  // Update fields with menu handlers
  const ibcFieldsWithMenu = IBC_DETAILS_FIELDS.map(f => {
    if (f.key === "accountCode") {
      return { ...f, onMenuClick: handleAccountCodeMenu };
    }
    return f;
  });

  const payeeFieldsWithMenu = PAYEE_DETAILS_FIELDS.map(f => {
    if (f.key === "bankCode") {
      return { ...f, onMenuClick: handleBankCodeMenu };
    }
    if (f.key === "branchCode") {
      return { ...f, onMenuClick: handleBranchCodeMenu };
    }
    if (f.key === "instrumentType") {
      return { ...f, onMenuClick: handleInstrumentTypeMenu };
    }
    if (f.key === "chequeType") {
      return { ...f, onMenuClick: handleChequeTypeMenu };
    }
    return f;
  });

  const realizeFieldsWithMenu = REALIZE_DETAILS_FIELDS.map(f => {
    if (f.key === "realizeAccountCode") {
      return { ...f, onMenuClick: handleRealizeAccountCodeMenu };
    }
    if (f.key === "realizedInstrumentType") {
      return { ...f, onMenuClick: handleRealizedInstrumentTypeMenu };
    }
    return f;
  });

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="IBC Realize / Unrealize"
        titleHi="IBC रियलाईज/अनरियलाईज"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-10 w-10 items-center justify-center">
            <Image src="/person icon.png" alt="IBC Realize / Unrealize" width={40} height={40} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-5xl"
      >
        {/* IBC Details - 4 Columns */}
        <SectionCard
          titleEn="IBC Details"
          titleHi="आवकीची तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
          icon={<User size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {ibcFieldsWithMenu.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key]} error={errors[field.key]} onChange={handleChange(field.key)} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Payee Details - 4 Columns */}
        <SectionCard
          titleEn="Payee Details"
          titleHi="प्राप्तकर्ता तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
          icon={<Landmark size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {payeeFieldsWithMenu.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key]} error={errors[field.key]} onChange={handleChange(field.key)} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Realize / Unrealize Details - 4 Columns */}
        <SectionCard
          titleEn="Realize / Unrealize Details"
          titleHi="वसुली / अवसुली तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
          icon={<CreditCard size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {realizeFieldsWithMenu.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key]} error={errors[field.key]} onChange={handleChange(field.key)} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Footer */}
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
            onClick={handleDisplayVoucher}
            className="flex items-center gap-1.5 rounded-lg bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-700 px-4 py-2.5 text-sm font-medium transition-colors"
          >
            Display Voucher
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
            disabled={!isValidated}
            className={`flex items-center gap-1.5 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium transition-colors ${
              isValidated
                ? "bg-primary text-white hover:bg-primary-700"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            Save <ChevronDown size={16} />
          </button>
        </div>
      </FormModal>

      {/* Pick List Modal */}
      {activePickList && (
        <PickListModal
          title={activePickList.title}
          rows={activePickList.rows}
          onSelect={activePickList.onSelect}
          onClose={() => setActivePickList(null)}
        />
      )}

      {showSuccess && <SuccessModal onClose={closeSuccess} />}
    </>
  );
}