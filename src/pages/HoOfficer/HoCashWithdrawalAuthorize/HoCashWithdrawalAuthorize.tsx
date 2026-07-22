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
import AuthorizeCashWithdrawalModal from "@/components/Authorization/Transaction/AuthorizeCashWithdrawalModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from HoCashWithdrawalAuthorizeTable.tsx ===== */
export type HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeTab = "new" | "rejected";

export type HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  createdBy: string;
  createdDate: string;
  tab: HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeTab;
};

const HoCashWithdrawalAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "160px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "220px" },
  { key: "amount", label: "Amount", sortable: true, width: "150px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const HoCashWithdrawalAuthorizeTable_SAMPLE_ROWS: Omit<HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeRow, "srNo" | "tab">[] = [
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

const HoCashWithdrawalAuthorizeTable_buildRows = (tab: HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeTab, count: number): HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...HoCashWithdrawalAuthorizeTable_SAMPLE_ROWS[i % HoCashWithdrawalAuthorizeTable_SAMPLE_ROWS.length],
    scrollNo: String(318 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const HoCashWithdrawalAuthorizeTable_HO_CASH_WITHDRAWAL_TAB_COUNTS: Record<HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeTab, number> = {
  new: 15,
  rejected: 12,
};

const HoCashWithdrawalAuthorizeTable_ALL_ROWS: HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeRow[] = [
  ...HoCashWithdrawalAuthorizeTable_buildRows("new", HoCashWithdrawalAuthorizeTable_HO_CASH_WITHDRAWAL_TAB_COUNTS.new),
  ...HoCashWithdrawalAuthorizeTable_buildRows("rejected", HoCashWithdrawalAuthorizeTable_HO_CASH_WITHDRAWAL_TAB_COUNTS.rejected),
];

const HoCashWithdrawalAuthorizeTable_PAGE_SIZE = 15;

type HoCashWithdrawalAuthorizeTable_SortKey = Exclude<(typeof HoCashWithdrawalAuthorizeTable_columns)[number]["key"], "action">;

type HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeTableProps = {
  activeTab: HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeTab;
  filters?: HoCashWithdrawalFilterModal_HoCashWithdrawalFilters;
  onAuthorize?: (row: HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeRow) => void;
};

const HoCashWithdrawalAuthorizeTable = ({ activeTab, filters, onAuthorize }: HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<HoCashWithdrawalAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: HoCashWithdrawalAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = HoCashWithdrawalAuthorizeTable_ALL_ROWS.filter((r) => {
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / HoCashWithdrawalAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * HoCashWithdrawalAuthorizeTable_PAGE_SIZE, currentPage * HoCashWithdrawalAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1200px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {HoCashWithdrawalAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as HoCashWithdrawalAuthorizeTable_SortKey)}
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
                <td colSpan={HoCashWithdrawalAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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


/* ===== from HoCashWithdrawalFilterModal.tsx ===== */
const HoCashWithdrawalFilterModal_filterOptions = [
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

type HoCashWithdrawalFilterModal_FilterKey = (typeof HoCashWithdrawalFilterModal_filterOptions)[number]["id"];

export type HoCashWithdrawalFilterModal_HoCashWithdrawalFilters = Record<HoCashWithdrawalFilterModal_FilterKey, string>;

type HoCashWithdrawalFilterModal_HoCashWithdrawalFilterModalProps = {
  onClose: () => void;
  onApply: (filters: HoCashWithdrawalFilterModal_HoCashWithdrawalFilters) => void;
  initialValues?: HoCashWithdrawalFilterModal_HoCashWithdrawalFilters;
};

export const HoCashWithdrawalFilterModal_defaultHoCashWithdrawalFilters: HoCashWithdrawalFilterModal_HoCashWithdrawalFilters = {
  accountName: "",
  accountCode: "",
  scrollNo: "",
};

function HoCashWithdrawalFilterModal({
  onClose,
  onApply,
  initialValues = HoCashWithdrawalFilterModal_defaultHoCashWithdrawalFilters,
}: HoCashWithdrawalFilterModal_HoCashWithdrawalFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<HoCashWithdrawalFilterModal_FilterKey>("accountName");
  const [values, setValues] = useState<HoCashWithdrawalFilterModal_HoCashWithdrawalFilters>(initialValues);

  const active = HoCashWithdrawalFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(HoCashWithdrawalFilterModal_defaultHoCashWithdrawalFilters);
    onApply(HoCashWithdrawalFilterModal_defaultHoCashWithdrawalFilters);
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
          {HoCashWithdrawalFilterModal_filterOptions.map((option) => {
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


/* ===== from HoCashWithdrawalAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: HoCashWithdrawalAuthorizeTable_HO_CASH_WITHDRAWAL_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: HoCashWithdrawalAuthorizeTable_HO_CASH_WITHDRAWAL_TAB_COUNTS.rejected },
];

const HoCashWithdrawalAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<HoCashWithdrawalFilterModal_HoCashWithdrawalFilters>(HoCashWithdrawalFilterModal_defaultHoCashWithdrawalFilters);
  const [authorizeRow, setAuthorizeRow] = useState<HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeRow | null>(null);

  const handleAuthorize = (row: HoCashWithdrawalAuthorizeTable_HoCashWithdrawalAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(HoCashWithdrawalFilterModal_defaultHoCashWithdrawalFilters);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="HO Cash Withdrawal Entry Authorize"
        titleHi="HO रोख पैसे काढणे नोंद अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "HO Cash Withdrawal Entry Authorize", href: "#" },
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

        <HoCashWithdrawalAuthorizeTable
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
            <HoCashWithdrawalFilterModal
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
          titleEn="Authorize HO Cash Withdrawal Entry"
          titleHi="HO रोख पैसे काढणे नोंद अधिकृत करा"
          subtitleEn="Check information related to the HO cash withdrawal entry and authorize it."
          subtitleHi="HO रोख पैसे काढणे नोंदीशी संबंधित माहिती तपासा आणि अधिकृत करा."
          successTitle="HO Cash Withdrawal Entry Authorized Successfully"
          rejectedTitle="HO Cash Withdrawal Entry Authorization Rejected"
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

export default HoCashWithdrawalAuthorizePage;
