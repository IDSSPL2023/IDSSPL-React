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
import { FieldShell, TextInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from TlOtherChargesAuthorizeTable.tsx ===== */
export type TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeTab = "new" | "rejected";

export type TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  amount: string;
  userId: string;
  totalAmount: string;
  particular: string;
  createdBy: string;
  createdDate: string;
  tab: TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeTab;
};

const TlOtherChargesAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Action", sortable: false, width: "80px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "160px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "220px" },
  { key: "amount", label: "Amount", sortable: true, width: "140px" },
  { key: "userId", label: "User ID", sortable: true, width: "140px" },
  { key: "totalAmount", label: "Total Amount", sortable: true, width: "150px" },
  { key: "particular", label: "Particular", sortable: true, width: "160px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "160px" },
] as const;

const TlOtherChargesAuthorizeTable_SAMPLE_TL_OTHER_CHARGES: Omit<TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "118", accountCode: "00025050002501", amount: "845.0", userId: "ABC", totalAmount: "1,250", particular: "By Cash", createdBy: "Admin", createdDate: "23-May-2026" },
  { scrollNo: "119", accountCode: "00025050002502", amount: "620.0", userId: "ABC", totalAmount: "980", particular: "By Cash", createdBy: "Admin", createdDate: "24-May-2026" },
  { scrollNo: "120", accountCode: "00025050002503", amount: "1,150.0", userId: "ABC", totalAmount: "2,400", particular: "By Transfer", createdBy: "Clerk1", createdDate: "25-May-2026" },
  { scrollNo: "121", accountCode: "00025050002504", amount: "430.0", userId: "ABC", totalAmount: "560", particular: "By Cash", createdBy: "Clerk1", createdDate: "26-May-2026" },
  { scrollNo: "122", accountCode: "00025050002505", amount: "980.0", userId: "ABC", totalAmount: "3,150", particular: "By Transfer", createdBy: "Admin", createdDate: "27-May-2026" },
  { scrollNo: "123", accountCode: "00025050002506", amount: "560.0", userId: "ABC", totalAmount: "1,800", particular: "By Cash", createdBy: "Admin", createdDate: "28-May-2026" },
  { scrollNo: "124", accountCode: "00025050002507", amount: "715.0", userId: "ABC", totalAmount: "720", particular: "By Cash", createdBy: "Clerk1", createdDate: "29-May-2026" },
  { scrollNo: "125", accountCode: "00025050002508", amount: "290.0", userId: "ABC", totalAmount: "4,300", particular: "By Transfer", createdBy: "Admin", createdDate: "30-May-2026" },
  { scrollNo: "126", accountCode: "00025050002509", amount: "1,020.0", userId: "ABC", totalAmount: "1,050", particular: "By Cash", createdBy: "Clerk1", createdDate: "31-May-2026" },
  { scrollNo: "127", accountCode: "00025050002510", amount: "505.0", userId: "ABC", totalAmount: "2,900", particular: "By Cash", createdBy: "Admin", createdDate: "01-Jun-2026" },
  { scrollNo: "128", accountCode: "00025050002511", amount: "845.0", userId: "ABC", totalAmount: "640", particular: "By Transfer", createdBy: "Clerk1", createdDate: "02-Jun-2026" },
  { scrollNo: "129", accountCode: "00025050002512", amount: "620.0", userId: "ABC", totalAmount: "1,975", particular: "By Cash", createdBy: "Admin", createdDate: "03-Jun-2026" },
  { scrollNo: "130", accountCode: "00025050002513", amount: "1,150.0", userId: "ABC", totalAmount: "3,600", particular: "By Cash", createdBy: "Clerk1", createdDate: "04-Jun-2026" },
  { scrollNo: "131", accountCode: "00025050002514", amount: "430.0", userId: "ABC", totalAmount: "825", particular: "By Transfer", createdBy: "Admin", createdDate: "05-Jun-2026" },
  { scrollNo: "132", accountCode: "00025050002515", amount: "980.0", userId: "ABC", totalAmount: "2,150", particular: "By Cash", createdBy: "Clerk1", createdDate: "06-Jun-2026" },
  { scrollNo: "133", accountCode: "00025050002516", amount: "560.0", userId: "ABC", totalAmount: "1,400", particular: "By Cash", createdBy: "Admin", createdDate: "07-Jun-2026" },
  { scrollNo: "134", accountCode: "00025050002517", amount: "715.0", userId: "ABC", totalAmount: "3,050", particular: "By Transfer", createdBy: "Clerk1", createdDate: "08-Jun-2026" },
  { scrollNo: "135", accountCode: "00025050002518", amount: "290.0", userId: "ABC", totalAmount: "690", particular: "By Cash", createdBy: "Admin", createdDate: "09-Jun-2026" },
  { scrollNo: "136", accountCode: "00025050002519", amount: "1,020.0", userId: "ABC", totalAmount: "2,725", particular: "By Cash", createdBy: "Clerk1", createdDate: "10-Jun-2026" },
  { scrollNo: "137", accountCode: "00025050002520", amount: "505.0", userId: "ABC", totalAmount: "1,150", particular: "By Transfer", createdBy: "Admin", createdDate: "11-Jun-2026" },
];

