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
import { FieldShell, TextInput, DateInput, SectionCard, RadioDayMonth } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { DEFAULT_HO_TRANSFER_DATA, type HoTransferFormData } from "@/components/HO-Clerk/AddHoTransfer";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from HoTransferAuthorizeTable.tsx ===== */
export type HoTransferAuthorizeTable_HoTransferAuthorizeTab = "new" | "rejected";

export type HoTransferAuthorizeTable_HoTransferAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  amount: string;
  particular: string;
  createdBy: string;
  createdDate: string;
  tab: HoTransferAuthorizeTable_HoTransferAuthorizeTab;
};

const HoTransferAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "150px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "200px" },
  { key: "amount", label: "Amount", sortable: true, width: "140px" },
  { key: "particular", label: "Particular", sortable: true, width: "160px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "150px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "150px" },
] as const;

const HoTransferAuthorizeTable_SAMPLE_ROWS: Omit<HoTransferAuthorizeTable_HoTransferAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "418", accountCode: "000545", accountName: "Devaraddi Mallanagoud", amount: "45,000", particular: "Fund Transfer", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { scrollNo: "419", accountCode: "000546", accountName: "Akshay Om More", amount: "22,500", particular: "GL Transfer", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { scrollNo: "420", accountCode: "000547", accountName: "Priya Sharma", amount: "18,200", particular: "Fund Transfer", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "421", accountCode: "000548", accountName: "Rohan Kulkarni", amount: "34,750", particular: "GL Transfer", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "422", accountCode: "000549", accountName: "Sneha Patil", amount: "50,000", particular: "Fund Transfer", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { scrollNo: "423", accountCode: "000550", accountName: "Vikram Nagar", amount: "9,400", particular: "Fund Transfer", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { scrollNo: "424", accountCode: "000551", accountName: "Anita Desai", amount: "29,000", particular: "GL Transfer", createdBy: "HoClerk1", createdDate: "15-Jun-2026" },
  { scrollNo: "425", accountCode: "000552", accountName: "Manoj Rathod", amount: "6,750", particular: "Fund Transfer", createdBy: "HoAdmin", createdDate: "15-Jun-2026" },
  { scrollNo: "426", accountCode: "000553", accountName: "Kavita Joshi", amount: "32,300", particular: "Fund Transfer", createdBy: "HoClerk1", createdDate: "16-Jun-2026" },
  { scrollNo: "427", accountCode: "000554", accountName: "Suresh Naik", amount: "4,100", particular: "GL Transfer", createdBy: "HoAdmin", createdDate: "16-Jun-2026" },
  { scrollNo: "428", accountCode: "000555", accountName: "Deepika Shetty", amount: "11,900", particular: "Fund Transfer", createdBy: "HoClerk1", createdDate: "17-Jun-2026" },
  { scrollNo: "429", accountCode: "000556", accountName: "Ganesh Pillai", amount: "17,300", particular: "GL Transfer", createdBy: "HoAdmin", createdDate: "17-Jun-2026" },
];

const HoTransferAuthorizeTable_buildRows = (tab: HoTransferAuthorizeTable_HoTransferAuthorizeTab, count: number): HoTransferAuthorizeTable_HoTransferAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...HoTransferAuthorizeTable_SAMPLE_ROWS[i % HoTransferAuthorizeTable_SAMPLE_ROWS.length],
    scrollNo: String(418 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const HoTransferAuthorizeTable_HO_TRANSFER_TAB_COUNTS: Record<HoTransferAuthorizeTable_HoTransferAuthorizeTab, number> = {
  new: 15,
  rejected: 10,
};

const HoTransferAuthorizeTable_ALL_ROWS: HoTransferAuthorizeTable_HoTransferAuthorizeRow[] = [
  ...HoTransferAuthorizeTable_buildRows("new", HoTransferAuthorizeTable_HO_TRANSFER_TAB_COUNTS.new),
  ...HoTransferAuthorizeTable_buildRows("rejected", HoTransferAuthorizeTable_HO_TRANSFER_TAB_COUNTS.rejected),
];

const HoTransferAuthorizeTable_PAGE_SIZE = 15;

type HoTransferAuthorizeTable_SortKey = Exclude<(typeof HoTransferAuthorizeTable_columns)[number]["key"], "action">;

type HoTransferAuthorizeTable_HoTransferAuthorizeTableProps = {
  activeTab: HoTransferAuthorizeTable_HoTransferAuthorizeTab;
  filters?: HoTransferFilterModal_HoTransferFilters;
  onAuthorize?: (row: HoTransferAuthorizeTable_HoTransferAuthorizeRow) => void;
};

const HoTransferAuthorizeTable = ({ activeTab, filters, onAuthorize }: HoTransferAuthorizeTable_HoTransferAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<HoTransferAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: HoTransferAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = HoTransferAuthorizeTable_ALL_ROWS.filter((r) => {
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / HoTransferAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * HoTransferAuthorizeTable_PAGE_SIZE, currentPage * HoTransferAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1200px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {HoTransferAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as HoTransferAuthorizeTable_SortKey)}
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
                <td colSpan={HoTransferAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.scrollNo}
                  </td>
                  <td className="truncate px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100" style={{ width: "180px" }}>
                    {row.accountCode}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "200px" }}>
                    {row.accountName}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "140px" }}>
                    {row.amount}
                  </td>
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "160px" }}>
                    {row.particular}
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


