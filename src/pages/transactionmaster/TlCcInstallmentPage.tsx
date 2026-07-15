import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import AddTlCcInstallment from "@/components/TransactionMaster/AddTlCcInstallment";

const TlCcInstallmentPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F6FC] dark:bg-slate-950">
      <NavbarCM
        titleEn="TL/CC Installment"
        titleHi="TL/CC हप्ता"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Clerk", href: "#" },
          { label: "Transaction", href: "/transactionmaster" },
          { label: "TL/CC Installment", href: "/transactionmaster/tl-cc-installment" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="px-3 py-4">
        <AddTlCcInstallment onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};

export default TlCcInstallmentPage;
