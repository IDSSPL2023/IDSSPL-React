import { useState } from "react";
import NavbarAM from "./NavbarAM";
import FilterModal, { type AccountFilters } from "../shared/FilterModal";
import AccountMasterTable, { type RowData } from "./AccountMasterTable";
import ViewAccountModal, { type AccountDetails } from "./ViewAccount";

export default function AccountMasterPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<AccountFilters>({
    accountName: "",
    accountNumber: "",
    accountType: "",
  });
  const [viewMode, setViewMode] = useState<"view" | "edit" | null>(null);
  const [selectedAccountRow, setSelectedAccountRow] = useState<RowData | null>(null);

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
    <div>
      <NavbarAM
        titleEn="Account Master"
        titleHi="खाता मास्टर"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account Master", href: "/account-master" },
        ]}
        onBack={() => console.log("back")}
        onOpenFilter={() => setIsFilterOpen(true)}
        onAdd={() => console.log("add")}
      />

      {/* Page content goes here */}

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <AccountMasterTable filters={filters} onView={handleView} onEdit={handleEdit} />
      </div>

      {viewMode && selectedAccountRow && (
        <ViewAccountModal
          mode={viewMode}
          data={toAccountDetails(selectedAccountRow)}
          onClose={() => setViewMode(null)}
        />
      )}
    </div>
  );
}