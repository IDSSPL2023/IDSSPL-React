import React from "react";

export interface ColumnDef {
  header: string;
  accessorKey: string;
  cell?: (value: any, row: any, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string | number;
}

export interface GlobalTableProps {
  columns: ColumnDef[];
  data: any[];
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  emptyMessage?: string;
  showStriped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  onRowClick?: (row: any, index: number) => void;
}

export function GlobalTable({
  columns,
  data,
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
  emptyMessage = "No data available",
  showStriped = false,
  hoverable = true,
  bordered = false,
  compact = false,
  onRowClick,
}: GlobalTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`rounded-xl border border-slate-200 bg-white p-8 text-center ${className}`}>
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  const getAlignmentClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div className={`overflow-hidden rounded-xl ${bordered ? "border border-slate-200" : ""} ${className}`}>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className={`bg-[#181C43] text-xs font-semibold text-white ${headerClassName}`}>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-4 ${compact ? "py-2" : "py-3"} ${getAlignmentClass(col.align)} ${
                  col.headerClassName || ""
                } ${col.sortable ? "cursor-pointer select-none hover:bg-[#2a2f5e]" : ""}`}
                style={{ width: col.width }}
              >
                <div className={`flex ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : "justify-start"} items-center gap-1`}>
                  {col.header}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y divide-slate-100 bg-white ${rowClassName}`}>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                ${hoverable ? "hover:bg-slate-50" : ""}
                ${showStriped && rowIndex % 2 === 0 ? "bg-white" : showStriped ? "bg-slate-50/50" : ""}
                ${onRowClick ? "cursor-pointer" : ""}
              `}
              onClick={() => onRowClick?.(row, rowIndex)}
            >
              {columns.map((col, colIndex) => {
                const value = row[col.accessorKey];
                const cellContent = col.cell
                  ? col.cell(value, row, rowIndex)
                  : value;

                return (
                  <td
                    key={colIndex}
                    className={`px-4 ${compact ? "py-1.5" : "py-3"} ${getAlignmentClass(col.align)} ${
                      col.className || ""
                    } ${cellClassName}`}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GlobalTable;