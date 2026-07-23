import { useState } from "react";
import type { ChangeEvent } from "react";
import { ShieldCheck, X, Filter as FilterIcon, User, Hash, IndianRupee, CreditCard, FileText, Percent, Landmark, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import Pagination from "@/components/shared/Pagination";
import { IMAGES } from "@/assets";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SectionCard, RadioYesNo, SelectField } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { DEFAULT_TL_CC_INSTALLMENT_DATA, type TlCcInstallmentFormData } from "@/components/TransactionMaster/AddTlCcInstallment";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from TlCcInstallmentAuthorizeTable.tsx ===== */
export type TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeTab = "new" | "rejected";

export type TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  createdBy: string;
  createdDate: string;
  tab: TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeTab;
};

const TlCcInstallmentAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "140px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "200px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "220px" },
  { key: "amount", label: "Amount", sortable: true, width: "140px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const TlCcInstallmentAuthorizeTable_SAMPLE_INSTALLMENTS: Omit<TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "121", accountCode: "00024010014611", accountName: "Sankannar URF Kalasannavar", amount: "10.0", createdBy: "Admin", createdDate: "23-Jun-2026" },
  { scrollNo: "122", accountCode: "00024010014612", accountName: "Vikram Nagar", amount: "15.5", createdBy: "Admin", createdDate: "24-Jun-2026" },
  { scrollNo: "123", accountCode: "00024010014613", accountName: "Sunrise Heights", amount: "20.0", createdBy: "Admin", createdDate: "25-Jun-2026" },
  { scrollNo: "124", accountCode: "00024010014614", accountName: "Greenwood Estates", amount: "12.5", createdBy: "Admin", createdDate: "26-Jun-2026" },
  { scrollNo: "125", accountCode: "00024010014615", accountName: "Maple Grove", amount: "18.0", createdBy: "Admin", createdDate: "27-Jun-2026" },
  { scrollNo: "126", accountCode: "00024010014616", accountName: "Riverbend", amount: "22.0", createdBy: "Admin", createdDate: "28-Jun-2026" },
  { scrollNo: "127", accountCode: "00024010014617", accountName: "Hilltop Villa", amount: "14.0", createdBy: "Clerk1", createdDate: "29-Jun-2026" },
  { scrollNo: "128", accountCode: "00024010014618", accountName: "Oceanview Apartments", amount: "19.0", createdBy: "Admin", createdDate: "30-Jun-2026" },
  { scrollNo: "129", accountCode: "00024010014619", accountName: "Cedar Park", amount: "11.0", createdBy: "Clerk1", createdDate: "01-Jul-2026" },
  { scrollNo: "130", accountCode: "00024010014620", accountName: "Lakeside Residency", amount: "24.5", createdBy: "Admin", createdDate: "02-Jul-2026" },
  { scrollNo: "131", accountCode: "00024010014621", accountName: "Palm Court", amount: "16.5", createdBy: "Clerk1", createdDate: "03-Jul-2026" },
  { scrollNo: "132", accountCode: "00024010014622", accountName: "Silver Springs", amount: "13.0", createdBy: "Admin", createdDate: "04-Jul-2026" },
  { scrollNo: "133", accountCode: "00024010014623", accountName: "Golden Meadows", amount: "21.0", createdBy: "Clerk1", createdDate: "05-Jul-2026" },
  { scrollNo: "134", accountCode: "00024010014624", accountName: "Willow Creek", amount: "17.5", createdBy: "Admin", createdDate: "06-Jul-2026" },
  { scrollNo: "135", accountCode: "00024010014625", accountName: "Emerald Heights", amount: "23.0", createdBy: "Clerk1", createdDate: "07-Jul-2026" },
  { scrollNo: "136", accountCode: "00024010014626", accountName: "Sunset Boulevard", amount: "12.5", createdBy: "Admin", createdDate: "08-Jul-2026" },
  { scrollNo: "137", accountCode: "00024010014627", accountName: "Blue Ridge Apartments", amount: "18.5", createdBy: "Clerk1", createdDate: "09-Jul-2026" },
  { scrollNo: "138", accountCode: "00024010014628", accountName: "Rosewood Enclave", amount: "15.5", createdBy: "Admin", createdDate: "10-Jul-2026" },
  { scrollNo: "139", accountCode: "00024010014629", accountName: "Pinehill Residency", amount: "20.5", createdBy: "Clerk1", createdDate: "11-Jul-2026" },
  { scrollNo: "140", accountCode: "00024010014630", accountName: "Northgate Towers", amount: "9.5", createdBy: "Admin", createdDate: "12-Jul-2026" },
];

