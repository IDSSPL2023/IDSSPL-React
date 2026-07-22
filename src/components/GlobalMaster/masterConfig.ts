import {
  IdCard, Shield, FileText, User, Building2, Phone, Home, Landmark, Flag, Calendar,
  Banknote, MapPin, Hash, Layers, type LucideIcon,
} from "lucide-react";
import { fetchCountries } from "@/lib/masterMaintenanceApi";

export type MasterItem = {
  icon: string;
  titleEn: string;
  titleHi: string;
  key: string;
};

export type FieldType = "text" | "radio" | "select";

export type MasterField = {
  key: string;
  labelEn: string;
  labelHi: string;
  placeholder: string;
  icon: string;
  type?: FieldType;
  options?: string[];
  readOnlyOnEdit?: boolean;
  /** When set, the field's dropdown fetches and populates `options` lazily on first focus. */
  loadOptions?: () => Promise<void>;
};

export type MasterColumn = {
  key: string;
  label: string;
  type?: "badge";
};

export type FilterField = {
  key: string;
  label: string;
};

export type MasterConfigEntry = {
  columns: MasterColumn[];
  rows: Record<string, string>[];
  formColumns?: number;
  fields: MasterField[];
  filterFields: FilterField[];
  hideActions?: boolean;
};

export const MASTERS: MasterItem[] = [
  { icon: "Settings", titleEn: "Operation Capacity Master", titleHi: "ऑपरेशन कॅपॅसिटी मास्टर", key: "operationCapacity" },
   {
    titleEn: 'Branch wise Next Interest Apply Date',
    titleHi: 'शाखानिहाय पुढील व्याज लागू होण्याची तारीख',
    key: 'branchInterest',
    icon: "Settings",
  },
  { icon: "GitBranch", titleEn: "Clearing Branch Master", titleHi: "क्लिअरिंग शाखा मास्टर", key: "clearingBranch" },
  { icon: "Layers", titleEn: "Category Master", titleHi: "श्रेणी मास्टर", key: "category" },
  { icon: "BookOpen", titleEn: "Constitution Master", titleHi: "संविधान मास्टर", key: "constitution" },
  { icon: "IdCard", titleEn: "Identity Proof Master", titleHi: "ओळख पुरावा मास्टर", key: "identityProof" },
  { icon: "Hash", titleEn: "Modify Shares Parameter", titleHi: "शेअर्स पॅरामीटर बदला", key: "modifyShares" },
  { icon: "Users", titleEn: "Relation Master", titleHi: "नातेसंबंध मास्टर", key: "relation" },
  { icon: "Home", titleEn: "Residence Status Master", titleHi: "निवास स्थिती मास्टर", key: "residenceStatus" },
  { icon: "FileText", titleEn: "Rule", titleHi: "नियम", key: "rule" },
  { icon: "Shield", titleEn: "Security Type Master", titleHi: "सुरक्षा प्रकार मास्टर", key: "securityType" },
  { icon: "Globe", titleEn: "Social Sector Master", titleHi: "सामाजिक क्षेत्र मास्टर", key: "socialSector" },
  { icon: "MapPin", titleEn: "State Master", titleHi: "राज्य मास्टर", key: "state" },
  { icon: "Shield", titleEn: "Address Proof Master", titleHi: "पत्ता पुराव्यांचे मुख्य रेकॉर्ड", key: "addressProof" },
  { icon: "Building2", titleEn: "Clearing Bank Master", titleHi: "क्लिअरिंग बँक मास्टर", key: "clearingBank" },
  { icon: "MapPin", titleEn: "City Master", titleHi: "शहर मास्टर", key: "city" },
  { icon: "Users", titleEn: "Customer Group Master", titleHi: "ग्राहक गट मास्टर", key: "customerGroup" },
  { icon: "Hash", titleEn: "Modify CBS Flag", titleHi: "CBS फ्लॅग बदला", key: "modifyCbsFlag" },
  { icon: "User", titleEn: "Occupation Master", titleHi: "व्यवसाय मास्टर", key: "occupation" },
  { icon: "BookOpen", titleEn: "Religion Cast Master", titleHi: "धर्म जात मास्टर", key: "religionCast" },
  { icon: "Home", titleEn: "Residence Type Master", titleHi: "निवास प्रकार मास्टर", key: "residenceType" },
  { icon: "User", titleEn: "Salutation Master", titleHi: "अभिवादन मास्टर", key: "salutation" },
  { icon: "Layers", titleEn: "Social Section Master", titleHi: "सामाजिक विभाग मास्टर", key: "socialSection" },
  { icon: "Globe", titleEn: "Social Sub Sector Master", titleHi: "सामाजिक उप-क्षेत्र मास्टर", key: "socialSubSector" },
  { icon: "Car", titleEn: "Vehicle Owned Master", titleHi: "वाहन मालकी मास्टर", key: "vehicleOwned" },
];

