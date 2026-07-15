import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

export interface Bank {
  code: string;
  name: string;
}

const BANKS: Bank[] = [
  { code: "00022", name: "BANK NAME" },
  { code: "00031", name: "STATE BANK OF INDIA" },
  { code: "00045", name: "HDFC BANK" },
  { code: "00058", name: "ICICI BANK" },
  { code: "00067", name: "AXIS BANK" },
  { code: "00073", name: "BANK OF BARODA" },
  { code: "00089", name: "PUNJAB NATIONAL BANK" },
  { code: "00094", name: "CANARA BANK" },
];

export interface BankListPickerModalProps {
  open: boolean;
  onClose?: () => void;
  onSelect?: (bank: Bank) => void;
  banks?: Bank[];
}

export default function BankListPickerModal({
  open,
  onClose,
  onSelect,
  banks = BANKS,
}: BankListPickerModalProps) {
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return banks;
    return banks.filter(
      (b) => b.code.toLowerCase().includes(q) || b.name.toLowerCase().includes(q)
    );
  }, [query, banks]);

  if (!open) return null;

  const handleSelect = (bank: Bank) => {
    onSelect?.(bank);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full sm:h-auto sm:max-w-[732px] sm:max-h-[90vh] p-4 sm:p-6 bg-white rounded-2xl sm:rounded-[36px] shadow-[0px_1px_5px_0px_rgba(3,0,55,0.08)] flex flex-col overflow-hidden"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Decorative blurred blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-sky-100 rounded-full blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 bg-sky-100 rounded-full blur-2xl" />

        <div className="relative flex flex-col min-h-0 flex-1">
          {/* Header (fixed, does not scroll) */}
          <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 sm:px-4 py-3 sm:py-4 rounded-[20px]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
              Bank List
            </h2>
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex-1 sm:w-72 flex items-center gap-2 px-2.5 py-2 bg-slate-50 rounded-xl border border-slate-200 shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)]">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 min-w-0"
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-gray-900 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-900" />
              </button>
            </div>
          </div>

          {/* Table header (fixed, does not scroll) */}
          <div className="shrink-0 px-4 sm:px-10 py-3 bg-primary-200/60 rounded-xl flex items-center gap-3 mt-1">
            <div className="w-24 sm:w-32 shrink-0 text-black text-sm sm:text-base font-medium tracking-tight">
              Bank Code
            </div>
            <div className="flex-1 text-black text-sm sm:text-base font-medium tracking-tight">
              Bank Name
            </div>
            <div className="w-20 sm:w-32 shrink-0 text-black text-sm sm:text-base font-medium tracking-tight text-right sm:text-left">
              Actions
            </div>
          </div>

          {/* Scrollable list. Scrollbar hidden across browsers. */}
          <div
            className="flex-1 min-h-0 overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filtered.length === 0 ? (
              <div className="px-4 sm:px-10 py-10 text-center text-sm text-gray-400">
                No banks found.
              </div>
            ) : (
              filtered.map((bank, idx) => (
                <div
                  key={`${bank.code}-${idx}`}
                  className="px-4 sm:px-10 py-3 border-b border-gray-200 flex items-center gap-3"
                >
                  <div className="w-24 sm:w-32 shrink-0">
                    <span className="inline-flex px-3.5 py-2 bg-slate-100 rounded-sm text-slate-900 text-sm sm:text-base font-medium tracking-tight">
                      {bank.code}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-slate-900 text-sm sm:text-base font-medium tracking-tight truncate">
                    {bank.name}
                  </div>
                  <div className="w-20 sm:w-28 shrink-0 flex justify-end sm:justify-start">
                    <button
                      type="button"
                      onClick={() => handleSelect(bank)}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-indigo-50 rounded-lg text-sky-700 text-xs sm:text-sm font-bold tracking-tight hover:bg-indigo-100 transition-colors"
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
