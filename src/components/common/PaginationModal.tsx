import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationModalProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPageItems = (page: number, totalPages: number): (number | "ellipsis")[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items: (number | "ellipsis")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("ellipsis");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push("ellipsis");

  items.push(totalPages);
  return items;
};

/**
 * Table pagination bar (relocated from `shared/Pagination.tsx`; named `PaginationModal`
 * per the common-UI folder spec even though it renders inline, not as a dialog).
 */
const PaginationModal = ({ page, totalPages, onPageChange }: PaginationModalProps) => {
  const [goToPage, setGoToPage] = useState("");
  if (totalPages <= 0) return null;
  const items = getPageItems(page, totalPages);

  const handleGo = () => {
    const target = Number(goToPage);
    if (Number.isInteger(target) && target >= 1 && target <= totalPages) {
      onPageChange(target);
      setGoToPage("");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-100 px-4 py-3 dark:border-slate-800">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <ChevronLeft size={15} />
        Back
      </button>

      {items.map((item, idx) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-8 w-8 items-center justify-center text-sm text-gray-500 dark:text-slate-500"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium ${
              page === item
                ? "bg-primary text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Next
        <ChevronRight size={15} />
      </button>

      <div className="ml-2 flex items-center gap-1.5">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGo()}
          placeholder="Page"
          className="h-8 w-16 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-700 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        />
        <button
          type="button"
          onClick={handleGo}
          className="flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-white transition hover:bg-primary-700"
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default PaginationModal;
