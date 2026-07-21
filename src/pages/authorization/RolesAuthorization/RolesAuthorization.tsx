import { useMemo, useState } from "react";
import { ArrowLeft, Home, ChevronLeft, ChevronRight, MoreVertical, SlidersHorizontal, Filter, X, IdCard, User, ThumbsDown, ShieldCheck } from "lucide-react";
import SrNoBadge from "@/components/shared/SrNoBadge";
import StatusPill from "@/components/shared/StatusPill";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Image from "@/components/ui/Image";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";

/* ===== from RoleAuthorizationList.tsx ===== */
/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type RoleAuthorizationList_RoleAuthTab = "new" | "modify" | "rejected";

export interface RoleAuthorizationList_RoleAuthorizationRow {
  srNo: number;
  userId: string;
  name: string;
  createdBy: string;
  createdDate: string;
  status: string;
  tab: RoleAuthorizationList_RoleAuthTab;
}

export interface RoleAuthorizationList_RoleFilters {
  userId?: string;
  name?: string;
  createdBy?: string;
}

interface RoleAuthorizationList_RoleAuthorizationListProps {
  rows?: RoleAuthorizationList_RoleAuthorizationRow[];
  onBack: () => void;
  /** Clicking the Action icon opens the Authorization screen directly — no dropdown. */
  onAuthorize: (row: RoleAuthorizationList_RoleAuthorizationRow) => void;
}

/* ------------------------------------------------------------------ */
/*  Sample data — swap for real API results                            */
/* ------------------------------------------------------------------ */

const RoleAuthorizationList_TAB_STATUS_LABEL: Record<RoleAuthorizationList_RoleAuthTab, string> = {
  new: "Authorization Pending",
  modify: "Modification Pending",
  rejected: "Authorization Rejected",
};

const RoleAuthorizationList_TAB_STATUS_TONE: Record<RoleAuthorizationList_RoleAuthTab, "pending" | "rejected"> = {
  new: "pending",
  modify: "pending",
  rejected: "rejected",
};

const RoleAuthorizationList_buildRows = (tab: RoleAuthorizationList_RoleAuthTab, count: number): RoleAuthorizationList_RoleAuthorizationRow[] =>
  Array.from({ length: count }, (_, i) => ({
    srNo: i + 1,
    userId: "AMT",
    name: "Akshay Om More",
    createdBy: "Admin",
    createdDate: "23-May-2026",
    status: RoleAuthorizationList_TAB_STATUS_LABEL[tab],
    tab,
  }));

export const RoleAuthorizationList_TAB_COUNTS: Record<RoleAuthorizationList_RoleAuthTab, number> = {
  new: 10,
  modify: 6,
  rejected: 6,
};

export const RoleAuthorizationList_SAMPLE_ROLE_AUTH_ROWS: RoleAuthorizationList_RoleAuthorizationRow[] = [
  ...RoleAuthorizationList_buildRows("new", RoleAuthorizationList_TAB_COUNTS.new),
  ...RoleAuthorizationList_buildRows("modify", RoleAuthorizationList_TAB_COUNTS.modify),
  ...RoleAuthorizationList_buildRows("rejected", RoleAuthorizationList_TAB_COUNTS.rejected),
];

/* ------------------------------------------------------------------ */
/*  Columns — mirrors CustomerAuthorizationTable's column config        */
/* ------------------------------------------------------------------ */

const RoleAuthorizationList_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "90px" },
  { key: "action", label: "Action", sortable: false, width: "100px" },
  { key: "status", label: "Status", sortable: true, width: "210px" },
  { key: "userId", label: "User ID", sortable: true, width: "180px" },
  { key: "name", label: "Name", sortable: true, width: "250px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "180px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "180px" },
] as const;

type RoleAuthorizationList_SortKey = Exclude<(typeof RoleAuthorizationList_columns)[number]["key"], "action">;

const RoleAuthorizationList_TABS: { key: RoleAuthorizationList_RoleAuthTab; label: string }[] = [
  { key: "new", label: "New Authorization" },
  { key: "modify", label: "Modify Authorization" },
  { key: "rejected", label: "Authorize Rejected" },
];

/* ------------------------------------------------------------------ */
/*  Header                                                              */
/* ------------------------------------------------------------------ */

