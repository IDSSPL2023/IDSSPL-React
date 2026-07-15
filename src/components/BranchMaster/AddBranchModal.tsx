import React, { useEffect, useState } from "react";
import Image from "@/components/ui/Image";
import { X, Check, ChevronDown, ThumbsUp, UserRound, Landmark, Home, Building2, Flag, Mail, Phone, type LucideIcon } from "lucide-react";

export interface BranchFormData {
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

export const emptyBranchFormData: BranchFormData = {
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

const CITY_OPTIONS = ["Ilkal", "Chikmagalur", "Davangere", "Haveri", "Bagalkot", "Koppal", "Belagavi", "Udupi", "Karwar", "Ranebennur", "Kolar", "Sirsi", "Shimoga"];
const STATE_OPTIONS = ["Karnataka", "Maharashtra", "Gujarat", "Tamil Nadu", "Uttar Pradesh"];
const COUNTRY_OPTIONS = ["India"];

export type BranchModalMode = "add" | "view";

const MODE_META: Record<BranchModalMode, { titleEn: string; titleHi: string; subtitleEn: string; subtitleHi: string; useImage: boolean }> = {
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

type RequiredFieldKey = Exclude<keyof BranchFormData, "phoneNumber2" | "phoneNumber3" | "isImplemented">;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "branchCode", "branchName", "shortName",
  "address1", "address2", "address3",
  "zipCode", "cityCode", "state",
  "country", "emailId",
  "phoneNumber1",
];

interface TextFieldProps {
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

function TextField({ labelEn, labelHi, icon: Icon, placeholder, value, onChange, hasError, required = true, readOnly = false }: TextFieldProps) {
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

interface SelectFieldProps {
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

function SelectField({ labelEn, labelHi, icon: Icon, placeholder, value, options, onChange, hasError, readOnly = false }: SelectFieldProps) {
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

interface YesNoFieldProps {
  value: "Yes" | "No";
  onChange: (value: "Yes" | "No") => void;
  readOnly?: boolean;
}

function YesNoField({ value, onChange, readOnly = false }: YesNoFieldProps) {
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

export interface AddBranchModalProps {
  open: boolean;
  mode?: BranchModalMode;
  initialData?: BranchFormData;
  onClose?: () => void;
  onSave?: (data: BranchFormData) => void;
}

export default function AddBranchModal({ open, mode = "add", initialData = emptyBranchFormData, onClose, onSave }: AddBranchModalProps) {
  const [formData, setFormData] = useState<BranchFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<RequiredFieldKey, boolean>>>({});

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";
  const meta = MODE_META[mode];

  const handleChange = <K extends keyof BranchFormData>(key: K, value: BranchFormData[K]) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as RequiredFieldKey]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<RequiredFieldKey, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
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
              <Image src="/add-icn.png" alt="" width={50} height={50} />
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
            <TextField labelEn="Branch Code" labelHi="शाखा कोड" icon={Landmark} placeholder="Enter Branch Code" value={formData.branchCode} onChange={(v) => handleChange("branchCode", v)} hasError={errors.branchCode} readOnly={isView} />
            <TextField labelEn="Branch Name" labelHi="शाखेचे नाव" icon={Landmark} placeholder="Enter Branch Name" value={formData.branchName} onChange={(v) => handleChange("branchName", v)} hasError={errors.branchName} readOnly={isView} />
            <TextField labelEn="Short Name" labelHi="संक्षिप्त नाव" icon={Landmark} placeholder="Enter Branch Name" value={formData.shortName} onChange={(v) => handleChange("shortName", v)} hasError={errors.shortName} readOnly={isView} />

            <TextField labelEn="Address 1" labelHi="पत्ता १" icon={Home} placeholder="Enter Address 1" value={formData.address1} onChange={(v) => handleChange("address1", v)} hasError={errors.address1} readOnly={isView} />
            <TextField labelEn="Address 2" labelHi="पत्ता २" icon={Home} placeholder="Enter Address 2" value={formData.address2} onChange={(v) => handleChange("address2", v)} hasError={errors.address2} readOnly={isView} />
            <TextField labelEn="Address 3" labelHi="पत्ता ३" icon={Home} placeholder="Enter Address 3" value={formData.address3} onChange={(v) => handleChange("address3", v)} hasError={errors.address3} readOnly={isView} />

            <TextField labelEn="Zip Code" labelHi="झिप कोड" icon={Home} placeholder="Enter Zip Code" value={formData.zipCode} onChange={(v) => handleChange("zipCode", v)} hasError={errors.zipCode} readOnly={isView} />
            <SelectField labelEn="City Code" labelHi="शहर कोड" icon={Building2} placeholder="Select City Code" value={formData.cityCode} options={CITY_OPTIONS} onChange={(v) => handleChange("cityCode", v)} hasError={errors.cityCode} readOnly={isView} />
            <SelectField labelEn="State" labelHi="राज्य" icon={Building2} placeholder="Select State" value={formData.state} options={STATE_OPTIONS} onChange={(v) => handleChange("state", v)} hasError={errors.state} readOnly={isView} />

            <SelectField labelEn="Country" labelHi="देश" icon={Flag} placeholder="Select Country" value={formData.country} options={COUNTRY_OPTIONS} onChange={(v) => handleChange("country", v)} hasError={errors.country} readOnly={isView} />
            <TextField labelEn="Email ID" labelHi="ईमेल आयडी" icon={Mail} placeholder="Enter Email ID" value={formData.emailId} onChange={(v) => handleChange("emailId", v)} hasError={errors.emailId} readOnly={isView} />
            <YesNoField value={formData.isImplemented} onChange={(v) => handleChange("isImplemented", v)} readOnly={isView} />

            <TextField labelEn="Phone Number 1" labelHi="दूरध्वनी क्रमांक १" icon={Phone} placeholder="Enter Phone Number" value={formData.phoneNumber1} onChange={(v) => handleChange("phoneNumber1", v)} hasError={errors.phoneNumber1} readOnly={isView} />
            <TextField labelEn="Phone Number 2" labelHi="दूरध्वनी क्रमांक २" icon={Phone} placeholder="Enter Phone Number" value={formData.phoneNumber2} onChange={(v) => handleChange("phoneNumber2", v)} required={false} readOnly={isView} />
            <TextField labelEn="Phone Number 3" labelHi="दूरध्वनी क्रमांक ३" icon={Phone} placeholder="Enter Phone Number" value={formData.phoneNumber3} onChange={(v) => handleChange("phoneNumber3", v)} required={false} readOnly={isView} />
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
