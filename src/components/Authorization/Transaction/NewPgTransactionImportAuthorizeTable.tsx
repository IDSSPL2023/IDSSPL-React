import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { NewPgTransactionImportFilters } from "./NewPgTransactionImportFilterModal";

export type NewPgTransactionImportAuthorizeTab = "new" | "rejected";

export type NewPgTransactionImportAuthorizeRow = {
  srNo: number;
  adviceNo: string;
  branchCode: string;
  totalAmount: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  tab: NewPgTransactionImportAuthorizeTab;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "adviceNo", label: "Advice No", sortable: true, width: "180px" },
  { key: "branchCode", label: "Branch Code", sortable: true, width: "160px" },
  { key: "totalAmount", label: "Total Amount", sortable: true, width: "160px" },
  { key: "userId", label: "User ID", sortable: true, width: "140px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const SAMPLE_PG_IMPORT: Omit<NewPgTransactionImportAuthorizeRow, "srNo" | "tab">[] = [
  { adviceNo: "ADV/2026/0001", branchCode: "0002", totalAmount: "1,00,000.00", userId: "ABC", createdBy: "Admin", createdDate: "23-May-2026" },
  { adviceNo: "ADV/2026/0002", branchCode: "0002", totalAmount: "75,500.00", userId: "ABC", createdBy: "Admin", createdDate: "24-May-2026" },
  { adviceNo: "ADV/2026/0003", branchCode: "0003", totalAmount: "2,10,000.00", userId: "ABC", createdBy: "Admin", createdDate: "25-May-2026" },
  { adviceNo: "ADV/2026/0004", branchCode: "0002", totalAmount: "48,250.00", userId: "ABC", createdBy: "Admin", createdDate: "26-May-2026" },
  { adviceNo: "ADV/2026/0005", branchCode: "0003", totalAmount: "1,32,000.00", userId: "ABC", createdBy: "Admin", createdDate: "27-May-2026" },
  { adviceNo: "ADV/2026/0006", branchCode: "0002", totalAmount: "64,750.00", userId: "ABC", createdBy: "Admin", createdDate: "28-May-2026" },
  { adviceNo: "ADV/2026/0007", branchCode: "0003", totalAmount: "89,900.00", userId: "ABC", createdBy: "Admin", createdDate: "29-May-2026" },
  { adviceNo: "ADV/2026/0008", branchCode: "0002", totalAmount: "1,55,300.00", userId: "ABC", createdBy: "Admin", createdDate: "30-May-2026" },
];

const buildRows = (tab: NewPgTransactionImportAuthorizeTab, count: number): NewPgTransactionImportAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_PG_IMPORT[i % SAMPLE_PG_IMPORT.length],
    adviceNo: `ADV/2026/${String(1 + i + (tab === "rejected" ? 100 : 0)).padStart(4, "0")}`,
    srNo: i + 1,
    tab,
  }));

export const NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS: Record<NewPgTransactionImportAuthorizeTab, number> = {
  new: 14,
  rejected: 8,
};

const ALL_ROWS: NewPgTransactionImportAuthorizeRow[] = [
  ...buildRows("new", NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS.new),
  ...buildRows("rejected", NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type NewPgTransactionImportAuthorizeTableProps = {
  activeTab: NewPgTransactionImportAuthorizeTab;
  filters?: NewPgTransactionImportFilters;
  onAuthorize?: (row: NewPgTransactionImportAuthorizeRow) => void;
};

const NewPgTransactionImportAuthorizeTable = ({ activeTab, filters, onAuthorize }: NewPgTransactionImportAuthorizeTableProps) => {
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
    if (filters.adviceNo && !r.adviceNo.toLowerCase().includes(filters.adviceNo.toLowerCase())) return false;
    if (filters.amount && !r.totalAmount.toLowerCase().includes(filters.amount.toLowerCase())) return false;
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
        <table className="w-full min-w-[1100px] table-fixed border-collapse">
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
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "180px" }}>
                    {row.adviceNo}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.branchCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.totalAmount}
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

export default NewPgTransactionImportAuthorizeTable;
