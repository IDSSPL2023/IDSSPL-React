import { ArrowLeft, Home, ChevronRight, X, Search, UserRound, UserCheck, MoreVertical, IdCard, Filter as FilterIcon, User, ShieldCheck, Filter, Phone, Mail, AlertTriangle, ChevronLeft } from "lucide-react";
import { useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import { useBilingual } from "@/i18n/useBilingual";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";

/* ===== from NavbarAUR.tsx ===== */
type NavbarAUR_BreadcrumbItem = {
  label: string;
  href?: string;
};

type NavbarAUR_NavbarAURProps = {
  titleEn: string;
  titleHi: string;
  breadcrumbs?: NavbarAUR_BreadcrumbItem[];
  onBack?: () => void;
};

type NavbarAUR_BreadcrumbProps = {
  label: string;
  isLast: boolean;
  isFirst: boolean;
  href?: string;
};

function NavbarAUR({
  titleEn,
  titleHi,
  breadcrumbs = [],
  onBack,
}: NavbarAUR_NavbarAURProps) {
  const Breadcrumb = ({ label, isLast, isFirst, href }: NavbarAUR_BreadcrumbProps) => (
    <div className="flex items-center gap-1">
      {!isFirst && <ChevronRight size={14} className="text-gray-400 dark:text-slate-500" />}
      <a
        href={href || "#"}
        className={`flex items-center gap-1 text-sm ${
          isLast ? "font-[400] text-primary" : "text-[#99A1AF] hover:text-primary dark:text-slate-500"
        }`}
      >
        {isFirst && <Home size={14} />}
        {label}
      </a>
    </div>
  );

  return (
    <div className="w-full border-b border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-700"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-[#1C398E] dark:text-slate-100">
                {titleEn}
                <span className="mx-2 font-normal">|</span>
                <span>{titleHi}</span>
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                {breadcrumbs.map((crumb, idx) => (
                  <Breadcrumb
                    key={idx}
                    label={crumb.label}
                    href={crumb.href}
                    isFirst={idx === 0}
                    isLast={idx === breadcrumbs.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ===== from MainRoleListModal.tsx ===== */
export type MainRoleListModal_MainRole = {
  id: string;
  name: string;
};

const MainRoleListModal_defaultRoles: MainRoleListModal_MainRole[] = [
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

type MainRoleListModal_MainRoleListModalProps = {
  onClose: () => void;
  onSelect: (role: MainRoleListModal_MainRole) => void;
  roles?: MainRoleListModal_MainRole[];
};

function MainRoleListModal({
  onClose,
  onSelect,
  roles = MainRoleListModal_defaultRoles,
}: MainRoleListModal_MainRoleListModalProps) {
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


/* ===== from ModuleToggleList.tsx ===== */
export type ModuleToggleList_ModuleItem = {
  id: string;
  name: string;
  enabled: boolean;
};

type ModuleToggleList_ModuleToggleListProps = {
  modules: ModuleToggleList_ModuleItem[];
  activeModuleId: string;
  onModuleSelect: (moduleId: string) => void;
  onModuleToggle: (moduleId: string, enabled: boolean) => void;
};

function ModuleToggleList({
  modules,
  activeModuleId,
  onModuleSelect,
  onModuleToggle,
}: ModuleToggleList_ModuleToggleListProps) {
  return (
    <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] h-full dark:bg-slate-900">
      <div className="flex h-full flex-col gap-2 pr-1">
        {modules.map((module) => {
          const isActive = activeModuleId === module.id;
          return (
            <div
              key={module.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                isActive
                  ? "border-primary bg-[#E8F1FD] dark:bg-slate-800"
                  : "border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900"
              }`}
            >
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={module.enabled}
                  onChange={(e) => onModuleToggle(module.id, e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full dark:bg-slate-700" />
              </label>
              <button
                type="button"
                onClick={() => onModuleSelect(module.id)}
                className="flex-1 text-left text-sm font-medium text-gray-800 dark:text-slate-200"
              >
                {module.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ===== from PermissionCheckboxList.tsx ===== */
type PermissionCheckboxList_PermissionCheckboxListProps = {
  permissions: string[];
  selectedPermissions: string[];
  onChange: (selected: string[]) => void;
};

function PermissionCheckboxList({
  permissions,
  selectedPermissions,
  onChange,
}: PermissionCheckboxList_PermissionCheckboxListProps) {
  const selectAll =
    permissions.length > 0 &&
    permissions.every((p) => selectedPermissions.includes(p));

  const handleSelectAll = (checked: boolean) => {
    onChange(checked ? [...permissions] : []);
  };

  const handleToggle = (permission: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissions, permission]);
    } else {
      onChange(selectedPermissions.filter((p) => p !== permission));
    }
  };

  return (
    <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] h-full dark:bg-slate-900">
      <label className="mb-3 flex cursor-pointer items-center gap-2.5 border-b border-gray-100 pb-3 dark:border-slate-800">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">Select All</span>
      </label>

      <div className="flex h-full flex-col gap-1.5">
        {permissions.map((permission) => (
          <label
            key={permission}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 hover:bg-[#F8FBFF] dark:hover:bg-slate-800"
          >
            <input
              type="checkbox"
              checked={selectedPermissions.includes(permission)}
              onChange={(e) => handleToggle(permission, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700 dark:text-slate-300">{permission}</span>
          </label>
        ))}
      </div>
    </div>
  );
}


/* ===== from RoleAssignmentForm.tsx ===== */
const RoleAssignmentForm_modulePermissions: Record<string, string[]> = {
  account_closing: ["Account Closing View", "Account Closing Process"],
  application: [
    "Application View",
    "Application Create",
    "Application Modify",
    "Application Approve",
  ],
  bills: ["Bills View", "Bills Create", "Bills Modify"],
  branch: ["Branch View", "Branch Create", "Branch Modify"],
  clearing: ["Clearing View", "Clearing Process"],
  customer: ["Customer View", "Customer Create", "Customer Modify"],
  locker: ["Locker View", "Locker Assign", "Locker Release"],
  queries: ["Queries View", "Queries Execute"],
  account: [
    "Account Freeze Revoke",
    "Account Memo",
    "Account Modification",
    "Add Insurance Details",
    "Lein Mark",
    "Lein Revoke",
    "Cheque Book Issue",
    "Stop Cheque Payment",
    "New Standing Instruction",
  ],
};

const RoleAssignmentForm_defaultModules: ModuleToggleList_ModuleItem[] = [
  { id: "account_closing", name: "Account Closing", enabled: false },
  { id: "application", name: "Application", enabled: false },
  { id: "bills", name: "Bills", enabled: false },
  { id: "branch", name: "Branch", enabled: false },
  { id: "clearing", name: "Clearing", enabled: false },
  { id: "customer", name: "Customer", enabled: false },
  { id: "locker", name: "Locker", enabled: false },
  { id: "queries", name: "Queries", enabled: false },
  { id: "account", name: "Account", enabled: true },
];

export type RoleAssignmentForm_SelectedUser = {
  userId: string;
  userName: string;
  userRole: string;
};

type RoleAssignmentForm_RoleAssignmentFormProps = {
  selectedUser: RoleAssignmentForm_SelectedUser | null;
  onRoleAssigned?: (userId: string, role: string) => void;
};

function RoleAssignmentForm({ selectedUser, onRoleAssigned }: RoleAssignmentForm_RoleAssignmentFormProps) {
  const [userRole, setUserRole] = useState("Officer");
  const [isRoleListOpen, setIsRoleListOpen] = useState(false);
  const [modules, setModules] = useState<ModuleToggleList_ModuleItem[]>(RoleAssignmentForm_defaultModules);
  const [activeModuleId, setActiveModuleId] = useState("account");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleRoleSelect = (role: MainRoleListModal_MainRole) => {
    setUserRole(role.name);
  };

  const handleSaveRole = () => {
    if (selectedUser && onRoleAssigned) {
      onRoleAssigned(selectedUser.userId, userRole);
    }
  };

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, enabled } : m))
    );
  };

  const handleModuleSelect = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setSelectedPermissions([]);
  };

  const permissions = RoleAssignmentForm_modulePermissions[activeModuleId] ?? [];

  return (
    <>
      <div className="rounded-xl border border-primary/30 bg-white p-5 shadow-sm dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <UserRound size={28} className="text-primary" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
              +
            </span>
          </div>
          <h2 className="text-base font-semibold text-[#1C398E] dark:text-slate-100">
            Assign Role / <span className="font-normal">वापरकर्ता तपशील</span>
          </h2>
        </div>

        <div className="mb-5 rounded-xl border-2 border-primary p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs text-gray-500 dark:text-slate-400">
                User Id / <span className="text-gray-400 dark:text-slate-500">वापरकर्ता आयडी</span>
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800">
                <UserRound size={16} className="text-primary" />
                <span className="text-sm text-gray-700 dark:text-slate-300">
                  {selectedUser?.userId ?? "—"}
                </span>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3"> </div>
              <label className="mb-1.5 block text-xs text-gray-500 dark:text-slate-400">
                Username / <span className="text-gray-400 dark:text-slate-500">आडनाव</span>
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800">
                <IdCard size={16} className="text-primary" />
                <span className="text-sm text-gray-700 dark:text-slate-300">
                  {selectedUser?.userName ?? "—"}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-gray-500 dark:text-slate-400">
                User Role / <span className="text-gray-400 dark:text-slate-500">वापरकर्ता भूमिका</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                  <UserCheck size={16} className="shrink-0 text-primary" />
                  <span className="text-sm text-gray-700 dark:text-slate-300">{userRole}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRoleListOpen(true)}
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-primary bg-[#E8F1FD] text-primary transition hover:bg-[#DCEBFC] dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 ">
          <div>
            <ModuleToggleList
              modules={modules}
              activeModuleId={activeModuleId}
              onModuleSelect={handleModuleSelect}
              onModuleToggle={handleModuleToggle}
            />
          </div>

          <div>
            <PermissionCheckboxList
              permissions={permissions}
              selectedPermissions={selectedPermissions}
              onChange={setSelectedPermissions}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveRole}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#0A5BC0]"
          >
            Save Role
          </button>
        </div>
      </div>

      {isRoleListOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsRoleListOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MainRoleListModal
              onClose={() => setIsRoleListOpen(false)}
              onSelect={handleRoleSelect}
            />
          </div>
        </div>
      )}
    </>
  );
}


/* ===== from FilterModal.tsx ===== */
const FilterModal_filterOptions = [
  {
    id: "userName",
    label: "User Name",
    icon: (
      <span className="flex h-5 w-5 items-center justify-center rounded border border-primary text-[10px] font-bold text-primary">
        A
      </span>
    ),
    placeholder: "User Name",
    inputIcon: (
      <span className="flex h-5 w-5 items-center justify-center rounded border border-primary text-[10px] font-bold text-primary">
        A
      </span>
    ),
  },
  {
    id: "userId",
    label: "User ID",
    icon: <User size={18} className="text-primary" />,
    placeholder: "User ID",
    inputIcon: <User size={18} className="text-primary" />,
  },
  {
    id: "status",
    label: "Status",
    icon: <ShieldCheck size={18} className="text-primary" />,
    placeholder: "Status",
    inputIcon: <ShieldCheck size={18} className="text-primary" />,
  },
] as const;

type FilterModal_FilterKey = (typeof FilterModal_filterOptions)[number]["id"];

export type FilterModal_UserRoleFilters = Record<FilterModal_FilterKey, string>;

type FilterModal_FilterModalProps = {
  onClose: () => void;
  onApply: (filters: FilterModal_UserRoleFilters) => void;
  initialValues?: FilterModal_UserRoleFilters;
};

const FilterModal_defaultValues: FilterModal_UserRoleFilters = {
  userName: "",
  userId: "",
  status: "",
};

function FilterModal({
  onClose,
  onApply,
  initialValues = FilterModal_defaultValues,
}: FilterModal_FilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<FilterModal_FilterKey>("userName");
  const [values, setValues] = useState<FilterModal_UserRoleFilters>(initialValues);

  const active = FilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(FilterModal_defaultValues);
    onClose();
  };

  const handleApply = () => {
    onApply(values);
    onClose();
  };

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-primary bg-white p-8 dark:bg-slate-900">
      <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-8 top-8 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <X size={18} />
      </button>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary">
          <FilterIcon size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Filter</h2>
          <p className="text-gray-400 dark:text-slate-500">Use filter for fast and efficient searching</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 border-b border-gray-200 dark:border-slate-800" />

      <div className="relative z-10 mt-8 flex items-start gap-0">
        <div className="flex w-full max-w-[470px] flex-col gap-4">
          {FilterModal_filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <div key={option.id} className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveFilter(option.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-[#E8F1FD] dark:bg-slate-800"
                      : "border-primary bg-white dark:bg-slate-900"
                  }`}
                >
                  {option.icon}
                  <span className="text-lg font-medium text-gray-900 dark:text-slate-100">
                    {option.label}
                  </span>
                </button>

                {isActive && (
                  <div className="absolute -right-9 flex h-10 w-10 items-center justify-center">
                    <div className="h-0 w-0 border-y-[18px] border-l-[24px] border-y-transparent border-l-[#DCEBFC] dark:border-l-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ml-10 w-[800px] rounded-2xl bg-[#DCEBFC] p-6 h-[220px] dark:bg-slate-800">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-slate-100">
            {active?.label}
          </h3>
          {activeFilter === "status" ? (
            <div className="flex items-center gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={values.status === "active"}
                  onChange={() => setValues({ ...values, status: "active" })}
                />
                <span className="ml-2 text-gray-900 dark:text-slate-100">Active</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={values.status === "inactive"}
                  onChange={() => setValues({ ...values, status: "inactive" })}
                />
                <span className="ml-2 text-gray-900 dark:text-slate-100">Inactive</span>
              </label>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-4 py-3 dark:bg-slate-900">
              {active?.inputIcon}
              <input
                type="text"
                value={values[activeFilter]}
                onChange={handleChange}
                placeholder={active?.placeholder}
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-10 flex justify-center gap-4">
        <button
          type="button"
          onClick={handleClearAll}
          className="rounded-full border border-primary px-8 py-3 font-semibold text-primary hover:bg-[#F2F8FE]"
        >
          Clear Alls
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="rounded-full bg-primary px-10 py-3 font-semibold text-white hover:bg-[#0a56aa]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}


/* ===== from SearchFilterBar.tsx ===== */
type SearchFilterBar_SearchFilterBarProps = {
  onOpenFilter: () => void;
  placeholder?: string;
};

function SearchFilterBar({
  onOpenFilter,
  placeholder = "Search/ Filter",
}: SearchFilterBar_SearchFilterBarProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onOpenFilter}
        className="flex w-[220px] items-center gap-2.5 rounded-lg border border-primary bg-white px-3 py-2 transition hover:bg-[#F8FBFF] sm:w-[260px] dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        <Search size={16} className="shrink-0 text-primary" />
        <span className="text-sm text-gray-400 dark:text-slate-500">{placeholder}</span>
      </button>
      <button
        type="button"
        onClick={onOpenFilter}
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-primary bg-white text-primary transition hover:bg-[#F8FBFF] dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        <Filter size={18} />
      </button>
    </div>
  );
}


/* ===== from UserTable.tsx ===== */
export type UserTable_UserRow = {
  srNo: number;
  shortName: string;
  phone: string;
  email: string;
  userName: string;
  userId: string;
  assigned: boolean;
  role?: string;
};

const UserTable_newUsers: UserTable_UserRow[] = Array.from({ length: 5 }, (_, i) => ({
  srNo: i + 1,
  shortName: "AMT",
  phone: "9876543210",
  email: "amt@example.com",
  userName: "Appana M Telgi",
  userId: `00${i + 1}`,
  assigned: false,
}));

const UserTable_modifiedUsers: UserTable_UserRow[] = Array.from({ length: 10 }, (_, i) => ({
  srNo: i + 1,
  shortName: "AMT",
  phone: "9876543210",
  email: "amt@example.com",
  userName: "Appana M Telgi",
  userId: `00${i + 1}`,
  assigned: true,
  role: "Officer",
}));

type UserTable_TabType = "new" | "modify";

type UserTable_UserTableProps = {
  onUserSelect: (user: RoleAssignmentForm_SelectedUser) => void;
  onRoleAssigned?: (userId: string, role: string) => void;
  currentNewUsers?: UserTable_UserRow[];
  currentModifiedUsers?: UserTable_UserRow[];
  setCurrentNewUsers?: React.Dispatch<React.SetStateAction<UserTable_UserRow[]>>;
  setCurrentModifiedUsers?: React.Dispatch<React.SetStateAction<UserTable_UserRow[]>>;
};

const UserTable_PAGINATION_ITEMS: (number | "ellipsis")[] = [
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

function UserTable({ 
  onUserSelect, 
  onRoleAssigned,
  currentNewUsers,
  currentModifiedUsers,
  setCurrentNewUsers,
  setCurrentModifiedUsers 
}: UserTable_UserTableProps) {
  const { tRaw } = useBilingual();
  const [activeTab, setActiveTab] = useState<UserTable_TabType>("modify");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterModal_UserRoleFilters>({
    userName: "",
    userId: "",
    status: "",
  });
  const [selectedRow, setSelectedRow] = useState<number | null>(1);
  const [currentPage, setCurrentPage] = useState(101);
  const [sortAsc, setSortAsc] = useState(true);
  
  const usersNew = currentNewUsers ?? UserTable_newUsers;
  const usersModified = currentModifiedUsers ?? UserTable_modifiedUsers;
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

  const handleRowClick = (user: UserTable_UserRow) => {
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

  const handleFilterApply = (newFilters: FilterModal_UserRoleFilters) => {
    setFilters(newFilters);
  };

  const tabClass = (tab: UserTable_TabType) =>
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

        {UserTable_PAGINATION_ITEMS.map((item, idx) =>
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


/* ===== from AssignUserRole.tsx ===== */
export default function AssignUserRole() {
  const [selectedUser, setSelectedUser] = useState<RoleAssignmentForm_SelectedUser | null>({
    userId: "001",
    userName: "Appana M Telgi",
    userRole: "Officer",
  });
  const [currentNewUsers, setCurrentNewUsers] = useState<UserTable_UserRow[]>(UserTable_newUsers);
  const [currentModifiedUsers, setCurrentModifiedUsers] = useState<UserTable_UserRow[]>(UserTable_modifiedUsers);

  const handleRoleAssigned = (userId: string, role: string) => {
    const userIndex = currentNewUsers.findIndex((u) => u.userId === userId);
    if (userIndex !== -1) {
      const user = currentNewUsers[userIndex];
      const updatedUser = { ...user, assigned: true, role };
      setCurrentNewUsers((prev) => prev.filter((u) => u.userId !== userId));
      setCurrentModifiedUsers((prev) => [...prev, updatedUser]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] dark:bg-slate-950">
      <NavbarAUR
        titleEn="Assign User Role"
        titleHi="कस्टमर मास्टर"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Assign User Role", href: "/assignuserrole" },
        ]}
        onBack={() => window.history.back()}
      />

      <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
        <UserTable 
          onUserSelect={setSelectedUser} 
          currentNewUsers={currentNewUsers}
          currentModifiedUsers={currentModifiedUsers}
          setCurrentNewUsers={setCurrentNewUsers}
          setCurrentModifiedUsers={setCurrentModifiedUsers}
        />
        <RoleAssignmentForm 
          selectedUser={selectedUser} 
          onRoleAssigned={handleRoleAssigned}
        />
      </div>
    </div>
  );
}
