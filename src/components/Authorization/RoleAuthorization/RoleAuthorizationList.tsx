import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Home,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  SlidersHorizontal,
  Filter,
  X,
} from "lucide-react";
import SrNoBadge from "../../shared/SrNoBadge";
import StatusPill from "../../shared/StatusPill";
import SortableHeaderLabel from "../../shared/SortableHeaderLabel";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type RoleAuthTab = "new" | "modify" | "rejected";

export interface RoleAuthorizationRow {
  srNo: number;
  userId: string;
  name: string;
  createdBy: string;
  createdDate: string;
  status: string;
  tab: RoleAuthTab;
}

export interface RoleFilters {
  userId?: string;
  name?: string;
  createdBy?: string;
}

interface RoleAuthorizationListProps {
  rows?: RoleAuthorizationRow[];
  onBack: () => void;
  /** Clicking the Action icon opens the Authorization screen directly — no dropdown. */
  onAuthorize: (row: RoleAuthorizationRow) => void;
}

/* ------------------------------------------------------------------ */
/*  Sample data — swap for real API results                            */
/* ------------------------------------------------------------------ */

const TAB_STATUS_LABEL: Record<RoleAuthTab, string> = {
  new: "Authorization Pending",
  modify: "Modification Pending",
  rejected: "Authorization Rejected",
};

const TAB_STATUS_TONE: Record<RoleAuthTab, "pending" | "rejected"> = {
  new: "pending",
  modify: "pending",
  rejected: "rejected",
};

const buildRows = (tab: RoleAuthTab, count: number): RoleAuthorizationRow[] =>
  Array.from({ length: count }, (_, i) => ({
    srNo: i + 1,
    userId: "AMT",
    name: "Akshay Om More",
    createdBy: "Admin",
    createdDate: "23-May-2026",
    status: TAB_STATUS_LABEL[tab],
    tab,
  }));

export const TAB_COUNTS: Record<RoleAuthTab, number> = {
  new: 10,
  modify: 6,
  rejected: 6,
};

export const SAMPLE_ROLE_AUTH_ROWS: RoleAuthorizationRow[] = [
  ...buildRows("new", TAB_COUNTS.new),
  ...buildRows("modify", TAB_COUNTS.modify),
  ...buildRows("rejected", TAB_COUNTS.rejected),
];

/* ------------------------------------------------------------------ */
/*  Columns — mirrors CustomerAuthorizationTable's column config        */
/* ------------------------------------------------------------------ */

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "90px" },
  { key: "action", label: "Action", sortable: false, width: "100px" },
  { key: "status", label: "Status", sortable: true, width: "210px" },
  { key: "userId", label: "User ID", sortable: true, width: "180px" },
  { key: "name", label: "Name", sortable: true, width: "250px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "180px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "180px" },
] as const;

type SortKey = Exclude<(typeof columns)[number]["key"], "action">;

const TABS: { key: RoleAuthTab; label: string }[] = [
  { key: "new", label: "New Authorization" },
  { key: "modify", label: "Modify Authorization" },
  { key: "rejected", label: "Authorize Rejected" },
];

/* ------------------------------------------------------------------ */
/*  Header                                                              */
/* ------------------------------------------------------------------ */

function ScreenHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="border-b border-slate-100 bg-white px-8 py-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1E2B5B]">Role Authorization</h1>
          <nav className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-400">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
            <span>&gt;</span>
            <span>MIS Activity</span>
            <span>&gt;</span>
            <span>Authorization</span>
            <span>&gt;</span>
            <span className="font-medium text-primary">Role Authorization</span>
          </nav>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tabs + Filter trigger (icon only — click disabled for now)          */
/* ------------------------------------------------------------------ */

