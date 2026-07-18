import { useBilingual } from "@/i18n/useBilingual";

export type AuthorizationCategoryKey =
  | "sbCa"
  | "deposit"
  | "loan"
  | "fixedAsset"
  | "investment";

export type AuthorizationCategory = {
  key: AuthorizationCategoryKey;
  labelKey: string;
  count: number;
};

const CATEGORIES: AuthorizationCategory[] = [
  { key: "sbCa", labelKey: "authorizeAccount.cards.sbCa", count: 82 },
  { key: "deposit", labelKey: "authorizeAccount.cards.deposit", count: 22 },
  { key: "loan", labelKey: "authorizeAccount.cards.loan", count: 3 },
  {
    key: "fixedAsset",
    labelKey: "authorizeAccount.cards.fixedAsset",
    count: 2,
  },
  {
    key: "investment",
    labelKey: "authorizeAccount.cards.investment",
    count: 2,
  },
];

type AuthorizationSummaryCardsProps = {
  active: AuthorizationCategoryKey;
  onChange: (key: AuthorizationCategoryKey) => void;
};

const AuthorizationSummaryCards = ({
  active,
  onChange,
}: AuthorizationSummaryCardsProps) => {
  const { tRaw } = useBilingual();

  return (
    <div className="flex w-full flex-wrap gap-3">
    </div>
  );
};

export default AuthorizationSummaryCards;
