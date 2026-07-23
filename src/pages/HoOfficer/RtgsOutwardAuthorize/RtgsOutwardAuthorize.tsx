import { useState } from "react";
import type { ChangeEvent } from "react";
import { ShieldCheck, X, Filter as FilterIcon, User, Hash, CreditCard, IndianRupee, FileText, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import { IMAGES } from "@/assets";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { DEFAULT_RTGS_OUTWARD_DATA, type RtgsOutwardFormData } from "@/components/HO-Clerk/AddRtgsOutward";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from RtgsOutwardAuthorizeTable.tsx ===== */
export type RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeTab = "new" | "rejected";

export type RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeRow = {
  srNo: number;
  accountCode: string;
  name: string;
  caseType: string;
  caseNumber: string;
  caseFee: string;
  createdBy: string;
  createdDate: string;
  tab: RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeTab;
};

const RtgsOutwardAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "name", label: "Name", sortable: true, width: "200px" },
  { key: "caseType", label: "Case Type", sortable: true, width: "150px" },
  { key: "caseNumber", label: "Case Number", sortable: true, width: "160px" },
  { key: "caseFee", label: "Case Fee", sortable: true, width: "130px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "150px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "150px" },
] as const;

const RtgsOutwardAuthorizeTable_SAMPLE_ROWS: Omit<RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeRow, "srNo" | "tab">[] = [
  { accountCode: "000745", name: "Devaraddi Mallanagoud", caseType: "RTGS Outward", caseNumber: "RTGS20260601", caseFee: "50", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { accountCode: "000746", name: "Akshay Om More", caseType: "RTGS Outward", caseNumber: "RTGS20260602", caseFee: "50", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { accountCode: "000747", name: "Priya Sharma", caseType: "RTGS Inward", caseNumber: "RTGS20260603", caseFee: "0", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { accountCode: "000748", name: "Rohan Kulkarni", caseType: "RTGS Outward", caseNumber: "RTGS20260604", caseFee: "50", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { accountCode: "000749", name: "Sneha Patil", caseType: "RTGS Outward", caseNumber: "RTGS20260605", caseFee: "50", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { accountCode: "000750", name: "Vikram Nagar", caseType: "RTGS Inward", caseNumber: "RTGS20260606", caseFee: "0", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { accountCode: "000751", name: "Anita Desai", caseType: "RTGS Outward", caseNumber: "RTGS20260607", caseFee: "50", createdBy: "HoClerk1", createdDate: "15-Jun-2026" },
  { accountCode: "000752", name: "Manoj Rathod", caseType: "RTGS Outward", caseNumber: "RTGS20260608", caseFee: "50", createdBy: "HoAdmin", createdDate: "15-Jun-2026" },
  { accountCode: "000753", name: "Kavita Joshi", caseType: "RTGS Inward", caseNumber: "RTGS20260609", caseFee: "0", createdBy: "HoClerk1", createdDate: "16-Jun-2026" },
  { accountCode: "000754", name: "Suresh Naik", caseType: "RTGS Outward", caseNumber: "RTGS20260610", caseFee: "50", createdBy: "HoAdmin", createdDate: "16-Jun-2026" },
];

const RtgsOutwardAuthorizeTable_buildRows = (tab: RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeTab, count: number): RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...RtgsOutwardAuthorizeTable_SAMPLE_ROWS[i % RtgsOutwardAuthorizeTable_SAMPLE_ROWS.length],
    srNo: i + 1,
    tab,
  }));

export const RtgsOutwardAuthorizeTable_RTGS_OUTWARD_TAB_COUNTS: Record<RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeTab, number> = {
  new: 12,
  rejected: 8,
};

const RtgsOutwardAuthorizeTable_ALL_ROWS: RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeRow[] = [
  ...RtgsOutwardAuthorizeTable_buildRows("new", RtgsOutwardAuthorizeTable_RTGS_OUTWARD_TAB_COUNTS.new),
  ...RtgsOutwardAuthorizeTable_buildRows("rejected", RtgsOutwardAuthorizeTable_RTGS_OUTWARD_TAB_COUNTS.rejected),
];

const RtgsOutwardAuthorizeTable_PAGE_SIZE = 15;

type RtgsOutwardAuthorizeTable_SortKey = Exclude<(typeof RtgsOutwardAuthorizeTable_columns)[number]["key"], "action">;

type RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeTableProps = {
  activeTab: RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeTab;
  filters?: RtgsOutwardFilterModal_RtgsOutwardFilters;
  onAuthorize?: (row: RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeRow) => void;
};

const RtgsOutwardAuthorizeTable = ({ activeTab, filters, onAuthorize }: RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<RtgsOutwardAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: RtgsOutwardAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = RtgsOutwardAuthorizeTable_ALL_ROWS.filter((r) => {
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.name && !r.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.accountCode && !r.accountCode.toLowerCase().includes(filters.accountCode.toLowerCase())) return false;
    if (filters.caseNumber && !r.caseNumber.toLowerCase().includes(filters.caseNumber.toLowerCase())) return false;
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / RtgsOutwardAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * RtgsOutwardAuthorizeTable_PAGE_SIZE, currentPage * RtgsOutwardAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1250px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {RtgsOutwardAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as RtgsOutwardAuthorizeTable_SortKey)}
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
                <td colSpan={RtgsOutwardAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "180px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "200px" }}>
                    {row.name}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.caseType}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.caseNumber}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "130px" }}>
                    {row.caseFee}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.createdBy}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
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


