import { ArrowLeft, Home, ChevronRight, Filter, Plus, Search, RefreshCw } from "lucide-react";
import { type AccountFilters } from "../shared/FilterModal";
import { useBilingual } from "@/i18n/useBilingual";

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
  filters?: AccountFilters;
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
  const { en } = useBilingual();

  const Breadcrumb = ({ label, isLast, isFirst, href }: BreadcrumbProps) => (
    <div className="flex items-center gap-1">
      {!isFirst && <ChevronRight size={14} className="text-gray-400" />}
      <a
        href={href || "#"}
        className={`flex items-center gap-1 text-sm ${
          isLast ? "text-primary font-[400]" : "text-[#99A1AF] dark:text-slate-500 hover:text-primary"
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

  const hasActiveFilters =
    filters && (filters.accountName || filters.accountNumber || filters.accountType);

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
              <h1 className="truncate text-lg font-semibold text-[#1C398E] dark:text-blue-300">
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
                  className="flex w-[200px] items-center gap-2.5 rounded-lg border border-primary bg-white dark:bg-slate-900 px-3 py-2 text-left hover:bg-[#F8FBFF] dark:hover:bg-slate-800 sm:w-[240px] h-10 transition shrink-0 animate-fade-in"
                >
                  <Search size={16} className="shrink-0 text-primary" />
                  <span className="text-sm text-gray-400 dark:text-slate-500">{en("common.searchOrFilter")}</span>
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
                      className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-slate-800 h-10 transition shrink-0"
                    >
                      <Filter size={16} className="text-primary" />
                      <span>
                        {(() => {
                          const active: { label: string; value: string }[] = [];
                          if (filters.accountNumber)
                            active.push({ label: en("accountMaster.filters.id"), value: filters.accountNumber });
                          if (filters.accountName)
                            active.push({ label: en("accountMaster.filters.name"), value: filters.accountName });
                          if (filters.accountType)
                            active.push({ label: en("accountMaster.filters.type"), value: filters.accountType });

                          if (active.length === 0) return "";
                          const first = active[0];
                          const othersCount = active.length - 1;
                          if (othersCount > 0) {
                            return `${first.label}:${first.value} +${othersCount} more`;
                          }
                          return `${first.label}:${first.value}`;
                        })()}
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Filter */}
            <button
              onClick={handleFilterClick}
              className="flex h-10 w-10 items-center justify-center rounded-[8px] border-[1px] border-primary bg-primary-50 text-primary transition hover:bg-primary-100"
            >
              <Filter size={22} strokeWidth={2} />
            </button>

            {/* Add */}
            <button
              onClick={onAdd}
              className="flex h-10 w-[96px] overflow-hidden rounded-[8px] border-[1px] border-primary bg-primary shadow-sm transition-all hover:bg-primary-700"
            >
              {/* Left Arrow Section */}
              <div
                className="flex w-[50px] shrink-0 items-center justify-center bg-white"
                style={{
                  clipPath: "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)",
                }}
              >
                <Plus size={22} strokeWidth={2.5} className="text-primary" />
              </div>

              {/* Text */}
              <div className="flex flex-1 items-center justify-center">
                <span className="text-md font-medium text-white">{en("common.add")}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarAM;