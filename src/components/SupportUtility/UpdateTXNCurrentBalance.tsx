// src/components/SupportUtility/UpdateTxnCurrentBalanceModal.tsx
import { useMemo, useRef, useState } from "react";
import { User, Building2, Calendar, ChevronDown, MoreVertical, X, Check, AlertCircle, Search } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import SuccessModal from "@/components/shared/SuccessModal";

export interface UpdateTxnCurrentBalanceModalProps {
  open: boolean;
  onClose: () => void;
}

interface PickListRow { code: string; name: string; }

const ACCOUNT_CODE_OPTIONS: PickListRow[] = [
  { code: "000320100000001", name: "Appana M Telagi" },
  { code: "000320100000001", name: "Appana M Telagi" },
  { code: "000320100000001", name: "Appana M Telagi" },
  { code: "000320100000001", name: "Appana M Telagi" },
];

const BRANCH_CODE_OPTIONS: PickListRow[] = [
  { code: "1230", name: "HO Branch" },
  { code: "1240", name: "City Branch" },
  { code: "1250", name: "Market Branch" },
  { code: "1260", name: "Station Branch" },
];

// ============================================
// COMPRESSED COMPONENTS
// ============================================

const BilingualLabel = ({ en, mr, required = true }: any) => (
  <label className="mb-1.5 block truncate text-sm font-medium text-[#1F2858]">
    {en}{mr && <><span className="text-slate-400"> / </span><span className="text-[#64748B]">{mr}</span></>}
    {required && <span className="ml-0.5 text-rose-500">*</span>}
  </label>
);

const FieldWrap = ({ label, labelHi, required = true, error, children, className }: any) => (
  <div className={`flex h-full min-w-0 flex-col ${className || ""}`}>
    <BilingualLabel en={label} mr={labelHi} required={required} />
    {children}
    {error && <p className="mt-1 flex items-center gap-1 text-xs text-rose-500"><AlertCircle className="h-3 w-3" />{error}</p>}
  </div>
);

const TextField = ({ icon, value, placeholder, disabled }: any) => (
  <div className="relative flex min-w-0 flex-1 items-center">
    {icon && <span className="pointer-events-none absolute left-3 text-slate-400">{icon}</span>}
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly
      className={`min-h-[42px] w-full rounded-lg border border-slate-600 px-3 py-2.5 ${icon ? "pl-10" : "pl-3"} text-sm outline-none ${disabled ? "bg-slate-100 text-slate-500" : "bg-white text-slate-700"} focus:border-primary focus:ring-1 focus:ring-primary`}
    />
  </div>
);

// FIXED: Only icon shows, click opens calendar
const DateField = ({ icon, value, onChange, error }: any) => {
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
    <div className="relative flex min-w-0 flex-1 items-center">
      {/* Only icon visible - click to open calendar */}
      <span 
        onClick={handleIconClick}
        className={`absolute left-3 z-10 cursor-pointer ${error ? "text-rose-400" : "text-slate-400"}`}
      >
        {icon}
      </span>
      {/* Hidden input - only for calendar functionality */}
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[42px] w-full rounded-lg border border-slate-600 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary opacity-0 absolute inset-0 cursor-pointer"
        style={{ opacity: 0, position: 'absolute' }}
      />
      {/* Display value */}
      <div 
        onClick={handleIconClick}
        className={`min-h-[42px] w-full rounded-lg border border-slate-600 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none cursor-pointer flex items-center ${
          error ? "border-rose-400" : "border-slate-600"
        }`}
      >
        {value || "Select Date"}
      </div>
    </div>
  );
};

