import React, { useState } from 'react'
import NavbarCM from '@/components/CustomerMaster/NavbarCM'
import AcceptCashPage from '@/components/Cashier/AcceptCashPage'
import AcceptCashModal from '@/components/Cashier/AcceptCashModal'

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
