import { useState } from "react";
import { toast } from "react-toastify";
import AccountMasterTable, { type RowData } from "@/components/AccountMaster/AccountMasterTable";
import NavbarAM from "@/components/AccountMaster/NavbarAM";
import AddAccountMaster from "@/components/AccountMaster/AddAccountMaster";
import AddInvestmentAccountMaster from "@/components/FutureModels/AddInvestmentAccountMaster";
import AddTermLoanMaster from "@/components/FutureModels/AddTermLoanMaster";
import FixedAssetPage from "@/pages/futuremodels/FixedAssetPage";
import ViewAccountModal, { type AccountDetails } from "@/components/AccountMaster/ViewAccount";
import AccountFreezeModal, { type AccountFreezeSubmitPayload } from "@/components/AccountMaster/AccountFreezeModal";
// import AccountOperativeModal from "@/components/AccountMaster/AccountOperativeModal";
import ChequeBookIssue from "@/components/AccountMaster/Cheque/cheque-issue";
import AddSI from "@/components/StandingInstruction/AddSI";
import MemoModal from "../../pages/futuremodels/MemoPage";
import LeanPage from "../../pages/futuremodels/LeanPage";
import { getMenuItemsForAccountType } from "@/components/AccountMaster/accountTypeMenuConfig";
import AccountOperativeModal, {  type AccountOperativeSubmitPayload} from "@/components/AccountMaster/AccountOperativeModal";
import AddPigmyDepositModal from "@/components/FutureModels/AddPigmyDepositModal";
import AddInsuranceDetailsModal from "@/components/AccountMaster/AddInsuranceDetailsModal";
import { useBilingual } from "@/i18n/useBilingual";

export type AccountMasterType = "ca-sa" | "deposit" | "loan" | "investment" | "fixed-asset" | "pigmy";

type AccountMasterPageProps = {
  accountType: AccountMasterType;
};

/** Maps an account-type id ("ca-sa") to its i18n key segment ("caSa"). */
function toI18nId(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

const AccountMasterPage = ({ accountType }: AccountMasterPageProps) => {
  const { en, t, tRaw } = useBilingual();
  const titleKey = `accountMaster.options.${toI18nId(accountType)}.title`;
  const titleEn = en(titleKey);
  const titleHi = t(titleKey);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<"view" | "edit" | null>(null);
  const [selectedAccountRow, setSelectedAccountRow] = useState<RowData | null>(null);
  const [freezeRow, setFreezeRow] = useState<RowData | null>(null);
  const [operativeRow, setOperativeRow] = useState<RowData | null>(null);
  const [chequeBookIssueRow, setChequeBookIssueRow] = useState<RowData | null>(null);
  const [standingInstructionRow, setStandingInstructionRow] = useState<RowData | null>(null);
  const [memoRow, setMemoRow] = useState<RowData | null>(null);
  const [leanRow, setLeanRow] = useState<RowData | null>(null);
  const [pigmyOpenDetailsRow, setPigmyOpenDetailsRow] = useState<RowData | null>(null);
  const [insuranceDetailsRow, setInsuranceDetailsRow] = useState<RowData | null>(null);

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

  const handleOperativeSubmit = () => {
    setOperativeRow(null);
  };

  const getMenuItems = (row: RowData) =>
    getMenuItemsForAccountType(accountType, row, tRaw, {
      onView: handleView,
      onEdit: handleEdit,
      onFreeze: (r) => setFreezeRow(r),
      onOperative: (r) => setOperativeRow(r),
      onChequeBookIssue: (r) => setChequeBookIssueRow(r),
      onStandingInstruction: (r) => setStandingInstructionRow(r),
      onMemo: (r) => setMemoRow(r),
      onLienMark: (r) => setLeanRow(r),
      onPigmyOpenDetails: (r) => setPigmyOpenDetailsRow(r),
      onAddInsuranceDetails: (r) => setInsuranceDetailsRow(r),
    });

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
        <AccountMasterTable renderMenuItems={getMenuItems} />
      </div>

      {openAddModal && accountType === "investment" && (
        <AddInvestmentAccountMaster onClose={() => setOpenAddModal(false)} />
      )}

      {openAddModal && accountType === "loan" && (
        <AddTermLoanMaster onClose={() => setOpenAddModal(false)} />
      )}

      {openAddModal && accountType === "fixed-asset" && (
        <FixedAssetPage onClose={() => setOpenAddModal(false)} />
      )}

      {openAddModal && (accountType === "ca-sa" || accountType === "deposit") && (
        <AddAccountMaster onClose={() => setOpenAddModal(false)} />
      )}

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

      {chequeBookIssueRow && <ChequeBookIssue onClose={() => setChequeBookIssueRow(null)} />}

      {standingInstructionRow && (
        <AddSI
          onClose={() => setStandingInstructionRow(null)}
          debitAccountCode={standingInstructionRow.accountId}
          debitName={standingInstructionRow.accountName}
        />
      )}

      {memoRow && (
        <MemoModal
          onClose={() => setMemoRow(null)}
        />
      )}

      {/* Fixed LeanPage rendering */}
      {leanRow && (
        <LeanPage
          onClose={() => setLeanRow(null)}
          accountCode={leanRow.accountId}
          accountName={leanRow.accountName}
          // You can pass additional props if available in your RowData
          // ledgerBalance={leanRow.ledgerBalance}
          // availableBalance={leanRow.availableBalance}
        />
      )}

      {pigmyOpenDetailsRow && (
        <AddPigmyDepositModal open onClose={() => setPigmyOpenDetailsRow(null)} />
      )}

      {insuranceDetailsRow && (
        <AddInsuranceDetailsModal open onClose={() => setInsuranceDetailsRow(null)} />
      )}
    </div>
  );
};

export default AccountMasterPage;