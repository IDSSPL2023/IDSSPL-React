// src/components/SupportUtility/HeroSupportUtility.tsx
import { useState, useMemo } from "react";
import {
  Wallet, Landmark, History, Banknote, ScrollText, ArrowLeftRight, Coins,
  Percent, ShieldCheck, Search,
} from "lucide-react";
import DataTable from "./DataTable";
import { MASTERS, getMasterConfig } from "./masterConfig";
import { useBilingual } from "@/i18n/useBilingual";

const ICON_MAP = {
  Wallet, Landmark, History, Banknote, ScrollText, ArrowLeftRight, Coins,
  Percent, ShieldCheck,
};

// Normalize a title so small differences (spacing/casing) don't break matching.
const normalize = (s = "") => s.toLowerCase().replace(/\s+/g, " ").trim();

// Master cards that should open a modal directly instead of the table view.
// If highlighting still doesn't show up, console.log(master.titleEn) inside
// the .map() below to see the EXACT string masterConfig.ts is giving you,
// then update the strings here to match exactly.
const TXN_BALANCE_TITLE = normalize("Update TXN Balance");
const TXN_CURRENT_BALANCE_TITLE = normalize("Update TXN Current Balance");

const HeroSupportUtility = ({
  openMaster,
  setOpenMaster,
  onOpenAccountLookup,
  onOpenSupportAuditTrail,
  onOpenTxnBalance,          // NEW
  onOpenTxnCurrentBalance,   // NEW
  tableRows,
  onRowsChange,
  filters,
}) => {
  const { en } = useBilingual();
  const [activeTab, setActiveTab] = useState(en("supportUtility.allMasters"));
  const [query, setQuery] = useState("");

  const TABS = [en("supportUtility.allMasters"), en("supportUtility.recentlyUsed")];

  const MasterCard = ({ icon, titleEn, titleHi, onOpen, highlighted }) => {
    const Icon = ICON_MAP[icon] || Wallet;

    return (
      <div
        className={`group flex items-center justify-between rounded-md border px-5 py-3 transition-all duration-200 hover:shadow-md dark:bg-slate-900 ${
          highlighted
            ? "border-[#2563EB] bg-[#EEF4FF] hover:border-[#2563EB] dark:border-primary-700 dark:bg-primary-950/30"
            : "border-[#E5E7EB] bg-white hover:border-[#D7E3FF] dark:border-slate-800 dark:hover:border-primary-800"
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[#052F5B]">
            <Icon size={22} strokeWidth={2} className="text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold leading-5 text-[#111827] dark:text-slate-100">{titleEn}</h3>
            {titleHi ? (
              <p className="mt-1 text-[13px] leading-4 text-[#9CA3AF] dark:text-slate-400">{titleHi}</p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="ml-4 flex shrink-0 items-center gap-1 rounded-full border border-[#2563EB] bg-[#EEF4FF] px-5 py-2 text-[15px] font-medium text-[#2563EB] transition-all duration-200 hover:bg-[#E2ECFF] active:scale-95 dark:bg-primary-950/40 dark:hover:bg-primary-900/40"
        >
          <span>{en("supportUtility.open")}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    );
  };

  const Tab = ({ label, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
        active ? "text-primary border-primary" : "text-gray-500 border-transparent hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );

  const filteredMasters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MASTERS;
    return MASTERS.filter(
      (m) =>
        m.titleEn.toLowerCase().includes(q) ||
        m.titleHi.toLowerCase().includes(q)
    );
  }, [query]);

  if (openMaster) {
    return (
      <DataTable
        master={openMaster}
        rows={tableRows}
        filters={filters}
        onRowsChange={onRowsChange}
      />
    );
  }

  return (
    <div className="min-w-7xl mx-auto p-4">
      <div className="p-5 bg-white rounded-xl dark:bg-slate-900">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 px-6 py-10 text-center">
          <h1 className="text-white text-[38px] font-bold leading-tight">
            {en("supportUtility.welcomeTitle")}
            <br />
            {en("supportUtility.welcomeSubtitle")}
          </h1>

          <div className="mt-6 max-w-xl mx-auto flex items-center bg-white rounded-full px-4 py-2 shadow-lg">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={en("supportUtility.searchPlaceholder")}
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            <button
              type="button"
              className="bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-md px-5 py-2 transition-colors"
            >
              {en("supportUtility.show")}
            </button>
          </div>
        </div>

        <div className="flex gap-6 border-b border-gray-200 mt-6 mb-4 dark:border-slate-800">
          {TABS.map((tab) => (
            <Tab key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredMasters.length === 0 ? (
            <p className="col-span-2 py-8 text-center text-gray-400 dark:text-slate-500">{en("supportUtility.noUtilitiesFound")}</p>
          ) : (
            filteredMasters.map((master) => {
              const normTitle = normalize(master.titleEn);
              const isTxnBalance = normTitle === TXN_BALANCE_TITLE;
              const isTxnCurrentBalance = normTitle === TXN_CURRENT_BALANCE_TITLE;
              const highlighted = isTxnBalance || isTxnCurrentBalance;

              return (
                <MasterCard
                  key={master.key}
                  icon={master.icon}
                  titleEn={master.titleEn}
                  titleHi={master.titleHi}
                  highlighted={highlighted}
                  onOpen={() => {
                    if (isTxnBalance) return onOpenTxnBalance?.();
                    if (isTxnCurrentBalance) return onOpenTxnCurrentBalance?.();
                    if (master.key === "supportAuditTrail") return onOpenSupportAuditTrail();
                    if (master.uiType === "accountLookupTable") return onOpenAccountLookup(master);
                    return setOpenMaster(master);
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export { getMasterConfig };
export default HeroSupportUtility;