function RoleAuthorizationList_ScreenHeader({ onBack }: { onBack: () => void }) {
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

function RoleAuthorizationList_TabBar({
  activeTab,
  counts,
  onChange,
}: {
  activeTab: RoleAuthorizationList_RoleAuthTab;
  counts: Record<RoleAuthorizationList_RoleAuthTab, number>;
  onChange: (tab: RoleAuthorizationList_RoleAuthTab) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-white px-8 py-4">
      <div className="flex flex-wrap items-center gap-6">
        {RoleAuthorizationList_TABS.map((tab) => {
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

function RoleAuthorizationList_FilterDrawer({
  isOpen,
  draft,
  onChange,
  onClose,
  onApply,
  onClear,
}: {
  isOpen: boolean;
  draft: RoleAuthorizationList_RoleFilters;
  onChange: (next: RoleAuthorizationList_RoleFilters) => void;
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

function RoleAuthorizationList({
  rows = RoleAuthorizationList_SAMPLE_ROLE_AUTH_ROWS,
  onBack,
  onAuthorize,
}: RoleAuthorizationList_RoleAuthorizationListProps) {
  const [activeTab, setActiveTab] = useState<RoleAuthorizationList_RoleAuthTab>("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [sortKey, setSortKey] = useState<RoleAuthorizationList_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<RoleAuthorizationList_RoleFilters>({});
  const [filterDraft, setFilterDraft] = useState<RoleAuthorizationList_RoleFilters>({});

  const counts = useMemo(() => {
    return rows.reduce<Record<RoleAuthorizationList_RoleAuthTab, number>>(
      (acc, row) => {
        acc[row.tab] = (acc[row.tab] ?? 0) + 1;
        return acc;
      },
      { new: 0, modify: 0, rejected: 0 }
    );
  }, [rows]);

  const handleSort = (key: RoleAuthorizationList_SortKey) => {
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

  const handleTabChange = (tab: RoleAuthorizationList_RoleAuthTab) => {
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
      <RoleAuthorizationList_ScreenHeader onBack={onBack} />
      <RoleAuthorizationList_TabBar activeTab={activeTab} counts={counts} onChange={handleTabChange} />

      <div className="px-8 pb-8 pt-5">
        {/* Table — same shell as CustomerAuthorizationTable */}
        <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="table-container relative overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse min-w-[1190px] table-fixed">
              <thead>
                <tr className="bg-primary">
                  {RoleAuthorizationList_columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key as RoleAuthorizationList_SortKey)}
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
                        <StatusPill label={row.status} tone={RoleAuthorizationList_TAB_STATUS_TONE[row.tab]} />
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
                    <td colSpan={RoleAuthorizationList_columns.length} className="px-6 py-10 text-center text-sm text-slate-400">
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


/* ===== from AuthorizeAccountModal.tsx ===== */
/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface AuthorizeAccountModal_RoleOption {
  mainRole: string | number;
  description: string;
}

interface AuthorizeAccountModal_AuthorizeAccountModalProps {
  userId: string;
  name: string;
  roles: AuthorizeAccountModal_RoleOption[];
  onClose: () => void;
  onCancel: () => void;
  onReject: () => void;
  onAuthorize: () => void;
}
function AuthorizeAccountModal_ReadOnlyField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof IdCard;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        <span className="ml-0.5 text-rose-500">*</span>
      </label>
      <div
        className="flex h-11 items-center gap-2 border bg-white px-3.5"
        style={{
          borderColor: "#6A7282",
          borderRadius: "12px",
          boxShadow: "0px 1px 0.5px 0.05px rgba(29, 41, 61, 0.02)",
        }}
      >
        <Icon size={16} className="shrink-0 text-slate-400" />
        <span className="truncate text-sm text-slate-600">{value}</span>
      </div>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/*  Main                                                                */
/* ------------------------------------------------------------------ */

function AuthorizeAccountModal({
  userId,
  name,
  roles,
  onClose,
  onCancel,
  onReject,
  onAuthorize,
}: AuthorizeAccountModal_AuthorizeAccountModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 ">
      <div className="relative w-full max-w-[580px] overflow-hidden rounded-[24px]  bg-white p-8 shadow-2xl">
        {/* Decorative corner circles */}
        <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-[#E7EFFD]" />
        <div className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-[#E7EFFD]" />

        {/* Header */}
        
<div className="relative z-10 mb-6 flex items-start justify-between">
  <div className="flex items-center gap-3">
    <Image
      src="/role-authorization.png"
      alt="Role Authorization"
      width={44}
      height={44}
      className="shrink-0"
    />
    <h2 className="text-lg font-bold text-slate-800">
      Authorize Account
      <span className="text-slate-400"> / </span>
      <span className="text-slate-500">खाते अधिकृत करा</span>
    </h2>
  </div>
  
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Fields */}
        <div className="relative z-10 mb-6 flex gap-5">
          <AuthorizeAccountModal_ReadOnlyField icon={IdCard} label="User ID" value={userId} />
          <AuthorizeAccountModal_ReadOnlyField icon={User} label="Name" value={name} />
        </div>

        {/* Role table */}
        <div
          className="relative z-10 overflow-hidden rounded-xl border bg-white shadow-sm"
          style={{ borderColor: "#6A7282" }}
        >
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#1F67F4] text-white">
                <th className="px-6 py-4 font-semibold">Main Role</th>
                <th className="px-6 py-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, idx) => (
                <tr
                  key={idx}
                  className={idx !== roles.length - 1 ? "border-b" : ""}
                  style={idx !== roles.length - 1 ? { borderColor: "#E2E4E9" } : undefined}
                >
                  <td className="px-6 py-4 text-slate-700">{role.mainRole}</td>
                  <td className="px-6 py-4 text-slate-700">{role.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-7 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReject}
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-5 text-[14px] font-medium text-rose-600 transition hover:bg-rose-100"
          >
            Reject
            <ThumbsDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#1F67F4] bg-white px-5 text-[14px] font-medium text-[#1F67F4] transition hover:bg-[#E7EFFD]"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onAuthorize}
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#1F67F4] px-5 text-[14px] font-medium text-white transition hover:bg-[#0E57EA]"
          >
            Authorize
            <ShieldCheck className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


/* ===== from Roleauthorizationflow.tsx ===== */
const SAMPLE_ROLES: AuthorizeAccountModal_RoleOption[] = [
  { mainRole: 6, description: "Cashier" },
  { mainRole: 8, description: "Clerk" },
];

type Step = "list" | "authorize" | "rejectReason" | "success";

interface RoleAuthorizationFlowProps {
  onClose: () => void;
}

// Define success state type
type SuccessState = { 
  title: string; 
  subtitle: string; 
  variant: "success" | "critical" 
} | null;

export default function RoleAuthorizationFlow({ onClose }: RoleAuthorizationFlowProps) {
  const [step, setStep] = useState<Step>("list");
  const [activeRow, setActiveRow] = useState<RoleAuthorizationList_RoleAuthorizationRow | null>(null);
  const [successState, setSuccessState] = useState<SuccessState>(null);

  // Three-dot click -> directly opens Authorize Account. No popup in between.
  const handleOpenAuthorize = (row: RoleAuthorizationList_RoleAuthorizationRow) => {
    setActiveRow(row);
    setStep("authorize");
  };

  const handleBackToList = () => {
    setActiveRow(null);
    setStep("list");
  };

  const handleAuthorize = () => {
    // TODO: call the existing authorize API here — logic/endpoint unchanged.
    setSuccessState({
      title: "Role Has Been Authorized",
      subtitle: "Successfully",
      variant: "success"
    });
    setStep("success");
  };

  // Reject on the Authorize modal opens the reason-collection step first.
  const handleOpenRejectReason = () => {
    setStep("rejectReason");
  };

  const handleSubmitRejectReason = (reason: string) => {
    // TODO: call the existing reject API here, passing `reason` — logic/endpoint unchanged.
    console.log("Rejection reason:", reason);
    setSuccessState({
      title: "Role Has Been Rejected",
      subtitle: "Successfully",
      variant: "critical"
    });
    setStep("success");
  };

  const handleCloseSuccess = () => {
    setSuccessState(null);
    setStep("list");
  };

  return (
    <>
      <RoleAuthorizationList
        rows={RoleAuthorizationList_SAMPLE_ROLE_AUTH_ROWS}
        onBack={onClose}
        onAuthorize={handleOpenAuthorize}
      />

      {step === "authorize" && activeRow && (
        <AuthorizeAccountModal
          userId={activeRow.userId}
          name={activeRow.name}
          roles={SAMPLE_ROLES}
          onClose={() => { setStep("list") }}
          onCancel={handleBackToList}
          onReject={handleOpenRejectReason}
          onAuthorize={handleAuthorize}
        />
      )}

      {/* Step 1 of reject flow: collect reason */}
      {step === "rejectReason" && activeRow && (
        <RejectReasonModal
          titleEn="User Authorize Rejected"
          titleHi="युझर खात्याची स्थिती"
          onClose={() => setStep("list")}
          onConfirm={handleSubmitRejectReason}
        />
      )}

      {/* Unified SuccessModal with variant support */}
      {step === "success" && successState && (
        <SuccessModal
          title={successState.title}
          subtitle={successState.subtitle}
          variant={successState.variant}
          onClose={handleCloseSuccess}
          onDone={handleCloseSuccess}
        />
      )}
    </>
  );
}
