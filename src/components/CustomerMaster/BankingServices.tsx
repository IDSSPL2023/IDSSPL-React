import { useState } from "react";
import { X, Upload } from "lucide-react";

interface BankingServicesState {
  debitCard: boolean;
  internetBanking: boolean;
  mobileBanking: boolean;
  upiServices: boolean;
}

interface BankingServicesProps {
  onClose: () => void;
  onSubmit?: (services: BankingServicesState) => void;
  customerId: string;
  customerName: string;
  initialServices?: BankingServicesState;
}

const defaultServices: BankingServicesState = {
  debitCard: false,
  internetBanking: true,
  mobileBanking: true,
  upiServices: false,
};

function MastercardIcon() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <span className="relative flex h-4 w-6 items-center justify-center">
        <span className="absolute left-0 h-4 w-4 rounded-full bg-red-500" />
        <span className="absolute right-0 h-4 w-4 rounded-full bg-orange-400 mix-blend-multiply" />
      </span>
    </span>
  );
}

function InternetBankingIcon() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#1e3a8a" strokeWidth="1.8">
        <path d="M4 10l8-5 8 5" />
        <rect x="5" y="10" width="14" height="8" />
        <line x1="3" y1="19" x2="21" y2="19" />
        <line x1="8" y1="12" x2="8" y2="16" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="16" y1="12" x2="16" y2="16" />
        <circle cx="18" cy="6" r="3.2" stroke="#2563eb" />
        <line x1="18" y1="3.2" x2="18" y2="8.8" stroke="#2563eb" />
        <line x1="15.5" y1="6" x2="20.5" y2="6" stroke="#2563eb" />
      </svg>
    </span>
  );
}

function MobileBankingIcon() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#1e3a8a" strokeWidth="1.8">
        <rect x="7" y="2.5" width="10" height="19" rx="1.5" />
        <line x1="7" y1="18" x2="17" y2="18" />
      </svg>
    </span>
  );
}

function UpiIcon() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path d="M14 3L6 13h5l-1 8 9-11h-6l1-7z" fill="#22c55e" stroke="#f97316" strokeWidth="0.5" />
      </svg>
    </span>
  );
}

const serviceOptions: {
  key: keyof BankingServicesState;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "debitCard", label: "Debit Card", icon: <MastercardIcon /> },
  { key: "internetBanking", label: "Internet Banking", icon: <InternetBankingIcon /> },
  { key: "mobileBanking", label: "Mobile Banking", icon: <MobileBankingIcon /> },
  { key: "upiServices", label: "UPI Services", icon: <UpiIcon /> },
];

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none ${
        checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function BankingServices({
  onClose,
  onSubmit,
  customerId,
  customerName,
  initialServices = defaultServices,
}: BankingServicesProps) {
  const [services, setServices] = useState<BankingServicesState>(initialServices);

  const toggleService = (key: keyof BankingServicesState) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    onSubmit?.(services);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />

        <div className="relative px-8 py-8 sm:px-10 sm:py-10">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 bg-primary-50">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#3b82f6" strokeWidth="1.6">
                  <path d="M3 21h13" />
                  <path d="M5 21v-7" />
                  <path d="M9 21v-7" />
                  <path d="M13 21v-7" />
                  <path d="M4 10l6-4 6 4" />
                  <circle cx="18" cy="6" r="3" />
                  <path d="M18 4.5v3" />
                  <path d="M16.5 6h3" />
                  <path d="M4 14h11" />
                </svg>
              </span>
              <div>
                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                  <span className="text-slate-900 dark:text-slate-100">Banking Services</span>{" "}
                  <span className="text-slate-500 dark:text-slate-400">/ बँकिंग सेवा</span>
                </h2>
                <p className=" text-sm text-slate-500 dark:text-slate-400 ">
                  Choose a banking service to proceed with the customer&apos;s
                  request. /  ग्राहकाच्या विनंतीवर पुढे जाण्यासाठी बँकिंग सेवा निवडा.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-400 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-5 border-t border-slate-200 dark:border-slate-800" />

          {/* Service toggle cards */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {serviceOptions.map((option) => {
              const isActive = services[option.key];
              return (
                <div
                  key={option.key}
                  className={`flex items-center justify-between rounded-md border px-4 py-2 transition-colors ${
                    isActive
                      ? "border-primary bg-[#EEF1FF] dark:bg-primary-900/20"
                      : "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <span className="text-lg text-slate-900 dark:text-slate-100">{option.label}</span>
                  </div>
                  <ToggleSwitch
                    checked={isActive}
                    onChange={() => toggleService(option.key)}
                  />
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-40 items-center justify-center gap-2 rounded-md border border-primary py-3 font-semibold text-primary transition hover:bg-primary-50"
            >
              Cancel
              <X className="h-4 w-4" strokeWidth={3} />
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex w-40 items-center justify-center gap-2 rounded-md bg-primary py-3 font-semibold text-white transition hover:bg-primary-800"
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