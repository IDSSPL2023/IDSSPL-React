import { useState } from "react";
import type { ChangeEvent } from "react";
import { X, Filter as FilterIcon, Hash, IndianRupee } from "lucide-react";

const filterOptions = [
  {
    id: "employeeId",
    label: "Emp No.",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Emp No.",
  },
  {
    id: "employeeName",
    label: "Emp. Name",
    icon: (
      <span className="flex h-5 w-5 items-center justify-center rounded border border-primary text-[10px] font-bold text-primary">
        A
      </span>
    ),
    placeholder: "Emp. Name",
  },
  {
    id: "basicSalary",
    label: "Basic Salary",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "Basic Salary",
  },
  {
    id: "other",
    label: "Other",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "Other",
  },
  {
    id: "travelAll",
    label: "Travel All",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "Travel All",
  },
  {
    id: "diff",
    label: "Diff",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "Diff",
  },
  {
    id: "totalAll",
    label: "Total All",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "Total All",
  },
  {
    id: "loan",
    label: "Loan",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "Loan",
  },
  {
    id: "payAvd",
    label: "Pay AVD",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "Pay AVD",
  },
  {
    id: "shares",
    label: "Shares",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "Shares",
  },
  {
    id: "kkfFund",
    label: "KKF Fund",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "KKF Fund",
  },
] as const;

type FilterKey = (typeof filterOptions)[number]["id"];

export type SalaryUpdationFilters = Record<FilterKey, string>;

export const defaultValues: SalaryUpdationFilters = {
  employeeId: "",
  employeeName: "",
  basicSalary: "",
  other: "",
  travelAll: "",
  diff: "",
  totalAll: "",
  loan: "",
  payAvd: "",
  shares: "",
  kkfFund: "",
};

const NUMERIC_FIELDS: FilterKey[] = [
  "basicSalary",
  "other",
  "travelAll",
  "diff",
  "totalAll",
  "loan",
  "payAvd",
  "shares",
  "kkfFund",
];

type SalaryUpdationFilterModalProps = {
  onClose: () => void;
  onApply: (filters: SalaryUpdationFilters) => void;
  initialValues?: SalaryUpdationFilters;
};

export default function SalaryUpdationFilterModal({
  onClose,
  onApply,
  initialValues = defaultValues,
}: SalaryUpdationFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("employeeId");
  const [values, setValues] = useState<SalaryUpdationFilters>(initialValues);

  const active = filterOptions.find((f) => f.id === activeFilter);
  const isNumericField = NUMERIC_FIELDS.includes(activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(defaultValues);
    onApply(defaultValues);
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
        className="absolute right-8 top-8 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <X size={18} />
      </button>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary">
          <FilterIcon size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Filter</h2>
          <p className="text-gray-400 dark:text-slate-400">Use filter for fast and efficient searching</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 border-b border-gray-200 dark:border-slate-800" />

      <div className="relative z-10 mt-8 flex items-start gap-0">
        <div className="flex max-h-[360px] w-full max-w-[470px] flex-col gap-3 overflow-y-auto no-scrollbar pr-1">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            const hasValue = Boolean(values[option.id]);
            return (
              <div key={option.id} className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveFilter(option.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-3.5 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-[#E8F1FD] dark:bg-primary-900/20"
                      : "border-primary bg-white dark:bg-slate-900"
                  }`}
                >
                  {option.icon}
                  <span className="text-base font-medium text-gray-900 dark:text-slate-100">
                    {option.label}
                  </span>
                  {hasValue && (
                    <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  )}
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

        <div className="ml-10 w-[800px] rounded-2xl bg-[#DCEBFC] dark:bg-slate-800 p-6 h-[220px] flex flex-col justify-center">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-slate-100">
            {active?.label}
          </h3>
          <div className="flex items-center gap-3 rounded-xl border border-primary bg-white dark:bg-slate-900 px-4 py-3">
            {active?.icon}
            <input
              type={isNumericField ? "number" : "text"}
              value={values[activeFilter]}
              onChange={handleChange}
              placeholder={active?.placeholder}
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
            />
            {values[activeFilter] && (
              <button
                type="button"
                onClick={() => setValues((prev) => ({ ...prev, [activeFilter]: "" }))}
                className="shrink-0 text-sm font-medium text-primary underline hover:text-[#0a56aa]"
              >
                Clear
              </button>
            )}
          </div>
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
