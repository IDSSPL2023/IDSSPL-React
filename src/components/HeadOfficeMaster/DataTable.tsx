// @ts-nocheck
import { useState, useMemo } from "react";
import { ArrowUpDown, Eye, SquarePen, GitBranch } from "lucide-react";
import RowActionMenu from "../shared/RowActionMenu";
import { getMasterConfig, rowToFormData } from "./masterConfig";
import ParameterModal from "./ParameterModal";
import BranchEnableDisableModal from "./BranchEnableDisableModal";

const menuOptions = [
  { key: "view", label: "View", icon: Eye },
  { key: "edit", label: "Edit", icon: SquarePen },
  { key: "branchEnableDisable", label: "Branch Enable Disable ", icon: GitBranch },
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
  const [modal, setModal] = useState(null);

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
    if (action === "branchEnableDisable") {
      setModal({
        mode: action,
        row,
      });
      return;
    }
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
      if (master.key === "accountType") {
        newRow.createdDate = new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).toUpperCase();
      }
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
                      <td className="px-4 py-3">
                        <RowActionMenu
                          items={menuOptions.map((opt) => ({
                            ...opt,
                            onClick: () => handleMenuAction(opt.key, row),
                          }))}
                          menuWidth={224}
                          triggerClassName="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                          ariaLabel="Head office row actions"
                        />
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

      {modal?.mode === "branchEnableDisable" ? (
        <BranchEnableDisableModal
          row={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(formData) => {
            onRowsChange(
              rows.map((row) =>
                row.id === modal.row?.id
                  ? {
                      ...row,
                      transactionAllowed: formData.transactionAllowed === "enable" ? "Enable" : "Disable",
                      workingDate: formData.workingDate,
                    }
                  : row
              )
            );
          }}
        />
      ) : modal ? (
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
