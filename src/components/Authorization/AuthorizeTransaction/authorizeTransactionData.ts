import { IMAGES } from "@/assets";

/** Shared with HoOfficer.tsx / PayrollTransaction.tsx (via AuthorizeTransactionCard) — kept standalone. */
/* ===== from authorizeTransactionData.ts ===== */
export type AuthorizeTransactionItem = {
  id: string;
  title: string;
  marathiTitle: string;
  route: string;
  icon: string;
};

const ICON = IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON;

export const AUTHORIZE_TRANSACTION_ITEMS: AuthorizeTransactionItem[] = [
  {
    id: "cash-deposit",
    title: "Cash Deposit Authorize",
    marathiTitle: "रोख जमा नोंद",
    route: "/authorization/transaction/cash-deposit",
    icon: ICON,
  },
  {
    id: "cash-withdrawal",
    title: "Cash Withdrawal Authorize",
    marathiTitle: "रोख पैसे काढणे",
    route: "/authorization/transaction/cash-withdrawal",
    icon: ICON,
  },
  {
    id: "rtgs",
    title: "RTGS Authorize",
    marathiTitle: "RTGS नोंद",
    route: "/authorization/transaction/rtgs",
    icon: ICON,
  },
  {
    id: "td-interest-payment-mark",
    title: "TD Interest Payment Mark Authorize",
    marathiTitle: "मुदत ठेव व्याज भुगतान चिन्हांकित",
    route: "/authorization/transaction/td-interest-payment",
    icon: ICON,
  },
  {
    id: "td-interest-payment",
    title: "TD Interest Payment Authorize",
    marathiTitle: "मुदत ठेव व्याज भुगतान",
    route: "/authorization/transaction/term-deposit-interest-payment",
    icon: ICON,
  },
  {
    id: "recurring-installment",
    title: "Recurring Installment Authorize",
    marathiTitle: "आवर्ती हप्ता नोंद",
    route: "/authorization/transaction/recurring-installment",
    icon: ICON,
  },
  {
    id: "tds-transaction",
    title: "TDS Transaction Authorize",
    marathiTitle: "TDS व्यवहार",
    route: "/authorization/transaction/tds-transaction",
    icon: ICON,
  },
  {
    id: "tl-cc-installment",
    title: "TL/CC Installment Authorize",
    marathiTitle: "TL/CC हप्ता नोंद",
    route: "/authorization/transaction/tl-cc-installment",
    icon: ICON,
  },
  {
    id: "tl-disbursement",
    title: "TL Disbursement Authorize",
    marathiTitle: "TL वितरण नोंद",
    route: "/authorization/transaction/tl-disbursement",
    icon: ICON,
  },
  {
    id: "tl-other-charges",
    title: "TL Other Charges Authorize",
    marathiTitle: "TL इतर शुल्क नोंद",
    route: "/authorization/transaction/tl-other-charges",
    icon: ICON,
  },
  {
    id: "transfer",
    title: "Transfer Authorize",
    marathiTitle: "हस्तांतरण नोंद",
    route: "/authorization/transaction/transfer",
    icon: ICON,
  },
  {
    id: "modify-tds-transaction",
    title: "Modify TDS Transaction Authorize",
    marathiTitle: "टीडीएस व्यवहार सुधारणे",
    route: "/authorization/transaction/modify-tds-transaction",
    icon: ICON,
  },
  {
    id: "new-pg-transaction-import",
    title: "New PG Transaction Import Authorize",
    marathiTitle: "नवीन पीजी व्यवहार आयात",
    route: "/authorization/transaction/new-pg-transaction-import",
    icon: ICON,
  },
  {
    id: "new-pg-transaction-export",
    title: "New PG Transaction Export Authorize",
    marathiTitle: "नवीन पीजी व्यवहार निर्यात",
    route: "/authorization/transaction/new-pg-transaction-export",
    icon: ICON,
  },
];


