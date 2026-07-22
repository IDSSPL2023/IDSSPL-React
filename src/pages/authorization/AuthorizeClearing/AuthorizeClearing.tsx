import { type FC } from "react";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import HeroClearing from "@/components/Clerk/Clearing/HeroClearing";
import { useBilingual } from "@/i18n/useBilingual";
import { useNavigate } from "react-router-dom";

const AuthorizeClearing: FC = () => {
  const { en } = useBilingual();
  const navigate = useNavigate();

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

      <HeroClearing onOpenMaster={(url) => navigate(url)} />
    </div>
  );
};

export default AuthorizeClearing;
