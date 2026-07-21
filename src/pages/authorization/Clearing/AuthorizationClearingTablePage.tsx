import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import NavbarCA from "@/components/Authorization/NavbarCA";
import CustomerAuthorizationTable, {
  type AuthTab,
  type RowData,
  TAB_COUNTS,
} from "@/components/Authorization/CustomerAuthorizationTable";
import FilterModal, {
  type CustomerFilters,
  defaultValues,
} from "@/components/CustomerMaster/FilterModal";
import { useBilingual } from "@/i18n/useBilingual";
import SuccessModal from "@/components/shared/SuccessModal";
import { useParams } from "react-router-dom";
import ClearingFormModal from "@/components/Clerk/Clearing/ClearingFormModal";

const AuthorizationClearingPage = () => {
  const { t, en } = useBilingual();
  const router = useRouter();
  const { clearingTypes } = useParams();
  console.log(clearingTypes);

  const [activeTab, setActiveTab] = useState<AuthTab>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>(defaultValues);

  const [authModalType, setAuthModalType] = useState<string | null>(null);
  const [resultModal, setResultModal] = useState<
    "authorized" | "rejected" | null
  >(null);

  const handleView = (row: RowData) => {
    console.log("view", row);
  };

  const openAuthModal = () => {
    clearingTypes && setAuthModalType(clearingTypes);
  };

  const handleAuthorized = () => {
    setAuthModalType(null);
    setResultModal("authorized");
  };

  const handleRejected = () => {
    setAuthModalType(null);
    setResultModal("rejected");
  };

  const onClose = () => {
    setAuthModalType(null);
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
          {
            label: en("authorization.clearingAuthorization.breadcrumb"),
            href: "#",
          },
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
          onAuthorize={openAuthModal}
        />
      </div>

      {authModalType && (
        <ClearingFormModal
          masterKey={authModalType}
          mode="authorize"
          onClose={onClose}
        />
      )}
      {resultModal === "authorized" && (
        <SuccessModal
          title="Clearing Authorized Successfully"
          subtitle=""
          onClose={onClose}
          onDone={handleAuthorized}
          variant="success"
        />
      )}

      {resultModal === "rejected" && (
        <SuccessModal
          title="Clearing Rejected Successfully"
          subtitle=""
          onClose={onClose}
          onDone={handleRejected}
          variant="critical"
        />
      )}
    </div>
  );
};

export default AuthorizationClearingPage;
