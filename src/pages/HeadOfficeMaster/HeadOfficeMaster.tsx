import React, { useState, useCallback } from "react";
import Nav from "@/components/HeadOfficeMaster/Nav";
import ParameterModal from "@/components/HeadOfficeMaster/ParameterModal";
import FilterModal from "@/components/HeadOfficeMaster/FilterModal";
import { getMasterConfig, emptyFormData } from "@/components/HeadOfficeMaster/masterConfig";
import { useBilingual } from "@/i18n/useBilingual";
import HeroOffice from "@/components/HeadOfficeMaster/HeroOffice";

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

const HeadOfficeMasterPage: React.FC = () => {
  const { t, en, isEnglish } = useBilingual();
  const [openMaster, setOpenMaster] = useState<MasterItem | null>(null);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [showFilter, setShowFilter] = useState(false);

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
        { label: en("common.misActivity"), href: "#" },
        {
          label: en("headOfficeMaster.title"),
          href: "#",
          onClick: handleCloseMaster,
        },
        { label: openMaster.titleEn, href: "#" },
      ]
    : [
        { label: en("common.home"), href: "/" },
        { label: en("common.misActivity"), href: "#" },
        { label: en("headOfficeMaster.title"), href: "#" },
      ];

  const handleAddSave = (formData: Record<string, string>) => {
    if (!openMaster) return;
    const newRow: Record<string, unknown> = {
      id: String(Date.now()),
      ...formData,
    };
    if (openMaster.key === "accountType") {
      newRow.createdDate = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).toUpperCase();
    }
    setTableRows((prev) => [...prev, newRow]);
    setModalMode(null);
  };

  return (
    <div className="app-page-bg min-h-screen dark:bg-slate-950">
      <Nav
        titleEn={openMaster ? openMaster.titleEn : en("headOfficeMaster.title")}
        titleHi={openMaster ? (isEnglish ? undefined : openMaster.titleHi) : t("headOfficeMaster.title")}
        breadcrumbs={breadcrumbs}
        onBack={() => (openMaster ? handleCloseMaster() : window.history.back())}
        showActions={!!openMaster}
        onFilter={() => setShowFilter(true)}
        onAdd={() => setModalMode("add")}
      />
      <HeroOffice
        openMaster={openMaster}
        setOpenMaster={handleOpenMaster}
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
    </div>
  );
};

export default HeadOfficeMasterPage;
