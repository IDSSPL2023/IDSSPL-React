import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { RtgsFilters } from "./RtgsFilterModal";

export type RtgsAuthorizeTab = "new" | "rejected";

export type RtgsAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  particular: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  tab: RtgsAuthorizeTab;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "140px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "200px" },
  { key: "amount", label: "Amount", sortable: true, width: "120px" },
  { key: "particular", label: "Particular", sortable: true, width: "140px" },
  { key: "userId", label: "User ID", sortable: true, width: "120px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "140px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const SAMPLE_RTGS: Omit<RtgsAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "118", accountCode: "00022010000001", accountName: "Akshay Om More", amount: "100", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "23-May-2026" },
  { scrollNo: "119", accountCode: "00022010000002", accountName: "Priya Singh", amount: "100", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "24-May-2026" },
  { scrollNo: "120", accountCode: "00022010000003", accountName: "Ravi Patel", amount: "100", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "25-May-2026" },
  { scrollNo: "121", accountCode: "00022010000004", accountName: "Neha Gupta", amount: "100", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "26-May-2026" },
  { scrollNo: "122", accountCode: "00022010000005", accountName: "Suresh Kumar", amount: "100", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "27-May-2026" },
  { scrollNo: "123", accountCode: "00022010000006", accountName: "Meera Das", amount: "150", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "28-May-2026" },
  { scrollNo: "124", accountCode: "00022010000007", accountName: "Rohan Bhatia", amount: "200", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "29-May-2026" },
  { scrollNo: "125", accountCode: "00022010000008", accountName: "Anita Roy", amount: "175", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "30-May-2026" },
  { scrollNo: "126", accountCode: "00022010000009", accountName: "Vikram Sethi", amount: "225", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "31-May-2026" },
  { scrollNo: "127", accountCode: "00022010000010", accountName: "Deepika Sharma", amount: "300", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "01-Jun-2026" },
  { scrollNo: "128", accountCode: "00022010000011", accountName: "Karan Joshi", amount: "125", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "02-Jun-2026" },
  { scrollNo: "129", accountCode: "00022010000012", accountName: "Simran Kaur", amount: "250", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "03-Jun-2026" },
  { scrollNo: "130", accountCode: "00022010000013", accountName: "Manoj Rathod", amount: "180", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "04-Jun-2026" },
  { scrollNo: "131", accountCode: "00022010000014", accountName: "Kavita Iyer", amount: "220", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "05-Jun-2026" },
  { scrollNo: "132", accountCode: "00022010000015", accountName: "Arjun Nair", amount: "160", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "06-Jun-2026" },
  { scrollNo: "133", accountCode: "00022010000016", accountName: "Pooja Verma", amount: "275", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "07-Jun-2026" },
  { scrollNo: "134", accountCode: "00022010000017", accountName: "Sanjay Mehta", amount: "190", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "08-Jun-2026" },
  { scrollNo: "135", accountCode: "00022010000018", accountName: "Divya Reddy", amount: "210", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "09-Jun-2026" },
  { scrollNo: "136", accountCode: "00022010000019", accountName: "Nikhil Rao", amount: "240", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "10-Jun-2026" },
  { scrollNo: "137", accountCode: "00022010000020", accountName: "Sneha Kapoor", amount: "260", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "11-Jun-2026" },
];

const buildRows = (tab: RtgsAuthorizeTab, count: number): RtgsAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_RTGS[i % SAMPLE_RTGS.length],
    scrollNo: String(118 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const RTGS_TAB_COUNTS: Record<RtgsAuthorizeTab, number> = {
  new: 20,
  rejected: 18,
};

const ALL_ROWS: RtgsAuthorizeRow[] = [
  ...buildRows("new", RTGS_TAB_COUNTS.new),
  ...buildRows("rejected", RTGS_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type RtgsAuthorizeTableProps = {
  activeTab: RtgsAuthorizeTab;
  filters?: RtgsFilters;
  onAuthorize?: (row: RtgsAuthorizeRow) => void;
};

const RtgsAuthorizeTable = ({ activeTab, filters, onAuthorize }: RtgsAuthorizeTableProps) => {
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
        <table className="w-full min-w-[1400px] table-fixed border-collapse">
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.scrollNo}
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "180px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "200px" }}>
                    {row.accountName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "120px" }}>
                    {row.amount}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.particular}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "120px" }}>
                    {row.userId}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
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

export default RtgsAuthorizeTable;
