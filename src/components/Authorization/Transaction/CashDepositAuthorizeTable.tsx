import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { CashDepositFilters } from "./CashDepositFilterModal";

export type CashDepositAuthorizeTab = "new" | "rejected";

export type CashDepositAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  createdBy: string;
  createdDate: string;
  tab: CashDepositAuthorizeTab;
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

const SAMPLE_DEPOSITS: Omit<CashDepositAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "118", accountCode: "000245", accountName: "Devaraddi Mallanagoud", amount: "5,000", createdBy: "Admin", createdDate: "12-Jun-2026" },
  { scrollNo: "119", accountCode: "000246", accountName: "Akshay Om More", amount: "12,500", createdBy: "Admin", createdDate: "12-Jun-2026" },
  { scrollNo: "120", accountCode: "000247", accountName: "Priya Sharma", amount: "3,200", createdBy: "Clerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "121", accountCode: "000248", accountName: "Rohan Kulkarni", amount: "8,750", createdBy: "Clerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "122", accountCode: "000249", accountName: "Sneha Patil", amount: "20,000", createdBy: "Admin", createdDate: "14-Jun-2026" },
  { scrollNo: "123", accountCode: "000250", accountName: "Vikram Nagar", amount: "9,400", createdBy: "Admin", createdDate: "14-Jun-2026" },
  { scrollNo: "124", accountCode: "000251", accountName: "Anita Desai", amount: "15,000", createdBy: "Clerk1", createdDate: "15-Jun-2026" },
  { scrollNo: "125", accountCode: "000252", accountName: "Manoj Rathod", amount: "6,750", createdBy: "Admin", createdDate: "15-Jun-2026" },
  { scrollNo: "126", accountCode: "000253", accountName: "Kavita Joshi", amount: "22,300", createdBy: "Clerk1", createdDate: "16-Jun-2026" },
  { scrollNo: "127", accountCode: "000254", accountName: "Suresh Naik", amount: "4,100", createdBy: "Admin", createdDate: "16-Jun-2026" },
  { scrollNo: "128", accountCode: "000255", accountName: "Deepika Shetty", amount: "11,900", createdBy: "Clerk1", createdDate: "17-Jun-2026" },
  { scrollNo: "129", accountCode: "000256", accountName: "Ganesh Pillai", amount: "7,300", createdBy: "Admin", createdDate: "17-Jun-2026" },
  { scrollNo: "130", accountCode: "000257", accountName: "Radhika Menon", amount: "16,450", createdBy: "Clerk1", createdDate: "18-Jun-2026" },
  { scrollNo: "131", accountCode: "000258", accountName: "Prakash Yadav", amount: "2,900", createdBy: "Admin", createdDate: "18-Jun-2026" },
  { scrollNo: "132", accountCode: "000259", accountName: "Shalini Nair", amount: "13,600", createdBy: "Clerk1", createdDate: "19-Jun-2026" },
  { scrollNo: "133", accountCode: "000260", accountName: "Ajay Deshpande", amount: "9,850", createdBy: "Admin", createdDate: "19-Jun-2026" },
  { scrollNo: "134", accountCode: "000261", accountName: "Farhan Sheikh", amount: "24,000", createdBy: "Clerk1", createdDate: "20-Jun-2026" },
  { scrollNo: "135", accountCode: "000262", accountName: "Lata Kulkarni", amount: "5,650", createdBy: "Admin", createdDate: "20-Jun-2026" },
  { scrollNo: "136", accountCode: "000263", accountName: "Nitin Chavan", amount: "18,200", createdBy: "Clerk1", createdDate: "21-Jun-2026" },
  { scrollNo: "137", accountCode: "000264", accountName: "Swati Bhosale", amount: "10,750", createdBy: "Admin", createdDate: "21-Jun-2026" },
];

const buildRows = (tab: CashDepositAuthorizeTab, count: number): CashDepositAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_DEPOSITS[i % SAMPLE_DEPOSITS.length],
    scrollNo: String(118 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const CASH_DEPOSIT_TAB_COUNTS: Record<CashDepositAuthorizeTab, number> = {
  new: 20,
  rejected: 18,
};

const ALL_ROWS: CashDepositAuthorizeRow[] = [
  ...buildRows("new", CASH_DEPOSIT_TAB_COUNTS.new),
  ...buildRows("rejected", CASH_DEPOSIT_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type CashDepositAuthorizeTableProps = {
  activeTab: CashDepositAuthorizeTab;
  filters?: CashDepositFilters;
  onAuthorize?: (row: CashDepositAuthorizeRow) => void;
};

const CashDepositAuthorizeTable = ({ activeTab, filters, onAuthorize }: CashDepositAuthorizeTableProps) => {
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

export default CashDepositAuthorizeTable;
