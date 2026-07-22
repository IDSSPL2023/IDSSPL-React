import { useState } from "react";
import type { ChangeEvent } from "react";
import { ShieldCheck, X, Filter as FilterIcon, User, Hash } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";
/** Shared with the HO-Officer Cash Withdrawal authorize flow — kept standalone, not inlined. */
import AuthorizeCashWithdrawalModal from "@/components/Authorization/Transaction/AuthorizeCashWithdrawalModal";

/* ===== from CashWithdrawalAuthorizeTable.tsx ===== */
export type CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeTab = "new" | "modify" | "rejected";

export type CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  particular: string;
  userId: string;
  createdBy: string;
  tab: CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeTab;
};

const CashWithdrawalAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "140px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "200px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "200px" },
  { key: "particular", label: "Particular", sortable: true, width: "140px" },
  { key: "userId", label: "User ID", sortable: true, width: "120px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
] as const;

const CashWithdrawalAuthorizeTable_SAMPLE_WITHDRAWALS: Omit<CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "118", accountCode: "00022010000001", accountName: "Akshay Om More", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "119", accountCode: "00022010000002", accountName: "Priya Singh", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "120", accountCode: "00022010000003", accountName: "Ravi Patel", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "121", accountCode: "00022010000004", accountName: "Neha Gupta", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "122", accountCode: "00022010000005", accountName: "Suresh Kumar", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "123", accountCode: "00022010000006", accountName: "Meera Das", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "124", accountCode: "00022010000007", accountName: "Rohan Bhatia", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "125", accountCode: "00022010000008", accountName: "Anita Roy", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "126", accountCode: "00022010000009", accountName: "Vikram Sethi", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "127", accountCode: "00022010000010", accountName: "Deepika Sharma", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "128", accountCode: "00022010000011", accountName: "Karan Joshi", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "129", accountCode: "00022010000012", accountName: "Simran Kaur", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "130", accountCode: "00022010000013", accountName: "Manoj Rathod", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "131", accountCode: "00022010000014", accountName: "Kavita Iyer", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "132", accountCode: "00022010000015", accountName: "Arjun Nair", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "133", accountCode: "00022010000016", accountName: "Pooja Verma", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "134", accountCode: "00022010000017", accountName: "Sanjay Mehta", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "135", accountCode: "00022010000018", accountName: "Divya Reddy", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "136", accountCode: "00022010000019", accountName: "Nikhil Rao", particular: "Self", userId: "ABC", createdBy: "Admin" },
  { scrollNo: "137", accountCode: "00022010000020", accountName: "Sneha Kapoor", particular: "Self", userId: "ABC", createdBy: "Admin" },
];

