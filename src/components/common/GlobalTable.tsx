import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import TableActionMenu, { type TableActionMenuItem } from "./TableActionMenu";
import PaginationModal from "./PaginationModal";
import type { ColumnDef, PaginationState, SortDirection, TableAction } from "./table.types";

export interface GlobalTableProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string | number;
  actions?: TableAction<T>[];
  /** Full per-row override for the action menu items — takes precedence over `actions` when provided. */
  renderRowActions?: (row: T) => TableActionMenuItem[];
  actionsHeader?: string;
  actionsWidth?: string;
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSortChange?: (key: string) => void;
  loading?: boolean;
  /** Number of placeholder rows rendered while `loading` is true. */
  skeletonRows?: number;
  emptyMessage?: string;
  pagination?: PaginationState;
  minWidth?: string;
  className?: string;
  /** Renders a leading Sr No. column populated from the row index (1-based, page-aware). */
  showSrNo?: boolean;
  srNoHeader?: string;
}

const SkeletonBar = ({ widthClass = "w-full" }: { widthClass?: string }) => (
  <div className={`h-4 ${widthClass} animate-pulse rounded bg-slate-200 dark:bg-slate-700`} />
);

/**
 * Generic, typed data table: sortable columns, row actions via `TableActionMenu`,
 * loading/empty states, horizontal scroll, and an optional `PaginationModal` slot.
 * Styling ported from `AccountMasterTable.tsx` / `CashDepositAuthorizeTable.tsx`.
 */
export default function GlobalTable<T>({
  columns,
  rows,
  rowKey,
  actions,
  renderRowActions,
  actionsHeader = "Actions",
  actionsWidth = "90px",
  sortKey,
  sortDirection = "asc",
  onSortChange,
  loading = false,
  skeletonRows = 6,
  emptyMessage = "No records found",
  pagination,
  minWidth = "1000px",
  className = "",
  showSrNo = true,
  srNoHeader = "Sr No.",
}: GlobalTableProps<T>) {
  const hasActions = Boolean(renderRowActions || (actions && actions.length > 0));
  const totalColumns = columns.length + (hasActions ? 1 : 0) + (showSrNo ? 1 : 0);

  return (
    <div className={`w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900 ${className}`}>
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full table-fixed border-collapse" style={{ minWidth }}>
          <thead>
            <tr className="bg-primary">
              {showSrNo && (
                <th className="whitespace-nowrap px-6 py-3 text-left text-[16px] font-semibold text-white" style={{ width: "80px" }}>
                  {srNoHeader}
                </th>
              )}
              {hasActions && (
                <th className="whitespace-nowrap px-6 py-3 text-left text-[16px] font-semibold text-white" style={{ width: actionsWidth }}>
                  {actionsHeader}
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSortChange?.(col.key)}
                  className={`whitespace-nowrap px-6 py-3 text-left text-[16px] font-semibold text-white ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  } ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""} ${col.className ?? ""}`}
                  style={{ width: col.width }}
                >
                  <SortableHeaderLabel
                    label={col.header}
                    sortable={col.sortable}
                  />
                  {col.sortable && sortKey === col.key && (
                    <span className="ml-1 text-xs">{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: skeletonRows }, (_, rowIdx) => (
                <tr
                  key={`skeleton-${rowIdx}`}
                  className={rowIdx !== skeletonRows - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""}
                >
                  {showSrNo && (
                    <td className="px-6 py-3" style={{ width: "80px" }}>
                      <SkeletonBar widthClass="w-6" />
                    </td>
                  )}
                  {hasActions && (
                    <td className="px-6 py-3" style={{ width: actionsWidth }}>
                      <SkeletonBar widthClass="w-5" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-3" style={{ width: col.width }}>
                      <SkeletonBar widthClass="w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={totalColumns} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={rowKey(row, idx)}
                  className={`${idx !== rows.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} relative hover:bg-gray-50 dark:hover:bg-slate-800`}
                >
                  {showSrNo && (
                    <td className="px-6 py-3" style={{ width: "80px" }}>
                      <SrNoBadge value={idx + 1} />
                    </td>
                  )}
                  {hasActions && (
                    <td className="relative px-6 py-3" style={{ width: actionsWidth }}>
                      <TableActionMenu
                        items={
                          renderRowActions
                            ? renderRowActions(row)
                            : (actions ?? [])
                                .filter((a) => !a.hidden?.(row))
                                .map((a) => ({
                                  key: a.key,
                                  label: a.label,
                                  icon: a.icon,
                                  disabled: a.disabled?.(row),
                                  onClick: () => a.onClick(row),
                                }))
                        }
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400 ${
                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
                      } ${col.className ?? ""}`}
                      style={{ width: col.width }}
                    >
                      {col.render ? col.render(row, idx) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <PaginationModal page={pagination.page} totalPages={pagination.totalPages} onPageChange={pagination.onPageChange} />
      )}
    </div>
  );
}
