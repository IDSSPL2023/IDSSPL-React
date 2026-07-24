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
  FileOutput,
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

/* ============================================================
   Mock Data
   ============================================================ */

interface EmployeeLookup {
  id: string;
  employeeId: string;
  name: string;
  designationCode: string;
  designationName: string;
}

const MOCK_EMPLOYEES: EmployeeLookup[] = [
  { id: "1", employeeId: "EMP001", name: "Rahul Sharma", designationCode: "MGR", designationName: "Manager" },
  { id: "2", employeeId: "EMP002", name: "Priya Patel", designationCode: "SRD", designationName: "Senior Developer" },
  { id: "3", employeeId: "EMP003", name: "Amit Kumar", designationCode: "ACC", designationName: "Accountant" },
];

/* ============================================================
   Employee Promotion Modal
   ============================================================ */

interface EmployeePromotionModalProps {
  open: boolean;
  onClose: () => void;
}

function EmployeePromotionModal({ open, onClose }: EmployeePromotionModalProps) {
  // Employee Details
  const [promotionId, setPromotionId] = useState("");
  const [promotionDate, setPromotionDate] = useState("");
  const [recordType, setRecordType] = useState("New");
  const [branch, setBranch] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [designationCode, setDesignationCode] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [education, setEducation] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [confirmationDate, setConfirmationDate] = useState("");
  const [basicInOldGrade, setBasicInOldGrade] = useState("");
  const [promotionCategory, setPromotionCategory] = useState("");

  // Promotion Details
  const [promotionCategory2, setPromotionCategory2] = useState("");
  const [incrementAmount, setIncrementAmount] = useState("");
  const [basicInNewGrade, setBasicInNewGrade] = useState("");
  const [promotionFrom, setPromotionFrom] = useState("");
  const [asPerDated, setAsPerDated] = useState("");
  const [approvalDate, setApprovalDate] = useState("");
  const [depositMobilization, setDepositMobilization] = useState("");
  const [recoveryOfDues, setRecoveryOfDues] = useState("");
  const [advance, setAdvance] = useState("");
  const [formationOfShgs, setFormationOfShgs] = useState("");

  // Transfer & Posting Details
  const [toBranch, setToBranch] = useState("");
  const [relievingDate, setRelievingDate] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [section, setSection] = useState("");
  const [designation, setDesignation] = useState("");

  const [isEmployeePickerOpen, setIsEmployeePickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const validationRules = {
    // promotionId: required("Promotion ID is required"),
    promotionDate: required("Promotion Date is required"),
    recordType: required("Record Type is required"),
    branch: required("Branch is required"),
    employeeId: required("Employee ID is required"),
    employeeName: required("Employee Name is required"),
    designationCode: required("Designation Code is required"),
    education: required("Education is required"),
    joinDate: required("Join Date is required"),
    confirmationDate: required("Confirmation Date is required"),
    basicInOldGrade: required("Basic in Old Grade is required"),
    promotionCategory: required("Promotion Category is required"),
  };

  const handleValidate = () => {
    const formValues = {
      promotionId,
      promotionDate,
      recordType,
      branch,
      employeeId,
      employeeName,
      designationCode,
      education,
      joinDate,
      confirmationDate,
      basicInOldGrade,
      promotionCategory,
    };
    const validationErrors = validateFields(formValues, validationRules);
    setErrors(validationErrors);
    if (isFormValid(validationErrors)) setIsValidated(true);
  };

  const handleGenerate = () => {
    if (!isValidated) return;
    // Generate promotion order/letter for core banking payroll flow.
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
    { key: "employeeId", header: "Employee ID" },
    { key: "name", header: "Employee Name" },
    { key: "designationCode", header: "Designation Code" },
    { key: "designationName", header: "Designation Name" },
  ];

  const recordTypeOptions = [
    { value: "New", label: "New" },
    { value: "Amendment", label: "Amendment" },
    { value: "Reversal", label: "Reversal" },
  ];

  const promotionCategoryOptions = [
    { value: "Regular", label: "Regular" },
    { value: "Special", label: "Special" },
    { value: "Time Bound", label: "Time Bound" },
  ];

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Employee Promotion"
        titleHi="कर्मचारी पदोन्नती"
        subtitleEn="Manage employee promotion, salary grade, and transfer posting details."
        subtitleHi="कर्मचाऱ्यांची पदोन्नती, वेतन श्रेणी व बदलीची माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Employee Promotion" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-6xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            {/* Validate: always enabled — the entry point that unlocks the rest */}
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>

            {/* Generate: DISABLED until isValidated === true (grey bg-slate-200, cursor-not-allowed) */}
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

            {/* Save: DISABLED until isValidated === true (grey bg-slate-200, cursor-not-allowed) */}
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

            {/* Cancel: always enabled */}
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
          {/* Employee Details — grid wrapper: white bg, rounded-20px, thin border on sides/bottom + blue 4px top border, soft shadow */}
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
                  Select the employee and review current employment information before processing the promotion.
                  <br />
                  पदोन्नती प्रक्रिया सुरू करण्यापूर्वी कर्मचाऱ्याची सद्यस्थिती माहिती तपासा.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              <TextField
                label="Promotion ID"
                value={promotionId}
                onChange={setPromotionId}
                placeholder="Enter Amount"
                icon={<Hash size={16} />}
                required
                error={errors.promotionId}
              />

              <DateField
                label="Promotion Date"
                value={promotionDate}
                onChange={setPromotionDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.promotionDate}
              />

              <SelectField
                label="Record Type"
                value={recordType}
                onChange={setRecordType}
                options={recordTypeOptions}
                placeholder="Select Record Type"
                required
                error={errors.recordType}
              />

              <TextField label="Branch" value={branch} onChange={setBranch} placeholder="name@company.com" icon={<Building size={16} />} required error={errors.branch} />

              <PicklistField
                label="Employee ID"
                value={employeeId}
                onOpenPicklist={() => setIsEmployeePickerOpen(true)}
                placeholder="Key No"
                required
                error={errors.employeeId}
              />
              <TextField label="Employee Name" value={employeeName} onChange={setEmployeeName} placeholder="name@company.com" icon={<User size={16} />} required error={errors.employeeName} />
              <TextField
                label="Employee Designation Code"
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
                value={designationName}
                onChange={setDesignationName}
                placeholder="name@company.com"
                icon={<FileText size={16} />}
                readOnly
                disabled
              />

              <TextField label="Education" value={education} onChange={setEducation} placeholder="name@company.com" icon={<ClipboardList size={16} />} required error={errors.education} />
              <DateField label="Join Date" value={joinDate} onChange={setJoinDate} placeholder="YYYY-MM-DD" required error={errors.joinDate} />
              <DateField label="Confirmation Date" value={confirmationDate} onChange={setConfirmationDate} placeholder="YYYY-MM-DD" required error={errors.confirmationDate} />
              <TextField label="Basic in Old Grade" value={basicInOldGrade} onChange={setBasicInOldGrade} placeholder="Enter Amount" icon={<Landmark size={16} />} required error={errors.basicInOldGrade} />

              <SelectField
                label="Promotion Category"
                value={promotionCategory}
                onChange={setPromotionCategory}
                options={promotionCategoryOptions}
                placeholder="Select Category"
                required
                error={errors.promotionCategory}
              />
            </div>
          </div>

          {/* Promotion Details */}
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Image src={IMAGES.USER} alt="Promotion Details" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827] dark:text-slate-100">
                  Promotion Details
                  <span className="ml-2 font-normal text-[#64748B] dark:text-slate-400">/ पदोन्नती तपशील</span>
                </h3>
                <p className="mt-0.5 text-sm text-[#64748B] dark:text-slate-400">
                  Configure promotion grade, salary increment, and approval information.
                  <br />
                  पदोन्नतीची श्रेणी, वेतनवाढ व मंजुरीची माहिती भरा.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              <SelectField label="Promotion Category" value={promotionCategory2} onChange={setPromotionCategory2} options={promotionCategoryOptions} placeholder="Select Category" required />
              <TextField label="Promotion Increment Amount" value={incrementAmount} onChange={setIncrementAmount} placeholder="Enter Amount" icon={<Landmark size={16} />} required />
              <TextField label="Basic in New Grade" value={basicInNewGrade} onChange={setBasicInNewGrade} placeholder="Enter Amount" icon={<Landmark size={16} />} required />
              <TextField label="Promotion From" value={promotionFrom} onChange={setPromotionFrom} placeholder="Enter Amount" icon={<FileText size={16} />} required />

              <TextField label="As Per Dated" value={asPerDated} onChange={setAsPerDated} placeholder="Key No" icon={<FileText size={16} />} required />
              <DateField label="Approval Date" value={approvalDate} onChange={setApprovalDate} placeholder="YYYY-MM-DD" required />
              <TextField label="Deposit Mobilization" value={depositMobilization} onChange={setDepositMobilization} placeholder="Enter Amount" icon={<Landmark size={16} />} required />
              <TextField label="Recovery of Dues" value={recoveryOfDues} onChange={setRecoveryOfDues} placeholder="Enter Amount" icon={<Landmark size={16} />} required />

              <TextField label="Advance" value={advance} onChange={setAdvance} placeholder="Enter Amount" icon={<Landmark size={16} />} required />
              <TextField label="Formation of SHGs" value={formationOfShgs} onChange={setFormationOfShgs} placeholder="Enter Amount" icon={<ClipboardList size={16} />} required />
            </div>
          </div>

          {/* Transfer & Posting Details */}
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Image src={IMAGES.USER} alt="Transfer & Posting Details" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827] dark:text-slate-100">
                  Transfer & Posting Details
                  <span className="ml-2 font-normal text-[#64748B] dark:text-slate-400">/ बदली व पदस्थापना तपशील</span>
                </h3>
                <p className="mt-0.5 text-sm text-[#64748B] dark:text-slate-400">
                  Assign the employee's new posting, department and designation after promotion.
                  <br />
                  पदोन्नतीनंतर कर्मचाऱ्याची नवीन शाखा, विभाग व पद निश्चित करा.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              <TextField label="To Branch" value={toBranch} onChange={setToBranch} placeholder="Enter Amount" icon={<Building size={16} />} required />
              <DateField label="Relieving Date" value={relievingDate} onChange={setRelievingDate} placeholder="YYYY-MM-DD" required />
              <DateField label="Joining Date" value={joiningDate} onChange={setJoiningDate} placeholder="YYYY-MM-DD" required />
              <TextField label="Section" value={section} onChange={setSection} placeholder="Enter Amount" icon={<ClipboardList size={16} />} required />
              <TextField label="Designation" value={designation} onChange={setDesignation} placeholder="Enter Amount" icon={<FileText size={16} />} required />
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
            setEmployeeId(row.employeeId);
            setEmployeeName(row.name);
            setDesignationCode(row.designationCode);
            setDesignationName(row.designationName);
            setIsEmployeePickerOpen(false);
          }}
          onClose={() => setIsEmployeePickerOpen(false)}
        />
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Employee Promotion Saved Successfully"
          subtitle="The employee promotion record has been processed successfully in the core banking system."
        />
      )}
    </>
  );
}

/* ============================================================
   Card + Page
   ============================================================ */

type PromotionMenuItem = { id: string; title: string; icon: string };

const PROMOTION_ITEMS: PromotionMenuItem[] = [
  { id: "employee-promotion", title: "Employee Promotion", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
];

function EmployeePromotionCard({ item, onOpen }: { item: PromotionMenuItem; onOpen?: (item: PromotionMenuItem) => void }) {
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
        <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">{item.title}</h3>
        <p className="text-sm text-[#64748B] dark:text-slate-400">Configure employee promotion details</p>
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

export default function EmployeePromotionPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROMOTION_ITEMS;
    return PROMOTION_ITEMS.filter((item) => item.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Employee Promotion"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Payroll", onClick: () => router.push("/payroll/master") },
          { label: "Employee Promotion", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        <AuthorizeHero title="Employee Promotion" query={query} onQueryChange={setQuery} />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          {filteredItems.map((item) => (
            <EmployeePromotionCard key={item.id} item={item} onOpen={(i) => setActiveModal(i.id)} />
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">No promotion records found.</p>
          )}
        </div>
      </div>

      <EmployeePromotionModal open={activeModal === "employee-promotion"} onClose={() => setActiveModal(null)} />
    </div>
  );
}