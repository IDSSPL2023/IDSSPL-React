import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Eye,
  SquarePen,
  Hash,
  FileText,
  Check,
  X,
  ChevronDown,
  ThumbsUp,
} from "lucide-react";
import { IMAGES } from "@/assets";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import {
  GlobalTable,
  FilterModal,
  validateFields,
  isFormValid,
  required,
  type ColumnDef,
  type TableAction,
  type SortDirection,
  type FilterFieldDef,
  type FilterValues,
  type Validator,
} from "@/components/common";
import ModalWrapperWithHeader from "@/components/shared/Wrappers/ModalWrapperWithHeader";
import TextInput from "@/components/shared/Inputs/TextInput";
import SuccessModal from "@/components/shared/SuccessModal";
import { useRouter } from "@/lib/navigation";
import { useBilingual } from "@/i18n/useBilingual";
import {
  fetchConstitutions,
  createConstitution,
  updateConstitution,
  type ConstitutionRecord,
} from "@/api/constitutionmaster.api";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";

const PAGE_SIZE = 10;

type ModalMode = "add" | "edit" | "view" | null;

interface FormState {
  constitutionCode: string;
  description: string;
  [key: string]: string;
}

const emptyForm: FormState = { constitutionCode: "", description: "" };

const FILTER_FIELDS: FilterFieldDef[] = [
  { id: "constitutionCode", label: "Constitution Code", type: "text" },
  { id: "description", label: "Description", type: "text" },
];

