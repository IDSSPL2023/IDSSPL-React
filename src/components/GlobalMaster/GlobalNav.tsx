import { ArrowLeft, Home, ChevronRight, Filter, Plus, Search, RefreshCw } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type GlobalNavProps = {
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
  activeFilterCount?: number;
  filterSummary?: string;
};

const GlobalNav = ({
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
  activeFilterCount = 0,
  filterSummary,
}: GlobalNavProps) => {
  const Breadcrumb = ({ label, isLast, isFirst, href, onClick }: BreadcrumbItem & { isLast: boolean; isFirst: boolean }) => {
    const content = (<>{isFirst && <Home size={14} />}{label}</>);
    return (
      <div className="flex items-center gap-1">
        {!isFirst && <ChevronRight size={14} className="text-gray-400 dark:text-slate-500" />}
        {onClick ? (
          <button type="button" onClick={onClick} className={`flex items-center gap-1 text-sm ${isLast ? "text-primary" : "text-[#99A1AF] hover:text-primary dark:text-slate-500"}`}>{content}</button>
        ) : (
          <a href={href || "#"} className={`flex items-center gap-1 text-sm ${isLast ? "text-primary" : "text-[#99A1AF] hover:text-primary dark:text-slate-500"}`}>{content}</a>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={onBack} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-700">
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-[#1C398E] dark:text-slate-100">
                {titleEn}{titleHi ? (<><span className="mx-2 font-normal">|</span><span>{titleHi}</span></>) : null}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {breadcrumbs.map((crumb, idx) => (
                  <Breadcrumb key={idx} {...crumb} isFirst={idx === 0} isLast={idx === breadcrumbs.length - 1} />
                ))}
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 w-48 lg:w-56 dark:border-slate-700 dark:bg-slate-900">
                <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Search/ Filter"
                  className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 min-w-0 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <button type="button" onClick={onRefresh} className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-[#1565D8] bg-[#1565D8] text-white transition hover:bg-[#0E57C4]" title="Refresh">
                <RefreshCw size={18} />
              </button>

              {activeFilterCount > 0 && (
                <button type="button" onClick={onFilter} className="hidden sm:flex items-center gap-1.5 rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-medium text-primary-700 dark:bg-primary-950/40">
                  <Filter size={14} />
                  {filterSummary || `${activeFilterCount} filter(s)`}
                </button>
              )}

              <button type="button" onClick={onFilter} className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-primary bg-primary-50 text-primary transition hover:bg-primary-100">
                <Filter size={22} />
              </button>

              <button type="button" onClick={onAdd} className="flex h-10 w-[100px] overflow-hidden rounded-md border-2 border-primary bg-primary shadow-sm transition-all hover:bg-primary-700">
                <div className="flex w-[50px] shrink-0 items-center justify-center bg-white" style={{ clipPath: "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)" }}>
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
};

export default GlobalNav;
