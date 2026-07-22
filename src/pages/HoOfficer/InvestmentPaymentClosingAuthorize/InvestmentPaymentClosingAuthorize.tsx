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
import { FieldShell, TextInput, DateInput, SectionCard, RadioYesNo } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { DEFAULT_INVESTMENT_ACCOUNT_CLOSE_DATA, type InvestmentAccountCloseFormData } from "@/components/Authorization/Account/AddInvestmentAccountClose";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from InvestmentPaymentClosingAuthorizeTable.tsx ===== */
export type InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeTab = "new" | "rejected";

export type InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  maturityValue: string;
  createdBy: string;
  createdDate: string;
  tab: InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeTab;
};

const InvestmentPaymentClosingAuthorizeTable_columns = [
  { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
  { key: "action", label: "Actions", sortable: false, width: "90px" },
  { key: "scrollNo", label: "Scroll No", sortable: true, width: "150px" },
  { key: "accountCode", label: "Account Code", sortable: true, width: "180px" },
  { key: "accountName", label: "Account Name", sortable: true, width: "200px" },
  { key: "maturityValue", label: "Maturity Value", sortable: true, width: "150px" },
  { key: "createdBy", label: "Created By", sortable: true, width: "150px" },
  { key: "createdDate", label: "Created Date", sortable: true, width: "150px" },
] as const;

const InvestmentPaymentClosingAuthorizeTable_SAMPLE_ROWS: Omit<InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeRow, "srNo" | "tab">[] = [
  { scrollNo: "518", accountCode: "000645", accountName: "Sample Customer", maturityValue: "2,50,000", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { scrollNo: "519", accountCode: "000646", accountName: "Test Customer", maturityValue: "1,75,000", createdBy: "HoAdmin", createdDate: "12-Jun-2026" },
  { scrollNo: "520", accountCode: "000647", accountName: "Demo Customer", maturityValue: "3,20,000", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "521", accountCode: "000648", accountName: "Rohan Kulkarni", maturityValue: "95,000", createdBy: "HoClerk1", createdDate: "13-Jun-2026" },
  { scrollNo: "522", accountCode: "000649", accountName: "Sneha Patil", maturityValue: "4,10,000", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { scrollNo: "523", accountCode: "000650", accountName: "Vikram Nagar", maturityValue: "1,20,000", createdBy: "HoAdmin", createdDate: "14-Jun-2026" },
  { scrollNo: "524", accountCode: "000651", accountName: "Anita Desai", maturityValue: "2,05,000", createdBy: "HoClerk1", createdDate: "15-Jun-2026" },
  { scrollNo: "525", accountCode: "000652", accountName: "Manoj Rathod", maturityValue: "88,000", createdBy: "HoAdmin", createdDate: "15-Jun-2026" },
  { scrollNo: "526", accountCode: "000653", accountName: "Kavita Joshi", maturityValue: "3,60,000", createdBy: "HoClerk1", createdDate: "16-Jun-2026" },
  { scrollNo: "527", accountCode: "000654", accountName: "Suresh Naik", maturityValue: "1,45,000", createdBy: "HoAdmin", createdDate: "16-Jun-2026" },
];

const InvestmentPaymentClosingAuthorizeTable_buildRows = (tab: InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeTab, count: number): InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...InvestmentPaymentClosingAuthorizeTable_SAMPLE_ROWS[i % InvestmentPaymentClosingAuthorizeTable_SAMPLE_ROWS.length],
    scrollNo: String(518 + i + (tab === "rejected" ? 100 : 0)),
    srNo: i + 1,
    tab,
  }));

export const InvestmentPaymentClosingAuthorizeTable_INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS: Record<InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeTab, number> = {
  new: 12,
  rejected: 8,
};

const InvestmentPaymentClosingAuthorizeTable_ALL_ROWS: InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeRow[] = [
  ...InvestmentPaymentClosingAuthorizeTable_buildRows("new", InvestmentPaymentClosingAuthorizeTable_INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS.new),
  ...InvestmentPaymentClosingAuthorizeTable_buildRows("rejected", InvestmentPaymentClosingAuthorizeTable_INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS.rejected),
];

const InvestmentPaymentClosingAuthorizeTable_PAGE_SIZE = 15;

type InvestmentPaymentClosingAuthorizeTable_SortKey = Exclude<(typeof InvestmentPaymentClosingAuthorizeTable_columns)[number]["key"], "action">;

type InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeTableProps = {
  activeTab: InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeTab;
  filters?: InvestmentPaymentClosingFilterModal_InvestmentPaymentClosingFilters;
  onAuthorize?: (row: InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeRow) => void;
};

