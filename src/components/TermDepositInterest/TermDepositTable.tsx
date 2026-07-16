import { useState } from "react";
import { Eye, ShieldCheck } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import RowActionMenu from "../shared/RowActionMenu";
import SrNoBadge from "../shared/SrNoBadge";
import SortableHeaderLabel from "../shared/SortableHeaderLabel";
import Pagination from "../shared/Pagination"; // Import the shared Pagination component

export type AuthTab = "new" | "modify" | "rejected";

export type TermDepositRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  scrollDate: string;
  createdBy: string;
  createdDate: string;
  tab: AuthTab;
};

// Column specifications perfectly aligned with the screen capture layout structure
const columns = [
  { key: "srNo", labelKey: "Sr No.", sortable: false, width: "80px" },
  { key: "action", labelKey: "Action", sortable: false, width: "90px" },
  { key: "scrollNo", labelKey: "Scroll No", sortable: true, width: "140px" },
  { key: "accountCode", labelKey: "Account Code", sortable: true, width: "220px" },
  { key: "accountName", labelKey: "Account Name", sortable: true, width: "260px" },
  { key: "scrollDate", labelKey: "Scroll Date", sortable: true, width: "160px" },
  { key: "createdBy", labelKey: "Created By", sortable: true, width: "160px" },
  { key: "createdDate", labelKey: "Created Date", sortable: true, width: "160px" },
] as const;

type SortKey = keyof Omit<TermDepositRow, "tab">;

type MenuItem = {
  key: string;
  label: string;
  icon: any;
  onClick: () => void;
};

// Define the filter type that the table accepts
export type TableFilters = {
  accountCode?: string;
  accountName?: string;
};

type TermDepositTableProps = {
  rows: TermDepositRow[];
  filters?: TableFilters;
  onView?: (row: TermDepositRow) => void;
  onAuthorize?: (row: TermDepositRow) => void;
  statusEditable?: boolean;
  renderMenuItems?: (row: TermDepositRow) => MenuItem[];
};

const TermDepositTable = ({ 
  rows, 
  filters, 
  onView, 
  onAuthorize,
  statusEditable,
  renderMenuItems
}: TermDepositTableProps) => {
  const { tRaw } = useBilingual();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10; // Define page size

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1); // Reset to page 1 when sorting changes
  };

  // 1. Apply active filtering properties
  const filteredRows = rows.filter((r) => {
    if (!filters) return true;
    if (filters.accountName && !r.accountName.toLowerCase().includes(filters.accountName.toLowerCase())) return false;
    if (filters.accountCode && !r.accountCode.toLowerCase().includes(filters.accountCode.toLowerCase())) return false;
    return true;
  });

  // 2. Compute runtime row ordering parameters
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // 3. Pagination logic - following the same pattern as the reference code
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Get menu items for a row
  const getMenuItems = (row: TermDepositRow): MenuItem[] => {
    if (renderMenuItems) {
      return renderMenuItems(row);
    }
    const items: MenuItem[] = [];
    
    if (onView) {
      items.push({ 
        key: "view", 
        label: tRaw("common.view") || "View", 
        icon: Eye, 
        onClick: () => onView(row) 
      });
    }
    
    if (onAuthorize) {
      items.push({ 
        key: "authorize", 
        label: "Authorize", 
        icon: ShieldCheck, 
        onClick: () => onAuthorize(row) 
      });
    }
    
    return items;
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-[1200px] table-fixed">
          <thead>
            <tr className="bg-primary">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as SortKey)}
                  className={`text-left text-[16px] font-semibold text-white px-6 py-3.5 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={{ width: col.width }}
                >
                  <SortableHeaderLabel 
                    label={col.labelKey.includes('.') ? tRaw(col.labelKey) : col.labelKey} 
                    sortable={col.sortable} 
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => (
                <tr
                  key={`${row.tab}-${row.srNo}-${idx}`}
                  className={`${idx !== pageRows.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 relative`}
                >
                  <td className="px-6 py-4" style={{ width: "80px" }}>
                    <SrNoBadge value={row.srNo} />
                  </td>

                  <td className="px-6 py-4 relative" style={{ width: "90px" }}>
                    <RowActionMenu items={getMenuItems(row)} />
                  </td>

                  <td className="px-6 py-4 text-[16px] font-medium text-gray-900" style={{ width: "140px" }}>
                    {row.scrollNo}
                  </td>

                  <td className="px-6 py-4 text-[16px] font-mono text-gray-700" style={{ width: "220px" }}>
                    {row.accountCode}
                  </td>

                  <td className="px-6 py-4 text-[16px] text-gray-800 truncate" style={{ width: "260px" }}>
                    {row.accountName}
                  </td>

                  <td className="px-6 py-4 text-[16px] text-gray-600 truncate" style={{ width: "160px" }}>
                    {row.scrollDate}
                  </td>

                  <td className="px-6 py-4 text-[16px] text-gray-600 truncate" style={{ width: "160px" }}>
                    {row.createdBy}
                  </td>

                  <td className="px-6 py-4 text-[16px] text-gray-600 truncate" style={{ width: "160px" }}>
                    {row.createdDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Component - exactly like the reference code */}
      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default TermDepositTable;