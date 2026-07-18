import React, { useMemo, useState } from 'react'
import { X, Check, Printer, ShieldCheck, User } from 'lucide-react'

type DenominationRow = {
  label: string
  received: string
  paid: string
}

type Props = {
  onClose: () => void
  onSave?: () => void
}

const INPUT_ROWS: DenominationRow[] = [
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

const formatAmount = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)

export default function AcceptCashModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState({
    accountCode: '000000001334',
    accountName: '12-May-2026',
    customerId: '2893849.00',
    customerName: '2893849.00',
    transactionAmount: '12-May-2026',
    scrollNumber: '2893849.00',
    cashHandlingDate: '12-May-2026',
  })
  const [rows, setRows] = useState<DenominationRow[]>(INPUT_ROWS)
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
              <span className="text-lg font-bold text-slate-900">{formatAmount(totals.balance)}</span>
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
