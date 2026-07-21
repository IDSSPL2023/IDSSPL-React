import { useEffect, useState } from "react";
import {
  X,
  Check,
  User,
  Hash,
  Landmark,
  IndianRupee,
  Calendar,
  FileText,
  Wallet,
  ChevronDown,
} from "lucide-react";

import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import { ICONS } from "@/assets";
import TextInput from "../shared/Inputs/TextInput";
import DateInput from "../shared/Inputs/DateInput";
import RadioInput from "../shared/Inputs/RadioInput";
import SelectInput from "../shared/Inputs/SelectInput";
import SectionWrapper from "../shared/Wrappers/SectionWrapper";

export interface VoterListFormData {
  sortingOrder: string;
  accountName: string;
  glAccountCode: string;
  glAccountName: string;
  ledgerBalance: string;
  availableBalance: string;
  newLedgerBalance: string;
  modeOfPayment: string;
  faceValue: string;
  amount: string;
  meetingDate: string;
  particular: string;
}

export const emptyVoterListFormData: VoterListFormData = {
  sortingOrder: "Member Name",
  accountName: "",
  glAccountCode: "",
  glAccountName: "",
  ledgerBalance: "",
  availableBalance: "",
  newLedgerBalance: "",
  modeOfPayment: "",
  faceValue: "",
  amount: "",
  meetingDate: "",
  particular: "",
};

export type VoterListModalMode = "add" | "view";

type RequiredFieldKey = keyof Pick<
  VoterListFormData,
  | "accountName"
  | "glAccountCode"
  | "glAccountName"
  | "ledgerBalance"
  | "availableBalance"
  | "newLedgerBalance"
  | "modeOfPayment"
  | "faceValue"
  | "amount"
  | "meetingDate"
  | "particular"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "accountName",
  "glAccountCode",
  "glAccountName",
  "ledgerBalance",
  "availableBalance",
  "newLedgerBalance",
  "modeOfPayment",
  "faceValue",
  "amount",
  "meetingDate",
  "particular",
];

const SORTING_ORDER_OPTIONS = ["Member Name", "Name"];
const MODE_OF_PAYMENT_OPTIONS = [
  "By Cash",
  "By Cheque",
  "By Transfer",
];

export interface VoterListModalProps {
  open: boolean;
  mode?: VoterListModalMode;
  initialData?: VoterListFormData;
  onClose?: () => void;
  onApply?: (data: VoterListFormData) => void;
}

