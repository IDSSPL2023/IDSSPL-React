import { useMemo, useState } from 'react'
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import type { PayrollRow } from '@/components/Payroll/PayrollTable'

export type LeaveBalanceRow = PayrollRow & {
  earnLeave: number;
  sickLeave: number;
  casualLeave: number;
  asOnDate: string;
}

type SortDirection = 'asc' | 'desc'
type SortableKey = Exclude<keyof LeaveBalanceRow, 'id'>
type SortConfig = { key: SortableKey; direction: SortDirection } | null

type EmployeeLeaveBalanceTableProps = {
  rows: LeaveBalanceRow[];
}

export default function EmployeeLeaveBalanceTable({ rows }: EmployeeLeaveBalanceTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)

  const sorted = useMemo(() => {
    if (!sortConfig) return rows
    const { key, direction } = sortConfig
    return [...rows].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal
      }
      const aStr = String(aVal ?? '').toLowerCase()
      const bStr = String(bVal ?? '').toLowerCase()
      if (aStr < bStr) return direction === 'asc' ? -1 : 1
      if (aStr > bStr) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [rows, sortConfig])

  function handleSort(key: SortableKey) {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }

  const columns: { key: SortableKey; label: string }[] = [
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'employmentType', label: 'Employment Type' },
    { key: 'designation', label: 'Designation' },
    { key: 'earnLeave', label: 'Earn Leave' },
    { key: 'sickLeave', label: 'Sick Leave' },
    { key: 'casualLeave', label: 'Casual Leave' },
    { key: 'asOnDate', label: 'As On Date' },
  ]

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Sr No.</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {sortConfig?.key === col.key ? (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">No records found</td>
              </tr>
            ) : (
              sorted.map((row, index) => (
                <tr key={row.id} className="bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 align-middle">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 rounded-md text-primary-700 text-sm font-medium dark:bg-indigo-900/30">{index + 1}</span>
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.employeeId}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.employeeName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.employmentType}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.designation}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.earnLeave}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.sickLeave}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.casualLeave}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.asOnDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
