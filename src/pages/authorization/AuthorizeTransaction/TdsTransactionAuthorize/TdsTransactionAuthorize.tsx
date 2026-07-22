import { useState } from "react";
import type { ChangeEvent } from "react";
import { ShieldCheck, Hash, IndianRupee, X, Filter as FilterIcon, User, CreditCard, IdCard, FileCheck, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
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
import { DEFAULT_TDS_TRANSACTION_DATA, type TdsTransactionFormData } from "@/components/TransactionMaster/AddTdsTransaction";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from TdsTransactionAuthorizeTable.tsx ===== */
export type TdsTransactionAuthorizeTable_TdsTransactionAuthorizeTab = "new" | "rejected";

export type TdsTransactionAuthorizeTable_TdsTransactionAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  amount: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  tab: TdsTransactionAuthorizeTable_TdsTransactionAuthorizeTab;
};

const TdsTransactionAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "160px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "220px" },
  { key: "amount", label: "Amount", sortable: true, width: "140px" },
  { key: "userId", label: "User ID", sortable: true, width: "140px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const TdsTransactionAuthorizeTable_SAMPLE_TDS: Omit<TdsTransactionAuthorizeTable_TdsTransactionAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "118", accountCode: "00022010000001", amount: "100.0", userId: "ABC", createdBy: "Admin", createdDate: "23-May-2026" },
  { scrollNo: "119", accountCode: "00022010000002", amount: "250.0", userId: "ABC", createdBy: "Admin", createdDate: "24-May-2026" },
  { scrollNo: "120", accountCode: "00022010000003", amount: "500.0", userId: "ABC", createdBy: "Admin", createdDate: "25-May-2026" },
  { scrollNo: "121", accountCode: "00022010000004", amount: "1000.0", userId: "ABC", createdBy: "Admin", createdDate: "26-May-2026" },
  { scrollNo: "122", accountCode: "00022010000005", amount: "750.0", userId: "ABC", createdBy: "Admin", createdDate: "27-May-2026" },
  { scrollNo: "123", accountCode: "00022010000006", amount: "310.0", userId: "ABC", createdBy: "Admin", createdDate: "28-May-2026" },
  { scrollNo: "124", accountCode: "00022010000007", amount: "480.0", userId: "ABC", createdBy: "Admin", createdDate: "29-May-2026" },
  { scrollNo: "125", accountCode: "00022010000008", amount: "615.0", userId: "ABC", createdBy: "Admin", createdDate: "30-May-2026" },
  { scrollNo: "126", accountCode: "00022010000009", amount: "740.0", userId: "ABC", createdBy: "Admin", createdDate: "31-May-2026" },
  { scrollNo: "127", accountCode: "00022010000010", amount: "195.0", userId: "ABC", createdBy: "Admin", createdDate: "01-Jun-2026" },
  { scrollNo: "128", accountCode: "00022010000011", amount: "860.0", userId: "ABC", createdBy: "Admin", createdDate: "02-Jun-2026" },
  { scrollNo: "129", accountCode: "00022010000012", amount: "425.0", userId: "ABC", createdBy: "Admin", createdDate: "03-Jun-2026" },
  { scrollNo: "130", accountCode: "00022010000013", amount: "570.0", userId: "ABC", createdBy: "Admin", createdDate: "04-Jun-2026" },
  { scrollNo: "131", accountCode: "00022010000014", amount: "650.0", userId: "ABC", createdBy: "Admin", createdDate: "05-Jun-2026" },
  { scrollNo: "132", accountCode: "00022010000015", amount: "390.0", userId: "ABC", createdBy: "Admin", createdDate: "06-Jun-2026" },
  { scrollNo: "133", accountCode: "00022010000016", amount: "805.0", userId: "ABC", createdBy: "Admin", createdDate: "07-Jun-2026" },
  { scrollNo: "134", accountCode: "00022010000017", amount: "265.0", userId: "ABC", createdBy: "Admin", createdDate: "08-Jun-2026" },
  { scrollNo: "135", accountCode: "00022010000018", amount: "735.0", userId: "ABC", createdBy: "Admin", createdDate: "09-Jun-2026" },
  { scrollNo: "136", accountCode: "00022010000019", amount: "310.0", userId: "ABC", createdBy: "Admin", createdDate: "10-Jun-2026" },
  { scrollNo: "137", accountCode: "00022010000020", amount: "890.0", userId: "ABC", createdBy: "Admin", createdDate: "11-Jun-2026" },
];

