import { useEffect, useMemo, useState } from "react";
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
  PenSquare,
  ClipboardList,
  AlertCircle,
  ScrollText,
  FileSignature,
} from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import { ICONS } from "@/assets";
import PickerInput from "../shared/Inputs/PickerInput";
import SectionHeader from "../shared/Wrappers/SectionHeader";
import TextInput from "../shared/Inputs/TextInput";
import DateInput from "../shared/Inputs/DateInput";
import ListModal, { ListModalItem } from "../shared/Modals/ListModal";

export interface OutwardClearingBounceFormData {
  // Schedule Details
  clearingTypeId: string;
  clearingTypeName: string;
  outwardScheduleNo: string;
  scheduleDate: string;

  // Transaction Details
  clearingSerialNo: string;
  customerId: string;
  customerName: string;
  accountCode: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  outListSerial: string;
  description: string;
  glOutListDocNo: string;
  payeeName: string;
  amount: string;
  drawerName: string;
  instrumentTypeCode: string;
  instrumentNo: string;
  instrumentDate: string;
  rejectionTypeCode: string;
  rejectionDescription: string;
  chequeReturnCharges: string;
  serviceTax: string;
  scrollNumber: string;
  adviceNumber: string;
  adviceDate: string;
  originalResponding: string;
}

