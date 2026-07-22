import { IMAGES } from "@/assets";
import React, { useMemo, useState } from 'react'
import Image from "@/components/ui/Image"
import {
  X,
  User,
  AlignLeft,
  LayoutGrid,
  Calendar,
  CalendarClock,
  Percent,
  Repeat,
  Wallet,
  MoreVertical,
  ChevronDown,
} from 'lucide-react'
import ListModal from '@/components/AccountMaster/ListModal'
import { useBilingual } from '@/i18n/useBilingual'

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

type ProductRow = {
  code: string
  description: string
}

type ProductConfig = {
  description: string
  periodMonths: number
  rate: number
  frequency: string
}

const FD_PRODUCTS: Record<string, ProductConfig> = {
  '401': { description: 'Fixed Deposit Monthly', periodMonths: 60, rate: 0, frequency: 'Monthly' },
  '402': { description: 'Fixed Deposit Quarterly', periodMonths: 24, rate: 7.25, frequency: 'Quarterly' },
  '403': { description: 'Staff Security Deposit', periodMonths: 12, rate: 6, frequency: 'Yearly' },
  '404': { description: 'Fixed Deposit Half Year', periodMonths: 6, rate: 6.5, frequency: 'Half-Yearly' },
  '405': { description: 'Fixed Deposit  Yearly', periodMonths: 12, rate: 7, frequency: 'Yearly' },
  '406': { description: 'Fixed Deposit  Yearly', periodMonths: 24, rate: 7.1, frequency: 'Yearly' },
  '407': { description: 'Matured  Cash Certificate', periodMonths: 0, rate: 0, frequency: 'On Maturity' },
  '408': { description: 'Pigmy Agent Security Deposit', periodMonths: 12, rate: 5, frequency: 'Monthly' },
  '409': { description: 'Cumulative Deposit', periodMonths: 36, rate: 7.4, frequency: 'On Maturity' },
  '410': { description: 'Fixed Deposit On Mturity', periodMonths: 12, rate: 7, frequency: 'On Maturity' },
  '411': { description: 'Matured Fixed Deposit', periodMonths: 0, rate: 0, frequency: 'On Maturity' },
  '412': { description: 'Cash Certificate', periodMonths: 60, rate: 7.5, frequency: 'On Maturity' },
}

const SUB_PRODUCT_ROWS: ProductRow[] = Object.entries(FD_PRODUCTS).map(([code, cfg]) => ({
  code,
  description: cfg.description,
}))

const CATEGORY_CODES = ['Public', 'Staff', 'Senior Citizen', 'Trust']
const FREQUENCIES = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'On Maturity']

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const formatDMY = (date: Date) =>
  `${String(date.getDate()).padStart(2, '0')}-${MONTH_NAMES[date.getMonth()]}-${date.getFullYear()}`

const addMonths = (date: Date, months: number) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

const formatINR = (value: number) =>
  value.toLocaleString('en-IN', { maximumFractionDigits: 0 })

/* ------------------------------------------------------------------ */
/* Reusable field shell                                                */
/* ------------------------------------------------------------------ */

function Field({
  label,
  labelHi,
  children,
}: {
  label: string
  labelHi: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-[15px] font-semibold text-black dark:text-slate-100">
        {label} {labelHi ? <span className="text-gray-500 dark:text-slate-400 font-semibold">/ {labelHi}</span> : null}
      </label>
      {children}
    </div>
  )
}

