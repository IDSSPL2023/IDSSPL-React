import { useState } from "react";
import AccountMasterTable, { type RowData } from "@/components/AccountMaster/AccountMasterTable";
import NavbarAM from "@/components/AccountMaster/NavbarAM";
import AddAccountMaster from "@/components/AccountMaster/AddAccountMaster";
import ViewAccountModal, { type AccountDetails } from "@/components/AccountMaster/ViewAccount";
import AccountFreezeModal, { type AccountFreezeSubmitPayload } from "@/components/AccountMaster/AccountFreezeModal";
import AccountOperativeModal, {  type AccountOperativeSubmitPayload} from "@/components/AccountMaster/AccountOperativeModal";
import { useBilingual } from "@/i18n/useBilingual";

export type AccountMasterType = "ca-sa" | "deposit" | "loan" | "investment";

type AccountMasterPageProps = {
  accountType: AccountMasterType;
};

/** Maps an account-type id ("ca-sa") to its i18n key segment ("caSa"). */
function toI18nId(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

const AccountMasterPage = ({ accountType }: AccountMasterPageProps) => {
  const { en, t } = useBilingual();
  const titleKey = `accountMaster.options.${toI18nId(accountType)}.title`;
  const titleEn = en(titleKey);
  const titleHi = t(titleKey);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<"view" | "edit" | null>(null);
  const [selectedAccountRow, setSelectedAccountRow] = useState<RowData | null>(null);
  const [freezeRow, setFreezeRow] = useState<RowData | null>(null);
  const [operativeRow, setOperativeRow] = useState<RowData | null>(null);

  const handleView = (row: RowData) => {
    setSelectedAccountRow(row);
    setViewMode("view");
  };

  const handleEdit = (row: RowData) => {
    setSelectedAccountRow(row);
    setViewMode("edit");
  };

  const toAccountDetails = (row: RowData): AccountDetails => ({
    accountCode: row.accountId,
    accountName: row.accountName,
    accountOpenDate: row.openingDate,
    customerId: row.customerId,
    customerName: row.accountName,
    createdBy: row.createdBy,
    applicationNumber: row.applicationNo,
    categoryCode: row.accountType,
    accountStatus: row.status,
  });

  const handleFreezeSubmit = (payload: AccountFreezeSubmitPayload) => {
    window.alert(`Account ${freezeRow?.accountId ?? "-"} marked as ${payload.status}.`);
    setFreezeRow(null);
  };

  const handleOperativeSubmit = (payload: AccountOperativeSubmitPayload) => {
    window.alert(
      `Account ${operativeRow?.accountId ?? "-"} status changed to ${payload.status}.\nReason: ${payload.reason}`
    );
    setOperativeRow(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] relative">
      <NavbarAM
        titleEn={titleEn}
        titleHi={titleHi}
        breadcrumbs={[
          { label: en("common.home"), href: "/dashboard" },
          { label: en("sidebar.clerk"), href: "#" },
          { label: en("application.breadcrumb"), href: "/account-master" },
          { label: titleEn, href: `/account-master/${accountType}` },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
      />

      <div className="px-3 py-2">
        <AccountMasterTable
          onView={handleView}
          onEdit={handleEdit}
          onFreeze={(row) => setFreezeRow(row)}
          onOperative={(row) => setOperativeRow(row)}
        />
      </div>

      {openAddModal && <AddAccountMaster onClose={() => setOpenAddModal(false)} />}

      {viewMode && selectedAccountRow && (
        <ViewAccountModal
          mode={viewMode}
          data={toAccountDetails(selectedAccountRow)}
          onClose={() => setViewMode(null)}
        />
      )}

      {freezeRow && (
        <AccountFreezeModal
          data={{ accountCode: freezeRow.accountId, name: freezeRow.accountName }}
          onClose={() => setFreezeRow(null)}
          onSubmit={handleFreezeSubmit}
        />
      )}

      {operativeRow && (
        <AccountOperativeModal
          data={{
            accountCode: operativeRow.accountId,
            name: operativeRow.accountName,
            currentStatus: operativeRow.status === "Inoperative" ? "Inoperative" : "Operative",
          }}
          onClose={() => setOperativeRow(null)}
          onSubmit={handleOperativeSubmit}
        />
      )}
    </div>
  );
};

export default AccountMasterPage;