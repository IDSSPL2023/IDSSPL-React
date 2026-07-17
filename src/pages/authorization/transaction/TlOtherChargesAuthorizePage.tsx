import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import TlOtherChargesAuthorizeTable, {
  TL_OTHER_CHARGES_TAB_COUNTS,
  type TlOtherChargesAuthorizeRow,
} from "@/components/Authorization/Transaction/TlOtherChargesAuthorizeTable";
import TlOtherChargesFilterModal, {
  defaultTlOtherChargesFilters,
  type TlOtherChargesFilters,
} from "@/components/Authorization/Transaction/TlOtherChargesFilterModal";
import AuthorizeTlOtherChargesModal from "@/components/Authorization/Transaction/AuthorizeTlOtherChargesModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: TL_OTHER_CHARGES_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: TL_OTHER_CHARGES_TAB_COUNTS.rejected },
];

const TlOtherChargesAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<TlOtherChargesFilters>(defaultTlOtherChargesFilters);
  const [authorizeRow, setAuthorizeRow] = useState<TlOtherChargesAuthorizeRow | null>(null);

  const handleAuthorize = (row: TlOtherChargesAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultTlOtherChargesFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="TL Other Charges Authorize"
        titleHi="टीएल इतर शुल्क मंजूर करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "TL Other Charges Authorize", href: "#" },
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

        <TlOtherChargesAuthorizeTable
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
            <TlOtherChargesFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeTlOtherChargesModal
          open
          initialData={{
            scrollNumber: authorizeRow.scrollNo,
            accountCode: authorizeRow.accountCode,
            amount: authorizeRow.amount,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default TlOtherChargesAuthorizePage;