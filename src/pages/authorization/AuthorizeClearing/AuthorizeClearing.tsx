import { useState, type FC } from "react";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import HeroClearing from "@/components/Clerk/Clearing/HeroClearing";
import ClearingFormModal from "@/components/Clerk/Clearing/ClearingFormModal";
import { useBilingual } from "@/i18n/useBilingual";

const AuthorizeClearing: FC = () => {
  const { en } = useBilingual();
  const [activeMasterKey, setActiveMasterKey] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Authorize Clearing"
        titleHi="क्लिअरिंग अधिकृत करा"
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("authorization.breadcrumb"), href: "/authorization" },
          { label: "Authorize Clearing", href: "#" },
        ]}
        onBack={() => window.history.back()}
      />

      <HeroClearing onOpenMaster={setActiveMasterKey} />

      {activeMasterKey && (
        <ClearingFormModal
          masterKey={activeMasterKey}
          mode="authorize"
          onClose={() => setActiveMasterKey(null)}
        />
      )}
    </div>
  );
};

export default AuthorizeClearing;
