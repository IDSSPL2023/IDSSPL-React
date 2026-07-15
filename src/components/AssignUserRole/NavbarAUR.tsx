import { ArrowLeft, Home, ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type NavbarAURProps = {
  titleEn: string;
  titleHi: string;
  breadcrumbs?: BreadcrumbItem[];
  onBack?: () => void;
};

type BreadcrumbProps = {
  label: string;
  isLast: boolean;
  isFirst: boolean;
  href?: string;
};

export default function NavbarAUR({
  titleEn,
  titleHi,
  breadcrumbs = [],
  onBack,
}: NavbarAURProps) {
  const Breadcrumb = ({ label, isLast, isFirst, href }: BreadcrumbProps) => (
    <div className="flex items-center gap-1">
      {!isFirst && <ChevronRight size={14} className="text-gray-400 dark:text-slate-500" />}
      <a
        href={href || "#"}
        className={`flex items-center gap-1 text-sm ${
          isLast ? "font-[400] text-primary" : "text-[#99A1AF] hover:text-primary dark:text-slate-500"
        }`}
      >
        {isFirst && <Home size={14} />}
        {label}
      </a>
    </div>
  );

  return (
    <div className="w-full border-b border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-700"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-[#1C398E] dark:text-slate-100">
                {titleEn}
                <span className="mx-2 font-normal">|</span>
                <span>{titleHi}</span>
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
      </div>
    </div>
  );
}
