import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronUp, ChevronDown, Eye, Landmark, CreditCard, Receipt } from "lucide-react";
import { emptyBranchFormData, type BranchFormData } from "./AddBranchModal";
import { useBilingual } from "@/i18n/useBilingual";
import RowActionMenu from "../shared/RowActionMenu";

export interface BranchRow {
  sr: number;
  branchCode: string;
  ifscCode: string;
  branchName: string;
  shortName: string;
  address: string;
  cityCode: string;
  emailId: string;
  phoneNo: string;
  isImplemented: "Y" | "N";
}

type SortableRowKey = Exclude<keyof BranchRow, "sr">;

interface ColumnDef {
  key: string;
  labelKey: string;
  sortKey?: SortableRowKey;
}

type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortableRowKey;
  direction: SortDirection;
}

const columns: ColumnDef[] = [
  { key: "branchCode", labelKey: "branchMaster.table.branchCode", sortKey: "branchCode" },
  { key: "ifscCode", labelKey: "branchMaster.table.ifscCode", sortKey: "ifscCode" },
  { key: "branchName", labelKey: "branchMaster.table.branchName", sortKey: "branchName" },
  { key: "shortName", labelKey: "branchMaster.table.shortName", sortKey: "shortName" },
  { key: "address", labelKey: "branchMaster.table.address", sortKey: "address" },
  { key: "cityCode", labelKey: "branchMaster.table.cityCode", sortKey: "cityCode" },
  { key: "emailId", labelKey: "branchMaster.table.emailId", sortKey: "emailId" },
  { key: "phoneNo", labelKey: "branchMaster.table.phoneNo", sortKey: "phoneNo" },
  { key: "isImplemented", labelKey: "branchMaster.table.isImplemented", sortKey: "isImplemented" },
];

export const DEFAULT_BRANCH_ROWS: BranchRow[] = [
  { sr: 1, branchCode: "0100", ifscCode: "ILKA0000001", branchName: "Ilkal Branch", shortName: "Ikala", address: "Gongada Shetti Building", cityCode: "Ilkal", emailId: "bilagiur@yahoo.com", phoneNo: "9876543210", isImplemented: "Y" },
  { sr: 2, branchCode: "0200", ifscCode: "CHIK0000001", branchName: "Chikmagalur Branch", shortName: "Chikmagalur", address: "Mysore Road Complex", cityCode: "Chikmagalur", emailId: "chikmagalur@domain.com", phoneNo: "9876543211", isImplemented: "Y" },
  { sr: 3, branchCode: "0300", ifscCode: "DAVA0000001", branchName: "Davangere Branch", shortName: "Davangere", address: "Mohan Towers", cityCode: "Davangere", emailId: "davangere@domain.com", phoneNo: "9876543212", isImplemented: "Y" },
  { sr: 4, branchCode: "0400", ifscCode: "HAVE0000001", branchName: "Haveri Branch", shortName: "Haveri", address: "Mallikharjuna Complex", cityCode: "Haveri", emailId: "haveri@domain.com", phoneNo: "9876543213", isImplemented: "Y" },
  { sr: 5, branchCode: "0500", ifscCode: "BAGA0000001", branchName: "Bagalkot Branch", shortName: "Bagalkot", address: "Gadad Complex", cityCode: "Bagalkot", emailId: "bagalkot@domain.com", phoneNo: "9876543214", isImplemented: "Y" },
  { sr: 6, branchCode: "0600", ifscCode: "KOPP0000001", branchName: "Koppal Branch", shortName: "Koppal", address: "Ravi Towers", cityCode: "Koppal", emailId: "koppal@domain.com", phoneNo: "9876543215", isImplemented: "Y" },
  { sr: 7, branchCode: "0700", ifscCode: "BELA0000001", branchName: "Belagavi Branch", shortName: "Belagavi", address: "Shivaji Chowk", cityCode: "Belagavi", emailId: "belagavi@domain.com", phoneNo: "9876543216", isImplemented: "N" },
  { sr: 8, branchCode: "0800", ifscCode: "UDUP0000001", branchName: "Udupi Branch", shortName: "Udupi", address: "Karnataka Towers", cityCode: "Udupi", emailId: "udupi@domain.com", phoneNo: "9876543217", isImplemented: "N" },
  { sr: 9, branchCode: "0900", ifscCode: "KARW0000001", branchName: "Karwar Branch", shortName: "Karwar", address: "Navy Nagar Complex", cityCode: "Karwar", emailId: "karwar@domain.com", phoneNo: "9876543218", isImplemented: "N" },
  { sr: 10, branchCode: "1000", ifscCode: "RANE0000001", branchName: "Ranebennur Branch", shortName: "Ranebennur", address: "Market Yard", cityCode: "Ranebennur", emailId: "ranebennur@domain.com", phoneNo: "9876543219", isImplemented: "N" },
  { sr: 11, branchCode: "1100", ifscCode: "KOLA0000001", branchName: "Kolar Branch", shortName: "Kolar", address: "Kolar Gold Fields", cityCode: "Kolar", emailId: "kolar@domain.com", phoneNo: "9876543220", isImplemented: "N" },
  { sr: 12, branchCode: "1200", ifscCode: "SIRS0000001", branchName: "Sirsi Branch", shortName: "Sirsi", address: "Puttaraj Gali", cityCode: "Sirsi", emailId: "sirsi@domain.com", phoneNo: "9876543221", isImplemented: "N" },
  { sr: 13, branchCode: "1300", ifscCode: "SHIM0000001", branchName: "Shimoga Branch", shortName: "Shimoga", address: "Basappa Street", cityCode: "Shimoga", emailId: "shimoga@domain.com", phoneNo: "9876543222", isImplemented: "N" },
];

