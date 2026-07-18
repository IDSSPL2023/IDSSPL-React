import Image from "@/components/ui/Image";
import { ArrowUpRight } from "lucide-react";
import Link from "@/components/ui/Link";

type AuthorizationItem = {
  key: string;
  icon?: string;
  iconSrc?: string;
  titleEn: string;
  titleHi: string;
  badge: string;
  description: string;
  count: number;
  href?: string;
};

const AUTHORIZATION_ITEMS: AuthorizationItem[] = [
  {
    key: "account",
    iconSrc: "/money.png",
    titleEn: "Authorize Account",
    titleHi: "खाते अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/authorizeaccountmain",
  },
  {
    key: "customer",
    iconSrc: "/hand.png",
    titleEn: "Authorize Customer",
    titleHi: "ग्राहक अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/authorizecustomer",
  },
  {
    key: "user",
    iconSrc: "/contact.png",
    titleEn: "Authorize User",
    titleHi: "वापरकर्ता अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/user",
  },
  {
    key: "roles",
    iconSrc: "/settinguser.png",
    titleEn: "Roles Authorization",
    titleHi: "भूमिका अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/authorizerole",
  },
  {
    key: "transaction",
    iconSrc: "/note1.png",
    titleEn: "Authorize Transaction",
    titleHi: "व्यवहार अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/transaction",
  },
  {
    key: "clearing",
    iconSrc: "/note2.png",
    titleEn: "Authorize Clearing",
    titleHi: "क्लिअरिंग अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/clearing",
  },
  {
    key: "locker",
    iconSrc: "/locker.png",
    titleEn: "Authorize Locker",
    titleHi: "लॉकर अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
  },
  {
    key: "sms",
    iconSrc: "/message.png",
    titleEn: "Authorize SMS",
    titleHi: "एसएमएस अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
  },
];

type AuthorizationCardProps = {
  item: AuthorizationItem;
};

const AuthorizationCard = ({ item }: AuthorizationCardProps) => {
  return (
    <div
      className="
        flex flex-col gap-2 rounded-2xl border border-l-5 sm:border-l-6 border-primary
        bg-white p-2 dark:bg-slate-900
        transition-all duration-200 hover:border-[#1565D8] hover:shadow-md
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden sm:h-16 sm:w-16 md:h-20 md:w-20">
          <Image
            src={item.iconSrc!}
            alt={item.titleEn}
            width={80}
            height={80}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-[clamp(13px,3.4vw,16px)] font-bold leading-[1.35] text-black dark:text-slate-100">
            {item.titleEn}{" "}
            <span className="font-semibold text-[#64748B] dark:text-slate-400">
              / {item.titleHi}
            </span>
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-full border border-[#BEDBFF] bg-[#EEF6FF] py-0.5 pl-0.5 pr-2 dark:border-blue-900/40 dark:bg-blue-900/20">
            <span className="shrink-0 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[clamp(9px,2vw,11px)] font-medium text-[#018D0A] dark:bg-green-900/30 dark:text-green-400">
              {item.badge}
            </span>
            <span className="text-[clamp(10px,2.2vw,12px)] leading-[1.4] text-[#1C398E] dark:text-blue-300">
              {item.description}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={item.href || "#"}
        aria-label={`Open ${item.titleEn}, ${item.count} pending`}
        className="
          flex shrink-0 items-center justify-between gap-3 self-stretch
          rounded-lg px-1 py-1
          transition-colors hover:bg-[#F1F5F9] focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-[#1565D8] focus-visible:ring-offset-2
          sm:justify-end sm:gap-4 md:gap-5
          dark:hover:bg-slate-800
        "
      >
        <span className="text-[clamp(17px,3.8vw,24px)] font-semibold text-[#1565D8] dark:text-blue-400">
          {item.count}
        </span>
        <ArrowUpRight
          size={20}
          strokeWidth={2.5}
          className="shrink-0 text-[#111827] dark:text-slate-300"
        />
      </Link>
    </div>
  );
};

const AuthorizationCards = () => {
  return (
    <div className="p-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-2">
      {AUTHORIZATION_ITEMS.map((item) => (
        <AuthorizationCard key={item.key} item={item} />
      ))}
    </div>
  );
};

export default AuthorizationCards;
