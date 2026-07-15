import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import TdInterestPaymentAuthorizeTable, {
  type TdInterestPaymentAuthorizeRow,
} from "@/components/Authorization/Transaction/TdInterestPaymentAuthorizeTable";
import TdInterestPaymentFilterModal, {
  defaultTdInterestPaymentFilters,
  type TdInterestPaymentFilters,
} from "@/components/Authorization/Transaction/TdInterestPaymentFilterModal";
import AuthorizeTdInterestPaymentModal from "@/components/Authorization/Transaction/AuthorizeTdInterestPaymentModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const TdInterestPaymentAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<TdInterestPaymentFilters>(defaultTdInterestPaymentFilters);
  const [authorizeRow, setAuthorizeRow] = useState<TdInterestPaymentAuthorizeRow | null>(null);

  const handleAuthorize = (row: TdInterestPaymentAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultTdInterestPaymentFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="TD Interest Payment Mark Authorize"
        titleHi="मुदत ठेव व्याज भुगतान चिन्हांकित"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "TD Interest Payment Authorize", href: "#" },
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

        <TdInterestPaymentAuthorizeTable
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
            <TdInterestPaymentFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeTdInterestPaymentModal
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

export default TdInterestPaymentAuthorizePage;
