import { useState } from "react";
import { useBilingual } from "@/i18n/useBilingual";
import AccountMasterTable, { type RowData } from '@/components/AccountMaster/AccountMasterTable'
import NavbarAM from '@/components/AccountMaster/NavbarAM'
import AddAccountMaster from "@/components/AccountMaster/AddAccountMaster";
import ChequeBookIssue from '@/components/AccountMaster/Cheque/cheque-issue';
import DisplayVouchers from '@/components/AccountMaster/Cheque/voucher';
import ViewAccountModal, { type AccountDetails } from "@/components/AccountMaster/ViewAccount";




const AccountMasterPage = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openChequeModal, setOpenChequeModal] = useState(false);
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const [viewMode, setViewMode] = useState<"view" | "edit" | null>(null);
  const [selectedAccountRow, setSelectedAccountRow] = useState<RowData | null>(null);
   const { t, en } = useBilingual();

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

  return (
    <div className="min-h-screen app-page-bg dark:bg-slate-950 relative" >
      <NavbarAM
        titleEn={en("accountMaster.title")}
        titleHi={t("accountMaster.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("accountMaster.breadcrumb"), href: "/" },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
      />

      <div className="px-3 py-2">
        <AccountMasterTable
          onView={handleView}
          onEdit={handleEdit}
          // onChequeBookIssue={() => setOpenChequeModal(true)}
        />
      </div>

      {/* Modal */}
      {openAddModal && (
        <AddAccountMaster
          onClose={() => setOpenAddModal(false)}
        />
      )}
      {openChequeModal && (
        <ChequeBookIssue
          onClose={() => setOpenChequeModal(false)}
          onDisplayVouchers={() => {
            setOpenChequeModal(false);
            setOpenVoucherModal(true);
          }}
        />
      )}
      {openVoucherModal && (
        <DisplayVouchers onClose={() => setOpenVoucherModal(false)} />
      )}

      {viewMode && selectedAccountRow && (
        <ViewAccountModal
          mode={viewMode}
          data={toAccountDetails(selectedAccountRow)}
          onClose={() => setViewMode(null)}
        />
      )}
    </div>
  )
 }

export default AccountMasterPage;