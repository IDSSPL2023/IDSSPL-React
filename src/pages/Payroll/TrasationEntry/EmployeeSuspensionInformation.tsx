import { IMAGES } from "@/assets";
import { useState, useMemo } from "react";
import {
  User,
  Hash,
  FileText,
  Landmark,
  Building,
  ClipboardList,
  X,
  Check,
  ChevronRight,
} from "lucide-react";
import Image from "@/components/ui/Image";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizeHero from "@/components/Authorization/AuthorizeTransaction/AuthorizeHero";
import FormModal from "@/components/shared/FormModal";
import SuccessModal from "@/components/shared/SuccessModal";
import TextField from "@/components/common/TextField";
import SelectField from "@/components/common/SelectField";
import DateField from "@/components/common/DateField";
import PicklistField from "@/components/common/PicklistField";
import PicklistModal from "@/components/common/PicklistModal";
import { validateFields, isFormValid, required } from "@/components/common/validation";

interface EmployeeLookup {
  id: string;
  employeeNo: string;
  name: string;
  designationCode: string;
  designationName: string;
  branchCode: string;
  branchName: string;
  categoryCode: string;
  categoryName: string;
}

const MOCK_EMPLOYEES: EmployeeLookup[] = [
  {
    id: "1",
    employeeNo: "EMP001",
    name: "Rahul Sharma",
    designationCode: "MGR",
    designationName: "Manager",
    branchCode: "BR01",
    branchName: "Main Branch",
    categoryCode: "CAT01",
    categoryName: "Permanent",
  },
  {
    id: "2",
    employeeNo: "EMP002",
    name: "Priya Patel",
    designationCode: "SRD",
    designationName: "Senior Developer",
    branchCode: "BR02",
    branchName: "City Branch",
    categoryCode: "CAT02",
    categoryName: "Contract",
  },
];

interface EmployeeSuspensionModalProps {
  open: boolean;
  onClose: () => void;
}

