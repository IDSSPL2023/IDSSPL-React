import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  Settings, GitBranch, Layers, BookOpen, IdCard, Hash, Users, Home, FileText,
  Shield, Globe, MapPin, Building2, User, Car, type LucideIcon,
} from "lucide-react";
import { AppNavbar, WelcomeScreen, FilterModal, SuccessModal, RejectModal } from "@/components/common";
import type { FilterFieldDef, FilterValues } from "@/components/common";
import MasterTable from "@/components/GlobalMaster/MasterTable";
import MasterParameterModal from "@/components/GlobalMaster/MasterParameterModal";
import {
  getMasterConfig,
  emptyFormData,
  buildRowFromForm,
  MASTERS,
  countryCodeByName,
} from "@/components/GlobalMaster/masterConfig";
import { useBilingual } from "@/i18n/useBilingual";
import { useRouter } from "@/lib/navigation";
import {
  fetchCities,
  createCity,
  fetchStates,
  createState,
  type CityRecord,
  type StateRecord,
} from "@/lib/masterMaintenanceApi";

const ICON_MAP: Record<string, LucideIcon> = {
  Settings, GitBranch, Layers, BookOpen, IdCard, Hash, Users, Home, FileText,
  Shield, Globe, MapPin, Building2, User, Car,
};

const ROUTED_MASTER_KEYS: Record<string, string> = {
  city: "/globalmaster/citymaster",
  state: "/globalmaster/statemaster",
};

const mapCityRecordToRow = (record: CityRecord): Record<string, unknown> => ({
  id: record.cityCode,
  cityCode: record.cityCode,
  cityName: record.name,
  country: record.countryName,
});

const mapStateRecordToRow = (record: StateRecord): Record<string, unknown> => ({
  id: record.stateCode,
  stateCode: record.stateCode,
  stateName: record.stateName,
  country: record.countryCode,
});

interface MasterItem {
  titleEn: string;
  titleHi: string;
  key: string;
  icon: string;
}

interface GlobalMasterPageProps {
  initialMasterKey?: string;
}

