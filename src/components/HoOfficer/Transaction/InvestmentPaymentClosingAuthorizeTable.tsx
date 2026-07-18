import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import type { InvestmentPaymentClosingFilters } from "./InvestmentPaymentClosingFilterModal";

export type InvestmentPaymentClosingAuthorizeTab = "new" | "rejected";

export type InvestmentPaymentClosingAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  maturityValue: string;
  createdBy: string;
  createdDate: string;
  tab: InvestmentPaymentClosingAuthorizeTab;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "150px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "200px" },
  { key: "maturityValue", label: "Maturity Value", sortable: true, width: "150px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "150px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "150px" },
] as const;

const SAMPLE_ROWS: Omit<InvestmentPaymentClosingAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "518", accountCode: "000645", accountName: "Sample Customer", maturityValue: "2,50,000", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { scrollNo: "519", accountCode: "000646", accountName: "Test Customer", maturityValue: "1,75,000", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { scrollNo: "520", accountCode: "000647", accountName: "Demo Customer", maturityValue: "3,20,000", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "521", accountCode: "000648", accountName: "Rohan Kulkarni", maturityValue: "95,000", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "522", accountCode: "000649", accountName: "Sneha Patil", maturityValue: "4,10,000", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { scrollNo: "523", accountCode: "000650", accountName: "Vikram Nagar", maturityValue: "1,20,000", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { scrollNo: "524", accountCode: "000651", accountName: "Anita Desai", maturityValue: "2,05,000", createdBy: "HoClerk1", createdDate: "15-Jun-2026" },
  { scrollNo: "525", accountCode: "000652", accountName: "Manoj Rathod", maturityValue: "88,000", createdBy: "HoAdmin", createdDate: "15-Jun-2026" },
  { scrollNo: "526", accountCode: "000653", accountName: "Kavita Joshi", maturityValue: "3,60,000", createdBy: "HoClerk1", createdDate: "16-Jun-2026" },
  { scrollNo: "527", accountCode: "000654", accountName: "Suresh Naik", maturityValue: "1,45,000", createdBy: "HoAdmin", createdDate: "16-Jun-2026" },
];

const buildRows = (tab: InvestmentPaymentClosingAuthorizeTab, count: number): InvestmentPaymentClosingAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_ROWS[i % SAMPLE_ROWS.length],
    scrollNo: String(518 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS: Record<InvestmentPaymentClosingAuthorizeTab, number> = {
  new: 12,
  rejected: 8,
};

const ALL_ROWS: InvestmentPaymentClosingAuthorizeRow[] = [
  ...buildRows("new", INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS.new),
  ...buildRows("rejected", INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS.rejected),
];

const PAGE_SIZE = 15;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

type InvestmentPaymentClosingAuthorizeTableProps = {
  activeTab: InvestmentPaymentClosingAuthorizeTab;
  filters?: InvestmentPaymentClosingFilters;
  onAuthorize?: (row: InvestmentPaymentClosingAuthorizeRow) => void;
};

const InvestmentPaymentClosingAuthorizeTable = ({
  activeTab,
  filters,
  onAuthorize,
}: InvestmentPaymentClosingAuthorizeTableProps) => {
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
        <table className="w-full min-w-[1150px] table-fixed border-collapse">
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.scrollNo}
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "180px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "200px" }}>
                    {row.accountName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.maturityValue}
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

export default InvestmentPaymentClosingAuthorizeTable;
