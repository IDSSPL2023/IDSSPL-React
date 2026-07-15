import { useState } from "react";
import { Eye, SquarePen, UserRoundCog } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import { type AccountFilters } from "../shared/FilterModal";
import RowActionMenu, { type RowActionMenuItem } from "../shared/RowActionMenu";
import SrNoBadge from "../shared/SrNoBadge";
import StatusPill, { type StatusPillTone } from "../shared/StatusPill";
import SortableHeaderLabel from "../shared/SortableHeaderLabel";

const STATUS_TONE: Record<string, StatusPillTone> = {
  Live: "success",
  "Authorization Pending": "pending",
  "Modification Pending": "pending",
  "Authorization Rejected": "rejected",
};

export type RowData = {
  srNo: number;
  accountId: string;
  status: string;
  customerId: string;
  accountName: string;
  accountType: string;
  createdBy: string;
  applicationNo: string;
  openingDate?: string;
};

export type ColumnConfig = {
  key: string;
  labelKey: string;
  sortable: boolean;
  width: string;
  /** Renders the cell with the bold/dark "primary key" emphasis (used for Account ID). */
  emphasize?: boolean;
};

const defaultColumns: ColumnConfig[] = [
  { key: "srNo", labelKey: "accountMaster.table.srNo", sortable: false, width: "80px" },
  { key: "action", labelKey: "accountMaster.table.action", sortable: false, width: "80px" },
  { key: "applicationNo", labelKey: "accountMaster.table.applicationNo", sortable: false, width: "180px" },
  { key: "accountId", labelKey: "accountMaster.table.accountId", sortable: true, width: "180px", emphasize: true },
  { key: "status", labelKey: "accountMaster.table.status", sortable: true, width: "140px" },
  { key: "customerId", labelKey: "accountMaster.table.customerId", sortable: true, width: "160px" },
  { key: "accountName", labelKey: "fields.accountName", sortable: true, width: "200px" },
  { key: "accountType", labelKey: "fields.accountType", sortable: true, width: "180px" },
  { key: "createdBy", labelKey: "accountMaster.table.createdBy", sortable: true, width: "160px" },
  { key: "openingDate", labelKey: "accountMaster.table.openingDate", sortable: true, width: "160px" },
];

const defaultRows: RowData[] = [
  { srNo: 1, accountId: "000320100000001", status: "Live", customerId: "0003000001", accountName: "Akshay Om More", accountType: "Saving Deposit", createdBy: "Admin", applicationNo: "00326270000001", openingDate: "12-Jan-2024" },
  { srNo: 2, accountId: "000320100000002", status: "Live", customerId: "0003000002", accountName: "Nitish Sai Readdy", accountType: "Term Deposit", createdBy: "Admin", applicationNo: "00326270000002", openingDate: "03-Mar-2024" },
  { srNo: 3, accountId: "000320100000003", status: "Live", customerId: "0003000003", accountName: "Karan Patil", accountType: "Term Loan", createdBy: "Admin", applicationNo: "00326270000003", openingDate: "21-Jun-2024" },
];

type AccountMasterTableProps = {
  filters?: AccountFilters;
  rows?: RowData[];
  columns?: ColumnConfig[];
  onView?: (row: RowData) => void;
  onEdit?: (row: RowData) => void;
  onFreeze?: (row: RowData) => void;
  /** Overrides the default View/Edit/Freeze-Unfreeze row menu (e.g. for an Authorize/Reject workflow). */
  renderMenuItems?: (row: RowData) => RowActionMenuItem[];
};

const AccountMasterTable = ({
  filters,
  rows = defaultRows,
  columns = defaultColumns,
  onView,
  onEdit,
  onFreeze,
  renderMenuItems,
}: AccountMasterTableProps) => {
  const { tRaw } = useBilingual();
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = rows.filter((r) => {
    if (!filters) return true;
    if (filters.accountName && !r.accountName.toLowerCase().includes(filters.accountName.toLowerCase())) return false;
    if (filters.accountNumber && !r.accountId.toLowerCase().includes(filters.accountNumber.toLowerCase())) return false;
    if (filters.accountType && r.accountType.toLowerCase() !== filters.accountType.toLowerCase()) return false;
    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = (a as Record<string, unknown>)[sortKey];
    const valB = (b as Record<string, unknown>)[sortKey];
    if (valA == null || valB == null) return 0;
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const getMenuItems = (row: RowData): RowActionMenuItem[] =>
    renderMenuItems
      ? renderMenuItems(row)
      : [
          { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => onView?.(row) },
          { key: "edit", label: tRaw("common.edit"), icon: SquarePen, onClick: () => onEdit?.(row) },
          { key: "freeze", label: tRaw("accountMaster.table.menuFreeze"), icon: UserRoundCog, onClick: () => onFreeze?.(row) },
        ];

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      {/* Table container with relative positioning and hidden scrollbar */}
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-[1520px] table-fixed">
          <thead>
            <tr className="bg-primary rounded-t-xl">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={{ width: col.width }}
                >
                  <SortableHeaderLabel label={tRaw(col.labelKey)} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              sortedRows.map((row, idx) => (
                <tr
                  key={`${row.accountId}-${row.srNo}`}
                  className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} hover:bg-gray-50 dark:hover:bg-slate-800 relative`}
                >
                  {columns.map((col) => {
                    if (col.key === "srNo") {
                      return (
                        <td key={col.key} className="px-6 py-3" style={{ width: col.width }}>
                          <SrNoBadge value={row.srNo} />
                        </td>
                      );
                    }
                    if (col.key === "action") {
                      return (
                        <td key={col.key} className="px-6 py-3 relative" style={{ width: col.width }}>
                          <RowActionMenu items={getMenuItems(row)} />
                        </td>
                      );
                    }
                    if (col.key === "status") {
                      return (
                        <td key={col.key} className="px-6 py-3" style={{ width: col.width }}>
                          <StatusPill
                            label={row.status === "Live" ? tRaw("accountMaster.table.statusLive") : row.status}
                            tone={STATUS_TONE[row.status] ?? "success"}
                          />
                        </td>
                      );
                    }
                    const value = (row as Record<string, unknown>)[col.key];
                    return (
                      <td
                        key={col.key}
                        className={`px-6 py-3 truncate ${
                          col.emphasize ? "text-sm font-medium text-gray-900 dark:text-slate-100" : "text-[16px] text-gray-700 dark:text-slate-400"
                        }`}
                        style={{ width: col.width }}
                      >
                        {value != null ? String(value) : ""}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountMasterTable;
