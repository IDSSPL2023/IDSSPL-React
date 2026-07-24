import { useEffect, useState } from "react";
import { X, Check, ThumbsUp } from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import TextInput from "@/components/shared/Inputs/TextInput";
import ListModal, { ListModalItem } from "@/components/shared/Modals/ListModal";

export interface MaturityAmountFormData {
  accountType: string;
  accountTypeName: string;
  categoryCode: string;
  description: string;
  openDate: string;
  productCode: string;
  productCodeName: string;
  unitOfPeriod: string;
  depositAmount: string;
  periodOfDeposit: string;
  maturityAmount: string;
  interestRate: string;
  maturityDate: string;
}

export const emptyMaturityAmountFormData: MaturityAmountFormData = {
  accountType: "501",
  accountTypeName: "Savings Account",
  categoryCode: "501",
  description: "name@company.com",
  openDate: "12-Jan-2026",
  productCode: "501",
  productCodeName: "Product 501",
  unitOfPeriod: "Monthly",
  depositAmount: "Amount",
  periodOfDeposit: "Monthly",
  maturityAmount: "Amount",
  interestRate: "21%",
  maturityDate: "Date",
};

export type MaturityAmountModalMode = "add" | "view";

type RequiredFieldKey = keyof Pick<
  MaturityAmountFormData,
  "accountType" | "categoryCode" | "description" | "openDate" | "productCode" | "unitOfPeriod" | "depositAmount" | "periodOfDeposit" | "maturityAmount" | "interestRate" | "maturityDate"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "accountType",
  "categoryCode",
  "description",
  "openDate",
  "productCode",
  "unitOfPeriod",
  "depositAmount",
  "periodOfDeposit",
  "maturityAmount",
  "interestRate",
  "maturityDate"
];

// Sample data for pickers
const ACCOUNT_TYPE_DATA: ListModalItem[] = [
  { id: "1", code: "501", name: "Savings Account" },
  { id: "2", code: "502", name: "Current Account" },
  { id: "3", code: "503", name: "Fixed Deposit Account" },
  { id: "4", code: "504", name: "Recurring Deposit Account" },
];

const PRODUCT_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "501", name: "Product 501" },
  { id: "2", code: "502", name: "Product 502" },
  { id: "3", code: "503", name: "Product 503" },
];

export interface MaturityAmountModalProps {
  open: boolean;
  mode?: MaturityAmountModalMode;
  initialData?: MaturityAmountFormData;
  onClose?: () => void;
  onApply?: (data: MaturityAmountFormData) => void;
}

