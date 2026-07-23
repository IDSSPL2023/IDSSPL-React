import { useState } from "react";
import type { ChangeEvent } from "react";
import { ShieldCheck, X, Filter as FilterIcon, User, Hash, IndianRupee, CreditCard, FileText, MapPin, Phone, Mail, Landmark, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
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
import { DEFAULT_RTGS_DATA, type RtgsFormData } from "@/components/TransactionMaster/AddRtgs";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from RtgsAuthorizeTable.tsx ===== */
export type RtgsAuthorizeTable_RtgsAuthorizeTab = "new" | "rejected";

export type RtgsAuthorizeTable_RtgsAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  particular: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  tab: RtgsAuthorizeTable_RtgsAuthorizeTab;
};

const RtgsAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "140px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "200px" },
  { key: "amount", label: "Amount", sortable: true, width: "120px" },
  { key: "particular", label: "Particular", sortable: true, width: "140px" },
  { key: "userId", label: "User ID", sortable: true, width: "120px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "140px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const RtgsAuthorizeTable_SAMPLE_RTGS: Omit<RtgsAuthorizeTable_RtgsAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "118", accountCode: "00022010000001", accountName: "Akshay Om More", amount: "100", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "23-May-2026" },
  { scrollNo: "119", accountCode: "00022010000002", accountName: "Priya Singh", amount: "100", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "24-May-2026" },
  { scrollNo: "120", accountCode: "00022010000003", accountName: "Ravi Patel", amount: "100", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "25-May-2026" },
  { scrollNo: "121", accountCode: "00022010000004", accountName: "Neha Gupta", amount: "100", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "26-May-2026" },
  { scrollNo: "122", accountCode: "00022010000005", accountName: "Suresh Kumar", amount: "100", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "27-May-2026" },
  { scrollNo: "123", accountCode: "00022010000006", accountName: "Meera Das", amount: "150", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "28-May-2026" },
  { scrollNo: "124", accountCode: "00022010000007", accountName: "Rohan Bhatia", amount: "200", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "29-May-2026" },
  { scrollNo: "125", accountCode: "00022010000008", accountName: "Anita Roy", amount: "175", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "30-May-2026" },
  { scrollNo: "126", accountCode: "00022010000009", accountName: "Vikram Sethi", amount: "225", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "31-May-2026" },
  { scrollNo: "127", accountCode: "00022010000010", accountName: "Deepika Sharma", amount: "300", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "01-Jun-2026" },
  { scrollNo: "128", accountCode: "00022010000011", accountName: "Karan Joshi", amount: "125", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "02-Jun-2026" },
  { scrollNo: "129", accountCode: "00022010000012", accountName: "Simran Kaur", amount: "250", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "03-Jun-2026" },
  { scrollNo: "130", accountCode: "00022010000013", accountName: "Manoj Rathod", amount: "180", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "04-Jun-2026" },
  { scrollNo: "131", accountCode: "00022010000014", accountName: "Kavita Iyer", amount: "220", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "05-Jun-2026" },
  { scrollNo: "132", accountCode: "00022010000015", accountName: "Arjun Nair", amount: "160", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "06-Jun-2026" },
  { scrollNo: "133", accountCode: "00022010000016", accountName: "Pooja Verma", amount: "275", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "07-Jun-2026" },
  { scrollNo: "134", accountCode: "00022010000017", accountName: "Sanjay Mehta", amount: "190", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "08-Jun-2026" },
  { scrollNo: "135", accountCode: "00022010000018", accountName: "Divya Reddy", amount: "210", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "09-Jun-2026" },
  { scrollNo: "136", accountCode: "00022010000019", accountName: "Nikhil Rao", amount: "240", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "10-Jun-2026" },
  { scrollNo: "137", accountCode: "00022010000020", accountName: "Sneha Kapoor", amount: "260", particular: "Self", userId: "ABC", createdBy: "Admin", createdDate: "11-Jun-2026" },
];