const SelectFieldWithMenu = ({
  icon,
  value,
  onMenuClick,
  menuActive,
  error,
}: any) => (
  <div className="flex flex-1 items-stretch gap-2">
    <div className="relative flex min-w-0 flex-1 items-center">
      {icon && (
        <span
          className={`pointer-events-none absolute left-3 z-10 ${
            error ? "text-rose-400" : "text-slate-400"
          }`}
        >
          {icon}
        </span>
      )}

      <input
        type="text"
        value={value}
        readOnly
        className={`min-h-[42px] w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm outline-none ${
          error
            ? "border-rose-400 focus:border-rose-500"
            : "border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary"
        }`}
      />
    </div>

    {onMenuClick && (
      <button
        type="button"
        onClick={onMenuClick}
        className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border transition ${
          menuActive
            ? "border-primary-200 bg-primary-100 text-primary"
            : "border-slate-200 bg-primary-50 text-primary hover:bg-primary-100"
        }`}
      >
        <MoreVertical size={16} />
      </button>
    )}
  </div>
);
// ============================================
// PICK LIST MODAL
// ============================================

const PickListModal = ({ title, rows, onSelect, onClose }: any) => {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r: any) => r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q));
  }, [rows, search]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[85vh] w-[95vw] max-w-[640px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary-100" />
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-100" />
        <div className="relative z-10 flex items-center justify-between gap-4 px-6 pb-5 pt-6">
          <h2 className="shrink-0 text-lg font-bold text-slate-800">{title}</h2>
          <div className="relative w-full max-w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <button onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto px-6 pb-6">
          <table className="w-full border-collapse text-left text-sm">
            <thead><tr className="bg-primary-100 text-slate-700">
              <th className="rounded-l-lg px-4 py-3 font-semibold">Code</th>
              <th className="px-4 py-3 text-center font-semibold">Name</th>
              <th className="rounded-r-lg px-4 py-3 text-right font-semibold">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((row: any) => (
                <tr key={row.code} className="border-b border-slate-50">
                  <td className="px-4 py-3"><span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{row.code}</span></td>
                  <td className="px-4 py-3 text-center text-slate-700">{row.name}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onSelect(row)} className="rounded-lg bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary-100">Select</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-400">No results found.</td></tr>}
            </tbody>
          </table>
        </div>
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      </div>
    </div>
  );
};

// ============================================
// MAIN
// ============================================

export default function UpdateTxnCurrentBalanceModal({ open, onClose }: UpdateTxnCurrentBalanceModalProps) {
  const [accountCode, setAccountCode] = useState("0002");
  const [accountName, setAccountName] = useState("");
  const [branchCode, setBranchCode] = useState("1230");
  const [branchName, setBranchName] = useState("HO Branch");
  const [currentDate, setCurrentDate] = useState("2026-05-12");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [activePickList, setActivePickList] = useState<"account" | "branch" | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  if (!open) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!accountCode.trim()) next.accountCode = "Account Code is required";
    if (!branchCode.trim()) next.branchCode = "Branch Code is required";
    if (!currentDate.trim()) next.currentDate = "Current Date is required";
    return next;
  };

  const handleValidate = () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    setIsValidated(Object.keys(nextErrors).length === 0);
  };

  const handleUpdate = () => { if (!isValidated) return; setIsSuccessOpen(true); };

  const handleAccountSelect = (row: PickListRow) => {
    setAccountCode(row.code);
    setAccountName(row.name);
    setIsValidated(false);
    setErrors((prev) => ({ ...prev, accountCode: "" }));
    setActivePickList(null);
  };

  const handleBranchSelect = (row: PickListRow) => {
    setBranchCode(row.code);
    setBranchName(row.name);
    setIsValidated(false);
    setErrors((prev) => ({ ...prev, branchCode: "" }));
    setActivePickList(null);
  };

  const handleSuccessClose = () => { setIsSuccessOpen(false); onClose(); };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Update TXN Current Balance"
        titleHi="TXN वर्तमान शिल्लक अपडेट करा"
        subtitleEn="View the parameter information and associated details."
        subtitleHi="पॅरामीटरची माहिती आणि संबंधित तपशील पहा."
        headerIcon={<div className="flex h-12 w-12 items-center justify-center"><Image src="/User.png" alt="Update TXN Current Balance" width={48} height={48} /></div>}
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-4xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button onClick={handleValidate} className="flex h-10 w-[120px] items-center justify-center gap-1.5 rounded-lg bg-[#1565D8] text-sm font-semibold text-white hover:bg-blue-700">
              Validate <Check className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="flex h-10 w-[120px] items-center justify-center gap-1.5 rounded-lg border border-primary text-sm font-semibold text-primary hover:bg-slate-50">
              Cancel <X className="h-4 w-4" />
            </button>
            <button onClick={handleUpdate} disabled={!isValidated} className={`flex h-10 w-[120px] items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition ${isValidated ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
              Update <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="p-1">
          <div className="rounded-[20px] border-x border-b-2 border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0">
              <FieldWrap label="Account Code" labelHi="खाते कोड" error={errors.accountCode}>
               <SelectFieldWithMenu
  icon={<User size={16} />}
  value={accountCode}
  onMenuClick={() => setActivePickList("account")}
  menuActive={activePickList === "account"}
  error={!!errors.accountCode}
/>
              </FieldWrap>

              <FieldWrap label="Account Name" labelHi="खात्याचे नाव">
                <TextField icon={<User size={16} />} value={accountName} placeholder="name@company.com" disabled />
              </FieldWrap>

              <FieldWrap label="Branch Code" labelHi="शाखा कोड" error={errors.branchCode}>
               <SelectFieldWithMenu
  icon={<Building2 size={16} />}
  value={branchCode}
  onMenuClick={() => setActivePickList("branch")}
  menuActive={activePickList === "branch"}
  error={!!errors.branchCode}
/>
              </FieldWrap>

              <FieldWrap label="Branch Name" labelHi="शाखेचे नाव">
                <TextField icon={<Building2 size={16} />} value={branchName} disabled />
              </FieldWrap>

              {/* Current Date - Only icon shows, click opens calendar */}
              <FieldWrap label="Current Date" labelHi="सद्य तारीख" error={errors.currentDate} className="sm:max-w-[700px]">
                <DateField
                  icon={<Calendar size={16} />}
                  value={currentDate}
                  onChange={(v: string) => { setCurrentDate(v); setIsValidated(false); setErrors((prev) => ({ ...prev, currentDate: "" })); }}
                  error={!!errors.currentDate}
                />
              </FieldWrap>
            </div>
          </div>
        </div>
      </FormModal>

      {activePickList === "account" && <PickListModal title="Account Code List" rows={ACCOUNT_CODE_OPTIONS} onSelect={handleAccountSelect} onClose={() => setActivePickList(null)} />}
      {activePickList === "branch" && <PickListModal title="Branch Code List" rows={BRANCH_CODE_OPTIONS} onSelect={handleBranchSelect} onClose={() => setActivePickList(null)} />}
      {isSuccessOpen && (
        <SuccessModal
          variant="success"
          title="Update Successfully"
          subtitle="TXN Current Balance has been Updated Successfully"
          onClose={handleSuccessClose}
          onDone={handleSuccessClose}
        />
      )}
    </>
  );
}