const TdsTransactionAuthorizeTable_buildRows = (tab: TdsTransactionAuthorizeTable_TdsTransactionAuthorizeTab, count: number): TdsTransactionAuthorizeTable_TdsTransactionAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...TdsTransactionAuthorizeTable_SAMPLE_TDS[i % TdsTransactionAuthorizeTable_SAMPLE_TDS.length],
    scrollNo: String(118 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const TdsTransactionAuthorizeTable_TDS_TRANSACTION_TAB_COUNTS: Record<TdsTransactionAuthorizeTable_TdsTransactionAuthorizeTab, number> = {
  new: 20,
  rejected: 18,
};

const TdsTransactionAuthorizeTable_ALL_ROWS: TdsTransactionAuthorizeTable_TdsTransactionAuthorizeRow[] = [
  ...TdsTransactionAuthorizeTable_buildRows("new", TdsTransactionAuthorizeTable_TDS_TRANSACTION_TAB_COUNTS.new),
  ...TdsTransactionAuthorizeTable_buildRows("rejected", TdsTransactionAuthorizeTable_TDS_TRANSACTION_TAB_COUNTS.rejected),
];

const TdsTransactionAuthorizeTable_PAGE_SIZE = 15;

type TdsTransactionAuthorizeTable_SortKey = Exclude<(typeof TdsTransactionAuthorizeTable_columns)[number]["key"], "action">;

type TdsTransactionAuthorizeTable_TdsTransactionAuthorizeTableProps = {
  activeTab: TdsTransactionAuthorizeTable_TdsTransactionAuthorizeTab;
  filters?: TdsTransactionFilterModal_TdsTransactionFilters;
  onAuthorize?: (row: TdsTransactionAuthorizeTable_TdsTransactionAuthorizeRow) => void;
};

const TdsTransactionAuthorizeTable = ({ activeTab, filters, onAuthorize }: TdsTransactionAuthorizeTable_TdsTransactionAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<TdsTransactionAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: TdsTransactionAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = TdsTransactionAuthorizeTable_ALL_ROWS.filter((r) => {
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.accountCode && !r.accountCode.toLowerCase().includes(filters.accountCode.toLowerCase())) return false;
    if (filters.scrollNo && !r.scrollNo.toLowerCase().includes(filters.scrollNo.toLowerCase())) return false;
    if (filters.amount && !r.amount.toLowerCase().includes(filters.amount.toLowerCase())) return false;
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / TdsTransactionAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * TdsTransactionAuthorizeTable_PAGE_SIZE, currentPage * TdsTransactionAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1100px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {TdsTransactionAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as TdsTransactionAuthorizeTable_SortKey)}
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
                <td colSpan={TdsTransactionAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.scrollNo}
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "220px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.amount}
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


/* ===== from TdsTransactionFilterModal.tsx ===== */
const TdsTransactionFilterModal_filterOptions = [
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
  {
    id: "userId",
    label: "User ID",
    icon: <User size={18} className="text-primary" />,
    placeholder: "User ID",
  },
] as const;

type TdsTransactionFilterModal_FilterKey = (typeof TdsTransactionFilterModal_filterOptions)[number]["id"];

export type TdsTransactionFilterModal_TdsTransactionFilters = Record<TdsTransactionFilterModal_FilterKey, string>;

type TdsTransactionFilterModal_TdsTransactionFilterModalProps = {
  onClose: () => void;
  onApply: (filters: TdsTransactionFilterModal_TdsTransactionFilters) => void;
  initialValues?: TdsTransactionFilterModal_TdsTransactionFilters;
};

export const TdsTransactionFilterModal_defaultTdsTransactionFilters: TdsTransactionFilterModal_TdsTransactionFilters = {
  accountCode: "",
  scrollNo: "",
  amount: "",
  userId: "",
};

function TdsTransactionFilterModal({
  onClose,
  onApply,
  initialValues = TdsTransactionFilterModal_defaultTdsTransactionFilters,
}: TdsTransactionFilterModal_TdsTransactionFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<TdsTransactionFilterModal_FilterKey>("accountCode");
  const [values, setValues] = useState<TdsTransactionFilterModal_TdsTransactionFilters>(initialValues);

  const active = TdsTransactionFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(TdsTransactionFilterModal_defaultTdsTransactionFilters);
    onApply(TdsTransactionFilterModal_defaultTdsTransactionFilters);
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
          {TdsTransactionFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeTdsTransactionModal.tsx ===== */
export interface AuthorizeTdsTransactionModal_AuthorizeTdsTransactionModalProps {
  open: boolean;
  initialData?: Partial<TdsTransactionFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeTdsTransactionModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeTdsTransactionModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeTdsTransactionModal_AuthorizeTdsTransactionFooter = ({
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

const AuthorizeTdsTransactionModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeTdsTransactionModal_AuthorizeTdsTransactionModalProps) => {
  const [data] = useState<TdsTransactionFormData>(() => ({
    ...DEFAULT_TDS_TRANSACTION_DATA,
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
        titleEn="Authorize TDS Entry"
        titleHi="टीडीएस नोंद अधिकृत करा"
        subtitleEn="Check information related to the TDS entry and authorize it."
        subtitleHi="टीडीएस नोंदीशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize TDS Entry" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeTdsTransactionModal_AuthorizeTdsTransactionFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the TDS entry being authorized."
          subtitleHi="अधिकृत करावयाच्या टीडीएस नोंदीची खाते माहिती."
          icon={<AuthorizeTdsTransactionModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <SelectField
              labelEn="Select"
              labelMr="निवडा"
              editable={false}
              icon={CreditCard}
              value={data.selectType}
              onChange={() => {}}
            />

            <FieldShell label="TDS Date" labelHi="टीडीएस दिनांक" required>
              <DateInput value={data.tdsDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTdsTransactionModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required>
              <TextInput icon={<Hash size={16} />} value={data.customerId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="PAN Card Number" labelHi="पॅन कार्ड क्रमांक" required>
              <TextInput icon={<IdCard size={16} />} value={data.panCardNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Form 15 H" labelHi="फॉर्म १५ एच" required>
              <TextInput icon={<FileCheck size={16} />} value={data.form15H} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Form 15 G" labelHi="फॉर्म १५ जी" required>
              <TextInput icon={<FileCheck size={16} />} value={data.form15G} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Amount" labelHi="व्याज रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Transaction Amount" labelHi="व्यवहार रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.transactionAmount} onChange={() => {}} readOnly />
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
            title="TDS Entry Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="TDS Entry Authorization Rejected"
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


/* ===== from TdsTransactionAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: TdsTransactionAuthorizeTable_TDS_TRANSACTION_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: TdsTransactionAuthorizeTable_TDS_TRANSACTION_TAB_COUNTS.rejected },
];

const TdsTransactionAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<TdsTransactionFilterModal_TdsTransactionFilters>(TdsTransactionFilterModal_defaultTdsTransactionFilters);
  const [authorizeRow, setAuthorizeRow] = useState<TdsTransactionAuthorizeTable_TdsTransactionAuthorizeRow | null>(null);

  const handleAuthorize = (row: TdsTransactionAuthorizeTable_TdsTransactionAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(TdsTransactionFilterModal_defaultTdsTransactionFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="TDS Entry"
        titleHi="टीडीएस नोंद अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "TDS Entry", href: "#" },
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

        <TdsTransactionAuthorizeTable
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
            <TdsTransactionFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeTdsTransactionModal
          open
          initialData={{
            accountCode: authorizeRow.accountCode,
            transactionAmount: authorizeRow.amount,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default TdsTransactionAuthorizePage;
