import { useMemo, useState, useRef } from "react";
import CityPicklistField from "@/components/common/CityPicklistField";
import RowActionMenu from "@/components/shared/RowActionMenu";
import StatusPill from "@/components/shared/StatusPill";
import { ArrowUpDown, ChevronUp, ChevronDown, Eye, Edit, User, IdCard, Heart, Phone, Mail, Home, MapPin, Hash, Building2, BookOpen, Award, Flag, IndianRupee, FileText, Briefcase, Upload, CheckCircle2, Clock } from "lucide-react";
import { toast } from "react-toastify";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SelectInput, DateInput, RadioYesNo, SectionCard, LookupButton } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import FilterModal, { defaultValues, type CustomerFilters } from "@/components/CustomerMaster/FilterModal";
import { useRouter } from "@/lib/navigation";

/* ===== from PayrollTable.tsx ===== */
export type PayrollTable_PayrollRow = {
  id: number;
  employeeId: string;
  employeeName: string;
  employmentType: string;
  designation: string;
  gender: string;
  status: string;
}

type PayrollTable_SortDirection = 'asc' | 'desc'
type PayrollTable_SortConfig = { key: Exclude<keyof PayrollTable_PayrollRow, 'id'>; direction: PayrollTable_SortDirection } | null

type PayrollTable_PayrollTableProps = {
  rows: PayrollTable_PayrollRow[];
  onView?: (row: PayrollTable_PayrollRow) => void;
  onEdit?: (row: PayrollTable_PayrollRow) => void;
}

