import { useState, type FC } from "react";
import Nav from "@/components/HeadOfficeMaster/Nav";
import HeroClearing from "@/components/Clerk/Clearing/HeroClearing";
import ClearingFormModal from "@/components/Clerk/Clearing/ClearingFormModal";
import { useBilingual } from "@/i18n/useBilingual";
import { useRouter } from "@/lib/navigation";

const ClerkClearingPage: FC = () => {
  const { en } = useBilingual();
  const router = useRouter();
  const [activeMasterKey, setActiveMasterKey] = useState<string | null>(null);

  return (
    <div className="bg-[#E7EAEF] min-h-screen dark:bg-slate-950">
      <Nav
        titleEn={en("clearing.hero.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("clearing.hero.breadcrumbClerk"), href: "#" },
          { label: en("clearing.hero.title"), href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <HeroClearing onOpenMaster={setActiveMasterKey} />

      {activeMasterKey && (
        <ClearingFormModal masterKey={activeMasterKey} onClose={() => setActiveMasterKey(null)} />
      )}
    </div>
  );
};

export default ClerkClearingPage;