/* ===== from HoTransferFilterModal.tsx ===== */
const HoTransferFilterModal_filterOptions = [
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

type HoTransferFilterModal_FilterKey = (typeof HoTransferFilterModal_filterOptions)[number]["id"];

export type HoTransferFilterModal_HoTransferFilters = Record<HoTransferFilterModal_FilterKey, string>;

type HoTransferFilterModal_HoTransferFilterModalProps = {
  onClose: () => void;
  onApply: (filters: HoTransferFilterModal_HoTransferFilters) => void;
  initialValues?: HoTransferFilterModal_HoTransferFilters;
};

export const HoTransferFilterModal_defaultHoTransferFilters: HoTransferFilterModal_HoTransferFilters = {
  accountName: "",
  accountCode: "",
  scrollNo: "",
};

function HoTransferFilterModal({
  onClose,
  onApply,
  initialValues = HoTransferFilterModal_defaultHoTransferFilters,
}: HoTransferFilterModal_HoTransferFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<HoTransferFilterModal_FilterKey>("accountName");
  const [values, setValues] = useState<HoTransferFilterModal_HoTransferFilters>(initialValues);

  const active = HoTransferFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(HoTransferFilterModal_defaultHoTransferFilters);
    onApply(HoTransferFilterModal_defaultHoTransferFilters);
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
          {HoTransferFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeHoTransferModal.tsx ===== */
export interface AuthorizeHoTransferModal_AuthorizeHoTransferModalProps {
  open: boolean;
  initialData?: Partial<HoTransferFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeHoTransferModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeHoTransferModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeHoTransferModal_AuthorizeHoTransferFooter = ({
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

const AuthorizeHoTransferModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeHoTransferModal_AuthorizeHoTransferModalProps) => {
  const [data] = useState<HoTransferFormData>(() => ({
    ...DEFAULT_HO_TRANSFER_DATA,
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
        titleEn="Authorize HO Transfer Entry"
        titleHi="HO हस्तांतरण नोंद अधिकृत करा"
        subtitleEn="Check information related to the HO transfer entry and authorize it."
        subtitleHi="HO हस्तांतरण नोंदीशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize HO Transfer Entry" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeHoTransferModal_AuthorizeHoTransferFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the HO transfer being authorized."
          subtitleHi="अधिकृत करावयाच्या हस्तांतरणाची खाते माहिती."
          icon={<AuthorizeHoTransferModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
                </div>
                <AuthorizeHoTransferModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Sub Scroll No" labelHi="उप स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.subScrollNo} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioDayMonth
              label="Debit / Credit"
              labelHi="डेबिट / क्रेडिट"
              value={data.debitCreditMode === "Debit"}
              onChange={() => {}}
              options={["Debit", "Credit"]}
              disabled
            />

            <FieldShell label="Debit Amount" labelHi="डेबिट रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.debitAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Credit Amount" labelHi="क्रेडिट रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.creditAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeHoTransferModal_DisabledLookupTrigger />
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

            <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.customerName} onChange={() => {}} readOnly />
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

            <FieldShell label="Uncleared Balance" labelHi="अस्पष्ट शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.unclearBalance} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Transaction Details"
          titleHi="व्यवहाराचा तपशील"
          subtitleEn="Outlist, advice and instrument details for the transfer."
          subtitleHi="हस्तांतरणाचा आऊटलिस्ट, सल्ला व साधन तपशील."
          icon={<AuthorizeHoTransferModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Outlist Serial" labelHi="आऊटलिस्ट अनुक्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.outlistSerial} onChange={() => {}} readOnly />
                </div>
                <AuthorizeHoTransferModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="GL Outlist Description" labelHi="जीएल आऊटलिस्ट वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutlistDesc} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Outlist Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutListDocNo} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioDayMonth
              label="Original / Responding"
              labelHi="मूळ / प्रतिसाद"
              value={data.originalResponding === "Original"}
              onChange={() => {}}
              options={["Original", "Responding"]}
              disabled
            />

            <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.adviceNumber} onChange={() => {}} readOnly />
                </div>
                <AuthorizeHoTransferModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Advice Date" labelHi="सल्ला तारीख" required>
              <DateInput value={data.adviceDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Amount" labelHi="रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.amount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Instrument Type" labelHi="साधन प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.instrumentType} onChange={() => {}} readOnly />
                </div>
                <AuthorizeHoTransferModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Instrument Number" labelHi="साधन क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.instrumentNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Instrument Date" labelHi="साधन तारीख" required>
              <DateInput value={data.instrumentDate} onChange={() => {}} readOnly />
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
            title="HO Transfer Entry Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="HO Transfer Entry Authorization Rejected"
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


/* ===== from HoTransferAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: HoTransferAuthorizeTable_HO_TRANSFER_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: HoTransferAuthorizeTable_HO_TRANSFER_TAB_COUNTS.rejected },
];

const HoTransferAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<HoTransferFilterModal_HoTransferFilters>(HoTransferFilterModal_defaultHoTransferFilters);
  const [authorizeRow, setAuthorizeRow] = useState<HoTransferAuthorizeTable_HoTransferAuthorizeRow | null>(null);

  const handleAuthorize = (row: HoTransferAuthorizeTable_HoTransferAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(HoTransferFilterModal_defaultHoTransferFilters);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="HO Transfer Entry Authorize"
        titleHi="HO हस्तांतरण नोंद अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "HO Transfer Entry Authorize", href: "#" },
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

        <HoTransferAuthorizeTable
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
            <HoTransferFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeHoTransferModal
          open
          initialData={{
            scrollNumber: authorizeRow.scrollNo,
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
            amount: authorizeRow.amount,
            particular: authorizeRow.particular,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default HoTransferAuthorizePage;
