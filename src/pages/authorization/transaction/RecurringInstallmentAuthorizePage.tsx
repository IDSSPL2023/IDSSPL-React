import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import RecurringInstallmentAuthorizeTable, {
  type RecurringInstallmentAuthorizeRow,
} from "@/components/Authorization/Transaction/RecurringInstallmentAuthorizeTable";
import RecurringInstallmentFilterModal, {
  defaultRecurringInstallmentFilters,
  type RecurringInstallmentFilters,
} from "@/components/Authorization/Transaction/RecurringInstallmentFilterModal";
import AuthorizeRecurringInstallmentModal from "@/components/Authorization/Transaction/AuthorizeRecurringInstallmentModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const RecurringInstallmentAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<RecurringInstallmentFilters>(defaultRecurringInstallmentFilters);
  const [authorizeRow, setAuthorizeRow] = useState<RecurringInstallmentAuthorizeRow | null>(null);

  const handleAuthorize = (row: RecurringInstallmentAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultRecurringInstallmentFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Recurring Installment Authorize"
        titleHi="आवर्ती हप्ता अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "Recurring Installment Authorize", href: "#" },
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

        <RecurringInstallmentAuthorizeTable
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
            <RecurringInstallmentFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeRecurringInstallmentModal
          open
          initialData={{
            scrollNumber: authorizeRow.scrollNo,
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default RecurringInstallmentAuthorizePage;