const RtgsAuthorizeTable_buildRows = (tab: RtgsAuthorizeTable_RtgsAuthorizeTab, count: number): RtgsAuthorizeTable_RtgsAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...RtgsAuthorizeTable_SAMPLE_RTGS[i % RtgsAuthorizeTable_SAMPLE_RTGS.length],
    scrollNo: String(118 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const RtgsAuthorizeTable_RTGS_TAB_COUNTS: Record<RtgsAuthorizeTable_RtgsAuthorizeTab, number> = {
  new: 20,
  rejected: 18,
};

const RtgsAuthorizeTable_ALL_ROWS: RtgsAuthorizeTable_RtgsAuthorizeRow[] = [
  ...RtgsAuthorizeTable_buildRows("new", RtgsAuthorizeTable_RTGS_TAB_COUNTS.new),
  ...RtgsAuthorizeTable_buildRows("rejected", RtgsAuthorizeTable_RTGS_TAB_COUNTS.rejected),
];

const RtgsAuthorizeTable_PAGE_SIZE = 15;

type RtgsAuthorizeTable_SortKey = Exclude<(typeof RtgsAuthorizeTable_columns)[number]["key"], "action">;

type RtgsAuthorizeTable_RtgsAuthorizeTableProps = {
  activeTab: RtgsAuthorizeTable_RtgsAuthorizeTab;
  filters?: RtgsFilterModal_RtgsFilters;
  onAuthorize?: (row: RtgsAuthorizeTable_RtgsAuthorizeRow) => void;
};

const RtgsAuthorizeTable = ({ activeTab, filters, onAuthorize }: RtgsAuthorizeTable_RtgsAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<RtgsAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: RtgsAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = RtgsAuthorizeTable_ALL_ROWS.filter((r) => {
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / RtgsAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * RtgsAuthorizeTable_PAGE_SIZE, currentPage * RtgsAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1400px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {RtgsAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as RtgsAuthorizeTable_SortKey)}
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
                <td colSpan={RtgsAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "180px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "200px" }}>
                    {row.accountName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "120px" }}>
                    {row.amount}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.particular}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "120px" }}>
                    {row.userId}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
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


