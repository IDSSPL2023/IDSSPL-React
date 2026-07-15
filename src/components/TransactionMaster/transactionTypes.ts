import type { ComponentType } from "react";

export interface TransactionTypeItem {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  /** Path to a /public illustration, or a Lucide icon component (paired with iconBg). */
  icon: string | ComponentType<{ size?: number; className?: string }>;
  /** Icon-circle background color, used only when `icon` is a component (not an image path). */
  iconBg?: string;
  /** Route to open when this transaction type is implemented. */
  href?: string;
}

const FALLBACK_ICON = "/Ellipse 58 (4).png";

/** Reusable list of transaction types shown on the Transaction Master landing page. */
export const TRANSACTION_TYPES: TransactionTypeItem[] = [
  {
    id: "cash-deposit",
    titleEn: "Cash Deposit",
    titleHi: "रोख रक्कम जमा",
    descriptionEn: "Enter the cash deposit transaction details.",
    icon: "/cash deposite.png",
    href: "/transactionmaster/cash-deposit",
  },
  {
    id: "cash-withdrawal",
    titleEn: "Cash Withdrawal",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the cash Withdrawal transaction details.",
    icon: "/Cash Withdrawal.png",
    href: "/transactionmaster/cash-withdrawal",
  },
  {
    id: "rtgs",
    titleEn: "RTGS",
    titleHi: "आरटीजीएस",
    descriptionEn: "Enter the RTGS transaction details.",
    icon: "/RTGS.png",
    href: "/transactionmaster/rtgs",
  },
  {
    id: "tds-transaction",
    titleEn: "TDS Transaction",
    titleHi: "टीडीएस व्यवहार",
    descriptionEn: "Enter the TDS transaction details.",
    icon: FALLBACK_ICON,
    href: "/transactionmaster/tds-transaction",
  },
  {
    id: "td-interest-payment",
    titleEn: "TD Interest Payment",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the TD Interest Payment transaction details.",
    icon: "/TD Intrest Payment.png",
    href: "/transactionmaster/td-interest-payment",
  },
  {
    id: "recurring-installment",
    titleEn: "Recurring Installment",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the Recurring Installment transaction details.",
    icon: FALLBACK_ICON,
    href: "/transactionmaster/recurring-installment",
  },
  {
    id: "tl-cc-installment",
    titleEn: "TL/CC Installment",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the TL/CC Installment transaction details.",
    icon: FALLBACK_ICON,
    href: "/transactionmaster/tl-cc-installment", 
  },
  {
    id: "tl-disbursement",
    titleEn: "TL Disbursement",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the RTGS transaction details.",
    icon: FALLBACK_ICON,
    href: "/transactionmaster/tl-disbursement",
  },
  {
    id: "tl-other-charges",
    titleEn: "TL Other Charges",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the TL Other Charges transaction details.",
    icon: FALLBACK_ICON,
    href: "/transactionmaster/tl-other-charges",
  },
  {
    id: "transfer",
    titleEn: "Transfer",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the Transfer transaction details.",
    icon: "/Transfer.png",
    href: "/transactionmaster/transfer",
  },
];
