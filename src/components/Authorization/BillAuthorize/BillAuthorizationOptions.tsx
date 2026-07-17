// src/components/Authorization/BillAuthorize/BillAuthorizationOptions.tsx
import { useMemo, useState } from "react";
import { Landmark, ArrowLeftRight, Banknote, History, Search, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

// Import all 4 modals
import IBCAuthorizeModal from "./IBCauthorize";
import IBCRealizeUnrealizeAuthorizeModal from "./IBCrealizeunrealizeauthorize";
import OBCAuthorizeModal from "./OBCauthorize";
import OBCRealizeUnrealizeAuthorizeModal from "./OBCrealizeunrealizeauthorize";

const ICON_MAP = {
  Landmark,
  ArrowLeftRight,
  Banknote,
  History,
};

const BILL_OPTIONS = [
  {
    key: "ibc-authorize",
    icon: "Landmark",
    titleEn: "IBC Authorize",
    titleHi: "आयबीसी अधिकृत करा",
  },
  {
    key: "ibc-realize-unrealize-authorize",
    icon: "ArrowLeftRight",
    titleEn: "IBC Realize Unrealize Authorize",
    titleHi: "आयबीसी रिअलाइझ अनरिअलाइझ अधिकृत करा",
  },
  {
    key: "obc-authorize",
    icon: "Banknote",
    titleEn: "OBC Authorize",
    titleHi: "ओबीसी अधिकृत करा",
  },
  {
    key: "obc-realize-unrealize-authorize",
    icon: "History",
    titleEn: "OBC Realize Unrealize Authorize",
    titleHi: "ओबीसी रिअलाइझ अनरिअलाइझ अधिकृत करा",
  },
];

export default function BillAuthorizationOptions() {
  const { en } = useBilingual();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(en("supportUtility.allMasters"));
  
  // Modal state - simple boolean with key
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: string | null;
  }>({ isOpen: false, type: null });

  const TABS = [en("supportUtility.allMasters"), en("supportUtility.recentlyUsed")];

  const filteredOptions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return BILL_OPTIONS;
    return BILL_OPTIONS.filter(
      (item) =>
        item.titleEn.toLowerCase().includes(q) ||
        item.titleHi.toLowerCase().includes(q)
    );
  }, [query]);

  // Open modal function
  const openModal = (type: string) => {
    setModalState({ isOpen: true, type });
  };

  // Close modal function
  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  const Card = ({ icon, titleEn, titleHi, onOpen }: any) => {
    const Icon = ICON_MAP[icon as keyof typeof ICON_MAP] || Landmark;
    return (
      <div
        className="group flex cursor-pointer items-center justify-between rounded-md border border-[#E5E7EB] bg-white px-5 py-3 transition-all duration-200 hover:border-[#D7E3FF] hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        onClick={onOpen}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[#052F5B]">
            <Icon className="text-white" size={22} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white">
              {titleEn}
            </h3>
            <p className="mt-1 text-[13px] text-[#9CA3AF]">{titleHi}</p>
          </div>
        </div>
        <span className="rounded-full border border-[#2563EB] bg-[#EEF4FF] px-5 py-2 text-[15px] font-medium text-[#2563EB] transition group-hover:bg-[#E2ECFF]">
          {en("supportUtility.open")}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="mx-auto min-w-7xl p-4">
        <div className="rounded-xl bg-white p-5 dark:bg-slate-900">
          {/* Hero */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 px-6 py-10 text-center">
            <h1 className="text-[38px] font-bold text-white">Bill Authorization</h1>
            <div className="mx-auto mt-6 flex max-w-xl items-center rounded-full bg-white px-4 py-2 shadow-lg">
              <Search size={18} className="mr-2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Bill Authorization..."
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
            {filteredOptions.map((option) => (
              <Card
                key={option.key}
                icon={option.icon}
                titleEn={option.titleEn}
                titleHi={option.titleHi}
                onOpen={() => openModal(option.key)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Render Modals based on state */}
      {modalState.isOpen && modalState.type === "ibc-authorize" && (
        <IBCAuthorizeModal open={true} onClose={closeModal} />
      )}
      {modalState.isOpen && modalState.type === "ibc-realize-unrealize-authorize" && (
        <IBCRealizeUnrealizeAuthorizeModal open={true} onClose={closeModal} />
      )}
      {modalState.isOpen && modalState.type === "obc-authorize" && (
        <OBCAuthorizeModal open={true} onClose={closeModal} />
      )}
      {modalState.isOpen && modalState.type === "obc-realize-unrealize-authorize" && (
        <OBCRealizeUnrealizeAuthorizeModal open={true} onClose={closeModal} />
      )}
    </>
  );
}