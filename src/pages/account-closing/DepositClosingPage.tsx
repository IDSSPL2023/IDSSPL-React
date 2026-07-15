import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import DepositCloseModal, { type DepositCloseFormData } from "@/components/AccountMaster/DepositClose";
import { useBilingual } from "@/i18n/useBilingual";

const DepositClosingPage = () => {
  const { en } = useBilingual();
  const router = useRouter();

  const handleCloseSubmit = (data: DepositCloseFormData) => {
    window.alert(`Term deposit closed for account ${data.accountCode || "-"}.`);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn="Deposit Closing"
        titleHi="ठेव बंद करा"
        breadcrumbs={[
          { label: en("common.home"), href: "/dashboard" },
          { label: en("sidebar.clerk"), href: "#" },
          { label: en("sidebar.accountClosing"), href: "/account-closing" },
          { label: "Deposit", href: "/account-closing/deposit" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="px-3 py-4">
        <DepositCloseModal
          open
          variant="page"
          onClose={() => router.back()}
          onSubmit={handleCloseSubmit}
        />
      </div>
    </div>
  );
};

export default DepositClosingPage;
