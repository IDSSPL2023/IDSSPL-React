import { useState, type Dispatch, type SetStateAction } from "react";
import {
  User,
  IdCard,
  Baby,
  Heart,
  Car,
  AlertTriangle,
  Home,
  Phone,
  Flag,
  Building2,
  MapPin,
  Hash,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  SelectInput,
  DateInput,
  RadioYesNo,
  SectionCard,
  DocumentRow,
  UploadZone,
} from "@/components/shared/FormFields";

const TABS = [
  "Customer Details",
  "Address Details",
  "KYC",
  "Profile Details",
  "Capture Signature & Photo",
] as const;

type TabKey = (typeof TABS)[number];
type AddCMProps = {
  onClose?: () => void;
};

const SALUTATIONS = ["MR", "MRS", "MS", "DR"];
const GENDERS = ["Male", "Female", "Other"];
const MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed"];
const GUARDIAN_RELATIONS = ["Father", "Mother", "Uncle", "Aunt", "Other"];
const RESIDENCE_TYPES = ["Owned", "Rented", "Company Provided"];
const RESIDENCE_STATUS = ["Permanent", "Temporary"];
const CITIES = ["Kolhapur", "Mumbai", "Pune", "Nagpur"];
const STATES = ["Maharashtra", "Karnataka", "Goa"];
const COUNTRIES = ["India"];
const VEHICLE_OPTIONS = ["Yes", "No"];
const RISK_CATEGORIES = ["Low", "Medium", "High"];
const CATEGORY_CODES = ["Public", "Private", "Staff"];

const ID_PROOF_DOCS = [
  "Passport",
  "Aadhar Card",
  "Pan Card",
  "Election Card",
  "Driving License",
  "NREGA Job Card",
];

const ADDRESS_PROOF_DOCS = [
  "Telephone Bill",
  "Bank Statement",
  "Govt. Documents",
  "Electricity Bill",
  "Ration Card",
  "Passport",
];

const PARTNERSHIP_DOCS = [
  "Registration Certificate,",
  "Partnership Deed",
  "Power Of Attorney",
  "Any Officially Valid Document",
  "Latest Telephone Bill In The Name Of Firm/ Partners",
];

const BUSINESS_DOCS = [
  "Certificate Of Registration, If Registered",
  "Trust Deed",
  "Power Of Attorney Granted To Transact Business On Its Behalf",
  "Any Officially Valid Document To Identify The Trustees, Settlers, Beneficiaries",
  "Resolution Of The Managing Body Of The Foundation / Association",
  "Latest Telephone Bill",
];

type DocState = { checked: boolean; expiryDate: string; documentNumber: string };

const emptyDoc = (): DocState => ({ checked: false, expiryDate: "", documentNumber: "" });

