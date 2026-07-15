import { Search, Filter } from "lucide-react";

type SearchFilterBarProps = {
  onOpenFilter: () => void;
  placeholder?: string;
};

export default function SearchFilterBar({
  onOpenFilter,
  placeholder = "Search/ Filter",
}: SearchFilterBarProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onOpenFilter}
        className="flex w-[220px] items-center gap-2.5 rounded-lg border border-primary bg-white px-3 py-2 transition hover:bg-[#F8FBFF] sm:w-[260px] dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        <Search size={16} className="shrink-0 text-primary" />
        <span className="text-sm text-gray-400 dark:text-slate-500">{placeholder}</span>
      </button>
      <button
        type="button"
        onClick={onOpenFilter}
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-primary bg-white text-primary transition hover:bg-[#F8FBFF] dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        <Filter size={18} />
      </button>
    </div>
  );
}
