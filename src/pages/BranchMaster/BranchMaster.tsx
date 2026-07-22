import { IMAGES, ICONS } from "@/assets";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { ChangeEvent } from "react";
import Image from "@/components/ui/Image";
import { X, Check, ChevronDown, ThumbsUp, UserRound, Landmark, Home, Building2, Flag, Mail, Phone, type LucideIcon, MapPin, Hash, Globe, MoreVertical, Smartphone, IdCard, BookOpen, Layers, Type, CreditCard, Filter as FilterIcon, ShieldCheck, ArrowUpDown, ChevronUp, Eye, Receipt } from "lucide-react";
import RadioInput from "@/components/shared/Inputs/RadioInput";
import TextInput from "@/components/shared/Inputs/TextInput";
import SuccessModal from "@/components/shared/SuccessModal";
import SelectInput from "@/components/shared/Inputs/SelectInput";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import ListModal, { type ListModalItem } from "@/components/shared/Modals/ListModal";
import { useBilingual } from "@/i18n/useBilingual";
import RowActionMenu from "@/components/shared/RowActionMenu";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import {
  fetchBranches,
  fetchBranchByCode,
  updateBranch,
  type BranchDetail,
} from "@/lib/masterMaintenanceApi";

/* ===== from AddBranchModal.tsx ===== */
export interface AddBranchModal_BranchFormData {
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
  isImplemented: "Yes" | "No";
  phoneNumber1: string;
  phoneNumber2: string;
  phoneNumber3: string;
}

export const AddBranchModal_emptyBranchFormData: AddBranchModal_BranchFormData = {
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
  isImplemented: "Yes",
  phoneNumber1: "",
  phoneNumber2: "",
  phoneNumber3: "",
};

const AddBranchModal_CITY_OPTIONS = ["Ilkal", "Chikmagalur", "Davangere", "Haveri", "Bagalkot", "Koppal", "Belagavi", "Udupi", "Karwar", "Ranebennur", "Kolar", "Sirsi", "Shimoga"];
const AddBranchModal_STATE_OPTIONS = ["Karnataka", "Maharashtra", "Gujarat", "Tamil Nadu", "Uttar Pradesh"];
const AddBranchModal_COUNTRY_OPTIONS = ["India"];

export type AddBranchModal_BranchModalMode = "add" | "view";

const AddBranchModal_MODE_META: Record<AddBranchModal_BranchModalMode, { titleEn: string; titleHi: string; subtitleEn: string; subtitleHi: string; useImage: boolean }> = {
  add: {
    titleEn: "Add New Parameter",
    titleHi: "नवीन मापदंड जोडा",
    subtitleEn: "Fill in the details below to create a new parameter.",
    subtitleHi: "नवीन पॅरामीटर जोडण्यासाठी खालील तपशील प्रविष्ट करा.",
    useImage: true,
  },
  view: {
    titleEn: "View Parameter",
    titleHi: "पॅरामीटर संपादित करा",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    useImage: false,
  },
};

type AddBranchModal_RequiredFieldKey = Exclude<keyof AddBranchModal_BranchFormData, "phoneNumber2" | "phoneNumber3" | "isImplemented">;

const AddBranchModal_REQUIRED_FIELDS: AddBranchModal_RequiredFieldKey[] = [
  "branchCode", "branchName", "shortName",
  "address1", "address2", "address3",
  "zipCode", "cityCode", "state",
  "country", "emailId",
  "phoneNumber1",
];

interface AddBranchModal_TextFieldProps {
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  required?: boolean;
  readOnly?: boolean;
}

