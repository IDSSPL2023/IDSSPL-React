type PermissionCheckboxListProps = {
  permissions: string[];
  selectedPermissions: string[];
  onChange: (selected: string[]) => void;
};

export default function PermissionCheckboxList({
  permissions,
  selectedPermissions,
  onChange,
}: PermissionCheckboxListProps) {
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
