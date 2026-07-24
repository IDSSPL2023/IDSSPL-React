import { useEffect, useState, useMemo } from "react";
import { X, Check, ThumbsUp, User, Landmark, Calendar, CreditCard, FileText, Hash, IndianRupee, Percent, ClipboardList, Calculator, Building2, Search, ChevronRight } from "lucide-react";
import TextInput from "@/components/shared/Inputs/TextInput";
import DateInput from "@/components/shared/Inputs/DateInput";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS, IMAGES } from "@/assets";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import SelectInput from "@/components/shared/Inputs/SelectInput";
import RadioInput from "@/components/shared/Inputs/RadioInput";
import ListModal, { type ListModalItem } from "@/components/shared/Modals/ListModal";
import { useRouter } from "@/lib/navigation";
import Image from "@/components/ui/Image";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import CustomerIdPicklistField, { CustomerOption } from "@/components/common/CustomerIdPicklistField";
// import CustomerIdPicklistField, { type CustomerOption } from "./CustomerIdPicklistField";

/* ===== from FlagUpdation.tsx ===== */
export interface FlagUpdation_CustomerTDSFlagFormData {
  fromBranchCode: string;
  toBranchCode: string;
  fromDate: string;
  toDate: string;
  payableFromDate: string;
  payableToDate: string;
}

export const FlagUpdation_emptyCustomerTDSFlagFormData: FlagUpdation_CustomerTDSFlagFormData = {
  fromBranchCode: "0002",
  toBranchCode: "0007",
  fromDate: "2026-04-01",
  toDate: "2026-06-01",
  payableFromDate: "2026-01-01",
  payableToDate: "2026-05-30",
};

export type FlagUpdation_CustomerTDSFlagModalMode = "add" | "view";

type FlagUpdation_RequiredFieldKey = keyof FlagUpdation_CustomerTDSFlagFormData;

const FlagUpdation_REQUIRED_FIELDS: FlagUpdation_RequiredFieldKey[] = [
  "fromBranchCode",
  "toBranchCode",
  "fromDate",
  "toDate",
  "payableFromDate",
  "payableToDate",
];

export interface FlagUpdation_CustomerTDSFlagModalProps {
  open: boolean;
  mode?: FlagUpdation_CustomerTDSFlagModalMode;
  initialData?: FlagUpdation_CustomerTDSFlagFormData;
  onClose?: () => void;
  onApply?: (data: FlagUpdation_CustomerTDSFlagFormData) => void;
}

