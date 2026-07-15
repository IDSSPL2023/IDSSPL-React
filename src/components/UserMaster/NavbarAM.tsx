import { ArrowLeft, Home, ChevronRight, Filter, Plus, Search, RefreshCw } from "lucide-react";
import { type UserFilters } from "./FilterModal";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type NavbarAMProps = {
  titleEn: string;
  titleHi?: string;
  breadcrumbs?: BreadcrumbItem[];
  onBack?: () => void;
  onAdd?: () => void;
  isSearchVisible?: boolean;
  filters?: UserFilters;
  onToggleSearch?: () => void;
  onOpenFilter?: () => void;
  onResetFilters?: () => void;
};

type BreadcrumbProps = {
  label: string;
  isLast: boolean;
  isFirst: boolean;
  href?: string;
};

const NavbarAM = ({
  titleEn,
  titleHi,
  breadcrumbs = [],
  onBack,
  onAdd,
  isSearchVisible = false,
  filters,
  onToggleSearch,
  onOpenFilter,
  onResetFilters,
}: NavbarAMProps) => {
  const Breadcrumb = ({ label, isLast, isFirst, href }: BreadcrumbProps) => (
    <div className="flex items-center gap-1">
      {!isFirst && <ChevronRight size={14} className="text-gray-400 dark:text-slate-500" />}
      <a
        href={href || "#"}
        className={`flex items-center gap-1 text-sm ${
          isLast ? "text-primary font-[400]" : "text-[#99A1AF] hover:text-primary dark:text-slate-500"
        }`}
      >
        {isFirst && <Home size={14} />}
        {label}
      </a>
    </div>
  );

  const handleFilterClick = () => {
    if (!isSearchVisible) {
      if (onToggleSearch) onToggleSearch();
    } else {
      if (onOpenFilter) onOpenFilter();
    }
  };

  const hasActiveFilters = Boolean(
    filters && (filters.userId || filters.role || filters.createdDate || filters.status)
  );

  // Build the active-filters summary once, safely, regardless of TS narrowing
  // across nested closures — avoids "possibly undefined" on filters.* below.
  const activeFilterSummary = (() => {
    if (!filters) return "";
    const active: { label: string; value: string }[] = [];
    if (filters.userId) active.push({ label: "ID", value: filters.userId });
    // if (filters.userName) active.push({ label: "Name", value: filters.userName });
    if (filters.role) active.push({ label: "Role", value: filters.role });
    if (filters.createdDate) active.push({ label: "Date", value: filters.createdDate });
    if (filters.status) active.push({ label: "Status", value: filters.status });

    if (active.length === 0) return "";
    const first = active[0];
    const othersCount = active.length - 1;
    if (othersCount > 0) {
      return `${first.label}:${first.value} +${othersCount} more`;
    }
    return `${first.label}:${first.value}`;
  })();

  return (
    <div className="w-full bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-700 shrink-0"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-[#1C398E] dark:text-slate-100">
                {titleEn}
                {titleHi ? (
                  <>
                    <span className="mx-2 font-normal">|</span>
                    <span className="">{titleHi}</span>
                  </>
                ) : null}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                {breadcrumbs.map((crumb, idx) => (
                  <Breadcrumb
                    key={idx}
                    label={crumb.label}
                    href={crumb.href}
                    isFirst={idx === 0}
                    isLast={idx === breadcrumbs.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSearchVisible && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenFilter}
                  className="flex w-[200px] items-center gap-2.5 rounded-lg border border-primary bg-white px-3 py-2 text-left hover:bg-[#F8FBFF] sm:w-[240px] h-10 transition shrink-0 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <Search size={16} className="shrink-0 text-primary" />
                  <span className="text-sm text-gray-400 dark:text-slate-500">Search/ Filter</span>
                </button>

                {hasActiveFilters && (
                  <>
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white hover:bg-[#0a56aa] transition shrink-0"
                    >
                      <RefreshCw size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={onOpenFilter}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-primary hover:bg-gray-50 h-10 transition shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                      <Filter size={16} className="text-primary" />
                      <span>{activeFilterSummary}</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Filter */}
            <button
              onClick={handleFilterClick}
              className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-primary bg-primary-50 text-primary transition hover:bg-primary-100"
            >
              <Filter size={24} />
            </button>

            {/* Add */}
            <button
              onClick={onAdd}
              className="flex h-10 w-[100px] overflow-hidden rounded-md border-2 border-primary bg-primary shadow-sm transition-all hover:bg-primary-700"
            >
              {/* Left Arrow Section */}
              <div
                className="flex w-[50px] shrink-0 items-center justify-center bg-white"
                style={{
                  clipPath: "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)",
                }}
              >
                <Plus size={22} strokeWidth={2.8} className="text-primary" />
              </div>

              {/* Text */}
              <div className="flex flex-1 items-center justify-center">
                <span className="text-md font-medium text-white">Add</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarAM;
