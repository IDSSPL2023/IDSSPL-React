import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

interface Column<T> {
  key: keyof T;
  label: string;
}

interface ListModalProps<T extends Record<string, any>> {
  title: string;
  columns: Column<T>[];
  rows: T[];
  onSelect: (row: T) => void;
  onClose: () => void;
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { tRaw } = useBilingual();
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={tRaw("common.search")}
        className="h-9 w-64 rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-primary-500 placeholder:text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
      />
    </div>
  );
}

function TableHeader<T>({ columns }: { columns: Column<T>[] }) {
  const { tRaw } = useBilingual();
  return (
    <thead className="sticky top-0 z-20">
      <tr className="bg-[#CFE3FF] dark:bg-blue-900/40">
        {columns.map((column, index) => (
          <th
            key={String(column.key)}
            className={`py-2.5 px-4 text-left text-xs font-semibold text-[#1B2143] dark:text-slate-100 ${
              index === 0 ? "rounded-l-xl" : ""
            }`}
          >
            {column.label}
          </th>
        ))}

        <th className="rounded-r-xl py-2.5 px-4 text-left text-xs font-semibold text-[#1B2143] dark:text-slate-100">
          {tRaw("common.actions")}
        </th>
      </tr>
    </thead>
  );
}

function TableRow<T extends Record<string, any>>({
  row,
  columns,
  onSelect,
}: {
  row: T;
  columns: Column<T>[];
  onSelect: (row: T) => void;
}) {
  const { tRaw } = useBilingual();
  return (
    <tr className="border-b border-[#ECECEC] hover:bg-[#F8FBFF] dark:border-slate-800 dark:hover:bg-slate-800">
      {columns.map((column, i) => (
        <td key={String(column.key)} className="px-4 py-2.5 text-xs text-[#1B2143] dark:text-slate-100">
          {i === 0 ? (
            <span className="inline-flex h-7 min-w-[56px] items-center justify-center rounded-lg bg-[#EEF3FF] dark:bg-blue-900/30 px-2 text-[11px] font-medium">
              {row[column.key]}
            </span>
          ) : (
            <span className="font-medium">{row[column.key]}</span>
          )}
        </td>
      ))}

      <td className="px-4 py-2.5">
        <button
          onClick={() => onSelect(row)}
          className="h-7 w-20 rounded-lg bg-[#EEF3FF] text-xs font-semibold text-[#0B67D9] dark:bg-blue-900/30 dark:text-blue-400 transition hover:bg-[#DDEAFF] dark:hover:bg-blue-900/50 active:scale-95"
        >
          {tRaw("common.select")}
        </button>
      </td>
    </tr>
  );
}

export default function ListModal<T extends Record<string, any>>({
  title,
  columns,
  rows,
  onSelect,
  onClose,
}: ListModalProps<T>) {
  const { tRaw } = useBilingual();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;

    const q = query.toLowerCase();

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(q)
      )
    );
  }, [rows, query]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="relative w-full max-w-xl h-[60vh] overflow-hidden rounded-[24px] bg-white shadow-2xl dark:bg-slate-900">

        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#DCEBFF] dark:bg-blue-900/20" />

        <div className="relative flex h-full flex-col px-6 py-5">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1B2143] dark:text-slate-100">{title}</h2>

            <div className="flex items-center gap-3">
              <SearchInput value={query} onChange={setQuery} />

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-500 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-slate-800 "
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto rounded-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <table className="w-full border-separate border-spacing-y-0">

              <TableHeader columns={columns} />

              <tbody>
                {filtered.map((row, index) => (
                  <TableRow
                    key={index}
                    row={row}
                    columns={columns}
                    onSelect={onSelect}
                  />
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="py-8 text-center text-xs text-gray-400 dark:text-slate-500"
                    >
                      {tRaw("common.noResultsFound")}
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    </div>
  );
}