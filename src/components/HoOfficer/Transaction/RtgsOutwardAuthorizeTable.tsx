import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { RtgsOutwardFilters } from "./RtgsOutwardFilterModal";

export type RtgsOutwardAuthorizeTab = "new" | "rejected";

export type RtgsOutwardAuthorizeRow = {
  srNo: number;
  accountCode: string;
  name: string;
  caseType: string;
  caseNumber: string;
  caseFee: string;
  createdBy: string;
  createdDate: string;
  tab: RtgsOutwardAuthorizeTab;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "name", label: "Name", sortable: true, width: "200px" },
  { key: "caseType", label: "Case Type", sortable: true, width: "150px" },
  { key: "caseNumber", label: "Case Number", sortable: true, width: "160px" },
  { key: "caseFee", label: "Case Fee", sortable: true, width: "130px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "150px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "150px" },
] as const;

const SAMPLE_ROWS: Omit<RtgsOutwardAuthorizeRow, "srNo" | "tab">[] = [
  { accountCode: "000745", name: "Devaraddi Mallanagoud", caseType: "RTGS Outward", caseNumber: "RTGS20260601", caseFee: "50", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { accountCode: "000746", name: "Akshay Om More", caseType: "RTGS Outward", caseNumber: "RTGS20260602", caseFee: "50", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { accountCode: "000747", name: "Priya Sharma", caseType: "RTGS Inward", caseNumber: "RTGS20260603", caseFee: "0", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { accountCode: "000748", name: "Rohan Kulkarni", caseType: "RTGS Outward", caseNumber: "RTGS20260604", caseFee: "50", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { accountCode: "000749", name: "Sneha Patil", caseType: "RTGS Outward", caseNumber: "RTGS20260605", caseFee: "50", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { accountCode: "000750", name: "Vikram Nagar", caseType: "RTGS Inward", caseNumber: "RTGS20260606", caseFee: "0", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { accountCode: "000751", name: "Anita Desai", caseType: "RTGS Outward", caseNumber: "RTGS20260607", caseFee: "50", createdBy: "HoClerk1", createdDate: "15-Jun-2026" },
  { accountCode: "000752", name: "Manoj Rathod", caseType: "RTGS Outward", caseNumber: "RTGS20260608", caseFee: "50", createdBy: "HoAdmin", createdDate: "15-Jun-2026" },
  { accountCode: "000753", name: "Kavita Joshi", caseType: "RTGS Inward", caseNumber: "RTGS20260609", caseFee: "0", createdBy: "HoClerk1", createdDate: "16-Jun-2026" },
  { accountCode: "000754", name: "Suresh Naik", caseType: "RTGS Outward", caseNumber: "RTGS20260610", caseFee: "50", createdBy: "HoAdmin", createdDate: "16-Jun-2026" },
];

const buildRows = (tab: RtgsOutwardAuthorizeTab, count: number): RtgsOutwardAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_ROWS[i % SAMPLE_ROWS.length],
    srNo: i + 1,
    tab,
  }));

export const RTGS_OUTWARD_TAB_COUNTS: Record<RtgsOutwardAuthorizeTab, number> = {
  new: 12,
  rejected: 8,
};

const ALL_ROWS: RtgsOutwardAuthorizeRow[] = [
  ...buildRows("new", RTGS_OUTWARD_TAB_COUNTS.new),
  ...buildRows("rejected", RTGS_OUTWARD_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type RtgsOutwardAuthorizeTableProps = {
  activeTab: RtgsOutwardAuthorizeTab;
  filters?: RtgsOutwardFilters;
  onAuthorize?: (row: RtgsOutwardAuthorizeRow) => void;
};

const RtgsOutwardAuthorizeTable = ({ activeTab, filters, onAuthorize }: RtgsOutwardAuthorizeTableProps) => {
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
    if (filters.name && !r.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.accountCode && !r.accountCode.toLowerCase().includes(filters.accountCode.toLowerCase())) return false;
    if (filters.caseNumber && !r.caseNumber.toLowerCase().includes(filters.caseNumber.toLowerCase())) return false;
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
        <table className="w-full min-w-[1250px] table-fixed border-collapse">
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
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "180px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "200px" }}>
                    {row.name}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.caseType}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.caseNumber}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "130px" }}>
                    {row.caseFee}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.createdBy}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
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

export default RtgsOutwardAuthorizeTable;
