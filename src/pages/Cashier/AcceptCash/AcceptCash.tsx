import React, { useMemo, useState } from "react";
import RowActionMenu from "@/components/shared/RowActionMenu";
import StatusPill from "@/components/shared/StatusPill";
import { ArrowUpDown, ChevronUp, ChevronDown, Eye, Edit, CreditCard, Receipt, Landmark, X, Check, Printer, ShieldCheck, User } from "lucide-react";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";

/* ===== from CashierTable.tsx ===== */
export type CashierTable_Row = {
  id: number;
  branchCode: string;
  scrollDate: string;
  scrollNumber: number;
  amount: number;
  cashHandleNo: number;
  status: string;
}

type CashierTable_SortDirection = 'asc' | 'desc'
type CashierTable_SortConfig = { key: Exclude<keyof CashierTable_Row, 'id'>; direction: CashierTable_SortDirection } | null

type CashierTable_CashierTableProps = {
  rows: CashierTable_Row[];
  onView?: (row: CashierTable_Row) => void;
  onEdit?: (row: CashierTable_Row) => void;
}

function CashierTable({ rows, onView, onEdit }: CashierTable_CashierTableProps) {
  const [sortConfig, setSortConfig] = useState<CashierTable_SortConfig>(null)

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

  function handleSort(key: Exclude<keyof CashierTable_Row, 'id'>) {
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


/* ===== from AcceptCashPage.tsx ===== */
type AcceptCashPage_Props = {
  rows: CashierTable_Row[];
}

function AcceptCashPage({ rows }: AcceptCashPage_Props) {
  return (
    <div>
      <CashierTable rows={rows} />
    </div>
  )
}


/* ===== from AcceptCashModal.tsx ===== */
type AcceptCashModal_DenominationRow = {
  label: string
  received: string
  paid: string
}

type AcceptCashModal_Props = {
  onClose: () => void
  onSave?: () => void
}

const AcceptCashModal_INPUT_ROWS: AcceptCashModal_DenominationRow[] = [
  { label: '2000', received: '', paid: '' },
  { label: '500', received: '', paid: '' },
  { label: '200', received: '', paid: '' },
  { label: '100', received: '', paid: '' },
  { label: '50', received: '', paid: '' },
  { label: '20', received: '', paid: '' },
  { label: '10', received: '', paid: '' },
  { label: '5', received: '', paid: '' },
  { label: '2', received: '', paid: '' },
  { label: '1', received: '', paid: '' },
  { label: 'Change', received: '', paid: '' },
  { label: 'Total', received: '', paid: '' },
]

const AcceptCashModal_formatAmount = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)

function AcceptCashModal({ onClose, onSave }: AcceptCashModal_Props) {
  const [form, setForm] = useState({
    accountCode: '000000001334',
    accountName: '12-May-2026',
    customerId: '2893849.00',
    customerName: '2893849.00',
    transactionAmount: '12-May-2026',
    scrollNumber: '2893849.00',
    cashHandlingDate: '12-May-2026',
  })
  const [rows, setRows] = useState<AcceptCashModal_DenominationRow[]>(AcceptCashModal_INPUT_ROWS)
  const [isValidated, setIsValidated] = useState(false)

  const totals = useMemo(() => {
    const receivedTotal = rows.reduce((sum, row) => sum + Number(row.received || 0), 0)
    const paidTotal = rows.reduce((sum, row) => sum + Number(row.paid || 0), 0)
    return {
      receivedTotal,
      paidTotal,
      balance: receivedTotal - paidTotal,
      change: receivedTotal - paidTotal,
    }
  }, [rows])

  const handleRowChange = (index: number, field: 'received' | 'paid', value: string) => {
    setRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleValidate = () => {
    setIsValidated(true)
  }

  const handleSave = () => {
    if (!isValidated) return
    onSave?.()
    onClose()
  }

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setIsValidated(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 p-4">
      <div className="w-full max-w-[1240px] max-h-[calc(100vh-2rem)] overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-sm">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Accept Cash / व्याज तपशील</h2>
              <p className="mt-2 text-sm text-slate-500">Manage customer’s personal and identity information. / ग्राहकाशी वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[calc(100vh-13rem)] flex-col overflow-hidden px-8 py-6">
          <div className="mb-6 overflow-hidden rounded-[32px] border-2 border-blue-500 bg-[#F8FAFF] p-5">
            <div className="grid gap-4 xl:grid-cols-4">
              {[
                { label: 'Account Code', sub: 'खाते कोड', value: form.accountCode },
                { label: 'Account Name', sub: 'खाते नाव', value: form.accountName },
                { label: 'Customer ID', sub: 'ग्राहक आयडी', value: form.customerId },
                { label: 'Customer Name', sub: 'ग्राहकाचे नाव', value: form.customerName },
              ].map((item) => (
                <label key={item.label} className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-900">
                    <span>{item.label} / {item.sub}</span>
                    <span className="text-red-500">*</span>
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(event) => {
                        const key = item.label === 'Account Code'
                          ? 'accountCode'
                          : item.label === 'Account Name'
                          ? 'accountName'
                          : item.label === 'Customer ID'
                          ? 'customerId'
                          : 'customerName'
                        handleInputChange(key as keyof typeof form, event.target.value)
                      }}
                      className="w-full rounded-[22px] border border-slate-300 bg-white px-12 py-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {[
                { label: 'Transaction Amount', sub: 'व्यवहार रक्कम', value: form.transactionAmount },
                { label: 'Scroll Number', sub: 'स्क्रोल क्रमांक', value: form.scrollNumber },
                { label: 'Cash Handling Date', sub: 'रोख हाताळणी दिनांक', value: form.cashHandlingDate },
              ].map((item) => (
                <label key={item.label} className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-900">
                    <span>{item.label} / {item.sub}</span>
                    <span className="text-red-500">*</span>
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(event) => {
                        const key = item.label === 'Transaction Amount'
                          ? 'transactionAmount'
                          : item.label === 'Scroll Number'
                          ? 'scrollNumber'
                          : 'cashHandlingDate'
                        handleInputChange(key as keyof typeof form, event.target.value)
                      }}
                      className="w-full rounded-[22px] border border-slate-300 bg-white px-12 py-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white">
            <div className="grid grid-cols-[230px_1fr_1fr] bg-[#1F276F] px-5 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white">
              <div>Cash Detail</div>
              <div>Received</div>
              <div>Paid</div>
            </div>
            <div className="min-h-0 overflow-y-auto bg-white px-0 pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              {rows.map((row, index) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[230px_1fr_1fr] items-center gap-0 border-b border-slate-200 px-5 py-3 text-sm text-slate-700"
                >
                  <div className="font-medium">{row.label}</div>
                  <div className="px-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={row.received}
                      onChange={(event) => handleRowChange(index, 'received', event.target.value)}
                      className="h-11 w-full rounded-[18px] border border-slate-300 bg-slate-50 px-4 text-right text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="px-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={row.paid}
                      onChange={(event) => handleRowChange(index, 'paid', event.target.value)}
                      className="h-11 w-full rounded-[18px] border border-slate-300 bg-slate-50 px-4 text-right text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] bg-[#F8FAFF] px-6 py-4">
            <div className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
              <span>Denomination Amount</span>
              <span className="text-lg font-bold text-slate-900">{AcceptCashModal_formatAmount(totals.balance)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleValidate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Check size={16} />
              Validate
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValidated}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <ShieldCheck size={16} />
              Save
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Printer size={16} />
              Print Voucher
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


/* ===== from AcceptCashPage.tsx ===== */
const SAMPLE_ROWS = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  branchCode: '0002',
  scrollDate: '27/04/2026',
  scrollNumber: 3,
  amount: i === 2 ? 578426 : 50000,
  cashHandleNo: 0,
  status: 'Active',
}))

export default function PagesAcceptCashPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn="Accept Cash"
        titleHi="रोख स्वीकारा"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Cashier', href: '/cashier' }, { label: 'Accept Cash', href: '#' }]}
        onBack={() => window.history.back()}
        onAdd={() => setIsAddOpen(true)}
        isSearchVisible
      />

      <div className="p-4">
        <AcceptCashPage rows={SAMPLE_ROWS} />
      </div>

      {isAddOpen && (
        <AcceptCashModal
          onClose={() => setIsAddOpen(false)}
          onSave={() => setIsAddOpen(false)}
        />
      )}
    </div>
  )
}
