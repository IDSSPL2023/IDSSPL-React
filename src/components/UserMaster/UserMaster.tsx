import { useState } from "react";
import NavbarAM from "./NavbarAM";
import FilterModal, { type AccountFilters } from '../shared/FilterModal';

interface Breadcrumb {
  label: string;
  href: string;
}

export default function AccountMasterPage() {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const breadcrumbs: Breadcrumb[] = [
    { label: "Home", href: "/" },
    { label: "User Master", href: "/user-master" },
  ];

  return (
    <div>
      <NavbarAM
        titleEn="Account Master"
        titleHi="खाता मास्टर"
        breadcrumbs={breadcrumbs}
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
          <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <FilterModal
              onClose={() => setIsFilterOpen(false)}
              onApply={(_filters: AccountFilters) => {
                // hook up filtering of the account list here
                setIsFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}