const GlobalMasterPage: React.FC<GlobalMasterPageProps> = ({ initialMasterKey }) => {
  const { t, en, isEnglish } = useBilingual();
  const router = useRouter();
  const [openMaster, setOpenMaster] = useState<MasterItem | null>(null);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [tileQuery, setTileQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{ label: string; value: string }[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tableLoading, setTableLoading] = useState(false);

  const loadCities = useCallback(async () => {
    setTableLoading(true);
    try {
      const records = await fetchCities();
      setTableRows(records.map(mapCityRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load cities from server.");
      setTableRows([]);
    } finally {
      setTableLoading(false);
    }
  }, []);

  const loadStates = useCallback(async () => {
    setTableLoading(true);
    try {
      const records = await fetchStates();
      setTableRows(records.map(mapStateRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load states from server.");
      setTableRows([]);
    } finally {
      setTableLoading(false);
    }
  }, []);

  const handleOpenMaster = useCallback(
    (master: MasterItem) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setOpenMaster(master);
      setFilters({});
      setSearchQuery("");

      if (master.key === "city") {
        setTableRows([]);
        loadCities();
        return;
      }

      if (master.key === "state") {
        setTableRows([]);
        loadStates();
        return;
      }

      const config = getMasterConfig(master.key);
      setTableRows([...config.rows]);
    },
    [loadCities, loadStates]
  );

  useEffect(() => {
    if (!initialMasterKey) return;
    const master = MASTERS.find((m) => m.key === initialMasterKey);
    if (master) handleOpenMaster(master);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMasterKey]);

  const handleMasterCardOpen = useCallback(
    (master: MasterItem) => {
      const routedPath = ROUTED_MASTER_KEYS[master.key];
      if (routedPath) {
        router.push(routedPath);
        return;
      }
      handleOpenMaster(master);
    },
    [handleOpenMaster, router]
  );

  const handleCloseMaster = useCallback(() => {
    setOpenMaster(null);
    setTableRows([]);
    setFilters({});
    setSearchQuery("");
    setShowAdd(false);
    setShowFilter(false);
    setShowSuccess(false);
    setSuccessDetails(null);
    if (initialMasterKey) router.push("/globalmaster");
  }, [initialMasterKey, router]);

  const handleRefresh = useCallback(() => {
    if (!openMaster) return;
    setFilters({});
    setSearchQuery("");
    if (openMaster.key === "city") {
      loadCities();
      return;
    }
    if (openMaster.key === "state") {
      loadStates();
      return;
    }
    const config = getMasterConfig(openMaster.key);
    setTableRows([...config.rows]);
  }, [openMaster, loadCities, loadStates]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v?.trim()).length,
    [filters]
  );

  const filterSummary = useMemo(() => {
    const entries = Object.entries(filters).filter(([, v]) => v?.trim());
    if (entries.length === 0) return "";
    const [firstKey, firstVal] = entries[0];
    const config = openMaster ? getMasterConfig(openMaster.key) : null;
    const label = config?.filterFields.find((f) => f.key === firstKey)?.label || firstKey;
    const extra = entries.length > 1 ? ` +${entries.length - 1} more` : "";
    return `${label}:${firstVal}${extra}`;
  }, [filters, openMaster]);

  const filterFields: FilterFieldDef[] = useMemo(() => {
    if (!openMaster) return [];
    const config = getMasterConfig(openMaster.key);
    return config.filterFields.map((f) => ({ id: f.key, label: f.label, type: "text" as const }));
  }, [openMaster]);

  const breadcrumbs = openMaster
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

  const handleAddSave = async (formData: Record<string, string>) => {
    if (!openMaster) return;

    if (openMaster.key === "city") {
      try {
        const countryCode = countryCodeByName[formData.country] || formData.country;
        const created = await createCity({ name: formData.cityName, countryCode });
        const record = {
          cityCode: created.cityCode,
          name: created.name || formData.cityName,
          countryCode: created.countryCode || countryCode,
          countryName: created.countryName || formData.country,
        };
        setTableRows((prev) => [...prev, mapCityRecordToRow(record)]);
        setSuccessDetails([
          { label: "City Code", value: record.cityCode },
          { label: "City Name", value: record.name },
          { label: "Country Code", value: record.countryCode },
          { label: "Country", value: record.countryName },
        ]);
        setShowAdd(false);
        setShowSuccess(true);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to create city. Please try again.");
      }
      return;
    }

    if (openMaster.key === "state") {
      try {
        const countryCode = countryCodeByName[formData.country] || formData.country;
        const created = await createState({
          stateCode: formData.stateCode,
          countryCode,
          stateName: formData.stateName,
        });
        setTableRows((prev) => [...prev, mapStateRecordToRow(created)]);
        setSuccessDetails([
          { label: "State Code", value: created.stateCode },
          { label: "State Name", value: created.stateName },
          { label: "Country Code", value: created.countryCode },
        ]);
        setShowAdd(false);
        setShowSuccess(true);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to create state. Please try again.");
      }
      return;
    }

    const newRow: Record<string, unknown> = {
      id: String(Date.now()),
      ...buildRowFromForm(openMaster.key, formData),
    };
    setTableRows((prev) => [...prev, newRow]);
    setShowAdd(false);
    setShowSuccess(true);
  };

  const filteredMasters = useMemo(() => {
    const q = tileQuery.trim().toLowerCase();
    if (!q) return MASTERS;
    return MASTERS.filter((m) => m.titleEn.toLowerCase().includes(q) || m.titleHi.toLowerCase().includes(q));
  }, [tileQuery]);

  return (
    <div className="bg-[#E7EAEF] min-h-screen dark:bg-slate-950">
      <AppNavbar
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
        hasActiveFilters={activeFilterCount > 0}
        activeFilterSummary={filterSummary || `${activeFilterCount} filter(s)`}
        onResetFilters={() => setFilters({})}
      />

      {openMaster ? (
        <MasterTable
          master={openMaster}
          rows={tableRows}
          onRowsChange={setTableRows}
          filters={filters}
          searchQuery={searchQuery}
          loading={tableLoading}
        />
      ) : (
        <div className="mx-auto max-w-7xl p-4">
          <div className="rounded-xl bg-white p-5 dark:bg-slate-900">
            <WelcomeScreen
              title="Welcome to Master Maintenance Global"
              searchPlaceholder="Search masters..."
              query={tileQuery}
              onQueryChange={setTileQuery}
              items={filteredMasters.map((master) => {
                const Icon = ICON_MAP[master.icon] || Settings;
                return {
                  id: master.key,
                  title: master.titleEn,
                  subtitle: master.titleHi,
                  icon: (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-primary to-[#052F5B]">
                      <Icon size={22} strokeWidth={2} className="text-white" />
                    </div>
                  ),
                  onOpen: () => handleMasterCardOpen(master),
                };
              })}
              emptyMessage="No masters found"
            />
          </div>
        </div>
      )}

      {showAdd && openMaster && (
        <MasterParameterModal
          mode="add"
          masterKey={openMaster.key}
          initialData={emptyFormData(openMaster.key)}
          onClose={() => setShowAdd(false)}
          onSave={handleAddSave}
        />
      )}

      {showFilter && openMaster && (
        <FilterModal
          fields={filterFields}
          initialValues={filters as FilterValues}
          onClose={() => setShowFilter(false)}
          onApply={(values) => setFilters(values)}
        />
      )}

      {showSuccess && (
        <SuccessModal
          title="Parameter Added Successfully"
          subtitle="Your Parameter is Added Successfully"
          details={successDetails ?? undefined}
          onClose={() => {
            setShowSuccess(false);
            setSuccessDetails(null);
          }}
          onDone={() => {
            setShowSuccess(false);
            setSuccessDetails(null);
          }}
        />
      )}

      {errorMessage && (
        <RejectModal
          title="Unable to Save"
          subtitle={errorMessage}
          onClose={() => setErrorMessage(null)}
          onDone={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
};

export default GlobalMasterPage;
