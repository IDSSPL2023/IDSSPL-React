import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import NewPgTransactionImportAuthorizeTable, {
  NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS,
  type NewPgTransactionImportAuthorizeRow,
} from "@/components/Authorization/Transaction/NewPgTransactionImportAuthorizeTable";
import NewPgTransactionImportFilterModal, {
  defaultNewPgTransactionImportFilters,
  type NewPgTransactionImportFilters,
} from "@/components/Authorization/Transaction/NewPgTransactionImportFilterModal";
import AuthorizeNewPgTransactionImportModal from "@/components/Authorization/Transaction/AuthorizeNewPgTransactionImportModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS.rejected },
];

const NewPgTransactionImportAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<NewPgTransactionImportFilters>(defaultNewPgTransactionImportFilters);
  const [authorizeRow, setAuthorizeRow] = useState<NewPgTransactionImportAuthorizeRow | null>(null);

  const handleAuthorize = (row: NewPgTransactionImportAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultNewPgTransactionImportFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="New PG Transaction Import"
        titleHi="नवीन पीजी व्यवहार आयात अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "New PG Transaction Import", href: "#" },
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

        <NewPgTransactionImportAuthorizeTable
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
            <NewPgTransactionImportFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeNewPgTransactionImportModal
          open
          initialData={{
            branchCode: authorizeRow.branchCode,
            adviceNo: authorizeRow.adviceNo,
            totalAmount: authorizeRow.totalAmount,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default NewPgTransactionImportAuthorizePage;
