import { useState } from "react";
import type { ReactNode } from "react";
import { Controller, type Control, type FieldValues, type Path, useFormContext, FormProvider, useForm } from "react-hook-form";
import { FieldShell, TextInput, SelectInput, DateInput, SectionCard, RadioYesNo, DocumentRow } from "@/components/shared/FormFields";
import { CountryPicklistField } from "@/components/common";
import StatePicklistField from "@/components/common/StatePicklistField";
import { IMAGES } from "@/assets";
import { User, IdCard, Heart, Baby, Car, AlertTriangle, Flag, Home, Phone, Hash, Building2, MapPin, Coins, Calendar, IndianRupee, Eye, ShieldCheck, Mail, X, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "@/components/ui/Image";
import FilterModal, { type CustomerFilters, defaultValues } from "@/components/CustomerMaster/FilterModal";
import { useBilingual } from "@/i18n/useBilingual";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import StatusPill from "@/components/shared/StatusPill";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import { useRouter } from "@/lib/navigation";
import NavbarCA from "@/components/Authorization/NavbarCA";
import SuccessModal from "@/components/shared/SuccessModal";

/* ===== from formTypes.ts ===== */
export interface FormTypes_DocState {
  checked: boolean;
  expiryDate: string;
  documentNumber: string;
}

export interface FormTypes_CustomerAuthorizationFormValues {
  // Personal Details
  salutation: string;
  firstName: string;
  middleName: string;
  surname: string;
  fullName: string;
  gender: string;
  dob: string;
  regDate: string;
  motherName: string;
  fatherName: string;
  maritalStatus: string;
  noOfChildren: string;
  isMinor: boolean;
  guardianName: string;
  guardianRelation: string;

  // KYC & Compliance
  panNumber: string;
  aadhaarNumber: string;
  passportNumber: string;
  ckycNumber: string;
  gstinNumber: string;
  religionCode: string;
  casteCode: string;
  form60: boolean;
  form61: boolean;
  form15G: boolean;
  form15H: boolean;

  // Classification
  categoryCode: string;
  subCategoryCode: string;
  occupationCode: string;
  constitutionCode: string;
  customerGroupCode: string;
  memberType: string;
  vehicleOwned: string;
  riskCategory: string;

  // Current Address
  nationality: string;
  residenceType: string;
  residenceStatus: string;
  residencePhone: string;
  address1: string;
  address2: string;
  address3: string;
  zip: string;
  city: string;
  state: string;
  country: string;

  // Permanent Address
  sameAsCurrent: boolean;
  permanentAddress1: string;
  permanentAddress2: string;
  permanentAddress3: string;
  permanentZip: string;
  permanentCity: string;
  permanentState: string;
  permanentCountry: string;

  // Office Address
  sameAsResidential: boolean;
  officeAddress1: string;
  officeAddress2: string;
  officeAddress3: string;
  officeZip: string;
  officeCity: string;
  officeState: string;
  officeCountry: string;

  // KYC Documents
  idProof: Record<string, FormTypes_DocState>;
  addressProof: Record<string, FormTypes_DocState>;
  partnershipDocs: Record<string, FormTypes_DocState>;
  proprietaryDocs: Record<string, FormTypes_DocState>;
  businessConcern1Docs: Record<string, FormTypes_DocState>;
  businessConcern2Docs: Record<string, FormTypes_DocState>;

  // Profile Details
  purposeOfAccOpening: string;
  workingInstName: string;
  incomeSource: string;
  openingYearSelfBusi: string;
  fixedYearlyIncome: string;
  sixthMonthFixAmount: string;
}

// Options
export const FormTypes_SALUTATION_OPTIONS = ["MR", "MRS", "MS", "DR"] as const;
export const FormTypes_GENDER_OPTIONS = ["Male", "Female", "Other"] as const;
export const FormTypes_MARITAL_STATUS_OPTIONS = ["Single", "Married", "Divorced", "Widowed"] as const;
export const FormTypes_GUARDIAN_RELATIONS = ["Father", "Mother", "Uncle", "Aunt", "Other"] as const;
export const FormTypes_RESIDENCE_TYPE_OPTIONS = ["Apartment", "Independent House", "Row House", "Company Provided"] as const;
export const FormTypes_RESIDENCE_STATUS_OPTIONS = ["Owned", "Rented", "Parental", "Company Provided"] as const;
export const FormTypes_CITY_OPTIONS = ["Mumbai", "Pune", "Kolhapur", "Nagpur"] as const;
export const FormTypes_STATE_OPTIONS = ["Maharashtra", "Karnataka", "Goa"] as const;
export const FormTypes_VEHICLE_OPTIONS = ["Yes", "No"] as const;
export const FormTypes_RISK_CATEGORIES = ["Low", "Medium", "High"] as const;
export const FormTypes_CATEGORY_CODES = ["Public", "Private", "Staff"] as const;

// KYC Documents
export const FormTypes_ID_PROOF_DOCS = [
  { key: "passport", label: "Passport" },
  { key: "aadharCard", label: "Aadhar Card" },
  { key: "panCard", label: "Pan Card" },
  { key: "electionCard", label: "Election Card" },
  { key: "drivingLicense", label: "Driving License" },
  { key: "nregaJobCard", label: "NREGA Job Card" },
] as const;

export const FormTypes_ADDRESS_PROOF_DOCS = [
  { key: "telephoneBill", label: "Telephone Bill" },
  { key: "bankStatement", label: "Bank Statement" },
  { key: "govtDocuments", label: "Govt. Documents" },
  { key: "electricityBill", label: "Electricity Bill" },
  { key: "rationCard", label: "Ration Card" },
  { key: "passport", label: "Passport" },
] as const;

export const FormTypes_PARTNERSHIP_DOCS = [
  { key: "registrationCertificate", label: "Registration Certificate" },
  { key: "partnershipDeed", label: "Partnership Deed" },
  { key: "powerOfAttorney", label: "Power Of Attorney" },
  { key: "officiallyValidDocument", label: "Any Officially Valid Document" },
  { key: "telephoneBill", label: "Latest Telephone Bill In The Name Of Firm/Partners" },
] as const;

export const FormTypes_PROPRIETARY_DOCS = [
  { key: "rentAgreement", label: "Registered Rent Agreement Copy" },
  { key: "certificateLicense", label: "Certificate / License" },
  { key: "salesIncomeTaxReturns", label: "Sales And Income Tax Returns" },
  { key: "cstVatCertificate", label: "CST/VAT Certificate" },
  { key: "licenseIssued", label: "License Issued By The Registering Authority" },
] as const;

// Business Concern 1 - Company/Corporate Documents
export const FormTypes_BUSINESS_CONCERN_1_DOCS = [
  { key: "certificateOfIncorporation", label: "Certificate Of Incorporation" },
  { key: "resolutionOfBoard", label: "Resolution Of The Board Of Directors" },
  { key: "powerOfAttorneyManagers", label: "Power Of Attorney Granted To Its Managers" },
] as const;

// Business Concern 2 - Other Business Documents
export const FormTypes_BUSINESS_CONCERN_2_DOCS = [
  { key: "certificateOfRegistration", label: "Certificate Of Registration, If Registered" },
  { key: "trustDeed", label: "Trust Deed" },
  { key: "powerOfAttorneyTransact", label: "Power Of Attorney Granted To Transact Business On Its Behalf" },
  { key: "officiallyValidDocument", label: "Any Officially Valid Document To Identify The Trustees, Settlers, Beneficiaries" },
  { key: "resolutionOfManagingBody", label: "Resolution Of The Managing Body Of The Foundation / Association" },
  { key: "businessPanCard", label: "Business PAN Card" },
] as const;

// Helper functions
const FormTypes_MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "18-Aug-2001" -> "2001-08-18" (what a native <input type="date"> needs). Passes through anything else unchanged. */
function FormTypes_toISODate(value?: string): string {
  if (!value) return "";
  const match = value.match(/^(\d{1,2})-([A-Za-z]{3,})-(\d{4})$/);
  if (!match) return value;
  const day = match[1].padStart(2, "0");
  const monthIdx = FormTypes_MONTHS.indexOf(match[2].slice(0, 3).toLowerCase());
  if (monthIdx === -1) return value;
  const month = String(monthIdx + 1).padStart(2, "0");
  return `${match[3]}-${month}-${day}`;
}

const FormTypes_emptyDoc = (): FormTypes_DocState => ({ checked: false, expiryDate: "", documentNumber: "" });

const FormTypes_buildDocMap = (
  docs: readonly { key: string }[],
  filled: Record<string, Partial<FormTypes_DocState>> = {}
): Record<string, FormTypes_DocState> =>
  Object.fromEntries(docs.map((d) => [d.key, { ...FormTypes_emptyDoc(), ...filled[d.key] }]));

export function FormTypes_buildDefaultValues(row: CustomerAuthorizationTable_RowData): FormTypes_CustomerAuthorizationFormValues {
  const nameParts = row.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

  return {
    // Personal Details
    salutation: row.gender === "M" ? "MR" : "MRS",
    firstName,
    middleName,
    surname,
    fullName: row.name.toUpperCase(),
    gender: row.gender === "M" ? "Male" : row.gender === "F" ? "Female" : "Other",
    dob: FormTypes_toISODate(row.dob),
    regDate: FormTypes_toISODate(row.regDate),
    motherName: "",
    fatherName: "",
    maritalStatus: "Single",
    noOfChildren: "",
    isMinor: false,
    guardianName: "",
    guardianRelation: "",

    // KYC & Compliance
    panNumber: "",
    aadhaarNumber: "",
    passportNumber: "",
    ckycNumber: "",
    gstinNumber: "",
    religionCode: "",
    casteCode: "",
    form60: false,
    form61: false,
    form15G: false,
    form15H: false,

    // Classification
    categoryCode: row.categoryCode || "",
    subCategoryCode: "",
    occupationCode: "",
    constitutionCode: "",
    customerGroupCode: "",
    memberType: "",
    vehicleOwned: "",
    riskCategory: row.riskCategory || "",

    // Current Address
    nationality: "Indian",
    residenceType: "Apartment",
    residenceStatus: "Owned",
    residencePhone: row.phone || "",
    address1: "",
    address2: "",
    address3: "",
    zip: "",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",

    // Permanent Address
    sameAsCurrent: false,
    permanentAddress1: "",
    permanentAddress2: "",
    permanentAddress3: "",
    permanentZip: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",

    // Office Address
    sameAsResidential: false,
    officeAddress1: "",
    officeAddress2: "",
    officeAddress3: "",
    officeZip: "",
    officeCity: "",
    officeState: "",
    officeCountry: "",

    // KYC Documents
    idProof: FormTypes_buildDocMap(FormTypes_ID_PROOF_DOCS, {
      passport: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      aadharCard: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      panCard: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      electionCard: { checked: false, expiryDate: "", documentNumber: "" },
      drivingLicense: { checked: false, expiryDate: "", documentNumber: "" },
      nregaJobCard: { checked: false, expiryDate: "", documentNumber: "" },
    }),
    addressProof: FormTypes_buildDocMap(FormTypes_ADDRESS_PROOF_DOCS, {
      telephoneBill: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      bankStatement: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      govtDocuments: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      electricityBill: { checked: false, expiryDate: "", documentNumber: "" },
      rationCard: { checked: false, expiryDate: "", documentNumber: "" },
      passport: { checked: false, expiryDate: "", documentNumber: "" },
    }),
    partnershipDocs: FormTypes_buildDocMap(FormTypes_PARTNERSHIP_DOCS),
    proprietaryDocs: FormTypes_buildDocMap(FormTypes_PROPRIETARY_DOCS),
    businessConcern1Docs: FormTypes_buildDocMap(FormTypes_BUSINESS_CONCERN_1_DOCS),
    businessConcern2Docs: FormTypes_buildDocMap(FormTypes_BUSINESS_CONCERN_2_DOCS),

    // Profile Details
    purposeOfAccOpening: "Salary Credit & Savings",
    workingInstName: "IDSSPL",
    incomeSource: "Salary Income",
    openingYearSelfBusi: "",
    fixedYearlyIncome: "",
    sixthMonthFixAmount: "",
  };
}

/** Field names validated (via RHF trigger) before advancing past each step index. */
export const FormTypes_STEP_FIELD_NAMES: (keyof FormTypes_CustomerAuthorizationFormValues)[][] = [
  // Step 0: Customer Details
  [
    "salutation",
    "firstName",
    "middleName",
    "surname",
    "fullName",
    "gender",
    "dob",
    "regDate",
    "motherName",
    "fatherName",
    "maritalStatus",
    "noOfChildren",
    "isMinor",
    "guardianName",
    "guardianRelation",
    "panNumber",
    "aadhaarNumber",
    "passportNumber",
    "ckycNumber",
    "gstinNumber",
    "religionCode",
    "casteCode",
    "form60",
    "form61",
    "form15G",
    "form15H",
    "categoryCode",
    "subCategoryCode",
    "occupationCode",
    "constitutionCode",
    "customerGroupCode",
    "memberType",
    "vehicleOwned",
    "riskCategory",
  ],
  // Step 1: Address Details
  [
    "nationality",
    "residenceType",
    "residenceStatus",
    "residencePhone",
    "address1",
    "address2",
    "address3",
    "zip",
    "city",
    "state",
    "country",
    "sameAsCurrent",
    "permanentAddress1",
    "permanentAddress2",
    "permanentAddress3",
    "permanentZip",
    "permanentCity",
    "permanentState",
    "permanentCountry",
    "sameAsResidential",
    "officeAddress1",
    "officeAddress2",
    "officeAddress3",
    "officeZip",
    "officeCity",
    "officeState",
    "officeCountry",
  ],
  // Step 2: KYC
  [
    "idProof",
    "addressProof",
    "partnershipDocs",
    "proprietaryDocs",
    "businessConcern1Docs",
    "businessConcern2Docs",
  ],
  // Step 3: Profile Details
  [
    "purposeOfAccOpening",
    "workingInstName",
    "incomeSource",
    "openingYearSelfBusi",
    "fixedYearlyIncome",
    "sixthMonthFixAmount",
  ],
] as const;


/* ===== from ControlledField.tsx ===== */
interface ControlledField_ControlledFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  labelHi?: string;
  required?: boolean;
  icon?: ReactNode;
  placeholder?: string;
  options?: string[];
  kind?: "text" | "select" | "date" | "country" | "state";
}

