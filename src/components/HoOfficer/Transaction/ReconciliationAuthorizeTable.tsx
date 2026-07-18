import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { ReconciliationFilters } from "./ReconciliationFilterModal";

export type ReconciliationAuthorizeTab = "new" | "rejected";

export type ReconciliationAuthorizeRow = {
  srNo: number;
  adviceNo: string;
  branchName: string;
  reconciliationCode: string;
  createdBy: string;
  createdDate: string;
  tab: ReconciliationAuthorizeTab;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "adviceNo", label: "Advice No", sortable: true, width: "160px" },
  { key: "branchName", label: "Branch Name", sortable: true, width: "220px" },
  { key: "reconciliationCode", label: "Reconciliation Code", sortable: true, width: "200px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const SAMPLE_ROWS: Omit<ReconciliationAuthorizeRow, "srNo" | "tab">[] = [
  { adviceNo: "ADV2026-01", branchName: "Main Branch", reconciliationCode: "REC01", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { adviceNo: "ADV2026-02", branchName: "Kothrud Branch", reconciliationCode: "REC02", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { adviceNo: "ADV2026-03", branchName: "Hadapsar Branch", reconciliationCode: "REC01", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { adviceNo: "ADV2026-04", branchName: "Wakad Branch", reconciliationCode: "REC02", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { adviceNo: "ADV2026-05", branchName: "Baner Branch", reconciliationCode: "REC01", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { adviceNo: "ADV2026-06", branchName: "Aundh Branch", reconciliationCode: "REC02", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { adviceNo: "ADV2026-07", branchName: "Viman Nagar Branch", reconciliationCode: "REC01", createdBy: "HoClerk1", createdDate: "15-Jun-2026" },
  { adviceNo: "ADV2026-08", branchName: "Kharadi Branch", reconciliationCode: "REC02", createdBy: "HoAdmin", createdDate: "15-Jun-2026" },
];

const buildRows = (tab: ReconciliationAuthorizeTab, count: number): ReconciliationAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_ROWS[i % SAMPLE_ROWS.length],
    adviceNo: `${SAMPLE_ROWS[i % SAMPLE_ROWS.length].adviceNo}${tab === "rejected" ? "-R" : ""}`,
    srNo: i + 1,
    tab,
  }));

export const RECONCILIATION_TAB_COUNTS: Record<ReconciliationAuthorizeTab, number> = {
  new: 10,
  rejected: 6,
};

const ALL_ROWS: ReconciliationAuthorizeRow[] = [
  ...buildRows("new", RECONCILIATION_TAB_COUNTS.new),
  ...buildRows("rejected", RECONCILIATION_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type ReconciliationAuthorizeTableProps = {
  activeTab: ReconciliationAuthorizeTab;
  filters?: ReconciliationFilters;
  onAuthorize?: (row: ReconciliationAuthorizeRow) => void;
};

const ReconciliationAuthorizeTable = ({ activeTab, filters, onAuthorize }: ReconciliationAuthorizeTableProps) => {
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
    if (filters.branchName && !r.branchName.toLowerCase().includes(filters.branchName.toLowerCase())) return false;
    if (filters.adviceNo && !r.adviceNo.toLowerCase().includes(filters.adviceNo.toLowerCase())) return false;
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
                  <td className="relative px-6 py-3" style={{ width: "90px" }}>
                    <RowActionMenu
                      items={[
                        { key: "authorize", label: "Authorize", icon: ShieldCheck, onClick: () => onAuthorize?.(row) },
                      ]}
                    />
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "160px" }}>
                    {row.adviceNo}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "220px" }}>
                    {row.branchName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "200px" }}>
                    {row.reconciliationCode}
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

export default ReconciliationAuthorizeTable;
