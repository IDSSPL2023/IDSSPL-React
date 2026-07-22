import React, { useState } from "react";
import {
  FileText,
  User,
  KeyRound,
  Calendar,
  Check,
  X,
  ChevronsDown,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import TextInput from "@/components/shared/Inputs/TextInput";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import DateInput from "@/components/shared/Inputs/DateInput";
import ListModal, { ListModalItem } from "@/components/shared/Modals/ListModal";
import { ICONS, IMAGES } from "@/assets";

interface AdviceRow {
  id: number;
  checked: boolean;
  txnDate: string;
  txnNo: string;
  subTxn: string;
  adviceNo: string;
  orValue: "O" | "R";
  indicator: string;
  amount: string;
  particular: string;
}

// Sample data for picker
const ACCOUNT_DATA: ListModalItem[] = [
  { id: "1", code: "ACC001", name: "Main Account" },
  { id: "2", code: "ACC002", name: "Savings Account" },
  { id: "3", code: "ACC003", name: "Current Account" },
  { id: "4", code: "ACC004", name: "Term Deposit Account" },
];

export const AdviceNoTab: React.FC = () => {
  const [accountCode, setAccountCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [openList, setOpenList] = useState(false);
  const [validated, setValidated] = useState(false);

  const [adviceRows, setAdviceRows] = useState<AdviceRow[]>([
    {
      id: 1,
      checked: true,
      txnDate: "27-Jul-2026",
      txnNo: "01",
      subTxn: "101",
      adviceNo: "526199",
      orValue: "O",
      indicator: "TRCR",
      amount: "1513.0",
      particular: "By Transfer DEAF",
    },
    {
      id: 2,
      checked: false,
      txnDate: "27-Jul-2026",
      txnNo: "120",
      subTxn: "20",
      adviceNo: "12526199",
      orValue: "O",
      indicator: "TRCR",
      amount: "1513.0",
      particular: "DEAF JAN 2026 TO DEAF CONT ....",
    },
    {
      id: 3,
      checked: false,
      txnDate: "27-Jul-2026",
      txnNo: "120",
      subTxn: "20",
      adviceNo: "12526199",
      orValue: "R",
      indicator: "TRCR",
      amount: "1513.0",
      particular: "To RTGS Inward 00022010017819",
    },
    {
      id: 4,
      checked: false,
      txnDate: "27-Jul-2026",
      txnNo: "120",
      subTxn: "20",
      adviceNo: "12526199",
      orValue: "O",
      indicator: "TRCR",
      amount: "1513.0",
      particular: "To RTGS Inward 00022010017819",
    },
    {
      id: 5,
      checked: true,
      txnDate: "27-Jul-2026",
      txnNo: "120",
      subTxn: "20",
      adviceNo: "12526199",
      orValue: "R",
      indicator: "TRCR",
      amount: "1513.0",
      particular: "To RTGS Inward 00022010017819",
    },
    {
      id: 6,
      checked: false,
      txnDate: "27-Jul-2026",
      txnNo: "120",
      subTxn: "20",
      adviceNo: "12526199",
      orValue: "O",
      indicator: "TRCR",
      amount: "1513.0",
      particular: "To RTGS Inward 00022010017819",
    },
  ]);

  const isAllChecked = adviceRows.length > 0 && adviceRows.every((r) => r.checked);

  const handleSelectAll = () => {
    const targetState = !isAllChecked;
    setAdviceRows((prev) => prev.map((row) => ({ ...row, checked: targetState })));
  };

  const handleRowCheck = (id: number) => {
    setAdviceRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, checked: !row.checked } : row))
    );
    setValidated(false);
  };

  const handleAdviceInputChange = (id: number, field: keyof AdviceRow, val: any) => {
    setAdviceRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
    setValidated(false);
  };

  const handleOpenList = () => setOpenList(true);
  
  const handleSelectItem = (row: ListModalItem) => {
    setAccountCode(row.code);
    setAccountName(row.name);
    setOpenList(false);
  };

  const handleValidate = () => {
    console.log("Validating advice form...");
    
    // Check if required fields are filled
    if (!accountCode || !description || !fromDate || !toDate) {
      alert("Please fill all required fields!");
      setValidated(false);
      return;
    }
    
    setValidated(true);
    alert("Validation successful!");
  };

  const handleCancel = () => {
    setAccountCode("");
    setAccountName("");
    setDescription("");
    setFromDate("");
    setToDate("");
    setValidated(false);
  };

  const handleModify = () => {
    if (!validated) return;
    console.log("Modifying advice numbers...", adviceRows);
    alert("Advice numbers modified successfully!");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <img 
            src={ICONS.FRAME} 
            alt="Advice" 
            className="object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Modify Advice Number{" "}
              <span className="text-gray-500 font-semibold text-base">
                / सल्ला क्रमांक बदला
              </span>
            </h1>
            <p className="text-sm text-gray-500">Update advice numbers for transactions</p>
          </div>
        </div>

        <SectionWrapper>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <PickerInput
                labelEn="Account Code"
                labelHi="खाते क्रमांक"
                icon={User}
                placeholder="Select Account Code"
                value={accountCode}
                onChange={setAccountCode}
                required={true}
                handleOpenList={handleOpenList}
              />
            </div>
            <div>
              <TextInput
                labelEn="Description"
                labelHi="वर्णन"
                icon={KeyRound}
                placeholder="Enter Description"
                value={description}
                onChange={setDescription}
                required={true}
              />
            </div>
            <div>
              <DateInput
                labelEn="From Date"
                labelHi="या तारखेपासून"
                icon={Calendar}
                placeholder="Select From Date"
                value={fromDate}
                onChange={setFromDate}
                required={true}
              />
            </div>
            <div>
              <DateInput
                labelEn="To Date"
                labelHi="या तारखेपर्यंत"
                icon={Calendar}
                placeholder="Select To Date"
                value={toDate}
                onChange={setToDate}
                required={true}
              />
            </div>
          </div>
        </SectionWrapper>

        {openList && (
          <ListModal
            title="Account List"
            rows={ACCOUNT_DATA}
            codeLabel="Account Code"
            nameLabel="Account Name"
            onSelect={handleSelectItem}
            onClose={() => setOpenList(false)}
          />
        )}

        {/* <SectionWrapper> */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-[#0A1A3A] text-white text-xs font-semibold">
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllChecked}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                      />
                    </th>
                    <th className="p-3 whitespace-nowrap w-[100px]">Txn Date</th>
                    <th className="p-3 whitespace-nowrap w-[80px]">Txn No</th>
                    <th className="p-3 whitespace-nowrap w-[80px]">Sub Txn</th>
                    <th className="p-3 whitespace-nowrap w-[150px]">Advice No</th>
                    <th className="p-3 whitespace-nowrap w-[100px]">O/R</th>
                    <th className="p-3 whitespace-nowrap w-[100px]">Indicator</th>
                    <th className="p-3 whitespace-nowrap w-[100px]">Amount</th>
                    <th className="p-3 whitespace-nowrap w-[200px]">Particular</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {adviceRows.map((row) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        row.checked ? "bg-blue-50/20" : ""
                      }`}
                    >
                      <td className="p-3 text-center w-10">
                        <input
                          type="checkbox"
                          checked={row.checked}
                          onChange={() => handleRowCheck(row.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-medium text-slate-600 whitespace-nowrap w-[100px]">
                        {row.txnDate}
                      </td>
                      <td className="p-3 font-medium text-slate-600 whitespace-nowrap w-[80px]">
                        {row.txnNo}
                      </td>
                      <td className="p-3 font-medium text-slate-600 whitespace-nowrap w-[80px]">
                        {row.subTxn}
                      </td>
                      <td className="p-2 w-[150px]">
                        {row.checked ? (
                          <input
                            type="text"
                            value={row.adviceNo}
                            onChange={(e) =>
                              handleAdviceInputChange(row.id, "adviceNo", e.target.value)
                            }
                            className="w-full px-3 py-1.5 border border-blue-500 rounded-xl font-medium text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="font-medium text-slate-600 px-1 block truncate">
                            {row.adviceNo}
                          </span>
                        )}
                      </td>
                      <td className="p-2 w-[100px]">
                        {row.checked ? (
                          <div className="relative w-full">
                            <select
                              value={row.orValue}
                              onChange={(e) =>
                                handleAdviceInputChange(
                                  row.id,
                                  "orValue",
                                  e.target.value as "O" | "R"
                                )
                              }
                              className="w-full pl-3 pr-8 py-1.5 border border-blue-500 rounded-xl font-medium text-slate-800 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                            >
                              <option value="O">O</option>
                              <option value="R">R</option>
                            </select>
                            <ChevronDown
                              size={14}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none"
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-slate-600 px-1 block">
                            {row.orValue}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-medium text-slate-600 whitespace-nowrap w-[100px]">
                        {row.indicator}
                      </td>
                      <td className="p-3 font-medium text-slate-600 whitespace-nowrap w-[100px]">
                        {row.amount}
                      </td>
                      <td className="p-3 font-medium text-slate-600 w-[200px]">
                        <span className="block truncate">
                          {row.particular}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        {/* </SectionWrapper> */}

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
            onClick={handleModify}
            className={`flex items-center gap-1.5 px-6 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
              validated 
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm" 
                : "bg-[#e2e8f0] text-slate-400 cursor-not-allowed"
            }`}
          >
            Modify <ChevronsDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};