// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import {
  Wallet, UserCircle, ShieldCheck, GitBranch, SlidersHorizontal, CreditCard,
  ShieldAlert, Keyboard, Package, Share2, FileText, Coins, IndianRupee, Users,
  BookUser, Globe2, Landmark, Settings, Box, FileEdit, Lock, BadgeCheck,
  RefreshCcw, MessageSquare, ScanLine, Users2, UserSquare2, Layers,
  CircleUserRound, Diamond, ArchiveX, UserCog, Banknote, Receipt, UserPen,
  ImageIcon, FileSignature, Clock, Search,
} from "lucide-react";
import DataTable from "./DataTable";
import { MASTERS, getMasterConfig } from "./masterConfig";
import { useNavigate, useLocation } from "react-router-dom";

const ICON_MAP = {
  Wallet, UserCircle, ShieldCheck, GitBranch, SlidersHorizontal, CreditCard,
  ShieldAlert, Keyboard, Package, Share2, FileText, Coins, IndianRupee, Users,
  BookUser, Globe2, Landmark, Settings, Box, FileEdit, Lock, BadgeCheck,
  RefreshCcw, MessageSquare, ScanLine, Users2, UserSquare2, Layers,
  CircleUserRound, Diamond, ArchiveX, UserCog, Banknote, Receipt, UserPen,
  ImageIcon, FileSignature, Clock,
};

const TABS = ["All Masters", "Recently Used"];

const ROUTED_MASTER_KEYS = {
  branch: "/branchmaster",
  clearingType: "/headoffice/clearintype",
  productMaster: "/headoffice/productmaster",
  tdInterestRate: "/headoffice/tdinterestrate",
  installmentType: "/headoffice/installmenttype",
  instrumentType: "/headoffice/instrumenttype",
  industry: "/headoffice/industrymaster",
  depositRule: "/headoffice/depositrule",
  glAccount: "/headoffice/glaccountmaster",
  finalAccountGroup: "/headoffice/finalaccountgroup",
};

// Masters that work without a dedicated route redirect (opened inline, still
// backed by real APIs) — these stay enabled even though they aren't in
// ROUTED_MASTER_KEYS.
const WORKS_WITHOUT_ROUTE = new Set(["defaultBranchAccounts"]);

const isMasterEnabled = (key) => Boolean(ROUTED_MASTER_KEYS[key]) || WORKS_WITHOUT_ROUTE.has(key);

const MasterCard = ({ icon, titleEn, titleHi, onOpen, disabled }) => {
  const Icon = ICON_MAP[icon] || Wallet;

  return (
    <div className={`group flex items-center justify-between rounded-md border border-[#E5E7EB] bg-white px-5 py-3 transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 ${disabled ? "opacity-60" : "hover:border-[#D7E3FF] hover:shadow-md dark:hover:border-primary-800"}`}>
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[#052F5B]">
          <Icon size={22} strokeWidth={2} className="text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold leading-5 text-[#111827] dark:text-slate-100">{titleEn}</h3>
          <p className="mt-1 text-[13px] leading-4 text-[#9CA3AF] dark:text-slate-400">{titleHi}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        disabled={disabled}
        title={disabled ? "Coming soon" : undefined}
        className={`ml-4 flex shrink-0 items-center gap-1 rounded-full border px-5 py-2 text-[15px] font-medium transition-all duration-200 ${
          disabled
            ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
            : "border-[#2563EB] bg-[#EEF4FF] text-[#2563EB] hover:bg-[#E2ECFF] active:scale-95 dark:bg-primary-950/40 dark:hover:bg-primary-900/40"
        }`}
      >
        <span>Open</span>
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

const HeroOffice = ({ openMaster, setOpenMaster, tableRows, onRowsChange, filters }) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const filteredMasters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MASTERS;
    return MASTERS.filter(
      (m) =>
        m.titleEn.toLowerCase().includes(q) ||
        m.titleHi.toLowerCase().includes(q)
    );
  }, [query]);

  // Side-effect: navigate away, don't return the navigate() call itself.
  // Skip the redirect when we're already on the target route (e.g. the page
  // was opened directly via its dedicated URL), otherwise this would loop
  // back to itself and never render the table.
  const routedPath = openMaster && ROUTED_MASTER_KEYS[openMaster.key];
  const needsRedirect = routedPath && location.pathname !== routedPath;
  useEffect(() => {
    if (needsRedirect) {
      navigate(routedPath);
    }
  }, [needsRedirect, routedPath, navigate]);

  if (needsRedirect) {
    return null; // render nothing while the redirect happens
  }

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
            Welcome to Master
            <br />
            Maintenance Headoffice
          </h1>

          <div className="mt-6 max-w-xl mx-auto flex items-center bg-white rounded-full px-4 py-2 shadow-lg">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search masters..."
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            <button
              type="button"
              className="ml-2 shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Show
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
            <p className="col-span-2 py-8 text-center text-gray-400 dark:text-slate-500">No masters found</p>
          ) : (
            filteredMasters.map((master) => (
              <MasterCard
                key={master.key}
                icon={master.icon}
                titleEn={master.titleEn}
                titleHi={master.titleHi}
                disabled={!isMasterEnabled(master.key)}
                onOpen={() => setOpenMaster(master)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { getMasterConfig };
export default HeroOffice;
