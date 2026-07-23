import { AppNavbar } from "@/components/common";
import AuthorizationCards from "@/components/Authorization/AuthorizationCards";
import { useBilingual } from "@/i18n/useBilingual";

const AuthorizationPage = () => {
  const { t, en } = useBilingual();
  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <AppNavbar
        titleEn={en("authorization.title")}
        titleHi={t("authorization.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("authorization.breadcrumb"), href: "#" },
        ]}
        onBack={() => window.history.back()}
      />

      <AuthorizationCards />
    </div>
  );
};

export default AuthorizationPage;
