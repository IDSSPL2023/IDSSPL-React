import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { ModifyTdsTransactionFilters } from "./ModifyTdsTransactionFilterModal";

export type ModifyTdsTransactionAuthorizeTab = "new" | "rejected";

export type ModifyTdsTransactionAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  amount: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  tab: ModifyTdsTransactionAuthorizeTab;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "160px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "220px" },
  { key: "amount", label: "Amount", sortable: true, width: "140px" },
  { key: "userId", label: "User ID", sortable: true, width: "140px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const SAMPLE_MODIFY_TDS: Omit<ModifyTdsTransactionAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "218", accountCode: "00000000105087", amount: "5,000.0", userId: "ABC", createdBy: "Admin", createdDate: "23-May-2026" },
  { scrollNo: "219", accountCode: "00000000105088", amount: "3,500.0", userId: "ABC", createdBy: "Admin", createdDate: "24-May-2026" },
  { scrollNo: "220", accountCode: "00000000105089", amount: "7,200.0", userId: "ABC", createdBy: "Admin", createdDate: "25-May-2026" },
  { scrollNo: "221", accountCode: "00000000105090", amount: "2,100.0", userId: "ABC", createdBy: "Admin", createdDate: "26-May-2026" },
  { scrollNo: "222", accountCode: "00000000105091", amount: "9,800.0", userId: "ABC", createdBy: "Admin", createdDate: "27-May-2026" },
  { scrollNo: "223", accountCode: "00000000105092", amount: "4,650.0", userId: "ABC", createdBy: "Admin", createdDate: "28-May-2026" },
  { scrollNo: "224", accountCode: "00000000105093", amount: "6,300.0", userId: "ABC", createdBy: "Admin", createdDate: "29-May-2026" },
  { scrollNo: "225", accountCode: "00000000105094", amount: "1,750.0", userId: "ABC", createdBy: "Admin", createdDate: "30-May-2026" },
  { scrollNo: "226", accountCode: "00000000105095", amount: "8,400.0", userId: "ABC", createdBy: "Admin", createdDate: "31-May-2026" },
  { scrollNo: "227", accountCode: "00000000105096", amount: "3,900.0", userId: "ABC", createdBy: "Admin", createdDate: "01-Jun-2026" },
];

const buildRows = (tab: ModifyTdsTransactionAuthorizeTab, count: number): ModifyTdsTransactionAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_MODIFY_TDS[i % SAMPLE_MODIFY_TDS.length],
    scrollNo: String(218 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const MODIFY_TDS_TRANSACTION_TAB_COUNTS: Record<ModifyTdsTransactionAuthorizeTab, number> = {
  new: 16,
  rejected: 10,
};

const ALL_ROWS: ModifyTdsTransactionAuthorizeRow[] = [
  ...buildRows("new", MODIFY_TDS_TRANSACTION_TAB_COUNTS.new),
  ...buildRows("rejected", MODIFY_TDS_TRANSACTION_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type ModifyTdsTransactionAuthorizeTableProps = {
  activeTab: ModifyTdsTransactionAuthorizeTab;
  filters?: ModifyTdsTransactionFilters;
  onAuthorize?: (row: ModifyTdsTransactionAuthorizeRow) => void;
};

const ModifyTdsTransactionAuthorizeTable = ({ activeTab, filters, onAuthorize }: ModifyTdsTransactionAuthorizeTableProps) => {
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
    if (filters.accountCode && !r.accountCode.toLowerCase().includes(filters.accountCode.toLowerCase())) return false;
    if (filters.scrollNo && !r.scrollNo.toLowerCase().includes(filters.scrollNo.toLowerCase())) return false;
    if (filters.amount && !r.amount.toLowerCase().includes(filters.amount.toLowerCase())) return false;
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.scrollNo}
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "220px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.amount}
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

export default ModifyTdsTransactionAuthorizeTable;
