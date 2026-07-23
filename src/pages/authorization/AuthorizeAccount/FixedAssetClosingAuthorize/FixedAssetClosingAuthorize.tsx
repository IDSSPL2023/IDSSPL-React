import { useEffect, useMemo, useState } from "react";
import { Building2, Calendar, IdCard, IndianRupee, ShieldCheck, ThumbsDown, ThumbsUp, User, Wallet, X } from "lucide-react";
import { IMAGES } from "@/assets";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import { useBilingual } from "@/i18n/useBilingual";
import FilterModal, { type AccountFilters } from "@/components/shared/FilterModal";
import AccountMasterTable, { type ColumnConfig, type RowData } from "@/components/AccountMaster/AccountMasterTable";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import PaginationModal from "@/components/common/PaginationModal";

/* ===================== Authorize modal ===================== */

interface FixedAssetClosingAuthorizeData {
  assetCode: string;
  assetName: string;
  department: string;
  purchaseDate: string;
  closingDate: string;
  bookValue: string;
  disposalValue: string;
  disposalMode: string;
  requestedBy: string;
}

const FIXED_ASSET_CLOSING_CONFIG = {
  icon: IMAGES.SHIELD_CHECK,
  titleEn: "Authorize Fixed Asset Closing Details",
  titleHi: "स्थिर मालमत्ता बंद तपशील अधिकृत करा",
  descEn: "Check information related to the fixed asset closing and Authorize them.",
  descHi: "स्थिर मालमत्ता बंद करण्याशी संबंधित माहिती तपासा आणि अधिकृत करा",
};

const FIXED_ASSET_CLOSING_DEFAULT_DATA: FixedAssetClosingAuthorizeData = {
  assetCode: "FA0021",
  assetName: "Branch Generator",
  department: "Administration",
  purchaseDate: "12-Jun-2019",
  closingDate: "22-Jul-2026",
  bookValue: "45,000",
  disposalValue: "12,000",
  disposalMode: "Sale",
  requestedBy: "Admin",
};

