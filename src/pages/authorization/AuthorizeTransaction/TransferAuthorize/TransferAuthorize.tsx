import { useState } from "react";
import type { ChangeEvent } from "react";
import { ShieldCheck, X, Filter as FilterIcon, User, Hash, IndianRupee, CreditCard, FileText, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import { IMAGES } from "@/assets";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SectionCard, SelectField } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { DEFAULT_TRANSFER_DATA, type TransferFormData } from "@/components/TransactionMaster/AddTransfer";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from TransferAuthorizeTable.tsx ===== */
export type TransferAuthorizeTable_TransferAuthorizeTab = "new" | "rejected";

export type TransferAuthorizeTable_TransferAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  createdBy: string;
  createdDate: string;
  tab: TransferAuthorizeTable_TransferAuthorizeTab;
};

const TransferAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "160px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "220px" },
  { key: "amount", label: "Amount", sortable: true, width: "150px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const TransferAuthorizeTable_SAMPLE_TRANSFERS: Omit<TransferAuthorizeTable_TransferAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "SCR-2026-001", accountCode: "401", accountName: "Gaveshvarmath Om Sadashiv", amount: "2,50,000", createdBy: "Admin", createdDate: "12-Jun-2026" },
  { scrollNo: "SCR-2026-002", accountCode: "402", accountName: "Akshay Om More", amount: "45,000", createdBy: "Admin", createdDate: "12-Jun-2026" },
  { scrollNo: "SCR-2026-003", accountCode: "403", accountName: "Priya Sharma", amount: "18,750", createdBy: "Clerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "SCR-2026-004", accountCode: "404", accountName: "Rohan Kulkarni", amount: "72,300", createdBy: "Clerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "SCR-2026-005", accountCode: "405", accountName: "Sneha Patil", amount: "1,05,000", createdBy: "Admin", createdDate: "14-Jun-2026" },
  { scrollNo: "SCR-2026-006", accountCode: "406", accountName: "Vikram Nagar", amount: "38,500", createdBy: "Admin", createdDate: "14-Jun-2026" },
  { scrollNo: "SCR-2026-007", accountCode: "407", accountName: "Anita Desai", amount: "62,000", createdBy: "Clerk1", createdDate: "15-Jun-2026" },
  { scrollNo: "SCR-2026-008", accountCode: "408", accountName: "Manoj Rathod", amount: "14,750", createdBy: "Admin", createdDate: "15-Jun-2026" },
  { scrollNo: "SCR-2026-009", accountCode: "409", accountName: "Kavita Joshi", amount: "95,300", createdBy: "Clerk1", createdDate: "16-Jun-2026" },
  { scrollNo: "SCR-2026-010", accountCode: "410", accountName: "Suresh Naik", amount: "27,100", createdBy: "Admin", createdDate: "16-Jun-2026" },
  { scrollNo: "SCR-2026-011", accountCode: "411", accountName: "Deepika Shetty", amount: "1,18,900", createdBy: "Clerk1", createdDate: "17-Jun-2026" },
  { scrollNo: "SCR-2026-012", accountCode: "412", accountName: "Ganesh Pillai", amount: "8,400", createdBy: "Admin", createdDate: "17-Jun-2026" },
  { scrollNo: "SCR-2026-013", accountCode: "413", accountName: "Radhika Menon", amount: "54,600", createdBy: "Clerk1", createdDate: "18-Jun-2026" },
  { scrollNo: "SCR-2026-014", accountCode: "414", accountName: "Prakash Yadav", amount: "19,200", createdBy: "Admin", createdDate: "18-Jun-2026" },
  { scrollNo: "SCR-2026-015", accountCode: "415", accountName: "Shalini Nair", amount: "76,800", createdBy: "Clerk1", createdDate: "19-Jun-2026" },
  { scrollNo: "SCR-2026-016", accountCode: "416", accountName: "Ajay Deshpande", amount: "33,500", createdBy: "Admin", createdDate: "19-Jun-2026" },
  { scrollNo: "SCR-2026-017", accountCode: "417", accountName: "Farhan Sheikh", amount: "1,42,000", createdBy: "Clerk1", createdDate: "20-Jun-2026" },
  { scrollNo: "SCR-2026-018", accountCode: "418", accountName: "Lata Kulkarni", amount: "21,650", createdBy: "Admin", createdDate: "20-Jun-2026" },
  { scrollNo: "SCR-2026-019", accountCode: "419", accountName: "Nitin Chavan", amount: "68,200", createdBy: "Clerk1", createdDate: "21-Jun-2026" },
  { scrollNo: "SCR-2026-020", accountCode: "420", accountName: "Swati Bhosale", amount: "40,750", createdBy: "Admin", createdDate: "21-Jun-2026" },
];

