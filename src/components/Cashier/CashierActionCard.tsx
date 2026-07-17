import { ArrowRight } from 'lucide-react'

export type CashierActionItem = {
  title: string
  subtitle: string
  count?: number
  route?: string
}

type Props = {
  item: CashierActionItem
  onOpen: (route: string | undefined) => void
}

export default function CashierActionCard({ item, onOpen }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item.route)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(item.route)
      }}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-primary">
          <span className="text-xl font-bold">$</span>
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary text-primary">
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  )
}
