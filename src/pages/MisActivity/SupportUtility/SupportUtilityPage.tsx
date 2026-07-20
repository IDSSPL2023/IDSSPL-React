// src/pages/SupportUtilityPage.tsx
import React, { useState, useCallback } from "react";
import Nav from "@/components/HeadOfficeMaster/Nav";
import ParameterModal from "@/components/SupportUtility/ParameterModal";
import FilterModal from "@/components/SupportUtility/FilterModal";
import AccountLookupTableModal from "@/components/SupportUtility/AccountLookupTableModal";
import SupportAuditTrailModal from "@/components/SupportUtility/SupportAuditTrailModal";
import UpdateTxnBalanceModal from "@/components/SupportUtility/UpdateTXNBalance";
import UpdateTxnCurrentBalanceModal from "@/components/SupportUtility/UpdateTXNCurrentBalance";
import ScrollModifyModal from "@/components/SupportUtility/ScrollModifyModal";
import DenominationModal from "@/components/SupportUtility/DenominationModal";
import FormSectionsModal from "@/components/SupportUtility/FormSectionsModal";
import { getMasterConfig, emptyFormData } from "@/components/SupportUtility/masterConfig";
import { useBilingual } from "@/i18n/useBilingual";
import HeroSupportUtility from "@/components/shared/WelcomeScreen";

interface BreadcrumbItem {
  label: string;
  href: string;
  onClick?: () => void;
}

interface MasterItem {
  titleEn: string;
  titleHi: string;
  key: string;
  icon: string;
}

type ModalMode = "add" | null;

const SUPPORT_UTILITY_TITLE = "Support Utility";

const SupportUtilityPage: React.FC = () => {
  const { en } = useBilingual();
  const [openMaster, setOpenMaster] = useState<MasterItem | null>(null);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [accountLookupMaster, setAccountLookupMaster] = useState<MasterItem | null>(null);
  const [supportAuditTrailOpen, setSupportAuditTrailOpen] = useState(false);

  // Update TXN Balance modal
  const [txnBalanceOpen, setTxnBalanceOpen] = useState(false);
  // Update TXN Current Balance modal
  const [txnCurrentBalanceOpen, setTxnCurrentBalanceOpen] = useState(false);
  const [scrollModifyMaster, setScrollModifyMaster] = useState<MasterItem | null>(null);
  const [denominationMaster, setDenominationMaster] = useState<MasterItem | null>(null);
  const [formSectionsMaster, setFormSectionsMaster] = useState<MasterItem | null>(null);

  const handleOpenMaster = useCallback((master: MasterItem) => {
    const config = getMasterConfig(master.key);
    setOpenMaster(master);
    setTableRows([...config.rows]);
    setFilters({});
  }, []);

  const handleCloseMaster = useCallback(() => {
    setOpenMaster(null);
    setTableRows([]);
    setFilters({});
    setModalMode(null);
    setShowFilter(false);
  }, []);

  const breadcrumbs: BreadcrumbItem[] = openMaster
    ? [
      { label: en("common.home"), href: "/" },
      { label: en("common.misActivity"), href: "/mis-activity" },
      {
        label: SUPPORT_UTILITY_TITLE,
        href: "#",
        onClick: handleCloseMaster,
      },
      { label: openMaster.titleEn, href: "#" },
    ]
    : [
      { label: en("common.home"), href: "/" },
      { label: en("common.misActivity"), href: "/mis-activity" },
      { label: SUPPORT_UTILITY_TITLE, href: "#" },
    ];

  const handleAddSave = (formData: Record<string, string>) => {
    if (!openMaster) return;
    const newRow: Record<string, unknown> = {
      id: String(Date.now()),
      ...formData,
    };
    setTableRows((prev) => [...prev, newRow]);
    setModalMode(null);
  };

  return (
    <div className="bg-[#E7EAEF] min-h-screen dark:bg-slate-950">
      <Nav
        titleEn={openMaster ? openMaster.titleEn : SUPPORT_UTILITY_TITLE}
        breadcrumbs={breadcrumbs}
        onBack={() => (openMaster ? handleCloseMaster() : window.history.back())}
        showActions={!!openMaster}
        onFilter={() => setShowFilter(true)}
        onAdd={() => setModalMode("add")}
      />
      <HeroSupportUtility
        openMaster={openMaster}
        setOpenMaster={handleOpenMaster}
        onOpenAccountLookup={setAccountLookupMaster}
        onOpenSupportAuditTrail={() => setSupportAuditTrailOpen(true)}
        onOpenTxnBalance={() => setTxnBalanceOpen(true)}
        onOpenTxnCurrentBalance={() => setTxnCurrentBalanceOpen(true)}
        onOpenScrollModify={setScrollModifyMaster}
        onOpenDenomination={setDenominationMaster}
        onOpenFormSections={setFormSectionsMaster}
        tableRows={tableRows}
        onRowsChange={setTableRows}
        filters={filters}
      />

      {modalMode === "add" && openMaster && (
        <ParameterModal
          mode="add"
          masterKey={openMaster.key}
          initialData={emptyFormData(openMaster.key)}
          onClose={() => setModalMode(null)}
          onSave={handleAddSave}
        />
      )}

      {showFilter && openMaster && (
        <FilterModal
          masterKey={openMaster.key}
          initialFilters={filters}
          onClose={() => setShowFilter(false)}
          onApply={setFilters}
        />
      )}

      {accountLookupMaster && (
        <AccountLookupTableModal
          masterKey={accountLookupMaster.key}
          onClose={() => setAccountLookupMaster(null)}
          onSave={() => setAccountLookupMaster(null)}
        />
      )}

      {supportAuditTrailOpen && (
        <SupportAuditTrailModal
          onClose={() => setSupportAuditTrailOpen(false)}
        />
      )}

      {txnBalanceOpen && (
        <UpdateTxnBalanceModal
          open={txnBalanceOpen}
          onClose={() => setTxnBalanceOpen(false)}
        />
      )}

      {txnCurrentBalanceOpen && (
        <UpdateTxnCurrentBalanceModal
          open={txnCurrentBalanceOpen}
          onClose={() => setTxnCurrentBalanceOpen(false)}
        />
      )}

      {scrollModifyMaster && (
        <ScrollModifyModal
          masterKey={scrollModifyMaster.key}
          onClose={() => setScrollModifyMaster(null)}
          onSave={() => setScrollModifyMaster(null)}
        />
      )}

      {denominationMaster && (
        <DenominationModal
          masterKey={denominationMaster.key}
          onClose={() => setDenominationMaster(null)}
          onSave={() => setDenominationMaster(null)}
        />
      )}

      {formSectionsMaster && (
        <FormSectionsModal
          masterKey={formSectionsMaster.key}
          onClose={() => setFormSectionsMaster(null)}
          onSave={() => setFormSectionsMaster(null)}
        />
      )}
    </div>
  );
};

export default SupportUtilityPage;