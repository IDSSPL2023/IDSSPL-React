// src/app/authorization/transaction/td-interest-payment-mark/page.tsx

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
// import TermDepositDetailModal from "@/components/Authorization/Transaction/TermDepositDetailModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";
import TermDepositDetailModal from "./TermDepositDetailsModal";

const TdInterestPaymentAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<TdInterestPaymentFilters>(defaultTdInterestPaymentFilters);
  const [authorizeRow, setAuthorizeRow] = useState<TdInterestPaymentAuthorizeRow | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "authorize" | "reject">("authorize");

  const handleAuthorize = (row: TdInterestPaymentAuthorizeRow) => {
    setAuthorizeRow(row);
    setModalMode("authorize");
  };

  const handleView = (row: TdInterestPaymentAuthorizeRow) => {
    setAuthorizeRow(row);
    setModalMode("view");
  };

  const closeAuthorizeModal = () => {
    setAuthorizeRow(null);
    setModalMode("authorize");
  };

  const handleResetFilters = () => setFilters(defaultTdInterestPaymentFilters);

  const handleAuthorizeSuccess = () => {
    // Handle successful authorization
    console.log("Authorization successful");
    closeAuthorizeModal();
    // You can add additional logic here like refreshing the table
  };

  const handleReject = (reason: string) => {
    // Handle rejection
    console.log("Rejected with reason:", reason);
    closeAuthorizeModal();
    // You can add additional logic here like refreshing the table
  };

  // Convert table row data to modal data format
  const getModalData = () => {
    if (!authorizeRow) return undefined;
    return {
      scrollNumber: authorizeRow.scrollNo,
      accountCode: authorizeRow.accountCode,
      accountName: authorizeRow.accountName,
      // Add other fields as needed
    };
  };

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="TD Interest Payment Authorize"
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
          onView={handleView} // If your table supports view action
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
        <TermDepositDetailModal
          open={!!authorizeRow}
          mode={modalMode}
          initialData={getModalData()}
          onClose={closeAuthorizeModal}
          onAuthorize={handleAuthorizeSuccess}
          onReject={handleReject}
          onEdit={() => {
            // Handle edit action - switch to edit mode or open edit modal
            console.log("Edit clicked");
            closeAuthorizeModal();
            // Navigate to edit page or open edit modal
          }}
        />
      )}
    </div>
  );
};

export default TdInterestPaymentAuthorizePage;