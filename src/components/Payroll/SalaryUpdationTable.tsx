import { IndianRupee } from "lucide-react";
import { TextInput } from "@/components/shared/FormFields";

export type SalaryUpdationRow = {
  id: number;
  employeeId: string;
  employeeName: string;
  selected: boolean;
  basicSalary: string;
  other: string;
  travelAll: string;
  diff: string;
  totalAll: string;
  loan: string;
  payAvd: string;
  shares: string;
  kkfFund: string;
};

export type SalaryFieldKey = Exclude<keyof SalaryUpdationRow, "id" | "employeeId" | "employeeName" | "selected">;

const SALARY_COLUMNS: { key: SalaryFieldKey; label: string }[] = [
  { key: "basicSalary", label: "Basic Salary" },
  { key: "other", label: "Other" },
  { key: "travelAll", label: "Travel All" },
  { key: "diff", label: "Diff" },
  { key: "totalAll", label: "Total All" },
  { key: "loan", label: "Loan" },
  { key: "payAvd", label: "Pay AVD" },
  { key: "shares", label: "Shares" },
  { key: "kkfFund", label: "KKF Fund" },
];

type SalaryUpdationTableProps = {
  rows: SalaryUpdationRow[];
  onToggleAll: (selected: boolean) => void;
  onToggleRow: (id: number) => void;
  onFieldChange: (id: number, key: SalaryFieldKey, value: string) => void;
};

export default function SalaryUpdationTable({ rows, onToggleAll, onToggleRow, onFieldChange }: SalaryUpdationTableProps) {
  const allSelected = rows.length > 0 && rows.every((row) => row.selected);
  const someSelected = rows.some((row) => row.selected);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="px-4 py-3 text-left whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={() => onToggleAll(!allSelected)}
                  className="h-4 w-4 accent-primary"
                />
              </th>
              <th className="px-4 py-3 text-left text-[15px] font-medium text-white whitespace-nowrap">Sr No.</th>
              <th className="px-4 py-3 text-left text-[15px] font-medium text-white whitespace-nowrap">Emp No.</th>
              <th className="px-4 py-3 text-left text-[15px] font-medium text-white whitespace-nowrap">Emp. Name</th>
              {SALARY_COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-[15px] font-medium text-white whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={SALARY_COLUMNS.length + 4} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id} className="bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 align-middle">
                    <input
                      type="checkbox"
                      checked={row.selected}
                      onChange={() => onToggleRow(row.id)}
                      className="h-4 w-4 accent-primary"
                    />
                  </td>

                  <td className="px-4 py-3 align-middle">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 rounded-md text-primary-700 text-sm font-medium dark:bg-indigo-900/30">{index + 1}</span>
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">
                    {row.employeeId}
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">
                    {row.employeeName}
                  </td>
                  {SALARY_COLUMNS.map((col) => (
                    <td key={col.key} className="px-4 py-3 align-middle min-w-[140px]">
                      <TextInput
                        icon={<IndianRupee size={14} />}
                        value={row[col.key]}
                        onChange={(v) => onFieldChange(row.id, col.key, v)}
                        readOnly={!row.selected}
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
