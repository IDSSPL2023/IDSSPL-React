import React, { useState } from "react";
import {
  Receipt,
  Code,
  Building2,
  Wallet,
  Hash,
  Check,
  X,
  ChevronsDown,
  Eye,
  SquarePen,
  UserRoundCog,
} from "lucide-react";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import ReusableTable, { TableColumn } from "./components/ReusableTable";
import ReusableForm, { FormField } from "./components/ReusableForm";
import ToggleButtons, { ToggleOption } from "./components/ToggleButtons";
import PageHeader from "./components/PageHeader";
import RowActionMenuItem from "@/components/shared/RowActionMenu";
import StatusPill, { StatusPillTone } from "@/components/shared/StatusPill";
import ListModal, { type ListModalItem } from "@/components/shared/Modals/ListModal";
import { ICONS, IMAGES } from "@/assets";

interface TDLotRow {
  srNo: number;
  dateOfIssue: string;
  accountType: string;
  fromReceiptNo: string;
  toReceiptNo: string;
  inStock: number;
}

const ACCOUNT_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "SB", name: "Saving Account" },
  { id: "2", code: "CA", name: "Current Account" },
  { id: "3", code: "TD", name: "Term Deposit" },
  { id: "4", code: "RD", name: "Recurring Deposit" },
];

