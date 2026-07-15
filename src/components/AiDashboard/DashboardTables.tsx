import type { DashboardTable } from "./types";

const DashboardTables = ({ tables }: { tables: DashboardTable[] }) => {
  if (!tables?.length) return null;

  return (
    <div className="flex flex-col gap-4">
      {tables.map((table) => (
        <div
          key={table.title}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="mb-3 text-sm font-semibold text-[#0B0B0B] dark:text-white">{table.title}</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#e1e0d9] dark:border-slate-800">
                  {table.columns.map((col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap px-3 py-2 text-left text-xs font-medium text-[#898781]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#e1e0d9] last:border-0 dark:border-slate-800/60"
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="whitespace-nowrap px-3 py-2 tabular-nums text-[#0B0B0B] dark:text-white"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardTables;
