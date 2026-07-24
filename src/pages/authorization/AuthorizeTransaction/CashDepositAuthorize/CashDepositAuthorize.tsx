import { useState } from "react";
import { ShieldCheck, Hash, User } from "lucide-react";
import { AuthorizeTable, AppNavbar, FilterModal } from "@/components/common";
import type { ColumnDef, TableAction, FilterFieldDef } from "@/components/common";
import { useRouter } from "@/lib/navigation";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";
/** Shared with the HO-Officer Cash Deposit authorize flow — kept standalone, not inlined. */
import AuthorizeCashDepositModal from "@/components/Authorization/Transaction/AuthorizeCashDepositModal";

/* ===== from CashDepositAuthorizeTable.tsx ===== */
export type CashDepositAuthorizeTable_CashDepositAuthorizeTab = "new" | "rejected";

export type CashDepositAuthorizeTable_CashDepositAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  createdBy: string;
  createdDate: string;
  tab: CashDepositAuthorizeTable_CashDepositAuthorizeTab;
};

const CashDepositAuthorizeTable_columns: ColumnDef<CashDepositAuthorizeTable_CashDepositAuthorizeRow>[] = [
  { key: "scrollNo", header: "Scroll No", sortable: true, width: "160px" },
  { key: "accountCode", header: "Account Code", sortable: true, width: "180px" },
  { key: "accountName", header: "Account Name", sortable: true, width: "220px" },
  { key: "amount", header: "Amount", sortable: true, width: "150px" },
  { key: "createdBy", header: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", header: "Created Date", sortable: true, width: "160px" },
];

const CashDepositAuthorizeTable_SAMPLE_DEPOSITS: Omit<CashDepositAuthorizeTable_CashDepositAuthorizeRow, "srNo" | "tab">[] = [
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

const CashDepositAuthorizeTable_buildRows = (tab: CashDepositAuthorizeTable_CashDepositAuthorizeTab, count: number): CashDepositAuthorizeTable_CashDepositAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...CashDepositAuthorizeTable_SAMPLE_DEPOSITS[i % CashDepositAuthorizeTable_SAMPLE_DEPOSITS.length],
    scrollNo: String(118 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const CashDepositAuthorizeTable_CASH_DEPOSIT_TAB_COUNTS: Record<CashDepositAuthorizeTable_CashDepositAuthorizeTab, number> = {
  new: 20,
  rejected: 18,
};

const CashDepositAuthorizeTable_ALL_ROWS: CashDepositAuthorizeTable_CashDepositAuthorizeRow[] = [
  ...CashDepositAuthorizeTable_buildRows("new", CashDepositAuthorizeTable_CASH_DEPOSIT_TAB_COUNTS.new),
  ...CashDepositAuthorizeTable_buildRows("rejected", CashDepositAuthorizeTable_CASH_DEPOSIT_TAB_COUNTS.rejected),
];

const CashDepositAuthorizeTable_PAGE_SIZE = 15;

type CashDepositAuthorizeTable_SortKey = (typeof CashDepositAuthorizeTable_columns)[number]["key"];

type CashDepositAuthorizeTable_CashDepositAuthorizeTableProps = {
  activeTab: CashDepositAuthorizeTable_CashDepositAuthorizeTab;
  onTabChange?: (tab: CashDepositAuthorizeTable_CashDepositAuthorizeTab) => void;
  filters?: CashDepositFilterModal_CashDepositFilters;
  onAuthorize?: (row: CashDepositAuthorizeTable_CashDepositAuthorizeRow) => void;
  onOpenFilter?: () => void;
  hasActiveFilters?: boolean;
  activeFilterSummary?: string;
  onResetFilters?: () => void;
};

const CashDepositAuthorizeTable = ({
  activeTab,
  onTabChange,
  filters,
  onAuthorize,
  onOpenFilter,
  hasActiveFilters,
  activeFilterSummary,
  onResetFilters,
}: CashDepositAuthorizeTable_CashDepositAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<CashDepositAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key as CashDepositAuthorizeTable_SortKey);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = CashDepositAuthorizeTable_ALL_ROWS.filter((r) => {
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.accountName && !r.accountName.toLowerCase().includes(filters.accountName.toLowerCase())) return false;
    if (filters.accountCode && !r.accountCode.toLowerCase().includes(filters.accountCode.toLowerCase())) return false;
    if (filters.scrollNo && !r.scrollNo.toLowerCase().includes(filters.scrollNo.toLowerCase())) return false;
    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey as keyof CashDepositAuthorizeTable_CashDepositAuthorizeRow];
    const valB = b[sortKey as keyof CashDepositAuthorizeTable_CashDepositAuthorizeRow];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / CashDepositAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * CashDepositAuthorizeTable_PAGE_SIZE, currentPage * CashDepositAuthorizeTable_PAGE_SIZE);

  const actions: TableAction<CashDepositAuthorizeTable_CashDepositAuthorizeRow>[] = [
    { key: "authorize", label: "Authorize", icon: ShieldCheck, onClick: (row) => onAuthorize?.(row) },
  ];

  return (
    <AuthorizeTable<CashDepositAuthorizeTable_CashDepositAuthorizeRow>
      tabs={[
        { key: "new", label: "New Authorization", count: CashDepositAuthorizeTable_CASH_DEPOSIT_TAB_COUNTS.new },
        { key: "rejected", label: "Authorize Rejected", count: CashDepositAuthorizeTable_CASH_DEPOSIT_TAB_COUNTS.rejected },
      ]}
      activeTab={activeTab}
      onTabChange={(key) => onTabChange?.(key as CashDepositAuthorizeTable_CashDepositAuthorizeTab)}
      onOpenFilter={onOpenFilter}
      hasActiveFilters={hasActiveFilters}
      activeFilterSummary={activeFilterSummary}
      onResetFilters={onResetFilters}
      columns={CashDepositAuthorizeTable_columns}
      rows={pageRows}
      rowKey={(row) => `${row.tab}-${row.srNo}`}
      actions={actions}
      sortKey={sortKey}
      sortDirection={sortAsc ? "asc" : "desc"}
      onSortChange={handleSort}
      pagination={{ page: currentPage, totalPages, onPageChange: setPage }}
      minWidth="1200px"
    />
  );
};


/* ===== from CashDepositFilterModal.tsx ===== */
type CashDepositFilterModal_FilterKey = "accountName" | "accountCode" | "scrollNo";

export type CashDepositFilterModal_CashDepositFilters = Record<CashDepositFilterModal_FilterKey, string>;

export const CashDepositFilterModal_defaultCashDepositFilters: CashDepositFilterModal_CashDepositFilters = {
  accountName: "",
  accountCode: "",
  scrollNo: "",
};

/** Field config consumed by the common `FilterModal` — first migration target per the refactor spec. */
export const CashDepositFilterModal_cashDepositFilterFields: FilterFieldDef[] = [
  {
    id: "accountName",
    label: "Account Name",
    type: "text",
    placeholder: "Account Name",
    icon: <User size={18} className="text-primary" />,
  },
  {
    id: "accountCode",
    label: "Account Code",
    type: "text",
    placeholder: "Account Code",
    icon: <Hash size={18} className="text-primary" />,
  },
  {
    id: "scrollNo",
    label: "Scroll No",
    type: "text",
    placeholder: "Scroll No",
    icon: <Hash size={18} className="text-primary" />,
  },
];


/* ===== from CashDepositAuthorizePage.tsx ===== */
const CashDepositAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CashDepositAuthorizeTable_CashDepositAuthorizeTab>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<CashDepositFilterModal_CashDepositFilters>(CashDepositFilterModal_defaultCashDepositFilters);
  const [authorizeRow, setAuthorizeRow] = useState<CashDepositAuthorizeTable_CashDepositAuthorizeRow | null>(null);

  const handleAuthorize = (row: CashDepositAuthorizeTable_CashDepositAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(CashDepositFilterModal_defaultCashDepositFilters);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <AppNavbar
        titleEn="Cash Deposit Authorize"
        titleHi="रोख जमा अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "Cash Deposit Authorize", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-3 px-3 py-3">
        <CashDepositAuthorizeTable
          activeTab={activeTab}
          onTabChange={setActiveTab}
          filters={filters}
          onAuthorize={handleAuthorize}
          onOpenFilter={() => setIsFilterOpen(true)}
          hasActiveFilters={hasActiveFilters(filters)}
          activeFilterSummary={getActiveFilterSummary(filters)}
          onResetFilters={handleResetFilters}
        />
      </div>

      {isFilterOpen && (
        <FilterModal
          fields={CashDepositFilterModal_cashDepositFilterFields}
          initialValues={filters}
          onClose={() => setIsFilterOpen(false)}
          onApply={(vals) => setFilters(vals as CashDepositFilterModal_CashDepositFilters)}
        />
      )}

      {authorizeRow && (
        <AuthorizeCashDepositModal
          open
          initialData={{
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

export default CashDepositAuthorizePage;
