import React, { useState, useCallback, useEffect } from "react";
import Nav from "@/components/HeadOfficeMaster/Nav";
import ParameterModal from "@/components/HeadOfficeMaster/ParameterModal";
import ProductParameterModal from "@/components/HeadOfficeMaster/ProductParameterModal";
import GlAccountParameterModal from "@/components/HeadOfficeMaster/GlAccountParameterModal";
import FilterModal from "@/components/HeadOfficeMaster/FilterModal";
import { getMasterConfig, emptyFormData, MASTERS } from "@/components/HeadOfficeMaster/masterConfig";
import { useBilingual } from "@/i18n/useBilingual";
import HeroOffice from "@/components/HeadOfficeMaster/HeroOffice";
import { useRouter } from "@/lib/navigation";
import {
  fetchClearingTypes,
  createClearingType,
  fetchProducts,
  createProduct,
  fetchDepositInterestRates,
  createDepositInterestRate,
  fetchInstallmentTypes,
  createInstallmentType,
  fetchInstrumentTypes,
  saveInstrumentType,
  fetchIndustries,
  createIndustry,
  fetchDepositRules,
  createDepositRule,
  fetchFinalAccountGroups,
  createFinalAccountGroup,
  fetchGlAccounts,
  createGlAccount,
  fetchBranchAccount,
  searchBranchAccounts,
  type ClearingTypeRecord,
  type ProductRecord,
  type DepositInterestRateRecord,
  type InstallmentTypeRecord,
  type InstrumentTypeRecord,
  type IndustryRecord,
  type DepositRuleRecord,
  type FinalAccountGroupRecord,
  type GlAccountRecord,
} from "@/api/headoffice.api";

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

const mapClearingTypeRecordToRow = (record: ClearingTypeRecord): Record<string, unknown> => ({
  ...record,
});

const mapProductRecordToRow = (record: ProductRecord): Record<string, unknown> => ({
  id: record.productCode,
  ...record,
});

const mapGlAccountRecordToRow = (record: GlAccountRecord): Record<string, unknown> => ({
  id: record.glAccountCode,
  ...record,
});

const mapFinalAccountGroupRecordToRow = (record: FinalAccountGroupRecord): Record<string, unknown> => ({
  id: record.code,
  ...record,
});

const formatDateOfApplication = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/ /g, "-");
};

const mapDepositInterestRateRecordToRow = (record: DepositInterestRateRecord): Record<string, unknown> => ({
  id: [record.accountTypeCode, record.categoryCode, record.dateOfApplication, record.fromPeriod, record.toPeriod, record.unitOfPeriod].join("-"),
  ...record,
  dateOfApplication: formatDateOfApplication(record.dateOfApplication),
});

const mapInstallmentTypeRecordToRow = (record: InstallmentTypeRecord): Record<string, unknown> => ({
  ...record,
});

const mapInstrumentTypeRecordToRow = (record: InstrumentTypeRecord): Record<string, unknown> => ({
  id: record.code,
  ...record,
});

const mapIndustryRecordToRow = (record: IndustryRecord): Record<string, unknown> => ({
  ...record,
});

const mapDepositRuleRecordToRow = (record: DepositRuleRecord): Record<string, unknown> => ({
  ...record,
});

interface HeadOfficeMasterPageProps {
  initialMasterKey?: string;
}

