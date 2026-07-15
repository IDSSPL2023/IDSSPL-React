import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

export interface Customer {
  id: string;
  name: string;
}

const CUSTOMERS: Customer[] = [
  { id: "0001", name: "Santaram" },
  { id: "0002", name: "Appana M Telagi" },
  { id: "0003", name: "Priya Om Singh" },
  { id: "0004", name: "John Harry Doe" },
  { id: "0005", name: "Sara Smith Connor" },
  { id: "0006", name: "Mike Smith Jones" },
  { id: "0007", name: "Linda David Brown" },
  { id: "0008", name: "James Smith Brown" },
  { id: "0009", name: "Karen Williams Brown" },
  { id: "0010", name: "David Johnson Brown" },
];

export interface CustomerIdPickerModalProps {
  open: boolean;
  onClose?: () => void;
  onSelect?: (customer: Customer) => void;
  customers?: Customer[];
}

export default function CustomerIdPickerModal({
  open,
  onClose,
  onSelect,
  customers = CUSTOMERS,
}: CustomerIdPickerModalProps) {
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [query, customers]);

  if (!open) return null;

  const handleSelect = (customer: Customer) => {
    onSelect?.(customer);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full sm:h-auto sm:max-w-[732px] sm:max-h-[90vh] p-4 sm:p-6 bg-white rounded-2xl sm:rounded-[36px] shadow-[0px_1px_5px_0px_rgba(3,0,55,0.08)] flex flex-col overflow-hidden dark:bg-slate-900"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Decorative blurred blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-sky-100 rounded-full blur-2xl dark:bg-slate-800" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 bg-sky-100 rounded-full blur-2xl dark:bg-slate-800" />

        <div className="relative flex flex-col min-h-0 flex-1">
          {/* Header (fixed, does not scroll) */}
          <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 sm:px-4 py-3 sm:py-4 rounded-[20px]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight dark:text-slate-100">
              Customer ID List
            </h2>
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex-1 sm:w-72 flex items-center gap-2 px-2.5 py-2 bg-slate-50 rounded-xl border border-slate-200 shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)] dark:bg-slate-800 dark:border-slate-700">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 min-w-0 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-gray-900 flex items-center justify-center hover:bg-gray-50 transition-colors dark:border-slate-100 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-900 dark:text-slate-100" />
              </button>
            </div>
          </div>

          {/* Table header (fixed, does not scroll) */}
          <div className="shrink-0 px-4 sm:px-10 py-3 bg-primary-200/60 rounded-xl flex items-center gap-3 mt-1">
            <div className="w-24 sm:w-32 shrink-0 text-black text-sm sm:text-base font-medium tracking-tight dark:text-slate-100">
              Customer ID
            </div>
            <div className="flex-1 text-black text-sm sm:text-base font-medium tracking-tight dark:text-slate-100">
              Customer Name
            </div>
            <div className="w-20 sm:w-32 shrink-0 text-black text-sm sm:text-base font-medium tracking-tight text-right sm:text-left dark:text-slate-100">
              Actions
            </div>
          </div>

          {/* Scrollable list. Scrollbar hidden across browsers. */}
          <div
            className="flex-1 min-h-0 overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filtered.length === 0 ? (
              <div className="px-4 sm:px-10 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
                No customers found.
              </div>
            ) : (
              filtered.map((customer, idx) => (
                <div
                  key={`${customer.id}-${idx}`}
                  className="px-4 sm:px-10 py-3 border-b border-gray-200 flex items-center gap-3 dark:border-slate-800"
                >
                  <div className="w-24 sm:w-32 shrink-0">
                    <span className="inline-flex px-3.5 py-2 bg-slate-100 rounded-sm text-slate-900 text-sm sm:text-base font-medium tracking-tight dark:bg-slate-800 dark:text-slate-100">
                      {customer.id}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-slate-900 text-sm sm:text-base font-medium tracking-tight truncate dark:text-slate-100">
                    {customer.name}
                  </div>
                  <div className="w-20 sm:w-28 shrink-0 flex justify-end sm:justify-start">
                    <button
                      type="button"
                      onClick={() => handleSelect(customer)}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-indigo-50 rounded-lg text-sky-700 text-xs sm:text-sm font-bold tracking-tight hover:bg-indigo-100 transition-colors dark:bg-indigo-900/30 dark:text-sky-400 dark:hover:bg-indigo-900/50"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Example usage — wire this up to the "..." button next to the Customer Id field:

import { useState } from "react";
import CustomerIdPickerModal, { Customer } from "./CustomerIdPickerModal";

function Parent() {
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string>("");

  return (
    <>
      <button onClick={() => setPickerOpen(true)}>Pick Customer</button>

      <CustomerIdPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(customer: Customer) => setCustomerId(customer.id)}
      />
    </>
  );
}
*/