const InvestmentPaymentClosingAuthorizeTable = ({
  activeTab,
  filters,
  onAuthorize,
}: InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeTableProps) => {
  const [sortKey, setSortKey] = useState<InvestmentPaymentClosingAuthorizeTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = (key: InvestmentPaymentClosingAuthorizeTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filteredRows = InvestmentPaymentClosingAuthorizeTable_ALL_ROWS.filter((r) => {
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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / InvestmentPaymentClosingAuthorizeTable_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * InvestmentPaymentClosingAuthorizeTable_PAGE_SIZE, currentPage * InvestmentPaymentClosingAuthorizeTable_PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1150px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary">
              {InvestmentPaymentClosingAuthorizeTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as InvestmentPaymentClosingAuthorizeTable_SortKey)}
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
                <td colSpan={InvestmentPaymentClosingAuthorizeTable_columns.length} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
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
                  <td className="truncate px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400" style={{ width: "150px" }}>
                    {row.maturityValue}
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


/* ===== from InvestmentPaymentClosingFilterModal.tsx ===== */
const InvestmentPaymentClosingFilterModal_filterOptions = [
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

type InvestmentPaymentClosingFilterModal_FilterKey = (typeof InvestmentPaymentClosingFilterModal_filterOptions)[number]["id"];

export type InvestmentPaymentClosingFilterModal_InvestmentPaymentClosingFilters = Record<InvestmentPaymentClosingFilterModal_FilterKey, string>;

type InvestmentPaymentClosingFilterModal_InvestmentPaymentClosingFilterModalProps = {
  onClose: () => void;
  onApply: (filters: InvestmentPaymentClosingFilterModal_InvestmentPaymentClosingFilters) => void;
  initialValues?: InvestmentPaymentClosingFilterModal_InvestmentPaymentClosingFilters;
};

export const InvestmentPaymentClosingFilterModal_defaultInvestmentPaymentClosingFilters: InvestmentPaymentClosingFilterModal_InvestmentPaymentClosingFilters = {
  accountName: "",
  accountCode: "",
  scrollNo: "",
};

function InvestmentPaymentClosingFilterModal({
  onClose,
  onApply,
  initialValues = InvestmentPaymentClosingFilterModal_defaultInvestmentPaymentClosingFilters,
}: InvestmentPaymentClosingFilterModal_InvestmentPaymentClosingFilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<InvestmentPaymentClosingFilterModal_FilterKey>("accountName");
  const [values, setValues] = useState<InvestmentPaymentClosingFilterModal_InvestmentPaymentClosingFilters>(initialValues);

  const active = InvestmentPaymentClosingFilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(InvestmentPaymentClosingFilterModal_defaultInvestmentPaymentClosingFilters);
    onApply(InvestmentPaymentClosingFilterModal_defaultInvestmentPaymentClosingFilters);
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
          {InvestmentPaymentClosingFilterModal_filterOptions.map((option) => {
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


/* ===== from AuthorizeInvestmentPaymentClosingModal.tsx ===== */
export interface AuthorizeInvestmentPaymentClosingModal_AuthorizeInvestmentPaymentClosingModalProps {
  open: boolean;
  initialData?: Partial<InvestmentAccountCloseFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const AuthorizeInvestmentPaymentClosingModal_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const AuthorizeInvestmentPaymentClosingModal_DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeInvestmentPaymentClosingModal_AuthorizeInvestmentPaymentClosingFooter = ({
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

const AuthorizeInvestmentPaymentClosingModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeInvestmentPaymentClosingModal_AuthorizeInvestmentPaymentClosingModalProps) => {
  const [data] = useState<InvestmentAccountCloseFormData>(() => ({
    ...DEFAULT_INVESTMENT_ACCOUNT_CLOSE_DATA,
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
        titleEn="Authorize Investment Payment ClosingMark"
        titleHi="गुंतवणूक पेमेंट क्लोजिंगमार्क अधिकृत करा"
        subtitleEn="Check information related to the investment payment closing mark and authorize it."
        subtitleHi="गुंतवणूक पेमेंट क्लोजिंगमार्कशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize Investment Payment ClosingMark" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeInvestmentPaymentClosingModal_AuthorizeInvestmentPaymentClosingFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account and deposit information for the investment account being closed."
          subtitleHi="बंद होणाऱ्या गुंतवणूक खात्याची खाते व ठेव माहिती."
          icon={<AuthorizeInvestmentPaymentClosingModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeInvestmentPaymentClosingModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<CreditCard size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Open Date" labelHi="खाते सुरू तारीख" required>
              <DateInput value={data.accountOpenDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Period" labelHi="कालावधी" required>
              <TextInput icon={<Hash size={16} />} value={data.period} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Unit of Period" labelHi="कालावधी एकक" required>
              <TextInput icon={<FileText size={16} />} value={data.unitOfPeriod} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioYesNo
              label="Is Account Close"
              labelHi="खाते बंद आहे का"
              value={data.isAccountClose}
              onChange={() => {}}
              disabled
            />

            <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.ledgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.availableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.depositAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Maturity Value" labelHi="परिपक्वता मूल्य" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.maturityValue} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Interest Details"
          titleHi="व्याज तपशील"
          subtitleEn="Interest rate, computation and payment history."
          subtitleHi="व्याज दर, गणना व भुगतान इतिहास."
          icon={<AuthorizeInvestmentPaymentClosingModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Interest Rate" labelHi="व्याज दर" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestRate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Payable" labelHi="देय व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestPayable} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Calculated" labelHi="गणलेले व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestCalculated} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Total Interest Paid" labelHi="एकूण दिलेले व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.totalInterestPaid} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Last Interest Date" labelHi="शेवटची व्याज तारीख" required>
              <DateInput value={data.lastInterestDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Upto Date" labelHi="व्याज तारखेपर्यंत" required>
              <DateInput value={data.interestUptoDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Pending Cash Interest" labelHi="प्रलंबित रोख व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.pendingCashInterest} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Completed Months" labelHi="पूर्ण महिने" required>
              <TextInput icon={<Hash size={16} />} value={data.completedMonths} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Completed Days" labelHi="पूर्ण दिवस" required>
              <TextInput icon={<Hash size={16} />} value={data.completedDays} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payment Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Payment mode, outlist, advice and cheque details."
          subtitleHi="भुगतान पद्धत, आऊटलिस्ट, सल्ला व धनादेश तपशील."
          icon={<AuthorizeInvestmentPaymentClosingModal_SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Payment Mode" labelHi="भुगतान पद्धत" required>
              <TextInput icon={<FileText size={16} />} value={data.paymentMode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Principal Account Code" labelHi="मुद्दल खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.principalAccountCode} onChange={() => {}} readOnly />
                </div>
                <AuthorizeInvestmentPaymentClosingModal_DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Principal Description" labelHi="मुद्दल वर्णन" required>
              <TextInput icon={<User size={16} />} value={data.principalDescription} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Credit Account" labelHi="व्याज क्रेडिट खाते" required>
              <TextInput icon={<CreditCard size={16} />} value={data.interestCreditAccount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Description" labelHi="व्याज वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.interestDescription} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Outlist No" labelHi="जीएल आऊटलिस्ट क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.glOutlistNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Outlist Description" labelHi="जीएल आऊटलिस्ट वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutlistDescription} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Outlist Doc No" labelHi="आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.outlistDocNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.adviceNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Advice Date" labelHi="सल्ला तारीख" required>
              <DateInput value={data.adviceDate} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioYesNo
              label="Transfer By Cheque"
              labelHi="धनादेशाद्वारे हस्तांतरण"
              value={data.transferByCheque}
              onChange={() => {}}
              disabled
            />

            <FieldShell label="Cheque Type" labelHi="धनादेश प्रकार" required>
              <TextInput icon={<FileText size={16} />} value={data.chequeType} onChange={() => {}} readOnly />
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
            title="Investment Payment ClosingMark Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="Investment Payment ClosingMark Authorization Rejected"
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


/* ===== from InvestmentPaymentClosingAuthorizePage.tsx ===== */
const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: InvestmentPaymentClosingAuthorizeTable_INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: InvestmentPaymentClosingAuthorizeTable_INVESTMENT_PAYMENT_CLOSING_TAB_COUNTS.rejected },
];

const InvestmentPaymentClosingAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<InvestmentPaymentClosingFilterModal_InvestmentPaymentClosingFilters>(InvestmentPaymentClosingFilterModal_defaultInvestmentPaymentClosingFilters);
  const [authorizeRow, setAuthorizeRow] = useState<InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeRow | null>(null);

  const handleAuthorize = (row: InvestmentPaymentClosingAuthorizeTable_InvestmentPaymentClosingAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(InvestmentPaymentClosingFilterModal_defaultInvestmentPaymentClosingFilters);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Investment Payment ClosingMark Authorize"
        titleHi="गुंतवणूक पेमेंट क्लोजिंगमार्क अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "Investment Payment ClosingMark Authorize", href: "#" },
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

        <InvestmentPaymentClosingAuthorizeTable
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
            <InvestmentPaymentClosingFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeInvestmentPaymentClosingModal
          open
          initialData={{
            scrollNumber: authorizeRow.scrollNo,
            accountCode: authorizeRow.accountCode,
            accountName: authorizeRow.accountName,
            maturityValue: authorizeRow.maturityValue,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default InvestmentPaymentClosingAuthorizePage;
