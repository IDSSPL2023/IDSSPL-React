import React from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarCM from '@/components/CustomerMaster/NavbarCM'
import CashierActions from './CashierActions'
import { type CashierActionItem } from './CashierActionCard'

const actions: CashierActionItem[] = [
  { key: 'accept-cash', iconSrc: '/note1.png', titleEn: 'ACCEPT CASH', titleHi: 'रोख स्वीकृती', route: '/cashier/accept-cash' },
  { key: 'change-cash', iconSrc: '/note1.png', titleEn: 'CHANGE CASH', titleHi: 'रोख बदल' },
  { key: 'cash-handling-entry', iconSrc: '/note1.png', titleEn: 'CASH HANDLING ENTRY', titleHi: 'रोख हाताळणी नोंद' },
  { key: 'combine-accept-pay-cash-multiple', iconSrc: '/note1.png', titleEn: 'COMBINE ACCEPT PAY CASH MULTIPLE', titleHi: 'एकत्रित रोख स्वीकृती व प्रदान' },
  { key: 'exchange-money', iconSrc: '/note1.png', titleEn: 'EXCHANGE MONEY', titleHi: 'पैसे विनिमय' },
  { key: 'pay-cash', iconSrc: '/note1.png', titleEn: 'PAY CASH', titleHi: 'रोख प्रदान' },
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