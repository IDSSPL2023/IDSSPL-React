import { useMemo, useState } from "react";
import {
  Search,
  ArrowUpRight,
  Users,
  UserX,
  ShieldCheck,
  Share2,
  Power,
  BarChart3,
  Building2,
  ShieldAlert,
  CreditCard,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import { useBilingual } from "@/i18n/useBilingual";
import { useRouter } from "@/lib/navigation";

type AuthorizeMasterItem = {
  key: string;
  icon: LucideIcon;
  cardKey: string;
  href?: string;
};

const ITEMS: AuthorizeMasterItem[] = [
  {
    key: "casaAuthorization",
    icon: Users,
    cardKey: "casaAuthorization",
    href: "/authorization/authorizeaccountmain/casa",
  },
  {
    key: "casaAuthorizationClosing",
    icon: UserX,
    cardKey: "casaAuthorizationClosing",
  },
  {
    key: "depositAuthorization",
    icon: ShieldCheck,
    cardKey: "depositAuthorization",
    href: "/authorization/authorizeaccountmain/deposite",
  },
  {
    key: "depositAuthorizationClosing",
    icon: Share2,
    cardKey: "depositAuthorizationClosing",
  },
  {
    key: "loanAuthorization",
    icon: Power,
    cardKey: "loanAuthorization",
    href: "/authorization/authorizeaccountmain/loan",
  },
  {
    key: "loanClosing",
    icon: BarChart3,
    cardKey: "loanClosing",
  },
  {
    key: "fixedAssetAuthorization",
    icon: Building2,
    cardKey: "fixedAssetAuthorization",
    href: "/authorization/authorizeaccountmain/fixed",
  },
  {
    key: "fixedAssetClosing",
    icon: ShieldAlert,
    cardKey: "fixedAssetClosing",
  },
  {
    key: "investmentAuthorization",
    icon: CreditCard,
    cardKey: "investmentAuthorization",
    href: "/authorization/authorizeaccountmain/investment",
  },
  {
    key: "investmentClosing",
    icon: CircleDollarSign,
    cardKey: "investmentClosing",
  },
];

type AuthorizeMasterCardProps = {
  item: AuthorizeMasterItem;
  titleEn: string;
  titleSecondary: string;
  onOpen: () => void;
};

const AuthorizeMasterCard = ({
  item,
  titleEn,
  titleSecondary,
  onOpen,
}: AuthorizeMasterCardProps) => {
  const Icon = item.icon;

  return (
    <div className="group flex items-center justify-between rounded-md border border-[#E5E7EB] bg-white px-5 py-3 transition-all duration-200 hover:border-[#D7E3FF] hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[#052F5B]">
          <Icon size={22} strokeWidth={2} className="text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold leading-5 text-[#111827] dark:text-slate-100">
            {titleEn}
          </h3>
          {titleSecondary && (
            <p className="mt-1 truncate text-[13px] leading-4 text-[#9CA3AF] dark:text-slate-400">
              {titleSecondary}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="ml-4 flex shrink-0 items-center gap-1 rounded-full border border-[#2563EB] bg-[#EEF4FF] px-5 py-2 text-[15px] font-medium text-[#2563EB] transition-all duration-200 hover:bg-[#E2ECFF] active:scale-95 dark:bg-primary-950/40 dark:hover:bg-primary-900/40"
      >
        <span>Open</span>
        <ArrowUpRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
};

const AuthorizeAccountMainPage = () => {
  const { t, en, tRaw } = useBilingual();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((item) => {
      const titleEn = en(`accountAuthorizeMaster.cards.${item.cardKey}`);
      const titleSecondary = tRaw(
        `accountAuthorizeMaster.cards.${item.cardKey}`,
      );
      return (
        titleEn.toLowerCase().includes(q) ||
        titleSecondary.toLowerCase().includes(q)
      );
    });
  }, [query, en, tRaw]);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn={en("accountAuthorizeMaster.navTitle")}
        titleHi={t("accountAuthorizeMaster.navTitle")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("accountAuthorizeMaster.navTitle"), href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="min-w-7xl mx-auto p-4">
        <div className="rounded-xl bg-white p-5 dark:bg-slate-900">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 px-6 py-10 text-center">
            <h1 className="text-[38px] font-bold text-white">
              {en("accountAuthorizeMaster.title")}
            </h1>

            <div className="mx-auto mt-6 flex max-w-xl items-center rounded-full bg-white px-4 py-2 shadow-lg">
              <Search size={18} className="mr-2 shrink-0 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={en("accountAuthorizeMaster.searchPlaceholder")}
                className="min-w-0 flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
              />
              <button
                type="button"
                className="shrink-0 rounded-md bg-primary-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
              >
                {en("accountAuthorizeMaster.show")}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredItems.length === 0 ? (
              <p className="col-span-2 py-8 text-center text-gray-400 dark:text-slate-500">
                {en("common.noResultsFound")}
              </p>
            ) : (
              filteredItems.map((item) => (
                <AuthorizeMasterCard
                  key={item.key}
                  item={item}
                  titleEn={en(`accountAuthorizeMaster.cards.${item.cardKey}`)}
                  titleSecondary={tRaw(
                    `accountAuthorizeMaster.cards.${item.cardKey}`,
                  )}
                  onOpen={() => item.href && router.push(item.href)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizeAccountMainPage;
