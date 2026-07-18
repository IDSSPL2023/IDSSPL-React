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
  Calendar,
  Building,
  Banknote,
  HashIcon,
  ClipboardList,
  ChevronsDown,
} from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import { ICONS } from "@/assets";
import PickerInput from "../shared/Inputs/PickerInput";
import SectionHeader from "../shared/Wrappers/SectionHeader";
import RadioInput from "../shared/Inputs/RadioInput";
import TextInput from "../shared/Inputs/TextInput";
import DateInput from "../shared/Inputs/DateInput";
import ListModal, { ListModalItem } from "../shared/Modals/ListModal";

export interface InwardClearingEntryFormData {
  // Schedule Details
  clearingTypeId: string;
  clearingTypeName: string;
  inwardScheduleNo: string;
  scheduleDate: string;

  // Account Details
  accountCode: string;
  accountName: string;
  customerId: string;
  customerName: string;
  glAccountCode: string;
  glAccountName: string;
  ledgerBalance: string;
  serialNo: string;
  limitAmount: string;

  // Transaction Details
  clgBankCode: string;
  bankName: string;
  clgBranchCode: string;
  branchName: string;
  forBranchCode: string;
  forBranchName: string;
  amount: string;
  paymentType: string;
  outlistSerial: string;
  description: string;
  outlistDocNo: string;
  instrumentType: string;
  chequeType: string;
  chequeSeries: string;
  instrumentNumber: string;
  instrumentDate: string;
  adviceNumber: string;
  originalResponding: string;
  particular: string;
}

export const emptyInwardClearingEntryFormData: InwardClearingEntryFormData = {
  clearingTypeId: "",
  clearingTypeName: "",
  inwardScheduleNo: "",
  scheduleDate: "",
  accountCode: "",
  accountName: "",
  customerId: "",
  customerName: "",
  glAccountCode: "",
  glAccountName: "",
  ledgerBalance: "",
  serialNo: "",
  limitAmount: "",
  clgBankCode: "",
  bankName: "",
  clgBranchCode: "",
  branchName: "",
  forBranchCode: "",
  forBranchName: "",
  amount: "",
  paymentType: "Cheque",
  outlistSerial: "",
  description: "",
  outlistDocNo: "",
  instrumentType: "",
  chequeType: "",
  chequeSeries: "",
  instrumentNumber: "",
  instrumentDate: "",
  adviceNumber: "",
  originalResponding: "",
  particular: "",
};

export type InwardClearingEntryModalMode = "add" | "view";

type RequiredFieldKey = keyof Pick<
  InwardClearingEntryFormData,
  | "clearingTypeId"
  | "clearingTypeName"
  | "inwardScheduleNo"
  | "scheduleDate"
  | "accountCode"
  | "accountName"
  | "customerId"
  | "customerName"
  | "glAccountCode"
  | "glAccountName"
  | "ledgerBalance"
  | "serialNo"
  | "limitAmount"
  | "clgBankCode"
  | "bankName"
  | "clgBranchCode"
  | "branchName"
  | "forBranchCode"
  | "forBranchName"
  | "amount"
  | "outlistSerial"
  | "description"
  | "outlistDocNo"
  | "instrumentType"
  | "chequeType"
  | "chequeSeries"
  | "instrumentNumber"
  | "instrumentDate"
  | "adviceNumber"
  | "originalResponding"
  | "particular"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "clearingTypeId",
  "clearingTypeName",
  "inwardScheduleNo",
  "scheduleDate",
  "accountCode",
  "accountName",
  "customerId",
  "customerName",
  "glAccountCode",
  "glAccountName",
  "ledgerBalance",
  "serialNo",
  "limitAmount",
  "clgBankCode",
  "bankName",
  "clgBranchCode",
  "branchName",
  "forBranchCode",
  "forBranchName",
  "amount",
  "outlistSerial",
  "description",
  "outlistDocNo",
  "instrumentType",
  "chequeType",
  "chequeSeries",
  "instrumentNumber",
  "instrumentDate",
  "adviceNumber",
  "originalResponding",
  "particular",
];

// Payment Type options - only Cheque and Others as shown in the image
const PAYMENT_TYPE_OPTIONS = ["Cheque", "Others"];

const CLEARING_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "CT001", name: "Local Clearing" },
  { id: "2", code: "CT002", name: "Outstation Clearing" },
  { id: "3", code: "CT003", name: "High Value Clearing" },
];

