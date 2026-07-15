import { useState } from "react";
import { useBilingual } from "@/i18n/useBilingual";
import AddCM from "@/components/CustomerMaster/AddCM";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import TableCM, { type RowData } from "@/components/CustomerMaster/TableCM";
import EditMobileModal from "@/components/CustomerMaster/EditMobile";
import EditEmailModal from "@/components/CustomerMaster/EditEmail";
import BankingServices from "@/components/CustomerMaster/BankingServices";
import ViewEditCM from "@/components/CustomerMaster/ViewEditCM";
import FilterModal, {
  type CustomerFilters,
  defaultValues,
} from "@/components/CustomerMaster/FilterModal";

interface CustomerRow {
  customerId: string;
  name: string;
  phone: string;
  email: string;
}

const CustomerMasterPage = () => {
  const { t, en } = useBilingual();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CustomerRow | null>(null);
  const [viewMode, setViewMode] = useState<"view" | "edit" | null>(null);
  const [selectedCustomerRow, setSelectedCustomerRow] = useState<RowData | null>(null);

  const [openEditMobile, setOpenEditMobile] = useState(false);
  const [openEditEmail, setOpenEditEmail] = useState(false);
  const [openBankingServices, setOpenBankingServices] = useState(false);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>(defaultValues);

  const handleResetFilters = () => {
    setFilters(defaultValues);
  };

  const handleView = (row: RowData) => {
    setSelectedCustomerRow(row);
    setViewMode("view");
  };

  const handleEdit = (row: RowData) => {
    setSelectedCustomerRow(row);
    setViewMode("edit");
  };

  const handleEditPhone = (row: CustomerRow) => {
    setSelectedRow(row);
    setOpenEditMobile(true);
  };

  const handleEditEmail = (row: CustomerRow) => {
    setSelectedRow(row);
    setOpenEditEmail(true);
  };

  const handleServices = (row: CustomerRow) => {
    setSelectedRow(row);
    setOpenBankingServices(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] relative dark:bg-slate-950">
      <NavbarCM
        titleEn={en("customerMaster.title")}
        titleHi={t("customerMaster.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("customerMaster.breadcrumb"), href: "/" },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
        isSearchVisible={isSearchVisible}
        filters={filters}
        onToggleSearch={() => setIsSearchVisible((prev) => !prev)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onResetFilters={handleResetFilters}
      />

      <div className="px-3 py-2">
        <TableCM
          filters={filters}
          onView={handleView}
          onEdit={handleEdit}
          onServices={handleServices}
          onEditPhone={handleEditPhone}
          onEditEmail={handleEditEmail}
        />
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              onClose={() => setIsFilterOpen(false)}
              onApply={(newFilters) => setFilters(newFilters)}
              initialValues={filters}
            />
          </div>
        </div>
      )}

      {openAddModal && <AddCM onClose={() => setOpenAddModal(false)} />}

      {openEditMobile && selectedRow && (
        <EditMobileModal
          isOpen={openEditMobile}
          onClose={() => setOpenEditMobile(false)}
          onSubmit={(mobile) => {
            // call your update API here
            setOpenEditMobile(false);
          }}
          customerId={selectedRow.customerId}
          customerName={selectedRow.name}
          currentMobile={selectedRow.phone}
        />
      )}

      {openEditEmail && selectedRow && (
        <EditEmailModal
          isOpen={openEditEmail}
          onClose={() => setOpenEditEmail(false)}
          onSubmit={(email) => {
            // call your update API here
            setOpenEditEmail(false);
          }}
          customerId={selectedRow.customerId}
          customerName={selectedRow.name}
          currentEmail={selectedRow.email}
        />
      )}

      {openBankingServices && selectedRow && (
        <BankingServices
          onClose={() => setOpenBankingServices(false)}
          customerId={selectedRow.customerId}
          customerName={selectedRow.name}
        />
      )}

      {viewMode && selectedCustomerRow && (
        <ViewEditCM
          mode={viewMode}
          customerData={selectedCustomerRow}
          onClose={() => setViewMode(null)}
        />
      )}
    </div>
  );
};

export default CustomerMasterPage;