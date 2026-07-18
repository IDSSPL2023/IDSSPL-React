import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import AddInvestmentAccountClose from "@/components/Authorization/Account/AddInvestmentAccountClose";
import { useBilingual } from "@/i18n/useBilingual";

const AccountClosingInvestmentPage = () => {
  const { en } = useBilingual();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn="Investment Closing"
        titleHi="गुंतवणूक बंद करा"
        breadcrumbs={[
          { label: en("common.home"), href: "/dashboard" },
          { label: en("sidebar.clerk"), href: "#" },
          { label: en("sidebar.accountClosing"), href: "/account-closing" },
          { label: "Investment", href: "/account-closing/investment" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="px-3 py-4">
        <AddInvestmentAccountClose onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};

export default AccountClosingInvestmentPage;
