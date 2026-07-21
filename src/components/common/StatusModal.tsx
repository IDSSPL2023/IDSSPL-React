import { useState } from "react";
import type { ReactNode } from "react";
import { CircleCheck, ChevronDown, Upload, X } from "lucide-react";
import BaseModal from "./BaseModal";
import type { StatusTone } from "./table.types";

export interface StatusOption<S extends string = string> {
  value: S;
  label?: string;
  tone?: StatusTone;
}

export interface StatusModalProps<S extends string = string> {
  onClose: () => void;
  currentStatus: S;
  options?: StatusOption<S>[];
  onSubmit?: (status: S) => void;
  title?: string;
  titleHi?: string;
  headerIcon?: ReactNode;
}

const TONE_TEXT_CLASS: Record<StatusTone, string> = {
  success: "text-emerald-600",
  neutral: "text-slate-500",
  pending: "text-amber-600",
  rejected: "text-red-600",
  info: "text-primary-700",
};

/**
 * Displays a row's status in a standard dialog, optionally editable via a
 * dropdown + Submit when `options`/`onSubmit` are provided (replaces the
 * bespoke `UserMaster/StatusChangeModal.tsx` overlay).
 */
export default function StatusModal<S extends string = string>({
  onClose,
  currentStatus,
  options,
  onSubmit,
  title = "Status",
  titleHi,
  headerIcon,
}: StatusModalProps<S>) {
  const [value, setValue] = useState<S>(currentStatus);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const editable = Boolean(options && options.length > 0 && onSubmit);

  const toneFor = (status: S) => options?.find((o) => o.value === status)?.tone ?? "neutral";
  const labelFor = (status: S) => options?.find((o) => o.value === status)?.label ?? status;

  return (
    <BaseModal
      onClose={onClose}
      size="sm"
      title={
        <>
          {title}
          {titleHi && <span className="text-slate-400"> / {titleHi}</span>}
        </>
      }
      icon={headerIcon}
      contentClassName="rounded-[24px]"
      bodyClassName="px-8 py-6"
    >
      {editable ? (
        <>
          <div className="relative mb-6">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border-2 border-primary px-4 py-3"
            >
              <span className={`flex items-center gap-2 font-medium ${TONE_TEXT_CLASS[toneFor(value)]}`}>
                <CircleCheck className="h-5 w-5" />
                {labelFor(value)}
              </span>
              <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {options!.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setValue(opt.value);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${
                      value === opt.value ? "bg-primary-50" : ""
                    }`}
                  >
                    <CircleCheck className={`h-5 w-5 ${TONE_TEXT_CLASS[opt.tone ?? "neutral"]}`} />
                    <span className={`font-medium ${TONE_TEXT_CLASS[opt.tone ?? "neutral"]}`}>{opt.label ?? opt.value}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-40 items-center justify-center gap-2 rounded-xl border border-primary py-3 font-semibold text-primary transition hover:bg-primary-50"
            >
              Cancel
              <X className="h-4 w-4" strokeWidth={3} />
            </button>
            <button
              type="button"
              onClick={() => {
                onSubmit?.(value);
                onClose();
              }}
              className="flex w-40 items-center justify-center gap-2 rounded-xl bg-primary-700 py-3 font-semibold text-white transition hover:bg-primary-800"
            >
              Submit
              <Upload className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </>
      ) : (
        <div className={`flex items-center gap-2 text-lg font-medium ${TONE_TEXT_CLASS[toneFor(currentStatus)]}`}>
          <CircleCheck className="h-5 w-5" />
          {labelFor(currentStatus)}
        </div>
      )}
    </BaseModal>
  );
}
