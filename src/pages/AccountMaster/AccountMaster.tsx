import React, { useState } from "react";
import Image from "@/components/ui/Image";
import { X, IdCard, User, Calendar, Coins, FileText, ChevronDown, Check, Upload, CreditCard, UserRound, Eye, SquarePen, UserRoundCog, Lock, BookOpenCheck, ClipboardList, StickyNote, ShieldAlert, PiggyBank, ShieldPlus, Tag, ShieldCheck, Hash, IndianRupee, Clock, Plus, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { IMAGES } from "@/assets";
import SuccessModal from "@/components/shared/SuccessModal";
import { type RowActionMenuItem } from "@/components/shared/RowActionMenu";
import AccountMasterTable, { type RowData } from "@/components/AccountMaster/AccountMasterTable";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, SelectInput, TextInput, DateInput } from "@/components/shared/FormFields";
import { toast } from "react-toastify";
import NavbarAM from "@/components/AccountMaster/NavbarAM";
import AddAccountMaster from "@/components/AccountMaster/AddAccountMaster";
import AddInvestmentAccountMaster from "@/components/futuremodels/AddInvestmentAccountMaster";
import AddTermLoanMaster from "@/components/futuremodels/AddTermLoanMaster";
import FixedAssetPage from "@/pages/futuremodels/FixedAsset/FixedAsset";
import ViewAccountModal, { type AccountDetails } from "@/components/AccountMaster/ViewAccount";
import AddSI from "@/components/StandingInstruction/AddSI";
import MemoModal from "@/pages/futuremodels/Memo/Memo";
import LeanPage from "@/pages/futuremodels/Lean/Lean";
import AddPigmyDepositModal from "@/components/futuremodels/AddPigmyDepositModal";
/** Shared with pages/AccountMasterPage.tsx (the /accountmaster route) — kept standalone, not inlined. */
import ChequeBookIssue from "@/components/AccountMaster/Cheque/cheque-issue";
import { useBilingual } from "@/i18n/useBilingual";
import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import TransactionTypeCard from "@/components/TransactionMaster/TransactionTypeCard";
import type { TransactionTypeItem } from "@/components/TransactionMaster/transactionTypes";
import { accountMasterOptions } from "@/components/shared/AccountTypeCards";

/* ===== from AccountFreezeModal.tsx ===== */
const AccountFreezeModal_FREEZE_TYPE_OPTIONS = ["All", "Partial", "Withdrawal"];

export interface AccountFreezeModal_AccountFreezeData {
  accountCode?: string;
  name?: string;
}

export interface AccountFreezeModal_AccountFreezeSubmitPayload {
  status: "Freeze" | "Unfreeze";
  freezeType: string;
  freezeDate: string;
  freezeAmount: string;
  reason: string;
}

interface AccountFreezeModal_AccountFreezeModalProps {
  onClose: () => void;
  onSubmit?: (payload: AccountFreezeModal_AccountFreezeSubmitPayload) => void;
  data?: AccountFreezeModal_AccountFreezeData;
}

function AccountFreezeModal_ReadOnlyField({
  icon: Icon,
  labelEn,
  labelMr,
  value,
}: {
  icon: LucideIcon;
  labelEn: string;
  labelMr?: string;
  value?: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <label className="mb-1.5 block truncate text-[14px] font-medium text-[#1F2937] dark:text-slate-100">
        {labelEn}
        {labelMr && (
          <>
            <span className="text-slate-400 dark:text-slate-500"> / </span>
            <span className="text-[#64748B] dark:text-slate-400">{labelMr}</span>
          </>
        )}
        <span className="ml-0.5 text-rose-500">*</span>
      </label>
      <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        <Icon size={16} className="shrink-0 text-slate-400" />
        <span className="truncate">{value || "—"}</span>
      </div>
    </div>
  );
}