function CustomerTDSFlagModal({
  open,
  mode = "add",
  initialData = FlagUpdation_emptyCustomerTDSFlagFormData,
  onClose,
  onApply,
}: FlagUpdation_CustomerTDSFlagModalProps) {
  const [formData, setFormData] =
    useState<FlagUpdation_CustomerTDSFlagFormData>(initialData);
  const [validated, setValidated] = useState(true); // Start as validated
  const [errors, setErrors] = useState<
    Partial<Record<FlagUpdation_RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setValidated(true); // Reset to true when data changes
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof FlagUpdation_CustomerTDSFlagFormData>(
    key: K,
    value: FlagUpdation_CustomerTDSFlagFormData[K],
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as FlagUpdation_RequiredFieldKey])
      setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<FlagUpdation_RequiredFieldKey, boolean>> = {};
    FlagUpdation_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
  };

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "Customer TDS Flag Updation",
    titleHi: "ग्राहक TDS फ्लॅग अद्यतनित करणे",
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
        label: "Cancel",
        onClick: onClose || (() => {}),
        variant: "outline" as const,
        icon: <X size={16} />,
      },
      {
        label: "Update",
        onClick: handleApply,
        variant: "primary" as const,
        icon: <img src={ICONS.UPDATE} />,
        className: "bg-[#F3F4FB] text-[#0B63C1]",
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
        maxWidth="4xl"
      >
        <SectionWrapper>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* From Branch Code - Always readOnly */}
            <TextInput
              labelEn="From Branch Code"
              labelHi="शाखा कोड पासून"
              icon={Landmark}
              placeholder="Enter Branch Code"
              value={formData.fromBranchCode}
              onChange={(v) => handleChange("fromBranchCode", v)}
              hasError={errors.fromBranchCode}
              readOnly={true}
            />

            {/* To Branch Code - Always readOnly */}
            <TextInput
              labelEn="To Branch Code"
              labelHi="शाखा कोड पर्यंत"
              icon={Landmark}
              placeholder="Enter Branch Code"
              value={formData.toBranchCode}
              onChange={(v) => handleChange("toBranchCode", v)}
              hasError={errors.toBranchCode}
              readOnly={true}
            />

            {/* From Date - Always readOnly */}
            <DateInput
              labelEn="From Date"
              labelHi="पासून दिनांक"
              icon={Calendar}
              value={formData.fromDate}
              onChange={(v) => handleChange("fromDate", v)}
              hasError={errors.fromDate}
              readOnly={true}
            />

            {/* To Date - Always readOnly */}
            <DateInput
              labelEn="To Date"
              labelHi="पर्यंत दिनांक"
              icon={Calendar}
              value={formData.toDate}
              onChange={(v) => handleChange("toDate", v)}
              hasError={errors.toDate}
              readOnly={true}
            />

            {/* Payable From Date - Always readOnly */}
            <DateInput
              labelEn="Payable From Date"
              labelHi="देय दिनांकापासून"
              icon={Calendar}
              value={formData.payableFromDate}
              onChange={(v) => handleChange("payableFromDate", v)}
              hasError={errors.payableFromDate}
              readOnly={true}
            />

            {/* Payable To Date - Always readOnly */}
            <DateInput
              labelEn="Payable To Date"
              labelHi="देय दिनांकापर्यंत"
              icon={Calendar}
              value={formData.payableToDate}
              onChange={(v) => handleChange("payableToDate", v)}
              hasError={errors.payableToDate}
              readOnly={true}
            />
          </div>
        </SectionWrapper>
      </ModalWrapper>
    </>
  );
}


/* ===== from ReportAll.tsx ===== */
export interface ReportAll_TDSReportAllFormData {
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
  fromSelect: string;
}

export const ReportAll_emptyTDSReportAllFormData: ReportAll_TDSReportAllFormData = {
  accountType: "TD",
  description: "Term Deposit",
  productCode: "TD",
  productDescription: "Product Descir",
  interestDepositCode: "TD",
  customerId: "TD",
  customerName: "name@company.com",
  fromDate: "2026-04-01",
  toDate: "2026-06-01",
  tdsAmount: "10000",
  tdsRate: "10",
  payableFromDate: "2026-05-12",
  payableToDate: "2026-05-12",
  reportTypeSelect: "Details",
  memberSelect: "All",
  reportType: "pdf",
  amountSelect: "above",
  fromSelect: "15G",
};

export type ReportAll_TDSReportAllModalMode = "add" | "view";

type ReportAll_RequiredFieldKey = keyof Pick<
  ReportAll_TDSReportAllFormData,
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

const ReportAll_REQUIRED_FIELDS: ReportAll_RequiredFieldKey[] = [
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

type ReportAll_ListType =
  | "accountType"
  | "productCode"
  | "interestDepositCode";

const ReportAll_ACCOUNT_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "TD", name: "Term Deposit" },
  { id: "2", code: "SB", name: "Savings Bank" },
  { id: "3", code: "RD", name: "Recurring Deposit" },
  { id: "4", code: "CA", name: "Current Account" },
];

const ReportAll_PRODUCT_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "TD", name: "Term Deposit Product" },
  { id: "2", code: "FD", name: "Fixed Deposit Product" },
  { id: "3", code: "MIS", name: "Monthly Income Scheme" },
];

const ReportAll_INTEREST_DEPOSIT_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "TD", name: "Term Deposit Interest" },
  { id: "2", code: "QLY", name: "Quarterly Interest" },
  { id: "3", code: "MLY", name: "Monthly Interest" },
];

