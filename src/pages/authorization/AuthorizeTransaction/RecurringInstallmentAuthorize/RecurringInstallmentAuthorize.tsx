import { useState } from "react";
import type { ChangeEvent } from "react";
import { ShieldCheck, X, Filter as FilterIcon, User, Hash, CreditCard, IndianRupee, FileText, Percent, Building2, ArrowLeftRight, Landmark, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import { IMAGES } from "@/assets";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SectionCard, RadioYesNo, RadioDayMonth, SelectField } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { DEFAULT_RECURRING_INSTALLMENT_DATA, type RecurringInstallmentFormData } from "@/components/TransactionMaster/AddRecurringInstallment";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from RecurringInstallmentAuthorizeTable.tsx ===== */
export type RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeTab = "new" | "modify" | "rejected";

export type RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  scrollDate: string;
  createdBy: string;
  createdDate: string;
  tab: RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeTab;
};

const RecurringInstallmentAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "140px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "200px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "200px" },
  { key: "scrollDate", label: "Scroll Date", sortable: true, width: "160px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const RecurringInstallmentAuthorizeTable_SAMPLE_INSTALLMENTS: Omit<RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "118", accountCode: "00022010000001", accountName: "Akshay Om More", scrollDate: "12-May-2026", createdBy: "Admin", createdDate: "23-May-2026" },
  { scrollNo: "119", accountCode: "00022010000002", accountName: "Priya Singh", scrollDate: "13-May-2026", createdBy: "Admin", createdDate: "24-May-2026" },
  { scrollNo: "120", accountCode: "00022010000003", accountName: "Ravi Patel", scrollDate: "14-May-2026", createdBy: "Admin", createdDate: "25-May-2026" },
  { scrollNo: "121", accountCode: "00022010000004", accountName: "Neha Gupta", scrollDate: "15-May-2026", createdBy: "Admin", createdDate: "26-May-2026" },
  { scrollNo: "122", accountCode: "00022010000005", accountName: "Suresh Kumar", scrollDate: "16-May-2026", createdBy: "Admin", createdDate: "27-May-2026" },
  { scrollNo: "123", accountCode: "00022010000006", accountName: "Meera Das", scrollDate: "17-May-2026", createdBy: "Admin", createdDate: "28-May-2026" },
  { scrollNo: "124", accountCode: "00022010000007", accountName: "Rohan Bhatia", scrollDate: "18-May-2026", createdBy: "Admin", createdDate: "29-May-2026" },
  { scrollNo: "125", accountCode: "00022010000008", accountName: "Anita Roy", scrollDate: "19-May-2026", createdBy: "Admin", createdDate: "30-May-2026" },
  { scrollNo: "126", accountCode: "00022010000009", accountName: "Vikram Sethi", scrollDate: "20-May-2026", createdBy: "Admin", createdDate: "31-May-2026" },
  { scrollNo: "127", accountCode: "00022010000010", accountName: "Deepika Sharma", scrollDate: "21-May-2026", createdBy: "Admin", createdDate: "01-Jun-2026" },
  { scrollNo: "128", accountCode: "00022010000011", accountName: "Karan Joshi", scrollDate: "22-May-2026", createdBy: "Admin", createdDate: "02-Jun-2026" },
  { scrollNo: "129", accountCode: "00022010000012", accountName: "Simran Kaur", scrollDate: "23-May-2026", createdBy: "Admin", createdDate: "03-Jun-2026" },
  { scrollNo: "130", accountCode: "00022010000013", accountName: "Manoj Rathod", scrollDate: "24-May-2026", createdBy: "Admin", createdDate: "04-Jun-2026" },
  { scrollNo: "131", accountCode: "00022010000014", accountName: "Kavita Iyer", scrollDate: "25-May-2026", createdBy: "Admin", createdDate: "05-Jun-2026" },
  { scrollNo: "132", accountCode: "00022010000015", accountName: "Arjun Nair", scrollDate: "26-May-2026", createdBy: "Admin", createdDate: "06-Jun-2026" },
  { scrollNo: "133", accountCode: "00022010000016", accountName: "Pooja Verma", scrollDate: "27-May-2026", createdBy: "Admin", createdDate: "07-Jun-2026" },
  { scrollNo: "134", accountCode: "00022010000017", accountName: "Sanjay Mehta", scrollDate: "28-May-2026", createdBy: "Admin", createdDate: "08-Jun-2026" },
  { scrollNo: "135", accountCode: "00022010000018", accountName: "Divya Reddy", scrollDate: "29-May-2026", createdBy: "Admin", createdDate: "09-Jun-2026" },
  { scrollNo: "136", accountCode: "00022010000019", accountName: "Nikhil Rao", scrollDate: "30-May-2026", createdBy: "Admin", createdDate: "10-Jun-2026" },
  { scrollNo: "137", accountCode: "00022010000020", accountName: "Sneha Kapoor", scrollDate: "31-May-2026", createdBy: "Admin", createdDate: "11-Jun-2026" },
];