interface FixedAssetClosingAuthorizeModalProps {
  open: boolean;
  initialData?: Partial<FixedAssetClosingAuthorizeData>;
  onClose?: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

function FixedAssetClosingAuthorizeModal({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: FixedAssetClosingAuthorizeModalProps) {
  const [data, setData] = useState<FixedAssetClosingAuthorizeData>({
    ...FIXED_ASSET_CLOSING_DEFAULT_DATA,
    ...initialData,
  });
  const [actionModel, setActionModel] = useState<"authorize" | "rejected" | null>(null);
  const [showRejectReason, setShowRejectReason] = useState(false);

  useEffect(() => {
    if (open) setData({ ...FIXED_ASSET_CLOSING_DEFAULT_DATA, ...initialData });
  }, [open, initialData]);

  if (!open) return null;

  const handleAuthorize = () => {
    setActionModel("authorize");
    onAuthorize?.();
  };

  const handleReject = () => setShowRejectReason(true);

  const handleConfirmReject = (reason: string) => {
    setShowRejectReason(false);
    setActionModel("rejected");
    onReject?.(reason);
  };

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const CustomFooterButton = () => (
    <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
      <button
        type="button"
        onClick={handleReject}
        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
      >
        Reject
        <ThumbsDown className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-5 py-2 text-sm font-medium text-primary transition hover:bg-slate-50"
      >
        Cancel
        <X className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={handleAuthorize}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
      >
        Authorize
        <ThumbsUp className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <>
      <FormModal
        onClose={() => onClose?.()}
        titleEn={FIXED_ASSET_CLOSING_CONFIG.titleEn}
        titleHi={FIXED_ASSET_CLOSING_CONFIG.titleHi}
        subtitleEn={FIXED_ASSET_CLOSING_CONFIG.descEn}
        subtitleHi={FIXED_ASSET_CLOSING_CONFIG.descHi}
        tabs={["Details"]}
        activeTab="Details"
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={<CustomFooterButton />}
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={FIXED_ASSET_CLOSING_CONFIG.icon} alt={FIXED_ASSET_CLOSING_CONFIG.titleEn} width={50} height={50} />
          </div>
        }
      >
        <SectionCard titleEn="Asset Details" titleHi="मालमत्ता तपशील" subtitleEn="Fixed asset being closed" subtitleHi="बंद होणारी स्थिर मालमत्ता" icon={IMAGES.USER}>
          <div className={grid4}>
            <FieldShell label="Asset Code" labelHi="मालमत्ता कोड" required>
              <TextInput icon={<IdCard size={16} />} value={data.assetCode} onChange={() => {}} readOnly />
            </FieldShell>
            <FieldShell label="Asset Name" labelHi="मालमत्तेचे नाव" required>
              <TextInput icon={<Building2 size={16} />} value={data.assetName} onChange={() => {}} readOnly />
            </FieldShell>
            <FieldShell label="Department" labelHi="विभाग" required>
              <TextInput icon={<User size={16} />} value={data.department} onChange={() => {}} readOnly />
            </FieldShell>
            <FieldShell label="Requested By" labelHi="विनंती केली" required>
              <TextInput icon={<User size={16} />} value={data.requestedBy} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard titleEn="Closing Summary" titleHi="बंद करण्याचा सारांश" subtitleEn="Dates and disposal values" subtitleHi="तारखा आणि विल्हेवाट मूल्ये" icon={IMAGES.USER}>
          <div className={grid4}>
            <FieldShell label="Purchase Date" labelHi="खरेदी तारीख" required>
              <TextInput icon={<Calendar size={16} />} value={data.purchaseDate} onChange={() => {}} readOnly />
            </FieldShell>
            <FieldShell label="Closing Date" labelHi="बंद करण्याची तारीख" required>
              <TextInput icon={<Calendar size={16} />} value={data.closingDate} onChange={() => {}} readOnly />
            </FieldShell>
            <FieldShell label="Book Value" labelHi="पुस्तक मूल्य" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.bookValue} onChange={() => {}} readOnly />
            </FieldShell>
            <FieldShell label="Disposal Value" labelHi="विल्हेवाट मूल्य" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.disposalValue} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FieldShell label="Disposal Mode" labelHi="विल्हेवाट पद्धत" required>
              <TextInput icon={<Wallet size={16} />} value={data.disposalMode} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        {showRejectReason && (
          <RejectReasonModal onClose={() => setShowRejectReason(false)} onConfirm={handleConfirmReject} />
        )}

        {actionModel === "authorize" && (
          <SuccessModal
            title="Authorized Successfully"
            subtitle="The fixed asset closing has been authorized successfully."
            onClose={() => { setActionModel(null); onClose?.(); }}
            onDone={() => { setActionModel(null); onClose?.(); }}
            variant="success"
          />
        )}

        {actionModel === "rejected" && (
          <SuccessModal
            title="Fixed Asset Closing Authorization is Rejected"
            subtitle="The fixed asset closing authorization request has been rejected."
            onClose={() => { setActionModel(null); onClose?.(); }}
            onDone={() => { setActionModel(null); onClose?.(); }}
            variant="critical"
          />
        )}
      </FormModal>
    </>
  );
}

/* ===================== Listing page ===================== */

const CLOSING_COLUMNS: ColumnConfig[] = [
  { key: "srNo", labelKey: "accountMaster.table.srNo", sortable: false, width: "80px" },
  { key: "action", labelKey: "accountMaster.table.action", sortable: false, width: "80px" },
  { key: "accountId", labelKey: "accountMaster.table.accountId", sortable: true, width: "160px", emphasize: true },
  { key: "status", labelKey: "accountMaster.table.status", sortable: true, width: "190px" },
  { key: "customerId", labelKey: "accountMaster.table.customerId", sortable: true, width: "140px" },
  { key: "accountName", labelKey: "fields.accountName", sortable: true, width: "200px" },
  { key: "accountType", labelKey: "fields.accountType", sortable: true, width: "160px" },
  { key: "closingDate", labelKey: "accountMaster.table.closingDate", sortable: true, width: "150px" },
  { key: "createdBy", labelKey: "accountMaster.table.requestedBy", sortable: true, width: "140px" },
];