const ReportAll_REPORT_TYPE_OPTIONS = ["Details", "Summary"];

export interface ReportAll_TDSReportAllModalProps {
  open: boolean;
  mode?: ReportAll_TDSReportAllModalMode;
  initialData?: ReportAll_TDSReportAllFormData;
  onClose?: () => void;
  onApply?: (data: ReportAll_TDSReportAllFormData) => void;
}

function TDSReportAllModal({
  open,
  mode = "add",
  initialData = ReportAll_emptyTDSReportAllFormData,
  onClose,
  onApply,
}: ReportAll_TDSReportAllModalProps) {
  const [formData, setFormData] = useState<ReportAll_TDSReportAllFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<ReportAll_RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<ReportAll_ListType>("accountType");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof ReportAll_TDSReportAllFormData>(
    key: K,
    value: ReportAll_TDSReportAllFormData[K],
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as ReportAll_RequiredFieldKey])
      setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<ReportAll_RequiredFieldKey, boolean>> = {};
    ReportAll_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  const handleOpenList = (type: ReportAll_ListType) => {
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
    }
    setOpenList(false);
  };

  // Handle customer selection from picklist
  const handleCustomerSelect = (customer: CustomerOption) => {
    handleChange("customerId", customer.customerId);
    handleChange("customerName", customer.customerName);
  };

  const getListData = () => {
    switch (listType) {
      case "accountType":
        return {
          title: "Account Type List",
          rows: ReportAll_ACCOUNT_TYPE_DATA,
          codeLabel: "Account Type",
          nameLabel: "Description",
        };
      case "productCode":
        return {
          title: "Product Code List",
          rows: ReportAll_PRODUCT_CODE_DATA,
          codeLabel: "Product Code",
          nameLabel: "Product Description",
        };
      case "interestDepositCode":
        return {
          title: "Interest Paid in Deposit Code List",
          rows: ReportAll_INTEREST_DEPOSIT_CODE_DATA,
          codeLabel: "Code",
          nameLabel: "Description",
        };
    }
  };

  const listData = getListData();

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "TDS Report All",
    titleHi: "सर्व TDS अहवाल",
    subtitle: "View the parameter information and associated details.",
    subtitleHi: "परिमाणीय माहिती आणि संबंधित तपशील पहा.",
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Account Type */}
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

            {/* Product Code */}
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

            {/* Interest Paid in Deposit Code */}
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

            {/* Customer ID - Picklist only in add mode; plain readOnly in view mode */}
            {isView ? (
              <TextInput
                labelEn="Customer ID"
                labelHi="ग्राहक आयडी"
                icon={User}
                placeholder="Customer ID"
                value={formData.customerId}
                onChange={() => {}}
                required={false}
                readOnly
              />
            ) : (
              <div className="flex flex-col">
                <CustomerIdPicklistField
                  label="Customer ID"
                  labelHi="ग्राहक आयडी"
                  value={formData.customerId}
                  placeholder="Select Customer"
                  onSelect={handleCustomerSelect}
                  preFetch={false}
                  pageSize={10}
                  error={errors.customerId ? "Customer ID is required" : ""}
                />
              </div>
            )}

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

            {/* From Date */}
            <DateInput
              labelEn="From Date"
              labelHi="पासून दिनांक"
              value={formData.fromDate}
              onChange={(v) => handleChange("fromDate", v)}
              hasError={errors.fromDate}
              readOnly={true}
            />

            {/* To Date */}
            <DateInput
              labelEn="To Date"
              labelHi="पर्यंत दिनांक"
              value={formData.toDate}
              onChange={(v) => handleChange("toDate", v)}
              hasError={errors.toDate}
              readOnly={true}
            />

            {/* TDS Amount */}
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

            {/* TDS Rate */}
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

            {/* Payable From Date */}
            <DateInput
              labelEn="Payable From Date"
              labelHi="देय दिनांकापासून"
              value={formData.payableFromDate}
              onChange={(v) => handleChange("payableFromDate", v)}
              hasError={errors.payableFromDate}
              readOnly={isView}
            />

            {/* Payable To Date */}
            <DateInput
              labelEn="Payable To Date"
              labelHi="देय दिनांकापर्यंत"
              value={formData.payableToDate}
              onChange={(v) => handleChange("payableToDate", v)}
              hasError={errors.payableToDate}
              readOnly={isView}
            />

            {/* Report Type Select */}
            <SelectInput
              labelEn="Report Type Select"
              labelMr="अहवाल प्रकार निवडा"
              icon={ClipboardList}
              value={formData.reportTypeSelect}
              options={ReportAll_REPORT_TYPE_OPTIONS}
              onChange={(v) => handleChange("reportTypeSelect", v)}
              required
              editable={!isView}
            />

            <RadioInput
              label="Select"
              labelHi="नियंत्रण"
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
                  label: "PDF",
                },
                {
                  value: "xls",
                  icon: ICONS.XLS,
                  label: "XLS",
                },
              ]}
            />

            <RadioInput
              label="Select"
              labelHi="नियंत्रण"
              value={formData.amountSelect}
              onChange={(v) => handleChange("amountSelect", v)}
              disabled={isView}
              options={[
                { value: "above", label: "Above Amount" },
                { value: "less", label: "Less Amount" },
              ]}
            />

            <RadioInput
              label="From Select"
              labelHi="म्यूज नियंत्रण"
              value={formData.fromSelect}
              onChange={(v) => handleChange("fromSelect", v)}
              disabled={isView}
              options={["15G", "15H"]}
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


/* ===== from AppliedReport.tsx ===== */
export interface AppliedReport_TDSAppliedReportFormData {
  fromBranch: string;
  toBranch: string;
  fromDate: string;
  toDate: string;
  tdsRate: string;
  branchName: string;
  description: string;
  reportType: string;
}

export const AppliedReport_emptyTDSAppliedReportFormData: AppliedReport_TDSAppliedReportFormData = {
  fromBranch: "",
  toBranch: "",
  fromDate: "",
  toDate: "",
  tdsRate: "",
  branchName: "",
  description: "",
  reportType: "pdf",
};

export type AppliedReport_TDSAppliedReportModalMode = "add" | "view";

type AppliedReport_RequiredFieldKey = keyof Pick<
  AppliedReport_TDSAppliedReportFormData,
  "fromBranch" | "toBranch" | "fromDate" | "toDate" | "tdsRate"
>;

const AppliedReport_REQUIRED_FIELDS: AppliedReport_RequiredFieldKey[] = [
  "fromBranch",
  "toBranch",
  "fromDate",
  "toDate",
  "tdsRate",
];

type AppliedReport_ListType = "fromBranch" | "toBranch";

const AppliedReport_BRANCH_DATA: ListModalItem[] = [
  { id: "1", code: "001", name: "Main Branch" },
  { id: "2", code: "002", name: "Ikkal Branch" },
  { id: "3", code: "003", name: "Mudhol Branch" },
  { id: "4", code: "004", name: "Ramdurg Branch" },
  { id: "5", code: "005", name: "Belgaum Branch" },
];

const AppliedReport_REPORT_TYPE_OPTIONS = ["PDF", "TXT"];

export interface AppliedReport_TDSAppliedReportModalProps {
  open: boolean;
  mode?: AppliedReport_TDSAppliedReportModalMode;
  initialData?: AppliedReport_TDSAppliedReportFormData;
  onClose?: () => void;
  onApply?: (data: AppliedReport_TDSAppliedReportFormData) => void;
}

