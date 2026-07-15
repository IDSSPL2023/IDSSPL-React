import React, { useEffect, useState } from "react";
import {
  X,
  Check,
  ThumbsUp,
  User,
  CreditCard,
  FileText,
  Hash,
  Landmark,
  IndianRupee,
  Percent,
  ClipboardList,
  Calculator,
  FileSpreadsheet,
} from "lucide-react";
import TextInput from "../../shared/Inputs/TextInput";
import PickerInput from "../../shared/Inputs/PickerInput";
import DateInput from "../../shared/Inputs/DateInput";
import SelectInput from "../../shared/Inputs/SelectInput";
import RadioInput from "../../shared/Inputs/RadioInput";
import ListModal, { type ListModalItem } from "../ListModal";

export interface TdsReportFormData {
  accountType: string;
  description: string;
  productCode: string;
  productDescription: string;
  interestDepositCode: string;
  customerId: string;
  customerName: string;
  fromDate: string;
  toDate: string;
  tdsAmount: string;
  tdsRate: string;
  payableFromDate: string;
  payableToDate: string;
  reportTypeSelect: string;
  memberSelect: string;
  reportType: string;
  amountSelect: string;
}

export const emptyTdsReportFormData: TdsReportFormData = {
  accountType: "TD",
  description: "",
  productCode: "TD",
  productDescription: "",
  interestDepositCode: "TD",
  customerId: "TD",
  customerName: "",
  fromDate: "",
  toDate: "",
  tdsAmount: "10000",
  tdsRate: "10",
  payableFromDate: "",
  payableToDate: "",
  reportTypeSelect: "Details",
  memberSelect: "All",
  reportType: "pdf",
  amountSelect: "above",
};

export type TdsReportModalMode = "add" | "view";

type RequiredFieldKey = keyof Pick<
  TdsReportFormData,
  | "accountType"
  | "productCode"
  | "interestDepositCode"
  | "customerId"
  | "fromDate"
  | "toDate"
  | "tdsAmount"
  | "tdsRate"
  | "payableFromDate"
  | "payableToDate"
  | "reportTypeSelect"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "accountType",
  "productCode",
  "interestDepositCode",
  "customerId",
  "fromDate",
  "toDate",
  "tdsAmount",
  "tdsRate",
  "payableFromDate",
  "payableToDate",
  "reportTypeSelect",
];

type ListType =
  | "accountType"
  | "productCode"
  | "interestDepositCode"
  | "customerId";

const ACCOUNT_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "TD", name: "Term Deposit" },
  { id: "2", code: "SB", name: "Savings Bank" },
  { id: "3", code: "RD", name: "Recurring Deposit" },
  { id: "4", code: "CA", name: "Current Account" },
];

const PRODUCT_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "TD", name: "Term Deposit Product" },
  { id: "2", code: "FD", name: "Fixed Deposit Product" },
  { id: "3", code: "MIS", name: "Monthly Income Scheme" },
];

const INTEREST_DEPOSIT_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "TD", name: "Term Deposit Interest" },
  { id: "2", code: "QLY", name: "Quarterly Interest" },
  { id: "3", code: "MLY", name: "Monthly Interest" },
];

const CUSTOMER_DATA: ListModalItem[] = [
  { id: "1", code: "TD", name: "Test Deposit Customer" },
  { id: "2", code: "CUST002", name: "Ramesh Kumar" },
  { id: "3", code: "CUST003", name: "Suresh Patil" },
];

const REPORT_TYPE_OPTIONS = ["Details", "Summary"];

export interface ProvisonAndVlccModalProps {
  open: boolean;
  mode?: TdsReportModalMode;
  initialData?: TdsReportFormData;
  onClose?: () => void;
  onApply?: (data: TdsReportFormData) => void;
}

