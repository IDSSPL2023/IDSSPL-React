import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { HoCashWithdrawalFilters } from "./HoCashWithdrawalFilterModal";

export type HoCashWithdrawalAuthorizeTab = "new" | "rejected";

export type HoCashWithdrawalAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  createdBy: string;
  createdDate: string;
  tab: HoCashWithdrawalAuthorizeTab;
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

const SAMPLE_ROWS: Omit<HoCashWithdrawalAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "318", accountCode: "000445", accountName: "Gaveshvarmath Om Sadashiv", amount: "12,000", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { scrollNo: "319", accountCode: "000446", accountName: "Akshay Om More", amount: "9,500", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { scrollNo: "320", accountCode: "000447", accountName: "Priya Sharma", amount: "6,200", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "321", accountCode: "000448", accountName: "Rohan Kulkarni", amount: "14,750", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "322", accountCode: "000449", accountName: "Sneha Patil", amount: "21,000", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { scrollNo: "323", accountCode: "000450", accountName: "Vikram Nagar", amount: "7,400", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { scrollNo: "324", accountCode: "000451", accountName: "Anita Desai", amount: "19,000", createdBy: "HoClerk1", createdDate: "15-Jun-2026" },
  { scrollNo: "325", accountCode: "000452", accountName: "Manoj Rathod", amount: "5,750", createdBy: "HoAdmin", createdDate: "15-Jun-2026" },
  { scrollNo: "326", accountCode: "000453", accountName: "Kavita Joshi", amount: "26,300", createdBy: "HoClerk1", createdDate: "16-Jun-2026" },
  { scrollNo: "327", accountCode: "000454", accountName: "Suresh Naik", amount: "3,100", createdBy: "HoAdmin", createdDate: "16-Jun-2026" },
  { scrollNo: "328", accountCode: "000455", accountName: "Deepika Shetty", amount: "9,900", createdBy: "HoClerk1", createdDate: "17-Jun-2026" },
  { scrollNo: "329", accountCode: "000456", accountName: "Ganesh Pillai", amount: "13,300", createdBy: "HoAdmin", createdDate: "17-Jun-2026" },
  { scrollNo: "330", accountCode: "000457", accountName: "Radhika Menon", amount: "12,450", createdBy: "HoClerk1", createdDate: "18-Jun-2026" },
  { scrollNo: "331", accountCode: "000458", accountName: "Prakash Yadav", amount: "1,900", createdBy: "HoAdmin", createdDate: "18-Jun-2026" },
  { scrollNo: "332", accountCode: "000459", accountName: "Shalini Nair", amount: "10,600", createdBy: "HoClerk1", createdDate: "19-Jun-2026" },
];

const buildRows = (tab: HoCashWithdrawalAuthorizeTab, count: number): HoCashWithdrawalAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_ROWS[i % SAMPLE_ROWS.length],
    scrollNo: String(318 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const HO_CASH_WITHDRAWAL_TAB_COUNTS: Record<HoCashWithdrawalAuthorizeTab, number> = {
  new: 15,
  rejected: 12,
};

const ALL_ROWS: HoCashWithdrawalAuthorizeRow[] = [
  ...buildRows("new", HO_CASH_WITHDRAWAL_TAB_COUNTS.new),
  ...buildRows("rejected", HO_CASH_WITHDRAWAL_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type HoCashWithdrawalAuthorizeTableProps = {
  activeTab: HoCashWithdrawalAuthorizeTab;
  filters?: HoCashWithdrawalFilters;
  onAuthorize?: (row: HoCashWithdrawalAuthorizeRow) => void;
};

const HoCashWithdrawalAuthorizeTable = ({ activeTab, filters, onAuthorize }: HoCashWithdrawalAuthorizeTableProps) => {
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

export default HoCashWithdrawalAuthorizeTable;
