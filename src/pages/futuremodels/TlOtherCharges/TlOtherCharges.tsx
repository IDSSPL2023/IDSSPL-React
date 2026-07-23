import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import TlOtherChargesForm from "@/components/TransactionMaster/TlOtherChargesForm";

const TLOtherChargesPage = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen app-page-bg dark:bg-slate-950">
      <GlobalNav
        titleEn="TL Other Charges"
        titleHi="मुदत कर्जाचे इतर शुल्क / इतर आकार"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Clerk", href: "/clerk" },
          { label: "Transaction", href: "/clerk/transaction" },
        ]}
        onBack={handleBack}
      />

      <TlOtherChargesForm />
    </div>
  );
};

export default TLOtherChargesPage;
