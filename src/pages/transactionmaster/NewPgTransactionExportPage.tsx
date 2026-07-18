import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import AddNewPgTransactionExport from "@/components/TransactionMaster/AddNewPgTransactionExport";

const NewPgTransactionExportPage = () => {
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
        <AddNewPgTransactionExport onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};

export default NewPgTransactionExportPage;
