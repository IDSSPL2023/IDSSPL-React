import React from 'react'
import CashierActionCard, { type CashierActionItem } from './CashierActionCard'

type Props = {
  items: CashierActionItem[]
  onOpen: (route: string | undefined) => void
}

export default function CashierActions({ items, onOpen }: Props) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CashierActionCard key={item.title} item={item} onOpen={onOpen} />
      ))}
    </div>
  )
}
