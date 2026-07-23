import { ArrowLeft, Home, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  titleEn: string;
  titleHi?: string;
  breadcrumbs?: BreadcrumbItem[];
  onBack?: () => void;
}

/**
 * The `Home > MIS Activity > current page` breadcrumb + title block, extracted
 * from `GlobalMaster/GlobalNav.tsx` so it can be reused standalone (e.g. inside
 * `WelcomeScreen`/`SubMenuScreen`) or composed into `AppNavbar`.
 */
export default function PageHeader({ titleEn, titleHi, breadcrumbs = [], onBack }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-700"
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
          {breadcrumbs.map((crumb, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === breadcrumbs.length - 1;
            const content = (
              <>
                {isFirst && <Home size={14} />}
                {crumb.label}
              </>
            );
            return (
              <div key={idx} className="flex items-center gap-1">
                {!isFirst && <ChevronRight size={14} className="text-gray-400 dark:text-slate-500" />}
                {crumb.onClick ? (
                  <button
                    type="button"
                    onClick={crumb.onClick}
                    className={`flex items-center gap-1 text-sm ${isLast ? "text-primary" : "text-[#99A1AF] hover:text-primary dark:text-slate-500"}`}
                  >
                    {content}
                  </button>
                ) : (
                  <a
                    href={crumb.href || "#"}
                    className={`flex items-center gap-1 text-sm ${isLast ? "text-primary" : "text-[#99A1AF] hover:text-primary dark:text-slate-500"}`}
                  >
                    {content}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
