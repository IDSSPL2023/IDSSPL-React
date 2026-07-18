import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { HoCashDepositFilters } from "./HoCashDepositFilterModal";

export type HoCashDepositAuthorizeTab = "new" | "rejected";

export type HoCashDepositAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  createdBy: string;
  createdDate: string;
  tab: HoCashDepositAuthorizeTab;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "160px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "220px" },
  { key: "amount", label: "Amount", sortable: true, width: "150px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const SAMPLE_ROWS: Omit<HoCashDepositAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "218", accountCode: "000345", accountName: "Devaraddi Mallanagoud", amount: "15,000", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { scrollNo: "219", accountCode: "000346", accountName: "Akshay Om More", amount: "22,500", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { scrollNo: "220", accountCode: "000347", accountName: "Priya Sharma", amount: "8,200", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "221", accountCode: "000348", accountName: "Rohan Kulkarni", amount: "18,750", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "222", accountCode: "000349", accountName: "Sneha Patil", amount: "30,000", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { scrollNo: "223", accountCode: "000350", accountName: "Vikram Nagar", amount: "9,400", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { scrollNo: "224", accountCode: "000351", accountName: "Anita Desai", amount: "25,000", createdBy: "HoClerk1", createdDate: "15-Jun-2026" },
  { scrollNo: "225", accountCode: "000352", accountName: "Manoj Rathod", amount: "6,750", createdBy: "HoAdmin", createdDate: "15-Jun-2026" },
  { scrollNo: "226", accountCode: "000353", accountName: "Kavita Joshi", amount: "32,300", createdBy: "HoClerk1", createdDate: "16-Jun-2026" },
  { scrollNo: "227", accountCode: "000354", accountName: "Suresh Naik", amount: "4,100", createdBy: "HoAdmin", createdDate: "16-Jun-2026" },
  { scrollNo: "228", accountCode: "000355", accountName: "Deepika Shetty", amount: "11,900", createdBy: "HoClerk1", createdDate: "17-Jun-2026" },
  { scrollNo: "229", accountCode: "000356", accountName: "Ganesh Pillai", amount: "17,300", createdBy: "HoAdmin", createdDate: "17-Jun-2026" },
  { scrollNo: "230", accountCode: "000357", accountName: "Radhika Menon", amount: "16,450", createdBy: "HoClerk1", createdDate: "18-Jun-2026" },
  { scrollNo: "231", accountCode: "000358", accountName: "Prakash Yadav", amount: "2,900", createdBy: "HoAdmin", createdDate: "18-Jun-2026" },
  { scrollNo: "232", accountCode: "000359", accountName: "Shalini Nair", amount: "13,600", createdBy: "HoClerk1", createdDate: "19-Jun-2026" },
];

const buildRows = (tab: HoCashDepositAuthorizeTab, count: number): HoCashDepositAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_ROWS[i % SAMPLE_ROWS.length],
    scrollNo: String(218 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const HO_CASH_DEPOSIT_TAB_COUNTS: Record<HoCashDepositAuthorizeTab, number> = {
  new: 15,
  rejected: 12,
};

const ALL_ROWS: HoCashDepositAuthorizeRow[] = [
  ...buildRows("new", HO_CASH_DEPOSIT_TAB_COUNTS.new),
  ...buildRows("rejected", HO_CASH_DEPOSIT_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type HoCashDepositAuthorizeTableProps = {
  activeTab: HoCashDepositAuthorizeTab;
  filters?: HoCashDepositFilters;
  onAuthorize?: (row: HoCashDepositAuthorizeRow) => void;
};

const HoCashDepositAuthorizeTable = ({ activeTab, filters, onAuthorize }: HoCashDepositAuthorizeTableProps) => {
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
    if (filters.accountName && !r.accountName.toLowerCase().includes(filters.accountName.toLowerCase())) return false;
    if (filters.accountCode && !r.accountCode.toLowerCase().includes(filters.accountCode.toLowerCase())) return false;
    if (filters.scrollNo && !r.scrollNo.toLowerCase().includes(filters.scrollNo.toLowerCase())) return false;
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
        <table className="w-full min-w-[1200px] table-fixed border-collapse">
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.scrollNo}
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "180px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "220px" }}>
                    {row.accountName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.amount}
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

export default HoCashDepositAuthorizeTable;
