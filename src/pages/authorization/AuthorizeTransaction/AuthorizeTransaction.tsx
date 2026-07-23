import { useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizeHero from "@/components/Authorization/AuthorizeTransaction/AuthorizeHero";
import AuthorizeTransactionCard from "@/components/Authorization/AuthorizeTransaction/AuthorizeTransactionCard";
import {
  AUTHORIZE_TRANSACTION_ITEMS,
  type AuthorizeTransactionItem,
} from "@/components/Authorization/AuthorizeTransaction/authorizeTransactionData";

/* ===== from AuthorizeTransactionPage.tsx ===== */
const AuthorizeTransactionPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AUTHORIZE_TRANSACTION_ITEMS;
    return AUTHORIZE_TRANSACTION_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.marathiTitle.toLowerCase().includes(q),
    );
  }, [query]);

  const handleOpen = (item: AuthorizeTransactionItem) => {
    router.push(item.route);
  };

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Authorize Transaction"
        titleHi="व्यवहार मंजूर करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Authorize", onClick: () => router.push("/authorization") },
          { label: "Authorize Transaction", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        <AuthorizeHero query={query} onQueryChange={setQuery} />

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

export default AuthorizeTransactionPage;
