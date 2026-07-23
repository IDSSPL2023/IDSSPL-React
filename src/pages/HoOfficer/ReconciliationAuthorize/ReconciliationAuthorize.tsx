import { useState } from "react";
import type { ChangeEvent } from "react";
import { ShieldCheck, X, Filter as FilterIcon, Landmark, Hash, User, FileText, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import { IMAGES } from "@/assets";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SectionCard, RadioYesNo } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { DEFAULT_RECONCILIATION_DATA, type ReconciliationFormData } from "@/components/HO-Clerk/AddReconciliation";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from ReconciliationAuthorizeTable.tsx ===== */
export type ReconciliationAuthorizeTable_ReconciliationAuthorizeTab = "new" | "rejected";

export type ReconciliationAuthorizeTable_ReconciliationAuthorizeRow = {
  srNo: number;
  adviceNo: string;
  branchName: string;
  reconciliationCode: string;
  createdBy: string;
  createdDate: string;
  tab: ReconciliationAuthorizeTable_ReconciliationAuthorizeTab;
};

const ReconciliationAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "adviceNo", label: "Advice No", sortable: true, width: "160px" },
  { key: "branchName", label: "Branch Name", sortable: true, width: "220px" },
  { key: "reconciliationCode", label: "Reconciliation Code", sortable: true, width: "200px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const ReconciliationAuthorizeTable_SAMPLE_ROWS: Omit<ReconciliationAuthorizeTable_ReconciliationAuthorizeRow, "srNo" | "tab">[] = [
  { adviceNo: "ADV2026-01", branchName: "Main Branch", reconciliationCode: "REC01", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { adviceNo: "ADV2026-02", branchName: "Kothrud Branch", reconciliationCode: "REC02", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { adviceNo: "ADV2026-03", branchName: "Hadapsar Branch", reconciliationCode: "REC01", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { adviceNo: "ADV2026-04", branchName: "Wakad Branch", reconciliationCode: "REC02", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { adviceNo: "ADV2026-05", branchName: "Baner Branch", reconciliationCode: "REC01", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { adviceNo: "ADV2026-06", branchName: "Aundh Branch", reconciliationCode: "REC02", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { adviceNo: "ADV2026-07", branchName: "Viman Nagar Branch", reconciliationCode: "REC01", createdBy: "HoClerk1", createdDate: "15-Jun-2026" },
  { adviceNo: "ADV2026-08", branchName: "Kharadi Branch", reconciliationCode: "REC02", createdBy: "HoAdmin", createdDate: "15-Jun-2026" },
];

const ReconciliationAuthorizeTable_buildRows = (tab: ReconciliationAuthorizeTable_ReconciliationAuthorizeTab, count: number): ReconciliationAuthorizeTable_ReconciliationAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...ReconciliationAuthorizeTable_SAMPLE_ROWS[i % ReconciliationAuthorizeTable_SAMPLE_ROWS.length],
    adviceNo: `${ReconciliationAuthorizeTable_SAMPLE_ROWS[i % ReconciliationAuthorizeTable_SAMPLE_ROWS.length].adviceNo}${tab === "rejected" ? "-R" : ""}`,
    srNo: i + 1,
    tab,
  }));

export const ReconciliationAuthorizeTable_RECONCILIATION_TAB_COUNTS: Record<ReconciliationAuthorizeTable_ReconciliationAuthorizeTab, number> = {
  new: 10,
  rejected: 6,
};

const ReconciliationAuthorizeTable_ALL_ROWS: ReconciliationAuthorizeTable_ReconciliationAuthorizeRow[] = [
  ...ReconciliationAuthorizeTable_buildRows("new", ReconciliationAuthorizeTable_RECONCILIATION_TAB_COUNTS.new),
  ...ReconciliationAuthorizeTable_buildRows("rejected", ReconciliationAuthorizeTable_RECONCILIATION_TAB_COUNTS.rejected),
];

const ReconciliationAuthorizeTable_PAGE_SIZE = 15;

type ReconciliationAuthorizeTable_SortKey = Exclude<(typeof ReconciliationAuthorizeTable_columns)[number]["key"], "action">;

type ReconciliationAuthorizeTable_ReconciliationAuthorizeTableProps = {
  activeTab: ReconciliationAuthorizeTable_ReconciliationAuthorizeTab;
  filters?: ReconciliationFilterModal_ReconciliationFilters;
  onAuthorize?: (row: ReconciliationAuthorizeTable_ReconciliationAuthorizeRow) => void;
};

const ReconciliationAuthorizeTable = ({ activeTab, filters, onAuthorize }: ReconciliationAuthorizeTable_ReconciliationAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<ReconciliationAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: ReconciliationAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = ReconciliationAuthorizeTable_ALL_ROWS.filter((r) => {
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.branchName && !r.branchName.toLowerCase().includes(filters.branchName.toLowerCase())) return false;
    if (filters.adviceNo && !r.adviceNo.toLowerCase().includes(filters.adviceNo.toLowerCase())) return false;
    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / ReconciliationAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * ReconciliationAuthorizeTable_PAGE_SIZE, currentPage * ReconciliationAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1100px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {ReconciliationAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as ReconciliationAuthorizeTable_SortKey)}
                  className={`whitespace-nowrap px-6 py-3 text-left text-[16px] font-semibold text-white ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={{ width: col.width }}
                >
                  <SortableHeaderLabel label={col.label} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={ReconciliationAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => (
                <tr
                  key={`${row.tab}-${row.srNo}`}
                  className={`${idx !== pageRows.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} relative hover:bg-gray-50 dark:hover:bg-slate-800`}
                >
                  <td className="px-6 py-3" style={{ width: "80px" }}>
                    <SrNoBadge value={row.srNo} />
                  </td>
                  <td className="relative px-6 py-3" style={{ width: "90px" }}>
                    <RowActionMenu
                      items={[
                        { key: "authorize", label: "Authorize", icon: ShieldCheck, onClick: () => onAuthorize?.(row) },
                      ]}
                    />
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "160px" }}>
                    {row.adviceNo}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "220px" }}>
                    {row.branchName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "200px" }}>
                    {row.reconciliationCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.createdBy}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.createdDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};


/* ===== from ReconciliationFilterModal.tsx ===== */
const ReconciliationFilterModal_filterOptions = [
  {
    id: "branchName",
    label: "Branch Name",
    icon: <Landmark size={18} className="text-primary" />,
    placeholder: "Branch Name",
  },
  {
    id: "adviceNo",
    label: "Advice No",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Advice No",
  },
] as const;

type ReconciliationFilterModal_FilterKey = (typeof ReconciliationFilterModal_filterOptions)[number]["id"];

export type ReconciliationFilterModal_ReconciliationFilters = Record<ReconciliationFilterModal_FilterKey, string>;

type ReconciliationFilterModal_ReconciliationFilterModalProps = {
  onClose: () => void;
  onApply: (filters: ReconciliationFilterModal_ReconciliationFilters) => void;
  initialValues?: ReconciliationFilterModal_ReconciliationFilters;
};

export const ReconciliationFilterModal_defaultReconciliationFilters: ReconciliationFilterModal_ReconciliationFilters = {
  branchName: "",
  adviceNo: "",
};

function ReconciliationFilterModal({
  onClose,
  onApply,
  initialValues = ReconciliationFilterModal_defaultReconciliationFilters,
}: ReconciliationFilterModal_ReconciliationFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<ReconciliationFilterModal_FilterKey>("branchName");
  const [values, setValues] = useState<ReconciliationFilterModal_ReconciliationFilters>(initialValues);

  const active = ReconciliationFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(ReconciliationFilterModal_defaultReconciliationFilters);
    onApply(ReconciliationFilterModal_defaultReconciliationFilters);
    onClose();
  };

  const handleApply = () => {
    onApply(values);
    onClose();
  };

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-primary bg-white p-8 dark:bg-slate-900">
      <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-8 top-8 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100 dark:border-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <X size={18} />
      </button>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary">
          <FilterIcon size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Filter</h2>
          <p className="text-gray-400 dark:text-slate-400">Use filter for fast and efficient searching</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 border-b border-gray-200 dark:border-slate-800" />

      <div className="relative z-10 mt-8 flex items-start gap-0">
        <div className="flex w-full max-w-[470px] flex-col gap-4">
          {ReconciliationFilterModal_filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <div key={option.id} className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveFilter(option.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-[#E8F1FD] dark:bg-slate-800"
                      : "border-primary bg-white dark:bg-slate-900"
                  }`}
                >
                  {option.icon}
                  <span className="text-lg font-medium text-gray-900 dark:text-slate-100">
                    {option.label}
                  </span>
                </button>

                {isActive && (
                  <div className="absolute -right-9 flex h-10 w-10 items-center justify-center">
                    <div className="h-0 w-0 border-y-[18px] border-l-[24px] border-y-transparent border-l-[#DCEBFC] dark:border-l-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ml-10 flex h-[220px] w-[800px] flex-col justify-center rounded-2xl bg-[#DCEBFC] p-6 dark:bg-slate-800">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-slate-100">
            {active?.label}
          </h3>
          <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-4 py-3 dark:bg-slate-900">
            {active?.icon}
            <input
              type="text"
              value={values[activeFilter]}
              onChange={handleChange}
              placeholder={active?.placeholder}
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 flex justify-center gap-4">
        <button
          type="button"
          onClick={handleClearAll}
          className="rounded-full border border-primary px-8 py-3 font-semibold text-primary hover:bg-[#F2F8FE] dark:hover:bg-slate-800"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="rounded-full bg-primary px-10 py-3 font-semibold text-white hover:bg-[#0a56aa]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}


/* ===== from AuthorizeReconciliationModal.tsx ===== */
export interface AuthorizeReconciliationModal_AuthorizeReconciliationModalProps {
  open: boolean;
  initialData?: Partial<ReconciliationFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeReconciliationModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <Landmark size={20} className="text-primary" />
  </div>
);

const AuthorizeReconciliationModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeReconciliationModal_AuthorizeReconciliationFooter = ({
  onReject,
  onCancel,
  onAuthorize,
}: {
  onReject: () => void;
  onCancel: () => void;
  onAuthorize: () => void;
}) => (
  <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
    <button
      type="button"
      onClick={onReject}
      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
    >
      Reject
      <ThumbsDown className="h-4 w-4" />
    </button>

    <button
      type="button"
      onClick={onCancel}
      className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-5 py-2 text-sm font-medium text-primary transition hover:bg-slate-50"
    >
      Cancel
      <X className="h-4 w-4" />
    </button>

    <button
      type="button"
      onClick={onAuthorize}
      className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
    >
      Authorize
      <ThumbsUp className="h-4 w-4" />
    </button>
  </div>
);

const AuthorizeReconciliationModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeReconciliationModal_AuthorizeReconciliationModalProps) => {
  const [data] = useState<ReconciliationFormData>(() => ({
    ...DEFAULT_RECONCILIATION_DATA,
    ...initialData,
  }));
  const [actionModal, setActionModal] = useState<"authorize" | "rejected" | null>(null);
  const [showRejectReason, setShowRejectReason] = useState(false);

  if (!open) return null;

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const handleAuthorize = () => {
    setActionModal("authorize");
    onAuthorize?.();
  };

  const handleReject = () => setShowRejectReason(true);

  const handleConfirmReject = (reason: string) => {
    setShowRejectReason(false);
    setActionModal("rejected");
    onReject?.(reason);
  };

  const handleDone = () => {
    setActionModal(null);
    onClose();
  };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Authorize Reconciliation"
        titleHi="समायोजन अधिकृत करा"
        subtitleEn="Check information related to the reconciliation entry and authorize it."
        subtitleHi="समायोजन नोंदीशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize Reconciliation" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeReconciliationModal_AuthorizeReconciliationFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Reconciliation Details"
          titleHi="समायोजन तपशील"
          subtitleEn="Advice, branch and reconciliation code details being authorized."
          subtitleHi="अधिकृत करावयाचा सल्ला, शाखा व समायोजन कोड तपशील."
          icon={<AuthorizeReconciliationModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Advice No" labelHi="सल्ला क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.adviceNo} onChange={() => {}} readOnly />
                </div>
                <AuthorizeReconciliationModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Advice Date" labelHi="सल्ला तारीख" required>
              <DateInput value={data.adviceDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Branch Name" labelHi="शाखेचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.branchName} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioYesNo
              label="Internal Reconciliation"
              labelHi="अंतर्गत समायोजन"
              value={data.internalReconciliation}
              onChange={() => {}}
              disabled
            />

            <FieldShell label="Reconciliation Code" labelHi="समायोजन कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.reconciliationCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeReconciliationModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Branch Reconciliation Description" labelHi="शाखा समायोजन वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.branchReconciliationDescription} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        {showRejectReason && (
          <RejectReasonModal
            titleEn="User Authorize Rejected"
            titleHi="युझर खात्याची स्थिती"
            onClose={() => setShowRejectReason(false)}
            onConfirm={handleConfirmReject}
          />
        )}

        {actionModal === "authorize" && (
          <SuccessModal
            title="Reconciliation Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="Reconciliation Authorization Rejected"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="critical"
          />
        )}
      </FormModal>
    </>
  );
};


/* ===== from ReconciliationAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: ReconciliationAuthorizeTable_RECONCILIATION_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: ReconciliationAuthorizeTable_RECONCILIATION_TAB_COUNTS.rejected },
];

const ReconciliationAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<ReconciliationFilterModal_ReconciliationFilters>(ReconciliationFilterModal_defaultReconciliationFilters);
  const [authorizeRow, setAuthorizeRow] = useState<ReconciliationAuthorizeTable_ReconciliationAuthorizeRow | null>(null);

  const handleAuthorize = (row: ReconciliationAuthorizeTable_ReconciliationAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(ReconciliationFilterModal_defaultReconciliationFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Reconciliation Authorize"
        titleHi="समायोजन अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "Reconciliation Authorize", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-3 px-3 py-3">
        <AuthorizationTabs
          active={activeTab}
          onChange={setActiveTab}
          onOpenFilter={() => setIsFilterOpen(true)}
          tabs={TABS}
          isSearchVisible={isSearchVisible}
          onToggleSearch={() => setIsSearchVisible((v) => !v)}
          hasActiveFilters={hasActiveFilters(filters)}
          activeFilterSummary={getActiveFilterSummary(filters)}
          onResetFilters={handleResetFilters}
        />

        <ReconciliationAuthorizeTable
          activeTab={activeTab === "rejected" ? "rejected" : "new"}
          filters={filters}
          onAuthorize={handleAuthorize}
        />
      </div>

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ReconciliationFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeReconciliationModal
          open
          initialData={{
            adviceNo: authorizeRow.adviceNo,
            branchName: authorizeRow.branchName,
            reconciliationCode: authorizeRow.reconciliationCode,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default ReconciliationAuthorizePage;
