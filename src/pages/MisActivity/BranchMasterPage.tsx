// app/branch-master/page.tsx or components/BranchMaster/BranchMasterPage.tsx
import { useCallback, useMemo, useState } from "react";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import BranchMasterTable, {
  DEFAULT_BRANCH_ROWS,
  rowToBranchFormData,
  type BranchRow,
} from "@/components/BranchMaster/BranchMasterTable";
import AddBranchModal, {
  emptyBranchFormData,
  type BranchFormData,
} from "@/components/BranchMaster/AddBranchModal";
import FilterModal, {
  defaultBranchFilterValues,
  type BranchFilters,
} from "@/components/BranchMaster/FilterModal";
import BranchChequeBookLotModal, {
  rowToChequeBookLotFormData,
  type ChequeBookLotFormData,
} from "@/components/BranchMaster/BranchChequeBookLotModal";
import {
  BranchNonCBSModal,
  rowToBranchNonCBSFormData,
  emptyBranchNonCBSFormData,
  type BranchNonCBSFormData,
} from "@/components/BranchMaster/BranchNonCBS";
import {
  BranchTdReceiptLotModal,
  rowToTdReceiptLotFormData,
  emptyTdReceiptLotFormData,
  type TdReceiptLotFormData,
} from "@/components/BranchMaster/BranchTDReciptLot";
import { useBilingual } from "@/i18n/useBilingual";
import AddParameterModal from "@/components/BranchMaster/Modals/AddNewParameter";
import ParameterModal, {
  ParameterFormData,
  ParameterModalMode,
} from "@/components/BranchMaster/Modals/ViewAndEditParameter";
import ViewEditParameterModal from "@/components/BranchMaster/Modals/ViewAndEditParameter";