const ACCOUNT_DATA: ListModalItem[] = [
  { id: "1", code: "ACC001", name: "Current Account - Main" },
  { id: "2", code: "ACC002", name: "Savings Account - Corporate" },
  { id: "3", code: "ACC003", name: "Cash Credit Account" },
];

const CUSTOMER_DATA: ListModalItem[] = [
  { id: "1", code: "CUST001", name: "ABC Corporation" },
  { id: "2", code: "CUST002", name: "XYZ Enterprises" },
  { id: "3", code: "CUST003", name: "PQR Limited" },
];

const GL_ACCOUNT_DATA: ListModalItem[] = [
  { id: "1", code: "GL001", name: "Clearing Account" },
  { id: "2", code: "GL002", name: "Suspense Account" },
  { id: "3", code: "GL003", name: "Current Account" },
];

const BANK_DATA: ListModalItem[] = [
  { id: "1", code: "SBI", name: "State Bank of India" },
  { id: "2", code: "HDFC", name: "HDFC Bank" },
  { id: "3", code: "ICICI", name: "ICICI Bank" },
];

const BRANCH_DATA: ListModalItem[] = [
  { id: "1", code: "BR001", name: "Main Branch - Mumbai" },
  { id: "2", code: "BR002", name: "Corporate Branch - Delhi" },
  { id: "3", code: "BR003", name: "Regional Branch - Bangalore" },
];

const INSTRUMENT_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "CHQ", name: "Cheque" },
  { id: "2", code: "DD", name: "Demand Draft" },
  { id: "3", code: "PO", name: "Pay Order" },
];

const CHEQUE_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "SELF", name: "Self Cheque" },
  { id: "2", code: "BEARER", name: "Bearer Cheque" },
  { id: "3", code: "ORDER", name: "Order Cheque" },
];

const CHEQUE_SERIES_DATA: ListModalItem[] = [
  { id: "1", code: "CS001", name: "Series A - 000001 to 100000" },
  { id: "2", code: "CS002", name: "Series B - 100001 to 200000" },
  { id: "3", code: "CS003", name: "Series C - 200001 to 300000" },
];

const OUTLIST_SERIAL_DATA: ListModalItem[] = [
  { id: "1", code: "OL001", name: "Outlist Serial 001" },
  { id: "2", code: "OL002", name: "Outlist Serial 002" },
  { id: "3", code: "OL003", name: "Outlist Serial 003" },
];

type ListType =
  | "clearingType"
  | "accountCode"
  | "customerId"
  | "glAccountCode"
  | "bankName"
  | "branchName"
  | "forBranchName"
  | "instrumentType"
  | "chequeType"
  | "chequeSeries"
  | "outlistSerial";

export interface InwardClearingEntryModalProps {
  open: boolean;
  initialData?: InwardClearingEntryFormData;
  readOnly?: boolean;
  onClose?: () => void;
  onApply?: (data: InwardClearingEntryFormData) => void;
}

