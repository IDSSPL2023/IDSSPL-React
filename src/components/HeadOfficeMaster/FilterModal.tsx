// @ts-nocheck
import { useState, useEffect } from "react";
import { X, Filter as FilterIcon } from "lucide-react";
import { getMasterConfig } from "./masterConfig";

const FilterModal = ({ masterKey, initialFilters = {}, onClose, onApply }) => {
  const config = getMasterConfig(masterKey);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const config = getMasterConfig(masterKey);
    const defaults = {};
    config.filterFields.forEach((f) => {
      defaults[f.key] = initialFilters[f.key] ?? "";
    });
    setFilters(defaults);
  }, [masterKey, initialFilters]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    const cleared = {};
    config.filterFields.forEach((f) => {
      cleared[f.key] = "";
    });
    setFilters(cleared);
    onApply(cleared);
    onClose();
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <FilterIcon size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Filter</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Apply filters to narrow down records</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {config.filterFields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-sm font-medium text-[#1F2858] dark:text-slate-100">
                {field.label}
              </label>
              <input
                type="text"
                value={filters[field.key] ?? ""}
                placeholder={`Search by ${field.label}`}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