const CashWithdrawalAuthorizeTable_buildRows = (tab: CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeTab, count: number): CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...CashWithdrawalAuthorizeTable_SAMPLE_WITHDRAWALS[i % CashWithdrawalAuthorizeTable_SAMPLE_WITHDRAWALS.length],
    scrollNo: String(118 + i + (tab === "modify" ? 50 : tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const CashWithdrawalAuthorizeTable_CASH_WITHDRAWAL_TAB_COUNTS: Record<CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeTab, number> = {
  new: 20,
  modify: 18,
  rejected: 18,
};

const CashWithdrawalAuthorizeTable_ALL_ROWS: CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeRow[] = [
  ...CashWithdrawalAuthorizeTable_buildRows("new", CashWithdrawalAuthorizeTable_CASH_WITHDRAWAL_TAB_COUNTS.new),
  ...CashWithdrawalAuthorizeTable_buildRows("modify", CashWithdrawalAuthorizeTable_CASH_WITHDRAWAL_TAB_COUNTS.modify),
  ...CashWithdrawalAuthorizeTable_buildRows("rejected", CashWithdrawalAuthorizeTable_CASH_WITHDRAWAL_TAB_COUNTS.rejected),
];

const CashWithdrawalAuthorizeTable_PAGE_SIZE = 15;

type CashWithdrawalAuthorizeTable_SortKey = Exclude<(typeof CashWithdrawalAuthorizeTable_columns)[number]["key"], "action">;

type CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeTableProps = {
  activeTab: CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeTab;
  filters?: CashWithdrawalFilterModal_CashWithdrawalFilters;
  onAuthorize?: (row: CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeRow) => void;
};

const CashWithdrawalAuthorizeTable = ({ activeTab, filters, onAuthorize }: CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<CashWithdrawalAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: CashWithdrawalAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = CashWithdrawalAuthorizeTable_ALL_ROWS.filter((r) => {
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.accountName && !r.accountName.toLowerCase().includes(filters.accountName.toLowerCase())) return false;
    if (filters.accountCode && !r.accountCode.toLowerCase().includes(filters.accountCode.toLowerCase())) return false;
    if (filters.scrollNo && !r.scrollNo.toLowerCase().includes(filters.scrollNo.toLowerCase())) return false;
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / CashWithdrawalAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * CashWithdrawalAuthorizeTable_PAGE_SIZE, currentPage * CashWithdrawalAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1200px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {CashWithdrawalAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as CashWithdrawalAuthorizeTable_SortKey)}
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
                <td colSpan={CashWithdrawalAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "200px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "200px" }}>
                    {row.accountName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.particular}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "120px" }}>
                    {row.userId}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.createdBy}
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


/* ===== from CashWithdrawalFilterModal.tsx ===== */
const CashWithdrawalFilterModal_filterOptions = [
  {
    id: "accountName",
    label: "Account Name",
    icon: <User size={18} className="text-primary" />,
    placeholder: "Account Name",
  },
  {
    id: "accountCode",
    label: "Account Code",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Account Code",
  },
  {
    id: "scrollNo",
    label: "Scroll No",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Scroll No",
  },
  {
    id: "userId",
    label: "User ID",
    icon: <User size={18} className="text-primary" />,
    placeholder: "User ID",
  },
] as const;

type CashWithdrawalFilterModal_FilterKey = (typeof CashWithdrawalFilterModal_filterOptions)[number]["id"];

export type CashWithdrawalFilterModal_CashWithdrawalFilters = Record<CashWithdrawalFilterModal_FilterKey, string>;

type CashWithdrawalFilterModal_CashWithdrawalFilterModalProps = {
  onClose: () => void;
  onApply: (filters: CashWithdrawalFilterModal_CashWithdrawalFilters) => void;
  initialValues?: CashWithdrawalFilterModal_CashWithdrawalFilters;
};

export const CashWithdrawalFilterModal_defaultCashWithdrawalFilters: CashWithdrawalFilterModal_CashWithdrawalFilters = {
  accountName: "",
  accountCode: "",
  scrollNo: "",
  userId: "",
};

function CashWithdrawalFilterModal({
  onClose,
  onApply,
  initialValues = CashWithdrawalFilterModal_defaultCashWithdrawalFilters,
}: CashWithdrawalFilterModal_CashWithdrawalFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<CashWithdrawalFilterModal_FilterKey>("accountName");
  const [values, setValues] = useState<CashWithdrawalFilterModal_CashWithdrawalFilters>(initialValues);

  const active = CashWithdrawalFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(CashWithdrawalFilterModal_defaultCashWithdrawalFilters);
    onApply(CashWithdrawalFilterModal_defaultCashWithdrawalFilters);
    onClose();
  };

  const handleApply = () => {
    onApply(values);
    onClose();
  };

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-primary bg-white p-8 dark:bg-slate-900">
      <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-8 top-8 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100 dark:border-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <X size={18} />
      </button>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary">
          <FilterIcon size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Filter</h2>
          <p className="text-gray-400 dark:text-slate-400">Use filter for fast and efficient searching</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 border-b border-gray-200 dark:border-slate-800" />

      <div className="relative z-10 mt-8 flex items-start gap-0">
        <div className="flex w-full max-w-[470px] flex-col gap-4">
          {CashWithdrawalFilterModal_filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <div key={option.id} className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveFilter(option.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-[#E8F1FD] dark:bg-slate-800"
                      : "border-primary bg-white dark:bg-slate-900"
                  }`}
                >
                  {option.icon}
                  <span className="text-lg font-medium text-gray-900 dark:text-slate-100">
                    {option.label}
                  </span>
                </button>

                {isActive && (
                  <div className="absolute -right-9 flex h-10 w-10 items-center justify-center">
                    <div className="h-0 w-0 border-y-[18px] border-l-[24px] border-y-transparent border-l-[#DCEBFC] dark:border-l-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ml-10 flex h-[220px] w-[800px] flex-col justify-center rounded-2xl bg-[#DCEBFC] p-6 dark:bg-slate-800">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-slate-100">
            {active?.label}
          </h3>
          <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-4 py-3 dark:bg-slate-900">
            {active?.icon}
            <input
              type="text"
              value={values[activeFilter]}
              onChange={handleChange}
              placeholder={active?.placeholder}
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 flex justify-center gap-4">
        <button
          type="button"
          onClick={handleClearAll}
          className="rounded-full border border-primary px-8 py-3 font-semibold text-primary hover:bg-[#F2F8FE] dark:hover:bg-slate-800"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="rounded-full bg-primary px-10 py-3 font-semibold text-white hover:bg-[#0a56aa]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}


/* ===== from CashWithdrawalAuthorizePage.tsx ===== */
const CashWithdrawalAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<CashWithdrawalFilterModal_CashWithdrawalFilters>(CashWithdrawalFilterModal_defaultCashWithdrawalFilters);
  const [authorizeRow, setAuthorizeRow] = useState<CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeRow | null>(null);

  const handleAuthorize = (row: CashWithdrawalAuthorizeTable_CashWithdrawalAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(CashWithdrawalFilterModal_defaultCashWithdrawalFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Cash Withdrawal Authorize"
        titleHi="रोख रक्कम काढण्याची परवानगी"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "Cash Withdrawal Authorize", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-3 px-3 py-3">
        <AuthorizationTabs
          active={activeTab}
          onChange={setActiveTab}
          onOpenFilter={() => setIsFilterOpen(true)}
          isSearchVisible={isSearchVisible}
          onToggleSearch={() => setIsSearchVisible((v) => !v)}
          hasActiveFilters={hasActiveFilters(filters)}
          activeFilterSummary={getActiveFilterSummary(filters)}
          onResetFilters={handleResetFilters}
        />

        <CashWithdrawalAuthorizeTable
          activeTab={activeTab}
          filters={filters}
          onAuthorize={handleAuthorize}
        />
      </div>

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CashWithdrawalFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeCashWithdrawalModal
          open
          initialData={{
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
            particular: authorizeRow.particular,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default CashWithdrawalAuthorizePage;
