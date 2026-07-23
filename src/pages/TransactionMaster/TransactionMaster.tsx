import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import AddCashDeposit from "@/components/TransactionMaster/AddCashDeposit";
import AddCashWithdrawal from "@/components/TransactionMaster/AddCashWithdrawal";
import AddModifyTdsTransaction from "@/components/TransactionMaster/AddModifyTdsTransaction";
import AddNewPgTransactionExport from "@/components/TransactionMaster/AddNewPgTransactionExport";
import AddNewPgTransactionImport from "@/components/TransactionMaster/AddNewPgTransactionImport";
import AddRecurringInstallment from "@/components/TransactionMaster/AddRecurringInstallment";
import AddRtgs from "@/components/TransactionMaster/AddRtgs";
import AddTdInterestPayment from "@/components/TransactionMaster/AddTdInterestPayment";
import AddTdsTransaction from "@/components/TransactionMaster/AddTdsTransaction";
import AddTlCcInstallment from "@/components/TransactionMaster/AddTlCcInstallment";
import AddTransactionMaster from "@/components/TransactionMaster/AddTransactionMaster";
import TlOtherChargesForm from "@/components/TransactionMaster/TlOtherChargesForm";
import AddTransfer from "@/components/TransactionMaster/AddTransfer";
import { toast } from "react-toastify";
import TransactionTypeCard from "@/components/TransactionMaster/TransactionTypeCard";
import { TRANSACTION_TYPES, type TransactionTypeItem } from "@/components/TransactionMaster/transactionTypes";

/* ===== from CashDepositPage.tsx ===== */
export const CashDepositPage = () => {
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
        <AddCashDeposit onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};


/* ===== from CashWithdrawalPage.tsx ===== */
export const CashWithdrawalPage = () => {
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
        <AddCashWithdrawal onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};


/* ===== from ModifyTdsTransactionPage.tsx ===== */
export const ModifyTdsTransactionPage = () => {
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
        <AddModifyTdsTransaction onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};


/* ===== from NewPgTransactionExportPage.tsx ===== */
export const NewPgTransactionExportPage = () => {
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


/* ===== from NewPgTransactionImportPage.tsx ===== */
export const NewPgTransactionImportPage = () => {
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
        <AddNewPgTransactionImport onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};


/* ===== from RecurringInstallmentPage.tsx ===== */
export const RecurringInstallmentPage = () => {
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
        <AddRecurringInstallment onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};


/* ===== from RtgsPage.tsx ===== */
export const RtgsPage = () => {
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
        <AddRtgs onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};


/* ===== from TdInterestPaymentPage.tsx ===== */
export const TdInterestPaymentPage = () => {
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
        <AddTdInterestPayment onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};


/* ===== from TdsTransactionPage.tsx ===== */
export const TdsTransactionPage = () => {
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
        <AddTdsTransaction onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};


/* ===== from TlCcInstallmentPage.tsx ===== */
export const TlCcInstallmentPage = () => {
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


/* ===== from TlDisbursementPage.tsx ===== */
export const TlDisbursementPage = () => {
  const router = useRouter();

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

      <div className="px-3 py-4">
        <AddTransactionMaster onClose={() => router.back()} variant="page" />
      </div>
    </div>
  );
};


/* ===== from TlOtherChargesPage.tsx ===== */
export const TlOtherChargesPage = () => {
  const router = useRouter();

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

      <TlOtherChargesForm />
    </div>
  );
};


/* ===== from TransferPage.tsx ===== */
export const TransferPage = () => {
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


/* ===== from TransactionMasterPage.tsx ===== */
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