const HeadOfficeMasterPage: React.FC<HeadOfficeMasterPageProps> = ({ initialMasterKey }) => {
  const { t, en, isEnglish } = useBilingual();
  const router = useRouter();
  const [openMaster, setOpenMaster] = useState<MasterItem | null>(null);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [showFilter, setShowFilter] = useState(false);

  const loadClearingTypes = useCallback(async () => {
    try {
      const records = await fetchClearingTypes();
      setTableRows(records.map(mapClearingTypeRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load clearing types from server.");
      setTableRows([]);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const records = await fetchProducts();
      setTableRows(records.map(mapProductRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load products from server.");
      setTableRows([]);
    }
  }, []);

  const loadFinalAccountGroups = useCallback(async () => {
    try {
      const records = await fetchFinalAccountGroups();
      setTableRows(records.map(mapFinalAccountGroupRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load final account groups from server.");
      setTableRows([]);
    }
  }, []);

  const loadGlAccounts = useCallback(async () => {
    try {
      const records = await fetchGlAccounts();
      setTableRows(records.map(mapGlAccountRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load GL accounts from server.");
      setTableRows([]);
    }
  }, []);

  const loadTdInterestRates = useCallback(async () => {
    try {
      const records = await fetchDepositInterestRates();
      setTableRows(records.map(mapDepositInterestRateRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load TD interest rates from server.");
      setTableRows([]);
    }
  }, []);

  const loadInstallmentTypes = useCallback(async () => {
    try {
      const records = await fetchInstallmentTypes();
      setTableRows(records.map(mapInstallmentTypeRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load installment types from server.");
      setTableRows([]);
    }
  }, []);

  const loadInstrumentTypes = useCallback(async () => {
    try {
      const records = await fetchInstrumentTypes();
      setTableRows(records.map(mapInstrumentTypeRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load instrument types from server.");
      setTableRows([]);
    }
  }, []);

  const loadIndustries = useCallback(async () => {
    try {
      const records = await fetchIndustries();
      setTableRows(records.map(mapIndustryRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load industries from server.");
      setTableRows([]);
    }
  }, []);

  const loadDepositRules = useCallback(async () => {
    try {
      const records = await fetchDepositRules();
      setTableRows(records.map(mapDepositRuleRecordToRow));
    } catch (err) {
      console.error(err);
      alert("Failed to load deposit rules from server.");
      setTableRows([]);
    }
  }, []);

  const loadDefaultBranchAccounts = useCallback(async () => {
    try {
      const data = await fetchBranchAccount();
      setTableRows(data.map((item, idx) => ({ id: String(idx), ...item })));
    } catch (error) {
      console.error("Failed to load branch accounts:", error);
      setTableRows([]);
    }
  }, []);

  const handleOpenMaster = useCallback(
    (master: MasterItem) => {
      setOpenMaster(master);
      setFilters({});

      if (master.key === "clearingType") {
        setTableRows([]);
        loadClearingTypes();
        return;
      }

      if (master.key === "productMaster") {
        setTableRows([]);
        loadProducts();
        return;
      }

      if (master.key === "glAccount") {
        setTableRows([]);
        loadGlAccounts();
        return;
      }

      if (master.key === "finalAccountGroup") {
        setTableRows([]);
        loadFinalAccountGroups();
        return;
      }

      if (master.key === "tdInterestRate") {
        setTableRows([]);
        loadTdInterestRates();
        return;
      }

      if (master.key === "installmentType") {
        setTableRows([]);
        loadInstallmentTypes();
        return;
      }

      if (master.key === "instrumentType") {
        setTableRows([]);
        loadInstrumentTypes();
        return;
      }

      if (master.key === "industry") {
        setTableRows([]);
        loadIndustries();
        return;
      }

      if (master.key === "depositRule") {
        setTableRows([]);
        loadDepositRules();
        return;
      }

      if (master.key === "defaultBranchAccounts") {
        setTableRows([]);
        loadDefaultBranchAccounts();
        return;
      }

      const config = getMasterConfig(master.key);
      setTableRows([...config.rows]);
    },
    [loadClearingTypes, loadProducts, loadGlAccounts, loadTdInterestRates, loadInstallmentTypes, loadInstrumentTypes, loadIndustries, loadDepositRules, loadFinalAccountGroups, loadDefaultBranchAccounts]
  );

  useEffect(() => {
    if (!initialMasterKey) return;
    const master = MASTERS.find((m) => m.key === initialMasterKey);
    if (master) handleOpenMaster(master);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMasterKey]);

  const handleCloseMaster = useCallback(() => {
    setOpenMaster(null);
    setTableRows([]);
    setFilters({});
    setModalMode(null);
    setShowFilter(false);
    if (initialMasterKey) router.push("/headofficemaster");
  }, [initialMasterKey, router]);

  const breadcrumbs: BreadcrumbItem[] = openMaster
    ? [
        { label: en("common.home"), href: "/" },
        { label: en("common.misActivity"), href: "/mis-activity" },
        {
          label: en("headOfficeMaster.title"),
          href: "#",
          onClick: handleCloseMaster,
        },
        { label: openMaster.titleEn, href: "#" },
      ]
    : [
        { label: en("common.home"), href: "/" },
        { label: en("common.misActivity"), href: "/mis-activity" },
        { label: en("headOfficeMaster.title"), href: "#" },
      ];

  const handleAddSave = async (formData: Record<string, string>) => {
    if (!openMaster) return;

    if (openMaster.key === "clearingType") {
      try {
        const created = await createClearingType({
          id: formData.id,
          description: formData.description,
          clearingHouseCode: formData.clearingHouseCode,
          payableRequired: formData.payableRequired,
          payableHead: formData.payableHead,
          receivableRequired: formData.receivableRequired,
          receivableHead: formData.receivableHead,
        });
        setTableRows((prev) => [...prev, mapClearingTypeRecordToRow(created)]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create clearing type. Please try again.");
        throw err;
      }
      return;
    }

    if (openMaster.key === "tdInterestRate") {
      try {
        const created = await createDepositInterestRate({
          accountTypeCode: formData.accountTypeCode,
          categoryCode: formData.categoryCode,
          dateOfApplication: formData.dateOfApplication,
          fromPeriod: Number(formData.fromPeriod) || 0,
          toPeriod: Number(formData.toPeriod) || 0,
          unitOfPeriod: formData.unitOfPeriod,
          rateOfInterest: Number(formData.rateOfInterest) || 0,
        });
        setTableRows((prev) => [...prev, mapDepositInterestRateRecordToRow(created)]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create TD interest rate. Please try again.");
        throw err;
      }
      return;
    }

    if (openMaster.key === "installmentType") {
      try {
        const created = await createInstallmentType({
          id: formData.id,
          description: formData.description,
          diaryBased: formData.diaryBased,
          principalArrearsOnDiary: formData.principalArrearsOnDiary,
          interestArrearsOnDiary: formData.interestArrearsOnDiary,
          installmentOn: formData.installmentOn,
        });
        setTableRows((prev) => [...prev, mapInstallmentTypeRecordToRow(created)]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create installment type. Please try again.");
        throw err;
      }
      return;
    }

    if (openMaster.key === "instrumentType") {
      try {
        const saved = await saveInstrumentType({
          code: formData.code,
          description: formData.description,
        });
        setTableRows((prev) => [...prev, mapInstrumentTypeRecordToRow(saved)]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to save instrument type. Please try again.");
        throw err;
      }
      return;
    }

    if (openMaster.key === "industry") {
      try {
        const created = await createIndustry({
          id: formData.id,
          description: formData.description,
        });
        setTableRows((prev) => [...prev, mapIndustryRecordToRow(created)]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create industry. Please try again.");
        throw err;
      }
      return;
    }

    if (openMaster.key === "depositRule") {
      try {
        const created = await createDepositRule({
          id: formData.id,
          description: formData.description,
        });
        setTableRows((prev) => [...prev, mapDepositRuleRecordToRow(created)]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create deposit rule. Please try again.");
        throw err;
      }
      return;
    }

    if (openMaster.key === "finalAccountGroup") {
      try {
        const created = await createFinalAccountGroup({
          code: formData.code,
          description: formData.description,
        });
        setTableRows((prev) => [...prev, mapFinalAccountGroupRecordToRow(created)]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create final account group. Please try again.");
        throw err;
      }
      return;
    }

    if (openMaster.key === "defaultBranchAccounts") {
      // The actual save/update call happens inside ParameterModal (it needs the
      // validate-then-save flow); once that resolves, just refresh the list.
      try {
        await loadDefaultBranchAccounts();
      } catch (error) {
        console.error("Failed to refresh branch accounts:", error);
      }
      return;
    }

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
  };

  const handleProductSave = async (payload: Parameters<typeof createProduct>[0]) => {
    try {
      const created = await createProduct(payload);
      setTableRows((prev) => [...prev, mapProductRecordToRow(created)]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create product. Please try again.");
      throw err;
    }
  };

  const handleGlAccountSave = async (payload: Parameters<typeof createGlAccount>[0]) => {
    try {
      const created = await createGlAccount(payload);
      setTableRows((prev) => [...prev, mapGlAccountRecordToRow(created)]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create GL account. Please try again.");
      throw err;
    }
  };

  const handleFilterApply = useCallback(
    async (newFilters: Record<string, string>) => {
      setFilters(newFilters);

      if (openMaster?.key === "defaultBranchAccounts") {
        try {
          // /branches/search only returns matching {branchCode, name} pairs — it's a branch
          // lookup, not a search over the account mappings — so cross-reference the matched
          // branch codes against the full mappings list to get the real clearing codes.
          const [matches, allAccounts] = await Promise.all([
            searchBranchAccounts({
              searchBy: (newFilters.searchBy as "BRANCH_CODE" | "NAME") || "NAME",
              textToSearch: newFilters.textToSearch || "",
            }),
            fetchBranchAccount(),
          ]);
          const matchedCodes = new Set(matches.map((m) => m.branchCode));
          const filtered = allAccounts.filter((acc) => matchedCodes.has(acc.branchCode));
          setTableRows(filtered.map((item, idx) => ({ id: String(idx), ...item })));
        } catch (error) {
          console.error("Failed to search branch accounts:", error);
        }
      }
    },
    [openMaster]
  );

  return (
    <div className="bg-[#E7EAEF] min-h-screen dark:bg-slate-950">
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

      {modalMode === "add" && openMaster && openMaster.key === "productMaster" && (
        <ProductParameterModal onClose={() => setModalMode(null)} onSave={handleProductSave} />
      )}

      {modalMode === "add" && openMaster && openMaster.key === "glAccount" && (
        <GlAccountParameterModal onClose={() => setModalMode(null)} onSave={handleGlAccountSave} />
      )}

      {modalMode === "add" && openMaster && openMaster.key !== "productMaster" && openMaster.key !== "glAccount" && (
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
          onApply={handleFilterApply}
        />
      )}
    </div>
  );
};

export default HeadOfficeMasterPage;
