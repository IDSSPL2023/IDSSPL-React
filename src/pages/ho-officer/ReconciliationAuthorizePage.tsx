import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import ReconciliationAuthorizeTable, {
  RECONCILIATION_TAB_COUNTS,
  type ReconciliationAuthorizeRow,
} from "@/components/HoOfficer/Transaction/ReconciliationAuthorizeTable";
import ReconciliationFilterModal, {
  defaultReconciliationFilters,
  type ReconciliationFilters,
} from "@/components/HoOfficer/Transaction/ReconciliationFilterModal";
import AuthorizeReconciliationModal from "@/components/HoOfficer/Transaction/AuthorizeReconciliationModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: RECONCILIATION_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: RECONCILIATION_TAB_COUNTS.rejected },
];

const ReconciliationAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<ReconciliationFilters>(defaultReconciliationFilters);
  const [authorizeRow, setAuthorizeRow] = useState<ReconciliationAuthorizeRow | null>(null);

  const handleAuthorize = (row: ReconciliationAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultReconciliationFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Reconciliation Authorize"
        titleHi="समायोजन अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "Reconciliation Authorize", href: "#" },
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

        <ReconciliationAuthorizeTable
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
            <ReconciliationFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeReconciliationModal
          open
          initialData={{
            adviceNo: authorizeRow.adviceNo,
            branchName: authorizeRow.branchName,
            reconciliationCode: authorizeRow.reconciliationCode,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default ReconciliationAuthorizePage;
