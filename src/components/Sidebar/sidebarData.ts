import type { ComponentType } from "react";
import {
  LayoutGrid,
  ShieldCheck,
  FileText,
  Percent,
  Landmark,
  UserCheck,
  User,
  Wallet,
  Database,
  Users,
  ArrowLeftRight,
  Building2,
  MessageSquare,
  Receipt,
  PlayCircle,
  ClipboardList,
  Server,
  Settings,
  FileSpreadsheet,
  Banknote,
  IdCard,
  KeyRound,
  Search,
  Calculator,
} from "lucide-react";

export type NavIcon = ComponentType<{ size?: number; className?: string }>;

export interface NavChildData {
  id: string;
  title: string;
  titleKey?: string;
  icon?: NavIcon;
  /** Omitted for items with no page built yet — they render as non-interactive placeholders. */
  href?: string;
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

  // The full menu/submenu structure below mirrors the master menu tracking
  // sheet (Main Menu -> Sub Menu). Most submenus don't have a page built yet
  // and render as non-interactive placeholders (no href) until their pages
  // exist — see NavChildData.href above.
  {
    id: "mis",
    title: "MIS Activity",
    titleKey: "sidebar.misActivity",
    icon: FileText,
    children: [
      {
        id: "daybeginend",
        title: "DAY Begin / End",
        titleKey: "sidebar.dayBeginEnd",
        icon: PlayCircle,
        href: "/day-begin-end",
      },
      {
        id: "mis-financial-closing",
        title: "Financial Closing",
        icon: FileText,
        href: "/financial-closing",
      },
      {
        id: "mis-interest-posting",
        title: "Interest Posting",
        icon: Percent,
        href: "/interest-posting",
      },
      {
        id: "mis-master-mainenance-global",
        title: "Master Maintenance Global",
        icon: Database,
        href: "/globalmaster",
      },
      {
        id: "mis-master-maintanance-head-office",
        title: "Master Maintenance - HeadOffice",
        icon: Database,
        href: "/headofficemaster",
      },
      {
        id: "mis-master-maintanance-user",
        title: "Master Maintenance - User",
        icon: Database,
        href: "/usermaster",
      },
      {
        id: "mis-support-utility",
        title: "Support Utility",
        icon: FileText,
        href: "/support-utility",
      },
      {
        id: "mis-tds",
        title: "TDS",
        icon: Percent,
        href: "/tds",
      },
      // {
      //   id: "daybeginend",
      //   title: "Day Begin / End",
      //   titleKey: "sidebar.dayBeginEnd",
      //   icon: Landmark,
      //   href: "/day-begin-end",
      // },
    ],
  },
  {
    id: "manager",
    title: "Manager",
    titleKey: "sidebar.manager",
    icon: ShieldCheck,
    children: [
      {
        id: "manager-master-maintanance-branch",
        title: "Master Maintenance - Branch",
        icon: Database,
        href: "/branchmaster",
      },
    ],
  },
  {
    id: "officer",
    title: "Officer",
    titleKey: "sidebar.authorization",
    icon: UserCheck,
    href: "/authorization",
    // children: [
    //   {
    //     id: "officer-account-authorise",
    //     title: "Account Authorise",
    //     icon: ShieldCheck,
    //     href: "/authorization/authorizeaccount",
    //   },
    //   {
    //     id: "officer-account-closing-authorise",
    //     title: "Account Closing Authorise",
    //     icon: ShieldCheck,
    //   },
    //   {
    //     id: "officer-application-authorise",
    //     title: "Application Authorise",
    //     icon: ShieldCheck,
    //   },
    //   {
    //     id: "officer-bill-authorise",
    //     title: "Bill Authorise",
    //     icon: ShieldCheck,
    //   },
    //   {
    //     id: "officer-branch",
    //     title: "Branch",
    //     icon: Building2,
    //   },
    //   {
    //     id: "officer-clearing-authorise",
    //     title: "Clearing Authorise",
    //     icon: ShieldCheck,
    //   },
    //   {
    //     id: "officer-customer-authorise",
    //     title: "Customer Authorise",
    //     icon: ShieldCheck,
    //     href: "/authorization/customer",
    //   },
    //   {
    //     id: "officer-legal-section",
    //     title: "Legal Section",
    //     icon: ShieldCheck,
    //   },
    //   {
    //     id: "officer-locker-authorise",
    //     title: "Locker Authorise",
    //     icon: ShieldCheck,
    //   },
    //   {
    //     id: "officer-sms-authorise",
    //     title: "SMS Authorise",
    //     icon: ShieldCheck,
    //   },
    //   {
    //     id: "officer-transaction-authorise",
    //     title: "Transaction Authorise",
    //     icon: ShieldCheck,
    //     href: "/authorization/transaction",
    //   },
    // ],
  },
  {
    id: "clerk",
    title: "Clerk",
    titleKey: "sidebar.clerk",
    icon: User,
    children: [
      {
        id: "clerk-account",
        title: "Account",
        icon: Landmark,
        href: "/account-master",
      },
      {
        id: "clerk-account-opening",
        title: "Account Closing",
        icon: Landmark,
        href: "/account-closing"
      },
      // {
      //   id: "clerk-application",
      //   title: "Application",
      //   icon: FileText,
      //   // href: "/account-master",
      // },
      {
        id: "clerk-bills",
        title: "Bills",
        icon: Receipt,
        href: "/account-master/bill",
      },
      {
        id: "clerk-branch",
        title: "Branch",
        icon: Building2,
        href: "/branchmaster",
      },
      {
        id: "clerk-clearing",
        title: "Clearing",
        icon: ArrowLeftRight,
        href: "/clerk/clearing",
      },
      {
        id: "clerk-customer",
        title: "Master Maintenance - Customer",
        icon: Users,
        href: "/customermaster",
      },
      {
        id: "clerk-locker",
        title: "Locker",
        icon: KeyRound,
        href: "/locker",
      },
      {
        id: "clerk-queries",
        title: "Queries",
        icon: Search,
      },
      {
        id: "clerk-sms",
        title: "SMS",
        icon: MessageSquare,
        href: "/sms",
      },
      {
        id: "clerk-transaction",
        title: "Transaction",
        icon: ArrowLeftRight,
        href: "/transactionmaster",
      },
    ],
  },
  {
    id: "ho-clerk",
    title: "HO Clerk",
    titleKey: "sidebar.hoClerk",
    icon: UserCheck,
    children: [
      {
        id: "ho-clerk-application",
        title: "Application",
        icon: FileText,
        href: "/ho-clerk-application"
      },
      {
        id: "ho-clerk-legal-section",
        title: "Legal Section",
        icon: ShieldCheck,
      },
      {
        id: "ho-clerk-str",
        title: "STR",
        icon: ShieldCheck,
      },
      {
        id: "ho-clerk-transaction",
        title: "Transaction",
        icon: ArrowLeftRight,
        href: "/ho-clerk-transaction"
      },
    ],
  },
  {
    id: "cashier",
    title: "Cashier",
    titleKey: "sidebar.cashier",
    icon: Wallet,
    children: [
      {
        id: "cashier-cash-handling",
        title: "Cash Handling",
        icon: Wallet,
        href: "/cashier"
      },
      {
        id: "cashier-cash-handling-report",
        title: "Cash Handling Report",
        icon: Wallet,
      },
    ],
  },
  {
    id: "shares",
    title: "Shares",
    icon: ClipboardList,
    children: [
      {
        id: "shares-annual-meeting-attendance",
        title: "Annual Meeting Attendance",
        icon: FileText,
      },
      {
        id: "shares-annual-meeting-report",
        title: "Annual Meeting Report",
        icon: FileText,
      },
      {
        id: "shares-shares-branchwise-report",
        title: "Shares Branchwise Report",
        icon: Building2,
      },
      {
        id: "shares-certificate-print-1",
        title: "Certificate Print 1",
        icon: ClipboardList,
      },
      {
        id: "shares-city-wise-member-list",
        title: "City Wise Member List",
        icon: ClipboardList,
      },
      {
        id: "shares-dividend-calculation",
        title: "Dividend Calculation",
        icon: ClipboardList,
      },
      {
        id: "shares-shares-register",
        title: "Shares Register",
        icon: ClipboardList,
      },
      {
        id: "shares-shares-members-list",
        title: "Shares Members List",
        icon: ClipboardList,
      },
      {
        id: "shares-share-contribution-overdue",
        title: "Share Contribution Overdue",
        icon: ClipboardList,
      },
      {
        id: "shares-share-issue-register",
        title: "Share Issue Register",
        icon: ClipboardList,
      },
      {
        id: "shares-shares-allotment-authorize",
        title: "Shares Allotment Authorize",
        icon: ShieldCheck,
      },
      {
        id: "shares-shares-allotment-entry",
        title: "Shares Allotment Entry",
        icon: ClipboardList,
      },
      {
        id: "shares-shares-dividend-warrant",
        title: "Shares Dividend Warrant",
        icon: ClipboardList,
      },
      {
        id: "shares-shares-letter",
        title: "Shares Letter",
        icon: ClipboardList,
      },
      {
        id: "shares-shares-refund-authorization",
        title: "Shares Refund Authorization",
        icon: ShieldCheck,
      },
      {
        id: "shares-shares-refund-entry",
        title: "Shares Refund Entry",
        icon: ClipboardList,
      },
      {
        id: "shares-customer-detail-report-new",
        title: "Customer Detail Report New",
        icon: Users,
      },
      {
        id: "shares-shares-unpaid-register-dvdnd-yearwise",
        title: "Shares Unpaid Register (Dividend Yearwise)",
        icon: ClipboardList,
      },
      {
        id: "shares-label-printing",
        title: "Label Printing",
        icon: FileText,
      },
      {
        id: "shares-unpaid-dividend-transfer",
        title: "Unpaid Dividend Transfer",
        icon: ArrowLeftRight,
      },
      {
        id: "shares-voter-list",
        title: "Voter List",
        icon: ClipboardList,
      },
    ],
  },
  // {
  //   id: "reports",
  //   title: "Reports",
  //   icon: BarChart3,
  //   children: [
  //     {
  //       id: "reports-report-locker",
  //       title: "Report Locker",
  //       icon: KeyRound,
  //     },
  //     {
  //       id: "reports-report-mlcb",
  //       title: "Report MLCB",
  //       icon: FileText,
  //     },
  //     {
  //       id: "reports-report-account",
  //       title: "Report Account",
  //       icon: Landmark,
  //     },
  //     {
  //       id: "reports-report-customer",
  //       title: "Report Customer",
  //       icon: Users,
  //     },
  //     {
  //       id: "reports-report-deposit",
  //       title: "Report Deposit",
  //       icon: Wallet,
  //     },
  //     {
  //       id: "reports-report-half-yearly",
  //       title: "Report Half Yearly",
  //       icon: FileText,
  //     },
  //     {
  //       id: "reports-report-legal",
  //       title: "Report Legal",
  //       icon: ShieldCheck,
  //     },
  //     {
  //       id: "reports-report-loan",
  //       title: "Report Loan",
  //       icon: Landmark,
  //     },
  //     {
  //       id: "reports-report-monthly",
  //       title: "Report Monthly",
  //       icon: FileText,
  //     },
  //     {
  //       id: "reports-report-pigmy",
  //       title: "Report Pigmy",
  //       icon: FileText,
  //     },
  //     {
  //       id: "reports-report-rtgs",
  //       title: "Report RTGS",
  //       icon: FileText,
  //     },
  //     {
  //       id: "reports-report-sms",
  //       title: "Report SMS",
  //       icon: MessageSquare,
  //     },
  //   ],
  // },
  // {
  //   id: "daily-reports",
  //   title: "Daily Reports",
  //   icon: CalendarClock,
  //   children: [
  //     {
  //       id: "daily-reports-cash-related-report",
  //       title: "Cash Related Report",
  //       icon: Wallet,
  //     },
  //     {
  //       id: "daily-reports-gl-related-report",
  //       title: "GL Related Report",
  //       icon: FileText,
  //     },
  //     {
  //       id: "daily-reports-outward-cleraring-report",
  //       title: "Outward Cleraring Report",
  //       icon: FileText,
  //     },
  //     {
  //       id: "daily-reports-report-mlcb",
  //       title: "Report MLCB",
  //       icon: FileText,
  //     },
  //     {
  //       id: "daily-reports-report-account",
  //       title: "Report Account",
  //       icon: Landmark,
  //     },
  //     {
  //       id: "daily-reports-report-customer",
  //       title: "Report Customer",
  //       icon: Users,
  //     },
  //     {
  //       id: "daily-reports-report-daily",
  //       title: "Report Daily",
  //       icon: FileText,
  //     },
  //     {
  //       id: "daily-reports-transaction",
  //       title: "Transaction",
  //       icon: ArrowLeftRight,
  //     },
  //   ],
  // },
  {
    id: "cbs-report",
    title: "CBS Report",
    icon: Server,
    children: [
      {
        id: "cbs-report-cbs-report",
        title: "CBS Report",
        icon: FileText,
      },
      {
        id: "cbs-report-exception-report",
        title: "Exception Report",
        icon: FileText,
      },
      {
        id: "cbs-report-gl-related-report",
        title: "GL Related Report",
        icon: FileText,
      },
      {
        id: "cbs-report-oss-mapping",
        title: "OSS Mapping",
        icon: FileText,
      },
      {
        id: "cbs-report-oss-report",
        title: "OSS Report",
        icon: FileText,
      },
      {
        id: "cbs-report-rbi-inspection",
        title: "RBI Inspection",
        icon: FileText,
      },
      {
        id: "cbs-report-rbi-input",
        title: "RBI Input",
        icon: FileText,
      },
      {
        id: "cbs-report-rbi-report",
        title: "RBI Report",
        icon: FileText,
      },
      {
        id: "cbs-report-str",
        title: "STR",
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: "utility",
    title: "Utility",
    icon: Settings,
    children: [
      {
        id: "utility-master-maintanance-user",
        title: "Master Maintenance - User",
        icon: Database,
      },
      {
        id: "utility-utility2",
        title: "Utility 2",
        icon: FileText,
      },
    ],
  },
  {
    id: "dd",
    title: "DD",
    icon: FileSpreadsheet,
    children: [
      {
        id: "dd-printing",
        title: "Printing",
        icon: FileText,
        href: "/dd",
      },
      {
        id: "dd-report",
        title: "Report",
        icon: FileText,
      },
    ],
  },
  {
    id: "ho-officer",
    title: "HO Officer",
    icon: UserCheck,
    children: [
      {
        id: "ho-officer-transaction-authorize",
        title: "Transaction Authorize",
        icon: ShieldCheck,
        href: "/ho-officer"
      },
    ],
  },
  {
    id: "branch-activity",
    title: "Branch Activity",
    icon: PlayCircle,
    children: [
      {
        id: "branch-activity",
        title: "Day Begin",
        icon: PlayCircle,
        href: "/branch-activity",
      },
    ],
  },
  {
    id: "payroll",
    title: "Payroll",
    icon: Banknote,
    children: [
      {
        id: "payroll-master",
        title: "Master",
        icon: Database,
        href: "/payroll/master"
      },
      {
        id: "payroll-report",
        title: "Report",
        icon: FileText,
      },
      {
        id: "payroll-transaction",
        title: "Transaction",
        icon: ArrowLeftRight,
        href: "/payroll/transaction"
      },
      {
        id: "payroll-transaction-entry",
        title: "Transaction Entry",
        icon: ArrowLeftRight,
      },
      {
        id: "payroll-authrization",
        title: "Authorization",
        icon: ArrowLeftRight,
      },
    ],
  },
  // {
  //   id: "branch-report",
  //   title: "Branch Report",
  //   icon: Building,
  //   children: [
  //     {
  //       id: "branch-report-report-mlcb",
  //       title: "Report MLCB",
  //       icon: FileText,
  //     },
  //     {
  //       id: "branch-report-report-account",
  //       title: "Report Account",
  //       icon: Landmark,
  //     },
  //     {
  //       id: "branch-report-report-customer",
  //       title: "Report Customer",
  //       icon: Users,
  //     },
  //     {
  //       id: "branch-report-report-half-yearly",
  //       title: "Report Half Yearly",
  //       icon: FileText,
  //     },
  //     {
  //       id: "branch-report-report-leagl",
  //       title: "Report Legal",
  //       icon: ShieldCheck,
  //     },
  //     {
  //       id: "branch-report-report-loan",
  //       title: "Report Loan",
  //       icon: Landmark,
  //     },
  //     {
  //       id: "branch-report-report-monthly",
  //       title: "Report Monthly",
  //       icon: FileText,
  //     },
  //     {
  //       id: "branch-report-report-pigmy",
  //       title: "Report Pigmy",
  //       icon: FileText,
  //     },
  //     {
  //       id: "branch-report-report-rtgs",
  //       title: "Report RTGS",
  //       icon: FileText,
  //     },
  //   ],
  // },
  // {
  //   id: "other-reports",
  //   title: "Other Reports",
  //   icon: FileQuestion,
  //   children: [
  //     {
  //       id: "other-reports-account-closing",
  //       title: "Account Closing",
  //       icon: Landmark,
  //     },
  //     {
  //       id: "other-reports-account-closing-authorise",
  //       title: "Account Closing Authorise",
  //       icon: ShieldCheck,
  //     },
  //     {
  //       id: "other-reports-application",
  //       title: "Application",
  //       icon: FileText,
  //     },
  //     {
  //       id: "other-reports-application-authorise",
  //       title: "Application Authorise",
  //       icon: ShieldCheck,
  //     },
  //     {
  //       id: "other-reports-branch",
  //       title: "Branch",
  //       icon: Building2,
  //     },
  //     {
  //       id: "other-reports-cashier",
  //       title: "Cashier",
  //       icon: Wallet,
  //     },
  //     {
  //       id: "other-reports-cleartk",
  //       title: "Clerk",
  //       icon: FileText,
  //     },
  //     {
  //       id: "other-reports-customer",
  //       title: "Customer",
  //       icon: Users,
  //     },
  //     {
  //       id: "other-reports-report-account",
  //       title: "Report Account",
  //       icon: Landmark,
  //     },
  //     {
  //       id: "other-reports-report-customer",
  //       title: "Report Customer",
  //       icon: Users,
  //     },
  //     {
  //       id: "other-reports-report-deposit",
  //       title: "Report Deposit",
  //       icon: Wallet,
  //     },
  //     {
  //       id: "other-reports-report-half-yearly",
  //       title: "Report Half Yearly",
  //       icon: FileText,
  //     },
  //     {
  //       id: "other-reports-report-loan",
  //       title: "Report Loan",
  //       icon: Landmark,
  //     },
  //     {
  //       id: "other-reports-report-mlcb",
  //       title: "Report MLCB",
  //       icon: FileText,
  //     },
  //     {
  //       id: "other-reports-report-monthly",
  //       title: "Report Monthly",
  //       icon: FileText,
  //     },
  //     {
  //       id: "other-reports-report-pigmy",
  //       title: "Report Pigmy",
  //       icon: FileText,
  //     },
  //     {
  //       id: "other-reports-sms",
  //       title: "SMS",
  //       icon: MessageSquare,
  //     },
  //     {
  //       id: "other-reports-transaction",
  //       title: "Transaction",
  //       icon: ArrowLeftRight,
  //     },
  //     {
  //       id: "other-reports-transaction-authorise",
  //       title: "Transaction Authorise",
  //       icon: ShieldCheck,
  //     },
  //   ],
  // },
  {
    id: "user-role",
    title: "User",
    icon: IdCard,
    children: [
      {
        id: "user-role-master-maintanance-user",
        title: "Master Maintenance - User",
        icon: Database,
        href: "/usermaster",
      },
    ],
  },
  {
    id: "calculator",
    title: "Calculator",
    icon: Calculator,
    href: "/futuremodels/calculator",
  },

  // General / future items not tied to a specific role menu in the sheet.
  { id: "futuremodals", title: "Future Modals", titleKey: "sidebar.dba", icon: Database, href: "/futuremodals" },
];

export const user = {
  name: "Kunal Jadhav",
  role: "Admin",
  email: "kunal.jadhav@idsspl.com",
  avatar: "/profile.png",
  lastLogin: "Today, 10:45 AM",
};