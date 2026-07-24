import { useEffect, useState } from "react";
import { X, Check, ThumbsUp, Eye, Users, ChevronsDown } from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import TextInput from "@/components/shared/Inputs/TextInput";
import ListModal, { ListModalItem } from "@/components/shared/Modals/ListModal";

export interface LoanOverdueBalanceFormData {
  // Account Guarantor Records
  srNo: string;
  salutationCode: string;
  customerId: string;
  guarantorName: string;
  employeeId: string;
  memberNo: string;
  mobileNumber: string;
  birthDate: string;
  emailId: string;
  address1: string;
  address2: string;
  address3: string;
  zip: string;
  city: string;
  state: string;
  country: string;

  // Loan Account Information
  branchCode: string;
  branchName: string;
  date: string;
  accountCode: string;
  accountName: string;
  phoneNo: string;
  address: string;
  ledgerBalance: string;
  availableBalance: string;

  // Overdue & Recovery Details
  overdueBalance: string;
  advance: string;
  charges: string;
  unaccountedAmount: string;
  overdueInterestReceivable: string;
  interestReceivable: string;
  rateOfInterest: string;
  totalOverdue: string;
  sanctionDate: string;
  accountReviewDate: string;
  resolutionNo: string;
  installmentAmount: string;
}

export const emptyLoanOverdueBalanceFormData: LoanOverdueBalanceFormData = {
  // Account Guarantor Records
  srNo: "1",
  salutationCode: "MR",
  customerId: "00022",
  guarantorName: "Karan Mangesh Patil",
  employeeId: "0001",
  memberNo: "21897",
  mobileNumber: "9876545678",
  birthDate: "12-Jun-2001",
  emailId: "Akshay12@gmail.com",
  address1: "Kolhapur",
  address2: "Kolhapur",
  address3: "Kolhapur",
  zip: "416005",
  city: "Kolhapur",
  state: "Maharashtra",
  country: "India",

  // Loan Account Information
  branchCode: "",
  branchName: "",
  date: "",
  accountCode: "",
  accountName: "",
  phoneNo: "",
  address: "",
  ledgerBalance: "",
  availableBalance: "",

  // Overdue & Recovery Details
  overdueBalance: "",
  advance: "",
  charges: "",
  unaccountedAmount: "",
  overdueInterestReceivable: "",
  interestReceivable: "",
  rateOfInterest: "",
  totalOverdue: "",
  sanctionDate: "",
  accountReviewDate: "",
  resolutionNo: "",
  installmentAmount: "",
};

export type LoanOverdueBalanceMode = "view" | "edit";

type RequiredFieldKey = keyof Pick<
  LoanOverdueBalanceFormData,
  | "srNo"
  | "salutationCode"
  | "customerId"
  | "guarantorName"
  | "employeeId"
  | "memberNo"
  | "mobileNumber"
  | "birthDate"
  | "emailId"
  | "address1"
  | "address2"
  | "address3"
  | "zip"
  | "city"
  | "state"
  | "country"
  | "branchCode"
  | "branchName"
  | "date"
  | "accountCode"
  | "accountName"
  | "phoneNo"
  | "address"
  | "ledgerBalance"
  | "availableBalance"
  | "overdueBalance"
  | "advance"
  | "charges"
  | "unaccountedAmount"
  | "overdueInterestReceivable"
  | "interestReceivable"
  | "rateOfInterest"
  | "totalOverdue"
  | "sanctionDate"
  | "accountReviewDate"
  | "resolutionNo"
  | "installmentAmount"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "srNo",
  "salutationCode",
  "customerId",
  "guarantorName",
  "employeeId",
  "memberNo",
  "mobileNumber",
  "emailId",
  "address1",
  "address2",
  "zip",
  "city",
  "state",
  "country",
  "branchCode",
  "branchName",
  "date",
  "accountCode",
  "accountName",
  "phoneNo",
  "address",
  "ledgerBalance",
  "availableBalance",
  "overdueBalance",
  "advance",
  "charges",
  "unaccountedAmount",
  "overdueInterestReceivable",
  "interestReceivable",
  "rateOfInterest",
  "totalOverdue",
  "sanctionDate",
  "accountReviewDate",
  "resolutionNo",
  "installmentAmount",
];

// Sample data for pickers
const BRANCH_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "BR001", name: "Mumbai Main Branch" },
  { id: "2", code: "BR002", name: "Delhi Branch" },
  { id: "3", code: "BR003", name: "Bangalore Branch" },
  { id: "4", code: "BR004", name: "Chennai Branch" },
];

const ACCOUNT_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "ACC001", name: "John Doe" },
  { id: "2", code: "ACC002", name: "Jane Smith" },
  { id: "3", code: "ACC003", name: "Robert Johnson" },
  { id: "4", code: "ACC004", name: "Mary Williams" },
];

const SALUTATION_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "MR", name: "Mr." },
  { id: "2", code: "MS", name: "Ms." },
  { id: "3", code: "MRS", name: "Mrs." },
  { id: "4", code: "DR", name: "Dr." },
];

export interface LoanOverdueBalanceProps {
  open: boolean;
  mode?: LoanOverdueBalanceMode;
  initialData?: LoanOverdueBalanceFormData;
  onClose?: () => void;
  onApply?: (data: LoanOverdueBalanceFormData) => void;
  onDisplayBalance?: () => void;
  onDisplayGuarantor?: () => void;
}

function LoanOverdueBalance({
  open,
  mode = "view",
  initialData = emptyLoanOverdueBalanceFormData,
  onClose,
  onApply,
  onDisplayBalance,
  onDisplayGuarantor,
}: LoanOverdueBalanceProps) {
  const [formData, setFormData] =
    useState<LoanOverdueBalanceFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<
    "branchCode" | "accountCode" | "salutationCode"
  >("branchCode");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof LoanOverdueBalanceFormData>(
    key: K,
    value: LoanOverdueBalanceFormData[K],
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

  const handleOpenList = (type: typeof listType) => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: Record<string, any>) => {
    if (listType === "branchCode") {
      handleChange("branchCode", row.code);
      handleChange("branchName", row.name);
    } else if (listType === "accountCode") {
      handleChange("accountCode", row.code);
      handleChange("accountName", row.name);
    } else if (listType === "salutationCode") {
      handleChange("salutationCode", row.code);
    }
    setOpenList(false);
  };

  const getListData = () => {
    if (listType === "branchCode") {
      return {
        title: "Branch List",
        rows: BRANCH_CODE_DATA,
        codeLabel: "Branch Code",
        nameLabel: "Branch Name",
      };
    } else if (listType === "accountCode") {
      return {
        title: "Account List",
        rows: ACCOUNT_CODE_DATA,
        codeLabel: "Account Code",
        nameLabel: "Account Name",
      };
    } else {
      return {
        title: "Salutation List",
        rows: SALUTATION_CODE_DATA,
        codeLabel: "Code",
        nameLabel: "Salutation",
      };
    }
  };

  const listData = getListData();

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "Loan Overdue Balance",
    titleHi: "सभी लेन-देन की सूची",
    subtitle:
      "View loan account information, overdue balance and receivable details.",
    subtitleHi:
      "कर्ज खात्याची माहिती, थकबाकी सिल्लक आणि प्राप्तीची माहिती पडा.",
    onClose: onClose,
    showCloseButton: true,
  });

  // Define footer buttons
  const getFooterButtons = () => {
    if (isView) {
      return [
        {
          label: "Display Balance",
          onClick: onDisplayBalance || (() => {}),
          variant: "primary" as const,
          icon: <Eye size={16} />,
          //   className: "bg-[#F3F4FB] text-[#0B63C1] hover:bg-[#E8EDF8]",
        },
        {
          label: "Display Guarantor",
          onClick: onDisplayGuarantor || (() => {}),
          variant: "outline" as const,
          icon: <ChevronsDown size={16} />,
          disabled: !validated,
          className: validated
            ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
            : "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200",
        },
        {
          label: "Cancel",
          onClick: onClose || (() => {}),
          variant: "outline" as const,
          icon: <X size={16} />,
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
        label: "Cancel",
        onClick: onClose || (() => {}),
        variant: "outline" as const,
        icon: <X size={16} />,
      },
      {
        label: "Save",
        onClick: handleApply,
        variant: "primary" as const,
        icon: <Check size={16} />,
        disabled: !validated,
        className: validated
          ? "bg-primary-100 text-primary hover:bg-primary-200"
          : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
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
        maxWidth="full"
      >
        {/* Account Guarantor Records Section - FIRST */}
        <SectionWrapper
          icon={
            <img
              src={ICONS.PERSON}
              alt="Account Guarantor Records"
              className="h-10 w-10"
            />
          }
          titleEn="Account Guarantor Records"
          titleHi="थकबाकी व वसुली तपशील"
          subtitleEn="Review overdue amount, receivable interest and recovery-related information."
          subtitleHi="थकबाकी, प्राप्त व्याज व वसुलीची संबंधित माहिती तपासा."
          className="mb-6"
        >
          <div className="grid grid-cols-4 gap-4">
            {/* Sr No */}
            <TextInput
              labelEn="Sr No"
              labelHi="अनुक्रमांक"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Sr No"
              value={formData.srNo}
              onChange={(v) => handleChange("srNo", v)}
              readOnly={isView}
              required
              hasError={errors.srNo}
            />

            {/* Salutation Code */}
            <PickerInput
              labelEn="Salutation Code"
              labelHi="संबंधीत"
              icon={ICONS.USER_CIRCLE}
              placeholder="Select Salutation"
              value={formData.salutationCode}
              onChange={(v) => handleChange("salutationCode", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("salutationCode")}
              required
              hasError={errors.salutationCode}
            />

            {/* Customer ID */}
            <TextInput
              labelEn="Customer ID"
              labelHi="प्राप्त क्रमांक"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Customer ID"
              value={formData.customerId}
              onChange={(v) => handleChange("customerId", v)}
              readOnly={isView}
              required
              hasError={errors.customerId}
            />

            {/* Guarantor Name */}
            <TextInput
              labelEn="Guarantor Name"
              labelHi="खात्याचे देशाच्या नाव"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Guarantor Name"
              value={formData.guarantorName}
              onChange={(v) => handleChange("guarantorName", v)}
              readOnly={isView}
              required
              hasError={errors.guarantorName}
            />

            {/* Employee ID */}
            <TextInput
              labelEn="Employee ID"
              labelHi="कर्मचारी आयडी"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Employee ID"
              value={formData.employeeId}
              onChange={(v) => handleChange("employeeId", v)}
              readOnly={isView}
              required
              hasError={errors.employeeId}
            />

            {/* Member No */}
            <TextInput
              labelEn="Member No."
              labelHi="संख्या क्र."
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Member No"
              value={formData.memberNo}
              onChange={(v) => handleChange("memberNo", v)}
              readOnly={isView}
              required
              hasError={errors.memberNo}
            />

            {/* Mobile Number */}
            <TextInput
              labelEn="Mobile Number"
              labelHi="मोबाईल नंबर"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Mobile Number"
              value={formData.mobileNumber}
              onChange={(v) => handleChange("mobileNumber", v)}
              readOnly={isView}
              required
              hasError={errors.mobileNumber}
            />

            {/* Birth Date */}
            <TextInput
              labelEn="Birth Date"
              labelHi="जन्म तारीख"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Select Birth Date"
              value={formData.birthDate}
              onChange={(v) => handleChange("birthDate", v)}
              readOnly={isView}
              hasError={errors.birthDate}
            />

            {/* Email ID */}
            <TextInput
              labelEn="Email ID"
              labelHi="ईमेल आयडी"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Email ID"
              value={formData.emailId}
              onChange={(v) => handleChange("emailId", v)}
              readOnly={isView}
              required
              hasError={errors.emailId}
            />

            {/* Address 1 */}
            <TextInput
              labelEn="Address 1"
              labelHi="पत्ता 1"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Address 1"
              value={formData.address1}
              onChange={(v) => handleChange("address1", v)}
              readOnly={isView}
              required
              hasError={errors.address1}
            />

            {/* Address 2 */}
            <TextInput
              labelEn="Address 2"
              labelHi="पत्ता 2"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Address 2"
              value={formData.address2}
              onChange={(v) => handleChange("address2", v)}
              readOnly={isView}
              required
              hasError={errors.address2}
            />

            {/* Address 3 */}
            <TextInput
              labelEn="Address 3"
              labelHi="पत्ता 3"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Address 3"
              value={formData.address3}
              onChange={(v) => handleChange("address3", v)}
              readOnly={isView}
              hasError={errors.address3}
            />

            {/* Zip */}
            <TextInput
              labelEn="Zip"
              labelHi="पिन कोड"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Zip Code"
              value={formData.zip}
              onChange={(v) => handleChange("zip", v)}
              readOnly={isView}
              required
              hasError={errors.zip}
            />

            {/* City */}
            <TextInput
              labelEn="City"
              labelHi="शहर"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter City"
              value={formData.city}
              onChange={(v) => handleChange("city", v)}
              readOnly={isView}
              required
              hasError={errors.city}
            />

            {/* State */}
            <TextInput
              labelEn="State"
              labelHi="राज्य"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter State"
              value={formData.state}
              onChange={(v) => handleChange("state", v)}
              readOnly={isView}
              required
              hasError={errors.state}
            />

            {/* Country */}
            <TextInput
              labelEn="Country"
              labelHi="देश"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Country"
              value={formData.country}
              onChange={(v) => handleChange("country", v)}
              readOnly={isView}
              required
              hasError={errors.country}
            />
          </div>
        </SectionWrapper>

        {/* Loan Account Information Section - SECOND */}
        <SectionWrapper
          icon={
            <img
              src={ICONS.PERSON}
              alt="Loan Account Information"
              className="h-10 w-10"
            />
          }
          titleEn="Loan Account Information"
          titleHi="कर्ज खाते माहिती"
          subtitleEn="Identify the loan account and review customer information before checking overdue details."
          subtitleHi="थकबाकी तपासण्याची कर्ज खाते व शहकाची माहिती पडतात."
          className="mb-6"
        >
          <div className="grid grid-cols-3 gap-4">
            {/* Branch Code */}
            <PickerInput
              labelEn="Branch Code"
              labelHi="शाखा कोड"
              icon={ICONS.USER_CIRCLE}
              placeholder="Select Branch"
              value={formData.branchCode}
              onChange={(v) => handleChange("branchCode", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("branchCode")}
              required
              hasError={errors.branchCode}
            />

            {/* Branch Name */}
            <TextInput
              labelEn="Branch Name"
              labelHi="शाखा नाव"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Branch Name"
              value={formData.branchName}
              onChange={(v) => handleChange("branchName", v)}
              readOnly={isView}
              required
              hasError={errors.branchName}
            />

            {/* Date */}
            <TextInput
              labelEn="Date"
              labelHi="तारीख"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Select Date"
              value={formData.date}
              onChange={(v) => handleChange("date", v)}
              readOnly={isView}
              required
              hasError={errors.date}
            />

            {/* Account Code */}
            <PickerInput
              labelEn="Account Code"
              labelHi="खाते कोड"
              icon={ICONS.USER_CIRCLE}
              placeholder="Select Account"
              value={formData.accountCode}
              onChange={(v) => handleChange("accountCode", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("accountCode")}
              required
              hasError={errors.accountCode}
            />

            {/* Account Name */}
            <TextInput
              labelEn="Account Name"
              labelHi="खाते नाव"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Account Name"
              value={formData.accountName}
              onChange={(v) => handleChange("accountName", v)}
              readOnly={isView}
              required
              hasError={errors.accountName}
            />

            {/* Phone No */}
            <TextInput
              labelEn="Phone No"
              labelHi="फोन नंबर"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Phone Number"
              value={formData.phoneNo}
              onChange={(v) => handleChange("phoneNo", v)}
              readOnly={isView}
              required
              hasError={errors.phoneNo}
            />

            {/* Address */}
            <TextInput
              labelEn="Address"
              labelHi="पत्ता"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Address"
              value={formData.address}
              onChange={(v) => handleChange("address", v)}
              readOnly={isView}
              required
              hasError={errors.address}
            />

            {/* Ledger Balance */}
            <TextInput
              labelEn="Ledger Balance"
              labelHi="लेजर शिल्लक"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Ledger Balance"
              value={formData.ledgerBalance}
              onChange={(v) => handleChange("ledgerBalance", v)}
              readOnly={isView}
              required
              hasError={errors.ledgerBalance}
            />

            {/* Available Balance */}
            <TextInput
              labelEn="Available Balance"
              labelHi="उपलब्ध शिल्लक"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Available Balance"
              value={formData.availableBalance}
              onChange={(v) => handleChange("availableBalance", v)}
              readOnly={isView}
              required
              hasError={errors.availableBalance}
            />
          </div>
        </SectionWrapper>

        {/* Overdue & Recovery Details Section - THIRD */}
        <SectionWrapper
          icon={
            <img
              src={ICONS.PERSON}
              alt="Overdue & Recovery Details"
              className="h-10 w-10"
            />
          }
          titleEn="Overdue & Recovery Details"
          titleHi="थकबाकी व वसुली तपशील"
          subtitleEn="Review overdue amount, receivable interest and recovery-related information."
          subtitleHi="थकबाकी, प्राप्त व्याज व वसुलीची संबंधित नाहिती तपशील."
          className="mb-6"
        >
          <div className="grid grid-cols-3 gap-4">
            {/* Overdue Balance */}
            <TextInput
              labelEn="Overdue Balance"
              labelHi="थकबाकी शिल्लक"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Overdue Balance"
              value={formData.overdueBalance}
              onChange={(v) => handleChange("overdueBalance", v)}
              readOnly={isView}
              required
              hasError={errors.overdueBalance}
            />

            {/* Advance */}
            <TextInput
              labelEn="Advance"
              labelHi="आगाऊ"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Advance Amount"
              value={formData.advance}
              onChange={(v) => handleChange("advance", v)}
              readOnly={isView}
              required
              hasError={errors.advance}
            />

            {/* Charges */}
            <TextInput
              labelEn="Charges"
              labelHi="शुल्क"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Charges"
              value={formData.charges}
              onChange={(v) => handleChange("charges", v)}
              readOnly={isView}
              required
              hasError={errors.charges}
            />

            {/* Unaccounted Amount */}
            <TextInput
              labelEn="Unaccounted Amount"
              labelHi="बेहिशाबी रक्कम"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Unaccounted Amount"
              value={formData.unaccountedAmount}
              onChange={(v) => handleChange("unaccountedAmount", v)}
              readOnly={isView}
              required
              hasError={errors.unaccountedAmount}
            />

            {/* Overdue Interest Receivable */}
            <TextInput
              labelEn="Overdue Interest Receivable"
              labelHi="थकबाकी व्याज प्राप्य"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Overdue Interest"
              value={formData.overdueInterestReceivable}
              onChange={(v) => handleChange("overdueInterestReceivable", v)}
              readOnly={isView}
              required
              hasError={errors.overdueInterestReceivable}
            />

            {/* Interest Receivable */}
            <TextInput
              labelEn="Interest Receivable"
              labelHi="व्याज प्राप्य"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Interest Receivable"
              value={formData.interestReceivable}
              onChange={(v) => handleChange("interestReceivable", v)}
              readOnly={isView}
              required
              hasError={errors.interestReceivable}
            />

            {/* Rate of Interest */}
            <TextInput
              labelEn="Rate of Interest"
              labelHi="व्याज दर"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Rate of Interest"
              value={formData.rateOfInterest}
              onChange={(v) => handleChange("rateOfInterest", v)}
              readOnly={isView}
              required
              hasError={errors.rateOfInterest}
            />

            {/* Total Overdue */}
            <TextInput
              labelEn="Total Overdue"
              labelHi="एकूण थकबाकी"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Total Overdue"
              value={formData.totalOverdue}
              onChange={(v) => handleChange("totalOverdue", v)}
              readOnly={isView}
              required
              hasError={errors.totalOverdue}
            />

            {/* Sanction Date */}
            <TextInput
              labelEn="Sanction Date"
              labelHi="मंजूरी तारीख"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Select Sanction Date"
              value={formData.sanctionDate}
              onChange={(v) => handleChange("sanctionDate", v)}
              readOnly={isView}
              required
              hasError={errors.sanctionDate}
            />

            {/* Account Review Date */}
            <TextInput
              labelEn="Account Review Date"
              labelHi="खाते पुनरावलोकन तारीख"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Select Review Date"
              value={formData.accountReviewDate}
              onChange={(v) => handleChange("accountReviewDate", v)}
              readOnly={isView}
              required
              hasError={errors.accountReviewDate}
            />

            {/* Resolution No */}
            <TextInput
              labelEn="Resolution No"
              labelHi="ठराव क्रमांक"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Resolution No"
              value={formData.resolutionNo}
              onChange={(v) => handleChange("resolutionNo", v)}
              readOnly={isView}
              required
              hasError={errors.resolutionNo}
            />

            {/* Installment Amount */}
            <TextInput
              labelEn="Installment Amount"
              labelHi="हप्ता रक्कम"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Installment Amount"
              value={formData.installmentAmount}
              onChange={(v) => handleChange("installmentAmount", v)}
              readOnly={isView}
              required
              hasError={errors.installmentAmount}
            />
          </div>
        </SectionWrapper>
      </ModalWrapper>

      {/* List Modal */}
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
    </>
  );
}

export default LoanOverdueBalance;
