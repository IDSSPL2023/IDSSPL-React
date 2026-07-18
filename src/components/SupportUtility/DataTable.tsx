// @ts-nocheck
import { useState, useRef, useEffect, useMemo } from "react";
import { ArrowUpDown, MoreVertical, Eye, SquarePen } from "lucide-react";
import { getMasterConfig, rowToFormData } from "./masterConfig";
import ParameterModal from "./ParameterModal";

const menuOptions = [
  { key: "view", label: "View", icon: Eye },
  { key: "edit", label: "Edit", icon: SquarePen },
];

const SortableHeader = ({ label, sortable, onSort }) => (
  <div
    className={`flex items-center gap-1.5 select-none ${sortable ? "cursor-pointer" : ""}`}
    onClick={sortable ? onSort : undefined}
  >
    <span>{label}</span>
    {sortable && <ArrowUpDown size={13} />}
  </div>
);

const DataTable = ({ master, rows, filters, onRowsChange }) => {
  const config = getMasterConfig(master.key);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenuRow, setOpenMenuRow] = useState(null);
  const [modal, setModal] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = useMemo(() => {
    const activeFilters = Object.entries(filters || {}).filter(([, v]) => v?.trim());
    if (activeFilters.length === 0) return rows;

    return rows.filter((row) =>
      activeFilters.every(([key, value]) =>
        String(row[key] ?? "").toLowerCase().includes(value.toLowerCase())
      )
    );
  }, [rows, filters]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortKey, sortAsc]);

  const handleMenuAction = (action, row) => {
    setOpenMenuRow(null);
    setModal({
      mode: action,
      data: rowToFormData(master.key, row),
      rowId: row.id,
    });
  };

  const handleSave = (formData) => {
    if (modal?.mode === "add") {
      const newRow = {
        id: String(Date.now()),
        ...formData,
      };
      onRowsChange([...rows, newRow]);
    } else if (modal?.mode === "edit") {
      onRowsChange(
        rows.map((row) =>
          row.id === modal.rowId ? { ...row, ...formData } : row
        )
      );
    }
    setModal(null);
  };

  return (
    <>
      <div className="min-w-7xl mx-auto p-4">
        <div className="p-5 bg-white rounded-xl shadow-sm dark:bg-slate-900">
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Sr No.</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Actions</th>
                  {config.columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      <SortableHeader
                        label={col.label}
                        sortable
                        onSort={() => handleSort(col.key)}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={config.columns.length + 2}
                      className="px-4 py-8 text-center text-gray-400 dark:text-slate-500"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  sortedRows.map((row, idx) => (
                    <tr
                      key={row.id ?? idx}
                      className="odd:bg-white even:bg-gray-50 border-t border-gray-100 hover:bg-primary-50/30 dark:odd:bg-slate-900 dark:even:bg-slate-800 dark:border-slate-800"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center min-w-[26px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-700 text-xs font-semibold">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuRow(openMenuRow === row.id ? null : row.id)
                          }
                          className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuRow === row.id && (
                          <div
                            ref={menuRef}
                            className="absolute left-4 top-10 z-20 w-56 rounded-xl border border-primary-200 bg-white py-2 shadow-lg dark:bg-slate-900"
                          >
                            {menuOptions.map((opt) => {
                              const Icon = opt.icon;
                              return (
                                <button
                                  key={opt.key}
                                  type="button"
                                  onClick={() => handleMenuAction(opt.key, row)}
                                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                  <Icon size={16} className="text-primary" />
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      {config.columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-slate-300">
                          {row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal ? (
        <ParameterModal
          mode={modal.mode}
          masterKey={master.key}
          initialData={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      ) : null}
    </>
  );
};

export default DataTable;
