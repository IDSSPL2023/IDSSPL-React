import { useState, type Dispatch, type SetStateAction } from "react";
import { User, IdCard, Baby, Heart, Car, AlertTriangle, Home, Phone, Flag, Building2, MapPin, Hash, X, Upload, Mail, UserCircle2, Smartphone, Eye, SquarePen, List, Copy, Pencil, Check, ChevronRight } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SelectInput, DateInput, RadioYesNo, SectionCard, DocumentRow, UploadZone } from "@/components/shared/FormFields";
import { CountryPicklistField } from "@/components/common";
import FilterModal, { type CustomerFilters, defaultValues } from "@/components/CustomerMaster/FilterModal";
import { useBilingual } from "@/i18n/useBilingual";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import StatusPill from "@/components/shared/StatusPill";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import { IMAGES } from "@/assets";
import Image from "@/components/ui/Image";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";

/* ===== from AddCM.tsx ===== */
const AddCM_TABS = [
  "Customer Details",
  "Address Details",
  "KYC",
  "Profile Details",
  "Capture Signature & Photo",
] as const;

type AddCM_TabKey = (typeof AddCM_TABS)[number];
type AddCM_AddCMProps = {
  onClose?: () => void;
};

const AddCM_SALUTATIONS = ["MR", "MRS", "MS", "DR"];
const AddCM_GENDERS = ["Male", "Female", "Other"];
const AddCM_MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed"];
const AddCM_GUARDIAN_RELATIONS = ["Father", "Mother", "Uncle", "Aunt", "Other"];
const AddCM_RESIDENCE_TYPES = ["Owned", "Rented", "Company Provided"];
const AddCM_RESIDENCE_STATUS = ["Permanent", "Temporary"];
const AddCM_CITIES = ["Kolhapur", "Mumbai", "Pune", "Nagpur"];
const AddCM_STATES = ["Maharashtra", "Karnataka", "Goa"];
const AddCM_VEHICLE_OPTIONS = ["Yes", "No"];
const AddCM_RISK_CATEGORIES = ["Low", "Medium", "High"];
const AddCM_CATEGORY_CODES = ["Public", "Private", "Staff"];

const AddCM_ID_PROOF_DOCS = [
  "Passport",
  "Aadhar Card",
  "Pan Card",
  "Election Card",
  "Driving License",
  "NREGA Job Card",
];

const AddCM_ADDRESS_PROOF_DOCS = [
  "Telephone Bill",
  "Bank Statement",
  "Govt. Documents",
  "Electricity Bill",
  "Ration Card",
  "Passport",
];

const AddCM_PARTNERSHIP_DOCS = [
  "Registration Certificate,",
  "Partnership Deed",
  "Power Of Attorney",
  "Any Officially Valid Document",
  "Latest Telephone Bill In The Name Of Firm/ Partners",
];

const AddCM_BUSINESS_DOCS = [
  "Certificate Of Registration, If Registered",
  "Trust Deed",
  "Power Of Attorney Granted To Transact Business On Its Behalf",
  "Any Officially Valid Document To Identify The Trustees, Settlers, Beneficiaries",
  "Resolution Of The Managing Body Of The Foundation / Association",
  "Latest Telephone Bill",
];

type AddCM_DocState = { checked: boolean; expiryDate: string; documentNumber: string };

const AddCM_emptyDoc = (): AddCM_DocState => ({ checked: false, expiryDate: "", documentNumber: "" });

