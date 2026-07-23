import React, { useState, useCallback, useMemo } from "react";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import MasterList from "@/components/GlobalMaster/MasterList";
import ParameterModal from "@/components/GlobalMaster/ParameterModal";
import FilterModal from "@/components/GlobalMaster/FilterModal";
import SuccessModal from "@/components/GlobalMaster/SuccessModal";
import { getMasterConfig, emptyFormData, buildRowFromForm } from "@/components/GlobalMaster/masterConfig";
import { useBilingual } from "@/i18n/useBilingual";

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

const GlobalMasterPage: React.FC = () => {
  const { t, en, isEnglish } = useBilingual();
  const [openMaster, setOpenMaster] = useState<MasterItem | null>(null);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOpenMaster = useCallback((master: MasterItem) => {
    const config = getMasterConfig(master.key);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpenMaster(master);
    setTableRows([...config.rows]);
    setFilters({});
    setSearchQuery("");
  }, []);

  const handleCloseMaster = useCallback(() => {
    setOpenMaster(null);
    setTableRows([]);
    setFilters({});
    setSearchQuery("");
    setShowAdd(false);
    setShowFilter(false);
    setShowSuccess(false);
  }, []);

  const handleRefresh = useCallback(() => {
    if (!openMaster) return;
    const config = getMasterConfig(openMaster.key);
    setTableRows([...config.rows]);
    setFilters({});
    setSearchQuery("");
  }, [openMaster]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v?.trim()).length,
    [filters]
  );

  const filterSummary = useMemo(() => {
    const entries = Object.entries(filters).filter(([, v]) => v?.trim());
    if (entries.length === 0) return "";
    const [firstKey, firstVal] = entries[0];
    const config = openMaster ? getMasterConfig(openMaster.key) : null;
    const label = config?.filterFields.find((f: { key: string; label: string }) => f.key === firstKey)?.label || firstKey;
    const extra = entries.length > 1 ? ` +${entries.length - 1} more` : "";
    return `${label}:${firstVal}${extra}`;
  }, [filters, openMaster]);

  const breadcrumbs: BreadcrumbItem[] = openMaster
    ? [
        { label: en("common.home"), href: "/" },
        { label: en("common.misActivity"), href: "/mis-activity" },
        { label: en("globalMaster.title"), href: "#", onClick: handleCloseMaster },
        { label: openMaster.titleEn, href: "#" },
      ]
    : [
        { label: en("common.home"), href: "/" },
        { label: en("common.misActivity"), href: "/mis-activity" },
        { label: en("globalMaster.title"), href: "#" },
      ];

  const handleAddSave = (formData: Record<string, string>) => {
    if (!openMaster) return;
    const newRow: Record<string, unknown> = {
      id: String(Date.now()),
      ...buildRowFromForm(openMaster.key, formData),
    };
    setTableRows((prev) => [...prev, newRow]);
    setShowAdd(false);
    setShowSuccess(true);
  };

  return (
    <div className="bg-[#E7EAEF] min-h-screen dark:bg-slate-950">
      <GlobalNav
        titleEn={openMaster ? openMaster.titleEn : en("globalMaster.title")}
        titleHi={openMaster ? (isEnglish ? undefined : openMaster.titleHi) : t("globalMaster.title")}
        breadcrumbs={breadcrumbs}
        onBack={() => (openMaster ? handleCloseMaster() : window.history.back())}
        showActions={!!openMaster}
        onFilter={() => setShowFilter(true)}
        onAdd={() => setShowAdd(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
        activeFilterCount={activeFilterCount}
        filterSummary={filterSummary}
      />

      <MasterList
        openMaster={openMaster}
        onOpenMaster={handleOpenMaster}
        tableRows={tableRows}
        onRowsChange={setTableRows}
        filters={filters}
        searchQuery={searchQuery}
      />

      {showAdd && openMaster && (
        <ParameterModal
          mode="add"
          masterKey={openMaster.key}
          initialData={emptyFormData(openMaster.key)}
          onClose={() => setShowAdd(false)}
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

      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

export default GlobalMasterPage;
