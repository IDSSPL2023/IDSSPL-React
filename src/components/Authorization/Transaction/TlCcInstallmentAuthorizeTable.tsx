import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { TlCcInstallmentFilters } from "./TlCcInstallmentFilterModal";

export type TlCcInstallmentAuthorizeTab = "new" | "rejected";

export type TlCcInstallmentAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  createdBy: string;
  createdDate: string;
  tab: TlCcInstallmentAuthorizeTab;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "140px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "200px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "220px" },
  { key: "amount", label: "Amount", sortable: true, width: "140px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const SAMPLE_INSTALLMENTS: Omit<TlCcInstallmentAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "121", accountCode: "00024010014611", accountName: "Sankannar URF Kalasannavar", amount: "10.0", createdBy: "Admin", createdDate: "23-Jun-2026" },
  { scrollNo: "122", accountCode: "00024010014612", accountName: "Vikram Nagar", amount: "15.5", createdBy: "Admin", createdDate: "24-Jun-2026" },
  { scrollNo: "123", accountCode: "00024010014613", accountName: "Sunrise Heights", amount: "20.0", createdBy: "Admin", createdDate: "25-Jun-2026" },
  { scrollNo: "124", accountCode: "00024010014614", accountName: "Greenwood Estates", amount: "12.5", createdBy: "Admin", createdDate: "26-Jun-2026" },
  { scrollNo: "125", accountCode: "00024010014615", accountName: "Maple Grove", amount: "18.0", createdBy: "Admin", createdDate: "27-Jun-2026" },
  { scrollNo: "126", accountCode: "00024010014616", accountName: "Riverbend", amount: "22.0", createdBy: "Admin", createdDate: "28-Jun-2026" },
  { scrollNo: "127", accountCode: "00024010014617", accountName: "Hilltop Villa", amount: "14.0", createdBy: "Clerk1", createdDate: "29-Jun-2026" },
  { scrollNo: "128", accountCode: "00024010014618", accountName: "Oceanview Apartments", amount: "19.0", createdBy: "Admin", createdDate: "30-Jun-2026" },
  { scrollNo: "129", accountCode: "00024010014619", accountName: "Cedar Park", amount: "11.0", createdBy: "Clerk1", createdDate: "01-Jul-2026" },
  { scrollNo: "130", accountCode: "00024010014620", accountName: "Lakeside Residency", amount: "24.5", createdBy: "Admin", createdDate: "02-Jul-2026" },
  { scrollNo: "131", accountCode: "00024010014621", accountName: "Palm Court", amount: "16.5", createdBy: "Clerk1", createdDate: "03-Jul-2026" },
  { scrollNo: "132", accountCode: "00024010014622", accountName: "Silver Springs", amount: "13.0", createdBy: "Admin", createdDate: "04-Jul-2026" },
  { scrollNo: "133", accountCode: "00024010014623", accountName: "Golden Meadows", amount: "21.0", createdBy: "Clerk1", createdDate: "05-Jul-2026" },
  { scrollNo: "134", accountCode: "00024010014624", accountName: "Willow Creek", amount: "17.5", createdBy: "Admin", createdDate: "06-Jul-2026" },
  { scrollNo: "135", accountCode: "00024010014625", accountName: "Emerald Heights", amount: "23.0", createdBy: "Clerk1", createdDate: "07-Jul-2026" },
  { scrollNo: "136", accountCode: "00024010014626", accountName: "Sunset Boulevard", amount: "12.5", createdBy: "Admin", createdDate: "08-Jul-2026" },
  { scrollNo: "137", accountCode: "00024010014627", accountName: "Blue Ridge Apartments", amount: "18.5", createdBy: "Clerk1", createdDate: "09-Jul-2026" },
  { scrollNo: "138", accountCode: "00024010014628", accountName: "Rosewood Enclave", amount: "15.5", createdBy: "Admin", createdDate: "10-Jul-2026" },
  { scrollNo: "139", accountCode: "00024010014629", accountName: "Pinehill Residency", amount: "20.5", createdBy: "Clerk1", createdDate: "11-Jul-2026" },
  { scrollNo: "140", accountCode: "00024010014630", accountName: "Northgate Towers", amount: "9.5", createdBy: "Admin", createdDate: "12-Jul-2026" },
];

const buildRows = (tab: TlCcInstallmentAuthorizeTab, count: number): TlCcInstallmentAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_INSTALLMENTS[i % SAMPLE_INSTALLMENTS.length],
    scrollNo: String(121 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const TL_CC_INSTALLMENT_TAB_COUNTS: Record<TlCcInstallmentAuthorizeTab, number> = {
  new: 20,
  rejected: 18,
};

const ALL_ROWS: TlCcInstallmentAuthorizeRow[] = [
  ...buildRows("new", TL_CC_INSTALLMENT_TAB_COUNTS.new),
  ...buildRows("rejected", TL_CC_INSTALLMENT_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type TlCcInstallmentAuthorizeTableProps = {
  activeTab: TlCcInstallmentAuthorizeTab;
  filters?: TlCcInstallmentFilters;
  onAuthorize?: (row: TlCcInstallmentAuthorizeRow) => void;
};

const TlCcInstallmentAuthorizeTable = ({ activeTab, filters, onAuthorize }: TlCcInstallmentAuthorizeTableProps) => {
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.scrollNo}
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "200px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "220px" }}>
                    {row.accountName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
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

export default TlCcInstallmentAuthorizeTable;