const TlOtherChargesAuthorizeTable_buildRows = (tab: TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeTab, count: number): TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...TlOtherChargesAuthorizeTable_SAMPLE_TL_OTHER_CHARGES[i % TlOtherChargesAuthorizeTable_SAMPLE_TL_OTHER_CHARGES.length],
    scrollNo: String(118 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const TlOtherChargesAuthorizeTable_TL_OTHER_CHARGES_TAB_COUNTS: Record<TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeTab, number> = {
  new: 20,
  rejected: 18,
};

const TlOtherChargesAuthorizeTable_ALL_ROWS: TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeRow[] = [
  ...TlOtherChargesAuthorizeTable_buildRows("new", TlOtherChargesAuthorizeTable_TL_OTHER_CHARGES_TAB_COUNTS.new),
  ...TlOtherChargesAuthorizeTable_buildRows("rejected", TlOtherChargesAuthorizeTable_TL_OTHER_CHARGES_TAB_COUNTS.rejected),
];

const TlOtherChargesAuthorizeTable_PAGE_SIZE = 15;

type TlOtherChargesAuthorizeTable_SortKey = Exclude<(typeof TlOtherChargesAuthorizeTable_columns)[number]["key"], "action">;

type TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeTableProps = {
  activeTab: TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeTab;
  filters?: TlOtherChargesFilterModal_TlOtherChargesFilters;
  onAuthorize?: (row: TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeRow) => void;
};

const TlOtherChargesAuthorizeTable = ({ activeTab, filters, onAuthorize }: TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<TlOtherChargesAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: TlOtherChargesAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = TlOtherChargesAuthorizeTable_ALL_ROWS.filter((r) => {
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / TlOtherChargesAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * TlOtherChargesAuthorizeTable_PAGE_SIZE, currentPage * TlOtherChargesAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1150px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {TlOtherChargesAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as TlOtherChargesAuthorizeTable_SortKey)}
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
                <td colSpan={TlOtherChargesAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.totalAmount}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.particular}
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


/* ===== from TlOtherChargesFilterModal.tsx ===== */
const TlOtherChargesFilterModal_filterOptions = [
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

type TlOtherChargesFilterModal_FilterKey = (typeof TlOtherChargesFilterModal_filterOptions)[number]["id"];

export type TlOtherChargesFilterModal_TlOtherChargesFilters = Record<TlOtherChargesFilterModal_FilterKey, string>;

type TlOtherChargesFilterModal_TlOtherChargesFilterModalProps = {
  onClose: () => void;
  onApply: (filters: TlOtherChargesFilterModal_TlOtherChargesFilters) => void;
  initialValues?: TlOtherChargesFilterModal_TlOtherChargesFilters;
};

export const TlOtherChargesFilterModal_defaultTlOtherChargesFilters: TlOtherChargesFilterModal_TlOtherChargesFilters = {
  accountCode: "",
  scrollNo: "",
  amount: "",
  userId: "",
};

function TlOtherChargesFilterModal({
  onClose,
  onApply,
  initialValues = TlOtherChargesFilterModal_defaultTlOtherChargesFilters,
}: TlOtherChargesFilterModal_TlOtherChargesFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<TlOtherChargesFilterModal_FilterKey>("accountCode");
  const [values, setValues] = useState<TlOtherChargesFilterModal_TlOtherChargesFilters>(initialValues);

  const active = TlOtherChargesFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(TlOtherChargesFilterModal_defaultTlOtherChargesFilters);
    onApply(TlOtherChargesFilterModal_defaultTlOtherChargesFilters);
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
          {TlOtherChargesFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeTlOtherChargesModal.tsx ===== */
export interface AuthorizeTlOtherChargesModal_TlOtherChargesChargeRow {
  key: string;
  type: string;
  typeHi: string;
  charge: string;
  chargeHi: string;
  glHeadCode: string;
  glDescription: string;
  totalAmount: string;
}

export interface AuthorizeTlOtherChargesModal_TlOtherChargesFormData {
  scrollNumber: string;
  particular: string;
  accountCode: string;
  insuranceDate: string;
  recoveryAmt: string;
  insuranceFireAmt: string;
  abnFeesAmt: string;
  executionFeesAmt: string;
  chargeRows: AuthorizeTlOtherChargesModal_TlOtherChargesChargeRow[];
}

export const AuthorizeTlOtherChargesModal_DEFAULT_TL_OTHER_CHARGES_ROWS: AuthorizeTlOtherChargesModal_TlOtherChargesChargeRow[] = [
  { key: "insurance", type: "Insurance", typeHi: "विमा", charge: "Insurance", chargeHi: "विमा", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "recovery", type: "Recovery", typeHi: "वसुली", charge: "Recovery", chargeHi: "वसुली", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "insuranceFire", type: "Insurance Fire", typeHi: "आग विमा", charge: "Insurance Fire", chargeHi: "आग विमा", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "abnFees", type: "ABN Fees", typeHi: "एबीएन शुल्क", charge: "ABN Fees", chargeHi: "एबीएन शुल्क", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "executionFees", type: "Execution Fees", typeHi: "अंमलबजावणी शुल्क", charge: "Execution Fees", chargeHi: "अंमलबजावणी शुल्क", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "otherCharges", type: "Other Charges", typeHi: "इतर आकार", charge: "Other Charges", chargeHi: "इतर आकार", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "transferGlHead", type: "Transfer GL Head", typeHi: "इतर आकार", charge: "Grand Total", chargeHi: "एकूण रक्कम", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
];

export const AuthorizeTlOtherChargesModal_DEFAULT_TL_OTHER_CHARGES_DATA: AuthorizeTlOtherChargesModal_TlOtherChargesFormData = {
  scrollNumber: "",
  particular: "By Cash",
  accountCode: "00025050002501",
  insuranceDate: "2026-05-23",
  recoveryAmt: "500.0",
  insuranceFireAmt: "250.0",
  abnFeesAmt: "150.0",
  executionFeesAmt: "100.0",
  chargeRows: AuthorizeTlOtherChargesModal_DEFAULT_TL_OTHER_CHARGES_ROWS,
};

export interface AuthorizeTlOtherChargesModal_AuthorizeTlOtherChargesModalProps {
  open: boolean;
  initialData?: Partial<AuthorizeTlOtherChargesModal_TlOtherChargesFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeTlOtherChargesModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeTlOtherChargesModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeTlOtherChargesModal_AuthorizeTlOtherChargesFooter = ({
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

const AuthorizeTlOtherChargesModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeTlOtherChargesModal_AuthorizeTlOtherChargesModalProps) => {
  const [data] = useState<AuthorizeTlOtherChargesModal_TlOtherChargesFormData>(() => ({
    ...AuthorizeTlOtherChargesModal_DEFAULT_TL_OTHER_CHARGES_DATA,
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
        titleEn="Authorize TL Other Charges"
        titleHi="मुदत कर्जाचे इतर शुल्क अधिकृत करा"
        subtitleEn="Check information related to the TL other charges and authorize it."
        subtitleHi="मुदत कर्जाच्या इतर शुल्काशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize TL Other Charges" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeTlOtherChargesModal_AuthorizeTlOtherChargesFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Payment Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Scroll number for the TL other charges transaction being authorized."
          subtitleHi="अधिकृत करावयाच्या व्यवहाराचा स्कोल क्रमांक."
          icon={<AuthorizeTlOtherChargesModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Scroll Number" labelHi="स्कोल क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Charges Details"
          titleHi="आकारांचा तपशील"
          subtitleEn="GL head, description and amount for each charge type."
          subtitleHi="प्रत्येक शुल्क प्रकारासाठी जीएल हेड, वर्णन व रक्कम."
          icon={<AuthorizeTlOtherChargesModal_SectionIcon />}
        >
          <div className="border border-slate-200 dark:border-slate-800 rounded-[10px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
              <table className="w-full border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-[#1e1b4b]">
                    {["Type", "GI Head Code", "GI Description", "Charges", "Total Amount", "Tallied"].map((label) => (
                      <th
                        key={label}
                        className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-bold text-white"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {data.chargeRows.map((row) => (
                    <tr key={row.key} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-2 align-middle">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.type}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{row.typeHi}</div>
                      </td>
                      <td className="px-4 py-2 align-middle text-sm text-slate-600 dark:text-slate-300">
                        {row.glHeadCode || "-"}
                      </td>
                      <td className="px-4 py-2 align-middle text-sm text-slate-600 dark:text-slate-300">
                        {row.glDescription || "-"}
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.charge}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{row.chargeHi}</div>
                      </td>
                      <td className="px-4 py-2 align-middle text-sm font-medium text-slate-700 dark:text-slate-300">
                        {row.totalAmount}
                      </td>
                      <td className="px-4 py-2 align-middle text-sm text-slate-600 dark:text-slate-300">0.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the TL other charges being authorized."
          subtitleHi="अधिकृत करावयाच्या व्यवहाराची खाते माहिती."
          icon={<AuthorizeTlOtherChargesModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeTlOtherChargesModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Insurance" labelHi="विमा" required>
              <TextInput type="date" icon={<Calendar size={16} />} value={data.insuranceDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Recovery" labelHi="वसुली" required>
              <TextInput icon={<CreditCard size={16} />} value={data.recoveryAmt} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Insurance Fire" labelHi="आग विमा" required>
              <TextInput icon={<CreditCard size={16} />} value={data.insuranceFireAmt} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="ABN Fees" labelHi="एबीएन शुल्क" required>
              <TextInput icon={<CreditCard size={16} />} value={data.abnFeesAmt} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Execution Fees" labelHi="अंमलबजावणी शुल्क" required>
              <TextInput icon={<CreditCard size={16} />} value={data.executionFeesAmt} onChange={() => {}} readOnly />
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
            title="TL Other Charges Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="TL Other Charges Authorization Rejected"
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


/* ===== from TlOtherChargesAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: TlOtherChargesAuthorizeTable_TL_OTHER_CHARGES_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: TlOtherChargesAuthorizeTable_TL_OTHER_CHARGES_TAB_COUNTS.rejected },
];

const TlOtherChargesAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<TlOtherChargesFilterModal_TlOtherChargesFilters>(TlOtherChargesFilterModal_defaultTlOtherChargesFilters);
  const [authorizeRow, setAuthorizeRow] = useState<TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeRow | null>(null);

  const handleAuthorize = (row: TlOtherChargesAuthorizeTable_TlOtherChargesAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(TlOtherChargesFilterModal_defaultTlOtherChargesFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="TL Other Charges Authorize"
        titleHi="मुदत कर्जाचे इतर शुल्क अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", onClick: () => router.push("/authorization") },
          { label: "TL Other Charges Authorize", href: "#" },
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

        <TlOtherChargesAuthorizeTable
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
            <TlOtherChargesFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeTlOtherChargesModal
          open
          initialData={{
            scrollNumber: authorizeRow.scrollNo,
            accountCode: authorizeRow.accountCode,
            particular: authorizeRow.particular,
            chargeRows: AuthorizeTlOtherChargesModal_DEFAULT_TL_OTHER_CHARGES_ROWS.map((row) =>
              row.key === "transferGlHead" ? { ...row, totalAmount: authorizeRow.totalAmount } : row
            ),
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default TlOtherChargesAuthorizePage;
