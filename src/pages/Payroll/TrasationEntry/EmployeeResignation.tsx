import { IMAGES } from "@/assets";
import { useState, useMemo } from "react";
import { User, Hash, FileText, Landmark, Building, ClipboardList, X, Check, ChevronRight, FileOutput } from "lucide-react";
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

/* ============================================================
   Mock Data
   ============================================================ */

interface EmployeeLookup {
  id: string;
  employeeNo: string;
  name: string;
  designationCode: string;
  designationName: string;
  branchCode: string;
  branchName: string;
}

const MOCK_EMPLOYEES: EmployeeLookup[] = [
  { id: "1", employeeNo: "EMP001", name: "Rahul Sharma", designationCode: "MGR", designationName: "Manager", branchCode: "BR01", branchName: "Main Branch" },
  { id: "2", employeeNo: "EMP002", name: "Priya Patel", designationCode: "SRD", designationName: "Senior Developer", branchCode: "BR02", branchName: "City Branch" },
];

/* ============================================================
   Employee Resignation Modal
   ============================================================ */

interface EmployeeResignationModalProps {
  open: boolean;
  onClose: () => void;
}

function EmployeeResignationModal({ open, onClose }: EmployeeResignationModalProps) {
  const [recordType, setRecordType] = useState("New");
  const [resignationNo, setResignationNo] = useState("");
  const [trnDate, setTrnDate] = useState("");
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
  const [resignationDate, setResignationDate] = useState("");
  const [resignationReason, setResignationReason] = useState("");

  const [isEmployeePickerOpen, setIsEmployeePickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const validationRules = {
    recordType: required("Record Type is required"),
    resignationNo: required("Resignation No is required"),
    trnDate: required("Trn Date is required"),
    employeeNo: required("Employee No is required"),
    employeeName: required("Employee Name is required"),
    designationCode: required("Emp Designation Code is required"),
    branchCode: required("Branch Code is required"),
    joinDate: required("Join Date is required"),
    confirmationDate: required("Confirmation Date is required"),
    resignationDate: required("Resignation Date is required"),
    resignationReason: required("Resignation Reason is required"),
  };

  const handleValidate = () => {
    const formValues = {
      recordType,
      resignationNo,
      trnDate,
      employeeNo,
      employeeName,
      designationCode,
      branchCode,
      joinDate,
      confirmationDate,
      resignationDate,
      resignationReason,
    };
    const validationErrors = validateFields(formValues, validationRules);
    setErrors(validationErrors);
    if (isFormValid(validationErrors)) setIsValidated(true);
  };

  const handleGenerate = () => {
    if (!isValidated) return;
    // Generate the resignation acceptance letter.
  };

  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  const employeeColumns = [
    { key: "employeeNo", header: "Employee No." },
    { key: "name", header: "Employee Name" },
    { key: "designationCode", header: "Designation Code" },
    { key: "branchName", header: "Branch Name" },
  ];

  const recordTypeOptions = [
    { value: "New", label: "New" },
    { value: "Amendment", label: "Amendment" },
  ];

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Employee Resignation"
        titleHi="कर्मचारी पदोन्नती"
        subtitleEn="Manage employee promotion, salary grade, and transfer posting details."
        subtitleHi="कर्मचाऱ्यांची पदोन्नती, वेतन श्रेणी व बदलीची माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Employee Resignation" width={48} height={48} />
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
              onClick={handleGenerate}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated ? "bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer" : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Generate
              <FileOutput className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer" : "bg-slate-200 text-slate-400 cursor-not-allowed"
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
        <div className="p-1">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              <SelectField label="Record Type" value={recordType} onChange={setRecordType} options={recordTypeOptions} placeholder="Select Record Type" required error={errors.recordType} />
              <TextField label="Resignation No" value={resignationNo} onChange={setResignationNo} placeholder="Enter Amount" icon={<Hash size={16} />} required error={errors.resignationNo} />
              <DateField label="Trn Date" value={trnDate} onChange={setTrnDate} placeholder="व्यवहाराची तारीख" required error={errors.trnDate} />
              <PicklistField label="Employee No" value={employeeNo} onOpenPicklist={() => setIsEmployeePickerOpen(true)} placeholder="Enter Amount" required error={errors.employeeNo} />

              <TextField label="Employee Name" value={employeeName} onChange={setEmployeeName} placeholder="name@company.com" icon={<User size={16} />} required error={errors.employeeName} />
              <TextField label="Emp Designation Code" value={designationCode} onChange={setDesignationCode} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required error={errors.designationCode} />
              <TextField label="Employee Designation Name" value={designationName} onChange={setDesignationName} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required />
              <TextField label="Branch Code" value={branchCode} onChange={setBranchCode} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required error={errors.branchCode} />

              <TextField label="Branch Name" value={branchName} onChange={setBranchName} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required />
              <TextField label="category code" value={categoryCode} onChange={setCategoryCode} placeholder="name@company.com" icon={<Hash size={16} />} required />
              <TextField label="category Name" value={categoryName} onChange={setCategoryName} placeholder="name@company.com" icon={<Landmark size={16} />} required />
              <TextField label="Education" value={education} onChange={setEducation} placeholder="name@company.com" icon={<ClipboardList size={16} />} required />

              <DateField label="Join Date" value={joinDate} onChange={setJoinDate} required error={errors.joinDate} />
              <DateField label="Confirmation Date" value={confirmationDate} onChange={setConfirmationDate} placeholder="Enter Amount" required error={errors.confirmationDate} />
              <TextField label="Resignation Date" value={resignationDate} onChange={setResignationDate} placeholder="Enter Amount" icon={<FileText size={16} />} required error={errors.resignationDate} />

              {/* Assumes TextField exposes an optional `multiline` prop for a textarea render — add it there if not already present, following the same pattern as the read-only/disabled variants. */}
              <TextField
                label="Resignation Reason"
                value={resignationReason}
                onChange={setResignationReason}
                placeholder="Enter Amount"
                icon={<FileText size={16} />}
                required
                error={errors.resignationReason}
                // multiline
                // className="md:col-span-2 lg:col-span-4"
              />
            </div>
          </div>
        </div>
      </FormModal>

      {isEmployeePickerOpen && (
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
            setIsEmployeePickerOpen(false);
          }}
          onClose={() => setIsEmployeePickerOpen(false)}
            
        />
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Employee Resignation Saved Successfully"
          subtitle="The employee resignation record has been processed successfully in the core banking system."
        />
      )}
    </>
  );
}

