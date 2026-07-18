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
  FileSignature,
  ScrollText,
} from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import { ICONS } from "@/assets";
import PickerInput from "../shared/Inputs/PickerInput";
import SectionHeader from "../shared/Wrappers/SectionHeader";
import TextInput from "../shared/Inputs/TextInput";
import DateInput from "../shared/Inputs/DateInput";
import ListModal, { ListModalItem } from "../shared/Modals/ListModal";

export interface OutwardClearingEntryFormData {
  // Schedule Details
  clearingTypeId: string;
  clearingTypeName: string;
  outwardScheduleNo: string;
  scheduleDate: string;

  // Account Details
  accountCode: string;
  accountName: string;
  ledgerBalance: string;
  availableBalance: string;

  // Transaction Details
  outlistSerial: string;
  description: string;
  glOutListDocNo: string;
  payeeName: string;
  serialNo: string;
  drawerName: string;
  bankCode: string;
  bankName: string;
  clgBranchCode: string;
  branchName: string;
  forBranchCode: string;
  forBranchName: string;
  amount: string;
  instrumentType: string;
  instrumentNo: string;
  instrumentDate: string;
  adviceNumber: string;
  originalResponding: string;
}

// Default values for the form
export const getDefaultOutwardClearingData = (): OutwardClearingEntryFormData => {
  return {
    // Schedule Details
    clearingTypeId: "",
    clearingTypeName: "",
    outwardScheduleNo: `OUT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    scheduleDate: new Date().toISOString().split('T')[0],

    // Account Details
    accountCode: "",
    accountName: "",
    ledgerBalance: "",
    availableBalance: "",

    // Transaction Details
    outlistSerial: "",
    description: "",
    glOutListDocNo: "",
    payeeName: "",
    serialNo: "",
    drawerName: "",
    bankCode: "",
    bankName: "",
    clgBranchCode: "",
    branchName: "",
    forBranchCode: "",
    forBranchName: "",
    amount: "",
    instrumentType: "",
    instrumentNo: "",
    instrumentDate: new Date().toISOString().split('T')[0],
    adviceNumber: "",
    originalResponding: "",
  };
};

export const emptyOutwardClearingEntryFormData: OutwardClearingEntryFormData = {
  clearingTypeId: "",
  clearingTypeName: "",
  outwardScheduleNo: "",
  scheduleDate: "",
  accountCode: "",
  accountName: "",
  ledgerBalance: "",
  availableBalance: "",
  outlistSerial: "",
  description: "",
  glOutListDocNo: "",
  payeeName: "",
  serialNo: "",
  drawerName: "",
  bankCode: "",
  bankName: "",
  clgBranchCode: "",
  branchName: "",
  forBranchCode: "",
  forBranchName: "",
  amount: "",
  instrumentType: "",
  instrumentNo: "",
  instrumentDate: "",
  adviceNumber: "",
  originalResponding: "",
};

type RequiredFieldKey = keyof Pick<
  OutwardClearingEntryFormData,
  | "clearingTypeId"
  | "clearingTypeName"
  | "outwardScheduleNo"
  | "scheduleDate"
  | "accountCode"
  | "accountName"
  | "ledgerBalance"
  | "availableBalance"
  | "outlistSerial"
  | "description"
  | "glOutListDocNo"
  | "payeeName"
  | "serialNo"
  | "drawerName"
  | "bankCode"
  | "bankName"
  | "clgBranchCode"
  | "branchName"
  | "forBranchCode"
  | "forBranchName"
  | "amount"
  | "instrumentType"
  | "instrumentNo"
  | "instrumentDate"
  | "adviceNumber"
  | "originalResponding"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "clearingTypeId",
  "clearingTypeName",
  "outwardScheduleNo",
  "scheduleDate",
  "accountCode",
  "accountName",
  "ledgerBalance",
  "availableBalance",
  "outlistSerial",
  "description",
  "glOutListDocNo",
  "payeeName",
  "serialNo",
  "drawerName",
  "bankCode",
  "bankName",
  "clgBranchCode",
  "branchName",
  "forBranchCode",
  "forBranchName",
  "amount",
  "instrumentType",
  "instrumentNo",
  "instrumentDate",
  "adviceNumber",
  "originalResponding",
];

// Mock data for list modals
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

const OUTLIST_SERIAL_DATA: ListModalItem[] = [
  { id: "1", code: "OL001", name: "Outlist Serial 001" },
  { id: "2", code: "OL002", name: "Outlist Serial 002" },
  { id: "3", code: "OL003", name: "Outlist Serial 003" },
];

const INSTRUMENT_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "CHQ", name: "Cheque" },
  { id: "2", code: "DD", name: "Demand Draft" },
  { id: "3", code: "PO", name: "Pay Order" },
];

type ListType =
  | "clearingType"
  | "accountCode"
  | "bankCode"
  | "clgBranchCode"
  | "forBranchCode"
  | "outlistSerial"
  | "instrumentType";

export interface OutwardClearingEntryModalProps {
  open: boolean;
  initialData?: OutwardClearingEntryFormData;
  onClose?: () => void;
  onApply?: (data: OutwardClearingEntryFormData) => void;
}

function OutwardClearingEntryModal({
  open,
  initialData,
  onClose,
  onApply,
}: OutwardClearingEntryModalProps) {
  const defaultInitialData = useMemo(
    () => getDefaultOutwardClearingData(),
    [],
  );
  const [formData, setFormData] = useState<OutwardClearingEntryFormData>(
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

  const handleChange = <K extends keyof OutwardClearingEntryFormData>(
    key: K,
    value: OutwardClearingEntryFormData[K],
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

  const handleOpenList = (type: ListType) => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    // Use handleChange like in InwardClearingEntryModal
    switch (listType) {
      case "clearingType":
        handleChange("clearingTypeId", row.code);
        handleChange("clearingTypeName", row.name);
        break;
      case "accountCode":
        handleChange("accountCode", row.code);
        handleChange("accountName", row.name);
        break;
      case "bankCode":
        handleChange("bankCode", row.code);
        handleChange("bankName", row.name);
        break;
      case "clgBranchCode":
        handleChange("clgBranchCode", row.code);
        handleChange("branchName", row.name);
        break;
      case "forBranchCode":
        handleChange("forBranchCode", row.code);
        handleChange("forBranchName", row.name);
        break;
      case "outlistSerial":
        handleChange("outlistSerial", row.code);
        break;
      case "instrumentType":
        handleChange("instrumentType", row.code);
        break;
      default:
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
      case "bankCode":
        return {
          title: "Bank List",
          rows: BANK_DATA,
          codeLabel: "Bank Code",
          nameLabel: "Bank Name",
        };
      case "clgBranchCode":
      case "forBranchCode":
        return {
          title: "Branch List",
          rows: BRANCH_DATA,
          codeLabel: "Branch Code",
          nameLabel: "Branch Name",
        };
      case "outlistSerial":
        return {
          title: "Outlist Serial List",
          rows: OUTLIST_SERIAL_DATA,
          codeLabel: "Outlist Serial",
          nameLabel: "Description",
        };
      case "instrumentType":
        return {
          title: "Instrument Type List",
          rows: INSTRUMENT_TYPE_DATA,
          codeLabel: "Instrument Type",
          nameLabel: "Description",
        };
      default:
        return {
          title: "List",
          rows: [],
          codeLabel: "Code",
          nameLabel: "Name",
        };
    }
  };

  const listData = getListData();

  const getHeaderConfig = () => ({
    icon: ICONS.USER_CIRCLE,
    title: "Outward Clearing Entry",
    titleHi: "जावक क्लियरिंग नोंद",
    subtitle:
      "Record outward clearing cheque details and validate the transaction before posting.",
    subtitleHi: "जावक क्लियरिंग धनादेशाची माहिती नोंदवा व व्यवहार पडताळा.",
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
        label: "Cancel",
        onClick: onClose || (() => {}),
        variant: "outline" as const,
        icon: <X size={16} />,
      },
      {
        label: "Modify",
        onClick: handleApply,
        variant: "outline" as const,
        icon: <PenSquare size={16} />,
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
          subtitleEn="Select the clearing schedule and transaction date before processing."
          subtitleHi="व्यवहार करण्यापूर्वी क्लियरिंग वेळापत्रक व तारीख निवडा."
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
              readOnly={false}
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
              labelEn="Outward Schedule No"
              labelHi="जावक अनुसूची क्रमांक"
              icon={Hash}
              placeholder="Enter outward schedule number"
              value={formData.outwardScheduleNo}
              onChange={(v) => handleChange("outwardScheduleNo", v)}
              readOnly={true}
              hasError={errors.outwardScheduleNo}
              required={true}
            />

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

        {/* Account Details Section */}
        <SectionHeader
          icon={
            <img src={ICONS.USER_CIRCLE} alt="Account" className="h-10 w-10" />
          }
          titleEn="Account Details"
          titleHi="खात्याचा तपशील"
          subtitleEn="Verify the account and available balance for outward clearing."
          subtitleHi="जावक क्लियरिंगसाठी खाते व उपलब्ध शिल्लक तपशील."
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
              readOnly={false}
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
              labelEn="Available Balance"
              labelHi="उपलब्ध शिल्लक"
              icon={Banknote}
              placeholder="Enter available balance"
              value={formData.availableBalance}
              onChange={(v) => handleChange("availableBalance", v)}
              readOnly={true}
              hasError={errors.availableBalance}
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
          subtitleEn="Enter cheque, branch, instrument, and transaction information for outward clearing."
          subtitleHi="जावक क्लियरिंगसाठी धनादेश, शाखा, साधन व व्यवहाराची माहिती घेणे."
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <PickerInput
              labelEn="Outlist Serial"
              labelHi="आउटलिस्ट अनुक्रमांक"
              icon={HashIcon}
              placeholder="Enter outlist serial"
              value={formData.outlistSerial}
              onChange={(v) => handleChange("outlistSerial", v)}
              hasError={errors.outlistSerial}
              readOnly={false}
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
              labelEn="GL OutList Doc. No."
              labelHi="जीएल आउटलिस्ट दस्तऐवज क्र."
              icon={FileText}
              placeholder="Enter GL outlist document number"
              value={formData.glOutListDocNo}
              onChange={(v) => handleChange("glOutListDocNo", v)}
              readOnly={true}
              hasError={errors.glOutListDocNo}
              required={true}
            />

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

            <PickerInput
              labelEn="Bank Code"
              labelHi="बँक कोड"
              icon={Landmark}
              placeholder="Enter bank code"
              value={formData.bankCode}
              onChange={(v) => handleChange("bankCode", v)}
              hasError={errors.bankCode}
              readOnly={false}
              handleOpenList={() => handleOpenList("bankCode")}
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
              readOnly={false}
              handleOpenList={() => handleOpenList("clgBranchCode")}
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
              readOnly={false}
              handleOpenList={() => handleOpenList("forBranchCode")}
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

            <PickerInput
              labelEn="Instrument Type"
              labelHi="इन्स्ट्रुमेंट प्रकार"
              icon={ClipboardList}
              placeholder="Enter instrument type"
              value={formData.instrumentType}
              onChange={(v) => handleChange("instrumentType", v)}
              hasError={errors.instrumentType}
              readOnly={false}
              handleOpenList={() => handleOpenList("instrumentType")}
              required
            />

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

            <TextInput
              labelEn="Advice Number"
              labelHi="सल्ला क्रमांक"
              icon={FileSignature}
              placeholder="Enter advice number"
              value={formData.adviceNumber}
              onChange={(v) => handleChange("adviceNumber", v)}
              readOnly={true}
              hasError={errors.adviceNumber}
              required={true}
            />

            <TextInput
              labelEn="Original Responding"
              labelHi="मूळ / प्रतिसाद"
              icon={FileSignature}
              placeholder="Enter original responding"
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

export default OutwardClearingEntryModal;