export default function BranchMasterPage() {
  const { t, en } = useBilingual();

  const breadcrumbs = [
    { label: en("common.home"), href: "/" },
    { label: en("common.misActivity"), href: "/" },
    { label: en("branchMaster.breadcrumb"), href: "#" },
  ];

  const FILTER_LABELS: Record<keyof BranchFilters, string> = {
    branchCode: en("branchMaster.filters.branchCode"),
    branchName: en("branchMaster.filters.branchName"),
    cityCode: en("branchMaster.filters.cityCode"),
    isImplemented: en("branchMaster.filters.isImplemented"),
  };

  const [rows, setRows] = useState<BranchRow[]>(DEFAULT_BRANCH_ROWS);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [viewRow, setViewRow] = useState<BranchRow | null>(null);
  const [chequeBookLotRow, setChequeBookLotRow] = useState<BranchRow | null>(
    null,
  );
  const [branchNonCbsRow, setBranchNonCbsRow] = useState<BranchRow | null>(
    null,
  );
  const [tdReceiptLotRow, setTdReceiptLotRow] = useState<BranchRow | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BranchFilters>(
    defaultBranchFilterValues,
  );

  const filteredRows = useMemo(() => {
    let result = rows;
    const activeEntries = Object.entries(filters).filter(([, v]) => v?.trim());
    if (activeEntries.length > 0) {
      result = result.filter((row) =>
        activeEntries.every(([key, value]) =>
          String(row[key as keyof BranchRow] ?? "")
            .toLowerCase()
            .includes(value.toLowerCase()),
        ),
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    return result;
  }, [rows, filters, searchQuery]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v?.trim()).length,
    [filters],
  );

  const filterSummary = useMemo(() => {
    const entries = Object.entries(filters).filter(([, v]) => v?.trim()) as [
      keyof BranchFilters,
      string,
    ][];
    if (entries.length === 0) return "";
    const [firstKey, firstVal] = entries[0];
    const extra = entries.length > 1 ? ` +${entries.length - 1} more` : "";
    return `${FILTER_LABELS[firstKey]}:${firstVal}${extra}`;
  }, [filters, FILTER_LABELS]);

  const handleAddSave = useCallback((formData: BranchFormData) => {
    setRows((prev) => [
      ...prev,
      {
        sr: prev.length + 1,
        branchCode: formData.branchCode,
        ifscCode: "",
        branchName: formData.branchName,
        shortName: formData.shortName,
        address: [formData.address1, formData.address2, formData.address3]
          .filter(Boolean)
          .join(", "),
        cityCode: formData.cityCode,
        emailId: formData.emailId,
        phoneNo: formData.phoneNumber1,
        isImplemented: formData.isImplemented === "Yes" ? "Y" : "N",
      },
    ]);
    setShowAdd(false);
  }, []);

  const handleChequeBookLotSave = useCallback((data: ChequeBookLotFormData) => {
    console.log("Branch Cheque Book Lot saved", data);
    setChequeBookLotRow(null);
  }, []);

  const handleBranchNonCbsSave = useCallback((data: BranchNonCBSFormData) => {
    console.log("Branch Non CBS Parameter saved", data);
    setBranchNonCbsRow(null);
  }, []);

  const handleTdReceiptLotSave = useCallback((data: TdReceiptLotFormData) => {
    console.log("Branch TD Receipt Lot saved", data);
    setTdReceiptLotRow(null);
  }, []);

  // Sample data for View/Edit modes
  const sampleParameterData: ParameterFormData = {
    branchCode: "0100",
    branchName: "Ilkal Branch",
    shortName: "Ilkal",
    address1: "Gongada Shetti Building",
    address2: "Gongada Shetti Building",
    address3: "Gongada Shetti Building",
    zipCode: "400001",
    cityCode: "Ilkal",
    state: "Maharashtra",
    country: "India",
    emailId: "ilkal@gmail.com",
    phoneNumber1: "9876543210",
    phoneNumber2: "9876543210",
    phoneNumber3: "9876543210",
    isImplemented: "Yes",
  };

  // Sample data with different values
  const sampleParameterData2: ParameterFormData = {
    branchCode: "0200",
    branchName: "Mumbai Main Branch",
    shortName: "MMB",
    address1: "123 Marine Drive",
    address2: "Near Gateway of India",
    address3: "Colaba",
    zipCode: "400005",
    cityCode: "MUM",
    state: "Maharashtra",
    country: "India",
    emailId: "mumbai@branch.com",
    phoneNumber1: "9876543211",
    phoneNumber2: "9876543212",
    phoneNumber3: "9876543213",
    isImplemented: "No",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ParameterModalMode>("view");
  const [currentData, setCurrentData] =
    useState<ParameterFormData>(sampleParameterData);

  const handleOpenView = (mode:ParameterModalMode) => {
    setModalMode(mode);
    setCurrentData(sampleParameterData);
    setIsModalOpen(true);
  };

  const handleOpenEditViewParameter = (mode:ParameterModalMode) => {
    setModalMode(mode);
    setCurrentData(sampleParameterData);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = (data: ParameterFormData) => {
    console.log("Saved data:", data);
    setCurrentData(data);
    // Here you would typically make an API call to save the data
  };

  const handleValidate = (data: ParameterFormData) => {
    console.log("Validated data:", data);
    // Here you would typically perform additional validation
  };

  return (
    <div className="min-h-screen bg-[#E7EAEF] dark:bg-slate-950">
      <GlobalNav
        titleEn={en("branchMaster.title")}
        titleHi={t("branchMaster.title")}
        breadcrumbs={breadcrumbs}
        onBack={() => window.history.back()}
        showActions
        onAdd={() => setShowAdd(true)}
        onFilter={() => setShowFilter(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => {
          setFilters(defaultBranchFilterValues);
          setSearchQuery("");
        }}
        activeFilterCount={activeFilterCount}
        filterSummary={filterSummary}
      />
      <div className="p-4">
        <BranchMasterTable
          rows={filteredRows}
          handleOpenEditViewParameter={handleOpenEditViewParameter}
          onBranchNonCbsParameter={setBranchNonCbsRow}
          onBranchChequeBookLot={setChequeBookLotRow}
          onBranchTdReceiptLot={setTdReceiptLotRow}
        />
      </div>
      {/* Add Branch Modal */}
      <AddParameterModal
        open={showAdd}
        initialData={emptyBranchFormData}
        onClose={() => setShowAdd(false)}
      />
      <ViewEditParameterModal
        open={isModalOpen}
        mode={modalMode}
        initialData={currentData}
        onClose={handleClose}
        onSave={handleSave}
        onValidate={handleValidate}
      />
      {/* View Branch Modal */}
      <AddBranchModal
        open={!!viewRow}
        mode="view"
        initialData={
          viewRow ? rowToBranchFormData(viewRow) : emptyBranchFormData
        }
        onClose={() => setViewRow(null)}
      />
      {/* Branch Cheque Book Lot Modal */}
      <BranchChequeBookLotModal
        open={!!chequeBookLotRow}
        initialData={
          chequeBookLotRow
            ? rowToChequeBookLotFormData(chequeBookLotRow)
            : undefined
        }
        onClose={() => setChequeBookLotRow(null)}
        onSave={handleChequeBookLotSave}
      />
      {/* Branch Non-CBS Modal */}
      <BranchNonCBSModal
        open={!!branchNonCbsRow}
        initialData={
          branchNonCbsRow
            ? rowToBranchNonCBSFormData(branchNonCbsRow)
            : emptyBranchNonCBSFormData
        }
        onClose={() => setBranchNonCbsRow(null)}
        onSave={handleBranchNonCbsSave}
      />
      {/* Branch TD Receipt Lot Modal */}
      <BranchTdReceiptLotModal
        open={!!tdReceiptLotRow}
        initialData={
          tdReceiptLotRow
            ? rowToTdReceiptLotFormData(tdReceiptLotRow)
            : emptyTdReceiptLotFormData
        }
        onClose={() => setTdReceiptLotRow(null)}
        onSave={handleTdReceiptLotSave}
      />
      {/* Filter Modal */}
      {showFilter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowFilter(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setShowFilter(false)}
              onApply={setFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