const TransferAuthorizeTable_buildRows = (tab: TransferAuthorizeTable_TransferAuthorizeTab, count: number): TransferAuthorizeTable_TransferAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...TransferAuthorizeTable_SAMPLE_TRANSFERS[i % TransferAuthorizeTable_SAMPLE_TRANSFERS.length],
    scrollNo: `SCR-2026-${String(i + 1 + (tab === "rejected" ? 100 : 0)).padStart(3, "0")}`,
    srNo: i + 1,
    tab,
  }));

export const TransferAuthorizeTable_TRANSFER_TAB_COUNTS: Record<TransferAuthorizeTable_TransferAuthorizeTab, number> = {
  new: 20,
  rejected: 18,
};

const TransferAuthorizeTable_ALL_ROWS: TransferAuthorizeTable_TransferAuthorizeRow[] = [
  ...TransferAuthorizeTable_buildRows("new", TransferAuthorizeTable_TRANSFER_TAB_COUNTS.new),
  ...TransferAuthorizeTable_buildRows("rejected", TransferAuthorizeTable_TRANSFER_TAB_COUNTS.rejected),
];

const TransferAuthorizeTable_PAGE_SIZE = 15;

type TransferAuthorizeTable_SortKey = Exclude<(typeof TransferAuthorizeTable_columns)[number]["key"], "action">;

type TransferAuthorizeTable_TransferAuthorizeTableProps = {
  activeTab: TransferAuthorizeTable_TransferAuthorizeTab;
  filters?: TransferFilterModal_TransferFilters;
  onAuthorize?: (row: TransferAuthorizeTable_TransferAuthorizeRow) => void;
};

