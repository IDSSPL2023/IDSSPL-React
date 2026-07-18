import React, { useEffect, useState } from "react";
import {
  X,
  Check,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Hash,
  Home,
  Landmark,
  Flag,
} from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";
import TextInput from "@/components/shared/Inputs/TextInput";
import SuccessModal from "@/components/shared/SuccessModal";
import RadioInput from "@/components/shared/Inputs/RadioInput";
import SelectInput from "@/components/shared/Inputs/SelectInput";

export interface ParameterFormData {
  branchCode: string;
  branchName: string;
  shortName: string;
  address1: string;
  address2: string;
  address3: string;
  zipCode: string;
  cityCode: string;
  state: string;
  country: string;
  emailId: string;
  phoneNumber1: string;
  phoneNumber2: string;
  phoneNumber3: string;
  isImplemented: string;
}

export const emptyParameterFormData: ParameterFormData = {
  branchCode: "",
  branchName: "",
  shortName: "",
  address1: "",
  address2: "",
  address3: "",
  zipCode: "",
  cityCode: "",
  state: "",
  country: "",
  emailId: "",
  phoneNumber1: "",
  phoneNumber2: "",
  phoneNumber3: "",
  isImplemented: "No",
};

type RequiredFieldKey = keyof Pick<
  ParameterFormData,
  | "branchCode"
  | "branchName"
  | "shortName"
  | "address1"
  | "address2"
  | "address3"
  | "zipCode"
  | "cityCode"
  | "state"
  | "country"
  | "emailId"
  | "phoneNumber1"
  | "phoneNumber2"
  | "phoneNumber3"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "branchCode",
  "branchName",
  "shortName",
  "address1",
  "address2",
  "address3",
  "zipCode",
  "cityCode",
  "state",
  "country",
  "emailId",
  "phoneNumber1",
  "phoneNumber2",
  "phoneNumber3",
];

const COUNTRY_OPTIONS = [
  { value: "", label: "Select Country" },
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
];

const CITY_CODE_OPTIONS = [
  { value: "", label: "Select City Code" },
  { value: "MUM", label: "Mumbai" },
  { value: "DEL", label: "Delhi" },
  { value: "BLR", label: "Bangalore" },
  { value: "CHN", label: "Chennai" },
  { value: "HYD", label: "Hyderabad" },
  { value: "PUN", label: "Pune" },
];

const STATE_OPTIONS = [
  { value: "", label: "Select State" },
  { value: "MH", label: "Maharashtra" },
  { value: "DL", label: "Delhi" },
  { value: "KA", label: "Karnataka" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "TG", label: "Telangana" },
  { value: "UP", label: "Uttar Pradesh" },
];

export type ParameterModalMode = "view" | "edit";

export interface ParameterModalProps {
  open: boolean;
  mode: ParameterModalMode;
  initialData?: ParameterFormData;
  onClose?: () => void;
  onSave?: (data: ParameterFormData) => void;
  onValidate?: (data: ParameterFormData) => void;
}