/* ===== from RtgsOutwardFilterModal.tsx ===== */
const RtgsOutwardFilterModal_filterOptions = [
  {
    id: "name",
    label: "Name",
    icon: <User size={18} className="text-primary" />,
    placeholder: "Name",
  },
  {
    id: "accountCode",
    label: "Account Code",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Account Code",
  },
  {
    id: "caseNumber",
    label: "Case Number",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Case Number",
  },
] as const;

type RtgsOutwardFilterModal_FilterKey = (typeof RtgsOutwardFilterModal_filterOptions)[number]["id"];

export type RtgsOutwardFilterModal_RtgsOutwardFilters = Record<RtgsOutwardFilterModal_FilterKey, string>;

type RtgsOutwardFilterModal_RtgsOutwardFilterModalProps = {
  onClose: () => void;
  onApply: (filters: RtgsOutwardFilterModal_RtgsOutwardFilters) => void;
  initialValues?: RtgsOutwardFilterModal_RtgsOutwardFilters;
};

export const RtgsOutwardFilterModal_defaultRtgsOutwardFilters: RtgsOutwardFilterModal_RtgsOutwardFilters = {
  name: "",
  accountCode: "",
  caseNumber: "",
};

function RtgsOutwardFilterModal({
  onClose,
  onApply,
  initialValues = RtgsOutwardFilterModal_defaultRtgsOutwardFilters,
}: RtgsOutwardFilterModal_RtgsOutwardFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<RtgsOutwardFilterModal_FilterKey>("name");
  const [values, setValues] = useState<RtgsOutwardFilterModal_RtgsOutwardFilters>(initialValues);

  const active = RtgsOutwardFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(RtgsOutwardFilterModal_defaultRtgsOutwardFilters);
    onApply(RtgsOutwardFilterModal_defaultRtgsOutwardFilters);
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
          {RtgsOutwardFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeRtgsOutwardModal.tsx ===== */
export interface AuthorizeRtgsOutwardModal_AuthorizeRtgsOutwardModalProps {
  open: boolean;
  initialData?: Partial<RtgsOutwardFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeRtgsOutwardModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeRtgsOutwardModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeRtgsOutwardModal_AuthorizeRtgsOutwardFooter = ({
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

const AuthorizeRtgsOutwardModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeRtgsOutwardModal_AuthorizeRtgsOutwardModalProps) => {
  const [data] = useState<RtgsOutwardFormData>(() => ({
    ...DEFAULT_RTGS_OUTWARD_DATA,
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
        titleEn="Authorize RTGS Outward File Generation"
        titleHi="RTGS आउटवर्ड फाइल जनरेशन अधिकृत करा"
        subtitleEn="Check information related to the RTGS outward file and authorize it."
        subtitleHi="RTGS आउटवर्ड फाइलशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize RTGS Outward File Generation" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeRtgsOutwardModal_AuthorizeRtgsOutwardFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="RTGS Outward Details"
          titleHi="RTGS आउटवर्ड तपशील"
          subtitleEn="Account and case information for the RTGS outward file being authorized."
          subtitleHi="अधिकृत करावयाच्या RTGS आउटवर्ड फाइलची खाते व प्रकरण माहिती."
          icon={<AuthorizeRtgsOutwardModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="SR No" labelHi="अनुक्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.srNo} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRtgsOutwardModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRtgsOutwardModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Name" labelHi="नाव" required>
              <TextInput icon={<User size={16} />} value={data.name} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Case Type" labelHi="प्रकरण प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.caseType} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRtgsOutwardModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Notice Date" labelHi="सूचना तारीख" required>
              <DateInput value={data.noticeDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Case Date" labelHi="प्रकरण तारीख" required>
              <DateInput value={data.caseDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Case Number" labelHi="प्रकरण क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.caseNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Case Fee" labelHi="प्रकरण शुल्क" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.caseFee} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Case Description" labelHi="प्रकरण वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.caseDescription} onChange={() => {}} readOnly />
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
            title="RTGS Outward File Generation Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="RTGS Outward File Generation Authorization Rejected"
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


/* ===== from RtgsOutwardAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: RtgsOutwardAuthorizeTable_RTGS_OUTWARD_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: RtgsOutwardAuthorizeTable_RTGS_OUTWARD_TAB_COUNTS.rejected },
];

const RtgsOutwardAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<RtgsOutwardFilterModal_RtgsOutwardFilters>(RtgsOutwardFilterModal_defaultRtgsOutwardFilters);
  const [authorizeRow, setAuthorizeRow] = useState<RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeRow | null>(null);

  const handleAuthorize = (row: RtgsOutwardAuthorizeTable_RtgsOutwardAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(RtgsOutwardFilterModal_defaultRtgsOutwardFilters);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="RTGS Outward File Generation Authorize"
        titleHi="RTGS आउटवर्ड फाइल जनरेशन अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "RTGS Outward File Generation Authorize", href: "#" },
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

        <RtgsOutwardAuthorizeTable
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
            <RtgsOutwardFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeRtgsOutwardModal
          open
          initialData={{
            accountCode: authorizeRow.accountCode,
            name: authorizeRow.name,
            caseType: authorizeRow.caseType,
            caseNumber: authorizeRow.caseNumber,
            caseFee: authorizeRow.caseFee,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default RtgsOutwardAuthorizePage;
