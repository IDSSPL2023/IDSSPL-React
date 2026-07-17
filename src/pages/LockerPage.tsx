import { useMemo, useState } from "react";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import LockerTable, { DEFAULT_LOCKER_ROWS, type LockerRow } from "@/components/Locker/LockerTable";
import AddLocker, { type NewLockerRowPayload } from "@/components/Locker/AddLocker";
import FilterModal, { defaultLockerFilterValues, type LockerFilters } from "@/components/Locker/FilterModal";
import LockerSurrenderModal from "@/components/Locker/LockerSurrenderModal";
import LockerTransactionModal from "@/components/Locker/LockerTransactionModal";
import Pagination from "@/components/shared/Pagination";

const PAGE_SIZE = 10;

const FILTER_LABELS: Record<keyof LockerFilters, string> = {
  lockerType: "Locker Type",
  lockerNo: "Locker No",
  status: "Status",
  customerId: "Customer ID",
};

export default function LockerPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Clerk", href: "/" },
    { label: "Locker", href: "#" },
  ];

  const [rows, setRows] = useState<LockerRow[]>(DEFAULT_LOCKER_ROWS);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [surrenderRow, setSurrenderRow] = useState<LockerRow | null>(null);
  const [transactionRow, setTransactionRow] = useState<LockerRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<LockerFilters>(defaultLockerFilterValues);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    let result = rows;
    const activeEntries = Object.entries(filters).filter(([, v]) => v?.trim());
    if (activeEntries.length > 0) {
      result = result.filter((row) =>
        activeEntries.every(([key, value]) => {
          if (key === "lockerNo") return row.lockerNo.toLowerCase().includes(value.toLowerCase());
          if (key === "lockerType") return row.lockerType.toLowerCase().includes(value.toLowerCase());
          if (key === "status") return row.status.toLowerCase() === value.toLowerCase();
          if (key === "customerId") return row.customerId.toLowerCase().includes(value.toLowerCase());
          return true;
        }),
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)));
    }
    return result;
  }, [rows, filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  const activeFilterCount = useMemo(() => Object.values(filters).filter((v) => v?.trim()).length, [filters]);

  const filterSummary = useMemo(() => {
    const entries = Object.entries(filters).filter(([, v]) => v?.trim()) as [keyof LockerFilters, string][];
    if (entries.length === 0) return "";
    const [firstKey, firstVal] = entries[0];
    const extra = entries.length > 1 ? ` +${entries.length - 1} more` : "";
    return `${FILTER_LABELS[firstKey]}:${firstVal}${extra}`;
  }, [filters]);

  const handleAddSave = (payload: NewLockerRowPayload) => {
    setRows((prev) => [
      ...prev,
      {
        sr: prev.length + 1,
        lockerType: payload.lockerType,
        lockerNo: payload.lockerNo,
        status: "Active",
        cupboardType: payload.cupboardType,
        accountNo: payload.accountNo,
        accountName: payload.accountName,
        customerId: payload.customerId,
      },
    ]);
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-[#E7EAEF] dark:bg-slate-950">
      <GlobalNav
        titleEn="Locker"
        titleHi="लॉकर"
        breadcrumbs={breadcrumbs}
        onBack={() => window.history.back()}
        showActions
        onAdd={() => setShowAdd(true)}
        onFilter={() => setShowFilter(true)}
        searchQuery={searchQuery}
        onSearchChange={(v) => {
          setSearchQuery(v);
          setPage(1);
        }}
        onRefresh={() => {
          setFilters(defaultLockerFilterValues);
          setSearchQuery("");
          setPage(1);
        }}
        activeFilterCount={activeFilterCount}
        filterSummary={filterSummary}
      />

      <div className="p-4">
        <LockerTable rows={pagedRows} onSurrender={setSurrenderRow} onTransaction={setTransactionRow} />
        <div className="mt-2 rounded-xl bg-white shadow-sm dark:bg-slate-900">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {showAdd && <AddLocker onClose={() => setShowAdd(false)} onSave={handleAddSave} />}

      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowFilter(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setShowFilter(false)}
              onApply={(v) => {
                setFilters(v);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}

      {surrenderRow && <LockerSurrenderModal row={surrenderRow} onClose={() => setSurrenderRow(null)} />}
      {transactionRow && <LockerTransactionModal row={transactionRow} onClose={() => setTransactionRow(null)} />}
    </div>
  );
}
