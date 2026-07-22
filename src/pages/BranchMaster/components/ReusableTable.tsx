import React from "react";
import SrNoBadge from "@/components/shared/SrNoBadge";
import RowActionMenu, { RowActionMenuItem } from "@/components/shared/RowActionMenu";
import StatusPill, { StatusPillTone } from "@/components/shared/StatusPill";

export interface TableColumn<T> {
  key: keyof T | "action" | "srNo";
  label: string;
  sortable: boolean;
  width: string;
  emphasize?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface ReusableTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  sortKey: keyof T | null;
  sortAsc: boolean;
  onSort: (key: keyof T) => void;
  getMenuItems?: (row: T) => RowActionMenuItem[];
  getStatusTone?: (row: T) => StatusPillTone;
  statusKey?: keyof T;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

function ReusableTable<T extends Record<string, any>>({
  columns,
  data,
  sortKey,
  sortAsc,
  onSort,
  getMenuItems,
  getStatusTone,
  statusKey,
  emptyMessage = "No records found",
  onRowClick,
}: ReusableTableProps<T>) {
  const renderCell = (row: T, col: TableColumn<T>) => {
    // Handle Sr No.
    // if (col.key === "srNo") {
    //   return <SrNoBadge value={row.srNo} />;
    // }

    // Handle Action column
    // if (col.key === "action" && getMenuItems) {
    //   return <RowActionMenu items={getMenuItems(row)} />;
    // }

    // Handle Status column with custom rendering
    // if (col.key === statusKey && getStatusTone) {
    //   const value = row[col.key as keyof T];
    //   return (
    //     <StatusPill
    //       label={String(value)}
    //       tone={getStatusTone(row)}
    //     />
    //   );
    // }

    // Handle custom render function
    if (col.render) {
      return col.render(row);
    }

    // Default rendering
    const value = row[col.key as keyof T];
    return value != null ? String(value) : "";
  };

  const getCellClassName = (col: TableColumn<T>) => {
    const baseClass = "px-4 py-3 truncate";
    if (col.emphasize) {
      return `${baseClass} text-sm font-medium text-gray-900`;
    }
    if (col.key === "srNo" || col.key === "action") {
      return `${baseClass} text-sm text-gray-700`;
    }
    return `${baseClass} text-sm text-gray-700`;
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-[#0A1A3A] text-white text-xs font-semibold">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => {
                    if (col.sortable && col.key !== "action" && col.key !== "srNo") {
                      onSort(col.key as keyof T);
                    }
                  }}
                  className={`p-4 whitespace-nowrap text-left ${
                    col.sortable && col.key !== "action" && col.key !== "srNo"
                      ? "cursor-pointer select-none hover:bg-[#1a2a4a]"
                      : ""
                  }`}
                  style={{ width: col.width }}
                >
                  {col.label}
                  {col.sortable && col.key !== "action" && col.key !== "srNo" && (
                    <span className="ml-1 text-xs opacity-50">
                      {sortKey === col.key ? (sortAsc ? "⇅" : "⇅") : "⇅"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={`${row.srNo}-${idx}`}
                  className={`${
                    idx !== data.length - 1 ? "border-b border-gray-100" : ""
                  } hover:bg-gray-50 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={getCellClassName(col)}
                      style={{ width: col.width }}
                    >
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReusableTable;