import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import CASAClosingModal, { type CasaClosingFormData } from "@/components/futuremodels/CASAClosing";
import { useBilingual } from "@/i18n/useBilingual";

const AccountClosingCaSaPage = () => {
  const { en } = useBilingual();
  const router = useRouter();

  const handleCloseSubmit = (data: CasaClosingFormData) => {
    window.alert(`CASA account closed for account ${data.accountCode || "-"}.`);
  };

  return (
    <div className="min-h-screen app-page-bg">
      <NavbarCM
        titleEn="CA/SA Closing"
        titleHi="खाते बंद करा"
        breadcrumbs={[
          { label: en("common.home"), href: "/dashboard" },
          { label: en("sidebar.clerk"), href: "#" },
          { label: en("sidebar.accountClosing"), href: "/account-closing" },
          { label: "CA/SA", href: "/account-closing/ca-sa" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="px-3 py-4">
        <CASAClosingModal
          open
          onClose={() => router.back()}
          onSubmit={handleCloseSubmit}
        />
      </div>
    </div>
  );
};

export default AccountClosingCaSaPage;