function TDSAppliedReportModal({
  open,
  mode = "add",
  initialData = AppliedReport_emptyTDSAppliedReportFormData,
  onClose,
  onApply,
}: AppliedReport_TDSAppliedReportModalProps) {
  const [formData, setFormData] =
    useState<AppliedReport_TDSAppliedReportFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<AppliedReport_RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<AppliedReport_ListType>("fromBranch");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof AppliedReport_TDSAppliedReportFormData>(
    key: K,
    value: AppliedReport_TDSAppliedReportFormData[K],
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as AppliedReport_RequiredFieldKey])
      setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<AppliedReport_RequiredFieldKey, boolean>> = {};
    AppliedReport_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  const handleOpenList = (type: AppliedReport_ListType) => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    if (listType === "fromBranch") {
      handleChange("fromBranch", row.code);
      handleChange("branchName", row.name);
    } else {
      handleChange("toBranch", row.code);
      handleChange("description", row.name);
    }
    setOpenList(false);
  };

  const getListData = () => {
    return {
      title: listType === "fromBranch" ? "From Branch List" : "To Branch List",
      rows: AppliedReport_BRANCH_DATA,
      codeLabel: "Branch Code",
      nameLabel: "Branch Name",
    };
  };

  const listData = getListData();

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "TDS Applied Report",
    titleHi: "ठेव व्याज नोंदणी",
    subtitle: "Process interest posting for eligible deposit accounts.",
    subtitleHi: "पात्र ठेव खात्यांसाठी व्याज नोंदणी प्रक्रिया करा.",
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
        maxWidth="4xl"
      >
        <SectionWrapper>
          <div className="grid grid-cols-2 gap-4">
            {/* From Branch */}
            <PickerInput
              labelEn="From Branch"
              labelHi="उत्पादन कोड"
              icon={Landmark}
              placeholder="Select Account Type"
              value={formData.fromBranch}
              onChange={(v) => handleChange("fromBranch", v)}
              hasError={errors.fromBranch}
              readOnly={isView}
              handleOpenList={() => handleOpenList("fromBranch")}
            />

            {/* Branch Name - Always readOnly */}
            <TextInput
              labelEn="Branch Name"
              labelHi="वर्णन"
              icon={Building2}
              placeholder="Description"
              value={formData.branchName}
              onChange={(v) => handleChange("branchName", v)}
              required={false}
              readOnly
            />

            {/* To Branch */}
            <PickerInput
              labelEn="To Branch"
              labelHi="उत्पादन कोड"
              icon={Building2}
              placeholder="Select Account Type"
              value={formData.toBranch}
              onChange={(v) => handleChange("toBranch", v)}
              hasError={errors.toBranch}
              readOnly={isView}
              handleOpenList={() => handleOpenList("toBranch")}
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

            {/* From Date */}
            <DateInput
              labelEn="From Date"
              labelHi="दिनांकपर्यंत"
              value={formData.fromDate}
              onChange={(v) => handleChange("fromDate", v)}
              hasError={errors.fromDate}
              readOnly={isView}
            />

            {/* To Date */}
            <DateInput
              labelEn="To Date"
              labelHi="दिनांकपर्यंत"
              value={formData.toDate}
              onChange={(v) => handleChange("toDate", v)}
              hasError={errors.toDate}
              readOnly={isView}
            />

            {/* TDS Rate */}
            <TextInput
              labelEn="TDS Rate"
              labelHi="दिनांकपर्यंत"
              icon={Percent}
              placeholder="Enter TDS Rate"
              value={formData.tdsRate}
              onChange={(v) => handleChange("tdsRate", v)}
              hasError={errors.tdsRate}
              readOnly={isView}
            />

            {/* Report Type - Radio */}
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
                  label: "PDF",
                },
                {
                  value: "txt",
                  icon: ICONS.TXT,
                  label: "TXT",
                },
              ]}
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


