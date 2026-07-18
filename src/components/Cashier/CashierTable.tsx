import React, { useMemo, useState } from 'react'
import RowActionMenu from '@/components/shared/RowActionMenu'
import StatusPill from '@/components/shared/StatusPill'
import { ArrowUpDown, ChevronUp, ChevronDown, Eye, Edit, CreditCard, Receipt, Landmark } from 'lucide-react'

export type Row = {
  id: number;
  branchCode: string;
  scrollDate: string;
  scrollNumber: number;
  amount: number;
  cashHandleNo: number;
  status: string;
}

type SortDirection = 'asc' | 'desc'
type SortConfig = { key: Exclude<keyof Row, 'id'>; direction: SortDirection } | null

type CashierTableProps = {
  rows: Row[];
  onView?: (row: Row) => void;
  onEdit?: (row: Row) => void;
}

export default function CashierTable({ rows, onView, onEdit }: CashierTableProps) {
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

  function handleSort(key: Exclude<keyof Row, 'id'>) {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Sr No.</th>
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Actions</th>
              <th onClick={() => handleSort('status')} className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none">
                <span className="inline-flex items-center gap-1.5">Status{sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />}</span>
              </th>
              <th onClick={() => handleSort('branchCode')} className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none">
                <span className="inline-flex items-center gap-1.5">Branch Code{sortConfig?.key === 'branchCode' ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />}</span>
              </th>
              <th onClick={() => handleSort('scrollDate')} className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none">
                <span className="inline-flex items-center gap-1.5">Scroll Date{sortConfig?.key === 'scrollDate' ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />}</span>
              </th>
              <th onClick={() => handleSort('scrollNumber')} className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none">
                <span className="inline-flex items-center gap-1.5">Scroll Number{sortConfig?.key === 'scrollNumber' ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />}</span>
              </th>
              <th onClick={() => handleSort('amount')} className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none">
                <span className="inline-flex items-center gap-1.5">Amount{sortConfig?.key === 'amount' ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />}</span>
              </th>
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Cash Handle No</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">No records found</td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr key={row.id} className="bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 align-middle">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 rounded-md text-primary-700 text-sm font-medium dark:bg-indigo-900/30">{row.id}</span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <RowActionMenu
                      menuWidth={220}
                      triggerClassName="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-400"
                      items={[
                        { key: 'view', label: 'View', icon: Eye, onClick: () => onView?.(row) ?? console.log('view', row) },
                        { key: 'edit', label: 'Edit', icon: Edit, onClick: () => onEdit?.(row) ?? console.log('edit', row) },
                        { key: 'nonCbs', label: 'Non CBS', icon: Landmark, onClick: () => console.log('nonCbs', row) },
                        { key: 'chequeBookLot', label: 'Cheque Book Lot', icon: CreditCard, onClick: () => console.log('chequeBookLot', row) },
                        { key: 'tdReceiptLot', label: 'TD Receipt Lot', icon: Receipt, onClick: () => console.log('tdReceiptLot', row) },
                      ]}
                    />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">
                    <StatusPill label={row.status} tone={row.status === 'Active' ? 'success' : row.status === 'Inactive' ? 'rejected' : 'neutral'} />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.branchCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.scrollDate}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.scrollNumber}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 align-middle whitespace-nowrap">{row.cashHandleNo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
