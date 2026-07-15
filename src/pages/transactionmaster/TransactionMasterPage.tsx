import { useRouter } from "@/lib/navigation";
import { toast } from "react-toastify";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import TransactionTypeCard from "@/components/TransactionMaster/TransactionTypeCard";
import { TRANSACTION_TYPES, type TransactionTypeItem } from "@/components/TransactionMaster/transactionTypes";

const TransactionMasterPage = () => {
  const router = useRouter();

  const handleOpen = (item: TransactionTypeItem) => {
    if (item.href) {
      router.push(item.href);
    } else {
      toast.info(`${item.titleEn} will be implemented.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] dark:bg-slate-950">
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

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        {TRANSACTION_TYPES.map((item) => (
          <TransactionTypeCard key={item.id} item={item} onOpen={handleOpen} />
        ))}
      </div>
    </div>
  );
};

export default TransactionMasterPage;
