import { useEffect, useMemo, useState } from "react";
import { Eye, SquarePen } from "lucide-react";
import { GlobalTable, StatusBadge } from "@/components/common";
import type { ColumnDef, SortDirection, TableAction } from "@/components/common";
import { getMasterConfig, rowToFormData, buildRowFromForm, type MasterColumn } from "./masterConfig";
import MasterParameterModal from "./MasterParameterModal";
import { updateVehicleOwnedType, updateSocialSubSector, updateAddressProof } from "@/api/globalmaster.api";

const PAGE_SIZE = 10;

interface MasterItem {
  key: string;
}

interface MasterTableProps {
  master: MasterItem;
  rows: Record<string, unknown>[];
  filters: Record<string, string>;
  searchQuery: string;
  onRowsChange: (rows: Record<string, unknown>[]) => void;
  loading?: boolean;
}

export default function MasterTable({ master, rows, filters, searchQuery, onRowsChange, loading = false }: MasterTableProps) {
  const config = getMasterConfig(master.key);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
  const [viewRow, setViewRow] = useState<Record<string, unknown> | null>(null);

  useEffect(() => setPage(1), [filters, searchQuery, master.key]);

  const filteredRows = useMemo(() => {
    let result = rows;
    const activeFilters = Object.entries(filters || {}).filter(([, v]) => v?.trim());
    if (activeFilters.length > 0) {
      result = result.filter((row) =>
        activeFilters.every(([key, value]) => String(row[key] ?? "").toLowerCase().includes(value.toLowerCase()))
      );
    }
    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)));
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

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleEditSave = async (formData: Record<string, string>) => {
    if (!editRow) return;

    if (master.key === "vehicleOwned") {
      try {
        const updated = await updateVehicleOwnedType({
          vehicleOwnedId: Number(editRow.vehicleOwnedId),
          description: formData.description,
        });
        onRowsChange(
          rows.map((row) =>
            row.id === editRow.id
              ? { ...row, vehicleOwnedId: String(updated.vehicleOwnedId), description: updated.description }
              : row
          )
        );
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update vehicle owned type. Please try again.");
        return;
      }
      setEditRow(null);
      return;
    }

    if (master.key === "socialSubSector") {
      try {
        const updated = await updateSocialSubSector({
          socialSectorId: Number(editRow.socialSectorId),
          socialSubSectorId: Number(editRow.socialSubSectorId),
          description: formData.description,
        });
        onRowsChange(
          rows.map((row) => (row.id === editRow.id ? { ...row, description: updated.description } : row))
        );
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update social sub sector. Please try again.");
        return;
      }
      setEditRow(null);
      return;
    }

    if (master.key === "addressProof") {
      try {
        const updated = await updateAddressProof({
          addressProofId: Number(editRow.addressProofId),
          description: formData.description,
        });
        onRowsChange(
          rows.map((row) => (row.id === editRow.id ? { ...row, description: updated.description } : row))
        );
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update address proof. Please try again.");
        return;
      }
      setEditRow(null);
      return;
    }

    onRowsChange(
      rows.map((row) => (row.id === editRow.id ? { ...row, ...buildRowFromForm(master.key, formData) } : row))
    );
    setEditRow(null);
  };

  const columns: ColumnDef<Record<string, unknown>>[] = config.columns.map((col: MasterColumn) => ({
    key: col.key,
    header: col.label,
    sortable: true,
    render:
      col.type === "badge"
        ? (row) => {
            const value = String(row[col.key] ?? "");
            const isYes = value.toLowerCase() === "yes" || value.toLowerCase() === "active";
            return <StatusBadge label={value} tone={isYes ? "success" : "rejected"} />;
          }
        : undefined,
  }));

  const actions: TableAction<Record<string, unknown>>[] | undefined = config.hideActions
    ? undefined
    : [
        { key: "view", label: "View", icon: Eye, onClick: (row) => setViewRow(row) },
        { key: "edit", label: "Edit", icon: SquarePen, onClick: (row) => setEditRow(row) },
      ];

  return (
    <div className="min-w-7xl mx-auto p-4">
      <GlobalTable
        columns={columns}
        rows={paginatedRows}
        rowKey={(row, idx) => String(row.id ?? idx)}
        actions={actions}
        sortKey={sortKey}
        sortDirection={(sortAsc ? "asc" : "desc") as SortDirection}
        onSortChange={handleSort}
        pagination={{ page, totalPages, onPageChange: setPage }}
        loading={loading}
      />

      {editRow && (
        <MasterParameterModal
          mode="edit"
          masterKey={master.key}
          initialData={rowToFormData(master.key, editRow as Record<string, string>)}
          onClose={() => setEditRow(null)}
          onSave={handleEditSave}
        />
      )}

      {viewRow && (
        <MasterParameterModal
          mode="view"
          masterKey={master.key}
          initialData={rowToFormData(master.key, viewRow as Record<string, string>)}
          onClose={() => setViewRow(null)}
          onSave={() => setViewRow(null)}
        />
      )}
    </div>
  );
}
