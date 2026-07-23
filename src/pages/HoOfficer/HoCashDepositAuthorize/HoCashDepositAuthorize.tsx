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
import AuthorizeCashDepositModal from "@/components/Authorization/Transaction/AuthorizeCashDepositModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from HoCashDepositAuthorizeTable.tsx ===== */
export type HoCashDepositAuthorizeTable_HoCashDepositAuthorizeTab = "new" | "rejected";

export type HoCashDepositAuthorizeTable_HoCashDepositAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  createdBy: string;
  createdDate: string;
  tab: HoCashDepositAuthorizeTable_HoCashDepositAuthorizeTab;
};

const HoCashDepositAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "160px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "220px" },
  { key: "amount", label: "Amount", sortable: true, width: "150px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const HoCashDepositAuthorizeTable_SAMPLE_ROWS: Omit<HoCashDepositAuthorizeTable_HoCashDepositAuthorizeRow, "srNo" | "tab">[] = [
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

const HoCashDepositAuthorizeTable_buildRows = (tab: HoCashDepositAuthorizeTable_HoCashDepositAuthorizeTab, count: number): HoCashDepositAuthorizeTable_HoCashDepositAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...HoCashDepositAuthorizeTable_SAMPLE_ROWS[i % HoCashDepositAuthorizeTable_SAMPLE_ROWS.length],
    scrollNo: String(218 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const HoCashDepositAuthorizeTable_HO_CASH_DEPOSIT_TAB_COUNTS: Record<HoCashDepositAuthorizeTable_HoCashDepositAuthorizeTab, number> = {
  new: 15,
  rejected: 12,
};

const HoCashDepositAuthorizeTable_ALL_ROWS: HoCashDepositAuthorizeTable_HoCashDepositAuthorizeRow[] = [
  ...HoCashDepositAuthorizeTable_buildRows("new", HoCashDepositAuthorizeTable_HO_CASH_DEPOSIT_TAB_COUNTS.new),
  ...HoCashDepositAuthorizeTable_buildRows("rejected", HoCashDepositAuthorizeTable_HO_CASH_DEPOSIT_TAB_COUNTS.rejected),
];

const HoCashDepositAuthorizeTable_PAGE_SIZE = 15;

type HoCashDepositAuthorizeTable_SortKey = Exclude<(typeof HoCashDepositAuthorizeTable_columns)[number]["key"], "action">;

type HoCashDepositAuthorizeTable_HoCashDepositAuthorizeTableProps = {
  activeTab: HoCashDepositAuthorizeTable_HoCashDepositAuthorizeTab;
  filters?: HoCashDepositFilterModal_HoCashDepositFilters;
  onAuthorize?: (row: HoCashDepositAuthorizeTable_HoCashDepositAuthorizeRow) => void;
};

const HoCashDepositAuthorizeTable = ({ activeTab, filters, onAuthorize }: HoCashDepositAuthorizeTable_HoCashDepositAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<HoCashDepositAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: HoCashDepositAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = HoCashDepositAuthorizeTable_ALL_ROWS.filter((r) => {
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / HoCashDepositAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * HoCashDepositAuthorizeTable_PAGE_SIZE, currentPage * HoCashDepositAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1200px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {HoCashDepositAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as HoCashDepositAuthorizeTable_SortKey)}
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
                <td colSpan={HoCashDepositAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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


/* ===== from HoCashDepositFilterModal.tsx ===== */
const HoCashDepositFilterModal_filterOptions = [
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
] as const;

type HoCashDepositFilterModal_FilterKey = (typeof HoCashDepositFilterModal_filterOptions)[number]["id"];

export type HoCashDepositFilterModal_HoCashDepositFilters = Record<HoCashDepositFilterModal_FilterKey, string>;

type HoCashDepositFilterModal_HoCashDepositFilterModalProps = {
  onClose: () => void;
  onApply: (filters: HoCashDepositFilterModal_HoCashDepositFilters) => void;
  initialValues?: HoCashDepositFilterModal_HoCashDepositFilters;
};

export const HoCashDepositFilterModal_defaultHoCashDepositFilters: HoCashDepositFilterModal_HoCashDepositFilters = {
  accountName: "",
  accountCode: "",
  scrollNo: "",
};

function HoCashDepositFilterModal({
  onClose,
  onApply,
  initialValues = HoCashDepositFilterModal_defaultHoCashDepositFilters,
}: HoCashDepositFilterModal_HoCashDepositFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<HoCashDepositFilterModal_FilterKey>("accountName");
  const [values, setValues] = useState<HoCashDepositFilterModal_HoCashDepositFilters>(initialValues);

  const active = HoCashDepositFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(HoCashDepositFilterModal_defaultHoCashDepositFilters);
    onApply(HoCashDepositFilterModal_defaultHoCashDepositFilters);
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
          {HoCashDepositFilterModal_filterOptions.map((option) => {
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


/* ===== from HoCashDepositAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: HoCashDepositAuthorizeTable_HO_CASH_DEPOSIT_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: HoCashDepositAuthorizeTable_HO_CASH_DEPOSIT_TAB_COUNTS.rejected },
];

const HoCashDepositAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<HoCashDepositFilterModal_HoCashDepositFilters>(HoCashDepositFilterModal_defaultHoCashDepositFilters);
  const [authorizeRow, setAuthorizeRow] = useState<HoCashDepositAuthorizeTable_HoCashDepositAuthorizeRow | null>(null);

  const handleAuthorize = (row: HoCashDepositAuthorizeTable_HoCashDepositAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(HoCashDepositFilterModal_defaultHoCashDepositFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="HO Cash Deposit Entry Authorize"
        titleHi="HO रोख जमा नोंद अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "HO Cash Deposit Entry Authorize", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-3 px-3 py-3">
        <AuthorizationTabs
          active={activeTab}
          onChange={setActiveTab}
          onOpenFilter={() => setIsFilterOpen(true)}
          tabs={TABS}
          isSearchVisible={isSearchVisible}
          onToggleSearch={() => setIsSearchVisible((v) => !v)}
          hasActiveFilters={hasActiveFilters(filters)}
          activeFilterSummary={getActiveFilterSummary(filters)}
          onResetFilters={handleResetFilters}
        />

        <HoCashDepositAuthorizeTable
          activeTab={activeTab === "rejected" ? "rejected" : "new"}
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
            <HoCashDepositFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeCashDepositModal
          open
          titleEn="Authorize HO Cash Deposit Entry"
          titleHi="HO रोख जमा नोंद अधिकृत करा"
          subtitleEn="Check information related to the HO cash deposit entry and authorize it."
          subtitleHi="HO रोख जमा नोंदीशी संबंधित माहिती तपासा आणि अधिकृत करा."
          successTitle="HO Cash Deposit Entry Authorized Successfully"
          rejectedTitle="HO Cash Deposit Entry Authorization Rejected"
          initialData={{
            isHoTransaction: true,
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
            amount: authorizeRow.amount,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default HoCashDepositAuthorizePage;