function AddBranchModal_TextField({ labelEn, labelHi, icon: Icon, placeholder, value, onChange, hasError, required = true, readOnly = false }: AddBranchModal_TextFieldProps) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1.5 block text-[16px] font-medium text-black dark:text-slate-100">
        {labelEn} <span className="font-medium text-gray-500 dark:text-slate-400">/ {labelHi}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`flex h-11 items-center rounded-lg border px-3 transition-colors ${hasError
            ? "border-red-400 bg-white dark:bg-slate-900"
            : readOnly
              ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              : "border-[#B8C2D6] bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:bg-slate-900 dark:border-slate-700"
          }`}
      >
        <Icon size={18} className="shrink-0 text-[#6B7280] dark:text-slate-400" />
        {readOnly ? (
          <span className={`ml-3 w-full truncate text-[15px] ${value ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}>{value || placeholder}</span>
        ) : (
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="ml-3 w-full bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder-slate-500"
          />
        )}
      </div>
      {hasError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">This field is required</p>}
    </div>
  );
}

interface AddBranchModal_SelectFieldProps {
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  hasError?: boolean;
  readOnly?: boolean;
}

function AddBranchModal_SelectField({ labelEn, labelHi, icon: Icon, placeholder, value, options, onChange, hasError, readOnly = false }: AddBranchModal_SelectFieldProps) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1.5 block text-[15px] font-semibold text-[#1F2858] dark:text-slate-100">
        {labelEn} <span className="font-medium text-gray-500 dark:text-slate-400">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div
        className={`relative flex h-11 items-center rounded-lg border px-3 ${hasError ? "border-red-400 bg-white dark:bg-slate-900" : readOnly ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800" : "border-[#B8C2D6] bg-white dark:bg-slate-900 dark:border-slate-700"
          }`}
      >
        <Icon size={18} className="shrink-0 text-[#6B7280] dark:text-slate-400" />
        {readOnly ? (
          <span className={`ml-3 w-full truncate text-[15px] ${value ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}>{value || placeholder}</span>
        ) : (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="ml-3 w-full appearance-none bg-transparent text-[15px] text-[#4B5563] outline-none dark:text-slate-100"
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
        <ChevronDown size={16} className="shrink-0 text-gray-400 dark:text-slate-500" />
      </div>
      {hasError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">This field is required</p>}
    </div>
  );
}

interface AddBranchModal_YesNoFieldProps {
  value: "Yes" | "No";
  onChange: (value: "Yes" | "No") => void;
  readOnly?: boolean;
}

function AddBranchModal_YesNoField({ value, onChange, readOnly = false }: AddBranchModal_YesNoFieldProps) {
  return (
    <div className="mb-4 last:mb-0 flex gap-2 items-center justify-around">
      <label className="mb-1.5 block text-[14px] font-medium text-black dark:text-slate-100">
        Is Implemented <span className="font-medium text-gray-500 dark:text-slate-400">/ लागू केले आहे का?</span>
      </label>
      <div className="flex h-11 items-center gap-6">
        {(["Yes", "No"] as const).map((opt) => (
          <label key={opt} className={`flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300 ${readOnly ? "cursor-default" : "cursor-pointer"}`}>
            <input
              type="radio"
              name="isImplemented"
              value={opt}
              checked={value === opt}
              disabled={readOnly}
              onChange={() => onChange(opt)}
              className="h-4 w-4 accent-primary"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

export interface AddBranchModal_AddBranchModalProps {
  open: boolean;
  mode?: AddBranchModal_BranchModalMode;
  initialData?: AddBranchModal_BranchFormData;
  onClose?: () => void;
  onSave?: (data: AddBranchModal_BranchFormData) => void;
}

function AddBranchModal({ open, mode = "add", initialData = AddBranchModal_emptyBranchFormData, onClose, onSave }: AddBranchModal_AddBranchModalProps) {
  const [formData, setFormData] = useState<AddBranchModal_BranchFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<AddBranchModal_RequiredFieldKey, boolean>>>({});

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";
  const meta = AddBranchModal_MODE_META[mode];

  const handleChange = <K extends keyof AddBranchModal_BranchFormData>(key: K, value: AddBranchModal_BranchFormData[K]) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as AddBranchModal_RequiredFieldKey]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<AddBranchModal_RequiredFieldKey, boolean>> = {};
    AddBranchModal_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleSave = () => {
    if (!validated) return;
    onSave?.(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            {meta.useImage ? (
              <Image src={IMAGES.ADD_ICON} alt="" width={50} height={50} />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-slate-800">
                <UserRound size={24} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-[#1C398E] dark:text-slate-100">
                {meta.titleEn} <span className="font-bold text-[#64748B] dark:text-slate-400">/ {meta.titleHi}</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {meta.subtitleEn} / {meta.subtitleHi}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-3 bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
            <AddBranchModal_TextField labelEn="Branch Code" labelHi="शाखा कोड" icon={Landmark} placeholder="Enter Branch Code" value={formData.branchCode} onChange={(v) => handleChange("branchCode", v)} hasError={errors.branchCode} readOnly={isView} />
            <AddBranchModal_TextField labelEn="Branch Name" labelHi="शाखेचे नाव" icon={Landmark} placeholder="Enter Branch Name" value={formData.branchName} onChange={(v) => handleChange("branchName", v)} hasError={errors.branchName} readOnly={isView} />
            <AddBranchModal_TextField labelEn="Short Name" labelHi="संक्षिप्त नाव" icon={Landmark} placeholder="Enter Branch Name" value={formData.shortName} onChange={(v) => handleChange("shortName", v)} hasError={errors.shortName} readOnly={isView} />

            <AddBranchModal_TextField labelEn="Address 1" labelHi="पत्ता १" icon={Home} placeholder="Enter Address 1" value={formData.address1} onChange={(v) => handleChange("address1", v)} hasError={errors.address1} readOnly={isView} />
            <AddBranchModal_TextField labelEn="Address 2" labelHi="पत्ता २" icon={Home} placeholder="Enter Address 2" value={formData.address2} onChange={(v) => handleChange("address2", v)} hasError={errors.address2} readOnly={isView} />
            <AddBranchModal_TextField labelEn="Address 3" labelHi="पत्ता ३" icon={Home} placeholder="Enter Address 3" value={formData.address3} onChange={(v) => handleChange("address3", v)} hasError={errors.address3} readOnly={isView} />

            <AddBranchModal_TextField labelEn="Zip Code" labelHi="झिप कोड" icon={Home} placeholder="Enter Zip Code" value={formData.zipCode} onChange={(v) => handleChange("zipCode", v)} hasError={errors.zipCode} readOnly={isView} />
            <AddBranchModal_SelectField labelEn="City Code" labelHi="शहर कोड" icon={Building2} placeholder="Select City Code" value={formData.cityCode} options={AddBranchModal_CITY_OPTIONS} onChange={(v) => handleChange("cityCode", v)} hasError={errors.cityCode} readOnly={isView} />
            <AddBranchModal_SelectField labelEn="State" labelHi="राज्य" icon={Building2} placeholder="Select State" value={formData.state} options={AddBranchModal_STATE_OPTIONS} onChange={(v) => handleChange("state", v)} hasError={errors.state} readOnly={isView} />

            <AddBranchModal_SelectField labelEn="Country" labelHi="देश" icon={Flag} placeholder="Select Country" value={formData.country} options={AddBranchModal_COUNTRY_OPTIONS} onChange={(v) => handleChange("country", v)} hasError={errors.country} readOnly={isView} />
            <AddBranchModal_TextField labelEn="Email ID" labelHi="ईमेल आयडी" icon={Mail} placeholder="Enter Email ID" value={formData.emailId} onChange={(v) => handleChange("emailId", v)} hasError={errors.emailId} readOnly={isView} />
            <AddBranchModal_YesNoField value={formData.isImplemented} onChange={(v) => handleChange("isImplemented", v)} readOnly={isView} />

            <AddBranchModal_TextField labelEn="Phone Number 1" labelHi="दूरध्वनी क्रमांक १" icon={Phone} placeholder="Enter Phone Number" value={formData.phoneNumber1} onChange={(v) => handleChange("phoneNumber1", v)} hasError={errors.phoneNumber1} readOnly={isView} />
            <AddBranchModal_TextField labelEn="Phone Number 2" labelHi="दूरध्वनी क्रमांक २" icon={Phone} placeholder="Enter Phone Number" value={formData.phoneNumber2} onChange={(v) => handleChange("phoneNumber2", v)} required={false} readOnly={isView} />
            <AddBranchModal_TextField labelEn="Phone Number 3" labelHi="दूरध्वनी क्रमांक ३" icon={Phone} placeholder="Enter Phone Number" value={formData.phoneNumber3} onChange={(v) => handleChange("phoneNumber3", v)} required={false} readOnly={isView} />
          </div>
        </div>

        <div className=" flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          {isView ? (
            <>
              <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50">
                Cancel <X size={16} />
              </button>
              <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">
                Ok, Got It <ThumbsUp size={16} />
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">
                Validate <Check size={16} />
              </button>
              <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50">
                Cancel <X size={16} />
              </button>
              <button
                type="button"
                disabled={!validated}
                onClick={handleSave}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${validated ? "bg-primary-100 text-primary hover:bg-primary-200" : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600"
                  }`}
              >
                Save <ChevronDown size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


/* ===== from AddNewParameter.tsx ===== */
export interface AddNewParameter_AddParameterFormData {
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

export const AddNewParameter_emptyAddParameterFormData: AddNewParameter_AddParameterFormData = {
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

// Remove isImplemented from required fields since it's a radio with default value
type AddNewParameter_RequiredFieldKey = keyof Pick<
  AddNewParameter_AddParameterFormData,
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

const AddNewParameter_REQUIRED_FIELDS: AddNewParameter_RequiredFieldKey[] = [
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

// Select options with default "Select" option
const AddNewParameter_COUNTRY_OPTIONS = [
  { value: "", label: "Select Country" },
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
];

const AddNewParameter_CITY_CODE_OPTIONS = [
  { value: "", label: "Select City Code" },
  { value: "MUM", label: "Mumbai" },
  { value: "DEL", label: "Delhi" },
  { value: "BLR", label: "Bangalore" },
  { value: "CHN", label: "Chennai" },
  { value: "HYD", label: "Hyderabad" },
  { value: "PUN", label: "Pune" },
];

const AddNewParameter_STATE_OPTIONS = [
  { value: "", label: "Select State" },
  { value: "MH", label: "Maharashtra" },
  { value: "DL", label: "Delhi" },
  { value: "KA", label: "Karnataka" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "TG", label: "Telangana" },
  { value: "UP", label: "Uttar Pradesh" },
];

export interface AddNewParameter_AddParameterModalProps {
  open: boolean;
  initialData?: AddNewParameter_AddParameterFormData;
  onClose?: () => void;
  onSave?: (data: AddNewParameter_AddParameterFormData) => void;
  onValidate?: (data: AddNewParameter_AddParameterFormData) => void;
}

function AddParameterModal({
  open,
  initialData = AddNewParameter_emptyAddParameterFormData,
  onClose,
  onSave,
  onValidate,
}: AddNewParameter_AddParameterModalProps) {
  const [formData, setFormData] = useState<AddNewParameter_AddParameterFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<AddNewParameter_RequiredFieldKey, boolean>>
  >({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
    setShowSuccessModal(false);
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = <K extends keyof AddNewParameter_AddParameterFormData>(
    key: K,
    value: AddNewParameter_AddParameterFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    // Only check if the key is a required field
    if (AddNewParameter_REQUIRED_FIELDS.includes(key as AddNewParameter_RequiredFieldKey)) {
      setErrors((prev) => ({ ...prev, [key as AddNewParameter_RequiredFieldKey]: false }));
    }
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<AddNewParameter_RequiredFieldKey, boolean>> = {};
    AddNewParameter_REQUIRED_FIELDS.forEach((key) => {
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
    const newErrors: Partial<Record<AddNewParameter_RequiredFieldKey, boolean>> = {};
    AddNewParameter_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    if (!isValid) return;

    // Call the onSave callback if provided
    onSave?.(formData);

    // Show success modal
    setShowSuccessModal(true);
  };

  const handleSuccessDone = () => {
    setShowSuccessModal(false);
    // Close the main modal after success
    onClose?.();
  };

  const headerConfig = {
    icon: ICONS.PERSON,
    title: "Add New Parameter",
    titleHi: "नवीन मापदंड जोडा",
    subtitle: "Fill in the details below to create a new parameter.",
    subtitleHi: "नवीन परिमार्जन जोडण्यासाठी खालील तपशील प्रविष्ट करा.",
    onClose: onClose,
    showCloseButton: true,
  };

  const footerButtons = [
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

  // Field configuration array with proper options
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
    },
    {
      id: "branchName",
      type: "text" as const,
      labelEn: "Branch Name",
      labelHi: "शाखेचे नाव",
      icon: Building2,
      placeholder: "Enter Branch Name",
      key: "branchName" as const,
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
      labelHi: "ईमेल कोड",
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
      options: AddNewParameter_CITY_CODE_OPTIONS,
      key: "cityCode" as const,
    },
    {
      id: "state",
      type: "select" as const,
      labelEn: "State",
      labelHi: "राज्य",
      icon: Landmark,
      options: AddNewParameter_STATE_OPTIONS,
      key: "state" as const,
    },
    // Row 4: Country, Email ID, Is Implemented
    {
      id: "country",
      type: "select" as const,
      labelEn: "Country",
      labelHi: "देश",
      icon: Flag,
      options: AddNewParameter_COUNTRY_OPTIONS,
      key: "country" as const,
    },
    {
      id: "emailId",
      type: "text" as const,
      labelEn: "Email ID",
      labelHi: "ईमेल आयडी",
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

  // Group fields into rows of 3
  const rows = [];
  for (let i = 0; i < fields.length; i += 3) {
    rows.push(fields.slice(i, i + 3));
  }

  const renderField = (field: (typeof fields)[0]) => {
    // Only check error for required fields
    const hasError = AddNewParameter_REQUIRED_FIELDS.includes(field.key as AddNewParameter_RequiredFieldKey)
      ? errors[field.key as AddNewParameter_RequiredFieldKey]
      : false;
    const value = formData[field.key];

    if (field.type === "select") {
      return (
        <SelectInput
          key={field.id}
          labelEn={field.labelEn}
          labelMr={field.labelHi}
          icon={field.icon}
          value={value as string}
          options={field.options.map((v) => v.label) || []}
          onChange={(v) => handleChange(field.key, v)}
          required={AddNewParameter_REQUIRED_FIELDS.includes(field.key as AddNewParameter_RequiredFieldKey)}
          editable
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
          onChange={(v) => handleChange(field.key, v)}
          options={field.options || []}
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
        onChange={(v) => handleChange(field.key, v)}
        hasError={hasError}
        required={AddNewParameter_REQUIRED_FIELDS.includes(field.key as AddNewParameter_RequiredFieldKey)}
      />
    );
  };

  return (
    <>
      <ModalWrapper
        open={open}
        onClose={onClose}
        header={headerConfig}
        footerButtons={footerButtons}
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

      {/* Success Modal with text from image */}
      {showSuccessModal && (
        <SuccessModal
          variant="success"
          title="Parameter Added Successfully"
          subtitle="Your Parameter is Added Successfully"
          onClose={() => setShowSuccessModal(false)}
          onDone={handleSuccessDone}
        />
      )}
    </>
  );
}


/* ===== from BranchAreaSubArea.tsx ===== */
export interface BranchAreaSubArea_BranchFormData {
  branchCode: string;
  branchName: string;
  areaCode: string;
  areaDescription: string;
  subareaCode: string;
  subareaDescription: string;
}

export const BranchAreaSubArea_emptyBranchFormData: BranchAreaSubArea_BranchFormData = {
  branchCode: "0100",
  branchName: "Ikkal Branch",
  areaCode: "",
  areaDescription: "",
  subareaCode: "",
  subareaDescription: "",
};

export type BranchAreaSubArea_BranchModalMode = "add" | "view";

type BranchAreaSubArea_RequiredFieldKey = keyof BranchAreaSubArea_BranchFormData;

const BranchAreaSubArea_REQUIRED_FIELDS: BranchAreaSubArea_RequiredFieldKey[] = [
  "branchCode",
  "branchName",
  "areaCode",
  "areaDescription",
  "subareaCode",
  "subareaDescription",
];

// Sample Area Data
const BranchAreaSubArea_AREA_DATA: ListModalItem[] = [
  { id: "1", code: "01", name: "Main Bilagi" },
  { id: "2", code: "02", name: "0002 Recovery" },
  { id: "3", code: "03", name: "Downtown Area" },
  { id: "4", code: "04", name: "Industrial Zone" },
  { id: "5", code: "05", name: "Residential Colony" },
];

// Sample Sub-Area Data
const BranchAreaSubArea_SUB_AREA_DATA: ListModalItem[] = [
  { id: "1", code: "01", name: "Aanadinni" },
  { id: "2", code: "02", name: "Aanegundi" },
  { id: "3", code: "03", name: "Achanur" },
  { id: "4", code: "04", name: "Adavi Sangapur" },
  { id: "5", code: "05", name: "MUDHOLAdihal BRANCH" },
  { id: "6", code: "06", name: "Advi Sangapur" },
  { id: "7", code: "07", name: "Agara" },
  { id: "8", code: "08", name: "Agasanakoppa" },
  { id: "9", code: "09", name: "RAMDURG BRANCH" },
  { id: "10", code: "10", name: "Ahmedabad" },
];

export interface BranchAreaSubArea_BranchAreaSubAreaModalProps {
  open: boolean;
  mode?: BranchAreaSubArea_BranchModalMode;
  initialData?: BranchAreaSubArea_BranchFormData;
  onClose?: () => void;
  onSave?: (data: BranchAreaSubArea_BranchFormData) => void;
}

function BranchAreaSubAreaModal({
  open,
  mode = "add",
  initialData = BranchAreaSubArea_emptyBranchFormData,
  onClose,
  onSave,
}: BranchAreaSubArea_BranchAreaSubAreaModalProps) {
  const [formData, setFormData] = useState<BranchAreaSubArea_BranchFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<BranchAreaSubArea_RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<"area" | "subarea">("subarea");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof BranchAreaSubArea_BranchFormData>(
    key: K,
    value: BranchAreaSubArea_BranchFormData[K],
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as BranchAreaSubArea_RequiredFieldKey])
      setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<BranchAreaSubArea_RequiredFieldKey, boolean>> = {};
    BranchAreaSubArea_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleSave = () => {
    if (!validated) return;
    onSave?.(formData);
  };

  const handleOpenList = (type: "area" | "subarea") => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    if (listType === "area") {
      handleChange("areaCode", row.code);
    } else {
      handleChange("subareaCode", row.code);
      handleChange("subareaDescription", row.name);
    }
    setOpenList(false);
  };

  const getListData = () => {
    if (listType === "area") {
      return {
        title: "Area List",
        rows: BranchAreaSubArea_AREA_DATA,
        codeLabel: "Area Code",
        nameLabel: "Area Name",
      };
    } else {
      return {
        title: "Sub-Area List",
        rows: BranchAreaSubArea_SUB_AREA_DATA,
        codeLabel: "Sub-Area Code",
        nameLabel: "Sub-Area Name",
      };
    }
  };

  const listData = getListData();

  // Define header configuration
  const getHeaderConfig = () => ({
    icon: ICONS.ADD_PERSON,
    title: "Branch Area / Sub-Area",
    titleHi: "शाखा क्षेत्र / उप-क्षेत्र",
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
        label: "Save",
        onClick: handleSave,
        variant: "primary" as const,
        icon: <ChevronDown size={16} />,
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
        maxWidth="4xl"
      >
        <SectionWrapper>
          <div className="grid grid-cols-1 gap-4">
            {/* Branch Code - Always readOnly */}
            <TextInput
              labelEn="Branch Code"
              labelHi="शाखा कोड"
              icon={Landmark}
              placeholder="Enter Branch Code"
              value={formData.branchCode}
              onChange={(v) => handleChange("branchCode", v)}
              hasError={errors.branchCode}
              readOnly={true}
            />

            {/* Branch Name - Always readOnly */}
            <TextInput
              labelEn="Branch Name"
              labelHi="शाखेचे नाव"
              icon={Landmark}
              placeholder="Enter Branch Name"
              value={formData.branchName}
              onChange={(v) => handleChange("branchName", v)}
              hasError={errors.branchName}
              readOnly={true}
            />

            {/* Area Code - Disabled in view mode */}
            <PickerInput
              labelEn="Area Code"
              labelHi="क्षेत्रीय कोड"
              icon={Building2}
              placeholder="Enter Area Code"
              value={formData.areaCode}
              onChange={(v) => handleChange("areaCode", v)}
              hasError={errors.areaCode}
              readOnly={isView}
              handleOpenList={() => handleOpenList("area")}
            />

            {/* Area Description - Disabled in view mode */}
            <TextInput
              labelEn="Area Description"
              labelHi="क्षेत्राचे वर्णन"
              icon={Building2}
              placeholder="Area Description"
              value={formData.areaDescription}
              onChange={(v) => handleChange("areaDescription", v)}
              hasError={errors.areaDescription}
              readOnly={isView}
            />

            {/* Sub-Area Code - Disabled in view mode */}
            <PickerInput
              labelEn="Sub-Area Code"
              labelHi="उप-क्षेत्रीय कोड"
              icon={Building2}
              placeholder="Enter Sub-Area Code"
              value={formData.subareaCode}
              onChange={(v) => handleChange("subareaCode", v)}
              hasError={errors.subareaCode}
              readOnly={isView}
              handleOpenList={() => handleOpenList("subarea")}
            />

            {/* Sub-Area Description - Disabled in view mode */}
            <TextInput
              labelEn="Sub-Area Description"
              labelHi="उप-क्षेत्रीय वर्णन"
              icon={Building2}
              placeholder="Sub-Area Description"
              value={formData.subareaDescription}
              onChange={(v) => handleChange("subareaDescription", v)}
              hasError={errors.subareaDescription}
              readOnly={isView}
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


/* ===== from ViewAndEditParameter.tsx ===== */
export interface ViewAndEditParameter_ParameterFormData {
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

export const ViewAndEditParameter_emptyParameterFormData: ViewAndEditParameter_ParameterFormData = {
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

type ViewAndEditParameter_RequiredFieldKey = keyof Pick<
  ViewAndEditParameter_ParameterFormData,
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

const ViewAndEditParameter_REQUIRED_FIELDS: ViewAndEditParameter_RequiredFieldKey[] = [
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

const ViewAndEditParameter_COUNTRY_OPTIONS = [
  { value: "", label: "Select Country" },
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
];

const ViewAndEditParameter_CITY_CODE_OPTIONS = [
  { value: "", label: "Select City Code" },
  { value: "MUM", label: "Mumbai" },
  { value: "DEL", label: "Delhi" },
  { value: "BLR", label: "Bangalore" },
  { value: "CHN", label: "Chennai" },
  { value: "HYD", label: "Hyderabad" },
  { value: "PUN", label: "Pune" },
];

const ViewAndEditParameter_STATE_OPTIONS = [
  { value: "", label: "Select State" },
  { value: "MH", label: "Maharashtra" },
  { value: "DL", label: "Delhi" },
  { value: "KA", label: "Karnataka" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "TG", label: "Telangana" },
  { value: "UP", label: "Uttar Pradesh" },
];

export type ViewAndEditParameter_ParameterModalMode = "view" | "edit";

export interface ViewAndEditParameter_ParameterModalProps {
  open: boolean;
  mode: ViewAndEditParameter_ParameterModalMode;
  initialData?: ViewAndEditParameter_ParameterFormData;
  onClose?: () => void;
  onSave?: (data: ViewAndEditParameter_ParameterFormData) => void | Promise<void>;
  onValidate?: (data: ViewAndEditParameter_ParameterFormData) => void;
}

function ViewEditParameterModal({
  open,
  mode,
  initialData = ViewAndEditParameter_emptyParameterFormData,
  onClose,
  onSave,
  onValidate,
}: ViewAndEditParameter_ParameterModalProps) {
  const [formData, setFormData] = useState<ViewAndEditParameter_ParameterFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<ViewAndEditParameter_RequiredFieldKey, boolean>>
  >({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
    setShowSuccessModal(false);
  }, [initialData, open]);

  if (!open) return null;

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleChange = <K extends keyof ViewAndEditParameter_ParameterFormData>(
    key: K,
    value: ViewAndEditParameter_ParameterFormData[K],
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (ViewAndEditParameter_REQUIRED_FIELDS.includes(key as ViewAndEditParameter_RequiredFieldKey)) {
      setErrors((prev) => ({ ...prev, [key as ViewAndEditParameter_RequiredFieldKey]: false }));
    }
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<ViewAndEditParameter_RequiredFieldKey, boolean>> = {};
    ViewAndEditParameter_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    if (isValid && onValidate) {
      onValidate(formData);
    }
  };

  const handleSave = async () => {
    const newErrors: Partial<Record<ViewAndEditParameter_RequiredFieldKey, boolean>> = {};
    ViewAndEditParameter_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    if (!isValid || saving) return;

    setSaving(true);
    try {
      await onSave?.(formData);
      // Show success modal only once the save actually succeeded — the caller
      // is responsible for surfacing its own error UI (e.g. a rejection modal)
      // and rethrows so this modal stays open for the user to retry.
      setShowSuccessModal(true);
    } catch {
      // swallow — the parent already reports the failure via its own error modal
    } finally {
      setSaving(false);
    }
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
        label: saving ? "Saving..." : "Save",
        onClick: handleSave,
        variant: "primary" as const,
        icon: <Check size={16} />,
        disabled: !validated || saving,
        className: validated && !saving
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
      options: ViewAndEditParameter_CITY_CODE_OPTIONS,
      key: "cityCode" as const,
    },
    {
      id: "state",
      type: "select" as const,
      labelEn: "State",
      labelHi: "राज्य",
      icon: Landmark,
      options: ViewAndEditParameter_STATE_OPTIONS,
      key: "state" as const,
    },
    // Row 4: Country, Email ID, Is Implemented
    {
      id: "country",
      type: "select" as const,
      labelEn: "Country",
      labelHi: "देश",
      icon: Flag,
      options: ViewAndEditParameter_COUNTRY_OPTIONS,
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
    const hasError = ViewAndEditParameter_REQUIRED_FIELDS.includes(field.key as ViewAndEditParameter_RequiredFieldKey)
      ? errors[field.key as ViewAndEditParameter_RequiredFieldKey]
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
          required={ViewAndEditParameter_REQUIRED_FIELDS.includes(field.key as ViewAndEditParameter_RequiredFieldKey)}
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
        required={ViewAndEditParameter_REQUIRED_FIELDS.includes(field.key as ViewAndEditParameter_RequiredFieldKey)}
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


/* ===== from BranchChequeBookLotModal.tsx ===== */
export interface BranchChequeBookLotModal_ChequeBookLotFormData {
  branchCode: string;
  branchName: string;
  accountType: string;
  chequeType: string;
  chequeNoFrom: string;
  chequeNoTo: string;
  leavesPerBook: string;
  noOfBooks: string;
  chequeSeries: string;
}

export const BranchChequeBookLotModal_emptyChequeBookLotFormData: BranchChequeBookLotModal_ChequeBookLotFormData = {
  branchCode: "",
  branchName: "",
  accountType: "",
  chequeType: "",
  chequeNoFrom: "",
  chequeNoTo: "",
  leavesPerBook: "",
  noOfBooks: "",
  chequeSeries: "",
};

export function BranchChequeBookLotModal_rowToChequeBookLotFormData(row: BranchMasterTable_BranchRow): BranchChequeBookLotModal_ChequeBookLotFormData {
  return {
    ...BranchChequeBookLotModal_emptyChequeBookLotFormData,
    branchCode: row.branchCode,
    branchName: row.branchName,
  };
}

const BranchChequeBookLotModal_ACCOUNT_TYPE_OPTIONS = ["SB", "CA", "CC", "OD", "TD", "RD"];
const BranchChequeBookLotModal_CHEQUE_TYPE_OPTIONS = ["CTS", "MICR", "Non-MICR"];

const BranchChequeBookLotModal_REQUIRED_FIELDS: (keyof BranchChequeBookLotModal_ChequeBookLotFormData)[] = [
  "branchCode", "branchName", "accountType",
  "chequeType", "chequeNoFrom", "chequeNoTo",
  "leavesPerBook", "noOfBooks", "chequeSeries",
];

interface BranchChequeBookLotModal_TextFieldProps {
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  readOnly?: boolean;
  trailing?: React.ReactNode;
}

function BranchChequeBookLotModal_TextField({ labelEn, labelHi, icon: Icon, placeholder, value, onChange, hasError, readOnly = false, trailing }: BranchChequeBookLotModal_TextFieldProps) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1.5 block text-[13px] font-medium text-black dark:text-slate-100">
        {labelEn} <span className="font-medium text-gray-500 dark:text-slate-400">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2">
        <div
          className={`flex h-11 w-full items-center rounded-lg border px-3 transition-colors ${hasError
              ? "border-red-400 bg-white dark:bg-slate-900"
              : readOnly
                ? "border-slate-400 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                : "border-[#B8C2D6] bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:bg-slate-900 dark:border-slate-700"
            }`}
        >
          <Icon size={18} className="shrink-0 text-[#6B7280] dark:text-slate-400" />
          {readOnly ? (
            <span className={`ml-3 w-full truncate text-[15px] ${value ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}>{value || placeholder}</span>
          ) : (
            <input
              type="text"
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              className="ml-3 w-full bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder-slate-500"
            />
          )}
        </div>
        {trailing}
      </div>
      {hasError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">This field is required</p>}
    </div>
  );
}

interface BranchChequeBookLotModal_SelectFieldProps {
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  hasError?: boolean;
  readOnly?: boolean;
  trailing?: React.ReactNode;
}

function BranchChequeBookLotModal_SelectField({ labelEn, labelHi, icon: Icon, placeholder, value, options, onChange, hasError, readOnly = false, trailing }: BranchChequeBookLotModal_SelectFieldProps) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1.5 block text-[13px] font-medium text-black dark:text-slate-100">
        {labelEn} <span className="font-medium text-gray-500 dark:text-slate-400">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2">
        <div
          className={`relative flex h-11 w-full items-center rounded-lg border px-3 ${hasError ? "border-red-400 bg-white dark:bg-slate-900" : readOnly ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800" : "border-[#B8C2D6] bg-white dark:bg-slate-900 dark:border-slate-700"
            }`}
        >
          <Icon size={18} className="shrink-0 text-[#6B7280] dark:text-slate-400" />
          {readOnly ? (
            <span className={`ml-3 w-full truncate text-[15px] ${value ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}>{value || placeholder}</span>
          ) : (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="ml-3 w-full appearance-none bg-transparent text-[15px] text-[#4B5563] outline-none dark:text-slate-100"
            >
              <option value="">{placeholder}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          <ChevronDown size={16} className="shrink-0 text-gray-400 dark:text-slate-500" />
        </div>
        {trailing}
      </div>
      {hasError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">This field is required</p>}
    </div>
  );
}

interface BranchChequeBookLotModal_SectionHeaderProps {
  icon: LucideIcon;
  titleEn: string;
  titleHi: string;
}

function BranchChequeBookLotModal_SectionHeader({ icon: Icon, titleEn, titleHi }: BranchChequeBookLotModal_SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-slate-800">
        <Icon size={18} />
      </div>
      <h3 className="text-lg font-bold text-black dark:text-slate-100">
        {titleEn} <span className="font-bold text-[#64748B] dark:text-slate-400">/ {titleHi}</span>
      </h3>
    </div>
  );
}

export interface BranchChequeBookLotModal_BranchChequeBookLotModalProps {
  open: boolean;
  initialData?: BranchChequeBookLotModal_ChequeBookLotFormData;
  onClose?: () => void;
  onSave?: (data: BranchChequeBookLotModal_ChequeBookLotFormData) => void;
}

function BranchChequeBookLotModal({ open, initialData = BranchChequeBookLotModal_emptyChequeBookLotFormData, onClose, onSave }: BranchChequeBookLotModal_BranchChequeBookLotModalProps) {
  const [formData, setFormData] = useState<BranchChequeBookLotModal_ChequeBookLotFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BranchChequeBookLotModal_ChequeBookLotFormData, boolean>>>({});

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = <K extends keyof BranchChequeBookLotModal_ChequeBookLotFormData>(key: K, value: BranchChequeBookLotModal_ChequeBookLotFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<keyof BranchChequeBookLotModal_ChequeBookLotFormData, boolean>> = {};
    BranchChequeBookLotModal_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleSave = () => {
    if (!validated) return;
    onSave?.(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-4xl bg-white p-8 shadow-2xl dark:bg-slate-900"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white">
              <Smartphone size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black dark:text-slate-100">
                Branch Cheque Book Lot /<span className="font-bold text-[#64748B] dark:text-slate-400"> शाखा धनादेश पुस्तक लॉट</span>
              </h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <BranchChequeBookLotModal_SectionHeader icon={UserRound} titleEn="Branch Details" titleHi="शाखेचा तपशील" />
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
            <BranchChequeBookLotModal_TextField labelEn="Branch Code" labelHi="शाखा कोड" icon={Landmark} placeholder="Enter Branch Code" value={formData.branchCode} onChange={(v) => handleChange("branchCode", v)} hasError={errors.branchCode} readOnly />
            <BranchChequeBookLotModal_TextField labelEn="Branch Name" labelHi="शाखेचे नाव" icon={Landmark} placeholder="Enter Branch Name" value={formData.branchName} onChange={(v) => handleChange("branchName", v)} hasError={errors.branchName} readOnly />
            <BranchChequeBookLotModal_SelectField
              labelEn="Account Type"
              labelHi="खात्याचा प्रकार"
              icon={UserRound}
              placeholder="Select Account Type"
              value={formData.accountType}
              options={BranchChequeBookLotModal_ACCOUNT_TYPE_OPTIONS}
              onChange={(v) => handleChange("accountType", v)}
              hasError={errors.accountType}
              trailing={
                <button
                  type="button"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition-colors hover:bg-[#DCE9FF] dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <MoreVertical size={18} />
                </button>
              }
            />
          </div>
        </div>

        <div className="mt-4 bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <BranchChequeBookLotModal_SectionHeader icon={IdCard} titleEn="Cheque Details" titleHi="तपशील तपासा" />
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
            <BranchChequeBookLotModal_SelectField labelEn="Cheque Type" labelHi="चेक प्रकार" icon={IdCard} placeholder="Select Cheque Type" value={formData.chequeType} options={BranchChequeBookLotModal_CHEQUE_TYPE_OPTIONS} onChange={(v) => handleChange("chequeType", v)} hasError={errors.chequeType} />
            <BranchChequeBookLotModal_TextField labelEn="Cheque No From" labelHi="चेक क्रमांकापासून" icon={Hash} placeholder="Enter Cheque No From" value={formData.chequeNoFrom} onChange={(v) => handleChange("chequeNoFrom", v)} hasError={errors.chequeNoFrom} />
            <BranchChequeBookLotModal_TextField labelEn="Cheque No To" labelHi="चेक क्रमांकापर्यंत" icon={Hash} placeholder="Enter Cheque No To" value={formData.chequeNoTo} onChange={(v) => handleChange("chequeNoTo", v)} hasError={errors.chequeNoTo} />

            <BranchChequeBookLotModal_TextField labelEn="Leaves per Book" labelHi="प्रत्येक पुस्तकातील पानांची संख्या" icon={BookOpen} placeholder="Enter Leaves per Book" value={formData.leavesPerBook} onChange={(v) => handleChange("leavesPerBook", v)} hasError={errors.leavesPerBook} />
            <BranchChequeBookLotModal_TextField labelEn="No Of Books" labelHi="धनादेश पुस्तकांची संख्या" icon={Layers} placeholder="Enter No Of Books" value={formData.noOfBooks} onChange={(v) => handleChange("noOfBooks", v)} hasError={errors.noOfBooks} />
            <BranchChequeBookLotModal_TextField labelEn="Cheque Series" labelHi="चेक प्रकार" icon={Type} placeholder="Enter Cheque Series" value={formData.chequeSeries} onChange={(v) => handleChange("chequeSeries", v)} hasError={errors.chequeSeries} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button type="button" onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">
            Validate <Check size={16} />
          </button>
          <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50">
            Cancel <X size={16} />
          </button>
          <button
            type="button"
            disabled={!validated}
            onClick={handleSave}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${validated ? "bg-primary-100 text-primary hover:bg-primary-200" : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600"
              }`}
          >
            Save <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}


/* ===== from BranchNonCBS.tsx ===== */
/* ------------------------------------------------------------------ */
/*  BranchNonCBS_TextField — EXACTLY LIKE PIGMY CLOSING                           */
/* ------------------------------------------------------------------ */

interface BranchNonCBS_TextFieldProps {
  labelEn: string;
  labelHi: string;
  icon?: React.ElementType;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  readOnly?: boolean;
}

function BranchNonCBS_TextField({
  labelEn,
  labelHi,
  icon: Icon,
  placeholder,
  value,
  onChange,
  hasError,
  readOnly,
}: BranchNonCBS_TextFieldProps) {
  return (
    <div className="mb-3 last:mb-0">
      <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
        {labelEn} <span className="text-slate-400 font-normal">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div
        className={`group flex items-center w-full h-8 rounded-[10px] border px-2.5 transition-all duration-200 ${
          readOnly
            ? "bg-[#f0f2f5] border-slate-200 cursor-not-allowed"
            : hasError
              ? "bg-white border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"
              : "bg-white border-slate-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
        }`}
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={`ml-2 w-full bg-transparent outline-none text-[11px] placeholder:text-[11px] placeholder:text-slate-400 placeholder:font-normal ${
            readOnly ? "text-slate-500 cursor-not-allowed" : "text-slate-600"
          }`}
        />
      </div>
      {hasError && <p className="mt-1 text-[10px] text-red-500">Required</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BranchNonCBS_CardSection — EXACTLY LIKE PIGMY CLOSING                         */
/* ------------------------------------------------------------------ */

function BranchNonCBS_CardSection({
  icon: Icon,
  titleEn,
  titleHi,
  descriptionEn,
  descriptionHi,
  children,
}: {
  icon?: React.ElementType;
  titleEn: string;
  titleHi: string;
  descriptionEn?: string;
  descriptionHi?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#0256cc]/60 border-t-[3.5px] border-t-[#0256cc] rounded-[14px] p-4 sm:p-5 bg-white shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
          {Icon && <Icon className="w-4 h-4 text-blue-600" />}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {titleEn} <span className="text-slate-400 font-normal text-xs">/ {titleHi}</span>
          </h2>
          {descriptionEn && (
            <p className="text-[10px] text-slate-500 mt-0.5">
              {descriptionEn} {descriptionHi && `/ ${descriptionHi}`}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form data — UNCHANGED                                              */
/* ------------------------------------------------------------------ */

export interface BranchNonCBS_BranchNonCBSFormData {
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  isDayBeginExecuted: "Yes" | "No" | "";
  isDayEndExecuted: "Yes" | "No" | "";
  isDenominationRequired: "Yes" | "No" | "";
  isYearAutoRenewalAtDayBegin: "Yes" | "No" | "";
  isSBInterestPostAtDayEnd: "Yes" | "No" | "";
  isCAInterestPostAtDayEnd: "Yes" | "No" | "";
  isTDInterestPostAtDayEnd: "Yes" | "No" | "";
  isTLInterestPostAtDayEnd: "Yes" | "No" | "";
  isCCInterestPostAtDayEnd: "Yes" | "No" | "";
}

export const BranchNonCBS_emptyBranchNonCBSFormData: BranchNonCBS_BranchNonCBSFormData = {
  bankCode: "",
  bankName: "",
  branchCode: "",
  branchName: "",
  isDayBeginExecuted: "",
  isDayEndExecuted: "",
  isDenominationRequired: "",
  isYearAutoRenewalAtDayBegin: "",
  isSBInterestPostAtDayEnd: "",
  isCAInterestPostAtDayEnd: "",
  isTDInterestPostAtDayEnd: "",
  isTLInterestPostAtDayEnd: "",
  isCCInterestPostAtDayEnd: "",
};

export function BranchNonCBS_rowToBranchNonCBSFormData(row: BranchMasterTable_BranchRow): BranchNonCBS_BranchNonCBSFormData {
  return {
    ...BranchNonCBS_emptyBranchNonCBSFormData,
    branchCode: row.branchCode,
    branchName: row.branchName,
  };
}

const BranchNonCBS_REQUIRED_FIELDS: (keyof BranchNonCBS_BranchNonCBSFormData)[] = [
  "bankCode", "bankName", "branchCode", "branchName",
  "isDayBeginExecuted", "isDayEndExecuted", "isDenominationRequired",
  "isYearAutoRenewalAtDayBegin", "isSBInterestPostAtDayEnd",
  "isCAInterestPostAtDayEnd", "isTDInterestPostAtDayEnd",
  "isTLInterestPostAtDayEnd", "isCCInterestPostAtDayEnd",
];

/* ------------------------------------------------------------------ */
/*  Radio field — EXACTLY LIKE PIGMY CLOSING                         */
/* ------------------------------------------------------------------ */

interface BranchNonCBS_RadioFieldProps {
  labelEn: string;
  labelHi: string;
  value: "Yes" | "No" | "";
  onChange: (value: "Yes" | "No") => void;
  hasError?: boolean;
  name: string;
}

function BranchNonCBS_RadioField({ labelEn, labelHi, value, onChange, hasError, name }: BranchNonCBS_RadioFieldProps) {
  return (
    <div className="mb-2">
      <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
        {labelEn} <span className="text-slate-400 font-normal">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-6 mt-1">
        <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
          <input type="radio" name={name} checked={value === "Yes"} onChange={() => onChange("Yes")} className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
          <span className="font-medium">Yes</span>
        </label>
        <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
          <input type="radio" name={name} checked={value === "No"} onChange={() => onChange("No")} className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
          <span className="font-medium">No</span>
        </label>
      </div>
      {hasError && <p className="mt-1 text-[10px] text-red-500">Required</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal — EXACTLY LIKE PIGMY CLOSING                               */
/* ------------------------------------------------------------------ */

interface BranchNonCBS_BranchNonCBSModalProps {
  open: boolean;
  initialData: BranchNonCBS_BranchNonCBSFormData;
  onClose: () => void;
  onSave: (data: BranchNonCBS_BranchNonCBSFormData) => void;
}

export function BranchNonCBS_BranchNonCBSModal({ open, initialData, onClose, onSave }: BranchNonCBS_BranchNonCBSModalProps) {
  const [formData, setFormData] = useState<BranchNonCBS_BranchNonCBSFormData>({
    ...initialData,
    bankCode: "0100",
    bankName: "State Bank of India",
    branchCode: "0100",
    branchName: "Ilkal Branch",
  });
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BranchNonCBS_BranchNonCBSFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        ...initialData,
        bankCode: "0100",
        bankName: "State Bank of India",
        branchCode: "0100",
        branchName: "Ilkal Branch",
      });
      setValidated(false);
      setErrors({});
      setShowSuccess(false);
    }
  }, [initialData, open]);

  if (!open && !showSuccess) return null;

  const handleChange = <K extends keyof BranchNonCBS_BranchNonCBSFormData>(key: K, value: BranchNonCBS_BranchNonCBSFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const runValidation = (): boolean => {
    const newErrors: Partial<Record<keyof BranchNonCBS_BranchNonCBSFormData, boolean>> = {};
    BranchNonCBS_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setValidated(valid);
    return valid;
  };

  const handleValidate = () => {
    runValidation();
  };

  const handleSave = () => {
    if (!validated) return;
    const valid = runValidation();
    if (!valid) return;
    onSave(formData);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]" onClick={onClose}>
        <div
          className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[20px] bg-white p-6 sm:p-8 shadow-2xl"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={IMAGES.ADD_ICON}
                alt="Branch Parameter Non CBS"
                width={36}
                height={36}
                className="shrink-0"
              />
              <h2 className="text-xl font-bold text-slate-800">
                Branch Parameter Non CBS <span className="text-slate-400 font-normal text-sm">/ शाखा मापदंड (Non-CBS)</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Branch Details */}
          <BranchNonCBS_CardSection
            icon={Landmark}
            titleEn="Branch Details"
            titleHi="शाखेचा तपशील"
            descriptionEn="Bank and branch identification for this Non-CBS parameter."
            descriptionHi="या Non-CBS मापदंडासाठी बँक व शाखा माहिती."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <BranchNonCBS_TextField 
                labelEn="Bank Code" 
                labelHi="बँक कोड" 
                icon={Landmark} 
                placeholder="Enter Bank Code" 
                value={formData.bankCode} 
                onChange={(v) => handleChange("bankCode", v)} 
                hasError={errors.bankCode} 
              />
              <BranchNonCBS_TextField 
                labelEn="Bank Name" 
                labelHi="बँकेचे नाव" 
                icon={Landmark} 
                placeholder="Enter Bank Name" 
                value={formData.bankName} 
                onChange={(v) => handleChange("bankName", v)} 
                hasError={errors.bankName} 
              />
              <BranchNonCBS_TextField 
                labelEn="Branch Code" 
                labelHi="शाखा कोड" 
                icon={Landmark} 
                placeholder="Enter Branch Code" 
                value={formData.branchCode} 
                onChange={(v) => handleChange("branchCode", v)} 
                hasError={errors.branchCode} 
                readOnly 
              />
              <BranchNonCBS_TextField 
                labelEn="Branch Name" 
                labelHi="शाखेचे नाव" 
                icon={Landmark} 
                placeholder="Enter Branch Name" 
                value={formData.branchName} 
                onChange={(v) => handleChange("branchName", v)} 
                hasError={errors.branchName} 
              />
            </div>
          </BranchNonCBS_CardSection>

          {/* Details (Yes/No settings) */}
          <div className="mt-4">
            <BranchNonCBS_CardSection
              icon={UserRound}
              titleEn="Details"
              titleHi="तपशील"
              descriptionEn="Day-end, interest posting and renewal settings for this branch."
              descriptionHi="या शाखेसाठी दिवस-अखेर, व्याज पोस्टिंग व नूतनीकरण सेटिंग्ज."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                <BranchNonCBS_RadioField 
                  name="isDayBeginExecuted" 
                  labelEn="Is Day Begin Executed" 
                  labelHi="दिवस प्रारंभ" 
                  value={formData.isDayBeginExecuted} 
                  onChange={(v) => handleChange("isDayBeginExecuted", v)} 
                  hasError={errors.isDayBeginExecuted} 
                />
                <BranchNonCBS_RadioField 
                  name="isDayEndExecuted" 
                  labelEn="Is Day End Executed" 
                  labelHi="दिवस समाप्त" 
                  value={formData.isDayEndExecuted} 
                  onChange={(v) => handleChange("isDayEndExecuted", v)} 
                  hasError={errors.isDayEndExecuted} 
                />
                <BranchNonCBS_RadioField 
                  name="isDenominationRequired" 
                  labelEn="Is Denomination Required" 
                  labelHi="चलन तपशील" 
                  value={formData.isDenominationRequired} 
                  onChange={(v) => handleChange("isDenominationRequired", v)} 
                  hasError={errors.isDenominationRequired} 
                />
                <BranchNonCBS_RadioField 
                  name="isYearAutoRenewalAtDayBegin" 
                  labelEn="Is Year Auto Renewal At Day Begin" 
                  labelHi="वर्ष नूतनीकरण" 
                  value={formData.isYearAutoRenewalAtDayBegin} 
                  onChange={(v) => handleChange("isYearAutoRenewalAtDayBegin", v)} 
                  hasError={errors.isYearAutoRenewalAtDayBegin} 
                />
                <BranchNonCBS_RadioField 
                  name="isSBInterestPostAtDayEnd" 
                  labelEn="Is SB Interest Post At Day End" 
                  labelHi="एसबी व्याज पोस्ट" 
                  value={formData.isSBInterestPostAtDayEnd} 
                  onChange={(v) => handleChange("isSBInterestPostAtDayEnd", v)} 
                  hasError={errors.isSBInterestPostAtDayEnd} 
                />
                <BranchNonCBS_RadioField 
                  name="isCAInterestPostAtDayEnd" 
                  labelEn="Is CA Interest Post At Day End" 
                  labelHi="सीए व्याज पोस्ट" 
                  value={formData.isCAInterestPostAtDayEnd} 
                  onChange={(v) => handleChange("isCAInterestPostAtDayEnd", v)} 
                  hasError={errors.isCAInterestPostAtDayEnd} 
                />
                <BranchNonCBS_RadioField 
                  name="isTDInterestPostAtDayEnd" 
                  labelEn="Is TD Interest Post At Day End" 
                  labelHi="TD व्याज पोस्ट" 
                  value={formData.isTDInterestPostAtDayEnd} 
                  onChange={(v) => handleChange("isTDInterestPostAtDayEnd", v)} 
                  hasError={errors.isTDInterestPostAtDayEnd} 
                />
                <BranchNonCBS_RadioField 
                  name="isTLInterestPostAtDayEnd" 
                  labelEn="Is TL Interest Post At Day End" 
                  labelHi="TL व्याज पोस्ट" 
                  value={formData.isTLInterestPostAtDayEnd} 
                  onChange={(v) => handleChange("isTLInterestPostAtDayEnd", v)} 
                  hasError={errors.isTLInterestPostAtDayEnd} 
                />
                <BranchNonCBS_RadioField 
                  name="isCCInterestPostAtDayEnd" 
                  labelEn="Is CC Interest Post At Day End" 
                  labelHi="CC व्याज पोस्ट" 
                  value={formData.isCCInterestPostAtDayEnd} 
                  onChange={(v) => handleChange("isCCInterestPostAtDayEnd", v)} 
                  hasError={errors.isCCInterestPostAtDayEnd} 
                />
              </div>
            </BranchNonCBS_CardSection>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pb-1 flex-wrap">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              Validate <Check size={14} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2 bg-white border border-[#0b66c2] text-[#0b66c2] hover:bg-slate-50 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              Cancel <X size={14} />
            </button>
            <button
              type="button"
              disabled={!validated}
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-6 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                validated ? "bg-[#1F67F4] text-white hover:bg-[#0E57EA] shadow-sm" : "bg-[#e2e8f0] text-slate-400 cursor-not-allowed"
              }`}
            >
              Modify <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleSuccessClose}
          onDone={handleSuccessClose}
          title="Non CBS Parameter Saved"
          subtitle="Successfully"
          variant="success"
        />
      )}
    </>
  );
}


/* ===== from BranchTDReciptLot.tsx ===== */
/* ------------------------------------------------------------------ */
/*  BranchTDReciptLot_TextField — EXACTLY LIKE PIGMY CLOSING                           */
/* ------------------------------------------------------------------ */

interface BranchTDReciptLot_TextFieldProps {
  labelEn: string;
  labelHi: string;
  icon?: React.ElementType;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

function BranchTDReciptLot_TextField({
  labelEn,
  labelHi,
  icon: Icon,
  placeholder,
  value,
  onChange,
  hasError,
  readOnly,
  required,
}: BranchTDReciptLot_TextFieldProps) {
  return (
    <div className="mb-3 last:mb-0">
      <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
        {labelEn} <span className="text-slate-400 font-normal">/ {labelHi}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`group flex items-center w-full h-8 rounded-[10px] border px-2.5 transition-all duration-200 ${
          readOnly
            ? "bg-[#f0f2f5] border-slate-200 cursor-not-allowed"
            : hasError
              ? "bg-white border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"
              : "bg-white border-slate-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
        }`}
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={`ml-2 w-full bg-transparent outline-none text-[11px] placeholder:text-[11px] placeholder:text-slate-400 placeholder:font-normal ${
            readOnly ? "text-slate-500 cursor-not-allowed" : "text-slate-600"
          }`}
        />
      </div>
      {hasError && <p className="mt-1 text-[10px] text-red-500">This field is required</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BranchTDReciptLot_CardSection — EXACTLY LIKE PIGMY CLOSING                         */
/* ------------------------------------------------------------------ */

function BranchTDReciptLot_CardSection({
  icon: Icon,
  titleEn,
  titleHi,
  descriptionEn,
  descriptionHi,
  children,
}: {
  icon?: React.ElementType;
  titleEn: string;
  titleHi: string;
  descriptionEn?: string;
  descriptionHi?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#0256cc]/60 border-t-[3.5px] border-t-[#0256cc] rounded-[14px] p-4 sm:p-5 bg-white shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
          {Icon && <Icon className="w-4 h-4 text-blue-600" />}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {titleEn} <span className="text-slate-400 font-normal text-xs">/ {titleHi}</span>
          </h2>
          {descriptionEn && (
            <p className="text-[10px] text-slate-500 mt-0.5">
              {descriptionEn} {descriptionHi && `/ ${descriptionHi}`}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form data — UNCHANGED                                              */
/* ------------------------------------------------------------------ */

export interface BranchTDReciptLot_TdReceiptLotFormData {
  branchCode: string;
  branchName: string;
  accountType: string;
  fromReceiptNumber: string;
  toReceiptNumber: string;
}

export const BranchTDReciptLot_emptyTdReceiptLotFormData: BranchTDReciptLot_TdReceiptLotFormData = {
  branchCode: "",
  branchName: "",
  accountType: "",
  fromReceiptNumber: "",
  toReceiptNumber: "",
};

export function BranchTDReciptLot_rowToTdReceiptLotFormData(row: BranchMasterTable_BranchRow): BranchTDReciptLot_TdReceiptLotFormData {
  return {
    ...BranchTDReciptLot_emptyTdReceiptLotFormData,
    branchCode: row.branchCode,
    branchName: row.branchName,
    accountType: "SB",
  };
}

const BranchTDReciptLot_REQUIRED_FIELDS: (keyof BranchTDReciptLot_TdReceiptLotFormData)[] = [
  "branchCode",
  "branchName",
  "accountType",
  "fromReceiptNumber",
  "toReceiptNumber",
];

/* ------------------------------------------------------------------ */
/*  Modal — EXACTLY LIKE PIGMY CLOSING                               */
/* ------------------------------------------------------------------ */

interface BranchTDReciptLot_BranchTdReceiptLotModalProps {
  open: boolean;
  initialData: BranchTDReciptLot_TdReceiptLotFormData;
  onClose: () => void;
  onSave: (data: BranchTDReciptLot_TdReceiptLotFormData) => void;
}

export function BranchTDReciptLot_BranchTdReceiptLotModal({
  open,
  initialData,
  onClose,
  onSave,
}: BranchTDReciptLot_BranchTdReceiptLotModalProps) {
  const [formData, setFormData] = useState<BranchTDReciptLot_TdReceiptLotFormData>({
    ...initialData,
    branchCode: "0002",
    branchName: "Main Branch, Bilagi",
    accountType: "SB",
    fromReceiptNumber: "70010",
    toReceiptNumber: "70020",
  });
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BranchTDReciptLot_TdReceiptLotFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        ...initialData,
        branchCode: "0002",
        branchName: "Main Branch, Bilagi",
        accountType: "SB",
        fromReceiptNumber: "70010",
        toReceiptNumber: "70020",
      });
      setValidated(false);
      setErrors({});
      setShowSuccess(false);
    }
  }, [initialData, open]);

  if (!open && !showSuccess) return null;

  const handleChange = <K extends keyof BranchTDReciptLot_TdReceiptLotFormData>(
    key: K,
    value: BranchTDReciptLot_TdReceiptLotFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const runValidation = (): boolean => {
    const newErrors: Partial<Record<keyof BranchTDReciptLot_TdReceiptLotFormData, boolean>> = {};
    BranchTDReciptLot_REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setValidated(valid);
    return valid;
  };

  const handleValidate = () => {
    runValidation();
  };

  const handleSave = () => {
    if (!validated) return;
    const valid = runValidation();
    if (!valid) return;
    onSave(formData);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={onClose}
        >
        <div
          className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[20px] bg-white p-6 sm:p-8 shadow-2xl"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={IMAGES.TD_LOT}
                alt="Branch TD Receipt Lot"
                width={36}
                height={36}
                className="shrink-0"
              />
              <h2 className="text-xl font-bold text-slate-800">
                Branch TD Receipt Lot{" "}
                <span className="text-slate-400 font-normal text-sm">
                  / शाखा मुद्दत ठेव पावती लॉट
                </span>
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Branch Details */}
          <BranchTDReciptLot_CardSection
            icon={Building2}
            titleEn="Branch Details"
            titleHi="शाखेचा तपशील"
            descriptionEn=""
            descriptionHi=""
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <BranchTDReciptLot_TextField
                labelEn="Branch Code"
                labelHi="शाखा कोड"
                icon={Hash}
                placeholder="Enter Branch Code"
                value={formData.branchCode}
                onChange={(v) => handleChange("branchCode", v)}
                hasError={errors.branchCode}
                required
                readOnly
              />
              <BranchTDReciptLot_TextField
                labelEn="Branch Name"
                labelHi="शाखेचे नाव"
                icon={Building2}
                placeholder="Enter Branch Name"
                value={formData.branchName}
                onChange={(v) => handleChange("branchName", v)}
                hasError={errors.branchName}
                required
              />
              <BranchTDReciptLot_TextField
                labelEn="Account Type"
                labelHi="खात्याचा प्रकार"
                icon={CreditCard}
                placeholder="Enter Account Type"
                value={formData.accountType}
                onChange={(v) => handleChange("accountType", v)}
                hasError={errors.accountType}
                required
              />
            </div>
          </BranchTDReciptLot_CardSection>

          {/* Term Deposit Details */}
          <div className="mt-4">
            <BranchTDReciptLot_CardSection
              icon={Hash}
              titleEn="Term Deposit Details"
              titleHi="मुद्दत ठेव तपशील"
              descriptionEn=""
              descriptionHi=""
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <BranchTDReciptLot_TextField
                  labelEn="From Receipt Number"
                  labelHi="चेक क्रमांकापासून"
                  icon={Hash}
                  placeholder="Enter From Receipt Number"
                  value={formData.fromReceiptNumber}
                  onChange={(v) => handleChange("fromReceiptNumber", v)}
                  hasError={errors.fromReceiptNumber}
                  required
                />
                <BranchTDReciptLot_TextField
                  labelEn="To Receipt Number"
                  labelHi="चेक क्रमांकापर्यंत"
                  icon={Hash}
                  placeholder="Enter To Receipt Number"
                  value={formData.toReceiptNumber}
                  onChange={(v) => handleChange("toReceiptNumber", v)}
                  hasError={errors.toReceiptNumber}
                  required
                />
              </div>
            </BranchTDReciptLot_CardSection>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pb-1 flex-wrap">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              Validate <Check size={14} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2 bg-white border border-[#0b66c2] text-[#0b66c2] hover:bg-slate-50 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              Cancel <X size={14} />
            </button>
            <button
              type="button"
              disabled={!validated}
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-6 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                validated ? "bg-[#1F67F4] text-white hover:bg-[#0E57EA] shadow-sm" : "bg-[#e2e8f0] text-slate-400 cursor-not-allowed"
              }`}
            >
              Save <ChevronDown size={14} />
            </button>
          </div>
        </div>
        </div>
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleSuccessClose}
          onDone={handleSuccessClose}
          title="TD Receipt Lot Saved"
          subtitle="Successfully"
          variant="success"
        />
      )}
    </>
  );
}


/* ===== from FilterModal.tsx ===== */
const FilterModal_filterOptions = [
  {
    id: "branchCode",
    label: "Branch Code",
    icon: <Hash size={18} className="text-primary" />,
    placeholder: "Branch Code",
    inputIcon: <Hash size={18} className="text-primary" />,
  },
  {
    id: "branchName",
    label: "Branch Name",
    icon: <Landmark size={18} className="text-primary" />,
    placeholder: "Branch Name",
    inputIcon: <Landmark size={18} className="text-primary" />,
  },
  {
    id: "cityCode",
    label: "City Code",
    icon: <MapPin size={18} className="text-primary" />,
    placeholder: "City Code",
    inputIcon: <MapPin size={18} className="text-primary" />,
  },
  {
    id: "isImplemented",
    label: "Is Implemented",
    icon: <ShieldCheck size={18} className="text-primary" />,
    placeholder: "Is Implemented",
    inputIcon: <ShieldCheck size={18} className="text-primary" />,
  },
] as const;

type FilterModal_FilterKey = (typeof FilterModal_filterOptions)[number]["id"];

export type FilterModal_BranchFilters = Record<FilterModal_FilterKey, string>;

type FilterModal_FilterModalProps = {
  onClose: () => void;
  onApply: (filters: FilterModal_BranchFilters) => void;
  initialValues?: FilterModal_BranchFilters;
};

export const FilterModal_defaultBranchFilterValues: FilterModal_BranchFilters = {
  branchCode: "",
  branchName: "",
  cityCode: "",
  isImplemented: "",
};

function FilterModal({
  onClose,
  onApply,
  initialValues = FilterModal_defaultBranchFilterValues,
}: FilterModal_FilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<FilterModal_FilterKey>("branchCode");
  const [values, setValues] = useState<FilterModal_BranchFilters>(initialValues);

  const active = FilterModal_filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues(FilterModal_defaultBranchFilterValues);
    onApply(FilterModal_defaultBranchFilterValues);
    onClose();
  };

  const handleApply = () => {
    onApply(values);
    onClose();
  };

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-primary bg-white p-8 dark:bg-slate-900">
      <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-8 top-8 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <X size={18} />
      </button>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary">
          <FilterIcon size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Filter</h2>
          <p className="text-gray-400 dark:text-slate-500">Use filter for fast and efficient searching</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 border-b border-gray-200 dark:border-slate-800" />

      <div className="relative z-10 mt-8 flex items-start gap-0">
        <div className="flex w-full max-w-[470px] flex-col gap-4">
          {FilterModal_filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <div key={option.id} className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveFilter(option.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-[#E8F1FD] dark:bg-slate-800"
                      : "border-primary bg-white dark:bg-slate-900"
                  }`}
                >
                  {option.icon}
                  <span className="text-lg font-medium text-gray-900 dark:text-slate-100">
                    {option.label}
                  </span>
                </button>

                {isActive && (
                  <div className="absolute -right-9 flex h-10 w-10 items-center justify-center">
                    <div className="h-0 w-0 border-y-[18px] border-l-[24px] border-y-transparent border-l-[#DCEBFC] dark:border-l-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ml-10 w-[800px] rounded-2xl bg-[#DCEBFC] p-6 h-[220px] flex flex-col justify-center dark:bg-slate-800">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-slate-100">
            {active?.label}
          </h3>
          {activeFilter === "isImplemented" ? (
            <div className="flex items-center gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="isImplemented"
                  className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
                  checked={values.isImplemented === "Yes"}
                  onChange={() => setValues((prev) => ({ ...prev, isImplemented: "Yes" }))}
                />
                <span className="ml-2 text-gray-900 dark:text-slate-100">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="isImplemented"
                  className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
                  checked={values.isImplemented === "No"}
                  onChange={() => setValues((prev) => ({ ...prev, isImplemented: "No" }))}
                />
                <span className="ml-2 text-gray-900 dark:text-slate-100">No</span>
              </label>
              {values.isImplemented && (
                <button
                  type="button"
                  onClick={() => setValues((prev) => ({ ...prev, isImplemented: "" }))}
                  className="text-sm font-medium text-primary underline hover:text-[#0a56aa]"
                >
                  Clear
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-4 py-3 dark:bg-slate-900">
              {active?.inputIcon}
              <input
                type="text"
                value={values[activeFilter]}
                onChange={handleChange}
                placeholder={active?.placeholder}
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-10 flex justify-center gap-4">
        <button
          type="button"
          onClick={handleClearAll}
          className="rounded-full border border-primary px-8 py-3 font-semibold text-primary hover:bg-[#F2F8FE]"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="rounded-full bg-primary px-10 py-3 font-semibold text-white hover:bg-[#0a56aa]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}


/* ===== from BranchMasterTable.tsx ===== */
export interface BranchMasterTable_BranchRow {
  sr: number;
  branchCode: string;
  ifscCode: string;
  branchName: string;
  shortName: string;
  address: string;
  cityCode: string;
  emailId: string;
  phoneNo: string;
  isImplemented: "Y" | "N";
}

type BranchMasterTable_SortableRowKey = Exclude<keyof BranchMasterTable_BranchRow, "sr">;

interface BranchMasterTable_ColumnDef {
  key: string;
  labelKey: string;
  sortKey?: BranchMasterTable_SortableRowKey;
}

type BranchMasterTable_SortDirection = "asc" | "desc";

interface BranchMasterTable_SortConfig {
  key: BranchMasterTable_SortableRowKey;
  direction: BranchMasterTable_SortDirection;
}

const BranchMasterTable_columns: BranchMasterTable_ColumnDef[] = [
  { key: "branchCode", labelKey: "branchMaster.table.branchCode", sortKey: "branchCode" },
  { key: "ifscCode", labelKey: "branchMaster.table.ifscCode", sortKey: "ifscCode" },
  { key: "branchName", labelKey: "branchMaster.table.branchName", sortKey: "branchName" },
  { key: "shortName", labelKey: "branchMaster.table.shortName", sortKey: "shortName" },
  { key: "address", labelKey: "branchMaster.table.address", sortKey: "address" },
  { key: "cityCode", labelKey: "branchMaster.table.cityCode", sortKey: "cityCode" },
  { key: "emailId", labelKey: "branchMaster.table.emailId", sortKey: "emailId" },
  { key: "phoneNo", labelKey: "branchMaster.table.phoneNo", sortKey: "phoneNo" },
  { key: "isImplemented", labelKey: "branchMaster.table.isImplemented", sortKey: "isImplemented" },
];

export const BranchMasterTable_DEFAULT_BRANCH_ROWS: BranchMasterTable_BranchRow[] = [
  { sr: 1, branchCode: "0100", ifscCode: "ILKA0000001", branchName: "Ilkal Branch", shortName: "Ikala", address: "Gongada Shetti Building", cityCode: "Ilkal", emailId: "bilagiur@yahoo.com", phoneNo: "9876543210", isImplemented: "Y" },
  { sr: 2, branchCode: "0200", ifscCode: "CHIK0000001", branchName: "Chikmagalur Branch", shortName: "Chikmagalur", address: "Mysore Road Complex", cityCode: "Chikmagalur", emailId: "chikmagalur@domain.com", phoneNo: "9876543211", isImplemented: "Y" },
  { sr: 3, branchCode: "0300", ifscCode: "DAVA0000001", branchName: "Davangere Branch", shortName: "Davangere", address: "Mohan Towers", cityCode: "Davangere", emailId: "davangere@domain.com", phoneNo: "9876543212", isImplemented: "Y" },
  { sr: 4, branchCode: "0400", ifscCode: "HAVE0000001", branchName: "Haveri Branch", shortName: "Haveri", address: "Mallikharjuna Complex", cityCode: "Haveri", emailId: "haveri@domain.com", phoneNo: "9876543213", isImplemented: "Y" },
  { sr: 5, branchCode: "0500", ifscCode: "BAGA0000001", branchName: "Bagalkot Branch", shortName: "Bagalkot", address: "Gadad Complex", cityCode: "Bagalkot", emailId: "bagalkot@domain.com", phoneNo: "9876543214", isImplemented: "Y" },
  { sr: 6, branchCode: "0600", ifscCode: "KOPP0000001", branchName: "Koppal Branch", shortName: "Koppal", address: "Ravi Towers", cityCode: "Koppal", emailId: "koppal@domain.com", phoneNo: "9876543215", isImplemented: "Y" },
  { sr: 7, branchCode: "0700", ifscCode: "BELA0000001", branchName: "Belagavi Branch", shortName: "Belagavi", address: "Shivaji Chowk", cityCode: "Belagavi", emailId: "belagavi@domain.com", phoneNo: "9876543216", isImplemented: "N" },
  { sr: 8, branchCode: "0800", ifscCode: "UDUP0000001", branchName: "Udupi Branch", shortName: "Udupi", address: "Karnataka Towers", cityCode: "Udupi", emailId: "udupi@domain.com", phoneNo: "9876543217", isImplemented: "N" },
  { sr: 9, branchCode: "0900", ifscCode: "KARW0000001", branchName: "Karwar Branch", shortName: "Karwar", address: "Navy Nagar Complex", cityCode: "Karwar", emailId: "karwar@domain.com", phoneNo: "9876543218", isImplemented: "N" },
  { sr: 10, branchCode: "1000", ifscCode: "RANE0000001", branchName: "Ranebennur Branch", shortName: "Ranebennur", address: "Market Yard", cityCode: "Ranebennur", emailId: "ranebennur@domain.com", phoneNo: "9876543219", isImplemented: "N" },
  { sr: 11, branchCode: "1100", ifscCode: "KOLA0000001", branchName: "Kolar Branch", shortName: "Kolar", address: "Kolar Gold Fields", cityCode: "Kolar", emailId: "kolar@domain.com", phoneNo: "9876543220", isImplemented: "N" },
  { sr: 12, branchCode: "1200", ifscCode: "SIRS0000001", branchName: "Sirsi Branch", shortName: "Sirsi", address: "Puttaraj Gali", cityCode: "Sirsi", emailId: "sirsi@domain.com", phoneNo: "9876543221", isImplemented: "N" },
  { sr: 13, branchCode: "1300", ifscCode: "SHIM0000001", branchName: "Shimoga Branch", shortName: "Shimoga", address: "Basappa Street", cityCode: "Shimoga", emailId: "shimoga@domain.com", phoneNo: "9876543222", isImplemented: "N" },
];

export function BranchMasterTable_rowToBranchFormData(row: BranchMasterTable_BranchRow): AddBranchModal_BranchFormData {
  return {
    ...AddBranchModal_emptyBranchFormData,
    branchCode: row.branchCode,
    branchName: row.branchName,
    shortName: row.shortName,
    address1: row.address,
    address2: row.address,
    address3: row.address,
    cityCode: row.cityCode,
    emailId: row.emailId,
    isImplemented: row.isImplemented === "Y" ? "Yes" : "No",
    phoneNumber1: row.phoneNo,
    phoneNumber2: row.phoneNo,
  };
}

interface BranchMasterTable_BadgeProps {
  value: "Y" | "N";
}

function BranchMasterTable_ImplementedBadge({ value }: BranchMasterTable_BadgeProps) {
  const isYes = value === "Y";
  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-0.5 text-xs font-medium ${
        isYes
          ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "border-red-200 bg-red-50 text-red-500 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {value}
    </span>
  );
}

interface BranchMasterTable_SortableHeaderProps {
  label: string;
  active: boolean;
  direction: BranchMasterTable_SortDirection | null;
}

function BranchMasterTable_SortableHeader({ label, active, direction }: BranchMasterTable_SortableHeaderProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      {active ? (
        direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
      )}
    </span>
  );
}

export interface BranchMasterTable_BranchActionHandlers {
  handleOpenEditViewParameter: (mode: ViewAndEditParameter_ParameterModalMode, row: BranchMasterTable_BranchRow) => void;
  onBranchNonCbsParameter?: (row: BranchMasterTable_BranchRow) => void;
  onBranchChequeBookLot?: (row: BranchMasterTable_BranchRow) => void;
  onBranchTdReceiptLot?: (row: BranchMasterTable_BranchRow) => void;
}

export interface BranchMasterTable_BranchMasterTableProps extends BranchMasterTable_BranchActionHandlers {
  rows?: BranchMasterTable_BranchRow[];
}

function BranchMasterTable({
  rows: initialRows = BranchMasterTable_DEFAULT_BRANCH_ROWS,
  handleOpenEditViewParameter,
  onBranchNonCbsParameter,
  onBranchChequeBookLot,
  onBranchTdReceiptLot,
}: BranchMasterTable_BranchMasterTableProps) {
  const { tRaw } = useBilingual();
  const [sortConfig, setSortConfig] = useState<BranchMasterTable_SortConfig | null>(null);
  const [openBranchArea, setOpenBranchArea] = useState(false);

  const handleSort = (col: BranchMasterTable_ColumnDef) => {
    if (!col.sortKey) return;
    const sortKey = col.sortKey;
    setSortConfig((prev) => {
      if (!prev || prev.key !== sortKey) return { key: sortKey, direction: "asc" };
      if (prev.direction === "asc") return { key: sortKey, direction: "desc" };
      return null;
    });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig) return initialRows;
    const { key, direction } = sortConfig;
    return [...initialRows].sort((a, b) => {
      const aVal = String(a[key] ?? "").toLowerCase();
      const bVal = String(b[key] ?? "").toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [initialRows, sortConfig]);

  return (
    <>
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">{tRaw("branchMaster.table.srNo")}</th>
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">{tRaw("common.actions")}</th>
              {BranchMasterTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                >
                  <BranchMasterTable_SortableHeader
                    label={tRaw(col.labelKey)}
                    active={sortConfig?.key === col.sortKey}
                    direction={sortConfig && sortConfig.key === col.sortKey ? sortConfig.direction : null}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={BranchMasterTable_columns.length + 2} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">
                  {tRaw("branchMaster.table.noRecordsFound")}
                </td>
              </tr>
            ) : (
              sortedRows.map((r) => (
                <tr key={r.sr} className="bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 align-middle">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 rounded-md text-primary-700 text-sm font-medium dark:bg-indigo-900/30">
                      {r.sr}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <RowActionMenu
                      menuWidth={224}
                      triggerClassName="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-400"
                      items={[
                        { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => handleOpenEditViewParameter("view", r) },
                        { key: "edit", label: "Edit", icon: Landmark, onClick: () => handleOpenEditViewParameter("edit", r) },
                        { key: "area", label: "Branch Area/Sub Area", icon: CreditCard, onClick: () => setOpenBranchArea(true) },
                      ]}
                    />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.branchCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.ifscCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.branchName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.shortName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.address}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.cityCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.emailId}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{r.phoneNo}</td>
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    <BranchMasterTable_ImplementedBadge value={r.isImplemented} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    {
      <BranchAreaSubAreaModal open={openBranchArea} onClose={()=>setOpenBranchArea(false)} />
    }
    </>
  );
}


/* ===== from BranchMasterPage.tsx ===== */

function mapBranchSummaryToRow(summary: BranchSummary, sr: number): BranchMasterTable_BranchRow {
  return {
    sr,
    branchCode: summary.branchCode,
    ifscCode: "",
    branchName: summary.name,
    shortName: "",
    address: "",
    cityCode: summary.cityCode,
    emailId: summary.emailId,
    phoneNo: "",
    isImplemented: "N",
  };
}

function mapBranchDetailToRow(detail: BranchDetail, sr: number): BranchMasterTable_BranchRow {
  return {
    sr,
    branchCode: detail.branchCode,
    ifscCode: detail.rtgsCode,
    branchName: detail.name,
    shortName: detail.nameShort,
    address: [detail.address1, detail.address2, detail.address3].filter(Boolean).join(", "),
    cityCode: detail.cityCode,
    emailId: detail.emailId,
    phoneNo: detail.phone1,
    isImplemented: detail.isImplemented === "Y" ? "Y" : "N",
  };
}

function mapBranchDetailToParameterFormData(detail: BranchDetail): ViewAndEditParameter_ParameterFormData {
  return {
    branchCode: detail.branchCode,
    branchName: detail.name,
    shortName: detail.nameShort,
    address1: detail.address1,
    address2: detail.address2,
    address3: detail.address3,
    zipCode: detail.zip,
    cityCode: detail.cityCode,
    state: "",
    country: "",
    emailId: detail.emailId,
    phoneNumber1: detail.phone1,
    phoneNumber2: detail.phone2,
    phoneNumber3: detail.phone3,
    isImplemented: detail.isImplemented === "Y" ? "Yes" : "No",
  };
}

/** Merges form edits back onto the original detail record — the server model has no state/country fields. */
function buildBranchDetailPayload(
  formData: ViewAndEditParameter_ParameterFormData,
  base: BranchDetail,
): BranchDetail {
  return {
    ...base,
    name: formData.branchName,
    nameShort: formData.shortName,
    address1: formData.address1,
    address2: formData.address2,
    address3: formData.address3,
    cityCode: formData.cityCode,
    zip: formData.zipCode,
    emailId: formData.emailId,
    phone1: formData.phoneNumber1,
    phone2: formData.phoneNumber2,
    phone3: formData.phoneNumber3,
    isImplemented: formData.isImplemented === "Yes" ? "Y" : "N",
  };
}

export default function BranchMasterPage() {
  const { t, en } = useBilingual();

  const breadcrumbs = [
    { label: en("common.home"), href: "/" },
    { label: en("common.misActivity"), href: "/" },
    { label: en("branchMaster.breadcrumb"), href: "#" },
  ];

  const FILTER_LABELS: Record<keyof FilterModal_BranchFilters, string> = {
    branchCode: en("branchMaster.filters.branchCode"),
    branchName: en("branchMaster.filters.branchName"),
    cityCode: en("branchMaster.filters.cityCode"),
    isImplemented: en("branchMaster.filters.isImplemented"),
  };

  const [rows, setRows] = useState<BranchMasterTable_BranchRow[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [viewRow, setViewRow] = useState<BranchMasterTable_BranchRow | null>(null);
  const [chequeBookLotRow, setChequeBookLotRow] = useState<BranchMasterTable_BranchRow | null>(
    null,
  );
  const [branchNonCbsRow, setBranchNonCbsRow] = useState<BranchMasterTable_BranchRow | null>(
    null,
  );
  const [tdReceiptLotRow, setTdReceiptLotRow] = useState<BranchMasterTable_BranchRow | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterModal_BranchFilters>(
    FilterModal_defaultBranchFilterValues,
  );

  const filteredRows = useMemo(() => {
    let result = rows;
    const activeEntries = Object.entries(filters).filter(([, v]) => v?.trim());
    if (activeEntries.length > 0) {
      result = result.filter((row) =>
        activeEntries.every(([key, value]) =>
          String(row[key as keyof BranchMasterTable_BranchRow] ?? "")
            .toLowerCase()
            .includes(value.toLowerCase()),
        ),
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    return result;
  }, [rows, filters, searchQuery]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v?.trim()).length,
    [filters],
  );

  const filterSummary = useMemo(() => {
    const entries = Object.entries(filters).filter(([, v]) => v?.trim()) as [
      keyof FilterModal_BranchFilters,
      string,
    ][];
    if (entries.length === 0) return "";
    const [firstKey, firstVal] = entries[0];
    const extra = entries.length > 1 ? ` +${entries.length - 1} more` : "";
    return `${FILTER_LABELS[firstKey]}:${firstVal}${extra}`;
  }, [filters, FILTER_LABELS]);

  const loadBranches = useCallback(async () => {
    setTableLoading(true);
    try {
      const summaries = await fetchBranches();
      setRows(summaries.map((s, idx) => mapBranchSummaryToRow(s, idx + 1)));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load branches.");
      setRows([]);
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const handleAddSave = useCallback((formData: AddBranchModal_BranchFormData) => {
    setRows((prev) => [
      ...prev,
      {
        sr: prev.length + 1,
        branchCode: formData.branchCode,
        ifscCode: "",
        branchName: formData.branchName,
        shortName: formData.shortName,
        address: [formData.address1, formData.address2, formData.address3]
          .filter(Boolean)
          .join(", "),
        cityCode: formData.cityCode,
        emailId: formData.emailId,
        phoneNo: formData.phoneNumber1,
        isImplemented: formData.isImplemented === "Yes" ? "Y" : "N",
      },
    ]);
    setShowAdd(false);
  }, []);

  const handleChequeBookLotSave = useCallback((data: BranchChequeBookLotModal_ChequeBookLotFormData) => {
    console.log("Branch Cheque Book Lot saved", data);
    setChequeBookLotRow(null);
  }, []);

  const handleBranchNonCbsSave = useCallback((data: BranchNonCBS_BranchNonCBSFormData) => {
    console.log("Branch Non CBS Parameter saved", data);
    setBranchNonCbsRow(null);
  }, []);

  const handleTdReceiptLotSave = useCallback((data: BranchTDReciptLot_TdReceiptLotFormData) => {
    console.log("Branch TD Receipt Lot saved", data);
    setTdReceiptLotRow(null);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ViewAndEditParameter_ParameterModalMode>("view");
  const [currentData, setCurrentData] = useState<ViewAndEditParameter_ParameterFormData>(
    ViewAndEditParameter_emptyParameterFormData,
  );
  const [currentBranchDetail, setCurrentBranchDetail] = useState<BranchDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleOpenEditViewParameter = async (
    mode: ViewAndEditParameter_ParameterModalMode,
    row: BranchMasterTable_BranchRow,
  ) => {
    setModalMode(mode);
    setDetailLoading(true);
    try {
      const detail = await fetchBranchByCode(row.branchCode);
      setCurrentBranchDetail(detail);
      setCurrentData(mapBranchDetailToParameterFormData(detail));
      setIsModalOpen(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load branch details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setCurrentBranchDetail(null);
  };

  const handleSave = async (data: ViewAndEditParameter_ParameterFormData) => {
    if (!currentBranchDetail) return;
    try {
      const updated = await updateBranch(buildBranchDetailPayload(data, currentBranchDetail));
      setCurrentBranchDetail(updated);
      setCurrentData(mapBranchDetailToParameterFormData(updated));
      setRows((prev) =>
        prev.map((r) => (r.branchCode === updated.branchCode ? mapBranchDetailToRow(updated, r.sr) : r)),
      );
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to update branch.");
      throw err;
    }
  };

  const handleValidate = (data: ViewAndEditParameter_ParameterFormData) => {
    console.log("Validated data:", data);
  };

  return (
    <div className="min-h-screen bg-[#E7EAEF] dark:bg-slate-950">
      <GlobalNav
        titleEn={en("branchMaster.title")}
        titleHi={t("branchMaster.title")}
        breadcrumbs={breadcrumbs}
        onBack={() => window.history.back()}
        showActions
        onAdd={() => setShowAdd(true)}
        onFilter={() => setShowFilter(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => {
          setFilters(FilterModal_defaultBranchFilterValues);
          setSearchQuery("");
          loadBranches();
        }}
        activeFilterCount={activeFilterCount}
        filterSummary={filterSummary}
      />
      <div className="p-4">
        {tableLoading && rows.length === 0 ? (
          <div className="flex w-full items-center justify-center rounded-xl bg-white py-16 text-sm text-gray-400 shadow-sm dark:bg-slate-900 dark:text-slate-500">
            Loading branches...
          </div>
        ) : (
        <BranchMasterTable
          rows={filteredRows}
          handleOpenEditViewParameter={handleOpenEditViewParameter}
          onBranchNonCbsParameter={setBranchNonCbsRow}
          onBranchChequeBookLot={setChequeBookLotRow}
          onBranchTdReceiptLot={setTdReceiptLotRow}
        />
        )}
      </div>
      {/* Add Branch Modal */}
      <AddParameterModal
        open={showAdd}
        initialData={AddBranchModal_emptyBranchFormData}
        onClose={() => setShowAdd(false)}
      />
      <ViewEditParameterModal
        open={isModalOpen}
        mode={modalMode}
        initialData={currentData}
        onClose={handleClose}
        onSave={handleSave}
        onValidate={handleValidate}
      />
      {/* View Branch Modal */}
      <AddBranchModal
        open={!!viewRow}
        mode="view"
        initialData={
          viewRow ? BranchMasterTable_rowToBranchFormData(viewRow) : AddBranchModal_emptyBranchFormData
        }
        onClose={() => setViewRow(null)}
      />
      {/* Branch Cheque Book Lot Modal */}
      <BranchChequeBookLotModal
        open={!!chequeBookLotRow}
        initialData={
          chequeBookLotRow
            ? BranchChequeBookLotModal_rowToChequeBookLotFormData(chequeBookLotRow)
            : undefined
        }
        onClose={() => setChequeBookLotRow(null)}
        onSave={handleChequeBookLotSave}
      />
      {/* Branch Non-CBS Modal */}
      <BranchNonCBS_BranchNonCBSModal
        open={!!branchNonCbsRow}
        initialData={
          branchNonCbsRow
            ? BranchNonCBS_rowToBranchNonCBSFormData(branchNonCbsRow)
            : BranchNonCBS_emptyBranchNonCBSFormData
        }
        onClose={() => setBranchNonCbsRow(null)}
        onSave={handleBranchNonCbsSave}
      />
      {/* Branch TD Receipt Lot Modal */}
      <BranchTDReciptLot_BranchTdReceiptLotModal
        open={!!tdReceiptLotRow}
        initialData={
          tdReceiptLotRow
            ? BranchTDReciptLot_rowToTdReceiptLotFormData(tdReceiptLotRow)
            : BranchTDReciptLot_emptyTdReceiptLotFormData
        }
        onClose={() => setTdReceiptLotRow(null)}
        onSave={handleTdReceiptLotSave}
      />
      {/* Filter Modal */}
      {showFilter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowFilter(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setShowFilter(false)}
              onApply={setFilters}
            />
          </div>
        </div>
      )}
      {errorMessage && (
        <SuccessModal
          variant="critical"
          title="Something Went Wrong"
          subtitle={errorMessage}
          onClose={() => setErrorMessage(null)}
          onDone={() => setErrorMessage(null)}
        />
      )}
      {detailLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
          <div className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-lg dark:bg-slate-900 dark:text-slate-200">
            Loading branch details...
          </div>
        </div>
      )}
    </div>
  );
}