function MaturityAmountModal({
  open,
  mode = "add",
  initialData = emptyMaturityAmountFormData,
  onClose,
  onApply,
}: MaturityAmountModalProps) {
  const [formData, setFormData] = useState<MaturityAmountFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<
    "accountType" | "productCode"
  >("accountType");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof MaturityAmountFormData>(
    key: K,
    value: MaturityAmountFormData[K],
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
    if (listType === "accountType") {
      handleChange("accountType", row.code);
      handleChange("accountTypeName", row.name);
    } else if (listType === "productCode") {
      handleChange("productCode", row.code);
      handleChange("productCodeName", row.name);
    }
    setOpenList(false);
  };

  const getListData = () => {
    if (listType === "accountType") {
      return {
        title: "Account Type List",
        rows: ACCOUNT_TYPE_DATA,
        codeLabel: "Account Type ID",
        nameLabel: "Account Type Name",
      };
    } else {
      return {
        title: "Product Code List",
        rows: PRODUCT_CODE_DATA,
        codeLabel: "Product Code",
        nameLabel: "Product Name",
      };
    }
  };

  const listData = getListData();

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "Maturity Amount",
    titleHi: "परिपक्वतेची रक्कम",
    subtitle: "Configure earning and deduction components used for payroll calculation and salary processing.",
    subtitleHi: "वेतन गणना व प्रक्रिया करण्यासाठी कमाई व कपात घटकांची संरचना करा.",
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
        <SectionWrapper
          icon={<img src={ICONS.PERSON} alt="Account Information" className="h-10 w-10" />}
          titleEn="Account Information"
          titleHi="खाते माहिती"
          subtitleEn="Enter the basic information of the earning or deduction component."
          subtitleHi="कमाई किंवा कपात घटकांची मूलभूत माहिती भरा."
          className="mb-6"
        >
          <div className="grid grid-cols-4 gap-4">
            {/* Row 1: Account Type & Category Code */}
            <PickerInput
              labelEn="Account Type"
              labelHi="खाते प्रकार"
              icon={ICONS.USER_CIRCLE}
              placeholder="Select Account Type"
              value={formData.accountType}
              onChange={(v) => handleChange("accountType", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("accountType")}
              required
              hasError={errors.accountType}
            />

            <TextInput
              labelEn="Category Code"
              labelHi="श्रेणी कोड"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Category Code"
              value={formData.categoryCode}
              onChange={(v) => handleChange("categoryCode", v)}
              readOnly={isView}
              required
              hasError={errors.categoryCode}
            />

            {/* Row 2: Description & Open Date */}
            <TextInput
              labelEn="Description"
              labelHi="वर्णन"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Description"
              value={formData.description}
              onChange={(v) => handleChange("description", v)}
              readOnly={isView}
              required
              hasError={errors.description}
            />

            <TextInput
              labelEn="Open Date"
              labelHi="उघडण्याची तारीख"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Select Date"
              value={formData.openDate}
              onChange={(v) => handleChange("openDate", v)}
              readOnly={isView}
              required
              hasError={errors.openDate}
            />

            {/* Row 3: Product Code & Unit of Period */}
            <PickerInput
              labelEn="Product Code"
              labelHi="उत्पादन कोड"
              icon={ICONS.USER_CIRCLE}
              placeholder="Select Product"
              value={formData.productCode}
              onChange={(v) => handleChange("productCode", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("productCode")}
              required
              hasError={errors.productCode}
            />

            <TextInput
              labelEn="Unit of Period"
              labelHi="कालावधीचे एकक"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Enter Unit"
              value={formData.unitOfPeriod}
              onChange={(v) => handleChange("unitOfPeriod", v)}
              readOnly={isView}
              required
              hasError={errors.unitOfPeriod}
            />

            {/* Row 4: Deposit Amount & Period of Deposit */}
            <TextInput
              labelEn="Deposit Amount"
              labelHi="जमा रक्कम"
              icon={ICONS.BANK}
              placeholder="Enter Amount"
              value={formData.depositAmount}
              onChange={(v) => handleChange("depositAmount", v)}
              readOnly={isView}
              required
              hasError={errors.depositAmount}
            />

            <TextInput
              labelEn="Period of Deposit"
              labelHi="जमा कालावधी"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Enter Period"
              value={formData.periodOfDeposit}
              onChange={(v) => handleChange("periodOfDeposit", v)}
              readOnly={isView}
              required
              hasError={errors.periodOfDeposit}
            />

            {/* Row 5: Maturity Amount & Interest Rate */}
            <TextInput
              labelEn="Maturity Amount"
              labelHi="परिपक्वता रक्कम"
              icon={ICONS.BANK}
              placeholder="Enter Amount"
              value={formData.maturityAmount}
              onChange={(v) => handleChange("maturityAmount", v)}
              readOnly={isView}
              required
              hasError={errors.maturityAmount}
            />

            <TextInput
              labelEn="Interest Rate"
              labelHi="व्याज दर"
              icon={ICONS.BANK}
              placeholder="Enter Rate"
              value={formData.interestRate}
              onChange={(v) => handleChange("interestRate", v)}
              readOnly={isView}
              required
              hasError={errors.interestRate}
            />

            {/* Row 6: Maturity Date (Full width) */}
            <div className="col-span-2">
              <TextInput
                labelEn="Maturity Date"
                labelHi="परिपक्वता तारीख"
                icon={ICONS.CALENDAR_STATS}
                placeholder="Select Date"
                value={formData.maturityDate}
                onChange={(v) => handleChange("maturityDate", v)}
                readOnly={isView}
                required
                hasError={errors.maturityDate}
              />
            </div>
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

export default MaturityAmountModal;