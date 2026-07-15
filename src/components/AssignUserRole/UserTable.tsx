import { useState, useMemo } from "react";
import {
  Phone,
  Mail,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SearchFilterBar from "./SearchFilterBar";
import FilterModal, { type UserRoleFilters } from "./FilterModal";
import type { SelectedUser } from "./RoleAssignmentForm";
import { useBilingual } from "@/i18n/useBilingual";
import SrNoBadge from "../shared/SrNoBadge";
import SortableHeaderLabel from "../shared/SortableHeaderLabel";

export type UserRow = {
  srNo: number;
  shortName: string;
  phone: string;
  email: string;
  userName: string;
  userId: string;
  assigned: boolean;
  role?: string;
};

const newUsers: UserRow[] = Array.from({ length: 5 }, (_, i) => ({
  srNo: i + 1,
  shortName: "AMT",
  phone: "9876543210",
  email: "amt@example.com",
  userName: "Appana M Telgi",
  userId: `00${i + 1}`,
  assigned: false,
}));

const modifiedUsers: UserRow[] = Array.from({ length: 10 }, (_, i) => ({
  srNo: i + 1,
  shortName: "AMT",
  phone: "9876543210",
  email: "amt@example.com",
  userName: "Appana M Telgi",
  userId: `00${i + 1}`,
  assigned: true,
  role: "Officer",
}));

type TabType = "new" | "modify";

type UserTableProps = {
  onUserSelect: (user: SelectedUser) => void;
  onRoleAssigned?: (userId: string, role: string) => void;
  currentNewUsers?: UserRow[];
  currentModifiedUsers?: UserRow[];
  setCurrentNewUsers?: React.Dispatch<React.SetStateAction<UserRow[]>>;
  setCurrentModifiedUsers?: React.Dispatch<React.SetStateAction<UserRow[]>>;
};

const PAGINATION_ITEMS: (number | "ellipsis")[] = [
  1,
  "ellipsis",
  98,
  99,
  100,
  101,
  102,
  103,
  "ellipsis",
  125,
];

export default function UserTable({ 
  onUserSelect, 
  onRoleAssigned,
  currentNewUsers,
  currentModifiedUsers,
  setCurrentNewUsers,
  setCurrentModifiedUsers 
}: UserTableProps) {
  const { tRaw } = useBilingual();
  const [activeTab, setActiveTab] = useState<TabType>("modify");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<UserRoleFilters>({
    userName: "",
    userId: "",
    status: "",
  });
  const [selectedRow, setSelectedRow] = useState<number | null>(1);
  const [currentPage, setCurrentPage] = useState(101);
  const [sortAsc, setSortAsc] = useState(true);
  
  const usersNew = currentNewUsers ?? newUsers;
  const usersModified = currentModifiedUsers ?? modifiedUsers;
  const setUsersNew = setCurrentNewUsers ?? (() => {});
  const setUsersModified = setCurrentModifiedUsers ?? (() => {});

  const filteredUsers = useMemo(() => {
    let result = activeTab === "new" ? [...usersNew] : [...usersModified];

    // if (filters.userName.trim()) {
    //   const q = filters.userName.toLowerCase();
    //   result = result.filter((u) => u.userName.toLowerCase().includes(q));
    // }

    if (filters.userId.trim()) {
      result = result.filter((u) => u.userId.includes(filters.userId));
    }

    result.sort((a, b) =>
      sortAsc
        ? a.userName.localeCompare(b.userName)
        : b.userName.localeCompare(a.userName)
    );

    return result;
  }, [filters, sortAsc, activeTab, usersNew, usersModified]);

  const handleRowClick = (user: UserRow) => {
    setSelectedRow(user.srNo);
    onUserSelect({
      userId: user.userId,
      userName: user.userName,
      userRole: user.role || "Officer",
    });
  };

  const moveUserToModified = (userId: string, role: string) => {
    const userIndex = usersNew.findIndex((u) => u.userId === userId);
    if (userIndex !== -1) {
      const user = usersNew[userIndex];
      const updatedUser = { ...user, assigned: true, role };
      setUsersNew((prev) => prev.filter((u) => u.userId !== userId));
      setUsersModified((prev) => [...prev, updatedUser]);
    }
  };

  const handleFilterApply = (newFilters: UserRoleFilters) => {
    setFilters(newFilters);
  };

  const tabClass = (tab: TabType) =>
    activeTab === tab
      ? "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
      : "px-2 py-2 text-sm font-medium text-gray-800 hover:text-primary dark:text-slate-300";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-primary/30 bg-white shadow-sm dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("new")}
            className={tabClass("new")}
          >
            {tRaw("assignUserRole.tabs.newUserRole")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("modify")}
            className={tabClass("modify")}
          >
            {tRaw("assignUserRole.tabs.modifyUserRole")}
          </button>
        </div>

        <SearchFilterBar onOpenFilter={() => setIsFilterOpen(true)} />
      </div>

      <div className="flex-1 overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                {tRaw("assignUserRole.table.srNo")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-white"
                onClick={() => setSortAsc(!sortAsc)}
              >
                <SortableHeaderLabel label={tRaw("assignUserRole.table.userDetails")} sortable />
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-white"
                onClick={() => setSortAsc(!sortAsc)}
              >
                <SortableHeaderLabel label={tRaw("assignUserRole.table.userName")} sortable />
              </th>
              {activeTab === "modify" && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  {tRaw("assignUserRole.table.role")}
                </th>
              )}
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                {tRaw("assignUserRole.table.assigned")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr
                key={user.srNo}
                onClick={() => handleRowClick(user)}
                className={`cursor-pointer transition-colors ${
                  selectedRow === user.srNo ? "bg-primary-50" : "hover:bg-gray-50 dark:hover:bg-slate-800"
                } ${idx !== filteredUsers.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""}`}
              >
                <td className="px-4 py-3">
                  <SrNoBadge value={user.srNo} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-[#black] dark:text-slate-100">
                      {user.shortName}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#black] dark:text-slate-300">
                      <Phone size={11} className="text-[#black] dark:text-slate-300" />
                      <span className="text-primary">{user.phone}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#black] dark:text-slate-300">
                      <Mail size={11} className="text-[#black] dark:text-slate-300" />
                      <span className="text-primary">{user.email}</span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300">{user.userName}</td>
                {activeTab === "modify" && (
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300">{user.role}</td>
                )}
                <td className="px-4 py-3">
                  {activeTab === "new" ? (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 dark:bg-red-900/30">
                      <AlertTriangle size={16} className="text-red-500 dark:text-red-400" />
                    </span>
                  ) : (
                    user.assigned && (
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-green-50 dark:bg-green-900/30">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 dark:text-green-400"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-gray-100 px-4 py-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft size={15} />
          {tRaw("assignUserRole.pagination.back")}
        </button>

        {PAGINATION_ITEMS.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-gray-500 dark:text-slate-500"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => setCurrentPage(item)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium ${
                currentPage === item
                  ? "bg-primary text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => setCurrentPage((p) => p + 1)}
          className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {tRaw("assignUserRole.pagination.next")}
          <ChevronRight size={15} />
        </button>
      </div>

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              onClose={() => setIsFilterOpen(false)}
              onApply={handleFilterApply}
              initialValues={filters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
