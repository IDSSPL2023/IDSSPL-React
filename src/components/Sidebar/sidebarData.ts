import type { ComponentType } from "react";
import {
  LayoutGrid,
  ShieldCheck,
  FileText,
  Wrench,
  Percent,
  Landmark,
  UserCog,
  UserCheck,
  User,
  Wallet,
  Database,
  Users,
  ArrowLeftRight,
  Building2,
  Globe,
  FlaskConical,
  MessageSquare,
  Receipt,
} from "lucide-react";

export type NavIcon = ComponentType<{ size?: number; className?: string }>;

export interface NavChildData {
  id: string;
  title: string;
  titleKey?: string;
  icon?: NavIcon;
  href: string;
}

export interface NavItemData {
  id: string;
  title: string;
  titleKey?: string;
  icon: NavIcon;
  /** Omitted for items with no page built yet — they render as non-interactive placeholders. */
  href?: string;
  children?: NavChildData[];
}

export const menuItems: NavItemData[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    titleKey: "sidebar.dashboard",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    id: "ai-dashboard",
    title: "AI Dashboard",
    titleKey: "sidebar.aiDashboard",
    icon: LayoutGrid,
    href: "/ai-dashboard",
  },
  {
    id: "mis",
    title: "MIS Activity",
    titleKey: "sidebar.misActivity",
    icon: FileText,
    children: [
      {
        id: "user",
        title: "User Master",
        titleKey: "sidebar.userMaster",
        icon: User,
        href: "/usermaster",
      },
      {
        id: "assign",
        title: "Assign User Role",
        titleKey: "sidebar.assignUserRole",
        icon: UserCog,
        href: "/assignuserrole",
      },
      {
        id: "head",
        title: "Headoffice Master",
        titleKey: "sidebar.headOfficeMaster",
        icon: Building2,
        href: "/headofficemaster",
      },
      {
        id: "global",
        title: "Global Master",
        titleKey: "sidebar.globalMaster",
        icon: Globe,
        href: "/globalmaster",
      },
    ],
  },

  // The items below don't have pages built yet. They're shown so the menu
  // matches the intended final shape, but render as non-interactive
  // placeholders (no href) until their pages exist.
  { id: "support-utility", title: "Support Utility", titleKey: "sidebar.supportUtility", icon: Wrench },
  { id: "interest-posting", title: "Interest Posting", titleKey: "sidebar.interestPosting", icon: Percent },
  { id: "financial-closing", title: "Financial Closing", titleKey: "sidebar.financialClosing", icon: Landmark },

  {
    id: "manager",
    title: "Manager",
    titleKey: "sidebar.manager",
    icon: ShieldCheck,
    href: "/branchmaster",
  },
    {
    id: "hoOfficer",
    title: "Ho Officer",
    titleKey: "sidebar.hoOfficer",
    icon: UserCheck,
    href: "/headofficemaster",
  },
  {
    id: "officer",
    title: "Officer",
    titleKey: "sidebar.authorization",
    icon: UserCheck,
    href: "/authorization",
  },
  {
    id: "hoclerk",
    title: "Ho Clerk",
    titleKey: "sidebar.hoClerk",
    icon: UserCheck,
    href: "/hoclerk",
  },
  {
    id: "clerk",
    title: "Clerk",
    titleKey: "sidebar.clerk",
    icon: User,
    children: [
      {
        id: "application",
        title: "Application",
        titleKey: "sidebar.accountMaster",
        icon: Landmark,
        href: "/account-master",
      },
      {
        id: "account-closing",
        title: "Account Closing",
        titleKey: "sidebar.accountClosing",
        icon: Users,
        href: "/account-closing",
      },
      {
        id: "bills",
        title: "Bills",
        titleKey: "sidebar.bills",
        icon: Receipt,
        href: "/bills",
      },
      {
        id: "clearing",
        title: "Clearing",
        titleKey: "sidebar.clearing",
        icon: ArrowLeftRight,
        href: "/clearing",
      },
      {
        id: "customer",
        title: "Customer Master",
        titleKey: "sidebar.customerMaster",
        icon: Users,
        href: "/customermaster",
      },
      {
        id: "locker",
        title: "Locker",
        titleKey: "sidebar.locker",
        icon: UserCog,
        href: "/locker",
      },
      {
        id: "queries",
        title: "Queries",
        titleKey: "sidebar.queries",
        icon: Building2,
        href: "/queries",
      },
      {
        id: "sms",
        title: "SMS",
        titleKey: "sidebar.sms",
        icon: MessageSquare,
        href: "/sms",
      },
      {
        id: "transaction",
        title: "Transaction Master",
        titleKey: "sidebar.transactionMaster",
        icon: ArrowLeftRight,
        href: "/transactionmaster",
      },
    ],
  },

  { id: "cashier", title: "Cashier", titleKey: "sidebar.cashier", icon: Wallet },
  { id: "dba", title: "DBA", titleKey: "sidebar.dba", icon: Database },
];

export const user = {
  name: "Kunal Jadhav",
  role: "Admin",
  email: "kunal.jadhav@idsspl.com",
  avatar: "/profile.png",
  lastLogin: "Today, 10:45 AM",
};