export default function ConstitutionMasterPage() {
  const router = useRouter();
  const { en, isEnglish } = useBilingual();

  const [rows, setRows] = useState<ConstitutionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilter, setShowFilter] = useState(false);

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeRecord, setActiveRecord] = useState<ConstitutionRecord | null>(
    null,
  );
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);

  const [successInfo, setSuccessInfo] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const loadConstitutions = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const records = await fetchConstitutions();
      setRows(records);
    } catch (err) {
      console.error(err);
      setLoadError(
        err instanceof Error
          ? err.message
          : "Failed to load Constitution Master records.",
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConstitutions();
  }, [loadConstitutions]);

  useEffect(() => setPage(1), [filters, searchQuery]);

  const filteredRows = useMemo(() => {
    let result = rows;
    const activeFilters = Object.entries(filters).filter(([, v]) => v?.trim());
    if (activeFilters.length > 0) {
      result = result.filter((row) =>
        activeFilters.every(([key, value]) =>
          String((row as unknown as Record<string, unknown>)[key] ?? "")
            .toLowerCase()
            .includes(value.toLowerCase()),
        ),
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (row) =>
          row.constitutionCode.toLowerCase().includes(q) ||
          row.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [rows, filters, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = String(
        (a as unknown as Record<string, unknown>)[sortKey] ?? "",
      ).toLowerCase();
      const valB = String(
        (b as unknown as Record<string, unknown>)[sortKey] ?? "",
      ).toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const paginatedRows = sortedRows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v?.trim()).length,
    [filters],
  );
  const filterSummary = useMemo(() => {
    const entries = Object.entries(filters).filter(([, v]) => v?.trim());
    if (entries.length === 0) return "";
    const [firstKey, firstVal] = entries[0];
    const label =
      FILTER_FIELDS.find((f) => f.id === firstKey)?.label || firstKey;
    const extra = entries.length > 1 ? ` +${entries.length - 1} more` : "";
    return `${label}:${firstVal}${extra}`;
  }, [filters]);

  const columns: ColumnDef<ConstitutionRecord>[] = [
    { key: "constitutionCode", header: "Constitution Code", sortable: true },
    { key: "description", header: "Description", sortable: true },
  ];

  const openAdd = () => {
    setModalMode("add");
    setActiveRecord(null);
    setFormData(emptyForm);
    setErrors({});
    setValidated(false);
  };

  const openEdit = (row: ConstitutionRecord) => {
    setModalMode("edit");
    setActiveRecord(row);
    setFormData({
      constitutionCode: row.constitutionCode,
      description: row.description,
    });
    setErrors({});
    setValidated(false);
  };

  const openView = (row: ConstitutionRecord) => {
    setModalMode("view");
    setActiveRecord(row);
    setFormData({
      constitutionCode: row.constitutionCode,
      description: row.description,
    });
  };

  const closeModal = () => {
    if (saving) return;
    setModalMode(null);
    setActiveRecord(null);
    setFormData(emptyForm);
    setErrors({});
    setValidated(false);
  };

  const actions: TableAction<ConstitutionRecord>[] = [
    { key: "edit", label: "Edit", icon: SquarePen, onClick: openEdit },
    { key: "view", label: "View", icon: Eye, onClick: openView },
  ];

  const handleChange = (key: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleValidate = () => {
    const rules: Partial<Record<string, Validator>> = {
      constitutionCode: required(),
      description: required(),
    };
    const nextErrors = validateFields(formData, rules);
    setErrors(nextErrors);
    setValidated(isFormValid(nextErrors));
  };

  const handleSave = async () => {
    if (!validated || saving) return;
    setSaving(true);
    try {
      if (modalMode === "add") {
        const created = await createConstitution({
          constitutionCode: formData.constitutionCode,
          description: formData.description,
        });
        setRows((prev) => [...prev, created]);
        setModalMode(null);
        setSuccessInfo({
          title: "Parameter Added Successfully",
          subtitle: "Your Parameter is Added Successfully",
        });
      } else if (modalMode === "edit" && activeRecord) {
        const updated = await updateConstitution(
          activeRecord.constitutionCode,
          {
            description: formData.description,
          },
        );
        setRows((prev) =>
          prev.map((row) =>
            row.constitutionCode === activeRecord.constitutionCode
              ? updated
              : row,
          ),
        );
        setModalMode(null);
        setSuccessInfo({
          title: "Parameter Edit Successfully",
          subtitle: "Your Parameter is Edited Successfully",
        });
      }
      setActiveRecord(null);
      setFormData(emptyForm);
      setErrors({});
      setValidated(false);
    } catch (err) {
      setErrorInfo(
        err instanceof Error
          ? err.message
          : "Failed to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const breadcrumbs = [
    { label: en("common.home"), href: "/" },
    { label: en("common.misActivity"), href: "#" },
    {
      label: en("globalMaster.title"),
      href: "#",
      onClick: () => router.push("/globalmaster"),
    },
    { label: "Constitution Master", href: "#" },
  ];

  return (
    <div className="app-page-bg min-h-screen dark:bg-slate-950">
      <GlobalNav
        titleEn="Constitution Master"
        titleHi={isEnglish ? undefined : "संस्थात्मक स्वरूप सूची"}
        breadcrumbs={breadcrumbs}
        onBack={() => router.push("/globalmaster")}
        showActions
        onFilter={() => setShowFilter(true)}
        onAdd={openAdd}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadConstitutions}
        activeFilterCount={activeFilterCount}
        filterSummary={filterSummary}
      />

      <div className="min-w-7xl mx-auto p-4">
        {loadError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {loadError}
          </div>
        )}
        <GlobalTable
          columns={columns}
          rows={paginatedRows}
          rowKey={(row) => row.constitutionCode}
          actions={actions}
          sortKey={sortKey}
          sortDirection={(sortAsc ? "asc" : "desc") as SortDirection}
          onSortChange={handleSort}
          pagination={{ page, totalPages, onPageChange: setPage }}
          loading={loading}
        />
      </div>

      {(modalMode === "add" || modalMode === "edit") && (
        <ModalWrapper
          open
          onClose={closeModal}
          maxWidth="3xl"
          showDefaultClose={false}
          header={
            modalMode === "add"
              ? {
                  icon: IMAGES.ADD_ICON,
                  title: "Add New Parameter",
                  titleHi: "नवीन पॅरामीटर जोडा",
                  subtitle:
                    "Fill in the details below to create a new parameter.",
                  subtitleHi:
                    "नवीन पॅरामीटर जोडण्यासाठी खालील तपशील प्रविष्ट करा.",
                }
              : {
                  icon: IMAGES.PERSON_EDIT_ICON,
                  title: "Edit Parameter",
                  titleHi: "पॅरामीटर संपादित करा",
                  subtitle: "Review and update the details below as needed.",
                  subtitleHi: "आवश्यकतेनुसार खालील तपशील तपासा व अद्ययावत करा.",
                }
          }
          footerButtons={[
            {
              label: "Validate",
              onClick: handleValidate,
              variant: "primary",
              icon: <Check size={16} />,
              disabled: saving,
            },
            {
              label: "Cancel",
              onClick: closeModal,
              variant: "outline",
              icon: <X size={16} />,
              disabled: saving,
            },
            {
              label: saving ? "Saving..." : "Save",
              onClick: handleSave,
              disabled: !validated || saving,
              icon: <ChevronDown size={16} />,
              className:
                validated && !saving
                  ? "bg-primary text-white hover:bg-primary-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed",
            },
          ]}
        >
          <SectionWrapper>
            <div className="flex flex-col gap-4 py-2">
              <TextInput
                labelEn="Constitution Code"
                labelHi="संस्थात्मक स्वरूप कोड"
                icon={Hash}
                placeholder="Enter Constitution Code"
                value={formData.constitutionCode}
                onChange={(v) => handleChange("constitutionCode", v)}
                hasError={!!errors.constitutionCode}
                required
                readOnly={modalMode === "edit"}
              />
              <TextInput
                labelEn="Description"
                labelHi="वर्णन"
                icon={FileText}
                placeholder="Describe Constitution"
                value={formData.description}
                onChange={(v) => handleChange("description", v)}
                hasError={!!errors.description}
                required
              />
            </div>
          </SectionWrapper>
        </ModalWrapper>
      )}

      {modalMode === "view" && activeRecord && (
        <ModalWrapper
          open
          onClose={closeModal}
          maxWidth="3xl"
          showDefaultClose={false}
          header={{
            icon: IMAGES.PERSON_ICON,
            title: "View Parameter",
            titleHi: "पॅरामीटर पहा",
            subtitle: "View the parameter information and associated details.",
            subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
          }}
          footerButtons={[
            {
              label: "Cancel",
              onClick: closeModal,
              variant: "outline",
              icon: <X size={16} />,
            },
            {
              label: "Ok, Got It",
              onClick: closeModal,
              variant: "primary",
              icon: <ThumbsUp size={16} />,
            },
          ]}
        >
          <SectionWrapper>
            <div className="flex flex-col gap-4 py-2">
              <TextInput
                labelEn="Constitution Code"
                labelHi="संस्थात्मक स्वरूप कोड"
                icon={Hash}
                placeholder=""
                value={formData.constitutionCode}
                onChange={() => {}}
                required
                readOnly
              />
              <TextInput
                labelEn="Description"
                labelHi="वर्णन"
                icon={FileText}
                placeholder=""
                value={formData.description}
                onChange={() => {}}
                required
                readOnly
              />
            </div>
          </SectionWrapper>
        </ModalWrapper>
      )}

      {showFilter && (
        <FilterModal
          fields={FILTER_FIELDS}
          initialValues={filters as FilterValues}
          onClose={() => setShowFilter(false)}
          onApply={(values) => setFilters(values)}
        />
      )}

      {successInfo && (
        <SuccessModal
          title={successInfo.title}
          subtitle={successInfo.subtitle}
          variant="success"
          onClose={() => setSuccessInfo(null)}
          onDone={() => setSuccessInfo(null)}
        />
      )}

      {errorInfo && (
        <SuccessModal
          title="Unable to Save"
          subtitle={errorInfo}
          variant="critical"
          onClose={() => setErrorInfo(null)}
          onDone={() => setErrorInfo(null)}
        />
      )}
    </div>
  );
}
