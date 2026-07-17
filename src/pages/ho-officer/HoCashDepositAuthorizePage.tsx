import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import HoCashDepositAuthorizeTable, {
  HO_CASH_DEPOSIT_TAB_COUNTS,
  type HoCashDepositAuthorizeRow,
} from "@/components/HoOfficer/Transaction/HoCashDepositAuthorizeTable";
import HoCashDepositFilterModal, {
  defaultHoCashDepositFilters,
  type HoCashDepositFilters,
} from "@/components/HoOfficer/Transaction/HoCashDepositFilterModal";
import AuthorizeCashDepositModal from "@/components/Authorization/Transaction/AuthorizeCashDepositModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: HO_CASH_DEPOSIT_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: HO_CASH_DEPOSIT_TAB_COUNTS.rejected },
];

const HoCashDepositAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<HoCashDepositFilters>(defaultHoCashDepositFilters);
  const [authorizeRow, setAuthorizeRow] = useState<HoCashDepositAuthorizeRow | null>(null);

  const handleAuthorize = (row: HoCashDepositAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultHoCashDepositFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="HO Cash Deposit Entry Authorize"
        titleHi="HO रोख जमा नोंद अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "HO Cash Deposit Entry Authorize", href: "#" },
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

        <HoCashDepositAuthorizeTable
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
            <HoCashDepositFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeCashDepositModal
          open
          titleEn="Authorize HO Cash Deposit Entry"
          titleHi="HO रोख जमा नोंद अधिकृत करा"
          subtitleEn="Check information related to the HO cash deposit entry and authorize it."
          subtitleHi="HO रोख जमा नोंदीशी संबंधित माहिती तपासा आणि अधिकृत करा."
          successTitle="HO Cash Deposit Entry Authorized Successfully"
          rejectedTitle="HO Cash Deposit Entry Authorization Rejected"
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

export default HoCashDepositAuthorizePage;
