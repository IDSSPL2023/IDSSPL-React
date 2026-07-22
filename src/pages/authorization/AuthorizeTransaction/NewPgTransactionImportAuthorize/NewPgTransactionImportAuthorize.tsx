import { useState } from "react";
import type { ChangeEvent } from "react";
import { ShieldCheck, Landmark, Hash, IndianRupee, X, Filter as FilterIcon, User, Package, FileText, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import { IMAGES } from "@/assets";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SelectInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { DEFAULT_NEW_PG_TRANSACTION_IMPORT_DATA, type NewPgTransactionImportFormData } from "@/components/TransactionMaster/AddNewPgTransactionImport";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from NewPgTransactionImportAuthorizeTable.tsx ===== */
export type NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeTab = "new" | "rejected";

export type NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeRow = {
  srNo: number;
  adviceNo: string;
  branchCode: string;
  totalAmount: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  tab: NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeTab;
};

const NewPgTransactionImportAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "adviceNo", label: "Advice No", sortable: true, width: "180px" },
  { key: "branchCode", label: "Branch Code", sortable: true, width: "160px" },
  { key: "totalAmount", label: "Total Amount", sortable: true, width: "160px" },
  { key: "userId", label: "User ID", sortable: true, width: "140px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const NewPgTransactionImportAuthorizeTable_SAMPLE_PG_IMPORT: Omit<NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeRow, "srNo" | "tab">[] = [
  { adviceNo: "ADV/2026/0001", branchCode: "0002", totalAmount: "1,00,000.00", userId: "ABC", createdBy: "Admin", createdDate: "23-May-2026" },
  { adviceNo: "ADV/2026/0002", branchCode: "0002", totalAmount: "75,500.00", userId: "ABC", createdBy: "Admin", createdDate: "24-May-2026" },
  { adviceNo: "ADV/2026/0003", branchCode: "0003", totalAmount: "2,10,000.00", userId: "ABC", createdBy: "Admin", createdDate: "25-May-2026" },
  { adviceNo: "ADV/2026/0004", branchCode: "0002", totalAmount: "48,250.00", userId: "ABC", createdBy: "Admin", createdDate: "26-May-2026" },
  { adviceNo: "ADV/2026/0005", branchCode: "0003", totalAmount: "1,32,000.00", userId: "ABC", createdBy: "Admin", createdDate: "27-May-2026" },
  { adviceNo: "ADV/2026/0006", branchCode: "0002", totalAmount: "64,750.00", userId: "ABC", createdBy: "Admin", createdDate: "28-May-2026" },
  { adviceNo: "ADV/2026/0007", branchCode: "0003", totalAmount: "89,900.00", userId: "ABC", createdBy: "Admin", createdDate: "29-May-2026" },
  { adviceNo: "ADV/2026/0008", branchCode: "0002", totalAmount: "1,55,300.00", userId: "ABC", createdBy: "Admin", createdDate: "30-May-2026" },
];

const NewPgTransactionImportAuthorizeTable_buildRows = (tab: NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeTab, count: number): NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...NewPgTransactionImportAuthorizeTable_SAMPLE_PG_IMPORT[i % NewPgTransactionImportAuthorizeTable_SAMPLE_PG_IMPORT.length],
    adviceNo: `ADV/2026/${String(1 + i + (tab === "rejected" ? 100 : 0)).padStart(4, "0")}`,
    srNo: i + 1,
    tab,
  }));

export const NewPgTransactionImportAuthorizeTable_NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS: Record<NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeTab, number> = {
  new: 14,
  rejected: 8,
};

const NewPgTransactionImportAuthorizeTable_ALL_ROWS: NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeRow[] = [
  ...NewPgTransactionImportAuthorizeTable_buildRows("new", NewPgTransactionImportAuthorizeTable_NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS.new),
  ...NewPgTransactionImportAuthorizeTable_buildRows("rejected", NewPgTransactionImportAuthorizeTable_NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS.rejected),
];

const NewPgTransactionImportAuthorizeTable_PAGE_SIZE = 15;

type NewPgTransactionImportAuthorizeTable_SortKey = Exclude<(typeof NewPgTransactionImportAuthorizeTable_columns)[number]["key"], "action">;

type NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeTableProps = {
  activeTab: NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeTab;
  filters?: NewPgTransactionImportFilterModal_NewPgTransactionImportFilters;
  onAuthorize?: (row: NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeRow) => void;
};

const NewPgTransactionImportAuthorizeTable = ({ activeTab, filters, onAuthorize }: NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<NewPgTransactionImportAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: NewPgTransactionImportAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = NewPgTransactionImportAuthorizeTable_ALL_ROWS.filter((r) => {
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.branchCode && !r.branchCode.toLowerCase().includes(filters.branchCode.toLowerCase())) return false;
    if (filters.adviceNo && !r.adviceNo.toLowerCase().includes(filters.adviceNo.toLowerCase())) return false;
    if (filters.amount && !r.totalAmount.toLowerCase().includes(filters.amount.toLowerCase())) return false;
    if (filters.userId && !r.userId.toLowerCase().includes(filters.userId.toLowerCase())) return false;
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / NewPgTransactionImportAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * NewPgTransactionImportAuthorizeTable_PAGE_SIZE, currentPage * NewPgTransactionImportAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1100px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {NewPgTransactionImportAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as NewPgTransactionImportAuthorizeTable_SortKey)}
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
                <td colSpan={NewPgTransactionImportAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="relative px-6 py-3" style={{ width: "80px" }}>
                    <RowActionMenu
                      items={[
                        { key: "authorize", label: "Authorize", icon: ShieldCheck, onClick: () => onAuthorize?.(row) },
                      ]}
                    />
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "180px" }}>
                    {row.adviceNo}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.branchCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.totalAmount}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.userId}
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


/* ===== from NewPgTransactionImportFilterModal.tsx ===== */
const NewPgTransactionImportFilterModal_filterOptions = [
  {
    id: "branchCode",
    label: "Branch Code",
    icon: <Landmark size={18} className="text-primary" />,
    placeholder: "Branch Code",
  },
  {
    id: "adviceNo",
    label: "Advice No",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Advice No",
  },
  {
    id: "amount",
    label: "Total Amount",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "Total Amount",
  },
  {
    id: "userId",
    label: "User ID",
    icon: <User size={18} className="text-primary" />,
    placeholder: "User ID",
  },
] as const;

type NewPgTransactionImportFilterModal_FilterKey = (typeof NewPgTransactionImportFilterModal_filterOptions)[number]["id"];

export type NewPgTransactionImportFilterModal_NewPgTransactionImportFilters = Record<NewPgTransactionImportFilterModal_FilterKey, string>;

type NewPgTransactionImportFilterModal_NewPgTransactionImportFilterModalProps = {
  onClose: () => void;
  onApply: (filters: NewPgTransactionImportFilterModal_NewPgTransactionImportFilters) => void;
  initialValues?: NewPgTransactionImportFilterModal_NewPgTransactionImportFilters;
};

export const NewPgTransactionImportFilterModal_defaultNewPgTransactionImportFilters: NewPgTransactionImportFilterModal_NewPgTransactionImportFilters = {
  branchCode: "",
  adviceNo: "",
  amount: "",
  userId: "",
};