const AddCM = ({ onClose = () => {} }: AddCMProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("Customer Details");

  const [personal, setPersonal] = useState({
    salutation: "",
    firstName: "",
    middleName: "",
    surname: "",
    fullName: "GAJANAN BAJRANG PATIL",
    gender: "",
    dob: "",
    regDate: "",
    motherName: "",
    fatherName: "",
    maritalStatus: "",
    noOfChildren: "",
    isMinor: true,
    guardianName: "",
    guardianRelation: "",
  });

  const [kycCompliance, setKycCompliance] = useState({
    panNumber: "",
    aadhaarNumber: "",
    passportNumber: "",
    ckycNumber: "",
    gstinNumber: "",
    religionCode: "",
    casteCode: "",
    form60: true,
    form61: true,
    form15G: true,
    form15H: true,
  });

  const [classification, setClassification] = useState({
    categoryCode: "",
    subCategoryCode: "",
    occupationCode: "",
    constitutionCode: "",
    customerGroupCode: "",
    memberType: "",
    vehicleOwned: "",
    riskCategory: "",
  });

  const [currentAddress, setCurrentAddress] = useState({
    nationality: "",
    residenceType: "",
    residenceStatus: "",
    residencePhone: "",
    address1: "",
    address2: "",
    address3: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  });

  const [permanentAddress, setPermanentAddress] = useState({
    sameAsCurrent: false,
    address1: "",
    address2: "",
    address3: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  });

  const [officeAddress, setOfficeAddress] = useState({
    sameAsResidential: false,
    address1: "",
    address2: "",
    address3: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  });

  const [idProofDocs, setIdProofDocs] = useState<Record<string, DocState>>(
    Object.fromEntries(ID_PROOF_DOCS.map((d) => [d, emptyDoc()]))
  );
  const [addressProofDocs, setAddressProofDocs] = useState<Record<string, DocState>>(
    Object.fromEntries(ADDRESS_PROOF_DOCS.map((d) => [d, emptyDoc()]))
  );
  const [partnershipDocs, setPartnershipDocs] = useState<Record<string, DocState>>(
    Object.fromEntries(PARTNERSHIP_DOCS.map((d) => [d, emptyDoc()]))
  );
  const [businessDocs, setBusinessDocs] = useState<Record<string, DocState>>(
    Object.fromEntries(BUSINESS_DOCS.map((d) => [d, emptyDoc()]))
  );

  const [profile, setProfile] = useState({
    purposeOfAccOpening: "",
    workingInstName: "",
    incomeSource: "",
    openingYearSelfBusi: "",
    fixedYearlyIncome: "",
    sixthMonthFixAmount: "",
    limitAmtTransaction: "",
  });

  const updateDoc = (
    setter: Dispatch<SetStateAction<Record<string, DocState>>>,
    key: string,
    patch: Partial<DocState>
  ) => setter((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const handleValidate = () => {
    window.alert(`${activeTab} tab validated successfully.`);
  };

  const handleNext = () => {
    const idx = TABS.indexOf(activeTab);
    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1]);
  };

  const handleSave = () => {
    window.alert("Customer saved successfully.");
    onClose();
  };

  const isLastTab = activeTab === TABS[TABS.length - 1];

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";
  const grid3 = "grid grid-cols-1 gap-4 md:grid-cols-3";

  return (
    <FormModal
      onClose={onClose}
      titleEn="Add Customer"
      titleHi="ग्राहक जोडा"
      subtitleEn="Add some basic information related to the Customer"
      subtitleHi="कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती जोडा"
      tabs={[...TABS]}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as TabKey)}
      onValidate={handleValidate}
      onNext={handleNext}
      onSave={handleSave}
      isLastTab={isLastTab}
    >
      {/* ── Customer Details ── */}
      {activeTab === "Customer Details" && (
        <>
          <SectionCard
            titleEn="Personal Details"
            titleHi="वैयक्तिक तपशील"
            subtitleEn="Manage customer's personal and identity information."
            subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
            icon={<User size={16} />}
          >
            <div className={`${grid4} mt-2`}>
              <FieldShell label="Salutation Code" labelHi="संबोधन कोड" required>
                <SelectInput
                  icon={<User size={16} />}
                  value={personal.salutation}
                  onChange={(v) => setPersonal((p) => ({ ...p, salutation: v }))}
                  options={SALUTATIONS}
                  placeholder="Select Salutation Code"
                />
              </FieldShell>
              <FieldShell label="First Name" labelHi="पहिले नाव" required>
                <TextInput
                  icon={<User size={16} />}
                  value={personal.firstName}
                  onChange={(v) => setPersonal((p) => ({ ...p, firstName: v }))}
                  placeholder="Enter First Name"
                />
              </FieldShell>
              <FieldShell label="Middle Name" labelHi="मधले नाव">
                <TextInput
                  icon={<User size={16} />}
                  value={personal.middleName}
                  onChange={(v) => setPersonal((p) => ({ ...p, middleName: v }))}
                  placeholder="Enter Middle Name"
                />
              </FieldShell>
              <FieldShell label="Surname" labelHi="आडनाव" required>
                <TextInput
                  icon={<User size={16} />}
                  value={personal.surname}
                  onChange={(v) => setPersonal((p) => ({ ...p, surname: v }))}
                  placeholder="Enter Surname"
                />
              </FieldShell>
              <FieldShell label="Full Name" labelHi="पूर्ण नाव" required>
                <TextInput
                  icon={<User size={16} />}
                  value={personal.fullName}
                  onChange={(v) => setPersonal((p) => ({ ...p, fullName: v }))}
                  placeholder="Enter Full Name"
                />
              </FieldShell>
              <FieldShell label="Gender" labelHi="लिंग" required>
                <SelectInput
                  icon={<User size={16} />}
                  value={personal.gender}
                  onChange={(v) => setPersonal((p) => ({ ...p, gender: v }))}
                  options={GENDERS}
                  placeholder="Enter Gender"
                />
              </FieldShell>
              <FieldShell label="Date of Birth" labelHi="जन्मतारीख" required>
                <DateInput
                  value={personal.dob}
                  onChange={(v) => setPersonal((p) => ({ ...p, dob: v }))}
                />
              </FieldShell>
              <FieldShell label="Registration Date" labelHi="नोंदणी तारीख" required>
                <DateInput
                  value={personal.regDate}
                  onChange={(v) => setPersonal((p) => ({ ...p, regDate: v }))}
                />
              </FieldShell>
              <FieldShell label="Mother Name" labelHi="आईचे नाव" required>
                <TextInput
                  icon={<User size={16} />}
                  value={personal.motherName}
                  onChange={(v) => setPersonal((p) => ({ ...p, motherName: v }))}
                  placeholder="Enter Mother Name"
                />
              </FieldShell>
              <FieldShell label="Father Name" labelHi="वडिलांचे नाव" required>
                <TextInput
                  icon={<User size={16} />}
                  value={personal.fatherName}
                  onChange={(v) => setPersonal((p) => ({ ...p, fatherName: v }))}
                  placeholder="Enter Father Name"
                />
              </FieldShell>
              <FieldShell label="Marital Status" labelHi="वैवाहिक स्थिती" required>
                <SelectInput
                  icon={<Heart size={16} />}
                  value={personal.maritalStatus}
                  onChange={(v) => setPersonal((p) => ({ ...p, maritalStatus: v }))}
                  options={MARITAL_STATUS}
                  placeholder="Select Marital Status"
                />
              </FieldShell>
              <FieldShell label="No. of Children" labelHi="मुलांची संख्या">
                <TextInput
                  icon={<Baby size={16} />}
                  value={personal.noOfChildren}
                  onChange={(v) => setPersonal((p) => ({ ...p, noOfChildren: v }))}
                  placeholder="Enter Number of Children"
                />
              </FieldShell>
              <RadioYesNo
                label="Is Minor"
                labelHi="अल्पवयीन आहे का"
                value={personal.isMinor}
                onChange={(v) => setPersonal((p) => ({ ...p, isMinor: v }))}
              />
              {personal.isMinor && (
                <>
                  <FieldShell label="Guardian Name" labelHi="पालकाचे नाव" required>
                    <TextInput
                      icon={<User size={16} />}
                      value={personal.guardianName}
                      onChange={(v) => setPersonal((p) => ({ ...p, guardianName: v }))}
                      placeholder="Enter Guardian Name"
                    />
                  </FieldShell>
                  <FieldShell label="Relation with Guardian" labelHi="पालकाशी नाते" required>
                    <SelectInput
                      icon={<User size={16} />}
                      value={personal.guardianRelation}
                      onChange={(v) => setPersonal((p) => ({ ...p, guardianRelation: v }))}
                      options={GUARDIAN_RELATIONS}
                      placeholder="Select Relation with Guardian"
                    />
                  </FieldShell>
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard
            titleEn="KYC & Compliance Details"
            titleHi="केवायसी व अनुपालन तपशील"
            subtitleEn="Manage customer's KYC and compliance information."
            subtitleHi="ग्राहकाची केवायसी व अनुपालन संबंधित माहिती व्यवस्थापित करा."
            icon={<IdCard size={16} />}
          >
            <div className={`${grid4} mt-2`}>
              {(
                [
                  ["panNumber", "PAN Number", "PAN क्रमांक", "Enter PAN Number"],
                  ["aadhaarNumber", "Aadhaar Number", "आधार क्रमांक", "Enter Aadhar Number"],
                  ["passportNumber", "Passport Number", "पासपोर्ट क्रमांक", "Enter Passport Number"],
                  ["ckycNumber", "CKYC Number", "CKYC क्रमांक", "Enter CKYC Number"],
                  ["gstinNumber", "GSTIN Number", "GSTIN क्रमांक", "Enter GSTIN Number"],
                  ["religionCode", "Religion Code", "धर्म कोड", "Enter Religion Code"],
                  ["casteCode", "Caste Code", "जात कोड", "Enter Caste Code"],
                ] as const
              ).map(([key, label, labelHi, placeholder]) => (
                <FieldShell key={key} label={label} labelHi={labelHi} required>
                  <TextInput
                    icon={<IdCard size={16} />}
                    value={kycCompliance[key]}
                    onChange={(v) => setKycCompliance((p) => ({ ...p, [key]: v }))}
                    placeholder={placeholder}
                  />
                </FieldShell>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["form60", "Form 60", "फॉर्म ६०"],
                  ["form61", "Form 61", "फॉर्म ६१"],
                  ["form15G", "Form 15 G", "फॉर्म १५G"],
                  ["form15H", "Form 15 H", "फॉर्म १५H"],
                ] as const
              ).map(([key, label, labelHi]) => (
                <RadioYesNo
                  key={key}
                  label={label}
                  labelHi={labelHi}
                  value={kycCompliance[key]}
                  onChange={(v) => setKycCompliance((p) => ({ ...p, [key]: v }))}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            titleEn="Customer Classification & Profile"
            titleHi="ग्राहक वर्गीकरण व प्रोफाइल"
            subtitleEn="Manage customer's classification and profile information."
            subtitleHi="ग्राहकाचे वर्गीकरण व प्रोफाइल संबंधित माहिती व्यवस्थापित करा."
            icon={<IdCard size={16} />}
          >
            <div className={`${grid4} mt-2`}>
              <FieldShell label="Category Code" labelHi="वर्ग कोड" required>
                <SelectInput
                  icon={<IdCard size={16} />}
                  value={classification.categoryCode}
                  onChange={(v) => setClassification((p) => ({ ...p, categoryCode: v }))}
                  options={CATEGORY_CODES}
                  placeholder="Enter Category Code"
                />
              </FieldShell>
              <FieldShell label="Sub Category Code" labelHi="उपवर्ग कोड" required>
                <TextInput
                  icon={<User size={16} />}
                  value={classification.subCategoryCode}
                  onChange={(v) => setClassification((p) => ({ ...p, subCategoryCode: v }))}
                  placeholder="Enter Sub Category Code"
                />
              </FieldShell>
              <FieldShell label="Occupation Code" labelHi="व्यवसाय कोड" required>
                <TextInput
                  icon={<IdCard size={16} />}
                  value={classification.occupationCode}
                  onChange={(v) => setClassification((p) => ({ ...p, occupationCode: v }))}
                  placeholder="Enter Occupation Code"
                />
              </FieldShell>
              <FieldShell label="Constitution Code" labelHi="संविधान प्रकार" required>
                <TextInput
                  icon={<IdCard size={16} />}
                  value={classification.constitutionCode}
                  onChange={(v) => setClassification((p) => ({ ...p, constitutionCode: v }))}
                  placeholder="Enter Constitution Code"
                />
              </FieldShell>
              <FieldShell label="Customer Group Code" labelHi="ग्राहक गट कोड" required>
                <TextInput
                  icon={<IdCard size={16} />}
                  value={classification.customerGroupCode}
                  onChange={(v) => setClassification((p) => ({ ...p, customerGroupCode: v }))}
                  placeholder="Enter Customer Group Code"
                />
              </FieldShell>
              <FieldShell label="Member Type" labelHi="सदस्य प्रकार" required>
                <TextInput
                  icon={<User size={16} />}
                  value={classification.memberType}
                  onChange={(v) => setClassification((p) => ({ ...p, memberType: v }))}
                  placeholder="Enter Member Type"
                />
              </FieldShell>
              <FieldShell label="Vehicle Owned" labelHi="वाहन मालकी" required>
                <SelectInput
                  icon={<Car size={16} />}
                  value={classification.vehicleOwned}
                  onChange={(v) => setClassification((p) => ({ ...p, vehicleOwned: v }))}
                  options={VEHICLE_OPTIONS}
                  placeholder="Select Vehicle Owned"
                />
              </FieldShell>
              <FieldShell label="Risk Category" labelHi="जोखीम श्रेणी" required>
                <SelectInput
                  icon={<AlertTriangle size={16} />}
                  value={classification.riskCategory}
                  onChange={(v) => setClassification((p) => ({ ...p, riskCategory: v }))}
                  options={RISK_CATEGORIES}
                  placeholder="Select Risk Category"
                />
              </FieldShell>
            </div>
          </SectionCard>
        </>
      )}

      {/* ── Address Details ── */}
      {activeTab === "Address Details" && (
        <>
          <SectionCard
            titleEn="Current Address Details"
            titleHi="वैयक्तिक तपशील"
            subtitleEn="Manage residential address information."
            subtitleHi="ग्राहकाचा राहण्याचा पत्ता व्यवस्थापित करा."
            icon={<Home size={16} />}
          >
            <div className={`${grid4} mt-2`}>
              <FieldShell label="Nationality" labelHi="राष्ट्रीयत्व" required>
                <TextInput icon={<Flag size={16} />} value={currentAddress.nationality} onChange={(v) => setCurrentAddress((p) => ({ ...p, nationality: v }))} placeholder="Enter Nationality" />
              </FieldShell>
              <FieldShell label="Residence Type" labelHi="निवास प्रकार" required>
                <SelectInput icon={<Home size={16} />} value={currentAddress.residenceType} onChange={(v) => setCurrentAddress((p) => ({ ...p, residenceType: v }))} options={RESIDENCE_TYPES} placeholder="Select Residence Type" />
              </FieldShell>
              <FieldShell label="Residence Status" labelHi="निवास स्थिती" required>
                <SelectInput icon={<Home size={16} />} value={currentAddress.residenceStatus} onChange={(v) => setCurrentAddress((p) => ({ ...p, residenceStatus: v }))} options={RESIDENCE_STATUS} placeholder="Select Residence Status" />
              </FieldShell>
              <FieldShell label="Residence Phone" labelHi="निवास फोन" required>
                <TextInput icon={<Phone size={16} />} value={currentAddress.residencePhone} onChange={(v) => setCurrentAddress((p) => ({ ...p, residencePhone: v }))} placeholder="Enter Residence Phone" />
              </FieldShell>
              {(["address1", "address2", "address3"] as const).map((key, i) => (
                <FieldShell key={key} label={`Address ${i + 1}`} labelHi={`पत्ता ${i + 1}`} required={i < 2}>
                  <TextInput icon={<Home size={16} />} value={currentAddress[key]} onChange={(v) => setCurrentAddress((p) => ({ ...p, [key]: v }))} placeholder={`Enter Address ${i + 1}`} />
                </FieldShell>
              ))}
              <FieldShell label="Zip" labelHi="पिन कोड" required>
                <TextInput icon={<Hash size={16} />} value={currentAddress.zip} onChange={(v) => setCurrentAddress((p) => ({ ...p, zip: v }))} placeholder="Enter Pin Code" />
              </FieldShell>
              <FieldShell label="City" labelHi="शहरे" required>
                <SelectInput icon={<Building2 size={16} />} value={currentAddress.city} onChange={(v) => setCurrentAddress((p) => ({ ...p, city: v }))} options={CITIES} placeholder="Select City" />
              </FieldShell>
              <FieldShell label="State" labelHi="राज्य" required>
                <SelectInput icon={<Building2 size={16} />} value={currentAddress.state} onChange={(v) => setCurrentAddress((p) => ({ ...p, state: v }))} options={STATES} placeholder="Select State" />
              </FieldShell>
              <FieldShell label="Country" labelHi="देश" required>
                <SelectInput icon={<Flag size={16} />} value={currentAddress.country} onChange={(v) => setCurrentAddress((p) => ({ ...p, country: v }))} options={COUNTRIES} placeholder="Select Country" />
              </FieldShell>
            </div>
          </SectionCard>

          <SectionCard
            titleEn="Permanent Address Details"
            titleHi="कायमचा पत्ता तपशील"
            subtitleEn="Manage permanent address information."
            subtitleHi="ग्राहकाचा कायमचा पत्ता व्यवस्थापित करा."
            icon={<Home size={16} />}
          >
            <RadioYesNo
              label="Is Permanent Address Same as Current Address"
              labelHi="सध्याचा पत्ता आणि कायमचा पत्ता समान आहे का"
              value={permanentAddress.sameAsCurrent}
              onChange={(v) => setPermanentAddress((p) => ({ ...p, sameAsCurrent: v }))}
            />
            {!permanentAddress.sameAsCurrent && (
              <div className={`${grid4} mt-4`}>
                {(["address1", "address2", "address3"] as const).map((key, i) => (
                  <FieldShell key={key} label={`Address ${i + 1}`} labelHi={`पत्ता ${i + 1}`} required={i < 2}>
                    <TextInput icon={<Home size={16} />} value={permanentAddress[key]} onChange={(v) => setPermanentAddress((p) => ({ ...p, [key]: v }))} placeholder={`Enter Address ${i + 1}`} />
                  </FieldShell>
                ))}
                <FieldShell label="Zip" labelHi="पिन कोड" required>
                  <TextInput icon={<Hash size={16} />} value={permanentAddress.zip} onChange={(v) => setPermanentAddress((p) => ({ ...p, zip: v }))} placeholder="Enter Pin Code" />
                </FieldShell>
                <FieldShell label="City" labelHi="शहरे" required>
                  <SelectInput icon={<Building2 size={16} />} value={permanentAddress.city} onChange={(v) => setPermanentAddress((p) => ({ ...p, city: v }))} options={CITIES} placeholder="Select City" />
                </FieldShell>
                <FieldShell label="State" labelHi="राज्य" required>
                  <SelectInput icon={<Building2 size={16} />} value={permanentAddress.state} onChange={(v) => setPermanentAddress((p) => ({ ...p, state: v }))} options={STATES} placeholder="Select State" />
                </FieldShell>
                <FieldShell label="Country" labelHi="देश" required>
                  <SelectInput icon={<Flag size={16} />} value={permanentAddress.country} onChange={(v) => setPermanentAddress((p) => ({ ...p, country: v }))} options={COUNTRIES} placeholder="Select Country" />
                </FieldShell>
              </div>
            )}
          </SectionCard>

          <SectionCard
            titleEn="Office Address Details"
            titleHi="कार्यालयाचा पत्ता तपशील"
            subtitleEn="Manage office address information."
            subtitleHi="ग्राहकाचा कार्यालयाचा पत्ता व्यवस्थापित करा."
            icon={<MapPin size={16} />}
          >
            <RadioYesNo
              label="Is Office Address Same as Residential Address"
              labelHi="कार्यालयाचा पत्ता आणि राहण्याचा पत्ता समान आहे का"
              value={officeAddress.sameAsResidential}
              onChange={(v) => setOfficeAddress((p) => ({ ...p, sameAsResidential: v }))}
            />
            {!officeAddress.sameAsResidential && (
              <div className={`${grid4} mt-4`}>
                {(["address1", "address2", "address3"] as const).map((key, i) => (
                  <FieldShell key={key} label={`Address ${i + 1}`} labelHi={`पत्ता ${i + 1}`} required={i < 2}>
                    <TextInput icon={<Home size={16} />} value={officeAddress[key]} onChange={(v) => setOfficeAddress((p) => ({ ...p, [key]: v }))} placeholder={`Enter Address ${i + 1}`} />
                  </FieldShell>
                ))}
                <FieldShell label="Zip" labelHi="पिन कोड" required>
                  <TextInput icon={<Hash size={16} />} value={officeAddress.zip} onChange={(v) => setOfficeAddress((p) => ({ ...p, zip: v }))} placeholder="Enter Pin Code" />
                </FieldShell>
                <FieldShell label="City" labelHi="शहरे" required>
                  <SelectInput icon={<Building2 size={16} />} value={officeAddress.city} onChange={(v) => setOfficeAddress((p) => ({ ...p, city: v }))} options={CITIES} placeholder="Select City" />
                </FieldShell>
                <FieldShell label="State" labelHi="राज्य" required>
                  <SelectInput icon={<Building2 size={16} />} value={officeAddress.state} onChange={(v) => setOfficeAddress((p) => ({ ...p, state: v }))} options={STATES} placeholder="Select State" />
                </FieldShell>
                <FieldShell label="Country" labelHi="देश" required>
                  <SelectInput icon={<Flag size={16} />} value={officeAddress.country} onChange={(v) => setOfficeAddress((p) => ({ ...p, country: v }))} options={COUNTRIES} placeholder="Select Country" />
                </FieldShell>
              </div>
            )}
          </SectionCard>
        </>
      )}

      {/* ── KYC ── */}
      {activeTab === "KYC" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard titleEn="Savings Account (ID Proof)" titleHi="प्रोफाइल तपशील" icon={<User size={16} />}>
            {ID_PROOF_DOCS.map((doc) => (
              <DocumentRow
                key={doc}
                label={doc}
                checked={idProofDocs[doc].checked}
                expiryDate={idProofDocs[doc].expiryDate}
                documentNumber={idProofDocs[doc].documentNumber}
                onCheck={(v) => updateDoc(setIdProofDocs, doc, { checked: v })}
                onExpiryChange={(v) => updateDoc(setIdProofDocs, doc, { expiryDate: v })}
                onDocNumberChange={(v) => updateDoc(setIdProofDocs, doc, { documentNumber: v })}
              />
            ))}
          </SectionCard>

          <SectionCard titleEn="Savings Account (Address Proof)" titleHi="प्रोफाइल तपशील" icon={<User size={16} />}>
            {ADDRESS_PROOF_DOCS.map((doc) => (
              <DocumentRow
                key={doc}
                label={doc}
                checked={addressProofDocs[doc].checked}
                expiryDate={addressProofDocs[doc].expiryDate}
                documentNumber={addressProofDocs[doc].documentNumber}
                onCheck={(v) => updateDoc(setAddressProofDocs, doc, { checked: v })}
                onExpiryChange={(v) => updateDoc(setAddressProofDocs, doc, { expiryDate: v })}
                onDocNumberChange={(v) => updateDoc(setAddressProofDocs, doc, { documentNumber: v })}
              />
            ))}
          </SectionCard>

          <SectionCard titleEn="Partnership Firms" titleHi="प्रोफाइल तपशील" icon={<User size={16} />}>
            {PARTNERSHIP_DOCS.map((doc) => (
              <DocumentRow
                key={doc}
                label={doc}
                checked={partnershipDocs[doc].checked}
                expiryDate={partnershipDocs[doc].expiryDate}
                documentNumber={partnershipDocs[doc].documentNumber}
                onCheck={(v) => updateDoc(setPartnershipDocs, doc, { checked: v })}
                onExpiryChange={(v) => updateDoc(setPartnershipDocs, doc, { expiryDate: v })}
                onDocNumberChange={(v) => updateDoc(setPartnershipDocs, doc, { documentNumber: v })}
                showDocNumber={false}
              />
            ))}
          </SectionCard>

          <SectionCard titleEn="Business Concern" titleHi="प्रोफाइल तपशील" icon={<User size={16} />}>
            {BUSINESS_DOCS.map((doc) => (
              <DocumentRow
                key={doc}
                label={doc}
                checked={businessDocs[doc].checked}
                expiryDate={businessDocs[doc].expiryDate}
                documentNumber={businessDocs[doc].documentNumber}
                onCheck={(v) => updateDoc(setBusinessDocs, doc, { checked: v })}
                onExpiryChange={(v) => updateDoc(setBusinessDocs, doc, { expiryDate: v })}
                onDocNumberChange={(v) => updateDoc(setBusinessDocs, doc, { documentNumber: v })}
                showDocNumber={false}
              />
            ))}
          </SectionCard>
        </div>
      )}

      {/* ── Profile Details ── */}
      {activeTab === "Profile Details" && (
        <SectionCard
          titleEn="Profile Details"
          titleHi="प्रोफाइल तपशील"
          subtitleEn="Enter the customer's occupation, income, and account profile information."
          subtitleHi="ग्राहकाची व्यवसाय, उत्पन्न आणि खाते प्रोफाइल संबंधित माहिती भरा."
          icon={<User size={16} />}
        >
          <div className={`${grid3} mt-2`}>
            {(
              [
                ["purposeOfAccOpening", "Purpose Of Acc. Opening", "खाते उघडण्याचा उद्देश", "Enter Purpose of Acc. Opening"],
                ["workingInstName", "Name Of the Working Inst./Comp.", "कार्यरत संस्था / कंपनीचे नाव", "Name Of the Working Inst./Comp."],
                ["incomeSource", "Income Source", "उत्पन्नाचा स्रोत", "Enter Income Source"],
                ["openingYearSelfBusi", "Opening Year Of the Self Busi.", "स्वयं व्यवसाय सुरू केल्याचे वर्ष", "Enter Opening Year Of the Self Busi."],
                ["fixedYearlyIncome", "Fixed Yearly Income", "वार्षिक निश्चित उत्पन्न", "Enter Yearly Income"],
                ["sixthMonthFixAmount", "6th month Fix Amount", "मागील ६ महिन्यांतील सरासरी शिल्लक रक्कम", "Enter 6th month Fix Amount"],
                ["limitAmtTransaction", "Limit Amt. of Transaction", "व्यवहार मर्यादा रक्कम", "Enter Amt. of Transaction"],
              ] as const
            ).map(([key, label, labelHi, placeholder]) => (
              <FieldShell key={key} label={label} labelHi={labelHi} required>
                <TextInput
                  icon={<User size={16} />}
                  value={profile[key]}
                  onChange={(v) => setProfile((p) => ({ ...p, [key]: v }))}
                  placeholder={placeholder}
                />
              </FieldShell>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Capture Signature & Photo ── */}
      {activeTab === "Capture Signature & Photo" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UploadZone
            titleEn="Capture Signature"
            titleHi="प्रोफाइल तपशील"
            subtitleEn="Upload or capture customer signature."
            subtitleHi="ग्राहकाची स्वाक्षरी अपलोड किंवा कॅप्चर करा."
          />
          <UploadZone
            titleEn="Capture Profile Photo"
            titleHi="प्रोफाइल तपशील"
            subtitleEn="Upload or capture customer profile photo."
            subtitleHi="ग्राहकाचा प्रोफाइल फोटो अपलोड किंवा कॅप्चर करा."
          />
        </div>
      )}
    </FormModal>
  );
};

export default AddCM;
