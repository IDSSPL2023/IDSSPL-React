import { useState } from "react";
import { CircleCheck, X, Upload, UserCircle2, ChevronDown } from "lucide-react";

export type UserStatusValue = "Active" | "Inactive";

const STATUS_OPTIONS: UserStatusValue[] = ["Active", "Inactive"];

export interface StatusChangeModalProps {
  open: boolean;
  currentStatus?: UserStatusValue;
  onClose?: () => void;
  onSubmit?: (status: UserStatusValue) => void;
}

export default function StatusChangeModal({
  open,
  currentStatus = "Active",
  onClose,
  onSubmit,
}: StatusChangeModalProps) {
  const [value, setValue] = useState<UserStatusValue>(currentStatus);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  // Reset the selection to the row's current status each time the modal opens,
  // using the render-time state adjustment pattern instead of an effect.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValue(currentStatus);
      setDropdownOpen(false);
    }
  }

  if (!open) return null;

  const toneClass = (status: UserStatusValue) => (status === "Active" ? "text-green-600" : "text-red-600");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-primary-100/70 blur-[1px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-primary-100/70 blur-[1px]" />

        <div className="relative px-8 py-8 sm:px-10 sm:py-10">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary-50">
                <UserCircle2 className="h-7 w-7 text-primary" strokeWidth={2} />
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl">
                <span className="text-slate-900">Status</span>{" "}
                <span className="text-slate-400">/ स्टेटस</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition hover:bg-slate-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Dropdown select */}
          <div className="relative mb-10">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border-2 border-primary px-4 py-3"
            >
              <span className={`flex items-center gap-2 font-medium ${toneClass(value)}`}>
                <CircleCheck className="h-5 w-5" />
                {value}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setValue(opt);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${
                      value === opt ? "bg-primary-50" : ""
                    }`}
                  >
                    <CircleCheck className={`h-5 w-5 ${toneClass(opt)}`} />
                    <span className={`font-medium ${toneClass(opt)}`}>{opt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
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
                onClose?.();
              }}
              className="flex w-40 items-center justify-center gap-2 rounded-xl bg-primary-700 py-3 font-semibold text-white transition hover:bg-primary-800"
            >
              Submit
              <Upload className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}