/* ===== from RtgsFilterModal.tsx ===== */
const RtgsFilterModal_filterOptions = [
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

type RtgsFilterModal_FilterKey = (typeof RtgsFilterModal_filterOptions)[number]["id"];

export type RtgsFilterModal_RtgsFilters = Record<RtgsFilterModal_FilterKey, string>;

type RtgsFilterModal_RtgsFilterModalProps = {
  onClose: () => void;
  onApply: (filters: RtgsFilterModal_RtgsFilters) => void;
  initialValues?: RtgsFilterModal_RtgsFilters;
};

export const RtgsFilterModal_defaultRtgsFilters: RtgsFilterModal_RtgsFilters = {
  accountName: "",
  accountCode: "",
  scrollNo: "",
  amount: "",
};

function RtgsFilterModal({
  onClose,
  onApply,
  initialValues = RtgsFilterModal_defaultRtgsFilters,
}: RtgsFilterModal_RtgsFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<RtgsFilterModal_FilterKey>("accountName");
  const [values, setValues] = useState<RtgsFilterModal_RtgsFilters>(initialValues);

  const active = RtgsFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(RtgsFilterModal_defaultRtgsFilters);
    onApply(RtgsFilterModal_defaultRtgsFilters);
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
          {RtgsFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeRtgsModal.tsx ===== */
export interface AuthorizeRtgsModal_AuthorizeRtgsModalProps {
  open: boolean;
  initialData?: Partial<RtgsFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeRtgsModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeRtgsModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeRtgsModal_AuthorizeRtgsFooter = ({
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

const AuthorizeRtgsModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeRtgsModal_AuthorizeRtgsModalProps) => {
  const [data] = useState<RtgsFormData>(() => ({
    ...DEFAULT_RTGS_DATA,
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
        titleEn="Authorize RTGS"
        titleHi="आरटीजीएस अधिकृत करा"
        subtitleEn="Check information related to the RTGS transaction and authorize it."
        subtitleHi="आरटीजीएस व्यवहाराशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize RTGS" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeRtgsModal_AuthorizeRtgsFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="RTGS Details"
          titleHi="आरटीजीएस तपशील"
          subtitleEn="Transaction mode and type for this RTGS transaction."
          subtitleHi="या आरटीजीएस व्यवहाराचा प्रकार व पद्धत."
          icon={<AuthorizeRtgsModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <SelectField
              labelEn="Transaction Mode"
              labelMr="व्यवहार पद्धत"
              editable={false}
              icon={CreditCard}
              value={data.transactionMode}
              onChange={() => {}}
            />

            <SelectField
              labelEn="Transaction Type"
              labelMr="व्यवहाराचा प्रकार"
              editable={false}
              icon={FileText}
              value={data.transactionType}
              onChange={() => {}}
            />

            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Transfer Details"
          titleHi="हस्तांतरण तपशील"
          subtitleEn="Account information for the RTGS transfer being authorized."
          subtitleHi="अधिकृत करावयाच्या आरटीजीएस हस्तांतरणाची खाते माहिती."
          icon={<AuthorizeRtgsModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRtgsModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly />
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

            <FieldShell label="Address 1" labelHi="पत्ता १" required>
              <TextInput icon={<MapPin size={16} />} value={data.transferAddress1} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 2" labelHi="पत्ता २" required>
              <TextInput icon={<MapPin size={16} />} value={data.transferAddress2} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 3" labelHi="पत्ता ३" required>
              <TextInput icon={<MapPin size={16} />} value={data.transferAddress3} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Outlist Serial" labelHi="आऊटलिस्ट अनुक्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.outlistSerial} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRtgsModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <SelectField
              labelEn="GL Outlist Description"
              labelMr="जीएल आऊटलिस्ट वर्णन"
              editable={false}
              icon={FileText}
              value={data.glOutlistDescription}
              onChange={() => {}}
            />

            <FieldShell label="GL Outlist Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.glOutlistDocNo} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRtgsModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <SelectField
              labelEn="Cheque Type"
              labelMr="धनादेश प्रकार"
              editable={false}
              icon={FileText}
              value={data.chequeType}
              onChange={() => {}}
            />

            <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required>
              <TextInput icon={<FileText size={16} />} value={data.chequeSeries} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.chequeNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Date" labelHi="धनादेश दिनांक" required>
              <DateInput value={data.chequeDate} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Cash Details"
          titleHi="रोख तपशील"
          subtitleEn="Applicant's details for a cash-based RTGS transaction."
          subtitleHi="रोख आरटीजीएस व्यवहारासाठी अर्जदाराचा तपशील."
          icon={<AuthorizeRtgsModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Name Of Applicant" labelHi="अर्जदाराचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.nameOfApplicant} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 1" labelHi="पत्ता १" required>
              <TextInput icon={<MapPin size={16} />} value={data.cashAddress1} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 2" labelHi="पत्ता २" required>
              <TextInput icon={<MapPin size={16} />} value={data.cashAddress2} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 3" labelHi="पत्ता ३" required>
              <TextInput icon={<MapPin size={16} />} value={data.cashAddress3} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Remitter Details"
          titleHi="प्रेषक तपशील"
          subtitleEn="Remitting bank and applicant contact information."
          subtitleHi="प्रेषक बँक व अर्जदार संपर्क माहिती."
          icon={<AuthorizeRtgsModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Remitting Bank IFSC Code" labelHi="प्रेषक बँक आयएफएससी कोड" required>
              <TextInput icon={<Landmark size={16} />} value={data.remittingBankIfscCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Application Contact No. (M)" labelHi="अर्ज संपर्क क्रमांक (मो.)" required>
              <TextInput icon={<Phone size={16} />} value={data.applicationContactNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Residence" labelHi="निवासस्थान" required>
              <TextInput icon={<Phone size={16} />} value={data.residence} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Office" labelHi="कार्यालय" required>
              <TextInput icon={<Phone size={16} />} value={data.office} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Application Email ID" labelHi="अर्ज ईमेल आयडी" required>
              <TextInput icon={<Mail size={16} />} value={data.applicationEmailId} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Beneficiary Details"
          titleHi="लाभार्थी तपशील"
          subtitleEn="Beneficiary and their bank details for this transaction."
          subtitleHi="या व्यवहारासाठी लाभार्थी व त्यांचा बँक तपशील."
          icon={<AuthorizeRtgsModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Beneficiary Name" labelHi="लाभार्थीचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.beneficiaryName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Beneficiary Account Code" labelHi="लाभार्थी खाते कोड" required>
              <TextInput icon={<CreditCard size={16} />} value={data.beneficiaryAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC Code" labelHi="आयएफएससी कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Landmark size={16} />} value={data.ifscCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRtgsModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="IFSC Bank Name" labelHi="आयएफएससी बँकेचे नाव" required>
              <TextInput icon={<Landmark size={16} />} value={data.ifscBankName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC Branch Name" labelHi="आयएफएससी शाखेचे नाव" required>
              <TextInput icon={<Landmark size={16} />} value={data.ifscBranchName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC Center Name" labelHi="आयएफएससी केंद्राचे नाव" required>
              <TextInput icon={<MapPin size={16} />} value={data.ifscCenterName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC District Name" labelHi="आयएफएससी जिल्ह्याचे नाव" required>
              <TextInput icon={<MapPin size={16} />} value={data.ifscDistrictName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC State Name" labelHi="आयएफएससी राज्याचे नाव" required>
              <TextInput icon={<MapPin size={16} />} value={data.ifscStateName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC Address" labelHi="आयएफएससी पत्ता" required>
              <TextInput icon={<MapPin size={16} />} value={data.ifscAddress} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Beneficiary Contact No." labelHi="लाभार्थी संपर्क क्रमांक" required>
              <TextInput icon={<Phone size={16} />} value={data.beneficiaryContactNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Beneficiary Address 1" labelHi="लाभार्थी पत्ता १" required>
              <TextInput icon={<MapPin size={16} />} value={data.beneficiaryAddress1} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Beneficiary Address 2" labelHi="लाभार्थी पत्ता २" required>
              <TextInput icon={<MapPin size={16} />} value={data.beneficiaryAddress2} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Zip" labelHi="पिन कोड" required>
              <TextInput icon={<Hash size={16} />} value={data.zip} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="City" labelHi="शहर" required>
              <TextInput icon={<MapPin size={16} />} value={data.city} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="State" labelHi="राज्य" required>
              <TextInput icon={<MapPin size={16} />} value={data.state} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Sender To Receiver Info" labelHi="प्रेषक ते प्राप्तकर्ता माहिती" required>
              <TextInput icon={<FileText size={16} />} value={data.senderToReceiverInfo} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payment Details"
          titleHi="देयक तपशील"
          subtitleEn="Remitting amount, charges and tax for this transaction."
          subtitleHi="या व्यवहारासाठी प्रेषित रक्कम, शुल्क व कर."
          icon={<AuthorizeRtgsModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Remitting Amount" labelHi="प्रेषित रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.remittingAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Applicable Charges" labelHi="लागू शुल्क" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.applicableCharges} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Service Tax" labelHi="सेवा कर" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<IndianRupee size={16} />} value={data.serviceTax} onChange={() => {}} readOnly />
                </div>
                <AuthorizeRtgsModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Total Amount" labelHi="एकूण रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.totalAmount} onChange={() => {}} readOnly />
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
            title="RTGS Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="RTGS Authorization Rejected"
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


/* ===== from RtgsAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: RtgsAuthorizeTable_RTGS_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: RtgsAuthorizeTable_RTGS_TAB_COUNTS.rejected },
];

const RtgsAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<RtgsFilterModal_RtgsFilters>(RtgsFilterModal_defaultRtgsFilters);
  const [authorizeRow, setAuthorizeRow] = useState<RtgsAuthorizeTable_RtgsAuthorizeRow | null>(null);

  const handleAuthorize = (row: RtgsAuthorizeTable_RtgsAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(RtgsFilterModal_defaultRtgsFilters);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="RTGS Authorize"
        titleHi="आरटीजीएस अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "RTGS Authorize", href: "#" },
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

        <RtgsAuthorizeTable
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
            <RtgsFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeRtgsModal
          open
          initialData={{
            scrollNumber: authorizeRow.scrollNo,
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
            remittingAmount: authorizeRow.amount,
            senderToReceiverInfo: authorizeRow.particular,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default RtgsAuthorizePage;
