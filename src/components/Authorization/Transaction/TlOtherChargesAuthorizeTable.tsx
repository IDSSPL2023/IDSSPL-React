import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { TlOtherChargesFilters } from "./TlOtherChargesFilterModal";

export type TlOtherChargesAuthorizeTab = "new" | "rejected";

export type TlOtherChargesAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  amount: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  tab: TlOtherChargesAuthorizeTab;
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

const SAMPLE_TL_OTHER_CHARGES: Omit<TlOtherChargesAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "318", accountCode: "00025050002501", amount: "845.0", userId: "ABC", createdBy: "Admin", createdDate: "23-May-2026" },
  { scrollNo: "319", accountCode: "00025050002502", amount: "620.0", userId: "ABC", createdBy: "Admin", createdDate: "24-May-2026" },
  { scrollNo: "320", accountCode: "00025050002503", amount: "1,150.0", userId: "ABC", createdBy: "Admin", createdDate: "25-May-2026" },
  { scrollNo: "321", accountCode: "00025050002504", amount: "430.0", userId: "ABC", createdBy: "Admin", createdDate: "26-May-2026" },
  { scrollNo: "322", accountCode: "00025050002505", amount: "980.0", userId: "ABC", createdBy: "Admin", createdDate: "27-May-2026" },
  { scrollNo: "323", accountCode: "00025050002506", amount: "560.0", userId: "ABC", createdBy: "Admin", createdDate: "28-May-2026" },
  { scrollNo: "324", accountCode: "00025050002507", amount: "715.0", userId: "ABC", createdBy: "Admin", createdDate: "29-May-2026" },
  { scrollNo: "325", accountCode: "00025050002508", amount: "290.0", userId: "ABC", createdBy: "Admin", createdDate: "30-May-2026" },
  { scrollNo: "326", accountCode: "00025050002509", amount: "1,020.0", userId: "ABC", createdBy: "Admin", createdDate: "31-May-2026" },
  { scrollNo: "327", accountCode: "00025050002510", amount: "505.0", userId: "ABC", createdBy: "Admin", createdDate: "01-Jun-2026" },
];

const buildRows = (tab: TlOtherChargesAuthorizeTab, count: number): TlOtherChargesAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_TL_OTHER_CHARGES[i % SAMPLE_TL_OTHER_CHARGES.length],
    scrollNo: String(318 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const TL_OTHER_CHARGES_TAB_COUNTS: Record<TlOtherChargesAuthorizeTab, number> = {
  new: 18,
  rejected: 12,
};

const ALL_ROWS: TlOtherChargesAuthorizeRow[] = [
  ...buildRows("new", TL_OTHER_CHARGES_TAB_COUNTS.new),
  ...buildRows("rejected", TL_OTHER_CHARGES_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type TlOtherChargesAuthorizeTableProps = {
  activeTab: TlOtherChargesAuthorizeTab;
  filters?: TlOtherChargesFilters;
  onAuthorize?: (row: TlOtherChargesAuthorizeRow) => void;
};

const TlOtherChargesAuthorizeTable = ({ activeTab, filters, onAuthorize }: TlOtherChargesAuthorizeTableProps) => {
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

export default TlOtherChargesAuthorizeTable;