const PAGE_SIZE = 10;

type ClosingRow = RowData & { queue: AuthorizationTabKey; closingDate: string };

const QUEUE_STATUS_LABEL: Record<AuthorizationTabKey, string> = {
  new: "Closing Authorization Pending",
  modify: "Modification Pending",
  rejected: "Authorization Rejected",
};

const CLOSING_ROWS: ClosingRow[] = [
  { srNo: 1, accountId: "FA0021", status: "Live", customerId: "00021", accountName: "Branch Generator", accountType: "Fixed Asset", createdBy: "Admin", applicationNo: "0", closingDate: "22-Jul-2026", queue: "new" },
  { srNo: 2, accountId: "FA0034", status: "Live", customerId: "00034", accountName: "Office AC Unit", accountType: "Fixed Asset", createdBy: "Admin", applicationNo: "0", closingDate: "18-Jul-2026", queue: "new" },
  { srNo: 3, accountId: "FA0040", status: "Live", customerId: "00040", accountName: "Delivery Van", accountType: "Fixed Asset", createdBy: "Admin", applicationNo: "0", closingDate: "15-Jul-2026", queue: "modify" },
  { srNo: 4, accountId: "FA0045", status: "Live", customerId: "00045", accountName: "Server Rack", accountType: "Fixed Asset", createdBy: "Admin", applicationNo: "0", closingDate: "10-Jul-2026", queue: "rejected" },
];

const FixedAssetClosingAuthorizePage = () => {
  const { t, en, tRaw } = useBilingual();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<AccountFilters>({ accountName: "", accountNumber: "", accountType: "" });
  const [openAuthorize, setOpenAuthorize] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, filters]);

  const hasActiveFilters = Boolean(filters.accountName || filters.accountNumber || filters.accountType);
  const activeFilterSummary = [filters.accountName, filters.accountNumber, filters.accountType]
    .filter(Boolean)
    .join(", ");

  const queueRows = useMemo(() => {
    return CLOSING_ROWS.filter((row) => row.queue === activeTab).map((row, idx) => ({
      ...row,
      srNo: idx + 1,
      status: QUEUE_STATUS_LABEL[row.queue],
    }));
  }, [activeTab]);

  const totalPages = Math.max(1, Math.ceil(queueRows.length / PAGE_SIZE));
  const visibleRows = queueRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen app-page-bg">
      <GlobalNav
        titleEn={en("accountAuthorizeMaster.cards.fixedAssetClosing")}
        titleHi={t("accountAuthorizeMaster.cards.fixedAssetClosing")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "#" },
          { label: en("accountAuthorizeMaster.navTitle"), onClick: () => router.push("/authorization/authorizeaccountmain") },
          { label: en("accountAuthorizeMaster.cards.fixedAssetClosing"), href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-3 px-3 py-3">
        <AuthorizationTabs
          active={activeTab}
          onChange={setActiveTab}
          isSearchVisible={isSearchVisible}
          onToggleSearch={() => setIsSearchVisible((prev) => !prev)}
          onOpenFilter={() => setIsFilterOpen(true)}
          hasActiveFilters={hasActiveFilters}
          activeFilterSummary={activeFilterSummary}
          onResetFilters={() => setFilters({ accountName: "", accountNumber: "", accountType: "" })}
        />

        {isLoading ? (
          <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <>
            <AccountMasterTable
              filters={filters}
              rows={visibleRows}
              columns={CLOSING_COLUMNS}
              renderMenuItems={() => [
                { key: "authorize", label: tRaw("common.authorize"), icon: ShieldCheck, onClick: () => setOpenAuthorize(true) },
              ]}
            />

            {queueRows.length > 0 && (
              <PaginationModal page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setIsFilterOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal initialValues={filters} onClose={() => setIsFilterOpen(false)} onApply={(vals) => setFilters(vals)} />
          </div>
        </div>
      )}

      {openAuthorize && visibleRows.length > 0 && (
        <FixedAssetClosingAuthorizeModal open onClose={() => setOpenAuthorize(false)} />
      )}
    </div>
  );
};

export default FixedAssetClosingAuthorizePage;