function AccountFreezeModal_Checkbox({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-[15px] text-slate-700 dark:text-slate-100"
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked ? "border-primary bg-primary text-white" : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
        }`}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}

function AccountFreezeModal({ onClose, onSubmit, data }: AccountFreezeModal_AccountFreezeModalProps) {
  const [status, setStatus] = useState<"Freeze" | "Unfreeze">("Freeze");
  const [freezeType, setFreezeType] = useState(AccountFreezeModal_FREEZE_TYPE_OPTIONS[0]);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [freezeDate, setFreezeDate] = useState("");
  const [freezeAmount, setFreezeAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit?.({ status, freezeType, freezeDate, freezeAmount, reason });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-[640px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl dark:bg-slate-900">
        <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-primary-50 blur-2xl" aria-hidden />
        <div className="pointer-events-none absolute -left-20 top-1/3 h-48 w-48 rounded-full bg-primary-50 blur-2xl" aria-hidden />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-4 px-8 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
              <Image src={IMAGES.PERSON_ICON} alt="" fill sizes="48px" className="object-contain" />
            </span>
            <h2 className="text-[22px] font-bold text-[#1E1B4B] dark:text-slate-100">
              Account Status
              <span className="text-slate-400 dark:text-slate-500">/ </span>
              <span className="font-semibold text-[#64748B] dark:text-slate-400">खात्याची स्थिती</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-8 pb-6">
          <div className="flex flex-col gap-5">
            <div className="flex gap-4">
              <AccountFreezeModal_ReadOnlyField icon={IdCard} labelEn="Account Code" labelMr="खात्याचा कोड" value={data?.accountCode} />
              <AccountFreezeModal_ReadOnlyField icon={User} labelEn="Name" labelMr="नाव" value={data?.name} />
            </div>

            <div>
              <span className="mb-2 block text-[14px] font-medium text-[#1F2937] dark:text-slate-100">
                Status<span className="ml-0.5 text-rose-500">*</span>
              </span>
              <div className="flex items-center gap-8">
                <AccountFreezeModal_Checkbox label="Freeze" checked={status === "Freeze"} onClick={() => setStatus("Freeze")} />
                <AccountFreezeModal_Checkbox label="Unfreeze" checked={status === "Unfreeze"} onClick={() => setStatus("Unfreeze")} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#1F2937] dark:text-slate-100">
                Freeze All / Partial / Withdrawal
                <span className="text-slate-400 dark:text-slate-500"> सर्व / काही / रक्कम थांबवा</span>
                <span className="ml-0.5 text-rose-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTypeOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={isTypeOpen}
                  className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white px-4 text-left transition-colors dark:bg-slate-900 ${
                    isTypeOpen ? "border-primary ring-2 ring-primary/10" : "border-primary hover:border-primary-700"
                  }`}
                >
                  <span className="text-sm text-slate-700 dark:text-slate-100">{freezeType}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-500 transition-transform ${isTypeOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isTypeOpen && (
                  <ul
                    role="listbox"
                    className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  >
                    {AccountFreezeModal_FREEZE_TYPE_OPTIONS.map((opt) => (
                      <li key={opt}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={opt === freezeType}
                          onClick={() => {
                            setFreezeType(opt);
                            setIsTypeOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition ${
                            opt === freezeType ? "bg-primary-50 text-primary" : "text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {opt}
                          {opt === freezeType && <Check className="h-4 w-4" strokeWidth={1.75} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#1F2937] dark:text-slate-100">
                Freeze Date<span className="text-slate-400 dark:text-slate-500"> / फ्रीज तारीख</span>
                <span className="ml-0.5 text-rose-500">*</span>
              </label>
              <div className="relative flex h-11 items-center rounded-lg border border-primary px-3 focus-within:ring-2 focus-within:ring-primary/10">
                <Calendar size={16} className="shrink-0 text-slate-400" />
                <input
                  type="date"
                  value={freezeDate}
                  onChange={(e) => setFreezeDate(e.target.value)}
                  className="ml-2 w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#1F2937] dark:text-slate-100">
                Freeze Amount <span className="text-slate-400 dark:text-slate-500">/ रक्कम स्थिर करा</span>
                <span className="ml-0.5 text-rose-500">*</span>
              </label>
              <div className="flex h-11 items-center rounded-lg border border-primary px-3 focus-within:ring-2 focus-within:ring-primary/10">
                <Coins size={16} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  inputMode="decimal"
                  value={freezeAmount}
                  onChange={(e) => setFreezeAmount(e.target.value)}
                  placeholder="0.00"
                  className="ml-2 w-full bg-transparent text-right text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#1F2937] dark:text-slate-100">
                Reason for Change Status<span className="ml-0.5 text-rose-500">*</span>
              </label>
              <div className="flex items-start gap-2 rounded-lg border border-primary px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/10">
                <FileText size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for Changing Status"
                  className="w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>
            </div>
          </div>
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

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-center gap-6 border-t border-slate-100 px-8 py-5 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-6 py-2.5 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-primary-700"
          >
            Submit
            <Upload className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


/* ===== from AccountOperativeModal.tsx ===== */
export interface AccountOperativeModal_AccountOperativeData {
  accountCode: string;
  name: string;
  currentStatus?: "Operative" | "Inoperative";
}

export interface AccountOperativeModal_AccountOperativeSubmitPayload {
  status: "Operative" | "Inoperative";
  reason: string;
}

export interface AccountOperativeModal_AccountOperativeModalProps {
  data: AccountOperativeModal_AccountOperativeData;
  onClose: () => void;
  onSubmit: (payload: AccountOperativeModal_AccountOperativeSubmitPayload) => void;
}
function AccountOperativeModal({
  data,
  onClose,
  onSubmit,
}: AccountOperativeModal_AccountOperativeModalProps) {
  const [status, setStatus] = useState<"Operative" | "Inoperative">(
    data.currentStatus ?? "Operative"
  );
  const [reason, setReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const canSubmit = reason.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setShowSuccess(true);
  };

const AccountOperativeModal_handleDone = () => {
  setShowSuccess(false);
  onSubmit({ status, reason });
};
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          style={{ padding: "28px 32px" }}
        >
          {/* Decorative background blobs */}
          <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-blue-100/60" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-blue-100/50" />

          {/* ── Header ─────────────────────────────────────── */}
          <div className="relative z-10 mb-7 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img src={IMAGES.ACCOUNT_STATUS} alt="Account Status" className="h-14 w-14 shrink-0 object-contain" />
              <h2 className="text-2xl font-bold text-slate-800">
                Account Status{" "}
                <span className="font-bold text-[#64748B]">/ खात्याची स्थिती</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* ── Body ───────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col gap-6">
            {/* Account Code / Name */}
            <div className="grid grid-cols-2 gap-8">
              <AccountOperativeModal_FieldWrap label="Account Code" labelHi="खात्याचा कोड" required>
                <AccountOperativeModal_ReadOnlyInput value={data.accountCode} icon={<CreditCard size={18} className="text-slate-400" />} />
              </AccountOperativeModal_FieldWrap>

              <AccountOperativeModal_FieldWrap label="Name" labelHi="नाव" required>
                <AccountOperativeModal_ReadOnlyInput value={data.name} icon={<UserRound size={18} className="text-slate-400" />} />
              </AccountOperativeModal_FieldWrap>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-1 text-base font-semibold text-slate-800">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-8">
                {(["Operative", "Inoperative"] as const).map((opt) => {
                  const checked = status === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStatus(opt)}
                      className="flex items-center gap-3 text-lg text-slate-700"
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-md border-2 transition ${
                          checked
                            ? "border-[#1565D8] bg-[#1565D8] text-white"
                            : "border-[#1565D8] bg-white"
                        }`}
                      >
                        {checked && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M3 8.5L6.5 12L13 4.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reason for Change Status */}
            <AccountOperativeModal_FieldWrap label="Reason for Change Status" required>
              <div className="relative">
                <FileText size={18} className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for Changing Status"
                  rows={5}
                  className="w-full resize-none rounded-lg border border-[#1565D8] bg-white py-3 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
                />
              </div>
            </AccountOperativeModal_FieldWrap>
          </div>

          {/* ── Footer ─────────────────────────────────────── */}
          <div className="relative z-10 mt-7 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#1565D8] px-8 py-2.5 text-sm font-semibold text-[#1565D8] transition hover:bg-blue-50"
            >
              Cancel <X className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-8 py-2.5 text-sm font-semibold text-white transition ${
                canSubmit
                  ? "bg-[#1565D8] hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Submit <Upload className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Success modal */}
      {showSuccess && (
        <SuccessModal
          onClose={AccountOperativeModal_handleDone}
          onDone={AccountOperativeModal_handleDone}
          title="Account Status Updated"
          subtitle={`The account status has been changed to ${status} successfully.`}
        />
      )}
    </>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function AccountOperativeModal_FieldWrap({
  label,
  labelHi,
  required,
  children,
}: {
  label: string;
  labelHi?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-1 text-base font-semibold text-slate-800">
        <span>{label}</span>
        {labelHi && <span className="font-normal text-slate-500"> / {labelHi}</span>}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function AccountOperativeModal_ReadOnlyInput({ value, icon }: { value: string; icon: React.ReactNode }) {
  return (
    <div className="flex h-12 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
      {icon}
      <span className="text-sm text-slate-500">{value}</span>
    </div>
  );
}


/* ===== from accountTypeMenuConfig.tsx ===== */
/** Row-action callbacks a page wires up; each account type's menu only calls the subset it needs. */
export interface AccountTypeMenuConfig_AccountRowMenuHandlers {
  onView: (row: RowData) => void;
  onEdit: (row: RowData) => void;
  onFreeze: (row: RowData) => void;
  onOperative: (row: RowData) => void;
  onChequeBookIssue: (row: RowData) => void;
  onStandingInstruction: (row: RowData) => void;
  onMemo: (row: RowData) => void;
  onLienMark: (row: RowData) => void;
  onPigmyOpenDetails: (row: RowData) => void;
  onAddInsuranceDetails: (row: RowData) => void;
}

export interface AccountTypeMenuConfig_AccountTypeMenuConfig {
  accountType: AccountMasterPage_AccountMasterType;
  getMenuItems: (
    row: RowData,
    tRaw: (key: string) => string,
    handlers: AccountTypeMenuConfig_AccountRowMenuHandlers
  ) => RowActionMenuItem[];
}

const AccountTypeMenuConfig_viewEditFreezeItems = (
  row: RowData,
  tRaw: (key: string) => string,
  handlers: AccountTypeMenuConfig_AccountRowMenuHandlers
): RowActionMenuItem[] => [
  { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => handlers.onView(row) },
  { key: "edit", label: tRaw("common.edit"), icon: SquarePen, onClick: () => handlers.onEdit(row) },
  { key: "freeze", label: tRaw("accountMaster.table.menuFreezeUnfreeze"), icon: Lock, onClick: () => handlers.onFreeze(row) },
];

const AccountTypeMenuConfig_addInsuranceDetailsItem = (
  row: RowData,
  tRaw: (key: string) => string,
  handlers: AccountTypeMenuConfig_AccountRowMenuHandlers
): RowActionMenuItem => ({
  key: "addInsuranceDetails",
  label: tRaw("accountMaster.table.menuAddInsuranceDetails"),
  icon: ShieldPlus,
  onClick: () => handlers.onAddInsuranceDetails(row),
});

// CA/SA Account Type - Menu 1 (Edit only — no View, per this account type's own requirement)
const AccountTypeMenuConfig_caSaMenuConfig: AccountTypeMenuConfig_AccountTypeMenuConfig = {
  accountType: "ca-sa",
  getMenuItems: (row, tRaw, handlers) => [
    { key: "edit", label: tRaw("common.edit"), icon: SquarePen, onClick: () => handlers.onEdit(row) },
    { key: "freeze", label: tRaw("accountMaster.table.menuFreezeUnfreeze"), icon: Lock, onClick: () => handlers.onFreeze(row) },
    { key: "chequeBookIssue", label: tRaw("accountMaster.table.menuChequeBookIssue"), icon: BookOpenCheck, onClick: () => handlers.onChequeBookIssue(row) },
    { key: "standingInstruction", label: tRaw("accountMaster.table.menuStandingInstruction"), icon: ClipboardList, onClick: () => handlers.onStandingInstruction(row) },
    { key: "memo", label: tRaw("accountMaster.table.menuMemo"), icon: StickyNote, onClick: () => handlers.onMemo(row) },
    { key: "operative", label: tRaw("accountMaster.table.menuOperativeInoperative"), icon: UserRoundCog, onClick: () => handlers.onOperative(row) },
    AccountTypeMenuConfig_addInsuranceDetailsItem(row, tRaw, handlers),
  ],
};

// Deposit Account Type - Menu 2
const AccountTypeMenuConfig_depositMenuConfig: AccountTypeMenuConfig_AccountTypeMenuConfig = {
  accountType: "deposit",
  getMenuItems: (row, tRaw, handlers) => [
    ...AccountTypeMenuConfig_viewEditFreezeItems(row, tRaw, handlers),
    { key: "lienMark", label: tRaw("accountMaster.table.menuLienMark"), icon: ShieldAlert, onClick: () => handlers.onLienMark(row) },
    { key: "memo", label: tRaw("accountMaster.table.menuMemo"), icon: StickyNote, onClick: () => handlers.onMemo(row) },
    AccountTypeMenuConfig_addInsuranceDetailsItem(row, tRaw, handlers),
  ],
};

// Loan Account Type - Menu 3
const AccountTypeMenuConfig_loanMenuConfig: AccountTypeMenuConfig_AccountTypeMenuConfig = {
  accountType: "loan",
  getMenuItems: (row, tRaw, handlers) => [
    ...AccountTypeMenuConfig_viewEditFreezeItems(row, tRaw, handlers),
    { key: "memo", label: tRaw("accountMaster.table.menuMemo"), icon: StickyNote, onClick: () => handlers.onMemo(row) },
    AccountTypeMenuConfig_addInsuranceDetailsItem(row, tRaw, handlers),
  ],
};

// Investment Account Type - Menu 4
const AccountTypeMenuConfig_investmentMenuConfig: AccountTypeMenuConfig_AccountTypeMenuConfig = {
  accountType: "investment",
  getMenuItems: (row, tRaw, handlers) => AccountTypeMenuConfig_viewEditFreezeItems(row, tRaw, handlers),
};

// Fixed Asset Account Type - Menu 4 (same as investment, plus Add Insurance Details)
const AccountTypeMenuConfig_fixedAssetMenuConfig: AccountTypeMenuConfig_AccountTypeMenuConfig = {
  accountType: "fixed-asset",
  getMenuItems: (row, tRaw, handlers) => [
    ...AccountTypeMenuConfig_viewEditFreezeItems(row, tRaw, handlers),
    AccountTypeMenuConfig_addInsuranceDetailsItem(row, tRaw, handlers),
  ],
};

// Pigmy Account Type - Menu 5
const AccountTypeMenuConfig_pigmyMenuConfig: AccountTypeMenuConfig_AccountTypeMenuConfig = {
  accountType: "pigmy",
  getMenuItems: (row, tRaw, handlers) => [
    ...AccountTypeMenuConfig_viewEditFreezeItems(row, tRaw, handlers),
    { key: "pigmyOpenDetails", label: tRaw("accountMaster.table.menuPigmyOpenDetails"), icon: PiggyBank, onClick: () => handlers.onPigmyOpenDetails(row) },
  ],
};

// Configuration mapping
export const AccountTypeMenuConfig_accountTypeMenuConfigs: Record<AccountMasterPage_AccountMasterType, AccountTypeMenuConfig_AccountTypeMenuConfig> = {
  "ca-sa": AccountTypeMenuConfig_caSaMenuConfig,
  deposit: AccountTypeMenuConfig_depositMenuConfig,
  loan: AccountTypeMenuConfig_loanMenuConfig,
  investment: AccountTypeMenuConfig_investmentMenuConfig,
  "fixed-asset": AccountTypeMenuConfig_fixedAssetMenuConfig,
  pigmy: AccountTypeMenuConfig_pigmyMenuConfig,
};

/** Returns the row-action menu items for a given account type, wired to the caller's handlers. */
export const AccountTypeMenuConfig_getMenuItemsForAccountType = (
  accountType: AccountMasterPage_AccountMasterType,
  row: RowData,
  tRaw: (key: string) => string,
  handlers: AccountTypeMenuConfig_AccountRowMenuHandlers
): RowActionMenuItem[] => {
  const config = AccountTypeMenuConfig_accountTypeMenuConfigs[accountType];
  if (!config) {
    console.warn(`No menu configuration found for account type: ${accountType}`);
    return [];
  }
  return config.getMenuItems(row, tRaw, handlers);
};


/* ===== from AddInsuranceDetailsModal.tsx ===== */
export interface AddInsuranceDetailsModal_InsuranceDetailsData {
  securityTypeCode: string;
  insuranceName: string;
  policyNo: string;
  policyAmount: string;
  assuredAmount: string;
  premiumAmount: string;
  securityValue: string;
  startDate: string;
  endDate: string;
  particular: string;
  premiumPeriod: string;
}

type AddInsuranceDetailsModal_FieldErrors = Partial<Record<keyof AddInsuranceDetailsModal_InsuranceDetailsData, string>>;

const AddInsuranceDetailsModal_SECURITY_TYPE_CODES = ["Life Insurance", "Vehicle Insurance", "Property Insurance", "Health Insurance"];
const AddInsuranceDetailsModal_PREMIUM_PERIODS = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];

const AddInsuranceDetailsModal_emptyData = (): AddInsuranceDetailsModal_InsuranceDetailsData => ({
  securityTypeCode: "",
  insuranceName: "",
  policyNo: "",
  policyAmount: "",
  assuredAmount: "",
  premiumAmount: "",
  securityValue: "",
  startDate: "",
  endDate: "",
  particular: "",
  premiumPeriod: "",
});

// First card is always "Primary Information"; every duplicate after that
// is numbered so the person can tell them apart.
const AddInsuranceDetailsModal_sectionTitle = (index: number) =>
  index === 0
    ? { en: "Primary Information", hi: "प्राथमिक माहिती" }
    : { en: `Additional Information ${index}`, hi: `अतिरिक्त माहिती ${index}` };

const AddInsuranceDetailsModal_sectionSubtitle = (index: number) =>
  index === 0
    ? {
        en: "Add the primary insurance policy details for this security",
        hi: "या सुरक्षिततेसाठी प्राथमिक विमा पॉलिसी तपशील जोडा",
      }
    : {
        en: "Add another insurance policy linked to the same security",
        hi: "त्याच सुरक्षिततेशी संबंधित आणखी एक विमा पॉलिसी जोडा",
      };

export interface AddInsuranceDetailsModal_AddInsuranceDetailsModalProps {
  open: boolean;
  onClose?: () => void;
  onSave?: (data: AddInsuranceDetailsModal_InsuranceDetailsData[]) => void;
}

const AddInsuranceDetailsModal_TABS = ["Primary Information"] as const;

const AddInsuranceDetailsModal = ({ open, onClose, onSave }: AddInsuranceDetailsModal_AddInsuranceDetailsModalProps) => {
  const [sections, setSections] = useState<AddInsuranceDetailsModal_InsuranceDetailsData[]>([AddInsuranceDetailsModal_emptyData()]);
  const [errorsList, setErrorsList] = useState<AddInsuranceDetailsModal_FieldErrors[]>([{}]);
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const setField = (index: number, patch: Partial<AddInsuranceDetailsModal_InsuranceDetailsData>) => {
    setSections((prev) => prev.map((section, i) => (i === index ? { ...section, ...patch } : section)));
    setIsValidated(false);
  };

  const handleAddSection = () => {
    setSections((prev) => [...prev, AddInsuranceDetailsModal_emptyData()]);
    setErrorsList((prev) => [...prev, {}]);
    setIsValidated(false);
  };

  const handleRemoveSection = (index: number) => {
    if (index === 0) return; // the Primary Information card can't be removed
    setSections((prev) => prev.filter((_, i) => i !== index));
    setErrorsList((prev) => prev.filter((_, i) => i !== index));
    setIsValidated(false);
  };

  const validateOne = (data: AddInsuranceDetailsModal_InsuranceDetailsData): AddInsuranceDetailsModal_FieldErrors => {
    const nextErrors: AddInsuranceDetailsModal_FieldErrors = {};
    if (!data.securityTypeCode.trim()) nextErrors.securityTypeCode = "Security Type Code is required";
    if (!data.insuranceName.trim()) nextErrors.insuranceName = "Insurance Name is required";
    if (!data.policyNo.trim()) nextErrors.policyNo = "Policy No is required";
    if (!data.policyAmount.trim()) nextErrors.policyAmount = "Policy Amount is required";
    if (!data.assuredAmount.trim()) nextErrors.assuredAmount = "Assured Amount is required";
    if (!data.premiumAmount.trim()) nextErrors.premiumAmount = "Premium Amount is required";
    if (!data.securityValue.trim()) nextErrors.securityValue = "Security Value is required";
    if (!data.startDate.trim()) nextErrors.startDate = "Start Date is required";
    if (!data.endDate.trim()) nextErrors.endDate = "End Date is required";
    if (!data.particular.trim()) nextErrors.particular = "Particular is required";
    if (!data.premiumPeriod.trim()) nextErrors.premiumPeriod = "Premium Period is required";
    return nextErrors;
  };

  const validate = (): boolean => {
    const nextErrorsList = sections.map(validateOne);
    setErrorsList(nextErrorsList);
    return nextErrorsList.every((e) => Object.keys(e).length === 0);
  };

  const handleValidate = () => setIsValidated(validate());

  const handleSave = () => {
    if (!isValidated) return;
    const isValid = validate();
    if (!isValid) return;
    onSave?.(sections);
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose?.();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title="Insurance Details Added Successfully"
        subtitle=""
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
      />
    );
  }

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  return (
    <FormModal
      onClose={() => onClose?.()}
      titleEn="Add Insurance Details"
      titleHi="विमा तपशील जोडा"
      subtitleEn="All Information's are related to Interest Payment Mark"
      subtitleHi="सर्व माहिती व्याज भरण्याच्या मार्काशी संबंधित आहे"
      tabs={[...AddInsuranceDetailsModal_TABS]}
      activeTab="Primary Information"
      onTabChange={() => {}}
      onValidate={handleValidate}
      onSave={handleSave}
      isLastTab
    >
      {sections.map((data, index) => {
        const errors = errorsList[index] ?? {};
        const title = AddInsuranceDetailsModal_sectionTitle(index);
        const subtitle = AddInsuranceDetailsModal_sectionSubtitle(index);
        const isLast = index === sections.length - 1;

        return (
          <div
            key={index}
            className={`bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900 ${
              index > 0 ? "mt-5" : ""
            }`}
          >
            {/* Section header — icon + title/subtitle on the left, actions on the right */}
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
                  <UserRound size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1F2858] dark:text-slate-100">
                    {title.en} <span className="font-normal text-slate-500 dark:text-slate-400">/ {title.hi}</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {subtitle.en} / {subtitle.hi}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(index)}
                    title="Remove this section"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                {isLast && (
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary-700"
                  >
                    <Plus size={15} /> Add
                  </button>
                )}
              </div>
            </div>

            <div className={grid4}>
              <FieldShell label="Security Type Code" required error={!!errors.securityTypeCode}>
                <SelectInput
                  icon={<Tag size={16} />}
                  value={data.securityTypeCode}
                  onChange={(v) => setField(index, { securityTypeCode: v })}
                  options={AddInsuranceDetailsModal_SECURITY_TYPE_CODES}
                  error={!!errors.securityTypeCode}
                />
              </FieldShell>

              <FieldShell label="Insurance Name" required error={!!errors.insuranceName}>
                <TextInput
                  icon={<ShieldCheck size={16} />}
                  value={data.insuranceName}
                  onChange={(v) => setField(index, { insuranceName: v })}
                  placeholder="Insurance Name"
                  error={!!errors.insuranceName}
                />
              </FieldShell>

              <FieldShell label="Policy No" required error={!!errors.policyNo}>
                <TextInput
                  icon={<Hash size={16} />}
                  value={data.policyNo}
                  onChange={(v) => setField(index, { policyNo: v })}
                  placeholder="Policy No"
                  error={!!errors.policyNo}
                />
              </FieldShell>
            </div>

            <div className={`${grid4} mt-4`}>
              <FieldShell label="Policy Amount" required error={!!errors.policyAmount}>
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={data.policyAmount}
                  onChange={(v) => setField(index, { policyAmount: v })}
                  placeholder="Enter Amount"
                  error={!!errors.policyAmount}
                />
              </FieldShell>

              <FieldShell label="Assured Amount" required error={!!errors.assuredAmount}>
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={data.assuredAmount}
                  onChange={(v) => setField(index, { assuredAmount: v })}
                  placeholder="Enter Amount"
                  error={!!errors.assuredAmount}
                />
              </FieldShell>

              <FieldShell label="Premium Amount" required error={!!errors.premiumAmount}>
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={data.premiumAmount}
                  onChange={(v) => setField(index, { premiumAmount: v })}
                  placeholder="Enter Amount"
                  error={!!errors.premiumAmount}
                />
              </FieldShell>

              <FieldShell label="Security Value" required error={!!errors.securityValue}>
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={data.securityValue}
                  onChange={(v) => setField(index, { securityValue: v })}
                  placeholder="Enter Amount"
                  error={!!errors.securityValue}
                />
              </FieldShell>
            </div>

            <div className={`${grid4} mt-4`}>
              <FieldShell label="Start Date" required error={!!errors.startDate}>
                <DateInput
                  value={data.startDate}
                  onChange={(v) => setField(index, { startDate: v })}
                  error={!!errors.startDate}
                />
              </FieldShell>

              <FieldShell label="End Date" required error={!!errors.endDate}>
                <DateInput
                  value={data.endDate}
                  onChange={(v) => setField(index, { endDate: v })}
                  error={!!errors.endDate}
                />
              </FieldShell>

              <FieldShell label="Particular" required error={!!errors.particular}>
                <TextInput
                  icon={<FileText size={16} />}
                  value={data.particular}
                  onChange={(v) => setField(index, { particular: v })}
                  placeholder="Enter Particular"
                  error={!!errors.particular}
                />
              </FieldShell>

              <FieldShell label="Premium Period" required error={!!errors.premiumPeriod}>
                <SelectInput
                  icon={<Clock size={16} />}
                  value={data.premiumPeriod}
                  onChange={(v) => setField(index, { premiumPeriod: v })}
                  options={AddInsuranceDetailsModal_PREMIUM_PERIODS}
                  error={!!errors.premiumPeriod}
                />
              </FieldShell>
            </div>
          </div>
        );
      })}
    </FormModal>
  );
};


/* ===== from AccountMasterPage.tsx ===== */
export type AccountMasterPage_AccountMasterType = "ca-sa" | "deposit" | "loan" | "investment" | "fixed-asset" | "pigmy";

type AccountMasterPage_AccountMasterPageProps = {
  accountType: AccountMasterPage_AccountMasterType;
};

/** Maps an account-type id ("ca-sa") to its i18n key segment ("caSa"). */
function AccountMasterPage_toI18nId(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export const AccountMasterPage = ({ accountType }: AccountMasterPage_AccountMasterPageProps) => {
  const { en, t, tRaw } = useBilingual();
  const titleKey = `accountMaster.options.${AccountMasterPage_toI18nId(accountType)}.title`;
  const titleEn = en(titleKey);
  const titleHi = t(titleKey);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<"view" | "edit" | null>(null);
  const [selectedAccountRow, setSelectedAccountRow] = useState<RowData | null>(null);
  const [freezeRow, setFreezeRow] = useState<RowData | null>(null);
  const [operativeRow, setOperativeRow] = useState<RowData | null>(null);
  const [chequeBookIssueRow, setChequeBookIssueRow] = useState<RowData | null>(null);
  const [standingInstructionRow, setStandingInstructionRow] = useState<RowData | null>(null);
  const [memoRow, setMemoRow] = useState<RowData | null>(null);
  const [leanRow, setLeanRow] = useState<RowData | null>(null);
  const [pigmyOpenDetailsRow, setPigmyOpenDetailsRow] = useState<RowData | null>(null);
  const [insuranceDetailsRow, setInsuranceDetailsRow] = useState<RowData | null>(null);

  const handleView = (row: RowData) => {
    setSelectedAccountRow(row);
    setViewMode("view");
  };

  const handleEdit = (row: RowData) => {
    setSelectedAccountRow(row);
    setViewMode("edit");
  };

  const toAccountDetails = (row: RowData): AccountDetails => ({
    accountCode: row.accountId,
    accountName: row.accountName,
    accountOpenDate: row.openingDate,
    customerId: row.customerId,
    customerName: row.accountName,
    createdBy: row.createdBy,
    applicationNumber: row.applicationNo,
    categoryCode: row.accountType,
    accountStatus: row.status,
  });

  const handleFreezeSubmit = (payload: AccountFreezeModal_AccountFreezeSubmitPayload) => {
    window.alert(`Account ${freezeRow?.accountId ?? "-"} marked as ${payload.status}.`);
    setFreezeRow(null);
  };

  const handleOperativeSubmit = () => {
    setOperativeRow(null);
  };

  const getMenuItems = (row: RowData) =>
    AccountTypeMenuConfig_getMenuItemsForAccountType(accountType, row, tRaw, {
      onView: handleView,
      onEdit: handleEdit,
      onFreeze: (r) => setFreezeRow(r),
      onOperative: (r) => setOperativeRow(r),
      onChequeBookIssue: (r) => setChequeBookIssueRow(r),
      onStandingInstruction: (r) => setStandingInstructionRow(r),
      onMemo: (r) => setMemoRow(r),
      onLienMark: (r) => setLeanRow(r),
      onPigmyOpenDetails: (r) => setPigmyOpenDetailsRow(r),
      onAddInsuranceDetails: (r) => setInsuranceDetailsRow(r),
    });

  return (
    <div className="min-h-screen app-page-bg relative">
      <NavbarAM
        titleEn={titleEn}
        titleHi={titleHi}
        breadcrumbs={[
          { label: en("common.home"), href: "/dashboard" },
          { label: en("sidebar.clerk"), href: "#" },
          { label: en("application.breadcrumb"), href: "/account-master" },
          { label: titleEn, href: `/account-master/${accountType}` },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
      />

      <div className="px-3 py-2">
        <AccountMasterTable renderMenuItems={getMenuItems} />
      </div>

      {openAddModal && accountType === "investment" && (
        <AddInvestmentAccountMaster onClose={() => setOpenAddModal(false)} />
      )}

      {openAddModal && accountType === "loan" && (
        <AddTermLoanMaster onClose={() => setOpenAddModal(false)} />
      )}

      {openAddModal && accountType === "fixed-asset" && (
        <FixedAssetPage onClose={() => setOpenAddModal(false)} />
      )}

      {openAddModal && (accountType === "ca-sa" || accountType === "deposit") && (
        <AddAccountMaster onClose={() => setOpenAddModal(false)} />
      )}

      {viewMode && selectedAccountRow && (
        <ViewAccountModal
          mode={viewMode}
          data={toAccountDetails(selectedAccountRow)}
          onClose={() => setViewMode(null)}
        />
      )}

      {freezeRow && (
        <AccountFreezeModal
          data={{ accountCode: freezeRow.accountId, name: freezeRow.accountName }}
          onClose={() => setFreezeRow(null)}
          onSubmit={handleFreezeSubmit}
        />
      )}

      {operativeRow && (
        <AccountOperativeModal
          data={{
            accountCode: operativeRow.accountId,
            name: operativeRow.accountName,
            currentStatus: operativeRow.status === "Inoperative" ? "Inoperative" : "Operative",
          }}
          onClose={() => setOperativeRow(null)}
          onSubmit={handleOperativeSubmit}
        />
      )}

      {chequeBookIssueRow && <ChequeBookIssue onClose={() => setChequeBookIssueRow(null)} />}

      {standingInstructionRow && (
        <AddSI
          onClose={() => setStandingInstructionRow(null)}
          debitAccountCode={standingInstructionRow.accountId}
          debitName={standingInstructionRow.accountName}
        />
      )}

      {memoRow && (
        <MemoModal
          onClose={() => setMemoRow(null)}
        />
      )}

      {/* Fixed LeanPage rendering */}
      {leanRow && (
        <LeanPage
          onClose={() => setLeanRow(null)}
          accountCode={leanRow.accountId}
          accountName={leanRow.accountName}
          // You can pass additional props if available in your RowData
          // ledgerBalance={leanRow.ledgerBalance}
          // availableBalance={leanRow.availableBalance}
        />
      )}

      {pigmyOpenDetailsRow && (
        <AddPigmyDepositModal open onClose={() => setPigmyOpenDetailsRow(null)} />
      )}

      {insuranceDetailsRow && (
        <AddInsuranceDetailsModal open onClose={() => setInsuranceDetailsRow(null)} />
      )}
    </div>
  );
};


/* ===== from AccountMasterLandingPage.tsx ===== */
const AccountMasterLandingPage = () => {
  const { en, t, tRaw } = useBilingual();
  const router = useRouter();

  const accountMasterTypes: TransactionTypeItem[] = accountMasterOptions.map((option) => {
    const key = `accountMaster.options.${AccountMasterPage_toI18nId(option.id)}`;
    return {
      id: option.id,
      titleEn: en(`${key}.title`),
      titleHi: t(`${key}.title`),
      descriptionEn: tRaw(`${key}.description`),
      icon: option.icon,
      iconBg: option.iconBg,
      href: option.href,
    };
  });

  const handleOpen = (item: TransactionTypeItem) => {
    if (item.href) {
      router.push(item.href);
    } else {
      toast.info(`${item.titleEn} will be implemented.`);
    }
  };

  return (
    <div className="min-h-screen app-page-bg">
      <NavbarCM
        titleEn={en("application.title")}
        titleHi={t("application.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/dashboard" },
          { label: en("sidebar.clerk"), href: "#" },
          { label: en("application.breadcrumb"), href: "/account-master" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        {accountMasterTypes.map((item) => (
          <TransactionTypeCard key={item.id} item={item} onOpen={handleOpen} />
        ))}
      </div>
    </div>
  );
};

export default AccountMasterLandingPage;
