import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import AddInvestmentAccountMaster from "@/components/futuremodels/AddInvestmentAccountMaster";

const InvestmentAccountPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn="Investment Account"
        titleHi="गुंतवणूक खाते"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Future Models", href: "/futuremodels" },
          { label: "Investment Account", href: "/futuremodels/investment-account" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="px-3 py-4">
        <AddInvestmentAccountMaster onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};

export default InvestmentAccountPage;
