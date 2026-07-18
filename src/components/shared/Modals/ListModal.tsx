import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

export interface ListModalItem {
  id: string;
  code: string;
  name: string;
}

export interface ListModalProps {
  title: string;
  codeLabel?: string;
  nameLabel?: string;
  rows: ListModalItem[];
  onSelect: (row: ListModalItem) => void;
  onClose: () => void;
}

function ListModal({
  title,
  codeLabel = "Code",
  nameLabel = "Name",
  rows,
  onSelect,
  onClose,
}: ListModalProps) {
  const [searchText, setSearchText] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return rows;
    const q = searchText.trim().toLowerCase();
    return rows.filter(
      (row) =>
        row.code.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q),
    );
  }, [rows, searchText]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[85vh] w-[95vw] max-w-180 flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        {/* Decorative corner circles — clipped to the card */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary-100" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-100" />

        {/* Header — title, single search box, close circle */}
        <div className="relative z-10 flex items-center justify-between gap-4 px-6 pt-6 pb-5">
          <h2 className="shrink-0 text-lg font-bold text-slate-800">{title}</h2>
          <div className="relative w-full max-w-65 ml-auto">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Table */}
        <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto px-6 pb-6">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-primary-100 text-slate-700">
                <th className="rounded-l-lg px-4 py-3 font-semibold">
                  {codeLabel}
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  {nameLabel}
                </th>
                <th className="rounded-r-lg px-4 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {row.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(row)}
                      className="rounded-md bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary-100"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListModal;
