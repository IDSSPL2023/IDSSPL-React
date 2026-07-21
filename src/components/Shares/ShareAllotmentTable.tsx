import StatusPill from '@/components/shared/StatusPill'

export type ShareAllotmentRow = {
  id: number;
  accountCode: string;
  accountName: string;
  noOfShares: string;
  amount: string;
  meetingDate: string;
  status: string;
}

type ShareAllotmentTableProps = {
  rows: ShareAllotmentRow[];
}

export default function ShareAllotmentTable({ rows }: ShareAllotmentTableProps) {
  const columns: { key: Exclude<keyof ShareAllotmentRow, 'id'>; label: string }[] = [
    { key: 'accountCode', label: 'Account Code' },
    { key: 'accountName', label: 'Account Name' },
    { key: 'noOfShares', label: 'No. Of Shares' },
    { key: 'amount', label: 'Amount' },
    { key: 'meetingDate', label: 'Meeting Date' },
    { key: 'status', label: 'Status' },
  ]

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Sr No.</th>
              {columns.map((col) => (
                <th key={col.key} className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id} className="bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 align-middle">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 rounded-md text-primary-700 text-sm font-medium dark:bg-indigo-900/30">{index + 1}</span>
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.accountCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.accountName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.noOfShares}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.amount}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.meetingDate}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">
                    <StatusPill label={row.status} tone={row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'neutral' : 'rejected'} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
