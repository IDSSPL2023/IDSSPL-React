import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import HoCashWithdrawalAuthorizeTable, {
  HO_CASH_WITHDRAWAL_TAB_COUNTS,
  type HoCashWithdrawalAuthorizeRow,
} from "@/components/HoOfficer/Transaction/HoCashWithdrawalAuthorizeTable";
import HoCashWithdrawalFilterModal, {
  defaultHoCashWithdrawalFilters,
  type HoCashWithdrawalFilters,
} from "@/components/HoOfficer/Transaction/HoCashWithdrawalFilterModal";
import AuthorizeCashWithdrawalModal from "@/components/Authorization/Transaction/AuthorizeCashWithdrawalModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: HO_CASH_WITHDRAWAL_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: HO_CASH_WITHDRAWAL_TAB_COUNTS.rejected },
];

const HoCashWithdrawalAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<HoCashWithdrawalFilters>(defaultHoCashWithdrawalFilters);
  const [authorizeRow, setAuthorizeRow] = useState<HoCashWithdrawalAuthorizeRow | null>(null);

  const handleAuthorize = (row: HoCashWithdrawalAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultHoCashWithdrawalFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="HO Cash Withdrawal Entry Authorize"
        titleHi="HO रोख पैसे काढणे नोंद अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "HO Cash Withdrawal Entry Authorize", href: "#" },
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

        <HoCashWithdrawalAuthorizeTable
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
            <HoCashWithdrawalFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeCashWithdrawalModal
          open
          titleEn="Authorize HO Cash Withdrawal Entry"
          titleHi="HO रोख पैसे काढणे नोंद अधिकृत करा"
          subtitleEn="Check information related to the HO cash withdrawal entry and authorize it."
          subtitleHi="HO रोख पैसे काढणे नोंदीशी संबंधित माहिती तपासा आणि अधिकृत करा."
          successTitle="HO Cash Withdrawal Entry Authorized Successfully"
          rejectedTitle="HO Cash Withdrawal Entry Authorization Rejected"
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

export default HoCashWithdrawalAuthorizePage;
