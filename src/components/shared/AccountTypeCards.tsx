import type { ComponentType } from "react";
import Link from "@/components/ui/Link";
import {
  ChevronRight,
  Wallet,
  Landmark,
  HandCoins,
  TrendingUp,
  PiggyBank,
  Building2,
} from "lucide-react";

export interface OptionCardData {
  id: string;
  title: string;
  titleMr: string;
  description: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  isNew?: boolean;
}

interface OptionCardProps {
  option: OptionCardData;
}

export function OptionCard({ option }: OptionCardProps) {
  const { title, titleMr, description, href, icon: Icon, iconBg, isNew = true } = option;

  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-[20px] border-x border-b border-l-5 border-[#0A66D8] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon size={26} className="text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-[#1F2858]">
          {title} <span className="text-slate-600">/ {titleMr}</span>
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {isNew && (
            <span className="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary">
              New
            </span>
          )}
          <span className="truncate text-sm text-slate-500">{description}</span>
        </div>
      </div>

      <span className="flex shrink-0 items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-100">
        Open <ChevronRight size={16} />
      </span>
    </Link>
  );
}

interface OptionGridProps {
  options: OptionCardData[];
}

/** All option cards share one accent color so Account Master and Account Closing look consistent. */
const ICON_BG = "bg-primary-500";

export const accountClosingOptions: OptionCardData[] = [
  {
    id: "ca-sa",
    title: "CA/SA",
    titleMr: "चालू/बचत खाते",
    description: "Enter the CA/SA account closing details.",
    href: "/account-closing/ca-sa",
    icon: Wallet,
    iconBg: ICON_BG,
  },
  {
    id: "deposit",
    title: "Deposit",
    titleMr: "ठेव",
    description: "Enter the Deposit account closing details.",
    href: "/account-closing/deposit",
    icon: Landmark,
    iconBg: ICON_BG,
  },
  {
    id: "loan",
    title: "Loan",
    titleMr: "कर्ज",
    description: "Enter the Loan account closing details.",
    href: "/account-closing/loan",
    icon: HandCoins,
    iconBg: ICON_BG,
  },
  {
    id: "investment",
    title: "Investment",
    titleMr: "गुंतवणूक",
    description: "Enter the Investment account closing details.",
    href: "/account-closing/investment",
    icon: TrendingUp,
    iconBg: ICON_BG,
  },
  {
    id: "pigmy",
    title: "Pigmy",
    titleMr: "पिग्मी",
    description: "Enter the Pigmy account closing details.",
    href: "/account-closing/pigmy",
    icon: PiggyBank,
    iconBg: ICON_BG,
  },
];

export const accountMasterOptions: OptionCardData[] = [
  {
    id: "ca-sa",
    title: "CA/SA",
    titleMr: "चालू/बचत खाते",
    description: "Enter the CA/SA application details.",
    href: "/account-master/ca-sa",
    icon: Wallet,
    iconBg: ICON_BG,
  },
  {
    id: "deposit",
    title: "Deposit",
    titleMr: "ठेव",
    description: "Enter the Deposit application details.",
    href: "/account-master/deposit",
    icon: Landmark,
    iconBg: ICON_BG,
  },
  {
    id: "loan",
    title: "Loan",
    titleMr: "कर्ज",
    description: "Enter the Loan application details.",
    href: "/account-master/loan",
    icon: HandCoins,
    iconBg: ICON_BG,
  },
  {
    id: "investment",
    title: "Investment",
    titleMr: "गुंतवणूक",
    description: "Enter the Investment application details.",
    href: "/account-master/investment",
    icon: TrendingUp,
    iconBg: ICON_BG,
  },
  {
    id: "fixed-asset",
    title: "Fixed Asset",
    titleMr: "स्थायी मालमत्ता",
    description: "Enter the Fixed Asset application details.",
    href: "/account-master/fixed-asset",
    icon: Building2,
    iconBg: ICON_BG,
  },
    {
    id: "pigmy",
    title: "Pigmy",
    titleMr: "पिग्मी",
    description: "Enter the Pigmy account closing details.",
    href: "/account-closing/pigmy",
    icon: PiggyBank,
    iconBg: ICON_BG,
  },
];

// Kept for backward compatibility with any existing imports —
// same data as accountMasterOptions.
export const applicationOptions: OptionCardData[] = accountMasterOptions;

export function OptionGrid({ options }: OptionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {options.map((option, i) => {
        const isLastOdd = options.length % 2 === 1 && i === options.length - 1;
        return (
          <div key={option.id} className={isLastOdd ? "md:col-span-2 md:mx-auto md:w-1/2" : ""}>
            <OptionCard option={option} />
          </div>
        );
      })}
    </div>
  );
}