export function rowToBranchFormData(row: BranchRow): BranchFormData {
  return {
    ...emptyBranchFormData,
    branchCode: row.branchCode,
    branchName: row.branchName,
    shortName: row.shortName,
    address1: row.address,
    address2: row.address,
    address3: row.address,
    cityCode: row.cityCode,
    emailId: row.emailId,
    isImplemented: row.isImplemented === "Y" ? "Yes" : "No",
    phoneNumber1: row.phoneNo,
    phoneNumber2: row.phoneNo,
  };
}

interface BadgeProps {
  value: "Y" | "N";
}

function ImplementedBadge({ value }: BadgeProps) {
  const isYes = value === "Y";
  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-0.5 text-xs font-medium ${
        isYes
          ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "border-red-200 bg-red-50 text-red-500 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {value}
    </span>
  );
}

interface SortableHeaderProps {
  label: string;
  active: boolean;
  direction: SortDirection | null;
}

function SortableHeader({ label, active, direction }: SortableHeaderProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      {active ? (
        direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
      )}
    </span>
  );
}

export interface BranchActionHandlers {
  onView?: (row: BranchRow) => void;
  onBranchNonCbsParameter?: (row: BranchRow) => void;
  onBranchChequeBookLot?: (row: BranchRow) => void;
  onBranchTdReceiptLot?: (row: BranchRow) => void;
}

export interface BranchMasterTableProps extends BranchActionHandlers {
  rows?: BranchRow[];
}

export default function BranchMasterTable({
  rows: initialRows = DEFAULT_BRANCH_ROWS,
  onView,
  onBranchNonCbsParameter,
  onBranchChequeBookLot,
  onBranchTdReceiptLot,
}: BranchMasterTableProps) {
  const { tRaw } = useBilingual();
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (col: ColumnDef) => {
    if (!col.sortKey) return;
    const sortKey = col.sortKey;
    setSortConfig((prev) => {
      if (!prev || prev.key !== sortKey) return { key: sortKey, direction: "asc" };
      if (prev.direction === "asc") return { key: sortKey, direction: "desc" };
      return null;
    });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig) return initialRows;
    const { key, direction } = sortConfig;
    return [...initialRows].sort((a, b) => {
      const aVal = String(a[key] ?? "").toLowerCase();
      const bVal = String(b[key] ?? "").toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [initialRows, sortConfig]);

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">{tRaw("branchMaster.table.srNo")}</th>
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">{tRaw("common.actions")}</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                >
                  <SortableHeader
                    label={tRaw(col.labelKey)}
                    active={sortConfig?.key === col.sortKey}
                    direction={sortConfig && sortConfig.key === col.sortKey ? sortConfig.direction : null}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">
                  {tRaw("branchMaster.table.noRecordsFound")}
                </td>
              </tr>
            ) : (
              sortedRows.map((r) => (
                <tr key={r.sr} className="bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 align-middle">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 rounded-md text-primary-700 text-sm font-medium dark:bg-indigo-900/30">
                      {r.sr}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <RowActionMenu
                      menuWidth={224}
                      triggerClassName="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-400"
                      items={[
                        { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => onView?.(r) },
                        { key: "nonCbs", label: tRaw("branchMaster.table.menuNonCbsParameter"), icon: Landmark, onClick: () => onBranchNonCbsParameter?.(r) },
                        { key: "chequeBookLot", label: tRaw("branchMaster.table.menuChequeBookLot"), icon: CreditCard, onClick: () => onBranchChequeBookLot?.(r) },
                        { key: "tdReceiptLot", label: tRaw("branchMaster.table.menuTdReceiptLot"), icon: Receipt, onClick: () => onBranchTdReceiptLot?.(r) },
                      ]}
                    />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.branchCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.ifscCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.branchName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.shortName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.address}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.cityCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.emailId}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.phoneNo}</td>
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    <ImplementedBadge value={r.isImplemented} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
