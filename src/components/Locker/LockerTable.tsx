import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronUp, ChevronDown, DoorOpen, ArrowLeftRight } from "lucide-react";
import RowActionMenu from "../shared/RowActionMenu";
import SrNoBadge from "../shared/SrNoBadge";
import StatusPill, { type StatusPillTone } from "../shared/StatusPill";

export interface LockerRow {
  sr: number;
  lockerType: string;
  lockerNo: string;
  status: string;
  cupboardType: string;
  accountNo: string;
  accountName: string;
  customerId: string;
}

type SortableRowKey = Exclude<keyof LockerRow, "sr">;

interface ColumnDef {
  key: string;
  label: string;
  sortKey?: SortableRowKey;
}

type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortableRowKey;
  direction: SortDirection;
}

const columns: ColumnDef[] = [
  { key: "lockerType", label: "Locker Type", sortKey: "lockerType" },
  { key: "lockerNo", label: "Locker No", sortKey: "lockerNo" },
  { key: "status", label: "Status", sortKey: "status" },
  { key: "cupboardType", label: "Cupboard Type", sortKey: "cupboardType" },
  { key: "accountNo", label: "Account No", sortKey: "accountNo" },
  { key: "accountName", label: "Account Name", sortKey: "accountName" },
  { key: "customerId", label: "Customer ID", sortKey: "customerId" },
];

export const DEFAULT_LOCKER_ROWS: LockerRow[] = [
  { sr: 1, lockerType: "Small", lockerNo: "401", status: "Active", cupboardType: "A", accountNo: "000245", accountName: "Devaraddi Mallanagoud", customerId: "00012" },
  { sr: 2, lockerType: "Medium", lockerNo: "402", status: "Active", cupboardType: "B", accountNo: "000246", accountName: "Akshay Om More", customerId: "00015" },
  { sr: 3, lockerType: "Large", lockerNo: "403", status: "Surrendered", cupboardType: "C", accountNo: "000247", accountName: "Priya Sharma", customerId: "00021" },
];

const STATUS_TONE: Record<string, StatusPillTone> = {
  Active: "success",
  Surrendered: "rejected",
  Pending: "pending",
};

function SortableHeader({ label, active, direction }: { label: string; active: boolean; direction: SortDirection | null }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      {active ? (
        direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
      )}
    </span>
  );
}

export interface LockerTableProps {
  rows?: LockerRow[];
  onSurrender?: (row: LockerRow) => void;
  onTransaction?: (row: LockerRow) => void;
}

export default function LockerTable({ rows: initialRows = DEFAULT_LOCKER_ROWS, onSurrender, onTransaction }: LockerTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (col: ColumnDef) => {
    if (!col.sortKey) return;
    const sortKey = col.sortKey;
    setSortConfig((prev) => {
      if (!prev || prev.key !== sortKey) return { key: sortKey, direction: "asc" };
      if (prev.direction === "asc") return { key: sortKey, direction: "desc" };
      return null;
    });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig) return initialRows;
    const { key, direction } = sortConfig;
    return [...initialRows].sort((a, b) => {
      const aVal = String(a[key] ?? "").toLowerCase();
      const bVal = String(b[key] ?? "").toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [initialRows, sortConfig]);

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Serial No</th>
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Action</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                >
                  <SortableHeader
                    label={col.label}
                    active={sortConfig?.key === col.sortKey}
                    direction={sortConfig && sortConfig.key === col.sortKey ? sortConfig.direction : null}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              sortedRows.map((r) => (
                <tr key={r.sr} className="bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 align-middle">
                    <SrNoBadge value={r.sr} />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <RowActionMenu
                      menuWidth={224}
                      triggerClassName="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-400"
                      items={[
                        { key: "surrender", label: "Locker Surrender", icon: DoorOpen, onClick: () => onSurrender?.(r) },
                        { key: "transaction", label: "Locker Transaction", icon: ArrowLeftRight, onClick: () => onTransaction?.(r) },
                      ]}
                    />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.lockerType}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.lockerNo}</td>
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    <StatusPill label={r.status} tone={STATUS_TONE[r.status] ?? "neutral"} />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.cupboardType}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.accountNo}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.accountName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.customerId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
