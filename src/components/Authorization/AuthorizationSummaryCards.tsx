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
      {CATEGORIES.map((category) => {
        const isActive = category.key === active;
        return (
          <button
            key={category.key}
            type="button"
            onClick={() => onChange(category.key)}
            className={`flex min-w-37.5 flex-1 items-center gap-2 rounded-xl border bg-white py-3 pr-4 shadow-sm transition ${
              isActive
                ? "border-primary bg-primary-50"
                : "border-gray-200 hover:border-primary/50"
            }`}
          >
            <span className="h-5 w-0.75 shrink-0 rounded-full bg-primary" />
            <span className="text-sm font-semibold text-[#052F5B]">
              {tRaw(category.labelKey)}
            </span>
            <span className="ml-auto text-base font-bold text-[#052F5B]">
              {category.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AuthorizationSummaryCards;
