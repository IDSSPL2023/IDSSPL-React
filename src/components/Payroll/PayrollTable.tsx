import { useMemo, useState } from 'react'
import RowActionMenu, { type RowActionMenuItem } from '@/components/shared/RowActionMenu'
import StatusPill from '@/components/shared/StatusPill'
import { ArrowUpDown, ChevronUp, ChevronDown, Eye, Edit } from 'lucide-react'

export type PayrollRow = {
  id: number;
  employeeId: string;
  employeeName: string;
  employmentType: string;
  designation: string;
  gender: string;
  status: string;
}

type SortDirection = 'asc' | 'desc'
type SortConfig = { key: Exclude<keyof PayrollRow, 'id'>; direction: SortDirection } | null

type PayrollTableProps = {
  rows: PayrollRow[];
  onView?: (row: PayrollRow) => void;
  onEdit?: (row: PayrollRow) => void;
  /** Overrides the default View/Edit row actions with a custom action list. */
  actions?: (row: PayrollRow) => RowActionMenuItem[];
}

export default function PayrollTable({ rows, onView, onEdit, actions }: PayrollTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)

  const sorted = useMemo(() => {
    if (!sortConfig) return rows
    const { key, direction } = sortConfig
    return [...rows].sort((a, b) => {
      const aVal = String(a[key] ?? '').toLowerCase()
      const bVal = String(b[key] ?? '').toLowerCase()
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [rows, sortConfig])

  function handleSort(key: Exclude<keyof PayrollRow, 'id'>) {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }

  const columns: { key: Exclude<keyof PayrollRow, 'id'>; label: string }[] = [
    { key: 'status', label: 'Status' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'employmentType', label: 'Employment Type' },
    { key: 'designation', label: 'Designation' },
    { key: 'gender', label: 'Gender' },
  ]

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Sr No.</th>
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Actions</th>
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
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">No records found</td>
              </tr>
            ) : (
              sorted.map((row, index) => (
                <tr key={row.id} className="bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 align-middle">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 rounded-md text-primary-700 text-sm font-medium dark:bg-indigo-900/30">{index + 1}</span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <RowActionMenu
                      menuWidth={180}
                      triggerClassName="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-400"
                      items={
                        actions
                          ? actions(row)
                          : [
                              { key: 'view', label: 'View', icon: Eye, onClick: () => onView?.(row) ?? console.log('view', row) },
                              { key: 'edit', label: 'Edit', icon: Edit, onClick: () => onEdit?.(row) ?? console.log('edit', row) },
                            ]
                      }
                    />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">
                    <StatusPill label={row.status} tone={row.status === 'Active' ? 'success' : row.status === 'Inactive' ? 'rejected' : 'neutral'} />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.employeeId}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.employeeName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.employmentType}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.designation}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.gender}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
