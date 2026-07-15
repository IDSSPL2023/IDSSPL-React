import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import AddTransfer from "@/components/TransactionMaster/AddTransfer";

const TransferPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn="Transaction"
        titleHi="अधिकृतीकरण"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Clerk", href: "#" },
          { label: "Transaction", href: "/transactionmaster" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="px-3 py-4">
        <AddTransfer onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};

export default TransferPage;