const TransferAuthorizeTable = ({ activeTab, filters, onAuthorize }: TransferAuthorizeTable_TransferAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<TransferAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: TransferAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = TransferAuthorizeTable_ALL_ROWS.filter((r) => {
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.accountName && !r.accountName.toLowerCase().includes(filters.accountName.toLowerCase())) return false;
    if (filters.accountCode && !r.accountCode.toLowerCase().includes(filters.accountCode.toLowerCase())) return false;
    if (filters.scrollNo && !r.scrollNo.toLowerCase().includes(filters.scrollNo.toLowerCase())) return false;
    if (filters.amount && !r.amount.toLowerCase().includes(filters.amount.toLowerCase())) return false;
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / TransferAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * TransferAuthorizeTable_PAGE_SIZE, currentPage * TransferAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1200px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {TransferAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as TransferAuthorizeTable_SortKey)}
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
                <td colSpan={TransferAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.scrollNo}
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "180px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "220px" }}>
                    {row.accountName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.amount}
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


/* ===== from TransferFilterModal.tsx ===== */
const TransferFilterModal_filterOptions = [
  {
    id: "accountName",
    label: "Account Name",
    icon: <User size={18} className="text-primary" />,
    placeholder: "Account Name",
  },
  {
    id: "accountCode",
    label: "Account Code",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Account Code",
  },
  {
    id: "scrollNo",
    label: "Scroll No",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Scroll No",
  },
  {
    id: "amount",
    label: "Amount",
    icon: <IndianRupee size={18} className="text-primary" />,
    placeholder: "Amount",
  },
] as const;

type TransferFilterModal_FilterKey = (typeof TransferFilterModal_filterOptions)[number]["id"];

export type TransferFilterModal_TransferFilters = Record<TransferFilterModal_FilterKey, string>;

type TransferFilterModal_TransferFilterModalProps = {
  onClose: () => void;
  onApply: (filters: TransferFilterModal_TransferFilters) => void;
  initialValues?: TransferFilterModal_TransferFilters;
};

export const TransferFilterModal_defaultTransferFilters: TransferFilterModal_TransferFilters = {
  accountName: "",
  accountCode: "",
  scrollNo: "",
  amount: "",
};

function TransferFilterModal({
  onClose,
  onApply,
  initialValues = TransferFilterModal_defaultTransferFilters,
}: TransferFilterModal_TransferFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<TransferFilterModal_FilterKey>("accountName");
  const [values, setValues] = useState<TransferFilterModal_TransferFilters>(initialValues);

  const active = TransferFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(TransferFilterModal_defaultTransferFilters);
    onApply(TransferFilterModal_defaultTransferFilters);
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
          {TransferFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeTransferModal.tsx ===== */
export interface AuthorizeTransferModal_AuthorizeTransferModalProps {
  open: boolean;
  initialData?: Partial<TransferFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeTransferModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeTransferModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeTransferModal_AuthorizeTransferFooter = ({
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

const AuthorizeTransferModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeTransferModal_AuthorizeTransferModalProps) => {
  const [data] = useState<TransferFormData>(() => ({
    ...DEFAULT_TRANSFER_DATA,
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
        titleEn="Authorize Transfer"
        titleHi="हस्तांतरण अधिकृत करा"
        subtitleEn="Check information related to the transfer and authorize it."
        subtitleHi="हस्तांतरण व्यवहाराशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize Transfer" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeTransferModal_AuthorizeTransferFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Scroll Details"
          titleHi="स्क्रोल तपशील"
          subtitleEn="Transaction type and scroll identification for this transfer."
          subtitleHi="या हस्तांतरणासाठी स्क्रोल व व्यवहाराचा प्रकार."
          icon={<AuthorizeTransferModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTransferModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Sub Scroll No" labelHi="उप स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.subScrollNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Debit Amount" labelHi="नावे रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.debitAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Credit Amount" labelHi="जमा रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.creditAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Uncleared Balance" labelHi="अस्पष्ट शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.unclearedBalance} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the transfer being authorized."
          subtitleHi="अधिकृत करावयाच्या हस्तांतरणाची खाते माहिती."
          icon={<AuthorizeTransferModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountType} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTransferModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.description} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTransferModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<CreditCard size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.glAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required>
              <TextInput icon={<Hash size={16} />} value={data.customerId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Review Date" labelHi="खाते पुनरावलोकन तारीख" required>
              <DateInput value={data.accountReviewDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Last Transaction Date" labelHi="शेवटची व्यवहार तारीख" required>
              <DateInput value={data.lastTransactionDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.ledgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.availableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.newLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Limit Amount" labelHi="मर्यादा रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.limitAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Drawing Power" labelHi="कर्ज उचलण्याची क्षमता" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.drawingPower} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payment & Instrument Details"
          titleHi="पेमेंट व साधन तपशील"
          subtitleEn="Payment narration and cheque or instrument details."
          subtitleHi="पेमेंट व धनादेशाची माहिती."
          icon={<AuthorizeTransferModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <SelectField
              labelEn="Transaction Type"
              labelMr="व्यवहाराचा प्रकार"
              editable={false}
              icon={FileText}
              value={data.transactionType}
              onChange={() => {}}
            />

            <FieldShell label="Transaction Amount" labelHi="व्यवहार रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.transactionAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Transaction Amount in words" labelHi="शब्दात रक्कम" required>
              <TextInput icon={<User size={16} />} value={data.transactionAmountInWords} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Outlist Serial" labelHi="आऊटलिस्ट अनुक्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.outlistSerial} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTransferModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.descriptionPayment} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Out List Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.glOutListDocNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Book Status" labelHi="चेकबुक स्थिती" required>
              <TextInput icon={<User size={16} />} value={data.chequeBookStatus} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Type" labelHi="धनादेश प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.chequeType} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTransferModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required>
              <TextInput icon={<FileText size={16} />} value={data.chequeSeries} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.chequeNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Date" labelHi="धनादेश तारीख" required>
              <DateInput value={data.chequeDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.adviceNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Original / Responding" labelHi="मूळ / प्रतिसाद" required>
              <TextInput icon={<User size={16} />} value={data.originalResponding} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
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
            title="Transfer Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="Transfer Authorization Rejected"
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


/* ===== from TransferAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: TransferAuthorizeTable_TRANSFER_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: TransferAuthorizeTable_TRANSFER_TAB_COUNTS.rejected },
];

const TransferAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<TransferFilterModal_TransferFilters>(TransferFilterModal_defaultTransferFilters);
  const [authorizeRow, setAuthorizeRow] = useState<TransferAuthorizeTable_TransferAuthorizeRow | null>(null);

  const handleAuthorize = (row: TransferAuthorizeTable_TransferAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(TransferFilterModal_defaultTransferFilters);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Transfer Authorize"
        titleHi="हस्तांतरण अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "Transfer Authorize", href: "#" },
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

        <TransferAuthorizeTable
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
            <TransferFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeTransferModal
          open
          initialData={{
            scrollNumber: authorizeRow.scrollNo,
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
            transactionAmount: authorizeRow.amount,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default TransferAuthorizePage;