function ViewEditParameterModal({
  open,
  mode,
  initialData = emptyParameterFormData,
  onClose,
  onSave,
  onValidate,
}: ParameterModalProps) {
  const [formData, setFormData] = useState<ParameterFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
    setShowSuccessModal(false);
  }, [initialData, open]);

  if (!open) return null;

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleChange = <K extends keyof ParameterFormData>(
    key: K,
    value: ParameterFormData[K],
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (REQUIRED_FIELDS.includes(key as RequiredFieldKey)) {
      setErrors((prev) => ({ ...prev, [key as RequiredFieldKey]: false }));
    }
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<RequiredFieldKey, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    if (isValid && onValidate) {
      onValidate(formData);
    }
  };

  const handleSave = () => {
    const newErrors: Partial<Record<RequiredFieldKey, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    if (!isValid) return;

    onSave?.(formData);
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  const handleSuccessDone = () => {
    setShowSuccessModal(false);
    // Close the main modal after a small delay to ensure success modal is fully closed
    setTimeout(() => {
      onClose?.();
    }, 100);
  };

  // Header configuration based on mode
  const getHeaderConfig = () => {
    if (isView) {
      return {
        icon: ICONS.PERSON,
        title: "View Parameter",
        titleHi: "पंचमीटर संपादित करा",
        subtitle: "View the parameter information and associated details.",
        subtitleHi: "पंचमीटरची माहिती आणि संबंधित तपशील पहा.",
        onClose: onClose,
        showCloseButton: true,
      };
    }
    // Edit mode
    return {
      icon: ICONS.EDIT_PERSON,
      title: "Edit Parameter",
      titleHi: "परामीटर संपादित करा",
      subtitle: "Review and update the details below as needed.",
      subtitleHi: "आवश्यकतेनुसार खालील तपशील तपासा व अहवालात करा.",
      onClose: onClose,
      showCloseButton: true,
    };
  };

  // Footer buttons based on mode
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
          icon: <Check size={16} />,
        },
      ];
    }

    // Edit mode
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
        onClick: handleSave,
        variant: "primary" as const,
        icon: <Check size={16} />,
        disabled: !validated,
        className: validated
          ? "bg-primary-100 text-primary hover:bg-primary-200"
          : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
      },
    ];
  };

  const fields = [
    // Row 1: Branch Code, Branch Name, Short Name
    {
      id: "branchCode",
      type: "text" as const,
      labelEn: "Branch Code",
      labelHi: "शाखा कोड",
      icon: Building2,
      placeholder: "Enter Branch Code",
      key: "branchCode" as const,
      readOnly: true, // Always read-only
    },
    {
      id: "branchName",
      type: "text" as const,
      labelEn: "Branch Name",
      labelHi: "शाखेचे नाव",
      icon: Building2,
      placeholder: "Enter Branch Name",
      key: "branchName" as const,
      readOnly: true, // Always read-only
    },
    {
      id: "shortName",
      type: "text" as const,
      labelEn: "Short Name",
      labelHi: "संक्षिप्त नाव",
      icon: Hash,
      placeholder: "Enter Branch Name",
      key: "shortName" as const,
    },
    // Row 2: Address 1, Address 2, Address 3
    {
      id: "address1",
      type: "text" as const,
      labelEn: "Address 1",
      labelHi: "पत्ता १",
      icon: MapPin,
      placeholder: "Enter Address 1",
      key: "address1" as const,
    },
    {
      id: "address2",
      type: "text" as const,
      labelEn: "Address 2",
      labelHi: "पत्ता २",
      icon: MapPin,
      placeholder: "Enter Address 2",
      key: "address2" as const,
    },
    {
      id: "address3",
      type: "text" as const,
      labelEn: "Address 3",
      labelHi: "पत्ता ३",
      icon: MapPin,
      placeholder: "Enter Address 3",
      key: "address3" as const,
    },
    // Row 3: Zip Code, City Code, State
    {
      id: "zipCode",
      type: "text" as const,
      labelEn: "Zip Code",
      labelHi: "इंपेक्ट कोड",
      icon: Home,
      placeholder: "Enter Zip Code",
      key: "zipCode" as const,
    },
    {
      id: "cityCode",
      type: "select" as const,
      labelEn: "City Code",
      labelHi: "शहर कोड",
      icon: Home,
      options: CITY_CODE_OPTIONS,
      key: "cityCode" as const,
    },
    {
      id: "state",
      type: "select" as const,
      labelEn: "State",
      labelHi: "राज्य",
      icon: Landmark,
      options: STATE_OPTIONS,
      key: "state" as const,
    },
    // Row 4: Country, Email ID, Is Implemented
    {
      id: "country",
      type: "select" as const,
      labelEn: "Country",
      labelHi: "देश",
      icon: Flag,
      options: COUNTRY_OPTIONS,
      key: "country" as const,
    },
    {
      id: "emailId",
      type: "text" as const,
      labelEn: "Email ID",
      labelHi: "इमेल आयडी",
      icon: Mail,
      placeholder: "Enter Email ID",
      key: "emailId" as const,
    },
    {
      id: "isImplemented",
      type: "radio" as const,
      labelEn: "Is Implemented",
      labelHi: "लागू केले आहे का?",
      options: ["Yes", "No"],
      key: "isImplemented" as const,
    },
    // Row 5: Phone Number 1, Phone Number 2, Phone Number 3
    {
      id: "phoneNumber1",
      type: "text" as const,
      labelEn: "Phone Number 1",
      labelHi: "दूरध्वनी क्रमांक १",
      icon: Phone,
      placeholder: "Enter Phone Number",
      key: "phoneNumber1" as const,
    },
    {
      id: "phoneNumber2",
      type: "text" as const,
      labelEn: "Phone Number 2",
      labelHi: "दूरध्वनी क्रमांक २",
      icon: Phone,
      placeholder: "Enter Phone Number",
      key: "phoneNumber2" as const,
    },
    {
      id: "phoneNumber3",
      type: "text" as const,
      labelEn: "Phone Number 3",
      labelHi: "दूरध्वनी क्रमांक ३",
      icon: Phone,
      placeholder: "Enter Phone Number",
      key: "phoneNumber3" as const,
    },
  ];

  const rows = [];
  for (let i = 0; i < fields.length; i += 3) {
    rows.push(fields.slice(i, i + 3));
  }

  const renderField = (field: (typeof fields)[0]) => {
    const hasError = REQUIRED_FIELDS.includes(field.key as RequiredFieldKey)
      ? errors[field.key as RequiredFieldKey]
      : false;
    const value = formData[field.key];

    // Check if field should be read-only in edit mode
    const isFieldReadOnly = isView || field.readOnly === true;

    if (field.type === "select") {
      return (
        <SelectInput
          key={field.id}
          labelEn={field.labelEn}
          labelMr={field.labelHi}
          icon={field.icon}
          value={value as string}
          options={field.options.map((v) => v.label) || []}
          onChange={(v: string) => handleChange(field.key, v)}
          required={REQUIRED_FIELDS.includes(field.key as RequiredFieldKey)}
          editable={!isFieldReadOnly}
        />
      );
    }

    if (field.type === "radio") {
      return (
        <RadioInput
          key={field.id}
          label={field.labelEn}
          labelHi={field.labelHi}
          value={value as string}
          onChange={(v: string) => handleChange(field.key, v)}
          options={field.options || []}
          disabled={isFieldReadOnly}
        />
      );
    }

    return (
      <TextInput
        key={field.id}
        labelEn={field.labelEn}
        labelHi={field.labelHi}
        icon={field.icon}
        placeholder={field.placeholder || ""}
        value={value as string}
        onChange={(v: string) => handleChange(field.key, v)}
        hasError={hasError}
        required={REQUIRED_FIELDS.includes(field.key as RequiredFieldKey)}
        readOnly={isFieldReadOnly}
      />
    );
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
            {rows.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((field) => renderField(field))}
              </React.Fragment>
            ))}
          </div>
        </SectionWrapper>
      </ModalWrapper>

      {showSuccessModal && (
        <SuccessModal
          variant="success"
          title="Parameter Edit Successfully"
          subtitle="Your Parameter is Edited Successfully"
          onClose={handleSuccessClose}
          onDone={handleSuccessDone}
        />
      )}
    </>
  );
}

export default ViewEditParameterModal;
