import { IMAGES } from "@/assets";
import { useMemo, useState } from "react";
import Image from "@/components/ui/Image";
import { useRouter } from "@/lib/navigation";
import { AppNavbar, WelcomeScreen, BaseModal } from "@/components/common";
import type { WelcomeScreenItem } from "@/components/common";

type ShareItem = {
  id: string;
  title: string;
  icon: string;
  /** Route to navigate to when the page for this submenu exists. */
  href?: string;
};

const SHARE_ITEMS: ShareItem[] = [
  { id: "annual-meeting-attendance", title: "Annual Meeting Attendance", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON, href: "/annual-meeting-attendance" },
  { id: "certificate-print-1", title: "Certificate Print 1", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "share-contribution-overdue", title: "Share Contribution Overdue", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "shares-allotment-authorize", title: "Shares Allotment Authorize", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "shares-allotment-entry", title: "Shares Allotment Entry", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "shares-dividend-warrant", title: "Shares Dividend Warrant", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "shares-letter", title: "Shares Letter", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "shares-refund-authorization", title: "Shares Refund Authorization", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "shares-refund-entry", title: "Shares Refund Entry", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "voter-list", title: "Voter List", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
];

export default function SharesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SHARE_ITEMS;
    return SHARE_ITEMS.filter((item) => item.title.toLowerCase().includes(q));
  }, [query]);

  const handleOpen = (item: ShareItem) => {
    if (item.href) {
      router.push(item.href);
    } else {
      setComingSoon(item.title);
    }
  };

  const welcomeItems: WelcomeScreenItem[] = filteredItems.map((item) => ({
    id: item.id,
    title: item.title,
    icon: <Image src={item.icon} alt="" width={56} height={56} className="h-full w-full object-contain" />,
    onOpen: () => handleOpen(item),
  }));

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <AppNavbar
        titleEn="Shares"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shares", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <WelcomeScreen
        title="Shares"
        searchPlaceholder="Search shares modules..."
        query={query}
        onQueryChange={setQuery}
        items={welcomeItems}
        emptyMessage="No modules found."
      />

      {comingSoon && (
        <BaseModal title={comingSoon} onClose={() => setComingSoon(null)}>
          <p className="px-6 py-8 text-center text-sm text-gray-500 dark:text-slate-400">
            This module is coming soon.
          </p>
        </BaseModal>
      )}
    </div>
  );
}