function InwardClearingEntryModal({
  open,
  initialData = emptyInwardClearingEntryFormData,
  readOnly = false,
  onClose,
  onApply,
}: InwardClearingEntryModalProps) {
    console.log("initialData",initialData,)
  const [formData, setFormData] =
    useState<InwardClearingEntryFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<ListType>("clearingType");
  console.log("formData", formData);

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = <K extends keyof InwardClearingEntryFormData>(
    key: K,
    value: InwardClearingEntryFormData[K],
  ) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as RequiredFieldKey]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleValidate = () => {
    if (readOnly) return;
    const newErrors: Partial<Record<RequiredFieldKey, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) {
        newErrors[key] = true;
      }
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleApply = () => {
    if (readOnly) {
      onClose?.();
      return;
    }
    if (!validated) return;
    onApply?.(formData);
  };

  const handleOpenList = (type: ListType) => {
    if (readOnly) return;
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    switch (listType) {
      case "clearingType":
        handleChange("clearingTypeId", row.code);
        handleChange("clearingTypeName", row.name);
        break;
      case "accountCode":
        handleChange("accountCode", row.code);
        handleChange("accountName", row.name);
        break;
      case "customerId":
        handleChange("customerId", row.code);
        handleChange("customerName", row.name);
        break;
      case "glAccountCode":
        handleChange("glAccountCode", row.code);
        handleChange("glAccountName", row.name);
        break;
      case "bankName":
        handleChange("clgBankCode", row.code);
        handleChange("bankName", row.name);
        break;
      case "branchName":
        handleChange("clgBranchCode", row.code);
        handleChange("branchName", row.name);
        break;
      case "forBranchName":
        handleChange("forBranchCode", row.code);
        handleChange("forBranchName", row.name);
        break;
      case "instrumentType":
        handleChange("instrumentType", row.code);
        break;
      case "chequeType":
        handleChange("chequeType", row.code);
        break;
      case "chequeSeries":
        handleChange("chequeSeries", row.code);
        break;
      case "outlistSerial":
        handleChange("outlistSerial", row.code);
        break;
    }
    setOpenList(false);
  };

  const getListData = () => {
    switch (listType) {
      case "clearingType":
        return {
          title: "Clearing Type List",
          rows: CLEARING_TYPE_DATA,
          codeLabel: "Clearing Type ID",
          nameLabel: "Clearing Type Name",
        };
      case "accountCode":
        return {
          title: "Account List",
          rows: ACCOUNT_DATA,
          codeLabel: "Account Code",
          nameLabel: "Account Name",
        };
      case "customerId":
        return {
          title: "Customer List",
          rows: CUSTOMER_DATA,
          codeLabel: "Customer ID",
          nameLabel: "Customer Name",
        };
      case "glAccountCode":
        return {
          title: "GL Account List",
          rows: GL_ACCOUNT_DATA,
          codeLabel: "GL Account Code",
          nameLabel: "GL Account Name",
        };
      case "bankName":
        return {
          title: "Bank List",
          rows: BANK_DATA,
          codeLabel: "Bank Code",
          nameLabel: "Bank Name",
        };
      case "branchName":
      case "forBranchName":
        return {
          title: "Branch List",
          rows: BRANCH_DATA,
          codeLabel: "Branch Code",
          nameLabel: "Branch Name",
        };
      case "instrumentType":
        return {
          title: "Instrument Type List",
          rows: INSTRUMENT_TYPE_DATA,
          codeLabel: "Instrument Type",
          nameLabel: "Description",
        };
      case "chequeType":
        return {
          title: "Cheque Type List",
          rows: CHEQUE_TYPE_DATA,
          codeLabel: "Cheque Type",
          nameLabel: "Description",
        };
      case "chequeSeries":
        return {
          title: "Cheque Series List",
          rows: CHEQUE_SERIES_DATA,
          codeLabel: "Cheque Series",
          nameLabel: "Description",
        };
      case "outlistSerial":
        return {
          title: "Outlist Serial List",
          rows: OUTLIST_SERIAL_DATA,
          codeLabel: "Outlist Serial",
          nameLabel: "Description",
        };
    }
  };

  const listData = getListData();

  const getHeaderConfig = () => ({
    icon: ICONS.USER_CIRCLE,
    title: readOnly ? "View Inward Clearing Entry" : "Inward Clearing Entry",
    titleHi: readOnly ? "आवक क्लिन्सिंग नोंद पहा" : "आवक क्लिन्सिंग नोंद",
    subtitle: readOnly 
      ? "View the inward clearing entry details." 
      : "Select the branch and transaction details before recording cash denominations.",
    subtitleHi: readOnly
      ? "आवक क्लिन्सिंग नोंदीचा तपशील पहा."
      : "रोख चलनाची नोंद करण्यापूर्वी शाखा व व्यवहाराची माहिती निवडा.",
    onClose: onClose,
    showCloseButton: true,
  });

  const getFooterButtons = () => {
    // if (readOnly) {
    //   return [
    //     {
    //       label: "Close",
    //       onClick: onClose || (() => {}),
    //       variant: "outline" as const,
    //       icon: <X size={16} />,
    //     },
    //     {
    //       label: "Ok, Got It",
    //       onClick: onClose || (() => {}),
    //       variant: "primary" as const,
    //       icon: <ThumbsUp size={16} />,
    //     },
    //   ];
    // }

    return [
      {
        label: "Validate",
        onClick: handleValidate,
        variant: "primary" as const,
        icon: <Check size={16} />,
      },
      {
        label: "Cancel",
        onClick: onClose || (() => {}),
        variant: "outline" as const,
        icon: <X size={16} />,
      },
      {
        label: "Modify",
        onClick: handleApply,
        variant: "outline" as const,
        icon: <ChevronsDown size={16} />,
        disabled: !validated,
        className: validated
          ? "bg-[#F3F4FB] text-[#0B63C1] hover:bg-[#E8EDF8]"
          : "cursor-not-allowed bg-gray-100 text-gray-400",
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
        {/* Schedule Details Section */}
        <SectionHeader
          icon={
            <img src={ICONS.USER_CIRCLE} alt="Schedule" className="h-10 w-10" />
          }
          titleEn="Schedule Details"
          titleHi="वेळापत्रकाचा तपशील"
          subtitleEn="Select the branch and transaction details before recording cash denominations."
          subtitleHi="रोख चलनाची नोंद करण्यापूर्वी शाखा व व्यवहाराची माहिती निवडा."
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <PickerInput
              labelEn="Clearing Type Id"
              labelHi="क्लियरिंग प्रकार आयडी"
              icon={Hash}
              placeholder="Enter clearing type ID"
              value={formData.clearingTypeId}
              onChange={(v) => handleChange("clearingTypeId", v)}
              hasError={errors.clearingTypeId}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("clearingType")}
              required
            />

            <TextInput
              labelEn="Clearing Type Name"
              labelHi="क्लियरिंग प्रकाराचे नाव"
              icon={FileText}
              placeholder="Enter clearing type name"
              value={formData.clearingTypeName}
              onChange={(v) => handleChange("clearingTypeName", v)}
              readOnly={true}
              hasError={errors.clearingTypeName}
              required={true}
            />

            <TextInput
              labelEn="Inward Schedule No"
              labelHi="आवक शेड्यूल क्रमांक"
              icon={Hash}
              placeholder="Enter inward schedule number"
              value={formData.inwardScheduleNo}
              onChange={(v) => handleChange("inwardScheduleNo", v)}
              readOnly={true}
              hasError={errors.inwardScheduleNo}
              required={true}
            />

            <DateInput
              labelEn="Schedule Date"
              labelHi="शेड्यूल तारीख"
              icon={Calendar}
              value={formData.scheduleDate}
              onChange={(v) => handleChange("scheduleDate", v)}
              hasError={errors.scheduleDate}
              readOnly={true}
              required={true}
              placeholder="Select schedule date"
            />
          </div>
        </SectionHeader>

        {/* Account Details Section */}
        <SectionHeader
          icon={
            <img src={ICONS.USER_CIRCLE} alt="Account" className="h-10 w-10" />
          }
          titleEn="Account Details"
          titleHi="खात्याचा तपशील"
          subtitleEn="Enter the denomination-wise cash count and verify the total cash amount."
          subtitleHi="मूल्यनिहाय नोटा वाण्यांची संख्या भरून एकूण रोख रक्कम पडताळा."
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <PickerInput
              labelEn="Account Code"
              labelHi="खाते कोड"
              icon={CreditCard}
              placeholder="Enter account code"
              value={formData.accountCode}
              onChange={(v) => handleChange("accountCode", v)}
              hasError={errors.accountCode}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("accountCode")}
              required
            />

            <TextInput
              labelEn="Account Name"
              labelHi="खात्याचे नाव"
              icon={User}
              placeholder="Enter account name"
              value={formData.accountName}
              onChange={(v) => handleChange("accountName", v)}
              readOnly={true}
              hasError={errors.accountName}
              required={true}
            />

            <PickerInput
              labelEn="Customer Id"
              labelHi="ग्राहक आयडी"
              icon={User}
              placeholder="Enter customer ID"
              value={formData.customerId}
              onChange={(v) => handleChange("customerId", v)}
              hasError={errors.customerId}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("customerId")}
              required
            />

            <TextInput
              labelEn="Customer Name"
              labelHi="ग्राहकाचे नाव"
              icon={User}
              placeholder="Enter customer name"
              value={formData.customerName}
              onChange={(v) => handleChange("customerName", v)}
              readOnly={true}
              hasError={errors.customerName}
              required={true}
            />

            <PickerInput
              labelEn="GL Account Code"
              labelHi="जीएल खाते कोड"
              icon={Landmark}
              placeholder="Enter GL account code"
              value={formData.glAccountCode}
              onChange={(v) => handleChange("glAccountCode", v)}
              hasError={errors.glAccountCode}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("glAccountCode")}
              required
            />

            <TextInput
              labelEn="GL Account Name"
              labelHi="जीएल खात्याचे नाव"
              icon={Landmark}
              placeholder="Enter GL account name"
              value={formData.glAccountName}
              onChange={(v) => handleChange("glAccountName", v)}
              readOnly={true}
              hasError={errors.glAccountName}
              required={true}
            />

            <TextInput
              labelEn="Ledger Balance"
              labelHi="लेजर शिल्लक"
              icon={Banknote}
              placeholder="Enter ledger balance"
              value={formData.ledgerBalance}
              onChange={(v) => handleChange("ledgerBalance", v)}
              readOnly={true}
              hasError={errors.ledgerBalance}
              required={true}
            />

            <TextInput
              labelEn="Serial No"
              labelHi="अनुक्रमांक"
              icon={Hash}
              placeholder="Enter serial number"
              value={formData.serialNo}
              onChange={(v) => handleChange("serialNo", v)}
              readOnly={true}
              hasError={errors.serialNo}
              required={true}
            />

            <TextInput
              labelEn="Limit Amount"
              labelHi="मर्यादा रक्कम"
              icon={IndianRupee}
              placeholder="Enter limit amount"
              value={formData.limitAmount}
              onChange={(v) => handleChange("limitAmount", v)}
              readOnly={true}
              hasError={errors.limitAmount}
              required={true}
            />
          </div>
        </SectionHeader>

        {/* Transaction Details Section */}
        <SectionHeader
          icon={
            <img
              src={ICONS.USER_CIRCLE}
              alt="Transaction"
              className="h-10 w-10"
            />
          }
          titleEn="Transaction Details"
          titleHi="व्यवहाराचा तपशील"
          subtitleEn="Enter the denomination-wise cash count and verify the total cash amount."
          subtitleHi="मूल्यनिहाय नोटा वाण्यांची संख्या भरून एकूण रोख रक्कम पडताळा."
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <PickerInput
              labelEn="Clg. Bank Code"
              labelHi="क्ली. बँक कोड"
              icon={Building}
              placeholder="Enter clearing bank code"
              value={formData.clgBankCode}
              onChange={(v) => handleChange("clgBankCode", v)}
              hasError={errors.clgBankCode}
             readOnly={readOnly}
              handleOpenList={() => handleOpenList("bankName")}
              required
            />

            <TextInput
              labelEn="Bank Name"
              labelHi="बँकेचे नाव"
              icon={Building}
              placeholder="Enter bank name"
              value={formData.bankName}
              onChange={(v) => handleChange("bankName", v)}
              readOnly={true}
              hasError={errors.bankName}
              required={true}
            />

            <PickerInput
              labelEn="Clg. Branch Code"
              labelHi="क्ली. शाखा कोड"
              icon={Hash}
              placeholder="Enter clearing branch code"
              value={formData.clgBranchCode}
              onChange={(v) => handleChange("clgBranchCode", v)}
              hasError={errors.clgBranchCode}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("branchName")}
              required
            />

            <TextInput
              labelEn="Branch Name"
              labelHi="शाखेचे नाव"
              icon={Building}
              placeholder="Enter branch name"
              value={formData.branchName}
              onChange={(v) => handleChange("branchName", v)}
              readOnly={true}
              hasError={errors.branchName}
              required={true}
            />

            <PickerInput
              labelEn="For Branch Code"
              labelHi="साठी शाखा कोड"
              icon={Hash}
              placeholder="Enter for branch code"
              value={formData.forBranchCode}
              onChange={(v) => handleChange("forBranchCode", v)}
              hasError={errors.forBranchCode}
             readOnly={readOnly}
              handleOpenList={() => handleOpenList("forBranchName")}
              required
            />

            <TextInput
              labelEn="For Branch Name"
              labelHi="साठी शाखेचे नाव"
              icon={Building}
              placeholder="Enter for branch name"
              value={formData.forBranchName}
              onChange={(v) => handleChange("forBranchName", v)}
              readOnly={true}
              hasError={errors.forBranchName}
              required={true}
            />

            <TextInput
              labelEn="Amount"
              labelHi="रक्कम"
              icon={IndianRupee}
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(v) => handleChange("amount", v)}
              readOnly={true}
              hasError={errors.amount}
              required={true}
            />

            {/* Payment Type - Radio Input with Cheque and Others */}
            <div className="col-span-1">
              <label className="mb-1.5 block text-[1rem] font-medium text-black dark:text-slate-100">
                Payment Type
                <span className="font-medium text-gray-500 dark:text-slate-400">
                  {" / "}
                  पेमेंट प्रकार
                </span>
              </label>
              <RadioInput
                label=""
                labelHi=""
                value={formData.paymentType}
                onChange={(v) => handleChange("paymentType", v)}
                options={PAYMENT_TYPE_OPTIONS}
                orientation="horizontal"
                disabled={readOnly}
              />
            </div>

            <PickerInput
              labelEn="Outlist Serial"
              labelHi="आउटलिस्ट अनुक्रमांक"
              icon={Hash}
              placeholder="Enter outlist serial"
              value={formData.outlistSerial}
              onChange={(v) => handleChange("outlistSerial", v)}
              hasError={errors.outlistSerial}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("outlistSerial")}
              required
            />

            <TextInput
              labelEn="Description"
              labelHi="वर्णन"
              icon={FileText}
              placeholder="Enter description"
              value={formData.description}
              onChange={(v) => handleChange("description", v)}
              readOnly={true}
              hasError={errors.description}
              required={true}
            />

            <TextInput
              labelEn="OutList Doc. No."
              labelHi="आउटलिस्ट दस्तऐवज क्र."
              icon={FileText}
              placeholder="Enter outlist document number"
              value={formData.outlistDocNo}
              onChange={(v) => handleChange("outlistDocNo", v)}
              readOnly={true}
              hasError={errors.outlistDocNo}
              required={true}
            />

            <PickerInput
              labelEn="Instrument Type"
              labelHi="इन्स्ट्रुमेंट प्रकार"
              icon={ClipboardList}
              placeholder="Enter instrument type"
              value={formData.instrumentType}
              onChange={(v) => handleChange("instrumentType", v)}
              hasError={errors.instrumentType}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("instrumentType")}
              required
            />

            <PickerInput
              labelEn="Cheque Type"
              labelHi="चेक प्रकार"
              icon={FileText}
              placeholder="Enter cheque type"
              value={formData.chequeType}
              onChange={(v) => handleChange("chequeType", v)}
              hasError={errors.chequeType}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("chequeType")}
              required
            />

            <PickerInput
              labelEn="Cheque Series"
              labelHi="चेक मालिका"
              icon={HashIcon}
              placeholder="Enter cheque series"
              value={formData.chequeSeries}
              onChange={(v) => handleChange("chequeSeries", v)}
              hasError={errors.chequeSeries}
              readOnly={readOnly}
              handleOpenList={() => handleOpenList("chequeSeries")}
              required
            />

            <TextInput
              labelEn="Instrument Number"
              labelHi="इन्स्ट्रुमेंट क्रमांक"
              icon={Hash}
              placeholder="Enter instrument number"
              value={formData.instrumentNumber}
              onChange={(v) => handleChange("instrumentNumber", v)}
              readOnly={true}
              hasError={errors.instrumentNumber}
              required={true}
            />

            <DateInput
              labelEn="Instrument Date"
              labelHi="इन्स्ट्रुमेंट तारीख"
              icon={Calendar}
              value={formData.instrumentDate}
              onChange={(v) => handleChange("instrumentDate", v)}
              hasError={errors.instrumentDate}
              readOnly={true}
              required={true}
              placeholder="Select instrument date"
            />

            <TextInput
              labelEn="Advice Number"
              labelHi="सल्ला क्रमांक"
              icon={FileText}
              placeholder="Enter advice number"
              value={formData.adviceNumber}
              onChange={(v) => handleChange("adviceNumber", v)}
              readOnly={true}
              hasError={errors.adviceNumber}
              required={true}
            />

            <TextInput
              labelEn="Original Responding"
              labelHi="मूळ प्रतिसाद"
              icon={FileText}
              placeholder="Enter original responding"
              value={formData.originalResponding}
              onChange={(v) => handleChange("originalResponding", v)}
              readOnly={true}
              hasError={errors.originalResponding}
              required={true}
            />

            <TextInput
              labelEn="Particular"
              labelHi="तपशील"
              icon={FileText}
              placeholder="Enter particular"
              value={formData.particular}
              onChange={(v) => handleChange("particular", v)}
              readOnly={true}
              hasError={errors.particular}
              required={true}
            />
          </div>
        </SectionHeader>
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

export default InwardClearingEntryModal;