import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import AddTDClosingReinvest from "@/components/FutureModels/AddTDClosingReinvest";

const TDClosingReinvestPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn="TD Closing Reinvest"
        titleHi="टीडी क्लोजिंग रीइनवेस्ट"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Future Models", href: "/futuremodels" },
          { label: "TD Closing Reinvest", href: "/futuremodels/TDClosingReinvest" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="px-3 py-4">
        <AddTDClosingReinvest onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};

export default TDClosingReinvestPage;
