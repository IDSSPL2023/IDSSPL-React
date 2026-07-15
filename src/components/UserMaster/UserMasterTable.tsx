import { useMemo, useState } from "react";
import {
  Phone,
  Mail,
  SquarePenIcon,
  Eye,
  KeyRound,
  Lock,
  Power,
  type LucideIcon,
} from "lucide-react";
import UserDetailsModal from "./UserDetailsModal";
import EditMobileEmailModal from "../common/EditMobileEmailModal";
import StatusChangeModal from "./StatusChangeModal";
import SetUserPasswordModal, { type SetUserPasswordData } from "./SetUserPassword";
import SetOtpModal, { type SetOtpData } from "./SetOTP";
import { type UserFilters } from "./FilterModal";
import { useBilingual } from "@/i18n/useBilingual";
import RowActionMenu, { type RowActionMenuItem } from "../shared/RowActionMenu";
import SrNoBadge from "../shared/SrNoBadge";
import StatusPill from "../shared/StatusPill";
import SortableHeaderLabel from "../shared/SortableHeaderLabel";

/* ===================== Types ===================== */

export type UserStatus = "Active" | "Inactive";

export type FieldType = "mobile" | "email";

export interface UserRow {
  sr: number;
  code: string;
  phone: string;
  email: string;
  status: UserStatus;
  name: string;
  role: string;
  createdBy: string;
  date: string;
  branchCode: string;
  branchName: string;
  // Optional fields referenced when mapping a row to modal form data
  customerId?: string;
  employeeCode?: string;
}

export type SortableRowKey = Extract<
  keyof UserRow,
  "code" | "status" | "name" | "role" | "createdBy" | "date" | "branchCode" | "branchName"
>;

interface ColumnDef {
  key: string;
  labelKey: string;
  sortable: boolean;
  sortKey?: SortableRowKey;
}

type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortableRowKey;
  direction: SortDirection;
}

interface EditState {
  sr: number;
  fieldType: FieldType;
}

type ModalMode = "view" | "edit";

interface ModalState {
  mode: ModalMode;
  row: UserRow;
}

export interface UserFormData {
  userId: string;
  userName: string;
  customerId: string;
  employeeCode: string;
  branchCode: string;
  branchName: string;
  mobileNumber: string;
  emailId: string;
}

const columns: ColumnDef[] = [
  { key: "srNo", labelKey: "userMaster.table.srNo", sortable: false },
  { key: "action", labelKey: "userMaster.table.action", sortable: false },
  { key: "userDetails", labelKey: "userMaster.table.userDetails", sortable: true, sortKey: "code" },
  { key: "status", labelKey: "userMaster.table.status", sortable: true, sortKey: "status" },
  { key: "name", labelKey: "userMaster.table.userName", sortable: true, sortKey: "name" },
  { key: "role", labelKey: "userMaster.table.userRole", sortable: true, sortKey: "role" },
  { key: "createdBy", labelKey: "userMaster.table.createdBy", sortable: true, sortKey: "createdBy" },
  { key: "date", labelKey: "userMaster.table.createdDate", sortable: true, sortKey: "date" },
  { key: "branchCode", labelKey: "userMaster.table.branchCode", sortable: true, sortKey: "branchCode" },
  { key: "branchName", labelKey: "userMaster.table.branchName", sortable: true, sortKey: "branchName" },
];

export const ROWS: UserRow[] = [
  { sr: 1, code: "AMT", phone: "8989567890", email: "akshay@gmail.com", status: "Active", name: "Appana M Telagi", role: "Administrator", createdBy: "Head Office", date: "26-Jun-2026", branchCode: "0002", branchName: "Bilagi" },
  { sr: 2, code: "POS", phone: "2345678901", email: "priya.singh@example.com", status: "Active", name: "Priya Om Singh", role: "Clerk", createdBy: "Head Office", date: "15-Dec-2025", branchCode: "0003", branchName: "Dharwad" },
  { sr: 3, code: "JHD", phone: "3456789012", email: "john.doe@mail.com", status: "Active", name: "John Harry Doe", role: "Officer", createdBy: "Head Office", date: "10-Jan-2026", branchCode: "0004", branchName: "Hubli" },
  { sr: 4, code: "SSC", phone: "4567890123", email: "sara.connor@domain.com", status: "Active", name: "Sara Smith Connor", role: "Clerk", createdBy: "Head Office", date: "05-Mar-2024", branchCode: "0005", branchName: "Bagalkot" },
  { sr: 5, code: "MSJ", phone: "5678901234", email: "mike.jones@web.com", status: "Active", name: "Mike Smith Jones", role: "Officer", createdBy: "Admin", date: "20-Jul-2023", branchCode: "0006", branchName: "Gadag" },
  { sr: 6, code: "LDB", phone: "6789012345", email: "linda.brown@service.com", status: "Active", name: "Linda David Brown", role: "Clerk", createdBy: "Admin", date: "30-Nov-2025", branchCode: "0007", branchName: "Koppal" },
  { sr: 7, code: "JSB", phone: "7890123456", email: "james.smith@work.net", status: "Active", name: "James Smith Brown", role: "Clerk", createdBy: "Admin", date: "12-Aug-2024", branchCode: "0008", branchName: "Vijayapura" },
  { sr: 8, code: "KWB", phone: "8901234567", email: "karen.williams@co.com", status: "Active", name: "Karen Williams Brown", role: "Officer", createdBy: "Admin", date: "22-Apr-2026", branchCode: "0009", branchName: "Haveri" },
  { sr: 9, code: "DJB", phone: "9012345678", email: "david.johnson@place.org", status: "Active", name: "David Johnson Brown", role: "Officer", createdBy: "Admin", date: "18-Sep-2023", branchCode: "0010", branchName: "Chitradurga" },
];

