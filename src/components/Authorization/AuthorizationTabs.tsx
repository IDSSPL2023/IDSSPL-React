import { Filter, RefreshCw, Search } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

export type AuthorizationTabKey = "new" | "modify" | "rejected";

export type AuthorizationTab = {
  key: AuthorizationTabKey;
  labelKey: string;
  count: number;
};

const DEFAULT_TABS: AuthorizationTab[] = [
  { key: "new", labelKey: "authorizeAccount.tabs.newAuthorization", count: 10 },
  {
    key: "modify",
    labelKey: "authorizeAccount.tabs.modifyAuthorization",
    count: 6,
  },
  {
    key: "rejected",
    labelKey: "authorizeAccount.tabs.authorizeRejected",
    count: 6,
  },
];

type AuthorizationTabsProps = {
  active: AuthorizationTabKey;
  onChange: (key: AuthorizationTabKey) => void;
  onOpenFilter?: () => void;
  tabs?: AuthorizationTab[];
  isSearchVisible?: boolean;
  onToggleSearch?: () => void;
  hasActiveFilters?: boolean;
  activeFilterSummary?: string;
  onResetFilters?: () => void;
};

const AuthorizationTabs = ({
  active,
  onChange,
  onOpenFilter,
  tabs = DEFAULT_TABS,
  isSearchVisible = false,
  onToggleSearch,
  hasActiveFilters = false,
  activeFilterSummary = "",
  onResetFilters,
}: AuthorizationTabsProps) => {
  const { tRaw } = useBilingual();

  const handleFilterClick = () => {
    if (!isSearchVisible) {
      if (onToggleSearch) onToggleSearch();
    } else if (onOpenFilter) {
      onOpenFilter();
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{tRaw(tab.labelKey)}</span>
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                  isActive
                    ? "bg-white text-primary"
                    : "bg-primary-50 text-primary"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isSearchVisible && (
          <>
            <button
              type="button"
              onClick={onOpenFilter}
              className="flex h-10 w-50 items-center gap-2.5 rounded-lg border border-primary bg-white px-3 py-2 text-left transition hover:bg-[#F8FBFF] sm:w-60"
            >
              <Search size={16} className="shrink-0 text-primary" />
              <span className="text-sm text-gray-400">Search/ Filter</span>
            </button>

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
          </>
        )}

        <button
          type="button"
          onClick={handleFilterClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary bg-primary-50 text-primary transition hover:bg-primary-100"
          aria-label="Filter"
        >
          <Filter size={22} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default AuthorizationTabs;
