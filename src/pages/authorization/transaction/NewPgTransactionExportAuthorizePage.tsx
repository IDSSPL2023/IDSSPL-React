import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import NewPgTransactionExportAuthorizeTable, {
  NEW_PG_TRANSACTION_EXPORT_TAB_COUNTS,
  type NewPgTransactionExportAuthorizeRow,
} from "@/components/Authorization/Transaction/NewPgTransactionExportAuthorizeTable";
import NewPgTransactionExportFilterModal, {
  defaultNewPgTransactionExportFilters,
  type NewPgTransactionExportFilters,
} from "@/components/Authorization/Transaction/NewPgTransactionExportFilterModal";
import AuthorizeNewPgTransactionExportModal from "@/components/Authorization/Transaction/AuthorizeNewPgTransactionExportModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: NEW_PG_TRANSACTION_EXPORT_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: NEW_PG_TRANSACTION_EXPORT_TAB_COUNTS.rejected },
];

const NewPgTransactionExportAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<NewPgTransactionExportFilters>(defaultNewPgTransactionExportFilters);
  const [authorizeRow, setAuthorizeRow] = useState<NewPgTransactionExportAuthorizeRow | null>(null);

  const handleAuthorize = (row: NewPgTransactionExportAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultNewPgTransactionExportFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="New PG Transaction Export"
        titleHi="नवीन पीजी व्यवहार निर्यात अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "New PG Transaction Export", href: "#" },
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

        <NewPgTransactionExportAuthorizeTable
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
            <NewPgTransactionExportFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeNewPgTransactionExportModal
          open
          initialData={{
            branchCode: authorizeRow.branchCode,
            productCode: authorizeRow.productCode,
            agentId: authorizeRow.agentId,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default NewPgTransactionExportAuthorizePage;