const TlCcInstallmentAuthorizeTable_buildRows = (tab: TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeTab, count: number): TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...TlCcInstallmentAuthorizeTable_SAMPLE_INSTALLMENTS[i % TlCcInstallmentAuthorizeTable_SAMPLE_INSTALLMENTS.length],
    scrollNo: String(121 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const TlCcInstallmentAuthorizeTable_TL_CC_INSTALLMENT_TAB_COUNTS: Record<TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeTab, number> = {
  new: 20,
  rejected: 18,
};

const TlCcInstallmentAuthorizeTable_ALL_ROWS: TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeRow[] = [
  ...TlCcInstallmentAuthorizeTable_buildRows("new", TlCcInstallmentAuthorizeTable_TL_CC_INSTALLMENT_TAB_COUNTS.new),
  ...TlCcInstallmentAuthorizeTable_buildRows("rejected", TlCcInstallmentAuthorizeTable_TL_CC_INSTALLMENT_TAB_COUNTS.rejected),
];

const TlCcInstallmentAuthorizeTable_PAGE_SIZE = 15;

type TlCcInstallmentAuthorizeTable_SortKey = Exclude<(typeof TlCcInstallmentAuthorizeTable_columns)[number]["key"], "action">;

type TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeTableProps = {
  activeTab: TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeTab;
  filters?: TlCcInstallmentFilterModal_TlCcInstallmentFilters;
  onAuthorize?: (row: TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeRow) => void;
};

const TlCcInstallmentAuthorizeTable = ({ activeTab, filters, onAuthorize }: TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<TlCcInstallmentAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: TlCcInstallmentAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = TlCcInstallmentAuthorizeTable_ALL_ROWS.filter((r) => {
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / TlCcInstallmentAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * TlCcInstallmentAuthorizeTable_PAGE_SIZE, currentPage * TlCcInstallmentAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1200px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {TlCcInstallmentAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as TlCcInstallmentAuthorizeTable_SortKey)}
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
                <td colSpan={TlCcInstallmentAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.scrollNo}
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "200px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "220px" }}>
                    {row.accountName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
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


/* ===== from TlCcInstallmentFilterModal.tsx ===== */
const TlCcInstallmentFilterModal_filterOptions = [
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

type TlCcInstallmentFilterModal_FilterKey = (typeof TlCcInstallmentFilterModal_filterOptions)[number]["id"];

export type TlCcInstallmentFilterModal_TlCcInstallmentFilters = Record<TlCcInstallmentFilterModal_FilterKey, string>;

type TlCcInstallmentFilterModal_TlCcInstallmentFilterModalProps = {
  onClose: () => void;
  onApply: (filters: TlCcInstallmentFilterModal_TlCcInstallmentFilters) => void;
  initialValues?: TlCcInstallmentFilterModal_TlCcInstallmentFilters;
};

export const TlCcInstallmentFilterModal_defaultTlCcInstallmentFilters: TlCcInstallmentFilterModal_TlCcInstallmentFilters = {
  accountName: "",
  accountCode: "",
  scrollNo: "",
  amount: "",
};

function TlCcInstallmentFilterModal({
  onClose,
  onApply,
  initialValues = TlCcInstallmentFilterModal_defaultTlCcInstallmentFilters,
}: TlCcInstallmentFilterModal_TlCcInstallmentFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<TlCcInstallmentFilterModal_FilterKey>("accountName");
  const [values, setValues] = useState<TlCcInstallmentFilterModal_TlCcInstallmentFilters>(initialValues);

  const active = TlCcInstallmentFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(TlCcInstallmentFilterModal_defaultTlCcInstallmentFilters);
    onApply(TlCcInstallmentFilterModal_defaultTlCcInstallmentFilters);
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
          {TlCcInstallmentFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeTlCcInstallmentModal.tsx ===== */
export interface AuthorizeTlCcInstallmentModal_AuthorizeTlCcInstallmentModalProps {
  open: boolean;
  initialData?: Partial<TlCcInstallmentFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeTlCcInstallmentModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeTlCcInstallmentModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeTlCcInstallmentModal_AuthorizeTlCcInstallmentFooter = ({
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

const AuthorizeTlCcInstallmentModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeTlCcInstallmentModal_AuthorizeTlCcInstallmentModalProps) => {
  const [data] = useState<TlCcInstallmentFormData>(() => ({
    ...DEFAULT_TL_CC_INSTALLMENT_DATA,
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
        titleEn="Authorize TL/CC Installment"
        titleHi="TLCC हप्ता अधिकृत करा"
        subtitleEn="Check information related to the TL/CC installment and authorize it."
        subtitleHi="TLCC हप्त्याशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize TL/CC Installment" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeTlCcInstallmentModal_AuthorizeTlCcInstallmentFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the installment being authorized."
          subtitleHi="अधिकृत करावयाच्या हप्त्याची खाते माहिती."
          icon={<AuthorizeTlCcInstallmentModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <RadioYesNo
              label="Is Ho Transaction"
              labelHi="मुख्य कार्यालय व्यवहार आहे का"
              value={data.isHoTransaction}
              onChange={() => {}}
              disabled
            />

            <FieldShell label="Account Type" labelHi="खाते प्रकार" required>
              <TextInput icon={<CreditCard size={16} />} value={data.accountType} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTlCcInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<Landmark size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.glAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Review Date" labelHi="पुनरावलोकन तारीख" required>
              <DateInput value={data.reviewDate} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Account Summary"
          titleHi="ठेव सारांश"
          subtitleEn="Deposit, installment and balance summary."
          subtitleHi="ठेव, हप्ता व शिल्लक सारांश."
          icon={<AuthorizeTlCcInstallmentModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.depositAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Surcharge" labelHi="अधिभार" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.surcharge} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Amount" labelHi="व्याज रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Installment Type ID" labelHi="हप्ता प्रकार" required>
              <TextInput icon={<FileText size={16} />} value={data.installmentTypeId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Open Date" labelHi="खाते उघडण्याची तारीख" required>
              <DateInput value={data.openDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Period" labelHi="कालावधी" required>
              <TextInput icon={<Hash size={16} />} value={data.period} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Completed Months" labelHi="पूर्ण महिने" required>
              <TextInput icon={<Hash size={16} />} value={data.completedMonths} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Overdue" labelHi="Overdue" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.overdue} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खाते शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.ledgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.availableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खाते शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.newLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Rate" labelHi="व्याजदर" required>
              <TextInput icon={<Percent size={16} />} value={data.interestRate} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payment Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Mode of payment, cheque and posting details."
          subtitleHi="पेमेंट पद्धत, धनादेश व नोंद तपशील."
          icon={<AuthorizeTlCcInstallmentModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <SelectField
              labelEn="Mode of Payment"
              labelMr="पेमेंट पद्धत"
              editable={false}
              icon={CreditCard}
              value={data.modeOfPayment}
              onChange={() => {}}
            />

            <FieldShell label="Transfer A/c Code" labelHi="स्थानांतरण खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.transferAccountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTlCcInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Transfer A/c Name" labelHi="स्थानांतरण खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.transferAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<Landmark size={16} />} value={data.paymentGlAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.paymentGlAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खाते शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentAvailableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खाते शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentNewLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular 1" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular1} onChange={() => {}} readOnly />
            </FieldShell>

            <SelectField
              labelEn="Original / Responding"
              labelMr="मूळ / प्रतिसाद"
              editable={false}
              icon={FileText}
              value={data.originalResponding}
              onChange={() => {}}
            />

            <FieldShell label="Cheque Type" labelHi="धनादेश प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.chequeType} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTlCcInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required>
              <TextInput icon={<FileText size={16} />} value={data.chequeSeries} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.chequeNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Date" labelHi="धनादेश तारीख" required>
              <DateInput value={data.chequeDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Upto Date" labelHi="व्याज अंतिम तारीख" required>
              <DateInput value={data.interestUpToDate} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="GL Posting Details"
          titleHi="जीएल नोंद तपशील"
          subtitleEn="GL outlist and advice details."
          subtitleHi="जीएल आऊटलिस्ट व सल्ला तपशील."
          icon={<AuthorizeTlCcInstallmentModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="GL Out List No" labelHi="जीएल बाह्य यादी क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.glOutlistNo} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTlCcInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="GL Out List Doc. No" labelHi="जीएल दस्तऐवज क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutlistDocNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.adviceNumber} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTlCcInstallmentModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Advice Date" labelHi="सल्ला तारीख" required>
              <DateInput value={data.adviceDate} onChange={() => {}} readOnly />
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
            title="TL/CC Installment Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="TL/CC Installment Authorization Rejected"
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


/* ===== from TlCcInstallmentAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: TlCcInstallmentAuthorizeTable_TL_CC_INSTALLMENT_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: TlCcInstallmentAuthorizeTable_TL_CC_INSTALLMENT_TAB_COUNTS.rejected },
];

const TlCcInstallmentAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<TlCcInstallmentFilterModal_TlCcInstallmentFilters>(TlCcInstallmentFilterModal_defaultTlCcInstallmentFilters);
  const [authorizeRow, setAuthorizeRow] = useState<TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeRow | null>(null);

  const handleAuthorize = (row: TlCcInstallmentAuthorizeTable_TlCcInstallmentAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(TlCcInstallmentFilterModal_defaultTlCcInstallmentFilters);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="TL/CC Installment Authorize"
        titleHi="TLCC हप्ता मंजूर करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "TL/CC Installment Authorize", href: "#" },
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

        <TlCcInstallmentAuthorizeTable
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
            <TlCcInstallmentFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeTlCcInstallmentModal
          open
          initialData={{
            scrollNumber: authorizeRow.scrollNo,
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
            depositAmount: authorizeRow.amount,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default TlCcInstallmentAuthorizePage;