// Default values for the form
export const getDefaultOutwardClearingBounceData = (): OutwardClearingBounceFormData => {
  return {
    // Schedule Details
    clearingTypeId: "",
    clearingTypeName: "",
    outwardScheduleNo: `OUT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    scheduleDate: new Date().toISOString().split('T')[0],

    // Transaction Details
    clearingSerialNo: "",
    customerId: "",
    customerName: "",
    accountCode: "",
    accountName: "",
    bankCode: "",
    bankName: "",
    branchCode: "",
    branchName: "",
    outListSerial: "",
    description: "",
    glOutListDocNo: "",
    payeeName: "",
    amount: "",
    drawerName: "",
    instrumentTypeCode: "",
    instrumentNo: "",
    instrumentDate: new Date().toISOString().split('T')[0],
    rejectionTypeCode: "",
    rejectionDescription: "",
    chequeReturnCharges: "",
    serviceTax: "",
    scrollNumber: "",
    adviceNumber: "",
    adviceDate: new Date().toISOString().split('T')[0],
    originalResponding: "",
  };
};

export const emptyOutwardClearingBounceFormData: OutwardClearingBounceFormData = {
  clearingTypeId: "",
  clearingTypeName: "",
  outwardScheduleNo: "",
  scheduleDate: "",
  clearingSerialNo: "",
  customerId: "",
  customerName: "",
  accountCode: "",
  accountName: "",
  bankCode: "",
  bankName: "",
  branchCode: "",
  branchName: "",
  outListSerial: "",
  description: "",
  glOutListDocNo: "",
  payeeName: "",
  amount: "",
  drawerName: "",
  instrumentTypeCode: "",
  instrumentNo: "",
  instrumentDate: "",
  rejectionTypeCode: "",
  rejectionDescription: "",
  chequeReturnCharges: "",
  serviceTax: "",
  scrollNumber: "",
  adviceNumber: "",
  adviceDate: "",
  originalResponding: "",
};

type RequiredFieldKey = keyof Pick<
  OutwardClearingBounceFormData,
  | "clearingTypeId"
  | "clearingTypeName"
  | "outwardScheduleNo"
  | "scheduleDate"
  | "clearingSerialNo"
  | "customerId"
  | "customerName"
  | "accountCode"
  | "accountName"
  | "bankCode"
  | "bankName"
  | "branchCode"
  | "branchName"
  | "outListSerial"
  | "description"
  | "glOutListDocNo"
  | "payeeName"
  | "amount"
  | "drawerName"
  | "instrumentTypeCode"
  | "instrumentNo"
  | "instrumentDate"
  | "rejectionTypeCode"
  | "rejectionDescription"
  | "chequeReturnCharges"
  | "serviceTax"
  | "scrollNumber"
  | "adviceNumber"
  | "adviceDate"
  | "originalResponding"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "clearingTypeId",
  "clearingTypeName",
  "outwardScheduleNo",
  "scheduleDate",
  "clearingSerialNo",
  "customerId",
  "customerName",
  "accountCode",
  "accountName",
  "bankCode",
  "bankName",
  "branchCode",
  "branchName",
  "outListSerial",
  "description",
  "glOutListDocNo",
  "payeeName",
  "amount",
  "drawerName",
  "instrumentTypeCode",
  "instrumentNo",
  "instrumentDate",
  "rejectionTypeCode",
  "rejectionDescription",
  "chequeReturnCharges",
  "serviceTax",
  "scrollNumber",
  "adviceNumber",
  "adviceDate",
  "originalResponding",
];

// Mock data for list modals
const CLEARING_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "CT001", name: "Local Clearing" },
  { id: "2", code: "CT002", name: "Outstation Clearing" },
  { id: "3", code: "CT003", name: "High Value Clearing" },
];

const REJECTION_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "RT001", name: "Insufficient Funds" },
  { id: "2", code: "RT002", name: "Signature Mismatch" },
  { id: "3", code: "RT003", name: "Account Closed" },
  { id: "4", code: "RT004", name: "Payment Stopped" },
  { id: "5", code: "RT005", name: "Technical Error" },
];

// Mock data for Outward Schedule No
const OUTWARD_SCHEDULE_DATA: ListModalItem[] = [
  { id: "1", code: "OUT-2024-001", name: "Outward Schedule 001" },
  { id: "2", code: "OUT-2024-002", name: "Outward Schedule 002" },
  { id: "3", code: "OUT-2024-003", name: "Outward Schedule 003" },
];

// Mock data for Clearing Serial No
const CLEARING_SERIAL_DATA: ListModalItem[] = [
  { id: "1", code: "CS001", name: "Clearing Serial 001" },
  { id: "2", code: "CS002", name: "Clearing Serial 002" },
  { id: "3", code: "CS003", name: "Clearing Serial 003" },
];

type ListType =
  | "clearingType"
  | "outwardScheduleNo"
  | "clearingSerialNo"
  | "rejectionTypeCode";

export interface OutwardClearingBounceModalProps {
  open: boolean;
  initialData?: OutwardClearingBounceFormData;
  onClose?: () => void;
  onApply?: (data: OutwardClearingBounceFormData) => void;
  onBounce?: (data: OutwardClearingBounceFormData) => void;
  onDisplayVouchers?: (data: OutwardClearingBounceFormData) => void;
}

function OutwardClearingBounceModal({
  open,
  initialData,
  onClose,
  onApply,
  onBounce,
  onDisplayVouchers,
}: OutwardClearingBounceModalProps) {
  const defaultInitialData = useMemo(
    () => getDefaultOutwardClearingBounceData(),
    [],
  );
  const [formData, setFormData] = useState<OutwardClearingBounceFormData>(
    initialData ?? defaultInitialData,
  );
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<ListType>("clearingType");

  useEffect(() => {
    if (!open) return;

    setFormData(initialData ?? defaultInitialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, defaultInitialData]);

  if (!open) return null;

  const handleChange = <K extends keyof OutwardClearingBounceFormData>(
    key: K,
    value: OutwardClearingBounceFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as RequiredFieldKey]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleValidate = () => {
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
    if (!validated) return;
    onApply?.(formData);
  };

  const handleBounce = () => {
    if (!validated) {
      handleValidate();
      return;
    }
    onBounce?.(formData);
  };

  const handleDisplayVouchers = () => {
    if (!validated) {
      handleValidate();
      return;
    }
    onDisplayVouchers?.(formData);
  };

  const handleOpenList = (type: ListType) => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    switch (listType) {
      case "clearingType":
        handleChange("clearingTypeId", row.code);
        handleChange("clearingTypeName", row.name);
        break;
      case "outwardScheduleNo":
        handleChange("outwardScheduleNo", row.code);
        break;
      case "clearingSerialNo":
        handleChange("clearingSerialNo", row.code);
        break;
      case "rejectionTypeCode":
        handleChange("rejectionTypeCode", row.code);
        handleChange("rejectionDescription", row.name);
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
      case "outwardScheduleNo":
        return {
          title: "Outward Schedule List",
          rows: OUTWARD_SCHEDULE_DATA,
          codeLabel: "Schedule No",
          nameLabel: "Schedule Name",
        };
      case "clearingSerialNo":
        return {
          title: "Clearing Serial List",
          rows: CLEARING_SERIAL_DATA,
          codeLabel: "Serial No",
          nameLabel: "Serial Name",
        };
      case "rejectionTypeCode":
        return {
          title: "Rejection Type List",
          rows: REJECTION_TYPE_DATA,
          codeLabel: "Rejection Type Code",
          nameLabel: "Rejection Type Description",
        };
    }
  };

  const listData = getListData();

  const getHeaderConfig = () => ({
    icon: ICONS.USER_CIRCLE,
    title: "Outward Clearing Bounce Mark",
    titleHi: "जावक क्लियरिंग बाऊन्स चिन्हांकित करा",
    subtitle:
      "Select the branch and transaction details before recording cash denominations.",
    subtitleHi: "रोख घालण्याची नोंद करण्यापूर्वी शाखा व व्यवहाराची माहिती निवडा.",
    onClose: onClose,
    showCloseButton: true,
  });

  const getFooterButtons = () => {
    return [
      {
        label: "Validate",
        onClick: handleValidate,
        variant: "primary" as const,
        icon: <Check size={16} />,
      },
      {
        label: "Display Vouchers",
        onClick: handleDisplayVouchers,
        variant: "outline" as const,
        icon: <FileText size={16} />,
        className: "border-blue-500 text-blue-600 hover:bg-blue-50",
      },
      {
        label: "Cancel",
        onClick: onClose || (() => {}),
        variant: "outline" as const,
        icon: <X size={16} />,
      },
      {
        label: "Bounce",
        onClick: handleBounce,
        variant: "outline" as const,
        icon: <AlertCircle size={16} />,
        disabled: !validated,
        className: validated
          ? "bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
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
          subtitleHi="रोख घालण्याची नोंद करण्यापूर्वी शाखा व व्यवहाराची माहिती निवडा."
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {/* Clearing Type Id - PickerInput */}
            <PickerInput
              labelEn="Clearing Type Id"
              labelHi="क्लियरिंग प्रकार आयडी"
              icon={Hash}
              placeholder="Enter clearing type ID"
              value={formData.clearingTypeId}
              onChange={(v) => handleChange("clearingTypeId", v)}
              hasError={errors.clearingTypeId}
              readOnly={false}
              handleOpenList={() => handleOpenList("clearingType")}
              required
            />

            {/* Clearing Type Name - TextInput (Read Only) */}
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

            {/* Outward Schedule No - PickerInput */}
            <PickerInput
              labelEn="Outward Schedule No"
              labelHi="जावक अनुसूची क्रमांक"
              icon={Hash}
              placeholder="Enter outward schedule number"
              value={formData.outwardScheduleNo}
              onChange={(v) => handleChange("outwardScheduleNo", v)}
              hasError={errors.outwardScheduleNo}
              readOnly={false}
              handleOpenList={() => handleOpenList("outwardScheduleNo")}
              required
            />

            {/* Schedule Date - DateInput (Read Only) */}
            <DateInput
              labelEn="Schedule Date"
              labelHi="अनुसूची दिनांक"
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
          titleHi="व्यवहार तपशील"
          subtitleEn="Enter the denomination-wise cash count and verify the total cash amount."
          subtitleHi="मूल्यांकित करण्याची संख्या भरून एकूण रोख रक्कम पडतात."
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {/* Clearing Serial Number - PickerInput */}
            <PickerInput
              labelEn="Clearing Serial Number"
              labelHi="क्लियरिंग अनुक्रमांक"
              icon={Hash}
              placeholder="Enter clearing serial number"
              value={formData.clearingSerialNo}
              onChange={(v) => handleChange("clearingSerialNo", v)}
              hasError={errors.clearingSerialNo}
              readOnly={false}
              handleOpenList={() => handleOpenList("clearingSerialNo")}
              required
            />

            {/* Customer Id - TextInput (Read Only) */}
            <TextInput
              labelEn="Customer Id"
              labelHi="प्रहार आयडी"
              icon={User}
              placeholder="Enter customer ID"
              value={formData.customerId}
              onChange={(v) => handleChange("customerId", v)}
              readOnly={true}
              hasError={errors.customerId}
              required={true}
            />

            {/* Customer Name - TextInput (Read Only) */}
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

            {/* Account Code - TextInput (Read Only) */}
            <TextInput
              labelEn="Account Code"
              labelHi="खाते कोड"
              icon={CreditCard}
              placeholder="Enter account code"
              value={formData.accountCode}
              onChange={(v) => handleChange("accountCode", v)}
              readOnly={true}
              hasError={errors.accountCode}
              required={true}
            />

            {/* Account Name - TextInput (Read Only) */}
            <TextInput
              labelEn="Account Name"
              labelHi="खात्याचे नाव"
              icon={Building}
              placeholder="Enter account name"
              value={formData.accountName}
              onChange={(v) => handleChange("accountName", v)}
              readOnly={true}
              hasError={errors.accountName}
              required={true}
            />

            {/* Bank Code - TextInput (Read Only) */}
            <TextInput
              labelEn="Bank Code"
              labelHi="बँक कोड"
              icon={Landmark}
              placeholder="Enter bank code"
              value={formData.bankCode}
              onChange={(v) => handleChange("bankCode", v)}
              readOnly={true}
              hasError={errors.bankCode}
              required={true}
            />

            {/* Bank Name - TextInput (Read Only) */}
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

            {/* Branch Code - TextInput (Read Only) */}
            <TextInput
              labelEn="Branch Code"
              labelHi="शाखा कोड"
              icon={Hash}
              placeholder="Enter branch code"
              value={formData.branchCode}
              onChange={(v) => handleChange("branchCode", v)}
              readOnly={true}
              hasError={errors.branchCode}
              required={true}
            />

            {/* Branch Name - TextInput (Read Only) */}
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

            {/* OutList Serial - TextInput (Read Only) */}
            <TextInput
              labelEn="OutList Serial"
              labelHi="आउटलिस्ट अनुक्रमांक"
              icon={HashIcon}
              placeholder="Enter outlist serial"
              value={formData.outListSerial}
              onChange={(v) => handleChange("outListSerial", v)}
              readOnly={true}
              hasError={errors.outListSerial}
              required={true}
            />

            {/* Description - TextInput (Read Only) */}
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

            {/* GL Out List Doc No - TextInput (Read Only) */}
            <TextInput
              labelEn="GL Out List Doc No"
              labelHi="जीएल आउटलिस्ट दस्तऐवज क्र."
              icon={FileText}
              placeholder="Enter GL outlist document number"
              value={formData.glOutListDocNo}
              onChange={(v) => handleChange("glOutListDocNo", v)}
              readOnly={true}
              hasError={errors.glOutListDocNo}
              required={true}
            />

            {/* Payee Name - TextInput (Read Only) */}
            <TextInput
              labelEn="Payee Name"
              labelHi="पावतीदाराचे नाव"
              icon={User}
              placeholder="Enter payee name"
              value={formData.payeeName}
              onChange={(v) => handleChange("payeeName", v)}
              readOnly={true}
              hasError={errors.payeeName}
              required={true}
            />

            {/* Amount - TextInput (Read Only) */}
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

            {/* Drawer Name - TextInput (Read Only) */}
            <TextInput
              labelEn="Drawer Name"
              labelHi="ड्रॉअरचे नाव"
              icon={User}
              placeholder="Enter drawer name"
              value={formData.drawerName}
              onChange={(v) => handleChange("drawerName", v)}
              readOnly={true}
              hasError={errors.drawerName}
              required={true}
            />

            {/* Instrument Type Code - TextInput (Read Only) */}
            <TextInput
              labelEn="Instrument Type Code"
              labelHi="इन्स्ट्रुमेंट प्रकार कोड"
              icon={ClipboardList}
              placeholder="Enter instrument type code"
              value={formData.instrumentTypeCode}
              onChange={(v) => handleChange("instrumentTypeCode", v)}
              readOnly={true}
              hasError={errors.instrumentTypeCode}
              required={true}
            />

            {/* Instrument No - TextInput (Read Only) */}
            <TextInput
              labelEn="Instrument No"
              labelHi="इन्स्ट्रुमेंट क्र."
              icon={Hash}
              placeholder="Enter instrument number"
              value={formData.instrumentNo}
              onChange={(v) => handleChange("instrumentNo", v)}
              readOnly={true}
              hasError={errors.instrumentNo}
              required={true}
            />

            {/* Instrument Date - DateInput (Read Only) */}
            <DateInput
              labelEn="Instrument Date"
              labelHi="इन्स्ट्रुमेंट दिनांक"
              icon={Calendar}
              value={formData.instrumentDate}
              onChange={(v) => handleChange("instrumentDate", v)}
              hasError={errors.instrumentDate}
              readOnly={true}
              required={true}
              placeholder="Select instrument date"
            />

            {/* Rejection Type Code - PickerInput */}
            <PickerInput
              labelEn="Rejection Type Code"
              labelHi="नकार प्रकार कोड"
              icon={AlertCircle}
              placeholder="Enter rejection type code"
              value={formData.rejectionTypeCode}
              onChange={(v) => handleChange("rejectionTypeCode", v)}
              hasError={errors.rejectionTypeCode}
              readOnly={false}
              handleOpenList={() => handleOpenList("rejectionTypeCode")}
              required
            />

            {/* Rejection Description - TextInput (Read Only) */}
            <TextInput
              labelEn="Description"
              labelHi="वर्णन"
              icon={FileText}
              placeholder="Enter rejection description"
              value={formData.rejectionDescription}
              onChange={(v) => handleChange("rejectionDescription", v)}
              readOnly={true}
              hasError={errors.rejectionDescription}
              required={true}
            />

            {/* Cheque Return Charges - TextInput (Read Only) */}
            <TextInput
              labelEn="Cheque Return Charges"
              labelHi="चेक परतावा शुल्क"
              icon={IndianRupee}
              placeholder="Enter cheque return charges"
              value={formData.chequeReturnCharges}
              onChange={(v) => handleChange("chequeReturnCharges", v)}
              readOnly={true}
              hasError={errors.chequeReturnCharges}
              required={true}
            />

            {/* Service Tax - TextInput (Read Only) */}
            <TextInput
              labelEn="Service Tax"
              labelHi="सेवा कर"
              icon={IndianRupee}
              placeholder="Enter service tax"
              value={formData.serviceTax}
              onChange={(v) => handleChange("serviceTax", v)}
              readOnly={true}
              hasError={errors.serviceTax}
              required={true}
            />

            {/* Scroll Number - TextInput (Read Only) */}
            <TextInput
              labelEn="Scroll Number"
              labelHi="स्क्रोल क्रमांक"
              icon={ScrollText}
              placeholder="Enter scroll number"
              value={formData.scrollNumber}
              onChange={(v) => handleChange("scrollNumber", v)}
              readOnly={true}
              hasError={errors.scrollNumber}
              required={true}
            />

            {/* Advice Number - TextInput (Read Only) */}
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

            {/* Advice Date - DateInput (Read Only) */}
            <DateInput
              labelEn="Advice Date"
              labelHi="सल्ला दिनांक"
              icon={Calendar}
              value={formData.adviceDate}
              onChange={(v) => handleChange("adviceDate", v)}
              hasError={errors.adviceDate}
              readOnly={true}
              required={true}
              placeholder="Select advice date"
            />

            {/* Original / Responding - TextInput (Read Only) */}
            <TextInput
              labelEn="Original / Responding"
              labelHi="मूळ / प्रतिसाद"
              icon={FileSignature}
              placeholder="Enter original/responding"
              value={formData.originalResponding}
              onChange={(v) => handleChange("originalResponding", v)}
              readOnly={true}
              hasError={errors.originalResponding}
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

export default OutwardClearingBounceModal;