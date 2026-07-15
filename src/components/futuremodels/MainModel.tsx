import { useState } from 'react'
import Link from "@/components/ui/Link"
import {
  Users,
  Landmark,
  ShieldCheck,
  FileText,
  ChevronRight,
  LucideIcon,
} from 'lucide-react'

interface ModuleItem {
  name: string
  route?: string
  icon?: LucideIcon
  children?: ModuleItem[]
}

const modules: ModuleItem[] = [
  {
    name: 'Team Deposit',
    icon: Users,
    children: [
      { name: 'Team Deposit Open', route: '/futuremodels/td-open', icon: Users },
      { name: 'Team Deposit Close', route: '/futuremodels/td-close', icon: Landmark },
      { name: 'TD Calculate', route: '/futuremodels/td-calculate', icon: ShieldCheck },
    ],
  },
  {
    name: 'Term Loan',
    icon: Landmark,
    children: [
      { name: 'Term Loan Open', route: '/futuremodels/tl-open', icon: FileText },
      { name: 'Term Loan Close', route: '/futuremodels/tl-close', icon: FileText },
      { name: 'TL Other Charges', route: '/futuremodels/tl-other-charges', icon: FileText },
    ],
  },
  { name: 'Lean', route: '/futuremodels/lean', icon: FileText },
  { name: 'Un-Lean', route: '/futuremodels/un-lean', icon: FileText },
  { name: 'Standing Instructions', route: '/futuremodels/standing-instructions', icon: FileText },
  { name: 'Memo', route: '/futuremodels/memo', icon: FileText },
  { name: 'Calculator', route: '/futuremodels/calculator', icon: FileText },
  { name: 'Pigmy Details', route: '/futuremodels/pigmy-deposit-details', icon: FileText },
  { name: 'Investment Account Open', route: '/futuremodels/investment-account', icon: FileText },
  {name: 'FixedAsset', route: '/futuremodels/FixedAsset', icon: FileText },
  {name: 'CA/SA Closing', route: '/futuremodels/casa-closing', icon: FileText },
  {name: 'TD Closing Reinvest', route: '/futuremodels/TDClosingReinvest', icon: FileText },
  {name: 'Investment Account Close', route: '/futuremodels/investment-account-close', icon: FileText },
  { name: 'Investment Account', route: '/futuremodels/investment-account', icon: FileText },
  // { name: 'FixedAsset', route: '/futuremodels/FixedAsset', icon: FileText },
  { name: 'Pigmy Close Mask', route: '/futuremodels/PigmyDetails', icon: FileText },
]

const MainModel = () => {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(modules.filter((m) => m.children).map((m) => m.name))
  )

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  return (
    <div className="max-w-md p-6">
      <ul className="flex flex-col gap-1">
        {modules.map((mod) => {
          const Icon = mod.icon
          const hasChildren = !!mod.children?.length
          const isOpen = expanded.has(mod.name)

          return (
            <li key={mod.name}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggle(mod.name)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  />
                  {Icon && <Icon className="w-4 h-4 text-primary" />}
                  <span>{mod.name}</span>
                </button>
              ) : (
                <Link
                  href={mod.route as string}
                  className="flex items-center gap-2 rounded-md px-3 py-2 pl-9 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {Icon && <Icon className="w-4 h-4 text-primary" />}
                  <span>{mod.name}</span>
                </Link>
              )}

              {hasChildren && isOpen && (
                <ul className="ml-4 flex flex-col gap-1 border-l border-gray-200 pl-2 dark:border-slate-800">
                  {mod.children!.map((child) => {
                    const ChildIcon = child.icon

                    return (
                      <li key={child.route}>
                        <Link
                          href={child.route as string}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          {ChildIcon && <ChildIcon className="w-4 h-4 text-primary" />}
                          <span>{child.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MainModel