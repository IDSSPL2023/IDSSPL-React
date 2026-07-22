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
import { GlobalTable, StatusBadge } from "@/components/common";
import type { ColumnDef, TableAction, TableActionMenuItem } from "@/components/common";

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
  renderMenuItems?: (row: UserRow) => TableActionMenuItem[];
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
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
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

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = useMemo(() => {
    if (!filters) return rows;
    return rows.filter((r) => {
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
    if (!sortKey) return filteredRows;
    const key = sortKey as keyof UserRow;
    const sorted = [...filteredRows].sort((a, b) => {
      const aVal = String(a[key] ?? "").toLowerCase();
      const bVal = String(b[key] ?? "").toLowerCase();
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredRows, sortKey, sortAsc]);

  const handleToggleStatus = (row: UserRow) => {
    setRows((prev) =>
      prev.map((r) =>
        r.sr === row.sr ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r
      )
    );
  };

  const handleSubmitStatus = (status: UserStatus) => {
    if (!statusRow) return;
    setRows((prev) => prev.map((r) => (r.sr === statusRow.sr ? { ...r, status } : r)));
    setStatusRow(null);
  };

  const openFieldEdit = (sr: number, fieldType: FieldType) => setEditState({ sr, fieldType });
  const closeFieldEdit = () => setEditState(null);

  const editingRow = editState ? rows.find((r) => r.sr === editState.sr) : null;
  const editingValue =
    editingRow && editState ? (editState.fieldType === "mobile" ? editingRow.phone : editingRow.email) : "";

  const handleSubmitFieldEdit = (newValue: string) => {
    if (!editState) return;
    setRows((prev) =>
      prev.map((r) => {
        if (r.sr !== editState.sr) return r;
        return editState.fieldType === "mobile" ? { ...r, phone: newValue } : { ...r, email: newValue };
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

  const columns: ColumnDef<UserRow>[] = [
    {
      key: "code",
      header: tRaw("userMaster.table.userDetails"),
      sortable: true,
      render: (r) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-black dark:text-slate-100">{r.code}</span>
          <ContactLine icon={Phone} value={r.phone} onEdit={() => openFieldEdit(r.sr, "mobile")} />
          <ContactLine icon={Mail} value={r.email} onEdit={() => openFieldEdit(r.sr, "email")} />
        </div>
      ),
    },
    {
      key: "status",
      header: tRaw("userMaster.table.status"),
      sortable: true,
      render: (r) => (
        <StatusBadge
          label={r.status}
          tone={r.status === "Active" ? "success" : "neutral"}
          onClick={statusEditable ? () => setStatusRow(r) : undefined}
        />
      ),
    },
    { key: "name", header: tRaw("userMaster.table.userName"), sortable: true },
    { key: "role", header: tRaw("userMaster.table.userRole"), sortable: true },
    { key: "createdBy", header: tRaw("userMaster.table.createdBy"), sortable: true },
    { key: "date", header: tRaw("userMaster.table.createdDate"), sortable: true },
    { key: "branchCode", header: tRaw("userMaster.table.branchCode"), sortable: true },
    { key: "branchName", header: tRaw("userMaster.table.branchName"), sortable: true },
  ];

  const defaultActions: TableAction<UserRow>[] = [
    { key: "view", label: tRaw("common.view"), icon: Eye, onClick: handleView },
    { key: "edit", label: tRaw("common.edit"), icon: SquarePenIcon, onClick: handleEdit },
    { key: "setPassword", label: tRaw("userMaster.table.menuSetPassword"), icon: Lock, onClick: handleSetPassword },
    { key: "setOtp", label: tRaw("userMaster.table.menuSetOtp"), icon: KeyRound, onClick: handleSetOtp },
    { key: "toggleStatus", label: tRaw("userMaster.table.menuToggleStatus"), icon: Power, onClick: handleToggleStatus },
  ];

  return (
    <div>
      <GlobalTable<UserRow>
        columns={columns}
        rows={sortedRows}
        rowKey={(r) => r.sr}
        actions={renderMenuItems ? undefined : defaultActions}
        renderRowActions={renderMenuItems}
        actionsHeader={tRaw("userMaster.table.action")}
        srNoHeader={tRaw("userMaster.table.srNo")}
        sortKey={sortKey}
        sortDirection={sortAsc ? "asc" : "desc"}
        onSortChange={handleSort}
        minWidth="1200px"
      />

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
        onSubmit={() => {
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
