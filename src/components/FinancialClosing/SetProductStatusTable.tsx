import { useState, forwardRef, useImperativeHandle } from "react";
import { Eye, SquarePenIcon, Plus } from "lucide-react";
import RowActionMenu, { type RowActionMenuItem } from "../shared/RowActionMenu";
import SrNoBadge from "../shared/SrNoBadge";
import SetProductStatusModal, { type ProductFormData } from "./SetProductStatusModal";

interface ProductRow {
  sr: number;
  productCode: string;
  description: string;
  interestApplyDate: string;
  interestFlag: string;
}

const columns = [
  { key: "srNo", label: "Sr No" },
  { key: "action", label: "Action" },
  { key: "productCode", label: "Product Code" },
  { key: "description", label: "Description" },
  { key: "interestApplyDate", label: "Interest Apply Date" },
  { key: "interestFlag", label: "Interest Flag" },
];

const SetProductStatusTable = forwardRef<{ handleAdd: () => void }>((_, ref) => {
  const [accountType, setAccountType] = useState("loan");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "view" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<ProductRow | null>(null);

  useImperativeHandle(ref, () => ({
    handleAdd
  }));

  // Sample data - replace with actual data from API
  const products: ProductRow[] = [
    { sr: 1, productCode: "L001", description: "Personal Loan", interestApplyDate: "01-Jan-2026", interestFlag: "Yes" },
    { sr: 2, productCode: "L002", description: "Home Loan", interestApplyDate: "15-Jan-2026", interestFlag: "Yes" },
    { sr: 3, productCode: "D001", description: "Fixed Deposit", interestApplyDate: "10-Jan-2026", interestFlag: "Yes" },
    { sr: 4, productCode: "D002", description: "Recurring Deposit", interestApplyDate: "20-Jan-2026", interestFlag: "No" },
    { sr: 5, productCode: "L003", description: "Car Loan", interestApplyDate: "05-Jan-2026", interestFlag: "Yes" },
  ];

  const handleAdd = () => {
    setModalMode("add");
    setSelectedRow(null);
    setModalOpen(true);
  };

  const handleView = (row: ProductRow) => {
    setModalMode("view");
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleEdit = (row: ProductRow) => {
    setModalMode("edit");
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handleModalSave = (data: ProductFormData) => {
    console.log("Saved data:", data);
    // Handle save logic here
  };

  const getMenuItems = (row: ProductRow): RowActionMenuItem[] => [
    { key: "view", label: "View", icon: Eye, onClick: () => handleView(row) },
    { key: "edit", label: "Edit", icon: SquarePenIcon, onClick: () => handleEdit(row) },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
      {/* Account Type Selection */}
      <div className="mb-6 flex items-center gap-6 border-b border-slate-100 pb-4 dark:border-slate-800">
        <label className="text-sm font-semibold text-[#1F2858] dark:text-slate-100">
          Account Type:
        </label>
        <div className="flex items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <input
              type="radio"
              name="account-type"
              value="loan"
              checked={accountType === "loan"}
              onChange={() => setAccountType("loan")}
              className="h-4 w-4"
            />
            Loan
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <input
              type="radio"
              name="account-type"
              value="deposit"
              checked={accountType === "deposit"}
              onChange={() => setAccountType("deposit")}
              className="h-4 w-4"
            />
            Deposit
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary rounded-t-xl">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left text-[16px] font-semibold text-white px-6 py-2 whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((row, idx) => (
                <tr
                  key={row.sr}
                  className={`${idx !== products.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} hover:bg-gray-50 dark:hover:bg-slate-800`}
                >
                  <td className="px-6 py-3">
                    <SrNoBadge value={row.sr} />
                  </td>
                  <td className="px-6 py-3">
                    <RowActionMenu items={getMenuItems(row)} />
                  </td>
                  <td className="px-6 py-3 text-[16px] text-primary font-medium dark:text-slate-100">
                    {row.productCode}
                  </td>
                  <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                    {row.description}
                  </td>
                  <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                    {row.interestApplyDate}
                  </td>
                  <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                    {row.interestFlag}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {products.length === 0 && (
        <div className="py-10 text-center text-slate-500 dark:text-slate-400">
          No products found for this account type.
        </div>
      )}

      <SetProductStatusModal
        open={modalOpen}
        mode={modalMode}
        accountType={accountType as "loan" | "deposit"}
        initialData={selectedRow ? {
          type: accountType === "loan" ? "TL" : "TD",
          description: selectedRow.description,
          productCode: selectedRow.productCode,
          productName: selectedRow.description,
          interestApplyDate: selectedRow.interestApplyDate,
          interestFlag: selectedRow.interestFlag,
        } : undefined}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
    </div>
  );
});

SetProductStatusTable.displayName = "SetProductStatusTable";

export default SetProductStatusTable;