const RecurringInstallmentAuthorizeTable_buildRows = (tab: RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeTab, count: number): RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...RecurringInstallmentAuthorizeTable_SAMPLE_INSTALLMENTS[i % RecurringInstallmentAuthorizeTable_SAMPLE_INSTALLMENTS.length],
    scrollNo: String(118 + i + (tab === "modify" ? 50 : tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const RecurringInstallmentAuthorizeTable_RECURRING_INSTALLMENT_TAB_COUNTS: Record<RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeTab, number> = {
  new: 20,
  modify: 18,
  rejected: 18,
};

const RecurringInstallmentAuthorizeTable_ALL_ROWS: RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeRow[] = [
  ...RecurringInstallmentAuthorizeTable_buildRows("new", RecurringInstallmentAuthorizeTable_RECURRING_INSTALLMENT_TAB_COUNTS.new),
  ...RecurringInstallmentAuthorizeTable_buildRows("modify", RecurringInstallmentAuthorizeTable_RECURRING_INSTALLMENT_TAB_COUNTS.modify),
  ...RecurringInstallmentAuthorizeTable_buildRows("rejected", RecurringInstallmentAuthorizeTable_RECURRING_INSTALLMENT_TAB_COUNTS.rejected),
];

const RecurringInstallmentAuthorizeTable_PAGE_SIZE = 15;

type RecurringInstallmentAuthorizeTable_SortKey = Exclude<(typeof RecurringInstallmentAuthorizeTable_columns)[number]["key"], "action">;

type RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeTableProps = {
  activeTab: RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeTab;
  filters?: RecurringInstallmentFilterModal_RecurringInstallmentFilters;
  onAuthorize?: (row: RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeRow) => void;
};

const RecurringInstallmentAuthorizeTable = ({ activeTab, filters, onAuthorize }: RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<RecurringInstallmentAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: RecurringInstallmentAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = RecurringInstallmentAuthorizeTable_ALL_ROWS.filter((r) => {
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.accountName && !r.accountName.toLowerCase().includes(filters.accountName.toLowerCase())) return false;
    if (filters.accountCode && !r.accountCode.toLowerCase().includes(filters.accountCode.toLowerCase())) return false;
    if (filters.scrollNo && !r.scrollNo.toLowerCase().includes(filters.scrollNo.toLowerCase())) return false;
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / RecurringInstallmentAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * RecurringInstallmentAuthorizeTable_PAGE_SIZE, currentPage * RecurringInstallmentAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1200px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {RecurringInstallmentAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as RecurringInstallmentAuthorizeTable_SortKey)}
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
                <td colSpan={RecurringInstallmentAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.scrollNo}
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "200px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "200px" }}>
                    {row.accountName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.scrollDate}
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


/* ===== from RecurringInstallmentFilterModal.tsx ===== */
const RecurringInstallmentFilterModal_filterOptions = [
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
] as const;

type RecurringInstallmentFilterModal_FilterKey = (typeof RecurringInstallmentFilterModal_filterOptions)[number]["id"];

export type RecurringInstallmentFilterModal_RecurringInstallmentFilters = Record<RecurringInstallmentFilterModal_FilterKey, string>;

type RecurringInstallmentFilterModal_RecurringInstallmentFilterModalProps = {
  onClose: () => void;
  onApply: (filters: RecurringInstallmentFilterModal_RecurringInstallmentFilters) => void;
  initialValues?: RecurringInstallmentFilterModal_RecurringInstallmentFilters;
};

export const RecurringInstallmentFilterModal_defaultRecurringInstallmentFilters: RecurringInstallmentFilterModal_RecurringInstallmentFilters = {
  accountName: "",
  accountCode: "",
  scrollNo: "",
};

function RecurringInstallmentFilterModal({
  onClose,
  onApply,
  initialValues = RecurringInstallmentFilterModal_defaultRecurringInstallmentFilters,
}: RecurringInstallmentFilterModal_RecurringInstallmentFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<RecurringInstallmentFilterModal_FilterKey>("accountName");
  const [values, setValues] = useState<RecurringInstallmentFilterModal_RecurringInstallmentFilters>(initialValues);

  const active = RecurringInstallmentFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(RecurringInstallmentFilterModal_defaultRecurringInstallmentFilters);
    onApply(RecurringInstallmentFilterModal_defaultRecurringInstallmentFilters);
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
          {RecurringInstallmentFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeRecurringInstallmentModal.tsx ===== */
export interface AuthorizeRecurringInstallmentModal_AuthorizeRecurringInstallmentModalProps {
  open: boolean;
  initialData?: Partial<RecurringInstallmentFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeRecurringInstallmentModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeRecurringInstallmentModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeRecurringInstallmentModal_AuthorizeRecurringInstallmentFooter = ({
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

const AuthorizeRecurringInstallmentModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeRecurringInstallmentModal_AuthorizeRecurringInstallmentModalProps) => {
  const [data] = useState<RecurringInstallmentFormData>(() => ({
    ...DEFAULT_RECURRING_INSTALLMENT_DATA,
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
        titleEn="Authorize Recurring Installment"
        titleHi="आवर्ती हप्ता अधिकृत करा"
        subtitleEn="Check information related to the recurring installment and authorize it."
        subtitleHi="आवर्ती हप्त्याशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize Recurring Installment" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeRecurringInstallmentModal_AuthorizeRecurringInstallmentFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the installment being authorized."
          subtitleHi="अधिकृत करावयाच्या हप्त्याची खाते माहिती."
          icon={<AuthorizeRecurringInstallmentModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <RadioYesNo
              label="Is HO Transaction"
              labelHi="मुख्य कार्यालय व्यवहार आहे का"
              value={data.isHoTransaction}
              onChange={() => {}}
              disabled
            />

            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRecurringInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<Landmark size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.glAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Up To Date" labelHi="व्याज या तारखेपर्यंत" required>
              <TextInput icon={<Hash size={16} />} value={data.interestUpToDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Account Summary"
          titleHi="ठेव सारांश"
          subtitleEn="Deposit, maturity and installment summary."
          subtitleHi="ठेव, परिपक्वता व हप्ता सारांश."
          icon={<AuthorizeRecurringInstallmentModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.depositAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Open Date" labelHi="उघडण्याची तारीख" required>
              <DateInput value={data.openDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required>
              <DateInput value={data.maturityDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Rate" labelHi="व्याज दर" required>
              <TextInput icon={<Percent size={16} />} value={data.interestRate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Maturity Value" labelHi="परिपक्वतेची किंमत" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.maturityValue} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Period" labelHi="महिना" required>
              <TextInput icon={<Hash size={16} />} value={data.period} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Unit Of Period" labelHi="कालावधीचे एकक" required>
              <TextInput icon={<ArrowLeftRight size={16} />} value={data.unitOfPeriod} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Pending Installment" labelHi="प्रलंबित हप्तो" required>
              <TextInput icon={<Hash size={16} />} value={data.pendingInstallment} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खाते शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.summaryLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.summaryAvailableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन लेजर शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.summaryNewLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Installment Amount" labelHi="हप्ता रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.installmentAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Actual Installment" labelHi="खऱ्या हप्त्याचे पैसे" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.actualInstallment} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Pending Installment" labelHi="प्रलंबित हप्तो" required>
              <TextInput icon={<Hash size={16} />} value={data.pendingInstallment2} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ideal Installment" labelHi="आदर्श हप्ते" required>
              <TextInput icon={<Hash size={16} />} value={data.idealInstallment} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payment Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Mode of payment, interest and cheque details."
          subtitleHi="पेमेंट पद्धत, व्याज व धनादेश तपशील."
          icon={<AuthorizeRecurringInstallmentModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <SelectField
              labelEn="Mode Of Payment"
              labelMr="पेमेंट पद्धत"
              editable={false}
              icon={CreditCard}
              value={data.modeOfPayment}
              onChange={() => {}}
            />

            <FieldShell label="Transfer Account Code" labelHi="स्थानांतरण खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.transferAccountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRecurringInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Transfer Account Name" labelHi="स्थानांतरण खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.transferAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="विशेष" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खाते शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentAvailableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन लेजर शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentNewLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Last Int Date" labelHi="शेवटची व्याज तारीख" required>
              <TextInput icon={<Hash size={16} />} value={data.lastIntDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Completed Days" labelHi="पूर्ण केलेले दिवस" required>
              <TextInput icon={<Hash size={16} />} value={data.completedDays} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Completed Months" labelHi="पूर्ण केलेले महिने" required>
              <TextInput icon={<Hash size={16} />} value={data.completedMonths} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Calculated" labelHi="व्याज गणना केली" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestCalculated} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Pending Cash Interest" labelHi="प्रलंबित रोख व्याज" required>
              <TextInput icon={<Percent size={16} />} value={data.pendingCashInterest} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Pay" labelHi="व्याज देणे" required>
              <TextInput icon={<Percent size={16} />} value={data.interestPay} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Payable" labelHi="देय व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestPayable} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Total Int Paid" labelHi="एकूण व्याज भरले" required>
              <TextInput icon={<Percent size={16} />} value={data.totalInterestPaid} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioYesNo
              label="Is Renewal"
              labelHi="आहे नूतनीकरण"
              value={data.isRenewal}
              onChange={() => {}}
              disabled
            />

            <RadioYesNo
              label="Transfer By Cheque"
              labelHi="चेक द्वारे हस्तांतरण"
              value={data.transferByCheque}
              onChange={() => {}}
              disabled
            />

            <RadioDayMonth
              label="Original / Responding"
              labelHi="मूळ / प्रतिसाद"
              value={data.originalOrResponding === "Original"}
              onChange={() => {}}
              options={["Original", "Responding"]}
              disabled
            />

            <FieldShell label="Cheque Type" labelHi="धनादेश प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.chequeType} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRecurringInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required>
              <TextInput icon={<FileText size={16} />} value={data.chequeSeries} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.chequeNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Date" labelHi="धनादेश तारीख" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <DateInput value={data.chequeDate} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRecurringInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <RadioYesNo
              label="Is Penal Apply"
              labelHi="दंड लागू होतो का"
              value={data.isPenalApply}
              onChange={() => {}}
              disabled
            />

            <FieldShell label="N. Interest Rate" labelHi="एन. व्याज दर" required>
              <TextInput icon={<Percent size={16} />} value={data.nInterestRate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="N. Interest Amount" labelHi="एन. व्याज रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.nInterestAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Penal Int Rate" labelHi="दंडात्मक व्याज दर" required>
              <TextInput icon={<Percent size={16} />} value={data.penalIntRate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Penal Int Amount" labelHi="दंड व्याज रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.penalIntAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Amount" labelHi="व्याज रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestAmount} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="GL / Accounting Information"
          titleHi="जीएल / लेखापरीक्षा माहिती"
          subtitleEn="GL outlist, advice and account type details."
          subtitleHi="जीएल आऊटलिस्ट, सल्ला व खाते प्रकार तपशील."
          icon={<AuthorizeRecurringInstallmentModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="GL Outlist No" labelHi="जीएल आऊटलिस्ट क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.glOutlistNo} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRecurringInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="GL Outlist Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutlistDocNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.description} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.adviceNumber} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRecurringInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Advice Date" labelHi="सल्ल्याची तारीख" required>
              <DateInput value={data.adviceDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required>
              <TextInput icon={<Building2 size={16} />} value={data.accountType} onChange={() => {}} readOnly />
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
            title="Recurring Installment Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="Recurring Installment Authorization Rejected"
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


/* ===== from RecurringInstallmentAuthorizePage.tsx ===== */
const RecurringInstallmentAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<RecurringInstallmentFilterModal_RecurringInstallmentFilters>(RecurringInstallmentFilterModal_defaultRecurringInstallmentFilters);
  const [authorizeRow, setAuthorizeRow] = useState<RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeRow | null>(null);

  const handleAuthorize = (row: RecurringInstallmentAuthorizeTable_RecurringInstallmentAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(RecurringInstallmentFilterModal_defaultRecurringInstallmentFilters);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Recurring Installment Authorize"
        titleHi="आवर्ती हप्ता अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "Recurring Installment Authorize", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-3 px-3 py-3">
        <AuthorizationTabs
          active={activeTab}
          onChange={setActiveTab}
          onOpenFilter={() => setIsFilterOpen(true)}
          isSearchVisible={isSearchVisible}
          onToggleSearch={() => setIsSearchVisible((v) => !v)}
          hasActiveFilters={hasActiveFilters(filters)}
          activeFilterSummary={getActiveFilterSummary(filters)}
          onResetFilters={handleResetFilters}
        />

        <RecurringInstallmentAuthorizeTable
          activeTab={activeTab}
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
            <RecurringInstallmentFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeRecurringInstallmentModal
          open
          initialData={{
            scrollNumber: authorizeRow.scrollNo,
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default RecurringInstallmentAuthorizePage;
