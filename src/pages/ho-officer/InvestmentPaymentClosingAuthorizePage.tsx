import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import InvestmentPaymentClosingAuthorizeTable, {
  INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS,
  type InvestmentPaymentClosingAuthorizeRow,
} from "@/components/HoOfficer/Transaction/InvestmentPaymentClosingAuthorizeTable";
import InvestmentPaymentClosingFilterModal, {
  defaultInvestmentPaymentClosingFilters,
  type InvestmentPaymentClosingFilters,
} from "@/components/HoOfficer/Transaction/InvestmentPaymentClosingFilterModal";
import AuthorizeInvestmentPaymentClosingModal from "@/components/HoOfficer/Transaction/AuthorizeInvestmentPaymentClosingModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS.rejected },
];

const InvestmentPaymentClosingAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<InvestmentPaymentClosingFilters>(defaultInvestmentPaymentClosingFilters);
  const [authorizeRow, setAuthorizeRow] = useState<InvestmentPaymentClosingAuthorizeRow | null>(null);

  const handleAuthorize = (row: InvestmentPaymentClosingAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultInvestmentPaymentClosingFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Investment Payment ClosingMark Authorize"
        titleHi="गुंतवणूक पेमेंट क्लोजिंगमार्क अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "Investment Payment ClosingMark Authorize", href: "#" },
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

        <InvestmentPaymentClosingAuthorizeTable
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
            <InvestmentPaymentClosingFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeInvestmentPaymentClosingModal
          open
          initialData={{
            scrollNumber: authorizeRow.scrollNo,
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
            maturityValue: authorizeRow.maturityValue,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default InvestmentPaymentClosingAuthorizePage;
