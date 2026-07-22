import { useState } from "react";
import type { ChangeEvent } from "react";
import { ShieldCheck, Hash, IndianRupee, X, Filter as FilterIcon, User, CreditCard, FileText, Calendar, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
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
import { DEFAULT_MODIFY_TDS_DATA, type ModifyTdsTransactionFormData } from "@/components/TransactionMaster/AddModifyTdsTransaction";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from ModifyTdsTransactionAuthorizeTable.tsx ===== */
export type ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeTab = "new" | "rejected";

export type ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  amount: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  tab: ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeTab;
};

const ModifyTdsTransactionAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "160px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "220px" },
  { key: "amount", label: "Amount", sortable: true, width: "140px" },
  { key: "userId", label: "User ID", sortable: true, width: "140px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const ModifyTdsTransactionAuthorizeTable_SAMPLE_MODIFY_TDS: Omit<ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "218", accountCode: "00000000105087", amount: "5,000.0", userId: "ABC", createdBy: "Admin", createdDate: "23-May-2026" },
  { scrollNo: "219", accountCode: "00000000105088", amount: "3,500.0", userId: "ABC", createdBy: "Admin", createdDate: "24-May-2026" },
  { scrollNo: "220", accountCode: "00000000105089", amount: "7,200.0", userId: "ABC", createdBy: "Admin", createdDate: "25-May-2026" },
  { scrollNo: "221", accountCode: "00000000105090", amount: "2,100.0", userId: "ABC", createdBy: "Admin", createdDate: "26-May-2026" },
  { scrollNo: "222", accountCode: "00000000105091", amount: "9,800.0", userId: "ABC", createdBy: "Admin", createdDate: "27-May-2026" },
  { scrollNo: "223", accountCode: "00000000105092", amount: "4,650.0", userId: "ABC", createdBy: "Admin", createdDate: "28-May-2026" },
  { scrollNo: "224", accountCode: "00000000105093", amount: "6,300.0", userId: "ABC", createdBy: "Admin", createdDate: "29-May-2026" },
  { scrollNo: "225", accountCode: "00000000105094", amount: "1,750.0", userId: "ABC", createdBy: "Admin", createdDate: "30-May-2026" },
  { scrollNo: "226", accountCode: "00000000105095", amount: "8,400.0", userId: "ABC", createdBy: "Admin", createdDate: "31-May-2026" },
  { scrollNo: "227", accountCode: "00000000105096", amount: "3,900.0", userId: "ABC", createdBy: "Admin", createdDate: "01-Jun-2026" },
];

