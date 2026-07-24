import { IMAGES } from "@/assets";
import Image from "@/components/ui/Image";
import { SubMenuScreen } from "@/components/common";
import type { SubMenuItem } from "@/components/common";

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
    iconSrc: IMAGES.MONEY,
    titleEn: "Authorize Account",
    titleHi: "खाते अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/authorizeaccountmain",
  },
  {
    key: "customer",
    iconSrc: IMAGES.HAND,
    titleEn: "Authorize Customer",
    titleHi: "ग्राहक अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/authorizecustomer",
  },
  {
    key: "user",
    iconSrc: IMAGES.CONTACT,
    titleEn: "Authorize User",
    titleHi: "वापरकर्ता अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/user",
  },
  {
    key: "roles",
    iconSrc: IMAGES.SETTING_USER,
    titleEn: "Roles Authorization",
    titleHi: "भूमिका अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/authorizerole",
  },
  {
    key: "transaction",
    iconSrc: IMAGES.NOTE_1,
    titleEn: "Authorize Transaction",
    titleHi: "व्यवहार अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/transaction",
  },
  {
    key: "clearing",
    iconSrc: IMAGES.NOTE_2,
    titleEn: "Authorize Clearing",
    titleHi: "क्लिअरिंग अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/clearing",
  },
  {
    key: "locker",
    iconSrc: IMAGES.LOCKER,
    titleEn: "Authorize Locker",
    titleHi: "लॉकर अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/locker",
  },
  {
    key: "sms",
    iconSrc: IMAGES.MESSAGE,
    titleEn: "Authorize SMS",
    titleHi: "एसएमएस अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/sms-authorize", 
  },
  {
    key: "bill",
    iconSrc: IMAGES.BILL,
    titleEn: "Authorize Bill",
    titleHi: "बिल अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
    href: "/authorization/BillAuthorize",
  },
];

const SUB_MENU_ITEMS: SubMenuItem[] = AUTHORIZATION_ITEMS.map((item) => ({
  key: item.key,
  titleEn: item.titleEn,
  titleHi: item.titleHi,
  badge: item.badge,
  description: item.description,
  count: item.count,
  href: item.href,
  icon: (
    <Image src={item.iconSrc!} alt={item.titleEn} width={80} height={80} className="h-full w-full object-contain" />
  ),
}));

/** Config-only wrapper around the common `SubMenuScreen` — the `/authorization` submenu reference migration. */
const AuthorizationCards = () => <SubMenuScreen items={SUB_MENU_ITEMS} />;

export default AuthorizationCards;