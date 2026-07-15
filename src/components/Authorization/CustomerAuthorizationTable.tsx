import { useState } from "react";
import { Eye, ShieldCheck, Phone, Mail } from "lucide-react";
import { type CustomerFilters } from "../CustomerMaster/FilterModal";
import { useBilingual } from "@/i18n/useBilingual";
import RowActionMenu from "../shared/RowActionMenu";
import SrNoBadge from "../shared/SrNoBadge";
import StatusPill from "../shared/StatusPill";
import SortableHeaderLabel from "../shared/SortableHeaderLabel";

export type AuthTab = "new" | "modify" | "rejected";

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
  tab: AuthTab;
};

const columns = [
  { key: "srNo", labelKey: "authorization.customerAuthorization.table.srNo", sortable: false, width: "80px" },
  { key: "action", labelKey: "authorization.customerAuthorization.table.action", sortable: false, width: "90px" },
  { key: "customerDetails", labelKey: "authorization.customerAuthorization.table.customerDetails", sortable: false, width: "260px" },
  { key: "status", labelKey: "authorization.customerAuthorization.table.status", sortable: true, width: "190px" },
  { key: "name", labelKey: "authorization.customerAuthorization.table.name", sortable: true, width: "200px" },
  { key: "gender", labelKey: "authorization.customerAuthorization.table.gender", sortable: true, width: "90px" },
  { key: "dob", labelKey: "authorization.customerAuthorization.table.dob", sortable: true, width: "150px" },
  { key: "regDate", labelKey: "authorization.customerAuthorization.table.regDate", sortable: true, width: "160px" },
  { key: "categoryCode", labelKey: "authorization.customerAuthorization.table.categoryCode", sortable: true, width: "140px" },
  { key: "riskCategory", labelKey: "authorization.customerAuthorization.table.riskCategory", sortable: true, width: "170px" },
] as const;

const SAMPLE_CUSTOMERS: Omit<RowData, "srNo" | "tab" | "status">[] = [
  { customerId: "1234567890", phone: "8989567890", email: "shivappa@gmail.com", name: "Jali Shivappa Telgi", gender: "M", dob: "18-Aug-2001", regDate: "25-Sep-2026", categoryCode: "Public", riskCategory: "Low" },
  { customerId: "0987654321", phone: "7896541230", email: "aditi@gmail.com", name: "Aditi Verma", gender: "F", dob: "15-Mar-1998", regDate: "10-Oct-2025", categoryCode: "Private", riskCategory: "Low" },
  { customerId: "5647382910", phone: "1234567891", email: "ravi@gmail.com", name: "Ravi Kumar", gender: "M", dob: "22-Jul-1995", regDate: "30-Dec-2023", categoryCode: "Public", riskCategory: "Medium" },
  { customerId: "9876543210", phone: "6543210987", email: "anita.singh@yahoo.com", name: "Anita Singh", gender: "F", dob: "05-May-1995", regDate: "12-Jan-2025", categoryCode: "Private", riskCategory: "Low" },
  { customerId: "2468013579", phone: "1357908642", email: "rohit.kumar@hotmail.com", name: "Rohit Kumar", gender: "M", dob: "22-Jun-1990", regDate: "30-Aug-2027", categoryCode: "Public", riskCategory: "High" },
];

const TAB_STATUS_LABEL: Record<AuthTab, string> = {
  new: "Authorization Pending",
  modify: "Modification Pending",
  rejected: "Authorization Rejected",
};

const TAB_STATUS_TONE: Record<AuthTab, "pending" | "rejected"> = {
  new: "pending",
  modify: "pending",
  rejected: "rejected",
};

const buildRows = (tab: AuthTab, count: number): RowData[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_CUSTOMERS[i % SAMPLE_CUSTOMERS.length],
    srNo: i + 1,
    tab,
    status: TAB_STATUS_LABEL[tab],
  }));

export const TAB_COUNTS: Record<AuthTab, number> = {
  new: 10,
  modify: 6,
  rejected: 6,
};

const rows: RowData[] = [
  ...buildRows("new", TAB_COUNTS.new),
  ...buildRows("modify", TAB_COUNTS.modify),
  ...buildRows("rejected", TAB_COUNTS.rejected),
];

type SortKey = keyof Omit<RowData, "phone" | "email" | "tab">;

type CustomerAuthorizationTableProps = {
  activeTab: AuthTab;
  filters?: CustomerFilters;
  onView?: (row: RowData) => void;
  onAuthorize?: (row: RowData) => void;
};

const CustomerAuthorizationTable = ({ activeTab, filters, onView, onAuthorize }: CustomerAuthorizationTableProps) => {
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
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.customerName && !r.name.toLowerCase().includes(filters.customerName.toLowerCase())) return false;
    if (filters.customerId && !r.customerId.toLowerCase().includes(filters.customerId.toLowerCase())) return false;
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
    if (risk === "High") return "text-red-600";
    if (risk === "Medium") return "text-primary";
    return "text-amber-700";
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-[1500px] table-fixed">
          <thead>
            <tr className="bg-primary">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as SortKey)}
                  className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={{ width: col.width }}
                >
                  <SortableHeaderLabel label={tRaw(col.labelKey)} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr
                key={`${row.tab}-${row.srNo}`}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 relative`}
              >
                <td className="px-6 py-3" style={{ width: "80px" }}>
                  <SrNoBadge value={row.srNo} />
                </td>

                <td className="px-6 py-3 relative" style={{ width: "90px" }}>
                  <RowActionMenu
                    items={[
                      { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => onView?.(row) },
                      { key: "authorize", label: tRaw("authorization.customerAuthorization.table.menuAuthorize"), icon: ShieldCheck, onClick: () => onAuthorize?.(row) },
                    ]}
                  />
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700" style={{ width: "260px" }}>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900">{row.customerId}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                      <Phone size={13} className="text-gray-400" />
                      {row.phone}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                      <Mail size={13} className="text-gray-400" />
                      {row.email}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-3" style={{ width: "190px" }}>
                  <StatusPill label={row.status} tone={TAB_STATUS_TONE[row.tab]} />
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "200px" }}>
                  {row.name}
                </td>

                <td className="px-6 py-3" style={{ width: "90px" }}>
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${
                      row.gender === "M" ? "bg-primary-50 text-primary" : "bg-pink-50 text-pink-600"
                    }`}
                  >
                    {row.gender}
                  </span>
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "150px" }}>
                  {row.dob}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "160px" }}>
                  {row.regDate}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "140px" }}>
                  {row.categoryCode}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "70px" }}>
                  <span className={`font-semibold ${riskColor(row.riskCategory)}`}>
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

export default CustomerAuthorizationTable;