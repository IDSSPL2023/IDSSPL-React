import { useState } from 'react';
import NavbarAM from '@/components/UserMaster/NavbarAM';
import SetProductStatusTable from './SetProductStatusTable';

interface Breadcrumb {
  label: string;
  href: string;
}

const SetProductStatusPage = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const breadcrumbs: Breadcrumb[] = [
    { label: "Home", href: "/" },
    { label: "MIS Activity", href: "/misactivity" },
    { label: "Financial Closing", href: "/financial-closing" },
    { label: "Set Product Status", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FC] relative dark:bg-slate-950">
      <NavbarAM
        titleEn="Set Product Status"
        titleHi="उत्पादनाची स्थिती सेट करा"
        breadcrumbs={breadcrumbs}
        onBack={() => window.history.back()}
        onAdd={() => {}}
        isSearchVisible={isSearchVisible}
        onToggleSearch={() => setIsSearchVisible((prev) => !prev)}
        onOpenFilter={() => {}}
        onResetFilters={() => {}}
      />

      <div className="px-3 py-2">
        <SetProductStatusTable />
      </div>
    </div>
  );
};

export default SetProductStatusPage;