function EmployeeSuspensionModal({ open, onClose }: EmployeeSuspensionModalProps) {
  const [employeeType, setEmployeeType] = useState("New");
  const [suspensionNo, setSuspensionNo] = useState("");
  const [employeeNo, setEmployeeNo] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [designationCode, setDesignationCode] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [education, setEducation] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [confirmationDate, setConfirmationDate] = useState("");
  const [suspensionFromDate, setSuspensionFromDate] = useState("");
  const [suspensionToDate, setSuspensionToDate] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [suspensionOrderNo, setSuspensionOrderNo] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const rules = {
    employeeType: required("Employee Type is required"),
    suspensionNo: required("Suspension No is required"),
    employeeNo: required("Employee No is required"),
    employeeName: required("Employee Name is required"),
    designationCode: required("Designation Code is required"),
    branchCode: required("Branch Code is required"),
    joinDate: required("Join Date is required"),
    confirmationDate: required("Confirmation Date is required"),
    suspensionFromDate: required("Suspension From Date is required"),
    suspensionToDate: required("Suspension To Date is required"),
    suspensionReason: required("Suspension Reason is required"),
  };

  const handleValidate = () => {
    const formValues = {
      employeeType,
      suspensionNo,
      employeeNo,
      employeeName,
      designationCode,
      branchCode,
      joinDate,
      confirmationDate,
      suspensionFromDate,
      suspensionToDate,
      suspensionReason,
    };
    const validationErrors = validateFields(formValues, rules);
    setErrors(validationErrors);
    if (isFormValid(validationErrors)) setIsValidated(true);
  };

  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4";
  const employeeTypeOptions = [
    { value: "New", label: "New" },
    { value: "Existing", label: "Existing" },
  ];
  const salaryTypeOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly" },
    { value: "Daily", label: "Daily" },
  ];
  const employeeColumns = [
    { key: "employeeNo", header: "Employee No." },
    { key: "name", header: "Employee Name" },
    { key: "designationName", header: "Designation" },
    { key: "branchName", header: "Branch Name" },
  ];

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Employee Suspension Information"
        titleHi="कर्मचारी निलंबन माहिती"
        subtitleEn="Manage employee suspension details."
        subtitleHi="कर्मचाऱ्यांची निलंबन माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Employee Suspension" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-6xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Save
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="p-1 flex flex-col gap-6">
          {/* Employee Details */}
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Image src={IMAGES.USER} alt="Employee Details" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827] dark:text-slate-100">
                  Employee Details
                  <span className="ml-2 font-normal text-[#64748B] dark:text-slate-400">/ कर्मचारी तपशील</span>
                </h3>
                <p className="mt-0.5 text-sm text-[#64748B] dark:text-slate-400">
                  Select the employee and review current employment information before processing the suspension.
                  <br />
                  निलंबन प्रक्रिया सुरू करण्यापूर्वी कर्मचाऱ्याची सद्यस्थिती माहिती तपासा.
                </p>
              </div>
            </div>

            <div className={grid4}>
              <SelectField
                label="Employee Type"
                labelHi="नोंद प्रकार"
                value={employeeType}
                onChange={setEmployeeType}
                options={employeeTypeOptions}
                placeholder="Select Type"
                required
                error={errors.employeeType}
              />

              <TextField
                label="Suspension No"
                labelHi="निलंबन क्रमांक"
                value={suspensionNo}
                onChange={setSuspensionNo}
                placeholder="Enter Amount"
                icon={<Hash size={16} />}
                required
                error={errors.suspensionNo}
              />

              <PicklistField
                label="Employee No"
                labelHi="कर्मचारी क्रमांक"
                value={employeeNo}
                onOpenPicklist={() => setIsPickerOpen(true)}
                placeholder="Enter Amount"
                required
                error={errors.employeeNo}
              />

              <TextField
                label="Employee Name"
                labelHi="कर्मचारी नाव"
                value={employeeName}
                onChange={setEmployeeName}
                placeholder="name@company.com"
                icon={<User size={16} />}
                required
                error={errors.employeeName}
              />

              <TextField
                label="Education"
                labelHi="शैक्षणिक पात्रता"
                value={education}
                onChange={setEducation}
                placeholder="name@company.com"
                icon={<ClipboardList size={16} />}
                required
              />

              <TextField
                label="Branch Code"
                labelHi="शाखा कोड"
                value={branchCode}
                onChange={setBranchCode}
                placeholder="name@company.com"
                icon={<Building size={16} />}
                readOnly
                disabled
                required
                error={errors.branchCode}
              />

              <TextField
                label="Branch Name"
                labelHi="शाखेचे नाव"
                value={branchName}
                onChange={setBranchName}
                placeholder="name@company.com"
                icon={<Building size={16} />}
                readOnly
                disabled
                required
              />

              <TextField
                label="category code"
                labelHi="वर्ग कोड"
                value={categoryCode}
                onChange={setCategoryCode}
                placeholder="name@company.com"
                icon={<Hash size={16} />}
                readOnly
                disabled
              />

              <TextField
                label="category Name"
                labelHi="श्रेणीचे नाव"
                value={categoryName}
                onChange={setCategoryName}
                placeholder="name@company.com"
                icon={<Landmark size={16} />}
                readOnly
                disabled
              />

              <TextField
                label="Employee Designation Code"
                labelHi="कर्मचारी पद कोड"
                value={designationCode}
                onChange={setDesignationCode}
                placeholder="name@company.com"
                icon={<FileText size={16} />}
                readOnly
                disabled
                required
                error={errors.designationCode}
              />

              <TextField
                label="Employee Designation Name"
                labelHi="कर्मचारी पद नाव"
                value={designationName}
                onChange={setDesignationName}
                placeholder="name@company.com"
                icon={<FileText size={16} />}
                readOnly
                disabled
                required
              />

              <DateField
                label="Join Date"
                labelHi="रुजू दिनांक"
                value={joinDate}
                onChange={setJoinDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.joinDate}
              />

              <DateField
                label="Confirmation Date"
                labelHi="कायम नियुक्ती दिनांक"
                value={confirmationDate}
                onChange={setConfirmationDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.confirmationDate}
              />
            </div>
          </div>

          {/* Suspension Details */}
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Image src={IMAGES.USER} alt="Suspension Details" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827] dark:text-slate-100">
                  Suspension Details
                  <span className="ml-2 font-normal text-[#64748B] dark:text-slate-400">/ निलंबन तपशील</span>
                </h3>
                <p className="mt-0.5 text-sm text-[#64748B] dark:text-slate-400">
                  Configure suspension grade, salary increment and approval information.
                  <br />
                  निलंबन श्रेणी, वेतनवाढ व मंजुरीची माहिती भरा.
                </p>
              </div>
            </div>

            <div className={grid4}>
              <DateField
                label="Suspension From Date"
                labelHi="निलंबन सुरू होण्याची तारीख"
                value={suspensionFromDate}
                onChange={setSuspensionFromDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.suspensionFromDate}
              />

              <DateField
                label="Suspension To Date"
                labelHi="निलंबन समाप्ती तारीख"
                value={suspensionToDate}
                onChange={setSuspensionToDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.suspensionToDate}
              />

              <SelectField
                label="Salary Type"
                labelHi="पगार प्रकार"
                value={salaryType}
                onChange={setSalaryType}
                options={salaryTypeOptions}
                placeholder="Select Type"
                required
              />

              <TextField
                label="Suspension Order No"
                labelHi="निलंबन आदेश क्रमांक"
                value={suspensionOrderNo}
                onChange={setSuspensionOrderNo}
                placeholder="Enter Amount"
                icon={<FileText size={16} />}
                required
              />

              <TextField
                label="Suspension Reason"
                labelHi="निलंबनाचे कारण"
                value={suspensionReason}
                onChange={setSuspensionReason}
                placeholder="Enter Amount"
                icon={<FileText size={16} />}
                required
                error={errors.suspensionReason}
              />
            </div>
          </div>
        </div>
      </FormModal>

      {isPickerOpen && (
        <PicklistModal
          title="Employee List"
          columns={employeeColumns}
          rows={MOCK_EMPLOYEES}
          rowKey={(r) => r.id}
          onSelect={(row) => {
            setEmployeeNo(row.employeeNo);
            setEmployeeName(row.name);
            setDesignationCode(row.designationCode);
            setDesignationName(row.designationName);
            setBranchCode(row.branchCode);
            setBranchName(row.branchName);
            setCategoryCode(row.categoryCode);
            setCategoryName(row.categoryName);
            setIsPickerOpen(false);
          }}
          onClose={() => setIsPickerOpen(false)}
        />
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Employee Suspension Saved Successfully"
          subtitle="The employee suspension record has been processed successfully."
        />
      )}
    </>
  );
}