function ControlledField<T extends FieldValues>({
  control,
  name,
  label,
  labelHi,
  required = true,
  icon,
  placeholder,
  options,
  kind = "text",
}: ControlledField_ControlledFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field, fieldState }) =>
        kind === "country" ? (
          <CountryPicklistField
            label={label}
            labelHi={labelHi}
            icon={icon}
            value={(field.value as string) ?? ""}
            onSelect={(country) => field.onChange(country.name)}
            required={required}
            error={fieldState.error ? "This field is required" : undefined}
          />
        ) : kind === "state" ? (
          <StatePicklistField
            label={label}
            labelHi={labelHi}
            icon={icon}
            value={(field.value as string) ?? ""}
            onSelect={(state) => field.onChange(state.stateName)}
            required={required}
            error={fieldState.error ? "This field is required" : undefined}
          />
        ) : (
        <FieldShell label={label} labelHi={labelHi} required={required} error={!!fieldState.error}>
          {kind === "select" ? (
            <SelectInput
              icon={icon}
              value={(field.value as string) ?? ""}
              onChange={field.onChange}
              options={options ?? []}
              placeholder={placeholder}
              error={!!fieldState.error}
            />
          ) : kind === "date" ? (
            <DateInput
              value={(field.value as string) ?? ""}
              onChange={field.onChange}
              placeholder={placeholder}
              error={!!fieldState.error}
            />
          ) : (
            <TextInput
              icon={icon}
              value={(field.value as string) ?? ""}
              onChange={field.onChange}
              placeholder={placeholder}
              error={!!fieldState.error}
            />
          )}
        </FieldShell>
        )
      }
    />
  );
}


