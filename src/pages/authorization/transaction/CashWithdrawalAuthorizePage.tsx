import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import CashWithdrawalAuthorizeTable, {
  type CashWithdrawalAuthorizeRow,
} from "@/components/Authorization/Transaction/CashWithdrawalAuthorizeTable";
import CashWithdrawalFilterModal, {
  defaultCashWithdrawalFilters,
  type CashWithdrawalFilters,
} from "@/components/Authorization/Transaction/CashWithdrawalFilterModal";
import AuthorizeCashWithdrawalModal from "@/components/Authorization/Transaction/AuthorizeCashWithdrawalModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const CashWithdrawalAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<CashWithdrawalFilters>(defaultCashWithdrawalFilters);
  const [authorizeRow, setAuthorizeRow] = useState<CashWithdrawalAuthorizeRow | null>(null);

  const handleAuthorize = (row: CashWithdrawalAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultCashWithdrawalFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Cash Withdrawal Authorize"
        titleHi="रोख रक्कम काढण्याची परवानगी"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "Cash Withdrawal Authorize", href: "#" },
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

        <CashWithdrawalAuthorizeTable
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
            <CashWithdrawalFilterModal
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
          initialData={{
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
            particular: authorizeRow.particular,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default CashWithdrawalAuthorizePage;