const FIELD_ICONS: Record<string, LucideIcon> = {
  id: IdCard,
  shield: Shield,
  text: FileText,
  user: User,
  building: Building2,
  phone: Phone,
  home: Home,
  landmark: Landmark,
  flag: Flag,
  calendar: Calendar,
  bank: Banknote,
  map: MapPin,
  hash: Hash,
  layers: Layers,
};

const yesNo = (v?: string) => v || "No";

const operationCapacityRows: Record<string, string>[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i + 1),
  capacityId: i === 0 ? "01" : String(100 + i * 15),
  description: "Self",
  hasNominee: "No",
  hasJointHolder: "No",
}));

const addressProofRows: Record<string, string>[] = [
  { id: "1", addressProofCode: "01", description: "Telephone Bill" },
  { id: "2", addressProofCode: "02", description: "Electricity Bill" },
  { id: "3", addressProofCode: "03", description: "Passport" },
  { id: "4", addressProofCode: "04", description: "Aadhaar Card" },
  { id: "5", addressProofCode: "05", description: "Driving License" },
  { id: "6", addressProofCode: "06", description: "Ration Card" },
  { id: "7", addressProofCode: "07", description: "Bank Statement" },
  { id: "8", addressProofCode: "08", description: "Voter ID" },
  { id: "9", addressProofCode: "09", description: "Gas Bill" },
  { id: "10", addressProofCode: "10", description: "Water Bill" },
  { id: "11", addressProofCode: "11", description: "Property Tax Receipt" },
  { id: "12", addressProofCode: "12", description: "Rent Agreement" },
  { id: "13", addressProofCode: "13", description: "Employer Letter" },
  { id: "14", addressProofCode: "14", description: "Other" },
];

const clearingBankRows: Record<string, string>[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i + 1),
  bankCode: `BK${String(i + 1).padStart(3, "0")}`,
  bankName: ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank"][i % 5],
  branchName: "Mumbai Main",
  ifscCode: `HDFC000${String(i + 1).padStart(4, "0")}`,
  city: "Mumbai",
  state: "Maharashtra",
  phone: `9876543${String(i).padStart(3, "0")}`,
  status: "Active",
}));

const cityRows: Record<string, string>[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i + 1),
  cityCode: String(i + 1).padStart(2, "0"),
  cityName: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"][i % 5],
  stateName: "Maharashtra",
  country: "India",
}));

const defaultRows = (prefix: string): Record<string, string>[] =>
  Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    code: String(i + 1).padStart(2, "0"),
    description: `${prefix} ${i + 1}`,
  }));