const ModifyTdsTransactionAuthorizeTable_buildRows = (tab: ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeTab, count: number): ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...ModifyTdsTransactionAuthorizeTable_SAMPLE_MODIFY_TDS[i % ModifyTdsTransactionAuthorizeTable_SAMPLE_MODIFY_TDS.length],
    scrollNo: String(218 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const ModifyTdsTransactionAuthorizeTable_MODIFY_TDS_TRANSACTION_TAB_COUNTS: Record<ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeTab, number> = {
  new: 16,
  rejected: 10,
};

const ModifyTdsTransactionAuthorizeTable_ALL_ROWS: ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeRow[] = [
  ...ModifyTdsTransactionAuthorizeTable_buildRows("new", ModifyTdsTransactionAuthorizeTable_MODIFY_TDS_TRANSACTION_TAB_COUNTS.new),
  ...ModifyTdsTransactionAuthorizeTable_buildRows("rejected", ModifyTdsTransactionAuthorizeTable_MODIFY_TDS_TRANSACTION_TAB_COUNTS.rejected),
];

const ModifyTdsTransactionAuthorizeTable_PAGE_SIZE = 15;

type ModifyTdsTransactionAuthorizeTable_SortKey = Exclude<(typeof ModifyTdsTransactionAuthorizeTable_columns)[number]["key"], "action">;

type ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeTableProps = {
  activeTab: ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeTab;
  filters?: ModifyTdsTransactionFilterModal_ModifyTdsTransactionFilters;
  onAuthorize?: (row: ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeRow) => void;
};

const ModifyTdsTransactionAuthorizeTable = ({ activeTab, filters, onAuthorize }: ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<ModifyTdsTransactionAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: ModifyTdsTransactionAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = ModifyTdsTransactionAuthorizeTable_ALL_ROWS.filter((r) => {
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / ModifyTdsTransactionAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * ModifyTdsTransactionAuthorizeTable_PAGE_SIZE, currentPage * ModifyTdsTransactionAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1100px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {ModifyTdsTransactionAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as ModifyTdsTransactionAuthorizeTable_SortKey)}
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
                <td colSpan={ModifyTdsTransactionAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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


/* ===== from ModifyTdsTransactionFilterModal.tsx ===== */
const ModifyTdsTransactionFilterModal_filterOptions = [
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

type ModifyTdsTransactionFilterModal_FilterKey = (typeof ModifyTdsTransactionFilterModal_filterOptions)[number]["id"];

export type ModifyTdsTransactionFilterModal_ModifyTdsTransactionFilters = Record<ModifyTdsTransactionFilterModal_FilterKey, string>;

type ModifyTdsTransactionFilterModal_ModifyTdsTransactionFilterModalProps = {
  onClose: () => void;
  onApply: (filters: ModifyTdsTransactionFilterModal_ModifyTdsTransactionFilters) => void;
  initialValues?: ModifyTdsTransactionFilterModal_ModifyTdsTransactionFilters;
};

export const ModifyTdsTransactionFilterModal_defaultModifyTdsTransactionFilters: ModifyTdsTransactionFilterModal_ModifyTdsTransactionFilters = {
  accountCode: "",
  scrollNo: "",
  amount: "",
  userId: "",
};

function ModifyTdsTransactionFilterModal({
  onClose,
  onApply,
  initialValues = ModifyTdsTransactionFilterModal_defaultModifyTdsTransactionFilters,
}: ModifyTdsTransactionFilterModal_ModifyTdsTransactionFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<ModifyTdsTransactionFilterModal_FilterKey>("accountCode");
  const [values, setValues] = useState<ModifyTdsTransactionFilterModal_ModifyTdsTransactionFilters>(initialValues);

  const active = ModifyTdsTransactionFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(ModifyTdsTransactionFilterModal_defaultModifyTdsTransactionFilters);
    onApply(ModifyTdsTransactionFilterModal_defaultModifyTdsTransactionFilters);
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
          {ModifyTdsTransactionFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeModifyTdsTransactionModal.tsx ===== */
export interface AuthorizeModifyTdsTransactionModal_AuthorizeModifyTdsTransactionModalProps {
  open: boolean;
  initialData?: Partial<ModifyTdsTransactionFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeModifyTdsTransactionModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeModifyTdsTransactionModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeModifyTdsTransactionModal_AuthorizeModifyTdsTransactionFooter = ({
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

const AuthorizeModifyTdsTransactionModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeModifyTdsTransactionModal_AuthorizeModifyTdsTransactionModalProps) => {
  const [data] = useState<ModifyTdsTransactionFormData>(() => ({
    ...DEFAULT_MODIFY_TDS_DATA,
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
        titleEn="Authorize Modify TDS Transaction"
        titleHi="टीडीएस व्यवहार सुधारणे अधिकृत करा"
        subtitleEn="Check information related to the modified TDS transaction and authorize it."
        subtitleHi="सुधारित टीडीएस व्यवहाराशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize Modify TDS Transaction" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeModifyTdsTransactionModal_AuthorizeModifyTdsTransactionFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the modified TDS transaction being authorized."
          subtitleHi="अधिकृत करावयाच्या सुधारित टीडीएस व्यवहाराची खाते माहिती."
          icon={<AuthorizeModifyTdsTransactionModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Select" labelHi="निवडा" required>
              <SelectInput icon={<FileText size={16} />} value={data.selectPaid} onChange={() => {}} options={[data.selectPaid]} readOnly />
            </FieldShell>

            <FieldShell label="Select" labelHi="निवडा" required>
              <SelectInput icon={<FileText size={16} />} value={data.selectAddTds} onChange={() => {}} options={[data.selectAddTds]} readOnly />
            </FieldShell>

            <FieldShell label="Old TDS Date" labelHi="जुनी टीडीएस तारीख" required>
              <DateInput value={data.oldTdsDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New TDS Date" labelHi="नवीन टीडीएस तारीख" required>
              <DateInput value={data.newTdsDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeModifyTdsTransactionModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required>
              <TextInput icon={<User size={16} />} value={data.customerId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Pan card Number" labelHi="पॅन कार्ड क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.panCardNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Form 15 H" labelHi="फॉर्म १५ एच" required>
              <TextInput icon={<FileText size={16} />} value={data.form15H} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Form 15 G" labelHi="फॉर्म १५ जी" required>
              <TextInput icon={<FileText size={16} />} value={data.form15G} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="TDS Payable" labelHi="देय टीडीएस" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.tdsPayable} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="TDS Paid" labelHi="भरलेला टीडीएस" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.tdsPaid} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Transaction Amount" labelHi="व्यवहार रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.transactionAmount} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        {showRejectReason && (
          <RejectReasonModal
            titleEn="Modify TDS Transaction Authorize Rejected"
            titleHi="टीडीएस व्यवहार सुधारणा स्थिती"
            onClose={() => setShowRejectReason(false)}
            onConfirm={handleConfirmReject}
          />
        )}

        {actionModal === "authorize" && (
          <SuccessModal
            title="Modify TDS Transaction Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="Modify TDS Transaction Authorization Rejected"
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


/* ===== from ModifyTdsTransactionAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: ModifyTdsTransactionAuthorizeTable_MODIFY_TDS_TRANSACTION_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: ModifyTdsTransactionAuthorizeTable_MODIFY_TDS_TRANSACTION_TAB_COUNTS.rejected },
];

const ModifyTdsTransactionAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<ModifyTdsTransactionFilterModal_ModifyTdsTransactionFilters>(ModifyTdsTransactionFilterModal_defaultModifyTdsTransactionFilters);
  const [authorizeRow, setAuthorizeRow] = useState<ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeRow | null>(null);

  const handleAuthorize = (row: ModifyTdsTransactionAuthorizeTable_ModifyTdsTransactionAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(ModifyTdsTransactionFilterModal_defaultModifyTdsTransactionFilters);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Modify TDS Transaction"
        titleHi="टीडीएस व्यवहार सुधारणे अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "Modify TDS Transaction", href: "#" },
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

        <ModifyTdsTransactionAuthorizeTable
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
            <ModifyTdsTransactionFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeModifyTdsTransactionModal
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

export default ModifyTdsTransactionAuthorizePage;
