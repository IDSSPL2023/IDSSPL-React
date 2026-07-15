import { ArrowLeft, Home, ChevronRight, Filter, Plus } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type NavProps = {
  titleEn: string;
  titleHi?: string;
  breadcrumbs?: BreadcrumbItem[];
  onBack?: () => void;
  onFilter?: () => void;
  onAdd?: () => void;
  showActions?: boolean;
};

type BreadcrumbProps = {
  label: string;
  isLast: boolean;
  isFirst: boolean;
  href?: string;
  onClick?: () => void;
};

const Nav = ({
  titleEn,
  titleHi,
  breadcrumbs = [],
  onBack,
  onFilter,
  onAdd,
  showActions = false,
}: NavProps) => {
  const Breadcrumb = ({ label, isLast, isFirst, href, onClick }: BreadcrumbProps) => {
    const content = (
      <>
        {isFirst && <Home size={14} />}
        {label}
      </>
    );

    return (
      <div className="flex items-center gap-1">
        {!isFirst && <ChevronRight size={14} className="text-gray-400 dark:text-slate-500" />}
        {onClick ? (
          <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-1 text-sm ${
              isLast ? "text-primary font-[400]" : "text-[#99A1AF] hover:text-primary dark:text-slate-500"
            }`}
          >
            {content}
          </button>
        ) : (
          <a
            href={href || "#"}
            className={`flex items-center gap-1 text-sm ${
              isLast ? "text-primary font-[400]" : "text-[#99A1AF] hover:text-primary dark:text-slate-500"
            }`}
          >
            {content}
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
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
                    onClick={crumb.onClick}
                    isFirst={idx === 0}
                    isLast={idx === breadcrumbs.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-3 shrink-0">
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
                  style={{
                    clipPath: "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)",
                  }}
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
};

export default Nav;
