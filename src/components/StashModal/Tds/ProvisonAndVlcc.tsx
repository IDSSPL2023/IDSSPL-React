import { useEffect, useState } from "react";
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
} from "lucide-react";
import TextInput from "../../shared/Inputs/TextInput";
import PickerInput from "../../shared/Inputs/PickerInput";
import DateInput from "../../shared/Inputs/DateInput";
import SelectInput from "../../shared/Inputs/SelectInput";
import RadioInput from "../../shared/Inputs/RadioInput";
import ListModal, { type ListModalItem } from "../ListModal";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";

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
  accountType: "",
  description: "",
  productCode: "",
  productDescription: "",
  interestDepositCode: "",
  customerId: "",
  customerName: "",
  fromDate: "",
  toDate: "",
  tdsAmount: "",
  tdsRate: "",
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

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "TDS Report Apply provision & VLCC",
    titleHi: "TDS रिपोर्ट प्रावधान लागू करा आणि VLCC",
    subtitle: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    onClose: onClose,
    showCloseButton: true,
  });

  // Define footer buttons based on mode
  const getFooterButtons = () => {
    if (isView) {
      return [
        {
          label: "Cancel",
          onClick: onClose || (() => {}),
          variant: "outline" as const,
          icon: <X size={16} />,
        },
        {
          label: "Ok, Got It",
          onClick: onClose || (() => {}),
          variant: "primary" as const,
          icon: <ThumbsUp size={16} />,
        },
      ];
    }

    return [
      {
        label: "Validate",
        onClick: handleValidate,
        variant: "primary" as const,
        icon: <Check size={16} />,
      },
      {
        label: "Calculate",
        onClick: () => {},
        variant: "outline" as const,
        icon: <Calculator size={16} />,
        className: "bg-[#F3F4FB] border border-[#0B63C1] text-[#0B63C1]",
      },
      {
        label: "Report",
        onClick: () => {},
        variant: "outline" as const,
        icon: <FileText size={16} />,
        className: "bg-[#F3F4FB] text-[#0B63C1]",
      },
      {
        label: "Apply",
        onClick: handleApply,
        variant: "primary" as const,
        icon: <Check size={16} />,
        disabled: !validated,
        className: validated
          ? "bg-primary-100 text-primary hover:bg-primary-200"
          : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
      },
      {
        label: "Cancel",
        onClick: onClose || (() => {}),
        variant: "outline" as const,
        icon: <X size={16} />,
      },
    ];
  };

  return (
    <>
      <ModalWrapper
        open={open}
        onClose={onClose}
        header={getHeaderConfig()}
        footerButtons={getFooterButtons()}
        footerAlign="right"
        showDefaultClose={false}
        maxWidth="7xl"
      >
        <SectionWrapper>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Account Type - Disabled in view mode */}
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

            {/* Description - Always readOnly */}
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

            {/* Product Code - Disabled in view mode */}
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

            {/* Product Description - Always readOnly */}
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

            {/* Interest Paid in Deposit Code - Disabled in view mode */}
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

            {/* Customer ID - Disabled in view mode */}
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

            {/* Customer Name - Always readOnly */}
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

            {/* From Date - Disabled in view mode */}
            <DateInput
              labelEn="From Date"
              labelHi="पासून दिनांक"
              value={formData.fromDate}
              onChange={(v) => handleChange("fromDate", v)}
              hasError={errors.fromDate}
              readOnly={isView}
            />

            {/* To Date - Disabled in view mode */}
            <DateInput
              labelEn="To Date"
              labelHi="पर्यंत दिनांक"
              value={formData.toDate}
              onChange={(v) => handleChange("toDate", v)}
              hasError={errors.toDate}
              readOnly={isView}
            />

            {/* TDS Amount - Disabled in view mode */}
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

            {/* TDS Rate - Disabled in view mode */}
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

            {/* Payable From Date - Disabled in view mode */}
            <DateInput
              labelEn="Payable From Date"
              labelHi="देय दिनांकापासून"
              value={formData.payableFromDate}
              onChange={(v) => handleChange("payableFromDate", v)}
              hasError={errors.payableFromDate}
              readOnly={isView}
            />

            {/* Payable To Date - Disabled in view mode */}
            <DateInput
              labelEn="Payable To Date"
              labelHi="देय दिनांकापर्यंत"
              value={formData.payableToDate}
              onChange={(v) => handleChange("payableToDate", v)}
              hasError={errors.payableToDate}
              readOnly={isView}
            />

            {/* Report Type Select - Disabled in view mode */}
            <SelectInput
              labelEn="Report Type Select"
              labelMr="अहवाल प्रकार निवडा"
              icon={ClipboardList}
              value={formData.reportTypeSelect}
              options={REPORT_TYPE_OPTIONS}
              onChange={(v) => handleChange("reportTypeSelect", v)}
              required
              editable={!isView}
            />

            {/* Radio inputs - Disabled in view mode */}
            <RadioInput
              label="Select"
              labelHi="निवडा"
              value={formData.memberSelect}
              onChange={(v) => handleChange("memberSelect", v)}
              disabled={isView}
              options={["All", "Non Members"]}
            />

            <RadioInput
              label="Report Type"
              labelHi="अहवाल प्रकार"
              value={formData.reportType}
              onChange={(v) => handleChange("reportType", v)}
              disabled={isView}
              options={[
                {
                  value: "pdf",
                  icon: ICONS.PDF,
                },
                {
                  value: "xls",
                  icon: ICONS.XLS,
                },
              ]}
            />

            <RadioInput
              label="Select"
              labelHi="निवडा"
              value={formData.amountSelect}
              onChange={(v) => handleChange("amountSelect", v)}
              disabled={isView}
              options={[
                { value: "above", label: "Above Amount" },
                { value: "less", label: "Less Amount" },
              ]}
            />
          </div>
        </SectionWrapper>
      </ModalWrapper>

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
