import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import RtgsOutwardAuthorizeTable, {
  RTGS_OUTWARD_TAB_COUNTS,
  type RtgsOutwardAuthorizeRow,
} from "@/components/HoOfficer/Transaction/RtgsOutwardAuthorizeTable";
import RtgsOutwardFilterModal, {
  defaultRtgsOutwardFilters,
  type RtgsOutwardFilters,
} from "@/components/HoOfficer/Transaction/RtgsOutwardFilterModal";
import AuthorizeRtgsOutwardModal from "@/components/HoOfficer/Transaction/AuthorizeRtgsOutwardModal";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

const TABS = [
  { key: "new" as const, labelKey: "authorizeAccount.tabs.newAuthorization", count: RTGS_OUTWARD_TAB_COUNTS.new },
  { key: "rejected" as const, labelKey: "authorizeAccount.tabs.authorizeRejected", count: RTGS_OUTWARD_TAB_COUNTS.rejected },
];

const RtgsOutwardAuthorizePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<RtgsOutwardFilters>(defaultRtgsOutwardFilters);
  const [authorizeRow, setAuthorizeRow] = useState<RtgsOutwardAuthorizeRow | null>(null);

  const handleAuthorize = (row: RtgsOutwardAuthorizeRow) => setAuthorizeRow(row);
  const closeAuthorizeModal = () => setAuthorizeRow(null);
  const handleResetFilters = () => setFilters(defaultRtgsOutwardFilters);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="RTGS Outward File Generation Authorize"
        titleHi="RTGS आउटवर्ड फाइल जनरेशन अधिकृत करणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "HO Officer", onClick: () => router.push("/ho-officer") },
          { label: "RTGS Outward File Generation Authorize", href: "#" },
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

        <RtgsOutwardAuthorizeTable
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
            <RtgsOutwardFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {authorizeRow && (
        <AuthorizeRtgsOutwardModal
          open
          initialData={{
            accountCode: authorizeRow.accountCode,
            name: authorizeRow.name,
            caseType: authorizeRow.caseType,
            caseNumber: authorizeRow.caseNumber,
            caseFee: authorizeRow.caseFee,
          }}
          onClose={closeAuthorizeModal}
        />
      )}
    </div>
  );
};

export default RtgsOutwardAuthorizePage;
