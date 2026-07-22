import { useState } from "react";
import { FileText, X as XIcon } from "lucide-react";
import BaseModal from "./BaseModal";

export interface InputRejectModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
  titleEn?: string;
  titleHi?: string;
  placeholder?: string;
}

/**
 * Target 667x496, 24px radius. Required textarea reason field; Submit is
 * disabled until the reason has non-whitespace content.
 */
export default function InputRejectModal({
  onClose,
  onSubmit,
  titleEn = "User Authorize Rejected",
  titleHi = "युझर खात्याची स्थिती",
  placeholder = "Reason for Rejecting",
}: InputRejectModalProps) {
  const [reason, setReason] = useState("");
  const isValid = reason.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(reason.trim());
  };

  return (
    <BaseModal
      onClose={onClose}
      size="md"
      ariaLabel={titleEn}
      contentClassName="rounded-[24px] min-h-[496px]"
      bodyClassName="px-8 py-8"
      showCloseButton={false}
      footer={
        <div className="flex items-center justify-end gap-3 px-8 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-6 py-2.5 text-sm font-medium text-primary transition hover:bg-slate-50"
          >
            Cancel
            <XIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit
            <FileText className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="relative">
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#DCEBFC]" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E5484D] shadow-[0_6px_14px_rgba(229,72,77,0.35)]">
              <XIcon size={22} strokeWidth={3} color="white" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1E1B4B]">
              {titleEn}
              {titleHi && (
                <>
                  <span className="text-slate-400"> / </span>
                  <span className="text-[16px] font-semibold text-[#64748B]">{titleHi}</span>
                </>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <XIcon className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="relative z-10 mt-6">
          <label className="mb-1.5 block text-[14px] font-medium text-[#1F2937]">
            Reason for Rejecting<span className="ml-0.5 text-rose-500">*</span>
          </label>
          <div className="flex items-start gap-2 rounded-lg border border-primary px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/10">
            <FileText size={16} className="mt-0.5 shrink-0 text-slate-400" />
            <textarea
              autoFocus
              rows={8}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={placeholder}
              className="w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