const AddCM = ({ onClose = () => {} }: AddCM_AddCMProps) => {
  const [activeTab, setActiveTab] = useState<AddCM_TabKey>("Customer Details");

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

  const [idProofDocs, setIdProofDocs] = useState<Record<string, AddCM_DocState>>(
    Object.fromEntries(AddCM_ID_PROOF_DOCS.map((d) => [d, AddCM_emptyDoc()]))
  );
  const [addressProofDocs, setAddressProofDocs] = useState<Record<string, AddCM_DocState>>(
    Object.fromEntries(AddCM_ADDRESS_PROOF_DOCS.map((d) => [d, AddCM_emptyDoc()]))
  );
  const [partnershipDocs, setPartnershipDocs] = useState<Record<string, AddCM_DocState>>(
    Object.fromEntries(AddCM_PARTNERSHIP_DOCS.map((d) => [d, AddCM_emptyDoc()]))
  );
  const [businessDocs, setBusinessDocs] = useState<Record<string, AddCM_DocState>>(
    Object.fromEntries(AddCM_BUSINESS_DOCS.map((d) => [d, AddCM_emptyDoc()]))
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
    setter: Dispatch<SetStateAction<Record<string, AddCM_DocState>>>,
    key: string,
    patch: Partial<AddCM_DocState>
  ) => setter((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const handleValidate = () => {
    window.alert(`${activeTab} tab validated successfully.`);
  };

  const handleNext = () => {
    const idx = AddCM_TABS.indexOf(activeTab);
    if (idx < AddCM_TABS.length - 1) setActiveTab(AddCM_TABS[idx + 1]);
  };

  const handleSave = () => {
    window.alert("Customer saved successfully.");
    onClose();
  };

  const isLastTab = activeTab === AddCM_TABS[AddCM_TABS.length - 1];

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";
  const grid3 = "grid grid-cols-1 gap-4 md:grid-cols-3";

  return (
    <FormModal
      onClose={onClose}
      titleEn="Add Customer"
      titleHi="ग्राहक जोडा"
      subtitleEn="Add some basic information related to the Customer"
      subtitleHi="कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती जोडा"
      tabs={[...AddCM_TABS]}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as AddCM_TabKey)}
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
                  options={AddCM_SALUTATIONS}
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
                  options={AddCM_GENDERS}
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
                  options={AddCM_MARITAL_STATUS}
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
                      options={AddCM_GUARDIAN_RELATIONS}
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
                  options={AddCM_CATEGORY_CODES}
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
                  options={AddCM_VEHICLE_OPTIONS}
                  placeholder="Select Vehicle Owned"
                />
              </FieldShell>
              <FieldShell label="Risk Category" labelHi="जोखीम श्रेणी" required>
                <SelectInput
                  icon={<AlertTriangle size={16} />}
                  value={classification.riskCategory}
                  onChange={(v) => setClassification((p) => ({ ...p, riskCategory: v }))}
                  options={AddCM_RISK_CATEGORIES}
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
                <SelectInput icon={<Home size={16} />} value={currentAddress.residenceType} onChange={(v) => setCurrentAddress((p) => ({ ...p, residenceType: v }))} options={AddCM_RESIDENCE_TYPES} placeholder="Select Residence Type" />
              </FieldShell>
              <FieldShell label="Residence Status" labelHi="निवास स्थिती" required>
                <SelectInput icon={<Home size={16} />} value={currentAddress.residenceStatus} onChange={(v) => setCurrentAddress((p) => ({ ...p, residenceStatus: v }))} options={AddCM_RESIDENCE_STATUS} placeholder="Select Residence Status" />
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
                <SelectInput icon={<Building2 size={16} />} value={currentAddress.city} onChange={(v) => setCurrentAddress((p) => ({ ...p, city: v }))} options={AddCM_CITIES} placeholder="Select City" />
              </FieldShell>
              <FieldShell label="State" labelHi="राज्य" required>
                <SelectInput icon={<Building2 size={16} />} value={currentAddress.state} onChange={(v) => setCurrentAddress((p) => ({ ...p, state: v }))} options={AddCM_STATES} placeholder="Select State" />
              </FieldShell>
              <CountryPicklistField label="Country" labelHi="देश" required icon={<Flag size={16} />} value={currentAddress.country} onSelect={(c) => setCurrentAddress((p) => ({ ...p, country: c.name }))} />
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
                  <SelectInput icon={<Building2 size={16} />} value={permanentAddress.city} onChange={(v) => setPermanentAddress((p) => ({ ...p, city: v }))} options={AddCM_CITIES} placeholder="Select City" />
                </FieldShell>
                <FieldShell label="State" labelHi="राज्य" required>
                  <SelectInput icon={<Building2 size={16} />} value={permanentAddress.state} onChange={(v) => setPermanentAddress((p) => ({ ...p, state: v }))} options={AddCM_STATES} placeholder="Select State" />
                </FieldShell>
                <CountryPicklistField label="Country" labelHi="देश" required icon={<Flag size={16} />} value={permanentAddress.country} onSelect={(c) => setPermanentAddress((p) => ({ ...p, country: c.name }))} />
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
                  <SelectInput icon={<Building2 size={16} />} value={officeAddress.city} onChange={(v) => setOfficeAddress((p) => ({ ...p, city: v }))} options={AddCM_CITIES} placeholder="Select City" />
                </FieldShell>
                <FieldShell label="State" labelHi="राज्य" required>
                  <SelectInput icon={<Building2 size={16} />} value={officeAddress.state} onChange={(v) => setOfficeAddress((p) => ({ ...p, state: v }))} options={AddCM_STATES} placeholder="Select State" />
                </FieldShell>
                <CountryPicklistField label="Country" labelHi="देश" required icon={<Flag size={16} />} value={officeAddress.country} onSelect={(c) => setOfficeAddress((p) => ({ ...p, country: c.name }))} />
              </div>
            )}
          </SectionCard>
        </>
      )}

      {/* ── KYC ── */}
      {activeTab === "KYC" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard titleEn="Savings Account (ID Proof)" titleHi="प्रोफाइल तपशील" icon={<User size={16} />}>
            {AddCM_ID_PROOF_DOCS.map((doc) => (
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
            {AddCM_ADDRESS_PROOF_DOCS.map((doc) => (
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
            {AddCM_PARTNERSHIP_DOCS.map((doc) => (
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
            {AddCM_BUSINESS_DOCS.map((doc) => (
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


/* ===== from BankingServices.tsx ===== */
interface BankingServices_BankingServicesState {
  debitCard: boolean;
  internetBanking: boolean;
  mobileBanking: boolean;
  upiServices: boolean;
}

interface BankingServices_BankingServicesProps {
  onClose: () => void;
  onSubmit?: (services: BankingServices_BankingServicesState) => void;
  customerId: string;
  customerName: string;
  initialServices?: BankingServices_BankingServicesState;
}

const BankingServices_defaultServices: BankingServices_BankingServicesState = {
  debitCard: false,
  internetBanking: true,
  mobileBanking: true,
  upiServices: false,
};

function BankingServices_MastercardIcon() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <span className="relative flex h-4 w-6 items-center justify-center">
        <span className="absolute left-0 h-4 w-4 rounded-full bg-red-500" />
        <span className="absolute right-0 h-4 w-4 rounded-full bg-orange-400 mix-blend-multiply" />
      </span>
    </span>
  );
}

function BankingServices_InternetBankingIcon() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#1e3a8a" strokeWidth="1.8">
        <path d="M4 10l8-5 8 5" />
        <rect x="5" y="10" width="14" height="8" />
        <line x1="3" y1="19" x2="21" y2="19" />
        <line x1="8" y1="12" x2="8" y2="16" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="16" y1="12" x2="16" y2="16" />
        <circle cx="18" cy="6" r="3.2" stroke="#2563eb" />
        <line x1="18" y1="3.2" x2="18" y2="8.8" stroke="#2563eb" />
        <line x1="15.5" y1="6" x2="20.5" y2="6" stroke="#2563eb" />
      </svg>
    </span>
  );
}

function BankingServices_MobileBankingIcon() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#1e3a8a" strokeWidth="1.8">
        <rect x="7" y="2.5" width="10" height="19" rx="1.5" />
        <line x1="7" y1="18" x2="17" y2="18" />
      </svg>
    </span>
  );
}

function BankingServices_UpiIcon() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path d="M14 3L6 13h5l-1 8 9-11h-6l1-7z" fill="#22c55e" stroke="#f97316" strokeWidth="0.5" />
      </svg>
    </span>
  );
}

const BankingServices_serviceOptions: {
  key: keyof BankingServices_BankingServicesState;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "debitCard", label: "Debit Card", icon: <BankingServices_MastercardIcon /> },
  { key: "internetBanking", label: "Internet Banking", icon: <BankingServices_InternetBankingIcon /> },
  { key: "mobileBanking", label: "Mobile Banking", icon: <BankingServices_MobileBankingIcon /> },
  { key: "upiServices", label: "UPI Services", icon: <BankingServices_UpiIcon /> },
];

function BankingServices_ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none ${
        checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function BankingServices({
  onClose,
  onSubmit,
  customerId,
  customerName,
  initialServices = BankingServices_defaultServices,
}: BankingServices_BankingServicesProps) {
  const [services, setServices] = useState<BankingServices_BankingServicesState>(initialServices);

  const toggleService = (key: keyof BankingServices_BankingServicesState) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    onSubmit?.(services);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />

        <div className="relative px-8 py-8 sm:px-10 sm:py-10">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 bg-primary-50">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#3b82f6" strokeWidth="1.6">
                  <path d="M3 21h13" />
                  <path d="M5 21v-7" />
                  <path d="M9 21v-7" />
                  <path d="M13 21v-7" />
                  <path d="M4 10l6-4 6 4" />
                  <circle cx="18" cy="6" r="3" />
                  <path d="M18 4.5v3" />
                  <path d="M16.5 6h3" />
                  <path d="M4 14h11" />
                </svg>
              </span>
              <div>
                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                  <span className="text-slate-900 dark:text-slate-100">Banking Services</span>{" "}
                  <span className="text-slate-500 dark:text-slate-400">/ बँकिंग सेवा</span>
                </h2>
                <p className=" text-sm text-slate-500 dark:text-slate-400 ">
                  Choose a banking service to proceed with the customer&apos;s
                  request. /  ग्राहकाच्या विनंतीवर पुढे जाण्यासाठी बँकिंग सेवा निवडा.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-400 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-5 border-t border-slate-200 dark:border-slate-800" />

          {/* Service toggle cards */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {BankingServices_serviceOptions.map((option) => {
              const isActive = services[option.key];
              return (
                <div
                  key={option.key}
                  className={`flex items-center justify-between rounded-md border px-4 py-2 transition-colors ${
                    isActive
                      ? "border-primary bg-[#EEF1FF] dark:bg-primary-900/20"
                      : "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <span className="text-lg text-slate-900 dark:text-slate-100">{option.label}</span>
                  </div>
                  <BankingServices_ToggleSwitch
                    checked={isActive}
                    onChange={() => toggleService(option.key)}
                  />
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-40 items-center justify-center gap-2 rounded-md border border-primary py-3 font-semibold text-primary transition hover:bg-primary-50"
            >
              Cancel
              <X className="h-4 w-4" strokeWidth={3} />
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex w-40 items-center justify-center gap-2 rounded-md bg-primary py-3 font-semibold text-white transition hover:bg-primary-800"
            >
              Submit
              <Upload className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ===== from EditEmail.tsx ===== */
interface EditEmail_EditEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  customerId: string;
  customerName: string;
  currentEmail: string;
}

function EditEmailModal({
  isOpen,
  onClose,
  onSubmit,
  customerId,
  customerName,
  currentEmail,
}: EditEmail_EditEmailModalProps) {
  const [email, setEmail] = useState(currentEmail);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-primary-100/70" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-primary-100/70" />

        <div className="relative px-8 py-8 sm:px-10 sm:py-10">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary-50">
                <Mail className="h-6 w-6 fill-primary text-white" strokeWidth={2} />
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl">
                <span className="text-slate-900 dark:text-slate-100">Email ID</span>{" "}
                <span className="text-slate-400 dark:text-slate-400">/ ईमेल आयडी</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Read-only info fields */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
                Customer ID <span className="text-slate-400 font-medium dark:text-slate-400">/ ग्राहकाचे आयडी</span>
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
                <UserCircle2 className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="truncate text-slate-500 dark:text-slate-400">{customerId}</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
                Customer Name <span className="text-slate-400 font-medium dark:text-slate-400">/ ग्राहकाचे नाव</span>
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
                <IdCard className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="truncate text-slate-500 dark:text-slate-400">{customerName}</span>
              </div>
            </div>
          </div>

          {/* Editable email field */}
          <div className="mb-10">
            <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
              Edit Email ID <span className="text-slate-500 font-medium dark:text-slate-400">/ ईमेल आयडी एडिट करा</span>
              <span className="text-red-500"> *</span>
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-primary px-4 py-3 focus-within:ring-2 focus-within:ring-primary-100">
              <Mail className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder-slate-500"
                placeholder="Enter email ID"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-40 items-center justify-center gap-2 rounded-xl border border-primary py-3 font-semibold text-primary transition hover:bg-primary-50"
            >
              Cancel
              <X className="h-4 w-4" strokeWidth={3} />
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex w-40 items-center justify-center gap-2 rounded-xl bg-primary-700 py-3 font-semibold text-white transition hover:bg-primary-800"
            >
              Submit
              <Upload className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ===== from EditMobile.tsx ===== */
interface EditMobile_EditMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mobile: string) => void;
  customerId: string;
  customerName: string;
  currentMobile: string;
}

function EditMobileModal({
  isOpen,
  onClose,
  onSubmit,
  customerId,
  customerName,
  currentMobile,
}: EditMobile_EditMobileModalProps) {
  const [mobile, setMobile] = useState(currentMobile);

  if (!isOpen) return null;

  const handleMobileChange = (value: string) => {
    // digits only, max 10
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setMobile(digitsOnly);
  };

  const handleSubmit = () => {
    onSubmit(mobile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-primary-100/70" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-primary-100/70" />

        <div className="relative px-8 py-8 sm:px-10 sm:py-10">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary-50">
                <Smartphone className="h-6 w-6 fill-primary text-white" strokeWidth={2} />
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl">
                <span className="text-slate-900 dark:text-slate-100">Mobile Number</span>{" "}
                <span className="text-slate-400 dark:text-slate-400">/ मोबाइल क्रमांक</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Read-only info fields */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
                Customer ID <span className="text-slate-400 font-medium dark:text-slate-400">/ ग्राहकाचे आयडी</span>
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
                <UserCircle2 className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="truncate text-slate-500 dark:text-slate-400">{customerId}</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
                Customer Name <span className="text-slate-400 font-medium dark:text-slate-400">/ ग्राहकाचे नाव</span>
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
                <IdCard className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="truncate text-slate-500 dark:text-slate-400">{customerName}</span>
              </div>
            </div>
          </div>

          {/* Editable mobile field */}
          <div className="mb-10">
            <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
              Edit Mobile Number <span className="text-slate-500 font-medium dark:text-slate-400">/ मोबाईल नंबर एडिट करा</span>
              <span className="text-red-500"> *</span>
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-primary px-4 py-3 focus-within:ring-2 focus-within:ring-primary-100">
              <Phone className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
              <input
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => handleMobileChange(e.target.value)}
                className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder-slate-500"
                placeholder="Enter mobile number"
                maxLength={10}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-40 items-center justify-center gap-2 rounded-xl border border-primary py-3 font-semibold text-primary transition hover:bg-primary-50"
            >
              Cancel
              <X className="h-4 w-4" strokeWidth={3} />
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={mobile.length !== 10}
              className="flex w-40 items-center justify-center gap-2 rounded-xl bg-primary-700 py-3 font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit
              <Upload className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ===== from TableCM.tsx ===== */
export type TableCM_RowData = {
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
};

const TableCM_columns = [
  { key: "srNo", labelKey: "customerMaster.table.srNo", sortable: false },
  { key: "action", labelKey: "customerMaster.table.action", sortable: false },
  { key: "customerDetails", labelKey: "customerMaster.table.customerDetails", sortable: false },
  { key: "status", labelKey: "customerMaster.table.status", sortable: true },
  { key: "name", labelKey: "customerMaster.table.name", sortable: true },
  { key: "gender", labelKey: "customerMaster.table.gender", sortable: true },
  { key: "dob", labelKey: "customerMaster.table.dob", sortable: true },
  { key: "regDate", labelKey: "customerMaster.table.regDate", sortable: true },
  { key: "categoryCode", labelKey: "customerMaster.table.categoryCode", sortable: true },
  { key: "riskCategory", labelKey: "customerMaster.table.riskCategory", sortable: true },
] as const;

const TableCM_rows: TableCM_RowData[] = [
  { srNo: 1, customerId: "1234567890", phone: "8989567890", email: "Shivappa@gmail.com", status: "Active", name: "Jali Shivappa Telgi", gender: "M", dob: "18-Aug-2001", regDate: "25-Sep-2026", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 2, customerId: "0987654321", phone: "7896541230", email: "Aditi@gmail.com", status: "Active", name: "Aditi Verma", gender: "F", dob: "15-Mar-1998", regDate: "10-Oct-2025", categoryCode: "Private", riskCategory: "Low" },
  { srNo: 3, customerId: "5647382910", phone: "1234567891", email: "Ravi@gmail.com", status: "Active", name: "Ravi Kumar", gender: "M", dob: "22-Jul-1995", regDate: "30-Dec-2023", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 4, customerId: "1234567890", phone: "8989567890", email: "Shivappa@gmail.com", status: "Active", name: "Jali Shivappa Telgi", gender: "M", dob: "18-Aug-2001", regDate: "25-Sep-2026", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 5, customerId: "9876543210", phone: "6543210987", email: "Anita.singh@yahoo.com", status: "Active", name: "Anita Singh", gender: "F", dob: "05-May-1995", regDate: "12-Jan-2025", categoryCode: "Private", riskCategory: "Low" },
  { srNo: 6, customerId: "2468013579", phone: "1357908642", email: "rohit_kumar@hotmail.com", status: "Active", name: "Rohit Kumar", gender: "M", dob: "22-Jun-1990", regDate: "30-Aug-2027", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 7, customerId: "0987654321", phone: "5678901234", email: "Anjali@gmail.com", status: "Active", name: "Anjalu Sharma", gender: "F", dob: "05-Jan-1998", regDate: "12-Oct-2025", categoryCode: "Private", riskCategory: "Medium" },
  { srNo: 8, customerId: "1122334455", phone: "3344556677", email: "Rajesh@gmail.com", status: "Active", name: "Rajesh Kumar Sharma", gender: "M", dob: "20-Feb-1990", regDate: "01-Jan-2030", categoryCode: "Public", riskCategory: "High" },
];

type TableCM_SortKey = keyof Omit<TableCM_RowData, "phone" | "email">;

interface TableCM_TableCMProps {
  filters?: CustomerFilters;
  onView?: (row: TableCM_RowData) => void;
  onEdit?: (row: TableCM_RowData) => void;
  onServices?: (row: TableCM_RowData) => void;
  onEditPhone?: (row: TableCM_RowData) => void;
  onEditEmail?: (row: TableCM_RowData) => void;
}

const TableCM = ({
  filters,
  onView,
  onEdit,
  onServices,
  onEditPhone,
  onEditEmail,
}: TableCM_TableCMProps) => {
  const { tRaw } = useBilingual();
  const [sortKey, setSortKey] = useState<TableCM_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: TableCM_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = TableCM_rows.filter((r) => {
    if (!filters) return true;
    if (filters.customerName && !r.name.toLowerCase().includes(filters.customerName.toLowerCase())) return false;
    if (filters.customerId && !r.customerId.toLowerCase().includes(filters.customerId.toLowerCase())) return false;
    if (filters.status && r.status.toLowerCase() !== filters.status.toLowerCase()) return false;
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
    if (risk === "High") return "text-red-600 dark:text-red-400";
    if (risk === "Medium") return "text-primary";
    return "text-amber-700 dark:text-amber-400";
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-visible shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-primary rounded-t-xl">
              {TableCM_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() =>
                    col.sortable && handleSort(col.key as TableCM_SortKey)
                  }
                  className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <SortableHeaderLabel label={tRaw(col.labelKey)} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr
                key={row.srNo}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} hover:bg-gray-50 dark:hover:bg-slate-800 relative`}
              >
                <td className="px-6 py-3">
                  <SrNoBadge value={row.srNo} />
                </td>

                <td className="px-6 py-3 relative">
                  <RowActionMenu
                    items={[
                      { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => onView?.(row) },
                      { key: "edit", label: tRaw("common.edit"), icon: SquarePen, onClick: () => onEdit?.(row) },
                      { key: "services", label: tRaw("common.services"), icon: List, onClick: () => onServices?.(row) },
                    ]}
                  />
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {row.customerId}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-400">
                      <Phone size={13} className="text-gray-400 dark:text-slate-500" />
                      {row.phone}
                      <button
                        onClick={() => onEditPhone?.(row)}
                        className="text-primary hover:text-primary-700"
                      >
                        <Copy size={12} />
                      </button>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-400">
                      <Mail size={13} className="text-gray-400 dark:text-slate-500" />
                      {row.email}
                      <button
                        onClick={() => onEditEmail?.(row)}
                        className="text-primary hover:text-primary-700"
                      >
                        <Copy size={12} />
                      </button>
                    </span>
                  </div>
                </td>

                <td className="px-6 py-3">
                  <StatusPill label={row.status} />
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                  {row.name}
                </td>

                <td className="px-6 py-3">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${
                      row.gender === "M"
                        ? "bg-primary-50 text-primary"
                        : "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                    }`}
                  >
                    {row.gender}
                  </span>
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                  {row.dob}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                  {row.regDate}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-300">
                  {row.categoryCode}
                </td>

                <td className="px-6 py-3">
                  <span
                    className={`text-[16px] font-semibold ${riskColor(row.riskCategory)}`}
                  >
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


/* ===== from ViewEditCM.tsx ===== */
/* ── Constants (same as AddCM) ── */
const ViewEditCM_TABS = [
  "Customer Details",
  "Address Details",
  "KYC",
  "Profile Details",
] as const;

type ViewEditCM_TabKey = (typeof ViewEditCM_TABS)[number];

const ViewEditCM_SALUTATIONS = ["MR", "MRS", "MS", "DR"];
const ViewEditCM_GENDERS = ["Male", "Female", "Other"];
const ViewEditCM_MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed"];
const ViewEditCM_GUARDIAN_RELATIONS = ["Father", "Mother", "Uncle", "Aunt", "Other"];
const ViewEditCM_RESIDENCE_TYPES = ["Owned", "Rented", "Company Provided"];
const ViewEditCM_RESIDENCE_STATUS = ["Permanent", "Temporary"];
const ViewEditCM_CITIES = ["Kolhapur", "Mumbai", "Pune", "Nagpur"];
const ViewEditCM_STATES = ["Maharashtra", "Karnataka", "Goa"];
const ViewEditCM_VEHICLE_OPTIONS = ["Yes", "No"];
const ViewEditCM_RISK_CATEGORIES = ["Low", "Medium", "High"];
const ViewEditCM_CATEGORY_CODES = ["Public", "Private", "Staff"];

const ViewEditCM_ID_PROOF_DOCS = [
  "Passport",
  "Aadhar Card",
  "Pan Card",
  "Election Card",
  "Driving License",
  "NREGA Job Card",
];

const ViewEditCM_ADDRESS_PROOF_DOCS = [
  "Telephone Bill",
  "Bank Statement",
  "Govt. Documents",
  "Electricity Bill",
  "Ration Card",
  "Passport",
];

const ViewEditCM_PARTNERSHIP_DOCS = [
  "Registration Certificate,",
  "Partnership Deed",
  "Power Of Attorney",
  "Any Officially Valid Document",
  "Latest Telephone Bill In The Name Of Firm/ Partners",
];

const ViewEditCM_BUSINESS_DOCS = [
  "Certificate Of Registration, If Registered",
  "Trust Deed",
  "Power Of Attorney Granted To Transact Business On Its Behalf",
  "Any Officially Valid Document To Identify The Trustees, Settlers, Beneficiaries",
  "Resolution Of The Managing Body Of The Foundation / Association",
  "Latest Telephone Bill",
];

type ViewEditCM_DocState = { checked: boolean; expiryDate: string; documentNumber: string };
const ViewEditCM_emptyDoc = (): ViewEditCM_DocState => ({ checked: false, expiryDate: "", documentNumber: "" });

/* ── Props ── */
export interface ViewEditCM_ViewEditCMProps {
  mode: "view" | "edit";
  customerData: TableCM_RowData;
  onClose: () => void;
}

/* ── Customer Banner ── */
const ViewEditCM_CustomerBanner = ({
  customerData,
  mode,
}: {
  customerData: TableCM_RowData;
  mode: "view" | "edit";
}) => (
  <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] px-6 py-4 dark:border-slate-800 dark:bg-slate-800">
    {/* Left: Photo + Info */}
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-primary-50 dark:border-slate-700">
          <Image
            src={IMAGES.PROFILE}
            alt="Customer Profile"
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </div>
        {mode === "edit" && (
          <button
            type="button"
            className="absolute -bottom-2 left-0 flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary-700"
          >
            <Pencil size={11} />
            Edit
          </button>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold text-primary-700">
          {customerData.name.toUpperCase()}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Customer ID: <span className="font-semibold">{customerData.customerId}</span>
          <span className="ml-4">
            Username: <span className="font-semibold">{customerData.email.split("@")[0]}@{customerData.customerId.slice(-5)}</span>
          </span>
        </p>
      </div>
    </div>

    {/* Right: Signature */}
    <div className="relative">
      <div className="flex h-20 w-40 items-center justify-center">
        <Image
          src={IMAGES.SIGN}
          alt="Customer Signature"
          width={160}
          height={80}
          className="h-full w-full object-contain"
        />
      </div>
      {mode === "edit" && (
        <button
          type="button"
          className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          <Pencil size={11} />
          Edit
        </button>
      )}
    </div>
  </div>
);

/* ── Main Component ── */
const ViewEditCM = ({ mode, customerData, onClose }: ViewEditCM_ViewEditCMProps) => {
  const isView = mode === "view";
  const [activeTab, setActiveTab] = useState<ViewEditCM_TabKey>("Customer Details");

  /* Pre-populate from customerData */
  const nameParts = customerData.name.split(" ");
  const firstName = nameParts[0] || "";
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";
  const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const [personal, setPersonal] = useState({
    salutation: customerData.gender === "M" ? "MR" : "MRS",
    firstName,
    middleName,
    surname,
    fullName: customerData.name.toUpperCase(),
    gender: customerData.gender === "M" ? "Male" : customerData.gender === "F" ? "Female" : "Other",
    dob: customerData.dob,
    regDate: customerData.regDate,
    motherName: "",
    fatherName: "",
    maritalStatus: "Single",
    noOfChildren: "",
    isMinor: false,
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
    categoryCode: customerData.categoryCode || "",
    subCategoryCode: "",
    occupationCode: "",
    constitutionCode: "",
    customerGroupCode: "",
    memberType: "",
    vehicleOwned: "",
    riskCategory: customerData.riskCategory || "",
  });

  const [currentAddress, setCurrentAddress] = useState({
    nationality: "Indian",
    residenceType: "",
    residenceStatus: "Owned",
    residencePhone: customerData.phone || "",
    address1: "",
    address2: "",
    address3: "",
    zip: "",
    city: "",
    state: "Maharashtra",
    country: "India",
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

  const [idProofDocs, setIdProofDocs] = useState<Record<string, ViewEditCM_DocState>>(
    Object.fromEntries(ViewEditCM_ID_PROOF_DOCS.map((d) => [d, ViewEditCM_emptyDoc()]))
  );
  const [addressProofDocs, setAddressProofDocs] = useState<Record<string, ViewEditCM_DocState>>(
    Object.fromEntries(ViewEditCM_ADDRESS_PROOF_DOCS.map((d) => [d, ViewEditCM_emptyDoc()]))
  );
  const [partnershipDocs, setPartnershipDocs] = useState<Record<string, ViewEditCM_DocState>>(
    Object.fromEntries(ViewEditCM_PARTNERSHIP_DOCS.map((d) => [d, ViewEditCM_emptyDoc()]))
  );
  const [businessDocs, setBusinessDocs] = useState<Record<string, ViewEditCM_DocState>>(
    Object.fromEntries(ViewEditCM_BUSINESS_DOCS.map((d) => [d, ViewEditCM_emptyDoc()]))
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
    setter: Dispatch<SetStateAction<Record<string, ViewEditCM_DocState>>>,
    key: string,
    patch: Partial<ViewEditCM_DocState>
  ) => setter((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const handleValidate = () => {
    window.alert(`${activeTab} tab validated successfully.`);
  };

  const handleNext = () => {
    const idx = ViewEditCM_TABS.indexOf(activeTab);
    if (idx < ViewEditCM_TABS.length - 1) setActiveTab(ViewEditCM_TABS[idx + 1]);
  };

  const handleSave = () => {
    window.alert("Customer updated successfully.");
    onClose();
  };

  const isLastTab = activeTab === ViewEditCM_TABS[ViewEditCM_TABS.length - 1];

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";
  const grid3 = "grid grid-cols-1 gap-4 md:grid-cols-3";

  /* For View mode: use a simpler footer with only Cancel + Next (or Cancel + OK, Got it on the last tab) */
  const viewFooter = (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
      >
        Cancel <X size={16} />
      </button>
      {isLastTab ? (
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          OK, Got it <Check size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-200"
        >
          Next <ChevronRight size={16} />
        </button>
      )}
    </div>
  );

  return (
    <FormModal
      onClose={onClose}
      titleEn={isView ? "View Customer" : "Edit Customer"}
      titleHi={isView ? "ग्राहक पहा" : "ग्राहक संपादित करा"}
      subtitleEn={
        isView
          ? "View customer information and account details."
          : "Update customer information and account details."
      }
      subtitleHi={
        isView
          ? "ग्राहकाची माहिती आणि खाते तपशील पहा."
          : "ग्राहकाची माहिती आणि खाते तपशील अद्यतनित करा."
      }
      tabs={[...ViewEditCM_TABS]}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as ViewEditCM_TabKey)}
      onValidate={isView ? undefined : handleValidate}
      onNext={handleNext}
      onSave={isView ? undefined : handleSave}
      isLastTab={isLastTab}
      hideFooter={isView}
      headerIcon={
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
          <Image
            src={isView ? IMAGES.PERSON_ICON : IMAGES.PERSON_EDIT_ICON}
            alt={isView ? "View Customer" : "Edit Customer"}
            width={28}
            height={28}
          />
        </div>
      }
    >
      {/* Customer Banner */}
      <ViewEditCM_CustomerBanner customerData={customerData} mode={mode} />

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
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, salutation: v }))}
                  options={ViewEditCM_SALUTATIONS}
                  placeholder="Select Salutation Code"
                />
              </FieldShell>
              <FieldShell label="First Name" labelHi="पहिले नाव" required>
                <TextInput
                  icon={<User size={16} />}
                  value={personal.firstName}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, firstName: v }))}
                  placeholder="Enter First Name"
                  readOnly={isView}
                />
              </FieldShell>
              <FieldShell label="Middle Name" labelHi="मधले नाव">
                <TextInput
                  icon={<User size={16} />}
                  value={personal.middleName}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, middleName: v }))}
                  placeholder="Enter Middle Name"
                  readOnly={isView}
                />
              </FieldShell>
              <FieldShell label="Surname" labelHi="आडनाव" required>
                <TextInput
                  icon={<User size={16} />}
                  value={personal.surname}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, surname: v }))}
                  placeholder="Enter Surname"
                  readOnly={isView}
                />
              </FieldShell>
              <FieldShell label="Full Name" labelHi="पूर्ण नाव" required>
                <TextInput
                  icon={<User size={16} />}
                  value={personal.fullName}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, fullName: v }))}
                  placeholder="Enter Full Name"
                  readOnly
                />
              </FieldShell>
              <FieldShell label="Gender" labelHi="लिंग" required>
                <SelectInput
                  icon={<User size={16} />}
                  value={personal.gender}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, gender: v }))}
                  options={ViewEditCM_GENDERS}
                  placeholder="Enter Gender"
                />
              </FieldShell>
              <FieldShell label="Date of Birth" labelHi="जन्मतारीख" required>
                <DateInput
                  value={personal.dob}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, dob: v }))}
                />
              </FieldShell>
              <FieldShell label="Registration Date" labelHi="नोंदणी दिनांक" required>
                <DateInput
                  value={personal.regDate}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, regDate: v }))}
                />
              </FieldShell>
              <FieldShell label="Mother Name" labelHi="आईचे नाव" required>
                <TextInput
                  icon={<User size={16} />}
                  value={personal.motherName}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, motherName: v }))}
                  placeholder="Enter Mother Name"
                  readOnly={isView}
                />
              </FieldShell>
              <FieldShell label="Father Name" labelHi="वडिलांचे नाव" required>
                <TextInput
                  icon={<User size={16} />}
                  value={personal.fatherName}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, fatherName: v }))}
                  placeholder="Enter Father Name"
                  readOnly={isView}
                />
              </FieldShell>
              <FieldShell label="Marital Status" labelHi="वैवाहिक स्थिती" required>
                <SelectInput
                  icon={<Heart size={16} />}
                  value={personal.maritalStatus}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, maritalStatus: v }))}
                  options={ViewEditCM_MARITAL_STATUS}
                  placeholder="Select Marital Status"
                />
              </FieldShell>
              <FieldShell label="No. of Children" labelHi="मुलांची संख्या">
                <TextInput
                  icon={<Baby size={16} />}
                  value={personal.noOfChildren}
                  onChange={(v) => !isView && setPersonal((p) => ({ ...p, noOfChildren: v }))}
                  placeholder="Enter Number of Children"
                  readOnly={isView}
                />
              </FieldShell>
              {!isView && (
                <>
                  <RadioYesNo
                    label="Is Minor"
                    labelHi="अल्पवयीन आहे का"
                    value={personal.isMinor}
                    onChange={(v) => !isView && setPersonal((p) => ({ ...p, isMinor: v }))}
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
                          options={ViewEditCM_GUARDIAN_RELATIONS}
                          placeholder="Select Relation with Guardian"
                        />
                      </FieldShell>
                    </>
                  )}
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
                    onChange={(v) => !isView && setKycCompliance((p) => ({ ...p, [key]: v }))}
                    placeholder={placeholder}
                    readOnly={isView}
                  />
                </FieldShell>
              ))}
            </div>
            {!isView && (
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
                    onChange={(v) => !isView && setKycCompliance((p) => ({ ...p, [key]: v }))}
                  />
                ))}
              </div>
            )}
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
                  onChange={(v) => !isView && setClassification((p) => ({ ...p, categoryCode: v }))}
                  options={ViewEditCM_CATEGORY_CODES}
                  placeholder="Enter Category Code"
                />
              </FieldShell>
              <FieldShell label="Sub Category Code" labelHi="उपवर्ग कोड" required>
                <TextInput
                  icon={<User size={16} />}
                  value={classification.subCategoryCode}
                  onChange={(v) => !isView && setClassification((p) => ({ ...p, subCategoryCode: v }))}
                  placeholder="Enter Sub Category Code"
                  readOnly={isView}
                />
              </FieldShell>
              <FieldShell label="Occupation Code" labelHi="व्यवसाय कोड" required>
                <TextInput
                  icon={<IdCard size={16} />}
                  value={classification.occupationCode}
                  onChange={(v) => !isView && setClassification((p) => ({ ...p, occupationCode: v }))}
                  placeholder="Enter Occupation Code"
                  readOnly={isView}
                />
              </FieldShell>
              <FieldShell label="Constitution Code" labelHi="संविधान प्रकार" required>
                <TextInput
                  icon={<IdCard size={16} />}
                  value={classification.constitutionCode}
                  onChange={(v) => !isView && setClassification((p) => ({ ...p, constitutionCode: v }))}
                  placeholder="Enter Constitution Code"
                  readOnly={isView}
                />
              </FieldShell>
              <FieldShell label="Customer Group Code" labelHi="ग्राहक गट कोड" required>
                <TextInput
                  icon={<IdCard size={16} />}
                  value={classification.customerGroupCode}
                  onChange={(v) => !isView && setClassification((p) => ({ ...p, customerGroupCode: v }))}
                  placeholder="Enter Customer Group Code"
                  readOnly={isView}
                />
              </FieldShell>
              <FieldShell label="Member Type" labelHi="सदस्य प्रकार" required>
                <TextInput
                  icon={<User size={16} />}
                  value={classification.memberType}
                  onChange={(v) => !isView && setClassification((p) => ({ ...p, memberType: v }))}
                  placeholder="Enter Member Type"
                  readOnly={isView}
                />
              </FieldShell>
              <FieldShell label="Vehicle Owned" labelHi="वाहन मालकी" required>
                <SelectInput
                  icon={<Car size={16} />}
                  value={classification.vehicleOwned}
                  onChange={(v) => !isView && setClassification((p) => ({ ...p, vehicleOwned: v }))}
                  options={ViewEditCM_VEHICLE_OPTIONS}
                  placeholder="Select Vehicle Owned"
                />
              </FieldShell>
              <FieldShell label="Risk Category" labelHi="जोखीम श्रेणी" required>
                <SelectInput
                  icon={<AlertTriangle size={16} />}
                  value={classification.riskCategory}
                  onChange={(v) => !isView && setClassification((p) => ({ ...p, riskCategory: v }))}
                  options={ViewEditCM_RISK_CATEGORIES}
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
            subtitleHi="ग्राहकाचा निवास पत्त्याची माहिती व्यवस्थापित करा."
            icon={<Home size={16} />}
          >
            <div className={`${grid4} mt-2`}>
              <FieldShell label="Nationality" labelHi="राष्ट्रीयत्व" required>
                <TextInput icon={<Flag size={16} />} value={currentAddress.nationality} onChange={(v) => !isView && setCurrentAddress((p) => ({ ...p, nationality: v }))} placeholder="Enter Nationality" readOnly={isView} />
              </FieldShell>
              <FieldShell label="Residence Type" labelHi="निवासाचा प्रकार" required>
                <SelectInput icon={<Home size={16} />} value={currentAddress.residenceType} onChange={(v) => !isView && setCurrentAddress((p) => ({ ...p, residenceType: v }))} options={ViewEditCM_RESIDENCE_TYPES} placeholder="Select Residence Type" />
              </FieldShell>
              <FieldShell label="Residence Status" labelHi="निवास स्थिती" required>
                <SelectInput icon={<Home size={16} />} value={currentAddress.residenceStatus} onChange={(v) => !isView && setCurrentAddress((p) => ({ ...p, residenceStatus: v }))} options={ViewEditCM_RESIDENCE_STATUS} placeholder="Select Residence Status" />
              </FieldShell>
              <FieldShell label="Residence Phone" labelHi="निवासस्थानी दूरध्वनी क्रमांक" required>
                <TextInput icon={<Phone size={16} />} value={currentAddress.residencePhone} onChange={(v) => !isView && setCurrentAddress((p) => ({ ...p, residencePhone: v }))} placeholder="Enter Residence Phone" readOnly={isView} />
              </FieldShell>
              {(["address1", "address2", "address3"] as const).map((key, i) => (
                <FieldShell key={key} label={`Address ${i + 1}`} labelHi={`पत्ता ${i + 1}`} required={i < 2}>
                  <TextInput icon={<Home size={16} />} value={currentAddress[key]} onChange={(v) => !isView && setCurrentAddress((p) => ({ ...p, [key]: v }))} placeholder={`Enter Address ${i + 1}`} readOnly={isView} />
                </FieldShell>
              ))}
              <FieldShell label="Zip" labelHi="पिन कोड" required>
                <TextInput icon={<Hash size={16} />} value={currentAddress.zip} onChange={(v) => !isView && setCurrentAddress((p) => ({ ...p, zip: v }))} placeholder="Enter Pin Code" readOnly={isView} />
              </FieldShell>
              <FieldShell label="City" labelHi="शहरे" required>
                <SelectInput icon={<Building2 size={16} />} value={currentAddress.city} onChange={(v) => !isView && setCurrentAddress((p) => ({ ...p, city: v }))} options={ViewEditCM_CITIES} placeholder="Select City" />
              </FieldShell>
              <FieldShell label="State" labelHi="राज्य" required>
                <SelectInput icon={<Building2 size={16} />} value={currentAddress.state} onChange={(v) => !isView && setCurrentAddress((p) => ({ ...p, state: v }))} options={ViewEditCM_STATES} placeholder="Select State" />
              </FieldShell>
              <CountryPicklistField label="Country" labelHi="देश" required icon={<Flag size={16} />} value={currentAddress.country} readOnly={isView} onSelect={(c) => !isView && setCurrentAddress((p) => ({ ...p, country: c.name }))} />
            </div>
          </SectionCard>

          <SectionCard
            titleEn="Permanent Address Details"
            titleHi="कायमचा पत्ता तपशील"
            subtitleEn="Manage permanent address information."
            subtitleHi="ग्राहकाचा कायमचा पत्ता व्यवस्थापित करा."
            icon={<Home size={16} />}
          >
            {!isView && (
              <RadioYesNo
                label="Is Permanent Address Same as Current Address"
                labelHi="सध्याचा पत्ता आणि कायमचा पत्ता समान आहे का"
                value={permanentAddress.sameAsCurrent}
                onChange={(v) => !isView && setPermanentAddress((p) => ({ ...p, sameAsCurrent: v }))}
              />
            )}
            {!permanentAddress.sameAsCurrent && (
              <div className={`${grid4} mt-4`}>
                {(["address1", "address2", "address3"] as const).map((key, i) => (
                  <FieldShell key={key} label={`Address ${i + 1}`} labelHi={`पत्ता ${i + 1}`} required={i < 2}>
                    <TextInput icon={<Home size={16} />} value={permanentAddress[key]} onChange={(v) => !isView && setPermanentAddress((p) => ({ ...p, [key]: v }))} placeholder={`Enter Address ${i + 1}`} readOnly={isView} />
                  </FieldShell>
                ))}
                <FieldShell label="Zip" labelHi="पिन कोड" required>
                  <TextInput icon={<Hash size={16} />} value={permanentAddress.zip} onChange={(v) => !isView && setPermanentAddress((p) => ({ ...p, zip: v }))} placeholder="Enter Pin Code" readOnly={isView} />
                </FieldShell>
                <FieldShell label="City" labelHi="शहरे" required>
                  <SelectInput icon={<Building2 size={16} />} value={permanentAddress.city} onChange={(v) => !isView && setPermanentAddress((p) => ({ ...p, city: v }))} options={ViewEditCM_CITIES} placeholder="Select City" />
                </FieldShell>
                <FieldShell label="State" labelHi="राज्य" required>
                  <SelectInput icon={<Building2 size={16} />} value={permanentAddress.state} onChange={(v) => !isView && setPermanentAddress((p) => ({ ...p, state: v }))} options={ViewEditCM_STATES} placeholder="Select State" />
                </FieldShell>
                <CountryPicklistField label="Country" labelHi="देश" required icon={<Flag size={16} />} value={permanentAddress.country} readOnly={isView} onSelect={(c) => !isView && setPermanentAddress((p) => ({ ...p, country: c.name }))} />
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
            {!isView && (
              <RadioYesNo
                label="Is Office Address Same as Residential Address"
                labelHi="कार्यालयाचा पत्ता आणि राहण्याचा पत्ता समान आहे का"
                value={officeAddress.sameAsResidential}
                onChange={(v) => !isView && setOfficeAddress((p) => ({ ...p, sameAsResidential: v }))}
              />
            )}
            {!officeAddress.sameAsResidential && (
              <div className={`${grid4} mt-4`}>
                {(["address1", "address2", "address3"] as const).map((key, i) => (
                  <FieldShell key={key} label={`Address ${i + 1}`} labelHi={`पत्ता ${i + 1}`} required={i < 2}>
                    <TextInput icon={<Home size={16} />} value={officeAddress[key]} onChange={(v) => !isView && setOfficeAddress((p) => ({ ...p, [key]: v }))} placeholder={`Enter Address ${i + 1}`} readOnly={isView} />
                  </FieldShell>
                ))}
                <FieldShell label="Zip" labelHi="पिन कोड" required>
                  <TextInput icon={<Hash size={16} />} value={officeAddress.zip} onChange={(v) => !isView && setOfficeAddress((p) => ({ ...p, zip: v }))} placeholder="Enter Pin Code" readOnly={isView} />
                </FieldShell>
                <FieldShell label="City" labelHi="शहरे" required>
                  <SelectInput icon={<Building2 size={16} />} value={officeAddress.city} onChange={(v) => !isView && setOfficeAddress((p) => ({ ...p, city: v }))} options={ViewEditCM_CITIES} placeholder="Select City" />
                </FieldShell>
                <FieldShell label="State" labelHi="राज्य" required>
                  <SelectInput icon={<Building2 size={16} />} value={officeAddress.state} onChange={(v) => !isView && setOfficeAddress((p) => ({ ...p, state: v }))} options={ViewEditCM_STATES} placeholder="Select State" />
                </FieldShell>
                <CountryPicklistField label="Country" labelHi="देश" required icon={<Flag size={16} />} value={officeAddress.country} readOnly={isView} onSelect={(c) => !isView && setOfficeAddress((p) => ({ ...p, country: c.name }))} />
              </div>
            )}
          </SectionCard>
        </>
      )}

      {/* ── KYC ── */}
      {activeTab === "KYC" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard titleEn="Savings Account (ID Proof)" titleHi="प्रोफाइल तपशील" icon={<User size={16} />}>
            {ViewEditCM_ID_PROOF_DOCS.map((doc) => (
              <DocumentRow
                key={doc}
                label={doc}
                checked={idProofDocs[doc].checked}
                expiryDate={idProofDocs[doc].expiryDate}
                documentNumber={idProofDocs[doc].documentNumber}
                onCheck={(v) => !isView && updateDoc(setIdProofDocs, doc, { checked: v })}
                onExpiryChange={(v) => !isView && updateDoc(setIdProofDocs, doc, { expiryDate: v })}
                onDocNumberChange={(v) => !isView && updateDoc(setIdProofDocs, doc, { documentNumber: v })}
              />
            ))}
          </SectionCard>

          <SectionCard titleEn="Savings Account(Address Proof)" titleHi="प्रोफाइल तपशील" icon={<User size={16} />}>
            {ViewEditCM_ADDRESS_PROOF_DOCS.map((doc) => (
              <DocumentRow
                key={doc}
                label={doc}
                checked={addressProofDocs[doc].checked}
                expiryDate={addressProofDocs[doc].expiryDate}
                documentNumber={addressProofDocs[doc].documentNumber}
                onCheck={(v) => !isView && updateDoc(setAddressProofDocs, doc, { checked: v })}
                onExpiryChange={(v) => !isView && updateDoc(setAddressProofDocs, doc, { expiryDate: v })}
                onDocNumberChange={(v) => !isView && updateDoc(setAddressProofDocs, doc, { documentNumber: v })}
              />
            ))}
          </SectionCard>

          <SectionCard titleEn="Partnership Firms" titleHi="प्रोफाइल तपशील" icon={<User size={16} />}>
            {ViewEditCM_PARTNERSHIP_DOCS.map((doc) => (
              <DocumentRow
                key={doc}
                label={doc}
                checked={partnershipDocs[doc].checked}
                expiryDate={partnershipDocs[doc].expiryDate}
                documentNumber={partnershipDocs[doc].documentNumber}
                onCheck={(v) => !isView && updateDoc(setPartnershipDocs, doc, { checked: v })}
                onExpiryChange={(v) => !isView && updateDoc(setPartnershipDocs, doc, { expiryDate: v })}
                onDocNumberChange={(v) => !isView && updateDoc(setPartnershipDocs, doc, { documentNumber: v })}
                showDocNumber={false}
              />
            ))}
          </SectionCard>

          <SectionCard titleEn="Business Concern" titleHi="प्रोफाइल तपशील" icon={<User size={16} />}>
            {ViewEditCM_BUSINESS_DOCS.map((doc) => (
              <DocumentRow
                key={doc}
                label={doc}
                checked={businessDocs[doc].checked}
                expiryDate={businessDocs[doc].expiryDate}
                documentNumber={businessDocs[doc].documentNumber}
                onCheck={(v) => !isView && updateDoc(setBusinessDocs, doc, { checked: v })}
                onExpiryChange={(v) => !isView && updateDoc(setBusinessDocs, doc, { expiryDate: v })}
                onDocNumberChange={(v) => !isView && updateDoc(setBusinessDocs, doc, { documentNumber: v })}
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
                  onChange={(v) => !isView && setProfile((p) => ({ ...p, [key]: v }))}
                  placeholder={placeholder}
                  readOnly={isView}
                />
              </FieldShell>
            ))}
          </div>
        </SectionCard>
      )}

      {/* View mode: custom footer with Cancel + Next only */}
      {isView && viewFooter}
    </FormModal>
  );
};


