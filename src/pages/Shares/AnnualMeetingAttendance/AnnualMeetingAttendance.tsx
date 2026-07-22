import { useState, useRef, useMemo } from "react";
import { useRouter } from "@/lib/navigation";
import { ArrowLeft, Home, ChevronRight, Check, X, ChevronDown, Calendar, MoreVertical, Search, Type as TypeIcon } from "lucide-react";
import { FieldShell, TextInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";

/* ===== from AnnualMeetingAttendance.tsx ===== */
interface PickListRow {
  code: string;
  name: string;
}

const ACCOUNT_CODE_OPTIONS: PickListRow[] = [
  { code: "000000002", name: "Appana M Telagi" },
  { code: "000000004", name: "Savings Interest Account" },
  { code: "000000006", name: "Current Interest Account" },
  { code: "000000008", name: "Fixed Deposit Account" },
];

const MEETING_OPTIONS: PickListRow[] = [
  { code: "AGM001", name: "Annual General Meeting 2026" },
  { code: "AGM002", name: "Annual General Meeting 2025" },
  { code: "AGM003", name: "Annual General Meeting 2024" },
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

  const filteredRows = useMemo(() => {
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

// ---- DateInput (same clean pattern used in SMSRegistrationPage) ----
function DateInputField({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="relative flex items-center">
      <span
        onClick={handleIconClick}
        className="absolute left-3 z-10 cursor-pointer text-slate-400"
      >
        <Calendar size={16} />
      </span>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[42px] w-full rounded-md border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary opacity-0 absolute inset-0 cursor-pointer"
        style={{ opacity: 0, position: "absolute" }}
      />
      <div
        onClick={handleIconClick}
        className={`min-h-[42px] w-full rounded-md border ${
          error ? "border-red-400" : "border-[#E5E7EB]"
        } bg-white py-2.5 pl-10 pr-3 text-sm text-gray-700 outline-none cursor-pointer flex items-center`}
      >
        {value || placeholder || "Select Date"}
      </div>
    </div>
  );
}

// ---- Date field + adjoining picker-menu button (Meeting Date only) ----
function DateInputWithMenu({
  value,
  onChange,
  onMenuClick,
  placeholder,
  error,
  menuActive,
}: {
  value: string;
  onChange: (val: string) => void;
  onMenuClick: () => void;
  placeholder?: string;
  error?: boolean;
  menuActive?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <DateInputField value={value} onChange={onChange} placeholder={placeholder} error={error} />
      </div>
      <button
        type="button"
        onClick={onMenuClick}
        className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border transition-colors ${
          menuActive
            ? "border-primary-200 bg-primary-100 text-primary"
            : "border-slate-200 bg-primary-50 text-primary hover:bg-primary-100"
        }`}
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
}

// ---- Text field + adjoining picker-menu button (Account Code only) ----
function TextInputWithMenu({
  value,
  onChange,
  onMenuClick,
  menuActive,
  error,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onMenuClick: () => void;
  menuActive?: boolean;
  error?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <TextInput
          icon={<TypeIcon size={15} />}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={error}
        />
      </div>
      <button
        type="button"
        onClick={onMenuClick}
        className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border transition-colors ${
          menuActive
            ? "border-primary-200 bg-primary-100 text-primary"
            : "border-slate-200 bg-primary-50 text-primary hover:bg-primary-100"
        }`}
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
}

// ---- Readonly text field, same disabled look used across the app ----
function ReadonlyTextField({ value, placeholder }: { value: string; placeholder?: string }) {
  return (
    <div className="flex items-center min-h-[42px] w-full rounded-md border border-[#E5E7EB] bg-[#f0f2f5] px-3">
      <span className="text-slate-400">
        <TypeIcon size={15} />
      </span>
      <span className="ml-2 w-full py-2.5 text-sm text-slate-500 cursor-not-allowed">
        {value || placeholder}
      </span>
    </div>
  );
}

// ==========================================
// FIELD CONFIG
// ==========================================

interface FieldConfig {
  id: string;
  label: string;
  labelHi: string;
  placeholder: string;
  kind: "text" | "date";
  readOnly?: boolean;
  hasMenu?: boolean;
}

const FIELDS: FieldConfig[] = [
  { id: "meetingDate", label: "Meeting Date", labelHi: "सभेची तारीख", placeholder: "Select Meeting Date", kind: "date", hasMenu: true },
  { id: "yearFrom", label: "Year From", labelHi: "वर्षापासून", placeholder: "Enter Year From", kind: "text", readOnly: true },
  { id: "yearTo", label: "Year To", labelHi: "वर्षापर्यंत", placeholder: "Enter Year To", kind: "text", readOnly: true },
  { id: "productCode", label: "Product Code", labelHi: "उत्पादन कोड", placeholder: "Enter Product Code", kind: "text", readOnly: true },
  { id: "accountCode", label: "Account Code", labelHi: "खाते कोड", placeholder: "Enter Account Code", kind: "text", hasMenu: true },
  { id: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", kind: "text", readOnly: true },
  { id: "customerId", label: "Customer ID", labelHi: "ग्राहक आयडी", placeholder: "Enter Customer ID", kind: "text", readOnly: true },
  { id: "address", label: "Address", labelHi: "पत्ता", placeholder: "Enter Address", kind: "text" },
];

type FormState = Record<string, string>;

// ==========================================
// REMARK ROW - Full width
// ==========================================

function RemarkRow({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5">
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-black">
          Remarks <span className="font-medium text-gray-500">/ टिप्पणी</span>
          <span className="text-red-500"> *</span>
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter remarks..."
          rows={3}
          className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none transition-colors resize-none ${
            error ? "border-red-400 focus:border-red-500" : "border-[#E5E7EB] focus:border-primary focus:ring-1 focus:ring-primary"
          }`}
        />
      </div>
    </div>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================

export default function AnnualMeetingAttendancePage() {
  const router = useRouter();
  const handleBack = () => router.back();

  const [form, setForm] = useState<FormState>(
    Object.fromEntries(FIELDS.map((f) => [f.id, ""]))
  );
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [showPickList, setShowPickList] = useState(false);
  const [showMeetingPickList, setShowMeetingPickList] = useState(false);

  const setField = (id: string, val: string) => {
    setForm((prev) => ({ ...prev, [id]: val }));
    setErrors((prev) => (prev[id] ? { ...prev, [id]: false } : prev));
    setIsValidated(false);
  };

  const handleAccountSelect = (row: PickListRow) => {
    setForm((prev) => ({ ...prev, accountCode: row.code, accountName: row.name }));
    setShowPickList(false);
    setIsValidated(false);
  };

  const handleMeetingSelect = (row: PickListRow) => {
    setForm((prev) => ({ ...prev, meetingDate: row.name }));
    setShowMeetingPickList(false);
    setIsValidated(false);
  };

  const validateForm = (): boolean => {
    const nextErrors: Record<string, boolean> = {};
    FIELDS.forEach((f) => {
      if (!form[f.id] || form[f.id].trim() === "") {
        nextErrors[f.id] = true;
      }
    });
    if (!remarks || remarks.trim() === "") {
      nextErrors["remarks"] = true;
    }
    setErrors(nextErrors);
    const valid = Object.keys(nextErrors).length === 0;
    setIsValidated(valid);
    return valid;
  };

  const handleValidate = () => {
    validateForm();
  };

  const handleSave = () => {
    if (!isValidated) return;
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
  };

  return (
    <>
      <div className="min-h-screen app-page-bg p-4">
        <div className="mx-auto max-w-[1600px]">
          {/* Header */}
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-700"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#111827]">
                Annual Meeting Attendance{" "}
                <span className="text-gray-400 font-normal">|</span>{" "}
                <span className="text-gray-400 font-normal">वार्षिक सभेत उपस्थिती</span>
              </h1>
              <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-gray-500">
                <Home size={13} />
                <span>Home</span>
                <ChevronRight size={13} />
                <span>Annual Meeting</span>
                <ChevronRight size={13} />
                <span className="text-primary font-medium">Attendance</span>
              </div>
            </div>
          </div>

          {/* Form card — solid border all around, matching the reference exactly */}
          <div className="rounded-2xl border-2 border-primary bg-white p-6 shadow-sm">
            {/* Section Header */}
            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
             
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Employee Information{" "}
                  <span className="text-xs font-normal text-slate-400">
                    / कर्मचारी माहिती
                  </span>
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Select the employee and basic record information before configuring the meeting attendance.
                </p>
              </div>
            </div>

            {/* Fields - 4 columns */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              {FIELDS.map((f) => {
                const hasError = !!errors[f.id];

                // Meeting Date - Calendar + Menu
                if (f.kind === "date" && f.hasMenu) {
                  return (
                    <div key={f.id}>
                      <label className="mb-1.5 block text-[13px] font-medium text-black">
                        {f.label}
                        <span className="font-medium text-gray-500"> / {f.labelHi}</span>
                        <span className="text-red-500"> *</span>
                      </label>
                      <DateInputWithMenu
                        value={form[f.id] || ""}
                        onChange={(v) => setField(f.id, v)}
                        onMenuClick={() => setShowMeetingPickList(true)}
                        placeholder={f.placeholder}
                        error={hasError}
                        menuActive={showMeetingPickList}
                      />
                    </div>
                  );
                }

                // Account Code - Text + Menu
                if (f.hasMenu) {
                  return (
                    <div key={f.id}>
                      <label className="mb-1.5 block text-[13px] font-medium text-black">
                        {f.label}
                        <span className="font-medium text-gray-500"> / {f.labelHi}</span>
                        <span className="text-red-500"> *</span>
                      </label>
                      <TextInputWithMenu
                        value={form[f.id] || ""}
                        onChange={(v) => setField(f.id, v)}
                        onMenuClick={() => setShowPickList(true)}
                        menuActive={showPickList}
                        error={hasError}
                        placeholder={f.placeholder}
                      />
                    </div>
                  );
                }

                // Read-only fields - disabled, gray background
                if (f.readOnly) {
                  return (
                    <div key={f.id}>
                      <label className="mb-1.5 block text-[13px] font-medium text-black">
                        {f.label}
                        <span className="font-medium text-gray-500"> / {f.labelHi}</span>
                        <span className="text-red-500"> *</span>
                      </label>
                      <ReadonlyTextField value={form[f.id] || ""} placeholder={f.placeholder} />
                    </div>
                  );
                }

                // Address - Editable
                return (
                  <FieldShell key={f.id} label={f.label} labelHi={f.labelHi} required error={hasError}>
                    <TextInput
                      icon={<TypeIcon size={15} />}
                      value={form[f.id] || ""}
                      onChange={(v) => setField(f.id, v)}
                      placeholder={f.placeholder}
                      error={hasError}
                    />
                  </FieldShell>
                );
              })}
            </div>

            {/* Remark Row - Full width */}
            <div className="mt-2 block text-[10px] font-medium text-black">
              <RemarkRow value={remarks} onChange={setRemarks} error={!!errors["remarks"]} />
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleValidate}
                className="flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Validate <Check size={16} />
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel <X size={16} />
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isValidated}
                title={!isValidated ? "Click Validate and fix any errors first" : undefined}
                className={`flex items-center gap-1.5 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
                  isValidated
                    ? "bg-primary text-white hover:bg-primary-700"
                    : "cursor-not-allowed bg-primary-100 text-primary-300"
                }`}
              >
                Save <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pick List Modal - Account Code */}
      {showPickList && (
        <PickListModal
          title="Account Code List"
          rows={ACCOUNT_CODE_OPTIONS}
          onSelect={handleAccountSelect}
          onClose={() => setShowPickList(false)}
        />
      )}

      {/* Pick List Modal - Meeting Date */}
      {showMeetingPickList && (
        <PickListModal
          title="Meeting Date List"
          rows={MEETING_OPTIONS}
          onSelect={handleMeetingSelect}
          onClose={() => setShowMeetingPickList(false)}
        />
      )}

      {successOpen && (
        <SuccessModal
          variant="success"
          title="Attendance Saved Successfully"
          subtitle="The meeting attendance has been saved successfully."
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}
    </>
  );
}