/* ============================================================
   Card + Page
   ============================================================ */

type SuspensionMenuItem = { id: string; title: string; icon: string };

const SUSPENSION_ITEMS: SuspensionMenuItem[] = [
  {
    id: "employee-suspension",
    title: "Employee Suspension Information",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
];

function EmployeeSuspensionCard({
  item,
  onOpen,
}: {
  item: SuspensionMenuItem;
  onOpen?: (item: SuspensionMenuItem) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen?.(item);
      }}
      className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
        <Image src={item.icon} alt="" width={56} height={56} className="h-full w-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">
          {item.title}
        </h3>
        <p className="text-sm text-[#64748B] dark:text-slate-400">
          Configure employee suspension details
        </p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen?.(item);
        }}
        className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
      >
        Open <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function EmployeeSuspensionInformationPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUSPENSION_ITEMS;
    return SUSPENSION_ITEMS.filter((item) => item.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Employee Suspension Information"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Payroll", onClick: () => router.push("/payroll/master") },
          { label: "Employee Suspension", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        <AuthorizeHero title="Employee Suspension Information" query={query} onQueryChange={setQuery} />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          {filteredItems.map((item) => (
            <EmployeeSuspensionCard key={item.id} item={item} onOpen={(i) => setActiveModal(i.id)} />
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">
              No suspension records found.
            </p>
          )}
        </div>
      </div>

      <EmployeeSuspensionModal
        open={activeModal === "employee-suspension"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}