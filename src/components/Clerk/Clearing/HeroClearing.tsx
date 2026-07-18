import { useMemo, useState, type FC } from "react";
import {
  Search,
  Landmark,
  ScrollText,
  ArrowLeftRight,
  Banknote,
  ClipboardList,
  CalendarCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileInput,
  Inbox,
  AlertTriangle,
  Send,
} from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import { CLEARING_MASTERS } from "./masterConfig";

const ICON_MAP: Record<string, FC<{ size?: number; strokeWidth?: number; className?: string }>> = {
  ScrollText,
  ArrowLeftRight,
  Banknote,
  Landmark,
  ClipboardList,
  CalendarCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileInput,
  Inbox,
  AlertTriangle,
  Send,
};

interface HeroClearingProps {
  onOpenMaster: (masterKey: string) => void;
}

const HeroClearing: FC<HeroClearingProps> = ({ onOpenMaster }) => {
  const { en, t } = useBilingual();
  const [activeTab, setActiveTab] = useState(en("clearing.hero.allMasters"));
  const [query, setQuery] = useState("");

  const TABS = [en("clearing.hero.allMasters"), en("clearing.hero.recentlyUsed")];

  const filteredMasters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CLEARING_MASTERS;
    return CLEARING_MASTERS.filter((m) => {
      const title = en(m.cardTitleKey).toLowerCase();
      const titleSecondary = t(m.cardTitleKey).toLowerCase();
      return title.includes(q) || titleSecondary.includes(q);
    });
  }, [query, en, t]);

  return (
    <div className="min-w-7xl mx-auto p-4">
      <div className="p-5 bg-white rounded-xl dark:bg-slate-900">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 px-6 py-10 text-center">
          <h1 className="text-white text-[38px] font-bold leading-tight">{en("clearing.hero.welcomeTitle")}</h1>

          <div className="mt-6 max-w-xl mx-auto flex items-center bg-white rounded-full px-4 py-2 shadow-lg">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={en("clearing.hero.searchPlaceholder")}
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            <button
              type="button"
              className="bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-md px-5 py-2 transition-colors"
            >
              {en("clearing.hero.show")}
            </button>
          </div>
        </div>

        <div className="flex gap-6 border-b border-gray-200 mt-6 mb-4 dark:border-slate-800">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "text-primary border-primary"
                  : "text-gray-500 border-transparent hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredMasters.length === 0 ? (
            <p className="col-span-2 py-8 text-center text-gray-400 dark:text-slate-500">
              {en("clearing.hero.noUtilitiesFound")}
            </p>
          ) : (
            filteredMasters.map((master) => {
              const Icon = ICON_MAP[master.icon] ?? Landmark;
              return (
                <div
                  key={master.key}
                  className="group flex items-center justify-between rounded-md border border-[#E5E7EB] bg-white px-5 py-3 transition-all duration-200 hover:border-[#D7E3FF] hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[#052F5B]">
                      <Icon size={22} strokeWidth={2} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-semibold leading-5 text-[#111827] dark:text-slate-100">
                        {en(master.cardTitleKey)}
                      </h3>
                      {t(master.cardTitleKey) ? (
                        <p className="mt-1 text-[13px] leading-4 text-[#9CA3AF] dark:text-slate-400">
                          {t(master.cardTitleKey)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenMaster(master.key)}
                    className="ml-4 flex shrink-0 items-center gap-1 rounded-full border border-[#2563EB] bg-[#EEF4FF] px-5 py-2 text-[15px] font-medium text-[#2563EB] transition-all duration-200 hover:bg-[#E2ECFF] active:scale-95 dark:bg-primary-950/40 dark:hover:bg-primary-900/40"
                  >
                    <span>{en("clearing.hero.open")}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroClearing;