function PayrollTable({ rows, onView, onEdit }: PayrollTable_PayrollTableProps) {
  const [sortConfig, setSortConfig] = useState<PayrollTable_SortConfig>(null)

  const sorted = useMemo(() => {
    if (!sortConfig) return rows
    const { key, direction } = sortConfig
    return [...rows].sort((a, b) => {
      const aVal = String(a[key] ?? '').toLowerCase()
      const bVal = String(b[key] ?? '').toLowerCase()
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [rows, sortConfig])

  function handleSort(key: Exclude<keyof PayrollTable_PayrollRow, 'id'>) {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }

  const columns: { key: Exclude<keyof PayrollTable_PayrollRow, 'id'>; label: string }[] = [
    { key: 'status', label: 'Status' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'employmentType', label: 'Employment Type' },
    { key: 'designation', label: 'Designation' },
    { key: 'gender', label: 'Gender' },
  ]

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Sr No.</th>
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Actions</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {sortConfig?.key === col.key ? (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">No records found</td>
              </tr>
            ) : (
              sorted.map((row, index) => (
                <tr key={row.id} className="bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 align-middle">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 rounded-md text-primary-700 text-sm font-medium dark:bg-indigo-900/30">{index + 1}</span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <RowActionMenu
                      menuWidth={180}
                      triggerClassName="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-400"
                      items={[
                        { key: 'view', label: 'View', icon: Eye, onClick: () => onView?.(row) ?? console.log('view', row) },
                        { key: 'edit', label: 'Edit', icon: Edit, onClick: () => onEdit?.(row) ?? console.log('edit', row) },
                      ]}
                    />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">
                    <StatusPill label={row.status} tone={row.status === 'Active' ? 'success' : row.status === 'Inactive' ? 'rejected' : 'neutral'} />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.employeeId}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.employeeName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.employmentType}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.designation}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap dark:text-slate-100">{row.gender}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


/* ===== from AddEmployee.tsx ===== */
const AddEmployee_TABS = [
  "Personal Details",
  "Educational & person",
  "Employees Detail",
  "Salary & Service",
  "Identification No",
  "Payroll & Benifits",
  "Document",
] as const;

type AddEmployee_TabKey = (typeof AddEmployee_TABS)[number];

const AddEmployee_SALUTATIONS = ["Mr", "Mrs", "Ms", "Dr"];
const AddEmployee_GENDERS = ["Male", "Female", "Other"];
const AddEmployee_BRANCHES = ["Main Branch", "City Branch", "Rural Branch"];
const AddEmployee_EMPLOYMENT_TYPES = ["Permanent", "Contract", "Temporary", "Probation"];
const AddEmployee_EMP_STATUS = ["Active", "Inactive"];
const AddEmployee_CAST_OPTIONS = ["Open", "OBC", "SC", "ST", "NT"];
const AddEmployee_MARITAL_STATUS = ["Married", "UnMarried", "Divorced", "Widowed"];

const AddEmployee_DOCUMENT_LIST = [
  "Marksheet",
  "Birth Proof",
  "Join Report",
  "Oath Of Secrecy",
  "Residence Proof",
  "Additional Qualification",
];

type AddEmployee_DocRow = { name: string; required: boolean; status: "Pending" | "Uploaded"; fileName?: string };

export type AddEmployee_NewEmployeeData = PayrollTable_PayrollRow;

export interface AddEmployee_AddEmployeeProps {
  onClose: () => void;
  onSave?: (data: AddEmployee_NewEmployeeData) => void;
  nextEmployeeId?: string;
}

const AddEmployee = ({ onClose, onSave, nextEmployeeId = "" }: AddEmployee_AddEmployeeProps) => {
  const [activeTab, setActiveTab] = useState<AddEmployee_TabKey>("Personal Details");
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const [personal, setPersonal] = useState({
    employeeId: nextEmployeeId,
    salutation: "Mr",
    employeeName: "",
    fatherHusband: "",
    birthDate: "",
    gender: "",
    maritalStatus: "Married",
    spouse: "",
    relationWithSpouse: "",
    emailId: "",
    phoneNo1: "",
    phoneNo2: "",
    address1: "",
    address2: "",
    pincode: "",
    city: "",
    taluka: "",
    district: "",
  });
  const [personalErrors, setPersonalErrors] = useState<Record<string, boolean>>({});

  const [education, setEducation] = useState({
    education: "",
    graduateDate: "",
    additionalSkill: "",
    religion: "",
    cast: "",
    isHandicap: false,
  });
  const [educationErrors, setEducationErrors] = useState<Record<string, boolean>>({});

  const [employment, setEmployment] = useState({
    employmentType: "",
    designation: "",
    department: "",
    dateOfJoining: "",
    status: "Active",
  });
  const [employmentErrors, setEmploymentErrors] = useState<Record<string, boolean>>({});

  const [salary, setSalary] = useState({
    currentBasicSalary: "",
    salaryBranch: "",
    otherAllowance: "",
    cashSecurity: "",
    confirmationNo: "",
    confirmDate: "",
    lastIncrementDate: "",
    nextIncrementDate: "",
    lastIncrementAmount: "",
    lfcNo: "",
    lfcFrom: "",
    licIdMaster: "",
  });
  const [salaryErrors, setSalaryErrors] = useState<Record<string, boolean>>({});

  const [identification, setIdentification] = useState({
    panNo: "",
    pfNumber: "",
    epsNo: "",
    uanNo: "",
    lwpNo: "",
    fileNo: "",
    sequenceNo: "",
    salaryBranch: "",
  });
  const [identificationErrors, setIdentificationErrors] = useState<Record<string, boolean>>({});

  const [benefits, setBenefits] = useState({
    pfDeduction: true,
    isLwp: true,
    spatialAllowance: "",
  });
  const [benefitsErrors, setBenefitsErrors] = useState<Record<string, boolean>>({});

  const [documents, setDocuments] = useState<AddEmployee_DocRow[]>(
    AddEmployee_DOCUMENT_LIST.map((name) => ({ name, required: true, status: "Pending" }))
  );

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const validatePersonal = () => {
    const e = {
      employeeId: !personal.employeeId.trim(),
      employeeName: !personal.employeeName.trim(),
      fatherHusband: !personal.fatherHusband.trim(),
      birthDate: !personal.birthDate.trim(),
      gender: !personal.gender.trim(),
      spouse: !personal.spouse.trim(),
      relationWithSpouse: !personal.relationWithSpouse.trim(),
      emailId: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.emailId.trim()),
      phoneNo1: !/^\d{10}$/.test(personal.phoneNo1.trim()),
      phoneNo2: !/^\d{10}$/.test(personal.phoneNo2.trim()),
      address1: !personal.address1.trim(),
      address2: !personal.address2.trim(),
      pincode: !/^\d{6}$/.test(personal.pincode.trim()),
      city: !personal.city.trim(),
      taluka: !personal.taluka.trim(),
      district: !personal.district.trim(),
    };
    setPersonalErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const validateEducation = () => {
    const e = {
      education: !education.education.trim(),
      graduateDate: !education.graduateDate.trim(),
      additionalSkill: !education.additionalSkill.trim(),
      religion: !education.religion.trim(),
      cast: !education.cast.trim(),
    };
    setEducationErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const validateEmployment = () => {
    const e = {
      employmentType: !employment.employmentType.trim(),
      designation: !employment.designation.trim(),
      department: !employment.department.trim(),
      dateOfJoining: !employment.dateOfJoining.trim(),
    };
    setEmploymentErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const validateSalary = () => {
    const e = {
      currentBasicSalary: !salary.currentBasicSalary.trim(),
      salaryBranch: !salary.salaryBranch.trim(),
      otherAllowance: !salary.otherAllowance.trim(),
      cashSecurity: !salary.cashSecurity.trim(),
      confirmationNo: !salary.confirmationNo.trim(),
      confirmDate: !salary.confirmDate.trim(),
      lastIncrementDate: !salary.lastIncrementDate.trim(),
      nextIncrementDate: !salary.nextIncrementDate.trim(),
      lastIncrementAmount: !salary.lastIncrementAmount.trim(),
      lfcNo: !salary.lfcNo.trim(),
      lfcFrom: !salary.lfcFrom.trim(),
      licIdMaster: !salary.licIdMaster.trim(),
    };
    setSalaryErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const validateIdentification = () => {
    const e = {
      panNo: !identification.panNo.trim(),
      pfNumber: !identification.pfNumber.trim(),
      epsNo: !identification.epsNo.trim(),
      uanNo: !identification.uanNo.trim(),
      lwpNo: !identification.lwpNo.trim(),
      fileNo: !identification.fileNo.trim(),
      sequenceNo: !identification.sequenceNo.trim(),
      salaryBranch: !identification.salaryBranch.trim(),
    };
    setIdentificationErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const validateBenefits = () => {
    const e = { spatialAllowance: !benefits.spatialAllowance.trim() };
    setBenefitsErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const validateDocuments = () => {
    const missing = documents.some((d) => d.required && d.status !== "Uploaded");
    if (missing) toast.error("Please upload all required documents before saving.");
    return !missing;
  };

  const VALIDATORS: Record<AddEmployee_TabKey, () => boolean> = {
    "Personal Details": validatePersonal,
    "Educational & person": validateEducation,
    "Employees Detail": validateEmployment,
    "Salary & Service": validateSalary,
    "Identification No": validateIdentification,
    "Payroll & Benifits": validateBenefits,
    Document: validateDocuments,
  };

  const handleValidate = () => {
    const isValid = VALIDATORS[activeTab]();
    if (isValid) toast.success(`${activeTab} validated successfully.`);
    else toast.error("Please fill all required fields correctly.");
  };

  const handleNext = () => {
    const isValid = VALIDATORS[activeTab]();
    if (!isValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }
    const idx = AddEmployee_TABS.indexOf(activeTab);
    if (idx < AddEmployee_TABS.length - 1) setActiveTab(AddEmployee_TABS[idx + 1]);
  };

  const handleSave = () => {
    for (const tab of AddEmployee_TABS) {
      if (!VALIDATORS[tab]()) {
        setActiveTab(tab);
        toast.error(`Please complete the "${tab}" tab before saving.`);
        return;
      }
    }
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    onSave?.({
      id: Date.now(),
      employeeId: personal.employeeId,
      employeeName: personal.employeeName,
      employmentType: employment.employmentType,
      designation: employment.designation,
      gender: personal.gender,
      status: employment.status,
    });
    setShowSuccess(false);
    onClose();
  };

  const handlePickFile = (docName: string) => {
    fileInputs.current[docName]?.click();
  };

  const handleFileSelected = (docName: string, file: File | null) => {
    if (!file) return;
    setDocuments((rows) =>
      rows.map((r) => (r.name === docName ? { ...r, status: "Uploaded", fileName: file.name } : r))
    );
    toast.success(`${docName} uploaded successfully.`);
  };

  const isLastTab = activeTab === AddEmployee_TABS[AddEmployee_TABS.length - 1];

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        title="Employee Added Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Add Employee"
      titleHi="कर्मचारी जोडा"
      subtitleEn="All Information's are related to Interest Payment Mark"
      subtitleHi="सर्व माहिती व्याज भरण्याच्या मार्कशी संबंधित आहे"
      tabs={[...AddEmployee_TABS]}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as AddEmployee_TabKey)}
      onValidate={handleValidate}
      onNext={handleNext}
      onSave={handleSave}
      isLastTab={isLastTab}
    >
      {activeTab === "Personal Details" && (
        <SectionCard
          titleEn="Personal Details"
          titleHi="वैयक्तिक माहिती"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={<User size={16} />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Employee ID" labelHi="कर्मचारी आयडी" required error={personalErrors.employeeId}>
              <TextInput
                icon={<IdCard size={16} />}
                value={personal.employeeId}
                onChange={(v) => setPersonal((p) => ({ ...p, employeeId: v }))}
                placeholder="Employee ID"
                error={personalErrors.employeeId}
              />
            </FieldShell>
            <FieldShell label="Employee Name" labelHi="कर्मचाऱ्याचे नाव" required error={personalErrors.employeeName}>
              <div className="flex items-center gap-2">
                <div className="w-24 shrink-0">
                  <SelectInput
                    value={personal.salutation}
                    onChange={(v) => setPersonal((p) => ({ ...p, salutation: v }))}
                    options={AddEmployee_SALUTATIONS}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <TextInput
                    value={personal.employeeName}
                    onChange={(v) => setPersonal((p) => ({ ...p, employeeName: v }))}
                    placeholder="Enter Employee Name"
                    error={personalErrors.employeeName}
                  />
                </div>
              </div>
            </FieldShell>
            <FieldShell label="Father / Husband" labelHi="वडील / पती" required error={personalErrors.fatherHusband}>
              <TextInput
                icon={<User size={16} />}
                value={personal.fatherHusband}
                onChange={(v) => setPersonal((p) => ({ ...p, fatherHusband: v }))}
                placeholder="Enter Father / Husband Name"
                error={personalErrors.fatherHusband}
              />
            </FieldShell>
            <FieldShell label="Birth Date" labelHi="जन्मतारीख" required error={personalErrors.birthDate}>
              <DateInput
                value={personal.birthDate}
                onChange={(v) => setPersonal((p) => ({ ...p, birthDate: v }))}
                error={personalErrors.birthDate}
              />
            </FieldShell>

            <FieldShell label="Gender" labelHi="लिंग" required error={personalErrors.gender}>
              <SelectInput
                icon={<User size={16} />}
                value={personal.gender}
                onChange={(v) => setPersonal((p) => ({ ...p, gender: v }))}
                options={AddEmployee_GENDERS}
                placeholder="Select Gender"
                error={personalErrors.gender}
              />
            </FieldShell>
            <FieldShell label="Marital Status" labelHi="वैवाहिक स्थिती">
              <SelectInput
                value={personal.maritalStatus}
                onChange={(v) => setPersonal((p) => ({ ...p, maritalStatus: v }))}
                options={AddEmployee_MARITAL_STATUS}
              />
            </FieldShell>
            <FieldShell label="Spouse" labelHi="जोडीदार" required error={personalErrors.spouse}>
              <TextInput
                icon={<Heart size={16} />}
                value={personal.spouse}
                onChange={(v) => setPersonal((p) => ({ ...p, spouse: v }))}
                placeholder="Enter Spouse Name"
                error={personalErrors.spouse}
              />
            </FieldShell>
            <FieldShell label="Relation with Spouse" labelHi="जोडीदाराशी नाते" required error={personalErrors.relationWithSpouse}>
              <TextInput
                icon={<Heart size={16} />}
                value={personal.relationWithSpouse}
                onChange={(v) => setPersonal((p) => ({ ...p, relationWithSpouse: v }))}
                placeholder="Enter Relation with Spouse"
                error={personalErrors.relationWithSpouse}
              />
            </FieldShell>

            <FieldShell label="Email ID" labelHi="ईमेल आयडी" required error={personalErrors.emailId}>
              <TextInput
                icon={<Mail size={16} />}
                value={personal.emailId}
                onChange={(v) => setPersonal((p) => ({ ...p, emailId: v }))}
                placeholder="Email ID"
                error={personalErrors.emailId}
              />
            </FieldShell>
            <FieldShell label="Phone No" labelHi="फोन नंबर" required error={personalErrors.phoneNo1}>
              <TextInput
                icon={<Phone size={16} />}
                value={personal.phoneNo1}
                onChange={(v) => setPersonal((p) => ({ ...p, phoneNo1: v }))}
                placeholder="Phone No"
                error={personalErrors.phoneNo1}
              />
            </FieldShell>
            <FieldShell label="Phone No" labelHi="फोन नंबर" required error={personalErrors.phoneNo2}>
              <TextInput
                icon={<Phone size={16} />}
                value={personal.phoneNo2}
                onChange={(v) => setPersonal((p) => ({ ...p, phoneNo2: v }))}
                placeholder="Phone No"
                error={personalErrors.phoneNo2}
              />
            </FieldShell>
            <FieldShell label="Address 1" labelHi="पत्ता १" required error={personalErrors.address1}>
              <TextInput
                icon={<Home size={16} />}
                value={personal.address1}
                onChange={(v) => setPersonal((p) => ({ ...p, address1: v }))}
                placeholder="Enter Address 1"
                error={personalErrors.address1}
              />
            </FieldShell>

            <FieldShell label="Address 2" labelHi="पत्ता २" required error={personalErrors.address2}>
              <TextInput
                icon={<Home size={16} />}
                value={personal.address2}
                onChange={(v) => setPersonal((p) => ({ ...p, address2: v }))}
                placeholder="Enter Address 2"
                error={personalErrors.address2}
              />
            </FieldShell>
            <FieldShell label="Pin code" labelHi="पिन कोड" required error={personalErrors.pincode}>
              <TextInput
                icon={<Hash size={16} />}
                value={personal.pincode}
                onChange={(v) => setPersonal((p) => ({ ...p, pincode: v.replace(/\D/g, "") }))}
                placeholder="Enter Pin Code"
                error={personalErrors.pincode}
              />
            </FieldShell>
            <CityPicklistField label="City" labelHi="शहर" required icon={<Building2 size={16} />} value={personal.city} onSelect={(city) => setPersonal((p) => ({ ...p, city: city.name }))} error={personalErrors.city ? "This field is required" : undefined} />
            <FieldShell label="Taluka" labelHi="तालुका" required error={personalErrors.taluka}>
              <TextInput
                icon={<MapPin size={16} />}
                value={personal.taluka}
                onChange={(v) => setPersonal((p) => ({ ...p, taluka: v }))}
                placeholder="Enter Taluka"
                error={personalErrors.taluka}
              />
            </FieldShell>

            <FieldShell label="District" labelHi="जिल्हा" required error={personalErrors.district}>
              <TextInput
                icon={<MapPin size={16} />}
                value={personal.district}
                onChange={(v) => setPersonal((p) => ({ ...p, district: v }))}
                placeholder="Enter District"
                error={personalErrors.district}
              />
            </FieldShell>
          </div>
        </SectionCard>
      )}

      {activeTab === "Educational & person" && (
        <SectionCard
          titleEn="Educational & Personal"
          titleHi="शैक्षणिक आणि वैयक्तिक"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={<User size={16} />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Education" labelHi="शिक्षण" required error={educationErrors.education}>
              <TextInput
                icon={<BookOpen size={16} />}
                value={education.education}
                onChange={(v) => setEducation((p) => ({ ...p, education: v }))}
                placeholder="Education"
                error={educationErrors.education}
              />
            </FieldShell>
            <FieldShell label="Graduate" labelHi="पदवी वर्ष" required error={educationErrors.graduateDate}>
              <DateInput
                value={education.graduateDate}
                onChange={(v) => setEducation((p) => ({ ...p, graduateDate: v }))}
                error={educationErrors.graduateDate}
              />
            </FieldShell>
            <FieldShell label="Additional Skill" labelHi="अतिरिक्त कौशल्य" required error={educationErrors.additionalSkill}>
              <TextInput
                icon={<Award size={16} />}
                value={education.additionalSkill}
                onChange={(v) => setEducation((p) => ({ ...p, additionalSkill: v }))}
                placeholder="Additional Skill"
                error={educationErrors.additionalSkill}
              />
            </FieldShell>
            <FieldShell label="Religion" labelHi="धर्म" required error={educationErrors.religion}>
              <TextInput
                icon={<Flag size={16} />}
                value={education.religion}
                onChange={(v) => setEducation((p) => ({ ...p, religion: v }))}
                placeholder="Religion"
                error={educationErrors.religion}
              />
            </FieldShell>

            <FieldShell label="Cast" labelHi="जात" required error={educationErrors.cast}>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <TextInput
                    value={education.cast}
                    onChange={(v) => setEducation((p) => ({ ...p, cast: v }))}
                    placeholder="Cast"
                    error={educationErrors.cast}
                  />
                </div>
                <LookupButton
                  items={AddEmployee_CAST_OPTIONS}
                  onPick={(v) => setEducation((p) => ({ ...p, cast: v }))}
                />
              </div>
            </FieldShell>
            <RadioYesNo
              label="Is Handicap"
              labelHi="अपंग आहे का"
              value={education.isHandicap}
              onChange={(v) => setEducation((p) => ({ ...p, isHandicap: v }))}
            />
          </div>
        </SectionCard>
      )}

      {activeTab === "Employees Detail" && (
        <SectionCard
          titleEn="Employees Detail"
          titleHi="कर्मचारी तपशील"
          subtitleEn="Manage employee's job and department information."
          subtitleHi="कर्मचाऱ्याची नोकरी व विभाग संबंधित माहिती व्यवस्थापित करा."
          icon={<Briefcase size={16} />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Employment Type" labelHi="नोकरीचा प्रकार" required error={employmentErrors.employmentType}>
              <SelectInput
                icon={<Briefcase size={16} />}
                value={employment.employmentType}
                onChange={(v) => setEmployment((p) => ({ ...p, employmentType: v }))}
                options={AddEmployee_EMPLOYMENT_TYPES}
                placeholder="Select Employment Type"
                error={employmentErrors.employmentType}
              />
            </FieldShell>
            <FieldShell label="Designation" labelHi="पदनाम" required error={employmentErrors.designation}>
              <TextInput
                icon={<IdCard size={16} />}
                value={employment.designation}
                onChange={(v) => setEmployment((p) => ({ ...p, designation: v }))}
                placeholder="Enter Designation"
                error={employmentErrors.designation}
              />
            </FieldShell>
            <FieldShell label="Department" labelHi="विभाग" required error={employmentErrors.department}>
              <TextInput
                icon={<Building2 size={16} />}
                value={employment.department}
                onChange={(v) => setEmployment((p) => ({ ...p, department: v }))}
                placeholder="Enter Department"
                error={employmentErrors.department}
              />
            </FieldShell>
            <FieldShell label="Date of Joining" labelHi="रुजू तारीख" required error={employmentErrors.dateOfJoining}>
              <DateInput
                value={employment.dateOfJoining}
                onChange={(v) => setEmployment((p) => ({ ...p, dateOfJoining: v }))}
                error={employmentErrors.dateOfJoining}
              />
            </FieldShell>
            <FieldShell label="Employee Status" labelHi="कर्मचारी स्थिती" required>
              <SelectInput
                value={employment.status}
                onChange={(v) => setEmployment((p) => ({ ...p, status: v }))}
                options={AddEmployee_EMP_STATUS}
              />
            </FieldShell>
          </div>
        </SectionCard>
      )}

      {activeTab === "Salary & Service" && (
        <SectionCard
          titleEn="Salary & Service"
          titleHi="पगार आणि सेवा"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={<User size={16} />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Current Basic Salary" labelHi="सध्याचा मूळ पगार" required error={salaryErrors.currentBasicSalary}>
              <TextInput
                icon={<IndianRupee size={16} />}
                value={salary.currentBasicSalary}
                onChange={(v) => setSalary((p) => ({ ...p, currentBasicSalary: v }))}
                placeholder="Current Basic Salary"
                error={salaryErrors.currentBasicSalary}
              />
            </FieldShell>
            <FieldShell label="Salary Branch" labelHi="पगार शाखा" required error={salaryErrors.salaryBranch}>
              <SelectInput
                icon={<Building2 size={16} />}
                value={salary.salaryBranch}
                onChange={(v) => setSalary((p) => ({ ...p, salaryBranch: v }))}
                options={AddEmployee_BRANCHES}
                placeholder="Salary Branch"
                error={salaryErrors.salaryBranch}
              />
            </FieldShell>
            <FieldShell label="Other Allowence" labelHi="इतर भत्ता" required error={salaryErrors.otherAllowance}>
              <TextInput
                icon={<IndianRupee size={16} />}
                value={salary.otherAllowance}
                onChange={(v) => setSalary((p) => ({ ...p, otherAllowance: v }))}
                placeholder="Other Allowence"
                error={salaryErrors.otherAllowance}
              />
            </FieldShell>
            <FieldShell label="Cash Security" labelHi="रोख सुरक्षा" required error={salaryErrors.cashSecurity}>
              <TextInput
                icon={<IndianRupee size={16} />}
                value={salary.cashSecurity}
                onChange={(v) => setSalary((p) => ({ ...p, cashSecurity: v }))}
                placeholder="Cash Security"
                error={salaryErrors.cashSecurity}
              />
            </FieldShell>

            <FieldShell label="Confirmation No" labelHi="पुष्टीकरण क्रमांक" required error={salaryErrors.confirmationNo}>
              <TextInput
                icon={<IdCard size={16} />}
                value={salary.confirmationNo}
                onChange={(v) => setSalary((p) => ({ ...p, confirmationNo: v }))}
                placeholder="Confirmation No"
                error={salaryErrors.confirmationNo}
              />
            </FieldShell>
            <FieldShell label="Confirm Date" labelHi="पुष्टीकरण तारीख" required error={salaryErrors.confirmDate}>
              <DateInput
                value={salary.confirmDate}
                onChange={(v) => setSalary((p) => ({ ...p, confirmDate: v }))}
                error={salaryErrors.confirmDate}
              />
            </FieldShell>
            <FieldShell label="Last Increment Date" labelHi="मागील वाढ तारीख" required error={salaryErrors.lastIncrementDate}>
              <DateInput
                value={salary.lastIncrementDate}
                onChange={(v) => setSalary((p) => ({ ...p, lastIncrementDate: v }))}
                error={salaryErrors.lastIncrementDate}
              />
            </FieldShell>
            <FieldShell label="Next Increment Date" labelHi="पुढील वाढ तारीख" required error={salaryErrors.nextIncrementDate}>
              <DateInput
                value={salary.nextIncrementDate}
                onChange={(v) => setSalary((p) => ({ ...p, nextIncrementDate: v }))}
                error={salaryErrors.nextIncrementDate}
              />
            </FieldShell>

            <FieldShell label="Last Increment Amount" labelHi="मागील वाढ रक्कम" required error={salaryErrors.lastIncrementAmount}>
              <TextInput
                icon={<IndianRupee size={16} />}
                value={salary.lastIncrementAmount}
                onChange={(v) => setSalary((p) => ({ ...p, lastIncrementAmount: v }))}
                placeholder="Last Increment Amount"
                error={salaryErrors.lastIncrementAmount}
              />
            </FieldShell>
            <FieldShell label="LFC No" labelHi="LFC क्रमांक" required error={salaryErrors.lfcNo}>
              <TextInput
                icon={<IdCard size={16} />}
                value={salary.lfcNo}
                onChange={(v) => setSalary((p) => ({ ...p, lfcNo: v }))}
                placeholder="LFC No"
                error={salaryErrors.lfcNo}
              />
            </FieldShell>
            <FieldShell label="LFC From" labelHi="LFC पासून" required error={salaryErrors.lfcFrom}>
              <TextInput
                icon={<FileText size={16} />}
                value={salary.lfcFrom}
                onChange={(v) => setSalary((p) => ({ ...p, lfcFrom: v }))}
                placeholder="LFC From"
                error={salaryErrors.lfcFrom}
              />
            </FieldShell>
            <FieldShell label="LIC ID Master" labelHi="LIC आयडी मास्टर" required error={salaryErrors.licIdMaster}>
              <TextInput
                icon={<IdCard size={16} />}
                value={salary.licIdMaster}
                onChange={(v) => setSalary((p) => ({ ...p, licIdMaster: v }))}
                placeholder="LIC ID Master"
                error={salaryErrors.licIdMaster}
              />
            </FieldShell>
          </div>
        </SectionCard>
      )}

      {activeTab === "Identification No" && (
        <SectionCard
          titleEn="Identification Numbers"
          titleHi="ओळख क्रमांक"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={<User size={16} />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="PAN No" labelHi="पॅन क्रमांक" required error={identificationErrors.panNo}>
              <TextInput
                icon={<IdCard size={16} />}
                value={identification.panNo}
                onChange={(v) => setIdentification((p) => ({ ...p, panNo: v }))}
                placeholder="PAN No"
                error={identificationErrors.panNo}
              />
            </FieldShell>
            <FieldShell label="PF Number" labelHi="पीएफ क्रमांक" required error={identificationErrors.pfNumber}>
              <TextInput
                icon={<IdCard size={16} />}
                value={identification.pfNumber}
                onChange={(v) => setIdentification((p) => ({ ...p, pfNumber: v }))}
                placeholder="PF Number"
                error={identificationErrors.pfNumber}
              />
            </FieldShell>
            <FieldShell label="EPS No" labelHi="ईपीएस क्रमांक" required error={identificationErrors.epsNo}>
              <TextInput
                icon={<IdCard size={16} />}
                value={identification.epsNo}
                onChange={(v) => setIdentification((p) => ({ ...p, epsNo: v }))}
                placeholder="EPS No"
                error={identificationErrors.epsNo}
              />
            </FieldShell>
            <FieldShell label="UAN No" labelHi="यूएएन क्रमांक" required error={identificationErrors.uanNo}>
              <TextInput
                icon={<IdCard size={16} />}
                value={identification.uanNo}
                onChange={(v) => setIdentification((p) => ({ ...p, uanNo: v }))}
                placeholder="UAN No"
                error={identificationErrors.uanNo}
              />
            </FieldShell>

            <FieldShell label="LWP No" labelHi="एलडब्ल्यूपी क्रमांक" required error={identificationErrors.lwpNo}>
              <TextInput
                icon={<IdCard size={16} />}
                value={identification.lwpNo}
                onChange={(v) => setIdentification((p) => ({ ...p, lwpNo: v }))}
                placeholder="LWP No"
                error={identificationErrors.lwpNo}
              />
            </FieldShell>
            <FieldShell label="File No" labelHi="फाईल क्रमांक" required error={identificationErrors.fileNo}>
              <TextInput
                icon={<FileText size={16} />}
                value={identification.fileNo}
                onChange={(v) => setIdentification((p) => ({ ...p, fileNo: v }))}
                placeholder="File No"
                error={identificationErrors.fileNo}
              />
            </FieldShell>
            <FieldShell label="Sequence No" labelHi="अनुक्रम क्रमांक" required error={identificationErrors.sequenceNo}>
              <TextInput
                icon={<Hash size={16} />}
                value={identification.sequenceNo}
                onChange={(v) => setIdentification((p) => ({ ...p, sequenceNo: v }))}
                placeholder="Sequence No"
                error={identificationErrors.sequenceNo}
              />
            </FieldShell>
            <FieldShell label="Salary Branch" labelHi="पगार शाखा" required error={identificationErrors.salaryBranch}>
              <SelectInput
                icon={<Building2 size={16} />}
                value={identification.salaryBranch}
                onChange={(v) => setIdentification((p) => ({ ...p, salaryBranch: v }))}
                options={AddEmployee_BRANCHES}
                placeholder="Branch"
                error={identificationErrors.salaryBranch}
              />
            </FieldShell>
          </div>
        </SectionCard>
      )}

      {activeTab === "Payroll & Benifits" && (
        <SectionCard
          titleEn="Payroll & Benefits"
          titleHi="पेरोल आणि फायदे"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={<User size={16} />}
        >
          <div className="mt-2 flex flex-wrap items-end gap-8">
            <RadioYesNo
              label="PF Deduction"
              value={benefits.pfDeduction}
              onChange={(v) => setBenefits((p) => ({ ...p, pfDeduction: v }))}
            />
            <RadioYesNo
              label="Is LWP"
              value={benefits.isLwp}
              onChange={(v) => setBenefits((p) => ({ ...p, isLwp: v }))}
            />
            <FieldShell
              label="Spatial Allowence"
              labelHi="स्थानिक भत्ता"
              required
              error={benefitsErrors.spatialAllowance}
              className="w-full max-w-xs"
            >
              <TextInput
                icon={<IndianRupee size={16} />}
                value={benefits.spatialAllowance}
                onChange={(v) => setBenefits((p) => ({ ...p, spatialAllowance: v }))}
                placeholder="Spatial Allowence"
                error={benefitsErrors.spatialAllowance}
              />
            </FieldShell>
          </div>
        </SectionCard>
      )}

      {activeTab === "Document" && (
        <SectionCard
          titleEn="Documentation"
          titleHi="कागदपत्रे"
          subtitleEn="Upload the required documents for this employee."
          subtitleHi="या कर्मचाऱ्यासाठी आवश्यक कागदपत्रे अपलोड करा."
          icon={<FileText size={16} />}
        >
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary-900 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Upload</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Document Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Required</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.name}>
                    <td className="px-4 py-3 align-middle">
                      <input
                        ref={(el) => {
                          fileInputs.current[doc.name] = el;
                        }}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileSelected(doc.name, e.target.files?.[0] ?? null)}
                      />
                      <button
                        type="button"
                        onClick={() => handlePickFile(doc.name)}
                        className="flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-100"
                      >
                        <Upload size={14} />
                        {doc.status === "Uploaded" ? "Re-upload" : "Upload"}
                      </button>
                    </td>
                    <td className="px-4 py-3 align-middle text-sm text-slate-700">
                      {doc.name}
                      {doc.fileName && (
                        <span className="ml-2 text-xs text-slate-400">({doc.fileName})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle text-sm text-slate-700">
                      {doc.required ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium ${
                          doc.status === "Uploaded"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                            : "border-amber-400 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {doc.status === "Uploaded" ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </FormModal>
  );
};


export { AddEmployee_TABS as EMPLOYEE_FORM_TABS };


/* ===== from PayrollMaster.tsx ===== */
const initialRows: PayrollTable_PayrollRow[] = [
  { id: 1, employeeId: "EMP001", employeeName: "Rahul Sharma", employmentType: "Permanent", designation: "Accountant", gender: "Male", status: "Active" },
  { id: 2, employeeId: "EMP002", employeeName: "Priya Singh", employmentType: "Contract", designation: "Officer", gender: "Female", status: "Active" },
  { id: 3, employeeId: "EMP003", employeeName: "Amit Verma", employmentType: "Permanent", designation: "Executive", gender: "Male", status: "Inactive" },
  { id: 4, employeeId: "EMP004", employeeName: "Sneha Patel", employmentType: "Permanent", designation: "Manager", gender: "Female", status: "Active" },
];

const PayrollMaster = () => {
  const router = useRouter();
  const [rows, setRows] = useState<PayrollTable_PayrollRow[]>(initialRows);
  const [filters, setFilters] = useState<CustomerFilters>(defaultValues);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (
          filters.customerId &&
          !row.employeeId.toLowerCase().includes(filters.customerId.toLowerCase())
        ) return false;
        if (filters.status && row.status !== filters.status) return false;
        return true;
      }),
    [filters, rows]
  );

  const nextEmployeeId = `EMP${String(rows.length + 1).padStart(3, "0")}`;

  const handleEmployeeSaved = (employee: PayrollTable_PayrollRow) => {
    setRows((currentRows) => [...currentRows, employee]);
  };

  return (
    <div className="min-h-screen app-page-bg dark:bg-slate-950">
      <NavbarCM
        titleEn="Payroll Master"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Master", href: "#" },
          { label: "Payroll Master", href: "/payroll/master" },
        ]}
        onBack={() => router.back()}
        onAdd={() => setIsAddOpen(true)}
        isSearchVisible={isSearchVisible}
        filters={filters}
        onToggleSearch={() => setIsSearchVisible(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onResetFilters={() => setFilters(defaultValues)}
      />

      <main className="p-4 sm:p-6">
        <PayrollTable rows={filteredRows} />
      </main>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setIsFilterOpen(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={setFilters}
            />
          </div>
        </div>
      )}

      {isAddOpen && (
        <AddEmployee
          onClose={() => setIsAddOpen(false)}
          onSave={handleEmployeeSaved}
          nextEmployeeId={nextEmployeeId}
        />
      )}
    </div>
  );
};

export default PayrollMaster
