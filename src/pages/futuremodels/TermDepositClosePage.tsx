 
import { useState } from "react";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import DepositCloseModal, { type DepositCloseFormData } from "@/components/AccountMaster/DepositClose";
import NavbarAM from "@/components/AccountMaster/NavbarAM";
import { useBilingual } from "@/i18n/useBilingual";

const TermDepositClosePage = () => {
  const { t, en } = useBilingual();
  const [openCloseModal, setOpenCloseModal] = useState(false);
 
  const handleCloseSubmit = (data: DepositCloseFormData) => {
    window.alert(`Term deposit closed for account ${data.accountCode || "-"}.`);
  };
 
  return (
    <div className="min-h-screen bg-[#F4F6FC] dark:bg-slate-950 relative">
      <NavbarAM
        titleEn={en("tdClose.title")}
        titleHi={t("tdClose.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.futureModels"), href: "/futuremodels" },
          { label: en("tdClose.breadcrumb"), href: "/futuremodels/td-close" },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenCloseModal(true)}
      />
 
      {/* {openCloseModal && ( */}
        <DepositCloseModal
          open={openCloseModal}
          onClose={() => setOpenCloseModal(false)}
          onSubmit={handleCloseSubmit}
        />
      {/* )} */}
 
    </div>
  );
};
 
export default TermDepositClosePage;