/* ===== from Stepper.tsx ===== */
export interface Stepper_StepperStep {
  key: string;
  label: string;
}

interface Stepper_StepperProps {
  steps: Stepper_StepperStep[];
  activeIndex: number;
  maxVisitedIndex: number;
  onStepClick: (index: number) => void;
}

function Stepper({ steps, activeIndex, maxVisitedIndex, onStepClick }: Stepper_StepperProps) {
  return (
    <div className="flex items-center gap-8 border-b border-slate-200 bg-white">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isDisabled = index > maxVisitedIndex;

        return (
          <button
            key={step.key}
            type="button"
            disabled={false}
            aria-current={isActive ? "step" : undefined}
            onClick={() => !isDisabled && onStepClick(index)}
            className={`relative -mb-px pb-3 pt-2 text-[14px] font-medium transition ${
              isActive
                ? "text-primary"
                : isDisabled
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {step.label}
            {isActive &&
             <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-primary" />}
          </button>
        );
      })}
    </div>
  );
}


/* ===== from Step1CustomerDetails.tsx ===== */
const Step1CustomerDetails_SALUTATIONS = ["MR", "MRS", "MS", "DR"] as const;
const Step1CustomerDetails_GENDERS = ["Male", "Female", "Other"] as const;
const Step1CustomerDetails_MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed"] as const;
const Step1CustomerDetails_GUARDIAN_RELATIONS = ["Father", "Mother", "Uncle", "Aunt", "Other"] as const;
const Step1CustomerDetails_VEHICLE_OPTIONS = ["Yes", "No"] as const;
const Step1CustomerDetails_RISK_CATEGORIES = ["Low", "Medium", "High"] as const;
const Step1CustomerDetails_CATEGORY_CODES = ["Public", "Private", "Staff"] as const;

function Step1CustomerDetails() {
  const { control, setValue, watch } = useFormContext<FormTypes_CustomerAuthorizationFormValues>();
  const isMinor = watch("isMinor");

  return (
    <div className="space-y-4">
      <SectionCard
        titleEn="Personal Details"
        titleHi="वैयक्तिक तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={
          <Image
            src={IMAGES.USER}
            alt="User Icon"
            width={50}
            height={50}
          />
        }
      >
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ControlledField
            control={control}
            name="salutation"
            kind="select"
            label="Salutation Code"
            labelHi="संबोधन कोड"
            icon={<User size={16} />}
            options={[...Step1CustomerDetails_SALUTATIONS]}
            placeholder="Select Salutation Code"
            required
          />
          <ControlledField
            control={control}
            name="firstName"
            label="First Name"
            labelHi="पहिले नाव"
            icon={<User size={16} />}
            placeholder="Enter First Name"
            required
          />
          <ControlledField
            control={control}
            name="middleName"
            label="Middle Name"
            labelHi="मधले नाव"
            icon={<User size={16} />}
            placeholder="Enter Middle Name"
          />
          <ControlledField
            control={control}
            name="surname"
            label="Surname"
            labelHi="आडनाव"
            icon={<User size={16} />}
            placeholder="Enter Surname"
            required
          />
          <ControlledField
            control={control}
            name="fullName"
            label="Full Name"
            labelHi="पूर्ण नाव"
            icon={<User size={16} />}
            placeholder="Enter Full Name"
            required
          />
          <ControlledField
            control={control}
            name="gender"
            kind="select"
            label="Gender"
            labelHi="लिंग"
            icon={<User size={16} />}
            options={[...Step1CustomerDetails_GENDERS]}
            placeholder="Enter Gender"
            required
          />
          <ControlledField
            control={control}
            name="dob"
            label="Date of Birth"
            labelHi="जन्मतारीख"
            placeholder="YYYY-MM-DD"
            required
          />
          <ControlledField
            control={control}
            name="regDate"
            label="Registration Date"
            labelHi="नोंदणी दिनांक"
            placeholder="YYYY-MM-DD"
            required
          />
          <ControlledField
            control={control}
            name="motherName"
            label="Mother Name"
            labelHi="आईचे नाव"
            icon={<User size={16} />}
            placeholder="Enter Mother Name"
            required
          />
          <ControlledField
            control={control}
            name="fatherName"
            label="Father Name"
            labelHi="वडिलांचे नाव"
            icon={<User size={16} />}
            placeholder="Enter Father Name"
            required
          />
          <ControlledField
            control={control}
            name="maritalStatus"
            kind="select"
            label="Marital Status"
            labelHi="वैवाहिक स्थिती"
            icon={<Heart size={16} />}
            options={[...Step1CustomerDetails_MARITAL_STATUS]}
            placeholder="Select Marital Status"
            required
          />
          <ControlledField
            control={control}
            name="noOfChildren"
            label="No. of Children"
            labelHi="मुलांची संख्या"
            icon={<Baby size={16} />}
            placeholder="Enter Number of Children"
          />
          
          <div className="col-span-1">
            <RadioYesNo
              label="Is Minor"
              labelHi="अल्पवयीन आहे का"
              value={isMinor}
              onChange={(v) => {
                setValue("isMinor", v);
              }}
            />
          </div>
          
          {isMinor && (
            <>
              <ControlledField
                control={control}
                name="guardianName"
                label="Guardian Name"
                labelHi="पालकाचे नाव"
                icon={<User size={16} />}
                placeholder="Enter Guardian Name"
                required
              />
              <ControlledField
                control={control}
                name="guardianRelation"
                kind="select"
                label="Relation with Guardian"
                labelHi="पालकाशी नाते"
                icon={<User size={16} />}
                options={[...Step1CustomerDetails_GUARDIAN_RELATIONS]}
                placeholder="Select Relation with Guardian"
                required
              />
            </>
          )}
        </div>
      </SectionCard>

      <SectionCard
        titleEn="KYC & Compliance Details"
        titleHi="केवायसी व अनुपालन तपशील"
        subtitleEn="Manage customer's KYC and compliance information."
        subtitleHi="ग्राहकाची केवायसी व अनुपालन संबंधित माहिती व्यवस्थापित करा."
        icon={
          <Image
            src={IMAGES.ADDRESS}
            alt="Address Icon"
            width={50}
            height={50}
          />
        }
      >
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ControlledField
            control={control}
            name="panNumber"
            label="PAN Number"
            labelHi="PAN क्रमांक"
            icon={<IdCard size={16} />}
            placeholder="Enter PAN Number"
            required
          />
          <ControlledField
            control={control}
            name="aadhaarNumber"
            label="Aadhaar Number"
            labelHi="आधार क्रमांक"
            icon={<IdCard size={16} />}
            placeholder="Enter Aadhar Number"
            required
          />
          <ControlledField
            control={control}
            name="passportNumber"
            label="Passport Number"
            labelHi="पासपोर्ट क्रमांक"
            icon={<IdCard size={16} />}
            placeholder="Enter Passport Number"
          />
          <ControlledField
            control={control}
            name="ckycNumber"
            label="CKYC Number"
            labelHi="CKYC क्रमांक"
            icon={<IdCard size={16} />}
            placeholder="Enter CKYC Number"
          />
          <ControlledField
            control={control}
            name="gstinNumber"
            label="GSTIN Number"
            labelHi="GSTIN क्रमांक"
            icon={<IdCard size={16} />}
            placeholder="Enter GSTIN Number"
          />
          <ControlledField
            control={control}
            name="religionCode"
            label="Religion Code"
            labelHi="धर्म कोड"
            icon={<IdCard size={16} />}
            placeholder="Enter Religion Code"
          />
          <ControlledField
            control={control}
            name="casteCode"
            label="Caste Code"
            labelHi="जात कोड"
            icon={<IdCard size={16} />}
            placeholder="Enter Caste Code"
          />
        </div>
        
        {/* Radio buttons for Form 60, 61, 15G, 15H */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <RadioYesNo
            label="Form 60"
            labelHi="फॉर्म ६०"
            value={watch("form60")}
            onChange={(v) => setValue("form60", v)}
          />
          <RadioYesNo
            label="Form 61"
            labelHi="फॉर्म ६१"
            value={watch("form61")}
            onChange={(v) => setValue("form61", v)}
          />
          <RadioYesNo
            label="Form 15 G"
            labelHi="फॉर्म १५G"
            value={watch("form15G")}
            onChange={(v) => setValue("form15G", v)}
          />
          <RadioYesNo
            label="Form 15 H"
            labelHi="फॉर्म १५H"
            value={watch("form15H")}
            onChange={(v) => setValue("form15H", v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Customer Classification & Profile"
        titleHi="ग्राहक वर्गीकरण व प्रोफाइल"
        subtitleEn="Manage customer's classification and profile information."
        subtitleHi="ग्राहकाचे वर्गीकरण व प्रोफाइल संबंधित माहिती व्यवस्थापित करा."
        icon={
          <Image
            src={IMAGES.ADDRESS}
            alt="Address Icon"
            width={50}
            height={50}
          />
        }
      >
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ControlledField
            control={control}
            name="categoryCode"
            kind="select"
            label="Category Code"
            labelHi="वर्ग कोड"
            icon={<IdCard size={16} />}
            options={[...Step1CustomerDetails_CATEGORY_CODES]}
            placeholder="Enter Category Code"
            required
          />
          <ControlledField
            control={control}
            name="subCategoryCode"
            label="Sub Category Code"
            labelHi="उपवर्ग कोड"
            icon={<User size={16} />}
            placeholder="Enter Sub Category Code"
            required
          />
          <ControlledField
            control={control}
            name="occupationCode"
            label="Occupation Code"
            labelHi="व्यवसाय कोड"
            icon={<IdCard size={16} />}
            placeholder="Enter Occupation Code"
            required
          />
          <ControlledField
            control={control}
            name="constitutionCode"
            label="Constitution Code"
            labelHi="संविधान प्रकार"
            icon={<IdCard size={16} />}
            placeholder="Enter Constitution Code"
            required
          />
          <ControlledField
            control={control}
            name="customerGroupCode"
            label="Customer Group Code"
            labelHi="ग्राहक गट कोड"
            icon={<IdCard size={16} />}
            placeholder="Enter Customer Group Code"
            required
          />
          <ControlledField
            control={control}
            name="memberType"
            label="Member Type"
            labelHi="सदस्य प्रकार"
            icon={<User size={16} />}
            placeholder="Enter Member Type"
            required
          />
          <ControlledField
            control={control}
            name="vehicleOwned"
            kind="select"
            label="Vehicle Owned"
            labelHi="वाहन मालकी"
            icon={<Car size={16} />}
            options={[...Step1CustomerDetails_VEHICLE_OPTIONS]}
            placeholder="Select Vehicle Owned"
            required
          />
          <ControlledField
            control={control}
            name="riskCategory"
            kind="select"
            label="Risk Category"
            labelHi="जोखीम श्रेणी"
            icon={<AlertTriangle size={16} />}
            options={[...Step1CustomerDetails_RISK_CATEGORIES]}
            placeholder="Select Risk Category"
            required
          />
        </div>
      </SectionCard>
    </div>
  );
}


/* ===== from Step2AddressDetails.tsx ===== */
function Step2AddressDetails() {
  const { control, watch, setValue } = useFormContext<FormTypes_CustomerAuthorizationFormValues>();
  
  // Watch for toggle states (you'll need to add these to your form types)
  const sameAsCurrent = watch("sameAsCurrent");
  const sameAsResidential = watch("sameAsResidential");

  return (
    <div className="space-y-4">
      {/* Current Address Section */}
      <SectionCard
        titleEn="Current Address Details"
        titleHi="सध्याचा पत्ता तपशील"
        subtitleEn="Manage residential address information."
        subtitleHi="ग्राहकाच्या निवास पत्त्याची माहिती व्यवस्थापित करा."
        icon={
          <Image
            src={IMAGES.ADDRESS} 
            alt="Address Icon" 
            width={50} 
            height={50} 
          />
        }
      >
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ControlledField 
            control={control} 
            name="nationality" 
            label="Nationality" 
            labelHi="राष्ट्रीयत्व" 
            icon={<Flag size={16} />} 
            placeholder="Enter Nationality" 
          />
          <ControlledField
            control={control}
            name="residenceType"
            kind="select"
            label="Residence Type"
            labelHi="निवासाचा प्रकार"
            icon={<Home size={16} />}
            options={[...FormTypes_RESIDENCE_TYPE_OPTIONS]}
            placeholder="Select Residence Type"
          />
          <ControlledField
            control={control}
            name="residenceStatus"
            kind="select"
            label="Residence Status"
            labelHi="निवास स्थिती"
            icon={<Home size={16} />}
            options={[...FormTypes_RESIDENCE_STATUS_OPTIONS]}
            placeholder="Select Residence Status"
          />
          <ControlledField 
            control={control} 
            name="residencePhone" 
            label="Residence Phone" 
            labelHi="निवासस्थानी दूरध्वनी क्रमांक" 
            icon={<Phone size={16} />} 
            placeholder="Enter Residence Phone" 
          />
          <ControlledField 
            control={control} 
            name="address1" 
            label="Address 1" 
            labelHi="पत्ता १" 
            icon={<Home size={16} />} 
            placeholder="Enter Address 1" 
            required
          />
          <ControlledField 
            control={control} 
            name="address2" 
            label="Address 2" 
            labelHi="पत्ता २" 
            icon={<Home size={16} />} 
            placeholder="Enter Address 2" 
            required
          />
          <ControlledField 
            control={control} 
            name="address3" 
            label="Address 3" 
            labelHi="पत्ता ३" 
            icon={<Home size={16} />} 
            placeholder="Enter Address 3" 
            required
          />
          <ControlledField 
            control={control} 
            name="zip" 
            label="Zip" 
            labelHi="पिन कोड" 
            icon={<Hash size={16} />} 
            placeholder="Enter Pin Code" 
            required
          />
          <ControlledField
            control={control}
            name="city"
            kind="select"
            label="City"
            labelHi="शहर"
            icon={<Building2 size={16} />}
            options={[...FormTypes_CITY_OPTIONS]}
            placeholder="Select City"
            required
          />
          <ControlledField
            control={control}
            name="state"
            kind="state"
            label="State"
            labelHi="राज्य"
            icon={<Building2 size={16} />}
            placeholder="Select State"
            required
          />
          <ControlledField
            control={control}
            name="country"
            kind="country"
            label="Country"
            labelHi="देश"
            icon={<Flag size={16} />}
            placeholder="Select Country"
            required
          />
        </div>
      </SectionCard>

      {/* Permanent Address Section */}
      <SectionCard
        titleEn="Permanent Address Details"
        titleHi="कायमचा पत्ता तपशील"
        subtitleEn="Manage permanent address information."
        subtitleHi="ग्राहकाचा कायमचा पत्ता व्यवस्थापित करा."
        icon={
          <Image
            src={IMAGES.ADDRESS} 
            alt="Permanent Address Icon" 
            width={50} 
            height={50} 
          />
        }
      >
        <div className="mt-2">
          <RadioYesNo
            label="Is Permanent Address Same as Current Address"
            labelHi="सध्याचा पत्ता आणि कायमचा पत्ता समान आहे का"
            value={sameAsCurrent}
            onChange={(v) => setValue("sameAsCurrent", v)}
          />
          
          {!sameAsCurrent && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ControlledField 
                control={control} 
                name="permanentAddress1" 
                label="Address 1" 
                labelHi="पत्ता १" 
                icon={<Home size={16} />} 
                placeholder="Enter Address 1" 
                required
              />
              <ControlledField 
                control={control} 
                name="permanentAddress2" 
                label="Address 2" 
                labelHi="पत्ता २" 
                icon={<Home size={16} />} 
                placeholder="Enter Address 2" 
                required
              />
              <ControlledField 
                control={control} 
                name="permanentAddress3" 
                label="Address 3" 
                labelHi="पत्ता ३" 
                icon={<Home size={16} />} 
                placeholder="Enter Address 3" 
                required
              />
              <ControlledField 
                control={control} 
                name="permanentZip" 
                label="Zip" 
                labelHi="पिन कोड" 
                icon={<Hash size={16} />} 
                placeholder="Enter Pin Code" 
                required
              />
              <ControlledField
                control={control}
                name="permanentCity"
                kind="select"
                label="City"
                labelHi="शहर"
                icon={<Building2 size={16} />}
                options={[...FormTypes_CITY_OPTIONS]}
                placeholder="Select City"
                required
              />
              <ControlledField
                control={control}
                name="permanentState"
                kind="state"
                label="State"
                labelHi="राज्य"
                icon={<Building2 size={16} />}
                placeholder="Select State"
                required
              />
              <ControlledField
                control={control}
                name="permanentCountry"
                kind="country"
                label="Country"
                labelHi="देश"
                icon={<Flag size={16} />}
                placeholder="Select Country"
                required
              />
            </div>
          )}
        </div>
      </SectionCard>

      {/* Office Address Section */}
      <SectionCard
        titleEn="Office Address Details"
        titleHi="कार्यालयाचा पत्ता तपशील"
        subtitleEn="Enter the customer's office address and workplace contact information."
        subtitleHi="ग्राहकाचा कार्यालयीन पत्ता आणि कार्यस्थळ संपर्क माहिती भरा."
        icon={
          <Image
            src={IMAGES.ADDRESS} 
            alt="Office Address Icon" 
            width={50} 
            height={50} 
          />
        }
      >
        <div className="mt-2">
          <RadioYesNo
            label="Is Office Address Same as Residential Address"
            labelHi="कार्यालयाचा पत्ता आणि निवासी पत्ता समान आहे का"
            value={sameAsResidential}
            onChange={(v) => setValue("sameAsResidential", v)}
          />
          
          {!sameAsResidential && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ControlledField 
                control={control} 
                name="officeAddress1" 
                label="Address 1" 
                labelHi="पत्ता १" 
                icon={<MapPin size={16} />} 
                placeholder="Enter Address 1" 
                required
              />
              <ControlledField 
                control={control} 
                name="officeAddress2" 
                label="Address 2" 
                labelHi="पत्ता २" 
                icon={<MapPin size={16} />} 
                placeholder="Enter Address 2" 
                required
              />
              <ControlledField 
                control={control} 
                name="officeAddress3" 
                label="Address 3" 
                labelHi="पत्ता ३" 
                icon={<MapPin size={16} />} 
                placeholder="Enter Address 3" 
                required
              />
              <ControlledField 
                control={control} 
                name="officeZip" 
                label="Zip" 
                labelHi="पिन कोड" 
                icon={<Hash size={16} />} 
                placeholder="Enter Pin Code" 
                required
              />
              <ControlledField
                control={control}
                name="officeCity"
                kind="select"
                label="City"
                labelHi="शहर"
                icon={<Building2 size={16} />}
                options={[...FormTypes_CITY_OPTIONS]}
                placeholder="Select City"
                required
              />
              <ControlledField
                control={control}
                name="officeState"
                kind="state"
                label="State"
                labelHi="राज्य"
                icon={<Building2 size={16} />}
                placeholder="Select State"
                required
              />
              <ControlledField
                control={control}
                name="officeCountry"
                kind="country"
                label="Country"
                labelHi="देश"
                icon={<Flag size={16} />}
                placeholder="Select Country"
                required
              />
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}


/* ===== from Step3Kyc.tsx ===== */
function Step3Kyc() {
  const { watch, setValue } = useFormContext<FormTypes_CustomerAuthorizationFormValues>();
  const idProof = watch("idProof");
  const addressProof = watch("addressProof");
  const partnershipDocs = watch("partnershipDocs");
  const businessConcern1Docs = watch("businessConcern1Docs");
  const businessConcern2Docs = watch("businessConcern2Docs");
  const proprietaryDocs = watch("proprietaryDocs");

  const updateDoc = (
    section: "idProof" | "addressProof" | "partnershipDocs" | "businessConcern1Docs" | "businessConcern2Docs" | "proprietaryDocs",
    key: string,
    patch: Partial<FormTypes_DocState>
  ) => {
    let current;
    switch (section) {
      case "idProof":
        current = idProof[key];
        break;
      case "addressProof":
        current = addressProof[key];
        break;
      case "partnershipDocs":
        current = partnershipDocs[key];
        break;
      case "businessConcern1Docs":
        current = businessConcern1Docs[key];
        break;
      case "businessConcern2Docs":
        current = businessConcern2Docs[key];
        break;
      case "proprietaryDocs":
        current = proprietaryDocs[key];
        break;
    }
    (setValue as (name: string, value: FormTypes_DocState) => void)(`${section}.${key}`, { ...current, ...patch });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* ID Proof Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Savings Account (ID Proof)"
          titleHi="बचत खाते (ओळख पुरावा)"
          icon={
            <Image
              src={IMAGES.USER}
              alt="ID Proof Icon"
              width={50}
              height={50}
            />
          }
        >
          {FormTypes_ID_PROOF_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={idProof[doc.key]?.checked || false}
              expiryDate={idProof[doc.key]?.expiryDate || ""}
              documentNumber={idProof[doc.key]?.documentNumber || ""}
              onCheck={(v) => updateDoc("idProof", doc.key, { checked: v })}
              onExpiryChange={(v) => updateDoc("idProof", doc.key, { expiryDate: v })}
              onDocNumberChange={(v) => updateDoc("idProof", doc.key, { documentNumber: v })}
            />
          ))}
        </SectionCard>
      </div>

      {/* User Proof Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Savings Account (User Proof)"
          titleHi="बचत खाते (पत्ता पुरावा)"
          icon={
            <Image
              src={IMAGES.USER}
              alt="User Proof Icon"
              width={50}
              height={50}
            />
          }
        >
          {FormTypes_ADDRESS_PROOF_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={addressProof[doc.key]?.checked || false}
              expiryDate={addressProof[doc.key]?.expiryDate || ""}
              documentNumber={addressProof[doc.key]?.documentNumber || ""}
              onCheck={(v) => updateDoc("addressProof", doc.key, { checked: v })}
              onExpiryChange={(v) => updateDoc("addressProof", doc.key, { expiryDate: v })}
              onDocNumberChange={(v) => updateDoc("addressProof", doc.key, { documentNumber: v })}
            />
          ))}
        </SectionCard>
      </div>

      {/* Accounts of Proprietary Concern Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Accounts of Proprietary Concern"
          titleHi="मालकीच्या चिंतेची खाती"
          icon={
            <Image
              src={IMAGES.USER}
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {FormTypes_PROPRIETARY_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={proprietaryDocs[doc.key]?.checked || false}
              expiryDate={proprietaryDocs[doc.key]?.expiryDate || ""}
              documentNumber={proprietaryDocs[doc.key]?.documentNumber || ""}
              onCheck={(v) => updateDoc("proprietaryDocs", doc.key, { checked: v })}
              onExpiryChange={(v) => updateDoc("proprietaryDocs", doc.key, { expiryDate: v })}
              onDocNumberChange={(v) => updateDoc("proprietaryDocs", doc.key, { documentNumber: v })}
              showDocNumber={false}
            />
          ))}
        </SectionCard>
      </div>

      {/* Business Concern Section 1 - Company/Corporate Documents */}
      <div className="h-full">
        <SectionCard
          titleEn="Business Concern - Company/Corporate"
          titleHi="व्यवसाय चिंता - कंपनी/कॉर्पोरेट"
          icon={
            <Image
              src={IMAGES.USER}
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {/* Business Concern 1 Documents - Only Expiry Date */}
          {FormTypes_BUSINESS_CONCERN_1_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={false}
              expiryDate={businessConcern1Docs[doc.key]?.expiryDate || ""}
              documentNumber=""
              onCheck={() => {}}
              onExpiryChange={(v) => updateDoc("businessConcern1Docs", doc.key, { expiryDate: v })}
              onDocNumberChange={() => {}}
              showDocNumber={false}
              // showExpiryDate={}
              // showCheckbox={false}
            />
          ))}
        </SectionCard>
      </div>

      {/* Partnership Firms Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Partnership Firms"
          titleHi="भागीदारी फर्म"
          icon={
            <Image
              src={IMAGES.USER}
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {FormTypes_PARTNERSHIP_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={partnershipDocs[doc.key]?.checked || false}
              expiryDate={partnershipDocs[doc.key]?.expiryDate || ""}
              documentNumber={partnershipDocs[doc.key]?.documentNumber || ""}
              onCheck={(v) => updateDoc("partnershipDocs", doc.key, { checked: v })}
              onExpiryChange={(v) => updateDoc("partnershipDocs", doc.key, { expiryDate: v })}
              onDocNumberChange={(v) => updateDoc("partnershipDocs", doc.key, { documentNumber: v })}
              showDocNumber={false}
            />
          ))}
        </SectionCard>
      </div>

      {/* Business Concern Section 2 - Other Business Documents */}
      <div className="h-full">
        <SectionCard
          titleEn="Business Concern - Other Entities"
          titleHi="व्यवसाय चिंता - इतर संस्था"
          icon={
            <Image
              src={IMAGES.USER}
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {/* Business Concern 2 Documents - Only Expiry Date */}
          {FormTypes_BUSINESS_CONCERN_2_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={false}
              expiryDate={businessConcern2Docs[doc.key]?.expiryDate || ""}
              documentNumber=""
              onCheck={() => {}}
              onExpiryChange={(v) => updateDoc("businessConcern2Docs", doc.key, { expiryDate: v })}
              onDocNumberChange={() => {}}
              showDocNumber={false}
              // showExpiryDate={true}
              // showCheckbox={false}
            />
          ))}
        </SectionCard>
      </div>
    </div>
  );
}


/* ===== from Step4ProfileDetails.tsx ===== */
function Step4ProfileDetails() {
  const { control } = useFormContext<FormTypes_CustomerAuthorizationFormValues>();

  return (
    <SectionCard
      titleEn="Profile Details"
      titleHi="प्रोफाइल तपशील"
      subtitleEn="Enter the customer's occupation, income, and account profile information."
      subtitleHi="ग्राहकाची व्यवसाय, उत्पन्न आणि खाते प्रोफाइल संबंधित माहिती भरा."
       icon={
                    <Image
                      src={IMAGES.USER} 
                      alt="User Icon" 
                      width={50} 
                      height={50} 
                    />
                  }
          >
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ControlledField control={control} name="purposeOfAccOpening" label="Purpose Of Acc. Opening" labelHi="खाते उघडण्याचा उद्देश" icon={<Coins size={16} />} placeholder="Enter Purpose of Acc. Opening" />
        <ControlledField control={control} name="workingInstName" label="Name Of the Working Inst./Comp." labelHi="कार्यरत संस्था / कंपनीचे नाव" icon={<Building2 size={16} />} placeholder="Name Of the Working Inst./Comp." />
        <ControlledField control={control} name="incomeSource" label="Income Source" labelHi="उत्पन्नाचा स्रोत" icon={<User size={16} />} placeholder="Enter Income Source" />
        <ControlledField control={control} name="openingYearSelfBusi" label="Opening Year Of the Self Busi." labelHi="स्वयं व्यवसाय सुरू केल्याचे वर्ष" icon={<Calendar size={16} />} placeholder="Enter Opening Year Of the Self Busi." />
        <ControlledField control={control} name="fixedYearlyIncome" label="Fixed Yearly Income" labelHi="वार्षिक निश्चित उत्पन्न" icon={<IndianRupee size={16} />} placeholder="Enter Yearly Income" />
        <ControlledField control={control} name="sixthMonthFixAmount" label="6th month Fix Amount" labelHi="मागील ६ महिन्यांतील सरासरी शिल्लक रक्कम" icon={<IndianRupee size={16} />} placeholder="Enter 6th month Fix Amount" />
      </div>
    </SectionCard>
  );
}


/* ===== from CustomerAuthorizationTable.tsx ===== */
export type CustomerAuthorizationTable_AuthTab = "new" | "modify" | "rejected";

export type CustomerAuthorizationTable_RowData = {
  srNo: number;
  customerId: string;
  phone: string;
  email: string;
  status: string;
  name: string;
  gender: string;
  dob: string;
  regDate: string;
  categoryCode: string;
  riskCategory: string;
  tab: CustomerAuthorizationTable_AuthTab;
};

const CustomerAuthorizationTable_columns = [
  { key: "srNo", labelKey: "authorization.customerAuthorization.table.srNo", sortable: false, width: "80px" },
  { key: "action", labelKey: "authorization.customerAuthorization.table.action", sortable: false, width: "90px" },
  { key: "customerDetails", labelKey: "authorization.customerAuthorization.table.customerDetails", sortable: false, width: "260px" },
  { key: "status", labelKey: "authorization.customerAuthorization.table.status", sortable: true, width: "190px" },
  { key: "name", labelKey: "authorization.customerAuthorization.table.name", sortable: true, width: "200px" },
  { key: "gender", labelKey: "authorization.customerAuthorization.table.gender", sortable: true, width: "90px" },
  { key: "dob", labelKey: "authorization.customerAuthorization.table.dob", sortable: true, width: "150px" },
  { key: "regDate", labelKey: "authorization.customerAuthorization.table.regDate", sortable: true, width: "160px" },
  { key: "categoryCode", labelKey: "authorization.customerAuthorization.table.categoryCode", sortable: true, width: "140px" },
  { key: "riskCategory", labelKey: "authorization.customerAuthorization.table.riskCategory", sortable: true, width: "170px" },
] as const;

const CustomerAuthorizationTable_SAMPLE_CUSTOMERS: Omit<CustomerAuthorizationTable_RowData, "srNo" | "tab" | "status">[] = [
  { customerId: "1234567890", phone: "8989567890", email: "shivappa@gmail.com", name: "Jali Shivappa Telgi", gender: "M", dob: "18-Aug-2001", regDate: "25-Sep-2026", categoryCode: "Public", riskCategory: "Low" },
  { customerId: "0987654321", phone: "7896541230", email: "aditi@gmail.com", name: "Aditi Verma", gender: "F", dob: "15-Mar-1998", regDate: "10-Oct-2025", categoryCode: "Private", riskCategory: "Low" },
  { customerId: "5647382910", phone: "1234567891", email: "ravi@gmail.com", name: "Ravi Kumar", gender: "M", dob: "22-Jul-1995", regDate: "30-Dec-2023", categoryCode: "Public", riskCategory: "Medium" },
  { customerId: "9876543210", phone: "6543210987", email: "anita.singh@yahoo.com", name: "Anita Singh", gender: "F", dob: "05-May-1995", regDate: "12-Jan-2025", categoryCode: "Private", riskCategory: "Low" },
  { customerId: "2468013579", phone: "1357908642", email: "rohit.kumar@hotmail.com", name: "Rohit Kumar", gender: "M", dob: "22-Jun-1990", regDate: "30-Aug-2027", categoryCode: "Public", riskCategory: "High" },
];

const CustomerAuthorizationTable_TAB_STATUS_LABEL: Record<CustomerAuthorizationTable_AuthTab, string> = {
  new: "Authorization Pending",
  modify: "Modification Pending",
  rejected: "Authorization Rejected",
};

const CustomerAuthorizationTable_TAB_STATUS_TONE: Record<CustomerAuthorizationTable_AuthTab, "pending" | "rejected"> = {
  new: "pending",
  modify: "pending",
  rejected: "rejected",
};

const CustomerAuthorizationTable_buildRows = (tab: CustomerAuthorizationTable_AuthTab, count: number): CustomerAuthorizationTable_RowData[] =>
  Array.from({ length: count }, (_, i) => ({
    ...CustomerAuthorizationTable_SAMPLE_CUSTOMERS[i % CustomerAuthorizationTable_SAMPLE_CUSTOMERS.length],
    srNo: i + 1,
    tab,
    status: CustomerAuthorizationTable_TAB_STATUS_LABEL[tab],
  }));

export const CustomerAuthorizationTable_TAB_COUNTS: Record<CustomerAuthorizationTable_AuthTab, number> = {
  new: 10,
  modify: 6,
  rejected: 6,
};

const CustomerAuthorizationTable_rows: CustomerAuthorizationTable_RowData[] = [
  ...CustomerAuthorizationTable_buildRows("new", CustomerAuthorizationTable_TAB_COUNTS.new),
  ...CustomerAuthorizationTable_buildRows("modify", CustomerAuthorizationTable_TAB_COUNTS.modify),
  ...CustomerAuthorizationTable_buildRows("rejected", CustomerAuthorizationTable_TAB_COUNTS.rejected),
];

type CustomerAuthorizationTable_SortKey = keyof Omit<CustomerAuthorizationTable_RowData, "phone" | "email" | "tab">;

type CustomerAuthorizationTable_CustomerAuthorizationTableProps = {
  activeTab: CustomerAuthorizationTable_AuthTab;
  filters?: CustomerFilters;
  onView?: (row: CustomerAuthorizationTable_RowData) => void;
  onAuthorize?: (row: CustomerAuthorizationTable_RowData) => void;
};

const CustomerAuthorizationTable = ({ activeTab, filters, onView, onAuthorize }: CustomerAuthorizationTable_CustomerAuthorizationTableProps) => {
  const { tRaw } = useBilingual();
  const [sortKey, setSortKey] = useState<CustomerAuthorizationTable_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: CustomerAuthorizationTable_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = CustomerAuthorizationTable_rows.filter((r) => {
    if (r.tab !== activeTab) return false;
    if (!filters) return true;
    if (filters.customerName && !r.name.toLowerCase().includes(filters.customerName.toLowerCase())) return false;
    if (filters.customerId && !r.customerId.toLowerCase().includes(filters.customerId.toLowerCase())) return false;
    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const riskColor = (risk: string) => {
    if (risk === "High") return "text-red-600";
    if (risk === "Medium") return "text-primary";
    return "text-amber-700";
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-[1500px] table-fixed">
          <thead>
            <tr className="bg-primary">
              {CustomerAuthorizationTable_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as CustomerAuthorizationTable_SortKey)}
                  className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={{ width: col.width }}
                >
                  <SortableHeaderLabel label={tRaw(col.labelKey)} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr
                key={`${row.tab}-${row.srNo}`}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 relative`}
              >
                <td className="px-6 py-3" style={{ width: "80px" }}>
                  <SrNoBadge value={row.srNo} />
                </td>

                <td className="px-6 py-3 relative" style={{ width: "90px" }}>
                  <RowActionMenu
                    items={[
                      { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => onView?.(row) },
                      { key: "authorize", label: tRaw("authorization.customerAuthorization.table.menuAuthorize"), icon: ShieldCheck, onClick: () => onAuthorize?.(row) },
                    ]}
                  />
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700" style={{ width: "260px" }}>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900">{row.customerId}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                      <Phone size={13} className="text-gray-400" />
                      {row.phone}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                      <Mail size={13} className="text-gray-400" />
                      {row.email}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-3" style={{ width: "190px" }}>
                  <StatusPill label={row.status} tone={CustomerAuthorizationTable_TAB_STATUS_TONE[row.tab]} />
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "200px" }}>
                  {row.name}
                </td>

                <td className="px-6 py-3" style={{ width: "90px" }}>
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${
                      row.gender === "M" ? "bg-primary-50 text-primary" : "bg-pink-50 text-pink-600"
                    }`}
                  >
                    {row.gender}
                  </span>
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "150px" }}>
                  {row.dob}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "160px" }}>
                  {row.regDate}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "140px" }}>
                  {row.categoryCode}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "70px" }}>
                  <span className={`font-semibold ${riskColor(row.riskCategory)}`}>
                    {row.riskCategory}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const __default__ = CustomerAuthorizationTable;


/* ===== from CustomerAuthorizationModal.tsx ===== */
const CustomerAuthorizationModal_STEPS: Stepper_StepperStep[] = [
  { key: "customer", label: "Customer Details" },
  { key: "address", label: "Address Details" },
  { key: "kyc", label: "KYC" },
  { key: "profile", label: "Profile Details" },
];

interface CustomerAuthorizationModal_CustomerAuthorizationModalProps {
  row: CustomerAuthorizationTable_RowData;
  onClose: () => void;
  onAuthorized: (row: CustomerAuthorizationTable_RowData, values: FormTypes_CustomerAuthorizationFormValues) => void;
  onRejected: (row: CustomerAuthorizationTable_RowData) => void;
}

function CustomerAuthorizationModal_CustomerSummaryBar({ row }: { row: CustomerAuthorizationTable_RowData }) {
  const username = `${row.name.split(" ")[0]}@${row.customerId.slice(-5)}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-[#F8FAFC] px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-primary-50">
          <Image src={IMAGES.PROFILE} alt="Customer Profile" width={64} height={64} className="h-full w-full object-cover" />
        </div>
        <div>
          <h3 className="text-base font-bold text-primary-700">{row.name.toUpperCase()}</h3>
          <p className="mt-0.5 text-sm text-slate-600">
            Customer ID: <span className="font-semibold text-slate-700">{row.customerId}</span>
            <span className="ml-4">
              Username: <span className="font-semibold text-slate-700">{username}</span>
            </span>
          </p>
        </div>
      </div>

      <div className="flex h-16 w-40 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <Image src={IMAGES.SIGN} alt="Customer Signature" width={140} height={56} className="h-full w-full object-contain p-2" />
      </div>
    </div>
  );
}

