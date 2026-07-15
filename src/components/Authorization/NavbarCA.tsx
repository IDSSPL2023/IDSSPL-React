import { ArrowLeft, Home, ChevronRight, Filter, Search, RefreshCw } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import { type AuthTab } from "./CustomerAuthorizationTable";
import { type UserFilters } from "../UserMaster/FilterModal";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = BreadcrumbItem & { isLast: boolean; isFirst: boolean };

const Breadcrumb = ({ label, isLast, isFirst, href }: BreadcrumbProps) => (
  <div className="flex items-center gap-1">
    {!isFirst && <ChevronRight size={14} className="text-gray-400" />}
    <a
      href={href || "#"}
      className={`flex items-center gap-1 text-sm ${
        isLast ? "text-primary font-[400]" : "text-[#99A1AF] hover:text-primary"
      }`}
    >
      {isFirst && <Home size={14} />}
      {label}
    </a>
  </div>
);

const TABS: AuthTab[] = ["new", "modify", "rejected"];

const TAB_LABEL_KEYS: Record<AuthTab, string> = {
  new: "authorization.customerAuthorization.tabs.newAuthorization",
  modify: "authorization.customerAuthorization.tabs.modifyAuthorization",
  rejected: "authorization.customerAuthorization.tabs.authorizeRejected",
};

type NavbarCAProps = {
  titleEn: string;
  titleHi?: string;
  breadcrumbs?: BreadcrumbItem[];
  onBack?: () => void;
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
  tabCounts: Record<AuthTab, number>;
  isSearchVisible?: boolean;
  filters?: UserFilters;
  onToggleSearch?: () => void;
  onOpenFilter?: () => void;
  onResetFilters?: () => void;
};

const NavbarCA = ({
  titleEn,
  titleHi,
  breadcrumbs = [],
  onBack,
  activeTab,
  onTabChange,
  tabCounts,
  isSearchVisible = false,
  filters,
  onToggleSearch,
  onOpenFilter,
  onResetFilters,
}: NavbarCAProps) => {
  const { tRaw } = useBilingual();

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
    <div className="w-full bg-white border-b border-gray-200">
      <div className="px-4 py-2">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-700 shrink-0"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-[#1C398E]">
              {titleEn}
              {titleHi ? (
                <>
                  <span className="mx-2 font-normal">|</span>
                  <span>{titleHi}</span>
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
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-primary text-white" : "text-gray-700 hover:text-primary"
                }`}
              >
                {tRaw(TAB_LABEL_KEYS[tab])}
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                    isActive ? "bg-white text-primary" : "bg-primary-50 text-primary"
                  }`}
                >
                  {tabCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {isSearchVisible && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenFilter}
                className="flex w-[200px] items-center gap-2.5 rounded-lg border border-primary bg-white px-3 py-2 text-left hover:bg-[#F8FBFF] sm:w-[240px] h-10 transition shrink-0"
              >
                <Search size={16} className="shrink-0 text-primary" />
                <span className="text-sm text-gray-400">Search/ Filter</span>
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
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-primary hover:bg-gray-50 h-10 transition shrink-0"
                  >
                    <Filter size={16} className="text-primary" />
                    <span>{activeFilterSummary}</span>
                  </button>
                </>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleFilterClick}
            className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-primary bg-primary-50 text-primary transition hover:bg-primary-100 shrink-0"
          >
            <Filter size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarCA;
