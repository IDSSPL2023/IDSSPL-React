import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "@/components/ui/Link";

export interface SubMenuItem {
  key: string;
  icon: ReactNode;
  titleEn: string;
  titleHi?: string;
  badge?: string;
  description?: string;
  count?: number;
  href?: string;
  onOpen?: () => void;
}

export interface SubMenuScreenProps {
  items: SubMenuItem[];
  className?: string;
}

/**
 * Reproduces the `/authorization` 2-column submenu card grid: icon bubble,
 * bilingual title, badge + description chip, count, arrow. Page supplies the
 * `items` config; ported from `Authorization/AuthorizationCards.tsx`.
 */
export default function SubMenuScreen({ items, className = "" }: SubMenuScreenProps) {
  return (
    <div className={`grid grid-cols-1 gap-3 p-4 sm:gap-4 md:grid-cols-2 md:gap-5 ${className}`}>
      {items.map((item) => (
        <SubMenuCard key={item.key} item={item} />
      ))}
    </div>
  );
}

function SubMenuCard({ item }: { item: SubMenuItem }) {
  const cardBody = (
    <div className="flex flex-col gap-2 rounded-2xl border border-l-5 border-primary bg-white p-2 transition-all duration-200 hover:border-[#1565D8] hover:shadow-md dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:border-l-6">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden sm:h-16 sm:w-16 md:h-20 md:w-20">
          {item.icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-[clamp(13px,3.4vw,16px)] font-bold leading-[1.35] text-black dark:text-slate-100">
            {item.titleEn}{" "}
            {item.titleHi && <span className="font-semibold text-[#64748B] dark:text-slate-400">/ {item.titleHi}</span>}
          </h3>

          {(item.badge || item.description) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-full border border-[#BEDBFF] bg-[#EEF6FF] py-0.5 pl-0.5 pr-2 dark:border-blue-900/40 dark:bg-blue-900/20">
              {item.badge && (
                <span className="shrink-0 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[clamp(9px,2vw,11px)] font-medium text-[#018D0A] dark:bg-green-900/30 dark:text-green-400">
                  {item.badge}
                </span>
              )}
              {item.description && (
                <span className="text-[clamp(10px,2.2vw,12px)] leading-[1.4] text-[#1C398E] dark:text-blue-300">
                  {item.description}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 self-stretch rounded-lg px-1 py-1 sm:justify-end sm:gap-4 md:gap-5">
        {typeof item.count === "number" && (
          <span className="text-[clamp(17px,3.8vw,24px)] font-semibold text-[#1565D8] dark:text-blue-400">{item.count}</span>
        )}
        <ArrowUpRight size={20} strokeWidth={2.5} className="shrink-0 text-[#111827] dark:text-slate-300" />
      </div>
    </div>
  );

  if (item.onOpen) {
    return (
      <button type="button" onClick={item.onOpen} className="block text-left no-underline">
        {cardBody}
      </button>
    );
  }

  return (
    <Link href={item.href || "#"} className="block no-underline">
      {cardBody}
    </Link>
  );
}
