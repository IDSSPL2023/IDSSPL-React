import { ChevronRight } from "lucide-react";
import Image from "@/components/ui/Image";
import { IMAGES } from "@/assets";
import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";

/* ===== from CashierActionCard.tsx ===== */
export type CashierActionCard_CashierActionItem = {
  key: string
  titleEn: string
  titleHi: string
  iconSrc: string
  route?: string
}

type CashierActionCard_Props = {
  item: CashierActionCard_CashierActionItem
  onOpen: (route: string | undefined) => void
}

function CashierActionCard({ item, onOpen }: CashierActionCard_Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item.route)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(item.route)
      }}
      className="flex cursor-pointer items-center gap-4 rounded-2xl border border-l-5 border-primary bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
        <Image
          src={item.iconSrc}
          alt=""
          width={56}
          height={56}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">
          {item.titleEn}
        </h3>
        <p className="mt-0.5 truncate text-sm text-[#64748B] dark:text-slate-400">
          {item.titleHi}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onOpen(item.route)
        }}
        className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
      >
        Open <ChevronRight size={16} />
      </button>
    </div>
  )
}


/* ===== from CashierActions.tsx ===== */
type CashierActions_Props = {
  items: CashierActionCard_CashierActionItem[]
  onOpen: (route: string | undefined) => void
}

function CashierActions({ items, onOpen }: CashierActions_Props) {
  return (
    <>
      {items.map((item) => (
        <CashierActionCard key={item.key} item={item} onOpen={onOpen} />
      ))}
    </>
  )
}


/* ===== from Cashier.tsx ===== */
const actions: CashierActionCard_CashierActionItem[] = [
  { key: 'accept-cash', iconSrc: IMAGES.MONEY, titleEn: 'ACCEPT CASH', titleHi: 'रोख स्वीकृती', route: '/cashier/accept-cash' },
  { key: 'change-cash', iconSrc: IMAGES.NOTE_1, titleEn: 'CHANGE CASH', titleHi: 'रोख बदल' },
  { key: 'cash-handling-entry', iconSrc: IMAGES.HAND, titleEn: 'CASH HANDLING ENTRY', titleHi: 'रोख हाताळणी नोंद' },
  { key: 'combine-accept-pay-cash-multiple', iconSrc: IMAGES.NOTE_1, titleEn: 'COMBINE ACCEPT PAY CASH MULTIPLE', titleHi: 'एकत्रित रोख स्वीकृती व प्रदान' },
  { key: 'exchange-money', iconSrc: IMAGES.CONTACT, titleEn: 'EXCHANGE MONEY', titleHi: 'पैसे विनिमय' },
  { key: 'pay-cash', iconSrc: '/message.png"', titleEn: 'PAY CASH', titleHi: 'रोख प्रदान' },
]

const Cashier = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn="Cashier"
        titleHi="केशियर"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Cashier', href: '/cashier' }]}
        onBack={() => window.history.back()}
        hideActions
      />

      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CashierActions items={actions} onOpen={(route) => route && navigate(route)} />
        </div>
      </div>
    </div>
  )
}

export default Cashier
