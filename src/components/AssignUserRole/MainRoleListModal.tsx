import { useState, useMemo } from "react";
import { X, Search } from "lucide-react";

export type MainRole = {
  id: string;
  name: string;
};

const defaultRoles: MainRole[] = [
  { id: "01", name: "Officer" },
  { id: "02", name: "Manager" },
  { id: "03", name: "MIS Activity" },
  { id: "04", name: "Clerk" },
  { id: "05", name: "HO Clerk" },
  { id: "06", name: "Cashier" },
  { id: "07", name: "Stationary" },
  { id: "08", name: "Shares" },
  { id: "09", name: "Reports" },
  { id: "10", name: "Daily Reports" },
];

type MainRoleListModalProps = {
  onClose: () => void;
  onSelect: (role: MainRole) => void;
  roles?: MainRole[];
};

export default function MainRoleListModal({
  onClose,
  onSelect,
  roles = defaultRoles,
}: MainRoleListModalProps) {
  const [search, setSearch] = useState("");

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return roles;
    return roles.filter(
      (role) =>
        role.id.toLowerCase().includes(query) ||
        role.name.toLowerCase().includes(query)
    );
  }, [roles, search]);

  return (
    <div className="relative w-full min-w-[600px] overflow-hidden rounded-2xl border-2 border-primary bg-white p-6 shadow-xl dark:bg-slate-900">
      <div className="pointer-events-none absolute -top-8 right-8 h-32 w-32 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />

      <div className="relative z-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Main Role List</h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 dark:bg-slate-800">
            <Search size={15} className="text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-32 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none sm:w-40 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-5 overflow-hidden rounded-2xl border border-[#DCEBFC] dark:border-slate-800">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#DCEBFC] dark:bg-slate-800">
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-800 dark:text-slate-100">
                Main Role ID
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-800 dark:text-slate-100">
                Role
              </th>
              <th className="px-5 py-3 text-right text-sm font-semibold text-gray-800 dark:text-slate-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role, idx) => (
              <tr
                key={role.id}
                className={
                  idx !== filteredRoles.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""
                }
              >
                <td className="px-5 py-3">
                  <span className="inline-flex min-w-[36px] items-center justify-center rounded-lg bg-[#E8F1FD] px-3 py-1 text-sm font-semibold text-primary dark:bg-slate-800">
                    {role.id}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-700 dark:text-slate-300">{role.name}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(role);
                      onClose();
                    }}
                    className="rounded-lg bg-[#E8F1FD] px-5 py-1.5 text-sm font-medium text-primary transition hover:bg-[#DCEBFC] dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
