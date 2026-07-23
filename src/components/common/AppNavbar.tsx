import { Filter, Plus, Search, RefreshCw } from "lucide-react";
import PageHeader, { type BreadcrumbItem } from "./PageHeader";

export interface AppNavbarProps {
  titleEn: string;
  titleHi?: string;
  breadcrumbs?: BreadcrumbItem[];
  onBack?: () => void;
  onFilter?: () => void;
  onAdd?: () => void;
  showActions?: boolean;
  searchQuery?: string;
  onSearchChange?: (v: string) => void;
  onRefresh?: () => void;
  hasActiveFilters?: boolean;
  activeFilterSummary?: string;
  onResetFilters?: () => void;
}

/**
 * Standardized `Home > MIS Activity > current page` navbar: `PageHeader` +
 * the search/refresh/filter/add action row. The filter button always opens
 * `onFilter` directly on a single click; when `hasActiveFilters` is true, a
 * reset button + summary chip are shown alongside it.
 */
export default function AppNavbar({
  titleEn,
  titleHi,
  breadcrumbs = [],
  onBack,
  onFilter,
  onAdd,
  showActions = false,
  searchQuery = "",
  onSearchChange,
  onRefresh,
  hasActiveFilters = false,
  activeFilterSummary = "",
  onResetFilters,
}: AppNavbarProps) {
  return (
    <div className="w-full border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <PageHeader titleEn={titleEn} titleHi={titleHi} breadcrumbs={breadcrumbs} onBack={onBack} />

          {showActions && (
            <div className="flex shrink-0 items-center gap-2">
              {onSearchChange && (
                <div className="hidden w-48 items-center rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900 md:flex lg:w-56">
                  <Search size={16} className="mr-2 shrink-0 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder="Search/ Filter"
                    className="min-w-0 flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100"
                  />
                </div>
              )}

              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  title="Refresh"
                  className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-[#1565D8] bg-[#1565D8] text-white transition hover:bg-[#0E57C4]"
                >
                  <RefreshCw size={18} />
                </button>
              )}

              {hasActiveFilters && (
                <>
                  <button
                    type="button"
                    onClick={onResetFilters}
                    aria-label="Reset filters"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-white transition hover:bg-primary-700"
                  >
                    <RefreshCw size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={onFilter}
                    className="hidden items-center gap-1.5 rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-medium text-primary-700 dark:bg-primary-950/40 sm:flex"
                  >
                    <Filter size={14} />
                    {activeFilterSummary}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onFilter}
                className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-primary bg-primary-50 text-primary transition hover:bg-primary-100"
              >
                <Filter size={22} />
              </button>

              <button
                type="button"
                onClick={onAdd}
                className="flex h-10 w-[100px] overflow-hidden rounded-md border-2 border-primary bg-primary shadow-sm transition-all hover:bg-primary-700"
              >
                <div
                  className="flex w-[50px] shrink-0 items-center justify-center bg-white"
                  style={{ clipPath: "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)" }}
                >
                  <Plus size={22} strokeWidth={2.8} className="text-primary" />
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <span className="text-md font-medium text-white">Add</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
