import { IMAGES } from "@/assets";
import { useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizeHero from "@/components/Authorization/AuthorizeTransaction/AuthorizeHero";
import AuthorizeTransactionCard from "@/components/Authorization/AuthorizeTransaction/AuthorizeTransactionCard";

/* ===== from hoOfficerData.ts ===== */
export type HoOfficerData_HoOfficerItem = {
  id: string;
  title: string;
  marathiTitle: string;
  route: string;
  icon: string;
};

const HoOfficerData_ICON = IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON;

export const HoOfficerData_HO_OFFICER_ITEMS: HoOfficerData_HoOfficerItem[] = [
  {
    id: "ho-cash-deposit-entry",
    title: "HO CASH DEPOSIT ENTRY",
    marathiTitle: "HO रोख जमा नोंद",
    route: "/ho-officer/ho-cash-deposit-entry",
    icon: HoOfficerData_ICON,
  },
  {
    id: "ho-cash-withdrawal-entry",
    title: "HO CASH WITHDRAWAL ENTRY",
    marathiTitle: "HO रोख पैसे काढणे नोंद",
    route: "/ho-officer/ho-cash-withdrawal-entry",
    icon: HoOfficerData_ICON,
  },
  {
    id: "ho-transfer-entry",
    title: "HO TRANSFER ENTRY",
    marathiTitle: "HO हस्तांतरण नोंद",
    route: "/ho-officer/ho-transfer-entry",
    icon: HoOfficerData_ICON,
  },
  {
    id: "investment-payment-closingmark",
    title: "INVESTMENT PAYMENT CLOSINGMARK",
    marathiTitle: "गुंतवणूक पेमेंट क्लोजिंगमार्क",
    route: "/ho-officer/investment-payment-closingmark",
    icon: HoOfficerData_ICON,
  },
  {
    id: "rtgs-outward-file-generation",
    title: "RTGS OUTWARD FILE GENERATION",
    marathiTitle: "RTGS आउटवर्ड फाइल जनरेशन",
    route: "/ho-officer/rtgs-outward-file-generation",
    icon: HoOfficerData_ICON,
  },
  {
    id: "reconciliation",
    title: "RECONCILIATION",
    marathiTitle: "समायोजन",
    route: "/ho-officer/reconciliation",
    icon: HoOfficerData_ICON,
  },
];


/* ===== from HoOfficer.tsx ===== */
const HoOfficer = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HoOfficerData_HO_OFFICER_ITEMS;
    return HoOfficerData_HO_OFFICER_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.marathiTitle.toLowerCase().includes(q),
    );
  }, [query]);

  const handleOpen = (item: HoOfficerData_HoOfficerItem) => {
    router.push(item.route);
  };

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="HO Officer"
        titleHi="HO अधिकारी"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        <AuthorizeHero query={query} onQueryChange={setQuery} title="HO Officer" />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          {filteredItems.map((item) => (
            <AuthorizeTransactionCard key={item.id} item={item} onOpen={handleOpen} />
          ))}

          {filteredItems.length === 0 && (
            <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">
              No transactions found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HoOfficer;
