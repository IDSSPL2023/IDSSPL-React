import { useState } from "react";
import type { ChangeEvent } from "react";
import { X, Filter as FilterIcon, KeyRound, Hash, ShieldCheck, IdCard } from "lucide-react";

const filterOptions = [
  {
    id: "lockerType",
    label: "Locker Type",
    icon: <KeyRound size={18} className="text-primary" />,
    placeholder: "Locker Type",
    inputIcon: <KeyRound size={18} className="text-primary" />,
  },
  {
    id: "lockerNo",
    label: "Locker No",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Locker No",
    inputIcon: <Hash size={18} className="text-primary" />,
  },
  {
    id: "status",
    label: "Status",
    icon: <ShieldCheck size={18} className="text-primary" />,
    placeholder: "Status",
    inputIcon: <ShieldCheck size={18} className="text-primary" />,
  },
  {
    id: "customerId",
    label: "Customer ID",
    icon: <IdCard size={18} className="text-primary" />,
    placeholder: "Customer ID",
    inputIcon: <IdCard size={18} className="text-primary" />,
  },
] as const;

type FilterKey = (typeof filterOptions)[number]["id"];

export type LockerFilters = Record<FilterKey, string>;

type FilterModalProps = {
  onClose: () => void;
  onApply: (filters: LockerFilters) => void;
  initialValues?: LockerFilters;
};

export const defaultLockerFilterValues: LockerFilters = {
  lockerType: "",
  lockerNo: "",
  status: "",
  customerId: "",
};

export default function FilterModal({ onClose, onApply, initialValues = defaultLockerFilterValues }: FilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("lockerType");
  const [values, setValues] = useState<LockerFilters>(initialValues);

  const active = filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(defaultLockerFilterValues);
    onApply(defaultLockerFilterValues);
    onClose();
  };

  const handleApply = () => {
    onApply(values);
    onClose();
  };

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-primary bg-white p-8 dark:bg-slate-900">
      <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-8 top-8 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <X size={18} />
      </button>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary">
          <FilterIcon size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Filter</h2>
          <p className="text-gray-400 dark:text-slate-500">Use filter for fast and efficient searching</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 border-b border-gray-200 dark:border-slate-800" />

      <div className="relative z-10 mt-8 flex items-start gap-0">
        <div className="flex w-full max-w-[470px] flex-col gap-4">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <div key={option.id} className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveFilter(option.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-[#E8F1FD] dark:bg-slate-800"
                      : "border-primary bg-white dark:bg-slate-900"
                  }`}
                >
                  {option.icon}
                  <span className="text-lg font-medium text-gray-900 dark:text-slate-100">{option.label}</span>
                </button>

                {isActive && (
                  <div className="absolute -right-9 flex h-10 w-10 items-center justify-center">
                    <div className="h-0 w-0 border-y-[18px] border-l-[24px] border-y-transparent border-l-[#DCEBFC] dark:border-l-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ml-10 w-[800px] rounded-2xl bg-[#DCEBFC] p-6 h-[220px] flex flex-col justify-center dark:bg-slate-800">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-slate-100">{active?.label}</h3>
          {activeFilter === "status" ? (
            <div className="flex items-center gap-6">
              {(["Active", "Surrendered", "Pending"] as const).map((opt) => (
                <label key={opt} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
                    checked={values.status === opt}
                    onChange={() => setValues((prev) => ({ ...prev, status: opt }))}
                  />
                  <span className="ml-2 text-gray-900 dark:text-slate-100">{opt}</span>
                </label>
              ))}
              {values.status && (
                <button
                  type="button"
                  onClick={() => setValues((prev) => ({ ...prev, status: "" }))}
                  className="text-sm font-medium text-primary underline hover:text-[#0a56aa]"
                >
                  Clear
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-4 py-3 dark:bg-slate-900">
              {active?.inputIcon}
              <input
                type="text"
                value={values[activeFilter]}
                onChange={handleChange}
                placeholder={active?.placeholder}
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-10 flex justify-center gap-4">
        <button
          type="button"
          onClick={handleClearAll}
          className="rounded-full border border-primary px-8 py-3 font-semibold text-primary hover:bg-[#F2F8FE]"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="rounded-full bg-primary px-10 py-3 font-semibold text-white hover:bg-[#0a56aa]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
