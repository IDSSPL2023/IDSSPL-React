import { useState, type FC } from "react";
import Nav from "@/components/HeadOfficeMaster/Nav";
import HeroClearing from "@/components/Clerk/Clearing/HeroClearing";
import ClearingFormModal from "@/components/Clerk/Clearing/ClearingFormModal";
import { useBilingual } from "@/i18n/useBilingual";
import { useRouter } from "@/lib/navigation";

// Custom clearing modals imported from futuremodels/clerk modals
import InwardClearingEntryModal from "@/components/futuremodels/InwardClearingEntryModal";
import OutwardClearingBounceModal from "@/components/futuremodels/OutwardClearingBounceModal";
import OutwardClearingEntryModal from "@/components/futuremodels/OutwardClearingEntryModal";
import GeneratedInwardScheduleModal from "@/components/Clerk/Modals/GenerateInwardSchedule";
import GenerateOutwardScheduleModal from "@/components/Clerk/Modals/GenerateOutwordSchedule";
import ClearingTallyModal from "@/components/Clerk/Modals/ClearingTallyAndHouse";

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

      {activeMasterKey === "clearingTallyWithClearingHouse" ? (
        <ClearingTallyModal open onClose={() => setActiveMasterKey(null)} />
      ) : activeMasterKey === "generateInwardSchedule" ? (
        <GeneratedInwardScheduleModal open onClose={() => setActiveMasterKey(null)} />
      ) : activeMasterKey === "generateOutwardSchedule" ? (
        <GenerateOutwardScheduleModal open onClose={() => setActiveMasterKey(null)} />
      ) : activeMasterKey === "inwardClearingEntry" ? (
        <InwardClearingEntryModal open onClose={() => setActiveMasterKey(null)} />
      ) : activeMasterKey === "owClearingBounceMark" ? (
        <OutwardClearingBounceModal open onClose={() => setActiveMasterKey(null)} />
      ) : activeMasterKey === "outwardClearingEntry" ? (
        <OutwardClearingEntryModal open onClose={() => setActiveMasterKey(null)} />
      ) : activeMasterKey ? (
        <ClearingFormModal masterKey={activeMasterKey} onClose={() => setActiveMasterKey(null)} />
      ) : null}
    </div>
  );
};

export default ClerkClearingPage;
