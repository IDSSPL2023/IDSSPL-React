import React, { useState } from "react";
import {
  CreditCard,
  Code,
  Building2,
  Wallet,
  Hash,
  FileText,
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

interface ChequeLotRow {
  srNo: number;
  dateOfIssue: string;
  accountType: string;
  chequeType: string;
  noOfBooks: number;
  chequeNoFrom: string;
  chequeNoTo: string;
  inStock: number;
}

const ACCOUNT_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "SB", name: "Saving Account" },
  { id: "2", code: "CA", name: "Current Account" },
  { id: "3", code: "TD", name: "Term Deposit" },
  { id: "4", code: "RD", name: "Recurring Deposit" },
];

const CHEQUE_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "CTS", name: "CTS" },
  { id: "2", code: "Standard", name: "Standard" },
  { id: "3", code: "Premium", name: "Premium" },
  { id: "4", code: "Business", name: "Business" },
];

const CHEQUE_SERIES_DATA: ListModalItem[] = [
  { id: "1", code: "A", name: "Series A" },
  { id: "2", code: "B", name: "Series B" },
  { id: "3", code: "C", name: "Series C" },
];

export const ChequeLotTab: React.FC = () => {
  const [chequeLotView, setChequeLotView] = useState<"list" | "issue">("list");
  const [sortKey, setSortKey] = useState<keyof ChequeLotRow | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<"account" | "cheque" | "series">("account");
  const [validated, setValidated] = useState(false);

  const [chequeLotRows, setChequeLotRows] = useState<ChequeLotRow[]>([
    {
      srNo: 1,
      dateOfIssue: "15-Jan-2024",
      accountType: "Saving Account",
      chequeType: "Standard",
      noOfBooks: 2,
      chequeNoFrom: "1000001",
      chequeNoTo: "1000100",
      inStock: 50,
    },
    {
      srNo: 2,
      dateOfIssue: "20-Jan-2024",
      accountType: "Current Account",
      chequeType: "Premium",
      noOfBooks: 1,
      chequeNoFrom: "2000001",
      chequeNoTo: "2000050",
      inStock: 25,
    },
    {
      srNo: 3,
      dateOfIssue: "05-Feb-2024",
      accountType: "Saving Account",
      chequeType: "Standard",
      noOfBooks: 3,
      chequeNoFrom: "3000001",
      chequeNoTo: "3000150",
      inStock: 75,
    },
    {
      srNo: 4,
      dateOfIssue: "10-Feb-2024",
      accountType: "Term Deposit",
      chequeType: "Premium",
      noOfBooks: 1,
      chequeNoFrom: "4000001",
      chequeNoTo: "4000025",
      inStock: 12,
    },
    {
      srNo: 5,
      dateOfIssue: "15-Mar-2024",
      accountType: "Recurring Deposit",
      chequeType: "Business",
      noOfBooks: 2,
      chequeNoFrom: "5000001",
      chequeNoTo: "5000100",
      inStock: 0,
    },
  ]);

  const [chequeLotForm, setChequeLotForm] = useState<Record<string, string>>({
    branchCode: "0002",
    branchName: "Main Branch, Bilagi",
    accountType: "",
    accountTypeName: "",
    chequeType: "",
    chequeTypeName: "",
    chequeNoFrom: "",
    chequeNoTo: "",
    leavesPerBook: "",
    noOfBooks: "",
    chequeSeries: "",
    chequeSeriesName: "",
    remarks: "",
  });

  const toggleOptions: ToggleOption[] = [
    { key: "list", label: "Cheque Lot List" },
    { key: "issue", label: "Cheque Lot Issue" },
  ];

  const columns: TableColumn<ChequeLotRow>[] = [
    { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
    { key: "dateOfIssue", label: "Date of Issue", sortable: true, width: "140px" },
    { key: "accountType", label: "Account Type", sortable: true, width: "160px" },
    { key: "chequeType", label: "Cheque Type", sortable: true, width: "140px" },
    { key: "noOfBooks", label: "No. of Books", sortable: true, width: "130px" },
    { key: "chequeNoFrom", label: "Cheque No. From", sortable: true, width: "150px", emphasize: true },
    { key: "chequeNoTo", label: "Cheque No. To", sortable: true, width: "150px", emphasize: true },
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
      handleOpenList: () => handleOpenList("account"),
    },
  ];

  const chequeFields: FormField[] = [
    {
      id: "chequeType",
      type: "picker",
      labelEn: "Cheque Type",
      labelHi: "चेक प्रकार",
      icon: CreditCard,
      placeholder: "Select Cheque Type",
      key: "chequeTypeName",
      required: true,
      handleOpenList: () => handleOpenList("cheque"),
    },
    {
      id: "chequeNoFrom",
      type: "text",
      labelEn: "Cheque No From",
      labelHi: "चेक क्रमांकापासून",
      icon: Hash,
      placeholder: "Enter starting number",
      key: "chequeNoFrom",
      required: true,
    },
    {
      id: "chequeNoTo",
      type: "text",
      labelEn: "Cheque No To",
      labelHi: "चेक क्रमांकापर्यंत",
      icon: Hash,
      placeholder: "Enter ending number",
      key: "chequeNoTo",
      required: true,
    },
    {
      id: "leavesPerBook",
      type: "text",
      labelEn: "Leaves per Book",
      labelHi: "प्रत्येक पुस्तकातील पानांची संख्या",
      icon: FileText,
      placeholder: "Enter leaves per book",
      key: "leavesPerBook",
      required: true,
    },
    {
      id: "noOfBooks",
      type: "text",
      labelEn: "No Of Books",
      labelHi: "धनादेश पुस्तकांची संख्या",
      icon: FileText,
      placeholder: "Enter number of books",
      key: "noOfBooks",
      required: true,
    },
    {
      id: "chequeSeries",
      type: "picker",
      labelEn: "Cheque Series",
      labelHi: "चेक प्रकार",
      icon: Hash,
      placeholder: "Select Series",
      key: "chequeSeriesName",
      handleOpenList: () => handleOpenList("series"),
    },
  ];

  const handleSort = (key: keyof ChequeLotRow) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleChequeLotFormChange = (key: string, value: string) => {
    setChequeLotForm((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
  };

  // const getChequeLotMenuItems = (row: ChequeLotRow): RowActionMenuItem[] => [
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
    const requiredFields = ["accountTypeName", "chequeTypeName", "chequeNoFrom", "chequeNoTo", "noOfBooks"];
    const isValid = requiredFields.every(field => chequeLotForm[field]?.trim());
    
    if (isValid) {
      setValidated(true);
      alert("Validation successful!");
    } else {
      setValidated(false);
      alert("Please fill all required fields!");
    }
  };

  const handleCancel = () => {
    setChequeLotView("list");
    setValidated(false);
    setChequeLotForm({
      branchCode: "0002",
      branchName: "Main Branch, Bilagi",
      accountType: "",
      accountTypeName: "",
      chequeType: "",
      chequeTypeName: "",
      chequeNoFrom: "",
      chequeNoTo: "",
      leavesPerBook: "",
      noOfBooks: "",
      chequeSeries: "",
      chequeSeriesName: "",
      remarks: "",
    });
  };

  const handleAddChequeLot = () => {
    if (!validated) return;
    
    const newChequeLot: ChequeLotRow = {
      srNo: chequeLotRows.length + 1,
      dateOfIssue: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      accountType: chequeLotForm.accountTypeName || "SB",
      chequeType: chequeLotForm.chequeTypeName || "CTS",
      noOfBooks: parseInt(chequeLotForm.noOfBooks) || 1,
      chequeNoFrom: chequeLotForm.chequeNoFrom || "0000000",
      chequeNoTo: chequeLotForm.chequeNoTo || "0000000",
      inStock: parseInt(chequeLotForm.noOfBooks) * parseInt(chequeLotForm.leavesPerBook) || 25,
    };
    setChequeLotRows([...chequeLotRows, newChequeLot]);
    handleCancel();
  };

  const handleOpenList = (type: "account" | "cheque" | "series") => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    if (listType === "account") {
      handleChequeLotFormChange("accountType", row.code);
      handleChequeLotFormChange("accountTypeName", row.name);
    } else if (listType === "cheque") {
      handleChequeLotFormChange("chequeType", row.code);
      handleChequeLotFormChange("chequeTypeName", row.name);
    } else if (listType === "series") {
      handleChequeLotFormChange("chequeSeries", row.code);
      handleChequeLotFormChange("chequeSeriesName", row.name);
    }
    setOpenList(false);
  };

  const getListData = () => {
    if (listType === "account") {
      return {
        title: "Account Type List",
        rows: ACCOUNT_TYPE_DATA,
        codeLabel: "Code",
        nameLabel: "Account Type",
      };
    } else if (listType === "cheque") {
      return {
        title: "Cheque Type List",
        rows: CHEQUE_TYPE_DATA,
        codeLabel: "Code",
        nameLabel: "Cheque Type",
      };
    } else {
      return {
        title: "Cheque Series List",
        rows: CHEQUE_SERIES_DATA,
        codeLabel: "Code",
        nameLabel: "Series",
      };
    }
  };

  const listData = getListData();

  const sortedRows = [...chequeLotRows].sort((a, b) => {
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
    setChequeLotView(key as "list" | "issue");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          icon={ICONS.FRAME}
          iconAlt="Cheque Book"
          titleEn="Branch Cheque Book Lot"
          titleHi="शाखा धनादेश पुस्तक लॉट"
          subtitleEn={chequeLotView === "list" ? "Cheque Lot List" : "Cheque Lot Issue"}
          subtitleHi={chequeLotView === "list" ? "धनादेश लॉट सूची" : "धनादेश लॉट जारी करा"}
        />
        <ToggleButtons
          options={toggleOptions}
          activeKey={chequeLotView}
          onChange={handleToggleChange}
        />
      </div>

      {chequeLotView === "list" ? (
        <ReusableTable
          columns={columns}
          data={sortedRows}
          sortKey={sortKey}
          sortAsc={sortAsc}
          onSort={handleSort}
          // getMenuItems={getChequeLotMenuItems}
          getStatusTone={(row) => getStockStatus(row.inStock)}
          statusKey="inStock"
          emptyMessage="No cheque lots found"
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
                values={chequeLotForm}
                onChange={handleChequeLotFormChange}
                columns={3}
              />
            </div>
          </SectionWrapper>

          <div className="border-t border-gray-200 my-6"></div>

          <SectionWrapper>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <img src={IMAGES.ADDRESS} alt="Cheque" className="object-contain" />
                Cheque Details / तपशील तपासा
              </h3>
              <ReusableForm
                fields={chequeFields}
                values={chequeLotForm}
                onChange={handleChequeLotFormChange}
                columns={3}
              />
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
              onClick={handleAddChequeLot}
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
          title={listData.title}
          rows={listData.rows}
          codeLabel={listData.codeLabel}
          nameLabel={listData.nameLabel}
          onSelect={handleSelectItem}
          onClose={() => setOpenList(false)}
        />
      )}
    </div>
  );
};