import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import BaseModal from "./BaseModal";
import PaginationModal from "./PaginationModal";
import type { PaginationState } from "./table.types";

export interface PicklistColumn<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T) => ReactNode;
}

export interface PicklistModalProps<T> {
  title: string;
  onClose: () => void;
  onSelect: (row: T) => void;
  columns: PicklistColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationState;
}

/**
 * Generic typed pick-list dialog. Target: 841x952, 36px radius, 24px padding;
 * header 793x78/20px radius (title+search+close); table header 793x46; rows
 * 64px with `border-bottom: 1px solid #EBEBEB`. Triggered from form fields via
 * a three-vertical-dot button (see `form/PicklistField.tsx`).
 */
export default function PicklistModal<T>({
  title,
  onClose,
  onSelect,
  columns,
  rows,
  rowKey,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search",
  loading = false,
  emptyMessage = "No records found",
  pagination,
}: PicklistModalProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const isControlled = searchValue !== undefined;
  const search = isControlled ? searchValue! : internalSearch;
  const setSearch = isControlled ? onSearchChange! : setInternalSearch;

  const filteredRows = useMemo(() => {
    if (isControlled || !search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => {
        const raw = col.render ? undefined : (row as Record<string, unknown>)[col.key];
        return raw !== undefined && String(raw).toLowerCase().includes(q);
      })
    );
  }, [rows, search, columns, isControlled]);

  return (
    <BaseModal
      onClose={onClose}
      maxWidthPx={841}
      ariaLabel={title}
      contentClassName="rounded-[36px] p-6 min-h-[600px] max-h-[952px]"
      bodyClassName="flex flex-1 flex-col overflow-hidden"
      showCloseButton={false}
    >
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#DCEBFC] opacity-70 blur-[1px]" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#DCEBFC] opacity-70 blur-[1px]" />

        <div className="relative z-10 flex h-[78px] shrink-0 items-center justify-between gap-4 rounded-[20px] px-2">
          <h2 className="shrink-0 text-2xl font-semibold text-gray-900">{title}</h2>
          <div className="flex w-full max-w-[280px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
            <Search size={18} className="shrink-0 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-400 text-gray-600 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative z-10 mt-4 flex flex-1 flex-col overflow-hidden rounded-2xl">
          <div className="flex h-[46px] shrink-0 items-center rounded-t-xl bg-[#DCEBFC]">
            {columns.map((col) => (
              <div
                key={col.key}
                className="truncate px-4 text-sm font-semibold text-gray-700"
                style={{ width: col.width, flex: col.width ? undefined : 1 }}
              >
                {col.header}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex h-[64px] items-center justify-center text-sm text-gray-400">Loading…</div>
            ) : filteredRows.length === 0 ? (
              <div className="flex h-[64px] items-center justify-center text-sm text-gray-400">{emptyMessage}</div>
            ) : (
              filteredRows.map((row) => (
                <div
                  key={rowKey(row)}
                  className="flex h-[64px] items-center border-b border-[#EBEBEB] px-0 last:border-b-0"
                >
                  {columns.map((col) => (
                    <div key={col.key} className="truncate px-4 text-sm text-gray-800" style={{ width: col.width, flex: col.width ? undefined : 1 }}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </div>
                  ))}
                  <div className="shrink-0 px-4">
                    <button
                      type="button"
                      onClick={() => onSelect(row)}
                      className="rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary-100"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {pagination && (
          <div className="relative z-10 shrink-0">
            <PaginationModal page={pagination.page} totalPages={pagination.totalPages} onPageChange={pagination.onPageChange} />
          </div>
        )}
      </div>
    </BaseModal>
  );
}
