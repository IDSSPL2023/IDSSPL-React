import { useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { ShieldCheck } from "lucide-react";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import { useBilingual } from "@/i18n/useBilingual";
import FilterModal, { type AccountFilters } from "@/components/shared/FilterModal";
import AccountMasterTable, { type ColumnConfig, type RowData } from "@/components/AccountMaster/AccountMasterTable";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import AuthorizePigmyOpenModal from "@/components/Authorization/Account/AuthorizePigmyOpenModal";

const authorizeColumns: ColumnConfig[] = [
  { key: "srNo", labelKey: "accountMaster.table.srNo", sortable: false, width: "80px" },
  { key: "action", labelKey: "accountMaster.table.action", sortable: false, width: "80px" },
  { key: "accountId", labelKey: "accountMaster.table.accountId", sortable: true, width: "160px", emphasize: true },
  { key: "status", labelKey: "accountMaster.table.status", sortable: true, width: "190px" },
  { key: "customerId", labelKey: "accountMaster.table.customerId", sortable: true, width: "140px" },
  { key: "accountName", labelKey: "fields.accountName", sortable: true, width: "200px" },
  { key: "accountType", labelKey: "fields.accountType", sortable: true, width: "180px" },
  { key: "createdBy", labelKey: "accountMaster.table.createdBy", sortable: true, width: "140px" },
  { key: "applicationNo", labelKey: "accountMaster.table.applicationNo", sortable: false, width: "160px" },
];

type AuthorizeRow = RowData & { queue: AuthorizationTabKey };

const QUEUE_STATUS_LABEL: Record<AuthorizationTabKey, string> = {
  new: "Authorization Pending",
  modify: "Modification Pending",
  rejected: "Authorization Rejected",
};

const AUTHORIZE_ROWS: AuthorizeRow[] = [
  { srNo: 1, accountId: "PIG0012", status: "Live", customerId: "00012", accountName: "Akshay Om More", accountType: "Pigmy Deposit", createdBy: "Admin", applicationNo: "0", queue: "new" },
  { srNo: 2, accountId: "PIG0013", status: "Live", customerId: "00021", accountName: "Nitish Sai Readdy", accountType: "Pigmy Deposit", createdBy: "Admin", applicationNo: "0", queue: "new" },
  { srNo: 3, accountId: "PIG0014", status: "Live", customerId: "00032", accountName: "Sneha Patil", accountType: "Pigmy Deposit", createdBy: "Admin", applicationNo: "0", queue: "modify" },
  { srNo: 4, accountId: "PIG0015", status: "Live", customerId: "00038", accountName: "Deepak Verma", accountType: "Pigmy Deposit", createdBy: "Admin", applicationNo: "0", queue: "rejected" },
];

const AuthorizePigmyOpenPage = () => {
  const { t, en, tRaw } = useBilingual();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<AccountFilters>({ accountName: "", accountNumber: "", accountType: "" });
  const [openAuthorize, setOpenAuthorize] = useState(false);

  const visibleRows = useMemo(() => {
    return AUTHORIZE_ROWS.filter((row) => row.queue === activeTab).map((row, idx) => ({
      ...row,
      srNo: idx + 1,
      status: QUEUE_STATUS_LABEL[row.queue],
    }));
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <GlobalNav
        titleEn={en("accountAuthorizeMaster.cards.pigmyAuthorization")}
        titleHi={t("accountAuthorizeMaster.cards.pigmyAuthorization")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("accountAuthorizeMaster.navTitle"), onClick: () => router.push("/authorization/authorizeaccountmain") },
          { label: en("accountAuthorizeMaster.cards.pigmyAuthorization"), href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-3 px-3 py-3">
        <AuthorizationTabs active={activeTab} onChange={setActiveTab} onOpenFilter={() => setIsFilterOpen(true)} />

        <AccountMasterTable
          filters={filters}
          rows={visibleRows}
          columns={authorizeColumns}
          renderMenuItems={() => [
            { key: "authorize", label: tRaw("common.authorize"), icon: ShieldCheck, onClick: () => setOpenAuthorize(true) },
          ]}
        />
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setIsFilterOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal initialValues={filters} onClose={() => setIsFilterOpen(false)} onApply={(vals) => setFilters(vals)} />
          </div>
        </div>
      )}

      {openAuthorize && visibleRows.length > 0 && (
        <AuthorizePigmyOpenModal open onClose={() => setOpenAuthorize(false)} />
      )}
    </div>
  );
};

export default AuthorizePigmyOpenPage;