export const TDLotTab: React.FC = () => {
  const [tdLotView, setTdLotView] = useState<"list" | "issue">("list");
  const [sortKey, setSortKey] = useState<keyof TDLotRow | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [openList, setOpenList] = useState(false);
  const [validated, setValidated] = useState(false);

  const [tdLotRows, setTdLotRows] = useState<TDLotRow[]>([
    {
      srNo: 1,
      dateOfIssue: "15-Jan-2024",
      accountType: "Saving Account",
      fromReceiptNo: "70010",
      toReceiptNo: "70020",
      inStock: 45,
    },
    {
      srNo: 2,
      dateOfIssue: "20-Jan-2024",
      accountType: "Current Account",
      fromReceiptNo: "80010",
      toReceiptNo: "80030",
      inStock: 25,
    },
    {
      srNo: 3,
      dateOfIssue: "05-Feb-2024",
      accountType: "Term Deposit",
      fromReceiptNo: "90010",
      toReceiptNo: "90025",
      inStock: 0,
    },
  ]);

  const [tdLotForm, setTdLotForm] = useState<Record<string, string>>({
    branchCode: "0002",
    branchName: "Main Branch, Bilagi",
    accountType: "",
    accountTypeName: "",
    fromReceiptNo: "",
    toReceiptNo: "",
    totalReceipts: "",
    remarks: "",
  });

  const toggleOptions: ToggleOption[] = [
    { key: "list", label: "TD Lot List" },
    { key: "issue", label: "TD Lot Issue" },
  ];

  const columns: TableColumn<TDLotRow>[] = [
    { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
    { key: "dateOfIssue", label: "Date of Issue", sortable: true, width: "140px" },
    { key: "accountType", label: "Account Type", sortable: true, width: "180px" },
    { key: "fromReceiptNo", label: "From Receipt No.", sortable: true, width: "160px", emphasize: true },
    { key: "toReceiptNo", label: "To Receipt No.", sortable: true, width: "160px", emphasize: true },
    { key: "inStock", label: "In Stock", sortable: true, width: "120px" },
  ];

  const branchFields: FormField[] = [
    {
      id: "branchCode",
      type: "text",
      labelEn: "Branch Code",
      labelHi: "शाखा कोड",
      icon: Code,
      placeholder: "Enter Branch Code",
      key: "branchCode",
      readOnly: true,
      required: true,
    },
    {
      id: "branchName",
      type: "text",
      labelEn: "Branch Name",
      labelHi: "शाखेचे नाव",
      icon: Building2,
      placeholder: "Enter Branch Name",
      key: "branchName",
      readOnly: true,
      required: true,
    },
    {
      id: "accountType",
      type: "picker",
      labelEn: "Account Type",
      labelHi: "खात्याचा प्रकार",
      icon: Wallet,
      placeholder: "Select Account Type",
      key: "accountTypeName",
      required: true,
      handleOpenList: () => setOpenList(true),
    },
  ];

  const tdFields: FormField[] = [
    {
      id: "fromReceiptNo",
      type: "text",
      labelEn: "From Receipt Number",
      labelHi: "पावती क्रमांकापासून",
      icon: Hash,
      placeholder: "Enter starting receipt number",
      key: "fromReceiptNo",
      required: true,
    },
    {
      id: "toReceiptNo",
      type: "text",
      labelEn: "To Receipt Number",
      labelHi: "पावती क्रमांकापर्यंत",
      icon: Hash,
      placeholder: "Enter ending receipt number",
      key: "toReceiptNo",
      required: true,
    },
  ];

  const handleSort = (key: keyof TDLotRow) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleTdLotFormChange = (key: string, value: string) => {
    setTdLotForm((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
  };

  // const getTdLotMenuItems = (row: TDLotRow): RowActionMenuItem[] => [
  //   {
  //     key: "view",
  //     label: "View",
  //     icon: Eye,
  //     onClick: () => console.log("View:", row),
  //   },
  //   {
  //     key: "edit",
  //     label: "Edit",
  //     icon: SquarePen,
  //     onClick: () => console.log("Edit:", row),
  //   },
  //   {
  //     key: "status",
  //     label: "Update Stock",
  //     icon: UserRoundCog,
  //     onClick: () => console.log("Update Stock:", row),
  //   },
  // ];

  const getStockStatus = (stock: number): StatusPillTone => {
    if (stock === 0) return "rejected";
    if (stock < 20) return "pending";
    return "success";
  };

  const handleValidate = () => {
    const requiredFields = ["accountTypeName", "fromReceiptNo", "toReceiptNo"];
    const isValid = requiredFields.every(field => tdLotForm[field]?.trim());
    
    if (isValid) {
      setValidated(true);
      alert("Validation successful!");
    } else {
      setValidated(false);
      alert("Please fill all required fields!");
    }
  };

  const handleCancel = () => {
    setTdLotView("list");
    setValidated(false);
    setTdLotForm({
      branchCode: "0002",
      branchName: "Main Branch, Bilagi",
      accountType: "",
      accountTypeName: "",
      fromReceiptNo: "",
      toReceiptNo: "",
      totalReceipts: "",
      remarks: "",
    });
  };

  const handleAddTdLot = () => {
    if (!validated) return;
    
    const fromNum = parseInt(tdLotForm.fromReceiptNo) || 0;
    const toNum = parseInt(tdLotForm.toReceiptNo) || 0;
    const stockCount = toNum - fromNum + 1;

    const newTdLot: TDLotRow = {
      srNo: tdLotRows.length + 1,
      dateOfIssue: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      accountType: tdLotForm.accountTypeName || "SB",
      fromReceiptNo: tdLotForm.fromReceiptNo || "0000000",
      toReceiptNo: tdLotForm.toReceiptNo || "0000000",
      inStock: stockCount > 0 ? stockCount : 25,
    };
    setTdLotRows([...tdLotRows, newTdLot]);
    handleCancel();
  };

  const handleSelectItem = (row: ListModalItem) => {
    handleTdLotFormChange("accountType", row.code);
    handleTdLotFormChange("accountTypeName", row.name);
    setOpenList(false);
  };

  const sortedRows = [...tdLotRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA == null || valB == null) return 0;
    if (typeof valA === "string" && typeof valB === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleToggleChange = (key: string) => {
    setTdLotView(key as "list" | "issue");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          icon={ICONS.FRAME}
          iconAlt="TD Receipt"
          titleEn="Branch TD Receipt Lot"
          titleHi="शाखा मुदत ठेव पावती लॉट"
          subtitleEn={tdLotView === "list" ? "TD Lot List" : "TD Lot Issue"}
          subtitleHi={tdLotView === "list" ? "मुदत ठेव लॉट सूची" : "मुदत ठेव लॉट जारी करा"}
        />
        <ToggleButtons
          options={toggleOptions}
          activeKey={tdLotView}
          onChange={handleToggleChange}
        />
      </div>

      {tdLotView === "list" ? (
        <ReusableTable
          columns={columns}
          data={sortedRows}
          sortKey={sortKey}
          sortAsc={sortAsc}
          onSort={handleSort}
          // getMenuItems={getTdLotMenuItems}
          getStatusTone={(row) => getStockStatus(row.inStock)}
          statusKey="inStock"
          emptyMessage="No TD lots found"
        />
      ) : (
        <div>
          <SectionWrapper>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <img src={IMAGES.USER} alt="Branch" className="object-contain" />
                Branch Details / शाखेचा तपशील
              </h3>
              <ReusableForm
                fields={branchFields}
                values={tdLotForm}
                onChange={handleTdLotFormChange}
                columns={3}
              />
            </div>
          </SectionWrapper>

          <div className="border-t border-gray-200 my-6"></div>

          <SectionWrapper>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <img src={IMAGES.ADDRESS} alt="TD Receipt" className="object-contain" />
                Term Deposit Details / मुदत ठेव तपशील
              </h3>
              <ReusableForm
                fields={tdFields}
                values={tdLotForm}
                onChange={handleTdLotFormChange}
                columns={2}
              />
              
              {/* Display calculated total receipts */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Total Receipts in Stock:</span>{" "}
                  {tdLotForm.fromReceiptNo && tdLotForm.toReceiptNo ? (
                    (parseInt(tdLotForm.toReceiptNo) - parseInt(tdLotForm.fromReceiptNo) + 1) || 0
                  ) : (
                    "Enter From and To numbers to calculate"
                  )}
                </p>
              </div>
            </div>
          </SectionWrapper>

          <div className="flex items-center justify-end gap-3 mt-6 pb-1 flex-wrap">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              Validate <Check size={14} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-5 py-2 bg-white border border-[#0b66c2] text-[#0b66c2] hover:bg-slate-50 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              Cancel <X size={14} />
            </button>
            <button
              type="button"
              disabled={!validated}
              onClick={handleAddTdLot}
              className={`flex items-center gap-1.5 px-6 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                validated 
                  ? "bg-[#1F67F4] text-white hover:bg-[#0E57EA] shadow-sm" 
                  : "bg-[#e2e8f0] text-slate-400 cursor-not-allowed"
              }`}
            >
              Save <ChevronsDown size={14} />
            </button>
          </div>
        </div>
      )}

      {openList && (
        <ListModal
          title="Account Type List"
          rows={ACCOUNT_TYPE_DATA}
          codeLabel="Code"
          nameLabel="Account Type"
          onSelect={handleSelectItem}
          onClose={() => setOpenList(false)}
        />
      )}
    </div>
  );
};