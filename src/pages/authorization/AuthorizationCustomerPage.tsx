import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import NavbarCA from "@/components/Authorization/NavbarCA";
import CustomerAuthorizationTable, {
  type AuthTab,
  type RowData,
  TAB_COUNTS,
} from "@/components/Authorization/CustomerAuthorizationTable";
import CustomerAuthorizationModal from "@/components/Authorization/CustomerAuthorizationModal";
import FilterModal, { type CustomerFilters, defaultValues } from "@/components/CustomerMaster/FilterModal";
import { useBilingual } from "@/i18n/useBilingual";
import SuccessModal from "@/components/shared/SuccessModal";

const AuthorizationCustomerPage = () => {
  const { t, en } = useBilingual();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthTab>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>(defaultValues);

  const [authRow, setAuthRow] = useState<RowData | null>(null);
  const [resultModal, setResultModal] = useState<"authorized" | "rejected" | null>(null);

  const handleView = (row: RowData) => {
    console.log("view", row);
  };

  const handleAuthorize = (row: RowData) => {
    setAuthRow(row);
  };

  const handleAuthorized = () => {
    setAuthRow(null);
    setResultModal("authorized");
  };

  const handleRejected = () => {
    setAuthRow(null);
    setResultModal("rejected");
  };

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar">
      <NavbarCA
        titleEn={en("authorization.title")}
        titleHi={t("authorization.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("authorization.breadcrumb"), href: "/authorization" },
          { label: en("authorization.customerAuthorization.breadcrumb"), href: "#" },
        ]}
        onBack={() => router.back()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabCounts={TAB_COUNTS}
        onOpenFilter={() => setIsFilterOpen(true)}
      />

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        <CustomerAuthorizationTable
          activeTab={activeTab}
          filters={filters}
          onView={handleView}
          onAuthorize={handleAuthorize}
        />
      </div>

      {authRow && (
        <CustomerAuthorizationModal
          row={authRow}
          onClose={() => setAuthRow(null)}
          onAuthorized={handleAuthorized}
          onRejected={handleRejected}
        />
      )}

      {resultModal === "authorized" && (
        <SuccessModal
          title="Customer Authorized Successfully"
          subtitle=""
          onClose={() => setResultModal(null)}
          onDone={() => setResultModal(null)}
          variant="success"
        />
      )}

      {resultModal === "rejected" && (
        <SuccessModal
          title="Customer Rejected Successfully"
          subtitle=""
          onClose={() => setResultModal(null)}
          onDone={() => setResultModal(null)}
          variant="critical"
        />
      )}
    </div>
  );
};

export default AuthorizationCustomerPage;