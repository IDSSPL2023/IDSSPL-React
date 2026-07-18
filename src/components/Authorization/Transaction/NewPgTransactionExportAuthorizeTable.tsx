import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { NewPgTransactionExportFilters } from "./NewPgTransactionExportFilterModal";

export type NewPgTransactionExportAuthorizeTab = "new" | "rejected";

export type NewPgTransactionExportAuthorizeRow = {
  srNo: number;
  branchCode: string;
  productCode: string;
  agentId: string;
  period: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  tab: NewPgTransactionExportAuthorizeTab;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "branchCode", label: "Branch Code", sortable: true, width: "150px" },
  { key: "productCode", label: "Product Code", sortable: true, width: "150px" },
  { key: "agentId", label: "Agent ID", sortable: true, width: "140px" },
  { key: "period", label: "Period", sortable: true, width: "140px" },
  { key: "userId", label: "User ID", sortable: true, width: "140px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const SAMPLE_PG_EXPORT: Omit<NewPgTransactionExportAuthorizeRow, "srNo" | "tab">[] = [
  { branchCode: "0002", productCode: "0002", agentId: "0002", period: "June 2026", userId: "ABC", createdBy: "Admin", createdDate: "23-May-2026" },
  { branchCode: "0003", productCode: "0005", agentId: "0003", period: "May 2026", userId: "ABC", createdBy: "Admin", createdDate: "24-May-2026" },
  { branchCode: "0002", productCode: "0002", agentId: "0002", period: "April 2026", userId: "ABC", createdBy: "Admin", createdDate: "25-May-2026" },
  { branchCode: "0003", productCode: "0005", agentId: "0003", period: "June 2026", userId: "ABC", createdBy: "Admin", createdDate: "26-May-2026" },
  { branchCode: "0002", productCode: "0002", agentId: "0002", period: "March 2026", userId: "ABC", createdBy: "Admin", createdDate: "27-May-2026" },
  { branchCode: "0003", productCode: "0005", agentId: "0003", period: "June 2026", userId: "ABC", createdBy: "Admin", createdDate: "28-May-2026" },
  { branchCode: "0002", productCode: "0002", agentId: "0002", period: "May 2026", userId: "ABC", createdBy: "Admin", createdDate: "29-May-2026" },
];

const buildRows = (tab: NewPgTransactionExportAuthorizeTab, count: number): NewPgTransactionExportAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_PG_EXPORT[i % SAMPLE_PG_EXPORT.length],
    srNo: i + 1,
    tab,
  }));

export const NEW_PG_TRANSACTION_EXPORT_TAB_COUNTS: Record<NewPgTransactionExportAuthorizeTab, number> = {
  new: 12,
  rejected: 7,
};

const ALL_ROWS: NewPgTransactionExportAuthorizeRow[] = [
  ...buildRows("new", NEW_PG_TRANSACTION_EXPORT_TAB_COUNTS.new),
  ...buildRows("rejected", NEW_PG_TRANSACTION_EXPORT_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type NewPgTransactionExportAuthorizeTableProps = {
  activeTab: NewPgTransactionExportAuthorizeTab;
  filters?: NewPgTransactionExportFilters;
  onAuthorize?: (row: NewPgTransactionExportAuthorizeRow) => void;
};

const NewPgTransactionExportAuthorizeTable = ({ activeTab, filters, onAuthorize }: NewPgTransactionExportAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = ALL_ROWS.filter((r) => {
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.branchCode && !r.branchCode.toLowerCase().includes(filters.branchCode.toLowerCase())) return false;
    if (filters.agentId && !r.agentId.toLowerCase().includes(filters.agentId.toLowerCase())) return false;
    if (filters.period && !r.period.toLowerCase().includes(filters.period.toLowerCase())) return false;
    if (filters.userId && !r.userId.toLowerCase().includes(filters.userId.toLowerCase())) return false;
    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1150px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as SortKey)}
                  className={`whitespace-nowrap px-6 py-3 text-left text-[16px] font-semibold text-white ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={{ width: col.width }}
                >
                  <SortableHeaderLabel label={col.label} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => (
                <tr
                  key={`${row.tab}-${row.srNo}`}
                  className={`${idx !== pageRows.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} relative hover:bg-gray-50 dark:hover:bg-slate-800`}
                >
                  <td className="px-6 py-3" style={{ width: "80px" }}>
                    <SrNoBadge value={row.srNo} />
                  </td>
                  <td className="relative px-6 py-3" style={{ width: "80px" }}>
                    <RowActionMenu
                      items={[
                        { key: "authorize", label: "Authorize", icon: ShieldCheck, onClick: () => onAuthorize?.(row) },
                      ]}
                    />
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "150px" }}>
                    {row.branchCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.productCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.agentId}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.period}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.userId}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.createdBy}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.createdDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default NewPgTransactionExportAuthorizeTable;
