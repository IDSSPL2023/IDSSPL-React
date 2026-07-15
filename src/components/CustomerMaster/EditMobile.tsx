import { useState } from "react";
import { Smartphone, X, UserCircle2, IdCard, Phone, Upload } from "lucide-react";

interface EditMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mobile: string) => void;
  customerId: string;
  customerName: string;
  currentMobile: string;
}

export default function EditMobileModal({
  isOpen,
  onClose,
  onSubmit,
  customerId,
  customerName,
  currentMobile,
}: EditMobileModalProps) {
  const [mobile, setMobile] = useState(currentMobile);

  if (!isOpen) return null;

  const handleMobileChange = (value: string) => {
    // digits only, max 10
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setMobile(digitsOnly);
  };

  const handleSubmit = () => {
    onSubmit(mobile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-primary-100/70" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-primary-100/70" />

        <div className="relative px-8 py-8 sm:px-10 sm:py-10">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary-50">
                <Smartphone className="h-6 w-6 fill-primary text-white" strokeWidth={2} />
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl">
                <span className="text-slate-900 dark:text-slate-100">Mobile Number</span>{" "}
                <span className="text-slate-400 dark:text-slate-400">/ मोबाइल क्रमांक</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Read-only info fields */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
                Customer ID <span className="text-slate-400 font-medium dark:text-slate-400">/ ग्राहकाचे आयडी</span>
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
                <UserCircle2 className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="truncate text-slate-500 dark:text-slate-400">{customerId}</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
                Customer Name <span className="text-slate-400 font-medium dark:text-slate-400">/ ग्राहकाचे नाव</span>
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
                <IdCard className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="truncate text-slate-500 dark:text-slate-400">{customerName}</span>
              </div>
            </div>
          </div>

          {/* Editable mobile field */}
          <div className="mb-10">
            <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
              Edit Mobile Number <span className="text-slate-500 font-medium dark:text-slate-400">/ मोबाईल नंबर एडिट करा</span>
              <span className="text-red-500"> *</span>
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-primary px-4 py-3 focus-within:ring-2 focus-within:ring-primary-100">
              <Phone className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
              <input
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => handleMobileChange(e.target.value)}
                className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder-slate-500"
                placeholder="Enter mobile number"
                maxLength={10}
              />
            </div>
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
              onClick={handleSubmit}
              disabled={mobile.length !== 10}
              className="flex w-40 items-center justify-center gap-2 rounded-xl bg-primary-700 py-3 font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
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