/* ===== from CustomerMasterPage.tsx ===== */
interface CustomerRow {
  customerId: string;
  name: string;
  phone: string;
  email: string;
}

const CustomerMasterPage = () => {
  const { t, en } = useBilingual();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CustomerRow | null>(null);
  const [viewMode, setViewMode] = useState<"view" | "edit" | null>(null);
  const [selectedCustomerRow, setSelectedCustomerRow] = useState<TableCM_RowData | null>(null);

  const [openEditMobile, setOpenEditMobile] = useState(false);
  const [openEditEmail, setOpenEditEmail] = useState(false);
  const [openBankingServices, setOpenBankingServices] = useState(false);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>(defaultValues);

  const handleResetFilters = () => {
    setFilters(defaultValues);
  };

  const handleView = (row: TableCM_RowData) => {
    setSelectedCustomerRow(row);
    setViewMode("view");
  };

  const handleEdit = (row: TableCM_RowData) => {
    setSelectedCustomerRow(row);
    setViewMode("edit");
  };

  const handleEditPhone = (row: CustomerRow) => {
    setSelectedRow(row);
    setOpenEditMobile(true);
  };

  const handleEditEmail = (row: CustomerRow) => {
    setSelectedRow(row);
    setOpenEditEmail(true);
  };

  const handleServices = (row: CustomerRow) => {
    setSelectedRow(row);
    setOpenBankingServices(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] relative dark:bg-slate-950">
      <NavbarCM
        titleEn={en("customerMaster.title")}
        titleHi={t("customerMaster.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("customerMaster.breadcrumb"), href: "/" },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
        isSearchVisible={isSearchVisible}
        filters={filters}
        onToggleSearch={() => setIsSearchVisible((prev) => !prev)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onResetFilters={handleResetFilters}
      />

      <div className="px-3 py-2">
        <TableCM
          filters={filters}
          onView={handleView}
          onEdit={handleEdit}
          onServices={handleServices}
          onEditPhone={handleEditPhone}
          onEditEmail={handleEditEmail}
        />
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              onClose={() => setIsFilterOpen(false)}
              onApply={(newFilters) => setFilters(newFilters)}
              initialValues={filters}
            />
          </div>
        </div>
      )}

      {openAddModal && <AddCM onClose={() => setOpenAddModal(false)} />}

      {openEditMobile && selectedRow && (
        <EditMobileModal
          isOpen={openEditMobile}
          onClose={() => setOpenEditMobile(false)}
          onSubmit={(mobile) => {
            // call your update API here
            setOpenEditMobile(false);
          }}
          customerId={selectedRow.customerId}
          customerName={selectedRow.name}
          currentMobile={selectedRow.phone}
        />
      )}

      {openEditEmail && selectedRow && (
        <EditEmailModal
          isOpen={openEditEmail}
          onClose={() => setOpenEditEmail(false)}
          onSubmit={(email) => {
            // call your update API here
            setOpenEditEmail(false);
          }}
          customerId={selectedRow.customerId}
          customerName={selectedRow.name}
          currentEmail={selectedRow.email}
        />
      )}

      {openBankingServices && selectedRow && (
        <BankingServices
          onClose={() => setOpenBankingServices(false)}
          customerId={selectedRow.customerId}
          customerName={selectedRow.name}
        />
      )}

      {viewMode && selectedCustomerRow && (
        <ViewEditCM
          mode={viewMode}
          customerData={selectedCustomerRow}
          onClose={() => setViewMode(null)}
        />
      )}
    </div>
  );
};

export default CustomerMasterPage;
