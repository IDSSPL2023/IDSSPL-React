import { useState } from "react";
import { X, Upload, CreditCard, UserRound, FileText } from "lucide-react";
import AccountStatus from "../../../public/Account Status.png";
import SuccessModal from "../shared/SuccessModal";

export interface AccountOperativeData {
  accountCode: string;
  name: string;
  currentStatus?: "Operative" | "Inoperative";
}

export interface AccountOperativeSubmitPayload {
  status: "Operative" | "Inoperative";
  reason: string;
}

export interface AccountOperativeModalProps {
  data: AccountOperativeData;
  onClose: () => void;
  onSubmit: (payload: AccountOperativeSubmitPayload) => void;
}
export default function AccountOperativeModal({
  data,
  onClose,
  onSubmit,
}: AccountOperativeModalProps) {
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

const handleDone = () => {
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
              <img src={AccountStatus} alt="Account Status" className="h-14 w-14 shrink-0 object-contain" />
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
              <FieldWrap label="Account Code" labelHi="खात्याचा कोड" required>
                <ReadOnlyInput value={data.accountCode} icon={<CreditCard size={18} className="text-slate-400" />} />
              </FieldWrap>

              <FieldWrap label="Name" labelHi="नाव" required>
                <ReadOnlyInput value={data.name} icon={<UserRound size={18} className="text-slate-400" />} />
              </FieldWrap>
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
            <FieldWrap label="Reason for Change Status" required>
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
            </FieldWrap>
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
          onClose={handleDone}
          onDone={handleDone}
          title="Account Status Updated"
          subtitle={`The account status has been changed to ${status} successfully.`}
        />
      )}
    </>
  );
}

/* ── Shared subcomponents ──────────────────────────────────────── */

function FieldWrap({
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

function ReadOnlyInput({ value, icon }: { value: string; icon: React.ReactNode }) {
  return (
    <div className="flex h-12 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
      {icon}
      <span className="text-sm text-slate-500">{value}</span>
    </div>
  );
}