/* ============================================================
   Card + Page
   ============================================================ */

type ResignationMenuItem = { id: string; title: string; icon: string };

const RESIGNATION_ITEMS: ResignationMenuItem[] = [
  { id: "employee-resignation", title: "Employee Resignation", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
];

function EmployeeResignationCard({ item, onOpen }: { item: ResignationMenuItem; onOpen?: (item: ResignationMenuItem) => void }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
        <Image src={item.icon} alt="" width={56} height={56} className="h-full w-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">{item.title}</h3>
        <p className="text-sm text-[#64748B] dark:text-slate-400">Configure employee resignation details</p>
      </div>
      <button
        type="button"
        onClick={() => onOpen?.(item)}
        className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
      >
        Open <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function EmployeeResignationPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESIGNATION_ITEMS;
    return RESIGNATION_ITEMS.filter((item) => item.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Employee Resignation"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Payroll", onClick: () => router.push("/payroll/master") },
          { label: "Employee Resignation", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        <AuthorizeHero title="Employee Resignation" query={query} onQueryChange={setQuery} />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          {filteredItems.map((item) => (
            <EmployeeResignationCard key={item.id} item={item} onOpen={(i) => setActiveModal(i.id)} />
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">No resignation records found.</p>
          )}
        </div>
      </div>

      <EmployeeResignationModal open={activeModal === "employee-resignation"} onClose={() => setActiveModal(null)} />
    </div>
  );
} 