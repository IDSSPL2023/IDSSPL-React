import { IMAGES } from "@/assets";
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

const FALLBACK_ICON = IMAGES.ELLIPSE_58_4;

/** Reusable list of transaction types shown on the Transaction Master landing page. */
export const TRANSACTION_TYPES: TransactionTypeItem[] = [
  {
    id: "cash-deposit",
    titleEn: "Cash Deposit",
    titleHi: "रोख रक्कम जमा",
    descriptionEn: "Enter the cash deposit transaction details.",
    icon: IMAGES.CASH_DEPOSIT,
    href: "/transactionmaster/cash-deposit",
  },
  {
    id: "cash-withdrawal",
    titleEn: "Cash Withdrawal",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the cash Withdrawal transaction details.",
    icon: IMAGES.CASH_WITHDRAWAL,
    href: "/transactionmaster/cash-withdrawal",
  },
  {
    id: "rtgs",
    titleEn: "RTGS",
    titleHi: "आरटीजीएस",
    descriptionEn: "Enter the RTGS transaction details.",
    icon: IMAGES.RTGS,
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
    icon: IMAGES.TD_INTEREST_PAYMENT,
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
    icon: IMAGES.TRANSFER,
    href: "/transactionmaster/transfer",
  },
  {
    id: "modify-tds-transaction",
    titleEn: "Modify TDS Transaction",
    titleHi: "टीडीएस व्यवहार सुधारणे",
    descriptionEn: "Modify the TDS transaction details.",
    icon: FALLBACK_ICON,
    href: "/transactionmaster/modify-tds-transaction",
  },
  {
    id: "new-pg-transaction-import",
    titleEn: "New PG Transaction Import",
    titleHi: "नवीन पीजी व्यवहार आयात",
    descriptionEn: "Import new PG transaction details.",
    icon: FALLBACK_ICON,
    href: "/transactionmaster/new-pg-transaction-import",
  },
  {
    id: "new-pg-transaction-export",
    titleEn: "New PG Transaction Export",
    titleHi: "नवीन पीजी व्यवहार निर्यात",
    descriptionEn: "Export new PG transaction details.",
    icon: FALLBACK_ICON,
    href: "/transactionmaster/new-pg-transaction-export",
  },
];
