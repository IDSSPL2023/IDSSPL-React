// @ts-nocheck
import { useState, useMemo } from "react";
import {
  Settings, GitBranch, Layers, BookOpen, IdCard, Hash, Users, Home, FileText,
  Shield, Globe, MapPin, Building2, User, Car, Search,
} from "lucide-react";
import DataTable from "./DataTable";
import { MASTERS } from "./masterConfig";

const ICON_MAP = {
  Settings, GitBranch, Layers, BookOpen, IdCard, Hash, Users, Home, FileText,
  Shield, Globe, MapPin, Building2, User, Car,
};

const MasterCard = ({ icon, titleEn, titleHi, onOpen }) => {
  const Icon = ICON_MAP[icon] || Settings;
  return (
    <div className="group flex items-center justify-between rounded-md border border-[#E5E7EB] bg-white px-5 py-3 transition-all duration-200 hover:border-[#D7E3FF] hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800">
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
        className="ml-4 flex shrink-0 items-center gap-1 rounded-full border border-[#2563EB] bg-[#EEF4FF] px-5 py-2 text-[15px] font-medium text-[#2563EB] transition-all duration-200 hover:bg-[#E2ECFF] active:scale-95 dark:bg-primary-950/40 dark:hover:bg-primary-900/40"
      >
        <span>Open</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

const MasterList = ({ openMaster, onOpenMaster, tableRows, onRowsChange, filters, searchQuery }) => {
  const [query, setQuery] = useState("");

  const filteredMasters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MASTERS;
    return MASTERS.filter((m) => m.titleEn.toLowerCase().includes(q) || m.titleHi.toLowerCase().includes(q));
  }, [query]);

  if (openMaster) {
    return (
      <DataTable
        master={openMaster}
        rows={tableRows}
        filters={filters}
        searchQuery={searchQuery}
        onRowsChange={onRowsChange}
      />
    );
  }

  return (
    <div className="min-w-7xl mx-auto p-4">
      <div className="p-5 bg-white rounded-xl dark:bg-slate-900">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 px-6 py-10 text-center">
          <h1 className="text-white text-[32px] md:text-[38px] font-bold leading-tight">
            Welcome to Master
            <br />
            Maintenance Global
          </h1>
          <div className="mt-6 max-w-xl mx-auto flex items-center bg-white rounded-full px-4 py-2 shadow-lg">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search masters..."
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          {filteredMasters.length === 0 ? (
            <p className="col-span-2 py-8 text-center text-gray-400 dark:text-slate-500">No masters found</p>
          ) : (
            filteredMasters.map((master) => (
              <MasterCard
                key={master.key}
                icon={master.icon}
                titleEn={master.titleEn}
                titleHi={master.titleHi}
                onOpen={() => onOpenMaster(master)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterList;
