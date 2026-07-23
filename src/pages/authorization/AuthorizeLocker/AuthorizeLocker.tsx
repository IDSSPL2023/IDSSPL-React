import { IMAGES } from "@/assets";
import { useState } from "react";
import Image from "@/components/ui/Image";
import { useRouter } from "@/lib/navigation";
import { AppNavbar, WelcomeScreen } from "@/components/common";
import type { WelcomeScreenItem } from "@/components/common";
import {
  LockerSurrenderModal,
  LockerTransactionModal,
  LockerTable_DEFAULT_LOCKER_ROWS,
} from "@/pages/Locker/Locker";

type AuthorizeLockerModal = "surrender" | "transaction";

const AUTHORIZE_LOCKER_ITEMS: { id: AuthorizeLockerModal; title: string }[] = [
  { id: "surrender", title: "Locker Surrender" },
  { id: "transaction", title: "Locker Transaction" },
];

export default function AuthorizeLockerPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<AuthorizeLockerModal | null>(null);

  const sampleRow = LockerTable_DEFAULT_LOCKER_ROWS[0];

  const filteredItems = AUTHORIZE_LOCKER_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  const welcomeItems: WelcomeScreenItem[] = filteredItems.map((item) => ({
    id: item.id,
    title: item.title,
    icon: <Image src={IMAGES.LOCKER} alt="" width={56} height={56} className="h-full w-full object-contain" />,
    onOpen: () => setActiveModal(item.id),
  }));

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <AppNavbar
        titleEn="Authorize Locker"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Authorization", href: "/authorization" },
          { label: "Authorize Locker", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <WelcomeScreen
        title="Authorize Locker"
        searchPlaceholder="Search locker authorization modules..."
        query={query}
        onQueryChange={setQuery}
        items={welcomeItems}
        emptyMessage="No modules found."
      />

      {activeModal === "surrender" && (
        <LockerSurrenderModal row={sampleRow} mode="authorize" onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "transaction" && (
        <LockerTransactionModal row={sampleRow} mode="authorize" onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
