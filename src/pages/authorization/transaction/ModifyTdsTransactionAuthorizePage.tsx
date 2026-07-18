import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import ModifyTdsTransactionAuthorizeTable, {
  MODIFY_TDS_TRANSACTION_TAB_COUNTS,
  type ModifyTdsTransactionAuthorizeRow,
} from "@/components/Authorization/Transaction/ModifyTdsTransactionAuthorizeTable";
import ModifyTdsTransactionFilterModal, {
  defaultModifyTdsTransactionFilters,
  type ModifyTdsTransactionFilters,
} from "@/components/Authorization/Transaction/ModifyTdsTransactionFilterModal";
import AuthorizeModifyTdsTransactionModal from "@/components/Authorization/Transaction/AuthorizeModifyTdsTransactionModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: MODIFY_TDS_TRANSACTION_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: MODIFY_TDS_TRANSACTION_TAB_COUNTS.rejected },
];

const ModifyTdsTransactionAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<ModifyTdsTransactionFilters>(defaultModifyTdsTransactionFilters);
  const [authorizeRow, setAuthorizeRow] = useState<ModifyTdsTransactionAuthorizeRow | null>(null);

  const handleAuthorize = (row: ModifyTdsTransactionAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultModifyTdsTransactionFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Modify TDS Transaction"
        titleHi="टीडीएस व्यवहार सुधारणे अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "Modify TDS Transaction", href: "#" },
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

        <ModifyTdsTransactionAuthorizeTable
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
            <ModifyTdsTransactionFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeModifyTdsTransactionModal
          open
          initialData={{
            accountCode: authorizeRow.accountCode,
            transactionAmount: authorizeRow.amount,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default ModifyTdsTransactionAuthorizePage;