/* ===== from ProvisonAndVlcc.tsx ===== */
export interface ProvisonAndVlcc_TdsReportFormData {
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

export const ProvisonAndVlcc_emptyTdsReportFormData: ProvisonAndVlcc_TdsReportFormData = {
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

export type ProvisonAndVlcc_TdsReportModalMode = "add" | "view";

type ProvisonAndVlcc_RequiredFieldKey = keyof Pick<
  ProvisonAndVlcc_TdsReportFormData,
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

const ProvisonAndVlcc_REQUIRED_FIELDS: ProvisonAndVlcc_RequiredFieldKey[] = [
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

type ProvisonAndVlcc_ListType =
  | "accountType"
  | "productCode"
  | "interestDepositCode";

const ProvisonAndVlcc_ACCOUNT_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "TD", name: "Term Deposit" },
  { id: "2", code: "SB", name: "Savings Bank" },
  { id: "3", code: "RD", name: "Recurring Deposit" },
  { id: "4", code: "CA", name: "Current Account" },
];

const ProvisonAndVlcc_PRODUCT_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "TD", name: "Term Deposit Product" },
  { id: "2", code: "FD", name: "Fixed Deposit Product" },
  { id: "3", code: "MIS", name: "Monthly Income Scheme" },
];

const ProvisonAndVlcc_INTEREST_DEPOSIT_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "TD", name: "Term Deposit Interest" },
  { id: "2", code: "QLY", name: "Quarterly Interest" },
  { id: "3", code: "MLY", name: "Monthly Interest" },
];

const ProvisonAndVlcc_REPORT_TYPE_OPTIONS = ["Details", "Summary"];

export interface ProvisonAndVlcc_ProvisonAndVlccModalProps {
  open: boolean;
  mode?: ProvisonAndVlcc_TdsReportModalMode;
  initialData?: ProvisonAndVlcc_TdsReportFormData;
  onClose?: () => void;
  onApply?: (data: ProvisonAndVlcc_TdsReportFormData) => void;
}

