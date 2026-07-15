import { useState } from "react";
import { Ban } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import RowActionMenu from "../shared/RowActionMenu";
import SrNoBadge from "../shared/SrNoBadge";
import StatusPill from "../shared/StatusPill";
import SortableHeaderLabel from "../shared/SortableHeaderLabel";

export type SIRow = {
  srNo: number;
  debitAccountCode: string;
  debitName: string;
  creditAccountCode: string;
  creditName: string;
  startDate: string;
  endDate: string;
  nextDueDate: string;
  amount: string;
  frequency: string;
  status: string;
  executedCount: string;
};

const columns = [
  { key: "srNo", labelKey: "standingInstructions.table.srNo", sortable: false },
  { key: "action", labelKey: "standingInstructions.table.action", sortable: false },
  { key: "debit", labelKey: "standingInstructions.table.debit", sortable: false },
  { key: "credit", labelKey: "standingInstructions.table.credit", sortable: false },
  { key: "amount", labelKey: "standingInstructions.table.amount", sortable: true },
  { key: "frequency", labelKey: "standingInstructions.table.frequency", sortable: true },
  { key: "nextDueDate", labelKey: "standingInstructions.table.nextDueDate", sortable: true },
  { key: "status", labelKey: "standingInstructions.table.status", sortable: true },
] as const;

const rows: SIRow[] = [
  { srNo: 1, debitAccountCode: "022010014255", debitName: "Mirji Chandrashekar Bhimgouda", creditAccountCode: "00024090001664", creditName: "Mirja Chandrashekar Bhimgouda", startDate: "24/03/2025", endDate: "23/03/2026", nextDueDate: "23/04/2026", amount: "6000.0", frequency: "Monthly", status: "Live", executedCount: "10" },
  { srNo: 2, debitAccountCode: "022010098765", debitName: "Swami Vivekanand Printing Press", creditAccountCode: "00021010000008", creditName: "Anita Singh", startDate: "15/06/2026", endDate: "30/06/2026", nextDueDate: "23/07/2026", amount: "9999.0", frequency: "Yearly", status: "Live", executedCount: "1" },
  { srNo: 3, debitAccountCode: "011203456789", debitName: "Rohit Kumar", creditAccountCode: "00024090005522", creditName: "Rajesh Kumar Sharma", startDate: "01/01/2024", endDate: "01/01/2027", nextDueDate: "01/08/2026", amount: "2500.0", frequency: "Quarterly", status: "Live", executedCount: "6" },
];

type SortKey = "amount" | "frequency" | "nextDueDate" | "status";

interface TableSIProps {
  onStop?: (row: SIRow) => void;
}

const TableSI = ({ onStop }: TableSIProps) => {
  const { tRaw } = useBilingual();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary rounded-t-xl">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as SortKey)}
                  className={`text-left text-[16px] font-semibold text-white px-4 py-2 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <SortableHeaderLabel label={tRaw(col.labelKey)} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr
                key={row.srNo}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} hover:bg-gray-50 dark:hover:bg-slate-800`}
              >
                <td className="px-6 py-3">
                  <SrNoBadge value={row.srNo} />
                </td>

                <td className="px-6 py-3 relative">
                  <RowActionMenu
                    menuWidth={224}
                    items={[
                      { key: "stop", label: tRaw("standingInstructions.table.menuStop"), icon: Ban, onClick: () => onStop?.(row) },
                    ]}
                  />
                </td>

                <td className="px-6 py-3 text-[16px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-black dark:text-slate-100">{row.debitAccountCode}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{row.debitName}</span>
                  </div>
                </td>

                <td className="px-6 py-3 text-[16px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-black dark:text-slate-100">{row.creditAccountCode}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{row.creditName}</span>
                  </div>
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400">{row.amount}</td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400">{row.frequency}</td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400">{row.nextDueDate}</td>

                <td className="px-6 py-3">
                  <StatusPill label={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSI;