function VoterList({
  open,
  mode = "view",
  initialData = emptyVoterListFormData,
  onClose,
  onApply,
}: VoterListModalProps) {
  const [formData, setFormData] = useState<VoterListFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof VoterListFormData>(
    key: K,
    value: VoterListFormData[K],
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

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "Voter List",
    titleHi: "भाग वितरण",
    subtitle:
      "Configure earning and deduction components used for payroll calculation and salary processing.",
    subtitleHi: "वेतन गणना व प्रक्रिया करण्यासाठी कमाई व कपात घटकांची संरचना करा.",
    onClose: onClose,
    showCloseButton: true,
  });

  const getFooterButtons = () => [
    {
      label: "Validate",
      onClick: handleValidate,
      variant: "primary" as const,
      icon: <Check size={16} />,
    },
    {
      label: "Display Vouchers",
      onClick: () => {},
      variant: "outline" as const,
      icon: <ChevronDown size={16} />,
      className: "bg-[#F3F4FB] text-[#0B63C1] hover:bg-[#E8EDF8]",
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
      variant: "outline" as const,
      icon: <ChevronDown size={16} />,
      disabled: !validated,
      className: validated
        ? "bg-[#F3F4FB] text-[#0B63C1] hover:bg-[#E8EDF8]"
        : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
    },
  ];

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      header={getHeaderConfig()}
      footerButtons={getFooterButtons()}
      footerAlign="right"
      showDefaultClose={false}
      maxWidth="full"
    >
      {/* Report Parameter Section */}
      <SectionWrapper
        icon={<img src={ICONS.PERSON} alt="Report Parameter" className="h-10 w-10" />}
        titleEn="Report Parameter"
        titleHi="अहवाल पॅरामीटर"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        className="mb-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <RadioInput
            label="Sorting Order"
            value={formData.sortingOrder}
            onChange={(v) => handleChange("sortingOrder", v)}
            options={SORTING_ORDER_OPTIONS}
          />

          <TextInput
            labelEn="Account Name"
            labelHi="खात्याचे नाव"
            icon={User}
            placeholder="Account Name"
            value={formData.accountName}
            onChange={(v) => handleChange("accountName", v)}
            hasError={errors.accountName}
            readOnly={isView}
          />

          <TextInput
            labelEn="GL Account Code"
            labelHi="ठेव कालावधी"
            icon={IndianRupee}
            placeholder="GL Account Code"
            value={formData.glAccountCode}
            onChange={(v) => handleChange("glAccountCode", v)}
            hasError={errors.glAccountCode}
            readOnly={isView}
          />

          <TextInput
            labelEn="GL Account Name"
            labelHi="स्कोल क्रमांक"
            icon={Landmark}
            placeholder="Scroll Number"
            value={formData.glAccountName}
            onChange={(v) => handleChange("glAccountName", v)}
            hasError={errors.glAccountName}
            readOnly={isView}
          />

          <TextInput
            labelEn="Ledger Balance"
            labelHi="खाते शिल्लक"
            icon={Wallet}
            placeholder="Outlist Doc No."
            value={formData.ledgerBalance}
            onChange={(v) => handleChange("ledgerBalance", v)}
            hasError={errors.ledgerBalance}
            readOnly={isView}
          />

          <TextInput
            labelEn="Available Balance"
            labelHi="उपलब्ध शिल्लक"
            icon={Wallet}
            placeholder="GL Outlist Description"
            value={formData.availableBalance}
            onChange={(v) => handleChange("availableBalance", v)}
            hasError={errors.availableBalance}
            readOnly={isView}
          />

          <TextInput
            labelEn="New Ledger Balance"
            labelHi="नवीन खाते शिल्लक"
            icon={Wallet}
            placeholder="Outlist Doc No."
            value={formData.newLedgerBalance}
            onChange={(v) => handleChange("newLedgerBalance", v)}
            hasError={errors.newLedgerBalance}
            readOnly={isView}
          />
        </div>
      </SectionWrapper>

      {/* Transaction Details Section */}
      <SectionWrapper
        icon={<img src={ICONS.PERSON} alt="Transaction Details" className="h-10 w-10" />}
        titleEn="Transaction Details"
        titleHi="पेमेंट तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <SelectInput
            labelEn="No. Of Shares"
            labelMr="पेमेंट पद्धत"
            icon={Hash}
            value={formData.modeOfPayment}
            options={MODE_OF_PAYMENT_OPTIONS}
            onChange={(v) => handleChange("modeOfPayment", v)}
            placeholder="Select Mode of Payment"
          />

          <TextInput
            labelEn="Face Value"
            labelHi="रक्कम"
            icon={IndianRupee}
            placeholder="Enter Amount"
            value={formData.faceValue}
            onChange={(v) => handleChange("faceValue", v)}
            hasError={errors.faceValue}
          />

          <TextInput
            labelEn="Amount"
            labelHi="रक्कम"
            icon={IndianRupee}
            placeholder="Enter Amount"
            value={formData.amount}
            onChange={(v) => handleChange("amount", v)}
            hasError={errors.amount}
          />

          <DateInput
            labelEn="Meeting Date"
            labelHi="नवीन खाते शिल्लक"
            icon={Calendar}
            value={formData.meetingDate}
            onChange={(v) => handleChange("meetingDate", v)}
            hasError={errors.meetingDate}
          />

          <div className="md:col-span-4">
            <TextInput
              labelEn="Particular"
              labelHi="तपशील"
              icon={FileText}
              placeholder="By Cash"
              value={formData.particular}
              onChange={(v) => handleChange("particular", v)}
              hasError={errors.particular}
              readOnly={isView}
            />
          </div>
        </div>
      </SectionWrapper>
    </ModalWrapper>
  );
}

export default VoterList;
