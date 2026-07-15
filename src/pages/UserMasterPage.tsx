import UserMasterTable from '@/components/UserMaster/UserMasterTable';
import AddUserModal from '@/components/UserMaster/AddUserMaster';
import NavbarAM from '@/components/UserMaster/NavbarAM';
import FilterModal, { type UserFilters, defaultValues } from '@/components/UserMaster/FilterModal';
import { useState } from 'react';
import { useBilingual } from '@/i18n/useBilingual';

interface Breadcrumb {
  label: string;
  href: string;
}

const UserMasterPage = () => {
  const { t, en } = useBilingual();
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(defaultValues);

  const breadcrumbs: Breadcrumb[] = [
    { label: en("common.home"), href: "/" },
    { label: en("common.misActivity"), href: "/" },
    { label: en("userMaster.breadcrumb"), href: "/" },
  ];

  const handleResetFilters = () => {
    setFilters(defaultValues);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] relative dark:bg-slate-950">
      <NavbarAM
        titleEn={en("userMaster.title")}
        titleHi={t("userMaster.title")}
        breadcrumbs={breadcrumbs}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
        isSearchVisible={isSearchVisible}
        filters={filters}
        onToggleSearch={() => setIsSearchVisible((prev) => !prev)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onResetFilters={handleResetFilters}
      />

      <div className="px-3 py-2">
        <UserMasterTable filters={filters} />
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

      {/* Modal */}
      {openAddModal && (
        <AddUserModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />
      )}
    </div>
  );
};

export default UserMasterPage;
