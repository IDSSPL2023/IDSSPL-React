import { useState } from "react";
import {
  Eye,
  SquarePen,
  List,
  Phone,
  Mail,
  Copy,
} from "lucide-react";
import { type CustomerFilters } from "./FilterModal";
import { useBilingual } from "@/i18n/useBilingual";
import RowActionMenu from "../shared/RowActionMenu";
import SrNoBadge from "../shared/SrNoBadge";
import StatusPill from "../shared/StatusPill";
import SortableHeaderLabel from "../shared/SortableHeaderLabel";

export type RowData = {
  srNo: number;
  customerId: string;
  phone: string;
  email: string;
  status: string;
  name: string;
  gender: string;
  dob: string;
  regDate: string;
  categoryCode: string;
  riskCategory: string;
};

const columns = [
  { key: "srNo", labelKey: "customerMaster.table.srNo", sortable: false },
  { key: "action", labelKey: "customerMaster.table.action", sortable: false },
  { key: "customerDetails", labelKey: "customerMaster.table.customerDetails", sortable: false },
  { key: "status", labelKey: "customerMaster.table.status", sortable: true },
  { key: "name", labelKey: "customerMaster.table.name", sortable: true },
  { key: "gender", labelKey: "customerMaster.table.gender", sortable: true },
  { key: "dob", labelKey: "customerMaster.table.dob", sortable: true },
  { key: "regDate", labelKey: "customerMaster.table.regDate", sortable: true },
  { key: "categoryCode", labelKey: "customerMaster.table.categoryCode", sortable: true },
  { key: "riskCategory", labelKey: "customerMaster.table.riskCategory", sortable: true },
] as const;

const rows: RowData[] = [
  { srNo: 1, customerId: "1234567890", phone: "8989567890", email: "Shivappa@gmail.com", status: "Active", name: "Jali Shivappa Telgi", gender: "M", dob: "18-Aug-2001", regDate: "25-Sep-2026", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 2, customerId: "0987654321", phone: "7896541230", email: "Aditi@gmail.com", status: "Active", name: "Aditi Verma", gender: "F", dob: "15-Mar-1998", regDate: "10-Oct-2025", categoryCode: "Private", riskCategory: "Low" },
  { srNo: 3, customerId: "5647382910", phone: "1234567891", email: "Ravi@gmail.com", status: "Active", name: "Ravi Kumar", gender: "M", dob: "22-Jul-1995", regDate: "30-Dec-2023", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 4, customerId: "1234567890", phone: "8989567890", email: "Shivappa@gmail.com", status: "Active", name: "Jali Shivappa Telgi", gender: "M", dob: "18-Aug-2001", regDate: "25-Sep-2026", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 5, customerId: "9876543210", phone: "6543210987", email: "Anita.singh@yahoo.com", status: "Active", name: "Anita Singh", gender: "F", dob: "05-May-1995", regDate: "12-Jan-2025", categoryCode: "Private", riskCategory: "Low" },
  { srNo: 6, customerId: "2468013579", phone: "1357908642", email: "rohit_kumar@hotmail.com", status: "Active", name: "Rohit Kumar", gender: "M", dob: "22-Jun-1990", regDate: "30-Aug-2027", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 7, customerId: "0987654321", phone: "5678901234", email: "Anjali@gmail.com", status: "Active", name: "Anjalu Sharma", gender: "F", dob: "05-Jan-1998", regDate: "12-Oct-2025", categoryCode: "Private", riskCategory: "Medium" },
  { srNo: 8, customerId: "1122334455", phone: "3344556677", email: "Rajesh@gmail.com", status: "Active", name: "Rajesh Kumar Sharma", gender: "M", dob: "20-Feb-1990", regDate: "01-Jan-2030", categoryCode: "Public", riskCategory: "High" },
];

type SortKey = keyof Omit<RowData, "phone" | "email">;

interface TableCMProps {
  filters?: CustomerFilters;
  onView?: (row: RowData) => void;
  onEdit?: (row: RowData) => void;
  onServices?: (row: RowData) => void;
  onEditPhone?: (row: RowData) => void;
  onEditEmail?: (row: RowData) => void;
}

const TableCM = ({
  filters,
  onView,
  onEdit,
  onServices,
  onEditPhone,
  onEditEmail,
}: TableCMProps) => {
  const { tRaw } = useBilingual();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = rows.filter((r) => {
    if (!filters) return true;
    if (filters.customerName && !r.name.toLowerCase().includes(filters.customerName.toLowerCase())) return false;
    if (filters.customerId && !r.customerId.toLowerCase().includes(filters.customerId.toLowerCase())) return false;
    if (filters.status && r.status.toLowerCase() !== filters.status.toLowerCase()) return false;
    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const riskColor = (risk: string) => {
    if (risk === "High") return "text-red-600 dark:text-red-400";
    if (risk === "Medium") return "text-primary";
    return "text-amber-700 dark:text-amber-400";
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-visible shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-primary rounded-t-xl">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() =>
                    col.sortable && handleSort(col.key as SortKey)
                  }
                  className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <SortableHeaderLabel label={tRaw(col.labelKey)} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr
                key={row.srNo}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} hover:bg-gray-50 dark:hover:bg-slate-800 relative`}
              >
                <td className="px-6 py-3">
                  <SrNoBadge value={row.srNo} />
                </td>

                <td className="px-6 py-3 relative">
                  <RowActionMenu
                    items={[
                      { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => onView?.(row) },
                      { key: "edit", label: tRaw("common.edit"), icon: SquarePen, onClick: () => onEdit?.(row) },
                      { key: "services", label: tRaw("common.services"), icon: List, onClick: () => onServices?.(row) },
                    ]}
                  />
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {row.customerId}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-400">
                      <Phone size={13} className="text-gray-400 dark:text-slate-500" />
                      {row.phone}
                      <button
                        onClick={() => onEditPhone?.(row)}
                        className="text-primary hover:text-primary-700"
                      >
                        <Copy size={12} />
                      </button>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-400">
                      <Mail size={13} className="text-gray-400 dark:text-slate-500" />
                      {row.email}
                      <button
                        onClick={() => onEditEmail?.(row)}
                        className="text-primary hover:text-primary-700"
                      >
                        <Copy size={12} />
                      </button>
                    </span>
                  </div>
                </td>

                <td className="px-6 py-3">
                  <StatusPill label={row.status} />
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                  {row.name}
                </td>

                <td className="px-6 py-3">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${
                      row.gender === "M"
                        ? "bg-primary-50 text-primary"
                        : "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                    }`}
                  >
                    {row.gender}
                  </span>
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                  {row.dob}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                  {row.regDate}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                  {row.categoryCode}
                </td>

                <td className="px-6 py-3">
                  <span
                    className={`text-[16px] font-semibold ${riskColor(row.riskCategory)}`}
                  >
                    {row.riskCategory}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCM;
