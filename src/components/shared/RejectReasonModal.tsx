import { useState } from "react";
import { FileText, ThumbsDown, X } from "lucide-react";

export interface RejectReasonModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
  titleEn?: string;
  titleHi?: string;
}

export default function RejectReasonModal({
  onClose,
  onConfirm,
  titleEn = "Reason for Rejection",
  titleHi = "नाकारण्याचे कारण",
}: RejectReasonModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please enter a reason for rejection.");
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-[24px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between gap-4 px-7 pt-6 pb-4">
          <h2 className="text-[20px] font-bold text-[#1E1B4B]">
            {titleEn}
            {titleHi && (
              <>
                <span className="text-slate-400"> / </span>
                <span className="text-[16px] font-semibold text-[#64748B]">
                  {titleHi}
                </span>
              </>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-7 pb-6">
          <label className="mb-1.5 block text-[14px] font-medium text-[#1F2937]">
            Reason<span className="ml-0.5 text-rose-500">*</span>
          </label>
          <div
            className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 focus-within:ring-2 ${
              error
                ? "border-red-300 focus-within:ring-red-100"
                : "border-primary focus-within:ring-primary/10"
            }`}
          >
            <FileText size={16} className="mt-0.5 shrink-0 text-slate-400" />
            <textarea
              autoFocus
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter reason for rejecting this authorization"
              className="w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-7 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-5 py-2 text-sm font-medium text-primary transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Reject
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