function TabBar({
  activeTab,
  counts,
  onChange,
}: {
  activeTab: RoleAuthTab;
  counts: Record<RoleAuthTab, number>;
  onChange: (tab: RoleAuthTab) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-white px-8 py-4">
      <div className="flex flex-wrap items-center gap-6">
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={
                active
                  ? "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                  : "flex items-center gap-2 px-1 py-2 text-sm font-semibold text-slate-700"
              }
            >
              {tab.label}
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                  active ? "bg-white text-primary" : "bg-slate-100 text-slate-600"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Filter"
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-primary bg-white text-primary transition hover:bg-[#F8FBFF]"
      >
        <Filter size={18} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter Drawer — kept in file for later use, not rendered right now */
/* ------------------------------------------------------------------ */

function FilterDrawer({
  isOpen,
  draft,
  onChange,
  onClose,
  onApply,
  onClear,
}: {
  isOpen: boolean;
  draft: RoleFilters;
  onChange: (next: RoleFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z- 50 flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-[380px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <SlidersHorizontal className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h2 className="text-[18px] font-semibold text-slate-800">Filters</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">User ID</label>
            <input
              type="text"
              value={draft.userId ?? ""}
              onChange={(e) => onChange({ ...draft, userId: e.target.value })}
              placeholder="Enter User ID"
              className="h-11 w-full rounded-xl border border-slate-300 px-3.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              value={draft.name ?? ""}
              onChange={(e) => onChange({ ...draft, name: e.target.value })}
              placeholder="Enter Name"
              className="h-11 w-full rounded-xl border border-slate-300 px-0.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Created By</label>
            <input
              type="text"
              value={draft.createdBy ?? ""}
              onChange={(e) => onChange({ ...draft, createdBy: e.target.value })}
              placeholder="Enter Created By"
              className="h-11 w-full rounded-xl border border-slate-300 px-3.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClear}
            className="flex-1 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                                */
/* ------------------------------------------------------------------ */

export default function RoleAuthorizationList({
  rows = SAMPLE_ROLE_AUTH_ROWS,
  onBack,
  onAuthorize,
}: RoleAuthorizationListProps) {
  const [activeTab, setActiveTab] = useState<RoleAuthTab>("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<RoleFilters>({});
  const [filterDraft, setFilterDraft] = useState<RoleFilters>({});

  const counts = useMemo(() => {
    return rows.reduce<Record<RoleAuthTab, number>>(
      (acc, row) => {
        acc[row.tab] = (acc[row.tab] ?? 0) + 1;
        return acc;
      },
      { new: 0, modify: 0, rejected: 0 }
    );
  }, [rows]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (row.tab !== activeTab) return false;
      if (filters.userId && !row.userId.toLowerCase().includes(filters.userId.toLowerCase())) return false;
      if (filters.name && !row.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.createdBy && !row.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())) return false;
      return true;
    });
  }, [rows, activeTab, filters]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortKey, sortAsc]);

  const paginationItems = useMemo(
    () => [1, "ellipsis", 98, 99, 100, 101, 102, 103, "ellipsis", 125] as (number | "ellipsis")[],
    []
  );

  const handleTabChange = (tab: RoleAuthTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setPageInput("1");
  };

  const applyFilters = () => {
    setFilters(filterDraft);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilterDraft({});
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ScreenHeader onBack={onBack} />
      <TabBar activeTab={activeTab} counts={counts} onChange={handleTabChange} />

      <div className="px-8 pb-8 pt-5">
        {/* Table — same shell as CustomerAuthorizationTable */}
        <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="table-container relative overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse min-w-[1190px] table-fixed">
              <thead>
                <tr className="bg-primary">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key as SortKey)}
                      className={`text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap overflow-visible ${
                        col.sortable ? "cursor-pointer select-none" : ""
                      }`}
                      style={{ width: col.width, minWidth: col.width }}
                    >
                      <div className={col.key === "status" ? "flex justify-center" : ""}>
                        <SortableHeaderLabel label={col.label} sortable={col.sortable} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, idx) => (
                  <tr
                    key={`${row.tab}-${row.srNo}`}
                    className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50`}
                  >
                    <td className="px-9 py-3" style={{ width: "90px" }}>
                      <SrNoBadge value={row.srNo} />
                    </td>

                    {/* Action — kept exactly as before: direct click, no dropdown */}
                    <td className="px-9 py-3" style={{ width: "100px" }}>
                      <button
                        type="button"
                        onClick={() => onAuthorize(row)}
                        aria-label="Open Authorize Account"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-primary-50 hover:text-primary"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>

                    {/* Status — centered */}
                    <td className="px-6 py-3 text-center" style={{ width: "210px" }}>
                      <div className="flex justify-center">
                        <StatusPill label={row.status} tone={TAB_STATUS_TONE[row.tab]} />
                      </div>
                    </td>

                    <td className="px-19 py-3 text-[16px] font-bold text-gray-900 truncate" style={{ width: "180px" }}>
                      {row.userId}
                    </td>

                    <td className="px-19 py-3 text-[16px] text-gray-700 truncate" style={{ width: "250px" }}>
                      {row.name}
                    </td>

                    <td className="px-19 py-3 text-[16px] text-gray-700 truncate" style={{ width: "180px" }}>
                      {row.createdBy}
                    </td>

                    <td className="px-13 py-3 text-[16px] text-gray-700 truncate" style={{ width: "180px" }}>
                      {row.createdDate}
                    </td>
                  </tr>
                ))}

                {sortedRows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-slate-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination — unchanged */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft size={15} />
            Back
          </button>

          {paginationItems.map((item, idx) =>
            item === "ellipsis" ? (
              <span key={`e-${idx}`} className="flex h-8 w-8 items-center justify-center text-sm text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCurrentPage(item);
                  setPageInput(String(item));
                }}
                className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium ${
                  currentPage === item
                    ? "bg-primary text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => p + 1)}
            className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Next
            <ChevronRight size={15} />
          </button>
          
          <div className="ml-2 flex items-center gap-2">
            <span className="text-sm text-slate-500">Page</span>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="h-8 w-14 rounded-md border border-slate-300 bg-white px-2 text-center text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => {
                const n = Number(pageInput);
                if (!Number.isNaN(n) && n > 0) setCurrentPage(n);
              }}
              className="text-sm font-medium text-primary hover:underline"
            >
              Go
            </button>
          </div>
        </div>
      </div>

   
    </div>
  );
}