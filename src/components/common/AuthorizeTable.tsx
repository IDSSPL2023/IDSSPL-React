import { Filter, RefreshCw } from "lucide-react";
import GlobalTable, { type GlobalTableProps } from "./GlobalTable";
import type { TableTabDef } from "./table.types";

export interface AuthorizeTableProps<T> extends GlobalTableProps<T> {
  tabs: TableTabDef[];
  activeTab: string;
  onTabChange: (key: string) => void;
  onOpenFilter?: () => void;
  hasActiveFilters?: boolean;
  activeFilterSummary?: string;
  onResetFilters?: () => void;
}

/**
 * `GlobalTable` + the authorization tab row / filter-trigger UX (folded in from
 * `AuthorizationTabs.tsx`). Reference: Account Minimum Balance Master (8).png.
 * The filter button always opens `FilterModal` directly on a single click.
 */
export default function AuthorizeTable<T>({
  tabs,
  activeTab,
  onTabChange,
  onOpenFilter,
  hasActiveFilters = false,
  activeFilterSummary = "",
  onResetFilters,
  ...tableProps
}: AuthorizeTableProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                      isActive ? "bg-white text-primary" : "bg-primary-50 text-primary"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {hasActiveFilters && (
            <>
              <button
                type="button"
                onClick={onResetFilters}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-[#0a56aa]"
                aria-label="Reset filters"
              >
                <RefreshCw size={18} />
              </button>

              <button
                type="button"
                onClick={onOpenFilter}
                className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-primary transition hover:bg-gray-50"
              >
                <Filter size={16} className="text-primary" />
                <span>{activeFilterSummary}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onOpenFilter}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary bg-primary-50 text-primary transition hover:bg-primary-100"
            aria-label="Filter"
          >
            <Filter size={22} strokeWidth={2} />
          </button>
        </div>
      </div>

      <GlobalTable {...tableProps} />
    </div>
  );
}