/* ===================== ContactLine ===================== */

interface ContactLineProps {
  icon: LucideIcon;
  value: string;
  onEdit: () => void;
}

export function ContactLine({ icon: Icon, value, onEdit }: ContactLineProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-primary">
      <Icon size={14} className="text-black shrink-0 dark:text-slate-300" />
      <span className="truncate">{value}</span>
      <button type="button" onClick={onEdit} className="text-primary hover:text-primary-700" aria-label="Edit">
        <SquarePenIcon size={16} />
      </button>
    </span>
  );
}

/* ===================== UserTable ===================== */

export interface UserTableProps {
  rows?: UserRow[];
  filters?: UserFilters;
  onView?: (row: UserRow) => void;
  onEdit?: (row: UserRow) => void;
  onSetOtp?: (row: UserRow) => void;
  onSetPassword?: (row: UserRow) => void;
  /** Overrides the default View/Edit/SetPassword/SetOtp/ToggleStatus row menu (e.g. for an Authorize workflow). */
  renderMenuItems?: (row: UserRow) => RowActionMenuItem[];
  /** Whether clicking the Status pill opens the Status change modal. Defaults to true; the Authorization screen turns this off. */
  statusEditable?: boolean;
}

export default function UserMasterTable({
  rows: initialRows = ROWS,
  filters,
  onView,
  onEdit,
  onSetOtp,
  onSetPassword,
  renderMenuItems,
  statusEditable = true,
}: UserTableProps) {
  const { tRaw } = useBilingual();
  const [rows, setRows] = useState<UserRow[]>(initialRows);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [passwordRow, setPasswordRow] = useState<UserRow | null>(null);
  const [otpRow, setOtpRow] = useState<UserRow | null>(null);
  const [statusRow, setStatusRow] = useState<UserRow | null>(null);

  const rowToFormData = (row: UserRow): UserFormData => ({
    userId: row.code,
    userName: row.name,
    customerId: row.customerId ?? "",
    employeeCode: row.employeeCode ?? "",
    branchCode: row.branchCode,
    branchName: row.branchName,
    mobileNumber: row.phone,
    emailId: row.email,
  });

  const handleSort = (col: ColumnDef) => {
    if (!col.sortable || !col.sortKey) return;
    const sortKey = col.sortKey;
    setSortConfig((prev) => {
      if (!prev || prev.key !== sortKey) {
        return { key: sortKey, direction: "asc" };
      }
      if (prev.direction === "asc") return { key: sortKey, direction: "desc" };
      return null; // third click clears sorting
    });
  };

  const filteredRows = useMemo(() => {
    if (!filters) return rows;
    return rows.filter((r) => {
      // if (filters.userName && !r.name.toLowerCase().includes(filters.userName.toLowerCase())) return false;
      if (filters.userId && !r.code.toLowerCase().includes(filters.userId.toLowerCase())) return false;
      if (filters.role && r.role.toLowerCase() !== filters.role.toLowerCase()) return false;
      if (filters.createdDate) {
        const rowDate = new Date(r.date);
        const filterDate = new Date(filters.createdDate);
        if (
          rowDate.getFullYear() !== filterDate.getFullYear() ||
          rowDate.getMonth() !== filterDate.getMonth() ||
          rowDate.getDate() !== filterDate.getDate()
        )
          return false;
      }
      if (filters.status && r.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      return true;
    });
  }, [rows, filters]);

  const sortedRows = useMemo(() => {
    if (!sortConfig) return filteredRows;
    const { key, direction } = sortConfig;
    const sorted = [...filteredRows].sort((a, b) => {
      const aVal = String(a[key] ?? "").toLowerCase();
      const bVal = String(b[key] ?? "").toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredRows, sortConfig]);

  const handleToggleStatus = (row: UserRow) => {
    setRows((prev) =>
      prev.map((r) =>
        r.sr === row.sr
          ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" }
          : r
      )
    );
  };

  const handleSubmitStatus = (status: UserStatus) => {
    if (!statusRow) return;
    setRows((prev) => prev.map((r) => (r.sr === statusRow.sr ? { ...r, status } : r)));
    setStatusRow(null);
  };

  const openFieldEdit = (sr: number, fieldType: FieldType) =>
    setEditState({ sr, fieldType });
  const closeFieldEdit = () => setEditState(null);

  const editingRow = editState ? rows.find((r) => r.sr === editState.sr) : null;
  const editingValue =
    editingRow && editState
      ? editState.fieldType === "mobile"
        ? editingRow.phone
        : editingRow.email
      : "";

  const handleSubmitFieldEdit = (newValue: string) => {
    if (!editState) return;
    setRows((prev) =>
      prev.map((r) => {
        if (r.sr !== editState.sr) return r;
        return editState.fieldType === "mobile"
          ? { ...r, phone: newValue }
          : { ...r, email: newValue };
      })
    );
  };

  const handleView = (row: UserRow) => {
    setModalState({ mode: "view", row });
    onView?.(row);
  };

  const handleEdit = (row: UserRow) => {
    setModalState({ mode: "edit", row });
    onEdit?.(row);
  };

  const handleSetPassword = (row: UserRow) => {
    setPasswordRow(row);
    onSetPassword?.(row);
  };

  const handleSubmitPassword = (_data: SetUserPasswordData) => {
    // hook up API call to persist the new password here
    setPasswordRow(null);
  };

  const handleSetOtp = (row: UserRow) => {
    setOtpRow(row);
    onSetOtp?.(row);
  };

  const handleSubmitOtp = (_data: SetOtpData) => {
    // hook up API call to persist the generated OTP here
    setOtpRow(null);
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary rounded-t-xl">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={`text-left text-[16px] font-semibold text-white px-4 py-2 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <SortableHeaderLabel label={tRaw(col.labelKey)} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((r, idx) => (
              <tr
                key={r.sr}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} hover:bg-gray-50 dark:hover:bg-slate-800`}
              >
                <td className="px-6 py-3">
                  <SrNoBadge value={r.sr} />
                </td>
                <td className="px-6 py-3">
                  <RowActionMenu
                    items={
                      renderMenuItems
                        ? renderMenuItems(r)
                        : [
                            { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => handleView(r) },
                            { key: "edit", label: tRaw("common.edit"), icon: SquarePenIcon, onClick: () => handleEdit(r) },
                            { key: "setPassword", label: tRaw("userMaster.table.menuSetPassword"), icon: Lock, onClick: () => handleSetPassword(r) },
                            { key: "setOtp", label: tRaw("userMaster.table.menuSetOtp"), icon: KeyRound, onClick: () => handleSetOtp(r) },
                            { key: "toggleStatus", label: tRaw("userMaster.table.menuToggleStatus"), icon: Power, onClick: () => handleToggleStatus(r) },
                          ]
                    }
                  />
                </td>
                <td className="px-6 py-3 text-[16px] text-primary">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-black dark:text-slate-100">{r.code}</span>
                    <ContactLine icon={Phone} value={r.phone} onEdit={() => openFieldEdit(r.sr, "mobile")} />
                    <ContactLine icon={Mail} value={r.email} onEdit={() => openFieldEdit(r.sr, "email")} />
                  </div>
                </td>
                <td className="px-6 py-3">
                  {statusEditable ? (
                    <button type="button" onClick={() => setStatusRow(r)} className="cursor-pointer">
                      <StatusPill label={r.status} tone={r.status === "Active" ? "success" : "neutral"} />
                    </button>
                  ) : (
                    <StatusPill label={r.status} tone={r.status === "Active" ? "success" : "neutral"} />
                  )}
                </td>
                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">{r.name}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">{r.role}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">{r.createdBy}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">{r.date}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">{r.branchCode}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">{r.branchName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditMobileEmailModal
        open={!!editState}
        fieldType={editState?.fieldType}
        initialValue={editingValue}
        userId={editingRow?.code}
        userName={editingRow?.name}
        onClose={closeFieldEdit}
        onSubmit={handleSubmitFieldEdit}
      />

      <UserDetailsModal
        open={!!modalState}
        mode={modalState?.mode}
        initialData={modalState ? rowToFormData(modalState.row) : undefined}
        onClose={() => setModalState(null)}
        onSubmit={(updatedData: UserFormData) => {
          // persist updatedData back into your rows state here
        }}
      />

      <SetUserPasswordModal
        open={!!passwordRow}
        userId={passwordRow?.code}
        userName={passwordRow?.name}
        onClose={() => setPasswordRow(null)}
        onSubmit={handleSubmitPassword}
      />

      <SetOtpModal
        open={!!otpRow}
        userId={otpRow?.code}
        userName={otpRow?.name}
        onClose={() => setOtpRow(null)}
        onSubmit={handleSubmitOtp}
      />

      <StatusChangeModal
        open={!!statusRow}
        currentStatus={statusRow?.status}
        onClose={() => setStatusRow(null)}
        onSubmit={handleSubmitStatus}
      />
    </div>
  );
}
