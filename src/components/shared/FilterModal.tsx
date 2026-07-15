import { useState } from "react";
import type { ChangeEvent } from "react";
import { X, Filter as FilterIcon, User, ShieldCheck, Hash } from "lucide-react";

const filterOptions = [
  {
    id: "accountName",
    label: "Account Name",
    icon: (
      <span className="flex h-5 w-5 items-center justify-center rounded border border-primary text-[10px] font-bold text-primary">
        A
      </span>
    ),
    placeholder: "Account Name",
    inputIcon: (
      <span className="flex h-5 w-5 items-center justify-center rounded border border-primary text-[10px] font-bold text-primary">
        A
      </span>
    ),
  },
  {
    id: "accountNumber",
    label: "Account Number",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Account Number",
    inputIcon: <Hash size={18} className="text-primary" />,
  },
  {
    id: "accountType",
    label: "Account Type",
    icon: <ShieldCheck size={18} className="text-primary" />,
    placeholder: "Account Type",
    inputIcon: <ShieldCheck size={18} className="text-primary" />,
  },
] as const;

type FilterKey = (typeof filterOptions)[number]["id"];

export type AccountFilters = Record<FilterKey, string>;

type FilterModalProps = {
  onClose: () => void;
  onApply: (filters: AccountFilters) => void;
  initialValues?: AccountFilters;
};

const defaultValues: AccountFilters = {
  accountName: "",
  accountNumber: "",
  accountType: "",
};

export default function FilterModal({
  onClose,
  onApply,
  initialValues = defaultValues,
}: FilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("accountName");
  const [values, setValues] = useState<AccountFilters>(initialValues);

  const active = filterOptions.find((f) => f.id === activeFilter);

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
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-primary bg-white p-8">
      <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[#DCEBFC]" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#DCEBFC]" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-8 top-8 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100"
      >
        <X size={18} />
      </button>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary">
          <FilterIcon size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Filter</h2>
          <p className="text-gray-400">Use filter for fast and efficient searching</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 border-b border-gray-200" />

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
                      ? "border-primary bg-[#E8F1FD]"
                      : "border-primary bg-white"
                  }`}
                >
                  {option.icon}
                  <span className="text-lg font-medium text-gray-900">
                    {option.label}
                  </span>
                </button>

                {isActive && (
                  <div className="absolute -right-9 flex h-10 w-10 items-center justify-center">
                    <div className="h-0 w-0 border-y-[18px] border-l-[24px] border-y-transparent border-l-[#DCEBFC]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ml-10 w-[800px] rounded-2xl bg-[#DCEBFC] p-6 h-[220px] flex flex-col justify-center">
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            {active?.label}
          </h3>
          {activeFilter === "accountType" ? (
            <div className="flex items-center gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={values.accountType === "Saving Deposit"}
                  onChange={() =>
                    setValues({
                      ...values,
                      accountType: values.accountType === "Saving Deposit" ? "" : "Saving Deposit",
                    })
                  }
                />
                <span className="ml-2 text-gray-900">Saving Deposit</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={values.accountType === "Term Deposit"}
                  onChange={() =>
                    setValues({
                      ...values,
                      accountType: values.accountType === "Term Deposit" ? "" : "Term Deposit",
                    })
                  }
                />
                <span className="ml-2 text-gray-900">Term Deposit</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={values.accountType === "Term Loan"}
                  onChange={() =>
                    setValues({
                      ...values,
                      accountType: values.accountType === "Term Loan" ? "" : "Term Loan",
                    })
                  }
                />
                <span className="ml-2 text-gray-900">Term Loan</span>
              </label>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-4 py-3">
              {active?.inputIcon}
              <input
                type="text"
                value={values[activeFilter]}
                onChange={handleChange}
                placeholder={active?.placeholder}
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
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
          Clear Alls
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
