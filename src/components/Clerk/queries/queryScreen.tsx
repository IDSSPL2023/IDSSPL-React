import { IMAGES } from "@/assets";
import { useState, useMemo } from "react";
import {
  User,
  Calendar,
  X,
  Check,
  ChevronsDown,
  FileText,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  CreditCard,
  List,
  Scroll,
  Search,
} from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  SectionCard,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import { useRouter } from "@/lib/navigation";
import { AppNavbar, WelcomeScreen } from "@/components/common";
import type { WelcomeScreenItem } from "@/components/common";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import TransactionList from "./TransactionList";
import GLTransactionSummary from "./GLTransactionSummary";
import MaturityAmountModal from "./MaturityAmountModal";
import LoanOverdueBalance from "./LoanOverdueBalance";
import DisplayScrollDetailsModal from "./DisplayScrollDetailsModal";
import GeneralLedgerDetails from "./GeneralLedgerDetails";
import InstallmentCalculation from "./InstallmentCalculation";


/* ===== from QueriesScreen.tsx ===== */
type QueriesItem = {
  id: string;
  title: string;
  hindiTitle: string;
  icon: string;
};

const QUERIES_ITEMS: QueriesItem[] = [
  {
    id: "transaction-summary",
    title: "GL Transaction Summary",
    hindiTitle: "जीएल लेन-देन सारांश",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "transaction-list",
    title: "Transaction List",
    hindiTitle: "लेन-देन की सूची",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "installment-calculation",
    title: "Installment Calculation",
    hindiTitle: "किस्त गणना",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  
  {
    id: "maturity-amount-query",
    title: "Maturity Amount Query",
    hindiTitle: "परिपक्वता राशि जांच",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "loan-overdue-balance",
    title: "Loan Overdue Balance",
    hindiTitle: "ऋण बकाया शेष",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "display-scroll-details",
    title: "Display Scroll Details",
    hindiTitle: "स्क्रॉल विवरण प्रदर्शित करें",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "general-ledger-details",
    title: "General Ledger Details",
    hindiTitle: "सामान्य खाता बही विवरण",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
];

export default function QueriesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return QUERIES_ITEMS;
    return QUERIES_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.hindiTitle.toLowerCase().includes(q),
    );
  }, [query]);

  const handleOpen = (id: string) => {
    setActiveModal(id);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const welcomeItems: WelcomeScreenItem[] = filteredItems.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.hindiTitle,
    icon: (
      <Image
        src={item.icon}
        alt=""
        width={56}
        height={56}
        className="h-full w-full object-contain"
      />
    ),
    onOpen: () => handleOpen(item.id),
  }));

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <AppNavbar
        titleEn="Queries"
        titleHi="चौकशी"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Queries", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <WelcomeScreen
        title="Queries"
        searchPlaceholder="Search queries, modules..."
        query={query}
        onQueryChange={setQuery}
        items={welcomeItems}
        emptyMessage="No queries modules found."
      />

      {/* Modals rendering based on active state */}
      <GLTransactionSummary
        open={activeModal === "transaction-summary"}
        onClose={handleCloseModal}
      />

      <MaturityAmountModal
        open={activeModal === "maturity-amount-query"}
        onClose={handleCloseModal}
      />

      <LoanOverdueBalance
        open={activeModal === "loan-overdue-balance"}
        onClose={handleCloseModal}
      />

      <TransactionList
        open={activeModal === "transaction-list"}
        onClose={handleCloseModal}
      />

      <DisplayScrollDetailsModal
        open={activeModal === "display-scroll-details"}
        onClose={handleCloseModal}
      />
      <GeneralLedgerDetails
        open={activeModal === "general-ledger-details"}
        onClose={handleCloseModal}
      />
      <InstallmentCalculation
        open={activeModal === "installment-calculation"}
        onClose={handleCloseModal}
      />
    </div>
  );
}