export const MASTER_CONFIG: Record<string, MasterConfigEntry> = {
  operationCapacity: {
    columns: [
      { key: "capacityId", label: "Account Operation Capacity ID" },
      { key: "description", label: "Description" },
      { key: "hasNominee", label: "Has Nominee", type: "badge" },
      { key: "hasJointHolder", label: "Has Joint Holder", type: "badge" },
    ],
    rows: operationCapacityRows,
    formColumns: 1,
    fields: [
      { key: "capacityId", labelEn: "Account Operation Capacity ID", labelHi: "खाते संचालन क्षमता आयडी", placeholder: "Enter Account Operation Capacity ID", icon: "shield", readOnlyOnEdit: true },
      { key: "description", labelEn: "Description", labelHi: "वर्णन", placeholder: "Enter Description", icon: "text" },
      { key: "hasNominee", labelEn: "Has Nominee", labelHi: "नामनिर्देशित व्यक्ती आहे", placeholder: "Select Has Nominee", type: "radio", options: ["Yes", "No"], icon: "user" },
      { key: "hasJointHolder", labelEn: "Has Joint Holder", labelHi: "सह-धारक आहे", placeholder: "Select Has Joint Holder", type: "radio", options: ["Yes", "No"], icon: "user" },
    ],
    filterFields: [
      { key: "capacityId", label: "Account Operation Capacity ID" },
      { key: "description", label: "Description" },
    ],
  },
  // Add this to the MASTER_CONFIG object
branchInterest: {
  columns: [
    { key: "srNo", label: "Sr No." },
    { key: "productCode", label: "Product Code" },
    { key: "description", label: "Description" },
    { key: "interestApplyDate", label: "Interest Apply Date" },
    { key: "interestFlag", label: "Interest Flag", type: "badge" },
  ],
  rows: [
    { id: "1", srNo: "1", productCode: "301", description: "Cash Credit Loan", interestApplyDate: "27/04/2026", interestFlag: "Y" },
    { id: "2", srNo: "2", productCode: "303", description: "Personal Loan", interestApplyDate: "20/07/2025", interestFlag: "Y" },
    { id: "3", srNo: "3", productCode: "306", description: "Education Loan", interestApplyDate: "10/10/2025", interestFlag: "Y" },
    { id: "4", srNo: "4", productCode: "305", description: "Gold Loan", interestApplyDate: "15/09/2025", interestFlag: "Y" },
    { id: "5", srNo: "5", productCode: "309", description: "Medical Loan", interestApplyDate: "15/01/2026", interestFlag: "Y" },
    { id: "6", srNo: "6", productCode: "307", description: "Business Loan", interestApplyDate: "25/11/2025", interestFlag: "Y" },
    { id: "7", srNo: "7", productCode: "304", description: "Vehicle Loan", interestApplyDate: "01/08/2025", interestFlag: "Y" },
    { id: "8", srNo: "8", productCode: "308", description: "Travel Loan", interestApplyDate: "05/12/2025", interestFlag: "Y" },
    { id: "9", srNo: "9", productCode: "310", description: "Wedding Loan", interestApplyDate: "01/02/2026", interestFlag: "Y" },
  ],
  formColumns: 2,
  fields: [
    { 
      key: "productCode", 
      labelEn: "Product Code", 
      labelHi: "उत्पादन कोड", 
      placeholder: "Enter Product Code (e.g., 301)", 
      icon: "hash", 
      readOnlyOnEdit: true 
    },
    { 
      key: "description", 
      labelEn: "Description", 
      labelHi: "वर्णन", 
      placeholder: "Enter Loan Description", 
      icon: "text" 
    },
    { 
      key: "interestApplyDate", 
      labelEn: "Interest Apply Date", 
      labelHi: "व्याज लागू तारीख", 
      placeholder: "DD/MM/YYYY", 
      icon: "calendar" 
    },
    { 
      key: "interestFlag", 
      labelEn: "Interest Flag", 
      labelHi: "व्याज फ्लॅग", 
      placeholder: "Select Flag", 
      icon: "flag",
      type: "select",
      options: ["Y", "N"]
    },
  ],
  filterFields: [
    { key: "productCode", label: "Product Code" },
    { key: "description", label: "Description" },
    { key: "interestApplyDate", label: "Interest Apply Date" },
    { key: "interestFlag", label: "Interest Flag" },
  ],
},
  addressProof: {
    columns: [
      { key: "addressProofCode", label: "Address Proof Code" },
      { key: "description", label: "Description" },
    ],
    rows: addressProofRows,
    formColumns: 1,
    fields: [
      { key: "addressProofCode", labelEn: "Address Proof Code", labelHi: "पत्ता पुराव्याचा कोड", placeholder: "Select Address Proof Code", icon: "shield", type: "select", options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"], readOnlyOnEdit: true },
      { key: "description", labelEn: "Description", labelHi: "वर्णन", placeholder: "Enter Description", icon: "text" },
    ],
    filterFields: [
      { key: "addressProofCode", label: "Address Proof Code" },
      { key: "description", label: "Description" },
    ],
  },
  clearingBank: {
    columns: [
      { key: "bankCode", label: "Bank Code" },
      { key: "bankName", label: "Bank Name" },
      { key: "branchName", label: "Branch Name" },
      { key: "ifscCode", label: "IFSC Code" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "phone", label: "Phone" },
      { key: "status", label: "Status", type: "badge" },
    ],
    rows: clearingBankRows,
    formColumns: 3,
    fields: [
      { key: "bankCode", labelEn: "Bank Code", labelHi: "बँक कोड", placeholder: "Select Branch Code", icon: "building", type: "select", options: ["BK001", "BK002", "BK003"], readOnlyOnEdit: true },
      { key: "bankName", labelEn: "Bank Name", labelHi: "बँकेचे नाव", placeholder: "Enter Bank Name", icon: "building" },
      { key: "shortBankName", labelEn: "Short Bank Name", labelHi: "बँकेचे संक्षिप्त नाव", placeholder: "Enter Short Bank Name", icon: "building" },
      { key: "rbiNumber", labelEn: "RBI Number", labelHi: "RBI क्रमांक", placeholder: "Enter RBI Number", icon: "hash" },
      { key: "customerId", labelEn: "Customer ID", labelHi: "ग्राहक क्रमांक", placeholder: "Select Customer ID", icon: "id", type: "select", options: ["C001", "C002", "C003"] },
      { key: "customerName", labelEn: "Customer Name", labelHi: "ग्राहकाचे नाव", placeholder: "Enter Customer Name", icon: "user" },
      { key: "branchCode", labelEn: "Branch Code", labelHi: "शाखा कोड", placeholder: "Select Branch Code", icon: "building", type: "select", options: ["BR001", "BR002"] },
      { key: "branchName", labelEn: "Branch Name", labelHi: "शाखेचे नाव", placeholder: "Enter Branch Name", icon: "building" },
      { key: "phone", labelEn: "Phone", labelHi: "फोन", placeholder: "Enter Phone Number", icon: "phone" },
      { key: "address1", labelEn: "Address 1", labelHi: "पत्ता १", placeholder: "Enter Address 1", icon: "home" },
      { key: "address2", labelEn: "Address 2", labelHi: "पत्ता २", placeholder: "Enter Address 2", icon: "home" },
      { key: "address3", labelEn: "Address 3", labelHi: "पत्ता ३", placeholder: "Enter Address 3", icon: "home" },
      { key: "zipCode", labelEn: "Zip Code", labelHi: "झिप कोड", placeholder: "Enter Zip Code", icon: "home" },
      { key: "city", labelEn: "City", labelHi: "शहर", placeholder: "Select City", icon: "landmark", type: "select", options: ["Mumbai", "Pune", "Nagpur"] },
      { key: "state", labelEn: "State", labelHi: "राज्य", placeholder: "Select State", icon: "landmark", type: "select", options: ["Maharashtra", "Karnataka", "Gujarat"] },
      { key: "country", labelEn: "Country", labelHi: "देश", placeholder: "Select Country", icon: "flag", type: "select", options: ["India"] },
      { key: "floatDays", labelEn: "Float Days", labelHi: "अतिरिक्त सुट्टीचे दिवस", placeholder: "Select Date", icon: "calendar", type: "text" },
      { key: "branchHoliday", labelEn: "Branch Holiday", labelHi: "शाखेची सुट्टी", placeholder: "Select Date", icon: "calendar", type: "text" },
    ],
    filterFields: [
      { key: "bankCode", label: "Bank Code" },
      { key: "bankName", label: "Bank Name" },
      { key: "city", label: "City" },
    ],
  },
  city: {
    columns: [
      { key: "cityCode", label: "City Code" },
      { key: "cityName", label: "City Name" },
      { key: "country", label: "Country" },
    ],
    rows: cityRows,
    formColumns: 1,
    fields: [
      { key: "cityName", labelEn: "City Name", labelHi: "शहराचे नाव", placeholder: "Enter City Name", icon: "landmark" },
      {
        key: "country", labelEn: "Country", labelHi: "देश", placeholder: "Select Country", icon: "flag", type: "select", options: ["India"],
        loadOptions: () => loadCountryOptions(),
      },
    ],
    filterFields: [
      { key: "cityCode", label: "City Code" },
      { key: "cityName", label: "City Name" },
    ],
    hideActions: true,
  },
  state: {
    columns: [
      { key: "stateCode", label: "State Code" },
      { key: "stateName", label: "State Name" },
      { key: "country", label: "Country" },
    ],
    rows: [
      { id: "1", stateCode: "MH", stateName: "Maharashtra", country: "India" },
      { id: "2", stateCode: "KA", stateName: "Karnataka", country: "India" },
      { id: "3", stateCode: "GJ", stateName: "Gujarat", country: "India" },
      { id: "4", stateCode: "TN", stateName: "Tamil Nadu", country: "India" },
      { id: "5", stateCode: "UP", stateName: "Uttar Pradesh", country: "India" },
    ],
    formColumns: 1,
    fields: [
      { key: "stateCode", labelEn: "State Code", labelHi: "राज्य कोड", placeholder: "Enter State Code", icon: "hash" },
      { key: "stateName", labelEn: "State Name", labelHi: "राज्याचे नाव", placeholder: "Enter State Name", icon: "landmark" },
      {
        key: "country", labelEn: "Country", labelHi: "देश", placeholder: "Select Country", icon: "flag", type: "select", options: ["India"],
        loadOptions: () => loadCountryOptions(),
      },
    ],
    filterFields: [
      { key: "stateCode", label: "State Code" },
      { key: "stateName", label: "State Name" },
    ],
    hideActions: true,
  },
};

/** Populated at runtime from the master-maintenance countries API; maps a displayed country name back to its code. */
export const countryCodeByName: Record<string, string> = {};

/** Shared across every master's Country dropdown (city, state, ...) so the lookup only needs wiring once per field. */
export const setCountryOptions = (countries: { code: string; name: string }[]): void => {
  Object.values(MASTER_CONFIG).forEach((entry) => {
    const field = entry.fields.find((f) => f.key === "country");
    if (field) field.options = countries.map((c) => c.name);
  });
  Object.keys(countryCodeByName).forEach((key) => delete countryCodeByName[key]);
  countries.forEach((c) => { countryCodeByName[c.name] = c.code; });
};

const loadCountryOptions = async (): Promise<void> => {
  const countries = await fetchCountries();
  setCountryOptions(countries);
};

const DEFAULT_CONFIG: MasterConfigEntry = {
  columns: [
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
  ],
  rows: defaultRows("Record"),
  formColumns: 1,
  fields: [
    { key: "code", labelEn: "Code", labelHi: "कोड", placeholder: "Enter Code", icon: "hash", readOnlyOnEdit: true },
    { key: "description", labelEn: "Description", labelHi: "वर्णन", placeholder: "Enter Description", icon: "text" },
  ],
  filterFields: [
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
  ],
};

export const getMasterConfig = (masterKey: string): MasterConfigEntry => {
  if (MASTER_CONFIG[masterKey]) return MASTER_CONFIG[masterKey];
  return { ...DEFAULT_CONFIG, rows: defaultRows(masterKey) };
};

export const getFieldIcon = (iconKey?: string): LucideIcon => (iconKey && FIELD_ICONS[iconKey]) || FileText;

export const rowToFormData = (masterKey: string, row?: Record<string, string>): Record<string, string> => {
  const config = getMasterConfig(masterKey);
  const data: Record<string, string> = {};
  config.fields.forEach((field) => {
    data[field.key] = row?.[field.key] ?? (field.type === "radio" ? "No" : "");
  });
  return data;
};

export const emptyFormData = (masterKey: string): Record<string, string> => {
  const config = getMasterConfig(masterKey);
  const data: Record<string, string> = {};
  config.fields.forEach((field) => {
    data[field.key] = field.type === "radio" ? "No" : "";
  });
  return data;
};

export const buildRowFromForm = (masterKey: string, formData: Record<string, string>): Record<string, string> => {
  const config = getMasterConfig(masterKey);
  const row: Record<string, string> = { ...formData };
  config.columns.forEach((col) => {
    if (row[col.key] === undefined) {
      row[col.key] = formData[col.key] ?? (col.type === "badge" ? "No" : "");
    }
  });
  if (masterKey === "clearingBank") {
    row.status = row.status || "Active";
    row.ifscCode = row.ifscCode || `BK${Date.now().toString().slice(-6)}`;
    row.branchName = row.branchName || formData.branchName || "Main Branch";
  }
  if (masterKey === "city") {
    row.cityCode = row.cityCode || String(Date.now()).slice(-4);
  }
  return row;
};

export { yesNo };
