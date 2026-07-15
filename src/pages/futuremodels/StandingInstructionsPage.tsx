import { useState } from "react";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import TableSI, { type SIRow } from "@/components/StandingInstruction/TableSI";
import AddSI, { type NewSIFormData } from "@/components/StandingInstruction/AddSI";
import StopSI from "@/components/StandingInstruction/StopSI";
import { useBilingual } from "@/i18n/useBilingual";

const StandingInstructionsPage = () => {
  const { t, en } = useBilingual();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [stopRow, setStopRow] = useState<SIRow | null>(null);

  const handleAddSave = (data: NewSIFormData) => {
    window.alert(`Standing Instruction created for ${data.creditName || "new beneficiary"}.`);
  };

  const handleStopSave = (stopReason: string) => {
    window.alert(`Standing Instruction stopped. Reason: ${stopReason}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] dark:bg-slate-950 relative">
      <NavbarCM
        titleEn={en("standingInstructions.title")}
        titleHi={t("standingInstructions.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.futureModels"), href: "/futuremodels" },
          { label: en("standingInstructions.breadcrumb"), href: "/futuremodels/standing-instructions" },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
      />

      <div className="px-3 py-2">
        <TableSI onStop={(row) => setStopRow(row)} />
      </div>

      {openAddModal && (
        <AddSI onClose={() => setOpenAddModal(false)} onSave={handleAddSave} />
      )}

      {stopRow && (
        <StopSI
          onClose={() => setStopRow(null)}
          onSave={handleStopSave}
          data={stopRow}
        />
      )}
    </div>
  );
};

export default StandingInstructionsPage;
