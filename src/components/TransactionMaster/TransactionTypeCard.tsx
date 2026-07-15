import Image from "@/components/ui/Image";
import { ChevronRight } from "lucide-react";
import type { TransactionTypeItem } from "./transactionTypes";

export interface TransactionTypeCardProps {
  item: TransactionTypeItem;
  onOpen: (item: TransactionTypeItem) => void;
}

/**
 * Accent (left border + icon-circle hover shade), keyed by the same `iconBg`
 * value already carried on each item. Written as literal class strings (not
 * templated) so Tailwind's content scanner picks them all up.
 */
const ACCENT_BY_ICON_BG: Record<string, { border: string; iconHover: string }> = {
  "bg-primary-500": { border: "border-primary-500 hover:border-primary-600", iconHover: "group-hover:bg-primary-600" },
  "bg-blue-500": { border: "border-blue-500 hover:border-blue-600", iconHover: "group-hover:bg-blue-600" },
  "bg-emerald-500": { border: "border-emerald-500 hover:border-emerald-600", iconHover: "group-hover:bg-emerald-600" },
  "bg-amber-500": { border: "border-amber-500 hover:border-amber-600", iconHover: "group-hover:bg-amber-600" },
  "bg-purple-500": { border: "border-purple-500 hover:border-purple-600", iconHover: "group-hover:bg-purple-600" },
  "bg-rose-500": { border: "border-rose-500 hover:border-rose-600", iconHover: "group-hover:bg-rose-600" },
};

const TransactionTypeCard = ({ item, onOpen }: TransactionTypeCardProps) => {
  const Icon = typeof item.icon === "string" ? null : item.icon;
  const accent = (item.iconBg && ACCENT_BY_ICON_BG[item.iconBg]) || null;

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-[20px] border-x border-b border-l-5 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center">
        {Icon ? (
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-200 ${
              item.iconBg ?? "bg-primary-500"
            } ${accent ? accent.iconHover : ""}`}
          >
            <Icon size={26} className="text-white" />
          </div>
        ) : (
          <Image src={item.icon as string} alt="" width={56} height={56} className="h-14 w-14 object-contain" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-[#1F2858] dark:text-slate-100">
          {item.titleEn} <span className="text-slate-600 dark:text-slate-400">/ {item.titleHi}</span>
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary">
            New
          </span>
          <span className="truncate text-sm text-slate-500 dark:text-slate-400">{item.descriptionEn}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(item)}
        className="flex shrink-0 items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-100"
      >
        Open <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default TransactionTypeCard;