function InputShell({
  icon: Icon,
  value,
  onChange,
  readOnly = false,
  alignRight = false,
}: {
  icon: React.ElementType
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
  alignRight?: boolean
}) {
  return (
    <div
      className={`flex h-11 items-center gap-3 rounded-xl border border-[#B8C2D6] dark:border-slate-700 px-4 ${
        readOnly ? 'bg-[#F3F4F6] dark:bg-slate-800' : 'bg-white dark:bg-slate-900 focus-within:border-primary'
      }`}
    >
      <Icon size={18} className="shrink-0 text-[#6A7282] dark:text-slate-400" />
      <input
        type="text"
        readOnly={readOnly}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full bg-transparent text-[15px] text-[#374151] dark:text-slate-100 outline-none ${
          alignRight ? 'text-right' : ''
        }`}
      />
    </div>
  )
}

function SelectShell({
  icon: Icon,
  value,
  onChange,
  options,
}: {
  icon: React.ElementType
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div className="relative flex h-11 items-center gap-3 rounded-xl border border-[#B8C2D6] dark:border-slate-700 bg-white dark:bg-slate-900 px-4 focus-within:border-primary">
      <Icon size={18} className="shrink-0 text-[#6A7282] dark:text-slate-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-transparent text-[15px] text-[#374151] dark:text-slate-100 outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-4 text-[#6A7282] dark:text-slate-400" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const TdCalculatePage = () => {
  const { t, en } = useBilingual()
  const [productCode, setProductCode] = useState('401')
  const [categoryCode, setCategoryCode] = useState('Public')
  const [openingDate, setOpeningDate] = useState('2026-05-20')
  const [unitOfPeriod, setUnitOfPeriod] = useState<'Day' | 'Month'>('Day')
  const [rate, setRate] = useState(String(FD_PRODUCTS['401'].rate))
  const [frequency, setFrequency] = useState(FD_PRODUCTS['401'].frequency)
  const [depositAmount, setDepositAmount] = useState('2500000')
  const [showSubProductList, setShowSubProductList] = useState(false)

  const product = FD_PRODUCTS[productCode] ?? FD_PRODUCTS['401']

  const handleSelectProduct = (row: ProductRow) => {
    const cfg = FD_PRODUCTS[row.code]
    setProductCode(row.code)
    if (cfg) {
      setRate(String(cfg.rate))
      setFrequency(cfg.frequency)
    }
    setShowSubProductList(false)
  }

  const { maturityDateLabel, maturityAmountLabel } = useMemo(() => {
    const opening = openingDate ? new Date(openingDate) : new Date()
    const maturityDate = addMonths(opening, product.periodMonths)

    const ratePct = parseFloat(rate) || 0
    const principal = parseFloat(depositAmount) || 0
    const years =
      unitOfPeriod === 'Day' ? (product.periodMonths * 30) / 365 : product.periodMonths / 12
    const maturityAmount = principal * (1 + (ratePct / 100) * years)

    return {
      maturityDateLabel: formatDMY(maturityDate),
      maturityAmountLabel: formatINR(maturityAmount),
    }
  }, [openingDate, product, rate, depositAmount, unitOfPeriod])

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Image
            src={IMAGES.ADD_ICON}
            alt="Maturity Amount"
            width={50}
            height={50}
            className="object-contain"
            priority
          />
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {en('tdCalculate.title')} {t('tdCalculate.title') ? <span className="font-bold text-[#64748B] dark:text-slate-400">/ {t('tdCalculate.title')}</span> : null}
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {en('tdCalculate.subtitle')}
              {t('tdCalculate.subtitle') ? <span> / {t('tdCalculate.subtitle')}</span> : null}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Form Card */}
      <div className="border border-[#0256cc]/60 border-t-[3.5px] border-t-[#0256cc] rounded-[14px] p-4 bg-white dark:bg-slate-900 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <Field label={en('tdCalculate.accountType')} labelHi={t('tdCalculate.accountType')}>
            <InputShell icon={User} value="TD" readOnly />
          </Field>

          <Field label={en('tdCalculate.productCode')} labelHi={t('tdCalculate.productCode')}>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <InputShell icon={User} value={productCode} readOnly />
              </div>
              <button
                type="button"
                onClick={() => setShowSubProductList(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] dark:bg-slate-800 text-primary transition-all duration-200 hover:bg-[#DDEAFF] dark:hover:bg-slate-700 active:scale-95"
              >
                <MoreVertical size={18} strokeWidth={2.5} />
              </button>
            </div>
          </Field>

          <Field label={en('tdCalculate.productDescription')} labelHi={t('tdCalculate.productDescription')}>
            <InputShell icon={AlignLeft} value={product.description} readOnly />
          </Field>

          <Field label={en('tdCalculate.categoryCode')} labelHi={t('tdCalculate.categoryCode')}>
            <SelectShell
              icon={LayoutGrid}
              value={categoryCode}
              onChange={setCategoryCode}
              options={CATEGORY_CODES}
            />
          </Field>

          <Field label={en('tdCalculate.openingDate')} labelHi={t('tdCalculate.openingDate')}>
            <div className="relative flex h-11 items-center gap-3 rounded-xl border border-[#B8C2D6] dark:border-slate-700 bg-white dark:bg-slate-900 px-4 focus-within:border-primary">
              <Calendar size={18} className="shrink-0 text-[#6A7282] dark:text-slate-400" />
              <input
                type="date"
                value={openingDate}
                onChange={(e) => setOpeningDate(e.target.value)}
                className="w-full bg-transparent text-[15px] text-[#374151] dark:text-slate-100 outline-none"
              />
            </div>
          </Field>

          <div>
            <label className="mb-2 block text-[15px] font-semibold text-black dark:text-slate-100">
              {en('tdCalculate.unitOfPeriod')} {t('tdCalculate.unitOfPeriod') ? <span className="text-gray-500 dark:text-slate-400 font-semibold">/ {t('tdCalculate.unitOfPeriod')}</span> : null}
            </label>
            <div className="flex h-11 items-center gap-6">
              {(['Day', 'Month'] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    checked={unitOfPeriod === opt}
                    onChange={() => setUnitOfPeriod(opt)}
                    className="h-4 w-4 accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <Field label={en('tdCalculate.periodOfDeposit')} labelHi={t('tdCalculate.periodOfDeposit')}>
            <InputShell icon={CalendarClock} value={`${product.periodMonths} Months`} readOnly />
          </Field>

          <Field label={en('tdCalculate.rate')} labelHi={t('tdCalculate.rate')}>
            <InputShell icon={Percent} value={rate} onChange={setRate} />
          </Field>

          <Field label={en('tdCalculate.interestFrequency')} labelHi={t('tdCalculate.interestFrequency')}>
            <SelectShell icon={Repeat} value={frequency} onChange={setFrequency} options={FREQUENCIES} />
          </Field>

          <Field label={en('tdCalculate.depositAmount')} labelHi={t('tdCalculate.depositAmount')}>
            <InputShell icon={Wallet} value={depositAmount} onChange={setDepositAmount} alignRight />
          </Field>

          <Field label={en('tdCalculate.maturityAmount')} labelHi={t('tdCalculate.maturityAmount')}>
            <InputShell icon={Wallet} value={maturityAmountLabel} readOnly alignRight />
          </Field>

          <Field label={en('tdCalculate.maturityDate')} labelHi={t('tdCalculate.maturityDate')}>
            <InputShell icon={Calendar} value={maturityDateLabel} readOnly />
          </Field>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-primary text-primary font-semibold hover:bg-primary-50 transition-colors"
        >
          {en('common.cancel')} <X size={16} />
        </button>
      </div>

      {/* Sub Product List overlay */}
      {showSubProductList && (
        <ListModal
          title={en('tdCalculate.subProductList')}
          columns={[
            { key: 'code', label: en('tdCalculate.productCode') },
            { key: 'description', label: en('tdCalculate.descriptionCol') },
          ]}
          rows={SUB_PRODUCT_ROWS}
          onSelect={handleSelectProduct}
          onClose={() => setShowSubProductList(false)}
        />
      )}
    </div>
  )
}

export default TdCalculatePage;
