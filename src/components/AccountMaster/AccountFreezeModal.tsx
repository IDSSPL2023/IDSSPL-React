import { useState } from "react";
import Image from "@/components/ui/Image";
import {
  X,
  IdCard,
  User,
  Calendar,
  Coins,
  FileText,
  ChevronDown,
  Check,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FREEZE_TYPE_OPTIONS = ["All", "Partial", "Withdrawal"];

export interface AccountFreezeData {
  accountCode?: string;
  name?: string;
}

export interface AccountFreezeSubmitPayload {
  status: "Freeze" | "Unfreeze";
  freezeType: string;
  freezeDate: string;
  freezeAmount: string;
  reason: string;
}

interface AccountFreezeModalProps {
  onClose: () => void;
  onSubmit?: (payload: AccountFreezeSubmitPayload) => void;
  data?: AccountFreezeData;
}

function ReadOnlyField({
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

function Checkbox({
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

export default function AccountFreezeModal({ onClose, onSubmit, data }: AccountFreezeModalProps) {
  const [status, setStatus] = useState<"Freeze" | "Unfreeze">("Freeze");
  const [freezeType, setFreezeType] = useState(FREEZE_TYPE_OPTIONS[0]);
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
              <Image src="/person1.png" alt="" fill sizes="48px" className="object-contain" />
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
              <ReadOnlyField icon={IdCard} labelEn="Account Code" labelMr="खात्याचा कोड" value={data?.accountCode} />
              <ReadOnlyField icon={User} labelEn="Name" labelMr="नाव" value={data?.name} />
            </div>

            <div>
              <span className="mb-2 block text-[14px] font-medium text-[#1F2937] dark:text-slate-100">
                Status<span className="ml-0.5 text-rose-500">*</span>
              </span>
              <div className="flex items-center gap-8">
                <Checkbox label="Freeze" checked={status === "Freeze"} onClick={() => setStatus("Freeze")} />
                <Checkbox label="Unfreeze" checked={status === "Unfreeze"} onClick={() => setStatus("Unfreeze")} />
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
                    {FREEZE_TYPE_OPTIONS.map((opt) => (
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
