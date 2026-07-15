import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { TransferFilters } from "./TransferFilterModal";

export type TransferAuthorizeTab = "new" | "rejected";

export type TransferAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  createdBy: string;
  createdDate: string;
  tab: TransferAuthorizeTab;
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

const SAMPLE_TRANSFERS: Omit<TransferAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "SCR-2026-001", accountCode: "401", accountName: "Gaveshvarmath Om Sadashiv", amount: "2,50,000", createdBy: "Admin", createdDate: "12-Jun-2026" },
  { scrollNo: "SCR-2026-002", accountCode: "402", accountName: "Akshay Om More", amount: "45,000", createdBy: "Admin", createdDate: "12-Jun-2026" },
  { scrollNo: "SCR-2026-003", accountCode: "403", accountName: "Priya Sharma", amount: "18,750", createdBy: "Clerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "SCR-2026-004", accountCode: "404", accountName: "Rohan Kulkarni", amount: "72,300", createdBy: "Clerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "SCR-2026-005", accountCode: "405", accountName: "Sneha Patil", amount: "1,05,000", createdBy: "Admin", createdDate: "14-Jun-2026" },
  { scrollNo: "SCR-2026-006", accountCode: "406", accountName: "Vikram Nagar", amount: "38,500", createdBy: "Admin", createdDate: "14-Jun-2026" },
  { scrollNo: "SCR-2026-007", accountCode: "407", accountName: "Anita Desai", amount: "62,000", createdBy: "Clerk1", createdDate: "15-Jun-2026" },
  { scrollNo: "SCR-2026-008", accountCode: "408", accountName: "Manoj Rathod", amount: "14,750", createdBy: "Admin", createdDate: "15-Jun-2026" },
  { scrollNo: "SCR-2026-009", accountCode: "409", accountName: "Kavita Joshi", amount: "95,300", createdBy: "Clerk1", createdDate: "16-Jun-2026" },
  { scrollNo: "SCR-2026-010", accountCode: "410", accountName: "Suresh Naik", amount: "27,100", createdBy: "Admin", createdDate: "16-Jun-2026" },
  { scrollNo: "SCR-2026-011", accountCode: "411", accountName: "Deepika Shetty", amount: "1,18,900", createdBy: "Clerk1", createdDate: "17-Jun-2026" },
  { scrollNo: "SCR-2026-012", accountCode: "412", accountName: "Ganesh Pillai", amount: "8,400", createdBy: "Admin", createdDate: "17-Jun-2026" },
  { scrollNo: "SCR-2026-013", accountCode: "413", accountName: "Radhika Menon", amount: "54,600", createdBy: "Clerk1", createdDate: "18-Jun-2026" },
  { scrollNo: "SCR-2026-014", accountCode: "414", accountName: "Prakash Yadav", amount: "19,200", createdBy: "Admin", createdDate: "18-Jun-2026" },
  { scrollNo: "SCR-2026-015", accountCode: "415", accountName: "Shalini Nair", amount: "76,800", createdBy: "Clerk1", createdDate: "19-Jun-2026" },
  { scrollNo: "SCR-2026-016", accountCode: "416", accountName: "Ajay Deshpande", amount: "33,500", createdBy: "Admin", createdDate: "19-Jun-2026" },
  { scrollNo: "SCR-2026-017", accountCode: "417", accountName: "Farhan Sheikh", amount: "1,42,000", createdBy: "Clerk1", createdDate: "20-Jun-2026" },
  { scrollNo: "SCR-2026-018", accountCode: "418", accountName: "Lata Kulkarni", amount: "21,650", createdBy: "Admin", createdDate: "20-Jun-2026" },
  { scrollNo: "SCR-2026-019", accountCode: "419", accountName: "Nitin Chavan", amount: "68,200", createdBy: "Clerk1", createdDate: "21-Jun-2026" },
  { scrollNo: "SCR-2026-020", accountCode: "420", accountName: "Swati Bhosale", amount: "40,750", createdBy: "Admin", createdDate: "21-Jun-2026" },
];

const buildRows = (tab: TransferAuthorizeTab, count: number): TransferAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_TRANSFERS[i % SAMPLE_TRANSFERS.length],
    scrollNo: `SCR-2026-${String(i + 1 + (tab === "rejected" ? 100 : 0)).padStart(3, "0")}`,
    srNo: i + 1,
    tab,
  }));

export const TRANSFER_TAB_COUNTS: Record<TransferAuthorizeTab, number> = {
  new: 20,
  rejected: 18,
};

const ALL_ROWS: TransferAuthorizeRow[] = [
  ...buildRows("new", TRANSFER_TAB_COUNTS.new),
  ...buildRows("rejected", TRANSFER_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type TransferAuthorizeTableProps = {
  activeTab: TransferAuthorizeTab;
  filters?: TransferFilters;
  onAuthorize?: (row: TransferAuthorizeRow) => void;
};

const TransferAuthorizeTable = ({ activeTab, filters, onAuthorize }: TransferAuthorizeTableProps) => {
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
    if (filters.amount && !r.amount.toLowerCase().includes(filters.amount.toLowerCase())) return false;
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

export default TransferAuthorizeTable;