function ProvisonAndVlcc({
  open,
  mode = "add",
  initialData = ProvisonAndVlcc_emptyTdsReportFormData,
  onClose,
  onApply,
}: ProvisonAndVlcc_ProvisonAndVlccModalProps) {
  const [formData, setFormData] = useState<ProvisonAndVlcc_TdsReportFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<ProvisonAndVlcc_RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<ProvisonAndVlcc_ListType>("accountType");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof ProvisonAndVlcc_TdsReportFormData>(
    key: K,
    value: ProvisonAndVlcc_TdsReportFormData[K],
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as ProvisonAndVlcc_RequiredFieldKey])
      setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<ProvisonAndVlcc_RequiredFieldKey, boolean>> = {};
    ProvisonAndVlcc_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  const handleOpenList = (type: ProvisonAndVlcc_ListType) => {
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
    }
    setOpenList(false);
  };

  // Handle customer selection from picklist
  const handleCustomerSelect = (customer: CustomerOption) => {
    handleChange("customerId", customer.customerId);
    handleChange("customerName", customer.customerName);
  };

  const getListData = () => {
    switch (listType) {
      case "accountType":
        return {
          title: "Account Type List",
          rows: ProvisonAndVlcc_ACCOUNT_TYPE_DATA,
          codeLabel: "Account Type",
          nameLabel: "Description",
        };
      case "productCode":
        return {
          title: "Product Code List",
          rows: ProvisonAndVlcc_PRODUCT_CODE_DATA,
          codeLabel: "Product Code",
          nameLabel: "Product Description",
        };
      case "interestDepositCode":
        return {
          title: "Interest Paid in Deposit Code List",
          rows: ProvisonAndVlcc_INTEREST_DEPOSIT_CODE_DATA,
          codeLabel: "Code",
          nameLabel: "Description",
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

            {/* Customer ID - Picklist only in add mode; plain readOnly in view mode */}
            {isView ? (
              <TextInput
                labelEn="Customer ID"
                labelHi="ग्राहक आयडी"
                icon={User}
                placeholder="Customer ID"
                value={formData.customerId}
                onChange={() => {}}
                required={false}
                readOnly
              />
            ) : (
              <div className="flex flex-col">
                <CustomerIdPicklistField
                  label="Customer ID"
                  labelHi="ग्राहक आयडी"
                  value={formData.customerId}
                  placeholder="Select Customer"
                  onSelect={handleCustomerSelect}
                  preFetch={false}
                  pageSize={10}
                  error={errors.customerId ? "Customer ID is required" : ""}
                />
              </div>
            )}

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
              options={ProvisonAndVlcc_REPORT_TYPE_OPTIONS}
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


/* ===== from index.tsx ===== */
type TDSReportItem = {
  id: string;
  title: string;
  marathiTitle: string;
  icon: string;
  description: string;
  marathiDescription: string;
};

const TDS_REPORT_ITEMS: TDSReportItem[] = [
  {
    id: "customer-tds-flag",
    title: "Customer TDS Flag Updation",
    marathiTitle: "ग्राहक TDS फ्लॅग अद्यतनित करणे",
    description: "Update TDS flags for customers",
    marathiDescription: "ग्राहकांसाठी TDS फ्लॅग अद्यतनित करा",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "tds-report-all",
    title: "TDS Report All",
    marathiTitle: "सर्व TDS अहवाल",
    description: "View all TDS reports",
    marathiDescription: "सर्व TDS अहवाल पहा",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "tds-applied-report",
    title: "TDS Applied Report",
    marathiTitle: "ठेव व्याज नोंदणी",
    description: "Process interest posting for eligible deposit accounts",
    marathiDescription: "पात्र ठेव खात्यांसाठी व्याज नोंदणी प्रक्रिया करा",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "provision-vlcc",
    title: "Provision & VLCC",
    marathiTitle: "प्रावधान आणि VLCC",
    description: "Apply provision and VLCC for TDS reports",
    marathiDescription: "TDS अहवालांसाठी प्रावधान आणि VLCC लागू करा",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
];

function TDSReportsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TDS_REPORT_ITEMS;
    return TDS_REPORT_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.marathiTitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [query]);

  const handleOpen = (id: string) => {
    setActiveModal(id);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="TDS Reports"
        titleHi="TDS अहवाल"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "#" },
          { label: "TDS Reports", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden rounded-2xl">
          <Image
            src={IMAGES.BACKGROUND_DARK}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />

          <div className="relative flex flex-col items-center gap-6 px-6 py-12 text-center sm:py-16">
            <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-[34px]">
              TDS Reports
            </h1>
            <p className="text-sm text-white/90 sm:text-base">
              Manage TDS reports, flags, provisions and VLCC
            </p>

            <div className="flex w-full max-w-xl items-center rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-lg dark:bg-slate-900">
              <Search size={18} className="mr-2 shrink-0 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search TDS reports, modules..."
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100"
              />
              <button
                type="button"
                className="ml-2 shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Show
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleOpen(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleOpen(item.id);
              }}
              className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <Image
                  src={item.icon}
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="truncate text-sm text-[#64748B] dark:text-slate-400">
                  {item.marathiTitle}
                </p>
                <p className="mt-0.5 truncate text-xs text-[#94A3B8] dark:text-slate-500">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(item.id);
                }}
                className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
              >
                Open <ChevronRight size={16} />
              </button>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">
              No TDS reports found.
            </p>
          )}
        </div>
      </div>

      {/* Modals rendering based on active state */}
      <CustomerTDSFlagModal
        open={activeModal === "customer-tds-flag"}
        onClose={handleCloseModal}
        mode="add"
        onApply={(data) => {
          console.log("Customer TDS Flag Data:", data);
          handleCloseModal();
        }}
      />

      <TDSReportAllModal
        open={activeModal === "tds-report-all"}
        onClose={handleCloseModal}
        mode="add"
        onApply={(data) => {
          console.log("TDS Report All Data:", data);
          handleCloseModal();
        }}
      />

      <TDSAppliedReportModal
        open={activeModal === "tds-applied-report"}
        onClose={handleCloseModal}
        mode="add"
        onApply={(data) => {
          console.log("TDS Applied Report Data:", data);
          handleCloseModal();
        }}
      />

      <ProvisonAndVlcc
        open={activeModal === "provision-vlcc"}
        onClose={handleCloseModal}
        mode="add"
        onApply={(data) => {
          console.log("Provision & VLCC Data:", data);
          handleCloseModal();
        }}
      />
    </div>
  );
}

export default TDSReportsPage;