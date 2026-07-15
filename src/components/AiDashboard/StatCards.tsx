import type { DashboardCard } from "./types";
import { statusColorFor } from "./statusColors";
import { useTheme } from "@/components/theme/ThemeProvider";

function formatValue(value: number | string) {
  if (typeof value !== "number") return value;
  return new Intl.NumberFormat("en-IN").format(value);
}

const StatCards = ({ cards }: { cards: DashboardCard[] }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const accent = statusColorFor(card.title);
        const color = isDarkMode ? accent.dark : accent.light;

        return (
          <div
            key={card.title}
            style={{ borderLeftColor: color }}
            className="rounded-xl border border-l-4 border-gray-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="truncate text-xs font-medium text-[#52514E] dark:text-[#C3C2B7]">
              {card.title}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#0B0B0B] dark:text-white">
              {formatValue(card.value)}
            </p>
            {card.description ? (
              <p className="mt-0.5 truncate text-[11px] text-[#898781]">{card.description}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
