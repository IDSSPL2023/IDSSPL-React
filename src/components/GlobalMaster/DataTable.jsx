import { useState, useRef, useEffect, useMemo } from "react";
import { ArrowUpDown, MoreVertical, Eye, SquarePen, ChevronLeft, ChevronRight } from "lucide-react";
import { getMasterConfig, rowToFormData, buildRowFromForm } from "./masterConfig";
import ParameterModal from "./ParameterModal";

const menuOptions = [
  { key: "view", label: "View", icon: Eye },
  { key: "edit", label: "Edit", icon: SquarePen },
];

const PAGE_SIZE = 10;

const BadgeCell = ({ value }) => {
  const isYes = String(value).toLowerCase() === "yes" || String(value).toLowerCase() === "active";
  return (
    <span className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-medium ${
      isYes ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : "bg-red-50 text-red-500 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
    }`}>
      {value}
    </span>
  );
};

const SortableHeader = ({ label, sortKey, currentKey, sortAsc, onSort }) => (
  <button
    type="button"
    className="flex items-center gap-1.5 select-none cursor-pointer hover:opacity-90"
    onClick={() => onSort(sortKey)}
  >
    <span>{label}</span>
    <ArrowUpDown size={13} className={currentKey === sortKey ? "opacity-100" : "opacity-60"} />
    {currentKey === sortKey && (
      <span className="text-[10px]">{sortAsc ? "↑" : "↓"}</span>
    )}
  </button>
);

const DataTable = ({ master, rows, filters, searchQuery, onRowsChange }) => {
  const config = getMasterConfig(master.key);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenuRow, setOpenMenuRow] = useState(null);
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(1);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuRow(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { setPage(1); }, [filters, searchQuery, master.key]);

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filteredRows = useMemo(() => {
    let result = rows;
    const activeFilters = Object.entries(filters || {}).filter(([, v]) => v?.trim());
    if (activeFilters.length > 0) {
      result = result.filter((row) =>
        activeFilters.every(([key, value]) =>
          String(row[key] ?? "").toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return result;
  }, [rows, filters, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = String(a[sortKey] ?? "").toLowerCase();
      const valB = String(b[sortKey] ?? "").toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const paginatedRows = sortedRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleMenuAction = (action, row) => {
    setOpenMenuRow(null);
    setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
  };

  const handleSave = (formData) => {
    if (modal?.mode === "edit") {
      onRowsChange(rows.map((row) =>
        row.id === modal.rowId ? { ...row, ...buildRowFromForm(master.key, formData) } : row
      ));
    }
    setModal(null);
  };

  const renderCell = (col, row) => {
    const val = row[col.key];
    if (col.type === "badge") return <BadgeCell value={val} />;
    return val;
  };

  return (
    <>
      <div className="min-w-7xl mx-auto p-4">
        <div className="p-4 md:p-5 bg-white rounded-xl shadow-sm dark:bg-slate-900">
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-800">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Sr No.</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Actions</th>
                  {config.columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      <SortableHeader
                        label={col.label}
                        sortKey={col.key}
                        currentKey={sortKey}
                        sortAsc={sortAsc}
                        onSort={handleSort}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={config.columns.length + 2} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, idx) => (
                    <tr key={row.id ?? idx} className="odd:bg-white even:bg-gray-50 border-t border-gray-100 hover:bg-primary-50/30 dark:odd:bg-slate-900 dark:even:bg-slate-800 dark:border-slate-800">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center min-w-[26px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-700 text-xs font-semibold">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 relative">
                        <button type="button" onClick={() => setOpenMenuRow(openMenuRow === row.id ? null : row.id)} className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300">
                          <MoreVertical size={16} />
                        </button>
                        {openMenuRow === row.id && (
                          <div ref={menuRef} className="absolute left-4 top-10 z-20 w-44 rounded-xl border border-primary-200 bg-white py-2 shadow-lg dark:bg-slate-900">
                            {menuOptions.map((opt) => {
                              const Icon = opt.icon;
                              return (
                                <button key={opt.key} type="button" onClick={() => handleMenuAction(opt.key, row)} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
                                  <Icon size={16} className="text-primary" />{opt.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      {config.columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-gray-700 whitespace-nowrap dark:text-slate-300">
                          {renderCell(col, row)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {sortedRows.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-slate-400">
              <span>
                Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, sortedRows.length)} of {sortedRows.length} entries
              </span>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button key={p} type="button" onClick={() => setPage(p)} className={`flex h-8 min-w-[32px] items-center justify-center rounded px-2 ${page === p ? "bg-primary text-white" : "border border-gray-200 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800"}`}>
                    {p}
                  </button>
                ))}
                <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ParameterModal
          mode={modal.mode}
          masterKey={master.key}
          initialData={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default DataTable;
