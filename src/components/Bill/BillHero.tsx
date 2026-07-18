// src/components/Bill/HeroBill.tsx

import { useMemo, useState } from "react";
import {
   
  FileText,
  BadgeCheck,
  Receipt,
  Search,
} from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
// import BillHero from "./components/Bill/BillHero";

const BILLS = [
  {
    key: "ibcEntry",
    titleEn: "IBC Entry",
    titleHi: "आईबीसी एंट्री",
    icon: "Receipt",
  },
  {
    key: "ibcMark",
    titleEn: "IBC Mark",
    titleHi: "आईबीसी मार्क",
    icon: "BadgeCheck",
  },
  {
    key: "obcEntry",
    titleEn: "OBC Entry",
    titleHi: "ओबीसी एंट्री",
    icon: "FileText",
  },
  {
    key: "obcMark",
    titleEn: "OBC Mark",
    titleHi: "ओबीसी मार्क",
    icon: "BadgeCheck",
  },
];

const ICON_MAP = {
  Receipt,
  BadgeCheck,
  FileText,
};

interface HeroBillProps {
  onOpenIBCEntry?: () => void;
  onOpenIBCMark?: () => void;
  onOpenOBCEntry?: () => void;
  onOpenOBCMark?: () => void;
}

export default function HeroBill({
  onOpenIBCEntry,
  onOpenIBCMark,
  onOpenOBCEntry,
  onOpenOBCMark,
}: HeroBillProps) {
  const { en } = useBilingual();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(
    en("supportUtility.allMasters")
  );

  const TABS = [
    en("supportUtility.allMasters"),
    en("supportUtility.recentlyUsed"),
  ];

  const filteredBills = useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) return BILLS;

    return BILLS.filter(
      (item) =>
        item.titleEn.toLowerCase().includes(q) ||
        item.titleHi.toLowerCase().includes(q)
    );
  }, [query]);

  const Card = ({
    icon,
    titleEn,
    titleHi,
    onOpen,
  }: {
    icon: string;
    titleEn: string;
    titleHi: string;
    onOpen: () => void;
  }) => {
    const Icon = ICON_MAP[icon as keyof typeof ICON_MAP] || Receipt;

    return (
      <div className="group flex items-center justify-between rounded-md border border-[#E5E7EB] bg-white px-5 py-3 transition-all duration-200 hover:border-[#D7E3FF] hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[#052F5B]">
            <Icon className="text-white" size={22} />
          </div>

          <div>
            <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white">
              {titleEn}
            </h3>

            <p className="mt-1 text-[13px] text-[#9CA3AF]">
              {titleHi}
            </p>
          </div>
        </div>

        <button
          onClick={onOpen}
          className="rounded-full border border-[#2563EB] bg-[#EEF4FF] px-5 py-2 text-[15px] font-medium text-[#2563EB] transition hover:bg-[#E2ECFF]"
        >
          {en("supportUtility.open")}
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto min-w-7xl p-4">
      <div className="rounded-xl bg-white p-5 dark:bg-slate-900">

        {/* Hero */}

        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 px-6 py-10 text-center">

          <h1 className="text-[38px] font-bold text-white">
            Bill Utility
          </h1>

          <div className="mx-auto mt-6 flex max-w-xl items-center rounded-full bg-white px-4 py-2 shadow-lg">

            <Search
              size={18}
              className="mr-2 text-gray-400"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Bill Utility..."
              className="flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />

            <button className="rounded-md bg-primary-700 px-5 py-2 text-sm font-medium text-white hover:bg-primary-800">
              {en("supportUtility.show")}
            </button>
          </div>
        </div>

        {/* Tabs */}

        <div className="mt-6 mb-4 flex gap-6 border-b border-gray-200 dark:border-slate-800">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

          {filteredBills.map((bill) => (
            <Card
              key={bill.key}
              icon={bill.icon}
              titleEn={bill.titleEn}
              titleHi={bill.titleHi}
              onOpen={() => {
                switch (bill.key) {
                  case "ibcEntry":
                    onOpenIBCEntry?.();
                    break;

                  case "ibcMark":
                    onOpenIBCMark?.();
                    break;

                  case "obcEntry":
                    onOpenOBCEntry?.();
                    break;

                  case "obcMark":
                    onOpenOBCMark?.();
                    break;
                }
              }}
            />
          ))}

        </div>

      </div>
    </div>
  );
}