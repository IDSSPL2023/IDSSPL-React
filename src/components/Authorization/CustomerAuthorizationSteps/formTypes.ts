// components/Authorization/CustomerAuthorizationSteps/formTypes.ts
import type { RowData } from "../CustomerAuthorizationTable";

export interface DocState {
  checked: boolean;
  expiryDate: string;
  documentNumber: string;
}

export interface CustomerAuthorizationFormValues {
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
  idProof: Record<string, DocState>;
  addressProof: Record<string, DocState>;
  partnershipDocs: Record<string, DocState>;
  proprietaryDocs: Record<string, DocState>;
  businessConcern1Docs: Record<string, DocState>;
  businessConcern2Docs: Record<string, DocState>;

  // Profile Details
  purposeOfAccOpening: string;
  workingInstName: string;
  incomeSource: string;
  openingYearSelfBusi: string;
  fixedYearlyIncome: string;
  sixthMonthFixAmount: string;
}

// Options
export const SALUTATION_OPTIONS = ["MR", "MRS", "MS", "DR"] as const;
export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;
export const MARITAL_STATUS_OPTIONS = ["Single", "Married", "Divorced", "Widowed"] as const;
export const GUARDIAN_RELATIONS = ["Father", "Mother", "Uncle", "Aunt", "Other"] as const;
export const RESIDENCE_TYPE_OPTIONS = ["Apartment", "Independent House", "Row House", "Company Provided"] as const;
export const RESIDENCE_STATUS_OPTIONS = ["Owned", "Rented", "Parental", "Company Provided"] as const;
export const CITY_OPTIONS = ["Mumbai", "Pune", "Kolhapur", "Nagpur"] as const;
export const STATE_OPTIONS = ["Maharashtra", "Karnataka", "Goa"] as const;
export const COUNTRY_OPTIONS = ["India"] as const;
export const VEHICLE_OPTIONS = ["Yes", "No"] as const;
export const RISK_CATEGORIES = ["Low", "Medium", "High"] as const;
export const CATEGORY_CODES = ["Public", "Private", "Staff"] as const;

// KYC Documents
export const ID_PROOF_DOCS = [
  { key: "passport", label: "Passport" },
  { key: "aadharCard", label: "Aadhar Card" },
  { key: "panCard", label: "Pan Card" },
  { key: "electionCard", label: "Election Card" },
  { key: "drivingLicense", label: "Driving License" },
  { key: "nregaJobCard", label: "NREGA Job Card" },
] as const;

export const ADDRESS_PROOF_DOCS = [
  { key: "telephoneBill", label: "Telephone Bill" },
  { key: "bankStatement", label: "Bank Statement" },
  { key: "govtDocuments", label: "Govt. Documents" },
  { key: "electricityBill", label: "Electricity Bill" },
  { key: "rationCard", label: "Ration Card" },
  { key: "passport", label: "Passport" },
] as const;

export const PARTNERSHIP_DOCS = [
  { key: "registrationCertificate", label: "Registration Certificate" },
  { key: "partnershipDeed", label: "Partnership Deed" },
  { key: "powerOfAttorney", label: "Power Of Attorney" },
  { key: "officiallyValidDocument", label: "Any Officially Valid Document" },
  { key: "telephoneBill", label: "Latest Telephone Bill In The Name Of Firm/Partners" },
] as const;

export const PROPRIETARY_DOCS = [
  { key: "rentAgreement", label: "Registered Rent Agreement Copy" },
  { key: "certificateLicense", label: "Certificate / License" },
  { key: "salesIncomeTaxReturns", label: "Sales And Income Tax Returns" },
  { key: "cstVatCertificate", label: "CST/VAT Certificate" },
  { key: "licenseIssued", label: "License Issued By The Registering Authority" },
] as const;

// Business Concern 1 - Company/Corporate Documents
export const BUSINESS_CONCERN_1_DOCS = [
  { key: "certificateOfIncorporation", label: "Certificate Of Incorporation" },
  { key: "resolutionOfBoard", label: "Resolution Of The Board Of Directors" },
  { key: "powerOfAttorneyManagers", label: "Power Of Attorney Granted To Its Managers" },
] as const;

// Business Concern 2 - Other Business Documents
export const BUSINESS_CONCERN_2_DOCS = [
  { key: "certificateOfRegistration", label: "Certificate Of Registration, If Registered" },
  { key: "trustDeed", label: "Trust Deed" },
  { key: "powerOfAttorneyTransact", label: "Power Of Attorney Granted To Transact Business On Its Behalf" },
  { key: "officiallyValidDocument", label: "Any Officially Valid Document To Identify The Trustees, Settlers, Beneficiaries" },
  { key: "resolutionOfManagingBody", label: "Resolution Of The Managing Body Of The Foundation / Association" },
  { key: "businessPanCard", label: "Business PAN Card" },
] as const;

// Helper functions
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "18-Aug-2001" -> "2001-08-18" (what a native <input type="date"> needs). Passes through anything else unchanged. */
function toISODate(value?: string): string {
  if (!value) return "";
  const match = value.match(/^(\d{1,2})-([A-Za-z]{3,})-(\d{4})$/);
  if (!match) return value;
  const day = match[1].padStart(2, "0");
  const monthIdx = MONTHS.indexOf(match[2].slice(0, 3).toLowerCase());
  if (monthIdx === -1) return value;
  const month = String(monthIdx + 1).padStart(2, "0");
  return `${match[3]}-${month}-${day}`;
}

const emptyDoc = (): DocState => ({ checked: false, expiryDate: "", documentNumber: "" });

const buildDocMap = (
  docs: readonly { key: string }[],
  filled: Record<string, Partial<DocState>> = {}
): Record<string, DocState> =>
  Object.fromEntries(docs.map((d) => [d.key, { ...emptyDoc(), ...filled[d.key] }]));

export function buildDefaultValues(row: RowData): CustomerAuthorizationFormValues {
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
    dob: toISODate(row.dob),
    regDate: toISODate(row.regDate),
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
    idProof: buildDocMap(ID_PROOF_DOCS, {
      passport: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      aadharCard: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      panCard: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      electionCard: { checked: false, expiryDate: "", documentNumber: "" },
      drivingLicense: { checked: false, expiryDate: "", documentNumber: "" },
      nregaJobCard: { checked: false, expiryDate: "", documentNumber: "" },
    }),
    addressProof: buildDocMap(ADDRESS_PROOF_DOCS, {
      telephoneBill: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      bankStatement: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      govtDocuments: { checked: true, expiryDate: "2035-11-12", documentNumber: "12345678901211" },
      electricityBill: { checked: false, expiryDate: "", documentNumber: "" },
      rationCard: { checked: false, expiryDate: "", documentNumber: "" },
      passport: { checked: false, expiryDate: "", documentNumber: "" },
    }),
    partnershipDocs: buildDocMap(PARTNERSHIP_DOCS),
    proprietaryDocs: buildDocMap(PROPRIETARY_DOCS),
    businessConcern1Docs: buildDocMap(BUSINESS_CONCERN_1_DOCS),
    businessConcern2Docs: buildDocMap(BUSINESS_CONCERN_2_DOCS),

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
export const STEP_FIELD_NAMES: (keyof CustomerAuthorizationFormValues)[][] = [
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