function NewPgTransactionImportFilterModal({
  onClose,
  onApply,
  initialValues = NewPgTransactionImportFilterModal_defaultNewPgTransactionImportFilters,
}: NewPgTransactionImportFilterModal_NewPgTransactionImportFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<NewPgTransactionImportFilterModal_FilterKey>("branchCode");
  const [values, setValues] = useState<NewPgTransactionImportFilterModal_NewPgTransactionImportFilters>(initialValues);

  const active = NewPgTransactionImportFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(NewPgTransactionImportFilterModal_defaultNewPgTransactionImportFilters);
    onApply(NewPgTransactionImportFilterModal_defaultNewPgTransactionImportFilters);
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
          {NewPgTransactionImportFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeNewPgTransactionImportModal.tsx ===== */
export interface AuthorizeNewPgTransactionImportModal_AuthorizeNewPgTransactionImportModalProps {
  open: boolean;
  initialData?: Partial<NewPgTransactionImportFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeNewPgTransactionImportModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeNewPgTransactionImportModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeNewPgTransactionImportModal_AuthorizeNewPgTransactionImportFooter = ({
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

const AuthorizeNewPgTransactionImportModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeNewPgTransactionImportModal_AuthorizeNewPgTransactionImportModalProps) => {
  const [data] = useState<NewPgTransactionImportFormData>(() => ({
    ...DEFAULT_NEW_PG_TRANSACTION_IMPORT_DATA,
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
        titleEn="Authorize New PG Transaction Import"
        titleHi="नवीन पीजी व्यवहार आयात अधिकृत करा"
        subtitleEn="Check information related to the PG transaction import and authorize it."
        subtitleHi="पीजी व्यवहार आयातशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize New PG Transaction Import" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeNewPgTransactionImportModal_AuthorizeNewPgTransactionImportFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Transaction Details"
          titleHi="व्यवहाराचा तपशील"
          subtitleEn="Transaction information for the PG import being authorized."
          subtitleHi="अधिकृत करावयाच्या पीजी आयात व्यवहाराची माहिती."
          icon={<AuthorizeNewPgTransactionImportModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Machine Type" labelHi="यंत्राचा प्रकार" required>
              <SelectInput icon={<FileText size={16} />} value={data.machineType} onChange={() => {}} options={[data.machineType]} readOnly />
            </FieldShell>

            <FieldShell label="Branch Code" labelHi="शाखा कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Landmark size={16} />} value={data.branchCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeNewPgTransactionImportModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Branch Name" labelHi="शाखेचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.branchName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Total Amount" labelHi="एकूण रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.totalAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Product Code" labelHi="उत्पादन क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Package size={16} />} value={data.productCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeNewPgTransactionImportModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.productDescription} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Contra Account Head" labelHi="प्रतिखाते शीर्षक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.contraAccountHead} onChange={() => {}} readOnly />
                </div>
                <AuthorizeNewPgTransactionImportModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.contraDescription} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Recon. Code" labelHi="जुळणी कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.reconCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeNewPgTransactionImportModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.reconDescription} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Advice No." labelHi="सल्ला क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.adviceNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Advice Date" labelHi="सल्ला तारीख" required>
              <DateInput value={data.adviceDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Transaction Type" labelHi="व्यवहाराचा प्रकार" required>
              <SelectInput icon={<FileText size={16} />} value={data.transactionType} onChange={() => {}} options={[data.transactionType]} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Contra Head Particular" labelHi="प्रतिखाते तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.contraHeadParticular} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        {showRejectReason && (
          <RejectReasonModal
            titleEn="New PG Transaction Import Authorize Rejected"
            titleHi="पीजी व्यवहार आयात स्थिती"
            onClose={() => setShowRejectReason(false)}
            onConfirm={handleConfirmReject}
          />
        )}

        {actionModal === "authorize" && (
          <SuccessModal
            title="New PG Transaction Import Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="New PG Transaction Import Authorization Rejected"
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


/* ===== from NewPgTransactionImportAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: NewPgTransactionImportAuthorizeTable_NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: NewPgTransactionImportAuthorizeTable_NEW_PG_TRANSACTION_IMPORT_TAB_COUNTS.rejected },
];

const NewPgTransactionImportAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<NewPgTransactionImportFilterModal_NewPgTransactionImportFilters>(NewPgTransactionImportFilterModal_defaultNewPgTransactionImportFilters);
  const [authorizeRow, setAuthorizeRow] = useState<NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeRow | null>(null);

  const handleAuthorize = (row: NewPgTransactionImportAuthorizeTable_NewPgTransactionImportAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(NewPgTransactionImportFilterModal_defaultNewPgTransactionImportFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="New PG Transaction Import"
        titleHi="नवीन पीजी व्यवहार आयात अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "New PG Transaction Import", href: "#" },
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

        <NewPgTransactionImportAuthorizeTable
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
            <NewPgTransactionImportFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeNewPgTransactionImportModal
          open
          initialData={{
            branchCode: authorizeRow.branchCode,
            adviceNo: authorizeRow.adviceNo,
            totalAmount: authorizeRow.totalAmount,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default NewPgTransactionImportAuthorizePage;
