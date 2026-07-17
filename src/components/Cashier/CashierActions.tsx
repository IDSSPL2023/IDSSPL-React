import CashierActionCard, { type CashierActionItem } from './CashierActionCard'

type Props = {
  items: CashierActionItem[]
  onOpen: (route: string | undefined) => void
}

export default function CashierActions({ items, onOpen }: Props) {
  return (
    <>
      {items.map((item) => (
        <CashierActionCard key={item.key} item={item} onOpen={onOpen} />
      ))}
    </>
  )
}
