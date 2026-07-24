import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import AddInvestmentAccountClose from "@/components/Authorization/Account/AddInvestmentAccountClose";

const InvestmentAccountClosePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen app-page-bg">
      <NavbarCM
        titleEn="Investment Account Close"
        titleHi="गुंतवणूक खाते बंद"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Future Models", href: "/futuremodels" },
          { label: "Investment Account Close", href: "/futuremodels/investment-account-close" },
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

export default InvestmentAccountClosePage;