function ProvisonAndVlcc({
  open,
  mode = "add",
  initialData = emptyTdsReportFormData,
  onClose,
  onApply,
}: ProvisonAndVlccModalProps) {
  const [formData, setFormData] = useState<TdsReportFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<ListType>("accountType");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof TdsReportFormData>(
    key: K,
    value: TdsReportFormData[K],
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as RequiredFieldKey])
      setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<RequiredFieldKey, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  const handleOpenList = (type: ListType) => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    switch (listType) {
      case "accountType":
        handleChange("accountType", row.code);
        handleChange("description", row.name);
        break;
      case "productCode":
        handleChange("productCode", row.code);
        handleChange("productDescription", row.name);
        break;
      case "interestDepositCode":
        handleChange("interestDepositCode", row.code);
        break;
      case "customerId":
        handleChange("customerId", row.code);
        handleChange("customerName", row.name);
        break;
    }
    setOpenList(false);
  };

  const getListData = () => {
    switch (listType) {
      case "accountType":
        return {
          title: "Account Type List",
          rows: ACCOUNT_TYPE_DATA,
          codeLabel: "Account Type",
          nameLabel: "Description",
        };
      case "productCode":
        return {
          title: "Product Code List",
          rows: PRODUCT_CODE_DATA,
          codeLabel: "Product Code",
          nameLabel: "Product Description",
        };
      case "interestDepositCode":
        return {
          title: "Interest Paid in Deposit Code List",
          rows: INTEREST_DEPOSIT_CODE_DATA,
          codeLabel: "Code",
          nameLabel: "Description",
        };
      case "customerId":
        return {
          title: "Customer List",
          rows: CUSTOMER_DATA,
          codeLabel: "Customer ID",
          nameLabel: "Customer Name",
        };
    }
  };

  const listData = getListData();

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
        onClick={onClose}
      >
        <div
          className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="shrink-0 p-6 pb-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary">
                  <User className="text-white" size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#101828] dark:text-slate-100">
                    TDS Report Apply provision &amp; VLCC{" "}
                    <span className="font-bold text-[#64748B] dark:text-slate-400">
                      / TDS रिपोर्ट प्रावधान लागू करा आणि VLCC
                    </span>
                  </h2>
                  <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
                    View the parameter information and associated details.
                    {" / "}
                    पॅरामीटरची माहिती आणि संबंधित तपशील पहा.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Scrollable Content - Middle */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="space-y-6 rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <PickerInput
                  labelEn="Account Type"
                  labelHi="खाते प्रकार"
                  icon={CreditCard}
                  placeholder="Enter Account Type"
                  value={formData.accountType}
                  onChange={(v) => handleChange("accountType", v)}
                  hasError={errors.accountType}
                  readOnly={isView}
                  handleOpenList={() => handleOpenList("accountType")}
                />

                <TextInput
                  labelEn="Description"
                  labelHi="वर्णन"
                  icon={FileText}
                  placeholder="Description"
                  value={formData.description}
                  onChange={(v) => handleChange("description", v)}
                  required={false}
                  readOnly
                />

                <PickerInput
                  labelEn="Product Code"
                  labelHi="उत्पादन कोड"
                  icon={Hash}
                  placeholder="Enter Product Code"
                  value={formData.productCode}
                  onChange={(v) => handleChange("productCode", v)}
                  hasError={errors.productCode}
                  readOnly={isView}
                  handleOpenList={() => handleOpenList("productCode")}
                />

                <TextInput
                  labelEn="Product Description"
                  labelHi="उत्पादन वर्णन"
                  icon={FileText}
                  placeholder="Product Description"
                  value={formData.productDescription}
                  onChange={(v) => handleChange("productDescription", v)}
                  required={false}
                  readOnly
                />

                <PickerInput
                  labelEn="Interest Paid in Deposit Code"
                  labelHi="ठेव कोडमध्ये व्याज दिले"
                  icon={Landmark}
                  placeholder="Enter Code"
                  value={formData.interestDepositCode}
                  onChange={(v) => handleChange("interestDepositCode", v)}
                  hasError={errors.interestDepositCode}
                  readOnly={isView}
                  handleOpenList={() => handleOpenList("interestDepositCode")}
                />

                <PickerInput
                  labelEn="Customer ID"
                  labelHi="ग्राहक आयडी"
                  icon={User}
                  placeholder="Enter Customer ID"
                  value={formData.customerId}
                  onChange={(v) => handleChange("customerId", v)}
                  hasError={errors.customerId}
                  readOnly={isView}
                  handleOpenList={() => handleOpenList("customerId")}
                />

                <TextInput
                  labelEn="Customer Name"
                  labelHi="ग्राहकाचे नाव"
                  icon={User}
                  placeholder="Customer Name"
                  value={formData.customerName}
                  onChange={(v) => handleChange("customerName", v)}
                  required={false}
                  readOnly
                />

                <DateInput
                  labelEn="From Date"
                  labelHi="पासून दिनांक"
                  value={formData.fromDate}
                  onChange={(v) => handleChange("fromDate", v)}
                  hasError={errors.fromDate}
                  readOnly={isView}
                />

                <DateInput
                  labelEn="To Date"
                  labelHi="पर्यंत दिनांक"
                  value={formData.toDate}
                  onChange={(v) => handleChange("toDate", v)}
                  hasError={errors.toDate}
                  readOnly={isView}
                />

                <TextInput
                  labelEn="TDS Amount"
                  labelHi="टीडीएस रक्कम"
                  icon={IndianRupee}
                  placeholder="Enter TDS Amount"
                  value={formData.tdsAmount}
                  onChange={(v) => handleChange("tdsAmount", v)}
                  hasError={errors.tdsAmount}
                  readOnly={isView}
                />

                <TextInput
                  labelEn="TDS Rate"
                  labelHi="टीडीएस दर"
                  icon={Percent}
                  placeholder="Enter TDS Rate"
                  value={formData.tdsRate}
                  onChange={(v) => handleChange("tdsRate", v)}
                  hasError={errors.tdsRate}
                  readOnly={isView}
                />

                <DateInput
                  labelEn="Payable From Date"
                  labelHi="देय दिनांकापासून"
                  value={formData.payableFromDate}
                  onChange={(v) => handleChange("payableFromDate", v)}
                  hasError={errors.payableFromDate}
                  readOnly={isView}
                />

                <DateInput
                  labelEn="Payable To Date"
                  labelHi="देय दिनांकापर्यंत"
                  value={formData.payableToDate}
                  onChange={(v) => handleChange("payableToDate", v)}
                  hasError={errors.payableToDate}
                  readOnly={isView}
                />

                <SelectInput
                  labelEn="Report Type Select"
                  labelMr="अहवाल प्रकार निवडा"
                  icon={ClipboardList}
                  value={formData.reportTypeSelect}
                  options={REPORT_TYPE_OPTIONS}
                  onChange={(v) => handleChange("reportTypeSelect", v)}
                  required
                />

                <RadioInput
                  label="Select"
                  labelHi="निवडा"
                  value={formData.memberSelect}
                  onChange={(v) => handleChange("memberSelect", v)}
                  disabled={isView}
                  options={["All", "Non Members"]}
                />
              </div>

              {/* Report Type Radio Group - Using RadioInput component */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="col-span-4">
                  <RadioInput
                    label="Report Type"
                    labelHi="अहवाल प्रकार"
                    value={formData.reportType}
                    onChange={(v) => handleChange("reportType", v)}
                    disabled={isView}
                    options={["pdf", "xls"]}
                  />
                </div>
              </div>

              {/* Amount Select Radio Group - Using RadioInput component */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="col-span-4">
                  <RadioInput
                    label="Select"
                    labelHi="निवडा"
                    value={formData.amountSelect}
                    onChange={(v) => handleChange("amountSelect", v)}
                    disabled={isView}
                    options={["above", "less"]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="shrink-0 p-6 pt-4">
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              {isView ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    Cancel <X size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    Ok, Got It <ThumbsUp size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleValidate}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    Validate <Check size={16} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    Calculate <Calculator size={16} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    Report <FileText size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={!validated}
                    onClick={handleApply}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      validated
                        ? "bg-primary-100 text-primary hover:bg-primary-200"
                        : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600"
                    }`}
                  >
                    Apply <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    Cancel <X size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* List Modal */}
      {openList && listData && (
        <ListModal
          title={listData.title}
          rows={listData.rows}
          codeLabel={listData.codeLabel}
          nameLabel={listData.nameLabel}
          onSelect={handleSelectItem}
          onClose={() => setOpenList(false)}
        />
      )}
    </>
  );
}

export default ProvisonAndVlcc;
