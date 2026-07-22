import { ArrowLeft, Home, ChevronRight, Filter, Plus, Search, RefreshCw, type LucideIcon } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

// Known abbreviations kept for pages already relying on this exact wording
// (e.g. "ID" rather than the generic "Customer Id").
const KNOWN_FILTER_LABELS: Record<string, string> = {
  customerId: "ID",
  customerName: "Name",
  status: "Status",
};

const toFilterLabel = (key: string) =>
  KNOWN_FILTER_LABELS[key] ??
  key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

type NavbarCMProps = {
  titleEn: string;
  titleHi?: string;
  breadcrumbs?: BreadcrumbItem[];
  onBack?: () => void;
  onAdd?: () => void;
  /** Text shown on the "Add" pill button. Defaults to "Add". */
  addLabel?: string;
  /** Icon shown on the "Add" pill button. Defaults to Plus. */
  addIcon?: LucideIcon;
  isSearchVisible?: boolean;
  filters?: Record<string, string>;
  onToggleSearch?: () => void;
  onOpenFilter?: () => void;
  onResetFilters?: () => void;
  hideActions?: boolean;
};

type BreadcrumbProps = {
  label: string;
  isLast: boolean;
  isFirst: boolean;
  href?: string;
};

const NavbarCM = ({
  titleEn,
  titleHi,
  breadcrumbs = [],
  onBack,
  onAdd,
  addLabel = "Add",
  addIcon: AddIcon = Plus,
  isSearchVisible = false,
  filters,
  onToggleSearch,
  onOpenFilter,
  onResetFilters,
  hideActions = false,
}: NavbarCMProps) => {
  const Breadcrumb = ({ label, isLast, isFirst, href }: BreadcrumbProps) => (
    <div className="flex items-center gap-1">
      {!isFirst && <ChevronRight size={14} className="text-gray-400 dark:text-slate-400" />}
      <a
        href={href || "#"}
        className={`flex items-center gap-1 text-sm ${
          isLast ? "text-primary font-[400]" : "text-[#99A1AF] hover:text-primary dark:text-slate-400"
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

  const activeFilterEntries = filters
    ? Object.entries(filters).filter(([, value]) => Boolean(value))
    : [];
  const hasActiveFilters = activeFilterEntries.length > 0;

  const activeFilterSummary = (() => {
    if (activeFilterEntries.length === 0) return "";
    const [firstKey, firstValue] = activeFilterEntries[0];
    const othersCount = activeFilterEntries.length - 1;
    const label = `${toFilterLabel(firstKey)}:${firstValue}`;
    return othersCount > 0 ? `${label} +${othersCount} more` : label;
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

          {!hideActions && (
          <div className="flex items-center gap-3">
            {isSearchVisible && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenFilter}
                  className="flex w-[200px] items-center gap-2.5 rounded-lg border border-primary bg-white px-3 py-2 text-left hover:bg-[#F8FBFF] sm:w-[240px] h-10 transition shrink-0"
                >
                  <Search size={16} className="shrink-0 text-primary" />
                  <span className="text-sm text-gray-400 dark:text-slate-400">Search/ Filter</span>
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
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-primary hover:bg-gray-50 h-10 transition shrink-0 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
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
              className="relative flex h-10 w-10 items-center justify-center rounded-md border-2 border-primary bg-primary-50 text-primary transition hover:bg-primary-100"
            >
              <Filter size={24} />
              {hasActiveFilters && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-primary-50" />
              )}
            </button>

            {/* Add */}
            {onAdd && (
              <button
                onClick={onAdd}
                className="flex h-10 min-w-25 overflow-hidden rounded-md border-2 border-primary bg-primary shadow-sm transition-all hover:bg-primary-700"
              >
                {/* Left Arrow Section */}
                <div
                  className="flex w-[50px] shrink-0 items-center justify-center bg-white"
                  style={{
                    clipPath: "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)",
                  }}
                >
                  <AddIcon size={22} strokeWidth={2.8} className="text-primary" />
                </div>

                {/* Text */}
                <div className="flex flex-1 items-center justify-center px-3">
                  <span className="text-md whitespace-nowrap font-medium text-white">{addLabel}</span>
                </div>
              </button>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarCM;