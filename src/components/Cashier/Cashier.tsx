import React from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarCM from '@/components/CustomerMaster/NavbarCM'
import CashierActions from './CashierActions'
import { type CashierActionItem } from './CashierActionCard'

const actions: CashierActionItem[] = [
  { title: 'ACCEPT CASH', subtitle: 'Accept Cash entries for authorization', route: '/cashier/accept-cash' },
  { title: 'CHANGE CASH', subtitle: 'Change cash records' },
  { title: 'CASH HANDLING ENTRY', subtitle: 'Cash handling transaction entry' },
  { title: 'COMBINE ACCEPT PAY CASH MULTIPLE', subtitle: 'Combine payments and receipts' },
  { title: 'EXCHANGE MONEY', subtitle: 'Exchange money transactions'  },
  { title: 'PAY CASH', subtitle: 'Cash payment transactions' },
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
        <div className="grid gap-4 grid-cols-2">
          <CashierActions items={actions} onOpen={(route) => route && navigate(route)} />
        </div>
      </div>
    </div>
  )
}

export default Cashier