function CustomerAuthorizationModal({ 
  row, 
  onClose, 
  onAuthorized, 
  onRejected 
}: CustomerAuthorizationModal_CustomerAuthorizationModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(0);

  const methods = useForm<FormTypes_CustomerAuthorizationFormValues>({
    defaultValues: FormTypes_buildDefaultValues(row),
    mode: "onChange",
  });
  const { trigger, handleSubmit } = methods;

  const isLastStep = stepIndex === CustomerAuthorizationModal_STEPS.length - 1;

  const goToStep = (index: number) => {
    if (index > maxVisitedIndex) return;
    setStepIndex(index);
  };

  const handleNext = async () => {
    // const fieldsToValidate = FormTypes_STEP_FIELD_NAMES[stepIndex];
    // const valid = fieldsToValidate.length === 0 ? true : await trigger(fieldsToValidate);
    // if (!valid || isLastStep) return;
    const next = stepIndex + 1;
    setStepIndex(next);
    setMaxVisitedIndex((prev) => Math.max(prev, next));
  };

  const handleAuthorize = handleSubmit((values) => {
    onAuthorized(row, values);
  });

  const handleReject = () => {
    if (window.confirm(`Are you sure you want to reject customer ${row.name}?`)) {
      onRejected(row);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-[95vw] max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-primary-50 text-primary">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-[20px] font-semibold leading-6 tracking-[0.0025em] text-slate-800">
                Authorize Customer
                <span className="text-slate-400"> / </span>
                <span className="text-[#64748B]">ग्राहकास मंजुरी द्या</span>
              </h2>
              <p className="mt-1 text-sm font-normal leading-5 tracking-[0.0025em] text-slate-500">
                Review and authorize customer information for processing. / ग्राहकाच्या माहितीचे पुनरावलोकन करून मंजुरी द्या.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Customer summary bar */}
        <div className="px-6 pt-5">
          <CustomerAuthorizationModal_CustomerSummaryBar row={row} />
        </div>

        {/* Stepper */}
        <div className="px-6 pt-4">
          <Stepper steps={CustomerAuthorizationModal_STEPS} activeIndex={stepIndex} maxVisitedIndex={maxVisitedIndex} onStepClick={goToStep} />
        </div>

        {/* Body */}
        <FormProvider {...methods}>
          <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
            {stepIndex === 0 && <Step1CustomerDetails />}
            {stepIndex === 1 && <Step2AddressDetails />}
            {stepIndex === 2 && <Step3Kyc />}
            {stepIndex === 3 && <Step4ProfileDetails />}
          </div>
        </FormProvider>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          {isLastStep && (
            <button
              type="button"
              onClick={handleReject}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-[14px] font-medium text-red-600 transition hover:bg-red-100"
            >
              Reject
              <ThumbsDown className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-5 py-2 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleAuthorize}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[14px] font-medium text-white transition hover:bg-primary-700"
            >
              Authorize
              <ThumbsUp className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[14px] font-medium text-white transition hover:bg-primary-700"
            >
              Next
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


/* ===== from AuthorizationCustomerPage.tsx ===== */
const AuthorizationCustomerPage = () => {
  const { t, en } = useBilingual();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<CustomerAuthorizationTable_AuthTab>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>(defaultValues);

  const [authRow, setAuthRow] = useState<CustomerAuthorizationTable_RowData | null>(null);
  const [resultModal, setResultModal] = useState<"authorized" | "rejected" | null>(null);

  const handleView = (row: CustomerAuthorizationTable_RowData) => {
    console.log("view", row);
  };

  const handleAuthorize = (row: CustomerAuthorizationTable_RowData) => {
    setAuthRow(row);
  };

  const handleAuthorized = () => {
    setAuthRow(null);
    setResultModal("authorized");
  };

  const handleRejected = () => {
    setAuthRow(null);
    setResultModal("rejected");
  };

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar">
      <NavbarCA
        titleEn={en("authorization.title")}
        titleHi={t("authorization.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("authorization.breadcrumb"), href: "/authorization" },
          { label: en("authorization.customerAuthorization.breadcrumb"), href: "#" },
        ]}
        onBack={() => router.back()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabCounts={CustomerAuthorizationTable_TAB_COUNTS}
        onOpenFilter={() => setIsFilterOpen(true)}
      />

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        <CustomerAuthorizationTable
          activeTab={activeTab}
          filters={filters}
          onView={handleView}
          onAuthorize={handleAuthorize}
        />
      </div>

      {authRow && (
        <CustomerAuthorizationModal
          row={authRow}
          onClose={() => setAuthRow(null)}
          onAuthorized={handleAuthorized}
          onRejected={handleRejected}
        />
      )}

      {resultModal === "authorized" && (
        <SuccessModal
          title="Customer Authorized Successfully"
          subtitle=""
          onClose={() => setResultModal(null)}
          onDone={() => setResultModal(null)}
          variant="success"
        />
      )}

      {resultModal === "rejected" && (
        <SuccessModal
          title="Customer Rejected Successfully"
          subtitle=""
          onClose={() => setResultModal(null)}
          onDone={() => setResultModal(null)}
          variant="critical"
        />
      )}
    </div>
  );
};

export default AuthorizationCustomerPage;
